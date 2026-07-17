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
  const columns = [
    complete.filter((_, index) => index % 2 === 0),
    complete.filter((_, index) => index % 2 === 1),
  ];

  return (
    <div className="editorial-mosaic">
      {columns.map((column, columnIndex) => (
        <div className="editorial-mosaic__column" key={columnIndex}>
          {column.map((project, itemIndex) => {
            const media = portfolioMedia.find((item) => item.src === project.image);
            const position = columnIndex + itemIndex * 2 + 1;

            return (
              <figure className="editorial-mosaic__item" key={project.slug}>
                <Image
                  src={project.image}
                  alt={project.alt}
                  width={media?.width ?? 1600}
                  height={media?.height ?? 2000}
                  loading={showCaptions && itemIndex === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 46vw"
                />
                {showCaptions ? (
                  <figcaption>
                    <span>{String(position).padStart(2, "0")}</span>
                    <span>{project.category}</span>
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      ))}
    </div>
  );
}
