"use client";

import type { MouseEvent, ReactNode } from "react";

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const nextHash = `#${id}`;
  if (window.location.hash !== nextHash) {
    window.location.hash = id;
  }

  const offset = window.innerWidth <= 900 ? 80 : 98;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

export function WalkthroughJumpLink({
  targetId,
  children,
}: {
  targetId: string;
  children: ReactNode;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(targetId);
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  );
}
