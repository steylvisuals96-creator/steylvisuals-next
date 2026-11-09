/**
 * Alle tekst en alle voorbeeldgegevens van de homepage op één plek.
 *
 * Alles in STUDIO, SOCIAL en het montagescherm is verzonnen: de bedrijven,
 * namen, bedragen en mails bestaan niet. Sams echte gegevens komen hier nooit in.
 */

export const MAIL = "steylvisuals96@gmail.com";

/* ---------------------------------------------------------------- Start */

export const OVERZICHT = [
  { id: "beeld", titel: "Video en foto", tekst: "Filmen, monteren, fotograferen. Met drone waar het iets toevoegt.", beeld: "/start/camera.jpg" },
  { id: "websites", titel: "Websites", tekst: "Op maat ontworpen en gebouwd, met een eigen beheer erachter.", beeld: "/home/sites/specified-f0.jpg" },
  { id: "automatisatie", titel: "Automatisatie en AI", tekst: "Systemen die je opvolging, mails en administratie overnemen.", beeld: null },
  { id: "social", titel: "Social media", tekst: "Strategie, planning, posten en advertenties. Elke week.", beeld: "/start/latte.jpg" },
] as const;

/* ---------------------------------------------------------------- Video en foto */

/** Clips op de tijdlijn van het montagescherm. `w` is de lengte in seconden. */
export const CLIPS = [
  { naam: "Opening", plek: "Achter de schermen", beeld: "/start/klapper.jpg", w: 4, kleur: "#7a5a46" },
  { naam: "Luchtbeeld", plek: "Drone, 60 m", beeld: "/start/drone.jpg", w: 6, kleur: "#4f6a4a" },
  { naam: "Woonkamer", plek: "Interieur, Leuven", beeld: "/start/interieur.jpg", w: 5, kleur: "#8a8178" },
  { naam: "De zaak", plek: "Koffiebar, Herent", beeld: "/start/barista.jpg", w: 4, kleur: "#6b4a36" },
  { naam: "Het atelier", plek: "Bloemist, Wilsele", beeld: "/start/bloemist.jpg", w: 5, kleur: "#4c5a4e" },
  { naam: "Slot", plek: "Camera op locatie", beeld: "/start/camera.jpg", w: 4, kleur: "#55504b" },
];

export const FOTOS = [
  { beeld: "/start/interieur.jpg", titel: "Vastgoed", tekst: "Interieur en exterieur, klaar voor elk portaal.", vorm: "breed" },
  { beeld: "/start/product.jpg", titel: "Product", tekst: "Rustig licht, echte materialen.", vorm: "hoog" },
  { beeld: "/start/drone.jpg", titel: "Drone", tekst: "Ligging en omgeving in één beeld.", vorm: "" },
  { beeld: "/start/set.jpg", titel: "Achter de schermen", tekst: "Licht, geluid en een plan per draaidag.", vorm: "breed" },
  { beeld: "/start/portret.jpg", titel: "Portret", tekst: "De mensen achter je zaak.", vorm: "" },
] as const;

/* ---------------------------------------------------------------- Websites */

export type Site = { id: string; naam: string; tekst: string; href: string; domein: string; lang?: string; frames?: string[]; still: string };

export const SITES: Site[] = [
  {
    id: "specified",
    naam: "Specified",
    tekst: "Engineering consultancy uit Antwerpen. Site en eigen CMS: vacatures plaatsen en aanpassen zonder één regel code.",
    href: "https://specified-website.vercel.app/",
    domein: "specified-website.vercel.app",
    still: "/home/sites/specified-f0.jpg",
    frames: ["/home/sites/specified-f0.jpg", "/home/sites/specified-f1.jpg", "/home/sites/specified-f2.jpg", "/home/sites/specified-f3.jpg", "/home/sites/specified-f4.jpg", "/home/sites/specified-f5.jpg"],
  },
  {
    id: "lamartine",
    naam: "La Martine",
    tekst: "Biologisch wijndomein in Limoux. Drietalig, met webshop en verblijven, gebouwd rond hun eigen beeld.",
    href: "https://lamartine-wine.vercel.app/nl",
    domein: "lamartine-wine.vercel.app",
    still: "/home/sites/lamartine.jpg",
    lang: "/home/sites/lamartine-tall.jpg",
  },
  {
    id: "som",
    naam: "SOM Vastgoed",
    tekst: "Makelaar in Limburg. Het aanbod komt live binnen via een koppeling met Zabun, zonder dubbel werk.",
    href: "/demo/som-vastgoed",
    domein: "som-vastgoed.vercel.app",
    still: "/home/sites/som.jpg",
    lang: "/home/sites/som-tall.jpg",
  },
  {
    id: "koppens",
    naam: "Koppens Vastgoedmanagement",
    tekst: "Vastgoedbeheer in Maastricht. Een voorstel dat je niet leest maar doorscrolt, elke dienst een eigen scène.",
    href: "https://koppens-vastgoedmanagement.vercel.app/",
    domein: "koppens-vastgoedmanagement.vercel.app",
    still: "/home/sites/koppens.jpg",
    frames: ["/home/sites/koppens-f0.jpg", "/home/sites/koppens-f1.jpg", "/home/sites/koppens-f2.jpg", "/home/sites/koppens-f3.jpg", "/home/sites/koppens-f4.jpg", "/home/sites/koppens-f5.jpg"],
  },
];

/* ---------------------------------------------------------------- Automatisatie: de Studio-demo */

/** De stappen van het vastgezette blok. Elke stap toont een ander scherm in het demovenster. */
export const STAPPEN = [
  { scherm: "start", nav: "Start", titel: "Elke ochtend je dag in één blik", tekst: "Om 7 uur staat je briefing klaar: afspraken, wat er wacht, wie je moet terugbellen. Zonder dat je iets opent." },
  { scherm: "pijplijn", nav: "Pijplijn", titel: "23:14. Een aanvraag via je site", tekst: "Je kantoor is dicht, je systeem niet. De aanvraag staat meteen als kaart in je pijplijn, met bron en contactgegevens." },
  { scherm: "mail", nav: "Mail", titel: "Je antwoord staat al klaar", tekst: "De assistent leest de aanvraag en schrijft een antwoord in jouw toon. Jij leest het na en klikt op versturen. Er gaat nooit iets weg zonder jou." },
  { scherm: "assistent", nav: "Assistent", titel: "Vraag het gewoon", tekst: "Wie moet ik deze week opvolgen? Hoeveel heb ik dit kwartaal gefactureerd? De assistent kent je klanten, je cijfers en je agenda." },
  { scherm: "factuur", nav: "Facturen", titel: "Offerte en factuur in twee klikken", tekst: "In je eigen huisstijl, met de juiste vermeldingen, en klaar om te printen of te mailen. Betaald? Dan schuift de kaart vanzelf door." },
  { scherm: "omzet", nav: "Omzet", titel: "Je cijfers, en je sites, bewaakt", tekst: "Omzet per maand, terugkerende inkomsten, de btw-drempel. En ligt een site eruit, dan weet je het voor je klant het merkt." },
] as const;

export type Scherm = (typeof STAPPEN)[number]["scherm"];

export const DEMO = {
  naam: "Sam",
  kerncijfers: [
    { label: "Afspraken vandaag", waarde: "3", icoon: "agenda" },
    { label: "Mails die wachten", waarde: "2", icoon: "mail" },
    { label: "Open offertes", waarde: "€ 6.450", icoon: "document" },
    { label: "Deze maand", waarde: "€ 2.640", icoon: "stijging" },
  ],
  agenda: [
    { tijd: "09:30", wat: "Kennismaking", wie: "Bakkerij De Linde" },
    { tijd: "13:00", wat: "Draaidag, interieur", wie: "Fysio Wilsele" },
    { tijd: "16:30", wat: "Oplevering site", wie: "Garage Peeters" },
  ],
  briefing: [
    "Els van Fysio Wilsele wacht sinds gisteren op een antwoord over de draaidag.",
    "De offerte voor Brasserie Ter Vesten loopt vrijdag af. Even bellen?",
    "Alle zes de sites staan online. Snelste laadtijd: 0,6 s.",
  ],
  kolommen: ["Nieuw", "Gesprek", "Voorstel", "Akkoord"],
  kaarten: [
    { kol: 0, naam: "Tuinen Wouters", wie: "Pieter Wouters", wat: "Website + drone", bedrag: "" },
    { kol: 1, naam: "Kapsalon Lina", wie: "Lina Aerts", wat: "Social media", bedrag: "€ 450 / m" },
    { kol: 2, naam: "Brasserie Ter Vesten", wie: "Tom Claes", wat: "Website", bedrag: "€ 3.500" },
    { kol: 2, naam: "Fysio Wilsele", wie: "Els Vermeulen", wat: "Video, 6 reels", bedrag: "€ 890" },
    { kol: 3, naam: "Garage Peeters", wie: "Ann Peeters", wat: "Website + CRM", bedrag: "€ 4.200" },
  ],
  nieuw: { naam: "Bakkerij De Linde", wie: "Jan Devos", wat: "Website + fotografie", bron: "Formulier op je site", tijd: "23:14" },
  mail: {
    van: "Jan Devos",
    onderwerp: "Nieuwe site voor onze bakkerij",
    tekst: "Hallo, we openen in maart een tweede winkel in Kessel-Lo en willen een site waar klanten taarten kunnen bestellen. Ook foto's van onze producten. Kan je eens langskomen?",
    antwoord: [
      "Dag Jan,",
      "Proficiat met de tweede winkel! Een site waar klanten rechtstreeks taarten bestellen, met foto's die je producten eer aandoen: dat doe ik graag.",
      "Zal ik donderdag om 10 uur even langskomen in de winkel? Dan bekijken we samen wat je nodig hebt.",
      "Tot dan,\nSam",
    ],
  },
  chat: [
    { wie: "jij", tekst: "Wie moet ik deze week nog opvolgen?" },
    {
      wie: "ai",
      tekst: "Drie mensen. Els (Fysio Wilsele) wacht op een datum voor de draaidag. Tom (Brasserie Ter Vesten) heeft de offerte nog niet getekend, die loopt vrijdag af. En Jan (Bakkerij De Linde) is nieuw, je afspraak staat donderdag.",
    },
    { wie: "jij", tekst: "Plan een herinnering voor Tom op woensdag." },
    { wie: "ai", tekst: "Staat erin: woensdag 9:00, Tom Claes bellen over de offerte. Ik zet een conceptmail klaar voor als hij niet opneemt." },
  ],
  factuur: {
    nummer: "2026-047",
    klant: "Garage Peeters",
    adres: "Tiensesteenweg 120, 3010 Kessel-Lo",
    lijnen: [
      { wat: "Website op maat, opbouw (deel 2 van 3)", bedrag: 1000 },
      { wat: "Productfotografie, halve dag", bedrag: 450 },
      { wat: "Hosting, bewaking en onderhoud, november", bedrag: 150 },
    ],
  },
  omzet: [1.2, 1.5, 1.4, 1.8, 1.7, 2.0, 2.2, 1.9, 2.4, 2.5, 2.6],
  maanden: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov"],
  sites: [
    { naam: "garagepeeters.be", ms: "0,6 s", score: 99 },
    { naam: "tervesten.be", ms: "0,8 s", score: 97 },
    { naam: "fysiowilsele.be", ms: "0,7 s", score: 98 },
  ],
};

/** Alle functies van de Studio, in dezelfde groepen als het menu. */
export const FUNCTIES = [
  {
    groep: "Vandaag",
    items: [
      { icoon: "zon", titel: "Dagbriefing", tekst: "Elke ochtend om 7 uur: wat er vandaag telt." },
      { icoon: "agenda", titel: "Agenda", tekst: "Gekoppeld aan je Google-agenda." },
      { icoon: "vink", titel: "Taken en projecten", tekst: "Wat moet er gebeuren, en voor wie." },
      { icoon: "mail", titel: "Mailopvolging", tekst: "Ziet wat blijft liggen en schrijft een antwoord voor." },
      { icoon: "micro", titel: "Spraakmemo's", tekst: "Inspreken op je gsm, de Studio zet het om." },
      { icoon: "chat", titel: "AI-assistent", tekst: "Kent je klanten, cijfers en agenda." },
      { icoon: "week", titel: "Weekoverzicht", tekst: "Zondagavond: wat lukte, wat schuift door." },
    ],
  },
  {
    groep: "Zaak",
    items: [
      { icoon: "pijplijn", titel: "Pijplijn", tekst: "Van eerste contact tot akkoord." },
      { icoon: "mensen", titel: "Klantdossiers", tekst: "Mails, bestanden, notities en offertes per klant." },
      { icoon: "document", titel: "Offertes", tekst: "Concept uit je eigen prijzen en tekst." },
      { icoon: "euro", titel: "Facturen", tekst: "Printklaar, met de juiste vermeldingen." },
      { icoon: "bon", titel: "Uitgaven en bonnetjes", tekst: "Bonnetjes uit je mailbox, netjes gesorteerd." },
      { icoon: "stijging", titel: "Omzet en btw-drempel", tekst: "Alarm voor je de grens bereikt." },
      { icoon: "herhaal", titel: "Maandelijkse inkomsten", tekst: "Je vaste inkomsten per maand, naar je doel." },
      { icoon: "klok", titel: "Tijdregistratie", tekst: "Hoeveel uur zat er echt in een project?" },
      { icoon: "schild", titel: "Sitebewaker", tekst: "Bewaakt elke site en meldt het als er een plat ligt." },
      { icoon: "radar", titel: "Prospectradar", tekst: "Bedrijven met een trage of verouderde site." },
      { icoon: "formulier", titel: "Intakeformulier", tekst: "Een eigen link voor elke nieuwe klant." },
    ],
  },
  {
    groep: "Jij",
    items: [
      { icoon: "brein", titel: "Brein", tekst: "Wat de AI over je zaak moet weten, op één plek." },
      { icoon: "lamp", titel: "Ideeën", tekst: "Bewaren in een zin, terugvinden wanneer je wil." },
      { icoon: "spark", titel: "AI-agents", tekst: "Zie wat je AI-helpers voor je aan het doen zijn." },
      { icoon: "huis", titel: "Gezinsplan en budget", tekst: "Doelen, spaarpotten en het maandbudget, samen." },
      { icoon: "kar", titel: "Boodschappen", tekst: "Gedeelde lijst met de promoties van deze week." },
      { icoon: "gsm", titel: "Als app op je gsm", tekst: "Op je beginscherm, zonder app store." },
    ],
  },
] as const;

/* ---------------------------------------------------------------- Social media */

export const SOCIAL = {
  dagen: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
  posts: [
    { dag: 0, uur: "08:00", kanaal: "Instagram", beeld: "/start/latte.jpg", titel: "Ochtendroutine", status: "Live" },
    { dag: 1, uur: "12:30", kanaal: "Facebook", beeld: "/start/gerecht.jpg", titel: "Nieuw op de kaart", status: "Live" },
    { dag: 2, uur: "18:00", kanaal: "Instagram", beeld: "/start/draaischijf.jpg", titel: "Achter de schermen", status: "Gepland" },
    { dag: 3, uur: "09:00", kanaal: "LinkedIn", beeld: "/start/woonkamer.jpg", titel: "Project opgeleverd", status: "Gepland" },
    { dag: 4, uur: "17:00", kanaal: "TikTok", beeld: "/start/restaurant.jpg", titel: "Vrijdagavond", status: "Ter goedkeuring" },
    { dag: 5, uur: "10:00", kanaal: "Instagram", beeld: "/start/bloem.jpg", titel: "Seizoensboeket", status: "Ter goedkeuring" },
  ],
  bereik: [42, 55, 48, 61, 70, 66, 83, 90],
  cijfers: [
    { label: "Bereik deze maand", waarde: "18.400" },
    { label: "Nieuwe volgers", waarde: "+312" },
    { label: "Klikken naar je site", waarde: "148" },
    { label: "Kost per klik", waarde: "€ 0,42" },
  ],
};

/* ---------------------------------------------------------------- Werkwijze */

export const WERKWIJZE = [
  { titel: "Kennismaken", tekst: "Bij jou op de zaak of online. We kijken wat je nodig hebt, en wat niet.", kleur: "#8a8178" },
  { titel: "Voorstel", tekst: "Binnen een werkdag een voorstel op maat, met een duidelijke prijs vooraf.", kleur: "#b08a5a" },
  { titel: "Maken", tekst: "Je ziet alles tussendoor. Geen verrassingen bij de oplevering.", kleur: "#d0764a" },
  { titel: "Online en bewaakt", tekst: "Na de lancering blijf ik erbij: beheer, aanpassingen en bewaking.", kleur: "#6f8a6a" },
];

export const BELOFTES = [
  { icoon: "gsm", titel: "Eén gsm-nummer", tekst: "Je belt of appt mij rechtstreeks. Geen helpdesk, geen accountmanager." },
  { icoon: "klok", titel: "Antwoord binnen een werkdag", tekst: "Ook als het antwoord is: ik zoek het even uit." },
  { icoon: "schild", titel: "Ik weet het eerst", tekst: "Ligt je site eruit, dan weet ik het voor jij het merkt, en los ik het op." },
];
