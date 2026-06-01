import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SteylVisuals — Vastgoedvideo's die opvallen én converteren",
  description: "Professionele short-form videocontent voor makelaars in Vlaanderen. Instagram Reels, TikTok, LinkedIn en drone shots. Vraag je gratis demo-edit aan.",
  openGraph: {
    title: "SteylVisuals — Vastgoedvideo's die opvallen én converteren",
    description: "Short-form videocontent voor makelaars in Vlaanderen. Meer viewings, meer verkopen.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
