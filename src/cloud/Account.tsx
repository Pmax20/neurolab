import { useState, type FormEvent } from 'react';
import { changePassword, deMessage, sendPasswordReset, signIn, signOut, signUp, syncNow, useCloud, type SyncStatus } from './sync';

const STATUS: Record<SyncStatus, string> = {
  aus: 'nicht eingerichtet',
  abmeldet: 'nicht angemeldet',
  synchronisiert: 'gesichert',
  laeuft: 'wird abgeglichen …',
  offline: 'offline – wird nachgeholt',
  fehler: 'Fehler beim Abgleich',
};

const time = (t: number | null) => (t ? new Date(t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '–');

/** Kleine Anzeige oben rechts in der Kopfzeile. */
export function CloudBadge() {
  const c = useCloud();
  if (!c.ready || c.status === 'aus') return null;
  if (!c.email) return <a className="btn small" href="#/einstellungen">Anmelden</a>;
  const icon = c.status === 'synchronisiert' ? '☁︎ ✓' : c.status === 'laeuft' ? '☁︎ …' : c.status === 'offline' ? '☁︎ ⏸' : '☁︎ !';
  return <a className="btn small" href="#/einstellungen" title={`Lernstand ${STATUS[c.status]}`} aria-label={`Konto: Lernstand ${STATUS[c.status]}`}>{icon}</a>;
}

function PasswordField({ value, onChange, label, auto }: { value: string; onChange: (v: string) => void; label: string; auto: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field"><span className="lab"><b>{label}</b><button type="button" className="small ghost" onClick={() => setShow((v) => !v)}>{show ? 'verbergen' : 'anzeigen'}</button></span>
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={auto} minLength={8} required /></label>
  );
}

/** Karte in den Einstellungen: anmelden, registrieren, Passwort, Status. */
export function AccountCard({ gate = false }: { gate?: boolean }) {
  const c = useCloud();
  const [mode, setMode] = useState<'anmelden' | 'registrieren' | 'vergessen'>('anmelden');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [newPw, setNewPw] = useState('');
  const [showChange, setShowChange] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);

  const run = async (fn: () => Promise<string | void>) => {
    setBusy(true); setMsg(null);
    try { const r = await fn(); if (r) setMsg({ ok: true, text: r }); }
    catch (e) { setMsg({ ok: false, text: deMessage(e) }); }
    finally { setBusy(false); }
  };

  if (c.status === 'aus') return null;

  // Passwort-Link aus der Mail geöffnet oder Passwort ändern
  if (c.email && (c.recovery || showChange)) {
    const submit = (e: FormEvent) => { e.preventDefault(); void run(async () => { await changePassword(newPw); setNewPw(''); setShowChange(false); return 'Neues Passwort gespeichert.'; }); };
    return (
      <section className="card">
        <h3>Neues Passwort festlegen</h3>
        <form className="stack" onSubmit={submit} style={{ maxWidth: 420 }}>
          <PasswordField label="Neues Passwort (mindestens 8 Zeichen)" value={newPw} onChange={setNewPw} auto="new-password" />
          <div className="row"><button className="primary" disabled={busy}>Speichern</button>{!c.recovery && <button type="button" onClick={() => setShowChange(false)}>Abbrechen</button>}</div>
        </form>
        {msg && <div className={`notice ${msg.ok ? 'info' : 'danger'}`} role="status">{msg.text}</div>}
      </section>
    );
  }

  if (c.email) {
    return (
      <section className="card">
        <h3>Konto und Synchronisierung</h3>
        <p style={{ margin: 0 }}>Angemeldet als <b>{c.email}</b>. Dein Lernstand wird auf diesem Gerät gespeichert und zusätzlich in der Datenbank gesichert. Auf jedem anderen Gerät, auf dem du dich anmeldest, ist er ebenfalls da.</p>
        <p style={{ margin: '8px 0' }}>Status: <b style={{ color: c.status === 'fehler' ? 'var(--danger)' : c.status === 'synchronisiert' ? 'var(--ok)' : undefined }}>{STATUS[c.status]}</b> · zuletzt abgeglichen: {time(c.lastSync)}</p>
        {c.message && c.status !== 'synchronisiert' && <div className="notice danger" role="status">{c.message}</div>}
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button onClick={() => void syncNow()} disabled={c.status === 'laeuft'}>Jetzt abgleichen</button>
          <button onClick={() => setShowChange(true)}>Passwort ändern</button>
          {!confirmOut && <button onClick={() => setConfirmOut(true)}>Abmelden</button>}
        </div>
        {confirmOut && (
          <div className="notice info stack" style={{ marginTop: 10 }}>
            <span>Dein Lernstand bleibt in der Datenbank gesichert. Was soll mit den Daten auf <b>diesem</b> Gerät passieren?</span>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <button onClick={() => void run(async () => { await signOut(false); setConfirmOut(false); })} disabled={busy}>Abmelden, Daten hier behalten</button>
              <button onClick={() => void run(async () => { await signOut(true); setConfirmOut(false); })} disabled={busy}>Abmelden und hier löschen (z. B. fremdes Gerät)</button>
              <button className="ghost" onClick={() => setConfirmOut(false)}>Abbrechen</button>
            </div>
          </div>
        )}
        {msg && <div className={`notice ${msg.ok ? 'info' : 'danger'}`} role="status">{msg.text}</div>}
      </section>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'vergessen') return void run(() => sendPasswordReset(email.trim()));
    if (mode === 'registrieren') {
      if (pw !== pw2) { setMsg({ ok: false, text: 'Die beiden Passwörter stimmen nicht überein.' }); return; }
      return void run(() => signUp(email.trim(), pw));
    }
    return void run(async () => { await signIn(email.trim(), pw); return 'Angemeldet. Dein Lernstand wird jetzt abgeglichen.'; });
  };

  return (
    <section className="card">
      <h3>{gate ? 'Bitte melde dich an' : 'Konto und Synchronisierung'}</h3>
      <p>{gate ? 'NeuroLab ist nur mit Konto nutzbar. Dein Lernstand ist dann auf jedem Gerät da – Laptop, Handy, Tablet – und funktioniert nach dem Anmelden auch offline.' : 'Mit einem Konto ist dein Lernstand auf jedem Gerät da – Laptop, Handy, Tablet. Ohne Konto bleibt er nur in diesem Browser.'} Was in diesem Browser schon gespeichert ist, wird beim ersten Anmelden übernommen und mit dem Stand im Konto zusammengeführt.</p>
      <div className="seg" role="tablist" aria-label="Konto" style={{ marginBottom: 10 }}>
        {([['anmelden', 'Anmelden'], ['registrieren', 'Konto anlegen'], ['vergessen', 'Passwort vergessen']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={mode === k} onClick={() => { setMode(k); setMsg(null); }}>{l}</button>)}
      </div>
      <form className="stack" onSubmit={submit} style={{ maxWidth: 420 }}>
        <label className="field"><span className="lab"><b>E-Mail</b></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
        {mode !== 'vergessen' && <PasswordField label={mode === 'registrieren' ? 'Passwort (mindestens 8 Zeichen)' : 'Passwort'} value={pw} onChange={setPw} auto={mode === 'registrieren' ? 'new-password' : 'current-password'} />}
        {mode === 'registrieren' && <PasswordField label="Passwort wiederholen" value={pw2} onChange={setPw2} auto="new-password" />}
        <div><button className="primary" disabled={busy}>{busy ? 'Moment …' : mode === 'anmelden' ? 'Anmelden' : mode === 'registrieren' ? 'Konto anlegen' : 'Link zum Zurücksetzen schicken'}</button></div>
      </form>
      {msg && <div className={`notice ${msg.ok ? 'info' : 'danger'}`} role="status" style={{ marginTop: 10 }}>{msg.text}</div>}
      <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 0 }}>Gespeichert werden deine E-Mail-Adresse und dein Lernstand (Antworten, Wiederholungsplan, Karteikarten, Einstellungen, Notizen) bei Supabase in Frankfurt. Eigene Präparat-Fotos bleiben vorerst nur auf dem jeweiligen Gerät.</p>
    </section>
  );
}

/** Vollbild vor der App: ohne Anmeldung kein Zugang. */
export function LoginGate({ loading = false }: { loading?: boolean }) {
  return (
    <div className="login-gate">
      <div className="login-box stack">
        <div className="brand" style={{ fontSize: '1.4rem', justifyContent: 'center' }}>NeuroLab</div>
        {loading ? <p className="muted" style={{ textAlign: 'center' }} aria-live="polite">Anmeldung wird geprüft …</p> : <AccountCard gate />}
      </div>
    </div>
  );
}
