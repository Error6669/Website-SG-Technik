// Pfad- und Fahrplandaten der Serpentinen-Animation.
// Übernommen aus dem Prototyp Animationen/waldstrasse-serpentine.html — die Punkte
// sind von Hand am Foto digitalisiert und liegen im Pixelraum des Originalbilds
// (3141×1764). Sie NICHT skalieren: die Fahrzeuge werden prozentual zur Bühne
// positioniert, die immer im Seitenverhältnis des Bilds bleibt.

import type { CarRun } from '../scripts/road-animation';

export const serpentine = {
  /** Originalmaße des Fotos in Pixeln. */
  width: 3141,
  height: 1764,
  /** Länge eines Animationszyklus in Sekunden. */
  cycle: 30,
  /** Abstand der Spurmitte von der Straßenachse, in Bildpixeln. */
  lane: 14,
  /** Länge eines PKW in Bildpixeln — Maßstab für alle Fahrzeugtypen. */
  scale: 58,
  path: [[1978,-384],[1903,-224],[1831,-69],[1758,87],[1755,102],[1745,128],[1723,162],[1689,196],[1645,228],[1594,254],[1539,274],[1481,286],[1422,292],[1361,295],[1301,293],[1240,287],[1180,278],[1119,270],[1059,261],[998,253],[937,248],[876,249],[816,256],[756,268],[699,287],[646,314],[600,351],[560,396],[520,441],[481,486],[446,533],[417,583],[391,634],[364,686],[340,738],[323,792],[312,849],[307,906],[306,963],[319,1015],[345,1065],[374,1114],[402,1163],[437,1207],[479,1245],[527,1276],[580,1298],[636,1309],[694,1312],[752,1314],[809,1315],[865,1306],[920,1296],[974,1287],[1028,1279],[1081,1271],[1131,1256],[1180,1233],[1230,1213],[1282,1204],[1337,1200],[1392,1195],[1448,1188],[1504,1186],[1560,1187],[1615,1193],[1668,1206],[1719,1229],[1768,1256],[1820,1275],[1875,1286],[1932,1290],[1986,1303],[2039,1324],[2091,1348],[2147,1365],[2205,1375],[2264,1379],[2324,1377],[2383,1368],[2442,1355],[2501,1347],[2559,1342],[2617,1334],[2673,1322],[2730,1308],[2786,1293],[2843,1283],[2899,1281],[2952,1287],[2997,1292],[3028,1295],[3044,1296],[3215,1313],[3386,1329],[3562,1347]] as ReadonlyArray<readonly [number, number]>,
  schedule: [
    {
      "t": 0,
      "dir": 1,
      "type": "kombi",
      "color": "#c9ced4",
      "dur": 17,
      "jitter": 1.5
    },
    {
      "t": 2.5,
      "dir": -1,
      "type": "suv",
      "color": "#24463a",
      "dur": 19,
      "jitter": -1.5
    },
    {
      "t": 8,
      "dir": 1,
      "type": "klein",
      "color": "#7d2230",
      "dur": 16,
      "jitter": -1
    },
    {
      "t": 11.5,
      "dir": -1,
      "type": "limo",
      "color": "#1b1d20",
      "dur": 18,
      "jitter": 1
    },
    {
      "t": 13,
      "dir": 1,
      "type": "van",
      "color": "#eef1f3",
      "dur": 16.5,
      "jitter": 0
    }
  ] as ReadonlyArray<CarRun>,
};
