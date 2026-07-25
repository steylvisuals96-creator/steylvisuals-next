"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimateIn from "./AnimateIn";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch("https://formsubmit.co/steylvisuals96@gmail.com", {
      method: "POST",
      body: data,
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section id="contact" style={{ backgroundColor: "var(--black)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16 grid-cols-1 md:grid-cols-2" style={{ alignItems: "start" }}>
        <div>
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--cream-muted)" }}>
              Contact
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: 0, color: "var(--cream)" }}>
              Laten we<br /><em style={{ color: "var(--cream-muted)" }}>kennis maken</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "var(--cream-muted)", maxWidth: "360px" }}>
              Klaar voor meer viewings? Stuur een berichtje of vraag meteen je gratis demo-edit aan. Ik reageer binnen 24 uur.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="flex flex-col gap-3 text-sm font-light" style={{ color: "var(--cream-muted)" }}>
              <a href="mailto:Steylvisuals96@gmail.com" style={{ color: "var(--gold)", textDecoration: "none" }}>
                Steylvisuals96@gmail.com
              </a>
              <span>Beschikbaar wereldwijd</span>
              <a href="https://www.instagram.com/steylvisuals" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cream-muted)", textDecoration: "none" }}>
                @steylvisuals
              </a>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.15}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center gap-4 py-16"
              style={{ backgroundColor: "var(--panel)", borderRadius: "var(--r-md)", border: "1px solid var(--hairline)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(201,151,74,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)" }}>
                Bericht ontvangen!
              </h3>
              <p className="text-sm font-light" style={{ color: "var(--cream-muted)" }}>
                Ik neem binnen 24 uur contact met je op.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Formsubmit hidden fields */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="Nieuwe aanvraag via SteylVisuals" />
              <input type="hidden" name="_autoresponse" value="Bedankt voor je interesse in SteylVisuals! Ik heb je bericht goed ontvangen en neem binnen 24 uur persoonlijk contact met je op. Wil je ondertussen alvast mijn portfolio bekijken? → https://steylvisuals-next.vercel.app/portfolio — Tot snel, Sam Steylaerts | SteylVisuals — Vastgoed marketing" />

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cf-voornaam" className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--cream-muted)" }}>Voornaam</label>
                  <input
                    type="text"
                    name="voornaam"
                    id="cf-voornaam"
                    required
                    placeholder="Jouw voornaam"
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "transparent", border: "none", borderBottom: "1px solid var(--hairline-strong)", borderRadius: 0, padding: "0.875rem 0", color: "var(--cream)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cf-achternaam" className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--cream-muted)" }}>Achternaam</label>
                  <input
                    type="text"
                    name="achternaam"
                    id="cf-achternaam"
                    placeholder="Jouw achternaam"
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "transparent", border: "none", borderBottom: "1px solid var(--hairline-strong)", borderRadius: 0, padding: "0.875rem 0", color: "var(--cream)" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="cf-email" className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--cream-muted)" }}>E-mail</label>
                <input
                  type="email"
                  name="_replyto"
                  id="cf-email"
                  required
                  placeholder="jouw@email.be"
                  className="text-sm font-light outline-none"
                  style={{ backgroundColor: "transparent", border: "none", borderBottom: "1px solid var(--hairline-strong)", borderRadius: 0, padding: "0.875rem 0", color: "var(--cream)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="cf-pakket" className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--cream-muted)" }}>Pakket</label>
                <select
                  name="pakket"
                  id="cf-pakket"
                  className="text-sm font-light outline-none"
                  style={{ backgroundColor: "transparent", border: "none", borderBottom: "1px solid var(--hairline-strong)", borderRadius: 0, padding: "0.875rem 0", color: "var(--cream)", appearance: "none" }}
                >
                  <option value="">Kies een pakket (optioneel)</option>
                  <option value="Gratis demo-edit">Gratis demo-edit</option>
                  <option value="Edit Only — €290/maand">Edit Only — €290/maand</option>
                  <option value="Starter — €490/maand">Starter — €490/maand</option>
                  <option value="Groei — €890/maand">Groei — €890/maand</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="cf-bericht" className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--cream-muted)" }}>Bericht</label>
                <textarea
                  name="bericht"
                  id="cf-bericht"
                  rows={4}
                  placeholder="Vertel me over jouw kantoor en doelen..."
                  className="text-sm font-light outline-none resize-none"
                  style={{ backgroundColor: "transparent", border: "none", borderBottom: "1px solid var(--hairline-strong)", borderRadius: 0, padding: "0.875rem 0", color: "var(--cream)" }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="text-sm font-medium rounded-[2px] py-3.5 mt-2"
                style={{ backgroundColor: "var(--gold)", color: "var(--black)", opacity: loading ? 0.6 : 1 }}
                whileHover={{ opacity: 0.88 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? "Versturen..." : "Verstuur bericht"}
              </motion.button>
            </form>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}
