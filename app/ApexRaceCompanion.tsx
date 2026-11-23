"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Showcase3D, { type CarFocus } from "./Showcase3D";
import ShowcaseSceneControls, {
  type ShowcaseSceneActions,
} from "./ShowcaseSceneControls";
import { useShowcaseActivity } from "./useShowcaseActivity";

// Fictional roster and weekend: deliberately deterministic, never presented as a live feed.
const drivers = [
  {
    id: "rossi",
    first: "Luca",
    last: "Rossi",
    short: "ROS",
    number: "16",
    team: "Rosso Racing",
    colour: "#eb443c",
    nationality: "ITALY",
    gap: "LEADER",
  },
  {
    id: "hayes",
    first: "Oscar",
    last: "Hayes",
    short: "HAY",
    number: "04",
    team: "Amber Motorsport",
    colour: "#f7a34b",
    nationality: "UNITED KINGDOM",
    gap: "+2.481",
  },
  {
    id: "vega",
    first: "Noah",
    last: "Vega",
    short: "VEG",
    number: "01",
    team: "Veloce GP",
    colour: "#80adff",
    nationality: "SPAIN",
    gap: "+4.106",
  },
];
const details: Record<
  Exclude<CarFocus, "full">,
  { title: string; kicker: string; text: string }
> = {
  cockpit: {
    title: "The driver’s world.",
    kicker: "01 / COCKPIT",
    text: "A compact survival cell surrounds the driver. The halo protects the cockpit, while steering-wheel controls put the car’s settings within reach.",
  },
  "front-wing": {
    title: "Every curve has a purpose.",
    kicker: "02 / FRONT WING",
    text: "The front wing shapes airflow around the tyres and along the car. Its elements help generate downforce and balance grip through a corner.",
  },
  tyres: {
    title: "Where grip begins.",
    kicker: "03 / TYRES",
    text: "Wide slick tyres create the contact patch. Temperature, pressure and wear affect grip, so managing the tyres is part of every race strategy.",
  },
};
const circuit = [
  [35, 116],
  [48, 54],
  [96, 32],
  [190, 34],
  [220, 53],
  [190, 75],
  [226, 97],
  [204, 136],
  [126, 129],
  [105, 99],
  [67, 101],
  [35, 116],
];
function position(progress: number) {
  const distance = (((progress % 1) + 1) % 1) * (circuit.length - 1);
  const index = Math.floor(distance);
  const mix = distance - index;
  return {
    x: circuit[index][0] + (circuit[index + 1][0] - circuit[index][0]) * mix,
    y: circuit[index][1] + (circuit[index + 1][1] - circuit[index][1]) * mix,
  };
}
const initialCountdown = 2 * 86400 + 14 * 3600 + 35 * 60;

export default function ApexRaceCompanion({
  active,
  restartToken = 0,
  ...actions
}: ShowcaseSceneActions & { active: boolean; restartToken?: number }) {
  const { ref, running, reducedMotion } = useShowcaseActivity(active);
  const [section, setSection] = useState<"Home" | "Race" | "Explore">("Home");
  const [selected, setSelected] = useState(0);
  const [focus, setFocus] = useState<CarFocus>("full");
  const [resetKey, setResetKey] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [raceProgress, setRaceProgress] = useState(0.24);
  const [countdown, setCountdown] = useState(initialCountdown);
  const lastRestart = useRef(restartToken);
  useEffect(() => {
    if (lastRestart.current === restartToken) return;
    lastRestart.current = restartToken;
    setSection("Home"); setSelected(0); setFocus("full"); setPlaying(false);
    setRaceProgress(0.24); setCountdown(initialCountdown);
    setResetKey(value => value + 1);
  }, [restartToken]);
  const driver = drivers[selected];
  const interaction = () => actions.onInteract();
  const chooseSection = (value: typeof section) => {
    interaction();
    setSection(value);
    setFocus("full");
    setPlaying(false);
  };
  const chooseDriver = (index: number) => {
    interaction();
    setSelected(index);
  };
  const explore = () => {
    interaction();
    setSection("Explore");
    setFocus("cockpit");
  };
  const reset = () => {
    setPlaying(false);
    setRaceProgress(0.24);
    setCountdown(initialCountdown);
    setFocus("full");
    setResetKey((value) => value + 1);
  };
  useEffect(() => {
    if (!active) {
      setPlaying(false);
      setRaceProgress(0.24);
      setCountdown(initialCountdown);
      setSection("Home");
      setFocus("full");
    }
  }, [active]);
  useEffect(() => {
    if (!running || !playing || section !== "Race") return;
    const timer = window.setInterval(
      () =>
        setRaceProgress((current) => {
          const next = current + 0.007;
          return Math.min(next, 46);
        }),
      reducedMotion ? 1000 : 250,
    );
    return () => window.clearInterval(timer);
  }, [running, playing, section, reducedMotion]);
  useEffect(() => {
    if (raceProgress >= 46) setPlaying(false);
  }, [raceProgress]);
  useEffect(() => {
    if (!running || section !== "Home") return;
    const timer = window.setInterval(
      () => setCountdown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [running, section]);
  const days = Math.floor(countdown / 86400);
  const hours = Math.floor((countdown % 86400) / 3600);
  const minutes = Math.floor((countdown % 3600) / 60);
  const seconds = countdown % 60;
  const lap = Math.min(58, 12 + Math.floor(raceProgress));
  const panel = focus === "full" ? null : details[focus];
  return (
    <div
      ref={ref}
      style={{ "--apex-accent": driver.colour } as CSSProperties}
      data-driver={driver.id}
      className={`system-slide apex-app-slide showcase-app-slide${active ? " is-active" : ""}`}
      id="showcase-slide-3"
      aria-hidden={!active}
      inert={!active}
    >
      <header className="showcase-app-header apex-app-header">
        <div className="apex-wordmark">
          APEX<span>RACE COMPANION</span>
        </div>
        <nav aria-label="APEX app sections">
          {(["Home", "Race", "Explore"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={item === section ? "selected" : ""}
              aria-current={item === section ? "page" : undefined}
              onClick={() => chooseSection(item)}
            >
              {item}
            </button>
          ))}
        </nav>
        <ShowcaseSceneControls {...actions} />
      </header>
      <div className={`apex-app-body apex-section-${section.toLowerCase()}`}>
        <>
            <section className="apex-car-stage" aria-label="3D car showcase" hidden={section === "Race"}>
              <div className="apex-stage-title">
                <small>
                  {section === "Home"
                    ? "YOUR PADDOCK. YOUR PERSPECTIVE."
                    : "GET CLOSER TO THE DETAILS."}
                </small>
                <h3>
                  {section === "Home" ? (
                    <>
                      Beyond the
                      <br />
                      chequered flag.
                    </>
                  ) : (
                    "Explore the car."
                  )}
                </h3>
              </div>
              <span className="apex-stage-number" aria-hidden="true">
                {driver.number}
              </span>
              <Showcase3D
                kind="car"
                active={active && section !== "Race"}
                colour={driver.colour}
                focus={focus}
                resetKey={resetKey}
                interactive={section === "Explore"}
                onInteract={interaction}
              />
              {section === "Explore" && (
                <div className="apex-hotspots" aria-label="Car detail hotspots">
                  {(["front-wing", "tyres", "cockpit"] as const).map(
                    (part, index) => (
                      <button
                        key={part}
                        type="button"
                        aria-pressed={focus === part}
                        onClick={() => {
                          interaction();
                          setFocus(part);
                        }}
                      >
                        <i>{index + 1}</i>
                        {part === "front-wing"
                          ? "Front wing"
                          : part === "tyres"
                            ? "Tyres"
                            : "Cockpit"}
                      </button>
                    ),
                  )}
                </div>
              )}
              <div className="apex-stage-caption">
                <span>{driver.team} / Concept livery</span>
                <span>
                  3D /{" "}
                  {focus === "full"
                    ? "FULL CAR"
                    : focus.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </section>
            <aside className="apex-side-panel" hidden={section === "Race"}>
              {section === "Home" ? (
                <>
                  <div className="apex-driver-card">
                    <div className="apex-label">
                      SELECTED DRIVER <span>DEMO ROSTER</span>
                    </div>
                    <div className="apex-driver-name">
                      <span>{driver.first}</span>
                      <h4>
                        {driver.last}
                        <b>{driver.number}</b>
                      </h4>
                    </div>
                    <p>
                      <i />
                      {driver.team}
                    </p>
                    <small>{driver.nationality} · OPEN-WHEEL RACING</small>
                  </div>
                  <div
                    className="apex-driver-selector"
                    aria-label="Select driver"
                  >
                    {drivers.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Select ${item.first} ${item.last}`}
                        aria-pressed={index === selected}
                        onClick={() => chooseDriver(index)}
                        style={
                          { "--driver-colour": item.colour } as CSSProperties
                        }
                      >
                        <span>{item.number}</span>
                        {item.short}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="apex-primary-action"
                    onClick={explore}
                  >
                    Explore car <span>↗</span>
                  </button>
                  <div className="apex-weekend-card">
                    <div className="apex-label">
                      NEXT DEMO WEEKEND <span>ROUND 06</span>
                    </div>
                    <h4>Riviera Grand Prix</h4>
                    <p>Sunday · 15:00 / Fixed sample schedule</p>
                    <div
                      className="apex-countdown"
                      aria-label={`Demo countdown ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`}
                    >
                      <b>
                        {String(days).padStart(2, "0")}
                        <small>DAYS</small>
                      </b>
                      <em>:</em>
                      <b>
                        {String(hours).padStart(2, "0")}
                        <small>HRS</small>
                      </b>
                      <em>:</em>
                      <b>
                        {String(minutes).padStart(2, "0")}
                        <small>MIN</small>
                      </b>
                      <em>:</em>
                      <b>
                        {String(seconds).padStart(2, "0")}
                        <small>SEC</small>
                      </b>
                    </div>
                  </div>
                  <div className="apex-mobile-weekend">
                    <span>Riviera GP · Demo weekend</span>
                    <b>
                      {days}d {hours}h {minutes}m
                    </b>
                  </div>
                </>
              ) : (
                <>
                  <div className="apex-detail-panel" aria-live="polite">
                    <div className="apex-label">
                      {panel?.kicker || "THE CAR / OVERVIEW"}
                    </div>
                    <h4>{panel?.title || "Built around speed."}</h4>
                    <p>
                      {panel?.text ||
                        "Orbit the car, then choose a hotspot to look closer. Explore the cockpit, front wing and tyres from a new perspective."}
                    </p>
                    <div className="apex-detail-fact">
                      <span>CONCEPT CAR</span>
                      <b>{driver.team}</b>
                      <small>
                        Illustrative geometry, simplified for exploration.
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="apex-secondary-action"
                    onClick={() => {
                      interaction();
                      setFocus("full");
                      setResetKey((value) => value + 1);
                    }}
                  >
                    ↙ Back to full car
                  </button>
                  <button
                    type="button"
                    className="apex-text-action"
                    onClick={() => chooseSection("Home")}
                  >
                    Return to your paddock →
                  </button>
                </>
              )}
            </aside>
          </>
        {section === "Race" && (
          <>
            <section className="apex-race-positions">
              <div className="apex-label">
                RIVIERA GRAND PRIX <span>DEMO RACE</span>
              </div>
              <div className="apex-race-heading">
                <h3>The race, at a glance.</h3>
                <span>
                  LAP <b>{lap}</b> / 58
                </span>
              </div>
              <div
                className="apex-lap-progress"
                role="progressbar"
                aria-label="Demo race lap progress"
                aria-valuemin={0}
                aria-valuemax={58}
                aria-valuenow={lap}
              >
                <i style={{ width: `${(lap / 58) * 100}%` }} />
              </div>
              <div className="apex-position-labels">
                <span>POSITION / DRIVER</span>
                <span>GAP</span>
              </div>
              <div className="apex-position-list">
                {drivers.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={index === selected ? "selected" : ""}
                    aria-label={`Select ${item.first} ${item.last}, position ${index + 1}`}
                    aria-pressed={index === selected}
                    onClick={() => chooseDriver(index)}
                    style={{ "--driver-colour": item.colour } as CSSProperties}
                  >
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <i />
                    <span>
                      <strong>
                        {item.first} {item.last}
                      </strong>
                      <small>{item.team}</small>
                    </span>
                    <em>{item.gap}</em>
                  </button>
                ))}
              </div>
              <div className="apex-race-controls">
                <button
                  type="button"
                  className="apex-primary-action"
                  aria-pressed={playing}
                  onClick={() => {
                    interaction();
                    if (raceProgress >= 46) setRaceProgress(0.24);
                    setPlaying(!playing);
                  }}
                >
                  {playing
                    ? "Ⅱ Pause race"
                    : raceProgress >= 46
                      ? "↺ Replay race"
                      : "▶ Play race"}
                </button>
                <button
                  type="button"
                  aria-label="Reset demo race"
                  onClick={() => {
                    interaction();
                    reset();
                  }}
                >
                  ↺ Reset
                </button>
              </div>
            </section>
            <section className="apex-circuit-panel">
              <div className="apex-label">
                CIRCUIT VIEW{" "}
                <span>{playing ? "SIMULATION RUNNING" : "PAUSED"}</span>
              </div>
              <svg
                viewBox="0 0 260 166"
                role="img"
                aria-label={`Demo circuit, ${driver.first} ${driver.last} selected`}
              >
                <defs>
                  <pattern
                    id="apex-map-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M20 0H0V20"
                      fill="none"
                      stroke="#2c2d30"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="260" height="166" fill="url(#apex-map-grid)" />
                <path
                  d={`M${circuit.map((p) => p.join(",")).join("L")}`}
                  fill="none"
                  stroke="#343538"
                  strokeWidth="12"
                  strokeLinejoin="round"
                />
                <path
                  d={`M${circuit.map((p) => p.join(",")).join("L")}`}
                  fill="none"
                  stroke="#7b7a77"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M104 126V134" stroke="#f2ede4" strokeWidth="4" />
                {drivers.map((item, index) => {
                  const p = position(raceProgress - index * 0.045);
                  return (
                    <g
                      key={item.id}
                      className={index === selected ? "selected" : ""}
                      data-driver-marker={item.id}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={index === selected ? 11 : 6}
                        fill={item.colour}
                        fillOpacity={index === selected ? 0.18 : 0.1}
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={index === selected ? 4.5 : 3}
                        fill={item.colour}
                        stroke={index === selected ? "#fff7e9" : "none"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={p.x + 8}
                        y={p.y - 9}
                        fontSize="8"
                        fill={index === selected ? "#f2ede4" : "#ada9a2"}
                      >
                        {item.short}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="apex-tracking-card">
                <span style={{ background: driver.colour }}>
                  {driver.number}
                </span>
                <div>
                  <small>FOLLOWING / P{selected + 1}</small>
                  <strong>
                    {driver.first} {driver.last}
                  </strong>
                  <p>Highlighted on circuit</p>
                </div>
              </div>
              <p className="apex-sample-note">
                Fictional drivers, circuit and timings.
                <br />A deterministic race simulation.
              </p>
            </section>
          </>
        )}
      </div>
      <footer className="showcase-app-footer apex-app-footer">
        <span>
          <i /> APEX / INTERACTIVE CONCEPT
        </span>
        <span>Demo data · Unofficial fan app</span>
        <span>04 / 04</span>
      </footer>
    </div>
  );
}
