import { LinksManager } from "@/components/admin/links-manager";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const content = await getSiteContent();
  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__heading">
        <div><p className="ui-label">Links and brands</p><h1>Keep every public connection in one place.</h1><p>Publish storefront links and maintain the home-page collaborator rail.</p></div>
      </header>
      <LinksManager initialContent={content} />
    </div>
  );
}
