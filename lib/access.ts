/**
 * Temporary access codes for the gated site.
 *
 * A code is self-contained and signed, so there is no store to keep in sync:
 *   <name>-<expiry, unix seconds in base36>-<HMAC-SHA256, 16 base64url chars>
 * The proxy checks the signature and the expiry on every request. Rotating
 * ACCESS_SECRET in Vercel revokes every code that was ever handed out.
 */

export const ACCESS_COOKIE = "sv_access";

const enc = new TextEncoder();

async function hmac(payload: string): Promise<string> {
  const secret = process.env.ACCESS_SECRET;
  if (!secret) throw new Error("ACCESS_SECRET ontbreekt");
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
  return btoa(String.fromCharCode(...sig))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    .slice(0, 16);
}

export function slugName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "").slice(0, 20) || "gast";
}

export async function createCode(name: string, expiresAt: Date): Promise<string> {
  const payload = `${slugName(name)}-${Math.floor(expiresAt.getTime() / 1000).toString(36)}`;
  return `${payload}-${await hmac(payload)}`;
}

/** Returns the code's expiry when it is valid and not yet expired, otherwise null. */
export async function verifyCode(code: string | undefined | null): Promise<Date | null> {
  if (!code) return null;
  const m = /^([a-z0-9]+-([a-z0-9]+))-([A-Za-z0-9_-]{16})$/.exec(code.trim());
  if (!m) return null;
  const [, payload, exp36, sig] = m;
  let expected: string;
  try { expected = await hmac(payload); } catch { return null; }
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  const expiresAt = new Date(parseInt(exp36, 36) * 1000);
  return expiresAt.getTime() > Date.now() ? expiresAt : null;
}
