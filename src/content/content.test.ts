import { describe, expect, test } from 'vitest';
import { LESSONS, STRUCTURES, TASKS, GUIDED_EXPERIMENTS, MODULES, MOLECULES, lessonById, structureById, taskById } from './index';
import { sourceById } from './sources';
import { modelById } from '../engine/registry';
import { runModel, withDefaults, validateParams } from '../engine/core';

describe('Lerninhalte – Integrität', () => {
  test('eindeutige IDs', () => {
    for (const arr of [LESSONS, STRUCTURES, TASKS, GUIDED_EXPERIMENTS, MOLECULES] as { id: string }[][]) {
      const ids = arr.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  test('Module verweisen auf existierende Lektionen', () => {
    for (const m of MODULES) for (const l of m.lessons) expect(lessonById(l), l).toBeTruthy();
  });
  test('jede Lektion: Lernziele, 4 Ebenen, Quellen, Verweise gültig', () => {
    for (const l of LESSONS) {
      expect(l.objectives.length, l.id).toBeGreaterThan(1);
      expect(l.overview.length).toBeGreaterThan(40);
      expect(l.mechanism.length).toBeGreaterThan(2);
      expect(l.depth.text.length).toBeGreaterThan(0);
      expect(l.sources.length).toBeGreaterThan(0);
      for (const s of l.sources) expect(sourceById(s.id), `${l.id}:${s.id}`).toBeTruthy();
      for (const x of [...l.links, ...l.prerequisites]) expect(lessonById(x), `${l.id}→${x}`).toBeTruthy();
      for (const x of l.structures) expect(structureById(x), `${l.id}→${x}`).toBeTruthy();
      for (const x of l.models) expect(modelById(x), `${l.id}→${x}`).toBeTruthy();
    }
  });
  test('jede Lektion hat mindestens eine Aufgabe', () => {
    for (const l of LESSONS) expect(TASKS.some((t) => t.lessons.includes(l.id)), l.id).toBe(true);
  });
  test('Aufgaben-Lernziele stammen aus den Lektionen', () => {
    for (const t of TASKS) {
      const objs = t.lessons.flatMap((id) => lessonById(id)!.objectives);
      expect(objs, t.id).toContain(t.objective);
    }
  });
  test('Strukturen: Verknüpfungen gültig', () => {
    for (const s of STRUCTURES) {
      for (const c of s.connections) expect(structureById(c), `${s.id}→${c}`).toBeTruthy();
      for (const l of s.lessons) expect(lessonById(l), `${s.id}→${l}`).toBeTruthy();
      for (const q of s.sources) expect(sourceById(q.id)).toBeTruthy();
    }
  });
  test('Aufgaben: Lösungen konsistent', () => {
    for (const t of TASKS) {
      for (const q of t.sources) expect(sourceById(q.id), t.id).toBeTruthy();
      if (t.type === 'single' || t.type === 'error' || t.type === 'diagram' || t.type === 'predict') {
        expect(t.options.some((o) => o.id === t.correct), t.id).toBe(true);
        for (const o of t.options) if (o.id !== t.correct && t.type !== 'error') expect(o.why, `${t.id}/${o.id}: Begründung für Fehlantwort fehlt`).toBeTruthy();
      }
      if (t.type === 'multi') for (const c of t.correct) expect(t.options.some((o) => o.id === c)).toBe(true);
      if (t.type === 'label') for (const m of t.markers) expect(structureById(m.structure)).toBeTruthy();
      if (t.type === 'diagram') {
        const m = modelById(t.model)!;
        const r = runModel(m, withDefaults(m, t.params as any));
        expect(r.ok, t.id).toBe(true);
        expect(r.charts.some((c) => c.id === t.chart), `${t.id}: Diagramm ${t.chart}`).toBe(true);
      }
      if (t.type === 'predict') {
        const m = modelById(t.model)!;
        const a = runModel(m, withDefaults(m, t.base as any));
        const b = runModel(m, withDefaults(m, { ...t.base, ...t.change } as any));
        expect(a.ok && b.ok, t.id).toBe(true);
        expect(b.scalars[t.observe], `${t.id}: Größe ${t.observe}`).toBeTruthy();
        expect(validateParams(m, withDefaults(m, { ...t.base, ...t.change } as any))).toEqual([]);
      }
    }
  });
  test('Vorhersage-Aufgaben: Simulation bestätigt die Musterlösung', () => {
    const v = (id: string, ov: any, k: string) => { const m = modelById(id)!; return runModel(m, withDefaults(m, ov)).scalars[k].value; };
    expect(v('psp-integration', { nExc: 4, excDt: 12 }, 'spikes')).toBe(0);
    expect(v('psp-integration', { nExc: 4, excDt: 0 }, 'spikes')).toBeGreaterThan(0);
    expect(v('aktionspotenzial', { gNa: 40 }, 'spikes')).toBe(0);
    expect(v('saeure-base', { sys: 'bicarb', pco2: 60 }, 'pH')).toBeLessThan(7.3);
    expect(v('osmose', { osmOut: 150 }, 'Veq')).toBeGreaterThan(1);
    expect(v('kreislauf', { rMuscle: 1.4 }, 'MAP')).toBeLessThan(v('kreislauf', {}, 'MAP') as number);
  });
  test('geführte Experimente gültig', () => {
    for (const g of GUIDED_EXPERIMENTS) {
      const m = modelById(g.model)!;
      expect(m, g.id).toBeTruthy();
      expect(taskById(g.transferTask), g.id).toBeTruthy();
      expect(g.hypothesisOptions.some((h) => h.id === g.correctHypothesis)).toBe(true);
      expect(runModel(m, withDefaults(m, { ...g.start, ...g.suggestedChange } as any)).ok, g.id).toBe(true);
    }
  });
  test('alle Inhalte sind als „fachlich zu prüfen“ gekennzeichnet (keine unbelegte Freigabe)', () => {
    for (const x of [...LESSONS, ...STRUCTURES, ...TASKS]) expect(x.status).not.toBe('freigegeben');
  });
  test('Moleküle: Formeln und Strukturdaten vorhanden', () => {
    expect(MOLECULES.find((m) => m.id === 'glukose')!.formula).toBe('C6H12O6');
    expect(MOLECULES.find((m) => m.id === 'atp')!.formula).toBe('C10H16N5O13P3');
    for (const m of MOLECULES) {
      expect(m.atoms.length).toBeGreaterThan(0);
      expect(m.significance.length, m.id).toBeGreaterThan(5);
    }
  });
});

describe('1. Semester – Inhalte für Kim (Leipzig)', () => {
  const NEW = ['konzentrationen', 'gleichgewicht', 'redox', 'organik', 'naturstoffe', 'komplexe', 'mechanik', 'stroemung', 'diffusion', 'elektrizitaet', 'optik', 'ultraschall', 'radioaktivitaet', 'zellzyklus', 'genetik', 'mikroorganismen', 'epithel', 'bindegewebe', 'muskel-nervengewebe', 'lagebezeichnungen', 'wortbildung'];
  test('jedes Lernziel der neuen Lektionen wird von mindestens einer Aufgabe geprüft', () => {
    for (const id of NEW) {
      const l = lessonById(id)!;
      expect(l, id).toBeTruthy();
      for (const o of l.objectives) expect(TASKS.some((t) => t.lessons.includes(id) && t.objective === o), `${id}: „${o}“`).toBe(true);
    }
  });
  test('Fächer des 1. Semesters stehen vorne und decken alle Leipziger Fächer ab', () => {
    const first = MODULES.filter((m) => m.semesters.includes(1)).map((m) => m.title);
    expect(first).toEqual(['Anatomie', 'Chemie', 'Biologie', 'Physik', 'Histologie', 'Terminologie']);
    expect(MODULES.findIndex((m) => m.id === 'neuro')).toBeGreaterThan(5);
  });
  test('jede Lektion gehört genau einem Bereich an', () => {
    const all = MODULES.flatMap((m) => m.lessons);
    expect(new Set(all).size).toBe(all.length);
    for (const l of LESSONS) expect(all, l.id).toContain(l.id);
  });
  test('Simulation bestätigt die Musterlösungen der neuen Vorhersage-Aufgaben', () => {
    const v = (id: string, ov: any, k: string) => { const m = modelById(id)!; return runModel(m, withDefaults(m, ov)).scalars[k].value as number; };
    expect(v('gleichgewicht', { cat: true }, 'Beq')).toBeCloseTo(v('gleichgewicht', {}, 'Beq'), 10);
    expect(v('gleichgewicht', { cat: true }, 'tau')).toBeLessThan(v('gleichgewicht', {}, 'tau'));
    expect(v('stroemung', { r: 0.75 }, 'Q') / v('stroemung', {}, 'Q')).toBeCloseTo(1 / 16, 6);
    expect(v('diffusion', { solute: 'o2', x: 10000 }, 'logt') - v('diffusion', { solute: 'o2', x: 1 }, 'logt')).toBeCloseTo(8, 6);
    expect(10 ** v('diffusion', { solute: 'o2', x: 10000 }, 'logt')).toBeGreaterThan(3600);
  });
  test('Rechenaufgaben: hinterlegte Lösungen stimmen', () => {
    const f = (id: string) => { const t = taskById(id)!; return t.type === 'formula' ? t.answer : NaN; };
    expect(f('s1-konz-nacl')).toBeCloseTo((9 / 58.44) * 1000, -1);
    expect(f('s1-konz-osm')).toBeCloseTo((50 / 180.16) * 1000, -1);
    expect(f('s1-redox-dg')).toBeCloseTo((-2 * 96485 * 1.14) / 1000, -1);
    expect(f('s1-mech-bizeps')).toBeCloseTo((5 * 9.81 * 0.35) / 0.04, -1);
    expect(f('s1-opt-b')).toBeCloseTo(1 / (1 / 10 - 1 / 30), 6);
    expect(f('s1-us-lambda')).toBeCloseTo((1540 / 5e6) * 1000, 1);
    expect(f('s1-us-tiefe')).toBeCloseTo(((1540 * 130e-6) / 2) * 100, 1);
    expect(f('s1-rad-teff')).toBeCloseTo(1 / (1 / 6 + 1 / 24), 6);
    expect(f('s1-el-tau')).toBeCloseTo(200e3 * 10e-6, 10);
  });
  test('Histologie: Gewebestrukturen vollständig verknüpft', () => {
    for (const id of ['epithel', 'bindegewebe', 'muskel-nervengewebe']) {
      const l = lessonById(id)!;
      expect(l.structures.length).toBeGreaterThan(4);
      for (const s of l.structures) expect(structureById(s)!.figure).toBe('tissue');
    }
  });
});

import { ANATOMY_LESSONS as ANA1, ANATOMY_STRUCTURES as ANAS1 } from './anatomy1';
import { ANATOMY2_LESSONS, ANATOMY2_STRUCTURES, TISSUE2_STRUCTURES } from './anatomy2';
const ANATOMY_LESSONS = [...ANA1, ...ANATOMY2_LESSONS];
const ANATOMY_STRUCTURES = [...ANAS1, ...ANATOMY2_STRUCTURES];
import { CURRICULUM, relevanceOf, lessonsInWindow } from './curriculum';
import { FLASHCARDS } from './cards';
import { FIGURE_IDS, BONE_LABELS, JOINT_LABELS, MUSCLEX_LABELS, BODY_LABELS, armLabels, armState } from '../ui/anatomyFigures';
import { SPINAL_LABELS, HEART_LABELS, VESSEL_LABELS, SPINE_LABELS, TRUNK_LABELS, UPPER_LABELS, LOWER_LABELS, KNEE_LABELS } from '../ui/anatomyFigures2';
import { moduleById } from './index';

describe('Anatomie I und Leipziger Belegstatus', () => {
  test('jedes Lernziel der Anatomie-Lektionen hat mindestens eine Aufgabe', () => {
    for (const l of ANATOMY_LESSONS) for (const o of l.objectives) expect(TASKS.some((t) => t.objective === o && t.lessons.includes(l.id)), `${l.id}: ${o}`).toBe(true);
  });
  test('jede Lektion hat einen Belegstatus; Anatomie und Histologie sind im Plan belegt, Physiologie ist Vertiefung', () => {
    for (const l of LESSONS) {
      const r = relevanceOf(l.id, moduleById(l.module)!.semesters);
      expect(['belegt', 'fach', 'vertiefung']).toContain(r.kind);
      if (l.module === 'anatomy' || (l.module === 'histo' && l.id !== 'mikroskopie')) expect(r.kind, l.id).toBe('belegt');
      if (l.module === 'neuro' || l.module === 'physio') expect(r.kind, l.id).toBe('vertiefung');
    }
    for (const c of CURRICULUM) { expect(lessonById(c.lesson), c.lesson).toBeTruthy(); expect(sourceById(c.source.id)).toBeTruthy(); for (const d of c.dates) expect(d).toMatch(/^(2026-(10|11|12)|2027-0[1-2])-\d\d$/); }
  });
  test('Stundenplan-Fenster: Ende Oktober läuft Epithelgewebe', () => {
    const ids = lessonsInWindow('2026-10-26', '2026-11-04').map((x) => x.entry.lesson);
    expect(ids).toContain('epithel');
    expect(ids).not.toContain('muskellehre');
  });
  test('Abbildungen: jede Struktur ist gezeichnet und jede Beschriftungsaufgabe passt zur Abbildung', () => {
    const all = Object.values(FIGURE_IDS).flat();
    for (const id of all) expect(structureById(id), id).toBeTruthy();
    for (const s of ANATOMY_STRUCTURES) expect(all, s.id).toContain(s.id);
    for (const L of [BONE_LABELS, JOINT_LABELS, MUSCLEX_LABELS, BODY_LABELS, armLabels(70), SPINAL_LABELS, HEART_LABELS, VESSEL_LABELS, SPINE_LABELS, TRUNK_LABELS, UPPER_LABELS, LOWER_LABELS, KNEE_LABELS]) for (const v of Object.values(L)) for (const n of [...v.a, ...v.t]) expect(Number.isFinite(n)).toBe(true);
    for (const t of TASKS) if (t.type === 'label' && t.figure !== 'neuron' && t.figure !== 'synapse') for (const m of t.markers) expect(FIGURE_IDS[t.figure], `${t.id}: ${m.structure}`).toContain(m.structure);
  });
  test('Arm-Schema: beim Beugen verkürzen sich Bizeps und Brachialis, der Trizeps wird länger', () => {
    const a = armState(0), b = armState(100);
    expect(b.biceps).toBeLessThan(a.biceps);
    expect(b.brachialis).toBeLessThan(a.brachialis);
    expect(b.triceps).toBeGreaterThan(a.triceps);
  });
  test('Karteikarten: eindeutig, jedes Fach des 1. Semesters vertreten, Lektionen existieren', () => {
    const ids = FLASHCARDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(FLASHCARDS.length).toBeGreaterThan(200);
    for (const c of FLASHCARDS) { expect(lessonById(c.lesson), c.id).toBeTruthy(); expect(c.front.length && c.back.length).toBeTruthy(); }
    for (const m of MODULES.filter((x) => x.semesters.includes(1))) expect(FLASHCARDS.some((c) => c.module === m.id), m.id).toBe(true);
  });
  test('Anatomie II/III: Gewebelektionen nutzen Gewebeschemata, jede Struktur einer Lektion existiert, Stundenplan reicht bis Januar', () => {
    for (const s of TISSUE2_STRUCTURES) expect(s.figure).toBe('tissue');
    for (const l of ANATOMY2_LESSONS) for (const s of l.structures) expect(structureById(s), `${l.id}: ${s}`).toBeTruthy();
    for (const l of ANATOMY2_LESSONS) expect(moduleById(l.module)!.lessons, l.id).toContain(l.id);
    const jan = lessonsInWindow('2027-01-18', '2027-01-22').map((x) => x.entry.lesson);
    expect(jan).toContain('obere-extremitaet');
    expect(jan).toContain('untere-extremitaet');
    const ids = new Set(LESSONS.map((l) => l.id));
    expect(ids.size).toBe(LESSONS.length);
  });
  test('keine Aufgabe gibt sich als Leipziger Originalfrage aus', () => {
    for (const t of TASKS) expect(/original|altklausur|testatfrage/i.test(t.prompt + t.explanation), t.id).toBe(false);
  });
});

import { CALC_TEMPLATES, calcInstance, gradeCalc, normUnit } from './calc';
import { checkBalance, parseFormula } from './chemtools';
import { WORDS, PARTS, splitOptions } from './termtrainer';
import { grade, parseNumber } from '../store/grading';
import { electronConfig } from '../pages/views/semester2Views';

describe('Berechnungstrainer, Reaktionsgleichungen, Histologie-Simulator, Terminologietrainer', () => {
  test('jede Rechenvorlage erzeugt bei 200 Zufallszahlen konsistente Aufgaben', () => {
    for (const t of CALC_TEMPLATES) {
      for (let seed = 1; seed <= 200; seed++) {
        const i = calcInstance(t.id, seed);
        expect(Number.isFinite(i.result), `${t.id}/${seed}`).toBe(true);
        expect(i.formulaOptions, t.id).toContain(i.formula);
        expect(i.soughtOptions, t.id).toContain(i.sought);
        expect(new Set(i.formulaOptions).size, t.id).toBe(i.formulaOptions.length);
        expect(i.units[normUnit(i.unit)], `${t.id}: kanonische Einheit akzeptiert`).toBe(1);
        const ok = gradeCalc(i, { seed, sought: i.sought, formula: i.formula, value: String(i.result), unit: i.unit }, parseNumber);
        expect(ok.score, `${t.id}/${seed}`).toBe(1);
      }
      expect(LESSONS.find((l) => l.id === t.lesson)?.objectives[t.objective], t.id).toBeTruthy();
    }
  });
  test('Rechentrainer erkennt Einheiten- und Formelfehler', () => {
    const i = calcInstance('hydrostatik', 3);
    const base = { seed: 3, sought: i.sought, formula: i.formula };
    expect(gradeCalc(i, { ...base, value: String(i.result / 133.32), unit: 'mmHg' }, parseNumber).score).toBe(1);
    expect(gradeCalc(i, { ...base, value: String(i.result * 100), unit: 'Pa' }, parseNumber).category).toBe('einheit');
    expect(gradeCalc(i, { ...base, value: String(i.result), unit: 'kg' }, parseNumber).category).toBe('einheit');
    expect(gradeCalc(i, { ...base, value: String(i.result * 1.37), unit: 'Pa' }, parseNumber).category).toBe('rechnen');
    expect(gradeCalc(i, { ...base, formula: i.formulaOptions.find((f) => f !== i.formula), value: String(i.result), unit: 'Pa' }, parseNumber).category).toBe('formel');
    const v = calcInstance('geschw', 5);
    expect(gradeCalc(v, { seed: 5, sought: v.sought, formula: v.formula, value: String(v.result * 3.6), unit: 'km/h' }, parseNumber).score).toBe(1);
    expect(normUnit(' m/s^2 ')).toBe(normUnit('m/s²'));
  });
  test('Formeln werden korrekt zerlegt; alle Gleichungen sind mit der Musterlösung ausgeglichen', () => {
    expect(parseFormula('Ca(OH)₂').atoms).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseFormula('SO₄²⁻')).toEqual({ atoms: { S: 1, O: 4 }, charge: -2 });
    expect(parseFormula('C₆H₁₂O₆').atoms).toEqual({ C: 6, H: 12, O: 6 });
    for (const t of TASKS) if (t.type === 'balance') {
      const r = checkBalance(t.reactants, t.products, t.coefficients);
      expect(r.balanced && r.minimal, t.id).toBe(true);
      expect(grade(t, t.coefficients.map((c) => c * 2)).score, t.id).toBe(0.8);
    }
  });
  test('Histologie-Simulator: Präparate existieren, Merkmale und Fehlerkategorien', () => {
    const hs = TASKS.filter((t) => t.type === 'histo');
    expect(hs.length).toBeGreaterThanOrEqual(15);
    for (const t of hs) {
      if (t.type !== 'histo') continue;
      expect(structureById(t.scene)?.figure, t.id).toBe('tissue');
      expect(t.tissueOptions, t.id).toContain(t.scene);
      for (const o of t.tissueOptions) expect(structureById(o), `${t.id}:${o}`).toBeTruthy();
      expect(t.features.some((f) => f.ok) && t.features.some((f) => !f.ok), t.id).toBe(true);
      for (const f of t.features) if (!f.ok) expect(f.why, `${t.id}: ${f.text}`).toBeTruthy();
      expect(t.fn.options, t.id).toContain(t.fn.correct);
      const wrongTissue = grade(t, { tissue: t.tissueOptions.find((x) => x !== t.scene), form: t.form?.correct, layers: t.layers?.correct, features: t.features.filter((f) => f.ok).map((f) => f.text), fn: t.fn.correct });
      expect(wrongTissue.category, t.id).toBe('gewebe');
      if (t.layers) expect(grade(t, { tissue: t.scene, form: t.form?.correct, layers: t.layers.options.find((x) => x !== t.layers!.correct), features: t.features.filter((f) => f.ok).map((f) => f.text), fn: t.fn.correct }).category).toBe('schichtzahl');
    }
  });
  test('Terminologietrainer: Bausteine ergeben das Wort, Fehlschreibungen sind falsch, Zerlegung enthält die richtige', () => {
    for (const w of WORDS) {
      expect(w.parts.map((p) => p.p).join('').toLowerCase(), w.word).toBe(w.word.toLowerCase());
      expect(w.wrong, w.word).not.toContain(w.word);
      expect(new Set(w.wrong).size).toBe(3);
      expect(splitOptions(w).map((x) => x.join('|')), w.word).toContain(w.parts.map((p) => p.p).join('|'));
    }
    expect(WORDS.filter((w) => w.transfer).length).toBeGreaterThan(5);
    expect(PARTS.length).toBeGreaterThan(20);
    for (const req of ['kardio', 'neuro', 'osteo', 'hepat', 'nephr', 'gastr', 'dermato', 'my', 'hämato', 'itis', 'logie', 'tomie', 'ektomie']) expect(PARTS.map((p) => p.p), req).toContain(req);
  });
  test('Elektronenkonfiguration', () => {
    expect(electronConfig(11).short).toBe('[Ne] 3s¹');
    expect(electronConfig(17).short).toBe('[Ne] 3s² 3p⁵');
    expect(electronConfig(20).short).toBe('[Ar] 4s²');
    expect(electronConfig(26).short).toBe('[Ar] 3d⁶ 4s²');
    expect(electronConfig(24).short).toBe('[Ar] 3d⁵ 4s¹');
    expect(electronConfig(6).full).toBe('1s² 2s² 2p²');
    expect(electronConfig(15).valence).toBe(5);
    expect(electronConfig(11).shells).toEqual([2, 8, 1]);
  });
});

import { PHYS2_LESSONS, CHEM2_LESSONS, HISTO2_LESSONS } from './semester1b';
test('jedes Lernziel der ergänzten Lektionen hat mindestens eine Aufgabe', () => {
  for (const l of [...PHYS2_LESSONS, ...CHEM2_LESSONS, ...HISTO2_LESSONS]) for (const o of l.objectives) expect(TASKS.some((t) => t.objective === o && t.lessons.includes(l.id)), `${l.id}: ${o}`).toBe(true);
});

test('Zahlen in Zehnerpotenz-Schreibweise werden erkannt (Teilchenzahlen)', () => {
  expect(parseNumber('6,022 · 10^23')).toBeCloseTo(6.022e23, -20);
  expect(parseNumber('6,022·10²³')).toBeCloseTo(6.022e23, -20);
  expect(parseNumber('3.01e23')).toBe(3.01e23);
  expect(parseNumber('1,5 × 10⁻⁹')).toBeCloseTo(1.5e-9, 20);
  const i = calcInstance('teilchenzahl', 11);
  expect(gradeCalc(i, { seed: 11, sought: i.sought, formula: i.formula, value: (i.result / 1e23).toFixed(3).replace('.', ',') + ' · 10^23', unit: 'Moleküle' }, parseNumber).score).toBe(1);
  const e = calcInstance('ionenkonz', 4);
  expect(e.formulaOptions).toContain(e.formula);
});

import { solveAB, titrationPH } from '../pages/views/chem3Views';
import { lessonById as lessonById2 } from './index';
describe('Chemie nach Seminar 2: Gleichgewicht und Titration', () => {
  test('MWG-Tabelle: Esterbildung K = 4 setzt bei 1 : 1 zwei Drittel um', () => {
    expect(solveAB(4, 1, 1)).toBeCloseTo(2 / 3, 4);
    const x = solveAB(4, 1, 3);
    expect((x * x) / ((1 - x) * (3 - x))).toBeCloseTo(4, 4);
  });
  test('Titrationskurve: Äquivalenzpunkt starke Säure pH 7, Halbäquivalenzpunkt Essigsäure pH ≈ pKs, Äquivalenzpunkt Essigsäure basisch', () => {
    expect(titrationPH(null, 0.1, 20, 0.1, 20)).toBeCloseTo(7, 1);
    expect(titrationPH(4.76, 0.1, 20, 0.1, 10)).toBeCloseTo(4.76, 1);
    expect(titrationPH(4.76, 0.1, 20, 0.1, 20)).toBeGreaterThan(8);
    expect(titrationPH(null, 0.1, 20, 0.1, 0)).toBeCloseTo(1, 1);
  });
  test('ausgebaute Lektionen behalten alte Lernziele und haben für jedes Lernziel eine Aufgabe', () => {
    for (const id of ['gleichgewicht', 'saeure-base']) {
      const l = lessonById2(id)!;
      expect(l.objectives.length).toBe(7);
      for (const o of l.objectives) expect(TASKS.some((t) => t.objective === o && t.lessons.includes(id)), `${id}: ${o}`).toBe(true);
    }
  });
});

import { NAMING } from '../pages/views/chem4Views';
import { checkBalance as checkBalance2 } from './chemtools';
describe('Kohlenwasserstoffe', () => {
  test('jedes Lernziel hat eine Aufgabe, Verbrennungsgleichungen sind ausgeglichen', () => {
    const l = lessonById2('kohlenwasserstoffe')!;
    for (const o of l.objectives) expect(TASKS.some((t) => t.objective === o && t.lessons.includes(l.id)), o).toBe(true);
    for (const t of TASKS) if (t.type === 'balance' && t.lessons.includes('kohlenwasserstoffe')) expect(checkBalance2(t.reactants, t.products, t.coefficients).balanced, t.id).toBe(true);
  });
  test('Benennungstrainer: Zeichnungen und Hauptketten stimmig, jedes C hat höchstens vier Bindungen', () => {
    for (const m of NAMING) {
      expect(m.wrong.map((w) => w[0])).not.toContain(m.name);
      for (const i of m.chain) expect(m.pts[i], m.name).toBeTruthy();
      const val = m.pts.map(() => 0);
      for (const [a, b, o] of m.bonds) { val[a] += o; val[b] += o; }
      for (const v of val) expect(v, m.name).toBeLessThanOrEqual(4);
      for (let k = 1; k < m.chain.length; k++) expect(m.bonds.some(([a, b]) => (a === m.chain[k - 1] && b === m.chain[k]) || (b === m.chain[k - 1] && a === m.chain[k])), `${m.name}: Kette`).toBe(true);
    }
  });
});

describe('Chemie 1. Semester vollständig', () => {
  test('jedes Lernziel jeder Chemie-Lektion hat mindestens eine Aufgabe', () => {
    const missing: string[] = [];
    for (const id of moduleById('molecule')!.lessons) { const l = lessonById2(id)!; for (const o of l.objectives) if (!TASKS.some((t) => t.objective === o && t.lessons.includes(id))) missing.push(`${id}: ${o}`); }
    expect(missing).toEqual([]);
  });
});

describe("1. Semester vollständig", () => {
  test('jedes Lernziel jeder Lektion der Fächer des 1. Semesters hat mindestens eine Aufgabe', async () => {
    const { MODULES, lessonById: byId, TASKS: all } = await import('./index');
    const missing: string[] = [];
    for (const m of MODULES.filter((x) => x.semesters.includes(1))) for (const id of m.lessons) { const l = byId(id); if (!l) { missing.push(`fehlt: ${id}`); continue; } for (const o of l.objectives) if (!all.some((t) => t.objective === o && t.lessons.includes(id))) missing.push(`${id}: ${o}`); }
    expect(missing).toEqual([]);
  });
  test('Verweise, Voraussetzungen und Übungsdaten zeigen auf vorhandene Lektionen', async () => {
    const { LESSONS: all, TASKS: tasks } = await import('./index');
    const { TOPIC_EXTRAS } = await import('./topics');
    const ids = new Set(all.map((l) => l.id));
    const bad: string[] = [];
    for (const l of all) for (const x of [...l.links, ...l.prerequisites]) if (!ids.has(x)) bad.push(`${l.id} → ${x}`);
    for (const k of Object.keys(TOPIC_EXTRAS)) if (!ids.has(k)) bad.push(`Übung ${k}`);
    for (const [k, e] of Object.entries(TOPIC_EXTRAS)) for (const q of e.quiz ?? []) { if (!q.options.includes(q.answer)) bad.push(`${k}: Antwort fehlt in Optionen – ${q.q}`); if (new Set(q.options).size !== q.options.length) bad.push(`${k}: doppelte Option – ${q.q}`); }
    for (const e of Object.values(TOPIC_EXTRAS)) for (const t of e.tables ?? []) for (const r of t.rows) if (r.length !== t.head.length) bad.push(`Tabelle ${t.title}: Zeilenlänge`);
    const tid = new Set<string>(); for (const t of tasks) { if (tid.has(t.id)) bad.push(`doppelte Aufgaben-ID ${t.id}`); tid.add(t.id); }
    expect(bad).toEqual([]);
  });
});
