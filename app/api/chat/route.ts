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

const SYSTEM_PROMPT = `Je bent de AI-assistent van SteylVisuals, een creatieve studio van Sam Steylaerts in België. SteylVisuals maakt premium video marketing en op maat gebouwde websites + CMS voor bedrijven en merken.

**Diensten:**
- Video marketing: brand films, productvideo's, evenementenfilms, social media reels
- Webdesign + CMS: maatwerk websites met een eigen beheerpaneel

**Jouw doel:** potentiële klanten warm verwelkomen, hun project begrijpen en hen richting een gratis kennismaking sturen.

**Werkwijze:**
1. Vraag wat voor project ze in gedachten hebben (video, website, of beiden)
2. Vraag naar hun merk/bedrijf en wat ze willen bereiken
3. Vraag wanneer ze dit nodig hebben
4. Stel voor om contact op te nemen via steylvisuals96@gmail.com voor een gratis gesprek of demo-edit

**Stijlregels:**
- Antwoord altijd in het Nederlands
- Houd antwoorden kort: maximaal 2-3 zinnen
- Wees vriendelijk en direct, niet formeel
- Geef aan het einde van je antwoord maximaal 3 opties als je een keuzemoment hebt, in dit formaat: [optie 1|optie 2|optie 3]
- Alleen een optielijst als die echt nuttig is, niet bij elke boodschap
- Vraag nooit meer dan één vraag tegelijk`;

type Msg = { role: "user" | "assistant"; content: string };

function mockReply(messages: Msg[]): string {
  const last = messages[messages.length - 1]?.content?.toLowerCase() || "";
  if (last.includes("video")) return "Super, video marketing is precies wat SteylVisuals doet! Vertel eens: voor welk merk of bedrijf is dit, en wat wil je ermee bereiken? [Brand film|Productvideo|Social media reels]";
  if (last.includes("website") || last.includes("web")) return "Geweldig, we bouwen websites met een eigen beheerpaneel. Voor welk bedrijf is dit? [Showcase site|E-commerce|Portfolio]";
  return "Hallo! Ik help je graag verder. Waarvoor kan ik je vandaag iets vertellen? [Video marketing|Webdesign|Beide]";
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
