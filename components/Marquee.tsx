"use client";

const items = [
  "Instagram Reels", "TikTok", "LinkedIn Video", "Drone Shots",
  "Brand Video", "Webdesign", "Short-Form Content", "CMS op maat",
  "Instagram Reels", "TikTok", "LinkedIn Video", "Drone Shots",
  "Brand Video", "Webdesign", "Short-Form Content", "CMS op maat",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden py-3.5" style={{ backgroundColor: "var(--black)" }}>
      <div className="flex w-max animate-marquee">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-5 px-8 text-xs font-medium tracking-widest uppercase whitespace-nowrap" style={{ color: "var(--cream-muted)" }}>
            {item}
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--gold)", opacity: 0.6 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
