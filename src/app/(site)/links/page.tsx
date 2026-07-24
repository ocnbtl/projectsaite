import type { Metadata } from "next";
import {
  Aperture,
  ArrowUpRight,
  AtSign,
  BriefcaseBusiness,
  MessageCircle,
  Shirt,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Links",
  description: "Find Sage Burress’s storefronts, recommendations, and current platforms.",
  alternates: { canonical: "/links" },
};

function getExternalHref(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function LinkIcon({ id }: { id: string }) {
  const props = { size: 23, strokeWidth: 1.35, "aria-hidden": true as const };

  switch (id) {
    case "heyman-talent":
      return <BriefcaseBusiness {...props} />;
    case "talent-fusion":
      return <Users {...props} />;
    case "invu-model-talent":
      return <Aperture {...props} />;
    case "amazon-storefront":
      return <ShoppingBag {...props} />;
    case "depop":
      return <Shirt {...props} />;
    case "shopmy":
      return <Sparkles {...props} />;
    case "instagram":
      return <AtSign {...props} />;
    case "facebook":
      return <MessageCircle {...props} />;
    default:
      return <ArrowUpRight {...props} />;
  }
}

export default async function LinksPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--links">
        <h1>Find what I’m sharing.</h1>
      </section>

      <section className="editorial-links-page" aria-label="Sage Burress links">
        <div className="editorial-links-page__intro">
          <p>Shop my favorites or follow my latest work.</p>
        </div>
        <div className="editorial-links-list">
          {content.links.map((item, index) => {
            const href = item.active ? getExternalHref(item.href) : null;
            return href ? (
              <a href={href} key={item.id} target="_blank" rel="noopener noreferrer">
                <span className="editorial-links-list__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="editorial-links-list__icon"><LinkIcon id={item.id} /></span>
                <div><h2>{item.label}</h2><p>{item.description}</p></div>
                <ArrowUpRight className="editorial-links-list__arrow" size={27} strokeWidth={1.25} aria-hidden="true" />
              </a>
            ) : (
              <div className="editorial-links-list__pending" key={item.id}>
                <span className="editorial-links-list__number">{String(index + 1).padStart(2, "0")}</span>
                <span className="editorial-links-list__icon"><LinkIcon id={item.id} /></span>
                <div><h2>{item.label}</h2><p>{item.description}</p></div>
                <span>Coming soon</span>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
