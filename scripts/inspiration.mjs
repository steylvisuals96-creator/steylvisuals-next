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
 * Formaat van het push-bestand: een JSON-array van objecten met minstens `id`
 * en de analysevelden, bv:
 *   [{ "id": "insp_x", "colors": ["#111"], "style": "editorial minimal",
 *      "typography": "hoog contrast serif + grotesk", "layout": "asymmetrisch grid",
 *      "mood": "rustig, luxueus", "useCase": "hero", "tags": ["luxe","vastgoed"],
 *      "notes": "..." }]
 * Elk gepusht item krijgt automatisch analyzed:true.
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
  return Array.isArray(data.items) ? data.items : [];
}

async function putLibrary(items) {
  const res = await fetch(`${WORKER_URL}/library`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) {
    console.error(`Library opslaan mislukt (${res.status})`);
    process.exit(1);
  }
}

const ANALYSIS_FIELDS = [
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

async function pull(all) {
  const items = await getLibrary();
  const todo = all ? items : items.filter((it) => !it.analyzed);
  const out = todo.map((it) => ({ id: it.id, url: it.url, client: it.client }));
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
  console.error(
    `\n${todo.length} van ${items.length} item(s) ${all ? "totaal" : "nog te analyseren"}.`
  );
}

async function push(file) {
  if (!file) {
    console.error("Geef een JSON-bestand mee: node scripts/inspiration.mjs push out.json");
    process.exit(1);
  }
  const analyses = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(analyses)) {
    console.error("Het push-bestand moet een JSON-array zijn.");
    process.exit(1);
  }
  const byId = new Map(analyses.map((a) => [a.id, a]));
  const items = await getLibrary();
  let updated = 0;
  const next = items.map((it) => {
    const a = byId.get(it.id);
    if (!a) return it;
    updated++;
    const patch = {};
    for (const f of ANALYSIS_FIELDS) {
      if (a[f] !== undefined) patch[f] = a[f];
    }
    return { ...it, ...patch, analyzed: true };
  });
  const missing = analyses.filter((a) => !items.some((it) => it.id === a.id));
  await putLibrary(next);
  console.error(`${updated} item(s) bijgewerkt en gemarkeerd als geanalyseerd.`);
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
