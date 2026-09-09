"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { heroCorners, screenTransform } from "./heroGeometry";
import styles from "./HeroMockups.module.css";

const customerTransform = screenTransform(heroCorners.customer);
const venueTransform = screenTransform(heroCorners.venue);

export default function HeroMockups({ caption = true, priority = true, animate = true }: { caption?: boolean; priority?: boolean; animate?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mappingRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const mapping = mappingRef.current;
    if (!frame || !mapping) return;
    const fit = () => {
      mapping.style.transform = `scale(${frame.clientWidth / 1254})`;
      mapping.style.visibility = "visible";
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return <figure className={styles.mockups} aria-label="Customer and Venue apps in angled graphite phone mockups">
    <div className={styles.cameraReveal} data-ready={animate && ready}>
      <div className={styles.artwork} ref={frameRef}>
        <Image className={styles.hardware} src="/slotgo/hero-phones.png" alt="" width={1254} height={1254} priority={priority} unoptimized onLoad={() => setReady(true)} />
        <div className={styles.mapping} ref={mappingRef}>
          <div className={styles.venueMask}>
            <div className={styles.display} style={{ transform: venueTransform }}>
              <Image src="/slotgo/venue-calendar.png" alt="SlotGo Venue App: daily court calendar" width={806} height={1746} priority={priority} unoptimized />
            </div>
          </div>
          <div className={styles.display} style={{ transform: customerTransform }}>
            <Image src="/slotgo/customer-home.png" alt="SlotGo Customer App: discover venues and find a match" width={806} height={1746} priority={priority} unoptimized />
          </div>
        </div>
      </div>
    </div>
    {caption && <figcaption><span>01 / Customer App</span><span>02 / Venue App</span></figcaption>}
  </figure>;
}
