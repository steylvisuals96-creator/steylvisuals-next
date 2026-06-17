import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { naam, email, telefoon, aanbevolen_stijl, quiz_samenvatting } = body;

    if (!naam || !email) {
      return NextResponse.json({ error: "Naam en e-mail zijn verplicht." }, { status: 400 });
    }

    await resend.emails.send({
      from:    "Website Quiz <onboarding@resend.dev>",
      to:      ["steylvisuals96@gmail.com"],
      replyTo: email,
      subject: `Website quiz — ${naam}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px;font-size:24px">Nieuwe quizaanvraag</h2>
          <p style="color:#666;margin:0 0 24px;font-size:14px">Ingevuld via de website quiz op steylvisuals.be</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#999;font-size:13px;width:140px">Naam</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${naam}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#999;font-size:13px">E-mail</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${email}" style="color:#B8843A">${email}</a></td>
            </tr>
            ${telefoon ? `<tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#999;font-size:13px">Telefoon</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${telefoon}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #eee;color:#999;font-size:13px">Aanbevolen stijl</td>
              <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600">${aanbevolen_stijl}</td>
            </tr>
          </table>

          <h3 style="margin:0 0 12px;font-size:14px;color:#999;font-weight:normal;text-transform:uppercase;letter-spacing:0.1em">Quiz antwoorden</h3>
          <pre style="background:#f7f5f2;padding:16px;font-size:13px;line-height:1.7;border-radius:4px;white-space:pre-wrap">${quiz_samenvatting}</pre>

          <p style="margin:24px 0 0;font-size:12px;color:#bbb">Antwoord op deze mail gaat rechtstreeks naar ${email}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("quiz-contact error:", err);
    return NextResponse.json({ error: "Verzenden mislukt." }, { status: 500 });
  }
}
