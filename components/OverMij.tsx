"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimateIn from "./AnimateIn";

export default function OverMij() {
  return (
    <section id="over-mij" className="grid" style={{ gridTemplateColumns: "1fr 1fr", backgroundColor: "var(--beige)" }}>
      <motion.div
        className="relative overflow-hidden"
        style={{ aspectRatio: "3/4" }}
        whileHover="hover"
      >
        <motion.div
          variants={{ hover: { scale: 1.04 } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <Image
            src="/images/DSCF3335 (1).jpg"
            alt="Sam Steylaerts — SteylVisuals"
            fill
            className="object-cover object-top"
            style={{ filter: "sepia(0.08) contrast(1.05)" }}
          />
        </motion.div>
      </motion.div>

      <div style={{ padding: "clamp(3rem,8vw,6rem)" }} className="flex flex-col justify-center">
        <AnimateIn>
          <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            Over mij
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
            Ik ben Sam,<br /><em style={{ color: "var(--muted)" }}>de man achter<br />de lens</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light leading-loose mb-8" style={{ color: "var(--muted)", maxWidth: "440px" }}>
            Als videograaf en editor gebaseerd in Herent zag ik hoe makelaars prachtige panden hadden die maanden bleven staan — simpelweg omdat niemand ze zag. Eén goede video maakt het verschil.
            <br /><br />
            SteylVisuals is mijn antwoord daarop: cinematic short-form content die jouw panden in de kijker zet op Instagram, TikTok en LinkedIn. Geen overbodige toeters en bellen — gewoon video die werkt en viewings oplevert.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 400, fontStyle: "italic", color: "var(--brown)" }}>
            — Sam Steylaerts
          </span>
        </AnimateIn>
      </div>
    </section>
  );
}
