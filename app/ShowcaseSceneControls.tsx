"use client";

export type ShowcaseSceneActions = {
  paused: boolean;
  onInteract: () => void;
  onPause: () => void;
  onResume: () => void;
  onNext: () => void;
  onPrevious: () => void;
};

export default function ShowcaseSceneControls({
  paused,
  onPause,
  onResume,
  onNext,
  onPrevious,
}: ShowcaseSceneActions) {
  return (
    <div className="showcase-scene-controls" aria-label="Showcase controls">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous portfolio slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="showcase-play"
        onClick={paused ? onResume : onPause}
        aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
      <button type="button" onClick={onNext} aria-label="Next portfolio slide">
        ›
      </button>
    </div>
  );
}
