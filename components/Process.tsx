"use client";

import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";

const steps = [
  { num: "001", title: "Gratis demo-edit", desc: "Stuur ruwe footage — ik edit gratis een Reel zodat je de kwaliteit ziet. Zonder verplichting." },
  { num: "002", title: "Kennismakingsgesprek", desc: "We bespreken jouw stijl, doelen en welk pakket het best past bij jouw project." },
  { num: "003", title: "Filmen of bouwen", desc: "Ik kom ter plaatse voor een shoot, of we starten meteen met de ontwikkeling van jouw website." },
  { num: "004", title: "Montage & levering", desc: "Ik edit, kleurgrade en lever binnen 1 week kant-en-klare content of een live website op." },
  { num: "005", title: "Meer resultaat", desc: "Jij post, deelt en ziet hoe jouw merk meer aandacht krijgt op social media en online." },
];

export default function Process() {
  return (
    <section id="process" className="py-24" style={{ backgroundColor: "var(--off-white)", padding: "clamp(5rem,10vh,8rem) 0 0" }}>
      <div style={{ padding: "0 clamp(1.5rem,6vw,5rem)", marginBottom: "clamp(3rem,6vh,5rem)" }}>
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
          <div>
            <AnimateIn>
              <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
                <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
                Werkwijze
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
                Van eerste contact<br /><em style={{ color: "var(--muted)" }}>tot live content</em>
              </h2>
            </AnimateIn>
          </div>
          <AnimateIn delay={0.2} className="flex items-end">
            <p className="text-sm font-light leading-relaxed" style={{ color: "var(--muted)", maxWidth: "380px" }}>
              In vijf eenvoudige stappen zet ik jouw project om in content of een website die écht resultaat oplevert.
            </p>
          </AnimateIn>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--beige-mid)" }}>
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ backgroundColor: "var(--beige)" }}
            className="grid items-start border-b transition-colors cursor-default"
            style={{
              gridTemplateColumns: "clamp(4rem,8vw,7rem) 1fr auto",
              gap: "0 2rem",
              padding: "clamp(1.75rem,3.5vh,3rem) clamp(1.5rem,6vw,5rem)",
              borderColor: "var(--beige-mid)",
            }}
          >
            <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem,4.5vw,4rem)", fontWeight: 300, lineHeight: 1, color: "var(--beige-deep)", letterSpacing: "-0.03em" }}>
              {step.num}
            </span>
            <div>
              <h3 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.2rem,2.2vw,1.6rem)", fontWeight: 500, color: "var(--dark)" }}>
                {step.title}
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--muted)", maxWidth: "480px" }}>
                {step.desc}
              </p>
            </div>
            <motion.span
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "var(--beige-deep)", alignSelf: "center" }}
              whileHover={{ x: 4, color: "var(--gold)" }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
