import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ButtonLink } from "@/components/site/button-link";
import { ContactCta } from "@/components/site/contact-cta";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { Wordmark } from "@/components/site/wordmark";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  const featured = content.projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <div className="home-hero__content-inner">
            <p className="home-hero__kicker">{content.hero.kicker}</p>
            <Wordmark className="home-hero__wordmark" />
            <p className="home-hero__lead">{content.hero.lead}</p>
            <div className="home-hero__actions">
              <ButtonLink href="/contact" variant="light">
                Work With Sage
              </ButtonLink>
              <ButtonLink href="/portfolio" variant="outline">
                View portfolio
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="home-hero__media">
          <Image src={content.hero.image} alt={content.hero.imageAlt} fill priority sizes="(max-width: 800px) 100vw, 48vw" />
          <div className="home-hero__media-note">
            <span>Independent creative</span>
            <span>Available worldwide</span>
          </div>
        </div>

        <a href="#practice" className="home-hero__scroll" aria-label="Continue to the next section">
          <ArrowDown size={17} />
        </a>
      </section>

      <section id="practice" className="practice-intro">
        <div className="container practice-intro__grid">
          <Reveal>
            <p className="ui-label">One creative practice</p>
            <h1>Different disciplines. One clear point of view.</h1>
          </Reveal>
          <Reveal className="practice-intro__copy">
            <p>
              Sage works across modeling, content, scouting, artistry, and hospitality. Each project starts with close attention to the audience and ends with work that feels specific to the place, person, or brand.
            </p>
            <Link href="/about" className="text-link">
              Meet Sage <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="service-index">
        <div className="container">
          <SectionIntro
            index="01"
            label="Ways to work together"
            title="A flexible creative partner, not a one-size-fits-all package."
          />

          <div className="service-index__list">
            {content.services.map((service) => (
              <Reveal key={service.slug}>
                <Link href={`/services#${service.slug}`} className={`service-row service-row--${service.accent}`}>
                  <span className="service-row__number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <span className="service-row__arrow" aria-hidden="true">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured[0] ? (
        <section className="featured-stage">
          <div className="featured-stage__backdrop">
            <Image src={featured[0].image} alt="" fill sizes="100vw" aria-hidden="true" />
          </div>
          <div className="container featured-stage__frame">
            <div className="frame-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
              <p>Selected work / 2025-2026</p>
            </div>

            <div className="featured-stage__content">
              <div className="featured-stage__story">
                <p className="ui-label">Featured project</p>
                <h2>{featured[0].title}</h2>
                <p>{featured[0].summary}</p>
                <div className="featured-stage__meta">
                  <span>{featured[0].category}</span>
                  <span>{featured[0].location}</span>
                  <span>{featured[0].year}</span>
                </div>
                <ButtonLink href={`/portfolio/${featured[0].slug}`} variant="dark">
                  View story
                </ButtonLink>
              </div>

              <Link href={`/portfolio/${featured[0].slug}`} className="featured-stage__primary-image">
                <Image src={featured[0].image} alt={featured[0].alt} fill sizes="(max-width: 900px) 100vw, 48vw" />
              </Link>

              <div className="featured-stage__rail">
                {featured.slice(1).map((project, index) => (
                  <Link href={`/portfolio/${project.slug}`} key={project.slug} className="featured-stage__thumb">
                    <Image src={project.image} alt={project.alt} fill sizes="180px" />
                    <span>0{index + 2}</span>
                    <p>{project.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="work-sampler">
        <div className="container">
          <SectionIntro
            index="02"
            label="Portfolio"
            title="Work that makes the experience easier to see and feel."
            copy="Campaigns, stays, portraits, events, and creative partnerships, assembled with enough context to understand the thinking behind the images."
          />

          <div className="work-sampler__grid">
            {content.projects.slice(0, 5).map((project, index) => (
              <Reveal key={project.slug} className={`work-tile work-tile--${index + 1}`}>
                <Link href={`/portfolio/${project.slug}`}>
                  <div className="work-tile__image">
                    <Image src={project.image} alt={project.alt} fill sizes="(max-width: 800px) 100vw, 40vw" />
                  </div>
                  <div className="work-tile__caption">
                    <div>
                      <p className="ui-label">{project.category}</p>
                      <h3>{project.title}</h3>
                    </div>
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="work-sampler__footer">
            <ButtonLink href="/portfolio" variant="outline">
              Explore all work
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="availability-strip" aria-label="Available services">
        <div className="availability-strip__track">
          {[...content.services, ...content.services].map((service, index) => (
            <span key={`${service.slug}-${index}`}>{service.shortTitle}</span>
          ))}
        </div>
      </section>

      <ContactCta
        title="A good collaboration starts with a clear conversation."
        copy="Share the idea, the audience, the location, and the timing. Sage will respond with availability and a useful next step."
        tone="cream"
      />
    </>
  );
}
