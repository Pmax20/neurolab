// Proteinbiosynthese und Energiebilanz – reine Rechenfunktionen

export const CODON_TABLE: Record<string, string> = (() => {
  const bases = 'UCAG';
  const aa = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const t: Record<string, string> = {};
  let i = 0;
  for (const a of bases) for (const b of bases) for (const c of bases) t[a + b + c] = aa[i++];
  return t;
})();

export const AA_NAMES: Record<string, { de: string; three: string }> = {
  A: { de: 'Alanin', three: 'Ala' }, R: { de: 'Arginin', three: 'Arg' }, N: { de: 'Asparagin', three: 'Asn' }, D: { de: 'Aspartat', three: 'Asp' },
  C: { de: 'Cystein', three: 'Cys' }, Q: { de: 'Glutamin', three: 'Gln' }, E: { de: 'Glutamat', three: 'Glu' }, G: { de: 'Glycin', three: 'Gly' },
  H: { de: 'Histidin', three: 'His' }, I: { de: 'Isoleucin', three: 'Ile' }, L: { de: 'Leucin', three: 'Leu' }, K: { de: 'Lysin', three: 'Lys' },
  M: { de: 'Methionin', three: 'Met' }, F: { de: 'Phenylalanin', three: 'Phe' }, P: { de: 'Prolin', three: 'Pro' }, S: { de: 'Serin', three: 'Ser' },
  T: { de: 'Threonin', three: 'Thr' }, W: { de: 'Tryptophan', three: 'Trp' }, Y: { de: 'Tyrosin', three: 'Tyr' }, V: { de: 'Valin', three: 'Val' },
  '*': { de: 'Stopp', three: 'Stop' },
};

const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };

export function cleanDNA(s: string): { seq: string; invalid: string[] } {
  const up = s.toUpperCase().replace(/\s+/g, '');
  const invalid = [...new Set(up.split('').filter((c) => !'ACGT'.includes(c)))];
  return { seq: up.replace(/[^ACGT]/g, ''), invalid };
}

export function complement(dna: string) {
  return dna
    .split('')
    .map((c) => COMP[c] ?? c)
    .join('');
}

/** Transkription: Die mRNA entspricht dem codogenen (Matrizen-)Strang komplementär, also dem codierenden Strang mit U statt T. */
export function transcribeFromCoding(coding: string) {
  return coding.replace(/T/g, 'U');
}

export interface TranslationStep {
  index: number; // Position des Codons in der mRNA (Nukleotid)
  codon: string;
  anticodon: string; // 3'→5' gelesen, zur Darstellung
  aa: string;
}

export function translate(mrna: string): { start: number; steps: TranslationStep[]; stopped: boolean; note: string } {
  const start = mrna.indexOf('AUG');
  if (start < 0) return { start: -1, steps: [], stopped: false, note: 'Kein Startcodon (AUG) gefunden – im Modell beginnt keine Translation.' };
  const steps: TranslationStep[] = [];
  let stopped = false;
  for (let i = start; i + 3 <= mrna.length; i += 3) {
    const codon = mrna.slice(i, i + 3);
    const aa = CODON_TABLE[codon];
    const anticodon = codon
      .split('')
      .map((c) => ({ A: 'U', U: 'A', G: 'C', C: 'G' })[c as 'A'])
      .join('');
    steps.push({ index: i, codon, anticodon, aa });
    if (aa === '*') {
      stopped = true;
      break;
    }
  }
  return { start, steps, stopped, note: stopped ? 'Translation am Stoppcodon beendet.' : 'Kein Stoppcodon im Leseraster – das Fragment ist unvollständig.' };
}

// ---------------------------------------------------------------------------
// Energiebilanz der vollständigen Glukoseoxidation – abhängig von Konventionen
// ---------------------------------------------------------------------------

export interface YieldOptions {
  poNADH: number; // ATP pro NADH (modern ≈ 2,5; ältere Lehrbücher: 3)
  poFADH2: number; // ATP pro FADH2 (modern ≈ 1,5; älter: 2)
  shuttle: 'malat-aspartat' | 'glycerin-3-phosphat';
}

export function glucoseYield(o: YieldOptions) {
  // Zytosolisches NADH aus der Glykolyse (2) wird je nach Shuttle als NADH oder FADH2 (bzw. Ubichinol) in die Atmungskette eingespeist.
  const glycolysisNADH = 2 * (o.shuttle === 'malat-aspartat' ? o.poNADH : o.poFADH2);
  const rows = [
    { step: 'Glykolyse', substrate: '1 Glukose', products: '2 Pyruvat', direct: 2, nadh: 2, fadh2: 0, atp: 2 + glycolysisNADH, note: `2 ATP (netto, Substratkettenphosphorylierung) + 2 NADH über ${o.shuttle === 'malat-aspartat' ? 'Malat-Aspartat-Shuttle (als NADH, ≈ 2,5 ATP)' : 'Glycerin-3-phosphat-Shuttle (Elektronen gelangen über FAD/Ubichinon in die Atmungskette, ≈ 1,5 ATP)'}` },
    { step: 'Oxidative Decarboxylierung', substrate: '2 Pyruvat', products: '2 Acetyl-CoA + 2 CO₂', direct: 0, nadh: 2, fadh2: 0, atp: 2 * o.poNADH, note: '2 NADH' },
    { step: 'Citratzyklus', substrate: '2 Acetyl-CoA', products: '4 CO₂', direct: 2, nadh: 6, fadh2: 2, atp: 2 + 6 * o.poNADH + 2 * o.poFADH2, note: '2 GTP/ATP + 6 NADH + 2 FADH₂' },
  ];
  const total = rows.reduce((s, r) => s + r.atp, 0);
  return { rows, total };
}

export const ENERGY_STATIONS = [
  { id: 'glykolyse', title: 'Glykolyse', place: 'Zytosol', substrates: ['Glukose', '2 ADP + 2 Pᵢ', '2 NAD⁺'], products: ['2 Pyruvat', '2 ATP (netto)', '2 NADH + 2 H⁺', '2 H₂O'], text: 'Abbau von Glukose (C6) zu zwei Pyruvat (C3). In der Investitionsphase werden 2 ATP verbraucht, in der Ertragsphase 4 ATP durch Substratkettenphosphorylierung gebildet. Läuft ohne Sauerstoff ab; unter anaeroben Bedingungen wird NADH durch Reduktion von Pyruvat zu Laktat regeneriert.' },
  { id: 'pdh', title: 'Oxidative Decarboxylierung', place: 'Mitochondrienmatrix', substrates: ['Pyruvat', 'CoA', 'NAD⁺'], products: ['Acetyl-CoA', 'CO₂', 'NADH + H⁺'], text: 'Der Pyruvat-Dehydrogenase-Komplex verknüpft Glykolyse und Citratzyklus. Die Reaktion ist irreversibel; Cofaktoren u. a. Thiaminpyrophosphat, Liponsäure, FAD, NAD⁺, CoA.' },
  { id: 'citrat', title: 'Citratzyklus', place: 'Mitochondrienmatrix', substrates: ['Acetyl-CoA', '3 NAD⁺', 'FAD', 'GDP + Pᵢ', '2 H₂O'], products: ['2 CO₂', '3 NADH + 3 H⁺', 'FADH₂', 'GTP', 'CoA'], text: 'Pro Acetyl-CoA: vollständige Oxidation der Acetylgruppe zu 2 CO₂. Die Energie wird überwiegend in Form von Reduktionsäquivalenten (NADH, FADH₂) gespeichert. Der Zyklus ist auch Drehscheibe für Synthesewege.' },
  { id: 'atmungskette', title: 'Atmungskette', place: 'Innere Mitochondrienmembran', substrates: ['NADH', 'FADH₂ (über Komplex II)', 'O₂'], products: ['NAD⁺', 'FAD', 'H₂O', 'Protonengradient'], text: 'Elektronen werden über die Komplexe I–IV auf O₂ übertragen. Komplexe I, III und IV pumpen dabei Protonen aus der Matrix in den Intermembranraum. Sauerstoff ist der terminale Elektronenakzeptor.' },
  { id: 'chemiosmose', title: 'Chemiosmotisches Prinzip', place: 'Innere Mitochondrienmembran', substrates: ['Protonengradient (ΔpH und Membranpotenzial)'], products: ['protonenmotorische Kraft'], text: 'Nach Mitchell koppelt der elektrochemische Protonengradient (protonenmotorische Kraft) Elektronentransport und ATP-Synthese. Entkoppler machen die Membran protonendurchlässig: Der Gradient zerfällt, ohne dass ATP gebildet wird (Wärme).' },
  { id: 'atpsynthase', title: 'ATP-Synthase', place: 'Innere Mitochondrienmembran (Komplex V)', substrates: ['ADP + Pᵢ', 'H⁺ (Rückstrom in die Matrix)'], products: ['ATP'], text: 'Der Protonenrückstrom durch F₀ treibt eine Rotation an, die im F₁-Teil Konformationsänderungen und die ATP-Bildung bewirkt (Bindungswechselmechanismus). Pro gebildetem ATP werden einschließlich Transport von ADP/Pᵢ rund 3–4 H⁺ benötigt (abhängig vom Organismus/c-Ring).' },
];
