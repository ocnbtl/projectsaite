import type { Metadata } from "next";
import Link from "next/link";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected portrait, beauty, fashion, studio, and athletic work by Sage Burress.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--portfolio">
        <h1>Portfolio</h1>
      </section>

      <section className="editorial-portfolio-page" aria-label="Sage Burress portfolio">
        <PortfolioMosaic projects={content.projects} showCaptions />
      </section>

      <section className="editorial-contact-callout editorial-contact-callout--portfolio">
        <h2>Let’s make something memorable.</h2>
        <Link className="editorial-button" href="/contact">
          Work with Sage
        </Link>
      </section>
    </>
  );
}
