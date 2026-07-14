import { CheckCircle2, CircleAlert, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

function Status({ ready }: { ready: boolean }) {
  return ready ? <span className="integration-status is-ready"><CheckCircle2 size={16} />Ready</span> : <span className="integration-status"><CircleAlert size={16} />Needs setup</span>;
}

export default function AdminSettingsPage() {
  const integrations = [
    { name: "Admin access", description: "Password and signed owner session", ready: Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET), href: "https://vercel.com/docs/projects/environment-variables" },
    { name: "Content storage", description: "Vercel Blob for editable site content", ready: Boolean(process.env.BLOB_READ_WRITE_TOKEN), href: "https://vercel.com/docs/storage/vercel-blob" },
    { name: "Contact delivery", description: "Resend delivery to contact@sageburress.com", ready: Boolean(process.env.RESEND_API_KEY), href: "https://resend.com/docs" },
    { name: "Website analytics", description: "Vercel Analytics component", ready: true, href: "https://vercel.com/docs/analytics" },
  ];
  return (
    <div className="admin-page">
      <header className="admin-page__heading"><div><p className="ui-label">Settings</p><h1>Launch connections and ownership.</h1><p>Sage owns the service accounts. Environment values remain private in Vercel.</p></div></header>
      <section className="integration-list">
        {integrations.map((item) => <article key={item.name}><div><h2>{item.name}</h2><p>{item.description}</p></div><Status ready={item.ready} /><a href={item.href} target="_blank" rel="noreferrer" title={`Open ${item.name} documentation`}><ExternalLink size={18} /></a></article>)}
      </section>
      <section className="admin-note"><p className="ui-label">Production domain</p><h2>sageburress.com</h2><p>Connect the apex and www domains only after final photography, email delivery, owner login, and portfolio content have been verified on the Vercel preview.</p></section>
    </div>
  );
}
