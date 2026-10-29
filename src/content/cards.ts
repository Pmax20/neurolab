import type { ModuleId } from './types';
import { LESSONS, STRUCTURES, TERM_CARDS, lessonById } from './index';

// Karteikarten für alle Fächer – automatisch aus den geprüften Inhalten der Lektionen abgeleitet:
// Fachbegriffe (Begriff → Definition), Strukturen (Name → Kurzbeschreibung) und Terminologie-Karten.
// Es werden keine neuen Fakten erzeugt; jede Karte verweist auf ihre Lektion.

export interface Flashcard {
  id: string;
  module: ModuleId;
  lesson: string;
  kind: 'Begriff' | 'Struktur' | 'Terminologie';
  front: string;
  hint?: string;
  back: string;
}

const slug = (x: string) => x.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const FLASHCARDS: Flashcard[] = (() => {
  const out: Flashcard[] = [];
  const seen = new Set<string>();
  const push = (c: Flashcard) => { if (!seen.has(c.id)) { seen.add(c.id); out.push(c); } };
  for (const l of LESSONS) for (const t of l.terms) push({ id: `b:${l.id}:${slug(t.term)}`, module: l.module, lesson: l.id, kind: 'Begriff', front: t.term, back: t.def, hint: t.synonyms?.length ? `auch: ${t.synonyms.join(', ')}` : undefined });
  for (const s of STRUCTURES) {
    const l = lessonById(s.lessons[0]);
    if (!l) continue;
    push({ id: `s:${s.id}`, module: l.module, lesson: l.id, kind: 'Struktur', front: s.deName, hint: s.sciName !== s.deName ? s.sciName : undefined, back: s.short });
  }
  for (const c of TERM_CARDS) {
    const lesson = c.group === 'lage' || c.group === 'ebene' ? 'lagebezeichnungen' : 'wortbildung';
    push({ id: `w:${slug(c.term)}`, module: 'term', lesson, kind: 'Terminologie', front: c.term, back: c.meaning + (c.example ? ` (z. B. ${c.example})` : '') });
  }
  return out;
})();
