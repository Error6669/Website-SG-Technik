# Winterdienst-Straße

Ein Winterdienstfahrzeug fährt aus der Vogelperspektive eine verschneite Straße
entlang, räumt sie und streut am Heck Salz. Die Fahrt hängt am
Scroll-Fortschritt; beim Zurückscrollen läuft alles rückwärts, auch Räumspur und
Salz. Das Schild steht immer quer zur Straße und dreht sich in Kurven gegenüber
dem Fahrzeug.

- Komponente: `src/components/WinterRoad.astro` (`route="startseite"` oder
  `"leistungen"`), Kopfkommentar beschreibt Einbau, Abschalten (Kopfzeilen-
  Schalter, schmale Bildschirme, „Bewegung reduzieren“).
- Verlauf: aus Stellen der Seite berechnet, die mit `data-wd-anchor` markiert
  sind — `src/scripts/winterdienst/route.ts` (Startseite) und
  `route-leistungen.ts` (Leistungen). Kein fester Pfad mehr wie im Prototyp.
- Stellwerte: `src/content/winterdienst.ts`.
- Hilfen in der Adresszeile: `?wd-debug` zeichnet den Pfad mit allen Punkten,
  `?wd-p=0.5` stellt das Fahrzeug auf 50 % der Strecke.

## Stellwerte (`src/content/winterdienst.ts`)

| Eintrag | Wirkung |
| --- | --- |
| `roadWidth` | Fahrbahnbreite (Verhältniszahl, zusammen mit `vehicleSize`) |
| `vehicleSize` | Fahrzeuglänge; bei schmalerer Straße mit anpassen |
| `snowAmount` | 0 … 1, Dichte der Schneedecke vor dem Fahrzeug |
| `iceAmount` | 0 … 1, Reif in den Fahrspuren; 0 = blanker Asphalt |
| `trackAmount` | 0 … 1, wie klar die Fahrspuren freigefahren sind |
| `clearedRoadAmount` | Räumeffekt: 1 = an, 0 = aus |
| `clearedWidth` | Breite der Räumspur als Anteil der Fahrbahn |
| `roadEdgeSnow` | 0 … 1, Schneeränder |
| `saltAmount` | 0 … 1, Streusalz; 0 schaltet es ab |
| `saltThrow` | Wurfweite Salz, Anteil der Fahrzeuglänge |
| `snowSprayAmount` | 0 … 1, Schneeauswurf vom Schild; 0 = aus |
| `plow.restAngle` | Grad; 0 = genau quer, + = wirft nach rechts |
| `vehicleOffset` | seitlicher Versatz, + = in Fahrtrichtung rechts |
| `anchor` | Fahrhöhe im Bild, 0 = oben, 1 = unten |

## Fahrzeugbild austauschen

Das Fahrzeug ist noch ein gezeichneter Platzhalter
(`src/assets/winterdienst/vehicle/*-PLATZHALTER.webp`). Weil sich das Schild
dreht, besteht es aus **zwei Bildern**, beide freigestellt (PNG/WebP mit
Transparenz), ohne Schatten:

- `vehicle.src`: Fahrzeug ohne Schild, Draufsicht, Front nach oben; vor der
  Front bleibt Platz für das Schild.
- `plow.src`: das Schild allein, quer liegend, Drehpunkt in der Bildmitte,
  gleiche Bildbreite und gleicher Maßstab wie das Fahrzeugbild.

1. Bilder nach `src/assets/winterdienst/vehicle/` legen und in
   `src/content/winterdienst.ts` eintragen.
2. Zeigt die Front nicht nach oben: `vehicle.imageRotation` (90, 180, 270).
3. `plow.position` (Drehpunkt des Schilds) und `vehicle.spreaderPosition`
   (Salzaustritt am Heck) nachstellen.

Texturen genauso: Datei in `src/assets/winterdienst/…` ersetzen oder den Pfad
unter `textures` ändern.

## Herkunft der Texturen

`road/asphalt.webp`, `ice/frost.webp` und `snow/snow.webp` sind fotogescannte,
kachelbare Texturen von Poly Haven (polyhaven.com: `asphalt_02`,
`asphalt_snow`, `snow_02`), Lizenz CC0. Schneewall, Rauschmasken
(`noise/`) und der Fahrzeug-Platzhalter sind gerechnet bzw. gezeichnet.
`python3 scripts/winterdienst-texturen.py` erzeugt alle neu (lädt die
Poly-Haven-Bilder, passt Helligkeit und Farbton an; braucht numpy und Pillow)
und **überschreibt** `src/assets/winterdienst/`.

## Fehlende Assets für die finale Version

Das Multihog-Referenzfoto (`Unterlagen/Anlagensimulation/`) zeigt das Fahrzeug
schräg von vorn; eine Draufsicht lässt sich daraus nicht gewinnen.

| Asset | Perspektive | Auflösung | Transparenz | Format | Kachelbar | Licht |
| --- | --- | --- | --- | --- | --- | --- |
| Winterdienstfahrzeug **ohne Schild** (orange, Streuer hinten) | exakt senkrecht von oben, Front nach oben | mind. 600 × 1300 px | ja, ohne Schatten | ca. 1 : 2,1 hoch | nein | diffus oder Sonne von links oben |
| Räumschild allein | exakt senkrecht von oben, quer | gleiche Breite wie das Fahrzeugbild | ja, ohne Schatten | ca. 4 : 1 quer | nein | wie Fahrzeug |
| Schneewall/Räumschnee (ersetzt den gerechneten Rand) | senkrecht von oben | 2048 × 2048 | nein | 1 : 1 | ja | flaches Licht von links oben |
| optional: eigene Asphalt-/Schneefotos statt der CC0-Texturen | senkrecht von oben | 2048 × 2048 | nein | 1 : 1 | ja | diffus, ohne Schlagschatten |

Reifenspuren, Räumspur, Schneeränder, Schneeauswurf und Salz brauchen keine
eigenen Bilder, sie entstehen aus dem Pfad.
