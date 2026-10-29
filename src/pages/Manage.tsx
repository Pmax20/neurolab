import { useState } from 'react';
import { MODULES, LESSONS, STRUCTURES, TASKS, lessonById, tasksForLesson } from '../content';
import { MODELS, modelById } from '../engine/registry';
import { SOURCES } from '../content/sources';
import { STATUS_LABEL, ORIGIN_LABEL, type ReviewStatus } from '../content/types';
import { setState, useStore, exportData, importData } from '../store/store';
import { uid, type ImportedDoc, type LearningPath } from '../store/state';
import { analyzePages, pdfToPages, textToPages } from '../store/importer';
import { download, StatusBadge } from '../ui/common';
import { ExamDates } from '../ui/semester';
import { href, go } from '../ui/router';
import { DeleteButton } from './Exam';
import { FACTCHECKS, FACTCHECK_DATE, REVIEWED_WITHOUT_WEB } from '../content/factcheck';

// ---------------------------------------------------------------------------
// Vorlesungsimport
// ---------------------------------------------------------------------------

export function ImportPage({ id }: { id?: string }) {
  const docs = useStore((s) => s.imports);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const onFile = async (f: File) => {
    setErr(null);
    try {
      let pages;
      if (/\.pdf$/i.test(f.name) || f.type === 'application/pdf') {
        setBusy('PDF wird gelesen …');
        pages = await pdfToPages(await f.arrayBuffer(), (p, n) => setBusy(`Seite ${p} von ${n} wird gelesen …`));
        const chars = pages.reduce((a, p) => a + p.lines.reduce((b, l) => b + l.text.length, 0), 0);
        if (chars < 30 * Math.max(1, pages.length) / 4) {
          setBusy(null);
          setErr('In dieser PDF wurde (fast) kein Text gefunden. Vermutlich handelt es sich um eingescannte Seiten. Dafür wäre eine Texterkennung (OCR) nötig, die in dieser Browser-Version nicht enthalten ist. Tipp: In vielen PDF-Programmen kann man Text erkennen lassen und die Datei danach erneut importieren.');
          return;
        }
      } else if (/\.(txt|md|markdown|text)$/i.test(f.name) || f.type.startsWith('text/')) {
        pages = textToPages(await f.text());
      } else {
        setErr('Dieses Dateiformat wird noch nicht unterstützt. Möglich sind PDF sowie Textdateien (.txt, .md).');
        return;
      }
      setBusy('Themen und Fachbegriffe werden zugeordnet …');
      const doc = analyzePages(f.name, pages);
      setState((s) => ({ ...s, imports: [...s.imports, doc] }));
      setBusy(null);
      go('import', doc.id);
    } catch (e: any) {
      setBusy(null);
      setErr(`Das Dokument konnte nicht verarbeitet werden (${e?.message ?? e}). Möglicherweise ist die Datei beschädigt oder passwortgeschützt.`);
    }
  };
  const doc = id ? docs.find((d) => d.id === id) : undefined;
  if (doc) return <ImportDetail doc={doc} />;
  return (
    <div className="stack">
      <div className="page-head"><div><h1>Vorlesung importieren</h1><p className="muted" style={{ margin: 0 }}>Lade Folien als PDF oder Text – NeuroLab findet die passenden Lektionen. Die Datei bleibt auf diesem Gerät.</p></div></div>
      <section className="card">
        <label className="btn primary" style={{ cursor: 'pointer' }}>
          Datei auswählen (PDF, TXT, MD)
          <input type="file" accept=".pdf,.txt,.md,application/pdf,text/plain" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
        </label>
        {busy && <p aria-live="polite" style={{ marginTop: 10 }}>{busy}</p>}
        {err && <div className="notice danger" role="alert">{err}</div>}
        <details style={{ marginTop: 12 }}><summary className="muted" style={{ fontWeight: 400 }}>Wie zuverlässig ist das?</summary><p className="muted" style={{ fontSize: '0.9rem' }}>Automatisch erzeugte Erklärungen und Aufgaben gelten nicht als medizinisch geprüft und bleiben als „fachlich zu prüfen“ gekennzeichnet, bis du oder eine Fachperson sie freigibt. Bei widersprüchlichen Angaben zeigt NeuroLab den Konflikt an, statt selbst zu entscheiden.</p></details>
      </section>
      {docs.length > 0 && (
        <section className="card">
          <h3>Importierte Dokumente</h3>
          <ul className="rows">{docs.map((d) => <li key={d.id}><div className="row-inner"><div className="grow"><a className="t" href={href('import', d.id)}>{d.name}</a><div className="d">{d.pages} Seiten · {new Date(d.createdAt).toLocaleDateString('de-DE')}</div></div><button className="small ghost" onClick={() => setState((s) => ({ ...s, imports: s.imports.filter((x) => x.id !== d.id) }))} aria-label={`${d.name} entfernen`}>Entfernen</button></div></li>)}</ul>
        </section>
      )}
    </div>
  );
}

function ImportDetail({ doc }: { doc: ImportedDoc }) {
  const lessons = [...new Set(doc.matches.map((m) => m.lesson))];
  const update = (fn: (d: ImportedDoc) => ImportedDoc) => setState((s) => ({ ...s, imports: s.imports.map((d) => (d.id === doc.id ? fn(d) : d)) }));
  const createPath = () => {
    const p: LearningPath = { id: uid('lp'), name: doc.name.replace(/\.[^.]+$/, ''), lessons, docs: [doc.id], createdAt: Date.now(), done: [], openQuestions: doc.unknownTerms.length ? `Begriffe aus der Unterlage ohne passenden Lerninhalt: ${doc.unknownTerms.slice(0, 8).map((u) => u.term).join(', ')}` : '' };
    setState((s) => ({ ...s, paths: [...s.paths, p] }));
    go('lernpfade', p.id);
  };
  return (
    <div className="stack">
      <div className="page-head">
        <div><div className="crumbs"><a href="#/import">Vorlesung importieren</a> › {doc.name}</div><h1>{doc.name}</h1><p className="muted" style={{ margin: 0 }}>{doc.pages} Seiten · importiert am {new Date(doc.createdAt).toLocaleString('de-DE')}</p></div>
        <button className="primary" onClick={createPath} disabled={!lessons.length}>Lernpfad aus diesem Dokument erstellen</button>
      </div>
      {doc.conflicts.length > 0 && (
        <section className="card">
          <h3>⚠ Abweichungen zu den Modellwerten</h3>
          <p className="muted" style={{ fontSize: '0.9rem' }}>NeuroLab entscheidet nicht, was stimmt – bitte mit Vorlesung oder Lehrbuch klären.</p>
          <ul className="list">{doc.conflicts.map((c, i) => <li key={i}><b>{c.topic}</b> (Seite {c.page}): „{c.text}“<br /><small>{c.modelValue}</small></li>)}</ul>
        </section>
      )}
      <section className="card">
        <h3>Passende Lektionen ({lessons.length})</h3>
        {lessons.length ? (
          <ul className="rows">{lessons.map((l) => {
            const ms = doc.matches.filter((m) => m.lesson === l);
            const pages = [...new Set(ms.flatMap((m) => m.pages))].sort((x, y) => x - y);
            return <li key={l}><a href={href('lektion', l)}><div className="grow"><div className="t">{lessonById(l)?.title}</div><div className="d">Folien S. {pages.slice(0, 6).join(', ')}{pages.length > 6 ? ' …' : ''}</div></div><span className="muted">›</span></a></li>;
          })}</ul>
        ) : <p className="muted">Keine bekannten Fachbegriffe gefunden.</p>}
      </section>
      <details className="card">
        <summary>Begriffe ohne passende Lektion ({doc.unknownTerms.length})</summary>
        <p className="muted" style={{ fontSize: '0.85rem' }}>Automatische Erkennung, kann ungenau sein.</p>
        {doc.unknownTerms.length ? <div className="row">{doc.unknownTerms.map((u) => <span key={u.term} className="badge warn" title={`Seiten ${u.pages.join(', ')}`}>{u.term} ({u.count}×)</span>)}</div> : <p className="muted">Keine.</p>}
      </details>
      <details className="card">
        <summary>Vorschläge für Erklärungen und Aufgaben ({doc.suggestions.length})</summary>
        <p className="muted" style={{ fontSize: '0.88rem' }}>Aus „{doc.name}“ übernommen bzw. automatisch erzeugt. Prüfe jeden Vorschlag und gib ihn frei oder verwirf ihn.</p>
        <ul className="rows">
          {doc.suggestions.map((s) => (
            <li key={s.id}><div className="row-inner">
              <div className="grow">
                <div>{s.text}</div>
                {s.answer && <div className="d">Lösung: {s.answer}</div>}
                <div className="d">{s.kind === 'erklaerung' ? 'Erklärung aus der Quelle' : 'Aufgabe, automatisch erzeugt'} · S. {s.page} · {lessonById(s.lesson ?? '')?.title}</div>
              </div>
              <select value={s.status} onChange={(e) => update((d) => ({ ...d, suggestions: d.suggestions.map((x) => (x.id === s.id ? { ...x, status: e.target.value as ReviewStatus } : x)) }))} aria-label="Prüfstatus" style={{ maxWidth: 180 }}>
                {(Object.keys(STATUS_LABEL) as ReviewStatus[]).map((k) => <option key={k} value={k}>{STATUS_LABEL[k]}</option>)}
              </select>
            </div></li>
          ))}
        </ul>
        {!doc.suggestions.length && <p className="muted">Keine Vorschläge erzeugt.</p>}
      </details>
      <details className="card">
        <summary>Gliederung ({doc.sections.length})</summary>
        {doc.sections.length ? <ul className="list">{doc.sections.map((s, i) => <li key={i}>{s.title} <small className="muted">S. {s.page}</small></li>)}</ul> : <p className="muted">Keine Überschriften erkannt.</p>}
      </details>
      <details className="card"><summary>Extrahierter Text (Vorschau)</summary><pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{doc.textPreview}</pre></details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lernpfade
// ---------------------------------------------------------------------------

export function PathsPage({ id }: { id?: string }) {
  const paths = useStore((s) => s.paths);
  const lessonsDone = useStore((s) => s.lessons);
  const docs = useStore((s) => s.imports);
  const [name, setName] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const p = id ? paths.find((x) => x.id === id) : undefined;
  if (p) {
    const upd = (fn: (x: LearningPath) => LearningPath) => setState((s) => ({ ...s, paths: s.paths.map((y) => (y.id === p.id ? fn(y) : y)) }));
    const done = p.lessons.filter((l) => p.done.includes(l) || lessonsDone[l]?.completed);
    return (
      <div className="stack">
        <div className="page-head"><div><div className="crumbs"><a href="#/lernpfade">Lernpfade</a> › {p.name}</div><h1>{p.name}</h1><p className="muted" style={{ margin: 0 }}>{done.length} von {p.lessons.length} Abschnitten bearbeitet</p></div></div>
        <div className="meter"><div style={{ width: `${(done.length / Math.max(1, p.lessons.length)) * 100}%` }} /></div>
        {p.docs.length > 0 && <p className="muted" style={{ margin: 0 }}>Aus: {p.docs.map((d) => { const doc = docs.find((x) => x.id === d); return doc ? <a key={d} href={href('import', d)}>{doc.name}</a> : <span key={d}>entferntes Dokument</span>; })}</p>}
        <ul className="rows">
          {p.lessons.map((lid) => {
            const l = lessonById(lid);
            if (!l) return null;
            const isDone = done.includes(lid);
            return (
              <li key={lid}><div className="row-inner">
                <input type="checkbox" checked={isDone} onChange={() => upd((x) => ({ ...x, done: x.done.includes(lid) ? x.done.filter((y) => y !== lid) : [...x.done, lid] }))} aria-label={`${l.title} als bearbeitet markieren`} />
                <a className="grow t" href={href('lektion', lid)} style={{ fontWeight: 700 }}>{l.title}</a>
                <a className="btn small" href={`#/pruefung?lektion=${lid}`}>Üben</a>
              </div></li>
            );
          })}
        </ul>
        <details className="card" open={!!p.openQuestions || undefined}>
          <summary>Offene Fragen und Notizen</summary>
          <textarea value={p.openQuestions} onChange={(e) => upd((x) => ({ ...x, openQuestions: e.target.value }))} aria-label="Offene Wissensfragen" style={{ marginTop: 8 }} />
        </details>
        <button className="ghost small" style={{ alignSelf: 'flex-start' }} onClick={() => { setState((s) => ({ ...s, paths: s.paths.filter((x) => x.id !== p.id) })); go('lernpfade'); }}>Lernpfad löschen</button>
      </div>
    );
  }
  return (
    <div className="stack">
      <div className="page-head"><div><h1>Lernpfade</h1><p className="muted" style={{ margin: 0 }}>Themen für eine Vorlesung oder Prüfung bündeln.</p></div><a className="btn" href="#/import">Aus Unterlagen erstellen</a></div>
      {paths.length > 0 && <ul className="rows">{paths.map((x) => <li key={x.id}><a href={href('lernpfade', x.id)}><div className="grow"><div className="t">{x.name}</div><div className="d">{x.lessons.length} Themen</div></div><span className="muted">›</span></a></li>)}</ul>}
      <section className="card">
        <h3>Neuen Lernpfad anlegen</h3>
        <label className="field"><span className="lab"><b>Name (z. B. Vorlesung oder Prüfung)</b></span><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Physiologie-Testat Nerv/Muskel" /></label>
        <b>Themen {sel.length > 0 && <span className="muted" style={{ fontWeight: 400 }}>({sel.length} gewählt)</span>}</b>
        <div className="check-group">
          {MODULES.map((m) => (
            <div key={m.id}>
              <h4>{m.title}</h4>
              {m.lessons.map((lid) => <label key={lid}><input type="checkbox" checked={sel.includes(lid)} onChange={() => setSel((x) => (x.includes(lid) ? x.filter((y) => y !== lid) : [...x, lid]))} /> {lessonById(lid)?.title}</label>)}
            </div>
          ))}
        </div>
        <button className="primary" style={{ marginTop: 10 }} disabled={!name || !sel.length} onClick={() => { const np: LearningPath = { id: uid('lp'), name, lessons: sel, docs: [], createdAt: Date.now(), done: [], openQuestions: '' }; setState((s) => ({ ...s, paths: [...s.paths, np] })); go('lernpfade', np.id); }}>Lernpfad anlegen</button>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fachliche Prüfung und Freigabe
// ---------------------------------------------------------------------------

export function ReviewPage() {
  const reviews = useStore((s) => s.reviews);
  const reviewer = useStore((s) => s.settings.reviewerName);
  const [filter, setFilter] = useState<'alle' | 'offen'>('offen');
  const [kind, setKind] = useState('Lektion');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(20);
  const items = [
    ...LESSONS.map((l) => ({ id: `lesson:${l.id}`, kind: 'Lektion', title: l.title, status: l.status, link: href('lektion', l.id) })),
    ...MODELS.map((m) => ({ id: `model:${m.id}`, kind: 'Simulationsmodell', title: m.title, status: m.status, link: href('sim', m.id) })),
    ...STRUCTURES.map((s) => ({ id: `structure:${s.id}`, kind: 'Struktur', title: s.deName, status: s.status, link: href('lektion', s.lessons[0]) })),
    ...TASKS.map((t) => ({ id: `task:${t.id}`, kind: 'Aufgabe', title: t.prompt.slice(0, 110), status: t.status, link: href('lektion', t.lessons[0]) })),
  ];
  const eff = (i: (typeof items)[number]) => reviews[i.id]?.status ?? i.status;
  const isDone = (i: (typeof items)[number]) => ['geprueft', 'freigegeben'].includes(eff(i));
  const ofKind = items.filter((i) => i.kind === kind);
  const shown = ofKind.filter((i) => (filter === 'alle' || !isDone(i)) && (!q || i.title.toLowerCase().includes(q.toLowerCase())));
  const set = (id: string, status: ReviewStatus, note?: string) => setState((s) => ({ ...s, reviews: { ...s.reviews, [id]: { status, reviewer: s.settings.reviewerName, date: Date.now(), note: note ?? s.reviews[id]?.note ?? '' } } }));
  const doneAll = items.filter(isDone).length;
  const KINDS: [string, string][] = [['Lektion', 'Lektionen'], ['Simulationsmodell', 'Modelle'], ['Struktur', 'Strukturen'], ['Aufgabe', 'Aufgaben']];
  return (
    <div className="stack" style={{ maxWidth: 920 }}>
      <div className="page-head"><div><h1>Fachliche Freigabe</h1><p className="muted" style={{ margin: 0 }}>Für Dozent:innen oder Tutor:innen: Inhalte prüfen und freigeben.</p></div></div>
      <section className="card">
        <div className="progressline"><span><b>{doneAll}</b> von {items.length} geprüft</span><div className="meter"><div style={{ width: `${(doneAll / items.length) * 100}%` }} /></div></div>
        <label className="field" style={{ maxWidth: 420, marginBottom: 0 }}><span className="lab"><b>Dein Name</b></span><input type="text" value={reviewer} onChange={(e) => setState((s) => ({ ...s, settings: { ...s.settings, reviewerName: e.target.value } }))} placeholder="wird mit Datum gespeichert" /></label>
        {!reviewer && <p className="muted" style={{ marginBottom: 0 }}>Erst mit Namen lassen sich Freigaben setzen – so bleiben sie nachvollziehbar.</p>}
      </section>
      <div className="toolbar-line">
        <div className="seg" role="tablist" aria-label="Inhaltsart">
          {KINDS.map(([k, l]) => <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setLimit(20); }}>{l} <span className="muted">{items.filter((i) => i.kind === k && !isDone(i)).length}</span></button>)}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Suchen …" aria-label="Inhalte durchsuchen" style={{ flex: 1, minWidth: 160 }} />
        <label className="row" style={{ gap: 6 }}><input type="checkbox" checked={filter === 'alle'} onChange={(e) => setFilter(e.target.checked ? 'alle' : 'offen')} /> auch geprüfte</label>
      </div>
      <ul className="rows">
        {shown.slice(0, limit).map((i) => (
          <li key={i.id}><div className="row-inner">
            <div className="grow">
              <a className="t" href={i.link} style={{ fontWeight: 400 }}>{i.title}</a>
              {reviews[i.id] && <div className="d">{reviews[i.id].reviewer || 'ohne Namen'}, {new Date(reviews[i.id].date).toLocaleDateString('de-DE')}{reviews[i.id].note ? `: ${reviews[i.id].note}` : ''}</div>}
              {reviewer && (
                <details style={{ marginTop: 4 }}>
                  <summary className="muted" style={{ fontWeight: 400, fontSize: '0.85rem' }}>Anmerkung</summary>
                  <input type="text" placeholder="Anmerkung" defaultValue={reviews[i.id]?.note ?? ''} onBlur={(e) => e.target.value !== (reviews[i.id]?.note ?? '') && set(i.id, eff(i), e.target.value)} style={{ width: '100%', marginTop: 4 }} aria-label="Anmerkung" />
                </details>
              )}
            </div>
            <select value={eff(i)} disabled={!reviewer} onChange={(e) => set(i.id, e.target.value as ReviewStatus)} aria-label={`Status für ${i.title}`} style={{ maxWidth: 190 }}>
              {(Object.keys(STATUS_LABEL) as ReviewStatus[]).map((k) => <option key={k} value={k}>{STATUS_LABEL[k]}</option>)}
            </select>
          </div></li>
        ))}
      </ul>
      {!shown.length && <p className="muted">{filter === 'offen' ? 'Alles in diesem Bereich ist geprüft.' : 'Nichts gefunden.'}</p>}
      {shown.length > limit && <button onClick={() => setLimit((l) => l + 30)}>Weitere {Math.min(30, shown.length - limit)} anzeigen ({shown.length - limit} übrig)</button>}
      <div><button className="small ghost" onClick={() => download('neurolab-freigaben.json', JSON.stringify(reviews, null, 2))}>Freigaben exportieren</button></div>
    </div>
  );
}

export function SourcesPage() {
  return (
    <div className="stack">
      <div className="page-head"><div><h1>Quellenverzeichnis</h1><p className="muted" style={{ margin: 0 }}>Alle verwendeten Quellen. Die konkrete Fundstelle steht jeweils am Inhalt.</p></div></div>
      <section className="card">
        <ul className="rows">{SOURCES.map((s) => <li key={s.id}><div className="row-inner"><div className="grow"><div><b>{s.authors}</b>: <i>{s.title}</i></div><div className="d">{[s.edition, s.publisher, s.year].filter(Boolean).join(', ')}{s.lastChecked ? ` · zuletzt geprüft ${s.lastChecked}` : ''}</div></div></div></li>)}</ul>
      </section>
      <details className="card">
        <summary>Was bedeuten die Herkunftsangaben?</summary>
        <ul>{Object.entries(ORIGIN_LABEL).map(([k, v]) => <li key={k}>{v}</li>)}</ul>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Einstellungen
// ---------------------------------------------------------------------------

export function SettingsPage({ onTour }: { onTour?: () => void }) {
  const st = useStore((s) => s.settings);
  const [msg, setMsg] = useState<string | null>(null);
  const set = (k: keyof typeof st, v: any) => setState((s) => ({ ...s, settings: { ...s.settings, [k]: v } }));
  return (
    <div className="stack">
      <h1>Einstellungen</h1>
      <section className="card">
        <h3>Dein Studium</h3>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <label className="field" style={{ margin: 0 }}><span className="lab"><b>Name</b></span><input type="text" value={st.name} onChange={(e) => set('name', e.target.value)} placeholder="für die Begrüßung" /></label>
          <label className="field" style={{ margin: 0 }}><span className="lab"><b>Fachsemester</b></span>
            <select value={st.semester} onChange={(e) => set('semester', Number(e.target.value))}>{[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}. Semester</option>)}</select>
          </label>
        </div>
        <p className="muted" style={{ fontSize: '0.88rem' }}>Die Fächer sind nach dem vorklinischen Studienplan der Universität Leipzig sortiert: im 1. Semester Chemie, Biologie, Physik, Histologie und Terminologie; Physiologie und Biochemie ab dem 3. Semester. Startseite und „Lernen“ zeigen zuerst die Fächer deines Semesters.</p>
        <h4>Klausuren und Testate</h4>
        <ExamDates />
      </section>
      <section className="card">
        <h3>Hilfe</h3>
        <p>Die Tour erklärt Startseite, Lektionen, Simulationen und Übungen. Kurze Hinweise in den Simulationen kannst du einzeln ausblenden.</p>
        <div className="row">
          <button className="primary" onClick={onTour}>Tutorial starten</button>
          <button onClick={() => setState((s) => ({ ...s, settings: { ...s.settings, hints: {} } }))}>Ausgeblendete Hinweise wieder anzeigen</button>
        </div>
      </section>
      <section className="card">
        <h3>Darstellung</h3>
        <div className="field"><span className="lab"><b>Bewegung und Animationen</b></span>
          <div className="row">{([['system', 'wie Systemeinstellung'], ['an', 'reduziert'], ['aus', 'normal']] as const).map(([k, l]) => <button key={k} className="small" aria-pressed={st.reducedMotion === k} onClick={() => set('reducedMotion', k)}>{l}</button>)}</div>
          <span className="hint">Bei reduzierter Bewegung starten Animationen nicht automatisch; alle Schritte bleiben manuell und statisch untersuchbar.</span>
        </div>
        <div className="field"><span className="lab"><b>Textgröße</b><span>{Math.round(st.textScale * 100)} %</span></span><input type="range" min={0.85} max={1.4} step={0.05} value={st.textScale} onChange={(e) => set('textScale', Number(e.target.value))} aria-label="Textgröße" /></div>
        <label className="row"><input type="checkbox" checked={st.showAdvanced} onChange={(e) => set('showAdvanced', e.target.checked)} /> Erweiterte Simulationsparameter standardmäßig anzeigen</label>
      </section>
      <section className="card">
        <h3>Daten</h3>
        <p>Alle Daten (Lernstand, Notizen, Experimente, Importe) werden nur lokal in diesem Browser gespeichert. Es gibt keine Nutzerkonten und keine Übertragung an einen Server. Zum Übertragen auf ein anderes Gerät (z. B. MacBook ↔ iPhone) exportieren und dort importieren.</p>
        <div className="row">
          <button onClick={() => download(`neurolab-lernstand-${new Date().toISOString().slice(0, 10)}.json`, exportData())}>Daten exportieren</button>
          <label className="btn">Daten importieren<input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setMsg(importData(await f.text()).message); e.target.value = ''; }} /></label>
          <DeleteButton />
        </div>
        {msg && <div className="notice info" role="status">{msg}</div>}
      </section>
      <section className="card">
        <h3>Über NeuroLab</h3>
        <p>Version 1.0 · Lern- und Simulationssystem für die medizinische Ausbildung. NeuroLab ist eine Bildungsanwendung und kein Medizinprodukt: Es stellt keine Diagnosen und gibt keine Therapieempfehlungen für reale Personen. Klinische Beispiele sind fiktive Lehrfälle. Die Simulationen sind didaktische Modelle und keine klinisch validierten Systeme.</p>
        <p className="muted">Inhalte: {LESSONS.length} Lektionen · {TASKS.length} Aufgaben · {MODELS.length} Simulationsmodelle · {STRUCTURES.length} Strukturen. <a href="#/modelle">Modellbibliothek</a> · <a href="#/quellen">Quellen</a> · <a href="#/freigabe">Fachliche Freigabe</a></p>
      </section>
    </div>
  );
}

void modelById;

// ---------------------------------------------------------------------------
// Prüfbericht des Quellenabgleichs
// ---------------------------------------------------------------------------

export function FactcheckPage() {
  const counts = FACTCHECKS.reduce<Record<string, number>>((m, f) => ({ ...m, [f.result]: (m[f.result] ?? 0) + 1 }), {});
  return (
    <div className="stack">
      <div>
        <h1>Prüfbericht</h1>
        <p className="muted">Am {FACTCHECK_DATE} wurden die Zahlenwerte, Gleichungen und Literaturangaben der App mit Fachquellen abgeglichen. Ergebnis: {counts['bestätigt'] ?? 0} bestätigt, {counts['präzisiert'] ?? 0} präzisiert, {counts['korrigiert'] ?? 0} korrigiert.</p>
      </div>
      <div className="notice">Dieser Abgleich wurde KI-gestützt durchgeführt. Er erhöht die Zuverlässigkeit, ersetzt aber nicht die Prüfung durch eine Fachperson. Deshalb bleiben alle Inhalte als „fachlich zu prüfen“ markiert, bis sie unter <a href="#/freigabe">Fachliche Freigabe</a> bestätigt werden.</div>
      <section className="card">
        <table>
          <thead><tr><th>Bereich</th><th>Geprüfte Aussage</th><th>Ergebnis</th><th>Quellen</th></tr></thead>
          <tbody>
            {FACTCHECKS.map((f, i) => (
              <tr key={i}>
                <td>{f.area}</td>
                <td>{f.claim}<br /><small className="muted">{f.note}</small></td>
                <td><span className={`badge ${f.result === 'bestätigt' ? 'ok' : f.result === 'korrigiert' ? 'danger' : 'warn'}`}>{f.result}</span></td>
                <td>{f.refs.map((r) => <div key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></div>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="card">
        <h3>Ohne Webquelle geprüft (Nachrechnen, Standardwerte, automatische Tests)</h3>
        <ul>{REVIEWED_WITHOUT_WEB.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>
    </div>
  );
}
