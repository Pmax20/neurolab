import type { ChoiceOption, ErrorCategory, Task, TaskLevel } from './types';
import { GG_OBJ, SB_OBJ } from './chem3';

// Aufgaben zu chemischem Gleichgewicht, Löslichkeitsprodukt, Säuren/Basen, Puffer und Titration.
// Selbst formulierte Übungsfragen nach Lehrbuchstandard (keine Leipziger Originalaufgaben).

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
function mt(id: string, lesson: string, objective: string, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'verstaendnis'): Task {
  return { id, type: 'match', level, lessons: [lesson], objective, category: 'verwechslung', sources: src, status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
}
function od(id: string, lesson: string, objective: string, prompt: string, items: string[], explanation: string): Task {
  return { id, type: 'order', level: 'verstaendnis', lessons: [lesson], objective, category: 'reihenfolge', sources: src, status: S, prompt, items, explanation };
}
function tx(id: string, lesson: string, objective: string, prompt: string, modelAnswer: string, keywords: string[][]): Task {
  return { id, type: 'text', level: 'verknuepfung', lessons: [lesson], objective, category: 'mechanismus', sources: src, status: S, prompt, keywords, modelAnswer, explanation: modelAnswer };
}

const GG = 'gleichgewicht', SB = 'saeure-base';

export const TASKS_7: Task[] = [
  // ------------------------------------------------------------ MWG und Rechnen
  sc('c3-mwg-aufstellen', GG, GG_OBJ.rechnen, 'wissen', 'formel', 'Wie lautet das Massenwirkungsgesetz für N₂ + 3 H₂ ⇌ 2 NH₃?',
    'K = [NH₃]² / ([N₂]·[H₂]³)', [['K = 2·[NH₃] / ([N₂]·3·[H₂])', 'Die Koeffizienten werden zu Exponenten, nicht zu Faktoren.'], ['K = ([N₂]·[H₂]³) / [NH₃]²', 'Produkte stehen im Zähler, Edukte im Nenner.'], ['K = [NH₃] / ([N₂] + [H₂])', 'Konzentrationen werden multipliziert, nicht addiert.']],
    'Produkte oben, Edukte unten, stöchiometrische Koeffizienten als Exponenten.'),
  sc('c3-mwg-feststoff', GG, GG_OBJ.rechnen, 'verstaendnis', 'begriff', 'Wie lautet der MWG-Ausdruck für CaCO₃(s) ⇌ CaO(s) + CO₂(g)?',
    'K = [CO₂]', [['K = [CaO]·[CO₂] / [CaCO₃]', 'Reine Feststoffe erscheinen nicht im MWG – ihre „Konzentration“ ist konstant.'], ['K = [CaCO₃] / [CO₂]', 'Produkt und Edukt vertauscht, und Feststoffe gehören nicht hinein.'], ['K = 1', 'Das Gleichgewicht hängt vom CO₂ ab.']],
    'Feststoffe und Lösungsmittel werden im MWG weggelassen; übrig bleibt das Gas.'),
  sc('c3-q-k', GG, GG_OBJ.rechnen, 'anwendung', 'richtung', 'Für eine Reaktion ist K = 50. Aus den aktuellen Konzentrationen ergibt sich Q = 5. Was passiert?',
    'Die Reaktion läuft weiter in Richtung der Produkte, bis Q = K ist.', [['Die Reaktion läuft Richtung Edukte.', 'Das wäre bei Q > K der Fall.'], ['Nichts – das System ist im Gleichgewicht.', 'Im Gleichgewicht wäre Q = K.'], ['K sinkt auf 5.', 'K ist bei gegebener Temperatur konstant; Q passt sich an.']],
    'Q < K: Es gibt „zu wenig“ Produkt, also bildet sich weiteres Produkt.'),
  sc('c3-k-gross', GG, GG_OBJ.rechnen, 'verstaendnis', 'begriff', 'Was bedeutet K = 10⁸ für eine Reaktion?',
    'Das Gleichgewicht liegt praktisch vollständig auf der Produktseite.', [['Die Reaktion läuft sehr schnell ab.', 'K sagt nichts über die Geschwindigkeit – das ist Kinetik.'], ['Im Gleichgewicht liegen gleich viele Produkte wie Edukte vor.', 'Dann wäre K ≈ 1 (bei gleicher Teilchenzahl).'], ['Die Reaktion ist endotherm.', 'K allein verrät nicht, ob die Reaktion Wärme aufnimmt.']],
    'Großes K: Produkte überwiegen stark. Über die Geschwindigkeit entscheidet die Aktivierungsenergie.'),
  od('c3-tabelle', GG, GG_OBJ.rechnen, 'Bringe die Schritte zur Berechnung von Gleichgewichtsmengen in die richtige Reihenfolge.',
    ['Reaktionsgleichung aufstellen und ausgleichen', 'Massenwirkungsgesetz formulieren', 'Anfangsmengen in die Tabelle eintragen', 'Änderungen mit x über die Stöchiometrie ausdrücken', 'Gleichgewichtswerte ins MWG einsetzen und nach x auflösen', 'Sinnvolle Lösung auswählen und Probe machen'],
    'Anfang – Änderung – Gleichgewicht. Bei quadratischen Gleichungen ist nur die Lösung sinnvoll, die keine negativen Mengen ergibt.'),
  // ------------------------------------------------------------ Le Chatelier
  mt('c3-chatelier', GG, GG_OBJ.chatelier, 'Für N₂ + 3 H₂ ⇌ 2 NH₃ (exotherm): Ordne jeder Änderung die Wirkung zu.',
    [['Druck erhöhen', 'mehr NH₃'], ['Temperatur erhöhen', 'weniger NH₃, K wird kleiner'], ['Katalysator zugeben', 'Gleichgewicht stellt sich schneller ein, gleiche Lage'], ['Stickstoff zugeben', 'mehr NH₃, K bleibt gleich']],
    'Druck: Seite mit weniger Gasteilchen. Temperatur: endotherme Richtung. Nur die Temperatur ändert K.', 'anwendung'),
  sc('c3-k-temp', GG, GG_OBJ.chatelier, 'verstaendnis', 'begriff', 'Welche Änderung verändert den Zahlenwert der Gleichgewichtskonstante K?',
    'eine Temperaturänderung', [['die Zugabe eines Edukts', 'Sie verschiebt die Lage, bis wieder Q = K gilt – K selbst bleibt.'], ['ein Katalysator', 'Er ändert nur die Geschwindigkeit.'], ['eine Druckerhöhung', 'Sie verschiebt bei Gasreaktionen die Lage, nicht K.']],
    'K ist eine Konstante für eine bestimmte Temperatur.'),
  sc('c3-gleiche-teilchen', GG, GG_OBJ.chatelier, 'anwendung', 'mechanismus', 'Bei welcher Gasreaktion hat eine Druckerhöhung keinen Einfluss auf die Lage des Gleichgewichts?',
    'H₂ + Cl₂ ⇌ 2 HCl', [['2 SO₂ + O₂ ⇌ 2 SO₃', 'Links 3, rechts 2 Gasteilchen – Druck begünstigt SO₃.'], ['N₂O₄ ⇌ 2 NO₂', 'Links 1, rechts 2 Teilchen – Druck begünstigt N₂O₄.'], ['N₂ + 3 H₂ ⇌ 2 NH₃', '4 gegen 2 Teilchen.']],
    'Nur wenn sich die Zahl der Gasteilchen ändert, wirkt der Druck.'),
  tx('c3-chatelier-blut', GG, GG_OBJ.chatelier, 'Erkläre mit dem Prinzip von Le Chatelier, warum Hyperventilation den pH des Blutes erhöht.',
    'Im Blut gilt CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Beim Hyperventilieren wird mehr CO₂ abgeatmet, die CO₂-Konzentration sinkt. Das Gleichgewicht weicht aus, indem es nach links verschoben wird: H⁺ und HCO₃⁻ reagieren zu Kohlensäure bzw. CO₂ und Wasser. Dadurch sinkt die H⁺-Konzentration, der pH steigt (respiratorische Alkalose).',
    [['co2', 'co₂', 'kohlendioxid'], ['links', 'edukt', 'zurück'], ['h+', 'h⁺', 'proton', 'h3o'], ['ph steigt', 'alkalose', 'basisch']]),
  // ------------------------------------------------------------ Löslichkeitsprodukt
  sc('c3-kl-aufstellen', GG, GG_OBJ.loeslich, 'wissen', 'formel', 'Wie lautet das Löslichkeitsprodukt von Calciumfluorid, CaF₂?',
    'K_L = [Ca²⁺]·[F⁻]²', [['K_L = [Ca²⁺]·[F⁻] / [CaF₂]', 'Der Feststoff steht nicht im Löslichkeitsprodukt.'], ['K_L = [Ca²⁺]·2·[F⁻]', 'Der Koeffizient wird zum Exponenten.'], ['K_L = [Ca²⁺] + [F⁻]²', 'Es wird multipliziert.']],
    'CaF₂(s) ⇌ Ca²⁺ + 2 F⁻ → K_L = [Ca²⁺]·[F⁻]².'),
  sc('c3-gleichionig', GG, GG_OBJ.loeslich, 'anwendung', 'mechanismus', 'Zu einer gesättigten Silberchloridlösung mit Bodenkörper wird Natriumchlorid gegeben. Was passiert?',
    'Es fällt weiteres Silberchlorid aus; die Löslichkeit von AgCl sinkt.', [['Es löst sich mehr Silberchlorid.', 'Mehr Cl⁻ verschiebt das Gleichgewicht zum Feststoff.'], ['Das Löslichkeitsprodukt steigt.', 'K_L bleibt bei gleicher Temperatur konstant.'], ['Nichts, weil Na⁺ nicht im Löslichkeitsprodukt vorkommt.', 'Das Cl⁻ des Kochsalzes zählt sehr wohl.']],
    'Gleichioniger Zusatz: [Ag⁺]·[Cl⁻] würde K_L überschreiten, also fällt AgCl aus.'),
  sc('c3-kl-vergleich', GG, GG_OBJ.loeslich, 'analyse', 'verwechslung', 'AgCl hat K_L ≈ 1,8·10⁻¹⁰ mol²/l², CaF₂ hat K_L ≈ 3,9·10⁻¹¹ mol³/l³. Welches Salz ist in reinem Wasser besser löslich?',
    'CaF₂ (L ≈ 2·10⁻⁴ mol/l gegenüber 1,3·10⁻⁵ mol/l)', [['AgCl, weil sein K_L größer ist', 'K_L verschiedener Salztypen lassen sich nicht direkt vergleichen – erst die Löslichkeit ausrechnen.'], ['Beide gleich gut', 'Die Löslichkeiten unterscheiden sich um mehr als den Faktor 10.'], ['Das lässt sich ohne Molmassen nicht sagen', 'Für die Löslichkeit in mol/l braucht man nur K_L und den Salztyp.']],
    'AgCl: L = √K_L ≈ 1,3·10⁻⁵ mol/l. CaF₂: L = ∛(K_L/4) ≈ 2,1·10⁻⁴ mol/l.'),
  sc('c3-barium', GG, GG_OBJ.loeslich, 'verstaendnis', 'mechanismus', 'Warum kann Bariumsulfat als Röntgenkontrastmittel geschluckt werden, obwohl Ba²⁺-Ionen giftig sind?',
    'Sein Löslichkeitsprodukt ist so klein, dass kaum Ba²⁺ in Lösung geht.', [['Weil Sulfat das Barium entgiftet.', 'Die Ionen sind getrennt nicht ungiftiger – entscheidend ist, dass sie kaum in Lösung gehen.'], ['Weil es sofort ausgeschieden wird, bevor es sich löst.', 'Die geringe Löslichkeit ist der Grund.'], ['Weil Magensäure Bariumsulfat neutralisiert.', 'BaSO₄ ist auch in Säure sehr schwer löslich.']],
    'BaSO₄: K_L ≈ 1·10⁻¹⁰ mol²/l² → L ≈ 10⁻⁵ mol/l.'),
  // ------------------------------------------------------------ Säuren und Basen
  mt('c3-paare', SB, SB_OBJ.schwach, 'Ordne jeder Säure ihre konjugierte Base zu.', [['NH₄⁺', 'NH₃'], ['H₂CO₃', 'HCO₃⁻'], ['HCO₃⁻', 'CO₃²⁻'], ['H₂PO₄⁻', 'HPO₄²⁻'], ['H₃O⁺', 'H₂O']],
    'Konjugierte Base = Säure minus ein Proton. HCO₃⁻ ist ein Ampholyt und taucht deshalb zweimal auf.', 'wissen'),
  od('c3-staerke', SB, SB_OBJ.schwach, 'Ordne die Säuren von der stärksten zur schwächsten.', ['Salzsäure', 'Phosphorsäure (pK_S 2,15)', 'Milchsäure (pK_S 3,86)', 'Essigsäure (pK_S 4,76)', 'Ammonium (pK_S 9,25)'],
    'Kleiner pK_S = starke Säure.'),
  sc('c3-schwach-stark', SB, SB_OBJ.schwach, 'anwendung', 'rechnen', 'Eine Essigsäure- und eine Salzsäurelösung haben beide c = 0,1 mol/l. Welche Aussage stimmt?',
    'Die Salzsäure hat pH 1, die Essigsäure etwa pH 2,9.', [['Beide haben pH 1.', 'Essigsäure protolysiert nur zu etwa 1 %.'], ['Die Essigsäure ist saurer, weil sie mehr Wasserstoffatome hat.', 'Nur das saure H der Carboxylgruppe zählt, und das wird nur teilweise abgegeben.'], ['Beide brauchen für die Neutralisation unterschiedlich viel Lauge.', 'Der Laugenverbrauch ist gleich – er hängt nur von der Stoffmenge ab.']],
    'Essigsäure: pH = ½·(4,76 − lg 0,1) = ½·5,76 ≈ 2,9.'),
  sc('c3-pkb', SB, SB_OBJ.schwach, 'anwendung', 'rechnen', 'NH₄⁺ hat pK_S = 9,25. Welchen pK_B hat Ammoniak?',
    '4,75', [['9,25', 'Das ist der pK_S der konjugierten Säure.'], ['23,25', 'Es gilt pK_S + pK_B = 14, nicht Addition zu 14.'], ['−9,25', 'pK-Werte werden nicht einfach negativ.']],
    'pK_B = 14 − pK_S = 14 − 9,25 = 4,75.'),
  mc('c3-ampholyte', SB, SB_OBJ.salze, 'Welche Teilchen sind Ampholyte?',
    ['H₂O', 'HCO₃⁻', 'H₂PO₄⁻'], [['Cl⁻', 'Chlorid kann kein Proton abgeben und ist praktisch keine Base.'], ['NH₄⁺', 'NH₄⁺ ist nur eine Säure; es kann kein weiteres Proton aufnehmen.']],
    'Ampholyte können Protonen abgeben und aufnehmen. Auch Aminosäuren gehören dazu.'),
  mt('c3-salze', SB, SB_OBJ.salze, 'Wie reagiert die wässrige Lösung des Salzes?', [['Natriumchlorid', 'neutral'], ['Ammoniumchlorid', 'sauer'], ['Natriumacetat', 'basisch'], ['Natriumhydrogencarbonat', 'schwach basisch']],
    'Der stärkere „Elternteil“ setzt sich durch: NH₄Cl aus HCl (stark) und NH₃ (schwach) → sauer.', 'anwendung'),
  sc('c3-kw', SB, SB_OBJ.salze, 'anwendung', 'rechnen', 'Eine Lösung hat [OH⁻] = 10⁻⁴ mol/l (25 °C). Wie groß ist [H₃O⁺]?',
    '10⁻¹⁰ mol/l', [['10⁻⁴ mol/l', 'In neutralen Lösungen wären beide gleich, hier nicht.'], ['10⁴ mol/l', 'Konzentrationen in Wasser sind nie so groß.'], ['10⁻¹⁴ mol/l', 'Das ist K_W selbst.']],
    'K_W = [H₃O⁺]·[OH⁻] = 10⁻¹⁴ → [H₃O⁺] = 10⁻¹⁴ / 10⁻⁴ = 10⁻¹⁰ mol/l, pH 10.'),
  sc('c3-puffer-wahl', SB, SB_OBJ.schwach, 'anwendung', 'verwechslung', 'Für ein Experiment wird ein Puffer bei pH 7,2 gebraucht. Welches Paar ist am besten geeignet?',
    'H₂PO₄⁻ / HPO₄²⁻ (pK_S 7,21)', [['Essigsäure / Acetat (pK_S 4,76)', 'Puffer wirken gut im Bereich pK_S ± 1 – 7,2 liegt außerhalb.'], ['NH₄⁺ / NH₃ (pK_S 9,25)', 'Zu weit vom gewünschten pH entfernt.'], ['HCl / Cl⁻', 'Salzsäure ist eine starke Säure und bildet keinen Puffer.']],
    'Man wählt das Paar, dessen pK_S dem gewünschten pH am nächsten liegt.'),
  // ------------------------------------------------------------ Titration
  sc('c3-aeq-schwach', SB, SB_OBJ.titration, 'verstaendnis', 'mechanismus', 'Wo liegt der Äquivalenzpunkt bei der Titration von Essigsäure mit Natronlauge?',
    'im Basischen (etwa pH 8–9)', [['genau bei pH 7', 'Das gilt nur für starke Säure + starke Base.'], ['bei pH = pK_S = 4,76', 'Das ist der Halbäquivalenzpunkt.'], ['im Sauren', 'Am Äquivalenzpunkt liegt nur Acetat vor – eine schwache Base.']],
    'Am Äquivalenzpunkt ist alle Essigsäure zu Acetat umgesetzt; Acetat reagiert basisch.'),
  sc('c3-halbaeq', SB, SB_OBJ.titration, 'anwendung', 'begriff', 'Bei einer Titration liegt der pH am Halbäquivalenzpunkt bei 3,9. Was kann man daraus ablesen?',
    'Der pK_S der titrierten Säure ist etwa 3,9.', [['Die Säure ist eine starke Säure.', 'Starke Säuren haben keinen Pufferbereich mit Halbäquivalenzpunkt pH = pK_S.'], ['Die Konzentration der Säure ist 10⁻³·⁹ mol/l.', 'Am Halbäquivalenzpunkt ist [HA] = [A⁻], deshalb pH = pK_S – nicht die Konzentration.'], ['Der Äquivalenzpunkt liegt bei pH 7,8.', 'Der Äquivalenzpunkt ist nicht doppelt so hoch.']],
    'Henderson-Hasselbalch mit [A⁻]/[HA] = 1: pH = pK_S. So bestimmt man pK_S-Werte experimentell (hier z. B. Milchsäure).'),
  sc('c3-verbrauch', SB, SB_OBJ.titration, 'anwendung', 'rechnen', '25 ml Schwefelsäure (c = 0,1 mol/l) werden mit Natronlauge (c = 0,1 mol/l) titriert. Wie viel Lauge wird bis zum Äquivalenzpunkt gebraucht?',
    '50 ml', [['25 ml', 'Schwefelsäure gibt zwei Protonen ab (z = 2).'], ['12,5 ml', 'Es wird mehr, nicht weniger Lauge gebraucht.'], ['100 ml', 'Nur doppelt so viel, nicht viermal so viel.']],
    'n(H⁺) = 2 · 0,1 mol/l · 0,025 l = 5 mmol → V(NaOH) = 5 mmol / 0,1 mol/l = 50 ml.'),
];
