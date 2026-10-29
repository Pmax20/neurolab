import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { usePrefersReducedMotion } from './common';

export interface ThreeItem {
  id: string;
  label: string;
  object: THREE.Object3D;
  selectable: boolean;
}

export interface ThreeView {
  name: string;
  pos: [number, number, number];
  target?: [number, number, number];
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

interface Props {
  build: (scene: THREE.Scene) => ThreeItem[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  hidden?: Set<string>;
  views: ThreeView[];
  fallback: ReactNode;
  animate?: (t: number, items: ThreeItem[]) => void;
  deps?: unknown[];
  ariaLabel: string;
  background?: string;
}

/** Wiederverwendbarer 3D-Betrachter (Three.js). Biologische Berechnungen finden nicht hier statt. */
export function ThreeViewer({ build, selected, onSelect, hidden, views, fallback, animate, deps = [], ariaLabel }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [ok] = useState(() => webglAvailable());
  const [error, setError] = useState<string | null>(null);
  const ctx = useRef<{ renderer: THREE.WebGLRenderer; camera: THREE.PerspectiveCamera; controls: OrbitControls; scene: THREE.Scene; items: ThreeItem[]; render: () => void } | null>(null);
  const reduced = usePrefersReducedMotion();
  const sel = useRef(selected);
  sel.current = selected;
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!ok || !host.current) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e: any) {
      setError('3D-Darstellung konnte nicht gestartet werden (keine Hardwarebeschleunigung verfügbar).');
      return;
    }
    const el = host.current;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(...views[0].pos);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.1));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(5, 10, 7);
    scene.add(dir);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !reduced;
    controls.target.set(...(views[0].target ?? [0, 0, 0]));
    let items: ThreeItem[] = [];
    try {
      items = build(scene);
    } catch (e: any) {
      setError(`Das 3D-Modell konnte nicht geladen werden: ${e?.message ?? e}`);
    }
    for (const it of items) {
      it.object.traverse((o: any) => {
        if (o.isMesh) {
          o.userData.itemId = it.id;
          o.material = o.material.clone();
          o.userData.baseEmissive = o.material.emissive ? o.material.emissive.getHex() : 0;
          o.userData.baseOpacity = o.material.opacity;
          o.userData.baseTransparent = o.material.transparent;
        }
      });
    }
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      render();
    };
    const render = () => renderer.render(scene, camera);
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    controls.addEventListener('change', render);
    // Auswahl per Klick/Tippen (Raycasting)
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down = { x: 0, y: 0 };
    const pickAt = (cx: number, cy: number) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(scene.children, true).filter((h) => h.object.visible && h.object.userData.itemId);
      for (const h of hits) {
        const it = items.find((i) => i.id === h.object.userData.itemId);
        if (it && it.selectable && isVisible(h.object)) return it;
      }
      return null;
    };
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY }; };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return; // Drehen, kein Klick
      const it = pickAt(e.clientX, e.clientY);
      onSelect(it ? (it.id === sel.current ? null : it.id) : null);
    };
    const onMove = (e: PointerEvent) => {
      if (e.buttons) return;
      const it = pickAt(e.clientX, e.clientY);
      renderer.domElement.style.cursor = it ? 'pointer' : 'grab';
      setHoverLabel(it?.label ?? null);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointermove', onMove);
    ctx.current = { renderer, camera, controls, scene, items, render };
    resize();
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      controls.update();
      animate?.((now - t0) / 1000, items);
      render();
      raf = requestAnimationFrame(loop);
    };
    if (!reduced && (animate || controls.enableDamping)) raf = requestAnimationFrame(loop);
    else render();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.remove();
      scene.traverse((o: any) => {
        o.geometry?.dispose?.();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => m.dispose?.());
      });
      renderer.dispose();
      ctx.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok, reduced, ...deps]);

  // Hervorhebung und Sichtbarkeit
  useEffect(() => {
    const c = ctx.current;
    if (!c) return;
    for (const it of c.items) {
      it.object.visible = !hidden?.has(it.id);
      it.object.traverse((o: any) => {
        if (o.isMesh && o.material?.emissive) {
          o.material.emissive.setHex(it.id === selected ? 0x2a6f6a : o.userData.baseEmissive);
          const dim = selected !== null && it.id !== selected && it.selectable;
          o.material.transparent = dim ? true : o.userData.baseTransparent;
          o.material.opacity = dim ? Math.min(o.userData.baseOpacity, 0.3) : o.userData.baseOpacity;
          o.material.needsUpdate = true;
        }
      });
    }
    c.render();
  }, [selected, hidden, deps]);

  const setView = (v: ThreeView) => {
    const c = ctx.current;
    if (!c) return;
    c.camera.position.set(...v.pos);
    c.controls.target.set(...(v.target ?? [0, 0, 0]));
    c.controls.update();
    c.render();
  };
  const zoom = (f: number) => {
    const c = ctx.current;
    if (!c) return;
    const d = c.camera.position.clone().sub(c.controls.target).multiplyScalar(f);
    c.camera.position.copy(c.controls.target.clone().add(d));
    c.controls.update();
    c.render();
  };

  if (!ok || error) {
    return (
      <div>
        <div className="notice info">{error ?? 'Ihr Gerät bzw. Browser unterstützt keine 3D-Darstellung (WebGL). Es wird eine vereinfachte zweidimensionale Darstellung angezeigt.'}</div>
        {fallback}
      </div>
    );
  }
  return (
    <div className="figure">
      <div className="toolbar no-print" role="group" aria-label="Ansicht">
        {views.map((v) => <button key={v.name} className="small" onClick={() => setView(v)}>{v.name}</button>)}
        <button className="small" onClick={() => zoom(0.8)} aria-label="Vergrößern">＋</button>
        <button className="small" onClick={() => zoom(1.25)} aria-label="Verkleinern">－</button>
        <button className="small" onClick={() => { setView(views[0]); onSelect(null); }}>Zurücksetzen</button>
      </div>
      <div className="three-host" ref={host} role="application" aria-label={`${ariaLabel}. Mit Maus oder Finger drehen, mit Mausrad/zwei Fingern zoomen. Strukturen sind zusätzlich über die Liste auswählbar.`} />
      {hoverLabel && <div className="three-label">{hoverLabel}</div>}
    </div>
  );
}

function isVisible(o: THREE.Object3D) {
  let x: THREE.Object3D | null = o;
  while (x) {
    if (!x.visible) return false;
    x = x.parent;
  }
  return true;
}

export function mat(color: number | string, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  const m = new THREE.MeshStandardMaterial({ color: new THREE.Color(color as any), roughness: 0.55, metalness: 0.05, ...opts });
  m.userData.opacity = m.opacity;
  m.userData.transparent = m.transparent;
  return m;
}
