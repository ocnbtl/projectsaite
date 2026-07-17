import Image from "next/image";
import Link from "next/link";

import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import { featuredBrands } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

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

      <section className="editorial-rail" aria-label="Featured clients and collaborators">
        <p>Featured by</p>
        <div className="editorial-rail__viewport">
          <div className="editorial-rail__track">
            {[...featuredBrands, ...featuredBrands].map((brand, index) => (
              <span className="editorial-brandmark" key={`${brand.name}-${index}`}>
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={220}
                    height={56}
                    className={brand.invert ? "is-inverted" : undefined}
                    sizes="220px"
                  />
                ) : (
                  <strong>{brand.name}</strong>
                )}
              </span>
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
