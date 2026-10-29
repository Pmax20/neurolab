import { useMemo, useState } from 'react';
import type { Task } from '../content/types';
import { ERROR_LABEL, LEVEL_LABEL, type AnatomyFigure } from '../content/types';
import { AnatomyFigureView, FIGURE_IDS } from '../ui/anatomyFigures';
import { lessonById, STRUCTURES, structureById } from '../content';
import { grade, type GradeResult } from '../store/grading';
import { recordAttempt, type Attempt } from '../store/state';
import { setState } from '../store/store';
import { modelById } from '../engine/registry';
import { runModel, withDefaults } from '../engine/core';
import { ChartView } from '../ui/Chart';
import { ScalarTable, SourceList } from '../ui/common';
import { NeuronFigure, SynapseFigure } from '../ui/figures';
import { href } from '../ui/router';
import { BalanceBody, CalcBody, CalcSolution, HistoBody, HistoSolution } from './taskKinds';

const DIFFICULTY = { wissen: 1, verstaendnis: 1, anwendung: 2, analyse: 3, verknuepfung: 3 } as const;

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  // garantiert nicht bereits korrekt sortiert
  if (a.every((x, i) => x === arr[i]) && a.length > 1) [a[0], a[1]] = [a[1], a[0]];
  return a;
}

export function TaskView({ task, mode, onDone, compact }: { task: Task; mode: Attempt['mode']; onDone?: (r: GradeResult) => void; compact?: boolean }) {
  const initial = () => (task.type === 'order' || task.type === 'cause' ? seededShuffle(task.items, task.id) : task.type === 'multi' ? [] : task.type === 'match' || task.type === 'label' ? {}
    : task.type === 'calc' ? { seed: task.seed ?? Math.floor(Math.random() * 1e9) } : task.type === 'balance' ? [] : task.type === 'histo' ? { features: [] } : '');
  const [answer, setAnswer] = useState<any>(initial);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | undefined>();
  const [selfScore, setSelfScore] = useState<number | null>(null);

  const diagram = useMemo(() => {
    if (task.type !== 'diagram') return null;
    const m = modelById(task.model)!;
    const r = runModel(m, withDefaults(m, task.params as any));
    return r.charts.find((c) => c.id === task.chart) ?? null;
  }, [task]);

  const predictRun = useMemo(() => {
    if (task.type !== 'predict' || !result) return null;
    const m = modelById(task.model)!;
    const a = runModel(m, withDefaults(m, task.base as any));
    const b = runModel(m, withDefaults(m, { ...task.base, ...task.change } as any));
    return { a, b, m };
  }, [task, result]);

  const submit = () => {
    const r = grade(task, answer);
    setResult(r);
    if (task.type !== 'text') finish(r, r.score);
  };
  const finish = (r: GradeResult, score: number) => {
    setState((s) => recordAttempt(s, { taskId: task.id, t: Date.now(), score, category: score < 0.8 ? r.category ?? task.category : undefined, confidence, mode, answer, difficulty: DIFFICULTY[task.level] }));
    onDone?.({ ...r, score });
  };
  const done = result !== null && (task.type !== 'text' || selfScore !== null);
  const locked = result !== null;

  const mainLesson = lessonById(task.lessons[0]);

  const optionsUI = (opts: { id: string; text: string; why?: string }[], correct: string[], multi: boolean) => (
    <div role={multi ? 'group' : 'radiogroup'} aria-label="Antwortmöglichkeiten">
      {opts.map((o) => {
        const chosen = multi ? (answer as string[]).includes(o.id) : answer === o.id;
        const cls = locked ? (correct.includes(o.id) ? 'correct' : chosen ? 'wrong' : '') : '';
        return (
          <label key={o.id} className={`opt ${cls}`}>
            <input type={multi ? 'checkbox' : 'radio'} name={task.id} checked={chosen} disabled={locked}
              onChange={() => setAnswer(multi ? (chosen ? (answer as string[]).filter((x) => x !== o.id) : [...answer, o.id]) : o.id)} />
            <span>{o.text}{locked && correct.includes(o.id) && <b> ✓</b>}</span>
          </label>
        );
      })}
    </div>
  );

  let body: JSX.Element | null = null;
  switch (task.type) {
    case 'single':
    case 'error':
    case 'predict':
    case 'diagram':
      body = (
        <>
          {task.type === 'diagram' && diagram && <div className="card" style={{ marginBottom: 12 }}><ChartView chart={diagram} /></div>}
          {task.type === 'predict' && <div className="notice info"><b>Veränderung:</b> {task.changeText}. Triff zuerst eine Vorhersage – danach wird die Simulation ausgeführt.</div>}
          {optionsUI(task.options, [task.correct], false)}
        </>
      );
      break;
    case 'multi':
      body = optionsUI(task.options, task.correct, true);
      break;
    case 'match': {
      const rights = seededShuffle([...task.pairs.map((p) => p.right), ...(task.distractors ?? [])], task.id + 'r');
      body = (
        <table><tbody>
          {task.pairs.map((p) => (
            <tr key={p.left}>
              <td style={{ width: '40%' }}><b>{p.left}</b></td>
              <td>
                <select value={answer[p.left] ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, [p.left]: e.target.value })} aria-label={`Zuordnung für ${p.left}`} style={{ width: '100%', borderColor: locked ? (answer[p.left] === p.right ? 'var(--ok)' : 'var(--danger)') : undefined }}>
                  <option value="">– wählen –</option>
                  {rights.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody></table>
      );
      break;
    }
    case 'order':
    case 'cause': {
      const move = (i: number, d: number) => { const a = [...answer]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setAnswer(a); };
      body = (
        <ol style={{ listStyle: 'none', padding: 0 }} aria-label="Reihenfolge – mit den Pfeiltasten-Knöpfen verschieben">
          {(answer as string[]).map((it, i) => (
            <li key={it} className="order-item" style={{ borderColor: locked ? (task.items[i] === it ? 'var(--ok)' : 'var(--danger)') : undefined }}>
              <span className="pos">{i + 1}</span>
              <span className="t">{task.type === 'cause' && i > 0 ? '→ ' : ''}{it}</span>
              <button className="small" onClick={() => move(i, -1)} disabled={locked || i === 0} aria-label={`„${it}“ nach oben`}>↑</button>
              <button className="small" onClick={() => move(i, 1)} disabled={locked || i === answer.length - 1} aria-label={`„${it}“ nach unten`}>↓</button>
            </li>
          ))}
        </ol>
      );
      break;
    }
    case 'label': {
      const anat = task.figure !== 'neuron' && task.figure !== 'synapse';
      const opts = anat ? FIGURE_IDS[task.figure as AnatomyFigure] : STRUCTURES.filter((s) => s.figure === task.figure || (task.figure === 'neuron' && s.figure === 'synapse')).map((s) => s.id);
      body = (
        <>
          <div className="figure" style={{ marginBottom: 12 }}>{anat ? <div className="anat-fig"><AnatomyFigureView figure={task.figure as AnatomyFigure} markers={task.markers} /></div> : task.figure === 'neuron' ? <NeuronFigure sel={null} labels={false} markers={task.markers} /> : <SynapseFigure sel={null} labels={false} markers={task.markers} />}</div>
          <div className="grid cols-3">
            {task.markers.map((m) => (
              <label key={m.n} className="field">
                <span className="lab"><b>Markierung {m.n}</b>{locked && <span>{answer[m.n] === m.structure ? '✓' : `→ ${structureById(m.structure)?.deName}`}</span>}</span>
                <select value={answer[m.n] ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, [m.n]: e.target.value })}>
                  <option value="">– wählen –</option>
                  {opts.map((id) => <option key={id} value={id}>{structureById(id)?.deName}</option>)}
                </select>
              </label>
            ))}
          </div>
        </>
      );
      break;
    }
    case 'formula':
      body = (
        <>
          <div className="eq">{task.givens}</div>
          <div className="row" style={{ marginTop: 8 }}>
            <input type="text" inputMode="decimal" value={answer} disabled={locked} onChange={(e) => setAnswer(e.target.value)} aria-label="Ergebnis" placeholder="Ergebnis" style={{ width: 160 }} onKeyDown={(e) => { if (e.key === 'Enter' && !locked) submit(); }} />
            <span>{task.unit}</span>
          </div>
        </>
      );
      break;
    case 'calc':
      body = <CalcBody task={task} answer={answer} setAnswer={setAnswer} locked={locked} onEnter={submit} />;
      break;
    case 'balance':
      body = <BalanceBody task={task} answer={answer} setAnswer={setAnswer} locked={locked} />;
      break;
    case 'histo':
      body = <HistoBody task={task} answer={answer} setAnswer={setAnswer} locked={locked} />;
      break;
    case 'text':
      body = <textarea value={answer} disabled={locked} onChange={(e) => setAnswer(e.target.value)} aria-label="Freitextantwort" placeholder="Deine Antwort in eigenen Worten …" />;
      break;
  }

  return (
    <article className="card" aria-labelledby={`${task.id}-q`}>
      {!compact && mainLesson && <div className="muted" style={{ fontSize: '0.85rem', marginBottom: 6 }}>{mainLesson.title} · {LEVEL_LABEL[task.level]}</div>}
      <h3 id={`${task.id}-q`} style={{ fontWeight: 600 }}>{task.prompt}</h3>
      {body}
      {!locked && (
        <div className="row" style={{ marginTop: 12 }}>
          <span className="muted" style={{ fontSize: '0.85rem' }}>Wie sicher?</span>
          <div className="seg" role="group" aria-label="Wie sicher bist du?">{([[1, 'unsicher'], [2, 'eher'], [3, 'sicher']] as const).map(([v, l]) => <button key={v} aria-pressed={confidence === v} onClick={() => setConfidence(confidence === v ? undefined : v)}>{l}</button>)}</div>
          <span style={{ flex: 1 }} />
          <button className="primary" onClick={submit}>Antwort prüfen</button>
        </div>
      )}
      {result && (
        <div className={`feedback ${done ? (((selfScore ?? result.score) >= 0.8) ? 'richtig' : (selfScore ?? result.score) > 0 ? '' : 'falsch') : ''}`} role="status" aria-live="polite">
          <div className="verdict">{task.type === 'text' && selfScore === null ? 'Vergleiche mit der Musterlösung' : (selfScore ?? result.score) >= 0.8 ? '✓ Richtig' : (selfScore ?? result.score) > 0 ? '◐ Teilweise richtig' : '✗ Noch nicht richtig'}</div>
          {result.details.map((d, i) => <p key={i} style={{ margin: '6px 0' }}>{d}</p>)}
          {task.type === 'formula' && <p><b>Lösungsweg:</b> {task.solution}</p>}
          {task.type === 'calc' && <CalcSolution task={task} seed={answer.seed} />}
          {task.type === 'histo' && <HistoSolution task={task} answer={answer} />}
          {task.type === 'calc' && <p><button className="small" onClick={() => { setAnswer({ seed: Math.floor(Math.random() * 1e9) }); setResult(null); setConfidence(undefined); }}>Gleiche Aufgabe mit neuen Zahlen</button></p>}
          {task.type === 'text' && (
            <>
              <p><b>Musterlösung:</b> {task.modelAnswer}</p>
              {selfScore === null && (
                <div className="row">
                  <span>Selbstbewertung:</span>
                  <button className="small" onClick={() => { setSelfScore(1); finish(result, 1); }}>Stimmt im Kern</button>
                  <button className="small" onClick={() => { setSelfScore(0.5); finish(result, 0.5); }}>Teilweise</button>
                  <button className="small" onClick={() => { setSelfScore(0); finish(result, 0); }}>Nicht getroffen</button>
                </div>
              )}
            </>
          )}
          {task.type !== 'calc' && task.type !== 'histo' && <p><b>Erklärung:</b> {task.explanation}</p>}
          {predictRun && (
            <div className="stack" style={{ marginTop: 8 }}>
              <b>So sieht es in der Simulation aus</b>
              {predictRun.b.charts[0] && <ChartView chart={predictRun.b.charts[0]} overlays={[{ label: 'Ausgangszustand', chart: predictRun.a.charts[0] }]} height={220} />}
            </div>
          )}
          <details style={{ marginTop: 6 }}>
            <summary className="muted" style={{ fontWeight: 400 }}>Mehr dazu</summary>
            {'options' in task && (task.type === 'single' || task.type === 'diagram' || task.type === 'predict' || task.type === 'multi') && task.options.some((o) => o.why) && (
              <><b>Warum die anderen Antworten nicht passen</b><ul>{task.options.filter((o) => o.why).map((o) => <li key={o.id}><i>{o.text}</i> – {o.why}</li>)}</ul></>
            )}
            {task.type === 'error' && <p>Gesucht war die falsche Aussage: „{task.options.find((o) => o.id === task.correct)?.text}“ – {task.options.find((o) => o.id === task.correct)?.why}</p>}
            {predictRun && <><ScalarTable scalars={predictRun.b.scalars} compare={[{ label: 'Ausgangszustand', scalars: predictRun.a.scalars }]} /><p><a href={href('sim', predictRun.m.id)}>Selbst weiter experimentieren</a></p></>}
            {done && (selfScore ?? result.score) < 0.8 && result.category && <p className="muted" style={{ fontSize: '0.85rem' }}>Mögliche Fehlerart (Arbeitshypothese): {ERROR_LABEL[result.category]}</p>}
            <p>Lernziel: {task.objective}</p>
            <p>Nachlesen: {task.lessons.map((l, i) => <span key={l}>{i > 0 && ' · '}<a href={href('lektion', l)}>{lessonById(l)?.title}</a></span>)}</p>
            <SourceList sources={task.sources} />
          </details>
        </div>
      )}
    </article>
  );
}
