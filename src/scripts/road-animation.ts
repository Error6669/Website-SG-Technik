// Fahrzeug-Animation auf einem digitalisierten Straßenpfad.
//
// Gemeinsame Grundlage für alle Straßen-Hintergründe der Seite (Serpentine auf
// der Danke-Seite, Flussstraße im mobilen Kopfzeilen-Streifen). Herkunft der
// Logik: die lokalen Prototypen in Animationen/.
//
// Bühnen-Vertrag: Das Element, das hier übergeben wird, muss immer exakt das
// Seitenverhältnis des Fotos behalten. Fahrzeuge werden prozentual darin
// platziert — eine verzerrte oder per object-fit beschnittene Bühne schiebt sie
// von der Straße. Der formatfüllende Zuschnitt gehört deshalb in die Größe der
// Bühne, nicht in das Bild darin.

export interface CarRun {
  /** Fahrzeugtyp aus CAR_TYPES. */
  type: string;
  /** Lackfarbe als Hex. */
  color: string;
  /** Startzeitpunkt im Zyklus, in Sekunden. */
  t: number;
  /** Fahrtdauer über die volle Strecke, in Sekunden. */
  dur: number;
  /** 1 = in Pfadrichtung, -1 = entgegen. */
  dir: number;
  /** Seitlicher Versatz zusätzlich zur Spurmitte, in Bildpixeln. */
  jitter?: number;
}

export interface RoadConfig {
  /** Breite des Koordinatenraums der Pfadpunkte. Muss NICHT der Pixelbreite der
   *  ausgelieferten Bilddatei entsprechen — entscheidend ist nur, dass das
   *  Seitenverhältnis übereinstimmt, weil alles prozentual gerechnet wird. */
  width: number;
  height: number;
  cycle: number;
  lane: number;
  scale: number;
  path: ReadonlyArray<readonly [number, number]>;
  schedule: ReadonlyArray<CarRun>;
}

export interface RoadAnimation {
  setRunning(value: boolean): void;
  isRunning(): boolean;
  /** true, wenn wegen prefers-reduced-motion nur ein Standbild gesetzt wurde. */
  readonly reduced: boolean;
}

interface CarSpec {
  kind: string;
  len: number;
  wid: number;
  color: string;
}

const shade = (hex: string, amt: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(v + amt))),
  );
  return `rgb(${c.join(',')})`;
};

const carSVG = (spec: CarSpec): string => {
  const L = spec.len;
  const W = spec.wid;
  const pad = Math.max(4, W * 0.14);
  const body = spec.color;
  const roof = shade(body, -26);
  const dark = shade(body, -60);
  const glass = 'rgba(28,42,52,.88)';
  const id = 'sgcar' + Math.random().toString(36).slice(2, 8);
  let cabin: string;

  if (spec.kind === 'truck') {
    cabin = `<rect x="${L * 0.06}" y="${W * 0.04}" width="${L * 0.6}" height="${W * 0.92}" rx="${W * 0.1}" fill="${shade(body, 34)}"/>
             <rect x="${L * 0.09}" y="${W * 0.09}" width="${L * 0.54}" height="${W * 0.82}" rx="${W * 0.06}" fill="${shade(body, 10)}"/>
             <rect x="${L * 0.7}" y="${W * 0.1}" width="${L * 0.14}" height="${W * 0.8}" rx="${W * 0.1}" fill="${glass}"/>
             <rect x="${L * 0.66}" y="${W * 0.05}" width="${L * 0.05}" height="${W * 0.9}" rx="${W * 0.06}" fill="${dark}" opacity=".55"/>`;
  } else if (spec.kind === 'pickup') {
    cabin = `<rect x="${L * 0.12}" y="${W * 0.1}" width="${L * 0.36}" height="${W * 0.8}" rx="${W * 0.08}" fill="${shade(body, -14)}"/>
             <rect x="${L * 0.5}" y="${W * 0.13}" width="${L * 0.22}" height="${W * 0.74}" rx="${W * 0.16}" fill="${roof}"/>
             <rect x="${L * 0.7}" y="${W * 0.16}" width="${L * 0.1}" height="${W * 0.68}" rx="${W * 0.08}" fill="${glass}"/>
             <rect x="${L * 0.47}" y="${W * 0.17}" width="${L * 0.05}" height="${W * 0.66}" rx="${W * 0.06}" fill="${glass}"/>`;
  } else if (spec.kind === 'van') {
    cabin = `<rect x="${L * 0.16}" y="${W * 0.1}" width="${L * 0.56}" height="${W * 0.8}" rx="${W * 0.14}" fill="${roof}"/>
             <rect x="${L * 0.74}" y="${W * 0.14}" width="${L * 0.11}" height="${W * 0.72}" rx="${W * 0.08}" fill="${glass}"/>
             <rect x="${L * 0.1}" y="${W * 0.18}" width="${L * 0.05}" height="${W * 0.64}" rx="${W * 0.05}" fill="${glass}"/>`;
  } else {
    const c0 = spec.kind === 'suv' ? 0.26 : 0.28;
    const cl = spec.kind === 'suv' ? 0.4 : 0.36;
    cabin = `<rect x="${L * c0}" y="${W * 0.13}" width="${L * cl}" height="${W * 0.74}" rx="${W * 0.2}" fill="${roof}"/>
             <rect x="${L * (c0 + cl)}" y="${W * 0.17}" width="${L * 0.11}" height="${W * 0.66}" rx="${W * 0.09}" fill="${glass}"/>
             <rect x="${L * (c0 - 0.07)}" y="${W * 0.19}" width="${L * 0.06}" height="${W * 0.62}" rx="${W * 0.07}" fill="${glass}"/>`;
  }

  // Der weiche Fleck unter dem Wagen ist ein Fahrzeugschatten im Bild, kein
  // UI-Schatten — die No-Shadow-Regel aus DESIGN.md meint Bedienelemente.
  return `<svg viewBox="${-pad} ${-pad} ${L + pad * 2} ${W + pad * 2}" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="${id}" x="-40%" y="-60%" width="180%" height="240%">
      <feGaussianBlur stdDeviation="${W * 0.11}"/></filter></defs>
    <rect x="${L * 0.03}" y="${W * 0.12}" width="${L * 0.96}" height="${W * 0.95}" rx="${W * 0.3}" fill="#02080b" opacity=".55" filter="url(#${id})"/>
    <rect x="0" y="0" width="${L}" height="${W}" rx="${W * 0.28}" fill="${body}"/>
    <rect x="0" y="0" width="${L}" height="${W}" rx="${W * 0.28}" fill="none" stroke="${dark}" stroke-width="${W * 0.05}" opacity=".7"/>
    ${cabin}
    <rect x="${L * 0.6}" y="${-W * 0.09}" width="${L * 0.05}" height="${W * 0.1}" rx="${W * 0.04}" fill="${dark}"/>
    <rect x="${L * 0.6}" y="${W * 0.99}" width="${L * 0.05}" height="${W * 0.1}" rx="${W * 0.04}" fill="${dark}"/>
    <rect x="${L * 0.955}" y="${W * 0.1}" width="${L * 0.035}" height="${W * 0.16}" rx="${W * 0.05}" fill="#fdf6e3" opacity=".95"/>
    <rect x="${L * 0.955}" y="${W * 0.74}" width="${L * 0.035}" height="${W * 0.16}" rx="${W * 0.05}" fill="#fdf6e3" opacity=".95"/>
    <rect x="${L * 0.012}" y="${W * 0.12}" width="${L * 0.03}" height="${W * 0.15}" rx="${W * 0.05}" fill="#c0332c" opacity=".9"/>
    <rect x="${L * 0.012}" y="${W * 0.73}" width="${L * 0.03}" height="${W * 0.15}" rx="${W * 0.05}" fill="#c0332c" opacity=".9"/>
  </svg>`;
};

/** Fahrzeugmaße als Vielfache der Konfigurationsgröße `scale`. */
const CAR_TYPES: Record<string, { kind: string; len: number; wid: number }> = {
  kombi: { kind: 'sedan', len: 1.0, wid: 0.42 },
  limo: { kind: 'sedan', len: 0.95, wid: 0.4 },
  klein: { kind: 'sedan', len: 0.82, wid: 0.38 },
  suv: { kind: 'suv', len: 1.08, wid: 0.45 },
  van: { kind: 'van', len: 1.17, wid: 0.46 },
  pickup: { kind: 'pickup', len: 1.14, wid: 0.44 },
  lkw: { kind: 'truck', len: 1.57, wid: 0.53 },
};

export function mountRoadAnimation(stage: HTMLElement, cfg: RoadConfig): RoadAnimation {
  const { width: IMG_W, height: IMG_H, cycle: CYCLE, lane: LANE, scale: K, path, schedule } = cfg;

  // Bogenlänge vorberechnen: damit ein Fahrzeug gleichmäßig schnell fährt, muss
  // die Position über die zurückgelegte Strecke laufen, nicht über den Index der
  // Stützpunkte — die liegen unterschiedlich weit auseinander.
  const seg = [0];
  for (let i = 1; i < path.length; i++) {
    seg.push(seg[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  }
  const TOTAL = seg[seg.length - 1];

  const at = (s: number) => {
    s = Math.max(0, Math.min(TOTAL, s));
    let i = 1;
    while (i < seg.length - 1 && seg[i] < s) i++;
    const t = (s - seg[i - 1]) / (seg[i] - seg[i - 1] || 1);
    const [ax, ay] = path[i - 1];
    const [bx, by] = path[i];
    // Tangente über ein größeres Fenster — sonst zittert die Ausrichtung an
    // jedem Stützpunkt.
    const j0 = Math.max(0, i - 2);
    const j1 = Math.min(path.length - 1, i + 1);
    let tx = path[j1][0] - path[j0][0];
    let ty = path[j1][1] - path[j0][1];
    const L = Math.hypot(tx, ty) || 1;
    tx /= L;
    ty /= L;
    return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, tx, ty };
  };

  const cars = schedule.map((run) => {
    const type = CAR_TYPES[run.type] ?? CAR_TYPES.kombi;
    const spec: CarSpec = { kind: type.kind, len: K * type.len, wid: K * type.wid, color: run.color };
    const el = document.createElement('div');
    el.className = 'sg-car';
    const padX = Math.max(4, spec.wid * 0.14) * 2;
    // Prozentual zur Bühne, damit die Fahrzeuge in jeder Größe maßstäblich
    // zum Foto bleiben.
    el.style.width = ((spec.len + padX) / IMG_W) * 100 + '%';
    el.style.height = ((spec.wid + padX) / IMG_H) * 100 + '%';
    el.innerHTML = carSVG(spec);
    stage.appendChild(el);
    return { run, el };
  });

  const place = (car: { run: CarRun; el: HTMLElement }, p: number): void => {
    const s = car.run.dir === 1 ? p * TOTAL : (1 - p) * TOTAL;
    const q = at(s);
    const tx = q.tx * car.run.dir;
    const ty = q.ty * car.run.dir;
    // Rechts der Fahrtrichtung versetzen — sonst führen beide Richtungen über
    // die Straßenmitte.
    const off = LANE + (car.run.jitter ?? 0);
    const x = q.x - ty * off;
    const y = q.y + tx * off;
    car.el.style.left = (x / IMG_W) * 100 + '%';
    car.el.style.top = (y / IMG_H) * 100 + '%';
    car.el.style.transform = `translate(-50%,-50%) rotate(${(Math.atan2(ty, tx) * 180) / Math.PI}deg)`;
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced) {
    // Kein Standbild einer leeren Straße: ein Teil der Fahrzeuge bleibt sichtbar
    // stehen, damit das Bild seine Aussage behält.
    cars.forEach((car, i) => {
      if (i % 2 === 0) {
        car.el.style.opacity = '1';
        place(car, 0.25 + 0.25 * i);
      }
    });
    return { setRunning: () => {}, isRunning: () => false, reduced: true };
  }

  let running = true;
  let last = performance.now();
  let clock = 0;

  const frame = (now: number): void => {
    // Auf 0,1 s gedeckelt: nach einem Tabwechsel liefert requestAnimationFrame
    // einen großen Sprung, der die Fahrzeuge sonst quer über das Bild teleportiert.
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (running) clock = (clock + dt) % CYCLE;
    for (const car of cars) {
      const p = (clock - car.run.t) / car.run.dur;
      if (p < 0 || p > 1) {
        car.el.style.opacity = '0';
        continue;
      }
      car.el.style.opacity = '1';
      place(car, p);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  return {
    setRunning: (value: boolean) => {
      running = value;
    },
    isRunning: () => running,
    reduced: false,
  };
}
