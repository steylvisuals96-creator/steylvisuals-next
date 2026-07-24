# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Belgian KMOs — owner-operators and zaakvoerders of small and mid-size companies who need to show up well online but have no marketing function in-house. They are not media buyers or brand managers; they are running the business, and content is the thing that keeps sliding to next week. They arrive already convinced that video and a decent website matter, and stuck on who to trust with both. The job is to hand the whole visual side of the company to one person and stop thinking about it.

Real estate agents are the strongest proven vertical so far, not the target audience. The site as currently built speaks almost entirely to makelaars — a dedicated `/vastgoed-marketing` route, real-estate testimonials, a property-shaped portfolio. Whether vastgoed stays a named niche inside a broader KMO positioning, or gets folded into general case work, is an open decision that future surface work must resolve rather than assume.

## Product Purpose

SteylVisuals is a one-person creative studio in Belgium that produces premium video and content and builds the websites that content lives on. It exists so a KMO can get both halves of its visual presence from a single maker, at agency-level craft, without agency overhead or coordination between vendors.

Success is recurring client relationships rather than one-off projects: the monthly content packages are the commercial core, with website work as the higher-ticket companion engagement.

## Positioning

Video én website in één hand. Competing videographers hand off to a web agency, and web agencies subcontract the filming — SteylVisuals is one person who does both, so the content and the site it sits on are designed together instead of stitched together. No neighboring studio can truthfully claim this without either hiring or subcontracting.

## Operating Context

The commercial model is monthly retainers, not project quotes. Three published tiers: Edit Only (€290 — client films, SteylVisuals edits, 4 videos/month), Starter (€490 — half-day shoot, 6 videos/month, the featured tier), and Groei (€890 — full day, 10+ videos/month, drone, strategy). Every tier promises delivery within one week.

Entry to the funnel is low-commitment and proof-first: a free demo edit, and a website quiz (`/website-quiz`) that captures leads via a contact route into Resend. The site carries two service-specific landing routes (`/vastgoed-marketing`, `/webdesign`) plus a portfolio, feeding a shared contact flow.

Everything is Dutch, for a Belgian market (`nl_BE`). Prospects usually arrive from Instagram or word of mouth, on a phone, evaluating whether this person is a safe pair of hands.

## Capabilities and Constraints

Built on Next.js 16 with the app router, React 19, Tailwind 4 and Framer Motion, deployed as a mostly static marketing site. Content for some sections is editable through a Netlify Identity–gated admin at `/admin`, with project entries as markdown in `content/projects/`. A Sanity client and a Cloudflare upload worker are present in the dependency tree; how much of the content pipeline actually routes through them is not settled.

Lead capture runs through `app/api/quiz-contact/route.ts` into Resend. Deployment configuration is currently ambiguous — a `netlify.toml`, a `.wrangler` directory and a static `out/` build all coexist, so the canonical host is an open question rather than a recorded fact.

Explicitly undecided: whether vastgoed remains a named vertical; the canonical deployment target; and whether any accessibility standard is being held to (none has been established, so future work should not claim a WCAG level).

## Brand Commitments

The name is SteylVisuals; the studio is Sam Steylaerts, and the personal, single-maker nature of it is part of the offer rather than something to hide behind a plural "wij". All copy is Dutch, addressing the reader informally (je/jij), aimed at a Belgian audience.

A visual system already exists in the codebase and is treated here as incumbent implementation, not as an approved design authority — it has never been documented or deliberately chosen, and no visual direction was confirmed during this interview.

## Evidence on Hand

**There is currently no real proof.** This is the most important fact in this file.

- The three testimonials in `components/Testimonials.tsx` — Sofie Van den Berg (Immo Leuven), Thomas Declercq (ERA Mechelen), Lieselotte Pieters (Century 21 Gent) — are invented placeholders. They name real agencies alongside fabricated people and results.
- The three portfolio entries in `content/projects/` (villa-herent, appartement-sint-truiden, penthouse-leuven) are placeholders.
- The claimed outcomes ("drie extra viewings binnen twee weken") are not measured results.

Future work must not treat any of this as citable proof, must not extend it with further invented names, quotes, logos or metrics, and should assume these need replacing with real client evidence or an honest proof strategy that works without testimonials.

One genuine artifact does exist: `/demo/som-vastgoed` is a working demo site built for SOM Vastgoed. Whether it can be presented as a signed client case is unconfirmed.

## Product Principles

**Eén aanspreekpunt.** Every decision should reinforce that one person owns the whole visual output. Anything that makes the studio read as a faceless agency works against the only claim a competitor can't copy.

**Bewijs vóór belofte.** The funnel is built on showing work first — the free demo edit, the reel, the portfolio. Superlatives are a substitute for proof, and this product currently has no proof to spare.

**Toon, vertel niet.** A studio selling visual craft is judged on its own surfaces before a word is read. The site is the portfolio piece.

**Terugkerend, niet eenmalig.** The commercial model is monthly. Work should pull toward an ongoing relationship, not a single transaction.

**Eerlijk over schaal.** Being one person in Belgium is not a weakness to paper over with fabricated social proof — it is the reason the work is coherent.
