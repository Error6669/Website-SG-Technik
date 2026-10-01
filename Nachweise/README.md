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
