import type { Lesson } from './types';
import { lessonFactory, upgrade, type TopicExtra } from './kit';

// Medizinische Terminologie (1. Semester): Grammatik, klinische Termini, Termini des Bewegungsapparats.
const L = lessonFactory('term', 'ta2');

export const TERM_UP_OBJ = {
  lagebezeichnungen: ['Lageangaben an den Extremitäten (radial/ulnar, tibial/fibular, palmar/plantar) und Seitenangaben (ipsi-, kontralateral) korrekt verwenden', 'die Körperachsen benennen und den Ebenen zuordnen'],
  wortbildung: ['die Schreibweise klinischer Begriffe (eingedeutscht mit k/z) von der lateinischen Schreibweise (c) unterscheiden'],
};

export const TERM_UPGRADES: Record<string, (l: Lesson) => Lesson> = {
  lagebezeichnungen: upgrade({
    objectives: TERM_UP_OBJ.lagebezeichnungen,
    mechanism: [
      ['Extremitäten', 'Am Unterarm: radial (daumenseitig) und ulnar (kleinfingerseitig); am Unterschenkel: tibial (großzehenseitig) und fibular (kleinzehenseitig). An Hand und Fuß: palmar bzw. volar (Handfläche), plantar (Fußsohle), dorsal (Rücken von Hand oder Fuß).'],
      ['Seiten und Tiefe', 'ipsilateral (auf derselben Seite), kontralateral (auf der Gegenseite), bilateral (beidseitig). superficialis (oberflächlich) – profundus (tief); externus – internus; centralis – periphericus.'],
      ['Achsen', 'Longitudinal- bzw. Vertikalachse (von Kopf zu Fuß), Sagittalachse (von hinten nach vorn), Transversalachse (von links nach rechts). Jede Ebene wird von zwei Achsen aufgespannt; um die dritte, senkrecht zur Ebene stehende Achse finden die Bewegungen in dieser Ebene statt.'],
    ],
    pitfalls: ['„Radial“ heißt daumenseitig, nicht „strahlenförmig“.', 'Ein Schlaganfall links verursacht eine kontralaterale, also rechtsseitige Lähmung.'],
    terms: [
      { term: 'Ipsilateral', def: 'Auf derselben Körperseite.', synonyms: ['kontralateral', 'bilateral'] },
      { term: 'Radial', def: 'Zur Daumen- bzw. Speichenseite hin.', synonyms: ['ulnar'] },
      { term: 'Sagittalachse', def: 'Von hinten nach vorn verlaufende Achse.', synonyms: ['Transversalachse', 'Longitudinalachse'] },
    ],
  }),
  wortbildung: upgrade({
    objectives: TERM_UP_OBJ.wortbildung,
    mechanism: [['Schreibweise', 'Lateinische Fachbegriffe behalten c: Cor, Musculus, Cervix, Carcinoma. Eingedeutschte klinische Begriffe werden mit k und z geschrieben: Karzinom, Zervix, Zyste, Kortison. Das c wird vor e, i, y und ä, ö als z gesprochen (Cervix), sonst als k (Cor, Caput). Mischformen wie „Cervixkarzinom“ werden vermieden: entweder Carcinoma cervicis uteri oder Zervixkarzinom.']],
    pitfalls: ['Nicht mischen: Zervixkarzinom oder Carcinoma cervicis – nicht „Cervixkarzinom“.'],
  }),
};

export const TERM_OBJ = {
  dekl: ['die Deklination eines Substantivs am Genitiv Singular erkennen und die fünf lateinischen Deklinationen unterscheiden', 'Genitiv Singular, Nominativ Plural und Genitiv Plural der wichtigsten anatomischen Substantive bilden', 'das Geschlecht lateinischer Substantive aus Endung und Deklination ableiten (mit den wichtigen Ausnahmen)', 'griechische Substantive auf -ma und -sis in der Fachsprache deklinieren'],
  adj: ['Adjektive der a/o-Deklination und der 3. Deklination unterscheiden', 'Adjektive in Kasus, Numerus und Genus an das Substantiv angleichen (Kongruenz)', 'Komparativ und Superlativ anatomischer Adjektive bilden (major, minor, maximus, minimus, superior, inferior)', 'mehrgliedrige anatomische Termini (Substantiv, Attribut, Genitivattribut) richtig bilden und übersetzen'],
  klin: ['Suffixe für Krankheitsbezeichnungen (-itis, -ose, -om, -pathie, -ämie, -urie, -algie) übersetzen und anwenden', 'Suffixe für diagnostische und operative Verfahren (-skopie, -graphie, -tomie, -ektomie, -stomie, -plastik) unterscheiden', 'Präfixe für Zahl, Menge, Lage und Zeit (mono-, bi-, hemi-, poly-, hyper-, hypo-, prä-, post-) anwenden', 'lateinische und griechische Organbezeichnungen und Farbbezeichnungen in klinischen Begriffen erkennen'],
  bew: ['Knochenmerkmale (Caput, Collum, Corpus, Processus, Tuberculum, Tuberositas, Fossa, Foramen, Condylus, Crista, Spina) benennen und zuordnen', 'die Gelenkbewegungen (Flexion, Extension, Abduktion, Adduktion, Rotation, Pronation, Supination, Inversion, Eversion) korrekt verwenden', 'Muskelnamen nach Form, Lage, Funktion, Ursprung und Ansatz entschlüsseln', 'Gefäß- und Nervenbezeichnungen (Arteria, Vena, Nervus, Ramus, Plexus; Mehrzahl) richtig verwenden'],
};

export const TERM_LESSONS2: Lesson[] = [
  L({ id: 'deklinationen', title: 'Substantive und ihre Deklination', subtitle: 'Die fünf Deklinationen, Genitiv und Plural, Genus, griechische Substantive', prerequisites: ['wortbildung'], objectives: TERM_OBJ.dekl,
    overview: 'Die anatomische Nomenklatur ist Latein mit fester Grammatik: Caput humeri, Musculi interossei, Vasa vasorum. Wer am Genitiv die Deklination erkennt, kann jedes Substantiv richtig in den Genitiv und Plural setzen. Im Terminologie-Praktikum und in der Klausur wird genau das geprüft – meist an Begriffen aus dem Bewegungsapparat.',
    mechanism: [
      ['Lexikonform', 'Jedes Substantiv lernt man mit Nominativ, Genitiv Singular und Geschlecht: vertebra, vertebrae f. Erst der Genitiv verrät die Deklination und den Wortstamm (corpus, corporis n → Stamm corpor-).'],
      ['a-Deklination (1.)', 'Genitiv auf -ae, fast immer feminin: vertebra – vertebrae (Gen. Sg.) – vertebrae (Nom. Pl.) – vertebrarum (Gen. Pl.). Beispiele: costa, scapula, fibula, ulna, vena, arteria.'],
      ['o-Deklination (2.)', 'Genitiv auf -i. Maskulin auf -us (musculus – musculi – musculi – musculorum) oder neutrum auf -um (ligamentum – ligamenti – ligamenta – ligamentorum). Neutra haben im Nominativ Plural immer -a.'],
      ['3. Deklination', 'Genitiv auf -is, Nominativ sehr verschieden; der Stamm steht im Genitiv: pes, pedis m; caput, capitis n; os, ossis n (Knochen); os, oris n (Mund); cor, cordis n; foramen, foraminis n; pars, partis f. Plural: -es (m/f) bzw. -a (n), Genitiv Plural -um oder -ium (ossium, partium).'],
      ['u- und e-Deklination (4. und 5.)', '4.: Genitiv auf -us, meist maskulin: processus, processus m – Plural processus, processuum; ductus, sinus, plexus, meatus, arcus, recessus. Neutrum: cornu, cornus. 5.: Genitiv auf -ei: facies, faciei f – Plural facies, facierum; auch series.'],
      ['Griechische Wörter', 'Neutra auf -ma (3. Dekl.): carcinoma, carcinomatis – Plural carcinomata; stoma, stomatis; trauma. Feminina auf -sis: diagnosis, diagnosis – Plural diagnoses; analysis, anastomosis, epiphysis.'],
    ],
    depth: ['Die Endung -us ist vieldeutig: musculus (2. Dekl., Gen. musculi), processus (4. Dekl., Gen. processus), corpus (3. Dekl. neutrum, Gen. corporis), tempus. Deshalb immer den Genitiv mitlernen.', 'Merkhilfe Genus: Bäume, Länder, Städte sind feminin; auf -or meist maskulin (tumor), auf -io/-tio feminin (regio, articulatio), auf -men, -ma und -ut neutrum (foramen, carcinoma, caput).'],
    equations: ['Genitiv Sg.: 1. -ae · 2. -i · 3. -is · 4. -us · 5. -ei', 'Nominativ Pl. Neutrum immer -a'],
    pitfalls: ['Musculus und processus enden beide auf -us, gehören aber zu verschiedenen Deklinationen.', 'Os, ossis (Knochen) und os, oris (Mund) nicht verwechseln.', 'Neutra bilden den Plural immer auf -a: ligamentum → ligamenta, foramen → foramina, corpus → corpora.'],
    terms: [
      { term: 'Deklination', def: 'Formenbildung eines Substantivs oder Adjektivs nach Kasus, Numerus und Genus.' },
      { term: 'Genitiv', def: 'Kasus der Zugehörigkeit („des …“), z. B. Caput humeri.', synonyms: ['Genitivattribut'] },
      { term: 'Nominativ', def: 'Grundform („wer/was?“) eines Substantivs.' },
      { term: 'Genus', def: 'Grammatisches Geschlecht: maskulin, feminin, neutrum.' },
      { term: 'Wortstamm', def: 'Teil des Wortes, an den die Endungen treten; in der 3. Deklination aus dem Genitiv abzulesen.' },
    ],
    links: ['wortbildung', 'adjektive-termini'], locator: 'Grammatik der Nomenklatur (Termini generales)' }),

  L({ id: 'adjektive-termini', title: 'Adjektive, Kongruenz und mehrgliedrige Termini', subtitle: 'a/o- und 3. Deklination, Steigerung, Genitivattribute, Übersetzen', prerequisites: ['deklinationen'], objectives: TERM_OBJ.adj,
    overview: 'Anatomische Namen bestehen meist aus einem Substantiv und Attributen: Musculus biceps brachii, Arteria carotis communis sinistra, Ligamentum collaterale tibiale. Das Adjektiv richtet sich in Kasus, Numerus und Geschlecht nach seinem Substantiv – das ist die häufigste Fehlerquelle in der Terminologieklausur.',
    mechanism: [
      ['a/o-Adjektive', 'Drei Endungen: -us (m), -a (f), -um (n): musculus longus, vena magna, ligamentum latum. Dekliniert wie die 1. und 2. Deklination.'],
      ['Adjektive der 3. Deklination', 'Meist zwei Endungen: -is (m/f), -e (n): nervus femoralis, arteria femoralis, ligamentum collaterale. Einige sind einendig (eine Form für alle Geschlechter): simplex, biceps, triceps. Plural m/f -es, n -ia: nervi femorales, ligamenta collateralia. Achtung: dexter, dextra, dextrum und sinister, sinistra, sinistrum gehören zur a/o-Deklination.'],
      ['Kongruenz', 'Das Adjektiv übernimmt Kasus, Numerus und Genus des Substantivs – nicht dessen Endung: vena (f) magna, aber facies (f) anterior; os (n) longum; musculi (m, Pl.) interossei.'],
      ['Steigerung', 'Komparativ: -ior (m/f), -ius (n): major/majus, minor/minus, superior/superius, inferior/inferius, anterior/anterius, posterior/posterius. Superlativ: -issimus oder unregelmäßig: maximus, minimus, longissimus. Musculus gluteus maximus, Tuberculum majus, Musculus pectoralis minor.'],
      ['Aufbau eines Terminus', 'Reihenfolge: Substantiv – adjektivisches Attribut – Genitivattribut (mit eigenem Attribut): Musculus flexor digitorum superficialis = oberflächlicher Beuger der Finger. Caput longum musculi bicipitis brachii = langer Kopf des zweiköpfigen Armmuskels.'],
      ['Übersetzen', 'Von hinten nach vorn erschließen: Arteria circumflexa humeri posterior → hintere den Oberarm umgreifende Arterie. Fossa cranii media → mittlere Schädelgrube.'],
    ],
    depth: ['Biceps ist ein einendiges Adjektiv der 3. Deklination (biceps, bicipitis): Musculus biceps brachii, Genitiv musculi bicipitis brachii. Ebenso triceps, quadriceps.', 'Viele Adjektive auf -alis/-aris bezeichnen eine Zugehörigkeit: femoralis (zum Oberschenkel), brachialis (zum Arm), plantaris (zur Fußsohle), vertebralis (zum Wirbel).'],
    equations: ['a/o: -us, -a, -um', '3. Dekl.: -is, -is, -e', 'Komparativ: -ior (m/f), -ius (n)'],
    pitfalls: ['Das Adjektiv richtet sich nach dem Genus, nicht nach der Endung des Substantivs (facies anterior, nicht „facies anteria“).', 'Plural der Neutra auch beim Adjektiv auf -a bzw. -ia (ligamenta collateralia).', 'Major und minor sind Komparative („größer“, „kleiner“), maximus und minimus Superlative.'],
    terms: [
      { term: 'Kongruenz', def: 'Übereinstimmung von Adjektiv und Substantiv in Kasus, Numerus und Genus.' },
      { term: 'Komparativ', def: 'Erste Steigerungsstufe, z. B. major, minor, superior.', synonyms: ['Superlativ'] },
      { term: 'Attribut', def: 'Beifügung zu einem Substantiv: Adjektiv oder Genitiv.', synonyms: ['Genitivattribut'] },
      { term: 'Dexter, sinister', def: 'Rechts, links (a/o-Adjektive).' },
    ],
    links: ['deklinationen', 'bewegungsapparat-termini'], locator: 'Grammatik der Nomenklatur' }),

  L({ id: 'klinische-termini', title: 'Klinische Fachsprache', subtitle: 'Krankheits- und Verfahrensbezeichnungen, Zahl- und Lagepräfixe, Organwurzeln, Farben', prerequisites: ['wortbildung'], objectives: TERM_OBJ.klin,
    overview: 'Klinische Begriffe sind wie Baukästen: Ein Wortstamm für das Organ, ein Suffix für die Art der Veränderung oder des Eingriffs, dazu ein Präfix für Lage, Zahl oder Ausmaß. Wer rund hundert Bausteine kennt, versteht die meisten Arztbriefe – Cholezystektomie, Polyneuropathie, Hyperkaliämie oder Gastroskopie.',
    mechanism: [
      ['Krankheitssuffixe', '-itis: Entzündung (Appendizitis). -ose: nicht entzündliche, oft degenerative Erkrankung oder Zustand (Arthrose, Osteoporose, Zyanose). -om: Geschwulst (Lipom, Karzinom, Hämatom). -pathie: Erkrankung allgemein (Kardiomyopathie). -algie bzw. -dynie: Schmerz. -ämie: im Blut (Anämie, Hyperkaliämie). -urie: im Harn (Hämaturie, Proteinurie). -penie: Mangel (Leukopenie). -zytose: Vermehrung von Zellen (Leukozytose).'],
      ['Verfahrenssuffixe', '-skopie: Betrachtung, Spiegelung (Koloskopie). -graphie/-gramm: Aufzeichnung bzw. ihr Ergebnis (Elektrokardiographie, EKG). -tomie: Schnitt, Eröffnung (Laparotomie). -ektomie: Entfernung (Appendektomie). -stomie: operativ angelegte Öffnung (Tracheostomie, Kolostomie). -plastik: Wiederherstellung (Rhinoplastik). -pexie: Fixierung. -zentese: Punktion (Amniozentese).'],
      ['Zahl und Menge', 'mono-/uni- (eins), bi-/di- (zwei), tri- (drei), hemi-/semi- (halb), poly-/multi- (viel), oligo- (wenig), pan- (alles). hyper- (über), hypo- (unter), normo- (normal), an-/a- (ohne), dys- (gestört), eu- (gut).'],
      ['Lage und Zeit', 'prä-/ante- (vor), post- (nach), peri- (um herum), para- (neben), endo-/intra- (innen), exo-/extra- (außen), epi-/supra- (auf, über), sub-/infra- (unter), inter- (zwischen), trans- (hindurch), retro- (hinter), ana- (hinauf), kata- (herab).'],
      ['Organwurzeln', 'Lateinisch vs. griechisch: ren – nephros (Niere), hepar – hepar (Leber), pulmo – pneumon (Lunge), cor – kardia (Herz), os – osteon (Knochen), cutis – derma (Haut), vena – phleps (Vene), mamma – mastos (Brust), uterus – hystera/metra, intestinum – enteron. Anatomisch meist lateinisch (renal), klinisch meist griechisch (Nephritis).'],
      ['Farben', 'erythro- (rot), leuko- (weiß), melano- (schwarz), zyano- (blau), chloro- (grün), xantho- (gelb), ikter- (gelb, Gelbsucht). Erythrozyt, Leukämie, Melanom, Zyanose, Ikterus.'],
    ],
    depth: ['Achtung bei -stomie: Gastrostomie ist eine Magenfistel nach außen (z. B. PEG), Gastrektomie die Magenentfernung, Gastrotomie die Eröffnung des Magens.', 'Das Suffix -om bedeutet nicht automatisch bösartig: Lipom, Fibrom und Adenom sind gutartig; bösartig sind Karzinome (Epithel) und Sarkome (Binde- und Stützgewebe). Ein Hämatom ist gar keine Geschwulst, sondern ein Bluterguss.'],
    equations: ['Präfix + Organwurzel + Suffix', 'Beispiel: Peri-kard-itis'],
    pitfalls: ['-tomie (Schnitt), -ektomie (Entfernung), -stomie (Öffnung) nicht verwechseln.', '-ose ist keine Entzündung: Arthrose ≠ Arthritis.', 'Hypo- (unter) und hyper- (über) genau unterscheiden: Hypoglykämie = Unterzuckerung.'],
    terms: [
      { term: '-itis', def: 'Suffix für Entzündung.', synonyms: ['-ose', '-om'] },
      { term: '-ektomie', def: 'Suffix für operative Entfernung.', synonyms: ['-tomie', '-stomie'] },
      { term: '-skopie', def: 'Suffix für Betrachtung bzw. Spiegelung.', synonyms: ['-graphie'] },
      { term: 'Karzinom', def: 'Bösartiger Tumor des Epithelgewebes.', synonyms: ['Sarkom'] },
      { term: 'Zyanose', def: 'Blaufärbung von Haut und Schleimhaut durch Sauerstoffmangel.' },
      { term: 'Ikterus', def: 'Gelbfärbung durch Bilirubin.', synonyms: ['Gelbsucht'] },
    ],
    links: ['wortbildung', 'deklinationen'], locator: 'Klinische Terminologie' }),

  L({ id: 'bewegungsapparat-termini', title: 'Termini des Bewegungsapparats', subtitle: 'Knochenmerkmale, Gelenkbewegungen, Muskelnamen, Gefäße und Nerven', prerequisites: ['lagebezeichnungen', 'adjektive-termini'], objectives: TERM_OBJ.bew,
    overview: 'Im ersten Semester begegnet Kim die Terminologie vor allem am Bewegungsapparat: Höcker, Fortsätze und Gruben am Knochen, Bewegungen in den Gelenken und lange Muskelnamen. Die Begriffe sind fast immer beschreibend – wer sie übersetzt, weiß schon viel über die Struktur: Ein Tuberculum ist ein kleiner Höcker, der Musculus flexor carpi ulnaris ein ulnarer Beuger der Handwurzel.',
    mechanism: [
      ['Knochenteile', 'Caput (Kopf), Collum (Hals), Corpus (Körper), Basis (Grund), Apex (Spitze). Erhebungen: Processus (Fortsatz), Tuber (großer Höcker), Tuberculum (kleiner Höcker), Tuberositas (raue Ansatzfläche), Crista (Kamm), Spina (Dorn), Linea (Linie), Condylus (Gelenkknorren), Epicondylus (Knorren auf dem Condylus).'],
      ['Vertiefungen und Öffnungen', 'Fossa (Grube), Fovea (kleine Grube), Incisura (Einschnitt), Sulcus (Furche), Foramen (Loch), Canalis (Kanal), Meatus (Gang), Sinus (Höhle), Facies (Fläche), Margo (Rand), Facies articularis (Gelenkfläche).'],
      ['Gelenkbewegungen', 'Flexion (Beugung) – Extension (Streckung); Abduktion (Abspreizen vom Körper) – Adduktion (Heranführen); Innenrotation – Außenrotation; Pronation (Handfläche nach unten bzw. hinten) – Supination (nach oben bzw. vorn); am Fuß Inversion bzw. Supination (Sohle nach innen) – Eversion bzw. Pronation (nach außen); Dorsalextension – Plantarflexion; Opposition des Daumens; Zirkumduktion (Kreiselbewegung).'],
      ['Muskelnamen', 'Nach Form: deltoideus (dreieckig), trapezius, rhomboideus, serratus (gesägt), biceps/triceps/quadriceps (Köpfe). Nach Lage: pectoralis, brachialis, femoris, tibialis anterior. Nach Funktion: flexor, extensor, abductor, adductor, supinator, pronator, levator, depressor. Nach Ursprung und Ansatz: sternocleidomastoideus, coracobrachialis. Nach Größe: major, minor, longus, brevis, maximus.'],
      ['Gefäße und Nerven', 'Arteria, Arteriae (A., Aa.); Vena, Venae (V., Vv.); Nervus, Nervi (N., Nn.); Ramus, Rami (R., Rr.) = Ast; Plexus (Geflecht, 4. Dekl., Pl. plexus); Musculus, Musculi (M., Mm.); Ligamentum, Ligamenta (Lig., Ligg.).'],
    ],
    depth: ['Der Name verrät oft die Funktion: M. extensor carpi radialis longus = langer radialer Strecker der Handwurzel, also Streckung und Radialabduktion im Handgelenk. M. flexor digitorum profundus = tiefer Fingerbeuger.', 'Die Neutral-Null-Methode beschreibt Bewegungsumfänge: Ellenbogen Extension/Flexion 0–0–150° bedeutet volle Streckung bis 0° und Beugung bis 150°.'],
    equations: ['A./Aa., V./Vv., N./Nn., M./Mm., Lig./Ligg., R./Rr.'],
    pitfalls: ['Tuberculum (kleiner Höcker) ≠ Tuberositas (raue Fläche) ≠ Tuber (großer Höcker).', 'Pronation und Supination am Fuß werden oft als Eversion und Inversion bezeichnet – die Richtung genau lernen.', 'Condylus ist der Gelenkknorren, Epicondylus der darauf sitzende Vorsprung für Muskelursprünge.'],
    terms: [
      { term: 'Processus', def: 'Fortsatz eines Knochens.', synonyms: ['Proc.'] },
      { term: 'Tuberositas', def: 'Raue Fläche als Sehnenansatz.', synonyms: ['Tuberculum', 'Tuber'] },
      { term: 'Foramen', def: 'Loch, Öffnung im Knochen.', synonyms: ['Foramina'] },
      { term: 'Condylus', def: 'Gelenkknorren.', synonyms: ['Epicondylus'] },
      { term: 'Pronation', def: 'Einwärtsdrehung des Unterarms (Handfläche nach unten).', synonyms: ['Supination'] },
      { term: 'Abduktion', def: 'Abspreizen von der Körpermitte.', synonyms: ['Adduktion'] },
    ],
    links: ['knochen', 'gelenke', 'muskellehre', 'obere-extremitaet', 'untere-extremitaet'], locator: 'Termini generales; Systema skeletale; Systema musculare' }),
];

export const TERM_ORDER = ['lagebezeichnungen', 'wortbildung', 'deklinationen', 'adjektive-termini', 'bewegungsapparat-termini', 'klinische-termini'];

export const TERM_TOPICS: Record<string, TopicExtra> = {
  deklinationen: {
    hint: 'Genitiv Singular verrät die Deklination: -ae (1.), -i (2.), -is (3.), -us (4.), -ei (5.).',
    quiz: [
      { head: 'vertebra', q: 'Genitiv Singular?', answer: 'vertebrae', options: ['vertebrae', 'vertebri', 'vertebris', 'vertebrarum'], why: 'a-Deklination.' },
      { head: 'musculus', q: 'Nominativ Plural?', answer: 'musculi', options: ['musculi', 'musculus', 'musculae', 'musculorum'], why: 'o-Deklination maskulin.' },
      { head: 'ligamentum', q: 'Nominativ Plural?', answer: 'ligamenta', options: ['ligamenta', 'ligamenti', 'ligamentae', 'ligamentums'], why: 'Neutra: Plural auf -a.' },
      { head: 'processus', q: 'Genitiv Singular?', answer: 'processus', options: ['processus', 'processi', 'processis', 'processae'], why: '4. Deklination – Genitiv auf -us.' },
      { head: 'caput', q: 'Genitiv Singular?', answer: 'capitis', options: ['capitis', 'capi', 'caputis', 'capitae'], why: '3. Deklination, Stamm capit-.' },
      { head: 'os (Knochen)', q: 'Genitiv Plural?', answer: 'ossium', options: ['ossium', 'osorum', 'ossis', 'ora'], why: 'os, ossis n – ossa – ossium.' },
      { head: 'foramen', q: 'Nominativ Plural?', answer: 'foramina', options: ['foramina', 'foramen', 'foramines', 'foramini'], why: 'Stamm foramin-, Neutrum: -a.' },
      { head: 'facies', q: 'Genitiv Singular?', answer: 'faciei', options: ['faciei', 'facies', 'faciae', 'facii'], why: '5. Deklination.' },
      { head: 'carcinoma', q: 'Nominativ Plural?', answer: 'carcinomata', options: ['carcinomata', 'carcinomae', 'carcinomas', 'carcinomi'], why: 'Griechisches Neutrum auf -ma.' },
      { head: 'diagnosis', q: 'Nominativ Plural?', answer: 'diagnoses', options: ['diagnoses', 'diagnosae', 'diagnosi', 'diagnosa'], why: 'Griechisches Femininum auf -sis.' },
      { head: 'cor', q: 'Genitiv Singular?', answer: 'cordis', options: ['cordis', 'cori', 'coris', 'corae'], why: 'cor, cordis n.' },
      { head: 'pes', q: 'Genitiv Singular?', answer: 'pedis', options: ['pedis', 'pesi', 'pedi', 'pesis'], why: 'pes, pedis m.' },
    ],
    tables: [{ title: 'Die fünf Deklinationen', head: ['Deklination', 'Nom. Sg.', 'Gen. Sg.', 'Nom. Pl.', 'Gen. Pl.', 'Genus meist'], rows: [['1. (a)', 'vertebra', 'vertebrae', 'vertebrae', 'vertebrarum', 'f'], ['2. (o) mask.', 'musculus', 'musculi', 'musculi', 'musculorum', 'm'], ['2. (o) neutr.', 'ligamentum', 'ligamenti', 'ligamenta', 'ligamentorum', 'n'], ['3. mask./fem.', 'pes / pars', 'pedis / partis', 'pedes / partes', 'pedum / partium', 'm/f'], ['3. neutr.', 'corpus', 'corporis', 'corpora', 'corporum', 'n'], ['4. (u)', 'processus', 'processus', 'processus', 'processuum', 'm'], ['5. (e)', 'facies', 'faciei', 'facies', 'facierum', 'f']] }],
  },
  'adjektive-termini': {
    hint: 'Das Adjektiv richtet sich nach Genus, Kasus und Numerus – nicht nach der Endung des Substantivs.',
    quiz: [
      { head: 'facies (f) + anterior', q: 'Wie lautet die richtige Verbindung?', answer: 'facies anterior', options: ['facies anterior', 'facies anteria', 'facies anterius', 'facies anterioris'], why: 'Komparativ m/f auf -ior.' },
      { head: 'os (n) + longus', q: 'Wie lautet die richtige Verbindung?', answer: 'os longum', options: ['os longum', 'os longus', 'os longa', 'os longi'], why: 'Neutrum: -um.' },
      { head: 'ligamenta (n, Pl.) + collateralis', q: 'Wie lautet die richtige Verbindung?', answer: 'ligamenta collateralia', options: ['ligamenta collateralia', 'ligamenta collaterales', 'ligamenta collaterala', 'ligamenta collateralis'], why: '3. Dekl. Neutrum Plural: -ia.' },
      { head: 'arteria (f) + femoralis', q: 'Wie lautet die richtige Verbindung?', answer: 'arteria femoralis', options: ['arteria femoralis', 'arteria femorala', 'arteria femorale', 'arteria femoralia'], why: '-is für m und f.' },
      { q: 'Was bedeutet „Musculus gluteus maximus“?', answer: 'größter Gesäßmuskel', options: ['größter Gesäßmuskel', 'größerer Gesäßmuskel', 'langer Gesäßmuskel', 'mittlerer Gesäßmuskel'], why: 'maximus = Superlativ.' },
      { q: 'Wie heißt der Komparativ zu „magnus“ (Neutrum)?', answer: 'majus', options: ['majus', 'major', 'maximum', 'magnum'], why: 'major (m/f), majus (n).' },
      { q: 'Übersetze: Arteria circumflexa humeri posterior', answer: 'hintere den Oberarm umgreifende Arterie', options: ['hintere den Oberarm umgreifende Arterie', 'vordere Oberarmarterie', 'hintere Schulterarterie', 'tiefe Armarterie'], why: 'humeri = Genitiv von humerus.' },
      { q: 'Genitiv von „Musculus biceps brachii“?', answer: 'musculi bicipitis brachii', options: ['musculi bicipitis brachii', 'musculi bicepsi brachii', 'musculus bicipitis brachii', 'musculi biceps brachi'], why: 'biceps, bicipitis (3. Dekl.).' },
      { head: 'nervi (m, Pl.) + spinalis', q: 'Wie lautet die richtige Verbindung?', answer: 'nervi spinales', options: ['nervi spinales', 'nervi spinali', 'nervi spinalia', 'nervi spinalis'], why: '3. Dekl. Plural m/f: -es.' },
    ],
    tables: [{ title: 'Adjektivendungen', head: ['Typ', 'm', 'f', 'n', 'Beispiel'], rows: [['a/o', '-us', '-a', '-um', 'longus, longa, longum'], ['3. Dekl. (zweiendig)', '-is', '-is', '-e', 'femoralis, femorale'], ['Komparativ', '-ior', '-ior', '-ius', 'superior, superius'], ['Superlativ', '-us', '-a', '-um', 'maximus, maxima, maximum'], ['Plural 3. Dekl.', '-es', '-es', '-ia', 'femorales, femoralia']] }],
  },
  'klinische-termini': {
    quiz: [
      { head: 'Cholezystektomie', q: 'Was bedeutet der Begriff?', answer: 'Entfernung der Gallenblase', options: ['Entfernung der Gallenblase', 'Entzündung der Gallenblase', 'Spiegelung der Gallenblase', 'Gallensteinleiden'], why: 'chole (Galle) + zyst (Blase) + ektomie.' },
      { head: 'Arthrose', q: 'Was bedeutet der Begriff?', answer: 'degenerative Gelenkerkrankung', options: ['degenerative Gelenkerkrankung', 'Gelenkentzündung', 'Gelenkspiegelung', 'Gelenkschmerz'], why: '-ose: nicht entzündlich.' },
      { head: 'Tracheostomie', q: 'Was bedeutet der Begriff?', answer: 'operativ angelegte Öffnung der Luftröhre', options: ['operativ angelegte Öffnung der Luftröhre', 'Entfernung der Luftröhre', 'Luftröhrenentzündung', 'Luftröhrenspiegelung'], why: '-stomie: Öffnung nach außen.' },
      { head: 'Leukopenie', q: 'Was bedeutet der Begriff?', answer: 'Mangel an weißen Blutkörperchen', options: ['Mangel an weißen Blutkörperchen', 'Vermehrung weißer Blutkörperchen', 'Blutkrebs', 'weiße Haut'], why: 'leuko (weiß) + penie (Mangel).' },
      { head: 'Hämaturie', q: 'Was bedeutet der Begriff?', answer: 'Blut im Urin', options: ['Blut im Urin', 'Harnverhalt', 'Blutarmut', 'Bluterbrechen'], why: 'häm (Blut) + urie (Harn).' },
      { head: 'Polyneuropathie', q: 'Was bedeutet der Begriff?', answer: 'Erkrankung vieler peripherer Nerven', options: ['Erkrankung vieler peripherer Nerven', 'Entzündung eines Nervs', 'Nervenschmerz', 'Nervenentfernung'], why: 'poly (viele) + neuro + pathie.' },
      { head: 'Zyanose', q: 'Was bedeutet der Begriff?', answer: 'Blaufärbung von Haut und Schleimhäuten', options: ['Blaufärbung von Haut und Schleimhäuten', 'Gelbfärbung', 'Rötung', 'Blässe'], why: 'zyan (blau).' },
      { head: 'Hemiparese', q: 'Was bedeutet der Begriff?', answer: 'Halbseitenlähmung (unvollständig)', options: ['Halbseitenlähmung (unvollständig)', 'Lähmung beider Beine', 'vollständige Lähmung aller Gliedmaßen', 'Muskelschmerz'], why: 'hemi (halb) + parese (unvollständige Lähmung).' },
      { head: 'Nephrolithiasis', q: 'Was bedeutet der Begriff?', answer: 'Nierensteinleiden', options: ['Nierensteinleiden', 'Nierenentzündung', 'Nierenentfernung', 'Nierenspiegelung'], why: 'nephro (Niere) + lith (Stein) + iasis (Zustand).' },
      { head: 'Sarkom', q: 'Was bezeichnet der Begriff?', answer: 'bösartigen Tumor des Binde- und Stützgewebes', options: ['bösartigen Tumor des Binde- und Stützgewebes', 'gutartigen Fetttumor', 'Bluterguss', 'bösartigen Tumor des Epithels'], why: 'Epithel: Karzinom.' },
    ],
    tables: [{ title: 'Organwurzeln lateinisch und griechisch', head: ['Organ', 'lateinisch (Anatomie)', 'griechisch (Klinik)', 'Beispiel'], rows: [['Niere', 'ren → renal', 'nephros', 'Nephritis'], ['Lunge', 'pulmo → pulmonal', 'pneumon', 'Pneumonie'], ['Herz', 'cor → koronar', 'kardia', 'Kardiologie'], ['Knochen', 'os → ossär', 'osteon', 'Osteoporose'], ['Haut', 'cutis → kutan', 'derma', 'Dermatitis'], ['Vene', 'vena → venös', 'phleps', 'Phlebitis'], ['Brust(drüse)', 'mamma', 'mastos', 'Mastitis'], ['Gebärmutter', 'uterus', 'hystera, metra', 'Hysterektomie'], ['Darm', 'intestinum', 'enteron', 'Enteritis'], ['Mund', 'os, oris → oral', 'stoma', 'Stomatitis']] }],
  },
  'bewegungsapparat-termini': {
    quiz: [
      { q: 'Was ist eine Tuberositas?', answer: 'eine raue Fläche für einen Sehnenansatz', options: ['eine raue Fläche für einen Sehnenansatz', 'ein Loch im Knochen', 'ein Gelenkknorren', 'eine Grube'], why: 'z. B. Tuberositas tibiae.' },
      { q: 'Was ist ein Foramen?', answer: 'ein Loch', options: ['ein Loch', 'ein Fortsatz', 'eine Furche', 'ein Kamm'], why: 'z. B. Foramen magnum.' },
      { q: 'Was bedeutet Supination des Unterarms?', answer: 'Auswärtsdrehung – Handfläche nach oben', options: ['Auswärtsdrehung – Handfläche nach oben', 'Einwärtsdrehung – Handfläche nach unten', 'Beugung im Ellenbogen', 'Abspreizen des Arms'], why: 'Suppe tragen.' },
      { q: 'Wie heißt das Abspreizen des Arms vom Körper?', answer: 'Abduktion', options: ['Abduktion', 'Adduktion', 'Flexion', 'Rotation'], why: 'ab = weg.' },
      { head: 'M. flexor carpi ulnaris', q: 'Was macht der Muskel?', answer: 'beugt die Hand und zieht sie ulnarwärts', options: ['beugt die Hand und zieht sie ulnarwärts', 'streckt die Finger', 'beugt den Ellenbogen', 'supiniert den Unterarm'], why: 'flexor (Beuger) carpi (der Handwurzel) ulnaris (ellenseitig).' },
      { q: 'Was bedeutet „deltoideus“?', answer: 'dreieckig (wie ein Delta)', options: ['dreieckig (wie ein Delta)', 'zweiköpfig', 'gesägt', 'rautenförmig'], why: 'Griechischer Buchstabe Δ.' },
      { q: 'Plural von Arteria?', answer: 'Arteriae (Aa.)', options: ['Arteriae (Aa.)', 'Arterii', 'Arterias', 'Arteriis'], why: 'a-Deklination.' },
      { q: 'Wie heißt die Bewegung des Fußes nach oben (Zehen Richtung Schienbein)?', answer: 'Dorsalextension', options: ['Dorsalextension', 'Plantarflexion', 'Eversion', 'Pronation'], why: 'Zum Fußrücken hin.' },
      { q: 'Was ist ein Epicondylus?', answer: 'ein Vorsprung auf dem Gelenkknorren', options: ['ein Vorsprung auf dem Gelenkknorren', 'eine Gelenkfläche', 'ein Loch über dem Condylus', 'ein Band'], why: 'Ursprung vieler Unterarmmuskeln am Humerus.' },
    ],
    tables: [
      { title: 'Knochenmerkmale', head: ['Terminus', 'Übersetzung', 'Beispiel'], rows: [['Caput', 'Kopf', 'Caput humeri'], ['Collum', 'Hals', 'Collum femoris'], ['Processus', 'Fortsatz', 'Processus spinosus'], ['Tuberculum', 'kleiner Höcker', 'Tuberculum majus'], ['Tuberositas', 'raue Ansatzfläche', 'Tuberositas tibiae'], ['Tuber', 'großer Höcker', 'Tuber ischiadicum'], ['Condylus', 'Gelenkknorren', 'Condylus medialis femoris'], ['Crista', 'Kamm', 'Crista iliaca'], ['Spina', 'Dorn', 'Spina scapulae'], ['Fossa', 'Grube', 'Fossa olecrani'], ['Foramen', 'Loch', 'Foramen obturatum'], ['Incisura', 'Einschnitt', 'Incisura ischiadica major'], ['Sulcus', 'Furche', 'Sulcus nervi radialis']] },
      { title: 'Gelenkbewegungen', head: ['Bewegung', 'Gegenbewegung', 'Beschreibung'], rows: [['Flexion', 'Extension', 'Beugen – Strecken'], ['Abduktion', 'Adduktion', 'Abspreizen – Heranführen'], ['Innenrotation', 'Außenrotation', 'Drehung um die Längsachse'], ['Pronation', 'Supination', 'Unterarm einwärts – auswärts drehen'], ['Dorsalextension', 'Plantarflexion', 'Fuß heben – senken'], ['Eversion (Pronation)', 'Inversion (Supination)', 'Fußaußenrand heben – Fußinnenrand heben']] },
    ],
  },
  lagebezeichnungen: {
    quiz: [
      { q: 'Was bedeutet „radial“ am Unterarm?', answer: 'daumenseitig', options: ['daumenseitig', 'kleinfingerseitig', 'strahlenförmig', 'zur Handfläche hin'], why: 'Zum Radius (Speiche) hin.' },
      { q: 'Was bedeutet „kontralateral“?', answer: 'auf der Gegenseite', options: ['auf der Gegenseite', 'auf derselben Seite', 'beidseitig', 'in der Mitte'], why: 'contra = gegen.' },
      { q: 'Wie heißt die Seite der Fußsohle?', answer: 'plantar', options: ['plantar', 'palmar', 'dorsal', 'tibial'], why: 'planta = Sohle.' },
      { q: 'Welche Ebene teilt den Körper in vorn und hinten?', answer: 'Frontalebene', options: ['Frontalebene', 'Sagittalebene', 'Transversalebene', 'Medianebene'], why: 'Parallel zur Stirn.' },
      { q: 'Um welche Achse erfolgt die Abduktion im Schultergelenk?', answer: 'Sagittalachse', options: ['Sagittalachse', 'Transversalachse', 'Longitudinalachse'], why: 'Bewegung in der Frontalebene.' },
      { q: 'Das Gegenteil von „superficialis“?', answer: 'profundus', options: ['profundus', 'externus', 'medialis', 'distalis'], why: 'oberflächlich – tief.' },
      { q: 'Was bedeutet „fibular“ am Unterschenkel?', answer: 'kleinzehenseitig (zum Wadenbein hin)', options: ['kleinzehenseitig (zum Wadenbein hin)', 'großzehenseitig', 'zur Fußsohle hin', 'zum Knie hin'], why: 'fibula = Wadenbein.' },
    ],
  },
  wortbildung: {
    quiz: [
      { q: 'Welche Schreibweise ist korrekt (eingedeutscht)?', answer: 'Zervixkarzinom', options: ['Zervixkarzinom', 'Cervixkarzinom', 'Zervixcarcinom', 'Cervixcarzinom'], why: 'Eingedeutscht durchgängig mit z und k.' },
      { q: 'Lateinische Schreibweise von „Karzinom des Gebärmutterhalses“?', answer: 'Carcinoma cervicis uteri', options: ['Carcinoma cervicis uteri', 'Karzinoma zervicis uteri', 'Carcinom cervix uterus', 'Carcinoma cervix uteri'], why: 'Genitiv: cervix, cervicis.' },
      { q: 'Wie spricht man das c in „Cervix“?', answer: 'wie z', options: ['wie z', 'wie k', 'wie s', 'wie tsch'], why: 'c vor e, i, y, ae, oe = z.' },
      { q: 'Wie spricht man das c in „Caput“?', answer: 'wie k', options: ['wie k', 'wie z', 'wie s'], why: 'c vor a, o, u = k.' },
      { q: 'Was bedeutet das Präfix „dys-“?', answer: 'gestört, fehlerhaft', options: ['gestört, fehlerhaft', 'zwei', 'ohne', 'gut'], why: 'Dysplasie, Dyspnoe.' },
    ],
  },
};
