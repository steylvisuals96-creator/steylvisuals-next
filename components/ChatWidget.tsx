"use client";

import { useEffect, useId, useRef, useState } from "react";

type Role = "user" | "assistant";
type ChatMsg = { role: Role; content: string };
type DisplayMsg = ChatMsg & { id: string; error?: boolean; options?: string[] };

const GREETING =
  "Hallo! Ik ben de AI-assistent van SteylVisuals. Ik help je graag bij vragen over video marketing of webdesign. Waarmee kan ik je helpen? [Video marketing|Webdesign|Beide]";

const ERROR_TEXT =
  "Er ging iets mis. Probeer het opnieuw of mail ons op steylvisuals96@gmail.com.";

let idCounter = 0;
function nextId() { idCounter += 1; return `m${idCounter}`; }

function extractOptions(text: string): { clean: string; options: string[] } {
  const match = text.match(/\[([^\]]+)\]\s*$/);
  if (!match) return { clean: text, options: [] };
  const options = match[1].split("|").map((o) => o.trim()).filter(Boolean);
  return { clean: text.slice(0, match.index).trim(), options };
}

function OptionChips({ options, disabled, onSend }: { options: string[]; disabled: boolean; onSend: (t: string) => void }) {
  return (
    <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onSend(opt)}
          style={{
            border: "1px solid rgba(201,151,74,0.4)",
            background: "transparent",
            color: "var(--cream-muted)",
            padding: "0.3rem 0.75rem",
            fontSize: "0.75rem",
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.4 : 1,
            transition: "border-color 200ms, color 200ms",
          }}
          onMouseEnter={(e) => {
            if (!disabled) { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)"; }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,151,74,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--cream-muted)";
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<DisplayMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [attention, setAttention] = useState(false);
  const historyRef = useRef<ChatMsg[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (open && !opened) {
      setOpened(true);
      setMessages([{ id: nextId(), role: "assistant", content: GREETING.replace(/\[.*\]$/, "").trim(), options: ["Video marketing", "Webdesign", "Beide"] }]);
    }
  }, [open, opened]);

  useEffect(() => {
    let shown = false;
    try { shown = sessionStorage.getItem("svChatAttentionShown") === "1"; } catch { shown = true; }
    if (shown) return;
    const timer = setTimeout(() => {
      setAttention(true);
      try { sessionStorage.setItem("svChatAttentionShown", "1"); } catch { /* noop */ }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && open) setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", content: trimmed }]);
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
      const reply = data?.reply || "";
      if (!reply) {
        setMessages((m) => [...m, { id: nextId(), role: "assistant", content: ERROR_TEXT, error: true }]);
        return;
      }
      const { clean, options } = extractOptions(reply);
      setMessages((m) => [...m, { id: nextId(), role: "assistant", content: clean, error: !res.ok, options }]);
      if (res.ok) historyRef.current = [...historyRef.current, { role: "assistant", content: reply }];
    } catch {
      setMessages((m) => [...m, { id: nextId(), role: "assistant", content: ERROR_TEXT, error: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <style>{`
        @keyframes sv-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,151,74,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(201,151,74,0); }
        }
        .sv-chat-attention { animation: sv-pulse 1.4s ease-out 2; }
      `}</style>

      {/* Launcher button */}
      <button
        type="button"
        onClick={() => { setAttention(false); setOpen(true); }}
        onAnimationEnd={() => setAttention(false)}
        aria-expanded={open}
        aria-controls={panelId}
        className={attention ? "sv-chat-attention" : ""}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 400,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.25rem",
          background: "var(--gold)",
          color: "var(--black)",
          border: "none",
          fontFamily: "var(--font-poppins), system-ui, sans-serif",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          transition: "opacity 300ms, background 200ms",
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 2h12v9H9l-3 3V11H2V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        Stel een vraag
      </button>

      {/* Chat panel */}
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Chat met SteylVisuals"
        inert={!open}
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          left: "1rem",
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          background: "var(--panel)",
          border: "1px solid var(--hairline-strong)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
          height: "min(580px, calc(100dvh - 2rem))",
          transition: "opacity 300ms, transform 300ms",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Responsive: wider on desktop via CSS */}
        <style>{`
          @media (min-width: 640px) {
            #${CSS.escape(panelId)} {
              left: auto !important;
              width: 380px;
              right: 1.5rem !important;
              bottom: 1.5rem !important;
            }
          }
        `}</style>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid var(--hairline)" }}>
          <div>
            <p style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem", fontWeight: 600, color: "var(--cream)", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>
              SteylVisuals
            </p>
            <p style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif", fontSize: "0.7rem", color: "var(--cream-muted)", margin: "0.2rem 0 0" }}>
              AI-assistent
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Chat sluiten"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--cream-muted)", padding: "0.25rem", lineHeight: 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={logRef} style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "88%" }}>
                <div style={{
                  padding: "0.625rem 0.875rem",
                  fontFamily: "var(--font-poppins), system-ui, sans-serif",
                  fontSize: "0.8125rem",
                  lineHeight: 1.6,
                  background: m.role === "user" ? "var(--gold)" : m.error ? "rgba(241,237,230,0.05)" : "rgba(241,237,230,0.07)",
                  color: m.role === "user" ? "var(--black)" : m.error ? "var(--cream-muted)" : "var(--cream)",
                  borderLeft: m.error ? "2px solid var(--gold)" : "none",
                }}>
                  {m.content}
                </div>
                {m.role === "assistant" && m.options && m.options.length > 0 && (
                  <OptionChips options={m.options} disabled={busy} onSend={send} />
                )}
              </div>
            </div>
          ))}
          {busy && (
            <p style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cream-muted)" }}>
              Aan het typen…
            </p>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          style={{ borderTop: "1px solid var(--hairline)", padding: "0.75rem 1.25rem" }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              placeholder="Typ je vraag…"
              style={{
                flex: 1,
                resize: "none",
                maxHeight: "6rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--hairline-strong)",
                color: "var(--cream)",
                fontFamily: "var(--font-poppins), system-ui, sans-serif",
                fontSize: "0.8125rem",
                padding: "0.5rem 0",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Versturen"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                flexShrink: 0,
                background: "var(--gold)",
                border: "none",
                cursor: busy || !input.trim() ? "default" : "pointer",
                opacity: busy || !input.trim() ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 200ms",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p style={{ marginTop: "0.5rem", fontFamily: "var(--font-poppins), system-ui, sans-serif", fontSize: "0.65rem", color: "var(--cream-faint)" }}>
            Liever direct mailen?{" "}
            <a href="mailto:steylvisuals96@gmail.com" style={{ color: "var(--gold)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              steylvisuals96@gmail.com
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
