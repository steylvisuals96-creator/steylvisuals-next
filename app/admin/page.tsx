"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const WORKER_URL = "https://steylvisuals-upload.steylvisuals96.workers.dev";

const FOLDERS = [
  { id: "images", label: "Foto's", icon: "🖼" },
  { id: "videos/web", label: "Video's", icon: "🎬" },
  { id: "logo", label: "Logo's", icon: "✦" },
];

const DEFAULT_CONTENT = {
  contact: {
    email: "Steylvisuals96@gmail.com",
    phone: "",
    instagram: "",
    linkedin: "",
  },
  hero: {
    subtext: "Van cinematic vastgoedvideo tot een website die converteert. Jouw creatieve partner in België.",
  },
  stats: [
    { num: "50+", label: "Panden gefilmd" },
    { num: "3", label: "Jaar ervaring" },
    { num: "2", label: "Services" },
  ],
  vastgoed: {
    subtext: "Short-form video die jouw panden in de kijker zet op Instagram, TikTok en LinkedIn. Professioneel gemaakt, voor makelaars die meer viewings willen.",
  },
};

type Content = typeof DEFAULT_CONTENT;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type FileItem = { key: string; size: number; url: string; uploaded?: string };

function Input({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  const style: React.CSSProperties = {
    width: "100%", padding: "0.7rem 0.9rem", backgroundColor: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
    color: "var(--cream)", fontSize: "0.875rem", outline: "none",
    fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.7rem", color: "var(--cream-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} style={style} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"files" | "content">("files");
  const [folder, setFolder] = useState("images");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; url?: string; error?: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tok = localStorage.getItem("sv_admin_token");
    if (tok) { setToken(tok); setAuthed(true); }
  }, []);

  async function loadFiles(tok = token, f = folder) {
    const res = await fetch(`${WORKER_URL}/list?folder=${f}`, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setFiles(data.objects || []);
  }

  async function loadContent(tok = token) {
    const res = await fetch(`${WORKER_URL}/content`, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (Object.keys(data).length > 0) {
      setContent(c => ({ ...DEFAULT_CONTENT, ...data, stats: data.stats || c.stats }));
    }
  }

  async function handleLogin() {
    const res = await fetch(`${WORKER_URL}/list?folder=images`, {
      headers: { Authorization: `Bearer ${tokenInput}` },
    });
    if (res.ok) {
      setToken(tokenInput);
      setAuthed(true);
      setAuthError(false);
      localStorage.setItem("sv_admin_token", tokenInput);
      loadFiles(tokenInput, folder);
      loadContent(tokenInput);
    } else {
      setAuthError(true);
    }
  }

  useEffect(() => {
    if (authed) { loadFiles(); loadContent(); }
  }, [authed]);

  useEffect(() => {
    if (authed && view === "files") loadFiles();
  }, [folder]);

  async function saveContent() {
    setSaving(true);
    await fetch(`${WORKER_URL}/content`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const uploadFiles = useCallback(async (fileList: File[]) => {
    setUploading(true);
    const initial = fileList.map(f => ({ name: f.name, done: false }));
    setProgress(initial);
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      try {
        const res = await fetch(`${WORKER_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true, url: data.url } : p));
      } catch {
        setProgress(prev => prev.map((p, idx) => idx === i ? { ...p, done: true, error: "Mislukt" } : p));
      }
    }
    setUploading(false);
    loadFiles();
  }, [token, folder]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) uploadFiles(dropped);
  }

  async function deleteFile(key: string) {
    if (!confirm(`Verwijder ${key}?`)) return;
    await fetch(`${WORKER_URL}/delete?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadFiles();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1800);
  }

  const updateStat = (i: number, field: "num" | "label", val: string) => {
    setContent(c => ({ ...c, stats: c.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100svh", backgroundColor: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "360px", padding: "2.5rem", border: "1px solid rgba(201,151,74,0.18)", borderRadius: "var(--r-md)", backgroundColor: "#111" }}>
          <p style={{ fontFamily: "serif", fontSize: "1.6rem", color: "var(--cream)", marginBottom: "0.4rem" }}>SteylVisuals</p>
          <p style={{ fontSize: "0.75rem", color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem" }}>Media beheer</p>
          <input
            type="password" placeholder="Toegangscode" value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#1a1a1a", border: `1px solid ${authError ? "#ef4444" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", color: "var(--cream)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
            autoFocus
          />
          {authError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>Verkeerde code</p>}
          <button onClick={handleLogin} style={{ width: "100%", marginTop: "1rem", padding: "0.85rem", backgroundColor: "var(--gold)", border: "none", borderRadius: "8px", color: "var(--black)", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "var(--black)", color: "var(--cream)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "serif", fontSize: "1.2rem" }}>SteylVisuals</span>
          <span style={{ marginLeft: "0.75rem", fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Beheer</span>
        </div>
        <button onClick={() => { localStorage.removeItem("sv_admin_token"); setAuthed(false); setToken(""); }} style={{ fontSize: "0.75rem", color: "var(--cream-muted)", background: "none", border: "none", cursor: "pointer" }}>
          Uitloggen
        </button>
      </div>

      <div style={{ display: "flex", height: "calc(100svh - 61px)" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 1rem", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {/* Content section */}
          <p style={{ fontSize: "0.65rem", color: "var(--cream-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", paddingLeft: "0.5rem" }}>Inhoud</p>
          <button
            onClick={() => setView("content")}
            style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", backgroundColor: view === "content" ? "rgba(201,151,74,0.15)" : "transparent", color: view === "content" ? "var(--gold)" : "rgba(241,237,230,0.6)" }}
          >
            <span>✏️</span> Teksten
          </button>

          {/* Media section */}
          <p style={{ fontSize: "0.65rem", color: "var(--cream-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "1rem 0 0.5rem", paddingLeft: "0.5rem" }}>Media</p>
          {FOLDERS.map(f => (
            <button
              key={f.id}
              onClick={() => { setView("files"); setFolder(f.id); setProgress([]); }}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.85rem", backgroundColor: view === "files" && folder === f.id ? "rgba(201,151,74,0.15)" : "transparent", color: view === "files" && folder === f.id ? "var(--gold)" : "rgba(241,237,230,0.6)" }}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: "2rem" }}>

          {/* CONTENT EDITOR */}
          {view === "content" && (
            <div style={{ maxWidth: "680px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--cream)" }}>Teksten & inhoud</h2>
                <button
                  onClick={saveContent}
                  style={{ padding: "0.65rem 1.5rem", backgroundColor: saved ? "#4ade80" : "var(--gold)", border: "none", borderRadius: "8px", color: "var(--black)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "background 0.3s" }}
                >
                  {saving ? "Opslaan..." : saved ? "Opgeslagen ✓" : "Opslaan"}
                </button>
              </div>

              {/* Contact */}
              <section style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: "1px solid rgba(201,151,74,0.15)", paddingBottom: "0.5rem" }}>Contactgegevens</p>
                <Input label="E-mailadres" value={content.contact.email} onChange={v => setContent(c => ({ ...c, contact: { ...c.contact, email: v } }))} />
                <Input label="Telefoonnummer" value={content.contact.phone} onChange={v => setContent(c => ({ ...c, contact: { ...c.contact, phone: v } }))} />
                <Input label="Instagram URL" value={content.contact.instagram} onChange={v => setContent(c => ({ ...c, contact: { ...c.contact, instagram: v } }))} />
                <Input label="LinkedIn URL" value={content.contact.linkedin} onChange={v => setContent(c => ({ ...c, contact: { ...c.contact, linkedin: v } }))} />
              </section>

              {/* Hero */}
              <section style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: "1px solid rgba(201,151,74,0.15)", paddingBottom: "0.5rem" }}>Homepagina</p>
                <Input label="Ondertitel hero" value={content.hero.subtext} onChange={v => setContent(c => ({ ...c, hero: { ...c.hero, subtext: v } }))} multiline />
              </section>

              {/* Stats */}
              <section style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: "1px solid rgba(201,151,74,0.15)", paddingBottom: "0.5rem" }}>Statistieken</p>
                {content.stats.map((stat, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" }}>
                    <Input label={`Getal ${i + 1}`} value={stat.num} onChange={v => updateStat(i, "num", v)} />
                    <Input label={`Label ${i + 1}`} value={stat.label} onChange={v => updateStat(i, "label", v)} />
                  </div>
                ))}
              </section>

              {/* Vastgoed */}
              <section style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem", borderBottom: "1px solid rgba(201,151,74,0.15)", paddingBottom: "0.5rem" }}>Vastgoed marketing pagina</p>
                <Input label="Ondertitel" value={content.vastgoed.subtext} onChange={v => setContent(c => ({ ...c, vastgoed: { ...c.vastgoed, subtext: v } }))} multiline />
              </section>
            </div>
          )}

          {/* FILE BROWSER */}
          {view === "files" && (
            <>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${dragging ? "var(--gold)" : "rgba(201,151,74,0.25)"}`, borderRadius: "12px", padding: "2.5rem", textAlign: "center", cursor: "pointer", backgroundColor: dragging ? "rgba(201,151,74,0.04)" : "transparent", transition: "all 0.2s", marginBottom: "2rem" }}
              >
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>+</p>
                <p style={{ color: "var(--cream-muted)", fontSize: "0.9rem" }}>Sleep bestanden hierheen of klik om te uploaden</p>
                <p style={{ color: "var(--gold)", fontSize: "0.75rem", marginTop: "0.35rem" }}>→ {FOLDERS.find(f => f.id === folder)?.label}</p>
                <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }} />
              </div>

              {progress.length > 0 && (
                <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {progress.map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "#111", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span>{p.error ? "✗" : p.done ? "✓" : "⏳"}</span>
                      <span style={{ fontSize: "0.85rem", flex: 1, color: p.error ? "#ef4444" : p.done ? "#4ade80" : "rgba(241,237,230,0.7)" }}>{p.name}</span>
                      {p.url && (
                        <button onClick={() => copyUrl(p.url!)} style={{ fontSize: "0.7rem", color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}>
                          {copied === p.url ? "Gekopieerd!" : "Kopieer URL"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize: "0.65rem", color: "var(--cream-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {files.length} bestanden in {folder}/
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                {files.map(file => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.key);
                  const isVideo = /\.(mp4|mov|webm)$/i.test(file.key);
                  const name = file.key.split("/").pop() || file.key;
                  return (
                    <div key={file.key} style={{ backgroundColor: "#111", borderRadius: "var(--r-sm)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {isImage && <img src={file.url} alt={name} style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }} />}
                      {isVideo && <div style={{ width: "100%", height: "120px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>▶</div>}
                      {!isImage && !isVideo && <div style={{ width: "100%", height: "120px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📄</div>}
                      <div style={{ padding: "0.75rem" }}>
                        <p style={{ fontSize: "0.75rem", color: "rgba(241,237,230,0.7)", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={name}>{name}</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--cream-muted)", marginBottom: "0.6rem" }}>{formatSize(file.size)}</p>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => copyUrl(file.url)} style={{ flex: 1, fontSize: "0.7rem", padding: "0.35rem", backgroundColor: "rgba(201,151,74,0.12)", border: "1px solid rgba(201,151,74,0.2)", borderRadius: "5px", color: "var(--gold)", cursor: "pointer" }}>
                            {copied === file.url ? "✓" : "URL"}
                          </button>
                          <button onClick={() => deleteFile(file.key)} style={{ fontSize: "0.7rem", padding: "0.35rem 0.6rem", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "5px", color: "var(--cream-muted)", cursor: "pointer" }}>✕</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
