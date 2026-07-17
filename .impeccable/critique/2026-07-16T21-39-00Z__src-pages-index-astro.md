---
target: index (homepage)
total_score: 24
p0_count: 0
p1_count: 1
timestamp: 2026-07-16T21-39-00Z
slug: src-pages-index-astro
---
Method: dual-agent (A: general-purpose design-review sub-agent · B: general-purpose detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Every CTA promises "Kostenloses Erstgespräch," but the destination has no live phone/email yet — no signal this isn't fully live until the visitor lands there. |
| 2 | Match Between System & Real World | 3/4 | Correct plainspoken B2B German throughout; a couple of technical terms (SalzManager, Überfüllschutzstecker) assume prior domain knowledge. |
| 3 | User Control and Freedom | 3/4 | Mobile menu closes on Escape/outside-click with focus returned to the toggle (verified live); no "back to top" affordance on a long single-scroll page. |
| 4 | Consistency and Standards | 3/4 | Spacing/buttons pixel-consistent everywhere; the logo mark itself renders three different ways (plain text in header, animated SVG in hero, static inverted SVG in footer). |
| 5 | Error Prevention | 2/4 | Nothing stops 6+ CTA instances from funneling into a contact section where `contact.phone`/`contact.email` are still empty placeholders. |
| 6 | Recognition Rather Than Recall | 3/4 | Sticky header keeps navigation visible; no active-section/scroll-progress indicator across a very long page. |
| 7 | Flexibility and Efficiency | 2/4 | Single linear path is appropriate for the format, but zero acceleration — no click-to-call yet since the number is blank. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Disciplined hairline/copper system with no cards or shadows; minor rough edge where a hero stat value can wrap awkwardly on narrow phones. |
| 9 | Error Recovery | 2/4 | Missing-contact-info state renders a graceful italic placeholder rather than a broken link, but offers no alternative action (no interim email, no form). |
| 10 | Help and Documentation | 1/4 | No glossary, no downloadable spec sheet for a procurement-committee audience, no FAQ. |
| **Total** | | **24/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment (Assessment A):** No gradient hero, no glassmorphism, no fake dashboard-metric cards, no stock photography, no bento grid — the site actively avoids the most common 2024–2026 AI tells, which is genuinely uncommon. Two subtler patterns from the ban list survive inside the *documented* design system itself: (1) the tracked-uppercase-mono "eyebrow" (dash + small-caps label) repeats near-identically in Hero, Products, and Contact — three instances of the exact banned kicker recipe; (2) Services are tagged "Leistung 01"–"Leistung 05" even though the five services aren't a sequence (unlike Process, which legitimately is 7 ordered steps) — numbering a non-sequential list is the numbered-scaffolding ban, just codified into `DESIGN.md` as if intentional. With zero photography and 8 sections following an identical kicker→headline→hairline-list rhythm, the page reads less like generic AI slop and more like a spec sheet with a template stamped over it — competent but monotonous at the macro level.

**Deterministic scan (Assessment B):** `node detect.mjs --json src/` → **0 findings**. Clean. URL-mode scan correctly reported puppeteer unavailable (honest tool-unavailable result, not a crash).

**Browser evidence (Assessment B):** Full-page screenshots at 375/640/768/900/1024/1280/1920px — **zero horizontal overflow at any width** (scrollWidth === clientWidth throughout). Keyboard focus: all 8 sampled focusable elements show a visible `outline: auto`, no `outline: none` anywhere in the codebase. Mobile menu: opens correctly, moves focus to the first link, Escape closes it and returns focus to the toggle — all verified live, not just read from source.

**Where A and B disagree (resolved by independent recalculation):** Assessment A flagged two contrast failures as P1s — header nav `text-slate-300` on the header background (~2.85:1) and `text-slate-300/70` in the Contact section (~1.7:1). Assessment B computed these same pairs at 5.84:1 (pass) and 4.52:1 (pass) respectively. I recalculated both independently using the actual token hex values and alpha-blend math: **Assessment B is correct on both.** Header nav blends `navy-900/90` over the page background to an effective `#243949`, giving `slate-300` a comfortable 5.84:1 against it. The Contact section's `slate-300/70` blends to an effective `#7a8b99` over solid `navy-900`, giving **4.52:1 — a real pass, but by only 0.02 over the 4.5:1 threshold**, with zero margin for rendering/gamma variance. Assessment A's numbers don't reflect the alpha-blended reality and should be treated as false positives for severity purposes, though the underlying instinct (that translucent light text on dark navy deserves scrutiny) was reasonable — it just landed on the one genuinely fragile pair, not a failing one.

**Where A and B agree:** Both independently converged on the primary conversion path being non-functional (contact info not yet populated) as the single biggest issue, and both found the codebase otherwise clean of layout/motion/shadow violations.

## Overall Impression

The design system execution is excellent — flat, hairline-divided, disciplined color use, zero shadows or cards, genuinely specific proof throughout (real numbers, real place names). Since the last critique (26/40, 2026-07-16), the P0 dead-CTA bug, the P1 missing legal pages, and the P1 weak page-ending have all been fixed, plus a real header-nav wrap bug and a real horizontal-overflow bug were caught and fixed in this pass. The score moved from 24/40 in this fresh, independent read to a lower number than the prior snapshot's 26 — not because the site regressed, but because this run's scoring is stricter on a few things the last run didn't weigh as heavily (Help & Documentation, Flexibility & Efficiency), and because the underlying gap driving several heuristic points down is the same one both assessments still call out: **`contact.phone` and `contact.email` are still empty placeholder strings.** Populating those two fields would mechanically lift heuristics 1, 5, 7, and 9 by removing the one remaining structural gap in an otherwise complete, well-crafted site.

## What's Working

1. **The Hero stat strip** — a hairline-bordered instrument-panel grid of real, specific numbers (100–980 t, 15.000 l/h, ± 2 %, 24 h) that earns the "technical drawing" positioning without a single card or shadow.
2. **ProcessSection's Notdienst highlight** — the one deliberate, restrained break from the flat system (inverted navy, copper numeral), landing exactly on the highest-stakes belief-ladder moment (24h emergency response).
3. **ContactSection's honest placeholder handling** — conditionally rendering "folgt in Kürze" instead of a broken `tel:`/`mailto:` link is a thoughtful, non-generic way to handle incomplete data most templates would ship broken.

## Priority Issues

**[P1] The primary conversion path still has no working contact method.**
Why it matters: `contact.phone`/`contact.email` in `src/content/site.ts` are still empty strings. Every CTA (header ×2, hero, 5× services, closing CTA band) correctly routes to a section that now *exists* (last critique's P0), but that section still can't complete the one action the entire site exists to drive. Both independent assessments named this the top issue.
Fix: populate `contact.phone`/`contact.email` as soon as real values are available, or add an interim `mailto:` general inquiry address / working form in the meantime so no visitor hits a dead end.
Suggested command: `/impeccable harden`

**[P2] Logo mark identity is inconsistent across the page.**
Why it matters: `Header.astro` renders plain text, `Hero.astro` renders the full animated SVG `LogoMark`, `Footer.astro` renders a static inverted SVG — three different treatments of the same brand mark. For a positioning built on "precise, engineering-grade," an inconsistent mark is a small but real credibility ding on repeat viewing.
Fix: this is already a known, user-confirmed decision per `PROJECT_STATUS.md` (header/footer intentionally keep the official static mark, animated version reserved for the hero) — no change recommended, but worth a one-line note in `DESIGN.md`'s existing Logo Mark section so future reviews don't re-flag a settled choice.
Suggested command: `/impeccable document`

**[P2] The tracked-uppercase-mono eyebrow and non-sequential "Leistung 0X" numbering are self-inflicted instances of two patterns the skill explicitly bans elsewhere.**
Why it matters: `DESIGN.md` codifies both as intentional system elements, but the eyebrow repeats near-identically in Hero/Products/Contact (the exact "kicker on every section" tell), and Services' 5 items aren't a real sequence the way Process's 7 steps are — numbering them borrows Process's earned device without the same justification.
Fix: vary the section-opener cadence (not every section needs the dash+eyebrow), and consider dropping the "01–05" numbering from Services in favor of the tag-only treatment, reserving numbered sequence for Process where it's earned.
Suggested command: `/impeccable typeset`

**[P3] `text-slate-300/70` in ContactSection passes contrast by only 0.02.**
Why it matters: 4.52:1 against the 4.5:1 AA threshold leaves zero margin for rendering/gamma variance across displays — a technically-passing value this close to the line is fragile, not robust.
Fix: drop the `/70` opacity modifier to full-opacity `slate-300` (7.75:1 solid, comfortable margin) for the dt labels and placeholder captions in `ContactSection.astro`.
Suggested command: `/impeccable polish`

**[P3] Hero stat value can wrap awkwardly on narrow phones.**
Why it matters: "100–980 t" can break to "100–980" / "t" on its own line at small widths, a small visible rough edge in the section specifically meant to read as a precision instrument panel.
Fix: `white-space: nowrap` on the stat `dd`, or a non-breaking space between the number and its unit.
Suggested command: `/impeccable polish`

## Persona Red Flags

**Jordan (confused first-timer):** Clicks the hero's primary CTA, lands on Kontakt, reads "Telefonnummer folgt in Kürze" — no alternate path offered. Also hits unexplained jargon ("SalzManager", "Überfüllschutzstecker") with no inline definition. Will likely conclude there's currently no way to actually reach the company.

**Riley (stress-tester):** Systematically clicks every CTA instance (all six-plus land on the same not-yet-actionable contact section, confirming it's systemic) and tabs through the mobile menu — Escape-close and focus-return both work correctly on live testing, so this persona finds less to complain about here than in the pre-Phase-3 version of the site.

**Ingrid (Verfahrenstechnikerin, Beschaffung — project-specific, derived from PRODUCT.md's audience):** A technical/procurement officer evaluating SG Technik for a safety-critical, multi-year installation, who needs to justify the choice to a committee. PRODUCT.md names a client-logo roster meant to appear on the site (Land OÖ, Asfinag, voestalpine, etc.) and a project-photo backlog, but neither exists on the live page yet — the four named references are text-only. `PRODUCT.md` itself already tracks this as a pending asset drop, so it's a known gap, not a fresh finding — but it's exactly the kind of proof this persona would look for before recommending internal follow-up.

## Minor Observations

- `about.eyebrow` is defined in `src/content/site.ts` but never rendered in `AboutSection.astro` — dead content worth either using or removing.
- Services' alternating `lg:order-2` layout swaps text order left/right but has no visual asset to actually swap, so the alternation currently reads as motion without a visible payoff.
- `html { scroll-behavior: smooth }` plus `scroll-mt-24` works correctly on live anchor-jump testing (verified this pass).
- No custom `:focus-visible` styling exists anywhere (confirmed by grep); the browser-default `outline: auto` is relied on throughout and — per this run's live testing — renders with sufficient contrast on both the dark header and light sections, so this is a style choice that happens to work rather than a designed one.
