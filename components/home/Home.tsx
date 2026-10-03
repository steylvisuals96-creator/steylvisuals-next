"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CLIENTS, CTA, DEMO, INDEX, LEAD, MAIL } from "./content";
import { HeroPhoneScreen, MonitorScreen, PhoneScreen } from "./Screens";
import s from "./home.module.css";

/**
 * The homepage: an ordinary scrolling page in four parts. Only the CRM demo
 * holds still while you scroll; its progress is mapped onto the demo timeline
 * (DEMO in content.ts), where every `data-prog="from to"` gets a 0..1 `--s` and
 * every `data-step` inside it gets `data-on` once `--s` passes it.
 */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Renders a screen at device pixels and scales it to the frame's width. */
function Fit({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(([e]) => el.style.setProperty("--fit", String(e.contentRect.width / w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className={s.fit} style={{ aspectRatio: `${w} / ${h}` }}>
      <div className={s.fitInner} style={{ width: w, height: h }}>
        {children}
      </div>
    </div>
  );
}

/** An iPhone Pro in desert titanium: rim, bezel, real corner radius, buttons. */
function IPhone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`${s.iphone} ${className ?? ""}`} aria-hidden="true">
      <i className={s.btnAction} />
      <i className={s.btnVolUp} />
      <i className={s.btnVolDown} />
      <i className={s.btnPower} />
      <div className={s.iphoneRim}>
        <div className={s.iphoneBezel}>
          <Fit w={390} h={844}>
            {children}
          </Fit>
        </div>
      </div>
    </div>
  );
}

function Browser({ domain, src, alt, priority = false }: { domain: string; src: string; alt: string; priority?: boolean }) {
  return (
    <figure className={s.browser}>
      <div className={s.chrome} aria-hidden="true">
        <span className={s.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>{domain}</span>
      </div>
      <img src={src} alt={alt} width={1440} height={900} loading={priority ? "eager" : "lazy"} />
    </figure>
  );
}

export default function Home() {
  const demoRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // The CRM demo: scroll progress through the pinned section drives its timeline.
  useEffect(() => {
    const demo = demoRef.current!;
    const sticky = stickyRef.current!;
    const progs = [...demo.querySelectorAll<HTMLElement>("[data-prog]")].map((el) => {
      const [from, to] = el.dataset.prog!.split(" ").map(Number);
      const steps = [...el.querySelectorAll<HTMLElement>("[data-step]")]
        .filter((st) => st.parentElement?.closest("[data-prog]") === el)
        .map((st) => ({ el: st, at: Number(st.dataset.step) }));
      return { el, from, to, steps };
    });
    const [t0, t1] = DEMO.span;
    let queued = false;
    const update = () => {
      queued = false;
      const rect = demo.getBoundingClientRect();
      const run = demo.offsetHeight - innerHeight;
      const p = run > 0 ? clamp01(-rect.top / run) : 0;
      const t = t0 + p * (t1 - t0);
      sticky.style.setProperty("--p", p.toFixed(4));
      for (const pr of progs) {
        const v = clamp01((t - pr.from) / (pr.to - pr.from));
        pr.el.style.setProperty("--s", v.toFixed(4));
        for (const st of pr.steps) st.el.toggleAttribute("data-on", v >= st.at);
      }
    };
    const queue = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    return () => {
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, []);

  // Which client site is in view.
  useEffect(() => {
    const shots = [...document.querySelectorAll<HTMLElement>("[data-client]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.client));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    shots.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [s0, , , , s4] = DEMO.stages;
  const stepAt = (i: number) => ((DEMO.stages[i] - s0 + 0.01) / (s4 - s0 + 0.02)).toFixed(3);

  return (
    <div className={s.root}>
      <div className={s.grain} aria-hidden="true" />

      <header className={s.header}>
        <Link href="/" className={s.brand} aria-label="SteylVisuals, naar boven">
          <Logo size={30} />
        </Link>
        <nav className={s.headerLinks} aria-label="Hoofdmenu">
          <Link href="/webdesign">Webdesign</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/vastgoed-marketing">Video</Link>
          <Link href={CTA.href} className={s.btn}>
            {CTA.label}
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className={s.hero}>
          <div className={s.heroCopy}>
            <h1 className={s.display}>Websites die je klanten binnenhalen.</h1>
            <p className={s.sub}>
              Op maat gebouwd, met de automatisering erachter: CRM, opvolging en afspraken. Voor bedrijven in België.
            </p>
            <div className={s.actions}>
              <Link href={CTA.href} className={s.btn}>
                {CTA.label}
              </Link>
              <a className={s.textLink} href="#werk">
                Bekijk het werk
              </a>
            </div>
          </div>
          <div className={s.heroVisual}>
            <Browser domain={CLIENTS[0].domain} src={CLIENTS[0].shot} alt="De homepage van Specified, gebouwd door SteylVisuals" priority />
            <IPhone className={s.heroPhone}>
              <HeroPhoneScreen />
            </IPhone>
          </div>
        </section>

        {/* Client sites */}
        <section className={s.work} id="werk">
          <div className={s.workIntro}>
            <p className={s.kicker}>Echte sites, voor echte klanten</p>
            <h2 className={s.headline}>Eerst het plan. Dan bouwen we het, tot op de pixel.</h2>
            <p className={s.sub}>
              Ontwerp, code en CMS op maat, met SEO en Google Analytics. Geen template, geen pagebuilder. Live binnen twee weken.
            </p>
            <ol className={s.clients}>
              {CLIENTS.map((c, i) => (
                <li key={c.id} data-active={i === active || undefined}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <span className={s.clientName}>{c.name}</span>
                    <span className={s.clientText}>{c.text}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <div className={s.shots}>
            {CLIENTS.map((c, i) => (
              <div key={c.id} className={s.shot} data-client={i}>
                <Browser domain={c.domain} src={c.shot} alt={`De homepage van ${c.name}`} />
                <div className={s.shotCaption}>
                  <h3 className={s.title}>{c.name}</h3>
                  <p className={s.sub}>{c.text}</p>
                  <a className={s.textLink} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    Bekijk de site
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The CRM demo, pinned while it runs */}
        <section ref={demoRef} className={s.demo} aria-label="Voorbeeldscenario: een aanvraag die vanzelf een afspraak wordt">
          <div ref={stickyRef} className={s.demoSticky}>
            <div className={s.demoCopy}>
              <div className={s.intro}>
                <p className={s.clockBig}>23:14.</p>
                <p className={s.sub}>Je kantoor is dicht. Je website niet.</p>
              </div>
              <div className={s.explain}>
                <h2 className={s.headline}>Terwijl jij slaapt, volgt je website op.</h2>
                <p className={s.sub}>
                  Aanvraag, bevestiging, CRM, opvolging en afspraak. Automatisch, in jouw huisstijl, gekoppeld aan de tools die je al gebruikt.
                </p>
                <ol className={s.steps} data-prog={`${s0 - 0.01} ${s4 + 0.01}`}>
                  {LEAD.steps.map((st, i) => (
                    <li key={st.title} data-step={stepAt(i)}>
                      <time>{st.time}</time>
                      <span>{st.title}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className={s.devices}>
              <div className={s.monitorFrame} aria-hidden="true">
                <Fit w={1600} h={900}>
                  <MonitorScreen />
                </Fit>
              </div>
              <IPhone className={s.demoPhone}>
                <PhoneScreen />
              </IPhone>
            </div>
          </div>
        </section>

        {/* Close */}
        <section className={s.close}>
          <h2 className={s.display}>Klaar om jouw systeem te bouwen?</h2>
          <p className={s.sub}>Stuur een bericht en ontvang binnen 24 uur een gratis voorstel op maat.</p>
          <div className={s.actions}>
            <Link href={CTA.href} className={s.btn}>
              {CTA.label}
            </Link>
            <a className={s.textLink} href={`mailto:${MAIL}?subject=Nieuw%20project`}>
              {MAIL}
            </a>
          </div>
          <ul className={s.index}>
            {INDEX.map((l) => (
              <li key={l.href}>
                <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className={s.colophon}>© 2026 SteylVisuals · Sam Steylaerts</p>
        </section>
      </main>
    </div>
  );
}
