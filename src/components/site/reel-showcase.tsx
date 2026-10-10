"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Reel = { id: string; title: string; href: string; embed: string };

function ReelFrame({ reel }: { reel: Reel }) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const measure = (event: MessageEvent) => {
      if (event.origin !== "https://www.instagram.com" || event.source !== iframe.current?.contentWindow || typeof event.data !== "string") return;
      try {
        const message = JSON.parse(event.data);
        const nextHeight = message?.details?.height;
        if (message?.type === "MEASURE" && typeof nextHeight === "number" && Number.isFinite(nextHeight) && nextHeight >= 320 && nextHeight <= 2400) {
          setHeight(Math.ceil(nextHeight));
          setLoaded(true);
        }
      } catch { /* Ignore unrelated or malformed third-party messages. */ }
    };
    window.addEventListener("message", measure);
    return () => window.removeEventListener("message", measure);
  }, []);
  return <div className="editorial-reels__embed">
    {!loaded && <p className="editorial-reels__loading" role="status">Loading from Instagram…</p>}
    <iframe ref={iframe} src={reel.embed} title={reel.title} style={height ? { height } : undefined} loading="lazy" onLoad={() => setLoaded(true)} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
  </div>;
}

export function ReelShowcase({ reels }: { reels: Reel[] }) {
  const [active, setActive] = useState(0);
  if (!reels.length) return null;
  const reel = reels[active];
  const select = (index: number) => setActive(index);

  return <section className="editorial-reels" aria-labelledby="reel-heading">
    <div className="editorial-reels__index">
      <h2 id="reel-heading">Stories in motion.</h2>
      <p>A glimpse of my world, one reel at a time.</p>
      <div className="editorial-reels__choices" role="group" aria-label="Choose a reel">
        {reels.map((item, index) => <button type="button" key={item.id} aria-pressed={index === active} aria-controls="reel-viewer" onClick={() => select(index)}>
          <span>{item.title}</span><Play size={16} aria-hidden="true" />
        </button>)}
      </div>
      <a href="https://www.instagram.com/sage_burress/reels/" target="_blank" rel="noopener noreferrer">More on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>
    <div id="reel-viewer" className="editorial-reels__viewer">
      <div className="editorial-reels__toolbar">
        <p aria-live="polite">{active + 1} / {reels.length} <span>{reel.title}</span></p>
        <div>
          <button type="button" aria-label="Previous reel" disabled={active === 0} onClick={() => select(active - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Next reel" disabled={active === reels.length - 1} onClick={() => select(active + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <ReelFrame key={reel.id} reel={reel} />
      <div className="editorial-reels__fallback">
        <a href={reel.href} target="_blank" rel="noopener noreferrer">Watch on Instagram <ArrowUpRight size={16} aria-hidden="true" /></a>
        <p>Not playing here? Open the reel directly.</p>
      </div>
    </div>
  </section>;
}
