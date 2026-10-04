// Überhängende Bäume: Wo die Straße durch das Waldfoto im Abschnitt „Über uns“
// führt, ragen einzelne Baumkronen vom Rand ein Stück über Schneewall und
// Fahrbahn.
//
// Die Kronen sind kein eigenes Bild, sondern das Waldfoto selbst, deckungsgleich
// an seiner Stelle neu gezeichnet: Eine Krone ist ein weicher Fleck des Fotos,
// in dem helle (bereifte) Äste decken und dunkle Lücken die Straße durchscheinen
// lassen. Dadurch setzen sie den Wald am Rand nahtlos fort.
//
// Dazu kommt ein weicher Schatten der Baumreihe auf dem äußeren Rand der
// Schneewälle, damit der helle Wall nicht hart gegen den Wald steht.
//
// Kronen und Schatten gehören zum Wald und bekommen deshalb denselben
// dunkelblauen Schleier wie das Foto (Element mit data-wd-shade); die Straße
// selbst bleibt unverändert.
//
// Die Ebene liegt über Straße und Fahrzeug — von oben gesehen fährt das
// Fahrzeug unter den Ästen durch. Gezeichnet wird einmal je Aufbau der Straße.

import type { RoadPath } from './road-path';

// ── Stellwerte (Vielfache der Fahrbahnbreite) ───────────────────────────────
/** Abstand der Kronenmitte von der Straßenachse. Die Fahrbahn endet bei 0.5,
 *  der Schneewall bei 0.66. */
const CROWN_OFFSET = 0.56;
/** Kleinster und größter Kronenradius. */
const CROWN_MIN = 0.3;
const CROWN_MAX = 0.55;
/** Mittlerer Abstand zweier Kronen entlang der Straße. */
const CROWN_SPACING = 0.55;
/** Anteil der Stellen, an denen auf einer Seite tatsächlich eine Krone steht.
 *  0 = keine Bäume über der Straße (derzeit so gewünscht; vorher 0.75). Der
 *  Schatten der Baumreihe am Schneewall bleibt davon unberührt. */
const CROWN_SHARE = 0;
/** Wie hart die Krone deckt: höher = geschlossener Kern, schärferer Rand. */
const CROWN_CORE = 2.4;
/** Wie weit helle Äste über den Kern hinaus und dunkle Lücken in ihn hinein reichen. */
const BRANCH_REACH = 1.6;
/** Schatten der Kronen auf Schnee und Fahrbahn: Versatz (Licht von links
 *  oben) und Deckung. */
const SHADOW_SHIFT = { x: 0.1, y: 0.09 };
const SHADOW_ALPHA = 0.35;
/** Schatten der Baumreihe: Abstand von der Achse (außen am Schneewall),
 *  Breite und Deckung. */
const EDGE_OFFSET = 0.68;
const EDGE_WIDTH = 0.4;
const EDGE_ALPHA = 0.45;
/** Anzahl der übereinanderliegenden Striche des Verlaufs. */
const EDGE_STEPS = 8;
/** Farbe der Schatten. */
const SHADE = '#081320';

/** Fester Zufall: Bei jedem Aufbau stehen die Bäume an denselben Stellen. */
function random(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const loaded = (img: HTMLImageElement): Promise<void> =>
  img.complete && img.naturalWidth
    ? Promise.resolve()
    : new Promise((resolve, reject) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => reject(new Error('Waldfoto fehlt')), { once: true });
      });

/** Legt die Ebene in `root` an. Die zurückgegebene Funktion zeichnet die
 *  Kronen für den aktuellen Verlauf neu; `null` leert die Ebene. */
export function mountCanopy(
  root: HTMLElement,
  photo: HTMLImageElement,
  veil: HTMLElement | null,
): (path: RoadPath | null, road: number) => Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.className = 'wd-canopy-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  root.append(canvas);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  let token = 0;
  const crowns = document.createElement('canvas');
  const shadow = document.createElement('canvas');
  /** Dunkle Silhouette eines Bildes. */
  const shade = (src: HTMLCanvasElement): HTMLCanvasElement => {
    shadow.width = src.width;
    shadow.height = src.height;
    const sctx = shadow.getContext('2d')!;
    sctx.drawImage(src, 0, 0);
    sctx.globalCompositeOperation = 'source-in';
    sctx.fillStyle = SHADE;
    sctx.fillRect(0, 0, shadow.width, shadow.height);
    return shadow;
  };

  return async (path, road) => {
    const mine = ++token;
    if (!path) {
      canvas.width = canvas.height = 0;
      return;
    }
    await loaded(photo);
    if (mine !== token) return;

    // Lage des Fotos in der Fläche der Straße. Es füllt seinen Abschnitt wie
    // `object-fit: cover`, mittig.
    const o = root.getBoundingClientRect();
    const r = photo.getBoundingClientRect();
    const top = Math.max(0, r.top - o.top);
    const bottom = Math.min(o.height, r.bottom - o.top);
    const width = o.width;
    const height = bottom - top;
    if (height <= 0 || !width) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.top = `${top}px`;
    canvas.style.height = `${height}px`;

    const nw = photo.naturalWidth;
    const nh = photo.naturalHeight;
    const scale = Math.max(r.width / nw, r.height / nh);
    const px = r.left - o.left + (r.width - nw * scale) / 2;
    const py = r.top - o.top - top + (r.height - nh * scale) / 2;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(photo, px, py, nw * scale, nh * scale);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Kronen als Deckung je Gerätepixel sammeln.
    const W = canvas.width;
    const H = canvas.height;
    const cover = new Float32Array(W * H);
    const rand = random(0x5e7);
    for (let s = path.min; s < path.max; s += road * CROWN_SPACING * (0.5 + rand())) {
      for (const side of [-1, 1]) {
        const show = rand() < CROWN_SHARE;
        const radius = road * (CROWN_MIN + (CROWN_MAX - CROWN_MIN) * rand());
        const shift = (rand() - 0.5) * road * 0.3;
        if (!show) continue;
        const c = path.offsetAt(s + shift, side * road * CROWN_OFFSET);
        const cx = c.x * ratio;
        const cy = (c.y - top) * ratio;
        const R = radius * ratio;
        if (cy < -R || cy > H + R || cx < -R || cx > W + R) continue;
        const x0 = Math.max(0, Math.floor(cx - R));
        const x1 = Math.min(W - 1, Math.ceil(cx + R));
        const y0 = Math.max(0, Math.floor(cy - R));
        const y1 = Math.min(H - 1, Math.ceil(cy + R));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const d = Math.hypot(x - cx, y - cy) / R;
            if (d >= 1) continue;
            const a = 1 - d;
            const i = y * W + x;
            if (a > cover[i]) cover[i] = a;
          }
        }
      }
    }

    // Zur Kronenmitte hin deckt alles, nach außen nur noch die hellen Äste:
    // So franst die Krone in einzelne Zweige aus, durch deren Lücken die
    // Straße scheint.
    const image = ctx.getImageData(0, 0, W, H);
    const px4 = image.data;
    for (let i = 0; i < cover.length; i++) {
      const k = i * 4;
      if (!cover[i]) {
        px4[k + 3] = 0;
        continue;
      }
      const lum = (px4[k] * 0.3 + px4[k + 1] * 0.59 + px4[k + 2] * 0.11) / 255;
      const bright = Math.min(1, Math.max(0, (lum - 0.3) / 0.4));
      const key = bright * bright * (3 - 2 * bright);
      const a = cover[i] * CROWN_CORE - (CROWN_CORE - 1) * 0.6 + (key - 0.5) * BRANCH_REACH;
      px4[k + 3] = Math.round(255 * Math.min(1, Math.max(0, a)));
    }
    ctx.putImageData(image, 0, 0);

    // Schatten: dieselben Kronen dunkel und versetzt darunter.
    crowns.width = W;
    crowns.height = H;
    const cctx = crowns.getContext('2d')!;
    cctx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = SHADOW_ALPHA;
    ctx.drawImage(shade(crowns), SHADOW_SHIFT.x * road * ratio, SHADOW_SHIFT.y * road * ratio);
    ctx.globalAlpha = 1;
    ctx.drawImage(crowns, 0, 0);

    // Schatten der Baumreihe am äußeren Rand der Schneewälle: gleich verlaufende
    // Striche zunehmender Breite übereinander ergeben einen weichen Verlauf,
    // in der Mitte am dunkelsten.
    ctx.globalCompositeOperation = 'destination-over';
    ctx.setTransform(ratio, 0, 0, ratio, 0, -top * ratio);
    ctx.strokeStyle = SHADE;
    ctx.lineJoin = 'round';
    for (const side of [-1, 1]) {
      path.trace(ctx, path.min, path.max, side * road * EDGE_OFFSET);
      for (let k = 1; k <= EDGE_STEPS; k++) {
        ctx.globalAlpha = EDGE_ALPHA / EDGE_STEPS;
        ctx.lineWidth = (road * EDGE_WIDTH * k) / EDGE_STEPS;
        ctx.stroke();
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

    // Derselbe Schleier wie über dem Foto.
    if (veil) {
      const style = getComputedStyle(veil);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = Number(style.opacity);
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
  };
}
