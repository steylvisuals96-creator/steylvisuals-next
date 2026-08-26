"use client";

import { useEffect, useRef, useState } from "react";
import AnimateIn from "@/components/AnimateIn";

type Role = "user" | "assistant";
type ChatMsg = { role: Role; content: string };
type DisplayMsg = ChatMsg & { id: string; error?: boolean; options?: string[] };

const GREETING = "Hallo! Dit is een live demo van de AI-assistent die SteylVisuals bouwt voor websites. Ik ben volledig geprogrammeerd op maat — stel gerust een vraag over hoe dit werkt, of test gewoon hoe zo'n assistent aanvoelt. [Hoe werkt dit?|Wat kost het?|Wat kan een assistent doen?]";

let idCtr = 0;
function uid() { idCtr += 1; return `d${idCtr}`; }

function extractOptions(text: string): { clean: string; options: string[] } {
  const match = text.match(/\[([^\]]+)\]\s*$/);
  if (!match) return { clean: text, options: [] };
  const options = match[1].split("|").map((o) => o.trim()).filter(Boolean);
  return { clean: text.slice(0, match.index).trim(), options };
}

function parseGreeting() {
  return extractOptions(GREETING);
}

export default function AIAgentDemo() {
  const [messages, setMessages] = useState<DisplayMsg[]>(() => {
    const { clean, options } = parseGreeting();
    return [{ id: uid(), role: "assistant", content: clean, options }];
  });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const historyRef = useRef<ChatMsg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setMessages((m) => [...m, { id: uid(), role: "user", content: trimmed }]);
    historyRef.current = [...historyRef.current, { role: "user", content: trimmed }];
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyRef.current }),
      });
      const data = await res.json();
      const reply: string = data?.reply || "";
      if (!reply) {
        setMessages((m) => [...m, { id: uid(), role: "assistant", content: "Er ging iets mis. Probeer opnieuw.", error: true }]);
        return;
      }
      const { clean, options } = extractOptions(reply);
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: clean, options, error: !res.ok }]);
      if (res.ok) historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
    } catch {
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: "Verbindingsfout. Probeer opnieuw.", error: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section
      style={{
        backgroundColor: "var(--black)",
        padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)",
        borderTop: "1px solid rgba(201,151,74,0.08)",
      }}
    >
      <div className="max-w-[1100px] mx-auto grid gap-16 items-start grid-cols-1 lg:grid-cols-2">

        {/* Left: copy */}
        <div>
          <AnimateIn>
            <p
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-8"
              style={{ color: "var(--gold)" }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--gold)",
                  flexShrink: 0,
                }}
              />
              AI Integraties
            </p>
          </AnimateIn>

          <AnimateIn delay={0.05}>
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--cream)",
              }}
            >
              Een slimme assistent<br />
              <em style={{ color: "var(--gold)" }}>voor jouw website</em>
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <p
              className="text-sm font-light leading-relaxed mb-10"
              style={{ color: "var(--cream-muted)", maxWidth: "400px" }}
            >
              Ik bouw op maat geprogrammeerde AI-chatbots die 24/7 jouw bezoekers te woord staan — in jouw tone of voice, met jouw kennis en jouw look. Rechts zie je een live demo.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <div className="flex flex-col gap-3 mb-10">
              {[
                "Volledig aangepast aan jouw merk en stijl",
                "Beantwoordt vragen over jouw diensten of producten",
                "Kwalificeert leads en stuurt ze door",
                "Werkt op elke website, ook de jouwe",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 text-sm font-light"
                  style={{ color: "var(--cream-muted)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <a
              href="mailto:steylvisuals96@gmail.com?subject=AI-assistent voor mijn website"
              className="inline-block text-sm font-medium px-8 py-4"
              style={{ backgroundColor: "var(--gold)", color: "var(--black)" }}
            >
              Interesse? Mail ons
            </a>
          </AnimateIn>
        </div>

        {/* Right: embedded chat */}
        <AnimateIn direction="right" delay={0.1}>
          <div
            style={{
              backgroundColor: "var(--panel)",
              border: "1px solid rgba(201,151,74,0.18)",
              display: "flex",
              flexDirection: "column",
              height: "480px",
            }}
          >
            {/* Chat header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid rgba(241,237,230,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "var(--gold)",
                    boxShadow: "0 0 6px rgba(201,151,74,0.6)",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "var(--cream)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  AI Assistent
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    fontSize: "0.65rem",
                    color: "var(--gold)",
                    backgroundColor: "rgba(201,151,74,0.12)",
                    padding: "0.15rem 0.5rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  DEMO
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontSize: "0.65rem",
                  color: "var(--cream-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                by SteylVisuals
              </p>
            </div>

            {/* Messages */}
            <div
              ref={logRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <div style={{ maxWidth: "85%" }}>
                    <div
                      style={{
                        padding: "0.6rem 0.875rem",
                        fontFamily: "var(--font-poppins), system-ui, sans-serif",
                        fontSize: "0.8rem",
                        lineHeight: 1.65,
                        backgroundColor:
                          m.role === "user"
                            ? "var(--gold)"
                            : m.error
                              ? "rgba(241,237,230,0.04)"
                              : "rgba(241,237,230,0.07)",
                        color: m.role === "user" ? "var(--black)" : "var(--cream)",
                        borderLeft: m.error ? "2px solid rgba(201,151,74,0.5)" : "none",
                      }}
                    >
                      {m.content}
                    </div>

                    {/* Option chips */}
                    {m.role === "assistant" && m.options && m.options.length > 0 && (
                      <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                        {m.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            disabled={busy}
                            onClick={() => send(opt)}
                            style={{
                              border: "1px solid rgba(201,151,74,0.3)",
                              background: "transparent",
                              color: "var(--cream-muted)",
                              padding: "0.25rem 0.65rem",
                              fontSize: "0.7rem",
                              fontFamily: "var(--font-poppins), system-ui, sans-serif",
                              cursor: busy ? "default" : "pointer",
                              opacity: busy ? 0.4 : 1,
                              transition: "border-color 150ms, color 150ms",
                            }}
                            onMouseEnter={(e) => {
                              if (!busy) {
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold)";
                                (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.3)";
                              (e.currentTarget as HTMLButtonElement).style.color = "var(--cream-muted)";
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {busy && (
                <div style={{ display: "flex", gap: "5px", alignItems: "center", paddingLeft: "0.25rem" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        display: "block",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: "var(--gold)",
                        animation: `sv-dot-pulse 1.4s cubic-bezier(0.4,0,0.6,1) ${i * 0.22}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              style={{
                borderTop: "1px solid rgba(241,237,230,0.07)",
                padding: "0.875rem 1.25rem",
                display: "flex",
                gap: "0.625rem",
                alignItems: "center",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Typ je vraag…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(241,237,230,0.15)",
                  color: "var(--cream)",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontSize: "0.8rem",
                  padding: "0.4rem 0",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Versturen"
                style={{
                  width: "2rem",
                  height: "2rem",
                  flexShrink: 0,
                  background: "var(--gold)",
                  border: "none",
                  cursor: busy || !input.trim() ? "default" : "pointer",
                  opacity: busy || !input.trim() ? 0.25 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 200ms",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </AnimateIn>

      </div>

      {/* Dot bounce keyframes */}
      <style>{`
        @keyframes sv-dot-pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
