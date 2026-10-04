// Die Abläufe der Anlage, jeder als Folge von Schritten geschrieben.
//
// Jeder Ablauf belegt Betriebsmittel (Pumpe, Zufahrt …). Zwei Abläufe, die
// dasselbe Betriebsmittel brauchen, können nicht gleichzeitig laufen; alles
// andere darf parallel laufen — z. B. Sole herstellen, während ein Streu-LKW
// am Silo Salz holt.
//
// Pumpen und Ventile sitzen alle im Pumpen- und Ventilkasten:
//   P1  Aufbereiter → Soletank           (Ventile vM, vF)
//   P2  Soletank → Zapfstelle            (vT, vZ)
//       Soletank → Soletank (Umwälzen)   (vT, vR)
//       Soletank → Ablass                (vT, vD)
//   P3  Wasser → Aufbereiter (von oben)  (vW)
//
// Aufräumen gehört in `finally`: Wird ein Ablauf gestoppt oder die Anlage
// zurückgesetzt, müssen Pumpen und Ventile wieder in Ruhestellung gehen.

import { LAYOUT, PLANT } from '../../content/anlagensimulation';
import { fmt1 } from './format';
import { Cancelled, Ctx, Sim, initialState, type PlantState, type Vehicle, type VehicleKind } from './model';

export type ProcessId = 'produce' | 'circulate' | 'drain' | 'brineOut' | 'saltOut' | 'saltIn';
type Resource = 'p1' | 'p2' | 'road' | 'outlet' | 'inlet';

const RESOURCE_NAME: Record<Resource, string> = {
  p1: 'Pumpe P1',
  p2: 'Pumpe P2',
  road: 'Zufahrt',
  outlet: 'Siloauslauf',
  inlet: 'Befüllleitung',
};

export interface ProcessDef {
  id: ProcessId;
  title: string;
  /** Kurzbeschreibung für die Ablaufliste. */
  text: string;
  resources: Resource[];
  /** Lässt sich der Ablauf per Knopf beenden? Fahrzeugabläufe laufen durch. */
  stoppable: boolean;
  /** Grund, warum der Ablauf gerade nicht möglich ist, sonst null. */
  precondition(s: PlantState): string | null;
  run(ctx: Ctx): Promise<void>;
}

const perSecond = (perHour: number, plantDt: number): number => (perHour / 3600) * plantDt;
const tankLimit = (): number => PLANT.tank.capacity * PLANT.tank.fullAt;
const tankFull = (s: PlantState): boolean => s.tank.m3 >= tankLimit() - 1e-6;

let vehicleSerial = 0;
const FLEET: Record<VehicleKind, Array<[number, string]>> = {
  sprayer: [
    [12, '0412'],
    [14, '0414'],
    [21, '0421'],
  ],
  spreader: [
    [7, '0107'],
    [9, '0109'],
    [16, '0116'],
  ],
  tanker: [
    [3, '0903'],
    [5, '0905'],
  ],
};

function spawn(
  s: PlantState,
  kind: VehicleKind,
  load: number,
  capacity: number,
  facing: Vehicle['facing'] = 'left',
): Vehicle {
  vehicleSerial++;
  const list = FLEET[kind];
  const [nr, chip] = list[vehicleSerial % list.length];
  const label =
    kind === 'sprayer' ? `Sprühfahrzeug ${nr}` : kind === 'spreader' ? `Streu-LKW ${nr}` : `Silozug ${nr}`;
  // Nach links fahrende Fahrzeuge kommen von rechts, nach rechts fahrende von links.
  const x = facing === 'left' ? LAYOUT.width + 260 : LAYOUT.view.x - 420;
  const v: Vehicle = { id: vehicleSerial, kind, x, load, capacity, chip, facing, beacon: true, label };
  s.vehicles.push(v);
  return v;
}

const removeVehicle = (s: PlantState, v: Vehicle): void => {
  s.vehicles = s.vehicles.filter((o) => o !== v);
};

/** Ausfahrt links bzw. rechts aus dem Bild. */
const EXIT_X = -320;
const EXIT_RIGHT = LAYOUT.width + 420;

/** RFID-Anmeldung, an Silo und Zapfstelle gleich: Leser liest, dann Freigabe. */
async function readChip(ctx: Ctx, v: Vehicle, station: 'rfidSilo' | 'rfidZapf'): Promise<void> {
  const eq = ctx.state.eq;
  ctx.step(`RFID-Leser liest Chip ${v.chip}`);
  eq[station] = 'reading';
  await ctx.wait(1.1);
  eq[station] = 'ok';
  ctx.sim.message(`RFID-Chip ${v.chip} gelesen – ${v.label} freigegeben`);
}

class OutOfSalt extends Error {}

export const PROCESSES: ProcessDef[] = [
  {
    id: 'produce',
    title: 'Sole herstellen',
    text: 'Die Dosierschnecke fördert Trockensalz vom Silo in den Aufbereiter, die Wasserpumpe P3 füllt das Wasser von oben zu, das Rührwerk löst. Bei 1,17 kg/l fördert P1 die Sole in den Soletank.',
    resources: ['p1'],
    stoppable: true,
    precondition: (s) => {
      if (s.silo < 1) return 'Silo leer – erst Salz anliefern';
      if (tankFull(s)) return 'Soletank ist voll';
      return null;
    },
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      const { workLevel, waterRate, dissolveTime, productionRate } = PLANT.mixer;
      const target = PLANT.brine.concentration;
      try {
        if (s.mixer.m3 < workLevel) {
          ctx.step('P3 pumpt Wasser von oben in den Aufbereiter');
          eq.vW = true;
          eq.p3 = true;
          eq.agitator = true;
          await ctx.run((pdt) => {
            const before = s.mixer.m3;
            s.mixer.m3 = Math.min(workLevel, before + perSecond(waterRate, pdt));
            // Frisches Wasser verdünnt, was noch im Aufbereiter steht.
            s.mixer.conc = before > 0 ? (s.mixer.conc * before) / s.mixer.m3 : 0;
            return s.mixer.m3 >= workLevel;
          });
          eq.p3 = false;
          eq.vW = false;
        }

        if (s.mixer.conc < target - 0.05) {
          ctx.step('Dosierschnecke fördert Salz, Rührwerk löst es');
          eq.screw = true;
          eq.agitator = true;
          await ctx.run((pdt) => {
            const c = Math.min(target, s.mixer.conc + (target * pdt) / dissolveTime);
            const salt = ((c - s.mixer.conc) / target) * workLevel * PLANT.brine.saltPerM3;
            if (s.silo < salt) throw new OutOfSalt();
            s.silo -= salt;
            s.mixer.conc = c;
            return c >= target;
          });
          ctx.sim.message('Dichte 1,17 kg/l erreicht – Förderung in den Soletank');
        }

        // Dauerbetrieb: Salz und Wasser laufen nach, P1 fördert dieselbe Menge ab.
        ctx.step('P1 fördert Sole in den Soletank');
        eq.vW = true;
        eq.p3 = true;
        eq.screw = true;
        eq.agitator = true;
        eq.vM = true;
        eq.vF = true;
        eq.p1 = true;
        let full = false as boolean;
        await ctx.run((pdt) => {
          const t = s.tank;
          const vol = Math.min(perSecond(productionRate / 1000, pdt), tankLimit() - t.m3);
          const salt = vol * PLANT.brine.saltPerM3;
          if (s.silo < salt) throw new OutOfSalt();
          s.silo -= salt;
          t.conc = (t.conc * t.m3 + target * vol) / (t.m3 + vol);
          t.m3 += vol;
          // Frisch eingeleitete Sole ist gut durchmischt.
          t.strat = Math.max(0, t.strat - (vol / Math.max(t.m3, 1)) * 0.5);
          full = tankFull(s);
          return full;
        });
        if (full) ctx.sim.message('Soletank voll – Produktion automatisch beendet');
      } catch (e) {
        if (e instanceof OutOfSalt) ctx.sim.message('Silo leer – Produktion angehalten', true);
        else throw e;
      } finally {
        eq.vW = false;
        eq.p3 = false;
        eq.screw = false;
        eq.agitator = false;
        eq.vM = false;
        eq.vF = false;
        eq.p1 = false;
      }
    },
  },

  {
    id: 'circulate',
    title: 'Sole umwälzen',
    text: 'P2 saugt am Tankboden an und fördert über die Füllleitung zurück in den Tank. Hält die Konzentration im ganzen Tank gleich.',
    resources: ['p2'],
    stoppable: true,
    precondition: (s) => (s.tank.m3 < 2 ? 'Soletank ist zu leer zum Umwälzen' : null),
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      const t = s.tank;
      try {
        ctx.step('P2 wälzt den Soletank um');
        eq.vT = true;
        eq.vR = true;
        eq.p2 = true;
        let elapsed = 0;
        await ctx.run((pdt) => {
          elapsed += pdt;
          t.strat = Math.max(0, t.strat - pdt / PLANT.tank.mixTime);
          return elapsed >= PLANT.tank.mixTime && t.strat <= 0;
        });
        ctx.sim.message(`Soletank umgewälzt – ${fmt1(t.conc)} % im ganzen Tank`);
      } finally {
        eq.p2 = false;
        eq.vT = false;
        eq.vR = false;
      }
    },
  },

  {
    id: 'drain',
    title: 'Soletank entleeren',
    text: 'Tankventil und Ablassventil öffnen, P2 pumpt den Tank über den Ablass leer – etwa vor Reinigung oder Wartung.',
    resources: ['p2'],
    stoppable: true,
    precondition: (s) => (s.tank.m3 < 0.05 ? 'Soletank ist bereits leer' : null),
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      const t = s.tank;
      try {
        ctx.step('P2 pumpt den Soletank über den Ablass ab');
        eq.vT = true;
        eq.vD = true;
        eq.p2 = true;
        await ctx.run((pdt) => {
          t.m3 = Math.max(0, t.m3 - perSecond(PLANT.tank.drainRate, pdt));
          return t.m3 <= 0;
        });
        t.strat = 0;
        ctx.sim.message('Soletank entleert');
      } finally {
        eq.p2 = false;
        eq.vT = false;
        eq.vD = false;
      }
    },
  },

  {
    id: 'brineOut',
    title: 'Sole entnehmen',
    text: 'Das Sprühfahrzeug meldet sich mit seinem RFID-Chip an, der Überfüllschutzstecker wird gesteckt, P2 füllt den Fahrzeugtank. Der SalzManager dokumentiert die Menge.',
    resources: ['road', 'p2'],
    stoppable: false,
    precondition: (s) => (s.tank.m3 < 0.5 ? 'Soletank ist leer' : null),
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      const t = s.tank;
      const v = spawn(s, 'sprayer', 0.6, PLANT.vehicles.brineTank);
      try {
        ctx.step(`${v.label} fährt zur Zapfstelle`);
        await ctx.drive(v, LAYOUT.stops.brineInlet);
        await readChip(ctx, v, 'rfidZapf');
        ctx.step('Überfüllschutzstecker wird gesteckt');
        await ctx.tween(1, (p) => (eq.hose = p));
        ctx.step('P2 füllt den Fahrzeugtank');
        eq.vT = true;
        eq.vZ = true;
        eq.p2 = true;
        let taken = 0;
        let stop = 'full' as 'full' | 'empty';
        await ctx.run((pdt) => {
          const vol = Math.min(perSecond(PLANT.dispense.rate, pdt), t.m3, v.capacity - v.load);
          t.m3 -= vol;
          v.load += vol;
          taken += vol;
          if (v.load >= v.capacity - 1e-6) return true;
          if (t.m3 <= 1e-6) {
            stop = 'empty';
            return true;
          }
          return false;
        });
        eq.p2 = false;
        eq.vT = false;
        eq.vZ = false;
        s.totals.brine += taken;
        ctx.sim.message(
          stop === 'full'
            ? `Überfüllschutz: Fahrzeugtank voll – ${fmt1(taken)} m³ abgegeben`
            : `Soletank leer – ${fmt1(taken)} m³ abgegeben`,
          stop === 'empty',
        );
        ctx.sim.record({ vehicle: v.label, what: 'Sole', amount: `${fmt1(taken)} m³` });
        ctx.step('Stecker wird gezogen');
        await ctx.tween(0.8, (p) => (eq.hose = 1 - p));
        eq.rfidZapf = 'off';
        ctx.step(`${v.label} fährt ab`);
        await ctx.drive(v, EXIT_X);
      } finally {
        eq.p2 = false;
        eq.vT = false;
        eq.vZ = false;
        eq.hose = 0;
        eq.rfidZapf = 'off';
        removeVehicle(s, v);
      }
    },
  },

  {
    id: 'saltOut',
    title: 'Salz entnehmen',
    text: 'Der Streu-LKW fährt unter das Silo und meldet sich mit seinem RFID-Chip an. Die Ampel gibt frei, der Schieber öffnet, der Rüttler hält das Salz in Bewegung, durch das Schlauchstück fällt es in den Streuer. Die Verwiegung misst auf ± 200 kg genau.',
    resources: ['road', 'outlet'],
    stoppable: false,
    precondition: (s) => (s.silo < 1 ? 'Silo leer – erst Salz anliefern' : null),
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      const v = spawn(s, 'spreader', 0.4, PLANT.vehicles.spreaderLoad);
      try {
        ctx.step(`${v.label} fährt unter das Silo`);
        await ctx.drive(v, LAYOUT.stops.siloOutlet);
        await readChip(ctx, v, 'rfidSilo');
        eq.lightOut = 'green';
        ctx.step('Ampel grün – Freigabe');
        await ctx.wait(0.6);
        ctx.step('Schieber offen, Rüttler läuft – Salz fällt in den Streuer');
        eq.gate = true;
        const siloBefore = s.silo;
        await ctx.run((pdt) => {
          const m = Math.min(perSecond(PLANT.silo.dischargeRate, pdt), s.silo, v.capacity - v.load);
          s.silo -= m;
          v.load += m;
          return v.load >= v.capacity - 1e-6 || s.silo <= 1e-6;
        });
        eq.gate = false;
        const taken = siloBefore - s.silo;
        s.totals.salt += taken;
        ctx.sim.message(`Verwiegung: ${fmt1(taken)} t entnommen (± 0,2 t)`);
        ctx.sim.record({ vehicle: v.label, what: 'Salz', amount: `${fmt1(taken)} t` });
        eq.lightOut = 'red';
        eq.rfidSilo = 'off';
        ctx.step(`${v.label} fährt ab`);
        await ctx.drive(v, EXIT_X);
      } finally {
        eq.gate = false;
        eq.lightOut = 'red';
        eq.rfidSilo = 'off';
        removeVehicle(s, v);
      }
    },
  },

  {
    id: 'saltIn',
    title: 'Salz anliefern',
    text: 'Der Silozug kommt von links, kuppelt an der Befüllleitung an und bläst das Salz pneumatisch ein. Die Überfüllsicherung stoppt bei vollem Silo.',
    resources: ['road', 'inlet'],
    stoppable: false,
    precondition: (s) =>
      PLANT.silo.capacity - s.silo < 10 ? 'Silo fast voll – keine Lieferung möglich' : null,
    async run(ctx) {
      const s = ctx.state;
      const eq = s.eq;
      // Die Befüllleitung liegt links am Silo: Der Silozug kommt von links,
      // hält mit dem Heck an der Leitung und fährt nach rechts weiter.
      const v = spawn(s, 'tanker', PLANT.vehicles.tankerLoad, PLANT.vehicles.tankerLoad, 'right');
      try {
        ctx.step(`${v.label} fährt an die Befüllleitung`);
        await ctx.drive(v, LAYOUT.stops.fillPipe);
        eq.lightIn = 'green';
        ctx.sim.message(`${v.label}: Lieferung angemeldet – Ampel Befüllung grün`);
        ctx.step('Befüllschlauch wird angekuppelt');
        await ctx.tween(1, (p) => (eq.fillHose = p));
        ctx.step('Salz wird pneumatisch eingeblasen');
        eq.blower = true;
        let given = 0;
        let full = false as boolean;
        await ctx.run((pdt) => {
          const m = Math.min(perSecond(PLANT.silo.fillRate, pdt), v.load, PLANT.silo.capacity - s.silo);
          s.silo += m;
          v.load -= m;
          given += m;
          if (s.silo >= PLANT.silo.capacity - 1e-6) full = true;
          return full || v.load <= 1e-6;
        });
        eq.blower = false;
        ctx.sim.message(
          full
            ? `Überfüllsicherung: Silo voll – ${fmt1(given)} t eingeblasen`
            : `Lieferung abgeschlossen – ${fmt1(given)} t eingeblasen`,
        );
        ctx.sim.record({ vehicle: v.label, what: 'Lieferung', amount: `+${fmt1(given)} t` });
        ctx.step('Schlauch wird abgekuppelt');
        await ctx.tween(0.8, (p) => (eq.fillHose = 1 - p));
        eq.lightIn = 'red';
        ctx.step(`${v.label} fährt ab`);
        await ctx.drive(v, EXIT_RIGHT);
      } finally {
        eq.blower = false;
        eq.fillHose = 0;
        eq.lightIn = 'red';
        removeVehicle(s, v);
      }
    },
  },
];

// ── Steuerung ────────────────────────────────────────────────────────────────

interface Running {
  token: { cancelled: boolean };
  step: string;
}

export class Controller {
  readonly active = new Map<ProcessId, Running>();
  private listeners = new Set<() => void>();

  constructor(readonly sim: Sim) {}

  onChange(fn: () => void): void {
    this.listeners.add(fn);
  }

  private changed(): void {
    this.listeners.forEach((fn) => fn());
  }

  def(id: ProcessId): ProcessDef {
    return PROCESSES.find((p) => p.id === id)!;
  }

  /** Grund, warum `id` jetzt nicht starten kann, sonst null. */
  reason(id: ProcessId): string | null {
    if (this.active.has(id)) return null;
    const def = this.def(id);
    for (const otherId of this.active.keys()) {
      const other = this.def(otherId);
      const shared = def.resources.find((r) => other.resources.includes(r));
      if (shared) return `${RESOURCE_NAME[shared]} belegt: ${other.title}`;
    }
    return def.precondition(this.sim.state);
  }

  start(id: ProcessId): void {
    if (this.active.has(id) || this.reason(id)) return;
    const def = this.def(id);
    const token = { cancelled: false };
    const running: Running = { token, step: '' };
    this.active.set(id, running);
    const ctx = new Ctx(this.sim, token, (text) => {
      running.step = text;
      this.changed();
    });
    this.changed();
    def
      .run(ctx)
      .catch((e) => {
        if (!(e instanceof Cancelled)) console.error(e);
      })
      .finally(() => {
        // Nach einem Zurücksetzen kann hier schon ein neuer Lauf eingetragen sein.
        if (this.active.get(id) === running) this.active.delete(id);
        this.changed();
      });
  }

  stop(id: ProcessId): void {
    const run = this.active.get(id);
    if (!run || !this.def(id).stoppable) return;
    run.token.cancelled = true;
    this.sim.message(`${this.def(id).title} gestoppt`);
  }

  reset(): void {
    this.active.forEach((run) => (run.token.cancelled = true));
    this.active.clear();
    this.sim.rejectAll();
    this.sim.state = initialState();
    this.sim.message('Anlage zurückgesetzt');
    this.changed();
  }
}
