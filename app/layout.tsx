import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { STING_GATE } from "@/components/LogoSting";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

// Wordmark only. Never exposed to page content — see DESIGN.md, The Locked Wordmark Rule.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SteylVisuals — Premium video & webdesign voor bedrijven",
  description: "Creative studio in België: premium video, content en professionele websites voor bedrijven die willen groeien. Vraag je gratis voorstel aan.",
  metadataBase: new URL("https://steylvisuals.be"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SteylVisuals — Premium video & webdesign voor bedrijven",
    description: "Premium video, content en websites die converteren. Jouw creatieve partner in België.",
    type: "website",
    url: "https://steylvisuals.be",
    siteName: "SteylVisuals",
    locale: "nl_BE",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SteylVisuals — Creative Studio België",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SteylVisuals — Premium video & webdesign voor bedrijven",
    description: "Premium video, content en websites die converteren. Jouw creatieve partner in België.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      className={`${cormorant.variable} ${poppins.variable} ${montserrat.variable}`}
    >
      <head>
        {/* A literal value — theme-color is read by the UA, which has no CSS vars. */}
        <meta name="theme-color" content="#0D0B09" />
        <Script id="sting-gate" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: STING_GATE }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "SteylVisuals",
              description: "Creative studio in België: premium video, content en professionele websites voor bedrijven die willen groeien.",
              url: "https://steylvisuals.be",
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
      </body>
    </html>
  );
}
