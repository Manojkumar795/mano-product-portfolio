"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Preserve the supplied desktop composition while fitting it to the available width. */
export default function CaseCanvas({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const artboard = element.firstElementChild as HTMLDivElement | null;
    if (!artboard) return;
    let lastWidth = 0;
    let frame = 0;
    const resize = () => {
      const width = element.clientWidth;
      if (width !== lastWidth) {
        lastWidth = width;
        const narrow = width < 1000;
        element.style.setProperty("--homiq-scale", String(Math.min(1, width / (narrow ? 1180 : 1636))));
        element.style.setProperty("--homiq-crop", narrow ? "-228px" : "0px");
      }
      // Live text panels can grow as their type reflows. Keep the following
      // sections and footer in normal flow instead of cropping their content.
      element.style.setProperty("--homiq-content-height", `${artboard.offsetHeight}px`);
    };
    resize();
    // Height changes follow the scale update. Defer observation writes so they
    // cannot feed back into the same ResizeObserver delivery cycle.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(resize);
    });
    observer.observe(element);
    observer.observe(artboard);
    // Hash navigation must use the displayed coordinates of this scaled canvas.
    // Native offset-based jumps otherwise overshoot on narrow viewports.
    const reveal = (hash: string) => {
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
      catch { return false; }
      if (!target || !artboard.contains(target)) return false;
      const gallery = target.closest<HTMLElement>(".homiq-experience-gallery, .homiq-decision-list");
      if (gallery && gallery.scrollWidth > gallery.clientWidth) {
        const scale = Number.parseFloat(getComputedStyle(element).getPropertyValue("--homiq-scale")) || 1;
        gallery.scrollBy({ left: (target.getBoundingClientRect().left - gallery.getBoundingClientRect().left) / scale, behavior: "auto" });
      }
      const toolbar = document.querySelector<HTMLElement>(".homiq-toolbar");
      const inset = (toolbar?.getBoundingClientRect().bottom ?? 80) + 24;
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - inset, behavior: "auto" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      return true;
    };
    const navigate = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || !reveal(url.hash)) return;
      event.preventDefault();
      event.stopPropagation();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
    };
    const restoreAnchor = () => { if (location.hash) requestAnimationFrame(() => reveal(location.hash)); };
    document.addEventListener("click", navigate, true);
    window.addEventListener("popstate", restoreAnchor);
    restoreAnchor();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", restoreAnchor);
    };
  }, []);
  return <div className="homiq-canvas" ref={viewport}><div className="homiq-artboard">{children}</div></div>;
}
