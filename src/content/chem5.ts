import type { Lesson } from './types';

// Allgemeine und anorganische Chemie (1. Semester) – Ausbau auf Seminarniveau.
// Bisherige Lernziele bleiben wörtlich erhalten (vorhandene Aufgaben verweisen darauf); neue Lernziele werden angehängt.

const S = 'zu_pruefen' as const;
const Z = (locator: string) => ({ id: 'zeeck', locator });
type Up = (base: Lesson) => Lesson;
const uniq = (a: string[]) => [...new Set(a)];

export const AT_OBJ = {
  isotope: 'Isotope und die mittlere Atommasse aus Isotopenhäufigkeiten berechnen',
  orbitale: 'Quantenzahlen, Orbitalformen sowie Pauli-Prinzip und Hundsche Regel anwenden',
};
export const PSE_OBJ = {
  gruppen: 'Hauptgruppen mit ihren Namen und typischen Eigenschaften (Metall, Halbmetall, Nichtmetall) beschreiben',
  ie: 'Ionisierungsenergie und Elektronenaffinität erklären und biologisch wichtige Elemente einordnen',
};
export const BD_OBJ = {
  lewis: 'Lewis-Formeln mit Oktettregel und Formalladungen aufstellen',
  mesomerie: 'Mesomerie (Resonanz) an Carbonat, Carboxylat und Benzol erklären',
  gitter: 'Metallbindung, Ionengitter und Hydratation beschreiben und Löslichkeit nach „Ähnliches löst sich in Ähnlichem“ vorhersagen',
};
export const KZ_OBJ = {
  osmodruck: 'den osmotischen Druck mit der van’t-Hoff-Gleichung berechnen',
};
export const RX_OBJ = {
  gleichung: 'Redoxgleichungen über Teilgleichungen mit Elektronen- und Ladungsausgleich aufstellen',
  zelle: 'die Spannungsreihe der Metalle nutzen und eine galvanische Zelle beschreiben',
  nernst: 'mit der Nernst-Gleichung Potenziale bei Nicht-Standardbedingungen berechnen',
};
export const KX_OBJ = {
  nomenklatur: 'Komplexe benennen und die Oxidationszahl des Zentralions aus der Komplexladung berechnen',
  geometrie: 'Koordinationszahl, Geometrie und Zähnigkeit von Liganden zuordnen',
  medizin: 'Komplexbildungsgleichgewichte und medizinisch wichtige Komplexe (Cisplatin, Antidote, Kontrastmittel, Cobalamin) erklären',
};
export const EK_OBJ = [
  'exotherme und endotherme Reaktionen unterscheiden und Reaktionsenthalpien mit dem Satz von Hess berechnen',
  'Entropie und freie Enthalpie (ΔG = ΔH − T·ΔS) nutzen, um die Freiwilligkeit einer Reaktion vorherzusagen',
  'Reaktionsgeschwindigkeit, Geschwindigkeitsgesetz und Reaktionsordnung beschreiben',
  'Halbwertszeiten von Reaktionen 1. Ordnung berechnen und auf die Elimination von Arzneistoffen übertragen',
  'Temperaturabhängigkeit (RGT-Regel, Arrhenius) und Katalyse am Energiediagramm erklären',
];

// ---------------------------------------------------------------------------
export const upgradeAtom: Up = (b) => ({
  ...b,
  title: 'Atombau: Kern, Isotope und Elektronenhülle',
  subtitle: 'Protonen, Neutronen, Elektronen, Isotope, mittlere Atommasse, Orbitale und Quantenzahlen',
  objectives: [...b.objectives, AT_OBJ.isotope, AT_OBJ.orbitale],
  overview: 'Atome bestehen aus einem winzigen, schweren Kern aus Protonen und Neutronen und einer Hülle aus Elektronen. Die Zahl der Protonen legt das Element fest, die Zahl der Neutronen das Isotop, die Elektronen der äußersten Schale das chemische Verhalten. In der Medizin begegnen Isotope als Tracer und in der Strahlentherapie, Elektronenkonfigurationen erklären, warum Natrium als Na⁺ und Chlor als Cl⁻ im Körper vorkommt.',
  mechanism: [
    { title: 'Elementarteilchen', text: 'Proton: Ladung +1, Masse ≈ 1 u. Neutron: ungeladen, Masse ≈ 1 u. Elektron: Ladung −1, Masse ≈ 1/1836 u – praktisch masselos. Der Kern ist etwa 10 000- bis 100 000-mal kleiner als das Atom, enthält aber fast die gesamte Masse.' },
    { title: 'Ordnungs- und Massenzahl', text: 'Ordnungszahl Z = Protonenzahl (bestimmt das Element). Massenzahl A = Protonen + Neutronen. Schreibweise: ᴬ_Z X, z. B. ¹²₆C: 6 Protonen, 6 Neutronen. Im neutralen Atom ist die Elektronenzahl gleich Z.' },
    { title: 'Isotope', text: 'Atome eines Elements mit verschiedener Neutronenzahl: ¹H, ²H (Deuterium), ³H (Tritium); ¹²C, ¹³C, ¹⁴C. Chemisch fast gleich, aber verschieden schwer, manche radioaktiv (¹⁴C, ¹³¹I).' },
    { title: 'Mittlere Atommasse', text: 'Die Atommasse im Periodensystem ist der Mittelwert der natürlichen Isotope, gewichtet nach ihrer Häufigkeit: Chlor = 0,758 · 34,97 u + 0,242 · 36,97 u ≈ 35,45 u. Deshalb ist sie fast nie ganzzahlig.' },
    { title: 'Schalen und Orbitale', text: 'Elektronen besetzen Hauptschalen (n = 1, 2, 3 …, maximal 2n² Elektronen) mit Unterschalen s, p, d, f. Orbitale sind Aufenthaltsräume: s kugelförmig, p hantelförmig (px, py, pz).' },
    { title: 'Quantenzahlen und Regeln', text: 'Hauptquantenzahl n (Schale), Nebenquantenzahl l (Form: 0 = s, 1 = p, 2 = d), Magnetquantenzahl m (Ausrichtung) und Spin s (±½). Pauli-Prinzip: Keine zwei Elektronen stimmen in allen vier Quantenzahlen überein – höchstens 2 Elektronen pro Orbital. Hundsche Regel: Gleichwertige Orbitale werden erst einzeln mit parallelem Spin besetzt.' },
    { title: 'Valenzelektronen und Ionen', text: 'Die Elektronen der äußersten Schale bestimmen das chemische Verhalten. Atome geben Elektronen ab (Kationen, z. B. Na → Na⁺ + e⁻) oder nehmen sie auf (Anionen, Cl + e⁻ → Cl⁻) und erreichen dabei oft die Edelgaskonfiguration.' },
  ],
  depth: {
    ...b.depth,
    text: [
      ...b.depth.text,
      'Medizinische Isotope: ¹³¹I wird von der Schilddrüse aufgenommen und zur Therapie genutzt, ⁹⁹ᵐTc ist das häufigste Isotop der nuklearmedizinischen Diagnostik, ¹⁸F in Fluordesoxyglukose macht im PET stoffwechselaktives Gewebe sichtbar. Stabile Isotope (¹³C) dienen z. B. im Atemtest auf Helicobacter pylori.',
      'Die atomare Masseneinheit u ist 1/12 der Masse eines ¹²C-Atoms (1 u ≈ 1,66 · 10⁻²⁷ kg). Die molare Masse in g/mol hat denselben Zahlenwert wie die Atommasse in u – das verbindet die Atomebene mit dem Labor.',
    ],
    equations: ['A = Z + N', 'mittlere Atommasse = Σ (Häufigkeit · Isotopenmasse)', 'max. Elektronen pro Schale = 2n²'],
    pitfalls: [...(b.depth.pitfalls ?? []), 'Isotope unterscheiden sich in der Neutronenzahl, nicht in der Protonenzahl.', 'Häufigkeiten in Prozent erst in Anteile umrechnen (75,8 % = 0,758).', 'Ein Orbital fasst höchstens zwei Elektronen – eine p-Unterschale also sechs.'],
  },
  terms: [...b.terms,
    { term: 'Atomare Masseneinheit', def: '1 u = 1/12 der Masse eines ¹²C-Atoms ≈ 1,66 · 10⁻²⁷ kg.', synonyms: ['u'] },
    { term: 'Orbital', def: 'Raumbereich, in dem sich ein Elektron mit hoher Wahrscheinlichkeit aufhält; fasst höchstens zwei Elektronen.', synonyms: ['s-Orbital', 'p-Orbital'] },
    { term: 'Pauli-Prinzip', def: 'Zwei Elektronen eines Atoms stimmen nie in allen vier Quantenzahlen überein.' },
    { term: 'Hundsche Regel', def: 'Gleichwertige Orbitale werden zuerst einfach mit parallelem Spin besetzt.' },
    { term: 'Quantenzahlen', def: 'Haupt- (n), Neben- (l), Magnet- (m) und Spinquantenzahl (s) beschreiben den Zustand eines Elektrons.' },
  ],
  sources: [Z('Kap. „Atombau“'), ...b.sources],
  links: uniq([...b.links, 'periodensystem', 'radioaktivitaet']),
});

export const upgradePse: Up = (b) => ({
  ...b,
  objectives: [...b.objectives, PSE_OBJ.gruppen, PSE_OBJ.ie],
  mechanism: [
    ...b.mechanism,
    { title: 'Hauptgruppen', text: 'I Alkalimetalle (Li, Na, K): sehr reaktiv, bilden M⁺. II Erdalkalimetalle (Mg, Ca): M²⁺. III Borgruppe. IV Kohlenstoffgruppe (C, Si). V Stickstoffgruppe (N, P). VI Chalkogene (O, S). VII Halogene (F, Cl, Br, I): bilden X⁻. VIII Edelgase (He, Ne, Ar): reaktionsträge, volle Schale.' },
    { title: 'Metalle und Nichtmetalle', text: 'Links und unten stehen Metalle (glänzend, leitfähig, geben Elektronen ab), rechts oben Nichtmetalle. Dazwischen verläuft eine Diagonale der Halbmetalle (B, Si, As). Die Nebengruppenelemente (d-Block) sind alle Metalle, z. B. Fe, Cu, Zn.' },
    { title: 'Ionisierungsenergie', text: 'Energie, die nötig ist, um ein Elektron aus dem Atom zu entfernen. Sie steigt innerhalb einer Periode nach rechts und sinkt in einer Gruppe nach unten – deshalb geben Alkalimetalle so leicht ein Elektron ab. Die Elektronenaffinität beschreibt umgekehrt die Energie bei Aufnahme eines Elektrons; Halogene nehmen besonders bereitwillig Elektronen auf.' },
  ],
  depth: {
    ...b.depth,
    text: [...b.depth.text,
      'Biologisch wichtige Elemente: Mengenelemente des Körpers sind C, H, O, N (Biomoleküle), P (Knochen, ATP, DNA), S (Cystein, Methionin), Na⁺, K⁺, Cl⁻ (Membranpotenzial, Volumen), Ca²⁺ (Knochen, Signalübertragung), Mg²⁺ (ATP-Komplex). Spurenelemente sind z. B. Fe (Hämoglobin), Zn (viele Enzyme), Cu, I (Schilddrüsenhormone), Se, F (Zahnschmelz), Co (Vitamin B₁₂), Mn, Mo.',
      'Elemente einer Gruppe verhalten sich chemisch ähnlich: Li⁺ kann Na⁺ und K⁺ in manchen Prozessen nachahmen (Lithium als Medikament), Sr²⁺ wird wie Ca²⁺ in Knochen eingebaut.',
    ],
    pitfalls: [...(b.depth.pitfalls ?? []), 'Wasserstoff steht in Gruppe I, ist aber kein Metall.', 'Die Ionisierungsenergie verhält sich wie die Elektronegativität (steigt nach rechts oben), der Atomradius umgekehrt.'],
  },
  terms: [...b.terms,
    { term: 'Alkalimetalle', def: 'Elemente der I. Hauptgruppe (ohne H); bilden einfach positive Ionen.', synonyms: ['Erdalkalimetalle', 'Halogene', 'Edelgase', 'Chalkogene'] },
    { term: 'Ionisierungsenergie', def: 'Energie, um einem Atom ein Elektron zu entreißen.', synonyms: ['Elektronenaffinität'] },
    { term: 'Spurenelement', def: 'Lebensnotwendiges Element, das nur in sehr kleinen Mengen gebraucht wird, z. B. Fe, Zn, I.', synonyms: ['Mengenelement'] },
  ],
});

export const upgradeBindung: Up = (b) => ({
  ...b,
  objectives: [...b.objectives, BD_OBJ.lewis, BD_OBJ.mesomerie, BD_OBJ.gitter],
  overview: 'Atome verbinden sich, weil sie dadurch einen energetisch günstigeren Zustand erreichen – meist eine volle Valenzschale. Je nach Elektronegativitätsdifferenz teilen sie Elektronenpaare (Atombindung), übertragen Elektronen (Ionenbindung) oder bilden ein Elektronengas (Metallbindung). Zwischen Molekülen wirken schwächere Kräfte, die Siedepunkte, Löslichkeit, DNA-Basenpaarung und Proteinfaltung bestimmen.',
  mechanism: [
    ...b.mechanism,
    { title: 'Lewis-Formeln', text: 'Valenzelektronen als Punkte bzw. Striche: bindende Elektronenpaare zwischen den Atomen, freie Elektronenpaare am Atom. Oktettregel: Atome der 2. Periode streben acht Valenzelektronen an (H: zwei). Formalladung = Valenzelektronen − (freie Elektronen + ½ bindende Elektronen); z. B. im NH₄⁺ trägt N die Formalladung +1.' },
    { title: 'Mesomerie', text: 'Lässt sich ein Teilchen nur durch mehrere Lewis-Formeln beschreiben, die sich nur in der Lage der Elektronen unterscheiden, liegt Mesomerie vor (Doppelpfeil ↔). Die wirkliche Struktur liegt dazwischen: Im Carbonat-Ion sind alle drei C–O-Bindungen gleich lang, im Carboxylat-Ion verteilt sich die negative Ladung auf beide O-Atome, im Benzol sind alle C–C-Bindungen gleich. Delokalisierung stabilisiert.' },
    { title: 'Metallbindung und Ionengitter', text: 'In Metallen bilden Atomrümpfe ein Gitter, die Valenzelektronen sind frei beweglich („Elektronengas“) – daher Leitfähigkeit und Verformbarkeit. Ionenverbindungen bilden Kristallgitter aus Kationen und Anionen; die Gitterenergie hält sie zusammen, deshalb hohe Schmelzpunkte.' },
    { title: 'Lösen und Hydratation', text: 'Löst sich ein Salz, umgeben sich die Ionen mit Wassermolekülen (Hydrathülle): Der negative O-Pol zeigt zum Kation, die H-Atome zum Anion. Polare Stoffe lösen sich in polaren Lösungsmitteln, unpolare in unpolaren („Ähnliches löst sich in Ähnlichem“) – Fette lösen sich nicht in Wasser, aber in Benzin.' },
  ],
  depth: {
    ...b.depth,
    text: [...b.depth.text,
      'Stärke der Wechselwirkungen (grob, kJ/mol): kovalente Bindung 150–1000, Ionenbindung im Gitter einige hundert, Wasserstoffbrücke 10–40, Dipol-Dipol 5–20, Van-der-Waals 0,1–5. Gerade die schwachen Kräfte machen biologische Strukturen flexibel und reversibel: DNA-Doppelstränge lassen sich trennen, Enzyme binden Substrate nur vorübergehend.',
      'Ausnahmen von der Oktettregel: Elemente ab der 3. Periode können mehr als acht Elektronen um sich haben (z. B. P in Phosphat, S in Sulfat in vielen Darstellungen).',
      'Amphiphile Moleküle haben einen polaren und einen unpolaren Teil (Seifen, Phospholipide). In Wasser lagern sie sich so zusammen, dass die unpolaren Teile vom Wasser abgeschirmt sind – Mizellen und Lipiddoppelschichten entstehen von selbst.',
    ],
    pitfalls: [...(b.depth.pitfalls ?? []), 'Mesomere Grenzformeln sind keine verschiedenen Moleküle, die sich ineinander umwandeln – das echte Teilchen ist ein Zwischenzustand.', 'Freie Elektronenpaare zählen beim VSEPR-Modell mit, bei der Benennung der Molekülform aber nicht (H₂O: tetraedrische Elektronenpaar-Anordnung, gewinkeltes Molekül).'],
  },
  terms: [...b.terms,
    { term: 'Lewis-Formel', def: 'Strukturformel mit allen Valenzelektronen als Bindungsstriche und freie Elektronenpaare.', synonyms: ['Valenzstrichformel', 'Oktettregel'] },
    { term: 'Formalladung', def: 'Ladung eines Atoms in einer Lewis-Formel bei gleichmäßiger Aufteilung der Bindungselektronen.' },
    { term: 'Mesomerie', def: 'Beschreibung eines Teilchens durch mehrere Grenzformeln; die reale Struktur liegt dazwischen (delokalisierte Elektronen).', synonyms: ['Resonanz', 'Grenzformel'] },
    { term: 'Metallbindung', def: 'Bindung zwischen Metallatomrümpfen durch frei bewegliche Valenzelektronen.', synonyms: ['Elektronengas'] },
    { term: 'Hydratation', def: 'Umhüllung gelöster Ionen oder polarer Moleküle mit Wassermolekülen.', synonyms: ['Hydrathülle'] },
    { term: 'Amphiphil', def: 'Mit einem hydrophilen und einem hydrophoben Molekülteil, z. B. Phospholipide.', synonyms: ['hydrophil', 'hydrophob', 'lipophil'] },
  ],
  sources: [Z('Kap. „Chemische Bindung“'), ...b.sources],
});

export const upgradeKonz: Up = (b) => ({
  ...b,
  objectives: [...b.objectives, KZ_OBJ.osmodruck],
  mechanism: [...b.mechanism,
    { title: 'Osmotischer Druck', text: 'Trennt eine semipermeable Membran zwei Lösungen, wandert Wasser zur Seite der höheren Osmolarität. Der Druck, der das gerade verhindert, ist der osmotische Druck: π = c_osm · R · T (van’t Hoff). Für Blutplasma (≈ 0,29 osmol/l, 310 K) ergibt sich etwa 750 kPa – rund 7,5 bar.' },
  ],
  depth: { ...b.depth,
    text: [...b.depth.text, 'Kolloidosmotischer (onkotischer) Druck: Der Teil des osmotischen Drucks, der von Proteinen (vor allem Albumin) stammt, ist klein (≈ 3,3 kPa = 25 mmHg), aber entscheidend für den Flüssigkeitsaustausch an Kapillaren, weil kleine Ionen die Kapillarwand frei passieren und dort nicht osmotisch wirken.'],
    equations: [...(b.depth.equations ?? []), 'π = c_osm · R · T  (R = 8,314 J/(mol·K))'],
  },
  terms: [...b.terms, { term: 'Osmotischer Druck', def: 'Druck, der den Wassereinstrom durch eine semipermeable Membran gerade verhindert; π = c·R·T.', synonyms: ['van’t-Hoff-Gleichung', 'onkotischer Druck', 'kolloidosmotischer Druck'] }],
});

export const upgradeRedox: Up = (b) => ({
  ...b,
  title: 'Redoxreaktionen und Elektrochemie',
  subtitle: 'Oxidationszahlen, Redoxgleichungen, Spannungsreihe, galvanische Zelle, Nernst-Gleichung, Atmungskette',
  difficulty: 'grundlagen',
  view: 'redox2',
  objectives: [...b.objectives, RX_OBJ.gleichung, RX_OBJ.zelle, RX_OBJ.nernst],
  overview: 'Bei Redoxreaktionen werden Elektronen übertragen: Ein Teilchen gibt Elektronen ab (Oxidation), ein anderes nimmt sie auf (Reduktion). Beide Vorgänge laufen immer gemeinsam ab. Mit Oxidationszahlen behält man den Überblick, mit Redoxpotenzialen sagt man voraus, welche Reaktion freiwillig abläuft. Im Körper liefern Redoxreaktionen in der Atmungskette die meiste Energie; im Labor und in der Klinik begegnen sie bei Desinfektion, Antioxidantien und Batterien.',
  mechanism: [
    { title: 'Oxidation und Reduktion', text: 'Oxidation = Elektronenabgabe (Oxidationszahl steigt), Reduktion = Elektronenaufnahme (Oxidationszahl sinkt). Das Oxidationsmittel nimmt Elektronen auf und wird selbst reduziert; das Reduktionsmittel gibt Elektronen ab und wird oxidiert.' },
    { title: 'Oxidationszahlen bestimmen', text: 'Elemente: 0. Einatomige Ionen: Ladung. O meist −II (in Peroxiden −I), H meist +I (in Metallhydriden −I), F immer −I. Die Summe aller Oxidationszahlen ist gleich der Ladung des Teilchens. Beispiele: C in CO₂ +IV, in CH₄ −IV; Mn in MnO₄⁻ +VII; S in SO₄²⁻ +VI.' },
    { title: 'Redoxgleichungen aufstellen', text: '1. Oxidationszahlen bestimmen, Oxidation und Reduktion erkennen. 2. Teilgleichungen mit Elektronen aufschreiben. 3. Ladungen mit H⁺ (sauer) bzw. OH⁻ (basisch) ausgleichen, dann H und O mit H₂O. 4. Elektronenzahlen beider Teilgleichungen auf das kleinste gemeinsame Vielfache bringen und addieren. Beispiel: MnO₄⁻ + 8 H⁺ + 5 Fe²⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O.' },
    { title: 'Spannungsreihe', text: 'Ordnet Redoxpaare nach ihrem Standardpotenzial E° (bezogen auf die Normalwasserstoffelektrode, 0 V). Unedle Metalle (Mg −2,37 V, Zn −0,76 V, Fe −0,44 V) geben leicht Elektronen ab; edle (Cu +0,34 V, Ag +0,80 V, Au +1,50 V) kaum. Ein Paar mit negativerem Potenzial reduziert ein Paar mit positiverem: Zink löst sich in Kupfersulfatlösung, Kupfer scheidet sich ab.' },
    { title: 'Galvanische Zelle', text: 'Trennt man die beiden Teilreaktionen räumlich, fließen die Elektronen durch einen Draht – Strom. Anode = Ort der Oxidation (Minuspol), Kathode = Ort der Reduktion (Pluspol). Eine Salzbrücke schließt den Stromkreis. Zellspannung ΔE = E(Kathode) − E(Anode); Daniell-Element Zn/Cu: 0,34 − (−0,76) = 1,10 V.' },
    { title: 'Nernst-Gleichung', text: 'Das Potenzial hängt von den Konzentrationen ab: E = E° + (0,059 V / z) · lg([Ox]/[Red]) bei 25 °C (bei 37 °C ≈ 0,0615 V). Pro Zehnerpotenz im Verhältnis ändert sich E um 59 mV / z.' },
    { title: 'Energie', text: 'ΔG = −z · F · ΔE (F = 96 485 C/mol). Positive Zellspannung bedeutet negatives ΔG – die Reaktion läuft freiwillig. In der Atmungskette: NADH → O₂ mit ΔE ≈ 1,14 V, für 2 Elektronen ΔG ≈ −220 kJ/mol.' },
  ],
  depth: {
    text: [
      ...b.depth.text,
      'Disproportionierung: Ein Element wird gleichzeitig oxidiert und reduziert, z. B. 2 H₂O₂ → 2 H₂O + O₂ (O von −I zu −II und 0). So zersetzt die Katalase in Zellen schädliches Wasserstoffperoxid.',
      'Elektrolyse ist die Umkehrung der galvanischen Zelle: Eine äußere Spannung erzwingt eine nicht freiwillige Redoxreaktion. Die abgeschiedene Stoffmenge folgt aus n = I·t / (z·F) (Faraday).',
      'Klinische Beispiele: Wasserstoffperoxid und Hypochlorit desinfizieren durch Oxidation; Ascorbinsäure (Vitamin C) wirkt als Reduktionsmittel (Antioxidans); bei der Methämoglobinämie ist Fe²⁺ im Hämoglobin zu Fe³⁺ oxidiert und bindet kein O₂ mehr. Amalgamfüllung und Goldkrone im Mund können eine kleine galvanische Zelle bilden.',
    ],
    equations: ['MnO₄⁻ + 8 H⁺ + 5 e⁻ → Mn²⁺ + 4 H₂O', 'ΔE = E(Kathode) − E(Anode)', 'E = E° + (0,059 V / z) · lg([Ox]/[Red])  (25 °C)', 'ΔG = −z · F · ΔE', 'n = I · t / (z · F)'],
    pitfalls: [
      ...(b.depth.pitfalls ?? []),
      'Merksatz: Oxidation ist Abgabe, Reduktion ist Aufnahme von Elektronen („OIL RIG“: Oxidation Is Loss, Reduction Is Gain).',
      'Das Oxidationsmittel wird reduziert – nicht oxidiert.',
      'Die Anode ist in der galvanischen Zelle der Minuspol, bei der Elektrolyse der Pluspol – entscheidend ist: Anode = Oxidation.',
      'Bei der Nernst-Gleichung steht die oxidierte Form im Zähler.',
    ],
  },
  terms: [
    ...b.terms,
    { term: 'Oxidationsmittel', def: 'Stoff, der Elektronen aufnimmt und dabei selbst reduziert wird.', synonyms: ['Reduktionsmittel'] },
    { term: 'Spannungsreihe', def: 'Ordnung der Redoxpaare nach ihrem Standardpotenzial.', synonyms: ['elektrochemische Spannungsreihe', 'Standardpotenzial', 'unedel', 'edel'] },
    { term: 'Galvanische Zelle', def: 'Anordnung, in der eine freiwillige Redoxreaktion elektrische Energie liefert.', synonyms: ['Daniell-Element', 'Anode', 'Kathode', 'Salzbrücke'] },
    { term: 'Nernst-Gleichung', def: 'Beschreibt die Abhängigkeit des Elektrodenpotenzials von den Konzentrationen.' },
    { term: 'Normalwasserstoffelektrode', def: 'Bezugselektrode mit E° = 0 V.' },
    { term: 'Disproportionierung', def: 'Redoxreaktion, bei der dasselbe Element zugleich oxidiert und reduziert wird.' },
  ],
  links: uniq([...b.links, 'stoechiometrie', 'energiegewinnung']),
  sources: [Z('Kap. „Redoxreaktionen“ und „Elektrochemie“'), ...b.sources],
});

export const upgradeKomplex: Up = (b) => ({
  ...b,
  title: 'Komplexverbindungen',
  subtitle: 'Zentralion, Liganden, Koordinationszahl, Nomenklatur, Chelate – Hämoglobin, EDTA, Cisplatin',
  difficulty: 'grundlagen',
  view: 'complexes',
  objectives: [...b.objectives, KX_OBJ.nomenklatur, KX_OBJ.geometrie, KX_OBJ.medizin],
  mechanism: [
    ...b.mechanism,
    { title: 'Ladung und Oxidationszahl', text: 'Komplexladung = Ladung des Zentralions + Summe der Ligandladungen. [Fe(CN)₆]⁴⁻: 6 · (−1) + x = −4 → Fe hat +II. [Cu(NH₃)₄]²⁺: NH₃ ist neutral → Cu +II. Neutrale Liganden: H₂O (aqua), NH₃ (ammin), CO (carbonyl). Anionische: Cl⁻ (chlorido), CN⁻ (cyanido), OH⁻ (hydroxido).' },
    { title: 'Benennung', text: 'Liganden alphabetisch mit Zahlwort (di, tri, tetra, hexa), dann Zentralatom mit Oxidationszahl in römischen Ziffern. Anionische Komplexe enden auf -at: [Cu(NH₃)₄]²⁺ Tetraamminkupfer(II), [Fe(CN)₆]⁴⁻ Hexacyanidoferrat(II), [PtCl₂(NH₃)₂] Diammindichloridoplatin(II) = Cisplatin.' },
    { title: 'Geometrie', text: 'Koordinationszahl 2: linear ([Ag(NH₃)₂]⁺). 4: tetraedrisch ([Zn(OH)₄]²⁻) oder quadratisch-planar (Pt²⁺, Cisplatin). 6: oktaedrisch ([Fe(H₂O)₆]²⁺, Häm-Eisen). Quadratisch-planare und oktaedrische Komplexe können cis/trans-Isomere bilden – nur cis-Platin wirkt gegen Krebs.' },
    { title: 'Zähnigkeit', text: 'Einzähnig: H₂O, NH₃, Cl⁻, CN⁻. Zweizähnig: Ethylendiamin, Oxalat. Vierzähnig: Porphyrin (Häm, Chlorophyll). Sechszähnig: EDTA. Mehrzähnige Liganden bilden Chelatringe.' },
    { title: 'Komplexbildungsgleichgewicht', text: 'M + n L ⇌ [MLₙ] mit der Stabilitätskonstante K = [MLₙ] / ([M]·[L]ⁿ). Ein großes K bedeutet einen stabilen Komplex; ein stärkerer Ligand verdrängt einen schwächeren (Ligandenaustausch). So entfernt man giftige Metallionen mit Chelatbildnern aus dem Körper.' },
  ],
  depth: { ...b.depth,
    text: [...b.depth.text,
      'Medizinische Komplexe und Chelatbildner: Cisplatin (Zytostatikum, vernetzt DNA), Gadolinium-Chelate (MRT-Kontrastmittel – das freie Gd³⁺ wäre giftig, im Chelat wird es ausgeschieden), EDTA bei Bleivergiftung und als Gerinnungshemmer in Blutröhrchen (bindet Ca²⁺), Deferoxamin bei Eisenüberladung, Dimercaprol bei Arsen- und Quecksilbervergiftung, Berliner Blau bei Thalliumvergiftung. Natriumcitrat in Blutkonserven bindet ebenfalls Ca²⁺.',
      'Biologische Komplexe: Häm (Fe), Chlorophyll (Mg), Cobalamin/Vitamin B₁₂ (Co), Zink in der Carboanhydrase und in Zinkfinger-Proteinen, Kupfer in der Cytochrom-c-Oxidase. ATP liegt in der Zelle überwiegend als Mg²⁺-ATP-Komplex vor.',
      'Farbe: Viele Übergangsmetallkomplexe sind farbig, weil Licht d-Elektronen anregt. Der Farbumschlag von Hämoglobin (hellrot oxygeniert, dunkelrot desoxygeniert) beruht auf Änderungen am Fe-Komplex.',
    ],
    pitfalls: [...(b.depth.pitfalls ?? []), 'Die Koordinationszahl zählt die gebundenen Ligand-Atome, nicht die Liganden: Ein EDTA ergibt Koordinationszahl 6.', 'Bei der Ladungsrechnung neutrale Liganden (H₂O, NH₃) mit 0 zählen.', 'Cisplatin ist neutral: zwei Cl⁻ (−2) und Pt²⁺ (+2).'],
  },
  terms: [...b.terms,
    { term: 'Zähnigkeit', def: 'Zahl der Atome, mit denen ein Ligand an das Zentralion bindet.', synonyms: ['einzähnig', 'mehrzähnig', 'Denticity'] },
    { term: 'Stabilitätskonstante', def: 'Gleichgewichtskonstante der Komplexbildung; groß bei stabilen Komplexen.', synonyms: ['Komplexbildungskonstante'] },
    { term: 'Cisplatin', def: 'cis-Diammindichloridoplatin(II), quadratisch-planarer Pt-Komplex, Zytostatikum.' },
    { term: 'Ligandenaustausch', def: 'Ersatz eines Liganden durch einen anderen, stärker bindenden Liganden.' },
  ],
  sources: [Z('Kap. „Komplexverbindungen“'), ...b.sources],
});

// ---------------------------------------------------------------------------
export const ENERGETICS_LESSONS: Lesson[] = [
  {
    id: 'energetik-kinetik', module: 'molecule', title: 'Energetik und Kinetik', subtitle: 'Enthalpie, Satz von Hess, Entropie, freie Enthalpie, Reaktionsgeschwindigkeit, Halbwertszeit, Katalyse',
    difficulty: 'grundlagen', prerequisites: ['gleichgewicht'], view: 'energetics',
    objectives: EK_OBJ,
    overview: 'Zwei Fragen gehören zu jeder Reaktion: Kann sie überhaupt von selbst ablaufen (Thermodynamik), und wie schnell läuft sie ab (Kinetik)? Die erste beantwortet die freie Enthalpie ΔG, die zweite die Aktivierungsenergie. Beides ist medizinisch wichtig: Der Körper gewinnt Energie aus exergonen Reaktionen, Enzyme beschleunigen sie, und wie schnell ein Medikament abgebaut wird, beschreibt seine Halbwertszeit.',
    mechanism: [
      { title: 'Enthalpie', text: 'ΔH ist die bei konstantem Druck aufgenommene oder abgegebene Wärme. Exotherm: ΔH < 0, Wärme wird frei (Verbrennung von Glukose: ΔH ≈ −2800 kJ/mol). Endotherm: ΔH > 0, Wärme wird aufgenommen (Lösen von Ammoniumnitrat im Kühlkissen).' },
      { title: 'Satz von Hess', text: 'Die Reaktionsenthalpie hängt nur von Anfangs- und Endzustand ab, nicht vom Weg. Deshalb kann man sie aus Bildungsenthalpien berechnen: ΔH_R = Σ ΔH_f(Produkte) − Σ ΔH_f(Edukte). Elemente in ihrer stabilsten Form haben ΔH_f = 0. Glukose liefert im Körper über viele Schritte dieselbe Energie wie bei der Verbrennung.' },
      { title: 'Entropie', text: 'S ist ein Maß für die Zahl der möglichen Anordnungen („Unordnung“). Sie steigt beim Schmelzen, Verdampfen, Lösen und wenn aus wenigen Teilchen viele werden. Isolierte Systeme streben nach maximaler Entropie (2. Hauptsatz).' },
      { title: 'Freie Enthalpie', text: 'ΔG = ΔH − T·ΔS entscheidet über die Freiwilligkeit: ΔG < 0 exergon (läuft freiwillig), ΔG > 0 endergon (braucht Energiezufuhr), ΔG = 0 Gleichgewicht. Exotherm und Entropiezunahme: immer freiwillig. Endotherm und Entropieabnahme: nie freiwillig. Sonst entscheidet die Temperatur.' },
      { title: 'Reaktionsgeschwindigkeit', text: 'v = Konzentrationsänderung pro Zeit. Das Geschwindigkeitsgesetz v = k · [A]ᵃ · [B]ᵇ wird experimentell bestimmt; die Summe der Exponenten ist die Reaktionsordnung. 0. Ordnung: v konstant (z. B. Ethanolabbau bei gesättigter Alkoholdehydrogenase). 1. Ordnung: v ∝ [A] (radioaktiver Zerfall, Elimination der meisten Arzneistoffe).' },
      { title: 'Halbwertszeit', text: 'Bei 1. Ordnung halbiert sich die Konzentration in gleichen Zeitabständen, unabhängig von der Anfangskonzentration: t½ = ln 2 / k. Nach n Halbwertszeiten ist noch (½)ⁿ übrig – nach 5 Halbwertszeiten etwa 3 %.' },
      { title: 'Aktivierungsenergie und Temperatur', text: 'Auch exergone Reaktionen müssen eine Energiebarriere überwinden (Aktivierungsenergie E_A). Je höher die Temperatur, desto mehr Teilchen haben genug Energie: Arrhenius k = A · e^(−E_A/RT). Faustregel (RGT): 10 °C mehr → 2- bis 3-fache Geschwindigkeit.' },
      { title: 'Katalyse', text: 'Ein Katalysator bietet einen Reaktionsweg mit niedrigerer Aktivierungsenergie, wird nicht verbraucht und verändert weder ΔG noch die Lage des Gleichgewichts. Enzyme sind Biokatalysatoren und beschleunigen Reaktionen oft um viele Zehnerpotenzen.' },
    ],
    depth: {
      text: [
        'Im Körper werden endergone Reaktionen an exergone gekoppelt, meist an die Hydrolyse von ATP (ΔG°’ ≈ −30,5 kJ/mol, unter Zellbedingungen eher −50 kJ/mol). Die Summe ist dann exergon.',
        'Bei 37 °C gilt ΔG°’ = −R·T·ln K ≈ −5,9 kJ/mol · lg K: Jede Zehnerpotenz in K entspricht etwa 5,9 kJ/mol.',
        'Fieber beschleunigt Stoffwechselreaktionen; Unterkühlung verlangsamt sie – deshalb schützt Kühlung (z. B. bei Organtransplantaten oder nach Herzstillstand) Gewebe, weil der Sauerstoffbedarf sinkt.',
        'Pharmakokinetik: Die Plasmakonzentration der meisten Medikamente fällt nach 1. Ordnung. Bei regelmäßiger Gabe ist nach etwa 4–5 Halbwertszeiten ein Gleichgewicht (steady state) erreicht. Ethanol wird dagegen weitgehend nach 0. Ordnung abgebaut (etwa 0,1–0,2 ‰ pro Stunde), weil das Enzym gesättigt ist.',
      ],
      equations: ['ΔH_R = Σ ΔH_f(Produkte) − Σ ΔH_f(Edukte)', 'ΔG = ΔH − T·ΔS', 'v = k · [A]ᵃ · [B]ᵇ', 't½ = ln 2 / k', 'c(t) = c₀ · (½)^(t/t½) = c₀ · e^(−k·t)', 'k = A · e^(−E_A/(R·T))', 'RGT: v₂/v₁ ≈ 2^(ΔT/10 K)'],
      pitfalls: [
        'Exotherm heißt nicht automatisch freiwillig – entscheidend ist ΔG.',
        'ΔG sagt nichts über die Geschwindigkeit: Die Verbrennung von Zucker ist stark exergon, Zucker auf dem Tisch verbrennt trotzdem nicht.',
        'Bei der Berechnung mit dem Satz von Hess die Koeffizienten mit den Bildungsenthalpien multiplizieren und Elemente mit 0 einsetzen.',
        'Einheiten: ΔH meist in kJ/mol, ΔS in J/(mol·K) – vor dem Einsetzen in ΔG = ΔH − TΔS umrechnen.',
        'Die Halbwertszeit hängt bei 1. Ordnung nicht von der Anfangskonzentration ab.',
      ],
    },
    terms: [
      { term: 'Enthalpie', def: 'H; bei konstantem Druck ausgetauschte Wärme; ΔH < 0 exotherm, ΔH > 0 endotherm.', synonyms: ['Reaktionsenthalpie', 'exotherm', 'endotherm'] },
      { term: 'Bildungsenthalpie', def: 'Enthalpieänderung bei der Bildung von 1 mol einer Verbindung aus den Elementen.', synonyms: ['ΔH_f'] },
      { term: 'Satz von Hess', def: 'Die Reaktionsenthalpie ist unabhängig vom Reaktionsweg.' },
      { term: 'Entropie', def: 'S; Maß für die Zahl möglicher Anordnungen eines Systems.' },
      { term: 'Exergon', def: 'Reaktion mit ΔG < 0, läuft freiwillig ab.', synonyms: ['endergon'] },
      { term: 'Reaktionsordnung', def: 'Summe der Exponenten im Geschwindigkeitsgesetz.', synonyms: ['Geschwindigkeitsgesetz', 'Geschwindigkeitskonstante'] },
      { term: 'Halbwertszeit', def: 'Zeit, in der die Hälfte eines Stoffes umgesetzt ist; bei 1. Ordnung t½ = ln 2 / k.', synonyms: ['t½'] },
      { term: 'Aktivierungsenergie', def: 'Energiebarriere, die Teilchen für eine Reaktion überwinden müssen.', synonyms: ['E_A', 'Arrhenius-Gleichung'] },
      { term: 'Katalysator', def: 'Stoff, der die Aktivierungsenergie senkt und dabei nicht verbraucht wird.', synonyms: ['Katalyse', 'Biokatalysator'] },
      { term: 'RGT-Regel', def: 'Reaktionsgeschwindigkeit-Temperatur-Regel: +10 °C ≈ 2- bis 3-fache Geschwindigkeit.' },
    ],
    structures: [], models: [], links: ['gleichgewicht', 'enzyme', 'energiegewinnung', 'radioaktivitaet', 'redox'],
    sources: [Z('Kap. „Energetik“ und „Kinetik“'), { id: 'atkins', locator: 'Kap. „Thermodynamics“ und „Chemical kinetics“' }], status: S, origin: 'redaktionell',
  },
];
