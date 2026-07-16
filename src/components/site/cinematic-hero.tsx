"use client";

import { ArrowDown } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ButtonLink } from "@/components/site/button-link";
import { Wordmark } from "@/components/site/wordmark";
import type { SiteContent } from "@/lib/content";
import {
  getCinematicFamily,
  isCinematicMediaReady,
  isCinematicPosterReady,
  runwayResortMedia,
  type CinematicViewport,
} from "@/lib/runway-resort-media";

type CinematicHeroProps = {
  hero: SiteContent["hero"];
};

type NetworkInformation = {
  addEventListener?: (type: "change", listener: () => void) => void;
  effectiveType?: string;
  removeEventListener?: (type: "change", listener: () => void) => void;
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

export function CinematicHero({ hero }: CinematicHeroProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const initializingFrameRef = useRef(false);
  const skippedRef = useRef(false);
  const [viewport, setViewport] = useState<CinematicViewport>("desktop");
  const [eligible, setEligible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const mediaReady = isCinematicMediaReady();
  const posterReady = isCinematicPosterReady();
  const timelineEnabled = mediaReady && eligible && !failed;
  const timelineActive = timelineEnabled && ready;
  const family = getCinematicFamily(viewport);
  const sources = useMemo(
    () =>
      [
        family.webm ? { src: family.webm.src, type: "video/webm" } : null,
        family.mp4 ? { src: family.mp4.src, type: "video/mp4" } : null,
      ].filter((source): source is { src: string; type: string } => source !== null),
    [family.mp4, family.webm],
  );

  const stageStyle = {
    "--cinematic-scroll-length": timelineEnabled ? `${runwayResortMedia.scrollLengthVh}svh` : "100svh",
    "--cinematic-poster-desktop": runwayResortMedia.desktop.poster
      ? `url("${runwayResortMedia.desktop.poster.src}")`
      : "none",
    "--cinematic-poster-mobile": runwayResortMedia.mobile.poster
      ? `url("${runwayResortMedia.mobile.poster.src}")`
      : "none",
  } as CSSProperties;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 800px)");
    const updateViewport = () => {
      setViewport(mobileQuery.matches ? "mobile" : "desktop");
      setReady(false);
      setFailed(false);
      initializingFrameRef.current = false;
      skippedRef.current = false;
    };
    updateViewport();
    mobileQuery.addEventListener("change", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    return () => {
      mobileQuery.removeEventListener("change", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NavigatorWithConnection).connection;
    const updateEligibility = () => {
      const constrained =
        connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
      const nextEligible = mediaReady && !motionQuery.matches && !constrained;
      setEligible(nextEligible);
      if (!nextEligible) {
        setReady(false);
        initializingFrameRef.current = false;
        skippedRef.current = false;
      }
    };
    const frame = window.requestAnimationFrame(updateEligibility);
    motionQuery.addEventListener("change", updateEligibility);
    connection?.addEventListener?.("change", updateEligibility);
    return () => {
      window.cancelAnimationFrame(frame);
      motionQuery.removeEventListener("change", updateEligibility);
      connection?.removeEventListener?.("change", updateEligibility);
    };
  }, [mediaReady, viewport]);

  useEffect(() => {
    if (!timelineEnabled || ready) return;
    const timeout = window.setTimeout(() => {
      setFailed(true);
      initializingFrameRef.current = false;
    }, 15_000);
    return () => window.clearTimeout(timeout);
  }, [ready, timelineEnabled]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video || !eligible || !ready || failed) return;

    const syncTimeline = () => {
      frameRef.current = null;
      if (document.hidden || skippedRef.current || !video.duration) return;
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom <= 0 || rect.top >= viewportHeight) return;
      const scrollable = Math.max(wrapper.offsetHeight - viewportHeight, 1);
      const traveled = Math.min(Math.max(-rect.top, 0), scrollable);
      const target = (traveled / scrollable) * Math.max(video.duration - 0.05, 0);
      if (Math.abs(video.currentTime - target) > 0.025) video.currentTime = target;
    };

    const requestSync = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(syncTimeline);
    };

    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
    document.addEventListener("visibilitychange", requestSync);
    return () => {
      window.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", requestSync);
      document.removeEventListener("visibilitychange", requestSync);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [eligible, failed, ready, viewport]);

  const skipToResolve = () => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video?.duration) return;
    skippedRef.current = true;
    video.currentTime = Math.max(video.duration - 0.05, 0);
    const resolveBeat = runwayResortMedia.beats.find((beat) => beat.key === "resort-resolve");
    const scrollable = Math.max(wrapper.offsetHeight - window.innerHeight, 0);
    const resolveProgress = (resolveBeat?.start ?? 88) / 100;
    window.scrollTo({
      top: wrapper.offsetTop + scrollable * resolveProgress,
      // Override the site's global smooth scrolling: a skip control must land
      // on the requested beat immediately instead of animating through it.
      behavior: "instant" as ScrollBehavior,
    });
  };

  const prepareInitialFrame = () => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video?.duration) return;
    const scrollable = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
    const traveled = Math.min(Math.max(-wrapper.getBoundingClientRect().top, 0), scrollable);
    const target = (traveled / scrollable) * Math.max(video.duration - 0.05, 0);
    if (Math.abs(video.currentTime - target) > 0.025) {
      initializingFrameRef.current = true;
      video.currentTime = target;
      return;
    }
    initializingFrameRef.current = false;
    setReady(true);
  };

  return (
    <section ref={wrapperRef} className="cinematic-hero" style={stageStyle} aria-label="Runway to resort">
      <div className="cinematic-hero__stage">
        <div className="cinematic-hero__media" aria-hidden="true">
          {posterReady ? (
            <div className="cinematic-hero__poster" />
          ) : (
            <Image
              className="cinematic-hero__fallback"
              src={hero.image}
              alt=""
              fill
              priority
              sizes="100vw"
            />
          )}
          {eligible && sources.length ? (
            <video
              key={viewport}
              ref={videoRef}
              className={`cinematic-hero__video ${ready && !failed ? "cinematic-hero__video--ready" : ""}`}
              muted
              playsInline
              preload="metadata"
              poster={family.poster?.src}
              tabIndex={-1}
              onLoadedData={prepareInitialFrame}
              onSeeked={() => {
                if (!initializingFrameRef.current) return;
                initializingFrameRef.current = false;
                setReady(true);
              }}
              onError={() => {
                setFailed(true);
                setReady(false);
                initializingFrameRef.current = false;
              }}
            >
              {sources.map((source) => (
                <source key={source.type} src={source.src} type={source.type} />
              ))}
            </video>
          ) : null}
        </div>

        <div className="cinematic-hero__veil" aria-hidden="true" />
        <div className="cinematic-hero__content">
          <p className="cinematic-hero__kicker">{hero.kicker}</p>
          <h1 className="cinematic-hero__heading">
            <Wordmark className="cinematic-hero__wordmark" />
          </h1>
          <p className="cinematic-hero__lead">{hero.lead}</p>
          <div className="cinematic-hero__actions">
            <ButtonLink href="/contact" variant="light">
              Work With Sage
            </ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">
              View portfolio
            </ButtonLink>
          </div>
        </div>

        <div className="cinematic-hero__meta" aria-hidden="true">
          <span>Runway</span>
          <span className="cinematic-hero__meta-line" />
          <span>Resort</span>
        </div>

        {timelineActive ? (
          <button type="button" className="cinematic-hero__skip" onClick={skipToResolve}>
            Skip to resort
          </button>
        ) : null}

        <a href="#practice" className="cinematic-hero__scroll" aria-label="Continue to the next section">
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
