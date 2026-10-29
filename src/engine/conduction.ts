import { StepLimit, bool, num, solveTridiagonal } from './core';
import { HH_DEFAULT, gateRates, ionicCurrents, stepGate, steadyGates } from './hh';
import type { ModelDef, SimResult } from './types';

// Kompartimentmodell eines Axons. Aktive Kompartimente nutzen die Hodgkin-Huxley-Kinetik,
// myelinisierte Internodien sind passiv (kleine Kapazität, sehr kleine Leckleitfähigkeit).
// Die axiale Kopplung wird implizit (Rückwärts-Euler) gelöst → numerisch stabil.

export interface ConductionResult {
  t: number[]; // Zeitpunkte der gespeicherten Frames (ms)
  Vgrid: number[][]; // [frame][kompartiment]
  active: boolean[];
  probes: number[]; // Kompartiment-Indizes der Messpunkte
  traces: number[][]; // [probe][frame]
  arrival: (number | null)[]; // Zeit des Erreichens von −20 mV je Kompartiment
  velocity: number | null; // Kompartimente pro ms
  blocked: boolean;
}

export function simulateAxon(opts: {
  n: number;
  myelinated: boolean;
  nodeSpacing: number; // Anzahl Internodien-Kompartimente zwischen Schnürringen
  coupling: number; // axiale Kopplungsleitfähigkeit (mS/cm², relativ)
  myelinCapFactor: number; // Kapazität der Internodien relativ zur Normalmembran
  damaged: number[]; // Indizes geschädigter Internodien-Abschnitte (Demyelinisierung)
  gNaFactor: number;
  stimAmp: number;
  tMax: number;
  dt?: number;
}): ConductionResult {
  const { n, myelinated, nodeSpacing, coupling } = opts;
  const dt = opts.dt ?? 0.01;
  const P = { ...HH_DEFAULT, gNa: HH_DEFAULT.gNa * opts.gNaFactor };
  const active: boolean[] = [];
  const C = new Float64Array(n);
  const gLeakPassive = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const isNode = !myelinated || i % (nodeSpacing + 1) === 0;
    active.push(isNode);
    if (isNode) C[i] = 1;
    else {
      // Abschnitt einer Internodie; Schädigung: Myelin fehlt → normale Kapazität, erhöhter Leck
      const segment = Math.floor(i / (nodeSpacing + 1));
      const dam = opts.damaged.includes(segment);
      C[i] = dam ? 1 : opts.myelinCapFactor;
      gLeakPassive[i] = dam ? 0.6 : 0.3 * opts.myelinCapFactor;
    }
  }
  const V = new Float64Array(n).fill(-65);
  const g0 = steadyGates(-65, P);
  const m = new Float64Array(n).fill(g0.m);
  const h = new Float64Array(n).fill(g0.h);
  const nn = new Float64Array(n).fill(g0.n);
  // Haltestrom für passive Kompartimente, damit sie in Ruhe bei −65 mV bleiben
  const a = new Float64Array(n);
  const b = new Float64Array(n);
  const c = new Float64Array(n);
  const d = new Float64Array(n);
  const x = new Float64Array(n);
  const steps = Math.round(opts.tMax / dt);
  const saveEvery = 5;
  const probes = [Math.round(n * 0.15), Math.round(n * 0.5), Math.round(n * 0.85)].map((p) => {
    if (!myelinated) return p;
    const k = nodeSpacing + 1;
    return Math.min(n - 1, Math.round(p / k) * k);
  });
  const res: ConductionResult = { t: [], Vgrid: [], active, probes, traces: probes.map(() => []), arrival: new Array(n).fill(null), velocity: null, blocked: false };
  const lim = new StepLimit(5_000_000);
  const iRest = ionicCurrents(-65, g0.m, g0.h, g0.n, P);
  const IholdActive = iRest.INa + iRest.IK + iRest.IL;
  for (let s = 0; s <= steps; s++) {
    const t = s * dt;
    if (s % saveEvery === 0) {
      res.t.push(t);
      res.Vgrid.push(Array.from(V));
      probes.forEach((p, k) => res.traces[k].push(V[p]));
    }
    for (let i = 0; i < n; i++) {
      lim.tick();
      let Iion: number;
      if (active[i]) {
        const r = gateRates(V[i], P);
        m[i] = stepGate(m[i], r.am, r.bm, dt);
        h[i] = stepGate(h[i], r.ah, r.bh, dt);
        nn[i] = stepGate(nn[i], r.an, r.bn, dt);
        const I = ionicCurrents(V[i], m[i], h[i], nn[i], P);
        Iion = I.INa + I.IK + I.IL - IholdActive;
      } else {
        Iion = gLeakPassive[i] * (V[i] + 65);
      }
      const Istim = i < 2 && t >= 1 && t < 2 ? opts.stimAmp : 0;
      const left = i > 0 ? coupling : 0;
      const right = i < n - 1 ? coupling : 0;
      a[i] = -left;
      c[i] = -right;
      b[i] = C[i] / dt + left + right;
      d[i] = (C[i] / dt) * V[i] - Iion + Istim;
    }
    solveTridiagonal(a, b, c, d, x);
    for (let i = 0; i < n; i++) {
      if (!Number.isFinite(x[i])) throw new Error('Numerische Instabilität in der Leitungssimulation.');
      if (res.arrival[i] === null && V[i] < -20 && x[i] >= -20) res.arrival[i] = t;
      V[i] = x[i];
    }
  }
  const i1 = probes[0];
  const i2 = probes[2];
  const a1 = res.arrival[i1];
  const a2 = res.arrival[i2];
  if (a1 !== null && a2 !== null && a2 > a1) res.velocity = (i2 - i1) / (a2 - a1);
  res.blocked = a2 === null;
  return res;
}

export const conductionModel: ModelDef = {
  id: 'erregungsleitung',
  version: '1.0.0',
  title: 'Erregungsleitung: kontinuierlich und saltatorisch',
  module: 'neuro',
  purpose: 'Ausbreitung eines Aktionspotenzials entlang eines Axons untersuchen und myelinisierte mit nicht myelinisierten Axonen vergleichen.',
  process: 'Fortleitung durch lokale Ströme und regenerative Aktivierung spannungsabhängiger Na⁺-Kanäle.',
  equations: [
    'C_i·dV_i/dt = −I_ion,i + g_ax·(V_{i−1} − 2V_i + V_{i+1}) + I_Reiz,i',
    'Aktive Kompartimente: I_ion nach Hodgkin-Huxley',
    'Internodien: I_ion = g_L,myelin·(V − V_Ruhe), C = C_myelin (reduziert)',
    'Numerik: Rückwärts-Euler für die axiale Kopplung (Thomas-Algorithmus), Δt = 0,01 ms',
  ],
  params: [
    { key: 'myelin', label: 'Myelinisiert', unit: '', type: 'bool', default: true, description: 'Mit Myelin: Na⁺-Kanäle nur an Ranvier-Schnürringen; Internodien mit niedriger Kapazität.' },
    { key: 'diam', label: 'Axondurchmesser (relativ)', unit: '×', min: 0.25, max: 4, step: 0.05, default: 1, description: 'Größerer Durchmesser → geringerer Längswiderstand → stärkere axiale Kopplung.' },
    { key: 'spacing', label: 'Internodienlänge', unit: 'Kompartimente', min: 1, max: 9, step: 1, default: 4, description: 'Anzahl passiver Kompartimente zwischen zwei Schnürringen.' },
    { key: 'capF', label: 'Kapazität der Internodien (relativ)', unit: '×', min: 0.01, max: 1, step: 0.01, default: 0.02, description: 'Myelin verringert die Membrankapazität (und den Leckstrom) stark.', advanced: true },
    { key: 'damage', label: 'Geschädigte Internodien (fiktiver Lehrfall)', unit: 'Anzahl', min: 0, max: 4, step: 1, default: 0, description: 'Entfernt das Myelin in Internodien in der Mitte des Axons.' },
    { key: 'gNaF', label: 'Na⁺-Kanaldichte (relativ)', unit: '×', min: 0.2, max: 3, step: 0.05, default: 1, description: 'Skaliert ḡ_Na in allen aktiven Kompartimenten.' },
    { key: 'stim', label: 'Reizstärke am Anfang', unit: 'µA/cm²', min: 5, max: 200, step: 5, default: 60, description: 'Reiz in den ersten beiden Kompartimenten von t = 1 bis 2 ms.' },
  ],
  initialConditions: 'Alle Kompartimente bei −65 mV, Gates stationär.',
  included: ['Lokale Ströme entlang des Axons', 'Regenerative Na⁺-Kanal-Aktivierung', 'Refraktärität (verhindert Rückwärtsausbreitung)', 'Unterschied Myelin/kein Myelin', 'Leitungsblock bei Demyelinisierung'],
  omitted: ['Extrazellulärer Widerstand', 'Realistische Geometrie (Längen in Mikrometern)', 'Paranodale Kanalverteilung', 'Temperatur'],
  assumptions: ['Jedes Kompartiment ist isopotenzial', 'Gleiche Kompartimentlänge in beiden Axontypen', 'HH-Kinetik an allen aktiven Stellen'],
  limits: ['Geschwindigkeiten in Kompartimenten pro ms – nur relativ vergleichbar, keine Angabe in m/s.'],
  qualitativeOnly: ['Leitungsgeschwindigkeit', 'Einfluss des Durchmessers'],
  modelType: 'vereinfacht',
  sources: [{ id: 'hh1952', locator: 'Teil „Propagated action potential“' }, { id: 'kandel', locator: 'Kap. „Propagated Signaling: The Action Potential“' }, { id: 'hille' }],
  status: 'zu_pruefen',
  reviewNote: 'Qualitatives Kompartimentmodell; fachliche Prüfung der Visualisierung (kein „Springen“ durch den Extrazellulärraum) ausstehend.',
  references: [
    { name: 'Myelinisiert', params: {}, expectation: 'Ausbreitung bis zum Ende; höhere Geschwindigkeit als ohne Myelin.' },
    { name: 'Nicht myelinisiert', params: { myelin: false }, expectation: 'Kontinuierliche, langsamere Ausbreitung.' },
    { name: 'Demyelinisierung', params: { damage: 2 }, expectation: '1 geschädigte Internodie: Verzögerung; ab 2: Leitungsblock.' },
  ],
  run(p): SimResult {
    const myel = bool(p, 'myelin');
    const spacing = num(p, 'spacing');
    const n = myel ? (spacing + 1) * 12 + 1 : 61;
    const nodes = Math.floor((n - 1) / (spacing + 1));
    const dmg = num(p, 'damage');
    const mid = Math.floor(nodes / 2);
    const damaged = myel ? Array.from({ length: dmg }, (_, k) => mid - Math.floor(dmg / 2) + k) : [];
    const coupling = 4 * num(p, 'diam');
    const r = simulateAxon({ n, myelinated: myel, nodeSpacing: spacing, coupling, myelinCapFactor: num(p, 'capF'), damaged, gNaFactor: num(p, 'gNaF'), stimAmp: num(p, 'stim'), tMax: 30 });
    const ref = simulateAxon({ n: 61, myelinated: false, nodeSpacing: 4, coupling: 4, myelinCapFactor: 0.05, damaged: [], gNaFactor: 1, stimAmp: 60, tMax: 30 });
    const warnings: string[] = [];
    if (r.blocked) warnings.push('Leitungsblock: Die Erregung erreicht das Axonende nicht.');
    return {
      ok: true,
      warnings,
      scalars: {
        v: { label: 'Leitungsgeschwindigkeit (Modell)', value: r.velocity ?? '—', unit: r.velocity ? 'Kompartimente/ms' : '', digits: 2 },
        vref: { label: 'Referenz: nicht myelinisiert, Durchmesser 1×', value: ref.velocity ?? '—', unit: 'Kompartimente/ms', digits: 2 },
        ratio: { label: 'Verhältnis zur Referenz', value: r.velocity && ref.velocity ? r.velocity / ref.velocity : '—', unit: '×', digits: 2 },
        block: { label: 'Leitungsblock', value: r.blocked ? 'ja' : 'nein', unit: '' },
      },
      frames: { t: r.t, data: { Vgrid: r.Vgrid, active: r.active.map((a) => (a ? 1 : 0)), damaged: damaged } },
      charts: [
        {
          id: 'traces',
          title: 'Membranpotenzial an drei Positionen',
          x: r.t,
          xLabel: 'Zeit',
          xUnit: 'ms',
          yLabel: 'Membranpotenzial',
          yUnit: 'mV',
          yMin: -90,
          yMax: 60,
          series: r.traces.map((y, k) => ({ key: `p${k}`, label: `Position ${['vorne', 'Mitte', 'hinten'][k]} (Kompartiment ${r.probes[k]})`, y, dash: ['', '6 3', '2 3'][k] })),
          description: 'Die Aktionspotenziale erscheinen an weiter entfernten Positionen später. Der zeitliche Abstand ist ein Maß für die Leitungsgeschwindigkeit.',
        },
      ],
    };
  },
};
