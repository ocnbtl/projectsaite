import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Work with Sage Burress for modeling, face painting, henna, makeup artistry, content creation, and travel collaborations.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--services">
        <h1>Bring the idea to life.</h1>
      </section>

      <section className="editorial-service-directory" aria-label="Sage Burress services">
        {content.services.map((service, index) => {
          const image = service.images.find((item) => item.src && !item.placeholder);
          return (
            <Link
              className={`editorial-service-directory__card editorial-service-card--${service.slug}`}
              href={`/services/${service.slug}`}
              key={service.slug}
            >
              <div className="editorial-service-directory__number">{service.number}</div>
              <div>
                <h2>{service.title}</h2>
                <p>{service.summary}</p>
                <span>Explore the service <span aria-hidden="true">↗</span></span>
              </div>
              {image ? (
                <figure>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 799px) 100vw, 32vw"
                  />
                </figure>
              ) : null}
            </Link>
          );
        })}
      </section>

      <section className="editorial-contact-callout">
        <p>Not sure where the project fits?</p>
        <h2>Start with the idea.</h2>
        <Link className="editorial-button" href="/contact">Contact Sage</Link>
      </section>
    </>
  );
}
