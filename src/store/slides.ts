// Eigene Präparatfotos (Histologie): lokal im Browser (IndexedDB), nicht im JSON-Export.

export interface OwnSlide {
  id: string;
  created: number;
  tissue: string; // Struktur-ID (h-…) oder '' für „anderes Gewebe“
  label: string; // Name des Gewebes, wie Kim ihn eingetragen hat
  stain: string;
  magnification: string;
  source: string; // Herkunft (z. B. „eigenes Foto, Histo-Kurs, Präparat Nr. 12“)
  features: string; // charakteristische Merkmale in eigenen Worten
  image: Blob;
}

const DB = 'neurolab-slides';
const STORE = 'slides';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('Dieser Browser unterstützt keinen lokalen Bildspeicher (IndexedDB).')); return; }
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'id' }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Bildspeicher konnte nicht geöffnet werden.'));
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    t.oncomplete = () => db.close();
  });
}

export const listSlides = async (): Promise<OwnSlide[]> => ((await tx('readonly', (s) => s.getAll())) as OwnSlide[]).sort((a, b) => b.created - a.created);
export const saveSlide = (s: OwnSlide) => tx('readwrite', (st) => st.put(s));
export const deleteSlide = (id: string) => tx('readwrite', (st) => st.delete(id));

/** Bild verkleinern (lange Kante max. 1600 px), damit der Speicher nicht vollläuft. */
export async function shrinkImage(file: File, max = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (k === 1 && file.size < 1.5e6) return file;
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), 'image/jpeg', 0.85));
  } catch {
    return file;
  }
}
