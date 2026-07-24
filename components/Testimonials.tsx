"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

const reviews = [
  {
    quote: "Binnen twee weken na onze eerste Reel kregen we drie extra viewings. De video's zien er écht professioneel uit — veel beter dan alles wat we zelf probeerden te maken.",
    name: "Sofie Van den Berg",
    role: "Immo Leuven",
  },
  {
    quote: "Sam begrijpt precies wat een makelaar nodig heeft. Geen gedoe, gewoon resultaat. Onze Instagram is compleet veranderd en we krijgen veel meer reacties op onze panden.",
    name: "Thomas Declercq",
    role: "ERA Mechelen",
  },
  {
    quote: "De gratis demo-edit overtuigde me meteen. Ik had nooit verwacht dat video zo'n impact zou hebben op het aantal aanvragen. Absolute aanrader voor elke makelaar.",
    name: "Lieselotte Pieters",
    role: "Century 21 Gent",
  },
];

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="var(--gold)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: "var(--black)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-14">
        <AnimateIn>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--cream-muted)" }}>
            Ervaringen
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.75rem, 6vw, 4.75rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: 0, color: "var(--cream)" }}>
            Wat klanten<br /><em style={{ color: "var(--cream-muted)" }}>over ons zeggen</em>
          </h2>
        </AnimateIn>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.article
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(28,14,7,0.08)" }}
            className="flex flex-col gap-5"
            style={{
              backgroundColor: "var(--black)",
              borderRadius: "var(--r-md)",
              padding: "clamp(1.75rem,3vw,2.25rem)",
              border: "1px solid var(--hairline)",
            }}
          >
            <Stars />
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, lineHeight: 1.6, color: "var(--cream)", fontStyle: "italic", flex: 1 }}>
              &ldquo;{r.quote}&rdquo;
            </p>
            <div className="pt-4 border-t" style={{ borderColor: "var(--hairline)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--cream)" }}>{r.name}</p>
              <p className="text-xs font-light" style={{ color: "var(--cream-muted)" }}>{r.role}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
