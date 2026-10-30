import { useState } from 'react';
import { Tabs } from './anatomyViews';
import { QuizTrainer, type QItem } from './chem5Views';
import { MoleculesView } from './molViews';

const de = (x: number, d = 2) => x.toFixed(d).replace('.', ',');
const Table = ({ head, rows, note }: { head: string[]; rows: (string | number)[][]; note?: string }) => (
  <div className="card stack">
    <div style={{ overflowX: 'auto' }}><table><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>
    {note && <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>{note}</p>}
  </div>
);

// ===========================================================================
// Daten je Lektion
// ===========================================================================

const FG: QItem[] = [
  { head: 'CH₃–CH₂–OH', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Alkohol', options: ['Alkohol', 'Ether', 'Aldehyd', 'Carbonsäure'], why: 'OH-Gruppe an einem sp³-C: Ethanol.' },
  { head: 'CH₃–CHO', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Aldehyd', options: ['Aldehyd', 'Keton', 'Alkohol', 'Ester'], why: '–CHO am Kettenende: Ethanal (Acetaldehyd).' },
  { head: 'CH₃–CO–CH₃', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Keton', options: ['Keton', 'Aldehyd', 'Ether', 'Carbonsäure'], why: 'Carbonylgruppe zwischen zwei C: Propanon (Aceton).' },
  { head: 'CH₃–COOH', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Carbonsäure', options: ['Carbonsäure', 'Ester', 'Aldehyd', 'Alkohol'], why: 'Carboxygruppe –COOH: Essigsäure.' },
  { head: 'CH₃–COO–CH₂–CH₃', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Ester', options: ['Ester', 'Ether', 'Carbonsäure', 'Keton'], why: 'Säure + Alkohol unter Wasserabspaltung: Essigsäureethylester.' },
  { head: 'CH₃–O–CH₃', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Ether', options: ['Ether', 'Ester', 'Alkohol', 'Keton'], why: 'Zwei C-Reste an einem O, kein Carbonyl: Dimethylether.' },
  { head: 'CH₃–CH₂–NH₂', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Amin', options: ['Amin', 'Amid', 'Imin', 'Nitril'], why: 'NH₂ an einem sp³-C: Ethylamin, eine Base.' },
  { head: 'CH₃–CO–NH₂', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Amid', options: ['Amid', 'Amin', 'Ester', 'Keton'], why: 'Stickstoff direkt an der Carbonylgruppe: Acetamid.' },
  { head: 'CH₃–SH', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Thiol', options: ['Thiol', 'Alkohol', 'Thioester', 'Sulfat'], why: 'SH-Gruppe: Methanthiol.' },
  { head: 'CH₃–CO–S–CoA', q: 'Zu welcher Stoffklasse gehört die Verbindung?', answer: 'Thioester', options: ['Thioester', 'Thiol', 'Ester', 'Amid'], why: 'Acetyl-CoA: Carbonsäure mit einem Thiol verestert.' },
  { q: 'Welcher Reaktionstyp liegt vor? Ethanol → Ethen + H₂O', answer: 'Eliminierung', options: ['Eliminierung', 'Addition', 'Substitution', 'Kondensation'], why: 'Wasser wird abgespalten, eine Doppelbindung entsteht.' },
  { q: 'Welcher Reaktionstyp liegt vor? Essigsäure + Ethanol → Ester + Wasser', answer: 'Kondensation', options: ['Kondensation', 'Hydrolyse', 'Addition', 'Eliminierung'], why: 'Zwei Moleküle verbinden sich unter Wasserabspaltung.' },
  { q: 'Welches Teilchen ist ein Nucleophil?', answer: 'OH⁻', options: ['OH⁻', 'H⁺', 'Br⁺', 'Carbonyl-C'], why: 'Nucleophile besitzen ein freies Elektronenpaar oder eine negative Ladung.' },
];
const FG_TABLE = [
  ['Hydroxy', '–OH', 'Alkohol', '-ol', 'Ethanol'], ['Carbonyl (endständig)', '–CHO', 'Aldehyd', '-al', 'Ethanal'], ['Carbonyl (in der Kette)', '>C=O', 'Keton', '-on', 'Propanon'],
  ['Carboxy', '–COOH', 'Carbonsäure', '-säure', 'Ethansäure'], ['Ester', '–COO–R', 'Ester', '-oat / …ester', 'Ethylacetat'], ['Ether', '–O–', 'Ether', '…ether', 'Diethylether'],
  ['Amino', '–NH₂', 'Amin', '-amin', 'Ethylamin'], ['Amid', '–CO–NH₂', 'Amid', '-amid', 'Acetamid'], ['Thiol', '–SH', 'Thiol', '-thiol', 'Ethanthiol'], ['Phosphatester', '–O–PO₃²⁻', 'Phosphat', '-phosphat', 'Glukose-6-phosphat'],
];

const ALK: QItem[] = [
  { head: 'CH₃–CH(OH)–CH₃', q: 'Was für ein Alkohol ist Propan-2-ol?', answer: 'sekundär', options: ['sekundär', 'primär', 'tertiär', 'quartär'], why: 'Das OH-tragende C hat zwei C-Nachbarn.' },
  { head: '(CH₃)₃C–OH', q: 'Was für ein Alkohol ist 2-Methylpropan-2-ol?', answer: 'tertiär', options: ['tertiär', 'primär', 'sekundär', 'Phenol'], why: 'Drei C-Nachbarn am OH-tragenden C – nicht oxidierbar.' },
  { q: 'Was entsteht bei der Oxidation eines sekundären Alkohols?', answer: 'ein Keton', options: ['ein Keton', 'ein Aldehyd', 'eine Carbonsäure', 'ein Ether'], why: 'Propan-2-ol → Aceton.' },
  { q: 'Was entsteht bei vollständiger Oxidation von Ethanol?', answer: 'Essigsäure', options: ['Essigsäure', 'Aceton', 'Ethen', 'Diethylether'], why: 'Ethanol → Ethanal → Ethansäure.' },
  { q: 'Warum ist Methanol giftiger als Ethanol?', answer: 'Es wird zu Formaldehyd und Ameisensäure oxidiert.', options: ['Es wird zu Formaldehyd und Ameisensäure oxidiert.', 'Es ist eine starke Säure.', 'Es ist nicht wasserlöslich.', 'Es wird gar nicht abgebaut.'], why: 'Die Ameisensäure verursacht Azidose und schädigt den Sehnerv.' },
  { q: 'Was entsteht, wenn zwei Cystein-SH-Gruppen oxidiert werden?', answer: 'eine Disulfidbrücke', options: ['eine Disulfidbrücke', 'ein Thioester', 'ein Ether', 'eine Peptidbindung'], why: '2 R–SH → R–S–S–R + 2 H⁺ + 2 e⁻.' },
  { head: '(CH₃)₂NH', q: 'Was für ein Amin ist Dimethylamin?', answer: 'sekundär', options: ['sekundär', 'primär', 'tertiär', 'quartär'], why: 'Zwei C-Reste am N.' },
  { q: 'Wie liegen die meisten Amine bei pH 7,4 vor?', answer: 'überwiegend protoniert (R–NH₃⁺)', options: ['überwiegend protoniert (R–NH₃⁺)', 'überwiegend ungeladen', 'als Anion', 'als Radikal'], why: 'Der pKs der Ammonium-Ionen liegt um 10 – weit über 7,4.' },
  { q: 'Aus welcher Aminosäure entsteht Histamin?', answer: 'Histidin', options: ['Histidin', 'Tryptophan', 'Tyrosin', 'Glutamat'], why: 'Decarboxylierung von Histidin.' },
  { q: 'Warum siedet Ethanol (78 °C) viel höher als der gleich schwere Dimethylether (−24 °C)?', answer: 'Ethanol bildet Wasserstoffbrücken.', options: ['Ethanol bildet Wasserstoffbrücken.', 'Ethanol ist schwerer.', 'Dimethylether ist ionisch.', 'Ethanol ist verzweigt.'], why: 'Ether haben kein H an O und bilden untereinander keine H-Brücken.' },
];

const CARB: QItem[] = [
  { q: 'Welches Teilchen greift bei der nucleophilen Addition an das Carbonyl-C an?', answer: 'ein Nucleophil, z. B. ein Alkohol', options: ['ein Nucleophil, z. B. ein Alkohol', 'ein Proton', 'ein Radikal', 'ein Metallion'], why: 'Das Carbonyl-C ist δ+ und wird von Elektronenpaar-Donatoren angegriffen.' },
  { q: 'Was entsteht aus einem Aldehyd und einem Alkohol?', answer: 'ein Halbacetal', options: ['ein Halbacetal', 'ein Ester', 'ein Ether', 'ein Imin'], why: 'OH und OR am selben C. Mit einem zweiten Alkohol entsteht das Acetal.' },
  { q: 'Was entsteht aus einem Aldehyd und einem primären Amin?', answer: 'ein Imin (Schiff-Base)', options: ['ein Imin (Schiff-Base)', 'ein Amid', 'ein Halbacetal', 'ein Nitril'], why: 'Unter Wasserabspaltung entsteht eine C=N-Doppelbindung.' },
  { q: 'Welcher Stoff ergibt eine positive Fehling-Probe?', answer: 'Glukose', options: ['Glukose', 'Aceton', 'Saccharose', 'Ethanol'], why: 'Glukose ist eine Aldose; die Aldehydgruppe reduziert Cu²⁺ zu Cu₂O.' },
  { q: 'Was beobachtet man bei der Tollens-Probe mit einem Aldehyd?', answer: 'einen Silberspiegel', options: ['einen Silberspiegel', 'einen ziegelroten Niederschlag', 'eine Blaufärbung', 'Gasentwicklung'], why: '[Ag(NH₃)₂]⁺ wird zu metallischem Silber reduziert.' },
  { q: 'Was entsteht bei der Reduktion eines Ketons?', answer: 'ein sekundärer Alkohol', options: ['ein sekundärer Alkohol', 'ein primärer Alkohol', 'eine Carbonsäure', 'ein Aldehyd'], why: 'Beispiel: Aceton → Propan-2-ol; Pyruvat → Laktat (mit NADH).' },
  { q: 'Welcher der Stoffe ist ein Ketonkörper?', answer: 'Acetoacetat', options: ['Acetoacetat', 'Laktat', 'Glycerin', 'Citrat'], why: 'Ketonkörper: Acetoacetat, β-Hydroxybutyrat, Aceton.' },
  { q: 'Was unterscheidet Keto- und Enol-Form?', answer: 'die Position eines H-Atoms und einer Doppelbindung', options: ['die Position eines H-Atoms und einer Doppelbindung', 'nur die Verteilung der Elektronen', 'die Summenformel', 'die räumliche Spiegelung'], why: 'Tautomerie: Ein H wandert vom α-C zum O; aus C=O wird C=C–OH.' },
];

const CS: QItem[] = [
  { q: 'Warum ist Essigsäure viel saurer als Ethanol?', answer: 'Das Acetat-Ion ist mesomeriestabilisiert.', options: ['Das Acetat-Ion ist mesomeriestabilisiert.', 'Essigsäure hat mehr H-Atome.', 'Ethanol ist ein Ion.', 'Essigsäure ist größer.'], why: 'Die negative Ladung verteilt sich auf zwei O-Atome.' },
  { q: 'Was entsteht bei der Verseifung eines Fettes mit NaOH?', answer: 'Glycerin und Seifen (Fettsäure-Natriumsalze)', options: ['Glycerin und Seifen (Fettsäure-Natriumsalze)', 'Glukose und Fettsäuren', 'Ester und Wasser', 'Cholesterin'], why: 'Alkalische Esterhydrolyse.' },
  { q: 'Welches Carbonsäurederivat ist am reaktivsten?', answer: 'Säureanhydrid', options: ['Säureanhydrid', 'Amid', 'Ester', 'Carbonsäure'], why: 'Reihe: Anhydrid > Thioester > Ester > Amid.' },
  { q: 'Welches Derivat bildet die Peptidbindung?', answer: 'Amid', options: ['Amid', 'Ester', 'Anhydrid', 'Thioester'], why: 'Carboxy- und Aminogruppe verbinden sich zur Amidbindung.' },
  { q: 'Welche Bindung im Acetyl-CoA macht es zu einem guten Acetylgruppen-Überträger?', answer: 'die Thioesterbindung', options: ['die Thioesterbindung', 'die Peptidbindung', 'die Etherbindung', 'die glykosidische Bindung'], why: 'Thioester sind energiereich und reaktiv.' },
  { q: 'Wie heißt das Anion der Brenztraubensäure?', answer: 'Pyruvat', options: ['Pyruvat', 'Laktat', 'Citrat', 'Oxalat'], why: 'Brenztraubensäure = 2-Oxopropansäure; Endprodukt der Glykolyse.' },
  { q: 'Welche Säure hat drei Carboxygruppen?', answer: 'Citronensäure', options: ['Citronensäure', 'Milchsäure', 'Essigsäure', 'Bernsteinsäure'], why: 'Citrat ist namensgebend für den Citratzyklus und bindet Ca²⁺.' },
  { q: 'Wie entsteht ein Ester?', answer: 'Säure + Alkohol unter Wasserabspaltung', options: ['Säure + Alkohol unter Wasserabspaltung', 'Säure + Amin', 'Alkohol + Alkohol', 'Aldehyd + Wasser'], why: 'Säurekatalysierte Kondensation, ein Gleichgewicht.' },
];
const CS_TABLE = [['Säureanhydrid', 'R–CO–O–CO–R / Phosphoanhydrid', 'sehr hoch', 'ATP'], ['Thioester', 'R–CO–S–R’', 'hoch', 'Acetyl-CoA'], ['Ester', 'R–CO–O–R’', 'mittel', 'Fette, Aspirin'], ['Carbonsäure', 'R–COOH', 'niedrig', 'Laktat, Pyruvat'], ['Amid', 'R–CO–NH–R’', 'sehr niedrig', 'Peptidbindung, Harnstoff']];

const ST: QItem[] = [
  { head: 'CH₃–CH(OH)–COOH (Milchsäure)', q: 'Wie viele Stereozentren hat Milchsäure?', answer: '1', options: ['1', '0', '2', '3'], why: 'C-2 trägt H, OH, CH₃ und COOH – vier verschiedene Reste.' },
  { head: 'CH₃–CH(OH)–CH₃', q: 'Hat Propan-2-ol ein Stereozentrum?', answer: 'nein', options: ['nein', 'ja, eines', 'ja, zwei'], why: 'C-2 trägt zwei gleiche CH₃-Gruppen.' },
  { head: 'H₂N–CH₂–COOH (Glycin)', q: 'Ist Glycin chiral?', answer: 'nein', options: ['nein', 'ja'], why: 'Zwei H-Atome am α-C.' },
  { q: 'Höchste CIP-Priorität am C: –OH, –CH₃, –H, –COOH?', answer: '–OH', options: ['–OH', '–COOH', '–CH₃', '–H'], why: 'Ordnungszahl des direkt gebundenen Atoms: O (8) > C (6) > H (1).' },
  { q: 'Welche Priorität hat –COOH gegenüber –CH₃?', answer: 'höher', options: ['höher', 'niedriger', 'gleich'], why: 'Beide binden über C. Nächste Atome: (O, O, O) gegen (H, H, H) – die Doppelbindung zählt doppelt.' },
  { q: 'Wie viele Stereoisomere hat eine Verbindung mit drei Stereozentren höchstens?', answer: '8', options: ['8', '6', '3', '9'], why: '2³ = 8 (weniger, falls Mesoformen auftreten).' },
  { q: 'Glukose und Galaktose unterscheiden sich nur an C-4. Wie nennt man sie?', answer: 'Epimere', options: ['Epimere', 'Enantiomere', 'Konstitutionsisomere', 'Konformere'], why: 'Diastereomere, die sich an genau einem Stereozentrum unterscheiden.' },
  { q: 'Wie verhalten sich Enantiomere zueinander?', answer: 'wie Bild und Spiegelbild', options: ['wie Bild und Spiegelbild', 'wie cis und trans', 'wie Sessel- und Wannenform', 'wie Keto- und Enolform'], why: 'Alle Stereozentren sind invertiert.' },
  { q: 'Was ist ein Racemat?', answer: 'ein 1 : 1-Gemisch beider Enantiomere', options: ['ein 1 : 1-Gemisch beider Enantiomere', 'eine Mesoverbindung', 'ein reines Enantiomer', 'ein Diastereomer'], why: 'Optisch inaktiv, weil sich die Drehungen aufheben.' },
  { q: 'Welche Konfiguration haben die proteinogenen Aminosäuren?', answer: 'L', options: ['L', 'D', 'beide gleich häufig'], why: 'Proteine enthalten nur L-Aminosäuren (meist S, Cystein R).' },
];

const AR: QItem[] = [
  { q: 'Wie viele π-Elektronen hat Benzol?', answer: '6', options: ['6', '3', '12', '4'], why: 'Drei Doppelbindungen = 6 π-Elektronen, 4n + 2 mit n = 1.' },
  { q: 'Ist Cyclohexen aromatisch?', answer: 'nein', options: ['nein', 'ja'], why: 'Nur eine Doppelbindung, kein durchgehend konjugierter Ring.' },
  { q: 'Wie reagiert Benzol mit Brom (mit FeBr₃)?', answer: 'Substitution', options: ['Substitution', 'Addition', 'Eliminierung', 'gar nicht'], why: 'Das aromatische System bleibt erhalten.' },
  { q: 'Welcher Heterocyclus steckt in Histidin?', answer: 'Imidazol', options: ['Imidazol', 'Pyridin', 'Indol', 'Purin'], why: 'Fünfring mit zwei N; pKs ≈ 6.' },
  { q: 'Welcher Heterocyclus steckt in Tryptophan und Serotonin?', answer: 'Indol', options: ['Indol', 'Imidazol', 'Pyrimidin', 'Pyrrol allein'], why: 'Benzolring mit Pyrrolring kondensiert.' },
  { q: 'Welche Basen sind Purine?', answer: 'Adenin und Guanin', options: ['Adenin und Guanin', 'Cytosin und Thymin', 'Uracil und Cytosin', 'Thymin und Adenin'], why: 'Zweiring-System. Cytosin, Thymin, Uracil sind Pyrimidine.' },
  { q: 'Warum ist Pyrrol keine Base?', answer: 'Das freie Elektronenpaar des N gehört zum aromatischen System.', options: ['Das freie Elektronenpaar des N gehört zum aromatischen System.', 'Pyrrol hat kein N.', 'Pyrrol ist eine starke Säure.', 'Pyrrol ist geladen.'], why: 'Würde es ein Proton binden, ginge die Aromatizität verloren.' },
  { q: 'Welcher Heterocyclus bildet das Porphyrin des Häms?', answer: 'Pyrrol (vier Ringe)', options: ['Pyrrol (vier Ringe)', 'Pyridin', 'Purin', 'Furan'], why: 'Vier Pyrrolringe über Methinbrücken verbunden; die N binden das Fe²⁺.' },
];
const AR_TABLE = [['Pyridin', 'Sechsring, 1 N', 'ja', 'Nicotinamid (NAD⁺), Vitamin B₆'], ['Pyrrol', 'Fünfring, 1 N', 'nein', 'Porphyrin (Häm, Chlorophyll)'], ['Imidazol', 'Fünfring, 2 N', 'schwach (pKs ≈ 6)', 'Histidin, Histamin'], ['Pyrimidin', 'Sechsring, 2 N', 'schwach', 'Cytosin, Thymin, Uracil, Vitamin B₁'], ['Purin', 'Pyrimidin + Imidazol', 'schwach', 'Adenin, Guanin, Harnsäure, Coffein'], ['Indol', 'Benzol + Pyrrol', 'nein', 'Tryptophan, Serotonin, Melatonin'], ['Furan / Pyran', 'Fünf- / Sechsring, 1 O', 'nein', 'Ringformen der Zucker']];

const KH: QItem[] = [
  { q: 'Ist Fruktose eine Aldose oder eine Ketose?', answer: 'Ketose', options: ['Ketose', 'Aldose'], why: 'Carbonylgruppe an C-2.' },
  { q: 'Welche Ringform bildet Glukose bevorzugt?', answer: 'Pyranose (Sechsring)', options: ['Pyranose (Sechsring)', 'Furanose (Fünfring)', 'gar keine', 'Siebenring'], why: 'Die 5-OH greift C-1 an.' },
  { q: 'Was ist der Unterschied zwischen α- und β-Glukose?', answer: 'die Stellung der OH-Gruppe an C-1', options: ['die Stellung der OH-Gruppe an C-1', 'die Stellung der OH-Gruppe an C-5', 'D- oder L-Konfiguration', 'die Zahl der C-Atome'], why: 'Anomere unterscheiden sich am anomeren C.' },
  { q: 'Welcher Zucker ist nicht reduzierend?', answer: 'Saccharose', options: ['Saccharose', 'Maltose', 'Laktose', 'Glukose'], why: 'Beide anomeren C sind in der glykosidischen Bindung gebunden.' },
  { q: 'Aus welchen Monosacchariden besteht Laktose?', answer: 'Galaktose und Glukose', options: ['Galaktose und Glukose', 'Glukose und Fruktose', 'Glukose und Glukose', 'Galaktose und Fruktose'], why: 'Gal-β(1→4)-Glc; gespalten durch Laktase.' },
  { q: 'Warum kann der Mensch Cellulose nicht verdauen?', answer: 'Ihm fehlt ein Enzym für β(1→4)-Bindungen.', options: ['Ihm fehlt ein Enzym für β(1→4)-Bindungen.', 'Cellulose besteht nicht aus Glukose.', 'Cellulose ist wasserlöslich.', 'Cellulose ist ein Protein.'], why: 'Amylasen spalten nur α-glykosidische Bindungen.' },
  { q: 'Warum ist Glykogen stärker verzweigt als Amylopektin?', answer: 'Viele Kettenenden ermöglichen schnellen Abbau zu Glukose.', options: ['Viele Kettenenden ermöglichen schnellen Abbau zu Glukose.', 'Damit es wasserunlöslich ist.', 'Weil es aus Fruktose besteht.', 'Um es unverdaulich zu machen.'], why: 'Die Glykogenphosphorylase arbeitet an vielen Enden gleichzeitig.' },
  { q: 'Welcher Bindungstyp verbindet Base und Zucker in Nukleosiden?', answer: 'N-glykosidisch', options: ['N-glykosidisch', 'O-glykosidisch', 'Phosphodiester', 'Peptidbindung'], why: 'Das anomere C bindet an ein N der Base.' },
];
const KH_TABLE = [['Maltose', 'Glc-α(1→4)-Glc', 'ja', 'Stärkeabbau'], ['Laktose', 'Gal-β(1→4)-Glc', 'ja', 'Milchzucker'], ['Saccharose', 'Glc-α(1→2)β-Fru', 'nein', 'Haushaltszucker'], ['Amylose', 'α(1→4), unverzweigt', '–', 'Stärke (Pflanze)'], ['Amylopektin', 'α(1→4) + α(1→6) alle 20–25', '–', 'Stärke (Pflanze)'], ['Glykogen', 'α(1→4) + α(1→6) alle 8–12', '–', 'Speicher in Leber und Muskel'], ['Cellulose', 'β(1→4), unverzweigt', '–', 'Pflanzenzellwand, Ballaststoff']];

const LI: QItem[] = [
  { q: 'Was bedeutet die Bezeichnung C18:2 ω-6?', answer: '18 C, 2 Doppelbindungen, die erste am 6. C vom Methylende', options: ['18 C, 2 Doppelbindungen, die erste am 6. C vom Methylende', '18 C, 6 Doppelbindungen', '2 C, 18 Doppelbindungen', '18 C, 2 Doppelbindungen am 6. C vom Carboxylende'], why: 'Das ist Linolsäure, eine essenzielle Fettsäure.' },
  { q: 'Warum sind Pflanzenöle bei Raumtemperatur flüssig?', answer: 'Sie enthalten viele cis-ungesättigte Fettsäuren mit Knick.', options: ['Sie enthalten viele cis-ungesättigte Fettsäuren mit Knick.', 'Sie enthalten kein Glycerin.', 'Sie sind Phospholipide.', 'Sie sind kürzer als 4 C-Atome.'], why: 'Geknickte Ketten lagern sich schlecht zusammen.' },
  { q: 'Welches Lipid ist kein Glycerinester?', answer: 'Cholesterin', options: ['Cholesterin', 'Triacylglycerin', 'Phosphatidylcholin', 'Phosphatidylserin'], why: 'Cholesterin ist ein Steroid.' },
  { q: 'Was bildet sich, wenn man Phospholipide in Wasser gibt?', answer: 'eine Lipiddoppelschicht', options: ['eine Lipiddoppelschicht', 'eine echte Lösung', 'ein Ionengitter', 'ein Polysaccharid'], why: 'Hydrophobe Schwänze nach innen, hydrophile Köpfe nach außen.' },
  { q: 'Welche Fettsäure ist ω-3?', answer: 'α-Linolensäure', options: ['α-Linolensäure', 'Ölsäure', 'Linolsäure', 'Palmitinsäure'], why: 'C18:3 ω-3; Ölsäure ist ω-9, Linolsäure ω-6, Palmitinsäure gesättigt.' },
  { q: 'Welcher Stoff entsteht NICHT aus Cholesterin?', answer: 'Glykogen', options: ['Glykogen', 'Cortisol', 'Gallensäuren', 'Vitamin D'], why: 'Glykogen ist ein Polysaccharid.' },
  { q: 'Welches Grundgerüst haben Sphingolipide?', answer: 'Sphingosin', options: ['Sphingosin', 'Glycerin', 'Steran', 'Ribose'], why: 'Ein Aminoalkohol statt Glycerin.' },
];
const LI_TABLE = [['Palmitinsäure', 'C16:0', 'gesättigt', 'häufigste gesättigte FS'], ['Stearinsäure', 'C18:0', 'gesättigt', 'tierische Fette'], ['Ölsäure', 'C18:1 (cis-Δ9), ω-9', 'einfach ungesättigt', 'Olivenöl'], ['Linolsäure', 'C18:2, ω-6', 'mehrfach ungesättigt', 'essenziell'], ['α-Linolensäure', 'C18:3, ω-3', 'mehrfach ungesättigt', 'essenziell, Leinöl'], ['Arachidonsäure', 'C20:4, ω-6', 'mehrfach ungesättigt', 'Vorstufe der Prostaglandine']];

const AA: [string, string, string, string][] = [
  ['Glycin', 'Gly', 'G', 'unpolar'], ['Alanin', 'Ala', 'A', 'unpolar'], ['Valin', 'Val', 'V', 'unpolar · essenziell'], ['Leucin', 'Leu', 'L', 'unpolar · essenziell'], ['Isoleucin', 'Ile', 'I', 'unpolar · essenziell'],
  ['Prolin', 'Pro', 'P', 'unpolar (cyclisch)'], ['Phenylalanin', 'Phe', 'F', 'unpolar, aromatisch · essenziell'], ['Tryptophan', 'Trp', 'W', 'unpolar, aromatisch · essenziell'], ['Methionin', 'Met', 'M', 'unpolar, S · essenziell'],
  ['Serin', 'Ser', 'S', 'polar (OH)'], ['Threonin', 'Thr', 'T', 'polar (OH) · essenziell'], ['Cystein', 'Cys', 'C', 'polar (SH)'], ['Tyrosin', 'Tyr', 'Y', 'polar, aromatisch (Phenol)'], ['Asparagin', 'Asn', 'N', 'polar (Amid)'], ['Glutamin', 'Gln', 'Q', 'polar (Amid)'],
  ['Aspartat', 'Asp', 'D', 'sauer (−)'], ['Glutamat', 'Glu', 'E', 'sauer (−)'], ['Lysin', 'Lys', 'K', 'basisch (+) · essenziell'], ['Arginin', 'Arg', 'R', 'basisch (+)'], ['Histidin', 'His', 'H', 'basisch (Imidazol, pKs ≈ 6)'],
];
const PI: { name: string; pk: number[]; kind: 'neutral' | 'sauer' | 'basisch' }[] = [
  { name: 'Glycin', pk: [2.34, 9.6], kind: 'neutral' }, { name: 'Alanin', pk: [2.34, 9.69], kind: 'neutral' }, { name: 'Valin', pk: [2.32, 9.62], kind: 'neutral' },
  { name: 'Asparaginsäure', pk: [1.88, 3.65, 9.6], kind: 'sauer' }, { name: 'Glutaminsäure', pk: [2.19, 4.25, 9.67], kind: 'sauer' },
  { name: 'Lysin', pk: [2.18, 8.95, 10.53], kind: 'basisch' }, { name: 'Histidin', pk: [1.82, 6.0, 9.17], kind: 'basisch' },
];
export const piOf = (a: { pk: number[]; kind: string }) => (a.kind === 'neutral' ? (a.pk[0] + a.pk[1]) / 2 : a.kind === 'sauer' ? (a.pk[0] + a.pk[1]) / 2 : (a.pk[1] + a.pk[2]) / 2);

function PiCalc() {
  const [i, setI] = useState(0);
  const [ph, setPh] = useState(7);
  const a = PI[i]; const pi = piOf(a);
  const charge = ph < pi - 0.3 ? 'überwiegend positiv – wandert zur Kathode (−)' : ph > pi + 0.3 ? 'überwiegend negativ – wandert zur Anode (+)' : 'nach außen nahezu ungeladen – wandert kaum';
  return (
    <div className="card stack">
      <div className="seg" role="tablist" aria-label="Aminosäure" style={{ flexWrap: 'wrap' }}>{PI.map((x, k) => <button key={x.name} role="tab" aria-selected={k === i} onClick={() => setI(k)}>{x.name}</button>)}</div>
      <p style={{ margin: 0 }}>pKs-Werte: {a.pk.map((p) => de(p)).join(' · ')} ({a.kind === 'neutral' ? 'α-COOH · α-NH₃⁺' : a.kind === 'sauer' ? 'α-COOH · Seitenketten-COOH · α-NH₃⁺' : 'α-COOH · α-NH₃⁺ bzw. Seitenkette (der jeweils höhere zuletzt)'})</p>
      <p style={{ margin: 0 }}><b>pI = {a.kind === 'basisch' ? `(${de(a.pk[1])} + ${de(a.pk[2])}) / 2` : `(${de(a.pk[0])} + ${de(a.pk[1])}) / 2`} = {de(pi)}</b> – {a.kind === 'neutral' ? 'Mittelwert der beiden pKs-Werte.' : a.kind === 'sauer' ? 'Mittelwert der beiden sauren pKs-Werte, zwischen denen die neutrale Form vorliegt.' : 'Mittelwert der beiden höheren pKs-Werte, zwischen denen die neutrale Form vorliegt.'}</p>
      <label className="field" style={{ margin: 0 }}><span className="lab"><b>pH der Lösung: {de(ph, 1)}</b></span><input type="range" min={0} max={14} step={0.1} value={ph} onChange={(e) => setPh(Number(e.target.value))} aria-label="pH" /></label>
      <p style={{ margin: 0 }} aria-live="polite">Bei pH {de(ph, 1)} ist {a.name} {charge}.</p>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>pKs-Werte gerundete Lehrbuchwerte (25 °C); in Aufgaben gilt der angegebene Wert.</p>
    </div>
  );
}

const ASQ: QItem[] = [
  { q: 'Welche Aminosäure ist nicht chiral?', answer: 'Glycin', options: ['Glycin', 'Alanin', 'Serin', 'Cystein'], why: 'R = H: zwei gleiche Substituenten am α-C.' },
  { q: 'Welche Aminosäure hat eine negativ geladene Seitenkette bei pH 7?', answer: 'Glutamat', options: ['Glutamat', 'Lysin', 'Leucin', 'Serin'], why: 'Asp und Glu tragen eine zusätzliche Carboxygruppe.' },
  { q: 'Welche Aminosäure kann Disulfidbrücken bilden?', answer: 'Cystein', options: ['Cystein', 'Methionin', 'Serin', 'Tyrosin'], why: 'Zwei SH-Gruppen werden zu S–S oxidiert. Methionin hat S, aber als Thioether.' },
  { q: 'In welcher Form liegt Alanin bei pH 7 vor?', answer: 'als Zwitterion', options: ['als Zwitterion', 'als Kation', 'als Anion', 'ungeladen ohne Ionen'], why: '–COO⁻ und –NH₃⁺ gleichzeitig.' },
  { q: 'Welche Ladung hat Glycin (pI ≈ 6) bei pH 2?', answer: 'positiv', options: ['positiv', 'negativ', 'neutral'], why: 'Unterhalb des pI überwiegen protonierte Formen.' },
  { q: 'Warum ist die Peptidbindung nicht frei drehbar?', answer: 'Sie hat wegen Mesomerie teilweisen Doppelbindungscharakter.', options: ['Sie hat wegen Mesomerie teilweisen Doppelbindungscharakter.', 'Sie ist eine Dreifachbindung.', 'Sie ist ionisch.', 'Wegen der Disulfidbrücken.'], why: 'Das freie Elektronenpaar des N ist mit C=O delokalisiert.' },
  { q: 'Welche Strukturebene beschreibt die α-Helix?', answer: 'Sekundärstruktur', options: ['Sekundärstruktur', 'Primärstruktur', 'Tertiärstruktur', 'Quartärstruktur'], why: 'Regelmäßige Rückgratfaltung über H-Brücken.' },
  { q: 'Was bleibt bei der Denaturierung erhalten?', answer: 'die Primärstruktur', options: ['die Primärstruktur', 'die α-Helices', 'die Quartärstruktur', 'die Funktion'], why: 'Peptidbindungen werden nicht gespalten.' },
];

const NU: QItem[] = [
  { q: 'Was unterscheidet ein Nukleotid von einem Nukleosid?', answer: 'Phosphatgruppe(n)', options: ['Phosphatgruppe(n)', 'die Base', 'der Zucker', 'nichts'], why: 'Nukleotid = Nukleosid + Phosphat.' },
  { q: 'Wie viele Wasserstoffbrücken verbinden G und C?', answer: '3', options: ['3', '2', '1', '4'], why: 'A–T: 2, G–C: 3.' },
  { q: 'Welche Base kommt nur in RNA vor?', answer: 'Uracil', options: ['Uracil', 'Thymin', 'Adenin', 'Cytosin'], why: 'In DNA steht stattdessen Thymin.' },
  { q: 'Welcher Zucker steckt in der DNA?', answer: '2’-Desoxyribose', options: ['2’-Desoxyribose', 'Ribose', 'Glukose', 'Fruktose'], why: 'An C-2’ fehlt die OH-Gruppe.' },
  { q: 'Welche Bindung verknüpft die Nukleotide im Strang?', answer: 'Phosphodiesterbindung (3’→5’)', options: ['Phosphodiesterbindung (3’→5’)', 'Peptidbindung', 'Disulfidbrücke', 'α(1→4)-glykosidisch'], why: 'Phosphat verbindet 3’-OH und 5’-OH.' },
  { q: 'Wie viele Phosphorsäureanhydridbindungen hat ATP?', answer: '2', options: ['2', '3', '1', '0'], why: 'Drei Phosphate: eine Esterbindung zum Zucker und zwei Anhydridbindungen.' },
  { q: 'Welches Vitamin steckt im NAD⁺?', answer: 'Niacin (Nicotinamid, B₃)', options: ['Niacin (Nicotinamid, B₃)', 'Riboflavin (B₂)', 'Thiamin (B₁)', 'Cobalamin (B₁₂)'], why: 'Der Pyridinring des Nicotinamids nimmt die Elektronen auf.' },
  { q: 'Warum ist GC-reiche DNA schwerer zu trennen?', answer: 'G–C hat drei statt zwei Wasserstoffbrücken.', options: ['G–C hat drei statt zwei Wasserstoffbrücken.', 'GC-Paare sind kovalent verbunden.', 'Cytosin ist geladen.', 'Sie enthält mehr Ribose.'], why: 'Höherer Schmelzpunkt.' },
];
const NU_TABLE = [['Adenin (A)', 'Purin', 'DNA und RNA', 'paart mit T bzw. U (2 H-Brücken)'], ['Guanin (G)', 'Purin', 'DNA und RNA', 'paart mit C (3 H-Brücken)'], ['Cytosin (C)', 'Pyrimidin', 'DNA und RNA', 'paart mit G'], ['Thymin (T)', 'Pyrimidin', 'nur DNA', 'paart mit A'], ['Uracil (U)', 'Pyrimidin', 'nur RNA', 'paart mit A']];

// ===========================================================================

const CONTENT: Record<string, { tabs: [string, string][]; render: (tab: string) => JSX.Element }> = {
  organik: { tabs: [['quiz', 'Gruppen erkennen'], ['tabelle', 'Funktionelle Gruppen'], ['3d', 'Moleküle in 3D']], render: (t) => (t === 'quiz' ? <QuizTrainer items={FG} /> : t === 'tabelle' ? <Table head={['Gruppe', 'Formel', 'Stoffklasse', 'Endung', 'Beispiel']} rows={FG_TABLE} /> : <MoleculesView />) },
  'alkohole-amine': { tabs: [['quiz', 'Üben'], ['tabelle', 'Oxidationsstufen']], render: (t) => (t === 'quiz' ? <QuizTrainer items={ALK} /> : <Table head={['Stufe', 'Beispiel (C₂)', 'Oxidationszahl des C', 'im Körper']} rows={[['Alkan', 'Ethan', '−III', '–'], ['primärer Alkohol', 'Ethanol', '−I', 'Alkoholdehydrogenase'], ['Aldehyd', 'Ethanal', '+I', 'Aldehyddehydrogenase'], ['Carbonsäure', 'Essigsäure', '+III', '→ Acetyl-CoA'], ['vollständig oxidiert', 'CO₂', '+IV', 'Ausatmung']]} note="Sekundäre Alkohole → Ketone; tertiäre Alkohole sind nicht oxidierbar." />) },
  carbonyle: { tabs: [['quiz', 'Üben'], ['tabelle', 'Reaktionen der Carbonylgruppe']], render: (t) => (t === 'quiz' ? <QuizTrainer items={CARB} /> : <Table head={['Partner', 'Produkt', 'Beispiel im Körper']} rows={[['Wasser', 'Hydrat', 'Formaldehyd in Wasser'], ['Alkohol', 'Halbacetal → Acetal', 'Ringform der Zucker, glykosidische Bindung'], ['primäres Amin', 'Imin (Schiff-Base)', 'Pyridoxalphosphat, Rhodopsin, HbA1c'], ['Oxidationsmittel', 'Carbonsäure (nur Aldehyde)', 'Fehling, Tollens, Aldehyddehydrogenase'], ['NADH (Reduktion)', 'Alkohol', 'Pyruvat → Laktat']]} />) },
  carbonsaeuren: { tabs: [['quiz', 'Üben'], ['tabelle', 'Reaktivität der Derivate']], render: (t) => (t === 'quiz' ? <QuizTrainer items={CS} /> : <Table head={['Derivat', 'Struktur', 'Reaktivität', 'Beispiel']} rows={CS_TABLE} note="Je besser die Abgangsgruppe, desto reaktiver gegenüber Nucleophilen." />) },
  stereochemie: { tabs: [['quiz', 'Üben'], ['tabelle', 'Isomeriearten']], render: (t) => (t === 'quiz' ? <QuizTrainer items={ST} hint="CIP: Ordnungszahl am direkt gebundenen Atom; niedrigster Rest nach hinten; Uhrzeigersinn = R." /> : <Table head={['Art', 'Was ist gleich?', 'Was ist verschieden?', 'Beispiel']} rows={[['Konstitutionsisomere', 'Summenformel', 'Verknüpfung', 'Ethanol / Dimethylether'], ['Enantiomere', 'Verknüpfung', 'alle Stereozentren gespiegelt', 'L- / D-Alanin'], ['Diastereomere', 'Verknüpfung', 'einige Stereozentren bzw. cis/trans', 'Glukose / Galaktose; cis-/trans-But-2-en'], ['Epimere', 'Verknüpfung', 'genau ein Stereozentrum', 'Glukose / Mannose (C-2)'], ['Anomere', 'Verknüpfung', 'anomeres C der Ringform', 'α- / β-Glukose'], ['Konformere', 'alles', 'nur Drehung um Einfachbindungen', 'Sessel / Wanne des Cyclohexans']]} />) },
  'aromaten-heterocyclen': { tabs: [['quiz', 'Üben'], ['tabelle', 'Heterocyclen']], render: (t) => (t === 'quiz' ? <QuizTrainer items={AR} /> : <Table head={['Heterocyclus', 'Ring', 'basisch?', 'Vorkommen']} rows={AR_TABLE} />) },
  kohlenhydrate: { tabs: [['quiz', 'Üben'], ['tabelle', 'Di- und Polysaccharide']], render: (t) => (t === 'quiz' ? <QuizTrainer items={KH} /> : <Table head={['Zucker', 'Verknüpfung', 'reduzierend', 'Vorkommen']} rows={KH_TABLE} />) },
  lipide: { tabs: [['quiz', 'Üben'], ['tabelle', 'Fettsäuren']], render: (t) => (t === 'quiz' ? <QuizTrainer items={LI} /> : <Table head={['Fettsäure', 'Kurzform', 'Sättigung', 'Bemerkung']} rows={LI_TABLE} />) },
  'aminosaeuren-proteine': { tabs: [['pi', 'Isoelektrischer Punkt'], ['quiz', 'Üben'], ['tabelle', 'Die 20 Aminosäuren']], render: (t) => (t === 'pi' ? <PiCalc /> : t === 'quiz' ? <QuizTrainer items={ASQ} /> : <Table head={['Aminosäure', 'Dreibuchstaben', 'Einbuchstaben', 'Seitenkette']} rows={AA} note="Essenziell für Erwachsene: Val, Leu, Ile, Lys, Met, Phe, Thr, Trp (bei Kindern zusätzlich His)." />) },
  nukleotide: { tabs: [['quiz', 'Üben'], ['tabelle', 'Basen']], render: (t) => (t === 'quiz' ? <QuizTrainer items={NU} /> : <Table head={['Base', 'Typ', 'kommt vor in', 'Paarung']} rows={NU_TABLE} />) },
};

export function OrganicView({ lesson }: { lesson: string }) {
  const c = CONTENT[lesson];
  const [tab, setTab] = useState(c?.tabs[0][0] ?? '');
  if (!c) return null;
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={c.tabs} />
      {c.render(tab)}
    </div>
  );
}

export const ORGANIC_QUIZ_ITEMS = { FG, ALK, CARB, CS, ST, AR, KH, LI, ASQ, NU };
export { PI as PI_DATA };
