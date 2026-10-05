// Bedienleiste (Abläufe starten/stoppen), Statuszeile, Ablaufliste und
// Positionsliste. Reines HTML; Zeichnung und SalzManager-Bildschirm kommen
// aus scene.ts.

import { AREAS, PLANT } from '../../content/anlagensimulation';
import { density, fmt1, fmt2 } from './format';
import { PROCESSES, type Controller, type ProcessId } from './processes';

/** Positionsliste zur Zeichnung (Nummern wie in scene.ts → MARKERS). */
const PARTS: string[] = [
  'Salzsilo 600 t',
  'Befüllleitung',
  'Schieber mit Rüttler',
  'Ampeln und RFID-Leser',
  'Dosierschnecke',
  'Soleaufbereiter',
  'Wasserzulauf',
  'Pumpen- und Ventilkasten',
  'Soletank',
  'Zapfstelle und RFID-Leser',
  'Steuerung',
  'SalzManager',
];

/** Meldungen in der Liste unter dem SalzManager (Handy); ältere fallen weg. */
const LOG_MAX = 10;

/** Abläufe tragen Buchstaben (A–F), damit sie nicht mit den
 *  Positionsnummern (1–12) in der Zeichnung verwechselt werden. */
const stepLetter = (i: number): string => String.fromCharCode(65 + i);

export function panelMarkup(stage: string): string {
  const actions = PROCESSES.map(
    (p, i) => `
    <button type="button" class="ps-act" data-action="${p.id}" aria-describedby="ps-status">
      <span class="ps-act-idx">${stepLetter(i)}</span>
      <span class="ps-act-label">${p.title}</span>
      <span class="ps-act-state" data-act-state></span>
    </button>`,
  ).join('');

  const rows = PROCESSES.map(
    (p, i) => `
    <li class="ps-row" data-row="${p.id}">
      <span class="ps-row-idx">${stepLetter(i)}</span>
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
    <div class="ps-tools">
      <!-- Nur auf schmalen Bildschirmen: Ausschnitt der Zeichnung wählen. -->
      <div class="ps-view">
        <button type="button" class="ps-tool" data-view-toggle aria-haspopup="true" aria-expanded="false" aria-controls="ps-view-menu">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.75 7V3.75a1 1 0 0 1 1-1H7M13 2.75h3.25a1 1 0 0 1 1 1V7M17.25 13v3.25a1 1 0 0 1-1 1H13M7 17.25H3.75a1 1 0 0 1-1-1V13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="7" y="7" width="6" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
          Ansicht
        </button>
        <div class="ps-view-menu" id="ps-view-menu" role="group" aria-label="Ansicht wählen" hidden>
          ${AREAS.filter((a) => !a.auto).map((a) => `<button type="button" data-area="${a.id}" aria-pressed="false">${a.label}</button>`).join('')}
        </div>
      </div>
      <button type="button" class="ps-tool" data-dialog="info" aria-haspopup="dialog" aria-controls="ps-dlg-info">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="6.2" r="1.1" fill="currentColor"/><path d="M10 9v5.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
        Info
      </button>
      <button type="button" class="ps-tool" data-dialog="parts" aria-haspopup="dialog" aria-controls="ps-dlg-parts">
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="10" y="13.6" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="currentColor">1</text></svg>
        Positionen
      </button>
    </div>
  </div>

  <!-- Zeichnung und Bedienung gehören zusammen ins Bild: auf breiten
       Bildschirmen nebeneinander, sonst untereinander (styles: .ps-main). -->
  <div class="ps-main">
    <div class="ps-stage">${stage}</div>

    <div class="ps-console">
      <div class="ps-actions" role="group" aria-label="Abläufe starten und stoppen">${actions}</div>
      <div class="ps-console-foot">
        <p class="ps-status" id="ps-status" data-status aria-live="polite"></p>
        <button type="button" class="ps-reset" data-reset>Zurücksetzen</button>
      </div>
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
    <!-- Alle Meldungen seit dem Laden, neueste oben, höchstens zehn. -->
    <h3 class="ps-subhead">Meldungen</h3>
    <ol class="ps-smm-log" data-smm-log></ol>
  </section>

  <!-- Pop-ups zu den Knöpfen „Info“ und „Positionen“. Ihr Inhalt passt sich
       dem Fenster an (fitDialog), damit nie gescrollt werden muss. -->
  <dialog class="ps-dlg" id="ps-dlg-info" data-dlg="info" aria-labelledby="ps-dlg-info-h">
    <div class="ps-dlg-head">
      <h3 id="ps-dlg-info-h">So arbeitet die Anlage</h3>
      <button type="button" class="ps-dlg-close" data-close aria-label="Schließen">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="ps-dlg-body"><ul class="ps-list">${rows}</ul></div>
  </dialog>

  <dialog class="ps-dlg" id="ps-dlg-parts" data-dlg="parts" aria-labelledby="ps-dlg-parts-h">
    <div class="ps-dlg-head">
      <h3 id="ps-dlg-parts-h">Positionen in der Zeichnung</h3>
      <button type="button" class="ps-dlg-close" data-close aria-label="Schließen">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="ps-dlg-body">
      <ol class="ps-parts">
        ${PARTS.map((name, i) => `<li><span class="ps-part-n">${i + 1}</span><span>${name}</span></li>`).join('')}
      </ol>
    </div>
  </dialog>`;
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
  const log = q('[data-smm-log]');
  let lastMsg: unknown;

  // Ein gesperrter Knopf bleibt bedienbar (aria-disabled statt disabled):
  // Ein Klick erklärt dann in der Statuszeile, warum es gerade nicht geht.
  let hint = '';
  let hintUntil = 0;
  const showHint = (msg: string): void => {
    hint = msg;
    hintUntil = performance.now() + 4000;
  };

  /** Inhalt eines Pop-ups ohne Scrollen einpassen: zuerst in voller
   *  Schriftgröße; passt es nicht, wird die Schrift schrittweise kleiner
   *  (alle Größen darin sind in em angegeben und schrumpfen mit). */
  const fitDialog = (dlg: HTMLDialogElement): void => {
    const body = dlg.querySelector<HTMLElement>('.ps-dlg-body')!;
    // Ausnahme Info auf dem Handy: feste, gut lesbare Schrift, dafür scrollt
    // der Inhalt (styles: .ps-dlg[data-dlg='info'] unter 48 rem).
    if (dlg === infoDlg && phone.matches) {
      body.style.fontSize = '';
      return;
    }
    let size = 16;
    body.style.fontSize = `${size}px`;
    while (body.scrollHeight > body.clientHeight + 1 && size > 10) {
      size -= 0.5;
      body.style.fontSize = `${size}px`;
    }
  };
  const infoDlg = root.querySelector<HTMLDialogElement>('[data-dlg="info"]')!;
  const phone = window.matchMedia('(max-width: 47.99rem)');
  const openDialogs = (): HTMLDialogElement[] =>
    Array.from(root.querySelectorAll<HTMLDialogElement>('dialog[open]'));
  // „Positionen“ auf breiten Bildschirmen: ein Feld genau über dem Bereich
  // rechts der Zeichnung — oben bündig mit dem Info-Knopf, links/rechts über
  // Info, Positionen und die Ablauf-Knöpfe, unten bis zur Straße (Unterkante
  // der Zeichnung). Liefert false, wenn die Knöpfe nicht neben der Zeichnung
  // stehen (Tablet, Handy) — dann öffnet es als Pop-up in der Mitte.
  const partsDlg = root.querySelector<HTMLDialogElement>('[data-dlg="parts"]')!;
  const placePanel = (): boolean => {
    const main = root.querySelector<HTMLElement>('.ps-main')!;
    const beside = getComputedStyle(main).display === 'grid';
    partsDlg.classList.toggle('is-panel', beside);
    if (!beside) {
      partsDlg.removeAttribute('style');
      return false;
    }
    const base = root.getBoundingClientRect();
    const info = q('[data-dialog="info"]').getBoundingClientRect();
    const parts = q('[data-dialog="parts"]').getBoundingClientRect();
    const acts = q('.ps-actions').getBoundingClientRect();
    const svg = q('.ps-svg').getBoundingClientRect();
    // Absolut gesetzte Elemente beziehen sich auf die Innenkante des Rahmens,
    // deshalb den Rand (border) der Simulation abziehen.
    const x0 = base.left + root.clientLeft;
    const y0 = base.top + root.clientTop;
    const left = Math.min(info.left, acts.left) - x0;
    const right = Math.max(parts.right, acts.right) - x0;
    const top = info.top - y0;
    const bottom = svg.bottom - y0;
    Object.assign(partsDlg.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${right - left}px`,
      height: `${bottom - top}px`,
    });
    return true;
  };

  const onResize = (): void => {
    if (partsDlg.open && partsDlg.classList.contains('is-panel')) {
      // Wechsel auf schmal, während das Feld offen ist: einfach schließen.
      if (!placePanel()) partsDlg.close();
    }
    openDialogs().forEach(fitDialog);
  };
  window.addEventListener('resize', onResize);
  // Das nicht-modale Feld schließt bei Esc und bei einem Klick daneben (der
  // Knopf „Positionen“ selbst schaltet es über onClick um).
  // Menü „Ansicht“: Die Auswahl selbst übernimmt camera.ts (data-area), hier
  // nur Öffnen und Schließen — nach der Wahl, mit Esc oder Tippen daneben.
  const viewBtn = q<HTMLButtonElement>('[data-view-toggle]');
  const viewMenu = q('.ps-view-menu');
  const setViewMenu = (open: boolean): void => {
    viewMenu.hidden = !open;
    viewBtn.setAttribute('aria-expanded', String(open));
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && !viewMenu.hidden) {
      setViewMenu(false);
      viewBtn.focus();
    }
    if (e.key === 'Escape' && partsDlg.open && partsDlg.classList.contains('is-panel')) partsDlg.close();
  };
  const onPointer = (e: PointerEvent): void => {
    if (!viewMenu.hidden && !viewBtn.parentElement!.contains(e.target as Node)) setViewMenu(false);
    if (!partsDlg.open || !partsDlg.classList.contains('is-panel')) return;
    const t = e.target as Node;
    if (partsDlg.contains(t) || q('[data-dialog="parts"]').contains(t)) return;
    partsDlg.close();
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onPointer);
  // Klick auf den abgedunkelten Hintergrund schließt (das Ziel ist dann der
  // <dialog> selbst, nicht sein Inhalt). Esc schließt von Haus aus.
  root.querySelectorAll<HTMLDialogElement>('dialog').forEach((dlg) =>
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    }),
  );
  // Solange ein Pop-up (modal) offen ist, lässt sich dahinter nichts drücken
  // (das macht showModal) und auch nichts scrollen (Klasse ps-dlg-lock, wie
  // beim Cookie-Hinweis). Das nicht-modale Positionen-Feld am Desktop sperrt nicht.
  const lockPage = (on: boolean): void => {
    document.documentElement.classList.toggle('ps-dlg-lock', on);
  };
  const onDialogClose = (): void => {
    if (!root.querySelector('dialog[open]:modal')) lockPage(false);
  };
  root.querySelectorAll<HTMLDialogElement>('dialog').forEach((dlg) => dlg.addEventListener('close', onDialogClose));

  const onClick = (e: MouseEvent): void => {
    const target = (e.target as HTMLElement).closest('button');
    if (!target || !root.contains(target)) return;
    if (target.hasAttribute('data-view-toggle')) {
      setViewMenu(viewMenu.hidden);
      return;
    }
    if (target.dataset.area) {
      setViewMenu(false);
      return;
    }
    if (target.dataset.dialog) {
      const dlg = root.querySelector<HTMLDialogElement>(`[data-dlg="${target.dataset.dialog}"]`)!;
      if (dlg.open) {
        dlg.close();
        return;
      }
      if (dlg === partsDlg && placePanel()) {
        // Als Feld über der Knopfspalte, nicht modal: Die Zeichnung bleibt
        // sichtbar, die Nummern lassen sich dort nachsehen.
        dlg.show();
        dlg.querySelector<HTMLElement>('[data-close]')?.focus();
      } else {
        dlg.showModal();
        lockPage(true);
      }
      fitDialog(dlg);
      return;
    }
    if (target.hasAttribute('data-close')) {
      target.closest('dialog')?.close();
      return;
    }
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
    // Neu aufgebaut nur, wenn eine Meldung dazukommt (neueste steht vorn).
    if (s.messages[0] !== lastMsg) {
      lastMsg = s.messages[0];
      log.replaceChildren(
        ...s.messages.slice(0, LOG_MAX).map((m) => {
          const li = document.createElement('li');
          li.classList.toggle('is-warn', m.warn);
          const time = document.createElement('span');
          time.textContent = m.time;
          li.append(time, m.text);
          return li;
        }),
      );
    }

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

    // Ein offenes Pop-up zeigt die Zustände live; wird ein Text länger und
    // passt nicht mehr, neu einpassen.
    for (const dlg of openDialogs()) {
      const body = dlg.querySelector<HTMLElement>('.ps-dlg-body')!;
      if (body.scrollHeight > body.clientHeight + 1) fitDialog(dlg);
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
    destroy: () => {
      lockPage(false);
      root.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    },
  };
}

function text(el: HTMLElement, value: string): void {
  if (el.textContent !== value) el.textContent = value;
}
