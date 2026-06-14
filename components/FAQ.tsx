"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimateIn from "./AnimateIn";

const faqs = [
  {
    q: "Moet ik zelf filmen of kom jij ter plaatse?",
    a: "Dat kies jij zelf. Bij het Edit Only-pakket film jij met mijn persoonlijke Film Guide. Bij Starter kom ik langs voor een halve dag shoot, bij Groei een volledige dag.",
  },
  {
    q: "Hoe snel ontvang ik mijn video's?",
    a: "Bij het Edit Only-pakket lever ik binnen 5 werkdagen. Bij Starter en Groei is dat binnen 3 werkdagen. Spoed mogelijk in overleg.",
  },
  {
    q: "Zit ik vast aan een jaarcontract?",
    a: "Nee. Alle pakketten zijn maandelijks opzegbaar. Geen verborgen kosten, geen lange verbintenissen.",
  },
  {
    q: "Voor welke platforms zijn de video's geschikt?",
    a: "De video's zijn geoptimaliseerd voor Instagram Reels, TikTok en LinkedIn. Verticaal formaat (9:16) met captions en platform-specifieke hooks.",
  },
  {
    q: "Wat is de gratis demo-edit precies?",
    a: "Stuur me ruwe footage van een pand — ik monteer gratis een volledige Reel zodat je de kwaliteit kunt beoordelen. Zonder verplichting, zonder betaling.",
  },
  {
    q: "Kan ik meerdere panden per maand laten filmen?",
    a: "Dat hangt af van het pakket. Bij Groei plan ik één volledige dag per maand in — we bespreken samen welke panden prioriteit krijgen. Extra shoots zijn mogelijk in overleg.",
  },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="border-b"
      style={{ borderColor: "var(--beige-mid)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left py-5"
      >
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1rem,1.6vw,1.25rem)", fontWeight: 500, color: "var(--dark)", lineHeight: 1.3 }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: open ? "var(--gold)" : "var(--beige-mid)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="1" x2="6" y2="11" stroke={open ? "var(--dark)" : "var(--muted)"} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="6" x2="11" y2="6" stroke={open ? "var(--dark)" : "var(--muted)"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-sm font-light leading-relaxed pb-5" style={{ color: "var(--muted)", maxWidth: "600px" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" style={{ backgroundColor: "var(--off-white)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16 grid-cols-1 lg:grid-cols-[1fr_1.6fr]" style={{ alignItems: "start" }}>
        <div className="lg:sticky lg:top-28">
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              FAQ
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Veelgestelde<br /><em style={{ color: "var(--muted)" }}>vragen</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mt-5" style={{ color: "var(--muted)", maxWidth: "300px" }}>
              Staat jouw vraag er niet bij? Stuur gerust een mailtje naar{" "}
              <a href="mailto:Steylvisuals96@gmail.com" style={{ color: "var(--gold)", textDecoration: "none" }}>
                Steylvisuals96@gmail.com
              </a>
            </p>
          </AnimateIn>
        </div>

        <div className="border-t" style={{ borderColor: "var(--beige-mid)" }}>
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
