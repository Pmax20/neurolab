import { StepLimit, logRange, num, range, rtf, str } from './core';
import type { ModelDef, SimResult } from './types';

// ---------------------------------------------------------------------------
// Enzymkinetik
// ---------------------------------------------------------------------------

export type Inhibition = 'keine' | 'kompetitiv' | 'nichtkompetitiv' | 'unkompetitiv';

export function mmRate(S: number, Vmax: number, Km: number, I: number, Ki: number, type: Inhibition): number {
  const a = 1 + I / Ki;
  switch (type) {
    case 'kompetitiv':
      return (Vmax * S) / (Km * a + S);
    case 'nichtkompetitiv':
      return (Vmax / a) * (S / (Km + S));
    case 'unkompetitiv':
      return (Vmax * S) / (Km + a * S);
    default:
      return (Vmax * S) / (Km + S);
  }
}

/** Qualitativer Temperatur- und pH-Faktor (KEIN mechanistisches Modell) */
export function tempFactor(T: number, Topt: number) {
  const q10 = 2 ** ((T - Topt) / 10);
  const denat = T > Topt ? Math.exp(-((T - Topt) ** 2) / 50) : 1;
  return q10 * denat;
}
export function phFactor(pH: number, pHopt: number) {
  return Math.exp(-(((pH - pHopt) / 1.2) ** 2));
}

export const enzymeModel: ModelDef = {
  id: 'enzymkinetik',
  version: '1.0.0',
  title: 'Enzymkinetik (Michaelis-Menten mit Hemmung)',
  module: 'cell',
  purpose: 'Abhängigkeit der Reaktionsgeschwindigkeit von Substrat, Enzym, Hemmstoffen, Temperatur und pH untersuchen.',
  process: 'Enzymkatalysierte Umsetzung S → P über einen Enzym-Substrat-Komplex.',
  equations: [
    'v = V_max·[S] / (K_m + [S]),   V_max = k_cat·[E]_gesamt',
    'kompetitiv:      v = V_max·[S] / (K_m·(1 + [I]/K_i) + [S])',
    'nichtkompetitiv: v = V_max/(1 + [I]/K_i) · [S]/(K_m + [S])',
    'unkompetitiv:    v = V_max·[S] / (K_m + (1 + [I]/K_i)·[S])',
    'Zeitverlauf: d[P]/dt = v([S]),  d[S]/dt = −v([S])',
    'Temperatur/pH: qualitative Faktoren (Q10 = 2 bis zum Optimum, danach Denaturierung; Glockenkurve um pH-Optimum)',
  ],
  params: [
    { key: 'S0', label: 'Substratkonzentration [S]₀', unit: 'mmol/l', min: 0.01, max: 50, step: 0.01, default: 2, description: 'Ausgangskonzentration des Substrats.' },
    { key: 'E', label: 'Enzymkonzentration', unit: 'µmol/l', min: 0.01, max: 10, step: 0.01, default: 1, description: 'V_max ist proportional zur Enzymkonzentration.' },
    { key: 'kcat', label: 'Wechselzahl k_cat', unit: '1/s', min: 0.1, max: 100, step: 0.1, default: 10, description: 'Umsätze pro Enzymmolekül und Sekunde.' },
    { key: 'Km', label: 'Michaelis-Konstante K_m', unit: 'mmol/l', min: 0.01, max: 20, step: 0.01, default: 1, description: 'Substratkonzentration bei halbmaximaler Geschwindigkeit.' },
    { key: 'inh', label: 'Hemmtyp', unit: '', type: 'select', default: 'keine', options: [
      { value: 'keine', label: 'kein Hemmstoff' },
      { value: 'kompetitiv', label: 'kompetitiv (K_m scheinbar ↑)' },
      { value: 'nichtkompetitiv', label: 'nichtkompetitiv, rein (V_max ↓)' },
      { value: 'unkompetitiv', label: 'unkompetitiv (K_m und V_max ↓)' },
    ], description: 'Modellvorstellungen reversibler Hemmung.' },
    { key: 'I', label: 'Hemmstoffkonzentration [I]', unit: 'mmol/l', min: 0, max: 20, step: 0.01, default: 0, description: 'Konzentration des Hemmstoffs.' },
    { key: 'Ki', label: 'Hemmkonstante K_i', unit: 'mmol/l', min: 0.01, max: 20, step: 0.01, default: 1, description: 'Dissoziationskonstante des Enzym-Hemmstoff-Komplexes.' },
    { key: 'T', label: 'Temperatur', unit: '°C', min: 0, max: 70, step: 0.5, default: 37, description: 'Qualitativer Einfluss (siehe Modellgrenzen).' },
    { key: 'pH', label: 'pH-Wert', unit: '', min: 1, max: 13, step: 0.1, default: 7.4, description: 'Qualitativer Einfluss; Optimum enzymabhängig.' },
    { key: 'pHopt', label: 'pH-Optimum des Enzyms', unit: '', min: 1, max: 12, step: 0.1, default: 7.4, description: 'z. B. Pepsin ≈ 2, Trypsin ≈ 8 (Größenordnungen).', advanced: true },
  ],
  initialConditions: '[P]₀ = 0; [S]₀ wie eingestellt.',
  included: ['Michaelis-Menten-Kinetik', 'Reversible Hemmtypen', 'Substratverbrauch über die Zeit', 'Qualitative Temperatur-/pH-Abhängigkeit'],
  omitted: ['Rückreaktion / Produkthemmung', 'Allosterische Kooperativität (Hill-Kinetik)', 'Irreversible Hemmung', 'Mechanistische Denaturierung'],
  assumptions: ['Fließgleichgewicht des ES-Komplexes (Briggs-Haldane)', '[E] ≪ [S]', 'Anfangsgeschwindigkeit ohne Produkt', 'Temperatur- und pH-Faktoren sind rein illustrativ'],
  limits: ['Die Formeln gelten nur unter den genannten Voraussetzungen.'],
  qualitativeOnly: ['Temperatur', 'pH'],
  modelType: 'vereinfacht',
  sources: [{ id: 'mm1913' }, { id: 'stryer', locator: 'Kap. „Enzymes: Basic Concepts and Kinetics“' }],
  status: 'zu_pruefen',
  reviewNote: 'Gleichungen aus Standardlehrbuch; Temperatur-/pH-Faktoren bewusst qualitativ.',
  references: [
    { name: '[S] = K_m', params: { S0: 1 }, expectation: 'v = V_max/2.' },
    { name: 'Kompetitiv', params: { inh: 'kompetitiv', I: 1 }, expectation: 'Scheinbares K_m verdoppelt, V_max unverändert.' },
  ],
  run(p): SimResult {
    const fT = tempFactor(num(p, 'T'), 37);
    const fpH = phFactor(num(p, 'pH'), num(p, 'pHopt'));
    const Vmax = num(p, 'kcat') * num(p, 'E') * 1e-3 * 60 * fT * fpH; // mmol/(l·min)
    const Vmax0 = num(p, 'kcat') * num(p, 'E') * 1e-3 * 60;
    const Km = num(p, 'Km');
    const I = num(p, 'I');
    const Ki = num(p, 'Ki');
    const type = str(p, 'inh') as Inhibition;
    const a0 = 1 + I / Ki;
    const KmApp0 = type === 'kompetitiv' ? Km * a0 : type === 'unkompetitiv' ? Km / a0 : Km;
    const sMax = Math.max(10 * Km, 10 * KmApp0, 2 * num(p, 'S0'), 5);
    const xs = range(0, sMax, 200);
    const v = xs.map((s) => mmRate(s, Vmax, Km, I, Ki, type));
    const v0 = xs.map((s) => mmRate(s, Vmax0, Km, 0, Ki, 'keine'));
    // Zeitverlauf
    let S = num(p, 'S0');
    let P = 0;
    const tEnd = Math.max(5, (3 * (num(p, 'S0') + Km)) / Math.max(Vmax, 1e-6));
    const tE = Math.min(tEnd, 600);
    const dt = tE / 2000;
    const tt: number[] = [];
    const SS: number[] = [];
    const PP: number[] = [];
    const lim = new StepLimit(10000);
    for (let i = 0; i <= 2000; i++) {
      lim.tick();
      tt.push(i * dt);
      SS.push(S);
      PP.push(P);
      // RK2
      const k1 = mmRate(S, Vmax, Km, I, Ki, type);
      const k2 = mmRate(Math.max(0, S - (dt * k1) / 2), Vmax, Km, I, Ki, type);
      const d = Math.min(S, dt * k2);
      S -= d;
      P += d;
    }
    const a = 1 + I / Ki;
    const KmApp = type === 'kompetitiv' ? Km * a : type === 'unkompetitiv' ? Km / a : Km;
    const VmaxApp = type === 'nichtkompetitiv' || type === 'unkompetitiv' ? Vmax / a : Vmax;
    return {
      ok: true,
      warnings: [
        ...(num(p, 'T') > 45 ? ['Über etwa 40–45 °C denaturieren viele menschliche Enzyme; der Modellfaktor ist nur qualitativ.'] : []),
        ...(I > 0 && type === 'keine' ? ['Es ist eine Hemmstoffkonzentration eingestellt, aber kein Hemmtyp gewählt.'] : []),
      ],
      scalars: {
        v0: { label: 'Anfangsgeschwindigkeit bei [S]₀', value: mmRate(num(p, 'S0'), Vmax, Km, I, Ki, type), unit: 'mmol/(l·min)', digits: 3 },
        Vmax: { label: 'V_max (scheinbar)', value: VmaxApp, unit: 'mmol/(l·min)', digits: 3 },
        Km: { label: 'K_m (scheinbar)', value: KmApp, unit: 'mmol/l', digits: 3 },
        frac: { label: 'v/V_max bei [S]₀', value: mmRate(num(p, 'S0'), Vmax, Km, I, Ki, type) / VmaxApp, unit: '', digits: 2 },
        fT: { label: 'Temperaturfaktor (qualitativ)', value: fT, unit: '×', digits: 2 },
        fpH: { label: 'pH-Faktor (qualitativ)', value: fpH, unit: '×', digits: 2 },
      },
      charts: [
        {
          id: 'mm', title: 'Reaktionsgeschwindigkeit gegen Substratkonzentration', x: xs, xLabel: '[S]', xUnit: 'mmol/l', yLabel: 'v', yUnit: 'mmol/(l·min)', yMin: 0,
          series: [{ key: 'v', label: 'aktuelles Szenario', y: v }, { key: 'v0', label: 'ohne Hemmstoff, 37 °C, pH-Optimum', y: v0, dash: '5 4' }],
          hlines: [{ y: VmaxApp, label: 'V_max' }, { y: VmaxApp / 2, label: 'V_max/2' }],
          vmarker: { x: KmApp, label: 'K_m' },
          description: 'Hyperbolische Sättigungskurve: Bei kleinem [S] nahezu linear, bei großem [S] Annäherung an V_max.',
        },
        {
          id: 'time', title: 'Zeitverlauf der Umsetzung', x: tt, xLabel: 'Zeit', xUnit: 'min', yLabel: 'Konzentration', yUnit: 'mmol/l', yMin: 0,
          series: [{ key: 'S', label: '[S]', y: SS }, { key: 'P', label: '[P]', y: PP, dash: '6 3' }],
          description: 'Das Substrat wird verbraucht; die Geschwindigkeit nimmt mit sinkendem [S] ab.',
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Stofftransport über die Membran
// ---------------------------------------------------------------------------

export const transportModel: ModelDef = {
  id: 'stofftransport',
  version: '1.0.0',
  title: 'Stofftransport über die Zellmembran',
  module: 'cell',
  purpose: 'Treibende Kräfte und Kinetik von Diffusion, erleichterter Diffusion, primär und sekundär aktivem Transport vergleichen.',
  process: 'Transport eines Stoffes zwischen großem Außenraum (konstante Konzentration) und Zellinnerem.',
  equations: [
    'Einfache Diffusion (Fick): J = P·A·([X]_a − [X]_i)',
    'Erleichterte Diffusion (Carrier): J = J_max·( [X]_a/(K_t+[X]_a) − [X]_i/(K_t+[X]_i) )',
    'Primär aktiv (Pumpe): J = J_max·f(ATP)·[X]_a/(K+[X]_a) − Leck',
    'Sekundär aktiv (2Na⁺:1 Glukose): Gleichgewicht [G]_i/[G]_a = ([Na]_a/[Na]_i)²·e^(−2·V_m·F/(R·T))',
    'dc_i/dt = J / V_Zelle',
  ],
  params: [
    { key: 'mode', label: 'Transportmechanismus', unit: '', type: 'select', default: 'diffusion', options: [
      { value: 'diffusion', label: 'Einfache Diffusion (lipophiler Stoff, z. B. O₂/CO₂)' },
      { value: 'facilitated', label: 'Erleichterte Diffusion (GLUT, Carrier)' },
      { value: 'channel', label: 'Kanal (passiv, nicht sättigbar im Modell)' },
      { value: 'primary', label: 'Primär aktiver Transport (ATP-getriebene Pumpe)' },
      { value: 'secondary', label: 'Sekundär aktiver Transport (Na⁺-Glukose-Symport, SGLT)' },
    ], description: 'Der Mechanismus bestimmt, ob Sättigung, Energieverbrauch und Transport gegen einen Gradienten möglich sind.' },
    { key: 'cOut', label: 'Konzentration außen', unit: 'mmol/l', min: 0, max: 50, step: 0.1, default: 5, description: 'Wird konstant gehalten (großer Außenraum).' },
    { key: 'cIn0', label: 'Konzentration innen (Start)', unit: 'mmol/l', min: 0, max: 50, step: 0.1, default: 0.5, description: 'Ausgangskonzentration im Zellinneren.' },
    { key: 'perm', label: 'Permeabilität / Transporterdichte', unit: 'relativ', min: 0, max: 5, step: 0.05, default: 1, description: 'Bei Diffusion: Permeabilität; sonst Anzahl der Transportproteine.' },
    { key: 'Kt', label: 'Affinität des Carriers K_t', unit: 'mmol/l', min: 0.1, max: 30, step: 0.1, default: 2, description: 'Für Carrier und Pumpe.' },
    { key: 'atp', label: 'ATP verfügbar', unit: '', type: 'bool', default: true, description: 'Nur für primär aktiven Transport direkt relevant. Beim sekundär aktiven Transport wird ATP indirekt zur Aufrechterhaltung des Na⁺-Gradienten benötigt.' },
    { key: 'naRatio', label: 'Na⁺-Gradient [Na]_a/[Na]_i', unit: '', min: 1, max: 20, step: 0.1, default: 12, description: 'Für den sekundär aktiven Transport.' },
    { key: 'Vm', label: 'Membranpotenzial', unit: 'mV', min: -100, max: 0, step: 1, default: -60, description: 'Für den elektrogenen Na⁺-Glukose-Symport.' },
  ],
  initialConditions: 'Innenkonzentration wie eingestellt; Außenkonzentration konstant.',
  included: ['Passive Transportformen mit/ohne Sättigung', 'Aktive Transporte mit Energiequelle', 'Gleichgewichtsverhältnis bei sekundär aktivem Transport'],
  omitted: ['Volumenänderungen der Zelle', 'Regulation der Transporter', 'Ladungsverschiebung (V_m bleibt konstant)', 'Stöchiometrie realer Pumpen außer SGLT'],
  assumptions: ['Gut durchmischte Kompartimente', 'Konstanter Außenraum', 'Ungeladener Stoff bei Diffusion/Carrier'],
  limits: ['Zeitskala relativ (Sekunden im Modell).'],
  qualitativeOnly: ['Absolute Transportraten'],
  modelType: 'vereinfacht',
  sources: [{ id: 'alberts', locator: 'Kap. „Membrane Transport of Small Molecules and the Electrical Properties of Membranes“' }, { id: 'boron', locator: 'Kap. „Transport of Solutes and Water“' }],
  status: 'zu_pruefen',
  reviewNote: 'Didaktische Kinetik; fachliche Prüfung ausstehend.',
  references: [
    { name: 'Diffusion', params: {}, expectation: 'Innenkonzentration nähert sich der Außenkonzentration an, nie darüber.' },
    { name: 'SGLT', params: { mode: 'secondary' }, expectation: 'Anreicherung im Zellinneren über die Außenkonzentration hinaus.' },
    { name: 'Pumpe ohne ATP', params: { mode: 'primary', atp: false }, expectation: 'Kein Transport gegen den Gradienten.' },
  ],
  run(p): SimResult {
    const mode = str(p, 'mode');
    const co = num(p, 'cOut');
    let ci = num(p, 'cIn0');
    const P = num(p, 'perm');
    const Kt = num(p, 'Kt');
    const atp = p.atp as boolean;
    const T = 37;
    const ratioNa = num(p, 'naRatio');
    const Vm = num(p, 'Vm');
    const eqSGLT = ratioNa ** 2 * Math.exp((-2 * Vm) / rtf(T));
    const dt = 0.05;
    const n = 1200;
    const tt: number[] = [];
    const cc: number[] = [];
    const JJ: number[] = [];
    const flux = (c: number) => {
      switch (mode) {
        case 'diffusion':
          return 0.08 * P * (co - c);
        case 'channel':
          return 0.25 * P * (co - c);
        case 'facilitated':
          return 0.6 * P * (co / (Kt + co) - c / (Kt + c));
        case 'primary': {
          const pump = atp ? (0.6 * P * co) / (Kt + co) : 0;
          return pump - 0.01 * (c - co); // kleiner Rückfluss (Leck)
        }
        case 'secondary': {
          // treibende Kraft ∝ ln(Gleichgewichtsverhältnis / aktuelles Verhältnis)
          if (co <= 0) return -0.01 * c;
          const drive = Math.log(eqSGLT) - Math.log(Math.max(c, 1e-6) / co);
          const sat = co / (Kt + co);
          return 0.3 * P * sat * Math.tanh(drive / 3);
        }
      }
      return 0;
    };
    for (let i = 0; i <= n; i++) {
      tt.push(i * dt);
      cc.push(ci);
      const J = flux(ci);
      JJ.push(J);
      ci = Math.max(0, ci + dt * J);
    }
    const final = cc[cc.length - 1];
    const against = final > co * 1.01;
    const energy = mode === 'primary' ? 'ATP-Hydrolyse (direkt)' : mode === 'secondary' ? 'Na⁺-Gradient (indirekt ATP über Na⁺/K⁺-ATPase)' : 'keine (passiv)';
    const sat = range(0, 50, 100);
    const satCurve = sat.map((c) => {
      switch (mode) {
        case 'facilitated':
        case 'primary':
        case 'secondary':
          return (0.6 * P * c) / (Kt + c);
        case 'channel':
          return 0.25 * P * c;
        default:
          return 0.08 * P * c;
      }
    });
    return {
      ok: true,
      warnings: mode === 'primary' && !atp ? ['Ohne ATP arbeitet die Pumpe nicht; es bleibt nur ein kleiner passiver Leckstrom.'] : [],
      scalars: {
        final: { label: 'Innenkonzentration am Ende', value: final, unit: 'mmol/l', digits: 2 },
        ratio: { label: 'Verhältnis innen/außen', value: co > 0 ? final / co : '—', unit: '', digits: 2 },
        against: { label: 'Transport gegen den Konzentrationsgradienten?', value: against ? 'ja' : 'nein', unit: '' },
        energy: { label: 'Energiequelle', value: energy, unit: '' },
        ...(mode === 'secondary' ? { eq: { label: 'Theoretisches Gleichgewicht [G]_i/[G]_a', value: eqSGLT, unit: '', digits: 0 } } : {}),
      },
      charts: [
        {
          id: 'c', title: 'Konzentration im Zellinneren', x: tt, xLabel: 'Zeit', xUnit: 's (Modell)', yLabel: 'Konzentration', yUnit: 'mmol/l', yMin: 0,
          series: [{ key: 'ci', label: '[X] innen', y: cc }],
          hlines: [{ y: co, label: '[X] außen' }],
          description: against ? 'Die Innenkonzentration steigt über die Außenkonzentration: Transport gegen den Gradienten unter Energieeinsatz.' : 'Die Innenkonzentration nähert sich der Außenkonzentration an.',
        },
        {
          id: 'sat', title: 'Einwärtsfluss bei [X]_innen = 0 gegen Außenkonzentration', x: sat, xLabel: '[X] außen', xUnit: 'mmol/l', yLabel: 'Fluss', yUnit: 'mmol/(l·s), relativ', yMin: 0,
          series: [{ key: 'J', label: 'Fluss', y: satCurve }],
          description: 'Diffusion und Kanal: linear (keine Sättigung im Modell). Carrier und Pumpen: Sättigung, weil die Zahl der Transportproteine begrenzt ist.',
        },
      ],
    };
  },
};

// ---------------------------------------------------------------------------
// Osmose (Boyle-van't-Hoff)
// ---------------------------------------------------------------------------

export const osmosisModel: ModelDef = {
  id: 'osmose',
  version: '1.0.0',
  title: 'Osmose: Volumenänderung einer Zelle',
  module: 'cell',
  purpose: 'Verstehen, wie die Osmolarität der Umgebung das Zellvolumen über Wasserbewegung verändert.',
  process: 'Wasserfluss durch Aquaporine entlang eines osmotischen Gradienten.',
  equations: [
    'dV/dt = L_p·A·R·T·(Osm_innen − Osm_außen)   (Wasser fließt zur höheren Osmolarität)',
    'Osm_innen = n_osm / (V − V_b)',
    'Gleichgewicht (Boyle-van’t Hoff): V − V_b = (V₀ − V_b)·Osm₀/Osm_außen',
  ],
  params: [
    { key: 'osmOut', label: 'Nicht membrangängige Teilchen außen', unit: 'mosmol/l', min: 50, max: 900, step: 5, default: 290, description: 'z. B. NaCl, Glukose (im Modell nicht permeabel). Isoton ≈ 290 mosmol/l (Modellwert).' },
    { key: 'Vb', label: 'Osmotisch inaktiver Volumenanteil', unit: '', min: 0, max: 0.6, step: 0.01, default: 0.4, description: 'Anteil des Volumens, der nicht an der Osmose teilnimmt (Proteine, Membranen).' },
    { key: 'Lp', label: 'Wasserpermeabilität (Aquaporine)', unit: 'relativ', min: 0.05, max: 5, step: 0.05, default: 1, description: 'Beeinflusst die Geschwindigkeit, nicht den Endzustand.' },
    { key: 'osmPerm', label: 'Zusätzlich: membrangängige Teilchen außen', unit: 'mosmol/l', min: 0, max: 900, step: 5, default: 0, description: 'z. B. Harnstoff. Erhöht die Osmolarität, verteilt sich aber auf beide Seiten und bestimmt das Gleichgewichtsvolumen nicht (Tonizität ≠ Osmolarität).' },
  ],
  initialConditions: 'V₀ = 1 (relativ), Osm₀ = 290 mosmol/l.',
  included: ['Osmotischer Wasserfluss', 'Osmotisch inaktives Volumen', 'Unterschied Osmolarität/Tonizität'],
  omitted: ['Regulatorische Volumenanpassung', 'Membranspannung und Zellform', 'Kinetik des permeablen Stoffes (sofortiger Ausgleich angenommen; vorübergehende Volumenänderungen fehlen)'],
  assumptions: ['Ideale verdünnte Lösungen', 'Zelle als idealer Osmometer'],
  limits: ['Lyse-Grenze nur als grobe Orientierung (Volumen > 1,6×).'],
  qualitativeOnly: ['Lyse-Grenze', 'Zeitskala'],
  modelType: 'vereinfacht',
  sources: [{ id: 'boron', locator: 'Kap. „Transport of Solutes and Water“' }, { id: 'atkins', locator: 'Kap. „Colligative properties“' }],
  status: 'zu_pruefen',
  reviewNote: 'Fachliche Prüfung ausstehend.',
  references: [
    { name: 'Hypoton (150)', params: { osmOut: 150 }, expectation: 'Zellschwellung.' },
    { name: 'Hyperton (600)', params: { osmOut: 600 }, expectation: 'Zellschrumpfung.' },
  ],
  run(p): SimResult {
    const Vb = num(p, 'Vb');
    const osm0 = 290;
    const osmEff = num(p, 'osmOut');
    const osmTotal = osmEff + num(p, 'osmPerm');
    const nOsm = osm0 * (1 - Vb);
    let V = 1;
    const tt: number[] = [];
    const VV: number[] = [];
    const dt = 0.02;
    for (let i = 0; i <= 1500; i++) {
      tt.push(i * dt);
      VV.push(V);
      const osmIn = nOsm / (V - Vb);
      V += dt * num(p, 'Lp') * 0.004 * (osmIn - osmEff);
      V = Math.max(Vb + 0.01, V);
    }
    const Veq = Vb + ((1 - Vb) * osm0) / osmEff;
    const xs = range(100, 900, 120);
    return {
      ok: true,
      warnings: Veq > 1.6 ? ['Das Gleichgewichtsvolumen liegt in einem Bereich, in dem Zellen (z. B. Erythrozyten) lysieren können (qualitativ).'] : [],
      scalars: {
        Veq: { label: 'Gleichgewichtsvolumen (relativ)', value: Veq, unit: '×', digits: 2 },
        osm: { label: 'Gesamtosmolarität außen', value: osmTotal, unit: 'mosmol/l', digits: 0 },
        osmEff: { label: 'Effektive (tonisch wirksame) Osmolarität', value: osmEff, unit: 'mosmol/l', digits: 0 },
        tonic: { label: 'Wirkung', value: Veq > 1.02 ? 'hypoton → Schwellung' : Veq < 0.98 ? 'hyperton → Schrumpfung' : 'isoton', unit: '' },
      },
      charts: [
        { id: 'v', title: 'Zellvolumen über die Zeit', x: tt, xLabel: 'Zeit', xUnit: 's (Modell)', yLabel: 'Volumen', yUnit: 'relativ zu V₀', series: [{ key: 'V', label: 'Volumen', y: VV }], hlines: [{ y: 1, label: 'V₀' }], description: 'Annäherung an das Gleichgewichtsvolumen.' },
        { id: 'bvh', title: 'Gleichgewichtsvolumen gegen äußere Osmolarität', x: xs, xLabel: 'Osmolarität außen', xUnit: 'mosmol/l', yLabel: 'Volumen', yUnit: 'relativ', series: [{ key: 'eq', label: 'V_eq', y: xs.map((o) => Vb + ((1 - Vb) * osm0) / o) }], vmarker: { x: num(p, 'osmOut'), label: 'aktuell' }, description: 'Boyle-van’t-Hoff-Beziehung: Volumen ∝ 1/Osmolarität (plus inaktives Volumen).' },
      ],
    };
  },
};

void logRange;
