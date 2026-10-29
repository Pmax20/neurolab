import { StepLimit, every, num } from './core';
import type { ModelDef, SimResult } from './types';

// Erregungs-Kontraktions-Kopplung und Querbrückenzyklus (stark vereinfachtes Zwei-Zustands-Modell nach A. F. Huxley)
// Ca²⁺ in µmol/l, Zeit in ms.

export interface MuscleOpts {
  freq: number; // Reizfrequenz (Hz)
  nStim: number; // Anzahl Reize
  release: number; // relative Ca²⁺-Freisetzung aus dem SR
  atp: number; // ATP-Konzentration (mmol/l), im Modell konstant
  serca: number; // relative SERCA-Aktivität
  caSens: number; // Ca²⁺-Empfindlichkeit von Troponin C (K50 in µmol/l)
  tMax: number;
}

export function simulateMuscle(o: MuscleOpts) {
  const dt = 0.1;
  const steps = Math.round(o.tMax / dt);
  const lim = new StepLimit(1_000_000);
  const stimTimes: number[] = [];
  for (let k = 0; k < o.nStim; k++) stimTimes.push(10 + (k * 1000) / o.freq);
  const KATP = 0.1; // mmol/l, Halbsättigung der Ablösung
  const atpF = o.atp / (o.atp + KATP);
  const sercaATP = o.atp / (o.atp + 0.05);
  let Ca = 0.05; // µmol/l
  let A = 0; // Anteil gebundener, krafterzeugender Querbrücken
  let Rg = 0; // Anteil Rigor-Brücken (ohne ATP nicht lösbar)
  let atpUsed = 0;
  const out = { t: [] as number[], Ca: [] as number[], act: [] as number[], A: [] as number[], F: [] as number[], atpRate: [] as number[] };
  const f0 = 0.015; // Anheftungsrate (1/ms)
  const g0 = 0.02; // Ablösung (1/ms) bei ATP-Sättigung
  for (let i = 0; i <= steps; i++) {
    lim.tick();
    const t = i * dt;
    // Ca²⁺-Freisetzung aus dem SR über RyR1 für 2 ms nach jedem Muskelaktionspotenzial
    let rel = 0;
    for (const s of stimTimes) if (t >= s && t < s + 2) rel += 4 * o.release;
    const uptake = (o.serca * 1.0 * sercaATP * Ca * Ca) / (Ca * Ca + 0.5 * 0.5);
    Ca += dt * (rel - uptake - 0.002 * (Ca - 0.05));
    Ca = Math.max(0.01, Ca);
    const n = 3;
    const act = Ca ** n / (Ca ** n + o.caSens ** n);
    // Freie Brücken binden, wenn Bindungsstellen am Aktin freigegeben sind (Troponin/Tropomyosin)
    const free = 1 - A - Rg;
    const attach = f0 * act * free;
    const detach = g0 * atpF * A; // Ablösung erfordert ATP-Bindung an Myosin
    // Ohne ATP gehen gebundene Brücken in den Rigor-Zustand über
    const toRigor = 0.01 * (1 - atpF) * A;
    const fromRigor = g0 * atpF * Rg;
    A += dt * (attach - detach - toRigor);
    Rg += dt * (toRigor - fromRigor);
    const atpRate = detach + (uptake / 2) * 0.05; // 1 ATP je Zyklus, 1 ATP je 2 Ca²⁺ (skaliert)
    atpUsed += atpRate * dt;
    if (i % 5 === 0) {
      out.t.push(t);
      out.Ca.push(Ca);
      out.act.push(act);
      out.A.push(A);
      out.F.push(A + 0.25 * Rg); // Rigor-Brücken: Steifigkeit/Spannung ohne Zyklus
      out.atpRate.push(atpRate * 1000);
    }
  }
  return { out, stimTimes, atpUsed };
}

export const muscleModel: ModelDef = {
  id: 'querbrueckenzyklus',
  version: '1.0.0',
  title: 'Erregungs-Kontraktions-Kopplung und Querbrückenzyklus',
  module: 'physio',
  purpose: 'Verfolgen, wie Muskelaktionspotenziale über Ca²⁺ und Troponin/Tropomyosin den Querbrückenzyklus steuern, und welche Rolle ATP für Kontraktion und Relaxation spielt.',
  process: 'Ca²⁺-Freisetzung aus dem SR, Aktivierung des dünnen Filaments, Querbrückenbindung, ATP-abhängige Ablösung, Ca²⁺-Rücktransport.',
  equations: [
    'd[Ca]/dt = Freisetzung(t) − V_SERCA·f(ATP)·[Ca]²/([Ca]² + K²)',
    'Aktivierung a = [Ca]³/([Ca]³ + K₅₀³)  (Troponin C / Tropomyosin)',
    'dA/dt = f₀·a·(1 − A − R) − g₀·ATP/(ATP + K_ATP)·A − k_R·(1 − ATP/(ATP+K_ATP))·A',
    'dR/dt = k_R·(1 − f_ATP)·A − g₀·f_ATP·R   (Rigor)',
    'Kraft ∝ A + 0,25·R (normiert auf die maximale tetanische Kraft)',
  ],
  params: [
    { key: 'freq', label: 'Reizfrequenz', unit: 'Hz', min: 1, max: 100, step: 1, default: 5, description: 'Hohe Frequenzen führen zur Summation bis zum Tetanus.' },
    { key: 'nStim', label: 'Anzahl der Reize', unit: '', min: 1, max: 30, step: 1, default: 1, description: '1 = Einzelzuckung.' },
    { key: 'release', label: 'Ca²⁺-Freisetzung aus dem SR', unit: '×', min: 0, max: 2, step: 0.05, default: 1, description: 'Relative Freisetzung über Ryanodinrezeptoren.' },
    { key: 'atp', label: 'ATP-Verfügbarkeit', unit: 'mmol/l', min: 0, max: 8, step: 0.05, default: 5, description: 'Im Modell konstant (keine Erschöpfung). Wird für die Ablösung der Querbrücken und für die SERCA benötigt.' },
    { key: 'serca', label: 'SERCA-Aktivität (Ca²⁺-Rücktransport)', unit: '×', min: 0, max: 3, step: 0.05, default: 1, description: 'Pumpt Ca²⁺ ATP-abhängig ins SR zurück → Relaxation.' },
    { key: 'caSens', label: 'K₅₀ von Troponin C für Ca²⁺', unit: 'µmol/l', min: 0.2, max: 5, step: 0.05, default: 1, description: 'Kleiner = höhere Ca²⁺-Empfindlichkeit.', advanced: true },
  ],
  initialConditions: '[Ca²⁺] = 0,05 µmol/l, keine gebundenen Querbrücken.',
  included: ['Ca²⁺-Freisetzung (RyR1, ausgelöst über DHPR/T-Tubulus)', 'Kooperative Ca²⁺-Bindung an Troponin C', 'Querbrückenbindung und ATP-abhängige Ablösung', 'Rigor bei ATP-Mangel', 'SERCA-abhängige Relaxation', 'Summation und Tetanus'],
  omitted: ['Kraft-Längen- und Kraft-Geschwindigkeits-Beziehung', 'Mehrere Querbrückenzustände (ADP·Pi etc.)', 'ATP-Verbrauch führt nicht zur Erschöpfung', 'Calsequestrin, Parvalbumin', 'Elastische Elemente'],
  assumptions: ['Isometrische Kontraktion', 'Homogene Ca²⁺-Konzentration', 'Raten didaktisch gewählt'],
  limits: ['Kraft in relativen Einheiten', 'Zeitverläufe nur qualitativ mit realen Zuckungen vergleichbar'],
  qualitativeOnly: ['Kraft', 'ATP-Verbrauch'],
  modelType: 'vereinfacht',
  sources: [{ id: 'huxley1957' }, { id: 'boron', locator: 'Kap. „Cellular Physiology of Skeletal, Cardiac, and Smooth Muscle“' }, { id: 'guyton', locator: 'Kap. „Contraction of Skeletal Muscle“' }],
  status: 'zu_pruefen',
  reviewNote: 'Didaktisches Zwei-Zustands-Modell; fachliche Prüfung ausstehend.',
  references: [
    { name: 'Einzelzuckung', params: {}, expectation: 'Kurzer Ca²⁺-Anstieg, Kraft folgt verzögert und relaxiert vollständig.' },
    { name: 'Tetanus', params: { freq: 60, nStim: 25 }, expectation: 'Verschmolzene, deutlich höhere Kraft.' },
    { name: 'Kein ATP', params: { atp: 0 }, expectation: 'Keine Relaxation (Rigor), Ca²⁺ bleibt erhöht.' },
  ],
  run(p): SimResult {
    const o: MuscleOpts = { freq: num(p, 'freq'), nStim: num(p, 'nStim'), release: num(p, 'release'), atp: num(p, 'atp'), serca: num(p, 'serca'), caSens: num(p, 'caSens'), tMax: 0 };
    o.tMax = Math.max(400, 10 + ((o.nStim - 1) * 1000) / o.freq + 350);
    const r = simulateMuscle(o);
    const ref = simulateMuscle({ freq: 5, nStim: 1, release: 1, atp: 5, serca: 1, caSens: 1, tMax: o.tMax });
    const tet = simulateMuscle({ freq: 80, nStim: 40, release: 1, atp: 5, serca: 1, caSens: 1, tMax: 900 });
    const norm = Math.max(...tet.out.F);
    const Fmax = Math.max(...r.out.F);
    const Fend = r.out.F[r.out.F.length - 1];
    const refMax = norm; const twitch = Math.max(...ref.out.F) / norm;
    const warnings: string[] = [];
    if (o.atp < 0.05) warnings.push('Ohne ATP können sich die Querbrücken nicht lösen (Rigor) und die SERCA pumpt kein Ca²⁺ zurück.');
    return {
      ok: true,
      warnings,
      events: r.stimTimes.map((t) => ({ t, label: 'Muskelaktionspotenzial' })),
      scalars: {
        Fmax: { label: 'Maximale Kraft (Anteil der max. tetanischen Kraft)', value: Fmax / refMax, unit: '', digits: 2 },
        ratio: { label: 'Verhältnis zur Einzelzuckung', value: Fmax / refMax / twitch, unit: '×', digits: 2 },
        Fend: { label: 'Restkraft am Ende (Anteil der max. tetanischen Kraft)', value: Fend / refMax, unit: '', digits: 2 },
        CaMax: { label: 'Maximale Ca²⁺-Konzentration', value: Math.max(...r.out.Ca), unit: 'µmol/l', digits: 2 },
        atp: { label: 'ATP-Verbrauch (relativ, Modell)', value: r.atpUsed, unit: 'rel.', digits: 1 },
      },
      frames: { t: r.out.t, data: { Ca: r.out.Ca, act: r.out.act, A: r.out.A, F: r.out.F.map((f) => f / Math.max(refMax, 1e-9)) } },
      charts: [
        {
          id: 'ca', title: 'Zytosolisches Ca²⁺ und Aktivierung des dünnen Filaments', x: r.out.t, xLabel: 'Zeit', xUnit: 'ms', yLabel: 'Ca²⁺', yUnit: 'µmol/l', yMin: 0,
          series: [{ key: 'Ca', label: '[Ca²⁺] zytosolisch', y: r.out.Ca }, { key: 'act', label: 'Freigegebene Bindungsstellen (0–1)', y: r.out.act, dash: '6 3' }],
          description: 'Jeder Reiz setzt Ca²⁺ frei; die SERCA senkt die Konzentration wieder. Die Aktivierung folgt der Ca²⁺-Konzentration nichtlinear.',
        },
        {
          id: 'force', title: 'Kraft (isometrisch)', x: r.out.t, xLabel: 'Zeit', xUnit: 'ms', yLabel: 'Kraft', yUnit: 'Anteil der max. tetanischen Kraft', yMin: 0,
          series: [{ key: 'F', label: 'Kraft', y: r.out.F.map((f) => f / refMax) }, { key: 'ref', label: 'Referenz: Einzelzuckung', y: ref.out.F.map((f) => f / refMax), dash: '5 4' }],
          description: `Die maximale Kraft beträgt ${((Fmax / refMax) * 100).toFixed(0)} % der maximalen tetanischen Kraft (${(Fmax / refMax / twitch).toFixed(1)}-Fache der Einzelzuckung). ${Fend / refMax > 0.05 ? 'Am Ende bleibt eine deutliche Restkraft bestehen.' : 'Der Muskel relaxiert am Ende.'}`,
        },
      ],
    };
  },
};
