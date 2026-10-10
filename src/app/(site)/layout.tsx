import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { AnalyticsConsent } from "@/components/site/analytics-consent";
import { getSiteContent } from "@/lib/content-store";
import { StructuredData } from "@/components/site/structured-data";
import { siteUrl } from "@/lib/site-url";

import "./editorial-site.css";

// HTML and Markdown share URLs. Next manages HTML's Vary header, so keep
// public HTML uncached to prevent intermediaries mixing representations.
export const dynamic = "force-dynamic";

export default async function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <div className="editorial-site">
      <StructuredData data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "Person", "@id": `${siteUrl}/#sage`, name: "Sage Burress", url: siteUrl, description: "Model, content creator and travel storyteller with a decade of modeling experience. Also the creative behind Sage’s Shenanigans in Cincinnati and Mason, Ohio.", jobTitle: "Model and content creator", sameAs: content.links.filter(link => link.active && ["instagram", "tiktok"].includes(link.id)).map(link => link.href) },
        { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Sage Burress", url: siteUrl, publisher: { "@id": `${siteUrl}/#sage` }, inLanguage: "en-US" },
        { "@type": "Organization", "@id": `${siteUrl}/#shenanigans`, name: "Sage’s Shenanigans", url: `${siteUrl}/about`, description: "Sage Burress’s makeup artistry, henna and face painting services in Cincinnati and Mason, Ohio.", founder: { "@id": `${siteUrl}/#sage` }, areaServed: ["Cincinnati, Ohio", "Mason, Ohio"], contactPoint: { "@type": "ContactPoint", contactType: "booking inquiries", email: content.contact.email, url: `${siteUrl}/contact` } },
      ] }} />
      <a className="editorial-skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader services={content.services} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter />
      <AnalyticsConsent environment={process.env.VERCEL_ENV ?? "local"} />
    </div>
  );
}
