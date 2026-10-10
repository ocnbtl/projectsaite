import type { SiteContent } from "@/lib/content";
import { biography, homeCredibility, localServiceIntro, localServiceSlugs, serviceGuides } from "@/lib/editorial-content";
import { siteUrl } from "@/lib/site-url";

const link = (label: string, path: string) => `[${label.replace(/[\[\]\\]/g, "")}](${siteUrl}${path})`;
export function publicMarkdown(pathname: string, content: SiteContent): string | null {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const navigation = `\n\n## Explore\n\n${[["About", "/about"], ["Portfolio", "/portfolio"], ["Contact", "/contact"], ["Privacy", "/privacy"]].map(([label, route]) => `- ${link(label, route)}`).join("\n")}`;
  let body: string;
  if (path === "/") {
    body = `# Sage Burress — Model & Creative\n\n${content.hero.lead}\n\n## Experience, with personality.\n\n${homeCredibility}\n\n${link("A little more about me", "/about")}\n\n## Services\n\nModeling, content and travel with Sage Burress. Makeup, henna and face painting with Sage’s Shenanigans in Cincinnati and Mason, Ohio.\n\n${content.services.map(service => `### ${link(service.title, `/services/${service.slug}`)}\n\n${service.summary}`).join("\n\n")}\n\n## Selected work, publications and runway experience\n\n${content.featuredBrands.map(brand => brand.name).join(" · ")}`;
  } else if (path === "/about") {
    body = `# About Sage Burress\n\n## ${biography.title}\n\n${biography.introduction}\n\n${biography.work}\n\n${biography.local}`;
  } else if (path.startsWith("/services/")) {
    const service = content.services.find(item => path === `/services/${item.slug}`);
    if (!service) return null;
    const guide = serviceGuides[service.slug];
    body = `# ${service.title}\n\n${service.description}\n\n## What I offer\n\n${service.deliverables.map(value => `- ${value}`).join("\n")}\n\n## A few useful answers\n\n${localServiceSlugs.includes(service.slug) ? localServiceIntro : "Sage Burress · Project details"}\n\n${guide?.faqs.map(faq => `### ${faq.question}\n\n${faq.answer}`).join("\n\n") ?? ""}`;
  } else if (path === "/portfolio") {
    body = `# Portfolio\n\nSelected modeling and creative work by Sage Burress.\n\n${content.projects.map(project => `- ${project.alt}`).join("\n")}`;
  } else if (path.startsWith("/portfolio/")) {
    const project = content.projects.find(item => path === `/portfolio/${item.slug}`);
    if (!project) return null;
    body = `# ${project.title}\n\n${project.summary}\n\n${project.story}`;
  } else if (path === "/contact") {
    body = `# ${content.contact.title}\n\n${content.contact.intro}\n\nUse the ${link("contact form", "/contact")} or email ${content.contact.email}. An inquiry does not confirm a booking.`;
  } else if (path === "/links") {
    body = `# Links\n\n${content.links.filter(item => item.active && /^https:\/\//.test(item.href)).map(item => `- [${item.label}](${item.href}): ${item.description}`).join("\n")}`;
  } else if (path === "/privacy") {
    body = "# Privacy Disclosure\n\n## Your Messages\n\nWe use your details to reply to your inquiry. We never sell them.\n\n## Site Insights\n\nAnalytics and error reports help us improve this site. Vercel provides basic traffic counts. PostHog starts only after you opt in, with separate choices for analytics and recordings. Random identifiers are used without identified profiles or IP-based location enrichment; data is processed in the US.\n\nRecordings show public page content and interactions, with private areas and form inputs hidden. Contact, privacy and admin pages are not recorded. Form entries, uploaded files, sensitive URLs, network contents and console logs are excluded from PostHog.\n\nPreferences are saved in browser storage. Do Not Track and Global Privacy Control keep optional tracking off. Opting out stops future collection, not past data. Use the privacy page settings in your browser to change your choices. Questions or deletion requests: contact@sageburress.com. Updated October 10, 2026.";
  } else return null;
  return `${body}${navigation}\n\nCanonical page: ${siteUrl}${path === "/" ? "/" : path}\n`;
}
