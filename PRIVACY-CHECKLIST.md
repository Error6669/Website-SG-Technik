# Datenschutz — Freigabe-Checkliste vor Live-Gang

Stand dieser Liste: **30.07.2026**
Betrifft: Website SG Technik GmbH, Hosting Netlify, Kontaktformular via Netlify Forms

Diese Liste betrifft **organisatorische Nachweise**, nicht den Code. Die Texte der
Datenschutzerklärung und Cookie-Richtlinie sind so formuliert, dass jede Aussage
entweder belegt ist oder als Kriterium statt als Tatsachenbehauptung auftritt.
Was hier offen ist, kann kein Commit lösen.

> Hinweis: fachlich sorgfältig recherchiert, aber **keine Rechtsberatung**.
> Punkt A6 (juristische Endkontrolle) bleibt deshalb bestehen.

---

## A. Vor dem Live-Gang

### A1 — Vertretungsbefugnis für den Netlify-Vertrag ✅ erledigt (28.07.2026)

Das Netlify-DPA gilt automatisch mit Annahme der Nutzungsbedingungen
(Self-Serve Subscription Agreement, DPA per Verweis eingebunden). Es bindet die
GmbH, weil die annehmende Person vertretungsbefugt ist:

- Netlify-Account: Team „SG Technik GmbH", Login über GitHub-Org „SG Technik GmbH",
  durchgehend `@sgt.co.at`-Adressen → tritt durchgehend als Account der GmbH auf.
- Die GmbH hat **zwei handelsrechtliche Geschäftsführer**: Gregor Hofer und
  DI Simon Paireder, BSc. Beide sind vertretungsbefugt; die Annahme der
  Netlify-Bedingungen bindet die GmbH. (DI Paireder ist zusätzlich
  gewerberechtlicher GF nach § 39 GewO — diese Rolle allein hätte für die
  Vertretung nicht genügt.)

Damit ist die Aussage in Abschnitt 3 der Datenschutzerklärung — „Mit dem Anbieter
besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO" — belegt.

- [x] Vertretungsbefugnis geklärt (handelsrechtliche Geschäftsführung)
- [ ] Aktuellen Firmenbuchauszug zur Nachweismappe legen

### A2 — Nachweismappe ✅ erledigt (28.07.2026)

Abgelegt in der Firmenablage:
- Netlify-DPA, Fassung 09.06.2026 (`netlify.com/pdf/netlify-dpa.pdf`)
- Screenshots Team-Einstellungen (Teamname, Owner-Adresse)
- Netlify Privacy Policy, Stand 10.04.2026 (DPF-Zertifizierung)

Noch zu ergänzen: Firmenbuchauszug als Nachweis der Prokura (siehe A1).

### A3 — Kontaktformular / Netlify Forms ⚠️ offen

Betrifft Klardaten (Name, E-Mail, Telefon, Freitext) — sensibler als Zugriffsdaten.
Netlify löscht Formulareinsendungen **nicht** automatisch.

- [ ] Netlify → Site → **Forms**: vorhandene Einsendungen sichten, erledigte löschen
- [ ] Site settings → Forms → **Form notifications**: Weiterleitung geht an ein
      Firmenpostfach, nicht an eine private Adresse
- [x] Löschturnus festgelegt: **halbjährlich, jeweils 30.06. und 31.12.**
- [ ] Turnus als wiederkehrenden Kalendereintrag anlegen

Ohne Turnus stimmt der Satz in Abschnitt 5 der Datenschutzerklärung nicht
(„Wir speichern Ihre Anfrage, bis diese abschließend bearbeitet ist").

### A4 — Verarbeitungsverzeichnis nach Art. 30 DSGVO 🔶 angelegt, Restlücken

> Datei: **`Verarbeitungsverzeichnis_SG_Technik_GmbH.xlsx`** im Projektordner
> (per `.gitignore` von der Versionierung ausgenommen — gehört in die Firmenablage).
> Blatt „Offene Punkte" führt die verbleibenden Lücken; offene Felder sind im
> Dokument mit `[AUSFÜLLEN]` markiert und orange hinterlegt.
> Die beiden Website-Verarbeitungen sind ausgefüllt, die übrigen Unternehmens-
> bereiche (Zeilen 3–7) noch nicht.

Die folgende Beschreibung dokumentiert Aufbau und Herkunft der Angaben.

Pflicht; die Ausnahme für Betriebe unter 250 Mitarbeitern greift **nicht**, weil die
Verarbeitung nicht nur gelegentlich erfolgt. Formfrei, aber schriftlich und der
Behörde auf Verlangen vorzulegen. Eine Tabelle genügt — es wird nicht veröffentlicht.

Kopfdaten (einmal, gelten für alle Zeilen):
Verantwortlicher SG Technik GmbH, Kroisbach 5, 4622 Eggendorf im Traunkreis,
FN 624545 z, vertreten durch Gregor Hofer und DI Simon Paireder, BSc,
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

- [ ] Tabelle in Excel/Word anlegen, Kopfdaten + beide Zeilen ausfüllen
- [ ] Datum und Version eintragen, in der Firmenablage speichern
- [ ] Bei jeder Änderung an Diensten oder Fristen nachziehen

Kostenlose Vorlagen: Österreichische Datenschutzbehörde (`dsb.gv.at`), WKO.

### A5 — AVV für den E-Mail-Provider ⚠️ offen

Formulareinsendungen landen im Postfach `office@sgt.co.at`. Dessen Betreiber ist
**ebenfalls Auftragsverarbeiter** und braucht einen AVV.

Technisch geklärt am 28.07.2026: Die DNS-Einträge der Domain `sgt.co.at` zeigen auf
**Microsoft 365 / Exchange Online** —
MX `sgt-co-at.mail.protection.outlook.com`, SPF `include:spf.protection.outlook.com`.
Auftragsverarbeiter ist damit Microsoft (für EU-Kunden: Microsoft Ireland Operations
Limited). A1 Telekom Austria ist mutmaßlich Vertrags- und Rechnungspartner für die
Lizenzen, nicht der Betreiber.

- [ ] Microsoft Products and Services **Data Protection Addendum** in aktueller
      Fassung abrufen, mit Datum in die Nachweismappe legen
- [ ] Datenregion des Tenants prüfen (Microsoft 365 Admin Center → Einstellungen →
      Organisationsprofil bzw. EU Data Boundary)
- [ ] **Rolle von A1 klären:** nur Reseller, oder CSP-Partner mit delegierten
      Administratorrechten (GDAP) auf den Tenant? Bei bestehendem Adminzugriff ist A1
      selbst Auftragsverarbeiter und benötigt einen eigenen AVV.
      Nachsehen unter Admin Center → Einstellungen → **Partnerbeziehungen**.

### A6 — Juristische Endkontrolle ⚠️ offen

- [ ] Datenschutzerklärung, Cookie-Richtlinie und Impressum von einer rechtskundigen
      Person gegenlesen lassen (WKO bietet Mitgliedern kostenlose Erstberatung)
- [ ] Dabei mitprüfen lassen: `firmenbuchgericht` in `src/content/legal.ts` ist noch
      **leer** — Pflichtangabe nach § 14 UGB, verbindlich aus dem Firmenbuchauszug
      übernehmen (laut WKO „Landesgericht Linz")

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
- [ ] `stand` in `src/content/privacy.ts` aktualisieren

---

## Wo die Aussagen im Code herkommen

| Aussage auf der Website | Quelle im Code |
|---|---|
| Hoster, Adresse, Links | `src/content/privacy.ts` → `hosting` |
| Speicherdauer der Serverlogs | `hosting.logRetentionDays` — `null` = Kriterien statt Frist. Zahl **nur** eintragen, wenn im AVV verbindlich bestätigt |
| Zugriffsstatistiken | `hosting.analyticsEnabled` — betrifft ausschließlich Netlify Analytics |
| Drittlandbezug | `hosting.transferSafeguards` (+ Beleg-Kommentar) |
| Unterauftragsverarbeiter | `hosting.providerSubprocessorsUrl` |
| Speicherfristen Kontakt | `privacy.retention` |
| Cookie-/Storage-Aussagen | `src/pages/datenschutz.astro` Abschnitt 4, `src/pages/cookie-richtlinie.astro`, `src/content/consent.ts` |
