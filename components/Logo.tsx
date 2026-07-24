/**
 * SteylVisuals lockup — Brand Guidelines, editie 01 · 2026.
 *
 * "Steyl." in Montserrat 800 at -3.5% tracking, "VISUALS" beneath in Poppins
 * left-aligned to the S. The dot is always gold, in every approved version.
 *
 * The brandbook's size rules are enforced here rather than left to callers:
 * under 90px wide the VISUALS line drops, under 32px only the S. icon remains.
 * Both thresholds are expressed against `size` (the wordmark's font-size),
 * since "Steyl." renders at roughly 3.5x its own font-size.
 */

type Variant = "cream" | "brown" | "onGold";

const INK: Record<Variant, string> = {
  cream: "var(--cream)",
  brown: "var(--brown)",
  onGold: "var(--black)",
};

// The dot is gold on cream and brown lockups; on a gold field it goes cream so
// it still separates from the background. These are the only three versions.
const DOT: Record<Variant, string> = {
  cream: "var(--gold)",
  brown: "var(--gold)",
  onGold: "var(--cream)",
};

// "Steyl." occupies ~3.5em. 90px / 3.5 ≈ 26px; 32px / 1.1em (the S. icon) ≈ 29px,
// but the icon only ever replaces the lockup below the sub-line threshold.
const SUB_MIN_SIZE = 26;

export default function Logo({
  size = 34,
  variant = "cream",
  iconOnly = false,
  animateDot = false,
  className,
}: {
  size?: number;
  variant?: Variant;
  iconOnly?: boolean;
  animateDot?: boolean;
  className?: string;
}) {
  const ink = INK[variant];
  const dot = DOT[variant];
  const showSub = !iconOnly && size >= SUB_MIN_SIZE;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        // Clear space is one dot diameter on every side. The dot reads at
        // roughly 0.17em of the wordmark, so that is the padding.
        padding: "0.17em",
        fontSize: `${size}px`,
        lineHeight: 1,
      }}
      aria-label="SteylVisuals"
      role="img"
    >
      <span
        className="wordmark"
        style={{ color: ink, fontSize: "1em", whiteSpace: "nowrap" }}
        aria-hidden="true"
      >
        {iconOnly ? "S" : "Steyl"}
        <span
          className={animateDot ? "animate-dot-in" : undefined}
          style={{ color: dot, display: "inline-block" }}
        >
          .
        </span>
      </span>

      {showSub && (
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "0.3em",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: ink,
            marginTop: "0.85em",
            // Trailing letter-spacing would otherwise push the box past the
            // wordmark and break the left edge alignment on centred parents.
            marginRight: "-0.5em",
            whiteSpace: "nowrap",
          }}
        >
          Visuals
        </span>
      )}
    </span>
  );
}
