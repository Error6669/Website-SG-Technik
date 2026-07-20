// ---------------------------------------------------------------------------
// Zentrale Konfiguration des Cookie-/Consent-Systems.
//
// Dies ist die EINZIGE Quelle der Wahrheit für Kategorien, Texte und Dienste.
// Banner, Einstellungs-Dialog, Cookie-Richtlinie und der Consent-Manager lesen
// alles aus dieser Datei. Neue Analyse-/Marketing-Dienste ausschließlich hier
// eintragen — die restliche UI aktualisiert sich automatisch.
//
// Rechtlicher Hintergrund (DSGVO, ePrivacy-RL, öst. DSG/TKG 2021):
//   • Technisch notwendige Speicherung ist einwilligungsfrei zulässig.
//   • Alle übrigen Kategorien werden per Default DEAKTIVIERT ausgeliefert und
//     erst nach ausdrücklicher Einwilligung (Opt-in) aktiviert.
// ---------------------------------------------------------------------------

/** Ein einzelner Dienst innerhalb einer Kategorie (für die Cookie-Richtlinie). */
export interface ConsentService {
  /** Anzeigename des Dienstes, z. B. "Google Analytics 4". */
  name: string;
  /** Anbieter / datenschutzrechtlich Verantwortlicher, z. B. "Google Ireland Ltd.". */
  provider: string;
  /** Zweck der Verarbeitung in einem Satz. */
  purpose: string;
  /** Konkrete Cookies / Speichereinträge inkl. Laufzeit. */
  cookies: string;
  /** Optional: Link zu den Datenschutzhinweisen des Anbieters. */
  privacyUrl?: string;
}

/** Eine Einwilligungs-Kategorie (Notwendig, Statistik, Marketing …). */
export interface ConsentCategory {
  /** Technische ID — wird im gespeicherten Einwilligungs-Status verwendet. */
  id: string;
  /** Überschrift in Banner, Einstellungen und Richtlinie. */
  label: string;
  /** Erklärtext für Nutzer:innen. */
  description: string;
  /** true = immer aktiv, nicht abwählbar (ausschließlich "Notwendig"). */
  required: boolean;
  /** Konkret in dieser Kategorie eingesetzte Dienste (kann leer sein). */
  services: ConsentService[];
}

// Version des Consent-Zustands. Bei INHALTLICHEN Änderungen an Kategorien oder
// Diensten hochzählen: gespeicherte Einwilligungen werden dann ungültig und das
// Banner erscheint erneut (erneute Einwilligung nach Änderung, DSGVO-konform).
export const consentVersion = 1;

// localStorage-Schlüssel. Die Speicherung der Einwilligung selbst gilt als
// technisch notwendig und ist daher ohne Einwilligung zulässig.
export const consentStorageKey = 'sg-consent';

export const consentCategories: ConsentCategory[] = [
  {
    id: 'notwendig',
    label: 'Notwendig',
    description:
      'Für den technischen Betrieb der Website erforderlich und daher nicht abwählbar. ' +
      'Betrifft ausschließlich die Speicherung Ihrer hier getroffenen Cookie-Auswahl, ' +
      'damit dieser Hinweis nicht bei jedem Seitenaufruf erneut erscheint.',
    required: true,
    services: [
      {
        name: 'Cookie-Einwilligung',
        provider: 'SG Technik GmbH (Erstanbieter)',
        purpose: 'Speichert Ihre Auswahl in diesem Cookie-Banner.',
        cookies: 'sg-consent — Speicherort: localStorage, Laufzeit: bis zum Widerruf (kein Ablauf)',
      },
    ],
  },
  {
    id: 'statistik',
    label: 'Statistik',
    description:
      'Hilft uns, die Nutzung der Website anonymisiert auszuwerten und zu verbessern. ' +
      'Diese Dienste werden erst nach Ihrer Einwilligung geladen. ' +
      'Derzeit sind keine Statistik-Dienste im Einsatz.',
    required: false,
    // Derzeit leer. Beispiel für eine spätere Ergänzung (Google Analytics 4):
    //   {
    //     name: 'Google Analytics 4',
    //     provider: 'Google Ireland Ltd.',
    //     purpose: 'Reichweitenmessung und Nutzungsstatistik.',
    //     cookies: '_ga (2 Jahre), _ga_XXXX (2 Jahre)',
    //     privacyUrl: 'https://policies.google.com/privacy',
    //   },
    services: [],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description:
      'Wird verwendet, um Inhalte und Werbung an Interessen auszurichten und die ' +
      'Wirksamkeit von Kampagnen zu messen. Diese Dienste werden erst nach Ihrer ' +
      'Einwilligung geladen. Derzeit sind keine Marketing-Dienste im Einsatz.',
    required: false,
    services: [],
  },
];

// Gibt es aktuell überhaupt einwilligungspflichtige Dienste? Solange nein, zeigt
// die Website nur einen schlanken Info-Hinweis (kein blockierendes Banner).
// Sobald in einer optionalen Kategorie ein Dienst eingetragen wird, schaltet die
// UI automatisch auf das vollständige Einwilligungs-Banner um.
export const hasOptionalServices = consentCategories.some(
  (c) => !c.required && c.services.length > 0,
);

// Nach so vielen Monaten wird die gespeicherte Auswahl/Kenntnisnahme als
// abgelaufen behandelt und erneut abgefragt.
export const consentMaxAgeMonths = 12;

/**
 * Schlanke Konfiguration für das clientseitige Consent-Skript.
 * (Nur die Felder, die der Manager im Browser tatsächlich benötigt.)
 */
export const consentClientConfig = {
  storageKey: consentStorageKey,
  version: consentVersion,
  maxAgeMonths: consentMaxAgeMonths,
  // 'notice'  = nur Info-Hinweis (keine einwilligungspflichtigen Dienste)
  // 'consent' = vollständiges Banner mit Kategorie-Einwilligung
  mode: hasOptionalServices ? ('consent' as const) : ('notice' as const),
  categories: consentCategories.map((c) => ({ id: c.id, required: c.required })),
};
