"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

export default function Showcase() {
  return (
    <section id="showcase" className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "75vh", backgroundColor: "var(--black)" }}>
      <div style={{ padding: "clamp(4rem,10vh,7rem) clamp(1.5rem,6vw,5rem)" }} className="flex flex-col justify-center">
        <AnimateIn>
          <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--cream-muted)" }}>
            Resultaat
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.75rem, 6vw, 4.75rem)", fontWeight: 300, lineHeight: 1.1, letterSpacing: 0, color: "var(--cream)" }}>
            Zo ziet jouw<br /><em style={{ color: "var(--cream-muted)" }}>content eruit</em>
          </h2>
        </AnimateIn>
        <AnimateIn delay={0.2}>
          <p className="text-sm font-light leading-relaxed mb-10" style={{ color: "var(--cream-muted)", maxWidth: "380px" }}>
            Verticale video&apos;s geoptimaliseerd voor Reels en TikTok — cinematic, strak en op maat van jouw merk. Vraag een gratis demo-edit aan en oordeel zelf.
          </p>
        </AnimateIn>
        <AnimateIn delay={0.3}>
          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Gratis%20demo-edit%20aanvraag"
            className="w-fit text-sm font-medium rounded-[2px] px-8 py-4"
            style={{ backgroundColor: "var(--gold)", color: "var(--black)" }}
            whileHover={{ backgroundColor: "var(--gold-light)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Gratis demo-edit aanvragen
          </motion.a>
        </AnimateIn>
      </div>

      <div
        className="flex items-center justify-center relative"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, var(--panel), var(--black))", padding: "clamp(3rem,6vh,5rem)" }}
      >
        <AnimateIn direction="right">
          <motion.div
            style={{
              width: "clamp(180px,22vw,240px)",
              borderRadius: "36px",
              overflow: "hidden",
              aspectRatio: "9/19.5",
              backgroundColor: "#000",
              boxShadow: "0 50px 100px rgba(0,0,0,0.5), 0 0 0 7px rgba(255,255,255,0.06)",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          >
            <video
              src="/videos/web/summum-nl.mp4"
              poster="/videos/web/summum-nl.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimateIn>
      </div>
    </section>
  );
}
