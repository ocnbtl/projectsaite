import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

import "./editorial-site.css";

export default function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="editorial-site">
      <a className="editorial-skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
