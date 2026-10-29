import { describe, expect, test } from 'vitest';
import { emptyState, sanitize, recordAttempt, updateSrs, dueTasks, objectiveMastery, errorPatterns, DAY } from './state';
import { grade, parseNumber } from './grading';
import { TASKS, taskById } from '../content';
import { calcInstance } from '../content/calc';

describe('Persistenz', () => {
  test('Serialisierung ist verlustfrei', () => {
    let s = emptyState();
    s = recordAttempt(s, { taskId: 't-ap-order', t: 1000, score: 1, mode: 'ueben' });
    s.experiments.push({ id: 'e1', model: 'aktionspotenzial', modelVersion: '1.0.0', name: 'A', params: { gNa: 60 }, createdAt: 1 });
    const back = sanitize(JSON.parse(JSON.stringify(s)));
    expect(back.dropped).toEqual([]);
    expect(back.state).toEqual(s);
  });
  test('beschädigte Experimente werden verworfen, Rest bleibt', () => {
    const raw = { ...emptyState(), experiments: [{ id: 'ok', model: 'x', params: {}, name: 'gut' }, { name: 'kaputt' }, 42] };
    const r = sanitize(raw);
    expect(r.state.experiments.length).toBe(1);
    expect(r.dropped.length).toBe(2);
  });
  test('kein Objekt → leerer Zustand', () => {
    expect(sanitize('Unsinn').state).toEqual(emptyState());
  });
});

describe('Wiederholungslogik', () => {
  test('richtig → nächstes Fach, späteres Fälligkeitsdatum', () => {
    const a = updateSrs(undefined, 1, 0);
    expect(a.box).toBe(2);
    const b = updateSrs(a, 1, 0);
    expect(b.box).toBe(3);
    expect(b.due).toBe(3 * DAY);
  });
  test('falsch → zurück in Fach 1, bald fällig', () => {
    const r = updateSrs({ box: 4, due: 0 }, 0, 0);
    expect(r.box).toBe(1);
    expect(r.due).toBeLessThan(DAY);
  });
  test('fällige Aufgaben werden nach Fach sortiert', () => {
    const s = { ...emptyState(), srs: { a: { box: 3, due: 0 }, b: { box: 1, due: 5 }, c: { box: 2, due: 1e15 } } };
    expect(dueTasks(s, 100)).toEqual(['b', 'a']);
  });
  test('Kompetenzstand', () => {
    let s = emptyState();
    expect(objectiveMastery(s, ['x'])).toBe('offen');
    s = recordAttempt(s, { taskId: 'x', t: 0, score: 0, mode: 'ueben' });
    expect(objectiveMastery(s, ['x'])).toBe('unsicher');
    s = recordAttempt(s, { taskId: 'x', t: 1, score: 1, mode: 'ueben' });
    expect(objectiveMastery(s, ['x'])).toBe('begonnen');
    s = recordAttempt(s, { taskId: 'x', t: 2, score: 1, mode: 'ueben' });
    s = recordAttempt(s, { taskId: 'x', t: 3, score: 1, mode: 'ueben' });
    expect(objectiveMastery(s, ['x'])).toBe('gefestigt');
  });
  test('Fehlermuster ab zwei gleichartigen Fehlern', () => {
    let s = emptyState();
    s = recordAttempt(s, { taskId: 't-ion-k-direction', t: 0, score: 0, category: 'richtung', mode: 'ueben' });
    expect(errorPatterns(s, (id) => taskById(id)!.lessons).length).toBe(0);
    s = recordAttempt(s, { taskId: 't-ion-na-rest', t: 1, score: 0, category: 'richtung', mode: 'ueben' });
    const p = errorPatterns(s, (id) => taskById(id)!.lessons);
    expect(p[0]).toMatchObject({ lesson: 'ionen-gradienten', category: 'richtung', count: 2 });
  });
});

describe('Bewertung', () => {
  test('Zahlen deutsch/englisch', () => {
    expect(parseNumber('−61,5')).toBe(-61.5);
    expect(parseNumber('7.5')).toBe(7.5);
    expect(parseNumber('abc')).toBeNull();
  });
  test('Formel: Vorzeichenfehler wird erkannt', () => {
    const r = grade(taskById('t-ion-cl')!, '61,5');
    expect(r.score).toBe(0);
    expect(r.details.join()).toMatch(/Vorzeichen/);
  });
  test('Formel: Zehnerpotenzfehler wird erkannt', () => {
    const r = grade(taskById('t-circ-formula')!, '6000');
    expect(r.details.join()).toMatch(/Zehnerpotenz/);
  });
  test('Einfachauswahl liefert Begründung und Kategorie der Fehlantwort', () => {
    const r = grade(taskById('t-ion-k-direction')!, 'c');
    expect(r.score).toBe(0);
    expect(r.category).toBe('richtung');
    expect(r.details[0].length).toBeGreaterThan(10);
  });
  test('Mehrfachauswahl mit Teilpunkten', () => {
    const t = taskById('t-membran-pass')!;
    expect(grade(t, ['o2', 'co2']).score).toBe(1);
    expect(grade(t, ['o2']).score).toBe(0.5);
    expect(grade(t, ['o2', 'na']).score).toBe(0);
  });
  test('Reihenfolge: korrekt und vertauscht', () => {
    const t = taskById('t-ap-order')! as any;
    expect(grade(t, t.items).score).toBe(1);
    const sw = [...t.items];
    [sw[0], sw[1]] = [sw[1], sw[0]];
    const r = grade(t, sw);
    expect(r.score).toBeGreaterThan(0);
    expect(r.score).toBeLessThan(1);
  });
  test('Zuordnung', () => {
    const t = taskById('t-bond')! as any;
    const ok = Object.fromEntries(t.pairs.map((p: any) => [p.left, p.right]));
    expect(grade(t, ok).score).toBe(1);
  });
  test('Freitext: Schlüsselbegriffe', () => {
    const t = taskById('t-rmp-text')!;
    expect(grade(t, 'Weil die Membran auch etwas für Natrium durchlässig ist').score).toBe(1);
    expect(grade(t, 'Keine Ahnung, wirklich').score).toBe(0);
  });
  test('jede Aufgabe ist mit ihrer Musterlösung bewertbar', () => {
    for (const t of TASKS) {
      let ans: any;
      switch (t.type) {
        case 'single': case 'error': case 'diagram': case 'predict': ans = t.correct; break;
        case 'multi': ans = t.correct; break;
        case 'match': ans = Object.fromEntries(t.pairs.map((p) => [p.left, p.right])); break;
        case 'order': case 'cause': ans = t.items; break;
        case 'label': ans = Object.fromEntries(t.markers.map((m) => [m.n, m.structure])); break;
        case 'formula': ans = String(t.answer); break;
        case 'text': ans = t.modelAnswer; break;
        case 'balance': ans = t.coefficients; break;
        case 'histo': ans = { tissue: t.scene, form: t.form?.correct, layers: t.layers?.correct, features: t.features.filter((f) => f.ok).map((f) => f.text), fn: t.fn.correct }; break;
        case 'calc': { const inst = calcInstance(t.template, 7); ans = { seed: 7, sought: inst.sought, formula: inst.formula, value: String(inst.result), unit: inst.unit }; break; }
      }
      expect(grade(t, ans).score, t.id).toBe(1);
    }
  });
});

import { rateCard, dueCards } from './state';
describe('Karteikarten', () => {
  test('Bewertung verschiebt Karten im Leitner-System; neue Karten gelten als fällig', () => {
    let s = emptyState();
    expect(dueCards(s, ['a', 'b'], 0)).toEqual(['a', 'b']);
    s = rateCard(s, 'a', 1, 0);
    expect(s.cards.a.box).toBe(2);
    expect(dueCards(s, ['a', 'b'], 1000)).toEqual(['b']);
    s = rateCard(s, 'b', 0, 0);
    expect(s.cards.b.box).toBe(1);
  });
  test('Karten-Lernstand übersteht Speichern und Laden, Unsinn wird verworfen', () => {
    const s = rateCard(emptyState(), 'x', 1, 5);
    const back = sanitize(JSON.parse(JSON.stringify({ ...s, cards: { ...s.cards, kaputt: 'nein' } }))).state;
    expect(back.cards.x).toEqual(s.cards.x);
    expect(back.cards.kaputt).toBeUndefined();
  });
});

describe('Wiederholung berücksichtigt Sicherheit, Schwierigkeit und wiederholte Fehler', () => {
  test('richtig, aber unsicher: keine Beförderung', () => {
    expect(updateSrs({ box: 3, due: 0 }, 1, 0, { confidence: 1 }).box).toBe(3);
    expect(updateSrs({ box: 3, due: 0 }, 1, 0, { confidence: 3 }).box).toBe(4);
  });
  test('sicher und falsch → besonders bald wieder; Fehler werden gezählt', () => {
    const a = updateSrs({ box: 4, due: 0 }, 0, 0, { confidence: 3 });
    const b = updateSrs({ box: 4, due: 0 }, 0, 0, { confidence: 1 });
    expect(a.box).toBe(1);
    expect(a.due).toBeLessThan(b.due);
    expect(a.lapses).toBe(1);
  });
  test('schwere und wiederholt falsche Aufgaben bekommen kürzere Intervalle', () => {
    const easy = updateSrs({ box: 3, due: 0 }, 1, 0, {});
    const hard = updateSrs({ box: 3, due: 0 }, 1, 0, { difficulty: 3 });
    const lapsed = updateSrs({ box: 3, due: 0, lapses: 3 }, 1, 0, {});
    expect(hard.due).toBeLessThan(easy.due);
    expect(lapsed.due).toBeLessThan(easy.due);
  });
  test('Testergebnisse und Fehlerzähler überstehen Speichern und Laden', () => {
    const s = { ...emptyState(), tests: [{ t: 1, modules: ['physics'], n: 10, score: 0.7, timed: true }], srs: { x: { box: 1, due: 2, lapses: 2 } } };
    const back = sanitize(JSON.parse(JSON.stringify(s))).state;
    expect(back.tests).toEqual(s.tests);
    expect(back.srs.x.lapses).toBe(2);
  });
});
