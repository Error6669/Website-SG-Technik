// Überträgt den Anlagenzustand in jedem Bild auf die Zeichnung.
//
// Attribute werden nur geschrieben, wenn sich ihr Wert ändert — die meisten
// Teile stehen die meiste Zeit still, und unnötige DOM-Schreibzugriffe kosten
// gerade auf schwachen Geräten spürbar Bildrate.

import { LAYOUT, PLANT } from '../../content/anlagensimulation';
import { density, fmt0, fmt1, fmt2 } from './format';
import { clockText, type Sim, type Vehicle } from './model';
import { C, FLOWS, GATE, VALVES, siloLevelY, type FlowId, type ValveId } from './scene';
import { COUPLING, WHEEL_R, vehicleMarkup } from './vehicles';

const cache = new WeakMap<Element, Map<string, string>>();

function attr(el: Element, name: string, value: string): void {
  let m = cache.get(el);
  if (!m) cache.set(el, (m = new Map()));
  if (m.get(name) === value) return;
  m.set(name, value);
  el.setAttribute(name, value);
}

function text(el: Element, value: string): void {
  if (el.textContent !== value) el.textContent = value;
}

/** Steht die Sole über einer Beschriftung, wird sie hell gesetzt — dunkle
 *  Schrift mit heller Umrandung wirkte auf der Sole wie ein Aufkleber. */
function submerge(el: Element, liquidTop: number): void {
  const y = Number(el.getAttribute('y'));
  el.classList.toggle('is-submerged', liquidTop < y - 12);
}

/** Kürzt Text für feste Spalten im SalzManager-Bildschirm. */
const clip = (s: string, n: number): string => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Mischt zwei Hex-Töne, t = 0 … 1. */
function mix(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) =>
    Math.round(((pa >> shift) & 255) + (((pb >> shift) & 255) - ((pa >> shift) & 255)) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

interface VehicleHandle {
  g: SVGGElement;
  spokes: Array<{ el: SVGGElement; cx: number; cy: number; r: number }>;
  load: SVGRectElement;
  loadTop: number;
  loadH: number;
  beacon: SVGElement | null;
}

type Medium = 'water' | 'brine' | 'salt';

export interface View {
  render(): void;
}

export function createView(svg: SVGSVGElement, sim: Sim): View {
  const ref = <T extends Element = SVGElement>(name: string): T => {
    const el = svg.querySelector<T>(`[data-ref="${name}"]`);
    if (!el) throw new Error(`Anlagensimulation: Element "${name}" fehlt in der Zeichnung`);
    return el;
  };

  const flows = new Map<FlowId, SVGPathElement>();
  (Object.keys(FLOWS) as FlowId[]).forEach((id) => {
    flows.set(id, svg.querySelector<SVGPathElement>(`[data-flow="${id}"]`)!);
  });
  const valves = new Map<ValveId, SVGGElement>();
  VALVES.forEach((v) => valves.set(v.id, svg.querySelector<SVGGElement>(`[data-valve="${v.id}"]`)!));
  const pumps = {
    p1: svg.querySelector<SVGGElement>('[data-pump="p1"]')!,
    p3: svg.querySelector<SVGGElement>('[data-pump="p3"]')!,
    p2: svg.querySelector<SVGGElement>('[data-pump="p2"]')!,
  };

  const r = {
    siloSalt: ref('siloSalt'),
    siloValue: ref('siloValue'),
    siloSub: ref('siloSub'),
    gate: ref('gate'),
    vibrator: ref('vibrator'),
    stream: ref('stream'),
    streamClip: ref('streamClip'),
    outRed: ref('outRed'),
    outGreen: ref('outGreen'),
    inRed: ref('inRed'),
    inGreen: ref('inGreen'),
    rfidSilo: ref('rfidSilo'),
    rfidSiloLabel: ref('rfidSiloLabel'),
    rfidZapf: ref('rfidZapf'),
    rfidZapfLabel: ref('rfidZapfLabel'),
    screw: ref('screw'),
    blades: [ref('blade1'), ref('blade2')],
    mixerFill: ref('mixerFill'),
    mixerLabel: ref('mixerLabel'),
    mixerValue: ref('mixerValue'),
    tankFill: ref('tankFill'),
    tankTop: ref('tankTop'),
    tankBottom: ref('tankBottom'),
    tankLabel: ref('tankLabel'),
    tankValue: ref('tankValue'),
    tankSub: ref('tankSub'),
    tankNote: ref('tankNote'),
    screenBars: [ref('screenBar0'), ref('screenBar1'), ref('screenBar2')],
    cabinetLed: ref('cabinetLed'),
    vehicles: ref<SVGGElement>('vehicles'),
    zapfHose: ref('zapfHose'),
    zapfHoseFlow: ref('zapfHoseFlow'),
    fillHose: ref('fillHose'),
    fillHoseFlow: ref('fillHoseFlow'),
    smClock: ref('smClock'),
    smRing: [0, 1, 2].map((i) => ref(`smRing${i}`)),
    smPct: [0, 1, 2].map((i) => ref(`smPct${i}`)),
    smVal: [0, 1, 2, 3].map((i) => ref(`smVal${i}`)),
    smSub: [0, 1, 2, 3].map((i) => ref(`smSub${i}`)),
    smLog: [0, 1, 2, 3].map((i) => ['t', 'v', 'w', 'a'].map((c) => ref(`smLog${i}${c}`))),
    smMsg: [0, 1, 2, 3].map((i) => ['t', 'x'].map((c) => ref(`smMsg${i}${c}`))),
  };

  const vehicles = new Map<number, VehicleHandle>();

  const setFlow = (el: Element, on: boolean, medium: Medium): void => {
    el.classList.toggle('is-on', on);
    el.classList.toggle('ps-flow--water', medium === 'water');
    el.classList.toggle('ps-flow--brine', medium === 'brine');
    el.classList.toggle('ps-flow--salt', medium === 'salt');
  };

  function addVehicle(v: Vehicle): VehicleHandle {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `ps-vehicle ps-vehicle--${v.kind}`);
    g.innerHTML = vehicleMarkup(v.kind);
    r.vehicles.appendChild(g);
    const load = g.querySelector<SVGRectElement>('[data-load]')!;
    const handle: VehicleHandle = {
      g,
      spokes: Array.from(g.querySelectorAll<SVGGElement>('[data-wheel]')).map((w) => ({
        el: w.querySelector<SVGGElement>('[data-spokes]')!,
        cx: Number(w.dataset.wheel),
        cy: Number(w.dataset.wheelCy),
        // Sichtbarer Radius: bei verkleinert gezeichneten Fahrzeugen kleiner.
        r: Number(w.querySelector('circle')!.getAttribute('r')) * Number(w.dataset.wheelScale ?? 1),
      })),
      load,
      loadTop: Number(load.dataset.loadTop),
      loadH: Number(load.dataset.loadH),
      beacon: g.querySelector<SVGElement>('[data-beacon]'),
    };
    vehicles.set(v.id, handle);
    return handle;
  }

  function renderVehicles(): void {
    const s = sim.state;
    const present = new Set(s.vehicles.map((v) => v.id));
    vehicles.forEach((h, id) => {
      if (!present.has(id)) {
        h.g.remove();
        vehicles.delete(id);
      }
    });
    for (const v of s.vehicles) {
      const h = vehicles.get(v.id) ?? addVehicle(v);
      const mirror = v.facing === 'right';
      attr(h.g, 'transform', `translate(${v.x.toFixed(1)} 0)${mirror ? ' scale(-1 1)' : ''}`);
      // Räder drehen sich mit der zurückgelegten Strecke, nicht mit der Zeit —
      // beim Bremsen werden sie langsamer, im Stand stehen sie. Gespiegelt
      // dreht die lokale Drehung andersherum, deshalb das Vorzeichen.
      const dir = mirror ? -1 : 1;
      for (const sp of h.spokes) {
        const deg = ((dir * v.x) / sp.r) * (180 / Math.PI);
        attr(sp.el, 'transform', `rotate(${deg.toFixed(1)} ${sp.cx} ${sp.cy})`);
      }
      const frac = Math.max(0, Math.min(1, v.load / v.capacity));
      attr(h.load, 'y', (h.loadTop + h.loadH * (1 - frac)).toFixed(1));
      attr(h.load, 'height', (h.loadH * frac).toFixed(1));
      h.beacon?.classList.toggle('is-on', v.beacon);
    }
  }

  function renderHoses(): void {
    const s = sim.state;
    const eq = s.eq;
    const { x: zx, w: zw } = LAYOUT.zapfstelle;

    const sprayer = s.vehicles.find((v) => v.kind === 'sprayer');
    if (eq.hose > 0 && sprayer) {
      const sx = zx + zw + 10;
      const sy = 488;
      const ex = sprayer.x + COUPLING.sprayer.x;
      const ey = COUPLING.sprayer.y;
      const d = `M${sx} ${sy} C${sx + 34} ${sy} ${ex} ${ey - 60} ${ex} ${ey}`;
      attr(r.zapfHose, 'd', d);
      attr(r.zapfHose, 'stroke-dasharray', `${eq.hose.toFixed(3)} 1`);
      attr(r.zapfHoseFlow, 'd', d);
    } else {
      attr(r.zapfHose, 'd', '');
      attr(r.zapfHoseFlow, 'd', '');
    }
    setFlow(r.zapfHoseFlow, eq.p2 && eq.vZ && eq.hose >= 1, 'brine');

    const tanker = s.vehicles.find((v) => v.kind === 'tanker');
    if (eq.fillHose > 0 && tanker) {
      const ex = tanker.x + COUPLING.tanker.x;
      const ey = COUPLING.tanker.y;
      // Vom Fahrzeug zur Befüllleitung — in Fließrichtung gezeichnet.
      const d = `M${ex} ${ey} C${ex} ${ey - 30} 110 552 110 513`;
      attr(r.fillHose, 'd', d);
      attr(r.fillHose, 'stroke-dasharray', `${eq.fillHose.toFixed(3)} 1`);
      attr(r.fillHoseFlow, 'd', d);
    } else {
      attr(r.fillHose, 'd', '');
      attr(r.fillHoseFlow, 'd', '');
    }
    setFlow(r.fillHoseFlow, eq.blower && eq.fillHose >= 1, 'salt');
  }

  function renderSilo(): void {
    const s = sim.state;
    const eq = s.eq;
    const { cx, r: rad, coneBottom } = LAYOUT.silo;
    const frac = s.silo / PLANT.silo.capacity;
    if (frac <= 0.0005) {
      attr(r.siloSalt, 'd', '');
    } else {
      const y = siloLevelY(frac);
      // Schüttkegel beim Befüllen und im Ruhezustand, Trichter beim Abziehen.
      const rise = eq.gate ? -12 : eq.blower ? 14 : 7;
      const L = cx - rad - 4;
      const Rr = cx + rad + 4;
      attr(
        r.siloSalt,
        'd',
        `M${L} ${(y + rise / 2).toFixed(1)} L${cx} ${(y - rise / 2).toFixed(1)} L${Rr} ${(y + rise / 2).toFixed(1)} V${coneBottom + 2} H${L} Z`,
      );
    }
    text(r.siloValue, `${fmt0(s.silo)} t`);
    text(r.siloSub, `${fmt0(frac * 100)} % · ${PLANT.silo.capacity} t`);

    r.gate.classList.toggle('is-open', eq.gate);

    // Der Rüttler im Schieber läuft, solange Salz durch den Schieber geht:
    // bei der Entnahme und wenn die Dosierschnecke fördert.
    r.vibrator.classList.toggle('is-on', eq.gate || eq.screw);
    // Salzstrahl vom Schieber durch das Schlauchstück bis auf den Streuaufbau.
    const streamTop = coneBottom + GATE.h;
    const hopperTop = LAYOUT.road.wheel - WHEEL_R - 92;
    attr(r.streamClip, 'height', eq.gate ? (hopperTop - streamTop).toFixed(1) : '0');
    r.stream.classList.toggle('is-on', eq.gate);

    attr(r.outRed, 'fill', eq.lightOut === 'red' ? C.red : C.lightOff);
    attr(r.outGreen, 'fill', eq.lightOut === 'green' ? C.green : C.lightOff);
    attr(r.inRed, 'fill', eq.lightIn === 'red' ? C.red : C.lightOff);
    attr(r.inGreen, 'fill', eq.lightIn === 'green' ? C.green : C.lightOff);

    // RFID-Leser: Wellen beim Lesen, Kupfer-Leuchte nach der Freigabe.
    const rfid = (box: Element, lbl: Element, st: typeof eq.rfidSilo): void => {
      box.classList.toggle('is-reading', st === 'reading');
      box.classList.toggle('is-ok', st === 'ok');
      text(lbl, st === 'reading' ? 'LIEST …' : st === 'ok' ? 'FREIGABE' : 'RFID');
    };
    rfid(r.rfidSilo, r.rfidSiloLabel, eq.rfidSilo);
    rfid(r.rfidZapf, r.rfidZapfLabel, eq.rfidZapf);
  }

  function renderMixerAndTank(): void {
    const s = sim.state;
    const eq = s.eq;
    const target = PLANT.brine.concentration;

    r.screw.classList.toggle('is-on', eq.screw);
    r.blades.forEach((b) => b.classList.toggle('is-on', eq.agitator));
    const { y: my, h: mh } = LAYOUT.mixer;
    const inner = mh;
    const mfrac = Math.min(1, s.mixer.m3 / PLANT.mixer.capacity);
    const mixerTop = my + inner * (1 - mfrac);
    attr(r.mixerFill, 'y', mixerTop.toFixed(1));
    attr(r.mixerFill, 'height', (inner * mfrac).toFixed(1));
    attr(r.mixerFill, 'fill', mix(C.water, C.brine, Math.min(1, s.mixer.conc / target)));
    text(r.mixerValue, s.mixer.m3 > 0.05 ? `${fmt1(s.mixer.conc)} % Salz` : 'leer');
    submerge(r.mixerLabel, mixerTop);
    submerge(r.mixerValue, mixerTop);

    const t = s.tank;
    const { y, h } = LAYOUT.tank;
    const usable = h - 18;
    const hl = usable * Math.min(1, t.m3 / PLANT.tank.capacity);
    const top = y + h - hl;
    const band = hl * t.strat * 0.35;
    attr(r.tankFill, 'y', top.toFixed(1));
    attr(r.tankFill, 'height', hl.toFixed(1));
    attr(r.tankTop, 'y', top.toFixed(1));
    attr(r.tankTop, 'height', band.toFixed(1));
    attr(r.tankBottom, 'y', (y + h - band).toFixed(1));
    attr(r.tankBottom, 'height', band.toFixed(1));
    text(r.tankValue, `${fmt1(t.m3)} m³`);
    text(r.tankSub, t.m3 < 0.05 ? 'leer' : `${fmt1(t.conc)} % Salz`);
    text(r.tankNote, t.m3 >= 0.05 && t.strat > 0.25 ? 'geschichtet' : '');
    for (const el of [r.tankLabel, r.tankValue, r.tankSub, r.tankNote]) submerge(el, top);

    // Kleine Balken im Touchscreen des Schaltschranks: Silo, Aufbereiter, Tank.
    const bars = [
      s.silo / PLANT.silo.capacity,
      s.mixer.m3 / PLANT.mixer.capacity,
      t.m3 / PLANT.tank.capacity,
    ];
    const barBottom = LAYOUT.cabinet.y + 46;
    bars.forEach((f, k) => {
      const hh = 32 * Math.max(0, Math.min(1, f));
      attr(r.screenBars[k], 'y', (barBottom - hh).toFixed(1));
      attr(r.screenBars[k], 'height', hh.toFixed(1));
    });
    const busy = eq.p3 || eq.screw || eq.p1 || eq.p2 || eq.gate || eq.blower;
    attr(r.cabinetLed, 'fill', busy ? C.copper : C.mist);
  }

  function renderPipes(): void {
    const s = sim.state;
    const eq = s.eq;
    const mixMedium: Medium = s.mixer.conc > 3 ? 'brine' : 'water';
    const f = (id: FlowId, on: boolean, medium: Medium = 'brine'): void => setFlow(flows.get(id)!, on, medium);

    const p1Fill = eq.p1 && eq.vM && eq.vF;
    const p2Run = eq.p2 && eq.vT;
    const ret = p2Run && eq.vR;
    const water = eq.p3 && eq.vW;
    f('waterIn', water, 'water');
    f('waterOut', water, 'water');
    f('mixIn', p1Fill, mixMedium);
    f('p1Up', p1Fill, mixMedium);
    f('fillUp', p1Fill || ret);
    f('fillLine', p1Fill || ret);
    f('tankIn', p2Run);
    f('p2Down', p2Run);
    f('ret', ret);
    f('zapf', p2Run && eq.vZ);
    f('drain', p2Run && eq.vD);
    f('fill', eq.blower, 'salt');

    const open: Record<ValveId, boolean> = {
      vW: eq.vW,
      vM: eq.vM,
      vF: eq.vF,
      vT: eq.vT,
      vR: eq.vR,
      vZ: eq.vZ,
      vD: eq.vD,
    };
    valves.forEach((el, id) => el.classList.toggle('is-open', open[id]));
    pumps.p1.classList.toggle('is-on', eq.p1);
    pumps.p2.classList.toggle('is-on', eq.p2);
    pumps.p3.classList.toggle('is-on', eq.p3);
  }

  /** SalzManager-Bildschirm: Bestände als Ringe, Protokoll und Meldungen. */
  function renderScreen(): void {
    const s = sim.state;
    text(r.smClock, `Heute ${clockText(s.clock)}`);
    const t = s.tank;
    const m = s.mixer;
    const fracs = [
      s.silo / PLANT.silo.capacity,
      m.m3 > 0.05 ? m.conc / PLANT.brine.concentration : 0,
      t.m3 / PLANT.tank.capacity,
    ];
    fracs.forEach((f, i) => {
      const pct = Math.max(0, Math.min(100, f * 100));
      attr(r.smRing[i], 'stroke-dasharray', `${pct.toFixed(1)} 100`);
      text(r.smPct[i], `${fmt0(pct)} %`);
    });
    text(r.smVal[0], `${fmt1(s.silo)} t`);
    text(r.smSub[0], `von ${PLANT.silo.capacity} t`);
    text(r.smVal[1], m.m3 > 0.05 ? `${fmt2(density(m.conc))} kg/l` : 'leer');
    text(r.smSub[1], m.m3 > 0.05 ? `${fmt1(m.conc)} % · ${fmt1(m.m3)} m³` : `Soll ${fmt2(PLANT.brine.density)} kg/l`);
    text(r.smVal[2], `${fmt1(t.m3)} m³`);
    text(r.smSub[2], t.m3 < 0.05 ? 'leer' : `${fmt1(t.conc)} % · ${t.strat > 0.25 ? 'geschichtet' : 'homogen'}`);
    text(r.smVal[3], `${fmt1(s.totals.salt)} t Salz`);
    text(r.smSub[3], `${fmt1(s.totals.brine)} m³ Sole`);

    r.smLog.forEach((cells, i) => {
      const e = s.log[i];
      if (!e) {
        cells.forEach((c, k) => text(c, i === 0 && k === 1 ? 'Noch keine Entnahme' : ''));
        return;
      }
      text(cells[0], e.time);
      text(cells[1], clip(e.vehicle, 22));
      text(cells[2], e.what);
      text(cells[3], e.amount);
    });
    r.smMsg.forEach((cells, i) => {
      const msg = s.messages[i];
      text(cells[0], msg ? msg.time : '');
      text(cells[1], msg ? clip(msg.text, 52) : '');
      cells[1].classList.toggle('is-warn', !!msg?.warn);
    });
  }

  return {
    render() {
      renderSilo();
      renderMixerAndTank();
      renderPipes();
      renderVehicles();
      renderHoses();
      renderScreen();
    },
  };
}
