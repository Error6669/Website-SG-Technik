# Datenschutz — Freigabe-Checkliste vor Live-Gang

Stand dieser Liste: **01.10.2026**
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

### A3 — Kontaktformular / Netlify Forms ✅ erledigt (29.09.2026), Löschablauf festgelegt (01.10.2026)

Betrifft Klardaten (Name, E-Mail, Telefon, Freitext) — sensibler als Zugriffsdaten.
Netlify löscht Formulareinsendungen **nicht** automatisch.

- [x] Netlify → Site → **Forms**: vorhandene Einsendungen gesichtet, erledigte
      gelöscht (29.09.2026)
- [x] Site settings → Forms → **Form notifications**: Weiterleitung geht an ein
      Firmenpostfach, nicht an eine private Adresse (geprüft 29.09.2026)
- [x] Löschturnus festgelegt: **halbjährlich, jeweils 30.06. und 31.12.**
- [x] Turnus als wiederkehrender Kalendereintrag angelegt (29.09.2026)

#### Der Löschablauf (festgelegt 01.10.2026)

Befund 3 des Prüfberichts vom 01.10.2026: Die Erklärung sagte Löschung zu, „bis
diese abschließend bearbeitet ist" — diese Liste kannte als einzige Maßnahme zwei
Kalendertermine. Eine am 2. Januar erledigte Anfrage wäre also bis 30. Juni
gespeichert geblieben, rund sechs Monate, von denen der Text nichts sagte. Ein
halbjährlicher Termin allein belegt die Zusage nicht; festzulegen war, **was** nach
Erledigung noch gebraucht wird und **wann** es tatsächlich verschwindet.

**Entscheidung vom 01.10.2026:** Der halbjährliche Turnus bleibt, dafür nennt die
Erklärung die tatsächliche Höchstdauer. Zwei Termine im Jahr sind der Aufwand, der
verlässlich eingehalten wird — eine monatliche Zusage, die dann doch ausfällt, wäre
schlechter als eine ehrliche Sechsmonatsfrist. Verworfen wurden damit: monatliche
Durchgänge, quartalsweise Durchgänge und Löschung unmittelbar beim Erledigen.

**Höchstdauer:** längstens bis zum **Ende des Kalenderhalbjahres, in dem die
Bearbeitung abgeschlossen wurde** — im ersten Halbjahr erledigte Anfragen also bis
30.06., im zweiten bis 31.12. Das ist keine Schätzung, sondern die Frist, die
unmittelbar aus den beiden Terminen folgt.

**Sie ist eine Obergrenze, kein Normalfall.** Nach der Erledigung wird nur so lange
aufbewahrt, wie es für zusammenhängende Rückfragen tatsächlich gebraucht wird;
entfällt dieser Bedarf früher, wird früher gelöscht. So steht es seit 02.10.2026 in
`src/content/privacy.ts` → `retention.contact`, ausgegeben als eigene Absätze in
Abschnitt 5.

**Was an welchem Ort gelöscht wird:**

| Ort | Was | Wann |
|---|---|---|
| Netlify → Site → **Forms** | jede Einsendung | zum nächsten Durchgang nach Erledigung — früher, sobald kein Bedarf für Rückfragen mehr besteht |
| Postfach `office@sgt.co.at` | Benachrichtigungsmail samt Antwortverlauf | dito |
| Geschäftsablage | aufbewahrungspflichtige Unterlagen — und, soweit sie dazugehört, die ursprüngliche Anfrage | § 132 BAO / § 212 UGB, bis 7 Jahre |

**Keine Aufbewahrung auf Verdacht.** Eine reine Auskunftsanfrage — Ersatzteil,
Öffnungszeit, Anfrage ohne Folge — wird vollständig gelöscht, in beiden Ablagen.

**Die Ausnahme ist eng und muss zum einzelnen Dokument passen.** Ausgenommen sind
nur Unterlagen, die gesetzlichen Aufbewahrungspflichten unterliegen oder im
Einzelfall zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
erforderlich sind. Das **kann** auch die ursprüngliche Anfrage betreffen, etwa wenn
sie Teil eines Geschäftsfalls geworden ist. Daraus folgt aber **keine pauschale
siebenjährige Speicherung** aller Anfragen oder ihrer Zweitkopien: Wer eine Anfrage
behält, muss sagen können, welche Pflicht oder welcher Anspruch das trägt.

> Diese Fassung löst die frühere ab, die jede Anfrage ausnahmslos löschen wollte und
> die Sieben-Jahres-Frist allein bei Angebot, Auftrag und Rechnung verortete. Am
> 02.10.2026 zugunsten des neuen Wortlauts in `retention.contact` angeglichen.

**Frühere Löschung auf Verlangen.** Wer eine Anfrage gestellt hat, kann die
Löschung jederzeit vorher verlangen (Art. 17 DSGVO) — berechtigte Löschbegehren
werden **unabhängig von den regulären Durchgängen** bearbeitet, nicht bis zum
nächsten Termin aufgeschoben. Das stand bisher nur allgemein
in Abschnitt 6 der Erklärung; seit 01.10.2026 steht es auch dort, wo die
Speicherdauer genannt wird. **Es ersetzt den Turnus nicht** — es ist ein Recht der
betroffenen Person, keine Rechtfertigung dafür, von selbst länger zu speichern.
Genau diese Verwechslung beanstandet der Prüfbericht.

- [x] Löschablauf festgelegt (01.10.2026): Orte, Höchstdauer und Umgang mit
      Geschäftsfällen — Tabelle oben
- [x] `retention.contact` in `src/content/privacy.ts` auf die tatsächliche
      Höchstdauer umgestellt und um den Hinweis auf die frühere Löschung ergänzt
      (01.10.2026). Der vorherige Text ließ eine Löschung unmittelbar nach
      Erledigung erwarten — das traf nicht zu.
- [ ] **Kalendereintrag 30.06./31.12. um die Arbeitsschritte ergänzen.** Er trägt
      derzeit nur den Termin. Hinein gehören beide Ablagen, die Geschäftsfall-Regel
      und ein Verweis auf diesen Abschnitt — am Termin soll nichts rekonstruiert
      werden müssen.
- [ ] **Jeden Durchgang vermerken** — Datum und Kürzel in die Nachweismappe, eine
      Zeile genügt. Ohne diesen Vermerk lässt sich bei der Wiedervorlage (**C9**)
      nicht feststellen, ob der Turnus stattgefunden hat, und die Höchstdauer in der
      Erklärung bleibt unbelegt.
- [x] **Verarbeitungsverzeichnis Zeile 2, Feld „Löschfrist" nachgezogen**
      (02.10.2026, Version 1.3): Halbjahresgrenze, beide Ablagen und die
      Beschränkung der Sieben-Jahres-Frist auf den Geschäftsfall sind eingetragen.

**Systembedingter Rest:** Jede Einsendung existiert zweimal — als
Benachrichtigungsmail im Postfach *und* dauerhaft im Netlify-Dashboard. Netlify
löscht dort nichts automatisch und bietet keine einstellbare Frist; der
halbjährliche Turnus ist deshalb die tragende Maßnahme und muss **beide** Orte
umfassen. Vollständig vermeiden ließe sich die Zweitkopie nur durch Umstellung
auf reinen Mailversand (Netlify Function → SMTP) — nicht umgesetzt, wäre ein
eigener Umbau inklusive Spam-Schutz.

### A4 — Verarbeitungsverzeichnis nach Art. 30 DSGVO ✅ für die Website vollständig (29.09.2026)

> Datei: **`Unterlagen/Verarbeitungsverzeichnis_SG_Technik_GmbH.xlsx`**
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
| Löschfrist | nach Vorgabe des Anbieters, nur solange für Betrieb/Sicherheit erforderlich | längstens bis zum Ende des Kalenderhalbjahres der Erledigung (Durchgänge 30.06./31.12., **beide** Ablagen); § 132 BAO / § 212 UGB bis 7 Jahre **nur** für daraus entstandene Geschäftsfälle — siehe A3 |
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
| ~~Nr. 1, Löschfristen~~ | ~~konkrete Speicherdauer der Netlify-Protokolldaten~~ | **erledigt 02.10.2026** — steht im DPA, siehe B1 |
| Nr. 2, AVV | Konkretisierung des A1-Vertrags — der „Anhang zum Datenschutz" nach Art. 28 Abs. 3 lit. a | **A5**, Anfrage läuft seit 01.10.2026 |
| Nr. 3–5 | BMD-Betriebsmodell (lokal oder Cloud), Name der Steuerberatungskanzlei, wer die Lohnverrechnung durchführt, arbeitsrechtliche Löschfristen | Blatt „Offene Punkte" Nr. 5 — **nicht Teil der Website-Freigabe** |
| Nr. 3–5, TOMs | **Backup- und Wiederherstellungskonzept** (Art. 32 Abs. 1 lit. c) — in allen drei Zeilen offen | ebenda; eigener Punkt, betrifft das Unternehmen, nicht die Website |

#### Befund 10: Zeile 2 war widersprüchlich und veraltet (bereinigt 02.10.2026)

Der Prüfbericht hat die Datei gelesen und in Zeile 2 Angaben gefunden, die andere
Projektunterlagen längst überholt hatten. Überarbeitet am 02.10.2026, **Version 1.3**:

| Feld | Stand vorher | Jetzt |
|---|---|---|
| Datenkategorien | „technische Übermittlungsdaten des Formulars" | einzeln benannt, mit Hinweis auf die Spamprüfung |
| Empfänger | A1 Telekom Austria „mutmaßlich Reseller": `[AUSFÜLLEN]`; Akismet fehlte ganz | Vermutung als widerlegt vermerkt; Automattic/Akismet samt Beleg aufgenommen |
| AVV | Microsoft-DPA „Fassung prüfen und ablegen": `[AUSFÜLLEN]`; A1-Rolle `[AUSFÜLLEN]` | Fassung 22.05.2026 abgelegt; A1-Rolle geklärt, Unvollständigkeit des Vertrags benannt |
| AVV, A1 | „wird vorerst nicht angefordert" | **angefordert am 01.10.2026** — siehe unten |
| Drittlandübermittlung | „Datenregion … prüfen: `[AUSFÜLLEN]`" | geprüft, belegt, ADR-Befund aufgenommen |
| Löschfristen | „bis zur abschließenden Bearbeitung", nur Netlify genannt | Höchstdauer, beide Ablagen, Geschäftsfall-Regel (A3) |
| TOMs | nur Honeypot; Löschroutine nur im Dashboard | Akismet ergänzt; Löschroutine in beiden Ablagen, Durchgang zu vermerken |

**Ein Widerspruch betraf auch den Code.** Blatt 2 und `src/content/privacy.ts`
sagten, der A1-Vertrag werde „vorerst nicht angefordert" — während A5 dieser Liste,
`PROJECT_STATUS.md` und Blatt „Offene Punkte" Nr. 10 die am 01.10.2026 an
`datenschutz@a1.at` abgesendete Anfrage dokumentieren. Aufgelöst zugunsten der drei
spezifischeren Belege; die beiden veralteten Stellen sind nachgezogen. Der frühere
Wortlaut war der Zwischenstand vor der zweigleisigen Entscheidung.

**Zur Gesamtbewertung.** „Für die Website vollständig" war keine belastbare Aussage,
solange Zeile 2 offene und überholte Felder trug — der Prüfbericht hat darin recht.
Diese Felder sind jetzt befüllt; **offen bleibt genau ein Punkt**, und der liegt
nicht an uns: die Konkretisierung des A1-AVV. Die Vollständigkeit nach Art. 30 für
das gesamte Unternehmen hängt unverändert an den Zeilen 3–5 — ein eigenes Vorhaben.

Kostenlose Vorlagen: Österreichische Datenschutzbehörde (`dsb.gv.at`), WKO.

### A5 — AVV für den E-Mail-Provider 🔶 Prüfungen erledigt, A1-Antwort offen

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
- [x] **Datenregion abgelesen** (01.10.2026, Admin Center → Einstellungen →
      Einstellungen der Organisation → Organisationsprofil → **Datenspeicherort**).
      Exchange Online: aktuelle und zugesicherte Geografie je „European Union\EFTA";
      der Dienst ist als EU-Datengrenzendienst gelistet. Werte in `privacy.ts` →
      `mail.dataResidency` und `mail.euDataBoundary`; Abschnitt 5 der Erklärung nennt
      den Speicherort.
      **Bewusst nicht behauptet:** dass gar keine Drittlandübermittlung stattfindet —
      die EU-Datengrenze betrifft ruhende Daten und schließt Support- und
      Sicherheitszugriffe nicht restlos aus; der CLOUD Act bleibt unberührt.
- [x] **„Österreich" zurückgenommen** (01.10.2026) — Befund 8 des Prüfberichts,
      Begründung im folgenden Unterabschnitt.
- [x] **Bildschirmabdruck des Datenspeicherorts abgelegt** (02.10.2026) —
      `Nachweise/Microsoft365_Datenspeicherort_2026-10-01.png`, Zeile in
      `Nachweise/README.md`. Er belegt mehr als erwartet, siehe unten.
- [x] Zeile 2 des Verarbeitungsverzeichnisses geprüft (02.10.2026): „Österreich"
      war dort **nie** eingetragen — das Feld stand auf `[AUSFÜLLEN]`. Jetzt mit dem
      abgelesenen Wert und dem ADR-Befund befüllt (Version 1.3).

#### Befund 8: „Österreich" war nicht belegt (zurückgenommen 01.10.2026)

Der Prüfbericht beanstandet **keinen falschen Speicherort**, sondern einen fehlenden
Nachweis. Abgelesen wurde „European Union\EFTA"; auf der Website stand daraus
abgeleitet „Österreich". EU/EFTA belegt keinen österreichischen Speicherort —
Microsoft unterscheidet tatsächliche Bereitstellungsregion, vertragliche Zusage und
gesondert buchbare Datenresidenz.

Gegengeprüft am 01.10.2026: `Nachweise/` enthält vier Dokumente (A1-AGB AVV,
Microsoft-DPA in zwei Sprachen, Netlify-DPA). **Keines nennt den Speicherort**, und
`Nachweise/README.md` erwähnt ihn mit keinem Wort. Der einzige Beleg für
„Österreich" war ein Prosa-Kommentar im Code.

**Entscheidung:** `mail.dataResidency` steht jetzt auf dem abgelesenen Wert — „der
Europäischen Union bzw. dem EWR". Die Seite sagt damit weniger, aber nur Belegbares.
Auf `null` wurde bewusst **nicht** gesetzt: In `src/pages/datenschutz.astro` steckt
der Satz zur EU-Datengrenze innerhalb derselben Bedingung und wäre mitverschwunden,
obwohl er eigenständig belegt ist. Die Abweichungsspalte von **C6** nannte diese
Nebenwirkung nicht und ist mitkorrigiert.

**Nachgereicht am 02.10.2026 — der Beleg sagt mehr als erwartet.** Der Abdruck
`Nachweise/Microsoft365_Datenspeicherort_2026-10-01.png` zeigt unter „Ruhende Daten
an Speicherorten" für **Exchange Online und Exchange Online Protection** je
„European Union\EFTA", und zwar als *aktuelle* **und** als *zugesicherte* Geografie.
Im selben Fenster steht zur erweiterten Datenresidenz: „Ihr Mandant ist dazu
berechtigt, das Microsoft 365 Advanced Datenresidenz-Add-On (ADR) **zu erwerben**" —
berechtigt also, nicht Inhaber.

Damit ist der Befund enger, als der Prüfbericht annehmen konnte. Es fehlte nicht nur
der Nachweis für „Österreich": Der einzige Mechanismus, der eine lokale Geografie
zusichern würde, ist **nicht gebucht**. „Österreich" war also nicht bloß unbelegt,
sondern unzutreffend. Die Rücknahme war richtig, und eine Rückfrage bei Microsoft
erübrigt sich — die Ansicht beantwortet die Frage selbst.

**Der Weg zu „Österreich"** führte damit nur über den Kauf des ADR-Add-Ons. Das ist
kostenpflichtig und für ein Kontaktformular mit wenigen Anfragen im Monat
unverhältnismäßig; nicht weiterverfolgt, solange nicht beauftragt.
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
- [x] In den A1-Vertragsunterlagen nach dem „Anhang zum Datenschutz" gesucht
      (01.10.2026) — **nicht vorhanden**. Punkt 2 Abs. 1 der AGB AVV verweist für
      Art, Zweck, Datenkategorien und Betroffenenkreise dorthin; genau das verlangt
      Art. 28 Abs. 3 lit. a DSGVO. Der AVV ist damit **unvollständig**: der Rahmen
      steht, die Konkretisierung fehlt. Punkt 2 der Anfrage an A1 fragt danach;
      Antwort abwarten.
- [x] **Mail an A1 abgesendet** (01.10.2026 an `datenschutz@a1.at`). Fragt die
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

### A7 — Automatische Spamprüfung (Akismet) ✅ in der Erklärung beschrieben (01.10.2026)

Befund 2 des Prüfberichts vom 01.10.2026: Die Erklärung nannte beim Spam-Schutz
nur den Honeypot, obwohl Netlify Forms **jede** Einsendung automatisch mit Akismet
prüft. Der Satz „Eine Weitergabe an sonstige Dritte findet nicht statt" war in
diesem Zusammenhang zu absolut.

Belege (Abrufstand 01.10.2026):

- Netlify Docs „Spam filters" (`docs.netlify.com/manage/forms/spam-filters/`):
  automatische Akismet-Prüfung, Honeypot als **zusätzliche** Maßnahme
- Netlify Trust Center → Subprocessors: Zeile **„Automattic, Inc. (Akismet)"**,
  Kategorie „Spam Filtering", Standort „US". Belegkopie `netlify-subprocessors.pdf`
  (26 Einträge, erzeugt 01.10.2026)

- [x] Abschnitt 5 der Erklärung ergänzt (01.10.2026): neue Zeile **„Spam-Prüfung"**
      mit Zweck, übermittelten Daten, Empfänger, Rechtsgrundlage (Art. 6 Abs. 1
      lit. f) und Drittlandbezug; der Honeypot-Satz ist aus „Bereitstellung"
      dorthin gewandert. Werte in `src/content/privacy.ts` → `formSpam`.
- [x] Zeile „Datenarten" um die technischen Übermittlungsdaten (IP-Adresse,
      Zeitpunkt, Browser-/Geräteangaben) ergänzt, Zeile „Zweck" um die Spam-Abwehr,
      Zeile „Drittlandbezug" um den Spam-Filterdienst
- [x] Absoluten Satz bei „Empfänger" relativiert: keine Weitergabe **über die
      genannten Auftragsverarbeiter und deren Unterauftragsverarbeiter hinaus**,
      keine Übermittlung zu fremden Zwecken, gesetzliche Pflichten unberührt
- [x] **Verarbeitungsverzeichnis Zeile 2 nachgezogen** (02.10.2026, Version 1.3):
      Automattic/Akismet steht jetzt bei Empfängern, AVV-Status, Drittlandbezug und
      in den TOMs (Befund 10 des Prüfberichts).

**Bewusst nicht behauptet:** eigene Standardvertragsklauseln oder eine
DPF-Zertifizierung von Automattic — dafür liegt kein Nachweis vor. Die Erklärung
stützt die Übermittlung auf die Unterauftragsverarbeiter-Kette des Hosters
(Abschnitt 3). Ein Cookie-Banner folgt aus der serverseitigen Prüfung nicht; es
werden dafür keine Daten im Endgerät gespeichert oder ausgelesen.

**Abschaltbar ist die Prüfung nicht** — sie ist Teil von Netlify Forms. Entfällt
sie, weil das Formular auf einen anderen Weg umgestellt wird, `formSpam` in
`src/content/privacy.ts` auf `null` setzen; die Zeile verschwindet dann von selbst.

### A8 — Drittlandgarantien zuordnen und zugänglich machen 🔶 Text erledigt (02.10.2026), Registerprüfung offen

Befund 5 des Prüfberichts vom 01.10.2026: Für Netlify und Microsoft stand derselbe
Satz „Standardvertragsklauseln … bzw. EU-U.S. Data Privacy Framework". Offen blieb,
welcher Mechanismus für welche Übermittlung gilt, und es fehlte die Angabe, wo die
Garantien einsehbar sind oder als Kopie angefordert werden können (Art. 13 Abs. 1
lit. f DSGVO).

Beide Verträge beantworten die Frage — und zwar **verschieden**:

| Übermittlung | Maßgeblich | Rückfall / Zusatz | Fundstelle |
|---|---|---|---|
| an Netlify, Inc. (USA) | EU-U.S. DPF | Standardvertragsklauseln, Modul 2 — greifen von selbst, wenn das DPF wegfällt | Netlify-DPA § 14.2, § 14.3 |
| Microsoft Ireland → Microsoft Corporation (USA) | Standardvertragsklauseln (Prozessor-zu-Prozessor) | zusätzlich DPF | Microsoft-DPA, „Data Transfers and Location" |

Der frühere Kommentar in `privacy.ts` nannte bei Netlify die Klauseln als Grundlage
und das DPF als Zusatz — laut § 14.2 ist es umgekehrt.

- [x] Abschnitt 3 und 5 der Erklärung je Anbieter getrennt formuliert (02.10.2026).
      `transferSafeguards` ist entfallen; an seine Stelle treten
      `hosting.transferBasis` (`'dpf'` | `'scc'`) und `mail.dpfCertified`.
- [x] Fundstellen verlinkt: DPF-Register, Netlify-DPA, Microsoft-DPA,
      Durchführungsbeschluss 2021/914 (`privacy.transferSources`, `hosting.dpaUrl`,
      `mail.dpaUrl`)
- [x] Der zunächst ergänzte Satz „Eine Kopie dieser Garantien erhalten Sie auf
      Anfrage unter office@sgt.co.at" wurde am 02.10.2026 **wieder entfernt**
      (Entscheidung Simon). Art. 13 Abs. 1 lit. f verlangt die Kopie **oder** die
      Angabe, wo die Garantien verfügbar sind — letzteres leisten die Links.
- [x] Zuordnung samt wörtlichen Vertragszitaten abgelegt:
      `Nachweise/Drittlandgarantien_Fundstellen_2026-10-02.md`
- [ ] **DPF-Register nachsehen** (`dataprivacyframework.gov` → Participant Search):
      Netlify, Inc. und Microsoft Corporation je „Active". Bildschirmabdrucke nach
      `Nachweise/`. Die Verträge behaupten die Zertifizierung; die Gültigkeit am
      Prüftag ist damit **nicht** belegt. Bei Abweichung siehe **C1**.
- [ ] Klauseltext 2021/914 und Angemessenheitsbeschluss 2023/1795 als PDF nach
      `Nachweise/` (EUR-Lex, nur im Browser abrufbar)
- [x] Verarbeitungsverzeichnis Zeile 1 und 2, Feld „Drittlandübermittlung", an die
      Zuordnung oben angeglichen (02.10.2026, **Version 1.6**). Neu auf Blatt
      „Offene Punkte": Nr. 12 (DPF-Registerstatus). Nr. 2 (Netlify-Logfrist) dort
      als erledigt vermerkt; in Zeile 2 den Verweis auf das Netlify-DPA von
      Abschnitt 7 auf Abschnitt 6 berichtigt.
- [x] Fließtext der Erklärung ohne Strichpunkte und Gedankenstriche neu gefasst
      (02.10.2026) — reine Satzzeichen- und Satzbau-Änderung, inhaltlich unverändert

**Bewusst nicht behauptet:** eine eigene Garantie für Automattic/Akismet (siehe A7)
und irgendeine Aussage zum Drittlandbezug von A1 Digital (Antwort offen, A5).

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
- [ ] **Dabei ansprechen:** die Beschreibung der automatischen Akismet-Prüfung in
      Abschnitt 5 (siehe A7) — insbesondere, ob die Absicherung über die
      Unterauftragsverarbeiter-Kette des Hosters so ausreichend dargestellt ist.
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
Änderungsbenachrichtigung (B1) und die Log-Speicherdauer (A4/`logRetention`).

> **Der dritte Punkt hat sich am 02.10.2026 von selbst erledigt** — die Frist steht
> im Vertrag, den wir längst haben. Siehe den folgenden Unterabschnitt.

- [x] Anfrage abgesendet (30.07.2026) — ging jedoch an eine Vertriebsadresse
- [x] **Antwort ausgewertet (12.08.2026).** Netlify (Senior Account Executive)
      erklärt, DPA-Fassungen, Subprozessoren-Dokumentation und Log-Fristen seien
      „generally tied to our paid plans", und bietet MNDA plus Enterprise-Gespräch
      an. **Dieser Darstellung wird nicht gefolgt** — Begründung siehe unten.
- [x] **Nachgefasst an `privacy@netlify.com`** (01.10.2026, Marina Shynkarenka
      in CC). Stellt klar: kein Enterprise-Interesse, keine Sicherheitsdokumente
      verlangt; zitiert die einschlägigen DPA-Stellen.

#### Warum die Tarif-Begründung nicht trägt

Das Netlify-DPA (Fassung 09.06.2026, liegt in `Nachweise/`) wurde am 01.10.2026
im Volltext geprüft. Es enthält **keine Klausel**, die eine der verlangten
Angaben an einen Tarif knüpft — weder unter „Enterprise", „paid plan" noch
„Self-Serve". Im Gegenteil, Abschnitt 6.2 sagt zu:

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

#### Die Log-Speicherdauer stand die ganze Zeit im Vertrag (02.10.2026)

Befund 4 des Prüfberichts beanstandete, die Frist sei „auch intern ungeklärt".
Daraufhin wurde das Netlify-DPA aus der Nachweismappe im Volltext durchsucht —
nicht nur die Klauseln, die zur Tarif-Frage zitiert wurden. **Seite 15**, Anhang
der technischen und organisatorischen Maßnahmen, Nr. 5 lit. A:

> „**LOGGING AND MONITORING.** Netlify has logging enabled for all components
> that support the Services, and (1) are centrally collected; (2) are secured in
> an effort to prevent tampering; (3) are monitored for anomalies by a trained
> security team; and (4) **retained on-line for 90 days and offline for 1 year**."

Damit ist die Frist **vertraglich zugesichert** — der TOM-Anhang ist über
Art. 28 Abs. 3 lit. c und Art. 32 DSGVO Vertragsbestandteil. Die E-Mail-Anfrage
war dafür nie nötig; sie lief seit 30.07.2026 einer Angabe hinterher, die im
eigenen Aktenschrank lag.

**Zweistufig, und das ist wesentlich:** 90 Tage im direkten Zugriff *plus* ein
Jahr Offline-Sicherung. Eine einzelne Tageszahl hätte das falsch wiedergegeben —
deshalb ist `logRetentionDays` durch `logRetention` mit zwei Werten ersetzt.

**Bewusst nicht behauptet:** dass die Klausel genau die HTTP-Zugriffsprotokolle
dieser Site meint. Sie spricht von „all components that support the Services".
Abschnitt 3 der Erklärung beschreibt deshalb die **Zusage des Anbieters** und
nicht die Lebensdauer einer einzelnen Logzeile — der Satz bleibt richtig, auch
wenn die Zuordnung enger ausfällt.

- [ ] Bei der Nachfrage an Netlify (läuft seit 01.10.2026) mitbestätigen lassen,
      dass Nr. 5 lit. A die Zugriffsprotokolle gehosteter Sites umfasst. Kommt
      die Bestätigung, kann die Erklärung direkter formulieren („Ihre IP-Adresse
      wird 90 Tage …"). Kein Blocker.

#### Kein Blocker für den Live-Gang

Bleibt die Antwort aus, ändert sich nichts an der Seite: die Log-Speicherdauer
ist aus dem Vertrag belegt, und die Subprozessoren sind über das Trust Center
namentlich bekannt — für Art. 30 Abs. 1 lit. d genügen Kategorien von Empfängern.
Offen bleiben die Bestätigung des Vertragsverhältnisses und die
Änderungsbenachrichtigung. Der Punkt gehört zu A6 auf den Tisch, blockiert aber
nichts.

---

## C. Jährliche Wiedervorlage

**Termin:** jeweils **Anfang Januar**, zusammen mit dem Prüftermin im
Verarbeitungsverzeichnis (Blatt 1, „Nächste Überprüfung"). Ein Termin statt zwei.
Aufwand erfahrungsgemäß 30–45 Minuten.

- [x] Kalendereintrag angelegt (01.10.2026) — **07.01.2027, 09:00**, jährlich.
      Er verweist auf diesen Abschnitt und enthält den Hinweis auf den
      GDAP-Ablauf am 09.03.2027.

**Zum Abarbeiten auf Papier:** `Datenschutz-Wiedervorlage.pdf` im Projektordner —
vier Seiten mit Ankreuzfeld und Notizzeile je Punkt. Sie wird **aus diesem
Abschnitt erzeugt**, nicht getrennt gepflegt; nach Änderungen hier neu bauen mit
`npm run wiedervorlage:pdf`. Weicht ein Ausdruck von dieser Datei ab, gilt diese
Datei.

Jeder Punkt nennt **wo nachsehen**, den **Soll-Stand** zum Vergleich und
**was zu tun ist, wenn es abweicht**. Wer das in einem Jahr abarbeitet, soll
nichts rekonstruieren müssen.

---

### C1 — DPF-Zertifizierung von Netlify und Microsoft

Data Privacy Framework-Zertifizierungen müssen **jährlich** erneuert werden.
Erlischt sie, trägt die Datenschutzseite eine Garantie vor, die es nicht gibt.

| | |
|---|---|
| **Wo** | `dataprivacyframework.gov` → *Participant Search* → „Netlify" und „Microsoft Corporation" |
| **Soll** | Status **Active** für Netlify, Inc. und für Microsoft Corporation; neue Bildschirmabdrucke nach `Nachweise/` |
| **Abweichung Netlify** | In `src/content/privacy.ts` `hosting.transferBasis` auf **`'scc'`**. Abschnitt 3 nennt dann nur noch die Standardvertragsklauseln — das ist der Rückfall, den das Netlify-DPA in § 14.2 selbst anordnet. |
| **Abweichung Microsoft** | `mail.dpfCertified` auf **`false`**. Der Zusatzsatz in Abschnitt 5 entfällt, die Standardvertragsklauseln bleiben. |

Zuordnung und Vertragszitate: `Nachweise/Drittlandgarantien_Fundstellen_2026-10-02.md`
(siehe **A8**). Bei einer neuen DPA-Fassung (C2, C3) gegenlesen, ob § 14 bzw.
„Data Transfers and Location" unverändert sind.

### C2 — Netlify-DPA

| | |
|---|---|
| **Wo** | `netlify.com/pdf/netlify-dpa.pdf` — Datum steht auf Seite 1 |
| **Soll** | Fassung **09.06.2026** (Kopie in der Nachweismappe) |
| **Abweichung** | Neue Fassung herunterladen, mit Datum in die Nachweismappe. Prüfen, ob sich Subprozessoren-, Lösch- oder Drittlandklauseln geändert haben; dann `privacy.ts` und Verarbeitungsverzeichnis nachziehen. |

> **Dabei gezielt nachsehen:** Anhang der technischen und organisatorischen
> Maßnahmen, **Nr. 5 lit. A „LOGGING AND MONITORING"** (in der Fassung 09.06.2026
> auf Seite 15). Dort steht die zugesicherte Log-Speicherdauer — Soll:
> **on-line 90 days, offline 1 year**. Ändern sich die Zahlen, `logRetention` in
> `src/content/privacy.ts` nachziehen; fällt die Klausel weg, auf `null` setzen,
> die Seite fällt dann auf Kriterien zurück.

### C3 — Microsoft-DPA

| | |
|---|---|
| **Wo** | `aka.ms/dpa` — im Browser öffnen, nicht die Direkt-URL kopieren (runde Klammern, und `curl` wird mit HTTP 403 geblockt; siehe `Nachweise/README.md`) |
| **Soll** | Fassung **22.05.2026**, englische Ausgabe maßgeblich |
| **Abweichung** | Neue Fassung in beiden Sprachen laden, Nachweismappe und `Nachweise/README.md` aktualisieren. |

### C4 — A1 Digital: AGB AVV und GDAP-Rechte

**Zwei Dinge, der zweite ist terminkritisch.**

| | |
|---|---|
| **Wo (a)** | `a1.digital/de/agb/` → *A1 Digital International GmbH CO KG AGB Auftragsverarbeitung DE* |
| **Soll (a)** | **V2.1, gültig ab Juni 2025** |
| **Wo (b)** | Microsoft 365 Admin Center → Einstellungen → **Partnerbeziehungen** |
| **Soll (b)** | Rollen und Ablaufdatum unverändert gegenüber `privacy.ts` → `mailAdmin.roles` und `mailAdmin.rolesExpire` (**09.03.2027**) |
| **Abweichung** | Rollen geändert → `mailAdmin.roles` anpassen. Beziehung beendet oder abgelaufen → `mailAdmin` auf **`null`**, der Absatz in Abschnitt 6 verschwindet dann von selbst. AVV inzwischen konkretisiert → `avvConfirmed` auf `true`. |

> ⚠️ **Die GDAP-Beziehung läuft am 09.03.2027 ab.** Wird sie verlängert, ist das
> eine neue Genehmigung — dann erneut prüfen, welche Rollen sie umfasst. Wird sie
> nicht verlängert, endet die Auftragsverarbeitung und `mailAdmin` gehört auf `null`.
> Der Januartermin liegt davor, das passt.

### C5 — Subprozessoren von Netlify

| | |
|---|---|
| **Wo** | `trust.netlify.com` bzw. `netlify.com/legal/subprocessors/` |
| **Soll** | Stand wie in der Nachweismappe hinterlegt |
| **Abweichung** | Neue Liste mit Datum ablegen. Kam ein Subprozessor in einem Drittland hinzu, Zeile 1 des Verarbeitungsverzeichnisses prüfen. |

Dabei gezielt nach **„Automattic, Inc. (Akismet)"** sehen: Dieser Eintrag ist der
Beleg für die Zeile „Spam-Prüfung" in Abschnitt 5 der Erklärung (`formSpam` in
`src/content/privacy.ts`). Fällt er weg oder wechselt der Spam-Filterdienst, muss
die Zeile angepasst werden — Stand 01.10.2026: Kategorie „Spam Filtering",
Standort „US".

Zugleich prüfen, ob die **Änderungsbenachrichtigungen** tatsächlich ankommen
(Anfrage dazu läuft seit 01.10.2026, siehe B1). Kam im Jahr keine einzige
Meldung, ist das kein Beleg für Stillstand, sondern ein Hinweis, dass die
Registrierung nicht funktioniert hat.

### C6 — Datenregion Microsoft 365

| | |
|---|---|
| **Wo** | Admin Center → Einstellungen → Einstellungen der Organisation → Organisationsprofil → **Datenspeicherort** |
| **Soll** | Exchange Online: aktuelle und zugesicherte Geografie je **European Union\EFTA**; Dienst als EU-Datengrenzendienst gelistet |
| **Abweichung** | `mail.dataResidency` in `privacy.ts` auf den neu abgelesenen Wert setzen. Er wird in „… im Ruhezustand in {Wert} gespeichert" eingesetzt und muss dorthin grammatisch passen. |

> ⚠️ **Nicht einfach auf `null` setzen.** Der Satz zur EU-Datengrenze steckt in
> `src/pages/datenschutz.astro` innerhalb derselben Bedingung und verschwindet
> mit — obwohl er eigenständig belegt ist. Soll nur die Ortsangabe entfallen,
> muss der `euDataBoundary`-Block vorher entkoppelt werden (eine Zeile).

**Nicht von EU/EFTA auf ein einzelnes Land schließen.** Genau das war Befund 8 des
Prüfberichts vom 01.10.2026 (siehe **A5**): Ein Land gehört nur dann in den Wert,
wenn ein mandantenbezogener Nachweis in der Nachweismappe liegt.

### C7 — Netlify Analytics

| | |
|---|---|
| **Wo** | Netlify-Dashboard → Site → Analytics |
| **Soll** | **deaktiviert** |
| **Abweichung** | `hosting.analyticsEnabled` auf `true`. **Wichtig:** Der Wert `false` erzeugt auf der Seite eine harte Tatsachenbehauptung — wird die Statistik zugebucht und der Wert bleibt stehen, ist die Erklärung falsch. |

### C8 — Verarbeitungsverzeichnis

| | |
|---|---|
| **Wo** | `Unterlagen/Verarbeitungsverzeichnis_SG_Technik_GmbH.xlsx` (Arbeitsfassung) bzw. die Fassung in der Firmenablage |
| **Soll** | Stand und Version auf Blatt 1 aktuell; Blatt „Offene Punkte" durchgesehen |
| **Abweichung** | Neue Dienste, geänderte Fristen oder neue Zugriffsberechtigte eintragen, Version hochzählen, Prüfdatum neu setzen. |

> **Beim Bearbeiten:** Datei vorher in Excel **schließen**. Eine geöffnete Datei
> überschreibt beim nächsten Speichern alle extern vorgenommenen Änderungen.

### C9 — Kontaktanfragen: hat der Löschturnus stattgefunden?

Der halbjährliche Turnus (30.06. und 31.12.) ist die tragende Maßnahme für die
Speicherdauer in Abschnitt 5 der Erklärung. Seit 01.10.2026 nennt der Text eine
**Höchstdauer** und ist damit eine überprüfbare Tatsachenbehauptung, keine
Absichtserklärung mehr: Fällt der Turnus aus, wird die Erklärung falsch.

| | |
|---|---|
| **Wo** | Netlify → Site → **Forms** *und* Postfach `office@sgt.co.at` — **beide** Ablagen; dazu die Durchgangsvermerke in der Nachweismappe |
| **Soll** | Keine erledigte Anfrage älter als das abgelaufene Kalenderhalbjahr — es sei denn, sie ist aufbewahrungspflichtig oder für Rechtsansprüche erforderlich **und der Grund ist vermerkt**; für 30.06. und 31.12. je ein Durchgangsvermerk vorhanden |
| **Abweichung** | Liegengebliebenes sofort löschen und den Fehltermin vermerken. Zwei ausgefallene Durchgänge hintereinander → der Turnus trägt die Höchstdauer nicht mehr: entweder auf monatliche Durchgänge umstellen oder `retention.contact` in `src/content/privacy.ts` ändern. Nicht stehen lassen. |

Fehlt ein Vermerk, gilt der Durchgang als **nicht** stattgefunden — dass im
Dashboard gerade nichts Altes liegt, kann auch daran liegen, dass in diesem
Halbjahr keine Anfrage kam. Der Löschablauf samt Begründung steht in **A3**.

### C10 — Stand der Erklärung

**Nur anfassen, wenn sich inhaltlich etwas geändert hat.** `stand` in
`src/content/privacy.ts` auf den Monat der letzten inhaltlichen Änderung setzen —
nicht routinemäßig hochzählen. Ein Stand, der neuer ist als der Inhalt, ist
genauso irreführend wie einer, der älter ist.

Danach `npm run build` und die Seite `/datenschutz` kurz ansehen.

---

## Wo die Aussagen im Code herkommen

| Aussage auf der Website | Quelle im Code |
|---|---|
| Hoster, Adresse, Links | `src/content/privacy.ts` → `hosting` |
| E-Mail-Provider als weiterer Auftragsverarbeiter + dessen Drittlandbezug | `src/content/privacy.ts` → `mail` (Abschnitt 5 der Erklärung) |
| Speicherdauer der Serverlogs | `hosting.logRetention` — zwei Stufen (`onlineDays`, `offlineMonths`) aus dem Netlify-DPA, Beleg in `source`. `null` = Kriterien statt Fristen |
| Zugriffsstatistiken | `hosting.analyticsEnabled` — betrifft ausschließlich Netlify Analytics |
| Drittlandbezug: Mechanismus je Anbieter, Fundstellen | `hosting.transferBasis`, `mail.dpfCertified`, `transferSources`, `hosting.dpaUrl`, `mail.dpaUrl` (+ Beleg-Kommentare) — siehe **A8** |
| Unterauftragsverarbeiter | `hosting.providerSubprocessorsUrl` |
| Automatische Spamprüfung des Formulars | `src/content/privacy.ts` → `formSpam` — `null` = Zeile „Spam-Prüfung" entfällt |
| Speicherfristen Kontakt: Höchstdauer, Geschäftsfall-Regel, Hinweis auf frühere Löschung | `privacy.retention.contact` — Löschablauf und Begründung in **A3** |
| Cookie-/Storage-Aussagen | `src/pages/datenschutz.astro` Abschnitt 4, `src/pages/cookie-richtlinie.astro`, `src/content/consent.ts` |
