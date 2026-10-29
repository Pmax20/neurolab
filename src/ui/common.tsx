import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ModelDef, ParamDef, ParamValues, ReviewStatus, Scalar, SourceRef } from '../engine/types';
import { STATUS_LABEL, ORIGIN_LABEL, type Origin } from '../content/types';
import { sourceById } from '../content/sources';
import { useStore } from '../store/store';
import { fmt } from './Chart';
import { validateParam } from '../engine/core';

export function useEffectiveStatus(id: string, base: ReviewStatus): ReviewStatus {
  return useStore((s) => s.reviews[id]?.status ?? base);
}

export function StatusBadge({ id, status }: { id: string; status: ReviewStatus }) {
  const st = useEffectiveStatus(id, status);
  const rec = useStore((s) => s.reviews[id]);
  const cls = st === 'freigegeben' || st === 'geprueft' ? 'ok' : st === 'ueberarbeiten' ? 'danger' : 'warn';
  return (
    <span className={`badge ${cls}`} title={rec ? `${STATUS_LABEL[st]} – ${rec.reviewer || 'ohne Namen'}, ${new Date(rec.date).toLocaleDateString('de-DE')}${rec.note ? `: ${rec.note}` : ''}` : 'Noch keine fachliche Prüfung durch eine Fachperson erfasst.'}>
      {st === 'freigegeben' || st === 'geprueft' ? '✓' : '!'} {STATUS_LABEL[st]}
    </span>
  );
}

export function OriginBadge({ origin }: { origin: Origin }) {
  return <span className={`badge ${origin === 'automatisch' ? 'warn' : ''}`}>{ORIGIN_LABEL[origin]}</span>;
}

export function UnreviewedNotice({ id, status, what = 'Dieser Inhalt' }: { id: string; status: ReviewStatus; what?: string }) {
  const st = useEffectiveStatus(id, status);
  if (st === 'freigegeben' || st === 'geprueft') return null;
  return (
    <div className="notice" role="note">
      <b>Noch nicht fachlich freigegeben.</b> {what} wurde KI-gestützt anhand der angegebenen Quellen erstellt und automatisiert getestet, aber noch nicht von einer fachkundigen Person geprüft. Bei Abweichungen zu Vorlesung oder Lehrbuch gilt die Vorlesung. <a href="#/freigabe">Zur fachlichen Prüfung</a>
    </div>
  );
}

export function SourceList({ sources }: { sources: SourceRef[] }) {
  return (
    <ul className="list" style={{ fontSize: '0.88rem' }}>
      {sources.map((r, i) => {
        const s = sourceById(r.id);
        if (!s) return <li key={i}>Unbekannte Quelle „{r.id}“</li>;
        return (
          <li key={i}>
            {s.authors}: <i>{s.title}</i>
            {s.edition ? `, ${s.edition}` : ''}. {s.publisher}, {s.year}.{r.locator ? <> Fundstelle: {r.locator}.</> : null}
            <br />
            <small>Letzte Prüfung: {s.lastChecked ?? 'ausstehend'}</small>
          </li>
        );
      })}
    </ul>
  );
}

export function ScalarTable({ scalars, compare }: { scalars: Record<string, Scalar>; compare?: { label: string; scalars: Record<string, Scalar> }[] }) {
  const keys = Object.keys(scalars);
  const show = (s?: Scalar) => (s === undefined ? '—' : typeof s.value === 'number' ? `${fmt(s.value, s.digits)} ${s.unit}` : `${s.value} ${s.unit}`.trim());
  return (
    <table>
      <thead>
        <tr>
          <th>Größe</th>
          <th style={{ textAlign: 'right' }}>{compare ? 'aktuell' : 'Wert'}</th>
          {compare?.map((c) => <th key={c.label} style={{ textAlign: 'right' }}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k}>
            <td>{scalars[k].label}</td>
            <td className="num">{show(scalars[k])}</td>
            {compare?.map((c) => <td key={c.label} className="num">{show(c.scalars[k])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ModelInfo({ model, open = false }: { model: ModelDef; open?: boolean }) {
  return (
    <details open={open} className="card">
      <summary>Modellannahmen und Grenzen</summary>
      <div className="row" style={{ marginBottom: 8 }}>
        <span className={`badge ${model.modelType === 'ausführlich' ? 'accent' : 'warn'}`}>{model.modelType === 'ausführlich' ? 'Ausführlichere quantitative Berechnung' : 'Vereinfachtes Lehrmodell'}</span>
        <span className="badge">Modellversion {model.version}</span>
        <StatusBadge id={`model:${model.id}`} status={model.status} />
      </div>
      <p><b>Zweck:</b> {model.purpose}</p>
      <p><b>Dargestellter Prozess:</b> {model.process}</p>
      <h4>Gleichungen</h4>
      {model.equations.map((e, i) => <div className="eq" key={i}>{e}</div>)}
      <h4>Enthalten</h4>
      <ul>{model.included.map((x) => <li key={x}>{x}</li>)}</ul>
      <h4>Nicht berücksichtigt</h4>
      <ul>{model.omitted.map((x) => <li key={x}>{x}</li>)}</ul>
      <h4>Vereinfachende Annahmen</h4>
      <ul>{model.assumptions.map((x) => <li key={x}>{x}</li>)}</ul>
      <h4>Bekannte Grenzen</h4>
      <ul>{model.limits.map((x) => <li key={x}>{x}</li>)}</ul>
      {model.qualitativeOnly.length > 0 && (<><h4>Nur qualitativ zu verstehen</h4><ul>{model.qualitativeOnly.map((x) => <li key={x}>{x}</li>)}</ul></>)}
      <p><b>Anfangsbedingungen:</b> {model.initialConditions}</p>
      <p><b>Fest vorgegebene Parameter:</b> alle Größen, die nicht als Regler angeboten werden (siehe Gleichungen).</p>
      <h4>Quellen</h4>
      <SourceList sources={model.sources} />
      <p className="muted">{model.reviewNote}</p>
    </details>
  );
}

export function ParamPanel({ model, values, onChange, showAdvanced, locked = [] }: { model: ModelDef; values: ParamValues; onChange: (k: string, v: any) => void; showAdvanced: boolean; locked?: string[] }) {
  const [drafts, setDrafts] = useState<Record<string, string | undefined>>({});
  const basic = model.params.filter((p) => !p.advanced);
  const primary = basic.slice(0, 4);
  const rest = [...basic.slice(4), ...model.params.filter((p) => p.advanced)];
  const field = (p: ParamDef) => (
    <ParamField key={p.key} p={p} value={values[p.key]} draft={drafts[p.key]} disabled={locked.includes(p.key)}
      setDraft={(d) => setDrafts((x) => ({ ...x, [p.key]: d }))}
      onChange={(v) => onChange(p.key, v)} />
  );
  const restChanged = rest.some((p) => values[p.key] !== p.default);
  return (
    <div>
      {primary.map(field)}
      {rest.length > 0 && (
        <details className="more-params" open={showAdvanced || restChanged || undefined}>
          <summary>Weitere Regler ({rest.length})</summary>
          {rest.map(field)}
        </details>
      )}
    </div>
  );
}

function ParamField({ p, value, draft, setDraft, onChange, disabled }: { p: ParamDef; value: any; draft?: string; setDraft: (d: string | undefined) => void; onChange: (v: any) => void; disabled?: boolean }) {
  const id = `p-${p.key}`;
  if (p.type === 'select') {
    return (
      <div className="field">
        <label className="lab" htmlFor={id}><b>{p.label}</b></label>
        <select id={id} value={value as string} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
          {p.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="hint">{p.description}</span>
      </div>
    );
  }
  if (p.type === 'bool') {
    return (
      <div className="field">
        <label className="row" htmlFor={id}><input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} /> <b>{p.label}</b></label>
        <span className="hint">{p.description}</span>
      </div>
    );
  }
  const err = draft !== undefined ? validateDraft(p, draft) : null;
  return (
    <div className={`field ${err ? 'invalid' : ''}`}>
      <div className="lab">
        <label htmlFor={id}><b>{p.label}</b></label>
        <span className="muted">{p.min}–{p.max} {p.unit}</span>
      </div>
      <div className="ctl">
        <input type="range" aria-label={`${p.label} (Regler)`} min={p.min} max={p.max} step={p.step} value={value as number} disabled={disabled}
          onChange={(e) => { setDraft(undefined); onChange(Number(e.target.value)); }} />
        <input id={id} type="number" inputMode="decimal" min={p.min} max={p.max} step={p.step} disabled={disabled}
          value={draft ?? String(value)}
          aria-invalid={!!err}
          aria-describedby={`${id}-h`}
          onChange={(e) => {
            const d = e.target.value;
            setDraft(d);
            const v = Number(d.replace(',', '.'));
            if (!validateDraft(p, d)) onChange(v);
          }}
          onBlur={() => setDraft(undefined)} />
      </div>
      {err ? <span className="err" role="alert">{err} Der zuletzt gültige Wert ({String(value).replace('.', ',')} {p.unit}) bleibt aktiv.</span> : <span className="hint" id={`${id}-h`}>{p.description}</span>}
    </div>
  );
}

function validateDraft(p: ParamDef, d: string): string | null {
  if (d.trim() === '') return 'Bitte einen Wert eingeben.';
  const v = Number(d.replace(',', '.'));
  return validateParam(p, v);
}

export function Toast({ msg, onDone }: { msg: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  if (!msg) return null;
  return <div className="toast" role="status">{msg}</div>;
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="card">
      <div className="row between" style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Ziehbare Trennleiste (auch per Tastatur bedienbar) zur Größenanpassung von Bereichen */
export function Splitter({ cssVar, min, max, invert = false, label }: { cssVar: string; min: number; max: number; invert?: boolean; label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const get = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(cssVar)) || min;
  const set = (v: number) => {
    const c = Math.max(min, Math.min(max, v));
    document.documentElement.style.setProperty(cssVar, `${c}px`);
    try { localStorage.setItem(`neurolab.layout${cssVar}`, String(c)); } catch { /* */ }
  };
  useEffect(() => {
    try { const s = localStorage.getItem(`neurolab.layout${cssVar}`); if (s) set(Number(s)); } catch { /* */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <button ref={ref} className="splitter" aria-label={`${label} – Breite ändern (Pfeiltasten)`} title="Ziehen oder Pfeiltasten zum Anpassen der Breite"
      onPointerDown={(e) => {
        const start = e.clientX;
        const w0 = get();
        const move = (ev: PointerEvent) => set(w0 + (invert ? -1 : 1) * (ev.clientX - start));
        const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') set(get() + (invert ? 20 : -20));
        if (e.key === 'ArrowRight') set(get() + (invert ? -20 : 20));
      }} />
  );
}

export function download(name: string, text: string, type = 'application/json') {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}

export function usePrefersReducedMotion() {
  const setting = useStore((s) => s.settings.reducedMotion);
  const [sys, setSys] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setSys(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return setting === 'an' ? true : setting === 'aus' ? false : sys;
}
