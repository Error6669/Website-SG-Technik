# Anlagensimulation: Silo- und Soleanlage

Auf der Website unter `/anlagensimulation`, erreichbar über die Knöpfe
„Interaktive Anlage öffnen“ am Ende jedes Produkttexts auf `/produkte-technik`. Die
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

Abläufe tragen Buchstaben (A–F), Positionen in der Zeichnung Zahlen (1–12) — so lassen sie sich nicht verwechseln.

| Abl.| Ablauf             | Was passiert                                                                 | Belegt               |
| --- | ------------------ | ---------------------------------------------------------------------------- | -------------------- |
| A   | Sole herstellen    | P3 pumpt Wasser von oben in den Aufbereiter, Salz über die Schnecke, lösen auf 22 %, P1 fördert in den Tank | P1, P3 (nur hier genutzt) |
| B   | Sole umwälzen      | P2 saugt am Tankboden an und gibt über die Füllleitung zurück, die Schichtung verschwindet | P2                   |
| C   | Soletank entleeren | P2 pumpt den Tank über den Ablass leer                                        | P2                   |
| D   | Sole entnehmen     | Sprühfahrzeug fährt vor, RFID-Chip wird gelesen, Stecker, P2 füllt, Protokolleintrag | Zufahrt, P2          |
| E   | Salz entnehmen     | Streu-LKW fährt unter das Silo, RFID-Chip wird gelesen, Ampel, Schieber mit Rüttler, Schlauchstück, Verwiegung | Zufahrt, Siloauslauf |
| F   | Salz anliefern     | Silozug kommt von links, kuppelt an der Befüllleitung an, bläst pneumatisch ein, Überfüllsicherung | Zufahrt, Befüllleitung |

**Pumpen- und Ventilkasten:** P1, P2, P3 und alle Ventile sitzen in einem
Kasten. P3 pumpt das Lösewasser von oben in den Aufbereiter (Ventil vW). P1
fördert vom Aufbereiter in den Tank (vM, vF). P2 fördert vom Tank zur
Zapfstelle (vT, vZ), zurück in den Tank (vT, vR) oder zum Ablass (vT, vD).

**RFID:** Silo und Zapfstelle haben denselben Leser auf einer Säule. Beim
Lesen zeigt er Funkwellen, nach der Freigabe leuchtet er kupferfarben.

Abläufe ohne gemeinsames Betriebsmittel laufen parallel, z. B. Sole herstellen
und gleichzeitig Salz entnehmen. Ein gesperrter Knopf bleibt anklickbar und
nennt in der Statuszeile den Grund („Pumpe P2 belegt: Sole entnehmen“).
Die Abläufe A–C lassen sich stoppen. Fahrzeugabläufe laufen bis zum Ende,
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
src/components/PlantSimulation.astro   Einbau
src/content/anlagensimulation.ts       ALLE Stellwerte: Mengen, Leistungen,
                                       Zeitraffer, Geometrie, Handy-Bereiche
src/styles/anlagensimulation.css       .ps-* (global, Markup entsteht per Skript)
src/scripts/anlagensimulation/
  model.ts         Anlagenzustand und Taktgeber (kein DOM)
  processes.ts     die sechs Abläufe Schritt für Schritt, Sperrlogik
  scene.ts         die Zeichnung als SVG samt SalzManager-Bildschirm
  vehicles.ts      Fahrzeuge in Seitenansicht
  view.ts          Zustand → Zeichnung, in jedem Bild
  camera.ts        Ausschnitt auf schmalen Bildschirmen (Menü „Ansicht“)
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

**Anlage und Knöpfe immer gemeinsam im Bild:** Nach dem Laden misst
`plant-sim.ts`, wie viel Platz unter dem Seitenkopf bleibt, und setzt
`--ps-fit` als Höchsthöhe der Zeichnung (neu gemessen nur bei geänderter
Breite, damit die Handy-Adressleiste nichts springen lässt). Ab 64 rem stehen
die Knöpfe als Spalte rechts neben der Zeichnung. Ein Rahmen
(`.ps-frame` in `PlantSimulation.astro`) ist genau so breit wie Zeichnung plus
Knopfspalte und steht mittig; Zurück-Link (als Slot; die
Überschrift ist nur für Screenreader da), Legende und Zeichnung beginnen darin an derselben linken Kante. Die Zeichnung hat keine
eigene Fläche, sie steht auf dem Seitenhintergrund. Unter 64 rem stehen die
Knöpfe in Reihen zu drei Knöpfen, auf dem
Handy kompakt ohne Zustandszeile (läuft = Kupfer, gesperrt = grau). Geprüft
auf 13 Fenstergrößen von 1920 × 1080 bis 360 × 740, darunter 390 × 664
(iPhone mit eingeblendeten Safari-Leisten).

**Schmale Bildschirme (< 48 rem):** Knopf „Ansicht“ links neben Info und
Positionen; er öffnet eine Auswahl Gesamt · Silo · Aufbereiter · Soletank ·
Zapfstelle · SalzManager (schließt nach der Wahl, mit Esc oder Tippen
daneben). Die Zeichnung zoomt per viewBox auf den gewählten Ausschnitt
(scharf, weil Vektor). „Ansicht“ steht links, Info und Positionen rechts.

**Ansicht folgt den Abläufen (Handy):** Startet oder endet ein Ablauf, zeigt
die Zeichnung die ganze Anlage (mindestens 1,5 s). Erst wenn alles Laufende
nur noch in einem Teil passiert, zoomt sie dorthin, z. B. Streu-LKW steht am
Silo → Silo, fährt ab → Gesamt. Welcher Schritt zu welchem Teil gehört, steht
in `processes.ts` (`ctx.step(text, bereich)`); Schritte ohne Bereich (Fahrten,
Dauerbetrieb über mehrere Teile) und Abläufe in verschiedenen Teilen
gleichzeitig zeigen die ganze Anlage. Die Logik steht in `plant-sim.ts`.
Für „Sole herstellen“ im Dauerbetrieb (P1 fördert in den Tank) gibt es den
Ausschnitt `produktion` (Schnecke bis Soletank); er steht nur der
Automatik zur Verfügung, nicht im Menü (`auto: true` in `AREAS`).

Unter den Knöpfen stehen die SalzManager-Werte als Feld und darunter alle
Meldungen seit dem Laden, die neueste oben, höchstens zehn (`LOG_MAX` in
`panel.ts`). „Zurücksetzen“ gibt es hier nicht (neu laden setzt zurück).

**Start und Fingertipp (Handy):** Nach dem Laden zeigt die Zeichnung immer
die ganze Anlage (früher per `?bereich=…` wählbar, entfernt). In der ganzen
Anlage öffnet ein Tipp den Bereich, der zur Stelle am besten passt (unter den
Bereichen, die den Punkt enthalten, der mit der nächsten Mitte; Bildschirm →
SalzManager). Ein Doppeltipp führt aus jedem Bereich zurück zur ganzen
Anlage. Ein Einzeltipp wartet dafür 0,3 s. `touch-action: manipulation`
verhindert, dass der Browser selbst zoomt. Die Steuerung (Pos. 11) liegt in
keinem Bereich, ein Tipp darauf öffnet die Zapfstelle.

**Info und Positionen:** zwei Knöpfe rechts in der Legendenzeile. „Info“
öffnet ein Pop-up (modales `<dialog>`) mit „So arbeitet die Anlage“ (Abläufe
mit aktuellem Zustand). „Positionen“ öffnet auf breiten Bildschirmen ein
nicht modales Feld genau über der Knopfspalte (oben bündig mit dem
Info-Knopf, unten bis zur Straße; `placePanel()` in `panel.ts`), damit die
Zeichnung sichtbar bleibt; es zeigt nur Nummer und Name, schließt mit ×, Esc,
erneutem Knopfdruck oder Klick daneben. Ohne Knopfspalte (Tablet, Handy)
öffnet es als Pop-up in der Mitte. Gescrollt werden muss nie: Spalten je nach
Breite, und passt es trotzdem nicht, verkleinert `fitDialog` in `panel.ts` die
Schrift (alle Größen im Pop-up in em). **Ausnahme Handy (< 48 rem):** Das Info-Pop-up ist kleiner
(höchstens 72 % der Fensterhöhe), hat feste, größere Schrift und darf scrollen.
Am Handy haben beide Pop-ups Glas-Optik (stärker weichgezeichnet als am Desktop).
Ist ein Pop-up (modal) offen, lässt sich dahinter nichts drücken oder scrollen
(`ps-dlg-lock` am `<html>`); Tippen auf den abgedunkelten Rand schließt es. Geprüft auf 12 Größen; auf gängigen
Handys 12–16 px, auf 320 × 568 px 10 px. Das Info-Pop-up hat Glas-Optik
(halbtransparent, weichgezeichnet).

**Bewusste Abweichungen von DESIGN.md (auf Wunsch, im CSS markiert):** runde
Knöpfe (8 px statt 2 px), Kupfer-Füllung laufender Abläufe, Glas-Optik des
Info-Pop-ups, Ampeln in Rot/Grün.

**Texte in der Zeichnung:** Größen in viewBox-Einheiten (CSS `.ps-t-*`);
wechselnde Texte im SalzManager-Bildschirm tragen `data-max` und werden in
`view.ts` per Messung mit „…“ gekürzt. Nach jeder Änderung an Texten oder
Positionen `scripts/sim-pruefung/textcheck.mjs` laufen lassen (0 Funde) und
vergrößerte Bildschirmfotos ansehen — die Prüfung erkennt keine Texte, die an
Bauteilen kleben.

**Prüfskripte:** `scripts/sim-pruefung/` (README dort).

## Herkunft

Zuerst als eigenständige Demo im Ordner `Anlagensimulation/` gebaut, am
04.10.2026 in die Website übernommen, die Demo am 05.10.2026 gelöscht.
Referenzmaterial (SalzManager-Screens, Automatisierungs-Schemata,
Multihog-Foto): `Unterlagen/Anlagensimulation/`; die Anlagenfotos (Gmunden,
Obernberg, Trieben-Selzthal) liegen in `Fotos/`.
