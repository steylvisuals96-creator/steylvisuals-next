"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

export default function ContactForm() {
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
              <span>Herent, België</span>
              <a href="https://www.instagram.com/steylvisuals" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none" }}>
                @steylvisuals
              </a>
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.15}>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Naam</label>
                <input
                  type="text"
                  name="naam"
                  required
                  placeholder="Jouw naam"
                  className="text-sm font-light outline-none"
                  style={{
                    backgroundColor: "var(--off-white)",
                    border: "1px solid var(--beige-mid)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    color: "var(--dark)",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Kantoor</label>
                <input
                  type="text"
                  name="kantoor"
                  placeholder="Jouw kantoor"
                  className="text-sm font-light outline-none"
                  style={{
                    backgroundColor: "var(--off-white)",
                    border: "1px solid var(--beige-mid)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem",
                    color: "var(--dark)",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>E-mail</label>
              <input
                type="email"
                name="email"
                required
                placeholder="jouw@email.be"
                className="text-sm font-light outline-none"
                style={{
                  backgroundColor: "var(--off-white)",
                  border: "1px solid var(--beige-mid)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  color: "var(--dark)",
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Pakket</label>
              <select
                name="pakket"
                className="text-sm font-light outline-none"
                style={{
                  backgroundColor: "var(--off-white)",
                  border: "1px solid var(--beige-mid)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  color: "var(--muted)",
                  appearance: "none",
                }}
              >
                <option value="">Kies een pakket (optioneel)</option>
                <option value="demo">Gratis demo-edit</option>
                <option value="edit-only">Edit Only — €290/maand</option>
                <option value="starter">Starter — €490/maand</option>
                <option value="groei">Groei — €890/maand</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Bericht</label>
              <textarea
                name="bericht"
                rows={4}
                placeholder="Vertel me over jouw kantoor en doelen..."
                className="text-sm font-light outline-none resize-none"
                style={{
                  backgroundColor: "var(--off-white)",
                  border: "1px solid var(--beige-mid)",
                  borderRadius: "10px",
                  padding: "0.75rem 1rem",
                  color: "var(--dark)",
                }}
              />
            </div>

            <motion.button
              type="submit"
              className="text-sm font-medium rounded-full py-3.5 mt-2"
              style={{ backgroundColor: "var(--dark)", color: "var(--beige)" }}
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.97 }}
            >
              Verstuur bericht
            </motion.button>
          </form>
        </AnimateIn>
      </div>
    </section>
  );
}
