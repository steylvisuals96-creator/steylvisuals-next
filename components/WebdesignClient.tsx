"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
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

function FeatureIcon({ name }: { name: string }) {
  return (
    <span
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: "rgba(184,132,58,0.1)", border: "1px solid rgba(184,132,58,0.2)" }}
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

function BrowserMockup() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ borderRadius: "16px", border: "1px solid rgba(184,132,58,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(184,132,58,0.06)" }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-4"
        style={{ height: "40px", backgroundColor: "#161616", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
        <div
          className="flex-1 mx-3 flex items-center px-3 gap-2"
          style={{ height: "24px", backgroundColor: "#0A0A0A", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
          <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-dm-sans)" }}>steylvisuals.be</span>
        </div>
      </div>
      {/* Simulated site content */}
      <div style={{ backgroundColor: "#1C0E07", padding: "2rem 1.5rem" }}>
        <div className="flex justify-between items-center mb-6">
          <div style={{ width: "60px", height: "10px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.7)" }} />
          <div className="flex gap-2 items-center">
            <div className="hidden sm:flex gap-2">
              {[40, 55, 40].map((w, i) => (
                <div key={i} style={{ width: `${w}px`, height: "8px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.2)" }} />
              ))}
            </div>
            <div style={{ width: "56px", height: "26px", borderRadius: "100px", backgroundColor: "#B8843A" }} />
          </div>
        </div>
        <div className="mb-4">
          <div style={{ width: "55%", height: "22px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.8)", marginBottom: "10px" }} />
          <div style={{ width: "70%", height: "32px", borderRadius: "4px", backgroundColor: "#B8843A", marginBottom: "10px" }} />
          <div style={{ width: "60%", height: "22px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.8)", marginBottom: "16px" }} />
          <div style={{ width: "80%", height: "10px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.2)", marginBottom: "6px" }} />
          <div style={{ width: "65%", height: "10px", borderRadius: "4px", backgroundColor: "rgba(242,237,232,0.15)", marginBottom: "20px" }} />
          <div className="flex gap-3">
            <div style={{ width: "130px", height: "40px", borderRadius: "100px", backgroundColor: "#B8843A" }} />
            <div style={{ width: "100px", height: "40px", borderRadius: "100px", backgroundColor: "rgba(242,237,232,0.08)", border: "1px solid rgba(242,237,232,0.15)" }} />
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#0A0A0A", padding: "1.5rem" }}>
        <div className="grid grid-cols-3 gap-3">
          {["#1a1a1a", "#141414", "#1a1a1a"].map((bg, i) => (
            <div key={i} style={{ backgroundColor: bg, borderRadius: "10px", padding: "0.75rem", border: "1px solid rgba(184,132,58,0.1)" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "6px", backgroundColor: "rgba(184,132,58,0.15)", marginBottom: "8px" }} />
              <div style={{ width: "70%", height: "8px", borderRadius: "3px", backgroundColor: "rgba(255,255,255,0.3)", marginBottom: "5px" }} />
              <div style={{ width: "90%", height: "6px", borderRadius: "3px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
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
    fontSize: "16px", // prevents iOS zoom on focus
  };

  return (
    <section id="webdesign-contact" style={{ backgroundColor: "#0A0A0A", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.1)" }}>
      <div className="max-w-[1100px] mx-auto grid gap-16 grid-cols-1 md:grid-cols-2" style={{ alignItems: "start" }}>
        <div>
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "#B8843A" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              Jouw project bespreken
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
              Klaar om op te<br /><em style={{ color: "#B8843A" }}>vallen?</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(253,250,247,0.5)", maxWidth: "360px" }}>
              Ik werk project per project — geen vaste pakketten, maar een offerte op maat. Stuur de details en ik reageer binnen 24u.
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
                  <input type="text" name="naam" required placeholder="Jouw naam" className="text-sm font-light" style={inputStyle} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Bedrijf</label>
                  <input type="text" name="bedrijf" placeholder="Jouw kantoor / bedrijf" className="text-sm font-light" style={inputStyle} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>E-mail</label>
                <input type="email" name="_replyto" required placeholder="jouw@email.be" className="text-sm font-light" style={inputStyle} />
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Type project</label>
                  <select name="type_project" className="text-sm font-light cursor-pointer" style={{ ...inputStyle, color: "rgba(253,250,247,0.6)", appearance: "none" as const }}>
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
                  <select name="budget" className="text-sm font-light cursor-pointer" style={{ ...inputStyle, color: "rgba(253,250,247,0.6)", appearance: "none" as const }}>
                    <option value="">Geen voorkeur</option>
                    <option value="€500 – €1.000">€500 – €1.000</option>
                    <option value="€1.000 – €2.000">€1.000 – €2.000</option>
                    <option value="€2.000 – €4.000">€2.000 – €4.000</option>
                    <option value="€4.000+">€4.000+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(253,250,247,0.4)" }}>Vertel me over jouw project</label>
                <textarea name="bericht" rows={4} required placeholder="Wat heb je nodig? Wat is het doel van de site?" className="text-sm font-light resize-none" style={inputStyle} />
              </div>

              <motion.button type="submit" disabled={loading} className="text-sm font-medium rounded-full py-3.5 mt-2 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A", opacity: loading ? 0.6 : 1 }}
                whileHover={{ backgroundColor: "#CFA05A", scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                {loading ? "Versturen..." : "Stuur mijn projectinfo door"}
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
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0A0A0A", padding: "calc(72px + 3rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,8vh,6rem)" }}
      >
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" aria-hidden="true" style={{ inset: 0, background: "radial-gradient(ellipse 70% 60% at 60% 0%, rgba(184,132,58,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-8"
              style={{ color: "#B8843A" }}
            >
              <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              Webdesign voor makelaars
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: EASE }}
              className="mb-6"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,5.5vw,5.5rem)", fontWeight: 400, lineHeight: 1.02, letterSpacing: "-0.02em", color: "#FDFAF7" }}
            >
              Een website die<br />
              <em style={{ color: "#B8843A" }}>klanten aantrekt</em><br />
              terwijl jij slaapt
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="text-base font-light leading-relaxed mb-10"
              style={{ color: "rgba(253,250,247,0.5)", maxWidth: "420px" }}
            >
              Geen templates, geen compromissen. Elke site wordt volledig op maat gebouwd — razendsnel, mobielvriendelijk en gebouwd om te converteren.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
            >
              <motion.a
                href="#webdesign-contact"
                className="text-sm font-medium rounded-full px-8 py-4 cursor-pointer text-center"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Bespreek jouw project
              </motion.a>
              <motion.a
                href="#werkwijze"
                className="text-sm font-normal cursor-pointer flex items-center justify-center sm:justify-start gap-2 py-2"
                style={{ color: "rgba(253,250,247,0.5)" }}
                whileHover={{ color: "#FDFAF7" }}
                transition={{ duration: 0.2 }}
              >
                Hoe werkt het?
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Right — browser mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            style={{ y: mockupY }}
          >
            <BrowserMockup />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ backgroundColor: "#111", padding: "3.5rem clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.1)", borderBottom: "1px solid rgba(184,132,58,0.1)" }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-4 sm:gap-10 text-center">
          {[
            { value: 100, suffix: "%", label: "Op maat gebouwd — geen templates" },
            { value: 48, suffix: "u", label: "Eerste voorstel in jouw inbox" },
            { value: 3, suffix: "×", label: "Meer leads via een professionele site" },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,5vw,4rem)", fontWeight: 300, color: "#B8843A", lineHeight: 1 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs font-light" style={{ color: "rgba(253,250,247,0.4)", maxWidth: "180px", margin: "0.5rem auto 0" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WAT JE KRIJGT ── */}
      <section style={{ backgroundColor: "#0A0A0A", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="max-w-[1100px] mx-auto">
          <AnimateIn>
            <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "#B8843A" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              Wat je krijgt
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-14" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7", maxWidth: "560px" }}>
              Meer dan een website —<br /><em style={{ color: "rgba(253,250,247,0.35)" }}>een verkoopsmachine</em>
            </h2>
          </AnimateIn>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "zap", title: "Razendsnel", desc: "Gebouwd met Next.js — de snelste technologie beschikbaar. Google beloont snelle sites met hogere rankings." },
              { icon: "smartphone", title: "Mobiel-first", desc: "70% van je bezoekers komt via smartphone. Jouw site ziet er op elk scherm perfect uit." },
              { icon: "search", title: "SEO inbegrepen", desc: "Technische SEO, meta tags, sitemap — alles opgezet zodat makelaars jou vinden via Google." },
              { icon: "edit", title: "Zelf beheren", desc: "Via een eenvoudig CMS pas jij teksten, foto's en panden aan zonder technische kennis." },
              { icon: "palette", title: "Jouw stijl", desc: "Geen kant-en-klare templates. Elke site volledig op maat ontworpen passend bij jouw merk." },
              { icon: "video", title: "Video-ready", desc: "Combineer met je video content voor maximaal effect. Website + Reels = onverslaanbare combo." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
                className="flex flex-col gap-4 p-6"
                style={{ backgroundColor: "#111", borderRadius: "16px", border: "1px solid rgba(184,132,58,0.1)" }}
              >
                <FeatureIcon name={item.icon} />
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: "#FDFAF7" }}>{item.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.45)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WERKWIJZE ── */}
      <section id="werkwijze" style={{ backgroundColor: "#0D0D0D", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)", borderTop: "1px solid rgba(184,132,58,0.08)" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <AnimateIn>
              <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "#B8843A" }}>
                <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
                Hoe werkt het
                <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
                Van idee tot<br /><em style={{ color: "#B8843A" }}>live website</em>
              </h2>
            </AnimateIn>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Brief", desc: "Jij stuurt de details via het formulier. Type site, doel, stijl, deadline — alles wat relevant is." },
              { step: "02", title: "Offerte", desc: "Binnen 24u ontvang je een offerte op maat. De kost hangt af van de complexiteit en omvang." },
              { step: "03", title: "Design & bouw", desc: "Na akkoord ga ik aan de slag. Je volgt het proces via een live preview en geeft feedback." },
              { step: "04", title: "Oplevering", desc: "De site gaat live. Hosting, CMS, domein — alles geregeld en uitgelegd. Klaar om te scoren." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="flex flex-col gap-4 p-7"
                style={{ backgroundColor: "#111", borderRadius: "20px", border: "1px solid rgba(184,132,58,0.1)" }}
              >
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "3.5rem", fontWeight: 300, color: "rgba(184,132,58,0.25)", lineHeight: 1 }}>
                  {item.step}
                </span>
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: "#FDFAF7" }}>{item.title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(253,250,247,0.4)" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <AnimateIn delay={0.4}>
            <div className="flex justify-center mt-12">
              <motion.a
                href="#webdesign-contact"
                className="text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Stuur jouw brief
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
              <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#B8843A" }}>
                <span className="w-4 h-px" style={{ backgroundColor: "#B8843A" }} />
                De ultieme combinatie
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FDFAF7" }}>
                Website én video —<br /><em style={{ color: "rgba(242,237,232,0.35)" }}>één partner, één visie</em>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(242,237,232,0.45)", maxWidth: "420px" }}>
                Geen twee leveranciers, geen miscommunicatie. Jij krijgt een professionele website die perfect aansluit op jouw social media content — alles in dezelfde stijl.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <div className="flex flex-col gap-3 mb-10">
                {["Website op maat gebouwd", "Maandelijkse video content voor social", "SEO + content strategie", "Één aanspreekpunt voor alles"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "rgba(242,237,232,0.6)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8843A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={0.4}>
              <motion.a
                href="#webdesign-contact"
                className="inline-block text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
                style={{ backgroundColor: "#B8843A", color: "#0A0A0A" }}
                whileHover={{ backgroundColor: "#CFA05A", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Bespreek de combo
              </motion.a>
            </AnimateIn>
          </div>

          <AnimateIn direction="right">
            <div className="flex flex-col gap-4 p-5 sm:p-8" style={{ backgroundColor: "rgba(184,132,58,0.04)", borderRadius: "24px", border: "1px solid rgba(184,132,58,0.15)" }}>
              {[
                { label: "Website", icon: "globe", desc: "Op maat, SEO-klaar, CMS inbegrepen" },
                { label: "Video content", icon: "video", desc: "Maandelijkse Reels, TikTok & LinkedIn" },
                { label: "Strategie", icon: "trending", desc: "Één coherente visuele identiteit" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "14px", border: "1px solid rgba(184,132,58,0.1)" }}>
                  <FeatureIcon name={item.icon} />
                  <div>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.82rem", fontWeight: 500, color: "rgba(242,237,232,0.75)", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(242,237,232,0.35)" }}>{item.desc}</p>
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
