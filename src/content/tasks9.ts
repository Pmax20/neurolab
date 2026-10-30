import type { ChoiceOption, ErrorCategory, Task, TaskLevel } from './types';
import { AT_OBJ, PSE_OBJ, BD_OBJ, KZ_OBJ, RX_OBJ, KX_OBJ, EK_OBJ } from './chem5';

// Aufgaben zu Atombau, Periodensystem, Bindung, Osmose, Redox/Elektrochemie, Komplexen, Energetik und Kinetik.
// Selbst formuliert nach Lehrbuchstandard (keine Leipziger Originalaufgaben).

const S = 'zu_pruefen' as const;
const src = [{ id: 'zeeck' }];
function sc(id: string, lesson: string, objective: string, level: TaskLevel, category: ErrorCategory, prompt: string, correct: string, wrong: [string, string][], explanation: string): Task {
  const opts: ChoiceOption[] = [{ id: 'a', text: correct }, ...wrong.map(([text, why], i) => ({ id: String.fromCharCode(98 + i), text, why, category }))];
  const rot = id.length % opts.length;
  return { id, type: 'single', prompt, level, lessons: [lesson], objective, category, sources: src, status: S, options: [...opts.slice(rot), ...opts.slice(0, rot)], correct: 'a', explanation };
}
function mc(id: string, lesson: string, objective: string, prompt: string, right: string[], wrong: [string, string][], explanation: string, category: ErrorCategory = 'verwechslung'): Task {
  const options: ChoiceOption[] = [...right.map((text, i) => ({ id: `r${i}`, text })), ...wrong.map(([text, why], i) => ({ id: `w${i}`, text, why }))];
  const rot = id.length % options.length;
  return { id, type: 'multi', level: 'verstaendnis', lessons: [lesson], objective, category, sources: src, status: S, prompt, options: [...options.slice(rot), ...options.slice(0, rot)], correct: right.map((_, i) => `r${i}`), explanation };
}
function mt(id: string, lesson: string, objective: string, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'wissen'): Task {
  return { id, type: 'match', level, lessons: [lesson], objective, category: 'verwechslung', sources: src, status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
}
function od(id: string, lesson: string, objective: string, prompt: string, items: string[], explanation: string): Task {
  return { id, type: 'order', level: 'verstaendnis', lessons: [lesson], objective, category: 'reihenfolge', sources: src, status: S, prompt, items, explanation };
}
function bal(id: string, lesson: string, objective: string, reactants: string[], products: string[], coefficients: number[], explanation: string): Task {
  return { id, type: 'balance', level: 'anwendung', lessons: [lesson], objective, category: 'rechnen', sources: src, status: S, prompt: 'Gleiche die Gleichung aus (kleinste ganze Zahlen; Atome und Ladungen müssen stimmen).', reactants, products, coefficients, explanation };
}
function tx(id: string, lesson: string, objective: string, prompt: string, modelAnswer: string, keywords: string[][]): Task {
  return { id, type: 'text', level: 'verknuepfung', lessons: [lesson], objective, category: 'mechanismus', sources: src, status: S, prompt, keywords, modelAnswer, explanation: modelAnswer };
}

const A = 'atommodell', P = 'periodensystem', B = 'bindungen', K = 'konzentrationen', R = 'redox', X = 'komplexe', E = 'energetik-kinetik';

export const TASKS_9: Task[] = [
  // ------------------------------------------------------------ Atombau
  sc('c4-isotop', A, AT_OBJ.isotope, 'verstaendnis', 'begriff', 'Was unterscheidet ¹²C, ¹³C und ¹⁴C?', 'die Zahl der Neutronen', [['die Zahl der Protonen', 'Alle haben 6 Protonen – sonst wären es andere Elemente.'], ['die Zahl der Elektronen', 'Im neutralen Atom haben alle 6 Elektronen.'], ['die Ladung', 'Isotope sind ungeladen; Ionen wären geladen.']],
    '¹²C: 6 n, ¹³C: 7 n, ¹⁴C: 8 n. ¹⁴C ist radioaktiv und dient zur Altersbestimmung.'),
  sc('c4-atommasse', A, AT_OBJ.isotope, 'anwendung', 'rechnen', 'Warum steht im Periodensystem für Chlor 35,45 u und nicht 35 oder 37?', 'Es ist der nach Häufigkeit gewichtete Mittelwert der Isotope ³⁵Cl und ³⁷Cl.', [['Chlor hat 35,45 Neutronen.', 'Teilchenzahlen sind immer ganzzahlig.'], ['Die Elektronen machen 0,45 u aus.', 'Elektronen sind viel leichter (zusammen etwa 0,01 u).'], ['Es ist ein Messfehler.', 'Der Wert ist sehr genau bekannt.']],
    '0,758 · 34,97 u + 0,242 · 36,97 u ≈ 35,45 u.'),
  mt('c4-isotope-med', A, AT_OBJ.isotope, 'Ordne jedem Isotop seine medizinische Verwendung zu.', [['¹³¹I', 'Therapie von Schilddrüsenerkrankungen'], ['⁹⁹ᵐTc', 'Szintigrafie (häufigstes Diagnostik-Isotop)'], ['¹⁸F', 'PET mit Fluordesoxyglukose'], ['¹³C', 'Atemtest auf Helicobacter pylori (stabil)']],
    'Isotope verhalten sich chemisch gleich – der Körper baut sie wie die normalen Atome ein.'),
  sc('c4-orbital', A, AT_OBJ.orbitale, 'wissen', 'begriff', 'Wie viele Elektronen passen höchstens in eine p-Unterschale?', '6', [['2', 'Das gilt für ein einzelnes Orbital bzw. die s-Unterschale.'], ['8', 'Acht Elektronen fasst die ganze 2. Schale (s + p).'], ['10', 'Zehn fasst eine d-Unterschale.']],
    'Drei p-Orbitale mit je zwei Elektronen.'),
  sc('c4-hund', A, AT_OBJ.orbitale, 'anwendung', 'struktur', 'Wie sind die drei 2p-Elektronen im Stickstoffatom verteilt?', 'je eines in px, py und pz mit parallelem Spin', [['zwei in px, eines in py', 'Hundsche Regel: Erst werden alle gleichwertigen Orbitale einzeln besetzt.'], ['alle drei in px', 'Mehr als zwei Elektronen pro Orbital verbietet das Pauli-Prinzip.'], ['eines in 2p, zwei in 3s', '2p ist energetisch günstiger als 3s und wird zuerst gefüllt.']],
    'Stickstoff 1s² 2s² 2p³: drei ungepaarte Elektronen – daher bildet N drei Bindungen.'),
  sc('c4-schale', A, AT_OBJ.orbitale, 'anwendung', 'rechnen', 'Wie viele Elektronen fasst die 3. Schale (n = 3) maximal?', '18', [['8', 'Acht ist die Edelgaskonfiguration (3s² 3p⁶), aber die 3d-Orbitale fassen weitere 10.'], ['32', 'Das ist die 4. Schale (2 · 4²).'], ['9', 'Es gilt 2n², nicht n².']],
    '2n² = 2 · 9 = 18 (3s: 2, 3p: 6, 3d: 10).'),
  // ------------------------------------------------------------ PSE
  mt('c4-gruppen', P, PSE_OBJ.gruppen, 'Ordne die Gruppennamen zu.', [['I. Hauptgruppe', 'Alkalimetalle'], ['II. Hauptgruppe', 'Erdalkalimetalle'], ['VI. Hauptgruppe', 'Chalkogene'], ['VII. Hauptgruppe', 'Halogene'], ['VIII. Hauptgruppe', 'Edelgase']],
    'Gruppennummer = Zahl der Valenzelektronen (Hauptgruppen).'),
  sc('c4-metall', P, PSE_OBJ.gruppen, 'verstaendnis', 'begriff', 'Welches Element ist ein Halbmetall?', 'Silicium', [['Natrium', 'Natrium ist ein typisches Metall.'], ['Schwefel', 'Schwefel ist ein Nichtmetall.'], ['Eisen', 'Eisen ist ein Übergangsmetall.']],
    'Halbmetalle liegen auf der Diagonalen B – Si – As – Te.'),
  sc('c4-ie', P, PSE_OBJ.ie, 'verstaendnis', 'mechanismus', 'Warum hat Kalium eine kleinere Ionisierungsenergie als Natrium?', 'Sein Valenzelektron ist weiter vom Kern entfernt und stärker abgeschirmt.', [['Kalium hat weniger Protonen.', 'Kalium hat mehr Protonen (19 statt 11).'], ['Kalium hat mehr Valenzelektronen.', 'Beide haben ein Valenzelektron.'], ['Kalium ist ein Nichtmetall.', 'Kalium ist ein Alkalimetall.']],
    'In einer Gruppe nimmt die Ionisierungsenergie nach unten ab.'),
  mc('c4-spuren', P, PSE_OBJ.ie, 'Welche Elemente sind Spurenelemente des Menschen?', ['Eisen', 'Iod', 'Zink'], [['Calcium', 'Calcium ist ein Mengenelement (Knochen, über 1 kg im Körper).'], ['Natrium', 'Natrium ist ein Mengenelement (Extrazellulärraum).']],
    'Spurenelemente: Fe, Zn, Cu, I, Se, F, Co, Mn, Mo u. a.'),
  od('c4-ie-reihe', P, PSE_OBJ.ie, 'Ordne nach steigender erster Ionisierungsenergie.', ['K', 'Na', 'Mg', 'Cl', 'Ar'],
    'Nach unten in einer Gruppe sinkt, nach rechts in einer Periode steigt die Ionisierungsenergie; Edelgase haben die höchsten Werte.'),
  // ------------------------------------------------------------ Bindung
  sc('c4-lewis-co2', B, BD_OBJ.lewis, 'anwendung', 'struktur', 'Welche Lewis-Formel beschreibt CO₂ richtig?', 'O=C=O mit je zwei freien Elektronenpaaren an jedem O', [['O–C–O mit einem freien Elektronenpaar am C', 'Dann hätte C nur sechs Elektronen um sich – das Oktett wäre nicht erfüllt.'], ['C=O=O', 'Kohlenstoff ist das Zentralatom.'], ['O≡C–O', 'Das verletzt die Oktettregel am einfach gebundenen O.']],
    'C bildet vier Bindungen, jedes O zwei; alle Atome erreichen das Oktett. Das Molekül ist linear und unpolar.'),
  sc('c4-formal', B, BD_OBJ.lewis, 'anwendung', 'rechnen', 'Welche Formalladung trägt das N-Atom im Ammonium-Ion NH₄⁺?', '+1', [['0', 'N hat 5 Valenzelektronen, im NH₄⁺ aber nur 4 „eigene“ (je eines pro Bindung).'], ['−1', 'Das N hat ein Elektron weniger als im neutralen Atom.'], ['+4', 'Die Formalladung zählt Elektronen, nicht Bindungen.']],
    'Formalladung = 5 − (0 + 8/2) = +1.'),
  sc('c4-mesomerie', B, BD_OBJ.mesomerie, 'verstaendnis', 'begriff', 'Was bedeutet Mesomerie beim Carboxylat-Ion R–COO⁻?', 'Die negative Ladung ist auf beide O-Atome verteilt; beide C–O-Bindungen sind gleich lang.', [['Das Ion wechselt schnell zwischen zwei Formen hin und her.', 'Die Grenzformeln sind keine echten Teilchen – das reale Ion liegt dazwischen.'], ['Ein O-Atom trägt immer −1, das andere 0.', 'Dann wären die Bindungen verschieden lang – das ist nicht der Fall.'], ['Es gibt zwei verschiedene Isomere.', 'Isomere haben verschiedene Atomverknüpfungen; hier verschieben sich nur Elektronen.']],
    'Delokalisierung stabilisiert das Carboxylat – ein Grund, warum Carbonsäuren sauer sind.'),
  mc('c4-meso-bsp', B, BD_OBJ.mesomerie, 'Bei welchen Teilchen beschreibt man die Struktur mit mesomeren Grenzformeln?', ['Carbonat CO₃²⁻', 'Benzol C₆H₆', 'Nitrat NO₃⁻'], [['Methan CH₄', 'Nur Einfachbindungen, keine delokalisierten Elektronen.'], ['Ammonium NH₄⁺', 'Vier gleichwertige Einfachbindungen ohne π-Elektronen.']],
    'Mesomerie tritt auf, wenn π-Elektronen oder freie Elektronenpaare über mehrere Atome verteilt sind.'),
  sc('c4-loeslich', B, BD_OBJ.gitter, 'anwendung', 'mechanismus', 'Welcher Stoff löst sich am besten in Wasser?', 'Ethanol', [['Hexan', 'Unpolar – „Ähnliches löst sich in Ähnlichem“.'], ['Cholesterin', 'Fast vollständig unpolar; im Blut nur mit Lipoproteinen transportierbar.'], ['Olivenöl', 'Fette sind unpolar.']],
    'Ethanol bildet über seine OH-Gruppe Wasserstoffbrücken mit Wasser.'),
  mt('c4-bindungsart', B, BD_OBJ.gitter, 'Ordne jedem Stoff die vorherrschende Bindung zu.', [['Natriumchlorid', 'Ionenbindung (Gitter)'], ['Kupfer', 'Metallbindung'], ['Methan', 'unpolare Atombindung'], ['Wasser', 'polare Atombindung']],
    'ΔEN groß → Ionenbindung; zwei Metalle → Metallbindung; Nichtmetalle → Atombindung.', 'verstaendnis'),
  tx('c4-hydratation', B, BD_OBJ.gitter, 'Erkläre, warum sich Kochsalz in Wasser löst, obwohl die Ionen im Kristall stark zusammengehalten werden.',
    'Wassermoleküle sind Dipole. Sie lagern sich mit dem negativen O-Pol an die Na⁺-Ionen und mit den positiven H-Atomen an die Cl⁻-Ionen an. Dabei wird Hydratationsenergie frei, die die Gitterenergie ungefähr ausgleicht. Die Ionen lösen sich aus dem Gitter und sind in der Lösung von einer Hydrathülle umgeben; zusätzlich steigt die Entropie.',
    [['dipol', 'polar'], ['hydrat'], ['gitter'], ['ion']]),
  // ------------------------------------------------------------ Osmose
  sc('c4-osmo', K, KZ_OBJ.osmodruck, 'verstaendnis', 'mechanismus', 'Rote Blutkörperchen werden in destilliertes Wasser gegeben. Was passiert?', 'Wasser strömt ein, die Zellen schwellen an und platzen (Hämolyse).', [['Wasser strömt aus, die Zellen schrumpfen.', 'Das passiert in hypertoner Lösung (Stechapfelform).'], ['Nichts, weil Wasser keine Teilchen enthält.', 'Gerade deshalb ist der osmotische Unterschied maximal.'], ['Die Ionen strömen in das Wasser, die Zelle bleibt gleich.', 'Die Membran ist für Ionen kaum durchlässig; Wasser bewegt sich schneller.']],
    'Wasser folgt dem osmotischen Gradienten zur höheren Osmolarität – hier ins Zellinnere.'),
  sc('c4-onkotisch', K, KZ_OBJ.osmodruck, 'analyse', 'mechanismus', 'Warum führt ein stark erniedrigter Albuminspiegel im Blut zu Ödemen?', 'Der kolloidosmotische Druck sinkt, sodass weniger Flüssigkeit aus dem Gewebe in die Kapillaren zurückgezogen wird.', [['Albumin bindet Wasser im Gewebe.', 'Albumin wirkt gerade im Gefäß und hält dort Wasser zurück.'], ['Weil der Blutdruck steigt.', 'Der hydrostatische Druck ist nicht die Ursache.'], ['Weil Na⁺ in die Zellen strömt.', 'Kleine Ionen passieren die Kapillarwand frei und wirken dort nicht osmotisch.']],
    'Proteine passieren die Kapillarwand kaum und erzeugen deshalb den onkotischen Druck.'),
  // ------------------------------------------------------------ Redox
  bal('c4-bal-mn', R, RX_OBJ.gleichung, ['MnO₄⁻', 'H⁺', 'Fe²⁺'], ['Mn²⁺', 'Fe³⁺', 'H₂O'], [1, 8, 5, 1, 5, 4], 'Mn nimmt 5 e⁻ auf (+VII → +II), jedes Fe gibt 1 e⁻ ab → 5 Fe²⁺. Ladung: links −1 + 8 + 10 = +17, rechts +2 + 15 = +17.'),
  bal('c4-bal-cu', R, RX_OBJ.gleichung, ['Cu', 'Ag⁺'], ['Cu²⁺', 'Ag'], [1, 2, 1, 2], 'Cu gibt 2 Elektronen ab, jedes Ag⁺ nimmt eines auf.'),
  bal('c4-bal-h2o2', R, RX_OBJ.gleichung, ['H₂O₂'], ['H₂O', 'O₂'], [2, 2, 1], 'Disproportionierung durch die Katalase: O von −I zu −II (H₂O) und 0 (O₂).'),
  od('c4-redox-schritte', R, RX_OBJ.gleichung, 'Bringe die Schritte zum Aufstellen einer Redoxgleichung in die richtige Reihenfolge.', ['Oxidationszahlen bestimmen', 'Oxidation und Reduktion als Teilgleichungen mit Elektronen', 'Ladungen mit H⁺ oder OH⁻ ausgleichen', 'H und O mit Wasser ausgleichen', 'Elektronenzahlen angleichen und addieren', 'Atom- und Ladungsbilanz prüfen'],
    'Erst die Elektronen, dann Ladung, dann Stoffbilanz.'),
  sc('c4-oxmittel', R, RX_OBJ.gleichung, 'verstaendnis', 'begriff', 'In Zn + Cu²⁺ → Zn²⁺ + Cu ist das Oxidationsmittel …', 'Cu²⁺', [['Zn', 'Zink gibt Elektronen ab und ist das Reduktionsmittel.'], ['Zn²⁺', 'Zn²⁺ ist ein Produkt.'], ['Cu', 'Cu ist das Produkt der Reduktion.']],
    'Das Oxidationsmittel nimmt Elektronen auf und wird dabei reduziert.'),
  sc('c4-unedel', R, RX_OBJ.zelle, 'anwendung', 'richtung', 'Ein Eisennagel wird in Kupfersulfatlösung gelegt. Was passiert?', 'Eisen löst sich, Kupfer scheidet sich auf dem Nagel ab.', [['Nichts, Metalle reagieren nicht mit Salzlösungen.', 'Unedle Metalle reduzieren die Ionen edlerer Metalle.'], ['Kupfer löst sich, Eisen scheidet sich ab.', 'Eisen (−0,44 V) ist unedler als Kupfer (+0,34 V) und gibt die Elektronen ab.'], ['Es entsteht Wasserstoff.', 'Das wäre bei Säure, nicht bei Kupfersalz.']],
    'Fe + Cu²⁺ → Fe²⁺ + Cu: Das Paar mit dem negativeren Potenzial reduziert das mit dem positiveren.'),
  mt('c4-zelle', R, RX_OBJ.zelle, 'Ordne die Begriffe der galvanischen Zelle zu.', [['Anode', 'Ort der Oxidation, Minuspol'], ['Kathode', 'Ort der Reduktion, Pluspol'], ['Salzbrücke', 'schließt den Stromkreis über Ionen'], ['Normalwasserstoffelektrode', 'Bezugspunkt E° = 0 V']],
    'Anode = Oxidation – das gilt immer, die Pole kehren sich nur bei der Elektrolyse um.', 'verstaendnis'),
  sc('c4-nernst', R, RX_OBJ.nernst, 'verstaendnis', 'rechnen', 'Um wie viel ändert sich das Potenzial eines Redoxpaars mit z = 1 bei 25 °C, wenn das Verhältnis [Ox]/[Red] verzehnfacht wird?', 'um +59 mV', [['um +590 mV', 'Pro Zehnerpotenz sind es 59 mV / z.'], ['um −59 mV', 'Mehr oxidierte Form macht das Potenzial positiver.'], ['gar nicht', 'Genau das beschreibt die Nernst-Gleichung.']],
    'E = E° + 0,059 V · lg([Ox]/[Red]); lg 10 = 1.'),
  // ------------------------------------------------------------ Komplexe
  sc('c4-kx-ladung', X, KX_OBJ.nomenklatur, 'anwendung', 'rechnen', 'Welche Oxidationszahl hat Cobalt in [Co(NH₃)₅Cl]²⁺?', '+III', [['+II', 'Das Cl⁻ zählt −1: x + 0 − 1 = +2 → x = +3.'], ['+V', 'NH₃ ist neutral und zählt nicht.'], ['+I', 'Die Komplexladung +2 muss erreicht werden.']],
    'x + 5 · 0 + (−1) = +2 → x = +3: Pentaamminchloridocobalt(III).'),
  mt('c4-kx-namen', X, KX_OBJ.nomenklatur, 'Ordne jedem Komplex seinen Namen zu.', [['[Cu(NH₃)₄]²⁺', 'Tetraamminkupfer(II)'], ['[Fe(CN)₆]⁴⁻', 'Hexacyanidoferrat(II)'], ['[Ag(NH₃)₂]⁺', 'Diamminsilber(I)'], ['[PtCl₂(NH₃)₂]', 'Diammindichloridoplatin(II)']],
    'Liganden alphabetisch, Zentralatom mit Oxidationszahl; anionische Komplexe enden auf -at.', 'anwendung'),
  mt('c4-kx-geo', X, KX_OBJ.geometrie, 'Ordne der Koordinationszahl die typische Geometrie zu.', [['KZ 2', 'linear'], ['KZ 4 (Zn²⁺)', 'tetraedrisch'], ['KZ 4 (Pt²⁺)', 'quadratisch-planar'], ['KZ 6', 'oktaedrisch']],
    'Die Geometrie bestimmt, ob cis/trans-Isomere möglich sind.', 'verstaendnis'),
  sc('c4-kx-edta', X, KX_OBJ.geometrie, 'verstaendnis', 'begriff', 'Warum verhindert EDTA im Blutröhrchen die Gerinnung?', 'Es bindet Ca²⁺ fest als Chelatkomplex; ohne freie Ca²⁺ läuft die Gerinnungskaskade nicht ab.', [['Es zerstört die Blutplättchen.', 'EDTA wirkt über die Komplexbildung, nicht über Zellschädigung.'], ['Es bindet Eisen aus dem Hämoglobin.', 'Hämoglobin bleibt intakt; entscheidend ist Ca²⁺.'], ['Es macht das Blut basisch.', 'Der pH ist nicht der Mechanismus.']],
    'Viele Gerinnungsfaktoren brauchen Ca²⁺. EDTA und Citrat fangen es weg.'),
  sc('c4-kx-cis', X, KX_OBJ.medizin, 'verstaendnis', 'struktur', 'Warum ist nur cis-Platin, nicht trans-Platin, ein wirksames Zytostatikum?', 'Nur in der cis-Anordnung können die beiden freien Bindungsstellen benachbarte DNA-Basen gleichzeitig binden.', [['trans-Platin enthält kein Platin.', 'Beide Isomere haben dieselbe Zusammensetzung.'], ['trans-Platin ist ein Gas.', 'Beide sind feste Stoffe.'], ['cis-Platin ist positiv geladen.', 'Beide sind neutral.']],
    'Nach Abspaltung der Cl⁻ bindet Pt an zwei benachbarte Guanin-N-Atome und verbiegt die DNA.'),
  sc('c4-kx-gd', X, KX_OBJ.medizin, 'analyse', 'mechanismus', 'Warum wird Gadolinium als MRT-Kontrastmittel nur als Chelatkomplex gegeben?', 'Freies Gd³⁺ ist giftig; im sehr stabilen Chelat bleibt es gebunden und wird über die Niere ausgeschieden.', [['Weil der Chelatligand den Kontrast erzeugt.', 'Den Kontrast macht das paramagnetische Gd³⁺.'], ['Weil Gd³⁺ sonst nicht löslich wäre, aber ungiftig.', 'Freies Gd³⁺ ist toxisch und lagert sich ein.'], ['Damit es länger im Körper bleibt.', 'Ziel ist eine rasche Ausscheidung.']],
    'Hohe Stabilitätskonstante = wenig freies Metallion. Bei schwerer Niereninsuffizienz ist Vorsicht geboten.'),
  // ------------------------------------------------------------ Energetik und Kinetik
  sc('ek-exo', E, EK_OBJ[0], 'wissen', 'begriff', 'Was bedeutet ΔH < 0?', 'Die Reaktion ist exotherm – Wärme wird an die Umgebung abgegeben.', [['Die Reaktion ist endotherm.', 'Endotherm heißt ΔH > 0.'], ['Die Reaktion läuft sicher freiwillig ab.', 'Freiwilligkeit entscheidet ΔG, nicht ΔH allein.'], ['Die Reaktion ist schnell.', 'Über die Geschwindigkeit sagt ΔH nichts.']],
    'Beispiel: Verbrennung, Neutralisation.'),
  sc('ek-hess', E, EK_OBJ[0], 'verstaendnis', 'begriff', 'Glukose liefert bei der Verbrennung im Labor und bei der Zellatmung über viele Zwischenschritte dieselbe Energiemenge. Welches Prinzip steckt dahinter?', 'der Satz von Hess', [['das Prinzip von Le Chatelier', 'Le Chatelier beschreibt das Ausweichen von Gleichgewichten.'], ['die RGT-Regel', 'Sie beschreibt die Temperaturabhängigkeit der Geschwindigkeit.'], ['das Massenwirkungsgesetz', 'Das MWG beschreibt die Gleichgewichtslage.']],
    'Die Enthalpie ist eine Zustandsgröße – der Weg spielt keine Rolle.'),
  sc('ek-entropie', E, EK_OBJ[1], 'verstaendnis', 'begriff', 'Bei welchem Vorgang nimmt die Entropie ab?', 'Wasser gefriert zu Eis.', [['Zucker löst sich in Tee.', 'Beim Lösen verteilen sich die Teilchen – die Entropie steigt.'], ['Wasser verdampft.', 'Gase haben die größte Entropie.'], ['CaCO₃ zerfällt in CaO und CO₂.', 'Es entsteht ein Gas – die Entropie steigt.']],
    'Geordnetere Zustände (fest) haben weniger Entropie.'),
  sc('ek-dg', E, EK_OBJ[1], 'anwendung', 'begriff', 'Eine Reaktion hat ΔG = +20 kJ/mol. Wie kann der Körper sie trotzdem ablaufen lassen?', 'durch Kopplung an eine stark exergone Reaktion, z. B. die ATP-Hydrolyse', [['durch einen Katalysator', 'Ein Enzym beschleunigt, ändert aber ΔG nicht.'], ['durch Erhöhen der Aktivierungsenergie', 'Das macht die Reaktion nur langsamer.'], ['gar nicht', 'Gekoppelte Reaktionen sind im Stoffwechsel die Regel.']],
    'Die Summe der gekoppelten Reaktionen hat ein negatives ΔG.'),
  sc('ek-ordnung', E, EK_OBJ[2], 'verstaendnis', 'begriff', 'Für eine Reaktion gilt v = k · [A] · [B]. Welche Gesamtordnung hat sie?', '2. Ordnung', [['1. Ordnung', 'Beide Konzentrationen gehen mit dem Exponenten 1 ein: 1 + 1 = 2.'], ['0. Ordnung', 'Die Geschwindigkeit hängt von den Konzentrationen ab.'], ['Das kann man nicht sagen.', 'Die Ordnung ist die Summe der Exponenten.']],
    'Die Reaktionsordnung wird experimentell bestimmt und muss nicht mit den Koeffizienten der Gleichung übereinstimmen.'),
  sc('ek-thalb', E, EK_OBJ[3], 'anwendung', 'rechnen', 'Ein Medikament hat eine Halbwertszeit von 6 h. Welcher Anteil der Anfangsdosis ist nach 24 h noch im Körper?', 'etwa 6 % (1/16)', [['25 %', 'Nach 24 h sind 4 Halbwertszeiten vergangen, nicht 2.'], ['0 %', 'Bei 1. Ordnung wird es nie ganz null.'], ['50 %', 'Das wäre nach 6 h.']],
    '24 h / 6 h = 4 Halbwertszeiten → (½)⁴ = 1/16 ≈ 6 %.'),
  sc('ek-steady', E, EK_OBJ[3], 'verstaendnis', 'begriff', 'Nach wie vielen Halbwertszeiten ist bei regelmäßiger Gabe ein Medikament praktisch im Gleichgewicht (steady state)?', 'nach etwa 4–5 Halbwertszeiten', [['nach einer Halbwertszeit', 'Dann ist erst die Hälfte des Endwerts erreicht.'], ['nach 20 Halbwertszeiten', 'So lange dauert es nicht – nach 5 t½ sind etwa 97 % erreicht.'], ['sofort', 'Der Spiegel baut sich erst auf.']],
    'Auch das Absetzen dauert ähnlich lange, bis der Stoff weitgehend eliminiert ist.'),
  sc('ek-kat', E, EK_OBJ[4], 'verstaendnis', 'mechanismus', 'Was bewirkt ein Enzym im Energiediagramm?', 'Es senkt die Aktivierungsenergie; Anfangs- und Endniveau bleiben gleich.', [['Es senkt das Energieniveau der Produkte.', 'Dann würde sich ΔG ändern – das tut ein Katalysator nicht.'], ['Es erhöht die Aktivierungsenergie.', 'Das würde die Reaktion verlangsamen.'], ['Es liefert die Reaktionsenergie.', 'Enzyme werden nicht verbraucht und liefern keine Energie.']],
    'Schnellere Einstellung des Gleichgewichts – an derselben Stelle.'),
  sc('ek-fieber', E, EK_OBJ[4], 'anwendung', 'rechnen', 'Die Körpertemperatur steigt von 37 °C auf 40 °C. Grob um welchen Faktor beschleunigen sich viele Reaktionen (Faktor 2 pro 10 K)?', 'etwa 1,2', [['etwa 2', 'Das gilt erst für 10 K.'], ['etwa 6', '3 K sind keine Verdreifachung.'], ['gar nicht', 'Schon wenige Kelvin wirken sich aus.']],
    '2^(3/10) ≈ 1,23 – der Grundumsatz steigt bei Fieber deutlich.'),
  tx('ek-zucker', E, EK_OBJ[4], 'Warum verbrennt Zucker auf dem Tisch nicht von selbst, obwohl die Reaktion mit Sauerstoff stark exergon ist?',
    'ΔG sagt nur, dass die Reaktion freiwillig ablaufen kann, nicht wie schnell. Die Verbrennung hat eine hohe Aktivierungsenergie, die bei Raumtemperatur kaum ein Teilchen erreicht. Erst durch Zünden (Energiezufuhr) oder im Körper durch Enzyme, die die Aktivierungsenergie senken, läuft die Reaktion mit merklicher Geschwindigkeit ab.',
    [['aktivierungsenergie', 'energiebarriere'], ['geschwindigkeit', 'langsam', 'kinetik'], ['enzym', 'katalysator', 'zünden']]),
];
