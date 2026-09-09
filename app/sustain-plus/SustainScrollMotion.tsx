"use client";

import { useEffect } from "react";

export default function SustainScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".sustain-case [data-sustain-reveal]"),
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" },
    );

    nodes.forEach((node, index) => {
      node.style.setProperty("--sustain-reveal-delay", `${(index % 3) * 70}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
