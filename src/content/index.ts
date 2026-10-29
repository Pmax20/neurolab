import type { LearningModule, Lesson, Structure, Task } from './types';
import { NEURO_LESSONS, NEURO_STRUCTURES, MUSCLE_STRUCTURES } from './neuro';
import { CELL_LESSONS, CELL_STRUCTURES } from './cell';
import { MOLPHYS_LESSONS, MOLECULES } from './molphys';
import { TASKS as TASKS_1, GUIDED_EXPERIMENTS as GUIDED_1 } from './tasks';
import { TASKS_2 } from './tasks2';
import { TASKS_3, GUIDED_3 } from './tasks3';
import { CHEM_LESSONS, PHYS_LESSONS } from './semester1';
import { ANATOMY_LESSONS, ANATOMY_STRUCTURES } from './anatomy1';
import { ANATOMY2_LESSONS, ANATOMY2_STRUCTURES, TISSUE2_STRUCTURES } from './anatomy2';
import { TASKS_6 } from './tasks6';
import { TASKS_4 } from './tasks4';
import { TASKS_5 } from './tasks5';
import { PHYS2_LESSONS, CHEM2_LESSONS, HISTO2_LESSONS } from './semester1b';
import { calcTasks } from './calc';
import { BIO_LESSONS, HISTO_LESSONS, TERM_LESSONS, TISSUE_STRUCTURES, TERM_CARDS } from './bio1';

const GUIDED_EXPERIMENTS = [...GUIDED_3, ...GUIDED_1];

// Die Zellmembran-Lektion gehört im Studienplan zur Biologie (1. Semester).
const RELOCATE: Record<string, Lesson['module']> = { membran: 'cell' };
export const LESSONS: Lesson[] = [...ANATOMY_LESSONS, ...ANATOMY2_LESSONS, ...NEURO_LESSONS, ...CELL_LESSONS, ...MOLPHYS_LESSONS, ...CHEM_LESSONS, ...PHYS_LESSONS, ...BIO_LESSONS, ...HISTO_LESSONS, ...TERM_LESSONS, ...PHYS2_LESSONS, ...CHEM2_LESSONS, ...HISTO2_LESSONS]
  .map((l) => (RELOCATE[l.id] ? { ...l, module: RELOCATE[l.id] } : l));
const TASKS: Task[] = [...TASKS_1, ...TASKS_2, ...TASKS_3, ...TASKS_4, ...TASKS_5, ...TASKS_6, ...calcTasks(LESSONS)];
export const STRUCTURES: Structure[] = [...NEURO_STRUCTURES, ...MUSCLE_STRUCTURES, ...CELL_STRUCTURES, ...TISSUE_STRUCTURES, ...ANATOMY_STRUCTURES, ...ANATOMY2_STRUCTURES, ...TISSUE2_STRUCTURES];
export { TASKS, GUIDED_EXPERIMENTS, MOLECULES, TERM_CARDS };

/**
 * Bereiche in der Reihenfolge des vorklinischen Studienplans (Universität Leipzig, Semesterführer Vorklinik):
 * 1. Semester Anatomie (makroskopisch und Histologie), Chemie, Biologie, Physik/Biophysik und Terminologie;
 * Physiologie und Biochemie ab dem 3. Semester.
 */
export const MODULES: LearningModule[] = [
  { id: 'anatomy', title: 'Anatomie', area: 'Funktionelle Anatomie I · Seminar Anatomie', semesters: [1, 2], description: 'Einführung, Embryologie, Knochen, Gelenke und Muskeln, dann Nervensystem, Herz und Kreislauf, Rumpfwand und Extremitäten – in der Reihenfolge des Leipziger Themenplans.',
    lessons: ['allgemeine-anatomie', 'embryologie', 'knochen', 'gelenke', 'muskellehre', 'nervensystem', 'herz', 'gefaesssystem', 'rumpfwand', 'obere-extremitaet', 'untere-extremitaet'] },
  { id: 'molecule', title: 'Chemie', area: 'Chemie für Mediziner', semesters: [1, 2], description: 'Allgemeine und anorganische Chemie im 1. Semester, organische und Naturstoffchemie im 2. Semester.',
    lessons: ['atommodell', 'periodensystem', 'bindungen', 'stoechiometrie', 'konzentrationen', 'gleichgewicht', 'saeure-base', 'redox', 'komplexe', 'organik', 'molekuele', 'naturstoffe'] },
  { id: 'cell', title: 'Biologie', area: 'Biologie für Mediziner', semesters: [1], description: 'Zelle, Membran und Transport, Zellteilung, Vererbung, Genexpression, Mikroorganismen.',
    lessons: ['zellaufbau', 'membran', 'stofftransport', 'osmose', 'zellzyklus', 'genetik', 'proteinbiosynthese', 'mikroorganismen', 'energiegewinnung', 'enzyme'] },
  { id: 'physics', title: 'Physik', area: 'Physik und Biophysik', semesters: [1, 2], description: 'Einheiten, Bewegung, Kräfte, Energie, Druck, Strömung, Diffusion, Elektrizität, Optik, Ultraschall und Radioaktivität – immer mit medizinischem Bezug.',
    lessons: ['groessen-bewegung', 'mechanik', 'energie-leistung', 'druck-dichte', 'stroemung', 'diffusion', 'elektrizitaet', 'optik', 'ultraschall', 'radioaktivitaet'] },
  { id: 'histo', title: 'Histologie', area: 'Mikroskopische Anatomie (Teil A)', semesters: [1], description: 'Mikroskopie und Präparate, die Grundgewebe (Epithel, Binde- und Stützgewebe, Muskel- und Nervengewebe), Blut und Gefäßwand, Haut und Drüsen.',
    lessons: ['mikroskopie', 'epithel', 'bindegewebe', 'muskel-nervengewebe', 'blut-gefaesse', 'haut-druesen'] },
  { id: 'term', title: 'Terminologie', area: 'Medizinische Terminologie', semesters: [1], description: 'Lagebezeichnungen, Wortbausteine und Grammatik der Fachsprache.',
    lessons: ['lagebezeichnungen', 'wortbildung'] },
  { id: 'neuro', title: 'Nerv und Muskel', area: 'Physiologie (ab 3. Semester)', semesters: [3, 4], description: 'Nervenzellen, Membranpotenzial, Aktionspotenzial, Synapsen und neuromuskuläre Übertragung – bis zum Querbrückenzyklus.',
    lessons: NEURO_LESSONS.filter((l) => !RELOCATE[l.id]).map((l) => l.id) },
  { id: 'physio', title: 'Organsysteme', area: 'Physiologie (ab 3. Semester)', semesters: [3, 4], description: 'Muskelphysiologie, Kreislauf und Atmung als dokumentierte, vereinfachte Modelle.',
    lessons: MOLPHYS_LESSONS.filter((l) => l.module === 'physio').map((l) => l.id) },
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const structureById = (id: string) => STRUCTURES.find((s) => s.id === id);
export const taskById = (id: string) => TASKS.find((t) => t.id === id);
export const moduleById = (id: string) => MODULES.find((m) => m.id === id);
export const tasksForLesson = (id: string): Task[] => TASKS.filter((t) => t.lessons.includes(id));

export interface GlossaryEntry { term: string; def: string; synonyms: string[]; lesson: string }
export const GLOSSARY: GlossaryEntry[] = (() => {
  const out: GlossaryEntry[] = [];
  for (const l of LESSONS) for (const t of l.terms) out.push({ term: t.term, def: t.def, synonyms: t.synonyms ?? [], lesson: l.id });
  for (const s of STRUCTURES) out.push({ term: s.deName, def: s.short, synonyms: [s.sciName, ...s.synonyms], lesson: s.lessons[0] });
  return out;
})();
