import { useEffect, useState, type ReactNode } from 'react';
import { lessonById, moduleById, tasksForLesson, GUIDED_EXPERIMENTS } from '../content';
import type { Lesson } from '../content/types';
import { SourceList, useEffectiveStatus } from '../ui/common';
import { FACTCHECK_DATE } from '../content/factcheck';
import { href } from '../ui/router';
import { setState, useStore } from '../store/store';
import { objectiveMastery } from '../store/state';
import { TaskView } from './TaskView';
import * as N from './views/neuroViews';
import * as C from './views/cellViews';
import * as M from './views/molViews';
import * as K from './views/semesterViews';
import * as AN from './views/anatomyViews';
import * as AN2 from './views/anatomy2Views';
import * as CH3 from './views/chem3Views';
import * as K2 from './views/semester2Views';
import { relevanceOf } from '../content/curriculum';

const VIEWS: Record<string, (l: Lesson) => ReactNode> = {
  motion: () => <K2.MotionView />, work: () => <K2.WorkView />, pressure: () => <K2.PressureView />, periodic: () => <K2.PeriodicView />, balance: () => <K2.BalanceView />, microscopy: () => <K2.MicroscopyView />,
  orientation: () => <AN.OrientationView />, embryo: () => <AN.EmbryoView />, bone: () => <AN.BoneView />, joints: () => <AN.JointsView />, 'muscle-anatomy': () => <AN.MuscleAnatomyView />,
  equilibrium: () => <CH3.EquilibriumView />, acidbase2: () => <CH3.AcidBase2View />,
  spinal: () => <AN2.SpinalView />, heart: () => <AN2.HeartView />, vessels: () => <AN2.VesselsView />, trunkwall: () => <AN2.TrunkWallView />, upperlimb: () => <AN2.UpperLimbView />, lowerlimb: () => <AN2.LowerLimbView />,
  sim: (l) => <K.SimView models={l.models} />, cellcycle: () => <K.CellCycleView />, genetics: () => <K.GeneticsView />, tissue: (l) => <K.TissueView ids={l.structures} />, terms: (l) => <K.TermView lesson={l.id} />,
  neuron: () => <N.NeuronView />, membrane: () => <N.MembraneView />, ions: () => <N.IonsView />, rmp: () => <N.RmpView />, ap: () => <N.APView />,
  conduction: () => <N.ConductionView />, synapse: () => <N.SynapseView />, psp: () => <N.PSPView />, nmj: () => <N.NMJView />, ekk: () => <N.EKKView />,
  cell: () => <C.CellView />, transport: () => <C.TransportView />, osmosis: () => <C.OsmosisView />, protein: () => <C.ProteinView />, energy: () => <C.EnergyView />, enzyme: () => <C.EnzymeView />,
  atom: () => <M.AtomView />, bonds: () => <M.BondsView />, molecules: () => <M.MoleculesView />, acidbase: () => <M.AcidBaseView />,
  muscle: () => <M.MusclePhysioView />, circulation: () => <M.CirculationView />, respiration: () => <M.RespirationView />,
};

function Peek({ id, onClose }: { id: string; onClose: () => void }) {
  const l = lessonById(id);
  if (!l) return null;
  return (
    <div className="peek" role="region" aria-label={`Vorschau: ${l.title}`}>
      <div className="row between"><b>{l.title}</b><button className="small ghost" onClick={onClose} aria-label="Vorschau schließen">✕</button></div>
      <p style={{ margin: '6px 0' }}>{l.overview}</p>
      <a className="btn small primary" href={href('lektion', l.id)}>Lektion öffnen</a>
    </div>
  );
}

export function StatusChip({ id, status }: { id: string; status: Lesson['status'] }) {
  const [open, setOpen] = useState(false);
  const st = useEffectiveStatus(id, status);
  if (st === 'freigegeben' || st === 'geprueft') return <span className="badge ok">✓ fachlich geprüft</span>;
  return (
    <span className="status-chip">
      <button aria-expanded={open} onClick={() => setOpen((v) => !v)}>Noch nicht fachlich freigegeben</button>
      {open && (
        <div className="pop" role="note">
          Diese Lektion wurde KI-gestützt anhand der angegebenen Quellen erstellt, am {FACTCHECK_DATE} mit Fachquellen abgeglichen und automatisiert getestet. Eine Prüfung durch eine Fachperson steht noch aus. Bei Abweichungen gilt deine Vorlesung.
          <div className="row" style={{ marginTop: 8 }}><a href="#/pruefbericht">Prüfbericht</a><a href="#/freigabe">Fachliche Freigabe</a><button className="small ghost" onClick={() => setOpen(false)}>Schließen</button></div>
        </div>
      )}
    </span>
  );
}

/** Zeigt, ob das Thema im veröffentlichten Leipziger Plan belegt ist (Lastenheft: Prüfungsrelevanz nur mit Leipziger Quelle). */
export function RelevanceChip({ lesson, semesters }: { lesson: string; semesters: number[] }) {
  const [open, setOpen] = useState(false);
  const r = relevanceOf(lesson, semesters);
  return (
    <span className={`status-chip rel-chip ${r.kind}`}>
      <button aria-expanded={open} onClick={() => setOpen((v) => !v)}>{r.kind === 'belegt' ? '✓ ' : ''}{r.label}</button>
      {open && (
        <div className="pop" role="note">
          {r.detail}
          {r.entry && <div className="muted" style={{ marginTop: 6, fontSize: '0.85rem' }}>Quelle: {r.entry.source.locator}. Belegt ist nur, <i>dass</i> das Thema drankommt – nicht, wie es geprüft wird. Die Übungsfragen hier sind selbst formuliert, keine Leipziger Originalfragen.</div>}
          <div className="row" style={{ marginTop: 8 }}><a href="#/pruefbericht">Prüfbericht</a><button className="small ghost" onClick={() => setOpen(false)}>Schließen</button></div>
        </div>
      )}
    </span>
  );
}

const DIFF = { grundlagen: 'Grundlagen', vertiefung: 'Vertiefung', anwendung: 'Anwendung' } as const;

export function LessonPage({ id }: { id: string }) {
  const l = lessonById(id);
  const [step, setStep] = useState(0);
  const [peek, setPeek] = useState<string | null>(null);
  const note = useStore((s) => s.notes[id] ?? '');
  const prog = useStore((s) => s.lessons[id]);
  const state = useStore((s) => s);
  const steps = l ? [
    { key: 'ueberblick', label: 'Überblick' },
    { key: 'mechanismus', label: 'Mechanismus' },
    ...(l.view && VIEWS[l.view] ? [{ key: 'ausprobieren', label: 'Ausprobieren' }] : []),
    { key: 'vertiefung', label: 'Vertiefung' },
    { key: 'ueben', label: 'Üben' },
  ] : [];
  useEffect(() => {
    setStep(0);
    setPeek(null);
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    if (!l) return;
    setState((s) => {
      const p = s.lessons[id] ?? { levels: [], completed: false, last: 0 };
      return { ...s, lessons: { ...s.lessons, [id]: { ...p, levels: p.levels.includes(step) ? p.levels : [...p.levels, step], last: Date.now() } }, recent: [{ kind: 'lesson' as const, id, t: Date.now() }, ...s.recent.filter((r) => !(r.kind === 'lesson' && r.id === id))].slice(0, 30) };
    });
  }, [id, step, l]);
  if (!l) return <div className="notice danger">Lektion „{id}“ wurde nicht gefunden. <a href="#/bibliothek">Zur Lernbibliothek</a></div>;
  const mod = moduleById(l.module);
  const tasks = tasksForLesson(id);
  const guided = GUIDED_EXPERIMENTS.filter((g) => g.lessons.includes(id));
  const cur = steps[step].key;
  const goStep = (i: number) => { setStep(i); window.scrollTo({ top: 0 }); };
  const complete = () => setState((s) => ({ ...s, lessons: { ...s.lessons, [id]: { ...(s.lessons[id] ?? { levels: [], last: Date.now() }), completed: !s.lessons[id]?.completed } } }));
  const idx = mod ? mod.lessons.indexOf(id) : -1;
  const nextLesson = mod && idx >= 0 ? lessonById(mod.lessons[idx + 1]) : undefined;
  const wide = cur === 'ausprobieren';

  const aside = (
    <aside className="lesson-aside" aria-label="Lernziele und Zusammenhänge">
      <section className="card">
        <h3>Lernziele</h3>
        <ul className="list">
          {l.objectives.map((o) => {
            const tIds = tasks.filter((t) => t.objective === o).map((t) => t.id);
            const m = tIds.length ? objectiveMastery(state, tIds) : 'offen';
            const label = { offen: 'noch offen', begonnen: 'begonnen', unsicher: 'noch unsicher', gefestigt: 'gefestigt' }[m];
            return <li key={o} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', gap: 8 }}><span className={`mastery-dot ${m}`} title={label} aria-label={label} style={{ marginTop: 5 }} /><span>{o}</span></li>;
          })}
        </ul>
      </section>
      <section className="card">
        <h3>Zusammenhänge</h3>
        {l.prerequisites.length > 0 && <p style={{ margin: '0 0 6px' }}>Baut auf: {l.prerequisites.map((p) => <button key={p} className="small" style={{ margin: 2 }} onClick={() => setPeek(p)}>{lessonById(p)?.title}</button>)}</p>}
        <p style={{ margin: 0 }}>Führt weiter zu: {l.links.filter((x) => !l.prerequisites.includes(x)).map((p) => <button key={p} className="small" style={{ margin: 2 }} onClick={() => setPeek(p)}>{lessonById(p)?.title}</button>)}</p>
        {peek && <div style={{ marginTop: 10 }}><Peek id={peek} onClose={() => setPeek(null)} /></div>}
        {guided.length > 0 && <p style={{ margin: '10px 0 0' }}>Experimente: {guided.map((g) => <a key={g.id} className="btn small" style={{ margin: 2 }} href={href('experimente', g.id)}>{g.title}</a>)}</p>}
      </section>
      <details className="card">
        <summary>Meine Notizen{note ? ' ✎' : ''}</summary>
        <textarea value={note} onChange={(e) => setState((s) => ({ ...s, notes: { ...s.notes, [id]: e.target.value } }))} aria-label="Persönliche Notizen zu dieser Lektion" placeholder="Fragen, Merksätze … (bleibt auf diesem Gerät)" />
      </details>
      <details className="card">
        <summary>Quellen</summary>
        <SourceList sources={l.sources} />
      </details>
    </aside>
  );

  return (
    <div>
      <div className="crumbs"><a href="#/bibliothek">Lernen</a> › <a href={href('modul', l.module)}>{mod?.title}</a></div>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ marginBottom: 2 }}>{l.title}</h1>
          <p className="muted" style={{ margin: '0 0 8px' }}>{l.subtitle}</p>
        </div>
        {prog?.completed && <span className="badge ok">✓ abgeschlossen</span>}
      </div>
      <div className="row" style={{ marginBottom: 10 }}>
        <span className="badge">{DIFF[l.difficulty]}</span>
        {mod && <RelevanceChip lesson={l.id} semesters={mod.semesters} />}
        <StatusChip id={`lesson:${l.id}`} status={l.status} />
      </div>
      <nav className="lesson-steps" aria-label="Schritte der Lektion">
        {steps.map((st, i) => (
          <button key={st.key} aria-label={`Schritt ${i + 1}: ${st.label}`} aria-current={i === step ? 'step' : undefined} className={prog?.levels.includes(i) && i !== step ? 'visited' : ''} onClick={() => goStep(i)}>
            <span className="n">{i + 1}</span><span className="lbl">{st.label}</span>
          </button>
        ))}
      </nav>
      <div className={wide ? '' : 'lesson-layout'}>
        <div className="lesson-body">
          {cur === 'ueberblick' && (
            <div>
              <p className="lead">{l.overview}</p>
              <p className="muted">Darum geht es in dieser Lektion: {l.objectives.length} Lernziele, {l.mechanism.length} Mechanismusschritte{l.view ? ', eine interaktive Untersuchung' : ''} und {tasks.length} Aufgaben.</p>
            </div>
          )}
          {cur === 'mechanismus' && <ol className="steps">{l.mechanism.map((m) => <li key={m.title}><b>{m.title}.</b> {m.text}</li>)}</ol>}
          {cur === 'ausprobieren' && l.view && VIEWS[l.view](l)}
          {cur === 'vertiefung' && (
            <div>
              {l.depth.text.map((t, i) => <p key={i}>{t}</p>)}
              {l.depth.equations && <div style={{ margin: '12px 0' }}>{l.depth.equations.map((e) => <div key={e} className="eq">{e}</div>)}</div>}
              {l.depth.pitfalls && <div className="hint-card" style={{ margin: '16px 0' }}><div><b>Typische Missverständnisse</b><ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{l.depth.pitfalls.map((p) => <li key={p}>{p}</li>)}</ul></div></div>}
              <h3>Fachbegriffe</h3>
              <dl style={{ margin: 0 }}>{l.terms.map((t) => <div key={t.term} style={{ marginBottom: 8 }}><dt style={{ fontWeight: 700, display: 'inline' }}>{t.term}</dt>{t.synonyms?.length ? <span className="muted"> ({t.synonyms.join(', ')})</span> : null}: <dd style={{ display: 'inline', margin: 0 }}>{t.def}</dd></div>)}</dl>
            </div>
          )}
          {cur === 'ueben' && (
            <div className="stack">
              <p>Beantworte die Aufgaben zu dieser Lektion. Nach jeder Antwort siehst du eine Erklärung; deine Ergebnisse fließen in den Fortschritt ein.</p>
              {tasks.map((t) => <TaskView key={t.id} task={t} mode="lektion" />)}
            </div>
          )}
          <div className="lesson-nav">
            {step > 0 ? <button onClick={() => goStep(step - 1)}>Zurück: {steps[step - 1].label}</button> : <span />}
            {step < steps.length - 1 ? (
              <button className="primary" onClick={() => goStep(step + 1)}>Weiter: {steps[step + 1].label}</button>
            ) : (
              <div className="row">
                <button className={prog?.completed ? '' : 'primary'} onClick={complete}>{prog?.completed ? 'Als nicht abgeschlossen markieren' : 'Lektion abschließen'}</button>
                {nextLesson && <a className="btn" href={href('lektion', nextLesson.id)}>Nächste Lektion: {nextLesson.title}</a>}
              </div>
            )}
          </div>
        </div>
        {!wide && aside}
      </div>
    </div>
  );
}
