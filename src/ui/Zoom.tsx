import { useRef, useState, type ReactNode } from 'react';

/** Vergrößerbarer Bildbereich: Knöpfe + / −, Strg+Mausrad, Verschieben durch Ziehen oder Scrollen. */
export function ZoomBox({ children, label = 'Abbildung', max = 4 }: { children: ReactNode; label?: string; max?: number }) {
  const [z, setZ] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(null);
  const set = (nz: number) => {
    const el = ref.current;
    const v = Math.min(max, Math.max(1, Math.round(nz * 4) / 4));
    if (el) {
      // Mittelpunkt beibehalten
      const cx = (el.scrollLeft + el.clientWidth / 2) / z;
      const cy = (el.scrollTop + el.clientHeight / 2) / z;
      requestAnimationFrame(() => { el.scrollLeft = cx * v - el.clientWidth / 2; el.scrollTop = cy * v - el.clientHeight / 2; });
    }
    setZ(v);
  };
  return (
    <div className="zoombox">
      <div className="zoom-tools no-print" role="group" aria-label={`${label} vergrößern`}>
        <button className="small" onClick={() => set(z - 0.5)} disabled={z <= 1} aria-label="Verkleinern">−</button>
        <span className="muted" style={{ minWidth: 42, textAlign: 'center', fontSize: '0.85rem' }}>{Math.round(z * 100)} %</span>
        <button className="small" onClick={() => set(z + 0.5)} disabled={z >= max} aria-label="Vergrößern">+</button>
        {z > 1 && <button className="small ghost" onClick={() => set(1)}>Zurücksetzen</button>}
      </div>
      <div ref={ref} className={`zoom-area ${z > 1 ? 'zoomed' : ''}`}
        onWheel={(e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); set(z + (e.deltaY < 0 ? 0.25 : -0.25)); } }}
        onPointerDown={(e) => { if (z > 1 && ref.current && e.pointerType === 'mouse') drag.current = { x: e.clientX, y: e.clientY, l: ref.current.scrollLeft, t: ref.current.scrollTop }; }}
        onPointerMove={(e) => { const d = drag.current; if (d && ref.current) { ref.current.scrollLeft = d.l - (e.clientX - d.x); ref.current.scrollTop = d.t - (e.clientY - d.y); } }}
        onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
        <div style={{ width: `${z * 100}%` }}>{children}</div>
      </div>
    </div>
  );
}
