import type { ChoiceOption, ErrorCategory, LabelFigure, Task, TaskLevel } from './types';
import { ANATOMY_LESSONS } from './anatomy1';

// Aufgaben Anatomie I. Selbst formulierte Übungsfragen nach Lehrbuchstandard – keine Originalfragen aus Leipziger Testaten.

const S = 'zu_pruefen' as const;
function O(lesson: string, i: number): string {
  const l = ANATOMY_LESSONS.find((x) => x.id === lesson);
  if (!l || !l.objectives[i]) throw new Error(`Lernziel ${lesson}[${i}] fehlt`);
  return l.objectives[i];
}
const src = (id: string, locator?: string) => [{ id, ...(locator ? { locator } : {}) }];

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

export const TASKS_4: Task[] = [
  // ============================================================ Allgemeine Anatomie
  od('a1-ebenen-org', 'allgemeine-anatomie', 0, 'schuenke', 'Ordne die Organisationsebenen des Körpers vom Kleinsten zum Größten.',
    ['Zelle', 'Gewebe', 'Organ', 'Organsystem', 'Organismus'], 'Gleichartige Zellen bilden Gewebe, mehrere Gewebe ein Organ, zusammenarbeitende Organe ein Organsystem.'),
  sc('a1-grundgewebe', 'allgemeine-anatomie', 0, 'wissen', 'begriff', 'schuenke', 'Welche Aufzählung nennt die vier Grundgewebe?',
    'Epithelgewebe, Binde- und Stützgewebe, Muskelgewebe, Nervengewebe',
    [['Epithelgewebe, Knochengewebe, Blut, Fettgewebe', 'Knochen, Blut und Fett gehören alle zu den Binde- und Stützgeweben.'],
     ['Haut, Muskeln, Knochen, Nerven', 'Haut und Knochen sind Organe aus mehreren Geweben, keine Grundgewebe.']],
    'Alle Organe sind aus diesen vier Grundgeweben aufgebaut – das ist auch die Gliederung der Histologie im 1. Semester.'),
  mt('a1-regionen', 'allgemeine-anatomie', 1, 'schuenke', 'Ordne die lateinischen Bezeichnungen den Körperregionen zu.',
    [['Caput', 'Kopf'], ['Collum', 'Hals'], ['Truncus', 'Rumpf'], ['Dorsum', 'Rücken'], ['Membrum superius', 'Obere Extremität']],
    'Der Rumpf gliedert sich weiter in Thorax, Abdomen, Pelvis und Dorsum.', 'wissen', 'begriff'),
  mt('a1-ebene-achse', 'allgemeine-anatomie', 2, 'schuenke', 'Welche beiden Achsen spannen die jeweilige Ebene auf?',
    [['Sagittalebene', 'Longitudinal- und Sagittalachse'], ['Frontalebene', 'Longitudinal- und Transversalachse'], ['Transversalebene', 'Sagittal- und Transversalachse']],
    'Sagittal- und Transversalebene enthalten ihre namensgebende Achse; die Frontalebene liegt parallel zur Stirn (Frons) und enthält keine Sagittalachse.', 'verstaendnis', 'verwechslung'),
  sc('a1-frontal', 'allgemeine-anatomie', 2, 'verstaendnis', 'verwechslung', 'schuenke', 'Ein Schnitt trennt den Körper in eine vordere und eine hintere Hälfte. Welche Ebene ist das?',
    'Frontalebene', [['Sagittalebene', 'Die Sagittalebene trennt rechts von links.'], ['Transversalebene', 'Die Transversalebene trennt oben von unten.']],
    'Frontal- oder Koronarebene: parallel zur Stirn, senkrecht zur Sagittalachse.'),
  sc('a1-flexion', 'allgemeine-anatomie', 2, 'anwendung', 'verwechslung', 'schuenke', 'Um welche Achse findet die Beugung (Flexion) im Ellenbogengelenk statt?',
    'Um die Transversalachse', [['Um die Sagittalachse', 'Um die Sagittalachse laufen Ab- und Adduktion.'], ['Um die Longitudinalachse', 'Um die Längsachse wird rotiert, nicht gebeugt.']],
    'Flexion und Extension laufen in der Sagittalebene um eine quer liegende Achse.'),
  sc('a1-radius', 'allgemeine-anatomie', 3, 'anwendung', 'verwechslung', 'schuenke', 'Welche Aussage über die Unterarmknochen in anatomischer Normalstellung ist richtig?',
    'Der Radius liegt lateral der Ulna.', [['Der Radius liegt medial der Ulna.', 'In Normalstellung zeigen die Handflächen nach vorn; der Radius liegt auf der Daumenseite, also lateral.', 'richtung'],
      ['Radius und Ulna liegen hintereinander (ventral/dorsal).', 'Sie liegen nebeneinander; in Pronation kreuzt der Radius allerdings über die Ulna.']],
    'Merkhilfe: Radius – Daumen; Ulna – Kleinfinger. Beim Unterschenkel liegt die Fibula lateral der Tibia.'),
  lb('a1-label-body', 'allgemeine-anatomie', 3, 'body', 'schuenke', ['k-clavicula', 'k-sternum', 'k-becken', 'k-femur', 'k-patella', 'k-fibula'],
    'Brustbein in der Mitte, Schlüsselbeine lateral davon; am Bein Femur → Patella vor dem Knie → Tibia medial und Fibula lateral.'),

  // ============================================================ Embryologie
  od('e1-woche1', 'embryologie', 0, 'sadler', 'Bringe die Ereignisse der ersten Entwicklungswoche in die richtige Reihenfolge.',
    ['Befruchtung in der Ampulle des Eileiters', 'Zygote', 'Furchungsteilungen', 'Morula', 'Blastozyste', 'Beginn der Implantation'],
    'Befruchtung → Zygote → Furchung (Teilung ohne Wachstum) → Morula (≈ Tag 3–4) → Blastozyste (≈ Tag 4–5) → Einnistung ab etwa Tag 6.'),
  sc('e1-ort', 'embryologie', 0, 'wissen', 'begriff', 'sadler', 'Wo findet die Befruchtung normalerweise statt?',
    'In der Ampulle des Eileiters', [['In der Uterushöhle', 'Dort nistet sich erst die Blastozyste ein, einige Tage später.'], ['Im Ovar', 'Aus dem Ovar wird die Eizelle beim Eisprung entlassen und vom Eileiter aufgenommen.']],
    'Die Zygote wandert während der Furchung durch den Eileiter zum Uterus.'),
  sc('e1-blasto', 'embryologie', 0, 'verstaendnis', 'verwechslung', 'sadler', 'Aus welchem Teil der Blastozyste geht der Embryo hervor?',
    'Aus dem Embryoblast (innere Zellmasse)', [['Aus dem Trophoblast', 'Der Trophoblast bildet den embryonalen Anteil der Plazenta.'], ['Aus dem Dottersack', 'Der Dottersack entsteht erst in der 2. Woche aus dem Hypoblast.', 'reihenfolge']],
    'Embryoblast → Embryo (und Amnion); Trophoblast → Plazenta, Synzytiotrophoblast bildet hCG.'),
  mt('e1-woche2', 'embryologie', 1, 'sadler', 'Ordne die Strukturen der 2. Woche richtig zu.',
    [['Epiblast', 'obere Schicht der Keimscheibe, an die Amnionhöhle grenzend'], ['Hypoblast', 'untere Schicht der Keimscheibe, an den Dottersack grenzend'], ['Synzytiotrophoblast', 'bildet hCG und dringt in die Uterusschleimhaut ein'], ['Amnionhöhle', 'flüssigkeitsgefüllter Raum über dem Epiblast']],
    'In der 2. Woche wird „in Zweien“ gebaut: zwei Keimblätter, zwei Höhlen, zwei Trophoblastschichten.'),
  sc('e1-gastrulation', 'embryologie', 2, 'verstaendnis', 'mechanismus', 'sadler', 'Was geschieht bei der Gastrulation in der 3. Woche?',
    'Epiblastzellen wandern am Primitivstreifen ein und bilden Mesoderm und Entoderm; der Rest des Epiblasten wird Ektoderm.',
    [['Der Hypoblast teilt sich in Ektoderm und Mesoderm.', 'Alle drei endgültigen Keimblätter stammen aus dem Epiblast; der Hypoblast wird verdrängt.'],
     ['Das Neuralrohr schließt sich.', 'Die Neurulation folgt erst auf die Gastrulation (Ende 3./4. Woche).', 'reihenfolge']],
    'Gastrulation = Entstehung der dreiblättrigen Keimscheibe. Gleichzeitig bildet sich die Chorda dorsalis.'),
  mt('e1-keimblatt', 'embryologie', 3, 'sadler', 'Aus welchem Keimblatt bzw. welcher Anlage stammt die Struktur?',
    [['Epidermis', 'Ektoderm'], ['Skelettmuskulatur', 'Mesoderm'], ['Epithel des Darms', 'Entoderm'], ['Spinalganglien', 'Neuralleiste']],
    'Merkhilfe: Ektoderm = außen (Haut, Nervensystem), Mesoderm = Mitte (Stütz- und Bewegungsapparat, Herz, Blut), Entoderm = innen (Epithelien von Darm und Atemwegen).', 'anwendung'),
  sc('e1-nebenniere', 'embryologie', 3, 'analyse', 'verwechslung', 'sadler', 'Welche Zuordnung ist richtig?',
    'Nebennierenmark – Neuralleiste; Nebennierenrinde – Mesoderm', [['Nebennierenmark und -rinde – Entoderm', 'Die Nebenniere ist kein Darmabkömmling.'], ['Nebennierenmark – Mesoderm; Nebennierenrinde – Neuralleiste', 'Genau vertauscht: Das Mark besteht aus umgewandelten sympathischen Neuronen.']],
    'Die Markzellen sind modifizierte postganglionäre Sympathikusneurone – deshalb Neuralleiste.'),

  // ============================================================ Knochen
  mc('k1-funktionen', 'knochen', 0, 'schuenke', 'Welche Aufgaben erfüllt das Skelett? (Mehrere richtig)',
    ['Blutbildung im roten Knochenmark', 'Speicher für Calcium und Phosphat', 'Schutz innerer Organe', 'Hebel für die Muskulatur'],
    [['Bildung der Synovia', 'Die Synovia bildet die Membrana synovialis der Gelenkkapsel.']],
    'Stütze, Schutz, Bewegung, Mineralspeicher, Blutbildung.'),
  mt('k1-formen', 'knochen', 1, 'schuenke', 'Ordne jedem Knochen seine Form zu.',
    [['Femur', 'langer Knochen (Röhrenknochen)'], ['Os scaphoideum (Handwurzel)', 'kurzer Knochen'], ['Sternum', 'platter Knochen'], ['Wirbel', 'unregelmäßiger Knochen'], ['Patella', 'Sesambein']],
    'Lufthaltige Knochen (Ossa pneumatica) wie der Oberkiefer enthalten Nasennebenhöhlen.', 'wissen'),
  lb('k1-label-roehre', 'knochen', 2, 'bone', 'schuenke', ['a-epiphyse', 'a-epiphysenfuge', 'a-metaphyse', 'a-diaphyse', 'a-markhoehle', 'a-periost'],
    'Von außen nach innen: Gelenkende (Epiphyse) – Wachstumsfuge – Metaphyse – Schaft mit Markhöhle, außen vom Periost überzogen.'),
  lb('k1-label-gewebe', 'knochen', 2, 'bone', 'schuenke', ['a-gelenkknorpel', 'a-spongiosa', 'a-kompakta'],
    'Gelenkknorpel auf der Epiphyse, darunter Spongiosa; die Kompakta bildet die dicke Wand des Schafts.'),
  sc('k1-periost', 'knochen', 2, 'verstaendnis', 'begriff', 'schuenke', 'Welche Aussage über das Periost ist richtig?',
    'Es fehlt an den Gelenkflächen und ist reich an sensiblen Nerven.', [['Es überzieht auch die Gelenkflächen.', 'Auf den Gelenkflächen liegt Gelenkknorpel, ohne Periost und ohne Perichondrium.'],
      ['Es enthält keine Zellen, die Knochen bilden können.', 'Das Stratum osteogenicum enthält Osteoblasten-Vorläufer – wichtig für Dickenwachstum und Frakturheilung.']],
    'Periost = Stratum fibrosum + Stratum osteogenicum; Sharpey-Fasern verankern es im Knochen.'),
  sc('k1-desmal', 'knochen', 3, 'wissen', 'verwechslung', 'schuenke', 'Welcher Knochen entsteht überwiegend durch desmale Ossifikation?',
    'Schädeldach', [['Femur', 'Röhrenknochen entstehen chondral über ein Knorpelmodell.'], ['Wirbelkörper', 'Wirbel werden chondral angelegt.']],
    'Desmal (direkt aus Mesenchym): Schädeldach, große Teile des Gesichtsschädels, Clavicula zum großen Teil.'),
  od('k1-fuge', 'knochen', 3, 'luellmann', 'Ordne die Zonen der Epiphysenfuge von der Epiphyse zur Metaphyse.',
    ['Reservezone', 'Proliferationszone (Säulenknorpel)', 'Hypertrophiezone', 'Verkalkungs- und Eröffnungszone'],
    'Knorpelzellen teilen sich, werden groß, die Matrix verkalkt, dann sprossen Gefäße ein und Osteoblasten lagern Knochen an.'),
  sc('k1-wachstum', 'knochen', 3, 'analyse', 'mechanismus', 'schuenke', 'Ein 12-jähriges Kind wächst noch. Wodurch wird der Femur länger, wodurch dicker?',
    'Länger durch die Epiphysenfugen, dicker durch Anbau vom Periost aus.', [['Länger durch das Periost, dicker durch die Epiphysenfugen.', 'Vertauscht: Das Periost umgibt den Schaft und baut außen an.', 'verwechslung'],
      ['Länger durch Wachstum in der Mitte der Diaphyse.', 'Im Schaft gibt es kein Längenwachstum; die Fugen liegen zwischen Epiphyse und Metaphyse.']],
    'Nach Schluss der Fugen ist kein Längenwachstum mehr möglich; das Dickenwachstum und der Umbau gehen lebenslang weiter.'),

  // ============================================================ Gelenke
  mt('g1-syn', 'gelenke', 0, 'schuenke', 'Ordne jede Knochenverbindung ihrem Typ zu.',
    [['Membrana interossea des Unterarms', 'Syndesmose'], ['Epiphysenfuge', 'Synchondrose'], ['Os sacrum (verschmolzene Wirbel)', 'Synostose'], ['Schultergelenk', 'Diarthrose (echtes Gelenk)']],
    'Unechte Gelenke haben keinen Gelenkspalt; die Verbindung ist durchgehend.'),
  sc('g1-merkmal', 'gelenke', 0, 'verstaendnis', 'begriff', 'schuenke', 'Was unterscheidet ein echtes Gelenk grundsätzlich von einem unechten?',
    'Der Gelenkspalt mit Synovia innerhalb einer Gelenkkapsel', [['Dass es beweglich ist', 'Auch Syndesmosen und Synchondrosen erlauben etwas Bewegung, und manche echten Gelenke (Amphiarthrosen) kaum.'],
      ['Dass Knorpel beteiligt ist', 'Auch Synchondrosen bestehen aus Knorpel.']],
    'Diarthrose = Gelenkflächen, Gelenkhöhle, Kapsel; Synarthrose = durchgehende Verbindung.'),
  lb('g1-label', 'gelenke', 1, 'joint', 'schuenke', ['a-gelenkknorpel', 'g-gelenkhoehle', 'g-membrana-synovialis', 'g-membrana-fibrosa', 'g-ligament'],
    'Innen nach außen: Knorpelflächen und Gelenkspalt, Membrana synovialis, Membrana fibrosa, verstärkende Bänder.'),
  sc('g1-knorpel', 'gelenke', 1, 'verstaendnis', 'mechanismus', 'schuenke', 'Wie wird der Gelenkknorpel eines Erwachsenen hauptsächlich ernährt?',
    'Durch Diffusion aus der Synovia, gefördert durch Be- und Entlastung', [['Über Blutgefäße im Knorpel', 'Gelenkknorpel ist gefäßfrei.'],
      ['Über das Perichondrium', 'Gelenkknorpel besitzt kein Perichondrium.']],
    'Deshalb ist Bewegung für den Knorpel wichtig – und Knorpelschäden heilen schlecht.'),
  mt('g1-typen', 'gelenke', 2, 'schuenke', 'Ordne jedem Gelenk seinen Typ zu.',
    [['Schultergelenk', 'Kugelgelenk (3 Achsen)'], ['Daumensattelgelenk', 'Sattelgelenk (2 Achsen)'], ['Humeroulnargelenk', 'Scharniergelenk (1 Achse)'], ['Proximales Radioulnargelenk', 'Zapfengelenk (1 Achse)'], ['Proximales Handgelenk', 'Eigelenk (2 Achsen)']],
    'Die Form der Gelenkflächen bestimmt die Zahl der Bewegungsachsen.', 'anwendung'),
  sc('g1-hueft', 'gelenke', 2, 'wissen', 'verwechslung', 'schuenke', 'Wie viele Hauptachsen hat das Hüftgelenk?',
    'Drei – es ist ein Kugelgelenk.', [['Zwei – es ist ein Eigelenk.', 'Ei- und Sattelgelenke haben zwei Achsen, die Hüfte ist aber ein Kugelgelenk.'], ['Eine – es ist ein Scharniergelenk.', 'Scharniergelenk ist z. B. das Humeroulnargelenk.']],
    'Das Hüftgelenk erlaubt Flexion/Extension, Ab-/Adduktion und Rotation.'),
  mt('g1-bewegung', 'gelenke', 3, 'schuenke', 'Ordne die Bewegung der Achse zu, um die sie stattfindet.',
    [['Flexion / Extension', 'Transversalachse'], ['Abduktion / Adduktion', 'Sagittalachse'], ['Innen- / Außenrotation', 'Längsachse']],
    'Die Bewegung läuft jeweils in der Ebene senkrecht zu ihrer Achse.', 'anwendung'),
  sc('g1-abduktion', 'gelenke', 3, 'anwendung', 'richtung', 'schuenke', 'Kim hebt den gestreckten Arm seitlich bis zur Waagerechten. Welche Bewegung im Schultergelenk ist das?',
    'Abduktion (um die Sagittalachse)', [['Anteversion (Flexion)', 'Anteversion ist das Heben nach vorn um die Transversalachse.', 'verwechslung'], ['Adduktion', 'Adduktion führt den Arm zum Körper hin.']],
    'Ab-ducere = wegführen von der Körpermitte; die Bewegung läuft in der Frontalebene.'),

  // ============================================================ Muskellehre
  od('m1-huellen', 'muskellehre', 0, 'schuenke', 'Ordne die Bindegewebshüllen eines Skelettmuskels von innen nach außen.',
    ['Endomysium (um jede Muskelfaser)', 'Perimysium (um jedes Faserbündel)', 'Epimysium (um den ganzen Muskel)', 'Faszie'],
    'Endo = innen, Peri = um herum, Epi = darauf. Alle Hüllen setzen sich in die Sehne fort.'),
  lb('m1-label-x', 'muskellehre', 0, 'muscle-x', 'schuenke', ['m-endomysium', 'm-perimysium', 'm-epimysium', 'm-faszie'],
    'Faser im Endomysium, Bündel im Perimysium, Muskel im Epimysium, außen die Faszie.'),
  lb('m1-label-arm', 'muskellehre', 1, 'muscle', 'schuenke', ['b-scapula', 'b-humerus', 'm-biceps', 'm-triceps', 'b-radius', 'b-ulna'],
    'Bizeps vorn (zieht zum Radius), Trizeps hinten (zieht zum Olecranon der Ulna).'),
  mt('m1-ansatz', 'muskellehre', 1, 'schuenke', 'Wo setzt der Muskel an?',
    [['M. biceps brachii', 'Tuberositas radii'], ['M. brachialis', 'Tuberositas ulnae'], ['M. triceps brachii', 'Olecranon']],
    'Ansatz am Radius erklärt, warum der Bizeps auch supiniert; der Brachialis zieht zur Ulna und beugt rein.', 'wissen'),
  sc('m1-ursprung', 'muskellehre', 1, 'wissen', 'verwechslung', 'schuenke', 'Wo entspringt der lange Kopf des M. biceps brachii?',
    'Am Tuberculum supraglenoidale der Scapula', [['Am Processus coracoideus', 'Dort entspringt der kurze Kopf.'], ['Am Tuberculum infraglenoidale', 'Dort entspringt der lange Kopf des Trizeps.']],
    'Supra- (oberhalb der Pfanne) = Bizeps, infra- (unterhalb) = Trizeps.'),
  sc('m1-antagonist', 'muskellehre', 2, 'anwendung', 'richtung', 'schuenke', 'Kim beugt den Unterarm im Ellenbogengelenk. Welcher Muskel ist dabei der Antagonist?',
    'M. triceps brachii', [['M. brachialis', 'Er ist Agonist der Beugung.', 'verwechslung'], ['M. brachioradialis', 'Er hilft beim Beugen und ist damit Synergist.', 'verwechslung']],
    'Muskeln können nur ziehen. Für die Streckung braucht es den Gegenspieler auf der anderen Seite des Gelenks.'),
  sc('m1-supination', 'muskellehre', 2, 'analyse', 'mechanismus', 'schuenke', 'Warum kann der M. biceps brachii supinieren, der M. brachialis aber nicht?',
    'Weil der Bizeps am Radius ansetzt, der sich um die Ulna dreht; der Brachialis setzt an der Ulna an.',
    [['Weil der Bizeps zwei Köpfe hat.', 'Die Zahl der Köpfe entscheidet nicht über die Bewegung, sondern Lage von Ursprung und Ansatz.'],
     ['Weil der Brachialis über das Schultergelenk zieht.', 'Der Brachialis ist eingelenkig; zweigelenkig ist der Bizeps.']],
    'Bei proniertem Unterarm ist die Sehne um den Radius gewickelt; zieht der Bizeps, dreht er den Radius zurück in Supination.'),
  sc('m1-fiederung', 'muskellehre', 3, 'verstaendnis', 'mechanismus', 'schuenke', 'Ein gefiederter und ein parallelfaseriger Muskel haben dasselbe Volumen. Was gilt für den gefiederten?',
    'Mehr Kraft (größerer physiologischer Querschnitt), aber geringere Hubhöhe', [['Mehr Kraft und größere Hubhöhe', 'Kurze Fasern können sich nur wenig verkürzen.'],
      ['Weniger Kraft, aber größere Hubhöhe', 'Das trifft auf den parallelfaserigen Muskel zu.', 'richtung']],
    'Viele kurze, schräge Fasern nebeneinander → großer physiologischer Querschnitt → Kraft. Lange parallele Fasern → große Verkürzung.'),
  mt('m1-formen', 'muskellehre', 3, 'schuenke', 'Ordne die Muskelform einem Beispiel zu.',
    [['zweiköpfig', 'M. biceps brachii'], ['dreiköpfig', 'M. triceps brachii'], ['mehrbäuchig mit Zwischensehnen', 'M. rectus abdominis']],
    'Köpfe = mehrere Ursprünge, Bäuche = durch Zwischensehnen hintereinander geschaltete Abschnitte.', 'wissen', 'begriff'),
];
