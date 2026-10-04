# Anlagensimulation: Silo- und Soleanlage

Auf der Website unter `/anlagensimulation`, erreichbar über die Knöpfe
„Unsere Anlagen“ am Ende jedes Produkttexts auf `/produkte-technik`. Die
Simulation zeigt
eine Silo- und Soleanlage als technische Zeichnung im Schnitt. Zu sehen sind
ein hoch aufgeständertes Salzsilo mit 600 t (Befüllleitung links), eine
Dosierschnecke, ein am Boden stehender Soleaufbereiter (Wasser von oben), ein
Pumpen- und Ventilkasten, ein Soletank, eine Zapfstelle, RFID-Leser und die Steuerung. Dazu kommt der SalzManager als Bildschirm in der
Zeichnung, davor die Zufahrt für die Winterdienstfahrzeuge.

Anlage, SalzManager-Daten und Bedienleiste passen zusammen auf einen
Bildschirm. Bei niedrigen Fenstern wird die Zeichnung kleiner, statt dass
gescrollt werden muss.

## Abläufe

| Nr. | Ablauf             | Was passiert                                                                 | Belegt               |
| --- | ------------------ | ---------------------------------------------------------------------------- | -------------------- |
| 01  | Sole herstellen    | P3 pumpt Wasser von oben in den Aufbereiter, Salz über die Schnecke, lösen auf 22 %, P1 fördert in den Tank | P1, P3 (nur hier genutzt) |
| 02  | Sole umwälzen      | P2 saugt am Tankboden an und gibt über die Füllleitung zurück, die Schichtung verschwindet | P2                   |
| 03  | Soletank entleeren | P2 pumpt den Tank über den Ablass leer                                        | P2                   |
| 04  | Sole entnehmen     | Sprühfahrzeug fährt vor, RFID-Chip wird gelesen, Stecker, P2 füllt, Protokolleintrag | Zufahrt, P2          |
| 05  | Salz entnehmen     | Streu-LKW fährt unter das Silo, RFID-Chip wird gelesen, Ampel, Schieber mit Rüttler, Schlauchstück, Verwiegung | Zufahrt, Siloauslauf |
| 06  | Salz anliefern     | Silozug kommt von links, kuppelt an der Befüllleitung an, bläst pneumatisch ein, Überfüllsicherung | Zufahrt, Befüllleitung |

**Pumpen- und Ventilkasten:** P1, P2, P3 und alle Ventile sitzen in einem
Kasten. P3 pumpt das Lösewasser von oben in den Aufbereiter (Ventil vW). P1
fördert vom Aufbereiter in den Tank (vM, vF). P2 fördert vom Tank zur
Zapfstelle (vT, vZ), zurück in den Tank (vT, vR) oder zum Ablass (vT, vD).

**RFID:** Silo und Zapfstelle haben denselben Leser auf einer Säule. Beim
Lesen zeigt er Funkwellen, nach der Freigabe leuchtet er kupferfarben.

Abläufe ohne gemeinsames Betriebsmittel laufen parallel, z. B. Sole herstellen
und gleichzeitig Salz entnehmen. Ein gesperrter Knopf bleibt anklickbar und
nennt in der Statuszeile den Grund („Pumpe P2 belegt: Sole entnehmen“).
Die Abläufe 01–03 lassen sich stoppen. Fahrzeugabläufe laufen bis zum Ende,
„Zurücksetzen“ bricht alles ab.

## Zahlen und Zeitraffer

Mengen und Leistungen sind reale Anlagenwerte aus `src/content/anlagensimulation.ts`: 15.000 l/h
Löseleistung, 22 % bzw. 1,17 kg/l, Soletank 50 m³, Abgabe 36 m³/h,
Siloabzug 60 t/h, Befüllung 40 t/h. Die Zeit läuft im Zeitraffer:
1 Sekunde entspricht 3 Minuten (`timeScale: 180`). Das Tempo ist fest, eine
Umschaltung gibt es nicht.

**Annahmen, bitte fachlich prüfen:** Tankgröße 50 m³, Aufbereiter 7 m³, Pumpen- und
Abzugsleistungen, Fahrzeugtank 6 m³, Streuer 8 t, Silozug 26 t, die Zeit bis zur
spürbaren Schichtung (8 h) und die Dauer des Umwälzens (20 min). Aus den
Website-Texten stammen nur 600 t (Vorgabe), 15.000 l/h, ± 200 kg und RFID bzw.
Überfüllschutzstecker. Alle Werte stehen in `src/content/anlagensimulation.ts`.

## Aufbau

Pfade relativ zum Projektordner der Website:

```
src/pages/anlagensimulation.astro      Seite /anlagensimulation
src/components/PlantSimulation.astro   Einbau, liest ?bereich=…
src/content/anlagensimulation.ts       ALLE Stellwerte: Mengen, Leistungen,
                                       Zeitraffer, Geometrie, Handy-Bereiche
src/styles/anlagensimulation.css       .ps-* (global, Markup entsteht per Skript)
src/scripts/anlagensimulation/
  model.ts         Anlagenzustand und Taktgeber (kein DOM)
  processes.ts     die sechs Abläufe Schritt für Schritt, Sperrlogik
  scene.ts         die Zeichnung als SVG samt SalzManager-Bildschirm
  vehicles.ts      Fahrzeuge in Seitenansicht
  view.ts          Zustand → Zeichnung, in jedem Bild
  camera.ts        Ausschnitt auf schmalen Bildschirmen (Bereichs-Reiter)
  panel.ts         Bedienleiste, Statuszeile, Ablauf- und Positionsliste,
                   SalzManager-Feld fürs Handy
  format.ts        Zahlenformat de-AT
  plant-sim.ts     mountPlantSimulation(element, { area }), Einstieg

```

Technik: TypeScript und SVG, keine Bibliothek. Die Zeichnung ist flach und
mit Haarlinien gezeichnet, Positionsnummern wie in einer Werkzeichnung
(DESIGN.md, „The Site Plan“). Farben sind nur Abstufungen von Navy und Kupfer.
Kupfer bedeutet „aktiv“: Ventil offen, Pumpe läuft, Ablauf aktiv.
**Ausnahme:** Die beiden Ampeln leuchten rot/grün, weil ihre Bedeutung an der
Farbe hängt (`C.red`/`C.green` in `scene.ts`).

**Sprühfahrzeug:** Vorbild ist der Multihog-Geräteträger aus
`Unterlagen/Anlagensimulation/Winterdienstfahrzeug-Multihog-mit-Schneeschild-und-Enteisungsspruehanlage-1024x726.jpg.webp`:
verglaste Kabine mit Rundumleuchte, Schneeschild mit Warnstreifen,
Edelstahl-Soletank mit Sichtfenster, Pumpe, Schlauchtrommel und Sprühbalken am
Heck. Es hält mit der Kabine direkt am RFID-Leser der Zapfstelle.

**Anlehnung an die Straßenanimation** (`src/scripts/road-animation.ts`): Die
Fahrzeuge sind SVG wie dort `carSVG`, aufgebaut aus Grundfarbe plus
`shade()`-Abstufungen und mit Rundumleuchte. Der Takt läuft über
`requestAnimationFrame`, der Zeitschritt ist auf 0,1 s gedeckelt. Die Räder
drehen sich mit der gefahrenen Strecke, Anfahren und Bremsen sind weich. Die
Straßenanimation zeigt Fahrzeuge von oben; hier steht die Anlage im Schnitt,
deshalb kommen sie in derselben Machart von der Seite.

**Bewegung reduzieren:** Die Fahrzeuge stehen sofort am Ziel, Strömungen
werden ohne Animation als farbige Leitungen gezeigt. Alle Abläufe funktionieren
weiterhin.

**Fensterhöhe:** Die Zeichnung ist auf `100svh − --ps-chrome` begrenzt
(`.ps-svg` in `src/styles/anlagensimulation.css`; 18 rem wegen der
Kopfzeile, gesetzt in `PlantSimulation.astro`). So bleiben Anlage, SalzManager und Bedienleiste
gemeinsam im Bild.

**Schmale Bildschirme (< 48 rem):** Bereichs-Reiter Gesamt · Silo ·
Aufbereiter · Soletank · Zapfstelle über der Zeichnung; sie zoomt per viewBox
auf den gewählten Ausschnitt (hochformatig, scharf, weil Vektor). Startet ein
Ablauf, schwenkt die Ansicht selbst dorthin. Die SalzManager-Werte stehen als
Feld unter den Knöpfen. Startbereich per `?bereich=…`; die Zuordnung Produkt →
Bereich steht in `PRODUCT_AREA`.

## Herkunft

Zuerst als eigenständige Demo im Ordner `Anlagensimulation/` gebaut, am
04.10.2026 in die Website übernommen, die Demo am 05.10.2026 gelöscht.
Referenzmaterial (SalzManager-Screens, Automatisierungs-Schemata,
Multihog-Foto): `Unterlagen/Anlagensimulation/`; die Anlagenfotos (Gmunden,
Obernberg, Trieben-Selzthal) liegen in `Fotos/`.
