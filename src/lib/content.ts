import { portfolioMedia } from "@/content/portfolio-media";

export type Service = {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  deliverables: string[];
  accent: "olive" | "clay" | "blush" | "bronze" | "cocoa" | "sage";
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  location: string;
  summary: string;
  story: string;
  image: string;
  alt: string;
  tags: string[];
  featured: boolean;
};

export type SiteContent = {
  hero: {
    kicker: string;
    title: string;
    lead: string;
    image: string;
    imageAlt: string;
  };
  about: {
    title: string;
    intro: string;
    story: string;
    image: string;
    imageAlt: string;
  };
  contact: {
    title: string;
    intro: string;
    email: string;
  };
  services: Service[];
  projects: Project[];
  featuredBy: string[];
  social: Array<{ label: string; href: string; handle: string }>;
};

export type FeaturedBrand = {
  name: string;
  logo?: string;
  invert?: boolean;
};

export const featuredBrands: FeaturedBrand[] = [
  { name: "Saks Fifth Avenue", logo: "/media/brands/saks-fifth-avenue.svg" },
  { name: "Rebel Magazine" },
  { name: "Westcott Lighting", logo: "/media/brands/westcott.png" },
  { name: "NOOON", logo: "/media/brands/nooon.svg", invert: true },
  { name: "Ocean Savage", logo: "/media/brands/ocean-savage.svg", invert: true },
  { name: "Heyman Talent", logo: "/media/brands/heyman-talent.png" },
  { name: "Timeless" },
  { name: "Macy's", logo: "/media/brands/macys.svg" },
  { name: "BeautyStat Cosmetics", logo: "/media/brands/beautystat.png" },
];

export const seedContent: SiteContent = {
  hero: {
    kicker: "Hi, my name is",
    title: "Sage Burress",
    lead: "Modeling, face painting, content creation, and travel collaborations.",
    image: portfolioMedia[2].src,
    imageAlt: portfolioMedia[2].alt,
  },
  about: {
    title: "Creative work with presence, personality, and a clear point of view.",
    intro:
      "Sage works across modeling, face painting, content creation, and travel collaborations.",
    story:
      "Each project begins with the brief and the people it needs to reach, then builds a visual approach that feels natural to the setting.",
    image: portfolioMedia[0].src,
    imageAlt: portfolioMedia[0].alt,
  },
  contact: {
    title: "Let’s work together.",
    intro:
      "Tell Sage what you have in mind—even if it’s still just an idea. A little context is helpful, but you don’t need every detail figured out. Sage will reply with availability within 48 hours.",
    email: "contact@sageburress.com",
  },
  services: [
    {
      slug: "modeling",
      number: "01",
      title: "Modeling",
      shortTitle: "Modeling",
      summary: "Editorial, commercial, lifestyle, and creative bookings.",
      description:
        "A focused, collaborative presence for still photography, campaign work, lifestyle imagery, events, and other camera-facing assignments.",
      deliverables: [
        "Editorial and campaign shoots",
        "Lifestyle and commercial imagery",
        "On-location creative work",
      ],
      accent: "olive",
    },
    {
      slug: "face-painting",
      number: "02",
      title: "Face Painting",
      shortTitle: "Face Painting",
      summary: "Expressive, camera-ready artistry for people, events, and concepts.",
      description:
        "Creative face painting shaped to the setting, from private bookings and live events to editorials and one-of-a-kind concepts.",
      deliverables: [
        "Private and public events",
        "Editorial concepts",
        "Custom creative concepts",
      ],
      accent: "blush",
    },
    {
      slug: "content-creation",
      number: "03",
      title: "Content Creation",
      shortTitle: "Content Creation",
      summary: "Photo and short-form storytelling built for the platform and brief.",
      description:
        "Original storytelling that feels natural on social while still delivering the polish, intention, and creative perspective brands need.",
      deliverables: [
        "Short-form and long-form video",
        "Photography and carousels",
        "UGC and sponsored brand content",
      ],
      accent: "clay",
    },
    {
      slug: "travel-collaborations",
      number: "04",
      title: "Travel Collaborations",
      shortTitle: "Travel Collaborations",
      summary: "Photo-led stories for stays, destinations, and memorable experiences.",
      description:
        "Collaborative travel content for properties, destinations, and experience-led partners, shaped around how the place actually feels to visit.",
      deliverables: [
        "Destination storytelling",
        "Short-form travel content",
        "Cross-platform content packages",
      ],
      accent: "bronze",
    },
  ],
  projects: portfolioMedia.map((media, index) => ({
    slug: `portfolio-${String(index + 1).padStart(2, "0")}`,
    title: `Portfolio ${String(index + 1).padStart(2, "0")}`,
    category: media.label,
    year: "",
    location: "",
    summary: "Selected work from Sage Burress’s portfolio.",
    story: "A selected image from Sage Burress’s current portfolio.",
    image: media.src,
    alt: media.alt,
    tags: [media.label],
    featured: true,
  })),
  featuredBy: [],
  social: [],
};

export const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SiteContent>;
  return Boolean(
    candidate.hero &&
      candidate.about &&
      candidate.contact &&
      Array.isArray(candidate.services) &&
      Array.isArray(candidate.projects) &&
      Array.isArray(candidate.featuredBy) &&
      Array.isArray(candidate.social),
  );
}
