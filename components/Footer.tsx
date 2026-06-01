"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--dark)", borderTop: "1px solid rgba(242,237,232,0.06)", padding: "clamp(2.5rem,5vh,4rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo/sV (4) (1).png" alt="SteylVisuals" width={36} height={36} className="object-contain" />
          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", fontWeight: 400, letterSpacing: "0.04em", color: "var(--beige)" }}>
            SteylVisuals
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-xs font-light" style={{ color: "rgba(242,237,232,0.4)" }}>
          <a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>Pakketten</a>
          <a href="#process" style={{ color: "inherit", textDecoration: "none" }}>Werkwijze</a>
          <a href="#over-mij" style={{ color: "inherit", textDecoration: "none" }}>Over mij</a>
          <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/steylvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(242,237,232,0.12)" }}
            aria-label="Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,232,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(242,237,232,0.5)" stroke="none" />
            </svg>
          </a>
          <a
            href="mailto:Steylvisuals96@gmail.com"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(242,237,232,0.12)" }}
            aria-label="Email"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,232,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 flex items-center justify-between flex-wrap gap-4" style={{ borderTop: "1px solid rgba(242,237,232,0.06)" }}>
        <p className="text-xs font-light" style={{ color: "rgba(242,237,232,0.25)" }}>
          © {new Date().getFullYear()} SteylVisuals — Sam Steylaerts
        </p>
        <p className="text-xs font-light" style={{ color: "rgba(242,237,232,0.2)" }}>
          Cinematic real estate video
        </p>
      </div>
    </footer>
  );
}
