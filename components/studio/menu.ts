/**
 * Het menu van de hele site, in de groepen van de Studio-zijbalk.
 * `id` is een sectie op de homepage (dan volgt de zijbalk je scroll) of een eigen pagina.
 */

export type MenuLink = { id: string; label: string; kort: string; href: string };
export type MenuGroep = { groep: string; links: MenuLink[] };

export const MENU: MenuGroep[] = [
  { groep: "Welkom", links: [{ id: "start", label: "Start", kort: "Start", href: "/#start" }] },
  {
    groep: "Wat ik maak",
    links: [
      { id: "websites", label: "Websites", kort: "Sites", href: "/#websites" },
      { id: "beeld", label: "Video en foto", kort: "Beeld", href: "/#beeld" },
      { id: "automatisatie", label: "Automatisatie en AI", kort: "AI", href: "/#automatisatie" },
      { id: "social", label: "Social media", kort: "Social", href: "/#social" },
    ],
  },
  {
    groep: "Meer werk",
    links: [
      { id: "portfolio", label: "Portfolio", kort: "Portfolio", href: "/portfolio" },
      { id: "webdesign", label: "Webdesign", kort: "Webdesign", href: "/webdesign" },
      { id: "vastgoed", label: "Vastgoedvideo", kort: "Video", href: "/vastgoed-marketing" },
    ],
  },
  {
    groep: "Samen",
    links: [
      { id: "werkwijze", label: "Werkwijze", kort: "Werkwijze", href: "/#werkwijze" },
      { id: "contact", label: "Contact", kort: "Contact", href: "/#contact" },
    ],
  },
];

/** De secties op de homepage die de zijbalk volgt tijdens het scrollen. */
export const SECTIES = ["start", "websites", "beeld", "automatisatie", "social", "werkwijze", "contact"];

/** Tabbalk op de gsm: op de homepage de secties, op de andere pagina's de pagina's. */
export const TABS_HOME = ["start", "websites", "beeld", "automatisatie", "social"];
export const TABS_PAGINA = ["start", "portfolio", "webdesign", "vastgoed", "contact"];

export const LINKS_VOET = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Webdesign", href: "/webdesign" },
  { label: "Vastgoedvideo", href: "/vastgoed-marketing" },
  { label: "Instagram", href: "https://www.instagram.com/steylvisuals" },
  { label: "Uptime-status", href: "https://stats.uptimerobot.com/aIPn0em2Sd" },
];
