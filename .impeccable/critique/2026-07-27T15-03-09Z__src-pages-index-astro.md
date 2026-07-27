---
target: Homepage (src/pages/index.astro)
total_score: 19
p0_count: 4
p1_count: 2
timestamp: 2026-07-27T15-03-09Z
slug: src-pages-index-astro
---
Method: dual-agent (A: a969c595c89b451d8 · B: aaa4004378ebbd82b) — Browser-Evidenz vom Parent per CDP nacherhoben, da die Chrome-Extension nicht verbunden war.

## Design Health Score

| # | Heuristik | Score | Key-Issue |
|---|---|---|---|
| 1 | Sichtbarkeit des Systemstatus | 2 | Hero-Zähler zeigt ~1,8 s lang falsche Werte („059 – 360 t", „05.513 l/h", „± 0,7 %") |
| 2 | Übereinstimmung mit der realen Welt | 2 | Primär-CTA duzt Behörden („Melde dich bei uns"), Fließtext siezt |
| 3 | Nutzerkontrolle und Freiheit | 1 | Esc schließt den Cookie-Hinweis, löst den Scroll-Lock aber nicht — Seite dauerhaft eingefroren (3/3 reproduziert) |
| 4 | Konsistenz und Standards | 2 | Drei Labels für eine Conversion; identisches CTA-Label in zwei verschiedenen Button-Stilen im selben Fold |
| 5 | Fehlervermeidung | 2 | Nur natives `required`; Pflichtfelder unmarkiert, Telefon explizit „(optional)" — invertierte Markierung |
| 6 | Wiedererkennen statt Erinnern | 2 | Header trägt auf keinem Breakpoint eine Wortmarke; mobil steht der Firmenname nirgends im Fold |
| 7 | Flexibilität und Effizienz | 2 | Kein Skip-Link; mobiles Menü enthält keinen CTA (5 Links, 0 Buttons) |
| 8 | Ästhetik und minimalistisches Design | 3 | Zebra-Streifen fog-50/paper = 1,05:1 — der tragende Tiefenmechanismus ist unsichtbar |
| 9 | Fehler erkennen und beheben | 1 | Kein `aria-live`, kein Fehler-Styling, kein Server-Fehlerpfad; Esc-Freeze ohne Recovery |
| 10 | Hilfe und Dokumentation | 2 | Rechtstexte exzellent, Produkt-Hilfe null |
| **Total** | | **19/40** | **Poor — grundlegende Überarbeitung nötig** |

## Anti-Patterns Verdict

**LLM-Assessment:** Die Seite ist *nicht* generisch gebaut. Null `box-shadow` im gesamten `src/`, keine Cards, keine Gradients, kein Glassmorphism, keine 01/02/03-Nummerierung, keine identischen Card-Grids. Das ist eine Haltung. Aber drei KI-Reflexe sind da:

1. **Eyebrow-Grammatik statt Hierarchie.** In `AboutSection.astro` tragen Zeile 7 (Eyebrow), 14 (h2), 23/32/45 (h3) exakt dieselbe Klasse `font-mono text-xs uppercase tracking-[0.14em]`. Gemessen: das h2 „Wer wir sind" rendert mit **12 px** — kleiner als der 16-px-Fließtext darunter. Im gesamten mittleren Drittel gibt es keine Schrift über 12 px außer dem Body.
2. **Hero-Metric-Cliché mit Haarlinien getarnt.** Vier gleich große Zahlenzellen unter dem Hero, deren Werte beim Sichtbarwerden hochzählen. PRODUCT.md verbietet „hero-metric-dashboard clichés" wörtlich.
3. **Copy-Tells.** „Robust. Präzise. Vernetzt." ist die Drei-Adjektiv-Triade — und widerspricht PRODUCT.md („claims are backed by specific numbers instead of adjectives"). „Gemeinsam loslegen, langlebige Lösung." ist kein grammatikalischer deutscher Satz.

**Category-Reflex, erster Ordnung: durchgefallen.** Navy + Stahlgrau + warmer Kupferakzent + Mono-Labels lässt sich zu 100 % aus „Industrie/Winterdienst B2B" erraten.
**Zweiter Ordnung: durchgefallen, aber begründet.** Die Ästhetik landet in der gesättigten Lane „Editorial-typographic". DESIGN.md liefert mit „The Site Plan" einen echten Register-Grund. Trotzdem: IBM Plex Sans *und* Plex Mono stehen beide auf der Reflex-Reject-Liste. Identity-Preservation greift, aber es muss gesagt sein.

**Der schwerste Register-Verstoß ist Leere, nicht Slop: null Bildmaterial.** `document.images.length === 0`. Auf der Homepage einer Firma, die 680-Tonnen-Edelstahlsilos baut, ist kein einziges Foto, kein Render, keine technische Zeichnung. brand.md: „Text-only pages where typography alone carries the entire visual weight are the failure mode."

**Deterministischer Scan:** `detect.mjs` über `src/pages/index.astro src/components src/layouts` → Exit 2, **2 Findings**, beide `advisory` `design-system-font-size` in `ProductsTechSection.astro:187` (0.9rem) und `:201` (1.2rem). Diese Datei wird von der Homepage **nicht** importiert. Über nur die tatsächlichen Homepage-Dateien: **Exit 0, clean.** `grep -rn "shadow" src/` → 0 Treffer, No-Shadow-Regel eingehalten.

**Visuelle Overlays:** Kein Overlay verfügbar. Die Chrome-Extension war nicht verbunden (`list_connected_browsers` → `[]`), `detect.js` konnte nicht injiziert werden. Ersatzweise habe ich Headless Chrome 150 per CDP direkt gegen `http://localhost:4321/` gefahren und bei 1440×900 / 768×1024 / 390×844 real gemessen (Kontraste, Overflow, Touch-Targets, Fokusreihenfolge, Zählerverlauf, Cookie-Verhalten, Screenshots).

## Overall Impression

Das visuelle System ist echt und diszipliniert — besser als das, was die meisten Fachbetriebe bekommen. Was fehlt, ist nicht Geschmack, sondern **Beweis und Bedienbarkeit**. Die Homepage besteht aus Hero + „Über uns" + CTA-Band + Formular. Ein Beschaffungsentscheider sieht: keine Referenz, kein Kundenname, kein Bild einer Anlage, keine Leistung. `ReferencesSection.astro`, `ProcessSection.astro` und `ProductsTechSection.astro` liegen fertig im Repo und sind in `index.astro` nicht eingebunden. Die größte Chance ist deshalb keine Designarbeit, sondern eine Zeile Import — plus das, was die Seite gerade aktiv kaputt macht: ein Cookie-Hinweis, der bei Esc die ganze Seite dauerhaft einfriert.

## What's Working

1. **Das flache Haarlinien-System ist konsequent durchgezogen.** Die Statistik-Leiste (`Hero.astro:60`) ist als `gap-px` + `bg-line` + `bg-paper`-Zellen gebaut — eine echte gezeichnete Tabelle, kein Card-Grid. Null Shadows im gesamten Code. Die Seite wirkt konstruiert, nicht dekoriert.
2. **Die Kontaktsektion ist der stärkste Moment.** Navy-Fläche, benannter Ansprechpartner (Gregor Hofer), Telefonnummer und E-Mail als Haarlinien-Tabelle neben dem Formular. Alle vier Felder korrekt gelabelt (`<label for>`), `type="email"`/`type="tel"`, `autocomplete` gesetzt. Gemessen: 0 Kontrastverstöße auf der gesamten Seite, niedrigster Wert 5,74:1.
3. **`LogoMark.astro` ist ein echtes Signature-Asset.** Drei gestaffelt schwingende Chevrons mit normalisierten (`pathLength="100"`) Lichtpuls-Strichen, `prefers-reduced-motion` vollständig respektiert. Das einzige Element der Seite, das per Reflex nicht entstanden sein kann.

## Priority Issues

### [P0] Esc friert die Seite dauerhaft ein
**Was:** Bei offenem Cookie-Hinweis einmal Esc drücken. Gemessen in Chrome 150, **3 von 3 Durchläufen identisch**: `dialog.open` → `false`, aber `html{overflow:hidden}` und `body{position:fixed}` bleiben gesetzt. Danach: `scrollY` bleibt 0, `scrollHeight` = 900 px (= Viewporthöhe) trotz 2.655 px Seitenlänge. Mausrad wirkungslos. Der Hinweis ist weg, der Lock bleibt — es gibt keinen Weg zurück außer Reload.
**Ursache:** `CookieConsent.astro:400` versucht per `notice.addEventListener('cancel', e => e.preventDefault())` das Schließen zu verhindern. Das greift in Chrome 150 nicht; das Dialog schließt trotzdem, und weil nicht `hideNotice()` durchlaufen wird, läuft `unlockScroll()` (Zeile 375-382) nie.
**Warum es zählt:** Ein einziger Tastendruck macht die Website unbenutzbar, ohne sichtbaren Grund. Genau die tastaturaffinen Nutzer, die Esc reflexhaft drücken, trifft es zuerst.
**Fix:** Den `cancel`-`preventDefault` in Zeile 400 streichen und stattdessen im `close`-Event immer `unlockScroll()` aufrufen: `notice?.addEventListener('close', unlockScroll)`. Damit ist der Lock unabhängig vom Schließweg immer aufgehoben.
**Suggested command:** `/impeccable harden`

### [P0] Der Cookie-Hinweis sperrt die gesamte Seite
**Was:** `CookieConsent.astro:389` `notice.showModal()` + `lockScroll()`. Gemessen: bei offenem Hinweis ist `document.documentElement.scrollHeight` = 900 px statt 2.655 px, Mausrad-Scroll bewegt nichts. Der Modus ist laut `consent.ts` `notice` — es gibt **keine einwilligungspflichtigen Dienste**. Auf Mobil (390×844) liegt der Hinweis unten (top 656, Höhe 188 px) und verdeckt den dritten Hero-Button, trotz Commit 6c1508c „Mobile version Banner oben starten".
**Warum es zählt:** Die Seite blockiert 100 % ihres Inhalts für eine Information, die rechtlich keine Zustimmung braucht. Der erste Eindruck jedes Besuchers ist eine Barriere.
**Fix:** Für `mode === 'notice'` von `showModal()` auf `show()` umstellen und `lockScroll()`/`unlockScroll()` in diesem Zweig entfernen. Der Hinweis bleibt als nicht-blockierende Leiste stehen, bis „Verstanden" geklickt wird. Der `consent`-Modus darf modal bleiben.
**Suggested command:** `/impeccable harden`

### [P0] Die Homepage enthält null Proof
**Was:** `src/pages/index.astro:13-16` rendert Hero + About + CtaBand + Contact. `ReferencesSection.astro`, `ProcessSection.astro`, `ProductsTechSection.astro` existieren im Repo und sind nicht eingebunden. Die vier realen Referenzen (Steinerkirchen, Mondsee, Mitterweißenbach, Obernberg, `site.ts:97-102`) stehen nirgends auf der Startseite. `document.images.length === 0` — kein Foto, kein Render, kein Kundenlogo.
**Warum es zählt:** PRODUCT.md: „Specificity is the proof: real place names, real numbers, and named clients do the convincing that generic claims can't." Die Seite tut das Gegenteil: `customers.items` listet die *Kategorien* „Landesregierungen", „Magistrate" statt der real vorhandenen Namen Land OÖ, Asfinag, voestalpine, Magistrat Linz. Ein Referent einer Landesregierung liest dort seine eigene Kategorie — das überzeugt null.
**Fix:** Zwischen `<AboutSection />` und `<CtaBand />` einen gekürzten Referenz-Teaser einziehen (3 Einträge aus `references` als `divide-line`-Liste + Link auf `/referenzen`). `site.ts:76-79` um eine zweite, namentliche Kundenliste ergänzen. Mindestens ein Anlagenfoto in den Hero oder direkt unter die Statistik-Leiste — die rechte Hero-Spalte hat unter dem Logo ~300 px ungenutzte Fläche.
**Suggested command:** `/impeccable craft` (Referenz-Teaser), danach `/impeccable layout`

### [P0] Der Primär-CTA duzt den Käufer und verfehlt das Conversion-Versprechen
**Was:** `site.ts:11` → `primaryCta: { label: 'Melde dich bei uns' }`. Das Label erscheint dreimal (Header, Hero, CtaBand). Der Satz „Kostenloses Erstgespräch" existiert **nirgends** auf der Website. Zusätzlich gemessen: im Desktop-Fold stehen **zwei** Buttons mit exakt diesem Label in zwei verschiedenen Stilen — der Header-Button ist kupfern umrandet und transparent, der Hero-Button kupfern gefüllt.
**Warum es zählt:** Die Zielgruppe sind Beamte in Landesregierungen und Magistraten. „Melde dich bei uns" duzt sie, während der Fließtext direkt darüber siezt („Maßgeschneidert auf **Ihre** Anforderungen"). Gleichzeitig fällt die gesamte Reibungsreduktion weg: PRODUCT.md nennt „a free first conversation costs nothing" als Stufe 4 der Belief Ladder. Die Seite fragt stattdessen nach einer unspezifizierten „Nachricht".
**Fix:** `site.ts:11` → `label: 'Kostenloses Erstgespräch vereinbaren'`. Sekundär-CTAs im Hero auf einen reduzieren (nur „Unsere Leistungen"; „Produkte & Technik" steht bereits im Header). `ContactSection` Submit-Label und `contact.headline` angleichen. Header-CTA und Hero-CTA visuell auseinanderhalten oder das Label im Header verkürzen.
**Suggested command:** `/impeccable clarify`

### [P1] „Über uns" hat keine Hierarchie und steht im Blocksatz
**Was:** Zwei Defekte in `AboutSection.astro`:
(a) Zeilen 7, 14, 23, 32, 45 tragen dieselbe Klasse. Gemessen bei 768 px: h2 „Wer wir sind" = **12 px**, h3 „Was wir tun" = **12 px**, Fließtext = 16 px. Wer bei Tablet-Breite in die Sektion scrollt, sieht vier identische Mikro-Labels und keine Überschrift.
(b) Zeilen 17 und 26: `text-justify` bei 512 px Spaltenbreite mit `hyphens: manual`. Im Screenshot sind die Wortlücken in „Fokus liegt auf technisch ausgereiften, langlebigen und" massiv aufgerissen — deutscher Blocksatz ohne Silbentrennung produziert zwangsläufig Flüsse.
Dazu: unter „Autobahnbetreiber" stehen ~200 px vollständig leere Fläche vor der Haarlinie.
**Warum es zählt:** Das ist das gesamte mittlere Drittel der Homepage. Ein Beschaffungsentscheider scannt zuerst Überschriften — hier gibt es keine. Aufgerissener Blocksatz ist außerdem das billigste sichtbare Signal überhaupt; PRODUCT.md nennt „cheap or DIY" explizit als Anti-Referenz.
**Fix:** Zeile 14 auf die Headline-Stufe aus DESIGN.md §3 heben (`font-display text-3xl font-bold leading-tight text-navy-800`). Zeilen 23/32/45 auf die Title-Stufe (`text-lg font-semibold text-navy-800`) — dann entstehen drei Ebenen statt einer. `text-justify` in 17 und 26 ersatzlos streichen. Der Eyebrow in Zeile 7 bleibt als einziges Mono-Label der Sektion.
**Suggested command:** `/impeccable typeset`

### [P1] Die Zähl-Animation zeigt erfundene technische Daten
**Was:** `Hero.astro:114-125`. Gemessen über 14 Samples ab Seitenladen:
`t=0ms`: „059 – 360 t" · „05.513 l/h" · „± 0,7 %" · „08 h"
`t=400ms`: „094 – 700 t" · „10.718 l/h" · „± 1,4 %" · „17 h"
`t=1800ms`: „100 – 980 t" · „15.000 l/h" · „± 2 %" · „24 h" (Endwert)
Ursache: `padStart(digitCount, '0')` (Zeile 122) erzeugt führende Nullen; die `small`-Sonderbehandlung (Zeile 145, `finalNum < 10`) erfindet für „± 2 %" Nachkommastellen, die es in der Spezifikation nicht gibt.
**Warum es zählt:** Diese vier Kennzahlen *sind* der einzige Proof auf der Startseite. Fast zwei Sekunden lang behauptet die Seite eine Silo-Kapazität von „059 t" und eine Messgenauigkeit von „± 0,7 %" gegenüber einem Publikum, dessen ganzer Job das Prüfen von Spezifikationen ist. Und der animierte Metrik-Counter ist gleichzeitig der SaaS-Tic aus dem Slop-Verdikt.
**Fix:** Am saubersten: Animation streichen — die Zahlen sollen als Instrument-Ablesung dastehen (DESIGN.md §1: „Nothing here performs — it demonstrates."). Falls sie bleibt: `padStart` durch `tabular-nums` + feste `min-width` ersetzen (keine führenden Nullen) und die `small`-Sonderbehandlung entfernen.
**Suggested command:** `/impeccable quieter`

## Persona Red Flags

**Jordan (Erstbesucher, 30 Sekunden)**
- Wird bei Sekunde 0 von einem Modal blockiert, das die ganze Seite sperrt. Drückt Esc — Seite bleibt für immer eingefroren.
- Sieht danach **kein einziges Bild** dessen, was diese Firma baut.
- „Melde dich bei uns" — unsicher, ob das eine Firmenseite oder eine Vereinshomepage ist.
- Verlässt die Seite, ohne ein realisiertes Projekt gesehen zu haben.

**Riley (Stresstester)**
- Esc auf dem Cookie-Modal → Seite dauerhaft tot, 3/3 reproduziert.
- Tab-Taste: kein Skip-Link; Hero-CTAs (`Hero.astro:41,49`), CtaBand-CTA und die drei Footer-Links haben **keine** `focus-visible`-Definition, obwohl `ContactSection.astro:8`, `Footer.astro:19` und das Consent-System welche haben — inkonsistent.
- Formular leer absenden: native Browser-Blase („Fülle dieses Feld aus."). Kein `aria-live`, kein gestylter Fehler, keine Fokusführung.
- Mobiles Menü: `aria-label="Menü öffnen"` (`Header.astro:80`) wechselt bei `aria-expanded="true"` nie auf „schließen"; kein Fokus-Trap, kein `inert`, kein Scroll-Lock (gemessen: `html{overflow:visible}` bei offenem Menü).

**Casey (mobil, eine Hand, 390 px)**
- Der Cookie-Hinweis sitzt unten und verdeckt den dritten Hero-Button.
- Der Logo-Mark im Hero wird an der rechten Viewport-Kante abgeschnitten und drängt sich neben die vierzeilige h1.
- Der Firmenname steht mobil **als Text nirgends im Fold**: Header hat keine Wortmarke, der Hero-Eyebrow ist `hidden … lg:flex`.
- Drei gestapelte Vollbreiten-Buttons (342 px). Der Primär-CTA unterscheidet sich nur durch die Farbe von zwei reinen Navigationslinks.
- **Das mobile Menü enthält keinen CTA** — gemessen: 5 Links, 0 Buttons, je 40 px hoch (unter der 44-px-Schwelle). Um anzurufen, muss Casey ~2.400 px scrollen.

**Ing. Berger — Fachreferent Straßenerhaltung, Amt der Landesregierung** *(projektspezifisch)*
- Wird von der Seite geduzt.
- Sucht Firmensitz, UID und Firmenbuchnummer, um den Bieter zu prüfen. Der Footer enthält: Copyright + drei Rechtslinks. Keine Adresse, keine UID.
- Sucht Referenzen mit Auftraggeber und Fertigstellungsjahr. Findet auf der Homepage die Kategorie „Landesregierungen". Er *ist* die Kategorie.
- Braucht eine belastbare Reaktionszeit-Aussage für die Ausschreibung. Findet „24 h" in einer Kachel, aber keine Definition (Werktage? Wintersaison? geografischer Radius?).
- Sendet am Ende ein Formular ab, das ihm nicht sagt, wer antwortet, wie schnell, und was mit seinen Daten passiert.

## Minor Observations

- **Zebra-Streifen ohne Wirkung.** `fog-50` (#f5f7f8) gegen `paper` (#fbfcfc) = **1,05:1**. DESIGN.md §4 macht dieses Muster zu einem der zwei tragenden Tiefen-Mechanismen — es ist physisch unsichtbar. Gemessen: Hero `rgb(245,247,248)`, „Über uns" `rgb(251,252,252)`, CtaBand `rgb(251,252,252)` — die letzten beiden sind farbgleich, nur die Haarlinie trennt sie.
- **Formularfeld-Rahmen unter WCAG 1.4.11.** `border-white/20` auf Navy = **1,90:1** (Schwelle 3:1). Auf `border-white/40` (≈3,2:1) anheben. Die `divide-white/10`-Trenner liegen bei 1,35:1.
- **Off-Token-Farbe:** `placeholder:text-slate-400` (`ContactSection.astro:8`) ist Tailwinds Default-Slate, kein Token aus `global.css`. Zudem toter Code — kein Feld hat ein `placeholder`.
- **`FlowMotif.astro` wird nirgends importiert** (`grep -rn "FlowMotif" src/` → 0 Treffer), obwohl DESIGN.md §5 die Komponente als ausgeliefert beschreibt.
- **„Unsere Kunden" und „Wofür wir stehen"** rendern ihre Einträge als `text-base font-semibold text-navy-800` ohne Bullet und ohne Haarlinie. Sie sehen aus wie Links, sind aber keine — Affordanz-Lüge.
- **Der Hero-Eyebrow ist redundant:** „SG Technik GmbH — Silo- und Soleanlagenbau" direkt über der h1 „Silo- und Soleanlagen für den Winterdienst". Dieselben zwei Substantive zweimal in 40 px Abstand.
- **Positiv, gemessen:** kein horizontaler Overflow bei 390/768/1440 px · 0 Kontrastverstöße bei Text (niedrigster Wert 5,74:1) · genau ein `<h1>`, keine Level-Sprünge · `prefers-reduced-motion` deckt per `*`-Selektor alle CSS-Transitions ab, und der Hero-Zähler prüft es in JS · kein Reveal-Gating (alle Inhalte stehen ohne JS im HTML) · keine JS-Fehler in der Konsole.

## Questions to Consider

1. **Warum darf ein Unternehmen, das 680-Tonnen-Edelstahlkonstruktionen baut, auf seiner Startseite keine einzige davon zeigen?** „Keine generische Stockfotografie" ist ein Verbot *fremder* Bilder — daraus wurde im Code ein Verbot *aller* Bilder. Ist die Bildlosigkeit eine Entscheidung oder ein nie geschlossenes Asset-Loch, das nachträglich zur Haltung erklärt wurde?
2. **Wenn PRODUCT.md sagt „claims are backed by specific numbers instead of adjectives" — warum ist die erste Aussage unter der Headline „Robust. Präzise. Vernetzt."?** Drei Adjektive, null Zahlen, an der prominentesten Stelle. Und warum sind die einzigen echten Zahlen in eine Animation verpackt, die sie zwei Sekunden lang falsch darstellt?
3. **Warum ist die Homepage die einzige Seite ohne Inhalt?** `/leistungen`, `/produkte-technik` und `/referenzen` existieren als vollwertige Seiten. Die Startseite — die einzige, die ein Erstbesucher garantiert sieht — verweist auf keine davon mit auch nur einem Satz Inhalt.
