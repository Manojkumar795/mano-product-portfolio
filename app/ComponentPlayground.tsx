"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PlaygroundCanvas from "./PlaygroundCanvas";
import { useShowcaseActivity } from "./useShowcaseActivity";
import { playgroundCanvases, type PlaygroundId } from "../lib/playground-embed";
import "./component-playground.css";

const rows: PlaygroundId[][] = [["music", "ticket", "pizza", "checkout"], ["firstpage", "tonight"]];
const motionDemos = {
  clock: { id: "clock", file: "clock.mp4", title: "Clock", label: "Clock motion demo with animated glass numerals" },
  card: { id: "card", file: "card-loop.mp4", title: "Card Stack", label: "Card Stack motion demo with layered wallet cards" },
};

function MotionDemo({ id, file, title, label }: (typeof motionDemos)[keyof typeof motionDemos]) {
  const { ref, running, reducedMotion } = useShowcaseActivity(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (running && !reducedMotion) {
      void video.play().catch(() => {
        // The poster remains visible if the browser restricts autoplay.
      });
    } else {
      video.pause();
    }
  }, [running, reducedMotion]);

  return (
    <div ref={ref} className="mano-playground-motion-demo">
      <figure>
        <video ref={videoRef} aria-label={label} muted loop playsInline preload="none"
          width={720} height={1280} poster={`/playground-videos/${id}.webp`}
          src={`/playground-videos/${file}`} />
        <figcaption>{title}</figcaption>
      </figure>
    </div>
  );
}

export default function ComponentPlayground() {
  // Keep the checkout column fixed while its review and confirmation heights change.
  const [ratios, setRatios] = useState<Partial<Record<PlaygroundId, number>>>({ checkout: 2 / 3 });
  const measure = useCallback((id: PlaygroundId, height: number, width: number) => {
    const ratio = width / height;
    setRatios(previous => Math.abs((previous[id] ?? 0) - ratio) < .0001 ? previous : { ...previous, [id]: ratio });
  }, []);
  return <section className="mano-playground" id="component-playground" aria-labelledby="component-playground-title">
    <div className="mano-playground-inner">
      <header className="mano-playground-intro">
        <p className="mano-playground-label">Component Playground</p>
        <h2 id="component-playground-title">What I design when there’s no brief.</h2>
        <p className="mano-playground-description">
          A collection of personal experiments in interaction, motion and product design. Ideas I’ve
          explored, designed and brought to life simply because I wanted to see how they would work.
        </p>
      </header>
      <div className="mano-playground-grid">
        {rows.map((ids, index) => <div className={`mano-playground-row mano-playground-row-${index + 1}`} key={index}
          style={ids.every(id => ratios[id]) ? { gridTemplateColumns: ids.map(id => `minmax(0, ${ratios[id]}fr)`).join(" ") } : undefined}>
          {ids.map(id => <article className={`mano-playground-tile mano-playground-${id}`} key={id} aria-label={playgroundCanvases[id].label}>
            <div className="mano-playground-content" data-component={id}>
              <PlaygroundCanvas component={id} onMeasure={id === "checkout" ? undefined : measure} />
            </div>
          </article>)}
        </div>)}
      </div>
      <div className="mano-playground-closing-row">
        <MotionDemo {...motionDemos.clock} />
        <article className="mano-playground-cipher" aria-label={playgroundCanvases.cipher.label}>
          <PlaygroundCanvas component="cipher" />
        </article>
        <article className="mano-playground-circadia" aria-label={playgroundCanvases["circadia"].label}>
          <PlaygroundCanvas component="circadia" />
        </article>
        <article className="mano-playground-milestone" aria-label={playgroundCanvases.milestone.label}>
          <PlaygroundCanvas component="milestone" />
        </article>
        <MotionDemo {...motionDemos.card} />
      </div>
    </div>
  </section>;
}
