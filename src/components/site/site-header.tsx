"use client";

import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { publicNavigation, type Service } from "@/lib/content";

export function SiteHeader({ services }: { services: Array<Pick<Service, "slug" | "title">> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function closeServiceMenus() {
      document.querySelectorAll<HTMLDetailsElement>(".editorial-nav__services[open]").forEach((menu) => {
        menu.open = false;
      });
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const returnFocus = menuButtonRef.current?.getAttribute("aria-expanded") === "true";
        setOpen(false);
        closeServiceMenus();
        if (returnFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!(event.target instanceof Element) || !event.target.closest(".editorial-nav__services")) {
        closeServiceMenus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <header className="editorial-header">
      <div className="editorial-header__bar">
        <Link className="editorial-brand" href="/" aria-label="Sage Burress home">
          Sage Burress
        </Link>

        <nav className="editorial-nav" aria-label="Primary navigation">
          {publicNavigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            if (item.href === "/services") {
              return (
                <details className="editorial-nav__services" key={`${item.href}-${pathname}`}>
                  <summary className={active ? "is-active" : undefined}>
                    <span>{item.label}</span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </summary>
                  <div className="editorial-nav__dropdown">
                    {services.map((service) => (
                      <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>
                    ))}
                  </div>
                </details>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          ref={menuButtonRef}
          className="editorial-menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="editorial-mobile-navigation"
        >
          <span>{open ? "Close" : "Menu"}</span>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="editorial-mobile-navigation"
        className={`editorial-mobile-nav${open ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {publicNavigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          if (item.href === "/services") {
            return (
              <details className="editorial-mobile-nav__services" key={`${item.href}-${pathname}`}>
                <summary>
                  <span>{item.label}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <div>
                  {services.map((service) => (
                    <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setOpen(false)} tabIndex={open ? undefined : -1}>
                      <span>{service.title}</span><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </details>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
            >
              <span>{item.label}</span>
              <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
