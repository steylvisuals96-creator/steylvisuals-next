"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Inspiratie-library.
 *
 * Beelden leven in R2 onder `inspiration/`, de metadata + analyse in één
 * `library.json` blob (zelfde patroon als content.json). Uploaden en verwijderen
 * schrijven meteen weg; tekstuele bewerkingen worden met "Opslaan" bewaard.
 *
 * De analyse zelf wordt NIET hier gegenereerd — dat gebeurt in een Claude-sessie
 * via scripts/inspiration.mjs, dat exact deze library.json leest en terugschrijft.
 */

export type InspItem = {
  id: string;
  key: string;
  url: string;
  client: string; // klant / project
  uploaded: string;
  analyzed: boolean;
  colors: string[]; // hex
  style: string;
  typography: string;
  layout: string;
  mood: string;
  useCase: string;
  tags: string[];
  notes: string;
};

const EMPTY_ANALYSIS = {
  analyzed: false,
  colors: [] as string[],
  style: "",
  typography: "",
  layout: "",
  mood: "",
  useCase: "",
  tags: [] as string[],
  notes: "",
};

function newId() {
  return `insp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const gold = "var(--gold)";
const cream = "var(--cream)";
const muted = "var(--cream-muted)";
const panel = "#111";
const hair = "rgba(255,255,255,0.07)";

export default function InspirationLibrary({
  token,
  workerUrl,
}: {
  token: string;
  workerUrl: string;
}) {
  const [items, setItems] = useState<InspItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; error?: string }[]>([]);
  const [uploadClient, setUploadClient] = useState("");
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [onlyUnanalyzed, setOnlyUnanalyzed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadLibrary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${workerUrl}/library`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      }
    } finally {
      setLoading(false);
    }
  }, [token, workerUrl]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const persist = useCallback(
    async (next: InspItem[]) => {
      setSaving(true);
      try {
        await fetch(`${workerUrl}/library`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ items: next }),
        });
        setDirty(false);
      } finally {
        setSaving(false);
      }
    },
    [token, workerUrl]
  );

  const uploadFiles = useCallback(
    async (fileList: File[]) => {
      const images = fileList.filter((f) => f.type.startsWith("image/"));
      if (!images.length) return;
      setUploading(true);
      setProgress(images.map((f) => ({ name: f.name, done: false })));
      const added: InspItem[] = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "inspiration");
        try {
          const res = await fetch(`${workerUrl}/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });
          const data = await res.json();
          added.push({
            id: newId(),
            key: data.key,
            url: data.url,
            client: uploadClient.trim(),
            uploaded: new Date().toISOString(),
            ...EMPTY_ANALYSIS,
          });
          setProgress((prev) => prev.map((p, idx) => (idx === i ? { ...p, done: true } : p)));
        } catch {
          setProgress((prev) =>
            prev.map((p, idx) => (idx === i ? { ...p, done: true, error: "Mislukt" } : p))
          );
        }
      }
      setUploading(false);
      // Dedup op key: als je hetzelfde bestand opnieuw uploadt, vervangt R2 het
      // object in place — hou dan de bestaande (mogelijk geanalyseerde) entry.
      const existingKeys = new Set(items.map((it) => it.key));
      const fresh = added.filter((a) => !existingKeys.has(a.key));
      const next = [...fresh, ...items];
      setItems(next);
      persist(next);
      setTimeout(() => setProgress([]), 2500);
    },
    [items, token, workerUrl, uploadClient, persist]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) uploadFiles(dropped);
  }

  function updateItem(id: string, patch: Partial<InspItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    setDirty(true);
  }

  async function deleteItem(item: InspItem) {
    if (!confirm(`Verwijder dit inspiratiebeeld?`)) return;
    await fetch(`${workerUrl}/delete?key=${encodeURIComponent(item.key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const next = items.filter((it) => it.id !== item.id);
    setItems(next);
    persist(next);
  }

  // Afgeleide filter-opties
  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [items]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.colors?.forEach((c) => set.add(c.toLowerCase())));
    return [...set];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (onlyUnanalyzed && it.analyzed) return false;
      if (activeColor && !it.colors?.some((c) => c.toLowerCase() === activeColor)) return false;
      if (activeTags.length && !activeTags.every((t) => it.tags?.includes(t))) return false;
      if (q) {
        const hay = [
          it.client,
          it.style,
          it.typography,
          it.layout,
          it.mood,
          it.useCase,
          it.notes,
          ...(it.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, activeTags, activeColor, onlyUnanalyzed]);

  const unanalyzedCount = items.filter((it) => !it.analyzed).length;

  function toggleTag(t: string) {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Kop */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "serif", fontSize: "1.4rem", fontWeight: 400, color: cream }}>Inspiratie-library</h2>
          <p style={{ fontSize: "0.75rem", color: muted, marginTop: "0.25rem" }}>
            {items.length} {items.length === 1 ? "beeld" : "beelden"}
            {unanalyzedCount > 0 && ` · ${unanalyzedCount} nog te analyseren`}
          </p>
        </div>
        <button
          onClick={() => persist(items)}
          disabled={!dirty || saving}
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: dirty ? gold : "rgba(201,151,74,0.2)",
            border: "none",
            borderRadius: "8px",
            color: dirty ? "var(--black)" : muted,
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: dirty ? "pointer" : "default",
          }}
        >
          {saving ? "Opslaan..." : dirty ? "Wijzigingen opslaan" : "Opgeslagen ✓"}
        </button>
      </div>

      {/* Upload-zone */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "stretch" }}>
        <input
          type="text"
          value={uploadClient}
          onChange={(e) => setUploadClient(e.target.value)}
          placeholder="Klant / project (optioneel)"
          style={{ flex: "0 0 240px", padding: "0.7rem 0.9rem", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: cream, fontSize: "0.85rem", outline: "none" }}
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{ flex: 1, minWidth: "260px", border: `2px dashed ${dragging ? gold : "rgba(201,151,74,0.25)"}`, borderRadius: "12px", padding: "1.1rem", textAlign: "center", cursor: "pointer", backgroundColor: dragging ? "rgba(201,151,74,0.04)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <span style={{ fontSize: "1.2rem", color: gold }}>+</span>
          <span style={{ color: muted, fontSize: "0.85rem" }}>
            {uploading ? "Uploaden..." : "Sleep screenshots / Pinterest-beelden hier of klik"}
          </span>
          <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }} />
        </div>
      </div>

      {progress.length > 0 && (
        <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {progress.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem", color: p.error ? "#ef4444" : p.done ? "#4ade80" : muted }}>
              <span>{p.error ? "✗" : p.done ? "✓" : "⏳"}</span> {p.name}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", padding: "1rem", backgroundColor: panel, border: `1px solid ${hair}`, borderRadius: "10px" }}>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek op stijl, mood, klant, tag..."
            style={{ flex: 1, minWidth: "220px", padding: "0.6rem 0.9rem", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: cream, fontSize: "0.85rem", outline: "none" }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: muted, cursor: "pointer" }}>
            <input type="checkbox" checked={onlyUnanalyzed} onChange={(e) => setOnlyUnanalyzed(e.target.checked)} />
            Enkel nog te analyseren
          </label>
          {(query || activeTags.length || activeColor || onlyUnanalyzed) && (
            <button onClick={() => { setQuery(""); setActiveTags([]); setActiveColor(null); setOnlyUnanalyzed(false); }} style={{ fontSize: "0.75rem", color: gold, background: "none", border: "none", cursor: "pointer" }}>
              Wis filters
            </button>
          )}
        </div>

        {allColors.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", color: muted, marginRight: "0.25rem" }}>Kleur:</span>
            {allColors.map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(activeColor === c ? null : c)}
                title={c}
                style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: c, cursor: "pointer", border: activeColor === c ? `2px solid ${cream}` : "1px solid rgba(255,255,255,0.2)", outline: activeColor === c ? `1px solid ${gold}` : "none" }}
              />
            ))}
          </div>
        )}

        {allTags.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", color: muted, marginRight: "0.25rem" }}>Tags:</span>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                style={{ fontSize: "0.72rem", padding: "0.25rem 0.6rem", borderRadius: "999px", cursor: "pointer", border: `1px solid ${activeTags.includes(t) ? gold : "rgba(255,255,255,0.12)"}`, backgroundColor: activeTags.includes(t) ? "rgba(201,151,74,0.15)" : "transparent", color: activeTags.includes(t) ? gold : muted }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: muted, fontSize: "0.85rem" }}>Laden...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: muted, fontSize: "0.85rem" }}>
          {items.length === 0 ? "Nog geen inspiratie. Upload je eerste beelden hierboven." : "Geen resultaten voor deze filters."}
        </p>
      ) : (
        <div style={{ columnWidth: "260px", columnGap: "1rem" }}>
          {filtered.map((item) => (
            <Card key={item.id} item={item} onChange={(patch) => updateItem(item.id, patch)} onDelete={() => deleteItem(item)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({
  item,
  onChange,
  onDelete,
}: {
  item: InspItem;
  onChange: (patch: Partial<InspItem>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ breakInside: "avoid", marginBottom: "1rem", backgroundColor: "#111", borderRadius: "10px", overflow: "hidden", border: `1px solid ${item.analyzed ? "rgba(201,151,74,0.2)" : "rgba(255,255,255,0.07)"}` }}>
      <div style={{ position: "relative" }}>
        {/* Volledige pagina-screenshots zijn extreem hoog. Ongelimiteerd worden
            kaarten dan honderden pixels lang en verdwijnt het overzicht, dus
            toon een bovenkant-uitsnede; klikken opent het beeld op ware grootte. */}
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.style || "inspiratie"}
            style={{ width: "100%", maxHeight: "420px", objectFit: "cover", objectPosition: "top", display: "block", cursor: "zoom-in" }}
          />
        </a>
        {!item.analyzed && (
          <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", fontSize: "0.62rem", padding: "0.2rem 0.5rem", borderRadius: "999px", backgroundColor: "rgba(13,11,9,0.85)", color: gold, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Nog te analyseren
          </span>
        )}
        {item.client && (
          <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "0.62rem", padding: "0.2rem 0.5rem", borderRadius: "999px", backgroundColor: "rgba(13,11,9,0.85)", color: cream }}>
            {item.client}
          </span>
        )}
      </div>

      <div style={{ padding: "0.75rem" }}>
        {item.colors?.length > 0 && (
          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
            {item.colors.map((c, i) => (
              <span key={i} title={c} style={{ width: "18px", height: "18px", borderRadius: "4px", backgroundColor: c, border: "1px solid rgba(255,255,255,0.15)" }} />
            ))}
          </div>
        )}

        {item.style && <p style={{ fontSize: "0.85rem", color: cream, marginBottom: "0.25rem" }}>{item.style}</p>}
        {item.mood && <p style={{ fontSize: "0.72rem", color: muted, marginBottom: "0.5rem" }}>{item.mood}</p>}

        {item.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {item.tags.map((t, i) => (
              <span key={i} style={{ fontSize: "0.65rem", padding: "0.15rem 0.5rem", borderRadius: "999px", backgroundColor: "rgba(201,151,74,0.1)", color: gold }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
          <button onClick={() => setOpen((o) => !o)} style={{ flex: 1, fontSize: "0.7rem", padding: "0.35rem", backgroundColor: "rgba(201,151,74,0.12)", border: "1px solid rgba(201,151,74,0.2)", borderRadius: "6px", color: gold, cursor: "pointer" }}>
            {open ? "Sluiten" : "Bewerken"}
          </button>
          <button onClick={onDelete} style={{ fontSize: "0.7rem", padding: "0.35rem 0.6rem", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: muted, cursor: "pointer" }}>✕</button>
        </div>

        {open && (
          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: `1px solid ${hair}`, paddingTop: "0.75rem" }}>
            <Field label="Klant / project" value={item.client} onChange={(v) => onChange({ client: v })} />
            <Field label="Stijl" value={item.style} onChange={(v) => onChange({ style: v })} />
            <Field label="Mood / sfeer" value={item.mood} onChange={(v) => onChange({ mood: v })} />
            <Field label="Typografie" value={item.typography} onChange={(v) => onChange({ typography: v })} />
            <Field label="Layout" value={item.layout} onChange={(v) => onChange({ layout: v })} />
            <Field label="Toepassing" value={item.useCase} onChange={(v) => onChange({ useCase: v })} />
            <Field label="Kleuren (komma, hex)" value={(item.colors || []).join(", ")} onChange={(v) => onChange({ colors: splitList(v) })} />
            <Field label="Tags (komma)" value={(item.tags || []).join(", ")} onChange={(v) => onChange({ tags: splitList(v) })} />
            <Field label="Notities" value={item.notes} onChange={(v) => onChange({ notes: v })} multiline />
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: muted, cursor: "pointer" }}>
              <input type="checkbox" checked={item.analyzed} onChange={(e) => onChange({ analyzed: e.target.checked })} />
              Gemarkeerd als geanalyseerd
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function splitList(v: string) {
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const style: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.6rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: cream,
    fontSize: "0.78rem",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    boxSizing: "border-box",
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.62rem", color: muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{label}</label>
      {multiline ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} style={style} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={style} />
      )}
    </div>
  );
}
