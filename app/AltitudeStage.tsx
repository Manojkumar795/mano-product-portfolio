"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useShowcaseActivity } from "./useShowcaseActivity";
import { AIRPORTS, type AircraftPart } from "./altitude-journey";
import type { AltitudeSceneApi, AltitudeSceneState } from "./altitude-scene";

type Props = {
  active: boolean;
  progress: number;
  ambientMotion: boolean;
  inspecting: boolean;
  part: AircraftPart;
  resetKey: number;
  onInteract: () => void;
  onExplore: () => void;
  onPart: (part: AircraftPart) => void;
};
export default function AltitudeStage({
  active,
  progress,
  ambientMotion,
  inspecting,
  part,
  resetKey,
  onInteract,
  onExplore,
  onPart,
}: Props) {
  const { ref, running, reducedMotion } = useShowcaseActivity(active);
  const [warm, setWarm] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const api = useRef<AltitudeSceneApi | null>(null);
  const props = useRef<AltitudeSceneState>({
    running,
    reducedMotion,
    progress,
    ambientMotion,
    inspecting,
    part,
    resetKey,
    onInteract,
    onExplore,
  });
  props.current = {
    running,
    reducedMotion,
    progress,
    ambientMotion,
    inspecting,
    part,
    resetKey,
    onInteract,
    onExplore,
  };
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (running) setWarm(true);
  }, [running]);
  useEffect(() => {
    api.current?.update();
  }, [running, reducedMotion, progress, ambientMotion, inspecting, part, resetKey]);
  useEffect(() => {
    if (!warm || !host.current || !ref.current) return;
    let disposed = false;
    const canvasHost = host.current;
    const labels = ref.current;
    import("./altitude-scene")
      .then(({ createAltitudeScene }) => {
        if (disposed) return;
        api.current = createAltitudeScene(
          canvasHost,
          labels,
          () => props.current,
          (next) => {
            if (!disposed) setStatus(next);
          },
        );
      })
      .catch(() => {
        if (!disposed) setStatus("fallback");
      });
    return () => {
      disposed = true;
      api.current?.dispose();
      api.current = null;
    };
  }, [warm, ref]);
  return (
    <div
      className="altitude-stage"
      ref={ref}
      data-progress={progress}
      data-inspecting={inspecting}
      data-part={part}
      data-reset={resetKey}
      data-rendering={running}
    >
      <div
        className="altitude-canvas"
        ref={host}
        role="region"
        aria-label={
          inspecting
            ? "Interactive 3D aircraft. Drag or use arrow keys to rotate. Home resets the view."
            : "Interactive Pacific globe. Drag or use arrow keys to rotate. Home resets the view. Enter explores the aircraft."
        }
        tabIndex={0}
        onPointerDown={(event) => {
          event.stopPropagation();
          onInteract();
        }}
        onKeyDown={(event) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "Enter",
            ].includes(event.key)
          ) {
            event.preventDefault();
            event.stopPropagation();
            onInteract();
            if (event.key === "Enter") {
              if (!inspecting) onExplore();
            } else api.current?.key(event.key);
          }
        }}
      />
      {!inspecting && (
        <>
          <span className="altitude-projected altitude-ocean-label" data-altitude-anchor="ocean" aria-hidden="true">NORTH PACIFIC<br />OCEAN</span>
          {(["lax", "hnd"] as const).map((airport) => (
            <div
              key={airport}
              className={`altitude-projected altitude-airport altitude-airport-${airport}`}
              data-altitude-anchor={airport}
            >
              <i />
              <span>{AIRPORTS[airport].label}</span>
            </div>
          ))}
        </>
      )}
      {inspecting &&
        (["engine", "wing", "cabin"] as const).map((key) => (
          <button
            type="button"
            key={key}
            className="altitude-projected altitude-hotspot"
            data-altitude-anchor={key}
            aria-label={`Inspect ${key}`}
            aria-pressed={part === key}
            onClick={() => onPart(key)}
          >
            +
          </button>
        ))}
      {status !== "ready" && (
        <div className="altitude-stage-message" role="status">
          <strong>
            {status === "loading"
              ? "Preparing your view of Earth"
              : inspecting
                ? "Aircraft explorer"
                : "Your Pacific crossing"}
          </strong>
          {status === "loading" ? (
            <span>Loading globe & aircraft…</span>
          ) : (
            <>
              <div className="altitude-fallback-route">
                <div>
                  <b>HND</b>
                  <span>
                    <i
                      style={
                        {
                          "--fallback-position": `${100 - progress}%`,
                        } as CSSProperties
                      }
                    >
                      ✈
                    </i>
                  </span>
                  <b>LAX</b>
                </div>
                <span>{Math.round(progress)}% of the sample journey</span>
              </div>
              <span>
                3D is unavailable on this device.
                <br />
                The journey controls and aircraft guide still work.
              </span>
              {!inspecting && (
                <button type="button" onClick={onExplore}>
                  Explore aircraft →
                </button>
              )}
            </>
          )}
        </div>
      )}
      {status === "ready" && (
        <div
          className="altitude-rotation"
          aria-label={inspecting ? "Rotate aircraft" : "Rotate globe"}
        >
          <button
            type="button"
            aria-label="Rotate view left"
            onClick={() => {
              onInteract();
              api.current?.key("ArrowLeft");
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Rotate view right"
            onClick={() => {
              onInteract();
              api.current?.key("ArrowRight");
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
