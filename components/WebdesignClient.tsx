"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimateIn from "./AnimateIn";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

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
              Jouw project bespreken
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 className="mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Vertel me over<br /><em style={{ color: "var(--muted)" }}>jouw project</em>
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.2}>
            <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "var(--muted)", maxWidth: "360px" }}>
              Ik werk project per project — geen vaste pakketten, maar een offerte op maat van wat jij nodig hebt. Stuur me de details en ik reageer binnen 24u.
            </p>
          </AnimateIn>
          <AnimateIn delay={0.3}>
            <div className="flex flex-col gap-3">
              {[
                "Vrijblijvend voorstel",
                "Reactie binnen 24 uur",
                "Offerte op maat van jouw project",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "var(--muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              style={{ backgroundColor: "var(--off-white)", borderRadius: "20px", border: "1px solid var(--beige-mid)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(184,132,58,0.15)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Bedrijf</label>
                  <input type="text" name="bedrijf" placeholder="Jouw kantoor / bedrijf" className="text-sm font-light outline-none"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>E-mail</label>
                <input type="email" name="_replyto" required placeholder="jouw@email.be" className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
              </div>

              <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Type project</label>
                  <select name="type_project" className="text-sm font-light outline-none cursor-pointer"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--muted)", appearance: "none" }}>
                    <option value="">Kies een type</option>
                    <option value="Landing page">Landing page</option>
                    <option value="Volledige website">Volledige website</option>
                    <option value="Webshop">Webshop</option>
                    <option value="Redesign bestaande site">Redesign bestaande site</option>
                    <option value="Website + video combo">Website + video combo</option>
                    <option value="Iets anders">Iets anders</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Budget (optioneel)</label>
                  <select name="budget" className="text-sm font-light outline-none cursor-pointer"
                    style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--muted)", appearance: "none" }}>
                    <option value="">Geen voorkeur</option>
                    <option value="€500 – €1.000">€500 – €1.000</option>
                    <option value="€1.000 – €2.000">€1.000 – €2.000</option>
                    <option value="€2.000 – €4.000">€2.000 – €4.000</option>
                    <option value="€4.000+">€4.000+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Deadline (optioneel)</label>
                <input type="text" name="deadline" placeholder="bv. eind augustus, zo snel mogelijk…" className="text-sm font-light outline-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>Vertel me over jouw project</label>
                <textarea name="bericht" rows={4} required placeholder="Wat heb je nodig? Wat is het doel van de site? Wat vind je belangrijk?" className="text-sm font-light outline-none resize-none"
                  style={{ backgroundColor: "var(--off-white)", border: "1px solid var(--beige-mid)", borderRadius: "10px", padding: "0.75rem 1rem", color: "var(--dark)" }} />
              </div>

              <motion.button type="submit" disabled={loading} className="text-sm font-medium rounded-full py-3.5 mt-2 cursor-pointer"
                style={{ backgroundColor: "var(--dark)", color: "var(--beige)", opacity: loading ? 0.6 : 1 }}
                whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}>
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
          Geen vaste pakketten — elk project is anders. Van een strakke landing page tot een volledige website, op maat van jouw kantoor en budget.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="flex items-center gap-6 flex-wrap"
        >
          <motion.a
            href="#webdesign-contact"
            className="text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
            style={{ backgroundColor: "var(--dark)", color: "var(--off-white)" }}
            whileHover={{ backgroundColor: "var(--brown)", scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Bespreek jouw project
          </motion.a>
          <motion.a
            href="#werkwijze"
            className="text-sm font-normal pb-0.5 border-b cursor-pointer"
            style={{ color: "var(--brown)", borderColor: "var(--beige-deep)" }}
            whileHover={{ borderColor: "var(--brown)" }}
          >
            Hoe werkt het?
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
              <span style={{ fontSize: "1.5rem" }} aria-hidden="true">{item.icon}</span>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: "var(--dark)" }}>{item.title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Werkwijze */}
      <section id="werkwijze" style={{ backgroundColor: "var(--beige)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="text-center mb-16">
          <AnimateIn>
            <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5" style={{ color: "var(--gold)" }}>
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
              Hoe werkt het
              <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            </p>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--dark)" }}>
              Van idee tot<br /><em style={{ color: "var(--muted)" }}>live website</em>
            </h2>
          </AnimateIn>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            {
              step: "01",
              title: "Brief",
              desc: "Jij stuurt me de details van je project via het formulier. Type site, doel, stijl, deadline — alles wat relevant is.",
            },
            {
              step: "02",
              title: "Offerte",
              desc: "Binnen 24u ontvang je een offerte op maat. Geen vaste prijzen — de kost hangt af van de complexiteit en omvang.",
            },
            {
              step: "03",
              title: "Design & bouw",
              desc: "Na akkoord ga ik aan de slag. Je volgt het proces op via een live preview en kan tussentijds feedback geven.",
            },
            {
              step: "04",
              title: "Oplevering",
              desc: "De site gaat live en jij krijgt volledige overdracht: hosting, CMS, domein — alles geregeld en uitgelegd.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="flex flex-col gap-4 p-7"
              style={{ backgroundColor: "var(--off-white)", borderRadius: "20px", border: "1px solid var(--beige-mid)" }}
            >
              <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", fontWeight: 300, color: "var(--beige-mid)", lineHeight: 1 }}>
                {item.step}
              </span>
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: "var(--dark)" }}>{item.title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <AnimateIn delay={0.4}>
          <div className="flex justify-center mt-12">
            <motion.a
              href="#webdesign-contact"
              className="text-sm font-medium rounded-full px-8 py-4 cursor-pointer"
              style={{ backgroundColor: "var(--dark)", color: "var(--off-white)" }}
              whileHover={{ backgroundColor: "var(--brown)", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Stuur jouw brief
            </motion.a>
          </div>
        </AnimateIn>
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
                Website én video —<br /><em style={{ color: "rgba(242,237,232,0.45)" }}>één partner, één visie</em>
              </h2>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(242,237,232,0.5)", maxWidth: "420px" }}>
                Geen twee leveranciers, geen miscommunicatie. Jij krijgt een professionele website die perfect aansluit op jouw social media content. Alles in dezelfde stijl, door dezelfde persoon.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.3}>
              <div className="flex flex-col gap-3 mb-10">
                {["Website op maat gebouwd", "Maandelijkse video content voor social", "SEO + content strategie", "Één aanspreekpunt voor alles"].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-light" style={{ color: "rgba(242,237,232,0.65)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                style={{ backgroundColor: "var(--gold)", color: "var(--dark)" }}
                whileHover={{ backgroundColor: "var(--gold-light)", scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Bespreek de combo
              </motion.a>
            </AnimateIn>
          </div>

          <AnimateIn direction="right">
            <div className="flex flex-col gap-5 p-8" style={{ backgroundColor: "rgba(242,237,232,0.04)", borderRadius: "24px", border: "1px solid rgba(242,237,232,0.08)" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontStyle: "italic", fontWeight: 300, color: "rgba(242,237,232,0.35)", marginBottom: "0.5rem" }}>
                &ldquo;Geen twee leveranciers meer. Alles klopt samen.&rdquo;
              </p>
              {[
                { label: "Website", icon: "🌐", desc: "Op maat, SEO-klaar, CMS inbegrepen" },
                { label: "Video content", icon: "🎬", desc: "Maandelijkse Reels, TikTok & LinkedIn" },
                { label: "Strategie", icon: "📈", desc: "Één coherente visuele identiteit" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4"
                  style={{ backgroundColor: "rgba(242,237,232,0.04)", borderRadius: "14px", border: "1px solid rgba(242,237,232,0.07)" }}>
                  <span style={{ fontSize: "1.3rem" }} aria-hidden="true">{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.82rem", fontWeight: 500, color: "rgba(242,237,232,0.7)", marginBottom: "2px" }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", fontWeight: 300, color: "rgba(242,237,232,0.35)" }}>{item.desc}</p>
                  </div>
                </div>
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
