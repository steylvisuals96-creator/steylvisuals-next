"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const STING_SEEN_KEY = "sv:sting-seen";

export const STING_STYLE_ID = "sting-gate-style";

/**
 * Decides before first paint whether this visitor gets the intro. Without it the
 * hero paints first and the overlay drops in a beat later, which reads as a
 * glitch.
 *
 * It injects its own <style> rather than setting an attribute on <html>: that
 * element is React-owned, so mutating it pre-hydration produces a hydration
 * mismatch. An appended style tag is invisible to React and equally early.
 *
 * Lives in the server-rendered layout — an inline script inside a client
 * component never runs on client navigation.
 */
export const STING_GATE = `(function(){try{
if(location.pathname!=="/")return;
if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(sessionStorage.getItem(${JSON.stringify(STING_SEEN_KEY)}))return;
var s=document.createElement("style");
s.id=${JSON.stringify(STING_STYLE_ID)};
s.textContent=".sting{display:flex}body{overflow:hidden}";
document.head.appendChild(s);
}catch(e){}})();`;

/**
 * The brand intro, per the brandbook's motion section: the dot enters, the
 * wordmark wipes open behind it, VISUALS tracks in, then it holds. The source
 * render ends on a cream end card at ~3.8s; the file here is cut at 2.8s so the
 * overlay's own fade stands in for the wipe and never flashes light over the
 * black hero.
 *
 * The hero underneath is never gated on this — it renders normally and this
 * sits on top, so a headless renderer, a failed video or a blocked autoplay all
 * leave the page fully intact.
 */
export default function LogoSting() {
  // Matches the server render; the CSS gate decides visibility, not this.
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (typeof document === "undefined") return;
    const gate = document.getElementById(STING_STYLE_ID);
    if (!gate) return; // already finished, or this visitor never opted in
    setLeaving(true);
    const t = window.setTimeout(() => {
      // Removing the gate style restores scrolling and hides the overlay.
      gate.remove();
      setDone(true);
    }, 600); // the brandbook's 0.6s wipe-out
    timers.current.push(t);
  }, []);

  useEffect(() => {
    if (!document.getElementById(STING_STYLE_ID)) {
      setDone(true);
      return;
    }

    // Written up front so a refresh mid-intro doesn't replay it.
    try {
      sessionStorage.setItem(STING_SEEN_KEY, "1");
    } catch {
      /* private mode — the intro simply plays again next load */
    }

    // preload="none" in the markup so repeat visitors — who never see this —
    // don't pay for the download. Opt in only now that we know it will play.
    const video = videoRef.current;
    if (video) {
      video.preload = "auto";
      video.load();
      video.play().catch(finish); // autoplay refused: skip rather than sit on black
    }

    // If it hasn't started shortly, something is wrong — don't hold the page.
    timers.current.push(
      window.setTimeout(() => {
        if (!video || video.paused || video.currentTime === 0) finish();
      }, 1200),
    );
    // Hard ceiling regardless of what the element reports.
    timers.current.push(window.setTimeout(finish, 4000));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);

    const captured = timers.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      captured.forEach(clearTimeout);
    };
  }, [finish]);

  return (
    <>
      {!done && (
        <div className="sting" data-leaving={leaving || undefined} onClick={finish}>
          <video
            ref={videoRef}
            className="sting-video"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            onEnded={finish}
            onError={finish}
          >
            <source src="/brand/sting-landscape.webm" type="video/webm" />
            <source src="/brand/sting-landscape.mp4" type="video/mp4" />
          </video>
          <button type="button" className="sting-skip" onClick={finish}>
            Intro overslaan
          </button>
        </div>
      )}
    </>
  );
}
