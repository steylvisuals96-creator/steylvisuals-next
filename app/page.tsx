import Nav from "@/components/Nav";
import LandingHero from "@/components/LandingHero";
import ServicesGrid from "@/components/ServicesGrid";
import LandingCTA from "@/components/LandingCTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SteylVisuals — Premium Creative Studio België",
  description: "SteylVisuals maakt cinematic vastgoedvideo en professionele websites voor makelaars en bedrijven in België.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Nav dark />
      <main>
        <LandingHero />
        <ServicesGrid />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}
