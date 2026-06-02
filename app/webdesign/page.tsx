import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WebdesignClient from "@/components/WebdesignClient";

export const metadata = {
  title: "Webdesign voor makelaars — SteylVisuals",
  description: "Professionele websites en landing pages voor makelaars. SEO-geoptimaliseerd, snel en op maat. Combineer met video voor maximaal resultaat.",
  alternates: { canonical: "/webdesign" },
};

export default function WebdesignPage() {
  return (
    <>
      <Nav />
      <main>
        <WebdesignClient />
      </main>
      <Footer />
    </>
  );
}
