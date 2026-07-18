"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface WebProject {
  title: string;
  subtitle: string;
  tags: string[];
  accent: string;
  href?: string;
  features: string[];
}

const PROJECTS: WebProject[] = [
  {
    title: "SOM Vastgoed",
    subtitle: "Website & CMS op maat",
    tags: ["Next.js", "CMS", "Zabun API"],
    accent: "#B8843A",
    href: "/demo/som-vastgoed",
    features: ["Live panden via API", "Eigen CMS panel", "SEO geoptimaliseerd"],
  },
  {
    title: "SteylVisuals.be",
    subtitle: "Portfolio & Admin panel",
    tags: ["Next.js", "Cloudflare R2", "Workers"],
    accent: "#9E7FBF",
    features: ["Media upload via admin", "Content bewerken zonder code", "Automatisch deploys via Git"],
  },
];

function WebCard({ project, index }: { project: WebProject; index: number }) {
  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      className="group flex flex-col"
      style={{
        borderRadius: "20px",
        border: `1px solid rgba(${project.accent === "#B8843A" ? "184,132,58" : "158,127,191"},0.18)`,
        backgroundColor: "rgba(253,250,247,0.03)",
        overflow: "hidden",
        cursor: project.href ? "pointer" : "default",
      }}
    >
      {/* Top accent strip */}
      <div style={{ height: "3px", backgroundColor: project.accent, opacity: 0.85 }} />

      {/* Card body */}
      <div style={{ padding: "2rem 2rem 1.75rem" }}>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.6rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: project.accent,
                backgroundColor: "rgba(253,250,247,0.05)",
                border: `1px solid ${project.accent}30`,
                borderRadius: "100px",
                padding: "0.28rem 0.65rem",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(1.6rem,2.5vw,2.2rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            color: "#FDFAF7",
            marginBottom: "0.4rem",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "0.78rem",
            color: "rgba(253,250,247,0.42)",
            marginBottom: "1.75rem",
          }}
        >
          {project.subtitle}
        </p>

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5">
          {project.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "0.82rem",
                color: "rgba(253,250,247,0.65)",
              }}
            >
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: project.accent }}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        {project.href && (
          <div
            className="mt-6 flex items-center gap-2"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: project.accent,
            }}
          >
            Bekijk demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.article>
  );

  if (project.href) {
    return <a href={project.href} style={{ textDecoration: "none" }}>{inner}</a>;
  }
  return inner;
}

export default function WebsitePortfolio() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto">
      {PROJECTS.map((p, i) => (
        <WebCard key={p.title} project={p} index={i} />
      ))}
    </div>
  );
}
