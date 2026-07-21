"use client";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Home,
  Link2,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { Wordmark } from "@/components/site/wordmark";

const navGroups = [
  { label: "Publish", items: [
    { href: "/admin", label: "Overview", icon: Home },
    { href: "/admin/content", label: "Home and contact", icon: FileText },
    { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
    { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
    { href: "/admin/links", label: "Links and brands", icon: Link2 },
  ] },
  { label: "Tools", items: [
    { href: "/admin/pitch-kit", label: "Pitch kit", icon: Sparkles },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ] },
  { label: "Reference", items: [
    { href: "/admin/style-guide", label: "Style guide", icon: BookOpen },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ] },
];

const navItems = navGroups.flatMap((group) => group.items);

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = navItems.find((item) => pathname === item.href)?.label ?? "Admin";

  return (
    <div className="admin-shell">
      <header className="admin-mobile-header">
        <Wordmark compact />
        <button
          type="button"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <aside id="admin-sidebar" className={`admin-sidebar${open ? " is-open" : ""}`}>
        <Link className="admin-sidebar__brand" href="/admin" onClick={() => setOpen(false)}>
          <Wordmark compact />
          <span>Studio</span>
        </Link>
        <nav aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div className="admin-sidebar__group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} className={active ? "is-active" : ""} onClick={() => setOpen(false)}>
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <Link href="/" target="_blank">View live site</Link>
          <form action="/api/admin/logout" method="post">
            <button type="submit"><LogOut size={16} />Sign out</button>
          </form>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-main__bar">
          <p>{current}</p>
          <span>Private workspace</span>
        </div>
        {children}
      </main>
    </div>
  );
}
