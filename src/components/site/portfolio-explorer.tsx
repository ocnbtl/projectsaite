"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project } from "@/lib/content";

export function PortfolioExplorer({ projects }: { projects: Project[] }) {
  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category)))];
  const [selected, setSelected] = useState("All");
  const visible = useMemo(
    () => (selected === "All" ? projects : projects.filter((project) => project.category === selected)),
    [projects, selected],
  );

  return (
    <div>
      <div className="portfolio-filters" role="group" aria-label="Filter portfolio projects">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selected === category ? "is-active" : undefined}
            aria-pressed={selected === category}
            aria-controls="portfolio-project-grid"
            onClick={() => setSelected(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div id="portfolio-project-grid" className="portfolio-grid" aria-live="polite">
        {visible.map((project, index) => (
          <Link href={`/portfolio/${project.slug}`} className={`portfolio-card portfolio-card--${(index % 3) + 1}`} key={project.slug}>
            <div className="portfolio-card__image">
              <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 46vw" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="portfolio-card__caption">
              <div>
                <p className="ui-label">{project.category}</p>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
              </div>
              <ArrowUpRight size={22} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
