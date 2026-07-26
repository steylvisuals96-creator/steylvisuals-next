"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { R2, type PortfolioCase } from "@/lib/cases";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * One case on the portfolio index: a single image that leads to the full page.
 * The whole card is the link, so there is one target rather than a separate
 * "read more" to aim at.
 */
export default function CaseCard({ item, index = 0 }: { item: PortfolioCase; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
    >
      <Link href={`/portfolio/${item.slug}`} className="case-card">
        <span className="case-card-frame">
          <Image
            src={`${R2}/${item.coverKey}`}
            alt=""
            width={1920}
            height={1080}
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="case-card-img"
          />
        </span>

        <span className="case-card-meta">
          <span className="case-card-eyebrow">{item.eyebrow}</span>
          <span className="case-card-title">
            {item.title}
            {item.titleEm && <em> {item.titleEm}</em>}
          </span>
          <span className="case-card-detail">
            {item.discipline} · {item.year}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
