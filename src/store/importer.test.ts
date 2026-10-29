import { describe, expect, test } from 'vitest';
import { analyzePages, textToPages } from './importer';

const DOC = `# 1 Membranphysiologie
Das Ruhemembranpotenzial einer Nervenzelle liegt bei etwa -70 mV und entsteht vor allem durch die hohe Kaliumleitfähigkeit der Membran in Ruhe.
Die Na⁺/K⁺-ATPase hält die Konzentrationsgradienten aufrecht und transportiert drei Natriumionen nach außen.
# 2 Aktionspotenzial
Während des Aktionspotenzials öffnen spannungsabhängige Natriumkanäle, danach folgt die Refraktärperiode.
Die Kalziumsensorproteine in der präsynaptischen Endigung steuern die Exozytose. Kalziumsensorproteine sind vielfältig.
In einer alten Folie steht: Das Ruhemembranpotenzial beträgt -20 mV.\f# 3 Muskel
Der Querbrückenzyklus benötigt ATP. Die Erregungs-Kontraktions-Kopplung beginnt am Sarkolemm.`;

describe('Vorlesungsimport', () => {
  const r = analyzePages('Test', textToPages(DOC));
  test('Abschnitte mit Seitenangabe', () => {
    expect(r.sections.map((s) => s.title)).toContain('1 Membranphysiologie');
    expect(r.sections.find((s) => s.title === '3 Muskel')?.page).toBe(2);
  });
  test('Themen werden bestehenden Lektionen zugeordnet', () => {
    const lessons = new Set(r.matches.map((m) => m.lesson));
    expect(lessons.has('ruhemembranpotenzial')).toBe(true);
    expect(lessons.has('aktionspotenzial')).toBe(true);
    expect(lessons.has('ekk')).toBe(true);
  });
  test('unbekannte Begriffe werden als mögliche Lücke markiert', () => {
    expect(r.unknownTerms.map((u) => u.term)).toContain('Kalziumsensorproteine');
  });
  test('Widerspruch zum Modellwert wird angezeigt statt entschieden', () => {
    expect(r.conflicts.length).toBe(1);
    expect(r.conflicts[0].text).toMatch(/-20 mV/);
  });
  test('Vorschläge sind als „zu prüfen“ markiert und belegt', () => {
    expect(r.suggestions.length).toBeGreaterThan(0);
    for (const s of r.suggestions) {
      expect(s.status).toBe('zu_pruefen');
      expect(s.page).toBeGreaterThan(0);
    }
  });
});
