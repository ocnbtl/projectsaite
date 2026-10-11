import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HeroIntro } from "@/components/site/hero-intro";
import { HomepageMotion } from "@/components/site/homepage-motion";
import { BrandRailMotion } from "@/components/site/brand-rail-motion";
import { PortfolioMosaic } from "@/components/site/portfolio-mosaic";
import type { FeaturedBrand } from "@/lib/content";
import { getSiteContent } from "@/lib/content-store";
import { openGraphShareImage, twitterShareImage } from "@/lib/social-metadata";
import { siteUrl } from "@/lib/site-url";
import { homeCredibilityLines } from "@/lib/editorial-content";
import { brandMedia } from "@/content/brand-media";

export const dynamic = "force-dynamic";

function FeaturedBrandMark({ brand, duplicate }: { brand: FeaturedBrand; duplicate: boolean }) {
  const dimensions = brand.logo ? brandMedia[brand.logo] : undefined;
  const isDefaultRebel = brand.id === "rebel-magazine" && brand.logo === "/media/brands/rebel-magazine.svg";
  const isDefaultBlackOpal = brand.id === "black-opal-aesthetics" && brand.logo === "/media/brands/black-opal-aesthetics.svg";
  const isDefaultWoodenCask = brand.id === "wooden-cask" && brand.logo === "/media/brands/wooden-cask.webp";
  const isDefaultRedLight = brand.id === "red-light-method" && brand.logo === "/media/brands/red-light-method.svg";
  const isDefaultRomantic = brand.id === "romantic-adventure-getaways" && brand.logo === "/media/brands/romantic-adventure-getaways.svg";
  const isDefaultHeyman = brand.id === "heyman-talent" && brand.logo === "/media/brands/heyman-talent-symbol.png";

  return (
    <span
      className={`editorial-brandmark editorial-brandmark--${brand.id}`}
      role={duplicate ? undefined : "img"}
      aria-label={duplicate ? undefined : brand.name}
      aria-hidden={duplicate || undefined}
    >
      {isDefaultHeyman ? (
        <span className="editorial-brandmark__heyman" aria-hidden="true">
          <Image src="/media/brands/heyman-talent-symbol.png" alt="" width={275} height={275} sizes="46px" loading="eager" />
          <Image className="editorial-brandmark__heyman-wordmark" src="/media/brands/heyman-talent-wordmark.png" alt="" width={433} height={46} sizes="160px" loading="eager" />
        </span>
      ) : isDefaultRebel ? (
        <strong className="editorial-brandmark__rebel" aria-hidden="true">REBEL</strong>
      ) : isDefaultBlackOpal ? (
        <span className="editorial-brandmark__black-opal" aria-hidden="true">
          <strong>BLACK OPAL ESTHETICS</strong>
          <small>BY KATE BRADY</small>
        </span>
      ) : isDefaultWoodenCask ? (
        <span className="editorial-brandmark__wooden-cask" aria-hidden="true">
          <Image src={brand.logo ?? "/media/brands/wooden-cask.webp"} alt="" width={500} height={500} sizes="48px" loading="eager" />
          <span><strong>WOODEN CASK</strong><small>BREWING COMPANY</small></span>
        </span>
      ) : isDefaultRedLight ? (
        <span className="editorial-brandmark__red-light" aria-hidden="true">
          <Image src={brand.logo ?? "/media/brands/red-light-method.svg"} alt="" width={682} height={152} sizes="220px" loading="eager" />
          <small>MONTGOMERY</small>
        </span>
      ) : isDefaultRomantic ? (
        <strong className="editorial-brandmark__romantic" aria-hidden="true">Romantic Adventure Getaways</strong>
      ) : brand.logo ? (
        <Image
          src={brand.logo}
          alt=""
          width={dimensions?.width ?? 220}
          height={dimensions?.height ?? 56}
          className={brand.invert ? "is-inverted" : undefined}
          loading="eager"
          sizes="220px"
        />
      ) : (
        <strong aria-hidden="true">{brand.name}</strong>
      )}
    </span>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = `${content.hero.title} | Model & Creative`;

  return {
    description: content.hero.lead,
    openGraph: {
      type: "website",
      url: siteUrl,
      locale: "en_US",
      siteName: "Sage Burress",
      title,
      description: content.hero.lead,
      images: [openGraphShareImage],
    },
    twitter: {
      card: "summary",
      title,
      description: content.hero.lead,
      images: [twitterShareImage],
    },
  };
}

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <div className="editorial-hero__identity">
            <HeroIntro kicker={content.hero.kicker} title={content.hero.title} />
          </div>

          <div className="editorial-hero__services" aria-label="Services">
            {content.services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
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
        <div className="editorial-hero__about">
          <p>{homeCredibilityLines.map((line, index) => <span key={line}>{index > 0 && " "}{line}</span>)}</p>
          <Link href="/about"><span className="editorial-hero__about-label">More about my work</span><span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="editorial-rail" aria-label="Selected work, publications and runway experience">
        <div className="editorial-rail__viewport" tabIndex={0} role="group" aria-label="Selected credits; scroll horizontally when motion is reduced">
          <div className="editorial-rail__track">
            {[0, 1, 2].map((setIndex) => content.featuredBrands.map((brand) => (
              <FeaturedBrandMark
                brand={brand}
                duplicate={setIndex !== 1}
                key={`${brand.id}-${setIndex}`}
              />
            )))}
          </div>
        </div>
        <BrandRailMotion />
      </section>

      <section className="editorial-portfolio-preview" aria-labelledby="home-portfolio-heading">
        <header data-home-reveal="portfolio-heading">
          <h2 id="home-portfolio-heading">Portfolio</h2>
        </header>
        <PortfolioMosaic projects={content.projects} revealOnScroll />
        <div className="editorial-section-link" data-home-reveal="portfolio-link">
          <Link className="editorial-button" href="/portfolio">
            View the portfolio
          </Link>
        </div>
      </section>

      <section className="editorial-service-index" aria-labelledby="home-services-heading">
        <div className="editorial-service-index__heading" data-home-reveal="service-heading">
          <h2 id="home-services-heading">Services</h2>
        </div>
        <div className="editorial-service-index__grid">
          {content.services.map((service) => (
            <Link
              className={`editorial-service-card editorial-service-card--${service.slug}`}
              data-home-reveal="service-card"
              key={service.slug}
              href={`/services/${service.slug}`}
            >
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-contact-callout" data-home-reveal="contact-callout">
        <p>Have a project in mind?</p>
        <h2>Let’s work together.</h2>
        <Link className="editorial-button" href="/contact">
          Work with Sage
        </Link>
      </section>

      <HomepageMotion />
    </>
  );
}
