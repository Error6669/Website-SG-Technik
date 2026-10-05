# Prüfskripte Anlagensimulation

Automatische Prüfungen im Browser (Chrome headless, gesteuert über das
DevTools-Protokoll mit dem `WebSocket` von Node 24 — **keine Zusatzpakete**).
Entstanden beim Feinschliff der Anlagensimulation am 05.10.2026; Grundlage für
jede weitere Änderung an Layout, Schrift oder Pop-ups.

Voraussetzung: Google Chrome unter `/Applications`, ein laufender Server.
Chrome-Profile und Bildschirmfotos landen in `$TMPDIR/sim-pruefung`
(änderbar mit `SIM_OUT=…`).

```
npm run dev                      # oder: npx astro build && npx astro preview
node scripts/sim-pruefung/fitcheck.mjs http://localhost:4321/anlagensimulation
```

| Skript | Prüft | Erwartung |
| --- | --- | --- |
| `fitcheck.mjs <url> [WxH,…]` | 13 Fenstergrößen: Sind Zeichnung und alle sechs Ablauf-Knöpfe nach dem Laden ohne Scrollen sichtbar? | `nicht passend: 0` |
| `scrollcheck.mjs <url> [WxH,…]` | Desktop: Seite gesperrt (auch per Mausrad), Fußzeile mit Impressum ganz sichtbar, Seite = Fensterhöhe | jede Zeile `OK` |
| `textcheck.mjs <url> [full] [bild.png]` | Alle Texte und Positionsnummern der Zeichnung auf Überschneidungen (in viewBox-Einheiten); `full` füllt vorher Protokoll und Meldungen und lässt Abläufe laufen | `Funde: 0` |
| `dlgcheck.mjs <url> [WxH-info,…]` | Pop-ups Info und Positionen auf 12 Größen: öffnen, Inhalt passt ohne Scrollen, im Fenster, schließen | `Fehler: 0` |
| `panelcheck.mjs <url>` | Positionen-Feld auf dem Desktop: pixelgenau über Info-Knopf bis Straße; Esc und Klick daneben schließen | jede Desktop-Zeile `bündig` |
| `smoke.mjs` | Alle Seiten auf 1440 und 390 px: JavaScript-Fehler, Konsolenwarnungen, fehlgeschlagene Anfragen (fest auf **`http://localhost:4399`**, also vorher `npx astro preview --port 4399`) | `Probleme gesamt: 0` |

Bekannte Eigenheiten:

- Die optionale Liste `WxH,…` erzeugt Bildschirmfotos (`fit-1440x900.png` usw.)
  in der Ablage.
- Den Cookie-Hinweis bestätigen die Skripte selbst („Verstanden“).
- `textcheck` erkennt keine Überschneidung von Text mit Bauteilen (z. B. eine
  Positionsnummer, die an der Zapfsäule klebt) — dafür vergrößerte
  Bildschirmfotos ansehen.
- Ohne `--hide-scrollbars` (so laufen fit/scroll/panel) wirken echte
  Scrollbalken auf das Layout; ein waagrechter Scrollbalken in der Zeichnung
  fiel genau so auf.
