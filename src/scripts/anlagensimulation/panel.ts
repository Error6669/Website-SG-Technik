// Bedienleiste (Abläufe starten/stoppen), Statuszeile, Ablaufliste und
// Positionsliste. Reines HTML; Zeichnung und SalzManager-Bildschirm kommen
// aus scene.ts.

import { AREAS, PLANT } from '../../content/anlagensimulation';
import { density, fmt1, fmt2 } from './format';
import { PROCESSES, type Controller, type ProcessId } from './processes';

/** Positionsliste zur Zeichnung (Nummern wie in scene.ts → MARKERS). */
const PARTS: Array<[string, string]> = [
  ['Salzsilo 600 t', 'Edelstahl, hoch aufgeständert, auf Wägezellen (Dehnmessstreifen): misst Füllstand und jede Entnahme.'],
  ['Befüllleitung', 'Auf der linken Silo-Seite: pneumatische Befüllung aus dem Silozug.'],
  ['Schieber mit Rüttler', 'Öffnet den Auslauf; der eingebaute Rüttler hält das Salz in Bewegung, damit nichts verstopft. Darunter ein kurzes, fest montiertes Schlauchstück.'],
  ['Ampeln und RFID-Leser', 'Fahrzeuge melden sich mit ihrem RFID-Chip an, die Ampel gibt Entnahme bzw. Befüllung frei.'],
  ['Dosierschnecke', 'Setzt seitlich am Schieber an und fördert das Trockensalz mit leichtem Gefälle in den Aufbereiter.'],
  ['Soleaufbereiter', 'Steht direkt am Boden. Zwangsmischer mit Rührwerk: löst das Salz im Wasser auf 22 %.'],
  ['Wasserzulauf', 'Die Wasserpumpe P3 im Ventilkasten füllt das Lösewasser immer von oben in den Aufbereiter.'],
  ['Pumpen- und Ventilkasten', 'P3 pumpt das Wasser in den Aufbereiter, P1 fördert vom Aufbereiter in den Tank, P2 vom Tank zur Zapfstelle, zurück in den Tank oder zum Ablass. Alle Ventile sitzen hier.'],
  ['Soletank', `${PLANT.tank.capacity} m³, Füllstand und Konzentration werden laufend gemessen.`],
  ['Zapfstelle und RFID-Leser', 'Abgabe an die Fahrzeuge, abgesichert mit Überfüllschutzstecker; derselbe RFID-Leser wie am Silo.'],
  ['Steuerung', 'Touchscreen vor Ort, per Funk mit dem SalzManager verbunden.'],
  ['SalzManager', 'Webbasierte Visualisierung: Bestände, Entnahmen und Meldungen – vom Büro oder unterwegs.'],
];

export function panelMarkup(stage: string): string {
  const actions = PROCESSES.map(
    (p, i) => `
    <button type="button" class="ps-act" data-action="${p.id}" aria-describedby="ps-status">
      <span class="ps-act-idx">${String(i + 1).padStart(2, '0')}</span>
      <span class="ps-act-label">${p.title}</span>
      <span class="ps-act-state" data-act-state></span>
    </button>`,
  ).join('');

  const rows = PROCESSES.map(
    (p, i) => `
    <li class="ps-row" data-row="${p.id}">
      <span class="ps-row-idx">${String(i + 1).padStart(2, '0')}</span>
      <div class="ps-row-main">
        <p class="ps-row-title">${p.title}</p>
        <p class="ps-row-text">${p.text}</p>
        <p class="ps-row-state" data-row-state></p>
      </div>
    </li>`,
  ).join('');

  return `
  <div class="ps-bar">
    <ul class="ps-legend" aria-label="Legende">
      <li><span class="ps-swatch ps-swatch--water"></span>Wasser</li>
      <li><span class="ps-swatch ps-swatch--brine"></span>Sole</li>
      <li><span class="ps-swatch ps-swatch--salt"></span>Salz</li>
      <li><span class="ps-swatch ps-swatch--active"></span>Ventil offen · Pumpe läuft</li>
    </ul>
  </div>

  <div class="ps-areas" role="group" aria-label="Bereich der Anlage">
    ${AREAS.map((a) => `<button type="button" data-area="${a.id}" aria-pressed="false">${a.label}</button>`).join('')}
  </div>

  <div class="ps-stage">${stage}</div>

  <div class="ps-console">
    <div class="ps-actions" role="group" aria-label="Abläufe starten und stoppen">${actions}</div>
    <div class="ps-console-foot">
      <p class="ps-status" id="ps-status" data-status aria-live="polite"></p>
      <button type="button" class="ps-reset" data-reset>Zurücksetzen</button>
    </div>
  </div>

  <!-- Nur auf schmalen Bildschirmen: Der SalzManager-Bildschirm in der
       Zeichnung wäre dort zu klein, deshalb die Werte hier lesbar. -->
  <section class="ps-smm" aria-labelledby="ps-smm-h">
    <h3 id="ps-smm-h" class="ps-subhead">SalzManager</h3>
    <dl>
      <div><dt>Salzsilo</dt><dd><span data-smm="silo"></span><small data-smm="siloSub"></small></dd></div>
      <div><dt>Aufbereiter</dt><dd><span data-smm="mixer"></span><small data-smm="mixerSub"></small></dd></div>
      <div><dt>Soletank</dt><dd><span data-smm="tank"></span><small data-smm="tankSub"></small></dd></div>
      <div><dt>Entnahmen</dt><dd><span data-smm="totals"></span><small data-smm="totalsSub"></small></dd></div>
    </dl>
    <p class="ps-smm-msg" data-smm="msg"></p>
  </section>

  <div class="ps-body">
    <section class="ps-controls" aria-labelledby="ps-controls-h">
      <h3 id="ps-controls-h" class="ps-subhead">So arbeitet die Anlage</h3>
      <ul class="ps-list">${rows}</ul>
    </section>
    <section class="ps-parts" aria-labelledby="ps-parts-h">
      <h3 id="ps-parts-h" class="ps-subhead">Positionen in der Zeichnung</h3>
      <ol>
        ${PARTS.map(
          ([name, desc], i) => `<li><span class="ps-part-n">${i + 1}</span><span><strong>${name}</strong> ${desc}</span></li>`,
        ).join('')}
      </ol>
    </section>
  </div>`;
}

export interface Panel {
  update(): void;
  destroy(): void;
}

export function bindPanel(root: HTMLElement, ctrl: Controller): Panel {
  const q = <T extends Element = HTMLElement>(sel: string): T => root.querySelector<T>(sel)!;

  const rows = new Map(
    PROCESSES.map((p) => {
      const row = q(`[data-row="${p.id}"]`);
      const btn = q<HTMLButtonElement>(`[data-action="${p.id}"]`);
      return [
        p.id,
        {
          row,
          btn,
          btnState: btn.querySelector<HTMLElement>('[data-act-state]')!,
          state: row.querySelector<HTMLElement>('[data-row-state]')!,
        },
      ] as const;
    }),
  );
  const status = q('[data-status]');
  const smm = (k: string) => q(`[data-smm="${k}"]`);

  // Ein gesperrter Knopf bleibt bedienbar (aria-disabled statt disabled):
  // Ein Klick erklärt dann in der Statuszeile, warum es gerade nicht geht.
  let hint = '';
  let hintUntil = 0;
  const showHint = (msg: string): void => {
    hint = msg;
    hintUntil = performance.now() + 4000;
  };

  const onClick = (e: MouseEvent): void => {
    const target = (e.target as HTMLElement).closest('button');
    if (!target || !root.contains(target)) return;
    const action = target.dataset.action as ProcessId | undefined;
    if (action) {
      const def = ctrl.def(action);
      if (ctrl.active.has(action)) {
        if (def.stoppable) ctrl.stop(action);
        else showHint(`${def.title} läuft bis zum Ende durch.`);
      } else {
        const reason = ctrl.reason(action);
        if (reason) showHint(`${def.title} ist gerade nicht möglich – ${reason}.`);
        else ctrl.start(action);
      }
      update();
      return;
    }
    if (target.hasAttribute('data-reset')) {
      hint = '';
      ctrl.reset();
    }
  };
  root.addEventListener('click', onClick);

  function update(): void {
    const s = ctrl.sim.state;
    text(smm('silo'), `${fmt1(s.silo)} t`);
    text(smm('siloSub'), `von ${PLANT.silo.capacity} t`);
    text(smm('mixer'), s.mixer.m3 > 0.05 ? `${fmt2(density(s.mixer.conc))} kg/l` : 'leer');
    text(smm('mixerSub'), s.mixer.m3 > 0.05 ? `${fmt1(s.mixer.conc)} % Salz` : `Soll ${fmt2(PLANT.brine.density)} kg/l`);
    text(smm('tank'), `${fmt1(s.tank.m3)} m³`);
    text(smm('tankSub'), s.tank.m3 < 0.05 ? 'leer' : `${fmt1(s.tank.conc)} % Salz`);
    text(smm('totals'), `${fmt1(s.totals.salt)} t Salz`);
    text(smm('totalsSub'), `${fmt1(s.totals.brine)} m³ Sole`);
    const last = s.messages[0];
    text(smm('msg'), last ? `${last.time}  ${last.text}` : '');

    const steps: string[] = [];
    for (const p of PROCESSES) {
      const r = rows.get(p.id)!;
      const run = ctrl.active.get(p.id);
      const reason = run ? null : ctrl.reason(p.id);
      r.row.classList.toggle('is-running', !!run);
      r.btn.classList.toggle('is-running', !!run);
      r.btn.setAttribute('aria-disabled', String(!!reason || (!!run && !p.stoppable)));
      r.btn.setAttribute('aria-pressed', String(!!run));
      if (run) {
        text(r.state, run.step || 'läuft');
        text(r.btnState, p.stoppable ? 'Stoppen' : 'läuft …');
        steps.push(`${p.title}: ${run.step || 'läuft'}`);
      } else {
        text(r.state, reason ?? 'Bereit');
        text(r.btnState, reason ? 'gesperrt' : 'Starten');
      }
    }

    if (hint && performance.now() > hintUntil) hint = '';
    status.classList.toggle('is-hint', !!hint);
    text(
      status,
      hint ||
        (steps.length
          ? steps.join(' · ')
          : 'Bereit. Abläufe können gleichzeitig laufen, solange sie keine Pumpe oder die Zufahrt teilen.'),
    );
  }

  return {
    update,
    destroy: () => root.removeEventListener('click', onClick),
  };
}

function text(el: HTMLElement, value: string): void {
  if (el.textContent !== value) el.textContent = value;
}
