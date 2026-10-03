import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, verifyCode } from "@/lib/access";

/**
 * The whole site sits behind a temporary access code (see lib/access.ts).
 * Left open: the code page and its API, and /admin, which has its own login
 * and is where new codes are made.
 */
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // A shared link like steylvisuals.be/?code=... logs the visitor in directly.
  const linkCode = searchParams.get("code");
  if (linkCode) {
    const expiresAt = await verifyCode(linkCode);
    if (expiresAt) {
      const clean = request.nextUrl.clone();
      clean.searchParams.delete("code");
      const res = NextResponse.redirect(clean);
      res.cookies.set(ACCESS_COOKIE, linkCode.trim(), {
        httpOnly: true, secure: true, sameSite: "lax", path: "/", expires: expiresAt,
      });
      return res;
    }
  }

  if (await verifyCode(request.cookies.get(ACCESS_COOKIE)?.value)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 401 });
  }

  const login = new URL("/toegang", request.url);
  if (pathname !== "/") login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/((?!toegang|api/toegang|admin|_next/static|_next/image|favicon.ico|apple-icon.png|og-image.jpg|robots.txt).*)",
  ],
};
