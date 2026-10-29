import type { ReactNode } from 'react';
import { structureById } from '../content';

export interface FigProps {
  sel?: string | null;
  onSel?: (id: string) => void;
  isolate?: boolean;
  labels?: boolean;
  markers?: { n: number; structure: string }[];
  /** Hervorhebung im Orientierungsmodus: [Struktur A, Struktur B] */
  hl?: [string, string] | null;
  /** markiert eine Struktur als richtig (grün) oder falsch (rot), z. B. im Beschriftungsdrill */
  mark?: { id: string; ok: boolean } | null;
}

export type Label = { a: [number, number]; t: [number, number] };

export function A({ id, p, children }: { id: string; p: FigProps; children: ReactNode }) {
  const s = structureById(id);
  const interactive = !!p.onSel;
  const cls = [
    interactive ? 'struct' : '',
    p.sel === id ? 'selected' : '',
    p.isolate && p.sel && p.sel !== id ? 'dim' : '',
    p.hl?.[0] === id ? 'hl-a' : '', p.hl?.[1] === id ? 'hl-b' : '',
    p.mark?.id === id ? (p.mark.ok ? 'mark-ok' : 'mark-bad') : '',
  ].join(' ');
  return (
    <g className={cls} role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : undefined} aria-label={interactive ? s?.deName : undefined} aria-pressed={interactive ? p.sel === id : undefined}
      onClick={interactive ? () => p.onSel!(id) : undefined}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.onSel!(id); } } : undefined}>
      {interactive && <title>{s?.deName}</title>}
      {children}
    </g>
  );
}

export function Overlay({ L, p }: { L: Record<string, Label>; p: FigProps }) {
  const line = (a: [number, number], t: [number, number]) => <line x1={a[0]} y1={a[1]} x2={t[0]} y2={t[1]} stroke="#6b6680" strokeWidth={1.2} />;
  return (
    <g aria-hidden="true" className="hlabel">
      {p.labels && !p.markers && Object.entries(L).map(([id, { a, t }]) => (!p.isolate || !p.sel || p.sel === id) && (
        <g key={id}>{line(a, t)}<circle cx={a[0]} cy={a[1]} r={2.5} fill="#6b6680" /><text x={t[0] + (t[0] < a[0] ? -5 : 5)} y={t[1] + 4} textAnchor={t[0] < a[0] ? 'end' : 'start'} style={{ fontSize: 14 }}>{structureById(id)?.deName}</text></g>
      ))}
      {p.markers?.map((m) => {
        const l = L[m.structure];
        if (!l) return null;
        return (
          <g key={m.n}>{line(l.a, l.t)}<circle cx={l.a[0]} cy={l.a[1]} r={2.5} fill="#6b6680" />
            <circle cx={l.t[0]} cy={l.t[1]} r={13} fill="var(--ink)" /><text x={l.t[0]} y={l.t[1] + 5} textAnchor="middle" fill="var(--bg)" style={{ fontSize: 14, fontWeight: 700, stroke: 'none' }}>{m.n}</text></g>
        );
      })}
    </g>
  );
}

