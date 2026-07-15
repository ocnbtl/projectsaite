import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/site/wordmark";
import type { SiteContent } from "@/lib/content";

export function SiteFooter({ social }: { social: SiteContent["social"] }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top container">
        <div>
          <Wordmark className="site-footer__wordmark" />
          <p>Creative work rooted in attention, warmth, and a clear point of view.</p>
        </div>

        <div className="site-footer__nav">
          <p className="ui-label">Explore</p>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="site-footer__nav">
          <p className="ui-label">Follow</p>
          {social.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom container">
        <p>© {new Date().getFullYear()} Sage Burress</p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/admin/login">Client workspace</Link>
        </div>
      </div>
    </footer>
  );
}
