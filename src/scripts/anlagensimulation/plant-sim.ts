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
  /** Umgebender Rahmen (PlantSimulation.astro), der seine Breite aus --ps-fit
   *  ableitet; ohne Rahmen gilt der Wert nur für die Simulation selbst. */
  frame?: HTMLElement;
  /** Die Seite gehört ganz der Simulation: Wo es passt (Knöpfe neben der
   *  Zeichnung), füllen Kopfzeile, Simulation und Fußzeile genau das Fenster,
   *  und die Seite lässt sich nicht scrollen. */
  fillPage?: boolean;
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

  // Anlage und Knöpfe müssen nach dem Laden zusammen im Fenster stehen, ohne
  // dass gescrollt wird. Gemessen wird, wie viel Platz unter dem Seitenkopf
  // bleibt; die Zeichnung bekommt höchstens so viel (--ps-fit). Stehen die
  // Knöpfe darunter statt daneben, wird ihre Höhe abgezogen.
  // Neu gemessen wird nur, wenn sich die Breite ändert: Auf dem Handy ändert
  // die ein- und ausfahrende Adressleiste beim Scrollen ständig die Höhe, das
  // ließe die Zeichnung sonst springen.
  const main = root.querySelector<HTMLElement>('.ps-main')!;
  const stage = root.querySelector<HTMLElement>('.ps-stage')!;
  const actions = root.querySelector<HTMLElement>('.ps-actions')!;
  let fittedWidth = -1;
  const fit = (force = false): void => {
    if (!force && window.innerWidth === fittedWidth) return;
    fittedWidth = window.innerWidth;
    const beside = getComputedStyle(main).display === 'grid';
    const top = stage.getBoundingClientRect().top + window.scrollY;
    const below = beside ? 0 : actions.getBoundingClientRect().height + 16;
    const avail = Math.floor(window.innerHeight - top - below - 16);
    // Ganze Seite: alles unter der Zeichnung muss mit ins Fenster — der Rest
    // des Rahmens, der untere Innenabstand des Abschnitts und die Fußzeile.
    // Einzeln gemessen, weil das Seitenlayout den Hauptbereich sonst bis zur
    // Fußzeile dehnt und leere Fläche mitgezählt würde.
    const frameEl = options.frame ?? root;
    const section = frameEl.closest('section');
    const footer = document.querySelector<HTMLElement>('body footer');
    // Gemessen ab der Unterkante von Zeichnung + Knopfspalte (.ps-main): Was
    // darin höher ist, entscheidet über die Höhe — die Zeichnung wird
    // passend gesetzt, die Knopfspalte muss in den Platz passen.
    const tail =
      frameEl.getBoundingClientRect().bottom -
      main.getBoundingClientRect().bottom +
      (section ? parseFloat(getComputedStyle(section).paddingBottom) : 0) +
      (footer?.offsetHeight ?? 0);
    const whole = Math.floor(window.innerHeight - top - tail);
    const consoleH = root.querySelector<HTMLElement>('.ps-console')!.getBoundingClientRect().height;
    const lock = !!options.fillPage && beside && whole >= Math.max(320, consoleH);
    (options.frame ?? root).style.setProperty('--ps-fit', `${Math.max(160, lock ? whole : avail)}px`);
    document.documentElement.classList.toggle('ps-noscroll', lock);
    if (lock) window.scrollTo(0, 0);
  };
  const onResize = (): void => fit();
  const onOrientation = (): void => fit(true);
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onOrientation);
  // Zweimal: Die Breite des Rahmens folgt aus --ps-fit; bricht dadurch die
  // Überschrift anders um, verschiebt sich die Zeichnung — der zweite Lauf
  // misst den neuen Stand.
  fit(true);
  fit(true);
  // Nachladende Schriften verändern Höhen im Seitenkopf: danach noch einmal.
  document.fonts?.ready.then(() => {
    fit(true);
    fit(true);
  });

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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
      document.documentElement.classList.remove('ps-noscroll');
      root.removeEventListener('click', onStart);
      ctrl.reset();
      root.innerHTML = '';
    },
  };
}
