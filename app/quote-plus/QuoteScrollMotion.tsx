"use client";

import { useEffect } from "react";

export default function QuoteScrollMotion() {
  useEffect(() => {
    const mockups = Array.from(
      document.querySelectorAll<HTMLElement>(".quote-case .qp-workflows .qp-screen"),
    );

    if (!mockups.length) return;

    const cleanups: Array<() => void> = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7%" },
    );

    mockups.forEach((mockup, index) => {
      mockup.classList.add("qp-mockup-motion");
      mockup.style.setProperty("--mockup-delay", `${(index % 2) * 100}ms`);
      observer.observe(mockup);

      const media = mockup.querySelector<HTMLElement>(".qp-screen-media");
      if (!media) return;

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = mockup.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        media.style.setProperty("--mockup-rx", `${(0.5 - y) * 2.6}deg`);
        media.style.setProperty("--mockup-ry", `${(x - 0.5) * 3.2}deg`);
        media.style.setProperty("--mockup-light-x", `${x * 100}%`);
        media.style.setProperty("--mockup-light-y", `${y * 100}%`);
      };

      const resetPointer = () => {
        media.style.setProperty("--mockup-rx", "0deg");
        media.style.setProperty("--mockup-ry", "0deg");
      };

      mockup.addEventListener("pointermove", handlePointerMove);
      mockup.addEventListener("pointerleave", resetPointer);
      cleanups.push(() => {
        mockup.removeEventListener("pointermove", handlePointerMove);
        mockup.removeEventListener("pointerleave", resetPointer);
      });
    });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
