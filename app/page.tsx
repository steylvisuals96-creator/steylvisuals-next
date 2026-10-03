import LogoSting from "@/components/LogoSting";
import Bouwplan from "@/components/bouwplan/Bouwplan";

export const metadata = {
  title: "SteylVisuals · Websites en automatisatie op maat",
  description:
    "SteylVisuals bouwt websites op maat met de automatisering erachter: CRM, opvolging en afspraken. Voor bedrijven in België. Vraag je gratis voorstel aan.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      {/* First in the tree so the skip control is the first tab stop. */}
      <LogoSting />
      <Bouwplan />
    </>
  );
}
