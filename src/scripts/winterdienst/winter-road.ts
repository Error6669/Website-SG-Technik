// Winterdienst-Scroll-Animation: koppelt Fahrzeug, Räumspur und Salzstreuung
// an den Scroll-Fortschritt.
//
// Herkunft: winterdienst-scroll-demo/src/winter-road.ts. Abweichungen von der
// Demo: Der Verlauf kommt nicht aus einem festen Pfad in der Konfiguration,
// sondern aus `options.layout` (siehe route.ts), die Straße lässt sich ab
// einer Höhe abdunkeln (dunkler Kontaktbereich), und das Fahrzeug besteht aus
// einzelnen Bildern, die der Browser bewegt, statt in jedem Bild neu
// gezeichnet zu werden (siehe unten).
//
// Erwartetes Markup:
//   <div data-winter-road></div>   ← Fläche, in der die Straße läuft. Der Pfad
//                                    aus `options.layout` ist in ihren
//                                    CSS-Pixeln angegeben.
//
// Alles liegt fest in der Seite und scrollt mit ihr, das macht der Browser
// selbst — auch beim schnellen Scrollen bleibt deshalb nichts gegenüber der
// Straße zurück:
//
//   1. Die STRASSE ist ein Bild in voller Länge. Das Skript malt nur den
//      schmalen Streifen nach, der gerade geräumt bzw. gestreut wurde.
//   2. Das FAHRZEUG (Schatten, Karosserie, Schild als einzelne Bilder) und
//      eine kleine Zeichenfläche für fliegenden Schnee und Salz liegen auf der
//      Straße. Das Skript schiebt sie in jedem Bild an ihre Stelle.
//
// Wo das Fahrzeug stehen soll, folgt aus der Scroll-Position; das Fahrzeug
// fährt dieser Stelle nach (FOLLOW_TIME, höchstens MAX_SPEED). Bei schnellem
// Scrollen bleibt es also zurück und holt auf, statt zu springen, und beim
// Zurückscrollen fährt es ebenso rückwärts nach. Fahrzeug, Räumspur, Schnee
// und Salz werden im selben Schritt gezeichnet und passen deshalb immer
// zueinander, ganz gleich, wie spät das Skript das Scrollen mitbekommt.
//
// Die Sollstelle bestimmt der „Fahrweg“: Er wächst auf steilen Stücken mit
// der Höhe der Straße und auf flachen Stücken mit ihrer Länge (FLAT_RATE).
// Dadurch fährt das Fahrzeug auch durch waagrechte Stücke wie Ein- und Ausfahrt
// in ruhigem Tempo, statt sie in einem Scrollschritt zu überspringen.
//
// Beim Zurückscrollen läuft alles rückwärts — Räumspur und Salz eingeschlossen.
//
// Der Hintergrund bleibt transparent; gezeichnet werden nur Straße,
// Schneeränder und Fahrzeug.

import type { WinterRoadConfig } from '../../content/winterdienst';
import { bladeDirection } from './plow';
import { RoadPath } from './road-path';
import {
  buildSalt,
  buildSpray,
  buildWorld,
  createCanvas,
  loadTextures,
  type Salt,
  type Spray,
  type Textures,
  type World,
} from './scene';

/** Verlauf und Größe der Straße für die aktuelle Größe der Fläche. */
export interface RoadLayout {
  /** SVG-Pfad (Attribut `d`) in CSS-Pixeln der Fläche. */
  path: string;
  /** Fahrbahnbreite in CSS-Pixeln. */
  roadWidth: number;
  /** Ab dieser Höhe (CSS-Pixel) wird die Straße mit `nightShade` abgedunkelt. */
  shadeFrom?: number;
}

export interface WinterRoadOptions {
  /** Wird bei jedem Neuaufbau gefragt. `null` = kein Platz, nichts zeichnen. */
  layout: (size: { width: number; height: number }) => RoadLayout | null;
  /** Zeichnet Pfad und Stützpunkte über die Szene (zum Bearbeiten von ROAD_PATH). */
  debug?: boolean;
  /** Wird nach jedem gezeichneten Bild mit dem dargestellten Fortschritt (0…1) aufgerufen. */
  onProgress?: (progress: number) => void;
  /** Wird nach jedem Aufbau mit dem neuen Verlauf und der Fahrbahnbreite in
   *  CSS-Pixeln aufgerufen, `null`, wenn keine Straße gezeichnet wird. */
  onBuild?: (path: RoadPath | null, road: number) => void;
}

export interface WinterRoad {
  /** Verlauf neu berechnen, z. B. wenn sich Inhalte verschoben haben, ohne
   *  dass sich die Größe der Fläche geändert hat. */
  rebuild(): Promise<void>;
  /** Fortschritt fest vorgeben (0…1) statt aus dem Scrollen zu lesen; `null` gibt wieder frei. */
  setProgress(value: number | null): void;
  destroy(): void;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/** Rechteck in Gerätepixeln der Szene. */
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Größte Kantenlänge, die alle gängigen Browser für ein Canvas zulassen. */
const MAX_CANVAS_SIDE = 16000;
/** Kantenlänge der Zeichenfläche für fliegenden Schnee und Salz als Vielfaches
 *  der Fahrzeuglänge. Muss Salzwurf hinten und Schneeauswurf vorne einschließen. */
const FLIGHT_SIZE = 2.8;
/** Fahrweg je Pixel Straße auf flachen Stücken. Dort fährt das Fahrzeug
 *  1 / FLAT_RATE mal so schnell, wie die Seite scrollt. */
const FLAT_RATE = 0.6;
/** Abstand der Stützpunkte des Fahrwegs entlang der Straße, in Pixeln. */
const WAY_STEP = 3;
/** Nachfahren: So viele Sekunden braucht das Fahrzeug, um rund zwei Drittel
 *  des Abstands zu seiner Sollstelle aufzuholen. Kleiner = folgt enger. */
const FOLLOW_TIME = 0.16;
/** Höchstes Tempo beim Nachfahren in Fahrzeuglängen je Sekunde. Bei
 *  schnellem Scrollen bleibt das Fahrzeug zurück und holt danach auf. */
const MAX_SPEED = 14;
/** Rand des Fahrzeugschattens um das Bild herum (Anteil der Bildgröße). */
const SHADOW_PAD = 0.25;
/** Ist der Straßenanfang am Seitenanfang schon im Bild, steht das Fahrzeug
 *  dort bereits ein Stück auf der Straße: So viel geräumte Fahrbahn liegt
 *  dann zwischen Bildschirmrand und Heck, in Fahrzeuglängen. */
const HEAD_START = 0.6;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Bild konnte nicht geladen werden: ${src}`));
    img.src = src;
  });
}

/** Weicher Schlagschatten aus der Silhouette des Fahrzeugbilds. Wird einmal
 *  vorgerechnet: stark verkleinert und wieder vergrößert ergibt einen
 *  Weichzeichner, der ohne (auf Mobilgeräten teure) Filter auskommt. */
function shadowFrom(img: HTMLImageElement): HTMLCanvasElement {
  const grow = 1 + SHADOW_PAD * 2;
  const small = createCanvas((img.naturalWidth * grow) / 14, (img.naturalHeight * grow) / 14);
  const sctx = small.getContext('2d')!;
  sctx.drawImage(
    img,
    (small.width * SHADOW_PAD) / grow,
    (small.height * SHADOW_PAD) / grow,
    small.width / grow,
    small.height / grow,
  );
  sctx.globalCompositeOperation = 'source-in';
  sctx.fillStyle = '#081320';
  sctx.fillRect(0, 0, small.width, small.height);
  const out = createCanvas(small.width * 4, small.height * 4);
  const octx = out.getContext('2d')!;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(small, 0, 0, out.width, out.height);
  return out;
}

/** Weicher runder Tupfer in einer Farbe (fliegender Schnee und sein Schatten). */
function softDot(inner: string, outer: string): HTMLCanvasElement {
  const c = createCanvas(32, 32);
  const f = c.getContext('2d')!;
  const g = f.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, `rgba(${inner},1)`);
  g.addColorStop(0.45, `rgba(${inner},0.85)`);
  g.addColorStop(1, `rgba(${outer},0)`);
  f.fillStyle = g;
  f.fillRect(0, 0, 32, 32);
  return c;
}

export async function mountWinterRoad(
  root: HTMLElement,
  cfg: WinterRoadConfig,
  options: WinterRoadOptions,
): Promise<WinterRoad> {
  // Ebene 1: die Straße in voller Länge, fest in der Seite.
  const roadCanvas = document.createElement('canvas');
  roadCanvas.className = 'wd-road-canvas';
  // Ebene 2: die Bilder des Fahrzeugs und darüber die Zeichenfläche für
  // fliegenden Schnee und Salz, ebenfalls fest in der Seite.
  const sprites = document.createElement('div');
  sprites.className = 'wd-sprites';
  const rigCanvas = document.createElement('canvas');
  rigCanvas.className = 'wd-rig-canvas';
  for (const c of [roadCanvas, rigCanvas]) c.setAttribute('aria-hidden', 'true');
  root.append(roadCanvas, sprites, rigCanvas);
  const rctx = roadCanvas.getContext('2d')!;
  const vctx = rigCanvas.getContext('2d')!;

  const [tex, vehicleImg, plowImg]: [Textures, HTMLImageElement, HTMLImageElement] = await Promise.all([
    loadTextures(cfg.textures),
    loadImage(cfg.vehicle.src),
    loadImage(cfg.plow.src),
  ]);
  const vehicleShadow = shadowFrom(vehicleImg);
  // Abgedunkelte Fassungen für den dunklen Bereich, sonst stünde das Fahrzeug
  // dort heller da als die Fahrbahn unter ihm.
  const shaded = (img: HTMLImageElement): HTMLCanvasElement => {
    const c = createCanvas(img.naturalWidth, img.naturalHeight);
    const f = c.getContext('2d')!;
    f.drawImage(img, 0, 0);
    f.globalCompositeOperation = 'source-atop';
    f.fillStyle = cfg.nightShade;
    f.fillRect(0, 0, c.width, c.height);
    return c;
  };
  const vehicleNight = shaded(vehicleImg);
  const plowNight = shaded(plowImg);
  /** Legt Bilder deckungsgleich in eine Ebene, die sich als Ganzes bewegt. */
  const sprite = (...layers: HTMLElement[]): HTMLElement => {
    const el = document.createElement('div');
    el.className = 'wd-sprite';
    el.append(...layers);
    sprites.append(el);
    return el;
  };
  vehicleShadow.style.opacity = '0.5';
  const shadowEl = sprite(vehicleShadow);
  const bodyEl = sprite(vehicleImg, vehicleNight);
  const plowEl = sprite(plowImg, plowNight);
  const flake = softDot('255,255,255', '240,246,252');
  // Schatten unter fliegendem Schnee. Ohne ihn wäre Weiß vor dem weißen
  // Schneerand nicht zu sehen.
  const flakeShadow = softDot('28,53,80', '28,53,80');

  // Das Seitenverhältnis des Fahrzeugs kommt aus dem Bild — ein anderes
  // Fahrzeugbild braucht deshalb keine weiteren Größenangaben.
  const turned = Math.abs(cfg.vehicle.imageRotation % 180) === 90;
  const aspect = turned
    ? vehicleImg.naturalHeight / vehicleImg.naturalWidth
    : vehicleImg.naturalWidth / vehicleImg.naturalHeight;

  // Alles Folgende hängt von der Größe der Spalte ab und wird in rebuild() gesetzt.
  let world: World | null = null;
  let path: RoadPath | null = null;
  let salt: Salt | null = null;
  let spray: Spray | null = null;
  let width = 0;
  let height = 0;
  let ratio = 1; // Gerätepixel je CSS-Pixel
  let unit = 1; // CSS-Pixel je Einheit von cfg.roadWidth
  let route: RoadLayout | null = null;
  let road = 0;
  let lane = 0;
  let vehLen = 0;
  let vehWid = 0;
  /** Kantenlänge der Zeichenfläche für fliegenden Schnee und Salz. */
  let flightSize = 0;
  /** Fahrweg bis zu jedem Stützpunkt der Straße (aufsteigend). */
  let way: number[] = [0];
  /** Höhe im Bildschirm, auf der der Fahrweg am Seitenanfang bzw. am
   *  Seitenende steht. Dazwischen wandert sie gleichmäßig. */
  let lineStart = 0;
  let lineEnd = 0;
  /** Oberkante der Spalte in der Seite. Ändert sich beim Scrollen nicht und
   *  wird deshalb nicht in jedem Bild neu gemessen. */
  let rootDocTop = 0;
  /** Fahrweg, auf dem das Fahrzeug ganz oben auf der Seite schon steht (siehe HEAD_START). */
  let headStart = 0;
  // Bis wohin die Straße aktuell geräumt bzw. gestreut gezeichnet ist.
  let paintedPlow = NaN;
  let paintedSalt = NaN;

  const maxScroll = (): number => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  /** Fahrstrecke zu einem Fahrweg. */
  const distanceForWay = (u: number): number => {
    const last = way.length - 1;
    if (!path || u <= 0) return 0;
    if (u >= way[last]) return path.length;
    let lo = 0;
    let hi = last;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (way[mid] < u) lo = mid;
      else hi = mid;
    }
    const s = (lo + (u - way[lo]) / (way[hi] - way[lo] || 1)) * WAY_STEP;
    return Math.min(path.length, s);
  };

  /** Legt den Fahrweg fest. Hängt an Straße, Fensterhöhe und Seitenlänge. */
  const measure = (): void => {
    if (!path) return;
    rootDocTop = root.getBoundingClientRect().top + window.scrollY;

    way = [0];
    let previous = path.at(0).y;
    for (let s = WAY_STEP; s < path.length + WAY_STEP; s += WAY_STEP) {
      const y = path.at(Math.min(s, path.length)).y;
      way.push(way[way.length - 1] + Math.max(y - previous, FLAT_RATE * WAY_STEP));
      previous = y;
    }
    const total = way[way.length - 1];

    // Ist der Straßenanfang am Seitenanfang schon im Bild, fährt das Fahrzeug
    // mit dem ersten Scrollen los. Sonst steht es auf halber Strecke auf
    // `anchor` der Bildschirmhöhe. Am Seitenende muss es angekommen sein.
    const limit = maxScroll();
    const startDoc = rootDocTop + path.at(0).y;
    const half = path.length / 2;
    const lead = way[Math.round(half / WAY_STEP)] - (path.at(half).y - path.at(0).y);
    lineStart = startDoc < window.innerHeight ? startDoc : window.innerHeight * cfg.anchor + lead;
    lineEnd = Math.max(lineStart, startDoc + total - limit);

    // Vorsprung: die Stelle, an der der Straßenanfang den Bildschirmrand
    // kreuzt, plus halbe Fahrzeuglänge bis zur Mitte und HEAD_START dahinter.
    headStart = 0;
    if (startDoc < window.innerHeight) {
      let edge = 0;
      while (edge < path.length && path.at(edge).x > width) edge += WAY_STEP;
      const ahead = Math.min(path.length, edge + vehLen * (0.5 + HEAD_START));
      headStart = Math.min(total, way[Math.round(ahead / WAY_STEP)] ?? total);
    }

    // Die Zeichenfläche für fliegenden Schnee und Salz ist nur so groß wie die
    // Umgebung des Fahrzeugs und wird ihm in jedem Bild nachgeschoben. So muss
    // pro Bild nur ein kleines Stück geleert und neu gezeichnet werden.
    flightSize = Math.ceil(vehLen * FLIGHT_SIZE);
    rigCanvas.style.width = rigCanvas.style.height = `${flightSize}px`;
    rigCanvas.width = rigCanvas.height = Math.round(flightSize * ratio);
  };

  /** Fahrstrecke bei einer Scroll-Position. */
  const distanceAt = (scroll: number): number => {
    if (!path) return 0;
    const limit = maxScroll();
    const line = scroll + lineStart + (lineEnd - lineStart) * (limit > 0 ? scroll / limit : 0);
    const u = line - (rootDocTop + path.at(0).y);
    if (!headStart) return distanceForWay(u);
    // Der Vorsprung schrumpft gleichmäßig bis zum Ziel, wo alles wie ohne ihn endet.
    const total = way[way.length - 1];
    return distanceForWay(headStart + Math.max(0, u) * (1 - headStart / total));
  };

  /** Zählt die Aufbauten: Ein älterer, der noch läuft, wird verworfen. */
  let building = 0;

  const rebuild = async (): Promise<void> => {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (!w || !h) return;

    const next = options.layout({ width: w, height: h });
    if (!next) {
      building++;
      route = null;
      world = null;
      path = null;
      root.classList.remove('is-ready');
      options.onBuild?.(null, 0);
      return;
    }
    // Gleicher Verlauf auf gleicher Fläche: Die Szene stimmt noch, nur die
    // Fahrt hängt zusätzlich an Fensterhöhe und Seitenlänge.
    if (
      world &&
      route &&
      w === width &&
      h === height &&
      next.path === route.path &&
      next.roadWidth === route.roadWidth &&
      next.shadeFrom === route.shadeFrom
    ) {
      measure();
      snap();
      return;
    }

    const token = ++building;
    width = w;
    height = h;
    route = next;
    // Bis die neue Szene steht, wird nichts gezeichnet.
    world = null;

    unit = route.roadWidth / cfg.roadWidth;
    road = cfg.roadWidth * unit;
    lane = cfg.vehicleOffset * unit;
    vehLen = cfg.vehicleSize * unit;
    vehWid = vehLen * aspect;
    ratio = Math.min(
      window.devicePixelRatio || 1,
      cfg.quality.maxPixelRatio,
      Math.sqrt((cfg.quality.maxMegapixels * 1e6) / (width * height)),
      MAX_CANVAS_SIDE / height,
    );

    // Die Verlängerung muss über die Wurfzone und das Schild hinausreichen.
    path = new RoadPath(route.path, 1, 1, vehLen * 3);
    const built = await buildWorld({ width, height, ratio, road }, path, tex, cfg);
    if (token !== building) return;
    if (route.shadeFrom !== undefined) {
      // Nur über bereits Gezeichnetes legen: neben der Straße bleibt es frei.
      for (const layer of [built.snow, built.cleared]) {
        const lctx = layer.getContext('2d')!;
        lctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        lctx.globalCompositeOperation = 'source-atop';
        lctx.fillStyle = cfg.nightShade;
        lctx.fillRect(0, route.shadeFrom, width, height - route.shadeFrom);
        lctx.globalCompositeOperation = 'source-over';
      }
    }
    world = built;
    salt = buildSalt(path, cfg, road);
    spray = buildSpray(path, cfg, road);

    roadCanvas.width = world.snow.width;
    roadCanvas.height = world.snow.height;
    measure();

    const grow = 1 + SHADOW_PAD * 2;
    const dw = turned ? vehLen : vehWid;
    const dh = turned ? vehWid : vehLen;
    const size = (el: HTMLElement, w: number, h: number): void => {
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
    };
    size(shadowEl, dw * grow, dh * grow);
    size(bodyEl, dw, dh);
    size(plowEl, vehWid, (vehWid * plowImg.naturalHeight) / plowImg.naturalWidth);

    paintedPlow = paintedSalt = NaN;
    snap();
    root.classList.add('is-ready');
    options.onBuild?.(path, road);
  };

  /** Beschreibt das Band der Fahrspur (samt Pflugwällen) zwischen zwei
   *  Fahrstrecken als Zeichenpfad, in Straßenkoordinaten. Liefert das Rechteck,
   *  in dem das Band liegt (in Gerätepixeln der Szene), oder null. */
  const traceBand = (ctx: CanvasRenderingContext2D, from: number, to: number): Box | null => {
    if (!path || !world) return null;
    const a = Math.max(path.min, from);
    const b = Math.min(path.max, to);
    if (b <= a) return null;
    const half = (road * (cfg.clearedWidth + 0.3)) / 2;
    const steps = Math.max(1, Math.ceil((b - a) / 3));
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const edge = (i: number, side: number): { x: number; y: number } => {
      const p = path!.offsetAt(a + ((b - a) * i) / steps, lane + side * half);
      if (p.x < x0) x0 = p.x;
      if (p.x > x1) x1 = p.x;
      if (p.y < y0) y0 = p.y;
      if (p.y > y1) y1 = p.y;
      return p;
    };
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = edge(i, -1);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    for (let i = steps; i >= 0; i--) {
      const p = edge(i, 1);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    const x = clamp(Math.floor(x0 * ratio) - 1, 0, world.snow.width);
    const y = clamp(Math.floor(y0 * ratio) - 1, 0, world.snow.height);
    const w = clamp(Math.ceil(x1 * ratio) + 1, 0, world.snow.width) - x;
    const h = clamp(Math.ceil(y1 * ratio) + 1, 0, world.snow.height) - y;
    return w > 0 && h > 0 ? { x, y, w, h } : null;
  };

  // ── Ebene 1: Straße ───────────────────────────────────────────────────────

  /** Überträgt einen Streckenabschnitt aus einer vorgerechneten Ebene auf die
   *  sichtbare Straße. Das Band liegt vollständig auf dem (deckenden) Asphalt,
   *  deshalb wird einfach darübergemalt und nichts vorher gelöscht — Löschen
   *  mit weicher Kante würde an jeder Abschnittsgrenze eine Querlinie hinterlassen.
   *  Kopiert wird nur das Rechteck um den Abschnitt, nicht die ganze Szene. */
  const paintRange = (layer: HTMLCanvasElement, from: number, to: number): void => {
    rctx.save();
    rctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const box = traceBand(rctx, from, to);
    if (box) {
      rctx.clip();
      rctx.setTransform(1, 0, 0, 1, 0, 0);
      rctx.drawImage(layer, box.x, box.y, box.w, box.h, box.x, box.y, box.w, box.h);
    }
    rctx.restore();
  };

  /** Nummer des ersten Salzkorns, das hinter der Strecke `s` liegt. */
  const saltIndex = (s: number): number => {
    if (!salt || salt.count < 2) return 0;
    const spacing = salt.s[1] - salt.s[0];
    return clamp(Math.floor((s - salt.s[0]) / spacing) + 1, 0, salt.count);
  };

  /** Zeichnet liegengebliebene Salzkörner auf die Straße. */
  const paintSalt = (from: number, to: number): void => {
    if (!salt || to <= from) return;
    rctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    rctx.fillStyle = 'rgba(240,238,230,0.8)';
    rctx.beginPath();
    for (let i = from; i < to; i++) {
      const size = salt.size[i];
      rctx.rect(salt.x[i] - size / 2, salt.y[i] - size / 2, size, size);
    }
    rctx.fill();
  };

  /** Bringt die Straße auf den Stand "geräumt bis `plow`, gestreut bis `salted`".
   *  Im Normalfall ist das ein wenige Pixel langer Streifen. Die Abschnitte
   *  überlappen sich großzügig, damit zwischen ihnen keine Naht bleibt. */
  const updateRoad = (plow: number, salted: number): void => {
    if (!world || !path) return;
    const clearing = cfg.clearedRoadAmount > 0;
    const overlap = 6;

    if (Number.isNaN(paintedPlow)) {
      // Erster Aufbau oder neue Größe: alles einmal vollständig.
      rctx.setTransform(1, 0, 0, 1, 0, 0);
      rctx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
      rctx.drawImage(world.snow, 0, 0);
      if (clearing) paintRange(world.cleared, path.min, plow);
      paintSalt(0, saltIndex(salted));
      if (options.debug) drawDebug();
    } else {
      if (clearing) {
        if (plow > paintedPlow) paintRange(world.cleared, paintedPlow - overlap, plow);
        else if (plow < paintedPlow) paintRange(world.snow, plow, paintedPlow + overlap);
      }
      if (salted > paintedSalt) {
        paintSalt(saltIndex(paintedSalt), saltIndex(salted));
      } else if (salted < paintedSalt) {
        // Rückwärts: Salz verschwindet wieder — der Abschnitt wird ohne Körner
        // neu aufgetragen. Körner knapp davor, die dabei angeschnitten werden,
        // kommen gleich wieder dazu.
        const layer = clearing ? world.cleared : world.snow;
        paintRange(layer, salted, Math.min(paintedSalt + overlap, plow));
        paintSalt(saltIndex(salted - road * 0.05), saltIndex(salted));
      }
    }
    paintedPlow = plow;
    paintedSalt = salted;
  };

  const drawDebug = (): void => {
    if (!path || !route) return;
    rctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    rctx.lineWidth = 2;
    rctx.strokeStyle = '#b15a2e';
    path.trace(rctx, 0, path.length);
    rctx.stroke();
    rctx.fillStyle = '#b15a2e';
    rctx.font = '600 11px ui-monospace, monospace';
    // Alle Zahlenpaare des Pfads als Punkte: Endpunkte und Griffe.
    const nums = route.path.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = nums[i];
      const y = nums[i + 1];
      rctx.beginPath();
      rctx.arc(x, y, 4, 0, Math.PI * 2);
      rctx.fill();
      rctx.fillText(`${nums[i]} ${nums[i + 1]}`, x + 7, y + 4);
    }
  };

  // ── Ebene 2: Fahrzeug ─────────────────────────────────────────────────────
  let forced: number | null = null;
  let frame = 0;
  const request = (): void => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  /** Lage von Fahrzeug und Schild nach `s` Pixeln Fahrstrecke. */
  const poseAt = (s: number) => {
    // Fahrzeuglage aus Vorder- und Hinterachse: die Karosserie liegt als Sehne
    // auf dem Pfad, Position und Drehung ergeben sich daraus von selbst.
    const wheelbase = vehLen * cfg.vehicle.wheelbase;
    const front = path!.offsetAt(s + wheelbase / 2, lane);
    const rear = path!.offsetAt(s - wheelbase / 2, lane);
    const x = (front.x + rear.x) / 2;
    const y = (front.y + rear.y) / 2;
    const heading = Math.atan2(front.y - rear.y, front.x - rear.x);
    // Schild: hängt vor der Fahrzeugfront, steht aber quer zur STRASSE an
    // seiner Stelle — in der Kurve dreht es sich also gegenüber dem Fahrzeug.
    const pivot = {
      x: x + Math.cos(heading) * vehLen * cfg.plow.position,
      y: y + Math.sin(heading) * vehLen * cfg.plow.position,
    };
    const blade = bladeDirection(path!, s + vehLen * cfg.plow.position, cfg);
    return { x, y, heading, pivot, blade };
  };

  /** Stellt Schatten, Karosserie und Schild an ihre Lage auf der Straße. */
  const place = (el: HTMLElement, x: number, y: number, angle: number): void => {
    el.style.transform = `translate(${(x - parseFloat(el.style.width) / 2).toFixed(2)}px, ${(y - parseFloat(el.style.height) / 2).toFixed(2)}px) rotate(${angle.toFixed(4)}rad)`;
  };
  /** Abgedunkelte Fassung von Karosserie und Schild ab dem dunklen Bereich,
   *  hart umgeschaltet wie die Kante des Seitenhintergrunds. */
  let night: boolean | null = null;

  /** Zeichnet alles für das Fahrzeug an der Fahrstrecke `s`. */
  const draw = (s: number): void => {
    if (!world || !path) return;
    const spreader = s - vehLen * cfg.vehicle.spreaderPosition;
    const reach = vehLen * cfg.saltThrow;
    updateRoad(s + vehLen * (cfg.plow.position - 0.04), spreader - reach);

    const pose = poseAt(s);
    const imageTurn = (cfg.vehicle.imageRotation * Math.PI) / 180;
    const spin = pose.heading + Math.PI / 2 + imageTurn;
    const drop = vehLen * 0.05;
    // Schatten fällt in Lichtrichtung der Szene, unabhängig von der Fahrtrichtung.
    place(shadowEl, pose.x + cfg.light.x * drop, pose.y + cfg.light.y * drop, spin);
    place(bodyEl, pose.x, pose.y, spin);
    place(plowEl, pose.pivot.x, pose.pivot.y, pose.blade);
    const dark = route?.shadeFrom !== undefined && pose.y >= route.shadeFrom;
    if (dark !== night) {
      night = dark;
      vehicleNight.style.opacity = plowNight.style.opacity = dark ? '1' : '0';
    }

    // Fliegender Schnee und Salz auf der kleinen Fläche um das Fahrzeug.
    const left = Math.round(pose.x - flightSize / 2);
    const top = Math.round(pose.y - flightSize / 2);
    rigCanvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, rigCanvas.width, rigCanvas.height);
    vctx.setTransform(ratio, 0, 0, ratio, -left * ratio, -top * ratio);
    if (salt && salt.count) drawSaltInFlight(spreader, reach);
    if (spray && spray.count) drawSpray(s, pose.pivot, pose.blade);

    options.onProgress?.(clamp(s / path.length, 0, 1));
  };

  /** Fahrstrecke, an der das Fahrzeug gerade steht (NaN = noch nirgends). */
  let shown = NaN;
  let lastTick = 0;

  /** Sollstelle des Fahrzeugs. */
  const targetNow = (): number =>
    !path ? 0 : forced !== null ? forced * path.length : distanceAt(window.scrollY);

  /** Fährt der Sollstelle ein Stück nach und zeichnet. */
  const advance = (now: number): void => {
    if (!world || !path) return;
    const target = targetNow();
    // Nach einer Pause rechnet das erste Bild mit normaler Bilddauer.
    const dt = now - lastTick > 100 ? 1 / 60 : (now - lastTick) / 1000;
    lastTick = now;
    if (Number.isNaN(shown)) shown = target;
    else {
      const top = vehLen * MAX_SPEED;
      const speed = clamp((target - shown) / FOLLOW_TIME, -top, top);
      const next = shown + speed * dt;
      // Nicht über die Sollstelle hinausschießen.
      shown = (target - shown) * (target - next) <= 0 || Math.abs(target - next) < 0.2 ? target : next;
    }
    draw(shown);
    if (shown !== target) request();
  };

  /** Stellt das Fahrzeug ohne Nachfahren an seine Sollstelle. */
  const snap = (): void => {
    shown = NaN;
    advance(performance.now());
  };

  /** Streusalz im Flug. Jedes Korn hat einen festen Landeplatz. Liegt der
   *  Streuer noch weniger als eine Wurfweite davor, startet es eng am
   *  Streuteller und wandert nach außen an seinen Platz. Weil das allein von
   *  der Fahrzeugposition abhängt, fliegt es beim Zurückscrollen wieder zurück.
   *  Gelandete Körner liegen auf der Straßen-Ebene. */
  const drawSaltInFlight = (spreader: number, reach: number): void => {
    if (!salt || !path) return;
    // Staubfahne direkt hinter dem Streuteller.
    const origin = path.offsetAt(spreader, lane);
    const far = path.offsetAt(spreader - reach * 0.7, lane);
    const haze = vctx.createRadialGradient(origin.x, origin.y, 0, far.x, far.y, reach * 0.75);
    haze.addColorStop(0, `rgba(238,240,240,${0.3 * cfg.saltAmount})`);
    haze.addColorStop(1, 'rgba(238,240,240,0)');
    vctx.fillStyle = haze;
    vctx.beginPath();
    vctx.arc(far.x, far.y, reach * 0.75, 0, Math.PI * 2);
    vctx.fill();

    vctx.fillStyle = '#ffffff';
    vctx.beginPath();
    const end = saltIndex(spreader);
    for (let i = saltIndex(spreader - reach); i < end; i++) {
      const d = (spreader - salt.s[i]) / reach; // 0 = gerade ausgeworfen, 1 = gelandet
      const fan = 0.12 + 0.88 * (1 - (1 - d) * (1 - d));
      const p = path.offsetAt(salt.s[i], lane + salt.lateral[i] * fan);
      const size = salt.size[i] * (1.6 - 0.6 * d);
      vctx.rect(p.x - size / 2, p.y - size / 2, size, size);
    }
    vctx.fill();
  };

  /** Schnee, der vom Schild an den Straßenrand spritzt. Jeder Brocken löst
   *  sich am Schildende und fliegt zu seinem festen Landeplatz im Pflugwall.
   *  Der Flug hängt allein an der Fahrzeugposition. */
  const drawSpray = (s: number, pivot: { x: number; y: number }, blade: number): void => {
    if (!spray) return;
    const flight = vehLen * 0.75;
    const half = vehWid * 0.46;
    // Achse des Schilds (zeigt zum rechten Ende).
    const ax = Math.cos(blade);
    const ay = Math.sin(blade);

    // Schneewolke an den Schildenden.
    const cloud = road * 0.13;
    for (const side of [-1, 1]) {
      const share = side > 0 ? cfg.plow.restAngle >= 0 : cfg.plow.restAngle <= 0;
      if (!share) continue;
      const tipX = pivot.x + ax * side * half * 0.85;
      const tipY = pivot.y + ay * side * half * 0.85;
      const puff = vctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, cloud);
      puff.addColorStop(0, `rgba(250,252,255,${0.4 * cfg.snowSprayAmount})`);
      puff.addColorStop(1, 'rgba(250,252,255,0)');
      vctx.fillStyle = puff;
      vctx.beginPath();
      vctx.arc(tipX, tipY, cloud, 0, Math.PI * 2);
      vctx.fill();
    }

    const spacing = spray.count > 1 ? spray.s[1] - spray.s[0] : 1;
    const first = Math.max(0, Math.ceil((s - flight) / spacing));
    for (let i = first; i < spray.count && spray.s[i] <= s; i++) {
      const d = (s - spray.s[i]) / flight; // 0 = löst sich vom Schild, 1 = gelandet
      const side = spray.side[i];
      const startX = pivot.x + ax * side * half * spray.along[i];
      const startY = pivot.y + ay * side * half * spray.along[i];
      const e = 1 - (1 - d) * (1 - d);
      const x = startX + (spray.x[i] - startX) * e;
      const y = startY + (spray.y[i] - startY) * e;
      // In der Luft wirkt der Brocken größer, beim Landen geht er im Wall auf.
      const r = spray.size[i] * (0.7 + 0.9 * Math.sin(Math.PI * d));
      const fade = d > 0.7 ? (1 - d) / 0.3 : 1;
      // Je höher der Brocken fliegt, desto weiter liegt sein Schatten entfernt.
      const lift = r * 1.6 * Math.sin(Math.PI * d);
      vctx.globalAlpha = fade * 0.3;
      vctx.drawImage(flakeShadow, x - r + cfg.light.x * lift, y - r + cfg.light.y * lift, r * 2, r * 2);
      vctx.globalAlpha = fade * 0.95;
      vctx.drawImage(flake, x - r, y - r, r * 2, r * 2);
    }
    vctx.globalAlpha = 1;
  };

  // ── Scroll-Kopplung ──────────────────────────────────────────────────────
  // Höchstens ein Bild je Bildschirm-Aktualisierung, solange gescrollt wird
  // oder das Fahrzeug noch nachfährt.
  const tick = (now: number): void => {
    frame = 0;
    advance(now);
  };

  let resizeTimer = 0;
  const onResize = (): void => {
    request();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (root.clientWidth !== width || root.clientHeight !== height) void rebuild();
      else if (world) {
        // Fahrlinie und Fahrt hängen auch an Fensterhöhe und Seitenlänge.
        measure();
        request();
      }
    }, 150);
  };

  await rebuild();

  const observer = new ResizeObserver(onResize);
  observer.observe(root);
  window.addEventListener('scroll', request, { passive: true });
  // Die Fahrlinie hängt an der Fensterhöhe, auch wenn die Spalte gleich bleibt.
  window.addEventListener('resize', onResize, { passive: true });

  return {
    rebuild,
    setProgress(value) {
      forced = value === null ? null : clamp(value, 0, 1);
      snap();
    },
    destroy() {
      observer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (frame) cancelAnimationFrame(frame);
      roadCanvas.remove();
      sprites.remove();
      rigCanvas.remove();
      root.classList.remove('is-ready');
    },
  };
}
