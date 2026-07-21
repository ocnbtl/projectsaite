import { ServiceManager } from "@/components/admin/service-manager";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const content = await getSiteContent();
  return (
    <div className="admin-page admin-page--wide">
      <header className="admin-page__heading">
        <div><p className="ui-label">Services</p><h1>Keep every offer clear and current.</h1><p>Edit each service page, its home-page summary, and the work shown with it.</p></div>
      </header>
      <ServiceManager initialContent={content} />
    </div>
  );
}
