import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { AxonStrip, ChannelPatch, Membrane2D, MechanismFigure, MuscleMacro, NeuronFigure, SarcomereFigure, SynapseFigure, type SynState } from '../../ui/figures';
import { StructureInfo, StructureList, StructurePanel, type PartInfo } from '../StructureInfo';
import { Workbench, type Playback } from '../../ui/Workbench';
import { hhModel, PHASE_LABEL, type APPhase } from '../../engine/hh';
import { conductionModel } from '../../engine/conduction';
import { nmjModel, pspModel, synapseModel } from '../../engine/synapse';
import { muscleModel } from '../../engine/muscle';
import { membraneModel, driveInfo, ION_NAME, ION_Z, type IonKey } from '../../engine/membrane';
import type { SimResult } from '../../engine/types';
import { ThreeViewer, mat, type ThreeItem } from '../../ui/ThreeViewer';
import { usePrefersReducedMotion, Splitter } from '../../ui/common';
import { MUSCLE_STRUCTURES, NEURO_STRUCTURES } from '../../content/neuro';
import { fmt } from '../../ui/Chart';

// ---------------------------------------------------------------------------
export function NeuronView() {
  const [sel, setSel] = useState<string | null>(null);
  const [isolate, setIsolate] = useState(false);
  const [labels, setLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const ids = ['dendrite', 'soma', 'nucleus', 'hillock', 'axon', 'myelin', 'ranvier', 'terminal'];
  const synIds = ['vesicle', 'premembrane', 'cleft', 'postmembrane', 'receptor'];
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="figure">
          <div className="toolbar no-print">
            <button className="small" aria-pressed={labels} onClick={() => setLabels((v) => !v)}>Beschriftung</button>
            <button className="small" aria-pressed={isolate} onClick={() => setIsolate((v) => !v)} disabled={!sel}>Nur Auswahl</button>
            <button className="small" onClick={() => setZoom((z) => (z >= 2.7 ? 1 : z * 1.4))} aria-label="Zoom">{zoom > 1 ? '⤢ Zoom ' + zoom.toFixed(1) + '×' : '＋ Zoom'}</button>
          </div>
          <NeuronFigure sel={sel} onSel={(id) => setSel((s) => (s === id ? null : id))} isolate={isolate} labels={labels} zoom={zoom} />
        </div>
        <details className="card">
          <summary>Synapse vergrößert ansehen</summary>
          <div className="figure" style={{ marginTop: 10 }}><SynapseFigure sel={sel} onSel={(id) => setSel((s) => (s === id ? null : id))} isolate={isolate} /></div>
        </details>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <StructurePanel ids={[...ids, ...synIds]} sel={sel} onSel={setSel} />
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Zellmembran 3D
// ---------------------------------------------------------------------------

export const MEMBRANE_PARTS: PartInfo[] = [
  { id: 'mem-head', name: 'Hydrophile Kopfgruppen', text: 'Phosphatgruppe und gebundene Alkohole (z. B. Cholin) sind polar bzw. geladen und zeigen zur wässrigen Umgebung auf beiden Seiten der Membran.', function: 'Grenzfläche zum Wasser; Ladungen und Zuckerreste beeinflussen Wechselwirkungen.', lessons: ['membran'] },
  { id: 'mem-tail', name: 'Hydrophobe Fettsäurereste', text: 'Die Kohlenwasserstoffketten bilden den etwa 3–4 nm dicken, wasserfreien Kern der Membran. cis-Doppelbindungen erzeugen Knicke und erhöhen die Fluidität.', function: 'Barriere für Ionen und polare Moleküle.', lessons: ['membran', 'molekuele'] },
  { id: 'ch-na', name: 'Spannungsabhängiger Na⁺-Kanal', text: 'Öffnet bei Depolarisation (Aktivierungstor) und inaktiviert kurz danach (Inaktivierungstor). Selektivitätsfilter für Na⁺.', function: 'Aufstrich des Aktionspotenzials.', lessons: ['aktionspotenzial'] },
  { id: 'ch-k', name: 'K⁺-Kanal', text: 'Kaliumkanäle sind in Ruhe teilweise offen (Leckkanäle); spannungsabhängige K⁺-Kanäle öffnen verzögert bei Depolarisation.', function: 'Ruhemembranpotenzial und Repolarisation.', lessons: ['ruhemembranpotenzial', 'aktionspotenzial'] },
  { id: 'pump', name: 'Na⁺/K⁺-ATPase', text: 'Primär aktive Pumpe: transportiert pro ATP 3 Na⁺ nach außen und 2 K⁺ nach innen.', function: 'Aufrechterhaltung der Ionengradienten; kleiner direkter elektrogener Beitrag.', lessons: ['ruhemembranpotenzial', 'stofftransport'] },
  { id: 'ion-na', name: 'Na⁺-Ionen', text: 'Außen hoch (Modell: 145 mmol/l), innen niedrig (12 mmol/l). Die Zahl der dargestellten Teilchen ist symbolisch.', lessons: ['ionen-gradienten'] },
  { id: 'ion-k', name: 'K⁺-Ionen', text: 'Innen hoch (Modell: 140 mmol/l), außen niedrig (4 mmol/l). Die Zahl der dargestellten Teilchen ist symbolisch.', lessons: ['ionen-gradienten'] },
  { id: 'o2', name: 'O₂ (frei diffundierend)', text: 'Kleine unpolare Moleküle wie O₂ und CO₂ diffundieren direkt durch die Lipidschicht.', lessons: ['membran', 'stofftransport'] },
];

export function MembraneView() {
  const [sel, setSel] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<'none' | 'na' | 'k'>('none');
  const openRef = useRef(open);
  openRef.current = open;
  const build = (scene: THREE.Scene): ThreeItem[] => {
    const heads = new THREE.Group();
    const tails = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.22, 14, 10);
    const tailGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6);
    const hm = mat(0xd39a60);
    const tm = mat(0xcfb57a);
    const N = 12;
    const proteins: [number, number][] = [[-1.5, 0], [1.5, 0.5], [0.3, -1.6]];
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = (i - N / 2) * 0.5 + 0.25;
        const z = (j - N / 2) * 0.5 + 0.25;
        if (proteins.some(([px, pz]) => Math.hypot(px - x, pz - z) < 0.7)) continue;
        for (const s of [1, -1]) {
          const h = new THREE.Mesh(headGeo, hm);
          h.position.set(x, s * 1.05, z);
          heads.add(h);
          for (const dx of [-0.07, 0.07]) {
            const t = new THREE.Mesh(tailGeo, tm);
            t.position.set(x + dx, s * 0.5, z);
            tails.add(t);
          }
        }
      }
    const mkChannel = (color: number, x: number, z: number) => {
      const g = new THREE.Group();
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2;
        const sub = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2.6, 12), mat(color));
        sub.position.set(x + Math.cos(a) * 0.25, 0, z + Math.sin(a) * 0.25);
        g.add(sub);
      }
      return g;
    };
    const na = mkChannel(0x2b7fa8, -1.5, 0);
    const k = mkChannel(0xb04a1e, 1.5, 0.5);
    const pump = new THREE.Group();
    const pm = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 1.6, 6, 12), mat(0x1e6b35));
    pm.position.set(0.3, 0, -1.6);
    pump.add(pm);
    const ionsNa = new THREE.Group();
    const ionsK = new THREE.Group();
    const o2 = new THREE.Group();
    const naM = mat(0x3c4fb0);
    const kM = mat(0xe08a3c);
    const rnd = (s: number) => ((Math.sin(s * 91.7) * 47453.5) % 1 + 1) % 1;
    for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), naM); m.position.set((rnd(i) - 0.5) * 6, 1.6 + rnd(i + 50) * 1.4, (rnd(i + 99) - 0.5) * 6); m.userData.home = m.position.clone(); ionsNa.add(m); }
    for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), naM); m.position.set((rnd(i + 7) - 0.5) * 6, -1.6 - rnd(i + 3) * 1.4, (rnd(i + 13) - 0.5) * 6); ionsNa.add(m); }
    for (let i = 0; i < 44; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), kM); m.position.set((rnd(i + 200) - 0.5) * 6, -1.6 - rnd(i + 250) * 1.4, (rnd(i + 299) - 0.5) * 6); m.userData.home = m.position.clone(); ionsK.add(m); }
    for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), kM); m.position.set((rnd(i + 17) - 0.5) * 6, 1.6 + rnd(i + 23) * 1.4, (rnd(i + 31) - 0.5) * 6); ionsK.add(m); }
    for (let i = 0; i < 4; i++) { const m = new THREE.Group(); const a = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mat(0xd23c3c)); const b = a.clone(); a.position.x = -0.1; b.position.x = 0.1; m.add(a, b); m.position.set(-2.8 + i * 1.8, 2.2, 2.4); m.userData.phase = i; o2.add(m); }
    scene.add(heads, tails, na, k, pump, ionsNa, ionsK, o2);
    return [
      { id: 'mem-head', label: 'Hydrophile Kopfgruppen', object: heads, selectable: true },
      { id: 'mem-tail', label: 'Hydrophobe Fettsäurereste', object: tails, selectable: true },
      { id: 'ch-na', label: 'Na⁺-Kanal', object: na, selectable: true },
      { id: 'ch-k', label: 'K⁺-Kanal', object: k, selectable: true },
      { id: 'pump', label: 'Na⁺/K⁺-ATPase', object: pump, selectable: true },
      { id: 'ion-na', label: 'Na⁺-Ionen', object: ionsNa, selectable: true },
      { id: 'ion-k', label: 'K⁺-Ionen', object: ionsK, selectable: true },
      { id: 'o2', label: 'O₂', object: o2, selectable: true },
    ];
  };
  const animate = (t: number, items: ThreeItem[]) => {
    const o2 = items.find((i) => i.id === 'o2')!.object;
    o2.children.forEach((m) => { const ph = (t * 0.25 + m.userData.phase * 0.25) % 1; m.position.y = 2.4 - ph * 4.8; });
    const which = openRef.current;
    const ions = items.find((i) => i.id === (which === 'na' ? 'ion-na' : 'ion-k'))?.object;
    if (which !== 'none' && ions) {
      const target = which === 'na' ? new THREE.Vector3(-1.5, 0, 0) : new THREE.Vector3(1.5, 0, 0.5);
      ions.children.slice(0, 8).forEach((m, i) => {
        const ph = (t * 0.3 + i / 8) % 1;
        const from = which === 'na' ? 2.4 : -2.4;
        m.position.set(target.x + Math.sin(i) * 0.08, from - Math.sign(from) * ph * 4.8, target.z + Math.cos(i) * 0.08);
      });
    }
  };
  return (
    <div className="workspace">
      <div className="main-area stack">
        <ThreeViewer build={build} animate={animate} selected={sel} onSelect={setSel} hidden={hidden} ariaLabel="3D-Modell der Zellmembran"
          views={[{ name: 'Schräg', pos: [6, 4, 7] }, { name: 'Seitlich', pos: [0, 0, 10] }, { name: 'Von oben', pos: [0, 10, 0.01] }]}
          fallback={<Membrane2D sel={sel} onSel={(id) => setSel((s) => (s === id ? null : id))} />} deps={[]} />
        <div className="card">
          <h3>Kanal öffnen</h3>
          <p className="muted">Vereinfachtes Modell: Beim Öffnen fließen Ionen entlang ihrer elektrochemischen Triebkraft (in Ruhe: Na⁺ einwärts, K⁺ auswärts). Die Teilchenzahl ist symbolisch.</p>
          <div className="row">
            <button aria-pressed={open === 'none'} onClick={() => setOpen('none')}>Kanäle geschlossen</button>
            <button aria-pressed={open === 'na'} onClick={() => setOpen('na')}>Na⁺-Kanal öffnen</button>
            <button aria-pressed={open === 'k'} onClick={() => setOpen('k')}>K⁺-Kanal öffnen</button>
          </div>
          <p style={{ marginTop: 10 }} aria-live="polite">{open === 'na' ? 'Na⁺ strömt ein: Konzentrationsgradient und elektrische Kraft wirken beide nach innen.' : open === 'k' ? 'K⁺ strömt aus: Der Konzentrationsgradient (auswärts) überwiegt die elektrische Kraft (einwärts).' : 'Die Lipiddoppelschicht ist für Ionen praktisch undurchlässig. O₂ diffundiert dagegen direkt hindurch.'}</p>
        </div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <StructurePanel ids={MEMBRANE_PARTS.map((p) => p.id)} parts={MEMBRANE_PARTS} sel={sel} onSel={setSel} hidden={hidden} onToggleHidden={(id) => setHidden((h) => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; })} />
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ionen und Triebkräfte
// ---------------------------------------------------------------------------

const DEFAULT_CONC: Record<IonKey, [number, number]> = { Na: [145, 12], K: [4, 140], Ca: [1.2, 0.0001], Cl: [110, 7] };

export function DriveDiagram({ ion, cOut, cIn, vm }: { ion: IonKey; cOut: number; cIn: number; vm: number }) {
  const d = driveInfo(ion, cOut, cIn, vm, 37);
  const arrow = (x: number, dir: string, color: string, label: string, dash?: string) => {
    if (dir === 'keine' || dir === 'kein Nettostrom') return <text x={x} y={110} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--ink-2)">{label}: keine</text>;
    const down = dir === 'einwärts';
    return (
      <g>
        <line x1={x} x2={x} y1={down ? 40 : 170} y2={down ? 160 : 50} stroke={color} strokeWidth={5} strokeDasharray={dash} />
        <path d={down ? `M${x - 12},150 L${x},172 L${x + 12},150 Z` : `M${x - 12},60 L${x},38 L${x + 12},60 Z`} fill={color} />
        <text x={x} y={200} textAnchor="middle" style={{ fontSize: 12 }} fill="var(--ink)">{label}</text>
        <text x={x} y={216} textAnchor="middle" style={{ fontSize: 11 }} fill="var(--ink-2)">{dir}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 520 230" role="img" aria-label={`${ION_NAME[ion]}: Konzentrationsgradient ${d.concDirection}, elektrische Kraft ${d.electricDirection}, Nettotriebkraft ${d.netDirection}. E = ${d.E.toFixed(1)} mV, V_m − E = ${d.drivingForce.toFixed(1)} mV.`}>
      <rect x={0} y={95} width={520} height={30} fill="#efe3c6" />
      <text x={8} y={20} style={{ fontSize: 12 }} fill="var(--ink-2)">außen: {fmt(cOut)} mmol/l</text>
      <text x={8} y={88} style={{ fontSize: 11 }} fill="var(--ink-3)">+ + + + (außen relativ positiv bei V_m &lt; 0)</text>
      <text x={8} y={140} style={{ fontSize: 11 }} fill="var(--ink-3)">− − − − innen</text>
      <text x={8} y={226} style={{ fontSize: 12 }} fill="var(--ink-2)">innen: {fmt(cIn)} mmol/l</text>
      {arrow(220, d.concDirection, '#7a5a00', 'Konzentration', '8 4')}
      {arrow(330, d.electricDirection, '#3c4fb0', 'Elektrisch', '2 4')}
      {arrow(440, d.netDirection, '#0f6e6a', 'Netto (elektrochemisch)')}
    </svg>
  );
}

export function IonsView() {
  const [ion, setIon] = useState<IonKey>('K');
  const [vm, setVm] = useState(-70);
  const [conc, setConc] = useState(DEFAULT_CONC);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);
  const [cOut, cIn] = conc[ion];
  const d = driveInfo(ion, cOut, cIn, vm, 37);
  useEffect(() => {
    if (!open || reduced) return;
    let raf = 0;
    const loop = () => { setTick((t) => t + 1); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [open, reduced]);
  const flowing = open && d.netDirection !== 'kein Nettostrom';
  const speed = Math.min(1, Math.abs(d.drivingForce) / 80);
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="card">
          <div className="row" role="radiogroup" aria-label="Ion auswählen">
            {(['Na', 'K', 'Ca', 'Cl'] as IonKey[]).map((k) => <button key={k} role="radio" aria-checked={ion === k} aria-pressed={ion === k} onClick={() => { setIon(k); setOpen(false); }}>{ION_NAME[k]}</button>)}
          </div>
          <div className="figure" style={{ marginTop: 12 }}><DriveDiagram ion={ion} cOut={cOut} cIn={cIn} vm={vm} /></div>
        </div>
        <div className="card">
          <h3>Kanal für {ION_NAME[ion]} öffnen</h3>
          <div className="row"><button className="primary" onClick={() => setOpen((o) => !o)}>{open ? 'Kanal schließen' : 'Kanal öffnen'}</button></div>
          <svg viewBox="0 0 520 160" style={{ marginTop: 10 }} role="img" aria-label={flowing ? `${ION_NAME[ion]} fließt netto ${d.netDirection}.` : open ? 'Kein Nettofluss: Das Membranpotenzial entspricht dem Gleichgewichtspotenzial.' : 'Kanal geschlossen.'}>
            <rect x={0} y={65} width={520} height={30} fill="#efe3c6" />
            <rect x={240} y={60} width={40} height={40} fill={open ? 'var(--accent-soft)' : '#8a7a5a'} stroke="var(--ink-3)" />
            {Array.from({ length: 8 }).map((_, i) => {
              const ph = reduced ? i / 8 : ((tick * 0.01 * (0.3 + speed) + i / 8) % 1);
              const down = d.netDirection === 'einwärts';
              const y = flowing ? (down ? 10 + ph * 140 : 150 - ph * 140) : (i % 2 ? 30 : 130);
              const x = flowing ? 260 + Math.sin(i * 2) * 8 : 60 + i * 55;
              return <circle key={i} cx={x} cy={y} r={7} fill={ION_Z[ion] > 0 ? '#3c4fb0' : '#1e6b35'} />;
            })}
            <text x={8} y={20} style={{ fontSize: 11 }} fill="var(--ink-3)">außen</text>
            <text x={8} y={150} style={{ fontSize: 11 }} fill="var(--ink-3)">innen</text>
          </svg>
          <p aria-live="polite">
            {!open ? 'Ohne offenen Kanal fließt kein Strom – auch wenn eine Triebkraft besteht.' : flowing ? `${ION_NAME[ion]} fließt netto ${d.netDirection}, weil V_m − E = ${d.drivingForce.toFixed(1)} mV ≠ 0. Dieser Strom würde V_m in Richtung E_${ion} (${d.E.toFixed(1)} mV) verschieben.` : `Kein Nettofluss: V_m entspricht E_${ion}. Chemische und elektrische Kraft heben sich auf.`}
          </p>
        </div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3>Parameter (Modellwerte)</h3>
          <div className="field">
            <div className="lab"><label htmlFor="vm"><b>Membranpotenzial V_m</b></label><span>{vm} mV</span></div>
            <input id="vm" type="range" min={-100} max={60} value={vm} onChange={(e) => setVm(Number(e.target.value))} />
          </div>
          <div className="field">
            <div className="lab"><label htmlFor="co"><b>[{ION_NAME[ion]}] außen</b></label><span>{fmt(cOut)} mmol/l</span></div>
            <input id="co" type="range" min={Math.log10(ion === 'Ca' ? 0.1 : 1)} max={Math.log10(200)} step={0.01} value={Math.log10(cOut)} onChange={(e) => setConc((c) => ({ ...c, [ion]: [Number((10 ** Number(e.target.value)).toPrecision(3)), c[ion][1]] }))} />
          </div>
          <div className="field">
            <div className="lab"><label htmlFor="ci"><b>[{ION_NAME[ion]}] innen</b></label><span>{fmt(cIn)} mmol/l</span></div>
            <input id="ci" type="range" min={Math.log10(ion === 'Ca' ? 0.00001 : 1)} max={Math.log10(200)} step={0.01} value={Math.log10(cIn)} onChange={(e) => setConc((c) => ({ ...c, [ion]: [c[ion][0], Number((10 ** Number(e.target.value)).toPrecision(3))] }))} />
          </div>
          <button className="small" onClick={() => { setConc(DEFAULT_CONC); setVm(-70); }}>⟲ Zurücksetzen</button>
          <p className="hint muted" style={{ marginTop: 8 }}>Typische Werte einer Säugerzelle – nicht für alle Zelltypen gleich.</p>
        </section>
        <section className="card">
          <h3>Ergebnis</h3>
          <table><tbody>
            <tr><td>Gleichgewichtspotenzial E_{ion} (37 °C)</td><td className="num">{d.E.toFixed(1)} mV</td></tr>
            <tr><td>Triebkraft V_m − E</td><td className="num">{d.drivingForce.toFixed(1)} mV</td></tr>
            <tr><td>Nettotriebkraft</td><td className="num">{d.netDirection}</td></tr>
          </tbody></table>
          <div className="eq">E = (R·T)/(z·F) · ln([X]ₐ/[X]ᵢ)</div>
        </section>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RmpView() {
  return (
    <Workbench model={membraneModel} side={(r, p) => (
      <section className="card">
        <h3>Kräfte auf die Ionen beim berechneten V_m</h3>
        {(['Na', 'K', 'Cl'] as IonKey[]).map((ion) => {
          const d = driveInfo(ion, p[`${ion}o`] as number, p[`${ion}i`] as number, r.scalars.vm.value as number, p.T as number);
          return <p key={ion} style={{ fontSize: '0.9rem' }}><b>{ION_NAME[ion]}:</b> Konzentration {d.concDirection}, elektrisch {d.electricDirection} → netto <b>{d.netDirection}</b> (V_m − E = {d.drivingForce.toFixed(1)} mV)</p>;
        })}
        <p className="muted" style={{ fontSize: '0.85rem' }}>Im Ruhezustand fließen Na⁺ ein und K⁺ aus – nur die Summe aller Ströme ist null. Die Na⁺/K⁺-ATPase gleicht diese Flüsse langfristig aus.</p>
      </section>
    )} />
  );
}

// ---------------------------------------------------------------------------
const AP_PHASE_TEXT: Record<APPhase, string> = {
  ruhe: 'Ruhe: Na⁺-Kanäle sind geschlossen, aber aktivierbar (h hoch). Einige K⁺-Kanäle sind offen; das Potenzial liegt nahe E_K.',
  reiz: 'Ein Reizstrom depolarisiert die Membran. Einige Na⁺-Kanäle öffnen (m steigt), aber noch überwiegen die repolarisierenden Ströme.',
  aufstrich: 'Positive Rückkopplung: Der Na⁺-Einstrom übersteigt die repolarisierenden Ströme – jede weitere Depolarisation öffnet weitere Na⁺-Kanäle.',
  overshoot: 'Das Innere ist positiv. V_m nähert sich E_Na, erreicht es aber nicht, weil die Na⁺-Kanäle inaktivieren und K⁺-Kanäle öffnen.',
  repolarisation: 'Das Inaktivierungstor (h) hat die Na⁺-Kanäle geschlossen; die verzögert geöffneten K⁺-Kanäle lassen K⁺ ausströmen.',
  nachhyperpolarisation: 'Die K⁺-Kanäle schließen langsam; V_m liegt vorübergehend näher an E_K als in Ruhe. Na⁺-Kanäle erholen sich (relative Refraktärität).',
  rueckkehr: 'Die Gating-Variablen kehren zu ihren Ruhewerten zurück; die Membran ist wieder voll erregbar.',
};

export function APView() {
  return (
    <Workbench model={hhModel} msPerUnit={350}
      visual={(r: SimResult, pb: Playback) => {
        const f = r.frames!.data as Record<string, number[]>;
        const i = pb.idx;
        const t = r.frames!.t[i];
        const ph = r.phases?.find((p) => t >= p.from && t <= p.to);
        return (
          <div className="grid cols-2">
            <div className="figure"><ChannelPatch V={f.V[i]} m={f.m[i]} h={f.h[i]} n={f.n[i]} INa={f.INa[i]} IK={f.IK[i]} /></div>
            <div className="card" aria-live="polite">
              <div className="badge accent">{ph ? PHASE_LABEL[ph.id as APPhase] : '—'}</div>
              <p style={{ marginTop: 10 }}>{ph ? AP_PHASE_TEXT[ph.id as APPhase] : ''}</p>
              <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 0 }}>V_m = {fmt(f.V[i], 1)} mV{f.Istim[i] ? ' · Reiz aktiv' : ''}</p>
            </div>
          </div>
        );
      }} />
  );
}

// ---------------------------------------------------------------------------
export function ConductionView() {
  return (
    <Workbench model={conductionModel} msPerUnit={400}
      visual={(r, pb, p) => {
        const d = r.frames!.data as any;
        return (
          <div className="card">
            <h3>Erregungsausbreitung entlang des Axons</h3>
            <div className="figure"><AxonStrip V={d.Vgrid[pb.idx]} active={d.active} damaged={d.damaged} spacing={p.spacing as number} probes={undefined} /></div>
            <p className="muted" style={{ fontSize: '0.88rem', marginTop: 8 }}>{p.myelin ? 'Schmale Abschnitte = Ranvier-Schnürringe mit Na⁺-Kanälen; helle Bänder = Myelin. Die Erregung wird an jedem Schnürring regenerativ erneuert – der Strom fließt dazwischen im Axoninneren, nicht durch den Extrazellulärraum.' : 'Ohne Myelin wird jeder Membranabschnitt nacheinander erregt (kontinuierliche Leitung).'}</p>
          </div>
        );
      }} />
  );
}

// ---------------------------------------------------------------------------
const SYN_STEPS = ['Aktionspotenzial erreicht die Endigung', 'Spannungsabhängige Ca²⁺-Kanäle öffnen', 'Ca²⁺ strömt ein', 'Ca²⁺ löst Vesikelfusion aus', 'Exozytose des Transmitters', 'Diffusion durch den Spalt', 'Bindung an Rezeptoren', 'Postsynaptische Antwort', 'Signalbeendigung'];
const NMJ_STEPS = ['Motorisches AP erreicht die Nervenendigung', 'Ca²⁺-Kanäle werden aktiviert', 'Ca²⁺ löst ACh-Freisetzung aus', 'ACh bindet an nikotinische Rezeptoren', 'Endplattenpotenzial entsteht', 'Schwelle erreicht → Muskelaktionspotenzial', 'Ausbreitung über das Sarkolemm', 'Übertragung ins T-Tubulus-System'];

function synStep(f: Record<string, number[]>, i: number, nmj: boolean, thr: number, EL: number) {
  const t = f;
  const Tmax = Math.max(...t.T);
  const Tpeak = t.T.indexOf(Tmax);
  if (nmj) {
    if (t.V[i] >= thr) return 5 + (i > t.V.findIndex((v) => v >= thr) + 15 ? 2 : i > t.V.findIndex((v) => v >= thr) + 5 ? 1 : 0);
    if (t.V[i] - EL > 1) return 4;
    if (t.R[i] > 0.02) return 3;
    if (t.rel[i] > 0.5) return 2;
    if (t.mCa[i] > 0.1) return 1;
    if (t.vPre[i] > -50) return 0;
    return -1;
  }
  if (i > Tpeak && t.T[i] < 0.5 * Tmax) return 8;
  if (Math.abs(t.V[i] - EL) > 0.3) return 7;
  if (t.R[i] > 0.01) return 6;
  if (t.T[i] > 0.02 * Tmax && Tmax > 0) return 5;
  if (t.rel[i] > 0.05) return 4;
  if (t.Ca[i] > 1) return 3;
  if (t.mCa[i] > 0.1) return 1;
  if (t.vPre[i] > -50) return 0;
  return -1;
}

function SynapseAnimated({ r, pb, nmj, kind }: { r: SimResult; pb: Playback; nmj: boolean; kind: SynState['kind'] }) {
  const f = r.frames!.data as Record<string, number[]>;
  const i = pb.idx;
  const caMax = Math.max(...f.Ca, 1e-9);
  const tMax = Math.max(...f.T, 1e-9);
  const relMax = Math.max(f.rel[f.rel.length - 1], 1e-9);
  const state: SynState = { vPre: f.vPre[i], mCa: f.mCa[i], Ca: f.Ca[i] / caMax, released: f.rel[i] / relMax, T: f.T[i] / tMax, R: f.R[i], V: f.V[i], kind };
  const thr = nmj ? -55 : -50;
  const EL = nmj ? -85 : -70;
  const step = synStep(f, i, nmj, thr, EL);
  const steps = nmj ? NMJ_STEPS : SYN_STEPS;
  return (
    <div className="grid cols-2">
      <div className="figure"><SynapseFigure sel={null} state={state} nmj={nmj} /></div>
      <div className="card">
        <h3>Ablauf</h3>
        <ol className="steps" aria-live="polite">
          {steps.map((s, k) => <li key={s} className={k === step ? 'active' : k < step ? 'done' : ''}>{s}</li>)}
        </ol>
        {nmj && step >= 5 && <p className="muted" style={{ fontSize: '0.85rem' }}>Ausbreitung und T-Tubulus: siehe Erregungs-Kontraktions-Kopplung.</p>}
      </div>
    </div>
  );
}

export function SynapseView() {
  return <Workbench model={synapseModel} msPerUnit={600} visual={(r, pb, p) => <SynapseAnimated r={r} pb={pb} nmj={false} kind={p.tr as any} />} />;
}
export function NMJView() {
  return <Workbench model={nmjModel} msPerUnit={600} visual={(r, pb) => <SynapseAnimated r={r} pb={pb} nmj kind="ach_nmj" />} />;
}
export function PSPView() {
  return <Workbench model={pspModel} />;
}

// ---------------------------------------------------------------------------
export function EKKView({ initial }: { initial?: Record<string, any> }) {
  const [level, setLevel] = useState<'makro' | 'mikro' | 'mechanismus'>('mechanismus');
  const [sel, setSel] = useState<string | null>(null);
  const init = useMemo(() => initial ?? {}, [initial]);
  return (
    <div className="stack">
      <div className="card">
        <div className="tabs" role="tablist" aria-label="Darstellungsebene">
          {([['makro', 'Muskel'], ['mikro', 'Sarkomer'], ['mechanismus', 'Ca²⁺ und Querbrücken']] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={level === k} onClick={() => setLevel(k)}>{l}</button>
          ))}
        </div>
        {sel && <StructureInfo id={sel} onSelect={setSel} />}
        {level === 'mikro' && <div style={{ marginTop: 10 }}><StructureList ids={MUSCLE_STRUCTURES.map((x) => x.id)} sel={sel} onSel={setSel} /></div>}
      </div>
      <Workbench model={muscleModel} initial={init} msPerUnit={20}
        visual={(r, pb, p) => {
          const f = r.frames!.data as Record<string, number[]>;
          const i = pb.idx;
          return (
            <div className="figure">
              {level === 'makro' && <MuscleMacro />}
              {level === 'mikro' && <SarcomereFigure force={f.F[i]} sel={sel} onSel={(id) => setSel((s) => (s === id ? null : id))} />}
              {level === 'mechanismus' && <MechanismFigure ca={f.Ca[i]} act={f.act[i]} atp={p.atp as number} attached={f.A[i]} />}
            </div>
          );
        }} />
    </div>
  );
}

void NEURO_STRUCTURES;
