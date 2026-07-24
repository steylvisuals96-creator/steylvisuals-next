import Nav from "@/components/Nav";
import LandingHero from "@/components/LandingHero";
import ShowReel from "@/components/ShowReel";
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
      <Nav />
      <main>
        <LandingHero />
        <ServicesGrid />
        <ShowReel />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}
