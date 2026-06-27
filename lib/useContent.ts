"use client";

import { useState, useEffect } from "react";

const CONTENT_URL = "https://pub-28e65866cf1641928966914639cc84ef.r2.dev/content.json";

export const DEFAULT_CONTENT = {
  contact: {
    email: "Steylvisuals96@gmail.com",
    phone: "",
    instagram: "",
    linkedin: "",
  },
  hero: {
    subtext: "Van cinematic vastgoedvideo tot een website die converteert. Jouw creatieve partner in België.",
  },
  stats: [
    { num: "50+", label: "Panden gefilmd" },
    { num: "3", label: "Jaar ervaring" },
    { num: "2", label: "Services" },
  ],
  vastgoed: {
    subtext: "Short-form video die jouw panden in de kijker zet op Instagram, TikTok en LinkedIn. Professioneel gemaakt, voor makelaars die meer viewings willen.",
  },
};

export type SiteContent = typeof DEFAULT_CONTENT;

// Module-level cache so only one fetch happens per page load
let cached: SiteContent | null = null;
let promise: Promise<void> | null = null;

export function useContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(cached ?? DEFAULT_CONTENT);

  useEffect(() => {
    if (cached) return;
    if (!promise) {
      promise = fetch(CONTENT_URL)
        .then(r => r.json())
        .then((data: Partial<SiteContent>) => {
          if (data && Object.keys(data).length > 0) {
            cached = {
              ...DEFAULT_CONTENT,
              ...data,
              contact: { ...DEFAULT_CONTENT.contact, ...data.contact },
              hero: { ...DEFAULT_CONTENT.hero, ...data.hero },
              vastgoed: { ...DEFAULT_CONTENT.vastgoed, ...data.vastgoed },
              stats: data.stats ?? DEFAULT_CONTENT.stats,
            };
          }
        })
        .catch(() => {});
    }
    promise.then(() => {
      if (cached) setContent(cached);
    });
  }, []);

  return content;
}
