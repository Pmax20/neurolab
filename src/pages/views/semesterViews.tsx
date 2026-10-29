import { useMemo, useState, type ReactNode } from 'react';
import { Workbench } from '../../ui/Workbench';
import { modelById } from '../../engine/registry';
import { StructurePanel } from '../StructureInfo';
import { Splitter } from '../../ui/common';
import { TERM_CARDS, structureById } from '../../content';
import type { TermCard } from '../../content/bio1';
import { TermTrainer } from './termViews';
import { ZoomBox } from '../../ui/Zoom';

// ===========================================================================
// Allgemeine Simulationsansicht (für Lektionen, deren Modell keine eigene Grafik braucht)
// ===========================================================================

export function SimView({ models }: { models: string[] }) {
  const [i, setI] = useState(0);
  const m = modelById(models[i]);
  if (!m) return <div className="notice danger">Simulation nicht gefunden.</div>;
  return (
    <div className="stack">
      {models.length > 1 && (
        <div className="seg" role="tablist" aria-label="Simulation wählen">
          {models.map((id, k) => <button key={id} role="tab" aria-selected={k === i} onClick={() => setI(k)}>{modelById(id)?.title}</button>)}
        </div>
      )}
      <Workbench key={m.id} model={m} />
    </div>
  );
}

// ===========================================================================
// Zellzyklus, Mitose und Meiose
// ===========================================================================

const MAT = '#c8456c';
const PAT = '#4b3a8c';
type Len = 'L' | 'S';
interface Ch { dx: number; dy: number; len: Len; col: string; two: boolean; tips?: (string | null)[]; faint?: boolean }
interface CellSpec { cx: number; cy: number; r: number; nucleus: 'solid' | 'none'; spindle?: boolean; pinch?: boolean; chroms: Ch[] }
interface Stage { id: string; title: string; text: string; ploidy: string; dna: string; cells: CellSpec[] }

const ch = (dx: number, dy: number, len: Len, col: string, two: boolean, tips?: (string | null)[]): Ch => ({ dx, dy, len, col, two, tips });

function chromosome(c: Ch, cx: number, cy: number, scale: number, key: string) {
  const h = (c.len === 'L' ? 36 : 22) * scale;
  const w = 6 * scale;
  const x = cx + c.dx * scale;
  const y = cy + c.dy * scale;
  const op = c.faint ? 0.35 : 1;
  const chromatid = (ox: number, tip: string | null | undefined, k: string) => (
    <g key={k}>
      <rect x={x + ox} y={y - h / 2} width={w} height={h} rx={w / 2} fill={c.col} opacity={op} />
      {tip && <rect x={x + ox} y={y - h / 2} width={w} height={h * 0.38} rx={w / 2} fill={tip} opacity={op} />}
    </g>
  );
  return (
    <g key={key}>
      {c.two ? [chromatid(-w - 0.5 * scale, c.tips?.[0], 'a'), chromatid(0.5 * scale, c.tips?.[1], 'b')] : chromatid(-w / 2, c.tips?.[0], 'a')}
      {c.two && !c.faint && <circle cx={x} cy={y} r={2.2 * scale} fill="#222" />}
    </g>
  );
}

function CellSvg({ cell, k }: { cell: CellSpec; k: string }) {
  const s = Math.max(cell.r / 110, 0.7);
  return (
    <g key={k}>
      {cell.pinch
        ? <path d={`M ${cell.cx - cell.r} ${cell.cy} a ${cell.r} ${cell.r * 0.9} 0 0 1 ${cell.r * 2} 0 a ${cell.r} ${cell.r * 0.9} 0 0 1 ${-cell.r * 2} 0`} fill="#fbf3f6" stroke="#b98aa0" strokeWidth={2} />
        : <circle cx={cell.cx} cy={cell.cy} r={cell.r} fill="#fbf3f6" stroke="#b98aa0" strokeWidth={2} />}
      {cell.nucleus === 'solid' && <circle cx={cell.cx} cy={cell.cy} r={cell.r * 0.62} fill="#efe6f5" stroke="#8b7bb8" strokeWidth={1.5} />}
      {cell.spindle && (
        <g stroke="#9aa4b2" strokeWidth={1} opacity={0.8}>
          {cell.chroms.flatMap((c, i) => {
            const x = cell.cx + c.dx * s; const y = cell.cy + c.dy * s;
            const L = cell.cx - cell.r * 0.85; const R = cell.cx + cell.r * 0.85;
            const poles = Math.abs(c.dx) < 1 ? [L, R] : c.dx < 0 ? [L] : [R];
            return poles.map((pole, k) => <line key={`${i}-${k}`} x1={pole} y1={cell.cy} x2={x} y2={y} />);
          })}
          <circle cx={cell.cx - cell.r * 0.85} cy={cell.cy} r={4} fill="#5c6a7a" />
          <circle cx={cell.cx + cell.r * 0.85} cy={cell.cy} r={4} fill="#5c6a7a" />
        </g>
      )}
      {cell.chroms.map((c, i) => chromosome(c, cell.cx, cell.cy, s, `${k}-${i}`))}
    </g>
  );
}

const ONE = (r = 110) => ({ cx: 260, cy: 130, r });
const TWO: [number, number][] = [[140, 130], [380, 130]];
const FOUR: [number, number][] = [[68, 130], [196, 130], [324, 130], [452, 130]];

function mitosisStages(): Stage[] {
  const faint = (c: Ch) => ({ ...c, faint: true });
  const interphase = (two: boolean) => [ch(-30, -20, 'L', MAT, two), ch(-6, -26, 'L', PAT, two), ch(20, 18, 'S', MAT, two), ch(40, 10, 'S', PAT, two)].map(faint);
  const daughter = (cx: number, cy: number): CellSpec => ({ cx, cy, r: 92, nucleus: 'solid', chroms: [ch(-30, -10, 'L', MAT, false), ch(-12, -12, 'L', PAT, false), ch(12, 14, 'S', MAT, false), ch(30, 12, 'S', PAT, false)] });
  return [
    { id: 'g1', title: 'G1-Phase', text: 'Die Zelle wächst und arbeitet. Jedes Chromosom besteht aus einer DNA-Doppelhelix (einem Chromatid) und liegt entspiralisiert im Kern.', ploidy: '2n', dna: '2c', cells: [{ ...ONE(), nucleus: 'solid', chroms: interphase(false) }] },
    { id: 's', title: 'S-Phase', text: 'Replikation: Jedes Chromosom wird verdoppelt und besteht danach aus zwei identischen Schwesterchromatiden. Die Chromosomenzahl bleibt gleich.', ploidy: '2n', dna: '2c → 4c', cells: [{ ...ONE(), nucleus: 'solid', chroms: interphase(true) }] },
    { id: 'g2', title: 'G2-Phase', text: 'Vorbereitung der Teilung. Am G2/M-Kontrollpunkt wird geprüft, ob die Replikation vollständig und fehlerfrei war.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'solid', chroms: interphase(true) }] },
    { id: 'pro', title: 'Prophase', text: 'Die Chromosomen kondensieren und werden als Zwei-Chromatid-Chromosomen sichtbar. Die Zentrosomen wandern auseinander, die Spindel entsteht.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'solid', chroms: [ch(-40, -30, 'L', MAT, true), ch(25, -38, 'L', PAT, true), ch(-25, 35, 'S', MAT, true), ch(38, 28, 'S', PAT, true)] }] },
    { id: 'prometa', title: 'Prometaphase', text: 'Die Kernhülle zerfällt. Spindelfasern heften sich an die Kinetochoren an den Zentromeren an.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'none', spindle: true, chroms: [ch(-35, -40, 'L', MAT, true), ch(20, -30, 'L', PAT, true), ch(-15, 40, 'S', MAT, true), ch(30, 30, 'S', PAT, true)] }] },
    { id: 'meta', title: 'Metaphase', text: 'Alle Chromosomen liegen in der Äquatorialebene. Erst wenn jedes Kinetochor von beiden Seiten gehalten wird, gibt der Spindelkontrollpunkt die Anaphase frei.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'none', spindle: true, chroms: [ch(0, -66, 'L', MAT, true), ch(0, -22, 'L', PAT, true), ch(0, 20, 'S', MAT, true), ch(0, 56, 'S', PAT, true)] }] },
    { id: 'ana', title: 'Anaphase', text: 'Die Schwesterchromatiden werden getrennt und zu den gegenüberliegenden Polen gezogen. Jeder Pol erhält einen vollständigen Satz.', ploidy: 'je Pol 2n', dna: 'je Pol 2c', cells: [{ ...ONE(), nucleus: 'none', spindle: true, chroms: [-1, 1].flatMap((sgn) => [ch(sgn * 58, -66, 'L', MAT, false), ch(sgn * 58, -22, 'L', PAT, false), ch(sgn * 58, 20, 'S', MAT, false), ch(sgn * 58, 56, 'S', PAT, false)]) }] },
    { id: 'telo', title: 'Telophase und Zytokinese', text: 'Neue Kernhüllen entstehen, die Chromosomen entspiralisieren sich, das Zytoplasma wird geteilt. Ergebnis: zwei genetisch identische, diploide Tochterzellen.', ploidy: '2n je Zelle', dna: '2c je Zelle', cells: TWO.map(([x, y]) => daughter(x, y)) },
  ];
}

function meiosisStages(nd: boolean): Stage[] {
  // Crossing-over zwischen den inneren Chromatiden des langen Chromosomenpaars
  const Lm = (dx: number, dy: number) => ch(dx, dy, 'L', MAT, true, [null, PAT]);
  const Lp = (dx: number, dy: number) => ch(dx, dy, 'L', PAT, true, [MAT, null]);
  const Sm = (dx: number, dy: number) => ch(dx, dy, 'S', MAT, true);
  const Sp = (dx: number, dy: number) => ch(dx, dy, 'S', PAT, true);
  // Anaphase I: lange Homologe trennen sich; kurzes Paar regulär oder (Non-Disjunction) gemeinsam nach links
  const anaI = [Lm(-60, -40), Lp(60, -40), ...(nd ? [Sp(-60, 30), Sm(-44, 56)] : [Sp(-60, 40), Sm(60, 40)])];
  const left = nd ? [Lm(-14, -14), Sp(14, -10), Sm(2, 34)] : [Lm(-12, -10), Sp(12, 16)];
  const right = nd ? [Lp(0, -6)] : [Lp(-12, -10), Sm(12, 16)];
  const cell = (cx: number, cy: number, chroms: Ch[], extra: Partial<CellSpec> = {}): CellSpec => ({ cx, cy, r: 92, nucleus: 'solid', chroms, ...extra });
  const meta2 = (c: Ch[]) => c.map((x, i) => ({ ...x, dx: 0, dy: (i - (c.length - 1) / 2) * 44 }));
  const single = (c: Ch, which: 0 | 1, dx: number, dy: number): Ch => ({ ...c, two: false, dx, dy, tips: [c.tips?.[which] ?? null] });
  const anaII = (c: Ch[]) => c.flatMap((x, i) => { const dy = (i - (c.length - 1) / 2) * 44; return [single(x, 0, -52, dy), single(x, 1, 52, dy)]; });
  const final = [...left.flatMap((x, i) => [single(x, 0, -14 + i * 14, -8 + i * 8)]), null, ...left.flatMap((x, i) => [single(x, 1, -14 + i * 14, -8 + i * 8)]), null, ...right.flatMap((x, i) => [single(x, 0, -10 + i * 20, 0)]), null, ...right.flatMap((x, i) => [single(x, 1, -10 + i * 20, 0)])];
  const groups: Ch[][] = [[], [], [], []];
  let gi = 0;
  for (const f of final) { if (f === null) gi++; else groups[gi].push(f); }
  const nTxt = nd ? 'n + 1 bzw. n − 1' : 'n';
  return [
    { id: 'p1', title: 'Prophase I', text: 'Homologe Chromosomen – eines von der Mutter (rot), eines vom Vater (violett) – lagern sich paarweise zusammen (Bivalente). Beim Crossing-over werden Abschnitte zwischen Nicht-Schwesterchromatiden ausgetauscht.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'solid', chroms: [Lm(-38, -24), Lp(-20, -24), Sm(22, 30), Sp(40, 30)] }] },
    { id: 'm1', title: 'Metaphase I', text: 'Die Bivalente ordnen sich in der Äquatorialebene an. Welches Homolog zu welchem Pol zeigt, ist für jedes Paar zufällig – eine Quelle genetischer Vielfalt.', ploidy: '2n', dna: '4c', cells: [{ ...ONE(), nucleus: 'none', spindle: true, chroms: [Lm(-12, -40), Lp(12, -40), Sp(-12, 40), Sm(12, 40)] }] },
    { id: 'a1', title: nd ? 'Anaphase I – mit Non-Disjunction' : 'Anaphase I', text: nd ? 'Fehler: Das kurze Chromosomenpaar trennt sich nicht und wandert vollständig zu einem Pol. Die Tochterzellen erhalten ein Chromosom zu viel bzw. zu wenig.' : 'Die homologen Chromosomen werden getrennt – die Schwesterchromatiden bleiben zusammen. Das ist die eigentliche Reduktion von 2n auf n.', ploidy: nd ? 'fehlerhaft' : 'je Pol n', dna: 'je Pol 2c', cells: [{ ...ONE(), nucleus: 'none', spindle: true, chroms: anaI }] },
    { id: 't1', title: 'Telophase I', text: 'Zwei Zellen mit je einem Chromosomensatz entstehen. Jedes Chromosom besteht noch aus zwei (durch Crossing-over nicht mehr identischen) Chromatiden.', ploidy: nTxt, dna: '2c je Zelle', cells: [cell(TWO[0][0], TWO[0][1], left), cell(TWO[1][0], TWO[1][1], right)] },
    { id: 'm2', title: 'Metaphase II', text: 'Ohne erneute Replikation ordnen sich die Chromosomen in beiden Zellen in der Äquatorialebene an.', ploidy: nTxt, dna: '2c je Zelle', cells: [cell(TWO[0][0], TWO[0][1], meta2(left), { nucleus: 'none', spindle: true }), cell(TWO[1][0], TWO[1][1], meta2(right), { nucleus: 'none', spindle: true })] },
    { id: 'a2', title: 'Anaphase II', text: 'Wie in der Mitose werden jetzt die Schwesterchromatiden getrennt.', ploidy: nTxt, dna: 'je Pol c', cells: [cell(TWO[0][0], TWO[0][1], anaII(left), { nucleus: 'none', spindle: true }), cell(TWO[1][0], TWO[1][1], anaII(right), { nucleus: 'none', spindle: true })] },
    { id: 't2', title: 'Telophase II – Ergebnis', text: nd ? 'Zwei Keimzellen haben ein Chromosom zu viel (n + 1), zwei eines zu wenig (n − 1). Nach Befruchtung entsteht eine Trisomie bzw. Monosomie.' : 'Vier haploide Zellen, die sich genetisch alle unterscheiden – durch Crossing-over und die zufällige Verteilung der Homologen.', ploidy: nTxt, dna: 'c je Zelle', cells: groups.map((g, i) => ({ cx: FOUR[i][0], cy: FOUR[i][1], r: 56, nucleus: 'solid' as const, chroms: g.map((x) => ({ ...x, dx: x.dx * 1.6, dy: x.dy })) })) },
  ];
}

export function CellCycleView() {
  const [mode, setMode] = useState<'mitose' | 'meiose'>('mitose');
  const [nd, setNd] = useState(false);
  const [i, setI] = useState(0);
  const stages = useMemo(() => (mode === 'mitose' ? mitosisStages() : meiosisStages(nd)), [mode, nd]);
  const st = stages[Math.min(i, stages.length - 1)];
  return (
    <div className="stack">
      <div className="toolbar-line">
        <div className="seg" role="tablist" aria-label="Teilungsart">
          <button role="tab" aria-selected={mode === 'mitose'} onClick={() => { setMode('mitose'); setI(0); }}>Mitose</button>
          <button role="tab" aria-selected={mode === 'meiose'} onClick={() => { setMode('meiose'); setI(0); }}>Meiose</button>
        </div>
        {mode === 'meiose' && <label className="row" style={{ gap: 6 }}><input type="checkbox" checked={nd} onChange={(e) => setNd(e.target.checked)} /> Non-Disjunction in Meiose I</label>}
      </div>
      <div className="figure fig-limit">
        <svg viewBox="0 0 520 260" role="img" aria-label={`${st.title}: ${st.text}`}>
          {st.cells.map((c, k) => <CellSvg key={k} cell={c} k={`c${k}`} />)}
        </svg>
      </div>
      <div className="row" style={{ gap: 14, fontSize: '0.85rem' }} aria-hidden="true">
        <span className="row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: MAT, display: 'inline-block' }} />mütterlich</span>
        <span className="row" style={{ gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: PAT, display: 'inline-block' }} />väterlich</span>
        <span className="muted">Vereinfacht: 2n = 4 statt 46 Chromosomen</span>
      </div>
      <section className="card" aria-live="polite">
        <div className="row between">
          <h3 style={{ margin: 0 }}>{st.title}</h3>
          <span className="muted">Schritt {i + 1} von {stages.length}</span>
        </div>
        <p>{st.text}</p>
        <p className="muted" style={{ margin: 0 }}>Chromosomensatz: <b>{st.ploidy}</b> · DNA-Gehalt: <b>{st.dna}</b></p>
      </section>
      <div className="row between">
        <button onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0}>◀ Zurück</button>
        <div className="row" style={{ gap: 4 }} aria-hidden="true">{stages.map((s, k) => <span key={s.id} style={{ width: 8, height: 8, borderRadius: 4, background: k === i ? 'var(--accent)' : 'var(--line)' }} />)}</div>
        <button className="primary" onClick={() => setI((x) => Math.min(stages.length - 1, x + 1))} disabled={i >= stages.length - 1}>Weiter ▶</button>
      </div>
    </div>
  );
}

// ===========================================================================
// Erbgänge: Kreuzungsschema
// ===========================================================================

type Mode = 'ad' | 'ar' | 'xr' | 'ab0';
const GENO: Record<Mode, { mother: string[]; father: string[]; label: string }> = {
  ad: { label: 'Autosomal-dominant', mother: ['Aa', 'aa', 'AA'], father: ['aa', 'Aa', 'AA'] },
  ar: { label: 'Autosomal-rezessiv', mother: ['Aa', 'AA', 'aa'], father: ['Aa', 'AA', 'aa'] },
  xr: { label: 'X-chromosomal-rezessiv', mother: ['XᴬXᵃ', 'XᴬXᴬ', 'XᵃXᵃ'], father: ['XᴬY', 'XᵃY'] },
  ab0: { label: 'AB0-Blutgruppen', mother: ['A0', 'AA', 'B0', 'BB', 'AB', '00'], father: ['B0', 'BB', 'A0', 'AA', 'AB', '00'] },
};
const GENO_HINT: Record<Mode, string> = {
  ad: 'A = krankheitsverursachendes Allel (dominant), a = unauffälliges Allel.',
  ar: 'a = krankheitsverursachendes Allel (rezessiv), A = unauffälliges Allel.',
  xr: 'Xᵃ = X-Chromosom mit krankheitsverursachendem Allel.',
  ab0: 'A und B sind kodominant, 0 ist rezessiv.',
};

function gametes(g: string): string[] {
  if (g.startsWith('X')) return g.endsWith('Y') ? [g.slice(0, 2), 'Y'] : [g.slice(0, 2), g.slice(2)];
  return [g[0], g[1]];
}
function combine(mode: Mode, a: string, b: string): string {
  if (mode === 'xr') {
    if (b === 'Y') return a + 'Y';
    return [a, b].sort((x) => (x === 'Xᴬ' ? -1 : 1)).join('');
  }
  if (mode === 'ab0') { const order = 'AB0'; return [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join(''); }
  return [a, b].sort((x, y) => (x === 'A' ? -1 : y === 'A' ? 1 : 0)).join('');
}
function phenotype(mode: Mode, g: string): { label: string; kind: 'krank' | 'traeger' | 'gesund' | 'info' } {
  if (mode === 'ad') return g.includes('A') ? { label: 'betroffen', kind: 'krank' } : { label: 'nicht betroffen', kind: 'gesund' };
  if (mode === 'ar') return g === 'aa' ? { label: 'betroffen', kind: 'krank' } : g === 'Aa' ? { label: 'Überträger', kind: 'traeger' } : { label: 'nicht betroffen', kind: 'gesund' };
  if (mode === 'xr') {
    if (g.endsWith('Y')) return g.startsWith('Xᵃ') ? { label: 'Sohn, betroffen', kind: 'krank' } : { label: 'Sohn, gesund', kind: 'gesund' };
    return g === 'XᵃXᵃ' ? { label: 'Tochter, betroffen', kind: 'krank' } : g.includes('Xᵃ') ? { label: 'Tochter, Überträgerin', kind: 'traeger' } : { label: 'Tochter, gesund', kind: 'gesund' };
  }
  const bg = g.includes('A') && g.includes('B') ? 'AB' : g.includes('A') ? 'A' : g.includes('B') ? 'B' : '0';
  return { label: `Blutgruppe ${bg}`, kind: 'info' };
}

export function GeneticsView() {
  const [mode, setMode] = useState<Mode>('ar');
  const [m, setM] = useState(GENO.ar.mother[0]);
  const [f, setF] = useState(GENO.ar.father[0]);
  const pick = (md: Mode) => { setMode(md); setM(GENO[md].mother[0]); setF(GENO[md].father[0]); };
  const gm = gametes(m);
  const gf = gametes(f);
  const cells = gm.map((a) => gf.map((b) => combine(mode, a, b)));
  const flat = cells.flat();
  const counts = flat.reduce<Record<string, number>>((acc, g) => { const p = phenotype(mode, g).label; acc[p] = (acc[p] ?? 0) + 1; return acc; }, {});
  return (
    <div className="stack">
      <div className="seg" role="tablist" aria-label="Erbgang">
        {(Object.keys(GENO) as Mode[]).map((k) => <button key={k} role="tab" aria-selected={mode === k} onClick={() => pick(k)}>{GENO[k].label}</button>)}
      </div>
      <div className="card">
        <div className="row" style={{ gap: 16 }}>
          <label className="field" style={{ margin: 0 }}><span className="lab"><b>Mutter</b></span>
            <select value={m} onChange={(e) => setM(e.target.value)}>{GENO[mode].mother.map((g) => <option key={g} value={g}>{g} – {phenotype(mode, g).label.replace('Tochter, ', '')}</option>)}</select>
          </label>
          <label className="field" style={{ margin: 0 }}><span className="lab"><b>Vater</b></span>
            <select value={f} onChange={(e) => setF(e.target.value)}>{GENO[mode].father.map((g) => <option key={g} value={g}>{g} – {phenotype(mode, g).label.replace('Sohn, ', '')}</option>)}</select>
          </label>
        </div>
        <p className="muted" style={{ fontSize: '0.88rem', marginBottom: 0 }}>{GENO_HINT[mode]}</p>
      </div>
      <div className="punnett" role="table" aria-label="Kreuzungsschema">
        <div role="row" className="prow">
          <div role="columnheader" className="pcell head">♀ \ ♂</div>
          {gf.map((g, j) => <div key={j} role="columnheader" className="pcell head">{g}</div>)}
        </div>
        {gm.map((a, i) => (
          <div role="row" className="prow" key={i}>
            <div role="rowheader" className="pcell head">{a}</div>
            {cells[i].map((g, j) => { const p = phenotype(mode, g); return <div role="cell" key={j} className={`pcell ${p.kind}`}><b>{g}</b><span>{p.label}</span></div>; })}
          </div>
        ))}
      </div>
      <section className="card" aria-live="polite">
        <h3>Wahrscheinlichkeiten für jedes Kind</h3>
        <ul className="list" style={{ margin: 0 }}>
          {Object.entries(counts).map(([k, v]) => <li key={k}><b>{(v / flat.length) * 100} %</b> {k}</li>)}
        </ul>
        {mode === 'xr' && <p className="muted" style={{ fontSize: '0.88rem', marginBottom: 0 }}>Bezogen auf alle Kinder. Unter den Söhnen allein verdoppeln sich die Anteile.</p>}
        <p className="muted" style={{ fontSize: '0.88rem', marginBottom: 0 }}>Die Wahrscheinlichkeit gilt für jedes Kind neu – unabhängig von den Geschwistern. Vollständige Penetranz angenommen.</p>
      </section>
    </div>
  );
}

// ===========================================================================
// Histologie: schematische Präparate (H.E.-Farben)
// ===========================================================================

const HE = { nuc: '#4f3c8f', nucLight: '#8f80c4', cyto: '#f1b8cb', cytoLight: '#f8d9e3', fiber: '#e58aa8', matrix: '#d9cbe6', bg: '#fbeff4', dark: '#3b2a63' };
function rng(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

type Scene = (hl: string | null, labels: boolean) => ReactNode;

function Label({ x, y, tx, ty, text, show }: { x: number; y: number; tx: number; ty: number; text: string; show: boolean }) {
  if (!show) return null;
  return (
    <g className="hlabel">
      <line x1={x} y1={y} x2={tx} y2={ty} stroke="#222" strokeWidth={0.8} />
      <circle cx={x} cy={y} r={2} fill="#222" />
      {(() => {
        const w = text.length * 5.7;
        let anchor: 'start' | 'end' = tx > x ? 'start' : 'end';
        let lx = tx + (anchor === 'start' ? 3 : -3);
        if (anchor === 'start' && lx + w > 516) { anchor = 'end'; lx = Math.min(516, tx - 3); }
        if (anchor === 'end' && lx - w < 4) { anchor = 'start'; lx = Math.max(4, tx + 3); }
        if (anchor === 'start' && lx + w > 516) lx = 516 - w;
        if (anchor === 'end' && lx - w < 4) lx = 4 + w;
        return <text x={lx} y={ty + 4} fontSize={11} textAnchor={anchor}>{text}</text>;
      })()}
    </g>
  );
}
const ring = (on: boolean) => (on ? { stroke: '#e0a100', strokeWidth: 3 } : {});

function epithelium(kind: string): Scene {
  return (hl, lab) => {
    const W = 520; const base = 200;
    const r = rng(kind.length * 97 + 7);
    const out: ReactNode[] = [];
    // Bindegewebe unten
    out.push(<rect key="ct" x={0} y={base} width={W} height={60} fill={HE.cytoLight} />);
    for (let i = 0; i < 9; i++) out.push(<path key={`f${i}`} d={`M ${i * 60} ${base + 20 + r() * 30} q 30 ${-15 + r() * 30} 60 0`} stroke={HE.fiber} strokeWidth={3} fill="none" opacity={0.7} />);
    for (let i = 0; i < 6; i++) out.push(<ellipse key={`fn${i}`} cx={40 + i * 85 + r() * 20} cy={base + 30 + r() * 20} rx={9} ry={3} fill={HE.nuc} />);
    out.push(<line key="bm" x1={0} x2={W} y1={base} y2={base} stroke={hl === 'h-basalmembran' ? '#e0a100' : HE.dark} strokeWidth={hl === 'h-basalmembran' ? 4 : 1.6} />);
    const lumen = <rect key="lumen" x={0} y={0} width={W} height={20} fill="#fff" />;
    out.unshift(lumen);
    const cellRow = (top: number, h: number, w: number, nuc: (x: number, y: number, i: number) => ReactNode, extra?: (x: number, i: number) => ReactNode) => {
      for (let i = 0; i * w < W; i++) {
        const x = i * w;
        out.push(<rect key={`c${top}-${i}`} x={x} y={top} width={w} height={h} fill={HE.cyto} stroke="#c47d97" strokeWidth={1} />);
        out.push(<g key={`n${top}-${i}`}>{nuc(x, top, i)}</g>);
        if (extra) out.push(<g key={`e${top}-${i}`}>{extra(x, i)}</g>);
      }
    };
    let labels: ReactNode = null;
    if (kind === 'h-platten-ein') {
      cellRow(base - 10, 10, 70, (x, y) => <ellipse cx={x + 35} cy={y + 5} rx={14} ry={3.2} fill={HE.nuc} />);
      out.push(<rect key="lum2" x={0} y={20} width={W} height={base - 30} fill="#fff" />);
      labels = <><Label show={lab} x={105} y={base - 5} tx={160} ty={120} text="abgeflachter Zellkern" /><Label show={lab} x={300} y={base} tx={360} ty={235} text="Basalmembran" /></>;
    } else if (kind === 'h-iso') {
      out.push(<rect key="lum2" x={0} y={20} width={W} height={base - 70} fill="#fff" />);
      cellRow(base - 46, 46, 46, (x, y) => <circle cx={x + 23} cy={y + 23} r={9} fill={HE.nuc} />);
      labels = <Label show={lab} x={69} y={base - 23} tx={120} ty={90} text="runder, zentraler Kern" />;
    } else if (kind === 'h-hoch' || kind === 'h-mikrovilli' || kind === 'h-basalmembran') {
      out.push(<rect key="lum2" x={0} y={20} width={W} height={60} fill="#fff" />);
      cellRow(base - 110, 110, 34, (x, y) => <ellipse cx={x + 17} cy={y + 80} rx={6} ry={13} fill={HE.nuc} />, (x, i) => (
        <>
          {i % 5 === 2 && <g><path d={`M ${x + 4} ${base - 110} q 13 -6 26 0 l -3 55 q -10 8 -20 0 z`} fill="#fff" stroke="#b9a7cf" /><path d={`M ${x + 8} ${base - 104} h 18`} stroke="#b9a7cf" strokeDasharray="2 3" /></g>}
          <g {...(hl === 'h-mikrovilli' ? { opacity: 1 } : {})}>{Array.from({ length: 6 }).map((_, k) => <line key={k} x1={x + 3 + k * 5.5} x2={x + 3 + k * 5.5} y1={base - 110} y2={base - 118} stroke={hl === 'h-mikrovilli' ? '#e0a100' : '#b05f7f'} strokeWidth={hl === 'h-mikrovilli' ? 2 : 1.2} />)}</g>
        </>
      ));
      labels = <><Label show={lab} x={60} y={base - 115} tx={20} ty={45} text="Bürstensaum (Mikrovilli)" /><Label show={lab} x={85} y={base - 85} tx={230} ty={45} text="Becherzelle" /><Label show={lab} x={153} y={base - 30} tx={300} ty={65} text="basal gelegener Kern" /><Label show={lab} x={400} y={base} tx={450} ty={235} text="Basalmembran" /></>;
    } else if (kind === 'h-resp' || kind === 'h-kinozilien') {
      out.push(<rect key="lum2" x={0} y={20} width={W} height={50} fill="#fff" />);
      cellRow(base - 120, 120, 26, (x, _y, i) => <ellipse cx={x + 13} cy={base - 25 - ((i * 37) % 70)} rx={5.5} ry={11} fill={HE.nuc} />, (x, i) => (
        <>
          {i % 6 === 3 ? <path d={`M ${x + 2} ${base - 120} q 11 -6 22 0 l -3 50 q -8 8 -16 0 z`} fill="#fff" stroke="#b9a7cf" />
            : Array.from({ length: 5 }).map((_, k) => <path key={k} d={`M ${x + 3 + k * 5} ${base - 120} q 3 -8 1 -16`} stroke={hl === 'h-kinozilien' ? '#e0a100' : '#7b5c9c'} strokeWidth={hl === 'h-kinozilien' ? 2 : 1} fill="none" />)}
        </>
      ));
      labels = <><Label show={lab} x={40} y={base - 130} tx={20} ty={40} text="Kinozilien" /><Label show={lab} x={92} y={base - 100} tx={200} ty={40} text="Becherzelle" /><Label show={lab} x={273} y={base - 60} tx={360} ty={40} text="Kerne in mehreren Höhen" /></>;
    } else if (kind === 'h-platten-mehr' || kind === 'h-verhornt') {
      const layers = 6;
      out.push(<rect key="lum2" x={0} y={20} width={W} height={10} fill="#fff" />);
      for (let l = 0; l < layers; l++) {
        const h = l === 0 ? 24 : l < 4 ? 22 : 12;
        const top = base - 24 - [0, 22, 44, 66, 78, 90][l] - (l === 0 ? 0 : 0);
        const w = l === 0 ? 22 : l < 4 ? 34 : 60;
        cellRow(top, h, w, (x, y, i) => (l < 4 ? <circle cx={x + w / 2} cy={y + h / 2} r={l === 0 ? 6 : 7} fill={HE.nuc} /> : <ellipse cx={x + w / 2} cy={y + h / 2} rx={10} ry={2.5} fill={HE.nuc} opacity={i % 2 ? 1 : 0.7} />));
      }
      if (kind === 'h-verhornt') for (let k = 0; k < 4; k++) out.push(<rect key={`k${k}`} x={0} y={base - 102 - 9 * (k + 1)} width={W} height={8} fill="#f3a7c1" stroke="#d887a5" strokeWidth={0.6} {...ring(hl === 'h-verhornt' && k === 3)} />);
      labels = kind === 'h-verhornt'
        ? <><Label show={lab} x={60} y={base - 125} tx={120} ty={40} text="Hornschicht (kernlos)" /><Label show={lab} x={250} y={base - 12} tx={330} ty={235} text="Stratum basale" /></>
        : <><Label show={lab} x={90} y={base - 96} tx={160} ty={40} text="abgeflachte Zellen mit Kernen" /><Label show={lab} x={250} y={base - 12} tx={330} ty={235} text="Basalzellen (teilungsfähig)" /></>;
    } else if (kind === 'h-urothel') {
      out.push(<rect key="lum2" x={0} y={20} width={W} height={60} fill="#fff" />);
      cellRow(base - 22, 22, 22, (x, y) => <circle cx={x + 11} cy={y + 11} r={5} fill={HE.nuc} />);
      cellRow(base - 54, 32, 30, (x, y) => <circle cx={x + 15} cy={y + 16} r={6} fill={HE.nuc} />);
      for (let i = 0; i * 70 < W; i++) {
        const x = i * 70;
        out.push(<path key={`u${i}`} d={`M ${x} ${base - 54} v -40 q 35 -12 70 0 v 40 z`} fill={HE.cyto} stroke="#c47d97" />);
        out.push(<path key={`ub${i}`} d={`M ${x + 2} ${base - 92} q 33 -11 66 0`} stroke="#b0577d" strokeWidth={3} fill="none" />);
        out.push(<circle key={`un${i}a`} cx={x + 25} cy={base - 72} r={7} fill={HE.nuc} />);
        if (i % 2 === 0) out.push(<circle key={`un${i}b`} cx={x + 45} cy={base - 72} r={7} fill={HE.nuc} />);
      }
      labels = <Label show={lab} x={35} y={base - 92} tx={110} ty={40} text="Deckzelle (Schirmzelle), oft zweikernig" />;
    }
    return <>{out}{labels}</>;
  };
}

function connective(kind: string): Scene {
  return (hl, lab) => {
    const r = rng(kind.length * 31 + 3);
    const out: ReactNode[] = [<rect key="bg" x={0} y={0} width={520} height={260} fill={HE.bg} />];
    let labels: ReactNode = null;
    if (kind === 'locker' || kind === 'h-bindegewebe-locker' || kind === 'h-fibroblast' || kind === 'h-kollagen' || kind === 'h-elastisch') {
      for (let i = 0; i < 18; i++) { const x = r() * 520; const y = r() * 260; out.push(<path key={`c${i}`} d={`M ${x} ${y} q ${40 + r() * 40} ${-30 + r() * 60} ${90 + r() * 60} ${-20 + r() * 40}`} stroke={hl === 'h-kollagen' ? '#e0a100' : HE.fiber} strokeWidth={hl === 'h-kollagen' ? 6 : 5} fill="none" opacity={0.85} />); }
      for (let i = 0; i < 14; i++) { const x = r() * 520; const y = r() * 260; out.push(<path key={`e${i}`} d={`M ${x} ${y} q 20 ${-12 + r() * 24} 40 0 t 40 0`} stroke={hl === 'h-elastisch' ? '#e0a100' : '#6a3d7a'} strokeWidth={hl === 'h-elastisch' ? 2 : 1} fill="none" />); }
      for (let i = 0; i < 10; i++) { const x = 30 + r() * 460; const y = 20 + r() * 220; out.push(<g key={`fb${i}`}><path d={`M ${x - 22} ${y} q 22 -9 44 0 q -22 9 -44 0`} fill={HE.cytoLight} {...ring(hl === 'h-fibroblast')} /><ellipse cx={x} cy={y} rx={10} ry={3.5} fill={HE.nuc} /></g>); }
      out.push(<g key="mast"><circle cx={380} cy={70} r={14} fill="#e9d6ef" />{Array.from({ length: 22 }).map((_, k) => <circle key={k} cx={380 + Math.cos(k * 1.7) * (4 + (k % 4) * 2.5)} cy={70 + Math.sin(k * 1.7) * (4 + (k % 4) * 2.5)} r={1.6} fill="#5a2a7a" />)}</g>);
      out.push(<g key="plasma"><ellipse cx={130} cy={200} rx={14} ry={11} fill="#d4a1c4" /><circle cx={122} cy={200} r={6} fill={HE.nuc} stroke="#fff" strokeDasharray="2 2" /></g>);
      labels = <><Label show={lab} x={380} y={70} tx={440} ty={30} text="Mastzelle (Granula)" /><Label show={lab} x={128} y={200} tx={60} ty={245} text="Plasmazelle" /><Label show={lab} x={260} y={130} tx={300} ty={20} text="Fibroblastenkern" /></>;
    } else if (kind === 'h-straff') {
      for (let y = 10; y < 260; y += 16) out.push(<path key={`s${y}`} d={`M 0 ${y} q 130 4 260 0 t 260 0`} stroke={HE.fiber} strokeWidth={12} fill="none" />);
      for (let y = 18; y < 260; y += 32) for (let x = 20 + (y % 64); x < 520; x += 70) out.push(<ellipse key={`t${x}-${y}`} cx={x} cy={y} rx={12} ry={2.5} fill={HE.nuc} />);
      labels = <Label show={lab} x={84} y={50} tx={150} ty={245} text="Fibrozytenkerne in Reihen zwischen Kollagenbündeln" />;
    } else if (kind === 'h-fett') {
      out.push(<rect key="w" x={0} y={0} width={520} height={260} fill="#fff" />);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 7; col++) {
        const cx = col * 78 + (row % 2) * 39 + 20; const cy = row * 70 + 30;
        const pts = Array.from({ length: 6 }).map((_, k) => `${cx + Math.cos(k * Math.PI / 3) * 40},${cy + Math.sin(k * Math.PI / 3) * 36}`).join(' ');
        out.push(<polygon key={`a${row}-${col}`} points={pts} fill="#fff" stroke={HE.fiber} strokeWidth={2} />);
        if ((row + col) % 3 === 0) out.push(<path key={`an${row}-${col}`} d={`M ${cx + 30} ${cy - 14} q 8 14 0 28`} stroke={HE.nuc} strokeWidth={4} fill="none" />);
      }
      labels = <><Label show={lab} x={50} y={30} tx={110} ty={250} text="leerer Fetttropfen (herausgelöst)" /><Label show={lab} x={53} y={30} tx={160} ty={14} text="randständiger, abgeflachter Kern" /></>;
    } else if (kind.startsWith('h-knorpel')) {
      out.push(<rect key="m" x={0} y={0} width={520} height={260} fill={kind === 'h-knorpel-faser' ? HE.bg : HE.matrix} />);
      if (kind === 'h-knorpel-faser') for (let y = 8; y < 260; y += 14) out.push(<path key={`ff${y}`} d={`M 0 ${y} q 130 6 260 0 t 260 0`} stroke={HE.fiber} strokeWidth={8} fill="none" />);
      if (kind === 'h-knorpel-hyalin') out.push(<g key="peri"><rect x={0} y={0} width={520} height={22} fill={HE.cytoLight} />{[60, 200, 340, 470].map((x) => <ellipse key={x} cx={x} cy={11} rx={14} ry={3} fill={HE.nuc} />)}</g>);
      if (kind === 'h-knorpel-elastisch') for (let i = 0; i < 40; i++) { const x = r() * 520; const y = r() * 260; out.push(<path key={`el${i}`} d={`M ${x} ${y} q 15 ${-10 + r() * 20} 30 0 t 30 0`} stroke="#3b1e55" strokeWidth={1.4} fill="none" />); }
      for (let g = 0; g < (kind === 'h-knorpel-faser' ? 12 : 14); g++) {
        const cx = kind === 'h-knorpel-faser' ? 40 + (g % 6) * 85 : 40 + r() * 440; const cy = kind === 'h-knorpel-faser' ? 60 + Math.floor(g / 6) * 120 : 45 + r() * 200;
        const n = kind === 'h-knorpel-faser' ? 3 : 1 + Math.floor(r() * 3);
        out.push(<g key={`g${g}`}><ellipse cx={cx} cy={cy} rx={n * 9 + 6} ry={13} fill={kind === 'h-knorpel-faser' ? 'none' : '#b9a3d6'} opacity={0.6} />
          {Array.from({ length: n }).map((_, k) => <g key={k}><ellipse cx={cx - (n - 1) * 9 + k * 18} cy={cy} rx={8} ry={9} fill="#fff" /><circle cx={cx - (n - 1) * 9 + k * 18} cy={cy} r={4} fill={HE.nuc} /></g>)}</g>);
      }
      labels = kind === 'h-knorpel-hyalin'
        ? <><Label show={lab} x={60} y={11} tx={130} ty={40} text="Perichondrium" /><Label show={lab} x={260} y={150} tx={330} ty={250} text="isogene Gruppen in Lakunen" /></>
        : kind === 'h-knorpel-elastisch' ? <Label show={lab} x={200} y={100} tx={260} ty={250} text="Netz elastischer Fasern" />
          : <Label show={lab} x={125} y={60} tx={200} ty={250} text="Chondrozyten in Reihen zwischen Kollagen-I-Fasern" />;
    } else if (kind === 'h-knochen') {
      out.push(<rect key="m" x={0} y={0} width={520} height={260} fill="#f3d7e2" />);
      const osteon = (cx: number, cy: number, R: number, key: string) => (
        <g key={key}>
          {Array.from({ length: 5 }).map((_, k) => <circle key={k} cx={cx} cy={cy} r={R - k * (R / 6)} fill="none" stroke="#d792ad" strokeWidth={1.4} />)}
          <circle cx={cx} cy={cy} r={R / 6} fill="#fff" stroke="#c06f92" {...ring(hl === 'h-knochen' && key === 'o0')} />
          {Array.from({ length: 16 }).map((_, k) => { const rr = R * (0.35 + (k % 3) * 0.2); const a = k * 0.9; const x = cx + Math.cos(a) * rr; const y = cy + Math.sin(a) * rr; return <g key={`l${k}`}><ellipse cx={x} cy={y} rx={4} ry={2} fill={HE.dark} transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`} /><line x1={x} y1={y} x2={x + Math.cos(a) * 6} y2={y + Math.sin(a) * 6} stroke={HE.dark} strokeWidth={0.5} /></g>; })}
        </g>
      );
      out.push(osteon(160, 130, 100, 'o0'), osteon(390, 110, 80, 'o1'), osteon(420, 240, 60, 'o2'));
      out.push(<rect key="vk" x={240} y={124} width={90} height={8} fill="#fff" stroke="#c06f92" />);
      labels = <><Label show={lab} x={160} y={130} tx={60} ty={250} text="Havers-Kanal" /><Label show={lab} x={285} y={128} tx={290} ty={20} text="Volkmann-Kanal" /><Label show={lab} x={195} y={120} tx={230} ty={40} text="Osteozyt in Lakune" /></>;
    }
    return <>{out}{labels}</>;
  };
}

function muscleNerve(kind: string): Scene {
  return (_hl, lab) => {
    const r = rng(kind.length * 13 + 5);
    const out: ReactNode[] = [<rect key="bg" x={0} y={0} width={520} height={260} fill={HE.bg} />];
    let labels: ReactNode = null;
    if (kind === 'h-skelettmuskel') {
      for (let f = 0; f < 5; f++) {
        const y = 12 + f * 50;
        out.push(<rect key={`f${f}`} x={0} y={y} width={520} height={42} fill="#ee9fba" rx={4} />);
        for (let x = 4; x < 520; x += 7) out.push(<line key={`s${f}-${x}`} x1={x} x2={x} y1={y + 2} y2={y + 40} stroke="#c46b8f" strokeWidth={x % 14 < 7 ? 2.2 : 0.8} />);
        for (let k = 0; k < 6; k++) out.push(<ellipse key={`n${f}-${k}`} cx={30 + k * 85 + r() * 20} cy={k % 2 ? y + 4 : y + 38} rx={11} ry={3} fill={HE.nuc} />);
      }
      labels = <><Label show={lab} x={47} y={20} tx={120} ty={8} text="randständige Kerne" /><Label show={lab} x={300} y={150} tx={360} ty={255} text="Querstreifung" /></>;
    } else if (kind === 'h-herzmuskel') {
      for (let f = 0; f < 5; f++) {
        const y = 15 + f * 50;
        out.push(<path key={`f${f}`} d={`M 0 ${y} h 520 v 34 h -520 z`} fill="#ee9fba" />);
        for (let x = 4; x < 520; x += 8) out.push(<line key={`s${f}-${x}`} x1={x} x2={x} y1={y + 2} y2={y + 32} stroke="#c46b8f" strokeWidth={0.9} />);
        for (let k = 0; k < 4; k++) { const gx = 60 + k * 130 + (f % 2) * 50; out.push(<path key={`g${f}-${k}`} d={`M ${gx} ${y} v 10 h 6 v 12 h -6 v 12`} stroke={HE.dark} strokeWidth={3} fill="none" />); out.push(<ellipse key={`n${f}-${k}`} cx={gx + 60} cy={y + 17} rx={10} ry={5} fill={HE.nuc} />); }
        if (f < 4) out.push(<path key={`b${f}`} d={`M ${200 + f * 60} ${y + 34} q 10 8 30 16`} stroke="#ee9fba" strokeWidth={12} fill="none" />);
      }
      labels = <><Label show={lab} x={63} y={30} tx={120} ty={8} text="Glanzstreifen" /><Label show={lab} x={120} y={32} tx={250} ty={8} text="zentraler Kern" /><Label show={lab} x={215} y={55} tx={330} ty={255} text="Verzweigung" /></>;
    } else if (kind === 'h-glatt') {
      for (let row = 0; row < 9; row++) for (let k = 0; k < 6; k++) {
        const cx = k * 95 + (row % 2) * 47; const cy = 14 + row * 28;
        out.push(<path key={`c${row}-${k}`} d={`M ${cx - 55} ${cy} q 55 -14 110 0 q -55 14 -110 0`} fill="#ee9fba" stroke="#d47a9a" strokeWidth={0.8} />);
        out.push(<ellipse key={`n${row}-${k}`} cx={cx} cy={cy} rx={16} ry={3} fill={HE.nuc} />);
      }
      labels = <Label show={lab} x={95} y={14} tx={160} ty={255} text="spindelförmige Zelle, ein zentraler Kern" />;
    } else {
      for (let i = 0; i < 60; i++) { const x = r() * 520; const y = r() * 260; out.push(<path key={`np${i}`} d={`M ${x} ${y} q 10 ${-5 + r() * 10} 22 ${-4 + r() * 8}`} stroke="#e2a9bf" strokeWidth={1.2} fill="none" />); }
      const neuron = (cx: number, cy: number, s: number, key: string) => (
        <g key={key}>
          {[0, 1.3, 2.4, 3.6, 4.8].map((a, k) => <path key={k} d={`M ${cx} ${cy} q ${Math.cos(a) * 40 * s} ${Math.sin(a) * 40 * s} ${Math.cos(a + 0.3) * 90 * s} ${Math.sin(a + 0.3) * 90 * s}`} stroke="#e48eae" strokeWidth={6 * s} fill="none" />)}
          <path d={`M ${cx - 30 * s} ${cy} q 0 -35 30 -35 q 35 0 35 30 q 0 30 -35 30 q -30 0 -30 -25`} fill="#ea9bb8" />
          {Array.from({ length: 28 }).map((_, k) => <circle key={`ns${k}`} cx={cx + Math.cos(k * 2.3) * (14 + (k % 3) * 6) * s} cy={cy + Math.sin(k * 2.3) * (14 + (k % 3) * 6) * s} r={2 * s} fill={HE.nuc} opacity={0.8} />)}
          <circle cx={cx} cy={cy} r={11 * s} fill="#efe6f8" stroke="#a79ad0" />
          <circle cx={cx + 2 * s} cy={cy - 1 * s} r={3.5 * s} fill={HE.dark} />
        </g>
      );
      out.push(neuron(170, 130, 1.3, 'n1'), neuron(400, 90, 0.9, 'n2'));
      for (let i = 0; i < 22; i++) { const x = r() * 520; const y = r() * 260; if (Math.hypot(x - 170, y - 130) > 60 && Math.hypot(x - 400, y - 90) > 45) out.push(<circle key={`gl${i}`} cx={x} cy={y} r={kind === 'h-glia' ? 5.5 : 4.5} fill={HE.nuc} {...ring(kind === 'h-glia' && i % 4 === 0)} />); }
      labels = <><Label show={lab} x={172} y={129} tx={60} ty={20} text="Nukleolus im hellen Kern" /><Label show={lab} x={190} y={110} tx={290} ty={20} text="Nissl-Schollen" /><Label show={lab} x={320} y={220} tx={380} ty={250} text="Gliazellkerne" /></>;
    }
    return <>{out}{labels}</>;
  };
}


// ===========================================================================
// Gefäße, Blut, Haut und Drüsen (Anatomie II/III)
// ===========================================================================

const VESSEL_IDS = ['h-arterie', 'h-arterie-elastisch', 'h-vene', 'h-kapillare'];
const BLOOD_IDS = ['h-erythrozyt', 'h-neutrophil', 'h-eosinophil', 'h-basophil', 'h-lymphozyt', 'h-monozyt', 'h-thrombozyt'];
const SKIN_IDS = ['h-leistenhaut', 'h-felderhaut', 'h-schweissdruese', 'h-seroes', 'h-mukoes'];

const PAP = { rbc: '#efa39b', rbcC: '#f8d5d0', nuc: '#5b3f99', bg: '#fbf3f1' };

function rbc(cx: number, cy: number, r: number, key: string) {
  return <g key={key}><circle cx={cx} cy={cy} r={r} fill={PAP.rbc} stroke="#d98a82" strokeWidth={0.6} /><circle cx={cx} cy={cy} r={r * 0.42} fill={PAP.rbcC} /></g>;
}

function rings(cx: number, cy: number, r0: number, r1: number, n: number, draw: (r: number, i: number) => ReactNode) {
  return Array.from({ length: n }).map((_, i) => draw(r0 + ((r1 - r0) * (i + 0.5)) / n, i));
}

function vessels(kind: string): Scene {
  return (_hl, lab) => {
    const r = rng(kind.length * 31 + 3);
    const out: ReactNode[] = [<rect key="bg" x={0} y={0} width={520} height={260} fill={HE.bg} />];
    let labels: ReactNode = null;
    if (kind === 'h-arterie') {
      const cx = 140, cy = 130;
      out.push(<circle key="adv" cx={cx} cy={cy} r={122} fill={HE.cytoLight} />);
      for (let i = 0; i < 26; i++) { const a = r() * 6.28; const rr = 100 + r() * 20; out.push(<path key={`af${i}`} d={`M ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} q 8 6 18 ${-4 + r() * 8}`} stroke={HE.fiber} strokeWidth={2} fill="none" />); }
      out.push(<circle key="vv" cx={cx + 92} cy={cy - 70} r={6} fill="none" stroke={HE.fiber} strokeWidth={2} />);
      out.push(<circle key="ext" cx={cx} cy={cy} r={97} fill="none" stroke="#c45a86" strokeWidth={1.6} strokeDasharray="5 3" />);
      out.push(<circle key="media" cx={cx} cy={cy} r={95} fill="#ee9fba" />);
      out.push(...rings(cx, cy, 58, 92, 6, (rr, i) => Array.from({ length: 16 }).map((_, k) => { const a = (k / 16) * 6.28 + i * 0.37; return <ellipse key={`mn${i}-${k}`} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr} rx={7} ry={2} fill={HE.nuc} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr})`} />; })).flat());
      const wav = Array.from({ length: 73 }).map((_, k) => { const a = (k / 72) * 6.283; const rr = 55 + (k % 2 ? 2.5 : -2.5); return `${k ? 'L' : 'M'} ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}`; }).join(' ');
      out.push(<path key="iel" d={wav} fill="#fde7f0" stroke="#f6c3d6" strokeWidth={4} />);
      out.push(<circle key="lum" cx={cx} cy={cy} r={50} fill="#fff" />);
      for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.28; out.push(<ellipse key={`en${k}`} cx={cx + Math.cos(a) * 51} cy={cy + Math.sin(a) * 51} rx={5} ry={1.8} fill={HE.nuc} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx + Math.cos(a) * 51} ${cy + Math.sin(a) * 51})`} />); }
      for (let k = 0; k < 5; k++) out.push(rbc(cx - 20 + r() * 40, cy - 20 + r() * 40, 6, `rb${k}`));
      labels = <><Label show={lab} x={cx} y={cy + 20} tx={290} ty={235} text="rundes Lumen" /><Label show={lab} x={cx + 54} y={cy - 8} tx={290} ty={40} text="Membrana elastica interna (gewellt)" /><Label show={lab} x={cx + 75} y={cy + 20} tx={290} ty={110} text="Tunica media: glatte Muskulatur" /><Label show={lab} x={cx + 110} y={cy + 40} tx={290} ty={175} text="Tunica externa (Adventitia)" /></>;
    } else if (kind === 'h-arterie-elastisch') {
      out.push(<rect key="lum" x={0} y={0} width={520} height={30} fill="#fff" />);
      out.push(<rect key="int" x={0} y={30} width={520} height={14} fill={HE.cytoLight} />);
      for (let x = 10; x < 520; x += 46) out.push(<ellipse key={`en${x}`} cx={x} cy={32} rx={8} ry={2} fill={HE.nuc} />);
      out.push(<rect key="media" x={0} y={44} width={520} height={160} fill="#f2b3c8" />);
      for (let l = 0; l < 12; l++) { const y = 52 + l * 13; out.push(<path key={`el${l}`} d={Array.from({ length: 27 }).map((_, k) => `${k ? 'L' : 'M'} ${k * 20} ${y + (k % 2 ? 2 : -2)}`).join(' ')} stroke="#8e3d73" strokeWidth={1.6} fill="none" />); }
      for (let i = 0; i < 70; i++) out.push(<ellipse key={`mn${i}`} cx={r() * 520} cy={50 + r() * 150} rx={6} ry={1.8} fill={HE.nuc} />);
      out.push(<rect key="adv" x={0} y={204} width={520} height={56} fill={HE.cytoLight} />);
      for (let i = 0; i < 8; i++) out.push(<path key={`af${i}`} d={`M ${i * 65} ${220 + r() * 25} q 30 ${-8 + r() * 16} 60 0`} stroke={HE.fiber} strokeWidth={2.5} fill="none" />);
      out.push(<circle key="vv1" cx={130} cy={232} r={9} fill="#fff" stroke="#c47d97" strokeWidth={2} />, rbc(130, 232, 5, 'vr1'), <circle key="vv2" cx={390} cy={238} r={7} fill="#fff" stroke="#c47d97" strokeWidth={2} />);
      labels = <><Label show={lab} x={60} y={36} tx={120} ty={14} text="Intima mit Endothel" /><Label show={lab} x={200} y={104} tx={300} ty={14} text="viele gewellte elastische Membranen" /><Label show={lab} x={130} y={232} tx={250} ty={252} text="Vasa vasorum in der Adventitia" /></>;
    } else if (kind === 'h-vene') {
      const pth = 'M 70 140 C 70 80 160 70 230 92 C 300 112 360 100 400 130 C 440 165 380 200 300 190 C 220 182 160 210 110 196 C 80 188 70 170 70 140 Z';
      out.push(<path key="adv" d={pth} fill={HE.cytoLight} stroke={HE.cytoLight} strokeWidth={70} strokeLinejoin="round" />);
      for (let i = 0; i < 40; i++) { const x = 40 + r() * 420; const y = 50 + r() * 180; out.push(<path key={`af${i}`} d={`M ${x} ${y} q 10 ${-5 + r() * 10} 22 ${-3 + r() * 6}`} stroke={HE.fiber} strokeWidth={2} fill="none" />); }
      for (let i = 0; i < 14; i++) out.push(<ellipse key={`afn${i}`} cx={40 + r() * 420} cy={40 + r() * 190} rx={6} ry={2} fill={HE.nuc} opacity={0.8} />);
      out.push(<path key="media" d={pth} fill="none" stroke="#ee9fba" strokeWidth={14} strokeLinejoin="round" />);
      out.push(<path key="lum" d={pth} fill="#fff" />);
      for (let i = 0; i < 26; i++) out.push(rbc(110 + r() * 260, 115 + r() * 65, 6, `rb${i}`));
      out.push(<path key="valve" d="M 230 98 q 25 30 10 70" stroke="#e7a3bd" strokeWidth={4} fill="none" />);
      labels = <><Label show={lab} x={200} y={150} tx={40} ty={252} text="weites, unregelmäßiges Lumen mit Blut" /><Label show={lab} x={300} y={110} tx={360} ty={14} text="dünne Media" /><Label show={lab} x={420} y={200} tx={430} ty={252} text="breite Adventitia" /><Label show={lab} x={240} y={135} tx={60} ty={20} text="Klappe (Intimafalte)" /></>;
    } else {
      for (let i = 0; i < 18; i++) { const x = r() * 520; const y = r() * 260; out.push(<path key={`f${i}`} d={`M ${x} ${y} q 20 ${-8 + r() * 16} 44 ${-4 + r() * 8}`} stroke={HE.fiber} strokeWidth={3} fill="none" opacity={0.6} />); }
      const cap = (cx: number, cy: number, k: string, withRbc: boolean) => (
        <g key={k}><circle cx={cx} cy={cy} r={11} fill="#fff" stroke="#e48eae" strokeWidth={2.5} /><ellipse cx={cx + 9} cy={cy - 4} rx={3} ry={6} fill={HE.nuc} />{withRbc && rbc(cx - 1, cy + 1, 6.5, `${k}r`)}</g>
      );
      out.push(cap(80, 70, 'c1', true), cap(210, 190, 'c2', false), cap(450, 80, 'c3', true), cap(380, 210, 'c4', true));
      out.push(<path key="long" d="M 0 120 C 120 110 240 135 520 118" stroke="#e48eae" strokeWidth={26} fill="none" />, <path key="longl" d="M 0 120 C 120 110 240 135 520 118" stroke="#fff" strokeWidth={20} fill="none" />);
      for (let k = 0; k < 9; k++) { const x = 30 + k * 55; out.push(rbc(x, 120 + Math.sin(x / 80) * 6, 7.5, `lr${k}`)); }
      out.push(<ellipse key="en1" cx={150} cy={108} rx={10} ry={2.5} fill={HE.nuc} />, <ellipse key="en2" cx={330} cy={132} rx={10} ry={2.5} fill={HE.nuc} />);
      out.push(<ellipse key="peri" cx={260} cy={136} rx={8} ry={3} fill={HE.nuc} opacity={0.7} />);
      labels = <><Label show={lab} x={80} y={70} tx={60} ty={20} text="Kapillare quer: ein Erythrozyt füllt das Lumen" /><Label show={lab} x={150} y={108} tx={200} ty={252} text="Endothelkern" /><Label show={lab} x={30} y={120} tx={40} ty={240} text="Erythrozyten hintereinander" /></>;
    }
    return <>{out}{labels}</>;
  };
}

function blood(kind: string): Scene {
  return (_hl, lab) => {
    const r = rng(kind.length * 17 + 11);
    const out: ReactNode[] = [<rect key="bg" x={0} y={0} width={520} height={260} fill={PAP.bg} />];
    const cx = 260, cy = 130;
    for (let i = 0; i < 70; i++) { const x = r() * 520; const y = r() * 260; if (Math.hypot(x - cx, y - cy) > 42) out.push(rbc(x, y, 14, `b${i}`)); }
    const on = (_id: string) => ({});
    let labels: ReactNode = null;
    if (kind === 'h-erythrozyt') {
      out.push(<g key="t" {...on(kind)}>{rbc(cx, cy, 15, 'tr')}</g>);
      labels = <><Label show={lab} x={cx} y={cy} tx={360} ty={20} text="kernlos, helles Zentrum (bikonkav)" /><Label show={lab} x={cx + 14} y={cy + 4} tx={380} ty={245} text="≈ 7,5 µm – Größenmaßstab" /></>;
    } else if (kind === 'h-thrombozyt') {
      out.push(rbc(cx, cy, 14, 'tr'));
      for (let k = 0; k < 5; k++) out.push(<circle key={`p${k}`} cx={cx - 30 + k * 7 + r() * 4} cy={cy + 28 + r() * 8} r={3.2} fill="#8a6fc4" {...on(kind)} />);
      labels = <Label show={lab} x={cx - 16} y={cy + 32} tx={120} ty={240} text="Thrombozyten: kleine Fragmente, oft in Gruppen" />;
    } else {
      const big = kind === 'h-monozyt' ? 24 : kind === 'h-lymphozyt' ? 14 : 19;
      const cyto = { 'h-neutrophil': '#ecdbe6', 'h-eosinophil': '#f2d2c8', 'h-basophil': '#e3d6ec', 'h-lymphozyt': '#9fb8e6', 'h-monozyt': '#c3c8de' }[kind] ?? '#eee';
      out.push(<circle key="c" cx={cx} cy={cy} r={big} fill={cyto} stroke="#b9a6c9" strokeWidth={0.8} {...on(kind)} />);
      if (kind === 'h-neutrophil') {
        out.push(<path key="n" d={`M ${cx - 11} ${cy - 6} q 5 -6 9 -1 q 4 -7 9 0 q 6 3 3 9 q -2 6 -8 4 q -5 5 -9 0 q -6 0 -4 -6`} fill={PAP.nuc} stroke={PAP.nuc} strokeWidth={3} />);
        for (let k = 0; k < 20; k++) out.push(<circle key={`g${k}`} cx={cx - 14 + r() * 28} cy={cy - 14 + r() * 28} r={0.9} fill="#c9a2c0" />);
      } else if (kind === 'h-eosinophil') {
        for (let k = 0; k < 40; k++) { const a = r() * 6.28, d = r() * 16; out.push(<circle key={`g${k}`} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d} r={2.3} fill="#e5764f" />); }
        out.push(<ellipse key="n1" cx={cx - 7} cy={cy - 2} rx={6} ry={8} fill={PAP.nuc} />, <ellipse key="n2" cx={cx + 7} cy={cy - 2} rx={6} ry={8} fill={PAP.nuc} />, <path key="nb" d={`M ${cx - 3} ${cy + 4} q 3 3 6 0`} stroke={PAP.nuc} strokeWidth={3} fill="none" />);
      } else if (kind === 'h-basophil') {
        out.push(<ellipse key="n" cx={cx} cy={cy} rx={10} ry={8} fill="#6d55a8" opacity={0.6} />);
        for (let k = 0; k < 34; k++) { const a = r() * 6.28, d = r() * 15; out.push(<circle key={`g${k}`} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d} r={2.6} fill="#2e1d5c" />); }
      } else if (kind === 'h-lymphozyt') {
        out.push(<circle key="n" cx={cx + 1} cy={cy} r={11.5} fill={PAP.nuc} />);
      } else {
        out.push(<path key="n" d={`M ${cx - 14} ${cy - 8} q 14 -12 26 0 q 4 12 -4 18 q -6 -8 -12 -2 q -8 4 -12 -4 q -4 -6 2 -12`} fill="#6b54a6" />);
      }
      const t: Record<string, [string, string]> = {
        'h-neutrophil': ['segmentierter Kern (3–5 Segmente)', 'blasses Zytoplasma, feine Granula'],
        'h-eosinophil': ['zweilappiger Kern', 'grobe rot-orange Granula'],
        'h-basophil': ['dunkle Granula verdecken den Kern', 'seltenste Blutzelle'],
        'h-lymphozyt': ['runder, dichter Kern', 'schmaler blauer Zytoplasmasaum'],
        'h-monozyt': ['nierenförmiger Kern', 'größte Blutzelle, graublaues Zytoplasma'],
      };
      labels = <><Label show={lab} x={cx} y={cy} tx={370} ty={20} text={t[kind][0]} /><Label show={lab} x={cx + big - 3} y={cy + 6} tx={380} ty={245} text={t[kind][1]} /></>;
    }
    return <>{out}{labels}</>;
  };
}

function skin(kind: string): Scene {
  return (_hl, lab) => {
    const r = rng(kind.length * 23 + 9);
    const out: ReactNode[] = [<rect key="bg" x={0} y={0} width={520} height={260} fill={HE.bg} />];
    let labels: ReactNode = null;
    const dermis = (top: number) => {
      out.push(<rect key="der" x={0} y={top} width={520} height={260 - top} fill={HE.cytoLight} />);
      for (let i = 0; i < 26; i++) { const x = r() * 520; const y = top + 10 + r() * (250 - top); out.push(<path key={`df${i}`} d={`M ${x} ${y} q 18 ${-6 + r() * 12} 40 ${-3 + r() * 6}`} stroke={HE.fiber} strokeWidth={3.2} fill="none" />); }
      for (let i = 0; i < 10; i++) out.push(<ellipse key={`dn${i}`} cx={r() * 520} cy={top + 10 + r() * (250 - top)} rx={6} ry={2} fill={HE.nuc} />);
    };
    if (kind === 'h-leistenhaut' || kind === 'h-felderhaut') {
      const thick = kind === 'h-leistenhaut';
      const corneum = thick ? 70 : 14;
      const basal = (x: number) => (thick ? 170 : 150) + Math.sin(x / (thick ? 26 : 40)) * (thick ? 18 : 10);
      dermis(120);
      // Epidermis: Zellen zwischen Hornschicht und welliger Basallinie
      const top = corneum + 6;
      out.push(<path key="epi" d={`M 0 ${top} H 520 V ${basal(520)} ${Array.from({ length: 53 }).map((_, k) => `L ${520 - k * 10} ${basal(520 - k * 10)}`).join(' ')} Z`} fill={HE.cyto} />);
      for (let x = 4; x < 520; x += 10) { const y = basal(x); out.push(<ellipse key={`bc${x}`} cx={x} cy={y - 6} rx={3} ry={5} fill={HE.nuc} />); }
      for (let x = 8; x < 520; x += 18) for (let y = top + (thick ? 34 : 20); y < basal(x) - 16; y += 15) out.push(<circle key={`sp${x}-${y}`} cx={x + (y % 2) * 6} cy={y} r={3.6} fill={HE.nuc} opacity={0.85} />);
      for (let x = 0; x < 520; x += 14) out.push(<ellipse key={`gr${x}`} cx={x + 7} cy={top + (thick ? 22 : 12)} rx={6} ry={2.4} fill="#3b2a63" />);
      if (thick) out.push(<rect key="luc" x={0} y={corneum} width={520} height={8} fill="#fde6ef" />);
      out.push(<rect key="corn" x={0} y={0} width={520} height={corneum} fill="#f4a3c0" />);
      for (let y = 4; y < corneum; y += 6) out.push(<line key={`cl${y}`} x1={0} x2={520} y1={y} y2={y + (y % 12 ? 1 : -1)} stroke="#e48eae" strokeWidth={0.8} />);
      if (thick) {
        out.push(<path key="duct" d="M 300 0 q 12 10 0 18 q -12 8 0 18 q 12 10 0 18 q -12 8 0 18 q 10 14 2 40 L 300 200" stroke="#fff" strokeWidth={5} fill="none" />);
        for (let k = 0; k < 6; k++) out.push(<circle key={`sw${k}`} cx={300 + Math.cos(k) * 22} cy={226 + Math.sin(k * 1.7) * 14} r={9} fill="#f6c5d6" stroke="#c47d97" />);
        labels = <><Label show={lab} x={60} y={35} tx={110} ty={12} text="dicke Hornschicht" /><Label show={lab} x={180} y={corneum + 4} tx={400} ty={12} text="Stratum lucidum" /><Label show={lab} x={130} y={top + 22} tx={430} ty={95} text="Stratum granulosum" /><Label show={lab} x={400} y={130} tx={470} ty={140} text="Stratum spinosum" /><Label show={lab} x={204} y={basal(204) - 6} tx={170} ty={252} text="Stratum basale" /><Label show={lab} x={300} y={60} tx={460} ty={170} text="Schweißdrüsengang" /></>;
      } else {
        out.push(<path key="hair" d="M 300 0 L 360 250" stroke="#f6e7c8" strokeWidth={36} />, <path key="hairin" d="M 300 0 L 360 250" stroke="#9b6a3a" strokeWidth={10} />);
        for (let k = 0; k < 7; k++) out.push(<circle key={`tg${k}`} cx={392 + (k % 3) * 18} cy={150 + Math.floor(k / 3) * 18} r={10} fill="#f8eef2" stroke="#d9b7c6" />);
        for (let k = 0; k < 7; k++) out.push(<circle key={`tgn${k}`} cx={392 + (k % 3) * 18} cy={150 + Math.floor(k / 3) * 18} r={2.6} fill={HE.nuc} />);
        out.push(<path key="arr" d="M 350 205 C 400 220 450 200 500 150" stroke="#ee9fba" strokeWidth={9} fill="none" />);
        labels = <><Label show={lab} x={60} y={8} tx={110} ty={20} text="dünne Hornschicht" /><Label show={lab} x={318} y={70} tx={430} ty={20} text="Haar im Haarfollikel" /><Label show={lab} x={410} y={165} tx={460} ty={110} text="Talgdrüse (holokrin)" /><Label show={lab} x={470} y={180} tx={470} ty={250} text="M. arrector pili" /><Label show={lab} x={120} y={basal(120) - 6} tx={140} ty={250} text="Stratum basale" /></>;
      }
    } else if (kind === 'h-schweissdruese') {
      dermis(0);
      for (let k = 0; k < 12; k++) { const x = 70 + (k % 4) * 110 + r() * 20; const y = 60 + Math.floor(k / 4) * 70 + r() * 12; const duct = k % 3 === 0;
        out.push(<circle key={`t${k}`} cx={x} cy={y} r={duct ? 13 : 22} fill={duct ? '#d97aa0' : '#f6c5d6'} stroke="#c47d97" strokeWidth={1} />);
        out.push(<circle key={`l${k}`} cx={x} cy={y} r={duct ? 4 : 10} fill="#fff" />);
        for (let n = 0; n < (duct ? 8 : 9); n++) { const a = (n / (duct ? 8 : 9)) * 6.28; out.push(<circle key={`n${k}-${n}`} cx={x + Math.cos(a) * (duct ? 8 : 16)} cy={y + Math.sin(a) * (duct ? 8 : 16)} r={2.6} fill={HE.nuc} />); } }
      labels = <><Label show={lab} x={180} y={60} tx={230} ty={14} text="sezernierendes Endstück: hell, weites Lumen" /><Label show={lab} x={70} y={60} tx={30} ty={250} text="Ausführungsgang: dunkler, zweischichtig" /></>;
    } else {
      const serous = kind === 'h-seroes';
      dermis(0);
      for (let k = 0; k < 9; k++) {
        const x = 75 + (k % 3) * 170 + r() * 20; const y = 50 + Math.floor(k / 3) * 80 + r() * 10; const R = serous ? 30 : 36;
        out.push(<circle key={`a${k}`} cx={x} cy={y} r={R} fill={serous ? '#c48cc4' : '#eef0f6'} stroke={serous ? '#8f5b99' : '#b9b3cf'} />);
        for (let n = 0; n < 8; n++) { const a = (n / 8) * 6.28; out.push(<line key={`s${k}-${n}`} x1={x + Math.cos(a) * (serous ? 3 : 14)} y1={y + Math.sin(a) * (serous ? 3 : 14)} x2={x + Math.cos(a) * R} y2={y + Math.sin(a) * R} stroke={serous ? '#a46fae' : '#d4d0e2'} strokeWidth={0.8} />); }
        out.push(<circle key={`lu${k}`} cx={x} cy={y} r={serous ? 3 : 13} fill="#fff" />);
        for (let n = 0; n < 8; n++) { const a = (n / 8) * 6.28 + 0.39; const d = R - 7; out.push(serous ? <circle key={`n${k}-${n}`} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={4.2} fill={HE.dark} /> : <ellipse key={`n${k}-${n}`} cx={x + Math.cos(a) * (R - 3)} cy={y + Math.sin(a) * (R - 3)} rx={5} ry={1.6} fill={HE.nuc} transform={`rotate(${(a * 180) / Math.PI + 90} ${x + Math.cos(a) * (R - 3)} ${y + Math.sin(a) * (R - 3)})`} />); }
        if (!serous) for (let n = 0; n < 14; n++) out.push(<circle key={`w${k}-${n}`} cx={x - 22 + r() * 44} cy={y - 22 + r() * 44} r={2} fill="none" stroke="#c9c4da" strokeWidth={0.6} />);
      }
      labels = serous
        ? <><Label show={lab} x={78} y={52} tx={140} ty={250} text="enges Lumen" /><Label show={lab} x={100} y={50} tx={300} ty={14} text="runde Kerne, basophiles Zytoplasma" /></>
        : <><Label show={lab} x={78} y={52} tx={140} ty={250} text="weites Lumen" /><Label show={lab} x={108} y={55} tx={300} ty={14} text="helles, wabiges Zytoplasma, flache basale Kerne" /></>;
    }
    return <>{out}{labels}</>;
  };
}

export function sceneFor(id: string): Scene {
  if (VESSEL_IDS.includes(id)) return vessels(id);
  if (BLOOD_IDS.includes(id)) return blood(id);
  if (SKIN_IDS.includes(id)) return skin(id);
  if (['h-platten-ein', 'h-iso', 'h-hoch', 'h-resp', 'h-platten-mehr', 'h-verhornt', 'h-urothel', 'h-basalmembran', 'h-mikrovilli', 'h-kinozilien'].includes(id)) return epithelium(id);
  if (['h-skelettmuskel', 'h-herzmuskel', 'h-glatt', 'h-neuron', 'h-glia'].includes(id)) return muscleNerve(id);
  return connective(id);
}

/** Präparat ohne Beschriftung (Histologie-Prüfungssimulator). */
export function HistoScene({ id }: { id: string }) {
  return <>{sceneFor(id)(null, false)}</>;
}

export function TissueView({ ids }: { ids: string[] }) {
  const [sel, setSel] = useState<string | null>(ids[0] ?? null);
  const [labels, setLabels] = useState(true);
  const shown = sel ?? ids[0];
  const s = structureById(shown);
  const idx = ids.indexOf(shown);
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="figure">
          <div className="toolbar no-print">
            <button className="small" aria-pressed={labels} onClick={() => setLabels((v) => !v)}>Beschriftung</button>
            <button className="small" onClick={() => setSel(ids[(idx - 1 + ids.length) % ids.length])} aria-label="Vorheriges Gewebe">◀</button>
            <button className="small" onClick={() => setSel(ids[(idx + 1) % ids.length])} aria-label="Nächstes Gewebe">▶</button>
          </div>
          <ZoomBox label="Präparat"><svg viewBox="0 0 520 260" role="img" aria-label={`Schema: ${s?.deName ?? ''}`} style={{ background: '#fff', borderRadius: 8 }}>
            {sceneFor(shown)(sel, labels)}
          </svg></ZoomBox>
        </div>
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Schematische Zeichnung in H.E.-Farben (Kerne blau-violett, Zytoplasma und Kollagen rosa) – kein echtes Präparat. Für den Kurs echte Präparate im Mikroskop oder im Kursatlas ansehen.</p>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <StructurePanel ids={ids} sel={sel} onSel={(id) => setSel(id ?? ids[0])} />
      </aside>
    </div>
  );
}

// ===========================================================================
// Terminologie: Karteikarten und Körperschema
// ===========================================================================

const LESSON_GROUPS: Record<string, TermCard['group'][]> = {
  lagebezeichnungen: ['lage', 'ebene'],
  wortbildung: ['praefix', 'suffix', 'organ', 'grammatik'],
};
const GROUP_LABEL: Record<TermCard['group'], string> = { lage: 'Lage und Richtung', ebene: 'Ebenen', praefix: 'Präfixe', suffix: 'Suffixe', organ: 'Organe lat./griech.', grammatik: 'Grammatik' };

function BodyFigure() {
  const A = ({ x1, y1, x2, y2, t, tx, ty }: { x1: number; y1: number; x2: number; y2: number; t: string; tx: number; ty: number }) => (
    <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent)" strokeWidth={2} markerEnd="url(#arr)" /><text x={tx} y={ty} fontSize={12} fill="var(--ink)" textAnchor="middle">{t}</text></g>
  );
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label="Körperschema mit Richtungsbezeichnungen: cranial oben, caudal unten, medial zur Mitte, lateral nach außen, proximal rumpfnah, distal rumpffern">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" /></marker></defs>
      <g fill="#efe6f5" stroke="#8b7bb8" strokeWidth={2}>
        <circle cx={210} cy={40} r={22} />
        <rect x={180} y={65} width={60} height={95} rx={14} />
        <path d="M 180 75 L 140 160 L 130 205" fill="none" strokeWidth={14} strokeLinecap="round" />
        <path d="M 240 75 L 280 160 L 290 205" fill="none" strokeWidth={14} strokeLinecap="round" />
        <path d="M 195 158 L 188 285" fill="none" strokeWidth={16} strokeLinecap="round" />
        <path d="M 225 158 L 232 285" fill="none" strokeWidth={16} strokeLinecap="round" />
      </g>
      <line x1={210} y1={10} x2={210} y2={295} stroke="#b9a7cf" strokeDasharray="4 4" />
      <text x={214} y={296} fontSize={10} fill="var(--ink-3)">Medianebene</text>
      <A x1={380} y1={110} x2={380} y2={34} t="cranialis" tx={380} ty={24} />
      <A x1={380} y1={170} x2={380} y2={246} t="caudalis" tx={380} ty={264} />
      <A x1={50} y1={105} x2={172} y2={105} t="medialis" tx={95} ty={96} />
      <A x1={128} y1={132} x2={20} y2={132} t="lateralis" tx={60} ty={150} />
      <line x1={262} y1={90} x2={306} y2={200} stroke="var(--eosin)" strokeWidth={2} markerStart="url(#arr2)" markerEnd="url(#arr2)" />
      <defs><marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--eosin)" /></marker></defs>
      <text x={280} y={80} fontSize={12} fill="var(--ink)">proximalis</text>
      <text x={300} y={222} fontSize={12} fill="var(--ink)">distalis</text>
    </svg>
  );
}

export function TermView({ lesson }: { lesson: string }) {
  const groups = LESSON_GROUPS[lesson] ?? ['lage'];
  const [group, setGroup] = useState<TermCard['group'] | 'alle'>('alle');
  const [mode, setMode] = useState<'karten' | 'liste' | 'trainer'>(lesson === 'wortbildung' ? 'trainer' : 'karten');
  const cards = TERM_CARDS.filter((c) => groups.includes(c.group) && (group === 'alle' || c.group === group));
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const open = cards.filter((c) => !known.has(c.term));
  const card = open[i % Math.max(1, open.length)];
  const next = (k: boolean) => {
    if (!card) return;
    if (k) setKnown((s) => new Set(s).add(card.term));
    else setI((x) => x + 1);
    setFlip(false);
  };
  return (
    <div className="stack">
      {lesson === 'lagebezeichnungen' && <div className="figure fig-limit"><BodyFigure /></div>}
      <div className="toolbar-line">
        <div className="seg" role="tablist" aria-label="Darstellung">
          <button role="tab" aria-selected={mode === 'karten'} onClick={() => setMode('karten')}>Karteikarten</button>
          <button role="tab" aria-selected={mode === 'liste'} onClick={() => setMode('liste')}>Liste</button>
          {lesson === 'wortbildung' && <button role="tab" aria-selected={mode === 'trainer'} onClick={() => setMode('trainer')}>Trainer</button>}
        </div>
        {groups.length > 1 && mode !== 'trainer' && (
          <select value={group} onChange={(e) => { setGroup(e.target.value as any); setI(0); setFlip(false); }} aria-label="Themengruppe">
            <option value="alle">Alle Gruppen</option>
            {groups.map((g) => <option key={g} value={g}>{GROUP_LABEL[g]}</option>)}
          </select>
        )}
      </div>
      {mode === 'karten' ? (
        <div className="stack">
          <div className="progressline"><span className="muted">{known.size} von {cards.length} gewusst</span><div className="meter"><div style={{ width: `${(cards.filter((c) => known.has(c.term)).length / Math.max(1, cards.length)) * 100}%` }} /></div></div>
          {card ? (
            <>
              <button className={`flashcard ${flip ? 'flipped' : ''}`} onClick={() => setFlip((f) => !f)} aria-live="polite" aria-label={flip ? `Rückseite: ${card.meaning}` : `Vorderseite: ${card.term}. Antippen zum Umdrehen.`}>
                {!flip ? <><span className="fc-kind">{GROUP_LABEL[card.group]}</span><span className="fc-main">{card.term}</span><span className="muted">Antippen zum Umdrehen</span></>
                  : <><span className="fc-kind">{card.term}</span><span className="fc-main" style={{ fontSize: '1.25rem' }}>{card.meaning}</span>{card.example && <span className="muted">Beispiel: {card.example}</span>}</>}
              </button>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button onClick={() => next(false)} disabled={!flip}>Noch nicht sicher</button>
                <button className="primary" onClick={() => next(true)} disabled={!flip}>Gewusst</button>
              </div>
            </>
          ) : (
            <div className="notice ok">Alle Karten gewusst. <button className="small" onClick={() => { setKnown(new Set()); setI(0); }}>Noch einmal</button></div>
          )}
        </div>
      ) : mode === 'trainer' ? <TermTrainer /> : (
        <section className="card">
          <table><tbody>{cards.map((c) => <tr key={c.term}><td><b>{c.term}</b></td><td>{c.meaning}{c.example && <div className="muted" style={{ fontSize: '0.85rem' }}>{c.example}</div>}</td></tr>)}</tbody></table>
        </section>
      )}
    </div>
  );
}
