import LogoSting from "@/components/LogoSting";
import Nav from "@/components/Nav";
import LandingHero from "@/components/LandingHero";
import ServicesGrid from "@/components/ServicesGrid";
import LandingCTA from "@/components/LandingCTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SteylVisuals — Premium Creative Studio België",
  description: "SteylVisuals is een creative studio in België. Wij maken premium video, content en websites voor bedrijven die willen groeien.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      {/* First in the tree so the skip control is the first tab stop. */}
      <LogoSting />
      <Nav />
      <main>
        <LandingHero />
        <ServicesGrid />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}
