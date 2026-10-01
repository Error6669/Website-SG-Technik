// ---------------------------------------------------------------------------
// Variable Inhalte der Datenschutzerklärung an einer zentralen Stelle.
//
// Diese Werte spiegeln den tatsächlichen Betrieb wider (Hoster, Fristen,
// Drittlandbezug). Ändert sich der Betrieb, hier anpassen — die
// Datenschutzseite liest alles aus dieser Datei.
//
// Rechtlicher Hinweis: fachlich fundierte Standardformulierungen, aber keine
// Rechtsberatung. Vor dem Live-Gang von einer rechtskundigen Person prüfen und
// die konkreten Fristen/Verträge (AVV mit Hoster UND E-Mail-Provider) verbindlich
// bestätigen.
// ---------------------------------------------------------------------------

// Dienstleister mit administrativem Zugriff auf den E-Mail-Mandanten.
// Wird auf `null` gesetzt, sobald der Zugriff endet — dann entfaellt der
// entsprechende Absatz auf der Datenschutzseite automatisch.
type MailAdmin = {
  provider: string;
  providerAddress: string;
  /** Genehmigte Rollen, wie im Microsoft-365-Admin-Center ausgewiesen. */
  roles: string[];
  /** Ablaufdatum der GDAP-Beziehung (ISO), rein zur Dokumentation. */
  rolesExpire: string;
  /**
   * Nur auf `true` setzen, wenn ein Auftragsverarbeitungsvertrag mit diesem
   * Dienstleister tatsaechlich vorliegt. Steuert, ob die Seite den AVV als
   * Tatsache behauptet.
   */
  avvConfirmed: boolean;
};

export const privacy = {
  // Stand der Erklärung (wird am Seitenende ausgegeben).
  stand: 'Oktober 2026',

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

  // E-Mail-Postfach, in dem Formulareinsendungen und Anfragen eingehen. Dessen
  // Betreiber ist ein WEITERER Auftragsverarbeiter (Art. 28 DSGVO) und ein
  // zweiter Drittland-Pfad — beides muss in der Datenschutzerklärung stehen
  // (Art. 13 Abs. 1 lit. e und f DSGVO), nicht nur der Hoster.
  //
  // Technisch belegt am 28.07.2026 über die DNS-Eintraege von sgt.co.at:
  //   MX  sgt-co-at.mail.protection.outlook.com
  //   SPF include:spf.protection.outlook.com
  // -> Microsoft 365 / Exchange Online. Vertragspartner für EU-Kunden ist
  //    Microsoft Ireland Operations Limited.
  //
  // ERLEDIGT am 01.10.2026: Microsoft Products and Services Data Protection
  // Addendum, Fassung 22.05.2026, liegt in der Nachweismappe.
  //
  // ERLEDIGT am 01.10.2026: Datenregion im Microsoft-365-Admin-Center geprüft
  // (Einstellungen → Einstellungen der Organisation → Organisationsprofil →
  // Datenspeicherort). Für Exchange Online weisen aktuelle UND zugesicherte
  // Geografie „European Union\EFTA" aus; die Produktbestimmungen nennen als
  // Committed Geography ausdrücklich **Austria**. Exchange Online ist dort
  // zudem als EU-Datengrenzendienst gelistet.
  //
  // ACHTUNG BEI DER FORMULIERUNG: Das betrifft ruhende Daten (data at rest).
  // Die EU-Datengrenze schränkt Zugriffe aus Drittländern stark ein, schließt
  // sie aber nicht restlos aus — Support- und Sicherheitsfälle bleiben möglich,
  // und die US-Konzernmutter unterliegt unverändert dem CLOUD Act. Die Seite
  // darf daher „Speicherung in Österreich" sagen, aber NICHT „keine
  // Drittlandübermittlung".
  mail: {
    provider: 'Microsoft Ireland Operations Limited',
    providerAddress:
      'One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland',
    providerPrivacyUrl: 'https://privacy.microsoft.com/de-de/privacystatement',

    // Speicherort der ruhenden Daten laut Admin Center, geprüft am 01.10.2026.
    // Auf `null` setzen, wenn der Nachweis nicht (mehr) geführt werden kann —
    // die Seite fällt dann auf die vorsichtige Formulierung ohne Ortsangabe
    // zurück. Jährlich gegenprüfen (PRIVACY-CHECKLIST.md, Abschnitt C).
    dataResidency: 'Österreich' as string | null,
    // Exchange Online ist im Admin Center als EU-Datengrenzendienst gelistet.
    euDataBoundary: true,

    // Rechtsrahmen der Drittlandübermittlung. Microsoft bindet die
    // Standardvertragsklauseln in sein Data Protection Addendum ein; die
    // Microsoft Corporation ist zusätzlich unter dem EU-U.S. DPF zertifiziert.
    // ERNEUT PRÜFEN: DPF-Zertifizierungen laufen jährlich ab — Status auf
    // dataprivacyframework.gov gegenprüfen (siehe PRIVACY-CHECKLIST Abschnitt C).
    transferSafeguards:
      'Standardvertragsklauseln der EU-Kommission (Art. 46 DSGVO) bzw. EU-U.S. Data Privacy Framework',
  },

  // Dienstleister mit delegierten Administratorrechten (GDAP) auf den
  // Microsoft-365-Mandanten. Am 01.10.2026 im Admin Center festgestellt
  // (Einstellungen → Partnerbeziehungen).
  //
  // WARUM DAS HIER STEHT: Weder Exchange- noch globale Administratorrolle ist
  // vergeben, Postfachinhalte sind also nicht direkt zugänglich. Helpdesk- und
  // Benutzeradministrator dürfen aber Passwörter zurücksetzen — darüber ist ein
  // Zugang zum Postfach erreichbar. Für Art. 28 DSGVO genügt die Möglichkeit
  // des Zugriffs; der Dienstleister ist damit Auftragsverarbeiter und nach
  // Art. 13 Abs. 1 lit. e als Empfänger zu nennen.
  //
  // Zu unterscheiden von der „A1 Digital International GmbH" (ohne & Co KG):
  // die ist im Mandanten nur als Handelspartner ohne jede Rolle eingetragen,
  // also reiner Vertrags- und Rechnungspartner und hier NICHT zu nennen.
  //
  // AUF `null` SETZEN, sobald die Rollen entzogen sind (Admin Center →
  // Partnerbeziehungen → Rollen entfernen). Der Absatz auf der
  // Datenschutzseite verschwindet dann von selbst.
  mailAdmin: {
    provider: 'A1 Digital International GmbH & Co KG',
    providerAddress: 'Lassallestraße 9, 1020 Wien, Österreich',
    roles: [
      'Helpdesk-Administrator',
      'Lizenzadministrator',
      'Benutzeradministrator',
      'Dienst-Supportadministrator',
      'Verzeichnisleseberechtigte',
      'Globaler Leser',
    ],
    rolesExpire: '2027-03-09',
    //
    // ENTSCHEIDUNG vom 01.10.2026: Es wird KEIN AVV bei A1 angefordert.
    // Stattdessen beschreibt die Datenschutzerklärung den ungünstigsten Fall —
    // dass über administrative Funktionen auch auf Postfachinhalte zugegriffen
    // werden kann. Der Text bleibt damit richtig, ohne dass eine Rückmeldung
    // des Dienstleisters abgewartet werden muss.
    //
    // ACHTUNG, das ersetzt den Vertrag NICHT: Art. 28 Abs. 3 DSGVO verlangt
    // den AVV unabhängig davon, was auf der Website steht. Der Punkt steht in
    // PRIVACY-CHECKLIST.md unter A5 und ist bei der juristischen Endkontrolle
    // (A6) vorzulegen.
    //
    // Erst auf `true` setzen, wenn ein Vertrag tatsächlich vorliegt und in der
    // Nachweismappe abgelegt ist.
    avvConfirmed: false,
  } as MailAdmin | null,

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
