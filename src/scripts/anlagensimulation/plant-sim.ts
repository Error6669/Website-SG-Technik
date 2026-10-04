// Einstieg: baut die Simulation in ein leeres Element und startet den Takt.
//
// Eingebunden über src/components/PlantSimulation.astro
// (Doku: docs/animationen/anlagensimulation.md).
//
// Takt wie in src/scripts/road-animation.ts: requestAnimationFrame, Zeitschritt
// auf 0,1 s gedeckelt — nach einem Tabwechsel springt die Anlage sonst um
// Minuten weiter. Außerhalb des Bildschirms ruht die Simulation.

import type { AreaId } from '../../content/anlagensimulation';
import { createCamera } from './camera';
import { Sim } from './model';
import { bindPanel, panelMarkup } from './panel';
import { Controller, type ProcessId } from './processes';
import { sceneMarkup } from './scene';
import { createView } from './view';

export interface PlantSimulation {
  destroy(): void;
}

export interface PlantSimulationOptions {
  /** Startbereich auf schmalen Bildschirmen. */
  area?: AreaId;
}

export function mountPlantSimulation(root: HTMLElement, options: PlantSimulationOptions = {}): PlantSimulation {
  const sim = new Sim();
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  sim.reducedMotion = calm.matches;
  const onCalm = (): void => {
    sim.reducedMotion = calm.matches;
  };
  calm.addEventListener('change', onCalm);

  const ctrl = new Controller(sim);
  root.classList.add('ps');
  root.innerHTML = panelMarkup(sceneMarkup());
  const svg = root.querySelector<SVGSVGElement>('.ps-svg')!;
  const view = createView(svg, sim);
  const panel = bindPanel(root, ctrl);
  ctrl.onChange(() => panel.update());
  const camera = createCamera(root, svg, options.area ?? 'gesamt', () => sim.reducedMotion);
  // Startet ein Ablauf, schwenkt die Ansicht auf dem Handy dorthin. Der
  // Listener der Bedienung läuft vorher (früher registriert) und hat den
  // Ablauf dann schon gestartet.
  const onStart = (e: MouseEvent): void => {
    const id = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action as ProcessId | undefined;
    if (id && ctrl.active.has(id)) camera.follow(id);
  };
  root.addEventListener('click', onStart);
  sim.message('Anlage betriebsbereit');

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(root);

  let last = performance.now();
  let sincePanel = 0;
  let raf = 0;
  const frame = (now: number): void => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (visible) {
      sim.tick(dt);
      view.render();
      camera.tick(dt);
      // Texte der Bedienung reichen zehnmal pro Sekunde.
      sincePanel += dt;
      if (sincePanel >= 0.1) {
        sincePanel = 0;
        panel.update();
      }
    }
    raf = requestAnimationFrame(frame);
  };
  view.render();
  panel.update();
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      calm.removeEventListener('change', onCalm);
      panel.destroy();
      camera.destroy();
      root.removeEventListener('click', onStart);
      ctrl.reset();
      root.innerHTML = '';
    },
  };
}
