"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ContactForm {
  naam: string;
  email: string;
  telefoon: string;
}

interface QuizAnswers {
  kantoorNaam: string;
  regio: string;
  typePanden: string[];
  prijsklasse: string;
  stijl: string;
  huisstijl: string;
  deadline: string;
  functies: string[];
}

const INITIAL: QuizAnswers = {
  kantoorNaam: "",
  regio: "",
  typePanden: [],
  prijsklasse: "",
  stijl: "",
  huisstijl: "",
  deadline: "",
  functies: [],
};

const DEMOS = [
  { slug: "dark-luxury",     name: "Dark Luxury",      label: "Exclusief · Prestige · High-end" },
  { slug: "clean-minimal",   name: "Clean & Minimaal",  label: "Steden · Breed publiek · Vertrouwen" },
  { slug: "warm-lokaal",     name: "Warm & Lokaal",     label: "Regio · Zelfstandigen · Nabijheid" },
  { slug: "bold-eigentijds", name: "Bold & Eigentijds", label: "Groei · Onderscheiden · Modern" },
];

const STIJL_MAP: Record<string, string> = {
  warm:    "warm-lokaal",
  luxury:  "dark-luxury",
  minimal: "clean-minimal",
  bold:    "bold-eigentijds",
};

const EASE = [0.16, 1, 0.3, 1] as const;

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? -56 : 56, opacity: 0 }),
};

const CONTACT_INITIAL: ContactForm = { naam: "", email: "", telefoon: "" };

export default function QuizClient() {
  const [step, setStep]           = useState(-1);
  const [dir, setDir]             = useState(1);
  const [answers, setAnswers]     = useState<QuizAnswers>(INITIAL);
  const [preview, setPreview]     = useState<string | null>(null);
  const [contact, setContact]     = useState<ContactForm>(CONTACT_INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const TOTAL = 8;

  const go = (n: number) => { setDir(n > step ? 1 : -1); setStep(n); };
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const rec = STIJL_MAP[answers.stijl] ?? "clean-minimal";

  const canNext = () => {
    if (step === 0) return answers.kantoorNaam.trim().length > 0;
    if (step === 1) return answers.regio.trim().length > 0;
    if (step === 2) return answers.typePanden.length > 0;
    if (step === 3) return !!answers.prijsklasse;
    if (step === 4) return !!answers.stijl;
    if (step === 5) return !!answers.huisstijl;
    if (step === 6) return !!answers.deadline;
    return true;
  };

  const buildQuizSummary = () => [
    `Kantoor: ${answers.kantoorNaam || "—"}`,
    `Regio: ${answers.regio || "—"}`,
    `Type panden: ${answers.typePanden.join(", ") || "—"}`,
    `Gemiddelde vraagprijs: ${answers.prijsklasse || "—"}`,
    `Stijlvoorkeur: ${DEMOS.find(d => d.slug === rec)?.name || "—"}`,
    `Huisstijl: ${answers.huisstijl || "—"}`,
    `Online wanneer: ${answers.deadline || "—"}`,
    `Gewenste functies: ${answers.functies.join(", ") || "—"}`,
  ].join("\n");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/quiz-contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          naam:              contact.naam,
          email:             contact.email,
          telefoon:          contact.telefoon,
          aanbevolen_stijl:  DEMOS.find(d => d.slug === rec)?.name ?? rec,
          quiz_samenvatting: buildQuizSummary(),
        }),
      });
      if (!res.ok) throw new Error("submit");
      go(10);
    } catch {
      setSubmitError("Er liep iets mis. Probeer opnieuw of mail ons direct.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--off-white)]">

      {/* ── Demo preview overlay ── */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="flex items-center justify-between px-6 py-3 shrink-0"
              style={{ background: "var(--dark)" }}
            >
              <span className="text-sm" style={{ color: "var(--beige)", fontFamily: "var(--font-dm-sans)" }}>
                {DEMOS.find(d => d.slug === preview)?.name} — Live demo
              </span>
              <button
                onClick={() => setPreview(null)}
                className="flex items-center gap-2 text-sm transition-colors cursor-pointer"
                style={{ color: "var(--muted)" }}
                onMouseOver={e => (e.currentTarget.style.color = "var(--beige)")}
                onMouseOut={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                Sluiten <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <iframe
              src={`https://demos.steylvisuals.be/${preview}`}
              className="flex-1 w-full border-none"
              title={`Demo ${preview}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quiz layout ── */}
      <div className="max-w-2xl mx-auto px-6 py-16 min-h-[100dvh] flex flex-col">

        {/* Back link */}
        <div className="mb-14">
          <Link
            href="/"
            className="text-xs font-mono tracking-widest uppercase transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--dark)")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--muted)")}
          >
            ← SteylVisuals
          </Link>
        </div>

        {/* Progress */}
        {step >= 0 && step < TOTAL && (
          <div className="mb-12">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                Vraag {step + 1} / {TOTAL}
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                {Math.round(((step + 1) / TOTAL) * 100)}%
              </span>
            </div>
            <div className="h-px relative" style={{ background: "var(--beige-deep)" }}>
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: "var(--gold)" }}
                animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait" custom={dir}>

            {/* ── Intro ── */}
            {step === -1 && (
              <motion.div key="intro" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Website Quiz" />
                <h1 className="mb-5 leading-tight" style={{
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  color: "var(--dark)",
                }}>
                  Welke website past bij uw vastgoedkantoor?
                </h1>
                <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "var(--muted)" }}>
                  Beantwoord 8 korte vragen. Op basis van uw antwoorden tonen wij de stijl die het best bij u past — en u kunt elke demo live bekijken in dit venster.
                </p>
                <div className="flex items-center gap-2 text-sm mb-12" style={{ color: "var(--muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--gold)" }} />
                  Duurt ongeveer 2 minuten · Volledig vrijblijvend
                </div>
                <Btn label="Start de quiz →" onClick={next} active />
              </motion.div>
            )}

            {/* ── Q1: Naam ── */}
            {step === 0 && (
              <motion.div key="q0" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 1" />
                <Q>Wat is de naam van uw vastgoedkantoor?</Q>
                <TextIn
                  value={answers.kantoorNaam}
                  placeholder="bv. Vander Immo"
                  hint="Druk Enter om door te gaan"
                  onChange={v => setAnswers(a => ({ ...a, kantoorNaam: v }))}
                  onEnter={() => canNext() && next()}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q2: Regio ── */}
            {step === 1 && (
              <motion.div key="q1" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 2" />
                <Q>In welke regio of gemeente bent u actief?</Q>
                <TextIn
                  value={answers.regio}
                  placeholder="bv. Ronse, Oudenaarde, Gent..."
                  hint="Helpt ons de teksten lokaal te maken"
                  onChange={v => setAnswers(a => ({ ...a, regio: v }))}
                  onEnter={() => canNext() && next()}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q3: Type panden ── */}
            {step === 2 && (
              <motion.div key="q2" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 3" />
                <Q sub="Meerdere antwoorden mogelijk">Welke panden verkoopt u?</Q>
                <Chips
                  options={["Gezinswoningen","Appartementen","Luxevastgoed","Nieuwbouw","Gronden","Commercieel","Gemengd aanbod"]}
                  selected={answers.typePanden}
                  toggle={v => setAnswers(a => ({ ...a, typePanden: a.typePanden.includes(v) ? a.typePanden.filter(x => x !== v) : [...a.typePanden, v] }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q4: Prijsklasse ── */}
            {step === 3 && (
              <motion.div key="q3" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 4" />
                <Q>Wat is de gemiddelde vraagprijs van uw panden?</Q>
                <Radios
                  options={[
                    { label: "Onder €200.000",           sub: "Instapwoningen en sociale koopprojecten",        val: "Onder €200.000" },
                    { label: "€200.000 – €400.000",      sub: "Typische gezinswoningen en appartementen",       val: "€200.000 – €400.000" },
                    { label: "€400.000 – €700.000",      sub: "Kwalitatieve woningen en nieuwbouw",             val: "€400.000 – €700.000" },
                    { label: "Boven €700.000",            sub: "Premium en exclusief vastgoed",                  val: "Boven €700.000" },
                  ]}
                  selected={answers.prijsklasse}
                  onSelect={v => setAnswers(a => ({ ...a, prijsklasse: v }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q5: Stijl ── */}
            {step === 4 && (
              <motion.div key="q4" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 5" />
                <Q>Welke omschrijving past het best bij uw kantoor?</Q>
                <Radios
                  options={[
                    { label: "Persoonlijk & lokaal",         sub: "Wij kennen onze klanten en buurt door en door",       val: "warm" },
                    { label: "Exclusief & architecturaal",   sub: "Wij verkopen premium vastgoed voor veeleisende kopers", val: "luxury" },
                    { label: "Modern & professioneel",       sub: "Helder, vertrouwd en toegankelijk voor iedereen",      val: "minimal" },
                    { label: "Gedurfd & onderscheidend",     sub: "Wij vallen bewust op en denken anders dan de rest",    val: "bold" },
                  ]}
                  selected={answers.stijl}
                  onSelect={v => setAnswers(a => ({ ...a, stijl: v }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q6: Huisstijl ── */}
            {step === 5 && (
              <motion.div key="q5" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 6" />
                <Q>Heeft u al een logo en huisstijl?</Q>
                <Radios
                  options={[
                    { label: "Ja, volledig uitgewerkt",       sub: "Logo, kleuren en lettertype zijn al bepaald",         val: "ja-volledig" },
                    { label: "Ja, maar aan vernieuwing toe",  sub: "Er is iets, maar het mag vernieuwd worden",           val: "ja-verouderd" },
                    { label: "Nee, we beginnen van nul",      sub: "Geen huisstijl — logo mag ook gemaakt worden",        val: "nee" },
                  ]}
                  selected={answers.huisstijl}
                  onSelect={v => setAnswers(a => ({ ...a, huisstijl: v }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q7: Deadline ── */}
            {step === 6 && (
              <motion.div key="q6" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 7" />
                <Q>Wanneer wilt u uw website online hebben?</Q>
                <Radios
                  options={[
                    { label: "Zo snel mogelijk",         sub: "Liefst binnen 2 weken",                           val: "Zo snel mogelijk" },
                    { label: "Binnen 1 maand",           sub: "Niet dringend, maar binnenkort",                  val: "Binnen 1 maand" },
                    { label: "Over 1 tot 3 maanden",     sub: "Ik heb tijd om rustig te beslissen",              val: "Over 1 tot 3 maanden" },
                    { label: "Ik oriënteer me nog",      sub: "Gewoon kijken wat de mogelijkheden zijn",         val: "Ik oriënteer me nog" },
                  ]}
                  selected={answers.deadline}
                  onSelect={v => setAnswers(a => ({ ...a, deadline: v }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} />
              </motion.div>
            )}

            {/* ── Q8: Functies ── */}
            {step === 7 && (
              <motion.div key="q7" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.5, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Vraag 8" />
                <Q sub="Optioneel — selecteer alles wat u interessant lijkt">Wat wilt u zeker op uw website?</Q>
                <Chips
                  options={[
                    "Contactformulier",
                    "Online afspraken maken",
                    "Panden aanbod met filters",
                    "Gratis waardebepaling",
                    "Blog / nieuws",
                    "Meertalig (NL/FR)",
                    "Koppeling Immoweb / Zimmo",
                    "Google Maps integratie",
                  ]}
                  selected={answers.functies}
                  toggle={v => setAnswers(a => ({ ...a, functies: a.functies.includes(v) ? a.functies.filter(x => x !== v) : [...a.functies, v] }))}
                />
                <Nav step={step} onBack={back} onNext={next} can={canNext()} isLast />
              </motion.div>
            )}

            {/* ── Contact form ── */}
            {step === 9 && (
              <motion.div key="contact" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.6, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Laatste stap" gold />
                <h2 className="mb-3 leading-tight" style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  color: "var(--dark)",
                }}>
                  Laat uw gegevens achter.
                </h2>
                <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: "var(--muted)" }}>
                  Wij contacteren u voor een vrijblijvend gesprek over uw website — geen verplichtingen, geen spam.
                </p>

                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4 mb-6">

                  {/* Naam */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
                      Naam *
                    </label>
                    <input
                      type="text"
                      name="naam"
                      required
                      placeholder="Uw naam of bedrijfsnaam"
                      value={contact.naam}
                      onChange={e => setContact(c => ({ ...c, naam: e.target.value }))}
                      className="w-full border-b-2 bg-transparent pb-3 outline-none transition-colors text-lg"
                      style={{ borderColor: "var(--beige-deep)", fontFamily: "var(--font-cormorant)", color: "var(--dark)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--beige-deep)")}
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="uw@kantoor.be"
                      value={contact.email}
                      onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                      className="w-full border-b-2 bg-transparent pb-3 outline-none transition-colors text-lg"
                      style={{ borderColor: "var(--beige-deep)", fontFamily: "var(--font-cormorant)", color: "var(--dark)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--beige-deep)")}
                    />
                  </div>

                  {/* Telefoon */}
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
                      Telefoonnummer <span style={{ color: "var(--beige-deep)" }}>(optioneel)</span>
                    </label>
                    <input
                      type="tel"
                      name="telefoon"
                      placeholder="+32 ..."
                      value={contact.telefoon}
                      onChange={e => setContact(c => ({ ...c, telefoon: e.target.value }))}
                      className="w-full border-b-2 bg-transparent pb-3 outline-none transition-colors text-lg"
                      style={{ borderColor: "var(--beige-deep)", fontFamily: "var(--font-cormorant)", color: "var(--dark)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--beige-deep)")}
                    />
                  </div>

                  {submitError && (
                    <p className="text-sm" style={{ color: "#b45309" }}>{submitError}</p>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <button type="button" onClick={() => go(8)}
                      className="text-sm transition-colors cursor-pointer"
                      style={{ color: "var(--muted)" }}
                      onMouseOver={e => (e.currentTarget.style.color = "var(--dark)")}
                      onMouseOut={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      ← Terug
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !contact.naam || !contact.email}
                      className="inline-flex items-center gap-2 px-8 py-3.5 text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                      style={(submitting || !contact.naam || !contact.email) ? {
                        background: "var(--beige-mid)",
                        color: "var(--beige-deep)",
                      } : {
                        background: "var(--dark)",
                        color: "var(--beige)",
                      }}
                      onMouseOver={e => { if (!submitting && contact.naam && contact.email) (e.currentTarget as HTMLButtonElement).style.background = "var(--brown-warm)"; }}
                      onMouseOut={e => { if (!submitting && contact.naam && contact.email) (e.currentTarget as HTMLButtonElement).style.background = "var(--dark)"; }}
                    >
                      {submitting ? "Verzenden…" : "Verstuur aanvraag →"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Success ── */}
            {step === 10 && (
              <motion.div key="success" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.6, ease: EASE }} className="flex-1 flex flex-col justify-center">
                <div className="mb-6">
                  <span className="inline-block w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: "var(--gold)" }}>
                    ✓
                  </span>
                </div>
                <Label text="Verzonden" gold />
                <h2 className="mb-4 leading-tight" style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  color: "var(--dark)",
                }}>
                  Bedankt, {contact.naam || "u"}.
                </h2>
                <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: "var(--muted)" }}>
                  Uw aanvraag is ontvangen. We nemen zo snel mogelijk contact met u op — normaal gezien binnen 1 werkdag.
                </p>
                <div className="border-t pt-6" style={{ borderColor: "var(--beige-deep)" }}>
                  <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                    Aanbevolen stijl
                  </p>
                  <p className="text-sm" style={{ color: "var(--dark)" }}>
                    {DEMOS.find(d => d.slug === rec)?.name} — <span style={{ color: "var(--muted)" }}>{DEMOS.find(d => d.slug === rec)?.label}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Results ── */}
            {step === 8 && (
              <motion.div key="results" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.6, ease: EASE }} className="flex-1 flex flex-col">
                <Label text="Uw resultaat" gold />
                <h2 className="mb-3 leading-tight" style={{
                  fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)",
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  color: "var(--dark)",
                }}>
                  {answers.kantoorNaam
                    ? `${answers.kantoorNaam}, wij hebben uw stijl gevonden.`
                    : "Wij hebben uw stijl gevonden."}
                </h2>
                <p className="text-sm leading-relaxed mb-10 max-w-lg" style={{ color: "var(--muted)" }}>
                  Op basis van uw antwoorden past de{" "}
                  <strong style={{ color: "var(--dark)" }}>
                    {DEMOS.find(d => d.slug === rec)?.name}
                  </strong>{" "}
                  stijl het best bij uw kantoor. Klik op een demo om hem live te bekijken — u kunt daarna gewoon sluiten en hier verdergaan.
                </p>

                {/* Demo cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
                  {DEMOS.map((demo, i) => {
                    const isRec = demo.slug === rec;
                    return (
                      <motion.button
                        key={demo.slug}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                        onClick={() => setPreview(demo.slug)}
                        className="relative text-left p-5 border-2 cursor-pointer transition-all duration-200 group"
                        style={isRec ? {
                          borderColor: "var(--gold)",
                          background: "var(--dark)",
                        } : {
                          borderColor: "var(--beige-deep)",
                          background: "#fff",
                        }}
                        onMouseOver={e => { if (!isRec) e.currentTarget.style.borderColor = "var(--dark)"; }}
                        onMouseOut={e => { if (!isRec) e.currentTarget.style.borderColor = "var(--beige-deep)"; }}
                      >
                        {isRec && (
                          <span
                            className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest"
                            style={{ background: "var(--gold)", color: "var(--dark)" }}
                          >
                            Aanbevolen
                          </span>
                        )}
                        <p className="text-xs font-mono mb-2" style={{ color: isRec ? "var(--gold)" : "var(--muted)" }}>
                          0{i + 1}
                        </p>
                        <h3 className="text-base font-medium mb-1" style={{ color: isRec ? "var(--beige)" : "var(--dark)" }}>
                          {demo.name}
                        </h3>
                        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                          {demo.label}
                        </p>
                        <span className="text-xs flex items-center gap-1 transition-all duration-200 group-hover:gap-2"
                          style={{ color: isRec ? "var(--gold-light)" : "var(--dark)" }}>
                          Demo bekijken →
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="border-t pt-7 mb-8" style={{ borderColor: "var(--beige-deep)" }}>
                  <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
                    Uw antwoorden
                  </p>
                  <div className="space-y-2">
                    {([
                      ["Kantoor",       answers.kantoorNaam],
                      ["Regio",         answers.regio],
                      ["Panden",        answers.typePanden.join(", ")],
                      ["Prijsklasse",   answers.prijsklasse],
                      ["Huisstijl",     answers.huisstijl],
                      ["Online wanneer",answers.deadline],
                      ...(answers.functies.length ? [["Functies", answers.functies.join(", ")]] : []),
                    ] as [string, string][]).map(([label, val]) => val ? (
                      <div key={label} className="flex gap-4 text-sm">
                        <span className="w-28 shrink-0" style={{ color: "var(--muted)" }}>{label}</span>
                        <span style={{ color: "var(--dark)" }}>{val}</span>
                      </div>
                    ) : null)}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => go(9)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm transition-colors duration-200 cursor-pointer"
                    style={{ background: "var(--dark)", color: "var(--beige)" }}
                    onMouseOver={e => (e.currentTarget.style.background = "var(--brown-warm)")}
                    onMouseOut={e => (e.currentTarget.style.background = "var(--dark)")}
                  >
                    Vraag een vrijblijvend voorstel aan →
                  </button>
                  <button
                    onClick={() => { setStep(-1); setAnswers(INITIAL); setContact(CONTACT_INITIAL); setDir(-1); }}
                    className="inline-flex items-center justify-center px-6 py-4 text-sm border cursor-pointer transition-colors duration-200"
                    style={{ borderColor: "var(--beige-deep)", color: "var(--muted)" }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dark)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--dark)";
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--beige-deep)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                    }}
                  >
                    Opnieuw beginnen
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

function Label({ text, gold }: { text: string; gold?: boolean }) {
  return (
    <p className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: gold ? "var(--gold)" : "var(--gold)" }}>
      {text}
    </p>
  );
}

function Q({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-8">
      <h2 className="leading-tight" style={{
        fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
        fontFamily: "var(--font-cormorant)",
        fontWeight: 300,
        color: "var(--dark)",
      }}>
        {children}
      </h2>
      {sub && <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{sub}</p>}
    </div>
  );
}

function TextIn({
  value, placeholder, hint, onChange, onEnter,
}: {
  value: string;
  placeholder: string;
  hint?: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}) {
  return (
    <div className="mb-12">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
        placeholder={placeholder}
        autoFocus
        className="w-full border-b-2 bg-transparent pb-3 outline-none transition-colors"
        style={{
          borderColor: "var(--beige-deep)",
          fontSize: "1.5rem",
          fontFamily: "var(--font-cormorant)",
          color: "var(--dark)",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "var(--gold)")}
        onBlur={e => (e.currentTarget.style.borderColor = "var(--beige-deep)")}
      />
      {hint && <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{hint}</p>}
    </div>
  );
}

function Chips({
  options, selected, toggle,
}: {
  options: string[];
  selected: string[];
  toggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className="px-4 py-2 text-sm border transition-all duration-150 cursor-pointer"
            style={on ? {
              borderColor: "var(--dark)",
              background: "var(--dark)",
              color: "var(--beige)",
            } : {
              borderColor: "var(--beige-deep)",
              background: "transparent",
              color: "var(--muted)",
            }}
            onMouseOver={e => { if (!on) { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dark)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--dark)"; } }}
            onMouseOut={e => { if (!on) { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--beige-deep)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; } }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Radios({
  options, selected, onSelect,
}: {
  options: { label: string; sub?: string; val: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-2 mb-12">
      {options.map(opt => {
        const on = selected === opt.val;
        return (
          <button
            key={opt.val}
            onClick={() => onSelect(opt.val)}
            className="w-full text-left px-5 py-4 border-2 transition-all duration-150 cursor-pointer"
            style={on ? {
              borderColor: "var(--gold)",
              background: "var(--dark)",
            } : {
              borderColor: "var(--beige-deep)",
              background: "#fff",
            }}
            onMouseOver={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--dark)"; }}
            onMouseOut={e => { if (!on) (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--beige-deep)"; }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors"
                style={on ? { borderColor: "var(--gold)", background: "var(--gold)" } : { borderColor: "var(--beige-deep)" }}
              >
                {on && <span className="w-1.5 h-1.5 rounded-full block" style={{ background: "var(--dark)" }} />}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: on ? "var(--beige)" : "var(--dark)" }}>
                  {opt.label}
                </p>
                {opt.sub && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {opt.sub}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Nav({
  step, onBack, onNext, can, isLast = false,
}: {
  step: number;
  onBack: () => void;
  onNext: () => void;
  can: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 mt-auto pt-4">
      {step > 0 && (
        <button
          onClick={onBack}
          className="text-sm transition-colors cursor-pointer"
          style={{ color: "var(--muted)" }}
          onMouseOver={e => (e.currentTarget.style.color = "var(--dark)")}
          onMouseOut={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          ← Vorige
        </button>
      )}
      <Btn
        label={isLast ? "Bekijk mijn resultaat →" : "Volgende →"}
        onClick={onNext}
        active={can}
      />
    </div>
  );
}

function Btn({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={!active}
      className="inline-flex items-center gap-2 px-8 py-3.5 text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
      style={active ? {
        background: "var(--dark)",
        color: "var(--beige)",
      } : {
        background: "var(--beige-mid)",
        color: "var(--beige-deep)",
      }}
      onMouseOver={e => { if (active) (e.currentTarget as HTMLButtonElement).style.background = "var(--brown-warm)"; }}
      onMouseOut={e => { if (active) (e.currentTarget as HTMLButtonElement).style.background = "var(--dark)"; }}
    >
      {label}
    </button>
  );
}
