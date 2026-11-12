const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const R2_PUBLIC = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev";

// Only these folders can be listed, uploaded to or deleted from. content.json and
// library.json live in the bucket root and can only change through their own routes.
const FOLDERS = ["images", "videos/web", "logo", "inspiration"];

const MB = 1024 * 1024;
// Content type comes from the extension, never from the client, so nobody can store
// HTML or SVG that a browser would run from the public r2.dev address.
const TYPES = {
  jpg: { type: "image/jpeg", max: 25 * MB },
  jpeg: { type: "image/jpeg", max: 25 * MB },
  png: { type: "image/png", max: 25 * MB },
  webp: { type: "image/webp", max: 25 * MB },
  avif: { type: "image/avif", max: 25 * MB },
  gif: { type: "image/gif", max: 25 * MB },
  mp4: { type: "video/mp4", max: 100 * MB, video: true },
  webm: { type: "video/webm", max: 100 * MB, video: true },
  mov: { type: "video/quicktime", max: 100 * MB, video: true },
};
const MAX_JSON = { "content.json": 256 * 1024, "library.json": 4 * MB };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

const bad = (error) => json({ error }, 400);

function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

const enc = new TextEncoder();

// Compare via SHA-256 digests of equal length, so the time taken does not reveal
// how much of a guess was right.
async function sameToken(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  return crypto.subtle.timingSafeEqual(x, y);
}

// UPLOAD_TOKENS is a comma-separated list so multiple people can each have
// their own access code — one person's code can be revoked (just remove it
// from the list) without changing everyone else's. UPLOAD_TOKEN (singular)
// still works on its own for backward compatibility.
function configuredTokens(env) {
  const tokens = (env.UPLOAD_TOKENS || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (env.UPLOAD_TOKEN?.trim()) tokens.push(env.UPLOAD_TOKEN.trim());
  return tokens;
}

async function hmacHex(key, text) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// A short-lived upload key: "kort.<expiry ms>.<HMAC of 'upload.<expiry>' with a full token>".
// The Studio server makes these, so the browser never sees a full token. They only work for
// POST /upload and for at most 15 minutes.
const KORT_MAX_MS = 15 * 60 * 1000;
async function shortKeyValid(presented, tokens) {
  const m = /^kort\.(\d{13})\.([0-9a-f]{64})$/.exec(presented);
  if (!m) return false;
  const exp = Number(m[1]);
  if (exp < Date.now() || exp > Date.now() + KORT_MAX_MS) return false;
  let ok = false;
  for (const t of tokens) if (await sameToken(m[2], await hmacHex(t, `upload.${exp}`))) ok = true;
  return ok;
}

/** "vol" for a full token, "kort" for a short-lived upload key, or null. */
async function checkAuth(request, env) {
  const match = /^Bearer (\S+)$/.exec(request.headers.get("Authorization") || "");
  if (!match) return null;
  const presented = match[1];
  const tokens = configuredTokens(env);

  let ok = false;
  for (const t of tokens) if (await sameToken(presented, t)) ok = true;
  if (ok) return "vol";
  return (await shortKeyValid(presented, tokens)) ? "kort" : null;
}

function folderFrom(value) {
  const folder = String(value ?? "").replace(/^\/+|\/+$/g, "");
  return FOLDERS.includes(folder) ? folder : null;
}

/** A key may only point at a file directly inside one of the allowed folders. */
function keyAllowed(key) {
  if (!key || key.includes("..") || key.includes("\\")) return false;
  const slash = key.lastIndexOf("/");
  return slash > 0 && FOLDERS.includes(key.slice(0, slash)) && key.length - slash > 1;
}

async function readJsonBody(request, name) {
  const length = Number(request.headers.get("Content-Length") || 0);
  if (length > MAX_JSON[name]) return { error: "Te groot" };
  const body = await request.text();
  if (body.length > MAX_JSON[name]) return { error: "Te groot" };
  try {
    JSON.parse(body);
  } catch {
    return { error: "Geen geldige JSON" };
  }
  return { body };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const auth = await checkAuth(request, env);
    if (!auth) return unauthorized();

    const url = new URL(request.url);
    const path = url.pathname;
    if (auth === "kort" && !(request.method === "POST" && path === "/upload")) return unauthorized();

    try {
      // POST /upload — upload a file
      if (request.method === "POST" && path === "/upload") {
        let formData;
        try {
          formData = await request.formData();
        } catch {
          return bad("Geen geldig formulier");
        }
        const file = formData.get("file");
        const rawFolder = formData.get("folder");
        if (rawFolder !== null && typeof rawFolder !== "string") return bad("Ongeldige map");
        const folder = folderFrom(rawFolder ?? "images");
        if (!folder) return bad("Onbekende map");

        if (!file || typeof file === "string") return bad("No file provided");

        const ext = (file.name.split(".").pop() || "").toLowerCase();
        const soort = TYPES[ext];
        if (!soort) return bad("Dit bestandstype mag niet");
        if (folder === "inspiration" && soort.video) return bad("Alleen beelden in de inspiratiebibliotheek");
        if (file.size > soort.max) return bad(`Bestand te groot (max ${soort.max / MB} MB)`);

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "_");
        const key = `${folder}/${safeName}`;

        await env.BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: soort.type },
        });

        return json({ url: `${R2_PUBLIC}/${key}`, key });
      }

      // GET /list?folder=images — list files (all pages)
      if (request.method === "GET" && path === "/list") {
        const folder = folderFrom(url.searchParams.get("folder") || "images");
        if (!folder) return bad("Onbekende map");
        const objects = [];
        let cursor;
        do {
          const listed = await env.BUCKET.list({ prefix: `${folder}/`, cursor });
          for (const o of listed.objects) objects.push({ key: o.key, size: o.size, uploaded: o.uploaded, url: `${R2_PUBLIC}/${o.key}` });
          cursor = listed.truncated ? listed.cursor : undefined;
        } while (cursor && objects.length < 10000);
        return json({ objects });
      }

      // DELETE /delete?key=images/foo.jpg — delete a file
      if (request.method === "DELETE" && path === "/delete") {
        const key = url.searchParams.get("key");
        if (!key) return bad("key required");
        if (!keyAllowed(key)) return bad("Dit bestand mag hier niet verwijderd worden");
        await env.BUCKET.delete(key);
        return json({ deleted: key });
      }

      // GET /content — read site content
      if (request.method === "GET" && path === "/content") {
        const obj = await env.BUCKET.get("content.json");
        if (!obj) return json({});
        return new Response(await obj.text(), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }

      // PUT /content — save site content
      if (request.method === "PUT" && path === "/content") {
        const { body, error } = await readJsonBody(request, "content.json");
        if (error) return bad(error);
        await env.BUCKET.put("content.json", body, {
          httpMetadata: { contentType: "application/json" },
        });
        return json({ saved: true });
      }

      // GET /library — read the inspiration library index
      if (request.method === "GET" && path === "/library") {
        const obj = await env.BUCKET.get("library.json");
        if (!obj) return json({ items: [] });
        return new Response(await obj.text(), {
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }

      // PUT /library — save the inspiration library index
      if (request.method === "PUT" && path === "/library") {
        const { body, error } = await readJsonBody(request, "library.json");
        if (error) return bad(error);
        await env.BUCKET.put("library.json", body, {
          httpMetadata: { contentType: "application/json" },
        });
        return json({ saved: true });
      }

      return json({ error: "Not found" }, 404);
    } catch (e) {
      return json({ error: "Er ging iets mis", detail: String(e?.message || e).slice(0, 200) }, 500);
    }
  },
};
