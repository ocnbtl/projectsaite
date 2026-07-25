"use client";

import { useEffect } from "react";

const rootReadyClass = "is-home-reveal-ready";
const revealedClass = "is-home-revealed";
const portfolioTeaserClass = "is-home-portfolio-teaser";
const heroIntroCompleteEvent = "editorial:hero-intro-complete";

function setRevealDelays(targets: HTMLElement[]) {
  const groups = new Map<string, HTMLElement[]>();

  targets.forEach((target) => {
    const group = target.dataset.homeReveal ?? "default";
    groups.set(group, [...(groups.get(group) ?? []), target]);
  });

  groups.forEach((groupTargets, group) => {
    const columns = group === "portfolio-item"
      ? (window.innerWidth < 760 ? 1 : 4)
      : group === "service-card"
        ? (window.innerWidth < 760 ? 2 : 3)
        : 1;

    groupTargets.forEach((target, index) => {
      const delay = Math.min(index % columns, 5) * 70;
      target.style.setProperty("--editorial-home-reveal-delay", `${delay}ms`);
    });
  });
}

export function HomepageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".editorial-site");
    if (!root) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-reveal]"),
    );
    if (targets.length === 0) return;

    setRevealDelays(targets);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add(revealedClass));
      root.classList.add(rootReadyClass);
      return () => root.classList.remove(rootReadyClass);
    }

    root.classList.add(rootReadyClass);

    const portfolioHeading = targets.find(
      (target) => target.dataset.homeReveal === "portfolio-heading",
    );
    const portfolioItems = targets.filter(
      (target) => target.dataset.homeReveal === "portfolio-item",
    );
    const scrollTargets = targets.filter(
      (target) => target !== portfolioHeading && !portfolioItems.includes(target),
    );
    let hasUserScrolled = window.scrollY > 1;
    const focusPortfolioItems = () => {
      portfolioItems.forEach((target) => target.classList.add(revealedClass));
    };
    const revealPortfolioPreview = () => {
      portfolioHeading?.classList.add(revealedClass);
      portfolioItems.forEach((target) => target.classList.add(portfolioTeaserClass));

      if (hasUserScrolled) {
        window.requestAnimationFrame(focusPortfolioItems);
      }
    };

    window.addEventListener(heroIntroCompleteEvent, revealPortfolioPreview, { once: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(revealedClass);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    let hasStartedObserving = false;
    const startObserving = () => {
      if (hasStartedObserving) return;
      hasStartedObserving = true;
      scrollTargets.forEach((target) => observer.observe(target));
    };

    const handleFirstScroll = () => {
      hasUserScrolled = true;
      focusPortfolioItems();
      startObserving();
      window.removeEventListener("scroll", handleFirstScroll);
    };

    if (hasUserScrolled) {
      startObserving();
    } else {
      window.addEventListener("scroll", handleFirstScroll, { passive: true });
    }

    return () => {
      window.removeEventListener(heroIntroCompleteEvent, revealPortfolioPreview);
      window.removeEventListener("scroll", handleFirstScroll);
      observer.disconnect();
      root.classList.remove(rootReadyClass);
    };
  }, []);

  return null;
}
