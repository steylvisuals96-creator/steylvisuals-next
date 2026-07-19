"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #140A05 45%, var(--dark) 100%)", padding: "clamp(3.5rem,7vh,5.5rem) clamp(1.5rem,6vw,5rem) clamp(2.5rem,5vh,4rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        <Link href="/">
          <Image src="https://pub-28e65866cf1641928966914639cc84ef.r2.dev/logo/logo-cropped.png" alt="SteylVisuals" width={180} height={104} className="h-10 w-auto brightness-0 invert" />
        </Link>

        <nav className="flex items-center gap-6 text-xs font-light" style={{ color: "rgba(242,237,232,0.4)" }}>
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
          Video · Webdesign · België
        </p>
      </div>
    </footer>
  );
}
