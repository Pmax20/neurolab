// Physik / Biophysik für das 1. Semester. Alle Modelle sind analytische Rechnungen mit dokumentierten Annahmen.
import { num, range, str, bool, logRange } from './core';
import type { ModelDef, SimResult } from './types';

const G = 9.81; // m/s²
const MMHG = 133.322; // Pa

// ---------------------------------------------------------------------------
// Biomechanik: Unterarm als Hebel
// ---------------------------------------------------------------------------

export function elbow(o: { load: number; L: number; d: number; arm: boolean; angle: number }) {
  const mf = o.arm ? 1.5 : 0; // Masse Unterarm + Hand (Größenordnung)
  const Lf = 0.15; // Schwerpunktabstand Unterarm (m)
  const c = Math.cos((o.angle * Math.PI) / 180);
  const torque = G * (o.load * o.L + mf * Lf) * c; // N·m – Hebelarme der Gewichtskräfte schrumpfen mit cos φ
  const Fm = torque / o.d; // Annahme: Muskel zieht senkrecht zum Unterarm (Hebelarm d konstant)
  return { torque, Fm, joint: Fm - G * (o.load + mf), weight: G * (o.load + mf) };
}

export const leverModel: ModelDef = {
  id: 'hebel',
  version: '1.0.0',
  title: 'Biomechanik: Der Unterarm als Hebel',
  module: 'physics',
  purpose: 'Mit dem Drehmomentgleichgewicht abschätzen, welche Kraft der M. biceps brachii aufbringen muss, um eine Last in der Hand zu halten – und warum diese Kraft ein Vielfaches des Lastgewichts beträgt.',
  process: 'Statisches Gleichgewicht am Ellenbogengelenk (einarmiger Hebel, Drehachse im Gelenk).',
  equations: ['Drehmoment M = F · r_⊥', 'Gleichgewicht: F_Muskel · d = F_Last · L + F_Unterarm · L_U', 'F = m · g  (g = 9,81 m/s²)', 'Bei geneigtem Unterarm wirken die Hebelarme der Gewichtskräfte mit dem Faktor cos φ'],
  params: [
    { key: 'load', label: 'Masse in der Hand', unit: 'kg', min: 0, max: 25, step: 0.5, default: 5, description: 'Zum Beispiel eine Wasserkiste-Hälfte, Hantel, Einkaufstasche.' },
    { key: 'L', label: 'Abstand Last – Ellenbogen', unit: 'm', min: 0.1, max: 0.45, step: 0.01, default: 0.35, description: 'Länge von der Gelenkachse bis zur Hand.' },
    { key: 'd', label: 'Ansatz des Muskels – Ellenbogen', unit: 'm', min: 0.02, max: 0.08, step: 0.005, default: 0.04, description: 'Hebelarm der Bizepssehne (Tuberositas radii), wenige Zentimeter.' },
    { key: 'angle', label: 'Neigung des Unterarms gegen die Waagerechte', unit: '°', min: -60, max: 60, step: 5, default: 0, description: '0° = Unterarm waagerecht (Ellenbogen 90° gebeugt).' },
    { key: 'arm', label: 'Eigengewicht des Unterarms berücksichtigen', unit: '', type: 'bool', default: true, description: '≈ 1,5 kg mit Schwerpunkt 15 cm vor dem Gelenk.', advanced: true },
  ],
  initialConditions: 'Statische Haltearbeit, keine Beschleunigung.',
  included: ['Drehmomentgleichgewicht', 'Eigengewicht des Unterarms', 'Neigung des Unterarms'],
  omitted: ['Andere Beuger (M. brachialis, M. brachioradialis)', 'Änderung des Muskel-Hebelarms mit dem Gelenkwinkel', 'Dynamik (Beschleunigung)'],
  assumptions: ['Der Bizeps zieht senkrecht zum Unterarm', 'Nur ein Muskel übernimmt die Last', 'Gelenkreaktionskraft vereinfacht als vertikale Bilanz'],
  limits: ['Größenordnungen, keine individuellen Messwerte.'],
  qualitativeOnly: [],
  modelType: 'vereinfacht',
  sources: [{ id: 'harten', locator: 'Kap. „Mechanik starrer Körper“ (Hebel, Drehmoment)' }],
  status: 'zu_pruefen',
  reviewNote: 'Lehrbuchbeispiel; Vereinfachungen dokumentiert.',
  references: [
    { name: '5 kg, Unterarm waagerecht', params: {}, expectation: 'Muskelkraft ≈ 480 N – fast das Zehnfache der Gewichtskraft der Last' },
    { name: 'Ansatz weiter distal (6 cm)', params: { d: 0.06 }, expectation: 'Muskelkraft sinkt um ein Drittel' },
  ],
  run(p): SimResult {
    const o = { load: num(p, 'load'), L: num(p, 'L'), d: num(p, 'd'), arm: bool(p, 'arm'), angle: num(p, 'angle') };
    const r = elbow(o);
    const xs = range(0, 25, 51);
    return {
      ok: true,
      warnings: o.d >= o.L ? ['Der Muskelansatz liegt nicht näher am Gelenk als die Last – anatomisch unrealistisch.'] : [],
      scalars: {
        Fm: { label: 'Benötigte Muskelkraft', value: r.Fm, unit: 'N', digits: 0 },
        Fkg: { label: 'entspricht dem Gewicht von', value: r.Fm / G, unit: 'kg', digits: 1 },
        ratio: { label: 'Hebelverhältnis L / d', value: o.L / o.d, unit: '', digits: 1 },
        torque: { label: 'Drehmoment der Gewichtskräfte', value: r.torque, unit: 'N·m', digits: 1 },
        joint: { label: 'Gelenkkraft (vereinfacht)', value: r.joint, unit: 'N', digits: 0 },
      },
      charts: [{
        id: 'force', title: 'Muskelkraft in Abhängigkeit von der Last', x: xs, xLabel: 'Masse in der Hand', xUnit: 'kg', yLabel: 'Kraft', yUnit: 'N', yMin: 0,
        series: [{ key: 'Fm', label: 'Muskelkraft', y: xs.map((m) => elbow({ ...o, load: m }).Fm) }, { key: 'W', label: 'Gewichtskraft der Last', y: xs.map((m) => m * G), dash: '6 4' }],
        vmarker: { x: o.load, label: 'aktuell' },
        description: 'Die Muskelkraft steigt linear mit der Last. Weil der Muskel nahe am Gelenk ansetzt (kurzer Hebelarm), ist sie ein Vielfaches der Gewichtskraft – dafür bewegt sich die Hand bei kleiner Muskelverkürzung weit und schnell.',
      }],
    };
  },
};

// ---------------------------------------------------------------------------
// Strömung: Hagen-Poiseuille, Kontinuität, Reynolds-Zahl
// ---------------------------------------------------------------------------

export function poiseuille(rMm: number, lCm: number, dpMmHg: number, etaMPa: number) {
  const r = rMm / 1000;
  const l = lCm / 100;
  const eta = etaMPa / 1000;
  const dp = dpMmHg * MMHG;
  const Rflow = (8 * eta * l) / (Math.PI * r ** 4); // Pa·s/m³
  const Q = dp / Rflow; // m³/s
  const v = Q / (Math.PI * r * r);
  const Re = (1060 * v * 2 * r) / eta;
  return { Rflow, Q, v, vmax: 2 * v, Re };
}

export const flowModel: ModelDef = {
  id: 'stroemung',
  version: '1.0.0',
  title: 'Strömung in Rohren und Gefäßen (Hagen-Poiseuille)',
  module: 'physics',
  purpose: 'Den Volumenstrom in einem starren Rohr bei laminarer Strömung berechnen und die starke Abhängigkeit vom Radius (r⁴) erfahrbar machen; Strömungsprofil und Reynolds-Zahl einordnen.',
  process: 'Stationäre, laminare Strömung einer Newton’schen Flüssigkeit in einem starren, geraden Rohr.',
  equations: ['Q = ΔP / R  (Ohm’sches Gesetz der Strömung)', 'R = 8·η·l / (π·r⁴)', 'Q = π·r⁴·ΔP / (8·η·l)', 'mittlere Geschwindigkeit v̄ = Q / (π·r²),  v_max = 2·v̄ (Parabelprofil)', 'Kontinuität: A₁·v₁ = A₂·v₂', 'Reynolds-Zahl Re = ρ·v̄·2r / η  (laminar bis Re ≈ 2000)'],
  params: [
    { key: 'r', label: 'Radius', unit: 'mm', min: 0.1, max: 5, step: 0.05, default: 1.5, description: 'Innenradius des Rohres bzw. Gefäßes.' },
    { key: 'l', label: 'Länge', unit: 'cm', min: 1, max: 100, step: 1, default: 10, description: 'Länge der Strecke.' },
    { key: 'dp', label: 'Druckdifferenz ΔP', unit: 'mmHg', min: 0.5, max: 100, step: 0.5, default: 5, description: 'Treibender Druckunterschied zwischen Anfang und Ende.' },
    { key: 'eta', label: 'Viskosität η', unit: 'mPa·s', min: 0.7, max: 10, step: 0.1, default: 3.5, description: 'Wasser (37 °C) ≈ 0,7; Blut ≈ 3–4 (abhängig vom Hämatokrit).' },
  ],
  initialConditions: 'Stationäre Strömung.',
  included: ['Hagen-Poiseuille-Gesetz', 'Parabolisches Geschwindigkeitsprofil', 'Reynolds-Zahl als Laminaritätskriterium'],
  omitted: ['Nicht-Newton’sches Verhalten von Blut (Fåhræus-Lindqvist-Effekt in kleinen Gefäßen)', 'Pulsatilität', 'Elastische Gefäßwände', 'Turbulenz (nur als Warnung)'],
  assumptions: ['Starres, gerades Rohr', 'Laminare Strömung', 'Dichte von Blut ρ = 1060 kg/m³'],
  limits: ['Für reale Gefäße nur qualitativ; die r⁴-Abhängigkeit erklärt aber, warum Arteriolen den Widerstand regulieren.'],
  qualitativeOnly: [],
  modelType: 'vereinfacht',
  sources: [{ id: 'harten', locator: 'Kap. „Mechanik der Flüssigkeiten und Gase“ (Strömung)' }, { id: 'guyton', locator: 'Kap. „Overview of the circulation; biophysics of pressure, flow, and resistance“' }],
  status: 'zu_pruefen',
  reviewNote: 'Formeln nach Standardlehrbüchern; Test prüft Q ∝ r⁴.',
  references: [
    { name: 'Standard', params: {}, expectation: 'Q ≈ 3,8 ml/s, laminar (Re ≈ 490)' },
    { name: 'Radius halbiert', params: { r: 0.75 }, expectation: 'Volumenstrom sinkt auf 1/16' },
    { name: 'Viskosität verdoppelt', params: { eta: 7 }, expectation: 'Volumenstrom halbiert' },
  ],
  run(p): SimResult {
    const r0 = num(p, 'r');
    const res = poiseuille(r0, num(p, 'l'), num(p, 'dp'), num(p, 'eta'));
    const rs = range(0.1, 5, 99);
    const xs = range(-1, 1, 81);
    const warnings: string[] = [];
    if (res.Re > 2000) warnings.push(`Reynolds-Zahl ≈ ${Math.round(res.Re)}: Oberhalb von etwa 2000 kann die Strömung turbulent werden. Dann gilt Hagen-Poiseuille nicht mehr, der Widerstand steigt und es entstehen Strömungsgeräusche.`);
    return {
      ok: true,
      warnings,
      scalars: {
        Q: { label: 'Volumenstrom Q', value: res.Q * 1e6, unit: 'ml/s', digits: 2 },
        Qmin: { label: 'Volumenstrom Q', value: res.Q * 6e4, unit: 'l/min', digits: 3 },
        R: { label: 'Strömungswiderstand R', value: (res.Rflow / MMHG) * 1e-6, unit: 'mmHg·s/ml', digits: 3 },
        v: { label: 'mittlere Geschwindigkeit v̄', value: res.v * 100, unit: 'cm/s', digits: 1 },
        Re: { label: 'Reynolds-Zahl', value: res.Re, unit: '', digits: 0 },
        regime: { label: 'Strömungsform (Abschätzung)', value: res.Re > 2000 ? 'möglicherweise turbulent' : 'laminar', unit: '' },
      },
      charts: [
        { id: 'qr', title: 'Volumenstrom gegen den Radius', x: rs, xLabel: 'Radius', xUnit: 'mm', yLabel: 'Q', yUnit: 'ml/s', yMin: 0,
          series: [{ key: 'Q', label: 'Volumenstrom', y: rs.map((r) => poiseuille(r, num(p, 'l'), num(p, 'dp'), num(p, 'eta')).Q * 1e6) }],
          vmarker: { x: r0, label: 'aktuell' },
          description: 'Der Volumenstrom wächst mit der vierten Potenz des Radius: Doppelter Radius ergibt sechzehnfachen Fluss, halber Radius nur ein Sechzehntel.' },
        { id: 'profile', title: 'Geschwindigkeitsprofil über den Querschnitt', x: xs, xLabel: 'Position (relativ zum Radius)', xUnit: 'r', yLabel: 'Geschwindigkeit', yUnit: 'cm/s', yMin: 0,
          series: [{ key: 'v', label: 'Strömungsgeschwindigkeit', y: xs.map((x) => res.vmax * (1 - x * x) * 100) }],
          description: 'Bei laminarer Strömung ist das Profil parabelförmig: in der Mitte am schnellsten (doppelte mittlere Geschwindigkeit), an der Wand null.' },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Elektrizitätslehre: RC-Glied
// ---------------------------------------------------------------------------

export const rcModel: ModelDef = {
  id: 'rc-glied',
  version: '1.0.0',
  title: 'Kondensator und RC-Glied',
  module: 'physics',
  purpose: 'Auf- und Entladen eines Kondensators über einen Widerstand berechnen und die Zeitkonstante τ = R·C verstehen – die Grundlage der Membranzeitkonstante von Nervenzellen und von Defibrillatoren.',
  process: 'Gleichspannungsquelle, Widerstand und Kondensator in Reihe.',
  equations: ['Q = C · U', 'τ = R · C', 'Laden: U_C(t) = U₀ · (1 − e^(−t/τ))', 'Entladen: U_C(t) = U₀ · e^(−t/τ)', 'I(t) = (U₀ / R) · e^(−t/τ)', 'Energie W = ½ · C · U²'],
  params: [
    { key: 'R', label: 'Widerstand R', unit: 'kΩ', min: 1, max: 1000, step: 1, default: 100, description: 'Ohm’scher Widerstand im Stromkreis.' },
    { key: 'C', label: 'Kapazität C', unit: 'µF', min: 0.1, max: 100, step: 0.1, default: 10, description: 'Kapazität des Kondensators.' },
    { key: 'U0', label: 'Spannung U₀', unit: 'V', min: 1, max: 12, step: 0.5, default: 5, description: 'Spannung der Quelle bzw. Anfangsspannung beim Entladen.' },
    { key: 'mode', label: 'Vorgang', unit: '', type: 'select', default: 'laden', options: [{ value: 'laden', label: 'Aufladen' }, { value: 'entladen', label: 'Entladen' }], description: 'Kondensator wird geladen oder über R entladen.' },
  ],
  initialConditions: 'Laden: Kondensator anfangs leer. Entladen: anfangs auf U₀ geladen.',
  included: ['Exponentielles Auf- und Entladen', 'Stromverlauf', 'Gespeicherte Energie'],
  omitted: ['Innenwiderstand der Quelle', 'Induktivitäten'],
  assumptions: ['Ideale Bauteile'],
  limits: ['Die Zellmembran verhält sich elektrisch näherungsweise wie ein RC-Glied (Membrankapazität ≈ 1 µF/cm²); Ionenkanäle machen R aber spannungsabhängig.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'harten', locator: 'Kap. „Elektrizitätslehre“ (Kondensator, RC-Kreis)' }],
  status: 'zu_pruefen',
  reviewNote: 'Analytische Lösung; Test prüft U(τ) = 63 %.',
  references: [
    { name: 'Standard (τ = 1 s)', params: {}, expectation: 'Nach 1 s ≈ 63 % von U₀, nach 5 τ praktisch voll' },
    { name: 'Halber Widerstand', params: { R: 50 }, expectation: 'τ halbiert, Ladestrom am Anfang doppelt so groß' },
  ],
  run(p): SimResult {
    const R = num(p, 'R') * 1e3;
    const C = num(p, 'C') * 1e-6;
    const U0 = num(p, 'U0');
    const tau = R * C;
    const charge = str(p, 'mode') === 'laden';
    const ts = range(0, 5 * tau, 201);
    const U = ts.map((t) => (charge ? U0 * (1 - Math.exp(-t / tau)) : U0 * Math.exp(-t / tau)));
    const I = ts.map((t) => ((charge ? 1 : -1) * U0 / R) * Math.exp(-t / tau) * 1000);
    const unitT = tau < 0.1 ? 'ms' : 's';
    const sx = unitT === 'ms' ? 1000 : 1;
    return {
      ok: true,
      warnings: [],
      scalars: {
        tau: { label: 'Zeitkonstante τ = R·C', value: tau * sx, unit: unitT, digits: 3 },
        thalf: { label: 'Halbwertszeit τ·ln 2', value: tau * Math.LN2 * sx, unit: unitT, digits: 3 },
        Q: { label: 'Ladung bei U₀ (Q = C·U)', value: C * U0 * 1e6, unit: 'µC', digits: 1 },
        I0: { label: 'Anfangsstrom U₀/R', value: (U0 / R) * 1000, unit: 'mA', digits: 3 },
        W: { label: 'Gespeicherte Energie bei U₀', value: 0.5 * C * U0 * U0 * 1000, unit: 'mJ', digits: 3 },
      },
      charts: [
        { id: 'u', title: charge ? 'Spannung am Kondensator beim Laden' : 'Spannung am Kondensator beim Entladen', x: ts.map((t) => t * sx), xLabel: 'Zeit', xUnit: unitT, yLabel: 'U_C', yUnit: 'V', yMin: 0,
          series: [{ key: 'U', label: 'U_C', y: U }], hlines: [{ y: charge ? 0.632 * U0 : 0.368 * U0, label: charge ? '63 % (t = τ)' : '37 % (t = τ)' }], vmarker: { x: tau * sx, label: 'τ' },
          description: 'Die Spannung ändert sich exponentiell. Nach einer Zeitkonstante τ sind 63 % der Änderung erreicht, nach etwa 5 τ ist der Vorgang praktisch abgeschlossen.' },
        { id: 'i', title: 'Strom im Stromkreis', x: ts.map((t) => t * sx), xLabel: 'Zeit', xUnit: unitT, yLabel: 'I', yUnit: 'mA',
          series: [{ key: 'I', label: 'I', y: I }],
          description: 'Der Strom ist zu Beginn am größten (U₀/R) und fällt mit derselben Zeitkonstante ab. Beim Entladen fließt er in Gegenrichtung (negatives Vorzeichen).' },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Optik: dünne Linse
// ---------------------------------------------------------------------------

export function thinLens(D: number, gCm: number, Gcm: number) {
  const g = gCm / 100;
  const inv = D - 1 / g;
  if (Math.abs(inv) < 1e-6) return { b: Infinity, beta: Infinity, B: Infinity, kind: 'Bild im Unendlichen (Gegenstand im Brennpunkt)' };
  const b = 1 / inv; // m
  const beta = -b / g;
  const kind = b > 0 ? (Math.abs(beta) > 1 ? 'reell, umgekehrt, vergrößert' : 'reell, umgekehrt, verkleinert') : 'virtuell, aufrecht, vergrößert (Lupe)';
  return { b: b * 100, beta, B: beta * Gcm, kind: D < 0 ? 'virtuell, aufrecht, verkleinert (Zerstreuungslinse)' : kind };
}

export const lensModel: ModelDef = {
  id: 'linse',
  version: '1.0.0',
  title: 'Abbildung durch eine dünne Linse',
  module: 'physics',
  purpose: 'Mit der Linsengleichung Bildweite, Abbildungsmaßstab und Art des Bildes bestimmen – Grundlage für Lupe, Mikroskop, Auge und Brillen.',
  process: 'Abbildung eines Gegenstandes durch eine dünne Linse (paraxiale Näherung).',
  equations: ['Brechkraft D = 1/f  (Dioptrie dpt = 1/m)', 'Linsengleichung: 1/f = 1/g + 1/b', 'Abbildungsmaßstab β = B/G = −b/g', 'Brechkräfte dünner, eng stehender Linsen addieren sich: D_ges = D₁ + D₂'],
  params: [
    { key: 'D', label: 'Brechkraft D', unit: 'dpt', min: -20, max: 60, step: 0.5, default: 10, description: 'Positiv: Sammellinse, negativ: Zerstreuungslinse. Das menschliche Auge hat insgesamt etwa 60 dpt.' },
    { key: 'g', label: 'Gegenstandsweite g', unit: 'cm', min: 1, max: 200, step: 0.5, default: 30, description: 'Abstand des Gegenstandes von der Linse.' },
    { key: 'G', label: 'Gegenstandsgröße G', unit: 'cm', min: 0.5, max: 10, step: 0.5, default: 2, description: 'Höhe des Gegenstandes.' },
  ],
  initialConditions: 'Stationäre geometrische Optik.',
  included: ['Linsengleichung', 'Reelle und virtuelle Bilder', 'Zerstreuungslinsen'],
  omitted: ['Linsenfehler (Aberrationen)', 'Dicke Linsen, Hauptebenen', 'Beugung (Auflösungsgrenze)'],
  assumptions: ['Dünne Linse in Luft', 'Achsennahe Strahlen'],
  limits: ['Das Auge ist ein dickes, mehrteiliges System; hier nur als Gesamtbrechkraft betrachtet.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'harten', locator: 'Kap. „Optik“ (Linsen, Auge, Mikroskop)' }],
  status: 'zu_pruefen',
  reviewNote: 'Linsengleichung; Sonderfall g = f abgefangen.',
  references: [
    { name: 'Sammellinse, g = 3f', params: {}, expectation: 'b = 15 cm, β = −0,5 (reell, umgekehrt, verkleinert)' },
    { name: 'Lupe: g < f', params: { g: 6 }, expectation: 'virtuelles, aufrechtes, vergrößertes Bild' },
    { name: 'Zerstreuungslinse', params: { D: -5 }, expectation: 'virtuelles, verkleinertes Bild' },
  ],
  run(p): SimResult {
    const D = num(p, 'D');
    const g = num(p, 'g');
    const Gs = num(p, 'G');
    const warnings: string[] = [];
    if (D === 0) return { ok: true, warnings: ['D = 0: Planparallele Platte – keine Abbildung.'], scalars: { f: { label: 'Brennweite', value: '∞', unit: '' } }, charts: [] };
    const r = thinLens(D, g, Gs);
    const f = 100 / D;
    if (!Number.isFinite(r.b)) warnings.push('Der Gegenstand steht genau im Brennpunkt: Die Strahlen verlassen die Linse parallel, es entsteht kein Bild in endlicher Entfernung.');
    const gs = range(1, 200, 400);
    const clip = (v: number) => Math.max(-300, Math.min(300, v));
    return {
      ok: true,
      warnings,
      scalars: {
        f: { label: 'Brennweite f = 1/D', value: f, unit: 'cm', digits: 1 },
        b: { label: 'Bildweite b', value: Number.isFinite(r.b) ? r.b : '∞', unit: Number.isFinite(r.b) ? 'cm' : '', digits: 1 },
        beta: { label: 'Abbildungsmaßstab β', value: Number.isFinite(r.beta) ? r.beta : '∞', unit: '', digits: 2 },
        B: { label: 'Bildgröße B', value: Number.isFinite(r.B) ? r.B : '∞', unit: Number.isFinite(r.B) ? 'cm' : '', digits: 2 },
        kind: { label: 'Art des Bildes', value: r.kind, unit: '' },
      },
      charts: [{
        id: 'bg', title: 'Bildweite in Abhängigkeit von der Gegenstandsweite', x: gs, xLabel: 'Gegenstandsweite g', xUnit: 'cm', yLabel: 'Bildweite b', yUnit: 'cm', yMin: -300, yMax: 300,
        series: [{ key: 'b', label: 'Bildweite (begrenzt auf ±300 cm)', y: gs.map((x) => { const v = thinLens(D, x, Gs).b; return Number.isFinite(v) ? clip(v) : 300; }) }],
        hlines: [{ y: 0, label: 'b = 0' }], vmarker: { x: g, label: 'aktuell' },
        description: 'Bei einer Sammellinse wird die Bildweite sehr groß, wenn sich der Gegenstand dem Brennpunkt nähert; innerhalb der Brennweite wird sie negativ (virtuelles Bild, Lupe). Weit entfernte Gegenstände werden nahe der Brennebene abgebildet.',
      }],
    };
  },
};

// ---------------------------------------------------------------------------
// Ultraschall: Wellenlänge, Auflösung, Dämpfung, Doppler
// ---------------------------------------------------------------------------

export const TISSUES: Record<string, { label: string; c: number; alpha: number }> = {
  weich: { label: 'Weichgewebe (Mittelwert)', c: 1540, alpha: 0.5 },
  fett: { label: 'Fettgewebe', c: 1450, alpha: 0.6 },
  muskel: { label: 'Skelettmuskel', c: 1580, alpha: 1.0 },
  wasser: { label: 'Wasser / Flüssigkeit', c: 1520, alpha: 0.002 },
  knochen: { label: 'Knochen (kompakt)', c: 4000, alpha: 10 },
  luft: { label: 'Luft', c: 343, alpha: 12 },
};

export function attenuationDb(alpha: number, fMHz: number, depthCm: number) {
  return 2 * alpha * fMHz * depthCm; // Hin- und Rückweg
}

export const ultrasoundModel: ModelDef = {
  id: 'ultraschall',
  version: '1.0.0',
  title: 'Ultraschall: Auflösung, Eindringtiefe und Doppler-Effekt',
  module: 'physics',
  purpose: 'Den Zielkonflikt zwischen Auflösung (kurze Wellenlänge, hohe Frequenz) und Eindringtiefe (geringe Dämpfung, niedrige Frequenz) berechnen und die Doppler-Frequenzverschiebung bei Blutfluss bestimmen.',
  process: 'Ausbreitung longitudinaler Schallwellen im Gewebe, Reflexion an Grenzflächen (Impulsechoverfahren).',
  equations: ['c = λ · f', 'Laufzeit des Echos t = 2·d / c', 'Dämpfung (Hin- und Rückweg) ≈ 2·α·f·d  in dB', 'Doppler: Δf = 2·f₀·v·cos θ / c'],
  params: [
    { key: 'f', label: 'Sendefrequenz f', unit: 'MHz', min: 1, max: 20, step: 0.5, default: 3.5, description: 'Abdomen ≈ 2–5 MHz, oberflächliche Strukturen ≈ 7–15 MHz.' },
    { key: 'tissue', label: 'Gewebe', unit: '', type: 'select', default: 'weich', options: Object.entries(TISSUES).map(([value, t]) => ({ value, label: `${t.label} (c ≈ ${t.c} m/s)` })), description: 'Bestimmt Schallgeschwindigkeit und Dämpfung.' },
    { key: 'depth', label: 'Tiefe des Reflektors', unit: 'cm', min: 1, max: 25, step: 0.5, default: 8, description: 'Abstand vom Schallkopf.' },
    { key: 'v', label: 'Blutflussgeschwindigkeit', unit: 'cm/s', min: 0, max: 200, step: 5, default: 50, description: 'Für die Doppler-Rechnung.', advanced: true },
    { key: 'theta', label: 'Winkel zwischen Schallstrahl und Fluss θ', unit: '°', min: 0, max: 90, step: 5, default: 60, description: 'Bei 90° misst der Doppler nichts.', advanced: true },
  ],
  initialConditions: 'Stationäre Rechnung.',
  included: ['Wellenlänge und axiale Auflösung (Größenordnung ≈ λ)', 'Frequenzabhängige Dämpfung', 'Echolaufzeit', 'Doppler-Verschiebung'],
  omitted: ['Laterale Auflösung (Fokussierung)', 'Reflexionsgrad an Grenzflächen (Impedanzen)', 'Nichtlineare Effekte'],
  assumptions: ['Dämpfung proportional zur Frequenz', 'Axiale Auflösung ≈ eine Wellenlänge (Pulse mit etwa zwei Schwingungen)'],
  limits: ['Dämpfungskoeffizienten sind Größenordnungen; reale Werte schwanken je nach Gewebe stark.'],
  qualitativeOnly: [],
  modelType: 'vereinfacht',
  sources: [{ id: 'harten', locator: 'Kap. „Schwingungen und Wellen“ (Schall, Ultraschall, Doppler-Effekt)' }],
  status: 'zu_pruefen',
  reviewNote: 'Werte als Lehrbuch-Größenordnungen (c Weichgewebe 1540 m/s, α ≈ 0,5 dB/(cm·MHz)).',
  references: [
    { name: 'Abdomen 3,5 MHz, 8 cm', params: {}, expectation: 'λ ≈ 0,44 mm; Echo nach ≈ 104 µs; Dämpfung ≈ 28 dB' },
    { name: 'Hohe Frequenz 12 MHz', params: { f: 12 }, expectation: 'Feinere Auflösung, aber ≈ 96 dB Dämpfung in 8 cm – zu tief' },
  ],
  run(p): SimResult {
    const t = TISSUES[str(p, 'tissue')];
    const f = num(p, 'f');
    const d = num(p, 'depth');
    const lambda = t.c / (f * 1e6); // m
    const att = attenuationDb(t.alpha, f, d);
    const tEcho = (2 * (d / 100)) / t.c; // s
    const df = (2 * f * 1e6 * (num(p, 'v') / 100) * Math.cos((num(p, 'theta') * Math.PI) / 180)) / t.c;
    const ds = range(0, 25, 101);
    const warnings: string[] = [];
    if (str(p, 'tissue') === 'luft') warnings.push('Luft leitet Ultraschall sehr schlecht und reflektiert an Grenzflächen fast vollständig – deshalb braucht man Ultraschallgel.');
    if (str(p, 'tissue') === 'knochen') warnings.push('Knochen dämpft und reflektiert stark: Dahinter entsteht ein Schallschatten.');
    if (att > 80) warnings.push('Mehr als ≈ 80 dB Dämpfung: Das Echo ist praktisch nicht mehr nutzbar.');
    return {
      ok: true,
      warnings,
      scalars: {
        lambda: { label: 'Wellenlänge λ = c/f', value: lambda * 1000, unit: 'mm', digits: 2 },
        res: { label: 'axiale Auflösung (≈ λ)', value: lambda * 1000, unit: 'mm', digits: 2 },
        tEcho: { label: 'Laufzeit des Echos', value: tEcho * 1e6, unit: 'µs', digits: 0 },
        att: { label: 'Dämpfung hin und zurück', value: att, unit: 'dB', digits: 1 },
        rest: { label: 'verbleibende Intensität', value: 100 * 10 ** (-att / 10), unit: '%', digits: 4 },
        df: { label: 'Doppler-Verschiebung Δf', value: df / 1000, unit: 'kHz', digits: 2 },
      },
      charts: [{
        id: 'att', title: 'Dämpfung des Echos mit der Tiefe', x: ds, xLabel: 'Tiefe', xUnit: 'cm', yLabel: 'Dämpfung', yUnit: 'dB', yMin: 0,
        series: [
          { key: 'a', label: `${String(f).replace('.', ',')} MHz`, y: ds.map((x) => attenuationDb(t.alpha, f, x)) },
          { key: 'b', label: `${String(f / 2).replace('.', ',')} MHz`, y: ds.map((x) => attenuationDb(t.alpha, f / 2, x)), dash: '6 4' },
          { key: 'c', label: `${String(2 * f).replace('.', ',')} MHz`, y: ds.map((x) => attenuationDb(t.alpha, 2 * f, x)), dash: '2 3' },
        ],
        hlines: [{ y: 80, label: 'Nutzbarkeitsgrenze (Größenordnung)' }], vmarker: { x: d, label: 'Reflektor' },
        description: 'Die Dämpfung steigt mit Tiefe und Frequenz. Hohe Frequenzen liefern feinere Auflösung, reichen aber weniger tief.',
      }],
    };
  },
};

// ---------------------------------------------------------------------------
// Radioaktiver Zerfall, effektive Halbwertszeit
// ---------------------------------------------------------------------------

export const NUCLIDES: Record<string, { label: string; T: number; use: string }> = {
  tc99m: { label: 'Technetium-99m', T: 6.01, use: 'γ-Strahler (140 keV) für Szintigrafien – häufigstes Radionuklid der Nuklearmedizin.' },
  f18: { label: 'Fluor-18', T: 109.8 / 60, use: 'β⁺-Strahler für die PET (z. B. [¹⁸F]FDG); gemessen werden die 511-keV-Vernichtungsphotonen.' },
  i123: { label: 'Iod-123', T: 13.2, use: 'γ-Strahler für die Schilddrüsendiagnostik.' },
  i131: { label: 'Iod-131', T: 8.02 * 24, use: 'β⁻- und γ-Strahler; Radioiodtherapie der Schilddrüse.' },
};

export function decay(A0: number, Th: number, t: number) {
  return A0 * Math.exp((-Math.LN2 * t) / Th);
}
export function effectiveHalfLife(Tphys: number, Tbio: number) {
  return (Tphys * Tbio) / (Tphys + Tbio);
}

export const decayModel: ModelDef = {
  id: 'zerfall',
  version: '1.0.0',
  title: 'Radioaktiver Zerfall und effektive Halbwertszeit',
  module: 'physics',
  purpose: 'Das Zerfallsgesetz an Radionukliden der Nuklearmedizin anwenden und zeigen, wie physikalischer Zerfall und biologische Ausscheidung zusammen die effektive Halbwertszeit bestimmen.',
  process: 'Spontaner Kernzerfall (statistischer Prozess) und gleichzeitige Ausscheidung aus dem Körper.',
  equations: ['A(t) = A₀ · e^(−λ·t),  λ = ln 2 / T½', 'nach n Halbwertszeiten: A = A₀ / 2ⁿ', '1/T_eff = 1/T_phys + 1/T_biol  ⇔  T_eff = T_phys·T_biol / (T_phys + T_biol)', 'Aktivität in Becquerel: 1 Bq = 1 Zerfall pro Sekunde'],
  params: [
    { key: 'nuclide', label: 'Radionuklid', unit: '', type: 'select', default: 'tc99m', options: Object.entries(NUCLIDES).map(([value, n]) => ({ value, label: `${n.label} (T½ ≈ ${n.T >= 24 ? (n.T / 24).toFixed(2).replace('.', ',') + ' d' : n.T.toFixed(2).replace('.', ',') + ' h'})` })), description: 'Physikalische Halbwertszeit gerundet.' },
    { key: 'A0', label: 'Anfangsaktivität A₀', unit: 'MBq', min: 1, max: 1000, step: 1, default: 500, description: 'Applizierte Aktivität.' },
    { key: 'useBio', label: 'Biologische Ausscheidung berücksichtigen', unit: '', type: 'bool', default: false, description: 'Der Körper scheidet den Stoff zusätzlich aus.' },
    { key: 'Tbio', label: 'Biologische Halbwertszeit', unit: 'h', min: 0.5, max: 1000, step: 0.5, default: 24, description: 'Zeit, in der die Hälfte des Stoffes ausgeschieden wird.' },
    { key: 'tmax', label: 'Betrachteter Zeitraum', unit: 'h', min: 1, max: 1000, step: 1, default: 48, description: 'Länge der Zeitachse.' },
  ],
  initialConditions: 'Zum Zeitpunkt 0 ist die gesamte Aktivität A₀ im Körper.',
  included: ['Exponentielles Zerfallsgesetz', 'Effektive Halbwertszeit'],
  omitted: ['Mutter-Tochter-Zerfallsketten', 'Verteilung auf Organe', 'Dosisberechnung'],
  assumptions: ['Ausscheidung folgt einer Kinetik erster Ordnung (konstante biologische Halbwertszeit)'],
  limits: ['Für die Strahlendosis sind Strahlenart, Energie und Organverteilung entscheidend – hier nicht berechnet.'],
  qualitativeOnly: [],
  modelType: 'ausführlich',
  sources: [{ id: 'harten', locator: 'Kap. „Atome und ionisierende Strahlung“' }, { id: 'bfs' }],
  status: 'zu_pruefen',
  reviewNote: 'Halbwertszeiten gerundet: Tc-99m 6,0 h, F-18 109,8 min, I-123 13,2 h, I-131 8,02 d.',
  references: [
    { name: 'Tc-99m nach 24 h', params: { tmax: 24 }, expectation: 'Nach 4 Halbwertszeiten ≈ 1/16 der Anfangsaktivität' },
    { name: 'I-131 mit Ausscheidung', params: { nuclide: 'i131', useBio: true, Tbio: 80, tmax: 500 }, expectation: 'T_eff ≈ 56 h – deutlich kürzer als T_phys ≈ 192 h' },
  ],
  run(p): SimResult {
    const n = NUCLIDES[str(p, 'nuclide')];
    const A0 = num(p, 'A0');
    const useBio = bool(p, 'useBio');
    const Tbio = num(p, 'Tbio');
    const Teff = useBio ? effectiveHalfLife(n.T, Tbio) : n.T;
    const tmax = num(p, 'tmax');
    const ts = range(0, tmax, 241);
    const series = [{ key: 'phys', label: 'nur physikalischer Zerfall', y: ts.map((t) => decay(A0, n.T, t)) }];
    if (useBio) series.push({ key: 'eff', label: 'mit Ausscheidung (effektiv)', y: ts.map((t) => decay(A0, Teff, t)), dash: '6 4' } as any);
    const Aend = decay(A0, Teff, tmax);
    return {
      ok: true,
      warnings: [],
      scalars: {
        T: { label: 'physikalische Halbwertszeit', value: n.T, unit: 'h', digits: 2 },
        lambda: { label: 'Zerfallskonstante λ', value: Math.LN2 / n.T, unit: '1/h', digits: 4 },
        Teff: { label: 'effektive Halbwertszeit', value: Teff, unit: 'h', digits: 2 },
        nHalf: { label: 'Anzahl Halbwertszeiten im Zeitraum', value: tmax / Teff, unit: '', digits: 2 },
        Aend: { label: 'Aktivität am Ende des Zeitraums', value: Aend, unit: 'MBq', digits: 2 },
        frac: { label: 'verbleibender Anteil', value: (100 * Aend) / A0, unit: '%', digits: 2 },
        use: { label: 'Verwendung', value: n.use, unit: '' },
      },
      charts: [{
        id: 'a', title: 'Aktivität im Zeitverlauf', x: ts, xLabel: 'Zeit', xUnit: 'h', yLabel: 'Aktivität', yUnit: 'MBq', yMin: 0,
        series, hlines: [{ y: A0 / 2, label: 'A₀/2' }, { y: A0 / 4, label: 'A₀/4' }],
        description: 'Die Aktivität halbiert sich in jeder Halbwertszeit. Mit biologischer Ausscheidung fällt sie schneller ab (effektive Halbwertszeit kürzer als jede einzelne).',
      }],
    };
  },
};

// ---------------------------------------------------------------------------
// Diffusion: Zeit wächst mit dem Quadrat der Strecke
// ---------------------------------------------------------------------------

export function diffusionTime(xUm: number, Dcm2s: number) {
  const x = xUm * 1e-4; // cm
  return (x * x) / (2 * Dcm2s); // s (eindimensional, mittleres Verschiebungsquadrat)
}

export function fmtTime(s: number) {
  if (s < 1e-3) return `${(s * 1e6).toPrecision(3)} µs`;
  if (s < 1) return `${(s * 1e3).toPrecision(3)} ms`;
  if (s < 120) return `${s.toPrecision(3)} s`;
  if (s < 7200) return `${(s / 60).toPrecision(3)} min`;
  if (s < 2 * 86400) return `${(s / 3600).toPrecision(3)} h`;
  if (s < 2 * 365 * 86400) return `${(s / 86400).toPrecision(3)} Tage`;
  return `${(s / (365 * 86400)).toPrecision(3)} Jahre`;
}

export const SOLUTES: Record<string, { label: string; D: number }> = {
  o2: { label: 'O₂ in Wasser (37 °C)', D: 3.0e-5 },
  glukose: { label: 'Glukose in Wasser', D: 0.67e-5 },
  protein: { label: 'Protein (z. B. Albumin)', D: 0.06e-5 },
};

export const diffusionModel: ModelDef = {
  id: 'diffusion',
  version: '1.0.0',
  title: 'Diffusion: Warum kurze Wege entscheidend sind',
  module: 'physics',
  purpose: 'Zeigen, dass die mittlere Diffusionszeit mit dem Quadrat der Strecke wächst (t ≈ x²/2D) und das 1. Fick’sche Gesetz auf die Lunge anwenden.',
  process: 'Ungerichtete Wärmebewegung von Teilchen (Brown’sche Molekularbewegung) führt netto zum Ausgleich von Konzentrationsunterschieden.',
  equations: ['mittlere Zeit (eindimensional): t ≈ x² / (2·D)', '1. Fick’sches Gesetz: J = −D · A · Δc / Δx', 'Diffusionskoeffizient D hängt von Teilchengröße, Medium und Temperatur ab'],
  params: [
    { key: 'solute', label: 'Teilchen', unit: '', type: 'select', default: 'o2', options: Object.entries(SOLUTES).map(([value, s]) => ({ value, label: s.label })), description: 'Größere Teilchen diffundieren langsamer.' },
    { key: 'x', label: 'Diffusionsstrecke', unit: 'µm', min: 0.1, max: 10000, step: 0.1, default: 1, description: 'Blut-Luft-Schranke ≈ 0,5–1 µm; Zelldurchmesser ≈ 10–20 µm; 1 cm = 10 000 µm.' },
  ],
  initialConditions: 'Punktförmiger Start, freie Diffusion.',
  included: ['Quadratische Abhängigkeit der Zeit von der Strecke', 'Unterschiedliche Diffusionskoeffizienten'],
  omitted: ['Konvektion', 'Bindung an Proteine (z. B. Hämoglobin)', 'Membranen als Hindernis'],
  assumptions: ['Eindimensionale Betrachtung', 'Konstante Temperatur'],
  limits: ['Größenordnungen; Diffusionskoeffizienten gerundet.'],
  qualitativeOnly: [],
  modelType: 'vereinfacht',
  sources: [{ id: 'harten', locator: 'Kap. „Wärmelehre“ (Diffusion, Osmose)' }, { id: 'west', locator: 'Kap. „Diffusion“' }],
  status: 'zu_pruefen',
  reviewNote: 'Diffusionskoeffizienten als Lehrbuch-Größenordnungen.',
  references: [
    { name: 'O₂ über 1 µm', params: {}, expectation: 'etwa 0,2 ms – sehr schnell' },
    { name: 'O₂ über 1 cm', params: { x: 10000 }, expectation: 'mehrere Stunden (≈ 4–5 h) – deshalb braucht der Körper einen Kreislauf' },
  ],
  run(p): SimResult {
    const s = SOLUTES[str(p, 'solute')];
    const x = num(p, 'x');
    const t = diffusionTime(x, s.D);
    const xs = logRange(0.1, 10000, 120);
    return {
      ok: true,
      warnings: [],
      scalars: {
        t: { label: 'mittlere Diffusionszeit', value: fmtTime(t), unit: '' },
        logt: { label: 'Größenordnung: log₁₀(Zeit in s)', value: Math.log10(t), unit: '', digits: 1 },
        D: { label: 'Diffusionskoeffizient D', value: s.D * 1e5, unit: '10⁻⁵ cm²/s', digits: 2 },
        t10: { label: 'zehnfache Strecke dauert', value: '100-mal so lange', unit: '' },
      },
      charts: [{
        id: 't', title: 'Diffusionszeit gegen die Strecke', x: xs, logX: true, xLabel: 'Strecke', xUnit: 'µm', yLabel: 'log₁₀(Zeit in s)', yUnit: '',
        series: Object.entries(SOLUTES).map(([k, v], i) => ({ key: k, label: v.label, y: xs.map((xx) => Math.log10(diffusionTime(xx, v.D))), dash: i === 0 ? undefined : i === 1 ? '6 4' : '2 3' })),
        hlines: [{ y: 0, label: '1 s' }, { y: Math.log10(3600), label: '1 h' }, { y: Math.log10(86400), label: '1 Tag' }],
        vmarker: { x, label: 'aktuell' },
        description: 'Die Zeit steigt mit dem Quadrat der Strecke (auf der doppelt-logarithmischen Darstellung eine Gerade mit Steigung 2). Über Mikrometer ist Diffusion schnell, über Zentimeter viel zu langsam.',
      }],
    };
  },
};
