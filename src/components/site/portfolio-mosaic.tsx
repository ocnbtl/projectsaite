import Image from "next/image";
import type { CSSProperties } from "react";

import { portfolioMedia } from "@/content/portfolio-media";
import type { Project } from "@/lib/content";

const preferredImages = [
  "/media/sage/v1/sage-001.webp",
  "/media/sage/v1/sage-003.webp",
  "/media/sage/v1/sage-008.webp",
  "/media/sage/v1/sage-004.webp",
  "/media/sage/v1/sage-010.webp",
  "/media/sage/v1/sage-005.webp",
  "/media/sage/v1/sage-013.webp",
  "/media/sage/v1/sage-002.webp",
  "/media/sage/v1/sage-012.webp",
  "/media/sage/v1/sage-007.webp",
  "/media/sage/v1/sage-011.webp",
  "/media/sage/v1/sage-009.webp",
];

type MosaicItemStyle = CSSProperties & {
  "--editorial-mobile-order": number;
};

function getMobileRowFirstOrders(itemCount: number, columnCount = 4) {
  const baseColumnLength = Math.floor(itemCount / columnCount);
  const extraColumns = itemCount % columnCount;
  const columnLengths = Array.from(
    { length: columnCount },
    (_, columnIndex) => baseColumnLength + (columnIndex < extraColumns ? 1 : 0),
  );
  const columnOffsets = columnLengths.reduce<number[]>((offsets, length, columnIndex) => {
    offsets[columnIndex] = columnIndex === 0
      ? 0
      : offsets[columnIndex - 1] + columnLengths[columnIndex - 1];
    return offsets;
  }, []);
  const orders = Array.from({ length: itemCount }, () => 0);
  let rowFirstOrder = 0;

  for (let rowIndex = 0; rowIndex < Math.max(0, ...columnLengths); rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      if (rowIndex >= columnLengths[columnIndex]) continue;
      orders[columnOffsets[columnIndex] + rowIndex] = rowFirstOrder;
      rowFirstOrder += 1;
    }
  }

  return orders;
}

export function PortfolioMosaic({
  projects,
  showCaptions = false,
  eagerCount = 0,
  revealOnScroll = false,
}: {
  projects: Project[];
  showCaptions?: boolean;
  eagerCount?: number;
  revealOnScroll?: boolean;
}) {
  const ordered = preferredImages
    .map((image) => projects.find((project) => project.image === image))
    .filter((project): project is Project => Boolean(project));
  const remaining = projects.filter((project) => !ordered.includes(project));
  const complete = [...ordered, ...remaining];
  const mobileRowFirstOrders = getMobileRowFirstOrders(complete.length);

  return (
    <div className="editorial-mosaic">
      {complete.map((project, index) => {
        const media = portfolioMedia.find((item) => item.src === project.image);

        return (
          <figure
            className="editorial-mosaic__item"
            data-home-reveal={revealOnScroll ? "portfolio-item" : undefined}
            key={project.slug}
            style={{
              "--editorial-mobile-order": mobileRowFirstOrders[index],
            } as MosaicItemStyle}
          >
            <Image
              src={project.image}
              alt={project.alt}
              width={media?.width ?? 1600}
              height={media?.height ?? 2000}
              loading={index < eagerCount || (showCaptions && index < 4) ? "eager" : "lazy"}
              sizes="(max-width: 759px) 100vw, (max-width: 1099px) 33vw, 25vw"
            />
            {showCaptions ? (
              <figcaption>
                <span className="editorial-mosaic__number editorial-mosaic__number--desktop">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="editorial-mosaic__number editorial-mosaic__number--mobile">
                  {String(mobileRowFirstOrders[index] + 1).padStart(2, "0")}
                </span>
                <span>{project.category}</span>
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
