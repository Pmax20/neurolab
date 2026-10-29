import type { Lesson, Structure } from './types';

// Anatomie II und III (Leipzig, 1. Semester, Themenplan WS 2026/27):
// Nervensystem · Herz · Kreislauf und Gefäße · Blut und Gefäßwand (Histologie) · Haut und Drüsen (Histologie) ·
// Rumpfwand · obere Extremität · untere Extremität.

const S = 'zu_pruefen' as const;
const P = (locator: string) => ({ id: 'schuenke', locator });
const D = (locator: string) => ({ id: 'duale-reihe-anatomie', locator });
const L = (locator: string) => ({ id: 'luellmann', locator });

type Fig = Structure['figure'];
const st = (figure: Fig, id: string, deName: string, sciName: string, synonyms: string[], short: string, long: string, fn: string, location: string, connections: string[], lessons: string[], src: { id: string; locator: string }): Structure => ({
  id, deName, sciName, synonyms, short, long, function: fn, location, connections, lessons, figure, sources: [src], status: S,
});

// ===========================================================================
// Strukturen
// ===========================================================================

export const ANATOMY2_STRUCTURES: Structure[] = [
  // ---- Rückenmark und Spinalnerv (Querschnitt)
  st('spinal', 'n-vorderhorn', 'Vorderhorn', 'Cornu anterius', ['Columna anterior'], 'Vorderer Teil der grauen Substanz mit den motorischen Neuronen.', 'Hier liegen die Zellkörper der α- und γ-Motoneurone, deren Axone über die vordere Wurzel zur Skelettmuskulatur ziehen.', 'Somatomotorik: Ansteuerung der Skelettmuskulatur.', 'Graue Substanz des Rückenmarks, vorne.', ['n-radix-anterior', 'n-hinterhorn'], ['nervensystem'], D('Kap. Rückenmark')),
  st('spinal', 'n-hinterhorn', 'Hinterhorn', 'Cornu posterius', ['Columna posterior'], 'Hinterer Teil der grauen Substanz; hier enden sensible Fasern.', 'In das Hinterhorn ziehen die Fasern der hinteren Wurzel und werden auf Neurone umgeschaltet, die z. B. Schmerz- und Temperaturinformation weiterleiten.', 'Verarbeitung sensibler Information.', 'Graue Substanz des Rückenmarks, hinten.', ['n-radix-posterior', 'n-vorderhorn'], ['nervensystem'], D('Kap. Rückenmark')),
  st('spinal', 'n-seitenhorn', 'Seitenhorn', 'Cornu laterale', ['Columna intermedia'], 'Seitlicher Fortsatz der grauen Substanz mit vegetativen Neuronen.', 'Deutlich ausgebildet im Brust- und oberen Lendenmark (etwa Th1–L2): Ursprung des Sympathikus.', 'Vegetative (sympathische) Efferenzen.', 'Graue Substanz, seitlich, nur in bestimmten Rückenmarkssegmenten.', ['n-vorderhorn'], ['nervensystem'], D('Kap. Rückenmark')),
  st('spinal', 'n-weisse-substanz', 'Weiße Substanz', 'Substantia alba', ['Stränge', 'Funiculi'], 'Außenschicht des Rückenmarks aus auf- und absteigenden Nervenfasern.', 'Die weiße Farbe stammt von den Markscheiden (Myelin). Sie gliedert sich in Vorder-, Seiten- und Hinterstrang.', 'Leitung zwischen Gehirn und Rückenmarkssegmenten.', 'Um die graue Substanz herum.', ['n-vorderhorn', 'n-hinterhorn'], ['nervensystem'], D('Kap. Rückenmark')),
  st('spinal', 'n-zentralkanal', 'Zentralkanal', 'Canalis centralis', [], 'Enger, liquorgefüllter Kanal in der Mitte der grauen Substanz.', 'Er setzt das Ventrikelsystem des Gehirns nach unten fort und ist beim Erwachsenen oft teilweise verschlossen.', 'Rest des embryonalen Neuralrohrlumens.', 'Mitte des Rückenmarks.', ['n-vorderhorn'], ['nervensystem'], D('Kap. Rückenmark')),
  st('spinal', 'n-radix-anterior', 'Vordere Wurzel', 'Radix anterior', ['Vorderwurzel', 'motorische Wurzel'], 'Austretende motorische (efferente) Fasern aus dem Vorderhorn.', 'Enthält die Axone der Motoneurone und – in den entsprechenden Segmenten – vegetative Fasern.', 'Efferente Leitung zum Erfolgsorgan.', 'Zwischen Vorderhorn und Spinalnerv.', ['n-vorderhorn', 'n-spinalnerv'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-radix-posterior', 'Hintere Wurzel', 'Radix posterior', ['Hinterwurzel', 'sensible Wurzel'], 'Eintretende sensible (afferente) Fasern mit dem Spinalganglion.', 'Die Zellkörper dieser sensiblen Neurone liegen nicht im Rückenmark, sondern im Spinalganglion.', 'Afferente Leitung von Haut, Muskeln und Gelenken.', 'Zwischen Spinalnerv und Hinterhorn.', ['n-spinalganglion', 'n-hinterhorn'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-spinalganglion', 'Spinalganglion', 'Ganglion sensorium nervi spinalis', ['Hinterwurzelganglion'], 'Verdickung der hinteren Wurzel mit den Zellkörpern der sensiblen Neurone.', 'Die Neurone sind pseudounipolar: ein Fortsatz zieht zur Peripherie, der andere ins Rückenmark. Im Spinalganglion findet keine Umschaltung statt.', 'Enthält die Perikaryen der ersten sensiblen Neurone.', 'Im Foramen intervertebrale.', ['n-radix-posterior'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-spinalnerv', 'Spinalnerv', 'Nervus spinalis', ['Spinalnerven'], 'Gemischter Nerv aus vorderer und hinterer Wurzel.', 'Es gibt 31 Paare: 8 zervikale, 12 thorakale, 5 lumbale, 5 sakrale und meist 1 kokzygeales. Der Stamm ist nur etwa 1 cm lang.', 'Führt motorische, sensible und vegetative Fasern.', 'Im Foramen intervertebrale.', ['n-radix-anterior', 'n-radix-posterior', 'n-ramus-anterior', 'n-ramus-posterior'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-ramus-anterior', 'Vorderer Ast', 'Ramus anterior', ['Ramus ventralis'], 'Größerer Ast des Spinalnervs für vordere und seitliche Rumpfwand und die Extremitäten.', 'Die vorderen Äste bilden die Nervengeflechte (Plexus cervicalis, brachialis, lumbosacralis); im Brustbereich ziehen sie als Interkostalnerven.', 'Versorgung von Rumpfvorderseite und Gliedmaßen.', 'Nach vorne-seitlich vom Spinalnerv.', ['n-spinalnerv'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-ramus-posterior', 'Hinterer Ast', 'Ramus posterior', ['Ramus dorsalis'], 'Kleinerer Ast für die autochthone Rückenmuskulatur und die Rückenhaut.', 'Die hinteren Äste bleiben segmental und bilden keine Plexus.', 'Versorgung von tiefer Rückenmuskulatur und Rückenhaut.', 'Nach hinten vom Spinalnerv.', ['n-spinalnerv'], ['nervensystem'], D('Kap. Spinalnerven')),
  st('spinal', 'n-dura', 'Harte Hirnhaut', 'Dura mater spinalis', ['Dura', 'Hirnhäute'], 'Äußere, derbe Hülle aus straffem Bindegewebe um Rückenmark und Wurzeln.', 'Von innen nach außen: Pia mater (liegt dem Rückenmark auf), Arachnoidea mater, Dura mater. Zwischen Pia und Arachnoidea liegt der liquorgefüllte Subarachnoidalraum.', 'Schutz von Rückenmark und Nervenwurzeln.', 'Außen um das Rückenmark im Wirbelkanal.', ['n-weisse-substanz'], ['nervensystem'], D('Kap. Hüllen des Rückenmarks')),

  // ---- Herz (Frontalschnitt)
  st('heart', 'c-rechter-vorhof', 'Rechter Vorhof', 'Atrium dextrum', ['rechtes Atrium'], 'Nimmt sauerstoffarmes Blut aus dem Körper auf.', 'Hier münden obere und untere Hohlvene sowie der Sinus coronarius (Herzvenen). In seiner Wand liegt der Sinusknoten.', 'Sammeln des venösen Blutes aus dem Körperkreislauf.', 'Rechts oben im Herzen.', ['c-vena-cava-sup', 'c-vena-cava-inf', 'c-trikuspidal', 'c-sinusknoten'], ['herz'], D('Kap. Herz')),
  st('heart', 'c-rechter-ventrikel', 'Rechte Kammer', 'Ventriculus dexter', ['rechter Ventrikel'], 'Pumpt sauerstoffarmes Blut in den Lungenkreislauf.', 'Ihre Wand ist deutlich dünner als die der linken Kammer, weil der Druck im Lungenkreislauf niedrig ist. Sie bildet den größten Teil der Herzvorderfläche.', 'Auswurf in den Truncus pulmonalis.', 'Vorne, rechts unten.', ['c-trikuspidal', 'c-pulmonalklappe', 'c-truncus-pulmonalis'], ['herz'], D('Kap. Herz')),
  st('heart', 'c-linker-vorhof', 'Linker Vorhof', 'Atrium sinistrum', ['linkes Atrium'], 'Nimmt sauerstoffreiches Blut aus der Lunge auf.', 'In ihn münden die (meist vier) Lungenvenen. Er bildet den größten Teil der Herzhinterwand.', 'Sammeln des Blutes aus dem Lungenkreislauf.', 'Links oben, hinten.', ['c-venae-pulmonales', 'c-mitral'], ['herz'], D('Kap. Herz')),
  st('heart', 'c-linker-ventrikel', 'Linke Kammer', 'Ventriculus sinister', ['linker Ventrikel'], 'Pumpt sauerstoffreiches Blut in den Körperkreislauf.', 'Mit etwa 8–12 mm die dickste Wand des Herzens, weil sie gegen den hohen Druck im Körperkreislauf arbeitet. Sie bildet die Herzspitze.', 'Auswurf in die Aorta.', 'Links unten.', ['c-mitral', 'c-aortenklappe', 'c-aorta'], ['herz'], D('Kap. Herz')),
  st('heart', 'c-septum', 'Kammerscheidewand', 'Septum interventriculare', ['Septum'], 'Trennwand zwischen rechter und linker Kammer.', 'Überwiegend muskulär, oben ein kleiner membranöser Teil. In ihr laufen His-Bündel und Tawara-Schenkel.', 'Trennung der beiden Kreisläufe, Träger des Erregungsleitungssystems.', 'Zwischen den Kammern.', ['c-his', 'c-linker-ventrikel', 'c-rechter-ventrikel'], ['herz'], D('Kap. Herz')),
  st('heart', 'c-trikuspidal', 'Trikuspidalklappe', 'Valva tricuspidalis', ['rechte Segelklappe', 'Valva atrioventricularis dextra'], 'Segelklappe mit drei Segeln zwischen rechtem Vorhof und rechter Kammer.', 'Die Segel sind über Sehnenfäden (Chordae tendineae) an Papillarmuskeln befestigt, die ein Durchschlagen in den Vorhof verhindern.', 'Verhindert Rückfluss in den rechten Vorhof während der Systole.', 'Rechte Vorhof-Kammer-Grenze.', ['c-rechter-vorhof', 'c-rechter-ventrikel'], ['herz'], D('Kap. Herzklappen')),
  st('heart', 'c-mitral', 'Mitralklappe', 'Valva mitralis', ['Bikuspidalklappe', 'linke Segelklappe'], 'Segelklappe mit zwei Segeln zwischen linkem Vorhof und linker Kammer.', 'Wie die Trikuspidalklappe über Chordae tendineae und Papillarmuskeln gesichert.', 'Verhindert Rückfluss in den linken Vorhof.', 'Linke Vorhof-Kammer-Grenze.', ['c-linker-vorhof', 'c-linker-ventrikel'], ['herz'], D('Kap. Herzklappen')),
  st('heart', 'c-pulmonalklappe', 'Pulmonalklappe', 'Valva trunci pulmonalis', ['Pulmonalklappe'], 'Taschenklappe mit drei Taschen am Ausgang der rechten Kammer.', 'Taschenklappen haben keine Sehnenfäden; sie schließen passiv, wenn sich die Taschen mit zurückströmendem Blut füllen.', 'Verhindert Rückfluss aus dem Truncus pulmonalis in die Kammer.', 'Zwischen rechter Kammer und Truncus pulmonalis.', ['c-rechter-ventrikel', 'c-truncus-pulmonalis'], ['herz'], D('Kap. Herzklappen')),
  st('heart', 'c-aortenklappe', 'Aortenklappe', 'Valva aortae', ['Aortenklappe'], 'Taschenklappe mit drei Taschen am Ausgang der linken Kammer.', 'Oberhalb zweier Taschen entspringen die Herzkranzarterien (A. coronaria dextra und sinistra).', 'Verhindert Rückfluss aus der Aorta in die linke Kammer.', 'Zwischen linker Kammer und Aorta.', ['c-linker-ventrikel', 'c-aorta'], ['herz'], D('Kap. Herzklappen')),
  st('heart', 'c-aorta', 'Aorta', 'Aorta', ['Hauptschlagader'], 'Größte Arterie; führt sauerstoffreiches Blut aus der linken Kammer in den Körper.', 'Gliedert sich in Pars ascendens, Arcus aortae, Pars descendens (Pars thoracica und abdominalis).', 'Verteilung des Blutes in den Körperkreislauf, Windkesselfunktion.', 'Aus der linken Kammer nach oben, dann bogenförmig nach links hinten.', ['c-aortenklappe', 'v-aortenbogen'], ['herz', 'gefaesssystem'], D('Kap. Herz')),
  st('heart', 'c-truncus-pulmonalis', 'Lungenschlagader', 'Truncus pulmonalis', ['Truncus pulmonalis'], 'Führt sauerstoffarmes Blut aus der rechten Kammer zur Lunge.', 'Teilt sich unter dem Aortenbogen in die rechte und linke A. pulmonalis. Obwohl er sauerstoffarmes Blut führt, ist er eine Arterie – Arterien führen vom Herzen weg.', 'Zufluss zum Lungenkreislauf.', 'Vor der Aorta, aus der rechten Kammer.', ['c-pulmonalklappe', 'c-rechter-ventrikel'], ['herz', 'gefaesssystem'], D('Kap. Herz')),
  st('heart', 'c-vena-cava-sup', 'Obere Hohlvene', 'Vena cava superior', ['V. cava superior'], 'Bringt das Blut aus Kopf, Hals, Armen und oberem Rumpf zum rechten Vorhof.', 'Entsteht aus dem Zusammenfluss der beiden Vv. brachiocephalicae.', 'Venöser Rückfluss aus der oberen Körperhälfte.', 'Rechts neben der aufsteigenden Aorta.', ['c-rechter-vorhof'], ['herz', 'gefaesssystem'], D('Kap. Herz')),
  st('heart', 'c-vena-cava-inf', 'Untere Hohlvene', 'Vena cava inferior', ['V. cava inferior'], 'Bringt das Blut aus Beinen, Becken und Bauchraum zum rechten Vorhof.', 'Größte Vene des Körpers; sie durchtritt das Zwerchfell und mündet unten in den rechten Vorhof.', 'Venöser Rückfluss aus der unteren Körperhälfte.', 'Rechts der Wirbelsäule.', ['c-rechter-vorhof'], ['herz', 'gefaesssystem'], D('Kap. Herz')),
  st('heart', 'c-venae-pulmonales', 'Lungenvenen', 'Venae pulmonales', ['Lungenvenen'], 'Führen sauerstoffreiches Blut aus der Lunge zum linken Vorhof.', 'Meist zwei pro Seite. Es sind Venen, obwohl sie sauerstoffreiches Blut führen – Venen führen zum Herzen hin.', 'Rückfluss aus dem Lungenkreislauf.', 'Münden hinten in den linken Vorhof.', ['c-linker-vorhof'], ['herz', 'gefaesssystem'], D('Kap. Herz')),
  st('heart', 'c-sinusknoten', 'Sinusknoten', 'Nodus sinuatrialis', ['Sinusknoten'], 'Primärer Schrittmacher des Herzens.', 'Liegt in der Wand des rechten Vorhofs nahe der Mündung der oberen Hohlvene und erzeugt in Ruhe etwa 60–80 Erregungen pro Minute.', 'Bildung der Herzerregung.', 'Rechter Vorhof, an der Einmündung der V. cava superior.', ['c-av-knoten', 'c-rechter-vorhof'], ['herz'], D('Kap. Erregungsbildungs- und -leitungssystem')),
  st('heart', 'c-av-knoten', 'AV-Knoten', 'Nodus atrioventricularis', ['Atrioventrikularknoten'], 'Einzige elektrische Verbindung zwischen Vorhöfen und Kammern.', 'Liegt im Vorhofseptum nahe der Trikuspidalklappe. Er verzögert die Erregung, damit sich die Vorhöfe vor den Kammern kontrahieren. Das bindegewebige Herzskelett isoliert sonst Vorhöfe und Kammern elektrisch.', 'Überleitung und Verzögerung der Erregung.', 'Unteres Vorhofseptum.', ['c-sinusknoten', 'c-his'], ['herz'], D('Kap. Erregungsbildungs- und -leitungssystem')),
  st('heart', 'c-his', 'His-Bündel und Tawara-Schenkel', 'Fasciculus atrioventricularis, Crus dextrum et sinistrum', ['His-Bündel', 'Tawara-Schenkel', 'Purkinje-Fasern'], 'Leiten die Erregung über das Kammerseptum zur Herzspitze.', 'Das His-Bündel teilt sich im Septum in einen rechten und einen linken Tawara-Schenkel, die in den Purkinje-Fasern unter dem Endokard enden.', 'Schnelle Ausbreitung der Erregung in den Kammern, von der Spitze zur Basis.', 'Im Kammerseptum.', ['c-av-knoten', 'c-septum'], ['herz'], D('Kap. Erregungsbildungs- und -leitungssystem')),

  // ---- Große Gefäße (Schema)
  st('vessels', 'v-aortenbogen', 'Aortenbogen', 'Arcus aortae', ['Arcus aortae'], 'Bogenförmiger Teil der Aorta, aus dem die Gefäße für Kopf und Arme entspringen.', 'Von rechts nach links entspringen: Truncus brachiocephalicus, A. carotis communis sinistra, A. subclavia sinistra.', 'Verteilung des Blutes zu Kopf, Hals und Armen.', 'Oberes Mediastinum, über dem Herzen.', ['c-aorta', 'v-truncus-brachiocephalicus', 'v-carotis', 'v-subclavia'], ['gefaesssystem'], D('Kap. Aorta')),
  st('vessels', 'v-truncus-brachiocephalicus', 'Truncus brachiocephalicus', 'Truncus brachiocephalicus', [], 'Erster Ast des Aortenbogens; nur rechts vorhanden.', 'Teilt sich in die rechte A. subclavia und die rechte A. carotis communis.', 'Versorgung von rechtem Arm und rechter Kopf-Hals-Seite.', 'Rechts, erster Abgang aus dem Aortenbogen.', ['v-aortenbogen', 'v-carotis', 'v-subclavia'], ['gefaesssystem'], D('Kap. Aorta')),
  st('vessels', 'v-carotis', 'Halsschlagader', 'Arteria carotis communis', ['A. carotis communis', 'Karotis'], 'Versorgt Kopf und Hals; teilt sich in A. carotis interna und externa.', 'Links entspringt sie direkt aus dem Aortenbogen, rechts aus dem Truncus brachiocephalicus. Die A. carotis interna versorgt große Teile des Gehirns.', 'Blutversorgung von Gehirn und Gesicht.', 'Seitlich am Hals.', ['v-aortenbogen', 'v-truncus-brachiocephalicus'], ['gefaesssystem'], D('Kap. Arterien von Kopf und Hals')),
  st('vessels', 'v-subclavia', 'Schlüsselbeinarterie', 'Arteria subclavia', ['A. subclavia'], 'Versorgt den Arm; geht in die A. axillaris und A. brachialis über.', 'Links direkt aus dem Aortenbogen, rechts aus dem Truncus brachiocephalicus. Gibt u. a. die A. vertebralis zum Gehirn ab.', 'Blutversorgung der oberen Extremität.', 'Unter dem Schlüsselbein.', ['v-aortenbogen', 'v-truncus-brachiocephalicus'], ['gefaesssystem', 'obere-extremitaet'], D('Kap. Arterien der oberen Extremität')),
  st('vessels', 'v-aorta-abdominalis', 'Bauchaorta', 'Pars abdominalis aortae', ['Aorta abdominalis'], 'Abschnitt der Aorta unterhalb des Zwerchfells.', 'Gibt die Gefäße für Bauchorgane und Nieren ab und teilt sich etwa in Höhe des 4. Lendenwirbels in die beiden Aa. iliacae communes (Bifurcatio aortae).', 'Versorgung von Bauchorganen, Nieren, Becken und Beinen.', 'Vor der Lendenwirbelsäule, links der V. cava inferior.', ['v-aortenbogen', 'v-iliaca'], ['gefaesssystem'], D('Kap. Aorta')),
  st('vessels', 'v-iliaca', 'Beckenarterie', 'Arteria iliaca communis', ['A. iliaca communis'], 'Endäste der Aorta; teilen sich in A. iliaca interna (Becken) und externa (Bein).', 'Die A. iliaca externa wird unter dem Leistenband zur A. femoralis.', 'Versorgung von Becken und Beinen.', 'Im Becken, ab etwa L4.', ['v-aorta-abdominalis'], ['gefaesssystem', 'untere-extremitaet'], D('Kap. Arterien der unteren Extremität')),
  st('vessels', 'v-pfortader', 'Pfortader', 'Vena portae hepatis', ['V. portae'], 'Bringt nährstoffreiches Blut aus Magen, Darm und Milz zur Leber.', 'Das Blut passiert so zwei Kapillarnetze hintereinander (Darm, dann Leber) – ein Pfortaderkreislauf. Erst danach gelangt es über die Lebervenen in die untere Hohlvene.', 'Transport resorbierter Stoffe zur Leber.', 'Leberpforte, hinter Pankreaskopf entstehend.', ['c-vena-cava-inf'], ['gefaesssystem'], D('Kap. Pfortadersystem')),

  // ---- Wirbelsäule und Wirbel
  st('spine', 'r-hws', 'Halswirbelsäule', 'Pars cervicalis columnae vertebralis', ['HWS', 'Halswirbel'], '7 Halswirbel (C1–C7) mit nach vorne gerichteter Krümmung (Lordose).', 'Der 1. Halswirbel (Atlas) hat keinen Wirbelkörper, der 2. (Axis) trägt den Dens. Halswirbel haben ein Foramen transversarium für die A. vertebralis.', 'Bewegung und Tragen des Kopfes.', 'Hals.', ['r-bws'], ['rumpfwand'], P('Rumpf: Wirbelsäule')),
  st('spine', 'r-bws', 'Brustwirbelsäule', 'Pars thoracica columnae vertebralis', ['BWS', 'Brustwirbel'], '12 Brustwirbel (Th1–Th12) mit nach hinten gerichteter Krümmung (Kyphose).', 'Brustwirbel tragen Gelenkflächen für die Rippen und lange, dachziegelartig nach unten zeigende Dornfortsätze.', 'Verbindung mit den Rippen zum Brustkorb.', 'Brustbereich.', ['r-hws', 'r-lws', 't-costae-verae'], ['rumpfwand'], P('Rumpf: Wirbelsäule')),
  st('spine', 'r-lws', 'Lendenwirbelsäule', 'Pars lumbalis columnae vertebralis', ['LWS', 'Lendenwirbel'], '5 Lendenwirbel (L1–L5) mit Lordose; die größten Wirbelkörper.', 'Unterhalb von etwa L1/L2 endet beim Erwachsenen das Rückenmark; darunter liegen nur noch Nervenwurzeln (Cauda equina) – deshalb Lumbalpunktion zwischen L3/L4 oder L4/L5.', 'Tragen der Last des Oberkörpers.', 'Lendenbereich.', ['r-bws', 'r-sacrum'], ['rumpfwand', 'nervensystem'], P('Rumpf: Wirbelsäule')),
  st('spine', 'r-sacrum', 'Kreuzbein', 'Os sacrum', ['Sacrum'], 'Aus 5 verschmolzenen Sakralwirbeln; Teil des Beckenrings.', 'Bildet mit den Hüftbeinen die Iliosakralgelenke. Seine Krümmung ist nach hinten gerichtet (Kyphose).', 'Kraftübertragung von der Wirbelsäule auf das Becken.', 'Hinterer Teil des Beckens.', ['r-lws', 'r-coccyx', 'k-becken'], ['rumpfwand', 'untere-extremitaet'], P('Rumpf: Wirbelsäule')),
  st('spine', 'r-coccyx', 'Steißbein', 'Os coccygis', ['Steißbein'], 'Rudimentäre, aus 3–5 kleinen Wirbeln verschmolzene Spitze der Wirbelsäule.', 'Ansatz von Muskeln und Bändern des Beckenbodens.', 'Befestigung des Beckenbodens.', 'Unterhalb des Kreuzbeins.', ['r-sacrum'], ['rumpfwand'], P('Rumpf: Wirbelsäule')),
  st('spine', 'r-wirbelkoerper', 'Wirbelkörper', 'Corpus vertebrae', ['Wirbelkörper'], 'Tragender, zylindrischer Vorderteil des Wirbels.', 'Aus Spongiosa mit dünner Kompakta; zwischen den Wirbelkörpern liegen die Bandscheiben.', 'Lastübertragung.', 'Vorne am Wirbel.', ['r-wirbelbogen', 'r-anulus'], ['rumpfwand'], P('Rumpf: Wirbel')),
  st('spine', 'r-wirbelbogen', 'Wirbelbogen', 'Arcus vertebrae', ['Wirbelbogen'], 'Hinterer Teil des Wirbels; umschließt mit dem Körper das Wirbelloch.', 'Trägt Dorn-, Quer- und Gelenkfortsätze.', 'Schutz des Rückenmarks, Ursprung der Fortsätze.', 'Hinter dem Wirbelkörper.', ['r-wirbelkoerper', 'r-dornfortsatz', 'r-querfortsatz'], ['rumpfwand'], P('Rumpf: Wirbel')),
  st('spine', 'r-foramen', 'Wirbelloch', 'Foramen vertebrale', ['Wirbelkanal', 'Canalis vertebralis'], 'Öffnung zwischen Wirbelkörper und Wirbelbogen.', 'Alle Wirbellöcher zusammen bilden den Wirbelkanal mit Rückenmark und Hirnhäuten.', 'Raum für Rückenmark und Nervenwurzeln.', 'Zwischen Körper und Bogen.', ['r-wirbelbogen', 'n-dura'], ['rumpfwand', 'nervensystem'], P('Rumpf: Wirbel')),
  st('spine', 'r-dornfortsatz', 'Dornfortsatz', 'Processus spinosus', ['Dornfortsatz'], 'Nach hinten gerichteter Fortsatz; unter der Haut tastbar.', 'Der Dornfortsatz von C7 (Vertebra prominens) ist besonders gut tastbar und dient als Orientierung.', 'Hebel und Ansatz für Rückenmuskeln und Bänder.', 'Hinten in der Mittellinie.', ['r-wirbelbogen'], ['rumpfwand'], P('Rumpf: Wirbel')),
  st('spine', 'r-querfortsatz', 'Querfortsatz', 'Processus transversus', ['Querfortsatz'], 'Seitlicher Fortsatz des Wirbelbogens.', 'An den Brustwirbeln tragen die Querfortsätze Gelenkflächen für die Rippenhöcker.', 'Ansatz für Muskeln und Bänder, Rippengelenke.', 'Seitlich am Wirbelbogen.', ['r-wirbelbogen'], ['rumpfwand'], P('Rumpf: Wirbel')),
  st('spine', 'r-anulus', 'Faserring der Bandscheibe', 'Anulus fibrosus', ['Bandscheibe', 'Discus intervertebralis'], 'Äußerer Ring der Bandscheibe aus Faserknorpel und straffem Bindegewebe.', 'Umschließt den Gallertkern. Reißt er ein, kann Kernmaterial austreten (Bandscheibenvorfall), meist nach hinten-seitlich in Richtung der Nervenwurzeln.', 'Zusammenhalt der Wirbel, Begrenzung der Bewegung.', 'Zwischen zwei Wirbelkörpern, außen.', ['r-nucleus', 'r-wirbelkoerper', 'h-knorpel-faser'], ['rumpfwand'], P('Rumpf: Bandscheibe')),
  st('spine', 'r-nucleus', 'Gallertkern', 'Nucleus pulposus', ['Gallertkern'], 'Wasserreicher Kern der Bandscheibe.', 'Verteilt Druck gleichmäßig wie ein Wasserkissen; verliert mit dem Alter Wasser.', 'Druckverteilung zwischen den Wirbelkörpern.', 'In der Mitte der Bandscheibe.', ['r-anulus'], ['rumpfwand'], P('Rumpf: Bandscheibe')),

  // ---- Brustkorb und Bauchwand
  st('trunk', 't-manubrium', 'Handgriff des Brustbeins', 'Manubrium sterni', ['Manubrium'], 'Oberer Teil des Brustbeins; trägt die Gelenkflächen für die Schlüsselbeine.', 'Die Verbindung zum Brustbeinkörper bildet einen tastbaren Winkel (Angulus sterni) – auf seiner Höhe setzt die 2. Rippe an. Damit zählt man Rippen und Zwischenrippenräume ab.', 'Verbindung mit Schlüsselbein und 1. Rippe.', 'Oberes Sternum.', ['t-corpus-sterni', 'k-clavicula'], ['rumpfwand'], P('Rumpf: Thoraxskelett')),
  st('trunk', 't-corpus-sterni', 'Brustbeinkörper', 'Corpus sterni', ['Corpus sterni'], 'Mittlerer, längster Teil des Brustbeins.', 'Hier setzen die Rippenknorpel der 2. bis 7. Rippe an.', 'Vordere Befestigung der Rippen.', 'Vordere Mittellinie.', ['t-manubrium', 't-xiphoid', 't-costae-verae'], ['rumpfwand'], P('Rumpf: Thoraxskelett')),
  st('trunk', 't-xiphoid', 'Schwertfortsatz', 'Processus xiphoideus', ['Xiphoid'], 'Kleiner unterer Fortsatz des Brustbeins.', 'Lange knorpelig; Ansatz der Linea alba und von Zwerchfellanteilen. Bei der Herzdruckmassage nicht auf den Schwertfortsatz drücken.', 'Ansatz von Bauchmuskeln und Zwerchfell.', 'Unteres Ende des Sternums.', ['t-corpus-sterni', 't-linea-alba'], ['rumpfwand'], P('Rumpf: Thoraxskelett')),
  st('trunk', 't-costae-verae', 'Echte Rippen', 'Costae verae', ['Rippen 1–7'], 'Rippen 1–7: direkt über ihren Knorpel mit dem Brustbein verbunden.', 'Insgesamt gibt es 12 Rippenpaare. Jede Rippe ist hinten gelenkig mit der Brustwirbelsäule verbunden.', 'Bilden mit Sternum und BWS den knöchernen Brustkorb.', 'Oberer Brustkorb.', ['t-corpus-sterni', 'r-bws'], ['rumpfwand'], P('Rumpf: Rippen')),
  st('trunk', 't-costae-spuriae', 'Falsche Rippen', 'Costae spuriae', ['Rippen 8–10'], 'Rippen 8–10: über den gemeinsamen Rippenbogen indirekt mit dem Brustbein verbunden.', 'Ihre Knorpel legen sich jeweils an den darüberliegenden Rippenknorpel an und bilden den tastbaren Rippenbogen (Arcus costalis).', 'Elastische Begrenzung des unteren Thorax.', 'Unterer Brustkorb.', ['t-costae-verae', 't-costae-fluctuantes'], ['rumpfwand'], P('Rumpf: Rippen')),
  st('trunk', 't-costae-fluctuantes', 'Freie Rippen', 'Costae fluctuantes', ['Rippen 11–12', 'fliegende Rippen'], 'Rippen 11 und 12: enden frei in der Bauchwandmuskulatur.', 'Sie haben keine Verbindung zum Brustbein.', 'Schutz der Nieren von hinten, Muskelansatz.', 'Seitlich-hinten am unteren Thorax.', ['t-costae-spuriae'], ['rumpfwand'], P('Rumpf: Rippen')),
  st('trunk', 't-zwerchfell', 'Zwerchfell', 'Diaphragma', ['Diaphragma'], 'Kuppelförmige Muskelplatte zwischen Brust- und Bauchhöhle; wichtigster Atemmuskel.', 'Kontrahiert es, flacht die Kuppel ab und der Brustraum wird größer (Einatmung). Innerviert vom N. phrenicus aus den Segmenten C3–C5. Speiseröhre, Aorta und untere Hohlvene ziehen hindurch.', 'Inspiration; Trennung von Thorax und Abdomen.', 'Unterer Rand des Brustkorbs, kuppelförmig nach oben gewölbt.', ['t-costae-spuriae', 'c-vena-cava-inf'], ['rumpfwand'], P('Rumpf: Zwerchfell')),
  st('trunk', 't-rectus', 'Gerader Bauchmuskel', 'Musculus rectus abdominis', ['Rectus', 'M. rectus abdominis'], 'Paariger, gerader Muskel der vorderen Bauchwand mit Zwischensehnen.', 'Die Zwischensehnen (Intersectiones tendineae) gliedern ihn in Bäuche („Sixpack“). Er liegt in der Rektusscheide, die von den Aponeurosen der seitlichen Bauchmuskeln gebildet wird.', 'Rumpfbeugung, Bauchpresse.', 'Vordere Bauchwand, beidseits der Mittellinie.', ['t-linea-alba', 't-obliquus'], ['rumpfwand'], P('Rumpf: Bauchwand')),
  st('trunk', 't-linea-alba', 'Linea alba', 'Linea alba', ['weiße Linie'], 'Sehniger Streifen in der vorderen Mittellinie zwischen Schwertfortsatz und Schambein.', 'Hier verflechten sich die Aponeurosen der seitlichen Bauchmuskeln beider Seiten. Sie ist fast gefäßfrei.', 'Verankerung der Bauchmuskeln, Zuggurtung.', 'Vordere Mittellinie des Bauchs.', ['t-rectus', 't-xiphoid'], ['rumpfwand'], P('Rumpf: Bauchwand')),
  st('trunk', 't-obliquus', 'Äußerer schräger Bauchmuskel', 'Musculus obliquus externus abdominis', ['Obliquus externus'], 'Oberflächlichster seitlicher Bauchmuskel; Fasern laufen wie Hände in den Hosentaschen.', 'Darunter liegen der M. obliquus internus (Fasern etwa senkrecht dazu) und der M. transversus abdominis (quer). Sein unterer Rand bildet das Leistenband.', 'Rumpfdrehung zur Gegenseite, Seitneigung, Bauchpresse.', 'Seitliche Bauchwand.', ['t-rectus', 't-linea-alba'], ['rumpfwand'], P('Rumpf: Bauchwand')),

  // ---- Obere Extremität (Skelett, rechte Seite von vorne; Nerven als Einblendung)
  st('arm', 'o-scaphoid', 'Kahnbein', 'Os scaphoideum', ['Scaphoid'], 'Proximale Handwurzelreihe, daumenseitig.', 'Häufigste Handwurzelfraktur nach Sturz auf die ausgestreckte Hand; heilt wegen ungünstiger Blutversorgung oft schlecht.', 'Gelenk mit dem Radius.', 'Proximale Reihe, ganz lateral.', ['o-lunatum', 'b-radius', 'o-trapezium'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-lunatum', 'Mondbein', 'Os lunatum', ['Lunatum'], 'Proximale Handwurzelreihe, zwischen Kahn- und Dreiecksbein.', 'Artikuliert mit dem Radius; kann nach palmar luxieren.', 'Teil des proximalen Handgelenks.', 'Proximale Reihe, Mitte.', ['o-scaphoid', 'o-triquetrum'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-triquetrum', 'Dreiecksbein', 'Os triquetrum', ['Triquetrum'], 'Proximale Handwurzelreihe, kleinfingerseitig.', 'Trägt auf seiner Palmarseite das Erbsenbein.', 'Teil der proximalen Reihe.', 'Proximale Reihe, medial.', ['o-lunatum', 'o-pisiforme'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-pisiforme', 'Erbsenbein', 'Os pisiforme', ['Pisiforme'], 'Kleines Sesambein auf dem Dreiecksbein, in der Sehne des M. flexor carpi ulnaris.', 'Gut tastbar am kleinfingerseitigen Handgelenk.', 'Hebel für den M. flexor carpi ulnaris.', 'Proximale Reihe, ganz medial, palmar.', ['o-triquetrum'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-trapezium', 'Großes Vieleckbein', 'Os trapezium', ['Trapezium'], 'Distale Handwurzelreihe, daumenseitig; bildet das Daumensattelgelenk.', 'Das Sattelgelenk zwischen Trapezium und 1. Mittelhandknochen ermöglicht die Opposition des Daumens.', 'Daumensattelgelenk.', 'Distale Reihe, ganz lateral.', ['o-scaphoid', 'o-trapezoideum'], ['obere-extremitaet', 'gelenke'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-trapezoideum', 'Kleines Vieleckbein', 'Os trapezoideum', ['Trapezoideum'], 'Distale Handwurzelreihe zwischen Trapezium und Kopfbein.', 'Artikuliert mit dem 2. Mittelhandknochen.', 'Teil der distalen Reihe.', 'Distale Reihe, zweites von lateral.', ['o-trapezium', 'o-capitatum'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-capitatum', 'Kopfbein', 'Os capitatum', ['Capitatum'], 'Größter Handwurzelknochen, in der Mitte der distalen Reihe.', 'Artikuliert mit dem 3. Mittelhandknochen.', 'Zentraler Pfeiler der Handwurzel.', 'Distale Reihe, Mitte.', ['o-trapezoideum', 'o-hamatum'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-hamatum', 'Hakenbein', 'Os hamatum', ['Hamatum'], 'Distale Handwurzelreihe, kleinfingerseitig, mit einem Haken (Hamulus).', 'Der Hamulus begrenzt mit dem Erbsenbein die Loge, durch die der N. ulnaris zur Hand zieht.', 'Teil der distalen Reihe.', 'Distale Reihe, medial.', ['o-capitatum', 'o-n-ulnaris'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-metacarpalia', 'Mittelhandknochen', 'Ossa metacarpi', ['Metacarpalia'], 'Fünf Röhrenknochen der Mittelhand.', 'Von I (Daumen) bis V (Kleinfinger) gezählt.', 'Gerüst der Handfläche.', 'Zwischen Handwurzel und Fingern.', ['o-phalangen', 'o-capitatum'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-phalangen', 'Fingerknochen', 'Phalanges', ['Phalangen', 'Fingerglieder'], 'Glieder der Finger: Grund-, Mittel- und Endglied; der Daumen hat nur zwei.', 'Insgesamt 14 Phalangen pro Hand.', 'Greifen.', 'Finger.', ['o-metacarpalia'], ['obere-extremitaet'], P('Obere Extremität: Handskelett')),
  st('arm', 'o-n-axillaris', 'Nervus axillaris', 'Nervus axillaris', ['Achselnerv'], 'Umschlingt den chirurgischen Hals des Humerus und versorgt den M. deltoideus.', 'Gefährdet bei Schulterluxation und Frakturen des Humerushalses; Folge ist eine Schwäche der Abduktion.', 'Motorisch: M. deltoideus, M. teres minor; sensibel: Haut über dem Deltamuskel.', 'Um den proximalen Humerus.', ['b-humerus'], ['obere-extremitaet'], P('Obere Extremität: Plexus brachialis')),
  st('arm', 'o-n-musculocutaneus', 'Nervus musculocutaneus', 'Nervus musculocutaneus', [], 'Versorgt die Beuger an der Vorderseite des Oberarms.', 'Innerviert M. biceps brachii, M. brachialis und M. coracobrachialis; endet als Hautnerv am lateralen Unterarm.', 'Ellenbogenbeugung, Supination durch den Bizeps.', 'Vorderseite des Oberarms.', ['m-biceps', 'm-brachialis'], ['obere-extremitaet', 'muskellehre'], P('Obere Extremität: Plexus brachialis')),
  st('arm', 'o-n-radialis', 'Nervus radialis', 'Nervus radialis', ['Speichennerv'], 'Versorgt alle Strecker an Ober- und Unterarm.', 'Läuft spiralig um die Rückseite des Humerus (Sulcus nervi radialis) – bei Oberarmschaftbrüchen gefährdet. Ausfall: Fallhand, die Hand kann im Handgelenk nicht gestreckt werden.', 'Extension in Ellenbogen, Hand- und Fingergelenken.', 'Hinter dem Humerus, dann lateral am Unterarm.', ['m-triceps', 'b-humerus'], ['obere-extremitaet', 'muskellehre'], P('Obere Extremität: Plexus brachialis')),
  st('arm', 'o-n-medianus', 'Nervus medianus', 'Nervus medianus', ['Mittelnerv'], 'Versorgt die meisten Beuger des Unterarms und die Daumenballenmuskulatur.', 'Zieht durch den Karpaltunnel; dort kann er eingeengt werden (Karpaltunnelsyndrom). Bei einer Läsion am Oberarm entsteht beim Faustschluss die „Schwurhand“.', 'Beugung von Hand und Fingern, Opposition des Daumens.', 'Mitte des Arms, durch den Karpaltunnel.', ['o-capitatum'], ['obere-extremitaet'], P('Obere Extremität: Plexus brachialis')),
  st('arm', 'o-n-ulnaris', 'Nervus ulnaris', 'Nervus ulnaris', ['Ellennerv'], 'Versorgt den Großteil der kleinen Handmuskeln.', 'Liegt am Ellenbogen ungeschützt hinter dem Epicondylus medialis („Musikantenknochen“). Ausfall: Krallenhand.', 'Feinmotorik der Finger, Adduktion des Daumens.', 'Medial am Arm, hinter dem Epicondylus medialis.', ['o-hamatum', 'b-ulna'], ['obere-extremitaet'], P('Obere Extremität: Plexus brachialis')),

  // ---- Untere Extremität (Skelett, rechte Seite von vorne; Nerven als Einblendung)
  st('leg', 'u-ilium', 'Darmbein', 'Os ilium', ['Ilium'], 'Oberer, flügelförmiger Teil des Hüftbeins.', 'Der tastbare Darmbeinkamm (Crista iliaca) endet vorne im Spina iliaca anterior superior, einem wichtigen Orientierungspunkt.', 'Beckenschaufel, Muskelursprünge.', 'Oberer Teil des Hüftbeins.', ['u-ischium', 'u-pubis', 'r-sacrum'], ['untere-extremitaet'], P('Untere Extremität: Becken')),
  st('leg', 'u-ischium', 'Sitzbein', 'Os ischii', ['Ischium'], 'Unterer hinterer Teil des Hüftbeins mit dem Sitzbeinhöcker.', 'Auf dem Sitzbeinhöcker (Tuber ischiadicum) sitzt man; hier entspringt die ischiokrurale Muskulatur.', 'Tragen beim Sitzen, Muskelursprung.', 'Unten hinten am Hüftbein.', ['u-ilium', 'u-pubis'], ['untere-extremitaet'], P('Untere Extremität: Becken')),
  st('leg', 'u-pubis', 'Schambein', 'Os pubis', ['Pubis'], 'Vorderer unterer Teil des Hüftbeins.', 'Die beiden Schambeine sind vorne durch die Schambeinfuge (Symphyse) aus Faserknorpel verbunden.', 'Vorderer Beckenring.', 'Vorne unten am Hüftbein.', ['u-ilium', 'u-ischium', 'h-knorpel-faser'], ['untere-extremitaet'], P('Untere Extremität: Becken')),
  st('leg', 'u-femurkopf', 'Femurkopf', 'Caput femoris', ['Hüftkopf'], 'Kugeliger Gelenkkopf des Oberschenkelknochens.', 'Sitzt tief in der Hüftpfanne (Acetabulum), die von allen drei Beckenknochen gebildet wird. Über den Schenkelhals ist er mit dem Schaft verbunden – Schenkelhalsfrakturen sind bei älteren Menschen häufig.', 'Hüftgelenk (Kugelgelenk).', 'Proximales Femurende, in der Hüftpfanne.', ['k-femur', 'u-trochanter'], ['untere-extremitaet', 'gelenke'], P('Untere Extremität: Hüftgelenk')),
  st('leg', 'u-trochanter', 'Großer Rollhügel', 'Trochanter major', ['Trochanter major'], 'Seitlicher Knochenvorsprung am proximalen Femur; gut tastbar.', 'Ansatz der kleinen Gesäßmuskeln (M. glutaeus medius und minimus).', 'Hebel für die Abduktoren der Hüfte.', 'Lateral am proximalen Femur.', ['u-femurkopf', 'k-femur'], ['untere-extremitaet'], P('Untere Extremität: Femur')),
  st('leg', 'u-talus', 'Sprungbein', 'Talus', ['Talus'], 'Oberster Fußwurzelknochen; bildet mit Tibia und Fibula das obere Sprunggelenk.', 'Auf ihm ruht die Malleolengabel aus Innen- und Außenknöchel. Er überträgt das Körpergewicht auf den Fuß.', 'Oberes Sprunggelenk (Dorsalextension, Plantarflexion).', 'Zwischen Unterschenkel und Fuß.', ['k-tibia', 'k-fibula', 'u-calcaneus'], ['untere-extremitaet'], P('Untere Extremität: Fußskelett')),
  st('leg', 'u-calcaneus', 'Fersenbein', 'Calcaneus', ['Calcaneus'], 'Größter Fußwurzelknochen; bildet die Ferse.', 'Am Fersenhöcker setzt die Achillessehne (Sehne des M. triceps surae) an.', 'Hebel für die Wadenmuskulatur, Stütze.', 'Unter dem Talus, hinten.', ['u-talus'], ['untere-extremitaet'], P('Untere Extremität: Fußskelett')),
  st('leg', 'u-tarsus-rest', 'Übrige Fußwurzelknochen', 'Os naviculare, Os cuboideum, Ossa cuneiformia', ['Kahnbein (Fuß)', 'Würfelbein', 'Keilbeine'], 'Kahnbein, Würfelbein und drei Keilbeine.', 'Zusammen mit Talus und Calcaneus sind es 7 Fußwurzelknochen.', 'Bilden mit den Bändern das Fußgewölbe.', 'Mittlerer Fuß.', ['u-talus', 'u-calcaneus', 'u-metatarsalia'], ['untere-extremitaet'], P('Untere Extremität: Fußskelett')),
  st('leg', 'u-metatarsalia', 'Mittelfußknochen', 'Ossa metatarsi', ['Metatarsalia'], 'Fünf Röhrenknochen des Mittelfußes.', 'Zusammen mit den Zehen (Phalanges) bilden sie den Vorfuß.', 'Abrollen beim Gehen, Fußgewölbe.', 'Vorderer Fuß.', ['u-tarsus-rest'], ['untere-extremitaet'], P('Untere Extremität: Fußskelett')),
  st('leg', 'u-n-femoralis', 'Nervus femoralis', 'Nervus femoralis', ['Oberschenkelnerv'], 'Zieht unter dem Leistenband zur Vorderseite des Oberschenkels.', 'Versorgt den M. quadriceps femoris. Ausfall: Kniestreckung schwach oder unmöglich, Patellarsehnenreflex fehlt.', 'Kniestreckung, Hüftbeugung (mit), Haut vorne am Oberschenkel.', 'Leiste, Vorderseite des Oberschenkels.', ['k-femur'], ['untere-extremitaet'], P('Untere Extremität: Plexus lumbosacralis')),
  st('leg', 'u-n-ischiadicus', 'Ischiasnerv', 'Nervus ischiadicus', ['Ischiasnerv'], 'Dickster Nerv des Körpers; zieht an der Rückseite des Oberschenkels nach unten.', 'Teilt sich meist oberhalb der Kniekehle in N. tibialis und N. fibularis communis. Versorgt die ischiokrurale Muskulatur. In der Abbildung gestrichelt, weil er hinten liegt.', 'Kniebeugung, Versorgung von Unterschenkel und Fuß über seine Äste.', 'Rückseite des Oberschenkels.', ['u-n-tibialis', 'u-n-fibularis'], ['untere-extremitaet'], P('Untere Extremität: Plexus lumbosacralis')),
  st('leg', 'u-n-tibialis', 'Nervus tibialis', 'Nervus tibialis', ['Schienbeinnerv'], 'Ast des Ischiasnervs für die Beuger an der Rückseite des Unterschenkels und die Fußsohle.', 'Versorgt den M. triceps surae (Plantarflexion). Ausfall: Zehenspitzenstand unmöglich.', 'Plantarflexion, Zehenbeugung, Sensibilität der Fußsohle.', 'Kniekehle, Rückseite des Unterschenkels.', ['u-n-ischiadicus'], ['untere-extremitaet'], P('Untere Extremität: Plexus lumbosacralis')),
  st('leg', 'u-n-fibularis', 'Nervus fibularis communis', 'Nervus fibularis communis', ['N. peroneus communis', 'Wadenbeinnerv'], 'Ast des Ischiasnervs; windet sich um das Fibulaköpfchen.', 'Am Fibulaköpfchen liegt er direkt unter der Haut und ist durch Druck oder Brüche gefährdet. Ausfall: Fallfuß mit Steppergang, weil die Fußheber (M. tibialis anterior) gelähmt sind.', 'Dorsalextension des Fußes (Fußheben), Pronation.', 'Um das Fibulaköpfchen, Vorder- und Außenseite des Unterschenkels.', ['u-n-ischiadicus', 'k-fibula'], ['untere-extremitaet'], P('Untere Extremität: Plexus lumbosacralis')),

  // ---- Kniegelenk
  st('knee', 'kn-meniskus-medial', 'Innenmeniskus', 'Meniscus medialis', ['Innenmeniskus'], 'C-förmige Faserknorpelscheibe auf der medialen Tibiagelenkfläche.', 'Mit dem Innenband verwachsen und deshalb weniger beweglich – er wird häufiger verletzt als der Außenmeniskus.', 'Vergrößert die Kontaktfläche, verteilt Druck, stabilisiert.', 'Medial zwischen Femur und Tibia.', ['kn-innenband', 'h-knorpel-faser'], ['untere-extremitaet', 'gelenke'], P('Untere Extremität: Kniegelenk')),
  st('knee', 'kn-meniskus-lateral', 'Außenmeniskus', 'Meniscus lateralis', ['Außenmeniskus'], 'Fast kreisförmige Faserknorpelscheibe auf der lateralen Tibiagelenkfläche.', 'Nicht mit dem Außenband verwachsen, daher beweglicher.', 'Druckverteilung, Führung.', 'Lateral zwischen Femur und Tibia.', ['kn-aussenband'], ['untere-extremitaet', 'gelenke'], P('Untere Extremität: Kniegelenk')),
  st('knee', 'kn-lca', 'Vorderes Kreuzband', 'Ligamentum cruciatum anterius', ['VKB', 'LCA'], 'Zieht von vorne an der Tibia nach hinten oben zum lateralen Femurkondylus.', 'Verhindert, dass die Tibia gegenüber dem Femur nach vorne gleitet (vordere Schublade). Häufige Sportverletzung.', 'Stabilisierung gegen Vorschub der Tibia.', 'In der Mitte des Kniegelenks.', ['kn-lcp'], ['untere-extremitaet'], P('Untere Extremität: Kniegelenk')),
  st('knee', 'kn-lcp', 'Hinteres Kreuzband', 'Ligamentum cruciatum posterius', ['HKB', 'LCP'], 'Zieht von hinten an der Tibia nach vorne oben zum medialen Femurkondylus.', 'Kräftiger als das vordere Kreuzband; verhindert das Zurückgleiten der Tibia (hintere Schublade).', 'Stabilisierung gegen Rückschub der Tibia.', 'In der Mitte des Kniegelenks, hinter dem vorderen Kreuzband.', ['kn-lca'], ['untere-extremitaet'], P('Untere Extremität: Kniegelenk')),
  st('knee', 'kn-innenband', 'Innenband', 'Ligamentum collaterale tibiale', ['mediales Seitenband'], 'Breites Seitenband an der Innenseite des Knies.', 'Mit Kapsel und Innenmeniskus verwachsen.', 'Sichert gegen X-Bein-Stellung (Valgusstress) in Streckung.', 'Medial am Knie.', ['kn-meniskus-medial'], ['untere-extremitaet'], P('Untere Extremität: Kniegelenk')),
  st('knee', 'kn-aussenband', 'Außenband', 'Ligamentum collaterale fibulare', ['laterales Seitenband'], 'Rundliches Seitenband an der Außenseite des Knies, zum Fibulaköpfchen.', 'Nicht mit dem Außenmeniskus verwachsen.', 'Sichert gegen O-Bein-Stellung (Varusstress) in Streckung.', 'Lateral am Knie.', ['kn-meniskus-lateral', 'k-fibula'], ['untere-extremitaet'], P('Untere Extremität: Kniegelenk')),
];

// ---- Histologische Strukturen (Schemata, figure 'tissue')
const tis = (id: string, deName: string, sciName: string, synonyms: string[], short: string, long: string, fn: string, location: string, connections: string[], lessons: string[], locator: string): Structure => ({
  id, deName, sciName, synonyms, short, long, function: fn, location, connections, lessons, figure: 'tissue', sources: [L(locator)], status: S,
});

export const TISSUE2_STRUCTURES: Structure[] = [
  tis('h-arterie', 'Arterie vom muskulären Typ', 'Arteria typi muscularis', ['muskuläre Arterie', 'Tunica media'], 'Dicke Media aus glatter Muskulatur zwischen Membrana elastica interna und externa; rundes Lumen.', 'Wandschichten von innen nach außen: Tunica intima (Endothel, subendotheliales Bindegewebe), Membrana elastica interna (gewellte helle Linie), Tunica media (zirkuläre glatte Muskelzellen), Membrana elastica externa, Tunica externa (Adventitia, lockeres Bindegewebe mit Vasa vasorum und Nerven).', 'Regulation des Gefäßdurchmessers und damit der Durchblutung.', 'Periphere Arterien, z. B. A. radialis, A. femoralis.', ['h-arterie-elastisch', 'h-vene', 'h-glatt'], ['blut-gefaesse'], 'Kap. „Blutgefäße“'),
  tis('h-arterie-elastisch', 'Arterie vom elastischen Typ', 'Arteria typi elastici', ['Aorta', 'elastische Arterie'], 'Media aus vielen gefensterten elastischen Membranen; herznahe große Arterien.', 'Zwischen den elastischen Lamellen liegen glatte Muskelzellen. Die Membrana elastica interna ist kaum abgrenzbar.', 'Windkesselfunktion: speichert in der Systole Volumen und gibt es in der Diastole ab – der Blutfluss wird gleichmäßiger.', 'Aorta, Truncus pulmonalis, große herznahe Äste.', ['h-arterie', 'c-aorta'], ['blut-gefaesse'], 'Kap. „Blutgefäße“'),
  tis('h-vene', 'Vene', 'Vena', ['Venenwand', 'Venenklappe'], 'Dünnere Wand, weites, oft kollabiertes Lumen; die Adventitia ist meist die dickste Schicht.', 'Die Media ist schwach ausgebildet, Membranae elasticae fehlen weitgehend. Venen der Extremitäten haben Klappen – Intimafalten, die den Rückfluss verhindern.', 'Rücktransport des Blutes, Blutspeicher (Kapazitätsgefäße).', 'Begleitet oft die gleichnamige Arterie.', ['h-arterie'], ['blut-gefaesse'], 'Kap. „Blutgefäße“'),
  tis('h-kapillare', 'Kapillare', 'Vas capillare', ['Kapillaren', 'fenestrierte Kapillare', 'Sinusoid'], 'Nur Endothel, Basalmembran und vereinzelte Perizyten; Durchmesser etwa so groß wie ein Erythrozyt.', 'Typen: kontinuierlich (geschlossenes Endothel, z. B. Muskel, ZNS), fenestriert (Poren, z. B. Niere, Darm, endokrine Drüsen), diskontinuierlich/sinusoidal (Lücken, weites Lumen, z. B. Leber, Milz, Knochenmark).', 'Stoffaustausch zwischen Blut und Gewebe.', 'Zwischen Arteriolen und Venolen.', ['h-erythrozyt', 'h-platten-ein'], ['blut-gefaesse'], 'Kap. „Blutgefäße“'),
  tis('h-erythrozyt', 'Erythrozyt', 'Erythrocytus', ['rote Blutkörperchen'], 'Kernlose, bikonkave Scheibe, etwa 7,5 µm; im H.E.- bzw. Pappenheim-Ausstrich rötlich mit hellem Zentrum.', 'Lebensdauer etwa 120 Tage, Abbau vor allem in der Milz. Häufigste Blutzelle. Ihr Durchmesser dient im Präparat als Größenmaßstab.', 'Sauerstoff- und CO₂-Transport mit Hämoglobin.', 'Blut.', ['h-neutrophil'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-neutrophil', 'Neutrophiler Granulozyt', 'Granulocytus neutrophilus', ['Neutrophile', 'Segmentkernige'], 'Häufigster Leukozyt (etwa 50–70 %); Kern mit 3–5 Segmenten, blasses Zytoplasma.', 'Junge Formen haben einen stabförmigen Kern (Stabkernige). Wandern ins Gewebe aus und phagozytieren Bakterien; Hauptbestandteil von Eiter.', 'Unspezifische Abwehr, Phagozytose.', 'Blut, bei Entzündung im Gewebe.', ['h-eosinophil', 'h-lymphozyt'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-eosinophil', 'Eosinophiler Granulozyt', 'Granulocytus eosinophilus', ['Eosinophile'], 'Etwa 2–4 % der Leukozyten; meist zweilappiger Kern, grobe rot-orange Granula.', 'Vermehrt bei allergischen Reaktionen und Wurmbefall.', 'Abwehr von Parasiten, Beteiligung an Allergien.', 'Blut.', ['h-neutrophil', 'h-basophil'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-basophil', 'Basophiler Granulozyt', 'Granulocytus basophilus', ['Basophile'], 'Seltenster Leukozyt (unter 1 %); dunkelviolette Granula verdecken den Kern.', 'Die Granula enthalten u. a. Histamin und Heparin – ähnlich wie Mastzellen im Gewebe.', 'Allergische Sofortreaktion.', 'Blut.', ['h-eosinophil'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-lymphozyt', 'Lymphozyt', 'Lymphocytus', ['Lymphozyten'], 'Etwa 20–40 % der Leukozyten; runder, dichter Kern mit schmalem blauem Zytoplasmasaum.', 'Kleine Lymphozyten sind etwa so groß wie ein Erythrozyt. B- und T-Lymphozyten sehen im Ausstrich gleich aus.', 'Spezifische Abwehr.', 'Blut, Lymphknoten, Milz.', ['h-monozyt', 'h-erythrozyt'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-monozyt', 'Monozyt', 'Monocytus', ['Monozyten'], 'Größte Blutzelle (etwa 2–8 % der Leukozyten); nieren- oder bohnenförmiger Kern, graublaues Zytoplasma.', 'Wandert ins Gewebe aus und wird dort zum Makrophagen.', 'Phagozytose, Antigenpräsentation.', 'Blut, im Gewebe als Makrophage.', ['h-lymphozyt'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-thrombozyt', 'Thrombozyt', 'Thrombocytus', ['Blutplättchen'], 'Kleine kernlose Zellfragmente (2–3 µm), oft in Grüppchen.', 'Entstehen im Knochenmark durch Abschnürung aus Megakaryozyten.', 'Blutstillung (Plättchenaggregation).', 'Blut.', ['h-erythrozyt'], ['blut-gefaesse'], 'Kap. „Blut“'),
  tis('h-leistenhaut', 'Leistenhaut', 'Cutis, Epidermis', ['Epidermis', 'Stratum corneum', 'Stratum basale'], 'Haut von Handflächen und Fußsohlen: dicke Hornschicht, alle fünf Epidermisschichten, keine Haare.', 'Epidermisschichten von innen nach außen: Stratum basale (Stammzellen, Melanozyten), Stratum spinosum (Desmosomen, „Stachelzellen“), Stratum granulosum (Keratohyalingranula), Stratum lucidum (nur in der Leistenhaut), Stratum corneum. Darunter Dermis (Stratum papillare und reticulare) und Subkutis. Ekkrine Schweißdrüsen, aber keine Haare und keine Talgdrüsen.', 'Schutz vor mechanischer Belastung, Griffigkeit (Papillarleisten).', 'Handflächen, Fußsohlen.', ['h-verhornt', 'h-felderhaut', 'h-schweissdruese'], ['haut-druesen'], 'Kap. „Haut“'),
  tis('h-felderhaut', 'Felderhaut mit Haar und Talgdrüse', 'Cutis', ['Felderhaut', 'Haarfollikel', 'Talgdrüse'], 'Übrige Körperhaut: dünnere Epidermis ohne Stratum lucidum, mit Haarfollikeln und Talgdrüsen.', 'Talgdrüsen münden in den Haarfollikel und sezernieren holokrin. Der M. arrector pili (glatte Muskulatur) richtet das Haar auf.', 'Schutz, Wärmeregulation, Sinnesfunktion.', 'Fast die gesamte Körperoberfläche.', ['h-leistenhaut', 'h-schweissdruese'], ['haut-druesen'], 'Kap. „Haut“'),
  tis('h-schweissdruese', 'Ekkrine Schweißdrüse', 'Glandula sudorifera eccrina', ['Schweißdrüse'], 'Unverzweigte, geknäuelte tubulöse Drüse in der tiefen Dermis; zweischichtiger, dunklerer Ausführungsgang.', 'Sezerniert merokrin (ekkrin): durch Exozytose, ohne Verlust von Zellbestandteilen. Apokrine Duftdrüsen (Achsel, Genitalregion) haben weite Lumina und münden in Haarfollikel.', 'Wärmeregulation durch Verdunstung.', 'Tiefe Dermis fast der ganzen Haut, besonders dicht an Handflächen und Fußsohlen.', ['h-leistenhaut'], ['haut-druesen'], 'Kap. „Haut“'),
  tis('h-seroes', 'Seröse Drüse', 'Glandula serosa', ['seröses Endstück', 'Azinus'], 'Endstücke (Azini) mit engem Lumen; Zellen mit rundem Kern und basophilem, körnigem Zytoplasma.', 'Bilden ein dünnflüssiges, eiweißreiches (enzymreiches) Sekret. Beispiel: Ohrspeicheldrüse, exokrines Pankreas.', 'Produktion eiweißreicher Sekrete (z. B. Amylase).', 'Glandula parotidea, exokrines Pankreas.', ['h-mukoes'], ['haut-druesen'], 'Kap. „Drüsen“'),
  tis('h-mukoes', 'Muköse Drüse', 'Glandula mucosa', ['muköses Endstück', 'Tubulus'], 'Tubulöse Endstücke mit weitem Lumen; helles, wabiges Zytoplasma, abgeflachte Kerne an der Basis.', 'Bilden zähflüssigen Schleim (Muzine), der sich im H.E.-Präparat kaum anfärbt, mit PAS aber kräftig. Gemischte (seromuköse) Drüsen enthalten beide Endstücktypen, z. B. die Unterkieferdrüse.', 'Produktion von Schleim.', 'Glandulae palatinae, Teile der Zungen- und Unterzungendrüse.', ['h-seroes'], ['haut-druesen'], 'Kap. „Drüsen“'),
];

// ===========================================================================
// Lektionen
// ===========================================================================

export const ANATOMY2_LESSONS: Lesson[] = [
  {
    id: 'nervensystem', module: 'anatomy', title: 'Nervensystem: Gliederung, Rückenmark und Spinalnerv', subtitle: 'ZNS und PNS, somatisch und vegetativ, graue und weiße Substanz, Wurzeln, Spinalganglion, Plexus', difficulty: 'grundlagen', prerequisites: ['muskel-nervengewebe'], view: 'spinal',
    structures: ['n-vorderhorn', 'n-hinterhorn', 'n-seitenhorn', 'n-weisse-substanz', 'n-zentralkanal', 'n-radix-anterior', 'n-radix-posterior', 'n-spinalganglion', 'n-spinalnerv', 'n-ramus-anterior', 'n-ramus-posterior', 'n-dura'],
    objectives: [
      'das Nervensystem nach Lage (ZNS, PNS) und Funktion (somatisch, vegetativ; afferent, efferent) gliedern',
      'den Querschnitt des Rückenmarks mit grauer und weißer Substanz beschreiben und den Hörnern ihre Funktion zuordnen',
      'den Aufbau eines Spinalnervs aus Wurzeln, Spinalganglion und Ästen erklären',
      'Hüllen des Rückenmarks, die Lage des Rückenmarks im Wirbelkanal und die großen Nervengeflechte nennen',
    ],
    overview: 'Das Nervensystem besteht aus Gehirn und Rückenmark (zentrales Nervensystem) sowie allen Nerven und Ganglien außerhalb davon (peripheres Nervensystem). Am Rückenmark sieht man das Grundprinzip besonders klar: Sensible Information kommt hinten herein, motorische Befehle gehen vorne hinaus.',
    mechanism: [
      { title: 'ZNS und PNS', text: 'Zentrales Nervensystem (ZNS) = Gehirn und Rückenmark. Peripheres Nervensystem (PNS) = 12 Hirnnervenpaare, 31 Spinalnervenpaare und die Ganglien.' },
      { title: 'Somatisch und vegetativ', text: 'Das somatische Nervensystem steuert die willkürliche Skelettmuskulatur und verarbeitet bewusste Sinnesreize. Das vegetative (autonome) Nervensystem steuert Eingeweide, Gefäße und Drüsen: Sympathikus (Ursprung thorakolumbal, Seitenhorn Th1–L2) und Parasympathikus (Ursprung kraniosakral).' },
      { title: 'Afferent und efferent', text: 'Afferent = zum ZNS hin (sensibel), efferent = vom ZNS weg (motorisch bzw. sekretorisch).' },
      { title: 'Rückenmark im Querschnitt', text: 'Innen die schmetterlingsförmige graue Substanz (Nervenzellkörper): Vorderhorn motorisch, Hinterhorn sensibel, Seitenhorn vegetativ. Außen die weiße Substanz (myelinisierte Bahnen) mit Vorder-, Seiten- und Hinterstrang.' },
      { title: 'Spinalnerv', text: 'Die hintere Wurzel (sensibel, mit Spinalganglion) und die vordere Wurzel (motorisch) vereinigen sich im Foramen intervertebrale zum gemischten Spinalnerv. Er teilt sich gleich wieder in einen vorderen und einen hinteren Ast.' },
    ],
    depth: {
      text: [
        'Das Rückenmark ist kürzer als der Wirbelkanal: Beim Erwachsenen endet es etwa auf Höhe L1/L2. Darunter laufen die Nervenwurzeln als Cauda equina zu ihren Austrittsstellen. Deshalb punktiert man Liquor zwischen L3/L4 oder L4/L5, ohne das Rückenmark zu gefährden.',
        'Hüllen von innen nach außen: Pia mater, Arachnoidea mater, Dura mater. Zwischen Pia und Arachnoidea liegt der Subarachnoidalraum mit Liquor cerebrospinalis.',
        'Die vorderen Äste der Spinalnerven bilden Geflechte: Plexus cervicalis (C1–C4, u. a. N. phrenicus aus C3–C5 für das Zwerchfell), Plexus brachialis (C5–Th1, Arm) und Plexus lumbosacralis (L1–S3/S4, Bein). Im Brustbereich bleiben sie segmental als Interkostalnerven.',
        'Ein Dermatom ist das Hautareal, das von einem Rückenmarkssegment sensibel versorgt wird. Klinische Vertiefung: Dermatome helfen, die Höhe einer Rückenmarks- oder Wurzelschädigung einzugrenzen.',
      ],
      pitfalls: ['Im Spinalganglion wird nicht umgeschaltet – dort liegen nur die Zellkörper der pseudounipolaren sensiblen Neurone.', 'Vorne = motorisch, hinten = sensibel – das gilt für Hörner und Wurzeln, nicht für die Äste des Spinalnervs: Ramus anterior und posterior sind beide gemischt.', 'Grau = Zellkörper, weiß = Bahnen; im Gehirn liegt die graue Substanz außen (Rinde), im Rückenmark innen.'],
    },
    terms: [
      { term: 'Zentrales Nervensystem', def: 'Gehirn und Rückenmark.', synonyms: ['ZNS'] },
      { term: 'Peripheres Nervensystem', def: 'Hirn- und Spinalnerven sowie Ganglien außerhalb von Gehirn und Rückenmark.', synonyms: ['PNS'] },
      { term: 'Vegetatives Nervensystem', def: 'Unwillkürliche Steuerung von Eingeweiden, Gefäßen und Drüsen durch Sympathikus und Parasympathikus.', synonyms: ['autonomes Nervensystem', 'Sympathikus', 'Parasympathikus'] },
      { term: 'Afferent', def: 'Zum ZNS hinführend, sensibel.', synonyms: ['efferent'] },
      { term: 'Plexus', def: 'Nervengeflecht aus den vorderen Ästen mehrerer Spinalnerven.', synonyms: ['Plexus brachialis', 'Plexus lumbosacralis'] },
      { term: 'Dermatom', def: 'Hautareal, das von einem Rückenmarkssegment sensibel versorgt wird.' },
      { term: 'Cauda equina', def: 'Bündel der Nervenwurzeln unterhalb des Rückenmarksendes im Wirbelkanal.' },
    ],
    models: [], links: ['muskel-nervengewebe', 'neuron-anatomie', 'rumpfwand', 'obere-extremitaet'], sources: [D('Kap. Nervensystem: Rückenmark und Spinalnerven'), L('Kap. „Nervengewebe“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'herz', module: 'anatomy', title: 'Herz: Lage, Aufbau, Klappen und Erregungsleitung', subtitle: 'Vorhöfe und Kammern, Segel- und Taschenklappen, Herzwand, Herzkranzgefäße, Sinusknoten bis Purkinje-Fasern', difficulty: 'grundlagen', prerequisites: ['muskel-nervengewebe'], view: 'heart',
    structures: ['c-rechter-vorhof', 'c-rechter-ventrikel', 'c-linker-vorhof', 'c-linker-ventrikel', 'c-septum', 'c-trikuspidal', 'c-mitral', 'c-pulmonalklappe', 'c-aortenklappe', 'c-aorta', 'c-truncus-pulmonalis', 'c-vena-cava-sup', 'c-vena-cava-inf', 'c-venae-pulmonales', 'c-sinusknoten', 'c-av-knoten', 'c-his'],
    objectives: [
      'Lage des Herzens, Herzbeutel und die Schichten der Herzwand beschreiben',
      'den Weg des Blutes durch Vorhöfe, Kammern und Klappen in der richtigen Reihenfolge angeben',
      'Segel- und Taschenklappen nach Bau, Lage und Funktion unterscheiden',
      'die Teile des Erregungsbildungs- und -leitungssystems ordnen und die Herzkranzgefäße benennen',
    ],
    overview: 'Das Herz ist ein muskuläres Hohlorgan aus zwei hintereinandergeschalteten Pumpen: Die rechte Herzhälfte treibt das Blut durch die Lunge, die linke durch den Körper. Vier Klappen sorgen dafür, dass das Blut nur in eine Richtung fließt, und ein eigenes Erregungsleitungssystem bestimmt den Takt.',
    mechanism: [
      { title: 'Lage', text: 'Das Herz liegt im mittleren Mediastinum hinter dem Brustbein, etwa zu zwei Dritteln links der Medianebene. Die Herzspitze zeigt nach links unten vorne und projiziert sich etwa auf den 5. Zwischenrippenraum in der linken Medioklavikularlinie.' },
      { title: 'Herzbeutel und Wand', text: 'Der Herzbeutel (Perikard) besteht aus einem fibrösen und einem serösen Teil; das innere Blatt des serösen Teils liegt dem Herzen als Epikard auf. Die Herzwand: Endokard (innen) – Myokard (Muskel) – Epikard (außen).' },
      { title: 'Blutweg', text: 'Hohlvenen → rechter Vorhof → Trikuspidalklappe → rechte Kammer → Pulmonalklappe → Truncus pulmonalis → Lunge → Lungenvenen → linker Vorhof → Mitralklappe → linke Kammer → Aortenklappe → Aorta.' },
      { title: 'Klappen', text: 'Segelklappen (Trikuspidal- und Mitralklappe) liegen zwischen Vorhof und Kammer und sind über Sehnenfäden an Papillarmuskeln befestigt. Taschenklappen (Pulmonal- und Aortenklappe) liegen am Ausgang der Kammern und haben drei Taschen ohne Sehnenfäden. Alle vier liegen in einer Ebene im bindegewebigen Herzskelett.' },
      { title: 'Erregungsleitung', text: 'Sinusknoten (rechter Vorhof) → Vorhofmuskulatur → AV-Knoten (Verzögerung) → His-Bündel → rechter und linker Tawara-Schenkel im Septum → Purkinje-Fasern unter dem Endokard.' },
    ],
    depth: {
      text: [
        'Herzkranzgefäße: Die A. coronaria dextra und die A. coronaria sinistra entspringen direkt oberhalb der Aortenklappe. Die linke teilt sich in den Ramus interventricularis anterior (RIVA, in der vorderen Furche zwischen den Kammern) und den Ramus circumflexus. Das venöse Blut sammelt sich im Sinus coronarius und fließt in den rechten Vorhof.',
        'Die Wand der linken Kammer ist etwa dreimal so dick wie die der rechten, weil der Druck im Körperkreislauf viel höher ist als im Lungenkreislauf.',
        'Das Herzskelett aus straffem Bindegewebe isoliert Vorhöfe und Kammern elektrisch. Die einzige Verbindung ist das His-Bündel – deshalb erreicht die Erregung die Kammern nur über den AV-Knoten.',
        'Klinische Vertiefung: Die Klappen hört man nicht genau über ihrer Lage ab, sondern an Auskultationspunkten in Strömungsrichtung (z. B. Mitralklappe an der Herzspitze).',
      ],
      pitfalls: ['Arterie heißt „vom Herzen weg“, nicht „sauerstoffreich“: Der Truncus pulmonalis führt sauerstoffarmes Blut.', 'Die Mitralklappe hat zwei Segel (bikuspidal), die Trikuspidalklappe drei – rechts drei, links zwei.', 'Papillarmuskeln öffnen die Segelklappen nicht; sie verhindern nur das Durchschlagen in den Vorhof.'],
    },
    terms: [
      { term: 'Mediastinum', def: 'Mittelfellraum zwischen den beiden Pleurahöhlen; enthält Herz, große Gefäße, Speiseröhre und Luftröhre.' },
      { term: 'Perikard', def: 'Herzbeutel aus fibrösem und serösem Anteil.', synonyms: ['Herzbeutel', 'Epikard'] },
      { term: 'Endokard', def: 'Innerste Schicht der Herzwand, kleidet die Herzhöhlen und Klappen aus.', synonyms: ['Myokard'] },
      { term: 'Segelklappe', def: 'Atrioventrikularklappe mit Segeln, Sehnenfäden und Papillarmuskeln.', synonyms: ['Atrioventrikularklappe', 'Chordae tendineae', 'Papillarmuskel'] },
      { term: 'Taschenklappe', def: 'Klappe am Ausgang der Kammer mit drei halbmondförmigen Taschen.', synonyms: ['Semilunarklappe'] },
      { term: 'Herzkranzgefäße', def: 'Arterien des Herzens (A. coronaria dextra und sinistra) aus der Aortenwurzel.', synonyms: ['Koronararterien', 'RIVA'] },
    ],
    models: [], links: ['gefaesssystem', 'muskel-nervengewebe', 'blut-gefaesse'], sources: [D('Kap. Herz'), L('Kap. „Herz“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'gefaesssystem', module: 'anatomy', title: 'Kreislauf und große Gefäße', subtitle: 'Körper- und Lungenkreislauf, Aorta und ihre Äste, Hohlvenen, Pfortader, fetaler Kreislauf', difficulty: 'grundlagen', prerequisites: ['herz'], view: 'vessels',
    structures: ['c-aorta', 'v-aortenbogen', 'v-truncus-brachiocephalicus', 'v-carotis', 'v-subclavia', 'v-aorta-abdominalis', 'v-iliaca', 'c-vena-cava-sup', 'c-vena-cava-inf', 'v-pfortader', 'c-truncus-pulmonalis'],
    objectives: [
      'Körper- und Lungenkreislauf beschreiben und Arterien und Venen richtig definieren',
      'die Abgänge des Aortenbogens und die Abschnitte der Aorta in der richtigen Reihenfolge nennen',
      'Zuflüsse der Hohlvenen und den Pfortaderkreislauf erklären',
      'die Besonderheiten des fetalen Kreislaufs und ihre Umstellung nach der Geburt beschreiben',
    ],
    overview: 'Das Blut fließt in zwei hintereinandergeschalteten Kreisläufen: Der Lungenkreislauf belädt es mit Sauerstoff, der Körperkreislauf verteilt es. Die Aorta ist die Hauptleitung des Körperkreislaufs; aus ihrem Bogen entspringen die Gefäße für Kopf und Arme, aus dem absteigenden Teil die für Rumpf, Bauch und Beine.',
    mechanism: [
      { title: 'Zwei Kreisläufe', text: 'Körperkreislauf: linke Kammer → Aorta → Arterien → Kapillaren → Venen → Hohlvenen → rechter Vorhof. Lungenkreislauf: rechte Kammer → Truncus pulmonalis → Lungenkapillaren → Lungenvenen → linker Vorhof.' },
      { title: 'Arterien und Venen', text: 'Arterien führen vom Herzen weg, Venen zum Herzen hin – unabhängig vom Sauerstoffgehalt.' },
      { title: 'Aorta', text: 'Pars ascendens (gibt die Herzkranzgefäße ab) → Arcus aortae → Pars descendens: Pars thoracica, nach dem Durchtritt durch das Zwerchfell Pars abdominalis. Etwa in Höhe von L4 teilt sie sich in die beiden Aa. iliacae communes.' },
      { title: 'Äste des Aortenbogens', text: 'Von rechts nach links: Truncus brachiocephalicus (teilt sich in rechte A. subclavia und rechte A. carotis communis), A. carotis communis sinistra, A. subclavia sinistra.' },
      { title: 'Venöser Rückfluss', text: 'Die V. cava superior sammelt das Blut aus Kopf, Hals, Armen und oberem Rumpf, die V. cava inferior aus Beinen, Becken und Bauch. Das Blut aus Magen, Darm und Milz fließt zuerst über die Pfortader zur Leber und erst danach über die Lebervenen in die untere Hohlvene.' },
    ],
    depth: {
      text: [
        'Fetaler Kreislauf: Sauerstoffreiches Blut kommt über die Nabelvene von der Plazenta, umgeht über den Ductus venosus größtenteils die Leber und gelangt in die untere Hohlvene. Im Herzen fließt viel Blut durch das Foramen ovale direkt vom rechten in den linken Vorhof; aus dem Truncus pulmonalis führt der Ductus arteriosus Blut an der noch nicht belüfteten Lunge vorbei in die Aorta. Zwei Nabelarterien bringen das Blut zurück zur Plazenta.',
        'Nach der Geburt entfaltet sich die Lunge, der Druck im linken Vorhof steigt und das Foramen ovale schließt sich funktionell; der Ductus arteriosus verschließt sich in den ersten Lebenstagen. Reste: Fossa ovalis, Ligamentum arteriosum.',
        'Ein Pfortaderkreislauf ist ein Abschnitt, in dem Blut zwei Kapillarnetze hintereinander durchläuft – so gelangen die im Darm aufgenommenen Stoffe zuerst zur Leber.',
      ],
      pitfalls: ['Der Truncus brachiocephalicus existiert nur rechts.', 'Lungenvenen führen sauerstoffreiches Blut, die Nabelvene ebenfalls – „Vene“ sagt nur die Richtung.', 'Die Pfortader mündet nicht direkt in die Hohlvene, sondern verzweigt sich in der Leber.'],
    },
    terms: [
      { term: 'Körperkreislauf', def: 'Kreislauf von der linken Kammer über die Organe zum rechten Vorhof.', synonyms: ['großer Kreislauf', 'Lungenkreislauf', 'kleiner Kreislauf'] },
      { term: 'Arterie', def: 'Blutgefäß, das vom Herzen wegführt.', synonyms: ['Vene'] },
      { term: 'Aortenbogen', def: 'Bogenförmiger Abschnitt der Aorta mit den Abgängen für Kopf und Arme.', synonyms: ['Arcus aortae'] },
      { term: 'Pfortader', def: 'Vene, die Blut aus Magen, Darm und Milz zur Leber bringt.', synonyms: ['V. portae hepatis'] },
      { term: 'Foramen ovale', def: 'Öffnung im Vorhofseptum des Fetus, durch die Blut vom rechten in den linken Vorhof fließt.' },
      { term: 'Ductus arteriosus', def: 'Fetale Verbindung zwischen Truncus pulmonalis und Aorta.', synonyms: ['Ductus Botalli'] },
    ],
    models: [], links: ['herz', 'blut-gefaesse', 'kreislauf', 'stroemung', 'druck-dichte'], sources: [D('Kap. Kreislauf: Arterien und Venen'), { id: 'sadler', locator: 'Kap. Herz-Kreislauf-System (fetaler Kreislauf)' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'blut-gefaesse', module: 'histo', title: 'Blut und Gefäßwand', subtitle: 'Wandschichten von Arterien, Venen und Kapillaren, Blutzellen im Ausstrich', difficulty: 'grundlagen', prerequisites: ['bindegewebe', 'muskel-nervengewebe'], view: 'tissue',
    structures: ['h-arterie', 'h-arterie-elastisch', 'h-vene', 'h-kapillare', 'h-erythrozyt', 'h-neutrophil', 'h-eosinophil', 'h-basophil', 'h-lymphozyt', 'h-monozyt', 'h-thrombozyt'],
    objectives: [
      'die drei Wandschichten von Blutgefäßen benennen und Arterien vom elastischen und muskulären Typ unterscheiden',
      'Arterie und Vene im Querschnitt anhand von Wanddicke, Lumen und Schichtung unterscheiden',
      'die drei Kapillartypen mit Vorkommen nennen',
      'Blutzellen im Ausstrich erkennen und mit ihrem Anteil und ihrer Funktion zuordnen',
    ],
    overview: 'Blutgefäße sind nach einem gemeinsamen Grundplan aus drei Schichten gebaut; je nach Aufgabe ist die eine oder andere stärker ausgebildet. Blut ist ein flüssiges Gewebe: Plasma mit Erythrozyten, Leukozyten und Thrombozyten. Beides gehört zum Histologie-Kurs und zum „Blut und Blutgefäße“-Block der Vorlesung.',
    mechanism: [
      { title: 'Wandschichten', text: 'Tunica intima (Endothel auf Basalmembran, subendotheliale Schicht), Tunica media (glatte Muskulatur und elastische Fasern), Tunica externa oder Adventitia (Bindegewebe, Vasa vasorum, Nerven). Bei muskulären Arterien trennt die Membrana elastica interna Intima und Media.' },
      { title: 'Elastischer und muskulärer Typ', text: 'Herznahe große Arterien (Aorta) haben eine Media aus vielen elastischen Membranen (Windkessel). Periphere Arterien haben eine dicke Media aus zirkulärer glatter Muskulatur und regulieren damit die Durchblutung.' },
      { title: 'Venen', text: 'Dünne Wand mit schwacher Media, weites Lumen, oft kollabiert; die Adventitia ist meist die dickste Schicht. Venenklappen an Armen und Beinen verhindern den Rückfluss.' },
      { title: 'Kapillaren', text: 'Nur Endothel, Basalmembran und Perizyten. Kontinuierlich (Muskel, ZNS), fenestriert (Niere, Darm, endokrine Drüsen), diskontinuierlich bzw. sinusoidal (Leber, Milz, Knochenmark).' },
      { title: 'Blutzellen', text: 'Erythrozyten (kernlos, ≈ 7,5 µm), Leukozyten: Neutrophile 50–70 % (segmentierter Kern), Lymphozyten 20–40 % (runder Kern, schmaler Saum), Monozyten 2–8 % (größte, nierenförmiger Kern), Eosinophile 2–4 % (rote Granula), Basophile unter 1 % (dunkle Granula); Thrombozyten als kleine Zellfragmente.' },
    ],
    depth: {
      text: [
        'Blutausstriche werden meist nach Pappenheim (May-Grünwald-Giemsa) gefärbt, nicht mit H.E.: Kerne violett, basophiles Zytoplasma blau, eosinophile Granula orange-rot.',
        'Plasma ist der flüssige Anteil des ungerinnbar gemachten Blutes; Serum ist Plasma ohne Gerinnungsfaktoren (Fibrinogen). Der Anteil der Zellen am Blutvolumen (Hämatokrit) liegt beim Erwachsenen etwa bei 40–50 %.',
        'Arteriolen sind die eigentlichen Widerstandsgefäße: Ihre glatte Muskulatur bestimmt, wie viel Blut in ein Kapillargebiet fließt.',
      ],
      pitfalls: ['Im Schnitt ist eine Arterie rund mit dicker Wand, die begleitende Vene weit und oft zusammengefallen.', 'Die Prozentangaben gelten für die Leukozyten, nicht für alle Blutzellen – Erythrozyten sind etwa 1000-mal häufiger.', 'Ein kleiner Lymphozyt ist etwa so groß wie ein Erythrozyt, ein Monozyt deutlich größer.'],
    },
    terms: [
      { term: 'Tunica intima', def: 'Innerste Gefäßwandschicht mit Endothel.', synonyms: ['Intima', 'Tunica media', 'Tunica externa', 'Adventitia'] },
      { term: 'Membrana elastica interna', def: 'Elastische Grenzschicht zwischen Intima und Media muskulärer Arterien.' },
      { term: 'Windkesselfunktion', def: 'Elastische Arterien speichern in der Systole Blut und geben es in der Diastole ab.' },
      { term: 'Fenestrierte Kapillare', def: 'Kapillare mit Poren im Endothel, z. B. in der Niere.', synonyms: ['Sinusoid'] },
      { term: 'Differentialblutbild', def: 'Prozentuale Verteilung der Leukozytenarten.' },
      { term: 'Hämatokrit', def: 'Anteil der Blutzellen am Blutvolumen, etwa 40–50 %.' },
    ],
    models: [], links: ['herz', 'gefaesssystem', 'bindegewebe', 'muskel-nervengewebe'], sources: [L('Kap. „Blutgefäße“ und „Blut“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'haut-druesen', module: 'histo', title: 'Haut und Drüsen', subtitle: 'Epidermisschichten, Leisten- und Felderhaut, Hautanhangsgebilde, exokrine Drüsen', difficulty: 'grundlagen', prerequisites: ['epithel'], view: 'tissue',
    structures: ['h-leistenhaut', 'h-felderhaut', 'h-schweissdruese', 'h-seroes', 'h-mukoes', 'h-verhornt'],
    objectives: [
      'die Schichten der Epidermis in der richtigen Reihenfolge nennen und Dermis und Subkutis beschreiben',
      'Leistenhaut und Felderhaut unterscheiden',
      'Drüsen nach Sekretionsmodus (merokrin, apokrin, holokrin) einteilen und Beispiele nennen',
      'seröse und muköse Endstücke im Schnitt unterscheiden und exokrine von endokrinen Drüsen abgrenzen',
    ],
    overview: 'Die Haut ist das größte Organ: Die Epidermis ist ein mehrschichtiges verhorntes Plattenepithel, darunter liegen die Dermis aus Bindegewebe und die fettreiche Subkutis. Drüsen entstehen aus Epithel – exokrine geben ihr Sekret über einen Ausführungsgang an eine Oberfläche ab, endokrine ins Blut.',
    mechanism: [
      { title: 'Epidermis', text: 'Von innen nach außen: Stratum basale (teilungsfähig, mit Melanozyten), Stratum spinosum (über Desmosomen verbundene „Stachelzellen“), Stratum granulosum (Keratohyalingranula), Stratum lucidum (nur Leistenhaut), Stratum corneum (kernlose Hornschuppen).' },
      { title: 'Dermis und Subkutis', text: 'Dermis (Lederhaut): Stratum papillare (lockeres Bindegewebe mit Kapillaren, verzahnt mit der Epidermis) und Stratum reticulare (straffes geflechtartiges Bindegewebe, Reißfestigkeit). Subkutis: Fettgewebe als Polster und Wärmeschutz.' },
      { title: 'Leisten- und Felderhaut', text: 'Leistenhaut (Handflächen, Fußsohlen): dicke Hornschicht, Stratum lucidum, viele Schweißdrüsen, keine Haare und Talgdrüsen. Felderhaut (übrige Haut): dünnere Epidermis, Haare mit Talgdrüsen und M. arrector pili.' },
      { title: 'Sekretionsmodi', text: 'Merokrin (ekkrin): Abgabe durch Exozytose, z. B. Schweißdrüsen, Speicheldrüsen. Apokrin: Abschnürung eines Zytoplasmateils, z. B. Duftdrüsen, Milchdrüse (Fett). Holokrin: Die ganze Zelle wird zum Sekret, z. B. Talgdrüse.' },
      { title: 'Endstücke', text: 'Serös: enges Lumen, runder Kern, basophiles Zytoplasma, dünnflüssiges Eiweißsekret (Parotis, Pankreas). Mukös: weites Lumen, helles wabiges Zytoplasma, abgeflachter basaler Kern, Schleim. Seromuköse Drüsen enthalten beides.' },
    ],
    depth: {
      text: [
        'Zellen der Epidermis: Keratinozyten (über 90 %), Melanozyten (Pigment, im Stratum basale), Langerhans-Zellen (Antigenpräsentation, im Stratum spinosum), Merkel-Zellen (Tastsinn, basal).',
        'Drüsen lassen sich auch nach der Form der Endstücke einteilen: tubulös (schlauchförmig), azinös (beerenförmig, enges Lumen) oder alveolär (bläschenförmig, weites Lumen).',
        'Endokrine Drüsen haben keinen Ausführungsgang, aber ein dichtes Netz fenestrierter Kapillaren, über die ihre Hormone ins Blut gelangen.',
      ],
      pitfalls: ['Die Reihenfolge beginnt innen: basale – spinosum – granulosum – (lucidum) – corneum.', 'Talgdrüsen sind holokrin, Schweißdrüsen merokrin – nicht umgekehrt.', 'Muköses Sekret färbt sich in H.E. kaum – die Zellen wirken hell, nicht leer.'],
    },
    terms: [
      { term: 'Epidermis', def: 'Oberhaut aus mehrschichtigem verhorntem Plattenepithel.', synonyms: ['Oberhaut', 'Stratum basale', 'Stratum corneum'] },
      { term: 'Dermis', def: 'Lederhaut aus Bindegewebe unter der Epidermis.', synonyms: ['Lederhaut', 'Korium', 'Subkutis'] },
      { term: 'Leistenhaut', def: 'Unbehaarte Haut von Handflächen und Fußsohlen mit Stratum lucidum.', synonyms: ['Felderhaut'] },
      { term: 'Merokrine Sekretion', def: 'Sekretabgabe durch Exozytose ohne Zellverlust.', synonyms: ['ekkrin', 'apokrin', 'holokrin'] },
      { term: 'Exokrine Drüse', def: 'Drüse, die ihr Sekret über einen Ausführungsgang an eine Oberfläche abgibt.', synonyms: ['endokrine Drüse'] },
      { term: 'Seröses Endstück', def: 'Endstück mit engem Lumen und basophilem Zytoplasma, bildet eiweißreiches Sekret.', synonyms: ['muköses Endstück'] },
    ],
    models: [], links: ['epithel', 'bindegewebe', 'mikroskopie'], sources: [L('Kap. „Haut“ und „Drüsen“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'rumpfwand', module: 'anatomy', title: 'Rumpfwand: Wirbelsäule, Brustkorb und Bauchwand', subtitle: 'Wirbelabschnitte und Krümmungen, Wirbelaufbau, Bandscheibe, Rippen, Atemmuskeln, Bauchmuskeln', difficulty: 'grundlagen', prerequisites: ['knochen', 'gelenke'], view: 'trunkwall',
    structures: ['r-hws', 'r-bws', 'r-lws', 'r-sacrum', 'r-coccyx', 'r-wirbelkoerper', 'r-wirbelbogen', 'r-foramen', 'r-dornfortsatz', 'r-querfortsatz', 'r-anulus', 'r-nucleus', 't-manubrium', 't-corpus-sterni', 't-xiphoid', 't-costae-verae', 't-costae-spuriae', 't-costae-fluctuantes', 't-zwerchfell', 't-rectus', 't-linea-alba', 't-obliquus'],
    objectives: [
      'die Abschnitte der Wirbelsäule mit Wirbelzahl und Krümmung nennen',
      'den Aufbau eines Wirbels und einer Bandscheibe beschreiben',
      'den knöchernen Brustkorb mit echten, falschen und freien Rippen beschreiben',
      'Atemmuskeln und die Schichten der Bauchwandmuskulatur mit ihrer Funktion nennen',
    ],
    overview: 'Die Rumpfwand schützt die Organe und trägt den Oberkörper. Hinten steht die doppelt S-förmige Wirbelsäule, vorne bilden Brustbein und Rippen den Brustkorb, unten schließen Muskelplatten die Bauchhöhle. Viele Strukturen davon sind am Lebenden tastbar und dienen als Orientierung bei der Untersuchung.',
    mechanism: [
      { title: 'Abschnitte der Wirbelsäule', text: '7 Halswirbel (Lordose), 12 Brustwirbel (Kyphose), 5 Lendenwirbel (Lordose), Kreuzbein aus 5 verschmolzenen Wirbeln (Kyphose), Steißbein. Die Doppel-S-Form federt Stöße ab.' },
      { title: 'Wirbel', text: 'Wirbelkörper (vorne, tragend) und Wirbelbogen umschließen das Wirbelloch. Am Bogen: ein Dornfortsatz, zwei Querfortsätze, vier Gelenkfortsätze für die kleinen Wirbelgelenke. Besonderheiten: Atlas (C1) ohne Körper, Axis (C2) mit Dens.' },
      { title: 'Bandscheibe', text: 'Außen der Anulus fibrosus aus Faserknorpel, innen der wasserreiche Nucleus pulposus. Sie verbindet die Wirbelkörper (Synchondrose) und verteilt Druck.' },
      { title: 'Brustkorb', text: '12 Rippenpaare, hinten mit der BWS gelenkig verbunden. Rippen 1–7 (echte Rippen) setzen direkt am Brustbein an, 8–10 (falsche Rippen) über den Rippenbogen, 11–12 (freie Rippen) enden frei. Brustbein: Manubrium, Corpus, Processus xiphoideus.' },
      { title: 'Atem- und Bauchmuskeln', text: 'Zwerchfell (wichtigster Einatemmuskel, N. phrenicus C3–C5), Mm. intercostales externi (Einatmung) und interni (Ausatmung). Bauchwand: M. rectus abdominis in der Rektusscheide und drei seitliche Schichten – M. obliquus externus, M. obliquus internus, M. transversus abdominis.' },
    ],
    depth: {
      text: [
        'Orientierung am Lebenden: Der Angulus sterni markiert den Ansatz der 2. Rippe – von dort zählt man die Rippen ab. Der Dornfortsatz von C7 ist meist der am deutlichsten tastbare.',
        'Die Interkostalgefäße und -nerven laufen am Unterrand jeder Rippe (von oben nach unten: Vene, Arterie, Nerv). Punktionen des Pleuraraums erfolgen deshalb am Oberrand einer Rippe.',
        'Die Aponeurosen der seitlichen Bauchmuskeln bilden die Rektusscheide und treffen sich in der Linea alba. Der untere Rand der Externus-Aponeurose bildet das Leistenband; darüber verläuft der Leistenkanal (Vertiefung).',
        'Klinische Vertiefung: Bandscheibenvorfälle treten meist in der unteren LWS auf und drücken typischerweise nach hinten-seitlich auf eine Nervenwurzel.',
      ],
      pitfalls: ['7 – 12 – 5: Hals, Brust, Lende.', 'Lordose = Krümmung nach vorn (HWS, LWS), Kyphose = nach hinten (BWS, Sakrum).', 'Freie Rippen sind die 11. und 12., nicht die 8. bis 10.'],
    },
    terms: [
      { term: 'Lordose', def: 'Nach vorne konvexe Krümmung der Wirbelsäule (HWS, LWS).', synonyms: ['Kyphose'] },
      { term: 'Atlas', def: 'Erster Halswirbel, ohne Wirbelkörper; trägt den Schädel.', synonyms: ['Axis', 'Dens axis'] },
      { term: 'Bandscheibe', def: 'Faserknorpelige Verbindung zwischen zwei Wirbelkörpern aus Anulus fibrosus und Nucleus pulposus.', synonyms: ['Discus intervertebralis'] },
      { term: 'Costae verae', def: 'Echte Rippen 1–7, direkt mit dem Brustbein verbunden.', synonyms: ['Costae spuriae', 'Costae fluctuantes'] },
      { term: 'Rektusscheide', def: 'Bindegewebige Hülle des M. rectus abdominis aus den Aponeurosen der seitlichen Bauchmuskeln.' },
      { term: 'Angulus sterni', def: 'Tastbarer Winkel zwischen Manubrium und Corpus sterni auf Höhe der 2. Rippe.' },
    ],
    models: [], links: ['knochen', 'gelenke', 'muskellehre', 'nervensystem'], sources: [P('Rumpf: Wirbelsäule, Thorax, Bauchwand'), D('Kap. Rumpfwand')], status: S, origin: 'redaktionell',
  },
  {
    id: 'obere-extremitaet', module: 'anatomy', title: 'Obere Extremität', subtitle: 'Schultergürtel, Arm- und Handskelett, Schultergelenk und Rotatorenmanschette, Nerven des Plexus brachialis', difficulty: 'grundlagen', prerequisites: ['knochen', 'gelenke', 'muskellehre'], view: 'upperlimb',
    structures: ['k-clavicula', 'b-scapula', 'b-humerus', 'b-radius', 'b-ulna', 'o-scaphoid', 'o-lunatum', 'o-triquetrum', 'o-pisiforme', 'o-trapezium', 'o-trapezoideum', 'o-capitatum', 'o-hamatum', 'o-metacarpalia', 'o-phalangen', 'o-n-axillaris', 'o-n-musculocutaneus', 'o-n-radialis', 'o-n-medianus', 'o-n-ulnaris', 'v-subclavia'],
    objectives: [
      'die Knochen des Schultergürtels, des Arms und der Hand benennen und die Handwurzelknochen in ihrer Lage ordnen',
      'Schultergelenk, Ellenbogengelenk und Handgelenke mit Gelenktyp und Bewegungen beschreiben',
      'die Muskeln der Rotatorenmanschette und weitere wichtige Armmuskeln mit Funktion nennen',
      'den großen Nerven des Plexus brachialis ihre Versorgungsgebiete und typischen Ausfälle zuordnen',
    ],
    overview: 'Der Arm ist auf Beweglichkeit gebaut: Das Schultergelenk ist das beweglichste Gelenk des Körpers, wird dafür aber vor allem von Muskeln gehalten. Die Hand verbindet 27 Knochen zu einem feinen Greifwerkzeug. Fünf große Nerven aus dem Plexus brachialis versorgen den Arm – ihre Ausfälle sind klassische Prüfungsthemen.',
    mechanism: [
      { title: 'Skelett', text: 'Schultergürtel: Clavicula und Scapula. Oberarm: Humerus. Unterarm: Radius (Daumenseite) und Ulna (Kleinfingerseite). Hand: 8 Handwurzelknochen, 5 Mittelhandknochen, 14 Fingerknochen.' },
      { title: 'Handwurzel', text: 'Proximale Reihe von der Daumen- zur Kleinfingerseite: Kahnbein (Scaphoid), Mondbein (Lunatum), Dreiecksbein (Triquetrum), Erbsenbein (Pisiforme). Distale Reihe: großes Vieleckbein (Trapezium), kleines Vieleckbein (Trapezoideum), Kopfbein (Capitatum), Hakenbein (Hamatum).' },
      { title: 'Gelenke', text: 'Schultergelenk: Kugelgelenk mit kleiner Pfanne, muskelgeführt. Ellenbogen: zusammengesetzt aus Humeroulnar- (Scharnier), Humeroradial- und proximalem Radioulnargelenk (Zapfen). Proximales Handgelenk: Eigelenk; Daumensattelgelenk zwischen Trapezium und 1. Mittelhandknochen.' },
      { title: 'Muskeln', text: 'Rotatorenmanschette: M. supraspinatus (Abduktion-Beginn), M. infraspinatus und M. teres minor (Außenrotation), M. subscapularis (Innenrotation). M. deltoideus: Abduktion. Beuger im Ellenbogen: M. biceps brachii, M. brachialis; Strecker: M. triceps brachii.' },
      { title: 'Nerven', text: 'Plexus brachialis aus C5–Th1. N. axillaris: M. deltoideus. N. musculocutaneus: Beuger des Oberarms. N. radialis: alle Strecker (Ausfall: Fallhand). N. medianus: Unterarmbeuger und Daumenballen (Ausfall proximal: Schwurhand; Engstelle Karpaltunnel). N. ulnaris: kleine Handmuskeln (Ausfall: Krallenhand).' },
    ],
    depth: {
      text: [
        'Merkspruch für die Handwurzel (proximal, dann distal, jeweils von radial nach ulnar): „Ein Kahn, der fuhr im Mondenschein dreieckig um das Erbsenbein, Vieleck groß und Vieleck klein, ein Kopf, der muss beim Haken sein.“',
        'Die Rotatorenmanschette hält den großen Humeruskopf in der flachen Pfanne. Die Sehne des M. supraspinatus läuft unter dem Schulterdach hindurch und kann dort eingeengt werden (Impingement).',
        'Gefährdete Stellen: N. axillaris am chirurgischen Hals des Humerus (Schulterluxation), N. radialis im Sulcus nervi radialis am Humerusschaft (Oberarmschaftfraktur), N. ulnaris hinter dem Epicondylus medialis, N. medianus im Karpaltunnel.',
        'Arterieller Verlauf: A. subclavia → A. axillaris → A. brachialis (Puls in der Ellenbeuge, Ort der Blutdruckmessung) → A. radialis (Puls am Handgelenk) und A. ulnaris.',
      ],
      pitfalls: ['Die Ausfallbilder nicht verwechseln: radialis – Fallhand, medianus – Schwurhand, ulnaris – Krallenhand.', 'Das Erbsenbein liegt auf dem Dreiecksbein (palmar), nicht in der distalen Reihe.', 'Der Bizeps wird vom N. musculocutaneus innerviert, nicht vom N. medianus.'],
    },
    terms: [
      { term: 'Rotatorenmanschette', def: 'Vier Muskeln, die den Humeruskopf in der Pfanne halten: Supraspinatus, Infraspinatus, Teres minor, Subscapularis.' },
      { term: 'Plexus brachialis', def: 'Armnervengeflecht aus den vorderen Ästen von C5 bis Th1.', synonyms: ['Armplexus'] },
      { term: 'Fallhand', def: 'Ausfall des N. radialis: Hand hängt, Handgelenk und Finger können nicht gestreckt werden.', synonyms: ['Schwurhand', 'Krallenhand'] },
      { term: 'Karpaltunnel', def: 'Kanal zwischen Handwurzelknochen und Retinaculum flexorum, durch den N. medianus und Beugesehnen ziehen.' },
      { term: 'Handwurzelknochen', def: 'Acht Knochen in zwei Reihen zwischen Unterarm und Mittelhand.', synonyms: ['Ossa carpi'] },
      { term: 'M. deltoideus', def: 'Deltamuskel der Schulter, wichtigster Abduktor, innerviert vom N. axillaris.', synonyms: ['Deltamuskel'] },
    ],
    models: [], links: ['muskellehre', 'gelenke', 'nervensystem', 'knochen'], sources: [P('Obere Extremität'), D('Kap. Obere Extremität')], status: S, origin: 'redaktionell',
  },
  {
    id: 'untere-extremitaet', module: 'anatomy', title: 'Untere Extremität', subtitle: 'Becken, Bein- und Fußskelett, Hüft-, Knie- und Sprunggelenk, wichtige Muskeln und Nerven', difficulty: 'grundlagen', prerequisites: ['knochen', 'gelenke', 'muskellehre'], view: 'lowerlimb',
    structures: ['u-ilium', 'u-ischium', 'u-pubis', 'r-sacrum', 'u-femurkopf', 'u-trochanter', 'k-femur', 'k-patella', 'k-tibia', 'k-fibula', 'u-talus', 'u-calcaneus', 'u-tarsus-rest', 'u-metatarsalia', 'u-n-femoralis', 'u-n-ischiadicus', 'u-n-tibialis', 'u-n-fibularis', 'kn-meniskus-medial', 'kn-meniskus-lateral', 'kn-lca', 'kn-lcp', 'kn-innenband', 'kn-aussenband', 'v-iliaca'],
    objectives: [
      'die Knochen von Becken, Bein und Fuß benennen und das Hüftbein in seine drei Anteile gliedern',
      'Hüft-, Knie- und oberes Sprunggelenk mit Gelenktyp, Bändern und Bewegungen beschreiben',
      'die wichtigsten Muskelgruppen des Beins ihrer Funktion und Innervation zuordnen',
      'den großen Nerven des Beins ihre Versorgungsgebiete und typischen Ausfälle zuordnen',
    ],
    overview: 'Das Bein ist auf Stabilität und Fortbewegung gebaut: Das Hüftgelenk sitzt tief in einer knöchernen Pfanne, das Kniegelenk wird durch Menisken und Bänder geführt, und das Fußgewölbe federt das Körpergewicht ab. Die Nerven kommen aus dem Plexus lumbosacralis; der Ischiasnerv ist der dickste Nerv des Körpers.',
    mechanism: [
      { title: 'Skelett', text: 'Beckengürtel: zwei Hüftbeine (Os coxae) und das Kreuzbein. Oberschenkel: Femur. Knie: Patella. Unterschenkel: Tibia (medial, tragend) und Fibula (lateral). Fuß: 7 Fußwurzelknochen (Talus, Calcaneus, Naviculare, Cuboideum, 3 Cuneiformia), 5 Mittelfußknochen, 14 Zehenknochen.' },
      { title: 'Hüftbein', text: 'Aus Darmbein (Ilium), Sitzbein (Ischium) und Schambein (Pubis), die in der Hüftpfanne (Acetabulum) knöchern verschmelzen. Vorne verbindet die Symphyse die beiden Schambeine, hinten das Iliosakralgelenk Hüftbein und Kreuzbein.' },
      { title: 'Gelenke', text: 'Hüftgelenk: Kugelgelenk, knöchern gut geführt, sehr starke Bänder. Kniegelenk: Femur, Tibia und Patella; Menisken, Kreuzbänder und Seitenbänder; vor allem Beugung und Streckung, in Beugung auch Rotation. Oberes Sprunggelenk: Malleolengabel aus Tibia und Fibula über dem Talus, Scharniergelenk für Dorsalextension und Plantarflexion.' },
      { title: 'Muskeln', text: 'M. glutaeus maximus: Hüftstreckung. M. glutaeus medius: Abduktion, hält das Becken beim Gehen waagerecht. M. quadriceps femoris: Kniestreckung. Ischiokrurale Muskeln: Kniebeugung und Hüftstreckung. Adduktoren: Adduktion. M. triceps surae: Plantarflexion über die Achillessehne. M. tibialis anterior: Fußheben.' },
      { title: 'Nerven', text: 'N. femoralis: Quadriceps (Kniestreckung). N. obturatorius: Adduktoren. N. glutaeus superior: M. glutaeus medius. N. ischiadicus: ischiokrurale Muskeln, teilt sich in N. tibialis (Wadenmuskeln, Fußsohle) und N. fibularis communis (Fußheber; Ausfall: Fallfuß, Steppergang).' },
    ],
    depth: {
      text: [
        'Kniegelenk: Der Innenmeniskus ist C-förmig und mit dem Innenband verwachsen, der Außenmeniskus fast kreisrund und beweglicher. Das vordere Kreuzband verhindert das Vorgleiten der Tibia, das hintere das Zurückgleiten. Die Seitenbänder sind in Streckung gespannt und sichern gegen X- und O-Bein-Belastung.',
        'Klinische Vertiefung: Fällt der M. glutaeus medius aus (N. glutaeus superior), kippt das Becken beim Stehen auf dem betroffenen Bein zur gesunden Seite ab (Trendelenburg-Zeichen).',
        'Der N. fibularis communis liegt am Fibulaköpfchen direkt unter der Haut – zu enge Gipsverbände oder langes Sitzen mit übereinandergeschlagenen Beinen können ihn schädigen.',
        'Arterieller Verlauf: A. iliaca externa → unter dem Leistenband A. femoralis (Puls in der Leiste) → A. poplitea in der Kniekehle → A. tibialis anterior (Fußrückenpuls über die A. dorsalis pedis) und A. tibialis posterior (Puls hinter dem Innenknöchel).',
      ],
      pitfalls: ['Tibia medial, Fibula lateral.', 'Der Innenmeniskus reißt häufiger als der Außenmeniskus, weil er mit dem Innenband verwachsen ist.', 'Fallfuß kommt vom N. fibularis, nicht vom N. tibialis.'],
    },
    terms: [
      { term: 'Os coxae', def: 'Hüftbein aus Ilium, Ischium und Pubis.', synonyms: ['Hüftbein', 'Acetabulum'] },
      { term: 'Menisken', def: 'Faserknorpelscheiben im Kniegelenk zwischen Femur und Tibia.', synonyms: ['Innenmeniskus', 'Außenmeniskus'] },
      { term: 'Kreuzbänder', def: 'Vorderes und hinteres Kreuzband im Kniegelenk; sichern gegen Vor- und Rückgleiten der Tibia.', synonyms: ['VKB', 'HKB'] },
      { term: 'Malleolengabel', def: 'Gabel aus Innen- und Außenknöchel, die den Talus umgreift.', synonyms: ['oberes Sprunggelenk'] },
      { term: 'M. quadriceps femoris', def: 'Vierköpfiger Oberschenkelstrecker, innerviert vom N. femoralis.' },
      { term: 'Fallfuß', def: 'Ausfall der Fußheber bei Schädigung des N. fibularis; Patient hebt das Knie beim Gehen hoch (Steppergang).', synonyms: ['Steppergang'] },
    ],
    models: [], links: ['muskellehre', 'gelenke', 'nervensystem', 'knochen', 'rumpfwand'], sources: [P('Untere Extremität'), D('Kap. Untere Extremität')], status: S, origin: 'redaktionell',
  },
];

/** Leipziger Themenplan (Vorlesung Funktionelle Anatomie I bzw. Kurs Histologie), WS 2026/27 */
export const ANATOMY2_PLAN: { lesson: string; block: string; from: string; to: string; course: string }[] = [
  { lesson: 'nervensystem', block: 'Nervensystem', from: '2026-11-24', to: '2026-12-01', course: 'Vorlesung Funktionelle Anatomie I' },
  { lesson: 'herz', block: 'Herz-Kreislauf-System', from: '2026-12-03', to: '2026-12-17', course: 'Vorlesung Funktionelle Anatomie I' },
  { lesson: 'gefaesssystem', block: 'Herz-Kreislauf-System', from: '2026-12-03', to: '2026-12-17', course: 'Vorlesung Funktionelle Anatomie I' },
  { lesson: 'blut-gefaesse', block: 'Blut und Blutgefäße', from: '2026-12-16', to: '2026-12-18', course: 'Kurs Histologie und Vorlesung' },
  { lesson: 'haut-druesen', block: 'Haut und Drüsen', from: '2027-01-04', to: '2027-01-14', course: 'Kurs Histologie und Vorlesung' },
  { lesson: 'rumpfwand', block: 'Rumpfwand', from: '2027-01-07', to: '2027-01-14', course: 'Vorlesung Funktionelle Anatomie I' },
  { lesson: 'obere-extremitaet', block: 'Obere Extremität', from: '2027-01-15', to: '2027-01-19', course: 'Vorlesung Funktionelle Anatomie I' },
  { lesson: 'untere-extremitaet', block: 'Untere Extremität', from: '2027-01-21', to: '2027-01-25', course: 'Vorlesung Funktionelle Anatomie I' },
];
