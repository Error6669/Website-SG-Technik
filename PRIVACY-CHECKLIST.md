# Datenschutz — Freigabe-Checkliste vor Live-Gang

Stand dieser Liste: **29.09.2026**
Betrifft: Website SG Technik GmbH, Hosting Netlify, Kontaktformular via Netlify Forms

Diese Liste betrifft **organisatorische Nachweise**, nicht den Code. Die Texte der
Datenschutzerklärung und Cookie-Richtlinie sind so formuliert, dass jede Aussage
entweder belegt ist oder als Kriterium statt als Tatsachenbehauptung auftritt.
Was hier offen ist, kann kein Commit lösen.

> Hinweis: fachlich sorgfältig recherchiert, aber **keine Rechtsberatung**.
> Punkt A6 (juristische Endkontrolle) bleibt deshalb bestehen.

---

## A. Vor dem Live-Gang

### A1 — Vertretungsbefugnis für den Netlify-Vertrag ✅ erledigt (28.07.2026, Nachweis abgelegt 29.09.2026)

Das Netlify-DPA gilt automatisch mit Annahme der Nutzungsbedingungen
(Self-Serve Subscription Agreement, DPA per Verweis eingebunden). Es bindet die
GmbH, weil die annehmende Person vertretungsbefugt ist:

- Netlify-Account: Team „SG Technik GmbH", Login über GitHub-Org „SG Technik GmbH",
  durchgehend `@sgt.co.at`-Adressen → tritt durchgehend als Account der GmbH auf.
- Die GmbH hat **zwei handelsrechtliche Geschäftsführer**: Ing. Gregor Hofer und
  Dipl.-Ing. Simon Paireder, EMBA. Beide sind vertretungsbefugt; die Annahme der
  Netlify-Bedingungen bindet die GmbH. (Dipl.-Ing. Paireder ist zusätzlich
  gewerberechtlicher GF nach § 39 GewO — diese Rolle allein hätte für die
  Vertretung nicht genügt.)

Damit ist die Aussage in Abschnitt 3 der Datenschutzerklärung — „Mit dem Anbieter
besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO" — belegt.

- [x] Vertretungsbefugnis geklärt (handelsrechtliche Geschäftsführung)
- [x] Firmenbuchauszug in der Nachweismappe abgelegt (29.09.2026) — Auszug
      FN 624545 z, Abruf 30.07.2026

### A2 — Nachweismappe ✅ erledigt (28.07.2026, vollständig seit 29.09.2026)

Abgelegt in der Firmenablage:
- Netlify-DPA, Fassung 09.06.2026 (`netlify.com/pdf/netlify-dpa.pdf`)
- Screenshots Team-Einstellungen (Teamname, Owner-Adresse)
- Netlify Privacy Policy, Stand 10.04.2026 (DPF-Zertifizierung)
- Firmenbuchauszug FN 624545 z, Abruf 30.07.2026 — belegt die **Vertretungsbefugnis
  der handelsrechtlichen Geschäftsführung** (nicht Prokura, siehe A1). Abgelegt
  am 29.09.2026.

Der Auszug liegt bewusst **nicht** im Repository: er enthält Geburtsdaten und
Privatadressen der Geschäftsführer. `.gitignore` schließt `FB_*.pdf` aus; die
daraus übernommenen Pflichtangaben stehen in `src/content/legal.ts`.

### A3 — Kontaktformular / Netlify Forms ✅ erledigt (29.09.2026)

Betrifft Klardaten (Name, E-Mail, Telefon, Freitext) — sensibler als Zugriffsdaten.
Netlify löscht Formulareinsendungen **nicht** automatisch.

- [x] Netlify → Site → **Forms**: vorhandene Einsendungen gesichtet, erledigte
      gelöscht (29.09.2026)
- [x] Site settings → Forms → **Form notifications**: Weiterleitung geht an ein
      Firmenpostfach, nicht an eine private Adresse (geprüft 29.09.2026)
- [x] Löschturnus festgelegt: **halbjährlich, jeweils 30.06. und 31.12.**
- [x] Turnus als wiederkehrender Kalendereintrag angelegt (29.09.2026)

Damit ist der Satz in Abschnitt 5 der Datenschutzerklärung gedeckt
(„Wir speichern Ihre Anfrage, bis diese abschließend bearbeitet ist") — ohne
laufenden Turnus wäre er eine unzutreffende Tatsachenbehauptung.

**Systembedingter Rest:** Jede Einsendung existiert zweimal — als
Benachrichtigungsmail im Postfach *und* dauerhaft im Netlify-Dashboard. Netlify
löscht dort nichts automatisch und bietet keine einstellbare Frist; der
halbjährliche Turnus ist deshalb die tragende Maßnahme und muss **beide** Orte
umfassen. Vollständig vermeiden ließe sich die Zweitkopie nur durch Umstellung
auf reinen Mailversand (Netlify Function → SMTP) — nicht umgesetzt, wäre ein
eigener Umbau inklusive Spam-Schutz.

### A4 — Verarbeitungsverzeichnis nach Art. 30 DSGVO ✅ für die Website vollständig (29.09.2026)

> Datei: **`Verarbeitungsverzeichnis_SG_Technik_GmbH.xlsx`** im Projektordner
> (per `.gitignore` von der Versionierung ausgenommen — gehört in die Firmenablage).
> Stand **29.09.2026, Version 1.1**. Blatt „Offene Punkte" führt die verbleibenden
> Lücken; offene Felder sind im Dokument mit `[AUSFÜLLEN]` markiert.
>
> **Angelegt sind fünf Verarbeitungstätigkeiten**, nicht nur die beiden der Website:
> 1 Website-Bereitstellung, 2 Kontaktanfragen, 3 Geschäftspartnerverwaltung,
> 4 Buchhaltung, 5 Personalverwaltung/Lohnverrechnung. Zeilen 3–5 sind inhaltlich
> befüllt und haben nur noch Einzellücken (siehe unten) — eine frühere Fassung
> dieser Checkliste behauptete, sie seien gar nicht erfasst. Das war falsch.

Die folgende Beschreibung dokumentiert Aufbau und Herkunft der Angaben.

Pflicht; die Ausnahme für Betriebe unter 250 Mitarbeitern greift **nicht**, weil die
Verarbeitung nicht nur gelegentlich erfolgt. Formfrei, aber schriftlich und der
Behörde auf Verlangen vorzulegen. Eine Tabelle genügt — es wird nicht veröffentlicht.

Kopfdaten (einmal, gelten für alle Zeilen):
Verantwortlicher SG Technik GmbH, Kroisbach 5, 4622 Eggendorf im Traunkreis,
FN 624545 z, vertreten durch Ing. Gregor Hofer und Dipl.-Ing. Simon Paireder, EMBA,
office@sgt.co.at. Kein Datenschutzbeauftragter bestellt.

Für die Website sind zwei Zeilen nötig:

| Feld (Art. 30 Abs. 1) | Zeile 1: Website-Bereitstellung | Zeile 2: Kontaktanfragen |
|---|---|---|
| Zweck | Auslieferung der Website, IT-Sicherheit, Missbrauchsabwehr | Bearbeitung und Beantwortung von Anfragen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f | Art. 6 Abs. 1 lit. b, sonst lit. f |
| Kategorien betroffener Personen | Website-Besucher | Anfragende (Interessenten, Kunden) |
| Kategorien personenbezogener Daten | IP-Adresse, Zeitpunkt, URL, Referrer, Statuscode, Datenmenge, Geräteart, Browser/OS | Name, E-Mail, Telefon (freiwillig), Nachrichtentext |
| Empfänger | Netlify, Inc. (Auftragsverarbeiter) samt dessen Unterauftragsverarbeitern | Netlify, Inc.; E-Mail-Provider des Firmenpostfachs |
| Drittlandübermittlung | USA — Standardvertragsklauseln (2021/914) bzw. EU-U.S. DPF | dito |
| Löschfrist | nach Vorgabe des Anbieters, nur solange für Betrieb/Sicherheit erforderlich | nach Erledigung; Aufbewahrungspflichten § 132 BAO / § 212 UGB bis 7 Jahre |
| TOMs (Art. 32) | HTTPS/TLS, keine eigenen Serverlogs, Zugriff auf Netlify-Account beschränkt, 2FA | zusätzlich: Postfachzugriff beschränkt, Löschturnus |

Weitere Zeilen sind nötig für Verarbeitungen **außerhalb** der Website
(Kundenverwaltung, Buchhaltung, Personal) — die gehören ins selbe Dokument, sind
aber nicht Gegenstand dieser Website-Freigabe.

- [x] Tabelle angelegt, Kopfdaten und beide Website-Zeilen ausgefüllt
- [x] Datum und Version eingetragen (29.09.2026, Version 1.1), Ersteller und
      nächster Prüftermin (01.01.2027) vermerkt
- [x] **Zugriffsberechtigte dokumentiert** (29.09.2026) — Netlify-Account,
      GitHub-Organisation und Postfach `office@sgt.co.at`: Ing. Gregor Hofer und
      Dipl.-Ing. Simon Paireder, EMBA, beide handelsrechtliche Geschäftsführer;
      weitere Personen haben keinen Zugriff. Steht in den TOMs von Blatt 2, Nr. 1
      und 2 — das war der letzte eigenständige A4-Punkt.
- [x] Namensform der Geschäftsführung in den Kopfdaten an den Firmenbuchauszug
      angeglichen (stand auf „Gregor Hofer und DI Simon Paireder, BSc")
- [ ] Bei jeder Änderung an Diensten oder Fristen nachziehen *(Daueraufgabe)*

**Verbleibende Lücken und wo sie hingehören.** Keine davon ist ein eigenständiger
A4-Punkt — sie sind entweder anderswo in dieser Liste geführt oder betreffen
Bereiche außerhalb der Website:

| Feld im Dokument | Fehlt | Geführt unter |
|---|---|---|
| Nr. 1, Löschfristen | konkrete Speicherdauer der Netlify-Protokolldaten | **B1** (Anfrage an Netlify läuft) |
| Nr. 2, Empfänger / AVV / Drittland | Fassung des Microsoft-DPA, Datenregion, Rolle von A1 Telekom | **A5** |
| Nr. 3–5 | BMD-Betriebsmodell (lokal oder Cloud), Name der Steuerberatungskanzlei, wer die Lohnverrechnung durchführt, arbeitsrechtliche Löschfristen | Blatt „Offene Punkte" Nr. 5 — **nicht Teil der Website-Freigabe** |
| Nr. 3–5, TOMs | **Backup- und Wiederherstellungskonzept** (Art. 32 Abs. 1 lit. c) — in allen drei Zeilen offen | ebenda; eigener Punkt, betrifft das Unternehmen, nicht die Website |

Damit ist das Verzeichnis **für die Freigabe der Website vollständig**. Die
Vollständigkeit nach Art. 30 für das gesamte Unternehmen hängt noch an den
Zeilen 3–5; das ist ein eigenes Vorhaben.

Kostenlose Vorlagen: Österreichische Datenschutzbehörde (`dsb.gv.at`), WKO.

### A5 — AVV für den E-Mail-Provider 🔶 DPA abgerufen, zwei Prüfungen offen

Formulareinsendungen landen im Postfach `office@sgt.co.at`. Dessen Betreiber ist
**ebenfalls Auftragsverarbeiter** und braucht einen AVV.

Technisch geklärt am 28.07.2026: Die DNS-Einträge der Domain `sgt.co.at` zeigen auf
**Microsoft 365 / Exchange Online** —
MX `sgt-co-at.mail.protection.outlook.com`, SPF `include:spf.protection.outlook.com`.
Auftragsverarbeiter ist damit Microsoft (für EU-Kunden: Microsoft Ireland Operations
Limited). A1 Telekom Austria ist mutmaßlich Vertrags- und Rechnungspartner für die
Lizenzen, nicht der Betreiber.

**Seit 29.09.2026 benennt die Datenschutzerklärung ihn auch:** Abschnitt 5
(„Empfänger" + neue Zeile „Drittlandbezug") nennt Microsoft Ireland Operations
Limited als weiteren Auftragsverarbeiter — vorher stand dort nur Netlify, obwohl
der Postfachbetreiber ein zweiter Auftragsverarbeiter und ein zweiter
Drittland-Pfad ist (Art. 13 Abs. 1 lit. e und f DSGVO). Werte stehen in
`src/content/privacy.ts` → `mail`. Eine reine EU-Speicherung behauptet der Text
bewusst **nicht**, solange die Datenregion nicht geprüft ist.

- [x] Microsoft Products and Services **Data Protection Addendum** abgerufen
      (01.10.2026) — Fassung **22.05.2026**, deutsch und englisch, liegt in
      `Nachweise/` samt README mit Quelle und Abrufdatum. Inhalt geprüft: das
      Dokument nennt sein Datum selbst und enthält Standardvertragsklauseln und
      EU-Datengrenze. **Maßgeblich ist die englische Fassung** — sie stellt
      ausdrücklich fest, dass nur sie Microsoft bindet und Übersetzungen
      nachgereicht werden.
- [x] Beide Dateien in die Nachweismappe der Firmenablage kopiert (01.10.2026)
- [ ] Datenregion des Tenants prüfen (Microsoft 365 Admin Center → Einstellungen →
      Organisationsprofil bzw. EU Data Boundary). **Kein Blocker:** die Erklärung
      behauptet bewusst keine reine EU-Speicherung. Ergibt die Prüfung „Europa",
      ließe sich die Aussage zugunsten der Besucher präzisieren.
      *Nicht über den Microsoft-Connector prüfbar — dessen Berechtigungen reichen
      nur für Postfach und Kalender, nicht für Tenant- oder Verzeichnisdaten.*
- [x] **Rolle von A1 geklärt** (01.10.2026, Admin Center → Partnerbeziehungen).
      Ergebnis: **zwei verschiedene Gesellschaften**, nur eine davon kritisch.

| Eintrag im Mandanten | Art | Rollen | Einordnung |
|---|---|---|---|
| **A1 Digital International GmbH & Co KG** | GDAP, Status aktiv, Ablauf 09.03.2027 | Helpdesk-Administrator, Lizenzadministrator, Benutzeradministrator, Dienst-Supportadministrator, Verzeichnisleseberechtigte, Globaler Leser | **Auftragsverarbeiter** |
| A1 Digital International GmbH *(ohne & Co KG)* | Handelspartner | keine zugewiesen | reiner Vertrags-/Rechnungspartner, nicht zu nennen |

Die bisherige Annahme „A1 ist mutmaßlich nur Vertrags- und Rechnungspartner"
stimmt also **nur für die GmbH**, nicht für die GmbH & Co KG.

**Bewertung:** Weder Exchange- noch globale Administratorrolle ist vergeben,
Postfachinhalte sind nicht direkt zugänglich. Helpdesk- und Benutzeradministrator
dürfen aber Passwörter zurücksetzen — darüber ist ein Zugang zum Postfach
erreichbar. Für Art. 28 DSGVO genügt die Möglichkeit des Zugriffs. Unabhängig
davon geben Globaler Leser und Verzeichnisleseberechtigte laufenden Lesezugriff
auf alle Benutzerkonten und Mailadressen der Mitarbeiter — das ist keine bloße
Möglichkeit, sondern tatsächliche Verarbeitung.

- [x] A1 als Empfänger in der Datenschutzerklärung genannt (01.10.2026) — neuer
      **Abschnitt 6 „E-Mail-Kommunikation und Microsoft 365"**. Er deckt zugleich
      eine bislang offene Lücke: direkte E-Mails an `office@sgt.co.at` waren
      nirgends beschrieben, Abschnitt 5 behandelt nur Formularanfragen.
      Werte in `src/content/privacy.ts` → `mailAdmin`.
- [x] A1 in Zeile 2 des Verarbeitungsverzeichnisses eingetragen (01.10.2026,
      Version 1.2) — Empfänger, AVV-Status und die Einschränkung in den TOMs.

#### Vorgehen ab 01.10.2026: zweigleisig

**Auf der Website** beschreibt die Erklärung den **ungünstigsten Fall** — dass
über administrative Funktionen wie das Zurücksetzen von Kennwörtern auch auf
Postfachinhalte zugegriffen werden kann, einschließlich der Nachrichten von
Website-Besuchern. Der Text ist damit unabhängig davon richtig, wie A1 die
Rechte tatsächlich nutzt; der Live-Gang hängt nicht an fremder Antwortzeit.

**Parallel** wird der Vertrag geklärt, denn Art. 28 Abs. 3 DSGVO verlangt den
AVV unabhängig davon, was auf der Website steht — Transparenz heilt einen
fehlenden Auftragsverarbeitungsvertrag nicht.

- [x] **AVV-Text gefunden und abgelegt** (01.10.2026): *AGB Auftragsverarbeitung
      der A1 Digital International GmbH & Co. KG, V2.1, gültig ab Juni 2025*,
      von `a1.digital/de/agb/`, liegt in `Nachweise/`. Nach Punkt 1 Abs. 1 gilt
      er **automatisch** für bestehende Vertragsbeziehungen — kein gesonderter
      Vertragsschluss nötig, wie bei Netlify und Microsoft auch.
- [ ] **In den A1-Vertragsunterlagen nach dem „Anhang zum Datenschutz" suchen.**
      Punkt 2 Abs. 1 der AGB AVV verweist für Art, Zweck, Datenkategorien und
      Betroffenenkreise dorthin — genau das, was Art. 28 Abs. 3 lit. a DSGVO
      zwingend verlangt. Ohne diesen Anhang ist der Vertrag unvollständig.
- [ ] **Mail an A1 absenden** (Entwurf liegt in Outlook, an `datenschutz@a1.at`
      aus deren Datenschutzerklärung). Von einer `@sgt.co.at`-Adresse senden,
      damit die Antwort das Vertragsverhältnis der GmbH belegt. Sie fragt die
      vier verbliebenen Lücken ab: Wird der Zugriff gebraucht, Anhang zum
      Datenschutz, Unterauftragsverarbeiter, Drittlandbezug.
- [ ] Antwort auswerten und in die Nachweismappe legen. Danach eine von drei
      Folgen in `src/content/privacy.ts`:
      AVV liegt vor → `mailAdmin.avvConfirmed` auf `true`;
      Rechte werden entzogen → `mailAdmin` auf `null`, Absatz entfällt;
      keine Reaktion → Zustand bleibt, bei A6 vorlegen.
      *(Verarbeitungsverzeichnis, Blatt „Offene Punkte" Nr. 10)*
- [ ] A1-Zugriff auch in den Zeilen 3–5 des Verarbeitungsverzeichnisses nachziehen
      (Verzeichnisdaten der Mitarbeiter) — betrifft nicht die Website-Freigabe
      *(ebenda, Nr. 11)*

### A6 — Juristische Endkontrolle ⚠️ offen

- [ ] Datenschutzerklärung, Cookie-Richtlinie und Impressum von einer rechtskundigen
      Person gegenlesen lassen (WKO bietet Mitgliedern kostenlose Erstberatung)
- [ ] **Dabei ansprechen, falls bis dahin ungeklärt:** der Auftragsverarbeitungs-
      vertrag mit A1 Digital International GmbH & Co KG, die aktive
      Administratorrechte auf den Microsoft-365-Mandanten hält (siehe A5).
      Angefordert am 01.10.2026; bis zur Antwort beschreibt die Erklärung den
      ungünstigsten Fall. Die Pflicht aus Art. 28 Abs. 3 DSGVO besteht unabhängig
      von dieser Transparenz fort.
- [x] `firmenbuchgericht` in `src/content/legal.ts` — Pflichtangabe nach § 14 UGB,
      am 30.07.2026 aus dem Firmenbuchauszug FN 624545 z übernommen:
      **Landesgericht Linz**. Aus derselben Quelle die Geschäftsführer-Titel
      (Ing. / Dipl.-Ing.) angeglichen.
- [ ] Dabei mitprüfen lassen: `behoerdeEcg` in `src/content/legal.ts` steht auf
      **Bezirkshauptmannschaft Linz-Land** — gegen den GISA-Auszug abgleichen
      lassen, dort ist die Behörde je Gewerbestandort ausgewiesen.

---

## B. Kurz nach dem Live-Gang

### B1 — Trust-Center-Zugang und Änderungsbenachrichtigungen

Netlify hat die Subprozessorenliste ins Trust Center verlagert (`trust.netlify.com`).
Öffentlich sichtbar sind derzeit: AWS, Datadog, CrowdStrike, WorkOS, Fivetran.
Das vollständige Dokument erfordert eine Zugriffsanfrage. Das Widerspruchsrecht nach
Art. 28 Abs. 2 läuft ins Leere, wenn Änderungsmeldungen nirgends ankommen.

Eine **fertig formulierte englische Anfrage an `privacy@netlify.com`** wurde am
30.07.2026 erstellt; sie deckt in einem Aufwasch alle drei offenen Netlify-Punkte ab:
Bestätigung des Vertragsverhältnisses (A2), vollständige Subprozessorenliste samt
Änderungsbenachrichtigung (B1) und die Log-Speicherdauer (A4/`logRetentionDays`).

- [x] Anfrage abgesendet (30.07.2026) — ging jedoch an eine Vertriebsadresse
- [x] **Antwort ausgewertet (12.08.2026).** Netlify (Senior Account Executive)
      erklärt, DPA-Fassungen, Subprozessoren-Dokumentation und Log-Fristen seien
      „generally tied to our paid plans", und bietet MNDA plus Enterprise-Gespräch
      an. **Dieser Darstellung wird nicht gefolgt** — Begründung siehe unten.
- [ ] **Nachfassen an `privacy@netlify.com`** (Entwurf liegt in Outlook, Marina
      Shynkarenka in CC). Kein Enterprise-Interesse, keine Vertragsverhandlung.

#### Warum die Tarif-Begründung nicht trägt

Das Netlify-DPA (Fassung 09.06.2026, liegt in `Nachweise/`) wurde am 01.10.2026
im Volltext geprüft. Es enthält **keine Klausel**, die eine der verlangten
Angaben an einen Tarif knüpft — weder unter „Enterprise", „paid plan" noch
„Self-Serve". Im Gegenteil, Abschnitt 7 sagt zu:

> „…of their processing activities and countries of location is located at
> `https://www.netlify.com/legal/subprocessors/`. … Netlify shall provide
> notification to Customer by email or other written notice mechanism of the
> appointment of a new Sub-processor **at least thirty (30) days** before
> permitting such Sub-processor to process Customer Data."

Die Subprozessorenliste **samt Tätigkeiten und Standorten** ist dort also als
öffentlich bezeichnet, und die 30-Tage-Vorabmeldung ist vorbehaltlos zugesagt.
Die im DPA genannte URL leitet heute auf das Trust Center um, wo das Dokument
eine Zugriffsanfrage erfordert — Netlify hat den Zugang also hinter eine Hürde
verlegt, den der eigene Vertrag als offen beschreibt.

Unabhängig davon verpflichtet Art. 28 Abs. 3 lit. h DSGVO den Auftragsverarbeiter,
alle zum Nachweis erforderlichen Informationen bereitzustellen — unabhängig von
der kommerziellen Ausgestaltung.

**Berechtigt ist der Einwand nur für SOC-2- und Pentest-Berichte.** Das sind
freiwillige Compliance-Dokumente, kein Gegenstand von Art. 28. Sie wurden in der
Anfrage vom 30.07.2026 auch nie verlangt; die Antwort vermengt sie mit den
DSGVO-Punkten. Der neue Entwurf stellt das ausdrücklich klar.

- [ ] Antwort als PDF in die Nachweismappe legen; aktuelle Subprozessorenliste
      mit Datum dazu

#### Kein Blocker für den Live-Gang

Bleibt die Antwort aus, ändert sich nichts an der Seite: `logRetentionDays`
steht auf `null`, die Erklärung gibt Kriterien statt einer erfundenen Frist aus,
und die Subprozessoren sind über das Trust Center namentlich bekannt — für
Art. 30 Abs. 1 lit. d genügen Kategorien von Empfängern. Der Punkt gehört zu A6
auf den Tisch, blockiert aber nichts.

---

## C. Jährliche Wiedervorlage

Kalendereintrag anlegen, jeweils zu prüfen:

- [ ] DPF-Zertifizierung von Netlify auf `dataprivacyframework.gov` noch aktiv?
      (Muss jährlich erneuert werden. Erlischt sie, in `src/content/privacy.ts`
      bei `transferSafeguards` nur noch die Standardvertragsklauseln nennen —
      der Hinweis steht dort als Kommentar.)
- [ ] Netlify-DPA noch Fassung 09.06.2026 oder neuere Version?
- [ ] Subprozessorenliste unverändert?
- [ ] Verarbeitungsverzeichnis noch aktuell?
- [ ] Netlify-Dashboard: ist **Netlify Analytics** weiterhin deaktiviert?
      (`hosting.analyticsEnabled: false` erzeugt auf der Seite eine harte
      Tatsachenbehauptung — wird die Statistik einmal zugebucht, muss der Wert mit.)
- [ ] `stand` in `src/content/privacy.ts` aktualisieren

---

## Wo die Aussagen im Code herkommen

| Aussage auf der Website | Quelle im Code |
|---|---|
| Hoster, Adresse, Links | `src/content/privacy.ts` → `hosting` |
| E-Mail-Provider als weiterer Auftragsverarbeiter + dessen Drittlandbezug | `src/content/privacy.ts` → `mail` (Abschnitt 5 der Erklärung) |
| Speicherdauer der Serverlogs | `hosting.logRetentionDays` — `null` = Kriterien statt Frist. Zahl **nur** eintragen, wenn im AVV verbindlich bestätigt |
| Zugriffsstatistiken | `hosting.analyticsEnabled` — betrifft ausschließlich Netlify Analytics |
| Drittlandbezug | `hosting.transferSafeguards` (+ Beleg-Kommentar) |
| Unterauftragsverarbeiter | `hosting.providerSubprocessorsUrl` |
| Speicherfristen Kontakt | `privacy.retention` |
| Cookie-/Storage-Aussagen | `src/pages/datenschutz.astro` Abschnitt 4, `src/pages/cookie-richtlinie.astro`, `src/content/consent.ts` |
