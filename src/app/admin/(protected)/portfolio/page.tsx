import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { getContentEditingState, getSiteContentSnapshot } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const snapshot = await getSiteContentSnapshot();
  return <div className="admin-page"><header className="admin-page__heading"><div><p className="ui-label">Portfolio</p><h1>Shape the work visitors see.</h1><p>Reorder, revise, feature, or remove public projects.</p></div></header><PortfolioManager initialContent={snapshot.content} editingState={getContentEditingState(snapshot.source)} /></div>;
}
