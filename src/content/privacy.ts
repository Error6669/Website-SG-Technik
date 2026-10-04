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
// Speicherdauer der Protokolle beim Hosting-Anbieter. Zweistufig, weil der
// Vertrag zwei Stufen zusichert — eine einzelne Tageszahl bildete das falsch ab.
type LogRetention = {
  /** Tage im direkten Zugriff ("on-line"). */
  onlineDays: number;
  /** Monate in der anschließenden Offline-Sicherung. */
  offlineMonths: number;
  /** Fundstelle des Belegs in der Nachweismappe. */
  source: string;
};

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
    // eigenen Betrieb führt — dafür ist logRetention zuständig.
    analyticsEnabled: false,

    // Speicherdauer der serverseitigen Protokolldaten des Hosters.
    //
    // BELEGT am 02.10.2026 aus dem Netlify-DPA (Fassung 09.06.2026, liegt als
    // Nachweise/Netlify-DPA.pdf in der Mappe), Seite 15, Anhang der technischen
    // und organisatorischen Maßnahmen, Nr. 5 lit. A "LOGGING AND MONITORING":
    //
    //   "Netlify has logging enabled for all components that support the
    //    Services, and ... (4) retained on-line for 90 days and offline for
    //    1 year."
    //
    // Der TOM-Anhang ist über Art. 28 Abs. 3 lit. c und Art. 32 DSGVO
    // Vertragsbestandteil — das ist eine Zusage, keine Werbeaussage.
    //
    // ACHTUNG BEI DER FORMULIERUNG: Die Klausel spricht von "all components that
    // support the Services". Dass die HTTP-Zugriffsprotokolle GENAU DIESER Site
    // davon erfasst sind, ist die naheliegende Lesart, steht aber nicht wörtlich
    // da. Die Datenschutzseite beschreibt deshalb die VERTRAGLICHE ZUSAGE des
    // Anbieters und behauptet nicht, wie lange eine einzelne Logzeile lebt. So
    // bleibt der Satz auch dann richtig, wenn die Zuordnung enger ausfällt.
    //
    // VORGESCHICHTE: Hier stand `logRetentionDays: null` mit der Begründung,
    // Netlify nenne keine verbindliche Frist — deshalb lief seit 30.07.2026 eine
    // E-Mail-Anfrage (docs/datenschutz/PRIVACY-CHECKLIST.md, B1). Die Frist stand die ganze Zeit
    // im Vertrag; gefunden am 02.10.2026 bei der Volltextsuche im DPA, ausgelöst
    // durch Befund 4 des Prüfberichts.
    //
    // AUF `null` SETZEN, wenn eine neue DPA-Fassung die Klausel streicht oder
    // ändert — die Seite fällt dann auf Kriterien statt Fristen zurück (C2).
    logRetention: {
      onlineDays: 90,
      offlineMonths: 12,
      source: 'Netlify-DPA, Fassung 09.06.2026, Anhang Sicherheitsmaßnahmen Nr. 5 lit. A',
    } as LogRetention | null,

    // Rechtsrahmen der Drittlandübermittlung.
    //
    // BEFUND 5 des Prüfberichts vom 01.10.2026: Hier stand ein gemeinsamer Satz
    // „Standardvertragsklauseln … bzw. EU-U.S. Data Privacy Framework". Das ließ
    // offen, welcher Mechanismus gilt, und nannte nicht, wo die Garantien
    // einsehbar sind (Art. 13 Abs. 1 lit. f DSGVO).
    //
    // BELEGT am 02.10.2026 aus dem Netlify-DPA (Fassung 09.06.2026,
    // Nachweise/netlify-dpa.pdf), Abschnitt 14:
    //  - § 14.2: Die Übermittlung erfolgt auf Grundlage des EU-U.S. DPF. Greifen
    //    mehrere Mechanismen, gilt das DPF. Wird es für ungültig erklärt oder
    //    zertifiziert sich Netlify nicht neu, gelten die Bestimmungen danach.
    //  - § 14.3: Rückfall auf die Standardvertragsklauseln (Durchführungsbeschluss
    //    2021/914), Modul 2, weil wir Verantwortlicher sind (§ 14.3.1).
    // Das DPF ist also VORRANGIG, die Klauseln sind der vereinbarte Rückfall —
    // die frühere Fassung dieses Kommentars hatte die Reihenfolge verdreht.
    //
    // `transferBasis` steuert den Satz in Abschnitt 3 der Erklärung:
    //   'dpf' → DPF als Grundlage, Klauseln als Rückfall genannt
    //   'scc' → nur noch die Klauseln (DPF wird nicht mehr erwähnt)
    //
    // ERNEUT PRÜFEN: DPF-Zertifizierungen müssen jährlich erneuert werden und
    // können erlöschen. Status im Register gegenprüfen (docs/datenschutz/PRIVACY-CHECKLIST.md,
    // C1); ist Netlify, Inc. dort nicht „Active", auf 'scc' umstellen — das
    // entspricht dem Rückfall, den § 14.2 selbst anordnet.
    transferBasis: 'dpf' as 'dpf' | 'scc',
    // Auftragsverarbeitungsvertrag, in dem die Garantien vereinbart sind.
    dpaUrl: 'https://www.netlify.com/pdf/netlify-dpa.pdf',
  },

  // Öffentlich einsehbare Fundstellen der Drittlandgarantien (Art. 13 Abs. 1
  // lit. f DSGVO: „wo sie verfügbar sind"). Gelten für Hosting und E-Mail.
  transferSources: {
    // Teilnehmerregister des U.S. Department of Commerce.
    dpfRegisterUrl: 'https://www.dataprivacyframework.gov/list',
    // Standardvertragsklauseln, Durchführungsbeschluss (EU) 2021/914.
    sccUrl: 'https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de',
  },

  // Automatische Spamprüfung der Formulareinsendungen.
  //
  // Belegt am 01.10.2026:
  //  - Netlify Docs „Spam filters" (docs.netlify.com/manage/forms/spam-filters/):
  //    Netlify Forms prüft JEDE Einsendung automatisch mit Akismet. Der Honeypot
  //    im Formular (`netlify-honeypot="bot-field"`, ContactSection.astro) ist eine
  //    ZUSÄTZLICHE eigene Maßnahme, kein Ersatz.
  //  - Netlify Trust Center → Subprocessors, Stand 01.10.2026: „Automattic, Inc.
  //    (Akismet)", Kategorie „Spam Filtering", Standort „US". Belegkopie:
  //    `Nachweise/netlify-subprocessors.pdf` (26 Einträge).
  //
  // EINORDNUNG: Akismet ist Unterauftragsverarbeiter des Hosting-Anbieters, nicht
  // unser eigener Auftragsverarbeiter. Art. 13 Abs. 1 lit. e verlangt keine
  // namentliche Nennung jedes Unterauftragsverarbeiters — beschrieben sein muss
  // die Verarbeitung. Genannt wird er trotzdem, weil Klardaten aus dem Formular
  // betroffen sind und der Dienst in den USA sitzt.
  //
  // ACHTUNG BEI DER FORMULIERUNG: Für Automattic liegt KEIN eigener Nachweis über
  // Standardvertragsklauseln oder DPF vor — das darf die Seite nicht behaupten.
  // Die Übermittlung stützt sich auf die Unterauftragsverarbeiter-Kette des
  // Hosting-Anbieters (dessen DPA verpflichtet ihn zur Weitergabe derselben
  // Pflichten, siehe Abschnitt 3 der Erklärung).
  //
  // AUF `null` SETZEN, sobald das Formular nicht mehr über Netlify Forms läuft —
  // die Zeile „Spam-Prüfung" auf der Datenschutzseite entfällt dann automatisch.
  formSpam: {
    provider: 'Automattic, Inc. (Akismet)',
    // Bewusst nur das Land: die Subprozessorenliste weist als Standort „US" aus
    // und nennt keine Anschrift. Art. 13 DSGVO verlangt sie auch nicht.
    providerCountry: 'USA',
  } as { provider: string; providerCountry: string } | null,

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
  // ERLEDIGT am 01.10.2026: Datenregion im Microsoft-365-Admin-Center abgelesen
  // (Einstellungen → Einstellungen der Organisation → Organisationsprofil →
  // Datenspeicherort). Für Exchange Online weisen aktuelle UND zugesicherte
  // Geografie „European Union\EFTA" aus; der Dienst ist dort zudem als
  // EU-Datengrenzendienst gelistet.
  //
  // KORRIGIERT am 01.10.2026 — Befund 8 des Prüfberichts: Hier stand zuvor
  // „Österreich", abgeleitet aus einer Committed Geography in den
  // Produktbestimmungen. Abgelesen war aber „European Union\EFTA", und EU/EFTA
  // belegt keinen österreichischen Speicherort: Microsoft unterscheidet
  // tatsächliche Bereitstellungsregion, vertragliche Zusage und gesondert
  // buchbare Datenresidenz. Ein mandantenbezogener Nachweis für Österreich
  // existiert nicht — die Nachweismappe enthält zum Speicherort kein einziges
  // Dokument. Deshalb steht hier nur, was tatsächlich abgelesen wurde.
  // Ein FALSCHER Speicherort ist damit nicht festgestellt, nur ein fehlender
  // Nachweis (docs/datenschutz/PRIVACY-CHECKLIST.md, A5).
  //
  // ACHTUNG BEI DER FORMULIERUNG: Das betrifft ruhende Daten (data at rest).
  // Die EU-Datengrenze schränkt Zugriffe aus Drittländern stark ein, schließt
  // sie aber nicht restlos aus — Support- und Sicherheitsfälle bleiben möglich,
  // und die US-Konzernmutter unterliegt unverändert dem CLOUD Act. Die Seite
  // darf daher den Speicherort nennen, aber NICHT „keine Drittlandübermittlung".
  mail: {
    provider: 'Microsoft Ireland Operations Limited',
    providerAddress:
      'One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland',
    providerPrivacyUrl: 'https://privacy.microsoft.com/de-de/privacystatement',

    // Speicherort der ruhenden Daten, wörtlich wie im Admin Center abgelesen
    // (01.10.2026). Der Wert wird in den Satz „… im Ruhezustand in {Wert}
    // gespeichert" eingesetzt und muss dorthin grammatisch passen.
    //
    // NICHT auf `null` setzen, ohne den euDataBoundary-Satz vorher zu
    // entkoppeln: In src/pages/datenschutz.astro steckt er INNERHALB dieser
    // Bedingung und verschwindet sonst mit, obwohl er eigenständig belegt ist.
    //
    // Ein einzelnes Land gehört hier nur hinein, wenn ein mandantenbezogener
    // Nachweis in der Nachweismappe liegt. Jährlich gegenprüfen
    // (docs/datenschutz/PRIVACY-CHECKLIST.md, C6).
    dataResidency: 'der Europäischen Union bzw. dem EWR' as string | null,
    // Exchange Online ist im Admin Center als EU-Datengrenzendienst gelistet.
    euDataBoundary: true,

    // Rechtsrahmen der Drittlandübermittlung — anders gelagert als beim Hoster.
    //
    // Unser Vertragspartner sitzt in Irland; die Übermittlung an ihn ist keine
    // Drittlandübermittlung. Betroffen ist die Weitergabe von Microsoft Ireland
    // an die Microsoft Corporation (USA).
    //
    // BELEGT am 02.10.2026 aus dem Microsoft-DPA (Fassung 22.05.2026, englische
    // Ausgabe maßgeblich, Nachweise/Microsoft-DPA_Mai2026_EN.docx), Abschnitt
    // „Data Transfers and Location":
    //  - „All transfers … out of the European Union, European Economic Area …
    //    are subject to the terms of the 2021 Standard Contractual Clauses
    //    implemented by Microsoft." Laut Definition: Prozessor-zu-Prozessor-
    //    Modul zwischen Microsoft Ireland Operations Limited und Microsoft
    //    Corporation, Durchführungsbeschluss 2021/914.
    //  - „In addition, Microsoft is certified to the EU-U.S. … Data Privacy
    //    Frameworks".
    // Hier tragen also die Klauseln, das DPF kommt HINZU — umgekehrt wie bei
    // Netlify. Deshalb kein gemeinsamer Satz für beide (Befund 5).
    //
    // ERNEUT PRÜFEN: Ist die Microsoft Corporation im Register nicht mehr
    // „Active", `dpfCertified` auf `false` — der Zusatzsatz entfällt dann, die
    // Klauseln bleiben (docs/datenschutz/PRIVACY-CHECKLIST.md, C1).
    dpfCertified: true,
    // Übersicht aller DPA-Fassungen und Sprachen.
    dpaUrl: 'https://aka.ms/dpa',
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
    // ENTSCHEIDUNG vom 01.10.2026, ZWEIGLEISIG: Die Datenschutzerklärung
    // beschreibt den ungünstigsten Fall — dass über administrative Funktionen
    // auch auf Postfachinhalte zugegriffen werden kann. Der Text bleibt damit
    // richtig, ohne dass eine Rückmeldung des Dienstleisters abgewartet werden
    // muss. PARALLEL wurde der AVV am 01.10.2026 bei A1 angefordert
    // (datenschutz@a1.at); die Antwort steht aus.
    //
    // KORRIGIERT am 02.10.2026 (Befund 10 des Prüfberichts): Hier stand zuvor
    // „Es wird KEIN AVV bei A1 angefordert." Das war der Zwischenstand vor der
    // zweigleisigen Entscheidung und widersprach docs/datenschutz/PRIVACY-CHECKLIST.md A5,
    // PROJECT_STATUS.md und dem Verarbeitungsverzeichnis.
    //
    // ACHTUNG, das ersetzt den Vertrag NICHT: Art. 28 Abs. 3 DSGVO verlangt
    // den AVV unabhängig davon, was auf der Website steht. Der Punkt steht in
    // docs/datenschutz/PRIVACY-CHECKLIST.md unter A5 und ist bei der juristischen Endkontrolle
    // (A6) vorzulegen.
    //
    // Erst auf `true` setzen, wenn ein Vertrag tatsächlich vorliegt und in der
    // Nachweismappe abgelegt ist.
    avvConfirmed: false,
  } as MailAdmin | null,

  // Speicherfristen (Prosa, damit die Nuancen erhalten bleiben).
  //
  // BEFUND 3 des Prüfberichts vom 01.10.2026: Der Text sagte Löschung zu, ‚bis
  // diese abschließend bearbeitet ist‘, während organisatorisch nur ZWEI
  // Löschtermine im Jahr vorgesehen sind (30.06. und 31.12.). Eine am 2. Januar
  // erledigte Anfrage wäre damit bis 30. Juni gespeichert geblieben — die Zusage
  // war in dieser Form unzutreffend.
  //
  // ENTSCHEIDUNG vom 01.10.2026: Der halbjährliche Turnus bleibt. Nach Abschluss
  // ist die Speicherung für zusammenhängende Rückfragen nur bei tatsächlichem
  // Bedarf zulässig, längstens bis zum Ende desselben Kalenderhalbjahres.
  // Entfällt der Bedarf früher, ist entsprechend früher zu löschen. Berechtigte
  // Löschbegehren werden unabhängig von den regulären Durchgängen bearbeitet.
  // Löschablauf, Orte und Begründung: docs/datenschutz/PRIVACY-CHECKLIST.md, Abschnitt A3.
  //
  // ACHTUNG BEI DER FORMULIERUNG: Die grundsätzlich siebenjährigen Fristen
  // (§ 132 BAO / § 212 UGB) gelten für aufbewahrungspflichtige Unterlagen;
  // dazu kann auch die ursprüngliche Anfrage gehören. Daraus folgt keine
  // pauschale siebenjährige Speicherung aller Anfragen oder ihrer Zweitkopien.
  //
  // Die Zeitangabe ist eine überprüfbare Tatsachenbehauptung. Fällt der Turnus
  // aus, wird dieser Satz falsch — jährlich gegengeprüft unter C9.
  retention: {
    contact:
      'Wir speichern Ihre Anfrage für die Dauer ihrer Bearbeitung. Anschließend ' +
      'bewahren wir sie nur so lange auf, wie dies zur Bearbeitung möglicher ' +
      'zusammenhängender Rückfragen erforderlich ist, längstens jedoch bis zum Ende ' +
      'des Kalenderhalbjahres, in dem die Bearbeitung abgeschlossen wurde. Entfällt ' +
      'dieser Bedarf früher, werden die Daten entsprechend früher gelöscht.\n\n' +
      'Unsere regulären Löschdurchgänge finden halbjährlich statt und umfassen sowohl ' +
      'die beim Formulardienst unseres Hosting-Anbieters gespeicherten Einsendungen ' +
      'als auch die Nachrichten in unserem E-Mail-Postfach.\n\n' +
      'Ausgenommen sind Unterlagen, die gesetzlichen Aufbewahrungspflichten ' +
      'unterliegen oder im Einzelfall zur Geltendmachung, Ausübung oder Verteidigung ' +
      'von Rechtsansprüchen erforderlich sind. Dies kann auch die ursprüngliche ' +
      'Anfrage betreffen. Für aufbewahrungspflichtige Geschäftsunterlagen gelten ' +
      'insbesondere die grundsätzlich siebenjährigen Fristen nach § 132 BAO und ' +
      '§ 212 UGB. Gesetzlich erforderliche längere Aufbewahrungszeiten bleiben ' +
      'unberührt.\n\n' +
      'Sie können unter den Voraussetzungen des Art. 17 DSGVO jederzeit die Löschung ' +
      'verlangen. Eine Mitteilung an die unter Punkt 1 genannte Adresse genügt. ' +
      'Berechtigte Löschbegehren bearbeiten wir unabhängig von unseren regulären ' +
      'Löschdurchgängen.',
    // Ablauf des Info-/Consent-Eintrags im Browser (im Code umgesetzt).
    consentMonths: 12,
  },
};
