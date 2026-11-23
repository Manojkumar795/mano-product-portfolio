"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";

const passProps = {
  content: {
    attendeeName: "Manoj Kumar N",
    ticketType: "Senior Product Designer",
    eventName: "Product design",
    eventDate: "Coimbatore, India",
    ticketNumber: "8+ YEARS",
    barcodeValue: "",
    backText: "Systems thinker. Detail obsessive. Business aware.",
    strapText: "MANOJ KUMAR N · PRODUCT DESIGN",
  },
  look: {
    paper: "#101724", ink: "#f5f7fa", accent: "#6fa8ff",
    strapColor: "#253650", strapStyle: "flat", foil: "edges",
    finish: "matte", sleeve: false,
    nameFont: { fontFamily: "Arial, sans-serif", fontSize: "98px", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: "1.05em" },
    metaFont: { fontFamily: "Arial, sans-serif", fontSize: "28px", fontWeight: 400, letterSpacing: "0.01em" },
    numberFont: { fontFamily: "Arial, sans-serif", fontSize: "32px", fontWeight: 600 },
  },
  layout: { size: 300, padding: 52, thickness: 2.4, stackGap: 16 },
  light: { angle: 28, height: 55, intensity: 1.15, rim: true },
};

export default function AboutLanyard() {
  const host = useRef<HTMLDivElement>(null);
  const [Pass, setPass] = useState<ComponentType<typeof passProps> | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      import("./vendor/KernLanyardPass.js").then(module => {
        if (!cancelled) setPass(() => module.default);
      }).catch(() => { /* Keep the readable static pass if WebGL cannot load. */ });
    }, { rootMargin: "350px 0px" });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return (
    <div className="about-lanyard" ref={host}>
      <div className="about-lanyard-stage">
        <div className="about-pass-fallback" aria-label="Manoj Kumar N, Senior Product Designer">
          <span className="about-pass-mark">MK</span>
          <span className="about-pass-discipline">Product design</span>
          <strong>Manoj<br />Kumar N</strong>
          <span>Senior Product Designer</span>
          <small>Coimbatore, India</small>
          <b>8+ years</b>
        </div>
        {Pass && <Pass {...passProps} />}
      </div>
    </div>
  );
}
