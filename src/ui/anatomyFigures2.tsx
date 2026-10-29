import type { ReactNode } from 'react';
import { A, Overlay, type FigProps, type Label } from './anatomyBase';

// Anatomie II/III: Rückenmark, Herz, große Gefäße, Wirbelsäule, Rumpfwand, obere und untere Extremität, Kniegelenk.
// Schemata, nicht maßstäblich. Patientenseite: In Ventralansichten liegt die rechte Körperseite links im Bild.

const BONE = '#efe2c4', BONE_S = '#a8916a', CART = '#cfe1ee', CART_S = '#6f9cbd', MUSC = '#c9574f', TEND = '#efe6d2';
const NERVE = '#d9a514', ART = '#d65f55', VEN = '#5b79bf';
const note = (x: number, y: number, t: string, anchor: 'start' | 'middle' | 'end' = 'middle') => <text x={x} y={y} textAnchor={anchor} style={{ fontSize: 12 }} fill="var(--ink-3)" aria-hidden="true">{t}</text>;
const mirrorX = (cx: number, d: ReactNode) => <g transform={`translate(${2 * cx},0) scale(-1,1)`}>{d}</g>;

// ===========================================================================
// Rückenmark und Spinalnerv (Querschnitt, dorsal oben)
// ===========================================================================

export const SPINAL_LABELS: Record<string, Label> = {
  'n-ramus-posterior': { a: [-28, 150], t: [-80, 80] },
  'n-radix-posterior': { a: [182, 120], t: [-80, 30] },
  'n-spinalganglion': { a: [112, 162], t: [-80, 160] },
  'n-spinalnerv': { a: [40, 212], t: [-80, 222] },
  'n-ramus-anterior': { a: [-30, 284], t: [-80, 300] },
  'n-radix-anterior': { a: [170, 262], t: [-80, 380] },
  'n-hinterhorn': { a: [352, 124], t: [520, 90] },
  'n-weisse-substanz': { a: [410, 175], t: [520, 145] },
  'n-zentralkanal': { a: [300, 212], t: [520, 195] },
  'n-seitenhorn': { a: [350, 216], t: [520, 245] },
  'n-vorderhorn': { a: [362, 278], t: [520, 300] },
  'n-dura': { a: [420, 300], t: [520, 355] },
};

export function SpinalFigure(p: FigProps) {
  const G = '#c9c2d6', GS = '#8f86a6';
  const half = (id: 'n-hinterhorn' | 'n-vorderhorn' | 'n-seitenhorn') => {
    const d = id === 'n-hinterhorn' ? 'M292,198 C290,170 262,140 246,116 C238,110 230,116 234,124 C244,148 258,176 272,204 Z'
      : id === 'n-vorderhorn' ? 'M286,222 C272,226 248,234 232,252 C218,270 224,292 244,292 C266,290 282,268 290,240 Z'
        : 'M272,204 C262,206 248,210 240,216 C250,224 264,226 284,224 Z';
    return <A id={id} p={p}><path className="hit" d={d} fill={G} stroke={GS} />{mirrorX(300, <path className="hit" d={d} fill={G} stroke={GS} />)}</A>;
  };
  const stub = <g aria-hidden="true" fill="none" stroke={NERVE} strokeWidth={6} opacity={0.6}><path d="M238,114 C200,116 170,124 140,146" /><path d="M232,282 C200,276 170,262 140,240" /></g>;
  return (
    <svg viewBox="-240 0 940 420" role="img" aria-label="Schema eines Rückenmarksquerschnitts mit Spinalnerv, dorsal oben">
      <A id="n-dura" p={p}><ellipse className="hit" cx={300} cy={210} rx={170} ry={128} fill="#f7f4fb" stroke="#7b6f99" strokeWidth={5} /></A>
      {mirrorX(300, stub)}
      <A id="n-radix-posterior" p={p}><path className="hit" d="M238,112 C200,114 160,124 132,150" fill="none" stroke={NERVE} strokeWidth={7} strokeLinecap="round" /></A>
      <A id="n-radix-anterior" p={p}><path className="hit" d="M232,282 C190,276 120,262 72,216" fill="none" stroke={NERVE} strokeWidth={7} strokeLinecap="round" /></A>
      <A id="n-spinalganglion" p={p}><ellipse className="hit" cx={116} cy={163} rx={28} ry={17} transform="rotate(-38 116 163)" fill="#f2d27a" stroke="#b8901c" strokeWidth={2} /><path d="M98,178 C88,190 80,200 72,210" fill="none" stroke={NERVE} strokeWidth={7} /></A>
      <A id="n-spinalnerv" p={p}><path className="hit" d="M74,212 L18,212" stroke={NERVE} strokeWidth={13} strokeLinecap="round" /></A>
      <A id="n-ramus-posterior" p={p}><path className="hit" d="M22,208 C10,190 -10,165 -40,138" fill="none" stroke={NERVE} strokeWidth={8} strokeLinecap="round" /></A>
      <A id="n-ramus-anterior" p={p}><path className="hit" d="M22,216 C10,240 -15,275 -50,305" fill="none" stroke={NERVE} strokeWidth={10} strokeLinecap="round" /></A>
      <A id="n-weisse-substanz" p={p}><ellipse className="hit" cx={300} cy={205} rx={135} ry={100} fill="#fbf8f0" stroke="#c9c2b0" strokeWidth={2} /></A>
      <rect x={280} y={200} width={40} height={26} fill={G} aria-hidden="true" />
      {half('n-hinterhorn')}{half('n-vorderhorn')}{half('n-seitenhorn')}
      <A id="n-zentralkanal" p={p}><circle className="hit" cx={300} cy={212} r={6} fill="#fff" stroke={GS} strokeWidth={2} /></A>
      {note(300, 60, 'dorsal (hinten)')}{note(300, 368, 'ventral (vorne)')}{note(300, 412, 'Schema, nicht maßstäblich · Seitenhorn nur im Brust- und oberen Lendenmark')}
      <Overlay L={SPINAL_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Herz (Frontalschnitt, Ansicht von vorne)
// ===========================================================================

export const HEART_LABELS: Record<string, Label> = {
  'c-vena-cava-sup': { a: [160, 40], t: [-30, 30] },
  'c-sinusknoten': { a: [168, 182], t: [-30, 95] },
  'c-rechter-vorhof': { a: [140, 240], t: [-30, 165] },
  'c-av-knoten': { a: [232, 292], t: [-30, 230] },
  'c-pulmonalklappe': { a: [238, 306], t: [-30, 275] },
  'c-trikuspidal': { a: [150, 318], t: [-30, 320] },
  'c-rechter-ventrikel': { a: [180, 380], t: [-30, 375] },
  'c-his': { a: [268, 430], t: [-30, 440] },
  'c-vena-cava-inf': { a: [80, 500], t: [-30, 505] },
  'c-aorta': { a: [470, 64], t: [640, 40] },
  'c-truncus-pulmonalis': { a: [400, 121], t: [640, 95] },
  'c-aortenklappe': { a: [330, 306], t: [640, 150] },
  'c-venae-pulmonales': { a: [590, 200], t: [640, 205] },
  'c-linker-vorhof': { a: [440, 250], t: [640, 255] },
  'c-mitral': { a: [440, 318], t: [640, 315] },
  'c-septum': { a: [285, 380], t: [640, 375] },
  'c-linker-ventrikel': { a: [420, 420], t: [640, 440] },
};

export function HeartFigure(p: FigProps) {
  const leaflet = (d: string) => <path d={d} stroke="#f6efe2" strokeWidth={6} strokeLinecap="round" fill="none" />;
  const cusps = (x: number, y: number) => <path d={`M${x - 14},${y} q7,11 14,0 q7,11 14,0`} stroke="#f6efe2" strokeWidth={3.5} fill="none" />;
  return (
    <svg viewBox="-260 0 1120 580" role="img" aria-label="Schematischer Frontalschnitt durch das Herz mit Klappen und Erregungsleitungssystem">
      {/* Gefäße hinter dem Herzen */}
      <rect x={230} y={196} width={115} height={104} fill="#b9524b" aria-hidden="true" />
      <A id="c-vena-cava-inf" p={p}><path className="hit" d="M80,550 L80,330 C80,302 96,292 118,284" stroke={VEN} strokeWidth={28} fill="none" /></A>
      <A id="c-venae-pulmonales" p={p}><path className="hit" d="M610,200 L470,215 M610,262 L470,262" stroke="#e08d84" strokeWidth={16} fill="none" /></A>
      <A id="c-truncus-pulmonalis" p={p}><path className="hit" d="M243,318 L243,150 C243,128 200,125 110,125 M243,150 C243,128 330,120 480,122" stroke="#6d8fd0" strokeWidth={24} fill="none" strokeLinejoin="round" /></A>
      <A id="c-aorta" p={p}><path className="hit" d="M322,318 L322,110 C322,58 390,48 440,58 C510,72 540,110 540,160 L540,400" stroke={ART} strokeWidth={30} fill="none" /></A>
      <A id="c-vena-cava-sup" p={p}><path className="hit" d="M160,18 L160,182" stroke={VEN} strokeWidth={26} /></A>
      {/* Herzwand */}
      <g aria-hidden="true">
        <path d="M100,298 L480,298 C500,385 460,470 365,540 C280,505 175,455 112,370 C104,345 100,322 100,298 Z" fill={MUSC} />
        <rect x={100} y={165} width={130} height={136} rx={18} fill="#d77d74" />
        <rect x={345} y={165} width={130} height={136} rx={18} fill="#d77d74" />
      </g>
      <A id="c-rechter-vorhof" p={p}><rect className="hit" x={112} y={178} width={106} height={110} rx={14} fill="#b9c9e6" /></A>
      <A id="c-linker-vorhof" p={p}><rect className="hit" x={357} y={178} width={106} height={110} rx={14} fill="#f1bcb4" /></A>
      <A id="c-rechter-ventrikel" p={p}><path className="hit" d="M114,310 L256,310 L262,452 C200,425 140,375 114,310 Z" fill="#b9c9e6" /></A>
      <A id="c-linker-ventrikel" p={p}><path className="hit" d="M312,310 L462,310 C475,375 448,450 365,515 C338,492 320,474 306,456 Z" fill="#f1bcb4" /></A>
      <A id="c-septum" p={p}><path className="hit" d="M258,304 L308,304 L304,456 C292,466 274,466 262,456 Z" fill="#a8433d" /></A>
      <A id="c-trikuspidal" p={p}><rect className="hit" x={120} y={290} width={110} height={22} fill="transparent" />{leaflet('M135,298 L160,342')}{leaflet('M214,298 L192,342')}
        <path d="M160,342 L182,392 M192,342 L184,392" stroke="#f6efe2" strokeWidth={1.5} /><ellipse cx={184} cy={402} rx={12} ry={16} fill="#a8433d" /></A>
      <A id="c-mitral" p={p}><rect className="hit" x={360} y={290} width={110} height={22} fill="transparent" />{leaflet('M366,298 L392,338')}{leaflet('M456,298 L428,338')}
        <path d="M392,338 L408,392 M428,338 L414,392" stroke="#f6efe2" strokeWidth={1.5} /><ellipse cx={411} cy={402} rx={13} ry={18} fill="#a8433d" /></A>
      <A id="c-pulmonalklappe" p={p}><rect className="hit" x={226} y={294} width={34} height={22} fill="#6d8fd0" />{cusps(236, 300)}</A>
      <A id="c-aortenklappe" p={p}><rect className="hit" x={305} y={294} width={34} height={22} fill={ART} />{cusps(315, 300)}</A>
      {/* Erregungsbildung und -leitung */}
      <path d="M180,186 C200,220 220,260 232,288" stroke="#f2c94c" strokeWidth={2} strokeDasharray="4 4" fill="none" aria-hidden="true" />
      <A id="c-sinusknoten" p={p}><ellipse className="hit" cx={172} cy={184} rx={14} ry={8} fill="#f2c94c" stroke="#9c7a12" strokeWidth={1.5} /></A>
      <A id="c-av-knoten" p={p}><ellipse className="hit" cx={234} cy={292} rx={11} ry={7} fill="#f2c94c" stroke="#9c7a12" strokeWidth={1.5} /></A>
      <A id="c-his" p={p}><path className="hit" d="M238,298 C254,316 278,330 283,360 L283,420 M283,420 C275,440 240,446 196,432 M283,420 C292,446 330,472 360,500 M196,432 l-12,-14 M196,432 l-10,10 M360,500 l12,-12 M360,500 l-4,14 M330,474 l14,-8" stroke="#f2c94c" strokeWidth={4.5} fill="none" strokeLinecap="round" /></A>
      {note(300, 572, 'Schema, nicht maßstäblich · rechte Herzhälfte links im Bild (Ansicht von vorne) · blau = sauerstoffarm, rot = sauerstoffreich')}
      <Overlay L={HEART_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Große Gefäße (Ventralansicht)
// ===========================================================================

export const VESSEL_LABELS: Record<string, Label> = {
  'v-carotis': { a: [222, 10], t: [-20, 0] },
  'v-truncus-brachiocephalicus': { a: [244, 75], t: [-20, 45] },
  'v-subclavia': { a: [90, 64], t: [-20, 95] },
  'c-vena-cava-sup': { a: [208, 175], t: [-20, 150] },
  'c-aorta': { a: [250, 200], t: [-20, 225] },
  'v-pfortader': { a: [330, 458], t: [-20, 470] },
  'c-vena-cava-inf': { a: [268, 560], t: [-20, 560] },
  'v-aortenbogen': { a: [320, 80], t: [600, 40] },
  'c-truncus-pulmonalis': { a: [290, 205], t: [600, 190] },
  'v-aorta-abdominalis': { a: [332, 500], t: [600, 500] },
  'v-iliaca': { a: [372, 655], t: [600, 655] },
};

export function VesselFigure(p: FigProps) {
  return (
    <svg viewBox="-240 -20 1040 740" role="img" aria-label="Schema der Aorta mit ihren Hauptästen, der Hohlvenen und der Pfortader in Ventralansicht">
      <g aria-hidden="true">
        <ellipse cx={210} cy={395} rx={100} ry={45} fill="#c98b7a" opacity={0.35} />{note(150, 395, 'Leber')}
        <rect x={380} y={470} width={110} height={70} rx={30} fill="#e6c7a6" opacity={0.6} />{note(435, 510, 'Darm')}
        <path d="M60,420 C180,350 430,350 560,420" stroke="#b55a52" strokeWidth={3} strokeDasharray="8 6" fill="none" />{note(560, 440, 'Zwerchfell', 'end')}
        {note(352, 612, '≈ L4', 'start')}
      </g>
      <A id="c-aorta" p={p}><path className="hit" d="M350,140 L338,410" stroke={ART} strokeWidth={26} fill="none" /></A>
      <ellipse cx={270} cy={290} rx={92} ry={72} fill={MUSC} opacity={0.28} aria-hidden="true" />{note(215, 330, 'Herz')}
      <A id="c-truncus-pulmonalis" p={p}><path className="hit" d="M290,270 L290,180 M290,182 C290,165 250,170 200,175 M290,182 C300,168 330,172 390,178" stroke="#6d8fd0" strokeWidth={14} fill="none" /></A>
      <A id="c-aorta" p={p}><path className="hit" d="M250,250 L250,140" stroke={ART} strokeWidth={26} fill="none" /></A>
      <A id="v-aortenbogen" p={p}><path className="hit" d="M250,142 C250,70 350,70 350,142" stroke={ART} strokeWidth={26} fill="none" /></A>
      <A id="v-truncus-brachiocephalicus" p={p}><path className="hit" d="M262,104 L226,46" stroke={ART} strokeWidth={14} strokeLinecap="round" /></A>
      <A id="v-carotis" p={p}><path className="hit" d="M226,46 L222,-12 M300,88 L305,-12" stroke={ART} strokeWidth={11} fill="none" /></A>
      <A id="v-subclavia" p={p}><path className="hit" d="M226,46 C180,30 120,40 60,82 M338,104 C380,40 440,40 520,82" stroke={ART} strokeWidth={11} fill="none" /></A>
      <A id="v-aorta-abdominalis" p={p}><path className="hit" d="M338,408 L326,602" stroke={ART} strokeWidth={22} fill="none" /></A>
      <A id="v-iliaca" p={p}><path className="hit" d="M326,600 L256,692 M326,600 L392,692" stroke={ART} strokeWidth={14} fill="none" strokeLinecap="round" /></A>
      <g aria-hidden="true" stroke={VEN} strokeWidth={9} fill="none"><path d="M212,112 C190,92 140,80 66,80" /><path d="M212,112 C260,100 340,92 470,80" /><path d="M244,380 C252,370 262,362 268,356" strokeWidth={6} /></g>
      <A id="c-vena-cava-sup" p={p}><path className="hit" d="M212,108 L212,240" stroke={VEN} strokeWidth={18} /></A>
      <A id="c-vena-cava-inf" p={p}><path className="hit" d="M268,640 L268,290" stroke={VEN} strokeWidth={18} /></A>
      <A id="v-pfortader" p={p}><path className="hit" d="M420,500 C360,470 300,440 250,402" stroke="#7c6bb0" strokeWidth={12} fill="none" strokeLinecap="round" /></A>
      {note(300, 716, 'Schema · rechte Körperseite links im Bild · rot Arterien, blau Venen, violett Pfortader')}
      <Overlay L={VESSEL_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Wirbelsäule (seitlich), Lendenwirbel und Bandscheibe von oben
// ===========================================================================

export const SPINE_LABELS: Record<string, Label> = {
  'r-hws': { a: [138, 100], t: [40, 100] },
  'r-bws': { a: [176, 300], t: [40, 300] },
  'r-lws': { a: [130, 510], t: [40, 510] },
  'r-sacrum': { a: [162, 630], t: [40, 630] },
  'r-coccyx': { a: [176, 700], t: [40, 700] },
  'r-wirbelkoerper': { a: [560, 150], t: [700, 130] },
  'r-foramen': { a: [520, 240], t: [700, 205] },
  'r-querfortsatz': { a: [630, 236], t: [700, 250] },
  'r-wirbelbogen': { a: [560, 290], t: [700, 300] },
  'r-dornfortsatz': { a: [522, 360], t: [700, 360] },
  'r-anulus': { a: [592, 548], t: [700, 520] },
  'r-nucleus': { a: [530, 568], t: [700, 600] },
};

const spineX = (y: number) => {
  if (y < 172) return 160 - 20 * Math.sin((Math.PI * (y - 30)) / 142);
  if (y < 433) return 160 + 35 * Math.sin((Math.PI * (y - 172)) / 261);
  return 160 - 30 * Math.sin((Math.PI * (y - 433)) / 155);
};
function vertebrae(n: number, y0: number, step: number, h: number, w: number) {
  return Array.from({ length: n }).map((_, i) => {
    const y = y0 + i * step; const x = spineX(y + h / 2);
    return <g key={i}><rect className="hit" x={x - w / 2} y={y} width={w} height={h} rx={4} fill={BONE} stroke={BONE_S} strokeWidth={1.5} /><path d={`M${x + w / 2},${y + 3} L${x + w / 2 + w * 0.7},${y + h + 4} L${x + w / 2},${y + h - 2} Z`} fill={BONE} stroke={BONE_S} strokeWidth={1} /></g>;
  });
}

export function SpineFigure(p: FigProps) {
  return (
    <svg viewBox="-100 0 1010 735" role="img" aria-label="Wirbelsäule in Seitenansicht sowie Lendenwirbel und Bandscheibe von oben">
      <A id="r-hws" p={p}>{vertebrae(7, 30, 20, 15, 30)}</A>
      <A id="r-bws" p={p}>{vertebrae(12, 176, 21.4, 17, 38)}</A>
      <A id="r-lws" p={p}>{vertebrae(5, 438, 30, 24, 48)}</A>
      <A id="r-sacrum" p={p}><path className="hit" d="M140,592 C188,598 210,640 192,682 L172,684 C170,650 150,622 128,604 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="r-coccyx" p={p}><path className="hit" d="M190,686 L178,712 L168,690 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      {note(110, 18, 'vorne', 'end')}{note(220, 18, 'hinten', 'start')}
      {note(240, 100, '7 Halswirbel · Lordose', 'start')}{note(250, 300, '12 Brustwirbel · Kyphose', 'start')}{note(240, 510, '5 Lendenwirbel · Lordose', 'start')}{note(240, 630, 'Kreuzbein · Kyphose', 'start')}
      {/* Lendenwirbel von oben */}
      {note(520, 74, 'Lendenwirbel von oben (vorne oben)')}
      <A id="r-wirbelbogen" p={p}><path className="hit" fillRule="evenodd" d="M470,192 C450,240 475,300 520,305 C565,300 590,240 570,192 Z M546,240 A26,26 0 1,0 494,240 A26,26 0 1,0 546,240 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="r-querfortsatz" p={p}><path className="hit" d="M478,236 L400,224 L398,246 L474,258 Z M562,236 L640,224 L642,246 L566,258 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="r-dornfortsatz" p={p}><path className="hit" d="M507,300 L511,372 C515,382 525,382 529,372 L533,300 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="r-wirbelkoerper" p={p}><ellipse className="hit" cx={520} cy={158} rx={74} ry={50} fill="url(#an2-spong)" stroke={BONE_S} strokeWidth={3} /></A>
      <A id="r-foramen" p={p}><circle className="hit" cx={520} cy={240} r={24} fill="#fff7e0" stroke="#d9c99a" /></A>
      {/* Bandscheibe von oben */}
      {note(520, 478, 'Bandscheibe von oben')}
      <A id="r-anulus" p={p}><ellipse className="hit" cx={520} cy={560} rx={82} ry={56} fill={CART} stroke={CART_S} strokeWidth={2} />{[66, 50, 36].map((k) => <ellipse key={k} cx={520} cy={562} rx={k} ry={k * 0.68} fill="none" stroke={CART_S} strokeWidth={1.2} />)}</A>
      <A id="r-nucleus" p={p}><ellipse className="hit" cx={520} cy={568} rx={28} ry={19} fill="#eef3fb" stroke="#9fb8d6" strokeWidth={2} /></A>
      <defs><pattern id="an2-spong" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#efdcb8" /><path d="M0,7 Q3.5,1 7,7 T14,7 M7,0 Q1,3.5 7,7 T7,14" stroke="#c9a77a" strokeWidth="1.6" fill="none" /></pattern></defs>
      <Overlay L={SPINE_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Brustkorb und vordere Bauchwand (Ventralansicht)
// ===========================================================================

export const TRUNK_LABELS: Record<string, Label> = {
  't-costae-verae': { a: [194, 157], t: [0, 150] },
  't-zwerchfell': { a: [138, 361], t: [0, 320] },
  't-costae-spuriae': { a: [232, 372], t: [0, 390] },
  't-costae-fluctuantes': { a: [118, 438], t: [0, 450] },
  't-obliquus': { a: [160, 560], t: [0, 560] },
  't-manubrium': { a: [318, 100], t: [600, 80] },
  't-corpus-sterni': { a: [314, 220], t: [600, 200] },
  't-xiphoid': { a: [304, 322], t: [600, 300] },
  't-rectus': { a: [340, 500], t: [600, 520] },
  't-linea-alba': { a: [300, 620], t: [600, 640] },
};

const TRUE_RIBS: { s: [number, number]; j: [number, number]; l: [number, number] }[] = [
  { s: [278, 95], j: [248, 100], l: [175, 92] },
  { s: [280, 142], j: [238, 150], l: [150, 128] },
  { s: [282, 172], j: [228, 184], l: [135, 160] },
  { s: [282, 202], j: [218, 218], l: [122, 192] },
  { s: [283, 232], j: [208, 252], l: [114, 224] },
  { s: [284, 262], j: [198, 290], l: [110, 258] },
  { s: [286, 292], j: [192, 330], l: [108, 292] },
];
const FALSE_RIBS: { j: [number, number]; l: [number, number] }[] = [
  { j: [196, 388], l: [108, 330] },
  { j: [168, 406], l: [112, 368] },
  { j: [146, 424], l: [120, 402] },
];
const ribPath = (j: [number, number], l: [number, number]) => `M${j[0]},${j[1]} Q${(j[0] + l[0]) / 2},${Math.max(j[1], l[1]) + 18} ${l[0]},${l[1]} Q${l[0] - 6},${l[1] - 20} ${l[0] + 8},${l[1] - 34}`;

export function TrunkFigure(p: FigProps) {
  const both = (d: ReactNode) => <>{d}{mirrorX(300, d)}</>;
  const half = (id: 'verae' | 'spuriae' | 'fluct') => both(id === 'verae'
    ? <>{TRUE_RIBS.map((r, i) => <g key={i}><path className="hit" d={`M${r.s[0]},${r.s[1]} L${r.j[0]},${r.j[1]}`} stroke={CART} strokeWidth={8} strokeLinecap="round" /><path className="hit" d={ribPath(r.j, r.l)} stroke={BONE_S} strokeWidth={9} fill="none" strokeLinecap="round" /></g>)}</>
    : id === 'spuriae'
      ? <><path className="hit" d="M288,300 C262,330 236,368 150,428" stroke={CART} strokeWidth={9} fill="none" strokeLinecap="round" />{FALSE_RIBS.map((r, i) => <path key={i} className="hit" d={ribPath(r.j, r.l)} stroke={BONE_S} strokeWidth={8} fill="none" strokeLinecap="round" />)}</>
      : <><path className="hit" d="M132,452 Q112,440 104,412" stroke={BONE_S} strokeWidth={7} fill="none" strokeDasharray="10 4" strokeLinecap="round" /><path className="hit" d="M150,478 Q130,470 118,448" stroke={BONE_S} strokeWidth={6} fill="none" strokeDasharray="10 4" strokeLinecap="round" /></>);
  const rect = <path className="hit" d="M292,330 L242,348 L236,712 L292,714 Z" fill="#d06a62" stroke="#a8433d" />;
  const ext = <><path className="hit" d="M240,420 L118,436 C108,520 140,640 234,704 Z" fill="#dd8c84" stroke="#a8433d" />{[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${124 + k * 6},${450 + k * 40} L${236},${470 + k * 42}`} stroke="#a8433d" strokeWidth={1} opacity={0.7} />)}</>;
  return (
    <svg viewBox="-230 0 1070 770" role="img" aria-label="Brustkorb und vordere Bauchwand in Ventralansicht">
      <A id="t-zwerchfell" p={p}><path className="hit" d="M118,402 C150,300 250,300 300,332 C350,300 450,300 482,402" stroke="#b55a52" strokeWidth={12} fill="none" opacity={0.75} /></A>
      <A id="t-obliquus" p={p}>{ext}{mirrorX(300, ext)}</A>
      <A id="t-rectus" p={p}>{rect}{mirrorX(300, rect)}<g stroke="#f3e5d0" strokeWidth={3}>{[400, 470, 540].map((y) => <path key={y} d={`M244,${y} L290,${y - 4} M310,${y - 4} L356,${y}`} />)}</g></A>
      <A id="t-linea-alba" p={p}><rect className="hit" x={292} y={334} width={16} height={380} fill={TEND} stroke="#cdbf9f" /></A>
      <A id="t-costae-verae" p={p}>{half('verae')}</A>
      <A id="t-costae-spuriae" p={p}>{half('spuriae')}</A>
      <A id="t-costae-fluctuantes" p={p}>{half('fluct')}</A>
      <path d="M276,80 C250,64 210,58 160,62 M324,80 C350,64 390,58 440,62" stroke={BONE_S} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} aria-hidden="true" />
      <A id="t-manubrium" p={p}><path className="hit" d="M272,82 L328,82 L322,140 L278,140 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="t-corpus-sterni" p={p}><path className="hit" d="M280,144 L320,144 L316,300 L284,300 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="t-xiphoid" p={p}><path className="hit" d="M288,304 L312,304 L300,338 Z" fill={CART} stroke={CART_S} strokeWidth={2} /></A>
      <path d="M180,742 C230,720 270,716 300,722 C330,716 370,720 420,742" stroke={BONE_S} strokeWidth={8} fill="none" opacity={0.5} aria-hidden="true" />
      {note(300, 764, 'Schema · Rippenknorpel hellblau · freie Rippen gestrichelt (liegen hinten) · Zwerchfell hinter den Rippen')}
      <Overlay L={TRUNK_LABELS} p={p} />
    </svg>
  );
}

// ===========================================================================
// Obere Extremität: rechter Arm von vorne mit den großen Nerven
// ===========================================================================

export const UPPER_LABELS: Record<string, Label> = {
  'o-n-axillaris': { a: [192, 150], t: [40, 150] },
  'b-humerus': { a: [210, 260], t: [40, 250] },
  'o-n-musculocutaneus': { a: [172, 320], t: [40, 330] },
  'o-n-radialis': { a: [158, 520], t: [40, 470] },
  'b-radius': { a: [178, 570], t: [40, 570] },
  'o-scaphoid': { a: [160, 666], t: [40, 640] },
  'o-trapezium': { a: [154, 708], t: [40, 690] },
  'o-trapezoideum': { a: [190, 714], t: [40, 735] },
  'o-metacarpalia': { a: [140, 768], t: [40, 785] },
  'o-phalangen': { a: [98, 862], t: [40, 880] },
  'k-clavicula': { a: [380, 40], t: [470, 25] },
  'v-subclavia': { a: [350, 98], t: [470, 80] },
  'b-scapula': { a: [300, 180], t: [470, 180] },
  'o-n-ulnaris': { a: [264, 330], t: [470, 330] },
  'b-ulna': { a: [246, 500], t: [470, 480] },
  'o-n-medianus': { a: [204, 560], t: [470, 560] },
  'o-lunatum': { a: [200, 662], t: [470, 615] },
  'o-triquetrum': { a: [228, 668], t: [470, 650] },
  'o-pisiforme': { a: [254, 676], t: [470, 685] },
  'o-capitatum': { a: [215, 712], t: [470, 720] },
  'o-hamatum': { a: [244, 706], t: [470, 755] },
};

const carpal = (id: string, cx: number, cy: number, p: FigProps, r = 13) => <A key={id} id={id} p={p}><ellipse className="hit" cx={cx} cy={cy} rx={r} ry={r * 0.95} fill={BONE} stroke={BONE_S} strokeWidth={1.5} /></A>;
const seg = (pts: [number, number][], w: number) => pts.slice(1).map((q, i) => <path key={i} className="hit" d={`M${pts[i][0]},${pts[i][1]} L${q[0]},${q[1]}`} stroke={BONE_S} strokeWidth={w} strokeLinecap="round" />);

export function UpperLimbFigure(p: FigProps & { nerves?: boolean }) {
  const nv = p.nerves !== false;
  return (
    <svg viewBox="-170 0 870 950" role="img" aria-label="Skelett des rechten Arms von vorne mit Handwurzelknochen und den großen Nerven">
      <A id="b-scapula" p={p}><path className="hit" d="M200,70 L340,78 L310,250 L230,140 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} opacity={0.75} /></A>
      <A id="k-clavicula" p={p}><path className="hit" d="M420,48 C360,30 300,60 206,54" stroke={BONE_S} strokeWidth={14} fill="none" strokeLinecap="round" /></A>
      <A id="b-humerus" p={p}><circle className="hit" cx={202} cy={100} r={27} fill={BONE} stroke={BONE_S} strokeWidth={2} /><path className="hit" d="M204,122 L216,368" stroke={BONE_S} strokeWidth={26} strokeLinecap="round" /><path className="hit" d="M178,362 L254,362 L248,392 L184,392 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="b-ulna" p={p}><path className="hit" d="M238,388 L246,640" stroke={BONE_S} strokeWidth={14} strokeLinecap="round" /></A>
      <A id="b-radius" p={p}><path className="hit" d="M196,402 L166,642" stroke={BONE_S} strokeWidth={16} strokeLinecap="round" /></A>
      {carpal('o-scaphoid', 172, 664, p)}{carpal('o-lunatum', 200, 662, p)}{carpal('o-triquetrum', 228, 666, p)}
      {carpal('o-trapezium', 166, 706, p)}{carpal('o-trapezoideum', 191, 708, p, 12)}{carpal('o-capitatum', 216, 708, p, 14)}{carpal('o-hamatum', 243, 704, p)}
      {carpal('o-pisiforme', 252, 674, p, 8)}
      <A id="o-metacarpalia" p={p}>{seg([[160, 724], [124, 790]], 10)}{seg([[190, 724], [185, 815]], 9)}{seg([[215, 726], [215, 820]], 9)}{seg([[241, 722], [244, 812]], 9)}{seg([[258, 716], [269, 800]], 9)}</A>
      <A id="o-phalangen" p={p}>{seg([[121, 798], [105, 840]], 8)}{seg([[103, 846], [94, 876]], 7)}{[[[184, 823], [181, 868], [179, 898], [178, 922]], [[215, 828], [216, 878], [217, 912], [217, 938]], [[244, 820], [248, 866], [250, 898], [251, 922]], [[270, 808], [277, 845], [281, 870], [283, 890]]].map((f, i) => <g key={i}>{seg([f[0] as [number, number], f[1] as [number, number]], 8)}{seg([[f[1][0], f[1][1] + 5], f[2] as [number, number]], 7)}{seg([[f[2][0], f[2][1] + 5], f[3] as [number, number]], 6)}</g>)}</A>
      <A id="v-subclavia" p={p}><path className="hit" d="M430,66 C360,88 300,110 262,146" stroke={ART} strokeWidth={9} fill="none" strokeLinecap="round" /></A>
      {nv && <>
        <g aria-hidden="true" stroke={NERVE} strokeWidth={3} fill="none" opacity={0.7}>{[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${330 + k * 18},${14 + k * 6} C${300 + k * 6},${80 + k * 6} 280,120 262,150`} />)}</g>
        {note(410, 14, 'Plexus brachialis C5–Th1', 'start')}
        <A id="o-n-axillaris" p={p}><path className="hit" d="M255,150 C236,160 212,164 196,152 C186,144 188,134 198,130" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
        <A id="o-n-musculocutaneus" p={p}><path className="hit" d="M255,156 C215,182 176,240 172,320 C170,370 172,410 168,445" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
        <A id="o-n-radialis" p={p}><path className="hit" d="M258,160 C272,200 240,230 214,252 C190,272 180,300 188,350" stroke={NERVE} strokeWidth={5} fill="none" strokeDasharray="9 5" /><path className="hit" d="M188,350 C190,392 178,420 172,446 C162,520 150,600 148,646" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
        <A id="o-n-medianus" p={p}><path className="hit" d="M262,162 C255,240 232,330 218,392 C210,450 205,560 202,640 L202,700 C202,730 196,760 190,790" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
        <A id="o-n-ulnaris" p={p}><path className="hit" d="M268,162 C272,240 268,330 262,376 C258,392 252,404 250,422 C248,480 254,580 254,640 C254,680 254,700 256,720 C260,760 263,780 268,800" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
      </>}
      {note(60, 930, 'Daumenseite (lateral)')}{note(420, 930, 'Kleinfingerseite (medial)')}
      {note(265, 948, 'Schema, rechter Arm von vorne · gelb Nerven, gestrichelt hinter dem Knochen')}
      <Overlay L={nv ? UPPER_LABELS : Object.fromEntries(Object.entries(UPPER_LABELS).filter(([k]) => !k.startsWith('o-n-')))} p={p} />
    </svg>
  );
}

// ===========================================================================
// Untere Extremität: rechtes Bein von vorne, Fuß von oben
// ===========================================================================

export const LOWER_LABELS: Record<string, Label> = {
  'u-ilium': { a: [160, 70], t: [40, 50] },
  'u-trochanter': { a: [172, 242], t: [40, 240] },
  'u-n-ischiadicus': { a: [213, 330], t: [40, 320] },
  'k-femur': { a: [216, 420], t: [40, 410] },
  'u-n-fibularis': { a: [204, 690], t: [40, 640] },
  'k-tibia': { a: [256, 720], t: [40, 700] },
  'k-fibula': { a: [202, 780], t: [40, 760] },
  'u-n-tibialis': { a: [242, 820], t: [40, 820] },
  'u-talus': { a: [212, 915], t: [40, 915] },
  'v-iliaca': { a: [404, 66], t: [620, 30] },
  'r-sacrum': { a: [390, 150], t: [620, 110] },
  'u-femurkopf': { a: [252, 198], t: [620, 170] },
  'u-pubis': { a: [320, 232], t: [620, 230] },
  'u-ischium': { a: [236, 292], t: [620, 290] },
  'u-n-femoralis': { a: [256, 330], t: [620, 360] },
  'k-patella': { a: [246, 560], t: [620, 540] },
  'u-metatarsalia': { a: [532, 760], t: [620, 740] },
  'u-tarsus-rest': { a: [512, 836], t: [620, 840] },
  'u-calcaneus': { a: [508, 945], t: [620, 950] },
};

export function LowerLimbFigure(p: FigProps & { nerves?: boolean }) {
  const nv = p.nerves !== false;
  const mt: [number, number, number, number][] = [[450, 788, 440, 705], [472, 788, 468, 700], [492, 790, 492, 705], [510, 800, 515, 712], [526, 815, 540, 725]];
  return (
    <svg viewBox="-180 0 1010 1005" role="img" aria-label="Skelett des rechten Beins von vorne mit Becken und den großen Nerven, Fußskelett von oben">
      <A id="r-sacrum" p={p}><path className="hit" d="M335,55 L430,55 L415,195 L365,205 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-ilium" p={p}><path className="hit" d="M110,50 C170,10 280,20 320,70 L315,140 C290,165 260,180 230,186 L195,182 C150,150 110,110 110,50 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-pubis" p={p}><path className="hit" d="M262,196 L356,222 L360,258 L262,232 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-ischium" p={p}><path className="hit" d="M206,224 C192,262 206,302 240,306 C266,302 268,270 256,240 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <rect x={358} y={222} width={14} height={38} fill={CART} stroke={CART_S} aria-hidden="true" />{note(390, 270, 'Symphyse', 'start')}
      <A id="k-femur" p={p}><path className="hit" d="M238,212 L196,252 L234,560" stroke={BONE_S} strokeWidth={26} fill="none" strokeLinejoin="round" strokeLinecap="round" /><path className="hit" d="M204,552 L276,552 L273,590 L206,590 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-trochanter" p={p}><ellipse className="hit" cx={178} cy={242} rx={18} ry={22} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-femurkopf" p={p}><circle className="hit" cx={244} cy={205} r={24} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="k-tibia" p={p}><path className="hit" d="M214,598 L292,598 L286,618 L222,618 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} /><path className="hit" d="M252,612 L260,890" stroke={BONE_S} strokeWidth={24} strokeLinecap="round" /></A>
      <A id="k-fibula" p={p}><circle className="hit" cx={205} cy={624} r={10} fill={BONE} stroke={BONE_S} strokeWidth={2} /><path className="hit" d="M205,630 L200,898" stroke={BONE_S} strokeWidth={9} strokeLinecap="round" /></A>
      <A id="k-patella" p={p}><circle className="hit" cx={240} cy={560} r={17} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-talus" p={p}><ellipse className="hit" cx={232} cy={916} rx={36} ry={16} fill={BONE} stroke={BONE_S} strokeWidth={2} /><ellipse className="hit" cx={478} cy={872} rx={28} ry={22} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      {/* Fuß von oben */}
      <A id="u-calcaneus" p={p}><ellipse className="hit" cx={494} cy={932} rx={28} ry={38} fill={BONE} stroke={BONE_S} strokeWidth={2} /></A>
      <A id="u-tarsus-rest" p={p}><ellipse className="hit" cx={466} cy={834} rx={22} ry={12} fill={BONE} stroke={BONE_S} strokeWidth={2} /><ellipse className="hit" cx={514} cy={846} rx={17} ry={24} fill={BONE} stroke={BONE_S} strokeWidth={2} />{[441, 463, 485].map((x) => <rect key={x} className="hit" x={x} y={795} width={18} height={24} rx={3} fill={BONE} stroke={BONE_S} strokeWidth={1.5} />)}</A>
      <A id="u-metatarsalia" p={p}>{mt.map(([x1, y1, x2, y2], i) => <path key={i} className="hit" d={`M${x1},${y1} L${x2},${y2}`} stroke={BONE_S} strokeWidth={i ? 9 : 12} strokeLinecap="round" />)}</A>
      <g aria-hidden="true" stroke={BONE_S} strokeWidth={7} strokeLinecap="round" opacity={0.7}>{mt.map(([, , x, y], i) => <path key={i} d={`M${x},${y - 8} L${x - 3 + i * 1.5},${y - (i ? 48 : 52)}`} />)}</g>
      {note(495, 990, 'rechter Fuß von oben, Zehen oben')}
      <A id="v-iliaca" p={p}><path className="hit" d="M470,10 C430,60 370,90 330,130 C305,165 295,200 290,240" stroke={ART} strokeWidth={9} fill="none" strokeLinecap="round" /></A>
      <path d="M290,240 C276,330 258,420 246,520" stroke={ART} strokeWidth={4} fill="none" opacity={0.6} aria-hidden="true" />
      {nv && <>
        <A id="u-n-femoralis" p={p}><path className="hit" d="M312,120 C300,170 286,210 276,242 C266,290 252,340 240,400 M268,280 C276,320 280,360 270,420" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
        <A id="u-n-ischiadicus" p={p}><path className="hit" d="M284,150 C246,200 216,258 212,300 L215,500" stroke={NERVE} strokeWidth={8} fill="none" strokeDasharray="10 5" /></A>
        <A id="u-n-tibialis" p={p}><path className="hit" d="M215,500 C226,560 236,620 238,700 L242,880" stroke={NERVE} strokeWidth={5} fill="none" strokeDasharray="10 5" /></A>
        <A id="u-n-fibularis" p={p}><path className="hit" d="M215,500 C206,560 192,600 194,628 C198,646 212,652 210,672 L204,800" stroke={NERVE} strokeWidth={5} fill="none" strokeLinecap="round" /></A>
      </>}
      {note(60, 990, 'lateral')}{note(330, 990, 'medial')}
      {note(330, 1003, 'Schema, rechtes Bein von vorne · gelb Nerven, gestrichelt auf der Rückseite')}
      <Overlay L={nv ? LOWER_LABELS : Object.fromEntries(Object.entries(LOWER_LABELS).filter(([k]) => !k.startsWith('u-n-')))} p={p} />
    </svg>
  );
}

// ===========================================================================
// Kniegelenk: von vorne (Patella entfernt) und Tibiaplateau von oben
// ===========================================================================

export const KNEE_LABELS: Record<string, Label> = {
  'kn-aussenband': { a: [155, 250], t: [40, 250] },
  'kn-lca': { a: [242, 238], t: [40, 150] },
  'kn-meniskus-lateral': { a: [160, 640], t: [40, 640] },
  'kn-innenband': { a: [350, 260], t: [470, 200] },
  'kn-lcp': { a: [270, 220], t: [470, 120] },
  'kn-meniskus-medial': { a: [338, 640], t: [470, 640] },
};

export function KneeFigure(p: FigProps) {
  return (
    <svg viewBox="-150 0 800 770" role="img" aria-label="Rechtes Kniegelenk von vorne mit Kreuz- und Seitenbändern sowie Tibiaplateau mit Menisken von oben">
      <g aria-hidden="true">
        <path d="M180,20 L320,20 L330,150 C342,205 305,228 275,214 C265,205 262,190 250,186 C238,190 235,205 225,214 C195,228 158,205 170,150 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} />
        <path d="M150,282 L350,282 L340,330 L300,350 L300,500 L200,500 L200,350 L160,330 Z" fill={BONE} stroke={BONE_S} strokeWidth={2} />
        <circle cx={148} cy={344} r={18} fill={BONE} stroke={BONE_S} strokeWidth={2} /><path d="M146,360 L140,500" stroke={BONE_S} strokeWidth={14} strokeLinecap="round" />
        {note(250, 90, 'Femur')}{note(250, 440, 'Tibia')}{note(112, 470, 'Fibula')}
        {note(90, 18, 'lateral')}{note(410, 18, 'medial')}
      </g>
      <A id="kn-meniskus-lateral" p={p}><path className="hit" d="M165,234 L215,250 L165,266 Z" fill={CART} stroke={CART_S} /><path className="hit" d="M223,575 C170,565 145,615 155,655 C163,688 195,695 217,682 C235,670 235,640 225,625" stroke={CART} strokeWidth={20} fill="none" strokeLinecap="round" /></A>
      <A id="kn-meniskus-medial" p={p}><path className="hit" d="M335,234 L285,250 L335,266 Z" fill={CART} stroke={CART_S} /><path className="hit" d="M275,565 C335,560 355,605 340,655 C330,690 295,702 270,695" stroke={CART} strokeWidth={20} fill="none" strokeLinecap="round" /></A>
      <A id="kn-aussenband" p={p}><path className="hit" d="M162,150 L150,334" stroke="#d8c9a6" strokeWidth={11} strokeLinecap="round" /></A>
      <A id="kn-innenband" p={p}><path className="hit" d="M335,140 L355,140 L360,392 L338,392 Z" fill="#e4d6b4" stroke="#b8a77f" /></A>
      <A id="kn-lcp" p={p}><path className="hit" d="M240,288 L285,196" stroke="#7a5cc4" strokeWidth={13} strokeLinecap="round" /><ellipse className="hit" cx={255} cy={595} rx={14} ry={9} fill="#7a5cc4" /></A>
      <A id="kn-lca" p={p}><path className="hit" d="M264,286 L220,192" stroke="#d77b4a" strokeWidth={13} strokeLinecap="round" /><ellipse className="hit" cx={250} cy={700} rx={14} ry={9} fill="#d77b4a" /></A>
      <g aria-hidden="true">
        <path d="M145,590 C165,540 335,540 355,590 C370,650 355,710 250,720 C145,710 130,650 145,590 Z" fill="none" stroke={BONE_S} strokeWidth={2} />
        {note(250, 538, 'hinten')}{note(250, 738, 'vorne')}{note(118, 600, 'lateral', 'end')}{note(382, 600, 'medial', 'start')}
        {note(250, 520, 'Tibiaplateau von oben')}
      </g>
      {note(250, 762, 'Schema, rechtes Knie · oben von vorne mit entfernter Patella, unten von oben')}
      <Overlay L={KNEE_LABELS} p={p} />
    </svg>
  );
}
