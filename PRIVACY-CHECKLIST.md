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
- [ ] Beide Dateien aus `Nachweise/` in die Nachweismappe der Firmenablage
      kopieren *(wie beim Firmenbuchauszug — der Projektordner ist nur
      Durchgangsstation)*
- [ ] Datenregion des Tenants prüfen (Microsoft 365 Admin Center → Einstellungen →
      Organisationsprofil bzw. EU Data Boundary). **Kein Blocker:** die Erklärung
      behauptet bewusst keine reine EU-Speicherung. Ergibt die Prüfung „Europa",
      ließe sich die Aussage zugunsten der Besucher präzisieren.
      *Nicht über den Microsoft-Connector prüfbar — dessen Berechtigungen reichen
      nur für Postfach und Kalender, nicht für Tenant- oder Verzeichnisdaten.*
- [ ] **Rolle von A1 klären:** nur Reseller, oder CSP-Partner mit delegierten
      Administratorrechten (GDAP) auf den Tenant? Bei bestehendem Adminzugriff ist A1
      selbst Auftragsverarbeiter und benötigt einen eigenen AVV.
      Nachsehen unter Admin Center → Einstellungen → **Partnerbeziehungen**.
      **Der einzige echte Blocker in A5:** hat A1 Adminrechte, ist A1 ein zweiter
      Auftragsverarbeiter und müsste in Abschnitt 5 der Datenschutzerklärung als
      Empfänger genannt werden — das ändert den Website-Text.
      *Ebenfalls nicht über den Connector prüfbar, siehe oben.*

### A6 — Juristische Endkontrolle ⚠️ offen

- [ ] Datenschutzerklärung, Cookie-Richtlinie und Impressum von einer rechtskundigen
      Person gegenlesen lassen (WKO bietet Mitgliedern kostenlose Erstberatung)
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

- [ ] Mail von einer `@sgt.co.at`-Adresse absenden — nicht privat, die Antwort soll
      das Vertragsverhältnis der GmbH belegen
- [ ] Als Empfangsadresse für Änderungsmeldungen ein dauerhaft gelesenes Postfach
      angeben (z. B. `office@sgt.co.at`), keine persönliche Adresse
- [ ] Parallel Zugang über `trust.netlify.com` anfragen — der „Request access"-Knopf
      läuft erfahrungsgemäß schneller als der Mail-Weg
- [ ] Antwort als PDF in die Nachweismappe legen; aktuelle Subprozessorenliste
      mit Datum dazu

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
