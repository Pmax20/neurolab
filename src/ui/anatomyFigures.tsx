import type { ReactNode } from 'react';
import type { AnatomyFigure } from '../content/types';

// Schematische Anatomie-Abbildungen (keine maßstabsgetreuen Atlaszeichnungen).
// Jede Abbildung: anklickbare Strukturen, optionale Beschriftung mit Hinweislinien, nummerierte Markierungen
// für Beschriftungsaufgaben und zwei Hervorhebungsfarben für den Orientierungsmodus.

import { A, Overlay, type FigProps, type Label } from './anatomyBase';
import { SPINAL_LABELS, HEART_LABELS, VESSEL_LABELS, SPINE_LABELS, TRUNK_LABELS, UPPER_LABELS, LOWER_LABELS, KNEE_LABELS, SpinalFigure, HeartFigure, VesselFigure, SpineFigure, TrunkFigure, UpperLimbFigure, LowerLimbFigure, KneeFigure } from './anatomyFigures2';
export { SPINAL_LABELS, HEART_LABELS, VESSEL_LABELS, SPINE_LABELS, TRUNK_LABELS, UPPER_LABELS, LOWER_LABELS, KNEE_LABELS, HeartFigure, UpperLimbFigure, LowerLimbFigure };
export type { FigProps };

const BONE = '#efe2c4', BONE_S = '#a8916a', CART = '#cfe1ee', CART_S = '#6f9cbd', MUSC = '#c9574f', TEND = '#efe6d2';

function Defs() {
  return (
    <defs>
      <pattern id="an-spong" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#e9c9a8" />
        <path d="M0,7 Q3.5,1 7,7 T14,7 M7,0 Q1,3.5 7,7 T7,14" stroke="#c9a77a" strokeWidth="2.2" fill="none" />
      </pattern>
    </defs>
  );
}

// ===========================================================================
// Röhrenknochen (wachsend, Längsschnitt)
// ===========================================================================

export const BONE_LABELS: Record<string, Label> = {
  'a-epiphyse': { a: [250, 78], t: [70, 70] },
  'a-epiphysenfuge': { a: [218, 136], t: [70, 128] },
  'a-metaphyse': { a: [228, 158], t: [70, 172] },
  'a-diaphyse': { a: [196, 280], t: [70, 280] },
  'a-gelenkknorpel': { a: [300, 30], t: [440, 30] },
  'a-kompakta': { a: [286, 240], t: [440, 220] },
  'a-markhoehle': { a: [262, 300], t: [440, 290] },
  'a-periost': { a: [299, 350], t: [440, 350] },
  'a-spongiosa': { a: [280, 470], t: [440, 470] },
};

export function BoneFigure(p: FigProps) {
  const head = 'M190,130 C178,90 196,30 260,22 C324,30 342,90 330,130 Z';
  const foot = 'M192,432 C176,470 186,525 260,532 C334,525 344,470 328,432 Z';
  return (
    <svg viewBox="-60 0 620 560" role="img" aria-label="Schema eines wachsenden Röhrenknochens im Längsschnitt">
      <Defs />
      {/* Diaphyse: Klammer links */}
      <A id="a-diaphyse" p={p}><rect className="hit" x={176} y={176} width={30} height={208} fill="transparent" stroke="transparent" /><path d="M204,178 L196,178 L196,382 L204,382" fill="none" stroke="#6b6680" strokeWidth={2.5} /></A>
      {/* Metaphysen */}
      <A id="a-metaphyse" p={p}><path className="hit" d="M196,140 C204,160 222,170 226,180 L294,180 C298,170 316,160 324,140 Z" fill="#ead2b4" stroke={BONE_S} /><path className="hit" d="M226,380 L294,380 C298,392 316,402 324,422 L196,422 C204,402 222,392 226,380 Z" fill="#ead2b4" stroke={BONE_S} /></A>
      {/* Epiphysenfugen */}
      <A id="a-epiphysenfuge" p={p}><path className="hit" d="M190,128 L330,128 L326,142 L194,142 Z" fill={CART} stroke={CART_S} /><path className="hit" d="M196,420 L324,420 L328,434 L192,434 Z" fill={CART} stroke={CART_S} /></A>
      {/* proximale Epiphyse (Spongiosa) */}
      <A id="a-epiphyse" p={p}><path className="hit" d={head} fill="url(#an-spong)" stroke={BONE_S} strokeWidth={2} /></A>
      {/* distale Epiphyse als Beispiel für Spongiosa */}
      <A id="a-spongiosa" p={p}><path className="hit" d={foot} fill="url(#an-spong)" stroke={BONE_S} strokeWidth={2} /></A>
      {/* Gelenkknorpel */}
      <A id="a-gelenkknorpel" p={p}><path className="hit" d="M200,62 C214,32 236,20 260,18 C284,20 306,32 320,62 L312,66 C300,42 282,30 260,29 C238,30 220,42 208,66 Z" fill={CART} stroke={CART_S} /><path className="hit" d="M206,500 C222,526 240,532 260,534 C280,532 298,526 314,500 L322,504 C306,534 284,542 260,543 C236,542 214,534 198,504 Z" fill={CART} stroke={CART_S} /></A>
      {/* Kompakta (Schaftwand) */}
      <A id="a-kompakta" p={p}><path className="hit" d="M226,180 L246,180 L246,380 L226,380 Z M274,180 L294,180 L294,380 L274,380 Z" fill={BONE} stroke={BONE_S} /></A>
      {/* Markhöhle */}
      <A id="a-markhoehle" p={p}><rect className="hit" x={246} y={182} width={28} height={196} fill="#f3d98b" stroke="#c9a94e" /></A>
      {/* Periost */}
      <A id="a-periost" p={p}><path className="hit" d="M222,182 L222,378 M298,182 L298,378" fill="none" stroke="#b5475a" strokeWidth={4} /></A>
      <text x={260} y={556} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--ink-3)" aria-hidden="true">Schema, nicht maßstäblich · beim Erwachsenen ist die Fuge verknöchert</text>
      <Overlay L={BONE_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Echtes Gelenk (Schema)
// ===========================================================================

export const JOINT_LABELS: Record<string, Label> = {
  'a-epiphyse': { a: [260, 60], t: [440, 40] },
  'a-periost': { a: [330, 30], t: [440, 90] },
  'g-membrana-fibrosa': { a: [394, 180], t: [450, 170] },
  'g-membrana-synovialis': { a: [372, 200], t: [450, 220] },
  'g-gelenkhoehle': { a: [356, 230], t: [450, 268] },
  'a-gelenkknorpel': { a: [300, 196], t: [450, 320] },
  'g-ligament': { a: [99, 190], t: [40, 190] },
};

export function JointFigure(p: FigProps) {
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Schema eines echten Gelenks mit Gelenkkapsel, Gelenkhöhle und Gelenkknorpel">
      <Defs />
      <A id="g-gelenkhoehle" p={p}><path className="hit" d="M190,104 C140,116 136,236 160,252 L360,252 C384,236 380,116 330,104 Z" fill="#fbf0c0" stroke="#d8c374" /></A>
      <A id="a-epiphyse" p={p}>
        <path className="hit" d="M190,0 L190,140 A70,70 0 0 0 330,140 L330,0 Z" fill="url(#an-spong)" stroke={BONE_S} strokeWidth={2} />
        <path className="hit" d="M160,420 L160,200 L187.6,200 A94,94 0 0 0 332.4,200 L360,200 L360,420 Z" fill="url(#an-spong)" stroke={BONE_S} strokeWidth={2} />
      </A>
      <A id="a-gelenkknorpel" p={p}>
        <path className="hit" d="M190,140 A70,70 0 0 0 330,140 L318,140 A58,58 0 0 1 202,140 Z" fill={CART} stroke={CART_S} />
        <path className="hit" d="M187.6,200 A94,94 0 0 0 332.4,200 L315.9,200 A82,82 0 0 1 204.1,200 Z" fill={CART} stroke={CART_S} />
      </A>
      <A id="a-periost" p={p}><path className="hit" d="M188,0 L188,78 M332,0 L332,78 M158,284 L158,420 M362,284 L362,420" fill="none" stroke="#b5475a" strokeWidth={4} /></A>
      <A id="g-membrana-synovialis" p={p}><path className="hit" d="M190,104 C140,116 136,236 160,252 M330,104 C380,116 384,236 360,252" fill="none" stroke="#d9789a" strokeWidth={5} /></A>
      <A id="g-membrana-fibrosa" p={p}><path className="hit" d="M190,80 C122,96 114,254 160,282 M330,80 C398,96 406,254 360,282" fill="none" stroke="#c8a27c" strokeWidth={11} /></A>
      <A id="g-ligament" p={p}><path className="hit" d="M188,34 C90,64 82,300 158,340" fill="none" stroke="#d9c08f" strokeWidth={15} strokeLinecap="round" /><path d="M188,34 C90,64 82,300 158,340" fill="none" stroke="#b39a66" strokeWidth={1} strokeDasharray="6 5" /></A>
      <Overlay L={JOINT_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Oberarm mit Ellenbogengelenk (Seitenansicht, vorne = rechts)
// ===========================================================================

const E: [number, number] = [210, 300];
function armGeom(deg: number) {
  const t = (deg * Math.PI) / 180;
  const u = [Math.sin(t), Math.cos(t)];
  const n = [Math.cos(t), -Math.sin(t)];
  const P = (along: number, side: number): [number, number] => [E[0] + u[0] * along + n[0] * side, E[1] + u[1] * along + n[1] * side];
  return { P, u, n };
}
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const BI_O: [number, number] = [226, 82], BR_O: [number, number] = [224, 196], TR_O: [number, number] = [194, 112];

export function armState(deg: number) {
  const { P } = armGeom(deg);
  const bi = dist(BI_O, P(36, 12)), br = dist(BR_O, P(30, 2)), tr = dist(TR_O, P(-20, -12));
  const { P: P0 } = armGeom(0);
  return { biceps: bi / dist(BI_O, P0(36, 12)), brachialis: br / dist(BR_O, P0(30, 2)), triceps: tr / dist(TR_O, P0(-20, -12)) };
}

export function armLabels(deg: number): Record<string, Label> {
  const { P } = armGeom(deg);
  const bi = P(36, 12), mid = (a: number[], b: number[]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return {
    'b-scapula': { a: [150, 110], t: [40, 60] },
    'b-humerus': { a: [210, 240], t: [40, 250] },
    'm-triceps': { a: [178, 200], t: [40, 170] },
    'm-biceps': { a: [mid(BI_O, bi)[0] + 26, mid(BI_O, bi)[1]], t: [470, 150] },
    'm-brachialis': { a: [228, 262], t: [470, 225] },
    'm-sehne': { a: [(bi[0] + P(70, 26)[0]) / 2, (bi[1] + P(70, 26)[1]) / 2], t: [470, 280] },
    'b-radius': { a: P(150, 9), t: [470, 345] },
    'b-ulna': { a: P(130, -9), t: [470, 400] },
  };
}

export function ArmFigure(p: FigProps & { deg?: number }) {
  const deg = p.deg ?? 70;
  const { P } = armGeom(deg);
  const st = armState(deg);
  const line = (a: [number, number], b: [number, number]) => `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
  const curve = (o: [number, number], i: [number, number], bulge: number) => {
    const mx = (o[0] + i[0]) / 2, my = (o[1] + i[1]) / 2;
    const dx = i[0] - o[0], dy = i[1] - o[1], L = Math.hypot(dx, dy);
    const nx = -dy / L, ny = dx / L; // senkrecht
    const s = bulge * (nx > 0 ? 1 : -1);
    return `M${o[0]},${o[1]} Q${(mx + nx * s).toFixed(1)},${(my + ny * s).toFixed(1)} ${i[0].toFixed(1)},${i[1].toFixed(1)}`;
  };
  const bi = P(36, 12), biT = P(70, 26);
  const w = (r: number, base: number) => Math.max(base * 0.55, Math.min(base * 1.5, base / Math.pow(r, 1.4)));
  return (
    <svg viewBox="-150 0 830 540" role="img" aria-label={`Seitenansicht des rechten Oberarms, Ellenbogen um ${Math.round(deg)} Grad gebeugt`}>
      <A id="b-scapula" p={p}><path className="hit" d="M120,40 L214,62 L206,124 L146,214 L112,120 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="m-triceps" p={p}><path className="hit" d={curve(TR_O, P(-20, -12), -34)} fill="none" stroke={MUSC} strokeWidth={w(st.triceps, 28)} strokeLinecap="round" opacity={0.92} /></A>
      <A id="b-humerus" p={p}><circle className="hit" cx={210} cy={96} r={20} fill={BONE} stroke={BONE_S} strokeWidth={2} /><rect className="hit" x={199} y={100} width={22} height={196} rx={9} fill={BONE} stroke={BONE_S} strokeWidth={2} /><ellipse cx={210} cy={298} rx={20} ry={13} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="b-ulna" p={p}><path className="hit" d={line(P(-22, -10), P(196, -9))} stroke={BONE_S} strokeWidth={17} strokeLinecap="round" /><path d={line(P(-22, -10), P(196, -9))} stroke={BONE} strokeWidth={13} strokeLinecap="round" /></A>
      <A id="b-radius" p={p}><path className="hit" d={line(P(8, 9), P(204, 10))} stroke={BONE_S} strokeWidth={15} strokeLinecap="round" /><path d={line(P(8, 9), P(204, 10))} stroke="#f6ecd4" strokeWidth={11} strokeLinecap="round" /></A>
      <A id="m-brachialis" p={p}><path className="hit" d={curve(BR_O, P(30, 2), 14)} fill="none" stroke="#a9443e" strokeWidth={w(st.brachialis, 18)} strokeLinecap="round" /></A>
      <A id="m-biceps" p={p}><path className="hit" d={curve(BI_O, biT, 30)} fill="none" stroke={MUSC} strokeWidth={w(st.biceps, 30)} strokeLinecap="round" opacity={0.95} /></A>
      <A id="m-sehne" p={p}><path className="hit" d={line(biT, bi)} stroke="#b9a988" strokeWidth={8} strokeLinecap="round" /><path d={line(biT, bi)} stroke={TEND} strokeWidth={5} strokeLinecap="round" /></A>
      <text x={300} y={532} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--ink-3)" aria-hidden="true">vorne (anterior) ist rechts · Schema, nicht maßstäblich</text>
      <Overlay L={armLabels(deg)} p={p} />
    </svg>
  );
}

// ===========================================================================
// Skelettmuskel im Querschnitt
// ===========================================================================

const FASC: [number, number][] = [[165, 128], [258, 108], [338, 158], [150, 218], [248, 200], [330, 245], [235, 285]];
const FIBERS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) { const x = c * 15 + (r % 2 ? 7.5 : 0), y = r * 13; if (Math.hypot(x, y) < 30) out.push([x, y]); }
  return out;
})();

export const MUSCLEX_LABELS: Record<string, Label> = {
  'm-faszie': { a: [96, 260], t: [40, 300] },
  'm-epimysium': { a: [100, 170], t: [40, 150] },
  'm-perimysium': { a: [368, 140], t: [470, 110] },
  'm-endomysium': { a: [338, 158], t: [470, 190] },
};

export function MuscleXFigure(p: FigProps) {
  return (
    <svg viewBox="-60 0 640 350" role="img" aria-label="Querschnitt durch einen Skelettmuskel mit seinen Bindegewebshüllen">
      <A id="m-faszie" p={p}><ellipse className="hit" cx={245} cy={192} rx={172} ry={140} fill="none" stroke="#8f6e4e" strokeWidth={9} /></A>
      <A id="m-epimysium" p={p}><ellipse className="hit" cx={245} cy={192} rx={156} ry={124} fill="#efdcc8" stroke="#c99f74" strokeWidth={6} /></A>
      <A id="m-perimysium" p={p}>{FASC.map(([x, y], i) => <circle key={i} className="hit" cx={x} cy={y} r={40} fill="#f7ecdf" stroke="#d2ab7e" strokeWidth={4} />)}</A>
      <A id="m-endomysium" p={p}>{FASC.map(([x, y], i) => <g key={i}>{FIBERS.map(([fx, fy], k) => <g key={k}><circle className="hit" cx={x + fx} cy={y + fy} r={6.6} fill="#cf6158" stroke="#fbf3ea" strokeWidth={1.6} /><circle cx={x + fx + 4.2} cy={y + fy - 3} r={1.4} fill="#4a3a8c" /></g>)}</g>)}</A>
      <text x={300} y={344} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--ink-3)" aria-hidden="true">Rot: Muskelfasern (Kerne randständig) · Schema, nicht maßstäblich</text>
      <Overlay L={MUSCLEX_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Körper, Ventralansicht (Skelett vereinfacht) – für Orientierung
// ===========================================================================

export const BODY_LABELS: Record<string, Label> = {
  'k-schaedel': { a: [240, 60], t: [60, 50] },
  'k-clavicula': { a: [196, 126], t: [60, 110] },
  'k-sternum': { a: [260, 190], t: [60, 170] },
  'k-wirbelsaeule': { a: [260, 300], t: [60, 290] },
  'b-humerus': { a: [372, 200], t: [470, 180] },
  'b-radius': { a: [409, 330], t: [470, 300] },
  'b-ulna': { a: [383, 340], t: [470, 360] },
  'k-becken': { a: [208, 350], t: [60, 345] },
  'k-femur': { a: [217, 450], t: [60, 440] },
  'k-patella': { a: [216, 518], t: [60, 510] },
  'k-tibia': { a: [306, 580], t: [470, 575] },
  'k-fibula': { a: [326, 625], t: [470, 640] },
};

export function BodyFigure(p: FigProps & { overlay?: 'none' | 'achsen' | 'ebenen' }) {
  const mirror = (d: ReactNode) => <>{d}<g transform="translate(520,0) scale(-1,1)">{d}</g></>;
  const o = p.overlay ?? 'none';
  return (
    <svg viewBox="-90 0 690 700" role="img" aria-label="Vereinfachtes Skelett in Ventralansicht, anatomische Normalstellung">
      <A id="k-wirbelsaeule" p={p}><path className="hit" d="M260,98 L260,338" stroke="#b8a8d0" strokeWidth={14} strokeDasharray="10 5" fill="none" /></A>
      <g aria-hidden="true" fill="none" stroke="#d8cfe6" strokeWidth={5}>{[150, 170, 190, 210, 230].map((y) => <path key={y} d={`M268,${y - 6} C320,${y - 6} 330,${y + 20} 300,${y + 34} M252,${y - 6} C200,${y - 6} 190,${y + 20} 220,${y + 34}`} />)}</g>
      <A id="k-schaedel" p={p}><ellipse className="hit" cx={260} cy={60} rx={36} ry={44} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="k-sternum" p={p}><rect className="hit" x={251} y={134} width={18} height={100} rx={8} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="k-clavicula" p={p}>{mirror(<path className="hit" d="M250,134 C230,124 200,130 168,120" stroke={BONE_S} strokeWidth={10} strokeLinecap="round" fill="none" />)}</A>
      <A id="b-humerus" p={p}>{mirror(<path className="hit" d="M152,128 L136,262" stroke={BONE_S} strokeWidth={16} strokeLinecap="round" />)}</A>
      <A id="b-ulna" p={p}>{mirror(<path className="hit" d="M141,268 L136,400" stroke={BONE_S} strokeWidth={10} strokeLinecap="round" />)}</A>
      <A id="b-radius" p={p}>{mirror(<path className="hit" d="M125,270 L111,398" stroke={BONE_S} strokeWidth={9} strokeLinecap="round" />)}</A>
      <A id="k-becken" p={p}>{mirror(<path className="hit" d="M254,330 C220,312 186,320 182,346 C184,372 214,386 238,394 L256,384 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} />)}</A>
      <A id="k-femur" p={p}>{mirror(<path className="hit" d="M222,372 L212,512" stroke={BONE_S} strokeWidth={16} strokeLinecap="round" />)}</A>
      <A id="k-tibia" p={p}>{mirror(<path className="hit" d="M214,530 L216,660" stroke={BONE_S} strokeWidth={13} strokeLinecap="round" />)}</A>
      <A id="k-fibula" p={p}>{mirror(<path className="hit" d="M194,536 L192,656" stroke={BONE_S} strokeWidth={6} strokeLinecap="round" />)}</A>
      <A id="k-patella" p={p}>{mirror(<circle className="hit" cx={212} cy={520} r={10} fill={BONE} stroke={BONE_S} strokeWidth={2} />)}</A>
      <g aria-hidden="true" fill="#efe6f5" stroke="#b8a8d0">{mirror(<><ellipse cx={108} cy={420} rx={11} ry={18} /><ellipse cx={212} cy={672} rx={18} ry={9} /></>)}</g>
      {o === 'achsen' && (
        <g aria-hidden="true" style={{ fontSize: 13 }}>
          <path d="M290,16 L290,690" stroke="var(--accent)" strokeWidth={2.5} /><text x={296} y={30} fill="var(--accent)">Longitudinalachse</text>
          <path d="M100,300 L420,300" stroke="var(--eosin)" strokeWidth={2.5} /><text x={330} y={292} fill="var(--eosin)">Transversalachse</text>
          <circle cx={290} cy={300} r={9} fill="none" stroke="#2f8f6a" strokeWidth={3} /><circle cx={290} cy={300} r={2.5} fill="#2f8f6a" /><text x={300} y={322} fill="#2f8f6a">Sagittalachse (zeigt auf dich)</text>
        </g>
      )}
      {o === 'ebenen' && (
        <g aria-hidden="true" style={{ fontSize: 13 }}>
          <rect x={258} y={10} width={4} height={680} fill="var(--accent)" opacity={0.7} /><text x={268} y={24} fill="var(--accent)">Medianebene (Sagittalebene)</text>
          <rect x={60} y={268} width={400} height={4} fill="var(--eosin)" opacity={0.7} /><text x={330} y={262} fill="var(--eosin)">Transversalebene</text>
          <text x={14} y={690} fill="#2f8f6a">Frontalebene = die Bildebene selbst (parallel zur Stirn)</text>
        </g>
      )}
      <Overlay L={BODY_LABELS} p={p} />
    </svg>
  );
}

/** Welche Strukturen eine Abbildung zeigt (für Auswahllisten in Beschriftungsaufgaben). */
export const FIGURE_IDS: Record<AnatomyFigure, string[]> = {
  bone: Object.keys(BONE_LABELS),
  joint: Object.keys(JOINT_LABELS),
  muscle: Object.keys(armLabels(70)),
  'muscle-x': Object.keys(MUSCLEX_LABELS),
  body: Object.keys(BODY_LABELS),
  spinal: Object.keys(SPINAL_LABELS),
  heart: Object.keys(HEART_LABELS),
  vessels: Object.keys(VESSEL_LABELS),
  spine: Object.keys(SPINE_LABELS),
  trunk: Object.keys(TRUNK_LABELS),
  arm: Object.keys(UPPER_LABELS),
  leg: Object.keys(LOWER_LABELS),
  knee: Object.keys(KNEE_LABELS),
};

export function AnatomyFigureView({ figure, ...p }: FigProps & { figure: AnatomyFigure; deg?: number }) {
  switch (figure) {
    case 'bone': return <BoneFigure {...p} />;
    case 'joint': return <JointFigure {...p} />;
    case 'muscle': return <ArmFigure {...p} />;
    case 'muscle-x': return <MuscleXFigure {...p} />;
    case 'body': return <BodyFigure {...p} />;
    case 'spinal': return <SpinalFigure {...p} />;
    case 'heart': return <HeartFigure {...p} />;
    case 'vessels': return <VesselFigure {...p} />;
    case 'spine': return <SpineFigure {...p} />;
    case 'trunk': return <TrunkFigure {...p} />;
    case 'arm': return <UpperLimbFigure {...p} />;
    case 'leg': return <LowerLimbFigure {...p} />;
    case 'knee': return <KneeFigure {...p} />;
  }
}
