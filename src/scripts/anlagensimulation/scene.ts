// Die Anlage als SVG — Seitenansicht im Schnitt, flach wie eine technische
// Zeichnung (DESIGN.md: „The Site Plan“). Silo, Aufbereiter und Soletank sind
// aufgeschnitten, damit Füllstände sichtbar sind.
//
// Diese Datei zeichnet nur einmal. Alles, was sich bewegt, trägt ein
// `data-ref` und wird von view.ts in jedem Bild nachgestellt.
//
// Farben: nur Abstufungen von Navy (navy-800) und Kupfer (copper-500), wie auf
// der Website. Einzige Ausnahme sind die beiden Ampeln (Rot/Grün), deren
// Bedeutung an der Farbe hängt.

import { LAYOUT } from '../../content/anlagensimulation';

export const C = {
  ink: '#183a59',
  night: '#0d2436',
  steel: '#526376',
  steelLight: '#6b8299',
  mist: '#a9b7c4',
  mistLight: '#d5dde4',
  concrete: '#e4e9ed',
  band: '#eef1f3',
  paper: '#fbfcfc',
  fog: '#f5f7f8',
  copper: '#b15a2e',
  road: '#33475a',
  /** Medien */
  salt: '#c9d3dc',
  water: '#8fa6ba',
  brine: '#4d6b83',
  brineDeep: '#2c4b66',
  brineLight: '#7d95a9',
  lightOff: '#3a4a58',
  red: '#c0332c',
  green: '#3f8f5a',
};

export type FlowId =
  | 'waterIn'
  | 'waterOut'
  | 'mixIn'
  | 'p1Up'
  | 'fillUp'
  | 'fillLine'
  | 'tankIn'
  | 'p2Down'
  | 'ret'
  | 'zapf'
  | 'drain'
  | 'fill';

export type ValveId = 'vW' | 'vM' | 'vF' | 'vT' | 'vR' | 'vZ' | 'vD';

/** Schieber unter dem Silokonus (mit eingebautem Rüttler) und das kurze,
 *  fest montierte Schlauchstück darunter. */
export const GATE = { half: 40, h: 16 };
export const SALT_HOSE = { len: 30, half: 12 };

const { silo: S, mixer: M, box: B, tank: T, zapfstelle: Z, cabinet: K, screen: SC, ground: G, road: R } = LAYOUT;

/** Ein-/Auslauf des Soletanks (linke Tankwand, unten). */
const TANK_PORT_Y = 500;
const P1 = { x: 560, y: 530 };
/** Wasserpumpe: links oben im Kasten, im Wasserzulauf vor dem Ventil vW. */
const P3 = { x: 540, y: 452 };
const P2 = { x: 630, y: 500 };
/** Verteilpunkt unter P2: Zapfstelle, Rücklauf in den Tank oder Ablass. */
const N = { x: 630, y: 540 };
const FILL_X = 560;
const TANK_CX = T.x + T.w / 2;
/** Wasserleitung: steigt zwischen Aufbereiter und Kasten auf und läuft oben
 *  in den Aufbereiter. Wo sie die Leitung Aufbereiter → P1 kreuzt, springt
 *  diese in einem kleinen Bogen darüber (wie in einer Rohrleitungszeichnung). */
const WATER_X = 509;
const FILL_PIPE_X = 110;

/** Rohrleitungen. Die Zeichenrichtung ist die Fließrichtung. */
export const FLOWS: Record<FlowId, string> = {
  // Wasser kommt aus dem Boden, läuft durch den Kasten (Ventil vW) und wird
  // immer von oben in den Aufbereiter gefüllt.
  waterIn: `M${WATER_X} ${G + 12} V${P3.y} H${P3.x - 11}`,
  waterOut: `M${P3.x} ${P3.y - 11} V380 H${M.x + M.w - 14} V${M.y + 7}`,
  mixIn: `M${M.x + M.w} ${P1.y} H${WATER_X - 5} A5 5 0 0 1 ${WATER_X + 5} ${P1.y} H${P1.x - 11}`,
  p1Up: `M${P1.x} ${P1.y - 11} V440`,
  fillUp: `M${FILL_X} 440 V${B.y}`,
  fillLine: `M${FILL_X} ${B.y} V214 H${TANK_CX} V${T.y - 1}`,
  tankIn: `M${T.x} ${TANK_PORT_Y} H${P2.x + 11}`,
  p2Down: `M${P2.x} ${P2.y + 11} V${N.y}`,
  ret: `M${N.x} ${N.y} H590 V440 H${FILL_X}`,
  zapf: `M${N.x} ${N.y} H880 V${Z.outletY} H${Z.x}`,
  drain: `M${N.x} ${N.y} V${G + 7}`,
  // Befüllleitung auf der linken Silo-Seite, mündet links ins Dach.
  fill: `M${FILL_PIPE_X} 505 V${S.roof - 28} H${S.cx - S.r + 26} V${S.roof - 5}`,
};

export const VALVES: Array<{ id: ValveId; x: number; y: number; vertical: boolean }> = [
  { id: 'vW', x: P3.x, y: 418, vertical: true },
  { id: 'vM', x: 538, y: P1.y, vertical: false },
  { id: 'vF', x: FILL_X, y: 490, vertical: true },
  { id: 'vR', x: 590, y: 492, vertical: true },
  { id: 'vT', x: 668, y: TANK_PORT_Y, vertical: false },
  { id: 'vZ', x: 662, y: N.y, vertical: false },
  { id: 'vD', x: N.x, y: 551, vertical: true },
];

/** Positionsnummern wie in einer Werkzeichnung; die Liste dazu steht in panel.ts. */
const MARKERS: Array<{ n: number; x: number; y: number; to?: [number, number] }> = [
  { n: 1, x: 346, y: -14, to: [322, -14] },
  { n: 2, x: 84, y: 250, to: [106, 250] },
  { n: 3, x: 166, y: 372, to: [196, 342] },
  { n: 4, x: 290, y: 452, to: [328, 470] },
  { n: 5, x: 372, y: 300, to: [372, 362] },
  { n: 6, x: 350, y: 418, to: [371, 440] },
  { n: 7, x: 520, y: 356, to: [520, 377] },
  { n: 8, x: 702, y: 392, to: [688, 404] },
  { n: 9, x: 862, y: 250, to: [846, 262] },
  { n: 10, x: 992, y: 414, to: [945, 428] },
  { n: 11, x: 1094, y: 384, to: [1110, 400] },
  { n: 12, x: 424, y: -84, to: [SC.x, -84] },
];

// ── Silo: Füllhöhe aus Füllmenge ────────────────────────────────────────────
// Im Konus ist pro Höhenmeter weniger Platz als im Zylinder. Damit die
// Füllstandsanzeige stimmt, wird das Volumen je Zeichenzeile aufsummiert.
const SILO_TABLE: number[] = [];
{
  let acc = 0;
  for (let y = S.coneBottom; y >= S.roof; y--) {
    const r = y >= S.cylBottom ? S.outlet + ((S.r - S.outlet) * (S.coneBottom - y)) / (S.coneBottom - S.cylBottom) : S.r;
    acc += r * r;
    SILO_TABLE.push(acc);
  }
}

/** y-Koordinate der Salzoberfläche bei Füllgrad `frac` (0 … 1). */
export function siloLevelY(frac: number): number {
  const total = SILO_TABLE[SILO_TABLE.length - 1];
  const want = Math.max(0, Math.min(1, frac)) * total;
  let i = 0;
  while (i < SILO_TABLE.length - 1 && SILO_TABLE[i] < want) i++;
  return S.coneBottom - i;
}

// ── Bausteine ────────────────────────────────────────────────────────────────

const label = (x: number, y: number, text: string, anchor = 'middle', cls = 'ps-t-label'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;

const valve = (v: (typeof VALVES)[number]): string => {
  const rot = v.vertical ? ` transform="rotate(90 ${v.x} ${v.y})"` : '';
  return `<g class="ps-valve" data-valve="${v.id}"${rot}>
    <path d="M${v.x - 7} ${v.y - 5} L${v.x} ${v.y} L${v.x - 7} ${v.y + 5} Z M${v.x + 7} ${v.y - 5} L${v.x} ${v.y} L${v.x + 7} ${v.y + 5} Z"/>
  </g>`;
};

const pump = (id: string, x: number, y: number): string => `
  <g class="ps-pump" data-pump="${id}">
    <circle cx="${x}" cy="${y}" r="11"/>
    <path class="ps-impeller" d="M${x - 6} ${y - 6} L${x + 8} ${y} L${x - 6} ${y + 6} Z"/>
  </g>`;

const marker = (m: (typeof MARKERS)[number]): string => `
  <g class="ps-marker">
    ${m.to ? `<line x1="${m.x}" y1="${m.y}" x2="${m.to[0]}" y2="${m.to[1]}"/>` : ''}
    <circle cx="${m.x}" cy="${m.y}" r="11"/>
    <text x="${m.x}" y="${m.y + 4.3}" text-anchor="middle">${m.n}</text>
  </g>`;

/** RFID-Leser auf einer Säule — an Silo und Zapfstelle baugleich. Drei
 *  Zustände (Klasse am Leser, Stil in styles.css): bereit, liest (Rahmen und
 *  Funkwellen in Kupfer, Leuchte blinkt) und freigegeben (Kopf in Kupfer). */
const rfidReader = (id: 'rfidSilo' | 'rfidZapf', x: number): string => `
  <g class="ps-rfid" data-ref="${id}">
    <rect x="${x - 2}" y="494" width="4" height="${G - 494}" fill="${C.steel}"/>
    <g class="ps-rfid-waves" fill="none" stroke-linecap="round">
      <path d="M${x - 14} 470 q-5 8 0 16"/>
      <path d="M${x - 20} 465 q-9 13 0 26"/>
      <path d="M${x + 14} 470 q5 8 0 16"/>
      <path d="M${x + 20} 465 q9 13 0 26"/>
    </g>
    <rect class="ps-rfid-head" x="${x - 9}" y="462" width="18" height="32" rx="2"/>
    <circle class="ps-rfid-led" cx="${x}" cy="471" r="3"/>
    <path class="ps-rfid-lines" d="M${x - 5} 480 h10 M${x - 5} 484 h10 M${x - 5} 488 h10"/>
    <text class="ps-t-tiny ps-t-halo ps-rfid-label" data-ref="${id}Label" x="${x}" y="456" text-anchor="middle">RFID</text>
  </g>`;

function siloMarkup(): string {
  const { cx, r, roof, cylBottom, coneBottom, outlet } = S;
  const L = cx - r;
  const Rx = cx + r;
  const shell = `M${L} ${roof} L${cx} ${roof - 18} L${Rx} ${roof} V${cylBottom} L${cx + outlet} ${coneBottom} H${cx - outlet} L${L} ${cylBottom} Z`;
  const seams = Array.from({ length: 9 }, (_, i) => roof + 34 * (i + 1))
    .filter((y) => y < cylBottom - 8)
    .map((y) => `M${L} ${y} H${Rx}`)
    .join(' ');
  const ladderX = L - 12;
  const rungs = Array.from({ length: Math.floor((G - roof) / 12) }, (_, i) => `M${ladderX} ${G - 6 - i * 12} h10`).join(' ');
  const legs = [L + 8, Rx - 8];
  const backLegs = [cx - 38, cx + 38];
  // Salzkörner im Fallstrahl: so viele, dass sie bis zum Streuaufbau reichen.
  const grains = Array.from(
    { length: 30 },
    (_, i) => `<circle cx="${cx - 5 + (i % 3) * 5}" cy="${coneBottom - 17 + i * 7}" r="2.2"/>`,
  ).join('');

  return `
  <g class="ps-silo">
    ${backLegs.map((x) => `<rect x="${x - 4}" y="${cylBottom}" width="8" height="${G - cylBottom}" fill="${C.mistLight}"/>`).join('')}
    <clipPath id="ps-silo-clip"><path d="${shell}"/></clipPath>
    <path d="${shell}" fill="${C.paper}"/>
    <path data-ref="siloSalt" clip-path="url(#ps-silo-clip)" fill="${C.salt}" d=""/>
    <g clip-path="url(#ps-silo-clip)"><path d="${seams}" stroke="${C.ink}" stroke-width=".8" opacity=".18"/></g>
    <path d="${shell}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="${L - 4}" y="${cylBottom - 5}" width="${2 * r + 8}" height="10" fill="${C.steel}"/>
    ${legs
      .map(
        (x) => `
      <rect x="${x - 5}" y="${cylBottom}" width="10" height="${G - cylBottom - 8}" fill="${C.steel}"/>
      <rect x="${x - 8}" y="${G - 8}" width="16" height="8" fill="${C.ink}"/>`,
      )
      .join('')}
    <path d="M${L + 13} ${cylBottom + 10} L${cx - 34} ${coneBottom - 22} M${Rx - 13} ${cylBottom + 10} L${cx + 34} ${coneBottom - 22}" stroke="${C.steelLight}" stroke-width="5"/>
    <path d="M${L + 5} ${coneBottom + 40} H${Rx - 5}" stroke="${C.steelLight}" stroke-width="4"/>
    <path d="M${ladderX} ${G} V${roof + 4} M${ladderX + 10} ${G} V${roof}" stroke="${C.steel}" stroke-width="2"/>
    <path d="${rungs}" stroke="${C.steel}" stroke-width="1.4"/>
    <path d="M${L + 18} ${roof - 4} V${roof - 16} M${cx} ${roof - 18} V${roof - 32} M${L + 18} ${roof - 14} L${cx} ${roof - 30}" stroke="${C.steel}" stroke-width="1.6" fill="none"/>

    ${label(cx, roof + 50, 'SALZSILO')}
    <text class="ps-t-value" data-ref="siloValue" x="${cx}" y="${roof + 84}" text-anchor="middle">0 t</text>
    <text class="ps-t-sub" data-ref="siloSub" x="${cx}" y="${roof + 104}" text-anchor="middle"></text>

    <!-- Salzstrom: aus dem Schlauchstück frei in den Streuaufbau -->
    <clipPath id="ps-stream-clip"><rect data-ref="streamClip" x="${cx - 9}" y="${coneBottom + GATE.h}" width="18" height="0"/></clipPath>
    <g clip-path="url(#ps-stream-clip)">
      <g data-ref="stream" class="ps-fall">${grains}</g>
    </g>

    <!-- Schieber, breit, mit eingebautem Rüttler rechts; rechts daneben setzt
         die Dosierschnecke an -->
    <rect x="${cx - GATE.half}" y="${coneBottom}" width="${GATE.half * 2}" height="${GATE.h}" rx="2" fill="${C.steel}"/>
    <rect x="${cx - GATE.half + 3}" y="${coneBottom + 3}" width="${GATE.half * 2 - 6}" height="${GATE.h - 6}" rx="1" fill="${C.steelLight}"/>
    <rect data-ref="gate" class="ps-gate" x="${cx - outlet - 4}" y="${coneBottom + 6}" width="${2 * outlet + 8}" height="4"/>
    <g data-ref="vibrator" class="ps-shake">
      <rect x="${cx + 20}" y="${coneBottom + 3}" width="16" height="10" rx="2" fill="${C.night}"/>
      <circle cx="${cx + 28}" cy="${coneBottom + 8}" r="2.6" fill="${C.mist}"/>
    </g>
    <!-- kurzes Schlauchstück, fest montiert -->
    <path d="M${cx - SALT_HOSE.half} ${coneBottom + GATE.h} V${coneBottom + GATE.h + SALT_HOSE.len} H${cx + SALT_HOSE.half} V${coneBottom + GATE.h} Z" fill="${C.night}"/>
    <path d="M${cx - SALT_HOSE.half} ${coneBottom + GATE.h + 9} H${cx + SALT_HOSE.half} M${cx - SALT_HOSE.half} ${coneBottom + GATE.h + 18} H${cx + SALT_HOSE.half}" stroke="${C.steel}" stroke-width="1.2"/>

    <!-- Ampel Entnahme am rechten Stützfuß -->
    <rect x="${Rx - 1}" y="400" width="14" height="34" rx="2" fill="${C.night}"/>
    <circle data-ref="outRed" cx="${Rx + 6}" cy="409" r="4.5" fill="${C.lightOff}"/>
    <circle data-ref="outGreen" cx="${Rx + 6}" cy="425" r="4.5" fill="${C.lightOff}"/>
  </g>`;
}

function fillPipeMarkup(): string {
  return `
  <path d="${FLOWS.fill}" fill="none" stroke="${C.night}" stroke-width="7" stroke-linejoin="round"/>
  <rect x="${FILL_PIPE_X - 7}" y="503" width="14" height="10" rx="2" fill="${C.ink}"/>
  <!-- Ampel Befüllung -->
  <rect x="${FILL_PIPE_X - 24}" y="400" width="14" height="34" rx="2" fill="${C.night}"/>
  <circle data-ref="inRed" cx="${FILL_PIPE_X - 17}" cy="409" r="4.5" fill="${C.lightOff}"/>
  <circle data-ref="inGreen" cx="${FILL_PIPE_X - 17}" cy="425" r="4.5" fill="${C.lightOff}"/>
  <text class="ps-t-tag" transform="translate(${FILL_PIPE_X - 14} 150) rotate(-90)" text-anchor="middle">BEFÜLLLEITUNG</text>`;
}

/** Dosierschnecke: setzt seitlich am Schieber an und fällt leicht zum
 *  Aufbereiter ab, das Salz rutscht also mit dem Gefälle. */
function screwMarkup(): string {
  const x0 = S.cx + GATE.half;
  const y0 = S.coneBottom + GATE.h / 2;
  const x1 = M.x + 30;
  const y1 = M.y - 14;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const flights = Array.from({ length: Math.ceil(len / 12) + 3 }, (_, i) => {
    const x = -24 + i * 12;
    return `<path d="M${x} -6 L${x + 7} 6" />`;
  }).join('');
  const grains = Array.from({ length: Math.ceil(len / 12) + 3 }, (_, i) => `<circle cx="${-20 + i * 12}" cy="${(i % 2) * 4 - 1}" r="2"/>`).join('');
  return `
  <g transform="translate(${x0} ${y0}) rotate(${ang})">
    <clipPath id="ps-screw-clip"><rect x="2" y="-6" width="${len - 4}" height="12"/></clipPath>
    <rect x="0" y="-8" width="${len}" height="16" rx="2" fill="${C.mistLight}" stroke="${C.ink}" stroke-width="1.2"/>
    <g clip-path="url(#ps-screw-clip)">
      <g data-ref="screw" class="ps-screw">
        <g stroke="${C.steelLight}" stroke-width="2">${flights}</g>
        <g class="ps-screw-salt" fill="${C.paper}">${grains}</g>
      </g>
    </g>
    <rect x="${len - 4}" y="-11" width="20" height="22" rx="2" fill="${C.steel}"/>
    <text class="ps-t-tag ps-t-halo" x="${len / 2}" y="-14" text-anchor="middle">DOSIERSCHNECKE</text>
  </g>
  <rect x="${x1 - 7}" y="${y1 + 2}" width="14" height="${M.y - y1 + 3}" fill="${C.mistLight}" stroke="${C.ink}" stroke-width="1.2"/>`;
}

function mixerMarkup(): string {
  const { x, y, w, h } = M;
  // Gewölbte Haube wie beim Soletank, steht ohne Stützen auf einem Sockel.
  const bottom = y + h;
  const body = `M${x} ${y + 18} C${x} ${y - 4} ${x + w} ${y - 4} ${x + w} ${y + 18} V${bottom} H${x} Z`;
  const sx = x + w / 2 + 18;
  return `
  <g class="ps-mixer">
    <rect x="${x - 10}" y="${bottom}" width="${w + 20}" height="${G - bottom}" fill="${C.concrete}" stroke="${C.ink}" stroke-width="1" stroke-opacity=".25"/>
    <clipPath id="ps-mixer-clip"><path d="${body}"/></clipPath>
    <path d="${body}" fill="${C.paper}"/>
    <rect data-ref="mixerFill" clip-path="url(#ps-mixer-clip)" x="${x}" y="${bottom}" width="${w}" height="0" fill="${C.water}"/>
    <line x1="${sx}" y1="${y - 4}" x2="${sx}" y2="${bottom - 6}" stroke="${C.ink}" stroke-width="2.4"/>
    <rect data-ref="blade1" class="ps-blade" x="${sx - 26}" y="${bottom - 46}" width="52" height="5" fill="${C.ink}"/>
    <rect data-ref="blade2" class="ps-blade" x="${sx - 26}" y="${bottom - 12}" width="52" height="5" fill="${C.ink}"/>
    <path d="${body}" fill="none" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="${sx - 12}" y="${y - 22}" width="24" height="24" rx="2" fill="${C.steel}"/>
    <text class="ps-t-tag ps-t-halo" data-ref="mixerLabel" x="${x + w / 2}" y="${y + 30}" text-anchor="middle">AUFBEREITER</text>
    <text class="ps-t-sub" data-ref="mixerValue" x="${x + w / 2}" y="${y + 49}" text-anchor="middle"></text>
  </g>`;
}

/** Pumpen- und Ventilkasten: P1, P2 und alle Ventile an einer Stelle. */
function boxMarkup(): string {
  const { x, y, w, h } = B;
  return `
  <g class="ps-box">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.band}" stroke="${C.ink}" stroke-width="1.5"/>
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" fill="none" stroke="${C.ink}" stroke-width=".8" opacity=".25"/>
    <text class="ps-t-tag" x="${x + w - 8}" y="${y + 17}" text-anchor="end">PUMPEN- UND</text>
    <text class="ps-t-tag" x="${x + w - 8}" y="${y + 34}" text-anchor="end">VENTILKASTEN</text>
    <rect x="${N.x - 12}" y="${G}" width="24" height="7" fill="${C.steel}"/>
  </g>`;
}

function boxLabels(): string {
  return `
    ${label(P1.x - 14, P1.y - 13, 'P1', 'end', 'ps-t-tag')}
    ${label(P2.x + 14, P2.y - 13, 'P2', 'start', 'ps-t-tag')}
    ${label(P3.x, P3.y + 24, 'P3', 'middle', 'ps-t-tag')}`;
}

function tankMarkup(): string {
  const { x, y, w, h } = T;
  const body = `M${x} ${y + 18} C${x} ${y - 4} ${x + w} ${y - 4} ${x + w} ${y + 18} V${y + h} H${x} Z`;
  const cx = x + w / 2;
  const ticks = Array.from({ length: 9 }, (_, k) => {
    const ty = y + h - ((k + 1) * (h - 18)) / 10;
    return `M${x + w - 9} ${ty} h${k % 2 ? 4 : 7}`;
  }).join(' ');
  return `
  <g class="ps-tank">
    <rect x="${x - 12}" y="${y + h}" width="${w + 24}" height="${G - y - h}" fill="${C.concrete}" stroke="${C.ink}" stroke-width="1" stroke-opacity=".25"/>
    <clipPath id="ps-tank-clip"><path d="${body}"/></clipPath>
    <path d="${body}" fill="${C.paper}"/>
    <g clip-path="url(#ps-tank-clip)">
      <rect data-ref="tankFill" x="${x}" y="${y + h}" width="${w}" height="0" fill="${C.brine}"/>
      <rect data-ref="tankTop" x="${x}" y="${y + h}" width="${w}" height="0" fill="${C.brineLight}"/>
      <rect data-ref="tankBottom" x="${x}" y="${y + h}" width="${w}" height="0" fill="${C.brineDeep}"/>
    </g>
    <path d="${ticks}" stroke="${C.ink}" stroke-width="1" opacity=".45"/>
    <path d="${body}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>
    <text class="ps-t-label" data-ref="tankLabel" x="${cx}" y="${y + 50}" text-anchor="middle">SOLETANK</text>
    <text class="ps-t-value" data-ref="tankValue" x="${cx}" y="${y + 81}" text-anchor="middle"></text>
    <text class="ps-t-sub" data-ref="tankSub" x="${cx}" y="${y + 104}" text-anchor="middle"></text>
    <text class="ps-t-sub" data-ref="tankNote" x="${cx}" y="${y + 121}" text-anchor="middle"></text>
  </g>`;
}

function zapfstelleMarkup(): string {
  const { x, y, w } = Z;
  return `
  <g class="ps-zapf">
    <rect x="${x}" y="${y}" width="${w}" height="${G - y}" fill="${C.concrete}" stroke="${C.ink}" stroke-width="1.4"/>
    <path d="M${x} ${Z.outletY} H${x + w + 4}" stroke="${C.steel}" stroke-width="6"/>
    <rect x="${x + w + 2}" y="${Z.outletY - 6}" width="8" height="12" rx="2" fill="${C.ink}"/>
    ${label(x + w / 2, y - 26, 'ZAPFSTELLE')}
  </g>`;
}

function cabinetMarkup(): string {
  const { x, y, w, h } = K;
  const bars = [0, 1, 2]
    .map((k) => {
      const bx = x + 14 + k * 16;
      return `<rect x="${bx}" y="${y + 14}" width="10" height="32" fill="${C.steel}"/>
        <rect data-ref="screenBar${k}" x="${bx}" y="${y + 46}" width="10" height="0" fill="${k === 0 ? C.salt : C.brineLight}"/>`;
    })
    .join('');
  const ax = x + w - 10;
  return `
  <g class="ps-cabinet">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.4"/>
    <line x1="${x}" y1="${y + 86}" x2="${x + w}" y2="${y + 86}" stroke="${C.ink}" stroke-width="1" opacity=".3"/>
    <rect x="${x + 7}" y="${y + 8}" width="${w - 14}" height="46" rx="2" fill="${C.night}"/>
    ${bars}
    <circle data-ref="cabinetLed" cx="${x + 10}" cy="${y + 72}" r="3.5" fill="${C.mist}"/>
    <text class="ps-t-tiny" x="${x + 17}" y="${y + 75.5}">BETRIEB</text>
    <path d="M${ax} ${y} V${y - 26}" stroke="${C.ink}" stroke-width="1.6"/>
    <circle cx="${ax}" cy="${y - 28}" r="2.6" fill="${C.ink}"/>
    <path d="M${ax - 8} ${y - 36} q8 -8 16 0 M${ax - 13} ${y - 42} q13 -12 26 0" stroke="${C.ink}" stroke-width="1.2" fill="none"/>
    <line x1="${ax}" y1="${y - 50}" x2="${ax}" y2="${SC.y + SC.h}" stroke="${C.ink}" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>
    ${label(x + w / 2, y + h - 10, 'STEUERUNG', 'middle', 'ps-t-tiny')}
  </g>`;
}

/** Der SalzManager als Bildschirm in der Zeichnung: per Funk mit der
 *  Steuerung verbunden, zeigt Bestände, Entnahmen und Meldungen. */
function screenMarkup(): string {
  const { x, y, w, h } = SC;
  const bar = 32;
  const head = y + bar;
  const gaugeBottom = head + 114;
  const cellW = w / 4;
  // data-max: höchste Breite eines wechselnden Textes; view.ts kürzt längere
  // Texte mit „…“, statt sie in die Nachbarspalte laufen zu lassen.
  const cells = ['SALZSILO', 'AUFBEREITER', 'SOLETANK', 'ENTNAHMEN']
    .map((name, i) => {
      const cx0 = x + i * cellW;
      const rc = cx0 + 36;
      const ring =
        i < 3
          ? `<circle cx="${rc}" cy="${head + 64}" r="22" fill="none" stroke="${C.concrete}" stroke-width="7"/>
             <circle data-ref="smRing${i}" class="ps-sm-ring" cx="${rc}" cy="${head + 64}" r="22" fill="none" stroke="${C.ink}" stroke-width="7" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 ${rc} ${head + 64})"/>
             <text class="ps-t-tiny ps-t-pct" data-ref="smPct${i}" x="${rc}" y="${head + 68}" text-anchor="middle"></text>`
          : '';
      const tx = i < 3 ? cx0 + 68 : cx0 + 16;
      const max = cx0 + cellW - 8 - tx;
      return `
        ${i > 0 ? `<line x1="${cx0}" y1="${head}" x2="${cx0}" y2="${gaugeBottom}" stroke="${C.ink}" stroke-opacity=".12"/>` : ''}
        <text class="ps-t-tag" x="${cx0 + 16}" y="${head + 24}">${name}</text>
        ${ring}
        <text class="ps-t-screen-value" data-ref="smVal${i}" data-max="${max}" x="${tx}" y="${head + 66}"></text>
        <text class="ps-t-screen" data-ref="smSub${i}" data-max="${max}" x="${tx}" y="${head + 86}"></text>
        <text class="ps-t-screen" data-ref="smNote${i}" data-max="${max}" x="${tx}" y="${head + 104}"></text>`;
    })
    .join('');
  const colSplit = x + w * 0.47;
  const rowsY = [0, 1, 2, 3].map((r) => gaugeBottom + 46 + r * 21);
  const xt = x + 16;
  const xv = x + 66;
  const xw = x + 200;
  const xa = colSplit - 16;
  const logRows = rowsY
    .map(
      (ry, r) => `
      <text class="ps-t-screen ps-t-mono" data-ref="smLog${r}t" x="${xt}" y="${ry}"></text>
      <text class="ps-t-screen" data-ref="smLog${r}v" data-max="${xw - xv - 10}" x="${xv}" y="${ry}"></text>
      <text class="ps-t-screen" data-ref="smLog${r}w" data-max="${xa - 66 - xw}" x="${xw}" y="${ry}"></text>
      <text class="ps-t-screen ps-t-mono" data-ref="smLog${r}a" x="${xa}" y="${ry}" text-anchor="end"></text>`,
    )
    .join('');
  const xm = colSplit + 66;
  const msgRows = rowsY
    .map(
      (ry, r) => `
      <text class="ps-t-screen ps-t-mono" data-ref="smMsg${r}t" x="${colSplit + 16}" y="${ry}"></text>
      <text class="ps-t-screen" data-ref="smMsg${r}x" data-max="${x + w - 14 - xm}" x="${xm}" y="${ry}"></text>`,
    )
    .join('');
  return `
  <g class="ps-screen">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.4"/>
    <rect x="${x}" y="${y}" width="${w}" height="${bar}" fill="${C.ink}"/>
    <text class="ps-t-screen-head" x="${x + 16}" y="${y + 21}">SALZMANAGER</text>
    <text class="ps-t-screen-head" data-ref="smClock" x="${x + w - 16}" y="${y + 21}" text-anchor="end"></text>
    ${cells}
    <line x1="${x}" y1="${gaugeBottom}" x2="${x + w}" y2="${gaugeBottom}" stroke="${C.ink}" stroke-opacity=".12"/>
    <line x1="${colSplit}" y1="${gaugeBottom}" x2="${colSplit}" y2="${y + h}" stroke="${C.ink}" stroke-opacity=".12"/>
    <text class="ps-t-tag" x="${x + 16}" y="${gaugeBottom + 22}">ENTNAHMEN UND LIEFERUNGEN</text>
    <text class="ps-t-tag" x="${colSplit + 16}" y="${gaugeBottom + 22}">MELDUNGEN</text>
    ${logRows}
    ${msgRows}
  </g>`;
}

/** Komplette Zeichnung als SVG-Text. */
export function sceneMarkup(): string {
  const V = LAYOUT.view;
  const pipeBase = (Object.keys(FLOWS) as FlowId[])
    .filter((id) => id !== 'fill')
    .map((id) => `<path d="${FLOWS[id]}"/>`)
    .join('');
  const flowPaths = (Object.keys(FLOWS) as FlowId[])
    .map((id) => `<path class="ps-flow" data-flow="${id}" d="${FLOWS[id]}"/>`)
    .join('');
  // Fahrbahn und Mittelstriche enden genau am Rand der Zeichnung; ein Strich,
  // der nicht mehr ganz auf die Fahrbahn passt, entfällt.
  const roadL = V.x;
  const roadR = V.x + V.w;
  const roadDashes = Array.from({ length: Math.ceil(V.w / 48) }, (_, i) => roadL + 8 + i * 48)
    .filter((x) => x + 24 <= roadR)
    .map((x) => `M${x} ${R.top + 24} h24`)
    .join(' ');

  return `
  <svg class="ps-svg" viewBox="${V.x} ${V.y} ${V.w} ${V.h}" role="img" aria-labelledby="ps-svg-title ps-svg-desc" xmlns="http://www.w3.org/2000/svg">
    <title id="ps-svg-title">Silo- und Soleanlage im Schnitt</title>
    <desc id="ps-svg-desc">Salzsilo mit 600 Tonnen, Dosierschnecke, Soleaufbereiter, Pumpen- und Ventilkasten, Soletank, Zapfstelle, RFID-Leser und Steuerung, daneben der SalzManager-Bildschirm. Davor die Zufahrt für Winterdienstfahrzeuge.</desc>

    <!-- Alles wird am Rand der Zeichnung abgeschnitten: Passt sich die Grafik
         der Fensterhöhe an, bleibt links und rechts ein Rand, in dem sonst
         Fahrbahnreste und einfahrende Fahrzeuge zu sehen wären. -->
    <clipPath id="ps-view-clip"><rect x="${V.x}" y="${V.y}" width="${V.w}" height="${V.h}"/></clipPath>
    <g clip-path="url(#ps-view-clip)">

    <!-- Gelände und Zufahrt -->
    <rect x="${roadL}" y="${G}" width="${V.w}" height="${R.top - G}" fill="${C.concrete}"/>
    <line x1="${roadL}" y1="${G}" x2="${roadR}" y2="${G}" stroke="${C.ink}" stroke-width="1" opacity=".35"/>
    <rect x="${roadL}" y="${R.top}" width="${V.w}" height="${R.bottom - R.top}" fill="${C.road}"/>
    <path d="${roadDashes}" stroke="${C.mist}" stroke-width="2" opacity=".5"/>

    ${screenMarkup()}
    ${siloMarkup()}
    ${fillPipeMarkup()}
    ${mixerMarkup()}
    ${tankMarkup()}
    ${boxMarkup()}

    <g class="ps-pipes" fill="none" stroke="${C.mistLight}" stroke-width="7" stroke-linejoin="round">${pipeBase}</g>
    <g class="ps-flows" fill="none">${flowPaths}</g>
    ${screwMarkup()}
    ${VALVES.map(valve).join('')}
    ${pump('p1', P1.x, P1.y)}
    ${pump('p2', P2.x, P2.y)}
    ${pump('p3', P3.x, P3.y)}
    ${boxLabels()}
    ${label(WATER_X - 6, G + 10, 'WASSER', 'end', 'ps-t-tiny')}
    ${label(N.x + 16, G + 10, 'ABLASS', 'start', 'ps-t-tiny')}
    ${zapfstelleMarkup()}
    ${rfidReader('rfidSilo', LAYOUT.rfid.silo)}
    ${rfidReader('rfidZapf', LAYOUT.rfid.zapf)}
    ${cabinetMarkup()}

    <g class="ps-markers">${MARKERS.map(marker).join('')}</g>

    <g data-ref="vehicles"></g>

    <!-- Schläuche liegen über den Fahrzeugen -->
    <g fill="none" stroke-linecap="round">
      <path data-ref="zapfHose" d="" pathLength="1" stroke="${C.night}" stroke-width="5"/>
      <path data-ref="zapfHoseFlow" class="ps-flow ps-flow--hose" d=""/>
      <path data-ref="fillHose" d="" pathLength="1" stroke="${C.night}" stroke-width="6"/>
      <path data-ref="fillHoseFlow" class="ps-flow ps-flow--hose" d=""/>
    </g>
    </g>
  </svg>`;
}
