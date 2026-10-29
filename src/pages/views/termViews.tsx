import { useMemo, useState } from 'react';
import { PARTS, WORDS, splitOptions, type Word } from '../../content/termtrainer';
import { useStore, setState } from '../../store/store';
import { dueCards, rateCard } from '../../store/state';

// Interaktiver Terminologietrainer: zerlegen, ergänzen, Schreibweise, erschließen, zuordnen.

type Mode = 'zerlegen' | 'ergaenzen' | 'schreibweise' | 'erschliessen' | 'zuordnen';
const MODES: [Mode, string, string][] = [
  ['zerlegen', 'Zerlegen', 'Begriff in Bausteine teilen und übersetzen'],
  ['ergaenzen', 'Ergänzen', 'fehlenden Baustein einsetzen'],
  ['schreibweise', 'Schreibweise', 'richtige Schreibung erkennen'],
  ['erschliessen', 'Erschließen', 'unbekannte Begriffe aus Bausteinen verstehen'],
  ['zuordnen', 'Zuordnen', 'Begriff und Bedeutung verbinden'],
];

function shuffle<T>(a: T[]) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function useNext(mode: Mode) {
  const s = useStore((x) => x);
  const pool = WORDS.filter((w) => (mode === 'erschliessen' ? w.transfer : !w.transfer));
  const ids = pool.map((w) => `tt:${mode}:${w.word}`);
  const pickNext = (exclude?: string) => {
    const due = dueCards(s, ids, Date.now()).filter((id) => id !== `tt:${mode}:${exclude}`);
    const list = due.length ? due.slice(0, 5) : ids.filter((id) => id !== `tt:${mode}:${exclude}`);
    const id = list[Math.floor(Math.random() * list.length)];
    return pool.find((w) => `tt:${mode}:${w.word}` === id)!;
  };
  const rate = (w: Word, score: number) => setState((st) => rateCard(st, `tt:${mode}:${w.word}`, score, Date.now()));
  const known = ids.filter((id) => (s.cards[id]?.box ?? 0) >= 3).length;
  return { pickNext, rate, known, total: ids.length };
}

function Feedback({ ok, text }: { ok: boolean; text: string }) {
  return <p aria-live="polite" style={{ margin: 0 }}><b style={{ color: ok ? 'var(--ok)' : 'var(--danger)' }}>{ok ? 'Richtig.' : 'Nicht ganz.'}</b> {text}</p>;
}

function Breakdown({ w }: { w: Word }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <div className="word-parts">{w.parts.map((p, i) => <span key={i} className="part" title={p.kind}>{p.p}</span>)}</div>
      <div>{w.parts.map((p) => `${p.p} (${p.kind}) = ${p.m}`).join(' · ')} → <b>{w.meaning}</b></div>
    </div>
  );
}

function Zerlegen() {
  const { pickNext, rate, known, total } = useNext('zerlegen');
  const [w, setW] = useState(() => pickNext());
  const splits = useMemo(() => shuffle(splitOptions(w)), [w]);
  const [split, setSplit] = useState<string | null>(null);
  const [mean, setMean] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);
  const right = w.parts.map((p) => p.p).join('|');
  const meaningOpts = useMemo(() => w.parts.map((p) => shuffle([p.m, ...shuffle(PARTS.filter((x) => x.m !== p.m && x.kind === p.kind).map((x) => x.m)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)])), [w]);
  const allMeanOk = w.parts.every((p, i) => mean[i] === p.m);
  const check = () => { setDone(true); rate(w, split === right && allMeanOk ? 1 : split === right || allMeanOk ? 0.5 : 0); };
  const next = () => { setW(pickNext(w.word)); setSplit(null); setMean({}); setDone(false); };
  return (
    <div className="card stack">
      <div className="row between"><div className="drill-q">Zerlege: <b>{w.word}</b></div><span className="muted">{known} / {total} gefestigt</span></div>
      <div><b>1. Wo liegen die Grenzen der Bausteine?</b>
        <div className="row" style={{ marginTop: 6 }}>{splits.map((sp) => { const k = sp.join('|'); return <button key={k} aria-pressed={split === k} disabled={!!split} className={split && k === right ? 'primary' : ''} onClick={() => setSplit(k)}>{sp.join(' | ')}</button>; })}</div>
        {split && <p style={{ margin: '6px 0 0' }}><b style={{ color: split === right ? 'var(--ok)' : 'var(--danger)' }}>{split === right ? 'Richtig getrennt.' : `Richtig ist: ${w.parts.map((p) => p.p).join(' | ')}`}</b></p>}
      </div>
      {split && <div><b>2. Was bedeuten die Bausteine?</b>
        <div className="grid cols-3" style={{ marginTop: 6 }}>
          {w.parts.map((p, i) => (
            <label key={i} className="field" style={{ margin: 0 }}><span className="lab"><b>{p.p}</b>{done && <span>{mean[i] === p.m ? '✓' : `→ ${p.m}`}</span>}</span>
              <select value={mean[i] ?? ''} disabled={done} onChange={(e) => setMean({ ...mean, [i]: e.target.value })}><option value="">– wählen –</option>{meaningOpts[i].map((m) => <option key={m}>{m}</option>)}</select>
            </label>
          ))}
        </div>
      </div>}
      {!done ? <div className="row"><button className="primary" onClick={check} disabled={!split || w.parts.some((_, i) => !mean[i])}>Prüfen</button></div> : (
        <>
          <Feedback ok={split === right && allMeanOk} text="" />
          <Breakdown w={w} />
          <div className="row"><button className="primary" onClick={next}>Nächster Begriff</button></div>
        </>
      )}
    </div>
  );
}

function Ergaenzen() {
  const { pickNext, rate, known, total } = useNext('ergaenzen');
  const [w, setW] = useState(() => pickNext());
  const gap = useMemo(() => Math.floor(Math.random() * w.parts.length), [w]);
  const opts = useMemo(() => { const p = w.parts[gap]; return shuffle([p.p, ...shuffle(PARTS.filter((x) => x.kind === p.kind && x.p !== p.p).map((x) => x.p)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)]); }, [w, gap]);
  const [ans, setAns] = useState<string | null>(null);
  const ok = ans === w.parts[gap].p;
  const next = () => { setW(pickNext(w.word)); setAns(null); };
  return (
    <div className="card stack">
      <div className="row between"><div className="drill-q">Ergänze: <b>{w.meaning}</b></div><span className="muted">{known} / {total} gefestigt</span></div>
      <div className="word-parts">{w.parts.map((p, i) => <span key={i} className="part" style={i === gap ? { background: ans ? (ok ? 'var(--ok-soft)' : 'var(--danger-soft)') : '#fff', border: '2px dashed var(--accent)', minWidth: 70, textAlign: 'center' } : undefined}>{i === gap ? ans ?? '…' : p.p}</span>)}</div>
      <div className="row">{opts.map((o) => <button key={o} disabled={!!ans} aria-pressed={ans === o} className={ans && o === w.parts[gap].p ? 'primary' : ''} onClick={() => { setAns(o); rate(w, o === w.parts[gap].p ? 1 : 0); }}>{o}</button>)}</div>
      {ans && <><Feedback ok={ok} text={`${w.parts[gap].p} = ${w.parts[gap].m}.`} /><Breakdown w={w} /><div className="row"><button className="primary" onClick={next}>Nächster Begriff</button></div></>}
    </div>
  );
}

function Schreibweise() {
  const { pickNext, rate, known, total } = useNext('schreibweise');
  const [w, setW] = useState(() => pickNext());
  const opts = useMemo(() => shuffle([w.word, ...w.wrong]), [w]);
  const [ans, setAns] = useState<string | null>(null);
  const next = () => { setW(pickNext(w.word)); setAns(null); };
  return (
    <div className="card stack">
      <div className="row between"><div className="drill-q">Wie schreibt man den Fachbegriff für <b>„{w.meaning}“</b>?</div><span className="muted">{known} / {total} gefestigt</span></div>
      <div className="row">{opts.map((o) => <button key={o} disabled={!!ans} aria-pressed={ans === o} className={ans && o === w.word ? 'primary' : ''} onClick={() => { setAns(o); rate(w, o === w.word ? 1 : 0); }}>{o}</button>)}</div>
      {ans && <><Feedback ok={ans === w.word} text={`Richtig ist „${w.word}“.`} /><Breakdown w={w} /><div className="row"><button className="primary" onClick={next}>Nächster Begriff</button></div></>}
      <p className="muted" style={{ fontSize: '0.82rem', margin: 0 }}>Abgefragt wird die eingedeutschte Schreibung (z. B. Kardiologie). Die lateinische Schreibung mit c (z. B. Endocardium) ist ebenfalls korrekt und wird hier nicht als Fehler gezählt.</p>
    </div>
  );
}

function Erschliessen() {
  const { pickNext, rate, known, total } = useNext('erschliessen');
  const [w, setW] = useState(() => pickNext());
  const opts = useMemo(() => shuffle([w.meaning, ...shuffle(WORDS.filter((x) => x.word !== w.word).map((x) => x.meaning)).slice(0, 3)]), [w]);
  const [hint, setHint] = useState(false);
  const [ans, setAns] = useState<string | null>(null);
  const next = () => { setW(pickNext(w.word)); setAns(null); setHint(false); };
  return (
    <div className="card stack">
      <div className="row between"><div className="drill-q">Was bedeutet <b>{w.word}</b>?</div><span className="muted">{known} / {total} gefestigt</span></div>
      <p className="muted" style={{ margin: 0 }}>Diesen Begriff kennst du vielleicht noch nicht – die Bausteine aber schon.</p>
      {!hint && !ans && <div><button className="small" onClick={() => setHint(true)}>Bausteine zeigen</button></div>}
      {hint && !ans && <div className="word-parts">{w.parts.map((p, i) => <span key={i} className="part">{p.p}</span>)}</div>}
      <div className="stack" style={{ gap: 6 }}>{opts.map((o) => <button key={o} style={{ textAlign: 'left' }} disabled={!!ans} aria-pressed={ans === o} className={ans && o === w.meaning ? 'primary' : ''} onClick={() => { setAns(o); rate(w, o === w.meaning ? (hint ? 0.5 : 1) : 0); }}>{capital(o)}</button>)}</div>
      {ans && <><Feedback ok={ans === w.meaning} text="" /><Breakdown w={w} /><div className="row"><button className="primary" onClick={next}>Nächster Begriff</button></div></>}
    </div>
  );
}

function Zuordnen() {
  const [set, setSet] = useState(() => shuffle(WORDS.filter((w) => !w.transfer)).slice(0, 5));
  const means = useMemo(() => shuffle(set.map((w) => w.meaning)), [set]);
  const [map, setMap] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const score = set.filter((w) => map[w.word] === w.meaning).length;
  return (
    <div className="card stack">
      <div className="drill-q">Ordne jedem Begriff seine Bedeutung zu.</div>
      {set.map((w) => (
        <label key={w.word} className="row" style={{ alignItems: 'center' }}>
          <b style={{ minWidth: 150 }}>{w.word}</b>
          <select value={map[w.word] ?? ''} disabled={done} onChange={(e) => setMap({ ...map, [w.word]: e.target.value })} style={{ flex: 1, borderColor: done ? (map[w.word] === w.meaning ? 'var(--ok)' : 'var(--danger)') : undefined }}>
            <option value="">– wählen –</option>{means.map((m) => <option key={m}>{m}</option>)}
          </select>
          {done && map[w.word] !== w.meaning && <span className="muted">→ {w.meaning}</span>}
        </label>
      ))}
      {!done ? <div className="row"><button className="primary" onClick={() => setDone(true)}>Prüfen</button></div>
        : <div className="row between"><b>{score} von {set.length} richtig.</b><button className="primary" onClick={() => { setSet(shuffle(WORDS.filter((w) => !w.transfer)).slice(0, 5)); setMap({}); setDone(false); }}>Neue Runde</button></div>}
    </div>
  );
}

export function TermTrainer() {
  const [mode, setMode] = useState<Mode>('zerlegen');
  return (
    <div className="stack">
      <div className="mode-pick" role="radiogroup" aria-label="Übungsart">
        {MODES.map(([k, t, d]) => <button key={k} role="radio" aria-checked={mode === k} onClick={() => setMode(k)}><b>{t}</b><span>{d}</span></button>)}
      </div>
      {mode === 'zerlegen' && <Zerlegen />}
      {mode === 'ergaenzen' && <Ergaenzen />}
      {mode === 'schreibweise' && <Schreibweise />}
      {mode === 'erschliessen' && <Erschliessen />}
      {mode === 'zuordnen' && <Zuordnen />}
    </div>
  );
}
