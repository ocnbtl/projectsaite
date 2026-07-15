import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter social={content.social} />
    </>
  );
}
