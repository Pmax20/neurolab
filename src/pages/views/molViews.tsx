import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { ThreeViewer, mat, type ThreeItem } from '../../ui/ThreeViewer';
import { Workbench } from '../../ui/Workbench';
import { acidBaseModel, classifyBond, ELEMENTS, elementBySym, elementByZ, shells } from '../../engine/chem';
import { MOLECULES, toSub, type Molecule } from '../../content/molphys';
import mol2d from '../../content/molecules2d.generated.json';
import { Splitter } from '../../ui/common';
import { fmt } from '../../ui/Chart';
import { muscleModel } from '../../engine/muscle';
import { circulationModel, respirationModel } from '../../engine/physio';
import { href } from '../../ui/router';
import { EKKView } from './neuroViews';

const VDW: Record<string, number> = { H: 1.2, C: 1.7, N: 1.55, O: 1.52, P: 1.8, S: 1.8, Na: 2.27, K: 2.75, Ca: 2.31, Cl: 1.75, Mg: 1.73, F: 1.47 };
const COLORS: Record<string, string> = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e.color]));
type Mode = 'kugelstab' | 'kalotte' | 'stab';

function buildMolecule(scene: THREE.Scene, atoms: { el: string; xyz: [number, number, number]; q?: number }[], bonds: [number, number, number][], mode: Mode): ThreeItem[] {
  const items: ThreeItem[] = [];
  const c = new THREE.Vector3();
  atoms.forEach((a) => c.add(new THREE.Vector3(...a.xyz)));
  c.divideScalar(Math.max(1, atoms.length));
  const pos = atoms.map((a) => new THREE.Vector3(...a.xyz).sub(c));
  atoms.forEach((a, i) => {
    const el = elementBySym(a.el);
    const r = mode === 'kalotte' ? VDW[a.el] ?? 1.6 : mode === 'stab' ? 0.14 : Math.max(0.22, (el?.radius ?? 0.7) * 0.45);
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat(COLORS[a.el] ?? '#ff66cc'));
    m.position.copy(pos[i]);
    scene.add(m);
    items.push({ id: `a${i}`, label: `${el?.name ?? a.el} (${a.el}${a.q ? (a.q > 0 ? '+' : '−') : ''})`, object: m, selectable: true });
  });
  if (mode !== 'kalotte') {
    const g = new THREE.Group();
    const bm = mat(0x999999);
    for (const [i, j, order] of bonds) {
      const a = pos[i];
      const b = pos[j];
      const d = b.clone().sub(a);
      const len = d.length();
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
      const n = order >= 2 ? (order === 1.5 ? 2 : Math.round(order)) : 1;
      const perp = new THREE.Vector3(1, 0, 0).applyQuaternion(q).multiplyScalar(0.11);
      for (let k = 0; k < n; k++) {
        const off = n === 1 ? 0 : (k - (n - 1) / 2) * 2;
        const thin = order === 1.5 && k === 1;
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(thin ? 0.04 : mode === 'stab' ? 0.12 : 0.07, thin ? 0.04 : mode === 'stab' ? 0.12 : 0.07, len, 10), bm);
        cyl.position.copy(mid.clone().add(perp.clone().multiplyScalar(off)));
        cyl.quaternion.copy(q);
        g.add(cyl);
      }
    }
    scene.add(g);
    items.push({ id: 'bonds', label: 'Bindungen', object: g, selectable: false });
  }
  return items;
}

function angle(a: number[], b: number[], c: number[]) {
  const v1 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const v2 = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const l = Math.hypot(...v1) * Math.hypot(...v2);
  return (Math.acos(Math.max(-1, Math.min(1, dot / l))) * 180) / Math.PI;
}

function AtomDetails({ atoms, bonds, idx, validated }: { atoms: { el: string; xyz: number[]; q?: number }[]; bonds: [number, number, number][]; idx: number; validated: boolean }) {
  const a = atoms[idx];
  const el = elementBySym(a.el);
  const nb = bonds.filter((b) => b[0] === idx || b[1] === idx).map((b) => ({ j: b[0] === idx ? b[1] : b[0], order: b[2] }));
  const angles: { lbl: string; v: number }[] = [];
  for (let i = 0; i < nb.length; i++)
    for (let k = i + 1; k < nb.length; k++) angles.push({ lbl: `${atoms[nb[i].j].el}–${a.el}–${atoms[nb[k].j].el}`, v: angle(atoms[nb[i].j].xyz, a.xyz, atoms[nb[k].j].xyz) });
  return (
    <section className="card" aria-live="polite">
      <h3>Atom {idx + 1}: {el?.name} ({a.el})</h3>
      <p>Ordnungszahl {el?.z}, Elektronegativität {el?.en ?? '—'}{a.q ? `, Formalladung ${a.q > 0 ? '+' : ''}${a.q}` : ''}</p>
      <p><b>Bindungen:</b> {nb.length ? nb.map((n) => `${atoms[n.j].el} (${n.order === 1.5 ? 'aromatisch' : n.order === 2 ? 'Doppel' : n.order === 3 ? 'Dreifach' : 'Einfach'}, ${classifyBond(a.el, atoms[n.j].el)?.cls ?? '—'})`).join('; ') : 'keine'}</p>
      {angles.length > 0 && (
        <>
          <b>Bindungswinkel{validated ? '' : ' (nur angenähert)'}</b>
          <ul>{angles.slice(0, 6).map((x, i) => <li key={i}>{x.lbl}: {x.v.toFixed(1).replace('.', ',')}°</li>)}</ul>
        </>
      )}
      {!validated && <p className="muted" style={{ fontSize: '0.85rem' }}>Die Geometrie im Editor ist eine einfache Kraftfeld-Näherung und kein validierter Strukturdatensatz.</p>}
    </section>
  );
}

// ---------------------------------------------------------------------------
export function MoleculesView() {
  const [tab, setTab] = useState<'bib' | 'edit'>('bib');
  return (
    <div className="stack">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'bib'} onClick={() => setTab('bib')}>Molekülbibliothek</button>
        <button role="tab" aria-selected={tab === 'edit'} onClick={() => setTab('edit')}>Moleküleditor</button>
      </div>
      {tab === 'bib' ? <MoleculeLibrary /> : <MoleculeEditor />}
    </div>
  );
}

function MoleculeLibrary() {
  const [id, setId] = useState('glukose');
  const [mode, setMode] = useState<Mode>('kugelstab');
  const [sel, setSel] = useState<string | null>(null);
  const [showH, setShowH] = useState(true);
  const groups = [...new Set(MOLECULES.map((m) => m.group))];
  const m = MOLECULES.find((x) => x.id === id)!;
  const view = useMemo(() => filterH(m, showH), [m, showH]);
  const atomIdx = sel?.startsWith('a') ? Number(sel.slice(1)) : null;
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="toolbar-line">
          <select value={id} onChange={(e) => { setId(e.target.value); setSel(null); }} aria-label="Molekül auswählen" style={{ flex: 1, minWidth: 200, fontSize: '1.02rem' }}>
            {groups.map((g) => <optgroup key={g} label={g}>{MOLECULES.filter((x) => x.group === g).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</optgroup>)}
          </select>
          <div className="seg" role="group" aria-label="Darstellung">
            {(['kugelstab', 'kalotte', 'stab'] as Mode[]).map((k) => <button key={k} aria-pressed={mode === k} onClick={() => setMode(k)}>{{ kugelstab: 'Kugel-Stab', kalotte: 'Kalotte', stab: 'Stäbchen' }[k]}</button>)}
          </div>
          <label className="row" style={{ gap: 6 }}><input type="checkbox" checked={showH} onChange={(e) => setShowH(e.target.checked)} /> H-Atome</label>
        </div>
        <ThreeViewer key={`${id}-${mode}-${showH}`} build={(s) => buildMolecule(s, view.atoms, view.bonds, mode)} selected={sel} onSelect={setSel} ariaLabel={`3D-Struktur: ${m.name}`}
          views={[{ name: 'Ansicht 1', pos: [0, 0, Math.max(8, view.atoms.length * 0.5)] }, { name: 'Ansicht 2', pos: [Math.max(8, view.atoms.length * 0.5), 2, 0] }]}
          fallback={<div className="figure" dangerouslySetInnerHTML={{ __html: (mol2d as Record<string, string>)[id] }} />} />
        <div className="row" style={{ gap: 6 }} aria-label="Farbcode">{['C', 'H', 'O', 'N', 'P', 'S'].map((e) => <span key={e} className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', marginRight: 8 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: COLORS[e], display: 'inline-block', border: '1px solid #888' }} />{e}</span>)}</div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3 style={{ marginBottom: 2 }}>{m.name}</h3>
          <div className="muted" style={{ marginBottom: 10 }}><span className="mono">{m.displayFormula}</span> · {fmt(m.mw, 2)} g/mol</div>
          <p style={{ marginTop: 0 }}>{m.significance}</p>
          <details>
            <summary>Strukturformel (2D)</summary>
            <div className="figure" style={{ background: '#fff', marginTop: 8 }} role="img" aria-label={`Strukturformel von ${m.name}`} dangerouslySetInnerHTML={{ __html: (mol2d as Record<string, string>)[id] }} />
          </details>
          <details>
            <summary>Mehr Details</summary>
            <p><b>Stoffgruppe:</b> {m.group}</p>
            <p><b>Funktionelle Gruppen:</b> {m.functionalGroups.join(', ') || '—'}</p>
            {m.cip.length > 0 && <p><b>Stereozentren (CIP):</b> {m.cip.join(', ')}</p>}
            <p><b>Eigenschaften:</b> {m.properties}</p>
            <p><b>SMILES:</b> <span className="mono" style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>{m.smiles}</span></p>
            <p className="muted" style={{ fontSize: '0.82rem' }}>Validierung: {m.validation}. Valenzen und Ladungen wurden unabhängig von der Darstellung geprüft (RDKit). Gezeigt ist eine energiearme Konformation in neutraler Schreibweise.</p>
          </details>
        </section>
        {atomIdx !== null && view.atoms[atomIdx] ? <AtomDetails atoms={view.atoms} bonds={view.bonds} idx={atomIdx} validated /> : <p className="muted" style={{ margin: 0 }}>Tippe auf ein Atom im 3D-Modell, um Bindungen und Winkel zu sehen.</p>}
      </aside>
    </div>
  );
}

function filterH(m: Molecule, showH: boolean) {
  if (showH) return { atoms: m.atoms, bonds: m.bonds };
  const keep = m.atoms.map((a) => a.el !== 'H');
  const map: number[] = [];
  let k = 0;
  keep.forEach((v, i) => { map[i] = v ? k++ : -1; });
  return { atoms: m.atoms.filter((_, i) => keep[i]), bonds: m.bonds.filter(([a, b]) => keep[a] && keep[b]).map(([a, b, o]) => [map[a], map[b], o] as [number, number, number]) };
}

// ---------------------------------------------------------------------------
// Moleküleditor
// ---------------------------------------------------------------------------

interface EAtom { el: string; xyz: [number, number, number] }
type EBond = [number, number, number];
const START: { atoms: EAtom[]; bonds: EBond[] } = {
  atoms: [{ el: 'C', xyz: [0, 0, 0] }, { el: 'H', xyz: [0.63, 0.63, 0.63] }, { el: 'H', xyz: [-0.63, -0.63, 0.63] }, { el: 'H', xyz: [-0.63, 0.63, -0.63] }, { el: 'H', xyz: [0.63, -0.63, -0.63] }],
  bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
};

/** Chemische Validierung – unabhängig von der Darstellung */
export function validateStructure(atoms: { el: string }[], bonds: EBond[]) {
  const issues: string[] = [];
  const order = atoms.map(() => 0);
  for (const [a, b, o] of bonds) { order[a] += o; order[b] += o; }
  atoms.forEach((a, i) => {
    const el = elementBySym(a.el);
    if (!el) { issues.push(`Atom ${i + 1}: unbekanntes Element.`); return; }
    if (!el.valence.includes(order[i])) {
      const max = Math.max(...el.valence);
      issues.push(order[i] > max ? `Atom ${i + 1} (${a.el}) hat ${order[i]} Bindungen – mehr als die übliche Bindigkeit (${el.valence.join(' oder ')}).` : `Atom ${i + 1} (${a.el}) hat ${order[i]} Bindung(en), üblich sind ${el.valence.join(' oder ')} (freie Valenz oder Ladung?).`);
    }
  });
  // Zusammenhang prüfen
  if (atoms.length > 1) {
    const seen = new Set([0]);
    const stack = [0];
    while (stack.length) { const x = stack.pop()!; for (const [a, b] of bonds) { const y = a === x ? b : b === x ? a : -1; if (y >= 0 && !seen.has(y)) { seen.add(y); stack.push(y); } } }
    if (seen.size < atoms.length) issues.push('Die Struktur besteht aus mehreren nicht verbundenen Teilen.');
  }
  return { valid: issues.length === 0, issues, order };
}

export function hillFormula(atoms: { el: string }[]) {
  const c: Record<string, number> = {};
  for (const a of atoms) c[a.el] = (c[a.el] ?? 0) + 1;
  const keys = Object.keys(c);
  const ordered = c.C ? ['C', 'H', ...keys.filter((k) => k !== 'C' && k !== 'H').sort()] : keys.sort();
  return ordered.filter((k) => c[k]).map((k) => `${k}${c[k] > 1 ? c[k] : ''}`).join('');
}

function relax(atoms: EAtom[], bonds: EBond[], iters = 300): EAtom[] {
  const p = atoms.map((a) => [...a.xyz] as [number, number, number]);
  const r = (e: string) => elementBySym(e)?.radius ?? 0.7;
  for (let it = 0; it < iters; it++) {
    const f = p.map(() => [0, 0, 0]);
    for (let i = 0; i < p.length; i++)
      for (let j = i + 1; j < p.length; j++) {
        const d = [p[j][0] - p[i][0], p[j][1] - p[i][1], p[j][2] - p[i][2]];
        const l = Math.max(0.05, Math.hypot(...d));
        const rep = 0.25 / (l * l);
        for (let k = 0; k < 3; k++) { f[i][k] -= (d[k] / l) * rep; f[j][k] += (d[k] / l) * rep; }
      }
    for (const [i, j, o] of bonds) {
      const d = [p[j][0] - p[i][0], p[j][1] - p[i][1], p[j][2] - p[i][2]];
      const l = Math.max(0.05, Math.hypot(...d));
      const target = (r(atoms[i].el) + r(atoms[j].el)) * (o >= 2 ? 0.87 : 1);
      const s = 0.5 * (l - target);
      for (let k = 0; k < 3; k++) { f[i][k] += (d[k] / l) * s; f[j][k] -= (d[k] / l) * s; }
    }
    for (let i = 0; i < p.length; i++) for (let k = 0; k < 3; k++) p[i][k] += Math.max(-0.2, Math.min(0.2, f[i][k] * 0.5));
  }
  return atoms.map((a, i) => ({ ...a, xyz: p[i] }));
}

function MoleculeEditor() {
  const [atoms, setAtoms] = useState<EAtom[]>(START.atoms);
  const [bonds, setBonds] = useState<EBond[]>(START.bonds);
  const [sel, setSel] = useState<string | null>(null);
  const [bondMode, setBondMode] = useState<number | null>(null);
  const [msg, setMsg] = useState<string>('');
  const selIdx = sel?.startsWith('a') ? Number(sel.slice(1)) : null;
  const v = validateStructure(atoms, bonds);
  const formula = hillFormula(atoms);
  const match = MOLECULES.filter((m) => m.formula === formula && m.charge === 0);
  const commit = (a: EAtom[], b: EBond[]) => { setAtoms(relax(a, b)); setBonds(b); };
  const addAtom = (el: string) => {
    const base = selIdx !== null ? atoms[selIdx].xyz : [0, 0, 0];
    const na: EAtom = { el, xyz: [base[0] + (Math.random() - 0.5) * 1.5, base[1] + (Math.random() - 0.5) * 1.5, base[2] + (Math.random() - 0.5) * 1.5] };
    const a = [...atoms, na];
    const b = selIdx !== null ? [...bonds, [selIdx, a.length - 1, 1] as EBond] : bonds;
    commit(a, b);
    setSel(`a${a.length - 1}`);
    setMsg(selIdx !== null ? `${el} an Atom ${selIdx + 1} gebunden.` : `${el} hinzugefügt (ohne Bindung – zum Verbinden zuerst ein Atom auswählen).`);
  };
  const onSelect = (id: string | null) => {
    if (bondMode !== null && id?.startsWith('a') && selIdx !== null) {
      const j = Number(id.slice(1));
      if (j !== selIdx) {
        const existing = bonds.findIndex(([a, b]) => (a === selIdx && b === j) || (a === j && b === selIdx));
        const nb = [...bonds];
        if (existing >= 0) nb[existing] = [selIdx, j, bondMode];
        else nb.push([selIdx, j, bondMode]);
        commit(atoms, nb);
        setMsg(`${bondMode === 1 ? 'Einfach' : bondMode === 2 ? 'Doppel' : 'Dreifach'}bindung zwischen Atom ${selIdx + 1} und ${j + 1} gesetzt.`);
        setBondMode(null);
        setSel(id);
        return;
      }
    }
    setSel(id);
  };
  const removeAtom = () => {
    if (selIdx === null) return;
    const a = atoms.filter((_, i) => i !== selIdx);
    const b = bonds.filter(([x, y]) => x !== selIdx && y !== selIdx).map(([x, y, o]) => [x > selIdx ? x - 1 : x, y > selIdx ? y - 1 : y, o] as EBond);
    commit(a, b);
    setSel(null);
    setMsg('Atom entfernt.');
  };
  const removeBond = () => {
    if (selIdx === null) return;
    const b = bonds.filter(([x, y]) => x !== selIdx && y !== selIdx);
    commit(atoms, b);
    setMsg(`Alle Bindungen von Atom ${selIdx + 1} gelöst.`);
  };
  const fillH = () => {
    const a = [...atoms];
    const b = [...bonds];
    const ord = validateStructure(a, b).order;
    atoms.forEach((at, i) => {
      if (at.el === 'H') return;
      const el = elementBySym(at.el);
      if (!el) return;
      const target = el.valence.find((vv) => vv >= ord[i]) ?? el.valence[0];
      for (let k = ord[i]; k < target; k++) { a.push({ el: 'H', xyz: [at.xyz[0] + Math.random() - 0.5, at.xyz[1] + Math.random() - 0.5, at.xyz[2] + Math.random() - 0.5] }); b.push([i, a.length - 1, 1]); }
    });
    commit(a, b);
    setMsg('Freie Valenzen mit Wasserstoff aufgefüllt.');
  };
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="card">
          <div className="row">
            <span className="muted">{selIdx !== null ? `An Atom ${selIdx + 1} (${atoms[selIdx]?.el}) anfügen:` : 'Atom anfügen:'}</span>
            {['C', 'H', 'O', 'N', 'S', 'P', 'Cl'].map((e) => <button key={e} className="small" onClick={() => addAtom(e)}>{e}</button>)}
            <span style={{ flex: 1 }} />
            <button className="small" onClick={fillH}>Mit H auffüllen</button>
            <button className="small ghost" onClick={() => { setAtoms(START.atoms); setBonds(START.bonds); setSel(null); setMsg('Zurückgesetzt auf Methan.'); }}>⟲ Zurücksetzen</button>
          </div>
          {selIdx !== null ? (
            <div className="row" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
              <span className="muted">Atom {selIdx + 1}:</span>
              {[1, 2, 3].map((o) => <button key={o} className="small" aria-pressed={bondMode === o} onClick={() => { setBondMode(bondMode === o ? null : o); setMsg(`Jetzt das zweite Atom antippen, um eine ${o === 1 ? 'Einfach' : o === 2 ? 'Doppel' : 'Dreifach'}bindung zu setzen.`); }}>{o === 1 ? '— Einfach' : o === 2 ? '= Doppel' : '≡ Dreifach'}</button>)}
              <details className="menu">
                <summary aria-label="Weitere Aktionen für dieses Atom">⋯</summary>
                <div className="menu-pop">
                  <button className="small" onClick={removeBond}>Bindungen lösen</button>
                  <button className="small" onClick={removeAtom}>Atom löschen</button>
                </div>
              </details>
            </div>
          ) : <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>Tippe auf ein Atom, um daran anzubauen oder Bindungen zu setzen.</p>}
          {msg && <p aria-live="polite" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>{msg}</p>}
        </div>
        <ThreeViewer key={JSON.stringify(bonds) + atoms.length} build={(s) => buildMolecule(s, atoms, bonds, 'kugelstab')} selected={sel} onSelect={onSelect} ariaLabel="Moleküleditor" views={[{ name: 'Ansicht', pos: [0, 0, 9] }]} fallback={<p>Der Editor benötigt WebGL. Die Strukturprüfung rechts funktioniert trotzdem.</p>} />
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3>Strukturprüfung</h3>
          <p>Summenformel: <b className="mono">{toSub(formula) || '—'}</b></p>
          {v.valid ? <div className="notice ok">Valenzen und Zusammenhang sind plausibel.</div> : <div className="notice danger"><b>Nicht gültig:</b><ul>{v.issues.map((x) => <li key={x}>{x}</li>)}</ul></div>}
          {v.valid && match.length > 0 && <p>Gleiche Summenformel wie: {match.map((m) => m.name).join(', ')}.</p>}
          <details><summary>Wie wird geprüft?</summary><p className="muted" style={{ fontSize: '0.85rem' }}>Gleiche Summenformel kann verschiedene Isomere bedeuten – die Konstitution wird nicht verglichen. Die Prüfung beruht auf üblichen Bindigkeiten (z. B. C 4, N 3, O 2) und ist von der Darstellung getrennt: Eine optisch plausible Struktur gilt nicht automatisch als korrekt. Ladungen und hypervalente Sonderfälle werden nur eingeschränkt berücksichtigt.</p></details>
        </section>
        {selIdx !== null && atoms[selIdx] && <AtomDetails atoms={atoms} bonds={bonds} idx={selIdx} validated={false} />}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function AtomView() {
  const [p, setP] = useState(11);
  const [n, setN] = useState(12);
  const [e, setE] = useState(10);
  const el = elementByZ(p);
  const sh = shells(e);
  const charge = p - e;
  const stable = el?.stableN.includes(n);
  const Counter = ({ label, v, set, min, max }: { label: string; v: number; set: (x: number) => void; min: number; max: number }) => (
    <div className="field">
      <span className="lab"><b>{label}</b><span className="mono">{v}</span></span>
      <div className="row"><button className="small" onClick={() => set(Math.max(min, v - 1))} aria-label={`${label} verringern`}>−</button><input type="range" min={min} max={max} value={v} onChange={(x) => set(Number(x.target.value))} aria-label={label} style={{ flex: 1 }} /><button className="small" onClick={() => set(Math.min(max, v + 1))} aria-label={`${label} erhöhen`}>＋</button></div>
    </div>
  );
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="figure">
          <svg viewBox="0 0 400 300" role="img" aria-label={`Vereinfachtes Schalenmodell: ${p} Protonen, ${n} Neutronen, ${e} Elektronen in Schalen ${sh.join(', ')}`}>
            {sh.map((_, i) => <circle key={i} cx={200} cy={150} r={45 + i * 32} fill="none" stroke="var(--line)" strokeWidth={1.5} />)}
            {nucleons(p, n).map((kind, i) => { const a = i * 2.4; const r = 4 * Math.sqrt(i); return <circle key={i} cx={200 + Math.cos(a) * r} cy={150 + Math.sin(a) * r} r={5} fill={kind === 'p' ? '#c0504d' : '#8a8a8a'} stroke="#fff" strokeWidth={0.6} />; })}
            {sh.map((cnt, i) => Array.from({ length: cnt }).map((_, k) => { const a = (k / cnt) * Math.PI * 2 + i * 0.4; const r = 45 + i * 32; return <circle key={`${i}-${k}`} cx={200 + Math.cos(a) * r} cy={150 + Math.sin(a) * r} r={5} fill="#3c4fb0" />; }))}
          </svg>
        </div>
        <div className="row"><span className="badge"><span style={{ width: 10, height: 10, borderRadius: 5, background: '#c0504d', display: 'inline-block' }} /> Proton</span><span className="badge"><span style={{ width: 10, height: 10, borderRadius: 5, background: '#8a8a8a', display: 'inline-block' }} /> Neutron</span><span className="badge"><span style={{ width: 10, height: 10, borderRadius: 5, background: '#3c4fb0', display: 'inline-block' }} /> Elektron</span></div>
        <div className="notice">Vereinfachte Visualisierung: Elektronen bewegen sich nicht auf festen Bahnen. Das Schalenmodell beschreibt nur Energieniveaus; quantenmechanisch spricht man von Orbitalen (Aufenthaltswahrscheinlichkeiten). Kern nicht maßstabsgetreu.</div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3>Teilchen</h3>
          <Counter label="Protonen" v={p} set={setP} min={1} max={20} />
          <Counter label="Neutronen" v={n} set={setN} min={0} max={30} />
          <Counter label="Elektronen" v={e} set={setE} min={0} max={20} />
          <div className="row"><button className="small" onClick={() => { setP(11); setN(12); setE(11); }}>Na</button><button className="small" onClick={() => { setP(11); setN(12); setE(10); }}>Na⁺</button><button className="small" onClick={() => { setP(17); setN(18); setE(18); }}>Cl⁻</button><button className="small" onClick={() => { setP(6); setN(8); setE(6); }}>¹⁴C</button><button className="small" onClick={() => { setP(20); setN(20); setE(18); }}>Ca²⁺</button></div>
        </section>
        <section className="card">
          <h3>Ergebnis</h3>
          <table><tbody>
            <tr><td>Element (aus Protonenzahl)</td><td>{el ? `${el.name} (${el.sym})` : `Z = ${p} (nicht in der Lernauswahl)`}</td></tr>
            <tr><td>Ordnungszahl Z</td><td className="num">{p}</td></tr>
            <tr><td>Massenzahl A = Z + N</td><td className="num">{p + n}</td></tr>
            <tr><td>Isotop</td><td className="mono">{p + n}{el?.sym ?? ''}{stable ? ' (stabil/häufig)' : el ? ' (selten oder instabil)' : ''}</td></tr>
            <tr><td>Ladung</td><td className="num">{charge === 0 ? 'neutral' : `${charge > 0 ? '+' : '−'}${Math.abs(charge)}`}</td></tr>
            <tr><td>Schalenbesetzung</td><td className="mono">{sh.join(', ') || '—'}</td></tr>
            <tr><td>Valenzelektronen</td><td className="num">{sh[sh.length - 1] ?? 0}</td></tr>
          </tbody></table>
          <p className="muted" style={{ fontSize: '0.85rem' }}>{charge > 0 ? 'Kation: Elektronen abgegeben.' : charge < 0 ? 'Anion: Elektronen aufgenommen.' : 'Neutrales Atom.'} {(sh[sh.length - 1] === 8 || (sh.length === 1 && sh[0] === 2)) ? 'Edelgaskonfiguration erreicht.' : ''}</p>
        </section>
      </aside>
    </div>
  );
}

function nucleons(p: number, n: number): ('p' | 'n')[] {
  const out: ('p' | 'n')[] = [];
  let a = p, b = n;
  while (a || b) { if (a) { out.push('p'); a--; } if (b) { out.push('n'); b--; } }
  return out;
}

export function BondsView() {
  const [a, setA] = useState('O');
  const [b, setB] = useState('H');
  const r = classifyBond(a, b);
  const syms = ELEMENTS.filter((e) => e.en !== null).map((e) => e.sym);
  const VSEPR = [
    ['CH₄', '4 Bindungen, 0 freie Paare', 'tetraedrisch', '109,5°', 'methan'],
    ['NH₃', '3 Bindungen, 1 freies Paar', 'trigonal-pyramidal', '≈ 107°', 'ammoniak'],
    ['H₂O', '2 Bindungen, 2 freie Paare', 'gewinkelt', '≈ 104,5°', 'wasser'],
    ['CO₂', '2 Doppelbindungen', 'linear', '180°', 'kohlendioxid'],
  ];
  return (
    <div className="stack">
      <div className="grid cols-2">
        <div className="card">
          <h3>Bindungstyp aus der Elektronegativität</h3>
          <div className="row">
            <select value={a} onChange={(e) => setA(e.target.value)} aria-label="Erstes Element">{syms.map((s) => <option key={s}>{s}</option>)}</select>
            <span>–</span>
            <select value={b} onChange={(e) => setB(e.target.value)} aria-label="Zweites Element">{syms.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          {r && (
            <div style={{ marginTop: 12 }} aria-live="polite">
              <p>EN({a}) = {elementBySym(a)!.en}, EN({b}) = {elementBySym(b)!.en} → ΔEN = <b>{r.dEN.toFixed(2).replace('.', ',')}</b></p>
              <p className="kpi" style={{ fontSize: '1.2rem' }}>{r.cls}</p>
              {r.partialNegative && r.cls !== 'unpolar kovalent' && <p>Partielle negative Ladung (δ−) am {r.partialNegative}, δ+ am {r.partialNegative === a ? b : a}.</p>}
              <div className="meter" aria-hidden="true"><div style={{ width: `${Math.min(100, (r.dEN / 3.3) * 100)}%` }} /></div>
              <p className="muted" style={{ fontSize: '0.85rem', marginTop: 6 }}>Grenzen 0,4 und 1,7 sind Konventionen; der Übergang zwischen kovalent und ionisch ist fließend.</p>
            </div>
          )}
        </div>
        <div className="card">
          <h3>Zwischenmolekulare Kräfte (nach Stärke)</h3>
          <ol>
            <li><b>Ionenbindung / Ion-Ion</b> – z. B. NaCl im Kristall</li>
            <li><b>Ion-Dipol</b> – Hydrathülle um Na⁺ in Wasser</li>
            <li><b>Wasserstoffbrücken</b> – zwischen H₂O-Molekülen, Basenpaarung der DNA</li>
            <li><b>Dipol-Dipol</b></li>
            <li><b>Van-der-Waals (London)</b> – zwischen Fettsäureketten</li>
          </ol>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Die Reihenfolge gilt größenordnungsmäßig; die tatsächliche Stärke hängt von Abstand und Umgebung ab.</p>
        </div>
      </div>
      <div className="card">
        <h3>Molekülgeometrie (VSEPR)</h3>
        <table>
          <thead><tr><th>Molekül</th><th>Elektronenpaare am Zentralatom</th><th>Geometrie</th><th>Bindungswinkel</th><th /></tr></thead>
          <tbody>{VSEPR.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><a href={href('lektion', 'molekuele')} className="btn small">In 3D ansehen</a></td></tr>)}</tbody>
        </table>
        <p className="muted" style={{ fontSize: '0.85rem', marginTop: 8 }}>In der Molekülbibliothek lassen sich die Winkel durch Antippen des Zentralatoms ablesen (berechnete, energiearme Struktur).</p>
      </div>
    </div>
  );
}

export function AcidBaseView() {
  return <Workbench model={acidBaseModel} />;
}

// ---------------------------------------------------------------------------
export function MusclePhysioView() {
  return (
    <div className="stack">
      <div className="notice info">Zusammenhängende Kette: <a href={href('lektion', 'endplatte')}>Neuromuskuläre Übertragung</a> → Muskelaktionspotenzial → Ca²⁺-Freisetzung → Querbrückenzyklus → Kraft. Hier wird der mechanische Teil simuliert; die Endplatte ist als eigenes Modell verfügbar.</div>
      <EKKView initial={{ freq: 20, nStim: 10 }} />
    </div>
  );
}
export function CirculationView() {
  return <Workbench model={circulationModel} unit="s" msPerUnit={1000} />;
}
export function RespirationView() {
  return <Workbench model={respirationModel} />;
}
void muscleModel;
