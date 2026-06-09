"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Nav({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setScrolled(y > 60));
    return () => unsub();
  }, [scrollY]);

  const bgScrolled = dark
    ? "rgba(10,10,10,0.92)"
    : "rgba(253,250,247,0.94)";
  const borderScrolled = dark
    ? "rgba(184,132,58,0.12)"
    : "#E8DFD5";
  const linkColor = dark ? "rgba(253,250,247,0.65)" : "var(--brown)";
  const ctaBg = dark ? "#B8843A" : "var(--dark)";
  const ctaColor = dark ? "#0A0A0A" : "var(--off-white)";
  const ctaHoverBg = dark ? "#CFA05A" : "#3A1A08";

  const navLinks = [
    { label: "Vastgoed Marketing", href: "/vastgoed-marketing" },
    { label: "Webdesign", href: "/webdesign" },
    { label: "Portfolio", href: "/portfolio" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px]"
      style={{ paddingLeft: "clamp(1.5rem, 5vw, 3.5rem)", paddingRight: "clamp(1.5rem, 5vw, 3.5rem)" }}
      animate={{
        backgroundColor: scrolled ? bgScrolled : "rgba(0,0,0,0)",
        borderBottomColor: scrolled ? borderScrolled : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Logo */}
      <Link href="/" aria-label="SteylVisuals — home">
        <Image
          src="/logo/logo-cropped.png"
          alt="SteylVisuals"
          width={180}
          height={104}
          className="h-10 w-auto"
          style={dark ? { filter: "invert(1) brightness(2)" } : {}}
          priority
        />
      </Link>

      {/* Links + CTA */}
      <div className="flex items-center gap-6 lg:gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hidden md:block text-sm font-normal transition-opacity hover:opacity-60"
            style={{ color: linkColor, fontFamily: "var(--font-dm-sans)" }}
          >
            {link.label}
          </Link>
        ))}

        <motion.a
          href="mailto:Steylvisuals96@gmail.com?subject=Contact%20via%20SteylVisuals"
          className="text-sm font-medium rounded-full cursor-pointer"
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
      </div>
    </motion.nav>
  );
}
