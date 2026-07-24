"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function LandingCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--black)", padding: "8rem clamp(1.5rem, 6vw, 6rem)" }}
    >
      {/* Gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,151,74,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Top border line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "rgba(201,151,74,0.2)", transformOrigin: "left" }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 text-center"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center gap-3 mb-8"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--gold)",
          }}
        >
          Klaar om te starten?
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.5rem, 6vw, 6.5rem)",
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: 0,
            color: "var(--cream)",
            marginBottom: "1.5rem",
          }}
        >
          Klaar om jouw
          <br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>verhaal te vertellen?</em>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.22 }}
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "1rem",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "var(--cream-muted)",
            marginBottom: "3.5rem",
          }}
        >
          Of je nu een video, een website of allebei nodig hebt — stuur een bericht en ontvang binnen 24u een gratis voorstel op maat.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.34 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Interesse%20in%20SteylVisuals"
            className="flex items-center gap-2 text-sm font-medium rounded-[2px] cursor-pointer"
            style={{
              backgroundColor: "var(--gold)",
              color: "var(--black)",
              padding: "1.1rem 2.5rem",
              fontFamily: "var(--font-poppins)",
            }}
            whileHover={{ backgroundColor: "var(--gold-light)", scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Gratis gesprek aanvragen
          </motion.a>
          <motion.a
            href="/portfolio"
            className="flex items-center gap-2 text-sm font-medium rounded-[2px] cursor-pointer"
            style={{
              border: "1px solid rgba(241,237,230,0.15)",
              color: "var(--cream)",
              padding: "1.1rem 2.5rem",
              fontFamily: "var(--font-poppins)",
            }}
            whileHover={{ borderColor: "rgba(201,151,74,0.5)", color: "var(--gold)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Bekijk portfolio
          </motion.a>
        </motion.div>

        {/* Subtle note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.75rem",
            color: "var(--cream-muted)",
            marginTop: "2rem",
          }}
        >
          Steylvisuals96@gmail.com · België
        </motion.p>
      </div>
    </section>
  );
}
