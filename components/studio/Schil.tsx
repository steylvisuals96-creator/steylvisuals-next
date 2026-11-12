"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LINKS_VOET, MENU, TABS_HOME, TABS_PAGINA } from "./menu";
import s from "./schil.module.css";

/**
 * De Studio-schil rond elke pagina: vervaagde gloed, een zwevende glazen
 * navigatiebalk (desktop), bovenbalk en tabbalk (gsm) en de voet. Op de homepage geeft Start de actieve
 * sectie door terwijl je scrolt; op de andere pagina's is `actief` de pagina.
 *
 * `thema` zet de oude tokens van de site (--black, --gold, ...) om naar de
 * Studio-kleuren, zodat oudere onderdelen binnen de schil mee veranderen.
 */

const ALLE = MENU.flatMap((g) => g.links);

/** De links in de navigatiebalk op desktop. Webdesign en Vastgoedvideo pas vanaf brede schermen. */
const KOP = ["websites", "beeld", "automatisatie", "social", "portfolio", "webdesign", "vastgoed", "werkwijze"];

function Woordmerk({ klein = false }: { klein?: boolean }) {
  return (
    <Link href="/#start" className={`${s.woordmerk} ${klein ? s.klein : ""}`} aria-label="SteylVisuals, naar de start">
      <span className={s.woord}>
        Steyl<span>.</span>
      </span>
      {!klein && <span className={s.visuals}>Visuals</span>}
    </Link>
  );
}

/** Lichtvlek onder de muis op elk element met `data-g` (Glans in de Studio). Alleen met een fijne aanwijzer. */
export function useGlans() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let vorig: HTMLElement | null = null;
    const beweeg = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-g]") ?? null;
      if (vorig && vorig !== el) vorig.removeAttribute("data-glans");
      vorig = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.setAttribute("data-glans", "");
    };
    addEventListener("pointermove", beweeg, { passive: true });
    return () => removeEventListener("pointermove", beweeg);
  }, []);
}

export function Voet() {
  return (
    <footer className={s.voet}>
      <ul>
        {LINKS_VOET.map((l) => (
          <li key={l.href}>
            <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p>© 2026 SteylVisuals · Sam Steylaerts · Herent</p>
    </footer>
  );
}

export default function Schil({
  actief,
  thuis = false,
  thema = false,
  className = "",
  rootRef,
  children,
}: {
  actief: string;
  thuis?: boolean;
  thema?: boolean;
  className?: string;
  rootRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  const kopRef = useRef<HTMLElement>(null);
  const [blok, setBlok] = useState<{ left: number; w: number } | null>(null);
  useGlans();

  // Op de homepage blijven de ankers op dezelfde pagina; elders gaan ze naar de homepage.
  const href = (l: { href: string }) => (thuis && l.href.startsWith("/#") ? l.href.slice(1) : l.href);

  // Een glazen blok glijdt achter de actieve link in de navigatiebalk, zoals het actieve blok in de Studio.
  useEffect(() => {
    const plaats = () => {
      const a = kopRef.current?.querySelector<HTMLElement>(`[data-link="${actief}"]`);
      setBlok(a && a.offsetWidth ? { left: a.offsetLeft, w: a.offsetWidth } : null);
    };
    plaats();
    addEventListener("resize", plaats);
    return () => removeEventListener("resize", plaats);
  }, [actief]);

  const tabs = (thuis ? TABS_HOME : TABS_PAGINA).map((id) => ALLE.find((l) => l.id === id)!);
  const tabIndex = tabs.findIndex((t) => t.id === actief);

  return (
    <div ref={rootRef} className={`${s.root} ${thema ? "studio-thema" : ""} ${className}`}>
      <a href="#inhoud" className={s.spring}>
        Naar de inhoud
      </a>
      <div className={s.gloed} aria-hidden="true" />

      {/* Desktop: een zwevende glazen navigatiebalk bovenaan */}
      <header className={s.kopbalk}>
        <div className={s.kopGlas} data-g="">
          <Woordmerk />
          <nav ref={kopRef} className={s.kopLijst} aria-label="Hoofdmenu">
            {blok && <span className={s.kopBlok} style={{ left: blok.left, width: blok.w }} aria-hidden="true" />}
            <ul>
              {KOP.map((id) => {
                const l = ALLE.find((x) => x.id === id)!;
                return (
                  <li key={l.id} data-extra={id === "webdesign" || id === "vastgoed" || undefined}>
                    <Link href={href(l)} data-link={l.id} aria-current={actief === l.id ? (thuis ? "true" : "page") : undefined}>
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <a href={thuis ? "#contact" : "/#contact"} className={s.knop}>
            Start je project
          </a>
        </div>
      </header>

      <header className={s.bovenbalk}>
        <Woordmerk klein />
        <a href={thuis ? "#contact" : "/#contact"} className={s.knopKlein}>
          Contact
        </a>
      </header>
      <nav className={s.tabbalk} aria-label="Snel naar">
        <span
          className={s.tabLijn}
          aria-hidden="true"
          style={{
            left: `calc(${Math.max(0, tabIndex) * (100 / tabs.length)}% + 5%)`,
            width: `calc(${100 / tabs.length}% - 10%)`,
            opacity: tabIndex >= 0 ? 1 : 0,
          }}
        />
        <ul style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((t) => (
            <li key={t.id}>
              <Link href={href(t)} aria-current={actief === t.id ? "true" : undefined}>
                {t.kort}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main id="inhoud" className={s.main}>
        {children}
      </main>
    </div>
  );
}
