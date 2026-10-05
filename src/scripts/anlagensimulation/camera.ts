// Ausschnitt der Zeichnung auf schmalen Bildschirmen.
//
// Auf dem Handy wäre die ganze Anlage so klein, dass Beschriftungen und
// Ventile kaum zu erkennen sind. Dort zeigt die Zeichnung deshalb einen
// Bereich (Silo, Aufbereiter, Soletank, Zapfstelle, SalzManager), wählbar
// über das Menü „Ansicht“ neben Info und Positionen oder per Fingertipp:
// In der ganzen Anlage öffnet ein Tipp den Bereich, der zur Stelle am besten
// passt; ein Doppeltipp führt zurück zur ganzen Anlage. Abläufe wechseln die
// Ansicht selbst (plant-sim.ts). Nach dem Laden zeigt sie immer die ganze
// Anlage. Ab 48 rem Breite gilt immer die ganze Anlage.
//
// Umgesetzt über die viewBox des SVG: Alles ist Vektor, die Zeichnung wird
// beim Hineinzoomen also schärfer statt unscharf. Die Höhe des SVG folgt dem
// Seitenverhältnis der viewBox von selbst.

import { AREAS, LAYOUT, type AreaId } from '../../content/anlagensimulation';

type Box = { x: number; y: number; w: number; h: number };

export interface Camera {
  /** Ein Bild weiter; `dt` in Sekunden. */
  tick(dt: number): void;
  /** Ansicht von selbst wechseln (Abläufe), nur auf schmalen Bildschirmen. */
  show(area: AreaId): void;
  destroy(): void;
}

export function createCamera(root: HTMLElement, svg: SVGSVGElement, reducedMotion: () => boolean): Camera {
  const narrow = window.matchMedia('(max-width: 47.99rem)');
  const full: Box = { ...LAYOUT.view };
  let area: AreaId = 'gesamt';
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-area]'));

  const boxOf = (id: AreaId): Box => (narrow.matches ? (AREAS.find((a) => a.id === id)?.box ?? full) : full);
  let target = boxOf(area);
  const cur: Box = { ...target };
  let written = '';

  const write = (): void => {
    const v = `${cur.x.toFixed(1)} ${cur.y.toFixed(1)} ${cur.w.toFixed(1)} ${cur.h.toFixed(1)}`;
    if (v !== written) {
      svg.setAttribute('viewBox', v);
      written = v;
    }
  };

  const select = (id: AreaId): void => {
    area = id;
    target = boxOf(id);
    if (reducedMotion()) Object.assign(cur, target);
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.area === id)));
  };

  const onClick = (e: MouseEvent): void => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-area]');
    if (btn && root.contains(btn)) select(btn.dataset.area as AreaId);
  };
  const onResize = (): void => select(area);

  /** Bereich, der zu einem Punkt der Zeichnung am besten passt: unter den
   *  Bereichen, die ihn enthalten, der mit der nächsten Mitte. */
  const PICKABLE = AREAS.filter((a) => a.box && !a.auto);
  const areaAt = (x: number, y: number): AreaId => {
    const dist = (b: Box): number => Math.hypot(b.x + b.w / 2 - x, b.y + b.h / 2 - y);
    const inside = PICKABLE.filter(({ box: b }) => x >= b!.x && x <= b!.x + b!.w && y >= b!.y && y <= b!.y + b!.h);
    const pool = inside.length ? inside : PICKABLE;
    return pool.reduce((best, a) => (dist(a.box!) < dist(best.box!) ? a : best)).id;
  };

  // Tippen auf die Zeichnung (nur schmal). Ein einzelner Tipp in der ganzen
  // Anlage wartet kurz, ob ein zweiter folgt — sonst würde ein Doppeltipp
  // erst hinein- und gleich wieder herauszoomen.
  const DOUBLE = 300;
  let lastTap = 0;
  let pending = 0;
  const onTap = (e: MouseEvent): void => {
    if (!narrow.matches) return;
    const now = performance.now();
    if (now - lastTap < DOUBLE) {
      lastTap = 0;
      clearTimeout(pending);
      select('gesamt');
      return;
    }
    lastTap = now;
    if (area !== 'gesamt') return;
    const m = svg.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    clearTimeout(pending);
    pending = window.setTimeout(() => {
      if (area === 'gesamt') select(areaAt(p.x, p.y));
    }, DOUBLE);
  };

  root.addEventListener('click', onClick);
  svg.addEventListener('click', onTap);
  narrow.addEventListener('change', onResize);
  select(area);
  Object.assign(cur, target);
  write();

  return {
    tick(dt) {
      // Weich nachziehen: in rund einer halben Sekunde am Ziel.
      const k = Math.min(1, dt * 7);
      (['x', 'y', 'w', 'h'] as const).forEach((key) => {
        cur[key] += (target[key] - cur[key]) * k;
        if (Math.abs(target[key] - cur[key]) < 0.05) cur[key] = target[key];
      });
      write();
    },
    show(id) {
      if (narrow.matches && id !== area) select(id);
    },
    destroy() {
      clearTimeout(pending);
      root.removeEventListener('click', onClick);
      svg.removeEventListener('click', onTap);
      narrow.removeEventListener('change', onResize);
    },
  };
}
