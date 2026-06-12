"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const WORDS = ["video", "design", "content", "impact"];

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
        left: sx,
        top: sy,
        x: "-50%",
        y: "-50%",
        width: "520px",
        height: "520px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(184,132,58,0.07) 0%, transparent 65%)",
        zIndex: 1,
      }}
    />
  );
}

export default function LandingHero() {
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
    // Mouse-follow glow — only on devices with a fine pointer
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: MouseEvent) => {
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [glowX, glowY]);

  return (
    <section
      ref={ref}
      className="relative min-h-svh flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* SVG noise grain */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Gold radial glow */}
      <motion.div
        style={{ y: parallaxY }}
        className="absolute top-0 left-1/2 pointer-events-none"
        aria-hidden="true"
        initial={false}
      >
        <div
          style={{
            width: "900px",
            height: "900px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(184,132,58,0.13) 0%, transparent 65%)",
            filter: "blur(60px)",
            transform: "translate(-50%, -40%)",
          }}
        />
      </motion.div>

      {/* Mouse-follow glow — desktop only */}
      <MouseGlow x={glowX} y={glowY} />

      {/* Thin gold horizontal line — decorative */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 right-0 pointer-events-none"
        style={{ bottom: "20%", height: "1px", backgroundColor: "rgba(184,132,58,0.08)", transformOrigin: "left" }}
        aria-hidden="true"
      />

      {/* Main content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 px-6 sm:px-12 lg:px-24 pt-28 pb-20 w-full max-w-[1400px] mx-auto"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex items-center gap-3 mb-10"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#B8843A",
          }}
        >
          <span className="block w-8 h-px" style={{ backgroundColor: "#B8843A" }} />
          Creative Studio · België
        </motion.p>

        {/* Giant headline */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7.8vw, 9rem)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "#FDFAF7",
            }}
          >
            Wij maken
            <br />
            <em style={{ fontStyle: "italic", color: "#B8843A" }}>premium</em>
            {" "}
            <span style={{ display: "inline-block", position: "relative" }}>
              <AnimatedWord word={WORDS[wordIdx]} />
            </span>
            <br />
            voor makelaars
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "1.1rem",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(253,250,247,0.52)",
            maxWidth: "460px",
            marginBottom: "3.5rem",
          }}
        >
          Van cinematic vastgoedvideo tot een website die converteert.
          Jouw creatieve partner in België.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72 }}
          className="flex flex-wrap gap-4 items-center"
          style={{ marginBottom: "5rem" }}
        >
          <motion.a
            href="/vastgoed-marketing"
            className="flex items-center gap-2 text-sm font-medium rounded-full cursor-pointer"
            style={{
              backgroundColor: "#B8843A",
              color: "#0A0A0A",
              padding: "1rem 2rem",
              fontFamily: "var(--font-dm-sans)",
            }}
            whileHover={{ backgroundColor: "#CFA05A", scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Vastgoed Marketing
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
          <motion.a
            href="/webdesign"
            className="flex items-center gap-2 text-sm font-medium rounded-full cursor-pointer"
            style={{
              border: "1px solid rgba(253,250,247,0.18)",
              color: "#FDFAF7",
              padding: "1rem 2rem",
              fontFamily: "var(--font-dm-sans)",
            }}
            whileHover={{ borderColor: "rgba(184,132,58,0.55)", color: "#B8843A", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Webdesign
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-wrap gap-10 sm:gap-16"
          style={{ borderTop: "1px solid rgba(253,250,247,0.07)", paddingTop: "2rem" }}
        >
          {[
            { num: "50+", label: "Panden gefilmd" },
            { num: "3", label: "Jaar ervaring" },
            { num: "2", label: "Services" },
          ].map(({ num, label }) => (
            <div key={label}>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: 400,
                  color: "#B8843A",
                  lineHeight: 1,
                }}
              >
                {num}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.72rem",
                  color: "rgba(253,250,247,0.38)",
                  marginTop: "0.35rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div
          className="w-px h-14 overflow-hidden"
          style={{ backgroundColor: "rgba(184,132,58,0.15)" }}
        >
          <motion.div
            className="w-full"
            style={{ height: "50%", backgroundColor: "#B8843A" }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
