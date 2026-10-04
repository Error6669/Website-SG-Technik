// Fahrzeuge in der Seitenansicht, als SVG-Text erzeugt.
//
// Aufbau wie `carSVG` in src/scripts/road-animation.ts: Grundfarbe plus
// `shade()`-Abstufungen statt eigener Farbwerte je Teil, Rechtecke mit kleinen
// Radien, keine Verläufe. Die Straßenanimation zeigt die Fahrzeuge von oben;
// hier steht die Anlage im Schnitt, deshalb dieselbe Machart von der Seite.
//
// Alle Fahrzeuge fahren nach links, die Front liegt also links. Der Ursprung
// (x = 0) ist die Fahrzeugreferenz, an der gehalten wird:
//   sprayer  — Überfüllschutzstecker am Soletank
//   spreader — Mitte des Streuaufbaus (steht unter dem Siloauslauf)
//   tanker   — Befüllkupplung am Heck
// y ist absolut (viewBox), die Räder stehen auf LAYOUT.road.wheel.

import { LAYOUT } from '../../content/anlagensimulation';
import type { VehicleKind } from './model';

export const COLORS = {
  body: '#b15a2e', // copper-500, kommunales Orange
  ink: '#183a59',
  night: '#0d2436',
  steel: '#526376',
  mist: '#a9b7c4',
  paper: '#fbfcfc',
};

/** Aus road-animation.ts übernommen: hellt/dunkelt einen Hex-Ton ab. */
export const shade = (hex: string, amt: number): string => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(v + amt))),
  );
  return `rgb(${c.join(',')})`;
};

export const WHEEL_R = 16;
const WY = LAYOUT.road.wheel - WHEEL_R; // Radmitte

/** Rad mit Radius `r`; es steht auf der Fahrbahn. Die Mitte steht als
 *  data-Attribut am Rad, damit view.ts die Speichen darum drehen kann.
 *  `detailed`: grobstolliger Reifen und Felge mit Radmuttern — alles, was
 *  sich dreht, liegt in der Gruppe `data-spokes`. */
const wheel = (x: number, r = WHEEL_R, rim: string = COLORS.mist, detailed = false): string => {
  const cy = LAYOUT.road.wheel - r;
  if (detailed) {
    const lugs = Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3;
      return `<circle cx="${(x + Math.cos(a) * r * 0.32).toFixed(2)}" cy="${(cy + Math.sin(a) * r * 0.32).toFixed(2)}" r="${(r * 0.06).toFixed(2)}" fill="${COLORS.steel}"/>`;
    }).join('');
    return `
  <g data-wheel="${x}" data-wheel-cy="${cy}">
    <circle cx="${x}" cy="${cy}" r="${r}" fill="${COLORS.night}"/>
    <g data-spokes>
      <circle cx="${x}" cy="${cy}" r="${r - 2}" fill="none" stroke="#24394d" stroke-width="4" stroke-dasharray="4.5 3.5"/>
      <circle cx="${x}" cy="${cy}" r="${r * 0.56}" fill="${rim}" stroke="${COLORS.mist}" stroke-width="1.2"/>
      <circle cx="${x}" cy="${cy}" r="${r * 0.44}" fill="none" stroke="${COLORS.mist}" stroke-width=".8"/>
      ${lugs}
      <circle cx="${x}" cy="${cy}" r="${r * 0.16}" fill="${COLORS.steel}"/>
    </g>
  </g>`;
  }
  return `
  <g data-wheel="${x}" data-wheel-cy="${cy}">
    <circle cx="${x}" cy="${cy}" r="${r}" fill="${COLORS.night}"/>
    <circle cx="${x}" cy="${cy}" r="${r * 0.52}" fill="${rim}"/>
    <g data-spokes>
      <rect x="${x - 1.2}" y="${cy - r * 0.48}" width="2.4" height="${r * 0.96}" fill="${COLORS.steel}"/>
      <rect x="${x - r * 0.48}" y="${cy - 1.2}" width="${r * 0.96}" height="2.4" fill="${COLORS.steel}"/>
    </g>
  </g>`;
};

/** Fahrerhaus, Front bei `front`, Breite `w`. */
const cab = (front: number, w: number, top: number): string => {
  const b = COLORS.body;
  const bottom = WY - 4;
  return `
    <path d="M${front} ${bottom} V${top + 14} Q${front} ${top} ${front + 14} ${top} H${front + w} V${bottom} Z" fill="${b}"/>
    <path d="M${front + 4} ${top + 16} Q${front + 4} ${top + 5} ${front + 15} ${top + 5} H${front + w * 0.5} V${top + 30} H${front + 4} Z" fill="${COLORS.night}" opacity=".88"/>
    <rect x="${front + w * 0.56}" y="${top + 5}" width="${w * 0.36}" height="25" rx="2" fill="${COLORS.night}" opacity=".88"/>
    <rect x="${front}" y="${bottom - 16}" width="${w}" height="3" fill="${shade(b, -40)}"/>
    <rect x="${front - 3}" y="${bottom - 12}" width="6" height="7" rx="1.5" fill="#fdf6e3"/>
    <rect x="${front + w * 0.3}" y="${top - 7}" width="12" height="7" rx="2" fill="${shade(b, 40)}" data-beacon/>`;
};

/** Räumschild vor der Front (in Ruhestellung angehoben). */
const plow = (front: number): string => {
  const x = front - 26;
  return `
    <rect x="${front - 8}" y="${WY - 12}" width="10" height="6" fill="${COLORS.night}"/>
    <path d="M${x} ${WY - 30} Q${x - 6} ${WY - 14} ${x + 2} ${WY + 4} H${x + 18} V${WY - 30} Z" fill="${shade(COLORS.body, -30)}"/>
    <path d="M${x - 1} ${WY - 22} H${x + 18} M${x - 2} ${WY - 10} H${x + 18}" stroke="${COLORS.paper}" stroke-width="3" opacity=".85"/>`;
};

const chassis = (from: number, to: number): string =>
  `<rect x="${from}" y="${WY - 12}" width="${to - from}" height="10" rx="2" fill="${COLORS.night}"/>`;

/** Sprühfahrzeug nach dem Vorbild des Multihog-Geräteträgers (Foto im
 *  Ordner Anlagensimulation): verglaste Kabine mit Rundumleuchte, gewölbtes
 *  Schneeschild mit Warnstreifen, Edelstahl-Soletank in orangem Rahmen,
 *  offenes Heckgestell mit Pumpe, Schlauchtrommel und Sprühbalken, zwei große
 *  Räder mit hellen Felgen. Das Foto zeigt das Fahrzeug schräg von vorn; hier
 *  steht es in der Seitenansicht, Front links.
 *  Referenz (x = 0) ist der Überfüllschutzstecker unten am Soletank. */
export const SPRAYER_R = 23;
/** Gesamtgröße des Sprühfahrzeugs; skaliert um den Aufstandspunkt auf der Fahrbahn. */
export const SPRAYER_SCALE = 0.82;
function sprayer(): string {
  const r = SPRAYER_R;
  const cy = LAYOUT.road.wheel - r;
  const b = COLORS.body;
  const dark = shade(b, -55);
  const deep = shade(b, -30);
  const steel = '#dfe5ea';
  const n = COLORS.night;
  const bodyTop = cy - 50;
  const cab = { front: -104, rear: -28, top: cy - 118 };
  const tank = { x: -24, w: 114, top: cy - 106 };
  tank.top = Math.round(tank.top);
  const tankH = bodyTop - 4 - tank.top;
  const fw = -78; // Vorderrad
  const rw = 34; // Hinterrad

  // Schneeschild: gewölbtes Schild im Profil, Streifen darauf.
  const blade = `M-132 ${cy - 50} Q-152 ${cy - 22} -141 ${cy + 12} H-127 Q-137 ${cy - 20} -121 ${cy - 48} Z`;
  const stripes = Array.from({ length: 6 }, (_, i) => {
    const y = cy - 52 + i * 12;
    return `<path d="M-156 ${y + 10} L-116 ${y - 6}" stroke="${COLORS.paper}" stroke-width="3.6"/>`;
  }).join('');

  // Schlauchtrommel: aufgewickelter Schlauch als Ringe.
  const reel = { x: 84, y: cy - 30 };
  const coils = [12, 9.5, 7]
    .map((rr) => `<circle cx="${reel.x}" cy="${reel.y}" r="${rr}" fill="none" stroke="#24394d" stroke-width="2.2"/>`)
    .join('');

  const g = LAYOUT.road.wheel;
  return `<g transform="translate(0 ${g}) scale(${SPRAYER_SCALE}) translate(0 ${-g})">
    <!-- Hubgestänge und Schneeschild -->
    <path d="M-128 ${cy - 16} L-106 ${cy - 12} M-128 ${cy - 30} L-106 ${cy - 26}" stroke="${n}" stroke-width="4"/>
    <path d="M-126 ${cy - 38} L-104 ${cy - 44}" stroke="${COLORS.steel}" stroke-width="3"/>
    <path d="M-135 ${cy - 50} V${cy - 84}" stroke="${n}" stroke-width="1.6"/>
    <rect x="-135" y="${cy - 84}" width="9" height="6" fill="${COLORS.paper}" stroke="${n}" stroke-width=".8"/>
    <rect x="-135" y="${cy - 81}" width="9" height="2" fill="${n}"/>
    <clipPath id="CLIP-plow"><path d="${blade}"/></clipPath>
    <path d="${blade}" fill="${b}"/>
    <g clip-path="url(#CLIP-plow)" opacity=".92">${stripes}</g>
    <path d="${blade}" fill="none" stroke="${dark}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M-141 ${cy + 12} H-126" stroke="${n}" stroke-width="3"/>

    <!-- Rahmen, Unterbau, Radkästen -->
    <rect x="-108" y="${cy - 16}" width="214" height="10" rx="2" fill="${n}"/>
    <path d="M-108 ${cy - 8} V${bodyTop + 6} Q-108 ${bodyTop} -102 ${bodyTop} H46 V${cy - 8} Z" fill="${b}"/>
    <path d="M-104 ${bodyTop + 12} H40 M-104 ${cy - 20} H-60" stroke="${deep}" stroke-width="1.4"/>
    <circle cx="${fw}" cy="${cy}" r="${r + 5}" fill="${dark}"/>
    <circle cx="${rw}" cy="${cy}" r="${r + 5}" fill="${dark}"/>
    <path d="M${fw - r - 8} ${cy - 4} A${r + 8} ${r + 8} 0 0 1 ${fw + r + 8} ${cy - 4}" fill="none" stroke="${n}" stroke-width="4"/>
    <path d="M${rw - r - 8} ${cy - 4} A${r + 8} ${r + 8} 0 0 1 ${rw + r + 8} ${cy - 4}" fill="none" stroke="${b}" stroke-width="4"/>
    <rect x="-112" y="${cy - 32}" width="8" height="18" rx="2" fill="${n}"/>
    <rect x="-108" y="${bodyTop + 4}" width="7" height="6" rx="1.5" fill="#fdf6e3"/>

    <!-- Kabine -->
    <path d="M${cab.front} ${bodyTop} L${cab.front + 6} ${cab.top} H${cab.rear} V${bodyTop} Z" fill="${b}"/>
    <path d="M${cab.front + 5} ${bodyTop - 6} L${cab.front + 10} ${cab.top + 6} H-66 V${bodyTop - 6} Z" fill="${n}" opacity=".88"/>
    <rect x="-60" y="${cab.top + 6}" width="28" height="${bodyTop - 12 - cab.top}" fill="${n}" opacity=".88"/>
    <path d="M${cab.front + 16} ${cab.top + 30} L${cab.front + 30} ${cab.top + 10} M${cab.front + 20} ${cab.top + 44} L${cab.front + 40} ${cab.top + 16} M-54 ${cab.top + 40} L-40 ${cab.top + 14}" stroke="${COLORS.paper}" stroke-width="2" opacity=".18"/>
    <path d="M${cab.front + 9} ${bodyTop - 10} L${cab.front + 22} ${bodyTop - 40}" stroke="${COLORS.steel}" stroke-width="1.4"/>
    <path d="M-63 ${cab.top + 4} V${bodyTop}" stroke="${deep}" stroke-width="1.2"/>
    <rect x="-58" y="${bodyTop - 26}" width="7" height="2.4" rx="1" fill="${n}"/>
    <path d="M-30 ${cab.top + 20} V${bodyTop - 14}" stroke="${n}" stroke-width="2"/>
    <rect x="-72" y="${cy - 12}" width="20" height="4" rx="1" fill="${COLORS.steel}"/>
    <rect x="${cab.front - 4}" y="${cab.top - 8}" width="${cab.rear - cab.front + 8}" height="9" rx="2" fill="${deep}"/>
    <rect x="${cab.front - 2}" y="${cab.top - 6}" width="7" height="5" rx="1" fill="#fdf6e3"/>
    <path d="M-40 ${cab.top - 8} V${cab.top - 16}" stroke="${n}" stroke-width="2"/>
    <rect x="-46" y="${cab.top - 27}" width="12" height="11" rx="4" fill="${shade(b, 55)}" data-beacon/>
    <path d="M${cab.front + 4} ${cab.top + 26} L${cab.front - 12} ${cab.top + 22}" stroke="${n}" stroke-width="2"/>
    <rect x="${cab.front - 17}" y="${cab.top + 12}" width="6" height="18" rx="1.5" fill="${n}"/>

    <!-- Edelstahl-Soletank im orangen Rahmen -->
    <rect x="${tank.x - 3}" y="${bodyTop - 5}" width="${tank.w + 6}" height="6" fill="${deep}"/>
    <rect x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tankH}" rx="3" fill="${steel}" stroke="${COLORS.ink}" stroke-width="1.2"/>
    <path d="M${tank.x + 2} ${tank.top + tankH * 0.18} H${tank.x + tank.w - 2}" stroke="${COLORS.ink}" stroke-width=".8" opacity=".25"/>
    <clipPath id="CLIP-tank"><rect x="${tank.x + 8}" y="${tank.top + 14}" width="64" height="${tankH - 22}" rx="2"/></clipPath>
    <rect x="${tank.x + 8}" y="${tank.top + 14}" width="64" height="${tankH - 22}" rx="2" fill="${COLORS.paper}"/>
    <rect clip-path="url(#CLIP-tank)" x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tankH}" fill="#4d6b83" data-load data-load-top="${tank.top + 14}" data-load-h="${tankH - 22}"/>
    <rect x="${tank.x + 8}" y="${tank.top + 14}" width="64" height="${tankH - 22}" rx="2" fill="none" stroke="${COLORS.ink}" stroke-width=".8" opacity=".5"/>
    <rect x="${tank.x + 78}" y="${tank.top + 14}" width="26" height="9" rx="1" fill="${n}" opacity=".85"/>
    <rect x="${tank.x + 78}" y="${tank.top + 27}" width="12" height="7" rx="1" fill="${COLORS.paper}" stroke="${COLORS.ink}" stroke-width=".6"/>
    <rect x="${tank.x + 34}" y="${tank.top - 6}" width="18" height="6" rx="2" fill="${COLORS.mist}" stroke="${COLORS.ink}" stroke-width=".8"/>
    <path d="M${tank.x + 4} ${tank.top} V${tank.top - 14} H${tank.x + 20} V${tank.top} M${tank.x + tank.w - 18} ${tank.top} V${tank.top - 11} H${tank.x + tank.w - 4} V${tank.top}" stroke="${n}" stroke-width="2.4" fill="none"/>
    <rect x="${tank.x - 4}" y="${tank.top + 4}" width="5" height="${bodyTop - tank.top - 4}" fill="${b}"/>
    <rect x="${tank.x + tank.w - 1}" y="${tank.top + 4}" width="5" height="${bodyTop - tank.top - 4}" fill="${b}"/>
    <rect x="-6" y="${bodyTop - 8}" width="12" height="10" rx="2" fill="${COLORS.ink}"/>

    <!-- Heckgestell: Pumpe, Hydraulikschläuche, Schlauchtrommel, Sprühbalken -->
    <path d="M48 ${bodyTop} V${cy - 8} M104 ${bodyTop} V${cy - 8} M46 ${bodyTop + 2} H106 M46 ${cy - 10} H106" stroke="${b}" stroke-width="5" fill="none"/>
    <rect x="54" y="${bodyTop + 6}" width="14" height="24" rx="2" fill="${COLORS.steel}"/>
    <rect x="56" y="${bodyTop + 10}" width="10" height="6" rx="1" fill="${COLORS.mist}"/>
    <path d="M61 ${bodyTop + 30} C61 ${cy - 6} 74 ${cy - 4} ${reel.x - 6} ${reel.y + 8} M66 ${bodyTop + 12} C78 ${bodyTop + 4} 96 ${bodyTop + 6} 98 ${bodyTop + 14}" stroke="${n}" stroke-width="1.8" fill="none"/>
    <circle cx="${reel.x}" cy="${reel.y}" r="14" fill="${n}"/>
    ${coils}
    <circle cx="${reel.x}" cy="${reel.y}" r="3.5" fill="${COLORS.mist}"/>
    <rect x="104" y="${bodyTop + 6}" width="5" height="8" rx="1" fill="${deep}"/>
    <rect x="94" y="${cy - 9}" width="20" height="8" rx="2" fill="${n}"/>
    <path d="M97 ${cy - 1} v5 M103 ${cy - 1} v5 M109 ${cy - 1} v5" stroke="${COLORS.steel}" stroke-width="1.6"/>
    <rect x="${rw + r + 4}" y="${cy - 8}" width="4" height="22" fill="${n}"/>

    ${(wheel(fw, r, COLORS.paper, true) + wheel(rw, r, COLORS.paper, true)).replaceAll('data-wheel-cy=', `data-wheel-scale="${SPRAYER_SCALE}" data-wheel-cy=`)}</g>`;
}

/** Streu-LKW mit offenem Streuaufbau (Trichter) und Streuteller am Heck. */
function spreader(): string {
  const top = WY - 92;
  const hopper = `M-80 ${top} H80 L64 ${WY - 18} H-64 Z`;
  return `
    ${chassis(-140, 100)}
    ${plow(-140)}
    ${cab(-140, 54, WY - 96)}
    <path d="${hopper}" fill="#e4e9ed"/>
    <clipPath id="CLIP-hopper"><path d="${hopper}"/></clipPath>
    <rect clip-path="url(#CLIP-hopper)" x="-80" y="${top}" width="160" height="${WY - 18 - top}" fill="#c9d3dc" data-load data-load-top="${top}" data-load-h="${WY - 18 - top}"/>
    <path d="${hopper}" fill="none" stroke="${COLORS.ink}" stroke-width="1.5"/>
    <path d="M-80 ${top} H80" stroke="${COLORS.ink}" stroke-width="3"/>
    <path d="M-40 ${top} L-34 ${WY - 18} M0 ${top} V${WY - 18} M40 ${top} L34 ${WY - 18}" stroke="${COLORS.ink}" stroke-width="1" opacity=".3"/>
    <rect x="84" y="${WY - 22}" width="16" height="8" rx="2" fill="${COLORS.steel}"/>
    <ellipse cx="96" cy="${WY - 8}" rx="13" ry="3" fill="${COLORS.steel}"/>
    ${wheel(-112)}${wheel(30)}${wheel(66)}`;
}

/** Silozug: Sattelzug mit kippbarem Silo-Auflieger, Kupplung am Heck. */
function tanker(): string {
  const tank = { x: -262, w: 246, top: WY - 82, h: 62 };
  return `
    ${chassis(-330, -4)}
    ${cab(-330, 60, WY - 96)}
    <rect x="-266" y="${WY - 30}" width="250" height="8" fill="${COLORS.night}"/>
    <rect x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tank.h}" rx="28" fill="${COLORS.paper}"/>
    <clipPath id="CLIP-silo"><rect x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tank.h}" rx="28"/></clipPath>
    <rect clip-path="url(#CLIP-silo)" x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tank.h}" fill="#c9d3dc" data-load data-load-top="${tank.top}" data-load-h="${tank.h}"/>
    <rect x="${tank.x}" y="${tank.top}" width="${tank.w}" height="${tank.h}" rx="28" fill="none" stroke="${COLORS.ink}" stroke-width="1.5"/>
    <path d="M${tank.x + 82} ${tank.top} V${tank.top + tank.h} M${tank.x + 164} ${tank.top} V${tank.top + tank.h}" stroke="${COLORS.ink}" stroke-width="1" opacity=".35"/>
    <path d="M-18 ${WY - 40} H0 V${WY - 26}" fill="none" stroke="${COLORS.night}" stroke-width="6"/>
    <rect x="-4" y="${WY - 30}" width="8" height="8" rx="1.5" fill="${COLORS.ink}"/>
    ${wheel(-300)}${wheel(-236)}${wheel(-100)}${wheel(-62)}${wheel(-24)}`;
}

const BUILD: Record<VehicleKind, () => string> = { sprayer, spreader, tanker };

/** Punkt, an dem ein Schlauch am Fahrzeug ankuppelt (relativ zur Referenz). */
export const COUPLING: Record<VehicleKind, { x: number; y: number }> = {
  sprayer: { x: 0, y: LAYOUT.road.wheel - (SPRAYER_R + 50) * SPRAYER_SCALE },
  spreader: { x: 0, y: WY - 92 },
  tanker: { x: 0, y: WY - 26 },
};

let clipSerial = 0;

/** SVG-Gruppe eines Fahrzeugs. Clip-IDs werden je Exemplar eindeutig gemacht. */
export function vehicleMarkup(kind: VehicleKind): string {
  const id = `ps-v${++clipSerial}`;
  return BUILD[kind]().replaceAll('CLIP-', `${id}-`);
}
