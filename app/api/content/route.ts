import { NextResponse } from "next/server";

const R2_CONTENT = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev/content.json";

/**
 * Same-origin proxy for the CMS content blob.
 *
 * The client used to fetch R2 directly, but the bucket sends no
 * Access-Control-Allow-Origin for steylvisuals.be, so every request was blocked
 * by CORS — the site silently ran on DEFAULT_CONTENT and logged a console error
 * on every page load. Server-to-server has no CORS, so this restores the CMS.
 */
export const revalidate = 300;

export async function GET() {
  try {
    const r = await fetch(R2_CONTENT, { next: { revalidate: 300 } });
    if (!r.ok) return NextResponse.json({}, { status: 200 });
    const data = await r.json();
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch {
    // An empty object makes the client keep its defaults without erroring.
    return NextResponse.json({}, { status: 200 });
  }
}
