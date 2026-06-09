"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimateIn from "./AnimateIn";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const plans = [
  {
    tag: "Starter",
    name: "Landing\nPage",
    sub: "Eén krachtige pagina",
    price: "€749",
    featured: false,
    features: [
      "1 pagina op maat",
      "SEO-geoptimaliseerd",
      "Contactformulier",
      "Mobiel-vriendelijk",
      "Levering binnen 1 week",
    ],
  },
  {
    tag: "Meest gekozen",
    name: "Volledige\nWebsite",
    sub: "Meerdere pagina's + blog",
    price: "€1.699",
    featured: true,
    features: [
      "Tot 8 pagina's op maat",
      "SEO + Google Analytics",
      "Portfolio & blog sectie",
      "Contactformulier + CMS",
      "Levering binnen 2 weken",
    ],
  },
  {
    tag: "Combo deal",
    name: "Web +\nVideo",
    sub: "Website én maandelijkse video",
    price: "€1.999",
    featured: false,
    features: [
      "Volledige website inbegrepen",
      "6 video's per maand",
      "SEO + social media strategie",
      "Maandelijks opzegbaar",
      "Één aanspreekpunt",
    ],
  },
];

const projects = [
  {
    name: "SteylVisuals",
    type: "Landing page + Portfolio",
    tech: "Next.js · Framer Motion",
    color: "#1C0E07",
  },
  {
    name: "Jouw project",
    type: "Volledige website",
    tech: "Op maat gebouwd",
    color: "#2E1609",
  },
  {
    name: "Jouw project",
    type: "Landing page",
    tech: "SEO-geoptimaliseerd",
    color: "#3A1A08",
  },
];

function CheckIcon() {
  return (
    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
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

  return (
    <section id="webdesign-contact" style={{ backgroundColor: "var(--beige)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
        <div>
          <AnimateIn>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              Webdesign aanvragen
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Klaar voor een<br /><em style={{ color: "var(--muted)" }}>website die werkt?</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: "var(--muted)", maxWidth: "360px" }}>
              Vertel me over jouw kantoor en ik kom met een voorstel op maat. Gratis en vrijblijvend.
            </p>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.15}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center gap-4 py-16"
              style={{ backgroundColor: "var(--off-white)", borderRadius: "20px", border: "1px solid var(--beige-mid)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 400, color: "var(--dark)" }}>Aanvraag ontvangen!</h3>
              <p className="text-sm font-light" style={{ color: "var(--muted)" }}>Ik neem binnen 24 uur contact met je op.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_subject" value="Nieuwe webdesign aanvraag via SteylVisuals" />
              <input type="hidden" name="_autoresponse" value="Bedankt voor je interesse in SteylVisuals! Ik heb je webdesign aanvraag goed ontvangen en neem binnen 24 uur persoonlijk contact met je op. Tot snel, Sam Steylaerts | SteylVisuals" />

              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Naam</label>
                  <input type="text" name="naam" required placeholder="Jouw naam" className="text-sm font-light outline-none"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Kantoor</label>
                  <input type="text" name="kantoor" placeholder="Jouw kantoor" className="text-sm font-light outline-none"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>E-mail</label>
                <input type="email" name="_replyto" required placeholder="jouw@email.be" className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Pakket</label>
                <select name="pakket" className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--muted)", appearance: "none" }}>
                  <option value="">Kies een pakket (optioneel)</option>
                  <option value="Landing Page — €749">Landing Page — €749</option>
                  <option value="Volledige Website — €1.699">Volledige Website — €1.699</option>
                  <option value="Web + Video Combo — €1.999/maand">Web + Video Combo — €1.999/maand</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Bericht</label>
                <textarea name="bericht" rows={3} placeholder="Vertel me over jouw kantoor en wat je nodig hebt..." className="text-sm font-light outline-none resize-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
              </div>

              <motion.button type="submit" disabled={loading} className="text-sm font-medium rounded-full py-3.5 mt-2"
                style={{ backgroundColor: "var(--dark)", color: "var(--beige)", opacity: loading ? 0.6 : 1 }}
                whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}>
                {loading ? "Versturen..." : "Verstuur aanvraag"}
              </motion.button>
            </form>
          )}
        </AnimateIn>
      </div>
    </section>
  );
}

export default function WebdesignClient() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "var(--beige)", padding: "calc(72px + 4rem) clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,6rem)" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6"
          style={{ color: "var(--gold)" }}
        >
          <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
          Webdesign voor makelaars
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mb-6"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.8rem,5.5vw,5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--dark)", maxWidth: "700px" }}
        >
          Een website die<br /><em style={{ color: "var(--brown-warm)" }}>klanten aantrekt</em><br />terwijl jij slaapt
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="text-base font-light leading-relaxed mb-10"
          style={{ color: "var(--muted)", maxWidth: "440px" }}
        >
          Van strakke landing pages tot volledige websites — op maat gebouwd, SEO-geoptimaliseerd en klaar om leads te genereren.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="flex items-center gap-6 flex-wrap"
        >
          <motion.a
            href="#webdesign-contact"
            className="text-sm font-medium rounded-full px-8 py-4"
            style={{ backgroundColor: "var(--dark)", color: "var(--off-white)" }}
            whileHover={{ backgroundColor: "var(--brown)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Gratis voorstel aanvragen
          </motion.a>
          <motion.a
            href="#webdesign-prijzen"
            className="text-sm font-normal pb-0.5 border-b"
            style={{ color: "var(--brown)", borderColor: "var(--beige-deep)" }}
            whileHover={{ borderColor: "var(--brown)" }}
          >
            Bekijk prijzen
          </motion.a>
        </motion.div>
      </section>

      {/* Wat je krijgt */}
      <section style={{ backgroundColor: "var(--off-white)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <AnimateIn>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            Wat je krijgt
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </p>
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <h2 className="mb-14" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
            Meer dan een website —<br /><em style={{ color: "var(--muted)" }}>een verkoopsmachine</em>
          </h2>
        </AnimateIn>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { icon: "⚡", title: "Razendsnel", desc: "Gebouwd met Next.js — de snelste technologie voor websites. Google beloont snelle sites met hogere rankings." },
            { icon: "📱", title: "Mobiel-first", desc: "70% van je bezoekers komt via smartphone. Jouw site ziet er op elk scherm perfect uit." },
            { icon: "🔍", title: "SEO inbegrepen", desc: "Technische SEO, meta tags, sitemap — alles opgezet zodat makelaars jou vinden via Google." },
            { icon: "✏️", title: "Zelf beheren", desc: "Via een eenvoudig CMS pas jij teksten, foto's en projecten aan zonder technische kennis." },
            { icon: "🎨", title: "Jouw stijl", desc: "Geen kant-en-klare templates. Elke site wordt volledig op maat ontworpen passend bij jouw merk." },
            { icon: "🎬", title: "Video-ready", desc: "Combineer met je video content voor maximaal effect. Website + Reels = onverslaanbare combo." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
              className="flex flex-col gap-3 p-6"
              style={{ backgroundColor: "var(--beige)", borderRadius: "16px", border: "1px solid var(--beige-mid)" }}
            >
              <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: "var(--dark)" }}>{item.title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prijzen */}
      <section id="webdesign-prijzen" style={{ backgroundColor: "var(--beige)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="text-center mb-14">
          <AnimateIn>
            <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              Pakketten
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Transparante prijzen,<br /><em style={{ color: "var(--muted)" }}>geen verrassingen</em>
            </h2>
          </AnimateIn>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {plans.map((plan, i) => (
            <motion.article
              key={plan.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(28,14,7,0.12)" }}
              className="relative flex flex-col overflow-hidden"
              style={{
                backgroundColor: plan.featured ? "var(--dark)" : "var(--off-white)",
                borderRadius: "20px",
                padding: "clamp(1.75rem,3vw,2.5rem)",
                border: `1px solid ${plan.featured ? "var(--dark)" : "var(--beige-mid)"}`,
              }}
            >
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--gold)" }}
                initial={{ scaleX: plan.featured ? 1 : 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.3 }} />

              <span className="w-fit text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-7"
                style={{ color: plan.featured ? "var(--gold)" : "var(--muted)", backgroundColor: plan.featured ? "rgba(184,132,58,0.15)" : "var(--beige)" }}>
                {plan.tag}
              </span>

              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, lineHeight: 1.15, color: plan.featured ? "var(--beige)" : "var(--dark)", marginBottom: "0.25rem", whiteSpace: "pre-line" }}>
                {plan.name}
              </h3>
              <p className="text-sm font-light italic mb-6" style={{ color: plan.featured ? "rgba(242,237,232,0.45)" : "var(--muted)" }}>{plan.sub}</p>

              <div className="pb-6 mb-6 border-b" style={{ borderColor: plan.featured ? "rgba(242,237,232,0.1)" : "var(--beige-mid)" }}>
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", color: plan.featured ? "var(--beige)" : "var(--dark)" }}>
                  {plan.price}
                </span>
                {plan.tag === "Combo deal" && (
                  <span className="text-sm font-light ml-1" style={{ color: plan.featured ? "rgba(242,237,232,0.4)" : "var(--muted)" }}>/maand</span>
                )}
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-light leading-snug" style={{ color: plan.featured ? "rgba(242,237,232,0.65)" : "var(--muted)" }}>
                    <CheckIcon />{f}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#webdesign-contact"
                className="block text-center text-sm font-medium rounded-full py-3.5"
                style={{ backgroundColor: plan.featured ? "var(--gold)" : "var(--beige-mid)", color: "var(--dark)" }}
                whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
              >
                Aanvragen
              </motion.a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Combo highlight */}
      <section style={{ backgroundColor: "var(--dark)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="grid gap-16 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <AnimateIn>
              <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "var(--gold)" }}>
                <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
                De ultieme combinatie
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,4.5vw,4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--beige)" }}>
                Website én video —<br /><em style={{ color: "rgba(242,237,232,0.45)" }}>één pakket, één prijs</em>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(242,237,232,0.5)", maxWidth: "420px" }}>
                Geen twee leveranciers, geen miscommunicatie. Jij krijgt een professionele website die perfect aansluit op jouw social media content. Alles in dezelfde stijl, door dezelfde persoon.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <div className="flex flex-col gap-3 mb-10">
                {["Website op maat gebouwd", "6 video's per maand voor social media", "SEO + content strategie", "Één aanspreekpunt voor alles", "Maandelijks opzegbaar"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "rgba(242,237,232,0.65)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                className="inline-block text-sm font-medium rounded-full px-8 py-4"
                style={{ backgroundColor: "var(--gold)", color: "var(--dark)" }}
                whileHover={{ backgroundColor: "var(--gold-light)", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Combo aanvragen — €1.999/maand
              </motion.a>
            </AnimateIn>
          </div>

          <AnimateIn direction="right">
            <div className="grid gap-4">
              {[
                { label: "Website", value: "€1.699 eenmalig" },
                { label: "Video (6/maand)", value: "€490/maand" },
                { label: "Samen als combo", value: "€1.999/maand" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-center justify-between p-5"
                  style={{
                    backgroundColor: i === 2 ? "rgba(184,132,58,0.15)" : "rgba(242,237,232,0.04)",
                    borderRadius: "14px",
                    border: `1px solid ${i === 2 ? "rgba(184,132,58,0.3)" : "rgba(242,237,232,0.08)"}`,
                  }}
                >
                  <span className="text-sm font-light" style={{ color: i === 2 ? "var(--gold)" : "rgba(242,237,232,0.5)" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 400, color: i === 2 ? "var(--gold)" : "rgba(242,237,232,0.4)", textDecoration: i < 2 ? "line-through" : "none" }}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Voorbeelden */}
      <section style={{ backgroundColor: "var(--off-white)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="text-center mb-14">
          <AnimateIn>
            <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              Voorbeelden
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Websites die<br /><em style={{ color: "var(--muted)" }}>resultaat leveren</em>
            </h2>
          </AnimateIn>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              className="overflow-hidden"
              style={{ borderRadius: "20px", border: "1px solid var(--beige-mid)" }}
            >
              <div className="flex items-center justify-center" style={{ height: "200px", backgroundColor: p.color }}>
                <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 300, color: "rgba(242,237,232,0.2)", letterSpacing: "0.1em" }}>
                  {p.name}
                </span>
              </div>
              <div className="p-5" style={{ backgroundColor: "var(--beige)" }}>
                <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: "var(--dark)", marginBottom: "4px" }}>{p.name}</h3>
                <p className="text-xs font-light" style={{ color: "var(--muted)" }}>{p.type}</p>
                <p className="text-xs font-light mt-1" style={{ color: "var(--beige-deep)" }}>{p.tech}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <ContactSection />
    </>
  );
}
