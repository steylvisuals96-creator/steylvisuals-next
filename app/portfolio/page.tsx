import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VideoReelGrid, { type Reel } from "@/components/VideoReelGrid";

export const metadata = {
  title: "Portfolio — SteylVisuals",
  description: "Bekijk cinematic vastgoedvideo's van SteylVisuals: Reels en socials voor makelaars in Limburg en omstreken.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — SteylVisuals",
    description: "Cinematic vastgoedvideo's voor makelaars.",
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
    src: "/videos/web/appartement-sint-truiden.mp4",
    poster: "/videos/web/appartement-sint-truiden.jpg",
    title: "Appartement",
    location: "Sint-Truiden",
    tag: "Reel",
  },
  {
    src: "/videos/web/website-video.mp4",
    poster: "/videos/web/website-video.jpg",
    title: "Website reel",
    tag: "Promo",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Nav dark />
      <main style={{ backgroundColor: "#0A0A0A" }}>
        {/* Hero */}
        <section style={{ padding: "clamp(8rem,16vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vh,5rem)" }}>
          <div className="max-w-[1100px] mx-auto">
            <p
              className="inline-flex items-center gap-2 mb-6"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.68rem",
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#B8843A",
              }}
            >
              <span className="w-5 h-px" style={{ backgroundColor: "#B8843A" }} />
              Portfolio
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2.6rem,6vw,5rem)",
                fontWeight: 400,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                color: "#FDFAF7",
                maxWidth: "640px",
              }}
            >
              Elk pand,{" "}
              <em style={{ fontStyle: "italic", color: "#B8843A" }}>een verhaal</em>
            </h1>
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "1rem",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "rgba(253,250,247,0.5)",
                maxWidth: "440px",
              }}
            >
              Verticale video&apos;s op maat van Reels en TikTok. Zet je geluid aan voor het volledige effect.
            </p>
          </div>
        </section>

        {/* Video reels */}
        <section style={{ padding: "0 clamp(1.5rem,6vw,5rem) clamp(5rem,10vh,8rem)" }}>
          <VideoReelGrid reels={REELS} />

          {/* CTA */}
          <div
            className="text-center mt-20 pt-14 max-w-[1100px] mx-auto"
            style={{ borderTop: "1px solid rgba(253,250,247,0.08)" }}
          >
            <p
              className="mb-6"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.6rem,3vw,2.4rem)",
                fontWeight: 400,
                color: "#FDFAF7",
              }}
            >
              Wil jij ook zo&apos;n video voor jouw pand?
            </p>
            <a
              href="mailto:Steylvisuals96@gmail.com?subject=Gratis%20demo-edit%20aanvraag"
              className="inline-block rounded-full"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.85rem",
                fontWeight: 500,
                backgroundColor: "#B8843A",
                color: "#0A0A0A",
                padding: "1rem 2.25rem",
                textDecoration: "none",
              }}
            >
              Gratis demo-edit aanvragen
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
