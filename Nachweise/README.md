# Nachweise (Durchgangsordner)

Hier landen heruntergeladene Nachweisdokumente zur Datenschutz-Freigabe, bevor
sie in die **Nachweismappe in der Firmenablage** wandern. Dieser Ordner ist per
`.gitignore` von der Versionierung ausgenommen — die Dokumente sind teils
mehrere Megabyte groß und gehören nicht ins Repository.

Nur diese README ist versioniert, damit die Herkunft der Dokumente
nachvollziehbar bleibt.

## Inhalt

| Datei | Quelle | Stand | Abgerufen |
|---|---|---|---|
| `Microsoft-DPA_Mai2026_DE.docx` | `aka.ms/dpa` → *Datenschutznachtrag für Produkte und Services von Microsoft* | 22.05.2026 | 01.10.2026 |
| `Microsoft-DPA_Mai2026_EN.docx` | `aka.ms/dpa` → *Microsoft Products and Services Data Protection Addendum* | 22.05.2026 | 01.10.2026 |
| `A1-Digital-International-GmbH-Co-KG_AGB-Auftragsverarbeitung_DE.pdf` | `a1.digital/de/agb/` → *AGB Auftragsverarbeitung* | V2.1, gültig ab Juni 2025 | 01.10.2026 |
| `Netlify-DPA.pdf` | `netlify.com/pdf/netlify-dpa.pdf` | 09.06.2026 | 01.10.2026 |
| `Microsoft365_Datenspeicherort_2026-10-01.png` | Microsoft 365 Admin Center → Einstellungen → Einstellungen der Organisation → Organisationsprofil → **Datenspeicherort** | Mandantenstand 01.10.2026 | 01.10.2026 |

| `Privacy Policy \| Netlify.pdf` | `netlify.com/privacy/` | 10.04.2026 | 28.07.2026 |
| `netlify-subprocessors.pdf` | Netlify Trust Center → *Subprocessors* | 26 Einträge, 01.10.2026 | 01.10.2026 |
| `Netlify_Team_settings.png` | Netlify-Dashboard → Team settings | 28.07.2026 | 28.07.2026 |
| `FB_624545z_2026-07-30.pdf` | Firmenbuchauszug FN 624545 z | 30.07.2026 | 30.07.2026 |
| `Drittlandgarantien_Fundstellen_2026-10-02.md` | eigene Zusammenstellung aus den Verträgen oben | 02.10.2026 | — |

**Noch zu ergänzen** (nur im Browser abrufbar, siehe „Zu den Drittlandgarantien"):
`DPF-Register_Netlify_….png`, `DPF-Register_Microsoft_….png`,
`SCC_2021-914_DE.pdf`, `Angemessenheitsbeschluss_2023-1795_DE.pdf`.

**Maßgeblich ist die englische Fassung.** Sie sagt das selbst: „Published in
English on May 22, 2026. Translations will be published by Microsoft when
available. These commitments are binding on Microsoft as of May 22, 2026."
Die deutsche Übersetzung liegt zum Lesen dabei.

## Neu laden

Der Downloadlink enthält runde Klammern und zerbricht beim Kopieren leicht.
Außerdem blockt Microsoft `curl` mit dem Standard-User-Agent (HTTP 403) —
deshalb die Browser-Kennung:

```sh
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
B='https://www.microsoft.com/licensing/docs/documents/download/MicrosoftProductandServicesDPA(WW)'
curl -sL -A "$UA" "$B(German)(May2026)(CR).docx" -o Nachweise/Microsoft-DPA_Mai2026_DE.docx
```

Im Browser einfacher: `aka.ms/dpa` öffnen und die gewünschte Sprache und
Fassung aus der Liste klicken. Dort stehen auch alle früheren Versionen.

## Zum Netlify-DPA: die Log-Speicherdauer

Steht auf **Seite 15**, Anhang der technischen und organisatorischen Maßnahmen,
**Nr. 5 lit. A „LOGGING AND MONITORING"**: Protokolle der Systeme, die den Dienst
erbringen, werden „retained on-line for 90 days and offline for 1 year".

Das ist der Beleg für `hosting.logRetention` in `src/content/privacy.ts` und für
Zeile 1 des Verarbeitungsverzeichnisses. Gefunden erst am 02.10.2026 — die
E-Mail-Anfrage an Netlify (B1) lief seit 30.07.2026 einer Angabe hinterher, die
in diesem PDF stand. Bei jeder neuen DPA-Fassung gezielt gegenlesen (C2).

## Zu den Drittlandgarantien

`Drittlandgarantien_Fundstellen_2026-10-02.md` ordnet jeder Übermittlung ihren
Mechanismus zu und zitiert die Vertragsstellen — Beleg für die Zeilen
„Drittlandbezug" in Abschnitt 3 und 5 der Erklärung (`hosting.transferBasis`,
`mail.dpfCertified` in `src/content/privacy.ts`). Kurzfassung: bei **Netlify**
gilt das DPF, die Standardvertragsklauseln sind der vereinbarte Rückfall (DPA
§ 14.2/14.3); bei **Microsoft** gelten die Standardvertragsklauseln, das DPF
kommt hinzu.

Die vier fehlenden Dateien lassen sich nicht per `curl` holen: Das DPF-Register
ist eine reine Browser-Anwendung, und EUR-Lex beantwortet Skriptabrufe mit einer
leeren Seite (HTTP 202). Im Browser öffnen und speichern.

## Zum Datenspeicherort

Der Bildschirmabdruck belegt die Aussage in Abschnitt 5 der Datenschutzerklärung
(`src/content/privacy.ts` → `mail.dataResidency`). Unter „Ruhende Daten an
Speicherorten" weisen **Exchange Online** und **Exchange Online Protection** je
„European Union\EFTA" aus — als aktuelle *und* als zugesicherte Geografie.

**Wichtiger ist, was daneben steht:** Zur erweiterten Datenresidenz heißt es, der
Mandant sei berechtigt, das Advanced-Data-Residency-Add-On (ADR) **zu erwerben**.
Es ist also nicht erworben, und eine lokale Geografie (Österreich) ist damit nicht
zugesichert. Deshalb nennt die Website die EU bzw. den EWR und nicht Österreich —
siehe `PRIVACY-CHECKLIST.md`, A5, Befund 8.

Neu ziehen bei jeder Wiedervorlage (C6) oder wenn ADR gebucht wird.

## Zum A1-AVV

Die AGB AVV gelten nach ihrem Punkt 1 Abs. 1 automatisch für bestehende
Vertragsbeziehungen, soweit A1 Digital personenbezogene Daten im Auftrag
verarbeitet — es ist also kein gesonderter Vertragsschluss nötig, wie bei
Netlify und Microsoft auch.

**Das Dokument allein genügt aber nicht.** Punkt 2 Abs. 1 verweist für Art und
Zweck der Verarbeitung, die Kategorien betroffener Personen und die Art der
Daten auf „die jeweilige Leistungsvereinbarung samt Anhang zum Datenschutz".
Genau das verlangt Art. 28 Abs. 3 lit. a DSGVO. Dieser Anhang ist in den
A1-Vertragsunterlagen zu suchen und hier zu ergänzen.

Ebenfalls offen: Punkt 6 Abs. 2 erklärt die bei Vertragsschluss eingesetzten
Unterauftragsverarbeiter für genehmigt, ohne sie zu nennen — eine Liste ist
nirgends veröffentlicht. Der letzte Satz desselben Absatzes fingiert zudem die
Zustimmung für konzernverbundene Unternehmen; der Konzern umfasst laut
A1-Datenschutzerklärung auch Gesellschaften außerhalb der EU.
