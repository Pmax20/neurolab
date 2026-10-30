import { useMemo, useState } from 'react';
import { Tabs, shuffle } from './anatomyViews';
import { ALKANES } from '../../content/chem4';

// ===========================================================================
// Gerüstformeln: Jede Ecke und jedes Ende ist ein C-Atom, H-Atome sind weggelassen.
// ===========================================================================

type P = [number, number];
interface Mol { name: string; wrong: [string, string][]; pts: P[]; bonds: [number, number, 1 | 2 | 3][]; chain: number[]; why: string }

const zig = (n: number, x0 = 20, up = 70, down = 100): P[] => Array.from({ length: n }, (_, i) => [x0 + i * 46, i % 2 ? up : down]);
const single = (n: number) => Array.from({ length: n - 1 }, (_, i) => [i, i + 1, 1] as [number, number, 1]);

export const NAMING: Mol[] = [
  { name: '2-Methylpropan', wrong: [['Butan', 'Die längste Kette hat nur 3 C-Atome; das vierte C ist eine Seitenkette.'], ['1-Methylpropan', 'Eine Methylgruppe an C-1 würde die Kette nur verlängern – das wäre Butan.'], ['Isopropan', 'Diesen Namen gibt es nicht; der Trivialname ist Isobutan.']],
    pts: [...zig(3), [66, 26]], bonds: [...single(3), [1, 3, 1]], chain: [0, 1, 2], why: 'Längste Kette: 3 C (Propan). Methylgruppe an C-2. Trivialname: Isobutan, Summenformel C₄H₁₀ – ein Isomer von Butan.' },
  { name: '2-Methylbutan', wrong: [['3-Methylbutan', 'Nummeriert wird von der Seite, die der Verzweigung näher ist.'], ['Pentan', 'Pentan wäre unverzweigt.'], ['2-Ethylpropan', 'Die Ethylgruppe würde die Kette verlängern – längste Kette ist 4.']],
    pts: [...zig(4), [66, 26]], bonds: [...single(4), [1, 4, 1]], chain: [0, 1, 2, 3], why: 'Längste Kette: 4 C (Butan). Von links nummeriert steht die Methylgruppe an C-2 (von rechts wäre es C-3 – größer).' },
  { name: '2,2-Dimethylpropan', wrong: [['2-Dimethylpropan', 'Für jede Methylgruppe wird die Position angegeben: 2,2-.'], ['2,2-Methylpropan', 'Zwei gleiche Reste bekommen die Vorsilbe di-.'], ['Pentan', 'Pentan ist unverzweigt; hier hat ein C vier C-Nachbarn.']],
    pts: [[66, 70], [20, 70], [112, 70], [66, 26], [66, 114]], bonds: [[1, 0, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], chain: [1, 0, 2], why: 'Längste Kette: 3 C. Am mittleren C sitzen zwei Methylgruppen. Trivialname Neopentan, C₅H₁₂.' },
  { name: '3-Methylpentan', wrong: [['2-Ethylbutan', 'Die längste Kette läuft durch die Ethylgruppe und hat 5 C.'], ['3-Ethylbutan', 'Die längste Kette ist nicht die waagerechte.'], ['Hexan', 'Hexan wäre unverzweigt.']],
    pts: [...zig(4), [66, 26], [112, 4]], bonds: [...single(4), [1, 4, 1], [4, 5, 1]], chain: [5, 4, 1, 2, 3], why: 'Falle: Die längste Kette (5 C) biegt über die Seitenkette nach oben ab. An ihrem 3. C sitzt eine Methylgruppe.' },
  { name: '2,3-Dimethylbutan', wrong: [['2,2-Dimethylbutan', 'Die beiden Methylgruppen sitzen an verschiedenen C-Atomen.'], ['2,3-Methylbutan', 'Zwei gleiche Reste: Vorsilbe di-.'], ['Hexan', 'Summenformel stimmt (C₆H₁₄), aber Hexan ist unverzweigt.']],
    pts: [...zig(4), [66, 26], [112, 144]], bonds: [...single(4), [1, 4, 1], [2, 5, 1]], chain: [0, 1, 2, 3], why: 'Längste Kette: 4 C. Methylgruppen an C-2 und C-3.' },
  { name: 'Ethen', wrong: [['Ethan', 'Ethan hat nur eine Einfachbindung.'], ['Ethin', 'Ethin hat eine Dreifachbindung.'], ['Methen', 'Mit einem C-Atom gibt es keine Doppelbindung.']],
    pts: [[30, 80], [100, 80]], bonds: [[0, 1, 2]], chain: [0, 1], why: 'Zwei C-Atome mit Doppelbindung: Ethen (Ethylen), C₂H₄, planar mit 120°-Winkeln.' },
  { name: 'Propen', wrong: [['Prop-2-en', 'Die Doppelbindung bekommt die kleinstmögliche Nummer: Prop-1-en, kurz Propen.'], ['Propan', 'Hier ist eine Doppelbindung.'], ['Propin', 'Propin hätte eine Dreifachbindung.']],
    pts: zig(3), bonds: [[0, 1, 2], [1, 2, 1]], chain: [0, 1, 2], why: 'Drei C mit einer Doppelbindung. Da es nur eine mögliche Position gibt, sagt man einfach Propen.' },
  { name: 'But-1-en', wrong: [['But-3-en', 'Nummeriert wird so, dass die Doppelbindung die kleinste Nummer hat.'], ['But-2-en', 'Die Doppelbindung liegt am Kettenende, zwischen C-1 und C-2.'], ['Butan', 'Hier ist eine Doppelbindung.']],
    pts: zig(4), bonds: [[0, 1, 2], [1, 2, 1], [2, 3, 1]], chain: [0, 1, 2, 3], why: 'Doppelbindung zwischen C-1 und C-2. But-1-en hat keine cis/trans-Isomere, weil C-1 zwei H trägt.' },
  { name: 'trans-But-2-en', wrong: [['cis-But-2-en', 'Bei cis lägen beide CH₃-Gruppen auf derselben Seite der Doppelbindung.'], ['But-1-en', 'Die Doppelbindung liegt in der Mitte.'], ['trans-But-1-en', 'But-1-en hat keine cis/trans-Isomere.']],
    pts: zig(4), bonds: [[0, 1, 1], [1, 2, 2], [2, 3, 1]], chain: [0, 1, 2, 3], why: 'Doppelbindung zwischen C-2 und C-3; die beiden Methylgruppen liegen auf entgegengesetzten Seiten: trans (E).' },
  { name: 'cis-But-2-en', wrong: [['trans-But-2-en', 'Hier zeigen beide Kettenenden zur gleichen Seite.'], ['But-1-en', 'Die Doppelbindung liegt zwischen C-2 und C-3.'], ['Cyclobutan', 'Das wäre ein geschlossener Ring.']],
    pts: [[22, 112], [48, 72], [118, 72], [144, 112]], bonds: [[0, 1, 1], [1, 2, 2], [2, 3, 1]], chain: [0, 1, 2, 3], why: 'Beide Methylgruppen auf derselben Seite der Doppelbindung: cis (Z). Wie bei den cis-Doppelbindungen in ungesättigten Fettsäuren entsteht ein Knick.' },
  { name: '2-Methylpropen', wrong: [['2-Methylprop-2-en', 'Die Doppelbindung bekommt die kleinere Nummer (1); kurz: 2-Methylpropen.'], ['But-1-en', 'Gleiche Summenformel (C₄H₈), aber hier ist die Kette verzweigt.'], ['Isobutan', 'Isobutan ist gesättigt.']],
    pts: [...zig(3), [66, 26]], bonds: [[0, 1, 2], [1, 2, 1], [1, 3, 1]], chain: [0, 1, 2], why: 'Hauptkette mit Doppelbindung: 3 C. Methylgruppe an C-2. Ein Isomer von But-1-en und But-2-en.' },
  { name: '4-Methylpent-2-en', wrong: [['2-Methylpent-3-en', 'Die Doppelbindung hat Vorrang bei der Nummerierung vor der Seitenkette.'], ['4-Methylpent-3-en', 'Von dieser Seite nummeriert bekommt die Doppelbindung eine zu große Nummer.'], ['Hex-2-en', 'Die Kette ist verzweigt; die längste Kette mit der Doppelbindung hat 5 C.']],
    pts: [...zig(5), [158, 26]], bonds: [[0, 1, 1], [1, 2, 2], [2, 3, 1], [3, 4, 1], [3, 5, 1]], chain: [0, 1, 2, 3, 4], why: 'Erst die Doppelbindung möglichst klein nummerieren (C-2), dann die Seitenkette (C-4).' },
  { name: 'Propin', wrong: [['Propen', 'Propen hat eine Doppelbindung.'], ['Prop-2-in', 'Die Dreifachbindung bekommt die kleinste Nummer.'], ['Propan', 'Hier ist eine Dreifachbindung.']],
    pts: [[20, 80], [80, 80], [140, 80]], bonds: [[0, 1, 3], [1, 2, 1]], chain: [0, 1, 2], why: 'Drei C mit Dreifachbindung. Um die sp-hybridisierten C ist die Anordnung linear (180°).' },
  { name: 'But-2-in', wrong: [['But-1-in', 'Die Dreifachbindung liegt in der Mitte, zwischen C-2 und C-3.'], ['But-2-en', 'Hier ist eine Dreifachbindung.'], ['Butin-2,3', 'Angegeben wird nur die kleinere Nummer, und zwar vor der Endung: But-2-in.']],
    pts: [[20, 80], [70, 80], [130, 80], [180, 80]], bonds: [[0, 1, 1], [1, 2, 3], [2, 3, 1]], chain: [0, 1, 2, 3], why: 'Vier C in einer Linie, Dreifachbindung zwischen C-2 und C-3.' },
];

function bondLines(a: P, b: P, order: 1 | 2 | 3, key: string) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len;
  const ln = (o: number, shrink: number, k: string) => (
    <line key={k} x1={a[0] + dx * shrink + nx * o} y1={a[1] + dy * shrink + ny * o} x2={b[0] - dx * shrink + nx * o} y2={b[1] - dy * shrink + ny * o} stroke="#2b2440" strokeWidth={3} strokeLinecap="round" />
  );
  if (order === 1) return [ln(0, 0, key)];
  if (order === 2) return [ln(0, 0, key), ln(7, 0.14, `${key}b`)];
  return [ln(0, 0, key), ln(6, 0.08, `${key}b`), ln(-6, 0.08, `${key}c`)];
}

export function Skeletal({ m, numbers }: { m: Mol; numbers?: boolean }) {
  const xs = m.pts.map((p) => p[0]), ys = m.pts.map((p) => p[1]);
  // feste Mindestgröße, damit kleine Moleküle nicht riesig gezeichnet werden
  const w = Math.max(Math.max(...xs) - Math.min(...xs) + 52, 260), h = Math.max(Math.max(...ys) - Math.min(...ys) + 52, 170);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  return (
    <svg viewBox={`${cx - w / 2} ${cy - h / 2} ${w} ${h}`} role="img" aria-label="Gerüstformel" style={{ width: '100%', maxWidth: 360, maxHeight: 220, display: 'block', margin: '0 auto', background: '#fff', borderRadius: 8 }}>
      {m.bonds.flatMap(([i, j, o], k) => bondLines(m.pts[i], m.pts[j], o, `b${k}`))}
      {numbers && m.chain.map((idx, k) => <g key={k}><circle cx={m.pts[idx][0]} cy={m.pts[idx][1]} r={10} fill="var(--accent)" /><text x={m.pts[idx][0]} y={m.pts[idx][1] + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 11, fontWeight: 700 }}>{k + 1}</text></g>)}
    </svg>
  );
}

function NamingTrainer() {
  const [order, setOrder] = useState(() => shuffle(NAMING.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const m = NAMING[order[k]];
  const options = useMemo(() => (done ? [] : shuffle([m.name, ...m.wrong.map((w) => w[0])])), [k, order]); // eslint-disable-line react-hooks/exhaustive-deps
  const wrongWhy = ans && ans !== m.name ? m.wrong.find((w) => w[0] === ans)?.[1] : null;
  return (
    <div className="card stack">
      {done ? (
        <div className="row between"><b>{score} von {order.length} richtig benannt.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
      ) : (
        <>
          <div className="drill-q"><b>Wie heißt diese Verbindung?</b></div>
          <Skeletal m={m} numbers={!!ans} />
          <div className="row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>{options.map((o) => (
            <button key={o} className={ans ? (o === m.name ? 'primary' : '') : ''} aria-pressed={ans === o} onClick={() => { if (ans) return; setAns(o); if (o === m.name) setScore((x) => x + 1); }}>{o}</button>))}</div>
          {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === m.name ? 'var(--ok)' : 'var(--danger)' }}>{ans === m.name ? 'Richtig.' : `Nicht ganz – ${m.name}.`}</b> {wrongWhy && <>{wrongWhy} </>}{m.why} <span className="muted">Die Zahlen zeigen die Hauptkette mit ihrer Nummerierung.</span></p>}
          <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
        </>
      )}
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Gerüstformel: Jede Ecke und jedes Linienende ist ein C-Atom; die H-Atome sind weggelassen (jedes C hat insgesamt vier Bindungen).</p>
    </div>
  );
}

// ===========================================================================
// Vergleich Alkan / Alken / Alkin
// ===========================================================================

function Geometry({ kind }: { kind: 'sp3' | 'sp2' | 'sp' }) {
  const c = [80, 70];
  const arms = kind === 'sp3' ? [[80, 18], [30, 104], [130, 104], [96, 92]] : kind === 'sp2' ? [[80, 16], [33, 97], [127, 97]] : [[18, 70], [142, 70]];
  return (
    <svg viewBox="0 0 160 130" role="img" aria-label={`Geometrie ${kind}`} style={{ width: 150 }}>
      {arms.map(([x, y], i) => <g key={i}><line x1={c[0]} y1={c[1]} x2={x} y2={y} stroke="#6b6680" strokeWidth={3} strokeDasharray={kind === 'sp3' && i === 3 ? '4 3' : undefined} /><circle cx={x} cy={y} r={8} fill="#e9e4f3" stroke="#6b6680" /></g>)}
      <circle cx={c[0]} cy={c[1]} r={12} fill="#3b2a63" /><text x={c[0]} y={c[1] + 4} textAnchor="middle" fill="#fff" style={{ fontSize: 11, fontWeight: 700 }}>C</text>
    </svg>
  );
}

const COMPARE: [string, string, string, string][] = [
  ['Bindung', 'C–C', 'C=C', 'C≡C'],
  ['Allgemeine Formel', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂'],
  ['Hybridisierung', 'sp³', 'sp²', 'sp'],
  ['Geometrie, Winkel', 'tetraedrisch, 109,5°', 'trigonal planar, 120°', 'linear, 180°'],
  ['σ- und π-Bindungen', '1 σ', '1 σ + 1 π', '1 σ + 2 π'],
  ['Bindungslänge', '≈ 154 pm', '≈ 134 pm', '≈ 120 pm'],
  ['Drehbarkeit', 'frei drehbar', 'keine Drehung → cis/trans', 'linear, keine cis/trans'],
  ['Typische Reaktion', 'radikalische Substitution, Verbrennung', 'elektrophile Addition, Polymerisation', 'Addition'],
  ['Beispiel', 'Ethan C₂H₆', 'Ethen C₂H₄', 'Ethin C₂H₂'],
];

function Compare() {
  return (
    <div className="card stack">
      <div className="row" style={{ justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {([['sp3', 'Alkan · sp³'], ['sp2', 'Alken · sp²'], ['sp', 'Alkin · sp']] as const).map(([k, l]) => <div key={k} style={{ textAlign: 'center' }}><Geometry kind={k} /><div><b>{l}</b></div></div>)}
      </div>
      <table>
        <thead><tr><th /><th>Alkane</th><th>Alkene</th><th>Alkine</th></tr></thead>
        <tbody>{COMPARE.map(([a, b, c, d]) => <tr key={a}><th style={{ textAlign: 'left' }}>{a}</th><td>{b}</td><td>{c}</td><td>{d}</td></tr>)}</tbody>
      </table>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Bei sp³ ist die vierte Bindung gestrichelt, weil sie nach hinten zeigt (räumlicher Tetraeder). Bindungslängen gerundete Lehrbuchwerte.</p>
    </div>
  );
}

// ===========================================================================
// Homologe Reihe
// ===========================================================================

function Homologous() {
  const W = 520, H = 230, L = 40, B = 30, min = -180, max = 200;
  const y = (t: number) => 10 + ((max - t) / (max - min)) * (H - B - 10);
  const bw = (W - L - 10) / ALKANES.length;
  return (
    <div className="card stack">
      <table>
        <thead><tr><th>n</th><th>Name</th><th>Summenformel</th><th>Siedetemperatur</th><th>bei 20 °C</th></tr></thead>
        <tbody>{ALKANES.map((a) => <tr key={a.n}><td className="num">{a.n}</td><td>{a.name}</td><td>C{a.n > 1 ? sub(a.n) : ''}H{sub(2 * a.n + 2)}</td><td className="num">{a.bp} °C</td><td>{a.bp < 20 ? 'gasförmig' : 'flüssig'}</td></tr>)}</tbody>
      </table>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Siedetemperaturen der n-Alkane" style={{ background: '#fff', borderRadius: 8 }}>
        {[-150, -100, -50, 0, 50, 100, 150, 200].map((t) => <g key={t}><line x1={L} x2={W - 10} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#999' : '#eee'} /><text x={L - 5} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10 }} fill="#777">{t}</text></g>)}
        <line x1={L} x2={W - 10} y1={y(20)} y2={y(20)} stroke="var(--eosin)" strokeDasharray="5 4" /><text x={L + 6} y={y(20) - 5} style={{ fontSize: 10 }} fill="var(--eosin)">Raumtemperatur 20 °C</text>
        {ALKANES.map((a, i) => { const x = L + i * bw + bw * 0.18; const top = Math.min(y(a.bp), y(0)); const h = Math.abs(y(a.bp) - y(0)); return <g key={a.n}><rect x={x} y={top} width={bw * 0.64} height={Math.max(h, 1)} fill={a.bp < 20 ? '#9fb8e6' : 'var(--accent)'} rx={3} /><text x={x + bw * 0.32} y={H - 8} textAnchor="middle" style={{ fontSize: 10 }} fill="#555">C{a.n}</text></g>; })}
      </svg>
      <p style={{ margin: 0 }}>Mit jeder CH₂-Gruppe wird das Molekül länger, die Van-der-Waals-Kräfte werden stärker, die Siedetemperatur steigt. Methan bis Butan sind bei Raumtemperatur Gase (Erdgas, Campinggas), ab Pentan Flüssigkeiten (Benzin), lange Ketten sind fest (Paraffin, Kerzenwachs). Verzweigte Isomere sieden niedriger: 2,2-Dimethylpropan bei etwa 10 °C, n-Pentan bei 36 °C.</p>
    </div>
  );
}
const sub = (n: number) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);

// ===========================================================================
// Reaktionsmechanismen
// ===========================================================================

const MECH: Record<'subst' | 'add', { title: string; eq: string; text: string }[]> = {
  subst: [
    { title: 'Start', eq: 'Cl₂ —Licht→ 2 Cl·', text: 'Licht spaltet das Chlormolekül homolytisch: Jedes Chloratom behält ein Elektron. Es entstehen zwei sehr reaktive Radikale (ungepaartes Elektron, ·).' },
    { title: 'Kettenfortpflanzung 1', eq: 'CH₄ + Cl· → CH₃· + HCl', text: 'Das Chlorradikal reißt ein H-Atom aus dem Methan. Es entsteht Chlorwasserstoff und ein Methylradikal.' },
    { title: 'Kettenfortpflanzung 2', eq: 'CH₃· + Cl₂ → CH₃Cl + Cl·', text: 'Das Methylradikal reagiert mit dem nächsten Chlormolekül. Es entsteht Chlormethan – und ein neues Chlorradikal, das die Kette weiterführt. Ein einziges Startradikal kann so Tausende Reaktionen auslösen.' },
    { title: 'Kettenabbruch', eq: 'Cl· + Cl· → Cl₂  ·  CH₃· + Cl· → CH₃Cl  ·  CH₃· + CH₃· → C₂H₆', text: 'Treffen zwei Radikale aufeinander, verbinden sie sich und die Kette endet.' },
    { title: 'Ergebnis', eq: 'CH₄ + Cl₂ → CH₃Cl + HCl', text: 'Ein H-Atom wurde durch Cl ersetzt: Substitution. Bei Chlorüberschuss entstehen auch Dichlor-, Trichlor- (Chloroform) und Tetrachlormethan.' },
  ],
  add: [
    { title: 'Polarisierung', eq: 'CH₂=CH₂ + Br–Br', text: 'Die elektronenreiche π-Bindung des Ethens nähert sich dem Brommolekül und polarisiert es: Das nähere Br wird positiv, das fernere negativ (Brδ⁺–Brδ⁻).' },
    { title: 'Bromonium-Ion', eq: 'CH₂–CH₂ mit Br⁺-Brücke + Br⁻', text: 'Die π-Elektronen greifen das Brδ⁺ an (Elektrophil). Die Br–Br-Bindung bricht heterolytisch: Es entstehen ein ringförmiges Bromonium-Ion und ein Bromid-Ion.' },
    { title: 'Rückseitenangriff', eq: 'Br⁻ greift von der Gegenseite an', text: 'Das Bromid-Ion greift eines der C-Atome von der Seite an, die der Brücke gegenüberliegt. Der Ring öffnet sich.' },
    { title: 'Ergebnis', eq: 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br', text: '1,2-Dibromethan entsteht, die Doppelbindung ist verschwunden: Addition. Die beiden Br sitzen trans zueinander (anti-Addition). Weil das braune Brom verbraucht wird, entfärbt sich Bromwasser – ein Nachweis für C=C-Doppelbindungen.' },
  ],
};

function Mechanisms() {
  const [kind, setKind] = useState<'subst' | 'add'>('subst');
  const [i, setI] = useState(0);
  const steps = MECH[kind];
  const s = steps[i];
  return (
    <div className="card stack">
      <div className="seg" role="tablist" aria-label="Reaktion">{([['subst', 'Alkan + Chlor: radikalische Substitution'], ['add', 'Alken + Brom: elektrophile Addition']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setI(0); }}>{l}</button>)}</div>
      <div className="row between" style={{ alignItems: 'center' }}><b>{i + 1}. {s.title}</b>
        <div className="row"><button className="small" disabled={i === 0} onClick={() => setI(i - 1)}>Zurück</button><button className="small primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Weiter</button></div></div>
      <div className="balance-eq" style={{ justifyContent: 'center' }} aria-live="polite">{s.eq}</div>
      <p style={{ margin: 0 }}>{s.text}</p>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Merke: Alkane – Substitution (ein Atom wird ersetzt). Alkene – Addition (Atome werden angelagert, die Doppelbindung verschwindet).</p>
    </div>
  );
}

export function HydrocarbonsView() {
  const [tab, setTab] = useState<'benennen' | 'vergleich' | 'reihe' | 'reaktionen'>('vergleich');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['vergleich', 'Alkan, Alken, Alkin'], ['benennen', 'Benennen'], ['reihe', 'Homologe Reihe'], ['reaktionen', 'Reaktionen']]} />
      {tab === 'vergleich' && <Compare />}
      {tab === 'benennen' && <NamingTrainer />}
      {tab === 'reihe' && <Homologous />}
      {tab === 'reaktionen' && <Mechanisms />}
    </div>
  );
}
