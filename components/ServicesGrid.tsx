"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: EASE },
  }),
};

function ServiceCard({
  href,
  tag,
  title,
  description,
  cta,
  index,
  accent,
  bullets,
}: {
  href: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  index: number;
  accent: string;
  bullets: string[];
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative flex flex-col justify-between overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "clamp(1.75rem, 4vw, 2.5rem)",
        minHeight: "420px",
      }}
      whileHover={{ borderColor: "rgba(184,132,58,0.3)", backgroundColor: "#131313" }}
      transition={{ duration: 0.3 }}
    >
      {/* Full-card click target */}
      <Link href={href} className="absolute inset-0 z-20" aria-label={cta} />
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at 30% 40%, rgba(184,132,58,0.06) 0%, transparent 70%)`,
          borderRadius: "20px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Tag */}
        <div className="flex items-center justify-between mb-8">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: accent,
              border: `1px solid ${accent}33`,
              borderRadius: "100px",
              padding: "0.35rem 0.85rem",
            }}
          >
            {tag}
          </span>
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            whileHover={{ borderColor: accent, backgroundColor: `${accent}15` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </motion.div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: "#FDFAF7",
            marginBottom: "1rem",
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.9rem",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "rgba(253,250,247,0.48)",
            marginBottom: "2rem",
            maxWidth: "340px",
          }}
        >
          {description}
        </p>

        {/* Bullets */}
        <ul className="flex flex-col gap-2 mb-8">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.8rem",
                color: "rgba(253,250,247,0.55)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA link */}
      <Link
        href={href}
        className="relative z-10 flex items-center gap-2 w-fit"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.82rem",
          fontWeight: 500,
          color: accent,
          textDecoration: "none",
          borderBottom: `1px solid ${accent}44`,
          paddingBottom: "2px",
        }}
      >
        {cta}
        <motion.svg
          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </Link>
    </motion.div>
  );
}

function StatCard({ num, label, index }: { num: string; label: string; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="flex flex-col justify-center"
      style={{
        backgroundColor: "#111111",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "20px",
        padding: "2rem 2.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2.5rem, 4vw, 4rem)",
          fontWeight: 400,
          color: "#B8843A",
          lineHeight: 1,
          marginBottom: "0.4rem",
        }}
      >
        {num}
      </p>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "0.72rem",
          color: "rgba(253,250,247,0.38)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      style={{ backgroundColor: "#0A0A0A", padding: "8rem clamp(1.5rem, 6vw, 6rem)" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p
            className="flex items-center gap-3 mb-4"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.68rem",
              fontWeight: 500,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#B8843A",
            }}
          >
            <span className="w-6 h-px" style={{ backgroundColor: "#B8843A" }} />
            Wat we doen
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2rem, 4vw, 4rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#FDFAF7",
              maxWidth: "520px",
            }}
          >
            Twee diensten,
            <br />
            <em style={{ color: "#B8843A", fontStyle: "italic" }}>één visie</em>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Service 1 — Vastgoed Marketing */}
            <ServiceCard
              href="/vastgoed-marketing"
              tag="Video · Social"
              title={"Vastgoed\nMarketing"}
              description="Cinematic short-form video die jouw panden in de kijker zet op Instagram, TikTok en LinkedIn. Meer viewings, sneller verkopen."
              cta="Ontdek vastgoed marketing"
              index={0}
              accent="#B8843A"
              bullets={["Instagram Reels & TikTok", "Gratis demo-edit"]}
            />

            {/* Service 2 — Webdesign */}
            <ServiceCard
              href="/webdesign"
              tag="Next.js · SEO · CMS"
              title={"Webdesign voor\nmakelaars"}
              description="Snelle, SEO-geoptimaliseerde websites op maat. Van een krachtige landing page tot een volledige site met blog en CMS."
              cta="Ontdek webdesign"
              index={1}
              accent="#9E7FBF"
              bullets={["Op maat gebouwd", "SEO + Google Analytics", "Levering binnen 2 weken"]}
            />
          </div>

          {/* Stat cards row */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mt-4">
            <StatCard num="50+" label="Panden gefilmd" index={2} />
            <StatCard num="3jr" label="Ervaring" index={3} />
            <StatCard num="100%" label="Op maat" index={4} />
          </div>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(253,250,247,0.25)",
            marginTop: "4rem",
            textAlign: "center",
          }}
        >
          &ldquo;Eén aanspreekpunt voor video én web — dat is het SteylVisuals verschil.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
