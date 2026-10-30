import { useMemo, useState } from 'react';
import { SimView } from './semesterViews';
import { AcidBaseView } from './molViews';
import { Tabs, shuffle } from './anatomyViews';
import { PKS_TABLE } from '../../content/chem3';

const de = (x: number, d = 2) => x.toFixed(d).replace('.', ',');

// ===========================================================================
// Le-Chatelier-Trainer
// ===========================================================================

type Shift = 'Produkte' | 'Edukte' | 'keine Verschiebung';
type LcCase = { reaction: string; info: string; change: string; answer: Shift; why: string };

const LC: LcCase[] = [
  { reaction: 'N₂ + 3 H₂ ⇌ 2 NH₃', info: 'exotherm, alle Stoffe gasförmig', change: 'Der Druck wird erhöht.', answer: 'Produkte', why: 'Links stehen 4, rechts 2 Gasteilchen. Höherer Druck begünstigt die Seite mit weniger Teilchen.' },
  { reaction: 'N₂ + 3 H₂ ⇌ 2 NH₃', info: 'exotherm, alle Stoffe gasförmig', change: 'Die Temperatur wird erhöht.', answer: 'Edukte', why: 'Die Hinreaktion ist exotherm, also ist die Rückreaktion endotherm. Erwärmen begünstigt die endotherme Richtung – und verkleinert hier K.' },
  { reaction: 'N₂ + 3 H₂ ⇌ 2 NH₃', info: 'exotherm, alle Stoffe gasförmig', change: 'Ammoniak wird laufend aus dem Gemisch entfernt.', answer: 'Produkte', why: 'Entfernt man ein Produkt, wird es nachgebildet.' },
  { reaction: 'N₂ + 3 H₂ ⇌ 2 NH₃', info: 'exotherm, alle Stoffe gasförmig', change: 'Ein Katalysator wird zugegeben.', answer: 'keine Verschiebung', why: 'Ein Katalysator beschleunigt Hin- und Rückreaktion gleich stark. Das Gleichgewicht stellt sich schneller ein, liegt aber gleich.' },
  { reaction: 'H₂ + I₂ ⇌ 2 HI', info: 'alle Stoffe gasförmig', change: 'Der Druck wird erhöht.', answer: 'keine Verschiebung', why: 'Auf beiden Seiten stehen 2 Gasteilchen – der Druck beeinflusst die Lage nicht.' },
  { reaction: 'Essigsäure + Ethanol ⇌ Ester + Wasser', info: 'in Lösung', change: 'Es wird zusätzlich Ethanol zugegeben.', answer: 'Produkte', why: 'Mehr Edukt → mehr Produkt. So erhöht man im Labor die Esterausbeute.' },
  { reaction: 'Essigsäure + Ethanol ⇌ Ester + Wasser', info: 'in Lösung', change: 'Es wird zusätzlich Wasser zugegeben.', answer: 'Edukte', why: 'Wasser ist hier ein Produkt. Mehr Produkt verschiebt das Gleichgewicht zurück (Esterhydrolyse).' },
  { reaction: 'AgCl(s) ⇌ Ag⁺ + Cl⁻', info: 'gesättigte Lösung mit Bodenkörper', change: 'Es wird Kochsalz (NaCl) zugegeben.', answer: 'Edukte', why: 'Gleichioniger Zusatz: Mehr Cl⁻ drückt das Gleichgewicht zum Feststoff, es fällt AgCl aus, die Löslichkeit sinkt.' },
  { reaction: 'AgCl(s) ⇌ Ag⁺ + Cl⁻', info: 'gesättigte Lösung mit Bodenkörper', change: 'Es wird noch mehr festes AgCl zugegeben.', answer: 'keine Verschiebung', why: 'Feststoffe stehen nicht im Löslichkeitsprodukt. Die Lösung ist schon gesättigt, mehr Bodenkörper ändert nichts.' },
  { reaction: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻', info: 'Blut', change: 'Durch Hyperventilation wird vermehrt CO₂ abgeatmet.', answer: 'Edukte', why: 'CO₂ wird entfernt, also verschieben sich die Gleichgewichte nach links: H⁺ wird verbraucht, der pH steigt (respiratorische Alkalose).' },
  { reaction: '2 NO₂ ⇌ N₂O₄', info: 'exotherm, gasförmig; NO₂ ist braun, N₂O₄ farblos', change: 'Der Kolben wird in Eiswasser gestellt.', answer: 'Produkte', why: 'Kühlen begünstigt die exotherme Richtung: Mehr farbloses N₂O₄, das Gas wird heller.' },
  { reaction: 'Hb + 4 O₂ ⇌ Hb(O₂)₄', info: 'vereinfacht', change: 'In der Lunge ist der O₂-Partialdruck hoch.', answer: 'Produkte', why: 'Viel O₂ verschiebt das Gleichgewicht zum beladenen Hämoglobin; im Gewebe mit wenig O₂ wird es wieder abgegeben.' },
];

function LeChatelier() {
  const [order, setOrder] = useState(() => shuffle(LC.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<Shift | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const c = LC[order[k]];
  const opts: Shift[] = ['Produkte', 'Edukte', 'keine Verschiebung'];
  return (
    <div className="card stack">
      {done ? (
        <div className="row between"><b>{score} von {order.length} richtig.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
      ) : (
        <>
          <div className="balance-eq" style={{ justifyContent: 'center' }}>{c.reaction}</div>
          <p className="muted" style={{ margin: 0, textAlign: 'center' }}>{c.info}</p>
          <div className="drill-q">{c.change} <b>Wohin verschiebt sich das Gleichgewicht?</b></div>
          <div className="row" style={{ flexWrap: 'wrap' }}>{opts.map((o) => (
            <button key={o} className={ans ? (o === c.answer ? 'primary' : '') : ''} aria-pressed={ans === o} onClick={() => { if (ans) return; setAns(o); if (o === c.answer) setScore((x) => x + 1); }}>
              {o === 'Produkte' ? '→ zu den Produkten' : o === 'Edukte' ? '← zu den Edukten' : 'keine Verschiebung'}
            </button>))}</div>
          {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === c.answer ? 'var(--ok)' : 'var(--danger)' }}>{ans === c.answer ? 'Richtig.' : `Nicht ganz – ${c.answer === 'keine Verschiebung' ? 'keine Verschiebung' : `Richtung ${c.answer}`}.`}</b> {c.why}</p>}
          <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
        </>
      )}
    </div>
  );
}

// ===========================================================================
// MWG-Tabelle: A + B ⇌ C + D mit wählbarem K und Anfangsmengen
// ===========================================================================

export function solveAB(K: number, a: number, b: number, c0 = 0, d0 = 0): number {
  // (c0 + x)(d0 + x) = K (a − x)(b − x)  →  (1 − K)x² + (c0 + d0 + K(a + b))x + c0·d0 − K·a·b = 0
  const A = 1 - K, B = c0 + d0 + K * (a + b), C = c0 * d0 - K * a * b;
  const lo = -Math.min(c0, d0), hi = Math.min(a, b);
  const f = (x: number) => A * x * x + B * x + C;
  let l = lo, h = hi;
  for (let i = 0; i < 80; i++) { const m = (l + h) / 2; if (f(l) * f(m) <= 0) h = m; else l = m; }
  return (l + h) / 2;
}

function MwgTable() {
  const [K, setK] = useState(4);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const x = useMemo(() => solveAB(K, a, b), [K, a, b]);
  const rows: [string, number, string, number][] = [['Essigsäure (A)', a, '−x', a - x], ['Ethanol (B)', b, '−x', b - x], ['Ester (C)', 0, '+x', x], ['Wasser (D)', 0, '+x', x]];
  const max = Math.max(a, b, x, 0.01);
  return (
    <div className="card stack">
      <div className="balance-eq" style={{ justifyContent: 'center' }}>A + B ⇌ C + D &nbsp; · &nbsp; K = [C]·[D] / ([A]·[B])</div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 18 }}>
        <label className="field" style={{ flex: '1 1 180px', margin: 0 }}><span className="lab"><b>K = {de(K, 1)}</b></span><input type="range" min={0.1} max={20} step={0.1} value={K} onChange={(e) => setK(Number(e.target.value))} aria-label="Gleichgewichtskonstante" /></label>
        <label className="field" style={{ flex: '1 1 180px', margin: 0 }}><span className="lab"><b>Anfang A: {de(a, 1)} mol</b></span><input type="range" min={0.5} max={5} step={0.5} value={a} onChange={(e) => setA(Number(e.target.value))} aria-label="Anfangsmenge A" /></label>
        <label className="field" style={{ flex: '1 1 180px', margin: 0 }}><span className="lab"><b>Anfang B: {de(b, 1)} mol</b></span><input type="range" min={0.5} max={5} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="Anfangsmenge B" /></label>
      </div>
      <table>
        <thead><tr><th>Stoff</th><th>Anfang</th><th>Änderung</th><th>Gleichgewicht</th><th style={{ width: '35%' }} /></tr></thead>
        <tbody>{rows.map(([n, s, d, e]) => (
          <tr key={n}><td>{n}</td><td className="num">{de(s)} mol</td><td className="num">{d}</td><td className="num"><b>{de(e)} mol</b></td>
            <td><div style={{ height: 12, borderRadius: 6, background: n.includes('(C)') || n.includes('(D)') ? 'var(--accent)' : 'var(--eosin)', width: `${(e / max) * 100}%`, minWidth: 2 }} /></td></tr>))}</tbody>
      </table>
      <p style={{ margin: 0 }} aria-live="polite">Lösung: <b>x = {de(x, 3)} mol</b> – das sind <b>{de((x / Math.min(a, b)) * 100, 0)} %</b> der Unterschusskomponente. Probe: {de(x, 3)}² / ({de(a - x, 3)} · {de(b - x, 3)}) = {de((x * x) / ((a - x) * (b - x)), 2)} ≈ K.</p>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Probiere: Verdopple B bei K = 4 – der Umsatz von A steigt (Le Chatelier). Bei großem K läuft die Reaktion fast vollständig, bei kleinem K kaum ab. Das Volumen kürzt sich hier heraus, weil auf beiden Seiten gleich viele Teilchen stehen.</p>
    </div>
  );
}

export function EquilibriumView() {
  const [tab, setTab] = useState<'sim' | 'tabelle' | 'chatelier'>('tabelle');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['tabelle', 'Rechnen mit dem MWG'], ['chatelier', 'Le Chatelier'], ['sim', 'Simulation Hin- und Rückreaktion']]} />
      {tab === 'tabelle' && <MwgTable />}
      {tab === 'chatelier' && <LeChatelier />}
      {tab === 'sim' && <SimView models={['gleichgewicht']} />}
    </div>
  );
}

// ===========================================================================
// Titrationskurve
// ===========================================================================

/** pH bei der Titration einer einprotonigen Säure (pKs; null = stark) mit NaOH – exakte Ladungsbilanz. */
export function titrationPH(pks: number | null, ca: number, Va: number, cb: number, Vb: number): number {
  const Ka = pks === null ? 1e8 : 10 ** -pks;
  const V = Va + Vb;
  const CA = (ca * Va) / V, Na = (cb * Vb) / V;
  const f = (h: number) => h + Na - 1e-14 / h - (CA * Ka) / (Ka + h);
  let lo = -15, hi = 1;
  for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(10 ** m) > 0) hi = m; else lo = m; }
  return -(lo + hi) / 2;
}

const ACIDS = [
  { id: 'hcl', name: 'Salzsäure (stark)', pks: null as number | null },
  { id: 'essig', name: 'Essigsäure (pK_S 4,76)', pks: 4.76 },
  { id: 'nh4', name: 'Ammonium (pK_S 9,25)', pks: 9.25 },
];

function Titration() {
  const [acid, setAcid] = useState('essig');
  const [vb, setVb] = useState(5);
  const A = ACIDS.find((x) => x.id === acid)!;
  const ca = 0.1, Va = 20, cb = 0.1, Veq = (ca * Va) / cb;
  const pts = useMemo(() => Array.from({ length: 161 }, (_, i) => { const v = (i / 160) * 40; return [v, titrationPH(A.pks, ca, Va, cb, v)] as const; }), [A.pks]);
  const W = 520, H = 280, L = 44, B = 36;
  const x = (v: number) => L + (v / 40) * (W - L - 12);
  const y = (p: number) => H - B - (p / 14) * (H - B - 10);
  const cur = titrationPH(A.pks, ca, Va, cb, vb);
  const state = vb < 0.01 ? 'Ausgangslösung' : Math.abs(vb - Veq / 2) < 0.6 && A.pks !== null ? 'Halbäquivalenzpunkt: [HA] = [A⁻], pH = pK_S' : Math.abs(vb - Veq) < 0.6 ? 'Äquivalenzpunkt' : vb < Veq ? (A.pks !== null ? 'Pufferbereich: HA und A⁻ nebeneinander' : 'Säure im Überschuss') : 'Natronlauge im Überschuss';
  return (
    <div className="card stack">
      <div className="row" style={{ flexWrap: 'wrap' }}>
        <div className="seg" role="tablist" aria-label="Säure">{ACIDS.map((a) => <button key={a.id} role="tab" aria-selected={acid === a.id} onClick={() => setAcid(a.id)}>{a.name}</button>)}</div>
      </div>
      <label className="field" style={{ margin: 0 }}><span className="lab"><b>Zugegebene Natronlauge: {de(vb, 1)} ml</b><span className="muted">20 ml Säure, je 0,1 mol/l</span></span>
        <input type="range" min={0} max={40} step={0.5} value={vb} onChange={(e) => setVb(Number(e.target.value))} aria-label="Volumen Natronlauge" /></label>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Titrationskurve, aktuell pH ${de(cur)}`} style={{ background: '#fff', borderRadius: 8 }}>
        {[0, 2, 4, 6, 8, 10, 12, 14].map((p) => <g key={p}><line x1={L} x2={W - 12} y1={y(p)} y2={y(p)} stroke="#eee" /><text x={L - 6} y={y(p) + 4} textAnchor="end" style={{ fontSize: 11 }} fill="#777">{p}</text></g>)}
        {[0, 10, 20, 30, 40].map((v) => <text key={v} x={x(v)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }} fill="#777">{v}</text>)}
        <text x={(W + L) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }} fill="#555">V(NaOH) in ml</text>
        <text x={12} y={H / 2} transform={`rotate(-90 12 ${H / 2})`} textAnchor="middle" style={{ fontSize: 12 }} fill="#555">pH</text>
        <line x1={x(Veq)} x2={x(Veq)} y1={10} y2={H - B} stroke="var(--eosin)" strokeDasharray="5 4" /><text x={x(Veq) + 4} y={22} style={{ fontSize: 11 }} fill="var(--eosin)">Äquivalenzpunkt</text>
        {A.pks !== null && <><line x1={x(Veq / 2)} x2={x(Veq / 2)} y1={y(A.pks)} y2={H - B} stroke="var(--accent)" strokeDasharray="3 3" /><line x1={L} x2={x(Veq / 2)} y1={y(A.pks)} y2={y(A.pks)} stroke="var(--accent)" strokeDasharray="3 3" /><text x={L + 4} y={y(A.pks) - 4} style={{ fontSize: 11 }} fill="var(--accent)">pH = pK_S</text></>}
        <path d={pts.map(([v, p], i) => `${i ? 'L' : 'M'}${x(v).toFixed(1)},${y(p).toFixed(1)}`).join(' ')} fill="none" stroke="#3b2a63" strokeWidth={2.5} />
        <circle cx={x(vb)} cy={y(cur)} r={6} fill="var(--accent)" stroke="#fff" strokeWidth={2} />
      </svg>
      <p style={{ margin: 0 }} aria-live="polite"><b>pH {de(cur)}</b> · {state}{Math.abs(vb - Veq) < 0.6 && <> – {A.pks === null ? 'bei starker Säure und starker Base pH 7.' : A.pks < 7 ? 'im Basischen, weil nur noch die konjugierte Base vorliegt.' : 'noch basischer, weil NH₃ entsteht.'}</>}</p>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Berechnet aus der vollständigen Ladungsbilanz (inklusive Autoprotolyse des Wassers), 25 °C, ideale Lösungen. Der Verbrauch bis zum Äquivalenzpunkt ist bei allen drei Säuren gleich – nur der Kurvenverlauf unterscheidet sich.</p>
    </div>
  );
}

function PksTable() {
  return (
    <div className="card stack">
      <p style={{ margin: 0 }}>Je <b>kleiner</b> der pK_S, desto <b>stärker</b> die Säure und desto schwächer ihre konjugierte Base. Für jedes Paar gilt pK_S + pK_B = 14.</p>
      <table>
        <thead><tr><th>Säure</th><th>konjugierte Base</th><th>pK_S</th><th>pK_B der Base</th></tr></thead>
        <tbody>{PKS_TABLE.map((r) => <tr key={r.acid}><td>{r.acid}</td><td>{r.base}</td><td className="num">{r.pks === null ? '< 0' : de(r.pks)}</td><td className="num">{r.pks === null ? '> 14' : de(14 - r.pks)}{r.note && <span className="muted"> · {r.note}</span>}</td></tr>)}</tbody>
      </table>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Werte bei 25 °C, auf zwei Stellen gerundet; Lehrbücher weichen in der zweiten Nachkommastelle teils ab. In Aufgaben gilt der angegebene Wert.</p>
    </div>
  );
}

export function AcidBase2View() {
  const [tab, setTab] = useState<'titration' | 'pks' | 'puffer'>('titration');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['titration', 'Titrationskurve'], ['pks', 'pK_S-Tabelle'], ['puffer', 'pH-Rechner und Puffer']]} />
      {tab === 'titration' && <Titration />}
      {tab === 'pks' && <PksTable />}
      {tab === 'puffer' && <AcidBaseView />}
    </div>
  );
}
