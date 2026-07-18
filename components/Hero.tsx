"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "@/lib/useContent";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.12, ease: EASE },
  }),
};

export default function Hero() {
  const content = useContent();
  return (
    <section
      className="min-h-svh grid grid-cols-1 md:grid-cols-2 items-center gap-16 pt-24 pb-16"
      style={{
        backgroundColor: "var(--beige)",
        padding: "calc(72px + 3rem) clamp(1.5rem, 6vw, 5rem) clamp(4rem, 8vh, 6rem)",
      }}
    >
      {/* Left */}
      <div className="flex flex-col">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase mb-8"
          style={{ color: "var(--gold)" }}
        >
          <span className="w-5 h-px" style={{ backgroundColor: "var(--gold)" }} />
          Vastgoed marketing
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "var(--dark)",
          }}
        >
          Vastgoedvideo&apos;s die
          <br />
          <em style={{ fontStyle: "italic", color: "var(--brown-warm)" }}>
            opvallen én
          </em>
          <br />
          converteren
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base font-light leading-relaxed mb-10"
          style={{ color: "var(--muted)", maxWidth: "420px" }}
        >
          {content.vastgoed.subtext}
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center gap-6 flex-wrap"
        >
          <motion.a
            href={`mailto:${content.contact.email}?subject=Gratis%20demo-edit%20aanvraag`}
            className="text-sm font-medium rounded-full px-8 py-4 transition-colors"
            style={{ backgroundColor: "var(--dark)", color: "var(--off-white)" }}
            whileHover={{ backgroundColor: "var(--brown)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Gratis demo-edit aanvragen
          </motion.a>
          <motion.a
            href="#showcase"
            className="text-sm font-normal pb-0.5 border-b transition-colors"
            style={{ color: "var(--brown)", borderColor: "var(--beige-deep)" }}
            whileHover={{ borderColor: "var(--brown)" }}
          >
            Bekijk voorbeelden
          </motion.a>
        </motion.div>
      </div>

      {/* Right — Relay video with text overlay */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex justify-center items-center"
      >
        <motion.div
          className="relative overflow-hidden"
          style={{
            borderRadius: "28px",
            aspectRatio: "9/16",
            width: "clamp(220px, 24vw, 300px)",
            boxShadow: "0 40px 80px rgba(28,14,7,0.18)",
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
        >
          <video
            src="https://pub-28e65866cf1641928966914639cc84ef.r2.dev/videos/web/Relay_Versie_1.MOV"
            poster=""
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full"
            style={{ objectFit: "cover" }}
          />

          {/* Dark gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(28,14,7,0.75) 0%, rgba(28,14,7,0.1) 50%, transparent 100%)",
            }}
          />

          {/* Text overlay */}
          <div style={{ position: "absolute", bottom: "1.5rem", left: "1.75rem", right: "1.75rem" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 400, color: "#FDFAF7", lineHeight: 1.25 }}>
              Zo zet je jouw merk<br />
              <em style={{ color: "var(--gold)" }}>in de kijker</em>
            </p>
          </div>

          {/* Play indicator */}
          <div
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              backgroundColor: "rgba(253,250,247,0.12)",
              backdropFilter: "blur(8px)",
              borderRadius: "8px",
              padding: "0.35rem 0.65rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80" }} />
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.6rem", color: "rgba(253,250,247,0.7)" }}>Live preview</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
