/**
 * The one timeline every part of the homepage reads from.
 *
 * Position along the page is `t`, measured in viewport-heights of scroll. The
 * 3D world, the copy windows, the site that assembles itself and the lead that
 * runs through the automation all take `t` and nothing else, so they can never
 * drift out of step with each other.
 */

export type Leg = { id: string; label: string; w: number };

export const LEGS: Leg[] = [
  { id: "ontwerp", label: "Ontwerp", w: 1.6 },
  { id: "bouw", label: "Bouw", w: 2.2 },
  { id: "klanten", label: "Klanten", w: 2.6 },
  { id: "opvolging", label: "Opvolging", w: 3.6 },
  { id: "ochtend", label: "Ochtend", w: 1.4 },
];

export const LEG_START = LEGS.reduce<number[]>((acc, leg, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LEGS[i - 1].w);
  return acc;
}, []);

export const TOTAL = LEGS.reduce((s, l) => s + l.w, 0);

export function legAt(t: number): number {
  for (let i = LEGS.length - 1; i >= 0; i--) if (t >= LEG_START[i] - 0.001) return i;
  return 0;
}

/** Beats inside the legs, in the same units. */
export const BEAT = {
  assembly: [-0.45, 3.05] as const, // the laptop builds the site: plan, wireframe, type, colour, live
  phoneLive: 3.1, // the phone on the desk lights up with the mobile site
  studioOut: 4.4, // the studio desk is behind us from here
  bays: [4.2, 4.8, 5.4, 6.0], // the camera holds on each client room
  officeIn: 5.9, // the office desk in the tower comes into play
  silence: [6.4, 7.0] as const, // 23:14, nothing moves
  stages: [7.12, 7.95, 8.45, 8.95, 9.45], // aanvraag, mail, CRM, opvolging, afspraak
  monitorOn: [7.55, 7.75] as const,
  officeOut: 10.45,
  dawn: [9.4, 10.8] as const,
};

/** The client rooms, in the order the camera passes them. */
export const BAYS = [
  { id: "specified", src: "/bouwplan/sites/specified.jpg", side: -1, z: -3.75 },
  { id: "lamartine", src: "/bouwplan/sites/lamartine.jpg", side: 1, z: -11 },
  { id: "som", src: "/bouwplan/sites/som.jpg", side: -1, z: -18 },
  { id: "koppens", src: "/bouwplan/sites/koppens.jpg", side: 1, z: -25 },
];

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function smooth(a: number, b: number, x: number) {
  const s = clamp01((x - a) / (b - a));
  return s * s * (3 - 2 * s);
}
