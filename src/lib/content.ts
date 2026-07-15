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
  social: Array<{ label: string; href: string; handle: string }>;
};

export type ContentEditingState = {
  canSave: boolean;
  message: string;
};

export function normalizeSiteContentForSave(content: SiteContent): SiteContent {
  return {
    ...content,
    services: content.services.map((service) => ({
      ...service,
      deliverables: service.deliverables.map((deliverable) => deliverable.trim()).filter(Boolean),
    })),
  };
}

export function getAvailableProjectSlug(projects: Array<Pick<Project, "slug">>) {
  const usedSlugs = new Set(projects.map((project) => project.slug));
  let suffix = projects.length + 1;
  while (usedSlugs.has(`new-project-${suffix}`)) suffix += 1;
  return `new-project-${suffix}`;
}

export const seedContent: SiteContent = {
  hero: {
    kicker: "Model · Creator · Scout · Artist",
    title: "Sage Burress",
    lead:
      "Nine years modeling. A decade creating. A thoughtful partner for brands, spaces, stories, and people.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=88",
    imageAlt: "Editorial portrait placeholder to be replaced with Sage's portfolio image",
  },
  about: {
    title: "A creative practice built around people and place.",
    intro:
      "Sage brings an observant eye, calm professionalism, and real curiosity to every assignment, whether she is in front of the camera, behind a concept, or discovering new talent.",
    story:
      "Her work moves between modeling, creator partnerships, model scouting, face painting, and hospitality storytelling. The disciplines are different, but the approach is consistent: understand the audience, find the honest angle, and make the finished work feel natural.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=88",
    imageAlt: "Editorial fashion portrait placeholder",
  },
  contact: {
    title: "Have a project in mind?",
    intro:
      "Share the brief, the timing, and what a strong outcome looks like. Sage will respond with availability and the clearest next step.",
    email: "contact@sageburress.com",
  },
  services: [
    {
      slug: "modeling",
      number: "01",
      title: "Modeling",
      shortTitle: "Model",
      summary: "Editorial, commercial, lifestyle, and hospitality work with an experienced on-set presence.",
      description:
        "A versatile modeling practice shaped by nearly a decade of experience, clear communication, and the ability to understand the visual language of a campaign quickly.",
      deliverables: ["Campaign and editorial shoots", "Lifestyle and hospitality imagery", "Runway and live events", "Usage-aware project planning"],
      accent: "olive",
    },
    {
      slug: "content-creation",
      number: "02",
      title: "Content Creation",
      shortTitle: "Create",
      summary: "Platform-native concepts and polished visual stories for Instagram, TikTok, and YouTube.",
      description:
        "Sage develops content that feels personal without losing strategic clarity, adapting the story and pacing to each platform rather than recycling one generic asset everywhere.",
      deliverables: ["Short-form video", "Photography and carousels", "UGC-style brand stories", "Creative direction and scripting"],
      accent: "clay",
    },
    {
      slug: "model-scouting",
      number: "03",
      title: "Model Scouting",
      shortTitle: "Scout",
      summary: "A people-first eye for distinctive talent, potential, presence, and fit.",
      description:
        "Scouting informed by real industry experience, with an emphasis on honest guidance, thoughtful introductions, and talent who can grow into the opportunity.",
      deliverables: ["Talent discovery", "Initial portfolio review", "Fit and opportunity assessment", "Warm introductions"],
      accent: "sage",
    },
    {
      slug: "face-painting",
      number: "04",
      title: "Face Painting",
      shortTitle: "Paint",
      summary: "Expressive, camera-ready artistry for events, activations, editorials, and private bookings.",
      description:
        "A flexible creative service that can move from playful family events to refined brand activations and editorial concepts, always with a clean, professional setup.",
      deliverables: ["Private and public events", "Brand activations", "Editorial concepts", "Custom visual themes"],
      accent: "blush",
    },
    {
      slug: "airbnb-partnerships",
      number: "05",
      title: "Airbnb Partnerships",
      shortTitle: "Stay",
      summary: "Guest-perspective storytelling that helps distinctive stays become easier to imagine and book.",
      description:
        "Creator partnerships for hosts who want useful, beautiful coverage of the real guest experience, with content designed to communicate the stay's character and practical appeal.",
      deliverables: ["Property photography", "Short-form walkthroughs", "Experience-led reviews", "Social content packages"],
      accent: "bronze",
    },
    {
      slug: "hotel-resort-collaborations",
      number: "06",
      title: "Hotel & Resort Collaborations",
      shortTitle: "Travel",
      summary: "Elevated destination content shaped for hotels, resorts, and experience-led hospitality brands.",
      description:
        "A more editorial hospitality offering for properties that need campaign-minded imagery, narrative travel content, and a creative partner who understands the full guest journey.",
      deliverables: ["Destination storytelling", "Campaign-ready photo and video", "Amenity and experience coverage", "Multi-platform content licensing"],
      accent: "cocoa",
    },
  ],
  projects: [
    {
      slug: "desert-light",
      title: "Desert Light",
      category: "Modeling",
      year: "2026",
      location: "Joshua Tree, California",
      summary: "An editorial study in quiet movement, sun-washed texture, and natural styling.",
      story:
        "A small-team editorial built around the pace of the landscape. The visual direction favored relaxed movement and long shadows over heavily constructed poses.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=88",
      alt: "Editorial portrait placeholder for Desert Light",
      tags: ["Editorial", "Fashion", "Campaign"],
      featured: true,
    },
    {
      slug: "field-notes",
      title: "Field Notes",
      category: "Content",
      year: "2026",
      location: "Cincinnati, Ohio",
      summary: "A tactile lifestyle series created for short-form storytelling and still-image use.",
      story:
        "The assignment combined concise product moments with a looser personal narrative, giving the brand both polished stills and conversational social assets.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=88",
      alt: "Fashion and lifestyle rack placeholder for Field Notes",
      tags: ["UGC", "Lifestyle", "Short-form"],
      featured: true,
    },
    {
      slug: "slow-weekend",
      title: "Slow Weekend",
      category: "Hospitality",
      year: "2026",
      location: "Hocking Hills, Ohio",
      summary: "A guest-first cabin story focused on atmosphere, details, and the rhythm of a real stay.",
      story:
        "Rather than treating the property as a catalog, the story followed a complete weekend and showed how the space felt from arrival through the final morning.",
      image:
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=88",
      alt: "Woodland cabin placeholder for Slow Weekend",
      tags: ["Airbnb", "Travel", "Review"],
      featured: true,
    },
    {
      slug: "color-in-motion",
      title: "Color in Motion",
      category: "Face Painting",
      year: "2025",
      location: "Columbus, Ohio",
      summary: "Custom face art designed for an energetic live event and fast-moving photo moments.",
      story:
        "The visual system used a limited palette and modular motifs so every guest received something distinct while the event still felt cohesive on camera.",
      image:
        "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=1400&q=88",
      alt: "Colorful artistic portrait placeholder for Color in Motion",
      tags: ["Event", "Artistry", "Activation"],
      featured: false,
    },
    {
      slug: "new-faces",
      title: "New Faces",
      category: "Scouting",
      year: "2025",
      location: "Midwest, USA",
      summary: "A scouting and portfolio-development series centered on presence before polish.",
      story:
        "The process focused on potential, personal direction, and honest portfolio feedback, helping emerging talent understand both their strengths and next steps.",
      image:
        "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1400&q=88",
      alt: "Emerging model portrait placeholder for New Faces",
      tags: ["Discovery", "Development", "Talent"],
      featured: false,
    },
    {
      slug: "the-arrival",
      title: "The Arrival",
      category: "Hospitality",
      year: "2025",
      location: "Palm Springs, California",
      summary: "A refined resort collaboration organized around the emotional arc of arrival and escape.",
      story:
        "The content plan balanced architectural detail, guest perspective, and editorial portraiture so the property could speak to both design-minded travelers and experience seekers.",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=88",
      alt: "Resort pool placeholder for The Arrival",
      tags: ["Resort", "Campaign", "Travel"],
      featured: false,
    },
  ],
  social: [
    { label: "Instagram", href: "https://www.instagram.com/", handle: "@sageburress" },
    { label: "TikTok", href: "https://www.tiktok.com/", handle: "@sageburress" },
    { label: "YouTube", href: "https://www.youtube.com/", handle: "Sage Burress" },
  ],
};

export const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];
