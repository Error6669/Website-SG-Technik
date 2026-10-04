# Rechtstexte — Belegsammlung zu den Rechtsseiten

Alle Gesetze und Rechtsakte, auf die Impressum, Datenschutzerklärung und
Cookie-Richtlinie verweisen — heruntergeladen als geltende/konsolidierte Fassung.

**Stand des Downloads: 30.07.2026.** Konsolidierte Fassungen ändern sich;
vor dem Launch bzw. bei jeder Textänderung neu ziehen. Quelle für
österreichisches Recht: RIS (Rechtsinformationssystem des Bundes,
ris.bka.gv.at), für EU-Recht: EUR-Lex (eur-lex.europa.eu).

Dieser Ordner ist **nicht versioniert** (Eintrag in `.gitignore`) — es sind
externe Fremddokumente, keine Projektquellen.

---

## 1. Verweise im Impressum (`src/pages/impressum.astro`, `src/content/legal.ts`)

| Verweis | Bedeutung im Text | Datei |
|---|---|---|
| § 5 ECG | Überschrift der Seite; Pflichtangaben für Diensteanbieter | `Einzelnormen/ECG_§5_Informationspflichten.html` · `AT/ECG_E-Commerce-Gesetz.html` |
| § 5 Abs. 1 Z 5 ECG | Pflicht, die anwendbare Gewerbevorschrift + Zugang zu nennen | dito |
| § 14 UGB | Angaben auf Webseiten eingetragener Unternehmer (Firma, Rechtsform, Sitz, FN) | `Einzelnormen/UGB_§14_Geschaeftsbriefe.html` · `AT/UGB_Unternehmensgesetzbuch.html` |
| Gewerbeordnung 1994 (GewO) | als „Rechtsvorschrift" im Impressum genannt | `AT/GewO_1994_Gewerbeordnung.html` (+ `Einzelnormen/GewO_1994_§1_Geltungsbereich.html`) |

## 2. Verweise in der Datenschutzerklärung (`src/pages/datenschutz.astro`, `src/content/privacy.ts`)

| Verweis | Bedeutung im Text | Datei |
|---|---|---|
| DSGVO — Art. 6 Abs. 1 lit. a / b / f | Rechtsgrundlagen: Einwilligung, Vertrag, berechtigtes Interesse | `EU/DSGVO_VO_EU_2016-679.html` / `.pdf` |
| DSGVO — Art. 15, 16, 17, 18, 20 | Betroffenenrechte (Punkt 6) | dito |
| DSGVO — Art. 22 | keine automatisierten Einzelentscheidungen (Punkt 2) | dito |
| DSGVO — Art. 28 | Auftragsverarbeitungsvertrag mit dem Hoster (Punkt 3) | dito |
| DSGVO — Art. 46 | Garantien für die Drittlandübermittlung (`privacy.ts`) | dito |
| DSGVO — Art. 77 | Beschwerderecht bei der Aufsichtsbehörde (Punkt 7) | dito |
| § 165 Abs. 3 TKG 2021 | Einwilligung für Speichern/Auslesen im Endgerät („Cookie-Paragraph"), Punkt 4 | `Einzelnormen/TKG_2021_§165_Endgeraetespeicherung.html` · `AT/TKG_2021_Telekommunikationsgesetz.html` |
| § 132 BAO | 7-jährige abgabenrechtliche Aufbewahrungsfrist (Speicherdauer Kontakt) | `Einzelnormen/BAO_§132_Aufbewahrung.html` · `AT/BAO_Bundesabgabenordnung.html` |
| § 212 UGB | 7-jährige unternehmensrechtliche Aufbewahrungsfrist | `Einzelnormen/UGB_§212_Aufbewahrung.html` |
| Standardvertragsklauseln | Durchführungsbeschluss (EU) 2021/914 der Kommission | `EU/SCC_Durchfuehrungsbeschluss_EU_2021-914.html` / `.pdf` |
| EU-U.S. Data Privacy Framework | Angemessenheitsbeschluss (EU) 2023/1795 | `EU/DPF_Angemessenheitsbeschluss_EU_2023-1795.html` / `.pdf` |

## 3. Verweise in Cookie-Richtlinie & Consent-System (`src/pages/cookie-richtlinie.astro`, `src/content/consent.ts`, `src/components/CookieConsent.astro`)

| Verweis | Bedeutung im Text | Datei |
|---|---|---|
| DSGVO | Einwilligung als Rechtsgrundlage, Opt-in per Default | `EU/DSGVO_VO_EU_2016-679.html` |
| ePrivacy-Richtlinie | Unionsrechtliche Grundlage der Endgeräte-Einwilligung (Art. 5 Abs. 3 RL 2002/58/EG i.d.F. 2009/136/EG) | `EU/ePrivacy-Richtlinie_2002-58-EG_konsolidiert.html` / `.pdf` |
| § 165 Abs. 3 TKG 2021 | nationale Umsetzung ebendieser Einwilligung | `Einzelnormen/TKG_2021_§165_Endgeraetespeicherung.html` |
| öst. DSG | nationales Datenschutzgesetz (Ergänzung zur DSGVO) | `AT/DSG_Datenschutzgesetz.html` |

## 4. Verweise in internen Projektdokumenten

| Verweis | Fundstelle | Datei |
|---|---|---|
| Art. 30 DSGVO (Verarbeitungsverzeichnis) | `docs/datenschutz/PRIVACY-CHECKLIST.md`, `PROJECT_STATUS.md` | `EU/DSGVO_VO_EU_2016-679.html` |
| Art. 13 Abs. 2 lit. a DSGVO (Informationspflicht Speicherdauer) | `PROJECT_STATUS.md` | dito |
| § 39 GewO (gewerberechtlicher Geschäftsführer) | `docs/datenschutz/PRIVACY-CHECKLIST.md` | `Einzelnormen/GewO_1994_§39_Gewerblicher_Geschaeftsfuehrer.html` |

---

## Zusätzlich mitgeladen (im Code **nicht** referenziert)

- `AT/MedienG_Mediengesetz.html` — Mediengesetz. Die Offenlegungspflicht nach
  §§ 24 f. MedienG trifft in Österreich auch Websites und wird üblicherweise
  gemeinsam mit § 5 ECG im Impressum abgehandelt. Das Impressum nennt sie
  derzeit nicht. Ob eine „kleine Website" (§ 25 Abs. 5 MedienG) oder die
  vollständige Offenlegung verlangt ist, gehört in die rechtliche Prüfung
  vor dem Launch.

## Geprüft beim Download

- § 165 Abs. 3 TKG 2021 trägt tatsächlich die Einwilligungsregel für das
  Speichern/Auslesen von Informationen im Endgerät — die Zitierung auf der
  Datenschutzseite passt.
- § 14 UGB verlangt die Angaben ausdrücklich auch „auf ihren Webseiten".
- § 132 BAO nennt sieben Jahre; § 212 UGB regelt die unternehmensrechtliche
  Aufbewahrung — beides deckt die Formulierung in `privacy.ts`.

## Neu laden

Österreich (RIS), geltende Fassung:
`https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=<NR>`

| Gesetz | Gesetzesnummer |
|---|---|
| ECG | 20001703 |
| GewO 1994 | 10007517 |
| UGB | 10001702 |
| BAO | 10003940 |
| DSG | 10001597 |
| TKG 2021 | 20011678 |
| MedienG | 10000719 |

Einzelner Paragraph: `.../NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=<NR>&Paragraf=<§>`

EU (EUR-Lex): `https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:<CELEX>`

| Rechtsakt | CELEX |
|---|---|
| DSGVO (VO 2016/679) | 32016R0679 |
| ePrivacy-RL, konsolidiert | 02002L0058-20091219 |
| SCC-Beschluss 2021/914 | 32021D0914 |
| DPF-Beschluss 2023/1795 | 32023D1795 |
