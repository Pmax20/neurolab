import { useEffect, useMemo, useRef, useState } from 'react';
import { OwnSlides } from './OwnSlides';
import { FLASHCARDS, type Flashcard } from '../content/cards';
import { LESSONS, MODULES, TASKS, lessonById, taskById, tasksForLesson } from '../content';
import { ERROR_LABEL, LEVEL_LABEL, type ErrorCategory, type TaskLevel } from '../content/types';
import { useStore } from '../store/store';
import { dueTasks, errorPatterns, objectiveMastery, BOX_INTERVAL_DAYS, dueCards, rateCard } from '../store/state';
import { setState } from '../store/store';
import { TaskView } from './TaskView';
import { href } from '../ui/router';
import { download } from '../ui/common';
import { exportData, deleteAll } from '../store/store';

type Path = 'verstehen' | 'ueben' | 'pruefen' | 'wiederholen' | 'frei' | 'karten' | 'rechnen' | 'histo';

function shuffle<T>(a: T[]) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

export function ExamPage({ query }: { query: URLSearchParams }) {
  const s = useStore((x) => x);
  const preLesson = query.get('lektion');
  const preModule = query.get('modul');
  const qm = query.get('modus');
  const [path, setPath] = useState<Path>((['wiederholen', 'karten', 'rechnen', 'histo', 'pruefen'] as const).find((x) => x === qm) ?? 'ueben');
  const [histoTab, setHistoTab] = useState<'sim' | 'eigene'>('sim');
  const [timed, setTimed] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [cardQueue, setCardQueue] = useState<string[] | null>(null);
  const [lessons, setLessons] = useState<string[]>(preLesson ? [preLesson] : preModule ? [...(MODULES.find((m) => m.id === preModule)?.lessons ?? [])] : []);
  const [levels, setLevels] = useState<TaskLevel[]>([]);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [scores, setScores] = useState<{ id: string; score: number; category?: ErrorCategory }[]>([]);
  const due = dueTasks(s, Date.now());
  const pool = useMemo(() => {
    let t = TASKS;
    if (path === 'wiederholen') return due.map((id) => taskById(id)!).filter(Boolean);
    if (path === 'rechnen') t = t.filter((x) => x.type === 'calc' || x.type === 'formula' || x.type === 'balance');
    if (path === 'histo') t = t.filter((x) => x.type === 'histo');
    if (lessons.length) t = t.filter((x) => x.lessons.some((l) => lessons.includes(l)));
    if (levels.length) t = t.filter((x) => levels.includes(x.level));
    if (path === 'ueben') {
      // Häufig fehlerhafte Aufgaben zuerst; sicher beherrschte (Fach ≥ 4) nicht als Pflicht
      t = t.filter((x) => (s.srs[x.id]?.box ?? 0) < 4 || lessons.length > 0);
      t = [...t].sort((a, b) => (s.srs[a.id]?.box ?? 0) - (s.srs[b.id]?.box ?? 0));
    }
    return t;
  }, [path, lessons, levels, due, s.srs]);

  const saved = useRef(false);
  useEffect(() => {
    if (!queue || idx < queue.length || saved.current || !scores.length) return;
    saved.current = true;
    const mods = [...new Set(scores.flatMap((x) => taskById(x.id)?.lessons ?? []).map((l) => lessonById(l)?.module).filter(Boolean) as string[])];
    setState((st) => ({ ...st, tests: [...st.tests, { t: Date.now(), modules: mods, n: scores.length, score: scores.reduce((a, b) => a + b.score, 0) / scores.length, timed: !!timed && path === 'pruefen' }].slice(-100) }));
  }, [queue, idx, scores, path, timed]);
  const cardPool = useMemo(() => FLASHCARDS.filter((c) => !lessons.length || lessons.includes(c.lesson)), [lessons]);
  const cardsDue = dueCards(s, cardPool.map((c) => c.id), Date.now());
  useEffect(() => {
    if (!deadline || !queue) return;
    const h = setInterval(() => { const t = Date.now(); setNow(t); if (t >= deadline) { setIdx(queue.length); setDeadline(null); } }, 500);
    return () => clearInterval(h);
  }, [deadline, queue]);

  const start = () => {
    if (path === 'karten') { setCardQueue(cardsDue.slice(0, 20)); return; }
    const rank = { wissen: 1, verstaendnis: 1, anwendung: 2, analyse: 3, verknuepfung: 3 } as const;
    const ids = (path === 'pruefen' ? shuffle(pool).slice(0, 10) : path === 'ueben' ? pool.slice(0, 12)
      : path === 'rechnen' ? shuffle(pool).slice(0, 10).sort((a, b) => rank[a.level] - rank[b.level]) // Schwierigkeit steigt schrittweise
      : path === 'histo' ? shuffle(pool).slice(0, 8) : pool).map((t) => t.id);
    saved.current = false;
    setQueue(ids);
    setIdx(0);
    setScores([]);
    setDeadline(path === 'pruefen' && timed ? Date.now() + ids.length * 90000 : null);
    setNow(Date.now());
  };

  if (cardQueue) return <CardSession ids={cardQueue} onExit={() => setCardQueue(null)} onAgain={() => setCardQueue(dueCards(s, cardPool.map((c) => c.id), Date.now()).slice(0, 20))} />;

  if (queue) {
    const t = taskById(queue[idx]);
    const finished = idx >= queue.length;
    if (finished || !t) {
      const total = scores.reduce((a, b) => a + b.score, 0);
      const cats = scores.filter((x) => x.score < 0.8 && x.category).reduce<Record<string, number>>((m, x) => ({ ...m, [x.category!]: (m[x.category!] ?? 0) + 1 }), {});
      const wrongLessons = [...new Set(scores.filter((x) => x.score < 0.8).flatMap((x) => taskById(x.id)!.lessons))];
      return (
        <div className="stack">
          <h1>Auswertung</h1>
          <div className="card">
            <div className="kpi">{Math.round((total / Math.max(1, scores.length)) * 100)} %</div>
            <p>{scores.length} von {queue.length} Aufgaben bearbeitet, davon {scores.filter((x) => x.score >= 0.8).length} richtig.{scores.length < queue.length && ' Nicht bearbeitete Aufgaben zählen nicht mit.'}</p>
            {Object.keys(cats).length > 0 && <><h3>Fehlerkategorien (Arbeitshypothese)</h3><ul>{Object.entries(cats).map(([k, v]) => <li key={k}>{ERROR_LABEL[k as ErrorCategory]}: {v}×</li>)}</ul></>}
            {wrongLessons.length > 0 && <><h3>Zum Wiederholen empfohlen</h3><div className="row">{wrongLessons.map((l) => <a key={l} className="btn small" href={href('lektion', l)}>{lessonById(l)?.title}</a>)}</div></>}
            <div className="row" style={{ marginTop: 12 }}><button className="primary" onClick={start}>Neue Runde</button><button onClick={() => setQueue(null)}>Zur Auswahl</button></div>
          </div>
        </div>
      );
    }
    return (
      <div className="stack">
        <div className="row between">
          <h1 style={{ margin: 0 }}>{{ verstehen: 'Verstehen', ueben: 'Üben', pruefen: 'Prüfen', wiederholen: 'Wiederholen', frei: 'Freier Modus', karten: 'Karteikarten', rechnen: 'Rechentrainer', histo: 'Histologie-Simulator' }[path]}</h1>
          <span className="row" style={{ gap: 8 }}>{deadline && <span className={`badge ${deadline - now < 60000 ? 'warn' : ''}`} aria-live="off">⏱ {Math.max(0, Math.floor((deadline - now) / 60000))}:{String(Math.max(0, Math.floor(((deadline - now) % 60000) / 1000))).padStart(2, '0')}</span>}<span className="badge">Aufgabe {idx + 1} / {queue.length}</span></span>
        </div>
        <div className="meter"><div style={{ width: `${(idx / queue.length) * 100}%` }} /></div>
        {path === 'verstehen' && t.lessons[0] && (
          <div className="notice info"><b>Kurz erklärt ({lessonById(t.lessons[0])?.title}):</b> {lessonById(t.lessons[0])?.overview} <a href={href('lektion', t.lessons[0])}>Ganze Lektion</a></div>
        )}
        <TaskView key={t.id + idx} task={t} mode={path === 'pruefen' ? 'pruefen' : 'ueben'} onDone={(r) => setScores((x) => [...x, { id: t.id, score: r.score, category: r.category }])} />
        <div className="row">
          <button className="primary" onClick={() => setIdx((i) => i + 1)} disabled={!scores.some((x) => x.id === t.id) && path !== 'frei'}>{idx + 1 < queue.length ? 'Nächste Aufgabe' : 'Auswertung'}</button>
          <button onClick={() => setIdx((i) => i + 1)}>Überspringen</button>
          <button className="ghost" onClick={() => setQueue(null)}>Beenden</button>
        </div>
      </div>
    );
  }

  const topicValue = lessons.length === 0 ? '' : lessons.length === 1 ? 'l:' + lessons[0] : MODULES.find((m) => m.lessons.length === lessons.length && m.lessons.every((l) => lessons.includes(l))) ? 'm:' + MODULES.find((m) => m.lessons.length === lessons.length && m.lessons.every((l) => lessons.includes(l)))!.id : 'custom';
  const setTopic = (v: string) => {
    if (!v) setLessons([]);
    else if (v.startsWith('m:')) setLessons([...(MODULES.find((m) => m.id === v.slice(2))?.lessons ?? [])]);
    else if (v.startsWith('l:')) setLessons([v.slice(2)]);
  };
  const count = path === 'pruefen' || path === 'rechnen' ? Math.min(10, pool.length) : path === 'ueben' ? Math.min(12, pool.length) : path === 'histo' ? Math.min(8, pool.length) : pool.length;
  return (
    <div className="stack" style={{ maxWidth: 820 }}>
      <div className="page-head"><div><h1>Üben</h1><p className="muted" style={{ margin: 0 }}>Wähle, wie du üben möchtest – den Rest erledigt NeuroLab.</p></div></div>
      <div className="mode-pick" role="radiogroup" aria-label="Lernpfad">
        {([
          ['ueben', 'Üben', 'Unsichere Themen zuerst'],
          ['verstehen', 'Verstehen', 'Mit kurzer Erklärung'],
          ['pruefen', 'Prüfen', '10 Fragen, ohne Hilfe'],
          ['wiederholen', `Wiederholen (${due.length})`, 'Was heute fällig ist'],
          ['karten', 'Karteikarten', 'Begriffe und Strukturen'],
          ['rechnen', 'Rechnen', 'Rechentrainer mit Einheiten'],
          ['histo', 'Histologie', 'Präparate bestimmen'],
        ] as const).map(([k, t, d]) => (
          <button key={k} role="radio" aria-checked={path === k} onClick={() => setPath(k)}>
            <b>{t}</b><span>{d}</span>
          </button>
        ))}
      </div>
      {path === 'histo' && (
        <div className="seg" role="tablist" aria-label="Histologie">
          <button role="tab" aria-selected={histoTab === 'sim'} onClick={() => setHistoTab('sim')}>Prüfungssimulator</button>
          <button role="tab" aria-selected={histoTab === 'eigene'} onClick={() => setHistoTab('eigene')}>Eigene Präparate</button>
        </div>
      )}
      {path === 'histo' && histoTab === 'eigene' && <OwnSlides />}
      {path === 'rechnen' && <p className="muted" style={{ margin: 0 }}>Jede Runde: 10 Aufgaben mit neuen Zahlen, von Stufe 1 bis 3 steigend. Geprüft werden gesuchte Größe, Formel, Ergebnis und Einheit.</p>}
      {path !== 'wiederholen' && !(path === 'histo' && histoTab === 'eigene') && (
        <section className="card">
          <label className="field" style={{ marginBottom: 6 }}>
            <span className="lab"><b>Thema</b></span>
            <select value={topicValue} onChange={(e) => setTopic(e.target.value)}>
              <option value="">Alle Themen</option>
              {topicValue === 'custom' && <option value="custom">Eigene Auswahl ({lessons.length} Lektionen)</option>}
              {MODULES.map((m) => (
                <optgroup key={m.id} label={m.title}>
                  <option value={'m:' + m.id}>Ganzes Modul: {m.title}</option>
                  {m.lessons.map((l) => <option key={l} value={'l:' + l}>{lessonById(l)?.title}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
          <details>
            <summary>Mehrere Themen oder Niveau wählen{levels.length ? ` · ${levels.length} Niveau${levels.length > 1 ? 's' : ''}` : ''}</summary>
            <div className="check-group">
              {MODULES.map((m) => (
                <div key={m.id}>
                  <h4>{m.title}</h4>
                  {m.lessons.map((l) => (
                    <label key={l}><input type="checkbox" checked={lessons.includes(l)} onChange={() => setLessons((x) => (x.includes(l) ? x.filter((y) => y !== l) : [...x, l]))} /> {lessonById(l)?.title} <span className="muted">({tasksForLesson(l).length})</span></label>
                  ))}
                </div>
              ))}
            </div>
            <h4>Anforderungsniveau</h4>
            <div className="row">{(Object.keys(LEVEL_LABEL) as TaskLevel[]).map((lv) => <label key={lv} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={levels.includes(lv)} onChange={() => setLevels((x) => (x.includes(lv) ? x.filter((y) => y !== lv) : [...x, lv]))} /> {LEVEL_LABEL[lv]}</label>)}</div>
            <p className="muted" style={{ fontSize: '0.85rem' }}>Ohne Auswahl: alle Niveaus.</p>
          </details>
        </section>
      )}
      {path === 'pruefen' && (
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Mit Zeitlimit wie in einer Klausur (1,5 Minuten pro Frage, {Math.round((count * 90) / 60)} Minuten insgesamt)</label>
      )}
      {path === 'histo' && histoTab === 'eigene' ? null : path === 'karten' ? (
        <div className="row">
          <button className="primary big" onClick={start} disabled={!cardsDue.length}>Los geht’s · {Math.min(20, cardsDue.length)} Karte{cardsDue.length === 1 ? '' : 'n'}</button>
          <span className="muted">{cardsDue.length ? `${cardsDue.length} von ${cardPool.length} Karten fällig oder neu` : 'Heute ist keine Karte fällig.'}</span>
        </div>
      ) : (
      <div className="row">
        <button className="primary big" onClick={start} disabled={!pool.length}>Los geht’s · {count} Aufgabe{count === 1 ? '' : 'n'}</button>
        {!pool.length && <span className="muted">{path === 'wiederholen' ? 'Heute ist nichts fällig – gut gemacht.' : 'Keine passenden Aufgaben.'}</span>}
      </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function CardSession({ ids, onExit, onAgain }: { ids: string[]; onExit: () => void; onAgain: () => void }) {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [res, setRes] = useState<number[]>([]);
  const c: Flashcard | undefined = FLASHCARDS.find((x) => x.id === ids[i]);
  if (!c) {
    const known = res.filter((x) => x === 1).length;
    return (
      <div className="stack" style={{ maxWidth: 640 }}>
        <h1>Karteikarten: fertig</h1>
        <div className="card"><p>{res.length} Karten, davon {known} gewusst und {res.filter((x) => x === 0.5).length} unsicher. Gewusste Karten kommen in einigen Tagen wieder, unsichere und nicht gewusste schon heute.</p>
          <div className="row"><button className="primary" onClick={() => { setI(0); setRes([]); setFlip(false); onAgain(); }}>Weitere Karten</button><button onClick={onExit}>Zur Auswahl</button></div></div>
      </div>
    );
  }
  const rate = (score: number) => {
    setState((s) => rateCard(s, c.id, score, Date.now()));
    setRes((r) => [...r, score]);
    setFlip(false);
    setI((x) => x + 1);
  };
  return (
    <div className="stack" style={{ maxWidth: 680 }}>
      <div className="row between"><h1 style={{ margin: 0 }}>Karteikarten</h1><span className="badge">Karte {i + 1} / {ids.length}</span></div>
      <div className="meter"><div style={{ width: `${(i / ids.length) * 100}%` }} /></div>
      <button className={`flashcard ${flip ? 'flipped' : ''}`} onClick={() => setFlip((f) => !f)} aria-live="polite" aria-label={flip ? `Rückseite: ${c.back}` : `Vorderseite: ${c.front}. Antippen zum Umdrehen.`}>
        {!flip ? <><span className="fc-kind">{c.kind} · {lessonById(c.lesson)?.title}</span><span className="fc-main">{c.front}</span>{c.hint && <span className="muted" style={{ fontStyle: 'italic' }}>{c.hint}</span>}<span className="muted">Antippen zum Umdrehen</span></>
          : <><span className="fc-kind">{c.front}</span><span className="fc-main" style={{ fontSize: '1.15rem', fontWeight: 500 }}>{c.back}</span></>}
      </button>
      <div className="row" style={{ justifyContent: 'center' }}>
        <button onClick={() => rate(0)} disabled={!flip}>Nicht gewusst</button>
        <button onClick={() => rate(0.5)} disabled={!flip}>Unsicher</button>
        <button className="primary" onClick={() => rate(1)} disabled={!flip}>Gewusst</button>
      </div>
      <div className="row between"><a href={href('lektion', c.lesson)}>Zur Lektion</a><button className="ghost" onClick={onExit}>Beenden</button></div>
    </div>
  );
}

function moduleStats(s: ReturnType<typeof useStore<any>>, m: (typeof MODULES)[number], now: number) {
  const ids = new Set(m.lessons.flatMap((l) => tasksForLesson(l).map((t) => t.id)));
  const objectives = m.lessons.flatMap((l) => { const ts = tasksForLesson(l); return lessonById(l)!.objectives.map((o) => ts.filter((t) => t.objective === o).map((t) => t.id)); }).filter((x) => x.length);
  const mastery = objectives.map((t) => objectiveMastery(s, t));
  const att = s.attempts.filter((a: { taskId: string }) => ids.has(a.taskId));
  const wrong = att.filter((a: { score: number }) => a.score < 0.8).length;
  const dueT = Object.entries(s.srs as Record<string, { due: number }>).filter(([k, v]) => ids.has(k) && v.due <= now).length;
  const cardIds = new Set(FLASHCARDS.filter((c) => c.module === m.id).map((c) => c.id));
  const dueC = Object.entries(s.cards as Record<string, { due: number }>).filter(([k, v]) => cardIds.has(k) && v.due <= now).length;
  const open = m.lessons.filter((l) => !s.lessons[l]).length;
  const tests = (s.tests as { t: number; modules: string[]; n: number; score: number; timed: boolean }[]).filter((t) => t.modules.includes(m.id)).slice(-3).reverse();
  return { total: objectives.length, worked: mastery.filter((x) => x !== 'offen').length, solid: mastery.filter((x) => x === 'gefestigt').length, errorRate: att.length ? wrong / att.length : null, attempts: att.length, due: dueT + dueC, open, tests };
}

export function AnalyticsPage() {
  const s = useStore((x) => x);
  const patterns = errorPatterns(s, (id) => taskById(id)?.lessons ?? []);
  const due = dueTasks(s, Date.now());
  const cats = s.attempts.filter((a) => a.score < 0.8 && a.category).reduce<Record<string, number>>((m, a) => ({ ...m, [a.category!]: (m[a.category!] ?? 0) + 1 }), {});
  const overconf = s.attempts.filter((a) => a.confidence === 3 && a.score < 0.5).length;
  const underconf = s.attempts.filter((a) => a.confidence === 1 && a.score >= 0.8).length;
  const doneCount = LESSONS.filter((l) => s.lessons[l.id]?.completed).length;
  const rightPct = s.attempts.length ? Math.round((s.attempts.filter((a) => a.score >= 0.8).length / s.attempts.length) * 100) : null;
  return (
    <div className="stack" style={{ maxWidth: 900 }}>
      <div className="page-head"><div><h1>Fortschritt</h1><p className="muted" style={{ margin: 0 }}>Alles bleibt auf diesem Gerät.</p></div></div>

      <section className="card">
        <div className="stats">
          <div><b>{doneCount} / {LESSONS.length}</b><span>Lektionen abgeschlossen</span></div>
          <div><b>{rightPct === null ? '–' : rightPct + ' %'}</b><span>Antworten richtig</span></div>
          <div><b>{due.length}</b><span>heute zu wiederholen</span></div>
        </div>
        {due.length > 0 && <a className="btn primary" style={{ marginTop: 12 }} href="#/pruefung?modus=wiederholen">Jetzt wiederholen</a>}
        {s.attempts.length === 0 && <p className="muted" style={{ marginTop: 10, marginBottom: 0 }}>Sobald du Aufgaben löst, siehst du hier, was schon sitzt und was noch nicht.</p>}
      </section>

      {patterns.length > 0 && (
        <section className="card">
          <h3>Hier lohnt sich ein zweiter Blick</h3>
          <ul className="rows">{patterns.slice(0, 3).map((p) => (
            <li key={p.lesson + p.category}><div className="row-inner">
              <div className="grow"><div className="t">{lessonById(p.lesson)?.title}</div><div className="d">{ERROR_LABEL[p.category]} · {p.count}×</div></div>
              <a className="btn small" href={href('lektion', p.lesson)}>Erklärung</a>
              <a className="btn small primary" href={`#/pruefung?lektion=${p.lesson}`}>Üben</a>
            </div></li>
          ))}</ul>
          <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 0 }}>Arbeitshypothese aus deinen letzten Antworten.</p>
        </section>
      )}

      <section className="card">
        <h3>Nach Modul</h3>
        <ul className="rows">
          {MODULES.map((m) => {
            const done = m.lessons.filter((l) => s.lessons[l]?.completed).length;
            const st = moduleStats(s, m, Date.now());
            return (
              <li key={m.id}>
                <details className="plain">
                  <summary className="row-inner">
                    <div className="grow"><div className="t">{m.title}</div><div className="meter" style={{ marginTop: 6 }}><div style={{ width: `${(done / m.lessons.length) * 100}%` }} /></div>
                      <div className="d">{st.solid} von {st.total} Lernzielen gefestigt{st.errorRate !== null ? ` · Fehlerquote ${Math.round(st.errorRate * 100)} %` : ''}{st.due ? ` · ${st.due} fällig` : ''}</div></div>
                    <span className="muted">{done}/{m.lessons.length}</span>
                  </summary>
                  <table style={{ margin: '0 0 10px' }}><tbody>
                    <tr><td>Lernziele gesamt</td><td className="num">{st.total}</td></tr>
                    <tr><td>davon bearbeitet</td><td className="num">{st.worked}</td></tr>
                    <tr><td>davon gefestigt (nachgewiesen und wiederholt)</td><td className="num">{st.solid}</td></tr>
                    <tr><td>noch nicht geöffnete Lektionen</td><td className="num">{st.open}</td></tr>
                    <tr><td>Fehlerquote ({st.attempts} Antworten)</td><td className="num">{st.errorRate === null ? '–' : Math.round(st.errorRate * 100) + ' %'}</td></tr>
                    <tr><td>fällige Wiederholungen (Aufgaben und Karten)</td><td className="num">{st.due}</td></tr>
                    <tr><td>letzte Prüfungsrunden</td><td className="num">{st.tests.length ? st.tests.map((t) => `${Math.round(t.score * 100)} %${t.timed ? ' ⏱' : ''}`).join(' · ') : '–'}</td></tr>
                  </tbody></table>
                  <ul className="list" style={{ margin: '0 0 12px' }}>
                    {m.lessons.map((lid) => {
                      const l = lessonById(lid)!;
                      const tasks = tasksForLesson(lid);
                      const objs = l.objectives.map((o) => { const t = tasks.filter((x) => x.objective === o).map((x) => x.id); return t.length ? objectiveMastery(s, t) : null; });
                      return (
                        <li key={lid} className="row" style={{ flexWrap: 'nowrap' }}>
                          <span style={{ width: 18 }}>{s.lessons[lid]?.completed ? '✓' : '○'}</span>
                          <a href={href('lektion', lid)} style={{ flex: 1 }}>{l.title}</a>
                          <span title="Lernziele">{objs.map((mm, i) => <span key={i} className={`mastery-dot ${mm ?? ''}`} />)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
        <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 0 }}>Punkte = Lernziele (leer: offen, halb: begonnen, gelb: unsicher, voll: gefestigt). „Gefestigt“ heißt: alle Aufgaben des Lernziels zuletzt richtig und mehrfach wiederholt – viele bearbeitete Karten allein zählen nicht als Beherrschung.</p>
      </section>

      <details className="card">
        <summary>Weitere Auswertungen und Daten</summary>
        <h4>Häufigste Fehlerarten</h4>
        {Object.keys(cats).length ? <table><tbody>{Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([k, v]) => <tr key={k}><td>{ERROR_LABEL[k as ErrorCategory]}</td><td className="num">{v}</td></tr>)}</tbody></table> : <p className="muted">Noch keine Fehler erfasst.</p>}
        <h4>Selbsteinschätzung</h4>
        <p>„Sicher“, aber falsch: <b>{overconf}</b> · „Unsicher“, aber richtig: <b>{underconf}</b></p>
        <h4>Wiederholungsplan</h4>
        <p className="muted" style={{ fontSize: '0.88rem' }}>Leitner-System mit 5 Fächern. Richtig → ein Fach weiter (Intervalle: {BOX_INTERVAL_DAYS.slice(1).map((d) => (d === 0 ? 'sofort' : `${d} T.`)).join(', ')}), falsch → zurück in Fach 1. Richtig, aber „unsicher“ → bleibt im Fach. „Sicher“, aber falsch → kommt schon nach wenigen Minuten wieder. Schwere und wiederholt falsch beantwortete Aufgaben bekommen kürzere Intervalle.</p>
        <div className="row">{[1, 2, 3, 4, 5].map((b) => <span key={b} className="badge">Fach {b}: {Object.values(s.srs).filter((x) => x.box === b).length}</span>)}</div>
        <p className="muted" style={{ marginTop: 10 }}>Simulationen ausgeführt: {Object.values(s.sims).reduce((a, b) => a + b.runs, 0)}</p>
        <h4>Daten</h4>
        <div className="row">
          <button onClick={() => download(`neurolab-lernstand-${new Date().toISOString().slice(0, 10)}.json`, exportData())}>Daten exportieren</button>
          <DeleteButton />
        </div>
      </details>
    </div>
  );
}

export function DeleteButton() {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <div className="row"><span>Wirklich alle Lerndaten löschen?</span><button className="primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { deleteAll(); setConfirm(false); }}>Ja, löschen</button><button onClick={() => setConfirm(false)}>Abbrechen</button></div>
  ) : <button onClick={() => setConfirm(true)}>Alle Lerndaten löschen …</button>;
}
