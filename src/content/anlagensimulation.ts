// Alle Stellwerte der Anlagensimulation an einer Stelle.
//
// Mengen und Leistungen sind echte Anlagenwerte (Tonnen, Kubikmeter, Liter je
// Stunde). Die Simulation läuft im Zeitraffer: `timeScale` Anlagensekunden je
// echter Sekunde. Bei 180 entspricht eine Sekunde am Bildschirm drei Minuten
// in der Anlage — 15.000 l/h Löseleistung füllen dann 0,75 m³ pro Sekunde,
// ein leerer 40-m³-Tank ist bei Tempo 1× nach knapp einer Minute voll.

export const PLANT = {
  /** Anlagensekunden je echter Sekunde (Zeitraffer). */
  timeScale: 180,
  /** Anlagenzeit beim Start, in Minuten nach Mitternacht (05:30 Uhr). */
  startClock: 5 * 60 + 30,

  silo: {
    /** Fassungsvermögen in Tonnen. */
    capacity: 600,
    /** Füllstand beim Start bzw. nach „Zurücksetzen“. */
    initial: 410,
    /** Schüttdichte Streusalz, t/m³ — nur für die Füllstandsanzeige. */
    bulkDensity: 1.25,
    /** Abzug über den Schieber in den Streuer, t/h. */
    dischargeRate: 60,
    /** Pneumatische Befüllung aus dem Silozug, t/h. */
    fillRate: 40,
  },

  brine: {
    /** Sollkonzentration NaCl in Prozent. */
    concentration: 22,
    /** Dichte der Sole bei Sollkonzentration, kg/l. */
    density: 1.17,
    /** Trockensalz je m³ Sole in t (22 % von 1,17 t). */
    saltPerM3: 0.26,
  },

  mixer: {
    /** Arbeitsfüllung des Zwangsmischers in m³. */
    workLevel: 4.5,
    capacity: 7,
    /** Wasserzulauf beim Anfahren, m³/h. */
    waterRate: 25,
    /** Zeit, bis das Salz auf Sollkonzentration gelöst ist, in Anlagensekunden. */
    dissolveTime: 10 * 60,
    /** Löseleistung im Dauerbetrieb, l/h. */
    productionRate: 15000,
  },

  tank: {
    /** Fassungsvermögen des Soletanks in m³. */
    capacity: 50,
    initial: 31,
    /** Ab diesem Anteil gilt der Tank als voll. */
    fullAt: 0.97,
    /** Anlagenzeit, bis sich eine stehende Sole merklich schichtet, in Sekunden. */
    stratifyTime: 8 * 3600,
    /** Anlagenzeit, bis Umwälzen die Schichtung aufgelöst hat, in Sekunden. */
    mixTime: 20 * 60,
    /** Entleeren über P2 und den Ablass, m³/h. */
    drainRate: 45,
  },

  dispense: {
    /** Abgabeleistung Pumpe P2 an der Zapfstelle, m³/h. */
    rate: 36,
  },

  vehicles: {
    /** Fahrgeschwindigkeit in viewBox-Einheiten je echter Sekunde. */
    speed: 260,
    /** Soletank des Sprühfahrzeugs, m³. */
    brineTank: 6,
    /** Nutzlast des Streu-LKW, t. */
    spreaderLoad: 8,
    /** Ladung des Silozugs, t. */
    tankerLoad: 26,
  },
} as const;

/** Geometrie der Zeichnung (viewBox-Einheiten). Wer etwas verschiebt, muss
 *  meist auch die Rohrleitungen in scene.ts nachziehen. */
export const LAYOUT = {
  /** Sichtbarer Ausschnitt. Fahrzeuge fahren außerhalb davon ein und aus. */
  view: { x: 60, y: -108, w: 1140, h: 744 },
  width: 1200,
  /** Oberkante Gelände; darauf stehen Silo, Tank und Schränke. */
  ground: 560,
  /** Fahrbahn: Ober- und Unterkante. Die Räder laufen auf `road.wheel`. */
  road: { top: 572, bottom: 628, wheel: 616 },

  /** Silo hoch aufgeständert: Der Auslauf liegt über dem Aufbereiter, damit
   *  die Dosierschnecke vom Schieber aus leicht abfällt. */
  silo: { cx: 230, r: 92, roof: -50, cylBottom: 230, coneBottom: 330, outlet: 15 },
  /** Aufbereiter auf einem 20er-Sockel (Unterkante Behälter = ground − 20). */
  mixer: { x: 370, y: 400, w: 120, h: 140 },
  /** Pumpen- und Ventilkasten: P1, P2, P3 und alle Ventile. */
  box: { x: 518, y: 400, w: 170, h: 160 },
  tank: { x: 716, y: 230, w: 130, h: 300 },
  zapfstelle: { x: 900, y: 420, w: 44 },
  cabinet: { x: 1110, y: 398, w: 70, h: 162 },
  /** SalzManager-Bildschirm in der Zeichnung. */
  screen: { x: 440, y: -100, w: 750, h: 270 },
  /** RFID-Leser (Säulenmitte), an Silo und Zapfstelle baugleich. */
  rfid: { silo: 337, zapf: 965 },

  /** Haltepunkte: x-Koordinate der Fahrzeugreferenz (siehe vehicles.ts). */
  stops: {
    siloOutlet: 230,
    /** Sprühfahrzeug: Kabine steht direkt neben dem RFID-Leser. */
    brineInlet: 983,
    /** Silozug kommt von links und hält mit dem Heck an der Befüllleitung. */
    fillPipe: 140,
  },
} as const;

/** Bereiche für schmale Bildschirme. Auf dem Handy wäre die ganze Anlage zu
 *  klein; dort zoomt die Zeichnung auf einen dieser Ausschnitte (viewBox),
 *  hochformatig (Breite : Höhe ≈ 0,8). `null` = ganze Anlage. */
export type AreaId = 'gesamt' | 'silo' | 'aufbereiter' | 'soletank' | 'zapfstelle';

export const AREAS: Array<{ id: AreaId; label: string; box: { x: number; y: number; w: number; h: number } | null }> = [
  { id: 'gesamt', label: 'Gesamt', box: null },
  { id: 'silo', label: 'Silo', box: { x: 60, y: 120, w: 420, h: 525 } },
  { id: 'aufbereiter', label: 'Aufbereiter', box: { x: 340, y: 150, w: 395, h: 494 } },
  { id: 'soletank', label: 'Soletank', box: { x: 500, y: 150, w: 395, h: 494 } },
  { id: 'zapfstelle', label: 'Zapfstelle', box: { x: 690, y: 150, w: 400, h: 494 } },
];

/** Wohin die Ansicht auf dem Handy schwenkt, wenn ein Ablauf startet. */
export const PROCESS_AREA = {
  produce: 'aufbereiter',
  circulate: 'soletank',
  drain: 'soletank',
  brineOut: 'zapfstelle',
  saltOut: 'silo',
  saltIn: 'silo',
} as const satisfies Record<string, AreaId>;

/** Startbereich, wenn man über „Unsere Anlagen“ von einem Produkt kommt
 *  (/anlagensimulation?bereich=…). Schlüssel = slug aus produkteTechnik.ts. */
export const PRODUCT_AREA: Record<string, AreaId> = {
  streusalzlagerung: 'silo',
  soleaufbereitung: 'aufbereiter',
  solepumpstation: 'zapfstelle',
  automatisierung: 'gesamt',
  service: 'gesamt',
};
