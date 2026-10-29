import { useEffect, useMemo, useState } from 'react';
import { STRUCTURES, structureById } from '../content';
import { deleteSlide, listSlides, saveSlide, shrinkImage, type OwnSlide } from '../store/slides';
import { setState } from '../store/store';
import { rateCard } from '../store/state';
import { ZoomBox } from '../ui/Zoom';
import { uid } from '../store/state';

const TISSUES = STRUCTURES.filter((s) => s.figure === 'tissue' && !['h-basalmembran', 'h-mikrovilli', 'h-kinozilien', 'h-fibroblast', 'h-kollagen', 'h-elastisch'].includes(s.id));

function useUrl(b?: Blob) {
  const url = useMemo(() => (b ? URL.createObjectURL(b) : ''), [b]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

function Thumb({ s, onDelete }: { s: OwnSlide; onDelete: () => void }) {
  const url = useUrl(s.image);
  return (
    <li className="card row" style={{ alignItems: 'center', gap: 12 }}>
      <img src={url} alt={`Eigenes Präparat: ${s.label}`} style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 8 }} />
      <div className="grow" style={{ flex: 1, minWidth: 0 }}><b>{s.label}</b><div className="muted" style={{ fontSize: '0.85rem' }}>{[s.stain, s.magnification, s.source].filter(Boolean).join(' · ')}</div></div>
      <button className="small ghost" onClick={onDelete} aria-label={`${s.label} löschen`}>Löschen</button>
    </li>
  );
}

function AddForm({ onSaved }: { onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [tissue, setTissue] = useState('');
  const [label, setLabel] = useState('');
  const [stain, setStain] = useState('H.E.');
  const [mag, setMag] = useState('');
  const [source, setSource] = useState('');
  const [features, setFeatures] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!file) { setErr('Bitte ein Foto auswählen.'); return; }
    const name = label.trim() || structureById(tissue)?.deName || '';
    if (!name) { setErr('Bitte die Gewebeart angeben.'); return; }
    if (!source.trim()) { setErr('Bitte die Herkunft angeben (z. B. „eigenes Foto, Histo-Kurs“).'); return; }
    setBusy(true);
    try {
      await saveSlide({ id: uid('slide'), created: Date.now(), tissue, label: name, stain, magnification: mag, source: source.trim(), features: features.trim(), image: await shrinkImage(file) });
      setFile(null); setTissue(''); setLabel(''); setMag(''); setFeatures(''); setErr('');
      onSaved();
    } catch (e) { setErr((e as Error).message || 'Speichern fehlgeschlagen.'); }
    setBusy(false);
  };
  return (
    <details className="card">
      <summary><b>Präparat hinzufügen</b></summary>
      <div className="stack" style={{ marginTop: 10 }}>
        <label className="field"><span className="lab"><b>Foto</b></span><input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
        <div className="grid cols-2">
          <label className="field"><span className="lab"><b>Gewebe</b></span>
            <select value={tissue} onChange={(e) => setTissue(e.target.value)}><option value="">anderes Gewebe (unten eintragen)</option>{TISSUES.map((t) => <option key={t.id} value={t.id}>{t.deName}</option>)}</select></label>
          <label className="field"><span className="lab"><b>Bezeichnung (optional)</b></span><input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="z. B. Trachea, respiratorisches Epithel" /></label>
          <label className="field"><span className="lab"><b>Färbung</b></span><input type="text" value={stain} onChange={(e) => setStain(e.target.value)} /></label>
          <label className="field"><span className="lab"><b>Vergrößerung</b></span><input type="text" value={mag} onChange={(e) => setMag(e.target.value)} placeholder="z. B. 400×" /></label>
        </div>
        <label className="field"><span className="lab"><b>Herkunft</b></span><input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="z. B. eigenes Foto, Histo-Kurs, Präparat Nr. 12" /></label>
        <label className="field"><span className="lab"><b>Woran erkennt man es?</b></span><textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Merkmale in eigenen Worten – wird beim Üben als Lösung gezeigt" /></label>
        {err && <div className="notice danger">{err}</div>}
        <div className="row"><button className="primary" onClick={save} disabled={busy}>{busy ? 'Speichere …' : 'Speichern'}</button></div>
      </div>
    </details>
  );
}

function Quiz({ slides }: { slides: OwnSlide[] }) {
  const [k, setK] = useState(() => Math.floor(Math.random() * slides.length));
  const s = slides[k % slides.length];
  const url = useUrl(s.image);
  const opts = useMemo(() => {
    const names = [...new Set([...slides.map((x) => x.label), ...TISSUES.map((t) => t.deName)])].filter((n) => n !== s.label);
    for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [names[i], names[j]] = [names[j], names[i]]; }
    return [s.label, ...names.slice(0, 3)].sort(() => Math.random() - 0.5);
  }, [s, slides]);
  const [ans, setAns] = useState<string | null>(null);
  const choose = (o: string) => { if (ans) return; setAns(o); setState((st) => rateCard(st, `own:${s.id}`, o === s.label ? 1 : 0, Date.now())); };
  return (
    <div className="card stack own-slide">
      <ZoomBox label="Präparat"><img src={url} alt="Eigenes Präparat – welches Gewebe?" /></ZoomBox>
      <div className="drill-q">Welches Gewebe ist das?</div>
      <div className="row">{opts.map((o) => <button key={o} aria-pressed={ans === o} disabled={!!ans} className={ans && o === s.label ? 'primary' : ''} onClick={() => choose(o)}>{o}</button>)}</div>
      {ans && (
        <div className="stack" style={{ gap: 4 }} aria-live="polite">
          <b style={{ color: ans === s.label ? 'var(--ok)' : 'var(--danger)' }}>{ans === s.label ? 'Richtig.' : `Das ist ${s.label}.`}</b>
          {s.features && <p style={{ margin: 0 }}><b>Deine Merkmale:</b> {s.features}</p>}
          {s.tissue && <p style={{ margin: 0 }}><b>Aus der Lektion:</b> {structureById(s.tissue)?.short}</p>}
          <p className="muted" style={{ margin: 0, fontSize: '0.85rem' }}>{[s.stain, s.magnification, s.source].filter(Boolean).join(' · ')}</p>
          <div className="row"><button className="primary" onClick={() => { setK((x) => x + 1 + Math.floor(Math.random() * Math.max(1, slides.length - 1))); setAns(null); }}>Nächstes Präparat</button></div>
        </div>
      )}
    </div>
  );
}

export function OwnSlides() {
  const [slides, setSlides] = useState<OwnSlide[] | null>(null);
  const [err, setErr] = useState('');
  const load = () => listSlides().then(setSlides).catch((e) => { setErr(e.message); setSlides([]); });
  useEffect(() => { load(); }, []);
  return (
    <div className="stack">
      <div className="notice info">
        Hier kannst du eigene Fotos echter Präparate sammeln, zum Beispiel durch das Okular fotografiert, und mit ihnen üben. Die Bilder bleiben nur in diesem Browser und sind nicht im Datenexport enthalten.
        Bitte nur Bilder verwenden, die du nutzen darfst – Inhalte aus dem virtuellen Mikroskop der Universität nicht kopieren.
      </div>
      {err && <div className="notice danger">{err}</div>}
      <AddForm onSaved={load} />
      {slides && slides.length >= 2 && <Quiz key={slides.length} slides={slides} />}
      {slides && slides.length === 1 && <p className="muted">Ab zwei Präparaten kannst du hier üben.</p>}
      {slides && slides.length > 0 && (
        <section><h3>Deine Präparate ({slides.length})</h3><ul className="stack" style={{ listStyle: 'none', padding: 0 }}>{slides.map((s) => <Thumb key={s.id} s={s} onDelete={() => { if (confirm(`„${s.label}“ löschen?`)) deleteSlide(s.id).then(load); }} />)}</ul></section>
      )}
    </div>
  );
}
