import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { portfolioPageProjects } from "@/content/portfolio-additions";
import { ReelShowcase } from "@/components/site/reel-showcase";
import { contentCreationReels, travelReels } from "@/content/service-reels";
import { seedContent, type Service, type SiteContent } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";
import { StructuredData } from "@/components/site/structured-data";
import { localServiceSlugs, serviceGuides, type ServiceFaq } from "@/lib/editorial-content";
import { pageMetadata } from "@/lib/search-metadata";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return seedContent.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) return {};
  const guide = serviceGuides[slug];
  return pageMetadata(guide?.title ?? service.title, guide?.description ?? service.summary, `/services/${service.slug}`);
}

function ServiceFaqAnswer({ faq }: { faq: ServiceFaq }) {
  if (!faq.link) return faq.answer;
  const index = faq.answer.indexOf(faq.link.text);
  if (index < 0) return faq.answer;
  return <>{faq.answer.slice(0, index)}<Link href={faq.link.href}>{faq.link.text}</Link>{faq.answer.slice(index + faq.link.text.length)}</>;
}

function ContentCreationShowcase() {
  return <ReelShowcase reels={contentCreationReels} />;
}

function ServiceGallery({ service, content }: { service: Service; content: SiteContent }) {
  if (service.slug === "modeling") {
    return (
      <section className="editorial-service-modeling-gallery" aria-label="Modeling portfolio">
        <PortfolioMosaic projects={portfolioPageProjects(content.projects)} eagerCount={4} />
      </section>
    );
  }

  if (service.slug === "content-creation") return <ContentCreationShowcase />;
  if (service.slug === "travel-collaborations") return <>
    <ReelShowcase reels={travelReels} />
    <section className="editorial-travel-photography" aria-label="Sage’s travel photography">
      <Image
        src="/media/services/travel-sage-lagoon.webp"
        alt="Turquoise lagoon, a palm-covered islet, and green mountain peaks beneath a cloudy sky."
        width={2400}
        height={1600}
        sizes="(max-width: 759px) calc(100vw - 36px), 44vw"
      />
      <Image
        src="/media/services/travel-sage-coast.webp"
        alt="A coastal road beside a calm lagoon, with palm trees and mountain peaks across the water."
        width={2400}
        height={1800}
        sizes="(max-width: 759px) calc(100vw - 36px), 44vw"
      />
    </section>
  </>;

  return (
    <section className={`editorial-service-gallery editorial-service-gallery--${service.slug}`} aria-label={`${service.title} examples`}>
      {service.images.map((image, index) =>
        image.placeholder || !image.src ? (
          <div className="editorial-service-gallery__placeholder" key={image.id}>
            <span>Image slot {String(index + 1).padStart(2, "0")}</span>
            <p>New client-approved work will be added here.</p>
          </div>
        ) : (
          <figure className={`editorial-service-gallery__image editorial-service-gallery__image--${index + 1}`} key={image.id}>
            <Image
              src={image.src}
              alt={image.alt}
              width={service.slug === "face-painting" ? 1600 : 1800}
              height={service.slug === "face-painting" ? 1600 : 2200}
              loading={index < 2 ? "eager" : "lazy"}
              sizes={service.slug === "henna" ? "(max-width: 759px) 34vw, 12vw" : "(max-width: 759px) 94vw, 46vw"}
            />
          </figure>
        ),
      )}
    </section>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) notFound();
  const guide = serviceGuides[slug];
  const local = localServiceSlugs.includes(slug);

  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${siteUrl}/services/${slug}#service`, name: service.title, description: guide?.description ?? service.summary, url: `${siteUrl}/services/${slug}`, provider: { "@id": `${siteUrl}/#${local ? "shenanigans" : "sage"}` }, ...(local ? { areaServed: [{ "@type": "City", name: "Cincinnati, Ohio" }, { "@type": "City", name: "Mason, Ohio" }] } : {}) }} />
      <section className={`editorial-service-page-hero editorial-service-page-hero--${service.slug}`}>
        <h1>{service.title}</h1>
        <div>
          <p>{service.description}</p>
          <Link href={`/contact?inquiry=${encodeURIComponent(service.title)}`}>
            Ask about {service.title.toLowerCase()} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <ServiceGallery service={service} content={content} />

      <section className="editorial-service-offerings" aria-labelledby="service-offerings-heading">
        <h2 id="service-offerings-heading">What I offer</h2>
        <ol>
          {service.deliverables.map((deliverable, index) => (
            <li key={deliverable}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{deliverable}</strong>
            </li>
          ))}
        </ol>
      </section>

      {guide && <section className="editorial-faq" aria-labelledby="service-faq-heading">
        <header><h2 id="service-faq-heading">A few useful answers.</h2></header>
        <div>{guide.faqs.map((faq, index) => <details key={faq.question} data-analytics-faq={index}><summary>{faq.question}<Plus className="editorial-faq__icon" size={18} aria-hidden="true" /></summary><p><ServiceFaqAnswer faq={faq} /></p></details>)}<Link className="editorial-faq__contact" href={`/contact?inquiry=${encodeURIComponent(service.title)}`}>Ask about your project ↗</Link></div>
      </section>}

      <section className="editorial-contact-callout">
        <p>Have something specific in mind?</p>
        <h2>Let’s make it happen.</h2>
        <Link className="editorial-button" href={`/contact?inquiry=${encodeURIComponent(service.title)}`}>
          Start a conversation
        </Link>
      </section>
    </>
  );
}
