import { useMemo, useState, type ReactNode } from 'react';
import { structureById } from '../../content';
import type { AnatomyFigure } from '../../content/types';
import { StructurePanel } from '../StructureInfo';
import { Splitter } from '../../ui/common';
import { ZoomBox } from '../../ui/Zoom';
import { AnatomyFigureView, ArmFigure, BodyFigure, FIGURE_IDS, MuscleXFigure, armState, type FigProps } from '../../ui/anatomyFigures';

// ===========================================================================
// Bausteine: Erkunden (anklicken + Infotafel) und Beschriftungsmodus („Tippe auf …“)
// ===========================================================================

export function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: [T, string][]; label: string }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {items.map(([k, t]) => <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}>{t}</button>)}
    </div>
  );
}

export function Explore({ figure, ids, toolbar, render }: { figure: AnatomyFigure; ids?: string[]; toolbar?: ReactNode; render?: (p: FigProps) => ReactNode }) {
  const list = ids ?? FIGURE_IDS[figure];
  const [sel, setSel] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [isolate, setIsolate] = useState(false);
  const p: FigProps = { sel, onSel: (id) => setSel((s) => (s === id ? null : id)), labels, isolate };
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="figure anat-fig">
          <div className="toolbar no-print">
            <button className="small" aria-pressed={labels} onClick={() => setLabels((v) => !v)}>Beschriftung</button>
            <button className="small" aria-pressed={isolate} disabled={!sel} onClick={() => setIsolate((v) => !v)}>Nur Auswahl</button>
            {toolbar}
          </div>
          <ZoomBox>{render ? render(p) : <AnatomyFigureView figure={figure} {...p} />}</ZoomBox>
        </div>
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Tippe auf eine Struktur, um sie zu erklären. Schematische Zeichnung – für Details und echte Präparate den Atlas und den Präpariersaal nutzen.</p>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <StructurePanel ids={list} sel={sel} onSel={setSel} />
      </aside>
    </div>
  );
}

export function shuffle<T>(a: T[]) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

/** Beschriftungsmodus: Eine Struktur wird genannt, Kim tippt sie in der Abbildung an. */
export function LabelDrill({ figure, ids, deg }: { figure: AnatomyFigure; ids?: string[]; deg?: number }) {
  const list = ids ?? FIGURE_IDS[figure];
  const [order, setOrder] = useState(() => shuffle(list));
  const [i, setI] = useState(0);
  const [mark, setMark] = useState<{ id: string; ok: boolean } | null>(null);
  const [tries, setTries] = useState(0);
  const [score, setScore] = useState(0);
  const [latin, setLatin] = useState(false);
  const target = order[i];
  const done = i >= order.length;
  const t = structureById(target);
  const pick = (id: string) => {
    if (done || mark?.ok) return;
    const ok = id === target;
    setMark({ id, ok });
    if (ok && tries === 0) setScore((x) => x + 1);
    if (!ok) setTries((x) => x + 1);
  };
  const next = () => { setI((x) => x + 1); setMark(null); setTries(0); };
  const restart = () => { setOrder(shuffle(list)); setI(0); setMark(null); setTries(0); setScore(0); };
  const shown: FigProps = { onSel: pick, mark: mark ?? (tries >= 2 && target ? { id: target, ok: true } : null), labels: false };
  return (
    <div className="stack">
      <div className="card row between" style={{ alignItems: 'center' }}>
        {done ? (
          <><b>Geschafft: {score} von {order.length} beim ersten Versuch richtig.</b><button className="primary" onClick={restart}>Noch einmal</button></>
        ) : (
          <>
            <div aria-live="polite" className="drill-q">Tippe auf: <b>{latin ? t?.sciName : t?.deName}</b>
              {mark && <span style={{ marginLeft: 10, color: mark.ok ? 'var(--ok)' : 'var(--danger)' }}>{mark.ok ? '✓ richtig' : `✗ das ist ${structureById(mark.id)?.deName}`}</span>}
              {!mark?.ok && tries >= 2 && <span className="muted" style={{ marginLeft: 10 }}>(grün markiert)</span>}
            </div>
            <div className="row">
              <span className="muted">{i + 1} / {order.length}</span>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={latin} onChange={(e) => setLatin(e.target.checked)} /> Latein</label>
              <button className={mark?.ok || tries >= 2 ? 'primary' : ''} onClick={next}>{mark?.ok || tries >= 2 ? 'Weiter' : 'Überspringen'}</button>
            </div>
          </>
        )}
      </div>
      <div className="figure anat-fig"><ZoomBox><AnatomyFigureView figure={figure} deg={deg} {...shown} /></ZoomBox></div>
    </div>
  );
}

// ===========================================================================
// Allgemeine Anatomie: Erkunden, Achsen und Ebenen, Beschriften, Orientierung
// ===========================================================================

type Rel = { a: string; b: string; right: string; wrong: string; why: string };
const RELS: Rel[] = [
  { a: 'b-radius', b: 'b-ulna', right: 'lateral', wrong: 'medial', why: 'In Normalstellung (Handflächen nach vorn) liegt der Radius auf der Daumenseite – also weiter von der Medianebene entfernt.' },
  { a: 'b-ulna', b: 'b-radius', right: 'medial', wrong: 'lateral', why: 'Die Ulna liegt auf der Kleinfingerseite, näher an der Medianebene.' },
  { a: 'k-fibula', b: 'k-tibia', right: 'lateral', wrong: 'medial', why: 'Das Wadenbein liegt außen, das Schienbein innen.' },
  { a: 'k-tibia', b: 'k-fibula', right: 'medial', wrong: 'lateral', why: 'Die Tibia liegt näher an der Medianebene.' },
  { a: 'k-sternum', b: 'k-clavicula', right: 'medial', wrong: 'lateral', why: 'Das Brustbein liegt in der Medianebene, die Schlüsselbeine ziehen von dort nach außen.' },
  { a: 'k-clavicula', b: 'k-sternum', right: 'lateral', wrong: 'medial', why: 'Vom Sternum aus gesehen liegt die Clavicula seitlich.' },
  { a: 'k-schaedel', b: 'k-sternum', right: 'kranial', wrong: 'kaudal', why: 'Kranial = kopfwärts. Am Rumpf und Kopf benutzt man kranial/kaudal.' },
  { a: 'k-becken', b: 'k-sternum', right: 'kaudal', wrong: 'kranial', why: 'Das Becken liegt steißwärts vom Brustbein.' },
  { a: 'k-femur', b: 'k-tibia', right: 'proximal', wrong: 'distal', why: 'An den Extremitäten: proximal = rumpfnah. Der Oberschenkel liegt näher am Rumpf als der Unterschenkel.' },
  { a: 'b-radius', b: 'b-humerus', right: 'distal', wrong: 'proximal', why: 'Der Unterarm liegt rumpffern vom Oberarm.' },
  { a: 'k-patella', b: 'k-femur', right: 'ventral (anterior)', wrong: 'dorsal (posterior)', why: 'Die Kniescheibe liegt vor dem distalen Femur in der Quadrizepssehne.' },
  { a: 'k-wirbelsaeule', b: 'k-sternum', right: 'dorsal (posterior)', wrong: 'ventral (anterior)', why: 'Die Wirbelsäule liegt in der hinteren Rumpfwand, das Brustbein in der vorderen. In der Ventralansicht ist sie deshalb nur gestrichelt.' },
];

function OrientationQuiz() {
  const [order, setOrder] = useState(() => shuffle(RELS.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const r = RELS[order[k]];
  const opts = useMemo(() => (r ? (order[k] % 2 ? [r.wrong, r.right] : [r.right, r.wrong]) : []), [r, order, k]);
  const choose = (o: string) => { if (ans) return; setAns(o); if (o === r.right) setScore((x) => x + 1); };
  return (
    <div className="stack">
      <div className="card stack">
        {done ? (
          <div className="row between"><b>{score} von {order.length} richtig.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
        ) : (
          <>
            <div className="drill-q">Wie liegt <b style={{ color: 'var(--accent)' }}>{structureById(r.a)?.deName}</b> zu <b style={{ color: 'var(--eosin)' }}>{structureById(r.b)?.deName}</b>?</div>
            <div className="row">{opts.map((o) => <button key={o} className={ans ? (o === r.right ? 'primary' : '') : ''} aria-pressed={ans === o} onClick={() => choose(o)}>{o}</button>)}</div>
            {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === r.right ? 'var(--ok)' : 'var(--danger)' }}>{ans === r.right ? 'Richtig.' : `Nicht ganz – ${r.right}.`}</b> {r.why}</p>}
            <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
          </>
        )}
      </div>
      <div className="figure anat-fig"><BodyFigure hl={done ? null : [r.a, r.b]} labels={false} /></div>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Gepaarte Knochen sind auf beiden Seiten markiert. Lagebezeichnungen gelten immer in anatomischer Normalstellung.</p>
    </div>
  );
}

export function OrientationView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'orientierung'>('erkunden');
  const [ov, setOv] = useState<'none' | 'achsen' | 'ebenen'>('none');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Erkunden'], ['beschriften', 'Beschriften'], ['orientierung', 'Orientierung üben']]} />
      {tab === 'erkunden' && (
        <Explore figure="body" render={(p) => <BodyFigure {...p} overlay={ov} />} toolbar={
          <select value={ov} onChange={(e) => setOv(e.target.value as typeof ov)} aria-label="Einblendung" style={{ minHeight: 30 }}>
            <option value="none">Ohne Achsen</option><option value="achsen">Achsen zeigen</option><option value="ebenen">Ebenen zeigen</option>
          </select>
        } />
      )}
      {tab === 'beschriften' && <LabelDrill figure="body" />}
      {tab === 'orientierung' && <OrientationQuiz />}
    </div>
  );
}

// ===========================================================================
// Embryologie: Zeitleiste der ersten vier Wochen und Keimblatt-Zuordnung
// ===========================================================================

const ECTO = '#6fa8dc', MESO = '#e06666', ENTO = '#f1c232', CREST = '#8e7cc3', TROPHO = '#d5a6bd';

const cells = (cx: number, cy: number, n: number, r: number, cr: number, fill: string) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={cr} fill={fill} stroke="#7b6a8a" />; });

const STAGES: { when: string; title: string; text: string; draw: ReactNode }[] = [
  { when: 'Tag 0–1', title: 'Befruchtung und Zygote', text: 'Die Befruchtung findet meist in der Ampulle des Eileiters statt. Die Zygote ist noch von der Zona pellucida umgeben; die beiden Vorkerne verschmelzen.',
    draw: <><circle cx={200} cy={120} r={76} fill="none" stroke="#c9b6dc" strokeWidth={8} /><circle cx={200} cy={120} r={64} fill="#fbeff3" stroke="#7b6a8a" /><circle cx={180} cy={118} r={14} fill="#b9a3d6" /><circle cx={220} cy={122} r={14} fill="#9fc5e8" /></> },
  { when: 'Tag 1–3', title: 'Furchung', text: 'Die Zygote teilt sich auf dem Weg durch den Eileiter: 2, 4, 8 Zellen (Blastomeren). Die Zellen werden kleiner – der Keim wächst nicht.',
    draw: <><circle cx={200} cy={120} r={76} fill="none" stroke="#c9b6dc" strokeWidth={8} />{[[170, 95], [230, 95], [170, 148], [230, 148]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={30} fill="#fbeff3" stroke="#7b6a8a" />)}</> },
  { when: 'Tag 3–4', title: 'Morula', text: 'Ein kompakter Zellhaufen aus etwa 12–16 Zellen („Maulbeerkeim“) erreicht den Uterus.',
    draw: <><circle cx={200} cy={120} r={76} fill="none" stroke="#c9b6dc" strokeWidth={8} />{cells(200, 120, 10, 44, 17, '#fbeff3')}{cells(200, 120, 5, 16, 15, '#f6dfe8')}</> },
  { when: 'Tag 4–5', title: 'Blastozyste', text: 'Flüssigkeit sammelt sich in einer Höhle. Die äußere Zellschicht ist der Trophoblast (wird zur Plazenta), die innere Zellmasse der Embryoblast (wird zum Embryo).',
    draw: <><circle cx={200} cy={120} r={74} fill="#fff8e6" stroke="none" />{cells(200, 120, 22, 70, 11, TROPHO)}{[[180, 76], [200, 70], [220, 76], [190, 92], [210, 92]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={12} fill="#b9a3d6" stroke="#7b6a8a" />)}<text x={290} y={60} style={{ fontSize: 13 }}>Embryoblast</text><text x={290} y={190} style={{ fontSize: 13 }}>Trophoblast</text><text x={170} y={150} style={{ fontSize: 13 }}>Blastozystenhöhle</text></> },
  { when: 'ab Tag 6', title: 'Implantation', text: 'Die Blastozyste nistet sich mit dem Embryoblast-Pol voran in die Uterusschleimhaut ein. Der Trophoblast teilt sich in Zytotrophoblast und den invasiven Synzytiotrophoblast, der hCG bildet. Etwa am 10.–12. Tag ist die Einnistung abgeschlossen.',
    draw: <><rect x={0} y={0} width={400} height={92} fill="#f4d6d6" /><text x={10} y={20} style={{ fontSize: 13 }}>Uterusschleimhaut</text><path d="M130,92 C130,40 270,40 270,92" fill="#e4b3c8" stroke="#a0587a" /><circle cx={200} cy={120} r={64} fill="#fff8e6" stroke={TROPHO} strokeWidth={10} />{[[184, 72], [200, 66], [216, 72]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#b9a3d6" stroke="#7b6a8a" />)}<text x={280} y={60} style={{ fontSize: 13 }}>Synzytiotrophoblast</text></> },
  { when: '2. Woche', title: 'Zweiblättrige Keimscheibe', text: 'Der Embryoblast bildet Epiblast und Hypoblast. Über dem Epiblast entsteht die Amnionhöhle, unter dem Hypoblast der Dottersack („Woche der Zweien“).',
    draw: <><ellipse cx={200} cy={78} rx={70} ry={40} fill="#d9ecf8" stroke="#7da7c9" /><text x={182} y={70} style={{ fontSize: 13 }}>Amnion</text><rect x={120} y={112} width={160} height={14} fill={ECTO} /><rect x={120} y={126} width={160} height={10} fill={ENTO} /><ellipse cx={200} cy={176} rx={64} ry={40} fill="#fdf1c8" stroke="#d7b54a" /><text x={170} y={184} style={{ fontSize: 13 }}>Dottersack</text><text x={292} y={122} style={{ fontSize: 13 }}>Epiblast</text><text x={292} y={140} style={{ fontSize: 13 }}>Hypoblast</text></> },
  { when: '3. Woche', title: 'Gastrulation', text: 'Am Primitivstreifen wandern Epiblastzellen nach innen und bilden Entoderm und Mesoderm. Der restliche Epiblast wird zum Ektoderm. Die Chorda dorsalis entsteht als Achsenstab.',
    draw: <><rect x={60} y={80} width={280} height={22} fill={ECTO} /><rect x={60} y={102} width={280} height={26} fill={MESO} /><rect x={60} y={128} width={280} height={20} fill={ENTO} /><path d="M200,58 L200,118" stroke="#333" strokeWidth={2} markerEnd="url(#emb-a)" /><defs><marker id="emb-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#333" /></marker></defs><text x={206} y={60} style={{ fontSize: 13 }}>Einwanderung am Primitivstreifen</text><text x={350} y={95} style={{ fontSize: 13 }}>Ektoderm</text><text x={350} y={120} style={{ fontSize: 13 }}>Mesoderm</text><text x={350} y={143} style={{ fontSize: 13 }}>Entoderm</text></> },
  { when: 'Ende 3.–4. Woche', title: 'Neurulation', text: 'Über der Chorda faltet sich das Ektoderm zur Neuralrinne und schließt sich zum Neuralrohr. Neuralleistenzellen wandern aus. Das Mesoderm gliedert sich u. a. in Somiten. Der vordere Neuroporus schließt sich um Tag 25, der hintere um Tag 28.',
    draw: <><path d="M40,60 C120,60 150,40 200,40 C250,40 280,60 360,60" fill="none" stroke={ECTO} strokeWidth={10} /><circle cx={200} cy={92} r={26} fill="#fff" stroke={ECTO} strokeWidth={10} /><circle cx={160} cy={70} r={7} fill={CREST} /><circle cx={240} cy={70} r={7} fill={CREST} /><rect x={110} y={88} width={44} height={44} rx={8} fill={MESO} /><rect x={246} y={88} width={44} height={44} rx={8} fill={MESO} /><circle cx={200} cy={140} r={10} fill="#9b7653" /><path d="M40,176 C140,170 260,170 360,176" fill="none" stroke={ENTO} strokeWidth={10} /><text x={236} y={40} style={{ fontSize: 13 }}>Neuralrohr</text><text x={56} y={84} style={{ fontSize: 13 }}>Neuralleiste</text><text x={300} y={116} style={{ fontSize: 13 }}>Somit</text><text x={214} y={152} style={{ fontSize: 13 }}>Chorda dorsalis</text><text x={300} y={200} style={{ fontSize: 13 }}>Entoderm</text></> },
];

type Layer = 'Ektoderm' | 'Neuralleiste' | 'Mesoderm' | 'Entoderm';
const DERIV: [string, Layer][] = [
  ['Epidermis der Haut', 'Ektoderm'], ['Gehirn und Rückenmark', 'Ektoderm'], ['Linse des Auges', 'Ektoderm'],
  ['Spinalganglien', 'Neuralleiste'], ['Melanozyten', 'Neuralleiste'], ['Nebennierenmark', 'Neuralleiste'],
  ['Skelettmuskulatur', 'Mesoderm'], ['Knochen und Knorpel', 'Mesoderm'], ['Herz und Blutgefäße', 'Mesoderm'], ['Nieren', 'Mesoderm'], ['Nebennierenrinde', 'Mesoderm'],
  ['Epithel von Darm und Magen', 'Entoderm'], ['Leberzellen (Hepatozyten)', 'Entoderm'], ['Epithel der Atemwege', 'Entoderm'], ['Schilddrüsenfollikel', 'Entoderm'],
];
const LAYER_COLOR: Record<Layer, string> = { Ektoderm: ECTO, Neuralleiste: CREST, Mesoderm: MESO, Entoderm: ENTO };

function GermLayerGame() {
  const [order, setOrder] = useState(() => shuffle(DERIV.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<Layer | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const d = DERIV[order[k]];
  return (
    <div className="card stack">
      <h3 style={{ margin: 0 }}>Aus welchem Keimblatt?</h3>
      {done ? (
        <div className="row between"><b>{score} von {order.length} richtig.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
      ) : (
        <>
          <div className="drill-q"><b>{d[0]}</b></div>
          <div className="row">{(Object.keys(LAYER_COLOR) as Layer[]).map((l) => (
            <button key={l} aria-pressed={ans === l} className={ans && l === d[1] ? 'primary' : ''} onClick={() => { if (ans) return; setAns(l); if (l === d[1]) setScore((x) => x + 1); }}>
              <span className="legend-sw" style={{ background: LAYER_COLOR[l] }} />{l}
            </button>))}
          </div>
          {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === d[1] ? 'var(--ok)' : 'var(--danger)' }}>{ans === d[1] ? 'Richtig.' : `Nicht ganz – ${d[1]}.`}</b></p>}
          <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
        </>
      )}
    </div>
  );
}

function Stepper({ stages, label, aspect = '0 0 400 240' }: { stages: { when: string; title: string; text: string; draw: ReactNode }[]; label: string; aspect?: string }) {
  const [i, setI] = useState(0);
  const s = stages[i];
  return (
    <div className="card stack">
      <div className="row between" style={{ alignItems: 'center' }}>
        <div><span className="badge">{s.when}</span> <b style={{ marginLeft: 6 }}>{s.title}</b></div>
        <div className="row"><button className="small" onClick={() => setI((x) => Math.max(0, x - 1))} disabled={i === 0} aria-label="Vorheriger Schritt">◀</button><span className="muted">{i + 1} / {stages.length}</span><button className="small primary" onClick={() => setI((x) => Math.min(stages.length - 1, x + 1))} disabled={i === stages.length - 1} aria-label="Nächster Schritt">▶</button></div>
      </div>
      <div className="anat-fig"><svg viewBox={aspect} role="img" aria-label={`${label}: ${s.title}`} className="hlabel">{s.draw}</svg></div>
      <p aria-live="polite" style={{ margin: 0 }}>{s.text}</p>
      <input type="range" min={0} max={stages.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} aria-label={`${label}: Schritt wählen`} />
    </div>
  );
}

export function EmbryoView() {
  const [tab, setTab] = useState<'zeit' | 'keimblatt'>('zeit');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['zeit', 'Woche für Woche'], ['keimblatt', 'Keimblätter zuordnen']]} />
      {tab === 'zeit' ? <Stepper stages={STAGES} label="Frühentwicklung" /> : <GermLayerGame />}
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Farben: <span className="legend-sw" style={{ background: ECTO }} />Ektoderm <span className="legend-sw" style={{ background: MESO }} />Mesoderm <span className="legend-sw" style={{ background: ENTO }} />Entoderm <span className="legend-sw" style={{ background: CREST }} />Neuralleiste. Schemazeichnungen, Größen nicht maßstäblich; Tagesangaben sind Richtwerte.</p>
    </div>
  );
}

// ===========================================================================
// Knochen: Erkunden, Beschriften, chondrale Ossifikation
// ===========================================================================

const OUT = 'M150,40 C140,14 280,14 270,40 L262,92 L245,112 L245,188 L262,208 L270,260 C280,286 140,286 150,260 L158,208 L175,188 L175,112 L158,92 Z';
const CARTI = '#bcd6ea', BONEC = '#ecdcb8', MARROW = '#d9776a';
function OssDraw({ step }: { step: number }) {
  const band = (y: number, h: number, fill: string, key?: string) => <rect key={key} x={120} y={y} width={180} height={h} fill={fill} />;
  const collar = (y1: number, y2: number) => <><rect x={170} y={y1} width={10} height={y2 - y1} fill="#b8975e" /><rect x={240} y={y1} width={10} height={y2 - y1} fill="#b8975e" /></>;
  return (
    <>
      <defs><clipPath id="oss-clip"><path d={OUT} /></clipPath><pattern id="oss-sp" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill={BONEC} /><path d="M0,5 Q2.5,0 5,5 T10,5" stroke="#b8975e" fill="none" /></pattern></defs>
      <g clipPath="url(#oss-clip)">
        {band(0, 300, CARTI)}
        {step === 2 && <rect x={176} y={130} width={68} height={40} fill="#e3eef6" stroke="#8fb3cf" strokeDasharray="3 3" />}
        {step >= 3 && <>{band(step >= 5 ? 96 : 110, step >= 5 ? 108 : 80, MARROW)}{band(step >= 5 ? 82 : 100, 14, 'url(#oss-sp)')}{band(step >= 5 ? 204 : 186, 14, 'url(#oss-sp)')}</>}
        {step >= 4 && <><circle cx={210} cy={50} r={step >= 5 ? 40 : 16} fill="url(#oss-sp)" /><circle cx={210} cy={250} r={step >= 5 ? 40 : 16} fill="url(#oss-sp)" /></>}
        {step >= 5 && <>{band(26, 52, 'url(#oss-sp)')}{band(222, 52, 'url(#oss-sp)')}{step === 5 ? <>{band(78, 6, CARTI)}{band(216, 6, CARTI)}</> : <>{band(80, 2, '#b8975e')}{band(218, 2, '#b8975e')}</>}{band(0, 30, CARTI)}{band(270, 30, CARTI)}</>}
        {step >= 1 && collar(step >= 3 ? (step >= 5 ? 84 : 100) : 125, step >= 3 ? (step >= 5 ? 216 : 200) : 175)}
      </g>
      <path d={OUT} fill="none" stroke="#6b6680" strokeWidth={2} />
      {step >= 2 && step <= 4 && <path d="M110,150 C140,150 160,150 200,150" stroke="#c0392b" strokeWidth={3} fill="none" />}
      {step === 4 && <><path d="M110,50 L196,50" stroke="#c0392b" strokeWidth={2.5} /><path d="M110,250 L196,250" stroke="#c0392b" strokeWidth={2.5} /></>}
      <g style={{ fontSize: 13 }}>
        <text x={310} y={40}><tspan fill="#5d86a8">■</tspan> Knorpel</text>
        <text x={310} y={60}><tspan fill="#b8975e">■</tspan> Knochen</text>
        {step >= 3 && <text x={310} y={80}><tspan fill={MARROW}>■</tspan> Markhöhle</text>}
        {step >= 2 && step <= 4 && <text x={10} y={144} fill="#c0392b">Blutgefäß</text>}
      </g>
    </>
  );
}
const OSS: { when: string; title: string; text: string; draw: ReactNode }[] = [
  ['Embryo', 'Knorpelmodell', 'Zuerst entsteht aus Mesenchym ein Modell des späteren Knochens aus hyalinem Knorpel, umgeben vom Perichondrium.'],
  ['Embryo', 'Perichondrale Knochenmanschette', 'Um die Mitte des Schafts bildet das Perichondrium (jetzt Periost) eine Knochenmanschette – das ist eigentlich desmale Knochenbildung auf dem Knorpel.'],
  ['Embryo', 'Primäres Ossifikationszentrum', 'Im Inneren werden die Knorpelzellen groß (hypertroph), die Matrix verkalkt. Ein Blutgefäß sprosst mit Osteoblasten-Vorläufern ein.'],
  ['Fetus', 'Markhöhle entsteht', 'Der verkalkte Knorpel wird abgebaut und durch Knochen ersetzt (enchondral); im Zentrum bildet sich die Markhöhle. Die Ossifikation breitet sich zu den Enden aus.'],
  ['meist nach der Geburt', 'Sekundäre Ossifikationszentren', 'In den Epiphysen entstehen eigene Verknöcherungszentren, ebenfalls mit einsprossenden Gefäßen.'],
  ['Kindheit und Jugend', 'Epiphysenfugen und Gelenkknorpel bleiben', 'Zwischen Epiphyse und Metaphyse bleibt eine Knorpelscheibe: die Epiphysenfuge, Ort des Längenwachstums. Auf den Gelenkflächen bleibt Knorpel lebenslang erhalten.'],
  ['nach der Pubertät', 'Fugenschluss', 'Die Fugen verknöchern; zurück bleibt die Epiphysenlinie. Längenwachstum ist nicht mehr möglich, Umbau und Dickenwachstum gehen weiter.'],
].map(([when, title, text], i) => ({ when, title, text, draw: <OssDraw step={i} /> }));

export function BoneView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'oss'>('erkunden');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Röhrenknochen'], ['beschriften', 'Beschriften'], ['oss', 'Chondrale Ossifikation']]} />
      {tab === 'erkunden' && <Explore figure="bone" />}
      {tab === 'beschriften' && <LabelDrill figure="bone" />}
      {tab === 'oss' && <Stepper stages={OSS} label="Chondrale Ossifikation" aspect="0 0 420 300" />}
    </div>
  );
}

// ===========================================================================
// Gelenke: Aufbau und Gelenktypen
// ===========================================================================

type JT = { id: string; name: string; axes: number; ex: string; moves: string; draw: ReactNode };
const ax = (x1: number, y1: number, x2: number, y2: number, c: string) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={3} strokeDasharray="7 4" />;
const B = { fill: '#efe2c4', stroke: '#a8916a', strokeWidth: 2 };
const JTYPES: JT[] = [
  { id: 'kugel', name: 'Kugelgelenk', axes: 3, ex: 'Schultergelenk, Hüftgelenk', moves: 'Flexion/Extension, Ab-/Adduktion, Innen-/Außenrotation (und Kombinationen: Zirkumduktion)',
    draw: <><path d="M90,150 C90,210 210,210 210,150 L190,150 C190,190 110,190 110,150 Z" {...B} /><circle cx={150} cy={140} r={38} {...B} /><rect x={140} y={30} width={20} height={72} {...B} />{ax(70, 140, 230, 140, 'var(--eosin)')}{ax(150, 20, 150, 220, 'var(--accent)')}{ax(110, 190, 190, 90, '#2f8f6a')}</> },
  { id: 'ei', name: 'Eigelenk (Ellipsoidgelenk)', axes: 2, ex: 'Proximales Handgelenk (Art. radiocarpalis)', moves: 'Flexion/Extension (Palmar-/Dorsalflexion) und Radial-/Ulnarabduktion',
    draw: <><path d="M70,150 C70,195 230,195 230,150 L212,150 C212,178 88,178 88,150 Z" {...B} /><ellipse cx={150} cy={145} rx={60} ry={28} {...B} /><rect x={135} y={40} width={30} height={80} {...B} />{ax(60, 145, 240, 145, 'var(--eosin)')}{ax(150, 30, 150, 215, '#2f8f6a')}</> },
  { id: 'sattel', name: 'Sattelgelenk', axes: 2, ex: 'Daumensattelgelenk (Art. carpometacarpalis pollicis)', moves: 'Ab-/Adduktion und Opposition/Reposition des Daumens',
    draw: <><path d="M70,170 C110,130 190,130 230,170 L230,200 L70,200 Z" {...B} /><path d="M100,60 C120,110 180,110 200,60 L200,40 L100,40 Z" {...B} transform="translate(0,62)" />{ax(60, 150, 240, 150, 'var(--eosin)')}{ax(150, 40, 150, 220, '#2f8f6a')}</> },
  { id: 'scharnier', name: 'Scharniergelenk', axes: 1, ex: 'Humeroulnargelenk, Interphalangealgelenke', moves: 'nur Flexion und Extension',
    draw: <><rect x={70} y={120} width={160} height={46} rx={23} {...B} /><path d="M80,170 C80,200 220,200 220,170 L220,210 L80,210 Z" {...B} /><rect x={135} y={30} width={30} height={92} {...B} />{ax(40, 143, 260, 143, 'var(--eosin)')}</> },
  { id: 'zapfen', name: 'Zapfen- oder Radgelenk', axes: 1, ex: 'Proximales und distales Radioulnargelenk, Atlantoaxialgelenk (Dens axis)', moves: 'Drehung um die Längsachse (z. B. Pronation/Supination)',
    draw: <><rect x={128} y={40} width={44} height={170} rx={20} {...B} /><ellipse cx={150} cy={126} rx={44} ry={16} fill="none" stroke="#a8916a" strokeWidth={9} />{ax(150, 20, 150, 225, 'var(--accent)')}</> },
  { id: 'plan', name: 'Planes Gelenk', axes: 0, ex: 'Wirbelbogengelenke (teils), Gelenke zwischen Handwurzelknochen', moves: 'kleine Verschiebebewegungen; die Bänder begrenzen den Umfang',
    draw: <><rect x={60} y={86} width={180} height={50} rx={6} {...B} /><rect x={60} y={140} width={180} height={50} rx={6} {...B} /><path d="M100,113 L200,113" stroke="var(--eosin)" strokeWidth={3} markerEnd="url(#jt-a)" markerStart="url(#jt-a)" /><defs><marker id="jt-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--eosin)" /></marker></defs></> },
];

function JointTypes() {
  const [id, setId] = useState('kugel');
  const j = JTYPES.find((x) => x.id === id)!;
  return (
    <div className="card stack">
      <div className="seg" role="tablist" aria-label="Gelenktyp" style={{ flexWrap: 'wrap' }}>{JTYPES.map((x) => <button key={x.id} role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)}>{x.name.split(' ')[0]}</button>)}</div>
      <div className="row" style={{ alignItems: 'center', gap: 18 }}>
        <div className="anat-fig" style={{ flex: '1 1 260px', maxWidth: 340 }}><svg viewBox="0 0 300 230" role="img" aria-label={`Schema ${j.name} mit ${j.axes} Bewegungsachsen`}>{j.draw}</svg></div>
        <div style={{ flex: '1 1 260px' }} aria-live="polite">
          <h3 style={{ marginTop: 0 }}>{j.name}</h3>
          <p><b>{j.axes ? `${j.axes} Hauptachse${j.axes > 1 ? 'n' : ''}` : 'keine feste Achse'}</b> ({j.axes === 3 ? 'dreiachsig' : j.axes === 2 ? 'zweiachsig' : j.axes === 1 ? 'einachsig' : 'Gleitbewegungen'})</p>
          <p><b>Beispiele:</b> {j.ex}</p>
          <p><b>Bewegungen:</b> {j.moves}</p>
        </div>
      </div>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Gestrichelt: Bewegungsachsen. Schema – echte Gelenkflächen sind unregelmäßiger, Bänder und Muskeln schränken die Bewegung zusätzlich ein.</p>
    </div>
  );
}

export function JointsView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'typen'>('erkunden');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Aufbau'], ['beschriften', 'Beschriften'], ['typen', 'Gelenktypen']]} />
      {tab === 'erkunden' && <Explore figure="joint" />}
      {tab === 'beschriften' && <LabelDrill figure="joint" />}
      {tab === 'typen' && <JointTypes />}
    </div>
  );
}

// ===========================================================================
// Muskellehre: Beugen und Strecken, Aufbau, Querschnitt
// ===========================================================================

function FlexExtend() {
  const [deg, setDeg] = useState(20);
  const [prev, setPrev] = useState(20);
  const st = armState(deg);
  const dir = deg > prev ? 'beugen' : deg < prev ? 'strecken' : null;
  const role = (m: 'biceps' | 'brachialis' | 'triceps') => {
    if (!dir) return '–';
    const flexor = m !== 'triceps';
    return (dir === 'beugen') === flexor ? 'Agonist · verkürzt sich' : 'Antagonist · wird gedehnt';
  };
  const set = (v: number) => { setPrev(deg); setDeg(v); };
  return (
    <div className="stack">
      <div className="card stack">
        <label className="field" style={{ margin: 0 }}>
          <span className="lab"><b>Ellenbogen: {Math.round(deg)}° gebeugt</b><span className="muted">0° = gestreckt</span></span>
          <input type="range" min={0} max={140} value={deg} onChange={(e) => set(Number(e.target.value))} aria-label="Beugewinkel im Ellenbogengelenk" />
        </label>
        <div className="row"><button className="small" onClick={() => set(Math.min(140, deg + 30))}>Beugen</button><button className="small" onClick={() => set(Math.max(0, deg - 30))}>Strecken</button></div>
        <table><thead><tr><th>Muskel</th><th>Länge</th><th>Rolle {dir ? `beim ${dir === 'beugen' ? 'Beugen' : 'Strecken'}` : ''}</th></tr></thead>
          <tbody>
            <tr><td>M. biceps brachii</td><td className="num">{Math.round(st.biceps * 100)} %</td><td>{role('biceps')}</td></tr>
            <tr><td>M. brachialis</td><td className="num">{Math.round(st.brachialis * 100)} %</td><td>{role('brachialis')}</td></tr>
            <tr><td>M. triceps brachii</td><td className="num">{Math.round(st.triceps * 100)} %</td><td>{role('triceps')}</td></tr>
          </tbody></table>
        <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Länge relativ zur gestreckten Stellung, aus der Schemazeichnung berechnet – zeigt das Prinzip, keine Messwerte.</p>
      </div>
      <div className="figure anat-fig"><ArmFigure deg={deg} labels /></div>
    </div>
  );
}

export function MuscleAnatomyView() {
  const [tab, setTab] = useState<'bewegen' | 'erkunden' | 'querschnitt' | 'beschriften'>('bewegen');
  const [drill, setDrill] = useState<'muscle' | 'muscle-x'>('muscle');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['bewegen', 'Beugen und Strecken'], ['erkunden', 'Oberarm'], ['querschnitt', 'Querschnitt'], ['beschriften', 'Beschriften']]} />
      {tab === 'bewegen' && <FlexExtend />}
      {tab === 'erkunden' && <Explore figure="muscle" />}
      {tab === 'querschnitt' && <Explore figure="muscle-x" render={(p) => <MuscleXFigure {...p} />} />}
      {tab === 'beschriften' && (
        <div className="stack">
          <div><Tabs value={drill} onChange={setDrill} label="Abbildung" items={[['muscle', 'Oberarm'], ['muscle-x', 'Querschnitt']]} /></div>
          <LabelDrill key={drill} figure={drill} />
        </div>
      )}
    </div>
  );
}
