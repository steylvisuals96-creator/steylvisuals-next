"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const R2 = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev";
const FILM = R2 + "/videos/web/lamartine-culinair.mp4";
const POSTER = R2 + "/images/lamartine-poster.jpg";

/**
 * Photos live in R2 so they stay replaceable from /admin, and next/image
 * resizes and re-encodes them at the edge. `wide` marks the landscape frames,
 * which span two columns so nothing is cropped to a uniform square.
 */
const PHOTOS: { slug: string; w: number; h: number; wide: boolean }[] = [
  { slug: "lamartine-01", w: 1600, h: 1200, wide: true },
  { slug: "lamartine-02", w: 1364, h: 1600, wide: false },
  { slug: "lamartine-03", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-04", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-05", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-06", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-07", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-08", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-09", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-10", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-11", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-12", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-13", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-14", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-15", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-16", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-17", w: 1600, h: 1066, wide: true },
  { slug: "lamartine-18", w: 1066, h: 1600, wide: false },
  { slug: "lamartine-19", w: 1076, h: 1600, wide: false },
];

export default function LaMartineCase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Lightbox. <dialog> gives Escape, the focus trap and the top layer for free,
  // so it can't be clipped by an ancestor's overflow or stacking context.
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (shown !== null && !d.open) d.showModal();
    if (shown === null && d.open) d.close();
  }, [shown]);

  const step = useCallback((delta: number) => {
    setShown((i) => (i === null ? i : (i + delta + PHOTOS.length) % PHOTOS.length));
  }, []);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      // <dialog> closes on Escape by itself, but handling it explicitly keeps
      // the behaviour identical whatever wraps the page.
      if (e.key === "Escape") { e.preventDefault(); setShown(null); }
    },
    [step],
  );

  // preload="none": the 34MB film costs nothing until someone asks for it.
  function start() {
    const v = videoRef.current;
    if (!v) return;
    v.preload = "auto";
    v.play().then(() => setPlaying(true)).catch(() => {});
  }

  return (
    <section
      id="la-martine"
      style={{ backgroundColor: "var(--black)", padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "60ch" }}
        >
          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "var(--cream-muted)",
              marginBottom: "1.25rem",
            }}
          >
            La Martine · Wijndomein
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: 0,
              color: "var(--cream)",
              marginBottom: "1.5rem",
            }}
          >
            Een culinaire avond
            <br />
            <em style={{ fontStyle: "italic" }}>tussen de wijnranken</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "1rem",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "var(--cream-muted)",
              maxWidth: "52ch",
            }}
          >
            Film en fotografie voor het culinair weekend van wijndomein La Martine —
            van dronebeelden over het domein tot de borden die de gasten kregen voorgeschoteld.
          </p>
        </motion.div>

        {/* The film. 16:9 with sound, so it waits for a click rather than
            autoplaying muted like the verticale reels. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lm-film"
          style={{
            position: "relative",
            aspectRatio: "16/9",
            borderRadius: "var(--r-md)",
            overflow: "hidden",
            border: "1px solid var(--hairline)",
            backgroundColor: "var(--panel)",
          }}
        >
          <video
            ref={videoRef}
            poster={POSTER}
            preload="none"
            playsInline
            controls={playing}
            onEnded={() => setPlaying(false)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          >
            <source src={FILM} type="video/mp4" />
          </video>

          {!playing && (
            <button type="button" onClick={start} className="lm-play" aria-label="Speel de film af — 1 minuut 55">
              <span className="lm-play-mark" aria-hidden="true" />
              <span className="lm-play-label">Bekijk de film · 1:55</span>
            </button>
          )}
        </motion.div>

        <div className="lm-gallery">
          {PHOTOS.map((p, i) => (
            <motion.button
              key={p.slug}
              type="button"
              onClick={() => setShown(i)}
              className={p.wide ? "lm-item lm-item--wide" : "lm-item"}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              aria-label={`Foto ${i + 1} van ${PHOTOS.length} — groter bekijken`}
            >
              <Image
                src={R2 + "/images/" + p.slug + ".jpg"}
                alt=""
                width={p.w}
                height={p.h}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                loading="lazy"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="lm-lightbox"
        onClose={() => setShown(null)}
        onCancel={(e) => { e.preventDefault(); setShown(null); }}
        onKeyDown={onKey}
        // Anywhere that is not the photo or a control dismisses.
        onClick={(e) => { if (!(e.target as HTMLElement).closest("img, button")) setShown(null); }}
        aria-label="Vergrote weergave"
      >
        {shown !== null && (
          <>
            <div className="lm-lb-stage">
              {/* contain, niet cover: vergroten is juist bedoeld om het hele
                  kader te zien, dus hier wordt niets bijgesneden. */}
              <Image
                key={PHOTOS[shown].slug}
                src={R2 + "/images/" + PHOTOS[shown].slug + ".jpg"}
                alt=""
                width={PHOTOS[shown].w}
                height={PHOTOS[shown].h}
                sizes="92vw"
                priority
              />
            </div>

            <button type="button" className="lm-lb-close" onClick={() => setShown(null)} aria-label="Sluiten">
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="lm-lb-bar">
              <button type="button" className="lm-lb-nav" onClick={() => step(-1)}>Vorige</button>
              <p className="lm-lb-count" aria-live="polite">
                {String(shown + 1).padStart(2, "0")} / {PHOTOS.length}
              </p>
              <button type="button" className="lm-lb-nav" onClick={() => step(1)}>Volgende</button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
