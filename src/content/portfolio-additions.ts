import type { PortfolioMedia } from "@/content/portfolio-media";
import type { Project } from "@/lib/content";

// Selected by the owner on October 10, 2026 from Sage's Heyman Talent gallery.
// Source: https://www.heymantalent.com/media/photos/<filename>.jpg
// Used on Portfolio and Modeling, deliberately not in the homepage selection.
export const portfolioAdditions: PortfolioMedia[] = [
  {
    id: "HEYMAN-PORTRAIT", src: "/media/sage/agency/zh14h2356ikjkc.jpg",
    width: 1080, height: 1619, label: "Portrait",
    alt: "Close portrait of Sage Burress wearing a black blazer, with loose blonde hair.",
    bytes: 352235, sha256: "1388a1d7115d50a07f6358787fc6ed41cfe2d6a0bd8b271470c001e0ef35bdd2",
  },
  {
    id: "HEYMAN-DENIM", src: "/media/sage/agency/zh14h1713zndrj.jpg",
    width: 1080, height: 1619, label: "Fashion",
    alt: "Sage Burress in a denim jacket and jeans with one arm raised against a light studio wall.",
    bytes: 394803, sha256: "d7c27c5f22917bb4be0cf7a3d9779bfca65a7fea6488a54fa26461bfc9e196c5",
  },
  {
    id: "HEYMAN-TAILORING-KNEELING", src: "/media/sage/agency/zh14h1512qxgvi.jpg",
    width: 1080, height: 1619, label: "Editorial",
    alt: "Sage Burress kneeling in a black tailored blazer, long shorts, and heels.",
    bytes: 128771, sha256: "1a05d02cd718e6b6c415ea2219d6f56ce2a4a872aabd85625eca454f384a7e76",
  },
  {
    id: "HEYMAN-TAILORING-STANDING", src: "/media/sage/agency/zh14h1120pjxsa.jpg",
    width: 1080, height: 1619, label: "Editorial",
    alt: "Full-length studio photograph of Sage Burress in a black blazer, tailored shorts, and heels.",
    bytes: 111895, sha256: "56a18ecca2961b358ecca5ee03fe17ed41f01c81a68cd12d93d213e932785623",
  },
  {
    id: "HEYMAN-GREEN-FRINGE", src: "/media/sage/agency/zh14h1423fpxih.jpg",
    width: 1080, height: 1619, label: "Editorial",
    alt: "Sage Burress wearing an olive-green fringe dress, looking to the side in a studio portrait.",
    bytes: 438954, sha256: "e4baa5528139070cd2b01df35d54eac750802e3d6ffe96f63cecb400224196d0",
  },
];

export const aboutPortrait = portfolioAdditions[0];

export function portfolioPageProjects(projects: Project[]): Project[] {
  return [...projects, ...portfolioAdditions
    .filter(media => !projects.some(project => project.image === media.src))
    .map(media => ({
      slug: media.id.toLowerCase(), title: media.label, category: media.label,
      year: "", location: "", summary: media.alt, story: media.alt,
      image: media.src, alt: media.alt, tags: [media.label], featured: false,
    }))];
}
