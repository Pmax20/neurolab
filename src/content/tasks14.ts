import type { Task } from './types';
import { taskKit } from './kit';
import { LW_OBJ } from './chem7';
import { AT_OBJ, BD_OBJ, EK_OBJ } from './chem5';

// Aufgaben für das Chemie-Testat 1 (Skript Kap. 1–6): neue Lektion „Luft, Gase und Wasser“
// sowie Tafel-Aufgaben (frei erklären) zu Atombau, Bindung, Thermodynamik und Kinetik.
// Selbst formuliert nach Lehrbuchstandard (keine Leipziger Originalaufgaben).

const { sc, mc, mt, od, tx } = taskKit('zeeck');
const S = 'zu_pruefen' as const;
const src = [{ id: 'zeeck' }];
const LW = 'luft-wasser';

function fm(id: string, objective: string, prompt: string, givens: string, answer: number, tolerance: number, unit: string, solution: string, explanation: string): Task {
  return { id, type: 'formula', level: 'anwendung', lessons: [LW], objective, category: 'rechnen', sources: src, status: S, prompt, givens, answer, tolerance, unit, solution, explanation };
}

export const TASKS_14: Task[] = [
  // --- Luft und Partialdruck ---
  sc('lw-luft-1', LW, LW_OBJ.luft, 'wissen', 'verwechslung', 'Welche Zusammensetzung hat trockene Luft (Volumenanteile, gerundet)?',
    'N₂ 78 %, O₂ 21 %, Ar 0,9 %, CO₂ 0,04 %',
    [['O₂ 78 %, N₂ 21 %, Ar 0,9 %, CO₂ 0,04 %', 'Stickstoff und Sauerstoff vertauscht.'], ['N₂ 78 %, O₂ 21 %, CO₂ 0,9 %, Ar 0,04 %', 'Argon und CO₂ vertauscht – CO₂ ist nur in Spuren enthalten.'], ['N₂ 50 %, O₂ 50 %', 'Viel zu viel Sauerstoff.']],
    'Stickstoff ist mit ca. 78 % Hauptbestandteil, Sauerstoff ca. 21 %, Argon ca. 0,9 %, CO₂ nur ca. 0,04 %.'),
  fm('lw-luft-2', LW_OBJ.luft, 'Berechne den O₂-Partialdruck trockener Luft auf Meereshöhe (p = 1013 hPa, O₂-Anteil 21 %). Ergebnis in hPa, gerundet.',
    'p(O₂) = x(O₂) · p_ges', 213, 3, 'hPa',
    'p(O₂) = 0,21 · 1013 hPa ≈ 212,7 hPa ≈ 213 hPa (≈ 21 kPa ≈ 160 mmHg).',
    'Gesetz von Dalton: Jedes Gas trägt mit Anteil · Gesamtdruck bei.'),
  fm('lw-luft-3', LW_OBJ.luft, 'Auf einem Gipfel beträgt der Luftdruck 500 hPa. Wie groß ist der O₂-Partialdruck (trockene Luft)? Ergebnis in hPa.',
    'p(O₂) = 0,21 · p_ges', 105, 2, 'hPa',
    'p(O₂) = 0,21 · 500 hPa = 105 hPa – etwa die Hälfte des Werts auf Meereshöhe.',
    'Der O₂-Anteil bleibt in der Höhe 21 %; es sinkt der Gesamtdruck und damit der Partialdruck.'),
  sc('lw-luft-4', LW, LW_OBJ.luft, 'verstaendnis', 'begriff', 'Warum bekommt man auf hohen Bergen schlechter Luft?',
    'Der Gesamtdruck und damit der O₂-Partialdruck sinken; der O₂-Anteil bleibt 21 %.',
    [['Der Sauerstoffanteil der Luft sinkt auf etwa 10 %.', 'Die Zusammensetzung der Luft ändert sich mit der Höhe kaum.'], ['In der Höhe gibt es mehr CO₂.', 'Der CO₂-Anteil bleibt ebenfalls nahezu gleich.'], ['Die Luft wird kälter und enthält deshalb weniger O₂-Moleküle pro mol.', '1 mol enthält immer gleich viele Teilchen; entscheidend ist der Partialdruck.']],
    'Für die Sauerstoffaufnahme zählt der O₂-Partialdruck. Er ist Anteil · Gesamtdruck und sinkt mit dem Luftdruck.'),
  // --- Ideale Gase ---
  fm('lw-gas-1', LW_OBJ.gas, 'Welches Volumen nehmen 8 g O₂ bei 0 °C und 1013 hPa ein? (M(O₂) = 32 g/mol) Ergebnis in L.',
    'n = m/M; V = n · 22,4 L/mol', 5.6, 0.1, 'L',
    'n = 8 g / 32 g/mol = 0,25 mol; V = 0,25 mol · 22,4 L/mol = 5,6 L.',
    'Das molare Volumen von 22,4 L/mol gilt für jedes ideale Gas bei Normbedingungen.'),
  fm('lw-gas-2', LW_OBJ.gas, 'Bei der Verbrennung entstehen 11,2 L CO₂ (0 °C, 1013 hPa). Wie viel Gramm CO₂ sind das? (M(CO₂) = 44 g/mol)',
    'n = V/V_m; m = n · M', 22, 0.5, 'g',
    'n = 11,2 L / 22,4 L/mol = 0,5 mol; m = 0,5 mol · 44 g/mol = 22 g.',
    'Erst über das molare Volumen die Stoffmenge, dann über die molare Masse die Masse.'),
  sc('lw-gas-3', LW, LW_OBJ.gas, 'anwendung', 'formel', 'Ein Gas wird bei konstanter Temperatur von 1 bar auf 4 bar komprimiert. Vorher hatte es 2 L. Wie groß ist das Volumen danach?',
    '0,5 L', [['8 L', 'Volumen und Druck verhalten sich umgekehrt, nicht gleich.'], ['2 L', 'Bei konstanter Temperatur ändert sich das Volumen mit dem Druck.'], ['1 L', 'Der Druck hat sich vervierfacht, nicht verdoppelt.']],
    'Boyle-Mariotte: p₁ · V₁ = p₂ · V₂ → V₂ = 1 bar · 2 L / 4 bar = 0,5 L.'),
  mc('lw-gas-4', LW, LW_OBJ.gas, 'Welche Aussagen zum idealen Gasgesetz p · V = n · R · T sind richtig?',
    ['T muss in Kelvin eingesetzt werden.', '1 mol eines idealen Gases nimmt bei 0 °C und 1013 hPa etwa 22,4 L ein – unabhängig von der Gasart.', 'Ideale Gasteilchen haben kein Eigenvolumen und keine Wechselwirkungen.'],
    [['1 mol H₂ nimmt deutlich weniger Volumen ein als 1 mol CO₂, weil es leichter ist.', 'Das molare Volumen hängt nicht von der Masse der Teilchen ab.'], ['Verdoppelt man die Temperatur von 20 °C auf 40 °C, verdoppelt sich das Volumen (p konstant).', 'Es zählt die Kelvin-Temperatur: 293 K → 313 K ist nur ca. 7 % mehr.']],
    'Im idealen Gas zählt nur die Teilchenzahl, nicht ihre Art. Temperaturen immer in Kelvin umrechnen.', 'formel'),
  mt('lw-gas-5', LW, LW_OBJ.gas, 'Ordne das Gasgesetz der konstanten Größe zu.',
    [['Boyle-Mariotte (p · V = konst.)', 'Temperatur konstant'], ['Gay-Lussac (V/T = konst.)', 'Druck konstant'], ['Amontons (p/T = konst.)', 'Volumen konstant'], ['Dalton (p_ges = Σ p_i)', 'Gasgemisch: Partialdrücke addieren sich']],
    'Alle drei Sonderfälle folgen aus p · V = n · R · T, wenn jeweils eine Größe (und n) konstant gehalten wird.'),
  // --- Anomalie des Wassers ---
  sc('lw-anom-1', LW, LW_OBJ.anomalie, 'verstaendnis', 'mechanismus', 'Warum schwimmt Eis auf Wasser?',
    'Im Eis bilden Wasserstoffbrücken ein offenes, hexagonales Gitter mit Hohlräumen – Eis ist weniger dicht als flüssiges Wasser.',
    [['Eis enthält eingeschlossene Luftbläschen.', 'Auch blasenfreies Eis schwimmt; der Grund ist die Gitterstruktur.'], ['Beim Gefrieren werden die O–H-Bindungen länger.', 'Die kovalenten Bindungen ändern sich kaum; entscheidend sind die H-Brücken zwischen den Molekülen.'], ['Wasser ist bei 0 °C am dichtesten.', 'Das Dichtemaximum liegt bei 4 °C.']],
    'Das H-Brücken-Gitter im Eis braucht mehr Platz pro Molekül. Beim Schmelzen bricht es teilweise zusammen; bei 4 °C ist Wasser am dichtesten.'),
  mc('lw-anom-2', LW, LW_OBJ.anomalie, 'Welche Eigenschaften von Wasser gehen auf Wasserstoffbrücken zurück?',
    ['Hoher Siedepunkt im Vergleich zu H₂S', 'Dichtemaximum bei 4 °C', 'Hohe Verdampfungswärme (Schwitzen kühlt)'],
    [['Wasser leitet als reiner Stoff sehr gut Strom.', 'Reines Wasser leitet kaum; Leitfähigkeit braucht gelöste Ionen.'], ['Wasser ist farblos.', 'Die Farbe hat mit H-Brücken nichts zu tun.']],
    'Wasserstoffbrücken halten die Moleküle zusammen: Zum Verdampfen muss viel Energie aufgewendet werden, im Eis entsteht ein offenes Gitter.', 'mechanismus'),
  sc('lw-anom-3', LW, LW_OBJ.anomalie, 'anwendung', 'verwechslung', 'Ein See im Winter: Welche Temperatur hat das Wasser am Grund, wenn die Oberfläche zugefroren ist?',
    'etwa 4 °C', [['0 °C', 'Wasser mit 0 °C ist leichter als 4 °C warmes und steigt nach oben.'], ['−4 °C', 'Unter dem Eis ist das Wasser flüssig, also nicht unter 0 °C.'], ['so kalt wie die Luft', 'Das Eis isoliert, und das dichteste Wasser (4 °C) sinkt nach unten.']],
    'Wasser mit 4 °C hat die größte Dichte und sammelt sich am Grund – deshalb überleben Fische.'),
  tx('lw-anom-4', LW, LW_OBJ.anomalie, 'Erkläre an der Tafel: Warum siedet Wasser (M = 18 g/mol) bei 100 °C, Schwefelwasserstoff (M = 34 g/mol) aber schon bei etwa −60 °C?',
    'Wassermoleküle bilden untereinander Wasserstoffbrücken, weil Sauerstoff sehr elektronegativ ist und freie Elektronenpaare hat. Beim Sieden müssen diese Wasserstoffbrücken gelöst werden, das kostet viel Energie. Schwefel ist weniger elektronegativ, zwischen H₂S-Molekülen wirken nur schwache Dipol- und Van-der-Waals-Kräfte – obwohl H₂S schwerer ist, siedet es viel tiefer.',
    [['wasserstoffbrücke', 'h-brücke', 'wasserstoffbrücken'], ['elektronegativ', 'elektronegativität'], ['energie', 'lösen', 'aufbrechen', 'überwinden']]),
  // --- Zustandsdiagramm ---
  mt('lw-phas-1', LW, LW_OBJ.phasen, 'Ordne die Begriffe des Zustandsdiagramms von Wasser zu.',
    [['Tripelpunkt', 'fest, flüssig und gasförmig im Gleichgewicht (0,01 °C, 6,1 hPa)'], ['Kritischer Punkt', 'Ende der Siedekurve, Flüssigkeit und Gas nicht mehr unterscheidbar'], ['Schmelzkurve', 'Grenze fest/flüssig, bei Wasser nach links geneigt'], ['Sublimationskurve', 'Grenze fest/gasförmig unterhalb des Tripelpunkts']],
    'Drei Flächen (Phasen), drei Kurven (Phasengrenzen), zwei besondere Punkte.'),
  sc('lw-phas-2', LW, LW_OBJ.phasen, 'verstaendnis', 'diagramm', 'Warum ist die Schmelzkurve im Zustandsdiagramm von Wasser nach links geneigt?',
    'Flüssiges Wasser ist dichter als Eis; höherer Druck begünstigt die dichtere Phase und senkt so den Schmelzpunkt.',
    [['Eis ist dichter als Wasser; Druck begünstigt das Eis.', 'Genau umgekehrt – das ist das Verhalten fast aller anderen Stoffe.'], ['Weil Wasser bei 0 °C siedet.', 'Bei 1013 hPa schmilzt Eis bei 0 °C, es siedet bei 100 °C.'], ['Weil der Tripelpunkt bei 374 °C liegt.', 'Das ist die Temperatur des kritischen Punkts.']],
    'Le Chatelier für Phasen: Druck verschiebt zur Phase mit kleinerem Volumen. Bei Wasser ist das die Flüssigkeit.'),
  sc('lw-phas-3', LW, LW_OBJ.phasen, 'anwendung', 'begriff', 'Im Autoklav wird bei etwa 2 bar sterilisiert. Warum?',
    'Höherer Druck hebt den Siedepunkt auf ca. 121 °C – das Wasser bleibt flüssig und wird heißer.',
    [['Der Druck zerdrückt Bakterien mechanisch.', 'Entscheidend ist die höhere Temperatur, nicht der Druck selbst.'], ['Höherer Druck senkt den Siedepunkt.', 'Mehr Druck – höherer Siedepunkt (Siedekurve steigt).'], ['Bei 2 bar sublimiert Wasser.', 'Sublimation kommt nur unterhalb des Tripelpunkts (6,1 hPa) vor.']],
    'Eine Flüssigkeit siedet, wenn ihr Dampfdruck den Umgebungsdruck erreicht. Auf Bergen siedet Wasser deshalb unter 100 °C.'),
  od('lw-phas-4', LW, LW_OBJ.phasen, 'Bringe die Phasenübergänge von Wasser bei 1013 hPa beim Erwärmen von −20 °C auf 120 °C in die richtige Reihenfolge.',
    ['Eis erwärmt sich bis 0 °C', 'Eis schmilzt bei 0 °C (Temperatur bleibt konstant)', 'Flüssiges Wasser erwärmt sich bis 100 °C', 'Wasser siedet bei 100 °C (Temperatur bleibt konstant)', 'Wasserdampf erwärmt sich über 100 °C'],
    'Während eines Phasenübergangs bleibt die Temperatur konstant, weil die Energie zum Lösen der Wasserstoffbrücken gebraucht wird (Schmelz- bzw. Verdampfungswärme).'),
  // --- Elektrolyse ---
  sc('lw-elek-1', LW, LW_OBJ.elektrolyse, 'wissen', 'richtung', 'Was entsteht bei der Elektrolyse von Wasser an der Kathode (Minuspol)?',
    'Wasserstoff – durch Reduktion', [['Sauerstoff – durch Oxidation', 'Das passiert an der Anode (Pluspol).'], ['Sauerstoff – durch Reduktion', 'An der Kathode entsteht H₂.'], ['Wasserstoff – durch Oxidation', 'An der Kathode werden Elektronen aufgenommen: Reduktion.']],
    'Kathode: 4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻. Anode: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. Merkhilfe: Kathode–Reduktion, Anode–Oxidation.'),
  sc('lw-elek-2', LW, LW_OBJ.elektrolyse, 'anwendung', 'rechnen', 'Bei einer Wasserelektrolyse entstehen 30 mL Wasserstoff. Wie viel Sauerstoff entsteht gleichzeitig (gleiche Bedingungen)?',
    '15 mL', [['30 mL', 'Laut Gleichung 2 H₂O → 2 H₂ + O₂ entsteht nur halb so viel O₂.'], ['60 mL', 'Verhältnis vertauscht: H₂ : O₂ = 2 : 1.'], ['240 mL', 'Das wäre ein Massenverhältnis-Denkfehler; bei Gasen zählt die Stoffmenge.']],
    'Gleiche Stoffmenge, gleiches Volumen (Avogadro). Aus 2 H₂O entstehen 2 H₂ und 1 O₂ → Volumenverhältnis 2 : 1.'),
  tx('lw-elek-3', LW, LW_OBJ.elektrolyse, 'Formuliere an der Tafel die Gesamtgleichung der Wasserelektrolyse und nenne, was an welchem Pol entsteht.',
    '2 H₂O → 2 H₂ + O₂. An der Kathode (Minuspol) wird Wasser reduziert, es entsteht Wasserstoff. An der Anode (Pluspol) wird Wasser oxidiert, es entsteht Sauerstoff. Volumenverhältnis H₂ : O₂ = 2 : 1. Die Reaktion ist erzwungen (endergon) und braucht Gleichstrom.',
    [['2 h₂o', '2h₂o', '2 h2o', '2h2o'], ['kathode', 'minuspol'], ['anode', 'pluspol'], ['2 : 1', '2:1', 'doppelt']]),

  // --- Tafel-Aufgaben zu Kap. 1–4 (frei erklären) ---
  tx('tt-orb-1', 'atommodell', AT_OBJ.orbitale, 'Tafel-Aufgabe: Schreibe die Elektronenkonfiguration von Schwefel (Z = 16) auf und erkläre dabei Pauli-Prinzip und Hund’sche Regel an den 3p-Orbitalen.',
    'S: 1s² 2s² 2p⁶ 3s² 3p⁴ = [Ne] 3s² 3p⁴, 6 Valenzelektronen. Pauli: In einem Orbital höchstens zwei Elektronen mit entgegengesetztem Spin. Hund: Die drei 3p-Orbitale werden zuerst einzeln mit gleichem Spin besetzt, das vierte Elektron paart sich – also ein doppelt und zwei einfach besetzte 3p-Orbitale.',
    [['3s²', '3s2'], ['3p⁴', '3p4'], ['pauli', 'entgegengesetzt', 'zwei elektronen'], ['hund', 'einzeln', 'gleichem spin']]),
  tx('tt-bind-1', 'bindungen', BD_OBJ.gitter, 'Tafel-Aufgabe: Erkläre den hydrophoben Effekt und nenne zwei biologische Folgen.',
    'Unpolare Moleküle lagern sich in Wasser zusammen. Das liegt nicht an einer starken Anziehung zwischen ihnen, sondern an der Entropie: Um unpolare Teile herum müssen sich Wassermoleküle geordnet anlagern. Lagern sich die unpolaren Teile zusammen, werden diese Wassermoleküle frei, die Entropie steigt und ΔG wird negativ. Folgen: Bildung der Lipid-Doppelschicht von Membranen, Mizellen, Proteinfaltung (unpolare Seitenketten nach innen).',
    [['entropie'], ['wasser', 'wassermoleküle'], ['membran', 'doppelschicht', 'mizelle', 'proteinfaltung', 'faltung']]),
  sc('tt-bind-2', 'bindungen', BD_OBJ.gitter, 'verstaendnis', 'verwechslung', 'Ordne nach Stärke (stärkste zuerst): Welche Reihenfolge der zwischenmolekularen Wechselwirkungen ist richtig?',
    'Ion-Dipol > Wasserstoffbrücke > Dipol-Dipol > Van-der-Waals',
    [['Van-der-Waals > Dipol-Dipol > Wasserstoffbrücke > Ion-Dipol', 'Genau umgekehrt.'], ['Wasserstoffbrücke > Ion-Dipol > Van-der-Waals > Dipol-Dipol', 'Ion-Dipol ist stärker als eine H-Brücke, Van-der-Waals ist die schwächste.'], ['Dipol-Dipol > Van-der-Waals > Ion-Dipol > Wasserstoffbrücke', 'Ion-Dipol-Kräfte (z. B. Hydrathülle) sind die stärksten der vier.']],
    'Grobe Richtwerte: Ion-Dipol am stärksten, H-Brücken 10–40 kJ/mol, Dipol-Dipol 5–20 kJ/mol, Van-der-Waals 0,1–5 kJ/mol – alle deutlich schwächer als kovalente Bindungen.'),
  tx('tt-gibbs-1', 'energetik-kinetik', EK_OBJ[1], 'Tafel-Aufgabe: Eine Reaktion hat ΔH = +40 kJ/mol und ΔS = +100 J/(mol·K). Ab welcher Temperatur läuft sie freiwillig ab? Erkläre den Rechenweg.',
    'ΔG = ΔH − T·ΔS. Freiwillig, wenn ΔG < 0. Grenze bei ΔG = 0: T = ΔH/ΔS. Einheiten angleichen: ΔS = 0,1 kJ/(mol·K). T = 40 / 0,1 = 400 K (ca. 127 °C). Oberhalb von 400 K überwiegt der Entropieterm, ΔG wird negativ, die Reaktion läuft freiwillig ab.',
    [['gibbs', 'enthalpie', 'entropie'], ['400'], ['kelvin', 'einheit', 'kj']]),
  sc('tt-gibbs-2', 'energetik-kinetik', EK_OBJ[1], 'analyse', 'verwechslung', 'ΔH < 0 und ΔS < 0. Wann läuft die Reaktion freiwillig ab?',
    'Nur bei niedriger Temperatur', [['Immer', 'Das gilt nur für ΔH < 0 und ΔS > 0.'], ['Nie', 'Das gilt nur für ΔH > 0 und ΔS < 0.'], ['Nur bei hoher Temperatur', 'Bei hoher Temperatur wird −T·ΔS (positiv) groß und macht ΔG positiv.']],
    'ΔG = ΔH − T·ΔS: Mit ΔS < 0 ist −T·ΔS positiv und wächst mit T. Nur solange T klein ist, bleibt ΔG negativ.'),
  tx('tt-kat-1', 'energetik-kinetik', EK_OBJ[4], 'Tafel-Aufgabe: Zeichne (gedanklich) das Energieprofil einer exothermen Reaktion mit und ohne Katalysator und erkläre, was der Katalysator ändert und was nicht.',
    'Edukte liegen energetisch höher als die Produkte (ΔH < 0). Dazwischen liegt der Übergangszustand mit der Aktivierungsenergie E_A. Mit Katalysator ist der Berg niedriger (kleinere E_A, anderer Reaktionsweg), Anfangs- und Endniveau bleiben gleich. Der Katalysator beschleunigt Hin- und Rückreaktion, ändert aber weder ΔH noch ΔG noch die Lage des Gleichgewichts und wird nicht verbraucht.',
    [['aktivierungsenergie', 'e_a', 'ea'], ['übergangszustand', 'berg', 'maximum'], ['gleichgewicht', 'enthalpie'], ['nicht verbraucht', 'unverändert', 'gleich']]),
];
