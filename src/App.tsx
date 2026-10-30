import { Component, useEffect, useState, type ReactNode } from 'react';
import { useRoute } from './ui/router';
import { Splitter } from './ui/common';
import { clearLoadIssues, getLoadIssues, setState, useStore } from './store/store';
import { Dashboard, Library, ModulePage, ModelLibrary } from './pages/Overview';
import { LessonPage } from './pages/LessonPage';
import { ExperimentsPage, SimPage } from './pages/Experiments';
import { AnalyticsPage, ExamPage } from './pages/Exam';
import { ImportPage, PathsPage, ReviewPage, SettingsPage, SourcesPage, FactcheckPage } from './pages/Manage';
import { Tour } from './ui/Tour';
import { CloudBadge, LoginGate } from './cloud/Account';
import { useCloud } from './cloud/sync';

class Boundary extends Component<{ children: ReactNode; resetKey: string }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidUpdate(p: { resetKey: string }) { if (p.resetKey !== this.props.resetKey && this.state.err) this.setState({ err: null }); }
  render() {
    if (this.state.err) return (
      <div className="notice danger" role="alert">
        <b>Dieser Bereich konnte nicht angezeigt werden.</b> {this.state.err.message}
        <p>Deine gespeicherten Daten sind davon nicht betroffen. Geh <a href="#/">zur Startseite</a> oder lade die Seite neu.</p>
        <button onClick={() => this.setState({ err: null })}>Erneut versuchen</button>
      </div>
    );
    return this.props.children;
  }
}

// Hauptbereiche (auch die mobile Tab-Leiste) und seltener genutzte Bereiche unter „Mehr“
const MAIN: { to: string; label: string; ico: string; match: string[] }[] = [
  { to: '', label: 'Start', ico: '⌂', match: [''] },
  { to: 'bibliothek', label: 'Lernen', ico: '▤', match: ['bibliothek', 'modul', 'lektion'] },
  { to: 'experimente', label: 'Experimente', ico: '⚗', match: ['experimente', 'sim'] },
  { to: 'pruefung', label: 'Üben', ico: '✎', match: ['pruefung'] },
  { to: 'analyse', label: 'Fortschritt', ico: '◔', match: ['analyse'] },
];
const MORE: [string, string][] = [
  ['lernpfade', 'Lernpfade'], ['import', 'Vorlesung importieren'], ['modelle', 'Modellbibliothek'], ['pruefbericht', 'Prüfbericht'], ['freigabe', 'Fachliche Freigabe'], ['quellen', 'Quellen'], ['einstellungen', 'Einstellungen'],
];

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--accent)" />
      <path d="M4,18 L10,18 L12,11 L15,25 L18,6 L21,20 L23,18 L28,18" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="18" cy="6" r="2.2" fill="var(--eosin)" />
    </svg>
  );
}

export function App() {
  const { path, query } = useRoute();
  const [navOpen, setNavOpen] = useState(false);
  const textScale = useStore((s) => s.settings.textScale);
  const reduced = useStore((s) => s.settings.reducedMotion);
  const tourDone = useStore((s) => s.settings.tourDone);
  const [tour, setTour] = useState(false);
  const [issues, setIssues] = useState(getLoadIssues());
  useEffect(() => { document.documentElement.style.setProperty('--text-scale', String(textScale)); }, [textScale]);
  useEffect(() => { document.documentElement.classList.toggle('reduced', reduced === 'an'); }, [reduced]);
  useEffect(() => { setNavOpen(false); }, [path.join('/')]);
  useEffect(() => { if (!tourDone && !navigator.webdriver) setTour(true); }, []); // eslint-disable-line
  const cloud = useCloud();
  // Zugang nur mit Konto (solange die Datenbank eingerichtet ist)
  // Nur in der lokalen Entwicklungsumgebung abschaltbar (für Bildschirmtests), nie in der veröffentlichten Seite
  const gateOff = import.meta.env.DEV && new URLSearchParams(window.location.search).has('ohne-login');
  if (cloud.status !== 'aus' && !gateOff) {
    if (!cloud.ready) return <LoginGate loading />;
    if (!cloud.email || cloud.recovery) return <LoginGate />;
  }
  const key = path.join('/');
  const cur = path[0] ?? '';
  let page: ReactNode;
  switch (cur) {
    case '': page = <Dashboard onTour={() => setTour(true)} />; break;
    case 'bibliothek': page = <Library />; break;
    case 'modul': page = <ModulePage id={path[1]} />; break;
    case 'lektion': page = <LessonPage key={path[1]} id={path[1]} />; break;
    case 'sim': page = <SimPage id={path[1]} />; break;
    case 'modelle': page = <ModelLibrary />; break;
    case 'experimente': page = <ExperimentsPage sub={path[1]} />; break;
    case 'pruefung': page = <ExamPage key={query.toString()} query={query} />; break;
    case 'analyse': page = <AnalyticsPage />; break;
    case 'lernpfade': page = <PathsPage id={path[1]} />; break;
    case 'import': page = <ImportPage id={path[1]} />; break;
    case 'freigabe': page = <ReviewPage />; break;
    case 'pruefbericht': page = <FactcheckPage />; break;
    case 'quellen': page = <SourcesPage />; break;
    case 'einstellungen': page = <SettingsPage onTour={() => setTour(true)} />; break;
    default: page = <div className="notice danger">Diese Seite gibt es nicht. <a href="#/">Zur Startseite</a></div>;
  }
  const isMain = (m: (typeof MAIN)[number]) => m.match.includes(cur);
  const inMore = MORE.some(([t]) => t === cur);
  return (
    <div className="app">
      <a href="#main" className="sr-only">Zum Inhalt springen</a>
      <header className="topbar">
        <button className="menu-btn small" aria-expanded={navOpen} aria-controls="nav" onClick={() => setNavOpen((v) => !v)}>☰ Menü</button>
        <a href="#/" className="brand"><Logo /> NeuroLab</a>
        <span className="spacer" />
        <CloudBadge />
        <button className="small" onClick={() => setTour(true)} aria-label="Hilfe: Tutorial starten">? Hilfe</button>
      </header>
      <nav id="nav" className={`nav ${navOpen ? 'open' : ''}`} aria-label="Hauptnavigation">
        {MAIN.map((m) => <a key={m.label} href={`#/${m.to}`} aria-current={isMain(m) ? 'page' : undefined}><span className="ico" aria-hidden="true">{m.ico}</span>{m.label}</a>)}
        <details className="more" open={inMore || undefined}>
          <summary><span className="ico chev" aria-hidden="true">›</span>Mehr</summary>
          {MORE.map(([t, l]) => <a key={t} href={`#/${t}`} aria-current={cur === t ? 'page' : undefined}>{l}</a>)}
        </details>
        {!tourDone && (
          <div className="help-card">
            Neu hier? Die Tour erklärt dir die App in einer Minute.
            <button className="small" onClick={() => setTour(true)}>Tutorial starten</button>
          </div>
        )}
      </nav>
      <Splitter cssVar="--nav-w" min={190} max={360} label="Navigationsbereich" />
      <main id="main" tabIndex={-1}>
        {issues.length > 0 && (
          <div className="notice" role="alert">{issues.map((i) => <div key={i}>{i}</div>)}<button className="small" onClick={() => { clearLoadIssues(); setIssues([]); }}>Verstanden</button></div>
        )}
        <Boundary resetKey={key}>{page}</Boundary>
      </main>
      <nav className="tabbar" aria-label="Schnellnavigation">
        {MAIN.map((m) => <a key={m.label} href={`#/${m.to}`} aria-current={isMain(m) ? 'page' : undefined}><span className="ico" aria-hidden="true">{m.ico}</span>{m.label}</a>)}
      </nav>
      {tour && <Tour onClose={(done) => { setTour(false); setState((s) => ({ ...s, settings: { ...s.settings, tourDone: true } })); if (done) location.hash = '#/'; }} />}
    </div>
  );
}
