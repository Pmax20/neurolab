import { useState, type ReactNode } from 'react';
import { structureById } from '../content';

// ---------------------------------------------------------------------------
// Interaktive Struktur (SVG): fokussierbar, per Tastatur auswählbar
// ---------------------------------------------------------------------------

export function Struct({ id, sel, onSel, isolate, children, label }: { id: string; sel: string | null; onSel?: (id: string) => void; isolate?: boolean; children: ReactNode; label?: string }) {
  const s = structureById(id);
  const name = label ?? s?.deName ?? id;
  const interactive = !!onSel;
  return (
    <g
      className={`${interactive ? 'struct' : ''} ${sel === id ? 'selected' : ''} ${isolate && sel && sel !== id ? 'dim' : ''}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? name : undefined}
      aria-pressed={interactive ? sel === id : undefined}
      onClick={interactive ? () => onSel!(id) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSel!(id); } } : undefined}
    >
      {interactive && <title>{name}</title>}
      {children}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Neuron
// ---------------------------------------------------------------------------

export const NEURON_LABEL_POS: Record<string, [number, number]> = {
  dendrite: [52, 78], soma: [150, 266], nucleus: [150, 182], hillock: [236, 140], axon: [470, 132], myelin: [380, 224], ranvier: [560, 224], terminal: [790, 84],
};

export function NeuronFigure({ sel, onSel, isolate, labels = true, markers, zoom = 1 }: { sel: string | null; onSel?: (id: string) => void; isolate?: boolean; labels?: boolean; markers?: { n: number; structure: string }[]; zoom?: number }) {
  const myelinSegs = [300, 400, 500, 600];
  const W = 900;
  const H = 300;
  const vb = zoom === 1 ? `0 0 ${W} ${H}` : `${(W - W / zoom) / 2} ${(H - H / zoom) / 2} ${W / zoom} ${H / zoom}`;
  const dendrites = [
    'M110,150 C80,120 60,90 30,70', 'M70,110 C55,100 45,110 25,115', 'M105,200 C70,220 50,250 25,262', 'M60,233 C50,215 30,205 15,200',
    'M140,128 C135,90 120,60 105,30', 'M125,80 C140,60 150,45 165,28', 'M150,235 C150,262 140,280 120,295', 'M95,175 C60,175 40,165 12,160',
  ];
  return (
    <svg viewBox={vb} role="group" aria-label="Schematische Nervenzelle mit auswählbaren Strukturen">
      <defs>
        <linearGradient id="somaG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#f3c9a0" /><stop offset="1" stopColor="#e2a274" /></linearGradient>
      </defs>
      <Struct id="dendrite" sel={sel} onSel={onSel} isolate={isolate}>
        {dendrites.map((d, i) => <path key={i} d={d} fill="none" stroke="#d58f5c" strokeWidth={i < 4 ? 9 : 7} strokeLinecap="round" />)}
        <path className="hit" d={dendrites.join(' ')} fill="none" stroke="transparent" strokeWidth={22} strokeLinecap="round" />
      </Struct>
      <Struct id="soma" sel={sel} onSel={onSel} isolate={isolate}>
        <path className="hit" d="M150,118 C200,118 222,150 222,180 C222,215 195,240 150,240 C105,240 85,212 88,180 C90,148 108,118 150,118 Z" fill="url(#somaG)" stroke="#b9774a" strokeWidth={2} />
      </Struct>
      <Struct id="nucleus" sel={sel} onSel={onSel} isolate={isolate}>
        <circle className="hit" cx={150} cy={180} r={24} fill="#8f5ea8" stroke="#6b4381" strokeWidth={2} />
        <circle cx={156} cy={174} r={7} fill="#5b3270" />
      </Struct>
      <Struct id="hillock" sel={sel} onSel={onSel} isolate={isolate}>
        <path className="hit" d="M216,160 L262,172 L262,188 L216,200 Z" fill="#e7b086" stroke="#b9774a" strokeWidth={1.5} />
        <rect x={262} y={172} width={36} height={16} fill="#f0c8a4" stroke="#b9774a" strokeWidth={1.2} />
      </Struct>
      <Struct id="axon" sel={sel} onSel={onSel} isolate={isolate}>
        <rect className="hit" x={262} y={174} width={510} height={12} fill="#e8b38a" stroke="#b9774a" strokeWidth={1} />
      </Struct>
      <Struct id="myelin" sel={sel} onSel={onSel} isolate={isolate}>
        {myelinSegs.map((x) => <rect key={x} className="hit" x={x} y={162} width={88} height={36} rx={16} fill="#f6efd8" stroke="#bfae75" strokeWidth={2} />)}
        {myelinSegs.map((x) => [0, 1, 2].map((k) => <line key={`${x}-${k}`} x1={x + 20 + k * 22} x2={x + 20 + k * 22} y1={165} y2={195} stroke="#d8c991" strokeWidth={1} />))}
      </Struct>
      <Struct id="ranvier" sel={sel} onSel={onSel} isolate={isolate}>
        {[388, 488, 588].map((x) => <rect key={x} className="hit" x={x} y={170} width={12} height={20} fill="#1f8a85" stroke="#14605c" strokeWidth={1} rx={2} />)}
      </Struct>
      <Struct id="terminal" sel={sel} onSel={onSel} isolate={isolate}>
        <path d="M700,180 C740,180 760,130 800,110 M700,180 C750,180 770,190 810,185 M700,180 C740,185 760,235 800,250" fill="none" stroke="#d58f5c" strokeWidth={6} strokeLinecap="round" />
        {[[808, 106], [818, 185], [808, 254]].map(([x, y]) => <circle key={x + '' + y} className="hit" cx={x} cy={y} r={14} fill="#e39a6a" stroke="#b9774a" strokeWidth={2} />)}
        {[[804, 102], [812, 110], [820, 181], [814, 189], [806, 250], [812, 258]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#fff4e8" />)}
      </Struct>
      {labels && (
        <g aria-hidden="true">
          {Object.entries(NEURON_LABEL_POS).map(([id, [x, y]]) => (!isolate || !sel || sel === id) && (
            <text key={id} className="lbl" x={x} y={y} textAnchor="middle">{structureById(id)?.deName}</text>
          ))}
        </g>
      )}
      {markers?.map((m) => {
        const p = NEURON_LABEL_POS[m.structure];
        return (
          <g key={m.n} aria-hidden="true">
            <circle cx={p[0]} cy={p[1] - 4} r={13} fill="var(--ink)" />
            <text x={p[0]} y={p[1]} textAnchor="middle" fill="var(--bg)" style={{ fontSize: 14, fontWeight: 700 }}>{m.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Synapse (statisch und animiert)
// ---------------------------------------------------------------------------

export interface SynState {
  vPre: number; // mV
  mCa: number; // 0..1
  Ca: number; // relativ 0..1
  released: number; // 0..1 Anteil des Pools
  T: number; // 0..1 Transmitter im Spalt
  R: number; // 0..1 Rezeptoraktivierung
  V: number; // postsynaptisch, mV
  kind: 'glutamat' | 'gaba' | 'ach_nmj';
}

export const SYN_MARK: Record<string, [number, number]> = { terminal: [90, 40], vesicle: [140, 95], premembrane: [320, 178], cleft: [470, 206], postmembrane: [470, 268], receptor: [280, 250] };

export function SynapseFigure({ sel, onSel, isolate, state, labels = true, nmj = false, markers }: { sel: string | null; onSel?: (id: string) => void; isolate?: boolean; state?: SynState; labels?: boolean; nmj?: boolean; markers?: { n: number; structure: string }[] }) {
  const ves = [[150, 110], [190, 90], [230, 115], [270, 92], [310, 112], [350, 95], [390, 115], [210, 145], [290, 145], [370, 145], [170, 150], [330, 150]];
  const fusedN = state ? Math.round(state.released * 6) : 0;
  const tDots = state ? Math.round(state.T * 40) : 0;
  const caDots = state ? Math.round(Math.min(1, state.Ca) * 14) : 0;
  const caOpen = state ? state.mCa > 0.3 : false;
  const rng = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  const depolPre = state ? Math.max(0, Math.min(1, (state.vPre + 65) / 100)) : 0;
  const postDepol = state ? Math.max(-1, Math.min(1, (state.V - (nmj ? -85 : -70)) / 30)) : 0;
  return (
    <svg viewBox="0 0 560 320" role="group" aria-label={nmj ? 'Schema der motorischen Endplatte' : 'Schema einer chemischen Synapse'}>
      <Struct id="terminal" sel={sel} onSel={onSel} isolate={isolate}>
        <path className="hit" d="M60,20 L500,20 C520,20 520,40 520,60 L520,150 C520,175 500,180 480,180 L80,180 C60,180 40,175 40,150 L40,60 C40,40 40,20 60,20 Z" fill={`rgba(227,154,106,${0.25 + depolPre * 0.35})`} stroke="#b9774a" strokeWidth={2} />
        <ellipse cx={460} cy={70} rx={34} ry={18} fill="#f2c27b" stroke="#c49040" />
        <text x={460} y={74} textAnchor="middle" style={{ fontSize: 10 }} fill="#6a4a10">Mitochondrium</text>
      </Struct>
      <Struct id="vesicle" sel={sel} onSel={onSel} isolate={isolate}>
        {ves.map(([x, y], i) => {
          const fused = i < fusedN;
          return (
            <g key={i}>
              <circle className="hit" cx={x} cy={fused ? 172 : y} r={fused ? 9 : 14} fill={fused ? 'none' : '#fff4e8'} stroke="#b9774a" strokeWidth={2} strokeDasharray={fused ? '3 3' : undefined} />
              {!fused && [0, 1, 2, 3].map((k) => <circle key={k} cx={x - 5 + (k % 2) * 10} cy={y - 4 + Math.floor(k / 2) * 8} r={2.2} fill={nmj ? '#3c4fb0' : state?.kind === 'gaba' ? '#8a2d7c' : '#0f6e6a'} />)}
            </g>
          );
        })}
      </Struct>
      <Struct id="premembrane" sel={sel} onSel={onSel} isolate={isolate}>
        <rect className="hit" x={40} y={174} width={480} height={8} fill="#c98a5a" />
        {[120, 260, 400].map((x) => <rect key={x} x={x} y={170} width={16} height={16} rx={3} fill={caOpen ? '#e0b000' : '#7a6a3a'} stroke="#5a4a1a"><title>Spannungsabhängiger Ca²⁺-Kanal {caOpen ? '(offen)' : '(geschlossen)'}</title></rect>)}
      </Struct>
      <Struct id="cleft" sel={sel} onSel={onSel} isolate={isolate}>
        <rect className="hit" x={40} y={184} width={480} height={50} fill={nmj ? 'rgba(160,160,200,0.15)' : 'rgba(120,160,160,0.08)'} />
        {nmj && <path d="M40,212 C140,205 240,220 340,210 C420,204 470,216 520,210" fill="none" stroke="#9aa0c8" strokeWidth={3} strokeDasharray="6 4"><title>Synaptische Basallamina mit Acetylcholinesterase</title></path>}
        {Array.from({ length: tDots }).map((_, i) => <circle key={i} cx={60 + rng(i + 1) * 440} cy={190 + rng(i + 7) * 40} r={2.6} fill={nmj ? '#3c4fb0' : state?.kind === 'gaba' ? '#8a2d7c' : '#0f6e6a'} />)}
      </Struct>
      {Array.from({ length: caDots }).map((_, i) => <circle key={`ca${i}`} cx={110 + rng(i + 3) * 320} cy={150 + rng(i + 11) * 20} r={3} fill="#e0b000" stroke="#7a5a00" strokeWidth={0.6}><title>Ca²⁺</title></circle>)}
      <Struct id="postmembrane" sel={sel} onSel={onSel} isolate={isolate}>
        <path className="hit" d={nmj ? 'M40,240 L100,240 L100,262 L140,262 L140,240 L220,240 L220,262 L260,262 L260,240 L340,240 L340,262 L380,262 L380,240 L520,240 L520,250 L40,250 Z' : 'M40,240 L520,240 L520,250 L40,250 Z'} fill="#9fbfb9" stroke="#5a8c84" strokeWidth={1.5} />
        <rect x={40} y={250} width={480} height={60} fill={postDepol > 0 ? `rgba(15,110,106,${0.08 + postDepol * 0.35})` : `rgba(140,45,124,${0.08 - postDepol * 0.3})`} />
      </Struct>
      <Struct id="receptor" sel={sel} onSel={onSel} isolate={isolate}>
        {[90, 170, 250, 330, 410, 470].map((x, i) => {
          const active = state ? i < Math.round(state.R * 6) : false;
          return (
            <g key={x}>
              <rect className="hit" x={x} y={232} width={18} height={26} rx={4} fill={active ? (state?.kind === 'gaba' ? '#8a2d7c' : '#0f6e6a') : '#cfdcd9'} stroke="#3d6f68" strokeWidth={1.5} />
              <rect x={x + 7} y={234} width={4} height={22} fill={active ? '#fff' : '#9fb3ae'} />
            </g>
          );
        })}
      </Struct>
      {labels && (
        <g aria-hidden="true">
          <text className="lbl" x={90} y={40}>{nmj ? 'Motorische Nervenendigung' : 'Präsynaptische Endigung'}</text>
          <text className="lbl" x={470} y={206} textAnchor="middle">Spalt</text>
          <text className="lbl" x={470} y={292} textAnchor="middle">{nmj ? 'Endplattenmembran (Muskelfaser)' : 'Postsynaptische Zelle'}</text>
          <text className="lbl" x={280} y={274} textAnchor="middle">{nmj ? 'nikotinische ACh-Rezeptoren' : 'Rezeptoren'}</text>
        </g>
      )}
      {state && (
        <g aria-hidden="true" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>
          <text x={50} y={300} className="lbl">V_post = {state.V.toFixed(1)} mV</text>
          <text x={380} y={45} className="lbl">V_prä = {state.vPre.toFixed(0)} mV</text>
        </g>
      )}
      {markers?.map((m) => {
        const p = SYN_MARK[m.structure];
        return p ? (
          <g key={m.n} aria-hidden="true">
            <circle cx={p[0]} cy={p[1]} r={13} fill="var(--ink)" />
            <text x={p[0]} y={p[1] + 5} textAnchor="middle" fill="var(--bg)" style={{ fontSize: 14, fontWeight: 700 }}>{m.n}</text>
          </g>
        ) : null;
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Membranfleck mit Ionenkanälen (Aktionspotenzial)
// ---------------------------------------------------------------------------

export function ChannelPatch({ V, m, h, n, INa, IK }: { V: number; m: number; h: number; n: number; INa: number; IK: number }) {
  const naOpen = m ** 3 * h;
  const kOpen = n ** 4;
  const naArrow = Math.min(1, Math.abs(INa) / 600);
  const kArrow = Math.min(1, Math.abs(IK) / 400);
  const inside = V > 0 ? 'positiv' : 'negativ';
  const head = (y: number, up: boolean, x: number, c: string, s: number) => s > 0.02 ? (
    <g opacity={0.35 + s * 0.65}>
      <line x1={x} x2={x} y1={up ? y + 40 : y - 40} y2={y} stroke={c} strokeWidth={3 + s * 6} />
      <path d={up ? `M${x - 10},${y + 4} L${x},${y - 12} L${x + 10},${y + 4} Z` : `M${x - 10},${y - 4} L${x},${y + 12} L${x + 10},${y - 4} Z`} fill={c} />
    </g>
  ) : null;
  return (
    <svg viewBox="0 0 560 250" role="img" aria-label={`Membranfleck: Membranpotenzial ${V.toFixed(1)} mV. Na⁺-Kanäle zu ${(naOpen * 100).toFixed(0)} % offen, Inaktivierungstor zu ${(h * 100).toFixed(0)} % offen; K⁺-Kanäle zu ${(kOpen * 100).toFixed(0)} % offen.`}>
      <text x={14} y={22} className="lbl" style={{ fontSize: 12 }}>Extrazellulär (außen)</text>
      <text x={14} y={240} className="lbl" style={{ fontSize: 12 }}>Intrazellulär (innen) – Innenseite {inside}</text>
      <rect x={0} y={95} width={560} height={60} fill="#efe3c6" />
      {Array.from({ length: 28 }).map((_, i) => (
        <g key={i}>
          <circle cx={10 + i * 20} cy={100} r={6} fill="#d39a60" />
          <circle cx={10 + i * 20} cy={150} r={6} fill="#d39a60" />
        </g>
      ))}
      {/* Na-Kanal */}
      <g transform="translate(140,0)">
        <rect x={-30} y={80} width={20} height={90} rx={6} fill="#2b7fa8" />
        <rect x={10} y={80} width={20} height={90} rx={6} fill="#2b7fa8" />
        <rect x={-10} y={88} width={20} height={6} fill="#1d5370" opacity={1 - m} />
        <circle cx={0} cy={175} r={9} fill="#1d5370" opacity={1 - h} />
        <text x={0} y={70} textAnchor="middle" className="lbl" style={{ fontSize: 12 }}>Na⁺-Kanal</text>
        <text x={0} y={200} textAnchor="middle" style={{ fontSize: 10, fontFamily: 'var(--mono)' }} fill="var(--ink-2)">m={m.toFixed(2)} h={h.toFixed(2)}</text>
        {head(110, false, 0, '#2b7fa8', naArrow)}
      </g>
      {/* K-Kanal */}
      <g transform="translate(400,0)">
        <rect x={-30} y={80} width={20} height={90} rx={6} fill="#b04a1e" />
        <rect x={10} y={80} width={20} height={90} rx={6} fill="#b04a1e" />
        <rect x={-10} y={156} width={20} height={6} fill="#6e2a0e" opacity={1 - n ** 4} />
        <text x={0} y={70} textAnchor="middle" className="lbl" style={{ fontSize: 12 }}>K⁺-Kanal</text>
        <text x={0} y={200} textAnchor="middle" style={{ fontSize: 10, fontFamily: 'var(--mono)' }} fill="var(--ink-2)">n={n.toFixed(2)}</text>
        {head(130, true, 0, '#b04a1e', kArrow)}
      </g>
      <g style={{ fontSize: 12 }}>
        <text x={210} y={52} className="lbl">Na⁺ {naArrow > 0.02 ? 'strömt ein ↓' : ''}</text>
        <text x={440} y={52} className="lbl">K⁺ {kArrow > 0.02 ? 'strömt aus ↑' : ''}</text>
        <text x={280} y={130} textAnchor="middle" style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700 }} fill="var(--ink)">V_m = {V.toFixed(1)} mV</text>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Axon-Farbstreifen (Erregungsleitung)
// ---------------------------------------------------------------------------

export function vColor(v: number) {
  const f = Math.max(0, Math.min(1, (v + 80) / 120));
  const r = Math.round(30 + f * 210);
  const g = Math.round(60 + (1 - Math.abs(f - 0.5) * 2) * 120);
  const b = Math.round(160 - f * 130);
  return `rgb(${r},${g},${b})`;
}

export function AxonStrip({ V, active, damaged, spacing, probes }: { V: number[]; active: number[]; damaged: number[]; spacing: number; probes?: number[] }) {
  const n = V.length;
  const w = 820 / n;
  return (
    <svg viewBox="0 0 860 120" role="img" aria-label="Axon: Farbe zeigt das lokale Membranpotenzial (blau = Ruhe, rot = erregt)">
      {V.map((v, i) => {
        const node = active[i] === 1;
        const seg = Math.floor(i / (spacing + 1));
        const dmg = !node && damaged.includes(seg);
        return (
          <g key={i}>
            <rect x={20 + i * w} y={node ? 46 : 36} width={w + 0.5} height={node ? 28 : 48} fill={vColor(v)} />
            {!node && !dmg && active.some((a) => a === 0) && <rect x={20 + i * w} y={30} width={w + 0.5} height={6} fill="#f6efd8" />}
            {!node && !dmg && active.some((a) => a === 0) && <rect x={20 + i * w} y={84} width={w + 0.5} height={6} fill="#f6efd8" />}
            {dmg && <rect x={20 + i * w} y={30} width={w + 0.5} height={60} fill="none" stroke="#b3261e" strokeDasharray="2 2" />}
          </g>
        );
      })}
      {probes?.map((p, k) => <g key={p}><line x1={20 + (p + 0.5) * w} x2={20 + (p + 0.5) * w} y1={92} y2={104} stroke="var(--ink)" strokeWidth={2} /><text x={20 + (p + 0.5) * w} y={116} textAnchor="middle" style={{ fontSize: 11 }} fill="var(--ink-2)">{['vorne', 'Mitte', 'hinten'][k]}</text></g>)}
      <text x={20} y={20} style={{ fontSize: 11 }} fill="var(--ink-2)">Reizort →</text>
      <g transform="translate(640,6)">
        {[-80, -40, 0, 40].map((v, i) => <rect key={v} x={i * 40} y={0} width={40} height={10} fill={vColor(v)} />)}
        <text x={0} y={22} style={{ fontSize: 10 }} fill="var(--ink-2)">−80</text>
        <text x={150} y={22} style={{ fontSize: 10 }} fill="var(--ink-2)" textAnchor="end">+40 mV</text>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Muskel: Makro-, Mikro- und Mechanismusebene
// ---------------------------------------------------------------------------

export function SarcomereFigure({ force, sel, onSel, isolate }: { force: number; sel: string | null; onSel?: (id: string) => void; isolate?: boolean }) {
  const shorten = Math.min(1, force) * 40; // Verkürzung (Darstellung)
  const half = 260 - shorten;
  const cx = 300;
  return (
    <svg viewBox="0 0 600 220" role="group" aria-label={`Sarkomer, aktuelle relative Kraft ${(force * 100).toFixed(0)} %`}>
      <Struct id="zdisc" sel={sel} onSel={onSel} isolate={isolate}>
        <rect className="hit" x={cx - half - 6} y={30} width={12} height={160} fill="#555" />
        <rect className="hit" x={cx + half - 6} y={30} width={12} height={160} fill="#555" />
      </Struct>
      <Struct id="actin" sel={sel} onSel={onSel} isolate={isolate}>
        {[50, 90, 130, 170].map((y) => (
          <g key={y}>
            <rect className="hit" x={cx - half} y={y - 3} width={180} height={6} fill="#c0504d" rx={3} />
            <rect className="hit" x={cx + half - 180} y={y - 3} width={180} height={6} fill="#c0504d" rx={3} />
          </g>
        ))}
      </Struct>
      <Struct id="myosin" sel={sel} onSel={onSel} isolate={isolate}>
        {[70, 110, 150].map((y) => (
          <g key={y}>
            <rect className="hit" x={cx - 130} y={y - 6} width={260} height={12} fill="#4f6fa8" rx={6} />
            {Array.from({ length: 12 }).map((_, i) => {
              const x = cx - 120 + i * 22;
              const dirn = x < cx ? -1 : 1;
              return <line key={i} x1={x} y1={y - 6} x2={x + dirn * 8} y2={y - 14 - force * 3} stroke="#4f6fa8" strokeWidth={3} strokeLinecap="round" />;
            })}
          </g>
        ))}
      </Struct>
      <text x={cx} y={210} textAnchor="middle" className="lbl">Sarkomer: Z-Scheibe – Aktin (rot) – Myosin (blau) – Aktin – Z-Scheibe</text>
      <text x={cx} y={20} textAnchor="middle" style={{ fontSize: 11 }} fill="var(--ink-2)">Die Filamente gleiten aneinander vorbei; ihre Länge bleibt gleich.</text>
    </svg>
  );
}

export function MechanismFigure({ ca, act, atp, attached }: { ca: number; act: number; atp: number; attached: number }) {
  const shift = act * 16;
  const rigor = atp < 0.05 && attached > 0.05;
  return (
    <svg viewBox="0 0 600 240" role="img" aria-label={`Regulation am dünnen Filament: Ca²⁺ ${ca.toFixed(2)} µmol/l, freigegebene Bindungsstellen ${(act * 100).toFixed(0)} %, gebundene Querbrücken ${(attached * 100).toFixed(0)} %.${rigor ? ' Rigor: ohne ATP keine Ablösung.' : ''}`}>
      <text x={20} y={22} className="lbl">Dünnes Filament</text>
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={40 + i * 38} cy={70} r={16} fill="#e6a09d" stroke="#c0504d" />)}
      {Array.from({ length: 14 }).map((_, i) => <circle key={`b${i}`} cx={40 + i * 38} cy={84} r={4} fill={act > 0.5 ? '#1e6b35' : '#888'}><title>Myosin-Bindungsstelle {act > 0.5 ? 'frei' : 'verdeckt'}</title></circle>)}
      <path d={`M20,${84 - shift} C150,${78 - shift} 300,${90 - shift} 580,${82 - shift}`} stroke="#7a5a00" strokeWidth={6} fill="none" opacity={0.9}><title>Tropomyosin</title></path>
      {[2, 6, 10].map((i) => (
        <g key={i} transform={`translate(${40 + i * 38},${50 - shift / 2})`}>
          <rect x={-12} y={-10} width={24} height={18} rx={5} fill="#a0732a" />
          <text x={0} y={3} textAnchor="middle" style={{ fontSize: 9 }} fill="#fff">Tn</text>
          {ca > 1 && <circle cx={12} cy={-10} r={5} fill="#e0b000" stroke="#7a5a00"><title>Ca²⁺ an Troponin C</title></circle>}
        </g>
      ))}
      <rect x={20} y={170} width={560} height={16} rx={8} fill="#4f6fa8" />
      <text x={20} y={210} className="lbl">Dickes Filament (Myosin)</text>
      {Array.from({ length: 7 }).map((_, i) => {
        const bound = i < Math.round(attached * 7 * 1.6);
        const x = 60 + i * 76;
        return (
          <g key={i}>
            <line x1={x} y1={170} x2={bound ? x + 8 : x - 6} y2={bound ? 92 : 130} stroke={rigor && bound ? '#8a2d7c' : '#4f6fa8'} strokeWidth={6} strokeLinecap="round" />
            <circle cx={bound ? x + 8 : x - 6} cy={bound ? 92 : 128} r={9} fill={rigor && bound ? '#8a2d7c' : '#6d8cc4'} />
            {!bound && atp > 0.05 && <text x={x + 6} y={150} style={{ fontSize: 9 }} fill="var(--ink-2)">ADP·Pᵢ</text>}
          </g>
        );
      })}
      <text x={590} y={22} textAnchor="end" style={{ fontSize: 11, fontFamily: 'var(--mono)' }} fill="var(--ink-2)">[Ca²⁺] = {ca.toFixed(2)} µM · ATP = {atp.toFixed(1)} mM</text>
      {rigor && <text x={300} y={232} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} fill="#8a2d7c">Rigor: Ohne ATP lösen sich die Myosinköpfe nicht.</text>}
    </svg>
  );
}

export function MuscleMacro() {
  return (
    <svg viewBox="0 0 600 200" role="img" aria-label="Makroebene: Skelettmuskel, Faszikel, Muskelfaser, Myofibrille">
      <path d="M30,100 C80,30 220,30 280,100 C220,170 80,170 30,100 Z" fill="#c96a5a" stroke="#8a3a2a" strokeWidth={2} />
      <text x={150} y={190} textAnchor="middle" className="lbl">Muskel</text>
      <path d="M280,100 L330,70 M280,100 L330,130" stroke="var(--ink-3)" strokeDasharray="3 3" />
      {[70, 90, 110, 130].map((y) => <rect key={y} x={340} y={y - 8} width={120} height={14} rx={7} fill="#d9837a" stroke="#8a3a2a" />)}
      <text x={400} y={190} textAnchor="middle" className="lbl">Muskelfasern</text>
      <path d="M460,100 L500,80 M460,100 L500,120" stroke="var(--ink-3)" strokeDasharray="3 3" />
      <rect x={505} y={80} width={80} height={40} rx={8} fill="#f0b3aa" stroke="#8a3a2a" />
      {Array.from({ length: 5 }).map((_, i) => <line key={i} x1={515 + i * 15} x2={515 + i * 15} y1={82} y2={118} stroke="#8a3a2a" />)}
      <text x={545} y={190} textAnchor="middle" className="lbl">Myofibrille</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 2D-Ersatzdarstellungen ohne WebGL
// ---------------------------------------------------------------------------

export function Membrane2D({ sel, onSel }: { sel: string | null; onSel: (id: string) => void }) {
  return (
    <div className="figure">
      <svg viewBox="0 0 600 220" role="group" aria-label="Zellmembran (2D-Darstellung)">
        <text x={10} y={18} className="lbl">Extrazellulärraum</text>
        <text x={10} y={212} className="lbl">Intrazellulärraum</text>
        <Struct id="mem-head" sel={sel} onSel={onSel} label="Hydrophile Kopfgruppen">
          {Array.from({ length: 30 }).map((_, i) => <g key={i}><circle className="hit" cx={10 + i * 20} cy={70} r={8} fill="#d39a60" /><circle className="hit" cx={10 + i * 20} cy={150} r={8} fill="#d39a60" /></g>)}
        </Struct>
        <Struct id="mem-tail" sel={sel} onSel={onSel} label="Hydrophobe Fettsäurereste">
          {Array.from({ length: 30 }).map((_, i) => <g key={i}><path className="hit" d={`M${7 + i * 20},78 L${7 + i * 20},108 M${13 + i * 20},78 L${13 + i * 20},108 M${7 + i * 20},112 L${7 + i * 20},142 M${13 + i * 20},112 L${13 + i * 20},142`} stroke="#bfa36a" strokeWidth={3} /></g>)}
        </Struct>
        {[['ch-na', 150, '#2b7fa8', 'Na⁺-Kanal'], ['ch-k', 300, '#b04a1e', 'K⁺-Kanal'], ['pump', 450, '#1e6b35', 'Na⁺/K⁺-ATPase']].map(([id, x, c, l]) => (
          <Struct key={id as string} id={id as string} sel={sel} onSel={onSel} label={l as string}>
            <rect className="hit" x={(x as number) - 22} y={52} width={44} height={116} rx={10} fill={c as string} opacity={0.9} />
            <text x={x as number} y={44} textAnchor="middle" className="lbl">{l}</text>
          </Struct>
        ))}
      </svg>
    </div>
  );
}

export function useToggle(init = false): [boolean, () => void] {
  const [v, s] = useState(init);
  return [v, () => s((x) => !x)];
}
