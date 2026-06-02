import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

export const metadata = {
  title: "Portfolio — SteylVisuals",
  description: "Bekijk alle vastgoedvideo's van SteylVisuals. Cinematic Reels en TikToks voor makelaars wereldwijd.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio — SteylVisuals",
    description: "Cinematic vastgoedvideo's voor makelaars wereldwijd.",
    url: "https://steylvisualsnext.netlify.app/portfolio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Portfolio — SteylVisuals",
    images: ["/og-image.jpg"],
  },
};

export interface Project {
  slug: string;
  title: string;
  location: string;
  serviceType: string;
  year: string;
  coverImage?: string;
  videoUrl?: string;
  description?: string;
  featured: boolean;
  gallery: string[];
}

function getProjects(): Project[] {
  const dir = path.join(process.cwd(), "content/projects");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        slug: file.replace(".md", ""),
        title: data.title ?? "",
        location: data.location ?? "",
        serviceType: data.serviceType ?? "",
        year: data.year ?? "",
        coverImage: data.coverImage ?? null,
        videoUrl: data.videoUrl ?? null,
        description: data.description ?? "",
        featured: data.featured ?? false,
        gallery: data.gallery ?? [],
      } as Project;
    })
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
}

export default function PortfolioPage() {
  const projects = getProjects();

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section style={{ backgroundColor: "var(--dark)", padding: "clamp(6rem,12vh,10rem) clamp(1.5rem,6vw,5rem) clamp(4rem,8vh,6rem)" }}>
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "var(--gold)" }}>
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
            Portfolio
            <span className="w-4 h-px" style={{ backgroundColor: "var(--gold)" }} />
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--beige)", maxWidth: "700px" }}>
            Elk pand,<br /><em style={{ color: "rgba(242,237,232,0.45)" }}>een verhaal</em>
          </h1>
          <p className="text-sm font-light leading-relaxed mt-6" style={{ color: "rgba(242,237,232,0.45)", maxWidth: "400px" }}>
            {projects.length} projecten — vastgoed marketing voor makelaars.
          </p>
        </section>

        <PortfolioGrid projects={projects} />
      </main>
      <Footer />
    </>
  );
}
