import type { Lesson } from './types';
import { upgrade, type TopicExtra } from './kit';

// Histologie (Mikroskopische Anatomie Teil A) – Ausbau der Lektionen, und Übungen für Histologie und Anatomie.

export const HISTO_UP_OBJ = {
  mikroskopie: ['Spezialfärbungen (PAS, Azan, Elastica, Versilberung) und Immunhistochemie ihren Zielstrukturen zuordnen', 'Transmissions- und Rasterelektronenmikroskopie nach Prinzip und Auflösung unterscheiden und typische Artefakte erkennen'],
  epithel: ['den Aufbau der Basalmembran (Lamina lucida, Lamina densa, Lamina fibroreticularis) beschreiben', 'Metaplasie, Hyperplasie und Dysplasie am Epithel unterscheiden'],
  bindegewebe: ['Kollagentypen nach Vorkommen unterscheiden und die Kollagensynthese mit der Rolle von Vitamin C beschreiben', 'Osteoblasten, Osteozyten und Osteoklasten im Knochenumbau einordnen und die Regulation durch Parathormon, Calcitonin und Vitamin D nennen'],
  'muskel-nervengewebe': ['den Aufbau des Sarkomers (A-Bande, I-Bande, H-Zone, Z-Linie) beschreiben und Muskelfasertypen unterscheiden', 'Myelinscheiden in ZNS und PNS vergleichen und den Aufbau eines peripheren Nervs (Endo-, Peri-, Epineurium) beschreiben'],
  'blut-gefaesse': ['die Hämatopoese im Knochenmark mit den Zellreihen beschreiben', 'Lymphkapillaren und Lymphgefäße von Blutgefäßen unterscheiden'],
  'haut-druesen': ['die Zellen der Epidermis (Keratinozyten, Melanozyten, Langerhans-Zellen, Merkel-Zellen) und ihre Aufgaben nennen', 'Haar, Nagel und Hautdrüsen als Hautanhangsgebilde beschreiben'],
};

export const HISTO_UPGRADES: Record<string, (l: Lesson) => Lesson> = {
  mikroskopie: upgrade({
    objectives: HISTO_UP_OBJ.mikroskopie,
    mechanism: [
      ['Spezialfärbungen', 'PAS (Periodsäure-Schiff): Glykogen, Schleim der Becherzellen, Basalmembranen – magentarot. Azan: Kollagen blau, Zellkerne rot, Muskulatur rötlich. Elastica-Färbung (Resorcin-Fuchsin, Orcein): elastische Fasern dunkelviolett. Versilberung: retikuläre Fasern (Kollagen Typ III) und Nervenfasern schwarz. Sudan: Fette (nur am Gefrierschnitt, weil Alkohol die Fette herauslöst).'],
      ['Immunhistochemie', 'Ein Antikörper bindet spezifisch an ein Protein im Schnitt (z. B. Zytokeratin, Desmin, CD-Antigene), ein gekoppeltes Enzym oder Fluorochrom macht die Bindung sichtbar. So bestimmt man in der Pathologie die Herkunft von Tumoren.'],
      ['Elektronenmikroskopie', 'Elektronen haben eine viel kleinere Wellenlänge als Licht: Auflösung bis etwa 0,1–1 nm. TEM (Transmission): ultradünne Schnitte (≈ 50–80 nm), kontrastiert mit Schwermetallen (Osmium, Uran, Blei) – zeigt Organellen, Membranen, Zellkontakte. REM (Raster): tastet die Oberfläche ab und zeigt sie räumlich (Mikrovilli, Zilien). Das Präparat ist im Vakuum, also nicht lebend.'],
      ['Artefakte', 'Schrumpfungsspalten durch Fixierung, Falten und Risse im Schnitt, Messerscharten (Streifen), Farbniederschläge, Luftblasen unter dem Deckglas. Sie sind keine echten Strukturen und dürfen nicht gedeutet werden.'],
    ],
    pitfalls: ['Fette erscheinen im Paraffinschnitt als leere Vakuolen – sie wurden herausgelöst.', 'Das REM zeigt Oberflächen, das TEM Innenstrukturen im Schnitt.'],
    terms: [{ term: 'PAS-Reaktion', def: 'Färbung von Kohlenhydraten (Glykogen, Schleim, Basalmembran) magentarot.' }, { term: 'Immunhistochemie', def: 'Nachweis bestimmter Proteine im Schnitt mit markierten Antikörpern.' }, { term: 'Transmissionselektronenmikroskop', def: 'Elektronenmikroskop für ultradünne Schnitte; Auflösung im Nanometerbereich.', synonyms: ['TEM', 'REM', 'Rasterelektronenmikroskop'] }, { term: 'Artefakt', def: 'Durch die Präparation entstandene, nicht natürliche Struktur.' }],
  }),
  epithel: upgrade({
    objectives: HISTO_UP_OBJ.epithel,
    mechanism: [
      ['Basalmembran', 'Die Basalmembran trennt Epithel und Bindegewebe. Lichtmikroskopisch PAS-positiv. Elektronenmikroskopisch: Lamina lucida (hell, Laminin, Integrine), Lamina densa (dicht, Kollagen Typ IV) – zusammen Basallamina – und darunter die Lamina fibroreticularis (Kollagen Typ III, vom Bindegewebe gebildet). Hemidesmosomen verankern die Basalzellen.'],
      ['Anpassung und Fehlentwicklung', 'Hyperplasie: Zellzahl nimmt zu. Hypertrophie: Zellen werden größer. Metaplasie: Ein ausdifferenziertes Epithel wird durch ein anderes ersetzt, meist widerstandsfähigeres – beim Raucher wird respiratorisches Flimmerepithel zu Plattenepithel, bei Reflux das Plattenepithel der Speiseröhre zu Zylinderepithel (Barrett). Dysplasie: gestörte Differenzierung mit Zellatypien, eine Vorstufe von Krebs.'],
    ],
    depth: ['Das Karzinom ist ein bösartiger Epitheltumor, der die Basalmembran durchbricht. Solange die Basalmembran intakt ist, spricht man von einem Carcinoma in situ.'],
    pitfalls: ['Metaplasie ist reversibel und noch keine Krebsvorstufe – Dysplasie schon.'],
    terms: [{ term: 'Basalmembran', def: 'Extrazelluläre Schicht zwischen Epithel und Bindegewebe (Basallamina + Lamina fibroreticularis).', synonyms: ['Basallamina'] }, { term: 'Metaplasie', def: 'Umwandlung eines differenzierten Gewebes in ein anderes.', synonyms: ['Dysplasie', 'Hyperplasie'] }],
  }),
  bindegewebe: upgrade({
    objectives: HISTO_UP_OBJ.bindegewebe,
    mechanism: [
      ['Kollagentypen', 'Typ I: Knochen, Sehnen, Dermis – zugfest (90 % des Körperkollagens). Typ II: hyaliner und elastischer Knorpel. Typ III: retikuläre Fasern (lymphatische Organe, Leber, frisches Narbengewebe, Gefäßwände). Typ IV: Basallamina (bildet ein Netz, keine Fibrillen).'],
      ['Kollagensynthese', 'Fibroblasten bilden Prokollagen-Ketten am rauen ER. Prolin und Lysin werden hydroxyliert – die Enzyme brauchen Vitamin C. Drei Ketten bilden eine Tripelhelix, die ausgeschleust wird; außerhalb der Zelle werden die Enden abgespalten, die Moleküle lagern sich zu Fibrillen zusammen und werden quervernetzt. Bei Vitamin-C-Mangel (Skorbut) ist das Kollagen instabil: Zahnfleischbluten, schlechte Wundheilung.'],
      ['Knochenzellen', 'Osteoblasten bilden die organische Matrix (Osteoid) und mineralisieren sie; eingemauert werden sie zu Osteozyten, die über Fortsätze in Canaliculi verbunden sind und die Belastung messen. Osteoklasten sind große, mehrkernige Fresszellen aus der Monozytenreihe, die Knochen in Howship-Lakunen mit Säure und Enzymen abbauen.'],
      ['Hormonelle Regulation', 'Parathormon hebt den Ca²⁺-Spiegel (indirekte Aktivierung der Osteoklasten über Osteoblasten, RANKL). Calcitonin hemmt die Osteoklasten. Calcitriol (aktives Vitamin D) steigert die Ca²⁺-Aufnahme im Darm und ermöglicht die Mineralisation. Östrogene bremsen den Knochenabbau – deshalb Osteoporose nach der Menopause.'],
    ],
    pitfalls: ['Osteoklasten stammen aus dem Blut (Monozyten-Makrophagen-Reihe), Osteoblasten aus mesenchymalen Stammzellen.', 'Kollagen Typ IV bildet keine Fibrillen, sondern Netze.'],
    terms: [{ term: 'Kollagen Typ I', def: 'Häufigstes, zugfestes Kollagen in Knochen, Sehnen, Haut.', synonyms: ['Kollagen Typ II', 'Kollagen Typ III', 'Kollagen Typ IV'] }, { term: 'Osteoklast', def: 'Mehrkernige Zelle, die Knochen abbaut.', synonyms: ['Osteoblast'] }, { term: 'Osteoid', def: 'Noch nicht mineralisierte Knochenmatrix.' }, { term: 'Skorbut', def: 'Vitamin-C-Mangelkrankheit mit gestörter Kollagenbildung.' }],
    links: ['knochen'],
  }),
  'muskel-nervengewebe': upgrade({
    objectives: HISTO_UP_OBJ['muskel-nervengewebe'],
    mechanism: [
      ['Sarkomer', 'Die kleinste kontraktile Einheit liegt zwischen zwei Z-Linien (≈ 2–2,5 µm). Dicke Myosinfilamente bilden die anisotrope, dunkle A-Bande; die hellen I-Banden enthalten nur Aktin. In der Mitte der A-Bande liegt die H-Zone (nur Myosin) mit der M-Linie. Bei der Kontraktion gleiten die Filamente ineinander: I-Bande und H-Zone werden schmaler, die A-Bande bleibt gleich lang.'],
      ['Fasertypen', 'Typ I (langsam, rot): viele Mitochondrien, Myoglobin, oxidativ, ermüdungsresistent (Haltemuskulatur). Typ II (schnell, weiß): glykolytisch, schnell ermüdend (Sprint). Die Verteilung hängt von der Innervation ab und ist trainierbar.'],
      ['Myelin', 'Im PNS umwickelt eine Schwann-Zelle jeweils ein Internodium eines einzigen Axons; marklose Fasern liegen zu mehreren in Rinnen einer Schwann-Zelle. Im ZNS myelinisiert ein Oligodendrozyt mit seinen Fortsätzen Abschnitte vieler Axone. Zwischen den Internodien liegen die Ranvier-Schnürringe.'],
      ['Peripherer Nerv', 'Endoneurium umhüllt jede einzelne Nervenfaser, Perineurium (mit Diffusionsbarriere) jeweils ein Faszikel, Epineurium den ganzen Nerv mit Gefäßen und Fettgewebe. Bei einer Durchtrennung ist die Naht des Perineuriums entscheidend für die Regeneration.'],
    ],
    pitfalls: ['Bei der Kontraktion verkürzt sich die A-Bande nicht.', 'Ein Oligodendrozyt myelinisiert viele Axone, eine Schwann-Zelle nur eines.'],
    terms: [{ term: 'Sarkomer', def: 'Kontraktile Einheit zwischen zwei Z-Linien.', synonyms: ['A-Bande', 'I-Bande', 'Z-Linie'] }, { term: 'Schwann-Zelle', def: 'Myelinbildende Gliazelle des PNS.', synonyms: ['Oligodendrozyt'] }, { term: 'Perineurium', def: 'Hülle eines Nervenfaszikels mit Diffusionsbarriere.', synonyms: ['Endoneurium', 'Epineurium'] }],
    links: ['ekk', 'erregungsleitung'],
  }),
  'blut-gefaesse': upgrade({
    objectives: HISTO_UP_OBJ['blut-gefaesse'],
    mechanism: [
      ['Hämatopoese', 'Beim Erwachsenen im roten Knochenmark (Wirbel, Becken, Sternum, Rippen, proximale Röhrenknochen). Aus der pluripotenten Stammzelle entstehen eine myeloische Reihe (Erythrozyten, Granulozyten, Monozyten, Megakaryozyten → Thrombozyten) und eine lymphatische Reihe (B- und T-Lymphozyten, NK-Zellen). Erythropoetin aus der Niere steuert die Erythropoese; Retikulozyten mit RNA-Resten sind junge Erythrozyten.'],
      ['Lymphgefäße', 'Lymphkapillaren beginnen blind im Gewebe, haben ein sehr dünnes Endothel ohne durchgehende Basallamina und überlappende Zellränder wie Klappen; Ankerfilamente halten sie offen. Größere Lymphgefäße haben viele Klappen und eine dünne Wand mit weitem, unregelmäßigem Lumen, das keine Erythrozyten enthält. Sie führen rund 2–3 l Lymphe pro Tag über Lymphknoten zum Ductus thoracicus und in den Venenwinkel.'],
    ],
    pitfalls: ['Thrombozyten sind keine Zellen, sondern Abschnürungen der Megakaryozyten.', 'Im Lumen eines Lymphgefäßes fehlen Erythrozyten – ein Unterscheidungsmerkmal zur Vene.'],
    terms: [{ term: 'Hämatopoese', def: 'Blutbildung im roten Knochenmark.', synonyms: ['Erythropoese', 'Myelopoese'] }, { term: 'Megakaryozyt', def: 'Riesenzelle des Knochenmarks, aus deren Zytoplasma Thrombozyten entstehen.' }, { term: 'Lymphkapillare', def: 'Blind beginnendes, sehr dünnwandiges Lymphgefäß.' }],
  }),
  'haut-druesen': upgrade({
    objectives: HISTO_UP_OBJ['haut-druesen'],
    mechanism: [
      ['Zellen der Epidermis', 'Keratinozyten (über 90 %) wandern vom Stratum basale nach oben und verhornen in etwa 4 Wochen. Melanozyten im Stratum basale bilden Melanin und geben es über Fortsätze an die Keratinozyten ab (Schutz des Zellkerns vor UV). Langerhans-Zellen sind antigenpräsentierende Zellen des Immunsystems. Merkel-Zellen dienen als Mechanorezeptoren.'],
      ['Haar und Nagel', 'Das Haar entsteht in einem Haarfollikel aus der Haarmatrix im Bulbus, den die bindegewebige Papille ernährt. Am Follikel sitzen Talgdrüse und M. arrector pili („Gänsehaut“). Der Nagel ist eine Hornplatte aus dicht gepackten Keratinozyten, die von der Nagelmatrix gebildet wird.'],
      ['Hautdrüsen', 'Ekkrine Schweißdrüsen (merokrin, fast überall, Thermoregulation), apokrine Duftdrüsen (Achsel, Genitalregion, münden in den Haarfollikel, ab der Pubertät aktiv), Talgdrüsen (holokrin, am Haarfollikel; fehlen an Handflächen und Fußsohlen).'],
    ],
    pitfalls: ['Dunklere Haut hat nicht mehr Melanozyten, sondern mehr und größere Melaningranula.', 'Talgdrüsen sind holokrin, Schweißdrüsen merokrin.'],
    terms: [{ term: 'Melanozyt', def: 'Pigmentzelle im Stratum basale.', synonyms: ['Melanin'] }, { term: 'Langerhans-Zelle', def: 'Antigenpräsentierende dendritische Zelle der Epidermis.' }, { term: 'Merkel-Zelle', def: 'Mechanorezeptive Zelle im Stratum basale.' }, { term: 'Haarfollikel', def: 'Epitheliale Einstülpung, in der das Haar gebildet wird.' }],
  }),
};

// ---------------------------------------------------------------------------- Übungen Histologie und Anatomie
export const HISTO_ANA_TOPICS: Record<string, TopicExtra> = {
  mikroskopie: {
    quiz: [
      { q: 'Wie färbt H.E. die Zellkerne?', answer: 'blau-violett (Hämatoxylin)', options: ['blau-violett (Hämatoxylin)', 'rot (Eosin)', 'schwarz', 'grün'], why: 'Kerne sind basophil.' },
      { q: 'Was weist die PAS-Reaktion nach?', answer: 'Glykogen, Schleim und Basalmembranen', options: ['Glykogen, Schleim und Basalmembranen', 'Fette', 'elastische Fasern', 'Kollagen Typ I'], why: 'Kohlenhydrate, magentarot.' },
      { q: 'Welche Färbung zeigt Kollagen blau?', answer: 'Azan', options: ['Azan', 'H.E.', 'Sudan', 'Versilberung'], why: 'Azokarmin + Anilinblau.' },
      { q: 'Womit stellt man retikuläre Fasern dar?', answer: 'Versilberung', options: ['Versilberung', 'H.E.', 'PAS allein', 'Sudan'], why: 'Argyrophile Fasern (Kollagen III) werden schwarz.' },
      { q: 'Warum sieht Fettgewebe im Paraffinschnitt leer aus?', answer: 'Das Fett wurde durch Alkohol und Xylol herausgelöst.', options: ['Das Fett wurde durch Alkohol und Xylol herausgelöst.', 'Fett ist durchsichtig.', 'Fettzellen haben keinen Inhalt.', 'Das Mikrotom schneidet Fett weg.'], why: 'Fettnachweis nur am Gefrierschnitt.' },
      { q: 'Welches Mikroskop zeigt Oberflächen räumlich?', answer: 'Rasterelektronenmikroskop', options: ['Rasterelektronenmikroskop', 'Transmissionselektronenmikroskop', 'Lichtmikroskop', 'Phasenkontrastmikroskop'], why: 'REM tastet die Oberfläche ab.' },
      { q: 'Auflösungsgrenze des Lichtmikroskops?', answer: 'etwa 0,2 µm', options: ['etwa 0,2 µm', 'etwa 0,2 nm', 'etwa 2 mm', 'etwa 20 µm'], why: 'Abhängig von Wellenlänge und Apertur.' },
      { q: 'Wozu dient die Immunhistochemie in der Pathologie?', answer: 'Proteine nachweisen, z. B. die Herkunft eines Tumors bestimmen', options: ['Proteine nachweisen, z. B. die Herkunft eines Tumors bestimmen', 'Fette färben', 'Schnitte dünner machen', 'Bakterien zählen'], why: 'Markierte Antikörper gegen Zytokeratin, Desmin, CD-Antigene.' },
    ],
    tables: [{ title: 'Färbungen', head: ['Färbung', 'stellt dar', 'Farbe'], rows: [['H.E.', 'Kerne / Zytoplasma, Kollagen', 'blau-violett / rosa'], ['PAS', 'Glykogen, Schleim, Basalmembran', 'magentarot'], ['Azan', 'Kollagen / Kerne', 'blau / rot'], ['Resorcin-Fuchsin, Orcein', 'elastische Fasern', 'dunkelviolett bis braun'], ['Versilberung', 'retikuläre Fasern, Nervenfasern', 'schwarz'], ['Sudan (Gefrierschnitt)', 'Fette', 'rot bis schwarz'], ['Toluidinblau', 'Mastzellgranula (metachromatisch)', 'violett']] }],
  },
  epithel: {
    quiz: [
      { q: 'Welches Epithel kleidet die Luftröhre aus?', answer: 'mehrreihiges Flimmerepithel mit Becherzellen', options: ['mehrreihiges Flimmerepithel mit Becherzellen', 'mehrschichtiges verhorntes Plattenepithel', 'einschichtiges Plattenepithel', 'Übergangsepithel'], why: 'Respiratorisches Epithel.' },
      { q: 'Welches Epithel findet man in der Harnblase?', answer: 'Urothel (Übergangsepithel)', options: ['Urothel (Übergangsepithel)', 'einschichtiges Zylinderepithel', 'mehrreihiges Flimmerepithel', 'verhorntes Plattenepithel'], why: 'Mit Deckzellen, passt sich der Füllung an.' },
      { q: 'Welches Epithel kleidet Blutgefäße aus?', answer: 'einschichtiges Plattenepithel (Endothel)', options: ['einschichtiges Plattenepithel (Endothel)', 'Urothel', 'mehrschichtiges Plattenepithel', 'Zylinderepithel'], why: 'Endothel.' },
      { q: 'Woraus besteht die Lamina densa?', answer: 'Kollagen Typ IV', options: ['Kollagen Typ IV', 'Kollagen Typ I', 'Elastin', 'Keratin'], why: 'Netzbildendes Kollagen.' },
      { q: 'Was ist eine Plattenepithelmetaplasie in den Bronchien eines Rauchers?', answer: 'Ersatz des Flimmerepithels durch Plattenepithel', options: ['Ersatz des Flimmerepithels durch Plattenepithel', 'ein bösartiger Tumor', 'eine Entzündung', 'Vergrößerung der Zellen'], why: 'Widerstandsfähiger, aber ohne Reinigungsfunktion.' },
      { q: 'Welcher Zellkontakt dichtet den Interzellularraum ab?', answer: 'Zonula occludens (Tight Junction)', options: ['Zonula occludens (Tight Junction)', 'Desmosom', 'Gap Junction', 'Hemidesmosom'], why: 'Parazelluläre Barriere.' },
      { q: 'Welcher Kontakt verankert Basalzellen an der Basalmembran?', answer: 'Hemidesmosom', options: ['Hemidesmosom', 'Gap Junction', 'Zonula adhaerens', 'Tight Junction'], why: 'Über Integrine an Laminin.' },
      { q: 'Was enthalten Kinozilien?', answer: 'Mikrotubuli (9×2+2)', options: ['Mikrotubuli (9×2+2)', 'Aktin', 'Keratin', 'Kollagen'], why: 'Mikrovilli enthalten Aktin.' },
    ],
    tables: [{ title: 'Epitheltypen und Vorkommen', head: ['Epithel', 'Vorkommen'], rows: [['einschichtig platt', 'Endothel, Mesothel, Alveolen'], ['einschichtig isoprismatisch', 'Schilddrüsenfollikel, Nierentubuli'], ['einschichtig hochprismatisch', 'Magen, Darm, Gallenblase'], ['mehrreihig mit Kinozilien', 'Atemwege'], ['mehrschichtig unverhornt platt', 'Mundhöhle, Speiseröhre, Vagina'], ['mehrschichtig verhornt platt', 'Epidermis'], ['Urothel', 'ableitende Harnwege']] }],
  },
  bindegewebe: {
    quiz: [
      { q: 'Welches Kollagen kommt vor allem im hyalinen Knorpel vor?', answer: 'Typ II', options: ['Typ II', 'Typ I', 'Typ III', 'Typ IV'], why: 'Typ I in Knochen und Sehnen.' },
      { q: 'Warum heilen Wunden bei Skorbut schlecht?', answer: 'Ohne Vitamin C wird Prolin nicht hydroxyliert – Kollagen ist instabil.', options: ['Ohne Vitamin C wird Prolin nicht hydroxyliert – Kollagen ist instabil.', 'Vitamin C bildet Elastin.', 'Fibroblasten sterben ab.', 'Die Basalmembran fehlt.'], why: 'Hydroxylasen brauchen Ascorbat.' },
      { q: 'Woher stammen Osteoklasten?', answer: 'aus der Monozyten-Makrophagen-Reihe', options: ['aus der Monozyten-Makrophagen-Reihe', 'aus Osteoblasten', 'aus Chondrozyten', 'aus Fibroblasten'], why: 'Mehrkernig durch Fusion.' },
      { q: 'Welcher Knorpel hat kein Perichondrium an der Oberfläche?', answer: 'Faserknorpel (und Gelenkknorpel)', options: ['Faserknorpel (und Gelenkknorpel)', 'elastischer Knorpel', 'hyaliner Rippenknorpel'], why: 'Faserknorpel: Bandscheibe, Symphyse.' },
      { q: 'Was liegt im Zentrum eines Osteons?', answer: 'der Havers-Kanal mit Gefäßen', options: ['der Havers-Kanal mit Gefäßen', 'ein Osteoklast', 'Knorpel', 'die Markhöhle'], why: 'Konzentrische Lamellen darum.' },
      { q: 'Welches Hormon hemmt Osteoklasten?', answer: 'Calcitonin', options: ['Calcitonin', 'Parathormon', 'Cortisol', 'Thyroxin'], why: 'Aus den C-Zellen der Schilddrüse.' },
      { q: 'Wozu dient braunes Fettgewebe?', answer: 'zitterfreie Wärmebildung', options: ['zitterfreie Wärmebildung', 'Energiespeicher beim Erwachsenen', 'Polsterung der Fußsohle', 'Hormonbildung'], why: 'Viele Mitochondrien mit UCP1.' },
      { q: 'Wo kommt elastischer Knorpel vor?', answer: 'Ohrmuschel und Kehldeckel', options: ['Ohrmuschel und Kehldeckel', 'Bandscheibe', 'Gelenkflächen', 'Rippen'], why: 'Mit elastischen Fasern.' },
    ],
    tables: [{ title: 'Knorpelarten', head: ['Art', 'Fasern', 'Perichondrium', 'Vorkommen'], rows: [['hyalin', 'Kollagen Typ II (maskiert)', 'ja (außer Gelenkknorpel)', 'Gelenke, Rippen, Trachea, Epiphysenfuge'], ['elastisch', 'Kollagen II + elastische Fasern', 'ja', 'Ohrmuschel, Epiglottis'], ['Faserknorpel', 'Kollagen Typ I (dicht)', 'nein', 'Bandscheibe (Anulus), Symphyse, Menisken']] }],
  },
  'muskel-nervengewebe': {
    quiz: [
      { q: 'Wo liegen die Kerne der Skelettmuskelfaser?', answer: 'randständig unter dem Sarkolemm', options: ['randständig unter dem Sarkolemm', 'zentral', 'in den Glanzstreifen', 'gar keine'], why: 'Synzytium mit vielen Randkernen.' },
      { q: 'Welche Muskulatur hat Glanzstreifen?', answer: 'Herzmuskulatur', options: ['Herzmuskulatur', 'Skelettmuskulatur', 'glatte Muskulatur'], why: 'Zellgrenzen mit Desmosomen, Fasciae adhaerentes und Gap Junctions.' },
      { q: 'Was bleibt bei der Kontraktion gleich lang?', answer: 'die A-Bande', options: ['die A-Bande', 'die I-Bande', 'die H-Zone', 'das Sarkomer'], why: 'Myosinfilamente verkürzen sich nicht.' },
      { q: 'Welche Fasern dominieren in der Haltemuskulatur?', answer: 'Typ I (langsam, oxidativ)', options: ['Typ I (langsam, oxidativ)', 'Typ II (schnell, glykolytisch)', 'nur glatte Muskulatur'], why: 'Ermüdungsresistent, rot.' },
      { q: 'Welche Zelle myelinisiert im ZNS?', answer: 'Oligodendrozyt', options: ['Oligodendrozyt', 'Schwann-Zelle', 'Astrozyt', 'Mikroglia'], why: 'Viele Axone pro Zelle.' },
      { q: 'Welche Hülle umgibt ein Nervenfaszikel?', answer: 'Perineurium', options: ['Perineurium', 'Endoneurium', 'Epineurium', 'Myelin'], why: 'Mit Diffusionsbarriere.' },
      { q: 'Woran erkennt man glatte Muskelzellen?', answer: 'spindelförmig, ein zentraler Kern, keine Querstreifung', options: ['spindelförmig, ein zentraler Kern, keine Querstreifung', 'Randkerne und Querstreifung', 'verzweigt mit Glanzstreifen', 'kernlos'], why: 'Zigarrenförmiger Kern.' },
      { q: 'Was sind Nissl-Schollen?', answer: 'raues ER im Perikaryon', options: ['raues ER im Perikaryon', 'Myelinscheiden', 'Mitochondrien im Axon', 'Synapsen'], why: 'Basophil; fehlen im Axonhügel.' },
    ],
    tables: [{ title: 'Muskelgewebe im Vergleich', head: ['', 'Skelettmuskel', 'Herzmuskel', 'glatte Muskulatur'], rows: [['Zellform', 'lange Faser (Synzytium)', 'verzweigte Zellen', 'Spindel'], ['Kerne', 'viele, randständig', '1–2, zentral', '1, zentral'], ['Querstreifung', 'ja', 'ja', 'nein'], ['Besonderheit', 'Satellitenzellen', 'Glanzstreifen', 'Dichte Körper statt Z-Linien'], ['Steuerung', 'willkürlich', 'autonom (Schrittmacher)', 'vegetativ, hormonell']] }],
  },
  'blut-gefaesse': {
    quiz: [
      { q: 'Häufigste Leukozyten im Blut?', answer: 'neutrophile Granulozyten', options: ['neutrophile Granulozyten', 'Lymphozyten', 'Monozyten', 'eosinophile Granulozyten'], why: 'Etwa 50–70 %.' },
      { q: 'Woraus entstehen Thrombozyten?', answer: 'aus Megakaryozyten', options: ['aus Megakaryozyten', 'aus Erythrozyten', 'aus Lymphozyten', 'aus Endothelzellen'], why: 'Zytoplasmaabschnürungen.' },
      { q: 'Welches Hormon steuert die Erythropoese?', answer: 'Erythropoetin', options: ['Erythropoetin', 'Insulin', 'Thrombopoetin', 'Cortisol'], why: 'Aus der Niere bei O₂-Mangel.' },
      { q: 'Wie lange lebt ein Erythrozyt?', answer: 'etwa 120 Tage', options: ['etwa 120 Tage', 'etwa 10 Tage', 'etwa 2 Jahre', 'etwa 1 Tag'], why: 'Abbau in Milz und Leber.' },
      { q: 'Woran erkennt man ein Lymphgefäß im Schnitt?', answer: 'sehr dünne Wand, Klappen, keine Erythrozyten im Lumen', options: ['sehr dünne Wand, Klappen, keine Erythrozyten im Lumen', 'dicke Media', 'Membrana elastica interna', 'fenestriertes Endothel'], why: 'Lymphe enthält kaum Erythrozyten.' },
      { q: 'Welche Arterie ist vom elastischen Typ?', answer: 'Aorta', options: ['Aorta', 'A. radialis', 'A. femoralis', 'Arteriole'], why: 'Windkesselfunktion.' },
      { q: 'Wo findet man diskontinuierliche (sinusoidale) Kapillaren?', answer: 'Leber, Milz, Knochenmark', options: ['Leber, Milz, Knochenmark', 'Gehirn', 'Muskel', 'Lunge'], why: 'Große Lücken für Zellen und Proteine.' },
      { q: 'Wo liegt beim Erwachsenen das blutbildende Mark?', answer: 'in Wirbeln, Becken, Sternum und Rippen', options: ['in Wirbeln, Becken, Sternum und Rippen', 'in den Fingerknochen', 'in der Milz', 'in der Leber'], why: 'In den langen Röhrenknochen meist Fettmark.' },
    ],
    tables: [{ title: 'Differentialblutbild (Erwachsene, ca.)', head: ['Zelle', 'Anteil', 'Aufgabe'], rows: [['neutrophile Granulozyten', '50–70 %', 'Phagozytose von Bakterien'], ['Lymphozyten', '20–40 %', 'spezifische Abwehr'], ['Monozyten', '2–8 %', 'werden zu Makrophagen'], ['eosinophile Granulozyten', '1–4 %', 'Parasiten, Allergie'], ['basophile Granulozyten', '< 1 %', 'Histamin, Allergie']] }],
  },
  'haut-druesen': {
    quiz: [
      { q: 'Reihenfolge der Epidermisschichten von innen nach außen?', answer: 'basale – spinosum – granulosum – (lucidum) – corneum', options: ['basale – spinosum – granulosum – (lucidum) – corneum', 'corneum – granulosum – spinosum – basale', 'spinosum – basale – granulosum – corneum', 'basale – granulosum – spinosum – corneum'], why: 'Stratum lucidum nur in der Leistenhaut.' },
      { q: 'Welche Zelle bildet Melanin?', answer: 'Melanozyt', options: ['Melanozyt', 'Keratinozyt', 'Langerhans-Zelle', 'Merkel-Zelle'], why: 'Im Stratum basale.' },
      { q: 'Welche Zelle ist immunologisch tätig?', answer: 'Langerhans-Zelle', options: ['Langerhans-Zelle', 'Melanozyt', 'Merkel-Zelle', 'Keratinozyt'], why: 'Antigenpräsentierend.' },
      { q: 'Welcher Sekretionsmodus gilt für Talgdrüsen?', answer: 'holokrin', options: ['holokrin', 'merokrin', 'apokrin'], why: 'Die ganze Zelle wird zum Sekret.' },
      { q: 'Wo fehlen Haare und Talgdrüsen?', answer: 'Handflächen und Fußsohlen', options: ['Handflächen und Fußsohlen', 'Kopfhaut', 'Achsel', 'Rücken'], why: 'Leistenhaut.' },
      { q: 'Welcher Muskel erzeugt die Gänsehaut?', answer: 'M. arrector pili', options: ['M. arrector pili', 'M. orbicularis', 'Platysma', 'M. erector spinae'], why: 'Glatter Muskel am Haarfollikel.' },
      { q: 'Wo liegen apokrine Duftdrüsen?', answer: 'Achsel und Genitalregion', options: ['Achsel und Genitalregion', 'Handfläche', 'Stirn', 'überall gleichmäßig'], why: 'Münden in den Haarfollikel.' },
      { q: 'Woran erkennt man ein seröses Endstück?', answer: 'enges Lumen, runde Kerne, basophiles Zytoplasma', options: ['enges Lumen, runde Kerne, basophiles Zytoplasma', 'weites Lumen, platte basale Kerne, helles Zytoplasma', 'Randkerne und Querstreifung', 'Glanzstreifen'], why: 'Muköse Endstücke: hell, Kerne platt an der Basis.' },
    ],
  },
  'allgemeine-anatomie': {
    quiz: [
      { q: 'Welche vier Grundgewebe gibt es?', answer: 'Epithel-, Binde-/Stütz-, Muskel- und Nervengewebe', options: ['Epithel-, Binde-/Stütz-, Muskel- und Nervengewebe', 'Haut, Knochen, Blut, Nerven', 'Ektoderm, Mesoderm, Entoderm, Chorda', 'Knorpel, Knochen, Fett, Blut'], why: 'Blut zählt zum Bindegewebe.' },
      { q: 'Welche Ebene teilt den Körper in rechts und links?', answer: 'Sagittalebene', options: ['Sagittalebene', 'Frontalebene', 'Transversalebene'], why: 'Die mittlere heißt Medianebene.' },
      { q: 'Wie heißt die Region der Achselhöhle?', answer: 'Regio axillaris', options: ['Regio axillaris', 'Regio inguinalis', 'Regio cubitalis', 'Regio poplitea'], why: 'axilla = Achsel.' },
      { q: 'Wie heißt die Kniekehle?', answer: 'Fossa poplitea', options: ['Fossa poplitea', 'Fossa cubitalis', 'Fossa axillaris', 'Fossa iliaca'], why: 'Ellenbeuge: Fossa cubitalis.' },
      { q: 'Was liegt in Normalstellung lateral: Daumen oder kleiner Finger?', answer: 'Daumen', options: ['Daumen', 'kleiner Finger'], why: 'Handflächen zeigen nach vorn.' },
      { q: 'Um welche Achse erfolgt Flexion im Kniegelenk?', answer: 'Transversalachse', options: ['Transversalachse', 'Sagittalachse', 'Longitudinalachse'], why: 'Bewegung in der Sagittalebene.' },
    ],
  },
  embryologie: {
    quiz: [
      { q: 'Wo findet die Befruchtung statt?', answer: 'in der Ampulle des Eileiters', options: ['in der Ampulle des Eileiters', 'in der Gebärmutter', 'im Eierstock', 'in der Vagina'], why: 'Dann Wanderung zum Uterus.' },
      { q: 'Wann nistet sich die Blastozyste ein?', answer: 'etwa am 6.–7. Tag', options: ['etwa am 6.–7. Tag', 'am 1. Tag', 'in der 3. Woche', 'am 14. Tag'], why: 'Implantation Ende der 1. Woche.' },
      { q: 'Aus dem Embryoblasten entsteht', answer: 'der Embryo', options: ['der Embryo', 'die Plazenta allein', 'der Trophoblast', 'die Eihaut'], why: 'Trophoblast → Plazentaanteil.' },
      { q: 'In welcher Woche entstehen die drei Keimblätter?', answer: '3. Woche (Gastrulation)', options: ['3. Woche (Gastrulation)', '1. Woche', '2. Woche', '8. Woche'], why: 'Über den Primitivstreifen.' },
      { q: 'Aus welchem Keimblatt entsteht das Nervensystem?', answer: 'Ektoderm', options: ['Ektoderm', 'Mesoderm', 'Entoderm'], why: 'Neuralrohr und Neuralleiste.' },
      { q: 'Aus welchem Keimblatt entsteht die Skelettmuskulatur?', answer: 'Mesoderm', options: ['Mesoderm', 'Ektoderm', 'Entoderm'], why: 'Paraxiales Mesoderm (Somiten).' },
      { q: 'Aus welchem Keimblatt entsteht das Epithel des Darms?', answer: 'Entoderm', options: ['Entoderm', 'Ektoderm', 'Mesoderm'], why: 'Auch Leber, Pankreas, Lungenepithel.' },
      { q: 'Welche zwei Höhlen bestimmen die 2. Woche?', answer: 'Amnionhöhle und Dottersack', options: ['Amnionhöhle und Dottersack', 'Herz und Lunge', 'Neuralrohr und Darm', 'Blastozystenhöhle und Uterus'], why: 'Zweiblättrige Keimscheibe aus Epi- und Hypoblast.' },
    ],
    tables: [{ title: 'Keimblätter und Abkömmlinge', head: ['Keimblatt', 'Abkömmlinge (Beispiele)'], rows: [['Ektoderm', 'Nervensystem, Epidermis, Haare, Nägel, Zahnschmelz, Linse, Nebennierenmark (Neuralleiste)'], ['Mesoderm', 'Knochen, Knorpel, Muskulatur, Herz, Blut und Gefäße, Niere, Gonaden, Dermis'], ['Entoderm', 'Epithel von Darm und Atemwegen, Leber, Pankreas, Schilddrüse, Harnblasenepithel']] }],
  },
  knochen: {
    quiz: [
      { q: 'Wie heißt das Knochenende eines Röhrenknochens?', answer: 'Epiphyse', options: ['Epiphyse', 'Diaphyse', 'Metaphyse', 'Apophyse'], why: 'Schaft = Diaphyse.' },
      { q: 'Welche Knochen entstehen desmal?', answer: 'Schädeldach und Schlüsselbein (teilweise)', options: ['Schädeldach und Schlüsselbein (teilweise)', 'Femur', 'Wirbel', 'Fingerknochen'], why: 'Direkt aus Mesenchym.' },
      { q: 'Wo findet das Längenwachstum statt?', answer: 'in der Epiphysenfuge', options: ['in der Epiphysenfuge', 'im Periost', 'in der Markhöhle', 'im Gelenkknorpel'], why: 'Chondrale Ossifikation.' },
      { q: 'Welcher Knochen ist ein Sesambein?', answer: 'Patella', options: ['Patella', 'Femur', 'Scapula', 'Calcaneus'], why: 'In eine Sehne eingelagert.' },
      { q: 'Welche Haut umgibt den Knochen außen?', answer: 'Periost', options: ['Periost', 'Endost', 'Perichondrium', 'Faszie'], why: 'Schmerzempfindlich, für Dickenwachstum und Heilung.' },
      { q: 'Wie nennt man kurze Knochen?', answer: 'Ossa brevia, z. B. Handwurzelknochen', options: ['Ossa brevia, z. B. Handwurzelknochen', 'Ossa longa, z. B. Humerus', 'Ossa plana, z. B. Sternum', 'Ossa pneumatica, z. B. Os frontale'], why: 'Würfelartig.' },
    ],
  },
  gelenke: {
    quiz: [
      { q: 'Welches Gelenk ist ein Kugelgelenk?', answer: 'Schultergelenk', options: ['Schultergelenk', 'Ellenbogengelenk (Humeroulnargelenk)', 'oberes Sprunggelenk', 'Fingermittelgelenk'], why: 'Drei Hauptachsen.' },
      { q: 'Welches Gelenk ist ein Sattelgelenk?', answer: 'Daumensattelgelenk', options: ['Daumensattelgelenk', 'Hüftgelenk', 'Kniegelenk', 'Atlantoaxialgelenk'], why: 'Zwischen Os trapezium und Os metacarpi I.' },
      { q: 'Welches Gelenk ist ein Zapfengelenk?', answer: 'proximales Radioulnargelenk', options: ['proximales Radioulnargelenk', 'Schultergelenk', 'Hüftgelenk', 'Daumensattelgelenk'], why: 'Pronation und Supination.' },
      { q: 'Was ist eine Synchondrose?', answer: 'Knorpelhaft, z. B. Epiphysenfuge', options: ['Knorpelhaft, z. B. Epiphysenfuge', 'Bandhaft', 'Knochenhaft', 'echtes Gelenk'], why: 'Unechtes Gelenk.' },
      { q: 'Was bildet die Gelenkschmiere?', answer: 'Membrana synovialis', options: ['Membrana synovialis', 'Membrana fibrosa', 'Gelenkknorpel', 'Periost'], why: 'Innere Schicht der Gelenkkapsel.' },
      { q: 'Wie wird der Gelenkknorpel ernährt?', answer: 'durch Diffusion aus der Synovia (Bewegung!)', options: ['durch Diffusion aus der Synovia (Bewegung!)', 'durch eigene Blutgefäße', 'durch das Periost', 'gar nicht'], why: 'Knorpel ist gefäßfrei.' },
    ],
  },
  muskellehre: {
    quiz: [
      { q: 'Welche Hülle umgibt eine einzelne Muskelfaser?', answer: 'Endomysium', options: ['Endomysium', 'Perimysium', 'Epimysium', 'Faszie'], why: 'Perimysium umgibt Faserbündel.' },
      { q: 'Wie heißt der Gegenspieler bei einer Bewegung?', answer: 'Antagonist', options: ['Antagonist', 'Agonist', 'Synergist', 'Fixator'], why: 'Bei der Beugung im Ellenbogen der M. triceps.' },
      { q: 'Wo setzt der M. biceps brachii an?', answer: 'Tuberositas radii', options: ['Tuberositas radii', 'Olecranon', 'Tuberculum majus', 'Processus coracoideus'], why: 'Darum kann er supinieren.' },
      { q: 'Was bewirkt eine Fiederung des Muskels?', answer: 'mehr Kraft, weniger Hubhöhe', options: ['mehr Kraft, weniger Hubhöhe', 'mehr Hubhöhe, weniger Kraft', 'schnellere Ermüdung', 'keine Änderung'], why: 'Größerer physiologischer Querschnitt.' },
      { q: 'Welcher Muskel ist der stärkste Beuger im Ellenbogen?', answer: 'M. brachialis', options: ['M. brachialis', 'M. triceps brachii', 'M. deltoideus', 'M. supinator'], why: 'Er setzt an der Ulna an und ist reiner Beuger.' },
      { q: 'Was ist ein Synergist?', answer: 'ein Muskel, der den Agonisten unterstützt', options: ['ein Muskel, der den Agonisten unterstützt', 'ein Gegenspieler', 'eine Sehne', 'ein Schleimbeutel'], why: 'Z. B. M. brachioradialis beim Beugen.' },
    ],
  },
  nervensystem: {
    quiz: [
      { q: 'Wo liegen die Zellkörper der Motoneurone der Skelettmuskulatur?', answer: 'im Vorderhorn des Rückenmarks', options: ['im Vorderhorn des Rückenmarks', 'im Hinterhorn', 'im Spinalganglion', 'im Grenzstrang'], why: 'Alpha-Motoneurone.' },
      { q: 'Wo liegen die Zellkörper der sensiblen Neurone?', answer: 'im Spinalganglion', options: ['im Spinalganglion', 'im Vorderhorn', 'im Seitenhorn', 'in der weißen Substanz'], why: 'Pseudounipolare Neurone.' },
      { q: 'Bis wohin reicht das Rückenmark beim Erwachsenen?', answer: 'etwa L1/L2', options: ['etwa L1/L2', 'S2', 'Th12', 'L5'], why: 'Darum Lumbalpunktion bei L3/L4.' },
      { q: 'Wie viele Spinalnervenpaare hat der Mensch?', answer: '31', options: ['31', '33', '12', '24'], why: '8 C, 12 Th, 5 L, 5 S, 1 Co.' },
      { q: 'Welche Hirnhaut liegt dem Rückenmark direkt an?', answer: 'Pia mater', options: ['Pia mater', 'Dura mater', 'Arachnoidea'], why: 'Von innen: Pia, Arachnoidea, Dura.' },
      { q: 'Im Seitenhorn (Th1–L2) liegen', answer: 'sympathische Neurone', options: ['sympathische Neurone', 'parasympathische Neurone', 'sensible Neurone', 'Motoneurone'], why: 'Thorakolumbales System.' },
    ],
  },
  herz: {
    quiz: [
      { q: 'Welche Klappe liegt zwischen linkem Vorhof und linker Kammer?', answer: 'Mitralklappe', options: ['Mitralklappe', 'Trikuspidalklappe', 'Aortenklappe', 'Pulmonalklappe'], why: 'Zweizipflig (bikuspidal).' },
      { q: 'Wo liegt der Sinusknoten?', answer: 'im rechten Vorhof an der Mündung der V. cava superior', options: ['im rechten Vorhof an der Mündung der V. cava superior', 'im Kammerseptum', 'im linken Vorhof', 'an der Herzspitze'], why: 'Primärer Schrittmacher.' },
      { q: 'Welche Schicht der Herzwand ist am dicksten?', answer: 'Myokard', options: ['Myokard', 'Endokard', 'Epikard', 'Perikard'], why: 'Links etwa dreimal dicker als rechts.' },
      { q: 'Aus welchem Gefäß entspringt der R. interventricularis anterior?', answer: 'A. coronaria sinistra', options: ['A. coronaria sinistra', 'A. coronaria dextra', 'Truncus pulmonalis', 'V. cava'], why: 'Häufigstes Infarktgefäß.' },
      { q: 'Wann schließen die Segelklappen?', answer: 'zu Beginn der Systole', options: ['zu Beginn der Systole', 'zu Beginn der Diastole', 'nie', 'während der Füllung'], why: 'Erster Herzton.' },
      { q: 'Was verhindert das Durchschlagen der Segelklappen?', answer: 'Papillarmuskeln mit Chordae tendineae', options: ['Papillarmuskeln mit Chordae tendineae', 'der Sinusknoten', 'das Perikard', 'die Taschenklappen'], why: 'Sie spannen sich in der Systole an.' },
    ],
  },
  gefaesssystem: {
    quiz: [
      { q: 'Was definiert eine Arterie?', answer: 'Sie führt Blut vom Herzen weg.', options: ['Sie führt Blut vom Herzen weg.', 'Sie führt sauerstoffreiches Blut.', 'Sie hat Klappen.', 'Sie liegt oberflächlich.'], why: 'Die Lungenarterie führt sauerstoffarmes Blut.' },
      { q: 'Welches Gefäß geht als erstes vom Aortenbogen ab?', answer: 'Truncus brachiocephalicus', options: ['Truncus brachiocephalicus', 'A. carotis communis sinistra', 'A. subclavia sinistra', 'A. coronaria'], why: 'Dann A. carotis communis sinistra, A. subclavia sinistra.' },
      { q: 'Wo teilt sich die Aorta in die Aa. iliacae communes?', answer: 'etwa in Höhe L4', options: ['etwa in Höhe L4', 'Th12', 'S1', 'L1'], why: 'Bifurcatio aortae.' },
      { q: 'Wohin fließt das Blut aus Magen und Darm?', answer: 'über die Pfortader zur Leber', options: ['über die Pfortader zur Leber', 'direkt in die V. cava inferior', 'in die Lunge', 'in die Milz'], why: 'Erster Stoffwechsel in der Leber.' },
      { q: 'Was wird aus dem Ductus arteriosus nach der Geburt?', answer: 'Lig. arteriosum', options: ['Lig. arteriosum', 'Fossa ovalis', 'Lig. teres hepatis', 'Lig. venosum'], why: 'Verbindung Truncus pulmonalis – Aorta.' },
      { q: 'Was wird aus dem Foramen ovale?', answer: 'Fossa ovalis', options: ['Fossa ovalis', 'Lig. arteriosum', 'Lig. venosum', 'Chorda tympani'], why: 'Verschluss durch Druckumkehr.' },
    ],
  },
  rumpfwand: {
    quiz: [
      { q: 'Wie viele Halswirbel hat der Mensch?', answer: '7', options: ['7', '12', '5', '8'], why: 'Fast alle Säugetiere haben 7.' },
      { q: 'Welche Krümmung hat die Lendenwirbelsäule?', answer: 'Lordose', options: ['Lordose', 'Kyphose', 'Skoliose'], why: 'Nach vorn konvex.' },
      { q: 'Welche Rippen sind echte Rippen?', answer: '1–7', options: ['1–7', '8–10', '11–12', '1–12'], why: 'Direkt mit dem Sternum verbunden.' },
      { q: 'Welcher Teil der Bandscheibe tritt beim Vorfall aus?', answer: 'Nucleus pulposus', options: ['Nucleus pulposus', 'Anulus fibrosus', 'Wirbelkörper', 'Lig. flavum'], why: 'Durch einen Riss im Anulus.' },
      { q: 'Welcher Muskel ist der wichtigste Einatemmuskel?', answer: 'Zwerchfell', options: ['Zwerchfell', 'M. rectus abdominis', 'Mm. intercostales interni', 'M. latissimus dorsi'], why: 'N. phrenicus (C3–C5).' },
      { q: 'Welcher Wirbel hat einen Dens?', answer: 'Axis (C2)', options: ['Axis (C2)', 'Atlas (C1)', 'C7', 'L5'], why: 'Atlas hat keinen Wirbelkörper.' },
    ],
  },
  'obere-extremitaet': {
    quiz: [
      { q: 'Welcher Nerv versorgt die Streckmuskeln des Unterarms?', answer: 'N. radialis', options: ['N. radialis', 'N. medianus', 'N. ulnaris', 'N. musculocutaneus'], why: 'Ausfall: Fallhand.' },
      { q: 'Welcher Nerv verursacht beim Ausfall eine Krallenhand?', answer: 'N. ulnaris', options: ['N. ulnaris', 'N. radialis', 'N. medianus', 'N. axillaris'], why: 'Mm. interossei fallen aus.' },
      { q: 'Welcher Nerv ist beim Karpaltunnelsyndrom betroffen?', answer: 'N. medianus', options: ['N. medianus', 'N. ulnaris', 'N. radialis'], why: 'Unter dem Retinaculum flexorum.' },
      { q: 'Welcher Muskel gehört nicht zur Rotatorenmanschette?', answer: 'M. deltoideus', options: ['M. deltoideus', 'M. supraspinatus', 'M. infraspinatus', 'M. subscapularis'], why: 'Dazu M. teres minor.' },
      { q: 'Welcher Handwurzelknochen bricht am häufigsten?', answer: 'Os scaphoideum', options: ['Os scaphoideum', 'Os pisiforme', 'Os hamatum', 'Os capitatum'], why: 'Kahnbeinfraktur beim Sturz auf die Hand.' },
      { q: 'Welcher Nerv läuft hinter dem Epicondylus medialis („Musikantenknochen“)?', answer: 'N. ulnaris', options: ['N. ulnaris', 'N. radialis', 'N. medianus'], why: 'Im Sulcus nervi ulnaris.' },
    ],
  },
  'untere-extremitaet': {
    quiz: [
      { q: 'Aus welchen Knochen besteht das Hüftbein?', answer: 'Os ilium, Os ischii, Os pubis', options: ['Os ilium, Os ischii, Os pubis', 'Os sacrum, Os coccygis, Os ilium', 'Femur, Tibia, Fibula', 'Os ilium, Femur, Patella'], why: 'Verschmelzen in der Pfanne.' },
      { q: 'Welcher Nerv versorgt den M. quadriceps femoris?', answer: 'N. femoralis', options: ['N. femoralis', 'N. ischiadicus', 'N. obturatorius', 'N. tibialis'], why: 'Patellarsehnenreflex L3/L4.' },
      { q: 'Ausfall des N. fibularis communis führt zu', answer: 'Fallfuß (Steppergang)', options: ['Fallfuß (Steppergang)', 'Unfähigkeit zum Zehenstand', 'Ausfall der Kniestreckung', 'Ausfall der Hüftbeugung'], why: 'Fußheber fallen aus.' },
      { q: 'Welches Band verhindert die Verschiebung des Unterschenkels nach vorn?', answer: 'vorderes Kreuzband', options: ['vorderes Kreuzband', 'hinteres Kreuzband', 'Innenband', 'Außenband'], why: 'Vordere Schublade.' },
      { q: 'Welcher Meniskus wird häufiger verletzt?', answer: 'Innenmeniskus', options: ['Innenmeniskus', 'Außenmeniskus'], why: 'Mit dem Innenband verwachsen, weniger beweglich.' },
      { q: 'Welcher Muskel ist der stärkste Hüftstrecker?', answer: 'M. gluteus maximus', options: ['M. gluteus maximus', 'M. iliopsoas', 'M. gluteus medius', 'M. sartorius'], why: 'Treppensteigen, Aufstehen.' },
      { q: 'Ausfall des M. gluteus medius zeigt sich als', answer: 'Trendelenburg-Zeichen', options: ['Trendelenburg-Zeichen', 'Fallfuß', 'Krallenhand', 'Schubladenphänomen'], why: 'Becken sinkt zur Spielbeinseite ab.' },
    ],
  },
};
