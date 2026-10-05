# SG Technik GmbH — Website

Astro + TypeScript + Tailwind v4. Entwickeln: `npm run dev` (http://localhost:4321),
bauen: `npx astro build`, Typen: `npx tsc --noEmit --incremental false`.
Am Handy im selben WLAN testen: `npm run dev:handy`, dann
http://macbook-air-von-simon.local:4321 öffnen.
`develop` ist der aktuelle Stand, Netlify veröffentlicht `main`.

## Ordner

| Ordner / Datei | Inhalt | Im Repository |
| --- | --- | --- |
| `src/` | die Website: `pages/`, `components/`, `content/` (Texte und Stellwerte), `scripts/` (Animationen, Simulation), `styles/`, `assets/` (optimierte Bilder) | ja |
| `public/` | Dateien, die unverändert ausgeliefert werden (Schriften, Logo, `_headers`) | ja |
| `docs/animationen/` | Doku zu Logo, Serpentine, Winterdienst-Straße und Anlagensimulation, Bildherkunft | ja |
| `docs/datenschutz/` | Datenschutz-Freigabe: Checkliste, Arbeitsplan, Cookie-Konzept, Wiedervorlage (PDF) | ja |
| `scripts/` | Hilfsskripte: Wiedervorlage-PDF, Texturen der Winterdienst-Straße, Browser-Prüfungen der Anlagensimulation (`sim-pruefung/`) | ja |
| `Logo/` | Original-Logodateien (PNG, SVG, PDF) | ja |
| `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md` | Design-System und Produktkontext (vor Design-Arbeit lesen) | ja |
| `PROJECT_STATUS.md` | Verlauf und Stand der Arbeiten | ja |
| `.impeccable/`, `.claude/` | Werkzeuge und Einstellungen für die Design-Prüfung bzw. Claude Code | ja |
| `Fotos/` | Original-Projektfotos (~270 MB) | nein |
| `Unterlagen/` | Briefing, Verarbeitungsverzeichnis, Berichte, Referenzmaterial | nein, nur README |
| `Nachweise/` | heruntergeladene Datenschutz-Nachweise | nein, nur README |
| `Rechtstexte/` | heruntergeladene Gesetzestexte | nein, nur README |
