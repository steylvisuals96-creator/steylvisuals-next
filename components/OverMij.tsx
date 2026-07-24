"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimateIn from "./AnimateIn";

export default function OverMij() {
  return (
    <section id="over-mij" className="grid grid-cols-1 md:grid-cols-2" style={{ backgroundColor: "var(--black)" }}>
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
            src="https://pub-28e65866cf1641928966914639cc84ef.r2.dev/images/DSCF3335__1_.jpg"
            alt="Sam Steylaerts — SteylVisuals"
            fill
            className="object-cover object-top"
            style={{ filter: "sepia(0.08) contrast(1.05)" }}
          />
        </motion.div>
      </motion.div>

      <div style={{ padding: "clamp(3rem,8vw,6rem)" }} className="flex flex-col justify-center">
        <AnimateIn>
          <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--cream-muted)" }}>
            Over mij
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: 0, color: "var(--cream)" }}>
            Ik ben Sam,<br /><em style={{ color: "var(--cream-muted)" }}>de man achter<br />de lens</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light leading-loose mb-8" style={{ color: "var(--cream-muted)", maxWidth: "440px" }}>
            Als videograaf, editor en webdesigner geloof ik dat elk bedrijf een sterk verhaal verdient — en dat het juiste beeld dat verhaal vertelt beter dan woorden ooit kunnen.
            <br /><br />
            SteylVisuals is mijn antwoord daarop: premium video, content en websites die jouw merk in de kijker zetten. Geen overbodige toeters en bellen — gewoon werk dat resultaat oplevert.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", color: "var(--cream-muted)" }}>
            — Sam Steylaerts
          </span>
        </AnimateIn>
      </div>
    </section>
  );
}
