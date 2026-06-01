"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => setScrolled(y > 60));
    return () => unsub();
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[72px]"
      style={{ paddingLeft: "clamp(1.5rem, 5vw, 3.5rem)", paddingRight: "clamp(1.5rem, 5vw, 3.5rem)" }}
      animate={{
        backgroundColor: scrolled ? "rgba(253,250,247,0.94)" : "rgba(253,250,247,0)",
        borderBottomColor: scrolled ? "#E8DFD5" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href="#" aria-label="SteylVisuals">
        <Image
          src="/logo/logo-cropped.png"
          alt="SteylVisuals"
          width={180}
          height={104}
          className="h-10 w-auto"
          priority
        />
      </Link>

      <div className="flex items-center gap-8">
        {[
          { label: "Pricing", href: "#pricing" },
          { label: "Over mij", href: "#over-mij" },
          { label: "Portfolio", href: "#showcase" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hidden md:block text-sm font-normal transition-opacity hover:opacity-60"
            style={{ color: "var(--brown)" }}
          >
            {link.label}
          </Link>
        ))}

        <motion.a
          href="#contact-form"
          className="text-sm font-medium rounded-full px-5 py-2.5 transition-colors"
          style={{
            backgroundColor: "var(--dark)",
            color: "var(--off-white)",
          }}
          whileHover={{ backgroundColor: "#3A1A08" }}
          whileTap={{ scale: 0.97 }}
        >
          Contact
        </motion.a>
      </div>
    </motion.nav>
  );
}
