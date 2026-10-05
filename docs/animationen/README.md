# Animationen der Website

Alle Animationen wurden zuerst als eigenständige Prototypen gebaut und dann in
die Website übernommen. Die Prototypen sind gelöscht (05.10.2026); maßgeblich
ist nur noch der Code in `src/`.

| Animation | Wo auf der Website | Dateien | Doku |
| --- | --- | --- | --- |
| Logo (Intro + Silo-Loop) | Startseite, Hero | `src/components/LogoMark.astro`, `src/scripts/sg-technik-logo.js`, statisch: `public/logo/sg-technik-mark-static.svg` | Kommentare in den Dateien |
| Serpentine mit Fahrzeugen | Danke-Seite (Hintergrund) | `src/components/SerpentineBackdrop.astro`, `src/scripts/road-animation.ts`, `src/content/serpentine.ts`, Foto `src/assets/waldstrasse-serpentine.jpg` | Kommentare in den Dateien |
| Winterdienst-Straße beim Scrollen | Startseite und Leistungen, rechter Rand | `src/components/WinterRoad.astro`, `src/scripts/winterdienst/`, `src/content/winterdienst.ts`, `src/assets/winterdienst/`, Wald `src/assets/wald/winterwald.webp` | [winterdienst-strasse.md](winterdienst-strasse.md) |
| Anlagensimulation | `/anlagensimulation` (Knöpfe „Interaktive Anlage öffnen“ auf Produkte & Technik) | `src/pages/anlagensimulation.astro`, `src/components/PlantSimulation.astro`, `src/scripts/anlagensimulation/`, `src/content/anlagensimulation.ts`, `src/styles/anlagensimulation.css` | [anlagensimulation.md](anlagensimulation.md) |

## Herkunft der Bilder

- **Serpentine und Wald:** beide aus demselben Luftbild einer verschneiten
  Waldstraße (Original 3141 × 1764 px, Datei `EFF597F8-…_1_201_a.jpeg` aus dem
  früheren Ordner `Animationen/`). Für den Wald wurde die Straße herausgerechnet.
  Die Website enthält nur die optimierten Kopien; das Original ist nicht mehr im
  Projektordner.
- **Texturen der Winterdienst-Straße:** Poly Haven, Lizenz CC0, siehe
  [winterdienst-strasse.md](winterdienst-strasse.md#herkunft-der-texturen).
- **Referenzmaterial der Anlagensimulation** (Anlagenfotos, SalzManager-Screens,
  Multihog-Foto): `Unterlagen/Anlagensimulation/` (lokal, nicht im Repository)
  bzw. die Projektfotos in `Fotos/`.
