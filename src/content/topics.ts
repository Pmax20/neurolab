import type { TopicExtra } from './kit';
import { BIO_TOPICS } from './bio2';
import { PHYS_TOPICS } from './phys3';
import { TERM_TOPICS } from './term2';
import { HISTO_ANA_TOPICS } from './histo3';

/** Übungsdaten (Quiz, Tabellen) je Lektion für die Ansicht „Ausprobieren“. */
export const TOPIC_EXTRAS: Record<string, TopicExtra> = { ...BIO_TOPICS, ...PHYS_TOPICS, ...TERM_TOPICS, ...HISTO_ANA_TOPICS };
