import type { Lesson } from './types';

// Organische Chemie, Einstieg: Kohlenwasserstoffe – Alkane, Alkene, Alkine (und Cycloalkane, Ausblick Aromaten).

const S = 'zu_pruefen' as const;
const Z = (locator: string) => ({ id: 'zeeck', locator });

export const KW_OBJ = [
  'Alkane, Alkene und Alkine nach allgemeiner Summenformel, Hybridisierung, Bindungswinkel und Geometrie unterscheiden',
  'Kohlenwasserstoffe nach den IUPAC-Regeln benennen und aus dem Namen die Strukturformel zeichnen',
  'Konstitutionsisomere und cis/trans-Isomere von Kohlenwasserstoffen erkennen',
  'Siedetemperatur und Löslichkeit aus Kettenlänge, Verzweigung und Polarität erklären',
  'radikalische Substitution der Alkane und elektrophile Addition der Alkene in ihren Schritten beschreiben',
  'Verbrennungsgleichungen aufstellen und Kohlenwasserstoffe mit biologischer Bedeutung nennen',
];

export const HYDROCARBON_LESSONS: Lesson[] = [
  {
    id: 'kohlenwasserstoffe', module: 'molecule', title: 'Kohlenwasserstoffe: Alkane, Alkene und Alkine', subtitle: 'Homologe Reihe, Nomenklatur, Isomerie, Hybridisierung, Substitution und Addition',
    difficulty: 'grundlagen', prerequisites: ['bindungen'], view: 'hydrocarbons',
    objectives: KW_OBJ,
    overview: 'Kohlenwasserstoffe bestehen nur aus Kohlenstoff und Wasserstoff. Sie sind das Gerüst der organischen Chemie: Jedes Biomolekül lässt sich als Kohlenwasserstoffgerüst mit funktionellen Gruppen lesen. Je nachdem, ob nur Einfachbindungen, eine Doppel- oder eine Dreifachbindung vorkommen, unterscheidet man Alkane, Alkene und Alkine – mit unterschiedlicher Form, Reaktivität und Benennung.',
    mechanism: [
      { title: 'Alkane', text: 'Nur C–C-Einfachbindungen, „gesättigt“. Allgemeine Formel CₙH₂ₙ₊₂. Jedes C ist sp³-hybridisiert und tetraedrisch umgeben (Bindungswinkel ≈ 109,5°). Um Einfachbindungen ist freie Drehung möglich (Konformationen).' },
      { title: 'Homologe Reihe', text: 'Methan CH₄, Ethan C₂H₆, Propan C₃H₈, Butan C₄H₁₀, Pentan, Hexan, Heptan, Octan, Nonan, Decan: Jedes Glied hat eine CH₂-Gruppe mehr. Ab C₄ gibt es Konstitutionsisomere (n-Butan und Isobutan = 2-Methylpropan).' },
      { title: 'Alkene', text: 'Mindestens eine C=C-Doppelbindung, „ungesättigt“. Allgemeine Formel CₙH₂ₙ (bei einer Doppelbindung). Die beiden C der Doppelbindung sind sp²-hybridisiert, trigonal planar (≈ 120°). Die Doppelbindung besteht aus einer σ- und einer π-Bindung; die π-Bindung verhindert die Drehung – deshalb gibt es cis/trans-Isomere (Z/E).' },
      { title: 'Alkine', text: 'Mindestens eine C≡C-Dreifachbindung. Allgemeine Formel CₙH₂ₙ₋₂. sp-hybridisiert, linear (180°), eine σ- und zwei π-Bindungen. Einfachstes Alkin: Ethin (Acetylen), C₂H₂.' },
      { title: 'Nomenklatur', text: '1. Längste Kette (bei Alkenen/Alkinen: die mit der Mehrfachbindung) bestimmt den Stammnamen. 2. So nummerieren, dass Mehrfachbindungen bzw. Verzweigungen möglichst kleine Nummern bekommen. 3. Seitenketten als Alkylreste (Methyl-, Ethyl-) mit Position voranstellen, alphabetisch; gleiche Reste mit di-, tri-. 4. Endung -an, -en, -in mit Position der Mehrfachbindung: z. B. 2-Methylbut-2-en.' },
      { title: 'Eigenschaften', text: 'Kohlenwasserstoffe sind unpolar: Zwischen den Molekülen wirken nur Van-der-Waals-Kräfte. Längere Ketten = größere Kontaktfläche = höhere Siedetemperatur. Verzweigung macht Moleküle kugeliger und senkt die Siedetemperatur. Sie sind hydrophob (in Wasser unlöslich) und lipophil.' },
      { title: 'Reaktionen der Alkane', text: 'Alkane sind reaktionsträge. Sie verbrennen zu CO₂ und H₂O und reagieren mit Halogenen unter Licht in einer radikalischen Substitution: Start (Cl₂ → 2 Cl·), Kettenfortpflanzung (CH₄ + Cl· → CH₃· + HCl; CH₃· + Cl₂ → CH₃Cl + Cl·), Abbruch (zwei Radikale verbinden sich).' },
      { title: 'Reaktionen der Alkene', text: 'Die elektronenreiche π-Bindung wird von Elektrophilen angegriffen: elektrophile Addition. Mit Brom entsteht über ein Bromonium-Ion 1,2-Dibromethan – Bromwasser wird entfärbt (Nachweis von Doppelbindungen). Weitere Additionen: Wasserstoff (Hydrierung, mit Katalysator), Halogenwasserstoff, Wasser (zu Alkoholen). Alkene können außerdem zu Polymeren reagieren (Polyethylen).' },
    ],
    depth: {
      text: [
        'Hybridisierung im Überblick: sp³ – vier σ-Bindungen, Tetraeder, 109,5° (Alkane); sp² – drei σ-Bindungen und ein unhybridisiertes p-Orbital für die π-Bindung, planar, 120° (Alkene, auch Carbonyl-C); sp – zwei σ-Bindungen und zwei π-Bindungen, linear, 180° (Alkine). Je mehr Bindungen zwischen zwei C-Atomen, desto kürzer und fester ist die Bindung (C–C ≈ 154 pm, C=C ≈ 134 pm, C≡C ≈ 120 pm).',
        'Markownikow-Regel: Bei der Addition von HX an ein unsymmetrisches Alken geht der Wasserstoff an das C-Atom, das schon mehr Wasserstoffatome trägt; X geht an das höher substituierte C. Grund: Dort entsteht das stabilere Carbokation.',
        'Cycloalkane: ringförmige Alkane mit der Formel CₙH₂ₙ (z. B. Cyclohexan, C₆H₁₂). Cyclohexan ist in der Sesselkonformation spannungsfrei. Aromaten wie Benzol (C₆H₆) haben ein delokalisiertes π-Elektronensystem und reagieren – anders als Alkene – bevorzugt durch Substitution statt Addition.',
        'Biologische Bedeutung: Ungesättigte Fettsäuren enthalten cis-Doppelbindungen, die einen Knick in die Kette bringen – deshalb sind pflanzliche Öle flüssig. Bei der Fetthärtung (Hydrierung) entstehen teils trans-Fettsäuren. Isopren (2-Methylbuta-1,3-dien) ist der Baustein der Terpene: Cholesterin, Carotinoide, Vitamin A. Beim Sehvorgang lagert Licht 11-cis-Retinal zu all-trans-Retinal um – eine cis/trans-Isomerisierung an einer C=C-Doppelbindung.',
        'Methan entsteht beim Abbau organischer Substanz durch Mikroorganismen ohne Sauerstoff, z. B. im Darm. Unvollständige Verbrennung von Kohlenwasserstoffen liefert Kohlenmonoxid (CO), das Hämoglobin blockiert.',
      ],
      equations: ['Alkane: CₙH₂ₙ₊₂', 'Alkene: CₙH₂ₙ', 'Alkine: CₙH₂ₙ₋₂', 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O', 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br'],
      pitfalls: [
        'Die längste Kette ist nicht immer die waagerecht gezeichnete.',
        'Bei Alkenen und Alkinen muss die Hauptkette die Mehrfachbindung enthalten, auch wenn eine andere Kette länger ist.',
        'Nummeriert wird so, dass die Mehrfachbindung die kleinste Nummer bekommt – erst danach zählen die Seitenketten.',
        'cis/trans gibt es nur, wenn jedes C der Doppelbindung zwei verschiedene Substituenten trägt: But-1-en hat keine cis/trans-Isomere, But-2-en schon.',
        'Alkane reagieren mit Halogenen durch Substitution (H wird ersetzt), Alkene durch Addition (Doppelbindung wird aufgelöst).',
        'Isomere haben die gleiche Summenformel – n-Butan und 2-Methylpropan sind beide C₄H₁₀.',
      ],
    },
    terms: [
      { term: 'Kohlenwasserstoff', def: 'Verbindung nur aus Kohlenstoff und Wasserstoff.' },
      { term: 'Alkan', def: 'Gesättigter Kohlenwasserstoff mit nur Einfachbindungen, CₙH₂ₙ₊₂.', synonyms: ['Paraffin', 'gesättigt'] },
      { term: 'Alken', def: 'Kohlenwasserstoff mit mindestens einer C=C-Doppelbindung, CₙH₂ₙ.', synonyms: ['Olefin', 'ungesättigt'] },
      { term: 'Alkin', def: 'Kohlenwasserstoff mit mindestens einer C≡C-Dreifachbindung, CₙH₂ₙ₋₂.' },
      { term: 'Homologe Reihe', def: 'Reihe von Verbindungen, die sich jeweils um eine CH₂-Gruppe unterscheiden.' },
      { term: 'Hybridisierung', def: 'Mischung von s- und p-Orbitalen zu gleichwertigen Hybridorbitalen (sp³, sp², sp).', synonyms: ['sp³', 'sp²', 'sp'] },
      { term: 'π-Bindung', def: 'Bindung durch seitliche Überlappung von p-Orbitalen; verhindert die freie Drehung.', synonyms: ['Pi-Bindung', 'σ-Bindung'] },
      { term: 'Alkylrest', def: 'Kohlenwasserstoffrest als Seitenkette, z. B. Methyl- (–CH₃), Ethyl- (–C₂H₅).', synonyms: ['Methylgruppe', 'Ethylgruppe'] },
      { term: 'Radikalische Substitution', def: 'Ersatz eines H-Atoms durch ein Halogen über eine Radikal-Kettenreaktion (Start, Kette, Abbruch).', synonyms: ['Radikal'] },
      { term: 'Elektrophile Addition', def: 'Anlagerung eines Elektrophils an eine C=C-Doppelbindung, z. B. Brom an Ethen.', synonyms: ['Addition', 'Bromonium-Ion'] },
      { term: 'Konformation', def: 'Räumliche Anordnung, die durch Drehung um Einfachbindungen ineinander übergeht.' },
    ],
    structures: [], models: [], links: ['bindungen', 'organik', 'naturstoffe', 'stoechiometrie'],
    sources: [Z('Kap. „Kohlenwasserstoffe“'), { id: 'iupac', locator: 'Nomenclature of Organic Chemistry (Blue Book), Kap. P-2 und P-3' }], status: S, origin: 'redaktionell',
  },
];

/** Siedetemperaturen der n-Alkane bei Normaldruck (°C, gerundet) */
export const ALKANES: { n: number; name: string; bp: number }[] = [
  { n: 1, name: 'Methan', bp: -162 }, { n: 2, name: 'Ethan', bp: -89 }, { n: 3, name: 'Propan', bp: -42 }, { n: 4, name: 'Butan', bp: -1 },
  { n: 5, name: 'Pentan', bp: 36 }, { n: 6, name: 'Hexan', bp: 69 }, { n: 7, name: 'Heptan', bp: 98 }, { n: 8, name: 'Octan', bp: 126 },
  { n: 9, name: 'Nonan', bp: 151 }, { n: 10, name: 'Decan', bp: 174 },
];
