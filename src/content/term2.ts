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
  dekl: ['die Deklination eines Substantivs am Genitiv Singular erkennen und die a-, o-, u-, e- und Gemischte Deklination unterscheiden', 'Genitiv Singular, Nominativ Plural und Genitiv Plural der wichtigsten anatomischen Substantive bilden', 'das Geschlecht lateinischer Substantive aus Endung und Deklination ableiten (mit den wichtigen Ausnahmen)', 'griechische Substantive auf -ma, -sis und -itis in der Fachsprache deklinieren', 'in der Gemischten Deklination konsonantische Stämme und i-Stämme unterscheiden (Genitiv Plural -um/-ium, Neutrum Plural -a/-ia) und die Ausnahmen os, cor und vas kennen'],
  adj: ['Adjektive der a- und o-Deklination und der Gemischten Deklination unterscheiden', 'Adjektive in Kasus, Numerus und Genus an das Substantiv angleichen (Kongruenz)', 'Komparativ und Superlativ anatomischer Adjektive bilden (major, minor, maximus, minimus, superior, inferior)', 'mehrgliedrige anatomische Termini (Substantiv, Attribut, Genitivattribut) richtig bilden und übersetzen', 'zweiendige Adjektive auf -is/-e (i-Schema) und auf -or/-us (konsonantisches Schema) sowie einendige Adjektive richtig deklinieren'],
  klin: ['Suffixe für Krankheitsbezeichnungen (-itis, -ose, -om, -pathie, -ämie, -urie, -algie) übersetzen und anwenden', 'Suffixe für diagnostische und operative Verfahren (-skopie, -graphie, -tomie, -ektomie, -stomie, -plastik) unterscheiden', 'Präfixe für Zahl, Menge, Lage und Zeit (mono-, bi-, hemi-, poly-, hyper-, hypo-, prä-, post-) anwenden', 'lateinische und griechische Organbezeichnungen und Farbbezeichnungen in klinischen Begriffen erkennen'],
  bew: ['Knochenmerkmale (Caput, Collum, Corpus, Processus, Tuberculum, Tuberositas, Fossa, Foramen, Condylus, Crista, Spina) benennen und zuordnen', 'die Gelenkbewegungen (Flexion, Extension, Abduktion, Adduktion, Rotation, Pronation, Supination, Inversion, Eversion) korrekt verwenden', 'Muskelnamen nach Form, Lage, Funktion, Ursprung und Ansatz entschlüsseln', 'Gefäß- und Nervenbezeichnungen (Arteria, Vena, Nervus, Ramus, Plexus; Mehrzahl) richtig verwenden'],
};

export const TERM_LESSONS2: Lesson[] = [
  L({ id: 'deklinationen', title: 'Substantive und ihre Deklination', subtitle: 'a-, o-, u-, e- und Gemischte Deklination, Genus, Ausnahmen, griechische Wörter', prerequisites: ['wortbildung'], objectives: TERM_OBJ.dekl,
    overview: 'Die anatomische Nomenklatur ist Latein mit fester Grammatik: Caput humeri, Musculi interossei, Vasa vasorum. Wie in Kims Terminologie-Buch (Kap. 3.2–3.5) unterscheidet man fünf Schemata: a-, o-, u- und e-Deklination und die Gemischte Deklination mit konsonantischen Stämmen und i-Stämmen. Wer am Genitiv Singular die Deklination erkennt und das Genus kennt, kann jedes Substantiv richtig in den Genitiv und Plural setzen – genau das wird in der Klausur geprüft.',
    mechanism: [
      ['Lexikonform', 'Jedes Substantiv lernt man mit Nominativ, Genitiv Singular und Geschlecht: vertebra, vertebrae f. Erst der Genitiv verrät die Deklination und den Wortstamm (corpus, corporis n → Stamm corpor-). Für die Klausur sind die im Buch fett gedruckten Vokabeln unverzichtbar.'],
      ['a-Deklination', 'Nominativ auf -a, fast immer feminin. vertebra – vertebrae (Gen. Sg.) – vertebrae (Nom. Pl.) – vertebrarum (Gen. Pl.); -ae wird wie „ä“ gesprochen. Beispiele: costa, scapula, vena, arteria, fossa. Ausnahmen: griechische Maskulina auf -es/-as werden wie arteria dekliniert (diabetes, diabetae; ascites, psoas); griechische Feminina auf -e haben den Genitiv -es (acne, acnes, Pl. acnae, acnarum; ebenso raphe, phlegmone, perone, psyche, aloe). Pluralia tantum: rubeolae (Röteln).'],
      ['o-Deklination: Maskulina', 'Nominativ auf -us (selten -er), Genitiv auf -i: musculus – musculi – musculi – musculorum. Bei -er gehört das e nicht immer zum Stamm: puer, pueri, aber cancer, cancri. Besonderheiten: vir, viri; das einzige anatomisch relevante Femininum ist diameter, diametri f; Pluralia tantum gemini (Zwillinge) und morbilli (Masern).'],
      ['o-Deklination: Neutra', 'Nominativ auf -um oder (griechisch) -on, Genitiv -i, Nominativ Plural immer -a: ligamentum – ligamenti – ligamenta – ligamentorum; colon – coli – cola – colorum (ebenso ganglion, acromion). Virus gehört trotz -us zu den Neutra. Grundregel für alle Deklinationen: Neutra enden im Nominativ Plural auf -a.'],
      ['u-Deklination', 'Maskulina auf -us mit Genitiv -us (lang gesprochen): ductus – ductus – ductus – ductuum; ebenso processus, plexus, meatus, sinus, arcus, recessus, tractus. Optisch wie die o-Deklination – deshalb Genitiv mitlernen. Einziges relevantes Femininum: manus, manus f (Hand). Neutra auf -u: cornu – cornus – cornua – cornuum; genu (Knie). Adjektive nach der u-Deklination gibt es nicht.'],
      ['e-Deklination', 'Nominativ auf -ies, Genitiv -iei, Plural -ies, Genitiv Plural -ierum: facies – faciei – facies – facierum. Relevante Feminina: caries, facies, species; dazu die Krankheitsnamen rabies (Tollwut) und scabies (Krätze); maskulin nur dies (Tag, „pro die“). Auch hier gibt es keine eigenen Adjektive.'],
      ['Gemischte Deklination: konsonantische Stämme', 'Genitiv Singular -is, Nominativ Plural -es (m/f) bzw. -a (n), Genitiv Plural -um. Den Stamm liefert der Genitiv. Maskulina: -or, -oris (tumor); -x, -cis (apex, apicis); -ps, -pis; -er; -o, -onis/-inis; -as, -antis. Feminina: -io, -ionis (regio, articulatio); -tas, -tatis; -itis, -itidis (arthritis, Pl. arthritides); -ix, -icis (cervix, varix); -as, -adis; -is, -idis (carotis). Neutra: -men, -minis (foramen); -ma, -matis (chiasma, carcinoma); -us, -oris/-eris (corpus, tuber); -ut, -itis (caput); -ur, -oris.'],
      ['Gemischte Deklination: i-Stämme', 'Genitiv Plural -ium, Neutra im Nominativ Plural -ia. Maskulina und Feminina: die „gleichsilbigen“ Wörter auf -is/-es (cutis, cutis f; canalis m; auch alle griechischen Feminina auf -sis, -osis, -iasis: diagnosis, narcosis, Pl. diagnoses, Gen. Pl. diagnosium) und Wörter mit zwei Konsonanten vor der Endung (dens, dentis; pars, partis; mons, frons). Neutra auf -e, -al, -ar: rete – retis – retia – retium; animal, calcar. Das Genus muss man hier mitlernen.'],
      ['Die drei Ausnahmen', 'os – ossis – ossa – ossium n (Knochen); cor – cordis – corda – cordium n (Herz); vas – vasis – vasa – vasorum n (Gefäß, Plural nach der o-Deklination). Nicht verwechseln: os, oris n (Mund).'],
    ],
    depth: ['Die Endung -us ist vieldeutig: musculus (o-Dekl., Gen. musculi), processus (u-Dekl., Gen. processus), corpus (Gemischte Dekl., Neutrum, Gen. corporis), virus (o-Dekl., Neutrum). Deshalb immer Genitiv und Genus mitlernen.', 'Den Stamm der Gemischten Deklination merkt man sich über Fremdwörter: Funktion, Region, Station (-io, -ionis), Extremität (-tas, -tatis), Varizen (varix, varicis), Karotiden (carotis, carotidis), Kapitel (caput, capitis), Abdominalschmerz (abdomen, abdominis).', 'Merkhilfe Genus: -or meist maskulin (tumor), -io/-tio und -tas feminin (regio, extremitas), -men, -ma, -ut und -us/-oris neutrum (foramen, carcinoma, caput, corpus). Im Deutschen bleibt das Genus oft erhalten: die Funktion, die Appendix, das Asthma, das Trauma.', 'Viele Lehrbücher nummerieren die Deklinationen: a = 1., o = 2., Gemischte = 3., u = 4., e = 5. Kims Buch nutzt nur die Buchstaben-Namen.'],
    equations: ['Gen. Sg.: a -ae · o -i · u -us · e -ei · Gemischte -is', 'Gen. Pl.: konsonantische Stämme -um · i-Stämme -ium', 'Nom. Pl. Neutrum immer -a (i-Stämme -ia)'],
    pitfalls: ['Musculus (o), processus (u) und corpus (Gemischte) enden alle auf -us, gehören aber zu verschiedenen Deklinationen.', 'Genitiv Plural: foraminum, carotidum (konsonantisch) – aber cutium, dentium, partium, retium (i-Stämme).', 'Os, ossis (Knochen) und os, oris (Mund) nicht verwechseln; vas bildet den Plural vasa, vasorum.', 'Neutra bilden den Plural immer auf -a: ligamenta, foramina, corpora, cornua – bei i-Stämmen -ia: retia.'],
    terms: [
      { term: 'Deklination', def: 'Formenbildung eines Substantivs oder Adjektivs nach Kasus, Numerus und Genus.' },
      { term: 'Genitiv', def: 'Kasus der Zugehörigkeit („des …“), z. B. Caput humeri.', synonyms: ['Genitivattribut'] },
      { term: 'Nominativ', def: 'Grundform („wer/was?“) eines Substantivs.' },
      { term: 'Genus', def: 'Grammatisches Geschlecht: maskulin, feminin, neutrum.' },
      { term: 'Wortstamm', def: 'Teil des Wortes, an den die Endungen treten; in der Gemischten Deklination aus dem Genitiv abzulesen.' },
      { term: 'Gemischte Deklination', def: 'Schema mit Genitiv Singular -is; unterteilt in konsonantische Stämme (Gen. Pl. -um) und i-Stämme (Gen. Pl. -ium).', synonyms: ['3. Deklination', 'konsonantische Stämme', 'i-Stämme'] },
      { term: 'Gleichsilbig', def: 'Nominativ und Genitiv Singular haben gleich viele Silben (cutis, cutis) – Kennzeichen vieler i-Stämme.' },
      { term: 'Plurale tantum', def: 'Wort, das nur im Plural vorkommt: rubeolae, morbilli, gemini, nares.' },
    ],
    links: ['wortbildung', 'adjektive-termini'], locator: 'Terminologie-Buch Kap. 3.2 (a-/o-Dekl.), 3.4 (u-/e-Dekl.), 3.5 (Gemischte Dekl.)' }),

  L({ id: 'adjektive-termini', title: 'Adjektive, Kongruenz und mehrgliedrige Termini', subtitle: 'a/o-Adjektive, zwei- und einendige Adjektive, Steigerung, Genitivattribute, Übersetzen', prerequisites: ['deklinationen'], objectives: TERM_OBJ.adj,
    overview: 'Anatomische Namen bestehen meist aus einem Substantiv und Attributen: Musculus biceps brachii, Arteria carotis communis sinistra, Ligamentum collaterale tibiale. Das Adjektiv richtet sich in Kasus, Numerus und Genus nach seinem Substantiv – das ist die häufigste Fehlerquelle in der Terminologieklausur. Kims Buch (Kap. 3.3, 3.6, 3.7) unterscheidet dafür drei Adjektivgruppen.',
    mechanism: [
      ['Nennform', 'Im Vokabelverzeichnis steht das Adjektiv in der „Nennform“ = Maskulinum Nominativ Singular (z. B. cardialis, convergens, capitatus). An das Substantiv wird dann die Endung angehängt, die zu seinem Genus passt. Zwei Fragen in dieser Reihenfolge: a) Welches Genus hat das Substantiv? b) Wie heißt die passende Adjektivendung?'],
      ['a/o-Adjektive (dreiendig)', 'Nennform -us: -us (m), -a (f), -um (n), dekliniert nach a- und o-Deklination: musculus longus, vena magna, ligamentum latum. Einige enden auf -er, dabei muss man lernen, ob das e bleibt: e bleibt bei liber, asper, alter und dem Suffix -fer (lactifer); e fällt weg bei niger, nigra, nigrum; ruber, rubra; sacer, sacra; integer; glaber; sinister, sinistra, sinistrum; beides belegt bei dexter, dext(e)ra, dext(e)rum.'],
      ['Zweiendige Adjektive auf -is, -e (i-Schema)', 'Nennform -is: -is (m und f), -e (n); dekliniert wie cutis bzw. rete: Plural -es (m/f), -ia (n), Genitiv Plural -ium. Arteria femoralis, nervus femoralis, os frontale – Ossa frontalia, Ossium frontalium; margines laterales, marginum lateralium.'],
      ['Zweiendige Adjektive auf -or, -us (konsonantisches Schema)', 'Nennform -or: -or (m und f), -us (n); dekliniert wie tumor bzw. corpus: Genitiv -oris, Plural -ores bzw. -ora, Genitiv Plural -orum. Ala major, alae majoris, alae majores, alarum majorum; Tuber majus, tuberis majoris, tubera majora, tuberum majorum. Das sind die Komparative: major (maior) – größer, minor – kleiner, anterior, posterior, superior, inferior, exterior, interior, prior; plures (mehrere, nur Plural).'],
      ['Einendige Adjektive', 'Eine Form für alle drei Genera (meist -ns oder -x): nervus abducens, vas afferens/efferens, arteria descendens, membrana simplex; dekliniert nach dem i-Schema (abducens, abducentis; Gen. Pl. -ium). Nach dem konsonantischen Schema: biceps, bicipitis; triceps, tricipitis; quadriceps, quadricipitis (Gen. Pl. -um). Musculus biceps brachii, Genitiv musculi bicipitis brachii.'],
      ['Kongruenz: die acht Endungen', 'Nennform -us → m -us, f -a, n -um. Nennform -is → m/f -is, n -e. Nennform -or → m/f -or, n -us. Einendig (-ns, -x) → bleibt in allen drei Genera gleich. Beispiele aus dem Buch: Asthma (n, -ma) + cardialis → Asthma cardiale; Strabismus (m) + convergens → Strabismus convergens; Os (n) + capitatus → Os capitatum. Das Adjektiv übernimmt das Genus des Substantivs, nicht dessen Endung: vena (f) magna, aber facies (f) anterior.'],
      ['Steigerung', 'Komparativ: -ior (m/f), -ius (n) – siehe die -or/-us-Gruppe. Superlativ auf -issimus, -a, -um (Musculus latissimus dorsi = breitester Rückenmuskel) oder unregelmäßig: maximus, minimus. Musculus gluteus maximus, Tuberculum majus, Musculus pectoralis minor.'],
      ['Aufbau eines Terminus', 'Reihenfolge: Substantiv – adjektivisches Attribut – Genitivattribut (mit eigenem Attribut): Musculus flexor digitorum superficialis = oberflächlicher Beuger der Finger. Caput longum musculi bicipitis brachii = langer Kopf des zweiköpfigen Armmuskels. Übersetzen von hinten nach vorn: Arteria circumflexa humeri posterior → hintere den Oberarm umgreifende Arterie.'],
    ],
    depth: ['Gleiche Endung heißt nicht gleiches Schema: Plural von Tuber majus ist Tubera majora (konsonantisch, -a), von Os frontale aber Ossa frontalia (i-Schema, -ia).', 'Viele Adjektive auf -alis/-aris bezeichnen eine Zugehörigkeit: femoralis (zum Oberschenkel), brachialis (zum Arm), plantaris (zur Fußsohle), vertebralis (zum Wirbel).', 'Komparative beschreiben relative Größen: Tuber majus ist der größere von zwei Höckern, nicht ein absolut großer – deshalb ist der Komparativ in der Anatomie exakter als „großer Höcker“.'],
    equations: ['-us, -a, -um (a/o)', '-is, -is, -e (i-Schema): Pl. -es/-ia, Gen. Pl. -ium', '-or, -or, -us (konsonantisch): Pl. -ores/-ora, Gen. Pl. -orum', 'einendig: -ns/-x für alle Genera'],
    pitfalls: ['Das Adjektiv richtet sich nach dem Genus, nicht nach der Endung des Substantivs (facies anterior, nicht „facies anteria“).', 'Neutrum Plural: -ia nur bei -is/-e-Adjektiven (ligamenta collateralia); bei Komparativen -a (tubera majora, nicht „majoria“).', 'Genitiv Plural: frontalium (-ium), aber majorum, bicipitum (-um).', 'Major und minor sind Komparative („größer“, „kleiner“), maximus und minimus Superlative.'],
    terms: [
      { term: 'Kongruenz', def: 'Übereinstimmung von Adjektiv und Substantiv in Kasus, Numerus und Genus.' },
      { term: 'Nennform', def: 'Form des Adjektivs im Vokabelverzeichnis: Maskulinum Nominativ Singular.' },
      { term: 'Zweiendig', def: 'Adjektiv mit gleicher Endung für Maskulinum und Femininum und eigener Neutrumform (-is/-e, -or/-us).', synonyms: ['einendig', 'dreiendig'] },
      { term: 'Einendig', def: 'Adjektiv mit einer Form für alle drei Genera (abducens, simplex, biceps).' },
      { term: 'Komparativ', def: 'Erste Steigerungsstufe, z. B. major, minor, superior.', synonyms: ['Superlativ'] },
      { term: 'Attribut', def: 'Beifügung zu einem Substantiv: Adjektiv oder Genitiv.', synonyms: ['Genitivattribut'] },
      { term: 'Dexter, sinister', def: 'Rechts, links (a/o-Adjektive): dexter, dext(e)ra, dext(e)rum; sinister, sinistra, sinistrum.' },
    ],
    links: ['deklinationen', 'bewegungsapparat-termini'], locator: 'Terminologie-Buch Kap. 3.3 (Adjektive a/o), 3.6 (Adjektive der Gemischten Dekl.), 3.7 (Kongruenz)' }),

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
      ['Gefäße und Nerven', 'Arteria, Arteriae (A., Aa.); Vena, Venae (V., Vv.); Nervus, Nervi (N., Nn.); Ramus, Rami (R., Rr.) = Ast; Plexus (Geflecht, u-Deklination, Pl. plexus); Musculus, Musculi (M., Mm.); Ligamentum, Ligamenta (Lig., Ligg.).'],
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
    hint: 'Genitiv Singular verrät die Deklination: -ae (a), -i (o), -us (u), -ei (e), -is (Gemischte). Dort entscheidet der Stamm über -um oder -ium.',
    quiz: [
      { head: 'vertebra', q: 'Genitiv Singular?', answer: 'vertebrae', options: ['vertebrae', 'vertebri', 'vertebris', 'vertebrarum'], why: 'a-Deklination.' },
      { head: 'musculus', q: 'Nominativ Plural?', answer: 'musculi', options: ['musculi', 'musculus', 'musculae', 'musculorum'], why: 'o-Deklination maskulin.' },
      { head: 'ligamentum', q: 'Nominativ Plural?', answer: 'ligamenta', options: ['ligamenta', 'ligamenti', 'ligamentae', 'ligamentums'], why: 'Neutra: Plural auf -a.' },
      { head: 'processus', q: 'Genitiv Singular?', answer: 'processus', options: ['processus', 'processi', 'processis', 'processae'], why: 'u-Deklination – Genitiv auf -us.' },
      { head: 'caput', q: 'Genitiv Singular?', answer: 'capitis', options: ['capitis', 'capi', 'caputis', 'capitae'], why: 'Gemischte Deklination (konsonantischer Stamm capit-).' },
      { head: 'os (Knochen)', q: 'Genitiv Plural?', answer: 'ossium', options: ['ossium', 'osorum', 'ossis', 'ora'], why: 'Ausnahme: os, ossis n – ossa – ossium.' },
      { head: 'foramen', q: 'Nominativ Plural?', answer: 'foramina', options: ['foramina', 'foramen', 'foramines', 'foramini'], why: 'Stamm foramin-, Neutrum: -a.' },
      { head: 'facies', q: 'Genitiv Singular?', answer: 'faciei', options: ['faciei', 'facies', 'faciae', 'facii'], why: 'e-Deklination.' },
      { head: 'carcinoma', q: 'Nominativ Plural?', answer: 'carcinomata', options: ['carcinomata', 'carcinomae', 'carcinomas', 'carcinomi'], why: 'Griechisches Neutrum auf -ma.' },
      { head: 'diagnosis', q: 'Nominativ Plural?', answer: 'diagnoses', options: ['diagnoses', 'diagnosae', 'diagnosi', 'diagnosa'], why: 'Griechisches Femininum auf -sis.' },
      { head: 'cor', q: 'Genitiv Singular?', answer: 'cordis', options: ['cordis', 'cori', 'coris', 'corae'], why: 'cor, cordis n.' },
      { head: 'pes', q: 'Genitiv Singular?', answer: 'pedis', options: ['pedis', 'pesi', 'pedi', 'pesis'], why: 'pes, pedis m.' },
      { head: 'foramen', q: 'Genitiv Plural?', answer: 'foraminum', options: ['foraminum', 'foraminium', 'foraminorum', 'foramina'], why: 'Konsonantischer Stamm: Genitiv Plural -um.' },
      { head: 'cutis', q: 'Genitiv Plural?', answer: 'cutium', options: ['cutium', 'cutum', 'cutorum', 'cutes'], why: 'i-Stamm (gleichsilbig cutis, cutis): Genitiv Plural -ium.' },
      { head: 'rete', q: 'Nominativ Plural?', answer: 'retia', options: ['retia', 'reta', 'retes', 'retae'], why: 'Neutrum der i-Stämme auf -e: Plural -ia.' },
      { head: 'vas', q: 'Genitiv Plural?', answer: 'vasorum', options: ['vasorum', 'vasium', 'vasum', 'vasarum'], why: 'Ausnahme: vas, vasis, vasa, vasorum (Plural wie o-Deklination).' },
      { head: 'cor', q: 'Genitiv Plural?', answer: 'cordium', options: ['cordium', 'cordum', 'corum', 'cordorum'], why: 'Ausnahme: cor, cordis, corda, cordium.' },
      { head: 'arthritis', q: 'Genitiv Singular?', answer: 'arthritidis', options: ['arthritidis', 'arthritis', 'arthritii', 'arthritae'], why: '-itis, -itidis: konsonantischer Stamm; Plural arthritides.' },
      { head: 'acne', q: 'Genitiv Singular?', answer: 'acnes', options: ['acnes', 'acnae', 'acnis', 'acni'], why: 'Griechisches Femininum auf -e: Genitiv -es, Plural wie a-Deklination (acnae).' },
      { head: 'colon', q: 'Nominativ Plural?', answer: 'cola', options: ['cola', 'coli', 'colones', 'colae'], why: 'o-Deklination, griechisches Neutrum auf -on: Plural -a.' },
      { head: 'manus', q: 'Genus?', answer: 'feminin', options: ['feminin', 'maskulin', 'neutrum', 'je nach Satz'], why: 'Einziges anatomisch relevantes Femininum der u-Deklination.' },
    ],
    tables: [{ title: 'Die Deklinationsschemata (wie im Terminologie-Buch)', head: ['Deklination', 'Nom. Sg.', 'Gen. Sg.', 'Nom. Pl.', 'Gen. Pl.', 'Genus meist'], rows: [['a', 'vertebra', 'vertebrae', 'vertebrae', 'vertebrarum', 'f'], ['o, Maskulina', 'musculus', 'musculi', 'musculi', 'musculorum', 'm'], ['o, Neutra', 'ligamentum / colon', 'ligamenti / coli', 'ligamenta / cola', 'ligamentorum', 'n'], ['u, Maskulina', 'ductus', 'ductus', 'ductus', 'ductuum', 'm (manus f)'], ['u, Neutra', 'cornu', 'cornus', 'cornua', 'cornuum', 'n'], ['e', 'facies', 'faciei', 'facies', 'facierum', 'f (dies m)'], ['Gemischte, konson. m/f', 'tumor / carotis', 'tumoris / carotidis', 'tumores / carotides', 'tumorum / carotidum', 'm/f'], ['Gemischte, konson. n', 'foramen / corpus', 'foraminis / corporis', 'foramina / corpora', 'foraminum / corporum', 'n'], ['Gemischte, i-Stamm m/f', 'cutis / dens', 'cutis / dentis', 'cutes / dentes', 'cutium / dentium', 'm/f'], ['Gemischte, i-Stamm n', 'rete', 'retis', 'retia', 'retium', 'n'], ['Ausnahmen', 'os / cor / vas', 'ossis / cordis / vasis', 'ossa / corda / vasa', 'ossium / cordium / vasorum', 'n']] }],
  },
  'adjektive-termini': {
    hint: 'Erst das Genus des Substantivs bestimmen, dann die passende Endung der Nennform anhängen – nicht die Endung des Substantivs kopieren.',
    quiz: [
      { head: 'facies (f) + anterior', q: 'Wie lautet die richtige Verbindung?', answer: 'facies anterior', options: ['facies anterior', 'facies anteria', 'facies anterius', 'facies anterioris'], why: 'Komparativ m/f auf -ior.' },
      { head: 'os (n) + longus', q: 'Wie lautet die richtige Verbindung?', answer: 'os longum', options: ['os longum', 'os longus', 'os longa', 'os longi'], why: 'Neutrum: -um.' },
      { head: 'ligamenta (n, Pl.) + collateralis', q: 'Wie lautet die richtige Verbindung?', answer: 'ligamenta collateralia', options: ['ligamenta collateralia', 'ligamenta collaterales', 'ligamenta collaterala', 'ligamenta collateralis'], why: 'Adjektiv auf -is/-e (i-Schema): Neutrum Plural -ia.' },
      { head: 'arteria (f) + femoralis', q: 'Wie lautet die richtige Verbindung?', answer: 'arteria femoralis', options: ['arteria femoralis', 'arteria femorala', 'arteria femorale', 'arteria femoralia'], why: '-is für m und f.' },
      { q: 'Was bedeutet „Musculus gluteus maximus“?', answer: 'größter Gesäßmuskel', options: ['größter Gesäßmuskel', 'größerer Gesäßmuskel', 'langer Gesäßmuskel', 'mittlerer Gesäßmuskel'], why: 'maximus = Superlativ.' },
      { q: 'Wie heißt der Komparativ zu „magnus“ (Neutrum)?', answer: 'majus', options: ['majus', 'major', 'maximum', 'magnum'], why: 'major (m/f), majus (n).' },
      { q: 'Übersetze: Arteria circumflexa humeri posterior', answer: 'hintere den Oberarm umgreifende Arterie', options: ['hintere den Oberarm umgreifende Arterie', 'vordere Oberarmarterie', 'hintere Schulterarterie', 'tiefe Armarterie'], why: 'humeri = Genitiv von humerus.' },
      { q: 'Genitiv von „Musculus biceps brachii“?', answer: 'musculi bicipitis brachii', options: ['musculi bicipitis brachii', 'musculi bicepsi brachii', 'musculus bicipitis brachii', 'musculi biceps brachi'], why: 'biceps, bicipitis: einendig, konsonantisches Schema.' },
      { head: 'nervi (m, Pl.) + spinalis', q: 'Wie lautet die richtige Verbindung?', answer: 'nervi spinales', options: ['nervi spinales', 'nervi spinali', 'nervi spinalia', 'nervi spinalis'], why: 'i-Schema: Plural m/f -es.' },
      { head: 'tubera (n, Pl.) + major', q: 'Wie lautet die richtige Verbindung?', answer: 'tubera majora', options: ['tubera majora', 'tubera majoria', 'tubera majores', 'tubera majus'], why: 'Komparative (-or/-us) folgen dem konsonantischen Schema: Neutrum Plural -a.' },
      { head: 'ossa (n, Gen. Pl.) + frontalis', q: 'Wie lautet der Genitiv Plural?', answer: 'ossium frontalium', options: ['ossium frontalium', 'ossium frontalum', 'ossorum frontalorum', 'ossium frontalia'], why: 'os: ossium (Ausnahme); frontalis: i-Schema, -ium.' },
      { head: 'asthma (n) + cardialis', q: 'Wie lautet die richtige Verbindung?', answer: 'asthma cardiale', options: ['asthma cardiale', 'asthma cardialis', 'asthma cardiala', 'asthma cardialum'], why: 'asthma ist ein griechisches Neutrum auf -ma; Neutrum bei -is-Adjektiven: -e.' },
      { head: 'strabismus (m) + convergens', q: 'Wie lautet die richtige Verbindung?', answer: 'strabismus convergens', options: ['strabismus convergens', 'strabismus convergentus', 'strabismus converga', 'strabismus convergum'], why: 'Einendig: Die Form bleibt in allen Genera gleich.' },
      { head: 'linea (f) + asper', q: 'Wie lautet die richtige Verbindung?', answer: 'linea aspera', options: ['linea aspera', 'linea aspra', 'linea asper', 'linea asperis'], why: 'Bei asper bleibt das e erhalten: asper, aspera, asperum.' },
      { head: 'nucleus (m) + ruber', q: 'Genitiv Singular?', answer: 'nuclei rubri', options: ['nuclei rubri', 'nuclei ruberi', 'nucleus rubri', 'nuclei rubris'], why: 'Bei ruber fällt das e weg: ruber, rubra, rubrum.' },
    ],
    tables: [
      { title: 'Kongruenz: Nennform → Endung (Buch Kap. 3.7)', head: ['Nennform', 'm', 'f', 'n', 'Beispiel'], rows: [['-us (a/o)', '-us', '-a', '-um', 'Os capitatum, Vena magna'], ['-er (a/o)', '-er', '-(e)ra', '-(e)rum', 'Linea aspera, Nucleus ruber'], ['-is (zweiendig, i-Schema)', '-is', '-is', '-e', 'Asthma cardiale, Arteria femoralis'], ['-or (zweiendig, konsonantisch)', '-or', '-or', '-us', 'Tuber majus, Ala major'], ['einendig (-ns, -x, -ceps)', 'gleich', 'gleich', 'gleich', 'Strabismus convergens, Musculus biceps']] },
      { title: 'Plural der Adjektive der Gemischten Deklination', head: ['Gruppe', 'Nom. Pl. m/f', 'Nom. Pl. n', 'Gen. Pl.', 'Beispiel'], rows: [['-is, -e (i-Schema)', '-es', '-ia', '-ium', 'Ossa frontalia, Ossium frontalium'], ['-or, -us (konsonantisch)', '-ores', '-ora', '-orum', 'Tubera majora, Tuberum majorum'], ['einendig -ns/-x (i-Schema)', '-ntes / -ces', '-ntia / -cia', '-ntium / -cium', 'Nervi abducentes'], ['biceps, triceps (konsonantisch)', '-cipites', '-cipita', '-cipitum', 'Musculi bicipites']] },
      { title: 'Komparative (Vokabular -or, -us)', head: ['Adjektiv', 'Bedeutung'], rows: [['major, majus', 'größer'], ['minor, minus', 'kleiner'], ['anterior, anterius', 'vorne liegend, der/die vordere'], ['posterior, posterius', 'hinten liegend, der/die hintere'], ['superior, superius', 'oben liegend, der/die obere'], ['inferior, inferius', 'unten liegend, der/die untere'], ['exterior, exterius', 'äußerlich, der/die äußere'], ['interior, interius', 'innerlich, der/die innere'], ['prior, prius', 'früher'], ['plures (nur Plural)', 'mehrere']] },
    ],
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
