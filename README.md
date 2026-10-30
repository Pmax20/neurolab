# NeuroLab – Quellcode

Interaktives Lern- und Simulationssystem für die medizinische Ausbildung (Umsetzung des Lastenhefts v1.0).

## Befehle
- `npm install` – Abhängigkeiten installieren
- `npm run dev` – Entwicklungsserver
- `npm test` – alle Tests (Simulationsgleichungen, Lerninhalte, Bewertung, Wiederholungslogik, Import)
- `npm run build` – statischer Build nach `dist/` (für Neocities)
- `python3 scripts/build_molecules.py src/content/molecules.generated.json` – Molekülstrukturen neu erzeugen (benötigt RDKit)

## Architektur
- `src/engine/` – Simulationsengine, unabhängig von UI und 3D (Hodgkin-Huxley, Kabelmodell, Synapse, Endplatte, Querbrücken, Transport, Osmose, Enzyme, Säure-Base, Kreislauf, Atmung). Jedes Modell dokumentiert Gleichungen, Parameter, Annahmen, Grenzen, Quellen und Referenzszenarien.
- `src/content/` – Lerninhalte als strukturierte Daten (Lektionen mit 4 Ebenen, Strukturen, Aufgaben, Quellen, geführte Experimente, Moleküle).
- `src/store/` – Persistenz (localStorage, Validierung beschädigter Daten, Export/Import), Bewertung, Leitner-Wiederholung, Vorlesungsimport.
- `src/ui/`, `src/pages/` – Oberfläche (React, Three.js, eigene SVG-Diagramme).

Neues Modul: Lektionen in `src/content/*.ts`, Modell in `src/engine/` + Eintrag in `registry.ts`, Aufgaben in `tasks*.ts`, Ansicht in `src/pages/views/`. Die Integritätstests prüfen Verweise automatisch.

## Ausrichtung auf das 1. Semester (Universität Leipzig)

Die Bereiche folgen dem vorklinischen Studienplan der Medizinischen Fakultät Leipzig:

| Semester | Bereich in NeuroLab | Lektionen |
|---|---|---|
| 1.–2. | Chemie | Atommodell, Bindungen, Konzentrationen, Gleichgewicht, Säure-Base, Redox, Komplexe, Organik, Moleküle, Naturstoffe |
| 1. | Biologie | Zelle, Membran, Transport, Osmose, Zellzyklus, Genetik, Proteinbiosynthese, Mikroorganismen, Energiegewinnung, Enzyme |
| 1.–2. | Physik | Mechanik, Strömung, Diffusion, Elektrizität, Optik, Ultraschall, Radioaktivität |
| 1. | Histologie | Epithel, Binde- und Stützgewebe, Muskel- und Nervengewebe |
| 1. | Terminologie | Lagebezeichnungen, Wortbildung |
| ab 3. | Nerv und Muskel, Organsysteme | Physiologie-Lektionen |

In den Einstellungen lassen sich Name, Fachsemester und Klausurtermine eintragen; die Startseite zeigt dann einen Countdown und stellt passende Übungen zusammen.

## Anatomie I und Leipziger Belegstatus (Stand 28.10.2026)

- Neuer Bereich **Anatomie** (Funktionelle Anatomie I · Seminar Anatomie): Allgemeine Anatomie und Orientierung, Allgemeine Embryologie, Knochenlehre und Ossifikation, Gelenklehre, Allgemeine Muskellehre – in der Reihenfolge des Themenplans WS 2026/27.
- Interaktiv: anklickbare Schemazeichnungen (Röhrenknochen, echtes Gelenk, Oberarm, Muskelquerschnitt, Skelett ventral), **Beschriftungsmodus** („Tippe auf …“, auch auf Latein), **Orientierungsmodus** (Lagebeziehungen), Achsen-/Ebenen-Einblendung, Embryologie Woche für Woche, Keimblatt-Zuordnung, chondrale Ossifikation, Gelenktypen, Beugen/Strecken mit Agonist/Antagonist.
- `src/content/curriculum.ts`: Jede Lektion trägt einen Belegstatus – „Leipzig“ (Thema steht im veröffentlichten Plan, mit Datum), „Fach im 1. Semester“ (Thema nicht einzeln belegt) oder „Vertiefung ab 3. Semester“. Startseite: „Diese Woche im Stundenplan“.
- **Karteikarten** für alle Fächer (aus Fachbegriffen, Strukturen und Terminologie abgeleitet) mit Leitner-Wiederholung, unter Üben → Karteikarten.
- Prüfen-Modus optional mit Zeitlimit (1,5 min pro Frage). Neue Fehlerkategorien: Rechenfehler, Einheiten, ungenau gelesen, Verwechslung, Struktur nicht erkannt.
- Alle Übungsfragen sind selbst formuliert, keine Leipziger Originalfragen.

## Ergänzungen nach dem Abgleich mit dem Lastenheft (Stand 28.10.2026)

- **Berechnungstrainer** (`src/content/calc.ts`): 38 Vorlagen für Chemie, Physik und Mikroskopie; jede Aufgabe mit neuen Zahlen bei jedem Aufruf, Stufe 1–3. Ablauf: Gegeben → Gesucht → Formel → Ergebnis mit Einheit (Einheit wird geprüft, Umrechnungen wie mmol/mol, km/h/m/s werden akzeptiert) → Rechenweg, Einheitenkontrolle, Einordnung, typische Fehler. Fehler werden als Lesefehler, Formelfehler, Einheitenfehler oder Rechenfehler eingeordnet.
- **Neue Lektionen:** Größen, Einheiten und Bewegung · Arbeit, Energie und Leistung · Dichte und Druck (Physik); Periodensystem und Elektronenkonfiguration · Reaktionsgleichungen, Stöchiometrie und Verdünnung (Chemie); Mikroskopie und histologische Präparate (Histologie).
- **Reaktionsgleichungen ausgleichen** mit mitzählender Atom- und Ladungsbilanz.
- **Histologie-Prüfungssimulator:** 18 Präparate (Schemazeichnungen): Gewebe wählen, Zellform und Schichtung bestimmen, Merkmale markieren, Funktion zuordnen, begründen, Musterlösung. Fehlerkategorien nach Lastenheft 4.7. **Eigene Präparate:** Fotos echter Präparate lokal (IndexedDB) speichern und damit üben.
- **Terminologietrainer:** Zerlegen, Ergänzen, Schreibweise, Erschließen, Zuordnen.
- **Bildbetrachter:** Vergrößern und Verschieben in Anatomie- und Histologie-Abbildungen.
- **Wiederholung:** berücksichtigt jetzt Selbsteinschätzung, Schwierigkeit und wiederholte Fehler.
- **Fortschritt pro Fach:** Lernziele gesamt/bearbeitet/gefestigt, offene Lektionen, Fehlerquote, fällige Wiederholungen, letzte Prüfungsrunden.
- Keine Prüfungstermine in der App – Termine trägt Kim selbst ein.
- **Seminar 2 Chemie (Stöchiometrie):** Lektion „Stöchiometrie“ erweitert um Avogadrozahl, Molvolumen (22,4 l/mol), Gasvolumina, Elektrolyse, Molarität/Molalität, Massen- und Volumenprozent, ppm/ppb, Einwaage, Auffüllvolumen und Ionenkonzentrationen; 11 neue Rechenvorlagen und 5 Verständnisfragen. Ergebnisse dürfen in Zehnerpotenz-Schreibweise eingegeben werden (z. B. 3,01 · 10^23).

## Anatomie II und III (Stand 29.10.2026)

Neue Lektionen in der Reihenfolge des Leipziger Themenplans (Termine im Belegstatus, alle Wochentage im Zeitraum):
Nervensystem (24.11.–1.12.), Herz und Kreislauf/große Gefäße (3.–17.12.), Blut und Gefäßwand (Histologie, 16.–18.12.),
Haut und Drüsen (Histologie, 4.–14.1.2027), Rumpfwand (7.–14.1.), obere Extremität (15.–19.1.), untere Extremität (21.–25.1.).

- Acht neue anklickbare Schemata (`src/ui/anatomyFigures2.tsx`): Rückenmarksquerschnitt mit Spinalnerv, Herz im Frontalschnitt,
  große Gefäße, Wirbelsäule mit Wirbel und Bandscheibe, Brustkorb und Bauchwand, Arm mit Handwurzel und Nerven, Bein mit Fuß und Nerven, Kniegelenk.
- Interaktive Ansichten (`src/pages/views/anatomy2Views.tsx`): Erkunden, Beschriften, Reflexbogen, Blutweg, Erregungsleitung,
  fetaler Kreislauf, Handwurzel-Drill und Nervenläsions-Fälle für Arm und Bein.
- Neue Gewebeschemata: Arterie (muskulär und elastisch), Vene, Kapillare, sieben Blutzellen im Ausstrich, Leisten- und Felderhaut, Schweißdrüse, seröse und muköse Drüse.
- `src/content/tasks6.ts`: 75 Aufgaben inkl. Beschriftungsaufgaben und 11 Fällen für den Histologie-Prüfungssimulator.

## Konto und Synchronisierung (Stand 29.10.2026)

- Hosting: GitHub Pages (`.github/workflows/deploy.yml` baut und testet bei jedem Push auf `main`).
- Datenbank: Supabase (Region Frankfurt), Zugangsdaten in `src/config.ts` (nur der öffentliche „publishable key“).
- Tabelle `progress` (ein Lernstand pro Person, `user_id` = Konto) mit Row Level Security: jede Person liest und schreibt nur ihre eigene Zeile.
- „Lokal zuerst“: Die App speichert immer sofort im Browser und funktioniert offline. Angemeldet wird im Hintergrund abgeglichen
  (holen → zusammenführen → speichern), bei Änderungen nach 3 s, beim Zurückkehren in den Tab, bei wiederhergestellter Verbindung und alle 2 min.
- Zusammenführen (`src/store/merge.ts`, getestet in `merge.test.ts`): Antworten, Prüfungsrunden und Lektionsfortschritt werden vereinigt;
  der Wiederholungsplan einer Aufgabe kommt vom Gerät mit der jüngsten Antwort, Karteikarten von der zuletzt bewerteten Fassung;
  Einstellungen, Notizen und Listen vom zuletzt geänderten Gerät. „Alle Daten löschen“ leert angemeldet auch den gesicherten Stand.
- Anmeldung mit E-Mail und Passwort (PKCE-Ablauf, damit Mail-Links mit dem Hash-Routing funktionieren).
- Zugang nur mit Konto: Ohne Anmeldung zeigt die App nur die Anmeldeseite (`LoginGate` in `src/cloud/Account.tsx`). Das ist eine Zugangssperre für die Oberfläche; Lerninhalte und Quellcode selbst sind öffentlich abrufbar, Kims Lernstand ist durch die Datenbankregeln geschützt.

## Chemie nach Seminar 2: Gleichgewicht und Säuren/Basen (Stand 30.10.2026)

- `src/content/chem3.ts`: ausgebaute Lektionen „Chemisches Gleichgewicht, Löslichkeitsprodukt …“ und „Säuren, Basen, pH-Wert und Puffer“
  (bisherige Lernziele wörtlich erhalten, je drei neue: MWG-Rechnen, Le Chatelier, Löslichkeitsprodukt bzw. schwache Säuren/Basen, Salze/Ampholyte, Titration).
- Neue Ansichten (`src/pages/views/chem3Views.tsx`): MWG-Tabelle mit Schiebereglern, Le-Chatelier-Trainer (12 Fälle), Titrationskurve
  (exakte Ladungsbilanz, starke und schwache Säure), pK_S-Tabelle.
- 10 neue Rechenvorlagen und 24 Aufgaben (`tasks7.ts`).

## Kohlenwasserstoffe (Stand 30.10.2026)

- Neue Lektion `kohlenwasserstoffe` (`src/content/chem4.ts`) vor „Organische Chemie: funktionelle Gruppen“: Alkane, Alkene, Alkine,
  Hybridisierung, Nomenklatur, Isomerie, Eigenschaften, radikalische Substitution, elektrophile Addition, Verbrennung, biologische Bezüge.
- Ansicht `hydrocarbons` (`src/pages/views/chem4Views.tsx`): Vergleich sp³/sp²/sp, Benennungstrainer mit 14 Gerüstformeln, homologe Reihe
  mit Siedetemperaturen, Mechanismen Schritt für Schritt. 24 Aufgaben (`tasks8.ts`) und 2 Rechenvorlagen.
