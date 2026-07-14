import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/site/wordmark";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Links" };

export default async function LinksPage() {
  const content = await getSiteContent();
  return (
    <div className="links-page">
      <div className="links-page__inner">
        <h1 className="sr-only">Sage Burress links</h1>
        <Wordmark />
        <p>{content.hero.kicker}</p>
        <nav aria-label="Sage Burress links">
          <Link href="/portfolio"><span>View portfolio</span><ArrowUpRight size={18} /></Link>
          <Link href="/services"><span>Services and collaborations</span><ArrowUpRight size={18} /></Link>
          <Link href="/contact"><span>Start an inquiry</span><ArrowUpRight size={18} /></Link>
          {content.social.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              <span>{item.label}<small>{item.handle}</small></span><ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
