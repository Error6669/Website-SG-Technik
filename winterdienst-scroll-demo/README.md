# Winterdienst-Scroll-Animation (separate Demo)

Eigenständige Demo, **nicht** in die Website eingebaut. Ein Winterdienstfahrzeug
fährt aus der Vogelperspektive eine verschneite Straße entlang, räumt sie und
streut am Heck Salz. Das Schild steht immer quer zur Straße und dreht sich dafür
in Kurven gegenüber dem Fahrzeug, der Schnee spritzt vom Schild an den Straßenrand. Die Straße läuft als Spalte neben dem Seiteninhalt; links
und rechts von ihr ist nichts gezeichnet, der Hintergrund ist transparent.

Die Fahrt hängt ausschließlich am Scroll-Fortschritt. Beim Zurückscrollen läuft
alles rückwärts, auch Räumspur und Salz.

Stand: Phase 1. Fahrbahn, Reif und Schneedecke sind Fototexturen. Das
**Fahrzeug ist ein gezeichneter Platzhalter**, der Schneewall am Rand ist
gerechnet. Siehe „Fehlende Assets“.

## Demo starten

Aus dem Projektordner der Website:

```
npx vite winterdienst-scroll-demo
```

Dann http://localhost:4330 öffnen. Es wird nichts installiert, die Demo nutzt
das Vite, das Astro mitbringt.

Hilfen über die Adresszeile (kombinierbar, z. B. `?solo&dark`):

| Zusatz    | Wirkung                                                        |
| --------- | -------------------------------------------------------------- |
| `?debug`  | zeichnet den Pfad mit allen Punkten und ihren Koordinaten ein  |
| `?solo`   | nur die Straße, ohne die Beispieltexte                         |
| `?dark`   | dunkler Seitenhintergrund, um die Transparenz zu prüfen        |
| `?p=0.5`  | friert den Fortschritt bei 50 % ein                            |

## Aufbau

```
winterdienst-scroll-demo/
  index.html            Demo-Seite (Text links, Straße rechts)
  vite.config.ts        nur für die Demo
  src/
    config.ts           ALLE Stellwerte (ROAD_PATH, ROAD_WIDTH, …)
    road-path.ts        Pfad auf den Container legen: Position und Richtung je Strecke
    plow.ts             Schildrichtung (quer zur Straße)
    scene.ts            Fahrbahn, Schnee, Reif, Spuren, Räumspur, Salz aus dem Pfad rechnen
    winter-road.ts      Scroll-Kopplung, Fahrzeug, Schild, Schnee- und Salzwurf, Zeichnen
    main.ts             Start der Demo (wird nicht übernommen)
    styles.css          .wd-* = Effekt, .demo-* = nur Demo
  assets/               Texturen und Fahrzeugbild
  tools/generate-assets.py   lädt/erzeugt die Assets neu
```

Technik: TypeScript + Canvas 2D, keine Bibliothek. Die Website nutzt für ihre
vorhandenen Straßenanimationen dasselbe Muster (`src/scripts/road-animation.ts`).

Damit das Scrollen ruhig bleibt, bewegt der Browser beide Ebenen selbst, nicht
das Skript:

1. **Straße:** ein Bild in voller Länge, das fest in der Seite liegt und mit ihr
   scrollt. Nachgezeichnet wird pro Bild nur der schmale Streifen, den das
   Fahrzeug gerade geräumt bzw. gestreut hat.
2. **Fahrzeug:** eine Fläche, die der Browser auf der Fahrlinie des Bildschirms
   festhält (`position: sticky`). Das Fahrzeug steht dadurch ruhig im Bild, die
   Straße läuft darunter durch. Das Skript zeichnet darauf Fahrzeug, Schild,
   fliegenden Schnee und Salz.

Das Fahrzeug steht immer dort, wo die Straße die Fahrlinie kreuzt. Das setzt
voraus, dass die Straße durchgehend abwärts führt. Läuft sie irgendwo wieder
aufwärts (Schleife), zählt ersatzweise der Anteil der gescrollten Strecke und
die Fläche wird nachgeschoben; das funktioniert, ist aber weniger ruhig.

## Wie die Straße auf der Seite sitzt

Die Straße füllt das Element mit `data-winter-road` (ein leeres `div`, mehr
Markup braucht es nicht):

- **so breit** wie dieses Element (in der Demo eine Rasterspalte),
- **so lang** wie dieses Element hoch ist (in der Demo so hoch wie der Text daneben).

Sie scrollt 1:1 mit der Seite mit. Das Fahrzeug steht auf halber Bildschirmhöhe
(`anchor`). Wo und wie groß die Straße auf der Seite erscheint, bestimmt also
allein das Layout dieses Elements; in der Demo ist das die Zeile
`grid-template-columns` bei `.demo-layout` in `styles.css`.

## ROAD_PATH ändern (Verlauf)

`src/config.ts`, Eintrag `roadPath`. Ein gewöhnlicher SVG-Pfad in einer
Zeichenfläche von 400 × 1600 (`viewBox`), die auf das Element gelegt wird:
x 0 = linker Rand, 400 = rechter Rand, y 0 = oben, 1600 = unten.

```
M 540 40                         Startpunkt (rechts außerhalb: Einfahrt)
C 380 45, 215 60, 200 260        Kurve bis 200/260, davor zwei Griffe
S 120 470, 135 620               nächste Kurve, schließt weich an
S 280 820, 268 1000
S 150 1200, 190 1340
S 380 1550, 540 1565             letztes Zahlenpaar = Endpunkt (rechts außerhalb: Ausfahrt)
```

- **Start/Ende:** erstes Zahlenpaar nach `M` bzw. letztes Zahlenpaar.
- **Ein- und Ausfahrt seitlich:** Start und Ende liegen außerhalb der
  Zeichenfläche (x über 400 = rechts draußen, x unter 0 = links draußen). Die
  Straße läuft dort aus dem Bild, das Fahrzeug steht am Anfang und am Ende
  unsichtbar daneben. Mindestens 130 Einheiten über den Rand hinausgehen, sonst
  schaut das Heck noch herein. Für eine Einfahrt von links z. B. `M -140 40`.
- **Wie weit nach links/rechts:** x-Wert des jeweiligen Kurvenendes.
- **Wie stark eine Kurve ist:** x-Wert des Griffs davor.
- **Mehr Kurven:** weitere `S`-Zeilen einfügen. Die y-Werte verteilen die Kurven
  über die Höhe; die tatsächliche Länge kommt vom Element.
- **Immer abwärts:** Die y-Werte müssen von Punkt zu Punkt größer werden, auch
  in Ein- und Ausfahrt.
- **Platz für den Rand:** zwischen Ein- und Ausfahrt x etwa zwischen 110 und 290
  halten, sonst wird der Schneerand an der Spaltenkante abgeschnitten.

Die Straße wird an der Kante ihres Elements abgeschnitten. Damit sie wirklich
aus dem Bildschirm läuft, muss das Element bis an den Bildschirmrand reichen
(in der Demo tut das die rechte Spalte).

**Fahrt und Scrollbereich:** Ist die Straße schon am Seitenanfang im Bild, steht
das Fahrzeug ganz oben auf der Seite am Straßenanfang (also draußen) und fährt
mit dem ersten Scrollen ein. Ist sie am Seitenende noch im Bild, ist es genau
dann am Straßenende (wieder draußen), wenn sich nicht weiter scrollen lässt.

Mit `?debug` sind alle Punkte beschriftet im Bild zu sehen. Der Pfad lässt sich
auch in Figma/Inkscape zeichnen und als `d`-Attribut hineinkopieren. Fahrbahn,
Schneeränder, Fahrspuren, Reif, Räumspur, Salz, Fahrzeugposition und -drehung
folgen automatisch.

## ROAD_WIDTH und weitere Stellwerte (alle in `src/config.ts`)

Breiten sind in Einheiten der Zeichenflächen-Breite (400 = ganze Spalte).

| Gewünscht            | Eintrag             | Hinweis                                          |
| -------------------- | ------------------- | ------------------------------------------------ |
| ROAD_WIDTH           | `roadWidth`         | 130 = knapp ein Drittel der Spalte               |
| VEHICLE_SIZE         | `vehicleSize`       | Fahrzeuglänge; bei schmalerer Straße mit anpassen |
| SCROLL_LENGTH        | `scrollLength`      | Mindesthöhe der Strecke in Bildschirmhöhen (Demo) |
| SNOW_AMOUNT          | `snowAmount`        | 0…1, Dichte der Schneedecke vor dem Fahrzeug     |
| ICE_AMOUNT           | `iceAmount`         | 0…1, Reif in den Fahrspuren; 0 = blanker Asphalt |
| TRACK_AMOUNT         | `trackAmount`       | 0…1, wie klar die Fahrspuren freigefahren sind   |
| CLEARED_ROAD_AMOUNT  | `clearedRoadAmount` | Räumeffekt: 1 = an, 0 = aus                      |
| Breite der Räumspur  | `clearedWidth`      | Anteil der Fahrbahnbreite                        |
| ROAD_EDGE_SNOW       | `roadEdgeSnow`      | 0…1, Schneeränder                                |
| SALT_AMOUNT          | `saltAmount`        | 0…1, Streusalz; 0 schaltet es ab                 |
| Wurfweite Salz       | `saltThrow`         | Anteil der Fahrzeuglänge                         |
| Schnee vom Schild    | `snowSprayAmount`   | 0…1, Auswurf an den Straßenrand; 0 = aus         |
| Schrägstellung Schild | `plow.restAngle`   | Grad; 0 = genau quer, Auswurf beidseitig; + = wirft nach rechts |
| VEHICLE_OFFSET       | `vehicleOffset`     | seitlicher Versatz, + = in Fahrtrichtung rechts  |
| Fahrhöhe im Bild     | `anchor`            | 0 = oben, 1 = unten                              |

## Fahrzeug-Asset austauschen

Weil sich das Schild dreht, besteht das Fahrzeug aus **zwei Bildern**:

- `vehicle.src`: Fahrzeug ohne Schild, Draufsicht, Front nach oben. Vor der
  Front bleibt im Bild Platz für das Schild frei.
- `plow.src`: das Schild allein, quer liegend, Drehpunkt in der Bildmitte,
  gleiche Bildbreite und gleicher Maßstab wie das Fahrzeugbild.

Beide freigestellt (PNG oder WebP mit Transparenz), ohne Schatten.

1. Bilder nach `assets/vehicle/` legen, Dateinamen in `config.ts` eintragen.
2. Zeigt die Fahrzeugfront nicht nach oben: `vehicle.imageRotation` setzen
   (90, 180 oder 270).
3. `plow.position` (Drehpunkt des Schilds vor der Fahrzeugmitte) und
   `vehicle.spreaderPosition` (Austritt des Salzes am Heck) nachstellen.
4. `vehicle.isPlaceholder` auf `false`.

Seitenverhältnis und Schatten werden aus dem Fahrzeugbild berechnet.

Texturen genauso: Datei in `assets/…` ersetzen oder den Pfad in `config.ts`
unter `textures` ändern.

## Herkunft der Texturen

`assets/road/asphalt.webp`, `assets/ice/frost.webp` und `assets/snow/snow.webp`
sind fotogescannte, kachelbare Texturen von Poly Haven (polyhaven.com:
`asphalt_02`, `asphalt_snow`, `snow_02`), Lizenz CC0. `tools/generate-assets.py`
lädt sie und passt Helligkeit und Farbton an.

## Fehlende Assets für die finale Version

Das Referenzfoto (`Animationen/straße/Winterdienstfahrzeug-Multihog-…webp`) zeigt
den orangen Multihog schräg von hinten. Daraus lässt sich keine Draufsicht
gewinnen, deshalb ist das Fahrzeug gezeichnet.

| Asset | Perspektive | Auflösung | Transparenz | Format | Kachelbar | Licht |
| --- | --- | --- | --- | --- | --- | --- |
| Winterdienstfahrzeug **ohne Schild** (orange, Streuer hinten) | exakt senkrecht von oben, Front nach oben | mind. 600 × 1300 px | ja, ohne Schatten | ca. 1 : 2,1 hoch | nein | diffus oder Sonne von links oben |
| Räumschild allein | exakt senkrecht von oben, quer | gleiche Breite wie das Fahrzeugbild | ja, ohne Schatten | ca. 4 : 1 quer | nein | wie Fahrzeug |
| Schneewall/Räumschnee (ersetzt den gerechneten Rand) | senkrecht von oben | 2048 × 2048 | nein | 1 : 1 | ja | flaches Licht von links oben |
| optional: eigene Asphalt-/Schneefotos statt der CC0-Texturen | senkrecht von oben | 2048 × 2048 | nein | 1 : 1 | ja | diffus, ohne Schlagschatten |

Reifenspuren, Räumspur, Schneeränder, Schneeauswurf und Salz brauchen keine eigenen Bilder, sie
entstehen aus dem Pfad.

## Spätere Integration (noch nicht durchgeführt)

Voraussichtlich, analog zur vorhandenen Serpentinen-Animation:

- `src/road-path.ts`, `src/plow.ts`, `src/scene.ts`, `src/winter-road.ts` → `src/scripts/`
- `src/config.ts` → `src/content/winterdienst.ts`
- `assets/` → `src/assets/winterdienst/`
- neue Komponente `src/components/WinterRoad.astro` mit dem Markup
  (`data-winter-road`), den `.wd-*`-Regeln aus
  `styles.css` und dem Aufruf von `mountWinterRoad`
- Einbau der Komponente als Spalte neben dem gewünschten Inhalt

`main.ts`, `index.html`, `vite.config.ts` und die `.demo-*`-Regeln entfallen.
Zu klären vor dem Einbau: auf welcher Seite, neben welchem Inhalt, links oder
rechts, und was auf schmalen Bildschirmen passieren soll.
