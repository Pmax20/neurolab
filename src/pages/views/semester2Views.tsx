import { useMemo, useState, type ReactNode } from 'react';
import { TASKS } from '../../content';
import type { Task } from '../../content/types';
import { fmt } from '../../content/calc';
import { TaskView } from '../TaskView';
import { ZoomBox } from '../../ui/Zoom';

// Interaktive Ansichten für die ergänzten Lektionen (Physik, Chemie, Mikroskopie).

function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: [T, string][]; label: string }) {
  return <div className="seg" role="tablist" aria-label={label}>{items.map(([k, t]) => <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}>{t}</button>)}</div>;
}

function Slider({ label, value, set, min, max, step, unit }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; unit: string }) {
  return (
    <label className="field" style={{ margin: 0 }}>
      <span className="lab"><b>{label}</b><span className="num">{fmt(value, 4)} {unit}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label} />
    </label>
  );
}

/** Aufgaben einer Lektion nacheinander (z. B. Rechenaufgaben mit wechselnden Zahlen). */
export function TaskRunner({ filter, title, empty }: { filter: (t: Task) => boolean; title: string; empty?: string }) {
  const list = useMemo(() => TASKS.filter(filter), [filter]);
  const [i, setI] = useState(0);
  if (!list.length) return empty ? <p className="muted">{empty}</p> : null;
  const t = list[i % list.length];
  return (
    <section className="stack">
      <div className="row between"><h3 style={{ margin: 0 }}>{title}</h3><div className="row"><span className="muted">{(i % list.length) + 1} / {list.length}</span><button className="small" onClick={() => setI((x) => x + 1)}>Nächste</button></div></div>
      <TaskView key={t.id + i} task={t} mode="lektion" compact />
    </section>
  );
}
const calcOf = (lesson: string) => (t: Task) => t.type === 'calc' && t.lessons.includes(lesson);

// ===========================================================================
// Größen und Bewegung: Vektoraddition und Einheitenumrechner
// ===========================================================================

const CONV: Record<string, { label: string; units: [string, number][] }> = {
  laenge: { label: 'Länge', units: [['km', 1e3], ['m', 1], ['cm', 1e-2], ['mm', 1e-3], ['µm', 1e-6], ['nm', 1e-9]] },
  flaeche: { label: 'Fläche', units: [['m²', 1], ['dm²', 1e-2], ['cm²', 1e-4], ['mm²', 1e-6]] },
  volumen: { label: 'Volumen', units: [['m³', 1], ['l', 1e-3], ['dl', 1e-4], ['ml', 1e-6], ['cm³', 1e-6], ['µl', 1e-9]] },
  geschw: { label: 'Geschwindigkeit', units: [['m/s', 1], ['km/h', 1 / 3.6], ['cm/s', 1e-2], ['mm/s', 1e-3]] },
  druck: { label: 'Druck', units: [['Pa', 1], ['hPa', 100], ['kPa', 1e3], ['bar', 1e5], ['mmHg', 133.322], ['cmH₂O', 98.0665]] },
  energie: { label: 'Energie', units: [['J', 1], ['kJ', 1e3], ['kcal', 4184], ['kWh', 3.6e6]] },
};

function Converter() {
  const [q, setQ] = useState('volumen');
  const c = CONV[q];
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState(c.units[0][0]);
  const f = c.units.find((u) => u[0] === from) ?? c.units[0];
  const v = Number(val.replace(',', '.'));
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Einheiten umrechnen</h3>
      <div className="row">
        <select value={q} onChange={(e) => { setQ(e.target.value); setFrom(CONV[e.target.value].units[0][0]); }} aria-label="Größe">{Object.entries(CONV).map(([k, x]) => <option key={k} value={k}>{x.label}</option>)}</select>
        <input type="text" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} style={{ width: 110 }} aria-label="Wert" />
        <select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Ausgangseinheit">{c.units.map(([u]) => <option key={u}>{u}</option>)}</select>
      </div>
      {Number.isFinite(v) && (
        <table><tbody>{c.units.filter((u) => u[0] !== from).map(([u, k]) => <tr key={u}><td className="num">{fmt((v * f[1]) / k, 4)}</td><td>{u}</td></tr>)}</tbody></table>
      )}
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Bei Flächen und Volumina wird der Vorsatz mitpotenziert: 1 cm² = 10⁻⁴ m², 1 cm³ = 1 ml = 10⁻⁶ m³.</p>
    </div>
  );
}

function VectorAdd() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [ang, setAng] = useState(90);
  const t = (ang * Math.PI) / 180;
  const rx = a + b * Math.cos(t), ry = b * Math.sin(t);
  const R = Math.hypot(rx, ry);
  const S = 28, ox = 60, oy = 230;
  const arrow = (x1: number, y1: number, x2: number, y2: number, c: string, lab: string, dash?: boolean, dx = 8, dy = -8, anchor: 'start' | 'end' = 'start') => (
    <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={4} markerEnd={`url(#va-${c.replace(/[^a-z]/gi, '')})`} strokeDasharray={dash ? '6 4' : undefined} /><text x={(x1 + x2) / 2 + dx} y={(y1 + y2) / 2 + dy} textAnchor={anchor} style={{ fontSize: 14 }} fill={c}>{lab}</text></g>
  );
  const cols = ['#4b3a8c', '#c8456c', '#2f8f6a'];
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Zwei Kräfte addieren</h3>
      <div className="grid cols-3">
        <Slider label="Kraft F₁" value={a} set={setA} min={0} max={8} step={0.5} unit="N" />
        <Slider label="Kraft F₂" value={b} set={setB} min={0} max={8} step={0.5} unit="N" />
        <Slider label="Winkel zwischen F₁ und F₂" value={ang} set={setAng} min={0} max={180} step={5} unit="°" />
      </div>
      <svg viewBox="-80 0 600 260" role="img" aria-label={`Resultierende Kraft ${fmt(R, 3)} Newton`} style={{ background: '#fff', borderRadius: 8 }}>
        <defs>{cols.map((c) => <marker key={c} id={`va-${c.replace(/[^a-z]/gi, '')}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={c} /></marker>)}</defs>
        {arrow(ox, oy, ox + a * S, oy, cols[0], 'F₁', false, 0, 20)}
        {arrow(ox + a * S, oy, ox + rx * S, oy - ry * S, cols[1], 'F₂', true, 10, 0)}
        {arrow(ox, oy, ox + rx * S, oy - ry * S, cols[2], `F = ${fmt(R, 3)} N`, false, -10, -6, 'end')}
      </svg>
      <p style={{ margin: 0 }} aria-live="polite">Resultierende: <b>{fmt(R, 3)} N</b>. {ang === 0 ? 'Gleiche Richtung: Die Beträge addieren sich.' : ang === 180 ? 'Entgegengesetzt: Die Beträge subtrahieren sich.' : ang === 90 ? 'Rechter Winkel: Satz des Pythagoras.' : 'Vektoren werden geometrisch addiert (Kräfteparallelogramm).'}</p>
    </div>
  );
}

export function MotionView() {
  const [tab, setTab] = useState<'umrechnen' | 'vektor' | 'rechnen'>('umrechnen');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['umrechnen', 'Einheiten'], ['vektor', 'Vektoren'], ['rechnen', 'Rechentrainer']]} />
      {tab === 'umrechnen' && <Converter />}
      {tab === 'vektor' && <VectorAdd />}
      {tab === 'rechnen' && <TaskRunner filter={calcOf('groessen-bewegung')} title="Rechentrainer: Bewegung" />}
    </div>
  );
}

// ===========================================================================
// Arbeit, Energie, Leistung: Treppensteigen
// ===========================================================================

export function WorkView() {
  const [tab, setTab] = useState<'treppe' | 'rechnen'>('treppe');
  const [m, setM] = useState(60);
  const [h, setH] = useState(10);
  const [t, setT] = useState(20);
  const [eta, setEta] = useState(20);
  const W = m * 9.81 * h, P = W / t, chem = W / (eta / 100);
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['treppe', 'Treppensteigen'], ['rechnen', 'Rechentrainer']]} />
      {tab === 'treppe' ? (
        <div className="card stack">
          <div className="grid cols-2">
            <Slider label="Masse" value={m} set={setM} min={40} max={110} step={1} unit="kg" />
            <Slider label="Höhe (etwa 3 m pro Stockwerk)" value={h} set={setH} min={3} max={30} step={0.5} unit="m" />
            <Slider label="Zeit" value={t} set={setT} min={5} max={120} step={1} unit="s" />
            <Slider label="Wirkungsgrad der Muskulatur" value={eta} set={setEta} min={10} max={25} step={1} unit="%" />
          </div>
          <table><tbody>
            <tr><td>Hubarbeit W = m·g·h</td><td className="num">{fmt(W, 4)} J = {fmt(W / 1000, 3)} kJ</td></tr>
            <tr><td>mittlere Hubleistung P = W/t</td><td className="num">{fmt(P, 3)} W</td></tr>
            <tr><td>umgesetzte chemische Energie W/η</td><td className="num">{fmt(chem / 1000, 3)} kJ = {fmt(chem / 4184, 3)} kcal</td></tr>
            <tr><td>davon als Wärme abgegeben</td><td className="num">{fmt((chem - W) / 1000, 3)} kJ</td></tr>
          </tbody></table>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Vereinfachtes Modell: nur die Hubarbeit; Ruheumsatz, Beschleunigung und Abbremsen sind nicht berücksichtigt. Der Wirkungsgrad ist frei wählbar, weil er je nach Belastung schwankt.</p>
        </div>
      ) : <TaskRunner filter={calcOf('energie-leistung')} title="Rechentrainer: Arbeit, Energie, Leistung" />}
    </div>
  );
}

// ===========================================================================
// Dichte und Druck: Infusion und Körperlage
// ===========================================================================

function Posture() {
  const [map, setMap] = useState(93);
  const [stand, setStand] = useState(true);
  const k = (1060 * 9.81) / 133.322 / 100; // mmHg pro cm Blutsäule
  const pts: [string, number, number][] = [['Kopf', 45, 40], ['Herzhöhe (Oberarm)', 0, 130], ['Knie', -70, 250], ['Fuß', -115, 320]];
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Blutdruck und Körperlage</h3>
      <div className="row"><Tabs value={stand ? 's' : 'l'} onChange={(v) => setStand(v === 's')} label="Körperlage" items={[['s', 'Stehen'], ['l', 'Liegen']]} /></div>
      <Slider label="Mittlerer arterieller Druck auf Herzhöhe" value={map} set={setMap} min={70} max={120} step={1} unit="mmHg" />
      <div className="row" style={{ alignItems: 'center', gap: 20 }}>
        <svg viewBox="0 0 160 340" style={{ width: 140, flex: 'none' }} role="img" aria-label={stand ? 'stehender Mensch' : 'liegender Mensch'}>
          <g fill="#efe6f5" stroke="#8b7bb8" strokeWidth={2} transform={stand ? '' : 'rotate(-90 80 170) translate(0 0)'}>
            <circle cx={80} cy={30} r={20} /><rect x={58} y={54} width={44} height={110} rx={12} /><path d="M66 160 L62 330 M94 160 L98 330" strokeWidth={14} strokeLinecap="round" fill="none" />
          </g>
          {stand && <line x1={10} y1={130} x2={150} y2={130} stroke="var(--accent)" strokeDasharray="4 3" />}
        </svg>
        <table><thead><tr><th>Ort</th><th className="num">Höhe zum Herzen</th><th className="num">arterieller Mitteldruck</th></tr></thead>
          <tbody>{pts.map(([n, dh]) => <tr key={n}><td>{n}</td><td className="num">{stand ? `${dh > 0 ? '+' : ''}${dh} cm` : '0 cm'}</td><td className="num"><b>{fmt(map - (stand ? dh * k : 0), 3)} mmHg</b></td></tr>)}</tbody></table>
      </div>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Berechnet mit p = ρ·g·h (Blut ρ ≈ 1060 kg/m³, ≈ 0,78 mmHg pro cm). Vereinfacht: Strömungsverluste in den großen Arterien sind vernachlässigt. Medizinischer Bezug als Ergänzung zum Physikstoff.</p>
    </div>
  );
}

function Infusion() {
  const [h, setH] = useState(80);
  const [pv, setPv] = useState(8);
  const flows = h > pv;
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Läuft die Infusion?</h3>
      <div className="grid cols-2">
        <Slider label="Höhe des Beutels über der Vene" value={h} set={setH} min={0} max={150} step={5} unit="cm" />
        <Slider label="Venendruck" value={pv} set={setPv} min={0} max={30} step={1} unit="cmH₂O" />
      </div>
      <p style={{ margin: 0 }} aria-live="polite">Hydrostatischer Druck der Säule: <b>{h} cmH₂O ≈ {fmt(h * 0.7356, 3)} mmHg ≈ {fmt(h * 98.07, 4)} Pa</b>. {flows ? '✓ Größer als der Venendruck – die Infusion läuft.' : '✗ Nicht größer als der Venendruck – die Infusion läuft nicht. Beutel höher hängen.'}</p>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Vereinfacht: Infusionslösung mit ρ ≈ 1000 kg/m³, Widerstand von Schlauch und Kanüle vernachlässigt.</p>
    </div>
  );
}

export function PressureView() {
  const [tab, setTab] = useState<'lage' | 'infusion' | 'rechnen'>('lage');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['lage', 'Körperlage'], ['infusion', 'Infusion'], ['rechnen', 'Rechentrainer']]} />
      {tab === 'lage' && <Posture />}
      {tab === 'infusion' && <Infusion />}
      {tab === 'rechnen' && <TaskRunner filter={calcOf('druck-dichte')} title="Rechentrainer: Dichte und Druck" />}
    </div>
  );
}

// ===========================================================================
// Periodensystem (Perioden 1–4)
// ===========================================================================

type El = [number, string, string, number | null];
const ELEMENTS: El[] = [
  [1, 'H', 'Wasserstoff', 2.2], [2, 'He', 'Helium', null], [3, 'Li', 'Lithium', 0.98], [4, 'Be', 'Beryllium', 1.57], [5, 'B', 'Bor', 2.04], [6, 'C', 'Kohlenstoff', 2.55], [7, 'N', 'Stickstoff', 3.04], [8, 'O', 'Sauerstoff', 3.44], [9, 'F', 'Fluor', 3.98], [10, 'Ne', 'Neon', null],
  [11, 'Na', 'Natrium', 0.93], [12, 'Mg', 'Magnesium', 1.31], [13, 'Al', 'Aluminium', 1.61], [14, 'Si', 'Silicium', 1.9], [15, 'P', 'Phosphor', 2.19], [16, 'S', 'Schwefel', 2.58], [17, 'Cl', 'Chlor', 3.16], [18, 'Ar', 'Argon', null],
  [19, 'K', 'Kalium', 0.82], [20, 'Ca', 'Calcium', 1.0], [21, 'Sc', 'Scandium', 1.36], [22, 'Ti', 'Titan', 1.54], [23, 'V', 'Vanadium', 1.63], [24, 'Cr', 'Chrom', 1.66], [25, 'Mn', 'Mangan', 1.55], [26, 'Fe', 'Eisen', 1.83], [27, 'Co', 'Cobalt', 1.88], [28, 'Ni', 'Nickel', 1.91], [29, 'Cu', 'Kupfer', 1.9], [30, 'Zn', 'Zink', 1.65],
  [31, 'Ga', 'Gallium', 1.81], [32, 'Ge', 'Germanium', 2.01], [33, 'As', 'Arsen', 2.18], [34, 'Se', 'Selen', 2.55], [35, 'Br', 'Brom', 2.96], [36, 'Kr', 'Krypton', 3.0],
];
const MED = new Set(['H', 'C', 'N', 'O', 'P', 'S', 'Na', 'K', 'Ca', 'Mg', 'Cl', 'Fe']);
function position(z: number): [number, number] {
  if (z <= 2) return [1, z === 1 ? 1 : 18];
  if (z <= 18) { const p = z <= 10 ? 2 : 3; const k = z - (p === 2 ? 2 : 10); return [p, k <= 2 ? k : k + 10]; }
  return [4, z - 18];
}
const ORDER: [string, number][] = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => String(n).split('').map((d) => SUPS[Number(d)]).join('');
export function electronConfig(z: number): { full: string; short: string; valence: number | null; shells: number[] } {
  const occ: [string, number][] = [];
  let left = z;
  for (const [o, cap] of ORDER) { if (left <= 0) break; const n = Math.min(cap, left); occ.push([o, n]); left -= n; }
  // Ausnahmen: Cr und Cu (halb bzw. voll besetzte d-Schale)
  if (z === 24 || z === 29) { const s = occ.find((x) => x[0] === '4s')!; const d = occ.find((x) => x[0] === '3d')!; s[1] = 1; d[1] += 1; }
  const sorted = [...occ].sort((a, b) => Number(a[0][0]) - Number(b[0][0]) || 'spd'.indexOf(a[0][1]) - 'spd'.indexOf(b[0][1]));
  const full = sorted.map(([o, n]) => o + sup(n)).join(' ');
  const cores: [number, string][] = [[18, 'Ar'], [10, 'Ne'], [2, 'He']];
  const core = cores.find(([cz]) => z > cz);
  let short = full;
  if (core) { const skip = core[0] === 18 ? ['1s', '2s', '2p', '3s', '3p'] : core[0] === 10 ? ['1s', '2s', '2p'] : ['1s']; short = `[${core[1]}] ` + sorted.filter(([o]) => !skip.includes(o)).map(([o, n]) => o + sup(n)).join(' '); }
  const shells = [1, 2, 3, 4].map((n) => sorted.filter(([o]) => Number(o[0]) === n).reduce((a, [, k]) => a + k, 0)).filter((x) => x > 0);
  const [, g] = position(z);
  const valence = g <= 2 ? g : g >= 13 ? g - 10 : null;
  return { full, short, valence: z === 2 ? 2 : valence, shells };
}
const ION: Record<string, string> = { H: 'H⁺', Li: 'Li⁺', Na: 'Na⁺', K: 'K⁺', Be: 'Be²⁺', Mg: 'Mg²⁺', Ca: 'Ca²⁺', Al: 'Al³⁺', O: 'O²⁻', S: 'S²⁻', F: 'F⁻', Cl: 'Cl⁻', Br: 'Br⁻', Fe: 'Fe²⁺ / Fe³⁺', Cu: 'Cu⁺ / Cu²⁺', Zn: 'Zn²⁺', N: 'N³⁻ (in Nitriden; meist kovalent gebunden)' };

export function PeriodicView() {
  const [z, setZ] = useState(11);
  const [mode, setMode] = useState<'en' | 'block' | 'med'>('block');
  const el = ELEMENTS[z - 1];
  const c = electronConfig(z);
  const [p, g] = position(z);
  const color = (e: El) => {
    const [ez, sym, , en] = e;
    if (mode === 'med') return MED.has(sym) ? 'var(--accent-soft)' : '#fff';
    if (mode === 'en') return en === null ? '#f0efec' : `hsl(${260 - (en - 0.7) * 60}, 60%, ${92 - (en - 0.7) * 9}%)`;
    const [, gg] = position(ez);
    return gg <= 2 ? '#fbe3e3' : gg >= 13 ? (gg === 18 ? '#e7f1fb' : '#e5f4e4') : '#f9eeda';
  };
  const cells: ReactNode[] = [];
  for (const e of ELEMENTS) {
    const [pp, gg] = position(e[0]);
    cells.push(<button key={e[0]} style={{ gridRow: pp, gridColumn: gg, background: color(e) }} aria-pressed={e[0] === z} onClick={() => setZ(e[0])} aria-label={`${e[2]}, Ordnungszahl ${e[0]}`}><small>{e[0]}</small><b>{e[1]}</b>{mode === 'en' && <small>{e[3] ?? '–'}</small>}</button>);
  }
  return (
    <div className="stack">
      <div className="toolbar-line">
        <Tabs value={mode} onChange={setMode} label="Färbung" items={[['block', 'Haupt-/Nebengruppen'], ['en', 'Elektronegativität'], ['med', 'Wichtig im Körper']]} />
      </div>
      <div className="card"><ZoomBox label="Periodensystem" max={2.5}><div className="pse" role="group" aria-label="Periodensystem, Perioden 1 bis 4">{cells}</div></ZoomBox></div>
      <section className="card stack" aria-live="polite">
        <h3 style={{ margin: 0 }}>{el[2]} ({el[1]}) · Ordnungszahl {el[0]}</h3>
        <div className="grid cols-2">
          <div><b>Elektronenkonfiguration</b><div className="eq">{c.full}</div><div className="eq">{c.short}</div></div>
          <div><b>Schalenmodell</b><div className="eq">{c.shells.join(' – ')} Elektronen</div></div>
          <div><b>Stellung</b><div>{p}. Periode, {g <= 2 || g >= 13 ? `${g <= 2 ? g : g - 10}. Hauptgruppe (IUPAC-Gruppe ${g})` : `Nebengruppe (IUPAC-Gruppe ${g})`}</div></div>
          <div><b>Valenzelektronen</b><div>{c.valence ?? 'bei Übergangsmetallen nicht einfach aus der Gruppe ablesbar'}</div></div>
          <div><b>Elektronegativität (Pauling)</b><div>{el[3] ?? 'für Edelgase meist nicht angegeben'}</div></div>
          <div><b>Typisches Ion</b><div>{ION[el[1]] ?? (g === 18 ? 'Edelgas – bildet praktisch keine Ionen' : '–')}</div></div>
        </div>
        {(z === 24 || z === 29) && <p className="muted" style={{ margin: 0 }}>Ausnahme von der Besetzungsregel: Eine halb- bzw. vollbesetzte 3d-Unterschale ist energetisch günstiger.</p>}
      </section>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Gezeigt sind die Perioden 1–4. Elektronegativitäten nach Pauling (gerundet).</p>
    </div>
  );
}

// ===========================================================================
// Reaktionsgleichungen
// ===========================================================================

export function BalanceView() {
  const [tab, setTab] = useState<'gleichungen' | 'rechnen'>('gleichungen');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['gleichungen', 'Gleichungen ausgleichen'], ['rechnen', 'Rechentrainer']]} />
      {tab === 'gleichungen' ? <TaskRunner filter={(t) => t.type === 'balance'} title="Gleichungen ausgleichen" /> : <TaskRunner filter={calcOf('stoechiometrie')} title="Rechentrainer: Stöchiometrie und Verdünnung" />}
    </div>
  );
}

// ===========================================================================
// Mikroskopie: Vergrößerung, Schnittrichtung, Färbungen
// ===========================================================================

function Magnifier() {
  const [obj, setObj] = useState(10);
  const fov = 20 / obj; // Sehfeldzahl 20 mm (übliches Okular 10×)
  const visible = obj <= 4 ? 'Übersicht: Schichten eines Organs, Drüsen, Knochenbälkchen' : obj <= 10 ? 'Gewebearten, einzelne Zellgruppen' : obj <= 40 ? 'einzelne Zellen, Kernform, Zellgrenzen' : 'Kerndetails, Kinozilien, Bürstensaum als Saum (Ölimmersion)';
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Vergrößerung und Sehfeld</h3>
      <Tabs value={String(obj) as '4'} onChange={(v) => setObj(Number(v))} label="Objektiv" items={[['4', '4×'], ['10', '10×'], ['40', '40×'], ['100', '100× Öl']] as ['4', string][]} />
      <table><tbody>
        <tr><td>Gesamtvergrößerung (Okular 10×)</td><td className="num"><b>{obj * 10}-fach</b></td></tr>
        <tr><td>Durchmesser des Sehfelds (Sehfeldzahl 20)</td><td className="num">{fmt(fov, 2)} mm = {fmt(fov * 1000, 3)} µm</td></tr>
        <tr><td>Gut zu sehen</td><td>{visible}</td></tr>
      </tbody></table>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Je stärker die Vergrößerung, desto kleiner das Sehfeld. Die Auflösung bleibt beim Lichtmikroskop auf etwa 0,2 µm begrenzt. Die Sehfeldzahl hängt vom Okular ab; 20 mm ist ein typischer Wert.</p>
    </div>
  );
}

function CutPlane() {
  const [ang, setAng] = useState(0);
  const t = (ang * Math.PI) / 180;
  const r = 40;
  const long = ang >= 85;
  const rx = long ? 120 : Math.min(120, r / Math.cos(t));
  const label = ang < 10 ? 'Querschnitt: Ring' : long ? 'Längsschnitt: zwei parallele Streifen' : 'Schrägschnitt: Oval';
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Schnittrichtung durch ein Rohr</h3>
      <Slider label="Winkel der Schnittebene zur Querschnittsebene" value={ang} set={setAng} min={0} max={90} step={5} unit="°" />
      <div className="row" style={{ alignItems: 'center', gap: 16 }}>
        <svg viewBox="0 0 200 200" style={{ width: 170, flex: 'none' }} role="img" aria-label="Rohr mit Schnittebene">
          <rect x={70} y={10} width={60} height={180} rx={6} fill="#f6e2ea" stroke="#c96f8e" strokeWidth={6} />
          <g transform={`rotate(${-ang} 100 100)`}><rect x={20} y={97} width={160} height={6} fill="var(--accent)" opacity={0.75} /></g>
        </svg>
        <svg viewBox="0 0 300 200" style={{ flex: 1, maxWidth: 320 }} role="img" aria-label={label}>
          {long ? (<><rect x={30} y={60} width={240} height={14} fill="#e58aa8" /><rect x={30} y={126} width={240} height={14} fill="#e58aa8" /></>)
            : (<><ellipse cx={150} cy={100} rx={rx + 7} ry={r + 7} fill="#e58aa8" /><ellipse cx={150} cy={100} rx={rx - 7} ry={r - 7} fill="#fff" /></>)}
        </svg>
      </div>
      <p style={{ margin: 0 }} aria-live="polite"><b>{label}.</b> Im Schnitt sieht man immer nur eine Ebene – erst mehrere Schnittrichtungen zusammen verraten die räumliche Gestalt.</p>
    </div>
  );
}

const STAINS: [string, string, string, string][] = [
  ['H.E.', 'Zellkerne blau-violett (Hämatoxylin); Zytoplasma, Kollagen, Erythrozyten rosa bis rot (Eosin)', '#4f3c8f', '#f1b8cb'],
  ['PAS-Reaktion', 'Kohlenhydrate magenta: Glykogen, Schleim der Becherzellen, Basalmembranen', '#c2187a', '#f7d3e6'],
  ['Azan', 'Kollagen blau, Zellkerne rot, Zytoplasma rötlich', '#2d5fb3', '#e05a4b'],
  ['Resorcin-Fuchsin', 'elastische Fasern dunkelviolett', '#3b1f5c', '#efe2f5'],
  ['Versilberung', 'retikuläre Fasern schwarz', '#222222', '#e8dfc8'],
];

export function MicroscopyView() {
  const [tab, setTab] = useState<'mikroskop' | 'schnitt' | 'faerbung'>('mikroskop');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['mikroskop', 'Vergrößerung'], ['schnitt', 'Schnittrichtung'], ['faerbung', 'Färbungen']]} />
      {tab === 'mikroskop' && <><Magnifier /><TaskRunner filter={calcOf('mikroskopie')} title="Rechnen: Gesamtvergrößerung" /></>}
      {tab === 'schnitt' && <CutPlane />}
      {tab === 'faerbung' && (
        <div className="card">
          <table><thead><tr><th>Färbung</th><th>Was wird sichtbar?</th><th /></tr></thead>
            <tbody>{STAINS.map(([n, d, a, b]) => <tr key={n}><td><b>{n}</b></td><td>{d}</td><td><span className="legend-sw" style={{ background: a }} /><span className="legend-sw" style={{ background: b }} /></td></tr>)}</tbody></table>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Farbfelder nur zur Orientierung – die Farbtöne echter Präparate schwanken je nach Protokoll und Mikroskop.</p>
        </div>
      )}
    </div>
  );
}
