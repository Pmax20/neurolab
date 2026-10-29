// Interaktiver Terminologietrainer (Lastenheft 8.4): Begriffe zerlegen, Bausteine ergänzen,
// Schreibweisen prüfen und unbekannte Wörter aus ihren Bausteinen erschließen.
// Alle Bausteine stehen auch auf den Terminologie-Karteikarten.

export interface Part { p: string; m: string; kind: 'Präfix' | 'Wortstamm' | 'Suffix' }
export interface Word { word: string; parts: Part[]; meaning: string; wrong: string[]; transfer?: boolean }

const P = (p: string, m: string): Part => ({ p, m, kind: 'Präfix' });
const W = (p: string, m: string): Part => ({ p, m, kind: 'Wortstamm' });
const X = (p: string, m: string): Part => ({ p, m, kind: 'Suffix' });

export const WORDS: Word[] = [
  { word: 'Hepatitis', parts: [W('hepat', 'Leber'), X('itis', 'Entzündung')], meaning: 'Leberentzündung', wrong: ['Heppatitis', 'Hepatytis', 'Hepatitiss'] },
  { word: 'Gastritis', parts: [W('gastr', 'Magen'), X('itis', 'Entzündung')], meaning: 'Magenschleimhautentzündung', wrong: ['Gastrittis', 'Gasteritis', 'Gastritiss'] },
  { word: 'Nephrektomie', parts: [W('nephr', 'Niere'), X('ektomie', 'operative Entfernung')], meaning: 'operative Entfernung einer Niere', wrong: ['Nefrektomie', 'Nephrektommie', 'Nephrecktomie'] },
  { word: 'Osteologie', parts: [W('osteo', 'Knochen'), X('logie', 'Lehre')], meaning: 'Lehre von den Knochen', wrong: ['Osthiologie', 'Ostiologie', 'Osteolohgie'] },
  { word: 'Kardiologie', parts: [W('kardio', 'Herz'), X('logie', 'Lehre')], meaning: 'Lehre vom Herzen und seinen Erkrankungen', wrong: ['Kadiologie', 'Kardiolgie', 'Kardiolohgie'] },
  { word: 'Neurologie', parts: [W('neuro', 'Nerv'), X('logie', 'Lehre')], meaning: 'Lehre vom Nervensystem und seinen Erkrankungen', wrong: ['Neurolgie', 'Neorologie', 'Neurologgie'] },
  { word: 'Dermatologie', parts: [W('dermato', 'Haut'), X('logie', 'Lehre')], meaning: 'Lehre von der Haut und ihren Erkrankungen', wrong: ['Dermatolgie', 'Dermathologie', 'Dermatohlogie'] },
  { word: 'Hämatologie', parts: [W('hämato', 'Blut'), X('logie', 'Lehre')], meaning: 'Lehre vom Blut und seinen Erkrankungen', wrong: ['Hämathologie', 'Hematolgie', 'Hämatolgie'] },
  { word: 'Myalgie', parts: [W('my', 'Muskel'), X('algie', 'Schmerz')], meaning: 'Muskelschmerz', wrong: ['Mialgie', 'Myalgy', 'Mygalgie'] },
  { word: 'Neuralgie', parts: [W('neur', 'Nerv'), X('algie', 'Schmerz')], meaning: 'Nervenschmerz', wrong: ['Neuralgy', 'Neurallgie', 'Neuralgia'] },
  { word: 'Gastroskopie', parts: [W('gastro', 'Magen'), X('skopie', 'Betrachtung, Spiegelung')], meaning: 'Magenspiegelung', wrong: ['Gastroskopy', 'Gastrosskopie', 'Gastroskobie'] },
  { word: 'Laparotomie', parts: [W('laparo', 'Bauchwand'), X('tomie', 'Schnitt, operative Eröffnung')], meaning: 'operative Eröffnung der Bauchhöhle', wrong: ['Laporotomie', 'Laparatomie', 'Laparotommie'] },
  { word: 'Perikarditis', parts: [P('peri', 'um … herum'), W('kard', 'Herz'), X('itis', 'Entzündung')], meaning: 'Entzündung des Herzbeutels', wrong: ['Perrikarditis', 'Perikardits', 'Perikardittis'] },
  { word: 'Endokard', parts: [P('endo', 'innen'), W('kard', 'Herz')], meaning: 'Herzinnenhaut', wrong: ['Endokardt', 'Endokart', 'Entokard'] },
  { word: 'Epidermis', parts: [P('epi', 'auf, darüber'), W('dermis', 'Haut')], meaning: 'Oberhaut', wrong: ['Epedermis', 'Epidermiss', 'Epidermys'] },
  { word: 'Tachykardie', parts: [P('tachy', 'schnell'), W('kard', 'Herz'), X('ie', 'Zustand')], meaning: 'zu schneller Herzschlag', wrong: ['Tachikardie', 'Tachykadie', 'Tachykardi'] },
  { word: 'Bradykardie', parts: [P('brady', 'langsam'), W('kard', 'Herz'), X('ie', 'Zustand')], meaning: 'zu langsamer Herzschlag', wrong: ['Bradikardie', 'Bradykadie', 'Bradykardi'] },
  { word: 'Hypoglykämie', parts: [P('hypo', 'unter, zu wenig'), W('glyk', 'Zucker'), X('ämie', 'im Blut')], meaning: 'zu niedriger Blutzucker', wrong: ['Hypoglykemie', 'Hypoglikämie', 'Hypoglykähmie'] },
  { word: 'Hyperthyreose', parts: [P('hyper', 'über, zu viel'), W('thyre', 'Schilddrüse'), X('ose', 'Zustand, nicht entzündliche Erkrankung')], meaning: 'Schilddrüsenüberfunktion', wrong: ['Hypertyreose', 'Hyperthyriose', 'Hyperthyreohse'] },
  { word: 'subkutan', parts: [P('sub', 'unter'), W('kutan', 'Haut (cutis)')], meaning: 'unter der Haut', wrong: ['subkutahn', 'supkutan', 'subkuttan'] },
  { word: 'intravenös', parts: [P('intra', 'innerhalb'), W('venös', 'Vene')], meaning: 'in die Vene, innerhalb der Vene', wrong: ['intravennös', 'intrawenös', 'intravenöss'] },
  // Transferwörter: kommen nicht auf den Karten vor und werden aus bekannten Bausteinen erschlossen
  { word: 'Osteitis', parts: [W('oste', 'Knochen'), X('itis', 'Entzündung')], meaning: 'Knochenentzündung', wrong: ['Ostheitis', 'Osteititis', 'Osteitiss'], transfer: true },
  { word: 'Myokarditis', parts: [W('myo', 'Muskel'), W('kard', 'Herz'), X('itis', 'Entzündung')], meaning: 'Entzündung des Herzmuskels', wrong: ['Miokarditis', 'Myokardittis', 'Myokardits'], transfer: true },
  { word: 'Nephrologie', parts: [W('nephro', 'Niere'), X('logie', 'Lehre')], meaning: 'Lehre von der Niere und ihren Erkrankungen', wrong: ['Nefrologie', 'Nephrolgie', 'Neprologie'], transfer: true },
  { word: 'Hepatektomie', parts: [W('hepat', 'Leber'), X('ektomie', 'operative Entfernung')], meaning: 'operative Entfernung (eines Teils) der Leber', wrong: ['Heppatektomie', 'Hepatektommie', 'Hepatecktomie'], transfer: true },
  { word: 'Endoskopie', parts: [P('endo', 'innen'), X('skopie', 'Betrachtung, Spiegelung')], meaning: 'Spiegelung von Körperhöhlen oder Hohlorganen von innen', wrong: ['Endoskopy', 'Endosskopie', 'Entoskopie'], transfer: true },
  { word: 'Anämie', parts: [P('an', 'ohne, Mangel'), X('ämie', 'im Blut')], meaning: 'Blutarmut (Mangel an Hämoglobin bzw. Erythrozyten)', wrong: ['Anemie', 'Anähmie', 'Annämie'], transfer: true },
  { word: 'Hypertonie', parts: [P('hyper', 'über, zu viel'), W('ton', 'Spannung, Druck'), X('ie', 'Zustand')], meaning: 'Bluthochdruck', wrong: ['Hipertonie', 'Hypertohnie', 'Hypertonnie'], transfer: true },
  { word: 'Dermatitis', parts: [W('dermat', 'Haut'), X('itis', 'Entzündung')], meaning: 'Hautentzündung', wrong: ['Dermatittis', 'Dermathitis', 'Dermatitiss'], transfer: true },
];

/** Alle Bausteine (für Auswahllisten), eindeutig nach Schreibweise und Bedeutung. */
export const PARTS: Part[] = (() => {
  const m = new Map<string, Part>();
  for (const w of WORDS) for (const p of w.parts) m.set(`${p.p}|${p.m}`, p);
  return [...m.values()];
})();

/** Varianten der Zerlegung: die richtige und zwei falsche, verschobene Trennungen. */
export function splitOptions(w: Word): string[][] {
  const right = w.parts.map((p) => p.p);
  const joined = right.join('');
  const cut = right[0].length;
  const shift = (d: number) => { const c = Math.max(1, Math.min(joined.length - 1, cut + d)); return [joined.slice(0, c), joined.slice(c)]; };
  const out = [right, shift(-2), shift(2)];
  const seen = new Set<string>();
  return out.filter((o) => { const k = o.join('|'); if (seen.has(k)) return false; seen.add(k); return true; });
}
