import Image from "next/image";
import Link from "next/link";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  const railItems = content.featuredBy.length
    ? content.featuredBy
    : content.services.map((service) => service.title);

  return (
    <>
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <p className="editorial-hero__intro">Hi, my name is</p>
          <h1>
            <span>Sage</span>
            <span>Burress</span>
          </h1>

          <div className="editorial-hero__services" aria-label="Services">
            {content.services.map((service) => (
              <Link key={service.slug} href={`/services#${service.slug}`}>
                <span>{service.title}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <Link className="editorial-button" href="/contact">
            Work with Sage
          </Link>
        </div>

        <div className="editorial-hero__image">
          <Image
            src={content.hero.image}
            alt={content.hero.imageAlt}
            fill
            priority
            loading="eager"
            sizes="(max-width: 759px) 86vw, 48vw"
          />
        </div>
      </section>

      <section className="editorial-rail" aria-label={content.featuredBy.length ? "Featured by" : "Creative work across"}>
        <p>{content.featuredBy.length ? "Featured by" : "Creative work across"}</p>
        <div className="editorial-rail__viewport">
          <div className="editorial-rail__track">
            {[...railItems, ...railItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-portfolio-preview" aria-labelledby="home-portfolio-heading">
        <header>
          <h2 id="home-portfolio-heading">Portfolio</h2>
        </header>
        <PortfolioMosaic projects={content.projects} />
        <div className="editorial-section-link">
          <Link className="editorial-button" href="/portfolio">
            View the portfolio
          </Link>
        </div>
      </section>

      <section className="editorial-service-index" aria-labelledby="home-services-heading">
        <div className="editorial-service-index__heading">
          <p>Ways to work together</p>
          <h2 id="home-services-heading">Services</h2>
        </div>
        <div className="editorial-service-index__grid">
          {content.services.map((service) => (
            <Link key={service.slug} href={`/services#${service.slug}`}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-contact-callout">
        <p>Have a project in mind?</p>
        <h2>Let’s work together.</h2>
        <Link className="editorial-button" href="/contact">
          Work with Sage
        </Link>
      </section>
    </>
  );
}
