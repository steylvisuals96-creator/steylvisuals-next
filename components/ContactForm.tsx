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
    <section id="contact" style={{ backgroundColor: "var(--beige)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
        <div>
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              Contact
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Laten we<br /><em style={{ color: "var(--muted)" }}>kennis maken</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "var(--muted)", maxWidth: "360px" }}>
              Klaar voor meer viewings? Stuur een berichtje of vraag meteen je gratis demo-edit aan. Ik reageer binnen 24 uur.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="flex flex-col gap-3 text-sm font-light" style={{ color: "var(--muted)" }}>
              <a href="mailto:Steylvisuals96@gmail.com" style={{ color: "var(--gold)", textDecoration: "none" }}>
                Steylvisuals96@gmail.com
              </a>
              <span>Beschikbaar wereldwijd</span>
              <a href="https://www.instagram.com/steylvisuals" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>
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
              style={{ backgroundColor: "var(--off-white)", borderRadius: "20px", border: "1px solid var(--beige-mid)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 400, color: "var(--dark)" }}>
                Bericht ontvangen!
              </h3>
              <p className="text-sm font-light" style={{ color: "var(--muted)" }}>
                Ik neem binnen 24 uur contact met je op.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Formsubmit hidden fields */}
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value="Nieuwe aanvraag via SteylVisuals" />
              <input type="hidden" name="_autoresponse" value="Bedankt voor je bericht! Ik heb je aanvraag goed ontvangen en neem binnen 24 uur contact met je op. Wil je ondertussen mijn portfolio bekijken? → https://steylvisuals-next.vercel.app/portfolio — Sam Steylaerts | SteylVisuals" />

              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Naam</label>
                  <input
                    type="text"
                    name="naam"
                    required
                    placeholder="Jouw naam"
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Kantoor</label>
                  <input
                    type="text"
                    name="kantoor"
                    placeholder="Jouw kantoor"
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>E-mail</label>
                <input
                  type="email"
                  name="_replyto"
                  required
                  placeholder="jouw@email.be"
                  className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Pakket</label>
                <select
                  name="pakket"
                  className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--muted)", appearance: "none" }}
                >
                  <option value="">Kies een pakket (optioneel)</option>
                  <option value="Gratis demo-edit">Gratis demo-edit</option>
                  <option value="Edit Only — €290/maand">Edit Only — €290/maand</option>
                  <option value="Starter — €490/maand">Starter — €490/maand</option>
                  <option value="Groei — €890/maand">Groei — €890/maand</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Bericht</label>
                <textarea
                  name="bericht"
                  rows={4}
                  placeholder="Vertel me over jouw kantoor en doelen..."
                  className="text-sm font-light outline-none resize-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="text-sm font-medium rounded-full py-3.5 mt-2"
                style={{ backgroundColor: "var(--dark)", color: "var(--beige)", opacity: loading ? 0.6 : 1 }}
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
