import type { Metadata } from "next";
import AccessForm from "./AccessForm";
import s from "./toegang.module.css";

export const metadata: Metadata = {
  title: "Toegang · SteylVisuals",
  robots: { index: false, follow: false },
};

/** De toegangspoort, in de look van de Studio: gloed, één glazen paneel, terracotta accent. */
export default function ToegangPage() {
  return (
    <main className={s.pagina}>
      <div className={s.gloed} aria-hidden="true" />
      <div className={s.paneel}>
        <p className={s.woord}>
          Steyl<span>.</span>
        </p>
        <p className={s.visuals}>Visuals</p>
        <p className={s.kicker}>Op uitnodiging</p>
        <h1 className={s.titel}>
          Deze site is voorlopig <em>op uitnodiging</em>.
        </h1>
        <p className={s.tekst}>
          Heb je een toegangscode van Sam gekregen? Vul ze hieronder in. Nog geen code? Mail naar{" "}
          <a href="mailto:steylvisuals96@gmail.com">steylvisuals96@gmail.com</a>.
        </p>
        <AccessForm />
      </div>
    </main>
  );
}
