// Zahlen im österreichischen Format (Komma, Tausenderpunkt).

const nf0 = new Intl.NumberFormat('de-AT', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmt0 = (n: number): string => nf0.format(Math.round(n));
export const fmt1 = (n: number): string => nf1.format(n);
export const fmt2 = (n: number): string => nf2.format(n);

/** Soledichte in kg/l aus der Konzentration (linear, 22 % ≙ 1,17 kg/l). */
export const density = (conc: number): number => 1 + conc * (0.17 / 22);
