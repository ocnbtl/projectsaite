"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";

type Viewing = {
  source: HTMLImageElement;
  trigger: HTMLAnchorElement;
  image: HTMLImageElement;
  restore: () => void;
  closing: boolean;
};

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/** A cached image stays visible throughout the grid-to-viewer handoff. */
export function PortfolioViewer({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const active = useRef<Viewing | null>(null);
  const motion = useRef<Animation | null>(null);
  const backdropMotion = useRef<Animation | null>(null);

  const finish = useCallback(() => {
    const current = active.current;
    if (!current) return;
    active.current = null;
    motion.current?.cancel();
    backdropMotion.current?.cancel();
    current.restore();
    dialog.current?.close();
    current.image.remove();
    current.trigger.focus({ preventScroll: true });
  }, []);

  function fadeBackdrop(opacity: number, duration: number) {
    const element = shade.current;
    if (!element) return;
    const from = getComputedStyle(element).opacity;
    backdropMotion.current?.cancel();
    element.style.opacity = String(opacity);
    backdropMotion.current = element.animate([{ opacity: from }, { opacity }], { duration, easing: ease });
  }

  const expand = useCallback((from?: DOMRect) => {
    const current = active.current;
    const frame = stage.current;
    if (!current || !frame || current.closing) return;
    const previous = from ?? frame.getBoundingClientRect();
    const oldRadius = from ? "0px" : getComputedStyle(frame).borderRadius;
    motion.current?.cancel();
    const viewport = window.visualViewport;
    const vw = viewport?.width ?? innerWidth;
    const vh = viewport?.height ?? innerHeight;
    const gutter = vw < 760 ? 16 : 32;
    const ratio = current.source.naturalWidth / current.source.naturalHeight;
    const width = Math.min(vw - gutter * 2, (vh - 96) * ratio);
    const height = width / ratio;
    const left = (viewport?.offsetLeft ?? 0) + (vw - width) / 2;
    const top = (viewport?.offsetTop ?? 0) + 64 + (vh - 96 - height) / 2;
    Object.assign(frame.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`, borderRadius: "16px", transform: "none" });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    motion.current = frame.animate([
      { transform: `translate(${previous.left - left}px, ${previous.top - top}px) scale(${previous.width / width}, ${previous.height / height})`, borderRadius: oldRadius },
      { transform: "translate(0, 0) scale(1)", borderRadius: "16px" },
    ], { duration: reduced ? 0 : from ? 520 : 240, easing: ease });
    dialog.current!.dataset.phase = "opening";
    motion.current.onfinish = () => {
      if (active.current === current && !current.closing) dialog.current!.dataset.phase = "open";
    };
  }, []);

  function close() {
    const current = active.current;
    const frame = stage.current;
    if (!current || !frame || current.closing) return;
    current.closing = true;
    dialog.current!.dataset.phase = "closing";
    const style = getComputedStyle(frame);
    const from = { transform: style.transform, borderRadius: style.borderRadius };
    motion.current?.cancel();
    const target = current.source.getBoundingClientRect();
    const base = frame.getBoundingClientRect();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 380;
    fadeBackdrop(0, duration);
    motion.current = frame.animate([from, {
      transform: `translate(${target.left - base.left}px, ${target.top - base.top}px) scale(${target.width / base.width}, ${target.height / base.height})`,
      borderRadius: "0px",
    }], { duration, easing: ease, fill: "forwards" });
    motion.current.onfinish = finish;
  }

  async function open(event: MouseEvent<HTMLDivElement>) {
    const trigger = (event.target as Element).closest<HTMLAnchorElement>("a[data-portfolio-photo]");
    if (!trigger || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const source = trigger.querySelector("img");
    const modal = dialog.current;
    const frame = stage.current;
    if (!source?.complete || !source.naturalWidth || !modal || !frame || !modal.showModal) return;
    event.preventDefault();
    if (active.current) return;

    // Decode the same cached thumbnail before hiding it, even on a slow connection.
    const image = new window.Image();
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    image.draggable = false;
    try { await image.decode(); } catch { return; }
    if (!trigger.isConnected || active.current || !dialog.current) return;
    const rect = source.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const bodyStyle = document.body.style.cssText;
    const visibility = source.style.visibility;
    const scrollbarWidth = innerWidth - document.documentElement.clientWidth;
    Object.assign(document.body.style, { position: "fixed", top: `${-scrollY}px`, left: `${-scrollX}px`, width: `calc(100% - ${scrollbarWidth}px)`, overflow: "hidden" });
    const current: Viewing = {
      source, trigger, image, closing: false,
      restore: () => {
        source.style.visibility = visibility;
        document.body.style.cssText = bodyStyle;
        window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      },
    };
    active.current = current;
    frame.replaceChildren(image);
    shade.current!.style.opacity = "0";
    modal.showModal();
    expand(rect);
    source.style.visibility = "hidden";
    fadeBackdrop(1, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 520);
    modal.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });

    // Upgrade only after decoding; a failed full-size request leaves the photo visible.
    const fullSize = new window.Image();
    fullSize.src = trigger.href;
    void fullSize.decode().then(() => {
      if (active.current === current && !current.closing) image.src = fullSize.src;
    }).catch(() => {});
  }

  useEffect(() => {
    const resize = () => {
      if (active.current?.closing) finish();
      else expand();
    };
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      finish();
    };
  }, [expand, finish]);

  return (
    <div onClick={open}>
      {children}
      <dialog ref={dialog} className="editorial-photo-viewer" aria-label="Portfolio photo viewer"
        onCancel={event => { event.preventDefault(); close(); }}
        onKeyDown={event => {
          if (event.key === "Tab") {
            event.preventDefault();
            event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
          }
        }}
        onClick={event => { if (event.target === event.currentTarget || event.target === shade.current) close(); }}>
        <div ref={shade} className="editorial-photo-viewer__shade" aria-hidden="true" />
        <div ref={stage} className="editorial-photo-viewer__image" />
        <button type="button" className="editorial-photo-viewer__close" aria-label="Close photo" onClick={close}>
          <X size={24} aria-hidden="true" />
        </button>
      </dialog>
    </div>
  );
}
