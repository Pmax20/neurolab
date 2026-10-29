import { useState } from 'react';
import { MODULES } from '../content';
import type { LearningModule } from '../content/types';
import type { ExamDate } from '../store/state';
import { setState, useStore } from '../store/store';

/** Bereiche passend zum eingestellten Fachsemester: aktuell, schon gehabt, später. */
export function modulesBySemester(sem: number) {
  const current: LearningModule[] = [];
  const earlier: LearningModule[] = [];
  const later: LearningModule[] = [];
  for (const m of MODULES) {
    if (m.semesters.includes(sem)) current.push(m);
    else if (Math.max(...m.semesters) < sem) earlier.push(m);
    else later.push(m);
  }
  return { current, earlier, later };
}

/** Empfohlene Lernreihenfolge: erst die Fächer des aktuellen Semesters, dann Wiederholung, dann Ausblick. */
export function learningPath(sem: number): string[] {
  const { current, earlier, later } = modulesBySemester(sem);
  return [...current, ...earlier, ...later].flatMap((m) => m.lessons);
}

export function daysUntil(date: string, now = new Date()): number {
  const [y, mo, d] = date.split('-').map(Number);
  const target = new Date(y, mo - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function upcomingExams(exams: ExamDate[], now = new Date()) {
  return exams.filter((e) => daysUntil(e.date, now) >= 0).sort((a, b) => a.date.localeCompare(b.date));
}

export function countdownText(days: number) {
  if (days === 0) return 'heute';
  if (days === 1) return 'morgen';
  if (days < 14) return `in ${days} Tagen`;
  const w = Math.round(days / 7);
  return `in ${days} Tagen (≈ ${w} Wochen)`;
}

const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

export function ExamDates({ compact }: { compact?: boolean }) {
  const exams = useStore((s) => s.settings.exams);
  const sem = useStore((s) => s.settings.semester);
  const { current } = modulesBySemester(sem);
  const [module, setModule] = useState<string>(current[0]?.id ?? MODULES[0].id);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const save = (list: ExamDate[]) => setState((s) => ({ ...s, settings: { ...s.settings, exams: list } }));
  const add = () => {
    if (!date) return;
    const m = MODULES.find((x) => x.id === module)!;
    save([...exams, { id: `ex-${Date.now().toString(36)}`, module, title: title.trim() || `${m.title}-Klausur`, date }]);
    setTitle('');
    setDate('');
  };
  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div>
      {sorted.length > 0 && (
        <ul className="rows" style={{ marginBottom: 12 }}>
          {sorted.map((e) => {
            const d = daysUntil(e.date);
            return (
              <li key={e.id}><div className="row-inner">
                <div className="grow"><div className="t">{e.title}</div><div className="d">{fmtDate(e.date)} · {d < 0 ? 'vorbei' : countdownText(d)}</div></div>
                <button className="small ghost" onClick={() => save(exams.filter((x) => x.id !== e.id))} aria-label={`${e.title} entfernen`}>Entfernen</button>
              </div></li>
            );
          })}
        </ul>
      )}
      <div className="row" style={{ alignItems: 'flex-end' }}>
        <label className="field" style={{ margin: 0 }}><span className="lab"><span className="muted">Fach</span></span>
          <select value={module} onChange={(e) => setModule(e.target.value)}>{MODULES.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select>
        </label>
        {!compact && (
          <label className="field" style={{ margin: 0, flex: 1, minWidth: 160 }}><span className="lab"><span className="muted">Bezeichnung (optional)</span></span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Testat Histologie" />
          </label>
        )}
        <label className="field" style={{ margin: 0 }}><span className="lab"><span className="muted">Datum</span></span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button className="primary" onClick={add} disabled={!date}>Hinzufügen</button>
      </div>
    </div>
  );
}
