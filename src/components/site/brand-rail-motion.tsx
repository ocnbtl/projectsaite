"use client";

import { useEffect } from "react";

// Keep the leading credits in place until the visitor can actually see them.
export function BrandRailMotion() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".editorial-rail");
    const track = rail?.querySelector<HTMLElement>(".editorial-rail__track");
    const root = rail?.closest<HTMLElement>(".editorial-site");
    if (!rail || !track || !root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let started = false;
    let disposed = false;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const measure = () => {
      // A constant pixel speed stays readable as logo widths or viewport change.
      const speed = window.innerWidth < 760 ? 44 : 48;
      track.style.setProperty("--editorial-rail-duration", `${track.scrollWidth / 2 / speed}s`);
    };
    const sync = () => {
      const ready = visible && !document.hidden && !reduced.matches && root.dataset.homeIntroComplete === "true";
      if (!ready) {
        clearTimeout(hold);
        hold = undefined;
        rail.dataset.railRunning = "false";
      } else if (started) {
        rail.dataset.railRunning = "true";
      } else if (!hold) {
        hold = setTimeout(() => {
          hold = undefined;
          started = true;
          sync();
        }, 2000);
      }
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.5;
      sync();
    }, { threshold: [0, 0.5] });
    const intro = new MutationObserver(sync);
    const resize = new ResizeObserver(measure);
    rail.dataset.railMotion = "ready";
    measure();
    intersection.observe(rail);
    intro.observe(root, { attributes: true, attributeFilter: ["data-home-intro-complete"] });
    resize.observe(track);
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true;
      clearTimeout(hold);
      intersection.disconnect();
      intro.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      delete rail.dataset.railMotion;
      delete rail.dataset.railRunning;
      track.style.removeProperty("--editorial-rail-duration");
    };
  }, []);
  return null;
}
