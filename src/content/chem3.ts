import type { Lesson } from './types';

// Chemie nach Seminar 2: chemisches Gleichgewicht (MWG, Le Chatelier, Löslichkeitsprodukt) und Säuren/Basen
// (schwache Säuren, Salze, Puffer, Titration). Die bisherigen Lernziele bleiben wörtlich erhalten (vorhandene
// Aufgaben verweisen darauf); neue Lernziele werden angehängt.

export const GG_OBJ = {
  rechnen: 'mit dem Massenwirkungsgesetz Gleichgewichtskonstanten und Gleichgewichtsmengen berechnen',
  chatelier: 'das Prinzip von Le Chatelier auf Konzentrations-, Druck- und Temperaturänderungen anwenden',
  loeslich: 'das Löslichkeitsprodukt aufstellen, Löslichkeiten berechnen und den gleichionigen Zusatz erklären',
};
export const SB_OBJ = {
  schwach: 'den pH schwacher Säuren und Basen mit pKs bzw. pKb berechnen und pKs-Werte vergleichen',
  salze: 'Autoprotolyse des Wassers, Ampholyte sowie sauer und basisch reagierende Salze erklären',
  titration: 'Neutralisation und Titration berechnen und Äquivalenz- und Halbäquivalenzpunkt deuten',
};

export function upgradeGleichgewicht(base: Lesson): Lesson {
  return {
    ...base,
    title: 'Chemisches Gleichgewicht, Löslichkeitsprodukt, Kinetik und Energetik',
    subtitle: 'Massenwirkungsgesetz, Rechnen mit Gleichgewichten, Le Chatelier, Löslichkeitsprodukt, ΔG',
    view: 'equilibrium',
    objectives: [...base.objectives, GG_OBJ.rechnen, GG_OBJ.chatelier, GG_OBJ.loeslich],
    overview: 'Reaktionen laufen selten vollständig ab. Sie streben ein Gleichgewicht an, in dem sich die Konzentrationen nicht mehr ändern, obwohl weiterhin Moleküle umgesetzt werden. Das Massenwirkungsgesetz sagt, wo dieses Gleichgewicht liegt, das Prinzip von Le Chatelier, wohin es ausweicht, wenn man es stört. Ein Spezialfall ist das Löslichkeitsprodukt schwer löslicher Salze – wichtig für Nierensteine, Zahnschmelz und Röntgenkontrastmittel. Wie schnell das Gleichgewicht erreicht wird (Kinetik), ist eine eigene Frage.',
    mechanism: [
      { title: 'Hin und zurück', text: 'Für A ⇌ B gilt v_hin = k₁·[A] und v_rück = k₂·[B]. Zu Beginn überwiegt die Hinreaktion; mit sinkendem [A] und steigendem [B] gleichen sich beide Geschwindigkeiten an.' },
      { title: 'Dynamisches Gleichgewicht', text: 'Bei v_hin = v_rück ändern sich die Konzentrationen nicht mehr – die Reaktion läuft aber in beide Richtungen weiter. Die Konzentrationen sind dann konstant, nicht gleich.' },
      { title: 'Massenwirkungsgesetz', text: 'Für a A + b B ⇌ c C + d D gilt im Gleichgewicht K = [C]ᶜ·[D]ᵈ / ([A]ᵃ·[B]ᵇ): Produkte oben, Edukte unten, Koeffizienten als Exponenten. Reine Feststoffe und das Lösungsmittel Wasser (in verdünnter Lösung) erscheinen nicht. K ≫ 1: Gleichgewicht liegt auf der Produktseite; K ≪ 1: auf der Eduktseite.' },
      { title: 'Rechnen mit der Tabelle', text: 'Anfang – Änderung – Gleichgewicht: Für jeden Stoff die Anfangsmenge notieren, die Änderung über die Stöchiometrie mit einer Unbekannten x ausdrücken (Edukte −x, Produkte +x), die Gleichgewichtswerte ins MWG einsetzen und nach x auflösen. Oft entsteht eine quadratische Gleichung; nur die Lösung, die zu positiven Mengen führt, ist sinnvoll.' },
      { title: 'Reaktionsquotient', text: 'Setzt man beliebige aktuelle Konzentrationen in den MWG-Ausdruck ein, erhält man Q. Q < K: Die Reaktion läuft Richtung Produkte. Q > K: Richtung Edukte. Q = K: Gleichgewicht.' },
      { title: 'Le Chatelier', text: 'Ein gestörtes Gleichgewicht weicht so aus, dass die Störung kleiner wird. Konzentration: Edukt zugeben oder Produkt entfernen → mehr Produkt. Druck: Bei Gasreaktionen begünstigt Druckerhöhung die Seite mit weniger Gasteilchen. Temperatur: Erwärmen begünstigt die endotherme Richtung. Nur die Temperatur verändert den Zahlenwert von K.' },
      { title: 'Katalysator', text: 'Ein Katalysator (z. B. ein Enzym) senkt die Aktivierungsenergie für Hin- und Rückreaktion gleichermaßen: Das Gleichgewicht wird schneller erreicht, seine Lage bleibt gleich.' },
      { title: 'Löslichkeitsprodukt', text: 'Für ein schwer lösliches Salz steht ein Bodenkörper mit seinen Ionen im Gleichgewicht, z. B. AgCl(s) ⇌ Ag⁺ + Cl⁻. Da der Feststoff nicht im MWG steht, gilt K_L = [Ag⁺]·[Cl⁻]. Wird K_L überschritten, fällt Salz aus; darunter löst sich weiteres. Gibt man ein Ion zu, das schon in der Lösung ist (gleichioniger Zusatz), sinkt die Löslichkeit.' },
      { title: 'Energetik', text: 'ΔG°’ = −R·T·ln K. Ist K > 1, ist ΔG°’ negativ. Die tatsächliche Richtung bestimmt ΔG = ΔG°’ + R·T·ln Q mit den aktuellen Konzentrationen.' },
    ],
    depth: {
      text: [
        'Löslichkeit aus K_L: Für ein Salz vom Typ AB (AgCl, BaSO₄) ist [A] = [B] = L, also K_L = L² und L = √K_L. Für den Typ AB₂ (CaF₂, Mg(OH)₂) ist [A] = L und [B] = 2L, also K_L = L·(2L)² = 4L³ und L = ∛(K_L/4). K_L-Werte verschiedener Salztypen lassen sich deshalb nicht direkt vergleichen – man muss erst die Löslichkeit ausrechnen.',
        'Medizinische Beispiele: Bariumsulfat ist so schwer löslich (K_L ≈ 1·10⁻¹⁰ mol²/l²), dass es trotz der Giftigkeit freier Ba²⁺-Ionen als Röntgenkontrastmittel geschluckt werden kann. Nierensteine entstehen häufig, wenn das Ionenprodukt von Calcium und Oxalat im Urin das Löslichkeitsprodukt überschreitet – viel trinken senkt die Konzentrationen. Fluorid baut Fluorapatit in den Zahnschmelz ein, das in Säure schwerer löslich ist als Hydroxylapatit.',
        'Im Stoffwechsel treibt Le Chatelier Reaktionen mit leicht positivem ΔG°’ an, weil das Produkt sofort weiterverbraucht wird. Bei Gasreaktionen zählt nur die Zahl der Gasteilchen: N₂ + 3 H₂ ⇌ 2 NH₃ (4 → 2 Teilchen) wird durch hohen Druck begünstigt; H₂ + I₂ ⇌ 2 HI (2 → 2) bleibt unbeeinflusst.',
        'Die Temperaturabhängigkeit der Geschwindigkeit beschreibt die Arrhenius-Gleichung; als Faustregel verdoppelt bis verdreifacht sich die Geschwindigkeit vieler Reaktionen pro 10 °C (RGT-Regel). Exergon (ΔG < 0) bedeutet „kann freiwillig ablaufen“, nicht „läuft schnell ab“.',
        'Literaturwerte für Löslichkeitsprodukte schwanken je nach Quelle und Temperatur etwas; in Aufgaben gilt immer der angegebene Wert.',
      ],
      equations: ['K = [C]ᶜ·[D]ᵈ / ([A]ᵃ·[B]ᵇ)', 'Q < K → Reaktion läuft zu den Produkten', 'K_L(AB) = [A⁺]·[B⁻] = L²', 'K_L(AB₂) = [A²⁺]·[B⁻]² = 4·L³', 'ΔG°’ = −R·T·ln K', 'ΔG = ΔG°’ + R·T·ln Q'],
      pitfalls: [
        'Im Gleichgewicht sind die Konzentrationen nicht gleich, sondern konstant.',
        'Koeffizienten werden im MWG zu Exponenten: 2 HI → [HI]².',
        'Feststoffe und Wasser als Lösungsmittel gehören nicht ins MWG.',
        'Konzentrations- und Druckänderungen verschieben die Lage, ändern K aber nicht – nur die Temperatur ändert K.',
        'Ein Katalysator verschiebt das Gleichgewicht nicht.',
        'Bei CaF₂ ist [F⁻] = 2·L, und dieser Wert wird im K_L noch quadriert.',
      ],
    },
    terms: [
      ...base.terms,
      { term: 'Prinzip von Le Chatelier', def: 'Ein Gleichgewicht weicht einer äußeren Störung so aus, dass deren Wirkung verringert wird.', synonyms: ['Le Chatelier', 'Prinzip des kleinsten Zwangs'] },
      { term: 'Reaktionsquotient', def: 'Q; MWG-Ausdruck mit den aktuellen (nicht notwendigerweise Gleichgewichts-)Konzentrationen.' },
      { term: 'Löslichkeitsprodukt', def: 'K_L; Produkt der Ionenkonzentrationen (mit Stöchiometrie als Exponenten) einer gesättigten Lösung eines schwer löslichen Salzes.', synonyms: ['K_L', 'Ksp'] },
      { term: 'Gleichioniger Zusatz', def: 'Zugabe eines Ions, das bereits im Löslichkeitsgleichgewicht vorkommt; senkt die Löslichkeit des Salzes.' },
      { term: 'Endotherm', def: 'Reaktion, die Wärme aufnimmt (ΔH > 0); Erwärmen begünstigt sie.', synonyms: ['exotherm'] },
    ],
    links: [...new Set([...base.links, 'saeure-base', 'stoechiometrie', 'enzyme'])],
    sources: [{ id: 'zeeck', locator: 'Kap. „Chemisches Gleichgewicht“ und „Löslichkeit“' }, ...base.sources],
  };
}

export function upgradeSaeureBase(base: Lesson): Lesson {
  return {
    ...base,
    title: 'Säuren, Basen, pH-Wert und Puffer',
    subtitle: 'Brønsted, Autoprotolyse, starke und schwache Säuren, Salze, Puffer, Titration, Blut',
    difficulty: 'grundlagen',
    view: 'acidbase2',
    objectives: [...base.objectives, SB_OBJ.schwach, SB_OBJ.salze, SB_OBJ.titration],
    overview: 'Säuren geben Protonen ab, Basen nehmen sie auf. Der pH-Wert misst, wie viele H₃O⁺-Ionen eine Lösung enthält. Starke Säuren geben ihr Proton vollständig ab, schwache nur teilweise – wie stark, verrät der pKs-Wert. Puffer aus einer schwachen Säure und ihrer konjugierten Base halten den pH stabil; der wichtigste im Blut ist CO₂/HCO₃⁻. In der Titration bestimmt man mit einer Base bekannter Konzentration, wie viel Säure in einer Probe steckt.',
    mechanism: [
      { title: 'Brønsted', text: 'Säure = Protonendonator, Base = Protonenakzeptor. Gibt eine Säure HA ein Proton ab, entsteht ihre konjugierte Base A⁻: HA + H₂O ⇌ H₃O⁺ + A⁻. Je stärker die Säure, desto schwächer ihre konjugierte Base.' },
      { title: 'Autoprotolyse des Wassers', text: '2 H₂O ⇌ H₃O⁺ + OH⁻ mit K_W = [H₃O⁺]·[OH⁻] = 10⁻¹⁴ mol²/l² bei 25 °C. Daraus folgt pH + pOH = 14. Neutral heißt [H₃O⁺] = [OH⁻], also pH 7 (bei 25 °C).' },
      { title: 'Starke Säuren und Basen', text: 'Sie protolysieren praktisch vollständig: pH = −lg c(Säure), bei Basen pOH = −lg c(Base) und pH = 14 − pOH. Bei mehrprotonigen starken Säuren zählt jedes abgegebene Proton.' },
      { title: 'Schwache Säuren und Basen', text: 'Sie protolysieren nur teilweise; ihre Stärke beschreibt K_S bzw. pK_S = −lg K_S. Näherung: pH = ½·(pK_S − lg c). Für schwache Basen analog pOH = ½·(pK_B − lg c). Für ein konjugiertes Paar gilt pK_S + pK_B = 14.' },
      { title: 'Ampholyte und Salze', text: 'Ampholyte können Protonen abgeben und aufnehmen: H₂O, HCO₃⁻, H₂PO₄⁻, Aminosäuren. Salze reagieren sauer, wenn ihr Kation eine schwache Säure ist (NH₄Cl), basisch, wenn ihr Anion eine schwache Base ist (Natriumacetat, NaHCO₃), und neutral, wenn beide Ionen aus starken Säuren bzw. Basen stammen (NaCl).' },
      { title: 'Puffer', text: 'Gemisch aus schwacher Säure und konjugierter Base. Zugegebene H₃O⁺ fängt A⁻ ab, zugegebene OH⁻ fängt HA ab. pH = pK_S + lg([A⁻]/[HA]) (Henderson-Hasselbalch). Am wirksamsten bei pH ≈ pK_S, also etwa im Bereich pK_S ± 1.' },
      { title: 'Neutralisation und Titration', text: 'Säure + Base → Salz + Wasser. Am Äquivalenzpunkt ist genau so viel Base zugegeben, wie Protonen vorhanden waren: z·c(Säure)·V(Säure) = c(Base)·V(Base). Bei einer schwachen Säure liegt er im Basischen; am Halbäquivalenzpunkt gilt [HA] = [A⁻] und damit pH = pK_S.' },
      { title: 'Blut', text: 'Normaler pH 7,35–7,45. Wichtigster Puffer ist CO₂/HCO₃⁻ (pK_S ≈ 6,1 unter Körperbedingungen); pCO₂ wird über die Atmung, HCO₃⁻ über die Niere reguliert. Weitere Puffer: Proteine (Hämoglobin) und Phosphat (H₂PO₄⁻/HPO₄²⁻, pK_S ≈ 7,2, wichtig in Zellen und Urin).' },
    ],
    depth: {
      text: [
        'Woher kommt die Näherung für schwache Säuren? Aus HA ⇌ H₃O⁺ + A⁻ folgt K_S = [H₃O⁺]·[A⁻]/[HA]. Ohne weitere Zusätze ist [H₃O⁺] ≈ [A⁻], und weil nur wenig HA zerfällt, ist [HA] ≈ c. Also K_S ≈ [H₃O⁺]²/c, [H₃O⁺] = √(K_S·c) und pH = ½·(pK_S − lg c). Die Näherung gilt gut, solange weniger als etwa 5 % der Säure protolysiert sind.',
        'Titrationskurve: Bei einer starken Säure springt der pH am Äquivalenzpunkt von etwa 3 auf 11 – Äquivalenzpunkt bei pH 7. Bei einer schwachen Säure beginnt die Kurve höher, verläuft im Pufferbereich flach (Halbäquivalenzpunkt pH = pK_S) und hat ihren Äquivalenzpunkt im Basischen, weil dort nur die konjugierte Base vorliegt. Ein Indikator muss in diesem Bereich umschlagen (z. B. Phenolphthalein).',
        'Henderson-Hasselbalch ist eine Näherung, die bei sehr verdünnten Lösungen und extremen Verhältnissen versagt, weil sie Wasser-Autoprotolyse und die Dissoziation selbst vernachlässigt. Für genaue Rechnungen müssten außerdem Aktivitäten statt Konzentrationen verwendet werden.',
        'Ob ein Salz sauer oder basisch reagiert, fragt man am einfachsten so: Aus welcher Säure und welcher Base ist es „entstanden“? Der stärkere Partner setzt sich durch – NH₄Cl aus starker HCl und schwacher NH₃ reagiert sauer.',
      ],
      equations: ['K_W = [H₃O⁺]·[OH⁻] = 10⁻¹⁴ mol²/l²  →  pH + pOH = 14', 'pH = −lg c(H₃O⁺)', 'schwache Säure: pH ≈ ½·(pK_S − lg c)', 'pK_S + pK_B = 14', 'pH = pK_S + lg([A⁻]/[HA])', 'Äquivalenzpunkt: z·c_S·V_S = c_B·V_B', 'pH = 6,1 + lg([HCO₃⁻]/(0,0307·pCO₂))'],
      pitfalls: [
        'Eine starke Säure in sehr hoher Verdünnung macht Wasser nicht basisch: 10⁻⁸ M HCl hat pH ≈ 6,98, nicht 8.',
        'Bei Basen zuerst den pOH berechnen, dann pH = 14 − pOH.',
        'Die Formel pH = −lg c gilt nur für starke Säuren; bei schwachen Säuren die ½-Formel mit pK_S.',
        'Kleiner pK_S = starke Säure. Essigsäure (4,76) ist stärker als NH₄⁺ (9,25).',
        'Am Äquivalenzpunkt einer schwachen Säure ist der pH nicht 7.',
        'Bei Schwefelsäure gibt jedes Molekül zwei Protonen ab (z = 2).',
      ],
    },
    terms: [
      ...base.terms,
      { term: 'Autoprotolyse', def: 'Reaktion zweier Wassermoleküle zu H₃O⁺ und OH⁻; K_W = 10⁻¹⁴ mol²/l² bei 25 °C.', synonyms: ['Ionenprodukt des Wassers', 'K_W'] },
      { term: 'Ampholyt', def: 'Teilchen, das als Säure und als Base reagieren kann, z. B. H₂O, HCO₃⁻.', synonyms: ['amphoter'] },
      { term: 'pKb-Wert', def: 'Negativer Logarithmus der Basenkonstante; für ein konjugiertes Paar gilt pKs + pKb = 14.', synonyms: ['pKb', 'Basenkonstante'] },
      { term: 'Äquivalenzpunkt', def: 'Punkt der Titration, an dem Säure und Base in stöchiometrisch gleicher Menge vorliegen.', synonyms: ['Halbäquivalenzpunkt'] },
      { term: 'Titration', def: 'Bestimmung einer unbekannten Konzentration durch schrittweise Zugabe einer Maßlösung bekannter Konzentration.', synonyms: ['Maßlösung', 'Indikator'] },
      { term: 'Neutralisation', def: 'Reaktion einer Säure mit einer Base zu Salz und Wasser (H₃O⁺ + OH⁻ → 2 H₂O).' },
    ],
    links: [...new Set([...base.links, 'gleichgewicht', 'konzentrationen', 'stoechiometrie'])],
    sources: [{ id: 'zeeck', locator: 'Kap. „Säuren und Basen“, „Puffer“ und „Titration“' }, ...base.sources],
  };
}

/** pKs-Werte (25 °C, gerundet) für Tabelle und Aufgaben */
export const PKS_TABLE: { acid: string; base: string; pks: number | null; note?: string }[] = [
  { acid: 'HCl', base: 'Cl⁻', pks: null, note: 'starke Säure (pK_S < 0)' },
  { acid: 'H₂SO₄', base: 'HSO₄⁻', pks: null, note: 'starke Säure (1. Stufe)' },
  { acid: 'H₃PO₄', base: 'H₂PO₄⁻', pks: 2.15 },
  { acid: 'HF', base: 'F⁻', pks: 3.17 },
  { acid: 'Ameisensäure HCOOH', base: 'Formiat HCOO⁻', pks: 3.75 },
  { acid: 'Milchsäure', base: 'Lactat', pks: 3.86 },
  { acid: 'Essigsäure CH₃COOH', base: 'Acetat CH₃COO⁻', pks: 4.76 },
  { acid: 'CO₂ + H₂O (Kohlensäure)', base: 'HCO₃⁻', pks: 6.35, note: 'unter Körperbedingungen ≈ 6,1' },
  { acid: 'H₂PO₄⁻', base: 'HPO₄²⁻', pks: 7.21 },
  { acid: 'NH₄⁺', base: 'NH₃', pks: 9.25 },
  { acid: 'HCO₃⁻', base: 'CO₃²⁻', pks: 10.33 },
  { acid: 'HPO₄²⁻', base: 'PO₄³⁻', pks: 12.32 },
];
