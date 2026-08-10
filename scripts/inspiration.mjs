#!/usr/bin/env node
/**
 * Bridge tussen de inspiratie-library en een Claude-sessie.
 *
 * De library (library.json) leeft in R2 achter de upload-worker. Dit script
 * praat met die worker zodat een Claude-sessie de nog-niet-geanalyseerde beelden
 * kan ophalen (`pull`) en de analyse kan terugschrijven (`push`).
 *
 *   node scripts/inspiration.mjs pull            → print JSON van nog te analyseren items
 *   node scripts/inspiration.mjs pull --all      → print JSON van álle items
 *   node scripts/inspiration.mjs push out.json   → merge analyses (op id) in de library
 *
 * Het upload-token wordt uit .env.local gelezen (SV_UPLOAD_TOKEN), zodat het
 * nooit in de chat of in git terechtkomt. .env.local staat in .gitignore.
 *
 * Het push-bestand is een object met `items` en/of `directions`:
 *   {
 *     "directions": [
 *       { "id": "dir_dither_mono", "name": "Dither Mono",
 *         "description": "Rauw zwart-wit met bitmap-textuur...",
 *         "deployFor": "Portfolio's, ateliers — waar soberheid als zelfvertrouwen leest.",
 *         "risk": "Dither het volledige hero-beeld naar 1-bit.",
 *         "vocab": ["bitmap dither", "stark B&W", "film grain"] }
 *     ],
 *     "items": [
 *       { "id": "insp_x", "directionId": "dir_dither_mono", "colors": ["#111"],
 *         "style": "editorial minimal", "typography": "hoog contrast serif",
 *         "layout": "asymmetrisch grid", "mood": "rustig, luxueus",
 *         "useCase": "hero", "tags": ["luxe","vastgoed"], "notes": "..." }
 *     ]
 *   }
 * Een kale array wordt nog steeds aanvaard en geldt dan als `items`.
 * Elk gepusht item krijgt automatisch analyzed:true. Richtingen worden gemerged
 * op id: bestaande worden bijgewerkt, nieuwe toegevoegd.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER_URL =
  process.env.SV_WORKER_URL ||
  "https://steylvisuals-upload.steylvisuals96.workers.dev";

function loadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* .env.local mag ontbreken als de var al in de omgeving staat */
  }
}

function token() {
  const t = process.env.SV_UPLOAD_TOKEN;
  if (!t) {
    console.error(
      "Geen SV_UPLOAD_TOKEN gevonden. Zet die in .env.local:\n" +
        "  SV_UPLOAD_TOKEN=jouw-upload-token\n"
    );
    process.exit(1);
  }
  return t;
}

async function getLibrary() {
  const res = await fetch(`${WORKER_URL}/library`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  if (!res.ok) {
    console.error(`Library ophalen mislukt (${res.status})`);
    process.exit(1);
  }
  const data = await res.json();
  return {
    items: Array.isArray(data.items) ? data.items : [],
    directions: Array.isArray(data.directions) ? data.directions : [],
  };
}

async function putLibrary(items, directions) {
  const res = await fetch(`${WORKER_URL}/library`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items, directions }),
  });
  if (!res.ok) {
    console.error(`Library opslaan mislukt (${res.status})`);
    process.exit(1);
  }
}

const ANALYSIS_FIELDS = [
  "directionId",
  "colors",
  "style",
  "typography",
  "layout",
  "mood",
  "useCase",
  "tags",
  "notes",
  "client",
];

const DIRECTION_FIELDS = ["name", "description", "deployFor", "risk", "vocab"];

async function pull(all) {
  const { items, directions } = await getLibrary();
  const todo = all ? items : items.filter((it) => !it.analyzed);
  const out = {
    // Bestaande richtingen meegeven zodat nieuwe beelden bij een bestaande
    // richting gezet kunnen worden in plaats van een duplicaat te maken.
    directions: directions.map((d) => ({ id: d.id, name: d.name, vocab: d.vocab })),
    items: todo.map((it) => ({ id: it.id, url: it.url, client: it.client })),
  };
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
  console.error(
    `\n${todo.length} van ${items.length} beeld(en) ${all ? "totaal" : "nog te analyseren"}, ` +
      `${directions.length} bestaande richting(en).`
  );
}

async function push(file) {
  if (!file) {
    console.error("Geef een JSON-bestand mee: node scripts/inspiration.mjs push out.json");
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  // Een kale array blijft toegestaan en telt als `items`.
  const analyses = Array.isArray(parsed) ? parsed : parsed.items || [];
  const newDirs = Array.isArray(parsed) ? [] : parsed.directions || [];

  const { items, directions } = await getLibrary();

  // Richtingen mergen op id: bestaande bijwerken, nieuwe toevoegen.
  const dirById = new Map(directions.map((d) => [d.id, d]));
  for (const d of newDirs) {
    if (!d.id) {
      console.error("Elke richting heeft een `id` nodig — overgeslagen.");
      continue;
    }
    const base = dirById.get(d.id) || { id: d.id, name: d.id, description: "", deployFor: "", risk: "", vocab: [] };
    const patch = {};
    for (const f of DIRECTION_FIELDS) if (d[f] !== undefined) patch[f] = d[f];
    dirById.set(d.id, { ...base, ...patch });
  }
  const nextDirs = [...dirById.values()];

  const byId = new Map(analyses.map((a) => [a.id, a]));
  let updated = 0;
  const nextItems = items.map((it) => {
    const a = byId.get(it.id);
    if (!a) return it;
    updated++;
    const patch = {};
    for (const f of ANALYSIS_FIELDS) if (a[f] !== undefined) patch[f] = a[f];
    return { ...it, ...patch, analyzed: true };
  });

  // Een verwijzing naar een niet-bestaande richting zou het beeld onzichtbaar
  // maken in de richtingen-balk, dus vang dat hier af in plaats van in de UI.
  const dirIds = new Set(nextDirs.map((d) => d.id));
  const orphans = nextItems.filter((it) => it.directionId && !dirIds.has(it.directionId));

  const missing = analyses.filter((a) => !items.some((it) => it.id === a.id));
  await putLibrary(nextItems, nextDirs);

  console.error(
    `${updated} beeld(en) bijgewerkt en gemarkeerd als geanalyseerd. ` +
      `${nextDirs.length} richting(en) in de library.`
  );
  if (orphans.length) {
    console.error(
      `Let op: ${orphans.length} beeld(en) verwijzen naar een onbekende richting: ` +
        [...new Set(orphans.map((o) => o.directionId))].join(", ")
    );
  }
  if (missing.length) {
    console.error(
      `Let op: ${missing.length} id('s) uit het bestand bestaan niet in de library: ` +
        missing.map((m) => m.id).join(", ")
    );
  }
}

async function main() {
  loadEnv();
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === "pull") return pull(arg === "--all");
  if (cmd === "push") return push(arg);
  console.error("Gebruik:\n  node scripts/inspiration.mjs pull [--all]\n  node scripts/inspiration.mjs push <bestand.json>");
  process.exit(1);
}

main();
