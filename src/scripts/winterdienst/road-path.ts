// Straßenpfad: legt den SVG-Pfad der Konfiguration auf die Fläche des
// Containers und macht daraus eine gleichmäßig abgetastete Linie, auf der sich
// Position und Fahrtrichtung für jede zurückgelegte Strecke nachschlagen lassen.
//
// Alle Werte hier sind CSS-Pixel im Container. Die Linie wird an beiden Enden
// geradlinig verlängert, damit die Straße über den Rand hinausläuft, während
// das Fahrzeug nur zwischen dem echten Start- und Endpunkt des Pfads fährt.

export interface PathPoint {
  x: number;
  y: number;
}

/** Abstand der Stützpunkte in Pixeln. */
const STEP = 3;

export class RoadPath {
  /** Länge des eigentlichen Pfads (ohne Verlängerungen), in Pixeln. */
  readonly length: number;
  private readonly xs: number[] = [];
  private readonly ys: number[] = [];
  /** Verlängerung vor dem Start. */
  private readonly lead: number;

  /**
   * @param d         SVG-Pfad in Einheiten der Zeichenfläche
   * @param scaleX    Pixel je Einheit waagrecht
   * @param scaleY    Pixel je Einheit senkrecht
   * @param extension Länge der geraden Verlängerungen in Pixeln
   */
  constructor(d: string, scaleX: number, scaleY: number, extension: number) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    const raw = el.getTotalLength();
    if (!(raw > 0)) throw new Error('roadPath ist leer oder ungültig.');

    // 1. Fein abtasten und auf den Container legen. Waagrecht und senkrecht
    //    dürfen verschieden skalieren — dadurch passt die Strecke in jede Höhe.
    const fine: PathPoint[] = [];
    const count = Math.max(64, Math.ceil(raw / 2));
    for (let i = 0; i <= count; i++) {
      const p = el.getPointAtLength((raw * i) / count);
      fine.push({ x: p.x * scaleX, y: p.y * scaleY });
    }

    // 2. Nach tatsächlich zurückgelegter Strecke neu abtasten, damit das
    //    Fahrzeug gleichmäßig schnell fährt.
    const dist = [0];
    for (let i = 1; i < fine.length; i++) {
      dist.push(dist[i - 1] + Math.hypot(fine[i].x - fine[i - 1].x, fine[i].y - fine[i - 1].y));
    }
    this.length = dist[dist.length - 1];
    const core: PathPoint[] = [];
    const steps = Math.ceil(this.length / STEP);
    let j = 1;
    for (let i = 0; i <= steps; i++) {
      const s = Math.min(this.length, i * STEP);
      while (j < dist.length - 1 && dist[j] < s) j++;
      const t = (s - dist[j - 1]) / (dist[j] - dist[j - 1] || 1);
      core.push({
        x: fine[j - 1].x + (fine[j].x - fine[j - 1].x) * t,
        y: fine[j - 1].y + (fine[j].y - fine[j - 1].y) * t,
      });
    }

    // 3. Gerade Verlängerungen.
    const start = fine[0];
    const startDir = unit(fine[1], start);
    const end = fine[fine.length - 1];
    const endDir = unit(end, fine[fine.length - 2]);
    const leadSteps = Math.ceil(extension / STEP);
    this.lead = leadSteps * STEP;
    for (let i = leadSteps; i > 0; i--) {
      this.xs.push(start.x - startDir.x * i * STEP);
      this.ys.push(start.y - startDir.y * i * STEP);
    }
    for (const p of core) {
      this.xs.push(p.x);
      this.ys.push(p.y);
    }
    // Der letzte reguläre Punkt sitzt (bis auf einen Rest < STEP) am Pfadende.
    const rest = steps * STEP - this.length;
    for (let i = 1; i <= leadSteps; i++) {
      this.xs.push(end.x + endDir.x * (i * STEP + rest));
      this.ys.push(end.y + endDir.y * (i * STEP + rest));
    }
  }

  /** Punkt nach `s` Pixeln Fahrstrecke. Negative Werte und Werte über
   *  `length` liegen auf den geraden Verlängerungen. */
  at(s: number): PathPoint {
    const f = Math.max(0, Math.min(this.xs.length - 1, (s + this.lead) / STEP));
    const i = Math.min(this.xs.length - 2, Math.floor(f));
    const t = f - i;
    return {
      x: this.xs[i] + (this.xs[i + 1] - this.xs[i]) * t,
      y: this.ys[i] + (this.ys[i + 1] - this.ys[i]) * t,
    };
  }

  private monotone: boolean | null = null;

  /** true, wenn die Straße durchgehend abwärts führt (kein Stück läuft wieder
   *  nach oben). Dann lässt sich zu jeder Höhe eindeutig sagen, wo das Fahrzeug steht. */
  get runsDownward(): boolean {
    if (this.monotone === null) {
      this.monotone = true;
      for (let s = STEP; s <= this.length; s += STEP) {
        if (this.at(s).y <= this.at(s - STEP).y) {
          this.monotone = false;
          break;
        }
      }
    }
    return this.monotone;
  }

  /** Fahrstrecke, bei der die Straße die Höhe `y` erreicht. Nur gültig, wenn
   *  `runsDownward` gilt. */
  distanceAtY(y: number): number {
    let lo = 0;
    let hi = this.length;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (this.at(mid).y < y) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /** Normierte Fahrtrichtung bei `s`. */
  tangent(s: number): PathPoint {
    return unit(this.at(s + STEP), this.at(s - STEP));
  }

  /** Punkt seitlich der Achse. `offset` > 0 liegt in Fahrtrichtung rechts. */
  offsetAt(s: number, offset: number): PathPoint {
    const p = this.at(s);
    if (!offset) return p;
    const t = this.tangent(s);
    return { x: p.x - t.y * offset, y: p.y + t.x * offset };
  }

  /** Erste und letzte abgetastete Strecke (inkl. Verlängerungen). */
  get min(): number {
    return -this.lead;
  }
  get max(): number {
    return (this.xs.length - 1) * STEP - this.lead;
  }

  /** Legt die Linie zwischen zwei Strecken als Zeichenpfad an. `offset` darf
   *  eine Funktion der Strecke sein — so entstehen leicht pendelnde Spuren. */
  trace(
    ctx: CanvasRenderingContext2D,
    from: number,
    to: number,
    offset: number | ((s: number) => number) = 0,
  ): void {
    const a = Math.max(this.min, from);
    const b = Math.min(this.max, to);
    if (b <= a) return;
    const off = typeof offset === 'function' ? offset : () => offset;
    ctx.beginPath();
    let p = this.offsetAt(a, off(a));
    ctx.moveTo(p.x, p.y);
    for (let s = Math.ceil((a + 0.001) / STEP) * STEP; s < b; s += STEP) {
      p = this.offsetAt(s, off(s));
      ctx.lineTo(p.x, p.y);
    }
    p = this.offsetAt(b, off(b));
    ctx.lineTo(p.x, p.y);
  }
}

function unit(to: PathPoint, from: PathPoint): PathPoint {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}
