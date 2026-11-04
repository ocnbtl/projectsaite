import type { Reel } from "@/components/site/reel-showcase";

// Owner-selected order. Views are a dated Instagram snapshot, not website plays.
// Preserve Instagram's displayed precision (for example, "23K"), without inventing exact totals.
const reel = (id: string, title: string, views: string): Reel => ({
  id, title, href: `https://www.instagram.com/reel/${id}/`,
  src: `/media/reels/${id}.mp4`, poster: `/media/reels/${id}.jpg`,
  instagram: { views, updated: "2026-11-04" },
});

export const contentCreationReels: Reel[] = [
  reel("Ddo5D8uJbMw", "A boat day with Barefoot Antigua", "2,480"),
  reel("DdmF7BoRO4i", "Exploring Antigua with DP Rentals", "1,626"),
  reel("DcPCf61JC_A", "A visit to The TOX Westerville", "4,230"),
  reel("DUjZuJvCRyd", "Red light, Pilates & a little reset", "1,677"),
  reel("DUsxBB9kZ9t", "Jewelry on your own terms · Elaine B", "2,158"),
  reel("DOZGwmliabC", "A first visit to The Head Spa Ohio", "4,181"),
  reel("DdfKnCVJpp_", "A reset at The Massage Atelier", "3,356"),
];

export const travelReels: Reel[] = [
  reel("DdcHGPxJn5i", "Island time at Starfish House", "1,929"),
  reel("DdbmqQ7RlDQ", "A little slice of Antigua", "2,153"),
  reel("DQkL8qsiaO2", "A Halloween getaway in Mount Vernon", "2,600"),
  reel("DdhgiJ-p5pB", "Pool, paddleboards & ocean views", "2,018"),
  reel("DdaFZX4JFLA", "Not quite ready to leave Antigua", "23K"),
];
