import type { ChoiceOption, ErrorCategory, Task, TaskLevel } from './types';
import { KW_OBJ } from './chem4';

// Aufgaben zu Alkanen, Alkenen und Alkinen. Selbst formuliert nach Lehrbuchstandard.

const S = 'zu_pruefen' as const;
const L = 'kohlenwasserstoffe';
const src = [{ id: 'zeeck' }];
function sc(id: string, oi: number, level: TaskLevel, category: ErrorCategory, prompt: string, correct: string, wrong: [string, string][], explanation: string): Task {
  const opts: ChoiceOption[] = [{ id: 'a', text: correct }, ...wrong.map(([text, why], i) => ({ id: String.fromCharCode(98 + i), text, why, category }))];
  const rot = id.length % opts.length;
  return { id, type: 'single', prompt, level, lessons: [L], objective: KW_OBJ[oi], category, sources: src, status: S, options: [...opts.slice(rot), ...opts.slice(0, rot)], correct: 'a', explanation };
}
function mc(id: string, oi: number, prompt: string, right: string[], wrong: [string, string][], explanation: string, category: ErrorCategory = 'verwechslung'): Task {
  const options: ChoiceOption[] = [...right.map((text, i) => ({ id: `r${i}`, text })), ...wrong.map(([text, why], i) => ({ id: `w${i}`, text, why }))];
  const rot = id.length % options.length;
  return { id, type: 'multi', level: 'verstaendnis', lessons: [L], objective: KW_OBJ[oi], category, sources: src, status: S, prompt, options: [...options.slice(rot), ...options.slice(0, rot)], correct: right.map((_, i) => `r${i}`), explanation };
}
function mt(id: string, oi: number, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'wissen'): Task {
  return { id, type: 'match', level, lessons: [L], objective: KW_OBJ[oi], category: 'verwechslung', sources: src, status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
}
function od(id: string, oi: number, prompt: string, items: string[], explanation: string): Task {
  return { id, type: 'order', level: 'verstaendnis', lessons: [L], objective: KW_OBJ[oi], category: 'reihenfolge', sources: src, status: S, prompt, items, explanation };
}
function bal(id: string, reactants: string[], products: string[], coefficients: number[], explanation: string): Task {
  return { id, type: 'balance', level: 'anwendung', lessons: [L], objective: KW_OBJ[5], category: 'rechnen', sources: src, status: S, prompt: 'Gleiche die Verbrennungsgleichung aus (kleinste ganze Zahlen).', reactants, products, coefficients, explanation };
}
function tx(id: string, oi: number, prompt: string, modelAnswer: string, keywords: string[][]): Task {
  return { id, type: 'text', level: 'verknuepfung', lessons: [L], objective: KW_OBJ[oi], category: 'mechanismus', sources: src, status: S, prompt, keywords, modelAnswer, explanation: modelAnswer };
}

export const TASKS_8: Task[] = [
  // Grundtypen
  mt('kw-formeln', 0, 'Ordne jeder Stoffklasse ihre allgemeine Summenformel zu.', [['Alkane', 'CₙH₂ₙ₊₂'], ['Alkene (eine Doppelbindung)', 'CₙH₂ₙ'], ['Alkine (eine Dreifachbindung)', 'CₙH₂ₙ₋₂'], ['Cycloalkane', 'CₙH₂ₙ']],
    'Jede Doppelbindung und jeder Ring „kostet“ zwei H-Atome. Cycloalkane und Alkene haben deshalb dieselbe allgemeine Formel.'),
  mt('kw-hybrid', 0, 'Ordne zu: Hybridisierung und Bindungswinkel des C-Atoms.', [['C in Methan', 'sp³, 109,5°'], ['C der Doppelbindung in Ethen', 'sp², 120°'], ['C der Dreifachbindung in Ethin', 'sp, 180°']],
    'Tetraeder – trigonal planar – linear.', 'verstaendnis'),
  sc('kw-summenformel', 0, 'anwendung', 'rechnen', 'Welche Summenformel hat Hexan?', 'C₆H₁₄', [['C₆H₁₂', 'Das ist die Formel eines Hexens oder Cyclohexans.'], ['C₆H₆', 'Das ist Benzol.'], ['C₆H₁₀', 'Das wäre ein Hexin.']],
    'Alkane: CₙH₂ₙ₊₂ → n = 6: C₆H₁₄.'),
  sc('kw-pi', 0, 'verstaendnis', 'begriff', 'Woraus besteht eine C=C-Doppelbindung?', 'aus einer σ-Bindung und einer π-Bindung', [['aus zwei σ-Bindungen', 'Zwischen zwei Atomen gibt es höchstens eine σ-Bindung.'], ['aus zwei π-Bindungen', 'Die erste Bindung ist immer eine σ-Bindung.'], ['aus einer Ionenbindung und einer Atombindung', 'Zwischen zwei C-Atomen gibt es keine Ionenbindung.']],
    'σ: Überlappung entlang der Bindungsachse. π: seitliche Überlappung der p-Orbitale ober- und unterhalb – sie verhindert die Drehung.'),
  // Nomenklatur
  od('kw-reihe', 1, 'Ordne die Alkane nach der Zahl der C-Atome.', ['Methan', 'Ethan', 'Propan', 'Butan', 'Pentan', 'Hexan', 'Heptan', 'Octan'],
    'Ab C₅ leiten sich die Namen von griechischen Zahlwörtern ab: pent-, hex-, hept-, oct-, non-, dec-.'),
  sc('kw-name-1', 1, 'anwendung', 'begriff', 'Wie heißt CH₃–CH(CH₃)–CH₂–CH₂–CH₃?', '2-Methylpentan', [['4-Methylpentan', 'Nummeriert wird von der Seite, die der Verzweigung näher ist.'], ['Hexan', 'Hexan ist unverzweigt.'], ['1,1-Dimethylbutan', 'Eine „Methylgruppe“ an C-1 verlängert in Wahrheit die Kette.']],
    'Längste Kette 5 C, Methyl an C-2 (nicht C-4).'),
  sc('kw-name-2', 1, 'anwendung', 'begriff', 'Wie heißt CH₂=CH–CH₂–CH₂–CH₃?', 'Pent-1-en', [['Pent-4-en', 'Die Doppelbindung bekommt die kleinste Nummer.'], ['Pentan', 'Es gibt eine Doppelbindung.'], ['Pent-1-in', 'Das wäre eine Dreifachbindung.']],
    'Doppelbindung zwischen C-1 und C-2 → Pent-1-en.'),
  sc('kw-struktur', 1, 'anwendung', 'struktur', 'Welche Strukturformel gehört zu 2,2-Dimethylbutan?', 'CH₃–C(CH₃)₂–CH₂–CH₃', [['CH₃–CH(CH₃)–CH(CH₃)–CH₃', 'Das ist 2,3-Dimethylbutan – die Methylgruppen sitzen an zwei verschiedenen C.'], ['CH₃–CH₂–C(CH₃)₂–CH₂–CH₃', 'Das ist 3,3-Dimethylpentan.'], ['(CH₃)₂CH–CH₂–CH₂–CH₃', 'Das ist 2-Methylpentan.']],
    'Butan-Kette, beide Methylgruppen am zweiten C.'),
  // Isomerie
  sc('kw-isomere-c5', 2, 'analyse', 'struktur', 'Wie viele Konstitutionsisomere gibt es mit der Summenformel C₅H₁₂?', '3', [['2', 'Neben Pentan und 2-Methylbutan gibt es noch 2,2-Dimethylpropan.'], ['5', 'Viele scheinbar neue Strukturen sind nur anders gezeichnet.'], ['1', 'Ab C₄ gibt es verzweigte Isomere.']],
    'Pentan, 2-Methylbutan und 2,2-Dimethylpropan.'),
  mc('kw-cistrans', 2, 'Welche Verbindungen können cis/trans-Isomere bilden?', ['But-2-en', 'Pent-2-en'], [['But-1-en', 'An C-1 sitzen zwei H-Atome – Vertauschen ergibt dasselbe Molekül.'], ['2-Methylpropen', 'An C-2 sitzen zwei gleiche Methylgruppen.'], ['But-2-in', 'Die Dreifachbindung ist linear; es gibt keine zwei Seiten.']],
    'Bedingung: Jedes C der Doppelbindung trägt zwei verschiedene Substituenten.', 'struktur'),
  sc('kw-isomer-def', 2, 'verstaendnis', 'begriff', 'But-1-en und Cyclobutan haben beide die Formel C₄H₈. Was sind sie?', 'Konstitutionsisomere', [['cis/trans-Isomere', 'cis/trans-Isomere unterscheiden sich nur in der Lage an einer Doppelbindung, nicht in der Verknüpfung.'], ['derselbe Stoff', 'Die Atome sind ganz unterschiedlich verknüpft (Kette mit Doppelbindung bzw. Ring).'], ['Enantiomere', 'Beide Moleküle sind nicht chiral.']],
    'Gleiche Summenformel, andere Verknüpfung = Konstitutionsisomerie.'),
  // Eigenschaften
  od('kw-sdp', 3, 'Ordne nach steigender Siedetemperatur.', ['Methan', 'Propan', '2,2-Dimethylpropan', 'Pentan', 'Hexan'],
    'Längere Kette → höhere Siedetemperatur; das kugelige 2,2-Dimethylpropan (≈ 10 °C) siedet niedriger als n-Pentan (36 °C).'),
  sc('kw-loeslich', 3, 'verstaendnis', 'mechanismus', 'Warum löst sich Hexan nicht in Wasser?', 'Hexan ist unpolar und kann keine Wasserstoffbrücken zu Wasser bilden.', [['Weil Hexan zu schwer ist.', 'Die Masse ist nicht der Grund – Glukose ist schwerer und löst sich gut.'], ['Weil Hexan mit Wasser reagiert.', 'Alkane sind reaktionsträge.'], ['Weil Hexan eine Säure ist.', 'Alkane haben keine sauren H-Atome.']],
    'Gleiches löst sich in Gleichem: Unpolare Stoffe mischen sich mit unpolaren (Fette, Benzin), nicht mit Wasser.'),
  // Reaktionen
  od('kw-radikal', 4, 'Bringe die Schritte der radikalischen Chlorierung von Methan in die richtige Reihenfolge.', ['Cl₂ wird durch Licht in zwei Cl· gespalten', 'Cl· reißt ein H aus CH₄: CH₃· + HCl', 'CH₃· reagiert mit Cl₂: CH₃Cl + Cl·', 'Zwei Radikale verbinden sich: Kettenabbruch'],
    'Start – Kettenfortpflanzung (zwei Schritte) – Abbruch.'),
  sc('kw-brom', 4, 'anwendung', 'mechanismus', 'Ein unbekannter Kohlenwasserstoff entfärbt Bromwasser sofort. Was folgt daraus?', 'Er enthält wahrscheinlich eine C=C- oder C≡C-Mehrfachbindung.', [['Er ist ein Alkan.', 'Alkane reagieren mit Brom nur unter Licht und langsam.'], ['Er ist sehr polar.', 'Die Entfärbung zeigt eine Additionsreaktion, nicht die Polarität.'], ['Er enthält Sauerstoff.', 'Kohlenwasserstoffe enthalten keinen Sauerstoff.']],
    'Brom addiert an die Mehrfachbindung und wird dabei verbraucht – Nachweis für ungesättigte Verbindungen.'),
  mt('kw-reaktionstyp', 4, 'Ordne den Reaktionen den Reaktionstyp zu.', [['Methan + Chlor unter Licht', 'radikalische Substitution'], ['Ethen + Brom', 'elektrophile Addition'], ['Ethen + Wasserstoff (Katalysator)', 'Addition (Hydrierung)'], ['viele Ethenmoleküle → Polyethylen', 'Polymerisation']],
    'Substitution: ersetzen. Addition: anlagern. Polymerisation: viele Monomere verknüpfen.', 'verstaendnis'),
  sc('kw-markownikow', 4, 'analyse', 'mechanismus', 'HBr wird an Propen (CH₂=CH–CH₃) addiert. Welches Hauptprodukt entsteht nach Markownikow?', '2-Brompropan', [['1-Brompropan', 'Das H geht an das C, das schon mehr H trägt (C-1), Br an C-2.'], ['1,2-Dibrompropan', 'Bei HBr wird nur ein Br addiert.'], ['Propan', 'Es wird HBr, nicht H₂ addiert.']],
    'Über das stabilere sekundäre Carbokation an C-2 entsteht 2-Brompropan.'),
  tx('kw-unterschied', 4, 'Erkläre, warum Alkane mit Brom durch Substitution, Alkene dagegen durch Addition reagieren.',
    'Alkane haben nur stabile σ-Bindungen und keine Elektronen, die ein Elektrophil angreifen könnte. Sie reagieren erst, wenn Licht reaktive Radikale erzeugt; dann wird ein H-Atom ersetzt (Substitution). Alkene besitzen eine elektronenreiche π-Bindung. Sie greift das Brom als Elektrophil an, die π-Bindung wird aufgelöst und beide Br-Atome lagern sich an (Addition).',
    [['σ', 'sigma', 'einfachbindung'], ['π', 'pi', 'doppelbindung'], ['radikal'], ['elektrophil', 'addition']]),
  // Verbrennung und Biologie
  bal('kw-bal-propan', ['C₃H₈', 'O₂'], ['CO₂', 'H₂O'], [1, 5, 3, 4], 'Erst C (3 CO₂), dann H (4 H₂O), dann O: rechts 6 + 4 = 10 O, also 5 O₂.'),
  bal('kw-bal-butan', ['C₄H₁₀', 'O₂'], ['CO₂', 'H₂O'], [2, 13, 8, 10], 'Mit einem Butan käme man auf 6,5 O₂ – verdoppeln, um ganze Zahlen zu erhalten.'),
  bal('kw-bal-ethin', ['C₂H₂', 'O₂'], ['CO₂', 'H₂O'], [2, 5, 4, 2], 'Ethin (Schweißgas): 1 C₂H₂ bräuchte 2,5 O₂ – also alles verdoppeln.'),
  mt('kw-bio', 5, 'Ordne zu.', [['cis-Doppelbindungen', 'ungesättigte Fettsäuren in Ölen'], ['Isopren', 'Baustein von Cholesterin und Carotinoiden'], ['11-cis-Retinal → all-trans-Retinal', 'Sehvorgang'], ['Methan', 'Abbau ohne Sauerstoff durch Darmbakterien']],
    'Kohlenwasserstoff-Strukturen stecken in vielen Biomolekülen.', 'verstaendnis'),
  sc('kw-co', 5, 'verstaendnis', 'mechanismus', 'Warum ist eine unvollständige Verbrennung von Kohlenwasserstoffen (z. B. in einem schlecht belüfteten Raum) gefährlich?', 'Es entsteht Kohlenmonoxid, das fest an Hämoglobin bindet und den Sauerstofftransport blockiert.', [['Es entsteht mehr CO₂, das giftig ist.', 'Gefährlich ist vor allem das CO, das bei Sauerstoffmangel entsteht.'], ['Es entstehen Alkene, die explodieren.', 'Bei der Verbrennung entstehen keine Alkene als Hauptprodukt.'], ['Es entsteht Wasserstoff.', 'Wasserstoff ist hier nicht das Problem.']],
    'Bei O₂-Mangel: 2 CH₄ + 3 O₂ → 2 CO + 4 H₂O. CO bindet etwa 200- bis 300-mal stärker an Hämoglobin als O₂.'),
];
