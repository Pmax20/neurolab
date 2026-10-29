import type { ReviewStatus, SourceRef } from '../engine/types';

export type { ReviewStatus, SourceRef };

export type ModuleId = 'neuro' | 'cell' | 'molecule' | 'physio' | 'physics' | 'histo' | 'term' | 'anatomy';
export type Difficulty = 'grundlagen' | 'vertiefung' | 'anwendung';
export type TaskLevel = 'wissen' | 'verstaendnis' | 'anwendung' | 'analyse' | 'verknuepfung';
export type ErrorCategory = 'begriff' | 'reihenfolge' | 'richtung' | 'diagramm' | 'formel' | 'mechanismus' | 'rechnen' | 'einheit' | 'lesen' | 'verwechslung' | 'struktur'
  | 'gewebe' | 'zellform' | 'schichtzahl' | 'merkmal' | 'funktion';

export const ERROR_LABEL: Record<ErrorCategory, string> = {
  begriff: 'Begriffsverwechslung',
  reihenfolge: 'Falsche Reihenfolge',
  richtung: 'Falsche Richtung eines Stofftransports / Ionenflusses',
  diagramm: 'Fehlinterpretation eines Diagramms',
  formel: 'Fehlerhafte Anwendung einer Formel',
  mechanismus: 'Lücke im Mechanismusverständnis',
  rechnen: 'Rechenfehler',
  einheit: 'Fehler bei Einheiten oder Größenordnungen',
  lesen: 'Frage ungenau gelesen (z. B. „nicht“ oder „falsch“ übersehen)',
  verwechslung: 'Verwechslung ähnlicher Strukturen oder Begriffe',
  struktur: 'Struktur nicht erkannt oder falsch lokalisiert',
  gewebe: 'Gewebeart falsch erkannt',
  zellform: 'Zellform falsch bestimmt',
  schichtzahl: 'Schichtzahl falsch bestimmt',
  merkmal: 'Charakteristische Merkmale übersehen',
  funktion: 'Funktion falsch zugeordnet',
};

export const LEVEL_LABEL: Record<TaskLevel, string> = {
  wissen: 'Grundlagenwissen',
  verstaendnis: 'Verständnis',
  anwendung: 'Anwendung',
  analyse: 'Analyse',
  verknuepfung: 'Verknüpfung mehrerer Themen',
};

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  entwurf: 'Entwurf',
  zu_pruefen: 'Fachlich zu prüfen',
  geprueft: 'Geprüft',
  freigegeben: 'Freigegeben',
  ueberarbeiten: 'Überarbeitungsbedürftig',
};

export type Origin = 'redaktionell' | 'quellenzusammenfassung' | 'automatisch' | 'vorlesung';
export const ORIGIN_LABEL: Record<Origin, string> = {
  redaktionell: 'Redaktioneller Lerninhalt (KI-gestützt erstellt)',
  quellenzusammenfassung: 'Aus einer Quelle zusammengefasst',
  automatisch: 'Automatisch erzeugt',
  vorlesung: 'Aus eigener Vorlesungsunterlage',
};

export type AnatomyFigure = 'bone' | 'joint' | 'muscle' | 'muscle-x' | 'body' | 'spinal' | 'heart' | 'vessels' | 'spine' | 'trunk' | 'arm' | 'leg' | 'knee';
export type LabelFigure = 'neuron' | 'synapse' | AnatomyFigure;

export interface Structure {
  id: string;
  sciName: string;
  deName: string;
  synonyms: string[];
  short: string;
  long: string;
  function: string;
  location: string;
  parent?: string;
  connections: string[]; // andere Struktur-IDs
  lessons: string[]; // verknüpfte Mechanismen/Lektionen
  figure: 'neuron' | 'synapse' | 'cell' | 'membrane' | 'sarcomere' | 'tissue' | AnatomyFigure;
  sources: SourceRef[];
  status: ReviewStatus;
}

export interface MechanismStep {
  title: string;
  text: string;
}

export interface Lesson {
  id: string;
  module: ModuleId;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  prerequisites: string[];
  objectives: string[]; // prüfbar formuliert
  overview: string; // Ebene 1
  mechanism: MechanismStep[]; // Ebene 2
  depth: { text: string[]; equations?: string[]; pitfalls?: string[] }; // Ebene 3
  terms: { term: string; def: string; synonyms?: string[] }[];
  structures: string[];
  models: string[]; // Simulations-IDs
  links: string[]; // verwandte Lektionen
  sources: SourceRef[];
  status: ReviewStatus;
  origin: Origin;
  view?: string; // Name der interaktiven Ansicht
}

export interface LearningModule {
  id: ModuleId;
  title: string;
  area: string;
  description: string;
  /** Fachsemester, in denen das Fach laut Studienplan unterrichtet wird */
  semesters: number[];
  lessons: string[];
}

interface TaskBase {
  id: string;
  prompt: string;
  level: TaskLevel;
  lessons: string[]; // zugehörige Lektionen (für Lernziele & Verweise)
  objective: string; // geprüftes Lernziel (Text)
  explanation: string;
  category: ErrorCategory; // typische Fehlerkategorie bei falscher Antwort
  sources: SourceRef[];
  status: ReviewStatus;
  origin?: Origin;
}

export interface ChoiceOption {
  id: string;
  text: string;
  why?: string; // warum diese (falsche) Option nicht passt
  category?: ErrorCategory;
}

export type Task =
  | (TaskBase & { type: 'single' | 'error'; options: ChoiceOption[]; correct: string })
  | (TaskBase & { type: 'multi'; options: ChoiceOption[]; correct: string[] })
  | (TaskBase & { type: 'match'; pairs: { left: string; right: string }[]; distractors?: string[] })
  | (TaskBase & { type: 'order' | 'cause'; items: string[] }) // korrekte Reihenfolge
  | (TaskBase & { type: 'label'; figure: LabelFigure; markers: { n: number; structure: string }[] })
  | (TaskBase & { type: 'diagram'; model: string; params: Record<string, unknown>; chart: string; options: ChoiceOption[]; correct: string })
  | (TaskBase & { type: 'predict'; model: string; base: Record<string, unknown>; change: Record<string, unknown>; changeText: string; options: ChoiceOption[]; correct: string; observe: string })
  | (TaskBase & { type: 'text'; keywords: string[][]; modelAnswer: string })
  | (TaskBase & { type: 'formula'; givens: string; answer: number; tolerance: number; unit: string; solution: string })
  /** Rechentrainer: Zahlen werden aus einer Vorlage erzeugt (bei jedem Aufruf neue Ausgangsdaten). */
  | (TaskBase & { type: 'calc'; template: string; seed?: number })
  /** Reaktionsgleichung ausgleichen: Koeffizienten eintragen; geprüft wird die Atombilanz. */
  | (TaskBase & { type: 'balance'; reactants: string[]; products: string[]; coefficients: number[] })
  /** Histologie-Prüfungssimulator: Präparat erkennen, Merkmale markieren, begründen. */
  | (TaskBase & { type: 'histo'; scene: string; tissueOptions: string[]; form?: { options: string[]; correct: string }; layers?: { options: string[]; correct: string }; features: { text: string; ok: boolean; why?: string }[]; fn: { options: string[]; correct: string }; keywords: string[][]; modelAnswer: string });

export interface GuidedExperiment {
  id: string;
  model: string;
  title: string;
  question: string;
  start: Record<string, unknown>;
  hypothesisOptions: { id: string; text: string }[];
  correctHypothesis: string;
  suggestedChange: Record<string, unknown>;
  changeText: string;
  observe: string[]; // auf welche Größen achten
  explanation: string;
  transferTask: string; // Task-ID
  lessons: string[];
}
