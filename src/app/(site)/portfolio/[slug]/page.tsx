import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/site/button-link";
import { ContactCta } from "@/components/site/contact-cta";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const project = content.projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.summary } : { title: "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getSiteContent();
  const project = content.projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const nextProject = content.projects[(content.projects.indexOf(project) + 1) % content.projects.length];

  return (
    <>
      <article className="case-study">
        <header className="case-study__hero">
          <div className="case-study__image">
            <Image src={project.image} alt={project.alt} fill priority sizes="100vw" />
          </div>
          <div className="container case-study__heading">
            <Link href="/portfolio" className="case-study__back">
              <ArrowLeft size={16} /> Portfolio
            </Link>
            <div>
              <p className="ui-label">{project.category}</p>
              <h1>{project.title}</h1>
            </div>
          </div>
        </header>

        <section className="case-study__story container">
          <div className="case-study__meta">
            <div>
              <p className="ui-label">Year</p>
              <span>{project.year}</span>
            </div>
            <div>
              <p className="ui-label">Location</p>
              <span>{project.location}</span>
            </div>
            <div>
              <p className="ui-label">Scope</p>
              <span>{project.tags.join(", ")}</span>
            </div>
          </div>
          <div className="case-study__copy">
            <h2>{project.summary}</h2>
            <p>{project.story}</p>
            <ButtonLink href={`/contact?inquiry=${encodeURIComponent(project.category)}`} variant="dark">
              Create something similar
            </ButtonLink>
          </div>
        </section>

        <section className="case-study__visual-break">
          <div className="case-study__visual-frame">
            <Image src={project.image} alt="" fill sizes="80vw" aria-hidden="true" />
          </div>
        </section>

        <Link href={`/portfolio/${nextProject.slug}`} className="next-project">
          <div className="container next-project__inner">
            <div>
              <p className="ui-label">Next project</p>
              <h2>{nextProject.title}</h2>
            </div>
            <ArrowUpRight size={34} />
          </div>
        </Link>
      </article>
      <ContactCta tone="cream" />
    </>
  );
}
