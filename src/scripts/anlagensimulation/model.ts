// Zustand der Anlage und der Taktgeber, der die Abläufe vorantreibt.
//
// Kein DOM in dieser Datei: Das Modell weiß nichts von der Zeichnung. Die
// Ansicht (view.ts) liest den Zustand in jedem Bild und stellt ihn dar.
// Rohrströmungen werden deshalb nicht gespeichert, sondern dort aus den
// Schaltzuständen von Pumpen und Ventilen abgeleitet — so kann nie eine
// Leitung „fließen“, deren Ventil zu ist.

import { PLANT, type AreaId } from '../../content/anlagensimulation';

export type VehicleKind = 'sprayer' | 'spreader' | 'tanker';

export interface Vehicle {
  id: number;
  kind: VehicleKind;
  /** Position der Fahrzeugreferenz (Mitte der Ladefläche) in viewBox-x. */
  x: number;
  /** Ladung: m³ Sole bzw. t Salz. */
  load: number;
  capacity: number;
  /** Nummer des RFID-Chips im Fahrzeug. */
  chip: string;
  /** Fahrtrichtung: Die Zeichnung zeigt nach links, 'right' wird gespiegelt. */
  facing: 'left' | 'right';
  /** Rundumleuchte an. */
  beacon: boolean;
  label: string;
}

export interface Tank {
  m3: number;
  /** Konzentration in Prozent. */
  conc: number;
  /** Schichtung 0 (homogen) … 1 (deutlich geschichtet). */
  strat: number;
}

export type Rfid = 'off' | 'reading' | 'ok';

export interface Equipment {
  /** P3: Wasserpumpe, fördert das Lösewasser von oben in den Aufbereiter. */
  p3: boolean;
  screw: boolean;
  agitator: boolean;
  /** P1: Aufbereiter → Soletank. */
  p1: boolean;
  /** P2: Soletank → Zapfstelle, zurück in den Tank (Umwälzen) oder Ablass. */
  p2: boolean;
  /** Ventile, alle im Pumpen- und Ventilkasten. */
  vW: boolean;
  vM: boolean;
  vF: boolean;
  vT: boolean;
  vR: boolean;
  vZ: boolean;
  vD: boolean;
  /** Schieber am Silo-Auslauf. */
  gate: boolean;
  /** Zapfschlauch angeschlossen, 0 … 1. */
  hose: number;
  /** Befüllschlauch Silozug angeschlossen, 0 … 1. */
  fillHose: number;
  /** Silozug bläst ein. */
  blower: boolean;
  lightOut: 'red' | 'green';
  lightIn: 'red' | 'green';
  /** RFID-Leser je Station: liest gerade bzw. hat freigegeben. */
  rfidSilo: Rfid;
  rfidZapf: Rfid;
}

export interface LogEntry {
  time: string;
  vehicle: string;
  what: string;
  amount: string;
}

export interface Message {
  time: string;
  text: string;
  warn: boolean;
}

export interface PlantState {
  /** Anlagenzeit in Minuten nach Mitternacht. */
  clock: number;
  silo: number;
  mixer: { m3: number; conc: number };
  tank: Tank;
  /** Entnahmen seit Start (Anzeige im SalzManager). */
  totals: { salt: number; brine: number };
  eq: Equipment;
  vehicles: Vehicle[];
  log: LogEntry[];
  messages: Message[];
}

export function initialState(): PlantState {
  return {
    clock: PLANT.startClock,
    silo: PLANT.silo.initial,
    mixer: { m3: 0, conc: 0 },
    tank: { m3: PLANT.tank.initial, conc: PLANT.brine.concentration, strat: 0.55 },
    totals: { salt: 0, brine: 0 },
    eq: {
      p3: false,
      screw: false,
      agitator: false,
      p1: false,
      p2: false,
      vW: false,
      vM: false,
      vF: false,
      vT: false,
      vR: false,
      vZ: false,
      vD: false,
      gate: false,
      hose: 0,
      fillHose: 0,
      blower: false,
      lightOut: 'red',
      lightIn: 'red',
      rfidSilo: 'off',
      rfidZapf: 'off',
    },
    vehicles: [],
    log: [],
    messages: [],
  };
}

export const clockText = (minutes: number): string => {
  const m = Math.floor(minutes) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

// ── Taktgeber ────────────────────────────────────────────────────────────────

/** Wird geworfen, wenn ein Ablauf abgebrochen wird (Stopp, Zurücksetzen). */
export class Cancelled extends Error {
  constructor() {
    super('Ablauf abgebrochen');
  }
}

export interface Token {
  cancelled: boolean;
}

interface Waiter {
  token: Token;
  /** Wird je Bild aufgerufen; true = erledigt. */
  step: (dt: number, plantDt: number) => boolean;
  resolve: () => void;
  reject: (e: Error) => void;
}

export class Sim {
  state: PlantState = initialState();
  /** Tempo-Faktor der Bedienung (1×, 2×, 4×). */
  speed = 1;
  /** Bei „Bewegung reduzieren“ fahren Fahrzeuge nicht, sie stehen sofort da. */
  reducedMotion = false;
  private waiters: Waiter[] = [];

  /** Ein Bild weiter. `realDt` in Sekunden, bereits gedeckelt. */
  tick(realDt: number): void {
    const dt = realDt * this.speed;
    const plantDt = dt * PLANT.timeScale;
    const s = this.state;
    s.clock += plantDt / 60;

    // Stehende Sole schichtet sich langsam; Umwälzen hebt das auf (siehe
    // processes.ts). Ein leerer Tank hat keine Schichtung.
    const t = s.tank;
    const circulating = s.eq.p2 && s.eq.vT && s.eq.vR;
    if (t.m3 < 0.05) t.strat = 0;
    else if (!circulating) t.strat = Math.min(1, t.strat + plantDt / PLANT.tank.stratifyTime);

    // Rückwärts, damit erledigte Einträge gefahrlos entfernt werden können.
    for (let i = this.waiters.length - 1; i >= 0; i--) {
      const w = this.waiters[i];
      if (w.token.cancelled) {
        this.waiters.splice(i, 1);
        w.reject(new Cancelled());
        continue;
      }
      let done = false;
      try {
        done = w.step(dt, plantDt);
      } catch (e) {
        this.waiters.splice(i, 1);
        w.reject(e as Error);
        continue;
      }
      if (done) {
        this.waiters.splice(i, 1);
        w.resolve();
      }
    }
  }

  /** Bricht alle wartenden Schritte eines Ablaufs beim nächsten Bild ab. */
  schedule(token: Token, step: Waiter['step']): Promise<void> {
    if (token.cancelled) return Promise.reject(new Cancelled());
    return new Promise((resolve, reject) => {
      this.waiters.push({ token, step, resolve, reject });
    });
  }

  /** Alle Abläufe sofort verwerfen (Zurücksetzen). */
  rejectAll(): void {
    const all = this.waiters;
    this.waiters = [];
    all.forEach((w) => w.reject(new Cancelled()));
  }

  message(text: string, warn = false): void {
    this.state.messages.unshift({ time: clockText(this.state.clock), text, warn });
    this.state.messages.length = Math.min(this.state.messages.length, 30);
  }

  record(entry: Omit<LogEntry, 'time'>): void {
    this.state.log.unshift({ time: clockText(this.state.clock), ...entry });
    this.state.log.length = Math.min(this.state.log.length, 30);
  }
}

/** Werkzeuge, mit denen ein Ablauf Schritt für Schritt geschrieben wird. */
export class Ctx {
  constructor(
    readonly sim: Sim,
    readonly token: Token,
    private readonly setStep: (text: string, area: AreaId | null) => void,
  ) {}

  get state(): PlantState {
    return this.sim.state;
  }

  /** Text des aktuellen Schritts, wird in der Bedienleiste angezeigt.
   *  `area`: Teil der Anlage, auf den sich der Schritt beschränkt — dorthin
   *  zoomt das Handy; ohne Angabe (Fahrten, Dauerbetrieb über mehrere Teile)
   *  bleibt die ganze Anlage im Bild. */
  step(text: string, area: AreaId | null = null): void {
    this.setStep(text, area);
  }

  /** Wartet `seconds` echte Sekunden (Tempo-Faktor eingerechnet). */
  wait(seconds: number): Promise<void> {
    let t = 0;
    return this.sim.schedule(this.token, (dt) => (t += dt) >= seconds);
  }

  /** Läuft je Bild, bis `update` true liefert. `plantDt` in Anlagensekunden. */
  run(update: (plantDt: number, dt: number) => boolean | void): Promise<void> {
    return this.sim.schedule(this.token, (dt, plantDt) => update(plantDt, dt) === true);
  }

  /** Weicher Übergang über `seconds` echte Sekunden, `apply` bekommt 0 … 1. */
  tween(seconds: number, apply: (p: number) => void): Promise<void> {
    if (seconds <= 0) {
      apply(1);
      return Promise.resolve();
    }
    let t = 0;
    return this.sim.schedule(this.token, (dt) => {
      t = Math.min(seconds, t + dt);
      apply(t / seconds);
      return t >= seconds;
    });
  }

  /** Fahrzeug mit Anfahren und Bremsen an `toX` fahren. */
  drive(v: Vehicle, toX: number): Promise<void> {
    const from = v.x;
    const dist = Math.abs(toX - from);
    v.beacon = true;
    if (this.sim.reducedMotion) {
      v.x = toX;
      return this.wait(0.3);
    }
    // Mindestdauer, damit auch kurze Wege sichtbar angefahren werden.
    const seconds = Math.max(1.2, dist / PLANT.vehicles.speed + 0.8);
    return this.tween(seconds, (p) => {
      v.x = from + (toX - from) * easeInOut(p);
    });
  }
}

/** Sanftes Anfahren und Bremsen. */
export const easeInOut = (p: number): number =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
