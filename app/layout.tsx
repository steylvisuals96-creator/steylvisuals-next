import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Koppen en het woordmerk: Bricolage Grotesque. Lopende tekst: DM Sans. Zie DESIGN.md.
const kop = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-kop",
  display: "swap",
});

const tekst = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-tekst",
  display: "swap",
});

// Alleen nog voor de SOM Vastgoed-demo (klantpagina met eigen stijl).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-kop",
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
      className={`${kop.variable} ${tekst.variable} ${cormorant.variable}`}
    >
      <head>
        {/* A literal value — theme-color is read by the UA, which has no CSS vars. */}
        <meta name="theme-color" content="#0D0B09" />
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
