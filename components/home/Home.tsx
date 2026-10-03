"use client";

/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CLIENTS, CTA, DEMO, INDEX, LEAD, MAIL, type Client } from "./content";
import { HeroPhoneScreen, MonitorScreen, PhoneScreen } from "./Screens";
import ContactForm from "./ContactForm";
import s from "./home.module.css";

/**
 * The homepage: an ordinary scrolling page in four parts. Only the CRM demo
 * holds still while you scroll; its progress is mapped onto the demo timeline
 * (DEMO in content.ts), where every `data-prog="from to"` gets a 0..1 `--s` and
 * every `data-step` inside it gets `data-on` once `--s` passes it.
 *
 * Motion, by purpose: the hero devices arrive once and the request lands on the
 * phone (explanation); the hero and the demo devices sit at different depths as
 * you scroll (spatial); each client site scrolls inside its own browser window
 * (explanation); the client marker slides between names (spatial); headings
 * rise line by line once. Scroll-linked motion uses CSS scroll timelines where
 * the browser has them, and everything degrades to still under reduced motion.
 */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const reducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

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
function IPhone({ children, className, phoneRef }: { children: React.ReactNode; className?: string; phoneRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={phoneRef} className={`${s.iphone} ${className ?? ""}`} aria-hidden="true">
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

/**
 * A browser window. With `client`, the window shows that site moving as the
 * page scrolls past: a long page scrolls inside it, a scroll-driven site plays
 * through its frames.
 */
function Browser({ domain, src, alt, client, priority = false }: { domain: string; src?: string; alt: string; client?: Client; priority?: boolean }) {
  const frames = client?.frames;
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
      <div className={s.viewport}>
        {client?.tall && <img className={s.tallImg} src={client.tall} alt={alt} width={1200} height={3750} loading="lazy" />}
        {frames &&
          frames.map((f, i) => (
            <img
              key={f}
              className={s.seqFrame}
              src={f}
              alt={i === 0 ? alt : ""}
              width={1200}
              height={750}
              loading="lazy"
              style={{ "--a": `${18 + (i - 1) * 12}%`, "--b": `${22 + (i - 1) * 12}%` } as React.CSSProperties}
            />
          ))}
        {!client && src && <img className={s.still} src={src} alt={alt} width={1440} height={900} loading={priority ? "eager" : "lazy"} />}
      </div>
    </figure>
  );
}

/** A heading whose words rise into place once it scrolls into view. */
function Rise({ text, as: Tag = "h2", className }: { text: string; as?: "h2" | "h1"; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`${className ?? ""} ${s.rise}`} aria-label={text}>
      {text.split(" ").map((w, i, all) => (
        <Fragment key={i}>
          <span className={s.word} aria-hidden="true">
            <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
          </span>
          {i < all.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const demoPhoneRef = useRef<HTMLDivElement>(null);
  const monitorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  // Motion that hides content until JS runs is opted into here, so the page
  // still reads fully before hydration and for anything that never runs JS.
  useEffect(() => {
    rootRef.current!.setAttribute("data-anim", "");
  }, []);

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
    const [m0, m1] = DEMO.monitorOn;
    const s0 = DEMO.stages[0];
    const still = reducedMotion();
    let queued = false;
    const update = () => {
      queued = false;
      const rect = demo.getBoundingClientRect();
      const run = demo.offsetHeight - innerHeight;
      const p = run > 0 ? clamp01(-rect.top / run) : 0;
      const t = t0 + p * (t1 - t0);
      sticky.style.setProperty("--p", p.toFixed(4));
      // Light the devices throw on the desk as they come on.
      sticky.style.setProperty("--mon", clamp01((t - m0) / (m1 - m0)).toFixed(3));
      const s4 = DEMO.stages[4];
      const lit = clamp01((t - s0 + 0.04) / 0.08) * (1 - clamp01((t - s0 - 0.45) / 0.15)) + clamp01((t - s4 + 0.04) / 0.08);
      sticky.style.setProperty("--wake", clamp01(lit).toFixed(3));
      for (const pr of progs) {
        const v = clamp01((t - pr.from) / (pr.to - pr.from));
        pr.el.style.setProperty("--s", v.toFixed(4));
        for (const st of pr.steps) st.el.toggleAttribute("data-on", v >= st.at);
      }
      if (!still) {
        // The phone is nearer the eye than the monitor, so it travels further.
        const d = 0.5 - p;
        if (demoPhoneRef.current) demoPhoneRef.current.style.transform = `translate3d(0, ${(d * 70).toFixed(1)}px, 0)`;
        if (monitorRef.current) monitorRef.current.style.transform = `translate3d(0, ${(d * 22).toFixed(1)}px, 0)`;
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

  // Header: steps aside while you read down, comes back the moment you scroll up.
  useEffect(() => {
    const header = headerRef.current!;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      header.toggleAttribute("data-solid", y > 40);
      if (Math.abs(y - last) > 6) {
        header.toggleAttribute("data-hidden", y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Hero: the devices lean a little toward the pointer. Fine pointers only.
  useEffect(() => {
    if (reducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const hero = heroRef.current!;
    const tilt = tiltRef.current!;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      tilt.style.transform = `perspective(1600px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
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

  // The marker slides to the active name.
  useEffect(() => {
    const li = listRef.current?.children[active] as HTMLElement | undefined;
    if (li && markerRef.current) markerRef.current.style.transform = `translateY(${li.offsetTop}px)`;
  }, [active]);

  const [s0, , , , s4] = DEMO.stages;
  const stepAt = (i: number) => ((DEMO.stages[i] - s0 + 0.01) / (s4 - s0 + 0.02)).toFixed(3);
  const current = CLIENTS[active];

  return (
    <div ref={rootRef} className={s.root}>
      <div className={s.grain} aria-hidden="true" />

      <header ref={headerRef} className={s.header}>
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
        <section ref={heroRef} className={s.hero}>
          <div className={s.heroBg} aria-hidden="true" />
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
            <div ref={tiltRef} className={s.tilt}>
              <div className={s.heroBrowser}>
                <Browser domain={CLIENTS[0].domain} src={CLIENTS[0].shot} alt="De homepage van Specified, gebouwd door SteylVisuals" priority />
              </div>
              <div className={s.phoneDepth}>
                <IPhone className={s.heroPhone}>
                  <HeroPhoneScreen />
                </IPhone>
              </div>
            </div>
          </div>
        </section>

        {/* Client sites */}
        <section className={s.work} id="werk">
          <div className={s.workIntro}>
            <p className={s.kicker}>Echte sites, voor echte klanten</p>
            <Rise className={s.headline} text="Eerst het plan. Dan bouwen we het, tot op de pixel." />
            <p className={s.sub}>
              Ontwerp, code en CMS op maat, met SEO en Google Analytics. Geen template, geen pagebuilder. Live binnen twee weken.
            </p>
            <div className={s.clientNav}>
              <span ref={markerRef} className={s.marker} aria-hidden="true" />
              <ol ref={listRef} className={s.clients}>
                {CLIENTS.map((c, i) => (
                  <li key={c.id} data-active={i === active || undefined}>
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                      {c.name}
                    </a>
                  </li>
                ))}
              </ol>
              <p key={current.id} className={s.clientDetail}>
                {current.text}
              </p>
            </div>
          </div>
          <div className={s.shots}>
            {CLIENTS.map((c, i) => (
              <div key={c.id} className={s.shot} data-client={i}>
                <Browser domain={c.domain} client={c} alt={`De site van ${c.name}`} />
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
              <div ref={monitorRef} className={s.monitorFrame} aria-hidden="true">
                <Fit w={1600} h={900}>
                  <MonitorScreen />
                </Fit>
              </div>
              <IPhone className={s.demoPhone} phoneRef={demoPhoneRef}>
                <PhoneScreen />
              </IPhone>
            </div>
          </div>
        </section>

        {/* Close */}
        <section className={s.close} id="contact">
          <div className={s.closeGrid}>
            <div className={s.closeCopy}>
              <Rise className={s.display} text="Klaar om jouw systeem te bouwen?" />
              <p className={s.sub}>Stuur een bericht en ontvang binnen 24 uur een gratis voorstel op maat.</p>
              <p className={s.closeAlt}>
                Liever mailen?{" "}
                <a className={s.textLink} href={`mailto:${MAIL}?subject=Nieuw%20project`}>
                  {MAIL}
                </a>
              </p>
            </div>
            <ContactForm />
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
