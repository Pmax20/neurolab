import { useMemo, useRef, useState } from 'react';
import { GUIDED_EXPERIMENTS, LESSONS, lessonById, taskById } from '../content';
import { MODELS, modelById } from '../engine/registry';
import { runModel, validateParams, withDefaults } from '../engine/core';
import type { ParamValues, SimResult } from '../engine/types';
import { Workbench } from '../ui/Workbench';
import { ChartView, fmt } from '../ui/Chart';
import { ScalarTable, download } from '../ui/common';
import { href, go } from '../ui/router';
import { getState, setState, useStore } from '../store/store';
import { uid, type SavedExperiment } from '../store/state';
import { TaskView } from './TaskView';
import { APView, ConductionView, EKKView, NMJView, RmpView, SynapseView } from './views/neuroViews';

const SPECIAL: Record<string, () => JSX.Element> = { aktionspotenzial: () => <APView />, erregungsleitung: () => <ConductionView />, 'chemische-synapse': () => <SynapseView />, endplatte: () => <NMJView />, querbrueckenzyklus: () => <EKKView />, ruhemembranpotenzial: () => <RmpView /> };

export function SimPage({ id }: { id: string }) {
  const m = modelById(id);
  if (!m) return <div className="notice danger">Simulation „{id}“ nicht gefunden. <a href="#/modelle">Zur Modellbibliothek</a></div>;
  const lessons = LESSONS.filter((l) => l.models.includes(id));
  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="crumbs"><a href="#/modelle">Modellbibliothek</a> › {m.title}</div>
          <h1>{m.title}</h1>
          <p className="muted" style={{ margin: 0 }}>{m.purpose}</p>
        </div>
        <div className="row">{lessons.map((l) => <a key={l.id} className="btn small" href={href('lektion', l.id)}>Lektion: {l.title}</a>)}</div>
      </div>
      {SPECIAL[id] ? SPECIAL[id]() : <Workbench model={m} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

export function ExperimentsPage({ sub }: { sub?: string }) {
  if (sub && sub.startsWith('frei')) return <FreeExperiment expId={sub.split(':')[1]} />;
  if (sub === 'vergleich') return <Compare />;
  if (sub) return <GuidedFlow id={sub} />;
  return <ExperimentsHome />;
}

function ExperimentsHome() {
  const exps = useStore((s) => s.experiments);
  const [chosen, setChosen] = useState<string[]>([]);
  const chosenModels = new Set(exps.filter((e) => chosen.includes(e.id)).map((e) => e.model));
  return (
    <div className="stack" style={{ maxWidth: 860 }}>
      <div className="page-head">
        <div><h1>Experimente</h1><p className="muted" style={{ margin: 0 }}>Frage stellen, Vorhersage treffen, simulieren, vergleichen.</p></div>
        <a className="btn" href={href('experimente', 'frei')}>Freies Experiment</a>
      </div>
      <ul className="rows">
        {GUIDED_EXPERIMENTS.map((g, i) => {
          const done = exps.some((e) => e.guidedId === g.id);
          return (
            <li key={g.id}>
              <a href={href('experimente', g.id)}>
                <span className="num-circle" aria-hidden="true">{done ? '✓' : i + 1}</span>
                <div className="grow"><div className="t">{g.title}</div><div className="d">{g.question}</div></div>
                {done && <span className="sr-only">abgeschlossen</span>}
                <span className="muted" aria-hidden="true">›</span>
              </a>
            </li>
          );
        })}
      </ul>
      {exps.length > 0 && (
        <section className="card">
          <h3>Deine gespeicherten Szenarien</h3>
          <ul className="rows">
            {[...exps].reverse().map((e) => {
              const m = modelById(e.model);
              const valid = m ? validateParams(m, withDefaults(m, e.params)).length === 0 : false;
              return (
                <li key={e.id}><div className="row-inner">
                  <input type="checkbox" checked={chosen.includes(e.id)} onChange={() => setChosen((c) => (c.includes(e.id) ? c.filter((x) => x !== e.id) : [...c, e.id]))} aria-label={`${e.name} zum Vergleich auswählen`} />
                  <div className="grow">
                    <div className="t">{e.name}</div>
                    <div className="d">{m?.title.split(' (')[0] ?? e.model} · {new Date(e.createdAt).toLocaleDateString('de-DE')}{e.hypothesisCorrect !== undefined && (e.hypothesisCorrect ? ' · Vorhersage ✓' : ' · Vorhersage ✗')}</div>
                    {!valid && <div className="notice danger" style={{ margin: '4px 0' }}>{m ? 'Parameter außerhalb der zulässigen Bereiche (ältere Modellversion) – nicht direkt ausführbar.' : 'Das zugehörige Modell existiert nicht mehr.'}</div>}
                  </div>
                  {valid && <a className="btn small" href={href('experimente', `frei:${e.id}`)}>Öffnen</a>}
                  <details className="menu">
                    <summary aria-label={`Weitere Aktionen für ${e.name}`}>⋯</summary>
                    <div className="menu-pop">
                      <button className="small" onClick={() => { const n = prompt('Neuer Name', e.name); if (n) setState((s) => ({ ...s, experiments: s.experiments.map((x) => (x.id === e.id ? { ...x, name: n } : x)) })); }}>Umbenennen</button>
                      <button className="small" onClick={() => download(`${e.name.replace(/[^\wäöüÄÖÜß -]/g, '')}.md`, protocolMarkdown(e), 'text/markdown')}>Protokoll herunterladen</button>
                      <button className="small" onClick={() => setState((s) => ({ ...s, experiments: s.experiments.filter((x) => x.id !== e.id) }))} aria-label={`${e.name} löschen`}>Löschen</button>
                    </div>
                  </details>
                </div></li>
              );
            })}
          </ul>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Zwei Szenarien desselben Modells ankreuzen, um sie zu vergleichen.</p>
          <div className="row" style={{ marginTop: 6 }}>
            <button className="primary" disabled={chosen.length < 2 || chosenModels.size !== 1} onClick={() => { sessionStorage.setItem('neurolab.compare', JSON.stringify(chosen)); go('experimente', 'vergleich'); }}>Ausgewählte vergleichen ({chosen.length})</button>
            {chosen.length >= 2 && chosenModels.size !== 1 && <span className="muted">Nur Szenarien desselben Modells lassen sich vergleichen.</span>}
          </div>
        </section>
      )}
    </div>
  );
}

export function protocolMarkdown(e: SavedExperiment) {
  const m = modelById(e.model);
  const lines = [
    `# Experimentprotokoll: ${e.name}`,
    '',
    `*Lernprotokoll aus NeuroLab – keine wissenschaftlich validierte Laboraufzeichnung.*`,
    '',
    `- Modell: ${m?.title ?? e.model} (Version ${e.modelVersion})`,
    `- Datum: ${new Date(e.createdAt).toLocaleString('de-DE')}`,
    '',
    `## Fragestellung`, e.question ?? '–', '',
    `## Hypothese`, e.hypothesis ? `${e.hypothesis}${e.hypothesisCorrect !== undefined ? ` (${e.hypothesisCorrect ? 'bestätigt' : 'nicht bestätigt'})` : ''}` : '–', '',
    `## Ausgangsbedingungen und veränderte Parameter`,
    ...(m ? m.params.map((p) => `- ${p.label}: ${String(e.params[p.key] ?? p.default)} ${p.unit}${e.params[p.key] !== undefined && e.params[p.key] !== p.default ? ' **(verändert, Standard: ' + p.default + ')**' : ''}`) : []),
    '',
    `## Ergebnis`,
    ...(e.resultSummary ? Object.values(e.resultSummary).map((v) => `- ${v.label}: ${typeof v.value === 'number' ? fmt(v.value) : v.value} ${v.unit}`) : ['–']),
    '',
    `## Interpretation`, e.interpretation ?? '–', '',
    `## Offene Fragen`, e.openQuestions ?? '–', '',
    `## Modellannahmen`, ...(m?.assumptions.map((a) => `- ${a}`) ?? []),
  ];
  return lines.join('\n');
}

function FreeExperiment({ expId }: { expId?: string }) {
  const exps = useStore((s) => s.experiments);
  const e = expId ? exps.find((x) => x.id === expId) : undefined;
  const [modelId, setModelId] = useState(e?.model ?? 'aktionspotenzial');
  const m = modelById(modelId)!;
  return (
    <div className="stack">
      <div className="page-head">
        <div><div className="crumbs"><a href="#/experimente">Experimentiermodus</a> › Freies Experiment</div><h1>Freies Experiment{e ? `: ${e.name}` : ''}</h1></div>
        <label className="row"><span>Modell:</span>
          <select value={modelId} onChange={(ev) => setModelId(ev.target.value)} disabled={!!e}>{MODELS.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select>
        </label>
      </div>
      <p className="muted">Modell wählen, Regler verändern, mit „Szenario speichern“ zum Vergleichen ablegen.</p>
      <Workbench key={modelId + (e?.id ?? '')} model={m} initial={e?.params} />
    </div>
  );
}

function Compare() {
  const exps = useStore((s) => s.experiments);
  const ids: string[] = JSON.parse(sessionStorage.getItem('neurolab.compare') ?? '[]');
  const list = exps.filter((e) => ids.includes(e.id));
  if (list.length < 2) return <div className="notice">Bitte mindestens zwei gespeicherte Szenarien auswählen. <a href="#/experimente">Zurück</a></div>;
  const m = modelById(list[0].model)!;
  const runs = list.map((e) => ({ e, r: runModel(m, withDefaults(m, e.params)) }));
  const base = runs[0];
  const changed = m.params.filter((p) => runs.some((x) => x.r.ok && String(withDefaults(m, x.e.params)[p.key]) !== String(withDefaults(m, base.e.params)[p.key])));
  const guided = GUIDED_EXPERIMENTS.find((g) => g.model === m.id && list.some((e) => e.guidedId === g.id));
  return (
    <div className="stack">
      <div className="page-head"><div><div className="crumbs"><a href="#/experimente">Experimentiermodus</a> › Vergleich</div><h1>Szenarienvergleich: {m.title}</h1></div></div>
      {runs.some((x) => !x.r.ok) && <div className="notice danger">Mindestens ein Szenario konnte nicht berechnet werden und wird nicht angezeigt.</div>}
      <section className="card">
        <h3>Veränderte Parameter</h3>
        {changed.length ? (
          <table><thead><tr><th>Parameter</th>{runs.map((x) => <th key={x.e.id}>{x.e.name}</th>)}</tr></thead>
            <tbody>{changed.map((p) => <tr key={p.key}><td>{p.label} {p.unit && `[${p.unit}]`}</td>{runs.map((x) => <td key={x.e.id} className="num">{String(withDefaults(m, x.e.params)[p.key])}</td>)}</tr>)}</tbody></table>
        ) : <p className="muted">Die Szenarien unterscheiden sich nicht in ihren Parametern.</p>}
      </section>
      {base.r.ok && base.r.charts.map((c) => (
        <div className="card" key={c.id}>
          <ChartView chart={{ ...c, title: `${c.title} – durchgezogen: ${base.e.name}` }} overlays={runs.slice(1).filter((x) => x.r.ok).map((x) => ({ label: x.e.name, chart: x.r.charts.find((cc) => cc.id === c.id)! })).filter((o) => o.chart)} />
        </div>
      ))}
      <section className="card">
        <h3>Berechnete Ergebnisse</h3>
        {base.r.ok && <ScalarTable scalars={base.r.scalars} compare={runs.slice(1).filter((x) => x.r.ok).map((x) => ({ label: x.e.name, scalars: x.r.scalars }))} />}
        <p className="muted" style={{ fontSize: '0.85rem' }}>Spalte „aktuell“ = {base.e.name}.</p>
      </section>
      <section className="card">
        <h3>Erklärung der relevanten Mechanismen</h3>
        {guided && <p>{guided.explanation}</p>}
        <ul>{changed.map((p) => <li key={p.key}><b>{p.label}:</b> {p.description}</li>)}</ul>
        <p className="muted" style={{ fontSize: '0.85rem' }}>Unterschiede gelten innerhalb der Modellannahmen: {m.assumptions.join('; ')}.</p>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

const STEP_TITLES = ['Fragestellung lesen', 'Ausgangszustand untersuchen', 'Hypothese formulieren', 'Parameter verändern', 'Simulation ausführen', 'Ergebnis beobachten', 'Mit der Vorhersage vergleichen', 'Mechanismus erklären', 'Transferfrage'];

function GuidedFlow({ id }: { id: string }) {
  const g = GUIDED_EXPERIMENTS.find((x) => x.id === id);
  const [step, setStep] = useState(0);
  const [hyp, setHyp] = useState<string | null>(null);
  const [hypText, setHypText] = useState('');
  const [expId, setExpId] = useState<string | null>(null);
  const [result, setResult] = useState<{ r: SimResult; p: ParamValues } | null>(null);
  const [interp, setInterp] = useState('');
  const [openQ, setOpenQ] = useState('');
  const current = useRef<ParamValues | null>(null);
  const m = g ? modelById(g.model)! : null;
  const startParams = useMemo(() => (m && g ? withDefaults(m, g.start as any) : {}), [m, g]);
  const startRun = useMemo(() => (m ? runModel(m, startParams as ParamValues) : null), [m, startParams]);
  const [wbInit, setWbInit] = useState<Record<string, any> | undefined>(undefined);
  if (!g || !m || !startRun) return <div className="notice danger">Experiment nicht gefunden. <a href="#/experimente">Zurück</a></div>;
  const transfer = taskById(g.transferTask);

  const saveHypothesis = () => {
    const h = g.hypothesisOptions.find((o) => o.id === hyp)?.text ?? hypText;
    const nid = uid('exp');
    setExpId(nid);
    setState((s) => ({ ...s, experiments: [...s.experiments, { id: nid, model: m.id, modelVersion: m.version, name: `${g.title} (geführt)`, params: startParams as any, createdAt: Date.now(), guidedId: g.id, question: g.question, hypothesis: h + (hypText && hyp ? ` – Begründung: ${hypText}` : '') }] }));
    setStep(3);
  };
  const run = () => {
    const p = current.current ?? (startParams as ParamValues);
    const r = runModel(m, p);
    setResult({ r, p });
    if (r.ok && expId) setState((s) => ({ ...s, experiments: s.experiments.map((e) => (e.id === expId ? { ...e, params: p as any, resultSummary: Object.fromEntries(Object.entries(r.scalars).map(([k, v]) => [k, { label: v.label, value: v.value, unit: v.unit }])) } : e)) }));
    setStep(5);
  };
  const finishCompare = () => {
    if (expId) setState((s) => ({ ...s, experiments: s.experiments.map((e) => (e.id === expId ? { ...e, hypothesisCorrect: hyp === g.correctHypothesis } : e)) }));
    setStep(7);
  };
  const saveProtocol = () => {
    if (expId) setState((s) => ({ ...s, experiments: s.experiments.map((e) => (e.id === expId ? { ...e, interpretation: interp, openQuestions: openQ } : e)) }));
  };

  return (
    <div className="stack">
      <div className="page-head"><div><div className="crumbs"><a href="#/experimente">Experimentiermodus</a> › Geführtes Experiment</div><h1>{g.title}</h1></div></div>
      <ol className="steps card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 4 }} aria-label="Ablauf">
        {STEP_TITLES.map((t, i) => <li key={t} className={i === step ? 'active' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>{t}</li>)}
      </ol>

      {step === 0 && (
        <section className="card">
          <h3>1. Fragestellung</h3>
          <p style={{ fontSize: '1.1rem' }}>{g.question}</p>
          <p className="muted">Modell: {m.title} ({m.modelType === 'ausführlich' ? 'ausführlichere Berechnung' : 'vereinfachtes Lehrmodell'}).</p>
          <button className="primary" onClick={() => setStep(1)}>Weiter: Ausgangszustand</button>
        </section>
      )}
      {step === 1 && (
        <section className="stack">
          <div className="card"><h3>2. Ausgangszustand untersuchen</h3><p>Betrachte die Diagramme und Größen im Ausgangszustand. Achte besonders auf: {g.observe.join(', ')}.</p></div>
          {startRun.charts.slice(0, 2).map((c) => <div className="card" key={c.id}><ChartView chart={c} /></div>)}
          <div className="card"><ScalarTable scalars={startRun.scalars} /><button className="primary" style={{ marginTop: 10 }} onClick={() => setStep(2)}>Weiter: Hypothese</button></div>
        </section>
      )}
      {step === 2 && (
        <section className="card">
          <h3>3. Hypothese formulieren</h3>
          <p><b>Geplante Veränderung:</b> {g.changeText}</p>
          <p>Was erwartest du?</p>
          {g.hypothesisOptions.map((o) => <label key={o.id} className="opt"><input type="radio" name="hyp" checked={hyp === o.id} onChange={() => setHyp(o.id)} /> <span>{o.text}</span></label>)}
          <label className="field"><span className="lab"><b>Begründung (optional)</b></span><textarea value={hypText} onChange={(e) => setHypText(e.target.value)} placeholder="Warum erwartest du das?" /></label>
          <button className="primary" disabled={!hyp} onClick={saveHypothesis}>Hypothese speichern und weiter</button>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Die Hypothese wird vor der Simulation gespeichert, damit du sie später mit dem Ergebnis vergleichen kannst.</p>
        </section>
      )}
      {step === 3 && (
        <section className="stack">
          <div className="card">
            <h3>4. Parameter verändern</h3>
            <p>{g.changeText}</p>
            <button onClick={() => setWbInit({ ...g.start, ...g.suggestedChange })}>Vorgeschlagene Änderung übernehmen</button>
            <button className="primary" style={{ marginLeft: 8 }} onClick={() => setStep(4)}>Weiter: Simulation ausführen</button>
          </div>
          <Workbench key={JSON.stringify(wbInit ?? g.start)} model={m} initial={wbInit ?? (g.start as any)} compact hideResults onResult={(_, p) => { current.current = p; }} />
        </section>
      )}
      {step === 4 && (
        <section className="card">
          <h3>5. Simulation ausführen</h3>
          <p>Es wird mit den eingestellten Parametern gerechnet:</p>
          <ul>{m.params.filter((p) => String((current.current ?? startParams)[p.key]) !== String((startParams as any)[p.key])).map((p) => <li key={p.key}>{p.label}: {String((startParams as any)[p.key])} → <b>{String(current.current![p.key])}</b> {p.unit}</li>)}</ul>
          {!current.current && <p className="muted">Keine Parameter verändert – es wird der Ausgangszustand berechnet.</p>}
          <div className="row"><button onClick={() => setStep(3)}>Zurück</button><button className="primary" onClick={run}>▶ Simulation ausführen</button></div>
        </section>
      )}
      {step === 5 && result && (
        <section className="stack">
          <div className="card"><h3>6. Ergebnis beobachten</h3>{!result.r.ok && <div className="notice danger">{result.r.error}</div>}<p>Durchgezogen: verändertes Szenario. Gestrichelt: Ausgangszustand.</p></div>
          {result.r.ok && result.r.charts.slice(0, 3).map((c) => <div className="card" key={c.id}><ChartView chart={c} overlays={[{ label: 'Ausgangszustand', chart: startRun.charts.find((x) => x.id === c.id)! }].filter((o) => o.chart)} /></div>)}
          {result.r.ok && <div className="card"><ScalarTable scalars={result.r.scalars} compare={[{ label: 'Ausgangszustand', scalars: startRun.scalars }]} /><button className="primary" style={{ marginTop: 10 }} onClick={() => setStep(6)}>Weiter: Vergleich mit der Vorhersage</button></div>}
        </section>
      )}
      {step === 6 && (
        <section className="card">
          <h3>7. Ergebnis mit der Vorhersage vergleichen</h3>
          <p><b>Deine Hypothese:</b> {g.hypothesisOptions.find((o) => o.id === hyp)?.text}</p>
          <p><b>Durch das Modell gestützt:</b> {g.hypothesisOptions.find((o) => o.id === g.correctHypothesis)?.text}</p>
          <div className={`notice ${hyp === g.correctHypothesis ? 'ok' : ''}`}>{hyp === g.correctHypothesis ? 'Deine Vorhersage wird durch die Simulation gestützt.' : 'Deine Vorhersage weicht vom Simulationsergebnis ab – genau das ist ein guter Anlass, den Mechanismus genauer anzusehen.'}</div>
          <button className="primary" onClick={finishCompare}>Weiter: Mechanismus</button>
        </section>
      )}
      {step === 7 && (
        <section className="card">
          <h3>8. Mechanismus erklären</h3>
          <p>{g.explanation}</p>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Gültig innerhalb der Modellannahmen: {m.assumptions.join('; ')}.</p>
          <div className="row">{g.lessons.map((l) => <a key={l} className="btn small" href={href('lektion', l)}>Lektion: {lessonById(l)?.title}</a>)}</div>
          <button className="primary" style={{ marginTop: 10 }} onClick={() => setStep(8)}>Weiter: Transferfrage</button>
        </section>
      )}
      {step === 8 && (
        <section className="stack">
          {transfer && <TaskView task={transfer} mode="experiment" />}
          <div className="card">
            <h3>Experimentprotokoll</h3>
            <label className="field"><span className="lab"><b>Interpretation</b></span><textarea value={interp} onChange={(e) => setInterp(e.target.value)} /></label>
            <label className="field"><span className="lab"><b>Offene Fragen</b></span><textarea value={openQ} onChange={(e) => setOpenQ(e.target.value)} /></label>
            <div className="row">
              <button className="primary" onClick={() => { saveProtocol(); go('experimente'); }}>Protokoll speichern</button>
              <button onClick={() => { saveProtocol(); const e = useStoreSnapshot().experiments.find((x) => x.id === expId); if (e) download(`${g.title}.md`, protocolMarkdown({ ...e, interpretation: interp, openQuestions: openQ }), 'text/markdown'); }}>Als Datei herunterladen</button>
            </div>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Das Protokoll dient dem Lernen und ist keine automatisch wissenschaftlich validierte Laboraufzeichnung.</p>
          </div>
        </section>
      )}
    </div>
  );
}

function useStoreSnapshot() {
  return getState();
}
