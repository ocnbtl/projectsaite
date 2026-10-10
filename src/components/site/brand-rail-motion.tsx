"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function BrandRailMotion() {
  const button = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const rail = button.current?.closest<HTMLElement>(".editorial-rail");
    const track = rail?.querySelector<HTMLElement>(".editorial-rail__track");
    const viewport = rail?.querySelector<HTMLElement>(".editorial-rail__viewport");
    if (!rail || !track || !viewport) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let revealed = false;
    let disposed = false;
    const measure = () => {
      const primary = track.querySelector<HTMLElement>('.editorial-brandmark:not([aria-hidden="true"])');
      const marks = Array.from(track.children) as HTMLElement[];
      const count = marks.length / 3;
      if (!primary || !marks[count]) return;
      // A preceding copy fills the left half while Macy's starts at the center.
      const period = marks[count].offsetLeft - marks[0].offsetLeft;
      const start = viewport.clientWidth / 2 - primary.offsetLeft - primary.offsetWidth / 2;
      track.style.setProperty("--editorial-rail-start", `${start}px`);
      track.style.setProperty("--editorial-rail-end", `${start - period}px`);
    };
    const sync = () => {
      // Start with the rail's entrance, not the later completion of the hero.
      revealed ||= rail.getAnimations().some(animation => {
        const delay = Number(animation.effect?.getTiming().delay ?? 0);
        return Number(animation.currentTime ?? -1) >= delay;
      });
      rail.dataset.railRunning = String(visible && revealed && !document.hidden && !reduced.matches && rail.dataset.railPaused !== "true");
    };
    const onEntrance = (event: AnimationEvent) => {
      if (event.target === rail) { revealed = true; sync(); }
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    });
    const resize = new ResizeObserver(measure);
    const preference = new MutationObserver(sync);
    measure();
    rail.dataset.railMotion = "ready";
    intersection.observe(rail);
    resize.observe(track);
    resize.observe(viewport);
    preference.observe(rail, { attributes: true, attributeFilter: ["data-rail-paused"] });
    rail.addEventListener("animationstart", onEntrance);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true;
      intersection.disconnect(); resize.disconnect(); preference.disconnect();
      rail.removeEventListener("animationstart", onEntrance);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      delete rail.dataset.railMotion;
      delete rail.dataset.railRunning;
    };
  }, []);

  return (
    <button ref={button} type="button" className="editorial-rail__toggle"
      aria-label={paused ? "Resume logo scrolling" : "Pause logo scrolling"}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        const rail = button.current?.closest<HTMLElement>(".editorial-rail");
        if (rail) rail.dataset.railPaused = String(next);
      }}>
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
    </button>
  );
}
