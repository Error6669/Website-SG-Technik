// Verlauf der Winterdienst-Straße auf der Leistungsseite.
//
// Anders als auf der Startseite biegt die Straße hier nirgends ab: Sie kommt
// oben unter der Kopfzeile hervor (dort wartet das Fahrzeug am Seitenanfang), läuft in drei weiten Bögen an den sieben
// Schritten entlang und verschwindet unten unter der Fußzeile. Der mittlere
// Bogen schwingt in den freien Platz rechts neben den Texten der Schritte.
//
// Bezugsstelle im Markup (`data-wd-anchor`):
//   steps   die Liste der Schritte. Ihr letzter Eintrag ist der dunkle Block;
//           an ihm führt die Straße außen im Rand vorbei.

import { anchor, measureLane, n, sweep, TEXT_GAP, type Point } from './lane';
import type { RoadLayout } from './winter-road';

// ── Stellwerte (Fahrbahnbreite und Rand: siehe lane.ts) ─────────────────────
/** So weit ragt die Straßenmitte beim mittleren Bogen höchstens in den Inhalt. */
const INSET = 120;
/** Wo der mittlere Bogen seinen Scheitel hat, als Anteil der Höhe der hellen Schritte. */
const APEX = 0.45;
/** Abstand, den die Straße vor dem dunklen Block wieder im Rand sein muss. */
const BEFORE_DARK = 60;
/** So weit unter der Fläche endet die Straße, als Vielfaches der
 *  Fahrbahnbreite (das Fahrzeug muss ganz draußen sein). */
const OUTSIDE = 1.6;
/** So weit hinter der Unterkante der Kopfzeile wartet das Fahrzeug am
 *  Seitenanfang, als Vielfaches der Fahrbahnbreite. Gerade so viel, dass es
 *  ganz verdeckt ist: Schon nach wenig Scrollen schaut es darunter hervor. */
const HIDDEN = 1.0;

export function planRoute(root: HTMLElement, size: { width: number; height: number }): RoadLayout | null {
  const steps = anchor('steps');
  const dark = steps?.lastElementChild;
  if (!steps || !dark) return null;

  // Der dunkle Block ragt etwas über die Inhaltsspalte hinaus; der Rand zählt ab ihm.
  const lane = measureLane(root, dark, size.width);
  if (!lane) return null;
  const { lo, hi, roadWidth, half, contentRight, box } = lane;
  const stepsBox = box(steps);
  const darkBox = box(dark);

  // Rechts neben der längsten Textzeile der Schritte bleiben.
  const textRight = lane.textRight(steps, 'h3, p');
  const inner = Math.min(lo, Math.max(textRight + TEXT_GAP + half, contentRight - INSET));

  const out = roadWidth * OUTSIDE;
  const backInLane = darkBox.top - BEFORE_DARK;
  // Unterkante der fest stehenden Kopfzeile am Seitenanfang, in der Fläche.
  const header = document.querySelector('header');
  const headerBottom = (header?.offsetHeight ?? 0) - (root.getBoundingClientRect().top + window.scrollY);
  const points: Point[] = [
    { x: hi, y: headerBottom - roadWidth * HIDDEN },
    { x: inner, y: stepsBox.top + (backInLane - stepsBox.top) * APEX },
    { x: hi, y: backInLane },
    { x: lo, y: size.height + out },
  ];
  for (let i = 1; i < points.length; i++) {
    // Zu wenig Höhe für einen weiten Bogen: lieber keine Straße als eine enge Kurve.
    if (points[i].y - points[i - 1].y < 240) return null;
  }

  let d = `M ${n(points[0].x)} ${n(points[0].y)} `;
  for (let i = 1; i < points.length; i++) d += sweep(points[i - 1], points[i]);
  return { path: d.trim(), roadWidth };
}
