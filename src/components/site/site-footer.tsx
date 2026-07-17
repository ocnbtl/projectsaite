import Link from "next/link";

import { publicNavigation } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="editorial-footer">
      <div className="editorial-footer__top">
        <Link className="editorial-brand" href="/">
          Sage Burress
        </Link>
        <nav aria-label="Footer navigation">
          {publicNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="editorial-footer__bottom">
        <p>© {new Date().getFullYear()} Sage Burress</p>
        <div>
          <a href="mailto:contact@sageburress.com">contact@sageburress.com</a>
          <Link href="/privacy">Privacy</Link>
          <Link href="/admin/login">Client workspace</Link>
        </div>
      </div>
    </footer>
  );
}
