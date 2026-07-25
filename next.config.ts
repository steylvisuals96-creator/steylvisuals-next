import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimisation used to be off (`unoptimized: true`), which is why a 9.4MB
    // camera JPEG was shipped whole into a ~540px slot. With it on, Vercel
    // resizes and re-encodes at the edge and caches the result, so photos can
    // live in R2 — and stay replaceable from /admin — without costing their
    // original weight.
    //
    // Photos only. Video is never touched by the image optimiser, so the reels
    // stay as pre-encoded files in public/videos/web/.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-28e65866cf1641928966914639cc84ef.r2.dev",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // R2 objects are replaced in place by the admin uploader, so don't hold a
    // stale derivative for the default 60s only — but don't cache forever either.
    minimumCacheTTL: 3600,
  },
};

export default nextConfig;
