"use client";

import { useState } from "react";
import s from "./start.module.css";

type Toestand = { soort: "rust" } | { soort: "bezig" } | { soort: "verstuurd" } | { soort: "fout"; melding: string };

/** Het contactformulier. Post naar /api/contact, dat Sam een mail stuurt. */
export default function ContactForm() {
  const [t, setT] = useState<Toestand>({ soort: "rust" });

  async function verstuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setT({ soort: "bezig" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setT({ soort: "verstuurd" });
      else setT({ soort: "fout", melding: json.error || "Verzenden is mislukt. Probeer het opnieuw." });
    } catch {
      setT({ soort: "fout", melding: "Geen verbinding. Probeer het opnieuw." });
    }
  }

  if (t.soort === "verstuurd") {
    return (
      <div className={s.verstuurd} role="status">
        <h3>Bedankt, je bericht is binnen.</h3>
        <p>Je hoort binnen een werkdag van mij, met een eerste voorstel op maat.</p>
      </div>
    );
  }

  const bezig = t.soort === "bezig";
  return (
    <form className={s.form} onSubmit={verstuur}>
      <div className={s.formRij}>
        <label className={s.veld}>
          <span>Naam</span>
          <input name="naam" required maxLength={120} autoComplete="name" />
        </label>
        <label className={s.veld}>
          <span>E-mail</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" />
        </label>
      </div>
      <div className={s.formRij}>
        <label className={s.veld}>
          <span>
            Telefoon <em>optioneel</em>
          </span>
          <input name="telefoon" type="tel" maxLength={40} autoComplete="tel" />
        </label>
        <label className={s.veld}>
          <span>
            Bedrijf <em>optioneel</em>
          </span>
          <input name="bedrijf" maxLength={120} autoComplete="organization" />
        </label>
      </div>
      <label className={s.veld}>
        <span>Waarmee kan ik helpen?</span>
        <textarea name="bericht" required maxLength={4000} rows={4} />
      </label>
      {/* Alleen voor bots: mensen zien of vullen dit nooit in. */}
      <label className={s.val} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className={s.formVoet}>
        <button type="submit" className={s.knop} disabled={bezig}>
          {bezig ? "Even geduld" : "Verstuur je aanvraag"}
        </button>
        <p className={s.formFout} role="alert" aria-live="polite">
          {t.soort === "fout" ? t.melding : ""}
        </p>
      </div>
    </form>
  );
}
