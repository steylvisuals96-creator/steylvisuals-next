"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const MARQUEE_WORDS = [
  "Cinematic video",
  "Webdesign",
  "Drone footage",
  "Instagram Reels",
  "Branding",
  "TikTok",
];

function MarqueeRow() {
  const row = (
    <div className="flex items-center gap-8 pr-8 flex-shrink-0">
      {MARQUEE_WORDS.map((word) => (
        <span key={word} className="flex items-center gap-8 whitespace-nowrap">
          <span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "-0.02em",
              color: "transparent",
              WebkitTextStroke: "1px rgba(184,132,58,0.35)",
            }}
          >
            {word}
          </span>
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: "rgba(184,132,58,0.4)" }}
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden select-none" aria-hidden="true">
      <div className="flex animate-marquee-slow">
        {row}
        {row}
      </div>
    </div>
  );
}

export default function ShowReel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0A", padding: "7rem 0" }}
    >
      {/* Top hairline */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[min(90%,1200px)]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(184,132,58,0.25), transparent)" }}
        aria-hidden="true"
      />

      {/* Marquee behind phone */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.85 }}>
        <MarqueeRow />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-14"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#B8843A",
          }}
        >
          <span className="w-5 h-px" style={{ backgroundColor: "#B8843A" }} />
          Showreel
          <span className="w-5 h-px" style={{ backgroundColor: "#B8843A" }} />
        </motion.p>

        {/* Phone mockup with video */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.92 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          style={{ y: phoneY }}
        >
          <div
            style={{
              width: "clamp(220px, 60vw, 300px)",
              borderRadius: "44px",
              overflow: "hidden",
              aspectRatio: "9/19.5",
              backgroundColor: "#000",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.6), 0 0 0 8px rgba(255,255,255,0.05), 0 0 90px rgba(184,132,58,0.12)",
            }}
          >
            <video
              src="https://pub-28e65866cf1641928966914639cc84ef.r2.dev/videos/web/Summum_Pre_-Launch_NL.MOV"
              poster=""
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              title="SteylVisuals showreel"
            />
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-center mt-14"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.85rem",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(253,250,247,0.42)",
            maxWidth: "380px",
          }}
        >
          Elke video op maat gefilmd, geknipt en gegradeerd —
          klaar om te scoren op Reels en TikTok.
        </motion.p>
      </div>
    </section>
  );
}
