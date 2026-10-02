// Zentrale Konfiguration der Winterdienst-Scroll-Animation.
//
// Alles, was am Effekt eingestellt werden soll, steht in dieser Datei. Die
// übrigen Module lesen nur von hier — dort gibt es keine eigenen Stellwerte.
//
// Koordinatenraum: Der Straßenpfad liegt in einer gedachten Zeichenfläche von
// `viewBox.width` × `viewBox.height` Einheiten (wie die viewBox einer SVG).
// Diese Fläche wird auf den Container gelegt, in dem die Straße läuft:
//   - die BREITE der Zeichenfläche entspricht der Breite des Containers,
//   - die HÖHE der Zeichenfläche entspricht seiner Höhe (z. B. so hoch wie der
//     Text daneben).
// Breitenangaben unten (Straßenbreite, Fahrzeuggröße …) sind in Einheiten der
// Zeichenflächen-Breite gemeint und skalieren mit der Containerbreite.

export interface WinterRoadConfig {
  /** ROAD_PATH — Verlauf der Straße als SVG-Pfad (Attribut `d`). */
  roadPath: string;
  /** Zeichenfläche, in der roadPath definiert ist. */
  viewBox: { width: number; height: number };
  /** ROAD_WIDTH — Fahrbahnbreite in Einheiten der Zeichenflächen-Breite. */
  roadWidth: number;
  /** VEHICLE_SIZE — Länge des Fahrzeugs (inkl. Schild), gleiche Einheit. */
  vehicleSize: number;
  /** SCROLL_LENGTH — Mindesthöhe der Strecke in Bildschirmhöhen (4 = 400vh).
   *  Ist der Inhalt neben der Straße höher, gilt dessen Höhe. */
  scrollLength: number;
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
    /** true blendet in der Demo den Hinweis "Platzhalter" ein. */
    isPlaceholder: boolean;
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
// (Vite/Astro) die Bilder und liefert sie im fertigen Build mit aus.
const url = (file: URL): string => file.href;

export const CONFIG: WinterRoadConfig = {
  // ── ROAD_PATH ────────────────────────────────────────────────────────────
  // M x y            Startpunkt der Straße
  // C a b, c d, x y  Kurvenstück bis x y; a b und c d sind die beiden Griffe
  // S c d, x y       weiteres Kurvenstück, schließt weich an das vorige an
  // x: 0 = linker Rand des Containers, 400 = rechter Rand.
  // y: 0 = oberes Ende, 1600 = unteres Ende.
  // Zwischen Ein- und Ausfahrt braucht die Straße samt Schneerand links und
  // rechts Platz: x zwischen etwa 110 und 290 halten.
  //
  // Ein- und Ausfahrt: Start- und Endpunkt liegen AUSSERHALB der Zeichenfläche
  // (x über 400 = rechts draußen, x unter 0 = links draußen). Die Straße läuft
  // dort seitlich aus dem Bild, das Fahrzeug steht am Anfang und am Ende
  // unsichtbar daneben. Damit es ganz verschwindet, mindestens 130 Einheiten
  // über den Rand hinausgehen.
  // Wichtig: Die y-Werte müssen von Punkt zu Punkt größer werden — die Straße
  // darf nirgends wieder aufwärts führen, auch nicht in Ein- und Ausfahrt.
  roadPath: `
    M 540 40
    C 380 45, 215 60, 200 260
    S 120 470, 135 620
    S 280 820, 268 1000
    S 150 1200, 190 1340
    S 380 1550, 540 1565
  `,
  viewBox: { width: 400, height: 1600 },

  roadWidth: 130,
  vehicleSize: 170,
  scrollLength: 4,

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

  vehicle: {
    src: url(new URL('../assets/vehicle/multihog-fahrzeug-PLATZHALTER.webp', import.meta.url)),
    imageRotation: 0,
    wheelbase: 0.36,
    spreaderPosition: 0.42,
    isPlaceholder: true,
  },

  plow: {
    src: url(new URL('../assets/vehicle/multihog-schild-PLATZHALTER.webp', import.meta.url)),
    position: 0.398,
    restAngle: 0,
  },

  quality: { maxMegapixels: 6, maxPixelRatio: 2 },
  light: { x: 0.75, y: 0.66 },

  textures: {
    asphalt: url(new URL('../assets/road/asphalt.webp', import.meta.url)),
    snow: url(new URL('../assets/snow/snow.webp', import.meta.url)),
    snowRough: url(new URL('../assets/snow/snow-rough.webp', import.meta.url)),
    frost: url(new URL('../assets/ice/frost.webp', import.meta.url)),
    cloud: url(new URL('../assets/noise/cloud.webp', import.meta.url)),
    streaks: url(new URL('../assets/noise/streaks.webp', import.meta.url)),
  },
};
