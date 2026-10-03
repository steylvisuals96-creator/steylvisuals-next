"use client";

import { useState } from "react";
import s from "./home.module.css";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

/** The homepage contact form. Posts to /api/contact, which mails the studio. */
export default function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setState({ kind: "sent" });
      else setState({ kind: "error", message: json.error || "Verzenden is mislukt. Probeer het opnieuw." });
    } catch {
      setState({ kind: "error", message: "Geen verbinding. Probeer het opnieuw." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className={s.sent} role="status">
        <p className={s.title}>Bedankt, je bericht is binnen.</p>
        <p className={s.sub}>Je hoort binnen 24 uur van ons, met een eerste voorstel op maat.</p>
      </div>
    );
  }

  const busy = state.kind === "sending";
  return (
    <form className={s.form} onSubmit={submit} noValidate={false}>
      <div className={s.formRow}>
        <label className={s.field}>
          <span>Naam</span>
          <input name="naam" required maxLength={120} autoComplete="name" />
        </label>
        <label className={s.field}>
          <span>E-mail</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <div className={s.formRow}>
        <label className={s.field}>
          <span>
            Telefoon <em>optioneel</em>
          </span>
          <input name="telefoon" type="tel" maxLength={40} autoComplete="tel" />
        </label>
        <label className={s.field}>
          <span>
            Bedrijf <em>optioneel</em>
          </span>
          <input name="bedrijf" maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <label className={s.field}>
        <span>Waarmee kunnen we helpen?</span>
        <textarea name="bericht" required maxLength={4000} rows={5} />
      </label>
      {/* For bots only: people never see or fill this. */}
      <label className={s.trap} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className={s.formFoot}>
        <button type="submit" className={s.btn} disabled={busy}>
          {busy ? "Even geduld" : "Verstuur je aanvraag"}
        </button>
        <p className={s.formError} role="alert" aria-live="polite">
          {state.kind === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
