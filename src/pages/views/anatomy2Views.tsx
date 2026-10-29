import { useMemo, useState } from 'react';
import { structureById } from '../../content';
import type { AnatomyFigure } from '../../content/types';
import { ZoomBox } from '../../ui/Zoom';
import { AnatomyFigureView, FIGURE_IDS, LowerLimbFigure, UpperLimbFigure } from '../../ui/anatomyFigures';
import { Explore, LabelDrill, Tabs, shuffle } from './anatomyViews';

// ===========================================================================
// Bausteine
// ===========================================================================

type FlowStep = { id: string | null; title: string; text: string };

/** Schritt für Schritt durch eine Abbildung: die aktuelle Struktur wird hervorgehoben und beschriftet. */
function FlowStepper({ figure, steps, label }: { figure: AnatomyFigure; steps: FlowStep[]; label: string }) {
  const [i, setI] = useState(0);
  const s = steps[i];
  return (
    <div className="stack">
      <div className="card stack" aria-live="polite">
        <div className="row between" style={{ alignItems: 'center' }}>
          <b>{i + 1}. {s.title}</b>
          <div className="row">
            <button className="small" disabled={i === 0} onClick={() => setI(i - 1)}>Zurück</button>
            <button className="small primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>Weiter</button>
          </div>
        </div>
        <p style={{ margin: 0 }}>{s.text}</p>
        <div className="row" role="tablist" aria-label={label} style={{ gap: 4, flexWrap: 'wrap' }}>
          {steps.map((x, k) => <button key={k} className="small" role="tab" aria-selected={k === i} aria-label={x.title} onClick={() => setI(k)} style={{ minWidth: 30, padding: '2px 6px', fontWeight: k === i ? 700 : 400 }}>{k + 1}</button>)}
        </div>
      </div>
      <div className="figure anat-fig"><ZoomBox><AnatomyFigureView figure={figure} sel={s.id} onSel={() => undefined} isolate={!!s.id} labels /></ZoomBox></div>
    </div>
  );
}

type Lesion = { story: string; nerve: string; why: string };

/** Nervenläsion: Fallbeschreibung → welcher Nerv? Danach wird der Nerv in der Abbildung markiert. */
function LesionQuiz({ cases, figure }: { cases: Lesion[]; figure: 'arm' | 'leg' }) {
  const options = useMemo(() => FIGURE_IDS[figure].filter((id) => /-n-/.test(id)), [figure]);
  const [order, setOrder] = useState(() => shuffle(cases.map((_, i) => i)));
  const [k, setK] = useState(0);
  const [ans, setAns] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = k >= order.length;
  const c = cases[order[k]];
  const choose = (id: string) => { if (ans) return; setAns(id); if (id === c.nerve) setScore((x) => x + 1); };
  const Fig = figure === 'arm' ? UpperLimbFigure : LowerLimbFigure;
  return (
    <div className="stack">
      <div className="card stack">
        {done ? (
          <div className="row between"><b>{score} von {order.length} richtig.</b><button className="primary" onClick={() => { setOrder(shuffle(order)); setK(0); setAns(null); setScore(0); }}>Noch einmal</button></div>
        ) : (
          <>
            <div className="drill-q">{c.story} <b>Welcher Nerv ist betroffen?</b></div>
            <div className="row" style={{ flexWrap: 'wrap' }}>{options.map((o) => <button key={o} className={ans ? (o === c.nerve ? 'primary' : '') : ''} aria-pressed={ans === o} onClick={() => choose(o)}>{structureById(o)?.deName}</button>)}</div>
            {ans && <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ans === c.nerve ? 'var(--ok)' : 'var(--danger)' }}>{ans === c.nerve ? 'Richtig.' : `Nicht ganz – ${structureById(c.nerve)?.deName}.`}</b> {c.why}</p>}
            <div className="row between"><span className="muted">{k + 1} / {order.length} · {score} richtig</span>{ans && <button className="primary" onClick={() => { setK((x) => x + 1); setAns(null); }}>Weiter</button>}</div>
          </>
        )}
      </div>
      <div className="figure anat-fig"><ZoomBox><Fig sel={ans && !done ? c.nerve : null} isolate={!!ans && !done} labels={!!ans} /></ZoomBox></div>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Erfundene Lernfälle zum Prinzip „Nerv → Muskel → Ausfall“. Keine Diagnose; echte Befunde hängen von Höhe und Ausmaß der Schädigung ab.</p>
    </div>
  );
}

// ===========================================================================
// Nervensystem
// ===========================================================================

const REFLEX: FlowStep[] = [
  { id: 'n-ramus-anterior', title: 'Reiz in der Peripherie', text: 'Beim Patellarsehnenreflex dehnt der Schlag auf die Sehne den M. quadriceps. Muskelspindeln melden das über sensible Fasern, die mit dem Spinalnerv laufen.' },
  { id: 'n-spinalganglion', title: 'Spinalganglion', text: 'Hier liegt der Zellkörper des sensiblen (pseudounipolaren) Neurons. Eine Umschaltung findet hier nicht statt.' },
  { id: 'n-radix-posterior', title: 'Hintere Wurzel', text: 'Die afferente Faser tritt über die hintere Wurzel ins Rückenmark ein.' },
  { id: 'n-hinterhorn', title: 'Durch das Hinterhorn', text: 'Viele sensible Fasern werden im Hinterhorn umgeschaltet. Beim Dehnungsreflex zieht die Faser aber weiter bis ins Vorderhorn.' },
  { id: 'n-vorderhorn', title: 'Vorderhorn: Synapse auf das Motoneuron', text: 'Die Afferenz bildet direkt eine Synapse mit dem α-Motoneuron – ein monosynaptischer Reflex.' },
  { id: 'n-radix-anterior', title: 'Vordere Wurzel', text: 'Das Axon des Motoneurons verlässt das Rückenmark über die vordere Wurzel.' },
  { id: 'n-spinalnerv', title: 'Spinalnerv', text: 'Im Foramen intervertebrale laufen motorische und sensible Fasern gemeinsam im Spinalnerv.' },
  { id: 'n-ramus-anterior', title: 'Zurück zum Muskel', text: 'Über den vorderen Ast (beim Bein über den Plexus lumbalis und N. femoralis) erreicht der Befehl den Muskel: Der Quadriceps kontrahiert, das Knie streckt sich.' },
];

export function SpinalView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'reflex'>('erkunden');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Querschnitt'], ['beschriften', 'Beschriften'], ['reflex', 'Reflexbogen']]} />
      {tab === 'erkunden' && <Explore figure="spinal" />}
      {tab === 'beschriften' && <LabelDrill figure="spinal" />}
      {tab === 'reflex' && <FlowStepper figure="spinal" steps={REFLEX} label="Schritte des Reflexbogens" />}
    </div>
  );
}

// ===========================================================================
// Herz
// ===========================================================================

const BLOOD_FLOW: FlowStep[] = [
  { id: 'c-vena-cava-sup', title: 'Hohlvenen', text: 'Sauerstoffarmes Blut aus dem Körper kommt über die obere und untere Hohlvene.' },
  { id: 'c-rechter-vorhof', title: 'Rechter Vorhof', text: 'Er sammelt das Blut – auch aus den Herzvenen über den Sinus coronarius.' },
  { id: 'c-trikuspidal', title: 'Trikuspidalklappe', text: 'Die Segelklappe öffnet sich in der Diastole; in der Systole schließt sie und verhindert den Rückfluss.' },
  { id: 'c-rechter-ventrikel', title: 'Rechte Kammer', text: 'Sie pumpt gegen den niedrigen Druck des Lungenkreislaufs – deshalb die dünne Wand.' },
  { id: 'c-pulmonalklappe', title: 'Pulmonalklappe', text: 'Taschenklappe am Ausgang der rechten Kammer.' },
  { id: 'c-truncus-pulmonalis', title: 'Truncus pulmonalis', text: 'Teilt sich in die rechte und linke Lungenarterie. In der Lunge wird das Blut mit Sauerstoff beladen.' },
  { id: 'c-venae-pulmonales', title: 'Lungenvenen', text: 'Sauerstoffreiches Blut fließt zurück zum Herzen.' },
  { id: 'c-linker-vorhof', title: 'Linker Vorhof', text: 'Er bildet den größten Teil der Herzhinterwand.' },
  { id: 'c-mitral', title: 'Mitralklappe', text: 'Die zweisegelige Klappe zwischen linkem Vorhof und linker Kammer.' },
  { id: 'c-linker-ventrikel', title: 'Linke Kammer', text: 'Die dickste Wand des Herzens – sie arbeitet gegen den hohen Druck des Körperkreislaufs.' },
  { id: 'c-aortenklappe', title: 'Aortenklappe', text: 'Direkt oberhalb entspringen die Herzkranzarterien.' },
  { id: 'c-aorta', title: 'Aorta', text: 'Von hier wird das Blut im ganzen Körper verteilt.' },
];

const CONDUCTION: FlowStep[] = [
  { id: 'c-sinusknoten', title: 'Sinusknoten', text: 'Der primäre Schrittmacher im rechten Vorhof erzeugt in Ruhe etwa 60–80 Erregungen pro Minute.' },
  { id: 'c-rechter-vorhof', title: 'Vorhofmuskulatur', text: 'Die Erregung breitet sich über beide Vorhöfe aus; sie kontrahieren sich.' },
  { id: 'c-av-knoten', title: 'AV-Knoten', text: 'Einzige Verbindung zu den Kammern – das Herzskelett isoliert sonst. Er verzögert die Erregung, damit die Kammern erst nach den Vorhöfen kontrahieren.' },
  { id: 'c-his', title: 'His-Bündel, Tawara-Schenkel, Purkinje-Fasern', text: 'Das His-Bündel zieht ins Septum und teilt sich in den rechten und linken Tawara-Schenkel. Die Purkinje-Fasern verteilen die Erregung von der Herzspitze zur Basis.' },
  { id: 'c-linker-ventrikel', title: 'Kammermuskulatur', text: 'Die Kammern kontrahieren von der Spitze her – das Blut wird zu den Ausflussbahnen gedrückt.' },
];

export function HeartView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'blut' | 'erregung'>('erkunden');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Aufbau'], ['beschriften', 'Beschriften'], ['blut', 'Blutweg'], ['erregung', 'Erregungsleitung']]} />
      {tab === 'erkunden' && <Explore figure="heart" />}
      {tab === 'beschriften' && <LabelDrill figure="heart" />}
      {tab === 'blut' && <FlowStepper figure="heart" steps={BLOOD_FLOW} label="Stationen des Blutwegs" />}
      {tab === 'erregung' && <FlowStepper figure="heart" steps={CONDUCTION} label="Stationen der Erregungsleitung" />}
    </div>
  );
}

// ===========================================================================
// Kreislauf und Gefäße
// ===========================================================================

const FETAL: [string, string, string][] = [
  ['Nabelvene (V. umbilicalis)', 'bringt sauerstoffreiches Blut von der Plazenta', 'Lig. teres hepatis'],
  ['Ductus venosus', 'leitet Blut an der Leber vorbei in die untere Hohlvene', 'Lig. venosum'],
  ['Foramen ovale', 'Blut fließt vom rechten direkt in den linken Vorhof', 'Fossa ovalis'],
  ['Ductus arteriosus', 'Blut aus dem Truncus pulmonalis fließt an der Lunge vorbei in die Aorta', 'Lig. arteriosum'],
  ['Nabelarterien (Aa. umbilicales)', 'bringen das Blut zurück zur Plazenta', 'Ligg. umbilicalia medialia'],
];

export function VesselsView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'fetal'>('erkunden');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Große Gefäße'], ['beschriften', 'Beschriften'], ['fetal', 'Fetaler Kreislauf']]} />
      {tab === 'erkunden' && <Explore figure="vessels" />}
      {tab === 'beschriften' && <LabelDrill figure="vessels" />}
      {tab === 'fetal' && (
        <div className="card stack">
          <p style={{ margin: 0 }}>Vor der Geburt ist die Lunge nicht belüftet; die Plazenta übernimmt den Gasaustausch. Drei Kurzschlüsse (Shunts) leiten das Blut an Leber und Lunge vorbei. Nach der Geburt verschließen sie sich und bleiben als Bänder oder Gruben erhalten.</p>
          <table><thead><tr><th>Struktur</th><th>Funktion beim Fetus</th><th>Rest nach der Geburt</th></tr></thead>
            <tbody>{FETAL.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>
          <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Merke: Das Foramen ovale schließt sich, wenn nach dem ersten Atemzug der Druck im linken Vorhof über den im rechten steigt.</p>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Rumpfwand
// ===========================================================================

export function TrunkWallView() {
  const [tab, setTab] = useState<'wirbel' | 'thorax' | 'beschriften'>('wirbel');
  const [drill, setDrill] = useState<'spine' | 'trunk'>('spine');
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['wirbel', 'Wirbelsäule'], ['thorax', 'Brustkorb und Bauchwand'], ['beschriften', 'Beschriften']]} />
      {tab === 'wirbel' && <Explore figure="spine" />}
      {tab === 'thorax' && <Explore figure="trunk" />}
      {tab === 'beschriften' && (
        <div className="stack">
          <div><Tabs value={drill} onChange={setDrill} label="Abbildung" items={[['spine', 'Wirbelsäule'], ['trunk', 'Brustkorb und Bauchwand']]} /></div>
          <LabelDrill key={drill} figure={drill} />
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Obere und untere Extremität
// ===========================================================================

const ARM_CASES: Lesion[] = [
  { story: 'Nach einem Oberarmschaftbruch kann Herr K. Hand und Finger nicht mehr strecken; die Hand hängt herab.', nerve: 'o-n-radialis', why: 'Der N. radialis läuft spiralig direkt am Humerusschaft und versorgt alle Strecker – Fallhand.' },
  { story: 'Frau M. hat nachts Kribbeln in Daumen, Zeige- und Mittelfinger; der Daumenballen ist schwächer geworden.', nerve: 'o-n-medianus', why: 'Typisch für eine Einengung des N. medianus im Karpaltunnel.' },
  { story: 'Nach einem Stoß gegen die Innenseite des Ellenbogens sind die kleinen Handmuskeln geschwächt; Ring- und Kleinfinger stehen gekrallt.', nerve: 'o-n-ulnaris', why: 'Der N. ulnaris liegt hinter dem Epicondylus medialis ungeschützt – Krallenhand.' },
  { story: 'Nach einer ausgerenkten Schulter kann Frau S. den Arm kaum seitlich anheben; die Haut außen über der Schulter ist taub.', nerve: 'o-n-axillaris', why: 'Der N. axillaris umschlingt den Humerushals und versorgt den M. deltoideus.' },
  { story: 'Die Beugung im Ellenbogen ist deutlich schwächer, der Bizepssehnenreflex fehlt, die Haut am seitlichen Unterarm ist taub.', nerve: 'o-n-musculocutaneus', why: 'Der N. musculocutaneus versorgt Bizeps und Brachialis und endet als Hautnerv am lateralen Unterarm.' },
  { story: 'Nach einer Verletzung am Oberarm kann Herr B. beim Faustschluss Daumen, Zeige- und Mittelfinger nicht beugen.', nerve: 'o-n-medianus', why: 'Ausfall des N. medianus weit proximal: „Schwurhand“, weil die langen Fingerbeuger für diese Finger fehlen.' },
];

const LEG_CASES: Lesion[] = [
  { story: 'Nach einem zu engen Unterschenkelgips hängt der Fuß herab; beim Gehen hebt der Patient das Knie besonders hoch.', nerve: 'u-n-fibularis', why: 'Der N. fibularis communis liegt am Fibulaköpfchen direkt unter der Haut. Ausfall der Fußheber: Fallfuß, Steppergang.' },
  { story: 'Die Patientin kann sich nicht auf die Zehenspitzen stellen; die Fußsohle fühlt sich taub an.', nerve: 'u-n-tibialis', why: 'Der N. tibialis versorgt den M. triceps surae und die Haut der Fußsohle.' },
  { story: 'Das Knie kann nicht aktiv gestreckt werden, und der Patellarsehnenreflex fehlt.', nerve: 'u-n-femoralis', why: 'Der N. femoralis innerviert den M. quadriceps femoris.' },
  { story: 'Nach einer falsch gesetzten Spritze ins Gesäß sind Kniebeugung sowie alle Muskeln an Unterschenkel und Fuß geschwächt.', nerve: 'u-n-ischiadicus', why: 'Der N. ischiadicus zieht unter dem M. glutaeus maximus nach unten; seine Äste versorgen alle Muskeln unterhalb des Knies. Deshalb spritzt man in den oberen äußeren Quadranten bzw. ventroglutäal.' },
];

const CARPALS = ['o-scaphoid', 'o-lunatum', 'o-triquetrum', 'o-pisiforme', 'o-trapezium', 'o-trapezoideum', 'o-capitatum', 'o-hamatum'];

export function UpperLimbView() {
  const [tab, setTab] = useState<'erkunden' | 'beschriften' | 'hand' | 'laesion'>('erkunden');
  const [nv, setNv] = useState(true);
  const ids = FIGURE_IDS.arm.filter((id) => nv || !id.startsWith('o-n-'));
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Arm'], ['beschriften', 'Beschriften'], ['hand', 'Handwurzel'], ['laesion', 'Nervenläsionen']]} />
      {tab === 'erkunden' && <Explore figure="arm" ids={ids} toolbar={<button className="small" aria-pressed={nv} onClick={() => setNv((v) => !v)}>Nerven</button>} render={(p) => <UpperLimbFigure {...p} nerves={nv} />} />}
      {tab === 'beschriften' && <LabelDrill figure="arm" />}
      {tab === 'hand' && (
        <div className="stack">
          <p className="card" style={{ margin: 0 }}>Proximale Reihe von der Daumen- zur Kleinfingerseite: Kahnbein, Mondbein, Dreiecksbein, Erbsenbein. Distale Reihe: großes Vieleckbein, kleines Vieleckbein, Kopfbein, Hakenbein. Merkspruch: „Ein Kahn, der fuhr im Mondenschein dreieckig um das Erbsenbein, Vieleck groß und Vieleck klein, ein Kopf, der muss beim Haken sein.“</p>
          <LabelDrill figure="arm" ids={CARPALS} />
        </div>
      )}
      {tab === 'laesion' && <LesionQuiz cases={ARM_CASES} figure="arm" />}
    </div>
  );
}

export function LowerLimbView() {
  const [tab, setTab] = useState<'erkunden' | 'knie' | 'beschriften' | 'laesion'>('erkunden');
  const [drill, setDrill] = useState<'leg' | 'knee'>('leg');
  const [nv, setNv] = useState(true);
  const ids = FIGURE_IDS.leg.filter((id) => nv || !id.startsWith('u-n-'));
  return (
    <div className="stack">
      <Tabs value={tab} onChange={setTab} label="Modus" items={[['erkunden', 'Bein'], ['knie', 'Kniegelenk'], ['beschriften', 'Beschriften'], ['laesion', 'Nervenläsionen']]} />
      {tab === 'erkunden' && <Explore figure="leg" ids={ids} toolbar={<button className="small" aria-pressed={nv} onClick={() => setNv((v) => !v)}>Nerven</button>} render={(p) => <LowerLimbFigure {...p} nerves={nv} />} />}
      {tab === 'knie' && <Explore figure="knee" />}
      {tab === 'beschriften' && (
        <div className="stack">
          <div><Tabs value={drill} onChange={setDrill} label="Abbildung" items={[['leg', 'Bein'], ['knee', 'Kniegelenk']]} /></div>
          <LabelDrill key={drill} figure={drill} />
        </div>
      )}
      {tab === 'laesion' && <LesionQuiz cases={LEG_CASES} figure="leg" />}
    </div>
  );
}
