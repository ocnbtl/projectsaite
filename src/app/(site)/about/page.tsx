import type { Metadata } from "next";
import { ArrowDownRight, Eye, Heart, Sparkles } from "lucide-react";
import Image from "next/image";

import { ContactCta } from "@/components/site/contact-cta";
import { Reveal } from "@/components/site/reveal";
import { SectionIntro } from "@/components/site/section-intro";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Sage Burress and the perspective behind her creative work.",
};

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="page-hero about-hero">
        <div className="container about-hero__grid">
          <div className="about-hero__copy">
            <p className="ui-label">About Sage</p>
            <h1>{content.about.title}</h1>
            <p>{content.about.intro}</p>
            <div className="about-hero__note">
              <span>Based in Ohio</span>
              <span>Available worldwide</span>
            </div>
          </div>
          <div className="about-hero__portrait">
            <Image src={content.about.image} alt={content.about.imageAlt} fill priority sizes="(max-width: 800px) 100vw, 44vw" />
            <span className="about-hero__portrait-index">01 / 03</span>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story__grid">
          <Reveal>
            <SectionIntro index="01" label="The practice" title="Experience creates range. Curiosity keeps the work specific." />
          </Reveal>
          <Reveal className="about-story__body">
            <p>{content.about.story}</p>
            <p>
              Sage is most useful early in the process, when the brief still has room to become more human. She can help shape what should be made, not only arrive to execute it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <p className="ui-label">How the work feels</p>
          <div className="about-principles__grid">
            <Reveal className="principle">
              <Eye size={24} />
              <span>01</span>
              <h2>Observant</h2>
              <p>Look closely first. The useful detail is often the one a generic brief leaves out.</p>
            </Reveal>
            <Reveal className="principle">
              <Heart size={24} />
              <span>02</span>
              <h2>Human</h2>
              <p>Professional does not need to feel distant. Good work makes people feel understood.</p>
            </Reveal>
            <Reveal className="principle">
              <Sparkles size={24} />
              <span>03</span>
              <h2>Considered</h2>
              <p>Every visual choice should support the story, the setting, or the action you want next.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-map">
        <div className="container about-map__grid">
          <div className="about-map__image">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=88"
              alt="Fashion editorial placeholder"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
            />
          </div>
          <div className="about-map__content">
            <p className="ui-label">Where the work meets</p>
            <h2>People, places, and stories worth noticing.</h2>
            <div className="about-map__list">
              {content.services.map((service) => (
                <div key={service.slug}>
                  <span>{service.number}</span>
                  <p>{service.title}</p>
                  <ArrowDownRight size={17} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCta title="Bring Sage into the idea early." copy="The best fit is a project that values both polish and perspective, with enough room to shape something memorable together." tone="olive" />
    </>
  );
}
