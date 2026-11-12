import { describe, expect, test } from 'vitest';
import { firstSentence } from './LessonPage';
import { LESSONS } from '../content';

describe('Kurzfassung (Das Wichtigste in 1 Minute)', () => {
  test('Abkürzungen beenden keinen Satz', () => {
    expect(firstSentence('Trockene Luft: N₂ ca. 78 %, O₂ ca. 21 %. Dazu kommt Wasserdampf.')).toBe('Trockene Luft: N₂ ca. 78 %, O₂ ca. 21 %.');
    expect(firstSentence('Salze, z. B. NaCl, lösen sich. Zweiter Satz.')).toBe('Salze, z. B. NaCl, lösen sich.');
    expect(firstSentence('Nur ein Satz ohne Punkt')).toBe('Nur ein Satz ohne Punkt');
  });
  test('jede Lektion liefert brauchbare Kernsätze', () => {
    for (const l of LESSONS) for (const m of l.mechanism.slice(0, 6)) {
      const f = firstSentence(m.text);
      expect(f.length, `${l.id}: ${m.title}`).toBeGreaterThan(15);
    }
  });
});
