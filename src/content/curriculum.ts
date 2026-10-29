import type { SourceRef } from './types';
import { ANATOMY2_PLAN } from './anatomy2';

// Zuordnung der Lektionen zum veröffentlichten Leipziger Lehrplan (WS 2026/27).
// Grundsatz (Lastenheft 11.3): Prüfungsrelevanz wird nur behauptet, wenn eine Leipziger Quelle das Thema nennt.
//   belegt     – Thema steht im veröffentlichten Plan (mit Veranstaltung und Datum)
//   fach       – das Fach gehört zum 1. Semester, die Themen sind aber nicht öffentlich einzeln aufgeführt
//   vertiefung – laut Plan erst ab dem 3. Semester (Physiologie, Biochemie)

export type RelevanceKind = 'belegt' | 'fach' | 'vertiefung';

export interface CurriculumEntry {
  lesson: string;
  course: string; // Veranstaltung
  block: string; // Thema laut Plan
  dates: string[]; // ISO-Daten laut Stundenplan
  semester: number;
  source: SourceRef;
}

const ANA = (locator: string): SourceRef => ({ id: 'leipzig-anatomie', locator });
const PHY = (locator: string): SourceRef => ({ id: 'leipzig-physik', locator });

function weekdays(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = new Date(`${from}T12:00:00Z`); d <= new Date(`${to}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) if (d.getUTCDay() % 6) out.push(d.toISOString().slice(0, 10));
  return out;
}
const dm = (d: string) => `${d.slice(8)}.${d.slice(5, 7)}.`;
const fmtRange = (a: string, b: string) => `${dm(a)}–${dm(b)}${b.slice(0, 4)}`;

export const CURRICULUM: CurriculumEntry[] = [
  // Anatomie – Vorlesung Funktionelle Anatomie I (Themenplan Stundenplan 1. Semester WS 2026/27)
  { lesson: 'allgemeine-anatomie', course: 'Vorlesung Funktionelle Anatomie I', block: 'Einführung', dates: ['2026-10-19', '2026-10-20'], semester: 1, source: ANA('Themenplan, 19./20.10.2026') },
  { lesson: 'embryologie', course: 'Vorlesung Funktionelle Anatomie I', block: 'Allgemeine Embryologie', dates: ['2026-10-22', '2026-10-23'], semester: 1, source: ANA('Themenplan, 22./23.10.2026') },
  { lesson: 'knochen', course: 'Vorlesung Funktionelle Anatomie I', block: 'Knochengewebe, Ossifikation/Osteogenese, Knochen- und Gelenklehre, ausgewählte Skelettelemente', dates: ['2026-11-05', '2026-11-06', '2026-11-09', '2026-11-10', '2026-11-12', '2026-11-13', '2026-11-16', '2026-11-17'], semester: 1, source: ANA('Themenplan, 05.–17.11.2026') },
  { lesson: 'gelenke', course: 'Vorlesung Funktionelle Anatomie I', block: 'Knochen- und Gelenklehre', dates: ['2026-11-09', '2026-11-10'], semester: 1, source: ANA('Themenplan, 09./10.11.2026') },
  { lesson: 'muskellehre', course: 'Vorlesung Funktionelle Anatomie I', block: 'Muskellehre', dates: ['2026-11-23'], semester: 1, source: ANA('Themenplan, 23.11.2026') },
  // Histologie – Kurs mikroskopische Anatomie Teil A (Kurstage laut Stundenplan)
  { lesson: 'epithel', course: 'Kurs Histologie und Vorlesung', block: 'Epithelgewebe', dates: ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-11-02', '2026-11-05', '2026-11-06'], semester: 1, source: ANA('Themenplan, 26.10.–06.11.2026') },
  { lesson: 'bindegewebe', course: 'Kurs Histologie und Vorlesung', block: 'Binde-, Fett-, Knorpel- und Knochengewebe', dates: ['2026-10-29', '2026-10-30', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-09', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-19', '2026-11-20', '2026-11-26', '2026-11-27'], semester: 1, source: ANA('Themenplan, 29.10.–27.11.2026') },
  { lesson: 'muskel-nervengewebe', course: 'Kurs Histologie und Vorlesung', block: 'Skelett-, Herz- und glatte Muskulatur; Nervensystem/-gewebe', dates: ['2026-11-19', '2026-11-20', '2026-11-24', '2026-11-25', '2026-11-26', '2026-12-03', '2026-12-04', '2026-12-09', '2026-12-10', '2026-12-11'], semester: 1, source: ANA('Themenplan, 19.11.–11.12.2026') },
  // Anatomie II/III und Histologie (Blut/Gefäße, Haut/Drüsen) – alle Wochentage im Zeitraum laut Themenplan
  ...ANATOMY2_PLAN.map((x) => ({ lesson: x.lesson, course: x.course, block: x.block, dates: weekdays(x.from, x.to), semester: 1, source: ANA(`Themenplan, ${fmtRange(x.from, x.to)}`) })),
  // Physik – Praktikum Physik II, Einführungsveranstaltungen im WS und Versuche im SS
  { lesson: 'elektrizitaet', course: 'Praktikum Physik II, Einführungsveranstaltung', block: 'Elektrische Stromkreise, Exponentialfunktionen', dates: [], semester: 1, source: PHY('Praktikumsordnung 2025: Inhalte der Einführungsveranstaltungen') },
  { lesson: 'radioaktivitaet', course: 'Praktikum Physik II, Versuche im Sommersemester', block: 'Radioaktivität, Röntgen', dates: [], semester: 2, source: PHY('Praktikumsordnung 2025: Arbeitsschutz zu den Versuchen Radioaktivität und Röntgen') },
];

export const curriculumFor = (lesson: string) => CURRICULUM.find((c) => c.lesson === lesson);

const fmt = (d: string) => `${Number(d.slice(8))}.${Number(d.slice(5, 7))}.`;

export function relevanceOf(lesson: string, moduleSemesters: number[]): { kind: RelevanceKind; label: string; detail: string; entry?: CurriculumEntry } {
  const e = curriculumFor(lesson);
  if (e) {
    const when = e.dates.length ? (e.dates.length === 1 ? ` am ${fmt(e.dates[0])}` : ` ${fmt(e.dates[0])}–${fmt(e.dates[e.dates.length - 1])}`) : e.semester > 1 ? ` (${e.semester}. Semester)` : '';
    return { kind: 'belegt', label: `Leipzig: ${e.block.split(',')[0]}${when}`, detail: `Im veröffentlichten Leipziger Plan: ${e.course} – „${e.block}“${when}.`, entry: e };
  }
  if (Math.min(...moduleSemesters) >= 3) return { kind: 'vertiefung', label: 'Vertiefung · ab 3. Semester', detail: 'Laut Leipziger Studienplan erst ab dem 3. Semester (Physiologie bzw. Biochemie). Für das 1. Semester kein Pflichtstoff.' };
  return { kind: 'fach', label: 'Fach im 1. Semester · Thema nicht einzeln belegt', detail: 'Das Fach gehört laut Semesterführer zum 1. Semester. Die einzelnen Themen sind nicht öffentlich aufgeführt – ob dieses Thema geprüft wird, zeigen erst Kims Vorlesungsunterlagen. Inhalt nach Lehrbuchstandard.' };
}

/** Lektionen, die laut Stundenplan in einem Zeitraum (z. B. dieser und nächste Woche) in der Vorlesung drankommen. */
export function lessonsInWindow(fromIso: string, toIso: string): { entry: CurriculumEntry; first: string }[] {
  const out: { entry: CurriculumEntry; first: string }[] = [];
  for (const e of CURRICULUM) {
    const inside = e.dates.filter((d) => d >= fromIso && d <= toIso);
    if (inside.length) out.push({ entry: e, first: inside[0] });
  }
  return out.sort((a, b) => a.first.localeCompare(b.first));
}
