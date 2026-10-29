// Persistenz und Lernstand – unabhängig von React testbar.
import type { ErrorCategory, ReviewStatus } from '../content/types';

export const STORAGE_KEY = 'neurolab.v1';
export const SCHEMA_VERSION = 1;

export interface Attempt {
  taskId: string;
  t: number;
  score: number; // 0..1
  category?: ErrorCategory; // Fehlerkategorie (bei falscher Antwort)
  confidence?: 1 | 2 | 3; // Selbsteinschätzung: unsicher / mittel / sicher
  answer?: unknown;
  mode: 'ueben' | 'pruefen' | 'lektion' | 'experiment';
  /** Schwierigkeit der Aufgabe (1 leicht … 3 schwer) – verkürzt bei schweren Aufgaben die Intervalle */
  difficulty?: 1 | 2 | 3;
}

export interface TestResult { t: number; modules: string[]; n: number; score: number; timed: boolean }

export interface SavedExperiment {
  id: string;
  model: string;
  modelVersion: string;
  name: string;
  params: Record<string, number | string | boolean>;
  createdAt: number;
  guidedId?: string;
  question?: string;
  hypothesis?: string;
  hypothesisCorrect?: boolean;
  interpretation?: string;
  openQuestions?: string;
  resultSummary?: Record<string, { label: string; value: number | string; unit: string }>;
}

export interface LearningPath {
  id: string;
  name: string;
  lessons: string[];
  docs: string[]; // Import-IDs
  createdAt: number;
  done: string[];
  openQuestions: string;
}

export interface ImportedDoc {
  id: string;
  name: string;
  createdAt: number;
  pages: number;
  sections: { title: string; page: number }[];
  matches: { lesson: string; term: string; count: number; pages: number[] }[];
  unknownTerms: { term: string; count: number; pages: number[] }[];
  conflicts: { text: string; page: number; modelValue: string; topic: string }[];
  suggestions: Suggestion[];
  textPreview: string;
}

export interface Suggestion {
  id: string;
  kind: 'erklaerung' | 'aufgabe';
  lesson: string | null;
  term: string;
  text: string; // Satz aus der Quelle bzw. erzeugte Aufgabe
  answer?: string;
  page: number;
  status: ReviewStatus;
  reviewNote?: string;
}

export interface ReviewRecord {
  status: ReviewStatus;
  reviewer: string;
  date: number;
  note: string;
}

export interface ExamDate { id: string; module: string; title: string; date: string /* JJJJ-MM-TT */ }

export interface SrsEntry { box: number; due: number; lapses?: number; /** zuletzt bewertet (für die Synchronisierung) */ seen?: number }

export interface AppState {
  version: number;
  settings: { reducedMotion: 'system' | 'an' | 'aus'; showAdvanced: boolean; textScale: number; reviewerName: string; tourDone: boolean; hints: Record<string, boolean>; name: string; semester: number; exams: ExamDate[] };
  lessons: Record<string, { levels: number[]; completed: boolean; last: number }>;
  sims: Record<string, { runs: number; last: number }>;
  attempts: Attempt[];
  srs: Record<string, SrsEntry>;
  /** Karteikarten (Leitner wie bei Aufgaben), Schlüssel = Karten-ID */
  cards: Record<string, SrsEntry>;
  /** Ergebnisse abgeschlossener Prüfungsrunden */
  tests: TestResult[];
  experiments: SavedExperiment[];
  notes: Record<string, string>;
  paths: LearningPath[];
  imports: ImportedDoc[];
  reviews: Record<string, ReviewRecord>;
  recent: { kind: 'lesson' | 'sim' | 'task'; id: string; t: number }[];
}

export function emptyState(): AppState {
  return {
    version: SCHEMA_VERSION,
    settings: { reducedMotion: 'system', showAdvanced: false, textScale: 1, reviewerName: '', tourDone: false, hints: {}, name: 'Kim', semester: 1, exams: [] },
    lessons: {},
    sims: {},
    attempts: [],
    srs: {},
    cards: {},
    tests: [],
    experiments: [],
    notes: {},
    paths: [],
    imports: [],
    reviews: {},
    recent: [],
  };
}

const isObj = (x: unknown): x is Record<string, any> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Validiert und repariert geladene Daten. Beschädigte Einträge werden verworfen und gezählt. */
export function sanitize(raw: unknown): { state: AppState; dropped: string[] } {
  const dropped: string[] = [];
  const base = emptyState();
  if (!isObj(raw)) return { state: base, dropped: ['Gesamter Datensatz (kein gültiges Objekt)'] };
  if (typeof raw.version === 'number' && raw.version > SCHEMA_VERSION) dropped.push('Datensatz stammt aus einer neueren Version – unbekannte Felder werden ignoriert');
  const s: AppState = { ...base };
  if (isObj(raw.settings)) {
    s.settings = { ...base.settings, ...raw.settings };
    if (typeof s.settings.name !== 'string') s.settings.name = base.settings.name;
    const sem = Number(s.settings.semester);
    s.settings.semester = Number.isInteger(sem) && sem >= 1 && sem <= 12 ? sem : 1;
    s.settings.exams = Array.isArray(raw.settings.exams)
      ? raw.settings.exams.filter((e: any) => isObj(e) && typeof e.id === 'string' && typeof e.module === 'string' && typeof e.title === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date))
      : [];
  }
  if (isObj(raw.lessons)) for (const [k, v] of Object.entries(raw.lessons)) if (isObj(v) && Array.isArray(v.levels)) s.lessons[k] = { levels: v.levels.filter((n: any) => typeof n === 'number'), completed: !!v.completed, last: Number(v.last) || 0 };
  if (isObj(raw.sims)) for (const [k, v] of Object.entries(raw.sims)) if (isObj(v)) s.sims[k] = { runs: Number(v.runs) || 0, last: Number(v.last) || 0 };
  if (Array.isArray(raw.attempts)) {
    for (const a of raw.attempts) {
      if (isObj(a) && typeof a.taskId === 'string' && typeof a.score === 'number' && a.score >= 0 && a.score <= 1) s.attempts.push(a as Attempt);
      else dropped.push('Beschädigter Antwortdatensatz');
    }
  }
  const srsEntry = (v: any): SrsEntry => ({ box: Math.min(5, Math.max(1, v.box)), due: Number(v.due) || 0, ...(Number(v.lapses) > 0 ? { lapses: Math.floor(Number(v.lapses)) } : {}), ...(Number(v.seen) > 0 ? { seen: Number(v.seen) } : {}) });
  if (isObj(raw.srs)) for (const [k, v] of Object.entries(raw.srs)) if (isObj(v) && typeof v.box === 'number') s.srs[k] = srsEntry(v);
  if (Array.isArray(raw.tests)) s.tests = raw.tests.filter((x: any) => isObj(x) && typeof x.t === 'number' && typeof x.score === 'number' && Array.isArray(x.modules)).slice(-100) as TestResult[];
  if (isObj(raw.cards)) for (const [k, v] of Object.entries(raw.cards)) if (isObj(v) && typeof v.box === 'number') s.cards[k] = srsEntry(v);
  if (Array.isArray(raw.experiments)) {
    for (const e of raw.experiments) {
      if (isObj(e) && typeof e.id === 'string' && typeof e.model === 'string' && isObj(e.params)) s.experiments.push(e as SavedExperiment);
      else dropped.push(`Beschädigtes gespeichertes Experiment${isObj(e) && e.name ? ` „${e.name}“` : ''}`);
    }
  }
  if (isObj(raw.notes)) for (const [k, v] of Object.entries(raw.notes)) if (typeof v === 'string') s.notes[k] = v;
  if (Array.isArray(raw.paths)) for (const p of raw.paths) if (isObj(p) && typeof p.id === 'string' && Array.isArray(p.lessons)) s.paths.push({ openQuestions: "", docs: [], done: [], ...p } as unknown as LearningPath);
  if (Array.isArray(raw.imports)) for (const d of raw.imports) if (isObj(d) && typeof d.id === 'string' && Array.isArray(d.matches)) s.imports.push(d as ImportedDoc);
  if (isObj(raw.reviews)) for (const [k, v] of Object.entries(raw.reviews)) if (isObj(v) && typeof v.status === 'string') s.reviews[k] = v as ReviewRecord;
  if (Array.isArray(raw.recent)) s.recent = raw.recent.filter((r: any) => isObj(r) && typeof r.id === 'string').slice(0, 30);
  return { state: s, dropped };
}

// ---------------------------------------------------------------------------
// Wiederholungslogik (Leitner-System, 5 Fächer)
// ---------------------------------------------------------------------------

export const DAY = 24 * 3600 * 1000;
export const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 21]; // Index = Fach

/**
 * Leitner-Wiederholung. Berücksichtigt (Lastenheft 9.2): Antwortqualität, Zeitpunkt, wiederholte Fehler (lapses),
 * subjektive Sicherheit (1 unsicher … 3 sicher) und die Schwierigkeit (1 … 3).
 */
export function updateSrs(prev: SrsEntry | undefined, score: number, now: number, opts: { confidence?: 1 | 2 | 3; difficulty?: 1 | 2 | 3 } = {}): SrsEntry {
  const box0 = prev?.box ?? 1;
  const lapses = prev?.lapses ?? 0;
  const keep = (e: SrsEntry): SrsEntry => (e.lapses ? e : { box: e.box, due: e.due });
  if (score >= 0.8) {
    // richtig, aber „unsicher“: geraten oder knapp – nicht befördern
    const box = opts.confidence === 1 ? Math.max(1, box0) : Math.min(5, box0 + 1);
    let days = BOX_INTERVAL_DAYS[box];
    if (opts.difficulty === 3) days *= 0.7;
    if (lapses >= 2) days *= 0.5; // wiederholt falsch gewesen → vorsichtiger wiederholen
    const due = days > 0 ? now + days * DAY : now + (opts.confidence === 1 ? 10 : 30) * 60 * 1000;
    return keep({ box, due, lapses: Math.max(0, lapses - (box >= 4 ? 1 : 0)) });
  }
  if (score >= 0.5) return keep({ box: Math.max(1, box0), due: now + 10 * 60 * 1000, lapses });
  // falsch; „sicher“ und trotzdem falsch spricht für eine Fehlvorstellung → besonders bald wieder
  return { box: 1, due: now + (opts.confidence === 3 ? 2 : 5) * 60 * 1000, lapses: lapses + 1 };
}

export function recordAttempt(s: AppState, a: Attempt): AppState {
  return {
    ...s,
    attempts: [...s.attempts, a],
    srs: { ...s.srs, [a.taskId]: updateSrs(s.srs[a.taskId], a.score, a.t, { confidence: a.confidence, difficulty: a.difficulty }) },
    recent: [{ kind: 'task' as const, id: a.taskId, t: a.t }, ...s.recent].slice(0, 30),
  };
}

/** Karteikarte bewerten: gewusst (1), unsicher (0.5), nicht gewusst (0). */
export function rateCard(s: AppState, cardId: string, score: number, now: number): AppState {
  return { ...s, cards: { ...s.cards, [cardId]: { ...updateSrs(s.cards[cardId], score, now), seen: now } } };
}

/** Fällige bzw. neue Karten zuerst: neue (nie gesehen) gelten als fällig. */
export function dueCards(s: AppState, ids: string[], now: number): string[] {
  return ids
    .filter((id) => !s.cards[id] || s.cards[id].due <= now)
    .sort((a, b) => (s.cards[a]?.box ?? 0) - (s.cards[b]?.box ?? 0) || (s.cards[a]?.due ?? 0) - (s.cards[b]?.due ?? 0));
}

export function dueTasks(s: AppState, now: number): string[] {
  return Object.entries(s.srs)
    .filter(([, v]) => v.due <= now)
    .sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due)
    .map(([k]) => k);
}

export type Mastery = 'offen' | 'begonnen' | 'unsicher' | 'gefestigt';

/** Kompetenzstand pro Lernziel aus den Antworten der zugehörigen Aufgaben. */
export function objectiveMastery(s: AppState, taskIds: string[]): Mastery {
  const rel = s.attempts.filter((a) => taskIds.includes(a.taskId));
  if (!rel.length) return 'offen';
  const lastByTask = new Map<string, Attempt>();
  for (const a of rel) lastByTask.set(a.taskId, a);
  const last = [...lastByTask.values()];
  const allGood = last.every((a) => a.score >= 0.8);
  const boxes = taskIds.map((t) => s.srs[t]?.box ?? 0);
  if (allGood && last.length === taskIds.length && Math.min(...boxes) >= 3) return 'gefestigt';
  if (last.some((a) => a.score < 0.5)) return 'unsicher';
  return 'begonnen';
}

export interface ErrorPattern {
  lesson: string;
  category: ErrorCategory;
  count: number;
  tasks: string[];
}

/** Wiederkehrende Fehlermuster (Arbeitshypothese, keine Diagnose): ≥ 2 Fehler gleicher Kategorie in einer Lektion innerhalb der letzten 30 Antworten. */
export function errorPatterns(s: AppState, lessonOf: (taskId: string) => string[]): ErrorPattern[] {
  const recent = s.attempts.slice(-30).filter((a) => a.score < 0.8 && a.category);
  const map = new Map<string, ErrorPattern>();
  for (const a of recent) {
    for (const l of lessonOf(a.taskId)) {
      const key = `${l}|${a.category}`;
      const p = map.get(key) ?? { lesson: l, category: a.category!, count: 0, tasks: [] };
      p.count++;
      if (!p.tasks.includes(a.taskId)) p.tasks.push(a.taskId);
      map.set(key, p);
    }
  }
  return [...map.values()].filter((p) => p.count >= 2).sort((a, b) => b.count - a.count);
}

export function uid(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
