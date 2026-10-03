import LogoSting from "@/components/LogoSting";
import Home from "@/components/home/Home";

export const metadata = {
  title: "SteylVisuals · Websites en automatisatie op maat",
  description:
    "SteylVisuals bouwt websites op maat met de automatisering erachter: CRM, opvolging en afspraken. Voor bedrijven in België. Vraag je gratis voorstel aan.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      {/* First in the tree so the skip control is the first tab stop. */}
      <LogoSting />
      <Home />
    </>
  );
}
