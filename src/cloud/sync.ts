// Konto und Synchronisierung über Supabase.
// Grundsatz „lokal zuerst“: NeuroLab speichert immer sofort im Browser und funktioniert offline.
// Ist Kim angemeldet, wird der Lernstand im Hintergrund mit der Datenbank abgeglichen (holen → zusammenführen → speichern).
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';
import { SITE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config';
import { emptyState, sanitize, type AppState } from '../store/state';
import { mergeStates } from '../store/merge';
import { getSavedAt, getState, onLocalChange, replaceFromSync } from '../store/store';

export type SyncStatus = 'aus' | 'abmeldet' | 'synchronisiert' | 'laeuft' | 'offline' | 'fehler';
export interface CloudInfo { status: SyncStatus; email: string | null; lastSync: number | null; message: string | null; recovery: boolean; ready: boolean }

let info: CloudInfo = { status: 'abmeldet', email: null, lastSync: null, message: null, recovery: false, ready: false };
const subs = new Set<() => void>();
function set(p: Partial<CloudInfo>) { info = { ...info, ...p }; subs.forEach((f) => f()); }
export function useCloud(): CloudInfo {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => info);
}

let client: SupabaseClient | null = null;
let session: Session | null = null;
const TABLE = 'progress';

function supa(): SupabaseClient | null {
  if (client) return client;
  if (typeof window === 'undefined' || !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    // PKCE: Links aus Mails kommen als ?code=… zurück und vertragen sich mit dem Hash-Routing (#/…) der App.
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'neurolab.auth' },
  });
  return client;
}

/** Fehlermeldungen von Supabase auf Deutsch */
export function deMessage(e: unknown): string {
  const m = String((e as any)?.message ?? e ?? '');
  const code = String((e as any)?.code ?? '');
  if (/invalid login credentials/i.test(m)) return 'E-Mail oder Passwort stimmen nicht.';
  if (/email not confirmed/i.test(m)) return 'Die E-Mail-Adresse ist noch nicht bestätigt. Bitte den Link in der Bestätigungs-Mail öffnen.';
  if (/already registered|already been registered|user_already_exists/i.test(m + code)) return 'Mit dieser E-Mail gibt es schon ein Konto. Bitte anmelden.';
  if (/password should be at least|weak_password/i.test(m + code)) return 'Das Passwort ist zu kurz oder zu einfach (mindestens 8 Zeichen).';
  if (/not authorized/i.test(m)) return 'An diese Adresse kann gerade keine Mail verschickt werden (Mailversand des Projekts ist eingeschränkt). Paul kann das in Supabase freischalten.';
  if (/rate limit|over_email_send_rate_limit|429/i.test(m + code)) return 'Zu viele Versuche in kurzer Zeit. Bitte etwas warten und es dann noch einmal probieren.';
  if (/signups not allowed|signup_disabled/i.test(m + code)) return 'Neue Registrierungen sind ausgeschaltet.';
  if (/failed to fetch|network|load failed/i.test(m)) return 'Keine Verbindung zum Server. Bist du online?';
  return m || 'Unbekannter Fehler.';
}

// ---------------------------------------------------------------------------
// Abgleich
// ---------------------------------------------------------------------------

/** Ein frisch geöffnetes Gerät ohne eigenen Lernstand soll nie die Einstellungen aus der Datenbank überschreiben. */
function pristine(s: AppState) {
  return !s.attempts.length && !Object.keys(s.cards).length && !Object.keys(s.lessons).length && !s.tests.length && !Object.keys(s.notes).length && !s.settings.exams.length && !s.experiments.length;
}

let running: Promise<void> | null = null;
let again = false;
let forceReset = false;

async function doSync() {
  const c = supa();
  if (!c || !session) return;
  if (typeof navigator !== 'undefined' && navigator.onLine === false) { set({ status: 'offline' }); return; }
  set({ status: 'laeuft' });
  const uid = session.user.id;
  const local = getState();
  const localSaved = getSavedAt();
  try {
    if (forceReset) {
      forceReset = false;
      const { error } = await c.from(TABLE).upsert({ user_id: uid, data: { state: local, savedAt: localSaved }, updated_at: new Date().toISOString() });
      if (error) throw error;
      set({ status: 'synchronisiert', lastSync: Date.now(), message: null });
      return;
    }
    const { data: row, error } = await c.from(TABLE).select('data').eq('user_id', uid).maybeSingle();
    if (error) throw error;
    let merged = local;
    let mergedSaved = localSaved;
    let remoteJson = '';
    if (row?.data && typeof row.data === 'object') {
      const remoteSaved = Number((row.data as any).savedAt) || 0;
      const remote = sanitize((row.data as any).state ?? {}).state;
      remoteJson = JSON.stringify(remote);
      const localNewer = !pristine(local) && localSaved >= remoteSaved;
      merged = mergeStates(local, remote, localNewer);
      mergedSaved = Math.max(localSaved, remoteSaved);
    }
    // Hat sich lokal während des Abrufs etwas geändert, beim nächsten Durchgang neu zusammenführen.
    if (getState() !== local) { again = true; return; }
    if (JSON.stringify(merged) !== JSON.stringify(local)) replaceFromSync(merged, mergedSaved);
    if (JSON.stringify(merged) !== remoteJson) {
      const { error: e2 } = await c.from(TABLE).upsert({ user_id: uid, data: { state: merged, savedAt: mergedSaved }, updated_at: new Date().toISOString() });
      if (e2) throw e2;
    }
    set({ status: 'synchronisiert', lastSync: Date.now(), message: null });
  } catch (e) {
    const msg = deMessage(e);
    set({ status: /Verbindung/.test(msg) ? 'offline' : 'fehler', message: msg });
  }
}

/** Sofort abgleichen (mehrfache Aufrufe werden zusammengefasst). */
export function syncNow(): Promise<void> {
  if (running) { again = true; return running; }
  running = (async () => {
    do { again = false; await doSync(); } while (again);
  })().finally(() => { running = null; });
  return running;
}

let timer: ReturnType<typeof setTimeout> | null = null;
function scheduleSync(ms = 3000) {
  if (!session) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { timer = null; void syncNow(); }, ms);
}

// ---------------------------------------------------------------------------
// Konto
// ---------------------------------------------------------------------------

export async function signUp(email: string, password: string): Promise<string> {
  const c = supa(); if (!c) throw new Error('Synchronisierung ist nicht eingerichtet.');
  const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: SITE_URL } });
  if (error) throw error;
  if (!data.session) return 'Fast geschafft: Wir haben dir eine Mail geschickt. Öffne den Link darin, danach kannst du dich anmelden.';
  return 'Konto angelegt – du bist angemeldet. Dein Lernstand wird jetzt gesichert.';
}
export async function signIn(email: string, password: string) {
  const c = supa(); if (!c) throw new Error('Synchronisierung ist nicht eingerichtet.');
  const { error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function sendPasswordReset(email: string): Promise<string> {
  const c = supa(); if (!c) throw new Error('Synchronisierung ist nicht eingerichtet.');
  const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo: SITE_URL });
  if (error) throw error;
  return 'Falls ein Konto mit dieser Adresse existiert, ist eine Mail unterwegs. Öffne den Link bitte auf diesem Gerät und in diesem Browser.';
}
export async function changePassword(password: string) {
  const c = supa(); if (!c) throw new Error('Synchronisierung ist nicht eingerichtet.');
  const { error } = await c.auth.updateUser({ password });
  if (error) throw error;
  set({ recovery: false, message: 'Neues Passwort gespeichert.' });
}
/** Abmelden. Auf Wunsch wird der Lernstand auf diesem Gerät gelöscht (er bleibt in der Datenbank erhalten). */
export async function signOut(clearLocal: boolean) {
  const c = supa(); if (!c) return;
  await syncNow();
  await c.auth.signOut();
  if (clearLocal) {
    replaceFromSync(emptyState(), 0);
    try { localStorage.removeItem('neurolab.v1.sync'); } catch { /* ignorieren */ }
  }
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

let started = false;
export function startCloud() {
  if (started) return; started = true;
  const c = supa();
  if (!c) { set({ status: 'aus', ready: true }); return; }

  c.auth.onAuthStateChange((event, s) => {
    session = s;
    set({ email: s?.user.email ?? null, status: s ? info.status === 'abmeldet' ? 'laeuft' : info.status : 'abmeldet', ready: true });
    if (event === 'PASSWORD_RECOVERY') set({ recovery: true });
    if (s && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) scheduleSync(50);
    // Code aus Bestätigungs- oder Passwort-Link aus der Adresszeile entfernen
    if (s && /[?&]code=/.test(window.location.search)) history.replaceState(null, '', window.location.pathname + window.location.hash);
  });

  onLocalChange((kind) => {
    if (kind === 'reset') forceReset = true;
    scheduleSync(kind === 'reset' ? 50 : 3000);
  });
  window.addEventListener('online', () => scheduleSync(200));
  window.addEventListener('offline', () => { if (session) set({ status: 'offline' }); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') scheduleSync(200); else if (timer) { clearTimeout(timer); timer = null; void syncNow(); } });
  setInterval(() => { if (document.visibilityState === 'visible') scheduleSync(0); }, 2 * 60 * 1000);
}
