import type { Lesson, Structure } from './types';

// Biologie für Mediziner, Histologie (Mikroskopische Anatomie, Teil A) und Medizinische Terminologie
// für das 1. Semester.

const S = 'zu_pruefen' as const;
const B = (locator: string) => ({ id: 'buselmaier', locator });
const L = (locator: string) => ({ id: 'luellmann', locator });

// ---------------------------------------------------------------------------
// Biologie
// ---------------------------------------------------------------------------

export const BIO_LESSONS: Lesson[] = [
  {
    id: 'zellzyklus', module: 'cell', title: 'Zellzyklus, Mitose und Meiose', subtitle: 'Wie Zellen ihre Chromosomen verdoppeln und verteilen', difficulty: 'grundlagen', prerequisites: ['zellaufbau'], view: 'cellcycle',
    objectives: [
      'die Phasen des Zellzyklus (G1, S, G2, M, G0) und ihre Kontrollpunkte beschreiben',
      'die Phasen der Mitose in der richtigen Reihenfolge benennen und erkennen',
      'Mitose und Meiose nach Ablauf, Chromosomenzahl und Ergebnis vergleichen',
      'erklären, wie Fehlverteilungen (Non-Disjunction) zu numerischen Chromosomenaberrationen führen',
    ],
    overview: 'Bevor sich eine Zelle teilt, verdoppelt sie ihre DNA. Die Mitose verteilt die Kopien exakt auf zwei genetisch gleiche Tochterzellen. Die Meiose dagegen halbiert den Chromosomensatz und mischt das Erbgut neu – sie erzeugt Keimzellen. Fehler bei der Verteilung führen z. B. zur Trisomie 21.',
    mechanism: [
      { title: 'Interphase', text: 'G1: Wachstum, Zelle ist diploid (2n) mit einfachem DNA-Gehalt (2c). S-Phase: Replikation, danach besteht jedes Chromosom aus zwei Schwesterchromatiden (4c). G2: Vorbereitung der Teilung. Ruhende Zellen treten in G0 aus dem Zyklus aus.' },
      { title: 'Kontrollpunkte', text: 'Am G1/S- und G2/M-Übergang prüft die Zelle u. a. DNA-Schäden (p53 kann den Zyklus anhalten). Der Spindelkontrollpunkt verhindert die Anaphase, bevor alle Chromosomen an der Spindel hängen. Gesteuert wird der Zyklus durch Cycline und cyclinabhängige Kinasen (CDK).' },
      { title: 'Mitose', text: 'Prophase (Chromosomen kondensieren) → Prometaphase (Kernhülle zerfällt, Spindel greift an den Kinetochoren an) → Metaphase (Ausrichtung in der Äquatorialebene) → Anaphase (Schwesterchromatiden werden getrennt) → Telophase (neue Kernhüllen) → Zytokinese.' },
      { title: 'Meiose I', text: 'Homologe Chromosomen paaren sich (Prophase I), tauschen durch Crossing-over Abschnitte aus und werden in der Anaphase I getrennt. Aus 2n wird n – die Reduktionsteilung.' },
      { title: 'Meiose II', text: 'Wie eine Mitose ohne vorherige Replikation: Die Schwesterchromatiden werden getrennt. Ergebnis: vier haploide, genetisch verschiedene Zellen (bei der Oogenese eine Eizelle und Polkörperchen).' },
    ],
    depth: {
      text: [
        'Genetische Vielfalt durch Meiose entsteht doppelt: durch Crossing-over (intrachromosomale Rekombination) und durch die zufällige Verteilung der väterlichen und mütterlichen Homologen (interchromosomale Rekombination, beim Menschen 2²³ ≈ 8 Millionen Kombinationen ohne Crossing-over).',
        'Oogenese: Die primären Oozyten treten schon vor der Geburt in die Prophase I ein und verharren dort (Diktyotän) bis kurz vor dem Eisprung – teils über Jahrzehnte. Die Meiose II wird erst bei der Befruchtung abgeschlossen. Das lange Verharren gilt als ein Grund für das mit dem mütterlichen Alter steigende Risiko einer Non-Disjunction.',
        'Non-Disjunction (Nicht-Trennung) in Meiose I oder II erzeugt Keimzellen mit 24 oder 22 Chromosomen; nach Befruchtung entstehen Trisomien (z. B. 47,XX,+21) oder Monosomien (z. B. 45,X beim Turner-Syndrom).',
      ],
      pitfalls: ['Nach der S-Phase ist die Zelle immer noch diploid (2n), hat aber doppelten DNA-Gehalt (4c).', 'In der Anaphase der Mitose werden Schwesterchromatiden getrennt, in der Anaphase I der Meiose homologe Chromosomen.', 'Crossing-over findet in der Prophase I statt, nicht in der Mitose.'],
    },
    terms: [
      { term: 'Zellzyklus', def: 'Abfolge von Interphase (G1, S, G2) und Mitose (M).', synonyms: ['G1-Phase', 'S-Phase', 'G2-Phase', 'G0'] },
      { term: 'Mitose', def: 'Kernteilung, bei der zwei genetisch identische Tochterkerne entstehen.', synonyms: ['Äquationsteilung'] },
      { term: 'Meiose', def: 'Zwei aufeinanderfolgende Teilungen, die den Chromosomensatz halbieren; Bildung der Keimzellen.', synonyms: ['Reduktionsteilung', 'Reifeteilung'] },
      { term: 'Schwesterchromatiden', def: 'Die zwei identischen DNA-Kopien eines Chromosoms nach der Replikation, am Zentromer verbunden.', synonyms: ['Chromatide', 'Zentromer'] },
      { term: 'Crossing-over', def: 'Austausch von Abschnitten zwischen homologen Chromosomen in der Prophase I.', synonyms: ['Rekombination', 'Chiasma'] },
      { term: 'Non-Disjunction', def: 'Fehlende Trennung von Chromosomen oder Chromatiden bei der Zellteilung.', synonyms: ['Trisomie', 'Monosomie', 'Aneuploidie'] },
    ],
    structures: [], models: [], links: ['genetik', 'proteinbiosynthese'], sources: [B('Kap. „Zellteilung“ (Zellzyklus, Mitose, Meiose)'), { id: 'alberts', locator: 'Kap. „The Cell Cycle“ und „Meiosis“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'genetik', module: 'cell', title: 'Vererbung und Erbgänge', subtitle: 'Mendel-Regeln, Stammbäume und Wiederholungsrisiken', difficulty: 'vertiefung', prerequisites: ['zellzyklus'], view: 'genetics',
    objectives: [
      'Genotyp, Phänotyp, Allel, homozygot und heterozygot korrekt verwenden',
      'die Mendel-Regeln erklären und mit einem Kreuzungsschema Wahrscheinlichkeiten berechnen',
      'autosomal-dominante, autosomal-rezessive und X-chromosomal-rezessive Erbgänge an Stammbäumen erkennen',
      'Kodominanz am Beispiel des AB0-Blutgruppensystems erklären',
    ],
    overview: 'Jeder Mensch trägt von den meisten Genen zwei Kopien (Allele) – eine von der Mutter, eine vom Vater. Ob ein Merkmal sichtbar wird, hängt davon ab, ob es dominant oder rezessiv vererbt wird und ob das Gen auf einem Autosom oder dem X-Chromosom liegt. Daraus lassen sich Risiken für Kinder berechnen.',
    mechanism: [
      { title: 'Allele', text: 'Varianten desselben Gens. Gleiche Allele: homozygot, verschiedene: heterozygot. Der Genotyp ist die Allelkombination, der Phänotyp das ausgeprägte Merkmal.' },
      { title: 'Mendel-Regeln', text: '1. Uniformitätsregel: Kinder zweier reinerbiger Eltern sind gleich. 2. Spaltungsregel: In der zweiten Generation spalten die Merkmale wieder auf (dominant-rezessiv 3 : 1). 3. Unabhängigkeitsregel: Gene auf verschiedenen Chromosomen werden unabhängig kombiniert (gilt nicht für gekoppelte Gene).' },
      { title: 'Autosomal-dominant', text: 'Ein mutiertes Allel genügt. Betroffene in jeder Generation; Kinder eines heterozygot Betroffenen erkranken mit 50 % Wahrscheinlichkeit, unabhängig vom Geschlecht. Beispiele: Chorea Huntington, Marfan-Syndrom.' },
      { title: 'Autosomal-rezessiv', text: 'Erst zwei mutierte Allele führen zur Erkrankung. Eltern sind meist gesunde Überträger (heterozygot); ihr Kind erkrankt mit 25 %. Beispiele: Mukoviszidose, Phenylketonurie, Sichelzellanämie.' },
      { title: 'X-chromosomal-rezessiv', text: 'Männer (XY) haben nur ein X und sind bei einem mutierten Allel betroffen (hemizygot). Überträgerinnen geben das Allel an 50 % ihrer Söhne (betroffen) und Töchter (Überträgerinnen) weiter. Keine Vater-Sohn-Übertragung. Beispiele: Hämophilie A, Muskeldystrophie Duchenne.' },
    ],
    depth: {
      text: [
        'Kodominanz: Beim AB0-System werden A und B nebeneinander ausgeprägt (Blutgruppe AB), 0 ist gegenüber beiden rezessiv. Eltern mit Blutgruppe A (Genotyp A0) und B (B0) können Kinder mit allen vier Blutgruppen haben.',
        'Penetranz beschreibt, bei welchem Anteil der Genträger ein Merkmal überhaupt auftritt; Expressivität, wie stark es ausgeprägt ist. Bei unvollständiger Penetranz kann eine dominante Erkrankung scheinbar eine Generation überspringen.',
        'Mitochondriale Gene werden fast ausschließlich über die Mutter weitergegeben, weil die Mitochondrien der Spermien in der Zygote abgebaut werden.',
      ],
      pitfalls: ['„Rezessiv“ heißt nicht „selten“ – und „dominant“ nicht „häufig“.', 'Die 25 % gelten für jedes Kind neu; sie sind kein Anteil, der sich in einer Familie „aufbraucht“.', 'Bei X-chromosomal-rezessivem Erbgang kann ein betroffener Vater das Allel nicht an Söhne weitergeben (sie erhalten sein Y).'],
    },
    terms: [
      { term: 'Allel', def: 'Zustandsform eines Gens.' },
      { term: 'Genotyp', def: 'Genetische Ausstattung bezüglich eines Merkmals.', synonyms: ['Phänotyp'] },
      { term: 'Heterozygot', def: 'Zwei verschiedene Allele eines Gens.', synonyms: ['mischerbig', 'homozygot', 'reinerbig'] },
      { term: 'Hemizygot', def: 'Nur ein Allel vorhanden, z. B. X-chromosomale Gene beim Mann.' },
      { term: 'Kodominanz', def: 'Beide Allele werden im Phänotyp nebeneinander ausgeprägt.', synonyms: ['AB0'] },
      { term: 'Penetranz', def: 'Anteil der Genträger, bei denen das Merkmal auftritt.', synonyms: ['Expressivität'] },
    ],
    structures: [], models: [], links: ['zellzyklus', 'proteinbiosynthese'], sources: [B('Kap. „Formale Genetik“ (Mendel-Regeln, Erbgänge, Stammbaumanalyse)')], status: S, origin: 'redaktionell',
  },
  {
    id: 'mikroorganismen', module: 'cell', title: 'Prokaryoten, Viren und Pilze', subtitle: 'Bau von Krankheitserregern – und warum Antibiotika nur Bakterien treffen', difficulty: 'grundlagen', prerequisites: ['zellaufbau'],
    objectives: [
      'prokaryotische und eukaryotische Zellen anhand ihrer Merkmale unterscheiden',
      'den Aufbau der Zellwand grampositiver und gramnegativer Bakterien vergleichen',
      'Viren als nicht zelluläre, obligat intrazelluläre Erreger beschreiben',
      'begründen, an welchen Strukturen Antibiotika und Antimykotika selektiv angreifen',
    ],
    overview: 'Bakterien sind Prokaryoten: Zellen ohne Zellkern, mit anderen Ribosomen und einer Zellwand aus Peptidoglykan. Genau diese Unterschiede zu unseren eigenen Zellen machen Antibiotika möglich. Viren sind dagegen keine Zellen – sie vermehren sich nur in Wirtszellen, weshalb Antibiotika gegen sie wirkungslos sind.',
    mechanism: [
      { title: 'Prokaryotische Zelle', text: 'Kein Zellkern (DNA als ringförmiges Chromosom im Nukleoid), keine membranbegrenzten Organellen, 70S-Ribosomen, oft zusätzliche Plasmide. Vermehrung durch Zweiteilung.' },
      { title: 'Zellwand', text: 'Grampositive Bakterien: dicke Peptidoglykanschicht (färbt sich in der Gram-Färbung blau-violett). Gramnegative: dünne Peptidoglykanschicht und eine äußere Membran mit Lipopolysaccharid (LPS, Endotoxin), färben sich rot.' },
      { title: 'Viren', text: 'Erbgut (DNA oder RNA) in einer Proteinhülle (Kapsid), teils mit Lipidhülle aus der Wirtsmembran. Kein eigener Stoffwechsel, keine Ribosomen – Vermehrung nur mithilfe der Wirtszelle.' },
      { title: 'Pilze', text: 'Eukaryoten mit Zellkern und 80S-Ribosomen; ihre Zellmembran enthält Ergosterol statt Cholesterin, die Zellwand u. a. Chitin.' },
      { title: 'Selektive Angriffspunkte', text: 'β-Lactam-Antibiotika (Penicilline) hemmen den Zellwandaufbau, Aminoglykoside, Tetrazykline und Makrolide die bakteriellen 70S-Ribosomen. Viele Antimykotika greifen am Ergosterol an. Menschliche Zellen haben diese Ziele nicht oder in anderer Form.' },
    ],
    depth: {
      text: [
        'Mitochondrien besitzen selbst 70S-ähnliche Ribosomen und ringförmige DNA (Endosymbiontentheorie). Das erklärt, warum manche Antibiotika in hoher Dosis auch die mitochondriale Proteinsynthese beeinträchtigen können.',
        'Resistenzgene liegen häufig auf Plasmiden und können zwischen Bakterien ausgetauscht werden (horizontaler Gentransfer, z. B. Konjugation).',
        'Virusvermehrung: Anheftung an Rezeptoren → Eintritt → Freisetzung des Genoms → Replikation und Proteinsynthese mit Wirtsmaschinerie → Zusammenbau → Freisetzung. Antivirale Mittel greifen an virusspezifischen Enzymen an, z. B. an Polymerasen oder Proteasen.',
      ],
      pitfalls: ['Antibiotika wirken nicht gegen Viren.', 'Prokaryoten haben Ribosomen – nur andere (70S statt 80S).', 'Pilze sind Eukaryoten, keine Bakterien.'],
    },
    terms: [
      { term: 'Prokaryot', def: 'Zelle ohne Zellkern; Bakterien und Archaeen.', synonyms: ['Prokaryoten', 'Bakterien', 'Nukleoid'] },
      { term: 'Peptidoglykan', def: 'Netzartiges Polymer aus Zuckern und Peptiden in der Bakterienzellwand.', synonyms: ['Murein'] },
      { term: 'Gram-Färbung', def: 'Färbemethode, die Bakterien nach ihrem Zellwandaufbau in grampositiv und gramnegativ einteilt.', synonyms: ['grampositiv', 'gramnegativ'] },
      { term: 'Plasmid', def: 'Kleines, zusätzliches DNA-Molekül in Bakterien, oft mit Resistenzgenen.' },
      { term: 'Kapsid', def: 'Proteinhülle eines Virus.', synonyms: ['Virion'] },
    ],
    structures: [], models: [], links: ['zellaufbau', 'proteinbiosynthese'], sources: [B('Kap. „Prokaryoten“ und „Viren“'), { id: 'alberts', locator: 'Kap. „Pathogens and Infection“' }], status: S, origin: 'redaktionell',
  },
];

// ---------------------------------------------------------------------------
// Histologie
// ---------------------------------------------------------------------------

const tis = (id: string, deName: string, sciName: string, synonyms: string[], short: string, long: string, fn: string, location: string, connections: string[], lessons: string[], locator: string, parent?: string): Structure => ({
  id, deName, sciName, synonyms, short, long, function: fn, location, connections, lessons, figure: 'tissue', sources: [L(locator)], status: S, ...(parent ? { parent } : {}),
});

export const TISSUE_STRUCTURES: Structure[] = [
  // Epithelgewebe
  tis('h-platten-ein', 'Einschichtiges Plattenepithel', 'Epithelium simplex squamosum', ['Endothel', 'Mesothel'], 'Eine Lage flacher Zellen; sehr kurze Diffusionsstrecke.', 'Die Zellen sind so flach, dass im Schnitt oft nur ihr abgeflachter Kern auffällt. Als Endothel kleidet es alle Blut- und Lymphgefäße aus, als Mesothel die serösen Höhlen (Pleura, Perikard, Peritoneum); in den Lungenalveolen bilden die Pneumozyten Typ I die Gasaustauschfläche.', 'Stoff- und Gasaustausch, glatte Oberfläche.', 'Gefäße, seröse Häute, Alveolen.', ['h-basalmembran'], ['epithel'], 'Kap. „Epithelgewebe“'),
  tis('h-iso', 'Einschichtiges isoprismatisches Epithel', 'Epithelium simplex cuboideum', ['kubisches Epithel'], 'Eine Lage etwa würfelförmiger Zellen mit runden, zentralen Kernen.', 'Typisch für Gewebe mit Transport- oder Sekretionsaufgaben, z. B. die Follikelzellen der Schilddrüse und viele Abschnitte der Nierentubuli und Drüsenausführungsgänge.', 'Sekretion und Resorption.', 'Schilddrüse, Nierentubuli, kleine Ausführungsgänge.', ['h-basalmembran'], ['epithel'], 'Kap. „Epithelgewebe“'),
  tis('h-hoch', 'Einschichtiges hochprismatisches Epithel', 'Epithelium simplex columnare', ['Zylinderepithel', 'Säulenepithel'], 'Eine Lage hoher Zellen mit länglichen, basal gelegenen Kernen.', 'Im Dünndarm tragen die Zellen apikal einen Bürstensaum aus Mikrovilli (Oberflächenvergrößerung für die Resorption); eingestreute Becherzellen bilden Schleim. Auch Magen, Dickdarm und Gallenblase sind so ausgekleidet.', 'Resorption, Sekretion, Schutz durch Schleim.', 'Magen-Darm-Trakt, Gallenblase.', ['h-basalmembran', 'h-mikrovilli'], ['epithel'], 'Kap. „Epithelgewebe“'),
  tis('h-resp', 'Mehrreihiges Flimmerepithel', 'Epithelium pseudostratificatum ciliatum', ['respiratorisches Epithel', 'mehrreihiges hochprismatisches Epithel'], 'Alle Zellen sitzen der Basalmembran auf, aber nicht alle erreichen die Oberfläche – die Kerne liegen in mehreren Reihen.', 'Kinozilien schlagen gerichtet und befördern den von Becherzellen gebildeten Schleim mit Partikeln rachenwärts (mukoziliäre Clearance). Mehrreihig ist nicht mehrschichtig: Es gibt nur eine Zelllage.', 'Reinigung der Atemluft.', 'Nasenhöhle, Trachea, Bronchien.', ['h-basalmembran', 'h-kinozilien'], ['epithel'], 'Kap. „Epithelgewebe“ und „Atmungsorgane“'),
  tis('h-platten-mehr', 'Mehrschichtiges unverhorntes Plattenepithel', 'Epithelium stratificatum squamosum noncornificatum', ['unverhorntes Plattenepithel'], 'Viele Zelllagen; nur die oberste ist flach, die Zellen behalten ihre Kerne.', 'Die basalen Zellen teilen sich und wandern zur Oberfläche, wo sie abschilfern. Die Oberfläche wird feucht gehalten.', 'Schutz gegen mechanische Belastung auf feuchten Oberflächen.', 'Mundhöhle, Ösophagus, Vagina, Hornhaut des Auges.', ['h-basalmembran', 'h-verhornt'], ['epithel'], 'Kap. „Epithelgewebe“'),
  tis('h-verhornt', 'Mehrschichtiges verhorntes Plattenepithel', 'Epithelium stratificatum squamosum cornificatum', ['Epidermis', 'verhorntes Plattenepithel'], 'Mehrschichtiges Plattenepithel mit einer Hornschicht aus kernlosen, keratingefüllten Zellen.', 'Die Epidermis gliedert sich von basal nach apikal in Stratum basale, spinosum, granulosum, (lucidum an Handflächen und Fußsohlen) und corneum. Die Hornschicht schützt vor Wasserverlust und Keimen.', 'Mechanischer Schutz, Verdunstungsschutz, Barriere.', 'Haut (Epidermis).', ['h-platten-mehr', 'h-basalmembran'], ['epithel'], 'Kap. „Haut“'),
  tis('h-urothel', 'Urothel', 'Urothelium', ['Übergangsepithel'], 'Mehrschichtiges Epithel der ableitenden Harnwege mit großen Deckzellen.', 'Die oberflächlichen Deckzellen (Schirmzellen) sind oft zweikernig und tragen an der Oberfläche verdickte Membranbereiche (Uroplakine), die das Epithel gegen den Harn abdichten. Je nach Füllung wirkt es dicker oder flacher.', 'Dehnbare, harndichte Auskleidung.', 'Nierenbecken, Harnleiter, Harnblase, Anfang der Harnröhre.', ['h-basalmembran'], ['epithel'], 'Kap. „Harnorgane“'),
  tis('h-basalmembran', 'Basalmembran', 'Membrana basalis', ['Basallamina'], 'Dünne extrazelluläre Schicht zwischen Epithel und Bindegewebe.', 'Besteht aus der Basallamina (u. a. Kollagen Typ IV, Laminin) und je nach Ort einer Lamina fibroreticularis. Epithelien sind gefäßfrei und werden durch die Basalmembran hindurch per Diffusion aus dem Bindegewebe versorgt.', 'Verankerung, Filter, Grenze zwischen Epithel und Bindegewebe.', 'Unter jedem Epithel.', ['h-bindegewebe-locker'], ['epithel', 'bindegewebe'], 'Kap. „Epithelgewebe“'),
  tis('h-mikrovilli', 'Mikrovilli (Bürstensaum)', 'Microvilli', ['Bürstensaum', 'Stäbchensaum'], 'Fingerförmige Ausstülpungen der apikalen Zellmembran mit Aktinfilamenten im Inneren.', 'Vergrößern die resorbierende Oberfläche um ein Vielfaches; sie sind unbeweglich und lichtmikroskopisch nur als Saum erkennbar.', 'Oberflächenvergrößerung für die Resorption.', 'Dünndarm, proximaler Nierentubulus.', ['h-hoch'], ['epithel'], 'Kap. „Epithelgewebe“ (Oberflächendifferenzierungen)', 'h-hoch'),
  tis('h-kinozilien', 'Kinozilien', 'Kinocilia', ['Flimmerhaare', 'Zilien'], 'Bewegliche Zellfortsätze mit einem 9×2+2-Mikrotubulusgerüst.', 'Dynein-Motoren lassen die Mikrotubuli gegeneinander gleiten; so schlagen Zilien koordiniert. Bei der primären ziliären Dyskinesie sind sie unbeweglich – mit chronischen Atemwegsinfekten als Folge.', 'Gerichteter Transport von Schleim oder Flüssigkeit.', 'Atemwege, Eileiter.', ['h-resp'], ['epithel'], 'Kap. „Epithelgewebe“ (Oberflächendifferenzierungen)', 'h-resp'),
  // Binde- und Stützgewebe
  tis('h-bindegewebe-locker', 'Lockeres Bindegewebe', 'Textus connectivus laxus', ['interstitielles Bindegewebe'], 'Viele Zellen und viel Grundsubstanz, wenige locker angeordnete Fasern.', 'Füllt Räume zwischen Organen und Geweben, umgibt Gefäße und Nerven und enthält neben ortsständigen Fibroblasten viele freie Zellen der Abwehr (Makrophagen, Mastzellen, Plasmazellen, Lymphozyten).', 'Verschiebeschicht, Wasserspeicher, Ort von Abwehrreaktionen.', 'Unterhaut, Schleimhäute (Lamina propria), um Gefäße.', ['h-fibroblast', 'h-kollagen', 'h-basalmembran'], ['bindegewebe'], 'Kap. „Bindegewebe“'),
  tis('h-straff', 'Straffes Bindegewebe', 'Textus connectivus compactus', ['straffes parallelfaseriges Bindegewebe', 'Sehnengewebe'], 'Überwiegend dicht gepackte Kollagenfasern, wenige Zellen.', 'Geflechtartig (Fasern in verschiedenen Richtungen) in Dermis, Organkapseln und Faszien; parallelfaserig in Sehnen und Bändern, wo die Fibroblasten (Tendinozyten) in Reihen zwischen den Faserbündeln liegen.', 'Zugfestigkeit.', 'Sehnen, Bänder, Dermis, Organkapseln.', ['h-kollagen', 'h-fibroblast'], ['bindegewebe'], 'Kap. „Bindegewebe“'),
  tis('h-fibroblast', 'Fibroblast', 'Fibroblastus', ['Fibrozyt'], 'Ortsständige Bindegewebszelle; bildet Fasern und Grundsubstanz.', 'Aktive Fibroblasten haben viel raues ER und einen großen Kern; ruhende Formen werden Fibrozyten genannt. Bei der Wundheilung vermehren sie sich und bilden Narbengewebe.', 'Synthese der extrazellulären Matrix.', 'In allen Bindegeweben.', ['h-kollagen', 'h-elastisch'], ['bindegewebe'], 'Kap. „Bindegewebe“ (Zellen)'),
  tis('h-kollagen', 'Kollagenfasern', 'Fibrae collagenosae', ['Kollagen Typ I'], 'Zugfeste, kaum dehnbare Fasern; in H.E. rosa (eosinophil).', 'Kollagen Typ I bildet dicke Fasern in Haut, Sehnen und Knochen. Kollagen Typ II kommt im hyalinen Knorpel vor, Typ III bildet retikuläre Fasern, Typ IV Netze in der Basallamina. Für die Kollagensynthese ist Vitamin C nötig (Mangel: Skorbut).', 'Zugfestigkeit.', 'Extrazellulärmatrix fast aller Bindegewebe.', ['h-fibroblast', 'h-straff'], ['bindegewebe'], 'Kap. „Bindegewebe“ (Fasern)'),
  tis('h-elastisch', 'Elastische Fasern', 'Fibrae elasticae', ['Elastin'], 'Dehnbare Fasern aus Elastin und Fibrillin, die nach Dehnung in ihre Form zurückkehren.', 'In H.E. kaum sichtbar, mit Spezialfärbungen (z. B. Resorcin-Fuchsin) gut darstellbar. Bei Mutationen im Fibrillin-Gen entsteht das Marfan-Syndrom.', 'Elastizität.', 'Wand der Aorta und großer Arterien, Lunge, Haut, elastischer Knorpel.', ['h-fibroblast', 'h-knorpel-elastisch'], ['bindegewebe'], 'Kap. „Bindegewebe“ (Fasern)'),
  tis('h-fett', 'Fettgewebe', 'Textus adiposus', ['weißes Fettgewebe', 'braunes Fettgewebe'], 'Bindegewebe aus Fettzellen (Adipozyten).', 'Weiße Fettzellen enthalten einen großen Fetttropfen (univakuolär), der den Kern an den Rand drückt („Siegelringzelle“); im Präparat erscheinen sie leer, weil das Fett bei der Einbettung herausgelöst wird. Braune Fettzellen haben viele kleine Tropfen und viele Mitochondrien zur Wärmebildung (UCP1), v. a. beim Neugeborenen.', 'Energiespeicher, Wärmeisolation, Polster, Hormonbildung (z. B. Leptin).', 'Unterhaut, um Organe.', ['h-bindegewebe-locker'], ['bindegewebe'], 'Kap. „Fettgewebe“'),
  tis('h-knorpel-hyalin', 'Hyaliner Knorpel', 'Cartilago hyalina', ['Gelenkknorpel'], 'Druckelastischer Knorpel mit glasig homogener Matrix (Kollagen Typ II).', 'Chondrozyten liegen in Lakunen, oft in kleinen Gruppen aus einer Mutterzelle (isogene Gruppen, Chondrone). Knorpel ist gefäßfrei und wird per Diffusion versorgt – deshalb heilen Knorpelschäden schlecht. Außer am Gelenkknorpel ist er von Perichondrium umgeben.', 'Druckelastizität, gleitfähige Gelenkflächen, Vorstufe des Knochens in der Entwicklung.', 'Gelenkflächen, Rippenknorpel, Trachealspangen, Kehlkopf.', ['h-knorpel-elastisch', 'h-knorpel-faser', 'h-knochen'], ['bindegewebe'], 'Kap. „Knorpel“'),
  tis('h-knorpel-elastisch', 'Elastischer Knorpel', 'Cartilago elastica', [], 'Knorpel mit zusätzlichem Netz elastischer Fasern.', 'Aufbau wie hyaliner Knorpel, aber biegsam. Verkalkt im Alter nicht.', 'Biegsame Stützstruktur.', 'Ohrmuschel, äußerer Gehörgang, Kehldeckel (Epiglottis).', ['h-knorpel-hyalin', 'h-elastisch'], ['bindegewebe'], 'Kap. „Knorpel“'),
  tis('h-knorpel-faser', 'Faserknorpel', 'Cartilago fibrosa', ['Bindegewebsknorpel'], 'Knorpel mit vielen Kollagenfasern (Typ I) und wenigen Chondrozyten.', 'Übergangsform zwischen straffem Bindegewebe und Knorpel; hält Zug und Druck stand. Kein Perichondrium.', 'Zug- und druckfeste Verbindung.', 'Bandscheiben (Anulus fibrosus), Menisken, Schambeinfuge (Symphyse).', ['h-knorpel-hyalin', 'h-kollagen'], ['bindegewebe'], 'Kap. „Knorpel“'),
  tis('h-knochen', 'Lamellenknochen', 'Os lamellosum', ['Osteon', 'Havers-System', 'Kompakta'], 'Knochen aus konzentrischen Lamellen um einen Zentralkanal (Osteon).', 'Im Zentrum jedes Osteons verläuft ein Havers-Kanal mit Gefäßen; Volkmann-Kanäle verbinden quer. Osteozyten liegen in Lakunen und stehen über feine Kanälchen (Canaliculi) miteinander in Kontakt. Die Matrix besteht aus Kollagen Typ I und Hydroxylapatit. Osteoblasten bauen auf, mehrkernige Osteoklasten (aus der Monozyten-Makrophagen-Linie) bauen ab.', 'Stütze, Schutz, Mineralspeicher (Ca²⁺, Phosphat), Blutbildung im Mark.', 'Kompakta der Röhrenknochen, Spongiosa-Bälkchen.', ['h-knorpel-hyalin', 'h-kollagen'], ['bindegewebe'], 'Kap. „Knochen“'),
  // Muskel- und Nervengewebe
  tis('h-skelettmuskel', 'Skelettmuskelgewebe', 'Textus muscularis striatus skeletalis', ['quergestreifte Muskulatur'], 'Lange, vielkernige Muskelfasern mit randständigen Kernen und Querstreifung.', 'Jede Faser entsteht durch Verschmelzung vieler Myoblasten (Synzytium) und kann viele Zentimeter lang sein. Die Querstreifung beruht auf der regelmäßigen Anordnung der Sarkomere. Willkürlich innerviert, Satellitenzellen ermöglichen begrenzte Regeneration.', 'Willkürliche Bewegung, Haltung, Wärmebildung.', 'Skelettmuskeln, Zunge, oberer Ösophagus.', ['h-herzmuskel', 'h-glatt'], ['muskel-nervengewebe', 'muskelphysiologie'], 'Kap. „Muskelgewebe“'),
  tis('h-herzmuskel', 'Herzmuskelgewebe', 'Textus muscularis striatus cardiacus', ['Myokard', 'Glanzstreifen'], 'Verzweigte, quergestreifte Zellen mit meist einem zentralen Kern, verbunden durch Glanzstreifen.', 'Die Glanzstreifen (Disci intercalares) enthalten Fasciae adhaerentes und Desmosomen für den mechanischen Zusammenhalt sowie Gap Junctions, über die die Erregung von Zelle zu Zelle springt. Herzmuskelzellen regenerieren kaum – Infarktgewebe wird durch Narbe ersetzt.', 'Unwillkürliche, rhythmische Kontraktion.', 'Herz.', ['h-skelettmuskel', 'h-glatt'], ['muskel-nervengewebe'], 'Kap. „Muskelgewebe“'),
  tis('h-glatt', 'Glattes Muskelgewebe', 'Textus muscularis levis', ['glatte Muskulatur'], 'Spindelförmige Zellen mit einem zentralen Kern, ohne Querstreifung.', 'Aktin und Myosin sind nicht in Sarkomeren angeordnet, daher fehlt die Querstreifung. Kontraktionen sind langsamer, aber ausdauernd; gesteuert vegetativ, hormonell oder lokal.', 'Unwillkürliche Kontraktion von Hohlorganen und Gefäßen.', 'Gefäßwände, Darm, Harnblase, Uterus, Bronchien.', ['h-skelettmuskel', 'h-herzmuskel'], ['muskel-nervengewebe'], 'Kap. „Muskelgewebe“'),
  tis('h-neuron', 'Nervenzelle im Präparat', 'Neuronum', ['Perikaryon', 'Nissl-Schollen'], 'Großer Zellkörper mit hellem Kern, deutlichem Nukleolus und basophilen Nissl-Schollen.', 'Die Nissl-Schollen sind Stapel von rauem ER und färben sich mit Hämatoxylin blau-violett. Der Axonhügel ist frei davon. Zwischen den Neuronen liegt das Neuropil aus Fortsätzen und Gliazellen.', 'Erregungsbildung und -weiterleitung.', 'Graue Substanz von Gehirn und Rückenmark, Ganglien.', ['h-glia'], ['muskel-nervengewebe', 'neuron-anatomie'], 'Kap. „Nervengewebe“'),
  tis('h-glia', 'Gliazellen', 'Neuroglia', ['Astrozyten', 'Oligodendrozyten', 'Mikroglia', 'Schwann-Zellen'], 'Stütz- und Versorgungszellen des Nervensystems.', 'ZNS: Astrozyten (Ionen- und Transmitterhaushalt, Blut-Hirn-Schranke), Oligodendrozyten (Myelin für mehrere Axone), Mikroglia (Abwehr), Ependymzellen (Auskleidung der Ventrikel). PNS: Schwann-Zellen (Myelin für je ein Internodium eines Axons) und Mantelzellen in Ganglien.', 'Stütze, Isolation, Stoffwechsel, Abwehr.', 'Gesamtes Nervensystem.', ['h-neuron'], ['muskel-nervengewebe', 'erregungsleitung'], 'Kap. „Nervengewebe“'),
];

export const HISTO_LESSONS: Lesson[] = [
  {
    id: 'epithel', module: 'histo', title: 'Epithelgewebe', subtitle: 'Einteilung nach Schichtung und Zellform, Oberflächen, Zellkontakte, Drüsen', difficulty: 'grundlagen', prerequisites: [], view: 'tissue',
    structures: ['h-platten-ein', 'h-iso', 'h-hoch', 'h-resp', 'h-platten-mehr', 'h-verhornt', 'h-urothel', 'h-basalmembran', 'h-mikrovilli', 'h-kinozilien'],
    objectives: [
      'Epithelien nach Schichtung und Form der oberflächlichen Zellen benennen',
      'jedem Epitheltyp typische Vorkommen im Körper zuordnen',
      'Mikrovilli und Kinozilien nach Aufbau und Funktion unterscheiden',
      'die Zellkontakte des Epithels nach ihrer Funktion ordnen',
    ],
    overview: 'Epithelien bedecken Oberflächen und kleiden Hohlräume aus. Benannt werden sie nach zwei Fragen: Wie viele Zelllagen gibt es (ein-, mehrschichtig oder mehrreihig)? Und welche Form haben die Zellen an der Oberfläche (platt, isoprismatisch, hochprismatisch)? Aus Form und Ort lässt sich fast immer auf die Funktion schließen.',
    mechanism: [
      { title: 'Grundeigenschaften', text: 'Dicht aneinanderliegende Zellen, wenig Interzellularsubstanz, eine apikale und eine basale Seite (Polarität), Basalmembran zum Bindegewebe, keine Blutgefäße.' },
      { title: 'Schichtung', text: 'Einschichtig: eine Lage. Mehrschichtig: mehrere Lagen übereinander. Mehrreihig: eine Lage, deren Kerne aber in verschiedenen Höhen liegen.' },
      { title: 'Zellform', text: 'Benannt wird nach der obersten Zelllage: platt, isoprismatisch (kubisch) oder hochprismatisch (zylindrisch).' },
      { title: 'Oberfläche', text: 'Mikrovilli vergrößern die Fläche (Resorption), Kinozilien transportieren Schleim, Stereozilien (lange Mikrovilli) kommen z. B. im Nebenhoden vor.' },
      { title: 'Zellkontakte', text: 'Von apikal nach basal: Zonula occludens (dichtet ab), Zonula adhaerens und Desmosomen (mechanische Haftung), Gap Junctions (Kommunikation), Hemidesmosomen (Verankerung an der Basalmembran).' },
    ],
    depth: {
      text: [
        'Drüsen entstehen aus Epithel. Exokrine Drüsen geben ihr Sekret über Ausführungsgänge an eine Oberfläche ab, endokrine ins Blut. Nach dem Sekretionsmodus unterscheidet man merokrin/ekkrin (Exozytose, z. B. Schweißdrüsen), apokrin (mit abgeschnürtem Zytoplasma, z. B. Milchdrüse für die Fette) und holokrin (die ganze Zelle wird zum Sekret, z. B. Talgdrüse).',
        'Im Histologiekurs hilft die Färbung: In H.E. erscheinen Kerne und raues ER blau-violett (basophil, durch Hämatoxylin), Zytoplasma und Kollagen rosa (eosinophil, durch Eosin).',
        'Metaplasie: Ein Epitheltyp kann sich bei chronischer Reizung in einen anderen umwandeln, z. B. respiratorisches Epithel in Plattenepithel bei Rauchern oder Plattenepithel in Zylinderepithel im unteren Ösophagus bei Reflux (Barrett-Ösophagus).',
      ],
      pitfalls: ['Mehrreihig ist nicht mehrschichtig – alle Zellen berühren die Basalmembran.', 'Der Name eines mehrschichtigen Epithels richtet sich nach der Form der oberflächlichen Zellen.', 'Epithel hat keine Blutgefäße; es wird per Diffusion versorgt.'],
    },
    terms: [
      { term: 'Epithel', def: 'Gewebe aus dicht gelagerten Zellen, das Oberflächen bedeckt oder Drüsen bildet.', synonyms: ['Epithelgewebe', 'Deckgewebe'] },
      { term: 'Becherzelle', def: 'Schleimbildende Einzelzelle in Darm- und Atemwegsepithel.' },
      { term: 'Zonula occludens', def: 'Abdichtender Zellkontakt (Tight Junction) nahe der apikalen Oberfläche.', synonyms: ['Tight Junction', 'Schlussleiste'] },
      { term: 'Desmosom', def: 'Punktförmiger Haftkontakt, an dem Intermediärfilamente (Keratin) verankert sind.', synonyms: ['Macula adhaerens', 'Hemidesmosom'] },
      { term: 'Gap Junction', def: 'Kanalbildender Kontakt, durch den Ionen und kleine Moleküle zwischen Zellen wandern.', synonyms: ['Nexus', 'Connexon'] },
      { term: 'Basophil', def: 'Mit basischen Farbstoffen (Hämatoxylin) anfärbbar, also sauer – z. B. DNA, RNA.', synonyms: ['eosinophil', 'acidophil', 'H.E.'] },
    ],
    models: [], links: ['bindegewebe', 'optik', 'zellaufbau'], sources: [L('Kap. „Epithelgewebe“ und „Drüsen“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'bindegewebe', module: 'histo', title: 'Binde- und Stützgewebe', subtitle: 'Fasern, Zellen, Grundsubstanz – vom lockeren Bindegewebe bis zum Knochen', difficulty: 'grundlagen', prerequisites: ['epithel'], view: 'tissue',
    structures: ['h-bindegewebe-locker', 'h-straff', 'h-fibroblast', 'h-kollagen', 'h-elastisch', 'h-fett', 'h-knorpel-hyalin', 'h-knorpel-elastisch', 'h-knorpel-faser', 'h-knochen'],
    objectives: [
      'Zellen, Fasern und Grundsubstanz des Bindegewebes benennen und ihre Funktion angeben',
      'lockeres und straffes Bindegewebe sowie weißes und braunes Fettgewebe unterscheiden',
      'die drei Knorpelarten nach Fasergehalt und Vorkommen unterscheiden',
      'den Aufbau eines Osteons und die Aufgaben der Knochenzellen beschreiben',
    ],
    overview: 'Binde- und Stützgewebe bestehen – anders als Epithel – vor allem aus extrazellulärer Matrix. Welche Fasern in welcher Dichte vorliegen und ob die Grundsubstanz verkalkt, entscheidet, ob ein Gewebe weich und verschieblich (lockeres Bindegewebe), zugfest (Sehne), druckelastisch (Knorpel) oder hart (Knochen) ist.',
    mechanism: [
      { title: 'Zellen', text: 'Ortsständig: Fibroblasten (Bindegewebe), Chondrozyten (Knorpel), Osteozyten (Knochen), Adipozyten (Fett). Frei beweglich: Makrophagen, Mastzellen, Plasmazellen, Lymphozyten, Granulozyten.' },
      { title: 'Fasern', text: 'Kollagenfasern (zugfest), elastische Fasern (dehnbar), retikuläre Fasern (Kollagen Typ III; feine Netze in Lymphknoten, Milz, Knochenmark).' },
      { title: 'Grundsubstanz', text: 'Proteoglykane mit Glykosaminoglykanen (z. B. Hyaluronsäure, Chondroitinsulfat) binden viel Wasser – das macht Knorpel druckelastisch.' },
      { title: 'Knorpel', text: 'Gefäßfrei; Chondrozyten in Lakunen. Hyalin (Kollagen II), elastisch (plus elastische Fasern), Faserknorpel (viel Kollagen I).' },
      { title: 'Knochen', text: 'Mineralisierte Matrix (Kollagen I und Hydroxylapatit) in Lamellen um Havers-Kanäle. Osteoblasten bauen auf, Osteoklasten bauen ab – Knochen wird zeitlebens umgebaut.' },
    ],
    depth: {
      text: [
        'Knochen entsteht auf zwei Wegen: desmal (direkt aus Bindegewebe, z. B. Schädeldach, Schlüsselbein) oder chondral (über ein Knorpelmodell, z. B. Röhrenknochen). Das Längenwachstum der Röhrenknochen findet in der Epiphysenfuge aus hyalinem Knorpel statt.',
        'Zuerst entsteht Geflechtknochen mit ungeordneten Kollagenfasern; er wird später in Lamellenknochen umgebaut. Auch bei der Frakturheilung bildet sich zunächst Geflechtknochen.',
        'Mastzellen enthalten Granula mit Histamin und Heparin; ihre Ausschüttung ist an allergischen Reaktionen beteiligt. Plasmazellen sind ausdifferenzierte B-Lymphozyten und bilden Antikörper.',
      ],
      pitfalls: ['Fettzellen wirken im Präparat leer, weil das Fett bei der Einbettung herausgelöst wurde.', 'Knorpel ist gefäßfrei – Knochen dagegen gut durchblutet.', 'Osteoklasten stammen nicht von Osteoblasten ab, sondern aus der Monozyten-Makrophagen-Linie.'],
    },
    terms: [
      { term: 'Extrazelluläre Matrix', def: 'Fasern und Grundsubstanz zwischen den Zellen.', synonyms: ['EZM', 'Interzellularsubstanz'] },
      { term: 'Proteoglykan', def: 'Protein mit vielen gebundenen Glykosaminoglykanketten; bindet Wasser.', synonyms: ['Glykosaminoglykan', 'Hyaluronsäure'] },
      { term: 'Chondrozyt', def: 'Knorpelzelle in einer Lakune.', synonyms: ['isogene Gruppe', 'Chondron'] },
      { term: 'Osteozyt', def: 'In Knochenmatrix eingemauerte Knochenzelle.', synonyms: ['Osteoblast', 'Osteoklast'] },
      { term: 'Perichondrium', def: 'Bindegewebige Knorpelhaut mit Gefäßen; fehlt am Gelenk- und Faserknorpel.', synonyms: ['Periost'] },
    ],
    models: [], links: ['epithel', 'muskel-nervengewebe', 'naturstoffe'], sources: [L('Kap. „Bindegewebe“, „Fettgewebe“, „Knorpel“ und „Knochen“')], status: S, origin: 'redaktionell',
  },
  {
    id: 'muskel-nervengewebe', module: 'histo', title: 'Muskel- und Nervengewebe', subtitle: 'Skelett-, Herz- und glatte Muskulatur; Neurone und Glia im Präparat', difficulty: 'grundlagen', prerequisites: ['epithel'], view: 'tissue',
    structures: ['h-skelettmuskel', 'h-herzmuskel', 'h-glatt', 'h-neuron', 'h-glia'],
    objectives: [
      'Skelett-, Herz- und glatte Muskulatur im Schnitt anhand von Kernlage, Zellform und Querstreifung unterscheiden',
      'den Aufbau der Glanzstreifen und ihre Bedeutung für das Herz erklären',
      'Neurone und die verschiedenen Gliazellen von ZNS und PNS benennen',
    ],
    overview: 'Muskelgewebe ist auf Kontraktion spezialisiert, Nervengewebe auf Erregung und ihre Weiterleitung. Im Mikroskop unterscheidet man die drei Muskeltypen schnell an zwei Merkmalen: Wo liegen die Kerne, und gibt es eine Querstreifung?',
    mechanism: [
      { title: 'Skelettmuskel', text: 'Lange Fasern (Synzytien) mit vielen randständigen Kernen und deutlicher Querstreifung.' },
      { title: 'Herzmuskel', text: 'Verzweigte Zellen mit 1–2 zentralen Kernen, Querstreifung und Glanzstreifen an den Zellgrenzen.' },
      { title: 'Glatte Muskulatur', text: 'Spindelförmige Zellen mit einem zentralen, oft zigarrenförmigen Kern, keine Querstreifung.' },
      { title: 'Neurone', text: 'Großes Perikaryon mit hellem Kern, großem Nukleolus und Nissl-Schollen (raues ER); Fortsätze im Neuropil.' },
      { title: 'Glia', text: 'Im ZNS Astrozyten, Oligodendrozyten, Mikroglia und Ependym; im PNS Schwann- und Mantelzellen. Gliazellen sind zahlreicher als Neurone und können sich teilen.' },
    ],
    depth: {
      text: [
        'Regeneration: Skelettmuskel kann über Satellitenzellen begrenzt nachwachsen, Herzmuskel praktisch nicht (Narbe nach Infarkt), glatte Muskulatur kann sich teilen. Neurone teilen sich nach der Entwicklung meist nicht mehr; periphere Axone können aber entlang der Schwann-Zellen nachwachsen.',
        'Im Querschnitt hilft die Kernlage besonders: randständige Kerne sprechen für Skelettmuskel, zentrale für Herz- oder glatte Muskulatur.',
      ],
      pitfalls: ['Auch Herzmuskel ist quergestreift.', 'Ein Oligodendrozyt myelinisiert mehrere Axone, eine Schwann-Zelle nur einen Abschnitt eines Axons.'],
    },
    terms: [
      { term: 'Synzytium', def: 'Vielkernige Zelle, die durch Verschmelzung entstanden ist.', synonyms: ['Muskelfaser'] },
      { term: 'Glanzstreifen', def: 'Zellverbindungen zwischen Herzmuskelzellen mit Haftkontakten und Gap Junctions.', synonyms: ['Disci intercalares'] },
      { term: 'Nissl-Schollen', def: 'Basophile Stapel von rauem ER im Perikaryon von Neuronen.', synonyms: ['Nissl-Substanz'] },
      { term: 'Neuroglia', def: 'Gesamtheit der Gliazellen.', synonyms: ['Glia', 'Gliazelle'] },
    ],
    models: [], links: ['neuron-anatomie', 'muskelphysiologie', 'bindegewebe'], sources: [L('Kap. „Muskelgewebe“ und „Nervengewebe“')], status: S, origin: 'redaktionell',
  },
];

// ---------------------------------------------------------------------------
// Medizinische Terminologie
// ---------------------------------------------------------------------------

export interface TermCard { term: string; meaning: string; example?: string; group: 'lage' | 'ebene' | 'praefix' | 'suffix' | 'organ' | 'grammatik' }

export const TERM_CARDS: TermCard[] = [
  { term: 'anterior / ventralis', meaning: 'vorne / bauchwärts', example: 'Facies anterior', group: 'lage' },
  { term: 'posterior / dorsalis', meaning: 'hinten / rückenwärts', example: 'Musculus latissimus dorsi', group: 'lage' },
  { term: 'superior / cranialis', meaning: 'oben / kopfwärts', example: 'Vena cava superior', group: 'lage' },
  { term: 'inferior / caudalis', meaning: 'unten / steißwärts', example: 'Vena cava inferior', group: 'lage' },
  { term: 'medialis', meaning: 'zur Mitte hin', example: 'Malleolus medialis', group: 'lage' },
  { term: 'lateralis', meaning: 'zur Seite hin, von der Mitte weg', example: 'Malleolus lateralis', group: 'lage' },
  { term: 'proximalis', meaning: 'zum Rumpf hin (an Gliedmaßen)', example: 'proximale Phalanx', group: 'lage' },
  { term: 'distalis', meaning: 'vom Rumpf weg (an Gliedmaßen)', example: 'distaler Radius', group: 'lage' },
  { term: 'superficialis', meaning: 'oberflächlich', example: 'Arteria temporalis superficialis', group: 'lage' },
  { term: 'profundus', meaning: 'tief', example: 'Arteria profunda femoris', group: 'lage' },
  { term: 'dexter / sinister', meaning: 'rechts / links', example: 'Ventriculus sinister', group: 'lage' },
  { term: 'internus / externus', meaning: 'innen / außen', example: 'Arteria carotis interna', group: 'lage' },
  { term: 'centralis / periphericus', meaning: 'zum Zentrum hin / zum Rand hin', example: 'zentrales und peripheres Nervensystem', group: 'lage' },
  { term: 'palmaris', meaning: 'zur Handfläche hin', example: 'Aponeurosis palmaris', group: 'lage' },
  { term: 'plantaris', meaning: 'zur Fußsohle hin', example: 'Aponeurosis plantaris', group: 'lage' },
  { term: 'rostralis', meaning: 'zum vorderen Kopfende hin (im Gehirn: stirnwärts)', group: 'lage' },
  { term: 'Sagittalebene', meaning: 'senkrechte Ebene von vorne nach hinten; die mittlere heißt Medianebene', group: 'ebene' },
  { term: 'Frontalebene', meaning: 'senkrechte Ebene parallel zur Stirn', example: 'auch Koronarebene', group: 'ebene' },
  { term: 'Transversalebene', meaning: 'waagerechte Ebene (Querschnitt)', example: 'auch Horizontalebene; CT-Schnitte', group: 'ebene' },
  { term: 'hyper-', meaning: 'über, übermäßig', example: 'Hypertonie', group: 'praefix' },
  { term: 'hypo-', meaning: 'unter, vermindert', example: 'Hypoglykämie', group: 'praefix' },
  { term: 'inter- / intra-', meaning: 'zwischen / innerhalb', example: 'interkostal, intrazellulär', group: 'praefix' },
  { term: 'peri-', meaning: 'um … herum', example: 'Perikard', group: 'praefix' },
  { term: 'endo- / epi-', meaning: 'innen / auf, darüber', example: 'Endokard, Epidermis', group: 'praefix' },
  { term: 'sub- / supra-', meaning: 'unter / über', example: 'subkutan, supraspinal', group: 'praefix' },
  { term: 'a- / an-', meaning: 'nicht, ohne', example: 'Anämie, Aphasie', group: 'praefix' },
  { term: 'brady- / tachy-', meaning: 'langsam / schnell', example: 'Bradykardie, Tachykardie', group: 'praefix' },
  { term: '-itis', meaning: 'Entzündung', example: 'Appendizitis', group: 'suffix' },
  { term: '-om', meaning: 'Geschwulst, Tumor', example: 'Lipom', group: 'suffix' },
  { term: '-ose', meaning: 'nicht entzündlicher (oft degenerativer) Krankheitszustand', example: 'Arthrose', group: 'suffix' },
  { term: '-ektomie', meaning: 'operative Entfernung', example: 'Appendektomie', group: 'suffix' },
  { term: '-tomie', meaning: 'Schnitt, operatives Eröffnen', example: 'Laparotomie', group: 'suffix' },
  { term: '-skopie', meaning: 'Betrachtung, Spiegelung', example: 'Gastroskopie', group: 'suffix' },
  { term: '-algie', meaning: 'Schmerz', example: 'Neuralgie', group: 'suffix' },
  { term: '-logie', meaning: 'Lehre, Wissenschaft von', example: 'Kardiologie, Histologie', group: 'suffix' },
  { term: '-ämie', meaning: 'Zustand des Blutes', example: 'Hyperkaliämie', group: 'suffix' },
  { term: 'ren / nephros', meaning: 'Niere (lateinisch / griechisch)', example: 'renal, Nephritis', group: 'organ' },
  { term: 'cor / kardia', meaning: 'Herz', example: 'koronar, Kardiologie', group: 'organ' },
  { term: 'nervus / neuron', meaning: 'Nerv', example: 'Nervus vagus, Neurologie', group: 'organ' },
  { term: 'pulmo / pneumon', meaning: 'Lunge', example: 'pulmonal, Pneumonie', group: 'organ' },
  { term: 'hepar', meaning: 'Leber (griechisch)', example: 'hepatisch, Hepatitis', group: 'organ' },
  { term: 'ventriculus / gaster', meaning: 'Magen', example: 'Gastritis', group: 'organ' },
  { term: 'intestinum / enteron', meaning: 'Darm', example: 'intestinal, Enteritis', group: 'organ' },
  { term: 'cutis / derma', meaning: 'Haut', example: 'subkutan, Dermatitis', group: 'organ' },
  { term: 'os / osteon', meaning: 'Knochen', example: 'ossär, Osteoporose', group: 'organ' },
  { term: 'musculus / myos', meaning: 'Muskel', example: 'muskulär, Myalgie', group: 'organ' },
  { term: 'sanguis / haima', meaning: 'Blut', example: 'sanguinisch, Hämatom', group: 'organ' },
  { term: 'musculus, musculi (m.)', meaning: 'Nominativ, Genitiv Singular – o-Deklination; Plural musculi', example: 'Origo musculi bicipitis', group: 'grammatik' },
  { term: 'arteria, arteriae (f.)', meaning: 'a-Deklination; Genitiv Singular und Nominativ Plural: arteriae', example: 'Arteriae coronariae', group: 'grammatik' },
  { term: 'os, ossis (n.)', meaning: 'Knochen; Plural ossa (Neutra enden im Plural auf -a)', example: 'Ossa carpi', group: 'grammatik' },
  { term: 'caput, capitis (n.)', meaning: 'Kopf; Plural capita', example: 'Caput humeri', group: 'grammatik' },
  { term: 'Kongruenz', meaning: 'Das Adjektiv richtet sich in Geschlecht, Zahl und Fall nach dem Substantiv', example: 'musculus rectus, arteria recta, ligamentum rectum', group: 'grammatik' },
];

export const TERM_LESSONS: Lesson[] = [
  {
    id: 'lagebezeichnungen', module: 'term', title: 'Lage- und Richtungsbezeichnungen', subtitle: 'Ebenen, Achsen und Richtungen am Körper', difficulty: 'grundlagen', prerequisites: [], view: 'terms',
    objectives: [
      'die wichtigsten Lage- und Richtungsbezeichnungen korrekt verwenden',
      'die drei Hauptebenen des Körpers benennen und Schnittbilder zuordnen',
    ],
    overview: 'Anatomische Angaben beziehen sich immer auf die anatomische Normalstellung: aufrecht stehend, Blick nach vorn, Arme hängend, Handflächen nach vorn. Mit wenigen Begriffspaaren lässt sich jede Lage eindeutig beschreiben – unabhängig davon, wie der Patient gerade liegt.',
    mechanism: [
      { title: 'Normalstellung', text: 'Alle Angaben gelten für die anatomische Normalstellung, nicht für die aktuelle Lage.' },
      { title: 'Begriffspaare', text: 'anterior–posterior (ventral–dorsal), superior–inferior (cranial–caudal), medial–lateral, proximal–distal, superficialis–profundus.' },
      { title: 'Hand und Fuß', text: 'palmar (Handfläche) und dorsal (Handrücken), plantar (Fußsohle) und dorsal (Fußrücken).' },
      { title: 'Ebenen', text: 'Sagittalebene (die mittlere: Medianebene), Frontal- bzw. Koronarebene, Transversal- bzw. Horizontalebene.' },
    ],
    depth: {
      text: [
        'Im Gehirn wechselt die Bedeutung von „ventral“ und „dorsal“ wegen der Hirnachse: Oberhalb des Hirnstamms bedeutet rostral „stirnwärts“, dorsal „scheitelwärts“.',
        'Radiologische Schnittbilder (CT, MRT) werden in der Transversalebene üblicherweise von unten (caudal) betrachtet: Die rechte Körperseite erscheint links im Bild.',
      ],
      pitfalls: ['Proximal/distal nur an Gliedmaßen und Gefäß- bzw. Nervenverläufen, sonst cranial/caudal.', 'Die Handfläche zeigt in Normalstellung nach vorn – der Daumen liegt also lateral.'],
    },
    terms: [
      { term: 'Anatomische Normalstellung', def: 'Aufrechter Stand, Blick nach vorn, Arme hängend, Handflächen nach vorn.', synonyms: ['Neutral-Null-Stellung'] },
      { term: 'Medianebene', def: 'Sagittalebene, die den Körper in zwei spiegelbildliche Hälften teilt.', synonyms: ['Mediansagittalebene'] },
      { term: 'Frontalebene', def: 'Ebene parallel zur Stirn.', synonyms: ['Koronarebene'] },
    ],
    structures: [], models: [], links: ['wortbildung'], sources: [{ id: 'ta2', locator: 'Allgemeine Termini (Termini generales)' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'wortbildung', module: 'term', title: 'Wortbildung und Grammatik der Fachsprache', subtitle: 'Präfixe, Suffixe, griechische und lateinische Wurzeln, Deklination', difficulty: 'grundlagen', prerequisites: [], view: 'terms',
    objectives: [
      'häufige Präfixe und Suffixe der klinischen Fachsprache übersetzen',
      'lateinische und griechische Bezeichnungen derselben Organe zuordnen',
      'Nominativ, Genitiv und Plural anatomischer Bezeichnungen bilden und die Kongruenz von Adjektiven beachten',
    ],
    overview: 'Die anatomische Nomenklatur ist überwiegend lateinisch, klinische Krankheitsbezeichnungen sind oft griechisch. Wer die Bausteine kennt, kann unbekannte Wörter zerlegen: Peri-kard-itis ist eine Entzündung (-itis) um (peri-) das Herz (kardia) herum, also des Herzbeutels.',
    mechanism: [
      { title: 'Zerlegen', text: 'Präfix + Wurzel + Suffix: Hyp-ox-ämie = zu wenig Sauerstoff im Blut.' },
      { title: 'Doppelte Wurzeln', text: 'Viele Organe haben eine lateinische (Anatomie) und eine griechische Wurzel (Klinik): ren – renal, nephros – Nephritis.' },
      { title: 'Deklination', text: 'Der Genitiv zeigt die Zugehörigkeit: Caput humeri (Kopf des Oberarmknochens), Origo musculi (Ursprung des Muskels).' },
      { title: 'Kongruenz', text: 'Adjektive passen sich an: musculus rectus (m.), arteria recta (f.), ligamentum rectum (n.).' },
    ],
    depth: {
      text: [
        'Häufige Fehlerquelle sind Neutra: Sie enden im Plural auf -a (ossa, ligamenta, capita) und sehen dann aus wie Feminina im Singular.',
        'Die gültige anatomische Nomenklatur ist die Terminologia Anatomica (2. Auflage, 2019). In Lehrbüchern und Kliniken sind ältere oder eingedeutschte Schreibweisen (z. B. „Zäkum“ statt „Caecum“) verbreitet.',
      ],
      pitfalls: ['-itis ist eine Entzündung, -ose meist ein nicht entzündlicher Zustand.', '-ektomie entfernt, -tomie schneidet nur.'],
    },
    terms: [
      { term: 'Präfix', def: 'Vorsilbe, z. B. hyper-, peri-.' },
      { term: 'Suffix', def: 'Nachsilbe, z. B. -itis, -ektomie.' },
      { term: 'Genitiv', def: 'Zweiter Fall; zeigt im Fachbegriff die Zugehörigkeit an.' },
    ],
    structures: [], models: [], links: ['lagebezeichnungen'], sources: [{ id: 'ta2', locator: 'Allgemeine Termini; Schreibweisen' }], status: S, origin: 'redaktionell',
  },
];
