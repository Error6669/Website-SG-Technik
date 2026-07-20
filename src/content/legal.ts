// Rechtlich verbindliche Angaben. Quelle der Gewerbe-/Kammerdaten: WKO Firmen A–Z
// bzw. Gewerbedatenbank (GISA). Vor Launch von einer rechtskundigen Person prüfen
// lassen. Offen: Firmenbuchgericht (laut WKO „Landesgericht Linz" — bewusst noch
// leer gelassen) sowie die endgültige Klärung der Sitz-/Standortadresse.
export const legalEntity = {
  name: 'SG Technik GmbH',
  address: 'Kroisbach 5, 4622 Eggendorf im Traunkreis, Österreich',
  firmenbuchnummer: 'FN 624545 z',
  firmenbuchgericht: '',
  uid: 'ATU80561768',
  geschaeftsfuehrer: 'Gregor Hofer',
  kammer: 'Mitglied der Wirtschaftskammer Oberösterreich',
};

// Gewerberechtliche Angaben gemäß § 5 ECG (Stand laut WKO/GISA).
export const gewerbe = {
  // WKO-Fachorganisationen, denen der Betrieb angehört.
  fachorganisationen: [
    'Landesinnung der Metalltechniker',
    'Landesgremium des Baustoff-, Eisen- und Holzhandels',
    'Fachgruppe Unternehmensberatung, Buchhaltung und Informationstechnologie (UBIT)',
  ],
  // Aufrechte Gewerbeberechtigungen (Gewerbewortlaut + GISA-Zahl).
  berechtigungen: [
    {
      wortlaut:
        'Metalltechnik für Metall- und Maschinenbau verbunden mit Metalltechnik für Schmiede und ' +
        'Fahrzeugbau; Metalltechnik für Land- und Baumaschinen',
      gisa: '37112684',
    },
    {
      wortlaut: 'Handelsgewerbe mit Ausnahme der reglementierten Handelsgewerbe und Handelsagent',
      gisa: '37040277',
    },
    {
      wortlaut: 'Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik',
      gisa: '37112707',
    },
  ],
  // Anwendbare gewerberechtliche Vorschrift inkl. Zugang (§ 5 Abs. 1 Z 5 ECG).
  rechtsvorschrift: 'Gewerbeordnung 1994 (GewO), abrufbar unter www.ris.bka.gv.at',
  // Behörde gemäß ECG / Gewerbebehörde.
  behoerdeEcg: 'Magistrat der Stadt Linz',
};
