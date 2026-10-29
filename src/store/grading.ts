import type { ErrorCategory, Task } from '../content/types';
import { calcInstance, gradeCalc, type CalcAnswer } from '../content/calc';
import { checkBalance } from '../content/chemtools';

export interface GradeResult {
  score: number; // 0..1
  verdict: 'richtig' | 'teilweise richtig' | 'falsch' | 'zur Selbstbewertung';
  category?: ErrorCategory;
  details: string[]; // erklärende Rückmeldungen
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9⁺⁻+\-/ ]/g, ' ');

/** Zahl aus deutscher oder englischer Schreibweise lesen ("−61,5" / "-61.5"). */
const SUPD: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };

/** Zahl aus deutscher oder englischer Schreibweise lesen ("−61,5", "-61.5", "6,02 · 10^23", "6,02e23", "6,02·10²³"). */
export function parseNumber(s: string): number | null {
  let t = s.trim().replace(/−/g, '-').replace(/\s/g, '').replace(',', '.');
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+$/, (m) => '^' + [...m].map((c) => SUPD[c]).join(''));
  const pow = t.match(/^([-+]?\d*\.?\d+)?(?:[·*x×]?10\^\(?([-+]?\d+)\)?)$/i);
  if (pow) return (pow[1] ? Number(pow[1]) : 1) * 10 ** Number(pow[2]);
  if (!/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(t)) return null;
  return Number(t);
}

export function grade(task: Task, answer: any): GradeResult {
  switch (task.type) {
    case 'single':
    case 'error':
    case 'diagram':
    case 'predict': {
      const opt = task.options.find((o) => o.id === answer);
      if (!opt) return { score: 0, verdict: 'falsch', details: ['Keine Antwort ausgewählt.'], category: task.category };
      if (opt.id === task.correct) return { score: 1, verdict: 'richtig', details: [] };
      return { score: 0, verdict: 'falsch', category: opt.category ?? task.category, details: [opt.why ?? 'Diese Antwort trifft nicht zu.'] };
    }
    case 'multi': {
      const sel: string[] = Array.isArray(answer) ? answer : [];
      const correct = new Set(task.correct);
      let hits = 0;
      let wrong = 0;
      const details: string[] = [];
      let category: ErrorCategory | undefined;
      for (const o of task.options) {
        const chosen = sel.includes(o.id);
        if (chosen && correct.has(o.id)) hits++;
        if (chosen && !correct.has(o.id)) {
          wrong++;
          details.push(`„${o.text}“: ${o.why ?? 'gehört nicht dazu.'}`);
          category = category ?? o.category;
        }
        if (!chosen && correct.has(o.id)) details.push(`„${o.text}“ hätte ebenfalls ausgewählt werden müssen.`);
      }
      const score = Math.max(0, (hits - wrong) / correct.size);
      return { score, verdict: score === 1 ? 'richtig' : score > 0 ? 'teilweise richtig' : 'falsch', category: score < 1 ? category ?? task.category : undefined, details };
    }
    case 'match': {
      const map: Record<string, string> = answer ?? {};
      let ok = 0;
      const details: string[] = [];
      for (const p of task.pairs) {
        if (map[p.left] === p.right) ok++;
        else details.push(`${p.left} → richtig wäre: ${p.right}${map[p.left] ? ` (gewählt: ${map[p.left]})` : ''}`);
      }
      const score = ok / task.pairs.length;
      return { score, verdict: score === 1 ? 'richtig' : score > 0 ? 'teilweise richtig' : 'falsch', category: score < 1 ? task.category : undefined, details };
    }
    case 'order':
    case 'cause': {
      const seq: string[] = Array.isArray(answer) ? answer : [];
      let ok = 0;
      for (let i = 0; i < task.items.length; i++) if (seq[i] === task.items[i]) ok++;
      // Teilpunkte für korrekt aufeinanderfolgende Paare
      let pairs = 0;
      for (let i = 0; i < seq.length - 1; i++) {
        const a = task.items.indexOf(seq[i]);
        const b = task.items.indexOf(seq[i + 1]);
        if (b === a + 1) pairs++;
      }
      const score = ok === task.items.length ? 1 : Math.max(ok / task.items.length, (pairs / (task.items.length - 1)) * 0.8);
      const details = ok === task.items.length ? [] : ['Richtige Reihenfolge: ' + task.items.map((x, i) => `${i + 1}. ${x}`).join(' → ')];
      return { score, verdict: score === 1 ? 'richtig' : score >= 0.5 ? 'teilweise richtig' : 'falsch', category: score < 1 ? 'reihenfolge' : undefined, details };
    }
    case 'label': {
      const map: Record<number, string> = answer ?? {};
      let ok = 0;
      const details: string[] = [];
      for (const m of task.markers) {
        if (map[m.n] === m.structure) ok++;
        else details.push(`Markierung ${m.n}: falsch zugeordnet.`);
      }
      const score = ok / task.markers.length;
      return { score, verdict: score === 1 ? 'richtig' : score > 0 ? 'teilweise richtig' : 'falsch', category: score < 1 ? 'begriff' : undefined, details };
    }
    case 'formula': {
      const v = typeof answer === 'number' ? answer : parseNumber(String(answer ?? ''));
      if (v === null || !Number.isFinite(v)) return { score: 0, verdict: 'falsch', category: 'formel', details: ['Bitte eine Zahl eingeben (Komma oder Punkt als Dezimaltrennzeichen).'] };
      const tol = Math.max(task.tolerance, 1e-9);
      if (Math.abs(v - task.answer) <= tol) return { score: 1, verdict: 'richtig', details: [] };
      const details = [`Erwartet: ${String(task.answer).replace('.', ',')} ${task.unit}`.trim()];
      if (Math.abs(v + task.answer) <= tol && task.answer !== 0) details.push('Das Vorzeichen ist vertauscht – prüfe z. B. die Ladungszahl z oder die Richtung.');
      else if (task.answer !== 0 && [10, 100, 1000, 0.1, 0.01, 0.001].some((f) => Math.abs(v - task.answer * f) <= tol * Math.abs(f))) details.push('Der Wert weicht um eine Zehnerpotenz ab – prüfe die Einheitenumrechnung.');
      return { score: 0, verdict: 'falsch', category: 'formel', details };
    }
    case 'calc': {
      const a: CalcAnswer = answer ?? { seed: task.seed ?? 1 };
      const inst = calcInstance(task.template, a.seed ?? task.seed ?? 1);
      const r = gradeCalc(inst, a, parseNumber);
      return { score: r.score, verdict: r.score >= 0.99 ? 'richtig' : r.score > 0 ? 'teilweise richtig' : 'falsch', category: r.category, details: r.details };
    }
    case 'balance': {
      const c: number[] = (Array.isArray(answer) ? answer : []).map((x: any) => Number(x));
      const r = checkBalance(task.reactants, task.products, c);
      if (!r.valid) return { score: 0, verdict: 'falsch', category: 'rechnen', details: ['Bitte vor jede Formel eine ganze Zahl ab 1 eintragen.'] };
      if (r.balanced && r.minimal) return { score: 1, verdict: 'richtig', details: [] };
      if (r.balanced) return { score: 0.8, verdict: 'teilweise richtig', category: 'rechnen', details: ['Die Bilanz stimmt, aber die Koeffizienten lassen sich noch kürzen – gesucht sind die kleinsten ganzen Zahlen.'] };
      const details = r.rows.filter((x) => x.left !== x.right).map((x) => `${x.el}: links ${x.left}, rechts ${x.right}`);
      if (!r.chargeOk) details.push(`Ladung: links ${r.chargeLeft}, rechts ${r.chargeRight}`);
      return { score: 0, verdict: 'falsch', category: 'rechnen', details: ['Die Atombilanz stimmt noch nicht:', ...details] };
    }
    case 'histo': {
      const a = answer ?? {};
      const details: string[] = [];
      const wForm = task.form ? 0.1 : 0;
      const wLayers = task.layers ? 0.1 : 0;
      const wTissue = 0.6 - wForm - wLayers;
      let score = 0;
      let category: ErrorCategory | undefined;
      const set = (c: ErrorCategory) => { category = category ?? c; };
      if (a.tissue === task.scene) score += wTissue; else { set('gewebe'); details.push('Gewebeart: nicht richtig erkannt.'); }
      if (task.form) { if (a.form === task.form.correct) score += wForm; else { set('zellform'); details.push(`Zellform: richtig wäre „${task.form.correct}“.`); } }
      if (task.layers) { if (a.layers === task.layers.correct) score += wLayers; else { set('schichtzahl'); details.push(`Schichtung: richtig wäre „${task.layers.correct}“.`); } }
      const sel: string[] = Array.isArray(a.features) ? a.features : [];
      const right = task.features.filter((f) => f.ok);
      const hits = right.filter((f) => sel.includes(f.text)).length;
      const wrong = task.features.filter((f) => !f.ok && sel.includes(f.text));
      score += 0.25 * Math.max(0, (hits - wrong.length) / right.length);
      if (hits < right.length) { set('merkmal'); details.push(`Übersehen: ${right.filter((f) => !sel.includes(f.text)).map((f) => f.text).join('; ')}.`); }
      for (const f of wrong) { set('verwechslung'); details.push(`„${f.text}“ trifft nicht zu: ${f.why ?? ''}`.trim()); }
      if (a.fn === task.fn.correct) score += 0.15; else { set('funktion'); details.push(`Funktion: ${task.fn.correct}.`); }
      score = Math.round(score * 100) / 100;
      return { score, verdict: score >= 0.99 ? 'richtig' : score > 0 ? 'teilweise richtig' : 'falsch', category: score >= 0.99 ? undefined : category, details };
    }
    case 'text': {
      const t = norm(String(answer ?? ''));
      if (t.trim().length < 5) return { score: 0, verdict: 'falsch', category: task.category, details: ['Die Antwort ist zu kurz.'] };
      let hit = 0;
      for (const group of task.keywords) if (group.some((k) => t.includes(norm(k).trim()))) hit++;
      const score = hit / task.keywords.length;
      return {
        score,
        verdict: 'zur Selbstbewertung',
        category: score < 1 ? task.category : undefined,
        details: [
          `Automatischer Schlüsselbegriff-Abgleich: ${hit} von ${task.keywords.length} Kernaspekten erkannt. Dieser Abgleich ist nur ein Hinweis – vergleiche deine Antwort selbst mit der Musterlösung.`,
        ],
      };
    }
  }
}
