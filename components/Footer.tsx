"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, var(--black) 0%, #140A05 45%, var(--black) 100%)", padding: "clamp(3.5rem,7vh,5.5rem) clamp(1.5rem,6vw,5rem) clamp(2.5rem,5vh,4rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        {/* Was a remote PNG recoloured with brightness-0 invert; the real lockup
            costs no request and keeps the dot gold. */}
        <Link href="/" aria-label="SteylVisuals — home">
          <Logo size={26} variant="cream" />
        </Link>

        <nav className="flex items-center gap-6 text-xs font-light" style={{ color: "var(--cream-muted)" }}>
          <Link href="/vastgoed-marketing" style={{ color: "inherit", textDecoration: "none" }}>Marketing</Link>
          <Link href="/webdesign" style={{ color: "inherit", textDecoration: "none" }}>Webdesign</Link>
          <Link href="/portfolio" style={{ color: "inherit", textDecoration: "none" }}>Portfolio</Link>
          <a href="mailto:Steylvisuals96@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/steylvisuals"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(241,237,230,0.12)" }}
            aria-label="Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(241,237,230,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(241,237,230,0.5)" stroke="none" />
            </svg>
          </a>
          <a
            href="mailto:Steylvisuals96@gmail.com"
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: "1px solid rgba(241,237,230,0.12)" }}
            aria-label="Email"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(241,237,230,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 flex items-center justify-between flex-wrap gap-4" style={{ borderTop: "1px solid rgba(241,237,230,0.06)" }}>
        <p className="text-xs font-light" style={{ color: "var(--cream-muted)" }}>
          © {new Date().getFullYear()} SteylVisuals — Sam Steylaerts
        </p>
        <p className="text-xs font-light" style={{ color: "var(--cream-muted)" }}>
          Video · Webdesign · België
        </p>
      </div>
    </footer>
  );
}
