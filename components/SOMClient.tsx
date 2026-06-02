"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const YELLOW = "#facb04";
const BLACK = "#0a0a0a";
const GRAY = "#f5f5f5";
const MUTED = "#6b6b6b";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const listings = [
  {
    id: 1,
    type: "Woning",
    title: "Karaktervolle gezinswoning",
    location: "Hasselt Centrum",
    price: "€ 425.000",
    beds: 4,
    baths: 2,
    area: 185,
    status: "Te koop",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  },
  {
    id: 2,
    type: "Appartement",
    title: "Modern appartement met terras",
    location: "Hasselt, Quartier",
    price: "€ 289.000",
    beds: 2,
    baths: 1,
    area: 92,
    status: "Te koop",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: 3,
    type: "Villa",
    title: "Luxueuze villa met zwembad",
    location: "Hasselt, Kermt",
    price: "€ 895.000",
    beds: 5,
    baths: 3,
    area: 320,
    status: "Te koop",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  },
  {
    id: 4,
    type: "Appartement",
    title: "Gerenoveerd appartement",
    location: "Hasselt, Kuringen",
    price: "€ 189.000",
    beds: 1,
    baths: 1,
    area: 68,
    status: "Verhuurd",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
];

const team = [
  { name: "Maxime Vanoppen", role: "Zaakvoerder & Makelaar", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Sarah Claes", role: "Makelaar", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Thomas Peeters", role: "Makelaar", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-20" style={{ backgroundColor: BLACK }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm" style={{ backgroundColor: YELLOW, color: BLACK }}>S</div>
        <Image src="/som-logo.png" alt="SOM Vastgoed" width={120} height={84} className="h-10 w-auto" />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-light text-white">
        <a href="#aanbod" className="hover:opacity-70 transition-opacity">Aanbod</a>
        <a href="#over-ons" className="hover:opacity-70 transition-opacity">Over ons</a>
        <a href="#team" className="hover:opacity-70 transition-opacity">Team</a>
        <motion.a
          href="#contact"
          className="px-5 py-2.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: YELLOW, color: BLACK }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Contact
        </motion.a>
      </div>
      {/* Demo badge */}
      <div className="absolute top-3 right-3 md:hidden">
        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: YELLOW, color: BLACK }}>DEMO</span>
      </div>
      <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2">
        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: YELLOW, color: BLACK }}>✦ DEMO — Gemaakt door SteylVisuals</span>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-start justify-center" style={{ minHeight: "100svh", backgroundColor: BLACK, padding: "calc(80px + 4rem) clamp(1.5rem,6vw,5rem) 5rem" }}>
      {/* Yellow accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5" style={{ background: `radial-gradient(ellipse at top right, ${YELLOW}, transparent 70%)` }} />

      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="w-8 h-0.5" style={{ backgroundColor: YELLOW }} />
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: YELLOW }}>Vastgoed in Hasselt & omgeving</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="text-white mb-6"
        style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "700px" }}
      >
        Uw thuis vinden,<br />
        <em style={{ color: YELLOW }}>dat doen we samen</em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="text-base font-light leading-relaxed mb-10"
        style={{ color: "rgba(255,255,255,0.55)", maxWidth: "460px" }}
      >
        SOM Vastgoed begeleidt u persoonlijk bij aan- en verkoop in Hasselt en omgeving. Eerlijk advies, snelle service, maximaal resultaat.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="flex items-center gap-4 flex-wrap"
      >
        <motion.a
          href="#aanbod"
          className="text-sm font-semibold rounded-full px-8 py-4"
          style={{ backgroundColor: YELLOW, color: BLACK }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Bekijk ons aanbod
        </motion.a>
        <motion.a
          href="#contact"
          className="text-sm font-light rounded-full px-8 py-4 border border-white/20 text-white"
          whileHover={{ borderColor: YELLOW, color: YELLOW }}
          whileTap={{ scale: 0.97 }}
        >
          Gratis waardebepaling
        </motion.a>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        className="flex gap-12 mt-20 pt-12 border-t border-white/10"
      >
        {[["150+", "Panden verkocht"], ["98%", "Tevreden klanten"], ["12", "Jaar ervaring"]].map(([num, label]) => (
          <div key={label}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontWeight: 400, color: YELLOW, lineHeight: 1 }}>{num}</p>
            <p className="text-xs font-light mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function Listings() {
  const [filter, setFilter] = useState("Alles");
  const filters = ["Alles", "Te koop", "Verhuurd"];
  const filtered = filter === "Alles" ? listings : listings.filter(l => l.status === filter);

  return (
    <section id="aanbod" style={{ backgroundColor: GRAY, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-4" style={{ color: YELLOW.replace("04", "a0") === YELLOW ? "#b89000" : "#b89000" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "#b89000" }} />
            Ons aanbod
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1, color: BLACK }}>
            Actuele panden<br /><em style={{ color: MUTED }}>in Hasselt & omgeving</em>
          </h2>
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs font-medium px-4 py-2 rounded-full"
              animate={{ backgroundColor: filter === f ? BLACK : "#e5e5e5", color: filter === f ? "white" : MUTED }}
              whileTap={{ scale: 0.96 }}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        <AnimatePresence>
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -4, boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}
              className="overflow-hidden bg-white"
              style={{ borderRadius: "16px" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <motion.img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: p.status === "Te koop" ? YELLOW : "#e5e5e5", color: BLACK }}>
                  {p.status}
                </div>
                <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "white" }}>
                  {p.type}
                </div>
              </div>
              <div className="p-5">
                <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: BLACK, lineHeight: 1.3, marginBottom: "4px" }}>{p.title}</p>
                <p className="text-xs font-light mb-4 flex items-center gap-1" style={{ color: MUTED }}>
                  📍 {p.location}
                </p>
                <div className="flex items-center gap-4 text-xs font-light mb-4" style={{ color: MUTED }}>
                  <span>🛏 {p.beds} slpk</span>
                  <span>🚿 {p.baths} badk</span>
                  <span>📐 {p.area} m²</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: BLACK }}>{p.price}</span>
                  <motion.button
                    className="text-xs font-semibold px-4 py-2 rounded-full"
                    style={{ backgroundColor: BLACK, color: "white" }}
                    whileHover={{ backgroundColor: YELLOW, color: BLACK }}
                  >
                    Meer info
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="over-ons" style={{ backgroundColor: BLACK, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6"
            style={{ color: YELLOW }}
          >
            <span className="w-4 h-px" style={{ backgroundColor: YELLOW }} />
            Over SOM Vastgoed
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1 }}
          >
            Persoonlijk,<br /><em style={{ color: YELLOW }}>professioneel<br />& transparant</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-sm font-light leading-loose mb-8"
            style={{ color: "rgba(255,255,255,0.5)", maxWidth: "420px" }}
          >
            Bij SOM Vastgoed staat de klant centraal. We begeleiden u stap voor stap — van eerste bezichtiging tot sleuteloverdracht. Geen verassingen, wel resultaten.
          </motion.p>
          <div className="grid grid-cols-2 gap-4">
            {[["Persoonlijk advies", "Eén makelaar, van A tot Z"], ["Lokale expertise", "Hasselt & omgeving"], ["Transparant", "Eerlijke commissie"], ["Snel", "Gemiddeld 45 dagen"]].map(([title, sub]) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE }}
                className="p-4 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: YELLOW }} />
                <p className="text-sm font-medium text-white mb-1">{title}</p>
                <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative"
        >
          <div className="overflow-hidden" style={{ borderRadius: "20px", aspectRatio: "4/5" }}>
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="SOM Vastgoed kantoor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 p-5 rounded-2xl" style={{ backgroundColor: YELLOW }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 600, color: BLACK, lineHeight: 1 }}>12+</p>
            <p className="text-xs font-semibold mt-1" style={{ color: BLACK }}>Jaar ervaring</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" style={{ backgroundColor: GRAY, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5"
          style={{ color: "#b89000" }}
        >
          <span className="w-4 h-px" style={{ backgroundColor: "#b89000" }} />
          Ons team
          <span className="w-4 h-px" style={{ backgroundColor: "#b89000" }} />
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, color: BLACK }}
        >
          Mensen die voor u<br /><em style={{ color: MUTED }}>het verschil maken</em>
        </motion.h2>
      </div>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {team.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            whileHover={{ y: -4 }}
            className="overflow-hidden bg-white"
            style={{ borderRadius: "20px" }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: "1/1" }}>
              <motion.img src={m.img} alt={m.name} className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
            </div>
            <div className="p-5">
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 500, color: BLACK }}>{m.name}</p>
              <p className="text-xs font-light mt-1" style={{ color: MUTED }}>{m.role}</p>
              <div className="mt-3 w-8 h-0.5" style={{ backgroundColor: YELLOW }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" style={{ backgroundColor: BLACK, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-5"
            style={{ color: YELLOW }}
          >
            <span className="w-4 h-px" style={{ backgroundColor: YELLOW }} />
            Contact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 400, lineHeight: 1.1 }}
          >
            Klaar om te starten?<br /><em style={{ color: YELLOW }}>Wij ook.</em>
          </motion.h2>
          <p className="text-sm font-light leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "340px" }}>
            Neem contact op voor een vrijblijvend gesprek. We antwoorden binnen 24 uur.
          </p>
          <div className="flex flex-col gap-3 text-sm font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
            <span>📧 maxime@somvastgoed.be</span>
            <span>📍 Hasselt, België</span>
          </div>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center gap-4 py-16 rounded-2xl"
            style={{ backgroundColor: "rgba(250,203,4,0.08)", border: `1px solid rgba(250,203,4,0.2)` }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: YELLOW }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 400, color: "white" }}>Bericht ontvangen!</h3>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>We nemen binnen 24 uur contact op.</p>
          </motion.div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[["Naam", "text", "Jouw naam"], ["E-mail", "email", "jouw@email.be"]].map(([label, type, placeholder]) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</label>
                  <input type={type} placeholder={placeholder} required className="text-sm font-light outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", color: "white" }} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Interesse</label>
              <select className="text-sm font-light outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", color: "rgba(255,255,255,0.6)", appearance: "none" }}>
                <option value="">Wat kan ik voor u doen?</option>
                <option>Woning kopen</option>
                <option>Woning verkopen</option>
                <option>Woning huren</option>
                <option>Gratis waardebepaling</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>Bericht</label>
              <textarea rows={4} placeholder="Vertel ons wat u zoekt..." className="text-sm font-light outline-none resize-none"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", color: "white" }} />
            </div>
            <motion.button type="submit" className="text-sm font-semibold rounded-full py-4 mt-2"
              style={{ backgroundColor: YELLOW, color: BLACK }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
              Verstuur bericht
            </motion.button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: "#050505", padding: "2rem clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded flex items-center justify-center font-bold text-sm" style={{ backgroundColor: YELLOW, color: BLACK }}>S</div>
          <Image src="/som-logo.png" alt="SOM Vastgoed" width={100} height={70} className="h-8 w-auto" />
        </div>
        <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2026 SOM Vastgoed — Hasselt
        </p>
        <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
          Website door <span style={{ color: YELLOW }}>SteylVisuals</span>
        </p>
      </div>
    </footer>
  );
}

export default function SOMClient() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {/* Demo banner */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-2"
        style={{ backgroundColor: YELLOW, color: BLACK }}>
        ✦ Dit is een demo — gemaakt door SteylVisuals
      </div>
      <Nav />
      <Hero />
      <Listings />
      <About />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
