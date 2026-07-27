// Pfad- und Fahrplandaten der Flussstraßen-Animation für den mobilen Kopfzeilen-Streifen.
// Herkunft: Animationen/flussstrasse-hochformat.html (lokaler Prototyp).
//
// Das Original ist Hochformat (3018×4026) mit fast senkrecht verlaufender Straße.
// Bild UND Pfad sind hier beim Bauen zweimal umgerechnet worden:
//   1. Drehung um 90° im Uhrzeigersinn — (x,y) → (4026-y, x) — damit die Straße
//      waagrecht liegt und in einen breiten, flachen Streifen passt. Gedreht wird
//      beim Bauen, nicht per CSS-transform: so gilt dieselbe geprüfte Cover-
//      Rechnung wie bei der Serpentine und die Fahrzeuge brauchen keinen Sonderfall.
//   2. Zuschnitt auf das Band von 50 % bis 95 % der Höhe. Mehr kann der
//      Streifen bei keiner Fensterbreite zeigen, und der Zuschnitt drückt das
//      ausgelieferte Bild von 418 kB auf 195 kB — bei einer Kopfzeile, die auf
//      JEDER Seite geladen wird, ist das der Unterschied, der zählt.
//
// Die Pfad-y-Werte sind um 1509 verschoben (der weggeschnittene obere Teil).
import type { CarRun } from '../scripts/road-animation';

export const flussstrasse = {
  width: 4026,
  height: 1358.1,
  cycle: 30,
  lane: 40,
  scale: 165,
  /** Anteil der Bildhöhe, auf dem die Straße liegt — Zielpunkt des Streifens. */
  focusY: 0.51111,
  path: [[4786,336],[4606,391],[4426,446],[4246,501],[4066,556],[3886,610],[3706,655],[3526,691],[3346,719],[3166,740],[2986,755],[2806,763],[2626,766],[2446,765],[2266,759],[2086,750],[1906,738],[1726,724],[1546,709],[1366,693],[1186,677],[1006,661],[826,646],[646,633],[466,622],[286,615],[106,611],[-74,610],[-254,610],[-434,610],[-614,610],[-794,610]] as ReadonlyArray<readonly [number, number]>,
  schedule: [
    {
      "t": 0,
      "dir": 1,
      "type": "kombi",
      "color": "#c9ced4",
      "dur": 12.5,
      "jitter": 3
    },
    {
      "t": 3.5,
      "dir": -1,
      "type": "suv",
      "color": "#24463a",
      "dur": 13.5,
      "jitter": -3
    },
    {
      "t": 9,
      "dir": 1,
      "type": "klein",
      "color": "#7d2230",
      "dur": 11.5,
      "jitter": -3
    },
    {
      "t": 15,
      "dir": -1,
      "type": "van",
      "color": "#eef1f3",
      "dur": 14,
      "jitter": 2
    },
    {
      "t": 17,
      "dir": 1,
      "type": "pickup",
      "color": "#35566f",
      "dur": 12.5,
      "jitter": 2
    }
  ] as ReadonlyArray<CarRun>,
};
