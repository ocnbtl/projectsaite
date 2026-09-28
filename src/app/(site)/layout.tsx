import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { AnalyticsConsent } from "@/components/site/analytics-consent";
import { getSiteContent } from "@/lib/content-store";

import "./editorial-site.css";

export default async function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <div className="editorial-site">
      <a className="editorial-skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader services={content.services} />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <AnalyticsConsent environment={process.env.VERCEL_ENV ?? "local"} />
    </div>
  );
}
