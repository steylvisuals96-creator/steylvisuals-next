"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LEGS, LEG_START, TOTAL, BEAT, BAYS, legAt, clamp01, smooth } from "./track";
import { CLIENTS, CTA, INDEX, LEAD, MAIL } from "./content";
import { LaptopScreen, MonitorScreen, OfficePhoneScreen, StudioPhoneScreen } from "./Screens";
import type { ScreenId } from "./world";
import s from "./bouwplan.module.css";

/**
 * The homepage as one continuous flight (scrollcraft worldflight contract):
 * one fixed stage, one fixed copy layer, and an empty spacer as the only thing
 * in document flow. Scroll moves a smoothed playhead `t` and everything else is
 * a function of it.
 *
 * Copy blocks declare `data-win="from to"` in track units, plateau-shaped so a
 * heading sits at full strength for most of its window. `data-prog="from to"`
 * writes a 0..1 `--s` for scrubbed CSS, and `data-step` children inside it
 * get `data-on` as `--s` passes them. The device screens in the 3D world are
 * rendered here too, through portals into the containers the world creates.
 */

const LERP = 0.12;
const RAMP = 0.22;

type Win = { el: HTMLElement; from: number; to: number; hero: boolean; finale: boolean };
type Prog = { el: HTMLElement; from: number; to: number; steps: { el: HTMLElement; at: number }[] };

// Where a reduced-motion visitor's camera rests in each stretch: the posters.
function restingT(t: number) {
  if (t < 0.8) return 0;
  if (t < LEG_START[1]) return 1.6;
  if (t < LEG_START[2]) return t < 2.9 ? 2.5 : 3.35;
  if (t < LEG_START[3]) {
    return BEAT.bays.reduce((best, b) => (Math.abs(b - t) < Math.abs(best - t) ? b : best), BEAT.bays[0]);
  }
  if (t < BEAT.silence[1]) return 6.75;
  if (t < BEAT.stages[1] - 0.2) return 7.38;
  if (t < BEAT.stages[4] + 0.05) return 8.6;
  if (t < LEG_START[4]) return 9.82;
  return TOTAL;
}

export default function Bouwplan() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const cssRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<(extra?: HTMLElement[]) => void>(() => {});
  const [hosts, setHosts] = useState<Record<ScreenId, HTMLElement> | null>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const canvas = canvasRef.current!;
    const spacer = spacerRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(pointer: coarse)").matches || innerWidth < 760;

    // A stable viewport height: mobile URL bars resize innerHeight while you
    // scroll, and the track must not stretch under the reader's thumb.
    let vh = document.documentElement.clientHeight;
    let vw = innerWidth;
    const layout = (force = false) => {
      const nh = document.documentElement.clientHeight;
      if (nh > 0 && (force || innerWidth !== vw || Math.abs(nh - vh) > 140)) {
        vw = innerWidth;
        vh = nh;
        spacer.style.height = `${(TOTAL + 1) * vh}px`;
      }
      world?.resize(canvas.clientWidth, canvas.clientHeight);
    };

    let wins: Win[] = [];
    let progs: Prog[] = [];
    // Run again once the device screens have been portalled into the world.
    // The world only attaches a screen to the document once it is first in
    // view, so the screen containers are searched directly as well.
    const scan = (extra: HTMLElement[] = []) => {
      const all = (sel: string) => [...new Set([root, ...extra].flatMap((r) => [...r.querySelectorAll<HTMLElement>(sel)]))];
      wins = all("[data-win]").map((el) => {
        const v = el.dataset.win!;
        if (v === "hero") return { el, from: -1, to: 1.2, hero: true, finale: false };
        if (v === "finale") return { el, from: Number(el.dataset.from ?? 10.4), to: Infinity, hero: false, finale: true };
        const [from, to] = v.split(" ").map(Number);
        return { el, from, to, hero: false, finale: false };
      });
      progs = all("[data-prog]").map((el) => {
        const [from, to] = el.dataset.prog!.split(" ").map(Number);
        // A step belongs to its nearest scrubbed ancestor only.
        const steps = [...el.querySelectorAll<HTMLElement>("[data-step]")]
          .filter((st) => st.parentElement?.closest("[data-prog]") === el)
          .map((st) => ({ el: st, at: Number(st.dataset.step) }));
        return { el, from, to, steps };
      });
    };
    scan();
    scanRef.current = scan;
    const leadCard = root.querySelector<HTMLElement>("[data-lead-card]");
    const legButtons = [...root.querySelectorAll<HTMLElement>("[data-leg]")];

    let world: import("./world").BouwplanWorld | null = null;
    let disposed = false;
    import("./world")
      .then(({ BouwplanWorld }) => {
        if (disposed) return;
        try {
          world = new BouwplanWorld(canvas, cssRef.current!, { mobile, reduced });
          world.resize(canvas.clientWidth, canvas.clientHeight);
          root.dataset.gl = "on";
          setHosts(world.screenHosts());
        } catch {
          root.dataset.gl = "off";
        }
      })
      .catch(() => (root.dataset.gl = "off"));

    let cur = vh ? scrollY / vh : 0;
    let camT = reduced ? restingT(cur) : cur;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / innerHeight) * 2 - 1);
    };

    let lastLeg = -1;
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const target = vh ? Math.min(scrollY / vh, TOTAL) : 0;
      cur = reduced ? target : cur + (target - cur) * LERP;
      if (Math.abs(target - cur) < 0.0005) cur = target;

      // Copy windows.
      for (const w of wins) {
        let o: number;
        let y = 0;
        if (w.hero) {
          o = 1 - smooth(0.7, 1.15, cur);
          y = -smooth(0, 1.15, cur) * 2;
        } else if (w.finale) {
          o = smooth(w.from, w.from + 0.45, cur);
          y = (1 - o) * 2;
        } else {
          const r = Math.min(RAMP, (w.to - w.from) * 0.3);
          o = smooth(w.from, w.from + r, cur) * (1 - smooth(w.to - r, w.to, cur));
          y = 2 - 4 * clamp01((cur - w.from) / (w.to - w.from));
        }
        w.el.style.opacity = o.toFixed(3);
        w.el.style.visibility = o < 0.01 ? "hidden" : "visible";
        w.el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        w.el.style.transform = reduced ? "" : `translate3d(0, ${y.toFixed(3)}vh, 0)`;
      }

      // Scrubbed panels.
      for (const p of progs) {
        const v = clamp01((cur - p.from) / (p.to - p.from));
        p.el.style.setProperty("--s", v.toFixed(4));
        for (const st of p.steps) st.el.toggleAttribute("data-on", v >= st.at);
      }
      if (leadCard) {
        let k = -1;
        for (const at of BEAT.stages) k += smooth(at - 0.03, at + 0.12, cur);
        leadCard.style.setProperty("--k", k.toFixed(4));
      }

      // Route.
      const leg = legAt(cur);
      if (leg !== lastLeg) {
        lastLeg = leg;
        root.dataset.leg = LEGS[leg].id;
        legButtons.forEach((b, i) => b.setAttribute("aria-current", String(i === leg)));
      }

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      if (world) {
        if (reduced) {
          const rest = restingT(cur);
          if (rest !== camT) {
            camT = rest;
            canvas.animate([{ opacity: 0.25 }, { opacity: 1 }], { duration: 320, easing: "ease-out" });
          }
        } else camT = cur;
        world.update(camT, now / 1000, pointer);
        const m = markerRef.current;
        if (m) {
          const c = world.cameraXZ();
          m.setAttribute("cx", ((26 - c.z) * 2).toFixed(1));
          m.setAttribute("cy", ((c.x + 17) * 1.2).toFixed(1));
        }
      }
    };

    layout(true);
    // The spacer is sized against the viewport; measure again once fonts and
    // the window have settled (an embedded pane can report 0 at first).
    const relayout = () => layout(vh === 0);
    addEventListener("resize", relayout);
    addEventListener("load", relayout);
    document.fonts?.ready.then(relayout);
    addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      removeEventListener("resize", relayout);
      removeEventListener("load", relayout);
      removeEventListener("pointermove", onPointer);
      world?.dispose();
    };
  }, []);

  useEffect(() => {
    if (hosts) scanRef.current(Object.values(hosts));
  }, [hosts]);

  const goTo = (i: number) => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vh = document.documentElement.clientHeight;
    const t = i === 2 ? BEAT.bays[0] - 0.05 : i === 3 ? BEAT.silence[0] + 0.1 : LEG_START[i] + (i === 0 ? 0 : 0.35);
    scrollTo({ top: t * vh, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div ref={rootRef} className={s.root} data-leg="ontwerp">
      <div className={s.stage} aria-hidden="true">
        <canvas ref={canvasRef} className={s.canvas} />
        <div ref={cssRef} className={s.css3d} />
        <div className={s.grain} />
      </div>

      <header className={s.header}>
        <Link href="/" className={s.brand} aria-label="SteylVisuals, naar boven">
          <Logo size={30} />
        </Link>
        <nav className={s.route} aria-label="Route door de pagina">
          <svg className={s.map} viewBox="0 0 148 40" aria-hidden="true">
            <rect x="0" y="0" width="148" height="40" className={s.mapSheet} />
            <rect x={(26 - 0) * 2} y={(-8 + 17) * 1.2} width={44 * 2} height={16 * 1.2} className={s.mapWall} />
            {[-7.5, -14.5, -21.5, -28.5].map((z) => (
              <g key={z}>
                <line x1={(26 - z) * 2} x2={(26 - z) * 2} y1={(-8 + 17) * 1.2} y2={(-4.8 + 17) * 1.2} className={s.mapWall} />
                <line x1={(26 - z) * 2} x2={(26 - z) * 2} y1={(8 + 17) * 1.2} y2={(4.8 + 17) * 1.2} className={s.mapWall} />
              </g>
            ))}
            <ellipse cx={(26 + 36) * 2} cy={17 * 1.2} rx={5.5 * 2} ry={5.5 * 1.2} className={s.mapWall} />
            <rect x={(26 - 6.55) * 2} y={(0.55 - 0.85 + 17) * 1.2} width={0.8 * 2} height={1.7 * 1.2} className={s.mapDesk} />
            <rect x={(26 + 35.75) * 2} y={(-0.75 + 17) * 1.2} width={0.7 * 2} height={1.5 * 1.2} className={s.mapDesk} />
            <circle ref={markerRef} r="2.6" cx="2" cy={(2.6 + 17) * 1.2} className={s.mapMarker} />
          </svg>
          <ol className={s.legs}>
            {LEGS.map((l, i) => (
              <li key={l.id}>
                <button type="button" data-leg={l.id} aria-current={i === 0} onClick={() => goTo(i)}>
                  {l.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className={s.headerLinks}>
          <Link href="/webdesign">Webdesign</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/vastgoed-marketing">Video</Link>
          <Link href={CTA.href} className={s.btn}>
            {CTA.label}
          </Link>
        </div>
      </header>

      <main className={s.copy}>
        {/* Leg 1: the desk */}
        <section className={`${s.win} ${s.lead}`} data-win="hero">
          <div className={`${s.scrim} ${s.scrimLead}`} />
          <div className={s.block}>
            <h1 className={s.display}>Websites die je klanten binnenhalen.</h1>
            <p className={s.sub}>
              Op maat gebouwd, met de automatisering erachter: CRM, opvolging en afspraken. Voor bedrijven in België.
            </p>
            <div className={s.actions}>
              <Link href={CTA.href} className={s.btn}>
                {CTA.label}
              </Link>
              <button type="button" className={s.textLink} onClick={() => goTo(2)}>
                Bekijk het werk
              </button>
            </div>
          </div>
        </section>

        {/* Leg 2: the laptop builds it */}
        <section className={`${s.win} ${s.lead} ${s.low}`} data-win="1.85 3.75">
          <div className={`${s.scrim} ${s.scrimLead}`} />
          <div className={s.block}>
            <h2 className={s.headline}>Eerst het plan. Dan bouwen we het, tot op de pixel.</h2>
            <p className={s.sub}>
              Ontwerp, code en CMS op maat, met SEO en Google Analytics. Geen template, geen pagebuilder. Live binnen twee weken.
            </p>
          </div>
        </section>

        {/* Leg 3: the rooms */}
        {CLIENTS.map((c, i) => {
          const at = BEAT.bays[i];
          const side = BAYS[i].side < 0 ? s.trail : s.lead;
          return (
            <section key={c.id} className={`${s.win} ${side} ${s.low}`} data-win={`${(at - 0.27).toFixed(2)} ${(at + 0.27).toFixed(2)}`}>
              <div className={`${s.scrim} ${BAYS[i].side < 0 ? s.scrimTrail : s.scrimLead}`} />
              <div className={`${s.block} ${s.narrow}`}>
                {i === 0 && <p className={s.kicker}>Echte sites, voor echte klanten</p>}
                <h2 className={s.title}>{c.name}</h2>
                <p className={s.sub}>{c.text}</p>
                <a className={s.textLink} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  Bekijk de site
                </a>
              </div>
            </section>
          );
        })}

        {/* Leg 4: the silence, then the lead */}
        <section className={`${s.win} ${s.center}`} data-win={`${BEAT.silence[0] + 0.02} ${BEAT.silence[1] + 0.1}`}>
          <div className={`${s.scrim} ${s.scrimCenter}`} />
          <div className={s.block}>
            <p className={s.clockBig}>23:14.</p>
            <p className={s.sub}>Je kantoor is dicht. Je website niet.</p>
          </div>
        </section>

        <section className={`${s.win} ${s.lead} ${s.low}`} data-win={`${BEAT.silence[1] + 0.06} ${BEAT.stages[1] - 0.12}`}>
          <div className={`${s.scrim} ${s.scrimLead}`} />
          <div className={`${s.block} ${s.narrow}`}>
            <h2 className={s.headline}>Terwijl jij slaapt, volgt je website op.</h2>
            <p className={s.sub}>
              Aanvraag, bevestiging, CRM, opvolging en afspraak. Automatisch, in jouw huisstijl, gekoppeld aan de tools die je al gebruikt.
            </p>
          </div>
        </section>

        <section
          className={`${s.win} ${s.flow}`}
          data-win={`${BEAT.stages[0] - 0.05} ${BEAT.stages[4] + 0.3}`}
          data-prog={`${BEAT.stages[0] - 0.01} ${BEAT.stages[4] + 0.01}`}
          aria-label="Voorbeeldscenario: een aanvraag die vanzelf een afspraak wordt"
        >
          <header className={s.flowHead}>
            <p className={s.kicker}>Voorbeeldscenario</p>
            <p className={s.flowClock}>
              <span className={s.night}>23:14</span>
              <span className={s.morning} data-step="0.98">
                07:42
              </span>
            </p>
          </header>
          <div className={s.leadInfo}>
            <strong>{LEAD.title}</strong>
            <span>{LEAD.object}</span>
            <span className={s.muted}>{LEAD.source}</span>
          </div>
          <div className={s.flowBody}>
            <div className={s.leadCard} data-lead-card aria-hidden="true" />
            <ol className={s.flowSteps}>
              {LEAD.steps.map((st, i) => {
                const span = BEAT.stages[4] - BEAT.stages[0] + 0.02;
                const at = (BEAT.stages[i] - BEAT.stages[0] + 0.01) / span;
                return (
                  <li key={st.title} data-step={at.toFixed(3)}>
                    <time>{st.time}</time>
                    <div>
                      <p className={s.flowTitle}>{st.title}</p>
                      <p className={s.flowDetail}>{st.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Leg 5: morning */}
        <section className={`${s.win} ${s.lead} ${s.finale}`} data-win="finale" data-from="10.5">
          <div className={`${s.scrim} ${s.scrimLead}`} />
          <div className={s.block}>
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
          </div>
        </section>
      </main>

      {hosts && (
        <>
          {createPortal(<LaptopScreen />, hosts.laptop)}
          {createPortal(<StudioPhoneScreen />, hosts.studioPhone)}
          {createPortal(<MonitorScreen />, hosts.monitor)}
          {createPortal(<OfficePhoneScreen />, hosts.officePhone)}
        </>
      )}

      <div ref={spacerRef} className={s.spacer} style={{ height: `${(TOTAL + 1) * 100}vh` }} aria-hidden="true" />
    </div>
  );
}
