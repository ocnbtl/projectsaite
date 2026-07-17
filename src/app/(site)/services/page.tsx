import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { portfolioMedia } from "@/content/portfolio-media";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Work with Sage Burress for modeling, face painting, content creation, and travel collaborations.",
  alternates: { canonical: "/services" },
};

const serviceImages = [portfolioMedia[7], portfolioMedia[4], portfolioMedia[3], portfolioMedia[2]];

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-page-hero editorial-page-hero--services">
        <p>Services</p>
        <h1>Four ways to work together.</h1>
        <p>
          Each collaboration starts with the brief, intended use, timing, and the kind of presence the
          project needs.
        </p>
      </section>

      <section className="editorial-services-list" aria-label="Sage Burress services">
        {content.services.map((service, index) => {
          const media = serviceImages[index] ?? portfolioMedia[index];
          return (
            <article id={service.slug} className="editorial-service-detail" key={service.slug}>
              <div className="editorial-service-detail__number">{service.number}</div>
              <div className="editorial-service-detail__copy">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul>
                  {service.deliverables.map((deliverable) => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
                <Link href={`/contact?inquiry=${encodeURIComponent(service.title)}`}>
                  Ask about {service.title.toLowerCase()} <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <figure className="editorial-service-detail__image">
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                  sizes="(max-width: 799px) 100vw, 42vw"
                />
              </figure>
            </article>
          );
        })}
      </section>

      <section className="editorial-contact-callout">
        <p>Not sure where the project fits?</p>
        <h2>Start with the idea.</h2>
        <Link className="editorial-button" href="/contact">
          Contact Sage
        </Link>
      </section>
    </>
  );
}
