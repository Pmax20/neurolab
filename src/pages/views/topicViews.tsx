import { useState, type ReactNode } from 'react';
import { Tabs } from './anatomyViews';
import { QuizTrainer } from './chem5Views';
import type { TopicExtra, TopicTable } from '../../content/kit';

export function TopicTableCard({ t }: { t: TopicTable }) {
  return (
    <div className="card stack">
      <b>{t.title}</b>
      <div style={{ overflowX: 'auto' }}><table><thead><tr>{t.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{t.rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table></div>
      {t.note && <p className="muted" style={{ fontSize: '0.85rem', margin: 0 }}>{t.note}</p>}
    </div>
  );
}

/** Zusatzreiter „Üben“ und „Übersicht“; eine vorhandene interaktive Ansicht bleibt als erster Reiter erhalten. */
export function TopicView({ extra, base, baseLabel = 'Interaktiv' }: { extra: TopicExtra; base?: ReactNode; baseLabel?: string }) {
  const items: [string, string][] = [
    ...(base ? [['base', baseLabel] as [string, string]] : []),
    ...(extra.quiz?.length ? [['quiz', 'Üben'] as [string, string]] : []),
    ...(extra.tables?.length ? [['tab', extra.tables.length === 1 ? extra.tables[0].title : 'Übersicht'] as [string, string]] : []),
  ];
  const [tab, setTab] = useState(items[0]?.[0] ?? '');
  return (
    <div className="stack">
      {items.length > 1 && <Tabs value={tab} onChange={setTab} label="Modus" items={items} />}
      {tab === 'base' && base}
      {tab === 'quiz' && extra.quiz && <QuizTrainer items={extra.quiz} hint={extra.hint} />}
      {tab === 'tab' && extra.tables?.map((t) => <TopicTableCard key={t.title} t={t} />)}
    </div>
  );
}
