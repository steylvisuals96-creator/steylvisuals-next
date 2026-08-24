import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { CASES } from "@/lib/cases";
import VideoReelGrid, { type Reel } from "@/components/VideoReelGrid";
import WebsitePortfolio from "@/components/WebsitePortfolio";

export const metadata = {
  title: "Portfolio — SteylVisuals",
  description: "Video, content en websites gemaakt door SteylVisuals. Bekijk onze projecten voor bedrijven in België.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — SteylVisuals",
    description: "Video, content en websites voor bedrijven in België.",
    url: "https://steylvisuals.be/portfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Portfolio — SteylVisuals",
    images: ["/og-image.jpg"],
  },
};

const REELS: Reel[] = [
  {
    src: "/videos/web/appartement-sint-truiden-reel.mp4",
    poster: "/videos/web/appartement-sint-truiden-reel-poster.jpg",
    title: "Appartement",
    location: "Sint-Truiden",
    tag: "Reel",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "var(--black)" }}>
        {/* Hero */}
        <section style={{ padding: "clamp(8rem,16vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vh,5rem)" }}>
          <div className="max-w-[1100px] mx-auto">
            <p
              className="inline-flex items-center gap-2 mb-6"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold)" }}
            >
              Portfolio
            </p>
            <h1
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.75rem, 6vw, 4.75rem)", fontWeight: 300, lineHeight: 1.04, letterSpacing: 0, color: "var(--cream)", maxWidth: "640px" }}
            >
              Elk project,{" "}
              <em style={{ fontStyle: "italic", color: "var(--gold)" }}>een verhaal</em>
            </h1>
            <p
              className="mt-6"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "1rem", fontWeight: 400, lineHeight: 1.7, color: "var(--cream-muted)", maxWidth: "480px" }}
            >
              Video, content en websites voor bedrijven die willen opvallen. Bekijk wat we al hebben gemaakt.
            </p>

            {/* Concreet bewijs i.p.v. een belofte over betrouwbaarheid — zelfde
                signaal als de link in de footer, hier bovenaan zodat een
                sceptische bezoeker het meteen ziet. */}
            <a
              href="https://stats.uptimerobot.com/aIPn0em2Sd"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3"
              style={{
                border: "1px solid rgba(62,207,114,0.3)",
                backgroundColor: "rgba(62,207,114,0.06)",
                borderRadius: "var(--r-sm)",
                padding: "0.6rem 1.1rem",
                textDecoration: "none",
              }}
            >
              <span
                aria-hidden="true"
                className="w-2 h-2 rounded-full"
                style={{ background: "#3ecf72", boxShadow: "0 0 8px rgba(62,207,114,0.7)" }}
              />
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.8rem", fontWeight: 500, color: "var(--cream)" }}>
                Live uptime-status
              </span>
              <span style={{ fontFamily: "var(--font-poppins)", fontSize: "0.75rem", color: "var(--cream-muted)" }}>
                — bekijk zelf
              </span>
            </a>
          </div>
        </section>

        {/* Cases open the page: real client work, each leading to its own page.
            Adding one is a data entry in lib/cases.ts. */}
        <section style={{ padding: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,6rem)" }}>
          <div className="max-w-[1100px] mx-auto mb-12">
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--cream-muted)" }}>
              Uitgelicht werk
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)", marginTop: "0.5rem" }}>
              Cases
            </h2>
          </div>
          <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
            {CASES.map((c, i) => (
              <CaseCard key={c.slug} item={c} index={i} />
            ))}
          </div>
        </section>

        {/* Section: Video & Content */}
        <section style={{ padding: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,6rem)" }}>
          <div className="max-w-[1100px] mx-auto mb-12">
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              Video &amp; Content
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)", marginTop: "0.5rem" }}>
              Reels &amp; Brand video
            </h2>
          </div>
          <VideoReelGrid reels={REELS} />
        </section>

        {/* Section: Websites */}
        <section style={{ padding: "clamp(4rem,8vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
          <div className="max-w-[1100px] mx-auto mb-12">
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--cream-muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              Webdesign &amp; CMS
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)", marginTop: "0.5rem" }}>
              Websites op maat
            </h2>
          </div>
          <WebsitePortfolio />
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
          <div
            className="text-center max-w-[1100px] mx-auto pt-14"
            style={{ borderTop: "1px solid rgba(241,237,230,0.08)" }}
          >
            <p className="mb-3" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 300, color: "var(--cream)" }}>
              Jouw project hier?
            </p>
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "1rem", fontWeight: 400, color: "var(--cream-muted)", marginBottom: "2rem" }}>
              Stuur een bericht en ontvang binnen 24u een voorstel op maat.
            </p>
            <a
              href="mailto:Steylvisuals96@gmail.com?subject=Interesse%20in%20SteylVisuals"
              className="inline-block rounded-[2px]"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "1rem", fontWeight: 500, backgroundColor: "var(--gold)", color: "var(--black)", padding: "1rem 2.25rem", textDecoration: "none" }}
            >
              Gratis gesprek aanvragen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
