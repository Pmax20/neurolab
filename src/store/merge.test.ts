import { describe, expect, test } from 'vitest';
import { emptyState, rateCard, recordAttempt, sanitize, type AppState } from './state';
import { mergeStates } from './merge';

const att = (s: AppState, taskId: string, t: number, score: number) => recordAttempt(s, { taskId, t, score, mode: 'ueben' });

describe('Synchronisierung: Zusammenführen zweier Geräte', () => {
  test('Antworten beider Geräte bleiben erhalten, doppelte werden nicht verdoppelt', () => {
    let a = att(emptyState(), 'x', 1000, 1); a = att(a, 'y', 2000, 0);
    let b = att(emptyState(), 'x', 1000, 1); b = att(b, 'z', 3000, 1);
    const m = mergeStates(a, b, true);
    expect(m.attempts.map((x) => x.taskId)).toEqual(['x', 'y', 'z']);
    expect(Object.keys(m.srs).sort()).toEqual(['x', 'y', 'z']);
  });
  test('Wiederholungsplan: es gilt das Gerät mit der jüngsten Antwort zu dieser Aufgabe', () => {
    const a = att(emptyState(), 'x', 1000, 1);            // Laptop: richtig
    const b = att(att(emptyState(), 'x', 1000, 1), 'x', 5000, 0); // Handy später: falsch
    const m1 = mergeStates(a, b, true), m2 = mergeStates(b, a, false);
    expect(m1.srs.x).toEqual(b.srs.x);
    expect(m2.srs.x).toEqual(b.srs.x);
  });
  test('Karteikarten: die zuletzt bewertete Fassung gewinnt', () => {
    const a = rateCard(emptyState(), 'k1', 1, 1000);
    const b = rateCard(rateCard(emptyState(), 'k1', 1, 1000), 'k1', 0, 9000);
    expect(mergeStates(a, b, true).cards.k1.seen).toBe(9000);
    expect(mergeStates(b, a, true).cards.k1.seen).toBe(9000);
  });
  test('Lektionen und Prüfungsrunden werden vereinigt', () => {
    const a = { ...emptyState(), lessons: { herz: { levels: [1, 2], completed: false, last: 10 } }, tests: [{ t: 1, modules: ['anatomy'], n: 10, score: 0.8, timed: false }] };
    const b = { ...emptyState(), lessons: { herz: { levels: [3], completed: true, last: 20 }, knochen: { levels: [1], completed: false, last: 5 } }, tests: [{ t: 2, modules: ['histo'], n: 10, score: 0.6, timed: true }] };
    const m = mergeStates(a, b, false);
    expect(m.lessons.herz).toEqual({ levels: [1, 2, 3], completed: true, last: 20 });
    expect(m.lessons.knochen).toBeTruthy();
    expect(m.tests.map((x) => x.t)).toEqual([1, 2]);
  });
  test('Einstellungen kommen vom zuletzt geänderten Gerät', () => {
    const a = { ...emptyState(), settings: { ...emptyState().settings, exams: [{ id: 'e1', module: 'anatomy', title: 'Testat', date: '2027-01-30' }] } };
    const b = emptyState();
    expect(mergeStates(a, b, true).settings.exams).toHaveLength(1);
    expect(mergeStates(b, a, false).settings.exams).toHaveLength(1);
  });
  test('Zusammenführen ist stabil: ein zweiter Durchgang ändert nichts mehr', () => {
    let a = att(emptyState(), 'x', 1000, 1); a = rateCard(a, 'k', 1, 1500);
    let b = att(emptyState(), 'y', 2000, 1); b = rateCard(b, 'k', 0, 2500);
    const m = mergeStates(a, b, true);
    expect(JSON.stringify(mergeStates(m, b, true))).toBe(JSON.stringify(m));
    expect(JSON.stringify(mergeStates(m, m, true))).toBe(JSON.stringify(m));
  });
  test('der Zeitpunkt „seen“ übersteht Speichern und Laden', () => {
    const a = rateCard(emptyState(), 'k', 1, 4242);
    expect(sanitize(JSON.parse(JSON.stringify(a))).state.cards.k.seen).toBe(4242);
  });
});
