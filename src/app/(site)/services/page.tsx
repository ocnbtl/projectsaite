import type { Metadata } from "next";
import { Check, MoveDown } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/site/button-link";
import { ContactCta } from "@/components/site/contact-cta";
import { Reveal } from "@/components/site/reveal";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Modeling, content creation, scouting, face painting, and hospitality collaborations with Sage Burress.",
};

const serviceImages = [
  "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=88",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=88",
];

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero services-hero">
        <div className="container services-hero__grid">
          <div>
            <p className="ui-label">Services</p>
            <h1>Built around the story, not a rigid package.</h1>
          </div>
          <div className="services-hero__aside">
            <p>
              Choose one discipline or combine several into a more complete collaboration. Every scope is shaped around the audience, usage, timing, and setting.
            </p>
            <a href="#service-list" aria-label="Explore services">
              <MoveDown size={20} />
            </a>
          </div>
        </div>
      </section>

      <section id="service-list" className="services-list">
        {content.services.map((service, index) => (
          <article id={service.slug} key={service.slug} className={`service-detail service-detail--${service.accent}`}>
            <div className="container service-detail__grid">
              <Reveal className="service-detail__number">
                <span>{service.number}</span>
                <p className="ui-label">{service.shortTitle}</p>
              </Reveal>
              <Reveal className="service-detail__content">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={16} aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={`/contact?inquiry=${encodeURIComponent(service.title)}`} variant="outline">
                  Ask about {service.shortTitle.toLowerCase()}
                </ButtonLink>
              </Reveal>
              <Reveal className="service-detail__media">
                <Image src={serviceImages[index]} alt={`${service.title} editorial placeholder`} fill sizes="(max-width: 800px) 100vw, 36vw" />
              </Reveal>
            </div>
          </article>
        ))}
      </section>

      <ContactCta title="Need more than one deliverable?" copy="Sage can combine modeling, content, and location storytelling into one coordinated scope with clear usage and handoff." tone="cocoa" />
    </>
  );
}
