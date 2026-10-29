import { num, range, str } from './core';
import type { ModelDef, SimResult } from './types';

export const KW = 1e-14; // bei 25 °C

/**
 * Exakter pH aus der Ladungsbilanz (ideale Lösung, Konzentrationen statt Aktivitäten):
 * [H⁺] + [Na⁺] = [OH⁻] + [A⁻] + [Cl⁻]
 * Schwache Säure HA (c_HA), konjugierte Base als Na-Salz (c_A), zugesetzte starke Säure (HCl) und Base (NaOH).
 */
export function solvePH(o: { cHA: number; cA: number; Ka: number; strongAcid: number; strongBase: number }): number {
  const total = o.cHA + o.cA;
  const Na = o.cA + o.strongBase;
  const Cl = o.strongAcid;
  const f = (H: number) => H + Na - KW / H - (total * o.Ka) / (o.Ka + H) - Cl;
  // f ist monoton steigend in H → Bisektion auf log-Skala
  let lo = -16;
  let hi = 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(10 ** mid) > 0) hi = mid;
    else lo = mid;
  }
  return -(lo + hi) / 2;
}

export function hendersonHasselbalch(pKa: number, base: number, acid: number) {
  if (base <= 0 || acid <= 0) return NaN;
  return pKa + Math.log10(base / acid);
}

/** Bikarbonat-Puffer: pH = 6,1 + log([HCO₃⁻] / (0,0307·pCO₂)) mit pCO₂ in mmHg, HCO₃⁻ in mmol/l */
export function bicarbonatePH(hco3: number, pco2: number) {
  return 6.1 + Math.log10(hco3 / (0.0307 * pco2));
}

export const acidBaseModel: ModelDef = {
  id: 'saeure-base',
  version: '1.0.0',
  title: 'Säuren, Basen, pH-Wert und Puffer',
  module: 'molecule',
  purpose: 'pH und pOH für starke und schwache Säuren/Basen sowie Puffer berechnen und die Henderson-Hasselbalch-Näherung mit der exakten Rechnung vergleichen.',
  process: 'Protolyse-Gleichgewichte in wässriger Lösung bei 25 °C.',
  equations: [
    'pH = −log₁₀[H⁺],  pOH = −log₁₀[OH⁻],  pH + pOH = 14 (25 °C)',
    'K_a = [H⁺][A⁻]/[HA]',
    'Ladungsbilanz (exakt, ideal): [H⁺] + [Na⁺] = [OH⁻] + [A⁻] + [Cl⁻]',
    'Henderson-Hasselbalch (Näherung): pH = pK_a + log₁₀([A⁻]/[HA])',
    'Bikarbonat: pH = 6,1 + log₁₀([HCO₃⁻] / (0,0307·pCO₂))',
  ],
  params: [
    { key: 'sys', label: 'System', unit: '', type: 'select', default: 'buffer', options: [
      { value: 'strongAcid', label: 'Starke Säure (z. B. HCl)' },
      { value: 'strongBase', label: 'Starke Base (z. B. NaOH)' },
      { value: 'weakAcid', label: 'Schwache Säure (z. B. Essigsäure)' },
      { value: 'buffer', label: 'Puffer: schwache Säure + konjugierte Base' },
      { value: 'bicarb', label: 'Bikarbonatpuffer des Blutes' },
    ], description: 'Art der Lösung.' },
    { key: 'c', label: 'Konzentration Säure/Base (HA bzw. starke)', unit: 'mmol/l', min: 0, max: 1000, step: 0.1, default: 100, description: 'Analytische Konzentration.' },
    { key: 'cA', label: 'Konzentration konjugierte Base (A⁻)', unit: 'mmol/l', min: 0, max: 1000, step: 0.1, default: 100, description: 'Nur beim Puffer.' },
    { key: 'pKa', label: 'pK_a', unit: '', min: 0, max: 14, step: 0.01, default: 4.76, description: 'Essigsäure ≈ 4,76; H₂PO₄⁻/HPO₄²⁻ ≈ 7,2 (25 °C).' },
    { key: 'added', label: 'Zugesetzte starke Säure (+) bzw. Base (−)', unit: 'mmol/l', min: -500, max: 500, step: 1, default: 0, description: 'Zur Untersuchung der Pufferwirkung.' },
    { key: 'hco3', label: '[HCO₃⁻]', unit: 'mmol/l', min: 2, max: 50, step: 0.5, default: 24, description: 'Nur für den Bikarbonatpuffer.' },
    { key: 'pco2', label: 'pCO₂', unit: 'mmHg', min: 10, max: 120, step: 1, default: 40, description: 'Nur für den Bikarbonatpuffer (offenes System).' },
  ],
  initialConditions: 'Stationäre Gleichgewichtsrechnung.',
  included: ['Autoprotolyse des Wassers', 'Exakte Ladungsbilanz', 'Pufferkapazität (Titrationskurve)', 'Bikarbonat-Henderson-Hasselbalch'],
  omitted: ['Aktivitätskoeffizienten (Ionenstärke)', 'Temperaturabhängigkeit von K_w und K_a', 'Mehrprotonige Säuren', 'Nicht-Bikarbonat-Puffer des Blutes'],
  assumptions: ['Ideale Lösung: Konzentrationen statt Aktivitäten', '25 °C (K_w = 10⁻¹⁴)', 'Bikarbonat: pK’ = 6,1 und Löslichkeit 0,0307 mmol/(l·mmHg) bei 37 °C'],
  limits: ['Bei hohen Konzentrationen weichen reale pH-Werte wegen Aktivitäten ab.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'atkins', locator: 'Kap. „Chemical equilibrium: acids and bases“' }, { id: 'boron', locator: 'Kap. „Acid-Base Physiology“' }],
  status: 'zu_pruefen',
  reviewNote: 'Rechnungen gegen Lehrbuchbeispiele getestet; fachliche Freigabe ausstehend.',
  references: [
    { name: '0,1 M HCl', params: { sys: 'strongAcid', c: 100 }, expectation: 'pH = 1,00' },
    { name: 'Acetatpuffer 1:1', params: {}, expectation: 'pH ≈ pK_a = 4,76' },
    { name: 'Blut normal', params: { sys: 'bicarb' }, expectation: 'pH ≈ 7,4' },
  ],
  run(p): SimResult {
    const sys = str(p, 'sys');
    const c = num(p, 'c') / 1000;
    const cA = num(p, 'cA') / 1000;
    const Ka = 10 ** -num(p, 'pKa');
    const add = num(p, 'added') / 1000;
    const sa = Math.max(0, add);
    const sb = Math.max(0, -add);
    const warnings: string[] = [];
    if (sys === 'bicarb') {
      const pH = bicarbonatePH(num(p, 'hco3'), num(p, 'pco2'));
      const xs = range(10, 120, 111);
      return {
        ok: true,
        warnings: ['Akute Betrachtung ohne renale Kompensation; Nicht-Bikarbonat-Puffer sind nicht berücksichtigt.'],
        scalars: {
          pH: { label: 'pH', value: pH, unit: '', digits: 2 },
          co2: { label: 'Gelöstes CO₂ (0,0307·pCO₂)', value: 0.0307 * num(p, 'pco2'), unit: 'mmol/l', digits: 2 },
          ratio: { label: '[HCO₃⁻] / [CO₂]_gelöst', value: num(p, 'hco3') / (0.0307 * num(p, 'pco2')), unit: '', digits: 1 },
        },
        charts: [{ id: 'pco2', title: 'pH gegen pCO₂ bei konstantem [HCO₃⁻]', x: xs, xLabel: 'pCO₂', xUnit: 'mmHg', yLabel: 'pH', yUnit: '', series: [{ key: 'pH', label: 'pH', y: xs.map((x) => bicarbonatePH(num(p, 'hco3'), x)) }], hlines: [{ y: 7.35, label: '7,35' }, { y: 7.45, label: '7,45' }], vmarker: { x: num(p, 'pco2'), label: 'aktuell' }, description: 'Steigender pCO₂ senkt den pH (respiratorische Azidose), sinkender pCO₂ hebt ihn.' }],
      };
    }
    let o = { cHA: 0, cA: 0, Ka, strongAcid: sa, strongBase: sb };
    if (sys === 'strongAcid') o = { ...o, cHA: 0, cA: 0, strongAcid: c + sa };
    if (sys === 'strongBase') o = { ...o, strongBase: c + sb };
    if (sys === 'weakAcid') o = { ...o, cHA: c };
    if (sys === 'buffer') o = { ...o, cHA: c, cA };
    const pH = solvePH(o);
    const H = 10 ** -pH;
    const alpha = Ka / (Ka + H);
    let hh: number | string = '—';
    if (sys === 'buffer') {
      const acid = c + sa - sb;
      const base = cA - sa + sb;
      hh = hendersonHasselbalch(num(p, 'pKa'), base, acid);
      if (!Number.isFinite(hh)) {
        hh = '—';
        warnings.push('Die zugesetzte Menge übersteigt die Pufferkapazität einer Komponente; die Henderson-Hasselbalch-Näherung ist nicht anwendbar.');
      }
    }
    if (c > 0.5) warnings.push('Bei Konzentrationen über etwa 0,1–0,5 mol/l weichen reale Werte wegen Aktivitätseffekten von der idealen Rechnung ab.');
    // Titrationskurve: Zugabe von NaOH zur aktuellen Lösung (ohne „added“)
    const base0 = { ...o, strongAcid: sys === 'strongAcid' ? c : 0, strongBase: sys === 'strongBase' ? c : 0 };
    const maxAdd = Math.max(2 * (c + cA), 0.02);
    const xs = range(0, maxAdd * 1000, 200);
    const curve = xs.map((x) => solvePH({ ...base0, strongBase: base0.strongBase + x / 1000 }));
    return {
      ok: true,
      warnings,
      scalars: {
        pH: { label: 'pH (exakt, ideale Lösung)', value: pH, unit: '', digits: 2 },
        pOH: { label: 'pOH', value: 14 - pH, unit: '', digits: 2 },
        H: { label: '[H⁺]', value: H, unit: 'mol/l', digits: 6 },
        ...(sys === 'weakAcid' || sys === 'buffer' ? { alpha: { label: 'Dissoziationsgrad α = [A⁻]/c_gesamt', value: alpha, unit: '', digits: 4 } } : {}),
        ...(sys === 'buffer' ? { hh: { label: 'pH nach Henderson-Hasselbalch (Näherung)', value: hh, unit: '', digits: 2 } } : {}),
      },
      charts: [
        { id: 'titr', title: 'Titrationskurve: Zugabe starker Base', x: xs, xLabel: 'zugesetzte NaOH', xUnit: 'mmol/l', yLabel: 'pH', yUnit: '', yMin: 0, yMax: 14, series: [{ key: 'pH', label: 'pH', y: curve }], hlines: sys === 'buffer' || sys === 'weakAcid' ? [{ y: num(p, 'pKa'), label: 'pK_a' }] : [], description: 'Im Pufferbereich (pH ≈ pK_a ± 1) ändert sich der pH bei Basenzugabe nur wenig; danach steigt er steil an.' },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Atome, Elemente, Bindungen
// ---------------------------------------------------------------------------

export interface Element {
  z: number;
  sym: string;
  name: string;
  mass: number;
  en: number | null; // Pauling
  valence: number[]; // übliche Bindigkeiten
  color: string;
  radius: number; // Darstellungsradius (Å, kovalent)
  stableN: number[]; // Neutronenzahlen stabiler/häufiger Isotope
}

export const ELEMENTS: Element[] = [
  { z: 1, sym: 'H', name: 'Wasserstoff', mass: 1.008, en: 2.2, valence: [1], color: '#f2f2f2', radius: 0.31, stableN: [0, 1] },
  { z: 2, sym: 'He', name: 'Helium', mass: 4.0026, en: null, valence: [0], color: '#d9ffff', radius: 0.28, stableN: [1, 2] },
  { z: 3, sym: 'Li', name: 'Lithium', mass: 6.94, en: 0.98, valence: [1], color: '#cc80ff', radius: 1.28, stableN: [3, 4] },
  { z: 6, sym: 'C', name: 'Kohlenstoff', mass: 12.011, en: 2.55, valence: [4], color: '#555555', radius: 0.76, stableN: [6, 7] },
  { z: 7, sym: 'N', name: 'Stickstoff', mass: 14.007, en: 3.04, valence: [3, 4], color: '#3050f8', radius: 0.71, stableN: [7, 8] },
  { z: 8, sym: 'O', name: 'Sauerstoff', mass: 15.999, en: 3.44, valence: [2], color: '#ff0d0d', radius: 0.66, stableN: [8, 9, 10] },
  { z: 9, sym: 'F', name: 'Fluor', mass: 18.998, en: 3.98, valence: [1], color: '#90e050', radius: 0.57, stableN: [10] },
  { z: 11, sym: 'Na', name: 'Natrium', mass: 22.99, en: 0.93, valence: [1], color: '#ab5cf2', radius: 1.66, stableN: [12] },
  { z: 12, sym: 'Mg', name: 'Magnesium', mass: 24.305, en: 1.31, valence: [2], color: '#8aff00', radius: 1.41, stableN: [12, 13, 14] },
  { z: 15, sym: 'P', name: 'Phosphor', mass: 30.974, en: 2.19, valence: [3, 5], color: '#ff8000', radius: 1.07, stableN: [16] },
  { z: 16, sym: 'S', name: 'Schwefel', mass: 32.06, en: 2.58, valence: [2, 4, 6], color: '#c8a000', radius: 1.05, stableN: [16, 17, 18, 20] },
  { z: 17, sym: 'Cl', name: 'Chlor', mass: 35.45, en: 3.16, valence: [1], color: '#1ff01f', radius: 1.02, stableN: [18, 20] },
  { z: 19, sym: 'K', name: 'Kalium', mass: 39.098, en: 0.82, valence: [1], color: '#8f40d4', radius: 2.03, stableN: [20, 22] },
  { z: 20, sym: 'Ca', name: 'Calcium', mass: 40.078, en: 1.0, valence: [2], color: '#3dff00', radius: 1.76, stableN: [20, 22, 23, 24, 26, 28] },
  { z: 26, sym: 'Fe', name: 'Eisen', mass: 55.845, en: 1.83, valence: [2, 3], color: '#e06633', radius: 1.32, stableN: [28, 30, 31, 32] },
];

export const elementBySym = (s: string) => ELEMENTS.find((e) => e.sym === s);
export const elementByZ = (z: number) => ELEMENTS.find((e) => e.z === z);

/** Schalenbesetzung (vereinfachtes Schalenmodell, gültig bis Z = 20) */
export function shells(electrons: number): number[] {
  const caps = [2, 8, 8, 2];
  const out: number[] = [];
  let left = electrons;
  for (const c of caps) {
    if (left <= 0) break;
    const k = Math.min(c, left);
    out.push(k);
    left -= k;
  }
  if (left > 0) out.push(left);
  return out;
}

export type BondClass = 'unpolar kovalent' | 'polar kovalent' | 'überwiegend ionisch';

/** Einteilung nach Elektronegativitätsdifferenz. Die Grenzen (0,4 / 1,7) sind Konventionen, keine scharfen Naturgrenzen. */
export function classifyBond(a: string, b: string): { dEN: number; cls: BondClass; partialNegative: string | null } | null {
  const A = elementBySym(a);
  const B = elementBySym(b);
  if (!A || !B || A.en === null || B.en === null) return null;
  const dEN = Math.abs(A.en - B.en);
  const cls: BondClass = dEN < 0.4 ? 'unpolar kovalent' : dEN < 1.7 ? 'polar kovalent' : 'überwiegend ionisch';
  return { dEN, cls, partialNegative: dEN < 0.05 ? null : A.en > B.en ? A.sym : B.sym };
}
