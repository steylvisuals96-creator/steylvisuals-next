"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import Link from "next/link";
import Logo from "./Logo";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketing", href: "/vastgoed-marketing" },
  { label: "Webdesign", href: "/webdesign" },
  { label: "Portfolio", href: "/portfolio" },
];

// Poppins 500 at 0.26em — the label voice, used for every working element in
// the bar. See DESIGN.md, The Two Voices Rule.
const label = {
  fontFamily: "var(--font-poppins)",
  fontSize: "0.6875rem",
  fontWeight: 500,
  letterSpacing: "0.26em",
  textTransform: "uppercase" as const,
};

export default function Nav() {
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

  const solid = scrolled && !menuOpen;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 flex items-center justify-between h-[72px]"
        style={{
          zIndex: "var(--z-nav)",
          paddingLeft: "clamp(1.5rem, 5vw, 3.5rem)",
          paddingRight: "clamp(1.5rem, 5vw, 3.5rem)",
        }}
        animate={{
          backgroundColor: solid ? "rgba(13,11,9,0.92)" : "rgba(13,11,9,0)",
          borderBottomColor: solid ? "rgba(241,237,230,0.08)" : "rgba(241,237,230,0)",
          backdropFilter: solid ? "blur(18px)" : "blur(0px)",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Link
          href="/"
          aria-label="SteylVisuals — home"
          className="relative"
          style={{ zIndex: "var(--z-nav)" }}
          onClick={() => setMenuOpen(false)}
        >
          {/* Below 26px the lockup drops its VISUALS line, per the brandbook. */}
          <Logo size={26} variant="cream" />
        </Link>

        <div className="flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden md:block nav-link"
              style={{ ...label, color: "var(--cream)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}

          <motion.a
            href="mailto:Steylvisuals96@gmail.com?subject=Contact%20via%20SteylVisuals"
            className="hidden md:block cursor-pointer"
            style={{
              ...label,
              backgroundColor: "var(--gold)",
              color: "var(--black)",
              borderRadius: "var(--r-sm)",
              padding: "0.85rem 1.6rem",
              textDecoration: "none",
            }}
            whileHover={{ backgroundColor: "var(--gold-light)" }}
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
            className="md:hidden relative flex flex-col items-center justify-center w-11 h-11 -mr-2"
            style={{ zIndex: "var(--z-nav)" }}
          >
            <motion.span
              className="block w-6 h-[1.5px]"
              style={{ backgroundColor: "var(--cream)" }}
              animate={menuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: -3 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="block w-6 h-[1.5px]"
              style={{ backgroundColor: "var(--cream)" }}
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
            className="fixed inset-0 md:hidden flex flex-col justify-between overflow-hidden"
            style={{ backgroundColor: "var(--black)", zIndex: "var(--z-overlay)" }}
          >
            <nav className="relative z-10 flex flex-col px-7 pt-32">
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
                    className="block py-3"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                      fontWeight: 300,
                      lineHeight: 1.15,
                      color: "var(--cream)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* The one gold element in the overlay — the primary action. */}
              <motion.a
                href="mailto:Steylvisuals96@gmail.com?subject=Contact%20via%20SteylVisuals"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.55, delay: 0.08 + navLinks.length * 0.07, ease: EASE }}
                className="block py-3"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.15,
                  color: "var(--gold)",
                  textDecoration: "none",
                }}
              >
                Contact
              </motion.a>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-10 px-7 pb-10 flex flex-col gap-3"
            >
              {/* Stacked: side by side these two overflow 375px once tracking is applied. */}
              <a
                href="mailto:Steylvisuals96@gmail.com"
                style={{ ...label, letterSpacing: "0.08em", color: "var(--cream-muted)", textTransform: "none", textDecoration: "none" }}
              >
                Steylvisuals96@gmail.com
              </a>
              <a
                href="https://www.instagram.com/steylvisuals"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...label, letterSpacing: "0.08em", color: "var(--cream-muted)", textTransform: "none", textDecoration: "none" }}
              >
                Instagram
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
