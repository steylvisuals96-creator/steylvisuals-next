import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
    src: "/videos/web/showreel.mp4",
    poster: "",
    title: "3D render → video",
    tag: "NL",
  },
  {
    src: "https://pub-28e65866cf1641928966914639cc84ef.r2.dev/videos/web/Summum_Pre_-Launch.MOV",
    poster: "",
    title: "3D render → video",
    tag: "ENG",
  },
  {
    src: "https://pub-28e65866cf1641928966914639cc84ef.r2.dev/videos/web/Appartement_Sint-Truiden_Vertical.mp4",
    poster: "",
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
              style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)" }}
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
              style={{ fontFamily: "var(--font-poppins)", fontSize: "1rem", fontWeight: 300, lineHeight: 1.7, color: "var(--cream-muted)", maxWidth: "480px" }}
            >
              Video, content en websites voor bedrijven die willen opvallen. Bekijk wat we al hebben gemaakt.
            </p>
          </div>
        </section>

        {/* Section: Video & Content */}
        <section style={{ padding: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,6rem)" }}>
          <div className="max-w-[1100px] mx-auto mb-12">
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.68rem", fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cream-muted)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
            <p style={{ fontFamily: "var(--font-poppins)", fontSize: "0.9rem", fontWeight: 300, color: "var(--cream-muted)", marginBottom: "2rem" }}>
              Stuur een bericht en ontvang binnen 24u een voorstel op maat.
            </p>
            <a
              href="mailto:Steylvisuals96@gmail.com?subject=Interesse%20in%20SteylVisuals"
              className="inline-block rounded-[2px]"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "0.85rem", fontWeight: 500, backgroundColor: "var(--gold)", color: "var(--black)", padding: "1rem 2.25rem", textDecoration: "none" }}
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
