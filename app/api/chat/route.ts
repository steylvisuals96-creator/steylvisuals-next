import { NextRequest } from "next/server";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5-20251001";

const MAX_MESSAGES = 20;
const MAX_CHARS = 1500;
const MAX_TOKENS = 400;
const RATE_MAX = 12;
const RATE_WINDOW_MS = 60_000;

const hits = new Map<string, { start: number; count: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const record = hits.get(ip);
  if (!record || now - record.start > RATE_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    return false;
  }
  record.count += 1;
  return record.count > RATE_MAX;
}

const SYSTEM_PROMPT = `Je bent een live demo-assistent op de portfolio-website van SteylVisuals. SteylVisuals is de creatieve studio van Sam Steylaerts die op maat gemaakte AI-chatbots, websites en video marketing bouwt voor bedrijven in België.

Deze chat IS zelf een portfolio-stuk: bezoekers kunnen hier live testen hoe zo'n AI-assistent werkt en voelt. Jij speelt dus de rol van "demo-model" dat laat zien wat mogelijk is.

**Wat je kan bespreken:**
- Hoe AI-assistenten werken en wat ze voor een website doen
- Wat SteylVisuals bouwt: websites, AI-chat, video marketing
- Hoe een assistent gepersonaliseerd wordt naar een merk (toon, kennis, kleurthema)
- Concrete voorbeelden: leads kwalificeren, vragen beantwoorden, afspraken suggereren
- Prijzen en timing (eerlijk: prijs op maat, bespreek het via mail)

**Als iemand interesse toont in een eigen assistent of website:**
Stel voor contact op te nemen via steylvisuals96@gmail.com. Vraag kort naar hun bedrijf en wat ze nodig hebben.

**Stijlregels:**
- Altijd Nederlands
- Kort en direct: max 2-3 zinnen per antwoord
- Vriendelijk, geen formeel "u"-taalgebruik tenzij de bezoeker dat zelf gebruikt
- Voeg maximaal 3 snelkoppelingen toe als dat nuttig is: [optie 1|optie 2|optie 3]
- Nooit meer dan één vraag tegelijk`;

type Msg = { role: "user" | "assistant"; content: string };

// Regel-gebaseerd, geen echte AI: kan dus niet redeneren over een willekeurig
// antwoord. In plaats van op elke beurt opnieuw op trefwoorden te matchen
// (en terug te vallen op de generieke opener zodra niets matcht — de bug die
// hier stond), volgt de mock een vaste 2-beurten-flow op basis van hoeveel
// keer de bezoeker al iets typte: beurt 1 kiest de richting, beurt 2 sluit
// altijd netjes af, ongeacht welke chip er precies werd aangeklikt.
function mockReply(messages: Msg[]): string {
  const userTurns = messages.filter((m) => m.role === "user").length;
  const last = messages[messages.length - 1]?.content?.toLowerCase() || "";

  if (userTurns <= 1) {
    if (last.includes("video")) {
      return "Super, video marketing is precies wat SteylVisuals doet! Vertel eens: voor welk merk of bedrijf is dit, en wat wil je ermee bereiken? [Brand film|Productvideo|Social media reels]";
    }
    if (last.includes("website") || last.includes("web")) {
      return "Geweldig, we bouwen websites met een eigen beheerpaneel. Voor welk bedrijf is dit? [Showcase site|E-commerce|Portfolio]";
    }
    return "Hallo! Ik help je graag verder. Waarvoor kan ik je vandaag iets vertellen? [Video marketing|Webdesign|Beide]";
  }

  return `Top, dat klinkt goed! Dit is een simpele demo-versie — voor een echt gesprek op maat van "${messages[messages.length - 1]?.content || "jouw project"}" mail je best naar steylvisuals96@gmail.com, dan bekijken we het samen.`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let payload: { messages?: unknown } | null = null;
  try { payload = await req.json(); } catch { payload = null; }
  if (!payload || !Array.isArray(payload.messages)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const messages: Msg[] = (payload.messages as Array<{ role?: string; content?: string }>)
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content || "").slice(0, MAX_CHARS) }));

  if (!messages.length) return Response.json({ error: "no_messages" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ reply: mockReply(messages), mock: true });
  }

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM_PROMPT, messages }),
    });

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Anthropic ${res.status}: ${detail.slice(0, 300)}`);
    }

    const data = await res.json() as { content?: Array<{ type: string; text?: string }> };
    const reply = data.content?.find((b) => b.type === "text")?.text || "";
    return Response.json({ reply: reply.trim() });
  } catch (err) {
    console.error("[chat]", err instanceof Error ? err.message : err);
    return Response.json(
      { error: "upstream", reply: "Sorry, er ging iets mis. Mail ons op steylvisuals96@gmail.com." },
      { status: 502 },
    );
  }
}
