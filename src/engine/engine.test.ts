import { describe, expect, test } from 'vitest';
import { MODELS, modelById } from './registry';
import { defaults, runModel, validateParams, withDefaults } from './core';
import { nernst, ghk, driveInfo } from './membrane';
import { simulateHH, HH_DEFAULT, countSpikes } from './hh';
import { solvePH, hendersonHasselbalch, bicarbonatePH, classifyBond, shells } from './chem';
import { mmRate } from './cell';
import { translate, transcribeFromCoding, glucoseYield, cleanDNA } from './biochem';
import { severinghaus, parallel, poiseuilleFactor } from './physio';

const run = (id: string, over: Record<string, unknown> = {}) => {
  const m = modelById(id)!;
  return runModel(m, { ...defaults(m), ...(over as any) });
};
const val = (r: any, k: string) => r.scalars[k].value as number;

describe('Modellbibliothek – allgemeine Anforderungen', () => {
  for (const m of MODELS) {
    test(`${m.id}: vollständig dokumentiert`, () => {
      expect(m.equations.length).toBeGreaterThan(0);
      expect(m.assumptions.length).toBeGreaterThan(0);
      expect(m.limits.length).toBeGreaterThan(0);
      expect(m.omitted.length).toBeGreaterThan(0);
      expect(m.sources.length).toBeGreaterThan(0);
      expect(m.references.length).toBeGreaterThan(0);
      for (const p of m.params) expect(p.description.length).toBeGreaterThan(5);
    });
    test(`${m.id}: Standardparameter laufen ohne Fehler`, () => {
      const r = runModel(m, defaults(m));
      expect(r.error).toBeUndefined();
      expect(r.ok).toBe(true);
      for (const c of r.charts) {
        expect(c.xLabel && c.xUnit !== undefined && c.yLabel).toBeTruthy();
        expect(c.description.length).toBeGreaterThan(10);
        for (const s of c.series) expect(s.y.length).toBe(c.x.length);
      }
    });
    test(`${m.id}: reproduzierbar`, () => {
      const a = runModel(m, defaults(m));
      const b = runModel(m, defaults(m));
      expect(JSON.stringify(a.scalars)).toBe(JSON.stringify(b.scalars));
    });
    test(`${m.id}: Referenzszenarien laufen`, () => {
      for (const ref of m.references) {
        const r = runModel(m, withDefaults(m, ref.params));
        expect(r.error).toBeUndefined();
      }
    });
    test(`${m.id}: ungültige Eingaben werden abgefangen`, () => {
      const num = m.params.find((p) => p.type === undefined || p.type === 'number') as any;
      if (!num) return;
      const r = runModel(m, { ...defaults(m), [num.key]: num.max + 1000 });
      expect(r.ok).toBe(false);
      expect(r.error).toMatch(/zwischen/);
      const r2 = runModel(m, { ...defaults(m), [num.key]: NaN });
      expect(r2.ok).toBe(false);
      expect(validateParams(m, { ...defaults(m), unbekannt: 1 }).length).toBe(1);
    });
    test(`${m.id}: Grenzwerte stabil`, () => {
      for (const p of m.params) {
        if (p.type === 'select' || p.type === 'bool') continue;
        for (const v of [p.min, p.max]) {
          const r = runModel(m, { ...defaults(m), [p.key]: v });
          // Entweder gültiges Ergebnis oder kontrollierte Fehlermeldung, nie ein Absturz
          expect(r.ok || typeof r.error === 'string').toBe(true);
        }
      }
    });
  }
});

describe('Membranpotenzial', () => {
  test('Nernst K⁺ bei 37 °C (4/140 mM) ≈ −95 mV', () => {
    expect(nernst(1, 4, 140, 37)).toBeCloseTo(-95.0, 0);
  });
  test('Nernst Ca²⁺ (z = 2) halbiert den Vorfaktor', () => {
    expect(nernst(2, 10, 1, 37)).toBeCloseTo(nernst(1, 10, 1, 37) / 2, 6);
  });
  test('GHK reduziert sich auf Nernst bei nur einer Permeabilität', () => {
    const c = { Na: [145, 12] as [number, number], K: [4, 140] as [number, number], Cl: [110, 10] as [number, number] };
    expect(ghk(c, { K: 1, Na: 0, Cl: 0 })).toBeCloseTo(nernst(1, 4, 140), 6);
  });
  test('Ruhepotenzial liegt zwischen E_K und E_Na, nahe E_K', () => {
    const r = run('ruhemembranpotenzial');
    expect(val(r, 'vm')).toBeGreaterThan(val(r, 'EK'));
    expect(val(r, 'vm')).toBeLessThan(-60);
  });
  test('Pumpenbeitrag ist hyperpolarisierend und klein', () => {
    const r = run('ruhemembranpotenzial');
    expect(val(r, 'pump')).toBeLessThan(0);
    expect(val(r, 'pump')).toBeGreaterThan(-15);
  });
  test('Erhöhtes extrazelluläres K⁺ depolarisiert', () => {
    expect(val(run('ruhemembranpotenzial', { Ko: 10 }), 'vm')).toBeGreaterThan(val(run('ruhemembranpotenzial'), 'vm'));
  });
  test('Richtungen: Na⁺ in Ruhe einwärts getrieben, K⁺ auswärts', () => {
    expect(driveInfo('Na', 145, 12, -70).netDirection).toBe('einwärts');
    expect(driveInfo('K', 4, 140, -70).netDirection).toBe('auswärts');
    expect(driveInfo('K', 4, 140, -70).electricDirection).toBe('einwärts');
    expect(driveInfo('K', 4, 140, -70).concDirection).toBe('auswärts');
    expect(driveInfo('Cl', 110, 10, -70).electricDirection).toBe('auswärts');
  });
});

describe('Hodgkin-Huxley', () => {
  test('überschwelliger Reiz → ein Aktionspotenzial mit Overshoot', () => {
    const r = run('aktionspotenzial');
    expect(val(r, 'spikes')).toBe(1);
    expect(val(r, 'peak')).toBeGreaterThan(20);
    expect(val(r, 'ahp')).toBeLessThan(-70); // Nachhyperpolarisation
  });
  test('unterschwelliger Reiz → kein Aktionspotenzial', () => {
    expect(val(run('aktionspotenzial', { stimAmp: 2 }), 'spikes')).toBe(0);
  });
  test('Alles-oder-nichts: Spitzenwert hängt kaum von der Reizstärke ab', () => {
    const a = val(run('aktionspotenzial', { stimAmp: 10 }), 'peak');
    const b = val(run('aktionspotenzial', { stimAmp: 30 }), 'peak');
    expect(Math.abs(a - b)).toBeLessThan(10);
  });
  test('reduzierte Na⁺-Leitfähigkeit verhindert das AP', () => {
    expect(val(run('aktionspotenzial', { gNa: 40 }), 'spikes')).toBe(0);
  });
  test('absolute Refraktärzeit', () => {
    expect(val(run('aktionspotenzial', { stim2Amp: 30, stim2Delay: 3 }), 'spikes')).toBe(1);
  });
  test('nach ausreichender Pause zweites AP möglich', () => {
    expect(val(run('aktionspotenzial', { stim2Amp: 30, stim2Delay: 15 }), 'spikes')).toBe(2);
  });
  test('Dauerdepolarisation inaktiviert Na⁺-Kanäle', () => {
    const r = run('aktionspotenzial', { V0: -50 });
    expect(val(r, 'h0')).toBeLessThan(0.2);
    expect(val(r, 'h0')).toBeLessThan(val(run('aktionspotenzial'), 'h0') / 3);
    expect(val(r, 'spikes')).toBe(0);
  });
  test('langsamere Inaktivierung verlängert das AP', () => {
    expect(val(run('aktionspotenzial', { hTau: 3 }), 'apd')).toBeGreaterThan(val(run('aktionspotenzial'), 'apd'));
  });
  test('Schrittweite: Ergebnis konvergiert (dt-Halbierung ändert Spitze < 1 mV)', () => {
    const a = simulateHH(HH_DEFAULT, [{ start: 1, dur: 1, amp: 10 }], 15, -65, 0.01);
    const b = simulateHH(HH_DEFAULT, [{ start: 1, dur: 1, amp: 10 }], 15, -65, 0.005);
    expect(Math.abs(Math.max(...a.V) - Math.max(...b.V))).toBeLessThan(1);
    expect(countSpikes(a.V)).toBe(countSpikes(b.V));
  });
  test('Phasen werden aus dem Verlauf erkannt', () => {
    const ids = run('aktionspotenzial').phases!.map((p) => p.id);
    for (const id of ['reiz', 'aufstrich', 'overshoot', 'repolarisation', 'nachhyperpolarisation']) expect(ids).toContain(id);
  });
});

describe('Erregungsleitung', () => {
  test('myelinisiert schneller als nicht myelinisiert', () => {
    expect(val(run('erregungsleitung'), 'v')).toBeGreaterThan(1.3 * val(run('erregungsleitung', { myelin: false }), 'v'));
  });
  test('größerer Durchmesser → schneller', () => {
    expect(val(run('erregungsleitung', { myelin: false, diam: 2 }), 'v')).toBeGreaterThan(val(run('erregungsleitung', { myelin: false }), 'v'));
  });
  test('Demyelinisierung führt zum Leitungsblock', () => {
    expect(run('erregungsleitung', { damage: 2 }).scalars.block.value).toBe('ja');
  });
});

describe('Synapsen', () => {
  test('Ca²⁺-Kooperativität: halbes Ca²⁺ → weniger als halbe Freisetzung', () => {
    const a = val(run('chemische-synapse'), 'released');
    const b = val(run('chemische-synapse', { Cao: 1 }), 'released');
    expect(b / a).toBeLessThan(0.5);
  });
  test('Ca²⁺-Kanalblock reduziert die Freisetzung', () => {
    expect(val(run('chemische-synapse', { caBlock: 0.8 }), 'released')).toBeLessThan(val(run('chemische-synapse'), 'released'));
  });
  test('GABA mit E_Cl unter V_Ruhe hyperpolarisiert', () => {
    expect(val(run('chemische-synapse', { tr: 'gaba', ECl: -80 }), 'amp')).toBeLessThan(0);
  });
  test('GABA mit E_Cl über V_Ruhe depolarisiert', () => {
    expect(val(run('chemische-synapse', { tr: 'gaba', ECl: -50 }), 'amp')).toBeGreaterThan(0);
  });
  test('Endplatte: Referenz überschwellig, Rezeptorblock 80 % unterschwellig', () => {
    expect(run('endplatte').scalars.thr.value).toBe('ja');
    expect(run('endplatte', { receptorBlock: 0.8 }).scalars.thr.value).toBe('nein');
    expect(val(run('endplatte'), 'safety')).toBeGreaterThan(1);
  });
  test('AChE-Hemmung vergrößert/verlängert das Endplattenpotenzial', () => {
    expect(val(run('endplatte', { achePct: 10 }), 'amp')).toBeGreaterThan(val(run('endplatte'), 'amp'));
  });
  test('Zeitliche Summation: enge Abstände summieren stärker', () => {
    expect(val(run('psp-integration', { nExc: 3, excDt: 1 }), 'maxV')).toBeGreaterThan(val(run('psp-integration', { nExc: 3, excDt: 15 }), 'maxV'));
  });
  test('Räumliche Summation: 4 gleichzeitige Eingänge erreichen die Schwelle', () => {
    expect(val(run('psp-integration', { nExc: 4, excDt: 0 }), 'spikes')).toBeGreaterThan(0);
  });
  test('Kurzschlusshemmung bei E_Cl = V_Ruhe verhindert das AP', () => {
    expect(val(run('psp-integration', { nExc: 4, excDt: 0, nInh: 2, inhT: 0, EI: -70 }), 'spikes')).toBe(0);
  });
});

describe('Muskel', () => {
  test('Tetanus > Einzelzuckung', () => {
    expect(val(run('querbrueckenzyklus', { freq: 60, nStim: 25 }), 'ratio')).toBeGreaterThan(2);
  });
  test('ohne ATP keine Relaxation (Rigor)', () => {
    expect(val(run('querbrueckenzyklus', { atp: 0 }), 'Fend')).toBeGreaterThan(0.2);
    expect(val(run('querbrueckenzyklus'), 'Fend')).toBeLessThan(0.02);
  });
  test('ohne Ca²⁺-Freisetzung keine Kraft', () => {
    expect(val(run('querbrueckenzyklus', { release: 0 }), 'Fmax')).toBeLessThan(0.01);
  });
});

describe('Zellbiologie', () => {
  test('Michaelis-Menten: v(K_m) = V_max/2', () => {
    expect(mmRate(2, 10, 2, 0, 1, 'keine')).toBeCloseTo(5, 10);
  });
  test('kompetitive Hemmung: V_max unverändert, K_m scheinbar erhöht', () => {
    const r = run('enzymkinetik', { inh: 'kompetitiv', I: 1, Ki: 1 });
    expect(val(r, 'Km')).toBeCloseTo(2, 6);
    expect(val(r, 'Vmax')).toBeCloseTo(val(run('enzymkinetik'), 'Vmax'), 6);
    expect(mmRate(1e6, 10, 1, 5, 1, 'kompetitiv')).toBeCloseTo(10, 1);
  });
  test('nichtkompetitive Hemmung: V_max sinkt, K_m bleibt', () => {
    const r = run('enzymkinetik', { inh: 'nichtkompetitiv', I: 1, Ki: 1 });
    expect(val(r, 'Km')).toBeCloseTo(1, 6);
    expect(val(r, 'Vmax')).toBeCloseTo(val(run('enzymkinetik'), 'Vmax') / 2, 6);
  });
  test('passive Transporte nie gegen den Gradienten', () => {
    for (const mode of ['diffusion', 'facilitated', 'channel']) expect(run('stofftransport', { mode }).scalars.against.value).toBe('nein');
  });
  test('aktive Transporte gegen den Gradienten; ohne ATP nicht', () => {
    expect(run('stofftransport', { mode: 'primary' }).scalars.against.value).toBe('ja');
    expect(run('stofftransport', { mode: 'secondary' }).scalars.against.value).toBe('ja');
    expect(run('stofftransport', { mode: 'primary', atp: false }).scalars.against.value).toBe('nein');
  });
  test('Osmose: hypoton schwillt, hyperton schrumpft, permeabler Stoff isoton', () => {
    expect(val(run('osmose', { osmOut: 150 }), 'Veq')).toBeGreaterThan(1);
    expect(val(run('osmose', { osmOut: 600 }), 'Veq')).toBeLessThan(1);
    expect(val(run('osmose', { osmOut: 290, osmPerm: 300 }), 'Veq')).toBeCloseTo(1, 6);
  });
  test('Genetischer Code und Translation', () => {
    const m = transcribeFromCoding(cleanDNA('ATG GCC TTT TAA').seq);
    expect(m).toBe('AUGGCCUUUUAA');
    const t = translate(m);
    expect(t.steps.map((s) => s.aa).join('')).toBe('MAF*');
    expect(t.stopped).toBe(true);
    expect(translate('GGGCCC').start).toBe(-1);
  });
  test('ATP-Bilanz je nach Konvention 30/32 bzw. 36/38', () => {
    expect(glucoseYield({ poNADH: 2.5, poFADH2: 1.5, shuttle: 'malat-aspartat' }).total).toBe(32);
    expect(glucoseYield({ poNADH: 2.5, poFADH2: 1.5, shuttle: 'glycerin-3-phosphat' }).total).toBe(30);
    expect(glucoseYield({ poNADH: 3, poFADH2: 2, shuttle: 'malat-aspartat' }).total).toBe(38);
    expect(glucoseYield({ poNADH: 3, poFADH2: 2, shuttle: 'glycerin-3-phosphat' }).total).toBe(36);
  });
});

describe('Chemie', () => {
  test('0,1 M HCl → pH 1', () => expect(solvePH({ cHA: 0, cA: 0, Ka: 1, strongAcid: 0.1, strongBase: 0 })).toBeCloseTo(1, 3));
  test('reines Wasser → pH 7', () => expect(solvePH({ cHA: 0, cA: 0, Ka: 1, strongAcid: 0, strongBase: 0 })).toBeCloseTo(7, 3));
  test('sehr verdünnte starke Säure: pH < 7, aber nicht 8 (Wasser-Autoprotolyse)', () => {
    const pH = solvePH({ cHA: 0, cA: 0, Ka: 1, strongAcid: 1e-8, strongBase: 0 });
    expect(pH).toBeLessThan(7);
    expect(pH).toBeGreaterThan(6.9);
  });
  test('0,1 M Essigsäure → pH ≈ 2,88', () => expect(solvePH({ cHA: 0.1, cA: 0, Ka: 10 ** -4.76, strongAcid: 0, strongBase: 0 })).toBeCloseTo(2.88, 1));
  test('Puffer 1:1 → pH = pK_a', () => {
    expect(solvePH({ cHA: 0.1, cA: 0.1, Ka: 10 ** -4.76, strongAcid: 0, strongBase: 0 })).toBeCloseTo(4.76, 2);
    expect(hendersonHasselbalch(4.76, 1, 1)).toBeCloseTo(4.76, 10);
  });
  test('Blut: HCO₃⁻ 24, pCO₂ 40 → pH ≈ 7,40', () => expect(bicarbonatePH(24, 40)).toBeCloseTo(7.4, 1));
  test('Bindungsklassifikation', () => {
    expect(classifyBond('Na', 'Cl')!.cls).toBe('überwiegend ionisch');
    expect(classifyBond('O', 'H')!.cls).toBe('polar kovalent');
    expect(classifyBond('O', 'H')!.partialNegative).toBe('O');
    expect(classifyBond('C', 'H')!.cls).toBe('unpolar kovalent');
  });
  test('Schalenmodell', () => {
    expect(shells(11)).toEqual([2, 8, 1]);
    expect(shells(10)).toEqual([2, 8]);
  });
});

describe('Physiologie', () => {
  test('Ruhekreislauf: HZV ≈ 4,9 l/min, MAD 85–100 mmHg', () => {
    const r = run('kreislauf');
    expect(val(r, 'CO')).toBeCloseTo(4.9, 2);
    expect(val(r, 'MAP')).toBeGreaterThan(85);
    expect(val(r, 'MAP')).toBeLessThan(100);
  });
  test('Summe der Organdurchblutungen = HZV', () => {
    const r = run('kreislauf', { rMuscle: 1.3 });
    const sum = Object.entries(r.scalars).filter(([k]) => k.startsWith('q_')).reduce((s, [, v]) => s + (v.value as number), 0);
    expect(sum).toBeCloseTo(val(r, 'CO'), 6);
  });
  test('Poiseuille: halber Radius → 16-facher Widerstand', () => expect(poiseuilleFactor(0.5, 1)).toBeCloseTo(16, 10));
  test('Parallelschaltung', () => expect(parallel([2, 2])).toBeCloseTo(1, 10));
  test('geringere Compliance → größere Amplitude', () => {
    expect(val(run('kreislauf', { C: 0.7 }), 'pp')).toBeGreaterThan(val(run('kreislauf'), 'pp'));
  });
  test('Atmung Ruhe: PACO₂ ≈ 41, PAO₂ ≈ 98 mmHg', () => {
    const r = run('atmung');
    expect(val(r, 'PACO2')).toBeCloseTo(41.1, 0);
    expect(val(r, 'PAO2')).toBeCloseTo(98.4, 0);
  });
  test('Halbierung der Ventilation verdoppelt pCO₂', () => {
    expect(val(run('atmung', { f: 6 }), 'PACO2')).toBeCloseTo(2 * val(run('atmung'), 'PACO2'), 6);
  });
  test('Severinghaus: P50 ≈ 26–27 mmHg, S(100) ≈ 97–98 %', () => {
    expect(severinghaus(26.8)).toBeCloseTo(0.5, 1);
    expect(severinghaus(100)).toBeGreaterThan(0.97);
  });
  test('VT ≤ VD wird kontrolliert abgefangen', () => {
    const r = run('atmung', { VT: 150, VD: 200 });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Totraum/);
  });
});
