import Image from "next/image";
import Link from "next/link";

import { publicNavigation } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";

export async function SiteFooter() {
  const content = await getSiteContent();
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
        <div className="editorial-footer__contact">
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <p>© {new Date().getFullYear()} Sage Burress</p>
        </div>
        <div className="editorial-footer__meta">
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link className="editorial-footer__privacy-choices" href="/privacy#settings">
              Your Privacy Choices
              <Image src="/california-privacy-choices.svg" width={30} height={14} alt="" unoptimized />
            </Link>
            <Link href="/admin/login">Admin</Link>
          </div>
          <p>Website by Madagin</p>
        </div>
      </div>
    </footer>
  );
}
