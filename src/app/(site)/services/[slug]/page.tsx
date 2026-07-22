import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { seedContent, type Service, type SiteContent } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const contentCreationReels = [
  {
    id: "fourth-of-july-makeup",
    title: "Fourth of July makeup reel",
    href: "https://www.instagram.com/reel/C9ArW7Wp2zF/",
    embed: "https://www.instagram.com/reel/C9ArW7Wp2zF/embed/",
  },
  {
    id: "outfit-walk",
    title: "Outfit and movement reel",
    href: "https://www.instagram.com/reel/C9Pt9GdujsC/",
    embed: "https://www.instagram.com/reel/C9Pt9GdujsC/embed/",
  },
];

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
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

function ContentCreationShowcase() {
  return (
    <section className="editorial-reel-showcase" aria-labelledby="reel-showcase-heading">
      <header>
        <div>
          <p>Selected social work</p>
          <h2 id="reel-showcase-heading">Reels in motion.</h2>
        </div>
        <a href="https://www.instagram.com/sage_burress/" target="_blank" rel="noopener noreferrer">
          Follow on Instagram <span aria-hidden="true">↗</span>
        </a>
      </header>
      <div className="editorial-reel-showcase__viewport" tabIndex={0} aria-label="Scrollable Instagram reel showcase">
        {contentCreationReels.map((reel) => (
          <article className="editorial-reel-phone" key={reel.id}>
            <div className="editorial-reel-phone__speaker" aria-hidden="true" />
            <iframe
              src={reel.embed}
              title={reel.title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <a href={reel.href} target="_blank" rel="noopener noreferrer">
              Open reel on Instagram <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
        <a className="editorial-reel-showcase__more" href="https://www.instagram.com/sage_burress/reels/" target="_blank" rel="noopener noreferrer">
          <span>More reels</span>
          <strong>Keep watching on Instagram.</strong>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="editorial-reel-showcase__hint">Swipe or scroll to move through the reels.</p>
    </section>
  );
}

function ServiceGallery({ service, content }: { service: Service; content: SiteContent }) {
  if (service.slug === "modeling") {
    return (
      <section className="editorial-service-modeling-gallery" aria-label="Modeling portfolio">
        <PortfolioMosaic projects={content.projects} eagerCount={4} />
      </section>
    );
  }

  if (service.slug === "content-creation") return <ContentCreationShowcase />;

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
              sizes="(max-width: 759px) 94vw, 46vw"
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

  return (
    <>
      <section className={`editorial-service-page-hero editorial-service-page-hero--${service.slug}`}>
        <p>{service.number} / Service</p>
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
