import { NextResponse } from "next/server";
import { createCode } from "@/lib/access";

const WORKER_URL = process.env.SV_WORKER_URL || "https://steylvisuals-upload.steylvisuals96.workers.dev";

/** Makes a new access code. Only for whoever holds the /admin token. */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  // The upload worker is the source of truth for the admin token, same check as the /admin login.
  const check = await fetch(`${WORKER_URL}/list?folder=images`, { headers: { Authorization: auth } });
  if (!check.ok) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { name, days } = (await request.json().catch(() => ({}))) as { name?: string; days?: number };
  const d = Math.min(Math.max(Number(days) || 7, 1), 90);
  const expiresAt = new Date(Date.now() + d * 86_400_000);
  const code = await createCode(name || "gast", expiresAt);
  const link = `${new URL(request.url).origin}/?code=${code}`;
  return NextResponse.json({ code, link, expiresAt: expiresAt.toISOString() });
}
