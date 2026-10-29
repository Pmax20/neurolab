import { useMemo } from 'react';
import type { Task } from '../content/types';
import { calcInstance, fmt, templateById, type CalcAnswer } from '../content/calc';
import { checkBalance } from '../content/chemtools';
import { structureById } from '../content';
import { HistoScene } from './views/semesterViews';
import { ZoomBox } from '../ui/Zoom';

function seeded<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ===========================================================================
// Berechnungstrainer
// ===========================================================================

export function CalcBody({ task, answer, setAnswer, locked, onEnter }: { task: Extract<Task, { type: 'calc' }>; answer: CalcAnswer; setAnswer: (a: CalcAnswer) => void; locked: boolean; onEnter: () => void }) {
  const inst = useMemo(() => calcInstance(task.template, answer.seed), [task.template, answer.seed]);
  const t = templateById(task.template)!;
  const sought = useMemo(() => seeded(inst.soughtOptions, String(answer.seed) + 's'), [inst, answer.seed]);
  const formulas = useMemo(() => seeded(inst.formulaOptions, String(answer.seed) + 'f'), [inst, answer.seed]);
  const mark = (ok: boolean) => (locked ? { borderColor: ok ? 'var(--ok)' : 'var(--danger)' } : undefined);
  return (
    <div className="stack calc">
      <div className="row" style={{ gap: 6 }}><span className="badge">{t.subject}</span><span className="badge">Stufe {t.level}</span></div>
      <p style={{ margin: 0 }}>{inst.context}</p>
      <div className="calc-step"><span className="num-circle">1</span><div><b>Gegeben</b><ul className="list" style={{ margin: '4px 0 0' }}>{inst.givens.map((g) => <li key={g} className="eq" style={{ margin: 0 }}>{g}</li>)}</ul></div></div>
      <label className="calc-step"><span className="num-circle">2</span><div className="grow"><b>Gesucht ist …</b>
        <select value={answer.sought ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, sought: e.target.value })} style={{ width: '100%', ...mark(answer.sought === inst.sought) }}>
          <option value="">– wählen –</option>{sought.map((o) => <option key={o}>{o}</option>)}
        </select></div></label>
      <label className="calc-step"><span className="num-circle">3</span><div className="grow"><b>Benötigte Formel</b>
        <select value={answer.formula ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, formula: e.target.value })} style={{ width: '100%', ...mark(answer.formula === inst.formula) }}>
          <option value="">– wählen –</option>{formulas.map((o) => <option key={o}>{o}</option>)}
        </select></div></label>
      <div className="calc-step"><span className="num-circle">4</span><div className="grow"><b>Ergebnis mit Einheit</b>
        <div className="row" style={{ marginTop: 4 }}>
          <input type="text" inputMode="decimal" value={answer.value ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, value: e.target.value })} aria-label="Zahlenwert" placeholder="Zahlenwert" style={{ width: 150 }} onKeyDown={(e) => { if (e.key === 'Enter' && !locked) onEnter(); }} />
          <input type="text" value={answer.unit ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, unit: e.target.value })} aria-label="Einheit" placeholder="Einheit" style={{ width: 150 }} onKeyDown={(e) => { if (e.key === 'Enter' && !locked) onEnter(); }} />
        </div>
        <div className="muted" style={{ fontSize: '0.82rem', marginTop: 4 }}>Die Einheit gehört zur Antwort – sie wird mitgeprüft. Dimensionslose Ergebnisse ohne Einheit eingeben.</div>
      </div></div>
    </div>
  );
}

export function CalcSolution({ task, seed }: { task: Extract<Task, { type: 'calc' }>; seed: number }) {
  const inst = calcInstance(task.template, seed);
  return (
    <div className="stack" style={{ gap: 6 }}>
      <p style={{ margin: 0 }}><b>Ergebnis:</b> {fmt(inst.result, 4)}{inst.unit ? ' ' + inst.unit : ' (ohne Einheit)'}</p>
      <div><b>Rechenweg</b><ol style={{ margin: '4px 0' }}>{inst.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
      <p style={{ margin: 0 }}><b>Einheitenkontrolle:</b> {inst.check}</p>
      <p style={{ margin: 0 }}><b>Einordnung:</b> {inst.interpretation}</p>
      <div><b>Typische Fehler</b><ul style={{ margin: '4px 0' }}>{inst.pitfalls.map((s) => <li key={s}>{s}</li>)}</ul></div>
    </div>
  );
}

// ===========================================================================
// Reaktionsgleichungen ausgleichen
// ===========================================================================

export function BalanceBody({ task, answer, setAnswer, locked }: { task: Extract<Task, { type: 'balance' }>; answer: string[]; setAnswer: (a: string[]) => void; locked: boolean }) {
  const all = [...task.reactants, ...task.products];
  const coeff = all.map((_, i) => Number(answer[i]) || 0);
  const live = checkBalance(task.reactants, task.products, coeff.map((c) => c || 0));
  const box = (i: number) => (
    <input key={'c' + i} type="number" min={1} max={20} value={answer[i] ?? ''} disabled={locked} aria-label={`Koeffizient vor ${all[i]}`}
      onChange={(e) => { const a = [...answer]; a[i] = e.target.value; setAnswer(a); }} style={{ width: 58, textAlign: 'center', fontSize: '1.05rem' }} />
  );
  const side = (list: string[], off: number) => list.map((f, j) => <span key={f} className="row" style={{ gap: 4, display: 'inline-flex', alignItems: 'center' }}>{j > 0 && <span style={{ margin: '0 6px' }}>+</span>}{box(off + j)}<span className="formula">{f}</span></span>);
  return (
    <div className="stack">
      <div className="balance-eq">{side(task.reactants, 0)}<span style={{ margin: '0 10px', fontSize: '1.3rem' }}>→</span>{side(task.products, task.reactants.length)}</div>
      <table className="atom-table"><thead><tr><th>Element</th><th className="num">links</th><th className="num">rechts</th><th /></tr></thead>
        <tbody>
          {live.rows.map((r) => <tr key={r.el}><td>{r.el}</td><td className="num">{r.left}</td><td className="num">{r.right}</td><td>{r.left === r.right && r.left > 0 ? '✓' : ''}</td></tr>)}
          {(live.chargeLeft !== 0 || live.chargeRight !== 0 || all.some((f) => /[⁺⁻]$/.test(f))) && <tr><td>Ladung</td><td className="num">{live.chargeLeft}</td><td className="num">{live.chargeRight}</td><td>{live.chargeOk ? '✓' : ''}</td></tr>}
        </tbody></table>
      <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>Die Tabelle zählt mit: Links und rechts muss von jedem Element gleich viel stehen. Leere Felder zählen als 0.</p>
    </div>
  );
}

// ===========================================================================
// Histologie-Prüfungssimulator
// ===========================================================================

export interface HistoAnswer { tissue?: string; form?: string; layers?: string; features: string[]; fn?: string; text?: string }

export function HistoBody({ task, answer, setAnswer, locked }: { task: Extract<Task, { type: 'histo' }>; answer: HistoAnswer; setAnswer: (a: HistoAnswer) => void; locked: boolean }) {
  const tissues = useMemo(() => seeded(task.tissueOptions, task.id), [task]);
  const feats = useMemo(() => seeded(task.features, task.id + 'f'), [task]);
  const ok = (good: boolean) => (locked ? { borderColor: good ? 'var(--ok)' : 'var(--danger)' } : undefined);
  const steps: [string, JSX.Element][] = [];
  steps.push(['Welches Gewebe ist das?', (
    <select value={answer.tissue ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, tissue: e.target.value })} style={{ width: '100%', ...ok(answer.tissue === task.scene) }} aria-label="Gewebeart">
      <option value="">– Gewebeart wählen –</option>{tissues.map((id) => <option key={id} value={id}>{structureById(id)?.deName}</option>)}
    </select>
  )]);
  if (task.form) steps.push(['Form der (oberflächlichen) Zellen', (
    <div className="seg" role="radiogroup" aria-label="Zellform">{task.form.options.map((o) => <button key={o} role="radio" aria-checked={answer.form === o} disabled={locked} onClick={() => setAnswer({ ...answer, form: o })} style={locked && o === task.form!.correct ? { outline: '2px solid var(--ok)' } : undefined}>{o}</button>)}</div>
  )]);
  if (task.layers) steps.push(['Schichtung', (
    <div className="seg" role="radiogroup" aria-label="Schichtung">{task.layers.options.map((o) => <button key={o} role="radio" aria-checked={answer.layers === o} disabled={locked} onClick={() => setAnswer({ ...answer, layers: o })} style={locked && o === task.layers!.correct ? { outline: '2px solid var(--ok)' } : undefined}>{o}</button>)}</div>
  )]);
  steps.push(['Welche Merkmale erkennst du? (mehrere)', (
    <div className="check-list">
      {feats.map((f) => {
        const chosen = answer.features.includes(f.text);
        const cls = locked ? (f.ok ? 'correct' : chosen ? 'wrong' : '') : '';
        return <label key={f.text} className={`opt ${cls}`}><input type="checkbox" checked={chosen} disabled={locked} onChange={() => setAnswer({ ...answer, features: chosen ? answer.features.filter((x) => x !== f.text) : [...answer.features, f.text] })} /><span>{f.text}{locked && f.ok && <b> ✓</b>}</span></label>;
      })}
    </div>
  )]);
  steps.push(['Welche Funktion passt dazu?', (
    <select value={answer.fn ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, fn: e.target.value })} style={{ width: '100%', ...ok(answer.fn === task.fn.correct) }} aria-label="Funktion">
      <option value="">– wählen –</option>{task.fn.options.map((o) => <option key={o}>{o}</option>)}
    </select>
  )]);
  steps.push(['Begründe deine Zuordnung in ein, zwei Sätzen', (
    <textarea value={answer.text ?? ''} disabled={locked} onChange={(e) => setAnswer({ ...answer, text: e.target.value })} placeholder="z. B. „mehrere Zelllagen, oberste Zellen platt …“" aria-label="Begründung" style={{ minHeight: 70 }} />
  )]);
  return (
    <div className="stack">
      <div className="figure"><ZoomBox label="Präparat"><svg viewBox="0 0 520 260" role="img" aria-label="Schematisches Präparat ohne Beschriftung" style={{ background: '#fff', borderRadius: 8, display: 'block', width: '100%' }}><HistoScene id={task.scene} /></svg></ZoomBox></div>
      <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>Schematische Zeichnung in H.E.-Farben, kein echtes Präparat. Echte Präparate kannst du unter Üben → Histologie → „Eigene Präparate“ mit eigenen Fotos ergänzen.</p>
      {steps.map(([title, el], i) => <div key={title} className="calc-step"><span className="num-circle">{i + 1}</span><div className="grow"><b>{title}</b><div style={{ marginTop: 4 }}>{el}</div></div></div>)}
    </div>
  );
}

export function HistoSolution({ task, answer }: { task: Extract<Task, { type: 'histo' }>; answer: HistoAnswer }) {
  const t = (answer.text ?? '').toLowerCase();
  const hits = task.keywords.filter((g) => g.some((k) => t.includes(k))).length;
  return (
    <div className="stack" style={{ gap: 6 }}>
      <p style={{ margin: 0 }}><b>Musterlösung:</b> {task.modelAnswer}</p>
      {answer.text && <p className="muted" style={{ margin: 0 }}>Deine Begründung enthält {hits} von {task.keywords.length} Kernmerkmalen (automatischer Stichwortabgleich, nur ein Hinweis).</p>}
    </div>
  );
}
