"use client";

import { useState } from "react";

type Made = { name: string; code: string; link: string; expiresAt: string };

const field: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.9rem", backgroundColor: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--r-sm)",
  color: "var(--cream)", fontSize: "0.875rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const label: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", color: "var(--cream-muted)", letterSpacing: "0.08em",
  textTransform: "uppercase", marginBottom: "0.4rem",
};

/**
 * Makes temporary access codes for the gated site. Codes are signed and carry
 * their own expiry, so there is no list to keep: a code simply stops working
 * on its date. Rotating ACCESS_SECRET in Vercel revokes all of them at once.
 */
export default function AccessCodes({ token }: { token: string }) {
  const [name, setName] = useState("");
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [made, setMade] = useState<Made[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/toegang/nieuw", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name, days }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Code maken mislukt.");
      return;
    }
    setMade((m) => [{ name: name || "gast", ...data }, ...m]);
    setName("");
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", fontWeight: 400, margin: "0 0 0.5rem" }}>Toegang tot de site</h2>
      <p style={{ color: "var(--cream-muted)", fontSize: "0.875rem", lineHeight: 1.6, margin: "0 0 2rem" }}>
        De site staat achter een code. Maak hier een tijdelijke toegang voor iemand en stuur de link door.
        Wie de link opent, komt meteen binnen tot de code verloopt.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0.75rem", alignItems: "end" }}>
        <div>
          <label htmlFor="ac-name" style={label}>Voor wie</label>
          <input id="ac-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="bv. Bernard Frère" style={field} />
        </div>
        <div>
          <label htmlFor="ac-days" style={label}>Geldig</label>
          <select id="ac-days" value={days} onChange={(e) => setDays(Number(e.target.value))} style={field}>
            <option value={1}>1 dag</option>
            <option value={3}>3 dagen</option>
            <option value={7}>1 week</option>
            <option value={14}>2 weken</option>
            <option value={30}>30 dagen</option>
          </select>
        </div>
      </div>
      <button
        onClick={create}
        disabled={busy}
        style={{ marginTop: "1rem", padding: "0.75rem 1.5rem", backgroundColor: "var(--gold)", border: "none", borderRadius: "var(--r-sm)", color: "var(--black)", fontSize: "0.85rem", fontWeight: 600, cursor: busy ? "wait" : "pointer" }}
      >
        {busy ? "Even geduld" : "Maak toegangslink"}
      </button>
      {error && <p role="alert" style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.75rem" }}>{error}</p>}

      {made.length > 0 && (
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {made.map((m) => (
            <div key={m.code} style={{ padding: "1rem 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.85rem" }}>
                <strong style={{ fontWeight: 500 }}>{m.name}</strong>
                <span style={{ color: "var(--cream-muted)" }}>
                  geldig tot {new Date(m.expiresAt).toLocaleDateString("nl-BE", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
                <input readOnly value={m.link} style={{ ...field, fontSize: "0.75rem", color: "var(--gold-light)" }} onFocus={(e) => e.target.select()} />
                <button onClick={() => copy(m.link)} style={{ padding: "0 1rem", backgroundColor: "transparent", border: "1px solid rgba(201,151,74,0.4)", borderRadius: "var(--r-sm)", color: "var(--gold)", fontSize: "0.75rem", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {copied === m.link ? "Gekopieerd" : "Kopieer link"}
                </button>
              </div>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "var(--cream-muted)" }}>
                Of de code apart: <code style={{ color: "var(--cream)" }}>{m.code}</code>
              </p>
            </div>
          ))}
          <p style={{ fontSize: "0.75rem", color: "var(--cream-muted)", marginTop: "1rem", lineHeight: 1.6 }}>
            Gemaakte links worden nergens bewaard. Kopieer ze nu. Alle codes in één keer intrekken? Wijzig ACCESS_SECRET in Vercel.
          </p>
        </div>
      )}
    </div>
  );
}
