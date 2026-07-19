"use client";

import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import AnimateIn from "./AnimateIn";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ICONS: Record<string, React.ReactNode> = {
  zap: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  smartphone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  edit: (
    <>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </>
  ),
  video: (
    <>
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  trending: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
};

function FeatureIcon({ name, gold = false }: { name: string; gold?: boolean }) {
  return (
    <span
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor: gold ? "rgba(184,132,58,0.18)" : "rgba(184,132,58,0.08)",
        border: `1px solid ${gold ? "rgba(184,132,58,0.35)" : "rgba(184,132,58,0.15)"}`,
      }}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8843A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const inc = target / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* Specified website mockup — real client site preview */
function HeroVisual({ y }: { y: MotionValue<number> }) {
  const SB = "#161616"; // Specified dark bg
  const SW = "#ffffff";
  const SL = "#d4f132"; // Specified lime-green accent
  const SO = "#4a5228"; // Specified olive (decorative arcs)

  const SECTORS = ["Projectmanagement", "Civiele techniek", "Elektrotechniek", "Werktuigbouwkunde", "Bouw & infra"];

  return (
    <motion.div style={{ y }} className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: "20px",
          border: "1px solid rgba(212,241,50,0.18)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(212,241,50,0.05)",
          backgroundColor: SB,
        }}
        aria-label="Specified website — gebouwd door SteylVisuals"
        onClick={() => window.open("https://specified-website.vercel.app/", "_blank")}
      >
        {/* Browser chrome */}
        <div style={{ backgroundColor: "#1a1a1a", padding: "0.55rem 0.9rem", display: "flex", alignItems: "center", gap: "0.45rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#ff5f57" }} />
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#febc2e" }} />
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#28c840" }} />
          <div style={{ flex: 1, marginLeft: "0.4rem", backgroundColor: "#111", borderRadius: "5px", padding: "0.18rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/></svg>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.55rem", color: "rgba(255,255,255,0.22)" }}>specified-website.vercel.app</span>
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", backgroundColor: SB, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="14" height="10" viewBox="0 0 20 14" fill={SW} aria-hidden="true">
              <path d="M10 0L20 7H0L10 0Z" opacity="0.9"/>
              <rect x="3" y="7" width="14" height="7" rx="1" opacity="0.9"/>
            </svg>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.72rem", fontWeight: 800, color: SW, letterSpacing: "0.05em", textTransform: "uppercase" }}>SPECIFIED</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            {["Diensten", "Jobs", "Over ons", "Contact"].map(l => (
              <span key={l} style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.42rem", color: "rgba(255,255,255,0.5)" }}>{l}</span>
            ))}
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.42rem", backgroundColor: SL, color: SB, borderRadius: "20px", padding: "0.18rem 0.55rem", fontWeight: 700 }}>Neem contact op</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ position: "relative", backgroundColor: SB, padding: "1.2rem 1rem 0.8rem", overflow: "hidden" }}>
          {/* Decorative olive arcs */}
          <div aria-hidden="true" style={{ position: "absolute", top: "-20px", right: "-20px", width: "90px", height: "90px", borderRadius: "50%", border: `2px solid ${SO}`, opacity: 0.5 }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "80px", height: "80px", borderRadius: "50%", border: `2px solid ${SO}`, opacity: 0.35 }} />

          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.6rem", fontWeight: 900, color: "rgba(255,255,255,0.18)", lineHeight: 1, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "0.05rem" }}>
            WE
          </p>
          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.55rem", fontWeight: 900, color: "rgba(255,255,255,0.2)", lineHeight: 1, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
            POSSIBILITIES.
          </p>

          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.4rem", color: "rgba(255,255,255,0.45)", maxWidth: "65%", lineHeight: 1.6, marginBottom: "0.7rem" }}>
            Specified verbindt technische toptalenten met ambitieuze ingenieursbureaus en industriële bedrijven.
          </p>

          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.9rem" }}>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.4rem", backgroundColor: SL, color: SB, borderRadius: "20px", padding: "0.2rem 0.6rem", fontWeight: 700 }}>Bekijk vacatures</span>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.4rem", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", padding: "0.2rem 0.6rem" }}>Neem contact op</span>
          </div>
        </div>

        {/* Sector ticker */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0.4rem 0", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "1.5rem", whiteSpace: "nowrap" }}>
            {[...SECTORS, ...SECTORS].map((s, i) => (
              <span key={i} style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.38rem", fontWeight: 600, color: i % 2 === 0 ? SW : "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
                {s}
                {i < SECTORS.length * 2 - 1 && <span style={{ color: SL, marginLeft: "1.5rem" }}>·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", backgroundColor: SB, padding: "0.7rem 1rem", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {[["0+", "Plaatsingen gedaan"], ["15+", "Sectoren"], ["100%", "Op maat"]].map(([n, l]) => (
            <div key={l} style={{ flex: 1, textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", fontWeight: 800, color: SL, lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</p>
              <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.36rem", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{ padding: "0.45rem 0.9rem", backgroundColor: "#1a1a1a", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "0.45rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.52rem", color: "rgba(255,255,255,0.35)" }}>specified-website.vercel.app — Gebouwd door SteylVisuals</span>
        </div>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
        className="hidden lg:block absolute"
        style={{
          top: "2.5rem",
          right: "-1.75rem",
          backgroundColor: "#111",
          border: "1px solid rgba(212,241,50,0.22)",
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.8rem", fontWeight: 900, color: SL, lineHeight: 1 }}>100%</p>
        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.62rem", color: "rgba(253,250,247,0.4)", marginTop: "4px", letterSpacing: "0.06em" }}>op maat</p>
      </motion.div>
    </motion.div>
  );
}

function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    await fetch("https://formsubmit.co/steylvisuals96@gmail.com", {
      method: "POST",
      body: data,
    });
    setLoading(false);
    setSubmitted(true);
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#FDFAF7",
    outline: "none",
    fontSize: "16px",
  };

  return (
    <section
      id="webdesign-contact"
      style={{ backgroundColor: "#0A0A0A", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.1)" }}
    >
      <div className="max-w-[1100px] mx-auto grid gap-16 grid-cols-1 md:grid-cols-2" style={{ alignItems: "start" }}>
        <div>
          {/* Eyebrow #2 (and final) */}
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "#B8843A" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              Jouw project
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
              Klaar om op te<br /><em style={{ color: "#B8843A" }}>vallen?</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(253,250,247,0.5)", maxWidth: "360px" }}>
              Ik werk project per project, zonder vaste pakketten. Stuur de details en ik reageer binnen 24u met een offerte op maat.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="flex flex-col gap-3">
              {["Vrijblijvend voorstel", "Reactie binnen 24 uur", "Offerte op maat"].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "rgba(253,250,247,0.55)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8843A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.15}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center gap-4 py-16"
              style={{ backgroundColor: "rgba(184,132,58,0.06)", borderRadius: "20px", border: "1px solid rgba(184,132,58,0.2)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8843A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 400, color: "#FDFAF7" }}>Aanvraag ontvangen!</h3>
              <p className="text-sm font-light" style={{ color: "rgba(253,250,247,0.5)" }}>Ik neem binnen 24 uur contact met je op.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="Nieuwe webdesign aanvraag via SteylVisuals" />
              <input type="hidden" name="_autoresponse" value="Bedankt voor je interesse in SteylVisuals! Ik heb je webdesign aanvraag goed ontvangen en neem binnen 24 uur persoonlijk contact met je op. Tot snel, Sam Steylaerts | SteylVisuals" />

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Naam</label>
                  <input type="text" name="naam" required placeholder="Jouw naam" className="font-light" style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Bedrijf</label>
                  <input type="text" name="bedrijf" placeholder="Jouw kantoor / bedrijf" className="font-light" style={inputStyle} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>E-mail</label>
                <input type="email" name="_replyto" required placeholder="jouw@email.be" className="font-light" style={inputStyle} />
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Type project</label>
                  <select name="type_project" className="cursor-pointer font-light" style={{ ...inputStyle, color: "rgba(253,250,247,0.6)", appearance: "none" as const }}>
                    <option value="">Kies een type</option>
                    <option value="Landing page">Landing page</option>
                    <option value="Volledige website">Volledige website</option>
                    <option value="Redesign bestaande site">Redesign bestaande site</option>
                    <option value="Website + video combo">Website + video combo</option>
                    <option value="Iets anders">Iets anders</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Budget (optioneel)</label>
                  <select name="budget" className="cursor-pointer font-light" style={{ ...inputStyle, color: "rgba(253,250,247,0.6)", appearance: "none" as const }}>
                    <option value="">Geen voorkeur</option>
                    <option value="€500 - €1.000">€500 - €1.000</option>
                    <option value="€1.000 - €2.000">€1.000 - €2.000</option>
                    <option value="€2.000 - €4.000">€2.000 - €4.000</option>
                    <option value="€4.000+">€4.000+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Vertel me over jouw project</label>
                <textarea name="bericht" rows={4} required placeholder="Wat heb je nodig? Wat is het doel van de site?" className="font-light resize-none" style={inputStyle} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="text-sm font-medium rounded-full py-4 mt-2 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A", opacity: loading ? 0.6 : 1 }}
                whileHover={{ backgroundColor: "#CFA05A" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? "Versturen..." : "Vraag offerte aan"}
              </motion.button>
            </form>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}

export default function WebdesignClient() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0A0A0A", padding: "calc(72px + 2.5rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,8vh,6rem)" }}
      >
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{ inset: 0, background: "radial-gradient(ellipse 65% 55% at 65% -5%, rgba(184,132,58,0.09) 0%, transparent 65%)" }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            {/* Eyebrow #1 */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-8"
              style={{ color: "#B8843A" }}
            >
              <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              Webdesign voor bedrijven
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              className="mb-6"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.8rem,5vw,5.2rem)",
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                color: "#FDFAF7",
              }}
            >
              Een website die<br />
              <em style={{ color: "#B8843A" }}>klanten aantrekt</em><br />
              terwijl jij slaapt
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
              className="text-base font-light leading-relaxed mb-10"
              style={{ color: "rgba(253,250,247,0.48)", maxWidth: "400px" }}
            >
              Geen templates, geen compromissen. Elke site volledig op maat gebouwd, razendsnel en gemaakt om te converteren.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: EASE }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <motion.a
                href="#webdesign-contact"
                className="text-sm font-medium rounded-full px-8 py-4 cursor-pointer text-center"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Vraag offerte aan
              </motion.a>
              <motion.a
                href="#werkwijze"
                className="text-sm font-normal cursor-pointer flex items-center justify-center sm:justify-start gap-2 py-2"
                style={{ color: "rgba(253,250,247,0.45)" }}
                whileHover={{ color: "#FDFAF7" }}
                transition={{ duration: 0.2 }}
              >
                Hoe werkt het?
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right: real photo */}
          <HeroVisual y={mockupY} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#111", padding: "3rem clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.1)", borderBottom: "1px solid rgba(184,132,58,0.1)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-4 sm:gap-10 text-center">
          {[
            { value: 100, suffix: "%", label: "Op maat gebouwd" },
            { value: 48, suffix: "u", label: "Eerste voorstel in jouw inbox" },
            { value: 3, suffix: "x", label: "Meer leads via jouw site" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,5vw,4rem)", fontWeight: 300, color: "#B8843A", lineHeight: 1 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(0.6rem,1.2vw,0.75rem)", color: "rgba(253,250,247,0.35)", maxWidth: "140px", margin: "0.5rem auto 0" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES: asymmetrische bento ── */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="max-w-[1100px] mx-auto">
          <AnimateIn>
            <h2 className="mb-12" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7", maxWidth: "560px" }}>
              Meer dan een website,<br /><em style={{ color: "rgba(253,250,247,0.3)" }}>een verkoopsmachine</em>
            </h2>
          </AnimateIn>

          {/* Bento: 3-col grid, varied spans */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">

            {/* Row 1: Big (2) + Small (1) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="sm:col-span-2 flex flex-col gap-4 p-7 sm:p-9"
              style={{ backgroundColor: "#111", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.08)" }}
            >
              <FeatureIcon name="zap" />
              <div>
                <h3 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: "#FDFAF7" }}>Razendsnel geladen</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)", maxWidth: "420px" }}>
                  Gebouwd met Next.js, de snelste webtechnologie beschikbaar. Google beloont snelle sites met hogere rankings en meer klikken.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.07, ease: EASE }}
              className="flex flex-col justify-between gap-6 p-7"
              style={{ backgroundColor: "rgba(184,132,58,0.07)", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.2)" }}
            >
              <FeatureIcon name="smartphone" gold />
              <div>
                <h3 className="mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: "#FDFAF7" }}>Mobiel-first</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)" }}>
                  70% van je bezoekers komt via smartphone. Perfect op elk scherm.
                </p>
              </div>
            </motion.div>

            {/* Row 2: Small (1) + Big (2) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="flex flex-col justify-between gap-6 p-7"
              style={{ backgroundColor: "rgba(184,132,58,0.05)", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.18)" }}
            >
              <FeatureIcon name="search" gold />
              <div>
                <h3 className="mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: "#FDFAF7" }}>SEO inbegrepen</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)" }}>
                  Technische SEO, meta tags en sitemap. Klanten vinden jou via Google.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
              className="sm:col-span-2 flex flex-col gap-4 p-7 sm:p-9"
              style={{ backgroundColor: "#161616", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.08)" }}
            >
              <FeatureIcon name="palette" />
              <div>
                <h3 className="mb-2" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: "#FDFAF7" }}>Jouw stijl, jouw merk</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)", maxWidth: "420px" }}>
                  Geen kant-en-klare templates. Elke site ontworpen op maat van jouw identiteit, kleurenpalet en doelgroep. Niet te verwarren met de buur.
                </p>
              </div>
            </motion.div>

            {/* Row 3: Medium (1) + Medium (2) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.17, ease: EASE }}
              className="flex flex-col justify-between gap-6 p-7"
              style={{ backgroundColor: "#111", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.08)" }}
            >
              <FeatureIcon name="edit" />
              <div>
                <h3 className="mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: "#FDFAF7" }}>Zelf beheren</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)" }}>
                  Via een eenvoudig CMS pas jij teksten en content aan zonder technische kennis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="sm:col-span-2 flex items-center gap-6 p-7 sm:p-9"
              style={{ backgroundColor: "#0D0D0D", borderRadius: "18px", border: "1px solid rgba(184,132,58,0.08)" }}
            >
              <FeatureIcon name="video" />
              <div>
                <h3 className="mb-1" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: "#FDFAF7" }}>Video-ready</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.42)", maxWidth: "380px" }}>
                  Combineer je website met maandelijkse Reels en TikTok content. Website + video is de sterkste combinatie.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── WERKWIJZE: numbered divider list, no cards ── */}
      <section
        id="werkwijze"
        style={{ backgroundColor: "#0D0D0D", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.08)" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <AnimateIn>
            <h2 className="mb-4" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
              Van idee tot <em style={{ color: "#B8843A" }}>live website</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-sm font-light mb-14" style={{ color: "rgba(253,250,247,0.38)" }}>Vier stappen, geen verrassingen.</p>
          </AnimateIn>

          <div style={{ borderTop: "1px solid rgba(184,132,58,0.1)" }}>
            {[
              { step: "01", title: "Brief", desc: "Jij stuurt de details via het formulier hieronder. Type site, doel, stijl en deadline. Alles wat relevant is." },
              { step: "02", title: "Offerte", desc: "Binnen 24u ontvang je een offerte op maat. De kost hangt af van de complexiteit en omvang van jouw project." },
              { step: "03", title: "Design & bouw", desc: "Na akkoord ga ik aan de slag. Je volgt het proces via een live preview en geeft feedback tussendoor." },
              { step: "04", title: "Oplevering", desc: "De site gaat live. Hosting, CMS en domein volledig geregeld en uitgelegd. Klaar om bezoekers te converteren." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.65, delay: i * 0.09, ease: EASE }}
                className="grid gap-6 md:gap-16 py-8 md:py-10"
                style={{
                  gridTemplateColumns: "4rem 1fr auto",
                  borderBottom: "1px solid rgba(184,132,58,0.08)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(2rem,4vw,3.5rem)",
                    fontWeight: 300,
                    color: "rgba(184,132,58,0.22)",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <h3 className="mb-1.5" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.3rem,2vw,1.65rem)", fontWeight: 500, color: "#FDFAF7" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.4)", maxWidth: "540px" }}>
                    {item.desc}
                  </p>
                </div>
                <span
                  className="hidden md:flex"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid rgba(184,132,58,0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(184,132,58,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </motion.div>
            ))}
          </div>

          <AnimateIn delay={0.3}>
            <div className="mt-12">
              <motion.a
                href="#webdesign-contact"
                className="inline-block text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Vraag offerte aan
              </motion.a>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMBO ── */}
      <section style={{ backgroundColor: "#1C0E07", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.15)" }}>
        <div className="max-w-[1100px] mx-auto grid gap-16 items-center grid-cols-1 md:grid-cols-2">
          <div>
            <AnimateIn>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
                Website en video,<br /><em style={{ color: "rgba(242,237,232,0.32)" }}>one stop shop</em>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(242,237,232,0.45)", maxWidth: "400px" }}>
                Geen twee leveranciers, geen miscommunicatie. Website en social content in dezelfde stijl, door dezelfde persoon.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div className="flex flex-col gap-3 mb-10">
                {["Website op maat gebouwd", "Maandelijkse video content voor social", "SEO plus content strategie", "Één aanspreekpunt voor alles"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "rgba(242,237,232,0.58)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8843A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <motion.a
                href="#webdesign-contact"
                className="inline-block text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Vraag offerte aan
              </motion.a>
            </AnimateIn>
          </div>

          <AnimateIn direction="right">
            <div className="flex flex-col gap-3 p-5 sm:p-8" style={{ backgroundColor: "rgba(184,132,58,0.04)", borderRadius: "24px", border: "1px solid rgba(184,132,58,0.14)" }}>
              {[
                { label: "Website", icon: "globe", desc: "Op maat, SEO-klaar, CMS inbegrepen" },
                { label: "Video content", icon: "video", desc: "Maandelijkse Reels, TikTok en LinkedIn" },
                { label: "Strategie", icon: "trending", desc: "Coherente visuele identiteit" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "14px", border: "1px solid rgba(184,132,58,0.1)" }}
                >
                  <FeatureIcon name={item.icon} />
                  <div>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.82rem", fontWeight: 500, color: "rgba(242,237,232,0.72)", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(242,237,232,0.33)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
