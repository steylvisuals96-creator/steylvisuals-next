import type { Metadata } from "next";
import Logo from "@/components/Logo";
import AccessForm from "./AccessForm";

export const metadata: Metadata = {
  title: "Toegang · SteylVisuals",
  robots: { index: false, follow: false },
};

export default function ToegangPage() {
  return (
    <main
      style={{
        minHeight: "100svh", display: "grid", placeItems: "center",
        background: "var(--black)", color: "var(--cream)", padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "26rem" }}>
        <Logo size={40} />
        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif", fontWeight: 400,
            fontSize: "clamp(2rem, 6vw, 2.75rem)", lineHeight: 1.1, margin: "3rem 0 1rem",
          }}
        >
          Deze site is voorlopig op uitnodiging.
        </h1>
        <p style={{ color: "var(--cream-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Heb je een toegangscode van Sam gekregen? Vul ze hieronder in.
          Nog geen code? Mail naar{" "}
          <a href="mailto:steylvisuals96@gmail.com" style={{ color: "var(--gold)" }}>steylvisuals96@gmail.com</a>.
        </p>
        <AccessForm />
      </div>
    </main>
  );
}
