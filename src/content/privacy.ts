// ---------------------------------------------------------------------------
// Variable Inhalte der Datenschutzerklärung an einer zentralen Stelle.
//
// Diese Werte spiegeln den tatsächlichen Betrieb wider (Hoster, Fristen,
// Drittlandbezug). Ändert sich der Betrieb, hier anpassen — die
// Datenschutzseite liest alles aus dieser Datei.
//
// Rechtlicher Hinweis: fachlich fundierte Standardformulierungen, aber keine
// Rechtsberatung. Vor dem Live-Gang von einer rechtskundigen Person prüfen und
// die konkreten Fristen/Verträge (AVV mit dem Hoster) verbindlich bestätigen.
// ---------------------------------------------------------------------------

export const privacy = {
  // Stand der Erklärung (wird am Seitenende ausgegeben).
  stand: 'Juli 2026',

  // Hosting-Anbieter (Auftragsverarbeiter). Netlify ist ein US-Unternehmen →
  // Übermittlung in ein Drittland (USA).
  hosting: {
    provider: 'Netlify, Inc.',
    providerAddress: '512 2nd Street, Suite 200, San Francisco, CA 94107, USA',
    // Netlify Analytics ist deaktiviert → es werden keine serverseitigen
    // Zugriffslogs für uns gespeichert; Zugriffsdaten werden nur flüchtig zur
    // Auslieferung und Absicherung verarbeitet.
    analyticsEnabled: false,
    // Rechtsrahmen der Drittlandübermittlung.
    transferSafeguards:
      'Standardvertragsklauseln der EU-Kommission (Art. 46 DSGVO) bzw. EU-U.S. Data Privacy Framework',
  },

  // Speicherfristen (Prosa, damit die Nuancen erhalten bleiben).
  retention: {
    contact:
      'Wir speichern Ihre Anfrage, bis diese abschließend bearbeitet ist. Danach ' +
      'werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten ' +
      '(insbesondere handels- und steuerrechtlich bis zu sieben Jahre, § 132 BAO / § 212 UGB) ' +
      'oder berechtigte Interessen an einer weiteren Aufbewahrung – etwa zur Geltendmachung ' +
      'oder Abwehr von Rechtsansprüchen – entgegenstehen.',
    // Ablauf des Info-/Consent-Eintrags im Browser (im Code umgesetzt).
    consentMonths: 12,
  },
};
