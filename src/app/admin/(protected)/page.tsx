import { ArrowUpRight, BriefcaseBusiness, FileText, FolderKanban, Link2 } from "lucide-react";
import Link from "next/link";

import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const content = await getSiteContent();
  const rows = [
    { href: "/admin/content", title: "Home and contact", detail: "Core public copy and hero image", icon: FileText },
    { href: "/admin/services", title: "Services", detail: `${content.services.length} service pages and galleries`, icon: BriefcaseBusiness },
    { href: "/admin/portfolio", title: "Portfolio", detail: `${content.projects.length} public images`, icon: FolderKanban },
    { href: "/admin/links", title: "Links and brands", detail: `${content.links.length} links and ${content.featuredBrands.length} featured brands`, icon: Link2 },
  ];

  return (
    <div className="admin-page">
      <header className="admin-page__heading admin-overview__heading">
        <div><p className="ui-label">Studio overview</p><h1>Everything important, close at hand.</h1></div>
        <Link className="button button--outline" href="/" target="_blank">View website<ArrowUpRight size={17} /></Link>
      </header>
      <section className="admin-publication-board" aria-labelledby="publication-board-title">
        <header><div><p className="ui-label">Publication desk</p><h2 id="publication-board-title">The public site, route by route.</h2></div><span>{content.services.length} services</span></header>
        {rows.map((row) => { const Icon = row.icon; return (
          <Link href={row.href} key={row.href}>
            <Icon size={20} />
            <div><h3>{row.title}</h3><p>{row.detail}</p></div>
            <ArrowUpRight size={18} />
          </Link>
        ); })}
      </section>
      <section className="admin-note">
        <p className="ui-label">Recommended next step</p>
        <h2>Keep the portfolio and booking details current.</h2>
        <p>Use Services to keep each gallery current, and Links and Brands to manage storefronts, profiles, and featured collaborators.</p>
      </section>
    </div>
  );
}
