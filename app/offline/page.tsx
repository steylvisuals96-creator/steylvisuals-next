export const metadata = {
  title: "Binnenkort terug — SteylVisuals",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <html lang="nl">
      <body style={{ margin: 0, backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-cropped.png" alt="SteylVisuals" style={{ height: "64px", marginBottom: "2.5rem", opacity: 0.95 }} />
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#FDFAF7", lineHeight: 1.1, marginBottom: "1.25rem" }}>
            Binnenkort<br />
            <em style={{ color: "#B8843A" }}>terug online</em>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(253,250,247,0.4)", fontFamily: "sans-serif", fontWeight: 300 }}>
            We zijn even offline. Tot snel.
          </p>
        </div>
      </body>
    </html>
  );
}
