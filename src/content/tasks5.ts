import type { ChoiceOption, ErrorCategory, Lesson, Task, TaskLevel } from './types';
import { PHYS2_LESSONS, CHEM2_LESSONS, HISTO2_LESSONS } from './semester1b';
import { HISTO_LESSONS } from './bio1';

// Aufgaben zu den Ergänzungen: neue Lektionen, Reaktionsgleichungen ausgleichen, Histologie-Prüfungssimulator.
// Alle Fragen sind selbst formuliert (keine Leipziger Originalfragen).

const S = 'zu_pruefen' as const;
const ALL: Lesson[] = [...PHYS2_LESSONS, ...CHEM2_LESSONS, ...HISTO2_LESSONS, ...HISTO_LESSONS];
function O(lesson: string, i: number): string {
  const l = ALL.find((x) => x.id === lesson);
  if (!l || !l.objectives[i]) throw new Error(`Lernziel ${lesson}[${i}] fehlt`);
  return l.objectives[i];
}
const src = (id: string) => [{ id }];

function sc(id: string, lesson: string, oi: number, level: TaskLevel, category: ErrorCategory, source: string, prompt: string, correct: string, wrong: [string, string, ErrorCategory?][], explanation: string): Task {
  const opts: ChoiceOption[] = [{ id: 'a', text: correct }, ...wrong.map(([text, why, cat], i) => ({ id: String.fromCharCode(98 + i), text, why, category: cat ?? category }))];
  const rot = id.length % opts.length;
  return { id, type: 'single', prompt, level, lessons: [lesson], objective: O(lesson, oi), category, sources: src(source), status: S, options: [...opts.slice(rot), ...opts.slice(0, rot)], correct: 'a', explanation };
}
function mt(id: string, lesson: string, oi: number, source: string, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'verstaendnis', category: ErrorCategory = 'verwechslung'): Task {
  return { id, type: 'match', level, lessons: [lesson], objective: O(lesson, oi), category, sources: src(source), status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
}
function od(id: string, lesson: string, oi: number, source: string, prompt: string, items: string[], explanation: string): Task {
  return { id, type: 'order', level: 'wissen', lessons: [lesson], objective: O(lesson, oi), category: 'reihenfolge', sources: src(source), status: S, prompt, items, explanation };
}
function bal(id: string, reactants: string[], products: string[], coefficients: number[], explanation: string, level: TaskLevel = 'anwendung'): Task {
  return { id, type: 'balance', level, lessons: ['stoechiometrie'], objective: O('stoechiometrie', 0), category: 'rechnen', sources: src('zeeck'), status: S, prompt: 'Gleiche die Reaktionsgleichung aus (kleinste ganze Zahlen).', reactants, products, coefficients, explanation };
}

const FORM = ['platt', 'isoprismatisch (kubisch)', 'hochprismatisch'];
const LAYERS = ['einschichtig', 'mehrreihig', 'mehrschichtig'];
type F = [string, boolean, string?];
function hs(id: string, lesson: string, oi: number, scene: string, tissueOptions: string[], features: F[], fn: [string, string, string], modelAnswer: string, keywords: string[][], extra: { form?: string; formOptions?: string[]; layers?: string } = {}): Task {
  return {
    id, type: 'histo', level: 'anwendung', lessons: [lesson], objective: O(lesson, oi), category: 'gewebe', sources: src('luellmann'), status: S,
    prompt: 'Welches Gewebe zeigt das Präparat? Bestimme es Schritt für Schritt.', scene, tissueOptions,
    ...(extra.form ? { form: { options: extra.formOptions ?? FORM, correct: extra.form } } : {}),
    ...(extra.layers ? { layers: { options: LAYERS, correct: extra.layers } } : {}),
    features: features.map(([text, ok, why]) => ({ text, ok, why })),
    fn: { options: [...fn].sort(), correct: fn[0] }, keywords, modelAnswer, explanation: modelAnswer,
  };
}

export const TASKS_5: Task[] = [
  // ================================================================= Physik: Größen und Bewegung
  sc('p2-vektor', 'groessen-bewegung', 1, 'verstaendnis', 'begriff', 'harten', 'Welche der folgenden Größen ist ein Vektor?',
    'Kraft', [['Masse', 'Die Masse hat nur einen Betrag – sie ist ein Skalar.'], ['Temperatur', 'Temperatur hat keine Richtung.'], ['Energie', 'Energie ist ein Skalar.']],
    'Vektoren haben Betrag und Richtung: Kraft, Geschwindigkeit, Beschleunigung. Skalare nur einen Betrag.'),
  sc('p2-pythagoras', 'groessen-bewegung', 1, 'anwendung', 'rechnen', 'harten', 'Zwei Kräfte von 3 N und 4 N greifen im rechten Winkel am selben Punkt an. Wie groß ist die resultierende Kraft?',
    '5 N', [['7 N', 'So groß wäre sie nur, wenn beide Kräfte in dieselbe Richtung zeigen.'], ['1 N', 'So groß wäre sie, wenn die Kräfte entgegengesetzt wirken.'], ['12 N', 'Kräfte werden nicht multipliziert.']],
    'Im rechten Winkel: |F| = √(3² + 4²) N = √25 N = 5 N.'),
  mt('p2-vorsatz', 'groessen-bewegung', 0, 'bipm', 'Ordne jedem Vorsatz seinen Faktor zu.',
    [['k (Kilo)', '10³'], ['m (Milli)', '10⁻³'], ['µ (Mikro)', '10⁻⁶'], ['n (Nano)', '10⁻⁹'], ['M (Mega)', '10⁶']], 'Achtung bei Flächen und Volumina: 1 mm² = 10⁻⁶ m², 1 µl = 1 mm³.', 'wissen', 'einheit'),
  sc('p2-flaeche', 'groessen-bewegung', 0, 'anwendung', 'einheit', 'bipm', 'Wie viele Quadratmeter sind 1 cm²?',
    '10⁻⁴ m²', [['10⁻² m²', 'Das gilt für Meter und Zentimeter, aber bei Flächen wird der Faktor quadriert: (10⁻²)² = 10⁻⁴.'], ['10⁻⁶ m²', 'Das wäre 1 mm².'], ['10² m²', 'Ein Quadratzentimeter ist viel kleiner als ein Quadratmeter.']],
    '1 cm = 10⁻² m, also 1 cm² = (10⁻² m)² = 10⁻⁴ m².'),
  // ================================================================= Energie und Leistung
  sc('p2-wirkungsgrad', 'energie-leistung', 2, 'verstaendnis', 'mechanismus', 'harten', 'Warum wird einem bei körperlicher Arbeit warm?',
    'Der Muskel wandelt höchstens etwa ein Viertel der chemischen Energie in mechanische Arbeit um; der Rest wird zu Wärme.',
    [['Weil die Hubarbeit direkt in Wärme umgewandelt wird.', 'Die Hubarbeit steckt als Lageenergie im angehobenen Körper.'], ['Weil Energie bei Bewegung neu entsteht.', 'Energie entsteht nicht neu; sie wird nur umgewandelt (Energieerhaltung).']],
    'Wirkungsgrad η = Nutzleistung / zugeführte Leistung. Beim Muskel liegt er unter etwa 25 %.'),
  mt('p2-einheiten-e', 'energie-leistung', 2, 'harten', 'Ordne zu.',
    [['1 kcal', '4,184 kJ'], ['1 kWh', '3,6 MJ'], ['1 W', '1 J/s'], ['1 J', '1 N · m']], 'kW ist eine Leistung, kWh eine Energie.', 'wissen', 'einheit'),
  sc('p2-ekin-v', 'energie-leistung', 1, 'verstaendnis', 'formel', 'harten', 'Ein Fahrradfahrer verdoppelt seine Geschwindigkeit. Wie ändert sich seine kinetische Energie?',
    'Sie vervierfacht sich.', [['Sie verdoppelt sich.', 'v geht quadratisch ein: (2v)² = 4v².'], ['Sie bleibt gleich.', 'Die Bewegungsenergie hängt von der Geschwindigkeit ab.']],
    'E_kin = ½·m·v². Das erklärt, warum Unfälle bei höherer Geschwindigkeit so viel schwerer verlaufen.'),
  // ================================================================= Dichte und Druck
  sc('p2-lage', 'druck-dichte', 2, 'anwendung', 'mechanismus', 'guyton', 'Kim misst ihren Blutdruck im Stehen einmal am Oberarm auf Herzhöhe und einmal am Knöchel. Was erwartest du am Knöchel?',
    'Einen deutlich höheren Wert, weil der hydrostatische Druck der Blutsäule zwischen Herz und Fuß hinzukommt.',
    [['Denselben Wert, weil das Herz überall gleich stark pumpt.', 'Unterhalb des Herzens addiert sich der hydrostatische Druck ρ·g·h.'], ['Einen niedrigeren Wert, weil der Weg vom Herzen länger ist.', 'Der Reibungsverlust in den großen Arterien ist klein gegenüber dem hydrostatischen Druck.', 'richtung']],
    'Am stehenden Menschen liegt der Druck am Fuß um rund 90 mmHg höher als auf Herzhöhe. Deshalb misst man auf Herzhöhe.'),
  sc('p2-gefaessform', 'druck-dichte', 1, 'verstaendnis', 'mechanismus', 'harten', 'Drei unterschiedlich geformte Gefäße sind gleich hoch mit Wasser gefüllt. Wo ist der Druck am Boden am größten?',
    'Überall gleich groß.', [['Im breitesten Gefäß, weil es am meisten Wasser enthält.', 'Der hydrostatische Druck hängt nur von ρ, g und h ab, nicht von der Wassermenge (hydrostatisches Paradoxon).'], ['Im schmalsten Gefäß.', 'Die Form spielt keine Rolle.']],
    'p = ρ·g·h – die Höhe der Säule entscheidet.'),
  mt('p2-druckeinheiten', 'druck-dichte', 0, 'harten', 'Ordne jeder Druckangabe den passenden Wert zu.',
    [['1 mmHg', '≈ 133 Pa'], ['1 cmH₂O', '≈ 98 Pa'], ['1 bar', '100 000 Pa'], ['Luftdruck auf Meereshöhe', '≈ 1013 hPa']], 'Faustregel: 7,5 mmHg ≈ 1 kPa ≈ 10 cmH₂O.', 'wissen', 'einheit'),
  // ================================================================= Periodensystem
  sc('c2-valenz', 'periodensystem', 0, 'anwendung', 'begriff', 'zeeck', 'Wie viele Valenzelektronen hat Phosphor (5. Hauptgruppe, 3. Periode)?',
    '5', [['3', 'Die Periode gibt die Zahl der Schalen an, nicht der Valenzelektronen.'], ['15', 'Das ist die Ordnungszahl bzw. die IUPAC-Gruppe 15.'], ['8', 'Acht Valenzelektronen haben die Edelgase (außer Helium).']],
    'Hauptgruppennummer = Zahl der Valenzelektronen. P: [Ne] 3s² 3p³.'),
  mt('c2-konfig', 'periodensystem', 1, 'zeeck', 'Ordne jedem Element seine Elektronenkonfiguration zu.',
    [['C', '1s² 2s² 2p²'], ['Na', '[Ne] 3s¹'], ['Cl', '[Ne] 3s² 3p⁵'], ['K', '[Ar] 4s¹'], ['Ca', '[Ar] 4s²']], 'Die 4s-Unterschale wird vor der 3d-Unterschale besetzt.', 'anwendung'),
  sc('c2-en', 'periodensystem', 2, 'verstaendnis', 'richtung', 'zeeck', 'Welches Element hat die höchste Elektronegativität?',
    'Fluor', [['Natrium', 'Alkalimetalle haben besonders niedrige Elektronegativitäten.'], ['Iod', 'Innerhalb der Halogene nimmt die Elektronegativität nach unten ab.'], ['Helium', 'Für Edelgase gibt man meist keinen Pauling-Wert an.']],
    'Die Elektronegativität steigt nach rechts und nach oben; Fluor hat den Höchstwert (3,98, gerundet 4,0).'),
  mt('c2-ionen', 'periodensystem', 2, 'zeeck', 'Welche Ionenladung ist typisch?',
    [['Kalium', '+1'], ['Magnesium', '+2'], ['Chlor', '−1'], ['Sauerstoff', '−2']], 'Hauptgruppenelemente erreichen durch Abgabe oder Aufnahme von Elektronen die Edelgaskonfiguration.', 'anwendung'),
  // ================================================================= Reaktionsgleichungen
  bal('c2-bal-h2o', ['H₂', 'O₂'], ['H₂O'], [2, 1, 2], 'Rechts stehen pro Wassermolekül ein O; für O₂ braucht man also 2 H₂O und dafür 2 H₂.', 'verstaendnis'),
  bal('c2-bal-ch4', ['CH₄', 'O₂'], ['CO₂', 'H₂O'], [1, 2, 1, 2], 'Erst C (1 CO₂), dann H (2 H₂O), zuletzt O: rechts 2 + 2 = 4 O, also 2 O₂.'),
  bal('c2-bal-glc', ['C₆H₁₂O₆', 'O₂'], ['CO₂', 'H₂O'], [1, 6, 6, 6], 'Gleichung der Zellatmung: 6 C → 6 CO₂, 12 H → 6 H₂O, rechts 18 O, davon 6 aus der Glukose, also 6 O₂.'),
  bal('c2-bal-nacl', ['Na', 'Cl₂'], ['NaCl'], [2, 1, 2], 'Chlor kommt als Cl₂ vor; für zwei Cl braucht man zwei NaCl und zwei Na.', 'verstaendnis'),
  bal('c2-bal-fe', ['Fe', 'O₂'], ['Fe₂O₃'], [4, 3, 2], 'O: 2 (in O₂) und 3 (in Fe₂O₃) → kleinstes gemeinsames Vielfaches 6: 3 O₂ und 2 Fe₂O₃, dann 4 Fe.', 'analyse'),
  bal('c2-bal-nh3', ['N₂', 'H₂'], ['NH₃'], [1, 3, 2], 'Zwei N → 2 NH₃ mit 6 H → 3 H₂.'),
  bal('c2-bal-al', ['Al', 'HCl'], ['AlCl₃', 'H₂'], [2, 6, 2, 3], 'Cl: 3 pro AlCl₃; H₂ braucht gerade Zahlen an H → 6 HCl, 2 AlCl₃, 3 H₂, 2 Al.', 'analyse'),
  bal('c2-bal-caoh', ['Ca(OH)₂', 'HCl'], ['CaCl₂', 'H₂O'], [1, 2, 1, 2], 'Neutralisation: Die Klammer zählt doppelt – Ca(OH)₂ enthält 2 O und 2 H.'),
  bal('c2-bal-h2o2', ['H₂O₂'], ['H₂O', 'O₂'], [2, 2, 1], 'Zerfall von Wasserstoffperoxid (z. B. durch das Enzym Katalase).'),
  bal('c2-bal-eth', ['C₂H₅OH', 'O₂'], ['CO₂', 'H₂O'], [1, 3, 2, 3], 'Ethanol: 2 C → 2 CO₂, 6 H → 3 H₂O; rechts 7 O, davon 1 aus dem Ethanol → 3 O₂.', 'analyse'),
  bal('c2-bal-fe2', ['Fe²⁺', 'Cl₂'], ['Fe³⁺', 'Cl⁻'], [2, 1, 2, 2], 'Ionengleichung: Auch die Ladung muss stimmen – links 2·(+2) = +4, rechts 2·(+3) + 2·(−1) = +4.', 'analyse'),
  sc('c2-index', 'stoechiometrie', 0, 'verstaendnis', 'begriff', 'zeeck', 'Was darf man beim Ausgleichen einer Reaktionsgleichung verändern?',
    'Nur die Koeffizienten vor den Formeln', [['Die Indizes in den Formeln', 'Dann entstünde ein anderer Stoff (H₂O → H₂O₂).'], ['Beides, solange die Atomzahl stimmt', 'Indizes beschreiben den Stoff selbst und bleiben fest.']],
    'Koeffizienten geben Stoffmengen an, Indizes die Zusammensetzung des Stoffs.'),
  // ================================================================= Seminar 2: Stoffmenge, Gase, Konzentrationsmaße
  sc('c2-avogadro', 'stoechiometrie', 3, 'verstaendnis', 'mechanismus', 'zeeck', 'Ein Ballon enthält 1 l Wasserstoff, ein zweiter 1 l Kohlendioxid, beide bei gleichem Druck und gleicher Temperatur. Was gilt?',
    'Beide enthalten gleich viele Moleküle.', [['Der CO₂-Ballon enthält mehr Moleküle, weil CO₂ schwerer ist.', 'Schwerer heißt nur: gleiche Teilchenzahl, aber mehr Masse.'], ['Der H₂-Ballon enthält mehr Moleküle, weil H₂ kleiner ist.', 'Bei Gasen ist das Eigenvolumen der Moleküle vernachlässigbar.']],
    'Satz von Avogadro: Gleiche Gasvolumina enthalten bei gleichem Druck und gleicher Temperatur gleich viele Teilchen. Deshalb hat jedes ideale Gas dasselbe Molvolumen (22,4 l/mol bei 0 °C, 1013 hPa).'),
  sc('c2-na', 'stoechiometrie', 3, 'wissen', 'formel', 'zeeck', 'Wie rechnet man aus der Stoffmenge die Zahl der Teilchen aus?',
    'N = n · N_A', [['N = n / N_A', 'Dann käme eine winzige Zahl heraus – 1 mol enthält aber 6,022 · 10²³ Teilchen.'], ['N = m · N_A', 'Die Masse muss zuerst über n = m/M in Mol umgerechnet werden.']],
    'N_A = 6,022 · 10²³ mol⁻¹ ist die Zahl der Teilchen pro Mol.'),
  mt('c2-konzmasse', 'stoechiometrie', 4, 'zeeck', 'Ordne jedem Konzentrationsmaß seine Definition zu.',
    [['Molarität', 'mol Stoff pro Liter Lösung'], ['Molalität', 'mol Stoff pro Kilogramm Lösungsmittel'], ['Massenkonzentration', 'Gramm Stoff pro Liter Lösung'], ['Masseprozent', 'Masse Stoff / Masse der ganzen Lösung'], ['Volumenprozent', 'Volumen Stoff / Volumen der Mischung'], ['ppm', '10⁻⁶, z. B. 1 mg pro kg']],
    'Bei jedem Maß zählt, was durch was geteilt wird – und ob sich die Angabe auf die Lösung oder das Lösungsmittel bezieht.', 'wissen'),
  sc('c2-auffuellen', 'stoechiometrie', 4, 'anwendung', 'lesen', 'zeeck', 'Wie stellt man 10 ml einer 1-molaren NaCl-Lösung (M = 58,44 g/mol) korrekt her?',
    '0,584 g NaCl einwiegen und mit Wasser auf 10 ml auffüllen', [['0,584 g NaCl in 10 ml Wasser lösen', 'Dann ist das Volumen der fertigen Lösung etwas größer als 10 ml und die Konzentration etwas kleiner als 1 mol/l.'], ['58,44 g NaCl in 10 ml Wasser lösen', 'Das wäre 1 mol in 10 ml, also 100 mol/l – und so viel Salz löst sich gar nicht.', 'einheit']],
    'm = c · V · M = 1 mol/l · 0,01 l · 58,44 g/mol = 0,584 g. Konzentrationen beziehen sich auf das Endvolumen der Lösung.'),
  sc('c2-masseprozent', 'stoechiometrie', 4, 'verstaendnis', 'lesen', 'zeeck', '10 g Zucker werden in 90 g Wasser gelöst. Wie viel Masseprozent Zucker enthält die Lösung?',
    '10 %', [['11,1 %', 'Das wäre 10 g / 90 g – bezogen nur auf das Wasser statt auf die ganze Lösung.'], ['1 %', 'Der Massenanteil ist 10 g / 100 g = 0,1 = 10 %.', 'rechnen']],
    'w = m(Stoff) / m(Lösung) = 10 g / (10 g + 90 g) = 10 %.'),
  // ================================================================= Mikroskopie
  sc('h2-aufloesung', 'mikroskopie', 1, 'verstaendnis', 'begriff', 'luellmann', 'Was beschreibt das Auflösungsvermögen eines Mikroskops?',
    'Den kleinsten Abstand, bei dem zwei Punkte noch getrennt zu sehen sind', [['Wie stark das Bild vergrößert wird', 'Das ist die Vergrößerung; mehr Vergrößerung ohne bessere Auflösung zeigt keine neuen Details.'], ['Wie hell das Bild ist', 'Die Helligkeit hängt von Lichtquelle und Blende ab.']],
    'Lichtmikroskop: etwa 0,2 µm. Ribosomen (≈ 25 nm) sind daher nicht einzeln sichtbar.'),
  od('h2-praeparat', 'mikroskopie', 2, 'luellmann', 'Bringe die Schritte der Präparatherstellung in die richtige Reihenfolge.',
    ['Fixieren', 'Entwässern', 'Einbetten in Paraffin', 'Schneiden am Mikrotom', 'Entparaffinieren', 'Färben', 'Eindecken'], 'Paraffin ist wasserunlöslich – deshalb muss vor dem Einbetten entwässert und vor dem Färben (wässrige Farbstoffe) wieder entparaffiniert werden.'),
  sc('h2-he', 'mikroskopie', 2, 'verstaendnis', 'verwechslung', 'luellmann', 'Welche Struktur erscheint in der H.E.-Färbung blau-violett?',
    'Der Zellkern', [['Kollagenfasern', 'Kollagen ist acidophil und färbt sich mit Eosin rosa.'], ['Erythrozyten', 'Erythrozyten sind stark eosinophil (rot).'], ['Fetttropfen', 'Fett wird bei der Einbettung herausgelöst – die Zelle erscheint leer.']],
    'Hämatoxylin färbt basophile Strukturen (DNA im Kern, RNA im rauen ER) blau-violett.'),
  sc('h2-schnitt', 'mikroskopie', 3, 'analyse', 'struktur', 'luellmann', 'Im Schnitt siehst du einmal einen Ring, an anderer Stelle zwei parallele Streifen derselben Wandstruktur. Was liegt am ehesten vor?',
    'Ein Rohr (z. B. ein Gefäß), einmal quer und einmal längs angeschnitten', [['Zwei verschiedene Organe', 'Dieselbe Wandstruktur spricht für ein Rohr in zwei Schnittrichtungen.'], ['Eine Kugel', 'Eine Kugel wäre in jeder Schnittrichtung rund.']],
    'Rohr: quer → Ring, längs → zwei Streifen, schräg → Oval.'),
  mt('h2-faerbungen', 'mikroskopie', 2, 'luellmann', 'Was zeigt die jeweilige Färbung besonders?',
    [['PAS-Reaktion', 'Kohlenhydrate (Glykogen, Schleim, Basalmembran)'], ['Azan', 'Kollagen blau'], ['Resorcin-Fuchsin', 'elastische Fasern'], ['Versilberung', 'retikuläre Fasern']], 'Die Standardfärbung im Kurs ist H.E.; Spezialfärbungen heben einzelne Bestandteile hervor.', 'wissen'),
  // ================================================================= Histologie-Prüfungssimulator
  hs('hs-platten-ein', 'epithel', 0, 'h-platten-ein', ['h-platten-ein', 'h-iso', 'h-platten-mehr', 'h-bindegewebe-locker'],
    [['sehr flache Zellen mit abgeflachten Kernen', true], ['eine einzige Zelllage auf der Basalmembran', true], ['Becherzellen', false, 'Becherzellen kommen in hochprismatischen und respiratorischen Epithelien vor.'], ['kernlose Hornschicht', false, 'Die gibt es nur bei verhorntem mehrschichtigem Plattenepithel.']],
    ['Stoffaustausch und Diffusion (z. B. Alveolen, Endothel)', 'Schutz vor mechanischer Belastung', 'Resorption mit großer Oberfläche'],
    'Einschichtiges Plattenepithel: eine Lage sehr flacher Zellen mit abgeflachten Kernen auf der Basalmembran. Kurze Diffusionsstrecke – typisch für Alveolen, Endothel und Mesothel.', [['flach', 'platt'], ['einschicht', 'eine lage', 'eine zelllage', 'eine schicht'], ['basalmembran', 'austausch', 'diffusion']], { form: 'platt', layers: 'einschichtig' }),
  hs('hs-iso', 'epithel', 0, 'h-iso', ['h-iso', 'h-hoch', 'h-platten-ein', 'h-urothel'],
    [['würfelförmige Zellen, etwa so hoch wie breit', true], ['runde, zentral gelegene Kerne', true], ['eine Zelllage', true], ['Kinozilien', false, 'Kinozilien sind typisch für das respiratorische Epithel.'], ['Kerne in mehreren Höhen', false, 'Das spricht für ein mehrreihiges Epithel.']],
    ['Sekretion und Resorption (z. B. Nierentubuli, Drüsengänge)', 'Schutz vor Austrocknung', 'Dehnbarkeit bei wechselnder Füllung'],
    'Einschichtiges isoprismatisches Epithel: würfelförmige Zellen mit runden, zentralen Kernen in einer Reihe. Vorkommen z. B. in Nierentubuli, Drüsenausführungsgängen und Schilddrüsenfollikeln.', [['kubisch', 'isoprismatisch', 'würfel'], ['rund', 'zentral'], ['einschicht', 'eine lage', 'eine zelllage']], { form: 'isoprismatisch (kubisch)', layers: 'einschichtig' }),
  hs('hs-hoch', 'epithel', 0, 'h-hoch', ['h-hoch', 'h-resp', 'h-iso', 'h-platten-mehr'],
    [['hohe, schmale Zellen', true], ['längliche Kerne, alle auf ähnlicher Höhe basal', true], ['Bürstensaum (Mikrovilli) an der Oberfläche', true], ['Becherzellen', true], ['Kerne in mehreren Höhen', false, 'Liegen die Kerne in mehreren Höhen, spricht das für ein mehrreihiges Epithel.'], ['kernlose Hornschicht', false, 'Nur bei verhorntem Plattenepithel.']],
    ['Resorption und Sekretion (z. B. Dünndarm)', 'mukoziliäre Reinigung', 'Schutz vor Austrocknung'],
    'Einschichtiges hochprismatisches Epithel mit Bürstensaum und Becherzellen, wie im Dünndarm: Die Mikrovilli vergrößern die resorbierende Oberfläche, die Becherzellen bilden Schleim.', [['hochprismatisch', 'zylindr', 'hoch'], ['einschicht', 'eine reihe', 'eine lage'], ['bürstensaum', 'mikrovilli'], ['becherzell']], { form: 'hochprismatisch', layers: 'einschichtig' }),
  hs('hs-resp', 'epithel', 0, 'h-resp', ['h-resp', 'h-hoch', 'h-platten-mehr', 'h-urothel'],
    [['Kerne in mehreren Höhen', true], ['alle Zellen berühren die Basalmembran', true], ['Kinozilien an der Oberfläche', true], ['Becherzellen', true], ['Bürstensaum aus Mikrovilli', false, 'Der Saum besteht hier aus beweglichen Kinozilien, die länger sind als Mikrovilli.'], ['oberste Zellen platt', false, 'Das wäre ein mehrschichtiges Plattenepithel.']],
    ['mukoziliäre Reinigung der Atemwege', 'Resorption im Darm', 'Schutz der Haut'],
    'Mehrreihiges hochprismatisches Flimmerepithel mit Becherzellen (respiratorisches Epithel): Die Kerne liegen in mehreren Höhen, aber alle Zellen sitzen der Basalmembran auf. Kinozilien transportieren den Schleim rachenwärts.', [['mehrreih'], ['kinozilien', 'flimmer'], ['becherzell'], ['basalmembran']], { form: 'hochprismatisch', layers: 'mehrreihig' }),
  hs('hs-platten-mehr', 'epithel', 0, 'h-platten-mehr', ['h-platten-mehr', 'h-verhornt', 'h-urothel', 'h-iso'],
    [['viele Zelllagen', true], ['oberste Zellen abgeflacht, aber noch mit Kern', true], ['kubische Basalzellen', true], ['kernlose Hornschicht', false, 'Fehlt beim unverhornten Plattenepithel.'], ['Becherzellen', false, 'Gehören nicht zum Plattenepithel.']],
    ['Schutz feuchter Oberflächen vor mechanischer Belastung (Mundhöhle, Ösophagus)', 'Stoffaustausch', 'mukoziliäre Reinigung'],
    'Mehrschichtiges unverhorntes Plattenepithel: viele Lagen, die oberflächlichen Zellen sind platt und behalten ihren Kern. Vorkommen in Mundhöhle, Ösophagus und Vagina.', [['mehrschicht'], ['platt', 'flach'], ['unverhornt', 'kern']], { form: 'platt', layers: 'mehrschichtig' }),
  hs('hs-verhornt', 'epithel', 0, 'h-verhornt', ['h-verhornt', 'h-platten-mehr', 'h-urothel', 'h-straff'],
    [['kernlose Hornschicht an der Oberfläche', true], ['viele Zelllagen', true], ['Basalzellschicht (Stratum basale)', true], ['große, zweikernige Deckzellen', false, 'Das spricht für Urothel.']],
    ['Schutz vor Austrocknung und mechanischer Belastung (Epidermis)', 'Dehnbarkeit bei wechselnder Füllung', 'Resorption'],
    'Mehrschichtiges verhorntes Plattenepithel (Epidermis): Die oberflächlichen Zellen verlieren ihre Kerne und bilden die Hornschicht, die vor Austrocknung schützt.', [['mehrschicht'], ['verhornt', 'hornschicht', 'kernlos'], ['haut', 'epidermis', 'austrockn']], { form: 'platt', layers: 'mehrschichtig' }),
  hs('hs-urothel', 'epithel', 0, 'h-urothel', ['h-urothel', 'h-platten-mehr', 'h-resp', 'h-verhornt'],
    [['große, oft zweikernige Deckzellen an der Oberfläche', true], ['mehrere Zelllagen', true], ['Deckzellen überspannen mehrere darunterliegende Zellen', true], ['Hornschicht', false, 'Urothel verhornt nicht.'], ['Kinozilien', false, 'Urothel trägt keine Kinozilien.']],
    ['Dehnbarkeit und Abdichtung gegen Harn', 'mukoziliäre Reinigung', 'Stoffaustausch'],
    'Urothel (Übergangsepithel) der ableitenden Harnwege: große, teils zweikernige Deckzellen („Schirmzellen“) bilden eine dichte Barriere gegen Harn; das Epithel passt sich der Füllung der Blase an.', [['urothel', 'übergang'], ['deckzell', 'schirm'], ['dehn', 'harn']], { form: 'große Deckzellen (Schirmzellen)', formOptions: ['platt', 'große Deckzellen (Schirmzellen)', 'hochprismatisch'], layers: 'mehrschichtig' }),
  hs('hs-locker', 'bindegewebe', 1, 'h-bindegewebe-locker', ['h-bindegewebe-locker', 'h-straff', 'h-fett', 'h-glatt'],
    [['locker und ungeordnet verlaufende Fasern', true], ['verschiedene freie Zellen (z. B. Mastzellen, Plasmazellen)', true], ['viel Grundsubstanz zwischen den Fasern', true], ['dicht gepackte, parallele Kollagenbündel', false, 'Das ist straffes parallelfaseriges Bindegewebe.'], ['Zellen in Lakunen', false, 'Lakunen kennzeichnen Knorpel und Knochen.']],
    ['Verschiebeschicht, Abwehr und Stoffaustausch', 'Zugfestigkeit in Sehnen', 'Druckelastizität im Gelenk'],
    'Lockeres Bindegewebe: wenige, ungeordnete Fasern, viel Grundsubstanz und zahlreiche ortsständige und freie Zellen. Es füllt Räume, verbindet und dient der Abwehr.', [['locker'], ['fasern', 'kollagen', 'elastisch'], ['zelle', 'mastzell', 'plasmazell', 'fibroblast'], ['grundsubstanz']]),
  hs('hs-straff', 'bindegewebe', 1, 'h-straff', ['h-straff', 'h-skelettmuskel', 'h-knorpel-faser', 'h-glatt'],
    [['dicht gepackte, parallele Kollagenfaserbündel', true], ['schmale Fibrozytenkerne in Reihen zwischen den Bündeln', true], ['Querstreifung', false, 'Querstreifung zeigt quergestreifte Muskulatur.'], ['viele freie Zellen', false, 'Straffes Bindegewebe ist zellarm.'], ['Chondrozyten in Lakunen', false, 'Das spräche für Faserknorpel.']],
    ['Zugfestigkeit (Sehnen, Bänder)', 'Kontraktion', 'Wärmeisolation'],
    'Straffes parallelfaseriges Bindegewebe (z. B. Sehne): parallele Kollagen-I-Bündel, dazwischen Reihen schmaler Fibrozytenkerne. Es ist zugfest, aber kaum dehnbar.', [['straff', 'parallel'], ['kollagen'], ['fibrozyt', 'kern'], ['sehne', 'band', 'zug']]),
  hs('hs-fett', 'bindegewebe', 1, 'h-fett', ['h-fett', 'h-knorpel-hyalin', 'h-bindegewebe-locker', 'h-platten-ein'],
    [['große, optisch leere Zellen (Fett herausgelöst)', true], ['abgeflachter, randständiger Kern', true], ['wabenartiges Bild', true], ['zentral gelegene runde Kerne', false, 'Bei univakuolären Fettzellen drängt der Fetttropfen den Kern an den Rand.'], ['Zellen in Lakunen', false, 'Lakunen gibt es in Knorpel und Knochen.']],
    ['Energiespeicher, Wärmeisolation und Polsterung', 'Zugfestigkeit', 'Gleitfläche im Gelenk'],
    'Weißes (univakuoläres) Fettgewebe: große Fettzellen mit einem einzigen Fetttropfen, der bei der Präparation herausgelöst wird; der Kern liegt abgeflacht am Rand („Siegelringzelle“).', [['fett'], ['leer', 'herausgelöst', 'tropfen'], ['randständ', 'siegelring', 'abgeflacht']]),
  hs('hs-hyalin', 'bindegewebe', 2, 'h-knorpel-hyalin', ['h-knorpel-hyalin', 'h-knorpel-elastisch', 'h-knorpel-faser', 'h-knochen'],
    [['Chondrozyten in Lakunen', true], ['isogene Gruppen', true], ['homogene, glasige Matrix ohne sichtbare Fasern', true], ['Perichondrium am Rand', true], ['Netz elastischer Fasern', false, 'Das kennzeichnet elastischen Knorpel.'], ['Havers-Kanäle', false, 'Havers-Kanäle gehören zum Lamellenknochen.']],
    ['druckelastische Gleitfläche (Gelenkknorpel, Rippenknorpel)', 'Formelastizität (Ohrmuschel)', 'Zugfestigkeit (Bandscheibe)'],
    'Hyaliner Knorpel: Chondrozyten in Lakunen, oft als isogene Gruppen, in einer homogenen Matrix, deren Kollagen-II-Fibrillen lichtmikroskopisch nicht sichtbar sind. Meist von Perichondrium umgeben (Ausnahme: Gelenkknorpel).', [['hyalin'], ['lakune', 'isogen', 'chondrozyt'], ['homogen', 'glasig', 'matrix'], ['perichondrium']]),
  hs('hs-elastisch', 'bindegewebe', 2, 'h-knorpel-elastisch', ['h-knorpel-elastisch', 'h-knorpel-hyalin', 'h-knorpel-faser', 'h-bindegewebe-locker'],
    [['Chondrozyten in Lakunen', true], ['Netz elastischer Fasern in der Matrix', true], ['parallele, grobe Kollagenfaserbündel', false, 'Das spricht für Faserknorpel.'], ['Havers-Kanäle', false, 'Nur im Knochen.']],
    ['Formelastizität (Ohrmuschel, Epiglottis)', 'Gleitfläche im Gelenk', 'Zugfestigkeit (Symphyse)'],
    'Elastischer Knorpel: Chondrozyten in Lakunen, die Matrix enthält ein dichtes Netz elastischer Fasern (mit Spezialfärbung gut sichtbar). Vorkommen in Ohrmuschel und Kehldeckel.', [['elastisch'], ['lakune', 'chondrozyt'], ['ohr', 'epiglottis', 'kehldeckel']]),
  hs('hs-faser', 'bindegewebe', 2, 'h-knorpel-faser', ['h-knorpel-faser', 'h-straff', 'h-knorpel-hyalin', 'h-knorpel-elastisch'],
    [['Chondrozyten in Reihen zwischen parallelen Kollagenfasern', true], ['wenig Grundsubstanz', true], ['deutliches Perichondrium', false, 'Faserknorpel hat meist kein Perichondrium.'], ['elastisches Fasernetz', false, 'Das gehört zum elastischen Knorpel.']],
    ['Zug- und Druckfestigkeit (Bandscheiben, Symphyse, Menisken)', 'Formelastizität', 'Gleitfläche im Gelenk'],
    'Faserknorpel: grobe, parallele Kollagen-I-Bündel wie in einer Sehne, dazwischen Chondrozyten (einzeln oder in Reihen) mit schmalem Matrixhof. Vorkommen in Bandscheiben (Anulus fibrosus), Symphyse und Menisken.', [['faserknorpel'], ['kollagen', 'faser'], ['chondrozyt', 'lakune'], ['bandscheibe', 'symphyse', 'menisk']]),
  hs('hs-knochen', 'bindegewebe', 3, 'h-knochen', ['h-knochen', 'h-knorpel-hyalin', 'h-knorpel-faser', 'h-straff'],
    [['konzentrische Lamellen um einen zentralen Havers-Kanal (Osteon)', true], ['Osteozyten in Lakunen zwischen den Lamellen', true], ['querverlaufende Volkmann-Kanäle', true], ['isogene Gruppen', false, 'Isogene Gruppen sind typisch für Knorpel.'], ['Glanzstreifen', false, 'Glanzstreifen gibt es nur im Herzmuskel.']],
    ['Stütze und Mineralspeicher', 'Formelastizität', 'Kontraktion'],
    'Lamellenknochen (Kompakta): Osteone aus konzentrischen Lamellen um einen Havers-Kanal mit Gefäßen; Osteozyten liegen in Lakunen, Volkmann-Kanäle verbinden die Havers-Kanäle.', [['osteon', 'havers'], ['lamelle'], ['osteozyt', 'lakune'], ['volkmann']]),
  hs('hs-skelett', 'muskel-nervengewebe', 0, 'h-skelettmuskel', ['h-skelettmuskel', 'h-herzmuskel', 'h-glatt', 'h-straff'],
    [['lange, parallele Fasern mit Querstreifung', true], ['viele randständige Kerne pro Faser', true], ['Glanzstreifen', false, 'Glanzstreifen kennzeichnen den Herzmuskel.'], ['ein zentraler Kern pro Zelle', false, 'Das spricht für Herz- oder glatte Muskulatur.'], ['Verzweigungen der Zellen', false, 'Herzmuskelzellen sind verzweigt.']],
    ['willkürliche Bewegung', 'unwillkürliche rhythmische Kontraktion', 'langsame Kontraktion von Hohlorganen'],
    'Skelettmuskulatur im Längsschnitt: lange, unverzweigte, quergestreifte Fasern mit vielen randständigen Kernen – jede Faser ist ein Synzytium.', [['querstreif'], ['randständ', 'peripher'], ['viele kerne', 'mehrkern', 'synzyt'], ['skelett']]),
  hs('hs-herz', 'muskel-nervengewebe', 0, 'h-herzmuskel', ['h-herzmuskel', 'h-skelettmuskel', 'h-glatt', 'h-knorpel-faser'],
    [['Querstreifung', true], ['meist ein zentraler Kern pro Zelle', true], ['Glanzstreifen zwischen den Zellen', true], ['Verzweigungen', true], ['viele randständige Kerne', false, 'Das kennzeichnet Skelettmuskelfasern.']],
    ['unwillkürliche rhythmische Kontraktion (Myokard)', 'willkürliche Bewegung', 'Zugfestigkeit'],
    'Herzmuskulatur: quergestreifte, verzweigte Zellen mit meist einem zentralen Kern, verbunden durch Glanzstreifen (mit Gap Junctions für die Erregungsausbreitung).', [['glanzstreif'], ['zentral'], ['verzweig'], ['querstreif']]),
  hs('hs-glatt', 'muskel-nervengewebe', 0, 'h-glatt', ['h-glatt', 'h-straff', 'h-skelettmuskel', 'h-herzmuskel'],
    [['spindelförmige Zellen', true], ['ein zentraler, länglicher Kern', true], ['keine Querstreifung', true], ['Glanzstreifen', false, 'Nur im Herzmuskel.'], ['randständige Kerne', false, 'Typisch für Skelettmuskelfasern.']],
    ['langsame, unwillkürliche Kontraktion in Hohlorganen und Gefäßen', 'willkürliche Bewegung', 'Zugfestigkeit in Sehnen'],
    'Glatte Muskulatur: spindelförmige Zellen ohne Querstreifung mit einem zentralen, länglichen Kern. Vorkommen in Gefäßwänden und Hohlorganen.', [['spindel'], ['zentral'], ['keine querstreif', 'ohne querstreif', 'nicht quergestreift', 'glatt']]),
  hs('hs-neuron', 'muskel-nervengewebe', 2, 'h-neuron', ['h-neuron', 'h-glia', 'h-herzmuskel', 'h-bindegewebe-locker'],
    [['großer Zellkörper mit hellem Kern und deutlichem Nukleolus', true], ['Nissl-Schollen im Zytoplasma', true], ['Fortsätze', true], ['kleine Gliazellkerne in der Umgebung', true], ['Querstreifung', false, 'Querstreifung gibt es nur in Skelett- und Herzmuskel.']],
    ['Erregungsbildung und -weiterleitung', 'Kontraktion', 'Stütze und Mineralspeicher'],
    'Nervengewebe: große Neurone mit hellem Kern, deutlichem Nukleolus und basophilen Nissl-Schollen (raues ER), umgeben von kleineren Gliazellkernen.', [['neuron', 'nervenzell'], ['nissl'], ['nukleolus', 'heller kern'], ['glia']]),
];
