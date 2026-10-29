import type { Lesson, Structure } from './types';

// Anatomie I – Funktionelle Anatomie I (Leipzig, 1. Semester): Einführung, Allgemeine Embryologie,
// Knochen- und Gelenklehre, Muskellehre. Reihenfolge nach dem Themenplan WS 2026/27.

const S = 'zu_pruefen' as const;
const P = (locator: string) => ({ id: 'schuenke', locator });
const D = (locator: string) => ({ id: 'duale-reihe-anatomie', locator });
const E = (locator: string) => ({ id: 'sadler', locator });

const st = (figure: Structure['figure'], id: string, deName: string, sciName: string, synonyms: string[], short: string, long: string, fn: string, location: string, connections: string[], lessons: string[], locator: string, parent?: string): Structure => ({
  id, deName, sciName, synonyms, short, long, function: fn, location, connections, lessons, figure, sources: [P(locator)], status: S, ...(parent ? { parent } : {}),
});

export const ANATOMY_STRUCTURES: Structure[] = [
  // ---- Röhrenknochen
  st('bone', 'a-diaphyse', 'Diaphyse', 'Diaphysis', ['Schaft'], 'Schaft des Röhrenknochens aus dicker Kompakta um die Markhöhle.', 'Die röhrenförmige Bauweise macht den Knochen bei geringem Gewicht biege- und torsionsfest. Im Inneren liegt die Markhöhle mit beim Erwachsenen überwiegend gelbem Knochenmark.', 'Kraftübertragung, Hebel für die Muskulatur.', 'Mittelteil eines Röhrenknochens.', ['a-metaphyse', 'a-markhoehle', 'a-kompakta'], ['knochen'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-epiphyse', 'Epiphyse', 'Epiphysis', ['Gelenkende'], 'Verdicktes Ende eines Röhrenknochens, innen Spongiosa, außen von Gelenkknorpel überzogen.', 'Proximale und distale Epiphyse tragen die Gelenkflächen. Sie bestehen überwiegend aus Spongiosa mit einer dünnen Kompakta-Schale; im Inneren liegt oft rotes, blutbildendes Mark.', 'Gelenkbildung, Lastverteilung über die Spongiosabälkchen.', 'Beide Enden eines Röhrenknochens.', ['a-epiphysenfuge', 'a-gelenkknorpel', 'a-spongiosa'], ['knochen', 'gelenke'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-metaphyse', 'Metaphyse', 'Metaphysis', [], 'Übergangszone zwischen Diaphyse und Epiphyse.', 'Hier wird der während des Wachstums aus der Epiphysenfuge neu gebildete Knochen angebaut. Die Metaphyse ist im Kindesalter besonders gut durchblutet.', 'Ort des Längenwachstums (zusammen mit der Epiphysenfuge).', 'Zwischen Schaft und Gelenkende.', ['a-diaphyse', 'a-epiphysenfuge'], ['knochen'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-epiphysenfuge', 'Epiphysenfuge', 'Lamina epiphysialis', ['Wachstumsfuge', 'Epiphysenplatte'], 'Scheibe aus hyalinem Knorpel zwischen Epiphyse und Metaphyse; Ort des Längenwachstums.', 'Die Knorpelzellen teilen sich in Säulen, werden größer, die Matrix verkalkt und wird von der Metaphyse her durch Knochen ersetzt. Nach der Pubertät verknöchert die Fuge; im Röntgenbild bleibt eine Linie (Epiphysenlinie).', 'Längenwachstum des Knochens.', 'Zwischen Epiphyse und Metaphyse, nur während des Wachstums.', ['a-epiphyse', 'a-metaphyse'], ['knochen', 'bindegewebe'], 'Allgemeine Anatomie: Knochenentwicklung'),
  st('bone', 'a-kompakta', 'Kompakta', 'Substantia compacta', ['Kortikalis', 'Substantia corticalis'], 'Dichter, aus Osteonen aufgebauter äußerer Knochen.', 'Im Schaft bildet die Kompakta eine dicke Röhre, an den Enden nur eine dünne Schale (Kortikalis). Mikroskopisch besteht sie aus Lamellenknochen mit Osteonen um Havers-Kanäle.', 'Festigkeit gegen Biegung und Torsion.', 'Außenschicht jedes Knochens, besonders dick in der Diaphyse.', ['a-spongiosa', 'a-periost', 'h-knochen'], ['knochen'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-spongiosa', 'Spongiosa', 'Substantia spongiosa', ['Schwammknochen', 'Trabekel'], 'Schwammartiges Netz aus Knochenbälkchen (Trabekeln).', 'Die Trabekel richten sich nach den Hauptspannungslinien der Belastung aus (Trajektorien). Zwischen ihnen liegt Knochenmark.', 'Leichte, belastungsgerechte Lastverteilung; Raum für das Knochenmark.', 'Im Inneren der Epiphysen, in kurzen und platten Knochen.', ['a-kompakta', 'a-epiphyse'], ['knochen'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-markhoehle', 'Markhöhle', 'Cavitas medullaris', ['Knochenmark'], 'Hohlraum im Schaft mit Knochenmark, ausgekleidet vom Endost.', 'Rotes Knochenmark ist blutbildend; beim Erwachsenen ist es vor allem in platten Knochen, Wirbelkörpern und den proximalen Enden von Femur und Humerus zu finden. In den Schäften der langen Röhrenknochen wird es weitgehend durch gelbes Fettmark ersetzt.', 'Blutbildung (rotes Mark), Fettspeicher (gelbes Mark).', 'Im Schaft der Röhrenknochen.', ['a-diaphyse', 'a-kompakta'], ['knochen'], 'Allgemeine Anatomie: Knochenmark'),
  st('bone', 'a-periost', 'Periost', 'Periosteum', ['Knochenhaut'], 'Zweischichtige Knochenhaut auf der Außenfläche, außer an den Gelenkflächen.', 'Das äußere Stratum fibrosum ist straffes Bindegewebe, das innere Stratum osteogenicum (Kambium) enthält Vorläufer der Osteoblasten. Kollagenfasern (Sharpey-Fasern) verankern Periost und Sehnen im Knochen. Das Periost ist reich an Nerven – Knochenschmerz bei Verletzungen kommt vor allem von hier.', 'Ernährung, Dickenwachstum, Frakturheilung, Verankerung von Sehnen und Bändern.', 'Außen auf dem Knochen, nicht auf den Gelenkflächen.', ['a-kompakta', 'g-membrana-fibrosa'], ['knochen'], 'Allgemeine Anatomie: Knochen'),
  st('bone', 'a-gelenkknorpel', 'Gelenkknorpel', 'Cartilago articularis', ['Knorpelüberzug'], 'Hyaliner Knorpel auf den Gelenkflächen, ohne Perichondrium.', 'Er hat keine Blutgefäße und wird aus der Synovia ernährt; Bewegung fördert diese Ernährung. Ausnahmen mit Faserknorpel: Kiefergelenk und Sternoklavikulargelenk.', 'Reibungsarme, druckelastische Gleitfläche.', 'Auf den Gelenkflächen der Epiphysen.', ['a-epiphyse', 'g-gelenkhoehle', 'h-knorpel-hyalin'], ['knochen', 'gelenke'], 'Allgemeine Gelenklehre'),
  // ---- Echtes Gelenk
  st('joint', 'g-membrana-fibrosa', 'Membrana fibrosa', 'Membrana fibrosa capsulae articularis', ['äußere Gelenkkapsel', 'Gelenkkapsel'], 'Äußere, straff-bindegewebige Schicht der Gelenkkapsel.', 'Geht in das Periost der beteiligten Knochen über und wird oft durch Bänder verstärkt.', 'Mechanischer Zusammenhalt, Führung des Gelenks.', 'Außen um die Gelenkhöhle.', ['g-membrana-synovialis', 'g-ligament', 'a-periost'], ['gelenke'], 'Allgemeine Gelenklehre'),
  st('joint', 'g-membrana-synovialis', 'Membrana synovialis', 'Membrana synovialis', ['Synovialis', 'innere Gelenkkapsel'], 'Innere Schicht der Gelenkkapsel; bildet die Synovia.', 'Gut durchblutet und innerviert; ihre Deckzellen (Synoviozyten) bilden Hyaluronsäure und Lubricin und räumen Abbauprodukte ab. Sie überzieht alle Innenflächen der Gelenkhöhle außer den Knorpelflächen.', 'Bildung und Resorption der Synovia.', 'Innenauskleidung der Gelenkkapsel.', ['g-membrana-fibrosa', 'g-gelenkhoehle'], ['gelenke'], 'Allgemeine Gelenklehre'),
  st('joint', 'g-gelenkhoehle', 'Gelenkhöhle mit Synovia', 'Cavitas articularis, Synovia', ['Gelenkspalt', 'Gelenkflüssigkeit', 'Synovia'], 'Spaltförmiger Raum zwischen den Gelenkflächen, gefüllt mit Synovia.', 'Die Synovia ist eine visköse, hyaluronsäurereiche Flüssigkeit. Sie schmiert die Knorpelflächen und ernährt den gefäßlosen Gelenkknorpel. Im gesunden Gelenk ist ihre Menge gering.', 'Schmierung, Ernährung des Gelenkknorpels.', 'Zwischen den Gelenkflächen, umschlossen von der Gelenkkapsel.', ['g-membrana-synovialis', 'a-gelenkknorpel'], ['gelenke'], 'Allgemeine Gelenklehre'),
  st('joint', 'g-ligament', 'Band', 'Ligamentum', ['Bänder', 'Gelenkband'], 'Strang aus straffem Bindegewebe zwischen zwei Knochen.', 'Bänder verstärken die Kapsel (Kapselbänder) oder ziehen frei durch bzw. neben dem Gelenk (z. B. Kreuzbänder im Kniegelenk). Sie führen und begrenzen Bewegungen.', 'Führung und Hemmung von Gelenkbewegungen.', 'In, an oder neben der Gelenkkapsel.', ['g-membrana-fibrosa', 'h-straff'], ['gelenke'], 'Allgemeine Gelenklehre'),
  // ---- Arm und Muskeln
  st('muscle', 'b-scapula', 'Schulterblatt', 'Scapula', ['Schulterblatt'], 'Platter Knochen; trägt die Pfanne des Schultergelenks und den Rabenschnabelfortsatz.', 'Am Oberrand der Gelenkpfanne liegt das Tuberculum supraglenoidale, Ursprung des langen Bizepskopfes; der Processus coracoideus ist Ursprung des kurzen Kopfes.', 'Verbindung des Arms mit dem Rumpf, Muskelursprünge.', 'Hintere Brustwand.', ['b-humerus', 'm-biceps'], ['muskellehre', 'knochen'], 'Obere Extremität: Schultergürtel'),
  st('muscle', 'b-humerus', 'Oberarmknochen', 'Humerus', ['Humerus'], 'Röhrenknochen des Oberarms.', 'Der Humeruskopf bildet mit der Scapula das Schultergelenk, das distale Ende mit Radius und Ulna das Ellenbogengelenk.', 'Hebel für Schulter- und Ellenbogenmuskeln.', 'Oberarm.', ['b-scapula', 'b-radius', 'b-ulna'], ['muskellehre', 'knochen'], 'Obere Extremität: Humerus'),
  st('muscle', 'b-radius', 'Speiche', 'Radius', ['Radius'], 'Lateraler Unterarmknochen (auf der Daumenseite).', 'An der Tuberositas radii setzt der M. biceps brachii an. Der Radius dreht sich bei Pronation und Supination um die Ulna.', 'Unterarmdrehung, Kraftübertragung zur Hand.', 'Unterarm, lateral.', ['b-ulna', 'm-biceps'], ['muskellehre', 'allgemeine-anatomie'], 'Obere Extremität: Unterarm'),
  st('muscle', 'b-ulna', 'Elle', 'Ulna', ['Ulna'], 'Medialer Unterarmknochen (auf der Kleinfingerseite).', 'Das Olecranon bildet die Spitze des Ellenbogens und ist Ansatz des M. triceps brachii; an der Tuberositas ulnae setzt der M. brachialis an.', 'Führung im Ellenbogengelenk (Scharniergelenk mit dem Humerus).', 'Unterarm, medial.', ['b-radius', 'm-triceps', 'm-brachialis'], ['muskellehre', 'allgemeine-anatomie'], 'Obere Extremität: Unterarm'),
  st('muscle', 'm-biceps', 'Zweiköpfiger Oberarmmuskel', 'Musculus biceps brachii', ['Bizeps', 'M. biceps brachii'], 'Ursprung: Tuberculum supraglenoidale (langer Kopf) und Processus coracoideus (kurzer Kopf); Ansatz: Tuberositas radii.', 'Zweigelenkiger Muskel über Schulter- und Ellenbogengelenk. Er beugt im Ellenbogen und ist bei gebeugtem Ellenbogen ein kräftiger Supinator. Innervation: N. musculocutaneus.', 'Flexion und Supination im Ellenbogen; Anteversion im Schultergelenk.', 'Vorderseite des Oberarms.', ['b-scapula', 'b-radius', 'm-triceps', 'm-brachialis'], ['muskellehre'], 'Obere Extremität: Oberarmmuskeln'),
  st('muscle', 'm-brachialis', 'Oberarmmuskel', 'Musculus brachialis', ['Brachialis'], 'Ursprung: distale Vorderfläche des Humerus; Ansatz: Tuberositas ulnae.', 'Eingelenkiger, reiner Beuger im Ellenbogengelenk, unabhängig von der Unterarmstellung. Liegt unter dem Bizeps. Innervation: N. musculocutaneus.', 'Flexion im Ellenbogen.', 'Vorderseite des distalen Oberarms, unter dem Bizeps.', ['m-biceps', 'b-ulna'], ['muskellehre'], 'Obere Extremität: Oberarmmuskeln'),
  st('muscle', 'm-triceps', 'Dreiköpfiger Oberarmmuskel', 'Musculus triceps brachii', ['Trizeps', 'M. triceps brachii'], 'Drei Köpfe (langer Kopf vom Tuberculum infraglenoidale der Scapula, mediale und laterale Köpfe vom Humerus); Ansatz: Olecranon.', 'Einziger großer Strecker im Ellenbogengelenk und damit Antagonist von Bizeps und Brachialis. Innervation: N. radialis.', 'Extension im Ellenbogen; langer Kopf zusätzlich Retroversion im Schultergelenk.', 'Rückseite des Oberarms.', ['m-biceps', 'b-ulna'], ['muskellehre'], 'Obere Extremität: Oberarmmuskeln'),
  st('muscle', 'm-sehne', 'Sehne', 'Tendo', ['Sehnen'], 'Strang aus straffem parallelfaserigem Bindegewebe, der den Muskel am Knochen befestigt.', 'Sehnen übertragen die Muskelkraft auf den Knochen und sind über Sharpey-Fasern im Knochen verankert. An Umlenkstellen laufen sie in Sehnenscheiden.', 'Kraftübertragung vom Muskel auf den Knochen.', 'Zwischen Muskelbauch und Knochen.', ['m-biceps', 'h-straff', 'a-periost'], ['muskellehre'], 'Allgemeine Muskellehre'),
  // ---- Aufbau Skelettmuskel (Querschnitt)
  st('muscle-x', 'm-faszie', 'Muskelfaszie', 'Fascia', ['Faszie'], 'Hülle aus straffem Bindegewebe um einen Muskel oder eine Muskelgruppe.', 'Faszien trennen Muskeln voneinander, ermöglichen ihr Gleiten und bilden mit den Knochen Logen (Kompartimente).', 'Formhaltung, Verschieblichkeit, Logenbildung.', 'Außen um den Muskel.', ['m-epimysium'], ['muskellehre'], 'Allgemeine Muskellehre'),
  st('muscle-x', 'm-epimysium', 'Epimysium', 'Epimysium', [], 'Bindegewebshülle direkt um den ganzen Muskel.', 'Geht in die Sehne über und schickt Septen (Perimysium) in den Muskel.', 'Umhüllung, Kraftübertragung auf die Sehne.', 'Unter der Faszie, um den ganzen Muskel.', ['m-faszie', 'm-perimysium'], ['muskellehre'], 'Allgemeine Muskellehre'),
  st('muscle-x', 'm-perimysium', 'Perimysium', 'Perimysium', ['Faszikel'], 'Bindegewebe um ein Muskelfaserbündel (Faszikel).', 'Im Perimysium verlaufen größere Gefäße und Nerven. Mehrere Muskelfasern bilden einen Faszikel.', 'Bündelung der Fasern, Leitstruktur für Gefäße und Nerven.', 'Um jedes Faserbündel.', ['m-epimysium', 'm-endomysium'], ['muskellehre'], 'Allgemeine Muskellehre'),
  st('muscle-x', 'm-endomysium', 'Endomysium', 'Endomysium', ['Muskelfaser'], 'Zartes Bindegewebe um jede einzelne Muskelfaser.', 'Enthält Kapillaren, die jede Muskelfaser versorgen. Die Muskelfaser selbst ist eine vielkernige Zelle (Synzytium).', 'Versorgung und Verbindung der einzelnen Fasern.', 'Um jede Muskelfaser.', ['m-perimysium', 'h-skelettmuskel'], ['muskellehre', 'muskel-nervengewebe'], 'Allgemeine Muskellehre'),
  // ---- Körper (Orientierung, Ventralansicht)
  st('body', 'k-schaedel', 'Schädel', 'Cranium', ['Schädel'], 'Knöcherne Kapsel für Gehirn und Sinnesorgane.', 'Gliedert sich in Hirnschädel (Neurocranium) und Gesichtsschädel (Viscerocranium). Das Schädeldach entsteht durch desmale Ossifikation.', 'Schutz von Gehirn und Sinnesorganen.', 'Kopf.', ['k-wirbelsaeule'], ['allgemeine-anatomie'], 'Kopf: Schädel'),
  st('body', 'k-clavicula', 'Schlüsselbein', 'Clavicula', ['Schlüsselbein'], 'S-förmiger Knochen zwischen Sternum und Schulterblatt.', 'Der einzige knöcherne Verbindungsknochen des Arms mit dem Rumpf; ossifiziert überwiegend desmal.', 'Abstützung des Schultergürtels.', 'Zwischen Brustbein (medial) und Schulter (lateral).', ['k-sternum', 'b-scapula'], ['allgemeine-anatomie', 'knochen'], 'Obere Extremität: Schultergürtel'),
  st('body', 'k-sternum', 'Brustbein', 'Sternum', ['Brustbein'], 'Platter Knochen in der vorderen Mittellinie des Thorax.', 'Enthält beim Erwachsenen rotes Knochenmark; Sternalpunktion ist eine Methode der Knochenmarkentnahme.', 'Vordere Befestigung der Rippen und der Schlüsselbeine.', 'Vordere Brustwand, in der Medianebene.', ['k-clavicula', 'k-wirbelsaeule'], ['allgemeine-anatomie', 'knochen'], 'Rumpf: Thoraxskelett'),
  st('body', 'k-wirbelsaeule', 'Wirbelsäule', 'Columna vertebralis', ['Wirbelsäule'], 'Achse des Rumpfskeletts aus Wirbeln und Bandscheiben.', 'Liegt in der Ventralansicht hinter Brust- und Bauchorganen; in der Abbildung gestrichelt angedeutet.', 'Stütze, Beweglichkeit des Rumpfs, Schutz des Rückenmarks.', 'Hintere Rumpfwand, in der Medianebene.', ['k-sternum', 'k-becken'], ['allgemeine-anatomie'], 'Rumpf: Wirbelsäule'),
  st('body', 'k-becken', 'Hüftbein', 'Os coxae', ['Becken', 'Hüftbein'], 'Paariger Knochen des Beckengürtels; trägt die Hüftgelenkspfanne.', 'Entsteht aus Os ilium, Os ischii und Os pubis, die in der Hüftpfanne verschmelzen (Synostose).', 'Verbindung des Beins mit dem Rumpf, Schutz der Beckenorgane.', 'Becken.', ['k-femur', 'k-wirbelsaeule'], ['allgemeine-anatomie'], 'Untere Extremität: Beckengürtel'),
  st('body', 'k-femur', 'Oberschenkelknochen', 'Femur', ['Femur'], 'Längster und schwerster Röhrenknochen.', 'Bildet proximal das Hüftgelenk, distal mit Tibia und Patella das Kniegelenk.', 'Lastübertragung beim Stehen und Gehen.', 'Oberschenkel.', ['k-becken', 'k-tibia', 'k-patella'], ['allgemeine-anatomie', 'knochen'], 'Untere Extremität: Femur'),
  st('body', 'k-patella', 'Kniescheibe', 'Patella', ['Kniescheibe'], 'Größtes Sesambein, in die Sehne des M. quadriceps femoris eingelagert.', 'Liegt vor dem distalen Femur und vergrößert den Hebelarm der Quadrizepssehne.', 'Verbesserung der Kraftübertragung bei der Kniestreckung.', 'Vorderseite des Kniegelenks.', ['k-femur', 'k-tibia'], ['allgemeine-anatomie', 'knochen'], 'Untere Extremität: Knie'),
  st('body', 'k-tibia', 'Schienbein', 'Tibia', ['Schienbein'], 'Kräftiger, medialer Unterschenkelknochen.', 'Trägt praktisch das gesamte Körpergewicht des Unterschenkels; die Vorderkante ist direkt unter der Haut tastbar.', 'Lastübertragung vom Knie zum Fuß.', 'Unterschenkel, medial.', ['k-fibula', 'k-femur'], ['allgemeine-anatomie'], 'Untere Extremität: Unterschenkel'),
  st('body', 'k-fibula', 'Wadenbein', 'Fibula', ['Wadenbein'], 'Schlanker, lateraler Unterschenkelknochen.', 'Kaum an der Lastübertragung beteiligt; bildet mit dem Außenknöchel (Malleolus lateralis) die laterale Wand der Sprunggelenksgabel.', 'Muskelursprünge, Führung im oberen Sprunggelenk.', 'Unterschenkel, lateral.', ['k-tibia'], ['allgemeine-anatomie'], 'Untere Extremität: Unterschenkel'),
];

export const ANATOMY_LESSONS: Lesson[] = [
  {
    id: 'allgemeine-anatomie', module: 'anatomy', title: 'Allgemeine Anatomie: Aufbau und Orientierung', subtitle: 'Organisationsebenen, Körperregionen, Achsen, Ebenen und Lagebeziehungen', difficulty: 'grundlagen', prerequisites: [], view: 'orientation',
    structures: ['k-schaedel', 'k-clavicula', 'k-sternum', 'k-wirbelsaeule', 'k-becken', 'k-femur', 'k-patella', 'k-tibia', 'k-fibula', 'b-humerus', 'b-radius', 'b-ulna'],
    objectives: [
      'die Organisationsebenen des Körpers von der Zelle bis zum Organismus ordnen',
      'die großen Körperregionen benennen',
      'Körperachsen und Körperebenen einander zuordnen',
      'die Lage einer Struktur relativ zu einer anderen mit Lagebezeichnungen beschreiben',
    ],
    overview: 'Die Anatomie beschreibt den Bau des Körpers – makroskopisch mit bloßem Auge, mikroskopisch bis zur Zelle. Damit sich alle eindeutig verständigen, beziehen sich Lageangaben immer auf die anatomische Normalstellung und auf drei Achsen und drei Ebenen.',
    mechanism: [
      { title: 'Teilgebiete', text: 'Systematische Anatomie beschreibt Organsysteme (Knochen, Muskeln, Gefäße …), topographische Anatomie die Lagebeziehungen in einer Körperregion, funktionelle Anatomie den Zusammenhang von Bau und Leistung.' },
      { title: 'Organisationsebenen', text: 'Zelle → Gewebe (vier Grundgewebe: Epithel-, Binde- und Stütz-, Muskel-, Nervengewebe) → Organ → Organsystem → Organismus.' },
      { title: 'Körperregionen', text: 'Kopf (Caput), Hals (Collum), Rumpf (Truncus) mit Brust (Thorax), Bauch (Abdomen), Becken (Pelvis) und Rücken (Dorsum), dazu obere (Membrum superius) und untere Extremität (Membrum inferius).' },
      { title: 'Achsen', text: 'Longitudinalachse (senkrecht, von kranial nach kaudal), Sagittalachse (von ventral nach dorsal), Transversalachse (von rechts nach links). Alle drei stehen senkrecht aufeinander.' },
      { title: 'Ebenen', text: 'Jede Ebene wird von zwei Achsen aufgespannt: Sagittalebene (Longitudinal- + Sagittalachse; die mittlere heißt Medianebene), Frontalebene (Longitudinal- + Transversalachse), Transversalebene (Sagittal- + Transversalachse).' },
    ],
    depth: {
      text: [
        'Bewegungen werden über Achse und Ebene beschrieben: Um die Transversalachse in der Sagittalebene laufen Flexion und Extension, um die Sagittalachse in der Frontalebene Abduktion und Adduktion, um die Longitudinalachse in der Transversalebene die Rotation.',
        'Proximal und distal werden an den Extremitäten verwendet (rumpfnah, rumpffern), kranial und kaudal am Rumpf. Am Kopf sagt man für „vorne“ oft rostral.',
      ],
      pitfalls: ['In Normalstellung zeigen die Handflächen nach vorn – der Radius liegt lateral, die Ulna medial.', 'Die Frontalebene trennt vorne von hinten, nicht rechts von links.', 'Lagebezeichnungen gelten auch für einen liegenden Patienten so, als stünde er in Normalstellung.'],
    },
    terms: [
      { term: 'Anatomische Normalstellung', def: 'Aufrechter Stand, Blick geradeaus, Arme hängend, Handflächen nach vorn, Füße parallel.', synonyms: ['Normalstellung'] },
      { term: 'Longitudinalachse', def: 'Senkrechte Körperachse von kranial nach kaudal.', synonyms: ['Längsachse', 'Vertikalachse'] },
      { term: 'Sagittalachse', def: 'Achse von ventral nach dorsal.' },
      { term: 'Transversalachse', def: 'Waagerechte Achse von rechts nach links.', synonyms: ['Querachse', 'Horizontalachse'] },
      { term: 'Topographische Anatomie', def: 'Lehre von den Lagebeziehungen der Strukturen in einer Körperregion.', synonyms: ['Systematische Anatomie'] },
    ],
    models: [], links: ['lagebezeichnungen', 'knochen', 'gelenke'], sources: [P('Allgemeine Anatomie: Orientierung am Körper'), D('Kap. Allgemeine Anatomie')], status: S, origin: 'redaktionell',
  },
  {
    id: 'embryologie', module: 'anatomy', title: 'Allgemeine Embryologie', subtitle: 'Von der Befruchtung bis zu den drei Keimblättern (1. bis 4. Woche)', difficulty: 'grundlagen', prerequisites: ['zellzyklus'], view: 'embryo',
    objectives: [
      'die Ereignisse der ersten Entwicklungswoche von der Befruchtung bis zur Implantation ordnen',
      'die zweiblättrige Keimscheibe mit Amnionhöhle und Dottersack beschreiben',
      'die Gastrulation und die Entstehung der drei Keimblätter erklären',
      'Gewebe und Organe ihrem Keimblatt zuordnen',
    ],
    overview: 'In den ersten vier Wochen entsteht aus einer einzigen Zelle ein Embryo mit drei Keimblättern, aus denen später alle Gewebe hervorgehen. Viele Fehlbildungen lassen sich nur verstehen, wenn man weiß, wann und aus welchem Keimblatt eine Struktur entsteht.',
    mechanism: [
      { title: '1. Woche: Befruchtung und Furchung', text: 'Die Befruchtung findet meist in der Ampulle des Eileiters statt. Die Zygote teilt sich (Furchung) auf dem Weg zum Uterus, ohne größer zu werden; um den 3.–4. Tag entsteht die Morula (Maulbeerkeim).' },
      { title: 'Blastozyste und Implantation', text: 'Um den 4.–5. Tag bildet sich eine Höhle: die Blastozyste mit innerer Zellmasse (Embryoblast) und äußerer Hülle (Trophoblast). Ab etwa dem 6. Tag nistet sie sich in die Uterusschleimhaut ein.' },
      { title: '2. Woche: zweiblättrige Keimscheibe', text: 'Der Embryoblast ordnet sich zu Epiblast und Hypoblast. Über dem Epiblast liegt die Amnionhöhle, unter dem Hypoblast der Dottersack. Der Trophoblast gliedert sich in Zyto- und Synzytiotrophoblast; der Synzytiotrophoblast bildet hCG.' },
      { title: '3. Woche: Gastrulation', text: 'Am Primitivstreifen wandern Epiblastzellen ein und bilden Entoderm und Mesoderm; der verbleibende Epiblast wird zum Ektoderm. Die Chorda dorsalis entsteht als Achsenstab.' },
      { title: 'Ende 3. und 4. Woche: Neurulation', text: 'Über der Chorda verdickt sich das Ektoderm zur Neuralplatte, die sich zum Neuralrohr schließt. Aus den Rändern lösen sich Neuralleistenzellen. Der vordere Neuroporus schließt sich um den 25. Tag, der hintere um den 28. Tag.' },
    ],
    depth: {
      text: [
        'Keimblattabkömmlinge: Ektoderm → Epidermis, Haare, Nägel, Zentralnervensystem; Neuralleiste → peripheres Nervensystem (z. B. Spinalganglien), Melanozyten, Nebennierenmark. Mesoderm → Skelett, Muskulatur, Bindegewebe, Herz, Blutgefäße und Blutzellen, Nieren, Nebennierenrinde. Entoderm → Epithel des Darmtrakts und der Atemwege, Leber, Pankreas, Schilddrüse.',
        'Die Embryonalperiode (3. bis 8. Woche) ist die Zeit der Organanlage und daher besonders empfindlich für schädigende Einflüsse; ab der 9. Woche spricht man vom Fetus.',
        'Klinische Vertiefung (kein Pflichtstoff): Bleibt der hintere Neuroporus offen, entsteht eine Spina bifida. Ausreichende Folsäureversorgung vor und in der Frühschwangerschaft senkt das Risiko für Neuralrohrdefekte. Nistet sich die Blastozyste außerhalb des Uterus ein (meist im Eileiter), spricht man von einer Extrauteringravidität.',
      ],
      pitfalls: ['Furchung heißt Teilung ohne Wachstum – die Zellen werden kleiner.', 'Der Hypoblast wird bei der Gastrulation ersetzt; das endgültige Entoderm stammt aus dem Epiblast.', 'Das Nebennierenmark stammt aus der Neuralleiste, die Nebennierenrinde aus dem Mesoderm.'],
    },
    terms: [
      { term: 'Zygote', def: 'Befruchtete Eizelle mit diploidem Chromosomensatz.' },
      { term: 'Morula', def: 'Kompakter Zellhaufen nach den ersten Furchungsteilungen.', synonyms: ['Maulbeerkeim'] },
      { term: 'Blastozyste', def: 'Keim mit Höhle, Embryoblast und Trophoblast; nistet sich ein.', synonyms: ['Embryoblast', 'Trophoblast'] },
      { term: 'Gastrulation', def: 'Bildung der drei Keimblätter am Primitivstreifen in der 3. Woche.', synonyms: ['Primitivstreifen'] },
      { term: 'Keimblätter', def: 'Ektoderm, Mesoderm und Entoderm – die Ausgangsschichten aller Gewebe.', synonyms: ['Ektoderm', 'Mesoderm', 'Entoderm'] },
      { term: 'Neuralleiste', def: 'Zellen am Rand der Neuralplatte, die auswandern und u. a. das periphere Nervensystem bilden.', synonyms: ['Neuralrohr', 'Neurulation'] },
    ],
    models: [], links: ['zellzyklus', 'epithel', 'bindegewebe'], structures: [], sources: [E('Kap. 3–6 (1. bis 4. Entwicklungswoche)'), D('Kap. Allgemeine Embryologie')], status: S, origin: 'redaktionell',
  },
  {
    id: 'knochen', module: 'anatomy', title: 'Knochenlehre und Ossifikation', subtitle: 'Funktionen und Formen der Knochen, Aufbau eines Röhrenknochens, Knochenentwicklung', difficulty: 'grundlagen', prerequisites: ['allgemeine-anatomie'], view: 'bone',
    structures: ['a-diaphyse', 'a-epiphyse', 'a-metaphyse', 'a-epiphysenfuge', 'a-kompakta', 'a-spongiosa', 'a-markhoehle', 'a-periost', 'a-gelenkknorpel'],
    objectives: [
      'die Funktionen des Skeletts nennen',
      'Knochen nach ihrer Form einteilen und Beispiele zuordnen',
      'den Aufbau eines Röhrenknochens beschreiben',
      'desmale und chondrale Ossifikation unterscheiden und das Längenwachstum erklären',
    ],
    overview: 'Knochen sind lebende Organe: gut durchblutet, innerviert und ständig im Umbau. Ihr Aufbau aus fester Kompakta und leichter Spongiosa ist der Belastung angepasst. Gebildet werden sie auf zwei Wegen – direkt aus Bindegewebe oder über ein Knorpelmodell.',
    mechanism: [
      { title: 'Funktionen', text: 'Stütze und Form, Schutz (Schädel, Brustkorb, Becken), Hebel für die Muskulatur, Mineralspeicher (Calcium, Phosphat), Blutbildung im roten Knochenmark.' },
      { title: 'Knochenformen', text: 'Lange Knochen (Röhrenknochen: Femur, Humerus), kurze Knochen (Handwurzelknochen), platte Knochen (Schädeldach, Sternum, Scapula), unregelmäßige Knochen (Wirbel), lufthaltige Knochen (z. B. Oberkiefer), Sesambeine (Patella).' },
      { title: 'Röhrenknochen', text: 'Schaft (Diaphyse) aus dicker Kompakta mit Markhöhle; Enden (Epiphysen) aus Spongiosa mit Gelenkknorpel; dazwischen die Metaphyse. Außen Periost, innen Endost.' },
      { title: 'Desmale Ossifikation', text: 'Mesenchymzellen werden direkt zu Osteoblasten und bilden Knochen – so entstehen das Schädeldach, große Teile des Gesichtsschädels und der Clavicula.' },
      { title: 'Chondrale Ossifikation', text: 'Zuerst entsteht ein Modell aus hyalinem Knorpel. Eine Knochenmanschette bildet sich um den Schaft (perichondral), innen wird der Knorpel abgebaut und durch Knochen ersetzt (enchondral). Primäre Ossifikationszentren liegen in der Diaphyse, sekundäre in den Epiphysen.' },
    ],
    depth: {
      text: [
        'Längenwachstum: In der Epiphysenfuge folgen auf eine Reservezone die Proliferationszone (Knorpelzellsäulen), die Hypertrophiezone (große Zellen) und die Verkalkungs- und Eröffnungszone, in der Gefäße einsprossen und Knochen angelagert wird. Das Dickenwachstum erfolgt durch Anbau vom Periost aus.',
        'Das erwachsene Skelett hat etwa 200 Knochen – meist werden 206 angegeben; die genaue Zahl schwankt individuell (z. B. durch Sesambeine).',
        'Klinische Vertiefung (kein Pflichtstoff): Bei Kindern können Brüche durch die Epiphysenfuge das Wachstum stören. Im Röntgenbild erlaubt der Stand der Fugenschlüsse eine Abschätzung des Knochenalters.',
      ],
      pitfalls: ['Das Periost fehlt an den Gelenkflächen – dort liegt Gelenkknorpel.', 'Chondral heißt nicht, dass der Knorpel zu Knochen „wird“: Er wird abgebaut und ersetzt.', 'Die Epiphysenfuge liegt zwischen Epiphyse und Metaphyse, nicht in der Mitte des Schafts.'],
    },
    terms: [
      { term: 'Röhrenknochen', def: 'Langer Knochen mit Schaft, Markhöhle und zwei Gelenkenden.', synonyms: ['Os longum'] },
      { term: 'Periost', def: 'Knochenhaut aus Stratum fibrosum und Stratum osteogenicum.', synonyms: ['Knochenhaut', 'Endost'] },
      { term: 'Desmale Ossifikation', def: 'Knochenbildung direkt aus Mesenchym.', synonyms: ['direkte Ossifikation'] },
      { term: 'Chondrale Ossifikation', def: 'Knochenbildung über ein Knorpelmodell, perichondral und enchondral.', synonyms: ['indirekte Ossifikation', 'enchondral', 'perichondral'] },
      { term: 'Sesambein', def: 'In eine Sehne eingelagerter Knochen, z. B. die Patella.', synonyms: ['Os sesamoideum'] },
      { term: 'Trajektorien', def: 'Verlaufslinien der Spongiosabälkchen entlang der Hauptbelastung.' },
    ],
    models: [], links: ['bindegewebe', 'gelenke', 'mechanik'], sources: [P('Allgemeine Anatomie: Knochen und Knochenentwicklung'), D('Kap. Bewegungsapparat: Knochen'), { id: 'luellmann', locator: 'Kap. „Knochen“ (Osteogenese)' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'gelenke', module: 'anatomy', title: 'Gelenklehre', subtitle: 'Knochenverbindungen, Aufbau eines echten Gelenks, Gelenktypen und Bewegungsachsen', difficulty: 'grundlagen', prerequisites: ['knochen'], view: 'joints',
    structures: ['a-gelenkknorpel', 'g-gelenkhoehle', 'g-membrana-synovialis', 'g-membrana-fibrosa', 'g-ligament', 'a-epiphyse', 'a-periost'],
    objectives: [
      'unechte Gelenke (Synarthrosen) und echte Gelenke (Diarthrosen) unterscheiden',
      'die Bauteile eines echten Gelenks und ihre Funktion nennen',
      'Gelenktypen nach Form und Zahl der Bewegungsachsen einordnen und Beispiele angeben',
      'Gelenkbewegungen den passenden Achsen und Ebenen zuordnen',
    ],
    overview: 'Knochen sind auf zwei Arten verbunden: durchgehend über Bindegewebe, Knorpel oder Knochen (unechte Gelenke) oder über einen Spalt mit Gelenkflüssigkeit (echte Gelenke). Wie beweglich ein echtes Gelenk ist, hängt vor allem von der Form seiner Gelenkflächen ab.',
    mechanism: [
      { title: 'Unechte Gelenke', text: 'Syndesmose (Bindegewebe, z. B. Membrana interossea, Schädelnähte), Synchondrose (Knorpel, z. B. Epiphysenfuge), Synostose (Knochen, z. B. Kreuzbein aus verschmolzenen Wirbeln).' },
      { title: 'Echtes Gelenk', text: 'Gelenkflächen mit Gelenkknorpel, Gelenkhöhle mit Synovia, Gelenkkapsel aus Membrana fibrosa (außen) und Membrana synovialis (innen).' },
      { title: 'Hilfseinrichtungen', text: 'Bänder, Gelenkscheiben (Disci) und Menisken, Gelenklippen (Labra) und Schleimbeutel (Bursae) führen, sichern und polstern.' },
      { title: 'Gelenktypen', text: 'Kugelgelenk (3 Hauptachsen: Schulter, Hüfte), Eigelenk und Sattelgelenk (2: proximales Handgelenk, Daumensattelgelenk), Scharniergelenk und Zapfen-/Radgelenk (1: Humeroulnargelenk, proximales Radioulnargelenk), planes Gelenk (Gleitbewegungen).' },
      { title: 'Bewegungen', text: 'Flexion/Extension um die Transversalachse, Abduktion/Adduktion um die Sagittalachse, Innen-/Außenrotation um die Längsachse des Knochens; am Unterarm Pronation/Supination.' },
    ],
    depth: {
      text: [
        'Das Ellenbogengelenk ist ein zusammengesetztes Gelenk aus drei Teilgelenken in einer Kapsel: Humeroulnargelenk (Scharnier), Humeroradialgelenk (funktionell eingeschränkt kugelförmig) und proximales Radioulnargelenk (Zapfengelenk).',
        'Amphiarthrosen (straffe Gelenke wie das Iliosakralgelenk) sind echte Gelenke mit so straffen Bändern, dass kaum Bewegung möglich ist.',
        'Klinische Vertiefung (kein Pflichtstoff): Die Beweglichkeit wird nach der Neutral-Null-Methode in Grad dokumentiert, ausgehend von der Normalstellung.',
      ],
      pitfalls: ['Gelenkknorpel hat kein Perichondrium und keine Gefäße – er wird aus der Synovia ernährt.', 'Die Membrana synovialis überzieht nicht die Knorpelflächen.', 'Ein Gelenk mit drei Achsen hat theoretisch unendlich viele, beschrieben werden die drei Hauptachsen.'],
    },
    terms: [
      { term: 'Diarthrose', def: 'Echtes Gelenk mit Gelenkspalt und Synovia.', synonyms: ['echtes Gelenk', 'Articulatio synovialis'] },
      { term: 'Synarthrose', def: 'Unechtes Gelenk: durchgehende Verbindung aus Bindegewebe, Knorpel oder Knochen.', synonyms: ['Syndesmose', 'Synchondrose', 'Synostose'] },
      { term: 'Synovia', def: 'Visköse Gelenkflüssigkeit, reich an Hyaluronsäure.', synonyms: ['Gelenkflüssigkeit'] },
      { term: 'Kugelgelenk', def: 'Gelenk mit kugeliger Gelenkfläche und drei Hauptachsen.', synonyms: ['Articulatio spheroidea'] },
      { term: 'Scharniergelenk', def: 'Einachsiges Gelenk für Beugung und Streckung.', synonyms: ['Ginglymus'] },
      { term: 'Meniskus', def: 'Halbmondförmige Faserknorpelscheibe im Kniegelenk.', synonyms: ['Menisken', 'Discus articularis'] },
    ],
    models: [], links: ['knochen', 'muskellehre', 'allgemeine-anatomie'], sources: [P('Allgemeine Anatomie: Gelenke'), D('Kap. Bewegungsapparat: Gelenke')], status: S, origin: 'redaktionell',
  },
  {
    id: 'muskellehre', module: 'anatomy', title: 'Allgemeine Muskellehre', subtitle: 'Aufbau, Ursprung und Ansatz, Agonist und Antagonist – am Beispiel des Oberarms', difficulty: 'grundlagen', prerequisites: ['gelenke'], view: 'muscle-anatomy',
    structures: ['b-scapula', 'b-humerus', 'b-radius', 'b-ulna', 'm-biceps', 'm-brachialis', 'm-triceps', 'm-sehne', 'm-faszie', 'm-epimysium', 'm-perimysium', 'm-endomysium'],
    objectives: [
      'den Aufbau eines Skelettmuskels von der Muskelfaser bis zur Faszie beschreiben',
      'Ursprung und Ansatz definieren und für die Oberarmmuskeln angeben',
      'Agonist, Antagonist und Synergist an einer Gelenkbewegung erklären',
      'Muskelformen unterscheiden und den Einfluss der Fiederung auf Kraft und Hubhöhe beschreiben',
    ],
    overview: 'Ein Skelettmuskel bewegt ein Gelenk, indem er sich verkürzt und über seine Sehnen an zwei Knochen zieht. Weil Muskeln nur ziehen und nicht schieben können, braucht jede Bewegung einen Gegenspieler – am Ellenbogen beugen Bizeps und Brachialis, der Trizeps streckt.',
    mechanism: [
      { title: 'Hüllen', text: 'Jede Muskelfaser liegt im Endomysium, Faserbündel (Faszikel) im Perimysium, der ganze Muskel im Epimysium; außen umgibt ihn die Faszie.' },
      { title: 'Ursprung und Ansatz', text: 'Ursprung (Origo) heißt die Befestigung am meist rumpfnäheren, weniger bewegten Knochen, Ansatz (Insertio) die am bewegten Knochen. Die Befestigung erfolgt über Sehnen.' },
      { title: 'Beispiel Bizeps', text: 'M. biceps brachii: langer Kopf vom Tuberculum supraglenoidale, kurzer Kopf vom Processus coracoideus der Scapula; Ansatz an der Tuberositas radii. Er beugt im Ellenbogen und supiniert.' },
      { title: 'Zusammenspiel', text: 'Agonist = Hauptbeweger, Synergist = Helfer in dieselbe Richtung, Antagonist = Gegenspieler. Ellenbogenbeugung: Agonisten M. biceps brachii und M. brachialis, Synergist M. brachioradialis, Antagonist M. triceps brachii.' },
      { title: 'Muskelformen', text: 'Spindelförmig, einfach oder doppelt gefiedert, mehrköpfig (Bizeps, Trizeps, Quadrizeps) oder mehrbäuchig (mit Zwischensehnen, z. B. M. rectus abdominis).' },
    ],
    depth: {
      text: [
        'Die Kraft eines Muskels hängt vom physiologischen Querschnitt ab (Summe der Querschnitte aller Fasern senkrecht zu ihrem Verlauf). Gefiederte Muskeln haben viele kurze, schräg ansetzende Fasern: großer physiologischer Querschnitt, also viel Kraft, aber geringe Hubhöhe. Parallelfaserige Muskeln verkürzen sich weiter, sind aber schwächer.',
        'Mehrgelenkige Muskeln wie der Bizeps wirken auf mehrere Gelenke. Sind sie über beide Gelenke gleichzeitig maximal verkürzt, können sie nicht weiter kontrahieren (aktive Insuffizienz); sind sie maximal gedehnt, begrenzen sie die Bewegung (passive Insuffizienz).',
        'Wie Muskel und Gelenk als Hebel zusammenwirken, zeigt die Physik-Lektion zu Kräften und Hebeln: Der kurze Hebelarm des Bizeps erfordert ein Vielfaches der Lastkraft.',
      ],
      pitfalls: ['Ursprung und Ansatz sind eine Konvention – bei manchen Bewegungen wird der „Ursprung“ bewegt (z. B. Klimmzug).', 'Der stärkste reine Ellenbogenbeuger ist der M. brachialis, nicht der Bizeps.', 'Mehr Fasern nebeneinander (Fiederung) bedeuten mehr Kraft, nicht mehr Verkürzung.'],
    },
    terms: [
      { term: 'Ursprung', def: 'Befestigung eines Muskels am weniger bewegten, meist rumpfnäheren Knochen.', synonyms: ['Origo'] },
      { term: 'Ansatz', def: 'Befestigung eines Muskels am bewegten Knochen.', synonyms: ['Insertio'] },
      { term: 'Agonist', def: 'Muskel, der eine Bewegung hauptsächlich ausführt.', synonyms: ['Synergist'] },
      { term: 'Antagonist', def: 'Gegenspieler, der die entgegengesetzte Bewegung ausführt.' },
      { term: 'Physiologischer Querschnitt', def: 'Summe der Faserquerschnitte senkrecht zum Faserverlauf; bestimmt die Kraft.' },
      { term: 'Gefiederter Muskel', def: 'Muskel, dessen Fasern schräg an einer Sehne ansetzen.', synonyms: ['M. pennatus', 'Fiederung'] },
    ],
    models: ['hebel'], links: ['mechanik', 'muskel-nervengewebe', 'gelenke', 'muskelphysiologie'], sources: [P('Allgemeine Anatomie: Muskeln; Obere Extremität: Oberarmmuskeln'), D('Kap. Bewegungsapparat: Muskulatur')], status: S, origin: 'redaktionell',
  },
];
