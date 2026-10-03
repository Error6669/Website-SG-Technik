// Gemeinsame Grundlage der Straßenverläufe (route.ts für die Startseite,
// route-leistungen.ts für die Leistungsseite): Breite der Fahrbahn, die Spur
// im freien Rand rechts neben dem Inhalt und geschwungene Verbindungen.
//
// Alle Werte sind CSS-Pixel in der Fläche der Straße (0/0 = links oben, rechte
// Kante = rechter Bildschirmrand).

// ── Stellwerte ───────────────────────────────────────────────────────────────
/** Fahrbahnbreite: Anteil des freien Rands, begrenzt auf diesen Bereich. */
const ROAD_SHARE = 0.32;
const ROAD_MIN = 38;
const ROAD_MAX = 54;
/** Halbe Gesamtbreite samt Schneerändern, als Vielfaches der Fahrbahnbreite. */
const HALF_WITH_SNOW = 0.66;
/** Abstand der Schneeränder zu Inhalt und Bildschirmrand. */
const CLEARANCE = 8;
/** Größter seitlicher Ausschlag beim Pendeln im Rand. */
const MAX_SWAY = 64;
/** Abstand zwischen Text und Schneerand, wo die Straße in den Inhalt schwenkt. */
export const TEXT_GAP = 36;

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface Lane {
  /** Breite der Fläche; ihre rechte Kante ist der rechte Bildschirmrand. */
  width: number;
  /** Rechte Kante des Seiteninhalts. */
  contentRight: number;
  roadWidth: number;
  /** Halbe Gesamtbreite der Straße samt Schneerändern. */
  half: number;
  /** Straßenmitte, wenn die Straße am Inhalt anliegt. */
  lo: number;
  /** Straßenmitte am äußeren Ende des Pendelbereichs, Richtung Bildschirmkante. */
  hi: number;
  /** true, wenn zwischen `lo` und `hi` genug Platz zum Pendeln ist. */
  canSway: boolean;
  /** Die jeweils andere Seite des Pendelbereichs. */
  opposite(x: number): number;
  /** Lage eines Elements in der Fläche. */
  box(el: Element): Box;
  /** Rechte Kante des Textes in den genannten Elementen (nicht ihrer Kästen). */
  textRight(within: Element, selector: string): number;
}

export const anchor = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-wd-anchor="${name}"]`);

export const n = (v: number): string => v.toFixed(1);

/** Bestimmt Fahrbahnbreite und Spur im Rand rechts von `content`. Liefert
 *  null, wenn der Rand für die Straße zu schmal ist. */
export function measureLane(root: HTMLElement, content: Element, width: number): Lane | null {
  const origin = root.getBoundingClientRect();
  const box = (el: Element): Box => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - origin.left,
      right: r.right - origin.left,
      top: r.top - origin.top,
      bottom: r.bottom - origin.top,
    };
  };

  const contentRight = box(content).right;
  const margin = width - contentRight;
  const roadWidth = Math.max(ROAD_MIN, Math.min(ROAD_MAX, margin * ROAD_SHARE));
  const half = roadWidth * HALF_WITH_SNOW;
  if (margin < 2 * (half + CLEARANCE)) return null;

  const lo = contentRight + CLEARANCE + half;
  const hi = Math.min(width - CLEARANCE - half, lo + MAX_SWAY);

  return {
    width,
    contentRight,
    roadWidth,
    half,
    lo,
    hi,
    canSway: hi - lo > 12,
    opposite: (x) => (Math.abs(x - lo) > Math.abs(x - hi) ? lo : hi),
    box,
    textRight(within, selector) {
      let right = box(within).left;
      const range = document.createRange();
      for (const el of within.querySelectorAll(selector)) {
        range.selectNodeContents(el);
        right = Math.max(right, range.getBoundingClientRect().right - origin.left);
      }
      return right;
    },
  };
}

/** Geschwungenes Stück von Scheitel `a` zu Scheitel `b` als Fortsetzung eines
 *  SVG-Pfads. An beiden Scheiteln läuft die Straße senkrecht; die Griffe auf
 *  halber Höhe ergeben weiche Bögen ohne Kante. */
export function sweep(a: Point, b: Point): string {
  const pull = (b.y - a.y) * 0.5;
  return `C ${n(a.x)} ${n(a.y + pull)}, ${n(b.x)} ${n(b.y - pull)}, ${n(b.x)} ${n(b.y)} `;
}
