"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Inspiratie-library.
 *
 * Geen archief maar een prompt-bibliotheek: losse beelden worden geclusterd in
 * benoemde stijlrichtingen, en elke richting levert een kopieerbaar briefingblok
 * (omschrijving + vocabulaire + inzetgebied + risico) dat rechtstreeks in een
 * prompt geplakt kan worden. De beelden eronder zijn het bewijsmateriaal.
 *
 * Beelden leven in R2 onder `inspiration/`, alle metadata in één `library.json`
 * blob (zelfde patroon als content.json). Uploaden en verwijderen schrijven
 * meteen weg; tekstuele bewerkingen worden met "Opslaan" bewaard.
 *
 * De analyse wordt NIET hier gegenereerd — dat gebeurt in een Claude-sessie via
 * scripts/inspiration.mjs, dat exact deze library.json leest en terugschrijft.
 */

export type InspItem = {
  id: string;
  key: string;
  url: string;
  client: string; // klant / project
  uploaded: string;
  analyzed: boolean;
  directionId: string; // "" = nog niet toegewezen
  colors: string[]; // hex
  style: string;
  typography: string;
  layout: string;
  mood: string;
  useCase: string;
  tags: string[];
  notes: string;
};

export type Direction = {
  id: string;
  name: string;
  description: string;
  deployFor: string;
  risk: string;
  vocab: string[];
};

const EMPTY_ANALYSIS = {
  analyzed: false,
  directionId: "",
  colors: [] as string[],
  style: "",
  typography: "",
  layout: "",
  mood: "",
  useCase: "",
  tags: [] as string[],
  notes: "",
};

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

const gold = "var(--gold)";
const cream = "var(--cream)";
const muted = "var(--cream-muted)";
const hair = "rgba(255,255,255,0.07)";
const radius = "var(--r-sm)";

/** Het blok dat je in een prompt plakt om in deze richting te laten ontwerpen. */
function briefBlock(d: Direction) {
  const lines = [`STIJLRICHTING: ${d.name}`, ""];
  if (d.description) lines.push(d.description, "");
  if (d.vocab.length) lines.push(`VOCABULAIRE: ${d.vocab.join(", ")}`, "");
  if (d.deployFor) lines.push(`INZETTEN VOOR: ${d.deployFor}`, "");
  if (d.risk) lines.push(`RISICO: ${d.risk}`);
  return lines.join("\n").trim();
}

export default function InspirationLibrary({
  token,
  workerUrl,
}: {
  token: string;
  workerUrl: string;
}) {
  const [items, setItems] = useState<InspItem[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ name: string; done: boolean; error?: string }[]>([]);
  const [uploadClient, setUploadClient] = useState("");
  const [query, setQuery] = useState("");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // "all" | "todo" | directionId
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
        setDirections(Array.isArray(data.directions) ? data.directions : []);
      }
    } finally {
      setLoading(false);
    }
  }, [token, workerUrl]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const persist = useCallback(
    async (nextItems: InspItem[], nextDirections: Direction[]) => {
      setSaving(true);
      try {
        await fetch(`${workerUrl}/library`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ items: nextItems, directions: nextDirections }),
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
            id: newId("insp"),
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
      persist(next, directions);
      setTimeout(() => setProgress([]), 2500);
    },
    [items, directions, token, workerUrl, uploadClient, persist]
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

  function updateDirection(id: string, patch: Partial<Direction>) {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    setDirty(true);
  }

  function addDirection() {
    const d: Direction = {
      id: newId("dir"),
      name: "Nieuwe richting",
      description: "",
      deployFor: "",
      risk: "",
      vocab: [],
    };
    const next = [...directions, d];
    setDirections(next);
    setFilter(d.id);
    setDirty(true);
  }

  function deleteDirection(id: string) {
    const count = items.filter((it) => it.directionId === id).length;
    if (!confirm(count ? `Verwijder deze richting? De ${count} beeld(en) blijven bestaan maar worden losgekoppeld.` : "Verwijder deze richting?")) return;
    const nextDirs = directions.filter((d) => d.id !== id);
    const nextItems = items.map((it) => (it.directionId === id ? { ...it, directionId: "" } : it));
    setDirections(nextDirs);
    setItems(nextItems);
    setFilter("all");
    persist(nextItems, nextDirs);
  }

  async function deleteItem(item: InspItem) {
    if (!confirm(`Verwijder dit inspiratiebeeld?`)) return;
    await fetch(`${workerUrl}/delete?key=${encodeURIComponent(item.key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const next = items.filter((it) => it.id !== item.id);
    setItems(next);
    persist(next, directions);
  }

  const allColors = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.colors?.forEach((c) => set.add(c.toLowerCase())));
    return [...set];
  }, [items]);

  const todoCount = items.filter((it) => !it.analyzed).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (filter === "todo" && it.analyzed) return false;
      if (filter !== "all" && filter !== "todo" && it.directionId !== filter) return false;
      if (activeColor && !it.colors?.some((c) => c.toLowerCase() === activeColor)) return false;
      if (q) {
        const hay = [it.client, it.style, it.typography, it.layout, it.mood, it.useCase, it.notes, ...(it.tags || [])]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, activeColor, filter]);

  const activeDirection = directions.find((d) => d.id === filter) || null;

  return (
    <div style={{ maxWidth: "1200px" }}>
      {/* Kop */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "serif", fontSize: "1.4rem", fontWeight: 400, color: cream }}>Inspiratie-library</h2>
          <p style={{ fontSize: "0.75rem", color: muted, marginTop: "0.25rem" }}>
            {items.length} {items.length === 1 ? "beeld" : "beelden"} · {directions.length}{" "}
            {directions.length === 1 ? "stijlrichting" : "stijlrichtingen"}
            {todoCount > 0 && ` · ${todoCount} nog te analyseren`}
          </p>
        </div>
        <button
          onClick={() => persist(items, directions)}
          disabled={!dirty || saving}
          style={{ padding: "0.6rem 1.4rem", backgroundColor: dirty ? gold : "rgba(201,151,74,0.2)", border: "none", borderRadius: radius, color: dirty ? "var(--black)" : muted, fontSize: "0.85rem", fontWeight: 600, cursor: dirty ? "pointer" : "default" }}
        >
          {saving ? "Opslaan..." : dirty ? "Wijzigingen opslaan" : "Opgeslagen"}
        </button>
      </div>

      {/* Upload */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          value={uploadClient}
          onChange={(e) => setUploadClient(e.target.value)}
          placeholder="Klant / project (optioneel)"
          style={{ flex: "0 0 240px", padding: "0.7rem 0.9rem", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius, color: cream, fontSize: "0.85rem", outline: "none" }}
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{ flex: 1, minWidth: "260px", border: `1px dashed ${dragging ? gold : "rgba(201,151,74,0.3)"}`, borderRadius: radius, padding: "1.1rem", textAlign: "center", cursor: "pointer", backgroundColor: dragging ? "rgba(201,151,74,0.04)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <span style={{ color: muted, fontSize: "0.85rem" }}>
            {uploading ? "Uploaden..." : "Sleep screenshots / Pinterest-beelden hier of klik"}
          </span>
          <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }} />
        </div>
      </div>

      {progress.length > 0 && (
        <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {progress.map((p, i) => (
            <div key={i} style={{ fontSize: "0.8rem", color: p.error ? "#ef4444" : p.done ? "#4ade80" : muted }}>
              {p.error ? "✗" : p.done ? "✓" : "…"} {p.name}
            </div>
          ))}
        </div>
      )}

      {/* Stijlrichtingen — de primaire navigatie */}
      <div style={{ borderTop: `1px solid rgba(201,151,74,0.25)`, paddingTop: "1.25rem", marginBottom: "1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Chip label="Alles" count={items.length} active={filter === "all"} onClick={() => setFilter("all")} />
        {directions.map((d) => (
          <Chip
            key={d.id}
            label={d.name}
            count={items.filter((it) => it.directionId === d.id).length}
            active={filter === d.id}
            onClick={() => setFilter(d.id)}
          />
        ))}
        {todoCount > 0 && (
          <Chip label="Nog te analyseren" count={todoCount} active={filter === "todo"} onClick={() => setFilter("todo")} />
        )}
        <button
          onClick={addDirection}
          style={{ padding: "0.5rem 0.9rem", backgroundColor: "transparent", border: `1px dashed rgba(201,151,74,0.35)`, borderRadius: radius, color: gold, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Nieuwe richting
        </button>
      </div>

      {/* Richtingspaneel */}
      {activeDirection && (
        <DirectionPanel
          direction={activeDirection}
          onChange={(patch) => updateDirection(activeDirection.id, patch)}
          onDelete={() => deleteDirection(activeDirection.id)}
        />
      )}

      {/* Secundaire filters */}
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.25rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek op stijl, mood, klant, tag..."
          style={{ flex: 1, minWidth: "220px", padding: "0.6rem 0.9rem", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius, color: cream, fontSize: "0.85rem", outline: "none" }}
        />
        {allColors.length > 0 && (
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
            {allColors.map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(activeColor === c ? null : c)}
                title={c}
                style={{ width: "20px", height: "20px", borderRadius: radius, backgroundColor: c, cursor: "pointer", border: activeColor === c ? `2px solid ${gold}` : "1px solid rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
        )}
        {(query || activeColor) && (
          <button onClick={() => { setQuery(""); setActiveColor(null); }} style={{ fontSize: "0.75rem", color: gold, background: "none", border: "none", cursor: "pointer" }}>
            Wis filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: muted, fontSize: "0.85rem" }}>Laden...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: muted, fontSize: "0.85rem" }}>
          {items.length === 0 ? "Nog geen inspiratie. Upload je eerste beelden hierboven." : "Geen beelden in deze selectie."}
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", alignItems: "start" }}>
          {filtered.map((item) => (
            <Card
              key={item.id}
              item={item}
              directions={directions}
              onChange={(patch) => updateItem(item.id, patch)}
              onDelete={() => deleteItem(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.9rem", borderRadius: radius, cursor: "pointer", border: `1px solid ${active ? gold : "rgba(255,255,255,0.12)"}`, backgroundColor: active ? gold : "transparent", color: active ? "var(--black)" : cream, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
    >
      {label}
      <span style={{ color: active ? "rgba(13,11,9,0.6)" : gold }}>{count}</span>
    </button>
  );
}

export function DirectionPanel({
  direction,
  onChange,
  onDelete,
}: {
  direction: Direction;
  onChange: (patch: Partial<Direction>) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function copy(what: "brief" | "vocab") {
    const text = what === "brief" ? briefBlock(direction) : direction.vocab.join(", ");
    navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ border: `1px solid rgba(201,151,74,0.25)`, borderRadius: radius, padding: "1.5rem", marginBottom: "1.5rem", backgroundColor: "rgba(201,151,74,0.03)" }}>
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Field label="Naam" value={direction.name} onChange={(v) => onChange({ name: v })} />
          <Field label="Omschrijving" value={direction.description} onChange={(v) => onChange({ description: v })} multiline />
          <Field label="Inzetten voor" value={direction.deployFor} onChange={(v) => onChange({ deployFor: v })} />
          <Field label="Risico — de gedurfde zet" value={direction.risk} onChange={(v) => onChange({ risk: v })} multiline />
          <Field label="Vocabulaire (komma)" value={direction.vocab.join(", ")} onChange={(v) => onChange({ vocab: splitList(v) })} multiline />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "2rem", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "serif", fontSize: "1.75rem", fontWeight: 400, color: cream, lineHeight: 1.1 }}>{direction.name}</h3>
            {direction.risk && (
              <p style={{ flex: "1 1 320px", maxWidth: "560px", fontSize: "0.75rem", color: muted, lineHeight: 1.6, textAlign: "right" }}>
                <span style={{ color: gold, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: "0.5rem" }}>Risico</span>
                {direction.risk}
              </p>
            )}
          </div>

          {direction.description && (
            <p style={{ fontSize: "0.95rem", color: cream, lineHeight: 1.65, maxWidth: "70ch", marginBottom: "0.75rem" }}>{direction.description}</p>
          )}

          {direction.deployFor && (
            <p style={{ fontSize: "0.85rem", color: muted, marginBottom: "1rem" }}>
              <span style={{ color: gold, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: "0.6rem" }}>Inzetten voor</span>
              {direction.deployFor}
            </p>
          )}

          {direction.vocab.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {direction.vocab.map((v, i) => (
                <span key={i} style={{ fontSize: "0.78rem", padding: "0.4rem 0.7rem", borderRadius: radius, backgroundColor: "rgba(241,237,230,0.06)", border: `1px solid ${hair}`, color: cream }}>
                  {v}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.25rem", borderTop: `1px solid ${hair}`, paddingTop: "1.25rem" }}>
        <button
          onClick={() => copy("brief")}
          style={{ padding: "0.65rem 1.2rem", backgroundColor: gold, border: "none", borderRadius: radius, color: "var(--black)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {copied === "brief" ? "Gekopieerd" : "Kopieer briefing"}
        </button>
        <button
          onClick={() => copy("vocab")}
          style={{ padding: "0.65rem 1.2rem", backgroundColor: "transparent", border: `1px solid rgba(255,255,255,0.15)`, borderRadius: radius, color: cream, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {copied === "vocab" ? "Gekopieerd" : "Kopieer vocabulaire"}
        </button>
        <button
          onClick={() => setEditing((e) => !e)}
          style={{ padding: "0.65rem 1.2rem", backgroundColor: "transparent", border: `1px solid ${hair}`, borderRadius: radius, color: muted, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
        >
          {editing ? "Klaar" : "Bewerken"}
        </button>
        <button
          onClick={onDelete}
          style={{ marginLeft: "auto", padding: "0.65rem 1rem", backgroundColor: "transparent", border: "none", color: muted, fontSize: "0.72rem", cursor: "pointer" }}
        >
          Richting verwijderen
        </button>
      </div>
    </div>
  );
}

function Card({
  item,
  directions,
  onChange,
  onDelete,
}: {
  item: InspItem;
  directions: Direction[];
  onChange: (patch: Partial<InspItem>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const direction = directions.find((d) => d.id === item.directionId);

  return (
    <div style={{ backgroundColor: "#111", borderRadius: radius, overflow: "hidden", border: `1px solid ${item.analyzed ? "rgba(201,151,74,0.2)" : "rgba(255,255,255,0.07)"}` }}>
      <div style={{ position: "relative" }}>
        {/* Volledige pagina-screenshots zijn extreem hoog. Ongelimiteerd worden
            kaarten dan honderden pixels lang en verdwijnt het overzicht, dus
            toon een bovenkant-uitsnede; klikken opent het beeld op ware grootte. */}
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.style || "inspiratie"}
            style={{ width: "100%", height: "260px", objectFit: "cover", objectPosition: "top", display: "block", cursor: "zoom-in" }}
          />
        </a>
        {!item.analyzed && (
          <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", fontSize: "0.62rem", padding: "0.2rem 0.5rem", borderRadius: radius, backgroundColor: "rgba(13,11,9,0.85)", color: gold, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Nog te analyseren
          </span>
        )}
        {item.client && (
          <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", fontSize: "0.62rem", padding: "0.2rem 0.5rem", borderRadius: radius, backgroundColor: "rgba(13,11,9,0.85)", color: cream }}>
            {item.client}
          </span>
        )}
      </div>

      <div style={{ padding: "0.75rem" }}>
        {direction && (
          <p style={{ fontSize: "0.65rem", color: gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{direction.name}</p>
        )}

        {item.colors?.length > 0 && (
          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
            {item.colors.map((c, i) => (
              <span key={i} title={c} style={{ width: "18px", height: "18px", borderRadius: radius, backgroundColor: c, border: "1px solid rgba(255,255,255,0.15)" }} />
            ))}
          </div>
        )}

        {item.style && <p style={{ fontSize: "0.85rem", color: cream, marginBottom: "0.25rem" }}>{item.style}</p>}
        {item.mood && <p style={{ fontSize: "0.72rem", color: muted, marginBottom: "0.5rem" }}>{item.mood}</p>}

        {item.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            {item.tags.map((t, i) => (
              <span key={i} style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", borderRadius: radius, backgroundColor: "rgba(201,151,74,0.1)", color: gold }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
          <button onClick={() => setOpen((o) => !o)} style={{ flex: 1, fontSize: "0.7rem", padding: "0.35rem", backgroundColor: "rgba(201,151,74,0.12)", border: "1px solid rgba(201,151,74,0.2)", borderRadius: radius, color: gold, cursor: "pointer" }}>
            {open ? "Sluiten" : "Bewerken"}
          </button>
          <button onClick={onDelete} style={{ fontSize: "0.7rem", padding: "0.35rem 0.6rem", backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: radius, color: muted, cursor: "pointer" }}>✕</button>
        </div>

        {open && (
          <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: `1px solid ${hair}`, paddingTop: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.62rem", color: muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Stijlrichting</label>
              <select
                value={item.directionId}
                onChange={(e) => onChange({ directionId: e.target.value })}
                style={{ width: "100%", padding: "0.5rem 0.6rem", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius, color: cream, fontSize: "0.78rem", outline: "none", fontFamily: "inherit" }}
              >
                <option value="">— niet toegewezen —</option>
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
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
    borderRadius: radius,
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
