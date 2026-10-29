import type { Lesson } from './types';

// Ergänzungen 1. Semester nach dem Abgleich mit dem Lastenheft:
// Physik (Größen und Bewegung, Arbeit/Energie/Leistung, Dichte und Druck), Chemie (Periodensystem, Reaktionsgleichungen und Stöchiometrie),
// Histologie (Mikroskopie und Präparate).

const S = 'zu_pruefen' as const;
const H = (locator: string) => ({ id: 'harten', locator });
const Z = (locator: string) => ({ id: 'zeeck', locator });
const L = (locator: string) => ({ id: 'luellmann', locator });

export const PHYS2_LESSONS: Lesson[] = [
  {
    id: 'groessen-bewegung', module: 'physics', title: 'Größen, Einheiten und Bewegung', subtitle: 'SI-Einheiten, Umrechnen, Skalare und Vektoren, Geschwindigkeit und Beschleunigung', difficulty: 'grundlagen', prerequisites: [], view: 'motion',
    objectives: [
      'die SI-Basiseinheiten nennen und Einheiten mit Vorsätzen umrechnen',
      'skalare und vektorielle Größen unterscheiden und Vektoren addieren',
      'Geschwindigkeit und Beschleunigung aus Weg, Zeit und Geschwindigkeitsänderung berechnen',
    ],
    overview: 'Jede physikalische Größe besteht aus Zahlenwert und Einheit – „3,5“ allein ist keine Antwort. Wer Einheiten sicher umrechnet, vermeidet die meisten Rechenfehler in Physik und Chemie.',
    mechanism: [
      { title: 'SI-Basiseinheiten', text: 'Länge Meter (m), Masse Kilogramm (kg), Zeit Sekunde (s), Stromstärke Ampere (A), Temperatur Kelvin (K), Stoffmenge Mol (mol), Lichtstärke Candela (cd). Alle anderen Einheiten sind daraus abgeleitet.' },
      { title: 'Abgeleitete Einheiten', text: 'Newton N = kg·m/s², Pascal Pa = N/m², Joule J = N·m, Watt W = J/s, Volt V = W/A, Ohm Ω = V/A.' },
      { title: 'Vorsätze', text: 'G = 10⁹, M = 10⁶, k = 10³, h = 10², d = 10⁻¹, c = 10⁻², m = 10⁻³, µ = 10⁻⁶, n = 10⁻⁹, p = 10⁻¹². Bei Flächen und Volumina wird der Vorsatz mitpotenziert: 1 cm² = 10⁻⁴ m², 1 cm³ = 10⁻⁶ m³ = 1 ml.' },
      { title: 'Skalare und Vektoren', text: 'Skalare haben nur einen Betrag (Masse, Temperatur, Energie, Zeit). Vektoren haben Betrag und Richtung (Kraft, Geschwindigkeit, Beschleunigung) und werden geometrisch addiert.' },
      { title: 'Bewegung', text: 'Geschwindigkeit v = Δs / Δt (Einheit m/s; 1 m/s = 3,6 km/h). Beschleunigung a = Δv / Δt (Einheit m/s²). Die Fallbeschleunigung an der Erdoberfläche beträgt g ≈ 9,81 m/s².' },
    ],
    depth: {
      text: [
        'Vektoren, die im rechten Winkel zueinander stehen, addiert man mit dem Satz des Pythagoras: |a + b| = √(a² + b²). Zeigen zwei Kräfte in dieselbe Richtung, addieren sich die Beträge; zeigen sie gegeneinander, subtrahieren sie sich.',
        'Einheitenkontrolle als Probe: Setzt man in eine Formel nur die Einheiten ein, muss die Einheit des Ergebnisses herauskommen. Für v = s/t: m / s = m/s.',
        '1 Liter = 1 dm³ = 10⁻³ m³; 1 ml = 1 cm³. In der Medizin sind die Einheiten l, ml und µl üblich, im SI-System wird mit m³ gerechnet.',
      ],
      equations: ['v = Δs / Δt', 'a = Δv / Δt', '1 m/s = 3,6 km/h'],
      pitfalls: ['km/h in m/s: durch 3,6 teilen, nicht multiplizieren.', 'cm² in m²: mal 10⁻⁴, nicht 10⁻².', 'Masse (kg) und Gewichtskraft (N) sind verschiedene Größen.'],
    },
    terms: [
      { term: 'SI-Einheiten', def: 'Internationales Einheitensystem mit sieben Basiseinheiten.', synonyms: ['SI-Basiseinheit'] },
      { term: 'Skalar', def: 'Größe, die nur durch einen Betrag bestimmt ist, z. B. Masse oder Energie.' },
      { term: 'Vektor', def: 'Größe mit Betrag und Richtung, z. B. Kraft oder Geschwindigkeit.' },
      { term: 'Geschwindigkeit', def: 'Zurückgelegter Weg pro Zeit, v = Δs/Δt.' },
      { term: 'Beschleunigung', def: 'Änderung der Geschwindigkeit pro Zeit, a = Δv/Δt.' },
    ],
    structures: [], models: [], links: ['mechanik', 'energie-leistung', 'druck-dichte'], sources: [{ id: 'bipm', locator: 'Kap. 2–3 (Basis- und abgeleitete Einheiten, Vorsätze)' }, H('Kap. Grundlagen: Größen und Einheiten; Mechanik')], status: S, origin: 'redaktionell',
  },
  {
    id: 'energie-leistung', module: 'physics', title: 'Arbeit, Energie und Leistung', subtitle: 'Hubarbeit, Energieerhaltung, Wirkungsgrad und Energieumsatz des Körpers', difficulty: 'grundlagen', prerequisites: ['groessen-bewegung', 'mechanik'], view: 'work',
    objectives: [
      'Arbeit als Kraft mal Weg berechnen und die Hubarbeit bestimmen',
      'kinetische und potentielle Energie berechnen und den Energieerhaltungssatz anwenden',
      'Leistung und Wirkungsgrad berechnen und Energieeinheiten (J, kWh, kcal) umrechnen',
    ],
    overview: 'Arbeit wird verrichtet, wenn eine Kraft einen Körper entlang eines Weges bewegt. Energie ist die Fähigkeit, Arbeit zu verrichten, und Leistung sagt, wie schnell das geschieht. Auch der Körper unterliegt diesen Gesetzen: Wer Treppen steigt, wandelt chemische Energie in Hubarbeit und vor allem in Wärme um.',
    mechanism: [
      { title: 'Arbeit', text: 'W = F · s, wenn Kraft und Weg in dieselbe Richtung zeigen. Einheit Joule: 1 J = 1 N · m. Hubarbeit beim Anheben: W = m · g · h.' },
      { title: 'Energieformen', text: 'Potentielle Energie (Lageenergie) E_pot = m · g · h, kinetische Energie (Bewegungsenergie) E_kin = ½ · m · v². Daneben chemische, elektrische und thermische Energie.' },
      { title: 'Energieerhaltung', text: 'In einem abgeschlossenen System bleibt die Gesamtenergie erhalten; sie wird nur umgewandelt. Beim freien Fall wird Lageenergie in Bewegungsenergie umgewandelt.' },
      { title: 'Leistung', text: 'P = W / t = ΔE / Δt, Einheit Watt: 1 W = 1 J/s.' },
      { title: 'Wirkungsgrad', text: 'η = Nutzleistung / zugeführte Leistung. Der arbeitende Skelettmuskel erreicht höchstens etwa 25 %; der Rest wird zu Wärme – deshalb wird einem bei Anstrengung warm.' },
    ],
    depth: {
      text: [
        'Umrechnungen: 1 kcal = 4,184 kJ; 1 kWh = 3,6 MJ; 1 W·s = 1 J. Nährwertangaben stehen in kJ und kcal.',
        'Der Energieumsatz eines Erwachsenen in Ruhe liegt in der Größenordnung von rund 7 MJ pro Tag; das entspricht einer mittleren Leistung von etwa 80 W.',
        'Hält man eine Last nur fest, wird im physikalischen Sinn keine Arbeit verrichtet (s = 0) – der Muskel verbraucht trotzdem Energie, weil Querbrücken ständig neu gebildet werden müssen.',
      ],
      equations: ['W = F · s', 'E_pot = m · g · h', 'E_kin = ½ · m · v²', 'P = W / t', 'η = P_nutz / P_zu'],
      pitfalls: ['Bei E_kin wird v quadriert: doppelte Geschwindigkeit, vierfache Energie.', 'Leistung ist nicht dasselbe wie Energie: kW ist Leistung, kWh ist Energie.', 'Bei W = F·s zählt nur der Kraftanteil in Wegrichtung.'],
    },
    terms: [
      { term: 'Arbeit', def: 'Produkt aus Kraft und Weg in Kraftrichtung, Einheit Joule.', synonyms: ['Hubarbeit'] },
      { term: 'Energie', def: 'Fähigkeit, Arbeit zu verrichten; bleibt in einem abgeschlossenen System erhalten.', synonyms: ['Energieerhaltung'] },
      { term: 'Kinetische Energie', def: 'Bewegungsenergie, E = ½·m·v².' },
      { term: 'Potentielle Energie', def: 'Lageenergie im Schwerefeld, E = m·g·h.' },
      { term: 'Leistung', def: 'Arbeit pro Zeit, Einheit Watt (J/s).' },
      { term: 'Wirkungsgrad', def: 'Verhältnis von genutzter zu zugeführter Energie bzw. Leistung.' },
    ],
    structures: [], models: [], links: ['mechanik', 'energiegewinnung', 'groessen-bewegung'], sources: [H('Kap. Mechanik: Arbeit, Energie, Leistung')], status: S, origin: 'redaktionell',
  },
  {
    id: 'druck-dichte', module: 'physics', title: 'Dichte und Druck', subtitle: 'Druckeinheiten, hydrostatischer Druck und Blutdruck in verschiedenen Körperlagen', difficulty: 'grundlagen', prerequisites: ['groessen-bewegung'], view: 'pressure',
    objectives: [
      'Dichte und Druck mit Einheiten definieren und Druckeinheiten (Pa, kPa, mmHg, cmH₂O, bar) umrechnen',
      'den hydrostatischen Druck einer Flüssigkeitssäule berechnen',
      'den Einfluss der Körperlage auf die Blutdruckwerte mit dem hydrostatischen Druck erklären',
    ],
    overview: 'Druck ist Kraft pro Fläche. In Flüssigkeiten kommt ein Druck hinzu, der nur von der Höhe der darüber stehenden Säule abhängt – deshalb ist der Blutdruck in den Füßen eines stehenden Menschen höher als im Kopf und eine Infusion läuft nur, wenn der Beutel hoch genug hängt.',
    mechanism: [
      { title: 'Dichte', text: 'ρ = m / V, Einheit kg/m³ oder g/cm³. Wasser ≈ 1,00 g/cm³ (1000 kg/m³), Blut ≈ 1,05–1,06 g/cm³.' },
      { title: 'Druck', text: 'p = F / A, Einheit Pascal: 1 Pa = 1 N/m². 1 kPa = 1000 Pa, 1 bar = 10⁵ Pa. Der Luftdruck auf Meereshöhe beträgt etwa 1013 hPa.' },
      { title: 'Medizinische Druckeinheiten', text: '1 mmHg ≈ 133,3 Pa (also 7,5 mmHg ≈ 1 kPa), 1 cmH₂O ≈ 98,1 Pa. Blutdruck wird in mmHg, der zentrale Venendruck oft in cmH₂O angegeben – jeweils als Überdruck gegenüber dem Luftdruck.' },
      { title: 'Hydrostatischer Druck', text: 'p = ρ · g · h. Er hängt nur von Dichte und Höhe der Säule ab, nicht von der Form des Gefäßes. 10 m Wassersäule erzeugen etwa 1 bar.' },
      { title: 'Pascalsches Prinzip', text: 'Ein von außen ausgeübter Druck breitet sich in einer ruhenden Flüssigkeit nach allen Seiten gleichmäßig aus.' },
    ],
    depth: {
      text: [
        'Medizinischer Bezug (Ergänzung zum Physikstoff): Beim stehenden Menschen kommt zum Druck, den das Herz erzeugt, unterhalb des Herzens der hydrostatische Druck der Blutsäule hinzu, oberhalb wird er abgezogen. Am Fuß liegt der arterielle Druck deshalb um rund 90 mmHg höher als auf Herzhöhe. Darum misst man den Blutdruck am Oberarm auf Herzhöhe.',
        'Eine Infusion fließt, wenn der hydrostatische Druck der Flüssigkeitssäule größer ist als der Druck in der Vene. Pro 10 cm Höhe gewinnt man etwa 10 cmH₂O ≈ 7,4 mmHg.',
        'Auftrieb: Ein eingetauchter Körper erfährt eine Auftriebskraft, die der Gewichtskraft der verdrängten Flüssigkeit entspricht (Archimedes).',
      ],
      equations: ['ρ = m / V', 'p = F / A', 'p = ρ · g · h', '1 mmHg ≈ 133,3 Pa', '1 cmH₂O ≈ 98,1 Pa'],
      pitfalls: ['Höhe in Metern einsetzen, nicht in Zentimetern.', 'Dichte in kg/m³ einsetzen, damit Pa herauskommt.', 'Blutdruckwerte sind Überdrücke relativ zum Luftdruck, keine Absolutdrücke.'],
    },
    terms: [
      { term: 'Dichte', def: 'Masse pro Volumen, ρ = m/V.' },
      { term: 'Druck', def: 'Kraft pro Fläche, p = F/A, Einheit Pascal.', synonyms: ['Pascal'] },
      { term: 'Hydrostatischer Druck', def: 'Druck einer ruhenden Flüssigkeitssäule, p = ρ·g·h.', synonyms: ['Schweredruck'] },
      { term: 'mmHg', def: 'Millimeter Quecksilbersäule; 1 mmHg ≈ 133,3 Pa.', synonyms: ['Millimeter Quecksilbersäule', 'Torr'] },
      { term: 'cmH₂O', def: 'Zentimeter Wassersäule; 1 cmH₂O ≈ 98,1 Pa.', synonyms: ['Zentimeter Wassersäule'] },
    ],
    structures: [], models: [], links: ['stroemung', 'kreislauf', 'groessen-bewegung'], sources: [H('Kap. Mechanik der Flüssigkeiten: Druck, Hydrostatik'), { id: 'guyton', locator: 'Kap. 15 (Effect of hydrostatic pressure on venous pressure)' }], status: S, origin: 'redaktionell',
  },
];

export const CHEM2_LESSONS: Lesson[] = [
  {
    id: 'periodensystem', module: 'molecule', title: 'Periodensystem und Elektronenkonfiguration', subtitle: 'Perioden, Hauptgruppen, Orbitale und Trends', difficulty: 'grundlagen', prerequisites: ['atommodell'], view: 'periodic',
    objectives: [
      'den Aufbau des Periodensystems (Perioden, Hauptgruppen) erklären und aus der Stellung die Zahl der Valenzelektronen ableiten',
      'Elektronenkonfigurationen der Elemente bis Calcium in Grundzügen angeben',
      'Trends von Atomradius und Elektronegativität beschreiben und typische Ionenladungen vorhersagen',
    ],
    overview: 'Das Periodensystem ordnet die Elemente nach ihrer Ordnungszahl. Weil sich der Aufbau der Elektronenhülle periodisch wiederholt, stehen Elemente mit ähnlichem chemischem Verhalten untereinander – wer die Stellung eines Elements kennt, kann seine typische Ladung und Reaktivität vorhersagen.',
    mechanism: [
      { title: 'Perioden und Gruppen', text: 'Die Zeilen (Perioden) entsprechen der Zahl der besetzten Hauptschalen. Die Spalten (Gruppen) enthalten Elemente mit gleicher Zahl an Valenzelektronen; bei den Hauptgruppen I–VIII entspricht die Gruppennummer der Zahl der Valenzelektronen (nach IUPAC-Zählung Gruppen 1, 2 und 13–18).' },
      { title: 'Orbitale', text: 'Jede Schale besteht aus Unterschalen: s (1 Orbital, bis 2 Elektronen), p (3 Orbitale, bis 6), d (5 Orbitale, bis 10). In jedes Orbital passen höchstens zwei Elektronen mit entgegengesetztem Spin (Pauli-Prinzip).' },
      { title: 'Besetzungsreihenfolge', text: '1s → 2s → 2p → 3s → 3p → 4s → 3d. Beispiele: C 1s² 2s² 2p²; Na [Ne] 3s¹; Cl [Ne] 3s² 3p⁵; K [Ar] 4s¹; Ca [Ar] 4s².' },
      { title: 'Edelgaskonfiguration und Ionen', text: 'Atome der Hauptgruppen erreichen durch Abgabe oder Aufnahme von Elektronen oft die Konfiguration des nächsten Edelgases: Alkalimetalle bilden +1-Ionen (Na⁺, K⁺), Erdalkalimetalle +2 (Mg²⁺, Ca²⁺), Halogene −1 (Cl⁻), Sauerstoff −2.' },
      { title: 'Trends', text: 'Die Elektronegativität nimmt innerhalb einer Periode nach rechts zu und innerhalb einer Gruppe nach unten ab; Fluor hat den höchsten Wert (3,98 nach Pauling, oft gerundet 4,0). Der Atomradius verhält sich umgekehrt: nach unten größer, nach rechts kleiner.' },
    ],
    depth: {
      text: [
        'Die 4s-Unterschale wird vor der 3d-Unterschale besetzt, weil sie energetisch etwas tiefer liegt. Ab Scandium beginnen die Nebengruppen (Übergangsmetalle), zu denen das medizinisch wichtige Eisen (Fe²⁺/Fe³⁺ im Hämoglobin und in Cytochromen) gehört.',
        'Die für den Körper wichtigsten Elemente: Kohlenstoff, Wasserstoff, Sauerstoff und Stickstoff bilden den größten Teil der Biomoleküle; dazu kommen Phosphor und Schwefel sowie die Elektrolyte Na, K, Ca, Mg und Cl.',
      ],
      pitfalls: ['Hauptgruppennummer (I–VIII) und IUPAC-Gruppennummer (1–18) nicht verwechseln: Chlor steht in der VII. Hauptgruppe bzw. Gruppe 17.', 'Kationen sind kleiner als ihre Atome, Anionen größer.', 'Helium hat 2 Valenzelektronen, steht aber bei den Edelgasen.'],
    },
    terms: [
      { term: 'Periode', def: 'Zeile des Periodensystems; entspricht der Zahl der besetzten Hauptschalen.' },
      { term: 'Hauptgruppe', def: 'Spalte des Periodensystems mit gleicher Zahl an Valenzelektronen.', synonyms: ['Gruppe'] },
      { term: 'Orbital', def: 'Aufenthaltsraum für höchstens zwei Elektronen (s, p, d).', synonyms: ['s-Orbital', 'p-Orbital'] },
      { term: 'Elektronenkonfiguration', def: 'Verteilung der Elektronen auf die Orbitale, z. B. Na: 1s² 2s² 2p⁶ 3s¹.' },
      { term: 'Edelgaskonfiguration', def: 'Voll besetzte äußere s- und p-Unterschale (Oktett), besonders stabil.', synonyms: ['Oktettregel'] },
      { term: 'Elektronegativität', def: 'Maß dafür, wie stark ein Atom Bindungselektronen anzieht.', synonyms: ['EN'] },
    ],
    structures: [], models: [], links: ['atommodell', 'bindungen', 'redox'], sources: [Z('Kap. Atombau und Periodensystem')], status: S, origin: 'redaktionell',
  },
  {
    id: 'stoechiometrie', module: 'molecule', title: 'Stöchiometrie: Reaktionsgleichungen, Stoffmenge, Gase und Konzentrationen', subtitle: 'Gleichungen ausgleichen, mit Mol, Avogadrozahl und Molvolumen rechnen, Lösungen herstellen und verdünnen', difficulty: 'grundlagen', prerequisites: ['atommodell', 'konzentrationen'], view: 'balance',
    objectives: [
      'Reaktionsgleichungen nach dem Erhalt der Atome und Ladungen ausgleichen',
      'aus einer Reaktionsgleichung Stoffmengenverhältnisse ablesen und Massen umsetzen',
      'Verdünnungen mit c₁·V₁ = c₂·V₂ berechnen und Verdünnungsfaktoren angeben',
      'mit Avogadrozahl und Molvolumen zwischen Masse, Stoffmenge, Teilchenzahl und Gasvolumen umrechnen',
      'Konzentrationsmaße (Molarität, Massenkonzentration, Masse- und Volumenprozent, ppm, ppb) unterscheiden, Einwaage und Auffüllvolumen berechnen und Ionenkonzentrationen angeben',
    ],
    overview: 'Bei einer chemischen Reaktion gehen keine Atome verloren und es entstehen keine neuen – sie werden nur neu verknüpft. Die Koeffizienten einer ausgeglichenen Gleichung geben an, in welchem Stoffmengenverhältnis die Stoffe reagieren. Daraus lassen sich Massen und Konzentrationen berechnen.',
    mechanism: [
      { title: 'Ausgleichen', text: 'Links und rechts muss von jedem Element dieselbe Zahl an Atomen stehen, bei Ionengleichungen auch dieselbe Gesamtladung. Man verändert nur die Koeffizienten vor den Formeln, nie die Indizes in den Formeln.' },
      { title: 'Vorgehen', text: 'Mit dem Element beginnen, das in den wenigsten Verbindungen vorkommt; Wasserstoff und Sauerstoff zuletzt ausgleichen; am Ende die kleinsten ganzzahligen Koeffizienten wählen.' },
      { title: 'Stoffmengenverhältnis', text: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O bedeutet: 1 mol Glukose reagiert mit 6 mol Sauerstoff zu 6 mol CO₂ und 6 mol Wasser.' },
      { title: 'Von der Masse zur Masse', text: 'Masse → Stoffmenge (n = m/M) → mit dem Verhältnis der Koeffizienten umrechnen → Stoffmenge des Produkts → Masse (m = n·M).' },
      { title: 'Avogadrozahl', text: '1 mol enthält N_A = 6,022 · 10²³ Teilchen. Teilchenzahl N = n · N_A. Die Molmasse M (g/mol) ist die Summe der Atommassen, z. B. Ethanol C₂H₆O: 2·12 + 6·1 + 16 = 46 g/mol.' },
      { title: 'Molvolumen von Gasen', text: '1 mol eines idealen Gases nimmt bei Normbedingungen (0 °C, 1013 hPa) 22,4 l ein, unabhängig vom Gas (Satz von Avogadro). V = n · 22,4 l/mol. Bei Gasreaktionen entsprechen die Volumenverhältnisse den Koeffizienten: Bei 2 H₂O → 2 H₂ + O₂ entstehen 2 Teile Wasserstoff auf 1 Teil Sauerstoff.' },
      { title: 'Konzentrationsmaße', text: 'Stoffmengenkonzentration (Molarität) c = n / V(Lösung) in mol/l („M“). Massenkonzentration β = m / V in g/l. Massenanteil w = m(Stoff) / m(Lösung) in % (m/m). Volumenanteil φ = V(Stoff) / V(Mischung) in Vol-%. ppm = 10⁻⁶, ppb = 10⁻⁹ (1 ppm = 1 mg/kg).' },
      { title: 'Lösungen herstellen', text: 'Einwaage m = c · V · M, dann auf das Endvolumen auffüllen. Auffüllvolumen bei gegebener Masse: V = n / c. Ionenkonzentration = Salzkonzentration · Zahl dieses Ions pro Formeleinheit: 0,1 mol/l CaCl₂ enthalten 0,1 mol/l Ca²⁺ und 0,2 mol/l Cl⁻.' },
      { title: 'Verdünnen', text: 'Beim Verdünnen bleibt die Stoffmenge des gelösten Stoffs gleich: c₁·V₁ = c₂·V₂. Der Verdünnungsfaktor ist c₁/c₂ (bzw. V₂/V₁).' },
    ],
    depth: {
      text: [
        'Beispiel: 1 g Glukose (M = 180,16 g/mol) entspricht 5,55 mmol. Vollständig oxidiert entstehen 6 · 5,55 mmol = 33,3 mmol CO₂, das sind 33,3 mmol · 44,01 g/mol ≈ 1,47 g CO₂.',
        'Beispiel Verbrennung von Ethanol: C₂H₆O + 3 O₂ → 2 CO₂ + 3 H₂O. Aus 1 kg Ethanol (21,7 mol) entstehen 43,5 mol CO₂ = 1,91 kg ≈ 974 l bei Normbedingungen. Probe über die Massenerhaltung: 1000 g Ethanol + 2087 g O₂ = 1913 g CO₂ + 1174 g H₂O.',
        'Das Molvolumen hängt von Temperatur und Druck ab (ideales Gasgesetz p·V = n·R·T, R = 8,314 J/(mol·K)): etwa 24,0 l/mol bei 20 °C und 24,5 l/mol bei 25 °C. Ohne andere Angabe wird im Seminar mit 22,4 l/mol gerechnet.',
        'Molarität (mol pro Liter Lösung) und Molalität (mol pro Kilogramm Lösungsmittel) nicht verwechseln. Beim Masseprozent immer durch die Masse der ganzen Lösung teilen: 3 g NaCl in 97 g Wasser sind 3 %, nicht 3,09 %.',
        '„In 10 ml Wasser lösen“ und „auf 10 ml auffüllen“ ist streng genommen nicht dasselbe, weil der gelöste Stoff selbst Volumen hat. Konzentrationen beziehen sich auf das Volumen der fertigen Lösung.',
        'Eine „1:10-Verdünnung“ wird in Laboren uneinheitlich verwendet: meist 1 Teil Probe + 9 Teile Lösungsmittel (Endvolumen 10 Teile), gelegentlich aber 1 + 10. In Rechnungen deshalb immer das Endvolumen angeben.',
      ],
      equations: ['n = m / M', 'N = n · N_A  (N_A = 6,022 · 10²³ mol⁻¹)', 'V = n · 22,4 l/mol  (0 °C, 1013 hPa)', 'n(A) : n(B) = Koeffizient(A) : Koeffizient(B)', 'c = n / V,  m = c · V · M', 'w = m(Stoff) / m(Lösung)', 'c₁ · V₁ = c₂ · V₂'],
      pitfalls: ['Nie die Indizes ändern: aus H₂O wird nicht H₂O₂.', 'Das Stoffmengenverhältnis gilt für Mol, nicht für Gramm.', 'Milliliter vor dem Rechnen in Liter umrechnen.', 'Ionen, die mehrfach in der Formel stehen, mitzählen (2 Cl⁻ in CaCl₂).', 'N = n · N_A, nicht n / N_A.', 'Beim Verdünnen ist V₂ das Endvolumen, nicht das zugegebene Lösungsmittel.'],
    },
    terms: [
      { term: 'Stöchiometrie', def: 'Lehre von den Mengenverhältnissen bei chemischen Reaktionen.' },
      { term: 'Koeffizient', def: 'Zahl vor einer Formel in der Reaktionsgleichung; gibt das Stoffmengenverhältnis an.', synonyms: ['stöchiometrischer Koeffizient'] },
      { term: 'Verdünnungsfaktor', def: 'Verhältnis von Ausgangs- zu Endkonzentration, c₁/c₂.' },
      { term: 'Massenerhaltung', def: 'Bei chemischen Reaktionen bleibt die Gesamtmasse und die Zahl der Atome jedes Elements gleich.', synonyms: ['Atombilanz'] },
      { term: 'Avogadrozahl', def: 'Zahl der Teilchen in 1 mol: N_A = 6,022 · 10²³ mol⁻¹.', synonyms: ['Avogadro-Konstante'] },
      { term: 'Molvolumen', def: 'Volumen von 1 mol eines idealen Gases; 22,4 l bei 0 °C und 1013 hPa.', synonyms: ['molares Volumen'] },
      { term: 'Molarität', def: 'Stoffmengenkonzentration: mol gelöster Stoff pro Liter Lösung (Einheit M = mol/l).', synonyms: ['Stoffmengenkonzentration'] },
      { term: 'Molalität', def: 'mol gelöster Stoff pro Kilogramm Lösungsmittel.' },
      { term: 'Massenanteil', def: 'Masse des Stoffs geteilt durch die Masse der ganzen Lösung, in % (m/m).', synonyms: ['Masseprozent'] },
      { term: 'Volumenanteil', def: 'Volumen des Stoffs geteilt durch das Volumen der Mischung, in Vol-%.', synonyms: ['Volumenprozent'] },
      { term: 'ppm und ppb', def: 'Anteile von 10⁻⁶ (parts per million) und 10⁻⁹ (parts per billion); 1 ppm = 1 mg/kg.', synonyms: ['ppm', 'ppb'] },
    ],
    structures: [], models: [], links: ['konzentrationen', 'redox', 'energiegewinnung'], sources: [Z('Kap. Stöchiometrie und Konzentrationsangaben')], status: S, origin: 'redaktionell',
  },
];

export const HISTO2_LESSONS: Lesson[] = [
  {
    id: 'mikroskopie', module: 'histo', title: 'Mikroskopie und histologische Präparate', subtitle: 'Lichtmikroskop, Präparatherstellung, Färbungen und Schnittrichtungen', difficulty: 'grundlagen', prerequisites: ['optik'], view: 'microscopy',
    objectives: [
      'den Aufbau des Lichtmikroskops beschreiben und die Gesamtvergrößerung berechnen',
      'Vergrößerung und Auflösung unterscheiden',
      'die Schritte der Präparatherstellung ordnen und die H.E.-Färbung erklären',
      'aus der Schnittrichtung auf die räumliche Gestalt einer Struktur schließen',
    ],
    overview: 'Die Histologie (mikroskopische Anatomie) untersucht Gewebe, die zu klein für das bloße Auge sind. Ein Präparat ist ein dünner, gefärbter Schnitt – ein zweidimensionaler Ausschnitt eines dreidimensionalen Gewebes. Wer weiß, wie das Bild entsteht, erkennt Strukturen sicherer und fällt weniger auf Artefakte herein.',
    mechanism: [
      { title: 'Makroskopisch und mikroskopisch', text: 'Die makroskopische Anatomie untersucht, was man mit bloßem Auge sieht (Präpariersaal), die mikroskopische Anatomie Gewebe und Zellen im Mikroskop.' },
      { title: 'Lichtmikroskop', text: 'Licht geht von der Lichtquelle über den Kondensor durch das Präparat in das Objektiv und von dort zum Okular. Gesamtvergrößerung = Vergrößerung des Objektivs × Vergrößerung des Okulars (z. B. 40 × 10 = 400-fach).' },
      { title: 'Auflösung', text: 'Die Auflösung ist der kleinste Abstand, bei dem zwei Punkte noch getrennt erscheinen. Beim Lichtmikroskop liegt sie bei etwa 0,2 µm. Mehr Vergrößerung ohne bessere Auflösung zeigt keine neuen Details („leere Vergrößerung“).' },
      { title: 'Präparatherstellung', text: 'Fixieren (meist Formalin) → Entwässern in einer aufsteigenden Alkoholreihe → Einbetten in Paraffin → Schneiden am Mikrotom (wenige Mikrometer dick) → Aufziehen auf den Objektträger → Entparaffinieren → Färben → Eindecken.' },
      { title: 'H.E.-Färbung', text: 'Hämatoxylin färbt basophile (saure) Strukturen blau-violett: Zellkerne, raues ER und Ribosomen. Eosin färbt acidophile (eosinophile) Strukturen rot bis rosa: Zytoplasma, Kollagenfasern, Erythrozyten.' },
    ],
    depth: {
      text: [
        'Weitere Färbungen: PAS-Reaktion (Kohlenhydrate wie Glykogen, Schleim der Becherzellen und Basalmembranen magenta), Azan (Kollagen blau, Kerne rot), Resorcin-Fuchsin (elastische Fasern dunkelviolett), Versilberung (retikuläre Fasern schwarz).',
        'Fett wird bei der Paraffineinbettung durch Alkohol und Xylol herausgelöst – Fettzellen erscheinen im H.E.-Schnitt leer. Lipide weist man an Gefrierschnitten z. B. mit Sudanfarbstoffen nach.',
        'Schnittrichtungen: Ein Rohr (z. B. ein Gefäß oder ein Tubulus) erscheint quer geschnitten als Ring, längs geschnitten als zwei parallele Streifen und schräg geschnitten als Oval. Eine Kugel ist in jeder Richtung rund, aber je nach Schnitthöhe unterschiedlich groß – nicht jede Zelle ist im Schnitt mit ihrem Kern getroffen.',
        'Typische Artefakte sind Schrumpfungsspalten, Falten und Risse im Schnitt; sie dürfen nicht als Strukturen gedeutet werden.',
      ],
      equations: ['V_gesamt = V_Objektiv · V_Okular'],
      pitfalls: ['„Basophil“ heißt: bindet basische Farbstoffe – die Struktur selbst ist sauer (z. B. DNA).', 'Leere Räume im Schnitt sind nicht immer leer im Körper (herausgelöstes Fett, Schrumpfungsartefakte).', 'Höhere Vergrößerung bedeutet ein kleineres Sehfeld.'],
    },
    terms: [
      { term: 'Objektiv', def: 'Linsensystem nahe am Präparat; erzeugt das vergrößerte Zwischenbild.', synonyms: ['Okular'] },
      { term: 'Auflösungsvermögen', def: 'Kleinster Abstand, bei dem zwei Punkte noch getrennt wahrgenommen werden.', synonyms: ['Auflösung'] },
      { term: 'Fixierung', def: 'Haltbarmachen des Gewebes, meist mit Formalin, damit die Struktur erhalten bleibt.' },
      { term: 'Mikrotom', def: 'Schneidegerät für dünne Gewebeschnitte.' },
      { term: 'H.E.-Färbung', def: 'Standardfärbung mit Hämatoxylin (Kerne blau-violett) und Eosin (Zytoplasma und Kollagen rosa).', synonyms: ['Hämatoxylin-Eosin'] },
      { term: 'basophil', def: 'mit basischen Farbstoffen anfärbbar, im H.E.-Schnitt blau-violett (z. B. Zellkern).', synonyms: ['acidophil', 'eosinophil'] },
    ],
    structures: [], models: [], links: ['optik', 'epithel', 'bindegewebe'], sources: [L('Kap. „Methoden der Histologie“'), H('Kap. Optik: Mikroskop')], status: S, origin: 'redaktionell',
  },
];
