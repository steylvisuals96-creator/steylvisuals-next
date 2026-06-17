import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "Website Quiz — Welke stijl past bij uw kantoor? | SteylVisuals",
  description: "Beantwoord 8 korte vragen en ontdek welke websitestijl het best bij uw vastgoedkantoor past. Bekijk de demo live en vraag een voorstel aan.",
  alternates: { canonical: "/website-quiz" },
};

export default function WebsiteQuizPage() {
  return <QuizClient />;
}
