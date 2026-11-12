// Klausurrelevante Vokabeln aus Kims Terminologie-Buch (Kap. 3.2–3.6).
// Laut Buch (S. 28) sind die fett gedruckten Vokabeln für die Übersetzungsaufgaben in der Klausur unverzichtbar –
// genau diese sind hier erfasst (abgetippt von Kims Fotos, 12.11.2026), dazu die drei Ausnahmen os, cor, vas
// und die kurzen Listen der Komparative, e-Deklination und u-Neutra.
// Format je Eintrag: „lateinisch | Lexikonform (Genitiv, Genus bzw. weitere Formen) | Bedeutung“.

export interface VocabDeck { id: string; title: string; kap: string; lesson: 'deklinationen' | 'adjektive-termini'; form: string; words: string }
export interface Vocab { deck: string; latin: string; lex: string; de: string }

const DECKS: VocabDeck[] = [
  { id: 'a', title: 'a-Deklination (Feminina auf -a)', kap: '3.2', lesson: 'deklinationen', form: '-ae f', words: `
ala|Flügel; apertura|Öffnung; area|Bezirk, Fläche, Gebiet; arteria|Arterie, Schlagader; axilla|Achselhöhle; bucca|Wange;
bursa|Beutel, Schleimbeutel; capsula|Umhüllung eines Organs, Kapsel; cardia|Mageneingang, Herz; cauda|Schwanz, Schweif; cella|Zelle;
columna|Säule; costa|Rippe; coxa|Hüfte; crista|Kamm, Kante, Leiste; curvatura|Krümmung, Biegung; fascia|Bindegewebshülle;
fibra|Faser; fibula|Wadenbein; fissura|Spalte, Riss; flexura|Biegung, Kurve; fossa|Graben, Grube; glandula|Drüse;
incisura|Einschnitt; lacrima|Träne; linea|Linie, Strich; lingua|Zunge, Sprache; macula|Fleck; mamma|weibliche Brust;
mandibula|Unterkiefer; maxilla|Oberkiefer; medulla|Mark; membrana|Haut, Häutchen, Membran; nucha|Nacken; orbita|Augenhöhle;
palma|Handfläche; papilla|Wärzchen, Erhebung; patella|Kniescheibe; pleura|Brustfell; plica|Falte; poplitea|Kniekehle;
porta|Pforte; prostata|Vorsteherdrüse; pulpa|Zahnmark; pupilla|„Püppchen“, Pupille; retina|Netzhaut; scapula|Schulterblatt;
spina|Dorn, Knochenkamm, Wirbelsäule; sutura|Naht; tibia|Schienbein; tonsilla|Mandel; trachea|Luftröhre; tuba|Trompete, Röhre;
ulna|Elle; urina|Harn; vagina|Scheide; vena|Vene; vertebra|Wirbel; vesica|Blase; zona|Gürtel` },
  { id: 'o-m', title: 'o-Deklination (Maskulina auf -us)', kap: '3.2', lesson: 'deklinationen', form: '-i m', words: `
angulus|Winkel; anulus|Ring; anus|After; carpus|Handwurzel; cubitus|Ellenbogen; digitus|Finger, Zeh; discus|Scheibe;
ductulus|kleiner Gang; fasciculus|Bündelchen; humerus|Oberarmknochen; lobus|Lappen; musculus|Muskel; nasus|Nase; nervus|Nerv;
nodus|Knoten; nucleus|Kern; oculus|Auge; oesophagus|Speiseröhre; radius|Speiche; ramus|Ast; stomachus|Magen;
sulcus|Rinne, Furche; tarsus|Fußwurzel, Lidspalte; tubus|Röhre; uterus|Gebärmutter; ventriculus|Herz- oder Hirnkammer, Ausstülpung, Magen` },
  { id: 'o-n', title: 'o-Deklination (Neutra auf -um/-on)', kap: '3.2', lesson: 'deklinationen', form: '-i n', words: `
acromion|Schulterhöhe; brachium|(Ober-)Arm; caecum|Blinddarm; cavum|Höhle; centrum|Mittelpunkt; cerebellum|Kleinhirn;
cerebrum|Gehirn; collum|Hals; colon|Dickdarm; cranium|Schädel, Kopf; dorsum|Rücken; duodenum|Zwölffingerdarm;
ganglion|Nervenknoten; ileum|unterster Dünndarm; interstitium|Zwischenraum; intestinum|Gedärm; ischium|Hüfte, Gesäß;
jejunum|mittlerer Dünndarm; jugulum|Kehle; labium|Lippe; ligamentum|Band; membrum|Gliedmaße; olecranon|Ellbogenhöcker;
ostium|Mündung, Eingang; ovarium|Eierstock; palatum|Gaumen; rectum|Mastdarm; segmentum|Abschnitt; septum|Trennwand;
sternum|Brustbein; trigonum|Dreieck; tuberculum|Höckerchen` },
  { id: 'adj-ao', title: 'Adjektive der a- und o-Deklination (-us, -a, -um)', kap: '3.3', lesson: 'adjektive-termini', form: '-a, -um', words: `
accessorius|zusätzlich, hinzutretend, Neben-; adductorius|heranführend, dem Heranführen dienend; adiposus|fett, aus Fett bestehend;
arteriosus|aus Arterien bestehend, arteriell; caecus|blind; cardiacus|zum Herzen gehörend, im Mageneingang liegend;
caroticus|zur Halsschlagader gehörend; carpeus|die Handwurzel betreffend; cartilagineus|aus Knorpel bestehend; cavus|hohl;
circumflexus|bogenförmig, herumgebogen; colicus|zum Dickdarm gehörend; cutaneus|zur Haut gehörend, aus Haut bestehend;
cysticus|zur Blase gehörend, aus Blasen bestehend; durus|hart; externus|äußerlich, der äußere; fibrosus|aus Fasern bestehend;
gastricus|zum Magen gehörend; hepaticus|zur Leber gehörend; iliacus|zum Darmbein gehörend; intermedius|dazwischen liegend;
internus|innen liegend, der innere; inversus|umgekehrt; ischiadicus|zum Sitzbein gehörend; latus|breit; longus|lang;
medianus|in der Mitte liegend; medius|der mittlere; motorius|zur Bewegung befähigt, bewegend; obliquus|schräg;
oblongatus|(räumlich) verlängert; opticus|dem Sehen dienend; osseus|knöchern; pelvinus|im Becken liegend;
peroneus|zum Wadenbein gehörend; profundus|tief; proprius|eigen; proximus|der nächste; pubicus|zum Schambein gehörend;
rectus|gerade; rotundus|rund; sensorius|wahrnehmend, der Sinneswahrnehmung dienend; sigmoideus|s-förmig;
spinosus|dornig, mit Dorn versehen; splanchnicus|zu den Eingeweiden gehörend; splenicus|zur Milz gehörend;
tendineus|sehnig, aus Sehne bestehend; thoracicus|zum Brustkorb gehörend; thyroideus|schildförmig, zur Schilddrüse gehörend;
transversus|quer verlaufend; ulcerosus|Geschwüre bildend; uterinus|zur Gebärmutter gehörend; venosus|aus Venen bestehend, reich an Venen` },
  { id: 'u', title: 'u- und e-Deklination', kap: '3.4', lesson: 'deklinationen', form: '', words: `
arcus, -us m|Bogen; ductus, -us m|Gang; hiatus, -us m|Öffnung; meatus, -us m|Gang; plexus, -us m|Geflecht;
processus, -us m|Vorsprung, Fortsatz; recessus, -us m|Vertiefung; sinus, -us m|Ausbuchtung, Höhlung; situs, -us m|Lage, Lagebeziehung;
tractus, -us m|Zug, Strang; manus, -us f|Hand (einziges relevantes Femininum der u-Deklination); cornu, -us n|Horn;
genu, -us n|Knie; caries, -iei f|Fäule; facies, -iei f|Gesicht, Fläche, Seite; species, -iei f|(biologische) Art` },
  { id: 'kons', title: 'Gemischte Deklination: konsonantische Stämme', kap: '3.5', lesson: 'deklinationen', form: '', words: `
abductor, -oris m|Abzieher, Wegführer; adductor, -oris m|Heranführer; depressor, -oris m|Senker; dilatator, -oris m|Erweiterer;
extensor, -oris m|Strecker; flexor, -oris m|Beuger; levator, -oris m|Heber; liquor, -oris m|Flüssigkeit;
pronator, -oris m|Einwärtsdreher; supinator, -oris m|Auswärtsdreher; tensor, -oris m|Spanner; apex, apicis m|Spitze;
cortex, corticis m|Rinde; hallux, hallucis m|Großzehe; index, indicis m|Zeigefinger; lien, lienis m|Milz; margo, marginis m|Rand;
paries, parietis m|Wand; pes, pedis m|Fuß; pollex, pollicis m|Daumen; pulmo, pulmonis m|Lunge; ren, renis m|Niere;
tendo, tendinis m|Sehne; thorax, thoracis m|Brustkorb; appendix, appendicis f|Anhängsel; articulatio, articulationis f|Gelenk;
carotis, carotidis f|Karotte, Halsschlagader; cartilago, cartilaginis f|Knorpel; cervix, cervicis f|Hals; excavatio, excavationis f|Aushöhlung;
extremitas, extremitatis f|Gliedmaße; impressio, impressionis f|Eindruck; portio, portionis f|Anteil; radix, radicis f|Wurzel;
regio, regionis f|Gegend; tuberositas, tuberositatis f|höckrige Stelle, Rauigkeit; abdomen, abdominis n|Bauch; caput, capitis n|Kopf;
chiasma, chiasmatis n|Kreuzung; corpus, corporis n|Körper; crus, cruris n|(Unter-)Schenkel; foramen, foraminis n|Loch, Öffnung;
occiput, occipitis n|Hinterhaupt; pancreas, pancreatis n|Bauchspeicheldrüse; pectus, pectoris n|Brust;
tempora, temporum n (nur Plural)|Schläfen; viscera, viscerum n (nur Plural)|Eingeweide` },
  { id: 'i', title: 'Gemischte Deklination: i-Stämme und Ausnahmen', kap: '3.5', lesson: 'deklinationen', form: '', words: `
basis, basis f|Grundfläche; canalis, canalis m|Kanal; cutis, cutis f|Haut; dens, dentis m|Zahn; frons, frontis f|Stirn;
pars, partis f|Teil; hepar, hepatis n|Leber; rete, retis n|Netz; os, ossis n (Pl. ossa, ossium)|Knochen;
cor, cordis n (Pl. corda, cordium)|Herz; vas, vasis n (Pl. vasa, vasorum)|Gefäß` },
  { id: 'adj-gem', title: 'Adjektive der Gemischten Deklination', kap: '3.6', lesson: 'adjektive-termini', form: '', words: `
abdominalis, -e|zum Bauch gehörend; articularis, -e|zu einem Gelenk gehörend; axillaris, -e|zur Achselhöhle gehörend;
basalis, -e|an der Grundfläche liegend; brachialis, -e|zum (Ober-)Arm gehörend; brevis, -e|kurz;
caudalis, -e|fußwärts („steißwärts“) liegend; centralis, -e|in der Mitte liegend; cerebellaris, -e|das Kleinhirn betreffend;
cerebralis, -e|zum Gehirn gehörend; cervicalis, -e|den Hals betreffend; clavicularis, -e|zum Schlüsselbein gehörend;
communis, -e|gemeinsam; costalis, -e|zur Rippe gehörend; cranialis, -e|kopfwärts liegend; dentalis, -e|zu den Zähnen gehörend;
digitalis, -e|Finger bzw. Zehen betreffend; distalis, -e|rumpffern liegend; dorsalis, -e|am Rücken liegend, rückenseitig;
duodenalis, -e|zum Zwölffingerdarm gehörend; extracorporalis, -e|außerhalb des Körpers liegend; femoralis, -e|zum Oberschenkel gehörend;
fibularis, -e|zum Wadenbein gehörend; frontalis, -e|zur Stirn gehörend, stirnwärts liegend; genitalis, -e|zu den Geschlechtsorganen gehörend;
interstitialis, -e|im Zwischenraum liegend; intestinalis, -e|den Darm betreffend; jugularis, -e|in der Kehle liegend;
labialis, -e|zu den Lippen gehörend; lacrimalis, -e|das Tränen betreffend, zum Tränenbein gehörend; lateralis, -e|seitlich liegend;
lienalis, -e|zur Milz gehörend; linearis, -e|linienförmig, gerade; mandibularis, -e|am Unterkiefer liegend;
marginalis, -e|randständig, am Rand liegend; maxillaris, -e|am Oberkiefer liegend; medialis, -e|zur Mitte hin liegend;
medullaris, -e|im Knochenmark liegend; mentalis, -e|zum Kinn gehörend; metatarsalis, -e|zum Mittelfuß gehörend; mollis, -e|weich;
muscularis, -e|zum Muskel gehörig; nasalis, -e|zur Nase gehörend; occipitalis, -e|zum Hinterhaupt gehörend;
orbitalis, -e|zur Augenhöhle gehörend; ovalis, -e|eiförmig; palmaris, -e|in der Hohlhand liegend; parietalis, -e|in der Wand liegend;
pectoralis, -e|zur Brust gehörend; plantaris, -e|an der Fußsohle liegend; pleuralis, -e|das Brustfell betreffend;
proximalis, -e|rumpfnah, körpernah liegend; pulmonalis, -e|zur Lunge gehörend; radialis, -e|zur Speiche gehörend, daumenseitig;
rectalis, -e|zum Mastdarm gehörend; renalis, -e|zur Niere gehörend; sacralis, -e|am Kreuzbein liegend;
scapularis, -e|zum Schulterblatt gehörend; sensibilis, -e|wahrnehmend; spinalis, -e|zur Wirbelsäule gehörend;
sternalis, -e|zum Brustbein gehörend; superficialis, -e|oberflächlich; temporalis, -e|an den Schläfen liegend;
tibialis, -e|zum Schienbein gehörend; ulnaris, -e|zur Elle gehörend, kleinfingerseitig; vaginalis, -e|die Scheide betreffend;
ventralis, -e|bauchwärts liegend; vermiformis, -e|wurmförmig; vertebralis, -e|zum Wirbel gehörend; vesicalis, -e|die Blase betreffend;
major, -us|größer; minor, -us|kleiner; anterior, -ius|vorne liegend, der vordere; posterior, -ius|hinten liegend, der hintere;
superior, -ius|oben liegend, der obere; inferior, -ius|unten liegend, der untere; exterior, -ius|äußerlich, der äußere;
interior, -ius|innerlich, der innere; abducens, abducentis|(vom Körper) wegführend; adducens, adducentis|(an den Körper) heranführend;
afferens, afferentis|hinführend; ascendens, ascendentis|aufsteigend; comitans, comitantis|begleitend;
communicans, communicantis|verbindend; deferens, deferentis|herabführend; descendens, descendentis|absteigend;
efferens, efferentis|herausführend; recurrens, recurrentis|zurücklaufend; simplex, simplicis|einfach; teres, teretis|rund;
biceps, bicipitis|zweiköpfig; triceps, tricipitis|dreiköpfig; quadriceps, quadricipitis|vierköpfig` },
];

/** Lexikonform aus Stichwort und Standardendung des Stapels (z. B. „costa, -ae f“). */
function lexOf(latin: string, form: string) {
  return form ? `${latin}, ${form}` : latin;
}

export const VOCAB_DECKS = DECKS.map(({ words, ...d }) => d);

export const VOCAB: Vocab[] = DECKS.flatMap((d) =>
  d.words.split(';').map((x) => x.trim()).filter(Boolean).map((entry) => {
    const [latin, de] = entry.split('|').map((y) => y.trim());
    if (!latin || !de) throw new Error(`Vokabel unvollständig: ${entry}`);
    return { deck: d.id, latin: latin.split(',')[0].trim(), lex: lexOf(latin, d.form), de };
  }),
);

export const vocabDeck = (id: string) => DECKS.find((d) => d.id === id);
