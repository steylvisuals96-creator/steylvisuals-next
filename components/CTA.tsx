"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

export default function CTA() {
  return (
    <section style={{ backgroundColor: "var(--dark)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center" style={{ maxWidth: "640px", margin: "0 auto" }}>
        <AnimateIn>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "var(--gold)" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            Klaar om op te vallen?
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem,5.5vw,5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--beige)" }}>
            Vraag vandaag nog<br /><em style={{ color: "rgba(242,237,232,0.45)" }}>jouw gratis Reel aan</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light leading-relaxed mb-10" style={{ color: "rgba(242,237,232,0.4)" }}>
            Geen risico, geen verplichting. Stuur je footage en ontvang binnen 48 uur een kant-en-klare demo-edit.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Gratis%20demo-edit%20aanvraag"
            className="inline-block text-sm font-medium rounded-full px-10 py-4"
            style={{ backgroundColor: "var(--gold)", color: "var(--dark)" }}
            whileHover={{ backgroundColor: "var(--gold-light)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Gratis demo-edit aanvragen
          </motion.a>
        </AnimateIn>
      </div>
    </section>
  );
}
