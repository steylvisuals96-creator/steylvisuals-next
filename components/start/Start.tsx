"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Icoon from "./Icoon";
import StudioDemo from "./StudioDemo";
import { DEMOS } from "./demos";
import ContactForm from "./ContactForm";
import {
  BELOFTES,
  CLIPS,
  FOTOS,
  FUNCTIES,
  MAIL,
  OVERZICHT,
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
  const koprRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const [actief, setActief] = useState("start");
  const [stap, setStap] = useState(0);
  const [stijl, setStijl] = useState<Stijl>("studio");
  const [clip, setClip] = useState(0);
  const [groet, setGroet] = useState({ groet: "Goeiedag", datum: "" });

  // Begroeting en datum zoals in de Studio, pas in de browser (geen verschil met de server-HTML).
  useEffect(() => {
    const nu = new Date();
    const u = nu.getHours();
    const datum = nu.toLocaleDateString("nl-BE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    // Uur en datum van de bezoeker bestaan pas in de browser; één keer zetten na het laden is hier de bedoeling.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGroet({
      groet:
        u < 6
          ? "Goeienacht"
          : u < 12
            ? "Goeiemorgen"
            : u < 18
              ? "Goeiemiddag"
              : "Goeienavond",
      datum: datum[0].toUpperCase() + datum.slice(1),
    });
    rootRef.current!.setAttribute("data-anim", "");
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
    const roerloos = stil();
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
      const mr = montage.getBoundingClientRect();

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

      // Montage: de afspeelkop loopt mee terwijl het scherm door beeld schuift.
      const mp = roerloos
        ? 0.3
        : klem(((vh - mr.top) / (vh + mr.height) - 0.12) / 0.76);
      const sec = mp * TOTAAL;
      montage.style.setProperty("--kop", mp.toFixed(4));
      if (tcRef.current) tcRef.current.textContent = tijdcode(sec);
      let c = 0;
      STARTEN.forEach((t, i) => {
        if (sec >= t) c = i;
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
            <p className={s.kicker} suppressHydrationWarning>
              {groet.datum || "SteylVisuals, Herent"}
            </p>
            <h1 className={s.display}>
              {groet.groet}, <em>ondernemer</em>.
            </h1>
            <p className={s.leadGroot}>
              Ik ben Sam. Ik film en fotografeer je zaak, bouw je website en zet
              de slimme systemen erachter die je opvolging en administratie
              overnemen.
            </p>
            <p className={s.status}>
              Vandaag op het programma: vier vakken, één maker, nul
              tussenpersonen.
            </p>
            <div className={s.acties}>
              <a href="#contact" className={s.knop}>
                Start je project
              </a>
              <a href="#beeld" className={s.knopStil}>
                Bekijk wat ik maak
              </a>
            </div>
            <ul className={`${s.cijfers} ${s.startCijfers}`}>
              {[
                {
                  icoon: "camera",
                  waarde: "4 vakken",
                  label: "video, web, AI, social",
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
          </div>
          <figure className={s.portret} data-g="">
            <img
              src="/start/sam.jpg"
              alt="Sam Steylaerts op een balkon boven de stad, in zwart-wit"
              width={933}
              height={1400}
              fetchPriority="high"
            />
            <figcaption>
              <b>Sam Steylaerts</b>
              <span>Maker van SteylVisuals, Herent</span>
            </figcaption>
          </figure>
        </div>

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

        <div
          ref={montageRef}
          className={s.montage}
          data-g=""
          data-in=""
          aria-label="Een montage in opbouw: zes clips op een tijdlijn"
        >
          <div className={s.speler}>
            {CLIPS.map((c, i) => (
              <img
                key={c.naam}
                src={c.beeld}
                alt=""
                data-on={i === clip || undefined}
                width={1600}
                height={1000}
                loading="lazy"
              />
            ))}
            <div className={s.spelerInfo}>
              <span className={s.tc} ref={tcRef}>
                00:00:00:00
              </span>
              <span>
                {CLIPS[clip].naam} · {CLIPS[clip].plek}
              </span>
            </div>
          </div>
          <aside className={s.inspector}>
            <p className={s.inspKop}>
              Clip {String(clip + 1).padStart(2, "0")}
            </p>
            <dl>
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
              <div>
                <dt>Geluid</dt>
                <dd>Muziek en omgeving</dd>
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
