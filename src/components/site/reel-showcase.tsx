"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Reel = { id: string; title: string; href: string; embed: string };

function ReelFrame({ reel }: { reel: Reel }) {
  const container = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ width: 340, scale: 1 });
  const [height, setHeight] = useState<number>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const resize = new ResizeObserver(() => {
      const available = element.clientWidth;
      // Keep a readable minimum embed layout on the narrowest phones.
      // Scale the entire embed, never crop the video or its playback controls.
      const width = Math.max(326, available);
      setSize(previous => previous.width === width && previous.scale === available / width ? previous : { width, scale: available / width });
    });
    resize.observe(element);
    const measure = (event: MessageEvent) => {
      if (event.origin !== "https://www.instagram.com" || event.source !== iframe.current?.contentWindow) return;
      try {
        const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const rawHeight = message?.details?.height;
        const nextHeight = typeof rawHeight === "number" || typeof rawHeight === "string" ? Number(rawHeight) : NaN;
        if (message?.type === "MEASURE" && Number.isFinite(nextHeight) && nextHeight >= 320 && nextHeight <= 2400) {
          setHeight(Math.ceil(nextHeight));
          setLoaded(true);
        }
      } catch { /* Ignore unrelated or malformed provider messages. */ }
    };
    window.addEventListener("message", measure);
    return () => { resize.disconnect(); window.removeEventListener("message", measure); };
  }, []);
  const embedHeight = height ?? Math.ceil(size.width * 16 / 9 + 190);
  return <div ref={container} className="editorial-reels__embed" style={{ height: embedHeight * size.scale }}>
    {!loaded && <p className="editorial-reels__loading" role="status">Loading from Instagram…</p>}
    <iframe ref={iframe} src={reel.embed} title={reel.title}
      style={{ width: size.width, height: embedHeight, transform: `scale(${size.scale})` }}
      loading="lazy" scrolling="no" onLoad={() => setLoaded(true)} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
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
        <h3>{reel.title}</h3>
        <ReelFrame reel={reel} />
        <a href={reel.href} target="_blank" rel="noopener noreferrer">Watch on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>)}
    </div>
    <footer className="editorial-reels__footer"><p>Swipe or scroll to explore. Not playing? Open the reel on Instagram.</p><a href="https://www.instagram.com/sage_burress/reels/" target="_blank" rel="noopener noreferrer">More on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a></footer>
  </section>;
}
