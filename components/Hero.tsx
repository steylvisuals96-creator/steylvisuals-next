"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
  return (
    <section
      className="min-h-svh grid items-center gap-16 pt-24 pb-16"
      style={{
        backgroundColor: "var(--beige)",
        gridTemplateColumns: "1fr 1fr",
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
          Cinematic real estate video
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
          Short-form video die jouw panden in de kijker zet op Instagram,
          TikTok en LinkedIn. Professioneel gemaakt, voor makelaars die meer
          viewings willen.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex items-center gap-6 flex-wrap"
        >
          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Gratis%20demo-edit%20aanvraag"
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

      {/* Right — Phone mockup */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex justify-center items-center relative"
      >
        <div className="relative">
          {/* Phone */}
          <motion.div
            className="relative overflow-hidden"
            style={{
              width: "clamp(200px, 22vw, 280px)",
              borderRadius: "40px",
              aspectRatio: "9/19.5",
              backgroundColor: "#000",
              boxShadow: "0 50px 100px rgba(28,14,7,0.18), 0 0 0 8px rgba(255,255,255,0.7), 0 0 0 9px #E8DFD5",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <iframe
              src="https://player.vimeo.com/video/1197526438?autoplay=1&loop=1&muted=1&background=1&controls=0"
              className="w-full h-full"
              style={{ border: "none", objectFit: "cover", transform: "scale(1.5)" }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </motion.div>

          {/* Badge 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -left-12 top-1/4 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-lg"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--dark)" }}>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--dark)" }}>Reels &amp; TikTok</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Geoptimaliseerd</p>
            </div>
          </motion.div>

          {/* Badge 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-3 flex items-center gap-3 shadow-lg"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--dark)" }}>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--dark)" }}>Drone shots</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Groei pakket</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
