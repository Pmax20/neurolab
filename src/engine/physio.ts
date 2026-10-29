import { StepLimit, num, range } from './core';
import { bicarbonatePH } from './chem';
import type { ModelDef, SimResult } from './types';

// ---------------------------------------------------------------------------
// Kreislauf: Herzzeitvolumen, Widerstände (Poiseuille), Zwei-Element-Windkessel
// ---------------------------------------------------------------------------

export const BEDS = [
  { key: 'gehirn', label: 'Gehirn', R0: 6.5 },
  { key: 'herz', label: 'Koronarien', R0: 22 },
  { key: 'niere', label: 'Nieren', R0: 4.8 },
  { key: 'splanch', label: 'Splanchnikusgebiet', R0: 3.8 },
  { key: 'muskel', label: 'Skelettmuskulatur', R0: 6 },
  { key: 'rest', label: 'Haut und übrige Organe', R0: 8.6 },
] as const;

export function parallel(rs: number[]) {
  return 1 / rs.reduce((s, r) => s + 1 / r, 0);
}

/** Poiseuille: R ∝ η·L / r⁴ (relativ) */
export function poiseuilleFactor(radiusFactor: number, viscFactor: number) {
  return viscFactor / radiusFactor ** 4;
}

export function windkessel(o: { HR: number; SV: number; R: number; C: number; Pv: number; beats: number }) {
  // P in mmHg, Q in ml/s, R in mmHg·s/ml, C in ml/mmHg
  const T = 60 / o.HR;
  const Ts = Math.min(0.3, 0.4 * T); // Systolendauer
  const dt = 0.001;
  const n = Math.round((o.beats * T) / dt);
  let P = 80;
  const tt: number[] = [];
  const PP: number[] = [];
  const QQ: number[] = [];
  const lim = new StepLimit(200000);
  for (let i = 0; i <= n; i++) {
    lim.tick();
    const t = i * dt;
    const ph = t % T;
    const Q = ph < Ts ? ((o.SV * Math.PI) / (2 * Ts)) * Math.sin((Math.PI * ph) / Ts) : 0;
    P += (dt * (Q - (P - o.Pv) / o.R)) / o.C;
    if (i % 5 === 0) {
      tt.push(t);
      PP.push(P);
      QQ.push(Q);
    }
  }
  // letzte zwei Schläge auswerten
  const start = tt.findIndex((t) => t >= (o.beats - 2) * T);
  const last = PP.slice(start);
  return { t: tt, P: PP, Q: QQ, sys: Math.max(...last), dia: Math.min(...last), mean: last.reduce((a, b) => a + b, 0) / last.length };
}

export const circulationModel: ModelDef = {
  id: 'kreislauf',
  version: '1.0.0',
  title: 'Kreislauf: Herzzeitvolumen, Druck, Widerstand und Blutflussverteilung',
  module: 'physio',
  purpose: 'Zusammenhänge zwischen Herzfrequenz, Schlagvolumen, Gefäßwiderstand, Blutdruck und Organdurchblutung untersuchen.',
  process: 'Großer Kreislauf als Windkessel mit parallel geschalteten Organstrombahnen.',
  equations: [
    'HZV = HF · SV',
    'Ohmsches Gesetz des Kreislaufs: ΔP = HZV · TPR  (MAD − ZVD = HZV · TPR)',
    'Parallelschaltung: 1/TPR = Σ 1/R_i;  Fluss je Organ Q_i = (MAD − ZVD)/R_i',
    'Hagen-Poiseuille: R = 8·η·L/(π·r⁴)',
    'Windkessel: C·dP/dt = Q_Herz(t) − (P − ZVD)/TPR',
  ],
  params: [
    { key: 'HR', label: 'Herzfrequenz', unit: '1/min', min: 30, max: 200, step: 1, default: 70, description: 'Schläge pro Minute.' },
    { key: 'SV', label: 'Schlagvolumen', unit: 'ml', min: 10, max: 150, step: 1, default: 70, description: 'Im Modell unabhängig von HF und Vorlast (kein Frank-Starling-Mechanismus).' },
    { key: 'rMuscle', label: 'Gefäßradius Skelettmuskulatur', unit: '×', min: 0.5, max: 2, step: 0.01, default: 1, description: 'Vasodilatation (>1) bzw. Vasokonstriktion (<1) der Widerstandsgefäße.' },
    { key: 'rKidney', label: 'Gefäßradius Nieren', unit: '×', min: 0.5, max: 2, step: 0.01, default: 1, description: 'Radiusänderung der renalen Widerstandsgefäße.' },
    { key: 'rAll', label: 'Gefäßradius systemisch (alle Organe)', unit: '×', min: 0.5, max: 1.5, step: 0.01, default: 1, description: 'Generalisierte Vasokonstriktion/-dilatation.' },
    { key: 'visc', label: 'Blutviskosität', unit: '×', min: 0.5, max: 3, step: 0.05, default: 1, description: 'Relativ zur normalen Viskosität (z. B. abhängig vom Hämatokrit).' },
    { key: 'C', label: 'Arterielle Compliance', unit: 'ml/mmHg', min: 0.3, max: 3, step: 0.05, default: 1.5, description: 'Dehnbarkeit der großen Arterien; geringere Compliance → größere Blutdruckamplitude.' },
    { key: 'CVP', label: 'Zentraler Venendruck', unit: 'mmHg', min: 0, max: 20, step: 1, default: 3, description: 'Druck am Ende der Strombahn.', advanced: true },
  ],
  initialConditions: 'Arterieller Druck 80 mmHg; Auswertung nach 8 Herzschlägen (eingeschwungen).',
  included: ['HZV = HF·SV', 'Parallel geschaltete Organwiderstände', 'r⁴-Abhängigkeit des Widerstands', 'Windkesselfunktion der Aorta'],
  omitted: ['Baroreflex und jede andere Regulation (offener Regelkreis!)', 'Frank-Starling-Mechanismus', 'Lungenkreislauf', 'Venöser Rückstrom und Volumenstatus', 'Autoregulation einzelner Organe', 'Pulswellenreflexion'],
  assumptions: ['Laminare Strömung, newtonsche Flüssigkeit (Poiseuille)', 'Zwei-Element-Windkessel', 'Ruhewiderstände als Modellwerte so gewählt, dass in Ruhe HZV ≈ 5 l/min und MAD ≈ 93 mmHg'],
  limits: ['Bildet keine vollständige menschliche Kreislaufreaktion ab: Im Körper würde z. B. ein Druckabfall reflektorisch gegenreguliert.'],
  qualitativeOnly: ['Blutflussverteilung (Ruhewerte sind gerundete Lehrbuchgrößenordnungen)'],
  modelType: 'vereinfacht',
  sources: [{ id: 'windkessel' }, { id: 'guyton', locator: 'Kap. „Overview of the Circulation; Pressure, Flow, and Resistance“' }, { id: 'boron', locator: 'Kap. „Arteries and Veins“' }],
  status: 'zu_pruefen',
  reviewNote: 'Fachliche Prüfung ausstehend.',
  references: [
    { name: 'Ruhe', params: {}, expectation: 'HZV ≈ 4,9 l/min, MAD ≈ 90–95 mmHg, ca. 120/80 mmHg.' },
    { name: 'Vasodilatation Muskel', params: { rMuscle: 1.4 }, expectation: 'TPR sinkt, MAD sinkt (ohne Regulation), Muskeldurchblutung steigt stark.' },
  ],
  run(p): SimResult {
    const HR = num(p, 'HR');
    const SV = num(p, 'SV');
    const CO = (HR * SV) / 1000; // l/min
    const CVP = num(p, 'CVP');
    const v = num(p, 'visc');
    const rAll = num(p, 'rAll');
    const R = BEDS.map((b) => {
      let rf = rAll;
      if (b.key === 'muskel') rf *= num(p, 'rMuscle');
      if (b.key === 'niere') rf *= num(p, 'rKidney');
      return b.R0 * 17.5 * poiseuilleFactor(rf, v);
    });
    // R in mmHg·min/l; Ruhe-TPR ≈ 18 mmHg·min/l
    const TPR = parallel(R);
    const MAP = CO * TPR + CVP;
    const flows = R.map((r) => (MAP - CVP) / r);
    const wk = windkessel({ HR, SV, R: (TPR * 60) / 1000, C: num(p, 'C'), Pv: CVP, beats: 8 });
    const pts = range(0.5, 2, 61);
    const warnings: string[] = [];
    if (MAP < 65) warnings.push('Der berechnete Mitteldruck ist sehr niedrig. Im Körper würden Regulationsmechanismen (z. B. Baroreflex) gegensteuern – diese sind im Modell nicht enthalten.');
    return {
      ok: true,
      warnings,
      scalars: {
        CO: { label: 'Herzzeitvolumen', value: CO, unit: 'l/min', digits: 2 },
        TPR: { label: 'Totaler peripherer Widerstand', value: TPR, unit: 'mmHg·min/l', digits: 1 },
        MAP: { label: 'Mittlerer arterieller Druck (MAD)', value: MAP, unit: 'mmHg', digits: 0 },
        sys: { label: 'Systolischer Druck (Windkessel)', value: wk.sys, unit: 'mmHg', digits: 0 },
        dia: { label: 'Diastolischer Druck (Windkessel)', value: wk.dia, unit: 'mmHg', digits: 0 },
        pp: { label: 'Blutdruckamplitude', value: wk.sys - wk.dia, unit: 'mmHg', digits: 0 },
        ...Object.fromEntries(BEDS.map((b, i) => [`q_${b.key}`, { label: `Durchblutung ${b.label}`, value: flows[i], unit: 'l/min', digits: 2 }])),
      },
      charts: [
        { id: 'p', title: 'Arterieller Druck (Windkessel)', x: wk.t, xLabel: 'Zeit', xUnit: 's', yLabel: 'Druck', yUnit: 'mmHg', series: [{ key: 'P', label: 'Aortendruck', y: wk.P }], hlines: [{ y: MAP, label: 'MAD (HZV·TPR)' }], description: `Pulsatiler Druck: ${wk.sys.toFixed(0)}/${wk.dia.toFixed(0)} mmHg. Die Aorta speichert in der Systole Volumen und gibt es in der Diastole ab.` },
        { id: 'r4', title: 'Relativer Widerstand gegen Gefäßradius (Poiseuille)', x: pts, xLabel: 'Radius', xUnit: '× Ausgangswert', yLabel: 'Widerstand', yUnit: '× Ausgangswert', logX: false, series: [{ key: 'R', label: 'R/R₀ = (r/r₀)⁻⁴', y: pts.map((x) => poiseuilleFactor(x, 1)) }], vmarker: { x: num(p, 'rMuscle'), label: 'Muskel aktuell' }, yMax: 16, description: 'Halbierung des Radius erhöht den Widerstand auf das 16-Fache.' },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Atmung: Ventilation und Gasaustausch
// ---------------------------------------------------------------------------

/** Severinghaus-Gleichung: O₂-Sättigung (Anteil) aus pO₂ (mmHg) */
export function severinghaus(po2: number) {
  const x = po2;
  return 1 / (23400 / (x ** 3 + 150 * x) + 1);
}

export const respirationModel: ModelDef = {
  id: 'atmung',
  version: '1.0.0',
  title: 'Atmung: Ventilation, alveoläre Partialdrücke und O₂-Transport',
  module: 'physio',
  purpose: 'Zusammenhang zwischen Ventilation, alveolären Partialdrücken, O₂-Sättigung und pH untersuchen.',
  process: 'Alveoläre Ventilation und Gasaustausch im stationären Zustand.',
  equations: [
    'V̇_E = f · V_T,   V̇_A = f · (V_T − V_D)',
    'Alveoläre CO₂-Gleichung: P_ACO₂ = 0,863 · V̇CO₂ / V̇_A   (V̇ in ml/min bzw. l/min, BTPS/STPD)',
    'Alveoläre Gasgleichung: P_AO₂ = F_IO₂ · (P_B − 47) − P_ACO₂ / RQ',
    'P_aO₂ = P_AO₂ − AaDO₂',
    'S_O₂ nach Severinghaus (1979)',
    'C_aO₂ = 1,34 · Hb · S_O₂ + 0,003 · P_aO₂   (ml O₂/dl)',
    'pH = 6,1 + log([HCO₃⁻]/(0,0307·P_aCO₂))',
  ],
  params: [
    { key: 'f', label: 'Atemfrequenz', unit: '1/min', min: 4, max: 40, step: 1, default: 12, description: 'Atemzüge pro Minute.' },
    { key: 'VT', label: 'Atemzugvolumen', unit: 'ml', min: 150, max: 1500, step: 10, default: 500, description: 'Volumen pro Atemzug.' },
    { key: 'VD', label: 'Totraum', unit: 'ml', min: 50, max: 400, step: 5, default: 150, description: 'Nicht am Gasaustausch beteiligt.' },
    { key: 'VCO2', label: 'CO₂-Produktion', unit: 'ml/min', min: 100, max: 1500, step: 10, default: 200, description: 'Stoffwechselabhängig (Ruhe ≈ 200 ml/min).' },
    { key: 'FiO2', label: 'Inspiratorische O₂-Fraktion', unit: '', min: 0.1, max: 1, step: 0.01, default: 0.21, description: 'Raumluft: 0,21.' },
    { key: 'PB', label: 'Luftdruck', unit: 'mmHg', min: 250, max: 800, step: 5, default: 760, description: 'Meereshöhe ≈ 760 mmHg; große Höhe deutlich weniger.' },
    { key: 'AaDO2', label: 'Alveolo-arterielle O₂-Differenz', unit: 'mmHg', min: 0, max: 60, step: 1, default: 8, description: 'Vereinfachte Größe für Diffusions- und Verteilungsstörungen (fiktive Lehrfälle).' },
    { key: 'Hb', label: 'Hämoglobin', unit: 'g/dl', min: 5, max: 20, step: 0.1, default: 15, description: 'Bestimmt die O₂-Bindungskapazität.' },
    { key: 'HCO3', label: '[HCO₃⁻] arteriell', unit: 'mmol/l', min: 10, max: 40, step: 0.5, default: 24, description: 'Für die pH-Berechnung (ohne Kompensation).', advanced: true },
    { key: 'RQ', label: 'Respiratorischer Quotient', unit: '', min: 0.7, max: 1, step: 0.01, default: 0.8, description: 'V̇CO₂/V̇O₂.', advanced: true },
  ],
  initialConditions: 'Stationärer Zustand.',
  included: ['Totraumventilation', 'Alveoläre CO₂- und O₂-Gleichung', 'O₂-Bindungskurve (Standardbedingungen)', 'O₂-Gehalt', 'Akute pH-Änderung über pCO₂'],
  omitted: ['Ventilations-Perfusions-Verteilung (nur pauschal über AaDO₂)', 'Bohr- und Haldane-Effekt, Rechtsverschiebung der Bindungskurve', 'Atemregulation (Chemorezeptoren)', 'Renale Kompensation', 'Zeitlicher Verlauf'],
  assumptions: ['Stationärer Zustand', 'Arterieller pCO₂ = alveolärer pCO₂', 'Bindungskurve bei pH 7,4, 37 °C'],
  limits: ['Nicht zur Beurteilung realer Blutgaswerte geeignet.'],
  qualitativeOnly: ['AaDO₂ als Pauschalgröße'],
  modelType: 'vereinfacht',
  sources: [{ id: 'west', locator: 'Kap. „Ventilation“, „Diffusion“, „Gas Transport by the Blood“' }, { id: 'severinghaus' }],
  status: 'zu_pruefen',
  reviewNote: 'Gleichungen aus Standardlehrbuch; fachliche Prüfung ausstehend.',
  references: [
    { name: 'Ruhe auf Meereshöhe', params: {}, expectation: 'P_ACO₂ ≈ 41 mmHg, P_AO₂ ≈ 99 mmHg, S_O₂ ≈ 97 %.' },
    { name: 'Hypoventilation', params: { f: 6 }, expectation: 'pCO₂ verdoppelt, pO₂ sinkt, pH sinkt.' },
    { name: 'Große Höhe', params: { PB: 380 }, expectation: 'Deutliche Hypoxämie.' },
  ],
  run(p): SimResult {
    const f = num(p, 'f');
    const VT = num(p, 'VT');
    const VD = num(p, 'VD');
    const warnings: string[] = [];
    if (VT <= VD) throw new Error('Das Atemzugvolumen muss größer als der Totraum sein, sonst findet im Modell keine alveoläre Ventilation statt.');
    const VA = (f * (VT - VD)) / 1000; // l/min
    const VE = (f * VT) / 1000;
    const VCO2 = num(p, 'VCO2');
    const PACO2 = (0.863 * VCO2) / VA;
    const FiO2 = num(p, 'FiO2');
    const PB = num(p, 'PB');
    const RQ = num(p, 'RQ');
    const PAO2 = Math.max(0, FiO2 * (PB - 47) - PACO2 / RQ);
    const PaO2 = Math.max(0, PAO2 - num(p, 'AaDO2'));
    const Sa = severinghaus(PaO2);
    const Hb = num(p, 'Hb');
    const CaO2 = 1.34 * Hb * Sa + 0.003 * PaO2;
    const pH = bicarbonatePH(num(p, 'HCO3'), PACO2);
    if (PACO2 > 80) warnings.push('Sehr hoher pCO₂: ausgeprägte respiratorische Azidose im Modell.');
    const vas = range(1, 15, 100);
    const po2s = range(0, 150, 151);
    return {
      ok: true,
      warnings,
      scalars: {
        VE: { label: 'Atemminutenvolumen', value: VE, unit: 'l/min', digits: 2 },
        VA: { label: 'Alveoläre Ventilation', value: VA, unit: 'l/min', digits: 2 },
        PACO2: { label: 'Alveolärer (≈ arterieller) pCO₂', value: PACO2, unit: 'mmHg', digits: 1 },
        PAO2: { label: 'Alveolärer pO₂', value: PAO2, unit: 'mmHg', digits: 1 },
        PaO2: { label: 'Arterieller pO₂', value: PaO2, unit: 'mmHg', digits: 1 },
        Sa: { label: 'O₂-Sättigung', value: Sa * 100, unit: '%', digits: 1 },
        CaO2: { label: 'Arterieller O₂-Gehalt', value: CaO2, unit: 'ml/dl', digits: 1 },
        pH: { label: 'Arterieller pH (akut)', value: pH, unit: '', digits: 2 },
      },
      charts: [
        { id: 'va', title: 'Alveoläre Partialdrücke gegen alveoläre Ventilation', x: vas, xLabel: 'V̇_A', xUnit: 'l/min', yLabel: 'Partialdruck', yUnit: 'mmHg', yMin: 0, yMax: 160, series: [{ key: 'co2', label: 'P_ACO₂', y: vas.map((v) => (0.863 * VCO2) / v) }, { key: 'o2', label: 'P_AO₂', y: vas.map((v) => Math.max(0, FiO2 * (PB - 47) - (0.863 * VCO2) / v / RQ)), dash: '6 3' }], vmarker: { x: VA, label: 'aktuell' }, description: 'P_ACO₂ ist umgekehrt proportional zur alveolären Ventilation. P_AO₂ steigt mit der Ventilation und nähert sich dem inspiratorischen pO₂.' },
        { id: 'odc', title: 'O₂-Bindungskurve (Standardbedingungen)', x: po2s, xLabel: 'pO₂', xUnit: 'mmHg', yLabel: 'S_O₂', yUnit: '%', yMin: 0, yMax: 100, series: [{ key: 's', label: 'Sättigung', y: po2s.map((x) => severinghaus(x) * 100) }], vmarker: { x: PaO2, label: 'P_aO₂' }, description: 'Sigmoide Kurve: Im oberen flachen Bereich ändert sich die Sättigung wenig, im steilen Bereich stark.' },
      ],
    };
  },
};
