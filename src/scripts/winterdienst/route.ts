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

import type { RoadLayout } from './winter-road';

// ── Stellwerte ───────────────────────────────────────────────────────────────
/** Fahrbahnbreite: Anteil des freien Rands, begrenzt auf diesen Bereich. */
const ROAD_SHARE = 0.5;
const ROAD_MIN = 60;
const ROAD_MAX = 84;
/** Halbe Gesamtbreite samt Schneerändern, als Vielfaches der Fahrbahnbreite. */
const HALF_WITH_SNOW = 0.66;
/** Abstand der Schneeränder zu Inhalt und Bildschirmrand. */
const CLEARANCE = 8;
/** Größter seitlicher Ausschlag beim Pendeln im Rand. */
const MAX_SWAY = 64;
/** Ungefährer Höhenabstand zwischen zwei Kurvenscheiteln. */
const BEND_SPACING = 420;
/** So weit ragt die Straßenmitte bei „Wofür wir stehen“ höchstens in den Inhalt. */
const INSET = 75;
/** Abstand zwischen Text und Schneerand bei „Wofür wir stehen“. */
const TEXT_GAP = 36;
/** Ein- und Ausfahrt: so weit außerhalb des Bildschirms beginnt/endet die
 *  Straße, als Vielfaches der Fahrbahnbreite (das Fahrzeug muss ganz draußen sein). */
const OUTSIDE = 1.6;
/** Radius des Bogens, mit dem die Straße nach der Einfahrt nach unten und vor
 *  der Ausfahrt nach rechts abbiegt, als Vielfaches der Fahrbahnbreite. */
const TURN = 1.4;
/** Ein- und Ausfahrt verlaufen fast waagrecht: so viel Höhe gewinnen sie je
 *  Pixel Breite. 0 = exakt waagrecht. */
const TILT = 0.05;

interface Point {
  x: number;
  y: number;
}

const anchor = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-wd-anchor="${name}"]`);

const n = (v: number): string => v.toFixed(1);

export function planRoute(root: HTMLElement, size: { width: number; height: number }): RoadLayout | null {
  const stats = anchor('start');
  const lastStat = stats?.lastElementChild;
  const values = anchor('values');
  const cta = anchor('cta');
  const field = anchor('end');
  const contact = field?.closest('section');
  if (!stats || !lastStat || !values || !cta || !field || !contact) return null;

  const origin = root.getBoundingClientRect();
  const box = (el: Element): { left: number; right: number; top: number; bottom: number } => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - origin.left,
      right: r.right - origin.left,
      top: r.top - origin.top,
      bottom: r.bottom - origin.top,
    };
  };

  const W = size.width;
  const statBox = box(lastStat);
  const valuesBox = box(values);
  const ctaBox = box(cta);
  const fieldBox = box(field);

  // Freier Rand zwischen Inhalt und Bildschirmkante.
  const contentRight = box(stats).right;
  const margin = W - contentRight;
  const roadWidth = Math.max(ROAD_MIN, Math.min(ROAD_MAX, margin * ROAD_SHARE));
  const half = roadWidth * HALF_WITH_SNOW;
  if (margin < 2 * (half + CLEARANCE)) return null;

  // Spur im Rand: `lo` liegt am Inhalt, `hi` Richtung Bildschirmkante.
  const lo = contentRight + CLEARANCE + half;
  const hi = Math.min(W - CLEARANCE - half, lo + MAX_SWAY);
  const opposite = (x: number): number => (Math.abs(x - lo) > Math.abs(x - hi) ? lo : hi);
  const canSway = hi - lo > 12;

  // „Wofür wir stehen“: rechts neben der längsten Textzeile bleiben.
  let textRight = valuesBox.left;
  const range = document.createRange();
  for (const el of values.querySelectorAll('h2, h3, li, p')) {
    range.selectNodeContents(el);
    textRight = Math.max(textRight, range.getBoundingClientRect().right - origin.left);
  }
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
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    // Griffe auf halber Höhe: weiche Bögen ohne Kante an den Scheiteln.
    const pull = (b.y - a.y) * 0.5;
    d += `C ${n(a.x)} ${n(a.y + pull)}, ${n(b.x)} ${n(b.y - pull)}, ${n(b.x)} ${n(b.y)} `;
  }

  // Ausfahrt: in einem Viertelkreis nach rechts und fast waagrecht neben dem
  // Nachricht-Feld hinaus.
  const pe = points[points.length - 1];
  d += `C ${n(pe.x)} ${n(pe.y + turn * 0.55)}, ${n(pe.x + turn * 0.45)} ${n(endY)}, ${n(pe.x + turn)} ${n(endY)} `;
  d += `C ${n(pe.x + turn + run / 3)} ${n(endY)}, ${n(outside - run / 3)} ${n(endY + run * TILT * 0.6)}, ${n(outside)} ${n(endY + run * TILT)}`;

  return { path: d, roadWidth, shadeFrom: box(contact).top };
}
