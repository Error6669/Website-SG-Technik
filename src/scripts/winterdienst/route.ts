// Verlauf der Winterdienst-Straße auf der Startseite.
//
// Die Straße liegt als Streifen am rechten Bildschirmrand über der ganzen
// Seite. Ihr Verlauf wird aus der Lage von vier Stellen berechnet, die im
// Markup mit `data-wd-anchor` markiert sind:
//
//   start   Statistikleiste im Hero: rechts neben dem letzten Feld (24 h)
//           kommt die Straße aus dem rechten Bildschirmrand
//   values  „Wofür wir stehen“: hier schwenkt sie zur Seitenmitte, bleibt
//           aber rechts vom Text
//   cta     Trennlinie des CTA-Streifens: bis dorthin ist sie zurück im Rand
//   end     Nachricht-Feld im Kontaktformular: daneben läuft sie wieder
//           rechts aus dem Bildschirm
//
// Dazwischen pendelt sie im freien Rand rechts neben dem Inhalt hin und her,
// damit kein Stück gerade ist. Alle Werte sind CSS-Pixel in der Fläche der
// Straße (0/0 = links oben, rechte Kante = rechter Bildschirmrand).

import { anchor, measureLane, n, sweep, TEXT_GAP, type Point } from './lane';
import type { RoadLayout } from './winter-road';

// ── Stellwerte (Fahrbahnbreite und Rand: siehe lane.ts) ─────────────────────
/** Ungefährer Höhenabstand zwischen zwei Kurvenscheiteln. */
const BEND_SPACING = 420;
/** So weit ragt die Straßenmitte bei „Wofür wir stehen“ höchstens in den Inhalt. */
const INSET = 75;
/** Ein- und Ausfahrt: so weit außerhalb des Bildschirms beginnt/endet die
 *  Straße, als Vielfaches der Fahrbahnbreite. Gerade so viel, dass das
 *  Fahrzeug ganz draußen ist: Schon nach wenig Scrollen fährt es herein. */
const OUTSIDE = 1.0;
/** Radius des Bogens, mit dem die Straße nach der Einfahrt nach unten und vor
 *  der Ausfahrt nach rechts abbiegt, als Vielfaches der Fahrbahnbreite. */
const TURN = 1.4;
/** Ein- und Ausfahrt verlaufen fast waagrecht: so viel Höhe gewinnen sie je
 *  Pixel Breite. 0 = exakt waagrecht. */
const TILT = 0.05;

export function planRoute(root: HTMLElement, size: { width: number; height: number }): RoadLayout | null {
  const stats = anchor('start');
  const lastStat = stats?.lastElementChild;
  const values = anchor('values');
  const cta = anchor('cta');
  const field = anchor('end');
  const contact = field?.closest('section');
  if (!stats || !lastStat || !values || !cta || !field || !contact) return null;

  const lane = measureLane(root, stats, size.width);
  if (!lane) return null;
  const { lo, roadWidth, half, contentRight, opposite, canSway, box } = lane;
  const W = lane.width;
  const statBox = box(lastStat);
  const valuesBox = box(values);
  const ctaBox = box(cta);
  const fieldBox = box(field);

  // „Wofür wir stehen“: rechts neben der längsten Textzeile bleiben.
  const textRight = lane.textRight(values, 'h2, h3, li, p');
  const inner = Math.min(lo, Math.max(textRight + TEXT_GAP + half, contentRight - INSET));

  // Feste Scheitelpunkte. An jedem läuft die Straße kurz senkrecht.
  const outside = W + roadWidth * OUTSIDE;
  const turn = roadWidth * TURN;
  const startY = (statBox.top + statBox.bottom) / 2;
  const endY = (fieldBox.top + fieldBox.bottom) / 2;
  const fixed: Point[] = [
    { x: lo, y: startY + turn },
    { x: lo, y: valuesBox.top - 44 },
    { x: inner, y: (valuesBox.top + valuesBox.bottom) / 2 },
    { x: lo, y: ctaBox.top - 24 },
    { x: lo, y: endY - turn },
  ];
  for (let i = 1; i < fixed.length; i++) {
    // Die Scheitel müssen von oben nach unten aufeinander folgen, mit Platz für eine Kurve.
    if (fixed[i].y - fixed[i - 1].y < 60) return null;
  }

  // Zwischen den festen Punkten pendeln, abwechselnd zur einen und zur anderen
  // Seite. Zwei aufeinanderfolgende Scheitel dürfen nie auf derselben Seite
  // liegen, sonst wäre das Stück dazwischen gerade.
  const points: Point[] = [fixed[0]];
  for (let i = 1; i < fixed.length; i++) {
    const p = fixed[i - 1];
    const q = fixed[i];
    let count = Math.max(0, Math.round((q.y - p.y) / BEND_SPACING) - 1);
    const first = opposite(p.x);
    const side = (k: number): number => (k % 2 === 0 ? first : opposite(first));
    const last = count ? side(count - 1) : p.x;
    if (canSway && Math.abs(last - q.x) < 12) count += 1;
    for (let k = 0; k < count; k++) {
      points.push({ x: side(k), y: p.y + ((q.y - p.y) * (k + 1)) / (count + 1) });
    }
    points.push(q);
  }

  // Einfahrt: fast waagrecht von rechts außen neben dem 24-h-Feld herein, dann
  // in einem Viertelkreis nach unten in die Spur. 0.55 ist der Griffabstand,
  // mit dem eine Kurve einem Kreisbogen am nächsten kommt.
  const p0 = points[0];
  const run = outside - (p0.x + turn);
  let d = `M ${n(outside)} ${n(startY - run * TILT)} `;
  d += `C ${n(outside - run / 3)} ${n(startY - run * TILT * 0.6)}, ${n(p0.x + turn + run / 3)} ${n(startY)}, ${n(p0.x + turn)} ${n(startY)} `;
  d += `C ${n(p0.x + turn * 0.45)} ${n(startY)}, ${n(p0.x)} ${n(p0.y - turn * 0.45)}, ${n(p0.x)} ${n(p0.y)} `;

  // Geschwungene Stücke von Scheitel zu Scheitel.
  for (let i = 1; i < points.length; i++) d += sweep(points[i - 1], points[i]);

  // Ausfahrt: in einem Viertelkreis nach rechts und fast waagrecht neben dem
  // Nachricht-Feld hinaus.
  const pe = points[points.length - 1];
  d += `C ${n(pe.x)} ${n(pe.y + turn * 0.55)}, ${n(pe.x + turn * 0.45)} ${n(endY)}, ${n(pe.x + turn)} ${n(endY)} `;
  d += `C ${n(pe.x + turn + run / 3)} ${n(endY)}, ${n(outside - run / 3)} ${n(endY + run * TILT * 0.6)}, ${n(outside)} ${n(endY + run * TILT)}`;

  return { path: d, roadWidth, shadeFrom: box(contact).top };
}
