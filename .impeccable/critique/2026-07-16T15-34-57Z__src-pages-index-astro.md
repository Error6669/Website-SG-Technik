---
target: index (homepage)
total_score: 26
p0_count: 1
p1_count: 2
timestamp: 2026-07-16T15-34-57Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design-review sub-agent · B: detector sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1/4 | Every CTA points to `/#kontakt`, an anchor that doesn't exist anywhere in the codebase — clicking produces zero feedback. |
| 2 | Match Between System & Real World | 4/4 | n/a — plainspoken technical German B2B register, real place names/numbers throughout. |
| 3 | User Control and Freedom | 3/4 | Mobile hamburger menu has no Escape-to-close, no click-outside-to-close, no focus management into the panel. |
| 4 | Consistency and Standards | 3/4 | Same core action rendered under three labels ("Kostenloses Erstgespräch vereinbaren" / "Kostenloses Erstgespräch" / "Kontakt aufnehmen"). |
| 5 | Error Prevention | 1/4 | Nine separate CTA instances ship pointing at a non-existent section, with no fallback. |
| 6 | Recognition Rather Than Recall | 4/4 | n/a — sticky header, self-labeling section anchors, clear service tags. |
| 7 | Flexibility and Efficiency | 3/4 | n/a for this page type; nothing notably missing. |
| 8 | Aesthetic and Minimalist Design | 4/4 | n/a — disciplined adherence to the hairline/flat system; no clutter. |
| 9 | Error Recovery | 0/4 | No custom 404 page; `/impressum` and `/datenschutz` currently 404 (pages don't exist). |
| 10 | Help and Documentation | 3/4 | ProcessSection works well as "what to expect" documentation; undercut by missing contact info. |
| **Total** | | **26/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment:** Clean, excluding the settled Plex/flat/no-card/no-shadow system (already a deliberate, documented brand identity — not flagged). No gradient text, no glassmorphism, no side-stripe borders. The Hero stat strip could superficially resemble a SaaS hero-metric template but is populated with genuinely specific proof (100–980 t, 15.000 l/h, ± 2 %, 24 h) rather than vague filler — exactly per PRODUCT.md's "specificity is the proof" principle. The mono eyebrows and numbered process steps are explicit, DESIGN.md-documented system elements, not reflexive AI scaffolding.

**Deterministic scan:** 4 findings, exit code 2. All four are `design-system-color`/`design-system-font` advisories: two undocumented colors in `LogoMark.astro` (`#3e6a94`, `#9fb2c2`, imported into Hero) and the `Logo Montserrat` font (declared twice in `global.css`) — none of the three appear in DESIGN.md's color or typography tables. Verified true positives against DESIGN.md's literal contents, though the code comments show the scoping was deliberate (logo-only). No layout, motion, contrast, or shadow violations fired anywhere.

**Where they agree:** Both assessments independently converge on the same small gap — DESIGN.md doesn't yet carve out an explicit "logo mark" exception for its own tri-tone palette and Montserrat font, even though the implementation clearly intends one. This is a documentation-completeness issue, not a design defect (P3, see below).

**Browser overlay:** Unavailable. Neither sub-agent had a browser automation tool in this session; the Astro dev server was already running (confirmed live via `curl` → HTTP 200 on :4321), but no screenshot or live console injection was possible. Two layout risks below (Hero/logo overlap, Process-section padding) are code-derived, not screenshot-confirmed.

## Overall Impression

The design system itself is exceptionally disciplined — DESIGN.md's flat, hairline-divided, no-card, no-shadow rules are followed almost without drift, and the copy is genuinely strong for a technical B2B register. But the site has a fatal, silent bug: **every single conversion path — all nine CTA instances, the header nav, and the footer nav — points at `/#kontakt`, a section that doesn't exist anywhere in the codebase.** For a site whose entire purpose (per PRODUCT.md) is generating free-consultation leads, this isn't polish, it's the site failing at its one job. That's the single biggest opportunity: build the missing Contact section (the copy already exists, unused, in `site.ts`) before anything else.

## What's Working

1. **ProcessSection's "Notdienst" highlight** — the one deliberate exception to the flat system (full-bleed dark navy, copper numeral, white text), landing precisely on the highest-stakes belief-ladder moment (24h emergency response). Earns its exception.
2. **Hero stat strip as genuine proof, not decoration** — turns a device that could read as a SaaS cliché into real credibility via specific, non-generic numbers.
3. **Copy discipline** — consistently technical and unhyped throughout Services/Process/About; matches "Handschlagqualität" without lapsing into consumer-marketing tone.

## Priority Issues

**[P0] Every conversion path is dead.**
Why it matters: `grep -rn "kontakt" src` and `find src/pages` confirm there is no `id="kontakt"` and no Contact component/page anywhere. Yet the nav link, both header CTAs (desktop + mobile), the Hero primary CTA, and all five Services "Kostenloses Erstgespräch" repeats — nine instances total — all link to `/#kontakt`. PRODUCT.md states the site's entire purpose is generating these leads; right now the most prominent element on the page does nothing when clicked.
Fix: Build the Contact section using the already-written, currently-unused copy in `site.ts` (`contact.headline`, `contact.lead`, `contact.person = 'Gregor Hofer'`), add `id="kontakt"`, and populate `contact.phone`/`contact.email` (currently empty TODO strings) or wire a working `mailto:`/form.
Suggested command: `/impeccable harden`

**[P1] Footer legal links are dead; no Impressum exists.**
Why it matters: `Footer.astro` links to `/impressum` and `/datenschutz`, but only `index.astro` exists under `src/pages`. Austrian GmbHs are legally required to provide an accessible Impressum, and a public-sector procurement audience doing due diligence on a contractor is exactly the audience most likely to check it before recommending an Erstgespräch internally.
Fix: Ship minimal Impressum/Datenschutz pages before launch.
Suggested command: `/impeccable harden`

**[P1] The page ends on its weakest beat.**
Why it matters: ReferencesSection is the last content section — a bare list of four project names, no CTA, no reinforcement of the offer — immediately followed by a Footer whose Kontakt links are dead. Per the peak-end rule, the final active impression should reinforce the offer, not trail off passively.
Fix: Add a closing CTA band after References restating the primary CTA and the 24h-response line, once the anchor itself is functional.
Suggested command: `/impeccable layout`

**[P2] Hero LogoMark may overlap headline text at 768–1100px (unverified visually).**
Why it matters: The logo is `absolute right-4 top-1/2 w-[21rem] -translate-y-1/2` (growing to `w-[24rem]` at `lg`), vertically centered across the entire text block, while the text column has no reserved right-side margin at `md`. Both logo and headline use similar navy tones — any overlap would hurt legibility, not just look busy. Code-derived risk, flagged for visual QA at 768/900/1024px.
Fix: Reserve a right-side exclusion on the text column (e.g. `md:max-w-[26rem]`) or convert to an explicit two-column grid.
Suggested command: `/impeccable adapt`

**[P3] Documentation gap: logo mark's colors/font aren't carved out as an exception in DESIGN.md.**
Why it matters: The detector correctly flags `#3e6a94`, `#9fb2c2`, and `Logo Montserrat` as undocumented — even though the code comments show the scoping to the logo mark was deliberate. Left as-is, every future detector run will re-flag intentional, settled choices as violations.
Fix: Add a short "Logo Mark exception" note to DESIGN.md's Colors/Typography sections documenting the three-tone gradient and the Montserrat font as scoped exclusively to `LogoMark.astro`.
Suggested command: `/impeccable document`

## Persona Red Flags

**Jordan (confused first-timer):** Reads the hero, likes the specificity, clicks the big copper "Kostenloses Erstgespräch vereinbaren" button — nothing happens. No form, no scroll, no error. Jordan's first real interaction with the brand is a dead button, directly contradicting the "engineering-grade, not amateur" positioning at the worst possible moment.

**Riley (stress-tester):** Systematically clicks all 9 CTA instances (all dead), then the footer's Impressum/Datenschutz links (404), then tries keyboard-only navigation on the mobile menu (no Escape-close, no focus trap). Concludes the site "isn't finished" — a dangerous impression for a company selling long-term reliability.

**Procurement officer (project-specific):** Values the technical specificity and named-client list highly — well served by the existing content. But finds no visible phone number anywhere on the page, no downloadable spec/PDF, and no working Impressum to verify legal registration before recommending internal follow-up — a real due-diligence gap for exactly this buyer.

## Minor Observations

- Three different labels for what should read as one repeated action ("Kostenloses Erstgespräch vereinbaren" / "Kostenloses Erstgespräch" / "Kontakt aufnehmen") — consider standardizing.
- `contact.person` ("Gregor Hofer") is defined in `site.ts` but rendered nowhere — a named human contact is exactly the "Handschlagqualität" proof point PRODUCT.md calls for, currently unused.
- ProcessSection's highlighted last item uses `-mx-6 px-6 sm:-mx-10 sm:px-10` against a container fixed at `px-6` — a 16px mismatch per edge once `sm` breakpoint kicks in.
- Services section renders all 5 services fully expanded (intro + 3 paragraphs each) with no collapse/summary-first option — appropriate for a detail-hungry audience, but worth watching as content grows.
- Section anchors use `scroll-mt-24` (96px); worth confirming this matches the actual fixed-header height so anchor-jumps don't leave headings partially covered.
