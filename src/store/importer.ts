import { GLOSSARY, lessonById } from '../content';
import type { ImportedDoc, Suggestion } from './state';
import { uid } from './state';

export interface PageText {
  page: number;
  lines: { text: string; size: number }[];
}

const STOP = new Set(['Abbildung', 'Tabelle', 'Vorlesung', 'Beispiel', 'Zusammenfassung', 'Literatur', 'Einleitung', 'Übersicht', 'Kapitel', 'Abschnitt', 'Folgende', 'Weitere', 'Darstellung', 'Grundlagen', 'Allgemeinen', 'Beispiele', 'Lernziele', 'Wiederholung', 'Prüfung', 'Seite', 'Universität', 'Institut', 'Professor', 'Wintersemester', 'Sommersemester']);

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Begriffe (mit Synonymen) im Text finden. Kurze Begriffe (≤ 3 Zeichen) nur als ganze Wörter und mit Groß-/Kleinschreibung. */
function termRegex(term: string) {
  const t = escapeRe(term.trim());
  if (term.length <= 4) return new RegExp(`(^|[^\\p{L}])${t}([^\\p{L}]|$)`, 'u');
  return new RegExp(`(^|[^\\p{L}])${t}`, 'iu');
}

const CHECKS: { topic: string; near: RegExp; value: RegExp; ok: (v: number) => boolean; model: string }[] = [
  { topic: 'Ruhemembranpotenzial', near: /ruhe(membran)?potential|ruhe(membran)?potenzial/i, value: /(−|-|minus\s*)\s*(\d{2,3})(?:[.,]\d)?\s*mV/i, ok: (v) => v <= -55 && v >= -95, model: 'Modell: ca. −70 mV (typischer Bereich Neuron −60 bis −80 mV)' },
  { topic: 'K⁺-Gleichgewichtspotenzial', near: /E[_\s]?K\b|kalium[-\s]?gleichgewichtspotenzial|gleichgewichtspotenzial für k/i, value: /(−|-)\s*(\d{2,3})(?:[.,]\d)?\s*mV/i, ok: (v) => v <= -75 && v >= -105, model: 'Modell: ca. −95 mV (4/140 mmol/l, 37 °C)' },
  { topic: 'ATP-Ausbeute pro Glukose', near: /ATP.{0,40}glukose|glukose.{0,40}ATP/i, value: /(\d{2})\s*(?:mol\s*)?ATP/i, ok: (v) => v >= 30 && v <= 38, model: 'Modell: 30–32 ATP (P/O 2,5/1,5) bzw. 36–38 (3/2) je nach Konvention' },
  { topic: 'Herzzeitvolumen in Ruhe', near: /herzzeitvolumen|herzminutenvolumen/i, value: /(\d+(?:[.,]\d+)?)\s*(?:l|L|Liter)\s*\/\s*min/, ok: (v) => v >= 4 && v <= 7, model: 'Modell: ca. 4,9 l/min (HF 70/min · SV 70 ml)' },
  { topic: 'Arterieller pH', near: /pH.{0,30}(blut|arteriell)|(blut|arteriell).{0,30}pH/i, value: /7[.,](\d{1,2})/, ok: (v) => v >= 35 && v <= 45, model: 'Modell: 7,35–7,45' },
];

export function analyzePages(name: string, pages: PageText[]): ImportedDoc {
  const sections: { title: string; page: number }[] = [];
  const allSizes = pages.flatMap((p) => p.lines.map((l) => l.size)).filter((x) => x > 0).sort((a, b) => a - b);
  const median = allSizes.length ? allSizes[Math.floor(allSizes.length / 2)] : 0;
  for (const p of pages) {
    for (const l of p.lines) {
      const t = l.text.trim();
      if (t.length < 3 || t.length > 90) continue;
      const numbered = /^(\d+(\.\d+)*\.?|[IVX]+\.)\s+\p{Lu}/u.test(t);
      const md = /^#{1,4}\s+/.test(t);
      const big = median > 0 && l.size >= median * 1.25;
      if ((numbered || md || big) && !/[.;:]$/.test(t)) sections.push({ title: t.replace(/^#+\s*/, ''), page: p.page });
    }
  }
  const text = pages.map((p) => ({ page: p.page, text: p.lines.map((l) => l.text).join('\n') }));
  // Begriffszuordnung
  const matchMap = new Map<string, { lesson: string; term: string; count: number; pages: Set<number> }>();
  const knownWords = new Set<string>();
  for (const g of GLOSSARY) {
    for (const v of [g.term, ...g.synonyms]) {
      knownWords.add(v.toLowerCase());
      const re = termRegex(v);
      for (const p of text) {
        if (re.test(p.text)) {
          const key = `${g.lesson}|${g.term}`;
          const m = matchMap.get(key) ?? { lesson: g.lesson, term: g.term, count: 0, pages: new Set<number>() };
          m.count += (p.text.match(new RegExp(re.source, re.flags + 'g')) ?? []).length || 1;
          m.pages.add(p.page);
          matchMap.set(key, m);
        }
      }
    }
  }
  const matches = [...matchMap.values()].sort((a, b) => b.count - a.count).map((m) => ({ lesson: m.lesson, term: m.term, count: m.count, pages: [...m.pages].sort((a, b) => a - b) }));
  // Mögliche fehlende Inhalte: häufige lange Substantive, die nicht im Glossar vorkommen
  const freq = new Map<string, { count: number; pages: Set<number> }>();
  for (const p of text) {
    for (const w of p.text.match(/\b\p{Lu}[\p{Ll}ß]{7,}(?:-\p{L}+)?\b/gu) ?? []) {
      if (STOP.has(w)) continue;
      const lw = w.toLowerCase();
      if ([...knownWords].some((k) => k.length > 5 && (lw.includes(k) || k.includes(lw)))) continue;
      const f = freq.get(w) ?? { count: 0, pages: new Set<number>() };
      f.count++;
      f.pages.add(p.page);
      freq.set(w, f);
    }
  }
  const unknownTerms = [...freq.entries()].filter(([, v]) => v.count >= 2).sort((a, b) => b[1].count - a[1].count).slice(0, 20).map(([term, v]) => ({ term, count: v.count, pages: [...v.pages].sort((a, b) => a - b) }));
  // Widersprüche zu Modellwerten anzeigen (nicht entscheiden)
  const conflicts: ImportedDoc['conflicts'] = [];
  for (const p of text) {
    const sentences = p.text.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      for (const c of CHECKS) {
        if (!c.near.test(s)) continue;
        const m = s.match(c.value);
        if (!m) continue;
        const num = c.topic === 'Arterieller pH' ? Number(m[1].padEnd(2, '0')) : Number((m[2] ?? m[1]).replace(',', '.')) * (m[1] === '-' || m[1] === '−' || /minus/i.test(m[1] ?? '') ? -1 : 1);
        if (!c.ok(num)) conflicts.push({ text: s.trim().slice(0, 300), page: p.page, modelValue: c.model, topic: c.topic });
      }
    }
  }
  // Vorschläge (automatisch erzeugt – erfordern Prüfung)
  const suggestions: Suggestion[] = [];
  const used = new Set<string>();
  for (const m of matches.slice(0, 25)) {
    const re = termRegex(m.term);
    for (const p of text) {
      if (!m.pages.includes(p.page)) continue;
      const sentences = p.text.replace(/\n/g, ' ').split(/(?<=[.!?])\s+/).filter((s) => s.length > 50 && s.length < 320 && re.test(s));
      const s = sentences[0];
      if (!s || used.has(s)) continue;
      used.add(s);
      suggestions.push({ id: uid('sg'), kind: 'erklaerung', lesson: m.lesson, term: m.term, text: s.trim(), page: p.page, status: 'zu_pruefen' });
      const cloze = s.replace(new RegExp(re.source, re.flags + 'g'), (x, pre) => `${pre ?? ''}_____`);
      if (cloze !== s) suggestions.push({ id: uid('sg'), kind: 'aufgabe', lesson: m.lesson, term: m.term, text: `Lückentext: ${cloze.trim()}`, answer: m.term, page: p.page, status: 'zu_pruefen' });
      break;
    }
  }
  return {
    id: uid('doc'),
    name,
    createdAt: Date.now(),
    pages: pages.length,
    sections: sections.slice(0, 80),
    matches,
    unknownTerms,
    conflicts,
    suggestions,
    textPreview: text.map((t) => t.text).join('\n').slice(0, 3000),
  };
}

export function textToPages(text: string): PageText[] {
  // Seitenumbrüche (Formfeed) respektieren, sonst eine Seite je ~3000 Zeichen
  const raw = text.includes('\f') ? text.split('\f') : chunk(text, 3000);
  return raw.map((t, i) => ({ page: i + 1, lines: t.split(/\r?\n/).map((l) => ({ text: l, size: /^#{1,4}\s/.test(l) ? 14 : 10 })) }));
}

function chunk(t: string, n: number) {
  const lines = t.split(/\r?\n/);
  const out: string[] = [];
  let cur = '';
  for (const l of lines) {
    if (cur.length + l.length > n && cur) { out.push(cur); cur = ''; }
    cur += l + '\n';
  }
  if (cur) out.push(cur);
  return out;
}

export async function pdfToPages(buf: ArrayBuffer, onProgress?: (p: number, n: number) => void): Promise<PageText[]> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./pdf.worker.min.js', document.baseURI).href;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
  const pages: PageText[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    const rows = new Map<number, { x: number; s: string; size: number }[]>();
    for (const it of tc.items as any[]) {
      if (!('str' in it)) continue;
      const y = Math.round(it.transform[5]);
      const size = Math.abs(it.transform[0]) || it.height || 0;
      const key = [...rows.keys()].find((k) => Math.abs(k - y) <= 2) ?? y;
      const r = rows.get(key) ?? [];
      r.push({ x: it.transform[4], s: it.str, size });
      rows.set(key, r);
    }
    const lines = [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, r]) => {
      r.sort((a, b) => a.x - b.x);
      return { text: r.map((x) => x.s).join(' ').replace(/\s+/g, ' ').trim(), size: Math.max(...r.map((x) => x.size)) };
    }).filter((l) => l.text);
    pages.push({ page: i, lines });
    onProgress?.(i, doc.numPages);
  }
  return pages;
}

export function lessonTitle(id: string | null) {
  return id ? lessonById(id)?.title ?? id : '—';
}
