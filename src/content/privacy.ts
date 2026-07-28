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
    // Datenschutzhinweise des Hosters (in der Erklärung verlinkt).
    providerPrivacyUrl: 'https://www.netlify.com/privacy/',
    // Liste der Unterauftragsverarbeiter des Hosters. Netlify hat sie in sein
    // Trust Center verlagert; die Namen sind dort öffentlich, das vollständige
    // Dokument erfordert eine Zugriffsanfrage.
    providerSubprocessorsUrl: 'https://trust.netlify.com/',

    // Betrifft AUSSCHLIESSLICH die kostenpflichtige Auswertung "Netlify
    // Analytics", also die Frage, ob WIR Zugriffsstatistiken erhalten.
    // Sagt nichts darüber aus, welche Protokolle der Hoster für seinen
    // eigenen Betrieb führt — dafür ist logRetentionDays zuständig.
    analyticsEnabled: false,

    // Speicherdauer der serverseitigen Protokolldaten des Hosters, in Tagen.
    //
    // WICHTIG: Nur eine Zahl eintragen, wenn die Frist im Auftragsverarbeitungs-
    // vertrag / Vertrag mit dem Hoster verbindlich bestätigt ist. Netlify nennt
    // öffentlich keine allgemein verbindliche Frist für diesen Hostingfall; die
    // tatsächliche Verarbeitung hängt von DPA, Tarif und Projekteinstellungen ab.
    // Solange das nicht schriftlich vorliegt, bleibt der Wert null — die
    // Datenschutzseite gibt dann transparente Kriterien statt einer Frist aus.
    // Eine Behauptung "keine Logs" wäre hier nicht belegbar.
    logRetentionDays: null as number | null,

    // Rechtsrahmen der Drittlandübermittlung.
    //
    // Belegt am 28.07.2026:
    //  - Netlify-DPA (Fassung 09.06.2026, netlify.com/pdf/netlify-dpa.pdf) stützt
    //    sich auf die Standardvertragsklauseln (Durchführungsbeschluss 2021/914).
    //  - Netlify Privacy Policy (Stand 10.04.2026) erklärt zusätzlich die
    //    Zertifizierung unter EU-U.S. DPF, UK Extension und Swiss-U.S. DPF.
    //
    // ERNEUT PRÜFEN: DPF-Zertifizierungen müssen jährlich erneuert werden und
    // können erlöschen. Status auf dataprivacyframework.gov gegenprüfen; entfällt
    // die Zertifizierung, hier nur noch die Standardvertragsklauseln nennen.
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
