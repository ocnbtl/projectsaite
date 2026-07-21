import type { Metadata } from "next";
import Link from "next/link";

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

export default async function LinksPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--links">
        <h1>Find what I’m sharing.</h1>
      </section>

      <section className="editorial-links-page" aria-label="Sage Burress links">
        <div className="editorial-links-page__intro">
          <p>Storefronts, recommendations, and places to follow along.</p>
        </div>
        <div className="editorial-links-list">
          {content.links.map((item, index) => {
            const href = item.active ? getExternalHref(item.href) : null;
            return href ? (
              <a href={href} key={item.id} target="_blank" rel="noopener noreferrer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{item.label}</h2><p>{item.description}</p></div>
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <div className="editorial-links-list__pending" key={item.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{item.label}</h2><p>{item.description}</p></div>
                <span>Coming soon</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="editorial-contact-callout">
        <p>Partnership inquiries</p>
        <h2>Let’s work together.</h2>
        <Link className="editorial-button" href="/contact">Contact Sage</Link>
      </section>
    </>
  );
}
