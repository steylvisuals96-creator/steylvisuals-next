"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketing", href: "/vastgoed-marketing" },
  { label: "Webdesign", href: "/webdesign" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Website Quiz", href: "/website-quiz", highlight: true },
];

export default function Nav({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setScrolled(y > 60));
    return () => unsub();
  }, [scrollY]);

  // Lock body scroll while the overlay menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const bgScrolled = dark
    ? "rgba(10,10,10,0.92)"
    : "rgba(253,250,247,0.94)";
  const borderScrolled = dark
    ? "rgba(184,132,58,0.12)"
    : "rgba(232,223,213,1)";
  const borderTransparent = dark
    ? "rgba(184,132,58,0)"
    : "rgba(232,223,213,0)";
  const linkColor = dark ? "rgba(253,250,247,0.65)" : "var(--brown)";
  const ctaBg = dark ? "#B8843A" : "var(--dark)";
  const ctaColor = dark ? "#0A0A0A" : "var(--off-white)";
  const ctaHoverBg = dark ? "#CFA05A" : "#3A1A08";
  const burgerColor = menuOpen ? "#FDFAF7" : dark ? "#FDFAF7" : "var(--dark)";

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px]"
        style={{ paddingLeft: "clamp(1.5rem, 5vw, 3.5rem)", paddingRight: "clamp(1.5rem, 5vw, 3.5rem)" }}
        animate={{
          backgroundColor: scrolled && !menuOpen ? bgScrolled : "rgba(0,0,0,0)",
          borderBottomColor: scrolled && !menuOpen ? borderScrolled : borderTransparent,
          backdropFilter: scrolled && !menuOpen ? "blur(18px)" : "blur(0px)",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link href="/" aria-label="SteylVisuals — home" className="relative z-[60]" onClick={() => setMenuOpen(false)}>
          <Image
            src="https://pub-28e65866cf1641928966914639cc84ef.r2.dev/logo/logo-cropped.png"
            alt="SteylVisuals"
            width={180}
            height={104}
            className="h-10 w-auto"
            style={dark || menuOpen ? { filter: "invert(1) brightness(2)" } : {}}
            priority
            loading="eager"
          />
        </Link>

        {/* Desktop links + CTA */}
        <div className="flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden md:block text-sm font-normal transition-opacity hover:opacity-70"
              style={{
                color: link.highlight ? "var(--gold)" : linkColor,
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Contact%20via%20SteylVisuals"
            className="hidden md:block text-sm font-medium rounded-full cursor-pointer"
            style={{
              backgroundColor: ctaBg,
              color: ctaColor,
              padding: "0.6rem 1.4rem",
              fontFamily: "var(--font-dm-sans)",
            }}
            whileHover={{ backgroundColor: ctaHoverBg }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Contact
          </motion.a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={menuOpen}
            className="md:hidden relative z-[60] flex flex-col items-center justify-center w-11 h-11 -mr-2"
          >
            <motion.span
              className="block w-6 h-[1.5px]"
              style={{ backgroundColor: burgerColor }}
              animate={menuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: -3 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="block w-6 h-[1.5px]"
              style={{ backgroundColor: burgerColor }}
              animate={menuOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 3 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[55] md:hidden flex flex-col justify-between overflow-hidden"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            {/* Gold glow */}
            <div
              className="absolute pointer-events-none"
              aria-hidden="true"
              style={{
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(184,132,58,0.12) 0%, transparent 65%)",
                filter: "blur(50px)",
                top: "-200px",
                right: "-200px",
              }}
            />

            <nav className="relative z-10 flex flex-col gap-1 px-7 pt-32">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.07, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-3"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: "0.65rem",
                        color: "#B8843A",
                        letterSpacing: "0.15em",
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(2.2rem, 9vw, 3rem)",
                        fontWeight: 400,
                        fontStyle: link.highlight ? "italic" : "normal",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        color: link.highlight ? "#B8843A" : "#FDFAF7",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.a
                href="mailto:Steylvisuals96@gmail.com?subject=Contact%20via%20SteylVisuals"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.55, delay: 0.08 + navLinks.length * 0.07, ease: EASE }}
                className="flex items-baseline gap-4 py-3"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "0.65rem",
                    color: "#B8843A",
                    letterSpacing: "0.15em",
                  }}
                >
                  0{navLinks.length + 1}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(2.2rem, 9vw, 3rem)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "#B8843A",
                  }}
                >
                  Contact
                </span>
              </motion.a>
            </nav>

            {/* Footer of menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10 px-7 pb-10 flex items-center justify-between"
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.7rem",
                  color: "rgba(253,250,247,0.3)",
                  letterSpacing: "0.08em",
                }}
              >
                Steylvisuals96@gmail.com
              </p>
              <a
                href="https://www.instagram.com/steylvisuals"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "0.7rem",
                  color: "#B8843A",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                }}
              >
                Instagram ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
