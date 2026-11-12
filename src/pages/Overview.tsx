import { useMemo, useState } from 'react';
import { LESSONS, MODULES, TASKS, lessonById, moduleById, tasksForLesson, taskById, GLOSSARY, STRUCTURES } from '../content';
import { MODELS, modelById } from '../engine/registry';
import { setState, useStore } from '../store/store';
import { dueTasks, errorPatterns } from '../store/state';
import { ERROR_LABEL } from '../content/types';
import { href } from '../ui/router';
import { StatusBadge } from '../ui/common';
import { relevanceOf, lessonsInWindow } from '../content/curriculum';
import { TESTATE, testatLessons } from '../content/chem7';
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

export function setFocus(id: string) { setState((x) => ({ ...x, settings: { ...x.settings, focus: id } })); }

/** Fokus-Leiste: Startseite, Lernen und Üben zeigen zuerst das gewählte Fach. */
export function FocusBar() {
  const s = useStore((x) => x);
  const { current } = modulesBySemester(s.settings.semester);
  const focus = current.some((m) => m.id === s.settings.focus) ? s.settings.focus : '';
  return (
    <div className="focus-bar" role="group" aria-label="Fokus auf ein Fach">
      <span className="muted">Fokus:</span>
      <button className="chip" aria-pressed={focus === ''} onClick={() => setFocus('')}>Alle Fächer</button>
      {current.map((m) => <button key={m.id} className="chip" aria-pressed={focus === m.id} onClick={() => setFocus(m.id)}>{MOD_ICON[m.id]} {m.title}</button>)}
    </div>
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
  const { current, earlier, later } = modulesBySemester(sem);
  const focusMod = current.find((m) => m.id === s.settings.focus);
  // Weiterlernen: zuletzt offene Lektion (im Fokusfach), sonst die nächste offene des Lernpfads
  const PATH = focusMod ? focusMod.lessons : learningPath(sem);
  const lastLesson = s.recent.find((r) => r.kind === 'lesson' && !s.lessons[r.id]?.completed && (!focusMod || focusMod.lessons.includes(r.id)));
  const nextId = lastLesson?.id ?? PATH.find((id) => !s.lessons[id]?.completed) ?? PATH[0];
  const next = lessonById(nextId)!;
  const started = !!s.lessons[nextId];
  const first = s.recent.length === 0;
  // Nächster Termin: eingetragene Klausur, sonst (1. Semester) das Chemie-Testat
  const exams = upcomingExams(s.settings.exams).filter((e) => !focusMod || e.module === focusMod.id);
  const exam = exams[0];
  const examModule = exam ? moduleById(exam.module) : undefined;
  const examDays = exam ? daysUntil(exam.date) : 0;
  const examLessons = examModule ? examModule.lessons : [];
  const examDone = examLessons.filter((l) => s.lessons[l]?.completed).length;
  const testat = sem === 1 && (!focusMod || focusMod.id === 'molecule') ? TESTATE[0] : undefined;
  const tLessons = testat ? testatLessons(testat) : [];
  const tDone = tLessons.filter((l) => s.lessons[l]?.completed).length;
  const pattern = patterns.find((p) => !focusMod || focusMod.lessons.includes(p.lesson));
  const pl = pattern ? lessonById(pattern.lesson) : undefined;
  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>{s.settings.name ? `Hallo ${s.settings.name}` : first ? 'Willkommen bei NeuroLab' : 'Schön, dass du weiterlernst'}</h1>
      <p className="muted" style={{ marginBottom: 12 }}>Dein {sem}. Semester{focusMod ? ` · Fokus auf ${focusMod.title}` : ''}.</p>
      <FocusBar />
      <h2 className="today-h">Heute</h2>
      <div className="hero">
        <a className="continue" href={href('lektion', next.id)}>
          <Trace />
          <span style={{ opacity: 0.85 }}>{started ? 'Weiter mit' : first ? 'Dein Einstieg' : 'Als Nächstes'}</span>
          <h2>{next.title}</h2>
          <p>{next.overview.split('. ')[0]}.</p>
          <span className="go">{started ? 'Lektion fortsetzen' : 'Lektion öffnen'}</span>
        </a>
        <div className="today exam-card" aria-label="Heute wichtig">
          {exam && examModule ? (
            <a className="today-item" href={`#/pruefung?modul=${examModule.id}`}>
              <span className="exam-count" aria-hidden="true"><b>{examDays}</b><span>{examDays === 1 ? 'Tag' : 'Tage'}</span></span>
              <span className="grow"><span className="t">{exam.title}</span><span className="d">{countdownText(examDays)} · {examDone} von {examLessons.length} Lektionen</span><span className="meter"><span style={{ width: `${(examDone / Math.max(1, examLessons.length)) * 100}%` }} /></span></span>
              <span className="go-arrow" aria-hidden="true">›</span>
            </a>
          ) : testat ? (
            <a className="today-item" href={`#/pruefung?testat=${testat.id}`}>
              <span className="ico-box" aria-hidden="true">⌬</span>
              <span className="grow"><span className="t">{testat.title}</span><span className="d">{tDone} von {tLessons.length} Lektionen · Üben und Testat simulieren</span><span className="meter"><span style={{ width: `${(tDone / Math.max(1, tLessons.length)) * 100}%` }} /></span></span>
              <span className="go-arrow" aria-hidden="true">›</span>
            </a>
          ) : null}
          <a className="today-item" href="#/pruefung?modus=wiederholen">
            <span className="ico-box" aria-hidden="true">↻</span>
            <span className="grow"><span className="t">{due.length ? `${due.length} ${due.length === 1 ? 'Wiederholung' : 'Wiederholungen'} fällig` : 'Keine Wiederholung fällig'}</span><span className="d">{due.length ? 'Kurz auffrischen, was du schon gelernt hast' : 'Alles aufgefrischt – weiter mit Neuem'}</span></span>
            <span className="go-arrow" aria-hidden="true">›</span>
          </a>
          {pl ? (
            <a className="today-item" href={href('lektion', pl.id)}>
              <span className="ico-box" aria-hidden="true">!</span>
              <span className="grow"><span className="t">Noch unsicher: {pl.title}</span><span className="d">Zuletzt öfter Fehler der Art „{ERROR_LABEL[pattern!.category]}“ – kurz die Erklärung lesen</span></span>
              <span className="go-arrow" aria-hidden="true">›</span>
            </a>
          ) : (
            <a className="today-item" href="#/pruefung">
              <span className="ico-box" aria-hidden="true">✎</span>
              <span className="grow"><span className="t">Üben</span><span className="d">12 Aufgaben, unsichere Themen zuerst</span></span>
              <span className="go-arrow" aria-hidden="true">›</span>
            </a>
          )}
        </div>
      </div>
      {first && onTour && (
        <div className="hint-card" style={{ marginBottom: 22 }}>
          <div><b>Neu hier?</b> Die Tour zeigt dir in einer Minute, wie Lektionen, Simulationen und Übungen funktionieren.</div>
          <button className="small primary" onClick={onTour}>Tutorial starten</button>
        </div>
      )}
      <h2>{focusMod ? 'Dein Fokusfach' : `Deine Fächer im ${sem}. Semester`}</h2>
      <div className="module-list" style={{ marginBottom: 14 }}>
        {(focusMod ? [focusMod] : current).map((m) => {
          const done = m.lessons.filter((l) => s.lessons[l]?.completed).length;
          return (
            <a key={m.id} href={href('modul', m.id)}>
              <h3 style={{ marginBottom: 2 }}>{MOD_ICON[m.id]} {m.title}</h3>
              <div className="muted" style={{ fontSize: '0.92rem' }}>{done} von {m.lessons.length} Lektionen</div>
              <div className="bar" aria-label={`${done} von ${m.lessons.length} abgeschlossen`}><div style={{ width: `${(done / m.lessons.length) * 100}%` }} /></div>
            </a>
          );
        })}
      </div>
      {!focusMod && (earlier.length > 0 || later.length > 0) && (
        <p className="muted" style={{ marginBottom: 20 }}>
          {earlier.length > 0 && <>Zum Wiederholen: {earlier.map((m, i) => <span key={m.id}>{i > 0 && ' · '}<a href={href('modul', m.id)}>{m.title}</a></span>)}. </>}
          {later.length > 0 && <>Später im Studium: {later.map((m, i) => <span key={m.id}>{i > 0 && ' · '}<a href={href('modul', m.id)}>{m.title}</a></span>)}.</>}
        </p>
      )}
      <div className="stack" style={{ gap: 10, marginBottom: 24 }}>
        <ThisWeek />
        <details className="card fold">
          <summary>Klausur- und Testattermine{s.settings.exams.length ? ` (${s.settings.exams.length})` : ''}</summary>
          <p className="muted" style={{ fontSize: '0.9rem' }}>Eingetragene Termine erscheinen oben unter „Heute“ mit Countdown und passenden Übungen.</p>
          <ExamDates />
        </details>
      </div>
      <p className="muted" style={{ fontSize: '0.9rem' }}>{completed} von {LESSONS.length} Lektionen abgeschlossen · {answered} von {TASKS.length} Aufgaben bearbeitet · <a href="#/analyse">Fortschritt ansehen</a></p>
      <p className="muted" style={{ fontSize: '0.82rem' }}>NeuroLab ist ein Lernwerkzeug und kein Medizinprodukt. Es stellt keine Diagnosen und gibt keine Therapieempfehlungen; Fallbeispiele sind erfunden. Die Inhalte sind KI-gestützt erstellt und mit Quellen abgeglichen – bei Abweichungen gilt deine Vorlesung.</p>
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
    <details className="card fold">
      <summary>Diese Woche im Stundenplan ({items.length})</summary>
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
    </details>
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

export function Library({ module, search, initial = '' }: { module?: string; search?: boolean; initial?: string } = {}) {
  const [q, setQ] = useState(initial);
  const s = useStore((x) => x);
  const lastL = s.recent.find((r) => r.kind === 'lesson');
  const lastModule = lastL ? lessonById(lastL.id)?.module : undefined;
  const { current, earlier, later } = modulesBySemester(s.settings.semester);
  const focusId = current.some((c) => c.id === s.settings.focus) ? s.settings.focus : undefined;
  const [mod, setMod] = useState<string>(module ?? focusId ?? (lastModule && current.some((c) => c.id === lastModule) ? lastModule : current[0]?.id) ?? MODULES[0].id);
  const others = [...earlier, ...later];
  const ql = q.trim().toLowerCase();
  const hits = ql ? LESSONS.filter((l) => [l.title, l.subtitle, l.overview, ...l.terms.flatMap((t) => [t.term, ...(t.synonyms ?? [])])].join(' ').toLowerCase().includes(ql)) : [];
  const terms = ql.length >= 2 ? GLOSSARY.filter((g) => [g.term, ...g.synonyms].some((x) => x.toLowerCase().includes(ql))).slice(0, 6) : [];
  const m = moduleById(mod) ?? MODULES[0];
  const done = m.lessons.filter((l) => s.lessons[l]?.completed).length;
  return (
    <div className="stack" style={{ maxWidth: 860 }}>
      <div className="page-head"><div><h1>{search ? 'Suchen' : 'Lernen'}</h1>{search && <p className="muted" style={{ margin: 0 }}>Findet Lektionen und Fachbegriffe aus allen Fächern.</p>}</div>{!search && <a className="btn small" href="#/experimente">⚗ Experimente und Simulationen</a>}</div>
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Thema oder Fachbegriff suchen, z. B. Osmose …" aria-label="Lektionen durchsuchen" style={{ width: '100%' }} autoFocus={search} />
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
