import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { seedContent } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";

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
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
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
                sizes="(max-width: 759px) 100vw, 34vw"
              />
            </figure>
          ),
        )}
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
