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
  items,
}: {
  href: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  index: number;
  items: string[];
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="service-card group relative flex flex-col justify-between"
      style={{
        backgroundColor: "var(--panel)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-md)",
        padding: "clamp(1.75rem, 4vw, 2.5rem)",
        minHeight: "420px",
      }}
    >
      {/* Full-card click target */}
      <Link href={href} className="absolute inset-0 z-20" aria-label={cta} />

      <div className="relative z-10">
        <p
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "var(--cream-muted)",
            marginBottom: "2rem",
          }}
        >
          {tag}
        </p>

        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: 0,
            color: "var(--cream)",
            marginBottom: "1rem",
            whiteSpace: "pre-line",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.7,
            color: "var(--cream-muted)",
            marginBottom: "2rem",
            maxWidth: "38ch",
          }}
        >
          {description}
        </p>

        {/* Hairline-separated list — no bullet dots, no icons. */}
        <ul style={{ borderTop: "1px solid var(--hairline)" }}>
          {items.map((b) => (
            <li
              key={b}
              style={{
                fontFamily: "var(--font-poppins)",
                fontSize: "1rem",
                color: "var(--cream-muted)",
                borderBottom: "1px solid var(--hairline)",
                padding: "0.75rem 0",
              }}
            >
              {b}
            </li>
          ))}
        </ul>
      </div>

      <span
        className="service-cta relative z-10 w-fit"
        style={{
          fontFamily: "var(--font-poppins)",
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--cream)",
          borderBottom: "1px solid var(--hairline-strong)",
          paddingBottom: "6px",
          marginTop: "2.5rem",
        }}
      >
        {cta}
      </span>
    </motion.div>
  );
}

export default function ServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id="services"
      ref={ref}
      style={{ backgroundColor: "var(--black)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem, 6vw, 6rem)" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-14"
        >
          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "var(--cream-muted)",
              marginBottom: "1.25rem",
            }}
          >
            Twee diensten · één aanspreekpunt
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: 0,
              color: "var(--cream)",
              maxWidth: "520px",
            }}
          >
            Alles onder
            <br />
            <em style={{ fontStyle: "italic" }}>één dak</em>
          </h2>
        </motion.div>

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <ServiceCard
              href="/vastgoed-marketing"
              tag="Video · Reels · Brand"
              title={"Video &\nContent"}
              description="Van cinematic brand video tot social content die stopt met scrollen. Wij maken beelden die jouw verhaal vertellen en je publiek laten groeien."
              cta="Ontdek video & content"
              index={0}
              items={["Brand video & bedrijfsfilm", "Instagram Reels & TikTok", "Product & event video"]}
            />

            <ServiceCard
              href="/webdesign"
              tag="Next.js · SEO · CMS"
              title={"Webdesign &\nDigital"}
              description="Snelle, op maat gebouwde websites die converteren. Van een krachtige landing page tot een volledige site met admin en CMS."
              cta="Ontdek webdesign"
              index={1}
              items={["Op maat voor jouw business", "SEO + Google Analytics", "Levering binnen 2 weken"]}
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.15,
            color: "var(--cream-muted)",
            marginTop: "5rem",
            maxWidth: "24ch",
          }}
        >
          Eén creatief aanspreekpunt voor video, content én web.
        </motion.p>
      </div>
    </section>
  );
}
