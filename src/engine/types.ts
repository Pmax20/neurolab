// Gemeinsame Typen der Simulationsengine.
// Die Engine ist vollständig unabhängig von React, Three.js oder dem DOM.

export type ReviewStatus = 'entwurf' | 'zu_pruefen' | 'geprueft' | 'freigegeben' | 'ueberarbeiten';

export interface SourceRef {
  id: string; // Verweis auf content/sources.ts
  locator?: string; // konkrete Fundstelle (Kapitel/Seite)
}

export type ParamDef =
  | {
      key: string;
      label: string;
      unit: string;
      type?: 'number';
      min: number;
      max: number;
      step: number;
      default: number;
      description: string;
      advanced?: boolean;
    }
  | {
      key: string;
      label: string;
      unit: string;
      type: 'select';
      options: { value: string; label: string }[];
      default: string;
      description: string;
      advanced?: boolean;
    }
  | {
      key: string;
      label: string;
      unit: string;
      type: 'bool';
      default: boolean;
      description: string;
      advanced?: boolean;
    };

export type ParamValues = Record<string, number | string | boolean>;

export interface Series {
  key: string;
  label: string;
  y: number[];
  /** optional: Strichart zur Unterscheidung ohne Farbe */
  dash?: string;
  axis?: 'left' | 'right';
}

export interface Chart {
  id: string;
  title: string;
  x: number[];
  xLabel: string;
  xUnit: string;
  yLabel: string;
  yUnit: string;
  series: Series[];
  /** markierte Bereiche (z. B. Phasen) */
  bands?: { from: number; to: number; label: string }[];
  /** horizontale Hilfslinien */
  hlines?: { y: number; label: string }[];
  /** vertikale Markierung (z. B. aktueller Arbeitspunkt) */
  vmarker?: { x: number; label: string };
  logX?: boolean;
  yMin?: number;
  yMax?: number;
  description: string; // Textbeschreibung für Barrierefreiheit
}

export interface Scalar {
  label: string;
  value: number | string;
  unit: string;
  digits?: number;
}

export interface SimResult {
  ok: boolean;
  charts: Chart[];
  scalars: Record<string, Scalar>;
  /** Rohdaten für Animationen (Zeitindex -> Zustand) */
  frames?: { t: number[]; data: Record<string, number[] | number[][]> };
  phases?: { from: number; to: number; id: string; label: string }[];
  events?: { t: number; label: string }[];
  warnings: string[];
  error?: string;
  computeMs?: number;
}

export interface ReferenceScenario {
  name: string;
  params: ParamValues;
  expectation: string;
}

export interface ModelDef {
  id: string;
  version: string;
  title: string;
  module: 'neuro' | 'cell' | 'molecule' | 'physio' | 'physics' | 'histo' | 'term' | 'anatomy';
  purpose: string;
  process: string;
  equations: string[];
  params: ParamDef[];
  initialConditions: string;
  included: string[];
  omitted: string[];
  assumptions: string[];
  limits: string[];
  qualitativeOnly: string[];
  modelType: 'vereinfacht' | 'ausführlich';
  sources: SourceRef[];
  status: ReviewStatus;
  reviewNote: string;
  references: ReferenceScenario[];
  run: (p: ParamValues) => SimResult;
}
