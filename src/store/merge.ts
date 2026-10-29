// Zusammenführen zweier Lernstände (z. B. Laptop und Handy), damit beim Synchronisieren nichts verloren geht.
// Lernfortschritt wird vereinigt; Einstellungen und Listen ohne Zeitstempel kommen vom zuletzt geänderten Gerät.
import type { AppState, Attempt, SrsEntry } from './state';

const attemptKey = (a: Attempt) => `${a.taskId}|${a.t}|${a.mode}`;

function lastAttemptTimes(attempts: Attempt[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const a of attempts) if ((m.get(a.taskId) ?? -1) < a.t) m.set(a.taskId, a.t);
  return m;
}

/** Wiederholungsplan einer Aufgabe: Es gilt der Stand des Geräts mit der jüngsten Antwort zu dieser Aufgabe. */
function mergeSrs(a: Record<string, SrsEntry>, b: Record<string, SrsEntry>, ta: Map<string, number>, tb: Map<string, number>) {
  const out: Record<string, SrsEntry> = { ...a };
  for (const [k, vb] of Object.entries(b)) {
    const va = a[k];
    if (!va) { out[k] = vb; continue; }
    const la = ta.get(k) ?? -1, lb = tb.get(k) ?? -1;
    out[k] = lb > la || (lb === la && vb.due > va.due) ? vb : va;
  }
  return out;
}

/** Karteikarten: Es gilt die zuletzt bewertete Fassung (Feld „seen“), ersatzweise die mit dem späteren Fälligkeitstermin. */
function mergeCards(a: Record<string, SrsEntry>, b: Record<string, SrsEntry>) {
  const out: Record<string, SrsEntry> = { ...a };
  for (const [k, vb] of Object.entries(b)) {
    const va = a[k];
    if (!va) { out[k] = vb; continue; }
    const sa = va.seen ?? 0, sb = vb.seen ?? 0;
    out[k] = sb > sa || (sb === sa && vb.due > va.due) ? vb : va;
  }
  return out;
}

/**
 * @param local  Lernstand dieses Geräts
 * @param remote Lernstand aus der Datenbank
 * @param localIsNewer ob dieses Gerät zuletzt geändert wurde (entscheidet bei Einstellungen, Notizen, Listen)
 */
export function mergeStates(local: AppState, remote: AppState, localIsNewer: boolean): AppState {
  const newer = localIsNewer ? local : remote;
  const older = localIsNewer ? remote : local;

  const seen = new Set<string>();
  const attempts = [...local.attempts, ...remote.attempts]
    .filter((a) => { const k = attemptKey(a); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((x, y) => x.t - y.t);

  const lessons: AppState['lessons'] = { ...older.lessons };
  for (const [k, v] of Object.entries(newer.lessons)) {
    const o = lessons[k];
    lessons[k] = o ? { levels: [...new Set([...o.levels, ...v.levels])].sort((x, y) => x - y), completed: o.completed || v.completed, last: Math.max(o.last, v.last) } : v;
  }
  const sims: AppState['sims'] = { ...older.sims };
  for (const [k, v] of Object.entries(newer.sims)) { const o = sims[k]; sims[k] = o ? { runs: Math.max(o.runs, v.runs), last: Math.max(o.last, v.last) } : v; }

  const testSeen = new Set<number>();
  const tests = [...local.tests, ...remote.tests].filter((x) => (testSeen.has(x.t) ? false : (testSeen.add(x.t), true))).sort((x, y) => x.t - y.t).slice(-100);

  const recentSeen = new Set<string>();
  const recent = [...local.recent, ...remote.recent].sort((x, y) => y.t - x.t)
    .filter((r) => { const k = `${r.kind}|${r.id}`; if (recentSeen.has(k)) return false; recentSeen.add(k); return true; }).slice(0, 30);

  return {
    ...newer,
    attempts,
    srs: mergeSrs(local.srs, remote.srs, lastAttemptTimes(local.attempts), lastAttemptTimes(remote.attempts)),
    cards: mergeCards(local.cards, remote.cards),
    tests,
    lessons,
    sims,
    notes: { ...older.notes, ...newer.notes },
    recent,
  };
}
