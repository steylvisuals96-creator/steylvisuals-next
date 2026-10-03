"use client";

import { useState } from "react";

export default function AccessForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/toegang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error || "Er ging iets mis, probeer opnieuw.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit}>
      <label
        htmlFor="code"
        style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cream-muted)", marginBottom: "0.5rem" }}
      >
        Toegangscode
      </label>
      <input
        id="code" value={code} onChange={e => setCode(e.target.value)}
        autoComplete="off" autoCapitalize="off" spellCheck={false} required
        style={{
          width: "100%", boxSizing: "border-box", padding: "0.85rem 1rem",
          background: "var(--panel)", border: "1px solid var(--hairline-strong)", borderRadius: "var(--r-sm)",
          color: "var(--cream)", fontSize: "1rem", fontFamily: "inherit", outline: "none",
        }}
      />
      {error && <p role="alert" style={{ color: "var(--gold-light)", fontSize: "0.875rem", marginTop: "0.75rem" }}>{error}</p>}
      <button
        type="submit" disabled={busy}
        style={{
          marginTop: "1.25rem", width: "100%", padding: "0.9rem 1rem",
          background: "var(--gold)", color: "var(--black)", border: "none", borderRadius: "var(--r-sm)",
          fontSize: "0.95rem", fontWeight: 500, fontFamily: "inherit", cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.7 : 1,
        }}
      >
        {busy ? "Even controleren…" : "Naar de site"}
      </button>
    </form>
  );
}
