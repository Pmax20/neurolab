import { StepLimit, every, num, str } from './core';
import { nernst } from './membrane';
import type { ModelDef, SimResult } from './types';


// ---------------------------------------------------------------------------
// 1) Synaptische Übertragung als Kette: präsynaptisches AP → Ca²⁺ → Freisetzung → Spalt → Rezeptor → Antwort
// ---------------------------------------------------------------------------

export type Transmitter = 'glutamat' | 'gaba' | 'ach_nmj';

export const TRANSMITTERS: Record<Transmitter, { label: string; receptor: string; Erev: number; termination: string; kEnz: number; kUptake: number; kDiff: number; gMax: number; thr: number; EL: number; tauRec: number }> = {
  glutamat: { label: 'Glutamat (ZNS)', receptor: 'AMPA-Rezeptor (ligandengesteuerter Kationenkanal)', Erev: 0, termination: 'Wiederaufnahme durch Transporter in Neurone und Astrozyten sowie Diffusion', kEnz: 0, kUptake: 1.0, kDiff: 0.5, gMax: 0.004, thr: -50, EL: -70, tauRec: 1.5 },
  gaba: { label: 'GABA (ZNS)', receptor: 'GABA_A-Rezeptor (ligandengesteuerter Cl⁻-Kanal)', Erev: -75, termination: 'Wiederaufnahme durch GABA-Transporter sowie Diffusion', kEnz: 0, kUptake: 0.8, kDiff: 0.5, gMax: 0.006, thr: -50, EL: -70, tauRec: 4 },
  ach_nmj: { label: 'Acetylcholin (motorische Endplatte)', receptor: 'Nikotinischer Acetylcholinrezeptor (Kationenkanal)', Erev: 0, termination: 'Enzymatischer Abbau durch Acetylcholinesterase in der synaptischen Basallamina, zusätzlich Diffusion', kEnz: 6, kUptake: 0, kDiff: 0.3, gMax: 0.05, thr: -55, EL: -85, tauRec: 1 },
};

export interface TransmissionOpts {
  transmitter: Transmitter;
  Cao: number; // mmol/l
  caBlock: number; // 0..1 Anteil blockierter präsyn. Ca²⁺-Kanäle
  vesicles: number; // verfügbarer Vesikelpool (Anzahl)
  quantum: number; // relative Transmittermenge pro Vesikel
  termFactor: number; // Faktor auf die Signalbeendigung (z. B. <1 = gehemmt)
  receptorBlock: number; // 0..1 Anteil blockierter Rezeptoren (kompetitiver Antagonist, Lehrmodell)
  Erev?: number;
  tMax: number;
}

export function simulateTransmission(o: TransmissionOpts) {
  const tr = TRANSMITTERS[o.transmitter];
  const dt = 0.005;
  const steps = Math.round(o.tMax / dt);
  const lim = new StepLimit(2_000_000);
  // präsynaptisches AP als feste Spannungsschablone (aus HH-ähnlicher Form)
  const apT = 1;
  const vPre = (t: number) => {
    const x = t - apT;
    if (x < 0) return -65;
    return -65 + 105 * Math.exp(-((x - 0.5) ** 2) / 0.08) - 10 * Math.exp(-((x - 1.6) ** 2) / 0.6) * (x > 0.6 ? 1 : 0);
  };
  const ECa = nernst(2, o.Cao, 0.0001, 37);
  let mCa = 0;
  let Ca = 0.0001; // mmol/l in der aktiven Zone (Mikrodomäne, relativ)
  let released = 0;
  let pool = o.vesicles;
  let T = 0; // Transmitter im Spalt (relative Einheiten)
  let Rr = 0; // Anteil gebundener (aktiver) Rezeptoren
  const Erev = o.Erev ?? tr.Erev;
  let V = tr.EL;
  const gL = 0.1; // mS/cm²
  const kTerm = (tr.kEnz + tr.kUptake) * o.termFactor + tr.kDiff;
  const out = { t: [] as number[], vPre: [] as number[], mCa: [] as number[], Ca: [] as number[], rel: [] as number[], T: [] as number[], R: [] as number[], V: [] as number[] };
  let maxV = V;
  let minV = V;
  let thrCross = false;
  let thrT: number | null = null;
  for (let i = 0; i <= steps; i++) {
    lim.tick();
    const t = i * dt;
    const vp = vPre(t);
    // Ca²⁺-Kanal-Aktivierung (erste Ordnung, spannungsabhängig)
    const mInf = 1 / (1 + Math.exp(-(vp + 20) / 6));
    mCa += (dt * (mInf - mCa)) / 0.25;
    const ICa = (1 - o.caBlock) * mCa * Math.max(0, ECa - vp) * (o.Cao / 2); // treibende Kraft × Verfügbarkeit
    Ca += dt * (ICa * 0.0008 - (Ca - 0.0001) / 0.6);
    // Kooperative Ca²⁺-Abhängigkeit der Freisetzung (Hill-Koeffizient 4, Dodge & Rahamimoff)
    const K = 0.02;
    const hill = Ca ** 4 / (Ca ** 4 + K ** 4);
    const dRel = dt * 4 * hill * pool;
    pool -= dRel;
    released += dRel;
    T += dRel * o.quantum - dt * kTerm * T;
    // Rezeptorbindung: nur der nicht blockierte Anteil steht zur Verfügung
    const avail = 1 - o.receptorBlock;
    Rr += dt * (2 * T * (avail - Rr) - Rr / tr.tauRec);
    Rr = Math.max(0, Math.min(avail, Rr));
    const gSyn = tr.gMax * Rr * 10;
    V += dt * (-gL * (V - tr.EL) - gSyn * (V - Erev));
    if (V > maxV) maxV = V;
    if (V < minV) minV = V;
    if (!thrCross && V >= tr.thr) {
      thrCross = true;
      thrT = t;
    }
    if (i % 4 === 0) {
      out.t.push(t);
      out.vPre.push(vp);
      out.mCa.push(mCa);
      out.Ca.push(Ca * 1000); // µmol/l
      out.rel.push(released);
      out.T.push(T);
      out.R.push(Rr);
      out.V.push(V);
    }
  }
  const amplitude = maxV - tr.EL >= tr.EL - minV ? maxV - tr.EL : minV - tr.EL;
  return { out, released, maxV, thrCross, thrT, amplitude, tr, ECa, Erev };
}

function transmissionResult(o: TransmissionOpts, nmj: boolean): SimResult {
  const r = simulateTransmission(o);
  const ref = simulateTransmission({ ...o, Cao: nmj ? 2 : 2, caBlock: 0, termFactor: 1, receptorBlock: 0, quantum: 1, vesicles: nmj ? 200 : 20, Erev: undefined });
  const tr = r.tr;
  const safety = Math.max(0, r.amplitude) / (tr.thr - tr.EL);
  const warnings: string[] = [];
  if (o.termFactor < 0.5) warnings.push('Die Signalbeendigung ist stark gehemmt: Der Transmitter bleibt länger im Spalt.');
  const ev = [{ t: 1, label: 'Aktionspotenzial erreicht die Endigung' }];
  if (r.thrT !== null) ev.push({ t: r.thrT, label: nmj ? 'Schwelle der Muskelmembran erreicht → Muskelaktionspotenzial' : 'Schwelle erreicht' });
  return {
    ok: true,
    warnings,
    events: ev,
    scalars: {
      released: { label: 'Freigesetzte Vesikel (Erwartungswert)', value: r.released, unit: '', digits: 1 },
      amp: { label: nmj ? 'Amplitude des Endplattenpotenzials' : 'Amplitude des postsynaptischen Potenzials', value: r.amplitude, unit: 'mV', digits: 1 },
      thr: { label: nmj ? 'Muskelaktionspotenzial ausgelöst' : 'Schwelle erreicht', value: r.thrCross ? 'ja' : 'nein', unit: '' },
      safety: { label: 'Sicherheitsfaktor (Amplitude / nötige Depolarisation)', value: safety, unit: '', digits: 2 },
      ECa: { label: 'E_Ca (präsynaptisch)', value: r.ECa, unit: 'mV', digits: 0 },
      Erev: { label: 'Umkehrpotenzial des Rezeptorkanals', value: r.Erev, unit: 'mV', digits: 0 },
      term: { label: 'Signalbeendigung', value: tr.termination, unit: '' },
    },
    frames: { t: r.out.t, data: { vPre: r.out.vPre, mCa: r.out.mCa, Ca: r.out.Ca, rel: r.out.rel, T: r.out.T, R: r.out.R, V: r.out.V } },
    charts: [
      {
        id: 'pre', title: 'Präsynaptisch: Ca²⁺-Einstrom und Freisetzung', x: r.out.t, xLabel: 'Zeit', xUnit: 'ms', yLabel: 'normiert', yUnit: '0–1', yMin: 0, yMax: 1.05,
        series: [
          { key: 'mCa', label: 'Offene Ca²⁺-Kanäle (Anteil)', y: r.out.mCa },
          { key: 'Ca', label: 'Ca²⁺ in der aktiven Zone (normiert)', y: norm(r.out.Ca), dash: '6 3' },
          { key: 'rel', label: 'Kumulative Freisetzung (normiert auf Pool)', y: r.out.rel.map((v) => v / o.vesicles), dash: '2 3' },
        ],
        description: 'Die Ca²⁺-Kanäle öffnen während des präsynaptischen Aktionspotenzials. Die Freisetzung folgt der Ca²⁺-Konzentration mit starker (kooperativer) Abhängigkeit.',
      },
      {
        id: 'cleft', title: 'Spalt und Rezeptoren', x: r.out.t, xLabel: 'Zeit', xUnit: 'ms', yLabel: 'relativ', yUnit: '', yMin: 0,
        series: [
          { key: 'T', label: 'Transmitter im Spalt (relativ)', y: norm(r.out.T, Math.max(...ref.out.T)) },
          { key: 'R', label: 'Aktivierte Rezeptoren (Anteil)', y: r.out.R, dash: '6 3' },
          { key: 'Tref', label: 'Referenz: Transmitter', y: norm(ref.out.T), dash: '2 3' },
        ],
        description: 'Die Transmitterkonzentration steigt kurz an und fällt durch die Signalbeendigung wieder ab. Die Rezeptoraktivierung folgt verzögert.',
      },
      {
        id: 'post', title: nmj ? 'Endplattenpotenzial' : 'Postsynaptisches Potenzial', x: r.out.t, xLabel: 'Zeit', xUnit: 'ms', yLabel: 'Membranpotenzial', yUnit: 'mV',
        series: [
          { key: 'V', label: 'Postsynaptisches Membranpotenzial', y: r.out.V },
          { key: 'Vref', label: 'Referenz', y: ref.out.V, dash: '5 4' },
        ],
        hlines: [{ y: tr.thr, label: 'Schwelle' }, { y: tr.EL, label: 'Ruhe' }],
        description: `Das Membranpotenzial ändert sich um ${r.amplitude.toFixed(1)} mV. ${nmj ? (r.thrCross ? 'Die Schwelle der Muskelmembran wird überschritten.' : 'Die Schwelle wird nicht erreicht.') : ''} Hinweis: Nach Erreichen der Schwelle wird das eigentliche Aktionspotenzial hier nicht berechnet.`,
      },
    ],
  };
}

function norm(a: number[], m?: number) {
  const mx = m ?? Math.max(...a);
  return mx > 0 ? a.map((v) => v / mx) : a.map(() => 0);
}

const commonOmitted = ['Stochastische Freisetzung einzelner Quanten', 'Rezeptordesensitisierung', 'Vesikelrecycling', 'Präsynaptische Rückkopplung', 'Räumliche Struktur des Spalts'];

export const synapseModel: ModelDef = {
  id: 'chemische-synapse',
  version: '1.0.0',
  title: 'Chemische Synapse: vom präsynaptischen Aktionspotenzial zur postsynaptischen Antwort',
  module: 'neuro',
  purpose: 'Die einzelnen Schritte der synaptischen Übertragung und ihre Abhängigkeiten untersuchen.',
  process: 'Ca²⁺-abhängige Exozytose, Diffusion, Rezeptorbindung, postsynaptische Antwort und Signalbeendigung.',
  equations: [
    'dm_Ca/dt = (m∞(V_prä) − m_Ca)/τ_m',
    'd[Ca]/dt = k·I_Ca − ([Ca] − [Ca]_Ruhe)/τ_Ca',
    'Freisetzungsrate = k_rel · [Ca]⁴/([Ca]⁴ + K⁴) · Vesikelpool',
    'd[T]/dt = q·Freisetzungsrate − (k_Enzym + k_Aufnahme + k_Diffusion)·[T]',
    'dR/dt = k_on·[T]·(R_verfügbar − R) − R/τ_R',
    'C·dV/dt = −g_L(V − E_L) − g_syn·R·(V − E_rev)',
  ],
  params: [
    { key: 'tr', label: 'Transmitter-/Rezeptorsystem', unit: '', type: 'select', default: 'glutamat', options: [
      { value: 'glutamat', label: 'Glutamat → AMPA (erregend)' },
      { value: 'gaba', label: 'GABA → GABA_A (Cl⁻-Kanal)' },
    ], description: 'Bestimmt Umkehrpotenzial und Art der Signalbeendigung.' },
    { key: 'Cao', label: '[Ca²⁺] extrazellulär', unit: 'mmol/l', min: 0.1, max: 6, step: 0.1, default: 2, description: 'Weniger extrazelluläres Ca²⁺ → geringerer Einstrom → stark verringerte Freisetzung (kooperativ).' },
    { key: 'caBlock', label: 'Blockierte präsynaptische Ca²⁺-Kanäle', unit: 'Anteil', min: 0, max: 1, step: 0.05, default: 0, description: 'Anteil nicht verfügbarer spannungsabhängiger Ca²⁺-Kanäle.' },
    { key: 'vesicles', label: 'Freisetzbarer Vesikelpool', unit: 'Vesikel', min: 1, max: 100, step: 1, default: 20, description: 'Anzahl sofort freisetzbarer Vesikel.' },
    { key: 'termFactor', label: 'Effizienz der Signalbeendigung', unit: '×', min: 0.05, max: 3, step: 0.05, default: 1, description: '<1: Wiederaufnahme bzw. Abbau gehemmt.' },
    { key: 'receptorBlock', label: 'Blockierte Rezeptoren', unit: 'Anteil', min: 0, max: 1, step: 0.05, default: 0, description: 'Anteil durch einen Antagonisten besetzter Rezeptoren (Lehrmodell).' },
    { key: 'ECl', label: 'E_Cl (nur GABA)', unit: 'mV', min: -90, max: -30, step: 1, default: -75, description: 'Hängt von der intrazellulären Cl⁻-Konzentration ab.', advanced: true },
  ],
  initialConditions: 'Postsynaptische Membran in Ruhe bei −70 mV, kein Transmitter im Spalt.',
  included: ['Spannungsabhängige Ca²⁺-Kanäle', 'Kooperative Ca²⁺-Abhängigkeit der Freisetzung', 'Diffusion und transmitterspezifische Beendigung', 'Rezeptorbindung', 'Postsynaptisches Potenzial'],
  omitted: commonOmitted,
  assumptions: ['Mittelwerte statt einzelner Vesikel', 'Präsynaptisches Aktionspotenzial als feste Spannungsschablone', 'Kinetik relativ, nicht an einer bestimmten Synapse geeicht'],
  limits: ['Zeitkonstanten sind didaktisch gewählt.', 'Die Konzentrationen im Spalt sind relative Einheiten.'],
  qualitativeOnly: ['Absolute Amplituden', 'Zeitverläufe'],
  modelType: 'vereinfacht',
  sources: [{ id: 'dodge' }, { id: 'kandel', locator: 'Kap. „Transmitter Release“ und „Synaptic Integration in the CNS“' }, { id: 'boron', locator: 'Kap. „Synaptic Transmission“' }],
  status: 'zu_pruefen',
  reviewNote: 'Didaktisches Kettenmodell; fachliche Prüfung ausstehend.',
  references: [
    { name: 'Referenz', params: {}, expectation: 'Erregendes postsynaptisches Potenzial von einigen mV.' },
    { name: 'Niedriges Ca²⁺', params: { Cao: 0.5 }, expectation: 'Deutlich überproportional kleinere Freisetzung.' },
  ],
  run(p) {
    const tr = str(p, 'tr') as Transmitter;
    return transmissionResult(
      { transmitter: tr, Cao: num(p, 'Cao'), caBlock: num(p, 'caBlock'), vesicles: num(p, 'vesicles'), quantum: 1, termFactor: num(p, 'termFactor'), receptorBlock: num(p, 'receptorBlock'), Erev: tr === 'gaba' ? num(p, 'ECl') : undefined, tMax: 25 },
      false,
    );
  },
};

export const nmjModel: ModelDef = {
  ...synapseModel,
  id: 'endplatte',
  title: 'Neuromuskuläre Endplatte: Acetylcholin und Endplattenpotenzial',
  purpose: 'Übertragung vom motorischen Neuron auf die Skelettmuskelfaser untersuchen, inklusive Acetylcholinesterase und Sicherheitsfaktor.',
  process: 'Ca²⁺-abhängige ACh-Freisetzung, Bindung an nikotinische Rezeptoren, Endplattenpotenzial, Auslösung des Muskelaktionspotenzials.',
  params: [
    { key: 'Cao', label: '[Ca²⁺] extrazellulär', unit: 'mmol/l', min: 0.1, max: 6, step: 0.1, default: 2, description: 'Beeinflusst die ACh-Freisetzung kooperativ.' },
    { key: 'caBlock', label: 'Blockierte präsynaptische Ca²⁺-Kanäle', unit: 'Anteil', min: 0, max: 1, step: 0.05, default: 0, description: 'Lehrmodell für eine gestörte Ca²⁺-Kanal-Funktion (fiktiver Lehrfall).' },
    { key: 'vesicles', label: 'Freisetzbarer Vesikelpool', unit: 'Vesikel', min: 10, max: 400, step: 10, default: 200, description: 'An der Endplatte werden pro Aktionspotenzial viele Vesikel freigesetzt.' },
    { key: 'achePct', label: 'Aktivität der Acetylcholinesterase', unit: '%', min: 2, max: 150, step: 1, default: 100, description: 'Hemmung → ACh bleibt länger im Spalt (verlängertes Endplattenpotenzial).' },
    { key: 'receptorBlock', label: 'Blockierte nikotinische Rezeptoren', unit: 'Anteil', min: 0, max: 1, step: 0.05, default: 0, description: 'Kompetitiver Antagonist (Lehrmodell, keine Dosisangabe).' },
  ],
  equations: synapseModel.equations.map((e) => e.replace('k_Aufnahme', 'k_AChE')),
  included: ['ACh-Freisetzung', 'Abbau durch Acetylcholinesterase', 'Nikotinischer Rezeptor (Kationenkanal, E_rev ≈ 0 mV)', 'Endplattenpotenzial und Schwelle der Muskelmembran'],
  omitted: [...commonOmitted, 'Muskelaktionspotenzial selbst (siehe Erregungs-Kontraktions-Kopplung)', 'Ausbreitung ins T-Tubulus-System (nur als Ereignis)'],
  sources: [{ id: 'dodge' }, { id: 'kandel', locator: 'Kap. „Signaling at the Nerve-Muscle Synapse“' }, { id: 'guyton', locator: 'Kap. „Neuromuscular Transmission“' }],
  references: [
    { name: 'Referenz', params: {}, expectation: 'Endplattenpotenzial überschreitet die Schwelle deutlich (Sicherheitsfaktor > 1).' },
    { name: 'Rezeptorblock 80 %', params: { receptorBlock: 0.8 }, expectation: 'Endplattenpotenzial unterschwellig.' },
    { name: 'AChE gehemmt', params: { achePct: 10 }, expectation: 'Längeres Endplattenpotenzial.' },
  ],
  run(p) {
    return transmissionResult(
      { transmitter: 'ach_nmj', Cao: num(p, 'Cao'), caBlock: num(p, 'caBlock'), vesicles: num(p, 'vesicles'), quantum: 1, termFactor: num(p, 'achePct') / 100, receptorBlock: num(p, 'receptorBlock'), tMax: 20 },
      true,
    );
  },
};

// ---------------------------------------------------------------------------
// 2) Integration postsynaptischer Potenziale (EPSP/IPSP, Summation)
// ---------------------------------------------------------------------------

export interface PSPInput {
  type: 'exc' | 'inh';
  t: number; // ms
  weight: number; // relative max. Leitfähigkeit
  distance: number; // 0..1 (0 = nahe am Initialsegment)
}

export const PSP_GAIN = { exc: 0.05, inh: 0.4 };

export function simulatePSP(inputs: PSPInput[], o: { EL: number; Eexc: number; Einh: number; thr: number; lambda: number; tMax: number }) {
  const dt = 0.02;
  const C = 1;
  const gL = 0.1;
  const steps = Math.round(o.tMax / dt);
  let V = o.EL;
  const out = { t: [] as number[], V: [] as number[], gE: [] as number[], gI: [] as number[], Iexc: [] as number[], Iinh: [] as number[] };
  const spikes: number[] = [];
  let refractUntil = -1;
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    let gE = 0;
    let gI = 0;
    for (const inp of inputs) {
      const x = t - inp.t;
      if (x <= 0) continue;
      const tau = inp.type === 'exc' ? 2 : 6;
      const gain = inp.type === 'exc' ? PSP_GAIN.exc : PSP_GAIN.inh;
      const g = inp.weight * (x / tau) * Math.exp(1 - x / tau) * Math.exp(-inp.distance / o.lambda) * gain;
      if (inp.type === 'exc') gE += g;
      else gI += g;
    }
    const Ie = gE * (V - o.Eexc);
    const Ii = gI * (V - o.Einh);
    out.t.push(t);
    out.V.push(V);
    out.gE.push(gE);
    out.gI.push(gI);
    out.Iexc.push(Ie);
    out.Iinh.push(Ii);
    if (t < refractUntil) {
      V += (dt * (-gL * (V - o.EL))) / C;
      continue;
    }
    V += (dt * (-gL * (V - o.EL) - Ie - Ii)) / C;
    if (V >= o.thr) {
      spikes.push(t);
      out.V[out.V.length - 1] = 30; // Markierung des Aktionspotenzials
      V = o.EL - 5;
      refractUntil = t + 3;
    }
  }
  return { out, spikes };
}

export const pspModel: ModelDef = {
  id: 'psp-integration',
  version: '1.0.0',
  title: 'EPSP, IPSP und Summation am Initialsegment',
  module: 'neuro',
  purpose: 'Untersuchen, wie erregende und hemmende Eingänge zeitlich und räumlich summiert werden und wann eine Schwelle erreicht wird.',
  process: 'Synaptische Integration an einem vereinfachten Neuron (Integrate-and-Fire-Modell).',
  equations: [
    'C·dV/dt = −g_L(V − E_L) − g_E(t)·(V − E_E) − g_I(t)·(V − E_I)',
    'g(t) = w · (t/τ)·e^(1 − t/τ) · e^(−d/λ)   (Alpha-Funktion, dendritische Abschwächung)',
    'Wenn V ≥ Schwelle: Aktionspotenzial (markiert), danach Rücksetzen und 3 ms Refraktärzeit',
  ],
  params: [
    { key: 'nExc', label: 'Anzahl erregender Eingänge', unit: '', min: 0, max: 6, step: 1, default: 2, description: 'Glutamaterge Synapsen (E_rev = 0 mV).' },
    { key: 'excW', label: 'Stärke je erregendem Eingang', unit: 'relativ', min: 0, max: 3, step: 0.05, default: 1, description: 'Maximale synaptische Leitfähigkeit.' },
    { key: 'excDt', label: 'Zeitlicher Abstand der erregenden Eingänge', unit: 'ms', min: 0, max: 20, step: 0.5, default: 5, description: '0 ms = gleichzeitig (räumliche Summation); größere Abstände: zeitliche Summation nimmt ab.' },
    { key: 'excDist', label: 'Entfernung der erregenden Synapsen vom Initialsegment', unit: 'relativ', min: 0, max: 2, step: 0.05, default: 0.3, description: 'Größere Entfernung → stärkere Abschwächung.' },
    { key: 'nInh', label: 'Anzahl hemmender Eingänge', unit: '', min: 0, max: 4, step: 1, default: 0, description: 'GABAerge Synapsen (Cl⁻-Kanal).' },
    { key: 'inhW', label: 'Stärke je hemmendem Eingang', unit: 'relativ', min: 0, max: 3, step: 0.05, default: 1, description: 'Maximale Leitfähigkeit.' },
    { key: 'inhT', label: 'Zeitpunkt der hemmenden Eingänge', unit: 'ms', min: 0, max: 30, step: 0.5, default: 4, description: 'Startzeit der hemmenden Synapsen.' },
    { key: 'EI', label: 'Umkehrpotenzial des hemmenden Kanals (E_Cl)', unit: 'mV', min: -90, max: -30, step: 1, default: -75, description: 'Liegt E_Cl nahe am Ruhepotenzial, wirkt der Cl⁻-Strom vor allem „kurzschließend“ (shunting); liegt es darüber, kann er depolarisieren.' },
    { key: 'thr', label: 'Schwelle am Initialsegment', unit: 'mV', min: -60, max: -40, step: 1, default: -55, description: 'Vereinfachte feste Schwelle des Integrate-and-Fire-Modells.' },
  ],
  initialConditions: 'V(0) = −70 mV; keine aktiven Synapsen.',
  included: ['Leitfähigkeitsbasierte Synapsen mit Umkehrpotenzial', 'Zeitliche und räumliche Summation', 'Dendritische Abschwächung', 'Kurzschlusshemmung (shunting inhibition)'],
  omitted: ['Aktive dendritische Leitfähigkeiten', 'NMDA-Rezeptoren', 'Kurzzeitplastizität', 'Detaillierte Aktionspotenzial-Kinetik'],
  assumptions: ['Ein einziges Kompartiment mit Abschwächungsfaktor statt echter Dendritengeometrie', 'Feste Schwelle'],
  limits: ['Kein Ersatz für ein Mehrkompartiment-Modell'],
  qualitativeOnly: ['Abschwächung mit der Entfernung'],
  modelType: 'vereinfacht',
  sources: [{ id: 'kandel', locator: 'Kap. „Synaptic Integration in the Central Nervous System“' }, { id: 'boron' }],
  status: 'zu_pruefen',
  reviewNote: 'Didaktisches Modell; fachliche Prüfung ausstehend.',
  references: [
    { name: 'Zwei Eingänge, 5 ms Abstand', params: {}, expectation: 'Unterschwellige Summation.' },
    { name: 'Vier gleichzeitige Eingänge', params: { nExc: 4, excDt: 0 }, expectation: 'Schwelle wird erreicht.' },
    { name: 'Kurzschlusshemmung', params: { nExc: 4, excDt: 0, nInh: 2, inhT: 0, EI: -70 }, expectation: 'Kaum Hyperpolarisation, aber die Erregung wird verhindert.' },
  ],
  run(p): SimResult {
    const inputs: PSPInput[] = [];
    for (let k = 0; k < num(p, 'nExc'); k++) inputs.push({ type: 'exc', t: 2 + k * num(p, 'excDt'), weight: num(p, 'excW'), distance: num(p, 'excDist') });
    for (let k = 0; k < num(p, 'nInh'); k++) inputs.push({ type: 'inh', t: 2 + num(p, 'inhT') + k * 0.5, weight: num(p, 'inhW'), distance: 0.1 });
    const o = { EL: -70, Eexc: 0, Einh: num(p, 'EI'), thr: num(p, 'thr'), lambda: 1, tMax: 50 };
    const r = simulatePSP(inputs, o);
    const single = simulatePSP([{ type: 'exc', t: 2, weight: num(p, 'excW'), distance: num(p, 'excDist') }], o);
    const ds = 5;
    const maxV = Math.max(...r.out.V.filter((v) => v < 29));
    const minV = Math.min(...r.out.V);
    const warnings: string[] = [];
    if (num(p, 'nInh') > 0 && num(p, 'EI') > -70) warnings.push(`E_Cl (${num(p, 'EI')} mV) liegt über dem Ruhepotenzial: Ein Cl⁻-Strom wirkt in Ruhe depolarisierend, kann aber unterhalb der Schwelle trotzdem hemmen.`);
    return {
      ok: true,
      warnings,
      events: [...inputs.map((i) => ({ t: i.t, label: i.type === 'exc' ? 'erregender Eingang' : 'hemmender Eingang' })), ...r.spikes.map((t) => ({ t, label: 'Aktionspotenzial' }))],
      scalars: {
        spikes: { label: 'Ausgelöste Aktionspotenziale', value: r.spikes.length, unit: '' },
        maxV: { label: 'Maximale Depolarisation (unterschwellig)', value: maxV, unit: 'mV', digits: 1 },
        minV: { label: 'Minimales Potenzial', value: minV, unit: 'mV', digits: 1 },
        dfI: { label: 'Triebkraft des hemmenden Kanals in Ruhe (V − E_Cl)', value: -70 - num(p, 'EI'), unit: 'mV', digits: 0 },
      },
      charts: [
        {
          id: 'v', title: 'Membranpotenzial am Initialsegment', x: every(r.out.t, ds), xLabel: 'Zeit', xUnit: 'ms', yLabel: 'Membranpotenzial', yUnit: 'mV', yMin: -90, yMax: 35,
          series: [
            { key: 'V', label: 'V_m (alle Eingänge)', y: every(r.out.V, ds) },
            { key: 'single', label: 'Referenz: ein einzelner erregender Eingang', y: every(single.out.V, ds), dash: '5 4' },
          ],
          hlines: [{ y: o.thr, label: 'Schwelle' }, { y: -70, label: 'Ruhe' }],
          description: `Das Potenzial erreicht maximal ${maxV.toFixed(1)} mV. ${r.spikes.length ? `Es werden ${r.spikes.length} Aktionspotenzial(e) ausgelöst (als Spitze bis +30 mV markiert).` : 'Die Schwelle wird nicht erreicht.'}`,
        },
        {
          id: 'g', title: 'Synaptische Leitfähigkeiten', x: every(r.out.t, ds), xLabel: 'Zeit', xUnit: 'ms', yLabel: 'Leitfähigkeit', yUnit: 'mS/cm² (relativ)', yMin: 0,
          series: [
            { key: 'gE', label: 'erregend (g_E)', y: every(r.out.gE, ds) },
            { key: 'gI', label: 'hemmend (g_I)', y: every(r.out.gI, ds), dash: '6 3' },
          ],
          description: 'Zeitverlauf der summierten synaptischen Leitfähigkeiten.',
        },
      ],
    };
  },
};
