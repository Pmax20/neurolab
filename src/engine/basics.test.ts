import { describe, expect, test } from 'vitest';
import { modelById } from './registry';
import { defaults, runModel } from './core';
import { concentration, equilibrium, nernstRedox } from './chem2';
import { poiseuille, thinLens, effectiveHalfLife, decay, diffusionTime, elbow } from './physics';

const run = (id: string, over: Record<string, unknown> = {}) => {
  const m = modelById(id)!;
  return runModel(m, { ...defaults(m), ...(over as any) });
};
const val = (r: any, k: string) => r.scalars[k].value as number;

describe('Chemie 1. Semester', () => {
  test('0,9 % NaCl = 154 mmol/l, ideal 308 mosmol/l', () => {
    const c = concentration('nacl', 9, 1000);
    expect(c.cMmolL).toBeCloseTo(154, 0);
    expect(c.osm).toBeCloseTo(308, 0);
    expect(c.percent).toBeCloseTo(0.9, 6);
  });
  test('Realer osmotischer Koeffizient 0,93 → ≈ 286 mosmol/l', () => expect(concentration('nacl', 9, 1000, 0.93).osm).toBeCloseTo(286, 0));
  test('Glukose 5 % ≈ 278 mmol/l', () => expect(concentration('glukose', 50, 1000).cMmolL).toBeCloseTo(277.5, 0));
  test('CaCl₂: 1 mmol = 2 mval', () => { const c = concentration('cacl2', 1.1098, 1000); expect(c.mval).toBeCloseTo(20, 1); expect(c.osm).toBeCloseTo(30, 1); });
  test('Gleichgewicht: K = k₁/k₂ und Erhaltung der Stoffmenge', () => {
    const e = equilibrium(1, 0.25, 10, 0, Infinity);
    expect(e.Beq / e.Aeq).toBeCloseTo(4, 10);
    const mid = equilibrium(1, 0.25, 10, 0, 0.7);
    expect(mid.A + mid.B).toBeCloseTo(10, 10);
  });
  test('Katalysator ändert die Gleichgewichtslage nicht, nur die Geschwindigkeit', () => {
    const a = run('gleichgewicht');
    const b = run('gleichgewicht', { cat: true });
    expect(val(a, 'Beq')).toBeCloseTo(val(b, 'Beq'), 10);
    expect(val(b, 'tau')).toBeCloseTo(val(a, 'tau') / 10, 10);
  });
  test('ΔG°’ = 0 bei K = 1; negativ bei K > 1', () => {
    expect(val(run('gleichgewicht', { k1: 0.5, k2: 0.5 }), 'dG0')).toBeCloseTo(0, 10);
    expect(val(run('gleichgewicht'), 'dG0')).toBeCloseTo(-3.57, 1);
  });
  test('Redox: NADH → O₂ liefert ≈ −220 kJ/mol', () => expect(val(run('redox'), 'dG')).toBeCloseTo(-220, -1));
  test('Nernst-Steigung 61,5 mV/z pro Dekade bei 37 °C', () => {
    expect((nernstRedox(0, 1, 10) - nernstRedox(0, 1, 1)) * 1000).toBeCloseTo(61.5, 0);
    expect((nernstRedox(0, 2, 10) - nernstRedox(0, 2, 1)) * 1000).toBeCloseTo(30.8, 0);
  });
  test('Umgekehrte Richtung ist endergon', () => expect(val(run('redox', { donor: 'o2', acceptor: 'nad' }), 'dG')).toBeGreaterThan(0));
});

describe('Physik 1. Semester', () => {
  test('Hebel: 5 kg → ≈ 484 N Bizepskraft', () => expect(elbow({ load: 5, L: 0.35, d: 0.04, arm: true, angle: 0 }).Fm).toBeCloseTo(484, -1));
  test('Hagen-Poiseuille: halber Radius → 1/16 Fluss', () => {
    expect(poiseuille(0.75, 10, 5, 3.5).Q / poiseuille(1.5, 10, 5, 3.5).Q).toBeCloseTo(1 / 16, 10);
    expect(poiseuille(1.5, 10, 5, 7).Q / poiseuille(1.5, 10, 5, 3.5).Q).toBeCloseTo(0.5, 10);
  });
  test('Standard-Strömung ist laminar', () => expect(val(run('stroemung'), 'Re')).toBeLessThan(2000));
  test('RC: τ = R·C = 1 s, nach τ 63 %', () => {
    const r = run('rc-glied');
    expect(val(r, 'tau')).toBeCloseTo(1, 10);
    const c = r.charts[0];
    const i = c.x.reduce((b: number, x: number, k: number) => (Math.abs(x - 1) < Math.abs(c.x[b] - 1) ? k : b), 0);
    expect(c.series[0].y[i] / 5).toBeCloseTo(0.632, 2);
  });
  test('Linse: f = 10 cm, g = 30 cm → b = 15 cm, β = −0,5', () => {
    const l = thinLens(10, 30, 2);
    expect(l.b).toBeCloseTo(15, 6);
    expect(l.beta).toBeCloseTo(-0.5, 6);
    expect(thinLens(10, 6, 2).b).toBeLessThan(0);
    expect(run('linse', { g: 10 }).ok).toBe(true);
  });
  test('Ultraschall: λ ≈ 0,44 mm bei 3,5 MHz; höhere Frequenz → mehr Dämpfung', () => {
    expect(val(run('ultraschall'), 'lambda')).toBeCloseTo(0.44, 2);
    expect(val(run('ultraschall', { f: 7 }), 'att')).toBeCloseTo(2 * val(run('ultraschall'), 'att'), 6);
    expect(val(run('ultraschall', { theta: 90 }), 'df')).toBeCloseTo(0, 6);
  });
  test('Zerfall: nach einer Halbwertszeit 50 %; T_eff kürzer als beide', () => {
    expect(decay(100, 6, 6)).toBeCloseTo(50, 10);
    const te = effectiveHalfLife(192.5, 80);
    expect(te).toBeLessThan(80);
    expect(te).toBeCloseTo(56.5, 0);
  });
  test('Diffusion: zehnfache Strecke → hundertfache Zeit', () => {
    expect(diffusionTime(10, 3e-5) / diffusionTime(1, 3e-5)).toBeCloseTo(100, 8);
    expect(diffusionTime(1, 3e-5)).toBeLessThan(1e-3);
  });
});
