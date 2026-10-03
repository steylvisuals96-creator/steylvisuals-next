import { Resend } from "resend";
import { NextResponse } from "next/server";

/**
 * The homepage contact form. Everything a visitor types is escaped before it
 * goes into the email, and a hidden field catches simple bots.
 */

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ESC[c]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });

  // Honeypot: people never see this field, bots fill it. Pretend it worked.
  if (field(body.website, 200)) return NextResponse.json({ ok: true });

  const naam = field(body.naam, 120);
  const email = field(body.email, 200);
  const telefoon = field(body.telefoon, 40);
  const bedrijf = field(body.bedrijf, 120);
  const bericht = field(body.bericht, 4000);

  if (!naam || !bericht) return NextResponse.json({ error: "Vul je naam en je bericht in." }, { status: 400 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Dit e-mailadres lijkt niet te kloppen." }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Verzenden lukt nu even niet. Mail ons rechtstreeks." }, { status: 500 });

  const rows: [string, string][] = [
    ["Naam", naam],
    ["E-mail", email],
    ["Telefoon", telefoon],
    ["Bedrijf", bedrijf],
  ];
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 8px;font-size:22px">Nieuwe aanvraag via steylvisuals.be</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0 24px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) => `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#999;font-size:13px;width:120px">${k}</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${esc(v)}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;background:#f7f5f2;padding:16px;border-radius:4px">${esc(bericht)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#999">Antwoorden op deze mail gaat rechtstreeks naar de aanvrager.</p>
    </div>`;
  const text = `${rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${bericht}`;

  try {
    await new Resend(key).emails.send({
      from: "SteylVisuals website <onboarding@resend.dev>",
      to: ["steylvisuals96@gmail.com"],
      replyTo: email,
      subject: `Nieuwe aanvraag: ${naam.replace(/[\r\n]+/g, " ")}`,
      html,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact error:", err);
    return NextResponse.json({ error: "Verzenden is mislukt. Probeer het opnieuw of mail ons rechtstreeks." }, { status: 500 });
  }
}
