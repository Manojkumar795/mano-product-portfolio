"use client";

import { useEffect } from "react";

export default function ProfitScrollMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".profit-case");
    if (!root) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-profit-reveal]"),
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("profit-is-visible"));
      return;
    }

    root.classList.add("motion-ready");
    nodes.forEach((node, index) => {
      node.style.setProperty("--profit-reveal-delay", `${(index % 3) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("profit-is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -7%" },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
      nodes.forEach((node) => {
        node.classList.remove("profit-is-visible");
        node.style.removeProperty("--profit-reveal-delay");
      });
    };
  }, []);

  return null;
}
