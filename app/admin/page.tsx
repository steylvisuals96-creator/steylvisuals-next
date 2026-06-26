"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const WORKER_URL = "https://steylvisuals-upload.steylvisuals96.workers.dev";

const FOLDERS = [
  { id: "images", label: "Foto's", icon: "🖼" },
  { id: "videos/web", label: "Video's", icon: "🎬" },
  { id: "logo", label: "Logo's", icon: "✦" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type FileItem = { key: string; size: number; url: string; uploaded?: string };

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [folder, setFolder] = useState("images");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; url?: string; error?: string }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sv_admin_token");
    if (saved) { setToken(saved); setAuthed(true); }
  }, []);

  async function loadFiles(tok = token, f = folder) {
    const res = await fetch(`${WORKER_URL}/list?folder=${f}`, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setFiles(data.objects || []);
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
    } else {
      setAuthError(true);
    }
  }

  useEffect(() => {
    if (authed) loadFiles();
  }, [authed, folder]);

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

  if (!authed) {
    return (
      <div style={{ minHeight: "100svh", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "360px", padding: "2.5rem", border: "1px solid rgba(184,132,58,0.18)", borderRadius: "16px", backgroundColor: "#111" }}>
          <p style={{ fontFamily: "serif", fontSize: "1.6rem", color: "#FDFAF7", marginBottom: "0.4rem" }}>SteylVisuals</p>
          <p style={{ fontSize: "0.75rem", color: "#B8843A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2rem" }}>Media beheer</p>
          <input
            type="password"
            placeholder="Toegangscode"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "0.85rem 1rem", backgroundColor: "#1a1a1a", border: `1px solid ${authError ? "#ef4444" : "rgba(255,255,255,0.1)"}`, borderRadius: "8px", color: "#FDFAF7", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
            autoFocus
          />
          {authError && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.5rem" }}>Verkeerde code</p>}
          <button
            onClick={handleLogin}
            style={{ width: "100%", marginTop: "1rem", padding: "0.85rem", backgroundColor: "#B8843A", border: "none", borderRadius: "8px", color: "#0A0A0A", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}
          >
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#0A0A0A", color: "#FDFAF7" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "serif", fontSize: "1.2rem" }}>SteylVisuals</span>
          <span style={{ marginLeft: "0.75rem", fontSize: "0.7rem", color: "#B8843A", letterSpacing: "0.1em", textTransform: "uppercase" }}>Media beheer</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem("sv_admin_token"); setAuthed(false); setToken(""); }}
          style={{ fontSize: "0.75rem", color: "rgba(253,250,247,0.35)", background: "none", border: "none", cursor: "pointer" }}
        >
          Uitloggen
        </button>
      </div>

      <div style={{ display: "flex", height: "calc(100svh - 61px)" }}>
        {/* Sidebar */}
        <div style={{ width: "200px", borderRight: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 1rem", flexShrink: 0 }}>
          <p style={{ fontSize: "0.65rem", color: "rgba(253,250,247,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem", paddingLeft: "0.5rem" }}>Mappen</p>
          {FOLDERS.map(f => (
            <button
              key={f.id}
              onClick={() => { setFolder(f.id); setProgress([]); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.75rem",
                borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.85rem",
                backgroundColor: folder === f.id ? "rgba(184,132,58,0.15)" : "transparent",
                color: folder === f.id ? "#B8843A" : "rgba(253,250,247,0.6)",
              }}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto", padding: "2rem" }}>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? "#B8843A" : "rgba(184,132,58,0.25)"}`,
              borderRadius: "12px",
              padding: "2.5rem",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: dragging ? "rgba(184,132,58,0.04)" : "transparent",
              transition: "all 0.2s",
              marginBottom: "2rem",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>+</p>
            <p style={{ color: "rgba(253,250,247,0.5)", fontSize: "0.9rem" }}>Sleep bestanden hierheen of klik om te uploaden</p>
            <p style={{ color: "#B8843A", fontSize: "0.75rem", marginTop: "0.35rem" }}>→ {FOLDERS.find(f2 => f2.id === folder)?.label}</p>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }}
            />
          </div>

          {/* Upload progress */}
          {progress.length > 0 && (
            <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {progress.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", backgroundColor: "#111", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: "1rem" }}>{p.error ? "✗" : p.done ? "✓" : "⏳"}</span>
                  <span style={{ fontSize: "0.85rem", flex: 1, color: p.error ? "#ef4444" : p.done ? "#4ade80" : "rgba(253,250,247,0.7)" }}>{p.name}</span>
                  {p.url && (
                    <button onClick={() => copyUrl(p.url!)} style={{ fontSize: "0.7rem", color: "#B8843A", background: "none", border: "none", cursor: "pointer" }}>
                      {copied === p.url ? "Gekopieerd!" : "Kopieer URL"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* File list */}
          <p style={{ fontSize: "0.65rem", color: "rgba(253,250,247,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            {files.length} bestanden in {folder}/
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
            {files.map(file => {
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.key);
              const isVideo = /\.(mp4|mov|webm)$/i.test(file.key);
              const name = file.key.split("/").pop() || file.key;
              return (
                <div key={file.key} style={{ backgroundColor: "#111", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {isImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.url} alt={name} style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }} />
                  )}
                  {isVideo && (
                    <div style={{ width: "100%", height: "120px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>▶</div>
                  )}
                  {!isImage && !isVideo && (
                    <div style={{ width: "100%", height: "120px", backgroundColor: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📄</div>
                  )}
                  <div style={{ padding: "0.75rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "rgba(253,250,247,0.7)", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={name}>{name}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(253,250,247,0.3)", marginBottom: "0.6rem" }}>{formatSize(file.size)}</p>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => copyUrl(file.url)}
                        style={{ flex: 1, fontSize: "0.7rem", padding: "0.35rem", backgroundColor: "rgba(184,132,58,0.12)", border: "1px solid rgba(184,132,58,0.2)", borderRadius: "5px", color: "#B8843A", cursor: "pointer" }}
                      >
                        {copied === file.url ? "✓" : "URL"}
                      </button>
                      <button
                        onClick={() => deleteFile(file.key)}
                        style={{ fontSize: "0.7rem", padding: "0.35rem 0.6rem", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "5px", color: "rgba(253,250,247,0.35)", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
