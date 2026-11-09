"use client";

import { useState } from "react";
import s from "./toegang.module.css";

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
    <form onSubmit={submit} className={s.form}>
      <label htmlFor="code" className={s.label}>
        Toegangscode
      </label>
      <input
        id="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        required
        className={s.veld}
      />
      {error && (
        <p role="alert" className={s.fout}>
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className={s.knop}>
        {busy ? "Even controleren" : "Naar de site"}
      </button>
    </form>
  );
}
