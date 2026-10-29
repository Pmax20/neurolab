import type { Lesson } from './types';

// Lektionen für das 1. Studienjahr (Chemie und Physik für Mediziner).
// Ausgerichtet auf den vorklinischen Studienplan (Chemie: Allgemeine/Anorganische Chemie im 1.,
// Organische und Naturstoffchemie im 2. Semester; Physik/Biophysik im 1. und 2. Semester).

const S = 'zu_pruefen' as const;
const Z = (locator: string) => ({ id: 'zeeck', locator });
const H = (locator: string) => ({ id: 'harten', locator });

export const CHEM_LESSONS: Lesson[] = [
  {
    id: 'konzentrationen', module: 'molecule', title: 'Stoffmenge, Konzentration und Osmolarität', subtitle: 'Rechnen mit mol, mmol/l, mval und mosmol', difficulty: 'grundlagen', prerequisites: ['atommodell'], view: 'sim', models: ['konzentration'],
    objectives: [
      'Stoffmenge, molare Masse und Stoffmengenkonzentration ineinander umrechnen',
      'die Osmolarität einer Lösung aus Konzentration und Teilchenzahl bestimmen',
      'Äquivalentkonzentration (mval/l) mehrwertiger Ionen berechnen',
      'zwischen Osmolarität und Tonizität unterscheiden',
    ],
    overview: 'Fast jede Laborangabe und jede Infusion ist eine Konzentrationsangabe. Wer sicher zwischen Gramm, Mol, Millimol pro Liter und Milliosmol umrechnen kann, versteht Elektrolytwerte, Infusionslösungen und später die Osmose in Zellen und Niere.',
    mechanism: [
      { title: 'Masse → Stoffmenge', text: 'n = m / M: 9 g NaCl (M ≈ 58,44 g/mol) sind 0,154 mol = 154 mmol.' },
      { title: 'Stoffmenge → Konzentration', text: 'c = n / V: 154 mmol in 1 l Lösung ergeben 154 mmol/l. Bezugsgröße ist das Volumen der fertigen Lösung, nicht des Lösungsmittels.' },
      { title: 'Teilchen zählen', text: 'Salze dissoziieren: NaCl → Na⁺ + Cl⁻ (2 Teilchen), CaCl₂ → Ca²⁺ + 2 Cl⁻ (3 Teilchen). Glukose dissoziiert nicht (1 Teilchen).' },
      { title: 'Osmolarität', text: 'Osmolarität ≈ c · Teilchenzahl. 0,9 % NaCl: 154 mmol/l · 2 ≈ 308 mosmol/l (ideal). Real ist sie wegen Wechselwirkungen der Ionen etwas niedriger (osmotischer Koeffizient ≈ 0,93 → ≈ 286 mosmol/l).' },
      { title: 'Ladungsäquivalente', text: 'mval/l = mmol/l · Ladungszahl: 1 mmol Ca²⁺ entspricht 2 mval.' },
    ],
    depth: {
      text: [
        'Osmolarität bezieht sich auf einen Liter Lösung, Osmolalität auf ein Kilogramm Wasser. Bei verdünnten Lösungen wie Plasma sind beide fast gleich; im Labor wird meist die Osmolalität gemessen (Referenzbereich etwa 280–296 mosmol/kg).',
        'Prozentangaben bei Infusionen sind in der Regel Masse pro Volumen: 0,9 % NaCl bedeutet 0,9 g pro 100 ml = 9 g/l.',
        'Für die Wirkung auf Zellen zählt die Tonizität: nur Teilchen, die die Membran nicht passieren können, erzeugen dauerhaft einen Wasserstrom. Harnstoff erhöht die Osmolarität, ist aber kaum tonisch wirksam; Glukose-5-%-Lösung ist isoosmolar, wirkt nach Aufnahme der Glukose in die Zellen aber wie freies Wasser.',
      ],
      equations: ['n = m / M', 'c = n / V', 'Osmolarität ≈ c · i · φ', 'Äquivalentkonzentration = c · z'],
      pitfalls: ['„0,9 %“ ist nicht 0,9 mol/l, sondern 9 g/l ≈ 154 mmol/l.', 'Volumen der Lösung ≠ Volumen des zugegebenen Wassers.', 'Isoosmolar heißt nicht automatisch isoton.'],
    },
    terms: [
      { term: 'Stoffmenge', def: 'Anzahl der Teilchen in mol (1 mol ≈ 6,022 · 10²³ Teilchen).', synonyms: ['mol'] },
      { term: 'Molare Masse', def: 'Masse von 1 mol eines Stoffes in g/mol.' },
      { term: 'Osmolarität', def: 'Konzentration osmotisch wirksamer Teilchen pro Liter Lösung (osmol/l).', synonyms: ['Osmolalität'] },
      { term: 'Äquivalent', def: 'Stoffmenge multipliziert mit der Ladungszahl (val bzw. mval).', synonyms: ['mval', 'Val'] },
      { term: 'Tonizität', def: 'Osmotische Wirkung einer Lösung auf eine Zelle; hängt von nicht membrangängigen Teilchen ab.', synonyms: ['isoton', 'hyperton', 'hypoton'] },
    ],
    structures: [], links: ['osmose', 'saeure-base'], sources: [Z('Kap. „Erscheinungsformen der Materie“ und „Salzlösungen“'), { id: 'boron', locator: 'Kap. „Body fluid compartments“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'gleichgewicht', module: 'molecule', title: 'Chemisches Gleichgewicht, Kinetik und Energetik', subtitle: 'Massenwirkungsgesetz, Reaktionsgeschwindigkeit, ΔG', difficulty: 'vertiefung', prerequisites: ['konzentrationen'], view: 'sim', models: ['gleichgewicht'],
    objectives: [
      'das Massenwirkungsgesetz aufstellen und die Gleichgewichtskonstante deuten',
      'erklären, dass im Gleichgewicht Hin- und Rückreaktion gleich schnell ablaufen (dynamisches Gleichgewicht)',
      'den Einfluss eines Katalysators auf Geschwindigkeit und Gleichgewichtslage unterscheiden',
      'den Zusammenhang zwischen ΔG, K und der Richtung einer Reaktion beschreiben',
    ],
    overview: 'Reaktionen laufen selten vollständig ab. Sie streben ein Gleichgewicht an, in dem sich die Konzentrationen nicht mehr ändern, obwohl weiterhin Moleküle umgesetzt werden. Wie schnell das Gleichgewicht erreicht wird (Kinetik) und wo es liegt (Thermodynamik), sind zwei verschiedene Fragen.',
    mechanism: [
      { title: 'Hin und zurück', text: 'Für A ⇌ B gilt v_hin = k₁·[A] und v_rück = k₂·[B]. Zu Beginn überwiegt die Hinreaktion.' },
      { title: 'Annäherung', text: 'Mit sinkendem [A] und steigendem [B] gleichen sich beide Geschwindigkeiten an.' },
      { title: 'Gleichgewicht', text: 'Bei v_hin = v_rück ändern sich die Konzentrationen nicht mehr. Es gilt K = [B]/[A] = k₁/k₂ (Massenwirkungsgesetz).' },
      { title: 'Katalysator', text: 'Ein Katalysator (z. B. ein Enzym) senkt die Aktivierungsenergie für Hin- und Rückreaktion gleichermaßen: Das Gleichgewicht wird schneller erreicht, seine Lage bleibt gleich.' },
      { title: 'Energetik', text: 'ΔG°’ = −R·T·ln K. Ist K > 1, ist ΔG°’ negativ. Die tatsächliche Richtung bestimmt ΔG = ΔG°’ + R·T·ln Q mit den aktuellen Konzentrationen.' },
    ],
    depth: {
      text: [
        'Das Prinzip von Le Chatelier beschreibt, wie ein Gleichgewicht auf Störungen ausweicht: Entfernt man ein Produkt, läuft die Reaktion weiter in Produktrichtung. Im Stoffwechsel werden so auch Reaktionen mit leicht positivem ΔG°’ angetrieben, weil das Produkt sofort weiterverbraucht wird.',
        'Die Temperaturabhängigkeit der Geschwindigkeit beschreibt die Arrhenius-Gleichung; als Faustregel verdoppelt bis verdreifacht sich die Geschwindigkeit vieler Reaktionen pro 10 °C (RGT-Regel).',
        'Exergon (ΔG < 0) bedeutet „kann freiwillig ablaufen“, nicht „läuft schnell ab“. Viele exergone Reaktionen sind ohne Katalysator extrem langsam.',
      ],
      equations: ['K = [B] / [A] = k₁ / k₂', 'ΔG°’ = −R·T·ln K', 'ΔG = ΔG°’ + R·T·ln([B]/[A])', 'τ = 1 / (k₁ + k₂)'],
      pitfalls: ['Im Gleichgewicht sind die Konzentrationen nicht gleich, sondern konstant.', 'Ein Katalysator verschiebt das Gleichgewicht nicht.', 'Negatives ΔG sagt nichts über die Geschwindigkeit aus.'],
    },
    terms: [
      { term: 'Massenwirkungsgesetz', def: 'Im Gleichgewicht ist das Verhältnis der Produkt- zu den Eduktkonzentrationen (mit Stöchiometrie als Exponenten) konstant.', synonyms: ['MWG'] },
      { term: 'Gleichgewichtskonstante', def: 'K; Maß für die Lage des Gleichgewichts.' },
      { term: 'Aktivierungsenergie', def: 'Energiebarriere, die Moleküle für die Reaktion überwinden müssen.' },
      { term: 'Freie Enthalpie', def: 'ΔG; bestimmt, ob eine Reaktion freiwillig ablaufen kann (exergon < 0, endergon > 0).', synonyms: ['Gibbs-Energie', 'exergon', 'endergon'] },
      { term: 'Prinzip von Le Chatelier', def: 'Ein Gleichgewicht weicht einem äußeren Zwang so aus, dass dieser verringert wird.', synonyms: ['Le Chatelier'] },
    ],
    structures: [], links: ['enzyme', 'redox', 'saeure-base'], sources: [Z('Kap. „Chemische Reaktionen“ (Gleichgewicht, Kinetik, Energetik)'), { id: 'atkins', locator: 'Kap. „Chemical equilibrium“ und „Chemical kinetics“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'redox', module: 'molecule', title: 'Oxidation, Reduktion und Redoxpotenzial', subtitle: 'Elektronenübertragung – von der Oxidationszahl bis zur Atmungskette', difficulty: 'vertiefung', prerequisites: ['bindungen'], view: 'sim', models: ['redox'],
    objectives: [
      'Oxidationszahlen bestimmen und Oxidation und Reduktion erkennen',
      'aus Standardredoxpotenzialen die Richtung einer Elektronenübertragung ableiten',
      'mit ΔG = −z·F·ΔE die freie Enthalpie einer Redoxreaktion abschätzen',
    ],
    overview: 'Bei einer Redoxreaktion wandern Elektronen von einem Donor (er wird oxidiert) zu einem Akzeptor (er wird reduziert). Die Atmungskette ist eine Kaskade solcher Übertragungen: Elektronen fließen von NADH mit sehr negativem Potenzial schrittweise zu Sauerstoff mit stark positivem Potenzial.',
    mechanism: [
      { title: 'Oxidationszahlen', text: 'Formale Ladung eines Atoms, wenn alle Bindungen ionisch wären. Steigt sie, wurde das Atom oxidiert; sinkt sie, wurde es reduziert.' },
      { title: 'Redoxpaare', text: 'Jedes Paar aus oxidierter und reduzierter Form (z. B. NAD⁺/NADH) hat ein Standardpotenzial E°’ (biochemisch: pH 7).' },
      { title: 'Richtung', text: 'Elektronen fließen freiwillig vom Paar mit dem negativeren zum Paar mit dem positiveren Potenzial.' },
      { title: 'Energie', text: 'ΔG°’ = −z·F·ΔE°’. NADH → O₂: ΔE ≈ 0,82 − (−0,32) = 1,14 V, für 2 Elektronen ΔG ≈ −220 kJ/mol.' },
      { title: 'Konzentrationen', text: 'Das tatsächliche Potenzial hängt vom Verhältnis [ox]/[red] ab (Nernst-Gleichung): pro Zehnerpotenz bei 37 °C ≈ 61,5 mV / z.' },
    ],
    depth: {
      text: [
        'Merkhilfe: Oxidation ist Elektronenabgabe, Reduktion ist Elektronenaufnahme. Das Oxidationsmittel wird selbst reduziert, das Reduktionsmittel selbst oxidiert.',
        'Die Nernst-Gleichung für Redoxpaare hat dieselbe Form wie für das Membranpotenzial: Ein zehnfaches Konzentrationsverhältnis verschiebt das Potenzial um ≈ 61,5 mV / z (37 °C). Das verbindet diese Lektion mit dem Ruhemembranpotenzial.',
        'In der Medizin begegnen Redoxreaktionen u. a. als Desinfektion (Wasserstoffperoxid, Iod), bei Methämoglobin (Fe³⁺ statt Fe²⁺ im Häm) und bei Antioxidanzien (Vitamin C, Glutathion).',
      ],
      equations: ['ΔE°’ = E°’(Akzeptor) − E°’(Donor)', 'ΔG°’ = −z · F · ΔE°’  (F ≈ 96 485 C/mol)', 'E = E°’ + (R·T)/(z·F) · ln([ox]/[red])'],
      pitfalls: ['Der Donor ist das Reduktionsmittel – er wird oxidiert.', 'Ein positives ΔE bedeutet negatives ΔG (freiwillig).', 'E°’ gilt bei pH 7 und 1 mol/l aller Partner; reale Zellen weichen ab.'],
    },
    terms: [
      { term: 'Oxidation', def: 'Abgabe von Elektronen; die Oxidationszahl steigt.' },
      { term: 'Reduktion', def: 'Aufnahme von Elektronen; die Oxidationszahl sinkt.' },
      { term: 'Oxidationszahl', def: 'Formale Ladung eines Atoms in einer Verbindung.', synonyms: ['Oxidationsstufe'] },
      { term: 'Redoxpotenzial', def: 'Maß für die Neigung eines Redoxpaars, Elektronen aufzunehmen (positiver = stärkeres Oxidationsmittel).', synonyms: ['Standardpotenzial', 'E°'] },
    ],
    structures: [], links: ['energiegewinnung', 'gleichgewicht', 'ruhemembranpotenzial'], sources: [Z('Kap. „Oxidation und Reduktion“'), { id: 'stryer', locator: 'Kap. „Oxidative phosphorylation“ (Standardpotenziale)' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'organik', module: 'molecule', title: 'Organische Chemie: funktionelle Gruppen und Isomerie', subtitle: 'Alkohole, Carbonyle, Carbonsäuren, Amine – und warum gleiche Formeln verschiedene Stoffe sein können', difficulty: 'grundlagen', prerequisites: ['bindungen'], view: 'molecules',
    objectives: [
      'die wichtigsten funktionellen Gruppen erkennen und benennen',
      'Konstitutionsisomere, cis/trans-Isomere und Enantiomere unterscheiden',
      'ein Stereozentrum erkennen und erklären, warum Enantiomere biologisch verschieden wirken können',
    ],
    overview: 'Die Eigenschaften organischer Moleküle werden vor allem von ihren funktionellen Gruppen bestimmt. Moleküle mit derselben Summenformel können sich in der Verknüpfung der Atome (Konstitution) oder nur in der räumlichen Anordnung (Konfiguration) unterscheiden – mit großen Folgen für ihre Wirkung im Körper.',
    mechanism: [
      { title: 'Funktionelle Gruppen', text: 'Hydroxy- (–OH, Alkohole), Carbonyl- (C=O; Aldehyde, Ketone), Carboxy- (–COOH, Carbonsäuren), Amino- (–NH₂, Amine), Ester, Amide, Thiole (–SH), Phosphatester.' },
      { title: 'Konstitutionsisomere', text: 'Gleiche Summenformel, andere Verknüpfung: Ethanol und Dimethylether (beide C₂H₆O), Glukose und Fruktose (beide C₆H₁₂O₆).' },
      { title: 'cis/trans-Isomere', text: 'An einer C=C-Doppelbindung ist keine freie Drehung möglich. Ölsäure (cis) hat einen Knick, Elaidinsäure (trans) ist gestreckt.' },
      { title: 'Enantiomere', text: 'Ein C-Atom mit vier verschiedenen Substituenten ist ein Stereozentrum. Die beiden Formen verhalten sich wie Bild und Spiegelbild (R/S bzw. D/L).' },
      { title: 'Biologische Folge', text: 'Enzyme und Rezeptoren sind selbst chiral und unterscheiden Enantiomere: Proteine enthalten L-Aminosäuren, der Stoffwechsel nutzt D-Glukose; L-Laktat ist das physiologische Laktat.' },
    ],
    depth: {
      text: [
        'Polare funktionelle Gruppen (–OH, –COOH, –NH₂) erhöhen die Wasserlöslichkeit und ermöglichen Wasserstoffbrücken. Darum ist Ethanol bei Raumtemperatur flüssig, der gleich schwere Dimethylether dagegen ein Gas.',
        'Die D/L-Nomenklatur (Fischer-Projektion) ist bei Zuckern und Aminosäuren üblich; die R/S-Nomenklatur (CIP-Regeln) ist allgemein anwendbar. Beide beschreiben dieselbe räumliche Tatsache mit unterschiedlichen Regeln – D entspricht nicht automatisch R.',
        'Racemate sind 1:1-Gemische beider Enantiomere. Bei Arzneistoffen kann ein Enantiomer wirksam, das andere unwirksam oder unerwünscht wirksam sein.',
      ],
      pitfalls: ['Gleiche Summenformel heißt nicht gleicher Stoff.', 'Enantiomere haben fast identische physikalische Eigenschaften – sie unterscheiden sich in der Wechselwirkung mit anderen chiralen Molekülen und polarisiertem Licht.', 'Glycin hat kein Stereozentrum (zwei H am α-C).'],
    },
    terms: [
      { term: 'Funktionelle Gruppe', def: 'Atomgruppe, die die chemischen Eigenschaften eines Moleküls bestimmt.' },
      { term: 'Isomere', def: 'Verbindungen mit gleicher Summenformel, aber verschiedener Struktur.', synonyms: ['Isomerie'] },
      { term: 'Chiralität', def: 'Eigenschaft eines Moleküls, mit seinem Spiegelbild nicht deckungsgleich zu sein.', synonyms: ['chiral', 'Stereozentrum'] },
      { term: 'Enantiomer', def: 'Eines von zwei spiegelbildlichen Stereoisomeren.', synonyms: ['Spiegelbildisomer'] },
      { term: 'Racemat', def: '1:1-Gemisch zweier Enantiomere.' },
    ],
    structures: [], models: [], links: ['molekuele', 'naturstoffe'], sources: [Z('Kap. „Grundlagen der organischen Chemie“ und „Stereochemie“'), { id: 'iupac', locator: 'Gold Book: „chirality“, „enantiomer“, „constitutional isomer“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'naturstoffe', module: 'molecule', title: 'Naturstoffe: Kohlenhydrate, Lipide und Aminosäuren', subtitle: 'Bausteine des Körpers aus chemischer Sicht', difficulty: 'vertiefung', prerequisites: ['organik'], view: 'molecules',
    objectives: [
      'Aldosen und Ketosen sowie die Ringbildung von Zuckern (Halbacetal, α/β-Anomere) beschreiben',
      'Aufbau von Triacylglycerinen, Phospholipiden und Cholesterin vergleichen',
      'den amphoteren Charakter von Aminosäuren und die Peptidbindung erklären',
    ],
    overview: 'Kohlenhydrate, Lipide und Proteine sind aus wenigen Bausteinen aufgebaut. Ihre chemischen Eigenschaften – Ringbildung von Zuckern, Wasserunlöslichkeit von Fetten, Ladung von Aminosäuren – erklären später Verdauung, Membranaufbau und Proteinfaltung.',
    mechanism: [
      { title: 'Zucker', text: 'Monosaccharide tragen eine Carbonylgruppe: Aldosen (z. B. Glukose) eine Aldehyd-, Ketosen (z. B. Fruktose) eine Ketogruppe. In Wasser bilden sie überwiegend Ringe (Halbacetal); dabei entsteht ein neues Stereozentrum (α- oder β-Anomer).' },
      { title: 'Glykosidbindung', text: 'Zwei Monosaccharide verbinden sich unter Wasserabspaltung (Kondensation). α-1,4-Bindungen (Stärke, Glykogen) kann der Mensch spalten, β-1,4-Bindungen (Cellulose) nicht.' },
      { title: 'Lipide', text: 'Triacylglycerine: Glycerin mit drei Fettsäuren verestert (Energiespeicher). Phospholipide: zwei Fettsäuren und eine polare Phosphat-Kopfgruppe (amphiphil, Membranbaustein). Cholesterin: Steroidgerüst, Membranbestandteil und Vorstufe von Hormonen.' },
      { title: 'Aminosäuren', text: 'Amino- und Carboxygruppe am selben C-Atom. Bei pH 7 liegen sie als Zwitterion vor (–NH₃⁺ und –COO⁻); am isoelektrischen Punkt ist die Nettoladung null.' },
      { title: 'Peptidbindung', text: 'Kondensation von Carboxy- und Aminogruppe zur Amidbindung. Sie ist planar (partieller Doppelbindungscharakter) – das prägt die Proteinstruktur.' },
    ],
    depth: {
      text: [
        'α- und β-Glukose wandeln sich in Lösung über die offene Kettenform ineinander um (Mutarotation). Im Gleichgewicht überwiegt die β-Form (etwa 64 %).',
        'Ungesättigte Fettsäuren mit cis-Doppelbindungen haben einen Knick, packen schlechter und senken den Schmelzpunkt – deshalb sind Öle flüssig. trans-Fettsäuren verhalten sich eher wie gesättigte.',
        'Die Seitenketten der 20 proteinogenen Aminosäuren unterscheiden sich in Polarität und Ladung; saure (Asp, Glu) und basische (Lys, Arg, His) Seitenketten bestimmen die Ladung eines Proteins bei gegebenem pH.',
      ],
      pitfalls: ['Fette sind Ester, keine Säuren – erst nach Hydrolyse liegen freie Fettsäuren vor.', 'Das Zwitterion ist nach außen neutral, aber trotzdem geladen.', 'D-Glukose bezieht sich auf die Konfiguration am C5, nicht auf die Drehrichtung des Lichts.'],
    },
    terms: [
      { term: 'Monosaccharid', def: 'Einfachzucker, z. B. Glukose, Fruktose, Galaktose, Ribose.', synonyms: ['Einfachzucker', 'Aldose', 'Ketose'] },
      { term: 'Anomere', def: 'Ringformen eines Zuckers, die sich nur am neu entstandenen Stereozentrum (C1 bei Aldosen) unterscheiden.', synonyms: ['α-Glukose', 'β-Glukose'] },
      { term: 'Triacylglycerin', def: 'Ester aus Glycerin und drei Fettsäuren.', synonyms: ['Triglycerid', 'Neutralfett'] },
      { term: 'Zwitterion', def: 'Molekül mit positiver und negativer Ladung, nach außen neutral.' },
      { term: 'Peptidbindung', def: 'Amidbindung zwischen zwei Aminosäuren.' },
    ],
    structures: [], models: [], links: ['molekuele', 'proteinbiosynthese', 'membran'], sources: [Z('Kap. „Kohlenhydrate“, „Lipide“ und „Aminosäuren, Peptide und Proteine“'), { id: 'stryer', locator: 'Kap. „Carbohydrates“ und „Lipids and cell membranes“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'komplexe', module: 'molecule', title: 'Komplexverbindungen', subtitle: 'Zentralatom, Liganden, Chelate – Hämoglobin und EDTA', difficulty: 'vertiefung', prerequisites: ['bindungen'],
    objectives: [
      'Zentralatom, Liganden und Koordinationszahl eines Komplexes benennen',
      'den Chelateffekt erklären und medizinische Anwendungen von Chelatbildnern nennen',
      'die Bindung von O₂ an das Fe²⁺ im Häm als Komplexbildung beschreiben',
    ],
    overview: 'In Komplexen bindet ein zentrales Metallion mehrere Liganden über freie Elektronenpaare (koordinative Bindung). Viele lebenswichtige Moleküle sind Komplexe – Hämoglobin, Cytochrome, Vitamin B₁₂ – und Chelatbildner wie EDTA werden im Labor und in der Therapie eingesetzt.',
    mechanism: [
      { title: 'Koordinative Bindung', text: 'Der Ligand stellt beide Bindungselektronen (freies Elektronenpaar), das Metallion ist Elektronenpaar-Akzeptor (Lewis-Säure).' },
      { title: 'Koordinationszahl', text: 'Anzahl der gebundenen Ligand-Atome. Häufig 4 (tetraedrisch oder quadratisch-planar) oder 6 (oktaedrisch).' },
      { title: 'Chelate', text: 'Mehrzähnige Liganden binden über mehrere Atome gleichzeitig („Krebsschere“). EDTA ist sechszähnig.' },
      { title: 'Chelateffekt', text: 'Chelatkomplexe sind deutlich stabiler als Komplexe mit vergleichbaren einzähnigen Liganden – vor allem, weil bei der Bildung mehr freie Teilchen entstehen (Entropiegewinn).' },
      { title: 'Häm', text: 'Fe²⁺ ist im Häm von vier Stickstoffatomen des Porphyrinrings und einem Histidin des Globins koordiniert; die sechste Stelle bindet O₂ reversibel. CO bindet dort viel fester.' },
    ],
    depth: {
      text: [
        'EDTA bindet Ca²⁺ so fest, dass Blut im EDTA-Röhrchen nicht gerinnt (die Gerinnung braucht Ca²⁺). Für Blutbilder ist EDTA-Blut Standard; für Gerinnungstests verwendet man dagegen Citrat, das ebenfalls Ca²⁺ komplexiert, aber durch Ca²⁺-Zugabe wieder aufgehoben werden kann.',
        'Chelatbildner werden bei Schwermetallvergiftungen eingesetzt (z. B. bei Blei); Deferoxamin bindet Eisen bei Eisenüberladung.',
        'Wird Fe²⁺ im Hämoglobin zu Fe³⁺ oxidiert (Methämoglobin), kann kein O₂ mehr gebunden werden.',
      ],
      pitfalls: ['Die Koordinationszahl zählt Bindungsstellen, nicht Liganden-Moleküle.', 'O₂ bindet an Fe²⁺, nicht an Fe³⁺.'],
    },
    terms: [
      { term: 'Komplex', def: 'Verbindung aus Zentralatom (meist Metallion) und daran koordinierten Liganden.', synonyms: ['Koordinationsverbindung'] },
      { term: 'Ligand', def: 'Molekül oder Ion mit freiem Elektronenpaar, das an ein Zentralatom bindet.', synonyms: ['zähnig'] },
      { term: 'Koordinationszahl', def: 'Zahl der direkt an das Zentralatom gebundenen Atome.' },
      { term: 'Chelat', def: 'Komplex mit einem mehrzähnigen Liganden.', synonyms: ['Chelatkomplex', 'EDTA'] },
    ],
    structures: [], models: [], links: ['atmung', 'bindungen', 'molekuele'], sources: [Z('Kap. „Komplexverbindungen“'), { id: 'stryer', locator: 'Kap. „Hemoglobin and myoglobin“' }], status: S, origin: 'redaktionell',
  },
];

export const PHYS_LESSONS: Lesson[] = [
  {
    id: 'mechanik', module: 'physics', title: 'Kräfte, Hebel und Drehmoment', subtitle: 'Warum der Bizeps ein Vielfaches der Last tragen muss', difficulty: 'grundlagen', prerequisites: [], view: 'sim', models: ['hebel'],
    objectives: [
      'Kraft, Gewichtskraft und Drehmoment mit Einheiten angeben',
      'das Hebelgesetz auf den Unterarm anwenden und die Muskelkraft berechnen',
      'erklären, warum das Gelenk eine größere Kraft aufnehmen muss als die Last',
    ],
    overview: 'Muskeln setzen meist sehr nah am Gelenk an und wirken damit an einem kurzen Hebelarm. Das macht Bewegungen schnell und weit, kostet aber Kraft: Um 5 kg in der Hand zu halten, muss der Bizeps eine Kraft von fast 500 N aufbringen.',
    mechanism: [
      { title: 'Kraft', text: 'F = m · a, Einheit Newton (N). Die Gewichtskraft einer Masse ist F_G = m · g mit g ≈ 9,81 m/s².' },
      { title: 'Drehmoment', text: 'M = F · r (Kraft mal senkrechtem Abstand zur Drehachse), Einheit N·m.' },
      { title: 'Gleichgewicht', text: 'Ruht der Unterarm, heben sich die Drehmomente auf: F_Muskel · d = F_Last · L (+ Eigengewicht des Unterarms).' },
      { title: 'Hebelverhältnis', text: 'Bei L = 35 cm und d = 4 cm ist L/d ≈ 9: Der Muskel muss etwa das Neunfache der Lastkraft aufbringen.' },
      { title: 'Gelenkkraft', text: 'Damit auch die Kräfte im Gleichgewicht sind, drückt der Oberarmknochen mit der Differenz aus Muskelkraft und Gewichtskräften auf das Gelenk.' },
    ],
    depth: {
      text: [
        'Der Unterarm ist ein einarmiger Hebel dritter Art: Drehachse (Ellenbogen), dann Kraftansatz (Bizeps), dann Last. Der Vorteil ist die Übersetzung ins Schnelle: Eine kleine Verkürzung des Muskels bewegt die Hand über eine große Strecke.',
        'Im Modell wirkt die Muskelkraft senkrecht zum Unterarm. In Wirklichkeit ändert sich der Zugwinkel mit dem Gelenkwinkel, und mehrere Muskeln (Bizeps, Brachialis, Brachioradialis) teilen sich die Arbeit.',
      ],
      equations: ['F_G = m · g', 'M = F · r', 'F_Muskel = (F_Last · L + F_Arm · L_Arm) / d'],
      pitfalls: ['Masse (kg) und Gewichtskraft (N) nicht verwechseln.', 'Drehmoment braucht den senkrechten Abstand zur Achse.'],
    },
    terms: [
      { term: 'Newton', def: 'Einheit der Kraft: 1 N = 1 kg·m/s².', synonyms: ['N'] },
      { term: 'Drehmoment', def: 'Produkt aus Kraft und Hebelarm; Einheit N·m.' },
      { term: 'Hebelgesetz', def: 'Im Gleichgewicht sind die Drehmomente auf beiden Seiten gleich: Kraft · Kraftarm = Last · Lastarm.' },
    ],
    structures: [], links: ['muskelphysiologie'], sources: [H('Kap. „Mechanik starrer Körper“ (Hebel, Drehmoment)')], status: S, origin: 'redaktionell',
  },
  {
    id: 'stroemung', module: 'physics', title: 'Strömung, Druck und Widerstand', subtitle: 'Hagen-Poiseuille, Kontinuität und Reynolds-Zahl', difficulty: 'grundlagen', prerequisites: [], view: 'sim', models: ['stroemung'],
    objectives: [
      'Druck, Volumenstrom und Strömungswiderstand mit Einheiten definieren',
      'mit dem Gesetz von Hagen-Poiseuille die Wirkung des Radius auf den Volumenstrom vorhersagen',
      'laminare und turbulente Strömung mit der Reynolds-Zahl unterscheiden',
      'die Kontinuitätsgleichung anwenden',
    ],
    overview: 'Blut fließt, weil zwischen zwei Orten ein Druckunterschied besteht. Wie viel fließt, bestimmt der Strömungswiderstand – und der hängt extrem stark vom Gefäßradius ab: Halbiert sich der Radius, fließt bei gleichem Druck nur noch ein Sechzehntel.',
    mechanism: [
      { title: 'Druck', text: 'p = F / A, SI-Einheit Pascal (Pa). In der Medizin üblich: mmHg (1 mmHg ≈ 133 Pa) und cmH₂O (≈ 98 Pa).' },
      { title: '„Ohmsches Gesetz“', text: 'Volumenstrom Q = ΔP / R – analog zu I = U / R in der Elektrizitätslehre.' },
      { title: 'Hagen-Poiseuille', text: 'Für laminare Strömung im starren Rohr gilt R = 8 · η · l / (π · r⁴). Der Radius geht in der vierten Potenz ein.' },
      { title: 'Kontinuität', text: 'Was in ein Rohr hineinfließt, muss herauskommen: Q = A · v ist überall gleich. In einer Engstelle steigt die Geschwindigkeit.' },
      { title: 'Turbulenz', text: 'Die Reynolds-Zahl Re = ρ · v · d / η gibt an, wann eine Strömung verwirbelt (grob ab Re ≈ 2000). Turbulenz erhöht den Widerstand und erzeugt Geräusche (z. B. Strömungsgeräusche bei Stenosen).' },
    ],
    depth: {
      text: [
        'Blut ist keine ideale (newtonsche) Flüssigkeit: Seine Viskosität hängt vom Hämatokrit und in kleinen Gefäßen vom Gefäßdurchmesser ab (Fåhræus-Lindqvist-Effekt). Hagen-Poiseuille ist daher eine gute Näherung für das Prinzip, nicht für exakte Werte.',
        'Parallel geschaltete Widerstände ergeben einen kleineren Gesamtwiderstand (1/R = 1/R₁ + 1/R₂), in Reihe geschaltete addieren sich. Das erklärt, warum die unzähligen parallel geschalteten Kapillaren insgesamt einen geringeren Widerstand haben als die Arteriolen.',
        'Bernoulli: In einer Engstelle steigt die Geschwindigkeit, der statische Druck sinkt.',
      ],
      equations: ['Q = ΔP / R', 'R = 8 · η · l / (π · r⁴)', 'Q = A · v (Kontinuität)', 'Re = ρ · v · d / η'],
      pitfalls: ['Halber Radius → 16-facher Widerstand, nicht doppelter.', 'Höhere Geschwindigkeit in der Engstelle bedeutet nicht mehr Volumenstrom.'],
    },
    terms: [
      { term: 'Volumenstrom', def: 'Pro Zeit durch einen Querschnitt fließendes Volumen (ml/s, l/min).', synonyms: ['Stromstärke', 'Fluss'] },
      { term: 'Viskosität', def: 'Zähigkeit einer Flüssigkeit; Einheit Pa·s.', synonyms: ['Zähigkeit'] },
      { term: 'Hagen-Poiseuille-Gesetz', def: 'Volumenstrom laminarer Strömung im Rohr ist proportional zu r⁴ und ΔP.', synonyms: ['Poiseuille'] },
      { term: 'Reynolds-Zahl', def: 'Dimensionslose Kennzahl für den Übergang von laminarer zu turbulenter Strömung.', synonyms: ['turbulent', 'laminar'] },
    ],
    structures: [], links: ['kreislauf', 'atmung'], sources: [H('Kap. „Mechanik der Flüssigkeiten und Gase“ (Strömung)'), { id: 'guyton', locator: 'Kap. „Biophysics of pressure, flow, and resistance“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'diffusion', module: 'physics', title: 'Diffusion', subtitle: 'Fick’sches Gesetz und warum Diffusion nur auf kurzen Strecken funktioniert', difficulty: 'grundlagen', prerequisites: [], view: 'sim', models: ['diffusion'],
    objectives: [
      'Diffusion als ungerichtete Teilchenbewegung mit gerichtetem Nettofluss erklären',
      'das 1. Fick’sche Gesetz mit seinen Einflussgrößen anwenden',
      'abschätzen, wie die Diffusionszeit mit der Strecke wächst (t ∝ x²)',
    ],
    overview: 'Teilchen bewegen sich durch Wärmebewegung zufällig. Gibt es einen Konzentrationsunterschied, wandern netto mehr Teilchen vom Ort hoher zum Ort niedriger Konzentration. Auf Zellebene ist das schnell – über Zentimeter dauert es Stunden bis Tage. Deshalb braucht der Körper einen Kreislauf.',
    mechanism: [
      { title: 'Zufallsbewegung', text: 'Jedes Teilchen bewegt sich ungerichtet (Brown’sche Molekularbewegung).' },
      { title: 'Nettofluss', text: 'Wo mehr Teilchen sind, springen auch mehr in die Gegenrichtung – netto entsteht ein Fluss entlang des Gradienten.' },
      { title: 'Fick’sches Gesetz', text: 'J = −D · A · Δc / Δx: Der Fluss steigt mit Diffusionskoeffizient, Fläche und Konzentrationsunterschied und sinkt mit der Strecke.' },
      { title: 'Zeit und Strecke', text: 'Die mittlere Zeit wächst mit dem Quadrat der Strecke (t ≈ x² / 2D). Zehnfache Strecke heißt hundertfache Zeit.' },
      { title: 'Folge im Körper', text: 'Kein Gewebe liegt weiter als etwa 0,1 mm von einer Kapillare entfernt; die Blut-Luft-Schranke der Lunge ist weniger als 1 µm dünn.' },
    ],
    depth: {
      text: [
        'Der Diffusionskoeffizient D hängt von Teilchengröße, Temperatur und Medium ab (Stokes-Einstein). Große Proteine diffundieren viel langsamer als O₂.',
        'In der Lunge sind Fläche (etwa 50–100 m²) und Dicke der Membran entscheidend; Verdickung (Lungenfibrose) oder Flächenverlust (Emphysem) verringern den Gasaustausch.',
        'Osmose ist ein Spezialfall: Wasser diffundiert durch eine Membran, die für den gelösten Stoff undurchlässig ist.',
      ],
      equations: ['J = −D · A · (Δc / Δx)', 't ≈ x² / (2 · D)  (eindimensional)'],
      pitfalls: ['Diffusion braucht keine Energie der Zelle, aber einen Gradienten.', 'Doppelte Strecke → vierfache Zeit, nicht doppelte.'],
    },
    terms: [
      { term: 'Diffusion', def: 'Netto-Teilchenstrom entlang eines Konzentrationsgefälles durch Wärmebewegung.' },
      { term: 'Diffusionskoeffizient', def: 'Stoff- und medienabhängige Konstante D (cm²/s).' },
      { term: 'Fick’sches Gesetz', def: 'Diffusionsfluss ist proportional zu D, Fläche und Konzentrationsgradient.', synonyms: ['Fick'] },
    ],
    structures: [], links: ['osmose', 'stofftransport', 'atmung'], sources: [H('Kap. „Wärmelehre“ (Diffusion, Osmose)'), { id: 'boron', locator: 'Kap. „Transport of solutes and water“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'elektrizitaet', module: 'physics', title: 'Elektrizität: Spannung, Strom, Kondensator', subtitle: 'Ohmsches Gesetz und RC-Glied – das elektrische Modell der Zellmembran', difficulty: 'vertiefung', prerequisites: [], view: 'sim', models: ['rc-glied'],
    objectives: [
      'Spannung, Stromstärke, Widerstand und Ladung mit Einheiten unterscheiden und das Ohmsche Gesetz anwenden',
      'das Laden und Entladen eines Kondensators beschreiben und die Zeitkonstante τ = R·C deuten',
      'die Zellmembran als Parallelschaltung von Kondensator und Widerstand erklären',
    ],
    overview: 'Die Zellmembran trennt Ladungen wie ein Kondensator und lässt über Ionenkanäle Strom durch wie ein Widerstand. Deshalb ändert sich das Membranpotenzial nach einem Reiz nicht sofort, sondern mit einer Zeitkonstante – genau wie die Spannung an einem RC-Glied.',
    mechanism: [
      { title: 'Grundgrößen', text: 'Spannung U (Volt), Stromstärke I (Ampere), Widerstand R (Ohm), Ladung Q (Coulomb).' },
      { title: 'Ohmsches Gesetz', text: 'U = R · I. Der Leitwert G = 1/R (Siemens) wird bei Ionenkanälen bevorzugt.' },
      { title: 'Kondensator', text: 'Speichert Ladung: Q = C · U. Die Kapazität C (Farad) steigt mit der Fläche und sinkt mit dem Plattenabstand.' },
      { title: 'RC-Glied', text: 'Beim Laden über einen Widerstand steigt U_C exponentiell: nach τ = R · C auf 63 %, nach 5 τ praktisch vollständig. Der Strom ist anfangs maximal und fällt ab.' },
      { title: 'Membran', text: 'Lipiddoppelschicht ≈ Kondensator (etwa 1 µF/cm²), Ionenkanäle ≈ parallele Widerstände. Die Membranzeitkonstante liegt typischerweise im Bereich einiger bis einiger zehn Millisekunden.' },
    ],
    depth: {
      text: [
        'Die Membrankapazität ist so groß, weil die isolierende Schicht nur wenige Nanometer dick ist. Für eine Änderung des Membranpotenzials um 100 mV müssen trotzdem nur sehr wenige Ionen fließen – die Konzentrationen innen und außen ändern sich dabei praktisch nicht.',
        'Die Zeitkonstante bestimmt, wie lange ein postsynaptisches Potenzial anhält und damit, wie gut zeitlich aufeinanderfolgende Eingänge summiert werden können. Die Längskonstante (Kabeltheorie) beschreibt das räumliche Gegenstück.',
        'Sicherheit: Für die Gefährdung durch Strom ist die Stromstärke durch den Körper entscheidend; Wechselstrom von 50 Hz kann schon im Bereich einiger zehn Milliampere Kammerflimmern auslösen.',
      ],
      equations: ['U = R · I', 'Q = C · U', 'τ = R · C', 'U_C(t) = U₀ · (1 − e^(−t/τ))  (Laden)', 'U_C(t) = U₀ · e^(−t/τ)  (Entladen)'],
      pitfalls: ['Nach einer Zeitkonstante ist der Kondensator nicht halb, sondern zu 63 % geladen.', 'Ein Kondensator lässt Gleichstrom im stationären Zustand nicht durch.'],
    },
    terms: [
      { term: 'Ohmsches Gesetz', def: 'U = R · I.', synonyms: ['Ohm'] },
      { term: 'Kapazität', def: 'Fähigkeit, Ladung pro Spannung zu speichern; C = Q/U, Einheit Farad.', synonyms: ['Kondensator', 'Farad'] },
      { term: 'Zeitkonstante', def: 'τ = R · C; Zeit bis 63 % der Endspannung erreicht sind.', synonyms: ['tau', 'τ'] },
      { term: 'Leitwert', def: 'Kehrwert des Widerstands, Einheit Siemens (S).', synonyms: ['Leitfähigkeit', 'Siemens'] },
    ],
    structures: [], links: ['ruhemembranpotenzial', 'erregungsleitung', 'psp'], sources: [H('Kap. „Elektrizitätslehre“ (Kondensator, RC-Kreis)'), { id: 'hille', locator: 'Kap. 1 (Membran als elektrisches Ersatzschaltbild)' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'optik', module: 'physics', title: 'Optik: Linsen, Auge und Mikroskop', subtitle: 'Abbildungsgleichung, Brechkraft und Auflösung', difficulty: 'grundlagen', prerequisites: [], view: 'sim', models: ['linse'],
    objectives: [
      'mit der Linsengleichung Bildweite und Abbildungsmaßstab berechnen',
      'Brechkraft in Dioptrien angeben und auf Fehlsichtigkeiten anwenden',
      'den Aufbau des Lichtmikroskops und die Grenze der Auflösung erklären',
    ],
    overview: 'Eine Sammellinse erzeugt von einem Gegenstand ein Bild, dessen Lage und Größe die Linsengleichung vorhersagt. Das Auge, die Brille und das Mikroskop im Histologiekurs funktionieren alle nach diesem Prinzip.',
    mechanism: [
      { title: 'Brechung', text: 'Licht wird beim Übergang zwischen Medien mit verschiedener Brechzahl abgelenkt (Snellius). Eine gewölbte Linse bündelt so parallele Strahlen im Brennpunkt.' },
      { title: 'Brechkraft', text: 'D = 1 / f (f in Metern), Einheit Dioptrie (dpt). Eine Linse mit f = 10 cm hat 10 dpt.' },
      { title: 'Linsengleichung', text: '1/f = 1/g + 1/b. Liegt der Gegenstand außerhalb der Brennweite, entsteht ein reelles, umgekehrtes Bild; innerhalb ein virtuelles, aufrechtes, vergrößertes (Lupe).' },
      { title: 'Abbildungsmaßstab', text: 'β = B/G = −b/g. Das Minuszeichen zeigt ein umgekehrtes Bild an.' },
      { title: 'Mikroskop', text: 'Das Objektiv erzeugt ein vergrößertes reelles Zwischenbild, das Okular betrachtet es wie eine Lupe. Gesamtvergrößerung = Objektiv- mal Okularvergrößerung.' },
    ],
    depth: {
      text: [
        'Das entspannte, normalsichtige Auge hat eine Gesamtbrechkraft von etwa 60 dpt (Hornhaut etwa 40 dpt, Linse etwa 20 dpt). Bei Kurzsichtigkeit (Myopie) ist die Brechkraft für die Baulänge zu groß – korrigiert wird mit Zerstreuungslinsen (negative dpt), bei Weitsichtigkeit (Hyperopie) mit Sammellinsen.',
        'Die Auflösung eines Lichtmikroskops ist durch Beugung begrenzt (Abbe): d ≈ λ / (2 · NA). Mit sichtbarem Licht und Ölimmersion liegt sie bei etwa 0,2 µm – Organellen wie Mitochondrien sind gerade noch erkennbar, Ribosomen nicht. Stärkere Vergrößerung ohne bessere Auflösung ist „leere Vergrößerung“.',
      ],
      equations: ['D = 1 / f', '1/f = 1/g + 1/b', 'β = B / G = −b / g', 'd_min ≈ λ / (2 · NA)'],
      pitfalls: ['Dioptrien beziehen sich auf die Brennweite in Metern.', 'Vergrößerung ist nicht gleich Auflösung.'],
    },
    terms: [
      { term: 'Brennweite', def: 'Abstand zwischen Linse und Brennpunkt.' },
      { term: 'Dioptrie', def: 'Einheit der Brechkraft: 1 dpt = 1/m.', synonyms: ['dpt', 'Brechkraft'] },
      { term: 'Numerische Apertur', def: 'Maß für den Öffnungswinkel eines Objektivs; bestimmt die Auflösung.', synonyms: ['NA'] },
      { term: 'Auflösungsvermögen', def: 'Kleinster Abstand zweier Punkte, die noch getrennt erkennbar sind.', synonyms: ['Auflösung'] },
    ],
    structures: [], links: ['epithel', 'zellaufbau'], sources: [H('Kap. „Optik“ (Linsen, Auge, Mikroskop)')], status: S, origin: 'redaktionell',
  },
  {
    id: 'ultraschall', module: 'physics', title: 'Schwingungen, Wellen und Ultraschall', subtitle: 'Wellenlänge, Dämpfung, Echo und Doppler-Effekt', difficulty: 'vertiefung', prerequisites: [], view: 'sim', models: ['ultraschall'],
    objectives: [
      'Frequenz, Wellenlänge und Ausbreitungsgeschwindigkeit verknüpfen (c = λ · f)',
      'erklären, warum hohe Ultraschallfrequenzen besser auflösen, aber weniger tief reichen',
      'das Echo-Prinzip und den Doppler-Effekt in der Sonografie beschreiben',
    ],
    overview: 'Die Sonografie sendet kurze Ultraschallpulse ins Gewebe und misst, wann und wie stark die Echos zurückkommen. Aus der Laufzeit ergibt sich die Tiefe, aus der Frequenzverschiebung bewegter Reflektoren (Blutzellen) die Flussgeschwindigkeit.',
    mechanism: [
      { title: 'Welle', text: 'Schall ist eine mechanische Longitudinalwelle. Es gilt c = λ · f; in Weichgewebe ist c ≈ 1540 m/s.' },
      { title: 'Echo', text: 'An Grenzflächen mit unterschiedlicher akustischer Impedanz (Z = ρ · c) wird ein Teil reflektiert. Laufzeit t ⇒ Tiefe = c · t / 2.' },
      { title: 'Dämpfung', text: 'Die Intensität nimmt mit der Tiefe ab, im Weichgewebe etwa 0,5 dB pro cm und MHz. Höhere Frequenzen werden stärker gedämpft.' },
      { title: 'Auflösung', text: 'Die axiale Auflösung liegt in der Größenordnung der Wellenlänge – höhere Frequenz, feinere Details.' },
      { title: 'Doppler', text: 'Bewegt sich der Reflektor, verschiebt sich die Frequenz: Δf = 2 · f₀ · v · cos θ / c. Bei 90° zum Fluss misst man nichts.' },
    ],
    depth: {
      text: [
        'Praktische Folge: Oberflächliche Strukturen (Schilddrüse, Sehnen) werden mit 7–15 MHz untersucht, tiefe Bauchorgane mit 2–5 MHz.',
        'Luft und Knochen reflektieren fast alles bzw. dämpfen sehr stark – deshalb braucht man Kontaktgel zwischen Schallkopf und Haut, und hinter Knochen entsteht ein Schallschatten.',
        'Ultraschall nutzt keine ionisierende Strahlung; die diagnostischen Intensitäten gelten als sicher, wenn die Geräteangaben zur thermischen und mechanischen Belastung beachtet werden.',
      ],
      equations: ['c = λ · f', 'Tiefe = c · t / 2', 'Δf = 2 · f₀ · v · cos θ / c', 'Dämpfung [dB] ≈ α · f · 2 · Tiefe'],
      pitfalls: ['Die Laufzeit gilt für Hin- und Rückweg – deshalb durch 2 teilen.', 'Doppler misst nur die Geschwindigkeitskomponente in Schallrichtung.'],
    },
    terms: [
      { term: 'Frequenz', def: 'Schwingungen pro Sekunde, Einheit Hertz (Hz); Ultraschall > 20 kHz, diagnostisch meist 2–15 MHz.', synonyms: ['Hertz'] },
      { term: 'Wellenlänge', def: 'Abstand zweier Wellenberge; λ = c / f.' },
      { term: 'Akustische Impedanz', def: 'Z = ρ · c; Unterschiede an Grenzflächen bestimmen die Reflexion.', synonyms: ['Schallimpedanz'] },
      { term: 'Doppler-Effekt', def: 'Frequenzverschiebung durch Bewegung von Sender, Empfänger oder Reflektor.', synonyms: ['Doppler'] },
    ],
    structures: [], links: ['kreislauf'], sources: [H('Kap. „Schwingungen und Wellen“ (Schall, Ultraschall, Doppler-Effekt)')], status: S, origin: 'redaktionell',
  },
  {
    id: 'radioaktivitaet', module: 'physics', title: 'Radioaktivität und Strahlenschutz', subtitle: 'Zerfallsarten, Halbwertszeit, Dosis', difficulty: 'vertiefung', prerequisites: ['atommodell'], view: 'sim', models: ['zerfall'],
    objectives: [
      'α-, β- und γ-Strahlung nach Art, Reichweite und Abschirmung unterscheiden',
      'mit dem Zerfallsgesetz Aktivitäten berechnen und die effektive Halbwertszeit bestimmen',
      'Energiedosis, Äquivalentdosis und effektive Dosis unterscheiden und Größenordnungen einordnen',
    ],
    overview: 'Instabile Atomkerne zerfallen spontan und senden dabei Strahlung aus. Welcher Kern wann zerfällt, ist zufällig – für viele Kerne zusammen gilt aber ein exaktes Exponentialgesetz. Nuklearmedizin und Röntgendiagnostik nutzen diese Strahlung; der Strahlenschutz begrenzt ihre Risiken.',
    mechanism: [
      { title: 'Zerfallsarten', text: 'α: Heliumkern, im Gewebe nur µm weit, außen durch Papier/Haut abgeschirmt, innerlich sehr schädlich. β⁻: Elektron, mm bis cm weit. β⁺: Positron, zerstrahlt mit einem Elektron zu zwei 511-keV-Photonen (PET). γ: Photon, durchdringend, nur abgeschwächt (Blei, Beton).' },
      { title: 'Zerfallsgesetz', text: 'A(t) = A₀ · e^(−λt) = A₀ · (1/2)^(t/T½). Aktivität in Becquerel (1 Bq = 1 Zerfall pro Sekunde).' },
      { title: 'Effektive Halbwertszeit', text: 'Im Körper wirken physikalischer Zerfall und Ausscheidung zusammen: 1/T_eff = 1/T_phys + 1/T_biol. T_eff ist immer kürzer als beide.' },
      { title: 'Dosis', text: 'Energiedosis D = absorbierte Energie / Masse (Gray, Gy = J/kg). Äquivalentdosis gewichtet mit der Strahlenart (Sievert, Sv), die effektive Dosis zusätzlich mit der Empfindlichkeit der Organe.' },
      { title: 'Schutz', text: 'Die vier A: Abstand (Intensität ∝ 1/r²), Aufenthaltsdauer kurz, Abschirmung, Aktivität gering.' },
    ],
    depth: {
      text: [
        'Größenordnungen (Deutschland): Die mittlere effektive Dosis der Bevölkerung aus natürlichen Quellen liegt bei etwa 2 bis 2,5 mSv pro Jahr, aus der Medizin kommt im Mittel noch einmal eine ähnliche Größenordnung hinzu (Werte nach den Jahresberichten des Bundesamts für Strahlenschutz).',
        'Der Grenzwert der effektiven Dosis beträgt nach Strahlenschutzgesetz 1 mSv pro Kalenderjahr für Einzelpersonen der Bevölkerung aus Tätigkeiten und 20 mSv pro Kalenderjahr für beruflich exponierte Personen. Für Patientinnen und Patienten gelten keine Grenzwerte, sondern die rechtfertigende Indikation.',
        'Technetium-99m (T½ ≈ 6 h) ist das häufigste Nuklid der Szintigrafie: Die Halbwertszeit reicht für die Untersuchung, die Strahlung (140 keV γ) wird gut gemessen, die Belastung bleibt gering.',
      ],
      equations: ['A(t) = A₀ · (1/2)^(t / T½)', 'λ = ln 2 / T½', '1 / T_eff = 1 / T_phys + 1 / T_biol', 'D = E / m  [Gy]'],
      pitfalls: ['Nach zwei Halbwertszeiten ist ein Viertel übrig, nicht null.', 'Gray und Sievert haben dieselbe Einheit (J/kg), meinen aber verschiedene Größen.', 'α-Strahler sind außen harmlos, eingeatmet oder verschluckt aber besonders gefährlich.'],
    },
    terms: [
      { term: 'Halbwertszeit', def: 'Zeit, in der die Hälfte der Kerne zerfallen ist.', synonyms: ['T½'] },
      { term: 'Becquerel', def: 'Einheit der Aktivität: Zerfälle pro Sekunde.', synonyms: ['Bq', 'Aktivität'] },
      { term: 'Sievert', def: 'Einheit der Äquivalent- und der effektiven Dosis.', synonyms: ['Sv', 'effektive Dosis'] },
      { term: 'Gray', def: 'Einheit der Energiedosis (J/kg).', synonyms: ['Gy', 'Energiedosis'] },
      { term: 'Ionisierende Strahlung', def: 'Strahlung, die genug Energie hat, um Elektronen aus Atomen herauszuschlagen.' },
    ],
    structures: [], links: ['atommodell'], sources: [H('Kap. „Atom- und Kernphysik“ und „Ionisierende Strahlung“'), { id: 'strlschg', locator: '§ 78 (Grenzwerte für beruflich exponierte Personen), § 80 (Grenzwerte für die Bevölkerung)' }, { id: 'bfs', locator: 'Jahresbericht „Umweltradioaktivität und Strahlenbelastung“' }], status: S, origin: 'redaktionell',
  },
];
