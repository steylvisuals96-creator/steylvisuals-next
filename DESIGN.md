---
name: SteylVisuals
description: Matglas-studio. De homepage draagt dezelfde look als Sams eigen Studio-backend, antraciet met één terracotta accent.
colors:
  grond: "#161412"
  grond-diep: "#100F0D"
  paneel: "rgba(255, 248, 240, 0.045)"
  paneel-sterk: "rgba(255, 248, 240, 0.1)"
  glasrand: "rgba(255, 248, 240, 0.09)"
  tekst: "#EFE9E1"
  stil: "rgba(239, 233, 225, 0.62)"
  lijn: "rgba(239, 233, 225, 0.1)"
  terracotta: "#D0764A"
  terracotta-licht: "#E9A07C"
  papier: "#F6F3EE"
  bruin: "#3B1E0B"
  fase-grijs: "#8A8178"
  fase-oker: "#B08A5A"
  fase-groen: "#6F8A6A"
  succes: "#8FB08A"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.6rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  small:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.26em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "14px"
  xl: "18px"
  sidebar: "22px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "#1A0F0A"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "13px 24px"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-licht}"
  button-quiet:
    backgroundColor: "{colors.paneel-sterk}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.paneel}"
    rounded: "{rounded.xl}"
    padding: "28px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.tekst}"
    rounded: "0"
    padding: "10px 0"
---

<!-- 2026-11-09: de hele site volgt de Studio-look (~/steylvisuals-studio, app/globals.css). Elke pagina zit in de
gedeelde schil components/studio/Schil.tsx (zijbalk, gsm-balken, gloed, voet). Oudere onderdelen (webdesign,
portfolio, vastgoedvideo) gebruiken nog de oude variabelen (--black, --gold, --cream ...); binnen de schil zet de
klasse .studio-thema in app/globals.css die om naar de Studio-kleuren. Enkel /demo/som-vastgoed houdt zijn eigen
klantstijl, en /admin is niet herzien. -->

# Design System: SteylVisuals

## Overview

**Creative North Star: "Kijk mee in mijn studio"**

De site ziet eruit als de tool waarmee Sam zelf werkt: een antraciet ruimte achter matglas, met panelen die licht vangen onder de muis en één warm accent. Het is geen metafoor voor wat hij maakt maar een stuk ervan. Wie scrolt, ziet echte schermen: een montagetijdlijn, klantsites die in hun venster bewegen, de Studio met voorbeeldgegevens en een contentkalender.

**Kenmerken:**
- Antraciet (`#161412`) met een trage, vervaagde gloed erachter (terracotta en warm grijs, 38 s heen en terug)
- Doorschijnende panelen: wit op 4,5 %, rand op 9 %, `backdrop-filter: blur(22px)`
- Terracotta is het enige accent: het woord dat telt in een kop, de primaire knop, de actieve menulijn
- Zachte hoeken (14 tot 22 px) en een zachte schaduw onder panelen; dit is matglas, geen vlak ontwerp
- Koppen in Bricolage Grotesque 700, tekst in DM Sans 400

## Colors

- **Terracotta** (`#D0764A`): het ene benadrukte woord in een kop (`em`, niet cursief), de primaire knop met donkere tekst, de actieve lijn in het menu. Licht (`#E9A07C`) voor hover en kleine terracotta tekst.
- **Grond** (`#161412`): de ondergrond. Panelen zijn nooit een vaste kleur, altijd wit met lage dekking erover.
- **Tekst** (`#EFE9E1`) en **stil** (tekst op 62 %): alle tekst. Geen grijs.
- **Fasekleuren** (grijs `#8A8178`, oker `#B08A5A`, terracotta, groen `#6F8A6A`): alleen in de klantreis- en pijplijnbalk, zoals in de Studio.
- **Papier** (`#F6F3EE`) met bruine tekst: alleen voor facturen en offertes, zoals ze geprint worden.

**Regel:** één terracotta woord per kop. Staat er een terracotta knop in beeld, dan is dat het tweede en laatste accent.

## Typography

- **Display** (Bricolage 700, `clamp(2.6rem, 5.4vw, 4.6rem)`): de begroeting bovenaan.
- **Headline** (Bricolage 700, `clamp(2rem, 4vw, 3.25rem)`): elke sectiekop, met het benadrukte woord in terracotta.
- **Kicker** (DM Sans 500, 11 px, 0.26em, hoofdletters, in tekstkleur): de sectienaam boven de kop, zoals "PIJPLIJN" in de Studio. Altijd een echt woord.
- **Body** (DM Sans 400, 15 tot 17 px, regelhoogte 1.7).

## Layout

Zoals de Studio: links een vaste zijbalk van matglas (264 px, hoeken 22 px) met groepen en een glijdend actief blok; rechts de inhoud. Onder 1024 px wordt dat een smalle balk bovenaan en een tabbalk onderaan met een terracotta streepje dat meeglijdt.

Elke sectie opent met de Studio-paginakop: kicker, kop, en een rij kerncijfers met een icoon in een glazen rondje. Eén blok staat vast terwijl je scrolt: de Studio-demo.

## Components

- **Paneel:** `paneel`-achtergrond, rand `glasrand`, hoeken 18 px, binnenmarge 28 px, lichtvlek en oplichtende rand onder de muis (alleen bij een fijne aanwijzer).
- **Knop:** terracotta, 8 px hoeken, label in 11 px hoofdletters met 0.26em. Stille knop: `paneel-sterk` met glasrand.
- **Velden:** alleen een onderlijn, zoals in de Studio.
- **Labels en badges:** 6 px hoeken, nooit pilvormig.

## Motion

- Gloed drijft traag (38 s). Panelen krijgen een lichtvlek onder de muis.
- Een sectiekop komt één keer scherp uit een korte waas (0.42 s), zoals een paginawissel in de Studio.
- Scroll stuurt: de afspeelkop van de montagetijdlijn, de klantsites in hun venster en de stappen van de Studio-demo.
- Balken lopen vol vanaf links of onder wanneer ze in beeld komen.
- Onder `prefers-reduced-motion` staat alles stil en is alles meteen zichtbaar.

## Don'ts

- Geen pilvormige knoppen, geen pijltjes achter elke link, geen stip-labels.
- Geen identieke fade op elk element: alleen koppen stellen scherp, de rest heeft een eigen reden om te bewegen.
- Nooit echte gegevens van Sam of zijn klanten in de demo's; alles daar is verzonnen en staat zo gelabeld.
