"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useContent } from "@/lib/useContent";

// Editable from /admin: replace the object in R2 under the same key.
export const HERO_PORTRAIT =
  "https://pub-28e65866cf1641928966914639cc84ef.r2.dev/images/DSCF3335__1_.jpg";

const WORDS = ["content", "design", "video", "merk", "impact"];

function AnimatedWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={word}
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "inline-block" }}
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );
}

function MouseGlow({ x, y }: { x: ReturnType<typeof useMotionValue<number>>; y: ReturnType<typeof useMotionValue<number>> }) {
  const sx = useSpring(x, { stiffness: 50, damping: 20 });
  const sy = useSpring(y, { stiffness: 50, damping: 20 });
  return (
    <motion.div
      className="fixed pointer-events-none hidden md:block"
      aria-hidden="true"
      style={{
        left: sx, top: sy, x: "-50%", y: "-50%",
        width: "520px", height: "520px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,151,74,0.07) 0%, transparent 65%)",
        zIndex: 1,
      }}
    />
  );
}

export default function LandingHero() {
  const content = useContent();
  const [wordIdx, setWordIdx] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const glowX = useMotionValue(-500);
  const glowY = useMotionValue(-500);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2300);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => { glowX.set(e.clientX); glowY.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [glowX, glowY]);

  return (
    <section
      ref={ref}
      className="relative min-h-svh flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "var(--black)" }}
    >
      {/* SVG noise grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Gold radial glow */}
      <motion.div style={{ y: parallaxY }} className="absolute top-0 left-1/2 pointer-events-none" aria-hidden="true" initial={false}>
        <div style={{ width: "900px", height: "900px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,151,74,0.13) 0%, transparent 65%)", filter: "blur(60px)", transform: "translate(-50%, -40%)" }} />
      </motion.div>

      <MouseGlow x={glowX} y={glowY} />

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: "20%", height: "1px", backgroundColor: "rgba(201,151,74,0.08)", transformOrigin: "left" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 px-6 sm:px-12 lg:px-24 pt-28 pb-20 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >
        {/* Left: text */}
        <div>
          {/*
            The eyebrow and headline are deliberately NOT animated from opacity 0.
            They are the LCP element on mobile, and gating them behind a JS
            reveal cost ~3s of render delay — plus it meant the copy was invisible
            to anything that never runs rAF (background tabs, link-preview
            renderers). The supporting elements below still animate in.
          */}
          <p
            className="mb-8"
            style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--cream-muted)" }}
          >
            Creative Studio · België
          </p>

          {/* Headline */}
          <div className="mb-10">
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: 0,
                color: "var(--cream)",
              }}
            >
              Premium{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>
                <AnimatedWord word={WORDS[wordIdx]} />
              </em>
              <br />
              voor bedrijven
              <br />
              die groeien
            </h1>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "1.05rem",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "var(--cream-muted)",
              maxWidth: "420px",
              marginBottom: "3rem",
            }}
          >
            {content.hero.subtext}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            className="flex flex-wrap gap-4 items-center"
            style={{ marginBottom: "4rem" }}
          >
            <motion.a
              href="mailto:Steylvisuals96@gmail.com?subject=Interesse%20in%20SteylVisuals"
              className="cursor-pointer"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--black)",
                padding: "1.125rem 2.5rem",
                borderRadius: "var(--r-sm)",
                fontFamily: "var(--font-poppins)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
              }}
              whileHover={{ backgroundColor: "var(--gold-light)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              Gratis gesprek aanvragen
            </motion.a>
            <motion.a
              href="#services"
              className="cursor-pointer"
              style={{
                border: "1px solid rgba(241,237,230,0.25)",
                color: "var(--cream)",
                padding: "1.125rem 2.5rem",
                borderRadius: "var(--r-sm)",
                fontFamily: "var(--font-poppins)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
              }}
              whileHover={{ borderColor: "rgba(201,151,74,0.55)", color: "var(--gold)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              Ontdek onze diensten
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-10 sm:gap-14"
            style={{ borderTop: "1px solid var(--hairline)", paddingTop: "2rem" }}
          >
            {content.stats.map(({ num, label }) => (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.15 }}>{num}</p>
                <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--cream-muted)", marginTop: "0.5rem", letterSpacing: "0.26em", textTransform: "uppercase" }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block relative"
          style={{ height: "clamp(480px, 70vh, 700px)" }}
        >
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: "var(--r-md)", border: "1px solid var(--hairline)" }}>
            {/*
              Source stays in R2 so it remains replaceable from /admin; Vercel
              resizes and re-encodes it at the edge. This block only renders at lg
              and up, so `sizes` resolves to the smallest candidate below that
              breakpoint rather than fetching a desktop-sized file phones never show.
            */}
            <Image
              src={HERO_PORTRAIT}
              sizes="(min-width: 1024px) 42vw, 1px"
              width={1280}
              height={1920}
              alt="Sam Steylaerts — SteylVisuals"
              priority
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.88)" }}
            />
            <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to top, rgba(10,10,10,0.82) 0%, transparent 100%)" }} />
            <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)", lineHeight: 1.15 }}>Sam Steylaerts</p>
              <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--cream-muted)", letterSpacing: "0.26em", textTransform: "uppercase", marginTop: "0.5rem" }}>Oprichter · SteylVisuals</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
        <div className="w-px h-14 overflow-hidden" style={{ backgroundColor: "rgba(201,151,74,0.15)" }}>
          <motion.div className="w-full" style={{ height: "50%", backgroundColor: "var(--cream-muted)" }} animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  );
}
