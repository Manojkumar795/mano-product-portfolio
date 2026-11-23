"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { FaPlane } from "react-icons/fa6";
import AltitudeStage from "./AltitudeStage";
import AltitudeAircraftViewer from "./AltitudeAircraftViewer";
import type { ShowcaseSceneActions } from "./ShowcaseSceneControls";
import { useShowcaseActivity } from "./useShowcaseActivity";
import {
  AIRCRAFT_PARTS,
  journeyPhase,
  flightTiming,
  type AircraftPart,
  type AltitudeView,
} from "./altitude-journey";
import "./altitude.css";

/** ALTITUDE occupies only the original third showcase slot. */
export default function FlightControl({
  active,
  restartToken = 0,
  ...actions
}: ShowcaseSceneActions & { active: boolean; restartToken?: number }) {
  const { ref, running, reducedMotion } = useShowcaseActivity(active);
  const [progress, setProgress] = useState(56);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<AltitudeView>("journey");
  const [part, setPart] = useState<AircraftPart>("full");
  const [resetKey, setResetKey] = useState(0);
  const lastRestart = useRef(restartToken);
  useEffect(() => {
    if (lastRestart.current === restartToken) return;
    lastRestart.current = restartToken;
    setView("journey"); setPart("full"); setProgress(56);
    setPlaying(!reducedMotion);
    setResetKey(value => value + 1);
  }, [restartToken, reducedMotion]);
  const phase = journeyPhase(progress);
  const timing = flightTiming(progress);
  const navigate = (next: AltitudeView) => {
    actions.onInteract();
    setView(next);
    setPlaying(next === "journey" && progress < 100 && !reducedMotion);
    if (next === "aircraft") setPart("full");
  };
  const selectPart = (next: AircraftPart) => {
    actions.onInteract();
    setPart(next);
  };
  useEffect(() => {
    if (!active) {
      setPlaying(false);
      }
    if (active && !reducedMotion) setPlaying(view === "journey" && progress < 100);
    if (reducedMotion) setPlaying(false);
  }, [active, reducedMotion]);
  useEffect(() => {
    if (!running || !playing || view !== "journey") return;
    const timer = window.setInterval(
      () =>
        setProgress((value) =>
          Math.min(100, value + (reducedMotion ? 1 : 0.12)),
        ),
      reducedMotion ? 1000 : 100,
    );
    return () => window.clearInterval(timer);
  }, [running, playing, view, reducedMotion]);
  useEffect(() => {
    if (progress >= 100) setPlaying(false);
  }, [progress]);

  return (
    <div
      ref={ref}
      className={`system-slide altitude-slide showcase-app-slide${active ? " is-active" : ""}`}
      id="showcase-slide-2"
      aria-hidden={!active}
      inert={!active}
      data-view={view}
      data-motion={running && playing && !reducedMotion && view === "journey"}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="altitude-content">
        <section
          className="altitude-world"
          aria-label={
            view === "aircraft" ? "Aircraft inspection" : "Pacific journey"
          }
        >
          <AltitudeStage
            active={running}
            progress={progress}
            ambientMotion={view !== "aircraft" && !reducedMotion}
            inspecting={view === "aircraft"}
            part={part}
            resetKey={resetKey}
            onExplore={() => navigate("aircraft")}
            onPart={selectPart}
            onInteract={actions.onInteract}
          />
          <div className="altitude-journey-title">
            <p className="altitude-eyebrow">
              ALTITUDE
            </p>
            <h3>
              {view === "aircraft" ? (
                "Made for the journey."
              ) : (
                <>
                  LAX <span>→</span> HND
                </>
              )}
            </h3>
            <div className="altitude-journey-subline">
            <p>
              {view === "aircraft"
                ? "Explore your aircraft"
                : "Los Angeles to Tokyo"}
            </p>

            </div>
          </div>
          {view === "aircraft" && (
            <div
              className="altitude-part-controls"
              aria-label="Aircraft hotspots"
            >
              {(["engine", "wing", "cabin"] as const).map((key) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={part === key}
                  onClick={() => selectPart(key)}
                >
                  <span>+</span>
                  {AIRCRAFT_PARTS[key].title}
                </button>
              ))}
            </div>
          )}
        </section>

        <aside className="altitude-overview" aria-label="Journey information">
          <nav className="altitude-panel-nav" aria-label="Journey sections">
            {(["journey", "aircraft", "arrival"] as const).map(item => <button type="button" key={item} aria-current={view === item ? "page" : undefined} onClick={() => navigate(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
          </nav>
          {view === "journey" && (
            <>
              <section className="altitude-flight-timing" aria-label="Flight schedule">
                
                <div className="altitude-route-times">
                  <div><strong>LAX</strong><span className="altitude-airport-name">Los Angeles</span><span className="altitude-flight-date">8 Oct 2026</span><time dateTime={timing.departureISO}>{timing.departureTime} <small>{timing.departureZone}</small></time></div>
                  <div><strong>HND</strong><span className="altitude-airport-name">Tokyo Haneda</span><span className="altitude-flight-date">9 Oct · +1 day</span><time dateTime={timing.arrivalISO}>{timing.arrivalTime} <small>{timing.arrivalZone}</small></time></div>
                </div>
                <div className="altitude-route-line" aria-hidden="true" style={{ "--route-progress": `${progress}%` } as CSSProperties}><i /><span><FaPlane /></span><b /></div>
                <div className="altitude-duration"><span>{timing.duration} total</span><strong>{timing.remaining} remaining</strong></div>
                <div className="altitude-flight-status"><strong>{phase.title}</strong></div>
              </section>
            </>
          )}
          {view === "aircraft" && (
            <div className="altitude-detail-panel" aria-live="polite">
              <p className="altitude-eyebrow">AIRCRAFT EXPLORER</p>
              <h4>{AIRCRAFT_PARTS[part].title}</h4>
              <p>{AIRCRAFT_PARTS[part].text}</p>

            </div>
          )}
          {view === "arrival" && (
            <div className="altitude-detail-panel altitude-arrival-panel">
              <p className="altitude-eyebrow">SAMPLE ARRIVAL</p>
              <h4>Hello, Tokyo.</h4>
              <p>Your next chapter starts at Haneda.</p>
              <dl>
                <div>
                  <dt>Airport</dt>
                  <dd>Tokyo Haneda · HND</dd>
                </div>
                <div>
                  <dt>Local timezone</dt>
                  <dd>JST · UTC +9</dd>
                </div>
                <div>
                  <dt>Demo arrival</dt>
                  <dd>{timing.arrivalTime} {timing.arrivalZone} · 9 Oct</dd>
                </div>
                <div>
                  <dt>Into the city</dt>
                  <dd>Rail, bus or taxi</dd>
                </div>
              </dl>
              <p className="altitude-detail-note">
                Illustrative itinerary. Confirm your terminal and connections
                with your airline.
              </p>
              <button
                type="button"
                className="altitude-primary"
                onClick={() => navigate("journey")}
              >
                Return to journey <span>→</span>
              </button>
            </div>
          )}
          {view === "discover" && (
            <div className="altitude-detail-panel altitude-discover-panel">
              <p className="altitude-eyebrow">ALONG THE WAY</p>
              <h4>A different perspective.</h4>
              <p>
                A great-circle route curves north across the Pacific, following
                the shorter path around the Earth.
              </p>
              <button
                type="button"
                onClick={() => {
                  actions.onInteract();
                  setProgress(50);
                  setResetKey((value) => value + 1);
                  setView("journey");
                }}
              >
                <span>01</span>
                <div>
                  <strong>Across the Pacific</strong>
                  <small>Explore the halfway point</small>
                </div>
                <b>↗</b>
              </button>
              <button type="button" onClick={() => navigate("aircraft")}>
                <span>02</span>
                <div>
                  <strong>Behind the journey</strong>
                  <small>Meet your aircraft</small>
                </div>
                <b>↗</b>
              </button>
              <button type="button" onClick={() => navigate("arrival")}>
                <span>03</span>
                <div>
                  <strong>Your Tokyo arrival</strong>
                  <small>View a sample arrival guide</small>
                </div>
                <b>↗</b>
              </button>
            </div>
          )}
          <AltitudeAircraftViewer active={running && view === "journey"} hidden={view !== "journey"} resetKey={resetKey} />
        </aside>
      </div>

    </div>
  );
}
