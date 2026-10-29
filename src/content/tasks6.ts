import type { ChoiceOption, ErrorCategory, LabelFigure, Task, TaskLevel } from './types';
import { ANATOMY2_LESSONS } from './anatomy2';

// Aufgaben Anatomie II/III und Histologie (Blut/Gefäße, Haut/Drüsen).
// Selbst formulierte Übungsfragen nach Lehrbuchstandard – keine Originalfragen aus Leipziger Testaten.

const S = 'zu_pruefen' as const;
function O(lesson: string, i: number): string {
  const l = ANATOMY2_LESSONS.find((x) => x.id === lesson);
  if (!l || !l.objectives[i]) throw new Error(`Lernziel ${lesson}[${i}] fehlt`);
  return l.objectives[i];
}
const src = (id: string) => [{ id }];

function sc(id: string, lesson: string, oi: number, level: TaskLevel, category: ErrorCategory, source: string, prompt: string, correct: string, wrong: [string, string, ErrorCategory?][], explanation: string): Task {
  const opts: ChoiceOption[] = [{ id: 'a', text: correct }, ...wrong.map(([text, why, cat], i) => ({ id: String.fromCharCode(98 + i), text, why, category: cat ?? category }))];
  const rot = id.length % opts.length;
  return { id, type: 'single', prompt, level, lessons: [lesson], objective: O(lesson, oi), category, sources: src(source), status: S, options: [...opts.slice(rot), ...opts.slice(0, rot)], correct: 'a', explanation };
}
function mc(id: string, lesson: string, oi: number, source: string, prompt: string, right: string[], wrong: [string, string][], explanation: string, category: ErrorCategory = 'verwechslung'): Task {
  const options: ChoiceOption[] = [...right.map((text, i) => ({ id: `r${i}`, text })), ...wrong.map(([text, why], i) => ({ id: `w${i}`, text, why }))];
  const rot = id.length % options.length;
  return { id, type: 'multi', level: 'verstaendnis', lessons: [lesson], objective: O(lesson, oi), category, sources: src(source), status: S, prompt, options: [...options.slice(rot), ...options.slice(0, rot)], correct: right.map((_, i) => `r${i}`), explanation };
}
function mt(id: string, lesson: string, oi: number, source: string, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'verstaendnis', category: ErrorCategory = 'verwechslung'): Task {
  return { id, type: 'match', level, lessons: [lesson], objective: O(lesson, oi), category, sources: src(source), status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
}
function od(id: string, lesson: string, oi: number, source: string, prompt: string, items: string[], explanation: string): Task {
  return { id, type: 'order', level: 'wissen', lessons: [lesson], objective: O(lesson, oi), category: 'reihenfolge', sources: src(source), status: S, prompt, items, explanation };
}
function lb(id: string, lesson: string, oi: number, figure: LabelFigure, source: string, structures: string[], explanation: string): Task {
  return { id, type: 'label', figure, level: 'wissen', lessons: [lesson], objective: O(lesson, oi), category: 'struktur', sources: src(source), status: S, prompt: 'Ordne den nummerierten Markierungen die richtigen Strukturen zu.', markers: structures.map((structure, i) => ({ n: i + 1, structure })), explanation };
}
function tx(id: string, lesson: string, oi: number, source: string, prompt: string, modelAnswer: string, keywords: string[][]): Task {
  return { id, type: 'text', level: 'verknuepfung', lessons: [lesson], objective: O(lesson, oi), category: 'mechanismus', sources: src(source), status: S, prompt, keywords, modelAnswer, explanation: modelAnswer };
}
type F = [string, boolean, string?];
function hs(id: string, lesson: string, oi: number, scene: string, tissueOptions: string[], features: F[], fn: [string, string, string], modelAnswer: string, keywords: string[][]): Task {
  return {
    id, type: 'histo', level: 'anwendung', lessons: [lesson], objective: O(lesson, oi), category: 'gewebe', sources: src('luellmann'), status: S,
    prompt: 'Was zeigt das Präparat? Bestimme es Schritt für Schritt.', scene, tissueOptions,
    features: features.map(([text, ok, why]) => ({ text, ok, why })),
    fn: { options: [...fn].sort(), correct: fn[0] }, keywords, modelAnswer, explanation: modelAnswer,
  };
}

const D = 'duale-reihe-anatomie', P = 'schuenke', L = 'luellmann';

export const TASKS_6: Task[] = [
  // ============================================================ Nervensystem
  mt('a2-ns-gliederung', 'nervensystem', 0, D, 'Ordne die Begriffe richtig zu.',
    [['Gehirn und Rückenmark', 'ZNS'], ['Spinalnerven und Ganglien', 'PNS'], ['Ursprung thorakolumbal', 'Sympathikus'], ['Ursprung kraniosakral', 'Parasympathikus'], ['vom ZNS weg', 'efferent']],
    'ZNS = Gehirn und Rückenmark; alles außerhalb ist PNS. Der Sympathikus entspringt im Seitenhorn von etwa Th1–L2, der Parasympathikus aus Hirnstamm und Sakralmark.', 'wissen', 'begriff'),
  sc('a2-ns-vorderhorn', 'nervensystem', 1, 'wissen', 'struktur', D, 'Wo liegen die Zellkörper der Motoneurone, die die Skelettmuskulatur ansteuern?',
    'im Vorderhorn der grauen Substanz', [['im Spinalganglion', 'Dort liegen die Zellkörper der sensiblen Neurone.'], ['im Hinterhorn', 'Das Hinterhorn verarbeitet sensible Information.'], ['in der weißen Substanz', 'Die weiße Substanz enthält Bahnen (Axone), kaum Zellkörper.']],
    'Vorne = motorisch: Die α-Motoneurone liegen im Vorderhorn, ihre Axone verlassen das Rückenmark über die vordere Wurzel.'),
  sc('a2-ns-ganglion', 'nervensystem', 2, 'verstaendnis', 'mechanismus', D, 'Was trifft für das Spinalganglion zu?',
    'Es enthält die Zellkörper pseudounipolarer sensibler Neurone; eine Umschaltung findet dort nicht statt.', [['Es ist die Umschaltstelle zwischen sensiblem und motorischem Neuron.', 'Diese Synapse liegt im Rückenmark, nicht im Ganglion.'], ['Es liegt in der vorderen Wurzel.', 'Das Spinalganglion sitzt in der hinteren Wurzel.'], ['Es enthält vegetative Neurone des Sympathikus.', 'Das wären die Ganglien des Grenzstrangs.']],
    'Spinalganglion = Perikaryen der ersten sensiblen Neurone; der periphere und der zentrale Fortsatz gehen ohne Synapse ineinander über.'),
  mc('a2-ns-rami', 'nervensystem', 2, D, 'Welche Aussagen zum Spinalnerv sind richtig?',
    ['Er entsteht aus vorderer und hinterer Wurzel.', 'Er führt motorische und sensible Fasern.', 'Es gibt 31 Spinalnervenpaare.'],
    [['Der Ramus posterior ist rein sensibel.', 'Beide Äste sind gemischt; der hintere versorgt Rückenmuskeln und Rückenhaut.'], ['Die hinteren Äste bilden den Plexus brachialis.', 'Plexus entstehen aus den vorderen Ästen.']],
    'Vordere + hintere Wurzel → gemischter Spinalnerv → Ramus anterior und posterior (beide gemischt). Die vorderen Äste bilden die Plexus.'),
  sc('a2-ns-lumbal', 'nervensystem', 3, 'anwendung', 'struktur', D, 'Warum punktiert man Liquor beim Erwachsenen zwischen dem 3. und 4. oder 4. und 5. Lendenwirbel?',
    'Das Rückenmark endet etwa bei L1/L2; darunter liegen nur Nervenwurzeln, die ausweichen können.', [['Dort ist die Dura am dünnsten.', 'Das ist nicht der Grund – entscheidend ist das Ende des Rückenmarks.'], ['Nur dort gibt es Liquor.', 'Liquor umgibt das gesamte Rückenmark und Gehirn.'], ['Weil dort die Spinalganglien fehlen.', 'Spinalganglien gibt es auch lumbal.']],
    'Conus medullaris auf Höhe L1/L2, darunter Cauda equina im Subarachnoidalraum – die Nadel gefährdet das Rückenmark nicht.'),
  od('a2-ns-haeute', 'nervensystem', 3, D, 'Ordne die Hüllen des Rückenmarks von innen nach außen.', ['Pia mater', 'Subarachnoidalraum mit Liquor', 'Arachnoidea mater', 'Dura mater'],
    'Pia liegt dem Rückenmark direkt auf, der Liquor fließt zwischen Pia und Arachnoidea, außen die derbe Dura.'),
  mt('a2-ns-plexus', 'nervensystem', 3, D, 'Ordne die Plexus ihren Segmenten zu.', [['Plexus cervicalis', 'C1–C4'], ['Plexus brachialis', 'C5–Th1'], ['Plexus lumbosacralis', 'L1–S3/S4'], ['N. phrenicus', 'C3–C5']],
    'Merke für das Zwerchfell: „C3, 4, 5 keeps the diaphragm alive.“', 'wissen'),
  lb('a2-ns-label', 'nervensystem', 1, 'spinal', D, ['n-hinterhorn', 'n-vorderhorn', 'n-spinalganglion', 'n-radix-anterior', 'n-weisse-substanz'],
    'Hinterhorn dorsal, Vorderhorn ventral; das Spinalganglion sitzt in der hinteren Wurzel.'),

  // ============================================================ Herz
  sc('a2-hz-lage', 'herz', 0, 'wissen', 'struktur', D, 'Wo liegt das Herz?',
    'im mittleren Mediastinum, etwa zu zwei Dritteln links der Medianebene', [['in der linken Pleurahöhle', 'Das Herz liegt zwischen den Pleurahöhlen im Mediastinum.'], ['genau in der Medianebene', 'Es ist deutlich nach links verlagert; die Herzspitze zeigt nach links unten.'], ['im hinteren Mediastinum', 'Dort liegen Speiseröhre und Aorta descendens.']],
    'Mittleres Mediastinum, hinter dem Sternum; Herzspitze etwa im 5. Zwischenrippenraum links in der Medioklavikularlinie.'),
  od('a2-hz-wand', 'herz', 0, D, 'Ordne die Schichten der Herzwand von innen nach außen.', ['Endokard', 'Myokard', 'Epikard (viszerales Blatt des serösen Perikards)', 'Perikardhöhle', 'parietales Perikard und fibröses Perikard'],
    'Endokard – Myokard – Epikard; um das Herz der Herzbeutel mit einem dünnen Flüssigkeitsspalt.'),
  od('a2-hz-weg', 'herz', 1, D, 'Bringe den Weg des Blutes ab den Hohlvenen in die richtige Reihenfolge.',
    ['rechter Vorhof', 'Trikuspidalklappe', 'rechte Kammer', 'Pulmonalklappe', 'Truncus pulmonalis', 'Lungenvenen', 'linker Vorhof', 'Mitralklappe', 'linke Kammer', 'Aortenklappe'],
    'Rechte Herzhälfte → Lunge → linke Herzhälfte → Aorta. Vor jeder Kammer eine Segelklappe, nach jeder eine Taschenklappe.'),
  mt('a2-hz-klappen', 'herz', 2, D, 'Ordne zu.', [['Trikuspidalklappe', 'drei Segel, rechts'], ['Mitralklappe', 'zwei Segel, links'], ['Aortenklappe', 'drei Taschen, darüber Koronarabgänge'], ['Pulmonalklappe', 'drei Taschen, rechte Ausflussbahn']],
    'Segelklappen zwischen Vorhof und Kammer, Taschenklappen am Kammerausgang.', 'wissen'),
  sc('a2-hz-papillar', 'herz', 2, 'verstaendnis', 'mechanismus', D, 'Welche Aufgabe haben die Papillarmuskeln mit den Chordae tendineae?',
    'Sie verhindern, dass die Segel in der Systole in den Vorhof durchschlagen.', [['Sie öffnen aktiv die Taschenklappen.', 'Taschenklappen haben keine Sehnenfäden und arbeiten passiv.'], ['Sie öffnen die Segelklappen in der Diastole.', 'Die Segelklappen öffnen passiv durch den Druckunterschied.'], ['Sie leiten die Erregung vom Vorhof zur Kammer.', 'Das macht das His-Bündel.']],
    'In der Systole spannen sich die Papillarmuskeln mit und halten die Segel über die Sehnenfäden fest.'),
  od('a2-hz-erregung', 'herz', 3, D, 'Ordne das Erregungsbildungs- und -leitungssystem.', ['Sinusknoten', 'Vorhofmuskulatur', 'AV-Knoten', 'His-Bündel', 'Tawara-Schenkel', 'Purkinje-Fasern'],
    'Der AV-Knoten verzögert; das His-Bündel ist die einzige Verbindung durch das Herzskelett.'),
  sc('a2-hz-riva', 'herz', 3, 'wissen', 'struktur', D, 'Aus welchem Gefäß geht der Ramus interventricularis anterior (RIVA) hervor?',
    'aus der A. coronaria sinistra', [['aus der A. coronaria dextra', 'Die rechte Koronararterie gibt meist den Ramus interventricularis posterior ab.'], ['aus dem Truncus pulmonalis', 'Koronararterien entspringen aus der Aortenwurzel.'], ['aus dem Sinus coronarius', 'Der Sinus coronarius ist eine Vene.']],
    'A. coronaria sinistra → RIVA (vordere Interventrikularfurche) und Ramus circumflexus.'),
  lb('a2-hz-label', 'herz', 1, 'heart', D, ['c-rechter-vorhof', 'c-trikuspidal', 'c-linker-ventrikel', 'c-aortenklappe', 'c-truncus-pulmonalis', 'c-septum'],
    'In der Ansicht von vorne liegt die rechte Herzhälfte links im Bild.'),
  lb('a2-hz-label2', 'herz', 3, 'heart', D, ['c-sinusknoten', 'c-av-knoten', 'c-his', 'c-mitral'], 'Sinusknoten an der Mündung der oberen Hohlvene, AV-Knoten unten im Vorhofseptum.'),

  // ============================================================ Kreislauf
  sc('a2-kr-arterie', 'gefaesssystem', 0, 'verstaendnis', 'begriff', D, 'Was unterscheidet eine Arterie von einer Vene?',
    'die Flussrichtung: Arterien führen vom Herzen weg, Venen zum Herzen hin', [['der Sauerstoffgehalt des Blutes', 'Der Truncus pulmonalis führt sauerstoffarmes, die Lungenvenen sauerstoffreiches Blut.'], ['nur der Durchmesser', 'Der Durchmesser allein bestimmt den Gefäßtyp nicht.'], ['ob das Gefäß Klappen hat', 'Klappen kommen in vielen Venen vor, aber nicht in allen; es ist nicht die Definition.']],
    'Definition über die Richtung – nicht über den Sauerstoffgehalt.'),
  od('a2-kr-bogen', 'gefaesssystem', 1, D, 'Ordne die Abgänge des Aortenbogens von rechts nach links.', ['Truncus brachiocephalicus', 'A. carotis communis sinistra', 'A. subclavia sinistra'],
    'Rechts gibt es den gemeinsamen Stamm (Truncus brachiocephalicus), links gehen Karotis und Subclavia einzeln ab.'),
  sc('a2-kr-bifurkation', 'gefaesssystem', 1, 'wissen', 'struktur', D, 'Wo teilt sich die Bauchaorta in die beiden Aa. iliacae communes?',
    'etwa in Höhe des 4. Lendenwirbels', [['in Höhe des Zwerchfells', 'Dort beginnt die Pars abdominalis.'], ['in Höhe von Th12', 'Dort tritt die Aorta durch das Zwerchfell.'], ['im kleinen Becken', 'Die Teilung liegt höher, vor dem 4. Lendenwirbel.']],
    'Bifurcatio aortae etwa bei L4 – ungefähr in Höhe des Nabels.'),
  sc('a2-kr-pfortader', 'gefaesssystem', 2, 'verstaendnis', 'mechanismus', D, 'Wohin fließt das Blut aus dem Dünndarm zuerst?',
    'über die Pfortader in die Leber', [['direkt in die untere Hohlvene', 'Erst nach der Leber gelangt es über die Lebervenen in die Hohlvene.'], ['in die Nierenvenen', 'Die Nieren haben einen eigenen Abfluss direkt zur Hohlvene.'], ['in die obere Hohlvene', 'Die obere Hohlvene sammelt Blut aus der oberen Körperhälfte.']],
    'Pfortaderkreislauf: Kapillaren im Darm → V. portae → Kapillaren (Sinusoide) der Leber → Lebervenen → V. cava inferior.'),
  mt('a2-kr-fetal', 'gefaesssystem', 3, 'sadler', 'Ordne jeder fetalen Struktur ihren Rest nach der Geburt zu.', [['Foramen ovale', 'Fossa ovalis'], ['Ductus arteriosus', 'Lig. arteriosum'], ['Ductus venosus', 'Lig. venosum'], ['Nabelvene', 'Lig. teres hepatis']],
    'Die Kurzschlüsse verschließen sich nach der Geburt und bleiben als bindegewebige Reste.', 'wissen'),
  tx('a2-kr-ovale', 'gefaesssystem', 3, 'sadler', 'Erkläre, warum sich das Foramen ovale nach der Geburt verschließt.',
    'Mit dem ersten Atemzug entfaltet sich die Lunge, der Widerstand im Lungenkreislauf sinkt und viel mehr Blut fließt über die Lungenvenen zum linken Vorhof. Gleichzeitig fällt der Zufluss aus der Plazenta weg. Der Druck im linken Vorhof wird höher als im rechten, dadurch wird die Klappe des Foramen ovale an das Septum gedrückt – das Foramen ist funktionell verschlossen und verwächst später.',
    [['lunge', 'atem'], ['druck'], ['linker vorhof', 'linken vorhof', 'links']]),
  lb('a2-kr-label', 'gefaesssystem', 1, 'vessels', D, ['v-aortenbogen', 'v-truncus-brachiocephalicus', 'v-carotis', 'v-aorta-abdominalis', 'v-pfortader'],
    'Truncus brachiocephalicus rechts als erster Abgang, Pfortader von Darm und Milz zur Leber.'),

  // ============================================================ Blut und Gefäßwand
  od('a2-bg-schichten', 'blut-gefaesse', 0, L, 'Ordne die Wandschichten einer muskulären Arterie von innen nach außen.', ['Endothel', 'subendotheliale Schicht', 'Membrana elastica interna', 'Tunica media', 'Membrana elastica externa', 'Tunica externa (Adventitia)'],
    'Intima = Endothel + subendotheliale Schicht; die Membrana elastica interna trennt Intima und Media.'),
  sc('a2-bg-elastisch', 'blut-gefaesse', 0, 'verstaendnis', 'funktion', L, 'Warum hat die Aorta eine Media aus vielen elastischen Membranen?',
    'Windkesselfunktion: Sie speichert in der Systole Blut und gibt es in der Diastole ab.', [['Damit sie den Blutfluss durch Kontraktion regulieren kann.', 'Das ist die Aufgabe muskulärer Arterien und Arteriolen.'], ['Damit Stoffe durch die Wand diffundieren können.', 'Stoffaustausch findet in Kapillaren statt.'], ['Weil sie Klappen trägt.', 'Die Aorta hat (außer an der Wurzel) keine Klappen.']],
    'Elastische Arterien glätten den stoßweisen Auswurf des Herzens zu einem kontinuierlicheren Fluss.'),
  mc('a2-bg-vene', 'blut-gefaesse', 1, L, 'Woran erkennst du im Schnitt eine Vene neben ihrer Begleitarterie?',
    ['weiteres, oft unregelmäßiges oder kollabiertes Lumen', 'dünnere Media', 'Adventitia oft die dickste Schicht'],
    [['deutliche, gewellte Membrana elastica interna', 'Das ist typisch für die Arterie.'], ['rundes Lumen mit dicker Muskelschicht', 'Das beschreibt die Arterie.']],
    'Arterie: rund, dicke Media, Elastica interna. Vene: weit, dünnwandig, oft zusammengefallen.', 'merkmal'),
  mt('a2-bg-kapillaren', 'blut-gefaesse', 2, L, 'Ordne die Kapillartypen ihrem typischen Vorkommen zu.', [['kontinuierlich', 'Skelettmuskel, ZNS'], ['fenestriert', 'Nierenglomerulus, endokrine Drüsen'], ['diskontinuierlich (sinusoidal)', 'Leber, Milz, Knochenmark']],
    'Je durchlässiger das Endothel, desto größer die Teilchen, die durchtreten können.', 'wissen', 'gewebe'),
  mt('a2-bg-leukos', 'blut-gefaesse', 3, L, 'Ordne die Leukozyten ihrem typischen Anteil im Differentialblutbild zu.', [['Neutrophile Granulozyten', '50–70 %'], ['Lymphozyten', '20–40 %'], ['Monozyten', '2–8 %'], ['Eosinophile Granulozyten', '2–4 %'], ['Basophile Granulozyten', 'unter 1 %']],
    'Merkreihe nach Häufigkeit: Neutrophile, Lymphozyten, Monozyten, Eosinophile, Basophile.', 'wissen', 'merkmal'),
  sc('a2-bg-monozyt', 'blut-gefaesse', 3, 'anwendung', 'merkmal', L, 'Im Ausstrich siehst du eine große Zelle mit nierenförmigem Kern und graublauem Zytoplasma. Was ist es?',
    'Monozyt', [['Lymphozyt', 'Lymphozyten haben einen runden, dichten Kern und nur einen schmalen Saum.'], ['Neutrophiler Granulozyt', 'Neutrophile haben einen segmentierten Kern.'], ['Thrombozyt', 'Thrombozyten sind kleine, kernlose Fragmente.']],
    'Monozyten sind die größten Blutzellen; im Gewebe werden sie zu Makrophagen.'),
  hs('hs-arterie', 'blut-gefaesse', 1, 'h-arterie', ['h-arterie', 'h-vene', 'h-arterie-elastisch', 'h-kapillare'],
    [['rundes Lumen', true], ['dicke Media aus zirkulären glatten Muskelzellen', true], ['gewellte Membrana elastica interna', true], ['weites, kollabiertes Lumen', false, 'Das spricht für eine Vene.'], ['viele parallele elastische Membranen in der Media', false, 'Das ist typisch für eine Arterie vom elastischen Typ.']],
    ['Regulation der Durchblutung durch Änderung des Durchmessers', 'Windkesselfunktion', 'Stoffaustausch mit dem Gewebe'],
    'Arterie vom muskulären Typ: rundes Lumen, dicke Media aus glatter Muskulatur, gewellte Membrana elastica interna. Sie reguliert über ihren Durchmesser die Durchblutung.', [['arterie'], ['media', 'muskul'], ['elastica', 'elastisch']]),
  hs('hs-aorta', 'blut-gefaesse', 0, 'h-arterie-elastisch', ['h-arterie-elastisch', 'h-arterie', 'h-vene', 'h-knorpel-elastisch'],
    [['viele parallele, gewellte elastische Membranen in der Media', true], ['Vasa vasorum in der Adventitia', true], ['Endothel an der Oberfläche', true], ['Chondrozyten in Lakunen', false, 'Das wäre Knorpel.'], ['dünne Media mit weitem Lumen', false, 'Das spricht für eine Vene.']],
    ['Windkesselfunktion', 'Regulation der Durchblutung durch Änderung des Durchmessers', 'Blutspeicher mit Klappen'],
    'Arterie vom elastischen Typ (z. B. Aorta): Media aus vielen gefensterten elastischen Membranen, Vasa vasorum in der Adventitia. Funktion: Windkessel.', [['elastisch'], ['aorta', 'windkessel'], ['membran', 'lamell']]),
  hs('hs-vene', 'blut-gefaesse', 1, 'h-vene', ['h-vene', 'h-arterie', 'h-kapillare', 'h-bindegewebe-locker'],
    [['weites, unregelmäßiges Lumen mit Blut', true], ['dünne Media', true], ['breite Adventitia', true], ['Klappe als Intimafalte', true], ['dicke Media mit gewellter Membrana elastica interna', false, 'Das spricht für eine Arterie.']],
    ['Rücktransport und Speicherung von Blut', 'Windkesselfunktion', 'Stoffaustausch mit dem Gewebe'],
    'Vene: dünnwandig mit weitem, oft kollabiertem Lumen, schwacher Media und breiter Adventitia; Klappen verhindern den Rückfluss.', [['vene'], ['dünn', 'schwach'], ['lumen', 'weit']]),
  hs('hs-kapillare', 'blut-gefaesse', 2, 'h-kapillare', ['h-kapillare', 'h-vene', 'h-arterie', 'h-platten-ein'],
    [['Gefäße mit kaum mehr als einem Erythrozyten Durchmesser', true], ['Wand nur aus Endothel', true], ['Erythrozyten hintereinander im Lumen', true], ['Tunica media aus glatter Muskulatur', false, 'Kapillaren haben keine Media.']],
    ['Stoffaustausch zwischen Blut und Gewebe', 'Regulation der Durchblutung durch Änderung des Durchmessers', 'Windkesselfunktion'],
    'Kapillaren: Wand aus Endothel, Basalmembran und Perizyten; Durchmesser etwa ein Erythrozyt. Ort des Stoffaustauschs.', [['kapillar'], ['endothel'], ['austausch', 'erythrozyt']]),
  hs('hs-neutrophil', 'blut-gefaesse', 3, 'h-neutrophil', ['h-neutrophil', 'h-eosinophil', 'h-lymphozyt', 'h-monozyt'],
    [['Kern mit mehreren Segmenten', true], ['blasses Zytoplasma mit feinen Granula', true], ['grobe rot-orange Granula', false, 'Das spricht für einen eosinophilen Granulozyten.'], ['runder Kern mit schmalem blauem Saum', false, 'Das ist ein Lymphozyt.']],
    ['Phagozytose von Bakterien (unspezifische Abwehr)', 'Abwehr von Parasiten', 'Sauerstofftransport'],
    'Neutrophiler Granulozyt: häufigster Leukozyt, segmentierter Kern, blasses Zytoplasma. Phagozytiert Bakterien.', [['neutrophil'], ['segment'], ['phagozyt', 'bakteri']]),
  hs('hs-eosinophil', 'blut-gefaesse', 3, 'h-eosinophil', ['h-eosinophil', 'h-basophil', 'h-neutrophil', 'h-monozyt'],
    [['meist zweilappiger Kern', true], ['grobe rot-orange Granula', true], ['dunkelviolette Granula verdecken den Kern', false, 'Das spricht für einen basophilen Granulozyten.'], ['nierenförmiger Kern', false, 'Das spricht für einen Monozyten.']],
    ['Abwehr von Parasiten, Beteiligung an Allergien', 'Phagozytose von Bakterien (unspezifische Abwehr)', 'Blutstillung'],
    'Eosinophiler Granulozyt: zweilappiger Kern, grobe eosinophile Granula; vermehrt bei Allergien und Wurmbefall.', [['eosinophil'], ['zweilapp', 'zwei'], ['granula', 'parasit', 'allerg']]),
  hs('hs-lymphozyt', 'blut-gefaesse', 3, 'h-lymphozyt', ['h-lymphozyt', 'h-monozyt', 'h-erythrozyt', 'h-neutrophil'],
    [['runder, dichter Kern', true], ['schmaler blauer Zytoplasmasaum', true], ['etwa so groß wie ein Erythrozyt', true], ['nierenförmiger Kern', false, 'Das ist ein Monozyt.'], ['kernlos', false, 'Kernlos sind Erythrozyten und Thrombozyten.']],
    ['spezifische Abwehr', 'Sauerstofftransport', 'Blutstillung'],
    'Kleiner Lymphozyt: runder, dunkler Kern mit schmalem Zytoplasmasaum, etwa erythrozytengroß. Zuständig für die spezifische Abwehr.', [['lymphozyt'], ['rund'], ['saum', 'schmal']]),

  // ============================================================ Haut und Drüsen
  od('a2-hd-epidermis', 'haut-druesen', 0, L, 'Ordne die Schichten der Epidermis der Leistenhaut von innen nach außen.', ['Stratum basale', 'Stratum spinosum', 'Stratum granulosum', 'Stratum lucidum', 'Stratum corneum'],
    'Die Zellen entstehen basal und wandern nach außen, wo sie verhornen und abschilfern.'),
  sc('a2-hd-dermis', 'haut-druesen', 0, 'wissen', 'gewebe', L, 'Welches Gewebe bildet das Stratum reticulare der Dermis?',
    'straffes geflechtartiges Bindegewebe', [['lockeres Bindegewebe', 'Das bildet das Stratum papillare.'], ['Fettgewebe', 'Fettgewebe ist typisch für die Subkutis.'], ['mehrschichtiges Plattenepithel', 'Das ist die Epidermis.']],
    'Das Stratum reticulare gibt der Haut ihre Reißfestigkeit; das Stratum papillare verzahnt sich mit der Epidermis.'),
  mc('a2-hd-leiste', 'haut-druesen', 1, L, 'Was gilt für die Leistenhaut (Handflächen, Fußsohlen)?',
    ['Sie hat ein Stratum lucidum.', 'Sie hat eine dicke Hornschicht.', 'Sie besitzt ekkrine Schweißdrüsen.'],
    [['Sie enthält viele Haare und Talgdrüsen.', 'Haare und Talgdrüsen fehlen in der Leistenhaut.'], ['Ihre Epidermis ist einschichtig.', 'Die Epidermis ist immer mehrschichtig verhornt.']],
    'Leistenhaut: dick, mit Stratum lucidum und Papillarleisten, ohne Haare und Talgdrüsen.', 'merkmal'),
  mt('a2-hd-sekretion', 'haut-druesen', 2, L, 'Ordne jedem Sekretionsmodus ein Beispiel zu.', [['merokrin (ekkrin)', 'Schweißdrüse der Haut'], ['apokrin', 'Duftdrüse der Achsel'], ['holokrin', 'Talgdrüse']],
    'Holokrin: Die ganze Zelle wird zum Sekret. Apokrin: Ein Zytoplasmateil wird abgeschnürt. Merokrin: Exozytose.', 'wissen'),
  sc('a2-hd-seroes', 'haut-druesen', 3, 'anwendung', 'merkmal', L, 'Endstücke mit engem Lumen, runden Kernen und kräftig angefärbtem, basophilem Zytoplasma – was liegt vor?',
    'seröse Endstücke', [['muköse Endstücke', 'Muköse Endstücke haben ein weites Lumen, helles Zytoplasma und flache, basale Kerne.'], ['Talgdrüse', 'Talgdrüsenzellen sind hell und schaumig und füllen das Endstück ganz aus.'], ['Ausführungsgang', 'Gänge haben kein sezernierendes Epithel dieser Art.']],
    'Serös: eiweißreiches Sekret (z. B. Parotis); das raue ER macht das Zytoplasma basophil.'),
  sc('a2-hd-endokrin', 'haut-druesen', 3, 'verstaendnis', 'begriff', L, 'Was unterscheidet eine endokrine von einer exokrinen Drüse?',
    'Endokrine Drüsen haben keinen Ausführungsgang und geben ihr Sekret ins Blut ab.', [['Endokrine Drüsen geben ihr Sekret auf die Haut ab.', 'Das tun exokrine Drüsen, z. B. Schweißdrüsen.'], ['Endokrine Drüsen sind immer holokrin.', 'Der Sekretionsmodus ist davon unabhängig.'], ['Exokrine Drüsen haben fenestrierte Kapillaren statt eines Gangs.', 'Das ist umgekehrt typisch für endokrine Drüsen.']],
    'Exokrin: Ausführungsgang zu einer Oberfläche. Endokrin: Hormone ins Blut, deshalb dichtes Netz fenestrierter Kapillaren.'),
  hs('hs-leistenhaut', 'haut-druesen', 1, 'h-leistenhaut', ['h-leistenhaut', 'h-felderhaut', 'h-platten-mehr', 'h-verhornt'],
    [['sehr dicke Hornschicht', true], ['helles Stratum lucidum unter der Hornschicht', true], ['Schweißdrüsengang durch die Epidermis', true], ['Haarfollikel mit Talgdrüse', false, 'Haare und Talgdrüsen fehlen in der Leistenhaut.'], ['Zellen behalten an der Oberfläche ihre Kerne', false, 'Das spricht für unverhorntes Plattenepithel.']],
    ['Schutz bei starker mechanischer Belastung, Griffigkeit', 'Wärmeregulation durch Haare', 'Resorption'],
    'Leistenhaut: dicke Hornschicht, Stratum lucidum, Schweißdrüsen, keine Haare. Vorkommen an Handflächen und Fußsohlen.', [['leistenhaut', 'handfläche', 'fußsohle'], ['lucidum'], ['horn']]),
  hs('hs-felderhaut', 'haut-druesen', 1, 'h-felderhaut', ['h-felderhaut', 'h-leistenhaut', 'h-platten-mehr', 'h-bindegewebe-locker'],
    [['dünne Hornschicht', true], ['Haar im Haarfollikel', true], ['Talgdrüse am Follikel', true], ['M. arrector pili', true], ['Stratum lucidum', false, 'Das gibt es nur in der Leistenhaut.']],
    ['Schutz der Körperoberfläche, Wärmeregulation', 'Griffigkeit an Handflächen und Fußsohlen', 'Gasaustausch'],
    'Felderhaut: dünnere Epidermis ohne Stratum lucidum, mit Haarfollikeln, Talgdrüsen (holokrin) und M. arrector pili.', [['felderhaut', 'behaart'], ['haar', 'follikel'], ['talg']]),
  hs('hs-seroes', 'haut-druesen', 3, 'h-seroes', ['h-seroes', 'h-mukoes', 'h-iso', 'h-schweissdruese'],
    [['enges Lumen', true], ['runde Kerne', true], ['basophiles, körniges Zytoplasma', true], ['helles, wabiges Zytoplasma', false, 'Das spricht für muköse Endstücke.']],
    ['Bildung eines dünnflüssigen, eiweißreichen Sekrets', 'Bildung von Schleim', 'Wärmeregulation'],
    'Seröse Drüse: Azini mit engem Lumen, runden Kernen und basophilem Zytoplasma; eiweiß- und enzymreiches Sekret (z. B. Parotis, Pankreas).', [['serös', 'seroes'], ['lumen', 'eng'], ['eiweiß', 'enzym', 'basophil']]),
  hs('hs-mukoes', 'haut-druesen', 3, 'h-mukoes', ['h-mukoes', 'h-seroes', 'h-fett', 'h-schweissdruese'],
    [['weites Lumen', true], ['helles, wabiges Zytoplasma', true], ['flache, an den Rand gedrückte basale Kerne', true], ['kräftig basophiles Zytoplasma', false, 'Das spricht für seröse Endstücke.']],
    ['Bildung von Schleim', 'Bildung eines dünnflüssigen, eiweißreichen Sekrets', 'Energiespeicher'],
    'Muköse Drüse: tubulöse Endstücke mit weitem Lumen, hellem Zytoplasma und flachen basalen Kernen; bildet Schleim, der sich in H.E. kaum anfärbt.', [['mukös', 'mukoes', 'schleim'], ['hell', 'wabig'], ['kern', 'flach', 'basal']]),

  // ============================================================ Rumpfwand
  mt('a2-rw-abschnitte', 'rumpfwand', 0, P, 'Ordne die Abschnitte der Wirbelsäule ihrer Wirbelzahl und Krümmung zu.', [['Halswirbelsäule', '7 Wirbel, Lordose'], ['Brustwirbelsäule', '12 Wirbel, Kyphose'], ['Lendenwirbelsäule', '5 Wirbel, Lordose'], ['Kreuzbein', '5 verschmolzene Wirbel, Kyphose']],
    '7 – 12 – 5; Lordose = nach vorn konvex, Kyphose = nach hinten konvex.', 'wissen'),
  sc('a2-rw-atlas', 'rumpfwand', 1, 'wissen', 'struktur', P, 'Welcher Wirbel hat keinen Wirbelkörper?',
    'der Atlas (1. Halswirbel)', [['der Axis (2. Halswirbel)', 'Der Axis hat einen Körper mit dem Dens.'], ['der 7. Halswirbel', 'Er ist an seinem langen Dornfortsatz erkennbar, hat aber einen Körper.'], ['der 5. Lendenwirbel', 'Lendenwirbel haben die größten Wirbelkörper.']],
    'Der Atlas ist ein Ring aus vorderem und hinterem Bogen; der Dens des Axis ragt in ihn hinein.'),
  sc('a2-rw-vorfall', 'rumpfwand', 1, 'anwendung', 'mechanismus', P, 'Was passiert bei einem Bandscheibenvorfall?',
    'Gewebe des Nucleus pulposus tritt durch einen Riss im Anulus fibrosus aus, meist nach hinten-seitlich.', [['Der Wirbelkörper bricht in sich zusammen.', 'Das wäre eine Wirbelkörperfraktur.'], ['Der Dornfortsatz bricht ab.', 'Die Bandscheibe liegt zwischen den Wirbelkörpern, nicht am Bogen.'], ['Der Anulus fibrosus tritt in den Wirbelkanal.', 'Es ist der Gallertkern, der durch den Faserring austritt.']],
    'Nach hinten-seitlich liegt die Nervenwurzel – daher Schmerzen und Ausfälle im zugehörigen Dermatom.'),
  mt('a2-rw-rippen', 'rumpfwand', 2, P, 'Ordne die Rippengruppen zu.', [['Rippen 1–7', 'Costae verae: direkt am Sternum'], ['Rippen 8–10', 'Costae spuriae: über den Rippenbogen'], ['Rippen 11–12', 'Costae fluctuantes: enden frei']],
    '12 Rippenpaare; nur die oberen 7 erreichen das Brustbein mit eigenem Knorpel.', 'wissen'),
  sc('a2-rw-angulus', 'rumpfwand', 2, 'anwendung', 'struktur', P, 'Welche Rippe setzt auf Höhe des tastbaren Angulus sterni an?',
    'die 2. Rippe', [['die 1. Rippe', 'Die 1. Rippe liegt unter dem Schlüsselbein und ist schlecht tastbar.'], ['die 4. Rippe', 'Von der 2. Rippe aus zählt man nach unten weiter.'], ['die 7. Rippe', 'Die 7. Rippe setzt am unteren Corpus sterni an.']],
    'Angulus sterni = Übergang Manubrium/Corpus; dort setzt die 2. Rippe an – Ausgangspunkt zum Abzählen.'),
  sc('a2-rw-phrenicus', 'rumpfwand', 3, 'wissen', 'struktur', P, 'Welcher Nerv innerviert das Zwerchfell?',
    'N. phrenicus aus C3–C5', [['Nn. intercostales Th1–Th11', 'Sie versorgen die Zwischenrippenmuskeln.'], ['N. vagus', 'Der N. vagus versorgt vegetativ die Eingeweide, nicht den Zwerchfellmuskel.'], ['N. thoracicus longus', 'Er versorgt den M. serratus anterior.']],
    'Der N. phrenicus kommt aus dem Halsbereich (C3–C5) – deshalb kann eine hohe Halsmarkverletzung die Atmung lähmen.'),
  mc('a2-rw-bauch', 'rumpfwand', 3, P, 'Welche Muskeln bilden die seitliche Bauchwand?',
    ['M. obliquus externus abdominis', 'M. obliquus internus abdominis', 'M. transversus abdominis'],
    [['M. rectus abdominis', 'Er liegt vorne neben der Mittellinie in der Rektusscheide.'], ['M. latissimus dorsi', 'Ein Rückenmuskel, der zum Oberarm zieht.']],
    'Drei Schichten mit unterschiedlicher Faserrichtung; ihre Aponeurosen bilden die Rektusscheide und die Linea alba.', 'struktur'),
  lb('a2-rw-label', 'rumpfwand', 1, 'spine', P, ['r-wirbelkoerper', 'r-foramen', 'r-dornfortsatz', 'r-querfortsatz', 'r-anulus', 'r-nucleus'],
    'Wirbelkörper vorne, Bogen und Fortsätze hinten; Bandscheibe aus Faserring und Gallertkern.'),
  lb('a2-rw-label2', 'rumpfwand', 2, 'trunk', P, ['t-manubrium', 't-costae-verae', 't-costae-spuriae', 't-zwerchfell', 't-rectus', 't-linea-alba'],
    'Echte Rippen direkt am Sternum, falsche über den Rippenbogen.'),

  // ============================================================ Obere Extremität
  od('a2-oe-handwurzel', 'obere-extremitaet', 0, P, 'Ordne die proximale Reihe der Handwurzelknochen von der Daumen- zur Kleinfingerseite.', ['Os scaphoideum', 'Os lunatum', 'Os triquetrum', 'Os pisiforme'],
    'Merkspruch: „Ein Kahn, der fuhr im Mondenschein dreieckig um das Erbsenbein …“'),
  od('a2-oe-handwurzel2', 'obere-extremitaet', 0, P, 'Ordne die distale Reihe der Handwurzelknochen von der Daumen- zur Kleinfingerseite.', ['Os trapezium', 'Os trapezoideum', 'Os capitatum', 'Os hamatum'],
    '„… Vieleck groß und Vieleck klein, ein Kopf, der muss beim Haken sein.“'),
  sc('a2-oe-schulter', 'obere-extremitaet', 1, 'verstaendnis', 'mechanismus', P, 'Warum luxiert das Schultergelenk häufiger als das Hüftgelenk?',
    'Die Pfanne ist klein und flach; das Gelenk wird vor allem durch Muskeln gesichert.', [['Es ist ein Scharniergelenk.', 'Das Schultergelenk ist ein Kugelgelenk.'], ['Es hat keine Gelenkkapsel.', 'Es hat eine weite, schlaffe Kapsel.'], ['Es wird von besonders kräftigen Bändern gehalten.', 'Das gilt für das Hüftgelenk.']],
    'Beweglichkeit gegen Stabilität: Die Schulter ist muskelgeführt (Rotatorenmanschette), die Hüfte knochen- und bandgeführt.'),
  mt('a2-oe-rotatoren', 'obere-extremitaet', 2, P, 'Ordne die Muskeln der Rotatorenmanschette ihrer Hauptfunktion zu.', [['M. supraspinatus', 'Abduktion (Beginn)'], ['M. infraspinatus', 'Außenrotation'], ['M. teres minor', 'Außenrotation'], ['M. subscapularis', 'Innenrotation']],
    'Gemeinsam zentrieren sie den Humeruskopf in der Pfanne.', 'wissen'),
  mt('a2-oe-ausfall', 'obere-extremitaet', 3, P, 'Ordne jedem Nerv sein typisches Ausfallbild zu.', [['N. radialis', 'Fallhand'], ['N. medianus', 'Schwurhand'], ['N. ulnaris', 'Krallenhand'], ['N. axillaris', 'Schwäche der Abduktion im Schultergelenk']],
    'Radialis = Strecker, Medianus = Beuger und Daumenballen, Ulnaris = kleine Handmuskeln, Axillaris = Deltoideus.', 'anwendung'),
  sc('a2-oe-bizeps', 'obere-extremitaet', 3, 'wissen', 'struktur', P, 'Welcher Nerv innerviert den M. biceps brachii?',
    'N. musculocutaneus', [['N. medianus', 'Er versorgt die Beuger am Unterarm, nicht am Oberarm.'], ['N. radialis', 'Er versorgt die Strecker, z. B. den Trizeps.'], ['N. axillaris', 'Er versorgt den M. deltoideus.']],
    'Alle Beuger an der Vorderseite des Oberarms: N. musculocutaneus.'),
  sc('a2-oe-karpal', 'obere-extremitaet', 3, 'anwendung', 'struktur', P, 'Welcher Nerv wird beim Karpaltunnelsyndrom eingeengt?',
    'N. medianus', [['N. ulnaris', 'Der N. ulnaris zieht außerhalb des Karpaltunnels zur Hand.'], ['N. radialis', 'Sein oberflächlicher Ast verläuft am Handrücken.'], ['N. musculocutaneus', 'Er endet als Hautnerv am Unterarm.']],
    'Im Karpaltunnel liegen der N. medianus und die langen Fingerbeugesehnen.'),
  lb('a2-oe-label', 'obere-extremitaet', 0, 'arm', P, ['o-scaphoid', 'o-lunatum', 'o-trapezium', 'o-capitatum', 'o-hamatum', 'o-metacarpalia'],
    'Proximale Reihe: Kahn-, Mond-, Dreiecks-, Erbsenbein. Distale Reihe: großes und kleines Vieleckbein, Kopf-, Hakenbein.'),
  lb('a2-oe-label2', 'obere-extremitaet', 3, 'arm', P, ['o-n-axillaris', 'o-n-radialis', 'o-n-medianus', 'o-n-ulnaris', 'b-humerus'],
    'Ulnaris medial am Ellenbogen, Medianus in der Mitte zum Karpaltunnel, Radialis um die Rückseite des Humerus.'),

  // ============================================================ Untere Extremität
  mc('a2-ue-coxae', 'untere-extremitaet', 0, P, 'Welche Knochen bilden gemeinsam das Hüftbein (Os coxae)?',
    ['Os ilium', 'Os ischii', 'Os pubis'],
    [['Os sacrum', 'Das Kreuzbein gehört zur Wirbelsäule und bildet mit den Hüftbeinen den Beckenring.'], ['Femur', 'Der Femurkopf sitzt in der Hüftpfanne, gehört aber nicht zum Hüftbein.']],
    'Darm-, Sitz- und Schambein verschmelzen in der Hüftpfanne (Acetabulum).', 'struktur'),
  sc('a2-ue-fusswurzel', 'untere-extremitaet', 0, 'wissen', 'struktur', P, 'Wie viele Fußwurzelknochen hat ein Fuß?',
    '7', [['8', 'Acht Knochen hat die Handwurzel.'], ['5', 'Fünf sind die Mittelfußknochen.'], ['14', 'So viele Zehenknochen hat ein Fuß.']],
    'Talus, Calcaneus, Os naviculare, Os cuboideum und drei Ossa cuneiformia.'),
  sc('a2-ue-meniskus', 'untere-extremitaet', 1, 'verstaendnis', 'mechanismus', P, 'Warum wird der Innenmeniskus häufiger verletzt als der Außenmeniskus?',
    'Er ist mit dem Innenband verwachsen und deshalb weniger beweglich.', [['Er ist aus hyalinem Knorpel und daher spröde.', 'Menisken bestehen aus Faserknorpel.'], ['Er ist kleiner und dünner.', 'Er ist C-förmig und größer im Umfang; entscheidend ist die Fixierung.'], ['Er hat keinen Kontakt zur Tibia.', 'Beide Menisken liegen auf der Tibia.']],
    'Weniger Ausweichmöglichkeit bei Drehbewegungen unter Last → häufigere Risse.'),
  mt('a2-ue-baender', 'untere-extremitaet', 1, P, 'Ordne jedem Band des Kniegelenks seine Hauptfunktion zu.', [['vorderes Kreuzband', 'verhindert das Vorgleiten der Tibia'], ['hinteres Kreuzband', 'verhindert das Zurückgleiten der Tibia'], ['Innenband', 'sichert gegen X-Bein-Belastung'], ['Außenband', 'sichert gegen O-Bein-Belastung']],
    'Schubladentest: vordere Schublade spricht für einen Riss des vorderen Kreuzbands.', 'verstaendnis'),
  mt('a2-ue-muskeln', 'untere-extremitaet', 2, P, 'Ordne die Muskeln ihrer Funktion zu.', [['M. quadriceps femoris', 'Kniestreckung'], ['M. glutaeus maximus', 'Hüftstreckung'], ['M. glutaeus medius', 'Abduktion, hält das Becken waagerecht'], ['M. triceps surae', 'Plantarflexion'], ['M. tibialis anterior', 'Fußheben (Dorsalextension)']],
    'Der Ausfall des M. glutaeus medius zeigt sich als Trendelenburg-Zeichen.', 'wissen'),
  mt('a2-ue-nerven', 'untere-extremitaet', 3, P, 'Ordne jedem Nerv seinen typischen Ausfall zu.', [['N. fibularis communis', 'Fallfuß, Steppergang'], ['N. tibialis', 'kein Zehenspitzenstand'], ['N. femoralis', 'Kniestreckung schwach, Patellarsehnenreflex fehlt'], ['N. glutaeus superior', 'Trendelenburg-Zeichen']],
    'Der N. fibularis ist am Fibulaköpfchen besonders gefährdet.', 'anwendung'),
  sc('a2-ue-fibularis', 'untere-extremitaet', 3, 'anwendung', 'struktur', P, 'An welcher Stelle ist der N. fibularis communis besonders druckgefährdet?',
    'am Fibulaköpfchen', [['in der Leiste', 'Dort verläuft der N. femoralis.'], ['hinter dem Innenknöchel', 'Dort verläuft der N. tibialis.'], ['am Trochanter major', 'Der N. ischiadicus liegt weiter medial und tief.']],
    'Er windet sich direkt unter der Haut um das Fibulaköpfchen – zu enge Gipsverbände können ihn schädigen.'),
  lb('a2-ue-label', 'untere-extremitaet', 0, 'leg', P, ['u-ilium', 'u-pubis', 'u-femurkopf', 'k-patella', 'k-fibula', 'u-calcaneus'],
    'In der Ansicht von vorne liegt die Fibula lateral, die Tibia medial.'),
  lb('a2-ue-label2', 'untere-extremitaet', 1, 'knee', P, ['kn-meniskus-medial', 'kn-meniskus-lateral', 'kn-lca', 'kn-lcp', 'kn-innenband'],
    'Innenmeniskus C-förmig, Außenmeniskus fast kreisrund. Vorderes Kreuzband vorne an der Tibia, hinteres hinten.'),
  lb('a2-ue-label3', 'untere-extremitaet', 3, 'leg', P, ['u-n-femoralis', 'u-n-ischiadicus', 'u-n-tibialis', 'u-n-fibularis'],
    'Der N. ischiadicus teilt sich oberhalb der Kniekehle in N. tibialis und N. fibularis communis.'),
];
