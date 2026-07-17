import Image from "next/image";

import { portfolioMedia } from "@/content/portfolio-media";
import type { Project } from "@/lib/content";

const preferredOrder = [0, 2, 7, 3, 9, 4, 10, 1, 6, 11, 5, 8, 12];

export function PortfolioMosaic({
  projects,
  showCaptions = false,
}: {
  projects: Project[];
  showCaptions?: boolean;
}) {
  const ordered = preferredOrder
    .map((index) => projects[index])
    .filter((project): project is Project => Boolean(project));
  const remaining = projects.filter((project) => !ordered.includes(project));
  const complete = [...ordered, ...remaining];

  return (
    <div className="editorial-mosaic">
      {complete.map((project, index) => {
        const media = portfolioMedia.find((item) => item.src === project.image);

        return (
          <figure className="editorial-mosaic__item" key={project.slug}>
            <Image
              src={project.image}
              alt={project.alt}
              width={media?.width ?? 1600}
              height={media?.height ?? 2000}
              loading={showCaptions && index < 4 ? "eager" : "lazy"}
              sizes="(max-width: 759px) 100vw, (max-width: 1099px) 33vw, 25vw"
            />
            {showCaptions ? (
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
