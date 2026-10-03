import { NextResponse } from "next/server";
import { ACCESS_COOKIE, verifyCode } from "@/lib/access";

export async function POST(request: Request) {
  const { code } = (await request.json().catch(() => ({}))) as { code?: string };
  const expiresAt = await verifyCode(code);
  if (!expiresAt || !code) {
    return NextResponse.json({ error: "Deze code is ongeldig of verlopen." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, code.trim(), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: expiresAt,
  });
  return res;
}
