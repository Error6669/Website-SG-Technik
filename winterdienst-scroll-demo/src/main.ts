// Startpunkt der eigenständigen Demo. Dieser Teil wird NICHT in die Website
// übernommen — dort übernimmt eine Astro-Komponente dieselbe Aufgabe.
//
// URL-Parameter zum Testen (kombinierbar):
//   ?debug     zeichnet den Pfad samt Stützpunkten über die Szene
//   ?p=0.5     friert den Fortschritt bei 50 % ein (unabhängig vom Scrollen)
//   ?solo      zeigt nur die Straße, ohne die Texte der Demo
//   ?dark      dunkler Seitenhintergrund, um die Transparenz zu prüfen

import './styles.css';
import { CONFIG } from './config';
import { mountWinterRoad } from './winter-road';

const road = document.querySelector<HTMLElement>('[data-winter-road]');
const layout = document.querySelector<HTMLElement>('.demo-layout');
const readout = document.querySelector<HTMLElement>('[data-progress]');
const placeholder = document.querySelector<HTMLElement>('[data-placeholder]');
const params = new URLSearchParams(location.search);

if (params.has('solo')) document.body.classList.add('is-solo');
if (params.has('dark')) document.body.classList.add('is-dark');

if (road) {
  if (placeholder) placeholder.hidden = !CONFIG.vehicle.isPlaceholder;
  // In der Demo bestimmt SCROLL_LENGTH die Mindesthöhe der Strecke.
  layout?.style.setProperty('--wd-scroll-length', String(CONFIG.scrollLength));

  mountWinterRoad(road, CONFIG, {
    debug: params.has('debug'),
    onProgress: (p) => {
      if (readout) readout.textContent = `${Math.round(p * 100)} %`;
    },
  })
    .then((instance) => {
      const fixed = params.get('p');
      if (fixed !== null && fixed !== '') {
        const p = Number(fixed);
        instance.setProgress(p);
        // Die Stelle der Strecke ins Bild holen, an der das Fahrzeug dann steht.
        const y = road.getBoundingClientRect().top + window.scrollY + road.offsetHeight * p;
        window.scrollTo({ top: y - window.innerHeight * CONFIG.anchor, behavior: 'instant' });
      }
      document.documentElement.dataset.wdReady = 'true';
    })
    .catch((error: unknown) => {
      const note = document.createElement('p');
      note.className = 'demo-error';
      note.textContent = error instanceof Error ? error.message : String(error);
      road.append(note);
    });
}
