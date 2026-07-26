import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseDetail from "@/components/CaseDetail";
import { CASES, R2, getCase } from "@/lib/cases";

/** Every case is known at build time, so each one prerenders as static HTML. */
export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return { title: "Niet gevonden — SteylVisuals" };

  const title = `${item.title}${item.titleEm ? " " + item.titleEm : ""} — SteylVisuals`;
  const image = `${R2}/${item.coverKey}`;

  return {
    title,
    description: item.intro,
    alternates: { canonical: `/portfolio/${item.slug}` },
    openGraph: {
      title,
      description: item.intro,
      url: `https://steylvisuals.be/portfolio/${item.slug}`,
      type: "article",
      images: [{ url: image, width: 1920, height: 1080 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: item.intro,
      images: [image],
    },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  return (
    <>
      <Nav />
      <main style={{ backgroundColor: "var(--black)" }}>
        <CaseDetail item={item} />
      </main>
      <Footer />
    </>
  );
}
