import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { ReelShowcase } from "@/components/site/reel-showcase";
import { seedContent, type Service, type SiteContent } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const contentCreationReels = [
  {
    id: "vacation-pose-ideas",
    title: "Vacation photo pose ideas",
    href: "https://www.instagram.com/sage_burress/reel/Da3XPT1pm-w/",
    embed: "https://www.instagram.com/reel/Da3XPT1pm-w/embed/",
  },
  {
    id: "beach-day-grwm",
    title: "Beach-day GRWM",
    href: "https://www.instagram.com/sage_burress/reel/DbBBnLaxJVK/",
    embed: "https://www.instagram.com/reel/DbBBnLaxJVK/embed/",
  },
  {
    id: "runway-walk",
    title: "Runway walk reel",
    href: "https://www.instagram.com/sage_burress/reel/DNTjfV4p1Mh/",
    embed: "https://www.instagram.com/reel/DNTjfV4p1Mh/embed/",
  },
  {
    id: "vanlife-story",
    title: "Vanlife storytelling reel",
    href: "https://www.instagram.com/sage_burress/reel/DaGrAJgpGwr/",
    embed: "https://www.instagram.com/reel/DaGrAJgpGwr/embed/",
  },
  {
    id: "cayman-dinner-grwm",
    title: "Cayman Islands dinner GRWM",
    href: "https://www.instagram.com/sage_burress/reel/DaynlZrpXuQ/",
    embed: "https://www.instagram.com/reel/DaynlZrpXuQ/embed/",
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
  return <ReelShowcase reels={contentCreationReels} />;
}

function TravelPromotionsShowcase({ service }: { service: Service }) {
  return (
    <>
      <section className="editorial-travel-collage" aria-label="Travel promotion photography">
        {service.images.map((image, index) => (
          <figure key={image.id}>
            <Image
              src={image.src}
              alt={image.alt}
              width={index === 2 ? 1536 : 1120}
              height={index === 2 ? 1024 : 1400}
              loading={index < 2 ? "eager" : "lazy"}
              sizes="(max-width: 759px) 92vw, 48vw"
            />
          </figure>
        ))}
      </section>
    </>
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
  if (service.slug === "travel-collaborations") return <TravelPromotionsShowcase service={service} />;

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
