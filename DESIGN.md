---
name: SG Technik GmbH
description: Silo- und Soleanlagenbau — an engineering-drawing-flat, hairline-divided industrial site for winter road-service infrastructure
colors:
  navy-900: "#0d2436"
  navy-800: "#183a59"
  slate-600: "#526376"
  slate-500: "#6b8299"
  slate-300: "#a9b7c4"
  mist-100: "#e4e9ed"
  fog-50: "#f5f7f8"
  paper: "#fbfcfc"
  copper-500: "#b15a2e"
  copper-600: "#8f4523"
  line: "rgba(24, 58, 89, 0.12)"
typography:
  display:
    fontFamily: "'Plex Sans', 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Plex Sans', 'Segoe UI', system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 2.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Plex Sans', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Plex Sans', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "'Plex Mono', 'SFMono-Regular', Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  sm: "2px"
spacing:
  section-y: "5rem"
  section-y-lg: "7rem"
  container-x: "1.5rem"
  container-max: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.copper-600}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "#7a3a1d"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.navy-800}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  nav-link:
    textColor: "{colors.slate-300}"
    typography: "{typography.body}"
  nav-link-hover:
    textColor: "{colors.fog-50}"
---

# Design System: SG Technik GmbH

## 1. Overview

**Creative North Star: "The Site Plan"**

This system reads like a technical drawing, not a marketing page. Every surface is flat — there is no shadow anywhere in the codebase. Structure comes from hairline rules (`border-line`, a 12%-opacity navy) that divide content the way a drawing separates one detail from the next, and from mono, tabular-numeral readouts (stat values, process-step numbers) that behave like instrument labels rather than decoration. The palette is a deep navy-to-copper range pulled directly from the company's logo mark: navy for authority and ink, copper as the single, deliberately rare accent that marks calls to action and enumerated tags. Nothing here performs — it demonstrates. Per PRODUCT.md, the system explicitly rejects the flashy startup/SaaS look (no gradients, no glassmorphism, no hero-metric-dashboard clichés), the generic corporate-stock-photo site, and anything that reads cheap or DIY. It should feel like it was engineered by the same people who engineer the silos.

**Key Characteristics:**
- Flat by construction — zero box-shadow declarations anywhere in the codebase.
- Dividers, not containers — sections separate content with 1px hairline rules and background zebra-striping, never with cards.
- Mono tabular numerals for anything measured or sequenced (stats, process steps).
- One accent color (copper), used sparingly: primary CTA, tag labels, bullet marks, small dashes.
- Self-hosted IBM Plex Sans/Mono throughout; no external font requests.

## 2. Colors

A cool navy-to-slate neutral range anchored by one warm accent; the palette is restrained (per PRODUCT.md's committed-but-not-loud personality), not full or drenched.

### Primary
- **Signal Navy** (`#183a59` / navy-800): headings, the logo mark, and the strongest text on light backgrounds. Carries authority without going pure black.
- **Night Steel** (`#0d2436` / navy-900): body text color at the root, and the background of the header and footer — the site's darkest surface.

### Secondary
- **Oxide Copper** (`#b15a2e` / copper-500): the single accent color. Used at low surface coverage — bullet dots, the hero eyebrow's dash, service tag labels, the last (Notdienst) process step's numeral. Its rarity is the point; it never fills a large surface.
- **Burnt Copper** (`#8f4523` / copper-600): the primary-button fill, one shade darker and more saturated than Oxide Copper so the CTA reads as the one clickable, high-commitment surface on the page.

### Neutral
- **Graphite Slate** (`#526376` / slate-600): the default body-copy color on light backgrounds — used far more than navy-900, which is reserved for the very first paragraph in a block or highest-emphasis text.
- **Muted Steel** (`#6b8299` / slate-500): a secondary stroke tone, mostly inside decorative SVG (the flow motif, the logo's mid-tone chevron).
- **Cool Mist** (`#a9b7c4` / slate-300): borders on light surfaces (secondary-button outline) and nav-link text against the dark header.
- **Pale Mist** (`#e4e9ed` / mist-100): reserved lightest neutral step; not yet in active use in shipped components, kept for future tonal needs.
- **Fog White** (`#f5f7f8` / fog-50): the default body background and one half of the section zebra-stripe.
- **Paper White** (`#fbfcfc` / paper): the other half of the section zebra-stripe, and the background of individual stat cells inside the hairline grid.
- **Hairline Navy** (`rgba(24, 58, 89, 0.12)` / line): the one border/divider color used everywhere structure is needed — never a solid neutral gray.

### Named Rules
**The One Accent Rule.** Copper appears only as a mark, a dash, a bullet, or a CTA fill — never as a section background or a large shape. If copper is covering more than a button or a hairline, it's wrong.

**The Hairline-Not-Gray Rule.** Every divider and border on this site is `line` (`rgba(24, 58, 89, 0.12)`), a translucent tint of navy — never a flat neutral gray like `#e5e5e5`. This is what keeps the flat, hairline-heavy layout feeling drawn rather than templated.

### Logo Mark Exception
`LogoMark.astro` alone uses three additional navy-family tones not listed above — `#3e6a94`, `#9fb2c2`, `#e6ebf0` — for its three animated flow-pulse strokes, plus the base chevron strokes `#183a59`/`#788c9e`/`#c7cfd6`. These exist only inside that one component (the tri-tone gradient is the mark's own signature, not a system color) and must not be reused elsewhere; anywhere else on the site, use the documented Primary/Secondary/Neutral palette above instead.

## 3. Typography

**Display/Body Font:** Plex Sans (self-hosted, weights 400/600/700), with `Segoe UI, system-ui, sans-serif` fallback
**Label/Mono Font:** Plex Mono (weight 500), with `SFMono-Regular, Consolas, monospace` fallback

**Character:** One family carrying the whole system in three weights reads as plainspoken and technical rather than editorial — the contrast axis is sans vs. mono, not two different sans-serifs. Mono is reserved for anything that should read as measured or counted; Plex Sans carries every narrative sentence.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 4vw, 3.75rem)`, line-height 1.05, tracking tight): the hero headline only. `text-wrap: balance` keeps it from breaking awkwardly.
- **Headline** (700, `clamp(1.875rem, 2.5vw, 2.25rem)`, line-height 1.2): section `h2`s (Leistungen, Über uns, Referenzen, the process section).
- **Title** (600, 1.125rem): sub-headings inside a section (e.g. "Was wir tun", a service name at the smaller weight, `about.whatWeDo.headline`).
- **Body** (400, 1rem, line-height 1.625): all running copy; capped implicitly by `max-w-xl`/`max-w-2xl` containers, which keep lines within the 65–75ch target.
- **Label** (500, 0.75rem, tracking 0.14em, uppercase, mono): the hero eyebrow, service tags ("Leistung 01"), and the "Wer sind unsere Kunden" / "Wofür wir stehen" mini-headers.

### Named Rules
**The Mono-Means-Measured Rule.** Plex Mono is reserved for numbers and labels that represent something counted, sequenced, or tagged (stats, process-step numerals, uppercase eyebrows/tags) — never for narrative prose.

### Logo Mark Exception
`LogoMark.astro`'s ring-text (`SILO- UND SOLEANLAGENBAU`) and the header/footer wordmark styling use `Logo Montserrat` (weights 500/600), not Plex Sans. This font is scoped exclusively to the logo mark component — it is the mark's own typographic signature, inherited from the original animated logo file, and must never be used for body copy, headings, or any other system typography.

## 4. Elevation

This system has no shadow vocabulary at all — it is flat by explicit construction, not by omission. Depth and grouping come from two devices instead: hairline borders (`line`) that separate list items and sections, and background zebra-striping (`fog-50` ↔ `paper`) that distinguishes one section from the next. The one place a surface visually "lifts" is the fixed header, which uses `backdrop-blur-md` over a translucent navy (`bg-navy-900/90`) rather than a shadow, so content scrolling underneath softens instead of the header appearing to float above it.

### Named Rules
**The No-Shadow Rule.** Never add `box-shadow` to convey elevation. Depth is expressed with hairline dividers and background contrast only. If a new component seems to need a shadow to separate it from its surroundings, that's a signal to add a `border-line` rule or a background-color change instead.

## 5. Components

Flat and exact — dividers, not containers. Nothing on this site is a card; every grouped structure separates its members with a `line` hairline rather than a background box or shadow.

### Buttons
- **Shape:** `rounded-sm` (2px) — barely-there corners, never fully square, never pill-shaped.
- **Primary:** Burnt Copper fill (`#8f4523`), white text, `padding: 14px 24px`, semibold Plex Sans. The only solid-fill button on the site; reserved for the "Kostenloses Erstgespräch" CTA and its repeats.
- **Secondary:** transparent background, `1px` Cool Mist border (`#a9b7c4`), navy-800 text, `padding: 10px 20px`.
- **Hover / Focus:** primary darkens to `#7a3a1d`; secondary's border shifts to solid navy-800. Both are simple `transition-colors` — no transform, no shadow appears on hover.

### Cards / Containers
There are no cards in this system. Where a card might normally appear (a stat block, a reference entry, a process step), the pattern instead is a **hairline grid or divided list**:
- **Stat strip** (Hero): a `grid` of cells sharing a single 1px `line` border and 1px gaps, each cell filled `paper` — visually one seamless ruled table, not four separate boxes.
- **Divided lists** (About's scope items, Services, Process, References): `divide-line` plus a `border-t`/`border-b border-line` around the whole list. Each entry is separated from its neighbor by a single hairline, with no background change.

### Named Rules
**The No-Card Rule.** Any new "collection of things" component (a new list, a new set of stats, a new set of features) should default to a hairline-divided grid or list, never a set of individually-boxed cards.

### Inputs / Fields
No form fields exist in the shipped code yet (`contact.phone`/`contact.email` are placeholders pending real values). When added, they should follow the button vocabulary: `rounded-sm`, `1px` Cool Mist border at rest, solid navy-800 border on focus — no glow, no shadow, consistent with the No-Shadow Rule.

### Navigation
- **Header:** fixed, full-bleed, `bg-navy-900/90` with `backdrop-blur-md`, a `1px` `border-white/10` bottom rule. Logo wordmark in Plex Sans semibold, fog-50. Desktop nav links in slate-300, hover to fog-50; the primary CTA repeats as an outlined copper-500 button in the header, filling solid copper-600 on hover.
- **Mobile:** a hamburger toggle (three horizontal strokes, `currentColor`) reveals a full-width dropdown panel in `bg-navy-900` with a `border-t border-white/10`, stacked nav links, and the CTA repeated as a solid copper-600 button at the bottom.
- **Footer:** `bg-navy-900`, `text-slate-300`, inverted logo mark, nav links repeated, legal links (Impressum/Datenschutz) in a smaller `text-xs` row separated by its own hairline.

### The Logo Mark (signature component)
An animated SVG wordmark (`LogoMark.astro`) built from three overlapping chevrons in a navy gradient (`#183a59` → `#788c9e` → `#c7cfd6`), each swaying gently and independently (`translateY`, 4.6s ease-in-out, staggered delays) with a normalized light-pulse (`pathLength="100"`, dashed stroke animating `stroke-dashoffset`) flowing through each chevron at a different pace and tint. This is the one place the system allows continuous ambient motion, echoing the flow of material through the silos it represents. Fully respects `prefers-reduced-motion` by disabling the sway and hiding the flow strokes entirely. The same flowing-line idea reappears, simplified, as the decorative `FlowMotif.astro` used elsewhere.

## 6. Do's and Don'ts

### Do:
- **Do** keep every divider and border as `line` (`rgba(24, 58, 89, 0.12)`), never a flat gray.
- **Do** use hairline-divided grids/lists for any new collection of items — stats, steps, references, features.
- **Do** reserve copper for CTAs, tags, bullets, and small marks — never a section background.
- **Do** use Plex Mono only for numbers, tags, and uppercase labels; Plex Sans for everything else.
- **Do** keep motion purposeful and rare: the logo sway/flow and the FlowMotif dash animation are the only continuous animations on the site, and both already respect `prefers-reduced-motion`.

### Don't:
- **Don't** introduce `box-shadow` anywhere — this system has none, by the Named No-Shadow Rule.
- **Don't** wrap content in cards. Per PRODUCT.md's anti-references and the No-Card Rule, boxed/shadowed containers read as generic-corporate or SaaS-template, which this brand explicitly rejects.
- **Don't** use gradients, glassmorphism, or a hero-metric-dashboard layout — PRODUCT.md names these directly as what the site should not look like.
- **Don't** use stock photography or generic corporate imagery; the site currently ships with no photography at all, relying on typography, the logo mark, and named/measured proof instead.
- **Don't** let copper cover more than a button, a tag, or a hairline mark — if it's filling a large surface, that violates the One Accent Rule.
