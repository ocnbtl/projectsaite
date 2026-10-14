"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Reel = {
  id: string; title: string; href: string; src: string; poster: string;
  instagram?: { likes?: number; views?: number; updated: string };
};

function ReelFrame({ reel }: { reel: Reel }) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.15) element.pause();
    }, { threshold: [0, 0.15] });
    observer.observe(element);
    const hide = () => { if (document.hidden) element.pause(); };
    document.addEventListener("visibilitychange", hide);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide); };
  }, []);
  const play = async () => {
    const element = video.current;
    if (!element) return;
    setFailed(false);
    setStarted(true);
    setWaiting(true);
    if (element.error) element.load();
    try { await element.play(); }
    catch (error) {
      // Scrolling out of view can intentionally interrupt a pending play request.
      if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      setWaiting(false);
    }
  };
  return <div className="editorial-reels__player">
    <video ref={video} src={reel.src} poster={reel.poster} width={720} height={1280}
      aria-label={reel.title} controls={started} preload="none" playsInline
      onPlay={event => {
        setStarted(true);
        const current = event.currentTarget;
        current.closest(".editorial-reels__viewport")?.querySelectorAll("video").forEach(other => {
          if (other !== current) other.pause();
        });
      }}
      onPlaying={() => { setWaiting(false); setFailed(false); }}
      onWaiting={() => setWaiting(true)}
      onPause={() => setWaiting(false)}
      onError={() => { setFailed(true); setWaiting(false); }}>
      Your browser cannot play this video. <a href={reel.href}>Watch on Instagram</a>.
    </video>
    {!started && !failed && <button type="button" className="editorial-reels__play" aria-label={`Play ${reel.title}`} onClick={play}><Play size={28} aria-hidden="true" /></button>}
    {waiting && !failed && <p className="editorial-reels__status" role="status">Loading video…</p>}
    {failed && <div className="editorial-reels__error" role="status"><p>This video couldn’t load.</p><button type="button" onClick={play}>Try again</button><a href={reel.href} target="_blank" rel="noopener noreferrer">Watch on Instagram</a></div>}
  </div>;
}

export function ReelShowcase({ reels }: { reels: Reel[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const start = element.scrollLeft < 2;
        const end = element.scrollLeft >= element.scrollWidth - element.clientWidth - 2;
        setEdges(previous => previous.start === start && previous.end === end ? previous : { start, end });
      });
    };
    element.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(element);
    update();
    return () => { element.removeEventListener("scroll", update); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  if (!reels.length) return null;

  const move = (direction: number) => {
    const element = viewport.current;
    const first = element?.querySelector<HTMLElement>("article");
    if (!element || !first) return;
    const distance = first.offsetWidth + parseFloat(getComputedStyle(element).columnGap);
    element.scrollBy({ left: direction * distance, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return <section className="editorial-reels" aria-labelledby="reel-heading">
    <header className="editorial-reels__header">
      <div><h2 id="reel-heading">Stories in motion.</h2><p>A glimpse of my world, one reel at a time.</p></div>
      <div className="editorial-reels__controls">
        <button type="button" aria-label="Previous reel" aria-controls="reel-gallery" disabled={edges.start} onClick={() => move(-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
        <button type="button" aria-label="Next reel" aria-controls="reel-gallery" disabled={edges.end} onClick={() => move(1)}><ChevronRight size={20} aria-hidden="true" /></button>
      </div>
    </header>
    <div ref={viewport} id="reel-gallery" className="editorial-reels__viewport" tabIndex={0} role="region" aria-label="Reel gallery; swipe or use arrow keys"
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
        if (event.key === "Home" || event.key === "End") { event.preventDefault(); event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth, behavior: "instant" }); }
      }}>
      {reels.map((reel, index) => <article className="editorial-reels__card" key={reel.id} aria-label={`${index + 1} of ${reels.length}: ${reel.title}`}>
        <ReelFrame reel={reel} />
        <h3>{reel.title}</h3>
        {reel.instagram && (reel.instagram.likes !== undefined || reel.instagram.views !== undefined) && <div className="editorial-reels__metrics">
          <p>
            {reel.instagram.likes !== undefined && <span><Heart size={16} aria-hidden="true" />{reel.instagram.likes.toLocaleString("en-US")} likes</span>}
            {reel.instagram.views !== undefined && <span><Play size={16} aria-hidden="true" />{reel.instagram.views.toLocaleString("en-US")} views</span>}
          </p>
          <small>On Instagram · Updated <time dateTime={reel.instagram.updated}>{new Date(`${reel.instagram.updated}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></small>
        </div>}
        <a href={reel.href} target="_blank" rel="noopener noreferrer">Watch on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>)}
    </div>
    <footer className="editorial-reels__footer"><p>Swipe or scroll to explore. Tap a reel to play.</p><a href="https://www.instagram.com/sage_burress/reels/" target="_blank" rel="noopener noreferrer">More on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a></footer>
  </section>;
}
