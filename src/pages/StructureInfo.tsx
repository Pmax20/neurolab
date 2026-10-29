import { lessonById, structureById } from '../content';
import { SourceList, StatusBadge } from '../ui/common';
import { href } from '../ui/router';

export interface PartInfo {
  id: string;
  name: string;
  text: string;
  function?: string;
  lessons?: string[];
}

export function StructureInfo({ id, onSelect, parts }: { id: string | null; onSelect: (id: string | null) => void; parts?: PartInfo[] }) {
  if (!id) {
    return <p className="muted" style={{ margin: '4px 0 0' }}>Tippe auf eine Struktur in der Abbildung oder wähle sie oben aus.</p>;
  }
  const part = parts?.find((p) => p.id === id);
  if (part) {
    return (
      <div aria-live="polite">
        <h3 style={{ margin: '4px 0 6px' }}>{part.name}</h3>
        <p style={{ marginTop: 0 }}>{part.text}</p>
        {part.function && <p><b>Funktion:</b> {part.function}</p>}
        {part.lessons?.length ? <p className="muted" style={{ fontSize: '0.9rem' }}>Mehr dazu: {part.lessons.map((l, i) => <span key={l}>{i > 0 && ' · '}<a href={href('lektion', l)}>{lessonById(l)?.title}</a></span>)}</p> : null}
      </div>
    );
  }
  const s = structureById(id);
  if (!s) return null;
  const parent = s.parent ? structureById(s.parent) : null;
  const linkBtn = (c: string) => <button key={c} className="linklike" onClick={() => onSelect(c)}>{structureById(c)?.deName}</button>;
  return (
    <div aria-live="polite">
      <h3 style={{ margin: '4px 0 0' }}>{s.deName}</h3>
      <div className="muted" style={{ fontStyle: 'italic', marginBottom: 8, fontSize: '0.9rem' }}>{s.sciName}</div>
      <p style={{ marginTop: 0 }}>{s.short}</p>
      <p><b>Funktion:</b> {s.function}</p>
      <details>
        <summary>Mehr erfahren</summary>
        <p>{s.long}</p>
        <p><b>Lage:</b> {s.location}</p>
        {s.synonyms.length > 0 && <p><b>Auch genannt:</b> {s.synonyms.join(', ')}</p>}
        {parent && <p><b>Teil von:</b> {linkBtn(parent.id)}</p>}
        {s.connections.length > 0 && <p><b>Verbunden mit:</b> {s.connections.map((c, i) => <span key={c}>{i > 0 && ', '}{linkBtn(c)}</span>)}</p>}
        <p><b>Lektionen:</b> {s.lessons.map((l, i) => <span key={l}>{i > 0 && ' · '}<a href={href('lektion', l)}>{lessonById(l)?.title}</a></span>)}</p>
        <p style={{ marginBottom: 4 }}><StatusBadge id={`structure:${s.id}`} status={s.status} /></p>
        <SourceList sources={s.sources} />
      </details>
    </div>
  );
}

/** Kompakte Auswahl: ein Auswahlfeld statt einer langen Knopfliste; Ein-/Ausblenden versteckt in „Ansicht“. */
export function StructureList({ ids, sel, onSel, hidden, onToggleHidden, parts }: { ids: string[]; sel: string | null; onSel: (id: string | null) => void; hidden?: Set<string>; onToggleHidden?: (id: string) => void; parts?: PartInfo[] }) {
  const name = (id: string) => parts?.find((p) => p.id === id)?.name ?? structureById(id)?.deName ?? id;
  return (
    <div>
      <select value={sel ?? ''} onChange={(e) => onSel(e.target.value || null)} aria-label="Struktur auswählen" style={{ width: '100%' }}>
        <option value="">Struktur auswählen …</option>
        {ids.map((id) => <option key={id} value={id}>{name(id)}</option>)}
      </select>
      {onToggleHidden && (
        <details style={{ marginTop: 8 }}>
          <summary>Teile ein- oder ausblenden{hidden?.size ? ` (${hidden.size} ausgeblendet)` : ''}</summary>
          <div className="check-group" style={{ columns: 1 }}>
            {ids.map((id) => <label key={id}><input type="checkbox" checked={!hidden?.has(id)} onChange={() => onToggleHidden(id)} /> {name(id)}</label>)}
          </div>
        </details>
      )}
    </div>
  );
}

/** Seitenspalte für Strukturansichten: Auswahl oben, Steckbrief darunter – in einer Karte. */
export function StructurePanel(props: { ids: string[]; sel: string | null; onSel: (id: string | null) => void; hidden?: Set<string>; onToggleHidden?: (id: string) => void; parts?: PartInfo[] }) {
  return (
    <section className="card">
      <StructureList {...props} />
      <div style={{ marginTop: 12 }}><StructureInfo id={props.sel} onSelect={props.onSel} parts={props.parts} /></div>
    </section>
  );
}
