import type { Lesson } from './types';
import raw from './molecules.generated.json';

const S = 'zu_pruefen' as const;

export const MOLPHYS_LESSONS: Lesson[] = [
  {
    id: 'atommodell', module: 'molecule', title: 'Atommodell', subtitle: 'Protonen, Neutronen, Elektronen, Isotope, Ionen', difficulty: 'grundlagen', prerequisites: [], view: 'atom',
    objectives: ['Ordnungszahl, Massenzahl und Isotop definieren', 'aus Protonen-, Neutronen- und Elektronenzahl Element, Isotop und Ladung bestimmen', 'erklären, warum Na zu Na⁺ und Cl zu Cl⁻ wird'],
    overview: 'Ein Atom besteht aus einem Kern aus Protonen und Neutronen und einer Elektronenhülle. Die Protonenzahl legt das Element fest, die Neutronenzahl das Isotop, die Elektronenzahl die Ladung.',
    mechanism: [
      { title: 'Kern', text: 'Protonen (positiv) und Neutronen (neutral) bilden den Kern; fast die gesamte Masse.' },
      { title: 'Hülle', text: 'Elektronen (negativ) besetzen Energieniveaus. Im Schalenmodell: 2, 8, 8 … Elektronen.' },
      { title: 'Valenzelektronen', text: 'Die äußersten Elektronen bestimmen das chemische Verhalten.' },
      { title: 'Ionenbildung', text: 'Atome geben Elektronen ab (Kationen) oder nehmen sie auf (Anionen) und erreichen dabei oft eine Edelgaskonfiguration.' },
    ],
    depth: { text: ['Das Schalenmodell ist eine starke Vereinfachung. Quantenmechanisch werden Elektronen durch Orbitale (Aufenthaltswahrscheinlichkeiten) beschrieben, nicht durch Bahnen.'], pitfalls: ['Die Massenzahl ist nicht gleich der Atommasse im Periodensystem (gewichteter Mittelwert der Isotope).'] },
    terms: [
      { term: 'Ordnungszahl', def: 'Anzahl der Protonen.', synonyms: ['Kernladungszahl', 'Protonenzahl'] },
      { term: 'Massenzahl', def: 'Summe aus Protonen und Neutronen.', synonyms: ['Nukleonenzahl'] },
      { term: 'Isotop', def: 'Atome gleicher Protonen-, aber unterschiedlicher Neutronenzahl.', synonyms: ['Isotope'] },
      { term: 'Ion', def: 'Geladenes Teilchen.', synonyms: ['Kation', 'Anion'] },
      { term: 'Valenzelektronen', def: 'Elektronen der äußersten Schale.', synonyms: ['Außenelektronen'] },
    ],
    structures: [], models: [], links: ['bindungen'], sources: [{ id: 'iupac' }, { id: 'atkins', locator: 'Kap. „Atomic structure and spectra“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'bindungen', module: 'molecule', title: 'Chemische Bindungen und Molekülgeometrie', subtitle: 'Kovalent, ionisch, Wasserstoffbrücken, Van-der-Waals', difficulty: 'grundlagen', prerequisites: ['atommodell'], view: 'bonds',
    objectives: ['Bindungstypen anhand der Elektronegativitätsdifferenz einordnen', 'Dipole und Partialladungen erklären', 'zwischenmolekulare Kräfte nach Stärke ordnen', 'Molekülgeometrie und Bindungswinkel mit dem VSEPR-Modell begründen'],
    overview: 'Atome verbinden sich, indem sie Elektronen teilen (kovalent) oder übertragen (ionisch). Unterschiedliche Elektronegativitäten führen zu polaren Bindungen und Dipolen. Zwischen Molekülen wirken schwächere Kräfte wie Wasserstoffbrücken.',
    mechanism: [
      { title: 'Kovalente Bindung', text: 'Gemeinsame Elektronenpaare; unpolar bei gleicher, polar bei unterschiedlicher Elektronegativität.' },
      { title: 'Ionenbindung', text: 'Bei großer EN-Differenz Elektronenübertragung; elektrostatische Anziehung von Ionen im Gitter.' },
      { title: 'Dipol', text: 'Ein Molekül ist ein Dipol, wenn sich die Bindungsdipole wegen der Geometrie nicht aufheben (H₂O ja, CO₂ nein).' },
      { title: 'Wasserstoffbrücken', text: 'H an N, O oder F tritt mit einem freien Elektronenpaar eines anderen elektronegativen Atoms in Wechselwirkung.' },
      { title: 'Van-der-Waals-Kräfte', text: 'Schwache Anziehung durch fluktuierende Dipole; wichtig z. B. zwischen Fettsäureketten.' },
      { title: 'VSEPR', text: 'Elektronenpaare stoßen sich ab und ordnen sich mit größtmöglichem Abstand an: tetraedrisch ≈ 109,5°, in H₂O wegen freier Elektronenpaare ≈ 104,5°.' },
    ],
    depth: { text: ['Die Grenzen „ΔEN < 0,4 unpolar“, „> 1,7 ionisch“ sind Konventionen; der Übergang ist fließend.', 'Wasserstoffbrücken bestimmen die Basenpaarung der DNA und die Sekundärstruktur von Proteinen.'], pitfalls: ['Eine Wasserstoffbrücke ist keine kovalente Bindung, sondern eine deutlich schwächere Wechselwirkung.'] },
    terms: [
      { term: 'Elektronegativität', def: 'Fähigkeit eines Atoms, Bindungselektronen anzuziehen.', synonyms: ['EN'] },
      { term: 'Kovalente Bindung', def: 'Bindung durch gemeinsame Elektronenpaare.', synonyms: ['Atombindung', 'Elektronenpaarbindung'] },
      { term: 'Ionenbindung', def: 'Elektrostatische Bindung zwischen Ionen.' },
      { term: 'Wasserstoffbrückenbindung', def: 'Wechselwirkung zwischen H an elektronegativem Atom und freiem Elektronenpaar.', synonyms: ['Wasserstoffbrücke', 'H-Brücke'] },
      { term: 'Van-der-Waals-Kräfte', def: 'Schwache zwischenmolekulare Kräfte.', synonyms: ['Van-der-Waals-Wechselwirkung', 'London-Kräfte'] },
      { term: 'Dipol', def: 'Molekül mit getrennten Ladungsschwerpunkten.' },
      { term: 'Bindungswinkel', def: 'Winkel zwischen zwei Bindungen an einem Atom.' },
      { term: 'Molekülgeometrie', def: 'Räumliche Anordnung der Atome.', synonyms: ['VSEPR'] },
    ],
    structures: [], models: [], links: ['atommodell', 'molekuele'], sources: [{ id: 'atkins', locator: 'Kap. „Molecular structure“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'molekuele', module: 'molecule', title: 'Medizinisch relevante Moleküle', subtitle: '3D-Bibliothek und Moleküleditor', difficulty: 'grundlagen', prerequisites: ['bindungen'], view: 'molecules',
    objectives: ['Struktur- und Summenformeln wichtiger Biomoleküle lesen', 'funktionelle Gruppen erkennen und benennen', 'Struktur und biologische Funktion eines Moleküls verknüpfen'],
    overview: 'Biomoleküle lassen sich an ihren funktionellen Gruppen erkennen. Diese bestimmen Polarität, Ladung bei physiologischem pH und Reaktionsmöglichkeiten – und damit die biologische Rolle.',
    mechanism: [
      { title: 'Grundgerüst', text: 'Kohlenstoffketten oder -ringe bilden das Gerüst.' },
      { title: 'Funktionelle Gruppen', text: 'Hydroxy-, Carboxy-, Amino-, Phosphat-, Carbonylgruppen u. a. bestimmen die Eigenschaften.' },
      { title: 'Ladung bei pH 7,4', text: 'Carboxygruppen liegen überwiegend deprotoniert (−), Aminogruppen protoniert (+) vor.' },
    ],
    depth: { text: ['Die 3D-Strukturen dieser Bibliothek wurden aus SMILES mit RDKit erzeugt (ETKDGv3-Konformer, MMFF94-Optimierung). Sie zeigen eine mögliche energiearme Konformation, nicht die einzige.', 'Moleküle sind in der neutralen (protonierten) Form gespeichert; bei physiologischem pH liegen z. B. ATP und Aminosäuren geladen vor.'], pitfalls: ['ATP ist kein „Energiespeicher“ im Sinne eines Depots, sondern ein schnell umgesetzter Energieüberträger.'] },
    terms: [
      { term: 'Summenformel', def: 'Anzahl der Atome je Element.', synonyms: ['Molekülformel'] },
      { term: 'Strukturformel', def: 'Darstellung der Verknüpfung der Atome.' },
      { term: 'Funktionelle Gruppe', def: 'Atomgruppe, die die Eigenschaften eines Moleküls prägt.' },
      { term: 'ATP', def: 'Adenosintriphosphat, universeller Energieüberträger.', synonyms: ['Adenosintriphosphat'] },
      { term: 'Aminosäure', def: 'Baustein von Proteinen mit Amino- und Carboxygruppe.', synonyms: ['Aminosäuren'] },
      { term: 'Fettsäure', def: 'Carbonsäure mit langer Kohlenwasserstoffkette.', synonyms: ['Fettsäuren'] },
      { term: 'Nukleotid', def: 'Base + Zucker + Phosphat.', synonyms: ['Nukleotide'] },
    ],
    structures: [], models: [], links: ['bindungen', 'energiegewinnung', 'proteinbiosynthese'], sources: [{ id: 'rdkit' }, { id: 'stryer' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'saeure-base', module: 'molecule', title: 'Säuren, Basen und pH-Wert', subtitle: 'Protolyse, Puffer, Henderson-Hasselbalch', difficulty: 'vertiefung', prerequisites: ['bindungen'], view: 'acidbase',
    objectives: ['Säuren und Basen nach Brønsted definieren und konjugierte Paare benennen', 'pH und pOH für starke Säuren/Basen berechnen', 'mit der Henderson-Hasselbalch-Gleichung den pH eines Puffers berechnen und ihre Grenzen nennen', 'den Bikarbonatpuffer auf respiratorische Störungen anwenden'],
    overview: 'Säuren geben Protonen ab, Basen nehmen sie auf. Der pH-Wert ist der negative dekadische Logarithmus der H⁺-Konzentration. Puffer aus einer schwachen Säure und ihrer konjugierten Base dämpfen pH-Änderungen.',
    mechanism: [
      { title: 'Protolyse', text: 'HA + H₂O ⇌ H₃O⁺ + A⁻; die Stärke einer Säure beschreibt K_a bzw. pK_a.' },
      { title: 'Starke Säuren', text: 'Dissoziieren praktisch vollständig: pH = −log c.' },
      { title: 'Schwache Säuren', text: 'Dissoziieren nur teilweise; der pH hängt von K_a und c ab.' },
      { title: 'Puffer', text: 'Zugegebene H⁺ werden von A⁻, zugegebene OH⁻ von HA abgefangen. Am wirksamsten bei pH ≈ pK_a.' },
      { title: 'Blut', text: 'Wichtigster Puffer ist CO₂/HCO₃⁻; pCO₂ wird über die Atmung, HCO₃⁻ über die Niere reguliert.' },
    ],
    depth: { text: ['Henderson-Hasselbalch ist eine Näherung, die bei sehr verdünnten Lösungen und extremen Verhältnissen versagt, weil sie Wasser-Autoprotolyse und die Dissoziation selbst vernachlässigt. Für genaue Rechnungen müssten außerdem Aktivitäten statt Konzentrationen verwendet werden.'], equations: ['pH = −log₁₀[H₃O⁺]', 'pH + pOH = 14 (25 °C)', 'pH = pK_a + log₁₀([A⁻]/[HA])', 'pH = 6,1 + log₁₀([HCO₃⁻]/(0,0307·pCO₂))'], pitfalls: ['Eine starke Säure in sehr hoher Verdünnung macht Wasser nicht basisch: 10⁻⁸ M HCl hat pH ≈ 6,98, nicht 8.'] },
    terms: [
      { term: 'pH-Wert', def: 'Negativer dekadischer Logarithmus der H⁺-Aktivität.', synonyms: ['pH'] },
      { term: 'pOH-Wert', def: 'Negativer dekadischer Logarithmus der OH⁻-Konzentration.', synonyms: ['pOH'] },
      { term: 'Säure', def: 'Protonendonator (Brønsted).', synonyms: ['Protonendonator'] },
      { term: 'Base', def: 'Protonenakzeptor (Brønsted).', synonyms: ['Protonenakzeptor'] },
      { term: 'Konjugiertes Säure-Base-Paar', def: 'Säure und die durch Protonenabgabe entstehende Base.' },
      { term: 'Puffer', def: 'Lösung, die pH-Änderungen dämpft.', synonyms: ['Pufferlösung', 'Puffersystem'] },
      { term: 'Henderson-Hasselbalch-Gleichung', def: 'pH = pK_a + log([A⁻]/[HA]).' },
      { term: 'pKs-Wert', def: 'Negativer Logarithmus der Säurekonstante.', synonyms: ['pKa', 'pK_a', 'Säurekonstante'] },
    ],
    structures: [], models: ['saeure-base'], links: ['atmung', 'enzyme'], sources: [{ id: 'atkins' }, { id: 'boron', locator: 'Kap. „Acid-Base Physiology“' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'muskelphysiologie', module: 'physio', title: 'Muskelphysiologie', subtitle: 'Von der Erregung zur Kraft', difficulty: 'anwendung', prerequisites: ['ekk'], view: 'muscle',
    objectives: ['die Kette Nerv → Endplatte → Muskel-AP → Ca²⁺ → Kraft in ein zusammenhängendes Modell einordnen', 'Einzelzuckung, Summation und Tetanus unterscheiden', 'die Auswirkung von ATP-Mangel und reduzierter Ca²⁺-Freisetzung vorhersagen'],
    overview: 'PhysioSim verbindet die neuromuskuläre Übertragung mit der Kraftentwicklung. Die Kraft eines Muskels wird u. a. über die Reizfrequenz (Summation) und die Zahl aktiver motorischer Einheiten (Rekrutierung) abgestuft.',
    mechanism: [
      { title: 'Neuronale Erregung', text: 'Das Motoneuron bildet Aktionspotenziale.' },
      { title: 'Neuromuskuläre Übertragung', text: 'ACh erzeugt ein überschwelliges Endplattenpotenzial.' },
      { title: 'Muskelaktionspotenzial', text: 'Es breitet sich über Sarkolemm und T-Tubuli aus.' },
      { title: 'Ca²⁺-Freisetzung', text: 'DHPR–RyR1-Kopplung setzt Ca²⁺ aus dem SR frei.' },
      { title: 'Querbrückenzyklus', text: 'Kraftentwicklung, solange Ca²⁺ und ATP vorhanden sind.' },
      { title: 'Relaxation', text: 'SERCA senkt Ca²⁺; Tropomyosin blockiert wieder.' },
    ],
    depth: { text: ['Das Modell berechnet isometrische Kraft. Kraft-Längen- und Kraft-Geschwindigkeits-Beziehungen sind nicht enthalten.'], pitfalls: ['Ein Tetanus entsteht nicht durch stärkere Einzelreize, sondern durch hohe Reizfrequenz.'] },
    terms: [
      { term: 'Einzelzuckung', def: 'Kontraktion auf ein einzelnes Aktionspotenzial.' },
      { term: 'Summation', def: 'Überlagerung von Zuckungen bei rascher Reizfolge.', synonyms: ['Superposition'] },
      { term: 'Motorische Einheit', def: 'Motoneuron mit allen von ihm innervierten Muskelfasern.' },
      { term: 'Rekrutierung', def: 'Zuschaltung weiterer motorischer Einheiten.' },
    ],
    structures: ['sarcolemma', 'ttubule', 'sr', 'actin', 'myosin', 'troponin', 'tropomyosin'], models: ['endplatte', 'querbrueckenzyklus'], links: ['endplatte', 'ekk'],
    sources: [{ id: 'guyton', locator: 'Kap. „Contraction of Skeletal Muscle“' }, { id: 'huxley1957' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'kreislauf', module: 'physio', title: 'Kreislaufphysiologie', subtitle: 'Druck, Fluss und Widerstand', difficulty: 'vertiefung', prerequisites: [], view: 'circulation',
    objectives: ['das Herzzeitvolumen aus Herzfrequenz und Schlagvolumen berechnen', 'den Zusammenhang ΔP = HZV·TPR anwenden', 'die r⁴-Abhängigkeit des Widerstands erklären und anwenden', 'die Windkesselfunktion der Aorta beschreiben', 'die Grenzen eines Modells ohne Regulation benennen'],
    overview: 'Der Blutfluss durch den Kreislauf folgt einem „ohmschen Gesetz“: Fluss = Druckdifferenz / Widerstand. Der Widerstand wird vor allem in den Arteriolen über den Gefäßradius gesteuert.',
    mechanism: [
      { title: 'Herzzeitvolumen', text: 'HZV = HF · SV (Ruhe ≈ 5 l/min).' },
      { title: 'Widerstand', text: 'Nach Hagen-Poiseuille steigt der Widerstand mit Viskosität und Länge und fällt mit der vierten Potenz des Radius.' },
      { title: 'Parallelschaltung', text: 'Organe liegen parallel; ihr Gesamtwiderstand ist kleiner als jeder Einzelwiderstand.' },
      { title: 'Blutdruck', text: 'MAD − ZVD = HZV · TPR.' },
      { title: 'Windkessel', text: 'Die elastische Aorta speichert in der Systole Volumen und hält den Fluss in der Diastole aufrecht.' },
    ],
    depth: { text: ['Im Körper wird der Blutdruck reflektorisch geregelt (Baroreflex). Das Modell zeigt nur die unmittelbare physikalische Beziehung – eine Vasodilatation senkt hier den Druck, während im Körper Gegenregulation einsetzt.'], equations: ['HZV = HF · SV', 'ΔP = HZV · TPR', 'R = 8ηL/(πr⁴)'], pitfalls: ['Hagen-Poiseuille gilt streng nur für laminare Strömung in starren Röhren mit newtonscher Flüssigkeit – Blut erfüllt das nur näherungsweise.'] },
    terms: [
      { term: 'Herzzeitvolumen', def: 'Pro Minute ausgeworfenes Blutvolumen.', synonyms: ['HZV', 'Herzminutenvolumen', 'Cardiac Output'] },
      { term: 'Schlagvolumen', def: 'Pro Herzschlag ausgeworfenes Volumen.', synonyms: ['SV'] },
      { term: 'Totaler peripherer Widerstand', def: 'Gesamtwiderstand des großen Kreislaufs.', synonyms: ['TPR', 'peripherer Widerstand'] },
      { term: 'Mittlerer arterieller Druck', def: 'Zeitlicher Mittelwert des arteriellen Drucks.', synonyms: ['MAD', 'MAP'] },
      { term: 'Hagen-Poiseuille-Gesetz', def: 'Beziehung zwischen Fluss, Druck, Radius, Länge und Viskosität.', synonyms: ['Poiseuille'] },
      { term: 'Windkesselfunktion', def: 'Glättung des Blutflusses durch elastische Arterien.', synonyms: ['Windkessel'] },
      { term: 'Compliance', def: 'Volumendehnbarkeit: ΔV/ΔP.' },
    ],
    structures: [], models: ['kreislauf'], links: ['atmung'], sources: [{ id: 'guyton', locator: 'Kap. „Overview of the Circulation“' }, { id: 'windkessel' }], status: S, origin: 'redaktionell',
  },
  {
    id: 'atmung', module: 'physio', title: 'Atmungsphysiologie', subtitle: 'Ventilation, Gasaustausch, O₂-Transport', difficulty: 'vertiefung', prerequisites: [], view: 'respiration',
    objectives: ['alveoläre Ventilation von Atemminutenvolumen unterscheiden', 'mit der alveolären CO₂-Gleichung die Folgen von Hypo- und Hyperventilation berechnen', 'die O₂-Bindungskurve interpretieren', 'den Zusammenhang Ventilation – pCO₂ – pH erklären'],
    overview: 'Nur der Teil der Ventilation, der die Alveolen erreicht, trägt zum Gasaustausch bei. Der alveoläre pCO₂ ist umgekehrt proportional zur alveolären Ventilation; über den Bikarbonatpuffer beeinflusst er unmittelbar den pH.',
    mechanism: [
      { title: 'Ventilation', text: 'V̇_E = f·V_T; davon erreicht V̇_A = f·(V_T − V_D) die Alveolen.' },
      { title: 'Gasaustausch', text: 'O₂ und CO₂ diffundieren entlang ihrer Partialdruckgradienten durch die Blut-Luft-Schranke (Fick).' },
      { title: 'O₂-Transport', text: 'Fast der gesamte O₂ ist an Hämoglobin gebunden; die Bindungskurve ist sigmoid.' },
      { title: 'CO₂-Transport', text: 'CO₂ wird überwiegend als HCO₃⁻, außerdem carbaminogebunden und gelöst transportiert.' },
      { title: 'Säure-Basen-Kopplung', text: 'Hypoventilation → pCO₂ ↑ → pH ↓ (respiratorische Azidose).' },
    ],
    depth: { text: ['Die alveoläre Gasgleichung verknüpft P_AO₂ mit dem inspiratorischen pO₂ und dem pCO₂. Ventilations-Perfusions-Verhältnisse sind regional unterschiedlich; im Modell sind sie nur pauschal über die AaDO₂ enthalten.'], equations: ['P_ACO₂ = 0,863·V̇CO₂/V̇_A', 'P_AO₂ = F_IO₂·(P_B − 47) − P_ACO₂/RQ', 'C_aO₂ = 1,34·Hb·S_O₂ + 0,003·P_aO₂'], pitfalls: ['Eine erhöhte Atemfrequenz mit sehr kleinem Atemzugvolumen steigert vor allem die Totraumventilation.'] },
    terms: [
      { term: 'Alveoläre Ventilation', def: 'Pro Minute die Alveolen erreichendes Volumen.', synonyms: ['V̇A'] },
      { term: 'Totraum', def: 'Nicht am Gasaustausch beteiligtes Volumen.', synonyms: ['Totraumvolumen', 'anatomischer Totraum'] },
      { term: 'Partialdruck', def: 'Anteil eines Gases am Gesamtdruck.' },
      { term: 'O₂-Bindungskurve', def: 'Sättigung von Hämoglobin in Abhängigkeit vom pO₂.', synonyms: ['Sauerstoffbindungskurve', 'Sauerstoffdissoziationskurve'] },
      { term: 'Gasaustausch', def: 'Diffusion von O₂ und CO₂ zwischen Alveole und Blut.' },
      { term: 'Hypoventilation', def: 'Für den Stoffwechsel zu geringe alveoläre Ventilation.' },
      { term: 'Hämoglobin', def: 'O₂-Transportprotein der Erythrozyten.', synonyms: ['Hb'] },
    ],
    structures: [], models: ['atmung'], links: ['saeure-base', 'kreislauf'], sources: [{ id: 'west' }, { id: 'severinghaus' }], status: S, origin: 'redaktionell',
  },
];

// ---------------------------------------------------------------------------
// Molekülbibliothek (Strukturdaten aus RDKit, Texte redaktionell)
// ---------------------------------------------------------------------------

export interface MolAtom { el: string; q: number; arom: boolean; xyz: [number, number, number] }
export interface Molecule {
  id: string; name: string; group: string; smiles: string; formula: string; displayFormula: string; mw: number; charge: number; cip: string[];
  functionalGroups: string[]; atoms: MolAtom[]; bonds: [number, number, number][]; validation: string; properties: string; significance: string;
}

const DISPLAY: Record<string, string> = { ammoniak: 'NH₃', hydrogencarbonat: 'HCO₃⁻', hydrogenphosphat: 'HPO₄²⁻', harnstoff: 'CH₄N₂O (CO(NH₂)₂)', essigsaeure: 'C₂H₄O₂ (CH₃COOH)' };
const FG_OVERRIDE: Record<string, string[]> = { hydrogencarbonat: ['Hydrogencarbonat-Anion (Salz der Kohlensäure)'], hydrogenphosphat: ['Hydrogenphosphat-Anion'], histidin: ['Carboxygruppe', 'Aminogruppe', 'Imidazolring (aromatisch)'], desoxyribose: ['Hydroxygruppe', 'Aldehyd (offenkettige Form)'] };

const TEXT: Record<string, [string, string]> = {
  wasser: ['Gewinkelt (≈ 104,5°), stark polar, Wasserstoffbrücken; hohe Wärmekapazität.', 'Lösungsmittel des Lebens; ca. 60 % der Körpermasse eines Erwachsenen (Größenordnung).'],
  sauerstoff: ['Unpolares, kleines Molekül; diffundiert durch Membranen.', 'Terminaler Elektronenakzeptor der Atmungskette (Komplex IV).'],
  kohlendioxid: ['Linear; Bindungsdipole heben sich auf → unpolar.', 'Endprodukt der Oxidation; Transport im Blut überwiegend als HCO₃⁻; Säure-Basen-Haushalt.'],
  ammoniak: ['Trigonal-pyramidal, basisch (nimmt H⁺ auf → NH₄⁺).', 'Entsteht beim Aminosäureabbau; toxisch, wird in der Leber zu Harnstoff umgesetzt.'],
  methan: ['Tetraedrisch (109,5°), unpolar.', 'Lehrbeispiel für sp³-Hybridisierung und Tetraedergeometrie.'],
  harnstoff: ['Polar, gut wasserlöslich, membrangängig.', 'Hauptausscheidungsform von Stickstoff; Harnstoffzyklus in der Leber.'],
  essigsaeure: ['Schwache Säure, pK_a ≈ 4,76.', 'Lehrbeispiel für schwache Säuren und Puffer; Acetyl-Rest in Acetyl-CoA.'],
  hydrogencarbonat: ['Amphoteres Anion; konjugierte Base der Kohlensäure.', 'Wichtigster Puffer im Blut (≈ 24 mmol/l).'],
  hydrogenphosphat: ['Konjugierte Base von H₂PO₄⁻ (pK_a ≈ 7,2).', 'Intrazellulärer und renaler Puffer; Baustein von ATP und Nukleinsäuren.'],
  laktat: ['Hydroxycarbonsäure; bei pH 7,4 als Laktat-Anion.', 'Produkt der anaeroben Glykolyse; Substrat der Glukoneogenese (Cori-Zyklus).'],
  glukose: ['Aldohexose; in Lösung überwiegend als Pyranosering, hier die β-Form.', 'Zentrales Energiesubstrat; Blutglukose wird hormonell geregelt.'],
  pyruvat: ['α-Ketocarbonsäure; bei pH 7,4 als Pyruvat-Anion.', 'Endprodukt der Glykolyse; Verzweigungspunkt zu Acetyl-CoA, Laktat, Oxalacetat und Alanin.'],
  atp: ['Nukleotid mit drei Phosphatgruppen; Phosphorsäureanhydridbindungen.', 'Universeller Energieüberträger; Substrat von Kinasen; Mg²⁺-Komplex als eigentliches Substrat.'],
  adp: ['Nukleotid mit zwei Phosphatgruppen.', 'Produkt der ATP-Hydrolyse; Substrat der ATP-Synthase.'],
  amp: ['Nukleotid mit einer Phosphatgruppe.', 'Energiestatus-Signal (z. B. AMPK); Baustein der RNA.'],
  adenin: ['Purinbase.', 'Paart mit Thymin (DNA) bzw. Uracil (RNA); Teil von ATP, NAD⁺, FAD, CoA.'],
  guanin: ['Purinbase.', 'Paart mit Cytosin über drei Wasserstoffbrücken.'],
  cytosin: ['Pyrimidinbase.', 'Paart mit Guanin; Methylierung an CpG-Stellen reguliert Genexpression.'],
  thymin: ['Pyrimidinbase (5-Methyluracil).', 'Nur in DNA; paart mit Adenin.'],
  uracil: ['Pyrimidinbase.', 'Ersetzt Thymin in der RNA.'],
  glycin: ['Kleinste Aminosäure, nicht chiral.', 'Häufig in Kollagen; inhibitorischer Neurotransmitter im Rückenmark.'],
  alanin: ['Unpolare Seitenkette (Methyl); L-Form (S).', 'Transport von Aminostickstoff zur Leber (Glukose-Alanin-Zyklus).'],
  cystein: ['Thiolgruppe; L-Cystein ist nach CIP (R).', 'Bildet Disulfidbrücken; Teil von Glutathion.'],
  tyrosin: ['Aromatisch, phenolische OH-Gruppe.', 'Vorstufe von Dopamin, Noradrenalin, Adrenalin und Schilddrüsenhormonen.'],
  lysin: ['Basische Seitenkette (bei pH 7,4 positiv).', 'Essenzielle Aminosäure; häufig Ort posttranslationaler Modifikationen.'],
  glutamat: ['Saure Seitenkette (bei pH 7,4 negativ).', 'Wichtigster erregender Neurotransmitter im ZNS; zentral im Aminosäurestoffwechsel.'],
  palmitinsaeure: ['Gesättigte C16-Fettsäure; gestreckte Kette.', 'Häufigste gesättigte Fettsäure; Endprodukt der Fettsäuresynthese.'],
  oelsaeure: ['Einfach ungesättigt, cis-Doppelbindung bewirkt einen Knick.', 'Knicke stören die dichte Packung → beeinflusst Membranfluidität.'],
  acetylcholin: ['Ester mit quartärem Ammonium (dauerhaft positiv).', 'Transmitter an Endplatte, vegetativen Ganglien und Parasympathikus; Abbau durch AChE.'],
  gaba: ['γ-Aminosäure, bei pH 7,4 zwitterionisch.', 'Wichtigster hemmender Neurotransmitter im Gehirn (GABA_A/GABA_B).'],
  dopamin: ['Catecholamin (Brenzcatechin + Ethylamin).', 'Neurotransmitter (u. a. Motorik, Belohnungssystem); Vorstufe von Noradrenalin.'],
  noradrenalin: ['Catecholamin mit β-Hydroxygruppe; natürliches Enantiomer (R).', 'Transmitter des Sympathikus und im ZNS.'],
  serotonin: ['Indolamin (5-Hydroxytryptamin).', 'Neurotransmitter und Gewebshormon (z. B. Thrombozyten, Darm).'],
  natrium: ['Einfach positives Kation.', 'Hauptkation des Extrazellulärraums; Aktionspotenzial, sekundär aktiver Transport.'],
  kalium: ['Einfach positives Kation.', 'Hauptkation des Intrazellulärraums; bestimmt das Ruhemembranpotenzial.'],
  calcium: ['Zweifach positives Kation.', 'Signalion (Transmitterfreisetzung, Muskelkontraktion), Knochenmineral, Gerinnung.'],
  chlorid: ['Einfach negatives Anion.', 'Hauptanion des Extrazellulärraums; GABA_A- und Glycinrezeptoren.'],
  magnesium: ['Zweifach positives Kation.', 'Cofaktor vieler Enzyme, v. a. als Mg-ATP-Komplex.'],
  glukose_alpha: ['α-Anomer: OH am C1 axial, auf der anderen Seite als die CH₂OH-Gruppe (Haworth: nach unten).', 'α-1,4-glykosidisch verknüpft im Glykogen und in der Stärke; in Lösung stellt sich zwischen α- und β-Form ein Gleichgewicht ein (Mutarotation).'],
  galaktose: ['Aldohexose; C4-Epimer der Glucose (nur die OH-Gruppe an C4 steht anders).', 'Bestandteil der Laktose (Milchzucker); Galaktosämie bei Enzymdefekten des Abbaus.'],
  fruktose: ['Ketohexose; hier als Fünfring (Furanose).', 'Gleiche Summenformel wie Glucose (Konstitutionsisomer); Bestandteil der Saccharose, wird v. a. in der Leber verstoffwechselt.'],
  ribose: ['Aldopentose als Fünfring (Furanose).', 'Zucker der RNA, von ATP, NAD⁺ und Coenzym A.'],
  desoxyribose: ['Aldopentose ohne OH-Gruppe an C2 (hier offenkettig gezeigt).', 'Zucker der DNA; das fehlende 2′-OH macht DNA chemisch stabiler als RNA.'],
  glycerin: ['Dreiwertiger Alkohol, gut wasserlöslich.', 'Grundgerüst der Triacylglycerine und Glycerophospholipide.'],
  tripalmitin: ['Triester aus Glycerin und drei Fettsäuren; unpolar, wasserunlöslich.', 'Speicherfett (Triacylglycerin) im Fettgewebe – energiereichster Speicher des Körpers.'],
  phosphatidylcholin: ['Amphiphil: polarer Kopf (Phosphat + Cholin), zwei unpolare Fettsäurereste.', 'Häufigstes Phospholipid der Zellmembranen; Dipalmitoyl-Form ist Hauptbestandteil des Surfactants der Lunge.'],
  cholesterin: ['Steroid mit vier Ringen und einer OH-Gruppe; überwiegend unpolar.', 'Membranbestandteil (reguliert Fluidität), Vorstufe von Gallensäuren, Steroidhormonen und Vitamin D.'],
  elaidinsaeure: ['trans-Isomer der Ölsäure: gestreckte Kette wie bei gesättigten Fettsäuren.', 'Typische trans-Fettsäure (u. a. aus teilgehärteten Fetten); cis/trans-Isomerie am Beispiel.'],
  linolsaeure: ['Zweifach ungesättigt (ω-6), beide Doppelbindungen cis.', 'Essenzielle Fettsäure: Der Mensch kann keine Doppelbindungen jenseits von C9 einführen.'],
  d_alanin: ['Spiegelbild (Enantiomer) von L-Alanin: (R)-Konfiguration.', 'In menschlichen Proteinen kommt nur die L-Form vor; D-Alanin findet sich z. B. im Peptidoglykan der Bakterienzellwand.'],
  serin: ['Polare, ungeladene Seitenkette mit OH-Gruppe.', 'Häufige Phosphorylierungsstelle (Signalwege); im aktiven Zentrum der Serinproteasen.'],
  phenylalanin: ['Aromatische, unpolare Seitenkette.', 'Essenziell; wird zu Tyrosin hydroxyliert. Bei Phenylketonurie ist dieser Schritt gestört.'],
  tryptophan: ['Aromatisch mit Indolring; größte Seitenkette.', 'Essenziell; Vorstufe von Serotonin, Melatonin und Niacin.'],
  histidin: ['Imidazol-Seitenkette mit pK_a ≈ 6: kann bei physiologischem pH Protonen aufnehmen und abgeben.', 'Puffer in Proteinen (z. B. Hämoglobin); oft im aktiven Zentrum von Enzymen. Vorstufe von Histamin.'],
  aspartat: ['Saure Seitenkette (bei pH 7,4 negativ geladen).', 'Harnstoffzyklus, Malat-Aspartat-Shuttle, Transaminierung.'],
  glycylalanin: ['Kleinstes Beispiel einer Peptidbindung (Amidbindung zwischen –COOH und –NH₂).', 'Die Peptidbindung ist planar und hat partiellen Doppelbindungscharakter – Grundlage der Proteinstruktur.'],
  d_laktat: ['(R)-Enantiomer der Milchsäure.', 'Beim Menschen entsteht fast nur L-Laktat; D-Laktat stammt v. a. aus bakterieller Gärung im Darm.'],
  citrat: ['Dreiwertige Carbonsäure (Tricarbonsäure) mit OH-Gruppe.', 'Namensgeber des Citratzyklus; bindet Ca²⁺ und wird deshalb als Gerinnungshemmer in Blutröhrchen verwendet.'],
  acetoacetat: ['β-Ketosäure.', 'Ketonkörper: Bei Insulinmangel oder langem Fasten in der Leber gebildet; Energiequelle für Gehirn und Muskel.'],
  hydroxybutyrat: ['β-Hydroxycarbonsäure, (R)-Konfiguration.', 'Mengenmäßig wichtigster Ketonkörper im Blut (Ketoazidose).'],
  ethanol: ['Primärer Alkohol: OH-Gruppe an einem C mit nur einem C-Nachbarn.', 'Wird über Acetaldehyd zu Acetat oxidiert (Alkoholdehydrogenase, Aldehyddehydrogenase).'],
  dimethylether: ['Ether: O zwischen zwei C-Atomen, keine OH-Gruppe → keine Wasserstoffbrücken untereinander.', 'Konstitutionsisomer von Ethanol (beide C₂H₆O) – gleiche Summenformel, ganz andere Eigenschaften (Gas bei Raumtemperatur).'],
  acetaldehyd: ['Aldehyd: Carbonylgruppe am Kettenende.', 'Giftiges Zwischenprodukt des Alkoholabbaus („Kater“).'],
  aceton: ['Einfachstes Keton: Carbonylgruppe in der Kette.', 'Entsteht aus Acetoacetat; fruchtiger Atemgeruch bei Ketoazidose.'],
  edta: ['Sechszähniger Chelatligand (2 N, 4 Carboxylatgruppen).', 'Bildet sehr stabile Komplexe mit Ca²⁺ – als Gerinnungshemmer in Blutröhrchen (EDTA-Blut) und zur Therapie von Schwermetallvergiftungen.'],
};

export const MOLECULES: Molecule[] = (raw as any[]).map((m) => ({
  ...m,
  displayFormula: DISPLAY[m.id] ?? toSub(m.formula),
  functionalGroups: FG_OVERRIDE[m.id] ?? m.functionalGroups,
  properties: TEXT[m.id]?.[0] ?? '',
  significance: TEXT[m.id]?.[1] ?? '',
}));

export function toSub(f: string) {
  const sub = '₀₁₂₃₄₅₆₇₈₉';
  let s = f.replace(/([A-Za-z\)])(\d+)/g, (_, a, d) => a + d.split('').map((c: string) => sub[+c]).join(''));
  s = s.replace(/\+(\d)$/, (_, d) => ({ '2': '²⁺', '3': '³⁺' })[d as '2'] ?? '⁺').replace(/-(\d)$/, (_, d) => ({ '2': '²⁻', '3': '³⁻' })[d as '2'] ?? '⁻');
  s = s.replace(/\+$/, '⁺').replace(/-$/, '⁻');
  return s;
}
