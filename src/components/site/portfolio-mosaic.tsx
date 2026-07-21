import Image from "next/image";

import { portfolioMedia } from "@/content/portfolio-media";
import type { Project } from "@/lib/content";

const preferredImages = [
  "/media/sage/v1/sage-001.webp",
  "/media/sage/v1/sage-003.webp",
  "/media/sage/v1/sage-008.webp",
  "/media/sage/v1/sage-004.webp",
  "/media/sage/v1/sage-010.webp",
  "/media/sage/v1/sage-005.webp",
  "/media/sage/v1/sage-011.webp",
  "/media/sage/v1/sage-002.webp",
  "/media/sage/v1/sage-007.webp",
  "/media/sage/v1/sage-012.webp",
  "/media/sage/v1/sage-009.webp",
  "/media/sage/v1/sage-013.webp",
];

export function PortfolioMosaic({
  projects,
  showCaptions = false,
}: {
  projects: Project[];
  showCaptions?: boolean;
}) {
  const ordered = preferredImages
    .map((image) => projects.find((project) => project.image === image))
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
