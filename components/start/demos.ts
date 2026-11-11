import { DEMO, type Stijl } from "./data";

/**
 * De inhoud van de Studio-demo per stijl. Elke stijl doorloopt dezelfde zes schermen
 * (start, pijplijn, mail, assistent, factuur, omzet), maar met de inhoud van die sector.
 * Vastgoed en Recruitment zijn geïnspireerd op echte projecten; alle namen, panden,
 * kandidaten en bedragen zijn verzonnen.
 */

type Kerncijfer = { label: string; waarde: string; icoon: string };
type Kaart = { kol: number; naam: string; wie: string; wat: string; bedrag: string };

export type Demo = {
  naam: string;
  /** Tekst links naast het venster, één per scherm. `nav` is het menu-item dat oplicht. */
  stappen: { nav: string; titel: string; tekst: string }[];
  menu: { groep: string; items: string[] }[];
  start: {
    status: string;
    kerncijfers: Kerncijfer[];
    agenda: { tijd: string; wat: string; wie: string }[];
    briefing: string[];
  };
  pijplijn: {
    kicker: string;
    titel: string;
    kolommen: string[];
    kaarten: Kaart[];
    nieuw: { naam: string; wie: string; wat: string; bron: string; tijd: string };
    melding: string;
  };
  mail: { van: string; tijd: string; onderwerp: string; tekst: string; antwoord: string[] };
  chat: { items: { wie: "jij" | "ai"; tekst: string }[]; invoer: string };
  factuur: {
    kicker: string;
    titel: string;
    datum: string;
    klant: string;
    adres: string;
    lijnen: { wat: string; bedrag: number }[];
    totaal: string;
    voet: string;
    status: string[];
    open: { titel: string; waarde: number; sub: string };
  };
  omzet: {
    kicker: string;
    titel: string;
    accent: string;
    grafiek: string;
    totaal: string;
    waarden: number[];
    lijst: string;
    items: { naam: string; sub: string; score: number; eenheid?: string }[];
    drempel: { label: string; w: number; tekst: string };
  };
};

const MAANDEN = DEMO.maanden as readonly string[];
export { MAANDEN };

const studio: Demo = {
  naam: DEMO.naam,
  stappen: [
    { nav: "Start", titel: "Elke ochtend je dag in één blik", tekst: "Om 7 uur staat je briefing klaar: afspraken, wat er wacht, wie je moet terugbellen. Zonder dat je iets opent." },
    { nav: "Pijplijn", titel: "23:14. Een aanvraag via je site", tekst: "Je kantoor is dicht, je systeem niet. De aanvraag staat meteen als kaart in je pijplijn, met bron en contactgegevens." },
    { nav: "Mail", titel: "Je antwoord staat al klaar", tekst: "De assistent leest de aanvraag en schrijft een antwoord in jouw toon. Jij leest het na en klikt op versturen. Er gaat nooit iets weg zonder jou." },
    { nav: "Assistent", titel: "Vraag het gewoon", tekst: "Wie moet ik deze week opvolgen? Hoeveel heb ik dit kwartaal gefactureerd? De assistent kent je klanten, je cijfers en je agenda." },
    { nav: "Facturen", titel: "Offerte en factuur in twee klikken", tekst: "In je eigen huisstijl, met de juiste vermeldingen, en klaar om te printen of te mailen. Betaald? Dan schuift de kaart vanzelf door." },
    { nav: "Omzet", titel: "Je cijfers, en je sites, bewaakt", tekst: "Omzet per maand, terugkerende inkomsten, de btw-drempel. En ligt een site eruit, dan weet je het voor je klant het merkt." },
  ],
  menu: [
    { groep: "Vandaag", items: ["Start", "Agenda", "Mail", "Assistent"] },
    { groep: "Zaak", items: ["Pijplijn", "Klanten", "Facturen", "Omzet", "Sites"] },
  ],
  start: {
    status: "3 afspraken vandaag, 2 mails die op je wachten en 1 offerte die vrijdag afloopt.",
    kerncijfers: DEMO.kerncijfers.map((k) => ({ ...k })),
    agenda: DEMO.agenda.map((a) => ({ ...a })),
    briefing: [...DEMO.briefing],
  },
  pijplijn: {
    kicker: "Pijplijn",
    titel: "Van eerste contact tot akkoord",
    kolommen: [...DEMO.kolommen],
    kaarten: DEMO.kaarten.map((k) => ({ ...k })),
    nieuw: { ...DEMO.nieuw },
    melding: "Nieuwe aanvraag · 23:14",
  },
  mail: { ...DEMO.mail, tijd: "gisteren 23:14", antwoord: [...DEMO.mail.antwoord] },
  chat: { items: DEMO.chat.map((c) => ({ ...c })) as Demo["chat"]["items"], invoer: "Stel een vraag over je zaak" },
  factuur: {
    kicker: "Facturen",
    titel: `Factuur ${DEMO.factuur.nummer}`,
    datum: "10 maart 2026",
    klant: DEMO.factuur.klant,
    adres: DEMO.factuur.adres,
    lijnen: DEMO.factuur.lijnen.map((l) => ({ ...l })),
    totaal: "Totaal",
    voet: "Te betalen binnen 14 dagen. Bijzondere vrijstellingsregeling kleine ondernemingen.",
    status: ["Opgemaakt, 10/03", "Gemaild naar Ann Peeters", "Betaald, 12/03"],
    open: { titel: "Open bij klanten", waarde: 2350, sub: "2 facturen, geen enkele te laat" },
  },
  omzet: {
    kicker: "Omzet",
    titel: "Dit jaar ",
    accent: "tot nu toe",
    grafiek: "Omzet per maand",
    totaal: "€ 21.200 in 2026",
    waarden: [...DEMO.omzet],
    lijst: "Sitebewaker",
    items: DEMO.sites.map((s) => ({ naam: s.naam, sub: `Online · ${s.ms}`, score: s.score })),
    drempel: { label: "Btw-drempel", w: 0.85, tekst: "Nog € 3.800,00 onder de grens van € 25.000,00" },
  },
};

const vastgoed: Demo = {
  naam: "Lien",
  stappen: [
    { nav: "Start", titel: "Elke ochtend je panden in één blik", tekst: "Om 7 uur staat je briefing klaar: nieuwe meldingen, plaatsbezoeken en wie op een antwoord wacht. Zonder dat je iets opent." },
    { nav: "Meldingen", titel: "23:14. Een lek in Residentie Zuid", tekst: "Een huurder meldt een storing via het formulier op je site, met foto's. De melding staat meteen op het bord, met pand, unit en referentie." },
    { nav: "Mail", titel: "Je antwoord aan de huurder staat klaar", tekst: "De assistent stelt de huurder gerust en zegt wat er nu gebeurt, in de toon van je kantoor. Jij leest het na en verstuurt." },
    { nav: "Assistent", titel: "Vraag het gewoon", tekst: "Welke meldingen staan langer dan een week open? Wanneer loopt een huurcontract af? De assistent kent je panden, huurders en eigenaars." },
    { nav: "Afrekeningen", titel: "De afrekening voor de eigenaar, in twee klikken", tekst: "Huur, kosten en beheervergoeding per pand, in je eigen huisstijl. De eigenaar ziet ze meteen in zijn eigen portaal." },
    { nav: "Overzicht", titel: "Je portefeuille, bewaakt", tekst: "Huur per maand, bezetting per pand en de contracten die aflopen. Loopt er iets mis, dan zie je het voor de eigenaar belt." },
  ],
  menu: [
    { groep: "Vandaag", items: ["Start", "Agenda", "Mail", "Assistent"] },
    { groep: "Beheer", items: ["Meldingen", "Panden", "Eigenaars", "Afrekeningen", "Overzicht"] },
  ],
  start: {
    status: "7 open meldingen, 3 plaatsbezoeken vandaag en 1 huurcontract dat binnen twee maanden afloopt.",
    kerncijfers: [
      { label: "Open meldingen", waarde: "7", icoon: "schild" },
      { label: "Plaatsbezoeken vandaag", waarde: "3", icoon: "agenda" },
      { label: "Panden in beheer", waarde: "48", icoon: "huis" },
      { label: "Huur ontvangen, maart", waarde: "98%", icoon: "euro" },
    ],
    agenda: [
      { tijd: "09:00", wat: "Plaatsbezoek, lekkage", wie: "Residentie Zuid, 2.1" },
      { tijd: "11:30", wat: "Intrede nieuwe huurder", wie: "Brouwersstraat 14, unit 2" },
      { tijd: "15:00", wat: "Overleg eigenaar", wie: "Familie Maes" },
    ],
    briefing: [
      "De lift in Residentie Zuid is gisteren hersteld. De bevestiging van de liftfirma is binnen.",
      "Het huurcontract van Brouwersstraat 14, unit 3 loopt eind mei af. De eigenaar is nog niet gecontacteerd.",
      "Twee huurders zijn deze maand te laat met betalen. De herinnering staat klaar.",
    ],
  },
  pijplijn: {
    kicker: "Meldingen",
    titel: "Van melding tot opgelost",
    kolommen: ["Nieuw", "Ingepland", "Bij vakman", "Opgelost"],
    kaarten: [
      { kol: 0, naam: "Verwarming valt uit", wie: "Kouterlaan 8, unit 2", wat: "Ref. HS-2026-0141", bedrag: "" },
      { kol: 1, naam: "Deurbel defect", wie: "Brouwersstraat 14, unit 3", wat: "Bezoek do 10:00", bedrag: "" },
      { kol: 2, naam: "Vochtvlek plafond", wie: "Residentie Zuid, 1.4", wat: "Dakwerker", bedrag: "€ 640" },
      { kol: 2, naam: "Rolluik klemt", wie: "Kouterlaan 8, unit 5", wat: "Schrijnwerker", bedrag: "€ 180" },
      { kol: 3, naam: "Lift buiten dienst", wie: "Residentie Zuid", wat: "Liftfirma", bedrag: "€ 1.250" },
    ],
    nieuw: { naam: "Lekkage badkamer", wie: "Residentie Zuid, 2.1", wat: "Water onder het bad, 3 foto's", bron: "Meldingsformulier", tijd: "23:14" },
    melding: "Nieuwe melding · 23:14",
  },
  mail: {
    van: "Sofie Willems",
    tijd: "gisteren 23:16",
    onderwerp: "Lekkage in de badkamer",
    tekst: "Goeienavond, er staat water onder ons bad en bij de buren beneden komt een vochtvlek op het plafond. Ik heb foto's toegevoegd. Kan er snel iemand komen kijken?",
    antwoord: [
      "Dag Sofie,",
      "Bedankt voor je melding en de foto's. De loodgieter komt morgen tussen 8 en 10 uur langs.",
      "Draai de kraan van het bad voorlopig dicht. De buren op 1.1 brengen wij zelf op de hoogte.",
      "Met vriendelijke groet,\nLien, Hofstede Beheer",
    ],
  },
  chat: {
    items: [
      { wie: "jij", tekst: "Welke meldingen staan langer dan een week open?" },
      { wie: "ai", tekst: "Twee. Het rolluik in Kouterlaan 8, unit 5 wacht al 12 dagen op de schrijnwerker. De vochtvlek in Residentie Zuid 1.4 staat 9 dagen open; de dakwerker komt pas volgende week." },
      { wie: "jij", tekst: "Stuur de schrijnwerker een herinnering." },
      { wie: "ai", tekst: "Verstuurd, met de foto's en het adres erbij. Ik laat je weten zodra hij een datum bevestigt." },
    ],
    invoer: "Stel een vraag over je panden",
  },
  factuur: {
    kicker: "Afrekeningen",
    titel: "Afrekening maart",
    datum: "31 maart 2026",
    klant: "Familie Maes",
    adres: "Eigenaar, Brouwersstraat 14, 2800 Mechelen",
    lijnen: [
      { wat: "Huur units 1 tot 4, maart", bedrag: 3480 },
      { wat: "Herstelling deurbel, unit 3", bedrag: -95 },
      { wat: "Beheervergoeding, 6%", bedrag: -209 },
    ],
    totaal: "Uit te betalen",
    voet: "Overgeschreven binnen 5 werkdagen. Alle details staan in je eigenaarsportaal.",
    status: ["Opgemaakt, 31/03", "Zichtbaar in het eigenaarsportaal", "Overgeschreven, 02/04"],
    open: { titel: "Achterstallige huur", waarde: 1340, sub: "2 huurders, herinnering verstuurd" },
  },
  omzet: {
    kicker: "Overzicht",
    titel: "Je portefeuille ",
    accent: "vandaag",
    grafiek: "Huur ontvangen per maand",
    totaal: "€ 318.400 in 2026",
    waarden: [2.8, 2.8, 2.9, 2.9, 2.9, 3.0, 2.9, 3.0, 3.0, 3.1, 3.1],
    lijst: "Bezetting per pand",
    items: [
      { naam: "Residentie Zuid", sub: "24 units · 1 leeg", score: 96, eenheid: "%" },
      { naam: "Kouterlaan 8", sub: "6 units · volzet", score: 100, eenheid: "%" },
      { naam: "Brouwersstraat 14", sub: "4 units · 1 opzeg", score: 75, eenheid: "%" },
    ],
    drempel: { label: "Contracten die dit jaar aflopen", w: 0.33, tekst: "4 van de 12 zijn al verlengd" },
  },
};

const recruitment: Demo = {
  naam: "Nora",
  stappen: [
    { nav: "Start", titel: "Elke ochtend je kandidaten in één blik", tekst: "Om 7 uur staat je briefing klaar: de gesprekken van vandaag, nieuwe sollicitaties en wie op feedback wacht." },
    { nav: "Pipeline", titel: "23:14. Een sollicitatie via je site", tekst: "Een kandidaat solliciteert op een vacature. Functie, ervaring en beschikbaarheid staan meteen als kaart in je pipeline." },
    { nav: "Mail", titel: "Je antwoord aan de kandidaat staat klaar", tekst: "De assistent leest het cv, bedankt de kandidaat en stelt een eerste gesprek voor, in de toon van je bureau. Jij verstuurt." },
    { nav: "Assistent", titel: "Vraag het gewoon", tekst: "Wie past op de vacature bij Delta Bouw? Wie wacht al een week op feedback? De assistent kent je kandidaten, klanten en vacatures." },
    { nav: "Facturen", titel: "Kandidaat geplaatst, factuur klaar", tekst: "Het honorarium en de afspraken uit de raamovereenkomst staan er meteen op. Jij kijkt na en verstuurt." },
    { nav: "Cijfers", titel: "Je vacatures en je doel, bewaakt", tekst: "Plaatsingen per maand, hoe ver elke vacature staat en je kwartaaldoel. Je ziet meteen waar het stokt." },
  ],
  menu: [
    { groep: "Vandaag", items: ["Start", "Agenda", "Mail", "Assistent"] },
    { groep: "Werving", items: ["Pipeline", "Kandidaten", "Vacatures", "Facturen", "Cijfers"] },
  ],
  start: {
    status: "2 gesprekken vandaag, 6 nieuwe sollicitaties en 1 klant die op een shortlist wacht.",
    kerncijfers: [
      { label: "Open vacatures", waarde: "14", icoon: "document" },
      { label: "Nieuwe sollicitaties", waarde: "6", icoon: "mensen" },
      { label: "Gesprekken deze week", waarde: "9", icoon: "agenda" },
      { label: "Geplaatst dit kwartaal", waarde: "7", icoon: "vink" },
    ],
    agenda: [
      { tijd: "09:30", wat: "Intake kandidaat", wie: "Mechanical Engineer · online" },
      { tijd: "11:00", wat: "Klantgesprek", wie: "Delta Bouw, Gent" },
      { tijd: "14:00", wat: "Tweede gesprek", wie: "Project Engineer · kantoor" },
    ],
    briefing: [
      "Delta Bouw wacht sinds maandag op een shortlist voor de Project Engineer.",
      "Ruben Claes kreeg een tegenbod van zijn werkgever. Vandaag even bellen?",
      "Drie nieuwe sollicitaties passen op de vacature Elektrotechnicus.",
    ],
  },
  pijplijn: {
    kicker: "Pipeline",
    titel: "Van sollicitatie tot plaatsing",
    kolommen: ["Nieuw", "Screening", "Bij klant", "Geplaatst"],
    kaarten: [
      { kol: 0, naam: "Ines Verhoeven", wie: "Process Engineer", wat: "Direct beschikbaar", bedrag: "" },
      { kol: 1, naam: "Ruben Claes", wie: "Electrical Engineer", wat: "1 maand opzeg", bedrag: "" },
      { kol: 2, naam: "Lotte Janssens", wie: "Project Engineer", wat: "Delta Bouw", bedrag: "" },
      { kol: 2, naam: "Bram De Wit", wie: "Automation Engineer", wat: "Vandeberg", bedrag: "" },
      { kol: 3, naam: "Sara Peeters", wie: "Structural Engineer", wat: "Bureau Lys", bedrag: "€ 12.800" },
    ],
    nieuw: { naam: "Jonas Wouters", wie: "Mechanical Engineer", wat: "6 jaar ervaring, cv erbij", bron: "Sollicitatie via je site", tijd: "23:14" },
    melding: "Nieuwe sollicitatie · 23:14",
  },
  mail: {
    van: "Jonas Wouters",
    tijd: "gisteren 23:14",
    onderwerp: "Sollicitatie Mechanical Engineer",
    tekst: "Beste, met interesse las ik de vacature voor Mechanical Engineer in de regio Gent. Ik heb zes jaar ervaring in machinebouw en ben direct beschikbaar. Mijn cv zit in bijlage.",
    antwoord: [
      "Dag Jonas,",
      "Bedankt voor je sollicitatie. Je ervaring in machinebouw past goed bij wat onze klant zoekt.",
      "Heb je donderdag om 9:30 tijd voor een kort online gesprek? Dan vertel ik je meer over het bedrijf en het team.",
      "Groeten,\nNora, Kernwerk",
    ],
  },
  chat: {
    items: [
      { wie: "jij", tekst: "Wie past op de vacature Project Engineer bij Delta Bouw?" },
      { wie: "ai", tekst: "Drie kandidaten. Lotte Janssens ligt al bij de klant. Ruben Claes heeft de juiste ervaring, maar een maand opzeg. Ines Verhoeven is direct beschikbaar, al komt ze uit de chemie." },
      { wie: "jij", tekst: "Zet Ruben en Ines op de shortlist voor Delta Bouw." },
      { wie: "ai", tekst: "Gedaan. De shortlist met beide profielen staat als concept klaar voor Delta Bouw. Wil je hem eerst nalezen?" },
    ],
    invoer: "Stel een vraag over je kandidaten",
  },
  factuur: {
    kicker: "Facturen",
    titel: "Factuur 2026-112",
    datum: "18 maart 2026",
    klant: "Ingenieursbureau Lys",
    adres: "Coupure Links 40, 9000 Gent",
    lijnen: [
      { wat: "Plaatsing Sara Peeters, Structural Engineer", bedrag: 12800 },
      { wat: "Assessment en referentiecheck", bedrag: 450 },
    ],
    totaal: "Totaal excl. btw",
    voet: "Te betalen binnen 30 dagen. Garantie van drie maanden volgens de raamovereenkomst.",
    status: ["Opgemaakt, 18/03", "Gemaild naar Ingenieursbureau Lys", "Betaald, 02/04"],
    open: { titel: "Open bij klanten", waarde: 31600, sub: "3 facturen, 1 vervalt deze week" },
  },
  omzet: {
    kicker: "Cijfers",
    titel: "Dit kwartaal ",
    accent: "op koers",
    grafiek: "Plaatsingen per maand",
    totaal: "22 in 2026",
    waarden: [1, 2, 1, 3, 2, 2, 3, 1, 2, 3, 2],
    lijst: "Vacatures",
    items: [
      { naam: "Project Engineer", sub: "Delta Bouw · 3 in proces", score: 80, eenheid: "%" },
      { naam: "Elektrotechnicus", sub: "Vandeberg · 5 in proces", score: 55, eenheid: "%" },
      { naam: "Process Engineer", sub: "Chemco · 1 in proces", score: 25, eenheid: "%" },
    ],
    drempel: { label: "Kwartaaldoel plaatsingen", w: 0.58, tekst: "7 van de 12 geplaatst" },
  },
};

export const DEMOS: Record<Stijl, Demo> = { studio, vastgoed, recruitment };
