"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icoon from "./Icoon";
import StudioDemo from "./StudioDemo";
import { DEMOS } from "./demos";
import ContactForm from "./ContactForm";
import {
  BELOFTES,
  CLIPS,
  FOTOS,
  FUNCTIES,
  OVERZICHT,
  MAIL,
  SITES,
  BREIN,
  STIJLEN,
  type Stijl,
  SOCIAL,
  STAPPEN,
  WERKWIJZE,
  type Site,
} from "./data";
import Schil, { Voet } from "@/components/studio/Schil";
import { SECTIES } from "@/components/studio/menu";
import s from "./start.module.css";

/**
 * De homepage in de look van de Studio. Eén scrollpagina met een vaste
 * zijbalk; alleen de Studio-demo blijft staan terwijl je scrolt.
 *
 * Eén scroll-lus (rAF) doet al het meetwerk:
 * - welke sectie actief is (zijbalk en tabbalk),
 * - `data-zicht` op elk `[data-in]`-element zodra het in beeld komt (eenmalig),
 * - `--p` (0..1) op elk `[data-scrub]`-element terwijl het door beeld schuift,
 * - de stap van de vastgezette Studio-demo,
 * - de afspeelkop en tijdcode van het montagescherm.
 */

const klem = (x: number) => Math.min(1, Math.max(0, x));
const stil = () =>
  typeof window !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

const TOTAAL = CLIPS.reduce((t, c) => t + c.w, 0);
const STARTEN = CLIPS.reduce<number[]>(
  (acc, c, i) => [...acc, i === 0 ? 0 : acc[i - 1] + CLIPS[i - 1].w],
  [],
);

function tijdcode(sec: number) {
  const f = Math.floor((sec % 1) * 25);
  const t = Math.floor(sec);
  const p = (n: number) => String(n).padStart(2, "0");
  return `00:00:${p(t)}:${p(f)}`;
}

/** De reel als framereeks: 112 beelden uit zes shots, 4 per seconde tijdlijn. */
const FRAMES = TOTAAL * 4;
const framePad = (klein: boolean, i: number) =>
  `/start/reel/${klein ? "m" : "d"}/${String(i).padStart(3, "0")}.webp`;
const zacht = (x: number) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

/** Vaste golfvorm voor het geluidsspoor (zelfde bij elke render). */
const GOLF = Array.from(
  { length: 96 },
  (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)),
);

function Kop({
  id,
  kicker,
  titel,
  tekst,
  cijfers,
}: {
  id?: string;
  kicker: string;
  titel: React.ReactNode;
  tekst?: React.ReactNode;
  cijfers?: { icoon: string; waarde: string; label: string }[];
}) {
  return (
    <header className={s.kop} data-in="">
      <div className={s.kopTekst}>
        <p className={s.kicker}>{kicker}</p>
        <h2 id={id} className={s.headline}>
          {titel}
        </h2>
        {tekst && <p className={s.lead}>{tekst}</p>}
      </div>
      {cijfers && (
        <ul className={s.cijfers}>
          {cijfers.map((c) => (
            <li key={c.label}>
              <span className={s.rondje}>
                <Icoon naam={c.icoon} />
              </span>
              <span>
                <b>{c.waarde}</b>
                <small>{c.label}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function Venster({ site }: { site: Site }) {
  return (
    <figure className={s.browser}>
      <div className={s.browserBalk} aria-hidden="true">
        <span className={s.lichtjes}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.adres}>{site.domein}</span>
      </div>
      <div className={s.kijkvenster} data-scrub="">
        {site.lang && (
          <img
            className={s.lang}
            src={site.lang}
            alt={`De site van ${site.naam}`}
            width={1200}
            height={3750}
            loading="lazy"
          />
        )}
        {site.frames?.map((f, i) => (
          <img
            key={f}
            className={s.frame}
            data-frame={i}
            src={f}
            alt={i === 0 ? `De site van ${site.naam}` : ""}
            width={1200}
            height={750}
            loading="lazy"
          />
        ))}
      </div>
    </figure>
  );
}

export default function Start() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLElement>(null);
  const montageRef = useRef<HTMLDivElement>(null);
  const podiumRef = useRef<HTMLElement>(null);
  const toneelRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const gleufRef = useRef<HTMLDivElement>(null);
  const doekRef = useRef<HTMLCanvasElement>(null);
  const koprRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [actief, setActief] = useState("start");
  const [stap, setStap] = useState(0);
  const [stijl, setStijl] = useState<Stijl>("studio");
  const [clip, setClip] = useState(0);
  const [heroFrame, setHeroFrame] = useState(0);
  const heroRust = useRef(false);

  // Pas na het laden mogen de binnenkomst-animaties spelen (zonder script blijft alles zichtbaar).
  useEffect(() => {
    rootRef.current!.setAttribute("data-anim", "");
  }, []);

  // De klantsite in het beginscherm bladert vanzelf door haar schermen.
  useEffect(() => {
    if (stil()) return;
    const n = SITES[0].frames?.length ?? 1;
    const klok = setInterval(() => {
      if (!heroRust.current) setHeroFrame((f) => (f + 1) % n);
    }, 2800);
    return () => clearInterval(klok);
  }, []);

  // De ene scroll-lus.
  useEffect(() => {
    const root = rootRef.current!;
    let ins = [...root.querySelectorAll<HTMLElement>("[data-in]")];
    const scrubs = [...root.querySelectorAll<HTMLElement>("[data-scrub]")].map(
      (el) => ({
        el,
        frames: [...el.querySelectorAll<HTMLElement>("[data-frame]")],
      }),
    );
    const secties = SECTIES.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];
    const pin = pinRef.current!;
    const montage = montageRef.current!;
    const podium = podiumRef.current!;
    const toneel = toneelRef.current!;
    const film = filmRef.current!;
    const gleuf = gleufRef.current!;
    const doek = doekRef.current!;
    const roerloos = stil();

    // De reel: beeld 0 eerst, de rest daarna met een paar tegelijk. Getekend wordt het
    // dichtstbijzijnde beeld dat al geladen is, zodat scrollen nooit op het netwerk wacht.
    const klein = matchMedia("(max-width: 767px)").matches;
    doek.width = klein ? 960 : 1920;
    doek.height = klein ? 540 : 1080;
    const pen = doek.getContext("2d");
    const beelden: HTMLImageElement[] = [];
    const klaar: boolean[] = [];
    let wens = 0;
    let getekend = -1;
    let gestopt = false;
    const teken = () => {
      let k = -1;
      for (let d = 0; d < FRAMES && k < 0; d++) {
        if (klaar[wens - d]) k = wens - d;
        else if (klaar[wens + d]) k = wens + d;
      }
      if (k < 0 || k === getekend || !pen) return;
      getekend = k;
      pen.drawImage(beelden[k], 0, 0, doek.width, doek.height);
      doek.setAttribute("data-klaar", "");
    };
    const laad = (i: number, dan?: () => void) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        klaar[i] = true;
        if (!gestopt) teken();
        dan?.();
      };
      im.onerror = () => dan?.();
      im.src = framePad(klein, i);
      beelden[i] = im;
    };
    // Pas laden wanneer het montagescherm in de buurt komt. Op gsm de helft van de beelden,
    // met databesparing aan een kwart: het dichtstbijzijnde geladen beeld vult de gaten.
    const zuinig = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    const stapGrootte = zuinig ? 4 : klein ? 2 : 1;
    let volgende = stapGrootte;
    let reelGestart = false;
    const rij = () => {
      if (gestopt || volgende >= FRAMES) return;
      const i = volgende;
      volgende += stapGrootte;
      laad(i, rij);
    };
    const startReel = () => {
      reelGestart = true;
      laad(0, () => {
        if (roerloos) return;
        for (let n = 0; n < 4; n++) rij();
      });
    };
    let wacht = false;
    let vorigeSectie = "";
    let vorigeStap = -1;
    let vorigeClip = -1;

    const meet = () => {
      wacht = false;
      const vh = innerHeight;

      // Eerst alles lezen, dan pas schrijven: zo rekent de browser de layout één keer per frame uit.
      const tops = secties.map((sec) => sec.getBoundingClientRect().top);
      const onderaan =
        innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
      const nieuwZichtbaar = ins.filter(
        (el) =>
          !el.hasAttribute("data-zicht") &&
          el.getBoundingClientRect().top < vh * 0.88,
      );
      const scrubRects = scrubs.map(({ el }) => el.getBoundingClientRect());
      const pr = pin.getBoundingClientRect();
      const loop = pin.offsetHeight - vh;
      const dr = podium.getBoundingClientRect();
      const tr = toneel.getBoundingClientRect();
      const gr = gleuf.getBoundingClientRect();

      let nu = secties[0]?.id ?? "start";
      tops.forEach((top, i) => {
        if (top <= vh * 0.4) nu = secties[i].id;
      });
      if (onderaan) nu = secties[secties.length - 1].id;
      if (nu !== vorigeSectie) {
        vorigeSectie = nu;
        setActief(nu);
      }

      for (const el of nieuwZichtbaar) el.setAttribute("data-zicht", "");
      // Wat eenmaal zichtbaar is, hoeft niet meer gemeten te worden.
      if (nieuwZichtbaar.length)
        ins = ins.filter((el) => !el.hasAttribute("data-zicht"));

      scrubs.forEach(({ el, frames }, i) => {
        const r = scrubRects[i];
        if (r.bottom < -50 || r.top > vh + 50) return;
        const p = roerloos ? 0 : klem((vh - r.top) / (vh + r.height));
        el.style.setProperty("--p", p.toFixed(4));
        if (frames.length) {
          const k = Math.min(
            frames.length - 1,
            Math.floor(klem((p - 0.15) / 0.7) * frames.length),
          );
          frames.forEach((f, j) => f.toggleAttribute("data-on", j === k));
        }
      });

      // Studio-demo: de doorloop van de vastgezette sectie kiest de stap.
      const pp = loop > 0 ? klem(-pr.top / loop) : 0;
      pin.style.setProperty("--pp", pp.toFixed(4));
      const st = Math.min(STAPPEN.length - 1, Math.floor(pp * STAPPEN.length));
      if (st !== vorigeStap) {
        vorigeStap = st;
        setStap(st);
      }

      // Montage: het scherm staat eerst gewoon in de pagina; verder in de doorloop zoomt het
      // beeld in tot het hele scherm vult. Dezelfde doorloop stuurt beeld, afspeelkop en tijdcode.
      if (!reelGestart && dr.top < vh * 2.5) startReel();
      const dloop = podium.offsetHeight - tr.height;
      const pd = dloop > 0 ? klem(-dr.top / dloop) : 0;
      const zoom = roerloos ? 0 : zacht(klem((pd - 0.34) / 0.34));
      const t = 1 - zoom;
      // Op een staand scherm zoomt het beeld tot de volle breedte en blijft het 16:9:
      // schermvullend zou alleen het midden van het beeld tonen, en dat onscherp.
      const staand = tr.width < vh * 0.8;
      const volH = staand ? (tr.width * 9) / 16 : tr.height;
      const volTop = staand ? (vh - volH) / 2 : 0;
      film.style.left = `${((gr.left - tr.left) * t).toFixed(1)}px`;
      film.style.top = `${(volTop + (gr.top - tr.top - volTop) * t).toFixed(1)}px`;
      film.style.width = `${(tr.width + (gr.width - tr.width) * t).toFixed(1)}px`;
      film.style.height = `${(volH + (gr.height - volH) * t).toFixed(1)}px`;
      film.style.borderRadius = `${(12 * t).toFixed(1)}px`;
      toneel.style.setProperty("--dk", (1 - klem(zoom / 0.45)).toFixed(4));

      const mp = roerloos ? 0 : klem(pd / 0.97);
      const sec = mp * TOTAAL;
      montage.style.setProperty("--kop", mp.toFixed(4));
      if (tcRef.current) tcRef.current.textContent = tijdcode(sec);
      wens = Math.min(FRAMES - 1, Math.floor(mp * FRAMES));
      teken();
      let c = 0;
      STARTEN.forEach((s0, i) => {
        if (sec >= s0) c = i;
      });
      if (c !== vorigeClip) {
        vorigeClip = c;
        setClip(c);
      }
    };
    // Tijdens het scrollen staat de gloed stil (zie schil.module.css).
    let rust: ReturnType<typeof setTimeout> | undefined;
    const vraag = () => {
      if (!rust) root.setAttribute("data-scrollt", "");
      clearTimeout(rust);
      rust = setTimeout(() => {
        rust = undefined;
        root.removeAttribute("data-scrollt");
      }, 180);
      if (!wacht) {
        wacht = true;
        requestAnimationFrame(meet);
      }
    };
    meet();
    addEventListener("scroll", vraag, { passive: true });
    addEventListener("resize", vraag);
    return () => {
      gestopt = true;
      clearTimeout(rust);
      removeEventListener("scroll", vraag);
      removeEventListener("resize", vraag);
    };
  }, []);

  const stappen = DEMOS[stijl].stappen;
  const huidig = stappen[stap];

  return (
    <Schil actief={actief} thuis rootRef={rootRef} className={s.root}>
      {/* ------------------------------------------------ Start */}
      <section id="start" className={`${s.sectie} ${s.start}`}>
        <div className={s.startRaster}>
          <div className={s.startTekst}>
            <p className={s.kicker}>SteylVisuals · Herent</p>
            <h1 className={s.display}>
              Een website die voor je zaak <em>werkt</em>.
            </h1>
            <p className={s.leadGroot}>
              Ik ben Sam. Ik ontwerp en bouw je website, film en fotografeer je
              zaak en zet de slimme systemen erachter die je opvolging en
              administratie overnemen.
            </p>
            <div className={s.acties}>
              <a href="#contact" className={s.knop}>
                Start je project
              </a>
              <a href="#websites" className={s.knopStil}>
                Bekijk wat ik maak
              </a>
            </div>
            <figure className={s.maker}>
              <img
                src="/start/sam.jpg"
                alt="Sam Steylaerts op een balkon boven de stad, in zwart-wit"
                width={933}
                height={1400}
              />
              <figcaption>
                <b>Sam Steylaerts</b>
                <span>Eén maker, één aanspreekpunt, nul tussenpersonen.</span>
              </figcaption>
            </figure>
          </div>
          <div
            className={s.heroWerk}
            onPointerEnter={() => (heroRust.current = true)}
            onPointerLeave={() => (heroRust.current = false)}
          >
            <figure className={s.browser} data-g="">
              <div className={s.browserBalk} aria-hidden="true">
                <span className={s.lichtjes}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={s.adres}>{SITES[0].domein}</span>
              </div>
              <div className={s.kijkvenster}>
                {SITES[0].frames?.map((f, i) => (
                  <img
                    key={f}
                    className={s.frame}
                    data-on={i === heroFrame || undefined}
                    src={f}
                    alt={i === 0 ? `De site van ${SITES[0].naam}` : ""}
                    width={1200}
                    height={750}
                    fetchPriority={i === 0 ? "high" : undefined}
                    loading={i === 0 ? undefined : "lazy"}
                  />
                ))}
              </div>
            </figure>
            <img
              className={s.heroGsm}
              src="/home/sites/specified-mobile.jpg"
              alt="Dezelfde site op een gsm"
              width={780}
              height={1688}
            />
          </div>
        </div>

          <ul className={`${s.cijfers} ${s.startCijfers}`}>
            {[
              {
                icoon: "camera",
                waarde: "4 vakken",
                label: "web, video, AI, social",
              },
              {
                icoon: "gsm",
                waarde: "1 nummer",
                label: "rechtstreeks naar mij",
              },
              {
                icoon: "klok",
                waarde: "< 1 dag",
                label: "tot je antwoord hebt",
              },
              {
                icoon: "browser",
                waarde: "2 weken",
                label: "tot je site live staat",
              },
            ].map((c) => (
              <li key={c.label}>
                <span className={s.rondje}>
                  <Icoon naam={c.icoon} />
                </span>
                <span>
                  <b>{c.waarde}</b>
                  <small>{c.label}</small>
                </span>
              </li>
            ))}
          </ul>

        <div className={s.overzicht}>
          {OVERZICHT.map((o, i) => (
            <a
              key={o.id}
              href={`#${o.id}`}
              className={s.overzichtKaart}
              data-g=""
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className={s.overzichtBeeld}>
                {o.beeld ? (
                  <img
                    src={o.beeld}
                    alt=""
                    width={600}
                    height={400}
                    loading="lazy"
                  />
                ) : (
                  <span className={s.miniBord} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i data-nieuw="" />
                    <i />
                  </span>
                )}
              </span>
              <span className={s.overzichtTekst}>
                <b>{o.titel}</b>
                <span>{o.tekst}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Websites */}
      <section id="websites" className={s.sectie}>
        <Kop
          kicker="Websites"
          titel={
            <>
              Op maat gebouwd, <em>geen</em> template.
            </>
          }
          tekst="Ontwerp, code en een eigen beheer waarin je zelf teksten, vacatures of aanbod aanpast. Snel, vindbaar en na de lancering door mij bewaakt."
          cijfers={[
            { icoon: "browser", waarde: "Op maat", label: "ontwerp en code" },
            {
              icoon: "formulier",
              waarde: "Eigen beheer",
              label: "zelf aanpassen",
            },
            { icoon: "stijging", waarde: "SEO", label: "en Google Analytics" },
            { icoon: "schild", waarde: "Bewaakt", label: "dag en nacht" },
          ]}
        />
        <div className={s.sites}>
          {SITES.map((site) => (
            <article key={site.id} className={s.siteKaart} data-g="" data-in="">
              <Venster site={site} />
              <div className={s.siteTekst}>
                <h3>{site.naam}</h3>
                <p>{site.tekst}</p>
                <a
                  href={site.href}
                  target={site.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={s.link}
                >
                  Bekijk de site
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Video en foto */}
      <section id="beeld" className={s.sectie}>
        <Kop
          kicker="Video en foto"
          titel={
            <>
              Beeld dat je <em>zaak</em> laat zien.
            </>
          }
          tekst="Van draaiplan tot laatste kleurcorrectie: ik film, fotografeer en monteer zelf. Met drone waar het iets toevoegt, en geleverd binnen een week."
          cijfers={[
            { icoon: "camera", waarde: "Film", label: "draaidag en montage" },
            { icoon: "drone", waarde: "Drone", label: "ligging en omgeving" },
            { icoon: "klok", waarde: "< 1 week", label: "tot de levering" },
            {
              icoon: "spark",
              waarde: "Gratis",
              label: "demo-edit om te starten",
            },
          ]}
        />
      </section>

      <section
        ref={podiumRef}
        className={s.podium}
        aria-label="De montage van het culinair weekend bij La Martine"
      >
        <div ref={toneelRef} className={s.toneel}>
          <div ref={filmRef} className={s.film}>
            <img
              src="/start/reel/d/000.webp"
              srcSet="/start/reel/m/000.webp 960w, /start/reel/d/000.webp 1920w"
              sizes="(max-width: 860px) 100vw, 900px"
              loading="lazy"
              alt="Luchtbeeld van de vallei rond wijndomein La Martine bij avondlicht, met de lange tafel tussen de wijnranken"
              width={1920}
              height={1080}
            />
            <canvas ref={doekRef} aria-hidden="true" />
            <div className={s.spelerInfo} aria-hidden="true">
              <span className={s.tc} ref={tcRef}>
                00:00:00:00
              </span>
              <span>
                {CLIPS[clip].naam} · {CLIPS[clip].plek}
              </span>
            </div>
          </div>

          <div className={s.dok}>
            <p className={s.dokKop}>
              <b>In de montage</b>
              Scroll door zes clips van het culinair weekend bij{" "}
              <Link href="/portfolio/la-martine" className={s.link}>
                La Martine
              </Link>
              .
            </p>
            <div
              ref={montageRef}
              className={s.montage}
              data-g=""
              aria-label="Een montage in opbouw: zes clips van het culinair weekend bij wijndomein La Martine"
            >
              <div ref={gleufRef} className={s.speler} />
              <aside className={s.inspector}>
                <p className={s.inspKop}>
                  Clip {String(clip + 1).padStart(2, "0")}
                </p>
                <dl>
                  <div>
                    <dt>Project</dt>
                    <dd>
                      <Link href="/portfolio/la-martine" className={s.link}>
                        La Martine, culinair weekend
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt>Plek</dt>
                    <dd>{CLIPS[clip].plek}</dd>
                  </div>
                  <div>
                    <dt>Formaat</dt>
                    <dd>4K · 25p · 10-bit</dd>
                  </div>
                  <div>
                    <dt>Kleur</dt>
                    <dd>Warm, zacht contrast</dd>
                  </div>
                </dl>
                <div className={s.schuiven} aria-hidden="true">
                  {["Schaduw", "Midden", "Licht"].map((n, i) => (
                    <p key={n}>
                      <span>{n}</span>
                      <i
                        style={
                          { "--w": [0.42, 0.56, 0.64][i] } as React.CSSProperties
                        }
                      />
                    </p>
                  ))}
                </div>
              </aside>
              <div className={s.tijdlijn} aria-hidden="true">
                <div className={s.liniaal}>
                  {Array.from({ length: TOTAAL / 2 + 1 }, (_, i) => (
                    <span key={i} style={{ left: `${((i * 2) / TOTAAL) * 100}%` }}>
                      {i * 2}s
                    </span>
                  ))}
                </div>
                <div className={s.spoor}>
                  <span className={s.spoorNaam}>V1</span>
                  <div className={s.clips}>
                    {CLIPS.map((c, i) => (
                      <span
                        key={c.naam}
                        data-on={i === clip || undefined}
                        style={
                          {
                            flex: c.w,
                            backgroundImage: `url(${c.beeld})`,
                            backgroundPosition: c.pos,
                            "--k": c.kleur,
                          } as React.CSSProperties
                        }
                      >
                        {c.naam}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={s.spoor}>
                  <span className={s.spoorNaam}>A1</span>
                  <div className={s.golf}>
                    {GOLF.map((g, i) => (
                      <i key={i} style={{ height: `${g * 100}%` }} />
                    ))}
                  </div>
                </div>
                <span className={s.afspeelkop} ref={koprRef} />
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className={s.naFilm}>
        <div className={s.fotos}>
          {FOTOS.map((f) => (
            <figure
              key={f.titel}
              className={`${s.foto} ${f.vorm ? s[f.vorm] : ""}`}
              data-in=""
            >
              <img
                src={f.beeld}
                alt={`${f.titel}: ${f.tekst}`}
                width={1200}
                height={800}
                loading="lazy"
              />
              <figcaption>
                <b>{f.titel}</b>
                <span>{f.tekst}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ Automatisatie en AI */}
      <section id="automatisatie" className={s.sectie}>
        <Kop
          kicker="Automatisatie en AI"
          titel={
            <>
              Een systeem dat <em>meedenkt</em>.
            </>
          }
          tekst="Klanten, mails, offertes, agenda en een AI-assistent die alles bijhoudt, in één systeem op maat van je zaak. Hieronder zie je hoe het werkt, met verzonnen gegevens. Wissel gerust van stijl: elk systeem krijgt de huisstijl van de zaak die ermee werkt."
        />
      </section>

      <section
        ref={pinRef}
        className={s.pin}
        aria-label="Rondleiding door de Studio, met verzonnen gegevens"
      >
        <div className={s.pinVast}>
          <div className={s.pinTekst}>
            <ol className={s.stappen}>
              {stappen.map((st, i) => (
                <li
                  key={STAPPEN[i].scherm}
                  data-actief={i === stap || undefined}
                  data-klaar={i < stap || undefined}
                >
                  <span className={s.stapNr}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={s.stapTitel}>{st.titel}</p>
                    <p className={s.stapTekst}>{st.tekst}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={s.pinGsm} aria-live="polite">
              <p className={s.stapNrGsm}>
                {String(stap + 1).padStart(2, "0")} /{" "}
                {String(STAPPEN.length).padStart(2, "0")}
              </p>
              <p className={s.stapTitel}>{huidig.titel}</p>
              <p className={s.stapTekst}>{huidig.tekst}</p>
            </div>
            <div className={s.voortgang} aria-hidden="true">
              <i />
            </div>
            <div className={s.stijlen} role="group" aria-label="Stijl van het systeem">
              <p>Stijl</p>
              <div>
                {STIJLEN.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    aria-pressed={stijl === st.id}
                    onClick={() => setStijl(st.id)}
                  >
                    {st.naam}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={s.pinVenster}>
            <StudioDemo stap={stap} stijl={stijl} />
          </div>
        </div>
      </section>

      <section className={`${s.sectie} ${s.functiesSectie}`}>
        <Kop
          kicker="Alles wat erin zit"
          titel={
            <>
              Eén plek voor je <em>hele</em> zaak.
            </>
          }
          tekst="Dit zijn alle onderdelen van mijn eigen Studio. Voor jouw zaak kies je wat je nodig hebt; de rest laten we weg."
        />
        <div className={s.brein} data-g="" data-in="">
          <div className={s.breinKop}>
            <span className={s.rondje}>
              <Icoon naam={BREIN.icoon} />
            </span>
            <div>
              <h3>{BREIN.titel}</h3>
              <p>{BREIN.tekst}</p>
            </div>
          </div>
          <ul>
            {BREIN.inhoud.map((r) => (
              <li key={r.titel}>
                <b>{r.titel}</b>
                <small>{r.tekst}</small>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.functies}>
          {FUNCTIES.map((g) => (
            <div key={g.groep} className={s.functieGroep} data-in="">
              <p className={s.functieGroepNaam}>
                {g.groep}
                <small>{g.items.length} onderdelen</small>
              </p>
              <ul>
                {g.items.map((f, i) => (
                  <li
                    key={f.titel}
                    data-g=""
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <span className={s.rondje}>
                      <Icoon naam={f.icoon} />
                    </span>
                    <span>
                      <b>{f.titel}</b>
                      <small>{f.tekst}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={s.oproep} data-g="" data-in="">
          <div>
            <h3>Wil je zoiets voor jouw zaak?</h3>
            <p>
              Een CRM dat je opvolging overneemt, een assistent die je mails
              voorbereidt of gewoon één koppeling die dubbel werk wegneemt. Ik
              bouw wat jij nodig hebt.
            </p>
          </div>
          <a href="#contact" className={s.knop}>
            Bespreek je idee
          </a>
        </div>
      </section>

      {/* ------------------------------------------------ Social media */}
      <section id="social" className={s.sectie}>
        <Kop
          kicker="Social media en marketing"
          titel={
            <>
              Elke week <em>zichtbaar</em>, zonder dat jij eraan moet denken.
            </>
          }
          tekst="Strategie, planning, posten en advertenties. Jij keurt goed met één klik, ik doe de rest en laat je elke maand zien wat het opbracht."
          cijfers={[
            {
              icoon: "lamp",
              waarde: "Strategie",
              label: "wat, voor wie, waarom",
            },
            {
              icoon: "agenda",
              waarde: "Planning",
              label: "een vaste kalender",
            },
            { icoon: "hart", waarde: "Posten", label: "met eigen beeld" },
            {
              icoon: "stijging",
              waarde: "Advertenties",
              label: "met budget dat telt",
            },
          ]}
        />
        <div className={s.social}>
          <div className={s.kalender} data-g="" data-in="">
            <div className={s.paneelKop}>
              <h3>Contentkalender</h3>
              <span className={s.label}>Voorbeeld</span>
            </div>
            <div className={s.week}>
              {SOCIAL.dagen.map((dag, di) => {
                const post = SOCIAL.posts.find((p) => p.dag === di);
                return (
                  <div key={dag} className={s.dag}>
                    <p className={s.dagNaam}>{dag}</p>
                    {post ? (
                      <article
                        className={s.post}
                        style={{ "--i": di } as React.CSSProperties}
                      >
                        <img
                          src={post.beeld}
                          alt=""
                          width={400}
                          height={500}
                          loading="lazy"
                        />
                        <p className={s.postMeta}>
                          {post.uur} · {post.kanaal}
                        </p>
                        <p className={s.postTitel}>{post.titel}</p>
                        <p className={s.postStatus} data-status={post.status}>
                          {post.status}
                        </p>
                      </article>
                    ) : (
                      <p className={s.rustdag}>Rustdag</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={s.socialZij}>
            <div className={s.resultaat} data-g="" data-in="">
              <div className={s.paneelKop}>
                <h3>Deze maand</h3>
                <span className={s.label}>Voorbeeld</span>
              </div>
              <div className={s.bereik} aria-hidden="true">
                {SOCIAL.bereik.map((b, i) => (
                  <i
                    key={i}
                    style={{ "--h": b / 100, "--i": i } as React.CSSProperties}
                  />
                ))}
              </div>
              <dl className={s.resultaatCijfers}>
                {SOCIAL.cijfers.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd>{c.waarde}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.goedkeuren} data-g="" data-in="">
              <img
                src="/start/bloem.jpg"
                alt=""
                width={700}
                height={1050}
                loading="lazy"
              />
              <div>
                <p className={s.postMeta}>Za 10:00 · Instagram</p>
                <p>
                  Het nieuwe seizoensboeket staat vanaf zaterdag in de winkel.
                  Kom ruiken.
                </p>
                <div className={s.acties}>
                  <span className={s.knopKlein}>Goedkeuren</span>
                  <span className={s.knopStilKlein}>Aanpassen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ Werkwijze */}
      <section id="werkwijze" className={s.sectie}>
        <Kop
          kicker="Werkwijze"
          titel={
            <>
              Eén maker, van begin tot <em>einde</em>.
            </>
          }
          tekst="Bij een bureau praat je met een accountmanager en werkt iemand anders. Bij mij zit de maker aan tafel: één aanspreekpunt en één stijl over site, video en socials heen."
        />
        <div className={s.reisBalk} data-in="" aria-hidden="true">
          {WERKWIJZE.map((w) => (
            <i key={w.titel} style={{ background: w.kleur }} />
          ))}
        </div>
        <ol className={s.reis}>
          {WERKWIJZE.map((w, i) => (
            <li key={w.titel} data-g="" data-in="">
              <span className={s.reisNr} style={{ color: w.kleur }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{w.titel}</h3>
              <p>{w.tekst}</p>
            </li>
          ))}
        </ol>
        <ul className={s.beloftes}>
          {BELOFTES.map((b) => (
            <li key={b.titel} data-g="" data-in="">
              <span className={s.rondje}>
                <Icoon naam={b.icoon} />
              </span>
              <div>
                <h3>{b.titel}</h3>
                <p>{b.tekst}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ Contact */}
      <section id="contact" className={`${s.sectie} ${s.contact}`}>
        <div className={s.contactRaster}>
          <div data-in="" className={s.kop}>
            <div className={s.kopTekst}>
              <p className={s.kicker}>Contact</p>
              <h2 className={s.display}>
                Klaar om te <em>starten</em>?
              </h2>
              <p className={s.lead}>
                Vertel kort wat je zaak doet en wat je zoekt. Je krijgt binnen
                een werkdag een voorstel op maat, met een duidelijke prijs.
              </p>
              <p className={s.contactMail}>
                Liever mailen?{" "}
                <a
                  className={s.link}
                  href={`mailto:${MAIL}?subject=Nieuw%20project`}
                >
                  {MAIL}
                </a>
              </p>
            </div>
          </div>
          <div className={s.formPaneel} data-g="">
            <ContactForm />
          </div>
        </div>
        <Voet />
      </section>
    </Schil>
  );
}
