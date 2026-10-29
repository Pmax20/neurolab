import type { ModelDef, ParamDef, ParamValues, SimResult } from './types';

export const R = 8.314462618; // J/(mol·K)
export const F = 96485.33212; // C/mol

/** RT/F in mV bei Temperatur in °C */
export function rtf(tempC: number): number {
  return ((R * (tempC + 273.15)) / F) * 1000;
}

export interface ValidationIssue {
  key: string;
  message: string;
}

export function defaults(def: ModelDef): ParamValues {
  const p: ParamValues = {};
  for (const d of def.params) p[d.key] = d.default;
  return p;
}

export function validateParam(d: ParamDef, v: unknown): string | null {
  if (d.type === 'select') {
    if (typeof v !== 'string' || !d.options.some((o) => o.value === v)) return `Ungültige Auswahl für „${d.label}“.`;
    return null;
  }
  if (d.type === 'bool') {
    return typeof v === 'boolean' ? null : `„${d.label}“ muss ein Ja/Nein-Wert sein.`;
  }
  if (typeof v !== 'number' || !Number.isFinite(v)) return `„${d.label}“ ist keine gültige Zahl.`;
  if (v < d.min || v > d.max)
    return `„${d.label}“ muss zwischen ${d.min} und ${d.max} ${d.unit} liegen (eingegeben: ${v}).`;
  return null;
}

export function validateParams(def: ModelDef, p: ParamValues): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const d of def.params) {
    const msg = validateParam(d, p[d.key]);
    if (msg) issues.push({ key: d.key, message: msg });
  }
  for (const k of Object.keys(p)) {
    if (!def.params.some((d) => d.key === k)) issues.push({ key: k, message: `Unbekannter Parameter „${k}“.` });
  }
  return issues;
}

/** Ergänzt fehlende Parameter mit Standardwerten (z. B. bei älteren gespeicherten Experimenten). */
export function withDefaults(def: ModelDef, p: Partial<ParamValues>): ParamValues {
  const out = defaults(def);
  for (const d of def.params) if (p[d.key] !== undefined) out[d.key] = p[d.key] as any;
  return out;
}

export function errorResult(msg: string): SimResult {
  return { ok: false, charts: [], scalars: {}, warnings: [], error: msg };
}

/** Kontrollierte Ausführung: Validierung, Fehlerabfang, Prüfung auf NaN/Unendlich. */
export function runModel(def: ModelDef, p: ParamValues): SimResult {
  const issues = validateParams(def, p);
  if (issues.length) return errorResult(issues.map((i) => i.message).join(' '));
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  try {
    const res = def.run(p);
    for (const c of res.charts) {
      for (const s of c.series) {
        if (s.y.some((v) => !Number.isFinite(v))) {
          return errorResult(
            `Die Berechnung wurde abgebrochen, weil in „${s.label}“ ungültige Werte entstanden sind. Bitte Parameter verändern oder den Referenzzustand wiederherstellen.`,
          );
        }
      }
    }
    res.computeMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;
    return res;
  } catch (e: any) {
    return errorResult(`Die Simulation konnte nicht ausgeführt werden: ${e?.message ?? String(e)}`);
  }
}

export class StepLimit {
  private n = 0;
  constructor(private max: number) {}
  tick() {
    if (++this.n > this.max) throw new Error('Maximale Anzahl an Rechenschritten überschritten – Berechnung kontrolliert abgebrochen.');
  }
}

/** Tridiagonal-Löser (Thomas-Algorithmus): a_i x_{i-1} + b_i x_i + c_i x_{i+1} = d_i */
export function solveTridiagonal(a: Float64Array, b: Float64Array, c: Float64Array, d: Float64Array, x: Float64Array) {
  const n = b.length;
  const cp = new Float64Array(n);
  const dp = new Float64Array(n);
  cp[0] = c[0] / b[0];
  dp[0] = d[0] / b[0];
  for (let i = 1; i < n; i++) {
    const m = b[i] - a[i] * cp[i - 1];
    cp[i] = c[i] / m;
    dp[i] = (d[i] - a[i] * dp[i - 1]) / m;
  }
  x[n - 1] = dp[n - 1];
  for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
}

export function range(from: number, to: number, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(from + ((to - from) * i) / (n - 1));
  return out;
}

export function logRange(from: number, to: number, n: number): number[] {
  const a = Math.log10(from);
  const b = Math.log10(to);
  return range(a, b, n).map((v) => 10 ** v);
}

export const num = (p: ParamValues, k: string) => p[k] as number;
export const str = (p: ParamValues, k: string) => p[k] as string;
export const bool = (p: ParamValues, k: string) => p[k] as boolean;

/** Downsampling für Diagramme */
export function every<T>(arr: T[], step: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < arr.length; i += step) out.push(arr[i]);
  return out;
}
