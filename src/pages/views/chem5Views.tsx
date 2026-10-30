import { useMemo, useState } from 'react';
import { SimView } from './semesterViews';
import { Tabs, shuffle } from './anatomyViews';

const de = (x: number, d = 2) => x.toFixed(d).replace('.', ',');

// ===========================================================================
// Kleiner Frage-Trainer (Frage → Auswahl → Begründung)
// ===========================================================================

export interface QItem { q: string; head?: string; answer: string; options: string[]; why: string }

export function QuizTrainer({ items, hint }: { items: QItem[]; hint?: string }) {
  const [order, setOrder] = useState(() => shuffle(items.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const it = items[order[k]];
  const opts = useMemo(() => (done ? [] : shuffle(it.options.includes(it.answer) ? it.options : [it.answer, ...it.options])), [k, order]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="card stack">
      {done ? (
        <div className="row between"><b>{score} von {order.length} richtig.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
      ) : (
        <>
          {it.head && <div className="balance-eq" style={{ justifyContent: 'center' }}>{it.head}</div>}
          <div className="drill-q">{it.q}</div>
          <div className="row" style={{ flexWrap: 'wrap' }}>{opts.map((o) => (
            <button key={o} className={ans ? (o === it.answer ? 'primary' : '') : ''} aria-pressed={ans === o} onClick={() => { if (ans) return; setAns(o); if (o === it.answer) setScore((x) => x + 1); }}>{o}</button>))}</div>
          {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === it.answer ? 'var(--ok)' : 'var(--danger)' }}>{ans === it.answer ? 'Richtig.' : `Nicht ganz – ${it.answer}.`}</b> {it.why}</p>}
          <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
        </>
      )}
      {hint && <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>{hint}</p>}
    </div>
  );
}

export function Stepper({ examples }: { examples: { name: string; steps: { title: string; eq: string; text: string }[] }[] }) {
  const [e, setE] = useState(0);
  const [i, setI] = useState(0);
  const ex = examples[e];
  const s = ex.steps[i];
  return (
    <div className="card stack">
      {examples.length > 1 && <div className="seg" role="tablist" aria-label="Beispiel" style={{ flexWrap: 'wrap' }}>{examples.map((x, k) => <button key={x.name} role="tab" aria-selected={e === k} onClick={() => { setE(k); setI(0); }}>{x.name}</button>)}</div>}
      <div className="row between" style={{ alignItems: 'center' }}><b>{i + 1}. {s.title}</b>
        <div className="row"><button className="small" disabled={i === 0} onClick={() => setI(i - 1)}>Zurück</button><button className="small primary" disabled={i === ex.steps.length - 1} onClick={() => setI(i + 1)}>Weiter</button></div></div>
      <div className="balance-eq" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }} aria-live="polite">{s.eq.split('\n').map((l, k) => <div key={k}>{l}</div>)}</div>
      <p style={{ margin: 0 }}>{s.text}</p>
    </div>
  );
}

// ===========================================================================
// Redox
// ===========================================================================

const OXZ: QItem[] = [
  { q: 'Welche Oxidationszahl hat Mangan in MnO₄⁻ (Permanganat)?', head: 'MnO₄⁻', answer: '+VII', options: ['+VII', '+IV', '+II', '−I'], why: '4 · (−II) = −8; Gesamtladung −1 → Mn = +7.' },
  { q: 'Welche Oxidationszahl hat Schwefel in SO₄²⁻ (Sulfat)?', head: 'SO₄²⁻', answer: '+VI', options: ['+VI', '+IV', '−II', '+II'], why: '4 · (−II) = −8; Ladung −2 → S = +6.' },
  { q: 'Welche Oxidationszahl hat Kohlenstoff in CO₂?', head: 'CO₂', answer: '+IV', options: ['+IV', '+II', '0', '−IV'], why: '2 · (−II) = −4; neutral → C = +4. Höchste Oxidationsstufe des C.' },
  { q: 'Welche Oxidationszahl hat Kohlenstoff in Methan, CH₄?', head: 'CH₄', answer: '−IV', options: ['−IV', '+IV', '0', '−II'], why: '4 · (+I) = +4; neutral → C = −4. Niedrigste Oxidationsstufe des C.' },
  { q: 'Welche Oxidationszahl hat Sauerstoff in H₂O₂?', head: 'H₂O₂', answer: '−I', options: ['−I', '−II', '0', '+I'], why: 'Peroxid: 2 · (+I) + 2x = 0 → x = −1. Ausnahme von der Regel „O = −II“.' },
  { q: 'Welche Oxidationszahl hat Chrom in Cr₂O₇²⁻ (Dichromat)?', head: 'Cr₂O₇²⁻', answer: '+VI', options: ['+VI', '+III', '+VII', '+II'], why: '7 · (−II) = −14; Ladung −2 → 2 Cr = +12 → Cr = +6.' },
  { q: 'Welche Oxidationszahl hat Stickstoff in NH₄⁺?', head: 'NH₄⁺', answer: '−III', options: ['−III', '+III', '+V', '0'], why: '4 · (+I) = +4; Ladung +1 → N = −3.' },
  { q: 'Welche Oxidationszahl hat Stickstoff in NO₃⁻ (Nitrat)?', head: 'NO₃⁻', answer: '+V', options: ['+V', '+III', '−III', '+II'], why: '3 · (−II) = −6; Ladung −1 → N = +5.' },
  { q: 'Welche Oxidationszahl hat Eisen in Fe₂O₃?', head: 'Fe₂O₃', answer: '+III', options: ['+III', '+II', '+VI', '+I,5'], why: '3 · (−II) = −6 → 2 Fe = +6 → Fe = +3.' },
  { q: 'Welche Oxidationszahl hat das Carbonyl-C in Formaldehyd, H₂C=O?', head: 'H₂C=O', answer: '0', options: ['0', '+II', '−II', '+IV'], why: '2 · (+I) + (−II) = 0 → C = 0. Methanol (−II) → Formaldehyd (0) → Ameisensäure (+II) → CO₂ (+IV): schrittweise Oxidation.' },
  { q: 'Welche Oxidationszahl hat Chlor in ClO⁻ (Hypochlorit, im Desinfektionsmittel)?', head: 'ClO⁻', answer: '+I', options: ['+I', '−I', '+V', '0'], why: 'O = −II; Ladung −1 → Cl = +1. Hypochlorit ist ein starkes Oxidationsmittel.' },
  { q: 'Welche Oxidationszahl hat Wasserstoff in Natriumhydrid, NaH?', head: 'NaH', answer: '−I', options: ['−I', '+I', '0', '+II'], why: 'Na ist +I; in Metallhydriden ist H die Ausnahme −I.' },
];

const REDOX_STEPS = [
  { name: 'Permanganat + Eisen(II), sauer', steps: [
    { title: 'Oxidationszahlen bestimmen', eq: 'Mn⁺ⱽᴵᴵO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺', text: 'Mangan geht von +VII auf +II (Reduktion), Eisen von +II auf +III (Oxidation). Permanganat ist das Oxidationsmittel.' },
    { title: 'Oxidation als Teilgleichung', eq: 'Fe²⁺ → Fe³⁺ + e⁻', text: 'Ein Elektron wird abgegeben.' },
    { title: 'Reduktion als Teilgleichung', eq: 'MnO₄⁻ + 5 e⁻ → Mn²⁺', text: 'Von +VII auf +II: fünf Elektronen werden aufgenommen.' },
    { title: 'Ladung ausgleichen (sauer: mit H⁺)', eq: 'MnO₄⁻ + 5 e⁻ + 8 H⁺ → Mn²⁺', text: 'Links: −1 − 5 = −6, rechts +2. Mit 8 H⁺ wird links auf +2 ausgeglichen.' },
    { title: 'H und O mit Wasser ausgleichen', eq: 'MnO₄⁻ + 5 e⁻ + 8 H⁺ → Mn²⁺ + 4 H₂O', text: 'Die vier O-Atome und acht H-Atome landen in vier Wassermolekülen.' },
    { title: 'Elektronen angleichen und addieren', eq: '5 Fe²⁺ → 5 Fe³⁺ + 5 e⁻\nMnO₄⁻ + 8 H⁺ + 5 Fe²⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O', text: 'Die Oxidation mal 5, damit gleich viele Elektronen abgegeben wie aufgenommen werden. Die Elektronen kürzen sich heraus. Probe: Ladung links +17, rechts +17.' },
  ] },
  { name: 'Ethanol → Acetaldehyd (biologisch)', steps: [
    { title: 'Oxidationszahlen', eq: 'CH₃–C⁻ᴵH₂OH → CH₃–C⁺ᴵHO', text: 'Das C mit der OH-Gruppe geht von −I auf +I: Ethanol wird oxidiert (zwei Elektronen und zwei H werden entfernt).' },
    { title: 'Teilgleichung', eq: 'C₂H₅OH → CH₃CHO + 2 H⁺ + 2 e⁻', text: 'Bei organischen Oxidationen werden oft Wasserstoff, also H⁺ und Elektronen, abgegeben.' },
    { title: 'Elektronenakzeptor NAD⁺', eq: 'NAD⁺ + 2 e⁻ + H⁺ → NADH', text: 'Im Körper nimmt das Coenzym NAD⁺ die Elektronen auf (Alkoholdehydrogenase in der Leber).' },
    { title: 'Gesamtgleichung', eq: 'C₂H₅OH + NAD⁺ → CH₃CHO + NADH + H⁺', text: 'Acetaldehyd wird anschließend zu Essigsäure weiteroxidiert. Er ist mitverantwortlich für den „Kater“.' },
  ] },
];

const METALS: { sym: string; name: string; E: number; ion: string }[] = [
  { sym: 'Mg', name: 'Magnesium', E: -2.37, ion: 'Mg²⁺' }, { sym: 'Al', name: 'Aluminium', E: -1.66, ion: 'Al³⁺' }, { sym: 'Zn', name: 'Zink', E: -0.76, ion: 'Zn²⁺' },
  { sym: 'Fe', name: 'Eisen', E: -0.44, ion: 'Fe²⁺' }, { sym: 'Pb', name: 'Blei', E: -0.13, ion: 'Pb²⁺' }, { sym: 'H₂', name: 'Wasserstoff', E: 0, ion: 'H⁺' },
  { sym: 'Cu', name: 'Kupfer', E: 0.34, ion: 'Cu²⁺' }, { sym: 'Ag', name: 'Silber', E: 0.8, ion: 'Ag⁺' }, { sym: 'Au', name: 'Gold', E: 1.5, ion: 'Au³⁺' },
];

function Galvanic() {
  const [a, setA] = useState('Zn');
  const [b, setB] = useState('Cu');
  const A = METALS.find((m) => m.sym === a)!, B = METALS.find((m) => m.sym === b)!;
  const [an, ca] = A.E <= B.E ? [A, B] : [B, A];
  const dE = ca.E - an.E;
  const sel = (v: string, set: (x: string) => void, label: string) => (
    <label className="field" style={{ margin: 0, flex: '1 1 160px' }}><span className="lab"><b>{label}</b></span>
      <select value={v} onChange={(e) => set(e.target.value)}>{METALS.filter((m) => m.sym !== 'H₂').map((m) => <option key={m.sym} value={m.sym}>{m.name} ({de(m.E)} V)</option>)}</select></label>
  );
  return (
    <div className="card stack">
      <div className="row" style={{ flexWrap: 'wrap', gap: 16 }}>{sel(a, setA, 'Halbzelle 1')}{sel(b, setB, 'Halbzelle 2')}</div>
      {a === b ? <p className="muted">Wähle zwei verschiedene Metalle.</p> : (
        <>
          <svg viewBox="0 0 520 250" role="img" aria-label={`Galvanische Zelle ${an.name}/${ca.name}, ${de(dE)} Volt`} style={{ background: '#fff', borderRadius: 8 }}>
            <rect x={40} y={110} width={160} height={110} rx={8} fill="#e8f0fb" stroke="#8aa3c8" /><rect x={320} y={110} width={160} height={110} rx={8} fill="#e8f0fb" stroke="#8aa3c8" />
            <rect x={105} y={70} width={30} height={130} fill="#9a9aa6" /><rect x={385} y={70} width={30} height={130} fill="#c58b4a" />
            <path d="M175,140 C175,90 345,90 345,140" fill="none" stroke="#d9c99a" strokeWidth={18} /><text x={260} y={84} textAnchor="middle" style={{ fontSize: 12 }} fill="#776">Salzbrücke</text>
            <path d="M120,70 L120,30 L400,30 L400,70" fill="none" stroke="#333" strokeWidth={2} />
            <circle cx={260} cy={30} r={18} fill="#fff" stroke="#333" strokeWidth={2} /><text x={260} y={35} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700 }}>V</text>
            <text x={190} y={22} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--accent)">e⁻ →</text><text x={330} y={22} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--accent)">e⁻ →</text>
            <text x={120} y={240} textAnchor="middle" style={{ fontSize: 13 }}><tspan fontWeight={700}>{an.sym}</tspan> · Anode (−) · Oxidation</text>
            <text x={400} y={240} textAnchor="middle" style={{ fontSize: 13 }}><tspan fontWeight={700}>{ca.sym}</tspan> · Kathode (+) · Reduktion</text>
            <text x={120} y={180} textAnchor="middle" style={{ fontSize: 12 }} fill="#456">{an.ion}</text><text x={400} y={180} textAnchor="middle" style={{ fontSize: 12 }} fill="#456">{ca.ion}</text>
          </svg>
          <p style={{ margin: 0 }} aria-live="polite"><b>ΔE = {de(ca.E)} V − ({de(an.E)} V) = {de(dE)} V.</b> {an.name} ist unedler und wird oxidiert ({an.sym} → {an.ion} + e⁻); an der {ca.name}-Elektrode werden {ca.ion}-Ionen reduziert. Die Elektronen fließen durch den Draht von {an.sym} nach {ca.sym}.</p>
        </>
      )}
      <table><thead><tr><th>Redoxpaar</th><th>E° (V)</th></tr></thead><tbody>{METALS.map((m) => <tr key={m.sym}><td>{m.sym === 'H₂' ? 'H₂ / 2 H⁺ (Bezug)' : `${m.sym} / ${m.ion}`}</td><td className="num">{de(m.E)}</td></tr>)}</tbody></table>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Standardpotenziale bei 25 °C und 1 mol/l. Oben unedel (gibt leicht Elektronen ab), unten edel.</p>
    </div>
  );
}

export function Redox2View() {
  const [tab, setTab] = useState<'oxz' | 'gleichung' | 'zelle' | 'sim'>('oxz');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['oxz', 'Oxidationszahlen'], ['gleichung', 'Redoxgleichung aufstellen'], ['zelle', 'Galvanische Zelle'], ['sim', 'Simulation Redoxpotenzial']]} />
      {tab === 'oxz' && <QuizTrainer items={OXZ} hint="Regeln: Element 0 · O meist −II · H meist +I · F immer −I · Summe = Ladung des Teilchens." />}
      {tab === 'gleichung' && <Stepper examples={REDOX_STEPS} />}
      {tab === 'zelle' && <Galvanic />}
      {tab === 'sim' && <SimView models={['redox']} />}
    </div>
  );
}

// ===========================================================================
// Komplexe
// ===========================================================================

const KX: QItem[] = [
  { q: 'Welche Oxidationszahl hat das Zentralion?', head: '[Fe(CN)₆]⁴⁻', answer: '+II', options: ['+II', '+III', '+IV', '+VI'], why: '6 CN⁻ = −6; Komplexladung −4 → Fe = +2. Name: Hexacyanidoferrat(II).' },
  { q: 'Welche Oxidationszahl hat das Zentralion?', head: '[Fe(CN)₆]³⁻', answer: '+III', options: ['+III', '+II', '+VI', '−III'], why: '−6 + x = −3 → Fe = +3: Hexacyanidoferrat(III).' },
  { q: 'Welche Oxidationszahl hat das Zentralion?', head: '[Cu(NH₃)₄]²⁺', answer: '+II', options: ['+II', '+IV', '0', '+VI'], why: 'NH₃ ist neutral, also trägt Cu die ganze Ladung +2: Tetraamminkupfer(II), tiefblau.' },
  { q: 'Welche Koordinationszahl hat das Zentralion?', head: '[Cu(NH₃)₄]²⁺', answer: '4', options: ['4', '2', '6', '1'], why: 'Vier einzähnige NH₃-Liganden → KZ 4.' },
  { q: 'Welche Geometrie hat der Komplex?', head: '[Ag(NH₃)₂]⁺', answer: 'linear', options: ['linear', 'tetraedrisch', 'oktaedrisch', 'quadratisch-planar'], why: 'KZ 2 → linear. Diamminsilber(I) ist das Tollens-Reagenz (Silberspiegel bei Aldehyden).' },
  { q: 'Welche Koordinationszahl entsteht mit einem EDTA-Liganden?', head: '[Ca(EDTA)]²⁻', answer: '6', options: ['6', '1', '4', '2'], why: 'EDTA ist sechszähnig: zwei N und vier Carboxylat-O binden gleichzeitig – KZ 6, oktaedrisch.' },
  { q: 'Welche Geometrie hat Cisplatin?', head: '[PtCl₂(NH₃)₂]', answer: 'quadratisch-planar', options: ['quadratisch-planar', 'tetraedrisch', 'oktaedrisch', 'linear'], why: 'Pt²⁺ mit KZ 4 bildet quadratisch-planare Komplexe. Nur in dieser Geometrie gibt es cis- und trans-Formen.' },
  { q: 'Welche Ladung hat Cisplatin insgesamt?', head: '[PtCl₂(NH₃)₂]', answer: '0 (neutral)', options: ['0 (neutral)', '+2', '−2', '+4'], why: 'Pt²⁺ (+2) + 2 Cl⁻ (−2) + 2 NH₃ (0) = 0.' },
  { q: 'Welches Metall sitzt im Zentrum?', head: 'Häm (Hämoglobin)', answer: 'Fe²⁺', options: ['Fe²⁺', 'Mg²⁺', 'Co³⁺', 'Cu²⁺'], why: 'Fe²⁺ im Porphyrinring; wird es zu Fe³⁺ oxidiert (Methämoglobin), bindet es kein O₂ mehr.' },
  { q: 'Welches Metall sitzt im Zentrum?', head: 'Chlorophyll', answer: 'Mg²⁺', options: ['Mg²⁺', 'Fe²⁺', 'Zn²⁺', 'Mn²⁺'], why: 'Chlorophyll hat einen ähnlichen Porphyrinring wie Häm, aber mit Magnesium.' },
  { q: 'Welches Metall sitzt im Zentrum?', head: 'Vitamin B₁₂ (Cobalamin)', answer: 'Co', options: ['Co', 'Fe', 'Cu', 'Ni'], why: 'Cobalt – daher der Name Cobalamin.' },
  { q: 'Wie viele Zähne hat der Ligand?', head: 'Ethylendiamin H₂N–CH₂–CH₂–NH₂', answer: 'zweizähnig', options: ['zweizähnig', 'einzähnig', 'vierzähnig', 'sechszähnig'], why: 'Beide N-Atome tragen ein freies Elektronenpaar und binden gleichzeitig – ein Chelatring entsteht.' },
  { q: 'Welcher Chelatbildner hilft bei Eisenüberladung?', head: 'Antidot', answer: 'Deferoxamin', options: ['Deferoxamin', 'Cisplatin', 'Gadolinium', 'Ammoniak'], why: 'Deferoxamin bindet Fe³⁺ sehr fest; der Komplex wird über die Niere ausgeschieden.' },
];

const LIGANDS: [string, string, string, string][] = [
  ['H₂O', 'aqua', '1', 'neutral'], ['NH₃', 'ammin', '1', 'neutral'], ['CO', 'carbonyl', '1', 'neutral'], ['Cl⁻', 'chlorido', '1', '−1'], ['CN⁻', 'cyanido', '1', '−1'], ['OH⁻', 'hydroxido', '1', '−1'],
  ['Ethylendiamin (en)', 'ethylendiamin', '2', 'neutral'], ['Oxalat C₂O₄²⁻', 'oxalato', '2', '−2'], ['Porphyrin (Häm)', '–', '4', '−2'], ['EDTA⁴⁻', 'edta', '6', '−4'],
];
const MED: [string, string, string][] = [
  ['Cisplatin', 'Pt²⁺, quadratisch-planar', 'Zytostatikum: bindet an DNA-Basen und vernetzt die DNA'],
  ['Gadolinium-Chelate', 'Gd³⁺ mit mehrzähnigem Liganden', 'MRT-Kontrastmittel; im Chelat ungiftig und ausscheidbar'],
  ['EDTA', 'sechszähnig', 'Bleivergiftung; als K-EDTA im Blutröhrchen gegen Gerinnung (bindet Ca²⁺)'],
  ['Natriumcitrat', 'bindet Ca²⁺', 'Gerinnungshemmung in Blutkonserven und Gerinnungsröhrchen'],
  ['Deferoxamin', 'bindet Fe³⁺', 'Eisenüberladung, Eisenvergiftung'],
  ['Dimercaprol', 'S-haltiger Chelatbildner', 'Arsen-, Quecksilbervergiftung'],
  ['Berliner Blau', 'Eisen-Cyanido-Komplex', 'Thalliumvergiftung (bindet Tl⁺ im Darm)'],
  ['Hämoglobin', 'Fe²⁺, oktaedrisch', 'O₂-Transport; CO bindet viel fester als O₂'],
];

export function ComplexesView() {
  const [tab, setTab] = useState<'trainer' | 'liganden' | 'medizin'>('trainer');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['trainer', 'Komplexe bestimmen'], ['liganden', 'Liganden'], ['medizin', 'Komplexe in der Medizin']]} />
      {tab === 'trainer' && <QuizTrainer items={KX} hint="Komplexladung = Ladung des Zentralions + Summe der Ligandladungen. Koordinationszahl = Zahl der gebundenen Ligand-Atome." />}
      {tab === 'liganden' && <div className="card stack"><table><thead><tr><th>Ligand</th><th>Name im Komplex</th><th>Zähnigkeit</th><th>Ladung</th></tr></thead><tbody>{LIGANDS.map((l) => <tr key={l[0]}>{l.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody></table>
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Geometrie nach Koordinationszahl: 2 linear · 4 tetraedrisch (z. B. Zn²⁺) oder quadratisch-planar (Pt²⁺, Ni²⁺, Cu²⁺) · 6 oktaedrisch.</p></div>}
      {tab === 'medizin' && <div className="card"><table><thead><tr><th>Stoff</th><th>Aufbau</th><th>Verwendung</th></tr></thead><tbody>{MED.map((l) => <tr key={l[0]}>{l.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody></table></div>}
    </div>
  );
}

// ===========================================================================
// Energetik und Kinetik
// ===========================================================================

function EnergyDiagram() {
  const [dH, setDH] = useState(-60);
  const [Ea, setEa] = useState(90);
  const [cat, setCat] = useState(false);
  const W = 520, H = 280, base = 165, sc = 0.85;
  const y = (e: number) => base - e * sc;
  const curve = (ea: number) => `M20,${y(0)} L120,${y(0)} C180,${y(0)} 200,${y(ea)} 250,${y(ea)} C300,${y(ea)} 320,${y(dH)} 380,${y(dH)} L500,${y(dH)}`;
  const eaCat = Math.max(Math.max(dH, 0) + 10, Ea * 0.45);
  return (
    <div className="card stack">
      <div className="row" style={{ flexWrap: 'wrap', gap: 16 }}>
        <label className="field" style={{ flex: '1 1 200px', margin: 0 }}><span className="lab"><b>ΔH = {dH} kJ/mol</b><span className="muted">{dH < 0 ? 'exotherm' : dH > 0 ? 'endotherm' : ''}</span></span><input type="range" min={-120} max={80} step={5} value={dH} onChange={(e) => { const v = Number(e.target.value); setDH(v); if (Ea < Math.max(v, 0) + 15) setEa(Math.max(v, 0) + 15); }} aria-label="Reaktionsenthalpie" /></label>
        <label className="field" style={{ flex: '1 1 200px', margin: 0 }}><span className="lab"><b>Aktivierungsenergie = {Ea} kJ/mol</b></span><input type="range" min={Math.max(dH, 0) + 15} max={160} step={5} value={Ea} onChange={(e) => setEa(Number(e.target.value))} aria-label="Aktivierungsenergie" /></label>
        <label className="row" style={{ alignItems: 'center' }}><input type="checkbox" checked={cat} onChange={(e) => setCat(e.target.checked)} /> Katalysator</label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Energiediagramm" style={{ background: '#fff', borderRadius: 8 }}>
        <line x1={20} x2={20} y1={10} y2={H - 10} stroke="#999" /><text x={26} y={20} style={{ fontSize: 11 }} fill="#777">Energie</text><text x={500} y={H - 8} textAnchor="end" style={{ fontSize: 11 }} fill="#777">Reaktionsverlauf →</text>
        <path d={curve(Ea)} fill="none" stroke="#3b2a63" strokeWidth={3} />
        {cat && <path d={curve(eaCat)} fill="none" stroke="var(--ok)" strokeWidth={3} strokeDasharray="7 4" />}
        <line x1={250} x2={250} y1={y(0)} y2={y(Ea)} stroke="var(--eosin)" /><text x={256} y={(y(0) + y(Ea)) / 2} style={{ fontSize: 12 }} fill="var(--eosin)">E_A</text>
        <line x1={440} x2={440} y1={y(0)} y2={y(dH)} stroke="var(--accent)" markerEnd="" /><line x1={380} x2={460} y1={y(0)} y2={y(0)} stroke="#ccc" strokeDasharray="3 3" /><text x={446} y={(y(0) + y(dH)) / 2 + 4} style={{ fontSize: 12 }} fill="var(--accent)">ΔH</text>
        <text x={60} y={y(0) - 8} style={{ fontSize: 12 }}>Edukte</text><text x={420} y={y(dH) + (dH < 0 ? 18 : -8)} style={{ fontSize: 12 }}>Produkte</text>
      </svg>
      <p style={{ margin: 0 }} aria-live="polite">{dH < 0 ? 'Exotherm: Die Produkte liegen energetisch tiefer, Wärme wird frei.' : dH > 0 ? 'Endotherm: Die Produkte liegen höher, Wärme muss aufgenommen werden.' : 'Thermoneutral.'} Die Höhe des Bergs (E_A) bestimmt, wie schnell die Reaktion abläuft. {cat && 'Der Katalysator senkt den Berg (grün), lässt aber Anfangs- und Endniveau – und damit ΔH, ΔG und das Gleichgewicht – unverändert.'}</p>
    </div>
  );
}

function HalfLife() {
  const [t, setT] = useState(4);
  const [c0, setC0] = useState(100);
  const W = 520, H = 240, L = 44, B = 30, tmax = 24;
  const x = (tt: number) => L + (tt / tmax) * (W - L - 10), y = (c: number) => 10 + (1 - c / 100) * (H - B - 10);
  const pts = Array.from({ length: 121 }, (_, i) => { const tt = (i / 120) * tmax; return [tt, c0 * 0.5 ** (tt / t)] as const; });
  return (
    <div className="card stack">
      <div className="row" style={{ flexWrap: 'wrap', gap: 16 }}>
        <label className="field" style={{ flex: '1 1 200px', margin: 0 }}><span className="lab"><b>Halbwertszeit = {t} h</b></span><input type="range" min={1} max={12} step={1} value={t} onChange={(e) => setT(Number(e.target.value))} aria-label="Halbwertszeit" /></label>
        <label className="field" style={{ flex: '1 1 200px', margin: 0 }}><span className="lab"><b>Anfangskonzentration = {c0} %</b></span><input type="range" min={20} max={100} step={10} value={c0} onChange={(e) => setC0(Number(e.target.value))} aria-label="Anfangskonzentration" /></label>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Abbaukurve 1. Ordnung" style={{ background: '#fff', borderRadius: 8 }}>
        {[0, 25, 50, 75, 100].map((c) => <g key={c}><line x1={L} x2={W - 10} y1={y(c)} y2={y(c)} stroke="#eee" /><text x={L - 5} y={y(c) + 4} textAnchor="end" style={{ fontSize: 10 }} fill="#777">{c}</text></g>)}
        {[0, 4, 8, 12, 16, 20, 24].map((tt) => <text key={tt} x={x(tt)} y={H - 12} textAnchor="middle" style={{ fontSize: 10 }} fill="#777">{tt} h</text>)}
        {Array.from({ length: Math.floor(tmax / t) }, (_, n) => n + 1).map((n) => <g key={n}><line x1={x(n * t)} x2={x(n * t)} y1={y(c0 * 0.5 ** n)} y2={y(0)} stroke="var(--eosin)" strokeDasharray="3 3" /><circle cx={x(n * t)} cy={y(c0 * 0.5 ** n)} r={3.5} fill="var(--eosin)" /></g>)}
        <path d={pts.map(([tt, c], i) => `${i ? 'L' : 'M'}${x(tt).toFixed(1)},${y(c).toFixed(1)}`).join(' ')} fill="none" stroke="#3b2a63" strokeWidth={2.5} />
      </svg>
      <p style={{ margin: 0 }}>Nach jeder Halbwertszeit ist die Hälfte des jeweils noch vorhandenen Stoffs abgebaut – egal, wie viel es am Anfang war. Nach 5 Halbwertszeiten ({5 * t} h) sind noch etwa 3 % übrig. k = ln 2 / t½ = {de(Math.LN2 / t, 3)} h⁻¹.</p>
    </div>
  );
}

const GIBBS: QItem[] = [
  { q: 'ΔH < 0 und ΔS > 0. Läuft die Reaktion freiwillig ab?', answer: 'bei jeder Temperatur', options: ['bei jeder Temperatur', 'nie', 'nur bei hoher Temperatur', 'nur bei tiefer Temperatur'], why: 'Beide Terme in ΔG = ΔH − TΔS sind negativ: ΔG ist immer < 0.' },
  { q: 'ΔH > 0 und ΔS < 0. Läuft die Reaktion freiwillig ab?', answer: 'nie', options: ['nie', 'bei jeder Temperatur', 'nur bei hoher Temperatur', 'nur bei tiefer Temperatur'], why: 'Beide Terme sind positiv: ΔG ist immer > 0.' },
  { q: 'ΔH > 0 und ΔS > 0 (z. B. Schmelzen von Eis). Wann läuft der Vorgang freiwillig ab?', answer: 'nur bei hoher Temperatur', options: ['nur bei hoher Temperatur', 'nur bei tiefer Temperatur', 'nie', 'bei jeder Temperatur'], why: 'Erst wenn T·ΔS größer als ΔH ist, wird ΔG negativ – Eis schmilzt oberhalb 0 °C.' },
  { q: 'ΔH < 0 und ΔS < 0 (z. B. Gefrieren von Wasser). Wann läuft der Vorgang freiwillig ab?', answer: 'nur bei tiefer Temperatur', options: ['nur bei tiefer Temperatur', 'nur bei hoher Temperatur', 'nie', 'bei jeder Temperatur'], why: 'Bei tiefer Temperatur überwiegt das negative ΔH; bei hoher der ungünstige −TΔS-Term.' },
  { q: 'Wie ändert ein Katalysator ΔG einer Reaktion?', answer: 'gar nicht', options: ['gar nicht', 'ΔG wird negativer', 'ΔG wird positiver', 'ΔG wird 0'], why: 'Ein Katalysator senkt nur die Aktivierungsenergie.' },
  { q: 'Welche Reaktionsordnung hat der Abbau der meisten Arzneistoffe?', answer: '1. Ordnung', options: ['1. Ordnung', '0. Ordnung', '2. Ordnung', '3. Ordnung'], why: 'Die Abbaugeschwindigkeit ist proportional zur Konzentration – deshalb gibt es eine konstante Halbwertszeit.' },
  { q: 'Ethanol wird bei höheren Blutspiegeln mit nahezu konstanter Geschwindigkeit abgebaut. Welche Ordnung ist das?', answer: '0. Ordnung', options: ['0. Ordnung', '1. Ordnung', '2. Ordnung', 'keine Ordnung'], why: 'Das Enzym (Alkoholdehydrogenase) ist gesättigt: pro Stunde wird etwa dieselbe Menge abgebaut, unabhängig von der Konzentration.' },
];

export function EnergeticsView() {
  const [tab, setTab] = useState<'diagramm' | 'halbwert' | 'quiz'>('diagramm');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['diagramm', 'Energiediagramm'], ['halbwert', 'Halbwertszeit'], ['quiz', 'ΔG und Ordnung']]} />
      {tab === 'diagramm' && <EnergyDiagram />}
      {tab === 'halbwert' && <HalfLife />}
      {tab === 'quiz' && <QuizTrainer items={GIBBS} hint="ΔG = ΔH − T·ΔS. Negativ = freiwillig." />}
    </div>
  );
}
