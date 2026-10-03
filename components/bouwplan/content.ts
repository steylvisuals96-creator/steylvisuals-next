/** All homepage copy and the demo data, in one place. */

export const CTA = { label: "Start je project", href: "/website-quiz" };
export const MAIL = "steylvisuals96@gmail.com";

export const ASSEMBLY_STEPS = ["Plan", "Wireframe", "Typografie", "Kleur", "Live"];

export const CLIENTS = [
  {
    id: "specified",
    name: "Specified",
    text: "Engineering consultancy uit Antwerpen. Site en eigen CMS: vacatures plaatsen en aanpassen zonder één regel code.",
    href: "https://specified-website.vercel.app/",
  },
  {
    id: "lamartine",
    name: "La Martine",
    text: "Biologisch wijndomein in Limoux. Een drietalige site met webshop en verblijven, gebouwd rond hun eigen beeld.",
    href: "https://lamartine-wine.vercel.app/nl",
  },
  {
    id: "som",
    name: "SOM Vastgoed",
    text: "Makelaar in Limburg. Het aanbod komt live binnen via een koppeling met Zabun, zonder dubbel werk.",
    href: "/demo/som-vastgoed",
  },
  {
    id: "koppens",
    name: "Koppens Vastgoedmanagement",
    text: "Vastgoedbeheer in Maastricht. Een voorstel dat je niet leest maar doorscrolt, elke dienst een eigen scène.",
    href: "https://koppens-vastgoedmanagement.vercel.app/",
  },
];

/**
 * A sample run of the automation. The panel renders straight from this array
 * and the page marks it as a sample scenario on its face.
 */
export const LEAD = {
  title: "Schattingsaanvraag",
  object: "Villa met tuin, Herent",
  source: "via het formulier op je site",
  steps: [
    { time: "23:14:02", title: "Aanvraag ontvangen", detail: "Naam, adres en vraag staan meteen in je systeem." },
    { time: "23:14:04", title: "Bevestiging verstuurd", detail: "In jouw huisstijl, met een link naar je agenda." },
    { time: "23:14:05", title: "Kaart in je CRM", detail: "Fase nieuw, bron website, toegewezen aan de juiste makelaar." },
    { time: "23:14:05", title: "Opvolging ingepland", detail: "Geen afspraak na twee dagen? Dan gaat er vanzelf een herinnering uit." },
    { time: "07:42", title: "Afspraak in je agenda", detail: "Vrijdag 10:00, plaatsbezoek. Ingepland voor je eerste koffie." },
  ],
};

/** Sample pipeline around the new lead, for the CRM screen. Labelled as a sample on screen. */
export const BOARD = {
  columns: ["Nieuw", "Gecontacteerd", "Plaatsbezoek"],
  cards: [
    { col: 0, title: "Waardebepaling", object: "Appartement, Hasselt", meta: "2 dagen geleden" },
    { col: 1, title: "Verkoop", object: "Rijwoning, Genk", meta: "Gebeld, terugbellen di" },
    { col: 1, title: "Waardebepaling", object: "Halfopen, Diepenbeek", meta: "Mail beantwoord" },
    { col: 2, title: "Verkoop", object: "Penthouse, Leuven", meta: "Ma 14:00" },
  ],
};

export const INDEX = [
  { label: "Webdesign", href: "/webdesign" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Vastgoedvideo & content", href: "/vastgoed-marketing" },
  { label: "Instagram", href: "https://www.instagram.com/steylvisuals" },
  { label: "Uptime-status", href: "https://stats.uptimerobot.com/aIPn0em2Sd" },
];
