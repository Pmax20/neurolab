import type { ChoiceOption, ErrorCategory, Lesson, ModuleId, Task, TaskLevel } from './types';

// Gemeinsame Bausteine für die Ausbaustufe „1. Semester vollständig“: Lektionen, Ausbau bestehender Lektionen,
// Aufgaben und Übungsdaten (Quiz und Tabellen) für die Ansicht „topic“.

export interface QuizItem { q: string; head?: string; answer: string; options: string[]; why: string }
export interface TopicTable { title: string; head: string[]; rows: (string | number)[][]; note?: string }
export interface TopicExtra { quiz?: QuizItem[]; hint?: string; tables?: TopicTable[] }

const S = 'zu_pruefen' as const;
type Term = { term: string; def: string; synonyms?: string[] };

export interface LessonSpec {
  id: string; title: string; subtitle: string; prerequisites: string[]; objectives: string[]; overview: string;
  mechanism: [string, string][]; depth: string[]; equations?: string[]; pitfalls: string[]; terms: Term[]; links: string[]; locator: string;
  structures?: string[]; view?: string;
}

export function lessonFactory(module: ModuleId, source: string) {
  return (s: LessonSpec): Lesson => ({
    id: s.id, module, title: s.title, subtitle: s.subtitle, difficulty: 'grundlagen', prerequisites: s.prerequisites, view: s.view ?? 'topic', objectives: s.objectives, overview: s.overview,
    mechanism: s.mechanism.map(([title, text]) => ({ title, text })), depth: { text: s.depth, equations: s.equations ?? [], pitfalls: s.pitfalls }, terms: s.terms,
    structures: s.structures ?? [], models: [], links: s.links, sources: [{ id: source, locator: s.locator }], status: S, origin: 'redaktionell',
  });
}

export interface UpgradeSpec { title?: string; subtitle?: string; objectives: string[]; mechanism?: [string, string][]; depth?: string[]; equations?: string[]; pitfalls?: string[]; terms?: Term[]; links?: string[] }
/** Bestehende Lernziele bleiben wörtlich erhalten; neue werden angehängt. */
export function upgrade(u: UpgradeSpec) {
  return (b: Lesson): Lesson => ({
    ...b,
    title: u.title ?? b.title, subtitle: u.subtitle ?? b.subtitle,
    objectives: [...b.objectives, ...u.objectives],
    mechanism: [...b.mechanism, ...(u.mechanism ?? []).map(([title, text]) => ({ title, text }))],
    depth: { ...b.depth, text: [...b.depth.text, ...(u.depth ?? [])], equations: [...(b.depth.equations ?? []), ...(u.equations ?? [])], pitfalls: [...(b.depth.pitfalls ?? []), ...(u.pitfalls ?? [])] },
    terms: [...b.terms, ...(u.terms ?? []).filter((t) => !b.terms.some((x) => x.term === t.term))],
    links: [...b.links, ...(u.links ?? []).filter((x) => !b.links.includes(x))],
  });
}

export function taskKit(source: string) {
  const src = [{ id: source }];
  const rot = <T,>(id: string, a: T[]) => { const k = [...id].reduce((s, c) => s + c.charCodeAt(0), 0) % a.length; return [...a.slice(k), ...a.slice(0, k)]; };
  return {
    sc(id: string, lesson: string, objective: string, level: TaskLevel, category: ErrorCategory, prompt: string, correct: string, wrong: [string, string][], explanation: string): Task {
      const opts: ChoiceOption[] = [{ id: 'a', text: correct }, ...wrong.map(([text, why], i) => ({ id: String.fromCharCode(98 + i), text, why, category }))];
      return { id, type: 'single', prompt, level, lessons: [lesson], objective, category, sources: src, status: S, options: rot(id, opts), correct: 'a', explanation };
    },
    mc(id: string, lesson: string, objective: string, prompt: string, right: string[], wrong: [string, string][], explanation: string, category: ErrorCategory = 'verwechslung'): Task {
      const options: ChoiceOption[] = [...right.map((text, i) => ({ id: `r${i}`, text })), ...wrong.map(([text, why], i) => ({ id: `w${i}`, text, why }))];
      return { id, type: 'multi', level: 'verstaendnis', lessons: [lesson], objective, category, sources: src, status: S, prompt, options: rot(id, options), correct: right.map((_, i) => `r${i}`), explanation };
    },
    mt(id: string, lesson: string, objective: string, prompt: string, pairs: [string, string][], explanation: string, level: TaskLevel = 'wissen'): Task {
      return { id, type: 'match', level, lessons: [lesson], objective, category: 'verwechslung', sources: src, status: S, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation };
    },
    od(id: string, lesson: string, objective: string, prompt: string, items: string[], explanation: string): Task {
      return { id, type: 'order', level: 'verstaendnis', lessons: [lesson], objective, category: 'reihenfolge', sources: src, status: S, prompt, items, explanation };
    },
    tx(id: string, lesson: string, objective: string, prompt: string, modelAnswer: string, keywords: string[][]): Task {
      return { id, type: 'text', level: 'verknuepfung', lessons: [lesson], objective, category: 'mechanismus', sources: src, status: S, prompt, keywords, modelAnswer, explanation: modelAnswer };
    },
  };
}
