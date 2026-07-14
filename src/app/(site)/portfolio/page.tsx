import type { Metadata } from "next";

import { ContactCta } from "@/components/site/contact-cta";
import { PortfolioExplorer } from "@/components/site/portfolio-explorer";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected modeling, content, hospitality, scouting, and artistry work by Sage Burress.",
};

export default async function PortfolioPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero portfolio-hero">
        <div className="container portfolio-hero__grid">
          <p className="ui-label">Selected work</p>
          <h1>Stories with a sense of place, purpose, and personality.</h1>
          <p>Browse the work by discipline, then open a project for the thinking and context behind it.</p>
        </div>
      </section>
      <section className="portfolio-browser">
        <div className="container">
          <PortfolioExplorer projects={content.projects} />
        </div>
      </section>
      <ContactCta title="Have a brief that does not fit a label?" copy="That is usually a good reason to talk. Sage can help shape a custom scope across disciplines." tone="cream" />
    </>
  );
}
