import { useMemo, useState } from 'react';
import { LESSONS, MODULES, TASKS, lessonById, moduleById, tasksForLesson, taskById, GLOSSARY, STRUCTURES } from '../content';
import { MODELS, modelById } from '../engine/registry';
import { useStore } from '../store/store';
import { dueTasks, errorPatterns, objectiveMastery } from '../store/state';
import { ERROR_LABEL } from '../content/types';
import { href } from '../ui/router';
import { StatusBadge } from '../ui/common';
import { relevanceOf, lessonsInWindow } from '../content/curriculum';
import { learningPath, modulesBySemester, upcomingExams, daysUntil, countdownText, ExamDates } from '../ui/semester';

export const MOD_ICON: Record<string, string> = { neuro: '⚡', cell: '◉', molecule: '⌬', physio: '♥', physics: '◎', histo: '⬡', term: 'Aa', anatomy: '🦴' };


function Trace() {
  // dekorative Aktionspotenzial-Kurve (aus der Simulation abgeleitete Form)
  return (
    <svg className="trace" viewBox="0 0 300 120" aria-hidden="true">
      <path d="M0,95 L60,95 C70,95 72,90 76,86 C80,80 82,10 88,8 C94,6 98,60 104,92 C108,108 116,104 130,100 C160,96 200,95 300,95" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Dashboard({ onTour }: { onTour?: () => void }) {
  const s = useStore((x) => x);
  const now = Date.now();
  const due = dueTasks(s, now);
  const patterns = errorPatterns(s, (id) => taskById(id)?.lessons ?? []);
  const completed = Object.values(s.lessons).filter((l) => l.completed).length;
  const answered = new Set(s.attempts.map((a) => a.taskId)).size;
  const sem = s.settings.semester;
  const PATH = learningPath(sem);
  const { current, earlier, later } = modulesBySemester(sem);
  const exams = upcomingExams(s.settings.exams);
  const exam = exams[0];
  const examModule = exam ? moduleById(exam.module) : undefined;
  const examDays = exam ? daysUntil(exam.date) : 0;
  const examLessons = examModule ? examModule.lessons : [];
  const examDone = examLessons.filter((l) => s.lessons[l]?.completed).length;
  const nextExamLesson = examLessons.find((l) => !s.lessons[l]?.completed);
  const lastLesson = s.recent.find((r) => r.kind === 'lesson' && !s.lessons[r.id]?.completed);
  const nextId = lastLesson?.id ?? PATH.find((id) => !s.lessons[id]?.completed) ?? PATH[0];
  const next = lessonById(nextId)!;
  const started = !!s.lessons[nextId];
  const allObjectives = LESSONS.flatMap((l) => l.objectives.map((o) => ({ l, o, tasks: tasksForLesson(l.id).filter((t) => t.objective === o).map((t) => t.id) }))).filter((x) => x.tasks.length);
  const mastered = allObjectives.filter((x) => objectiveMastery(s, x.tasks) === 'gefestigt').length;
  const first = s.recent.length === 0;
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>{s.settings.name ? `Hallo ${s.settings.name}` : first ? 'Willkommen bei NeuroLab' : 'Schön, dass du weiterlernst'}</h1>
      <p className="muted" style={{ marginBottom: 20 }}>Dein {sem}. Semester: {current.map((m) => m.title).join(', ')}.</p>
      <div className="hero">
        <a className="continue" href={href('lektion', next.id)}>
          <Trace />
          <span style={{ opacity: 0.85 }}>{started ? 'Weiter mit' : first ? 'Dein Einstieg' : 'Als Nächstes'}</span>
          <h2>{next.title}</h2>
          <p>{next.overview.split('. ')[0]}.</p>
          <span className="go">{started ? 'Lektion fortsetzen' : 'Lektion öffnen'}</span>
        </a>
        <div className="stats" aria-label="Dein Fortschritt">
          <div><span>Abgeschlossene Lektionen</span><b>{completed}<small className="muted"> / {LESSONS.length}</small></b></div>
          <div><span>Gefestigte Lernziele</span><b>{mastered}<small className="muted"> / {allObjectives.length}</small></b></div>
          <div><span>Bearbeitete Aufgaben</span><b>{answered}<small className="muted"> / {TASKS.length}</small></b></div>
        </div>
      </div>
      <section className="card exam-card" style={{ marginBottom: 22 }}>
        {exam && examModule ? (
          <div className="row" style={{ alignItems: 'center', gap: 18 }}>
            <div className="exam-count" aria-hidden="true"><b>{examDays}</b><span>{examDays === 1 ? 'Tag' : 'Tage'}</span></div>
            <div className="grow" style={{ flex: 1, minWidth: 200 }}>
              <div className="muted" style={{ fontSize: '0.85rem' }}>Nächste Prüfung {countdownText(examDays)}</div>
              <h3 style={{ margin: '2px 0 6px' }}>{exam.title}</h3>
              <div className="progressline" style={{ margin: 0 }}><span className="muted" style={{ fontSize: '0.88rem' }}>{examDone} von {examLessons.length} Lektionen</span><div className="meter"><div style={{ width: `${(examDone / Math.max(1, examLessons.length)) * 100}%` }} /></div></div>
            </div>
            <div className="row">
              {nextExamLesson && <a className="btn" href={href('lektion', nextExamLesson)}>Nächste Lektion</a>}
              <a className="btn primary" href={`#/pruefung?modul=${examModule.id}`}>Dafür üben</a>
            </div>
          </div>
        ) : (
          <div className="row between" style={{ alignItems: 'center' }}>
            <div><b>Klausuren und Testate eintragen</b><div className="muted" style={{ fontSize: '0.9rem' }}>Dann zeigt dir die Startseite den Countdown und was du dafür noch lernen solltest.</div></div>
          </div>
        )}
        <details style={{ marginTop: 10 }}>
          <summary className="muted" style={{ fontWeight: 400 }}>{s.settings.exams.length ? `Termine verwalten (${s.settings.exams.length})` : 'Termin hinzufügen'}</summary>
          <div style={{ marginTop: 10 }}><ExamDates /></div>
        </details>
      </section>
      <ThisWeek />
      {first && onTour && (
        <div className="hint-card" style={{ marginBottom: 22 }}>
          <div><b>Neu hier?</b> Die Tour zeigt dir in einer Minute, wie Lektionen, Simulationen und Übungen funktionieren.</div>
          <button className="small primary" onClick={onTour}>Tutorial starten</button>
        </div>
      )}
      {due.length > 0 && (
        <div className="notice info" style={{ marginBottom: 22 }}>
          {due.length} {due.length === 1 ? 'Aufgabe ist' : 'Aufgaben sind'} zur Wiederholung fällig. <a href="#/pruefung?modus=wiederholen">Jetzt wiederholen</a>
        </div>
      )}
      {patterns.slice(0, 1).map((p) => {
        const l = lessonById(p.lesson)!;
        return (
          <div key={p.lesson + p.category} className="notice info" style={{ marginBottom: 22 }}>
            Bei „{l.title}“ gab es zuletzt mehrmals Fehler der Art „{ERROR_LABEL[p.category]}“. Vorschlag: kurz die <a href={href('lektion', l.id)}>Erklärung</a> lesen{l.models[0] ? <>, die <a href={href('sim', l.models[0])}>Simulation</a> ausprobieren</> : null} und dann <a href={`#/pruefung?lektion=${l.id}`}>Transferfragen</a> lösen.
            <div className="muted" style={{ fontSize: '0.85rem', marginTop: 4 }}>Das ist ein Hinweis aus deinen letzten Antworten, keine Diagnose – du kannst ihn ignorieren.</div>
          </div>
        );
      })}
      <h2>Deine Fächer im {sem}. Semester</h2>
      <div className="module-list" style={{ marginBottom: 14 }}>
        {current.map((m) => {
          const done = m.lessons.filter((l) => s.lessons[l]?.completed).length;
          return (
            <a key={m.id} href={href('modul', m.id)}>
              <h3 style={{ marginBottom: 2 }}>{MOD_ICON[m.id]} {m.title}</h3>
              <div className="muted" style={{ fontSize: '0.92rem' }}>{m.area}, {m.lessons.length} Lektionen</div>
              <div className="bar" aria-label={`${done} von ${m.lessons.length} abgeschlossen`}><div style={{ width: `${(done / m.lessons.length) * 100}%` }} /></div>
            </a>
          );
        })}
      </div>
      {(earlier.length > 0 || later.length > 0) && (
        <p className="muted" style={{ marginBottom: 28 }}>
          {earlier.length > 0 && <>Zum Wiederholen: {earlier.map((m, i) => <span key={m.id}>{i > 0 && ' · '}<a href={href('modul', m.id)}>{m.title}</a></span>)}. </>}
          {later.length > 0 && <>Später im Studium: {later.map((m, i) => <span key={m.id}>{i > 0 && ' · '}<a href={href('modul', m.id)}>{m.title}</a> <small>({m.area.replace(/.*\((.*)\)/, '$1')})</small></span>)}.</>}
        </p>
      )}
      {!first && (
        <>
          <h2>Zuletzt geöffnet</h2>
          <ul className="list" style={{ marginBottom: 24 }}>
            {s.recent.filter((r) => r.kind !== 'task').slice(0, 5).map((r) => (
              <li key={r.kind + r.id}>{r.kind === 'lesson' ? <a href={href('lektion', r.id)}>{lessonById(r.id)?.title}</a> : <a href={href('sim', r.id)}>Simulation: {modelById(r.id)?.title.split(' (')[0]}</a>}</li>
            ))}
          </ul>
        </>
      )}
      <p className="muted" style={{ fontSize: '0.82rem' }}>NeuroLab ist ein Lernwerkzeug und kein Medizinprodukt. Es stellt keine Diagnosen und gibt keine Therapieempfehlungen; Fallbeispiele sind erfunden.</p>
    </div>
  );
}

function RelTag({ lesson }: { lesson: string }) {
  const l = lessonById(lesson);
  const m = l ? moduleById(l.module) : undefined;
  if (!m) return null;
  const r = relevanceOf(lesson, m.semesters);
  if (r.kind === 'fach') return null;
  const d = r.entry?.dates[0];
  return <span className={`rel-tag ${r.kind}`} title={r.detail}>{r.kind === 'belegt' ? `Leipzig${d ? ` · ab ${Number(d.slice(8))}.${Number(d.slice(5, 7))}.` : ''}` : 'ab 3. Sem.'}</span>;
}

const isoDay = (t: number) => new Date(t - new Date(t).getTimezoneOffset() * 60000).toISOString().slice(0, 10);

function ThisWeek() {
  const s = useStore((x) => x);
  if (s.settings.semester !== 1) return null;
  const now = Date.now();
  const items = lessonsInWindow(isoDay(now - 2 * 86400000), isoDay(now + 7 * 86400000));
  if (!items.length) return null;
  const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' });
  return (
    <section className="card" style={{ marginBottom: 22 }} aria-labelledby="week-h">
      <h3 id="week-h" style={{ marginTop: 0 }}>Diese Woche im Stundenplan</h3>
      <ul className="rows">
        {items.map(({ entry, first }) => {
          const l = lessonById(entry.lesson)!;
          const done = s.lessons[l.id]?.completed;
          return (
            <li key={entry.lesson}>
              <a href={href('lektion', l.id)}>
                <span className="num-circle" aria-hidden="true">{done ? '✓' : MOD_ICON[l.module]}</span>
                <div className="grow"><div className="t">{l.title}</div><div className="d">{entry.course}: {entry.block}{first >= isoDay(now) ? ` · ab ${fmt(first)}` : ' · läuft gerade'}</div></div>
                <span className="muted" aria-hidden="true">›</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="muted" style={{ fontSize: '0.82rem', margin: '8px 0 0' }}>Nach dem veröffentlichten Themenplan WS 2026/27 der Anatomie Leipzig. Änderungen im Studierendenportal haben Vorrang.</p>
    </section>
  );
}

function LessonRows({ ids }: { ids: string[] }) {
  const s = useStore((x) => x);
  return (
    <ul className="rows">
      {ids.map((lid, i) => {
        const l = lessonById(lid)!;
        const done = s.lessons[lid]?.completed;
        return (
          <li key={lid}>
            <a href={href('lektion', lid)}>
              <span className="num-circle" aria-hidden="true">{done ? '✓' : i + 1}</span>
              <div className="grow"><div className="t">{l.title}</div><div className="d">{l.subtitle}</div></div>
              <RelTag lesson={lid} />
              {done && <span className="sr-only">abgeschlossen</span>}
              <span className="muted" aria-hidden="true">›</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Library({ module }: { module?: string } = {}) {
  const [q, setQ] = useState('');
  const s = useStore((x) => x);
  const lastL = s.recent.find((r) => r.kind === 'lesson');
  const lastModule = lastL ? lessonById(lastL.id)?.module : undefined;
  const { current, earlier, later } = modulesBySemester(s.settings.semester);
  const [mod, setMod] = useState<string>(module ?? (lastModule && current.some((c) => c.id === lastModule) ? lastModule : current[0]?.id) ?? MODULES[0].id);
  const others = [...earlier, ...later];
  const ql = q.trim().toLowerCase();
  const hits = ql ? LESSONS.filter((l) => [l.title, l.subtitle, l.overview, ...l.terms.flatMap((t) => [t.term, ...(t.synonyms ?? [])])].join(' ').toLowerCase().includes(ql)) : [];
  const terms = ql.length >= 2 ? GLOSSARY.filter((g) => [g.term, ...g.synonyms].some((x) => x.toLowerCase().includes(ql))).slice(0, 6) : [];
  const m = moduleById(mod) ?? MODULES[0];
  const done = m.lessons.filter((l) => s.lessons[l]?.completed).length;
  return (
    <div className="stack" style={{ maxWidth: 860 }}>
      <div className="page-head"><div><h1>Lernen</h1></div></div>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Thema oder Fachbegriff suchen …" aria-label="Lektionen durchsuchen" style={{ width: '100%' }} />
      {ql ? (
        <section>
          {terms.length > 0 && (
            <div className="card" style={{ marginBottom: 14 }}>
              <ul className="list" style={{ margin: 0 }}>{terms.map((t) => <li key={t.term + t.lesson}><b>{t.term}</b>: {t.def} <a href={href('lektion', t.lesson)}>→ {lessonById(t.lesson)?.title}</a></li>)}</ul>
            </div>
          )}
          {hits.length ? <LessonRows ids={hits.map((l) => l.id)} /> : <p className="muted">Keine Lektion gefunden.</p>}
        </section>
      ) : (
        <section>
          <div className="toolbar-line" style={{ marginBottom: 14 }}>
            <div className="seg" role="tablist" aria-label={`Fächer im ${s.settings.semester}. Semester`}>
              {current.map((x) => <button key={x.id} role="tab" aria-selected={x.id === m.id} onClick={() => setMod(x.id)}>{MOD_ICON[x.id]} {x.title}</button>)}
            </div>
            {others.length > 0 && (
              <select value={others.some((o) => o.id === m.id) ? m.id : ''} onChange={(e) => e.target.value && setMod(e.target.value)} aria-label="Weitere Bereiche">
                <option value="">Weitere Bereiche …</option>
                {earlier.length > 0 && <optgroup label="Zum Wiederholen">{earlier.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</optgroup>}
                {later.length > 0 && <optgroup label="Später im Studium">{later.map((x) => <option key={x.id} value={x.id}>{x.title} – {x.area}</option>)}</optgroup>}
              </select>
            )}
          </div>
          <p className="muted" style={{ marginTop: 0 }}><b style={{ color: 'var(--ink)' }}>{m.area}</b>{m.semesters.length ? ` · ${m.semesters.join('. und ')}. Semester` : ''} · {done} von {m.lessons.length} abgeschlossen<br />{m.description}</p>
          <LessonRows ids={m.lessons} />
        </section>
      )}
    </div>
  );
}

export function ModulePage({ id }: { id: string }) {
  if (!moduleById(id)) return <div className="notice danger">Bereich nicht gefunden.</div>;
  return <Library key={id} module={id} />;
}

export function ModelLibrary() {
  return (
    <div className="stack">
      <div className="page-head"><div><h1>Modellbibliothek</h1><p className="muted" style={{ margin: 0 }}>Jede Simulation mit Zweck, Gleichungen, Parametern, Annahmen, Grenzen, Quellen und reproduzierbaren Referenzszenarien.</p></div></div>
      {MODELS.map((m) => (
        <details key={m.id} className="card">
          <summary>{m.title} <span className="muted" style={{ fontWeight: 400 }}>v{m.version}</span></summary>
          <div className="row" style={{ margin: '6px 0' }}><StatusBadge id={`model:${m.id}`} status={m.status} /><span className={`badge ${m.modelType === 'ausführlich' ? 'accent' : 'warn'}`}>{m.modelType === 'ausführlich' ? 'ausführlichere Berechnung' : 'vereinfachtes Modell'}</span><a className="btn small" href={href('sim', m.id)}>Simulation öffnen</a></div>
          <p><b>Zweck:</b> {m.purpose}</p>
          <p><b>Biologischer Prozess:</b> {m.process}</p>
          <h4>Gleichungen / Regeln</h4>{m.equations.map((e) => <div key={e} className="eq">{e}</div>)}
          <h4>Parameter und Einheiten</h4>
          <table><thead><tr><th>Parameter</th><th>Einheit</th><th>Bereich</th><th>Standard</th></tr></thead><tbody>
            {m.params.map((p) => <tr key={p.key}><td>{p.label}</td><td>{p.unit || '—'}</td><td>{p.type === 'select' ? p.options.map((o) => o.label).join(' / ') : p.type === 'bool' ? 'ja/nein' : `${p.min} – ${p.max}`}</td><td className="num">{String(p.default)}</td></tr>)}
          </tbody></table>
          <p><b>Anfangsbedingungen:</b> {m.initialConditions}</p>
          <p><b>Annahmen:</b> {m.assumptions.join(' · ')}</p>
          <p><b>Nicht berücksichtigt:</b> {m.omitted.join(' · ')}</p>
          <p><b>Grenzen:</b> {m.limits.join(' · ')}</p>
          <h4>Referenzszenarien</h4>
          <ul>{m.references.map((r) => <li key={r.name}><b>{r.name}</b>: {r.expectation}</li>)}</ul>
          <p className="muted">Fachliche Freigabe: {m.reviewNote}</p>
        </details>
      ))}
    </div>
  );
}
