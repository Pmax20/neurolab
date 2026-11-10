import { lessonFactory, type TopicExtra } from './kit';

// Chemie-Testat 1 (Skript „Chemie für Mediziner“, Kapitel 1–6): Atombau, Bindung, Thermodynamik, Kinetik, Luft, Wasser.
// Neue Lektion „Luft, Gase und Wasser“ (Skript Kap. 5 und 6) und die Testat-Zusammenstellung für Üben/Prüfen.
// Kapitelgliederung aus Kims Skript (Inhaltsverzeichnis); Inhalte selbst formuliert nach Lehrbuchstandard.

const L = lessonFactory('molecule', 'zeeck');

export const LW_OBJ = {
  luft: 'die Zusammensetzung der Luft nennen und Partialdrücke von Atemgasen mit dem Gesetz von Dalton berechnen',
  gas: 'mit der allgemeinen Gasgleichung und dem molaren Volumen Stoffmengen, Massen und Volumina von Gasen berechnen',
  anomalie: 'die Anomalie des Wassers (Dichtemaximum bei 4 °C, hohe Siedetemperatur, hohe Wärmekapazität) mit Wasserstoffbrücken erklären',
  phasen: 'das Zustandsdiagramm des Wassers zeichnen und Tripelpunkt, kritischen Punkt und die negative Steigung der Schmelzkurve erklären',
  elektrolyse: 'die elektrolytische Zerlegung von Wasser mit Kathoden- und Anodenreaktion und dem Volumenverhältnis 2 : 1 beschreiben',
};

export const LUFT_WASSER_LESSONS = [
  L({
    id: 'luft-wasser', title: 'Luft, Gase und Wasser', subtitle: 'Zusammensetzung der Luft, Partialdruck, ideales Gasgesetz, Anomalie des Wassers, Zustandsdiagramm, Elektrolyse',
    prerequisites: ['stoechiometrie', 'bindungen'], objectives: Object.values(LW_OBJ), locator: 'Allgemeine Chemie: Gase; Wasser und seine Eigenschaften',
    overview: 'Luft ist ein Gasgemisch aus etwa 78 % Stickstoff, 21 % Sauerstoff und 0,9 % Argon; jedes Gas trägt mit seinem Partialdruck zum Gesamtdruck bei. Für ideale Gase gilt p · V = n · R · T, und 1 mol Gas nimmt bei 0 °C und 1013 hPa etwa 22,4 L ein. Wasser ist ein gewinkelter Dipol, der Wasserstoffbrücken bildet – daraus folgen seine ungewöhnlichen Eigenschaften: Dichtemaximum bei 4 °C, hoher Siedepunkt, hohe Wärmekapazität und eine nach links geneigte Schmelzkurve.',
    mechanism: [
      ['Zusammensetzung der Luft', 'Trockene Luft (Volumenanteile): N₂ ca. 78 %, O₂ ca. 21 %, Ar ca. 0,9 %, CO₂ ca. 0,04 %. Dazu kommt Wasserdampf in wechselnder Menge. Die Anteile bleiben bis in große Höhen gleich – nur der Gesamtdruck sinkt.'],
      ['Partialdruck (Dalton)', 'Gesamtdruck = Summe der Partialdrücke. Partialdruck = Volumenanteil · Gesamtdruck. Auf Meereshöhe (≈ 1013 hPa) ist p(O₂) ≈ 0,21 · 1013 hPa ≈ 213 hPa (≈ 21 kPa, ≈ 160 mmHg). In 5500 m Höhe ist der Luftdruck etwa halbiert und damit auch p(O₂).'],
      ['Löslichkeit von Gasen (Henry)', 'Wie viel Gas sich in einer Flüssigkeit löst, ist proportional zu seinem Partialdruck. Beim Tauchen löst sich unter hohem Druck mehr N₂ im Blut; taucht man zu schnell auf, perlt es aus (Dekompressionskrankheit). Warmes Wasser löst weniger Gas als kaltes.'],
      ['Ideales Gasgesetz', 'p · V = n · R · T mit R = 8,314 J/(mol · K), T in Kelvin. Ideal heißt: Teilchen ohne Eigenvolumen und ohne Wechselwirkungen. Daraus folgt: 1 mol jedes idealen Gases hat bei 0 °C und 1013 hPa ein Volumen von ca. 22,4 L (bei 25 °C ca. 24,5 L).'],
      ['Sonderfälle der Gasgesetze', 'Boyle-Mariotte (T konstant): p · V = konstant – doppelter Druck, halbes Volumen (Einatmen: Thorax weitet sich, Druck in der Lunge sinkt, Luft strömt ein). Gay-Lussac (p konstant): V/T = konstant. Amontons (V konstant): p/T = konstant.'],
      ['Wasser als Molekül', 'O ist sp³-hybridisiert mit 2 bindenden und 2 freien Elektronenpaaren; das Molekül ist gewinkelt (ca. 104,5°) und ein starker Dipol. Jedes H₂O kann bis zu 4 Wasserstoffbrücken bilden (2 über seine H-Atome, 2 über seine freien Elektronenpaare).'],
      ['Anomalie des Wassers', 'Im Eis bilden die Wasserstoffbrücken ein offenes, hexagonales Gitter mit Hohlräumen. Beim Schmelzen bricht es teilweise zusammen, die Moleküle rücken näher: flüssiges Wasser ist dichter als Eis, am dichtesten bei 4 °C. Folge: Eis schwimmt, Seen frieren von oben zu, am Grund bleibt Wasser mit 4 °C.'],
      ['Hoher Siedepunkt, hohe Wärmekapazität', 'Um Wasser zu verdampfen, müssen Wasserstoffbrücken gelöst werden. Darum siedet H₂O bei 100 °C, das schwerere H₂S schon bei −60 °C. Die hohe spezifische Wärmekapazität (4,18 J/(g · K)) und die hohe Verdampfungswärme puffern die Körpertemperatur; Schwitzen kühlt durch Verdunstung.'],
      ['Zustandsdiagramm', 'p-T-Diagramm mit drei Phasenflächen (fest, flüssig, gasförmig) und drei Grenzkurven (Schmelz-, Siede-, Sublimationskurve). Tripelpunkt: alle drei Phasen im Gleichgewicht (Wasser: 0,01 °C, 6,1 hPa). Kritischer Punkt: Ende der Siedekurve, darüber keine Unterscheidung von Flüssigkeit und Gas (Wasser: 374 °C, 221 bar).'],
      ['Negative Steigung der Schmelzkurve', 'Bei Wasser ist die Schmelzkurve nach links geneigt: Höherer Druck begünstigt die dichtere Phase – und das ist bei Wasser die Flüssigkeit. Der Schmelzpunkt sinkt also mit steigendem Druck. Bei fast allen anderen Stoffen ist der Feststoff dichter und die Kurve nach rechts geneigt.'],
      ['Siedepunkt und Druck', 'Ein Stoff siedet, wenn sein Dampfdruck den Umgebungsdruck erreicht. Auf hohen Bergen siedet Wasser unter 100 °C; im Autoklav (ca. 2 bar) bei 121 °C – so wird in der Klinik sterilisiert.'],
      ['Elektrolyse von Wasser', 'Mit Gleichstrom (und etwas Elektrolyt) wird Wasser zerlegt: 2 H₂O → 2 H₂ + O₂. Kathode (Minuspol, Reduktion): 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Anode (Pluspol, Oxidation): 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Volumenverhältnis H₂ : O₂ = 2 : 1. Die Elektrolyse ist erzwungen (endergon); die Rückreaktion (Knallgas) ist stark exotherm.'],
    ],
    depth: [
      'Rechnen ohne Taschenrechner: n = m/M und V = n · 22,4 L (Normbedingungen). 44 g CO₂ = 1 mol ≈ 22,4 L; 8 g O₂ = 0,25 mol ≈ 5,6 L; 11,2 L H₂ = 0,5 mol = 1 g.',
      'In der Lunge ist die Luft mit Wasserdampf gesättigt (p(H₂O) ≈ 63 hPa bei 37 °C). Der inspiratorische O₂-Partialdruck ist deshalb etwas kleiner: 0,21 · (1013 − 63) hPa ≈ 200 hPa.',
      'Reale Gase weichen vom idealen Verhalten ab, vor allem bei hohem Druck und tiefer Temperatur (Eigenvolumen, Anziehung zwischen Teilchen). Unter normalen Bedingungen ist die Abweichung für Luft klein.',
      'Wasser ist ein Ampholyt und Lösungsmittel für Ionen (Hydrathülle, Ion-Dipol-Wechselwirkung) und polare Moleküle; unpolare Stoffe lagern sich durch den hydrophoben Effekt zusammen.',
    ],
    equations: ['p_ges = p₁ + p₂ + p₃ + …', 'p_i = x_i · p_ges', 'p · V = n · R · T', 'V_m ≈ 22,4 L/mol (0 °C, 1013 hPa)', '2 H₂O → 2 H₂ + O₂'],
    pitfalls: [
      'In der Höhe sinkt nicht der O₂-Anteil (bleibt 21 %), sondern der Gesamtdruck und damit der O₂-Partialdruck.',
      'Temperatur im Gasgesetz immer in Kelvin (T = θ + 273), sonst stimmt nichts.',
      '22,4 L/mol gilt nur bei 0 °C und 1013 hPa – und für jedes ideale Gas, egal welches.',
      'Am Minuspol (Kathode) entsteht Wasserstoff, am Pluspol (Anode) Sauerstoff – nicht umgekehrt. Merkhilfe: Kathode–Reduktion (Konsonanten), Anode–Oxidation (Vokale).',
      'Die negative Steigung der Schmelzkurve ist die Ausnahme (Wasser), nicht die Regel.',
    ],
    terms: [
      { term: 'Partialdruck', def: 'Druck, den ein Gas eines Gemischs allein im gesamten Volumen ausüben würde; Anteil · Gesamtdruck.' },
      { term: 'Gesetz von Dalton', def: 'Der Gesamtdruck eines Gasgemischs ist die Summe der Partialdrücke.' },
      { term: 'Gesetz von Henry', def: 'Die gelöste Gasmenge ist proportional zum Partialdruck des Gases über der Flüssigkeit.' },
      { term: 'Molares Volumen', def: 'Volumen von 1 mol eines idealen Gases; ca. 22,4 L bei 0 °C und 1013 hPa.' },
      { term: 'Ideales Gas', def: 'Modellgas ohne Eigenvolumen der Teilchen und ohne Wechselwirkungen; gehorcht p · V = n · R · T.' },
      { term: 'Dichteanomalie', def: 'Wasser hat bei 4 °C seine größte Dichte; Eis ist weniger dicht als flüssiges Wasser.' },
      { term: 'Tripelpunkt', def: 'Druck und Temperatur, bei denen feste, flüssige und gasförmige Phase im Gleichgewicht stehen (Wasser: 0,01 °C, 6,1 hPa).' },
      { term: 'Kritischer Punkt', def: 'Endpunkt der Siedekurve; darüber sind Flüssigkeit und Gas nicht mehr unterscheidbar (überkritisches Fluid).' },
      { term: 'Sublimation', def: 'Direkter Übergang fest → gasförmig (Umkehrung: Resublimation).' },
      { term: 'Elektrolyse', def: 'Durch elektrischen Strom erzwungene Redoxreaktion; Reduktion an der Kathode, Oxidation an der Anode.' },
    ],
    links: ['stoechiometrie', 'bindungen', 'energetik-kinetik', 'gase-grenzflaechen', 'redox'],
  }),
];

/** Übungsdaten für die Ansicht „Ausprobieren“. */
export const LUFT_WASSER_TOPICS: Record<string, TopicExtra> = {
  'luft-wasser': {
    hint: 'Erst im Kopf beantworten, dann tippen – so wie an der Tafel.',
    quiz: [
      { q: 'Welches Gas hat in trockener Luft den größten Volumenanteil?', answer: 'Stickstoff (ca. 78 %)', options: ['Stickstoff (ca. 78 %)', 'Sauerstoff (ca. 78 %)', 'Sauerstoff (ca. 21 %)', 'Argon (ca. 21 %)'], why: 'N₂ ca. 78 %, O₂ ca. 21 %, Ar ca. 0,9 %, CO₂ ca. 0,04 %.' },
      { q: 'O₂-Partialdruck bei einem Luftdruck von 1000 hPa (trockene Luft)?', answer: 'ca. 210 hPa', options: ['ca. 210 hPa', 'ca. 780 hPa', 'ca. 21 hPa', 'ca. 1000 hPa'], why: 'p(O₂) = 0,21 · 1000 hPa = 210 hPa (Dalton).' },
      { q: 'Was ändert sich in 5000 m Höhe?', answer: 'Gesamtdruck und O₂-Partialdruck sinken, der O₂-Anteil bleibt 21 %', options: ['Gesamtdruck und O₂-Partialdruck sinken, der O₂-Anteil bleibt 21 %', 'Der O₂-Anteil sinkt auf etwa 10 %', 'Der O₂-Partialdruck bleibt gleich, nur N₂ nimmt ab', 'Der Gesamtdruck steigt'], why: 'Die Zusammensetzung bleibt gleich; weniger Gesamtdruck bedeutet weniger Partialdruck.' },
      { q: 'Welches Volumen haben 2 mol eines idealen Gases bei 0 °C und 1013 hPa?', answer: '44,8 L', options: ['44,8 L', '22,4 L', '11,2 L', '49 L'], why: 'V = n · 22,4 L/mol = 2 · 22,4 L.' },
      { q: 'Wie viel Gramm sind 5,6 L O₂ bei Normbedingungen?', answer: '8 g', options: ['8 g', '16 g', '4 g', '32 g'], why: 'n = 5,6 / 22,4 = 0,25 mol; m = 0,25 · 32 g/mol = 8 g.' },
      { q: 'Bei konstanter Temperatur wird der Druck auf ein Gas verdoppelt. Was passiert mit dem Volumen?', answer: 'Es halbiert sich', options: ['Es halbiert sich', 'Es verdoppelt sich', 'Es bleibt gleich', 'Es vervierfacht sich'], why: 'Boyle-Mariotte: p · V = konstant.' },
      { q: 'In welcher Einheit muss T im Gasgesetz stehen?', answer: 'Kelvin', options: ['Kelvin', 'Grad Celsius', 'Grad Fahrenheit', 'egal'], why: 'Das Gasgesetz setzt die absolute Temperatur voraus: T/K = θ/°C + 273.' },
      { q: 'Bei welcher Temperatur hat Wasser die größte Dichte?', answer: '4 °C', options: ['4 °C', '0 °C', '−4 °C', '100 °C'], why: 'Dichtemaximum bei ca. 4 °C – Grund für die Schichtung in Seen im Winter.' },
      { q: 'Warum schwimmt Eis auf Wasser?', answer: 'Wasserstoffbrücken bilden im Eis ein offenes Gitter mit Hohlräumen', options: ['Wasserstoffbrücken bilden im Eis ein offenes Gitter mit Hohlräumen', 'Eis enthält eingeschlossene Luftblasen', 'Im Eis sind die kovalenten Bindungen länger', 'Eis ist unpolar'], why: 'Das hexagonale H-Brücken-Gitter hat mehr Platz pro Molekül als die Flüssigkeit.' },
      { q: 'Warum siedet H₂O (M = 18) bei 100 °C, H₂S (M = 34) aber schon bei −60 °C?', answer: 'Zwischen H₂O-Molekülen wirken Wasserstoffbrücken', options: ['Zwischen H₂O-Molekülen wirken Wasserstoffbrücken', 'H₂S ist schwerer', 'H₂O hat Ionenbindungen', 'H₂S ist ein Dipol, H₂O nicht'], why: 'S ist zu wenig elektronegativ für starke H-Brücken; bei H₂O müssen sie beim Sieden gelöst werden.' },
      { q: 'Was liegt am Tripelpunkt vor?', answer: 'Fest, flüssig und gasförmig im Gleichgewicht', options: ['Fest, flüssig und gasförmig im Gleichgewicht', 'Nur Gas', 'Flüssigkeit und Gas sind nicht mehr unterscheidbar', 'Wasser hat seine größte Dichte'], why: 'Tripelpunkt von Wasser: 0,01 °C und 6,1 hPa. Die Ununterscheidbarkeit beschreibt den kritischen Punkt.' },
      { q: 'Was passiert mit dem Schmelzpunkt von Eis, wenn man den Druck erhöht?', answer: 'Er sinkt (Schmelzkurve nach links geneigt)', options: ['Er sinkt (Schmelzkurve nach links geneigt)', 'Er steigt', 'Er bleibt gleich', 'Eis sublimiert sofort'], why: 'Druck begünstigt die dichtere Phase; bei Wasser ist das die Flüssigkeit.' },
      { q: 'Warum sterilisiert man im Autoklav bei ca. 2 bar?', answer: 'Der höhere Druck hebt den Siedepunkt auf ca. 121 °C', options: ['Der höhere Druck hebt den Siedepunkt auf ca. 121 °C', 'Der Druck zerdrückt die Bakterien', 'Der Druck senkt den Siedepunkt', 'Bei 2 bar sublimiert Wasser'], why: 'Siedepunkt = Temperatur, bei der der Dampfdruck den Umgebungsdruck erreicht.' },
      { q: 'Was entsteht bei der Elektrolyse von Wasser an der Kathode (Minuspol)?', answer: 'Wasserstoff (Reduktion)', options: ['Wasserstoff (Reduktion)', 'Sauerstoff (Oxidation)', 'Sauerstoff (Reduktion)', 'Wasserstoff (Oxidation)'], why: 'An der Kathode werden Elektronen aufgenommen: 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻.' },
      { q: 'Volumenverhältnis H₂ : O₂ bei der Elektrolyse von Wasser?', answer: '2 : 1', options: ['2 : 1', '1 : 2', '1 : 1', '4 : 1'], why: '2 H₂O → 2 H₂ + O₂; gleiche Stoffmenge = gleiches Volumen.' },
      { q: 'Warum kühlt Schwitzen?', answer: 'Verdunsten braucht viel Energie, um Wasserstoffbrücken zu lösen', options: ['Verdunsten braucht viel Energie, um Wasserstoffbrücken zu lösen', 'Schweiß ist kälter als die Haut', 'Salz im Schweiß kühlt', 'Wasser hat eine kleine Wärmekapazität'], why: 'Hohe Verdampfungswärme: Die Energie wird der Haut entzogen.' },
    ],
    tables: [
      { title: 'Zusammensetzung trockener Luft', head: ['Gas', 'Volumenanteil', 'Partialdruck auf Meereshöhe'], rows: [['N₂', 'ca. 78 %', 'ca. 790 hPa'], ['O₂', 'ca. 21 %', 'ca. 213 hPa (≈ 160 mmHg)'], ['Ar', 'ca. 0,9 %', 'ca. 9 hPa'], ['CO₂', 'ca. 0,04 %', 'ca. 0,4 hPa']], note: 'Gesamtdruck ≈ 1013 hPa. In der Lunge kommt Wasserdampf hinzu (ca. 63 hPa bei 37 °C).' },
      { title: 'Gasgesetze', head: ['Gesetz', 'Konstant', 'Aussage', 'Beispiel'], rows: [['Allgemeines Gasgesetz', '–', 'p · V = n · R · T', '1 mol ≈ 22,4 L bei 0 °C, 1013 hPa'], ['Boyle-Mariotte', 'T, n', 'p · V = konstant', 'Atmung: Thorax weitet sich → Druck sinkt'], ['Gay-Lussac', 'p, n', 'V / T = konstant', 'Ballon dehnt sich in der Wärme'], ['Amontons', 'V, n', 'p / T = konstant', 'Druck in der Spraydose steigt in der Sonne'], ['Dalton', '–', 'p_ges = Σ p_i', 'p(O₂) = 0,21 · p_ges'], ['Henry', 'T', 'gelöste Menge ∝ Partialdruck', 'Taucherkrankheit']] },
      { title: 'Besondere Daten von Wasser', head: ['Größe', 'Wert', 'Grund / Bedeutung'], rows: [['Bindungswinkel', 'ca. 104,5°', '2 freie Elektronenpaare am O'], ['Dichtemaximum', '4 °C', 'H-Brücken-Gitter im Eis'], ['Siedepunkt (1013 hPa)', '100 °C', 'H-Brücken (H₂S: −60 °C)'], ['Spez. Wärmekapazität', '4,18 J/(g·K)', 'Temperaturpuffer im Körper'], ['Tripelpunkt', '0,01 °C / 6,1 hPa', 'alle drei Phasen'], ['Kritischer Punkt', '374 °C / 221 bar', 'Ende der Siedekurve']] },
    ],
  },
};

/** Testat-Zusammenstellung: Kapitel aus Kims Skript → NeuroLab-Lektionen. */
export interface Testat { id: string; title: string; subtitle: string; chapters: { kap: string; topics: string; lessons: string[] }[] }
export const TESTATE: Testat[] = [
  {
    id: 'chem1', title: 'Chemie-Testat 1', subtitle: 'Skript Kapitel 1–6: Atombau, Bindung, Thermodynamik, Kinetik, Luft, Wasser',
    chapters: [
      { kap: '1 Atombau', topics: 'Fundamentale Begriffe, Atome und Elemente, Stoffmengen und Konzentrationen, Atommodelle, Periodensystem', lessons: ['atommodell', 'stoechiometrie', 'konzentrationen', 'periodensystem'] },
      { kap: '2 Die chemische Bindung', topics: 'Metallische, ionische, kovalente und koordinative Bindung; H-Brücken, Van-der-Waals, Dipol-Wechselwirkungen, hydrophober Effekt', lessons: ['bindungen', 'komplexe'] },
      { kap: '3 Thermodynamik', topics: '1. Hauptsatz und Enthalpie, 2. Hauptsatz und Entropie, Gibbs-Helmholtz', lessons: ['energetik-kinetik'] },
      { kap: '4 Kinetik und Katalyse', topics: 'Reaktionsgeschwindigkeit, Geschwindigkeitsgleichungen, Energieprofile, Temperatur, Katalyse', lessons: ['energetik-kinetik'] },
      { kap: '5 Luft', topics: 'Zusammensetzung der Luft, ideale Gase', lessons: ['luft-wasser'] },
      { kap: '6 Wasser', topics: 'Anomalie, Phasenumwandlungen und Zustandsdiagramm, Elektrolyse', lessons: ['luft-wasser'] },
    ],
  },
];
export const testatLessons = (t: Testat) => [...new Set(t.chapters.flatMap((c) => c.lessons))];
export const testatById = (id: string) => TESTATE.find((t) => t.id === id);
