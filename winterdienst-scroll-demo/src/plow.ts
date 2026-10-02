// Räumschild: steht immer quer zur Straße — nicht quer zum Fahrzeug. In einer
// Kurve zeigt die Fahrzeugnase noch geradeaus, während die Straße vor ihr
// schon abbiegt; das Schild folgt der Straße und dreht sich entsprechend
// gegenüber dem Fahrzeug.

import type { WinterRoadConfig } from './config';
import type { RoadPath } from './road-path';

/** Richtung der Schildachse (zum rechten Schildende hin) in Radiant, für ein
 *  Schild an der Fahrstrecke `s`. */
export function bladeDirection(path: RoadPath, s: number, cfg: WinterRoadConfig): number {
  const t = path.tangent(s);
  return Math.atan2(t.y, t.x) + Math.PI / 2 + (cfg.plow.restAngle * Math.PI) / 180;
}

/** Anteil des Schnees, der nach rechts geht (0…1). Bei quer stehendem Schild
 *  die Hälfte, ab etwa 12° Schrägstellung alles zur einen Seite. */
export function throwRight(cfg: WinterRoadConfig): number {
  return Math.max(0, Math.min(1, 0.5 + cfg.plow.restAngle / 24));
}
