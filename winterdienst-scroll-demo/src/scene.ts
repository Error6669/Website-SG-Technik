// Szenenaufbau: rechnet aus Straßenpfad + Texturen zwei deckungsgleiche Bilder
// der ganzen Strecke vor — einmal ungeräumt ("snow"), einmal geräumt
// ("cleared"). Beim Scrollen wird nichts davon neu berechnet; die Laufzeit
// blendet nur noch Ausschnitte übereinander.
//
// Neben der Straße bleibt alles transparent: gezeichnet werden nur Fahrbahn
// und Schneeränder. Alles leitet sich aus dem Pfad ab — wer ROAD_PATH ändert,
// bekommt Fahrbahn, Schneeränder, Fahrspuren, Reif und Räumspur neu, ohne eine
// einzige Grafik anzufassen.

import type { WinterRoadConfig } from './config';
import { throwRight } from './plow';
import type { RoadPath } from './road-path';

export interface Textures {
  asphalt: HTMLImageElement;
  snow: HTMLImageElement;
  snowRough: HTMLImageElement;
  frost: HTMLImageElement;
  cloud: HTMLImageElement;
  streaks: HTMLImageElement;
}

export interface World {
  snow: HTMLCanvasElement;
  cleared: HTMLCanvasElement;
}

export interface WorldLayout {
  /** Größe der Szene in CSS-Pixeln (= Größe des Containers). */
  width: number;
  height: number;
  /** Gerätepixel je CSS-Pixel. */
  ratio: number;
  /** Fahrbahnbreite in CSS-Pixeln. */
  road: number;
}

/** Streusalz: jedes Korn hat einen festen Landeplatz auf der Fahrbahn. */
export interface Salt {
  count: number;
  /** Strecke, bei der das Korn liegt (aufsteigend sortiert). */
  s: Float32Array;
  /** Seitlicher Landeplatz relativ zur Fahrspur, in Pixeln. */
  lateral: Float32Array;
  /** Landeplatz in Container-Koordinaten. */
  x: Float32Array;
  y: Float32Array;
  /** Kantenlänge des Korns in Pixeln. */
  size: Float32Array;
}

// Kantenlänge einer Texturkachel als Vielfaches der Fahrbahnbreite. Die
// Fototexturen zeigen 2–3 m; bei einer rund 3,6 m breiten Fahrbahn wären das
// Werte unter 1. Sie sind bewusst etwa doppelt so groß angesetzt, damit sich
// markante Stellen (Risse) nicht alle paar Meter wiederholen. Zusätzlich liegt
// jede Fläche zweimal in unterschiedlicher Größe und Drehung übereinander.
const TILE = { asphalt: 1.7, snow: 1.3, frost: 1.15, snowRough: 2.6, mask: 6 };

export function loadTextures(urls: WinterRoadConfig['textures']): Promise<Textures> {
  const load = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Textur konnte nicht geladen werden: ${src}`));
      img.src = src;
    });
  const keys = Object.keys(urls) as Array<keyof Textures>;
  return Promise.all(keys.map((k) => load(urls[k]))).then((imgs) => {
    const out = {} as Textures;
    keys.forEach((k, i) => (out[k] = imgs[i]));
    return out;
  });
}

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
}

function context(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D wird von diesem Browser nicht unterstützt.');
  return ctx;
}

/** Reproduzierbarer Zufall — die Szene sieht bei jedem Laden gleich aus. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Macht aus Graustufen-Rauschen eine Alphamaske. `coverage` ist der
 *  Flächenanteil, der deckend wird (das Rauschen ist dafür gleichverteilt). */
function thresholdMask(noise: HTMLImageElement, coverage: number, softness: number): HTMLCanvasElement {
  const c = createCanvas(noise.naturalWidth, noise.naturalHeight);
  const ctx = context(c);
  ctx.drawImage(noise, 0, 0);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const edge = 1 - Math.max(0, Math.min(1, coverage));
  const lo = edge - softness;
  const span = softness * 2 || 1e-6;
  for (let i = 0; i < d.length; i += 4) {
    let t = (d[i] / 255 - lo) / span;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    d[i] = d[i + 1] = d[i + 2] = 255;
    d[i + 3] = t * t * (3 - 2 * t) * 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Weicher runder Pinsel für Schneewälle. */
function softBrush(rgb = '22,40,66'): HTMLCanvasElement {
  const size = 64;
  const c = createCanvas(size, size);
  const ctx = context(c);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(0.55, `rgba(${rgb},0.92)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

/** Verteilt die Salzkörner entlang der Fahrspur. Rein rechnerisch und immer
 *  gleich — deshalb landet jedes Korn beim Vor- und Zurückscrollen am selben Platz. */
export function buildSalt(path: RoadPath, cfg: WinterRoadConfig, road: number): Salt {
  const amount = Math.max(0, Math.min(1, cfg.saltAmount));
  const spacing = road / (300 * Math.max(amount, 0.01));
  const from = path.min;
  const count = amount > 0 ? Math.floor((path.max - from) / spacing) : 0;
  const rnd = seeded(4711);
  const half = road * cfg.clearedWidth * 0.5;
  const salt: Salt = {
    count,
    s: new Float32Array(count),
    lateral: new Float32Array(count),
    x: new Float32Array(count),
    y: new Float32Array(count),
    size: new Float32Array(count),
  };
  for (let i = 0; i < count; i++) {
    const s = from + i * spacing;
    // Summe zweier Zufallswerte: in der Mitte dichter, zum Rand hin dünner —
    // so verteilt ein Streuteller.
    const lateral = (rnd() + rnd() - 1) * half * 1.05;
    const p = path.offsetAt(s, cfg.vehicleOffset * (road / cfg.roadWidth) + lateral);
    salt.s[i] = s;
    salt.lateral[i] = lateral;
    salt.x[i] = p.x;
    salt.y[i] = p.y;
    salt.size[i] = road * (0.007 + rnd() * 0.007);
  }
  return salt;
}

/** Schnee, der vom Schild zur Seite fliegt. Wie beim Salz hat jeder Brocken
 *  einen festen Landeplatz am Straßenrand. */
export interface Spray {
  count: number;
  /** Strecke der Fahrzeugmitte, bei der der Brocken das Schild verlässt (aufsteigend). */
  s: Float32Array;
  /** Landeplatz in Container-Koordinaten. */
  x: Float32Array;
  y: Float32Array;
  /** Startpunkt auf dem Schild: 0 = Mitte, 1 = äußeres Ende. */
  along: Float32Array;
  size: Float32Array;
  /** +1 = fliegt nach rechts, −1 = nach links. */
  side: Float32Array;
}

export function buildSpray(path: RoadPath, cfg: WinterRoadConfig, road: number): Spray {
  const amount = Math.max(0, Math.min(1, cfg.snowSprayAmount));
  const spacing = road / (380 * Math.max(amount, 0.01));
  const count = amount > 0 ? Math.floor(path.length / spacing) : 0;
  const rnd = seeded(1893);
  const vehicleLength = (cfg.vehicleSize / cfg.roadWidth) * road;
  const half = road * cfg.clearedWidth * 0.5;
  const right = throwRight(cfg);
  const spray: Spray = {
    count,
    s: new Float32Array(count),
    x: new Float32Array(count),
    y: new Float32Array(count),
    along: new Float32Array(count),
    size: new Float32Array(count),
    side: new Float32Array(count),
  };
  for (let i = 0; i < count; i++) {
    const s = i * spacing;
    const side = rnd() < right ? 1 : -1;
    // Die meisten Brocken landen knapp neben der Spur, einzelne fliegen weiter.
    const far = rnd();
    const reach = half + road * (0.03 + far * far * 0.34);
    const ahead = vehicleLength * (cfg.plow.position + 0.05 + rnd() * 0.3);
    const p = path.offsetAt(s + ahead, cfg.vehicleOffset * (road / cfg.roadWidth) + side * reach);
    spray.s[i] = s;
    spray.x[i] = p.x;
    spray.y[i] = p.y;
    spray.along[i] = 0.35 + rnd() * 0.65;
    spray.size[i] = road * (0.007 + rnd() * rnd() * 0.026);
    spray.side[i] = side;
  }
  return spray;
}

export function buildWorld(
  layout: WorldLayout,
  path: RoadPath,
  tex: Textures,
  cfg: WinterRoadConfig,
): World {
  const { width, height, ratio, road } = layout;
  const W = Math.round(width * ratio);
  const H = Math.round(height * ratio);
  const rnd = seeded(20261002);

  const snow = createCanvas(W, H);
  const scratch = createCanvas(W, H);
  const ctx = context(snow);
  const sx = context(scratch);

  // Gezeichnet wird in CSS-Pixeln; die Pixeldichte steckt in der Transformation.
  const toUnits = (c: CanvasRenderingContext2D): void => c.setTransform(ratio, 0, 0, ratio, 0, 0);
  const toPixels = (c: CanvasRenderingContext2D): void => c.setTransform(1, 0, 0, 1, 0, 0);

  const pattern = (
    c: CanvasRenderingContext2D,
    img: HTMLImageElement | HTMLCanvasElement,
    tile: number,
    angle = 0,
    shift = 0,
  ): CanvasPattern => {
    const p = c.createPattern(img, 'repeat');
    if (!p) throw new Error('Texturmuster konnte nicht angelegt werden.');
    const size = img instanceof HTMLImageElement ? img.naturalWidth : img.width;
    p.setTransform(new DOMMatrix().translate(shift, shift * 0.6).rotate(angle).scale((tile * road) / size));
    return p;
  };
  /** Zwei Lagen derselben Textur, gegeneinander gedreht und skaliert. */
  const layers = (c: CanvasRenderingContext2D, img: HTMLImageElement, tile: number): [CanvasPattern, CanvasPattern] => [
    pattern(c, img, tile),
    pattern(c, img, tile * 1.37, 31, tile * road * 0.41),
  ];

  const strokeRoad = (
    c: CanvasRenderingContext2D,
    style: string | CanvasPattern,
    lineWidth: number,
    alpha = 1,
    offset: number | ((s: number) => number) = 0,
  ): void => {
    c.globalAlpha = alpha;
    c.strokeStyle = style;
    c.lineWidth = lineWidth;
    c.lineJoin = 'round';
    c.lineCap = 'butt';
    path.trace(c, path.min, path.max, offset);
    c.stroke();
    c.globalAlpha = 1;
  };
  const strokeTextured = (
    c: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tile: number,
    lineWidth: number,
    offset = 0,
  ): void => {
    const [a, b] = layers(c, img, tile);
    strokeRoad(c, a, lineWidth, 1, offset);
    strokeRoad(c, b, lineWidth, 0.5, offset);
  };
  const fillArea = (c: CanvasRenderingContext2D, style: string | CanvasPattern, alpha = 1): void => {
    c.globalAlpha = alpha;
    c.fillStyle = style;
    c.fillRect(0, 0, width, height);
    c.globalAlpha = 1;
  };
  const clearScratch = (): void => {
    toPixels(sx);
    sx.globalCompositeOperation = 'source-over';
    sx.clearRect(0, 0, W, H);
    toUnits(sx);
  };
  /** Legt die Hilfsebene auf ein Zielbild, optional verschoben (für Schatten). */
  const stamp = (target: CanvasRenderingContext2D, alpha: number, dx = 0, dy = 0): void => {
    toPixels(target);
    target.globalAlpha = alpha;
    target.drawImage(scratch, dx * ratio, dy * ratio);
    target.globalAlpha = 1;
    toUnits(target);
  };
  /** Schneidet die Hilfsebene auf eine gekachelte Maske zu. */
  const maskScratch = (mask: HTMLCanvasElement, tile: number, angle: number): void => {
    sx.globalCompositeOperation = 'destination-in';
    fillArea(sx, pattern(sx, mask, tile, angle, tile * road * 0.3));
    sx.globalCompositeOperation = 'source-over';
  };

  const brush = softBrush();
  /** Unregelmäßiger Schneewall entlang einer Linie parallel zur Achse.
   *  `base` > 0 legt darunter einen durchgehenden Streifen, der die gerade
   *  Asphaltkante vollständig verdeckt. */
  const snowBank = (
    target: CanvasRenderingContext2D,
    offset: number,
    radius: number,
    spread: number,
    density: number,
    shadow: number,
    base = 0,
    weight: (s: number) => number = () => 1,
  ): void => {
    clearScratch();
    const gap = Math.max(1, radius * 0.4);
    for (let s = path.min; s < path.max; s += gap) {
      if (base > 0) {
        const q = path.offsetAt(s, offset);
        const r = base * (0.85 + rnd() * 0.3);
        sx.globalAlpha = 1;
        sx.drawImage(brush, q.x - r, q.y - r, r * 2, r * 2);
      }
      // Langwellige Schwankung: der Wall ist stellenweise breiter, stellenweise schmal.
      const swell = 0.5 + 0.5 * Math.sin(s * 0.013 + offset) * Math.sin(s * 0.0051 + offset * 0.5);
      const w = weight(s);
      if (rnd() > density * (0.55 + swell * 0.6) * (0.35 + w * 0.65)) continue;
      const r = radius * (0.55 + rnd() * 0.9) * (0.7 + swell * 0.5) * (0.5 + w * 0.5);
      const p = path.offsetAt(s + (rnd() - 0.5) * gap, offset + (rnd() - 0.5) * spread);
      sx.globalAlpha = 0.55 + rnd() * 0.45;
      sx.drawImage(brush, p.x - r, p.y - r, r * 2, r * 2);
    }
    sx.globalAlpha = 1;
    // Erst als Schatten auf den Untergrund, dann mit Schneetextur gefüllt obenauf.
    stamp(target, shadow, cfg.light.x * radius * 0.3, cfg.light.y * radius * 0.3);
    sx.globalCompositeOperation = 'source-in';
    const [a, b] = layers(sx, tex.snowRough, TILE.snowRough);
    fillArea(sx, a);
    sx.globalCompositeOperation = 'source-atop';
    fillArea(sx, b, 0.5);
    stamp(target, 1);
  };

  // ── 1. Ungeräumte Fahrbahn ───────────────────────────────────────────────
  toUnits(ctx);
  strokeTextured(ctx, tex.asphalt, TILE.asphalt, road);

  // Reif: ein gleichmäßiger, dünner Hauch auf dem Asphalt. Bewusst ohne
  // Flecken — fleckiger Reif liest sich aus der Höhe als Schmutz.
  if (cfg.iceAmount > 0) {
    clearScratch();
    strokeTextured(sx, tex.frost, TILE.frost, road);
    stamp(ctx, cfg.iceAmount * 0.6);
  }

  // Schneedecke: geschlossen über die ganze Fahrbahn. Die Fahrspuren sind bis
  // auf den Asphalt freigefahren — dort liegt nichts mehr über dem Belag, er
  // ist so dunkel und klar wie auf der geräumten Strecke.
  const gauge = road * 0.19;
  if (cfg.snowAmount > 0) {
    clearScratch();
    strokeTextured(sx, tex.snow, TILE.snow, road + 2);

    if (cfg.trackAmount > 0) {
      sx.globalCompositeOperation = 'destination-out';
      const depth = Math.min(1, cfg.trackAmount * 1.25);
      // Unregelmäßige Maske: damit dünnt der Schnee nicht überall gleich weit aus.
      const thin = thresholdMask(tex.cloud, 0.55, 0.35);
      const streaky = thresholdMask(tex.streaks, 0.5, 0.35);
      for (const side of [-1, 1]) {
        const centre = (s: number): number => side * gauge + Math.sin(s * 0.008 + side) * road * 0.025;
        // 1. Breiter, fleckiger Saum: hier liegt nur noch stellenweise Schnee.
        strokeRoad(sx, pattern(sx, thin, TILE.mask * 0.35, 20 * side, road), road * 0.21, 0.4 * depth, centre);
        strokeRoad(sx, pattern(sx, streaky, TILE.mask * 0.5, 90, road * side), road * 0.17, 0.4 * depth, centre);
        // 2. Viele schmale Lagen, jede pendelt etwas anders: die Schneedecke
        //    wird zur Rinne hin stetig dünner, aber nicht überall gleich schnell.
        const steps = 9;
        for (let k = 0; k < steps; k++) {
          const t = k / (steps - 1); // 0 = außen, 1 = Kern der Rinne
          const width = road * (0.17 - 0.115 * t);
          const drift = (s: number): number =>
            centre(s) + Math.sin(s * (0.021 + k * 0.007) + k * 1.7 + side) * road * 0.016 * (1 - t);
          strokeRoad(sx, '#000', width, 0.17 * depth, drift);
        }
        // 3. Kern: bis auf den Asphalt freigefahren.
        strokeRoad(sx, '#000', road * 0.045, 0.85 * depth, centre);
      }
      sx.globalCompositeOperation = 'source-over';
    }
    stamp(ctx, 0.75 + cfg.snowAmount * 0.25);
  }

  // Schneeränder. Der durchgehende Streifen verdeckt die gerade Asphaltkante,
  // die unregelmäßigen Klumpen ragen in die Fahrbahn und nach außen.
  const drawEdges = (target: CanvasRenderingContext2D): void => {
    if (cfg.roadEdgeSnow <= 0) return;
    for (const side of [-1, 1]) {
      const edge = side * road * 0.5;
      snowBank(target, edge + side * road * 0.03, road * 0.085, road * 0.1, cfg.roadEdgeSnow, 0.24, road * 0.075 * cfg.roadEdgeSnow);
      snowBank(target, edge - side * road * 0.05, road * 0.045, road * 0.09, cfg.roadEdgeSnow * 0.7, 0.16);
    }
  };
  drawEdges(ctx);

  // ── 2. Geräumte Fahrbahn ─────────────────────────────────────────────────
  const cleared = createCanvas(W, H);
  const cx = context(cleared);
  cx.drawImage(snow, 0, 0);
  toUnits(cx);

  const lane = cfg.vehicleOffset * (road / cfg.roadWidth);
  const swath = road * cfg.clearedWidth;

  strokeTextured(cx, tex.asphalt, TILE.asphalt, swath, lane);
  strokeRoad(cx, 'rgba(6,10,16,0.3)', swath, 1, lane); // nasser, dunklerer Belag

  // Dünne Schnee- und Reifreste, die das Schild stehen lässt.
  clearScratch();
  strokeTextured(sx, tex.frost, TILE.frost, swath, lane);
  maskScratch(thresholdMask(tex.streaks, 0.3, 0.18), TILE.mask * 0.6, 90);
  stamp(cx, 0.45);

  // Frische Reifenspuren des Räumfahrzeugs.
  const wheels = (cfg.vehicleSize / cfg.roadWidth) * road * 0.165;
  for (const side of [-1, 1]) strokeRoad(cx, 'rgba(0,0,0,0.14)', swath * 0.12, 1, lane + side * wheels);

  // Pflugwall: bei geradem Schild beidseitig, bei angestelltem auf der Wurfseite.
  const right = throwRight(cfg);
  snowBank(cx, lane + swath * 0.5 + road * 0.035, road * 0.06, road * 0.05, 1, 0.3, 0, () => right);
  snowBank(cx, lane - swath * 0.5 - road * 0.035, road * 0.06, road * 0.05, 1, 0.3, 0, () => 1 - right);

  // Die Hilfsebene belegt so viel Speicher wie eine ganze Szene — freigeben.
  scratch.width = scratch.height = 0;

  return { snow, cleared };
}
