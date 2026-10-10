import Image from "next/image";
import Link from "next/link";
import { StructuredData } from "@/components/site/structured-data";
import { getSiteContent } from "@/lib/content-store";
import { biography } from "@/lib/editorial-content";
import { pageMetadata } from "@/lib/search-metadata";
import { siteUrl } from "@/lib/site-url";

export const metadata = pageMetadata("About", "Meet Sage Burress: model, content creator and travel storyteller with a decade of experience, magazine publications and fashion-week runway work.", "/about");

export default async function AboutPage() {
  const content = await getSiteContent();
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "ProfilePage", "@id": `${siteUrl}/about#page`, url: `${siteUrl}/about`, name: "About Sage Burress", mainEntity: { "@id": `${siteUrl}/#sage` } }} />
      <article className="editorial-about">
        <div className="editorial-about__image"><Image src={content.about.image} alt={content.about.imageAlt} width={960} height={1200} sizes="(max-width: 759px) 90vw, 40vw" priority /></div>
        <div className="editorial-about__copy">
          <h1>{biography.title}</h1>
          <p>{biography.introduction}</p>
          <p>{biography.work}</p>
          <p>{biography.creative}</p>
          <p>{biography.local}</p>
          <p className="editorial-about__closing">{biography.closing}</p>
          <div className="editorial-about__links"><Link href="/contact">Work with Sage ↗</Link><Link href="/portfolio">Explore my portfolio ↗</Link><a href="https://www.heymantalent.com/t/sage-burress" target="_blank" rel="noreferrer">Agency profile &amp; credits ↗</a></div>
        </div>
      </article>
    </>
  );
}
