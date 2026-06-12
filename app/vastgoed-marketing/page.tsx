import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Showcase from "@/components/Showcase";
import OverMij from "@/components/OverMij";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Vastgoed Marketing — SteylVisuals",
  description: "Cinematic short-form video voor makelaars. Instagram Reels, TikTok, LinkedIn en drone shots. Vraag je gratis demo-edit aan.",
  alternates: { canonical: "/vastgoed-marketing" },
};

export default function VastgoedMarketingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Process />
        <Pricing />
        <Showcase />
        <OverMij />
        <FAQ />
        <ContactForm />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
