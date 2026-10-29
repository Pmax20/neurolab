import { useId, useMemo, useRef, useState } from 'react';
import type { Chart as ChartT } from '../engine/types';

const COLORS = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)'];
const DASH_EXTRA = ['', '8 4', '2 3', '10 3 2 3', '4 4'];

export interface Overlay {
  label: string;
  chart: ChartT;
}

function niceTicks(min: number, max: number, n = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const step0 = span / n;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const err = step0 / mag;
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return out;
}

export function fmt(v: number, digits?: number): string {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  const d = digits ?? (a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a === 0 ? 0 : a >= 0.01 ? 3 : 5);
  if (a !== 0 && (a < 1e-4 || a >= 1e6)) return v.toExponential(2).replace('.', ',');
  return v.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: d });
}

function nearestIndex(xs: number[], x: number) {
  let lo = 0;
  let hi = xs.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] < x) lo = mid;
    else hi = mid;
  }
  return Math.abs(xs[lo] - x) < Math.abs(xs[hi] - x) ? lo : hi;
}

export function ChartView({ chart, cursorX, overlays = [], height = 260, onPick }: { chart: ChartT; cursorX?: number; overlays?: Overlay[]; height?: number; onPick?: (x: number) => void }) {
  const W = 720;
  const H = height;
  const m = { l: 58, r: 16, t: chart.bands?.length ? 30 : 12, b: 44 };
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [pick, setPick] = useState<number | null>(null);

  const allSeries = useMemo(() => {
    const own = chart.series.map((s, i) => ({ ...s, x: chart.x, color: COLORS[i % COLORS.length], dash: s.dash ?? '', label: s.label }));
    const ov = overlays.flatMap((o, oi) =>
      o.chart.series
        .filter((s) => !/referenz/i.test(s.label))
        .map((s, i) => ({ ...s, x: o.chart.x, color: COLORS[(oi + 1) % COLORS.length], dash: DASH_EXTRA[(oi + 1) % DASH_EXTRA.length] || '6 3', label: `${o.label}: ${s.label}`, key: `${o.label}-${s.key}-${i}` })),
    );
    return [...own, ...ov];
  }, [chart, overlays]);

  const { xmin, xmax, ymin, ymax } = useMemo(() => {
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of allSeries) {
      for (let i = 0; i < s.y.length; i++) {
        const xv = s.x[i];
        const yv = s.y[i];
        if (!Number.isFinite(xv) || !Number.isFinite(yv)) continue;
        if (chart.logX && xv <= 0) continue;
        xmin = Math.min(xmin, xv); xmax = Math.max(xmax, xv);
        ymin = Math.min(ymin, yv); ymax = Math.max(ymax, yv);
      }
    }
    const dataSpan = Math.max(1e-12, ymax - ymin);
    for (const h of chart.hlines ?? []) {
      if (h.y >= ymin - 0.5 * dataSpan && h.y <= ymax + 0.5 * dataSpan) { ymin = Math.min(ymin, h.y); ymax = Math.max(ymax, h.y); }
    }
    const fixedLo = chart.yMin !== undefined && ymin >= chart.yMin;
    const fixedHi = chart.yMax !== undefined && ymax <= chart.yMax;
    if (chart.yMin !== undefined) ymin = Math.min(ymin, chart.yMin);
    if (chart.yMax !== undefined) ymax = Math.max(ymax, chart.yMax);
    if (!Number.isFinite(ymin) || !Number.isFinite(ymax)) { ymin = 0; ymax = 1; }
    if (ymin === ymax) { ymin -= 1; ymax += 1; }
    const pad = (ymax - ymin) * 0.05;
    return { xmin, xmax, ymin: fixedLo ? ymin : ymin - pad, ymax: fixedHi ? ymax : ymax + pad };
  }, [allSeries, chart]);

  const lx = (v: number) => (chart.logX ? Math.log10(v) : v);
  const sx = (v: number) => m.l + ((lx(v) - lx(xmin)) / (lx(xmax) - lx(xmin) || 1)) * (W - m.l - m.r);
  const sy = (v: number) => H - m.b - ((v - ymin) / (ymax - ymin || 1)) * (H - m.t - m.b);
  const xTicks = chart.logX ? [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].filter((v) => v >= xmin && v <= xmax) : niceTicks(xmin, xmax, 6);
  const yTicks = niceTicks(ymin, ymax, 5);

  const paths = allSeries.map((s) => {
    let d = '';
    let pen = false;
    const step = Math.max(1, Math.floor(s.y.length / 900));
    for (let i = 0; i < s.y.length; i += step) {
      const xv = s.x[i];
      const yv = s.y[i];
      if (!Number.isFinite(yv) || (chart.logX && xv <= 0)) { pen = false; continue; }
      d += `${pen ? 'L' : 'M'}${sx(xv).toFixed(1)},${sy(Math.max(ymin, Math.min(ymax, yv))).toFixed(1)}`;
      pen = true;
    }
    return { ...s, d };
  });

  const activeX = pick ?? cursorX ?? null;
  const readIdx = activeX !== null ? nearestIndex(chart.x, activeX) : null;

  const toX = (clientX: number) => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const f = (px - m.l) / (W - m.l - m.r);
    const lv = lx(xmin) + Math.max(0, Math.min(1, f)) * (lx(xmax) - lx(xmin));
    return chart.logX ? 10 ** lv : lv;
  };

  const onKey = (e: React.KeyboardEvent) => {
    const cur = readIdx ?? 0;
    const stepN = Math.max(1, Math.round(chart.x.length / 100));
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const ni = Math.max(0, Math.min(chart.x.length - 1, cur + (e.key === 'ArrowRight' ? stepN : -stepN)));
      setPick(chart.x[ni]);
      onPick?.(chart.x[ni]);
    }
    if (e.key === 'Escape') setPick(null);
  };

  const readout = readIdx !== null
    ? `${chart.xLabel} = ${fmt(chart.x[readIdx])} ${chart.xUnit}: ` + chart.series.map((s) => `${s.label} = ${fmt(s.y[readIdx])}`).join(' · ') + (chart.yUnit ? ` (${chart.yUnit})` : '')
    : 'Klicken oder mit ←/→ einen Zeitpunkt wählen, um exakte Werte abzulesen.';

  return (
    <figure className="chart" style={{ margin: 0 }}>
      <div className="chart-title" id={`${id}-t`}>{chart.title}</div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={(e) => { const x = toX(e.clientX); setPick(x); onPick?.(x); }}
        onPointerMove={(e) => { if (e.buttons) { const x = toX(e.clientX); setPick(x); onPick?.(x); } }}
      >
        <desc id={`${id}-d`}>{chart.description}</desc>
        <g className="grid">
          {yTicks.map((v) => <line key={v} x1={m.l} x2={W - m.r} y1={sy(v)} y2={sy(v)} />)}
        </g>
        {chart.bands?.map((b, i) => (
          <g key={i}>
            <rect className={`band ${i % 2 ? 'alt' : ''}`} x={sx(Math.max(b.from, xmin))} y={m.t} width={Math.max(0, sx(Math.min(b.to, xmax)) - sx(Math.max(b.from, xmin)))} height={H - m.t - m.b} />
            {sx(Math.min(b.to, xmax)) - sx(Math.max(b.from, xmin)) > 34 && (
              <text className="band-label" x={sx(Math.max(b.from, xmin)) + 3} y={m.t - (i % 2 ? 4 : 15)}>{b.label.split(':')[0].slice(0, 22)}</text>
            )}
          </g>
        ))}
        {chart.hlines?.filter((h) => h.y >= ymin && h.y <= ymax).map((h, i) => (
          <g key={i}>
            <line className="hline" x1={m.l} x2={W - m.r} y1={sy(h.y)} y2={sy(h.y)} />
            <text className="hline-label" x={W - m.r - 2} y={sy(h.y) - 3} textAnchor="end">{h.label}</text>
          </g>
        ))}
        {chart.vmarker && chart.vmarker.x >= xmin && chart.vmarker.x <= xmax && (
          <g>
            <line className="hline" x1={sx(chart.vmarker.x)} x2={sx(chart.vmarker.x)} y1={m.t} y2={H - m.b} />
            <text className="hline-label" x={sx(chart.vmarker.x) + 3} y={m.t + 10}>{chart.vmarker.label}</text>
          </g>
        )}
        {paths.map((p) => <path key={p.key} d={p.d} fill="none" stroke={p.color} strokeWidth={2} strokeDasharray={p.dash || undefined} strokeLinejoin="round" />)}
        <g className="axis">
          <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} />
          <line x1={m.l} x2={m.l} y1={m.t} y2={H - m.b} />
          {xTicks.map((v) => (
            <g key={v}>
              <line x1={sx(v)} x2={sx(v)} y1={H - m.b} y2={H - m.b + 4} />
              <text x={sx(v)} y={H - m.b + 16} textAnchor="middle">{fmt(v)}</text>
            </g>
          ))}
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={m.l - 4} x2={m.l} y1={sy(v)} y2={sy(v)} />
              <text x={m.l - 7} y={sy(v) + 4} textAnchor="end">{fmt(v)}</text>
            </g>
          ))}
          <text x={(m.l + W - m.r) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12, fill: 'var(--ink-2)' }}>{chart.xLabel}{chart.xUnit ? ` [${chart.xUnit}]` : ''}</text>
          <text transform={`translate(14 ${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle" style={{ fontSize: 12, fill: 'var(--ink-2)' }}>{chart.yLabel}{chart.yUnit ? ` [${chart.yUnit}]` : ''}</text>
        </g>
        {activeX !== null && activeX >= xmin && activeX <= xmax && readIdx !== null && (
          <g>
            <line className="cursor" x1={sx(chart.x[readIdx])} x2={sx(chart.x[readIdx])} y1={m.t} y2={H - m.b} />
            {chart.series.map((s, i) => Number.isFinite(s.y[readIdx]) && (
              <circle key={s.key} cx={sx(chart.x[readIdx])} cy={sy(Math.max(ymin, Math.min(ymax, s.y[readIdx])))} r={4} fill={COLORS[i % COLORS.length]} stroke="var(--panel)" strokeWidth={1.5} />
            ))}
          </g>
        )}
      </svg>
      <div className="chart-legend" aria-hidden="true">
        {allSeries.map((s) => (
          <span key={s.key}>
            <svg width="30" height="10"><line x1="0" x2="30" y1="5" y2="5" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash || undefined} /></svg>
            {s.label}
          </span>
        ))}
      </div>
      {pick !== null ? <div className="chart-readout" aria-live="polite">{readout} <button className="linklike" onClick={() => setPick(null)}>ausblenden</button></div> : <div className="sr-only" aria-live="polite">{readout}</div>}
      <details>
        <summary className="muted" style={{ fontWeight: 400, fontSize: '0.85rem' }}>Textbeschreibung des Diagramms</summary>
        <p style={{ fontSize: '0.9rem' }}>{chart.description}</p>
      </details>
    </figure>
  );
}
