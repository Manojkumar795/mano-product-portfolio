"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projectVisor } from "./hudGeometry";
import styles from "./F35StoryV2.module.css";

export default function VisorHUD() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CSSProperties | null>(null);

  useEffect(() => {
    const photograph = overlayRef.current?.parentElement?.querySelector("img");
    if (!photograph) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const [x, y] = getComputedStyle(photograph).objectPosition.split(" ");
        const geometry = projectVisor(photograph.clientWidth, photograph.clientHeight, parseFloat(x) / 100, parseFloat(y) / 100);
        setPosition({ ...geometry, top: geometry.top + photograph.offsetTop });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(photograph);
    photograph.addEventListener("load", measure);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      photograph.removeEventListener("load", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={overlayRef} className={styles.visorHUD} style={position ?? { visibility: "hidden" }} aria-hidden="true" data-visor-hud>
      <svg viewBox="0 0 470 280" fill="none">
        <g className={styles.visorReadouts}>
          <path d="M113 58H348 M122 53V58 M147 49V58 M172 53V58 M197 49V58 M222 53V58 M247 49V58 M272 53V58 M297 49V58 M322 53V58 M347 49V58 M231 63l5-5 5 5" />
          <text x="142" y="42">290</text><text x="191" y="42">300</text><text x="286" y="42">310</text>
          <text x="225" y="80">304</text>
          <text x="48" y="118" className={styles.visorUnit}>SPD</text><text x="47" y="137" className={styles.visorValue}>468</text>
          <text x="363" y="118" className={styles.visorUnit}>ALT</text><text x="359" y="137" className={styles.visorValue}>28640</text>
          <path d="M82 145H92V112H82 M355 112H345V145H355 M102 106h7 M102 118h4 M102 130h7 M102 142h4 M331 106h7 M334 118h4 M331 130h7 M334 142h4" />
          <text x="68" y="205">M 0.82</text><text x="319" y="205">G 1.0</text>
        </g>
        <g className={styles.visorAttitude}>
          <path d="M167 100v4h43 M259 104h43v-4 M177 124v4h33 M259 128h33v-4 M133 152h77 M259 152h77 M177 176h33 M259 176h33" />
          <text x="146" y="107">10</text><text x="310" y="107">10</text>
          <text x="155" y="131">5</text><text x="300" y="131">5</text>
          <circle cx="235" cy="146" r="7" />
          <path d="M216 146h12 M242 146h12 M235 139v-9" />
          <path d="M265 166l5-5 5 5-5 5z M254 182l8-8" />
          <text x="226" y="202">16° R</text>
        </g>
      </svg>
    </div>
  );
}
