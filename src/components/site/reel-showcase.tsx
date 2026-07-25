"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

type Reel = {
  id: string;
  title: string;
  href: string;
  embed: string;
};

type ReelStyle = CSSProperties & {
  "--reel-scale": string;
  "--reel-lift": string;
  "--reel-opacity": string;
};

const initialReelStyle: ReelStyle = {
  "--reel-scale": "0.9",
  "--reel-lift": "14px",
  "--reel-opacity": "0.72",
};

export function ReelShowcase({ reels }: { reels: Reel[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-reel-card]"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateCards = () => {
      const viewportBounds = viewport.getBoundingClientRect();
      const viewportCenter = viewportBounds.left + viewportBounds.width / 2;
      const influenceRadius = Math.max(viewportBounds.width * 0.58, 360);
      let activeCard: HTMLElement | null = null;
      let activeDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        const cardCenter = bounds.left + bounds.width / 2;
        const distance = Math.abs(viewportCenter - cardCenter);
        const proximity = reducedMotion.matches
          ? 1
          : Math.max(0, 1 - distance / influenceRadius);
        const scale = 0.86 + proximity * 0.14;
        const lift = (1 - proximity) * 22;
        const opacity = 0.62 + proximity * 0.38;

        card.style.setProperty("--reel-scale", scale.toFixed(3));
        card.style.setProperty("--reel-lift", `${lift.toFixed(2)}px`);
        card.style.setProperty("--reel-opacity", opacity.toFixed(3));

        if (distance < activeDistance) {
          activeCard = card;
          activeDistance = distance;
        }
      });

      cards.forEach((card) => {
        if (card === activeCard) card.setAttribute("data-active", "true");
        else card.removeAttribute("data-active");
      });
    };

    const queueUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateCards);
    };

    const initialCard = cards[Math.min(1, Math.max(0, cards.length - 1))];
    if (initialCard) {
      viewport.scrollTo({
        left: initialCard.offsetLeft - (viewport.clientWidth - initialCard.offsetWidth) / 2,
        behavior: "auto",
      });
    }
    queueUpdate();
    viewport.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    reducedMotion.addEventListener("change", queueUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      reducedMotion.removeEventListener("change", queueUpdate);
    };
  }, []);

  return (
    <section className="editorial-reel-showcase" aria-label="Instagram reels">
      <div
        className="editorial-reel-showcase__viewport"
        ref={viewportRef}
        tabIndex={0}
        aria-label="Scrollable Instagram reel showcase"
      >
        {reels.map((reel) => (
          <article
            className="editorial-reel-phone"
            data-reel-card
            key={reel.id}
            style={initialReelStyle}
          >
            <div className="editorial-reel-phone__speaker" aria-hidden="true" />
            <iframe
              src={reel.embed}
              title={reel.title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <a href={reel.href} target="_blank" rel="noopener noreferrer">
              Open reel on Instagram <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
        <a
          className="editorial-reel-showcase__more"
          data-reel-card
          href="https://www.instagram.com/sage_burress/reels/"
          target="_blank"
          rel="noopener noreferrer"
          style={initialReelStyle}
        >
          <strong>Keep watching on Instagram.</strong>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <p className="editorial-reel-showcase__hint">
        Swipe or scroll to move through the reels.
      </p>
    </section>
  );
}
