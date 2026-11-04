import type { Reel } from "@/components/site/reel-showcase";

// Owner-selected order. Likes are a dated Instagram snapshot, not live counters.
// Source captions and downloads were checked November 4, 2026; unavailable views are omitted.
const reel = (id: string, title: string, likes: number): Reel => ({
  id, title, href: `https://www.instagram.com/reel/${id}/`,
  src: `/media/reels/${id}.mp4`, poster: `/media/reels/${id}.jpg`,
  instagram: { likes, updated: "2026-11-04" },
});

export const contentCreationReels: Reel[] = [
  reel("Ddo5D8uJbMw", "A boat day with Barefoot Antigua", 90),
  reel("DdmF7BoRO4i", "Exploring Antigua with DP Rentals", 32),
  reel("DcPCf61JC_A", "A visit to The TOX Westerville", 42),
  reel("DUjZuJvCRyd", "Red light, Pilates & a little reset", 17),
  reel("DUsxBB9kZ9t", "Jewelry on your own terms · Elaine B", 20),
  reel("DOZGwmliabC", "A first visit to The Head Spa Ohio", 47),
  reel("DdfKnCVJpp_", "A reset at The Massage Atelier", 53),
];

export const travelReels: Reel[] = [
  reel("DdcHGPxJn5i", "Island time at Starfish House", 50),
  reel("DdbmqQ7RlDQ", "A little slice of Antigua", 41),
  reel("DQkL8qsiaO2", "A Halloween getaway in Mount Vernon", 40),
  reel("DdhgiJ-p5pB", "Pool, paddleboards & ocean views", 50),
  reel("DdaFZX4JFLA", "Not quite ready to leave Antigua", 648),
];
