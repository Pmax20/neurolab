import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ModelDef, ParamValues, SimResult } from '../engine/types';
import { defaults, runModel, withDefaults } from '../engine/core';
import { ChartView, fmt, type Overlay } from './Chart';
import { ModelInfo, ParamPanel, ScalarTable, Splitter, Toast, usePrefersReducedMotion } from './common';
import { setState, useStore } from '../store/store';
import { uid } from '../store/state';

// ---------------------------------------------------------------------------
// Wiedergabesteuerung: Die Animation liest nur vorab berechnete Zeitreihen.
// Die Animationsgeschwindigkeit hat daher keinen Einfluss auf das Ergebnis.
// ---------------------------------------------------------------------------

export interface PlaybackState {
  idx: number;
  t: number;
  playing: boolean;
  setIdx: (i: number) => void;
}

export function usePlayback(times: number[] | undefined, msPerUnit = 1) {
  const n = times?.length ?? 0;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const reduced = usePrefersReducedMotion();
  const raf = useRef<number>();
  const last = useRef<number>(0);
  const simT = useRef(0);
  useEffect(() => {
    setIdx(n ? n - 1 : 0);
    setPlaying(false);
  }, [times, n]);
  useEffect(() => {
    if (!playing || !times || !n) return;
    last.current = performance.now();
    simT.current = times[idx];
    const tick = (now: number) => {
      const dt = now - last.current;
      last.current = now;
      // Standard: 1 Zeiteinheit der Simulation pro (msPerUnit) ms realer Zeit, skaliert durch speed
      simT.current += (dt / msPerUnit) * speed;
      let i = idx;
      while (i < n - 1 && times[i + 1] <= simT.current) i++;
      setIdx(i);
      if (i >= n - 1) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, times]);
  const stepBy = (k: number) => {
    setPlaying(false);
    setIdx((i) => Math.max(0, Math.min(n - 1, i + k)));
  };
  return { idx: Math.min(idx, Math.max(0, n - 1)), t: times?.[Math.min(idx, n - 1)] ?? 0, playing, setPlaying, speed, setSpeed, setIdx, stepBy, n, reduced };
}

export type Playback = ReturnType<typeof usePlayback>;

export function PlaybackControls({ pb, unit = 'ms', phases, times, label = 'Animation' }: { pb: Playback; unit?: string; phases?: { from: number; label: string; id: string }[]; times?: number[]; label?: string }) {
  if (!pb.n) return null;
  const start = () => {
    if (pb.idx >= pb.n - 1) pb.setIdx(0);
    pb.setPlaying(true);
  };
  return (
    <div className="playback no-print" role="group" aria-label={`${label}: Steuerung`}>
      {!pb.playing ? (
        <button className="small primary" onClick={start} aria-label={pb.idx === 0 ? 'Start' : pb.idx >= pb.n - 1 ? 'Erneut abspielen' : 'Fortsetzen'}>
          ▶ {pb.idx === 0 ? 'Start' : pb.idx >= pb.n - 1 ? 'Abspielen' : 'Fortsetzen'}
        </button>
      ) : (
        <button className="small" onClick={() => pb.setPlaying(false)}>❚❚ Pause</button>
      )}
      <button className="small" onClick={() => pb.stepBy(-Math.max(1, Math.round(pb.n / 200)))} aria-label="Schritt zurück">◀︎</button>
      <button className="small" onClick={() => pb.stepBy(Math.max(1, Math.round(pb.n / 200)))} aria-label="Schritt vor">▶︎</button>
      <input type="range" min={0} max={pb.n - 1} value={pb.idx} onChange={(e) => { pb.setPlaying(false); pb.setIdx(Number(e.target.value)); }} aria-label="Zeitpunkt wählen" />
      <span className="time">t = {fmt(pb.t, 2)} {unit}</span>
      <label className="row" style={{ gap: 4 }} title="Tempo">
        <select value={pb.speed} onChange={(e) => pb.setSpeed(Number(e.target.value))} aria-label="Animationsgeschwindigkeit">
          {[0.1, 0.25, 0.5, 1, 2, 4].map((s) => <option key={s} value={s}>{String(s).replace('.', ',')}×</option>)}
        </select>
      </label>
      {phases && phases.length > 0 && (
        <select aria-label="Phase direkt auswählen" onChange={(e) => {
          const ph = phases.find((p) => p.id === e.target.value);
          if (ph && times) {
            pb.setPlaying(false);
            let i = 0;
            while (i < times.length - 1 && times[i] < ph.from) i++;
            pb.setIdx(i);
          }
        }} value="">
          <option value="">Phase wählen …</option>
          {phases.map((p) => <option key={p.id + p.from} value={p.id}>{p.label}</option>)}
        </select>
      )}
      {pb.reduced && <span className="badge">Reduzierte Bewegung aktiv – Schritte manuell durchgehen</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simulations-Arbeitsbereich
// ---------------------------------------------------------------------------

export interface WorkbenchProps {
  model: ModelDef;
  initial?: Partial<ParamValues>;
  locked?: string[];
  /** Zusätzliche Visualisierung über den Diagrammen */
  visual?: (r: SimResult, pb: Playback, p: ParamValues) => ReactNode;
  /** Zusätzliche Inhalte im Informationsbereich */
  side?: (r: SimResult, p: ParamValues, pb: Playback) => ReactNode;
  charts?: string[]; // Auswahl/Reihenfolge der Diagramme
  msPerUnit?: number;
  unit?: string;
  compact?: boolean;
  onResult?: (r: SimResult, p: ParamValues) => void;
  overlays?: { label: string; params: ParamValues }[];
  hideResults?: boolean;
}

export function Workbench({ model, initial, locked, visual, side, charts, msPerUnit = 200, unit = 'ms', compact, onResult, overlays, hideResults }: WorkbenchProps) {
  const showAdvancedSetting = useStore((s) => s.settings.showAdvanced);
  const [showAdv, setShowAdv] = useState(showAdvancedSetting);
  const ref = useMemo(() => withDefaults(model, initial ?? {}), [model, initial]);
  const [params, setParams] = useState<ParamValues>(ref);
  const [result, setResult] = useState<SimResult>(() => runModel(model, ref));
  const [toast, setToast] = useState<string | null>(null);
  const [chartTab, setChartTab] = useState(0);
  const hints = useStore((s) => s.settings.hints ?? {});
  useEffect(() => { setParams(ref); }, [ref]);
  useEffect(() => {
    const h = setTimeout(() => {
      const r = runModel(model, params);
      setResult(r);
      if (r.ok) {
        setState((s) => ({ ...s, sims: { ...s.sims, [model.id]: { runs: (s.sims[model.id]?.runs ?? 0) + 1, last: Date.now() } }, recent: [{ kind: 'sim' as const, id: model.id, t: Date.now() }, ...s.recent.filter((x) => !(x.kind === 'sim' && x.id === model.id))].slice(0, 30) }));
        onResult?.(r, params);
      }
    }, 120);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, model]);
  const ov: Overlay[] = useMemo(() => (overlays ?? []).map((o) => ({ label: o.label, r: runModel(model, o.params) })).filter((o) => o.r.ok).flatMap((o) => o.r.charts.map((c) => ({ label: o.label, chart: c }))), [overlays, model]);
  const pb = usePlayback(result.frames?.t, msPerUnit);
  const changed = model.params.filter((p) => params[p.key] !== ref[p.key]);
  const save = useCallback(() => {
    const name = `${model.title.split(' (')[0].split(':')[0]} – ${changed.length ? changed.map((c) => `${c.label}: ${String(params[c.key]).replace('.', ',')}`).join(', ') : 'Referenz'}`;
    setState((s) => ({ ...s, experiments: [...s.experiments, { id: uid('exp'), model: model.id, modelVersion: model.version, name, params, createdAt: Date.now(), resultSummary: result.ok ? Object.fromEntries(Object.entries(result.scalars).map(([k, v]) => [k, { label: v.label, value: v.value, unit: v.unit }])) : undefined }] }));
    setToast('Szenario gespeichert – im Experimentiermodus umbenennen und vergleichen.');
  }, [model, params, changed, result]);

  const chartList = result.ok && !hideResults ? (charts ? charts.map((id) => result.charts.find((c) => c.id === id)!).filter(Boolean) : result.charts) : [];
  const cursor = result.frames && pb.n ? pb.t : undefined;
  const shown = chartList[Math.min(chartTab, Math.max(0, chartList.length - 1))];
  const keyScalars = Object.entries(result.scalars).filter(([, v]) => typeof v.value === 'number' || String(v.value).length < 14).slice(0, 4);
  const hintKey = `wb:${model.id}`;
  const showHint = !compact && !hideResults && !hints[hintKey];

  return (
    <div className="workspace">
      <div className="main-area stack">
        {showHint && (
          <div className="hint-card">
            <div><b>So funktioniert’s:</b> Verändere die Regler – die Berechnung läuft sofort neu. {result.frames ? 'Mit der Wiedergabeleiste kannst du den Ablauf Schritt für Schritt verfolgen. ' : ''}Tippe ins Diagramm, um exakte Werte abzulesen. „Zurücksetzen“ stellt die Standardwerte wieder her.</div>
            <button className="small" onClick={() => setState((s) => ({ ...s, settings: { ...s.settings, hints: { ...s.settings.hints, [hintKey]: true } } }))}>Verstanden</button>
          </div>
        )}
        {result.ok && !hideResults && visual && <div>{visual(result, pb, params)}</div>}
        {result.ok && !hideResults && result.frames && <PlaybackControls pb={pb} unit={unit} times={result.frames.t} phases={result.phases?.filter((p) => p.id !== 'ruhe')} />}
        {!result.ok && <div className="notice danger" role="alert"><b>Simulation nicht ausgeführt.</b> {result.error} <button className="small" onClick={() => setParams(ref)}>Ausgangszustand wiederherstellen</button></div>}
        {result.warnings.map((w) => <div className="notice" key={w}>{w}</div>)}
        {shown && (
          <section className="card chart-area">
            {chartList.length > 1 && (
              <div className="chart-tabs" role="tablist" aria-label="Diagramm wählen">
                {chartList.map((c, i) => <button key={c.id} role="tab" aria-selected={c.id === shown.id} onClick={() => setChartTab(i)}>{c.title}</button>)}
              </div>
            )}
            <ChartView chart={shown} cursorX={shown.xUnit === unit && cursor !== undefined ? cursor : undefined} overlays={ov.filter((o) => o.chart.id === shown.id)} onPick={(x) => {
              if (result.frames && shown.xUnit === unit) { const t = result.frames.t; let i = 0; while (i < t.length - 1 && t[i] < x) i++; pb.setIdx(i); }
            }} />
          </section>
        )}
        {!compact && <ModelInfo model={model} />}
      </div>
      <Splitter cssVar="--info-w" min={260} max={600} invert label="Informationsbereich" />
      <aside className="info stack" aria-label="Regler und Ergebnisse">
        <section className="card">
          <div className="row between" style={{ marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Regler</h3>
            <span className={`badge ${model.modelType === 'ausführlich' ? 'accent' : 'warn'}`} title={model.modelType === 'ausführlich' ? 'Quantitatives Modell aus der Fachliteratur' : 'Didaktisch vereinfachtes Modell – Werte nur qualitativ'}>{model.modelType === 'ausführlich' ? 'quantitatives Modell' : 'vereinfachtes Modell'}</span>
          </div>
          <ParamPanel model={model} values={params} showAdvanced={showAdv} locked={locked} onChange={(k, v) => setParams((p) => ({ ...p, [k]: v }))} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="small" onClick={() => setParams(ref)} disabled={!changed.length}>⟲ Zurücksetzen</button>
            {!hideResults && <button className="small" onClick={save}>Szenario speichern</button>}
          </div>
          {!hideResults && model.references.length > 0 && (
            <label className="field" style={{ marginTop: 12, marginBottom: 0 }}>
              <span className="lab"><span className="muted">Beispiel laden</span></span>
              <select value="" onChange={(e) => { const r = model.references.find((x) => x.name === e.target.value); if (r) { setParams(withDefaults(model, { ...defaults(model), ...r.params })); setToast(`Beispiel „${r.name}“: ${r.expectation}`); } }}>
                <option value="">Beispiel wählen …</option>
                {model.references.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
              </select>
            </label>
          )}
        </section>
        {hideResults && <div className="notice info">Die Ergebnisse werden erst nach „Simulation ausführen“ angezeigt.</div>}
        {result.ok && !hideResults && (
          <section className="card">
            <h3>Ergebnis</h3>
            <div className="key-results">{keyScalars.map(([k, v]) => <div key={k}><small>{v.label}</small><b>{typeof v.value === 'number' ? fmt(v.value, v.digits) : v.value}</b> <span className="muted" style={{ fontSize: '0.8rem' }}>{v.unit}</span></div>)}</div>
            <details>
              <summary>Alle berechneten Größen</summary>
              <ScalarTable scalars={result.scalars} />
              <p className="muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>Modell „{model.id}“, Version {model.version}. Gleiche Parameter liefern immer das gleiche Ergebnis.</p>
            </details>
          </section>
        )}
        {result.ok && !hideResults && side?.(result, params, pb)}
      </aside>
      <Toast msg={toast} onDone={() => setToast(null)} />
    </div>
  );
}
