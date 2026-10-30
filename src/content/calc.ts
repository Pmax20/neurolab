import type { Lesson, Task, TaskLevel } from './types';

// Berechnungstrainer (Lastenheft 6.3 und 7.2): Jede Vorlage erzeugt bei jedem Aufruf neue Ausgangsdaten.
// Eine Aufgabe besteht aus: gegebene Größen · gesuchte Größe · Formelwahl · Ergebnis mit Einheit ·
// Einheitenkontrolle · Rechenweg · Ergebnisdeutung · typische Fehler.

export type Rng = () => number;
export function rngFrom(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: Rng, a: T[]): T => a[Math.floor(r() * a.length)];
const num = (r: Rng, lo: number, hi: number, step: number) => Math.round((lo + step * Math.floor(r() * (Math.round((hi - lo) / step) + 1))) * 1e6) / 1e6;

/** Zahl deutsch formatieren (signifikante Stellen, ohne Tausenderpunkte). */
export function fmt(x: number, sig = 3): string {
  if (!Number.isFinite(x)) return String(x);
  if (x === 0) return '0';
  const v = Number(x.toPrecision(sig));
  const abs = Math.abs(v);
  if (abs >= 1e9 || abs < 1e-4) {
    const [m, e] = v.toExponential(sig - 1).split('e');
    const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const exp = String(Number(e)).replace('-', '⁻').replace(/\d/g, (d) => sup[Number(d)]);
    const mant = String(Number(m)).replace('.', ',');
    return mant === '1' ? `10${exp}` : `${mant} · 10${exp}`;
  }
  return String(v).replace('.', ',');
}

/** Einheit vereinheitlichen: Groß-/Kleinschreibung, Leerzeichen, Malpunkte, Hochzahlen, µ. */
export function normUnit(u: string): string {
  return u
    .trim()
    .toLowerCase()
    .replace(/[\s·*⋅]/g, '')
    .replace(/μ/g, 'µ')
    .replace(/\^2|(?<=[a-z])2(?![0-9])/g, '²')
    .replace(/\^3|(?<=[a-z])3(?![0-9])/g, '³')
    .replace(/liter/g, 'l')
    .replace(/^(ohne|keine|einheitenlos)$/, '');
}
const U = (m: Record<string, number>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [normUnit(k), v]));
const NONE = U({ '': 1, '-': 1, fach: 1, x: 1 });

export interface CalcInstance {
  context: string;
  givens: string[];
  sought: string;
  soughtOptions: string[];
  formula: string;
  formulaOptions: string[];
  result: number; // in der kanonischen Einheit
  unit: string; // kanonische Einheit (Anzeige), '' = ohne Einheit
  units: Record<string, number>; // akzeptierte Schreibweisen → Faktor zur kanonischen Einheit
  tolerance?: { rel?: number; abs?: number };
  steps: string[];
  check: string; // Einheitenkontrolle
  interpretation: string;
  pitfalls: string[];
}

export interface CalcTemplate {
  id: string;
  subject: 'Chemie' | 'Physik' | 'Histologie';
  lesson: string;
  objective: number;
  level: 1 | 2 | 3;
  title: string;
  source: string;
  make: (r: Rng) => CalcInstance;
}

const SUBS: [string, number][] = [['Glukose', 180.16], ['Natriumchlorid', 58.44], ['Kaliumchlorid', 74.55], ['Harnstoff', 60.06]];
const G = 9.81;
const NA = 6.022e23;
const COUNT = U({ '': 1, '-': 1, moleküle: 1, molekule: 1, teilchen: 1, atome: 1 });
const GASES: [string, string, number][] = [['Kohlendioxid', 'CO₂', 44.01], ['Sauerstoff', 'O₂', 32.0], ['Stickstoff', 'N₂', 28.02], ['Methan', 'CH₄', 16.04], ['Wasserstoff', 'H₂', 2.016]];
const GASES_AND_MORE: [string, string, number][] = [...GASES, ['Wasser', 'H₂O', 18.02], ['Glukose', 'C₆H₁₂O₆', 180.16], ['Ethanol', 'C₂H₆O', 46.07]];
const ACIDS: [string, string, number][] = [['Schwefelsäure', 'H₂SO₄', 98.08], ['Chlorwasserstoff', 'HCl', 36.46], ['Natriumhydroxid', 'NaOH', 40.0], ['Salpetersäure', 'HNO₃', 63.01]];
const SALTS: [string, number, string, number][] = [['CaCl₂', 110.98, 'Cl⁻', 2], ['CaCl₂', 110.98, 'Ca²⁺', 1], ['Na₂SO₄', 142.04, 'Na⁺', 2], ['MgCl₂', 95.21, 'Cl⁻', 2], ['NaCl', 58.44, 'Na⁺', 1], ['K₂HPO₄', 174.18, 'K⁺', 2]];

export const CALC_TEMPLATES: CalcTemplate[] = [
  // ------------------------------------------------------------------ Chemie
  { id: 'stoffmenge', subject: 'Chemie', lesson: 'konzentrationen', objective: 0, level: 1, title: 'Stoffmenge aus Masse und molarer Masse', source: 'zeeck', make: (r) => {
    const [name, M] = pick(r, SUBS); const m = num(r, 2, 60, 0.5); const n = (m / M) * 1000;
    return { context: `Für eine Lösung werden ${fmt(m, 4)} g ${name} abgewogen. Welche Stoffmenge ist das?`, givens: [`m = ${fmt(m, 4)} g`, `M(${name}) = ${fmt(M, 5)} g/mol`],
      sought: 'Stoffmenge n', soughtOptions: ['Stoffmenge n', 'Masse m', 'molare Masse M', 'Stoffmengenkonzentration c'],
      formula: 'n = m / M', formulaOptions: ['n = m / M', 'n = m · M', 'n = M / m', 'c = n / V'],
      result: n, unit: 'mmol', units: U({ mmol: 1, mol: 1000, µmol: 0.001, umol: 0.001 }),
      steps: [`n = ${fmt(m, 4)} g / ${fmt(M, 5)} g/mol`, `n = ${fmt(n / 1000, 4)} mol = ${fmt(n, 4)} mmol`], check: 'g / (g/mol) = mol', interpretation: `${fmt(m, 4)} g ${name} entsprechen ${fmt(n)} mmol.`,
      pitfalls: ['Masse und molare Masse vertauscht (n = M/m).', 'mol und mmol verwechselt – Faktor 1000.'] };
  } },
  { id: 'konz-masse', subject: 'Chemie', lesson: 'konzentrationen', objective: 0, level: 2, title: 'Konzentration aus Masse und Volumen', source: 'zeeck', make: (r) => {
    const [name, M] = pick(r, SUBS); const m = num(r, 50, 900, 10); const V = num(r, 50, 500, 50); const nm = m / M; const c = nm / (V / 1000);
    return { context: `${m} mg ${name} werden zu ${V} ml Lösung gelöst. Wie groß ist die Stoffmengenkonzentration?`, givens: [`m = ${m} mg`, `V = ${V} ml`, `M = ${fmt(M, 5)} g/mol`],
      sought: 'Stoffmengenkonzentration c', soughtOptions: ['Stoffmengenkonzentration c', 'Stoffmenge n', 'Massenkonzentration β', 'Osmolarität'],
      formula: 'c = m / (M · V)', formulaOptions: ['c = m / (M · V)', 'c = m · M / V', 'c = m / V', 'c = M / (m · V)'],
      result: c, unit: 'mmol/l', units: U({ 'mmol/l': 1, 'mol/l': 1000, 'µmol/l': 0.001, 'umol/l': 0.001, mm: 1 }),
      steps: [`n = ${m} mg / ${fmt(M, 5)} g/mol = ${fmt(nm, 4)} mmol`, `V = ${V} ml = ${fmt(V / 1000)} l`, `c = ${fmt(nm, 4)} mmol / ${fmt(V / 1000)} l = ${fmt(c, 4)} mmol/l`], check: 'mg / (g/mol) = mmol; mmol / l = mmol/l',
      interpretation: `Die Lösung enthält ${fmt(c)} mmol ${name} pro Liter.`, pitfalls: ['Volumen nicht in Liter umgerechnet (Ergebnis 1000-fach zu klein).', 'Massenkonzentration (g/l) statt Stoffmengenkonzentration angegeben.'] };
  } },
  { id: 'prozent', subject: 'Chemie', lesson: 'konzentrationen', objective: 0, level: 3, title: 'Prozentangabe in Stoffmengenkonzentration', source: 'zeeck', make: (r) => {
    const [w, name, M] = pick(r, [[0.9, 'Natriumchlorid', 58.44], [5, 'Glukose', 180.16], [10, 'Glukose', 180.16], [20, 'Glukose', 180.16], [3, 'Natriumchlorid', 58.44], [7.45, 'Kaliumchlorid', 74.55]] as [number, string, number][]);
    const c = ((w * 10) / M) * 1000;
    return { context: `Wie groß ist die Stoffmengenkonzentration einer ${fmt(w, 3)}-prozentigen ${name}-Lösung (Angabe in Masse pro Volumen, m/V)?`, givens: [`w = ${fmt(w, 3)} % (m/V)`, `M = ${fmt(M, 5)} g/mol`],
      sought: 'Stoffmengenkonzentration c', soughtOptions: ['Stoffmengenkonzentration c', 'Massenanteil w', 'Osmolarität', 'Stoffmenge n'],
      formula: 'c = (w · 10 g/l) / M', formulaOptions: ['c = (w · 10 g/l) / M', 'c = w / M', 'c = w · M', 'c = M / (w · 10 g/l)'],
      result: c, unit: 'mmol/l', units: U({ 'mmol/l': 1, 'mol/l': 1000 }),
      steps: [`${fmt(w, 3)} % (m/V) = ${fmt(w, 3)} g pro 100 ml = ${fmt(w * 10, 3)} g/l`, `c = ${fmt(w * 10, 3)} g/l / ${fmt(M, 5)} g/mol = ${fmt(c / 1000, 4)} mol/l = ${fmt(c, 4)} mmol/l`], check: '(g/l) / (g/mol) = mol/l',
      interpretation: `Eine ${fmt(w, 3)} %ige ${name}-Lösung hat ${fmt(c)} mmol/l.`, pitfalls: ['% (m/V) bedeutet g pro 100 ml – nicht pro Liter.', 'Prozent direkt durch die molare Masse geteilt, ohne auf g/l umzurechnen.'] };
  } },
  { id: 'osmol', subject: 'Chemie', lesson: 'konzentrationen', objective: 1, level: 1, title: 'Osmolarität aus Konzentration und Teilchenzahl', source: 'zeeck', make: (r) => {
    const [name, i, eq] = pick(r, [['Glukose', 1, 'Glukose dissoziiert nicht'], ['NaCl', 2, 'NaCl → Na⁺ + Cl⁻'], ['KCl', 2, 'KCl → K⁺ + Cl⁻'], ['CaCl₂', 3, 'CaCl₂ → Ca²⁺ + 2 Cl⁻'], ['MgSO₄', 2, 'MgSO₄ → Mg²⁺ + SO₄²⁻']] as [string, number, string][]);
    const c = pick(r, [2, 5, 10, 20, 50, 100, 150]);
    return { context: `Eine Lösung enthält ${c} mmol/l ${name}. Wie groß ist ihre (ideale) Osmolarität?`, givens: [`c = ${c} mmol/l`, eq],
      sought: 'Osmolarität', soughtOptions: ['Osmolarität', 'Stoffmengenkonzentration', 'Tonizität', 'Äquivalentkonzentration'],
      formula: 'Osmolarität = c · i', formulaOptions: ['Osmolarität = c · i', 'Osmolarität = c / i', 'Osmolarität = c + i', 'Osmolarität = c'],
      result: c * i, unit: 'mosmol/l', units: U({ 'mosmol/l': 1, 'mosm/l': 1, 'osmol/l': 1000, 'osm/l': 1000 }),
      steps: [`Teilchen pro Formeleinheit: i = ${i}`, `Osmolarität = ${c} mmol/l · ${i} = ${c * i} mosmol/l`], check: 'mmol/l · Teilchenzahl = mosmol/l',
      interpretation: 'Die ideale Osmolarität nimmt an, dass das Salz vollständig dissoziiert; real ist der Wert etwas kleiner (osmotischer Koeffizient).', pitfalls: ['Teilchenzahl vergessen (Ergebnis = c).', 'Bei CaCl₂ nur 2 statt 3 Teilchen gezählt.'] };
  } },
  { id: 'mval', subject: 'Chemie', lesson: 'konzentrationen', objective: 2, level: 1, title: 'Äquivalentkonzentration', source: 'zeeck', make: (r) => {
    const [ion, z] = pick(r, [['Ca²⁺', 2], ['Mg²⁺', 2], ['Na⁺', 1], ['K⁺', 1], ['Fe³⁺', 3]] as [string, number][]);
    const c = pick(r, [0.5, 0.8, 1.2, 1.25, 2.5, 4, 140]);
    return { context: `Eine Probe enthält ${fmt(c, 3)} mmol/l ${ion}. Wie viel ist das in mval/l?`, givens: [`c = ${fmt(c, 3)} mmol/l`, `Ladungszahl z = ${z}`],
      sought: 'Äquivalentkonzentration', soughtOptions: ['Äquivalentkonzentration', 'Osmolarität', 'Stoffmenge', 'Ionenstärke'],
      formula: 'c(eq) = c · z', formulaOptions: ['c(eq) = c · z', 'c(eq) = c / z', 'c(eq) = c + z', 'c(eq) = c · z²'],
      result: c * z, unit: 'mval/l', units: U({ 'mval/l': 1, 'meq/l': 1, 'mmol(eq)/l': 1 }),
      steps: [`c(eq) = ${fmt(c, 3)} mmol/l · ${z} = ${fmt(c * z, 3)} mval/l`], check: 'mmol/l · Ladungszahl = mval/l',
      interpretation: 'Die Äquivalentkonzentration zählt Ladungen statt Teilchen.', pitfalls: ['Durch z geteilt statt multipliziert.'] };
  } },
  { id: 'ph', subject: 'Chemie', lesson: 'saeure-base', objective: 1, level: 1, title: 'pH einer starken Säure', source: 'zeeck', make: (r) => {
    const c = pick(r, [0.01, 0.1, 1, 10, 100]); const ph = -Math.log10(c / 1000);
    return { context: `Salzsäure ist eine starke Säure und dissoziiert vollständig. Welchen pH hat eine HCl-Lösung mit ${fmt(c, 2)} mmol/l?`, givens: [`c(HCl) = ${fmt(c, 2)} mmol/l = ${fmt(c / 1000, 2)} mol/l`, 'vollständige Dissoziation: c(H₃O⁺) = c(HCl)'],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'pOH-Wert', 'pKs-Wert', 'Stoffmengenkonzentration'],
      formula: 'pH = −lg c(H₃O⁺)  (c in mol/l)', formulaOptions: ['pH = −lg c(H₃O⁺)  (c in mol/l)', 'pH = lg c(H₃O⁺)', 'pH = 14 − lg c(H₃O⁺)', 'pH = −lg c(H₃O⁺)  (c in mmol/l)'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.03 },
      steps: [`c(H₃O⁺) = ${fmt(c / 1000, 2)} mol/l`, `pH = −lg(${fmt(c / 1000, 2)}) = ${fmt(ph, 3)}`], check: 'Der pH ist dimensionslos; die Konzentration muss in mol/l eingesetzt werden.',
      interpretation: 'Jede Verzehnfachung der H₃O⁺-Konzentration senkt den pH um eine Einheit.', pitfalls: ['Konzentration in mmol/l eingesetzt (pH um 3 zu klein).', 'Vorzeichen vergessen.'] };
  } },
  { id: 'ph-krumm', subject: 'Chemie', lesson: 'saeure-base', objective: 1, level: 2, title: 'pH mit dem Taschenrechner', source: 'zeeck', make: (r) => {
    const c = pick(r, [0.2, 0.5, 2, 3, 5, 20, 50]); const ph = -Math.log10(c / 1000);
    return { context: `Welchen pH hat eine HCl-Lösung mit ${fmt(c, 2)} mmol/l (vollständige Dissoziation)?`, givens: [`c(HCl) = ${fmt(c, 2)} mmol/l`],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'pOH-Wert', 'pKs-Wert', 'H₃O⁺-Konzentration'],
      formula: 'pH = −lg c(H₃O⁺)  (c in mol/l)', formulaOptions: ['pH = −lg c(H₃O⁺)  (c in mol/l)', 'pH = lg c(H₃O⁺)', 'pH = −ln c(H₃O⁺)', 'pH = 14 + lg c(H₃O⁺)'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.03 },
      steps: [`c(H₃O⁺) = ${fmt(c / 1000, 2)} mol/l`, `pH = −lg(${fmt(c / 1000, 2)}) = ${fmt(ph, 3)}`], check: 'dimensionslos',
      interpretation: 'Merke: lg 2 ≈ 0,3 und lg 5 ≈ 0,7 – damit lässt sich der pH auch ohne Rechner abschätzen.', pitfalls: ['Natürlichen Logarithmus (ln) statt Zehnerlogarithmus (lg) benutzt.'] };
  } },
  { id: 'verduennung', subject: 'Chemie', lesson: 'stoechiometrie', objective: 2, level: 2, title: 'Verdünnen mit c₁·V₁ = c₂·V₂', source: 'zeeck', make: (r) => {
    const c1 = pick(r, [0.5, 1, 2]); const c2 = pick(r, [10, 20, 50, 100, 150]); const V2 = pick(r, [100, 250, 500, 1000]); const V1 = (c2 * V2) / (c1 * 1000);
    return { context: `Aus einer Stammlösung mit ${fmt(c1, 2)} mol/l sollen ${V2} ml einer Lösung mit ${c2} mmol/l hergestellt werden. Wie viel Stammlösung wird benötigt?`, givens: [`c₁ = ${fmt(c1, 2)} mol/l`, `c₂ = ${c2} mmol/l`, `V₂ = ${V2} ml`],
      sought: 'Volumen V₁ der Stammlösung', soughtOptions: ['Volumen V₁ der Stammlösung', 'Endvolumen V₂', 'Endkonzentration c₂', 'zuzugebendes Lösungsmittel'],
      formula: 'V₁ = c₂ · V₂ / c₁', formulaOptions: ['V₁ = c₂ · V₂ / c₁', 'V₁ = c₁ · V₂ / c₂', 'V₁ = c₁ · c₂ / V₂', 'V₁ = V₂ / c₂'],
      result: V1, unit: 'ml', units: U({ ml: 1, l: 1000, µl: 0.001, ul: 0.001, 'cm³': 1 }),
      steps: [`c₁ = ${fmt(c1, 2)} mol/l = ${c1 * 1000} mmol/l`, `V₁ = ${c2} mmol/l · ${V2} ml / ${c1 * 1000} mmol/l = ${fmt(V1, 4)} ml`, `Mit Lösungsmittel auf ${V2} ml auffüllen (also ${fmt(V2 - V1, 4)} ml zugeben).`], check: '(mmol/l · ml) / (mmol/l) = ml',
      interpretation: `Der Verdünnungsfaktor beträgt ${fmt((c1 * 1000) / c2)}.`, pitfalls: ['Konzentrationen in verschiedenen Einheiten eingesetzt (Faktor 1000).', 'c₁ und c₂ vertauscht – dann wäre V₁ größer als V₂.'] };
  } },
  { id: 'verdfaktor', subject: 'Chemie', lesson: 'stoechiometrie', objective: 2, level: 1, title: 'Verdünnungsfaktor', source: 'zeeck', make: (r) => {
    const c1 = pick(r, [50, 200, 500, 1000]); const f = pick(r, [2, 4, 5, 10, 20, 25, 50]); const c2 = c1 / f;
    return { context: `Eine Lösung mit ${c1} mmol/l soll auf ${fmt(c2, 3)} mmol/l verdünnt werden. Wie groß ist der Verdünnungsfaktor?`, givens: [`c₁ = ${c1} mmol/l`, `c₂ = ${fmt(c2, 3)} mmol/l`],
      sought: 'Verdünnungsfaktor', soughtOptions: ['Verdünnungsfaktor', 'Endvolumen', 'Stoffmenge', 'Ausgangskonzentration'],
      formula: 'f = c₁ / c₂', formulaOptions: ['f = c₁ / c₂', 'f = c₂ / c₁', 'f = c₁ − c₂', 'f = c₁ · c₂'],
      result: f, unit: '', units: NONE,
      steps: [`f = ${c1} mmol/l / ${fmt(c2, 3)} mmol/l = ${f}`], check: '(mmol/l) / (mmol/l) → dimensionslos', interpretation: `1 Teil Lösung wird auf ${f} Teile Endvolumen aufgefüllt.`, pitfalls: ['Kehrwert angegeben (f < 1).'] };
  } },
  { id: 'stoech-co2', subject: 'Chemie', lesson: 'stoechiometrie', objective: 1, level: 3, title: 'Stöchiometrie: CO₂ aus Glukose', source: 'zeeck', make: (r) => {
    const m = num(r, 1, 20, 0.5); const n = m / 180.16; const mc = n * 6 * 44.01;
    return { context: `Bei der vollständigen Oxidation gilt C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. Wie viel Gramm CO₂ entstehen aus ${fmt(m, 3)} g Glukose?`, givens: [`m(Glc) = ${fmt(m, 3)} g`, 'M(Glc) = 180,16 g/mol', 'M(CO₂) = 44,01 g/mol', 'n(CO₂) : n(Glc) = 6 : 1'],
      sought: 'Masse des entstehenden CO₂', soughtOptions: ['Masse des entstehenden CO₂', 'Stoffmenge Glukose', 'Masse Sauerstoff', 'Volumen CO₂'],
      formula: 'm(CO₂) = 6 · m(Glc) · M(CO₂) / M(Glc)', formulaOptions: ['m(CO₂) = 6 · m(Glc) · M(CO₂) / M(Glc)', 'm(CO₂) = m(Glc) · M(CO₂) / M(Glc)', 'm(CO₂) = 6 · m(Glc)', 'm(CO₂) = m(Glc) / 6'],
      result: mc, unit: 'g', units: U({ g: 1, mg: 0.001, kg: 1000 }),
      steps: [`n(Glc) = ${fmt(m, 3)} g / 180,16 g/mol = ${fmt(n * 1000, 4)} mmol`, `n(CO₂) = 6 · ${fmt(n * 1000, 4)} mmol = ${fmt(6 * n * 1000, 4)} mmol`, `m(CO₂) = ${fmt(6 * n, 4)} mol · 44,01 g/mol = ${fmt(mc, 4)} g`], check: 'g / (g/mol) · (g/mol) = g',
      interpretation: 'Es entsteht mehr Masse CO₂ als Glukose eingesetzt wurde – der zusätzliche Sauerstoff stammt aus dem O₂.', pitfalls: ['Den Faktor 6 aus der Gleichung vergessen.', 'Massen statt Stoffmengen ins Verhältnis gesetzt.'] };
  } },
  // ------------------------------------------------------------------ Seminar 2: Stoffmenge, Gase, Konzentrationsmaße
  { id: 'teilchenzahl', subject: 'Chemie', lesson: 'stoechiometrie', objective: 3, level: 1, title: 'Teilchenzahl aus der Masse', source: 'zeeck', make: (r) => {
    const [name, f, M] = pick(r, GASES_AND_MORE); const m = num(r, 1, 50, 0.5); const n = m / M; const N = n * NA;
    return { context: `Wie viele Moleküle sind in ${fmt(m, 3)} g ${name} (${f}) enthalten?`, givens: [`m = ${fmt(m, 3)} g`, `M(${f}) = ${fmt(M, 4)} g/mol`, 'N_A = 6,022 · 10²³ mol⁻¹'],
      sought: 'Teilchenzahl N', soughtOptions: ['Teilchenzahl N', 'Stoffmenge n', 'molare Masse M', 'Gasvolumen V'],
      formula: 'N = (m / M) · N_A', formulaOptions: ['N = (m / M) · N_A', 'N = (m / M) / N_A', 'N = m · M · N_A', 'N = m / N_A'],
      result: N, unit: '', units: COUNT,
      steps: [`n = ${fmt(m, 3)} g / ${fmt(M, 4)} g/mol = ${fmt(n, 4)} mol`, `N = ${fmt(n, 4)} mol · 6,022 · 10²³ mol⁻¹ = ${fmt(N, 3)}`], check: 'g / (g/mol) · mol⁻¹ = dimensionslose Anzahl',
      interpretation: 'Eingabe z. B. als 3,01e23 oder 3,01 · 10^23.', pitfalls: ['Durch N_A geteilt statt multipliziert.', 'Masse direkt mit N_A multipliziert, ohne vorher in mol umzurechnen.'] };
  } },
  { id: 'molvolumen', subject: 'Chemie', lesson: 'stoechiometrie', objective: 3, level: 2, title: 'Gasvolumen aus der Masse', source: 'zeeck', make: (r) => {
    const [name, f, M] = pick(r, GASES); const m = num(r, 2, 100, 1); const n = m / M; const V = n * 22.4;
    return { context: `Welches Volumen nehmen ${m} g ${name} (${f}) bei Normbedingungen (0 °C, 1013 hPa) ein?`, givens: [`m = ${m} g`, `M(${f}) = ${fmt(M, 4)} g/mol`, 'V_m = 22,4 l/mol'],
      sought: 'Gasvolumen V', soughtOptions: ['Gasvolumen V', 'Stoffmenge n', 'Dichte ρ', 'Teilchenzahl N'],
      formula: 'V = (m / M) · V_m', formulaOptions: ['V = (m / M) · V_m', 'V = m · V_m', 'V = (M / m) · V_m', 'V = m / V_m'],
      result: V, unit: 'l', units: U({ l: 1, ml: 0.001, 'm³': 1000, dm3: 1, 'dm³': 1 }),
      steps: [`n = ${m} g / ${fmt(M, 4)} g/mol = ${fmt(n, 4)} mol`, `V = ${fmt(n, 4)} mol · 22,4 l/mol = ${fmt(V, 4)} l`], check: 'mol · l/mol = l',
      interpretation: 'Bei Raumtemperatur wäre das Volumen etwas größer (≈ 24 l/mol bei 20 °C).', pitfalls: ['Masse direkt mit 22,4 multipliziert, ohne in mol umzurechnen.'] };
  } },
  { id: 'gas-teilchen', subject: 'Chemie', lesson: 'stoechiometrie', objective: 3, level: 2, title: 'Moleküle in einem Gasvolumen', source: 'zeeck', make: (r) => {
    const [name, f] = pick(r, GASES); const V = pick(r, [0.5, 1, 2, 5.6, 11.2, 22.4, 44.8]); const n = V / 22.4; const N = n * NA;
    return { context: `Wie viele Moleküle befinden sich in ${fmt(V, 3)} l ${name} (${f}) bei Normbedingungen?`, givens: [`V = ${fmt(V, 3)} l`, 'V_m = 22,4 l/mol', 'N_A = 6,022 · 10²³ mol⁻¹'],
      sought: 'Teilchenzahl N', soughtOptions: ['Teilchenzahl N', 'Masse m', 'Stoffmenge n', 'Dichte ρ'],
      formula: 'N = (V / V_m) · N_A', formulaOptions: ['N = (V / V_m) · N_A', 'N = V · V_m · N_A', 'N = (V_m / V) · N_A', 'N = V · N_A'],
      result: N, unit: '', units: COUNT,
      steps: [`n = ${fmt(V, 3)} l / 22,4 l/mol = ${fmt(n, 4)} mol`, `N = ${fmt(n, 4)} mol · 6,022 · 10²³ mol⁻¹ = ${fmt(N, 3)}`], check: 'l / (l/mol) · mol⁻¹ → Anzahl',
      interpretation: 'Die Teilchenzahl hängt nicht vom Gas ab – gleiche Volumina enthalten gleich viele Teilchen (Satz von Avogadro).', pitfalls: ['Mit der Molmasse statt mit dem Molvolumen gerechnet.'] };
  } },
  { id: 'ethanol-co2', subject: 'Chemie', lesson: 'stoechiometrie', objective: 1, level: 3, title: 'Verbrennung von Ethanol: CO₂-Volumen', source: 'zeeck', make: (r) => {
    const m = num(r, 0.5, 6, 0.5); const n = (m * 1000) / 46.07; const nc = 2 * n; const V = nc * 22.4;
    return { context: `Ein Ethanol-Brenner verbrennt ${fmt(m, 3)} kg Ethanol (C₂H₆O) vollständig: C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O. Welches Volumen CO₂ entsteht bei Normbedingungen?`, givens: [`m(Ethanol) = ${fmt(m, 3)} kg`, 'M(C₂H₆O) = 46,07 g/mol', 'n(CO₂) : n(Ethanol) = 2 : 1', 'V_m = 22,4 l/mol'],
      sought: 'Volumen des entstehenden CO₂', soughtOptions: ['Volumen des entstehenden CO₂', 'Masse des Ethanols', 'Sauerstoffbedarf', 'Stoffmenge Wasser'],
      formula: 'V(CO₂) = 2 · (m / M) · V_m', formulaOptions: ['V(CO₂) = 2 · (m / M) · V_m', 'V(CO₂) = (m / M) · V_m', 'V(CO₂) = 3 · (m / M) · V_m', 'V(CO₂) = 2 · m · V_m'],
      result: V, unit: 'l', units: U({ l: 1, 'm³': 1000, ml: 0.001 }),
      steps: [`n(Ethanol) = ${fmt(m * 1000, 4)} g / 46,07 g/mol = ${fmt(n, 4)} mol`, `n(CO₂) = 2 · ${fmt(n, 4)} mol = ${fmt(nc, 4)} mol`, `V(CO₂) = ${fmt(nc, 4)} mol · 22,4 l/mol = ${fmt(V, 4)} l (= ${fmt(V / 1000, 3)} m³)`, `Masse zum Vergleich: ${fmt(nc * 44.01 / 1000, 3)} kg CO₂`], check: 'g / (g/mol) · l/mol = l',
      interpretation: 'Aus einem Kilogramm Ethanol entstehen fast 1000 Liter CO₂.', pitfalls: ['Den Faktor 2 aus der Gleichung vergessen.', 'kg nicht in g umgerechnet.'] };
  } },
  { id: 'elektrolyse', subject: 'Chemie', lesson: 'stoechiometrie', objective: 1, level: 2, title: 'Elektrolyse von Wasser', source: 'zeeck', make: (r) => {
    const m = pick(r, [9, 18, 27, 36, 45, 54, 90]); const n = m / 18.02; const gas = pick(r, ['H₂', 'O₂']); const V = (gas === 'H₂' ? n : n / 2) * 22.4;
    return { context: `${m} g Wasser werden elektrolytisch zerlegt: 2 H₂O → 2 H₂ + O₂. Wie viel Liter ${gas === 'H₂' ? 'Wasserstoff' : 'Sauerstoff'} entstehen bei Normbedingungen?`, givens: [`m(H₂O) = ${m} g`, 'M(H₂O) = 18,02 g/mol', 'V_m = 22,4 l/mol'],
      sought: `Volumen ${gas}`, soughtOptions: ['Volumen H₂', 'Volumen O₂', 'Masse H₂O', 'Stoffmenge H₂O'],
      formula: gas === 'H₂' ? 'V(H₂) = n(H₂O) · V_m' : 'V(O₂) = ½ · n(H₂O) · V_m', formulaOptions: gas === 'H₂' ? ['V(H₂) = n(H₂O) · V_m', 'V(H₂) = 2 · n(H₂O) · V_m', 'V(H₂) = ½ · n(H₂O) · V_m', 'V(H₂) = m(H₂O) · V_m'] : ['V(O₂) = ½ · n(H₂O) · V_m', 'V(O₂) = n(H₂O) · V_m', 'V(O₂) = 2 · n(H₂O) · V_m', 'V(O₂) = m(H₂O) · V_m'],
      result: V, unit: 'l', units: U({ l: 1, ml: 0.001 }),
      steps: [`n(H₂O) = ${m} g / 18,02 g/mol = ${fmt(n, 4)} mol`, gas === 'H₂' ? `n(H₂) = n(H₂O) = ${fmt(n, 4)} mol (2 : 2)` : `n(O₂) = ½ · n(H₂O) = ${fmt(n / 2, 4)} mol (2 : 1)`, `V = ${fmt(gas === 'H₂' ? n : n / 2, 4)} mol · 22,4 l/mol = ${fmt(V, 4)} l`], check: 'mol · l/mol = l',
      interpretation: 'Wasserstoff und Sauerstoff entstehen immer im Volumenverhältnis 2 : 1.', pitfalls: ['Koeffizientenverhältnis von H₂ und O₂ vertauscht.'] };
  } },
  { id: 'einwaage', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 1, title: 'Einwaage für eine Lösung', source: 'zeeck', make: (r) => {
    const [name, M] = pick(r, SUBS); const c = pick(r, [0.05, 0.1, 0.2, 0.5, 1]); const V = pick(r, [10, 50, 100, 250, 500, 1000]); const m = c * (V / 1000) * M;
    return { context: `Wie viel ${name} muss man einwiegen, um ${V} ml einer ${fmt(c, 2)}-molaren Lösung herzustellen?`, givens: [`c = ${fmt(c, 2)} mol/l`, `V = ${V} ml`, `M = ${fmt(M, 5)} g/mol`],
      sought: 'Einwaage m', soughtOptions: ['Einwaage m', 'Stoffmenge n', 'Volumen V', 'Massenanteil w'],
      formula: 'm = c · V · M', formulaOptions: ['m = c · V · M', 'm = c · V / M', 'm = c / (V · M)', 'm = c · M'],
      result: m, unit: 'g', units: U({ g: 1, mg: 0.001, kg: 1000 }),
      steps: [`V = ${V} ml = ${fmt(V / 1000, 3)} l`, `m = ${fmt(c, 2)} mol/l · ${fmt(V / 1000, 3)} l · ${fmt(M, 5)} g/mol = ${fmt(m, 4)} g`, `Einwiegen und auf ${V} ml auffüllen.`], check: 'mol/l · l · g/mol = g',
      interpretation: 'Die Konzentration bezieht sich auf das Endvolumen – deshalb auffüllen, nicht zu einer festen Wassermenge geben.', pitfalls: ['ml nicht in l umgerechnet (Faktor 1000).'] };
  } },
  { id: 'auffuellen', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 2, title: 'Auffüllvolumen für eine Konzentration', source: 'zeeck', make: (r) => {
    const [name, f, M] = pick(r, ACIDS); const m = num(r, 1, 20, 0.5); const c = pick(r, [0.05, 0.1, 0.2, 0.25, 0.5]); const n = m / M; const V = (n / c) * 1000;
    return { context: `Auf welches Volumen muss man ${fmt(m, 3)} g ${name} (${f}) mit Wasser auffüllen, um eine Konzentration von ${fmt(c, 2)} mol/l zu erhalten?`, givens: [`m = ${fmt(m, 3)} g`, `M(${f}) = ${fmt(M, 4)} g/mol`, `c = ${fmt(c, 2)} mol/l`],
      sought: 'Endvolumen V', soughtOptions: ['Endvolumen V', 'Stoffmenge n', 'Einwaage m', 'Verdünnungsfaktor'],
      formula: 'V = (m / M) / c', formulaOptions: ['V = (m / M) / c', 'V = (m / M) · c', 'V = m / c', 'V = c · M / m'],
      result: V, unit: 'ml', units: U({ ml: 1, l: 1000, 'cm³': 1 }),
      steps: [`n = ${fmt(m, 3)} g / ${fmt(M, 4)} g/mol = ${fmt(n, 4)} mol`, `V = ${fmt(n, 4)} mol / ${fmt(c, 2)} mol/l = ${fmt(V / 1000, 4)} l = ${fmt(V, 4)} ml`], check: 'mol / (mol/l) = l',
      interpretation: 'Je höher die gewünschte Konzentration, desto kleiner das Endvolumen.', pitfalls: ['n mit c multipliziert statt dividiert.'] };
  } },
  { id: 'ionenkonz', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 2, title: 'Ionenkonzentration eines gelösten Salzes', source: 'zeeck', make: (r) => {
    const [salt, M, ion, k] = pick(r, SALTS); const m = num(r, 0.5, 5, 0.1); const V = pick(r, [50, 100, 200, 250, 500]); const cs = (m / M) / (V / 1000) * 1000; const ci = cs * k;
    return { context: `${fmt(m, 3)} g ${salt} werden zu ${V} ml Lösung gelöst. Wie groß ist die Konzentration der ${ion}-Ionen?`, givens: [`m = ${fmt(m, 3)} g`, `M(${salt}) = ${fmt(M, 5)} g/mol`, `V = ${V} ml`, `${k} ${ion} pro Formeleinheit`],
      sought: `Konzentration ${ion}`, soughtOptions: [`Konzentration ${ion}`, `Konzentration ${salt}`, 'Osmolarität', 'Massenkonzentration'],
      formula: `c(${ion}) = ${k} · m / (M · V)`, formulaOptions: [`c(${ion}) = ${k} · m / (M · V)`, `c(${ion}) = m / (M · V)`, `c(${ion}) = m / (${k} · M · V)`, `c(${ion}) = ${k} · m · M / V`].filter((v, i, a) => a.indexOf(v) === i),
      result: ci, unit: 'mmol/l', units: U({ 'mmol/l': 1, mm: 1, 'mol/l': 1000, m: 1000 }),
      steps: [`n(${salt}) = ${fmt(m, 3)} g / ${fmt(M, 5)} g/mol = ${fmt((m / M) * 1000, 4)} mmol`, `c(${salt}) = ${fmt((m / M) * 1000, 4)} mmol / ${fmt(V / 1000, 3)} l = ${fmt(cs, 4)} mmol/l`, `c(${ion}) = ${k} · ${fmt(cs, 4)} mmol/l = ${fmt(ci, 4)} mmol/l`], check: 'g / (g/mol) / l = mol/l',
      interpretation: `Pro Formeleinheit ${salt} entstehen ${k} ${ion}-Ionen.`, pitfalls: ['Die Zahl der Ionen pro Formeleinheit vergessen.', 'ml nicht in l umgerechnet.'] };
  } },
  { id: 'masseprozent', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 1, title: 'Masseprozent', source: 'zeeck', make: (r) => {
    const ms = num(r, 1, 30, 1); const mw = num(r, 50, 250, 10); const w = (ms / (ms + mw)) * 100;
    return { context: `${ms} g Natriumchlorid werden in ${mw} g Wasser gelöst. Wie groß ist der Massenanteil (Masseprozent) von NaCl?`, givens: [`m(NaCl) = ${ms} g`, `m(Wasser) = ${mw} g`],
      sought: 'Massenanteil w', soughtOptions: ['Massenanteil w', 'Stoffmengenkonzentration c', 'Volumenanteil φ', 'Massenkonzentration β'],
      formula: 'w = m(Stoff) / (m(Stoff) + m(Wasser))', formulaOptions: ['w = m(Stoff) / (m(Stoff) + m(Wasser))', 'w = m(Stoff) / m(Wasser)', 'w = m(Wasser) / m(Stoff)', 'w = m(Stoff) · m(Wasser)'],
      result: w, unit: '%', units: U({ '%': 1, 'gew%': 1, 'gew.-%': 1 }),
      steps: [`m(Lösung) = ${ms} g + ${mw} g = ${ms + mw} g`, `w = ${ms} g / ${ms + mw} g = ${fmt(w / 100, 3)} = ${fmt(w, 3)} %`], check: 'g / g → dimensionslos (in %)',
      interpretation: 'Bezugsgröße ist immer die ganze Lösung, nicht nur das Lösungsmittel.', pitfalls: ['Nur durch die Masse des Wassers geteilt.'] };
  } },
  { id: 'volumenprozent', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 1, title: 'Volumenprozent', source: 'zeeck', make: (r) => {
    const v = num(r, 10, 150, 5); const V = pick(r, [250, 500, 700, 1000]); const phi = (v / V) * 100;
    return { context: `${v} ml Ethanol werden mit Wasser auf ${V} ml aufgefüllt. Wie viel Volumenprozent Ethanol enthält die Mischung?`, givens: [`V(Ethanol) = ${v} ml`, `V(Mischung) = ${V} ml`],
      sought: 'Volumenanteil φ', soughtOptions: ['Volumenanteil φ', 'Massenanteil w', 'Molarität', 'Verdünnungsfaktor'],
      formula: 'φ = V(Ethanol) / V(Mischung)', formulaOptions: ['φ = V(Ethanol) / V(Mischung)', 'φ = V(Ethanol) / (V(Mischung) + V(Ethanol))', 'φ = V(Mischung) / V(Ethanol)', 'φ = V(Ethanol) · V(Mischung)'],
      result: phi, unit: '%', units: U({ '%': 1, 'vol%': 1, 'vol-%': 1, 'vol.-%': 1 }),
      steps: [`φ = ${v} ml / ${V} ml = ${fmt(phi / 100, 3)} = ${fmt(phi, 3)} Vol-%`], check: 'ml / ml → dimensionslos (in Vol-%)',
      interpretation: 'Hier ist das Endvolumen gegeben – deshalb nicht noch einmal das Ethanol dazuzählen.', pitfalls: ['Ethanolvolumen zum Endvolumen addiert.'] };
  } },
  { id: 'ppm', subject: 'Chemie', lesson: 'stoechiometrie', objective: 4, level: 1, title: 'ppm und ppb', source: 'zeeck', make: (r) => {
    const [stoff] = pick(r, [['Blei'], ['Nitrat'], ['Arsen'], ['Fluorid']]); const mg = pick(r, [0.002, 0.01, 0.05, 0.2, 0.5, 1.5, 3]); const kg = pick(r, [1, 2, 5, 10]); const ppm = mg / kg;
    return { context: `In ${kg} kg Wasser werden ${fmt(mg, 3)} mg ${stoff} gefunden. Wie groß ist der Anteil in ppm?`, givens: [`m(${stoff}) = ${fmt(mg, 3)} mg`, `m(Wasser) = ${kg} kg`, '1 ppm = 10⁻⁶ = 1 mg/kg'],
      sought: 'Massenanteil in ppm', soughtOptions: ['Massenanteil in ppm', 'Stoffmengenkonzentration', 'Volumenanteil', 'Masse in mg'],
      formula: 'Anteil = m(Stoff) / m(Wasser)', formulaOptions: ['Anteil = m(Stoff) / m(Wasser)', 'Anteil = m(Wasser) / m(Stoff)', 'Anteil = m(Stoff) · m(Wasser)', 'Anteil = m(Stoff) / 10⁶'],
      result: ppm, unit: 'ppm', units: U({ ppm: 1, ppb: 0.001, 'mg/kg': 1, 'µg/kg': 0.001, 'mg/l': 1 }),
      steps: [`Anteil = ${fmt(mg, 3)} mg / ${kg} kg = ${fmt(ppm, 3)} mg/kg`, `= ${fmt(ppm, 3)} ppm = ${fmt(ppm * 1000, 3)} ppb`], check: 'mg / kg = 10⁻⁶ → ppm',
      interpretation: 'Für verdünnte wässrige Lösungen gilt näherungsweise 1 ppm ≈ 1 mg/l.', pitfalls: ['ppm und ppb verwechselt (Faktor 1000).'] };
  } },
  // ------------------------------------------------------------------ Gleichgewicht, Löslichkeitsprodukt, Säuren/Basen (nach Seminar 2)
  { id: 'mwg-k', subject: 'Chemie', lesson: 'gleichgewicht', objective: 4, level: 1, title: 'Gleichgewichtskonstante aus Gleichgewichtskonzentrationen', source: 'zeeck', make: (r) => {
    const kind = pick(r, ['hi', 'co'] as const);
    if (kind === 'hi') {
      const h2 = num(r, 0.1, 0.5, 0.05), i2 = num(r, 0.1, 0.5, 0.05), hi = num(r, 0.6, 2.4, 0.1); const K = (hi * hi) / (h2 * i2);
      return { context: `Für H₂ + I₂ ⇌ 2 HI wurden im Gleichgewicht gemessen: [H₂] = ${fmt(h2)} mol/l, [I₂] = ${fmt(i2)} mol/l, [HI] = ${fmt(hi)} mol/l. Berechne K.`, givens: [`[H₂] = ${fmt(h2)} mol/l`, `[I₂] = ${fmt(i2)} mol/l`, `[HI] = ${fmt(hi)} mol/l`],
        sought: 'Gleichgewichtskonstante K', soughtOptions: ['Gleichgewichtskonstante K', 'Reaktionsgeschwindigkeit', 'Stoffmenge HI', 'Löslichkeitsprodukt'],
        formula: 'K = [HI]² / ([H₂]·[I₂])', formulaOptions: ['K = [HI]² / ([H₂]·[I₂])', 'K = [HI] / ([H₂]·[I₂])', 'K = ([H₂]·[I₂]) / [HI]²', 'K = 2·[HI] / ([H₂] + [I₂])'],
        result: K, unit: '', units: NONE, tolerance: { rel: 0.03 },
        steps: [`K = (${fmt(hi)})² / (${fmt(h2)} · ${fmt(i2)})`, `K = ${fmt(hi * hi)} / ${fmt(h2 * i2)} = ${fmt(K)}`], check: 'Einheiten: (mol/l)² / (mol/l)² – K ist hier dimensionslos, weil auf beiden Seiten gleich viele Teilchen stehen.',
        interpretation: K > 1 ? 'K > 1: Das Gleichgewicht liegt auf der Seite des Iodwasserstoffs.' : 'K < 1: Das Gleichgewicht liegt auf der Eduktseite.', pitfalls: ['Koeffizient 2 nicht als Exponent geschrieben.', 'Produkte und Edukte vertauscht.'] };
    }
    const co = num(r, 0.2, 0.8, 0.1), h2o = num(r, 0.2, 0.8, 0.1), co2 = num(r, 0.3, 1.5, 0.1), h2 = co2; const K = (co2 * h2) / (co * h2o);
    return { context: `Für CO + H₂O ⇌ CO₂ + H₂ (Gasphase) liegen im Gleichgewicht vor: [CO] = ${fmt(co)} mol/l, [H₂O] = ${fmt(h2o)} mol/l, [CO₂] = [H₂] = ${fmt(co2)} mol/l. Berechne K.`, givens: [`[CO] = ${fmt(co)} mol/l`, `[H₂O] = ${fmt(h2o)} mol/l`, `[CO₂] = [H₂] = ${fmt(co2)} mol/l`],
      sought: 'Gleichgewichtskonstante K', soughtOptions: ['Gleichgewichtskonstante K', 'Stoffmenge CO₂', 'Reaktionsquotient bei Beginn', 'Löslichkeitsprodukt'],
      formula: 'K = [CO₂]·[H₂] / ([CO]·[H₂O])', formulaOptions: ['K = [CO₂]·[H₂] / ([CO]·[H₂O])', 'K = [CO]·[H₂O] / ([CO₂]·[H₂])', 'K = [CO₂]·[H₂] / [CO]', 'K = [CO₂] + [H₂] − [CO] − [H₂O]'],
      result: K, unit: '', units: NONE, tolerance: { rel: 0.03 },
      steps: [`K = (${fmt(co2)} · ${fmt(h2)}) / (${fmt(co)} · ${fmt(h2o)})`, `K = ${fmt(co2 * h2)} / ${fmt(co * h2o)} = ${fmt(K)}`], check: 'Gleich viele Teilchen auf beiden Seiten → K dimensionslos.',
      interpretation: 'Hier ist Wasser ein gasförmiger Reaktionspartner und steht deshalb im MWG – anders als Wasser als Lösungsmittel.', pitfalls: ['Wasser weggelassen (das gilt nur für Wasser als Lösungsmittel).', 'Produkte und Edukte vertauscht.'] };
  } },
  { id: 'mwg-ester', subject: 'Chemie', lesson: 'gleichgewicht', objective: 4, level: 3, title: 'Gleichgewichtsmenge bei der Esterbildung (quadratische Gleichung)', source: 'zeeck', make: (r) => {
    const a = pick(r, [1, 1, 2]); const b = pick(r, [1, 2, 3, 4]); const K = 4;
    const x = (4 * (a + b) - Math.sqrt(16 * (a + b) ** 2 - 48 * a * b)) / 6;
    return { context: `Essigsäure + Ethanol ⇌ Essigsäureethylester + Wasser hat bei Raumtemperatur K = 4. Man setzt ${a} mol Essigsäure mit ${b} mol Ethanol um (ohne zusätzliches Wasser, Volumen kürzt sich heraus). Wie viel Ester liegt im Gleichgewicht vor?`, givens: [`n₀(Essigsäure) = ${a} mol`, `n₀(Ethanol) = ${b} mol`, 'K = 4', 'Ester und Wasser entstehen 1 : 1'],
      sought: 'Stoffmenge Ester im Gleichgewicht', soughtOptions: ['Stoffmenge Ester im Gleichgewicht', 'Gleichgewichtskonstante K', 'Ausbeute in Prozent', 'Konzentration Ethanol am Anfang'],
      formula: 'K = x² / ((n₀(Säure) − x)·(n₀(Alkohol) − x))', formulaOptions: ['K = x² / ((n₀(Säure) − x)·(n₀(Alkohol) − x))', 'K = x / (n₀(Säure) · n₀(Alkohol))', 'x = K · n₀(Säure)', 'K = (n₀(Säure) − x) / x'],
      result: x, unit: 'mol', units: U({ mol: 1, mmol: 0.001 }), tolerance: { rel: 0.02 },
      steps: ['Tabelle: Säure ' + a + ' − x, Alkohol ' + b + ' − x, Ester x, Wasser x', `4 = x² / ((${a} − x)(${b} − x))  →  3x² − ${4 * (a + b)}x + ${4 * a * b} = 0`, `x = [${4 * (a + b)} − √(${16 * (a + b) ** 2} − ${48 * a * b})] / 6 = ${fmt(x)} mol`, 'Die zweite Lösung ist größer als die eingesetzte Säuremenge und daher sinnlos.'],
      check: 'Ergebnis in mol; es muss kleiner sein als die kleinste Anfangsmenge.',
      interpretation: b > a ? `Mit Alkoholüberschuss entsteht mehr Ester (${fmt((x / a) * 100, 2)} % der Säure werden umgesetzt) – Le Chatelier.` : `Bei äquimolarem Einsatz werden nur 2/3 der Säure umgesetzt.`, pitfalls: ['Die falsche Lösung der quadratischen Gleichung gewählt.', 'Wasser als Lösungsmittel weggelassen – hier ist es ein Produkt und gehört ins MWG.'] };
  } },
  { id: 'loeslichkeit', subject: 'Chemie', lesson: 'gleichgewicht', objective: 6, level: 2, title: 'Löslichkeit aus dem Löslichkeitsprodukt', source: 'zeeck', make: (r) => {
    const s = pick(r, [['AgCl', 1.8e-10, 'AB', 'Ag⁺', 'Cl⁻'], ['BaSO₄', 1.1e-10, 'AB', 'Ba²⁺', 'SO₄²⁻'], ['AgBr', 5.0e-13, 'AB', 'Ag⁺', 'Br⁻'], ['CaF₂', 3.9e-11, 'AB2', 'Ca²⁺', 'F⁻'], ['Mg(OH)₂', 5.6e-12, 'AB2', 'Mg²⁺', 'OH⁻']] as [string, number, 'AB' | 'AB2', string, string][]);
    const [name, ksp, typ, cat, an] = s; const L = typ === 'AB' ? Math.sqrt(ksp) : Math.cbrt(ksp / 4);
    return { context: `Das Löslichkeitsprodukt von ${name} beträgt ${fmt(ksp, 2)} ${typ === 'AB' ? 'mol²/l²' : 'mol³/l³'}. Wie groß ist die Löslichkeit L (in mol/l) in reinem Wasser?`, givens: [`K_L(${name}) = ${fmt(ksp, 2)} ${typ === 'AB' ? 'mol²/l²' : 'mol³/l³'}`, typ === 'AB' ? `${name} ⇌ ${cat} + ${an}` : `${name} ⇌ ${cat} + 2 ${an}`],
      sought: 'Löslichkeit L', soughtOptions: ['Löslichkeit L', 'Löslichkeitsprodukt K_L', 'Masse des Bodenkörpers', 'Ionenprodukt'],
      formula: typ === 'AB' ? 'K_L = L² → L = √K_L' : 'K_L = L·(2L)² = 4L³ → L = ∛(K_L/4)', formulaOptions: ['K_L = L² → L = √K_L', 'K_L = L·(2L)² = 4L³ → L = ∛(K_L/4)', 'L = K_L / 2', 'K_L = 2L² → L = √(K_L/2)'],
      result: L, unit: 'mol/l', units: U({ 'mol/l': 1, 'mmol/l': 0.001, 'µmol/l': 1e-6, 'umol/l': 1e-6, m: 1 }), tolerance: { rel: 0.03 },
      steps: typ === 'AB' ? [`[${cat}] = [${an}] = L`, `K_L = L² = ${fmt(ksp, 2)}`, `L = √${fmt(ksp, 2)} = ${fmt(L)} mol/l`] : [`[${cat}] = L, [${an}] = 2L`, `K_L = L · (2L)² = 4L³ = ${fmt(ksp, 2)}`, `L = ∛(${fmt(ksp, 2)} / 4) = ${fmt(L)} mol/l`],
      check: typ === 'AB' ? '√(mol²/l²) = mol/l' : '∛(mol³/l³) = mol/l',
      interpretation: `Pro Liter lösen sich nur etwa ${fmt(L * 1e6, 2)} µmol ${name} – ein schwer lösliches Salz.`, pitfalls: typ === 'AB' ? ['K_L halbiert statt die Wurzel gezogen.'] : ['[F⁻] bzw. [OH⁻] = 2L vergessen.', 'Den Faktor 2 nicht mitquadriert (2L² statt 4L³).'] };
  } },
  { id: 'ksp', subject: 'Chemie', lesson: 'gleichgewicht', objective: 6, level: 2, title: 'Löslichkeitsprodukt aus der Löslichkeit in g/l', source: 'zeeck', make: (r) => {
    const s = pick(r, [['AgCl', 143.32, 1.9e-3], ['BaSO₄', 233.39, 2.45e-3], ['CaCO₃', 100.09, 6.0e-3]] as [string, number, number][]);
    const [name, M, base] = s; const g = Number((base * (0.9 + r() * 0.2)).toPrecision(2)); const L = g / M; const K = L * L;
    return { context: `In 1 l Wasser lösen sich bei 25 °C ${fmt(g, 2)} g ${name} (M = ${fmt(M, 5)} g/mol). Berechne das Löslichkeitsprodukt.`, givens: [`β = ${fmt(g, 2)} g/l`, `M(${name}) = ${fmt(M, 5)} g/mol`, 'Salz vom Typ AB: 1 Kation + 1 Anion'],
      sought: 'Löslichkeitsprodukt K_L', soughtOptions: ['Löslichkeitsprodukt K_L', 'Löslichkeit L in mol/l', 'molare Masse', 'Gleichgewichtskonstante der Fällung'],
      formula: 'L = β / M ; K_L = L²', formulaOptions: ['L = β / M ; K_L = L²', 'K_L = β²', 'K_L = β / M', 'L = β · M ; K_L = L²'],
      result: K, unit: 'mol²/l²', units: U({ 'mol²/l²': 1, 'mol2/l2': 1, 'mol^2/l^2': 1 }), tolerance: { rel: 0.04 },
      steps: [`L = ${fmt(g, 2)} g/l / ${fmt(M, 5)} g/mol = ${fmt(L)} mol/l`, `K_L = L² = (${fmt(L)})² = ${fmt(K)} mol²/l²`], check: '(mol/l)² = mol²/l²',
      interpretation: 'Erst in Stoffmenge umrechnen, dann quadrieren – K_L bezieht sich immer auf mol/l.', pitfalls: ['Die Massenkonzentration quadriert, ohne durch M zu teilen.', 'Nicht quadriert.'] };
  } },
  { id: 'ph-base', subject: 'Chemie', lesson: 'saeure-base', objective: 1, level: 2, title: 'pH einer starken Base', source: 'zeeck', make: (r) => {
    const base = pick(r, [['NaOH', 1], ['KOH', 1], ['Ca(OH)₂', 2]] as [string, number][]); const c = pick(r, [0.1, 1, 5, 10, 20, 50]);
    const oh = (c / 1000) * base[1]; const poh = -Math.log10(oh); const ph = 14 - poh;
    return { context: `Welchen pH hat eine ${base[0]}-Lösung mit ${fmt(c, 2)} mmol/l? (vollständige Dissoziation, 25 °C)`, givens: [`c(${base[0]}) = ${fmt(c, 2)} mmol/l`, base[1] === 2 ? 'pro Formeleinheit 2 OH⁻' : 'pro Formeleinheit 1 OH⁻', 'pH + pOH = 14'],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'pOH-Wert', 'H₃O⁺-Konzentration', 'pKb-Wert'],
      formula: 'pOH = −lg c(OH⁻) ; pH = 14 − pOH', formulaOptions: ['pOH = −lg c(OH⁻) ; pH = 14 − pOH', 'pH = −lg c(OH⁻)', 'pH = 14 + lg c(Base)  (c in mmol/l)', 'pH = 7 + c(OH⁻)'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.03 },
      steps: [`c(OH⁻) = ${base[1] === 2 ? '2 · ' : ''}${fmt(c / 1000, 2)} mol/l = ${fmt(oh, 2)} mol/l`, `pOH = −lg(${fmt(oh, 2)}) = ${fmt(poh, 3)}`, `pH = 14 − ${fmt(poh, 3)} = ${fmt(ph, 3)}`], check: 'dimensionslos; Konzentration in mol/l',
      interpretation: 'Basische Lösungen haben pH > 7; je mehr OH⁻, desto höher.', pitfalls: ['pOH als pH angegeben.', 'Bei Ca(OH)₂ die 2 OH⁻ vergessen.'] };
  } },
  { id: 'ph-schwach', subject: 'Chemie', lesson: 'saeure-base', objective: 4, level: 2, title: 'pH einer schwachen Säure', source: 'zeeck', make: (r) => {
    const a = pick(r, [['Essigsäure', 4.76], ['Milchsäure', 3.86], ['Ameisensäure', 3.75], ['Ammoniumchlorid (NH₄⁺)', 9.25]] as [string, number][]);
    const c = pick(r, [0.01, 0.05, 0.1, 0.2, 0.5, 1]); const ph = 0.5 * (a[1] - Math.log10(c));
    return { context: `Berechne den pH einer ${fmt(c, 2)}-molaren Lösung von ${a[0]} (pK_S = ${fmt(a[1], 3)}).`, givens: [`c = ${fmt(c, 2)} mol/l`, `pK_S = ${fmt(a[1], 3)}`, 'schwache Säure: protolysiert nur teilweise'],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'pK_S-Wert', 'Protolysegrad', 'pOH-Wert'],
      formula: 'pH = ½·(pK_S − lg c)', formulaOptions: ['pH = ½·(pK_S − lg c)', 'pH = −lg c', 'pH = pK_S + lg c', 'pH = ½·(pK_S + lg c)'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.04 },
      steps: [`lg c = lg ${fmt(c, 2)} = ${fmt(Math.log10(c), 3)}`, `pH = ½ · (${fmt(a[1], 3)} − (${fmt(Math.log10(c), 3)})) = ${fmt(ph, 3)}`], check: 'dimensionslos',
      interpretation: `Eine starke Säure gleicher Konzentration hätte pH ${fmt(-Math.log10(c), 2)} – die schwache Säure ist deutlich weniger sauer.`, pitfalls: ['Mit pH = −lg c gerechnet wie bei einer starken Säure.', 'Vorzeichen von lg c übersehen (lg 0,1 = −1).'] };
  } },
  { id: 'ph-schwache-base', subject: 'Chemie', lesson: 'saeure-base', objective: 4, level: 3, title: 'pH einer schwachen Base (Ammoniak)', source: 'zeeck', make: (r) => {
    const c = pick(r, [0.01, 0.05, 0.1, 0.2, 0.5]); const pkb = 14 - 9.25; const poh = 0.5 * (pkb - Math.log10(c)); const ph = 14 - poh;
    return { context: `Berechne den pH einer Ammoniaklösung mit c(NH₃) = ${fmt(c, 2)} mol/l. Gegeben ist pK_S(NH₄⁺) = 9,25.`, givens: [`c(NH₃) = ${fmt(c, 2)} mol/l`, 'pK_S(NH₄⁺) = 9,25', 'pK_S + pK_B = 14'],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'pK_B-Wert', 'pOH-Wert', 'Konzentration NH₄⁺'],
      formula: 'pK_B = 14 − pK_S ; pOH = ½·(pK_B − lg c) ; pH = 14 − pOH', formulaOptions: ['pK_B = 14 − pK_S ; pOH = ½·(pK_B − lg c) ; pH = 14 − pOH', 'pH = ½·(pK_S − lg c)', 'pH = 14 − lg c', 'pOH = pK_S − lg c'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.04 },
      steps: [`pK_B = 14 − 9,25 = ${fmt(pkb, 3)}`, `pOH = ½ · (${fmt(pkb, 3)} − (${fmt(Math.log10(c), 3)})) = ${fmt(poh, 3)}`, `pH = 14 − ${fmt(poh, 3)} = ${fmt(ph, 3)}`], check: 'dimensionslos',
      interpretation: 'Ammoniak ist eine schwache Base: Die Lösung ist basisch, aber weit weniger als NaOH gleicher Konzentration.', pitfalls: ['Mit dem pK_S der konjugierten Säure statt mit pK_B gerechnet.', 'pOH nicht in pH umgerechnet.'] };
  } },
  { id: 'puffer', subject: 'Chemie', lesson: 'saeure-base', objective: 2, level: 2, title: 'pH eines Puffers (Henderson-Hasselbalch)', source: 'zeeck', make: (r) => {
    const p = pick(r, [['Essigsäure', 'Natriumacetat', 4.76], ['Dihydrogenphosphat (H₂PO₄⁻)', 'Hydrogenphosphat (HPO₄²⁻)', 7.21], ['Ammoniumchlorid (NH₄⁺)', 'Ammoniak', 9.25]] as [string, string, number][]);
    const nha = pick(r, [10, 20, 40, 50, 80]); const na = pick(r, [10, 20, 25, 40, 100]); const ph = p[2] + Math.log10(na / nha);
    return { context: `Ein Puffer enthält ${nha} mmol ${p[0]} und ${na} mmol ${p[1]} in derselben Lösung (pK_S = ${fmt(p[2], 3)}). Welchen pH hat er?`, givens: [`n(Säure) = ${nha} mmol`, `n(konj. Base) = ${na} mmol`, `pK_S = ${fmt(p[2], 3)}`],
      sought: 'pH-Wert', soughtOptions: ['pH-Wert', 'Pufferkapazität', 'pK_S-Wert', 'Stoffmenge der Säure'],
      formula: 'pH = pK_S + lg(n(A⁻) / n(HA))', formulaOptions: ['pH = pK_S + lg(n(A⁻) / n(HA))', 'pH = pK_S + lg(n(HA) / n(A⁻))', 'pH = pK_S · n(A⁻) / n(HA)', 'pH = ½·(pK_S − lg c)'],
      result: ph, unit: '', units: NONE, tolerance: { abs: 0.03 },
      steps: [`Verhältnis A⁻ / HA = ${na} / ${nha} = ${fmt(na / nha)}`, `lg ${fmt(na / nha)} = ${fmt(Math.log10(na / nha), 3)}`, `pH = ${fmt(p[2], 3)} + (${fmt(Math.log10(na / nha), 3)}) = ${fmt(ph, 3)}`], check: 'Stoffmengen- oder Konzentrationsverhältnis – das Volumen kürzt sich heraus.',
      interpretation: na === nha ? 'Bei gleichen Mengen ist pH = pK_S – maximale Pufferwirkung.' : na > nha ? 'Mehr Base als Säure: pH liegt über dem pK_S.' : 'Mehr Säure als Base: pH liegt unter dem pK_S.', pitfalls: ['Säure und Base im Bruch vertauscht.', 'Den natürlichen Logarithmus benutzt.'] };
  } },
  { id: 'puffer-verhaeltnis', subject: 'Chemie', lesson: 'saeure-base', objective: 3, level: 3, title: 'Verhältnis HCO₃⁻ zu CO₂ im Blut', source: 'zeeck', make: (r) => {
    const ph = pick(r, [7.1, 7.2, 7.3, 7.4, 7.5, 7.6]); const ratio = 10 ** (ph - 6.1);
    return { context: `Im Blut gilt für den Bikarbonatpuffer pK_S ≈ 6,1. Welches Verhältnis [HCO₃⁻] : [CO₂] liegt bei pH ${fmt(ph, 2)} vor?`, givens: [`pH = ${fmt(ph, 2)}`, 'pK_S = 6,1'],
      sought: 'Verhältnis [HCO₃⁻] / [CO₂]', soughtOptions: ['Verhältnis [HCO₃⁻] / [CO₂]', 'pCO₂ in mmHg', 'pK_S-Wert', 'Konzentration HCO₃⁻'],
      formula: '[A⁻]/[HA] = 10^(pH − pK_S)', formulaOptions: ['[A⁻]/[HA] = 10^(pH − pK_S)', '[A⁻]/[HA] = pH − pK_S', '[A⁻]/[HA] = 10^(pK_S − pH)', '[A⁻]/[HA] = pH / pK_S'],
      result: ratio, unit: '', units: NONE, tolerance: { rel: 0.03 },
      steps: [`pH − pK_S = ${fmt(ph, 2)} − 6,1 = ${fmt(ph - 6.1, 2)}`, `Verhältnis = 10^${fmt(ph - 6.1, 2)} = ${fmt(ratio)}`], check: 'dimensionslos',
      interpretation: ph === 7.4 ? 'Bei normalem pH 7,4 ist das Verhältnis etwa 20 : 1.' : ph < 7.35 ? 'Weniger HCO₃⁻ im Verhältnis zu CO₂ als normal (20 : 1): Azidose.' : ph > 7.45 ? 'Mehr HCO₃⁻ im Verhältnis zu CO₂ als normal: Alkalose.' : 'Im Normalbereich von etwa 20 : 1.', pitfalls: ['Exponent vertauscht (pK_S − pH).', 'Die Differenz direkt als Verhältnis genommen.'] };
  } },
  { id: 'titration', subject: 'Chemie', lesson: 'saeure-base', objective: 6, level: 2, title: 'Verbrauch an Natronlauge bei der Titration', source: 'zeeck', make: (r) => {
    const a = pick(r, [['Salzsäure', 'HCl', 1], ['Schwefelsäure', 'H₂SO₄', 2], ['Essigsäure', 'CH₃COOH', 1]] as [string, string, number][]);
    const ca = pick(r, [0.05, 0.1, 0.2, 0.5]); const Va = pick(r, [10, 20, 25, 50]); const cb = pick(r, [0.1, 0.2, 0.5, 1]); const Vb = (a[2] * ca * Va) / cb;
    return { context: `${Va} ml ${a[0]} (${a[1]}, c = ${fmt(ca, 2)} mol/l) werden mit Natronlauge (c = ${fmt(cb, 2)} mol/l) titriert. Wie viel Natronlauge wird bis zum Äquivalenzpunkt verbraucht?`, givens: [`V(Säure) = ${Va} ml`, `c(Säure) = ${fmt(ca, 2)} mol/l`, `c(NaOH) = ${fmt(cb, 2)} mol/l`, `abgegebene Protonen pro Molekül: z = ${a[2]}`],
      sought: 'Volumen Natronlauge', soughtOptions: ['Volumen Natronlauge', 'pH am Äquivalenzpunkt', 'Stoffmenge Säure', 'Konzentration der Natronlauge'],
      formula: 'V(NaOH) = z · c(Säure) · V(Säure) / c(NaOH)', formulaOptions: ['V(NaOH) = z · c(Säure) · V(Säure) / c(NaOH)', 'V(NaOH) = c(NaOH) · V(Säure) / c(Säure)', 'V(NaOH) = V(Säure)', 'V(NaOH) = c(Säure) · V(Säure) · c(NaOH)'],
      result: Vb, unit: 'ml', units: U({ ml: 1, l: 1000, 'cm³': 1 }), tolerance: { rel: 0.02 },
      steps: [`n(H⁺) = ${a[2] > 1 ? `${a[2]} · ` : ''}${fmt(ca, 2)} mol/l · ${fmt(Va / 1000, 3)} l = ${fmt((a[2] * ca * Va) / 1000)} mol`, `V(NaOH) = ${fmt((a[2] * ca * Va) / 1000)} mol / ${fmt(cb, 2)} mol/l = ${fmt(Vb / 1000)} l = ${fmt(Vb)} ml`], check: 'mol / (mol/l) = l → in ml umrechnen',
      interpretation: a[1] === 'CH₃COOH' ? 'Der Verbrauch hängt nur von der Stoffmenge ab, nicht von der Säurestärke – der pH am Äquivalenzpunkt liegt bei Essigsäure aber im Basischen.' : a[2] === 2 ? 'Schwefelsäure verbraucht doppelt so viel Lauge wie eine gleich konzentrierte einprotonige Säure.' : 'Bei starker Säure und starker Base liegt der Äquivalenzpunkt bei pH 7.', pitfalls: ['Bei Schwefelsäure z = 2 vergessen.', 'Gedacht, eine schwache Säure verbrauche weniger Lauge.'] };
  } },
  { id: 'alkan-masse', subject: 'Chemie', lesson: 'kohlenwasserstoffe', objective: 0, level: 1, title: 'Molare Masse eines Alkans', source: 'zeeck', make: (r) => {
    const names = ['Methan', 'Ethan', 'Propan', 'Butan', 'Pentan', 'Hexan', 'Heptan', 'Octan', 'Nonan', 'Decan'];
    const n = pick(r, [3, 4, 5, 6, 7, 8, 9, 10]); const h = 2 * n + 2; const M = n * 12.01 + h * 1.008;
    return { context: `Berechne die molare Masse von ${names[n - 1]} (M(C) = 12,01 g/mol, M(H) = 1,008 g/mol).`, givens: [`${names[n - 1]}: Alkan mit ${n} C-Atomen`, 'M(C) = 12,01 g/mol', 'M(H) = 1,008 g/mol'],
      sought: 'molare Masse M', soughtOptions: ['molare Masse M', 'Stoffmenge n', 'Masse m', 'Zahl der Isomere'],
      formula: 'CₙH₂ₙ₊₂ ; M = n·M(C) + (2n+2)·M(H)', formulaOptions: ['CₙH₂ₙ₊₂ ; M = n·M(C) + (2n+2)·M(H)', 'CₙH₂ₙ ; M = n·M(C) + 2n·M(H)', 'M = n·M(C)', 'CₙH₂ₙ₋₂ ; M = n·M(C) + (2n−2)·M(H)'],
      result: M, unit: 'g/mol', units: U({ 'g/mol': 1, 'kg/mol': 1000 }), tolerance: { rel: 0.005 },
      steps: [`Summenformel: C${n}H${h}`, `M = ${n} · 12,01 + ${h} · 1,008 = ${fmt(n * 12.01, 4)} + ${fmt(h * 1.008, 4)} = ${fmt(M, 4)} g/mol`], check: 'g/mol',
      interpretation: 'Jede zusätzliche CH₂-Gruppe erhöht die molare Masse um etwa 14 g/mol.', pitfalls: ['Mit der Alken-Formel CₙH₂ₙ gerechnet.', 'Die zwei zusätzlichen H an den Kettenenden vergessen.'] };
  } },
  { id: 'verbrennung-co2', subject: 'Chemie', lesson: 'kohlenwasserstoffe', objective: 5, level: 2, title: 'CO₂ aus der Verbrennung eines Kohlenwasserstoffs', source: 'zeeck', make: (r) => {
    const g = pick(r, [['Methan', 'CH₄', 16.04, 1], ['Propan', 'C₃H₈', 44.1, 3], ['Butan', 'C₄H₁₀', 58.12, 4], ['Octan', 'C₈H₁₈', 114.23, 8]] as [string, string, number, number][]);
    const m = pick(r, [10, 22, 44, 100, 250, 1000]); const n = m / g[2]; const mco2 = n * g[3] * 44.01;
    return { context: `${m} g ${g[0]} (${g[1]}, M = ${fmt(g[2], 4)} g/mol) verbrennen vollständig. Wie viel Gramm CO₂ entstehen? (M(CO₂) = 44,01 g/mol)`, givens: [`m(${g[1]}) = ${m} g`, `M(${g[1]}) = ${fmt(g[2], 4)} g/mol`, `pro Molekül ${g[3]} C → ${g[3]} CO₂`, 'M(CO₂) = 44,01 g/mol'],
      sought: 'Masse CO₂', soughtOptions: ['Masse CO₂', 'Stoffmenge O₂', 'Masse Wasser', 'Volumen CO₂'],
      formula: 'n(KW) = m/M ; n(CO₂) = Zahl der C · n(KW) ; m(CO₂) = n · M(CO₂)', formulaOptions: ['n(KW) = m/M ; n(CO₂) = Zahl der C · n(KW) ; m(CO₂) = n · M(CO₂)', 'm(CO₂) = m(KW)', 'm(CO₂) = m(KW) · M(CO₂)', 'n(CO₂) = n(KW) ; m(CO₂) = n · M(CO₂)'],
      result: mco2, unit: 'g', units: U({ g: 1, kg: 1000, mg: 0.001 }), tolerance: { rel: 0.02 },
      steps: [`n(${g[1]}) = ${m} g / ${fmt(g[2], 4)} g/mol = ${fmt(n)} mol`, `n(CO₂) = ${g[3]} · ${fmt(n)} mol = ${fmt(n * g[3])} mol`, `m(CO₂) = ${fmt(n * g[3])} mol · 44,01 g/mol = ${fmt(mco2)} g`], check: 'mol · g/mol = g',
      interpretation: `Es entsteht mehr CO₂ (Masse) als Brennstoff eingesetzt wurde, weil der Sauerstoff aus der Luft dazukommt.`, pitfalls: ['Die Zahl der C-Atome pro Molekül vergessen.', 'Massen direkt gleichgesetzt statt über Stoffmengen zu rechnen.'] };
  } },
  // ------------------------------------------------------------------ Atombau, Osmose, Elektrochemie, Energetik und Kinetik
  { id: 'atommasse-mittel', subject: 'Chemie', lesson: 'atommodell', objective: 3, level: 2, title: 'Mittlere Atommasse aus Isotopenhäufigkeiten', source: 'zeeck', make: (r) => {
    const e = pick(r, [['Chlor', '³⁵Cl', 34.969, '³⁷Cl', 36.966, 75.78], ['Kupfer', '⁶³Cu', 62.930, '⁶⁵Cu', 64.928, 69.15], ['Bor', '¹⁰B', 10.013, '¹¹B', 11.009, 19.9], ['Brom', '⁷⁹Br', 78.918, '⁸¹Br', 80.916, 50.69]] as [string, string, number, string, number, number][]);
    const [name, i1, m1, i2, m2, p1] = e; const M = (p1 / 100) * m1 + (1 - p1 / 100) * m2;
    return { context: `${name} besteht in der Natur zu ${fmt(p1, 4)} % aus ${i1} (${fmt(m1, 5)} u) und zu ${fmt(100 - p1, 4)} % aus ${i2} (${fmt(m2, 5)} u). Berechne die mittlere Atommasse.`, givens: [`${i1}: ${fmt(p1, 4)} %, ${fmt(m1, 5)} u`, `${i2}: ${fmt(100 - p1, 4)} %, ${fmt(m2, 5)} u`],
      sought: 'mittlere Atommasse', soughtOptions: ['mittlere Atommasse', 'Massenzahl', 'Neutronenzahl', 'Ordnungszahl'],
      formula: 'M = Anteil₁ · m₁ + Anteil₂ · m₂', formulaOptions: ['M = Anteil₁ · m₁ + Anteil₂ · m₂', 'M = (m₁ + m₂) / 2', 'M = Anteil₁ · m₁', 'M = Prozent₁ · m₁ + Prozent₂ · m₂'],
      result: M, unit: 'u', units: U({ u: 1, 'g/mol': 1, da: 1 }), tolerance: { rel: 0.001 },
      steps: [`M = ${fmt(p1 / 100, 4)} · ${fmt(m1, 5)} u + ${fmt(1 - p1 / 100, 4)} · ${fmt(m2, 5)} u`, `M = ${fmt((p1 / 100) * m1, 5)} u + ${fmt((1 - p1 / 100) * m2, 5)} u = ${fmt(M, 5)} u`], check: 'Das Ergebnis muss zwischen den beiden Isotopenmassen liegen, näher am häufigeren.',
      interpretation: `Das ist die Atommasse im Periodensystem (${name} ≈ ${fmt(M, 4)}); in g/mol hat die molare Masse denselben Zahlenwert.`, pitfalls: ['Einfach den Mittelwert der beiden Massen gebildet.', 'Prozent nicht durch 100 geteilt.'] };
  } },
  { id: 'neutronen', subject: 'Chemie', lesson: 'atommodell', objective: 1, level: 1, title: 'Neutronenzahl aus Massen- und Ordnungszahl', source: 'zeeck', make: (r) => {
    const n = pick(r, [['Kohlenstoff-14', 'C', 6, 14], ['Iod-131', 'I', 53, 131], ['Technetium-99', 'Tc', 43, 99], ['Kalium-40', 'K', 19, 40], ['Uran-235', 'U', 92, 235], ['Fluor-18', 'F', 9, 18], ['Cobalt-60', 'Co', 27, 60]] as [string, string, number, number][]);
    const N = n[3] - n[2];
    return { context: `Wie viele Neutronen enthält ein Atomkern von ${n[0]} (Ordnungszahl ${n[2]})?`, givens: [`Massenzahl A = ${n[3]}`, `Ordnungszahl Z = ${n[2]} (${n[1]})`],
      sought: 'Neutronenzahl', soughtOptions: ['Neutronenzahl', 'Protonenzahl', 'Elektronenzahl', 'Nukleonenzahl'],
      formula: 'N = A − Z', formulaOptions: ['N = A − Z', 'N = A + Z', 'N = Z', 'N = A / 2'],
      result: N, unit: '', units: COUNT, tolerance: { abs: 0.01 },
      steps: [`N = ${n[3]} − ${n[2]} = ${N}`], check: 'ganze Zahl, dimensionslos',
      interpretation: `${n[0]} hat ${n[2]} Protonen und ${N} Neutronen; Isotope desselben Elements unterscheiden sich nur in N.`, pitfalls: ['Massenzahl und Ordnungszahl verwechselt.', 'Elektronen mitgezählt.'] };
  } },
  { id: 'osmo-druck', subject: 'Chemie', lesson: 'konzentrationen', objective: 4, level: 2, title: 'Osmotischer Druck (van’t Hoff)', source: 'zeeck', make: (r) => {
    const s = pick(r, [['Glukoselösung', 1, 'mmol/l'], ['Kochsalzlösung', 2, 'mmol/l'], ['Calciumchloridlösung', 3, 'mmol/l']] as [string, number, string][]);
    const c = pick(r, [50, 100, 150, 280]); const T = pick(r, [298, 310]); const osm = c * s[1]; const pi = (osm / 1000) * 1000 * 8.314 * T / 1000;
    return { context: `Welchen osmotischen Druck hat eine ${s[0]} mit c = ${c} mmol/l bei ${T} K (ideales Verhalten, vollständige Dissoziation)?`, givens: [`c = ${c} mmol/l`, `Teilchen pro Formeleinheit: ${s[1]}`, `T = ${T} K`, 'R = 8,314 J/(mol·K)'],
      sought: 'osmotischer Druck π', soughtOptions: ['osmotischer Druck π', 'Osmolarität', 'Gefrierpunktserniedrigung', 'Stoffmenge'],
      formula: 'π = c_osm · R · T', formulaOptions: ['π = c_osm · R · T', 'π = c · R / T', 'π = R · T / c_osm', 'π = c_osm · T'],
      result: pi, unit: 'kPa', units: U({ kpa: 1, pa: 0.001, bar: 100, mbar: 0.1, atm: 101.325 }), tolerance: { rel: 0.02 },
      steps: [`c_osm = ${c} · ${s[1]} = ${osm} mosmol/l = ${fmt(osm, 3)} mol/m³`, `π = ${fmt(osm, 3)} mol/m³ · 8,314 J/(mol·K) · ${T} K = ${fmt(pi * 1000)} Pa = ${fmt(pi)} kPa`], check: 'mol/l in mol/m³ umrechnen (× 1000); mol/m³ · J/(mol·K) · K = J/m³ = Pa',
      interpretation: `Das entspricht etwa ${fmt(pi / 100, 2)} bar – osmotische Drücke sind erstaunlich groß.`, pitfalls: ['mmol/l nicht in mol/m³ umgerechnet (Faktor 1000 bzw. 10⁶).', 'Teilchenzahl bei Salzen vergessen.', 'Temperatur in °C eingesetzt.'] };
  } },
  { id: 'zellspannung', subject: 'Chemie', lesson: 'redox', objective: 4, level: 2, title: 'Spannung einer galvanischen Zelle', source: 'zeeck', make: (r) => {
    const M: [string, number][] = [['Mg', -2.37], ['Al', -1.66], ['Zn', -0.76], ['Fe', -0.44], ['Pb', -0.13], ['Cu', 0.34], ['Ag', 0.8]];
    let a = pick(r, M), b = pick(r, M); while (a[0] === b[0]) b = pick(r, M);
    const [an, ca] = a[1] < b[1] ? [a, b] : [b, a]; const dE = ca[1] - an[1];
    return { context: `Eine galvanische Zelle besteht aus einer ${a[0]}-Elektrode in ${a[0]}-Salzlösung und einer ${b[0]}-Elektrode in ${b[0]}-Salzlösung (je 1 mol/l). Welche Spannung liefert sie?`, givens: [`E°(${a[0]}/${a[0]}ⁿ⁺) = ${fmt(a[1], 3)} V`, `E°(${b[0]}/${b[0]}ⁿ⁺) = ${fmt(b[1], 3)} V`],
      sought: 'Zellspannung ΔE', soughtOptions: ['Zellspannung ΔE', 'Stromstärke', 'Standardpotenzial', 'freie Enthalpie'],
      formula: 'ΔE = E°(Kathode) − E°(Anode)', formulaOptions: ['ΔE = E°(Kathode) − E°(Anode)', 'ΔE = E°(Anode) − E°(Kathode)', 'ΔE = E°(Kathode) + E°(Anode)', 'ΔE = E°(Kathode) · E°(Anode)'],
      result: dE, unit: 'V', units: U({ v: 1, mv: 0.001 }), tolerance: { abs: 0.005 },
      steps: [`Unedler: ${an[0]} (${fmt(an[1], 3)} V) → wird oxidiert, Anode (Minuspol)`, `Edler: ${ca[0]} (${fmt(ca[1], 3)} V) → Ionen werden reduziert, Kathode (Pluspol)`, `ΔE = ${fmt(ca[1], 3)} − (${fmt(an[1], 3)}) = ${fmt(dE, 3)} V`], check: 'V − V = V; die Zellspannung ist positiv.',
      interpretation: `Elektronen fließen von ${an[0]} zu ${ca[0]}. Je weiter die Metalle in der Spannungsreihe auseinanderliegen, desto größer die Spannung.`, pitfalls: ['Potenziale addiert statt subtrahiert.', 'Anode und Kathode vertauscht (negative Spannung).'] };
  } },
  { id: 'nernst', subject: 'Chemie', lesson: 'redox', objective: 5, level: 3, title: 'Nernst-Gleichung', source: 'zeeck', make: (r) => {
    const p = pick(r, [['Fe³⁺/Fe²⁺', 0.77, 1, 'Fe³⁺', 'Fe²⁺'], ['Cu²⁺/Cu', 0.34, 2, 'Cu²⁺', 'Cu (fest, Aktivität 1)'], ['Zn²⁺/Zn', -0.76, 2, 'Zn²⁺', 'Zn (fest, Aktivität 1)']] as [string, number, number, string, string][]);
    const ratio = pick(r, [0.001, 0.01, 0.1, 10, 100]); const E = p[1] + (0.059 / p[2]) * Math.log10(ratio);
    const metal = p[4].includes('fest');
    return { context: metal ? `Berechne das Potenzial der Elektrode ${p[0]} bei c(${p[3]}) = ${fmt(ratio, 2)} mol/l (25 °C).` : `Berechne das Potenzial des Paares ${p[0]}, wenn [${p[3]}] / [${p[4]}] = ${fmt(ratio, 2)} ist (25 °C).`, givens: [`E° = ${fmt(p[1], 3)} V`, `z = ${p[2]}`, metal ? `c(${p[3]}) = ${fmt(ratio, 2)} mol/l, Metall: Aktivität 1` : `[Ox]/[Red] = ${fmt(ratio, 2)}`],
      sought: 'Elektrodenpotenzial E', soughtOptions: ['Elektrodenpotenzial E', 'Standardpotenzial E°', 'Zellspannung', 'Stoffmenge'],
      formula: 'E = E° + (0,059 V / z) · lg([Ox]/[Red])', formulaOptions: ['E = E° + (0,059 V / z) · lg([Ox]/[Red])', 'E = E° − (0,059 V / z) · lg([Ox]/[Red])', 'E = E° · [Ox]/[Red]', 'E = E° + 0,059 V · z · lg([Ox]/[Red])'],
      result: E, unit: 'V', units: U({ v: 1, mv: 0.001 }), tolerance: { abs: 0.004 },
      steps: [`lg(${fmt(ratio, 2)}) = ${fmt(Math.log10(ratio), 2)}`, `E = ${fmt(p[1], 3)} V + (0,059 V / ${p[2]}) · (${fmt(Math.log10(ratio), 2)}) = ${fmt(E, 3)} V`], check: 'V; lg-Term dimensionslos',
      interpretation: ratio > 1 ? 'Mehr oxidierte Form → Potenzial positiver als E°.' : 'Weniger oxidierte Form → Potenzial negativer als E°.', pitfalls: ['Red und Ox im Bruch vertauscht.', 'Durch z teilen vergessen.'] };
  } },
  { id: 'redox-dg', subject: 'Chemie', lesson: 'redox', objective: 2, level: 2, title: 'Freie Enthalpie aus der Zellspannung', source: 'zeeck', make: (r) => {
    const c = pick(r, [['Daniell-Element Zn/Cu', 1.10, 2], ['NADH → O₂ (Atmungskette)', 1.14, 2], ['Fe²⁺ + Ag⁺ → Fe³⁺ + Ag', 0.03, 1], ['Zn + 2 Ag⁺', 1.56, 2]] as [string, number, number][]);
    const dG = (-c[2] * 96485 * c[1]) / 1000;
    return { context: `Berechne ΔG für ${c[0]} mit ΔE = ${fmt(c[1], 3)} V und z = ${c[2]} übertragenen Elektronen.`, givens: [`ΔE = ${fmt(c[1], 3)} V`, `z = ${c[2]}`, 'F = 96 485 C/mol'],
      sought: 'freie Enthalpie ΔG', soughtOptions: ['freie Enthalpie ΔG', 'Zellspannung', 'Ladung', 'Gleichgewichtskonstante'],
      formula: 'ΔG = −z · F · ΔE', formulaOptions: ['ΔG = −z · F · ΔE', 'ΔG = z · F · ΔE', 'ΔG = −F · ΔE / z', 'ΔG = −z · ΔE'],
      result: dG, unit: 'kJ/mol', units: U({ 'kj/mol': 1, 'j/mol': 0.001 }), tolerance: { rel: 0.02 },
      steps: [`ΔG = −${c[2]} · 96 485 C/mol · ${fmt(c[1], 3)} V = ${fmt(dG * 1000)} J/mol`, `= ${fmt(dG)} kJ/mol`], check: 'C · V = J; also J/mol → kJ/mol',
      interpretation: 'Negatives ΔG: Die Reaktion läuft freiwillig ab.', pitfalls: ['Minuszeichen vergessen.', 'J nicht in kJ umgerechnet.'] };
  } },
  { id: 'hess', subject: 'Chemie', lesson: 'energetik-kinetik', objective: 0, level: 2, title: 'Reaktionsenthalpie aus Bildungsenthalpien', source: 'zeeck', make: (r) => {
    const x = pick(r, [['Methan', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O(l)', -74.8, 1, 2], ['Ethanol', 'C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O(l)', -277.7, 2, 3], ['Glukose', 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O(l)', -1273.3, 6, 6]] as [string, string, number, number, number][]);
    const dH = x[3] * -393.5 + x[4] * -285.8 - x[2];
    return { context: `Berechne die Verbrennungsenthalpie von ${x[0]}: ${x[1]}.`, givens: [`ΔH_f(${x[0]}) = ${fmt(x[2], 5)} kJ/mol`, 'ΔH_f(CO₂) = −393,5 kJ/mol', 'ΔH_f(H₂O, flüssig) = −285,8 kJ/mol', 'ΔH_f(O₂) = 0 (Element)'],
      sought: 'Reaktionsenthalpie ΔH_R', soughtOptions: ['Reaktionsenthalpie ΔH_R', 'Bildungsenthalpie', 'freie Enthalpie', 'Aktivierungsenergie'],
      formula: 'ΔH_R = Σ ΔH_f(Produkte) − Σ ΔH_f(Edukte)', formulaOptions: ['ΔH_R = Σ ΔH_f(Produkte) − Σ ΔH_f(Edukte)', 'ΔH_R = Σ ΔH_f(Edukte) − Σ ΔH_f(Produkte)', 'ΔH_R = Σ ΔH_f(Produkte) + Σ ΔH_f(Edukte)', 'ΔH_R = ΔH_f(CO₂)'],
      result: dH, unit: 'kJ/mol', units: U({ 'kj/mol': 1, 'j/mol': 0.001, kj: 1 }), tolerance: { rel: 0.01 },
      steps: [`Produkte: ${x[3]} · (−393,5) + ${x[4]} · (−285,8) = ${fmt(x[3] * -393.5 + x[4] * -285.8, 5)} kJ/mol`, `Edukte: ${fmt(x[2], 5)} + 0 = ${fmt(x[2], 5)} kJ/mol`, `ΔH_R = ${fmt(x[3] * -393.5 + x[4] * -285.8, 5)} − (${fmt(x[2], 5)}) = ${fmt(dH, 5)} kJ/mol`], check: 'kJ/mol; negativ = exotherm',
      interpretation: x[0] === 'Glukose' ? 'Dieselbe Energie liefert die Zellatmung – nur in vielen kleinen Schritten (Satz von Hess).' : 'Stark exotherm: Verbrennungen setzen viel Wärme frei.', pitfalls: ['Produkte minus Edukte vertauscht.', 'Koeffizienten nicht mit den Bildungsenthalpien multipliziert.'] };
  } },
  { id: 'gibbs', subject: 'Chemie', lesson: 'energetik-kinetik', objective: 1, level: 2, title: 'Freie Enthalpie mit ΔG = ΔH − T·ΔS', source: 'zeeck', make: (r) => {
    const dH = pick(r, [-92, -50, 20, 40, 60]); const dS = pick(r, [-200, -120, 80, 150, 200]); const T = pick(r, [298, 310, 373]);
    const dG = dH - (T * dS) / 1000;
    return { context: `Für eine Reaktion gilt ΔH = ${dH} kJ/mol und ΔS = ${dS} J/(mol·K). Berechne ΔG bei ${T} K. Läuft sie freiwillig ab?`, givens: [`ΔH = ${dH} kJ/mol`, `ΔS = ${dS} J/(mol·K) = ${fmt(dS / 1000, 3)} kJ/(mol·K)`, `T = ${T} K`],
      sought: 'freie Enthalpie ΔG', soughtOptions: ['freie Enthalpie ΔG', 'Reaktionsenthalpie', 'Entropie', 'Gleichgewichtskonstante'],
      formula: 'ΔG = ΔH − T · ΔS', formulaOptions: ['ΔG = ΔH − T · ΔS', 'ΔG = ΔH + T · ΔS', 'ΔG = T · ΔS − ΔH', 'ΔG = ΔH · ΔS / T'],
      result: dG, unit: 'kJ/mol', units: U({ 'kj/mol': 1, 'j/mol': 0.001 }), tolerance: { abs: 0.5 },
      steps: [`T · ΔS = ${T} K · ${fmt(dS / 1000, 3)} kJ/(mol·K) = ${fmt((T * dS) / 1000)} kJ/mol`, `ΔG = ${dH} − (${fmt((T * dS) / 1000)}) = ${fmt(dG)} kJ/mol`], check: 'ΔS zuerst in kJ/(mol·K) umrechnen.',
      interpretation: dG < 0 ? 'ΔG < 0: Die Reaktion läuft bei dieser Temperatur freiwillig ab (exergon).' : 'ΔG > 0: Die Reaktion läuft bei dieser Temperatur nicht freiwillig ab (endergon).', pitfalls: ['ΔS in J nicht in kJ umgerechnet (Faktor 1000).', 'Temperatur in °C eingesetzt.'] };
  } },
  { id: 'halbwertszeit', subject: 'Chemie', lesson: 'energetik-kinetik', objective: 3, level: 2, title: 'Restmenge nach mehreren Halbwertszeiten', source: 'zeeck', make: (r) => {
    const d = pick(r, [['Ibuprofen', 2, 'h', 400], ['Paracetamol', 2, 'h', 1000], ['Diazepam', 48, 'h', 10], ['Iod-131', 8, 'd', 100]] as [string, number, string, number][]);
    const nHalf = pick(r, [1, 2, 3, 4, 5, 1.5, 2.5]); const t = d[1] * nHalf; const rest = d[3] * 0.5 ** nHalf;
    const unit = d[0] === 'Iod-131' ? 'MBq' : 'mg';
    return { context: `${d[0]} hat eine Halbwertszeit von ${d[1]} ${d[2]} (Abbau 1. Ordnung). Anfangs sind ${d[3]} ${unit} vorhanden. Wie viel ist nach ${fmt(t, 3)} ${d[2]} noch übrig?`, givens: [`t½ = ${d[1]} ${d[2]}`, `Anfangsmenge = ${d[3]} ${unit}`, `t = ${fmt(t, 3)} ${d[2]}`],
      sought: 'Restmenge', soughtOptions: ['Restmenge', 'Halbwertszeit', 'Geschwindigkeitskonstante', 'abgebaute Menge'],
      formula: 'Rest = Anfang · (½)^(t / t½)', formulaOptions: ['Rest = Anfang · (½)^(t / t½)', 'Rest = Anfang / (t / t½)', 'Rest = Anfang · t½ / t', 'Rest = Anfang − t / t½'],
      result: rest, unit, units: unit === 'mg' ? U({ mg: 1, g: 1000, µg: 0.001 }) : U({ mbq: 1, kbq: 0.001, gbq: 1000 }), tolerance: { rel: 0.02 },
      steps: [`t / t½ = ${fmt(t, 3)} / ${d[1]} = ${fmt(nHalf, 2)} Halbwertszeiten`, `Rest = ${d[3]} · (½)^${fmt(nHalf, 2)} = ${fmt(rest)} ${unit}`], check: `Einheit der Ausgangsmenge (${unit}); der Exponent ist dimensionslos.`,
      interpretation: `Nach ${fmt(nHalf, 2)} Halbwertszeiten sind noch ${fmt(100 * 0.5 ** nHalf, 3)} % vorhanden.`, pitfalls: ['Linear statt exponentiell gerechnet (nicht nach 2 t½ alles weg).', 'Halbwertszeiten gezählt, aber nicht als Exponent verwendet.'] };
  } },
  { id: 'k-aus-thalb', subject: 'Chemie', lesson: 'energetik-kinetik', objective: 3, level: 1, title: 'Geschwindigkeitskonstante aus der Halbwertszeit', source: 'zeeck', make: (r) => {
    const t = pick(r, [0.5, 2, 4, 6, 8, 12, 24]); const k = Math.LN2 / t;
    return { context: `Ein Arzneistoff wird nach 1. Ordnung eliminiert, t½ = ${fmt(t, 2)} h. Berechne die Eliminationskonstante k.`, givens: [`t½ = ${fmt(t, 2)} h`, 'ln 2 ≈ 0,693'],
      sought: 'Geschwindigkeitskonstante k', soughtOptions: ['Geschwindigkeitskonstante k', 'Halbwertszeit', 'Reaktionsordnung', 'Clearance'],
      formula: 'k = ln 2 / t½', formulaOptions: ['k = ln 2 / t½', 'k = t½ / ln 2', 'k = 1 / (2 · t½)', 'k = ln 2 · t½'],
      result: k, unit: '1/h', units: U({ '1/h': 1, 'h⁻¹': 1, 'h^-1': 1, '/h': 1, '1/min': 60 }), tolerance: { rel: 0.02 },
      steps: [`k = 0,693 / ${fmt(t, 2)} h = ${fmt(k)} h⁻¹`], check: 'Einheit: 1/Zeit',
      interpretation: `Pro Stunde werden etwa ${fmt(100 * (1 - Math.exp(-k)), 2)} % der jeweils vorhandenen Menge abgebaut.`, pitfalls: ['Bruch umgedreht.', 'log statt ln verwendet.'] };
  } },
  { id: 'rgt', subject: 'Chemie', lesson: 'energetik-kinetik', objective: 4, level: 1, title: 'RGT-Regel: Beschleunigung durch Temperatur', source: 'zeeck', make: (r) => {
    const dT = pick(r, [10, 20, 30, -10, -20]); const f = pick(r, [2, 3]); const fac = f ** (dT / 10);
    return { context: `Eine Reaktion wird pro 10 K Temperaturerhöhung ${f}-mal so schnell. Um welchen Faktor ändert sich ihre Geschwindigkeit, wenn die Temperatur um ${dT} K ${dT > 0 ? 'steigt' : 'sinkt'}?`, givens: [`Faktor pro 10 K: ${f}`, `ΔT = ${dT} K`],
      sought: 'Geschwindigkeitsfaktor', soughtOptions: ['Geschwindigkeitsfaktor', 'Aktivierungsenergie', 'Halbwertszeit', 'Temperatur'],
      formula: 'v₂/v₁ = Faktor^(ΔT / 10 K)', formulaOptions: ['v₂/v₁ = Faktor^(ΔT / 10 K)', 'v₂/v₁ = Faktor · ΔT / 10 K', 'v₂/v₁ = ΔT / Faktor', 'v₂/v₁ = Faktor + ΔT / 10 K'],
      result: fac, unit: '', units: NONE, tolerance: { rel: 0.02 },
      steps: [`ΔT / 10 K = ${fmt(dT / 10, 2)}`, `v₂/v₁ = ${f}^${fmt(dT / 10, 2)} = ${fmt(fac)}`], check: 'dimensionslos',
      interpretation: dT > 0 ? 'Schon wenige Grad machen viel aus – Fieber beschleunigt den Stoffwechsel.' : 'Kühlung verlangsamt Reaktionen stark – so schützt man Gewebe und Transplantate.', pitfalls: ['Multipliziert statt potenziert (2 · 3 statt 2³).', 'Bei Abkühlung das negative Vorzeichen im Exponenten übersehen.'] };
  } },
  { id: 'pi-aminosaeure', subject: 'Chemie', lesson: 'aminosaeuren-proteine', objective: 1, level: 2, title: 'Isoelektrischer Punkt einer Aminosäure', source: 'zeeck', make: (r) => {
    const a = pick(r, [['Glycin', [2.34, 9.6], 'neutral'], ['Alanin', [2.34, 9.69], 'neutral'], ['Valin', [2.32, 9.62], 'neutral'], ['Asparaginsäure', [1.88, 3.65, 9.6], 'sauer'], ['Glutaminsäure', [2.19, 4.25, 9.67], 'sauer'], ['Lysin', [2.18, 8.95, 10.53], 'basisch'], ['Histidin', [1.82, 6.0, 9.17], 'basisch']] as [string, number[], string][]);
    const [name, pk, kind] = a; const pair = kind === 'basisch' ? [pk[1], pk[2]] : [pk[0], pk[1]]; const pI = (pair[0] + pair[1]) / 2;
    return { context: `Berechne den isoelektrischen Punkt von ${name}. pKs-Werte: ${pk.map((x) => fmt(x, 3)).join(' ; ')}.`, givens: pk.length === 2 ? [`pKs(α-COOH) = ${fmt(pk[0], 3)}`, `pKs(α-NH₃⁺) = ${fmt(pk[1], 3)}`] : [`pKs-Werte: ${pk.map((x) => fmt(x, 3)).join(', ')}`, kind === 'sauer' ? 'saure Seitenkette' : 'basische Seitenkette'],
      sought: 'isoelektrischer Punkt pI', soughtOptions: ['isoelektrischer Punkt pI', 'pH der Lösung', 'Ladung', 'pKs der Seitenkette'],
      formula: 'pI = Mittelwert der beiden pKs-Werte, die die neutrale Form einschließen', formulaOptions: ['pI = Mittelwert der beiden pKs-Werte, die die neutrale Form einschließen', 'pI = Mittelwert aller drei pKs-Werte', 'pI = höchster pKs-Wert', 'pI = 7 (immer neutral)'],
      result: pI, unit: '', units: NONE, tolerance: { abs: 0.03 },
      steps: [kind === 'neutral' ? 'Keine ionisierbare Seitenkette: beide pKs-Werte mitteln.' : kind === 'sauer' ? 'Saure Seitenkette: die neutrale Form liegt zwischen pKs(α-COOH) und pKs(Seitenkette).' : 'Basische Seitenkette: die neutrale Form liegt zwischen den beiden höheren pKs-Werten.', `pI = (${fmt(pair[0], 3)} + ${fmt(pair[1], 3)}) / 2 = ${fmt(pI, 3)}`], check: 'dimensionslos, zwischen den beiden pKs-Werten',
      interpretation: pI < 5 ? 'Saure Aminosäure: Der pI liegt im Sauren, bei pH 7 ist sie negativ.' : pI > 7.5 ? 'Basische Aminosäure: Der pI liegt im Basischen, bei pH 7 ist sie positiv.' : 'Bei pH 7 ist sie nahezu ungeladen (Zwitterion).', pitfalls: ['Alle drei pKs-Werte gemittelt.', 'Bei saurer Aminosäure den pKs der Aminogruppe genommen.'] };
  } },
  // ------------------------------------------------------------------ Physik
  { id: 'geschw', subject: 'Physik', lesson: 'groessen-bewegung', objective: 2, level: 1, title: 'Geschwindigkeit', source: 'harten', make: (r) => {
    const s = num(r, 100, 1500, 50); const t = num(r, 60, 600, 30); const v = s / t;
    return { context: `Kim geht ${s} m vom Hörsaal zur Mensa und braucht dafür ${t} s. Wie groß ist ihre mittlere Geschwindigkeit?`, givens: [`s = ${s} m`, `t = ${t} s`],
      sought: 'Geschwindigkeit v', soughtOptions: ['Geschwindigkeit v', 'Beschleunigung a', 'Weg s', 'Zeit t'],
      formula: 'v = s / t', formulaOptions: ['v = s / t', 'v = s · t', 'v = t / s', 'a = v / t'],
      result: v, unit: 'm/s', units: U({ 'm/s': 1, 'km/h': 1 / 3.6, 'cm/s': 0.01 }),
      steps: [`v = ${s} m / ${t} s = ${fmt(v, 3)} m/s`, `= ${fmt(v * 3.6, 3)} km/h`], check: 'm / s = m/s', interpretation: 'Normales Gehtempo liegt bei etwa 1–1,5 m/s.', pitfalls: ['Weg und Zeit vertauscht (Einheit s/m).'] };
  } },
  { id: 'geschw-kmh', subject: 'Physik', lesson: 'groessen-bewegung', objective: 0, level: 2, title: 'Geschwindigkeit mit Umrechnung', source: 'harten', make: (r) => {
    const s = num(r, 2, 30, 0.5); const t = num(r, 3, 30, 1); const v = s / (t / 60);
    return { context: `Ein Rettungswagen fährt ${fmt(s, 3)} km in ${t} min. Wie groß ist seine mittlere Geschwindigkeit in km/h?`, givens: [`s = ${fmt(s, 3)} km`, `t = ${t} min`],
      sought: 'Geschwindigkeit v', soughtOptions: ['Geschwindigkeit v', 'Weg s', 'Fahrzeit t', 'Beschleunigung a'],
      formula: 'v = s / t', formulaOptions: ['v = s / t', 'v = s · t', 'v = t / s', 'v = s / t²'],
      result: v, unit: 'km/h', units: U({ 'km/h': 1, 'm/s': 3.6 }),
      steps: [`t = ${t} min = ${fmt(t / 60, 4)} h`, `v = ${fmt(s, 3)} km / ${fmt(t / 60, 4)} h = ${fmt(v, 4)} km/h`, `= ${fmt(v / 3.6, 3)} m/s`], check: 'km / h = km/h',
      interpretation: 'Minuten müssen erst in Stunden umgerechnet werden (÷ 60).', pitfalls: ['Mit Minuten statt Stunden gerechnet – Ergebnis 60-fach zu klein.'] };
  } },
  { id: 'beschl', subject: 'Physik', lesson: 'groessen-bewegung', objective: 2, level: 2, title: 'Beschleunigung', source: 'harten', make: (r) => {
    const v = num(r, 30, 100, 10); const t = num(r, 3, 12, 1); const a = v / 3.6 / t;
    return { context: `Ein Auto beschleunigt in ${t} s gleichmäßig von 0 auf ${v} km/h. Wie groß ist die Beschleunigung?`, givens: [`Δv = ${v} km/h`, `Δt = ${t} s`],
      sought: 'Beschleunigung a', soughtOptions: ['Beschleunigung a', 'Geschwindigkeit v', 'Kraft F', 'Weg s'],
      formula: 'a = Δv / Δt', formulaOptions: ['a = Δv / Δt', 'a = Δv · Δt', 'a = Δt / Δv', 'a = Δv / Δt²'],
      result: a, unit: 'm/s²', units: U({ 'm/s²': 1, 'm/s^2': 1, 'm/s/s': 1 }),
      steps: [`Δv = ${v} km/h / 3,6 = ${fmt(v / 3.6, 4)} m/s`, `a = ${fmt(v / 3.6, 4)} m/s / ${t} s = ${fmt(a, 3)} m/s²`], check: '(m/s) / s = m/s²',
      interpretation: `Das ist etwa das ${fmt(a / G, 2)}-Fache der Fallbeschleunigung g.`, pitfalls: ['km/h nicht in m/s umgerechnet (Faktor 3,6).'] };
  } },
  { id: 'gewicht', subject: 'Physik', lesson: 'mechanik', objective: 0, level: 1, title: 'Gewichtskraft', source: 'harten', make: (r) => {
    const m = num(r, 2, 90, 0.5); const F = m * G;
    return { context: `Welche Gewichtskraft wirkt auf eine Masse von ${fmt(m, 3)} kg?`, givens: [`m = ${fmt(m, 3)} kg`, 'g = 9,81 m/s²'],
      sought: 'Gewichtskraft F', soughtOptions: ['Gewichtskraft F', 'Masse m', 'Druck p', 'Arbeit W'],
      formula: 'F = m · g', formulaOptions: ['F = m · g', 'F = m / g', 'F = g / m', 'F = m · g · h'],
      result: F, unit: 'N', units: U({ n: 1, kn: 1000 }),
      steps: [`F = ${fmt(m, 3)} kg · 9,81 m/s² = ${fmt(F, 4)} N`], check: 'kg · m/s² = N', interpretation: 'Masse (kg) und Gewichtskraft (N) sind verschiedene Größen.', pitfalls: ['Masse in kg als Kraft angegeben.'] };
  } },
  { id: 'hubarbeit', subject: 'Physik', lesson: 'energie-leistung', objective: 0, level: 2, title: 'Hubarbeit beim Treppensteigen', source: 'harten', make: (r) => {
    const m = num(r, 50, 90, 1); const h = num(r, 3, 15, 0.5); const W = m * G * h;
    return { context: `Kim (${m} kg) steigt ${fmt(h, 3)} m Treppen hinauf. Welche Hubarbeit verrichtet sie?`, givens: [`m = ${m} kg`, `h = ${fmt(h, 3)} m`, 'g = 9,81 m/s²'],
      sought: 'Hubarbeit W', soughtOptions: ['Hubarbeit W', 'Leistung P', 'Gewichtskraft F', 'kinetische Energie'],
      formula: 'W = m · g · h', formulaOptions: ['W = m · g · h', 'W = m · h', 'W = m · g / h', 'W = ½ · m · h²'],
      result: W, unit: 'J', units: U({ j: 1, kj: 1000, nm: 1, ws: 1, kcal: 4184 }),
      steps: [`W = ${m} kg · 9,81 m/s² · ${fmt(h, 3)} m = ${fmt(W, 4)} J = ${fmt(W / 1000, 3)} kJ`], check: 'kg · m/s² · m = N·m = J',
      interpretation: `Das sind nur ${fmt(W / 4184, 2)} kcal – wegen des Wirkungsgrads von höchstens etwa 25 % verbraucht der Körper aber ein Mehrfaches.`, pitfalls: ['g vergessen (Ergebnis in kg·m statt J).'] };
  } },
  { id: 'leistung', subject: 'Physik', lesson: 'energie-leistung', objective: 2, level: 2, title: 'Leistung beim Treppensteigen', source: 'harten', make: (r) => {
    const m = num(r, 50, 90, 1); const h = num(r, 3, 15, 0.5); const t = num(r, 10, 60, 5); const P = (m * G * h) / t;
    return { context: `Kim (${m} kg) steigt in ${t} s ${fmt(h, 3)} m Treppen hinauf. Welche mittlere Hubleistung bringt sie auf?`, givens: [`m = ${m} kg`, `h = ${fmt(h, 3)} m`, `t = ${t} s`, 'g = 9,81 m/s²'],
      sought: 'Leistung P', soughtOptions: ['Leistung P', 'Hubarbeit W', 'Energieumsatz pro Tag', 'Geschwindigkeit v'],
      formula: 'P = m · g · h / t', formulaOptions: ['P = m · g · h / t', 'P = m · g · h · t', 'P = m · g / t', 'P = m · h / t'],
      result: P, unit: 'W', units: U({ w: 1, kw: 1000, 'j/s': 1 }),
      steps: [`W = ${m} kg · 9,81 m/s² · ${fmt(h, 3)} m = ${fmt(m * G * h, 4)} J`, `P = ${fmt(m * G * h, 4)} J / ${t} s = ${fmt(P, 4)} W`], check: 'J / s = W',
      interpretation: 'Zum Vergleich: Der Ruheumsatz eines Erwachsenen entspricht etwa 80 W.', pitfalls: ['Arbeit statt Leistung angegeben (Einheit J).'] };
  } },
  { id: 'ekin', subject: 'Physik', lesson: 'energie-leistung', objective: 1, level: 2, title: 'Kinetische Energie', source: 'harten', make: (r) => {
    const m = num(r, 50, 90, 1); const v = num(r, 6, 18, 1); const E = 0.5 * m * (v / 3.6) ** 2;
    return { context: `Eine Läuferin (${m} kg) läuft mit ${v} km/h. Wie groß ist ihre kinetische Energie?`, givens: [`m = ${m} kg`, `v = ${v} km/h`],
      sought: 'kinetische Energie', soughtOptions: ['kinetische Energie', 'potentielle Energie', 'Leistung', 'Impuls'],
      formula: 'E = ½ · m · v²', formulaOptions: ['E = ½ · m · v²', 'E = m · v', 'E = ½ · m · v', 'E = m · g · h'],
      result: E, unit: 'J', units: U({ j: 1, kj: 1000, nm: 1 }),
      steps: [`v = ${v} km/h / 3,6 = ${fmt(v / 3.6, 4)} m/s`, `E = ½ · ${m} kg · (${fmt(v / 3.6, 4)} m/s)² = ${fmt(E, 4)} J`], check: 'kg · (m/s)² = kg·m²/s² = J',
      interpretation: 'Doppelte Geschwindigkeit bedeutet vierfache Bewegungsenergie.', pitfalls: ['km/h nicht umgerechnet (Faktor 3,6² ≈ 13).', 'v nicht quadriert.'] };
  } },
  { id: 'druck-spritze', subject: 'Physik', lesson: 'druck-dichte', objective: 0, level: 2, title: 'Druck in einer Spritze', source: 'harten', make: (r) => {
    const F = num(r, 5, 40, 1); const A = pick(r, [0.5, 1, 2, 3, 4, 5]); const p = F / (A * 1e-4) / 1000;
    return { context: `Auf den Kolben einer Spritze (Querschnittsfläche ${fmt(A, 2)} cm²) wird mit ${F} N gedrückt. Welcher Druck entsteht in der Flüssigkeit?`, givens: [`F = ${F} N`, `A = ${fmt(A, 2)} cm²`],
      sought: 'Druck p', soughtOptions: ['Druck p', 'Kraft F', 'Fläche A', 'Volumenstrom'],
      formula: 'p = F / A', formulaOptions: ['p = F / A', 'p = F · A', 'p = A / F', 'p = F / A²'],
      result: p, unit: 'kPa', units: U({ kpa: 1, pa: 0.001, hpa: 0.1, bar: 100, mmhg: 0.13332 }),
      steps: [`A = ${fmt(A, 2)} cm² = ${fmt(A * 1e-4, 2)} m²`, `p = ${F} N / ${fmt(A * 1e-4, 2)} m² = ${fmt(p * 1000, 4)} Pa = ${fmt(p, 4)} kPa`], check: 'N / m² = Pa',
      interpretation: `Das entspricht etwa ${fmt(p / 0.13332, 3)} mmHg. Kleine Spritzen erzeugen bei gleicher Kraft höhere Drücke.`, pitfalls: ['cm² mit 10⁻² statt 10⁻⁴ umgerechnet (Faktor 100).'] };
  } },
  { id: 'hydrostatik', subject: 'Physik', lesson: 'druck-dichte', objective: 1, level: 2, title: 'Hydrostatischer Druck einer Infusion', source: 'harten', make: (r) => {
    const h = num(r, 40, 120, 10); const p = 1000 * G * (h / 100);
    return { context: `Ein Infusionsbeutel hängt ${h} cm über der Einstichstelle. Welchen hydrostatischen Druck erzeugt die Flüssigkeitssäule (ρ = 1000 kg/m³)?`, givens: [`h = ${h} cm`, 'ρ = 1000 kg/m³', 'g = 9,81 m/s²'],
      sought: 'hydrostatischer Druck p', soughtOptions: ['hydrostatischer Druck p', 'Dichte ρ', 'Höhe h', 'Strömungswiderstand'],
      formula: 'p = ρ · g · h', formulaOptions: ['p = ρ · g · h', 'p = ρ · h', 'p = ρ · g / h', 'p = m · g · h'],
      result: p, unit: 'Pa', units: U({ pa: 1, kpa: 1000, hpa: 100, mmhg: 133.32, cmh2o: 98.07, 'cmh₂o': 98.07 }),
      steps: [`h = ${h} cm = ${fmt(h / 100, 2)} m`, `p = 1000 kg/m³ · 9,81 m/s² · ${fmt(h / 100, 2)} m = ${fmt(p, 4)} Pa`, `= ${fmt(p / 133.32, 3)} mmHg = ${h} cmH₂O`], check: 'kg/m³ · m/s² · m = kg/(m·s²) = N/m² = Pa',
      interpretation: 'Liegt der Venendruck darüber, läuft die Infusion nicht – dann muss der Beutel höher hängen.', pitfalls: ['Höhe in cm statt m eingesetzt (Faktor 100).'] };
  } },
  { id: 'mmhg', subject: 'Physik', lesson: 'druck-dichte', objective: 0, level: 1, title: 'mmHg in kPa umrechnen', source: 'harten', make: (r) => {
    const p = pick(r, [60, 80, 90, 100, 120, 140, 160, 180]); const k = p * 0.13332;
    return { context: `Ein Blutdruckwert beträgt ${p} mmHg. Wie viel ist das in Kilopascal?`, givens: [`p = ${p} mmHg`, '1 mmHg ≈ 133,3 Pa'],
      sought: 'Druck in kPa', soughtOptions: ['Druck in kPa', 'Druck in cmH₂O', 'Kraft in N', 'Höhe der Quecksilbersäule'],
      formula: 'p[kPa] = p[mmHg] · 0,1333', formulaOptions: ['p[kPa] = p[mmHg] · 0,1333', 'p[kPa] = p[mmHg] / 0,1333', 'p[kPa] = p[mmHg] · 133,3', 'p[kPa] = p[mmHg] · 7,5'],
      result: k, unit: 'kPa', units: U({ kpa: 1, pa: 0.001, hpa: 0.1 }),
      steps: [`p = ${p} · 133,3 Pa = ${fmt(p * 133.32, 4)} Pa = ${fmt(k, 3)} kPa`], check: 'mmHg · (Pa/mmHg) = Pa',
      interpretation: 'Faustregel: 7,5 mmHg ≈ 1 kPa.', pitfalls: ['Durch den Umrechnungsfaktor geteilt statt multipliziert.'] };
  } },
  { id: 'dichte', subject: 'Physik', lesson: 'druck-dichte', objective: 0, level: 1, title: 'Dichte', source: 'harten', make: (r) => {
    const V = pick(r, [5, 10, 20, 50]); const rho = pick(r, [1.01, 1.02, 1.03, 1.05, 1.06]); const m = Math.round(rho * V * 100) / 100;
    return { context: `Eine Blutprobe von ${V} ml hat eine Masse von ${fmt(m, 4)} g. Wie groß ist ihre Dichte?`, givens: [`m = ${fmt(m, 4)} g`, `V = ${V} ml`],
      sought: 'Dichte ρ', soughtOptions: ['Dichte ρ', 'Masse m', 'Volumen V', 'Druck p'],
      formula: 'ρ = m / V', formulaOptions: ['ρ = m / V', 'ρ = m · V', 'ρ = V / m', 'ρ = m · g / V'],
      result: m / V, unit: 'g/ml', units: U({ 'g/ml': 1, 'g/cm³': 1, 'kg/l': 1, 'kg/m³': 0.001, 'g/l': 0.001 }),
      steps: [`ρ = ${fmt(m, 4)} g / ${V} ml = ${fmt(m / V, 4)} g/ml (= ${fmt((m / V) * 1000, 4)} kg/m³)`], check: 'g / ml = g/cm³', interpretation: 'Blut ist etwas dichter als Wasser (1,00 g/ml).', pitfalls: ['Volumen durch Masse geteilt.'] };
  } },
  { id: 'ohm', subject: 'Physik', lesson: 'elektrizitaet', objective: 0, level: 2, title: 'Ohmsches Gesetz', source: 'harten', make: (r) => {
    const Uv = pick(r, [1.5, 3, 5, 9, 12]); const R = pick(r, [1, 2.2, 4.7, 10, 22, 47]); const I = Uv / R;
    return { context: `An einem Widerstand von ${fmt(R, 2)} kΩ liegt eine Spannung von ${fmt(Uv, 2)} V. Welcher Strom fließt?`, givens: [`U = ${fmt(Uv, 2)} V`, `R = ${fmt(R, 2)} kΩ`],
      sought: 'Stromstärke I', soughtOptions: ['Stromstärke I', 'Spannung U', 'Widerstand R', 'Leistung P'],
      formula: 'I = U / R', formulaOptions: ['I = U / R', 'I = U · R', 'I = R / U', 'I = U / R²'],
      result: I, unit: 'mA', units: U({ ma: 1, a: 1000, µa: 0.001, ua: 0.001 }),
      steps: [`R = ${fmt(R, 2)} kΩ = ${fmt(R * 1000, 3)} Ω`, `I = ${fmt(Uv, 2)} V / ${fmt(R * 1000, 3)} Ω = ${fmt(I / 1000, 3)} A = ${fmt(I, 3)} mA`], check: 'V / Ω = A',
      interpretation: 'Volt durch Kiloohm ergibt direkt Milliampere.', pitfalls: ['kΩ nicht umgerechnet und das Ergebnis als A angegeben.'] };
  } },
  { id: 'el-leistung', subject: 'Physik', lesson: 'elektrizitaet', objective: 0, level: 1, title: 'Elektrische Leistung', source: 'harten', make: (r) => {
    const Uv = pick(r, [5, 12, 230]); const I = pick(r, [0.1, 0.2, 0.5, 1, 2]); const P = Uv * I;
    return { context: `Ein Gerät wird mit ${Uv} V betrieben und nimmt ${fmt(I, 2)} A auf. Welche elektrische Leistung hat es?`, givens: [`U = ${Uv} V`, `I = ${fmt(I, 2)} A`],
      sought: 'elektrische Leistung P', soughtOptions: ['elektrische Leistung P', 'Widerstand R', 'Ladung Q', 'Energie E'],
      formula: 'P = U · I', formulaOptions: ['P = U · I', 'P = U / I', 'P = I / U', 'P = U² · I'],
      result: P, unit: 'W', units: U({ w: 1, kw: 1000, mw: 0.001, va: 1 }),
      steps: [`P = ${Uv} V · ${fmt(I, 2)} A = ${fmt(P, 3)} W`], check: 'V · A = W', interpretation: 'In einer Stunde verbraucht das Gerät damit ' + fmt(P / 1000, 3) + ' kWh.', pitfalls: ['Mit dem Ohmschen Gesetz verwechselt (U/I = R).'] };
  } },
  { id: 'brechkraft', subject: 'Physik', lesson: 'optik', objective: 1, level: 1, title: 'Brechkraft', source: 'harten', make: (r) => {
    const f = pick(r, [10, 20, 25, 40, 50, 200, -50, -25, -100]); const D = 100 / f;
    return { context: `Eine Linse hat die Brennweite f = ${f} cm. Wie groß ist ihre Brechkraft?`, givens: [`f = ${f} cm`],
      sought: 'Brechkraft D', soughtOptions: ['Brechkraft D', 'Brennweite f', 'Bildweite b', 'Vergrößerung'],
      formula: 'D = 1 / f  (f in m)', formulaOptions: ['D = 1 / f  (f in m)', 'D = f', 'D = 1 / f  (f in cm)', 'D = 100 · f  (f in m)'],
      result: D, unit: 'dpt', units: U({ dpt: 1, '1/m': 1, 'm^-1': 1, dioptrien: 1, d: 1 }),
      steps: [`f = ${f} cm = ${fmt(f / 100, 2)} m`, `D = 1 / ${fmt(f / 100, 2)} m = ${fmt(D, 3)} dpt`], check: '1 / m = dpt',
      interpretation: D < 0 ? 'Negative Brechkraft: Zerstreuungslinse, wie sie bei Kurzsichtigkeit verwendet wird.' : 'Positive Brechkraft: Sammellinse, z. B. für Weitsichtigkeit oder als Lupe.', pitfalls: ['Brennweite in cm eingesetzt (Ergebnis 100-fach zu klein).', 'Vorzeichen der Zerstreuungslinse vergessen.'] };
  } },
  { id: 'hagen', subject: 'Physik', lesson: 'stroemung', objective: 1, level: 2, title: 'Hagen-Poiseuille: Radius und Volumenstrom', source: 'harten', make: (r) => {
    const q = pick(r, [0.5, 0.75, 0.8, 0.9]); const k = q ** 4;
    return { context: `Durch eine Engstelle sinkt der Gefäßradius auf ${fmt(q * 100, 2)} % des Ausgangswerts. Auf welchen Anteil sinkt der Volumenstrom bei gleicher Druckdifferenz (laminare Strömung)?`, givens: [`r_neu / r_alt = ${fmt(q, 2)}`, 'Druckdifferenz, Länge und Viskosität unverändert'],
      sought: 'Verhältnis Q_neu / Q_alt', soughtOptions: ['Verhältnis Q_neu / Q_alt', 'Strömungswiderstand R', 'Druckdifferenz Δp', 'Strömungsgeschwindigkeit'],
      formula: 'Q_neu / Q_alt = (r_neu / r_alt)⁴', formulaOptions: ['Q_neu / Q_alt = (r_neu / r_alt)⁴', 'Q_neu / Q_alt = r_neu / r_alt', 'Q_neu / Q_alt = (r_neu / r_alt)²', 'Q_neu / Q_alt = (r_alt / r_neu)⁴'],
      result: k, unit: '', units: U({ '': 1, '-': 1, fach: 1, x: 1, '%': 0.01 }),
      steps: [`Q_neu / Q_alt = ${fmt(q, 2)}⁴ = ${fmt(k, 3)} (= ${fmt(k * 100, 3)} %)`], check: 'Verhältnis gleicher Größen → dimensionslos',
      interpretation: 'Der Radius geht mit der vierten Potenz ein: Kleine Radiusänderungen haben große Wirkung auf die Durchblutung.', pitfalls: ['Quadratisch statt in der vierten Potenz gerechnet.'] };
  } },
  { id: 'kontinuitaet', subject: 'Physik', lesson: 'stroemung', objective: 3, level: 2, title: 'Kontinuitätsgleichung an einer Engstelle', source: 'harten', make: (r) => {
    const A1 = pick(r, [2, 3, 4, 5]); const v1 = num(r, 10, 30, 5); const A2 = A1 / pick(r, [2, 4, 5]); const v2 = (v1 * A1) / A2;
    return { context: `Blut fließt mit ${v1} cm/s durch einen Gefäßabschnitt mit ${fmt(A1, 2)} cm² Querschnitt. An einer Engstelle beträgt der Querschnitt nur noch ${fmt(A2, 2)} cm². Wie schnell fließt das Blut dort?`, givens: [`v₁ = ${v1} cm/s`, `A₁ = ${fmt(A1, 2)} cm²`, `A₂ = ${fmt(A2, 2)} cm²`],
      sought: 'Strömungsgeschwindigkeit v₂', soughtOptions: ['Strömungsgeschwindigkeit v₂', 'Volumenstrom Q', 'Druck p₂', 'Querschnitt A₂'],
      formula: 'v₂ = v₁ · A₁ / A₂', formulaOptions: ['v₂ = v₁ · A₁ / A₂', 'v₂ = v₁ · A₂ / A₁', 'v₂ = v₁', 'v₂ = A₁ · A₂ / v₁'],
      result: v2, unit: 'cm/s', units: U({ 'cm/s': 1, 'm/s': 100, 'mm/s': 0.1 }),
      steps: [`Q = A₁ · v₁ = ${fmt(A1, 2)} cm² · ${v1} cm/s = ${fmt(A1 * v1, 3)} cm³/s`, `v₂ = Q / A₂ = ${fmt(A1 * v1, 3)} cm³/s / ${fmt(A2, 2)} cm² = ${fmt(v2, 3)} cm/s`], check: '(cm/s · cm²) / cm² = cm/s',
      interpretation: 'Der Volumenstrom bleibt gleich; an der Engstelle muss das Blut schneller fließen.', pitfalls: ['Verhältnis der Flächen umgedreht – dann würde das Blut an der Engstelle langsamer.'] };
  } },
  // ------------------------------------------------------------------ Histologie (Mikroskop)
  { id: 'vergroesserung', subject: 'Histologie', lesson: 'mikroskopie', objective: 0, level: 1, title: 'Gesamtvergrößerung des Mikroskops', source: 'luellmann', make: (r) => {
    const o = pick(r, [4, 10, 20, 40, 63, 100]); const k = pick(r, [10, 12.5, 15]); const V = o * k;
    return { context: `Ein Präparat wird mit einem ${o}er-Objektiv und einem ${fmt(k, 3)}er-Okular betrachtet. Wie stark ist die Gesamtvergrößerung?`, givens: [`V(Objektiv) = ${o}×`, `V(Okular) = ${fmt(k, 3)}×`],
      sought: 'Gesamtvergrößerung', soughtOptions: ['Gesamtvergrößerung', 'Auflösung', 'Brennweite', 'Sehfeld'],
      formula: 'V = V_Objektiv · V_Okular', formulaOptions: ['V = V_Objektiv · V_Okular', 'V = V_Objektiv + V_Okular', 'V = V_Objektiv / V_Okular', 'V = V_Okular / V_Objektiv'],
      result: V, unit: '', units: NONE,
      steps: [`V = ${o} · ${fmt(k, 3)} = ${fmt(V, 4)}-fach`], check: 'Vergrößerungen sind dimensionslos', interpretation: 'Stärkere Vergrößerung verbessert die Auflösung nicht über etwa 0,2 µm hinaus.', pitfalls: ['Vergrößerungen addiert statt multipliziert.'] };
  } },
];

export const templateById = (id: string) => CALC_TEMPLATES.find((t) => t.id === id);

export function calcInstance(templateId: string, seed: number): CalcInstance {
  const t = templateById(templateId);
  if (!t) throw new Error(`Rechenvorlage ${templateId} fehlt`);
  return t.make(rngFrom(seed));
}

export const LEVEL_OF: Record<1 | 2 | 3, TaskLevel> = { 1: 'verstaendnis', 2: 'anwendung', 3: 'analyse' };

/** Aufgaben für TASKS (eine pro Vorlage); die Zahlen entstehen bei jedem Aufruf neu. */
export function calcTasks(lessons: Lesson[]): Task[] {
  return CALC_TEMPLATES.map((t) => {
    const l = lessons.find((x) => x.id === t.lesson);
    if (!l || !l.objectives[t.objective]) throw new Error(`Lernziel ${t.lesson}[${t.objective}] fehlt`);
    return { id: `calc-${t.id}`, type: 'calc', template: t.id, prompt: t.title, level: LEVEL_OF[t.level], lessons: [t.lesson], objective: l.objectives[t.objective], category: 'rechnen', sources: [{ id: t.source }], status: 'zu_pruefen', origin: 'redaktionell', explanation: 'Rechenweg, Einheitenkontrolle und typische Fehler werden nach dem Prüfen angezeigt.' } as Task;
  });
}

// ---------------------------------------------------------------------------
// Bewertung (wird von grading.ts aufgerufen)
// ---------------------------------------------------------------------------

export interface CalcAnswer { seed: number; sought?: string; formula?: string; value?: string; unit?: string }

export function gradeCalc(inst: CalcInstance, a: CalcAnswer, parse: (s: string) => number | null) {
  const details: string[] = [];
  const soughtOk = a.sought === inst.sought;
  const formulaOk = a.formula === inst.formula;
  const v = parse(a.value ?? '');
  const factor = inst.units[normUnit(a.unit ?? '')];
  const unitOk = factor !== undefined;
  let valueOk = false;
  let magnitude = false;
  if (v !== null && unitOk) {
    const val = v * factor;
    const tolAbs = inst.tolerance?.abs ?? 0;
    const rel = inst.tolerance?.rel ?? 0.02;
    valueOk = Math.abs(val - inst.result) <= Math.max(tolAbs, Math.abs(inst.result) * rel);
    if (!valueOk && inst.result !== 0) {
      const ratio = val / inst.result;
      magnitude = [10, 100, 1000, 1e4, 1e6, 0.1, 0.01, 0.001, 1e-4, 1e-6, 3.6, 1 / 3.6, 60, 1 / 60].some((f) => Math.abs(ratio / f - 1) < 0.03);
    }
  }
  if (!soughtOk) details.push(`Gesucht ist: ${inst.sought}.`);
  if (!formulaOk) details.push(`Passende Formel: ${inst.formula}.`);
  if (v === null) details.push('Bitte eine Zahl eingeben (Komma oder Punkt als Dezimaltrennzeichen).');
  else if (!unitOk) details.push(inst.unit ? `Die Einheit „${a.unit || '–'}“ passt nicht zur gesuchten Größe. Erwartet z. B.: ${inst.unit}.` : 'Das Ergebnis ist dimensionslos – bitte keine Einheit angeben.');
  else if (!valueOk) details.push(`Erwartet: ${fmt(inst.result, 4)}${inst.unit ? ' ' + inst.unit : ''}.${magnitude ? ' Dein Wert weicht um einen Umrechnungsfaktor ab – prüfe die Einheiten (z. B. ml/l, cm/m, km/h/m/s, min/h).' : ''}`);
  const score = (soughtOk ? 0.15 : 0) + (formulaOk ? 0.25 : 0) + (valueOk ? 0.6 : 0);
  const category = score >= 0.99 ? undefined : !soughtOk ? 'lesen' : !formulaOk ? 'formel' : v === null ? 'rechnen' : !unitOk || magnitude ? 'einheit' : 'rechnen';
  return { score: Math.round(score * 100) / 100, category: category as 'lesen' | 'formel' | 'einheit' | 'rechnen' | undefined, details };
}
