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
    accent: "#C9974A",
    href: "/demo/som-vastgoed",
    features: ["Live panden via API", "Eigen CMS panel", "SEO geoptimaliseerd"],
  },
  {
    title: "Specified",
    subtitle: "Website & CMS — Engineering Recruitment",
    tags: ["Next.js", "CMS", "Recruitment"],
    accent: "#d4f132",
    href: "https://specified-website.vercel.app/",
    features: ["Vacatures via CMS beheren", "Sector-specifieke landingspagina's", "Volledig op maat ontworpen"],
  },
  {
    title: "Specified CMS",
    subtitle: "Custom content management systeem",
    tags: ["Next.js", "Admin", "Op maat"],
    accent: "#7ec8c8",
    href: "https://specified-cms.vercel.app/",
    features: ["Vacatures aanmaken & bewerken", "Geen technische kennis vereist", "Live preview bij elke wijziging"],
  },
  {
    title: "SteylVisuals.be",
    subtitle: "Portfolio & Admin panel",
    tags: ["Next.js", "Cloudflare R2", "Workers"],
    accent: "#C9974A",
    features: ["Media upload via admin", "Content bewerken zonder code", "Automatisch deploys via Git"],
  },
  {
    title: "Worldflight",
    subtitle: "One studio, one flight — full service pitch",
    tags: ["Next.js", "AI", "Automation", "Video"],
    accent: "#C4B89A",
    href: "https://steylvisuals-worldflight.vercel.app/",
    features: [
      "Websites, AI & video in één verhaal",
      "Automatische lead-pipeline op Claude",
      "La Martine, SOM & Specified als live cases",
    ],
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
        borderRadius: "var(--r-md)",
        border: `1px solid ${project.accent}30`,
        backgroundColor: "rgba(241,237,230,0.03)",
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
                fontFamily: "var(--font-poppins)",
                fontSize: "0.6rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: project.accent,
                backgroundColor: "rgba(241,237,230,0.05)",
                border: `1px solid ${project.accent}30`,
                borderRadius: "var(--r-sm)",
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
            fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            color: "var(--cream)",
            marginBottom: "0.4rem",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.78rem",
            color: "var(--cream-muted)",
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
                fontFamily: "var(--font-poppins)",
                fontSize: "0.82rem",
                color: "rgba(241,237,230,0.65)",
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
              fontFamily: "var(--font-poppins)",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: project.accent,
            }}
          >
            Bekijk demo
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
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-[1100px] mx-auto">
      {PROJECTS.map((p, i) => (
        <WebCard key={p.title} project={p} index={i} />
      ))}
    </div>
  );
}
