import { logRange, num, rtf, str } from './core';
import type { ModelDef, SimResult } from './types';

export type IonKey = 'Na' | 'K' | 'Ca' | 'Cl';
export const ION_Z: Record<IonKey, number> = { Na: 1, K: 1, Ca: 2, Cl: -1 };
export const ION_NAME: Record<IonKey, string> = { Na: 'Na⁺', K: 'K⁺', Ca: 'Ca²⁺', Cl: 'Cl⁻' };

/** Nernst-Gleichgewichtspotenzial in mV. E = (RT/zF)·ln(c_außen/c_innen) */
export function nernst(z: number, cOut: number, cIn: number, tempC = 37): number {
  if (cOut <= 0 || cIn <= 0) throw new Error('Konzentrationen müssen größer als 0 sein.');
  return (rtf(tempC) / z) * Math.log(cOut / cIn);
}

/** Goldman-Hodgkin-Katz-Spannungsgleichung für Na⁺, K⁺, Cl⁻ (relative Permeabilitäten). */
export function ghk(
  c: { Na: [number, number]; K: [number, number]; Cl: [number, number] },
  p: { Na: number; K: number; Cl: number },
  tempC = 37,
): number {
  const num_ = p.K * c.K[0] + p.Na * c.Na[0] + p.Cl * c.Cl[1];
  const den = p.K * c.K[1] + p.Na * c.Na[1] + p.Cl * c.Cl[0];
  return rtf(tempC) * Math.log(num_ / den);
}

/** Mullins-Noda-Gleichung: berücksichtigt den elektrogenen Beitrag der Na⁺/K⁺-ATPase (Kopplungsverhältnis r = 3/2). */
export function mullinsNoda(
  c: { Na: [number, number]; K: [number, number] },
  p: { Na: number; K: number },
  r = 1.5,
  tempC = 37,
): number {
  return rtf(tempC) * Math.log((r * p.K * c.K[0] + p.Na * c.Na[0]) / (r * p.K * c.K[1] + p.Na * c.Na[1]));
}

export interface DriveInfo {
  ion: IonKey;
  E: number;
  concDirection: 'einwärts' | 'auswärts' | 'keine';
  electricDirection: 'einwärts' | 'auswärts' | 'keine';
  drivingForce: number; // Vm - E (mV)
  netDirection: 'einwärts' | 'auswärts' | 'kein Nettostrom';
}

/** Richtungen der Kräfte auf ein Ion bei gegebenem Membranpotenzial (innen relativ zu außen). */
export function driveInfo(ion: IonKey, cOut: number, cIn: number, vm: number, tempC = 37): DriveInfo {
  const z = ION_Z[ion];
  const E = nernst(z, cOut, cIn, tempC);
  const concDirection = cOut > cIn ? 'einwärts' : cOut < cIn ? 'auswärts' : 'keine';
  // Negatives Innenpotenzial zieht Kationen nach innen und drückt Anionen nach außen.
  let electricDirection: DriveInfo['electricDirection'] = 'keine';
  if (Math.abs(vm) > 1e-9) electricDirection = vm * z < 0 ? 'einwärts' : 'auswärts';
  const df = vm - E;
  // Ionenstrom I = g(Vm − E): positiv = Auswärtsstrom positiver Ladung.
  // Für Kationen bedeutet I>0 Ionenbewegung nach außen, für Anionen nach innen.
  let netDirection: DriveInfo['netDirection'] = 'kein Nettostrom';
  if (Math.abs(df) > 0.5) {
    const outwardCurrent = df > 0;
    const ionMovesOut = z > 0 ? outwardCurrent : !outwardCurrent;
    netDirection = ionMovesOut ? 'auswärts' : 'einwärts';
  }
  return { ion, E, concDirection, electricDirection, drivingForce: df, netDirection };
}

export const membraneModel: ModelDef = {
  id: 'ruhemembranpotenzial',
  version: '1.0.0',
  title: 'Ruhemembranpotenzial (Nernst, Goldman-Hodgkin-Katz, Mullins-Noda)',
  module: 'neuro',
  purpose:
    'Untersuchen, wie ungleiche Ionenverteilung und selektive Permeabilität das Membranpotenzial bestimmen und welchen Beitrag die Na⁺/K⁺-ATPase leistet.',
  process: 'Entstehung des Ruhemembranpotenzials einer erregbaren Zelle (stationärer Zustand).',
  equations: [
    'Nernst: E_X = (R·T)/(z·F) · ln([X]_außen / [X]_innen)',
    'GHK: V_m = (R·T/F) · ln( (P_K[K]_a + P_Na[Na]_a + P_Cl[Cl]_i) / (P_K[K]_i + P_Na[Na]_i + P_Cl[Cl]_a) )',
    'Mullins-Noda: V_m = (R·T/F) · ln( (r·P_K[K]_a + P_Na[Na]_a) / (r·P_K[K]_i + P_Na[Na]_i) ), r = 3/2',
    'Elektrochemische Triebkraft: V_m − E_X',
  ],
  params: [
    { key: 'model', label: 'Berechnungsmodell', unit: '', type: 'select', default: 'ghk', options: [
      { value: 'ghk', label: 'GHK (vereinfacht, ohne Pumpenstrom)' },
      { value: 'mn', label: 'Mullins-Noda (mit elektrogenem Pumpenbeitrag)' },
    ], description: 'GHK beschreibt das Potenzial bei gegebenen Gradienten; Mullins-Noda ergänzt den direkten elektrogenen Beitrag der 3Na⁺/2K⁺-Pumpe (ohne Cl⁻).' },
    { key: 'Ko', label: '[K⁺] außen', unit: 'mmol/l', min: 0.5, max: 150, step: 0.5, default: 4, description: 'Extrazelluläre Kaliumkonzentration (Modellparameter).' },
    { key: 'Ki', label: '[K⁺] innen', unit: 'mmol/l', min: 1, max: 200, step: 1, default: 140, description: 'Intrazelluläre Kaliumkonzentration (Modellparameter).' },
    { key: 'Nao', label: '[Na⁺] außen', unit: 'mmol/l', min: 1, max: 200, step: 1, default: 145, description: 'Extrazelluläre Natriumkonzentration.' },
    { key: 'Nai', label: '[Na⁺] innen', unit: 'mmol/l', min: 1, max: 150, step: 1, default: 12, description: 'Intrazelluläre Natriumkonzentration.' },
    { key: 'Clo', label: '[Cl⁻] außen', unit: 'mmol/l', min: 1, max: 200, step: 1, default: 110, description: 'Extrazelluläre Chloridkonzentration.' },
    { key: 'Cli', label: '[Cl⁻] innen', unit: 'mmol/l', min: 1, max: 150, step: 1, default: 7, description: 'Intrazelluläre Chloridkonzentration (reife Neurone typ. ca. 4–10 mmol/l; zelltypabhängig, in unreifen Neuronen höher).' },
    { key: 'Cao', label: '[Ca²⁺] außen (frei)', unit: 'mmol/l', min: 0.1, max: 10, step: 0.1, default: 1.2, description: 'Nur für das Ca²⁺-Gleichgewichtspotenzial; geht nicht in die GHK-Berechnung ein.' },
    { key: 'Cai', label: '[Ca²⁺] innen (frei)', unit: 'µmol/l', min: 0.01, max: 10, step: 0.01, default: 0.1, description: 'Freies zytosolisches Calcium (µmol/l!).' },
    { key: 'pK', label: 'Relative Permeabilität K⁺', unit: '', min: 0, max: 1, step: 0.01, default: 1, description: 'Relative Permeabilität, auf K⁺ bezogen.' },
    { key: 'pNa', label: 'Relative Permeabilität Na⁺', unit: '', min: 0, max: 20, step: 0.01, default: 0.04, description: 'In Ruhe deutlich kleiner als P_K; während des Aktionspotenzials vorübergehend stark erhöht.' },
    { key: 'pCl', label: 'Relative Permeabilität Cl⁻', unit: '', min: 0, max: 2, step: 0.01, default: 0.1, description: 'Relative Chloridpermeabilität (zelltypabhängig).' },
    { key: 'T', label: 'Temperatur', unit: '°C', min: 0, max: 45, step: 0.5, default: 37, description: 'Geht über R·T/F in alle Gleichungen ein.', advanced: true },
  ],
  initialConditions: 'Stationär: Es werden keine Zeitverläufe berechnet, sondern Gleichgewichtszustände.',
  included: ['Ionenverteilung Na⁺, K⁺, Cl⁻', 'Relative Permeabilitäten', 'Gleichgewichtspotenziale inkl. Ca²⁺', 'Optional: elektrogener Beitrag der Na⁺/K⁺-ATPase (Mullins-Noda)'],
  omitted: ['Zeitliche Veränderung der Konzentrationen', 'Weitere Transporter (z. B. NKCC, KCC)', 'Donnan-Effekte', 'Aktivitätskoeffizienten', 'Zelltypspezifische Kanaltypen'],
  assumptions: ['Konstante Feldstärke in der Membran (GHK-Annahme)', 'Ionen bewegen sich unabhängig voneinander', 'Stationärer Zustand: Nettostrom der berücksichtigten Ionen ist null'],
  limits: ['Die Standardwerte sind typische Modellwerte für eine Säugerzelle, keine universellen Konzentrationen für alle Zelltypen.', 'Ca²⁺ wird nur für das Gleichgewichtspotenzial betrachtet.'],
  qualitativeOnly: ['Die Höhe des Pumpenbeitrags hängt von Zelltyp und Pumpaktivität ab; der Mullins-Noda-Wert ist eine Näherung.'],
  modelType: 'vereinfacht',
  sources: [{ id: 'goldman' }, { id: 'mullins' }, { id: 'hille', locator: 'Kap. „Selective permeability: independence“' }, { id: 'kandel', locator: 'Kap. „Membrane Potential and the Passive Electrical Properties of the Neuron“' }],
  status: 'zu_pruefen',
  reviewNote: 'Gleichungen aus Primärliteratur übernommen; fachliche Prüfung der Erklärtexte ausstehend.',
  references: [
    { name: 'Referenzzustand', params: {}, expectation: 'V_m ≈ −70 bis −75 mV, nahe, aber positiver als E_K.' },
    { name: 'Hyperkaliämie (fiktiver Lehrfall)', params: { Ko: 8 }, expectation: 'Depolarisation um etwa 10–15 mV.' },
  ],
  run(p): SimResult {
    const T = num(p, 'T');
    const c = { Na: [num(p, 'Nao'), num(p, 'Nai')] as [number, number], K: [num(p, 'Ko'), num(p, 'Ki')] as [number, number], Cl: [num(p, 'Clo'), num(p, 'Cli')] as [number, number] };
    const perm = { Na: num(p, 'pNa'), K: num(p, 'pK'), Cl: num(p, 'pCl') };
    if (perm.Na + perm.K + perm.Cl <= 0) throw new Error('Mindestens eine Permeabilität muss größer als 0 sein.');
    const model = str(p, 'model');
    const calc = (Ko: number) =>
      model === 'mn'
        ? mullinsNoda({ Na: c.Na, K: [Ko, c.K[1]] }, perm, 1.5, T)
        : ghk({ ...c, K: [Ko, c.K[1]] }, perm, T);
    const vm = calc(c.K[0]);
    const vmGhk = ghk(c, perm, T);
    const E = {
      Na: nernst(1, c.Na[0], c.Na[1], T),
      K: nernst(1, c.K[0], c.K[1], T),
      Cl: nernst(-1, c.Cl[0], c.Cl[1], T),
      Ca: nernst(2, num(p, 'Cao'), num(p, 'Cai') / 1000, T),
    };
    const xs = logRange(0.5, 150, 120);
    const vmCurve = xs.map(calc);
    const ekCurve = xs.map((k) => nernst(1, k, c.K[1], T));
    const warnings: string[] = [];
    if (model === 'mn' && perm.Cl > 0) warnings.push('Die Mullins-Noda-Gleichung berücksichtigt Cl⁻ nicht; die Chloridpermeabilität wird hier ignoriert.');
    return {
      ok: true,
      warnings,
      scalars: {
        vm: { label: 'Membranpotenzial V_m', value: vm, unit: 'mV', digits: 1 },
        vmGhk: { label: 'V_m nach GHK (ohne Pumpe)', value: vmGhk, unit: 'mV', digits: 1 },
        pump: { label: 'Direkter Pumpenbeitrag (MN − GHK, ohne Cl⁻)', value: mullinsNoda(c, perm, 1.5, T) - mullinsNoda(c, perm, 1, T), unit: 'mV', digits: 1 },
        ENa: { label: 'E_Na', value: E.Na, unit: 'mV', digits: 1 },
        EK: { label: 'E_K', value: E.K, unit: 'mV', digits: 1 },
        ECl: { label: 'E_Cl', value: E.Cl, unit: 'mV', digits: 1 },
        ECa: { label: 'E_Ca', value: E.Ca, unit: 'mV', digits: 1 },
        dfNa: { label: 'Triebkraft Na⁺ (V_m − E_Na)', value: vm - E.Na, unit: 'mV', digits: 1 },
        dfK: { label: 'Triebkraft K⁺ (V_m − E_K)', value: vm - E.K, unit: 'mV', digits: 1 },
        dfCl: { label: 'Triebkraft Cl⁻ (V_m − E_Cl)', value: vm - E.Cl, unit: 'mV', digits: 1 },
      },
      charts: [
        {
          id: 'vm-ko',
          title: 'Membranpotenzial in Abhängigkeit von [K⁺] außen',
          x: xs,
          xLabel: '[K⁺] außen',
          xUnit: 'mmol/l',
          logX: true,
          yLabel: 'Potenzial',
          yUnit: 'mV',
          series: [
            { key: 'vm', label: 'V_m (gewähltes Modell)', y: vmCurve },
            { key: 'ek', label: 'E_K (Nernst)', y: ekCurve, dash: '6 4' },
          ],
          vmarker: { x: c.K[0], label: 'aktuell' },
          description:
            'Logarithmische x-Achse. Bei hohen äußeren K⁺-Konzentrationen nähert sich V_m dem K⁺-Gleichgewichtspotenzial; bei niedrigen weicht es wegen der Na⁺-Permeabilität deutlich davon ab.',
        },
      ],
    };
  },
};
