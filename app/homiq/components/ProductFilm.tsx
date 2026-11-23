"use client";

import { useEffect, useRef, useState } from "react";

const frames = [
  { screen: "my-home", title: "Home", detail: "Your everyday devices, together." },
  { screen: "my-rooms", title: "Rooms", detail: "Start with a place you recognize." },
  { screen: "lamp", title: "Lighting", detail: "See the state. Adjust the brightness." },
  { screen: "scene-name", title: "Scenes", detail: "Give your routine a name." },
  { screen: "scene-set-device-states", title: "Scene settings", detail: "Choose what each device will do." },
];

/** A timed presentation of original screens, rather than a simulated working app. */
export default function ProductFilm() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    if (stage.current) observer.observe(stage.current);
    return () => { preference.removeEventListener("change", updatePreference); observer.disconnect(); };
  }, []);

  const playing = !paused && !reducedMotion && visible;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % frames.length), 4500);
    return () => window.clearInterval(timer);
  }, [playing]);

  return <div ref={stage} className={`homiq-product-film${playing ? " is-playing" : ""}`} aria-label="HOMIQ product walkthrough">
    <div className="homiq-phone-stage">
      <div className="homiq-phone homiq-phone-back homiq-phone-left" aria-hidden="true"><img src="/homiq/screens/welcome.png" width="390" height="844" alt="" decoding="async" /></div>
      <div className="homiq-phone homiq-phone-back homiq-phone-right" aria-hidden="true"><img src="/homiq/screens/scene-set-device-states.png" width="390" height="844" alt="" decoding="async" /></div>
      <div className="homiq-phone homiq-phone-main">
        {frames.map((frame, index) => <img key={frame.screen} src={`/homiq/screens/${frame.screen}.png`} width="390" height="844" alt={index === active ? `HOMIQ ${frame.title} screen` : ""} aria-hidden={index !== active} className={index === active ? "is-active" : ""} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} />)}
      </div>
      <div className="homiq-film-caption"><span>{frames[active].title}</span><p>{frames[active].detail}</p></div>
    </div>
    <div className="homiq-film-controls">
      <button className="homiq-film-toggle" onClick={() => { setReducedMotion(false); setPaused(playing); }} aria-label={playing ? "Pause product walkthrough" : "Play product walkthrough"}><svg viewBox="0 0 20 20" aria-hidden="true">{playing ? <path d="M6 5v10M14 5v10" /> : <path d="m7 4 9 6-9 6Z" />}</svg></button>
      <div className="homiq-film-dots" aria-label="Choose a walkthrough screen">{frames.map((frame, index) => <button key={frame.screen} aria-label={`Show ${frame.title}`} aria-pressed={index === active} onClick={() => { setActive(index); setPaused(true); }}><span /></button>)}</div>
      
    </div>
  </div>;
}
