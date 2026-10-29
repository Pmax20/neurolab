import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { go, parseHash } from './router';

export interface TourStep {
  route: string[]; // Seite, auf der der Schritt spielt
  target?: string; // CSS-Selektor des hervorgehobenen Elements
  mobileTarget?: string;
  title: string;
  text: string;
}

export const TOUR: TourStep[] = [
  { route: [], title: 'Willkommen bei NeuroLab', text: 'NeuroLab begleitet dich durchs Medizinstudium – zuerst mit den Fächern deines 1. Semesters: Anatomie, Chemie, Biologie, Physik, Histologie und Terminologie. Du siehst Strukturen, veränderst Simulationen und prüfst dein Wissen. Die Tour zeigt dir in einer Minute, wo du was findest.' },
  { route: [], target: '.hero .continue', title: 'Hier geht es weiter', text: 'Diese Karte bringt dich immer zur nächsten sinnvollen Lektion deines Semesters. Daneben siehst du deinen Fortschritt.' },
  { route: [], target: '.exam-card', title: 'Klausuren im Blick', text: 'Trag hier deine Klausur- und Testattermine ein. NeuroLab zählt die Tage herunter, zeigt, wie viele Lektionen des Fachs du schon hast, und stellt dir passende Übungsaufgaben zusammen.' },
  { route: [], target: '#nav', mobileTarget: '.tabbar', title: 'Die fünf Bereiche', text: 'Start, Lernen (alle Themen), Experimente, Üben und Fortschritt. Seltener benötigte Dinge wie den Vorlesungsimport findest du unter „Mehr“.' },
  { route: ['lektion', 'aktionspotenzial'], target: '.lesson-steps', title: 'Jede Lektion in fünf Schritten', text: 'Überblick → Mechanismus → Ausprobieren → Vertiefung → Üben. Du kannst frei springen; „Weiter“ unten führt dich der Reihe nach durch.' },
  { route: ['lektion', 'aktionspotenzial'], target: '.lesson-aside', title: 'Lernziele und Zusammenhänge', text: 'Rechts stehen die Lernziele der Lektion. Der Punkt davor füllt sich, sobald du die passenden Aufgaben sicher beherrschst. Verwandte Themen öffnen sich als Vorschau, ohne dass du die Lektion verlässt.' },
  { route: ['sim', 'aktionspotenzial'], target: '.info', title: 'Regler verändern das Ergebnis', text: 'In jeder Simulation stellst du hier Parameter ein. Jeder Regler wirkt wirklich auf die Berechnung. Unzulässige Werte werden abgefangen, „Zurücksetzen“ stellt die Standardwerte wieder her.' },
  { route: ['sim', 'aktionspotenzial'], target: '.playback', title: 'Animation steuern', text: 'Starten, anhalten, Schritt für Schritt vor und zurück oder direkt eine Phase wählen. Das Tempo ändert nur die Darstellung, nicht das Rechenergebnis.' },
  { route: ['sim', 'aktionspotenzial'], target: '.chart-area', title: 'Diagramme lesen', text: 'Über die Reiter wechselst du zwischen den Diagrammen. Tippe ins Diagramm oder nutze die Pfeiltasten, um exakte Werte abzulesen. Die gestrichelte Kurve ist die Referenz.' },
  { route: ['pruefung'], target: '[aria-label="Lernpfad"]', title: 'Üben und wiederholen', text: 'Wähle, wie du üben willst – auch Karteikarten, den Rechentrainer mit Einheitenprüfung und den Histologie-Simulator. Nach jeder Antwort bekommst du eine Erklärung, auch warum falsche Antworten nicht passen. Fällige Wiederholungen schlägt NeuroLab automatisch vor.' },
  { route: [], title: 'Gut zu wissen', text: 'Die Inhalte sind sorgfältig mit Quellen abgeglichen, aber noch nicht von einer Fachperson freigegeben – im Zweifel gilt deine Vorlesung. Dein Lernstand bleibt auf diesem Gerät (Übertragen über Einstellungen → Export). Die Tour startest du jederzeit über „Hilfe“ neu.' },
];

function findEl(sel?: string, mobileSel?: string): HTMLElement | null {
  if (!sel) return null;
  const mobile = window.matchMedia('(max-width: 820px)').matches;
  const s = mobile && mobileSel ? mobileSel : sel;
  const el = document.querySelector(s) as HTMLElement | null;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return el;
}

export function Tour({ onClose }: { onClose: (done: boolean) => void }) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const step = TOUR[i];

  useEffect(() => {
    const cur = parseHash().path;
    if (cur.join('/') !== step.route.join('/')) go(...step.route);
    setRect(null);
    let tries = 0;
    let t: any;
    const look = () => {
      const el = findEl(step.target, step.mobileTarget);
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
        requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
        return;
      }
      if (step.target && tries++ < 30) t = setTimeout(look, 100);
    };
    t = setTimeout(look, 120);
    return () => clearTimeout(t);
  }, [i, step]);

  useEffect(() => {
    const onResize = () => { const el = findEl(step.target, step.mobileTarget); if (el) setRect(el.getBoundingClientRect()); };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onResize, true); };
  }, [step]);

  useEffect(() => { cardRef.current?.focus(); }, [i]);

  const next = () => (i < TOUR.length - 1 ? setI(i + 1) : onClose(true));
  const prev = () => setI(Math.max(0, i - 1));
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose(false);
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  useLayoutEffect(() => {}, []);
  const pad = 8;
  let cardStyle: React.CSSProperties = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(380, vw - 24);
    const left = Math.max(12, Math.min(vw - w - 12, rect.left + rect.width / 2 - w / 2));
    const below = rect.bottom + 14;
    const above = rect.top - 14;
    if (vh - below > 230) cardStyle = { left, top: below };
    else if (above > 230) cardStyle = { left, top: Math.max(12, above - 220) };
    else cardStyle = { left: Math.max(12, Math.min(vw - w - 12, rect.right + 14 > vw - w ? 12 : rect.right + 14)), top: Math.max(12, Math.min(vh - 260, rect.top)) };
  }
  return (
    <>
      <div className="tour-backdrop" onClick={() => {}} style={rect ? undefined : { background: 'rgba(20,16,36,0.62)' }} />
      {rect && <div className="tour-hole" style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: Math.min(rect.height + pad * 2, window.innerHeight - 20) }} />}
      <div className="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-t" aria-describedby="tour-d" tabIndex={-1} ref={cardRef} onKeyDown={onKey} style={cardStyle}>
        <h2 id="tour-t">{step.title}</h2>
        <p id="tour-d">{step.text}</p>
        <div className="row between">
          <div className="dots" aria-label={`Schritt ${i + 1} von ${TOUR.length}`}>{TOUR.map((_, k) => <span key={k} className={k === i ? 'on' : ''} />)}</div>
          <div className="row">
            <button className="small ghost" onClick={() => onClose(false)}>Tour beenden</button>
            {i > 0 && <button className="small" onClick={prev}>Zurück</button>}
            <button className="small primary" onClick={next}>{i < TOUR.length - 1 ? 'Weiter' : 'Los geht’s'}</button>
          </div>
        </div>
      </div>
    </>
  );
}
