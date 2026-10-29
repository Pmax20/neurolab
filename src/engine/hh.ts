import { StepLimit, every, num } from './core';
import type { ModelDef, SimResult } from './types';

// Hodgkin-Huxley-Modell (1952), Konvention: Ruhepotenzial ≈ −65 mV.
// Spannungen in mV, Zeit in ms, Leitfähigkeiten in mS/cm², Ströme in µA/cm², C in µF/cm².

export interface HHParams {
  gNa: number;
  gK: number;
  gL: number;
  ENa: number;
  EK: number;
  EL: number;
  C: number;
  /** Verschiebung der m-Aktivierungskurve (mV); positiv = Aktivierung erst bei positiveren Spannungen */
  mShift: number;
  /** Faktor auf alle Geschwindigkeiten (Temperatur-/Kinetikfaktor) */
  phi: number;
  /** Zeitfaktor der Na⁺-Inaktivierung (h): >1 = langsamer */
  hTau: number;
  /** Zeitfaktor der K⁺-Aktivierung (n): >1 = langsamer */
  nTau: number;
}

export const HH_DEFAULT: HHParams = { gNa: 120, gK: 36, gL: 0.3, ENa: 50, EK: -77, EL: -54.387, C: 1, mShift: 0, phi: 1, hTau: 1, nTau: 1 };

function vtrap(x: number, y: number) {
  // x / (exp(x/y) - 1) mit Grenzwert y bei x→0
  return Math.abs(x / y) < 1e-6 ? y * (1 - x / y / 2) : x / (Math.exp(x / y) - 1);
}

export const rates = {
  am: (V: number) => 0.1 * vtrap(-(V + 40), 10),
  bm: (V: number) => 4 * Math.exp(-(V + 65) / 18),
  ah: (V: number) => 0.07 * Math.exp(-(V + 65) / 20),
  bh: (V: number) => 1 / (1 + Math.exp(-(V + 35) / 10)),
  an: (V: number) => 0.01 * vtrap(-(V + 55), 10),
  bn: (V: number) => 0.125 * Math.exp(-(V + 65) / 80),
};

export function gateRates(V: number, P: HHParams) {
  const Vm = V - P.mShift;
  return {
    am: P.phi * rates.am(Vm),
    bm: P.phi * rates.bm(Vm),
    ah: (P.phi / P.hTau) * rates.ah(V),
    bh: (P.phi / P.hTau) * rates.bh(V),
    an: (P.phi / P.nTau) * rates.an(V),
    bn: (P.phi / P.nTau) * rates.bn(V),
  };
}

export function steadyGates(V: number, P: HHParams) {
  const r = gateRates(V, P);
  return { m: r.am / (r.am + r.bm), h: r.ah / (r.ah + r.bh), n: r.an / (r.an + r.bn) };
}

export function ionicCurrents(V: number, m: number, h: number, n: number, P: HHParams) {
  const gNa = P.gNa * m * m * m * h;
  const gK = P.gK * n * n * n * n;
  return { INa: gNa * (V - P.ENa), IK: gK * (V - P.EK), IL: P.gL * (V - P.EL), gNa, gK };
}

/** Exponentielles Euler-Verfahren für ein Gate (stabil, genau für lineare Gate-Kinetik) */
export function stepGate(x: number, a: number, b: number, dt: number) {
  const tau = 1 / (a + b);
  const inf = a * tau;
  return inf + (x - inf) * Math.exp(-dt / tau);
}

export interface Stimulus {
  start: number;
  dur: number;
  amp: number;
}

export interface HHRun {
  t: number[];
  V: number[];
  m: number[];
  h: number[];
  n: number[];
  INa: number[];
  IK: number[];
  IL: number[];
  gNa: number[];
  gK: number[];
  Istim: number[];
}

/** Integration eines Membranflecks (Raumklemmung). Feste Schrittweite → reproduzierbar, unabhängig von der Animation. */
export function simulateHH(P: HHParams, stims: Stimulus[], tMax: number, V0: number, dt = 0.01, holdToV0 = true): HHRun {
  const g0 = steadyGates(V0, P);
  let { m, h, n } = g0;
  let V = V0;
  // Haltestrom, der das Ausgangspotenzial stationär hält (wie eine Strominjektion im Experiment)
  const i0 = ionicCurrents(V0, m, h, n, P);
  const Ihold = holdToV0 ? i0.INa + i0.IK + i0.IL : 0;
  const steps = Math.round(tMax / dt);
  const lim = new StepLimit(2_000_000);
  const out: HHRun = { t: [], V: [], m: [], h: [], n: [], INa: [], IK: [], IL: [], gNa: [], gK: [], Istim: [] };
  for (let i = 0; i <= steps; i++) {
    lim.tick();
    const t = i * dt;
    let Is = 0;
    for (const s of stims) if (t >= s.start && t < s.start + s.dur) Is += s.amp;
    const I = ionicCurrents(V, m, h, n, P);
    out.t.push(t);
    out.V.push(V);
    out.m.push(m);
    out.h.push(h);
    out.n.push(n);
    out.INa.push(I.INa);
    out.IK.push(I.IK);
    out.IL.push(I.IL);
    out.gNa.push(I.gNa);
    out.gK.push(I.gK);
    out.Istim.push(Is);
    const r = gateRates(V, P);
    m = stepGate(m, r.am, r.bm, dt);
    h = stepGate(h, r.ah, r.bh, dt);
    n = stepGate(n, r.an, r.bn, dt);
    const I2 = ionicCurrents(V, m, h, n, P);
    V += (dt * (Is + Ihold - I2.INa - I2.IK - I2.IL)) / P.C;
    if (!Number.isFinite(V) || Math.abs(V) > 500) throw new Error('Membranpotenzial außerhalb des numerisch stabilen Bereichs.');
  }
  return out;
}

export type APPhase = 'ruhe' | 'reiz' | 'aufstrich' | 'overshoot' | 'repolarisation' | 'nachhyperpolarisation' | 'rueckkehr';

export const PHASE_LABEL: Record<APPhase, string> = {
  ruhe: 'Ruhepotenzial',
  reiz: 'Reiz und Depolarisation bis zur Schwelle',
  aufstrich: 'Aufstrich: schneller Na⁺-Einstrom',
  overshoot: 'Overshoot (Innenseite positiv)',
  repolarisation: 'Repolarisation: Na⁺-Inaktivierung, K⁺-Ausstrom',
  nachhyperpolarisation: 'Nachhyperpolarisation',
  rueckkehr: 'Rückkehr zum Ausgangszustand',
};

/** Phasen aus dem berechneten Verlauf ableiten (nicht vorgegeben!). */
export function detectPhases(run: HHRun, V0: number, stims: Stimulus[]) {
  const { t, V, INa, IK } = run;
  const labels: APPhase[] = new Array(t.length).fill('ruhe');
  const firstStim = stims.length ? Math.min(...stims.map((s) => s.start)) : Infinity;
  let peakIdx = 0;
  for (let i = 1; i < V.length; i++) if (V[i] > V[peakIdx]) peakIdx = i;
  const spiked = V[peakIdx] > 0;
  let state: APPhase = 'ruhe';
  let minAfter = Infinity;
  for (let i = 0; i < t.length; i++) {
    const v = V[i];
    if (state === 'ruhe' && t[i] >= firstStim) state = 'reiz';
    if (spiked) {
      // Aufstrich beginnt, sobald der Na⁺-Einstrom den K⁺- und Leckstrom übersteigt und V weiter steigt (regenerativ)
      if (state === 'reiz' && -INa[i] > IK[i] + run.IL[i] + 1 && v > V0 + 5) state = 'aufstrich';
      if (state === 'aufstrich' && v > 0) state = 'overshoot';
      if (state === 'overshoot' && i > peakIdx && v < 0) state = 'repolarisation';
      if (state === 'repolarisation' && v < V0 - 0.5) state = 'nachhyperpolarisation';
      if (state === 'nachhyperpolarisation') {
        minAfter = Math.min(minAfter, v);
        if (v > minAfter + 0.1 && v > V0 - 0.5) state = 'rueckkehr';
      }
      if (state === 'repolarisation' && i > peakIdx && v <= V0 + 0.5 && t[i] > t[peakIdx] + 4) state = 'rueckkehr';
    } else if (state === 'reiz' && t[i] > firstStim + 2 && Math.abs(v - V0) < 0.5) state = 'rueckkehr';
    labels[i] = state;
  }
  const phases: { from: number; to: number; id: APPhase; label: string }[] = [];
  let s = 0;
  for (let i = 1; i <= labels.length; i++) {
    if (i === labels.length || labels[i] !== labels[s]) {
      phases.push({ from: t[s], to: t[i - 1], id: labels[s], label: PHASE_LABEL[labels[s]] });
      s = i;
    }
  }
  return { phases, labels, spiked, peakIdx };
}

export function countSpikes(V: number[], thr = 0) {
  let c = 0;
  for (let i = 1; i < V.length; i++) if (V[i - 1] < thr && V[i] >= thr) c++;
  return c;
}

export const hhModel: ModelDef = {
  id: 'aktionspotenzial',
  version: '1.0.0',
  title: 'Aktionspotenzial (Hodgkin-Huxley-Modell)',
  module: 'neuro',
  purpose: 'Phasen des Aktionspotenzials, Kanalzustände, Schwelle und Refraktärität an einem quantitativen Modell untersuchen.',
  process: 'Aktionspotenzial an einem raumgeklemmten Membranfleck (keine Ausbreitung).',
  equations: [
    'C·dV/dt = I_Reiz + I_Halte − ḡ_Na·m³·h·(V − E_Na) − ḡ_K·n⁴·(V − E_K) − g_L·(V − E_L)',
    'dx/dt = α_x(V)·(1 − x) − β_x(V)·x   für x ∈ {m, h, n}',
    'α_m = 0,1·(V+40)/(1−e^(−(V+40)/10)), β_m = 4·e^(−(V+65)/18)',
    'α_h = 0,07·e^(−(V+65)/20), β_h = 1/(1+e^(−(V+35)/10))',
    'α_n = 0,01·(V+55)/(1−e^(−(V+55)/10)), β_n = 0,125·e^(−(V+65)/80)',
    'Numerik: exponentielles Euler-Verfahren, Δt = 0,01 ms (fest)',
  ],
  params: [
    { key: 'stimAmp', label: 'Reizstärke', unit: 'µA/cm²', min: 0, max: 50, step: 0.5, default: 10, description: 'Amplitude des Rechteck-Reizstroms.' },
    { key: 'stimDur', label: 'Reizdauer', unit: 'ms', min: 0.1, max: 10, step: 0.1, default: 1, description: 'Dauer des Reizes ab t = 1 ms.' },
    { key: 'V0', label: 'Ausgangsmembranpotenzial', unit: 'mV', min: -90, max: -40, step: 1, default: -65, description: 'Wird durch einen konstanten Haltestrom eingestellt. Dauerhafte Depolarisation inaktiviert Na⁺-Kanäle.' },
    { key: 'gNa', label: 'Maximale Na⁺-Leitfähigkeit ḡ_Na', unit: 'mS/cm²', min: 0, max: 240, step: 1, default: 120, description: 'Anzahl/Leitfähigkeit spannungsabhängiger Na⁺-Kanäle.' },
    { key: 'gK', label: 'Maximale K⁺-Leitfähigkeit ḡ_K', unit: 'mS/cm²', min: 0, max: 72, step: 0.5, default: 36, description: 'Spannungsabhängige (verzögerte) K⁺-Kanäle.' },
    { key: 'mShift', label: 'Verschiebung der Na⁺-Aktivierung (Schwellenparameter)', unit: 'mV', min: -15, max: 15, step: 0.5, default: 0, description: 'Positive Werte: Na⁺-Kanäle öffnen erst bei positiveren Spannungen → höhere Schwelle. Im HH-Modell gibt es keinen festen Schwellenwert; die Schwelle ergibt sich aus der Kanalkinetik.' , advanced: true },
    { key: 'hTau', label: 'Zeitfaktor Na⁺-Inaktivierung', unit: '×', min: 0.25, max: 10, step: 0.05, default: 1, description: '>1: Inaktivierung langsamer (verlängertes Aktionspotenzial).' , advanced: true },
    { key: 'nTau', label: 'Zeitfaktor K⁺-Aktivierung', unit: '×', min: 0.25, max: 5, step: 0.05, default: 1, description: '>1: K⁺-Kanäle öffnen langsamer.' , advanced: true },
    { key: 'phi', label: 'Kinetikfaktor (Temperatur)', unit: '×', min: 0.3, max: 5, step: 0.1, default: 1, description: 'Skaliert alle Übergangsraten (entspricht Q10-Temperatureffekt; 1 = 6,3 °C im Originalmodell).', advanced: true },
    { key: 'ENa', label: 'E_Na', unit: 'mV', min: 0, max: 80, step: 1, default: 50, description: 'Natrium-Gleichgewichtspotenzial.', advanced: true },
    { key: 'EK', label: 'E_K', unit: 'mV', min: -100, max: -50, step: 1, default: -77, description: 'Kalium-Gleichgewichtspotenzial.', advanced: true },
    { key: 'stim2Amp', label: '2. Reiz: Stärke', unit: 'µA/cm²', min: 0, max: 100, step: 0.5, default: 0, description: 'Zweiter Reiz zur Untersuchung der Refraktärperiode (0 = aus).' },
    { key: 'stim2Delay', label: '2. Reiz: Abstand', unit: 'ms', min: 1, max: 30, step: 0.5, default: 8, description: 'Zeitabstand zwischen Beginn des 1. und 2. Reizes.' },
    { key: 'tMax', label: 'Simulationsdauer', unit: 'ms', min: 5, max: 60, step: 1, default: 25, description: 'Länge des berechneten Zeitraums.', advanced: true },
  ],
  initialConditions: 'V(0) = Ausgangspotenzial; m, h, n im stationären Zustand bei V(0).',
  included: ['Spannungsabhängige Na⁺-Kanäle mit Aktivierung (m) und Inaktivierung (h)', 'Spannungsabhängige K⁺-Kanäle (n)', 'Leckstrom', 'Refraktärität als Folge der Kanalkinetik'],
  omitted: ['Ausbreitung entlang des Axons (siehe Erregungsleitung)', 'Na⁺/K⁺-ATPase und Konzentrationsänderungen', 'Weitere Kanaltypen (z. B. Ca²⁺-, A-Typ-K⁺-Kanäle)', 'Stochastisches Öffnen einzelner Kanäle'],
  assumptions: ['Raumklemmung (homogener Membranfleck)', 'Ionenkonzentrationen bleiben konstant', 'Originalparameter des Tintenfisch-Riesenaxons'],
  limits: ['Absolute Werte gelten für das HH-Modell und nicht exakt für menschliche Neurone.', 'Kinetik bezieht sich auf 6,3 °C; Säugerneurone sind schneller.'],
  qualitativeOnly: ['Schwellenwerte und Dauern im Vergleich zu Säugerzellen'],
  modelType: 'ausführlich',
  sources: [{ id: 'hh1952' }, { id: 'hille', locator: 'Kap. „Classical biophysics of the squid giant axon“' }, { id: 'kandel', locator: 'Kap. „Propagated Signaling: The Action Potential“' }],
  status: 'zu_pruefen',
  reviewNote: 'Gleichungen und Parameter nach Hodgkin & Huxley (1952) in moderner Vorzeichenkonvention; automatische Tests bestehen, fachliche Freigabe ausstehend.',
  references: [
    { name: 'Überschwelliger Reiz', params: {}, expectation: 'Ein Aktionspotenzial mit Spitze ≈ +40 mV und Nachhyperpolarisation.' },
    { name: 'Unterschwelliger Reiz', params: { stimAmp: 2 }, expectation: 'Kein Aktionspotenzial, nur passive Depolarisation.' },
    { name: 'Reduzierte Na⁺-Leitfähigkeit', params: { gNa: 40 }, expectation: 'Kein oder deutlich abgeschwächtes Aktionspotenzial.' },
    { name: 'Absolute Refraktärzeit', params: { stim2Amp: 30, stim2Delay: 3 }, expectation: 'Der zweite Reiz löst kein zweites Aktionspotenzial aus.' },
  ],
  run(p): SimResult {
    const P: HHParams = { ...HH_DEFAULT, gNa: num(p, 'gNa'), gK: num(p, 'gK'), ENa: num(p, 'ENa'), EK: num(p, 'EK'), mShift: num(p, 'mShift'), hTau: num(p, 'hTau'), nTau: num(p, 'nTau'), phi: num(p, 'phi') };
    const V0 = num(p, 'V0');
    const stims: Stimulus[] = [{ start: 1, dur: num(p, 'stimDur'), amp: num(p, 'stimAmp') }];
    if (num(p, 'stim2Amp') > 0) stims.push({ start: 1 + num(p, 'stim2Delay'), dur: num(p, 'stimDur'), amp: num(p, 'stim2Amp') });
    const tMax = num(p, 'tMax');
    const run = simulateHH(P, stims, tMax, V0);
    // Referenzkurve: Standardparameter mit gleichem Reiz
    const ref = simulateHH(HH_DEFAULT, [{ start: 1, dur: 1, amp: 10 }], tMax, -65);
    const ph = detectPhases(run, V0, stims);
    const ds = 5; // jedes 5. Sample (0,05 ms) für Diagramme
    const t = every(run.t, ds);
    const spikes = countSpikes(run.V);
    const peak = run.V[ph.peakIdx];
    let minV = Infinity;
    for (let i = ph.peakIdx; i < run.V.length; i++) minV = Math.min(minV, run.V[i]);
    // Dauer bei halber Amplitude
    let apd = NaN;
    if (ph.spiked) {
      const half = (peak + V0) / 2;
      let a = -1;
      let b = -1;
      for (let i = 1; i < run.V.length; i++) {
        if (a < 0 && run.V[i - 1] < half && run.V[i] >= half) a = i;
        if (a > 0 && i > ph.peakIdx && run.V[i - 1] > half && run.V[i] <= half) {
          b = i;
          break;
        }
      }
      if (a > 0 && b > 0) apd = run.t[b] - run.t[a];
    }
    const warnings: string[] = [];
    if (V0 > -55) warnings.push('Bei dauerhaft depolarisiertem Ausgangspotenzial ist ein großer Teil der Na⁺-Kanäle inaktiviert (h klein).');
    if (spikes > 1 && num(p, 'stim2Amp') === 0) warnings.push('Mehrere Aktionspotenziale: Ein langer, starker Reiz kann eine Serie auslösen.');
    return {
      ok: true,
      warnings,
      phases: ph.phases,
      scalars: {
        spikes: { label: 'Anzahl Aktionspotenziale', value: spikes, unit: '' },
        peak: { label: 'Maximales Membranpotenzial', value: peak, unit: 'mV', digits: 1 },
        ahp: { label: 'Minimum nach der Spitze', value: minV, unit: 'mV', digits: 1 },
        apd: { label: 'Dauer bei halber Amplitude', value: Number.isFinite(apd) ? apd : '—', unit: Number.isFinite(apd) ? 'ms' : '', digits: 2 },
        h0: { label: 'Anteil nicht inaktivierter Na⁺-Kanäle zu Beginn (h₀)', value: run.h[0], unit: '', digits: 3 },
      },
      frames: { t: run.t, data: { V: run.V, m: run.m, h: run.h, n: run.n, INa: run.INa, IK: run.IK, Istim: run.Istim } },
      charts: [
        {
          id: 'vm',
          title: 'Membranpotenzial gegen die Zeit',
          x: t,
          xLabel: 'Zeit',
          xUnit: 'ms',
          yLabel: 'Membranpotenzial',
          yUnit: 'mV',
          series: [
            { key: 'V', label: 'V_m (aktuelles Szenario)', y: every(run.V, ds) },
            { key: 'ref', label: 'Referenzkurve (Standardparameter)', y: every(ref.V, ds), dash: '5 4' },
          ],
          bands: ph.phases.filter((x) => x.id !== 'ruhe').map((x) => ({ from: x.from, to: x.to, label: x.label })),
          hlines: [{ y: 0, label: '0 mV' }, { y: P.ENa, label: 'E_Na' }, { y: P.EK, label: 'E_K' }],
          yMin: -100,
          yMax: 60,
          description: `Das Membranpotenzial beginnt bei ${V0} mV. ${ph.spiked ? `Es steigt nach dem Reiz steil bis ${peak.toFixed(1)} mV an und fällt danach bis ${minV.toFixed(1)} mV ab.` : 'Es tritt kein Aktionspotenzial auf.'} Zum Vergleich ist die Referenzkurve gestrichelt dargestellt.`,
        },
        {
          id: 'gates',
          title: 'Kanalzustände (Gating-Variablen)',
          x: t,
          xLabel: 'Zeit',
          xUnit: 'ms',
          yLabel: 'Anteil',
          yUnit: '0–1',
          yMin: 0,
          yMax: 1,
          series: [
            { key: 'm', label: 'm: Na⁺-Aktivierung', y: every(run.m, ds) },
            { key: 'h', label: 'h: Na⁺-Inaktivierungstor offen', y: every(run.h, ds), dash: '6 3' },
            { key: 'n', label: 'n: K⁺-Aktivierung', y: every(run.n, ds), dash: '2 3' },
          ],
          description: 'm steigt schnell, h fällt verzögert (Inaktivierung), n steigt verzögert. Das Zusammenspiel erklärt Aufstrich, Repolarisation und Refraktärität.',
        },
        {
          id: 'currents',
          title: 'Ionenströme',
          x: t,
          xLabel: 'Zeit',
          xUnit: 'ms',
          yLabel: 'Stromdichte',
          yUnit: 'µA/cm²',
          series: [
            { key: 'INa', label: 'I_Na (negativ = Einstrom)', y: every(run.INa, ds) },
            { key: 'IK', label: 'I_K (positiv = Ausstrom)', y: every(run.IK, ds), dash: '6 3' },
          ],
          hlines: [{ y: 0, label: '0' }],
          description: 'Konvention: Einwärtsströme positiver Ladung sind negativ. Der Na⁺-Einstrom geht dem K⁺-Ausstrom zeitlich voraus.',
        },
      ],
    };
  },
};
