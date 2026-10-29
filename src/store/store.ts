import { useSyncExternalStore } from 'react';
import { AppState, STORAGE_KEY, emptyState, sanitize } from './state';

type Listener = () => void;
let state: AppState = emptyState();
let loadIssues: string[] = [];
let storageAvailable = true;
const listeners = new Set<Listener>();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.setItem(`${STORAGE_KEY}.beschaedigt.${Date.now()}`, raw);
      loadIssues = ['Die gespeicherten Daten waren beschädigt und konnten nicht gelesen werden. Eine Sicherungskopie wurde im Browser abgelegt; die App startet mit leerem Lernstand.'];
      return;
    }
    const r = sanitize(parsed);
    state = r.state;
    if (r.dropped.length) loadIssues = r.dropped.map((d) => `Beim Laden übersprungen: ${d}.`);
  } catch {
    storageAvailable = false;
    loadIssues = ['Der lokale Speicher des Browsers ist nicht verfügbar (z. B. privater Modus). Fortschritt wird nur bis zum Schließen der Seite gehalten.'];
  }
}
load();

let saveTimer: any = null;
function persist() {
  if (!storageAvailable) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      loadIssues = [...loadIssues, 'Speichern fehlgeschlagen (Speicher voll oder nicht verfügbar).'];
      listeners.forEach((l) => l());
    }
  }, 150);
}

export function getState() {
  return state;
}
export function setState(fn: (s: AppState) => AppState) {
  state = fn(state);
  persist();
  listeners.forEach((l) => l());
}
export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
  );
}
export function getLoadIssues() {
  return loadIssues;
}
export function clearLoadIssues() {
  loadIssues = [];
  listeners.forEach((l) => l());
}

export function exportData(): string {
  return JSON.stringify({ app: 'NeuroLab', exportedAt: new Date().toISOString(), ...state }, null, 2);
}
export function importData(text: string): { ok: boolean; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: 'Die Datei ist keine gültige JSON-Datei.' };
  }
  const r = sanitize(parsed);
  state = r.state;
  persist();
  listeners.forEach((l) => l());
  return { ok: true, message: r.dropped.length ? `Importiert. Übersprungen: ${r.dropped.join('; ')}` : 'Lernstand vollständig importiert.' };
}
export function deleteAll() {
  state = emptyState();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignorieren */
  }
  listeners.forEach((l) => l());
}
