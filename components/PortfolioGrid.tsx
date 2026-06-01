"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/app/portfolio/page";

const SERVICE_COLORS: Record<string, string> = {
  "Groei": "var(--gold)",
  "Starter": "var(--muted)",
  "Edit Only": "var(--muted)",
  "Drone shoot": "var(--gold)",
};

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(28,14,7,0.92)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-sm font-light"
          style={{ color: "rgba(242,237,232,0.6)" }}
        >
          Sluiten ✕
        </button>
        <div style={{ aspectRatio: "16/9", borderRadius: "16px", overflow: "hidden" }}>
          <iframe
            src={url}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, i }: { project: Project; i: number }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
        className="group relative overflow-hidden flex flex-col"
        style={{ borderRadius: "20px", backgroundColor: "var(--beige)", border: "1px solid var(--beige-mid)" }}
      >
        {/* Media */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "16/10", backgroundColor: "var(--dark)" }}
        >
          {project.coverImage ? (
            <motion.img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ filter: "sepia(0.05) contrast(1.03)" }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: "radial-gradient(ellipse at center, #2E1609, #1C0E07)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,232,0.15)" strokeWidth="1">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="m10 8 6 4-6 4V8z" fill="rgba(242,237,232,0.15)" stroke="none"/>
              </svg>
            </div>
          )}

          {/* Play button overlay if video */}
          {project.videoUrl && (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: "rgba(28,14,7,0.4)" }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--gold)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--dark)">
                  <path d="m5 3 14 9-14 9V3z"/>
                </svg>
              </div>
            </button>
          )}

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--gold)", color: "var(--dark)" }}>
              Uitgelicht
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium tracking-wide uppercase" style={{ color: SERVICE_COLORS[project.serviceType] ?? "var(--muted)" }}>
              {project.serviceType}
            </span>
            <span className="text-xs font-light" style={{ color: "var(--beige-deep)" }}>{project.year}</span>
          </div>
          <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, lineHeight: 1.2, color: "var(--dark)" }}>
            {project.title}
          </h3>
          <p className="text-xs font-light flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="var(--muted)">
              <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.5C4.17 6.5 3.5 5.83 3.5 5S4.17 3.5 5 3.5 6.5 4.17 6.5 5 5.83 6.5 5 6.5z"/>
            </svg>
            {project.location}
          </p>
          {project.description && (
            <p className="text-sm font-light leading-relaxed mt-1" style={{ color: "var(--muted)" }}>
              {project.description}
            </p>
          )}
        </div>
      </motion.article>

      {showVideo && project.videoUrl && (
        <VideoModal url={project.videoUrl} onClose={() => setShowVideo(false)} />
      )}
    </>
  );
}

const FILTERS = ["Alles", "Groei", "Starter", "Edit Only", "Drone shoot"];

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("Alles");

  const filtered = active === "Alles" ? projects : projects.filter((p) => p.serviceType === active);

  return (
    <section style={{ backgroundColor: "var(--off-white)", padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {FILTERS.map((f) => (
          <motion.button
            key={f}
            onClick={() => setActive(f)}
            className="text-xs font-medium tracking-wide px-4 py-2 rounded-full"
            animate={{
              backgroundColor: active === f ? "var(--dark)" : "var(--beige-mid)",
              color: active === f ? "var(--beige)" : "var(--muted)",
            }}
            whileHover={{ opacity: 0.85 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm font-light" style={{ color: "var(--muted)" }}>Geen projecten gevonden.</p>
      ) : (
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} i={i} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-16 pt-12" style={{ borderTop: "1px solid var(--beige-mid)" }}>
        <p className="text-sm font-light mb-5" style={{ color: "var(--muted)" }}>
          Wil jij ook zo&apos;n video voor jouw pand?
        </p>
        <motion.a
          href="mailto:Steylvisuals96@gmail.com?subject=Gratis%20demo-edit%20aanvraag"
          className="inline-block text-sm font-medium rounded-full px-8 py-3.5"
          style={{ backgroundColor: "var(--dark)", color: "var(--beige)" }}
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.97 }}
        >
          Gratis demo-edit aanvragen
        </motion.a>
      </div>
    </section>
  );
}
