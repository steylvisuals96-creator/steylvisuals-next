"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { R2, type PortfolioCase } from "@/lib/cases";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * The case template. Every project page is this component with different data,
 * so they stay consistent as the portfolio grows — see lib/cases.ts.
 */
export default function CaseDetail({ item }: { item: PortfolioCase }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Lightbox on <dialog>: showModal() gives the top layer and a real focus
  // trap, so nothing can clip it and no z-index is involved.
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (shown !== null && !d.open) d.showModal();
    if (shown === null && d.open) d.close();
  }, [shown]);

  const step = useCallback(
    (delta: number) => {
      setShown((i) => (i === null ? i : (i + delta + item.photos.length) % item.photos.length));
    },
    [item.photos.length],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLDialogElement>) => {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      // <dialog> closes on Escape itself, but handling it keeps the behaviour
      // identical whatever wraps the page.
      if (e.key === "Escape") { e.preventDefault(); setShown(null); }
    },
    [step],
  );

  // preload="none": the film costs nothing until someone asks for it.
  function start() {
    const v = videoRef.current;
    if (!v) return;
    v.preload = "auto";
    v.play().then(() => setPlaying(true)).catch(() => {});
  }

  return (
    <article style={{ backgroundColor: "var(--black)" }}>
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "calc(72px + clamp(3rem,8vh,6rem)) clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,7rem)",
        }}
      >
        <Link href="/portfolio" className="case-back">
          Terug naar portfolio
        </Link>

        <header style={{ marginTop: "2.5rem", marginBottom: "clamp(2.5rem,5vw,4rem)", maxWidth: "60ch" }}>
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
            {item.eyebrow}
          </p>
          <h1
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
            {item.title}
            {item.titleEm && (
              <>
                <br />
                <em style={{ fontStyle: "italic" }}>{item.titleEm}</em>
              </>
            )}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-poppins)",
              fontSize: "1rem",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "var(--cream-muted)",
              maxWidth: "52ch",
            }}
          >
            {item.intro}
          </p>

          <dl className="case-meta">
            <div>
              <dt>Discipline</dt>
              <dd>{item.discipline}</dd>
            </div>
            <div>
              <dt>Jaar</dt>
              <dd>{item.year}</dd>
            </div>
            <div>
              <dt>Beelden</dt>
              <dd>{item.photos.length}</dd>
            </div>
          </dl>
        </header>

        {item.film && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
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
            {/* 16:9 with sound, so it waits for a click rather than autoplaying
                muted like the vertical reels. */}
            <video
              ref={videoRef}
              poster={`${R2}/${item.film.posterKey}`}
              preload="none"
              playsInline
              controls={playing}
              onEnded={() => setPlaying(false)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            >
              <source src={`${R2}/${item.film.key}`} type="video/mp4" />
            </video>

            {!playing && (
              <button
                type="button"
                onClick={start}
                className="lm-play"
                aria-label={`Speel de film af — ${item.film.duration}`}
              >
                <span className="lm-play-mark" aria-hidden="true" />
                <span className="lm-play-label">Bekijk de film · {item.film.duration}</span>
              </button>
            )}
          </motion.div>
        )}

        <div className="lm-gallery">
          {item.photos.map((p, i) => (
            <motion.button
              key={p.key}
              type="button"
              onClick={() => setShown(i)}
              className={p.wide ? "lm-item lm-item--wide" : "lm-item"}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.06, ease: EASE }}
              aria-label={`Foto ${i + 1} van ${item.photos.length} — groter bekijken`}
            >
              <Image
                src={`${R2}/${p.key}`}
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
              {/* contain, not cover: enlarging exists to show the whole frame. */}
              <Image
                key={item.photos[shown].key}
                src={`${R2}/${item.photos[shown].key}`}
                alt=""
                width={item.photos[shown].w}
                height={item.photos[shown].h}
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
                {String(shown + 1).padStart(2, "0")} / {item.photos.length}
              </p>
              <button type="button" className="lm-lb-nav" onClick={() => step(1)}>Volgende</button>
            </div>
          </>
        )}
      </dialog>
    </article>
  );
}
