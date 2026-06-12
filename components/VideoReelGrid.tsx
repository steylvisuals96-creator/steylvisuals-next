"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export interface Reel {
  src: string;
  poster?: string;
  title: string;
  location?: string;
  tag: string;
}

/**
 * A single vertical (9:16) video card. The video is muted + looped and only
 * plays while it is actually on screen (IntersectionObserver), which keeps the
 * page light on mobile when several reels are mounted at once.
 */
function ReelCard({ reel, index }: { reel: Reel; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          el.play().catch(() => {});
          setActive(true);
        } else {
          el.pause();
          setActive(false);
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: EASE }}
      className="group flex flex-col"
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "9/16",
          borderRadius: "20px",
          backgroundColor: "#000",
          border: "1px solid rgba(184,132,58,0.14)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
        }}
      >
        <motion.video
          ref={videoRef}
          src={reel.src}
          poster={reel.poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: EASE }}
        />

        {/* Gradient veil for legibility of the bottom label */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          aria-hidden="true"
          style={{
            height: "45%",
            background: "linear-gradient(to top, rgba(10,10,10,0.85), transparent)",
          }}
        />

        {/* Tag pill */}
        <span
          className="absolute top-3 left-3"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.62rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#FDFAF7",
            backgroundColor: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(253,250,247,0.16)",
            borderRadius: "100px",
            padding: "0.3rem 0.7rem",
          }}
        >
          {reel.tag}
        </span>

        {/* Sound-off / live hint */}
        <span
          className="absolute top-3 right-3 flex items-center gap-1.5"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: active ? "#B8843A" : "rgba(253,250,247,0.5)",
            transition: "color 0.3s",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          {active ? "Speelt" : "Gedempt"}
        </span>

        {/* Bottom label inside the frame */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "1.45rem",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "#FDFAF7",
            }}
          >
            {reel.title}
          </h3>
          {reel.location && (
            <p
              className="flex items-center gap-1.5 mt-1"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.72rem",
                color: "rgba(253,250,247,0.65)",
              }}
            >
              <svg width="9" height="11" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z" />
              </svg>
              {reel.location}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function VideoReelGrid({ reels }: { reels: Reel[] }) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1100px] mx-auto">
      {reels.map((reel, i) => (
        <ReelCard key={reel.src} reel={reel} index={i} />
      ))}
    </div>
  );
}
