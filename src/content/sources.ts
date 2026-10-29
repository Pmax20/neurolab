// Quellenverzeichnis. Fundstellen werden am jeweiligen Inhalt über `locator` angegeben.
// „Letzte Prüfung“ bleibt leer, bis eine fachkundige Person den Inhalt geprüft hat.

export interface Source {
  id: string;
  authors: string;
  title: string;
  edition?: string;
  publisher: string;
  year: string;
  kind: 'Lehrbuch' | 'Originalarbeit' | 'Datenbank/Software' | 'Vorlesungsunterlage' | 'Gesetz/Behörde';
  lastChecked?: string;
}

export const SOURCES: Source[] = [
  { id: 'hh1952', authors: 'Hodgkin AL, Huxley AF', title: 'A quantitative description of membrane current and its application to conduction and excitation in nerve. J Physiol 117: 500–544', publisher: 'The Journal of Physiology', year: '1952', kind: 'Originalarbeit', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'kandel', authors: 'Kandel ER, Koester JD, Mack SH, Siegelbaum SA (Hrsg.)', title: 'Principles of Neural Science', edition: '6. Auflage', publisher: 'McGraw-Hill', year: '2021', kind: 'Lehrbuch' },
  { id: 'hille', authors: 'Hille B', title: 'Ion Channels of Excitable Membranes', edition: '3. Auflage', publisher: 'Sinauer', year: '2001', kind: 'Lehrbuch' },
  { id: 'boron', authors: 'Boron WF, Boulpaep EL', title: 'Medical Physiology', edition: '3. Auflage', publisher: 'Elsevier', year: '2016 (© 2017)', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'guyton', authors: 'Hall JE, Hall ME', title: 'Guyton and Hall Textbook of Medical Physiology', edition: '14. Auflage', publisher: 'Elsevier', year: '2020 (© 2021)', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'alberts', authors: 'Alberts B et al.', title: 'Molecular Biology of the Cell', edition: '7. Auflage', publisher: 'W. W. Norton', year: '2022', kind: 'Lehrbuch' },
  { id: 'stryer', authors: 'Berg JM, Tymoczko JL, Gatto GJ, Stryer L', title: 'Biochemistry', edition: '9. Auflage', publisher: 'W. H. Freeman', year: '2019', kind: 'Lehrbuch' },
  { id: 'west', authors: 'West JB, Luks AM', title: "West's Respiratory Physiology: The Essentials", edition: '11. Auflage', publisher: 'Wolters Kluwer', year: '2020 (© 2021)', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'goldman', authors: 'Goldman DE; Hodgkin AL, Katz B', title: 'Potential, impedance, and rectification in membranes (J Gen Physiol 27: 37–60, 1943); The effect of sodium ions on the electrical activity of the giant axon of the squid (J Physiol 108: 37–77, 1949)', publisher: 'J Gen Physiol / J Physiol', year: '1943/1949', kind: 'Originalarbeit' },
  { id: 'mullins', authors: 'Mullins LJ, Noda K', title: 'The influence of sodium-free solutions on the membrane potential of frog muscle fibers. J Gen Physiol 47: 117–132', publisher: 'J Gen Physiol', year: '1963', kind: 'Originalarbeit' },
  { id: 'dodge', authors: 'Dodge FA, Rahamimoff R', title: 'Co-operative action of calcium ions in transmitter release at the neuromuscular junction. J Physiol 193: 419–432', publisher: 'The Journal of Physiology', year: '1967', kind: 'Originalarbeit', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'huxley1957', authors: 'Huxley AF', title: 'Muscle structure and theories of contraction. Prog Biophys Biophys Chem 7: 255–318', publisher: 'Pergamon', year: '1957', kind: 'Originalarbeit' },
  { id: 'mm1913', authors: 'Michaelis L, Menten ML; Johnson KA, Goody RS', title: 'Die Kinetik der Invertinwirkung (Biochem Z 49: 333–369, 1913); The original Michaelis constant: translation of the 1913 Michaelis–Menten paper (Biochemistry 50: 8264–8269, 2011)', publisher: 'Biochem Z / Biochemistry', year: '1913/2011', kind: 'Originalarbeit' },
  { id: 'severinghaus', authors: 'Severinghaus JW', title: 'Simple, accurate equations for human blood O2 dissociation computations. J Appl Physiol 46: 599–602', publisher: 'J Appl Physiol', year: '1979', kind: 'Originalarbeit', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'windkessel', authors: 'Westerhof N, Lankhaar JW, Westerhof BE', title: 'The arterial Windkessel. Med Biol Eng Comput 47: 131–141', publisher: 'Springer', year: '2009', kind: 'Originalarbeit' },
  { id: 'atkins', authors: 'Atkins P, de Paula J, Keeler J', title: "Atkins' Physical Chemistry", edition: '11. Auflage', publisher: 'Oxford University Press', year: '2018', kind: 'Lehrbuch' },
  { id: 'rdkit', authors: 'RDKit-Projekt', title: 'RDKit: Open-source cheminformatics (ETKDG-Konformerenerzeugung, MMFF94-Optimierung, Valenzprüfung)', publisher: 'rdkit.org', year: '2024', kind: 'Datenbank/Software' },
  { id: 'iupac', authors: 'IUPAC', title: 'Compendium of Chemical Terminology („Gold Book“) und Periodensystem der Elemente', publisher: 'IUPAC', year: 'online', kind: 'Datenbank/Software' },
  // Ergänzt für das 1. Semester (Chemie, Physik, Biologie, Histologie, Terminologie)
  { id: 'zeeck', authors: 'Grond S, Zeeck SC, Mey I; Zeeck A (Hrsg.)', title: 'Chemie für das Medizinstudium und benachbarte Studiengänge', edition: '11. Auflage', publisher: 'Elsevier (Urban & Fischer)', year: '2024', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'harten', authors: 'Harten U', title: 'Physik für Mediziner', edition: '17. Auflage', publisher: 'Springer', year: '2023', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'buselmaier', authors: 'Buselmaier W, Haussig J', title: 'Biologie für Mediziner', edition: '14. Auflage', publisher: 'Springer', year: '2018', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'luellmann', authors: 'Lüllmann-Rauch R, Asan E', title: 'Taschenlehrbuch Histologie', edition: '6. Auflage', publisher: 'Thieme', year: '2019', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'ta2', authors: 'FIPAT (Federative International Programme for Anatomical Terminology)', title: 'Terminologia Anatomica', edition: '2. Auflage', publisher: 'FIPAT', year: '2019', kind: 'Datenbank/Software' },
  { id: 'strlschg', authors: 'Bundesrepublik Deutschland', title: 'Strahlenschutzgesetz (StrlSchG), §§ 78 und 80 – Dosisgrenzwerte', publisher: 'gesetze-im-internet.de', year: '2017, zuletzt geändert 2024', kind: 'Gesetz/Behörde', lastChecked: '28.10.2026 (Web-Abgleich)' },
  { id: 'bfs', authors: 'Bundesamt für Strahlenschutz (BfS)', title: 'Umweltradioaktivität und Strahlenbelastung – Jahresberichte (mittlere effektive Dosis der Bevölkerung)', publisher: 'BfS', year: 'laufend', kind: 'Gesetz/Behörde', lastChecked: '28.10.2026 (Web-Abgleich)' },
  { id: 'leipzig', authors: 'Universität Leipzig, Medizinische Fakultät, Referat Lehre', title: 'Semesterführer Humanmedizin, Vorklinischer Abschnitt (1. und 2. Studienjahr)', publisher: 'Universität Leipzig', year: '2026', kind: 'Vorlesungsunterlage', lastChecked: '28.10.2026 (Web-Abgleich)' },
  { id: 'leipzig-anatomie', authors: 'Universität Leipzig, Institut für Anatomie', title: 'Stundenplan 1. Semester Humanmedizin WS 2026/27 (Themenplan Funktionelle Anatomie I, Kurs Histologie, Seminar Anatomie) sowie Kurs- und Seminarordnung', publisher: 'Universität Leipzig', year: '2026', kind: 'Vorlesungsunterlage', lastChecked: '28.10.2026 (Web-Abgleich)' },
  { id: 'leipzig-physik', authors: 'Universität Leipzig, Institut für Medizinische Physik und Biophysik', title: 'Praktikumsordnung „Praktikum der Physik für Studierende der Humanmedizin“', publisher: 'Universität Leipzig', year: '2025', kind: 'Vorlesungsunterlage', lastChecked: '28.10.2026 (Web-Abgleich)' },
  { id: 'bipm', authors: 'Bureau International des Poids et Mesures (BIPM)', title: 'The International System of Units (SI) – SI Brochure', edition: '9. Auflage', publisher: 'BIPM', year: '2019', kind: 'Gesetz/Behörde', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'schuenke', authors: 'Schünke M, Schulte E, Schumacher U', title: 'Prometheus LernAtlas der Anatomie – Allgemeine Anatomie und Bewegungssystem', edition: '6. Auflage', publisher: 'Thieme', year: '2022', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'duale-reihe-anatomie', authors: 'Aumüller G, Aust G, Engele J, Kirsch J et al.', title: 'Duale Reihe Anatomie', edition: '6. Auflage', publisher: 'Thieme', year: '2025', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
  { id: 'sadler', authors: 'Sadler TW', title: 'Taschenlehrbuch Embryologie (Langman)', edition: '13. Auflage', publisher: 'Thieme', year: '2020', kind: 'Lehrbuch', lastChecked: '28.10.2026 (KI-Abgleich der bibliografischen Angaben)' },
];

export const sourceById = (id: string) => SOURCES.find((s) => s.id === id);
