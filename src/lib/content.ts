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
  images: ServiceImage[];
};

export type ServiceImage = {
  id: string;
  src: string;
  alt: string;
  placeholder: boolean;
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
  featuredBrands: FeaturedBrand[];
  links: SiteLink[];
};

export type FeaturedBrand = {
  id: string;
  name: string;
  logo?: string;
  invert?: boolean;
};

export type SiteLink = {
  id: string;
  label: string;
  href: string;
  description: string;
  active: boolean;
};

export const defaultFeaturedBrands: FeaturedBrand[] = [
  { id: "saks-fifth-avenue", name: "Saks Fifth Avenue", logo: "/media/brands/saks-fifth-avenue.svg" },
  { id: "rebel-magazine", name: "Rebel Magazine", logo: "/media/brands/rebel-magazine.svg" },
  { id: "loveland-lifestyle", name: "Loveland Lifestyle Magazine", logo: "/media/brands/loveland-lifestyle.png" },
  { id: "westcott-lighting", name: "Westcott Lighting", logo: "/media/brands/westcott.png" },
  { id: "nooon", name: "NOOON", logo: "/media/brands/nooon.svg", invert: true },
  { id: "ocean-savage", name: "Ocean Savage", logo: "/media/brands/ocean-savage.svg", invert: true },
  { id: "heyman-talent", name: "Heyman Talent", logo: "/media/brands/heyman-talent-transparent.png" },
  { id: "timeless", name: "Timeless", logo: "/media/brands/timeless.webp" },
  { id: "macys", name: "Macy's", logo: "/media/brands/macys.svg" },
  { id: "beautystat-cosmetics", name: "BeautyStat Cosmetics", logo: "/media/brands/beautystat.png" },
  { id: "elaine-b-jewelry", name: "Elaine B Jewelry", logo: "/media/brands/elaine-b-jewelry.png" },
  { id: "sequencing", name: "Sequencing.com", logo: "/media/brands/sequencing.svg" },
  { id: "wooden-cask", name: "Wooden Cask Brewing Company", logo: "/media/brands/wooden-cask.webp" },
  { id: "red-light-method", name: "Red Light Method Montgomery", logo: "/media/brands/red-light-method.svg" },
  { id: "romantic-adventure-getaways", name: "Romantic Adventure Getaways", logo: "/media/brands/romantic-adventure-getaways.svg" },
  { id: "versed-skincare", name: "Versed Skincare", logo: "/media/brands/versed.png" },
  { id: "black-opal-aesthetics", name: "Black Opal Esthetics", logo: "/media/brands/black-opal-aesthetics.svg" },
];

function media(id: string) {
  const match = portfolioMedia.find((item) => item.id === id);
  if (!match) throw new Error(`Missing portfolio media: ${id}`);
  return match;
}

export const seedContent: SiteContent = {
  hero: {
    kicker: "Hi, my name is",
    title: "Sage Burress",
    lead: "Modeling, content creation, makeup artistry, travel promotions, henna, and face painting.",
    image: "/media/sage/hero-cutout-v2.webp",
    imageAlt: media("SRC-SAGE-003").alt,
  },
  about: {
    title: "Creative work with presence, personality, and a clear point of view.",
    intro:
      "Sage works across modeling, content creation, makeup artistry, travel promotions, henna, and face painting.",
    story:
      "Each project begins with the brief and the people it needs to reach, then builds a visual approach that feels natural to the setting.",
    image: media("SRC-SAGE-001").src,
    imageAlt: media("SRC-SAGE-001").alt,
  },
  contact: {
    title: "Let’s work together.",
    intro:
      "Tell me what you have in mind, even if it’s still just an idea. A little context is helpful, but you don’t need every detail figured out. I typically reply within 48 hours.",
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
        "Runway, event, and live bookings",
      ],
      accent: "olive",
      images: [
        { id: "modeling-01", src: media("SRC-SAGE-008").src, alt: media("SRC-SAGE-008").alt, placeholder: false },
        { id: "modeling-02", src: media("SRC-SAGE-010").src, alt: media("SRC-SAGE-010").alt, placeholder: false },
        { id: "modeling-03", src: media("SRC-SAGE-001").src, alt: media("SRC-SAGE-001").alt, placeholder: false },
      ],
    },
    {
      slug: "content-creation",
      number: "02",
      title: "Content Creation",
      shortTitle: "Content Creation",
      summary: "Photo, short-form, and long-form storytelling created for social platforms.",
      description:
        "Original storytelling that feels natural on social while still delivering the polish, intention, and creative perspective brands need.",
      deliverables: [
        "Short-form and long-form video",
        "Photography and carousels",
        "UGC and sponsored brand content",
      ],
      accent: "clay",
      images: [
        { id: "content-creation-01", src: media("SRC-SAGE-004").src, alt: media("SRC-SAGE-004").alt, placeholder: false },
        { id: "content-creation-02", src: media("SRC-SAGE-005").src, alt: media("SRC-SAGE-005").alt, placeholder: false },
        { id: "content-creation-03", src: media("SRC-SAGE-007").src, alt: media("SRC-SAGE-007").alt, placeholder: false },
      ],
    },
    {
      slug: "makeup-artist",
      number: "03",
      title: "Makeup Artist",
      shortTitle: "Makeup Artist",
      summary: "Camera-ready beauty and creative makeup for events, portraits, and productions.",
      description:
        "Makeup artistry shaped around the setting, from polished beauty looks to bold creative concepts for photography, video, runway, and special events.",
      deliverables: [
        "Beauty and event makeup",
        "Photo, video, and runway makeup",
        "Creative and character looks",
      ],
      accent: "cocoa",
      images: [
        { id: "makeup-artist-01", src: "/media/services/makeup-artist-01.webp", alt: "Runway model wearing polished makeup with a burnt-orange look.", placeholder: false },
        { id: "makeup-artist-02", src: "/media/services/makeup-artist-02.webp", alt: "Creative black eye makeup photographed under vivid blue lighting.", placeholder: false },
        { id: "makeup-artist-03", src: "/media/services/makeup-artist-03.webp", alt: "Creative theatrical makeup with deep black and red details.", placeholder: false },
      ],
    },
    {
      slug: "travel-collaborations",
      number: "04",
      title: "Travel Promotions",
      shortTitle: "Travel Promotions",
      summary: "Reels, stories, and short-form video for destinations, stays, and experiences.",
      description:
        "Promotional travel content for properties, destinations, and experience-led partners, shaped around how the place actually feels to visit.",
      deliverables: [
        "Destination storytelling",
        "Short-form travel content",
        "Cross-platform content packages",
      ],
      accent: "bronze",
      images: [
        { id: "travel-collaborations-01", src: "/media/services/travel-resort-candid.webp", alt: "Tropical resort terrace overlooking an infinity pool and a coastal cove.", placeholder: false },
        { id: "travel-collaborations-02", src: "", alt: "Additional travel promotion work will appear here.", placeholder: true },
        { id: "travel-collaborations-03", src: "", alt: "Additional travel promotion work will appear here.", placeholder: true },
      ],
    },
    {
      slug: "henna",
      number: "05",
      title: "Henna",
      shortTitle: "Henna",
      summary: "Hand-drawn henna for celebrations, events, and individual appointments.",
      description:
        "Custom henna designs created to suit the person and the occasion, from small personal details to more intricate hand and arm work.",
      deliverables: [
        "Individual appointments",
        "Events and celebrations",
      ],
      accent: "sage",
      images: [
        { id: "henna-01", src: "/media/services/henna-01-cutout.webp", alt: "Detailed floral henna design extending across a hand and wrist.", placeholder: false },
        { id: "henna-02", src: "/media/services/henna-02-cutout.webp", alt: "Intricate floral and geometric henna design across a hand and forearm.", placeholder: false },
      ],
    },
    {
      slug: "face-painting",
      number: "06",
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
      images: [
        { id: "face-painting-01", src: "/media/services/face-painting-01.webp", alt: "Smiling child wearing a bright green superhero-inspired face painting design.", placeholder: false },
        { id: "face-painting-02", src: "/media/services/face-painting-02.webp", alt: "Child wearing a red and black spider-inspired face painting design.", placeholder: false },
        { id: "face-painting-03", src: "/media/services/face-painting-03.webp", alt: "Butterfly face painting with orange wings and delicate floral details.", placeholder: false },
        { id: "face-painting-04", src: "/media/services/face-painting-04.webp", alt: "Child wearing an orange floral creature face painting design.", placeholder: false },
        { id: "face-painting-05", src: "/media/services/face-painting-05.webp", alt: "Detailed orange, cream, and black tiger face painting.", placeholder: false },
      ],
    },
  ],
  projects: portfolioMedia.filter((item) => item.id !== "SRC-SAGE-006").map((media, index) => ({
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
  featuredBrands: defaultFeaturedBrands,
  links: [
    {
      id: "amazon-storefront",
      label: "Amazon Storefront",
      href: "https://www.amazon.com/shop/influencer-7b7f11ab",
      description: "Fashion, beauty, art, and everyday favorites.",
      active: true,
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/sage_burress/",
      description: "Reels, behind-the-scenes work, beauty, travel, and current projects.",
      active: true,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/107356810631100",
      description: "Updates, portfolio moments, and ways to follow along.",
      active: true,
    },
    {
      id: "shopmy",
      label: "ShopMy",
      href: "https://shopmy.us/sageburress",
      description: "A curated edit of products Sage recommends.",
      active: true,
    },
    {
      id: "heyman-talent",
      label: "Heyman Talent Portfolio",
      href: "https://www.heymantalent.com/t/sage-burress",
      description: "Current agency portfolio, measurements, skills, and credits.",
      active: true,
    },
  ],
};

export const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/links", label: "Links" },
  { href: "/contact", label: "Contact" },
];

const removedProjectImage = "/media/sage/v1/sage-006.webp";

export function normalizeSiteContent(value: SiteContent): SiteContent {
  const isLegacyServiceSet = !value.services.some((service) => service.slug === "henna") ||
    !value.services.some((service) => service.slug === "makeup-artist");
  const services = seedContent.services.map((fallback) => {
    const stored = value.services.find((service) => service.slug === fallback.slug);
    if (!stored) return fallback;
    const hasLegacyModelingOffer = fallback.slug === "modeling" &&
      stored.deliverables.includes("On-location creative work");
    const hasLegacyHennaOffer = fallback.slug === "henna" &&
      stored.deliverables.includes("Custom hand-drawn designs");
    const hasLegacyTravelTitle = fallback.slug === "travel-collaborations" &&
      stored.title === "Travel Collaborations";
    const hasLegacyTravelSummary = fallback.slug === "travel-collaborations" &&
      stored.summary === "Reels, stories, and short-form video for destinations and experiences.";
    const hasLegacyTravelDescription = fallback.slug === "travel-collaborations" &&
      stored.description === "Collaborative travel content for properties, destinations, and experience-led partners, shaped around how the place actually feels to visit.";
    const hasLegacyHennaImages = fallback.slug === "henna" && stored.images.every((image) =>
      image.src === "/media/services/henna-01.webp" || image.src === "/media/services/henna-02.webp"
    );
    return {
      ...fallback,
      ...stored,
      slug: fallback.slug,
      number: fallback.number,
      title: hasLegacyTravelTitle ? fallback.title : stored.title,
      shortTitle:
        fallback.slug === "travel-collaborations" && stored.shortTitle === "Travel Collaborations"
          ? fallback.shortTitle
          : stored.shortTitle,
      summary: hasLegacyTravelSummary ? fallback.summary : stored.summary,
      description: hasLegacyTravelDescription ? fallback.description : stored.description,
      accent: fallback.accent,
      deliverables:
        Array.isArray(stored.deliverables) && !hasLegacyModelingOffer && !hasLegacyHennaOffer
          ? stored.deliverables
          : fallback.deliverables,
      images:
        !isLegacyServiceSet && !hasLegacyHennaImages && Array.isArray(stored.images) && stored.images.length
          ? stored.images
          : fallback.images,
    };
  });
  const storedFeaturedBrands = Array.isArray(value.featuredBrands) ? value.featuredBrands : [];
  const featuredBrandIds = new Set(defaultFeaturedBrands.map((brand) => brand.id));
  const featuredBrands = [
    ...defaultFeaturedBrands.map((fallback) => {
      const stored = storedFeaturedBrands.find((brand) => brand.id === fallback.id);
      const hasLegacyRomanticLogo = fallback.id === "romantic-adventure-getaways" && [
        "/media/brands/romantic-adventure-getaways.png",
        "/media/brands/romantic-adventure-getaways-clean.svg",
        "/media/brands/romantic-adventure-getaways-transparent.png",
        "/media/brands/romantic-adventure-getaways-transparent-v2.png",
      ].includes(stored?.logo ?? "");
      const hasLegacyBlackOpalName = fallback.id === "black-opal-aesthetics" &&
        stored?.name === "Black Opal Aesthetics";
      return stored
        ? {
            ...fallback,
            ...stored,
            name: hasLegacyBlackOpalName ? fallback.name : stored.name,
            logo: hasLegacyRomanticLogo ? fallback.logo : stored.logo || fallback.logo,
            invert: hasLegacyRomanticLogo ? fallback.invert : stored.invert,
          }
        : fallback;
    }),
    ...storedFeaturedBrands.filter((brand) => !featuredBrandIds.has(brand.id)),
  ];
  const storedLinks = Array.isArray(value.links) ? value.links : [];
  const defaultLinkIds = new Set(seedContent.links.map((link) => link.id));
  const links = [
    ...seedContent.links.map((fallback) => {
      const stored = storedLinks.find((link) => link.id === fallback.id);
      if (!stored) return fallback;
      const hasStoredDestination = Boolean(stored.href?.trim());
      return {
        ...fallback,
        ...stored,
        href: hasStoredDestination ? stored.href : fallback.href,
        active: hasStoredDestination ? stored.active : fallback.active,
      };
    }),
    ...storedLinks.filter((link) => !defaultLinkIds.has(link.id)),
  ];

  return {
    ...seedContent,
    ...value,
    hero: {
      ...seedContent.hero,
      ...value.hero,
      lead:
        value.hero.lead === "Modeling, face painting, henna, makeup artistry, content creation, and travel collaborations."
          ? seedContent.hero.lead
          : value.hero.lead,
      image:
        value.hero.image === "/media/sage/v1/sage-003.webp"
          ? seedContent.hero.image
          : value.hero.image,
    },
    about: {
      ...seedContent.about,
      ...value.about,
      intro:
        value.about.intro === "Sage works across modeling, face painting, henna, makeup artistry, content creation, and travel collaborations."
          ? seedContent.about.intro
          : value.about.intro,
    },
    contact: { ...seedContent.contact, ...value.contact },
    services,
    projects: value.projects.filter((project) => project.image !== removedProjectImage),
    featuredBrands,
    links,
  };
}

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
