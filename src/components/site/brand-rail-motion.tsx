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
    let previous: { start: number; period: number; anchor: number } | undefined;
    const measure = () => {
      const primary = track.querySelector<HTMLElement>('.editorial-brandmark:not([aria-hidden="true"])');
      const marks = Array.from(track.children) as HTMLElement[];
      const count = marks.length / 3;
      if (!primary || !marks[count]) return;
      // A preceding copy fills the left half while Macy's starts at the center.
      const trackBounds = track.getBoundingClientRect();
      const primaryBounds = primary.getBoundingClientRect();
      const period = primaryBounds.left - marks[0].getBoundingClientRect().left;
      const anchor = primaryBounds.left - trackBounds.left + primaryBounds.width / 2;
      const start = viewport.clientWidth / 2 - anchor;
      if (previous && Math.abs(start - previous.start) < 0.1 && Math.abs(period - previous.period) < 0.1) return;
      const animation = track.getAnimations()[0];
      const time = Number(animation?.currentTime ?? 0);
      // Preserve the visible position through late fonts or real viewport resizing.
      const oldPosition = previous ? previous.anchor + previous.start - previous.period * ((time % 52000) / 52000) : 0;
      track.style.setProperty("--editorial-rail-start", `${start}px`);
      track.style.setProperty("--editorial-rail-end", `${start - period}px`);
      if (previous && animation && time > 0 && period > 0) {
        const progress = (anchor + start - oldPosition) / period;
        animation.currentTime = ((progress % 1 + 1) % 1) * 52000;
      }
      previous = { start, period, anchor };
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
