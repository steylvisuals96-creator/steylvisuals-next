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
  title: "SteylVisuals — Premium video & webdesign voor makelaars",
  description: "Creative studio in België: cinematic vastgoedvideo's en professionele websites voor makelaars en bedrijven. Vraag je gratis voorstel aan.",
  metadataBase: new URL("https://steylvisuals-next.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SteylVisuals — Premium video & webdesign voor makelaars",
    description: "Cinematic vastgoedvideo en websites die converteren. Meer viewings, meer verkopen.",
    type: "website",
    url: "https://steylvisuals-next.vercel.app",
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
    title: "SteylVisuals — Premium video & webdesign voor makelaars",
    description: "Cinematic vastgoedvideo en websites die converteren. Meer viewings, meer verkopen.",
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
              description: "Creative studio voor makelaars: cinematic vastgoedvideo's en professionele websites. Instagram Reels, TikTok, drone shots en webdesign.",
              url: "https://steylvisuals-next.vercel.app",
              email: "Steylvisuals96@gmail.com",
              founder: {
                "@type": "Person",
                name: "Sam Steylaerts",
              },
              sameAs: [
                "https://www.instagram.com/steylvisuals",
              ],
              serviceType: ["Real Estate Video Production", "Web Design"],
              areaServed: "Belgium",
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
