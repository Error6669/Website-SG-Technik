// Winterdienst-Scroll-Animation: koppelt Fahrzeug, Räumspur und Salzstreuung
// an den Scroll-Fortschritt.
//
// Erwartetes Markup:
//   <div data-winter-road></div>   ← Spalte, in der die Straße läuft. Ihre
//                                    Breite ist die Breite der Zeichenfläche,
//                                    ihre Höhe die Länge der Strecke (z. B. so
//                                    hoch wie der Text daneben).
//
// Aufbau in zwei Ebenen. Beide werden vom Browser selbst bewegt, nicht vom
// Skript — nur so bleibt es beim Scrollen ruhig:
//
//   1. Die STRASSE ist ein Bild in voller Länge, das fest in der Seite liegt
//      und mit ihr scrollt.
//   2. Das FAHRZEUG liegt auf einer Fläche, die der Browser auf der Fahrlinie
//      des Bildschirms festhält (position: sticky). Es steht dadurch ruhig im
//      Bild, während die Straße darunter durchläuft.
//
// Das Skript bestimmt nur noch, was auf den beiden Flächen zu sehen ist: die
// Lage des Fahrzeugs auf der Straße, das Stück geräumte Fahrbahn direkt um das
// Fahrzeug, fliegenden Schnee und Salz. Kommt es damit ein Bild zu spät, ist
// das ein kaum sichtbarer Versatz im Detail — aber nichts springt.
//
// Es gibt keine Uhr: Die Scroll-Position ist die einzige Eingangsgröße. Beim
// Zurückscrollen läuft alles rückwärts — Räumspur und Salz eingeschlossen.
//
// Der Hintergrund bleibt transparent; gezeichnet werden nur Straße,
// Schneeränder und Fahrzeug.

import type { WinterRoadConfig } from './config';
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

export interface WinterRoadOptions {
  /** Zeichnet Pfad und Stützpunkte über die Szene (zum Bearbeiten von ROAD_PATH). */
  debug?: boolean;
  /** Wird nach jedem gezeichneten Bild mit dem dargestellten Fortschritt (0…1) aufgerufen. */
  onProgress?: (progress: number) => void;
}

export interface WinterRoad {
  /** Fortschritt fest vorgeben (0…1) statt aus dem Scrollen zu lesen; `null` gibt wieder frei. */
  setProgress(value: number | null): void;
  destroy(): void;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/** Größte Kantenlänge, die alle gängigen Browser für ein Canvas zulassen. */
const MAX_CANVAS_SIDE = 16000;
/** Höhe der Fahrzeug-Fläche als Vielfaches der Fahrzeuglänge. Muss Salzwurf
 *  hinten und Schneeauswurf vorne einschließen. */
const RIG_HEIGHT = 2.8;
/** Rand des Fahrzeugschattens um das Bild herum (Anteil der Bildgröße). */
const SHADOW_PAD = 0.25;

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
  options: WinterRoadOptions = {},
): Promise<WinterRoad> {
  // Ebene 1: die Straße in voller Länge, fest in der Seite.
  const roadCanvas = document.createElement('canvas');
  roadCanvas.className = 'wd-road-canvas';
  // Ebene 2: das Fahrzeug. Die Schiene ist so hoch wie die Spalte; darin hält
  // der Browser die Fläche auf der Fahrlinie fest.
  const rigTrack = document.createElement('div');
  rigTrack.className = 'wd-rig-track';
  const rigCanvas = document.createElement('canvas');
  rigCanvas.className = 'wd-rig-canvas';
  for (const c of [roadCanvas, rigCanvas]) c.setAttribute('aria-hidden', 'true');
  rigTrack.append(rigCanvas);
  root.append(roadCanvas, rigTrack);
  const rctx = roadCanvas.getContext('2d')!;
  const vctx = rigCanvas.getContext('2d')!;

  const [tex, vehicleImg, plowImg]: [Textures, HTMLImageElement, HTMLImageElement] = await Promise.all([
    loadTextures(cfg.textures),
    loadImage(cfg.vehicle.src),
    loadImage(cfg.plow.src),
  ]);
  const vehicleShadow = shadowFrom(vehicleImg);
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
  let unit = 1; // CSS-Pixel je Einheit der Zeichenflächen-Breite
  let road = 0;
  let lane = 0;
  let vehLen = 0;
  let vehWid = 0;
  let rigHeight = 0;
  /** Zusätzliche Verschiebung der Fahrzeug-Fläche gegenüber der Fahrlinie. */
  let rigShift = 0;
  // Bis wohin die Straße aktuell geräumt bzw. gestreut gezeichnet ist.
  let paintedPlow = NaN;
  let paintedSalt = NaN;

  const placeRig = (): void => {
    rigCanvas.style.top = `${Math.round(window.innerHeight * cfg.anchor - rigHeight / 2)}px`;
  };

  const rebuild = (): void => {
    width = root.clientWidth;
    height = root.clientHeight;
    if (!width || !height) return;

    unit = width / cfg.viewBox.width;
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
    path = new RoadPath(cfg.roadPath, unit, height / cfg.viewBox.height, vehLen * 3);
    world = buildWorld({ width, height, ratio, road }, path, tex, cfg);
    salt = buildSalt(path, cfg, road);
    spray = buildSpray(path, cfg, road);

    roadCanvas.width = world.snow.width;
    roadCanvas.height = world.snow.height;
    rigHeight = Math.min(height, Math.ceil(vehLen * RIG_HEIGHT));
    rigCanvas.width = world.snow.width;
    rigCanvas.height = Math.round(rigHeight * ratio);
    rigCanvas.style.height = `${rigHeight}px`;
    placeRig();

    paintedPlow = paintedSalt = NaN;
    draw();
    root.classList.add('is-ready');
  };

  /** Beschreibt das Band der Fahrspur (samt Pflugwällen) zwischen zwei
   *  Fahrstrecken als Zeichenpfad, in Straßenkoordinaten. */
  const traceBand = (ctx: CanvasRenderingContext2D, from: number, to: number): boolean => {
    if (!path) return false;
    const a = Math.max(path.min, from);
    const b = Math.min(path.max, to);
    if (b <= a) return false;
    const half = (road * (cfg.clearedWidth + 0.3)) / 2;
    const steps = Math.max(1, Math.ceil((b - a) / 3));
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = path.offsetAt(a + ((b - a) * i) / steps, lane - half);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    for (let i = steps; i >= 0; i--) {
      const p = path.offsetAt(a + ((b - a) * i) / steps, lane + half);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    return true;
  };

  // ── Ebene 1: Straße ───────────────────────────────────────────────────────

  /** Überträgt einen Streckenabschnitt aus einer vorgerechneten Ebene auf die
   *  sichtbare Straße. Das Band liegt vollständig auf dem (deckenden) Asphalt,
   *  deshalb wird einfach darübergemalt und nichts vorher gelöscht — Löschen
   *  mit weicher Kante würde an jeder Abschnittsgrenze eine Querlinie hinterlassen. */
  const paintRange = (layer: HTMLCanvasElement, from: number, to: number): void => {
    rctx.save();
    rctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (traceBand(rctx, from, to)) {
      rctx.clip();
      rctx.setTransform(1, 0, 0, 1, 0, 0);
      rctx.drawImage(layer, 0, 0);
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
    if (!path) return;
    const yScale = height / cfg.viewBox.height;
    rctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    rctx.lineWidth = 2;
    rctx.strokeStyle = '#b15a2e';
    path.trace(rctx, 0, path.length);
    rctx.stroke();
    rctx.fillStyle = '#b15a2e';
    rctx.font = '600 11px ui-monospace, monospace';
    // Alle Zahlenpaare des Pfads als Punkte: Endpunkte und Griffe.
    const nums = cfg.roadPath.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = nums[i] * unit;
      const y = nums[i + 1] * yScale;
      rctx.beginPath();
      rctx.arc(x, y, 4, 0, Math.PI * 2);
      rctx.fill();
      rctx.fillText(`${nums[i]} ${nums[i + 1]}`, x + 7, y + 4);
    }
  };

  // ── Ebene 2: Fahrzeug ─────────────────────────────────────────────────────
  let forced: number | null = null;

  const draw = (): void => {
    if (!world || !path) return;
    const rootTop = root.getBoundingClientRect().top;

    // Wo steht das Fahrzeug? Dort, wo die Straße die Fahrlinie des Bildschirms
    // kreuzt. Führt die Straße irgendwo wieder aufwärts, ist das nicht
    // eindeutig — dann zählt ersatzweise der Anteil der gescrollten Strecke.
    const lineY = window.innerHeight * cfg.anchor - rootTop;
    const startY = path.at(0).y;
    const endY = path.at(path.length).y;

    // Die Fahrt soll genau den scrollbaren Bereich ausfüllen: ganz oben auf der
    // Seite steht das Fahrzeug am Anfang der Straße, ganz unten an ihrem Ende.
    // Ohne diese Umrechnung käme die Fahrlinie am Seitenanfang und -ende nie
    // bis zum Straßenende, das Fahrzeug bliebe mitten im Bild stehen.
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const rootDocTop = rootTop + scrollY;
    const lineAt = (scroll: number): number => scroll + window.innerHeight * cfg.anchor - rootDocTop;
    // Nur wenn die Spalte am Seitenanfang schon im Bild ist bzw. am Seitenende
    // noch im Bild ist. Liegt sie mitten in einer langen Seite, fährt das
    // Fahrzeug ohnehin außerhalb des Bildschirms ein und aus.
    const from = rootDocTop < window.innerHeight ? lineAt(0) : startY;
    const to = rootDocTop + height > maxScroll ? lineAt(maxScroll) : endY;
    const travel = to > from ? clamp((lineY - from) / (to - from), 0, 1) : 0;

    let s: number;
    if (forced !== null) s = forced * path.length;
    else if (path.runsDownward) s = path.distanceAtY(startY + (endY - startY) * travel);
    else s = travel * path.length;

    const spreader = s - vehLen * cfg.vehicle.spreaderPosition;
    const reach = vehLen * cfg.saltThrow;
    const bladeAt = s + vehLen * cfg.plow.position;
    const frontier = bladeAt - vehLen * 0.04;

    updateRoad(frontier, spreader - reach);

    // Fahrzeuglage aus Vorder- und Hinterachse: die Karosserie liegt als Sehne
    // auf dem Pfad, Position und Drehung ergeben sich daraus von selbst.
    const wheelbase = vehLen * cfg.vehicle.wheelbase;
    const front = path.offsetAt(s + wheelbase / 2, lane);
    const rear = path.offsetAt(s - wheelbase / 2, lane);
    const vx = (front.x + rear.x) / 2;
    const vy = (front.y + rear.y) / 2;
    const heading = Math.atan2(front.y - rear.y, front.x - rear.x);

    // Lage der Fahrzeug-Fläche in der Spalte. Der Browser hält sie auf der
    // Fahrlinie. Das Skript schiebt nur den Rest nach: den langsamen Versatz,
    // der aus der Umrechnung oben entsteht. Er ändert sich pro Scrollschritt
    // nur um einen Bruchteil, deshalb fällt ein Bild Verzug hier nicht auf.
    const rigTop = rigCanvas.getBoundingClientRect().top - rootTop - rigShift;
    const off = vy - (rigTop + rigHeight / 2);
    const shift = Math.round(off);
    if (shift !== rigShift) {
      rigShift = shift;
      rigCanvas.style.transform = shift ? `translate3d(0, ${shift}px, 0)` : '';
    }
    // Auf ganze Gerätepixel gerundet, damit die Texturen deckungsgleich zur
    // Straße darunter liegen.
    const originY = Math.round((rigTop + rigShift) * ratio);

    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.clearRect(0, 0, rigCanvas.width, rigCanvas.height);
    const toRoad = (): void => vctx.setTransform(ratio, 0, 0, ratio, 0, -originY);

    // Fahrbahn direkt um das Fahrzeug: geräumt bis unters Schild, davor
    // Schnee. Die Straßen-Ebene zeigt dasselbe — aber sie kann beim schnellen
    // Scrollen ein Bild hinterher sein. Dieses Stück fährt mit dem Fahrzeug
    // und deckt die Stelle ab, sodass Räumkante und Schild immer zusammenpassen.
    if (cfg.clearedRoadAmount > 0) {
      const patch = (layer: HTMLCanvasElement, from: number, to: number): void => {
        vctx.save();
        toRoad();
        if (traceBand(vctx, from, to)) {
          vctx.clip();
          vctx.setTransform(1, 0, 0, 1, 0, 0);
          vctx.drawImage(layer, 0, -originY);
        }
        vctx.restore();
      };
      patch(world.snow, frontier - 2, frontier + vehLen * 0.7);
      patch(world.cleared, s - vehLen * 0.85, frontier);
    }

    toRoad();
    if (salt && salt.count) drawSaltInFlight(spreader, reach);

    // Schatten fällt in Lichtrichtung der Szene, unabhängig von der Fahrtrichtung.
    const drop = vehLen * 0.05;
    const grow = 1 + SHADOW_PAD * 2;
    const dw = turned ? vehLen : vehWid;
    const dh = turned ? vehWid : vehLen;
    const spin = heading + Math.PI / 2 + (cfg.vehicle.imageRotation * Math.PI) / 180;
    vctx.save();
    vctx.translate(vx + cfg.light.x * drop, vy + cfg.light.y * drop);
    vctx.rotate(spin);
    vctx.globalAlpha = 0.5;
    vctx.drawImage(vehicleShadow, (-dw * grow) / 2, (-dh * grow) / 2, dw * grow, dh * grow);
    vctx.restore();

    vctx.save();
    vctx.translate(vx, vy);
    vctx.rotate(spin);
    vctx.imageSmoothingQuality = 'high';
    vctx.drawImage(vehicleImg, -dw / 2, -dh / 2, dw, dh);
    vctx.restore();

    // Schild: hängt vor der Fahrzeugfront, steht aber quer zur STRASSE an
    // seiner Stelle — in der Kurve dreht es sich also gegenüber dem Fahrzeug.
    const pivot = {
      x: vx + Math.cos(heading) * vehLen * cfg.plow.position,
      y: vy + Math.sin(heading) * vehLen * cfg.plow.position,
    };
    const blade = bladeDirection(path, bladeAt, cfg);
    const plowH = (vehWid * plowImg.naturalHeight) / plowImg.naturalWidth;
    vctx.save();
    vctx.translate(pivot.x, pivot.y);
    vctx.rotate(blade);
    vctx.drawImage(plowImg, -vehWid / 2, -plowH / 2, vehWid, plowH);
    vctx.restore();

    if (spray && spray.count) drawSpray(s, pivot, blade);

    options.onProgress?.(clamp(s / path.length, 0, 1));
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
  // Höchstens ein Bild je Bildschirm-Aktualisierung, und nur wenn gescrollt wurde.
  let frame = 0;
  const tick = (): void => {
    frame = 0;
    draw();
  };
  const request = (): void => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  let resizeTimer = 0;
  const onResize = (): void => {
    placeRig();
    request();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (root.clientWidth !== width || root.clientHeight !== height) rebuild();
    }, 150);
  };

  rebuild();

  const observer = new ResizeObserver(onResize);
  observer.observe(root);
  window.addEventListener('scroll', request, { passive: true });
  // Die Fahrlinie hängt an der Fensterhöhe, auch wenn die Spalte gleich bleibt.
  window.addEventListener('resize', onResize, { passive: true });

  return {
    setProgress(value) {
      forced = value === null ? null : clamp(value, 0, 1);
      request();
    },
    destroy() {
      observer.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      if (frame) cancelAnimationFrame(frame);
      roadCanvas.remove();
      rigTrack.remove();
      root.classList.remove('is-ready');
    },
  };
}
