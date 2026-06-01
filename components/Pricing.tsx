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
    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" style={{ backgroundColor: "var(--beige)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-16">
        <AnimateIn>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            Pakketten
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
            Transparante prijzen,<br /><em style={{ color: "var(--muted)" }}>geen verrassingen</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light mt-4 mx-auto" style={{ color: "var(--muted)", maxWidth: "400px" }}>
            Kies het pakket dat bij jouw kantoor past. Geen jaarcontract, altijd opzegbaar.
          </p>
        </AnimateIn>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {plans.map((plan, i) => (
          <motion.article
            key={plan.tag}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(28,14,7,0.12)" }}
            className="relative flex flex-col overflow-hidden"
            style={{
              backgroundColor: plan.featured ? "var(--dark)" : "var(--off-white)",
              borderRadius: "20px",
              padding: "clamp(1.75rem,3vw,2.5rem)",
              border: `1px solid ${plan.featured ? "var(--dark)" : "var(--beige-mid)"}`,
            }}
          >
            {/* Bottom accent line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ backgroundColor: "var(--gold)" }}
              initial={{ scaleX: plan.featured ? 1 : 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />

            <span className="w-fit text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-7"
              style={{
                color: plan.featured ? "var(--gold)" : "var(--muted)",
                backgroundColor: plan.featured ? "rgba(184,132,58,0.15)" : "var(--beige)",
              }}
            >
              {plan.tag}
            </span>

            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, lineHeight: 1.15, color: plan.featured ? "var(--beige)" : "var(--dark)", marginBottom: "0.25rem", whiteSpace: "pre-line" }}>
              {plan.name}
            </h3>
            <p className="text-sm font-light italic mb-6" style={{ color: plan.featured ? "rgba(242,237,232,0.45)" : "var(--muted)" }}>
              {plan.sub}
            </p>

            <div className="pb-6 mb-6 border-b" style={{ borderColor: plan.featured ? "rgba(242,237,232,0.1)" : "var(--beige-mid)" }}>
              <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", color: plan.featured ? "var(--beige)" : "var(--dark)" }}>
                {plan.price}
              </span>
              <span className="text-sm font-light ml-1" style={{ color: plan.featured ? "rgba(242,237,232,0.4)" : "var(--muted)" }}>
                /maand
              </span>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm font-light leading-snug" style={{ color: plan.featured ? "rgba(242,237,232,0.65)" : "var(--muted)" }}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            <motion.a
              href={`mailto:Steylvisuals96@gmail.com?subject=${encodeURIComponent(plan.tag + " pakket")}`}
              className="block text-center text-sm font-medium rounded-full py-3.5 transition-colors"
              style={{
                backgroundColor: plan.featured ? "var(--gold)" : "var(--beige-mid)",
                color: plan.featured ? "var(--dark)" : "var(--dark)",
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
