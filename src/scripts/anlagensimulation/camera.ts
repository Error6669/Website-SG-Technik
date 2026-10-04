// Ausschnitt der Zeichnung auf schmalen Bildschirmen.
//
// Auf dem Handy wäre die ganze Anlage so klein, dass Beschriftungen und
// Ventile kaum zu erkennen sind. Dort zeigt die Zeichnung deshalb einen
// Bereich (Silo, Aufbereiter, Soletank, Zapfstelle) im Hochformat, wählbar
// über Reiter über der Zeichnung. Startet ein Ablauf, schwenkt die Ansicht
// selbst dorthin, wo er passiert. Ab 48 rem Breite gilt immer die ganze Anlage.
//
// Umgesetzt über die viewBox des SVG: Alles ist Vektor, die Zeichnung wird
// beim Hineinzoomen also schärfer statt unscharf. Die Höhe des SVG folgt dem
// Seitenverhältnis der viewBox von selbst.

import { AREAS, LAYOUT, PROCESS_AREA, type AreaId } from '../../content/anlagensimulation';
import type { ProcessId } from './processes';

type Box = { x: number; y: number; w: number; h: number };

export interface Camera {
  /** Ein Bild weiter; `dt` in Sekunden. */
  tick(dt: number): void;
  follow(process: ProcessId): void;
  destroy(): void;
}

export function createCamera(root: HTMLElement, svg: SVGSVGElement, initial: AreaId, reducedMotion: () => boolean): Camera {
  const narrow = window.matchMedia('(max-width: 47.99rem)');
  const full: Box = { ...LAYOUT.view };
  let area: AreaId = initial;
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
    // Den gewählten Reiter in die Mitte des Reiterstreifens holen — nur
    // waagrecht, die Seite selbst scrollt dabei nicht.
    const tab = tabs.find((t) => t.dataset.area === id);
    const strip = tab?.parentElement;
    if (tab && strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: tab.offsetLeft - strip.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2,
        behavior: reducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  const onClick = (e: MouseEvent): void => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-area]');
    if (btn && root.contains(btn)) select(btn.dataset.area as AreaId);
  };
  const onResize = (): void => select(area);

  root.addEventListener('click', onClick);
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
    follow(process) {
      if (narrow.matches) select(PROCESS_AREA[process]);
    },
    destroy() {
      root.removeEventListener('click', onClick);
      narrow.removeEventListener('change', onResize);
    },
  };
}
