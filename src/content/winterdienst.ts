// Stellwerte der Winterdienst-Scroll-Animation auf der Startseite.
// Herkunft: winterdienst-scroll-demo/src/config.ts (eigenständige Demo).
//
// Unterschied zur Demo: Der Verlauf der Straße steht nicht mehr als fester
// SVG-Pfad hier, sondern wird in src/scripts/winterdienst/route.ts aus der
// Lage der Seitenabschnitte berechnet. Dort stehen auch Fahrbahnbreite und
// Kurvenabstand.

export interface WinterRoadConfig {
  /** Verhältniszahl der Fahrbahnbreite. Zusammen mit `vehicleSize` und
   *  `vehicleOffset` legt sie nur Proportionen fest; die tatsächliche Breite in
   *  Pixeln kommt aus route.ts. */
  roadWidth: number;
  /** VEHICLE_SIZE — Länge des Fahrzeugs (inkl. Schild), gleiche Einheit wie `roadWidth`. */
  vehicleSize: number;
  /** SNOW_AMOUNT — 0…1, Dichte der Schneedecke auf der ungeräumten Fahrbahn. */
  snowAmount: number;
  /** ICE_AMOUNT — 0…1, Reif auf dem Asphalt in den Fahrspuren. 0 = blanker, dunkler Asphalt. */
  iceAmount: number;
  /** TRACK_AMOUNT — 0…1, wie klar die Fahrspuren bis auf den Asphalt freigefahren sind. 0 = keine Spuren. */
  trackAmount: number;
  /** CLEARED_ROAD_AMOUNT — Räumeffekt hinter dem Fahrzeug: 1 = an, 0 = aus. */
  clearedRoadAmount: number;
  /** Breite der geräumten Spur als Anteil der Fahrbahnbreite. */
  clearedWidth: number;
  /** ROAD_EDGE_SNOW — 0…1, Stärke der Schneeränder. Die Ränder verdecken die
   *  Asphaltkante; unter etwa 0.4 wird die Kante sichtbar gerade. */
  roadEdgeSnow: number;
  /** SALT_AMOUNT — 0…1, Menge des Streusalzes, das am Heck ausgeworfen wird. 0 = aus. */
  saltAmount: number;
  /** Länge der Wurfzone hinter dem Streuer als Anteil der Fahrzeuglänge. */
  saltThrow: number;
  /** SNOW_SPRAY_AMOUNT — 0…1, Schnee, der vom Schild an den Straßenrand spritzt. 0 = aus. */
  snowSprayAmount: number;
  /** VEHICLE_OFFSET — seitlicher Versatz zur Straßenachse (+ = in Fahrtrichtung rechts). */
  vehicleOffset: number;
  /** Höhe im Bildschirm, auf der das Fahrzeug fährt: 0 = oben, 1 = unten. */
  anchor: number;
  /** Abdunklung der Straße auf dunklem Seitenhintergrund (Kontaktbereich).
   *  Wird deckungsgleich über Fahrbahn, Schnee und Fahrzeug gelegt. */
  nightShade: string;

  vehicle: {
    /** Bilddatei des Fahrzeugs OHNE Schild, Draufsicht, freigestellt (PNG/WebP mit
     *  Transparenz). Vor der Front bleibt im Bild Platz für das Schild frei. */
    src: string;
    /** Drehung des Bildes, damit die Front nach OBEN zeigt (Grad im Uhrzeigersinn). 0, wenn das Bild schon so vorliegt. */
    imageRotation: number;
    /** Radstand als Anteil der Fahrzeuglänge — bestimmt, wie das Fahrzeug Kurven schneidet. */
    wheelbase: number;
    /** Lage des Streuers hinter der Fahrzeugmitte, Anteil der Fahrzeuglänge. Dort tritt das Salz aus. */
    spreaderPosition: number;
  };

  plow: {
    /** Bilddatei des Schilds allein, Draufsicht, quer liegend, Drehpunkt in der
     *  Bildmitte. Gleicher Maßstab und gleiche Bildbreite wie das Fahrzeugbild. */
    src: string;
    /** Lage des Schild-Drehpunkts vor der Fahrzeugmitte, Anteil der Fahrzeuglänge. */
    position: number;
    /** Schrägstellung des Schilds in Grad. 0 = Schild steht immer genau quer
     *  zur Straße und wirft nach beiden Seiten. + = rechtes Ende zurück, Auswurf
     *  nach rechts. */
    restAngle: number;
  };

  quality: {
    /** Obergrenze der vorgerechneten Szene in Megapixeln je Ebene. */
    maxMegapixels: number;
    /** Höchste genutzte Pixeldichte. */
    maxPixelRatio: number;
  };

  /** Richtung, in die Schatten fallen (Licht kommt von links oben). */
  light: { x: number; y: number };

  textures: {
    asphalt: string;
    snow: string;
    snowRough: string;
    frost: string;
    cloud: string;
    streaks: string;
  };
}

// Jede Datei steht als eigener, fester Verweis da: nur so erkennt der Bundler
// (Vite/Astro) die Bilder und liefert sie im fertigen Build mit aus. Geladen
// werden sie erst, wenn die Animation tatsächlich startet.
const url = (file: URL): string => file.href;

export const WINTER_ROAD: WinterRoadConfig = {
  roadWidth: 130,
  vehicleSize: 170,

  snowAmount: 0.9,
  iceAmount: 0.25,
  trackAmount: 0.8,
  clearedRoadAmount: 1,
  clearedWidth: 0.62,
  roadEdgeSnow: 0.8,
  saltAmount: 0.7,
  saltThrow: 0.55,
  snowSprayAmount: 0.8,
  vehicleOffset: 0,
  anchor: 0.5,
  nightShade: 'rgba(13,36,54,0.5)',

  // Das Fahrzeug ist noch ein gezeichneter Platzhalter. Austausch: zwei Bilder
  // nach src/assets/winterdienst/vehicle/ legen und hier eintragen (Details in
  // winterdienst-scroll-demo/README.md, Abschnitt „Fahrzeug-Asset austauschen“).
  vehicle: {
    src: url(new URL('../assets/winterdienst/vehicle/multihog-fahrzeug-PLATZHALTER.webp', import.meta.url)),
    imageRotation: 0,
    wheelbase: 0.36,
    spreaderPosition: 0.42,
  },

  plow: {
    src: url(new URL('../assets/winterdienst/vehicle/multihog-schild-PLATZHALTER.webp', import.meta.url)),
    position: 0.398,
    restAngle: 0,
  },

  quality: { maxMegapixels: 6, maxPixelRatio: 2 },
  light: { x: 0.75, y: 0.66 },

  textures: {
    asphalt: url(new URL('../assets/winterdienst/road/asphalt.webp', import.meta.url)),
    snow: url(new URL('../assets/winterdienst/snow/snow.webp', import.meta.url)),
    snowRough: url(new URL('../assets/winterdienst/snow/snow-rough.webp', import.meta.url)),
    frost: url(new URL('../assets/winterdienst/ice/frost.webp', import.meta.url)),
    cloud: url(new URL('../assets/winterdienst/noise/cloud.webp', import.meta.url)),
    streaks: url(new URL('../assets/winterdienst/noise/streaks.webp', import.meta.url)),
  },
};
