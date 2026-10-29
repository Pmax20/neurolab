// Protokoll des KI-gestützten Quellenabgleichs (28.10.2026).
// Ein solcher Abgleich ersetzt NICHT die fachliche Freigabe durch eine fachkundige Person.

export type CheckResult = 'bestätigt' | 'korrigiert' | 'präzisiert';

export interface FactCheck {
  area: string;
  claim: string;
  result: CheckResult;
  note: string;
  refs: { title: string; url: string }[];
}

export const FACTCHECK_DATE = '28.10.2026';

export const FACTCHECKS: FactCheck[] = [
  {
    area: 'Aktionspotenzial', claim: 'Hodgkin-Huxley-Gleichungen und Parameter (ḡ_Na 120, ḡ_K 36, g_L 0,3 mS/cm²; E_Na 50, E_K −77, E_L −54,387 mV; C 1 µF/cm²; Ratenfunktionen in der −65-mV-Konvention; 6,3 °C)', result: 'bestätigt',
    note: 'Ratenfunktionen und Parameter stimmen mit der üblichen modernen Darstellung des HH-Modells überein; die Simulation verwendet genau diese Werte.',
    refs: [{ title: 'NeuroWiki (Case Western): Hodgkin-Huxley-Parameter', url: 'https://neurowiki.case.edu/wiki/HodgkinHuxleyModelParameters' }, { title: 'Sterratt et al., Kap. 3: HH-Simulation', url: 'https://dai.fmph.uniba.sk/courses/comp-neuro/reading/Sterratt_CH3_HH_simulation.pdf' }],
  },
  {
    area: 'Ionengradienten', claim: 'Typische Ionenkonzentrationen (Na⁺ 145/12, K⁺ 4/140, Ca²⁺ 1,2 mmol/l / 0,1 µmol/l, Cl⁻ außen 110 mmol/l)', result: 'bestätigt',
    note: 'Liegt im Bereich gängiger Lehrbuchtabellen. Quellen betonen ebenfalls, dass die Werte zelltypabhängig sind – das ist in der App als Modellparameter gekennzeichnet.',
    refs: [{ title: 'Pearson Study Guide: Ionic basis of the resting membrane potential', url: 'https://www.pearson.com/channels/anp/study-guides/ionic-basis-of-the-resting-membrane-potential' }, { title: 'Introduction to Neuroscience (Pressbooks): Ionenkonzentrationen', url: 'https://uen.pressbooks.pub/introneuro/?p=749' }],
  },
  {
    area: 'Ionengradienten / PSP', claim: 'Intrazelluläre Cl⁻-Konzentration 10 mmol/l (E_Cl ≈ −64 mV)', result: 'korrigiert',
    note: 'Auf 7 mmol/l geändert (E_Cl ≈ −74 mV). Damit stimmt das Membranmodell mit dem GABA_A-Modell (E_Cl −75 mV) und dem üblichen Lehrbuchwert E_Cl ≈ −70 mV überein. Betroffene Aufgabe angepasst.',
    refs: [{ title: 'Pearson Study Guide: typische Gleichgewichtspotenziale (E_Cl ≈ −70 mV)', url: 'https://www.pearson.com/channels/anp/study-guides/ionic-basis-of-the-resting-membrane-potential' }],
  },
  {
    area: 'Ruhemembranpotenzial', claim: 'Na⁺/K⁺-ATPase erhält die Gradienten aufrecht, erzeugt das Ruhepotenzial aber nicht überwiegend selbst', result: 'bestätigt',
    note: 'Entspricht der Lehrbuchdarstellung („maintained – but not created – by the pump“).',
    refs: [{ title: 'Integrated Human A&P (Pressbooks): The Sodium-Potassium Pump', url: 'https://uen.pressbooks.pub/anatomyphysiology2/chapter/the-sodium-potassium-pump/' }],
  },
  {
    area: 'Erregungsleitung', claim: 'Leitungsgeschwindigkeit: nicht myelinisiert ∝ √Durchmesser, myelinisiert ≈ ∝ Durchmesser', result: 'bestätigt',
    note: 'Das Kompartimentmodell der App zeigt qualitativ dieselbe Wurzelabhängigkeit (2-facher Durchmesser → ca. 1,4-fache Geschwindigkeit).',
    refs: [{ title: 'Gerstner et al., Neuronal Dynamics, Kap. 3.3', url: 'https://neuronaldynamics.epfl.ch/online/Ch3.S3.html' }, { title: 'The Brain from Top to Bottom (McGill)', url: 'https://thebrain.mcgill.ca/flash/a/a_01/a_01_cl/a_01_cl_fon/a_01_cl_fon.html' }],
  },
  {
    area: 'Chemische Synapse', claim: 'Transmitterfreisetzung ≈ vierte Potenz der Ca²⁺-Konzentration (Dodge & Rahamimoff 1967, J Physiol 193: 419–432)', result: 'bestätigt',
    note: 'Zitat und Aussage (kooperative Wirkung von etwa vier Ca²⁺-Ionen) stimmen; das Modell verwendet einen Hill-Koeffizienten von 4.',
    refs: [{ title: 'Dodge & Rahamimoff 1967 (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1365607' }],
  },
  {
    area: 'Synapse / Endplatte', claim: 'Breite des synaptischen Spalts „ca. 20–40 nm“', result: 'präzisiert',
    note: 'Gilt für typische ZNS-Synapsen. An der motorischen Endplatte ist der Spalt breiter (Angaben ca. 50–100 nm) und enthält die Basallamina. Text ergänzt.',
    refs: [{ title: 'Universität Turin, Vorlesung: Neuromuscular junction', url: 'https://cmb.i-learn.unito.it/mod/resource/view.php?id=5322' }],
  },
  {
    area: 'Endplatte', claim: 'P/Q-Typ-Ca²⁺-Kanäle an der Säuger-Endplatte; AChE in der Basallamina; zwei ACh pro nAChR', result: 'bestätigt',
    note: 'Übereinstimmend beschrieben (P/Q-Typ beim Menschen nahezu ausschließlich).',
    refs: [{ title: 'Nishimune: Practical anatomy of the neuromuscular junction', url: 'https://magistralbr.caldic.com/storage/product-files/1050993301.pdf' }, { title: 'Nurullina et al., Physiol Res 60: 815–823 (2011)', url: 'https://www.biomed.cas.cz/physiolres/pdf/2011/60_815.pdf' }],
  },
  {
    area: 'Endplatte', claim: 'Umkehrpotenzial des nikotinischen ACh-Rezeptors „≈ 0 mV“', result: 'präzisiert',
    note: 'Je nach Quelle etwa −15 bis 0 mV (Kationenkanal, für Na⁺ etwas besser leitfähig als für K⁺). Text um die Spanne ergänzt; das Modell rechnet weiter mit 0 mV.',
    refs: [{ title: 'Universität Turin, Vorlesung: Neuromuscular junction', url: 'https://cmb.i-learn.unito.it/mod/resource/view.php?id=5322' }],
  },
  {
    area: 'Energiegewinnung', claim: 'ATP-Ausbeute 30/32 (P/O 2,5/1,5) bzw. 36/38 (3/2), abhängig vom Shuttle', result: 'bestätigt',
    note: 'Rechnung und Konventionen stimmen.',
    refs: [{ title: 'AAT Bioquest: Why different numbers of ATP per glucose?', url: 'https://www.aatbio.com/resources/faq-frequently-asked-questions/why-are-there-different-numbers-of-atp-molecules-produced-per-glucose-in-cellular-respiration' }, { title: 'Chemie.de: Glycerin-3-Phosphat-Shuttle', url: 'https://www.chemie.de/lexikon/Glycerin-3-Phosphat-Shuttle.html' }],
  },
  {
    area: 'Energiegewinnung', claim: 'Glycerin-3-phosphat-Shuttle „z. B. Skelettmuskel, Gehirn“', result: 'präzisiert',
    note: 'Quellen sind für das Gehirn uneinheitlich (teils Malat-Aspartat als Hauptweg). Jetzt: Malat-Aspartat v. a. Leber, Herz, Niere; Glycerin-3-phosphat v. a. Skelettmuskel; im Gehirn beide beschrieben.',
    refs: [{ title: 'Electron Transport and Oxidative Phosphorylation (Skript)', url: 'https://gyansanchay.csjmu.ac.in/wp-content/uploads/2022/04/Electron-Transport-and-Oxidative-Phosphorylation.pdf' }, { title: 'OnCourse: Shuttle systems', url: 'https://www.getoncourse.ai/revision/indian-medical-pg/biochemistry/energy-production-and-metabolism/shuttle-systems-malate-aspartate-and-glycerol-phosphate/' }],
  },
  {
    area: 'Säure-Base', claim: 'Bikarbonatpuffer: pH = 6,1 + log([HCO₃⁻]/(0,0307·pCO₂)); Normalwerte 24 mmol/l, 40 mmHg → pH 7,4', result: 'bestätigt',
    note: 'Konstanten (pK′ 6,1, Löslichkeit 0,0307 mmol/(l·mmHg) bei 37 °C) stimmen.',
    refs: [{ title: 'Open Exam Prep: Henderson-Hasselbalch & 20:1-Verhältnis', url: 'https://open-exam-prep.com/study-guides/ascp-c/acid-base-blood-gases/acid-base-equilibria' }, { title: 'LibreTexts: The Henderson–Hasselbalch equation', url: 'https://med.libretexts.org/Courses/Virginia_Tech_Carilion_School_of_Medicine/Pulmonary_Physiology_for_Pre-Clinical_Students_(Binks)/11%3A_Alkalosis_and_Acidosis/11.03%3A_The_Henderson-Hasselbalch_equation' }],
  },
  {
    area: 'Molekülbibliothek / Aufgaben', claim: 'Glycin pK_a 2,34 (COOH) und 9,60 (NH₃⁺); Zwitterion bei pH 7,4', result: 'bestätigt',
    note: 'Werte und Aussage der Aufgabe stimmen.',
    refs: [{ title: 'NKU: The Proteinogenic Amino Acids (pK_a-Tabelle)', url: 'https://nku.edu/~russellk/courses/che311/aminoacids.htm' }],
  },
  {
    area: 'Atmung', claim: 'Severinghaus-Gleichung (1979), P50 ≈ 26,8 mmHg, S_O₂ bei 40 mmHg ≈ 75 %', result: 'bestätigt',
    note: 'Gleichung, Zitat und Kennwerte stimmen.',
    refs: [{ title: 'Dash & Bassingthwaighte 2010 (PMC): Modelle der O₂-Bindungskurve', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2862600' }, { title: 'NIBIB Physiome: Severinghaus/Adair-Modelle', url: 'https://www.imagwiki.nibib.nih.gov/physiome/jsim/models/webmodel/NSR/shbo2adair' }],
  },
  {
    area: 'Kreislauf', claim: 'Durchblutungsverteilung in Ruhe (Modell: Gehirn 16 %, Koronarien 5 %, Nieren 22 %, Splanchnikus 28 %, Muskel 17 %, Rest 12 %)', result: 'bestätigt',
    note: 'Liegt im Bereich der üblichen Lehrbuchangaben (Gehirn ca. 13–15 %, Herz ca. 4–5 %, Nieren ca. 20–25 %, Splanchnikus ca. 25 %, Muskel ca. 15–20 %). In der App als gerundete Größenordnungen gekennzeichnet.',
    refs: [{ title: 'Columbia University: Regional circulations', url: 'https://www.columbia.edu/%7Ekj3/Chapter5.htm' }, { title: 'Lecturio: Distribution of blood flow', url: 'https://www.lecturio.com/medical-courses/distribution-of-blood-flow.lecture' }],
  },
  {
    area: 'Quellenverzeichnis', claim: 'Erscheinungsjahre: Guyton & Hall 14. Aufl. „2020“, West 11. Aufl. „2020“, Boron 3. Aufl. „2017“', result: 'präzisiert',
    note: 'Ergänzt um Copyright-Jahr: Guyton & Hall 2020 (© 2021), West & Luks 2020 (© 2021), Boron & Boulpaep 2016 (© 2017). Hinweis: Von Guyton & Hall gibt es inzwischen eine 15. Auflage.',
    refs: [{ title: 'Elsevier: Guyton and Hall, 14. Auflage', url: 'https://shop.elsevier.com/books/textbook-of-medical-physiology/guyton/978-0-323-59712-8' }, { title: 'ANZCA Library: West’s Respiratory Physiology 11e', url: 'https://libguides.anzca.edu.au/blogs/anaestrain/updates/Wests-now-available-online' }],
  },
];

/** Inhalte, die per redaktioneller Durchsicht (ohne Einzelquelle aus dem Web) geprüft wurden */
// Ergänzung für das 1. Semester (Universität Leipzig), Abgleich ebenfalls am 28.10.2026
FACTCHECKS.push(
  {
    area: 'Anatomie / Embryologie', claim: 'Morula um Tag 3–4, Blastozyste um Tag 4–5, Beginn der Implantation um Tag 6, abgeschlossen etwa Tag 10–12; vorderer Neuroporus schließt um Tag 25, hinterer um Tag 28', result: 'bestätigt',
    note: 'Mehrere Lehrquellen geben übereinstimmend diese Richtwerte an (je nach Quelle ± 1–2 Tage). Die App nennt die Werte deshalb als „um“ bzw. „etwa“.',
    refs: [{ title: 'Langman Medical Embryology (Lehrmaterial UAMS): Neuroporenschluss Tag 25 bzw. 27–28', url: 'https://o2.uams.edu/event_files/118053/Stanley%202017%20%20Neuroembryology%20ILA.pdf' }, { title: 'WikiDoc (nach Williams Obstetrics): Morula Tag 3, Blastozyste Tag 5, Implantation ab Tag 6', url: 'https://wikidoc.org/index.php/WBR0513' }],
  },
  {
    area: 'Anatomie / Muskellehre', claim: 'M. biceps brachii: Caput longum vom Tuberculum supraglenoidale, Caput breve vom Processus coracoideus, Ansatz Tuberositas radii; Flexion und Supination; N. musculocutaneus', result: 'bestätigt',
    note: 'Übereinstimmend in Radiopaedia, Kenhub und Elsevier Complete Anatomy. Zusätzlich strahlt die Aponeurosis bicipitalis in die Unterarmfaszie ein – in der App nicht erwähnt, weil im Schema nicht dargestellt.',
    refs: [{ title: 'Radiopaedia: Biceps brachii', url: 'https://radiopaedia.org/articles/biceps-brachii?lang=us' }, { title: 'Kenhub: Biceps brachii muscle', url: 'https://www.kenhub.com/en/library/anatomy-en/biceps-brachii-muscle' }],
  },
  {
    area: 'Studienplan Anatomie', claim: 'Themen und Termine der Vorlesung Funktionelle Anatomie I im WS 2026/27 (Einführung 19./20.10., Embryologie 22./23.10., Knochen und Gelenke 05.–17.11., Muskellehre 23.11.) und der Histologie-Kurstage', result: 'bestätigt',
    note: 'Aus dem veröffentlichten Stundenplan/Themenplan des Instituts für Anatomie übernommen. Belegt ist, dass die Themen drankommen – nicht, wie sie geprüft werden. Alle Übungsfragen sind selbst formuliert.',
    refs: [{ title: 'Universität Leipzig, Institut für Anatomie: Lehre (Stundenpläne, Kurs- und Seminarordnungen)', url: 'https://www.uniklinikum-leipzig.de/einrichtungen/anatomie/lehre' }],
  },
  {
    area: 'Studienplan', claim: 'Fächer im 1. Semester Humanmedizin in Leipzig: Anatomie (Funktionelle Anatomie I, Histologie Teil A), Biologie, Chemie, Physik/Biophysik, Medizinische Terminologie; Physiologie und Biochemie ab dem 3. Semester', result: 'bestätigt',
    note: 'Laut Semesterführer Vorklinik der Medizinischen Fakultät. Die Reihenfolge der Bereiche in NeuroLab folgt diesem Plan. Der Semesterführer nennt keine Klausurtermine – diese trägt man selbst ein.',
    refs: [{ title: 'Universität Leipzig: Semesterführer Humanmedizin Vorklinik (06.2026)', url: 'https://www.uniklinikum-leipzig.de/Documents/Medizinische%20Fakult%c3%a4t/Studium%20und%20Lehre/Studium/HM/Studiendokumente/Semesterf%c3%bchrer%20Vorklinik%2006.2026.pdf' }],
  },
  {
    area: 'Radioaktivität', claim: 'Dosisgrenzwerte: 1 mSv/Jahr für Einzelpersonen der Bevölkerung (§ 80 StrlSchG), 20 mSv/Jahr für beruflich exponierte Personen (§ 78 StrlSchG); medizinische Anwendungen sind von den Grenzwerten ausgenommen', result: 'bestätigt',
    note: 'Wortlaut der Paragrafen und Darstellung des Bundesamts für Strahlenschutz stimmen mit dem Lektionstext und der Aufgabe überein.',
    refs: [{ title: 'gesetze-im-internet.de: § 78 StrlSchG', url: 'https://www.gesetze-im-internet.de/strlschg/__78.html' }, { title: 'gesetze-im-internet.de: § 80 StrlSchG', url: 'https://www.gesetze-im-internet.de/strlschg/__80.html' }, { title: 'BfS: Grenzwerte', url: 'https://www.bfs.de/EN/topics/ion/radiation-protection/limit-values/limit-values.htm' }],
  },
  {
    area: 'Radioaktivität', claim: 'Mittlere effektive Dosis in Deutschland: natürlich etwa 2 bis 2,5 mSv/Jahr, Medizin in ähnlicher Größenordnung', result: 'präzisiert',
    note: 'Nomineller Wert der natürlichen Exposition 2,1 mSv/Jahr (einschließlich Radon), medizinische Diagnostik im Mittel etwa 1,7 mSv/Jahr. Der Text spricht deshalb nur von Größenordnungen.',
    refs: [{ title: 'Fachverband für Strahlenschutz: Strahlenschutz kompakt – Medizin (2026, nach BfS)', url: 'https://www.fs-ev.org/fileadmin/user_upload/93_Oeff.-Arbeit/StrahlenschutzKompakt/Kompakte_2026/SK05_Medizin_2026.pdf' }],
  },
  {
    area: 'Radioaktivität', claim: 'Halbwertszeiten: Tc-99m ≈ 6 h (140 keV γ), F-18 ≈ 110 min, I-123 ≈ 13,2 h, I-131 ≈ 8 d', result: 'bestätigt',
    note: 'Stimmt mit Nuklidtabellen überein (Tc-99m 6,01–6,02 h; F-18 109,8 min; I-131 8,02 d).',
    refs: [{ title: 'PMC: Tabelle gebräuchlicher Radionuklide', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6071519/table/T1' }],
  },
  {
    area: 'Terminologie', claim: 'Gültige anatomische Nomenklatur: Terminologia Anatomica, 2. Auflage (FIPAT 2019)', result: 'präzisiert',
    note: 'Online veröffentlicht 2019, von der IFAA-Generalversammlung 2020 angenommen.',
    refs: [{ title: 'FIPAT: Terminologia Anatomica (TA2)', url: 'https://fipat.library.dal.ca/TA2' }],
  },
);

export const REVIEWED_WITHOUT_WEB = [
  'Anatomie II/III (Nervensystem, Herz, Kreislauf, Rumpfwand, Extremitäten) sowie Blut/Gefäße und Haut/Drüsen: Lehrbuchstandard (Duale Reihe Anatomie, Prometheus, Lüllmann-Rauch), Zahlen wie 31 Spinalnervenpaare, 7/12/5 Wirbel, Rippen 1–7/8–10/11–12, 8 Hand- und 7 Fußwurzelknochen, Leukozytenanteile und Bifurcatio aortae bei L4 redaktionell abgeglichen – fachliche Freigabe steht aus',
  'Rechentrainer: Umrechnungsfaktoren (1 mmHg = 133,322 Pa, 1 cmH₂O = 98,0665 Pa, 1 kcal = 4,184 kJ, 1 kWh = 3,6 MJ, 1 m/s = 3,6 km/h) und alle 38 Vorlagen automatisch mit je 200 Zufallszahlen nachgerechnet',
  'Reaktionsgleichungen: Atom- und Ladungsbilanz aller Musterlösungen automatisch geprüft',
  'Elektronenkonfigurationen bis Krypton inkl. der Ausnahmen Cr und Cu (automatischer Test)',
  'Hydrostatik: p = ρ·g·h; Blutsäule ≈ 0,78 mmHg pro cm (ρ = 1060 kg/m³) – ergibt am Fuß des Stehenden rund +90 mmHg',
  'Histologische Färbungen (H.E., PAS, Azan, Resorcin-Fuchsin, Versilberung) und Präparatherstellung nach Lehrbuchstandard',
  'Genetischer Code (Standardtabelle), Start-/Stoppcodons, Transkriptionsrichtung',
  'Nernst-Vorfaktor 61,5 mV bei 37 °C (nachgerechnet: R·T/F·ln 10 = 61,54 mV)',
  'Michaelis-Menten-Formeln und Hemmtypen',
  'Alveoläre CO₂- und O₂-Gleichung (0,863; P_H₂O 47 mmHg), O₂-Gehalt (1,34 · Hb · S + 0,003 · pO₂)',
  'Hagen-Poiseuille (r⁴), HZV = HF · SV, Windkesselprinzip',
  'Pauling-Elektronegativitäten, Bindungswinkel (CH₄ 109,5°, NH₃ ≈ 107°, H₂O ≈ 104,5°)',
  'Stereochemie der Molekülbibliothek (CIP-Konfigurationen automatisch mit RDKit geprüft)',
  'Alle Musterlösungen der Rechen- und Vorhersageaufgaben (automatisierte Tests gegen die Simulation)',
  '1. Semester: 0,9 % NaCl = 154 mmol/l (≈ 308 mosmol/l ideal, ≈ 286 real), Glukose 5 % ≈ 278 mmol/l (nachgerechnet)',
  '1. Semester: Schallgeschwindigkeit Weichgewebe 1540 m/s, Dämpfung ≈ 0,5 dB/(cm·MHz), Brechkraft des Auges ≈ 60 dpt, Auflösung Lichtmikroskop ≈ 0,2 µm (Lehrbuchwerte)',
  '1. Semester: Erbgänge und Wiederholungsrisiken (Kreuzungsschemata nachgerechnet), Mitose- und Meiosephasen, Epitheltypen und Vorkommen (Lehrbuchwissen)',
];
