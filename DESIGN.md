---
name: SteylVisuals
description: Black-first creative studio identity built around a single gold full stop.
colors:
  black: "#0D0B09"
  panel: "#1A1512"
  brown: "#3B1E0B"
  gold: "#C9974A"
  gold-light: "#E6C894"
  cream: "#F1EDE6"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.75rem, 6vw, 4.75rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "0"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "0"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "0"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0"
  subline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: "0.02em"
  label:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.26em"
  wordmark:
    fontFamily: "Montserrat, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.035em"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.black}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "18px 40px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "18px 40px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "40px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 0"
---

# Design System: SteylVisuals

## Overview

**Creative North Star: "The Gold Punctuation"**

The brand is a full stop. Everything else on the page is the quiet sentence that earns it. That single gold dot in the wordmark is the only thing in the system permitted to be loud, and it works only because the ninety percent around it refuses to compete — held black, unhurried type, generous air, no second accent asking for attention.

This inverts how most studio sites behave. The instinct is to open loud and stay loud; here the surface is dark and still, and gold arrives once per view to mark the thing that matters — a kicker, a number, the dot, the one button worth pressing. When gold shows up twice in a viewport, one of them is decoration and should be removed. The ratio in the brandbook — roughly 70% black, 20% cream, 10% gold — is not a suggestion about mood, it is the mechanism. Exceed the gold and the punctuation becomes texture, and the identity stops working.

Typography carries the warmth that the palette deliberately withholds. Cormorant Garamond Light speaks — hero lines, section openers, pull quotes — and Poppins works, carrying every label, paragraph, button and nav item without ever raising its voice. Montserrat 800 belongs to the logo and to nothing else; the moment it appears as a heading, the wordmark loses the one weight that identifies it.

**Key Characteristics:**
- Black-first: `#0D0B09` is the ground state of every surface, not a dark-mode variant
- One accent, rationed: gold appears roughly once per viewport
- Two voices, strictly divided: serif speaks, sans works
- Motion belongs to the dot; the wordmark never animates letter-by-letter
- Flat by default — depth comes from tonal steps, not shadows

## Colors

A near-black ground with warm cream text and a single metallic accent; the brown exists only for light and print surfaces, where black would be too severe.

### Primary
- **Signal Gold** (`#C9974A`): The dot, primary buttons, kickers, numerals, active states, rules and dividers that need to register. Never as a filled panel behind running text — gold is a mark, not a material.
- **Lit Gold** (`#E6C894`): Hover state for gold elements, and the substitute for Signal Gold when gold text falls below ~14px, where the darker tone starts to muddy.

### Neutral
- **Studio Black** (`#0D0B09`): The ground of everything — site, video, decks. Not a background color so much as the default state of the surface.
- **Panel** (`#1A1512`): Exactly one step up from black, for cards and sections that need to separate from the ground. The step is small on purpose; if a panel reads as a distinctly different color, it is too light.
- **Cream** (`#F1EDE6`): All body and heading text on black, and the light carrier for print.
- **Deep Brown** (`#3B1E0B`): The logo on light surfaces and print on cream stock. Never a background on the web surface.

### Named Rules

**The One Punctuation Rule.** Gold appears once per viewport. A gold kicker and a gold button in the same screenful means one of them is decoration — cut it. The dot in the logo does not count against the budget; it is the brand mark, not an accent.

**The 70/20/10 Rule.** Roughly 70% black, 20% cream, 10% gold, measured by area across any full view. This is auditable: screenshot a page, squint, and if gold reads as a texture rather than as punctuation, the ratio has slipped.

**The Contrast Pairing Rule.** Only four text pairings are approved, and three of them are safe everywhere: cream on black (16.8:1), gold on black (7.5:1), black on gold (7.5:1), brown on cream (13.1:1). **Cream on gold is 2.2:1 and fails** — it is permitted for the logo lockup and display-size type only, never for body copy, buttons or labels. A gold button therefore takes black text, not cream.

**The Muted Floor Rule.** Secondary text is cream at 70% opacity (8.4:1 on black), never a gray. Gray on this ground goes dead. 60% is the hard floor (6.4:1); below that, raise the opacity rather than accepting the wash.

## Typography

**Display Font:** Cormorant Garamond Light (300), with Georgia and system serif fallbacks
**Body Font:** Poppins (300 / 400 / 500), with system-ui fallback
**Wordmark Font:** Montserrat 800 — logo only, never available to page content

**Character:** A high-contrast pairing on a genuine axis — a light old-style serif against a geometric sans. The serif carries all the warmth and every claim the brand makes about craft; the sans is deliberately neutral so it never competes. The two are never used for the same job.

### Hierarchy
- **Display** (Cormorant 300, `clamp(2.75rem, 6vw, 4.75rem)`, line-height 1.05): Hero lines only, one per page. Italic is available for the single word being emphasized — the brandbook's example is *content* in the hero.
- **Headline** (Cormorant 300, `clamp(1.75rem, 3.5vw, 2.5rem)`, line-height 1.15): Section openers. Never below 18px — the hairlines break up.
- **Title** (Cormorant 300, 24px, line-height 1.15): Card headings, pull quotes, and names — anywhere the serif needs to label something rather than open a section. The smallest permitted Cormorant size after the 18px floor.
- **Subline** (Poppins 300, ~17px, line-height 1.6, tracking 0.02em): The sentence under a headline. Light weight with slightly open tracking.
- **Body** (Poppins 400, 16px, line-height 1.7): All running text. Cap measure at 65–75ch. Never below 15px.
- **Label / Kicker** (Poppins 500, 11px, tracking 0.26em, uppercase): Kickers, nav items, buttons, metadata. The wide tracking is the signature — at this size it reads as a texture, not as words.

### Named Rules

**The Two Voices Rule.** Cormorant speaks, Poppins works. A serif button, a serif nav item, or a serif form label is a category error. Equally, a Poppins hero throws away the only warmth in the system.

**The Locked Wordmark Rule.** Montserrat 800 is the logo's alone. Using it for a heading — even once, even large — dissolves the wordmark's distinctiveness, because its weight stops being unique to the mark.

**The Kicker Cadence Rule.** The brandbook's three-voice stack (gold kicker → light serif headline → Poppins body) is a deliberate brand system, not generic scaffolding, and it is the sanctioned section opener. But it earns its place by carrying a real word — a section name, a chapter, a claim. A kicker that only says "ABOUT" above a heading that already says About is filler; drop the kicker rather than pad it.

## Layout

A single centered column with wide gutters, sized by viewport rather than by breakpoint where possible: `clamp(1.5rem, 6vw, 5rem)` horizontal padding, `clamp(5rem, 10vh, 8rem)` vertical section rhythm. Content measure caps at 65–75ch regardless of viewport.

Sections vary their vertical weight deliberately — a hero holds a full viewport, a proof section is compact, a closing CTA is given the most air on the page. Uniform section heights flatten the reading rhythm and are the main way a black-first page starts to feel monotonous.

Responsive grids use `repeat(auto-fit, minmax(280px, 1fr))` rather than breakpoint-stepped columns. The logo's title-safe inset (6.5% in video) carries over to the web surface as the minimum edge margin for the mark in any corner-anchored position.

## Elevation & Depth

**No shadows.** Depth is tonal: black ground, panel one step up, and hairline borders at `rgba(241,237,230,0.08)` where a boundary genuinely needs to exist. On a near-black surface a drop shadow is invisible at best and a gray smear at worst, so the system does not use one.

Where lift is needed on hover, it comes from the border warming toward gold and the surface stepping from `#0D0B09` to `#1A1512` — never from a shadow or a scale transform.

### Named Rules

**The No-Shadow Rule.** If an element needs to separate from its surroundings, use a tonal step or a hairline border. Reaching for `box-shadow` on this ground means the hierarchy problem is elsewhere.

## Shapes

Near-square. Radii are `2px` on buttons and inputs and `4px` on panels — enough to avoid a raw hard-edge look, small enough that nothing reads as a pill or a rounded card. The one true circle in the system is the dot, and its uniqueness is the point: a second circular element competes with the brand mark.

Rules and dividers are 1px hairlines, gold when they are marking something and cream-at-8% when they are merely separating.

*(Radius and spacing values were established during the 2026 implementation, not by the brandbook, which specifies logo, color, type and motion only.)*

## Components

### Buttons
- **Shape:** Near-square (`2px`), never pill-shaped
- **Primary:** Signal Gold background with **black** text (never cream — see the Contrast Pairing Rule), Poppins 500 at label size with 0.26em tracking, padding `18px 40px`
- **Hover / Focus:** Background lifts to Lit Gold over 0.3s; focus-visible adds a 2px cream outline at 2px offset
- **Ghost:** Transparent with a cream hairline border and cream text; on hover the border and text both go gold. Used for the secondary action next to a primary.

### Cards / Containers
- **Corner Style:** `4px`
- **Background:** Panel (`#1A1512`) on the black ground
- **Shadow Strategy:** None — see Elevation & Depth
- **Border:** 1px `rgba(241,237,230,0.08)`, warming to `rgba(201,151,74,0.35)` on hover
- **Internal Padding:** `clamp(1.75rem, 4vw, 2.5rem)`

### Inputs / Fields
- **Style:** Transparent background with a cream-at-20% bottom rule only — no boxed fields. Poppins 400, cream text.
- **Focus:** Bottom rule goes gold and thickens to 2px; no glow.
- **Placeholder:** Cream at 70%, never lower — placeholders are held to the same 4.5:1 as body text.
- **Error:** Rule and message in Lit Gold, not red; the palette has no red and introducing one breaks the system.

### Navigation
- Poppins 500 at label size, uppercase, 0.26em tracking, cream. Active and hover states go gold. Transparent over the hero, gaining the panel background and a hairline bottom border once scrolled.
- Mobile: full-screen black overlay, items stacked at headline size in Cormorant — the one place the serif is allowed to do a working job, because at that scale it is a statement rather than a label.

### Logo Lockup (signature)
"Steyl." in Montserrat 800 at `-0.035em` tracking with the period in Signal Gold, and "VISUALS" beneath in Poppins 400 at `0.5em` tracking, left-aligned to the S rather than centered. Clear space on all sides is at minimum the diameter of the dot. Below 90px wide the "VISUALS" line drops; below 32px only the "S." icon is used (favicon, avatar, app icon).

### Brand Intro (signature)

A full-screen black overlay playing the logo sting, on the homepage only. It runs **once per session**, never under `prefers-reduced-motion`, and is dismissible by click, Esc, or a skip control. The hero renders underneath and is never gated on it: a blocked autoplay, a failed fetch or a headless render all leave the page fully intact, and the overlay is `display: none` by default so prerendered HTML is never a black screen.

The source render is 5s and ends on a cream end card at ~3.8s. The shipped file is cut at **2.8s** — dot in, wordmark wipe, VISUALS, one beat of hold — so the overlay's own 0.6s fade stands in for the brandbook's wipe and the transition into the hero stays black-to-black.

**Known deviation:** the dot in the current sting render is cream (`#F1EDE6`), not Signal Gold. The brandbook states the dot is always gold and lists recolouring it as a "niet". Re-render from source to correct it; do not fix it in code.

## Do's and Don'ts

### Do:
- **Do** keep `#0D0B09` as the ground state of every surface; light sections are the exception that must be argued for.
- **Do** give a gold button black text — cream on gold fails contrast at 2.2:1.
- **Do** use cream at 70% opacity for secondary text rather than any gray.
- **Do** let only the dot animate independently: in at 0.4s ease-out, hold 1.2s, wipe out at 0.6s ease-in-out.
- **Do** drop "VISUALS" from the lockup below 90px, and fall back to the "S." icon below 32px.
- **Do** keep at least one dot-diameter of clear space around the mark, with nothing intruding.

### Don't:
- **Don't** use Montserrat 800 anywhere but the logo.
- **Don't** let gold appear twice in one viewport, or use it as a filled panel behind running text.
- **Don't** set Cormorant below 18px, or Poppins body below 15px.
- **Don't** add `box-shadow` — depth is tonal on this ground.
- **Don't** animate the wordmark letter-by-letter, scale it, rotate it, or omit or recolor the dot outside the three approved versions (cream on black, black on gold, brown on cream).
- **Don't** place the logo over a busy image without a dark gradient beneath it.
- **Don't** introduce a second accent color, including a red for errors — error states use Lit Gold.
