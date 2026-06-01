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
  description: "Professionele short-form videocontent voor makelaars. Instagram Reels, TikTok, LinkedIn en drone shots. Vraag je gratis demo-edit aan.",
  metadataBase: new URL("https://steylvisualsnext.netlify.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SteylVisuals — Vastgoedvideo's die opvallen én converteren",
    description: "Short-form videocontent voor makelaars. Meer viewings, meer verkopen.",
    type: "website",
    url: "https://steylvisualsnext.netlify.app",
    siteName: "SteylVisuals",
    locale: "nl_BE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SteylVisuals — Cinematic real estate video",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SteylVisuals — Vastgoedvideo's die opvallen én converteren",
    description: "Short-form videocontent voor makelaars. Meer viewings, meer verkopen.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" async></script>
      </head>
      <body style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "SteylVisuals",
              description: "Professionele short-form videocontent voor makelaars. Instagram Reels, TikTok, LinkedIn en drone shots.",
              url: "https://steylvisualsnext.netlify.app",
              email: "Steylvisuals96@gmail.com",
              founder: {
                "@type": "Person",
                name: "Sam Steylaerts",
              },
              sameAs: [
                "https://www.instagram.com/steylvisuals",
              ],
              serviceType: "Real Estate Video Production",
              areaServed: "Worldwide",
              priceRange: "€€",
            }),
          }}
        />
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", user => {
              if (!user) {
                window.netlifyIdentity.on("login", () => {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}} />
      </body>
    </html>
  );
}
