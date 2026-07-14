import { ArrowUpRight, BarChart3, FileText, FolderKanban, Sparkles } from "lucide-react";
import Link from "next/link";

import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const content = await getSiteContent();
  const cards = [
    { href: "/admin/content", title: "Update site copy", detail: "Home, About, and contact messaging", icon: FileText },
    { href: "/admin/portfolio", title: "Manage portfolio", detail: `${content.projects.length} published projects`, icon: FolderKanban },
    { href: "/admin/pitch-kit", title: "Create a pitch", detail: "Six tailored partnership templates", icon: Sparkles },
    { href: "/admin/analytics", title: "Review analytics", detail: "Traffic and deployment reporting", icon: BarChart3 },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page__heading admin-overview__heading">
        <div><p className="ui-label">Studio overview</p><h1>Everything important, close at hand.</h1></div>
        <Link className="button button--outline" href="/" target="_blank">View website<ArrowUpRight size={17} /></Link>
      </header>
      <section className="admin-stat-row">
        <div><span>Published work</span><strong>{content.projects.length}</strong></div>
        <div><span>Service areas</span><strong>{content.services.length}</strong></div>
        <div><span>Contact destination</span><strong className="admin-stat-row__email">{content.contact.email}</strong></div>
      </section>
      <section className="admin-action-grid">
        {cards.map((card) => { const Icon = card.icon; return (
          <Link href={card.href} key={card.href}>
            <Icon size={21} />
            <div><h2>{card.title}</h2><p>{card.detail}</p></div>
            <ArrowUpRight size={18} />
          </Link>
        ); })}
      </section>
      <section className="admin-note">
        <p className="ui-label">Recommended next step</p>
        <h2>Replace staging photography with Sage&apos;s final portfolio selections.</h2>
        <p>The structure is ready. Use Portfolio and Site Content to add the approved images and final project details before connecting the production domain.</p>
      </section>
    </div>
  );
}
