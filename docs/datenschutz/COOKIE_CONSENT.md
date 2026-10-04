# Cookie-Consent-System — Dokumentation

DSGVO-/ePrivacy-konformes Einwilligungsmanagement für die SG-Technik-Website.
Vanilla-Umsetzung im bestehenden Stack (Astro + TypeScript + Tailwind v4),
**ohne zusätzliche Bibliotheken**.

Stand dieser Datei: **29.09.2026** — gegen den Code gegengeprüft.

> **Kurzfassung für Eilige:** Die Website setzt **derzeit keine Cookies und
> verwendet keinen localStorage**. Es wird **kein Banner** angezeigt, und es gibt
> **keinen** Link „Cookie-Einstellungen" im Footer — beides erscheint automatisch,
> sobald in `src/content/consent.ts` ein optionaler Dienst eingetragen wird. Das
> System ist als ruhendes Fundament vorhanden, nicht als aktiver Consent-Layer.

---

## 1. Ausgangslage (Analyse)

Die Analyse des Codes (Suche nach `gtag`, Google Analytics/Tag Manager, Meta
Pixel, Hotjar, Matomo, Clarity, `localStorage`, `fetch`, externen
`<script>`/`<iframe>`, Maps, YouTube, reCAPTCHA) ergab:

- **Keine** Analyse-, Tracking- oder Marketing-Dienste.
- **Keine** externen Skripte, iframes oder eingebetteten Fremdinhalte.
- Fonts (IBM Plex) sind **selbst gehostet** → keine externe Google-Fonts-Anfrage.
- Einzige Datenverarbeitung: **Netlify Forms** (nur beim Absenden des
  Kontaktformulars, setzt keine clientseitigen Cookies) und **Server-Logfiles**
  des Hosters (technisch notwendig).

Am Build gegengeprüft (29.09.2026): im gesamten `dist/` existieren genau **drei**
externe URLs, alle drei reine Textlinks in den Rechtsseiten
(`netlify.com/privacy`, `trust.netlify.com`, `privacy.microsoft.com`). Kein
`<iframe>`, kein externes Skript, keine externe Schriftart — es wird also beim
Seitenaufruf keine einzige Anfrage an einen Dritten ausgelöst.

**Konsequenz:** Die Website setzt aktuell **keine einwilligungspflichtigen
Cookies**. Das Consent-System wurde dennoch als sauberes, zukunftssicheres
Fundament gebaut — es blockiert künftige optionale Dienste standardmäßig und
gibt sie erst nach Einwilligung frei.

---

## 2. Welche Cookies / Speichertechnologien verwendet werden

**Derzeit: keine.** Weder Cookies noch localStorage, sessionStorage oder
vergleichbare clientseitige Speicherung. Die Tabelle beschreibt, was **künftig**
gesetzt würde, sobald ein optionaler Dienst existiert:

| Schlüssel    | Speicherort  | Kategorie | Laufzeit  | Zweck                                     | Aktiv? |
| ------------ | ------------ | --------- | --------- | ----------------------------------------- | ------ |
| `sg-consent` | localStorage | Notwendig | 12 Monate | Speichert die Cookie-Auswahl des Nutzers  | **nein** — erst ab dem ersten optionalen Dienst |

Solange `hasOptionalServices === false` ist, gibt es kein Banner, also auch keine
Auswahl, die gespeichert werden müsste — der Schlüssel `sg-consent` wird nie
geschrieben. Die Laufzeit von 12 Monaten kommt aus `consentMaxAgeMonths`.

Sobald ein optionaler Dienst ergänzt wird, ist er in `src/content/consent.ts`
samt seiner Cookies zu dokumentieren; die Cookie-Richtlinie zeigt ihn dann
automatisch an. **Dann ist auch der Eintrag `sg-consent` selbst in der Kategorie
„Notwendig" zu ergänzen** — ein vorbereiteter, auskommentierter Block dafür steht
an der passenden Stelle in `consent.ts`.

---

## 3. Kategorien

Definiert und typisiert in **`src/content/consent.ts`** (einzige Quelle der Wahrheit):

| ID          | Label     | Abwählbar          | Aktuell aktive Dienste |
| ----------- | --------- | ------------------ | ---------------------- |
| `notwendig` | Notwendig | nein (immer aktiv) | **keine** (`services: []`) |
| `statistik` | Statistik | ja (Default aus)   | keine (vorbereitet) |
| `marketing` | Marketing | ja (Default aus)   | keine (vorbereitet) |

Alle drei Kategorien sind derzeit leer. Statistik und Marketing sind angelegt,
aber ohne Dienste, und werden im UI und in der Richtlinie ehrlich als „derzeit
keine Dienste im Einsatz" gekennzeichnet.

### Zwei Zustände (automatisch gewählt)

`consent.ts` berechnet `hasOptionalServices`. Daraus folgen zwei Zustände:

- **Ruhend (aktuell):** `CookieConsent.astro` rendert **kein Markup** — kein
  Banner, kein Hinweis, keine Config. Auch der Footer-Button
  „Cookie-Einstellungen" entfällt (in `Footer.astro` ebenfalls hinter
  `hasOptionalServices` gegated), weil es nichts zu widerrufen gibt.
- **`consent`-Modus:** Sobald ein Dienst eingetragen wird, erscheinen Banner,
  Einstellungs-Dialog, Skript-Gating **und** der dauerhafte Footer-Link
  automatisch. **Kein Umbau nötig.**

> **Historischer Hinweis:** Es gab zwischenzeitlich einen dritten Zustand
> („`notice`-Modus") mit einem blockierenden Info-Hinweis und einem Knopf
> „Verstanden". Der wurde entfernt (Commit `80dd0d9`, „Cookie Banner und sperre
> entfernt"): ein Hinweis, der nichts einwilligt, aber die Seite sperrt, war
> rechtlich unnötig und für Besucher nur störend. `consentClientConfig.mode`
> kennt den Wert `'notice'` nominell noch, wird in diesem Zustand aber gar nicht
> mehr ausgeliefert.

### Warum der Manager eine eigene Komponente ist

Astro hoistet `<script>`-Blöcke und bündelt sie pro Seite — **unabhängig von
bedingtem Rendern im Template**. Solange das Client-Skript direkt in
`CookieConsent.astro` lag, wurde es deshalb auf allen 8 Seiten inline
ausgeliefert (3,1 kB minifiziert), obwohl die Komponente im ruhenden Zustand gar
kein Markup rendert und das Skript sich sofort selbst deaktiviert hätte.

Skripte aus Komponenten, die **nie gerendert** werden, liefert Astro dagegen
nicht aus. Deshalb liegt der Manager seit 29.09.2026 in
**`ConsentManager.astro`** und wird ausschließlich innerhalb des
`hasOptionalServices && (…)`-Zweigs von `CookieConsent.astro` gerendert.

Am Build in beiden Zuständen gegengeprüft:

| | ruhend (Ist-Stand) | mit einem Testdienst in `consent.ts` |
|---|---|---|
| Seiten mit Consent-JS | **0** von 8 | 8 von 8 |
| `id="sg-consent-config"` | 0× | 1× |
| Banner-Dialog im HTML | nein | ja |
| Footer-Button „Cookie-Einstellungen" | nein | ja |
| Dienst in der Cookie-Richtlinie | — | wird gelistet |

Die einzigen verbleibenden Inline-Skripte im Build sind das Mobile-Menü
(`Header.astro`) und der Hero-Zähler — kein Consent-Code.

Der Weg über eine eigene Komponente statt über `is:inline` ist bewusst gewählt:
`is:inline` würde den Block unkompiliert ausliefern, er ist aber TypeScript.
So bleiben Typprüfung und Minifizierung erhalten.

**Was weiterhin immer mitgeliefert wird:** die ~1,95 kB CSS der Banner- und
Dialog-Regeln, weil der `<style>`-Block bei seinem Markup in
`CookieConsent.astro` bleiben muss (Astros Scope-Hashes müssen zu den Elementen
passen). Das ist ein einmaliger Anteil im gemeinsamen, gecachten Stylesheet
(1.954 von 47.555 Bytes) — bewusst nicht weiter optimiert.

---

## 4. Wie der Consent gespeichert & angewendet wird

*(Gilt ab dem `consent`-Modus — im ruhenden Zustand passiert nichts davon.)*

- **Speicherung:** `localStorage`-Eintrag `sg-consent` (kein Server-Cookie,
  keine Übertragung an den Server):
  ```json
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
  Existiert nur im `consent`-Modus.
- **Event:** Bei jeder Anwendung wird `window`-Event `sg:consentchange`
  (`detail` = gespeicherter Status) ausgelöst.
- **Scroll-Lock:** Solange das Banner offen ist, wird `<body>` an seiner
  aktuellen Position fixiert (`position: fixed; top: -Ypx`) — `overflow: hidden`
  allein greift auf iOS Safari nicht. Beim Schließen wird die Position
  zurückgesetzt.

---

## 5. Erfüllte rechtliche Anforderungen

Diese Liste beschreibt die Eigenschaften des `consent`-Modus, also den Zustand,
der ab dem ersten optionalen Dienst automatisch greift:

- ✅ **Keine nicht-notwendigen Skripte/Cookies vor der Einwilligung** (Opt-in;
  Gating-Mechanismus lädt sie erst nach Zustimmung).
- ✅ **Gleichwertigkeit** von „Alle akzeptieren" und „Alle ablehnen" (identische
  Größe, Farbe, Position — kein Dark Pattern; bewusst neutrales Navy statt der
  Kupfer-CTA, um nicht zum Akzeptieren zu nudgen).
- ✅ **„Einstellungen"-Button** mit granularer Kategorie-Steuerung.
- ✅ **Default nur notwendig** — optionale Kategorien sind vorab deaktiviert.
- ✅ **Jederzeitiger Widerruf/Änderung** über den dauerhaften Link
  „Cookie-Einstellungen" im Footer, der gemeinsam mit dem Banner erscheint
  (beide hinter `hasOptionalServices` — Erteilung und Widerruf sind damit immer
  gleich erreichbar, nie das eine ohne das andere).
- ✅ **Speicherung der Entscheidung** (localStorage) inkl. Zeitstempel & Version
  (Nachweisbarkeit der Einwilligung).
- ✅ **Datenschutz & Impressum direkt aus dem Banner erreichbar**, zusätzlich
  Cookie-Richtlinie.
- ✅ **Barrierefreiheit (WCAG):** natives `<dialog>` (Fokus-Falle, Esc,
  Inertsetzung des Hintergrunds), `role="switch"` mit echtem Checkbox-Input,
  Label-Verknüpfung, sichtbare Fokus-Ringe.

Dauerhaft vorhanden, unabhängig vom Zustand:

- ✅ **Cookie-Richtlinie** unter `/cookie-richtlinie`, aus dem Footer verlinkt.
  Generiert ihre Kategorie-Abschnitte aus `consent.ts` und stellt den Ist-Zustand
  ehrlich dar („Diese Website setzt und liest keine Cookies …").
- ✅ **Datenschutzerklärung, Abschnitt 4 „Cookies und lokale Speicherung"** —
  Rechtsgrundlagen Art. 6 Abs. 1 lit. a/f DSGVO, § 165 Abs. 3 TKG 2021, plus ein
  eigener Absatz, der den gewöhnlichen Browser-Cache ausdrücklich abgrenzt
  (die Aussage „speichert nichts auf Ihrem Endgerät" wäre sonst wörtlich
  widerlegbar).
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
4. **Rechtstexte sind fachlich fundiert, aber keine Rechtsberatung.** Die echten
   Firmendaten sind inzwischen eingetragen (`src/content/legal.ts`: Adresse, FN,
   Firmenbuchgericht, UID, beide Geschäftsführer, Kammer) — die **juristische
   Endkontrolle durch eine rechtskundige Person steht aber weiterhin aus**, siehe
   `PRIVACY-CHECKLIST.md`, Punkt A6. Organisatorische Nachweise, die kein Commit
   lösen kann, führt dieselbe Datei.

---

## 7. Neuen Dienst hinzufügen (Kurzanleitung)

1. In `src/content/consent.ts` beim passenden Kategorie-Eintrag ein Objekt in
   `services: []` ergänzen (Name, Anbieter, Zweck, Cookies, ggf. `privacyUrl`).
2. **In derselben Datei** den auskommentierten Eintrag „Cookie-Einwilligung"
   (`sg-consent`) in der Kategorie `notwendig` aktivieren — ab jetzt wird
   tatsächlich gespeichert und muss ausgewiesen werden.
3. Das Ladeskript als Gating-Platzhalter einbinden:
   `type="text/plain"` + `data-consent="<kategorie-id>"` + `data-src="…"`.
4. `consentVersion` erhöhen → alle Nutzer werden erneut um Einwilligung gebeten.
5. **Datenschutzerklärung Abschnitt 4 prüfen:** der Satz „setzt und liest keine
   Cookies und verwendet keinen localStorage" wird damit **falsch** und muss
   umgeschrieben werden. Er steht als Prosa direkt in
   `src/pages/datenschutz.astro`, zieht sich also *nicht* automatisch nach.
   Dasselbe gilt für den Absatz „Aus diesem Grund wird Ihnen auch kein
   Cookie-Banner angezeigt" und für den Abschnitt „Aktueller Stand" in
   `src/pages/cookie-richtlinie.astro`.
6. `privacy.stand` in `src/content/privacy.ts` hochziehen.

Die Kategorien-Abschnitte der Cookie-Richtlinie und der Footer-Link aktualisieren
sich automatisch aus der Config — die Prosa in Schritt 5 nicht.

---

## 8. Betroffene Dateien

- `src/content/consent.ts` — Kategorien, Dienste, `hasOptionalServices`
- `src/components/CookieConsent.astro` — Banner, Einstellungs-Dialog, Styles;
  Einstiegspunkt des Systems
- `src/components/ConsentManager.astro` — nur das Client-Skript, absichtlich
  ausgelagert (siehe Abschnitt 3). Nie direkt einbinden.
- `src/pages/cookie-richtlinie.astro` — Richtlinie, generiert aus der Config
- `src/layouts/BaseLayout.astro` — bindet die Komponente ein
- `src/components/Footer.astro` — Link zur Richtlinie (immer) + gegateter
  Button „Cookie-Einstellungen"
- `src/pages/datenschutz.astro` — Abschnitt 4 „Cookies und lokale Speicherung"
- `COOKIE_CONSENT.md` — diese Datei
- `PRIVACY-CHECKLIST.md` — organisatorische Nachweise vor dem Live-Gang
