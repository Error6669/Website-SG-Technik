# Cookie-Consent-System — Dokumentation

DSGVO-/ePrivacy-konformes Einwilligungsmanagement für die SG-Technik-Website.
Vanilla-Umsetzung im bestehenden Stack (Astro + TypeScript + Tailwind v4),
**ohne zusätzliche Bibliotheken**.

---

## 1. Ausgangslage (Analyse)

Die vollständige Analyse des Codes (Suche nach `gtag`, Google Analytics/Tag
Manager, Meta Pixel, Hotjar, Matomo, Clarity, `localStorage`, `fetch`,
externen `<script>`/`<iframe>`, Maps, YouTube, reCAPTCHA) ergab:

- **Keine** Analyse-, Tracking- oder Marketing-Dienste.
- **Keine** externen Skripte, iframes oder eingebetteten Fremdinhalte.
- Fonts (IBM Plex) sind **selbst gehostet** → keine externe Google-Fonts-Anfrage.
- Einzige Datenverarbeitung: **Netlify Forms** (nur beim Absenden des
  Kontaktformulars, setzt keine clientseitigen Cookies) und **Server-Logfiles**
  des Hosters (technisch notwendig).

**Konsequenz:** Die Website setzt aktuell **keine einwilligungspflichtigen
Cookies**. Das Consent-System wurde dennoch als sauberes, zukunftssicheres
Fundament gebaut — es blockiert künftige optionale Dienste standardmäßig und
gibt sie erst nach Einwilligung frei.

---

## 2. Welche Cookies / Speichertechnologien verwendet werden

| Schlüssel    | Speicherort   | Kategorie | Laufzeit            | Zweck                                   |
| ------------ | ------------- | --------- | ------------------- | --------------------------------------- |
| `sg-consent` | localStorage  | Notwendig | bis Widerruf/Löschen | Speichert die Cookie-Auswahl des Nutzers |

Es werden **keine weiteren** Cookies oder Speichereinträge gesetzt. Sobald ein
optionaler Dienst ergänzt wird, ist er in `src/content/consent.ts` samt seiner
Cookies zu dokumentieren; die Cookie-Richtlinie zeigt ihn dann automatisch an.

---

## 3. Kategorien

Definiert und typisiert in **`src/content/consent.ts`** (einzige Quelle der Wahrheit):

| ID          | Label     | Abwählbar | Aktuell aktive Dienste |
| ----------- | --------- | --------- | ---------------------- |
| `notwendig` | Notwendig | nein (immer aktiv) | Cookie-Einwilligung (`sg-consent`) |
| `statistik` | Statistik | ja (Default aus) | keine (vorbereitet) |
| `marketing` | Marketing | ja (Default aus) | keine (vorbereitet) |

Standardmäßig sind ausschließlich **notwendige** Funktionen aktiv. Statistik und
Marketing sind vorbereitet, aber leer und im UI/Richtlinie ehrlich als „derzeit
keine Dienste im Einsatz" gekennzeichnet.

### Zwei UI-Modi (automatisch gewählt)

`consent.ts` berechnet `hasOptionalServices`. Solange keine optionale Kategorie
einen Dienst enthält, läuft die Website im **`notice`-Modus**: nur ein schlanker,
nicht blockierender Info-Hinweis („Verstanden") — kein Accept/Reject, da es
nichts einzuwilligen gibt (rechtlich sauber für den Ist-Zustand). Sobald ein
Dienst eingetragen wird, schaltet sie automatisch in den **`consent`-Modus** mit
vollständigem Banner, Einstellungs-Dialog und Skript-Gating. **Kein Umbau nötig.**

---

## 4. Wie der Consent gespeichert & angewendet wird

- **Speicherung:** `localStorage`-Eintrag `sg-consent` (kein Server-Cookie,
  keine Übertragung an den Server). Zwei Formate je nach Modus:
  ```json
  // notice-Modus (aktuell):
  { "v": 1, "ts": "2026-07-20T…Z", "acknowledged": true }
  // consent-Modus (sobald ein Dienst existiert):
  { "v": 1, "ts": "2026-07-20T…Z", "categories": { "notwendig": true, "statistik": false, "marketing": false } }
  ```
- **Ablauf:** Ein Eintrag gilt nach `consentMaxAgeMonths` (= 12 Monaten,
  gemessen an `ts`) als abgelaufen und wird automatisch erneut abgefragt.
  Nutzer:innen müssen nichts manuell löschen; der Eintrag liegt nur im Browser
  des Besuchers, nicht auf dem Server.
- **Versionierung:** `consentVersion` in `consent.ts`. Wird sie erhöht (z. B.
  weil ein neuer Dienst hinzukommt), werden gespeicherte Einwilligungen ungültig
  und das Banner erscheint erneut → erneute Einwilligung nach Änderung.
- **Skript-Gating:** Einwilligungspflichtige Skripte werden als deaktivierte
  Platzhalter eingebunden und erst nach Zustimmung aktiviert:
  ```html
  <!-- Beispiel: Google Analytics erst nach Statistik-Einwilligung -->
  <script type="text/plain" data-consent="statistik"
          data-src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
  ```
  Der Manager sucht `script[type="text/plain"][data-consent="…"]`, kopiert bei
  erteilter Einwilligung `data-src`→`src` (bzw. Inline-Code) in ein echtes,
  ausführendes `<script>` und markiert den Platzhalter als aktiviert.
- **Widerruf:** Wird eine zuvor erteilte Kategorie deaktiviert und lief dort
  bereits ein Skript, lädt die Seite neu, damit nichts weiterläuft.
- **API (Browser):** `window.sgConsent.openSettings()`,
  `window.sgConsent.hasConsent('statistik')`, `window.sgConsent.get()`.
- **Event:** Bei jeder Anwendung wird `window`-Event `sg:consentchange`
  (`detail` = gespeicherter Status) ausgelöst.

---

## 5. Erfüllte rechtliche Anforderungen

- ✅ **Keine nicht-notwendigen Skripte/Cookies vor der Einwilligung** (Opt-in;
  Gating-Mechanismus lädt sie erst nach Zustimmung).
- ✅ **Gleichwertigkeit** von „Alle akzeptieren" und „Alle ablehnen" (identische
  Größe, Farbe, Position — kein Dark Pattern; bewusst neutrales Navy statt der
  Kupfer-CTA, um nicht zum Akzeptieren zu nudgen).
- ✅ **„Einstellungen"-Button** mit granularer Kategorie-Steuerung.
- ✅ **Default nur notwendig** — optionale Kategorien sind vorab deaktiviert.
- ✅ **Jederzeitiger Widerruf/Änderung** über dauerhaften Link
  „Cookie-Einstellungen" im Footer (auf jeder Seite).
- ✅ **Speicherung der Entscheidung** (localStorage) inkl. Zeitstempel & Version
  (Nachweisbarkeit der Einwilligung).
- ✅ **Datenschutz & Impressum direkt aus dem Banner erreichbar**, zusätzlich
  Cookie-Richtlinie.
- ✅ **Cookie-Richtlinie** neu erstellt (`/cookie-richtlinie`).
- ✅ **Datenschutzerklärung ergänzt** um Abschnitt „3. Cookies und Einwilligung"
  (Rechtsgrundlagen Art. 6 Abs. 1 lit. a/f DSGVO, § 165 Abs. 3 TKG 2021).
- ✅ **Barrierefreiheit (WCAG):** natives `<dialog>` (Fokus-Falle, Esc,
  Inertsetzung des Hintergrunds), `role="switch"` mit echtem Checkbox-Input,
  Label-Verknüpfung, sichtbare Fokus-Ringe, `prefers-reduced-motion` respektiert.
- ✅ **Responsive** (Desktop/Tablet/Smartphone), flach im bestehenden Designsystem.

---

## 6. Getroffene Annahmen

1. **Es sind aktuell keine Tracker vorhanden.** Die Kategorien Statistik &
   Marketing sind daher leer, aber angelegt, damit ein späteres Hinzufügen (z. B.
   Google Analytics) ohne Umbau nur über `consent.ts` + einen Gating-Platzhalter
   erfolgen kann. Sie werden ehrlich als „derzeit nicht im Einsatz" ausgewiesen.
2. **Speicherung in localStorage** (statt Cookie) wurde gewählt, weil kein Server
   die Einwilligung benötigt und nichts an Dritte übertragen wird; die Speicherung
   der Einwilligung selbst ist technisch notwendig und einwilligungsfrei zulässig.
3. **Netlify Forms & Server-Logfiles** gelten als technisch notwendig bzw. auf
   Basis berechtigten Interesses; sie sind nicht Teil der Opt-in-Kategorien.
4. **Rechtstexte sind Entwürfe.** Impressum/Datenschutz enthalten weiterhin
   Platzhalter für die Firmendaten. Vor dem Live-Gang müssen die echten Daten
   eingetragen und die Texte **von einer rechtskundigen Person geprüft** werden —
   die hier verwendeten Formulierungen sind fachlich fundiert, ersetzen aber keine
   Rechtsberatung.

---

## 7. Neuen Dienst hinzufügen (Kurzanleitung)

1. In `src/content/consent.ts` beim passenden Kategorie-Eintrag ein Objekt in
   `services: []` ergänzen (Name, Anbieter, Zweck, Cookies, ggf. `privacyUrl`).
2. Das Ladeskript als Gating-Platzhalter einbinden:
   `type="text/plain"` + `data-consent="<kategorie-id>"` + `data-src="…"`.
3. `consentVersion` erhöhen → alle Nutzer werden erneut um Einwilligung gebeten.
4. Cookie-Richtlinie und Datenschutzerklärung prüfen (Richtlinie aktualisiert
   sich automatisch aus der Config).

---

## 8. Betroffene Dateien

- **Neu:** `src/content/consent.ts`, `src/components/CookieConsent.astro`,
  `src/pages/cookie-richtlinie.astro`, `COOKIE_CONSENT.md`
- **Geändert:** `src/layouts/BaseLayout.astro` (Komponente eingebunden),
  `src/components/Footer.astro` (dauerhafter Link + Richtlinie),
  `src/pages/datenschutz.astro` (Consent-Abschnitt, Neu-Nummerierung)
