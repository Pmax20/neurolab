import { useEffect, useState } from 'react';

// Hash-Routing: funktioniert auf statischem Hosting (Neocities) ohne Server-Rewrites, auch in Unterordnern.
export function parseHash(h = location.hash): { path: string[]; query: URLSearchParams } {
  const raw = h.replace(/^#\/?/, '');
  const [p, q] = raw.split('?');
  return { path: p ? p.split('/').map(decodeURIComponent) : [], query: new URLSearchParams(q ?? '') };
}

export function useRoute() {
  const [r, setR] = useState(() => parseHash());
  useEffect(() => {
    const on = () => {
      setR(parseHash());
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export function href(...parts: string[]) {
  return '#/' + parts.map(encodeURIComponent).join('/');
}

export function go(...parts: string[]) {
  location.hash = href(...parts);
}
