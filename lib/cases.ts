/**
 * Portfolio cases.
 *
 * Everything a case page needs lives here — adding one means adding an entry,
 * not writing a page. `app/portfolio/[slug]` renders any of them through the
 * same template, so every case looks and behaves identically.
 *
 * Media keys are paths inside the R2 bucket. Photos go through next/image, so
 * they can be uploaded at full resolution; video has to be web-encoded before
 * upload because the image optimiser does not touch it.
 */

export const R2 = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev";

export type CasePhoto = {
  key: string;
  w: number;
  h: number;
  /** Landscape frames span two columns in the gallery. */
  wide: boolean;
};

export type CaseFilm = {
  key: string;
  posterKey: string;
  /** Shown on the play control, e.g. "1:55". */
  duration: string;
};

export type PortfolioCase = {
  slug: string;
  /** Kicker above the title, e.g. "La Martine · Wijndomein". */
  eyebrow: string;
  title: string;
  /** Second line of the title, set in italic. */
  titleEm?: string;
  intro: string;
  /** Card image on the portfolio index. */
  coverKey: string;
  /** Short label on the card, e.g. "Film & fotografie". */
  discipline: string;
  year: string;
  film?: CaseFilm;
  photos: CasePhoto[];
};

export const CASES: PortfolioCase[] = [
  {
    slug: "la-martine",
    eyebrow: "La Martine · Wijndomein",
    title: "Een culinaire avond",
    titleEm: "tussen de wijnranken",
    intro:
      "Film en fotografie voor het culinair weekend van wijndomein La Martine — van dronebeelden over het domein tot de borden die de gasten kregen voorgeschoteld.",
    coverKey: "images/lamartine-poster.jpg",
    discipline: "Film & fotografie",
    year: "2026",
    film: {
      key: "videos/web/lamartine-culinair.mp4",
      posterKey: "images/lamartine-poster.jpg",
      duration: "1:55",
    },
    photos: [
      { key: "images/lamartine-01.jpg", w: 1600, h: 1200, wide: true },
      { key: "images/lamartine-02.jpg", w: 1364, h: 1600, wide: false },
      { key: "images/lamartine-03.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-04.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-05.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-06.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-07.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-08.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-09.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-10.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-11.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-12.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-13.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-14.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-15.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-16.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-17.jpg", w: 1600, h: 1066, wide: true },
      { key: "images/lamartine-18.jpg", w: 1066, h: 1600, wide: false },
      { key: "images/lamartine-19.jpg", w: 1076, h: 1600, wide: false },
    ],
  },
];

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}
