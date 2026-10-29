// Allgemeine Chemie für das 1. Semester: Stoffmenge und Konzentration, Gleichgewicht und Kinetik, Redoxpotenziale.
import { F, R, num, range, str, bool } from './core';
import type { ModelDef, SimResult } from './types';

// ---------------------------------------------------------------------------
// Stoffmenge, Konzentration, Osmolarität
// ---------------------------------------------------------------------------

export const SUBSTANCES: Record<string, { label: string; M: number; particles: number; cationCharge: number; cations: number; note: string }> = {
  nacl: { label: 'Natriumchlorid (NaCl)', M: 58.44, particles: 2, cationCharge: 1, cations: 1, note: 'Dissoziiert in Na⁺ und Cl⁻; beide wirken als effektive Osmolyte (Na⁺ wird aktiv aus der Zelle gepumpt).' },
  kcl: { label: 'Kaliumchlorid (KCl)', M: 74.55, particles: 2, cationCharge: 1, cations: 1, note: 'Dissoziiert in K⁺ und Cl⁻.' },
  cacl2: { label: 'Calciumchlorid (CaCl₂)', M: 110.98, particles: 3, cationCharge: 2, cations: 1, note: 'Ein Ca²⁺ und zwei Cl⁻ pro Formeleinheit; 1 mmol Ca²⁺ = 2 mval.' },
  nahco3: { label: 'Natriumhydrogencarbonat (NaHCO₃)', M: 84.01, particles: 2, cationCharge: 1, cations: 1, note: 'Na⁺ und HCO₃⁻; wird als Puffer bei Azidosen eingesetzt.' },
  glukose: { label: 'Glukose (C₆H₁₂O₆)', M: 180.16, particles: 1, cationCharge: 0, cations: 0, note: 'Dissoziiert nicht. In vivo wird Glukose aufgenommen und verstoffwechselt – Glukose-5-%-Lösung ist daher zwar etwa isoosmolar, wirkt aber physiologisch wie freies Wasser.' },
  harnstoff: { label: 'Harnstoff (CH₄N₂O)', M: 60.06, particles: 1, cationCharge: 0, cations: 0, note: 'Membrangängig: erhöht die Osmolarität, wirkt aber kaum tonisch (kein dauerhafter Wasserstrom).' },
};

export const PLASMA_OSM = 290; // mosmol/l, Größenordnung (Referenzbereich etwa 280–296 mosmol/kg)

export function concentration(subst: string, massG: number, volMl: number, phi = 1) {
  const s = SUBSTANCES[subst];
  const nMmol = (massG / s.M) * 1000;
  const cMmolL = nMmol / (volMl / 1000);
  return {
    nMmol,
    cMmolL,
    gPerL: massG / (volMl / 1000),
    percent: (massG / volMl) * 100, // % (m/V) = g pro 100 ml
    osm: cMmolL * s.particles * phi,
    mval: cMmolL * s.cationCharge * s.cations,
  };
}

export const concentrationModel: ModelDef = {
  id: 'konzentration',
  version: '1.0.0',
  title: 'Stoffmenge, Konzentration und Osmolarität',
  module: 'molecule',
  purpose: 'Aus Masse und Volumen Stoffmenge, Stoffmengenkonzentration, Massenkonzentration, Prozentangabe, Osmolarität und Ladungsäquivalente berechnen – an Infusionslösungen.',
  process: 'Herstellung einer wässrigen Lösung; Dissoziation von Salzen in Ionen.',
  equations: ['n = m / M', 'c = n / V', 'β = m / V  (Massenkonzentration)', '% (m/V) = g pro 100 ml', 'Osmolarität ≈ c · i · φ  (i = Teilchen pro Formeleinheit, φ = osmotischer Koeffizient)', 'Äquivalentkonzentration = c · z  (mval/l)'],
  params: [
    { key: 'subst', label: 'Stoff', unit: '', type: 'select', default: 'nacl', options: Object.entries(SUBSTANCES).map(([value, s]) => ({ value, label: s.label })), description: 'Gelöster Stoff.' },
    { key: 'mass', label: 'Masse', unit: 'g', min: 0, max: 200, step: 0.1, default: 9, description: 'Eingewogene Masse des Stoffes.' },
    { key: 'vol', label: 'Volumen der Lösung', unit: 'ml', min: 10, max: 5000, step: 10, default: 1000, description: 'Endvolumen der Lösung (nicht Volumen des Lösungsmittels).' },
    { key: 'phi', label: 'Osmotischer Koeffizient φ', unit: '', min: 0.5, max: 1, step: 0.01, default: 1, description: 'Ideal = 1. Für NaCl-Lösungen im physiologischen Bereich real ≈ 0,93 (Ionen-Wechselwirkungen).', advanced: true },
  ],
  initialConditions: 'Stationäre Rechnung, 37 °C, verdünnte Lösung.',
  included: ['Vollständige Dissoziation von Salzen', 'Ideale Osmolarität mit optionalem osmotischem Koeffizienten'],
  omitted: ['Osmolalität (pro kg Wasser) – bei verdünnten Lösungen nahezu gleich', 'Volumenänderung beim Lösen', 'Membrangängigkeit (Tonizität) wird nur als Hinweis angegeben'],
  assumptions: ['Verdünnte wässrige Lösung', 'Salze dissoziieren vollständig'],
  limits: ['Die Einordnung „hypo-/iso-/hyperosmolar“ bezieht sich auf die Osmolarität; die Tonizität hängt zusätzlich davon ab, ob der Stoff die Zellmembran passieren kann.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'zeeck', locator: 'Kap. „Erscheinungsformen der Materie“ und „Salzlösungen“' }, { id: 'boron', locator: 'Kap. „Body fluid compartments“' }],
  status: 'zu_pruefen',
  reviewNote: 'Rechenwege gegen Lehrbuchbeispiele (0,9 % NaCl = 154 mmol/l) geprüft; fachliche Freigabe ausstehend.',
  references: [
    { name: 'Physiologische Kochsalzlösung 0,9 %', params: { subst: 'nacl', mass: 9, vol: 1000 }, expectation: '154 mmol/l, ideal 308 mosmol/l (real mit φ ≈ 0,93 etwa 286 mosmol/l)' },
    { name: 'Glukose 5 %', params: { subst: 'glukose', mass: 50, vol: 1000 }, expectation: '≈ 278 mmol/l und ≈ 278 mosmol/l' },
    { name: 'Calciumchlorid 1 g in 100 ml', params: { subst: 'cacl2', mass: 1, vol: 100 }, expectation: '≈ 90 mmol/l Ca²⁺ = 180 mval/l' },
  ],
  run(p): SimResult {
    const subst = str(p, 'subst');
    const s = SUBSTANCES[subst];
    const r = concentration(subst, num(p, 'mass'), num(p, 'vol'), num(p, 'phi'));
    const rel = r.osm / PLASMA_OSM;
    const cls = r.osm < 270 ? 'hypoosmolar' : r.osm > 310 ? 'hyperosmolar' : 'etwa isoosmolar';
    const warnings: string[] = [];
    if (subst === 'harnstoff') warnings.push('Harnstoff permeiert durch Zellmembranen: Die Lösung ist osmotisch wirksam gemessen, aber praktisch nicht tonisch wirksam.');
    if (subst === 'glukose') warnings.push('Glukose wird in vivo aufgenommen und verstoffwechselt; physiologisch wirkt die Lösung daher hypoton.');
    if (r.cMmolL > 1000) warnings.push('Sehr hohe Konzentration: Die Näherung „ideale, verdünnte Lösung“ gilt hier nicht mehr.');
    const xs = range(0, Math.max(2 * num(p, 'mass'), 1), 101);
    return {
      ok: true,
      warnings,
      scalars: {
        n: { label: 'Stoffmenge n', value: r.nMmol, unit: 'mmol', digits: 1 },
        c: { label: 'Stoffmengenkonzentration c', value: r.cMmolL, unit: 'mmol/l', digits: 1 },
        beta: { label: 'Massenkonzentration β', value: r.gPerL, unit: 'g/l', digits: 2 },
        pct: { label: 'Prozentangabe (m/V)', value: r.percent, unit: '%', digits: 2 },
        osm: { label: 'Osmolarität', value: r.osm, unit: 'mosmol/l', digits: 0 },
        ...(s.cations ? { eq: { label: `Kation-Äquivalente (${s.cationCharge === 2 ? 'Ca²⁺' : 'einwertig'})`, value: r.mval, unit: 'mval/l', digits: 1 } } : {}),
        cls: { label: `Einordnung gegenüber Plasma (≈ ${PLASMA_OSM} mosmol/l)`, value: `${cls} (${(rel * 100).toFixed(0)} %)`, unit: '' },
      },
      charts: [{
        id: 'osm', title: 'Osmolarität in Abhängigkeit von der eingewogenen Masse', x: xs, xLabel: 'Masse', xUnit: 'g', yLabel: 'Osmolarität', yUnit: 'mosmol/l',
        series: [{ key: 'osm', label: 'Osmolarität', y: xs.map((m) => concentration(subst, m, num(p, 'vol'), num(p, 'phi')).osm) }],
        hlines: [{ y: PLASMA_OSM, label: 'Plasma ≈ 290' }], vmarker: { x: num(p, 'mass'), label: 'aktuell' }, yMin: 0,
        description: `Die Osmolarität steigt linear mit der Masse. Für ${s.label} erzeugt jede Formeleinheit ${s.particles} Teilchen. ${s.note}`,
      }],
    };
  },
};

// ---------------------------------------------------------------------------
// Chemisches Gleichgewicht und Kinetik: A ⇌ B
// ---------------------------------------------------------------------------

export function equilibrium(k1: number, k2: number, A0: number, B0: number, t: number) {
  const k = k1 + k2;
  const total = A0 + B0;
  const Aeq = (total * k2) / k;
  const A = Aeq + (A0 - Aeq) * Math.exp(-k * t);
  return { A, B: total - A, Aeq, Beq: total - Aeq };
}

export const equilibriumModel: ModelDef = {
  id: 'gleichgewicht',
  version: '1.0.0',
  title: 'Chemisches Gleichgewicht und Reaktionsgeschwindigkeit (A ⇌ B)',
  module: 'molecule',
  purpose: 'Zeigen, dass im Gleichgewicht Hin- und Rückreaktion gleich schnell ablaufen, wie K mit ΔG°’ zusammenhängt und dass ein Katalysator nur die Einstellgeschwindigkeit, nicht die Lage des Gleichgewichts ändert.',
  process: 'Reversible Reaktion erster Ordnung in geschlossener, gut durchmischter Lösung.',
  equations: ['v_hin = k₁·[A],  v_rück = k₂·[B]', 'Gleichgewicht: k₁·[A] = k₂·[B]  ⇒  K = [B]/[A] = k₁/k₂', '[A](t) = [A]_eq + ([A]₀ − [A]_eq)·e^(−(k₁+k₂)·t)', 'ΔG°’ = −R·T·ln K', 'ΔG = ΔG°’ + R·T·ln Q  (Q = [B]/[A] zum betrachteten Zeitpunkt)'],
  params: [
    { key: 'k1', label: 'Geschwindigkeitskonstante hin k₁', unit: '1/s', min: 0.01, max: 10, step: 0.01, default: 1, description: 'Wie schnell A zu B reagiert.' },
    { key: 'k2', label: 'Geschwindigkeitskonstante rück k₂', unit: '1/s', min: 0.01, max: 10, step: 0.01, default: 0.25, description: 'Wie schnell B zu A zurückreagiert.' },
    { key: 'A0', label: 'Anfangskonzentration [A]₀', unit: 'mmol/l', min: 0, max: 100, step: 1, default: 10, description: 'Konzentration von A zu Beginn.' },
    { key: 'B0', label: 'Anfangskonzentration [B]₀', unit: 'mmol/l', min: 0, max: 100, step: 1, default: 0, description: 'Konzentration von B zu Beginn.' },
    { key: 'cat', label: 'Katalysator (Enzym) zugesetzt', unit: '', type: 'bool', default: false, description: 'Beschleunigt Hin- und Rückreaktion um denselben Faktor (×10).' },
  ],
  initialConditions: 'Zum Zeitpunkt 0 liegen [A]₀ und [B]₀ vor.',
  included: ['Reversible Reaktion erster Ordnung', 'Katalysatorwirkung auf beide Richtungen', 'Zusammenhang K ↔ ΔG°’ bei 37 °C'],
  omitted: ['Reaktionen höherer Ordnung', 'Temperaturabhängigkeit (Arrhenius)', 'Offene Systeme (Fließgleichgewicht)'],
  assumptions: ['Ideale Lösung', 'Konstante Temperatur 37 °C', 'Konzentrationen in mmol/l; für ΔG°’ wird K dimensionslos behandelt (beide Seiten haben gleich viele Teilchen)'],
  limits: ['Lebende Zellen sind offene Systeme: Viele Reaktionen werden durch ständige Zu- und Abfuhr fern vom Gleichgewicht gehalten (Fließgleichgewicht).'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'zeeck', locator: 'Kap. „Chemische Reaktionen“ (Gleichgewicht, Kinetik, Energetik)' }, { id: 'atkins', locator: 'Kap. „Chemical equilibrium“ und „Chemical kinetics“' }],
  status: 'zu_pruefen',
  reviewNote: 'Analytische Lösung; Tests prüfen K = k₁/k₂ und die Unabhängigkeit der Gleichgewichtslage vom Katalysator.',
  references: [
    { name: 'Standard: K = 4', params: {}, expectation: '[B]_eq = 8, [A]_eq = 2 mmol/l; ΔG°’ ≈ −3,6 kJ/mol' },
    { name: 'Mit Katalysator', params: { cat: true }, expectation: 'Gleiche Endwerte, aber zehnmal schneller erreicht' },
    { name: 'K = 1', params: { k1: 0.5, k2: 0.5 }, expectation: '[A]_eq = [B]_eq; ΔG°’ = 0' },
  ],
  run(p): SimResult {
    const f = bool(p, 'cat') ? 10 : 1;
    const k1 = num(p, 'k1') * f;
    const k2 = num(p, 'k2') * f;
    const A0 = num(p, 'A0');
    const B0 = num(p, 'B0');
    const K = num(p, 'k1') / num(p, 'k2');
    const T = 310.15;
    const dG0 = (-R * T * Math.log(K)) / 1000;
    const tau = 1 / (k1 + k2);
    const tEnd = 6 / (num(p, 'k1') + num(p, 'k2')); // bezogen auf die unkatalysierte Reaktion
    const ts = range(0, tEnd, 241);
    const sim = ts.map((t) => equilibrium(k1, k2, A0, B0, t));
    const eq = equilibrium(k1, k2, A0, B0, Infinity);
    const warnings: string[] = [];
    let dGstart: number | string = '—';
    if (A0 > 0 && B0 > 0) dGstart = dG0 + (R * T * Math.log(B0 / A0)) / 1000;
    else if (A0 > 0) dGstart = '−∞ (noch kein B: Reaktion läuft sicher nach rechts)';
    else if (B0 > 0) dGstart = '+∞ (kein A: Reaktion läuft nach links)';
    if (A0 + B0 === 0) warnings.push('Ohne Stoff gibt es keine Reaktion – bitte eine Anfangskonzentration > 0 wählen.');
    return {
      ok: true,
      warnings,
      scalars: {
        K: { label: 'Gleichgewichtskonstante K = k₁/k₂', value: K, unit: '', digits: 2 },
        Aeq: { label: '[A] im Gleichgewicht', value: eq.Aeq, unit: 'mmol/l', digits: 2 },
        Beq: { label: '[B] im Gleichgewicht', value: eq.Beq, unit: 'mmol/l', digits: 2 },
        tau: { label: 'Zeitkonstante τ = 1/(k₁+k₂)', value: tau, unit: 's', digits: 3 },
        dG0: { label: 'ΔG°’ = −RT·ln K (37 °C)', value: dG0, unit: 'kJ/mol', digits: 2 },
        dG: { label: 'ΔG zu Beginn', value: dGstart, unit: typeof dGstart === 'number' ? 'kJ/mol' : '', digits: 2 },
      },
      charts: [
        { id: 'conc', title: 'Konzentrationen gegen die Zeit', x: ts, xLabel: 'Zeit', xUnit: 's', yLabel: 'Konzentration', yUnit: 'mmol/l', yMin: 0,
          series: [{ key: 'A', label: '[A]', y: sim.map((x) => x.A) }, { key: 'B', label: '[B]', y: sim.map((x) => x.B), dash: '6 4' }],
          hlines: [{ y: eq.Beq, label: '[B]_eq' }, { y: eq.Aeq, label: '[A]_eq' }],
          description: 'A nimmt ab, B nimmt zu, bis die Geschwindigkeiten von Hin- und Rückreaktion gleich sind. Danach bleiben die Konzentrationen konstant – die Reaktionen laufen aber weiter (dynamisches Gleichgewicht).' },
        { id: 'rates', title: 'Geschwindigkeit von Hin- und Rückreaktion', x: ts, xLabel: 'Zeit', xUnit: 's', yLabel: 'Geschwindigkeit', yUnit: 'mmol/(l·s)', yMin: 0,
          series: [{ key: 'vh', label: 'v_hin = k₁·[A]', y: sim.map((x) => k1 * x.A) }, { key: 'vr', label: 'v_rück = k₂·[B]', y: sim.map((x) => k2 * x.B), dash: '6 4' }],
          description: 'Im Gleichgewicht schneiden sich die Kurven: v_hin = v_rück. Ein Katalysator hebt beide gleich stark an.' },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Redoxpotenziale (biochemische Standardpotenziale, pH 7)
// ---------------------------------------------------------------------------

export const REDOX: Record<string, { label: string; E0: number; z: number; ox: string; red: string }> = {
  nad: { label: 'NAD⁺ / NADH', E0: -0.32, z: 2, ox: 'NAD⁺', red: 'NADH' },
  pyr: { label: 'Pyruvat / Laktat', E0: -0.19, z: 2, ox: 'Pyruvat', red: 'Laktat' },
  fum: { label: 'Fumarat / Succinat', E0: 0.03, z: 2, ox: 'Fumarat', red: 'Succinat' },
  cytc: { label: 'Cytochrom c (Fe³⁺ / Fe²⁺)', E0: 0.25, z: 1, ox: 'Cyt c (Fe³⁺)', red: 'Cyt c (Fe²⁺)' },
  o2: { label: '½ O₂ / H₂O', E0: 0.82, z: 2, ox: '½ O₂', red: 'H₂O' },
};

export function nernstRedox(E0: number, z: number, ratioOxRed: number, tempC = 37) {
  return E0 + ((R * (tempC + 273.15)) / (z * F)) * Math.log(ratioOxRed);
}

export const redoxModel: ModelDef = {
  id: 'redox',
  version: '1.0.0',
  title: 'Redoxpotenziale und Energie der Elektronenübertragung',
  module: 'molecule',
  purpose: 'Mit der Nernst-Gleichung das Redoxpotenzial eines Paares in Abhängigkeit vom Verhältnis oxidierte/reduzierte Form berechnen und aus der Potenzialdifferenz zweier Paare die freie Enthalpie ΔG = −z·F·ΔE ableiten.',
  process: 'Elektronenübertragung von einem Donor (negativeres Potenzial) auf einen Akzeptor (positiveres Potenzial), z. B. in der Atmungskette.',
  equations: ['E = E°’ + (R·T)/(z·F) · ln([ox]/[red])', 'bei 37 °C: E = E°’ + (61,5 mV / z) · log₁₀([ox]/[red])', 'ΔE = E_Akzeptor − E_Donor', 'ΔG = −z·F·ΔE  (hier für z = 2 übertragene Elektronen)'],
  params: [
    { key: 'donor', label: 'Donor-Paar (gibt Elektronen ab)', unit: '', type: 'select', default: 'nad', options: Object.entries(REDOX).map(([value, r]) => ({ value, label: `${r.label} (E°’ = ${r.E0.toFixed(2).replace('.', ',')} V)` })), description: 'Reduzierte Form dieses Paares wird oxidiert.' },
    { key: 'acceptor', label: 'Akzeptor-Paar (nimmt Elektronen auf)', unit: '', type: 'select', default: 'o2', options: Object.entries(REDOX).map(([value, r]) => ({ value, label: `${r.label} (E°’ = ${r.E0.toFixed(2).replace('.', ',')} V)` })), description: 'Oxidierte Form dieses Paares wird reduziert.' },
    { key: 'logRatio', label: 'Donor: log₁₀([ox]/[red])', unit: '', min: -3, max: 3, step: 0.1, default: 0, description: '0 = gleich viel oxidierte und reduzierte Form (Standardbedingung). In der Zelle ist z. B. NAD⁺/NADH im Zytosol weit oxidiert.' },
  ],
  initialConditions: 'Stationäre Rechnung, 37 °C, pH 7.',
  included: ['Nernst-Gleichung für Redoxpaare', 'Biochemische Standardpotenziale E°’ (pH 7)', 'ΔG aus ΔE'],
  omitted: ['Verhältnis ox/red des Akzeptors (als Standard angenommen)', 'Aktivitäten', 'Kopplung an Protonentransport'],
  assumptions: ['Biochemischer Standardzustand (pH 7, 25 °C für E°’), Rechnung bei 37 °C', 'Für ΔG werden 2 Elektronen betrachtet'],
  limits: ['Die angegebenen E°’-Werte sind gerundete Lehrbuchwerte; enzymgebundene Gruppen (z. B. FAD) können abweichen.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'zeeck', locator: 'Kap. „Oxidation und Reduktion“' }, { id: 'stryer', locator: 'Kap. „Oxidative phosphorylation“ (Tabelle der Standardpotenziale)' }],
  status: 'zu_pruefen',
  reviewNote: 'E°’-Werte gerundet nach Standardlehrbüchern; ΔG(NADH → O₂) ≈ −220 kJ/mol als Prüfwert getestet.',
  references: [
    { name: 'NADH → O₂ (Atmungskette gesamt)', params: {}, expectation: 'ΔE ≈ 1,14 V; ΔG ≈ −220 kJ/mol' },
    { name: 'Succinat → O₂', params: { donor: 'fum' }, expectation: 'ΔE ≈ 0,79 V; kleinerer Energiebetrag als bei NADH' },
    { name: 'Rückwärts: H₂O → NAD⁺', params: { donor: 'o2', acceptor: 'nad' }, expectation: 'ΔG > 0: läuft nicht freiwillig ab' },
  ],
  run(p): SimResult {
    const d = REDOX[str(p, 'donor')];
    const a = REDOX[str(p, 'acceptor')];
    const lr = num(p, 'logRatio');
    const Ed = nernstRedox(d.E0, d.z, 10 ** lr);
    const Ea = a.E0;
    const dE = Ea - Ed;
    const dG = (-2 * F * dE) / 1000;
    const xs = range(-3, 3, 121);
    const warnings: string[] = [];
    if (str(p, 'donor') === str(p, 'acceptor')) warnings.push('Donor und Akzeptor sind dasselbe Paar – bei Standardverhältnis ist ΔE = 0.');
    return {
      ok: true,
      warnings,
      scalars: {
        Ed: { label: `E (Donor ${d.label})`, value: Ed * 1000, unit: 'mV', digits: 0 },
        Ea: { label: `E°’ (Akzeptor ${a.label})`, value: Ea * 1000, unit: 'mV', digits: 0 },
        dE: { label: 'ΔE = E_Akzeptor − E_Donor', value: dE * 1000, unit: 'mV', digits: 0 },
        dG: { label: 'ΔG für 2 Elektronen', value: dG, unit: 'kJ/mol', digits: 0 },
        dir: { label: 'Freiwillig?', value: dG < 0 ? 'ja (exergon)' : dG > 0 ? 'nein (endergon)' : 'im Gleichgewicht', unit: '' },
      },
      charts: [{
        id: 'nernst', title: `Redoxpotenzial von ${d.label} gegen das Verhältnis [ox]/[red]`, x: xs, xLabel: 'log₁₀([ox]/[red])', xUnit: '', yLabel: 'E', yUnit: 'mV',
        series: [{ key: 'E', label: `E (${d.label})`, y: xs.map((x) => nernstRedox(d.E0, d.z, 10 ** x) * 1000) }],
        hlines: [{ y: Ea * 1000, label: `Akzeptor ${a.ox}` }, { y: d.E0 * 1000, label: 'E°’' }], vmarker: { x: lr, label: 'aktuell' },
        description: `Pro Zehnerpotenz im Verhältnis ändert sich das Potenzial bei 37 °C um ${(61.5 / d.z).toFixed(1).replace('.', ',')} mV (z = ${d.z}). Elektronen fließen freiwillig zum Paar mit dem positiveren Potenzial.`,
      }],
    };
  },
};
