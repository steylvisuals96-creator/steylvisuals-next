"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

const plans = [
  {
    tag: "Edit Only",
    name: "Jij filmt,\nik edit",
    sub: "Voor wie zelf filmt",
    price: "€290",
    featured: false,
    features: [
      "Film Guide op maat",
      "4 video's per maand",
      "Montage + kleurgrading",
      "Captions & ondertitels",
      "Levering binnen 1 week",
    ],
  },
  {
    tag: "Meest gekozen",
    name: "Starter",
    sub: "Halve dag opnames inbegrepen",
    price: "€490",
    featured: true,
    features: [
      "1 halve dag shoot per maand",
      "6 video's per maand",
      "Montage, kleurgrading & audio",
      "Captions, scripts & hooks",
      "Levering binnen 1 week",
    ],
  },
  {
    tag: "Groei",
    name: "Ik kom\nnaar jou",
    sub: "Volledige dag + strategie",
    price: "€890",
    featured: false,
    features: [
      "1 volledige dag shoot per maand",
      "10+ video's per maand",
      "Drone shots inbegrepen",
      "Content strategie-advies",
      "Levering binnen 1 week",
    ],
  },
];

function CheckIcon() {
  return (
    <span className="flex items-center justify-center flex-shrink-0 mt-1" aria-hidden="true">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cream-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" style={{ backgroundColor: "var(--black)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-16">
        <AnimateIn>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--cream-muted)" }}>
            Pakketten
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.75rem, 6vw, 4.75rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: 0, color: "var(--cream)" }}>
            Wat je krijgt,<br /><em style={{ color: "var(--cream-muted)" }}>per pakket</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light mt-4 mx-auto" style={{ color: "var(--cream-muted)", maxWidth: "420px" }}>
            Kies het pakket dat bij jouw kantoor past. Prijs op aanvraag — vraag een gratis demo-edit aan en ik geef je een voorstel op maat.
          </p>
        </AnimateIn>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.article
            key={plan.tag}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="pricing-card relative flex flex-col overflow-hidden"
            style={{
              backgroundColor: "var(--panel)",
              borderRadius: "var(--r-md)",
              padding: "clamp(1.75rem,3vw,2.5rem)",
              border: `1px solid ${plan.featured ? "var(--hairline-gold)" : "var(--hairline)"}`,
            }}
          >
            <span className="w-fit text-xs font-medium tracking-widest uppercase mb-7"
              style={{ color: "var(--cream-muted)" }}
            >
              {plan.tag}
            </span>

            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, lineHeight: 1.15, color: "var(--cream)", marginBottom: "0.25rem", whiteSpace: "pre-line" }}>
              {plan.name}
            </h3>
            <p className="text-sm font-light italic mb-6" style={{ color: "var(--cream-muted)" }}>
              {plan.sub}
            </p>

            <div className="pb-6 mb-6 border-b" style={{ borderColor: "var(--hairline)" }}>
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--cream-muted)" }}>
                Prijs op aanvraag
              </span>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm font-light leading-snug" style={{ color: "var(--cream-muted)" }}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <motion.a
              href={`mailto:Steylvisuals96@gmail.com?subject=${encodeURIComponent(plan.tag + " pakket")}`}
              className="block text-center text-sm font-medium rounded-[2px] py-3.5 transition-colors"
              style={{
                backgroundColor: plan.featured ? "var(--gold)" : "transparent",
                color: plan.featured ? "var(--black)" : "var(--cream)",
                border: plan.featured ? "none" : "1px solid var(--hairline-strong)",
              }}
              whileHover={{ opacity: 0.88 }}
              whileTap={{ scale: 0.97 }}
            >
              Demo-edit aanvragen
            </motion.a>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
