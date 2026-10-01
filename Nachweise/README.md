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
