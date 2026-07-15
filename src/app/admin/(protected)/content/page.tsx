import { ContentEditor } from "@/components/admin/content-editor";
import { getContentEditingState, getSiteContentSnapshot } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const snapshot = await getSiteContentSnapshot();
  return <div className="admin-page"><header className="admin-page__heading"><div><p className="ui-label">Site content</p><h1>Keep the public story current.</h1><p>Edit the core words and imagery without touching the site code.</p></div></header><ContentEditor initialContent={snapshot.content} editingState={getContentEditingState(snapshot.source)} /></div>;
}
