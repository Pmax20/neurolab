import { describe, expect, test } from 'vitest';
import { VOCAB, VOCAB_DECKS } from './vocabBook';
import { FLASHCARDS } from './cards';
import { lessonById } from './index';

describe('Vokabeln aus dem Terminologie-Buch', () => {
  test('alle Stapel gefüllt, Einträge vollständig und eindeutig', () => {
    for (const d of VOCAB_DECKS) {
      expect(lessonById(d.lesson), d.id).toBeTruthy();
      expect(VOCAB.filter((v) => v.deck === d.id).length, d.id).toBeGreaterThan(9);
    }
    const keys = VOCAB.map((v) => v.deck + v.lex);
    expect(new Set(keys).size).toBe(keys.length);
    for (const v of VOCAB) { expect(v.latin).toMatch(/^[a-z]+$/); expect(v.de.length).toBeGreaterThan(1); }
    expect(VOCAB.length).toBeGreaterThan(300);
  });
  test('jede Vokabel ist eine Karteikarte', () => {
    expect(FLASHCARDS.filter((c) => c.kind === 'Vokabel').length).toBe(VOCAB.length);
  });
});
