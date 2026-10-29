import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { ThreeViewer, mat, type ThreeItem } from '../../ui/ThreeViewer';
import { StructureInfo, StructureList, StructurePanel } from '../StructureInfo';
import { Struct } from '../../ui/figures';
import { Workbench } from '../../ui/Workbench';
import { enzymeModel, osmosisModel, transportModel } from '../../engine/cell';
import { AA_NAMES, cleanDNA, complement, ENERGY_STATIONS, glucoseYield, transcribeFromCoding, translate } from '../../engine/biochem';
import { CELL_STRUCTURES } from '../../content/cell';
import { Splitter } from '../../ui/common';

const CELL_IDS = CELL_STRUCTURES.map((s) => s.id);

function Cell2D({ sel, onSel, hidden }: { sel: string | null; onSel: (id: string) => void; hidden: Set<string> }) {
  const h = (id: string) => hidden.has(id);
  const S = (id: string, el: JSX.Element) => (h(id) ? null : <Struct id={id} sel={sel} onSel={(x) => onSel(x)}>{el}</Struct>);
  return (
    <div className="figure">
      <svg viewBox="0 0 600 400" role="group" aria-label="Eukaryotische Zelle (2D-Darstellung)">
        {S('c-membran', <ellipse className="hit" cx={300} cy={200} rx={280} ry={185} fill="#f7efe2" stroke="#b9774a" strokeWidth={4} />)}
        {S('c-zytoplasma', <ellipse className="hit" cx={300} cy={200} rx={270} ry={175} fill="none" stroke="transparent" strokeWidth={10} />)}
        {S('c-kern', <circle className="hit" cx={290} cy={190} r={72} fill="#cdb7de" stroke="#6b4381" strokeWidth={3} />)}
        {S('c-nukleolus', <circle className="hit" cx={305} cy={180} r={20} fill="#6b4381" />)}
        {S('c-rer', <path className="hit" d="M210,110 C180,140 180,240 210,270 M195,100 C160,140 160,240 195,285" fill="none" stroke="#3c4fb0" strokeWidth={8} strokeDasharray="1 8" strokeLinecap="round" />)}
        {S('c-ser', <path className="hit" d="M120,260 C140,240 160,280 180,260 C200,240 210,290 230,300" fill="none" stroke="#5a7fb0" strokeWidth={8} />)}
        {S('c-golgi', <g>{[0, 1, 2, 3].map((k) => <path key={k} className="hit" d={`M${400 + k * 10},${130 + k * 8} C${440 + k * 10},${110 + k * 8} ${470},${140 + k * 8} ${480},${170 + k * 8}`} fill="none" stroke="#c49040" strokeWidth={7} strokeLinecap="round" />)}</g>)}
        {S('c-mito', <g>{[[460, 270], [150, 140], [380, 320]].map(([x, y]) => <g key={x}><ellipse className="hit" cx={x} cy={y} rx={38} ry={18} fill="#f2c27b" stroke="#a06a20" strokeWidth={2} /><path d={`M${x - 28},${y} q8,-12 16,0 t16,0 t16,0`} fill="none" stroke="#a06a20" /></g>)}</g>)}
        {S('c-lysosom', <g>{[[520, 200], [110, 200]].map(([x, y]) => <circle key={x} className="hit" cx={x} cy={y} r={14} fill="#d5747f" stroke="#8a3a44" strokeWidth={2} />)}</g>)}
        {S('c-peroxisom', <circle className="hit" cx={230} cy={330} r={12} fill="#9ccf8a" stroke="#4a7a3a" strokeWidth={2} />)}
        {S('c-ribosom', <g>{Array.from({ length: 16 }).map((_, i) => <circle key={i} className="hit" cx={120 + ((i * 53) % 400)} cy={80 + ((i * 37) % 260)} r={3.5} fill="#333" />)}</g>)}
        {S('c-vesikel', <g>{[[490, 120], [510, 150], [440, 80]].map(([x, y]) => <circle key={x} className="hit" cx={x} cy={y} r={9} fill="#fff" stroke="#c49040" strokeWidth={2} />)}</g>)}
        {S('c-zytoskelett', <path className="hit" d="M60,200 L540,200 M300,30 L300,370 M100,90 L500,320" stroke="#7a8a7a" strokeWidth={1.5} strokeDasharray="6 4" fill="none" />)}
      </svg>
    </div>
  );
}

export function CellView() {
  const [sel, setSel] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const build = (scene: THREE.Scene): ThreeItem[] => {
    const items: ThreeItem[] = [];
    const add = (id: string, label: string, obj: THREE.Object3D) => { scene.add(obj); items.push({ id, label, object: obj, selectable: true }); };
    const memb = new THREE.Mesh(new THREE.SphereGeometry(5, 48, 32), mat(0xf0d9b5, { transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }));
    add('c-membran', 'Zellmembran', memb);
    const cyto = new THREE.Mesh(new THREE.SphereGeometry(4.85, 24, 16), mat(0xfaf3e6, { transparent: true, opacity: 0.05, depthWrite: false }));
    add('c-zytoplasma', 'Zytoplasma', cyto);
    const nuc = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24), mat(0xb39bcc, { transparent: true, opacity: 0.85 }));
    add('c-kern', 'Zellkern', nuc);
    const nucl = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), mat(0x5b3270));
    nucl.position.set(0.4, 0.3, 0.6);
    add('c-nukleolus', 'Nukleolus', nucl);
    const rer = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const t = new THREE.Mesh(new THREE.TorusGeometry(2.1 + k * 0.32, 0.07, 8, 60, Math.PI * 1.1), mat(0x3c4fb0));
      t.rotation.set(Math.PI / 2, 0, Math.PI * 0.6);
      rer.add(t);
      for (let r = 0; r < 26; r++) {
        const a = (r / 26) * Math.PI * 1.1;
        const rib = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), mat(0x222222));
        rib.position.set(Math.cos(a + Math.PI * 0.6) * (2.1 + k * 0.32), 0.09, Math.sin(a + Math.PI * 0.6) * (2.1 + k * 0.32));
        rer.add(rib);
      }
    }
    add('c-rer', 'Raues ER', rer);
    const ser = new THREE.Group();
    for (let k = 0; k < 5; k++) { const tube = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 8, 20), mat(0x5a7fb0)); tube.position.set(-3 + k * 0.35, -1.8 + Math.sin(k) * 0.3, 1.2); tube.rotation.set(k, k * 0.5, 0); ser.add(tube); }
    add('c-ser', 'Glattes ER', ser);
    const golgi = new THREE.Group();
    for (let k = 0; k < 5; k++) { const c = new THREE.Mesh(new THREE.TorusGeometry(0.9 - k * 0.08, 0.1, 8, 30, Math.PI * 0.9), mat(0xc49040)); c.position.set(2.6, 1.2 - k * 0.25, -0.8); c.rotation.set(Math.PI / 2, 0, 0.5); golgi.add(c); }
    add('c-golgi', 'Golgi-Apparat', golgi);
    const mito = new THREE.Group();
    for (const [x, y, z, r] of [[-2.8, 1.5, -1, 0.3], [2.5, -1.8, 1.6, 1.2], [-1, -2.8, -1.8, 2.1]]) { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 1.0, 6, 14), mat(0xf2a541)); m.position.set(x, y, z); m.rotation.set(r, r * 0.7, 0.4); mito.add(m); }
    add('c-mito', 'Mitochondrien', mito);
    const lyso = new THREE.Group();
    for (const [x, y, z] of [[3.3, 0.2, 1.5], [-3.4, -0.5, 1.8]]) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), mat(0xd5747f)); m.position.set(x, y, z); lyso.add(m); }
    add('c-lysosom', 'Lysosomen', lyso);
    const per = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 10), mat(0x9ccf8a));
    per.position.set(-2.2, 2.6, 1.5);
    add('c-peroxisom', 'Peroxisom', per);
    const ribo = new THREE.Group();
    for (let i = 0; i < 70; i++) { const r = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 4), mat(0x333333)); const a = i * 2.4; const rr = 2.5 + (i % 7) * 0.3; r.position.set(Math.cos(a) * rr, Math.sin(i * 1.3) * 3, Math.sin(a) * rr); ribo.add(r); }
    add('c-ribosom', 'Freie Ribosomen', ribo);
    const ves = new THREE.Group();
    for (const [x, y, z] of [[3.4, 1.8, -0.2], [3.9, 0.9, -1.0], [2.0, 2.5, -1.6]]) { const v = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mat(0xffffff)); v.position.set(x, y, z); ves.add(v); }
    add('c-vesikel', 'Vesikel', ves);
    const cs = new THREE.Group();
    for (let i = 0; i < 10; i++) { const a = new THREE.Vector3(Math.sin(i) * 4.5, Math.cos(i * 1.7) * 4.5, Math.sin(i * 2.3) * 3).clampLength(0, 4.6); const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, a.length(), 4), mat(0x7a8a7a)); tube.position.copy(a.clone().multiplyScalar(0.5)); tube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), a.clone().normalize()); cs.add(tube); }
    add('c-zytoskelett', 'Zytoskelett (Mikrotubuli, schematisch)', cs);
    return items;
  };
  return (
    <div className="workspace">
      <div className="main-area stack">
        <ThreeViewer build={build} selected={sel} onSelect={setSel} hidden={hidden} ariaLabel="3D-Modell einer eukaryotischen Zelle (schematisch, nicht maßstabsgetreu)"
          views={[{ name: 'Übersicht', pos: [9, 6, 11] }, { name: 'Vorne', pos: [0, 0, 14] }, { name: 'Oben', pos: [0, 14, 0.01] }]}
          fallback={<Cell2D sel={sel} onSel={(id) => setSel((s) => (s === id ? null : id))} hidden={hidden} />} />
        <p className="muted">Schematisches Modell: Größen und Anzahlen sind nicht maßstabsgetreu. Tipp: Zellmembran ausblenden, um das Innere besser zu sehen.</p>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <StructurePanel ids={CELL_IDS} sel={sel} onSel={setSel} hidden={hidden} onToggleHidden={(id) => setHidden((h) => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; })} />
      </aside>
    </div>
  );
}

export function TransportView() {
  const [tab, setTab] = useState<'t' | 'o'>('t');
  return (
    <div className="stack">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 't'} onClick={() => setTab('t')}>Transportmechanismen</button>
        <button role="tab" aria-selected={tab === 'o'} onClick={() => setTab('o')}>Osmose</button>
      </div>
      {tab === 't' ? <Workbench model={transportModel} /> : <Workbench model={osmosisModel} />}
    </div>
  );
}
export function OsmosisView() {
  return <Workbench model={osmosisModel} />;
}
export function EnzymeView() {
  return <Workbench model={enzymeModel} />;
}

// ---------------------------------------------------------------------------
const DNA_PRESETS = [
  { name: 'Kurzes Lehrbeispiel', seq: 'ATGGCCTGGAAATTCGGCTAA' },
  { name: 'Mit Leserahmen-Verschiebung prüfen', seq: 'CCATGAAACCCGGGTTTTAGAA' },
  { name: 'Ohne Stoppcodon', seq: 'ATGGGCGGCGGC' },
];

export function ProteinView() {
  const [input, setInput] = useState(DNA_PRESETS[0].seq);
  const [step, setStep] = useState(0);
  const { seq, invalid } = cleanDNA(input);
  const mrna = transcribeFromCoding(seq);
  const tr = useMemo(() => translate(mrna), [mrna]);
  const maxStep = 2 + tr.steps.length;
  const s = Math.min(step, maxStep);
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="card">
          <h3>DNA-Abschnitt auswählen</h3>
          <div className="row">
            {DNA_PRESETS.map((p) => <button key={p.name} className="small" onClick={() => { setInput(p.seq); setStep(0); }}>{p.name}</button>)}
          </div>
          <label className="field" style={{ marginTop: 10 }}>
            <span className="lab"><b>Codierender Strang (5′→3′)</b></span>
            <input type="text" value={input} onChange={(e) => { setInput(e.target.value); setStep(0); }} spellCheck={false} style={{ fontFamily: 'var(--mono)', letterSpacing: '0.1em' }} aria-describedby="dna-h" />
            <span className="hint" id="dna-h">Nur A, C, G, T. Leerzeichen werden ignoriert.</span>
          </label>
          {invalid.length > 0 && <div className="notice danger">Ungültige Zeichen ignoriert: {invalid.join(', ')}</div>}
          <div className="notice">Vereinfachtes Beispiel: Ein beliebiger DNA-Abschnitt ist kein funktionsfähiges Gen. Promotor, Introns/Spleißstellen, UTRs und regulatorische Elemente fehlen hier.</div>
        </div>
        <div className="card">
          <div className="playback" role="group" aria-label="Schrittsteuerung">
            <button className="small" onClick={() => setStep(0)}>⟲ Neustart</button>
            <button className="small" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={s === 0}>◀︎ Zurück</button>
            <button className="small primary" onClick={() => setStep((x) => Math.min(maxStep, x + 1))} disabled={s >= maxStep}>Weiter ▶︎</button>
            <button className="small" onClick={() => setStep(maxStep)}>Alles zeigen</button>
            <span className="time">Schritt {s} / {maxStep}</span>
          </div>
          <div className="mono" style={{ lineHeight: 2, overflowX: 'auto' }}>
            <div><span className="muted">Codierend 5′ </span>{seq}<span className="muted"> 3′</span></div>
            <div><span className="muted">Codogen  3′ </span>{complement(seq)}<span className="muted"> 5′</span></div>
            {s >= 1 && <div style={{ color: 'var(--accent)' }}><span className="muted">mRNA     5′ </span>{mrna.split('').map((c, i) => <span key={i} style={{ background: tr.start >= 0 && i >= tr.start && i < tr.start + 3 * Math.max(0, s - 2) ? 'var(--accent-soft)' : undefined }}>{c}</span>)}<span className="muted"> 3′</span></div>}
          </div>
          <p aria-live="polite" style={{ marginTop: 10 }}>
            {s === 0 && 'Die DNA liegt doppelsträngig vor. Die RNA-Polymerase liest den codogenen Strang 3′→5′.'}
            {s === 1 && 'Transkription: Die mRNA wird 5′→3′ synthetisiert; ihre Sequenz entspricht dem codierenden Strang, mit U statt T. (Bei Eukaryoten folgt die Prozessierung: Cap, Spleißen, Poly-A.)'}
            {s === 2 && (tr.start >= 0 ? `Initiation: Das Ribosom erkennt das Startcodon AUG an Position ${tr.start + 1}.` : tr.note)}
            {s > 2 && tr.steps[s - 3] && `Elongation: Codon ${tr.steps[s - 3].codon} wird von einer tRNA mit Anticodon ${tr.steps[s - 3].anticodon} (3′→5′) erkannt → ${AA_NAMES[tr.steps[s - 3].aa]?.de ?? tr.steps[s - 3].aa}.${tr.steps[s - 3].aa === '*' ? ' Freisetzungsfaktoren beenden die Translation.' : ' Eine Peptidbindung wird geknüpft.'}`}
          </p>
          {s > 2 && (
            <div className="row" style={{ marginTop: 8 }} aria-label="Entstehendes Peptid">
              {tr.steps.slice(0, s - 2).map((x, i) => (
                <span key={i} className={`badge ${x.aa === '*' ? 'danger' : 'accent'}`} title={`${x.codon} → ${AA_NAMES[x.aa]?.de}`}>{AA_NAMES[x.aa]?.three ?? x.aa}</span>
              ))}
            </div>
          )}
          {s >= maxStep && tr.start >= 0 && <p className="muted" style={{ marginTop: 8 }}>{tr.note}</p>}
        </div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3>Codon-Tabelle (Ausschnitt)</h3>
          <table><tbody>
            {tr.steps.map((x, i) => <tr key={i}><td className="mono">{x.codon}</td><td className="mono">{x.anticodon}</td><td>{AA_NAMES[x.aa]?.de}</td></tr>)}
          </tbody></table>
          <p className="muted" style={{ fontSize: '0.85rem' }}>Spalten: Codon (mRNA) · Anticodon (tRNA) · Aminosäure. Der Code ist degeneriert: Mehrere Codons können dieselbe Aminosäure codieren.</p>
        </section>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function EnergyView() {
  const [sel, setSel] = useState(ENERGY_STATIONS[0].id);
  const [po, setPo] = useState<'modern' | 'alt'>('modern');
  const [shuttle, setShuttle] = useState<'malat-aspartat' | 'glycerin-3-phosphat'>('malat-aspartat');
  const st = ENERGY_STATIONS.find((s) => s.id === sel)!;
  const y = glucoseYield({ poNADH: po === 'modern' ? 2.5 : 3, poFADH2: po === 'modern' ? 1.5 : 2, shuttle });
  return (
    <div className="workspace">
      <div className="main-area stack">
        <div className="figure">
          <svg viewBox="0 0 760 170" role="group" aria-label="Stationen der Energiegewinnung">
            <rect x={6} y={20} width={180} height={140} rx={12} fill="var(--panel-2)" />
            <text x={14} y={38} style={{ fontSize: 11 }} fill="var(--ink-3)">Zytosol</text>
            <rect x={196} y={20} width={556} height={140} rx={12} fill="rgba(242,165,65,0.12)" stroke="#a06a20" />
            <text x={204} y={38} style={{ fontSize: 11 }} fill="#a06a20">Mitochondrium</text>
            {ENERGY_STATIONS.map((s, i) => {
              const x = 20 + i * 122;
              return (
                <g key={s.id} role="button" tabIndex={0} aria-pressed={sel === s.id} aria-label={s.title} onClick={() => setSel(s.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(s.id); } }} style={{ cursor: 'pointer' }}>
                  <rect x={x} y={60} width={110} height={60} rx={10} fill={sel === s.id ? 'var(--accent)' : 'var(--panel)'} stroke="var(--accent)" strokeWidth={2} />
                  <text x={x + 55} y={95} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 600 }} fill={sel === s.id ? 'var(--accent-ink)' : 'var(--ink)'}>{s.title.length > 16 ? s.title.split(' ')[0] : s.title}</text>
                  {i < ENERGY_STATIONS.length - 1 && <path d={`M${x + 112},90 l8,0`} stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#ar)" />}
                </g>
              );
            })}
            <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--ink-3)" /></marker></defs>
          </svg>
        </div>
        <div className="card" aria-live="polite">
          <h3>{st.title} <span className="badge">{st.place}</span></h3>
          <p>{st.text}</p>
          <div className="grid cols-2">
            <div><b>Substrate</b><ul>{st.substrates.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><b>Produkte</b><ul>{st.products.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </div>
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack">
        <section className="card">
          <h3>ATP-Bilanz pro Glukose</h3>
          <div className="field">
            <span className="lab"><b>P/O-Konvention</b></span>
            <div className="row">
              <button className="small" aria-pressed={po === 'modern'} onClick={() => setPo('modern')}>2,5 / 1,5 (modern)</button>
              <button className="small" aria-pressed={po === 'alt'} onClick={() => setPo('alt')}>3 / 2 (ältere Lehrbücher)</button>
            </div>
          </div>
          <div className="field">
            <span className="lab"><b>Shuttle für zytosolisches NADH</b></span>
            <select value={shuttle} onChange={(e) => setShuttle(e.target.value as any)}>
              <option value="malat-aspartat">Malat-Aspartat (v. a. Leber, Herz, Niere)</option>
              <option value="glycerin-3-phosphat">Glycerin-3-phosphat (v. a. Skelettmuskel; im Gehirn sind beide beschrieben)</option>
            </select>
          </div>
          <table>
            <thead><tr><th>Station</th><th style={{ textAlign: 'right' }}>ATP</th></tr></thead>
            <tbody>
              {y.rows.map((r) => <tr key={r.step}><td>{r.step}<br /><small>{r.note}</small></td><td className="num">{String(r.atp).replace('.', ',')}</td></tr>)}
              <tr><td><b>Summe</b></td><td className="num"><b>{String(y.total).replace('.', ',')}</b></td></tr>
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: '0.85rem', marginTop: 8 }}>Modellannahme: vollständige Kopplung, keine Protonenlecks. Reale Ausbeuten hängen von Zelltyp, Substrat und Kopplungszustand ab – die Zahl ist eine Rechenkonvention.</p>
        </section>
      </aside>
    </div>
  );
}
