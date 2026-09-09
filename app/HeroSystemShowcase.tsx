"use client";

import { useEffect, useState } from "react";

const showcaseDuration = 4800;

function SystemRail({
  active,
  code,
}: {
  active: number;
  code: string;
}) {
  return (
    <aside className="control-rail">
      {[0, 1, 2].map((item) => (
        <span className={active === item ? "active" : ""} key={item}>
          0{item + 1}
        </span>
      ))}
      <i />
      <b>{code}</b>
    </aside>
  );
}

function SystemTokens({
  labels,
}: {
  labels: [string, string, string, string];
}) {
  const swatches = [
    "token-normal",
    "token-focus",
    "token-caution",
    "token-critical",
  ];

  return (
    <section className="token-control-panel">
      <header>
        <small>Tokens / 04</small>
        <strong>Semantic color</strong>
      </header>
      <div className="token-swatches">
        {labels.map((label, index) => (
          <span key={label}>
            <i className={swatches[index]} />
            <small>{label}</small>
          </span>
        ))}
      </div>
    </section>
  );
}

function SystemFooter({
  active,
  components,
  variables,
  release,
}: {
  active: number;
  components: string;
  variables: string;
  release: string;
}) {
  return (
    <div className="control-footer">
      <span>Library</span>
      <strong>{components}</strong>
      <i />
      <span>Variables</span>
      <strong>{variables}</strong>
      <i />
      <span>Release</span>
      <strong>{release}</strong>
      <div className="system-progress">
        {[0, 1, 2].map((item) => (
          <span className={active === item ? "active" : ""} key={item} />
        ))}
      </div>
    </div>
  );
}

function MachineSystem({ active }: { active: number }) {
  return (
    <div
      className={`system-slide machine-system-slide machine-library-slide${active === 0 ? " is-active" : ""}`}
      aria-hidden={active !== 0}
    >
      <header className="machine-library-head">
        <div>
          <small>01 / Industrial UI</small>
          <strong>MachineOS</strong>
        </div>
        <nav>
          <span className="active">Components</span>
          <span>Tokens</span>
          <span>Variables</span>
        </nav>
        <span className="machine-library-status">
          <i />
          Stable
        </span>
      </header>

      <div className="machine-library-board">
        <section className="machine-encoder-stage">
          <header>
            <span>Rotary input</span>
            <small>04 variants</small>
          </header>
          <div className="industrial-encoder">
            <i className="encoder-orbit encoder-orbit-a" />
            <i className="encoder-orbit encoder-orbit-b" />
            <div className="encoder-ticks">
              {Array.from({ length: 18 }, (_, index) => (
                <i key={index} style={{ transform: `rotate(${index * 20}deg)` }} />
              ))}
            </div>
            <div className="encoder-core">
              <small>RPM</small>
              <strong>3240</strong>
            </div>
            <span className="encoder-value value-min">0</span>
            <span className="encoder-value value-mid">50</span>
            <span className="encoder-value value-max">100</span>
          </div>
          <div className="machine-button-specimens">
            <button type="button" tabIndex={-1}>
              Run
            </button>
            <button className="secondary" type="button" tabIndex={-1}>
              Hold
            </button>
            <button className="danger" type="button" tabIndex={-1}>
              Stop
            </button>
          </div>
        </section>

        <section className="machine-component-matrix">
          <div className="machine-library-card machine-input-card">
            <header>
              <span>Inputs</span>
              <small>12</small>
            </header>
            <div className="machine-segmented">
              <span className="active">Auto</span>
              <span>Jog</span>
              <span>Setup</span>
            </div>
            <div className="machine-toggle-row">
              <span>Interlock</span>
              <i className="on">
                <b />
              </i>
            </div>
            <div className="machine-toggle-row">
              <span>Coolant</span>
              <i>
                <b />
              </i>
            </div>
          </div>

          <div className="machine-library-card machine-control-card">
            <header>
              <span>Controls</span>
              <small>08</small>
            </header>
            <div className="machine-stepper">
              <button type="button" tabIndex={-1}>
                −
              </button>
              <strong>72</strong>
              <button type="button" tabIndex={-1}>
                +
              </button>
            </div>
            <div className="machine-slider">
              <i>
                <b />
              </i>
              <span>72%</span>
            </div>
          </div>

          <div className="machine-library-card machine-variable-card">
            <header>
              <span>Variables</span>
              <small>18</small>
            </header>
            <div className="machine-variable-list">
              <span>
                <small>Space</small>
                <b>08</b>
              </span>
              <span>
                <small>Radius</small>
                <b>06</b>
              </span>
              <span>
                <small>Stroke</small>
                <b>01</b>
              </span>
            </div>
          </div>
        </section>

        <section className="machine-foundation-rail">
          <div className="machine-type-token">
            <strong>Aa</strong>
            <span>
              <small>Type</small>
              <b>Geist / 12</b>
            </span>
          </div>
          <div className="machine-color-tokens">
            <span>
              <i className="ready" />
              Ready
            </span>
            <span>
              <i className="focus" />
              Focus
            </span>
            <span>
              <i className="caution" />
              Caution
            </span>
            <span>
              <i className="stop" />
              Stop
            </span>
          </div>
        </section>
      </div>

      <SystemFooter
        active={active}
        components="48 components"
        variables="18 tokens"
        release="05.2"
      />
    </div>
  );
}

function CockpitSystem({ active }: { active: number }) {
  return (
    <div
      className={`system-slide cockpit-system-slide aero-library-slide${active === 1 ? " is-active" : ""}`}
      aria-hidden={active !== 1}
    >
      <header className="aero-library-head">
        <div className="aero-mark">A</div>
        <div>
          <small>02 / Avionics UI</small>
          <strong>Aero Interface Kit</strong>
        </div>
        <nav>
          <span className="active">Display</span>
          <span>Control</span>
          <span>Input</span>
          <span>Token</span>
        </nav>
        <small className="aero-library-count">64 components</small>
      </header>

      <div className="aero-library-board">
        <section className="aero-display-tile">
          <header>
            <div>
              <small>Display / PFD</small>
              <strong>Primary flight</strong>
            </div>
            <div className="aero-state-dots">
              <i className="active" />
              <i />
              <i />
            </div>
          </header>
          <div className="aero-display-canvas">
            <div className="aero-mode-line">
              <span>
                <small>A/THR</small>
                <strong>SPEED</strong>
              </span>
              <span>
                <small>AP1</small>
                <strong>NAV</strong>
              </span>
              <span>
                <small>FD</small>
                <strong>ALT*</strong>
              </span>
            </div>
            <div className="aero-flight-layout">
              <div className="aero-speed-scale">
                <small>SPD</small>
                <span>250</span>
                <strong>240</strong>
                <span>230</span>
                <i />
              </div>
              <div className="aero-attitude">
                <div className="aero-horizon-field">
                  <div className="aero-horizon" />
                  <div className="aero-ladder">
                    <span className="pitch-20">
                      <small>20</small>
                      <i />
                      <small>20</small>
                    </span>
                    <span className="pitch-10">
                      <small>10</small>
                      <i />
                      <small>10</small>
                    </span>
                    <span className="pitch-5">
                      <i />
                    </span>
                    <span className="pitch-minus-10">
                      <small>10</small>
                      <i />
                      <small>10</small>
                    </span>
                  </div>
                </div>
                <div className="aero-bank-scale">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <b />
                </div>
                <div className="aero-flight-path">
                  <i />
                  <b />
                  <i />
                </div>
                <div className="aero-aircraft-symbol">
                  <i />
                  <b />
                  <i />
                </div>
                <div className="aero-director">
                  <i />
                  <b />
                </div>
                <span className="aero-radio-alt">
                  RA <strong>2480</strong>
                </span>
              </div>
              <div className="aero-alt-scale">
                <small>ALT</small>
                <span>352</span>
                <strong>
                  <em>FL</em>350
                </strong>
                <span>348</span>
                <i />
                <b>360</b>
              </div>
            </div>
            <div className="aero-heading-scale">
              <span>330</span>
              <span>335</span>
              <strong>
                <small>HDG</small> 340
              </strong>
              <span>345</span>
              <span>350</span>
            </div>
          </div>
        </section>

        <section className="aero-components-tile">
          <header>
            <span>Component states</span>
            <small>28 variants</small>
          </header>
          <div className="aero-button-row">
            <button type="button" tabIndex={-1}>
              Normal
            </button>
            <button className="armed" type="button" tabIndex={-1}>
              Armed
            </button>
            <button className="warning" type="button" tabIndex={-1}>
              Alert
            </button>
          </div>
          <div className="aero-component-row">
            <div className="aero-switch">
              <span>AP1</span>
              <i>
                <b />
              </i>
            </div>
            <div className="aero-switch off">
              <span>FD2</span>
              <i>
                <b />
              </i>
            </div>
            <div className="aero-knob">
              <i />
              <span>80</span>
            </div>
          </div>
          <div className="aero-input-row">
            <span>Range</span>
            <i>
              <b />
            </i>
            <strong>80 NM</strong>
          </div>
        </section>

        <section className="aero-token-tile">
          <header>
            <span>Tokens</span>
            <small>12</small>
          </header>
          <div>
            <span className="normal">
              <i />
              Normal
            </span>
            <span className="selected">
              <i />
              Selected
            </span>
            <span className="caution">
              <i />
              Caution
            </span>
            <span className="critical">
              <i />
              Critical
            </span>
          </div>
        </section>

        <section className="aero-variable-tile">
          <header>
            <span>Variables</span>
            <small>18</small>
          </header>
          <div>
            <span>
              <small>Grid</small>
              <strong>08</strong>
            </span>
            <span>
              <small>Radius</small>
              <strong>06</strong>
            </span>
            <span>
              <small>Motion</small>
              <strong>240</strong>
            </span>
          </div>
        </section>
      </div>

      <SystemFooter
        active={active}
        components="64 components"
        variables="18 tokens"
        release="06.5"
      />
    </div>
  );
}

function RadarSystem({ active }: { active: number }) {
  return (
    <div
      className={`system-slide radar-system-slide${active === 2 ? " is-active" : ""}`}
      aria-hidden={active !== 2}
    >
      <div className="control-topbar">
        <div className="control-title">
          <small>OPS / DS — 03</small>
          <strong>Flight operations radar system</strong>
        </div>
        <div className="control-modes">
          <span className="active">Traffic</span>
          <span>Weather</span>
          <span>Conflict</span>
        </div>
        <span className="control-health">
          <i />
          142 live tracks
        </span>
      </div>

      <div className="control-body">
        <SystemRail active={2} code="OP" />
        <div className="control-canvas">
          <section className="primary-control-panel">
            <header>
              <div>
                <small>Operations map / O-18</small>
                <strong>Track lifecycle overview</strong>
              </div>
              <span>
                <i />
                Synchronized
              </span>
            </header>
            <div className="radar-control-graphic">
              <div className="radar-scope">
                <i className="radar-ring radar-ring-one" />
                <i className="radar-ring radar-ring-two" />
                <i className="radar-ring radar-ring-three" />
                <i className="radar-axis radar-axis-x" />
                <i className="radar-axis radar-axis-y" />
                <i className="radar-beam" />
              </div>
              <span className="radar-track track-a">
                AI 502 <i />
              </span>
              <span className="radar-track track-b">
                6E 214 <i />
              </span>
              <span className="radar-track track-c">
                UK 863 <i />
              </span>
              <span className="radar-track track-d">
                SQ 511 <i />
              </span>
              <div className="radar-route route-a" />
              <div className="radar-route route-b" />
              <div className="weather-cell weather-a" />
              <div className="weather-cell weather-b" />
            </div>
            <footer>
              <div>
                <small>Tracks</small>
                <strong>142 active</strong>
              </div>
              <div>
                <small>Conflicts</small>
                <strong>02 resolved</strong>
              </div>
              <div>
                <small>Handoffs</small>
                <strong>08 queued</strong>
              </div>
            </footer>
          </section>

          <section className="component-control-panel radar-track-panel">
            <header>
              <div>
                <small>Track pattern / T-11</small>
                <strong>Priority queue</strong>
              </div>
              <span>Live</span>
            </header>
            <div className="track-list">
              <span>
                <i className="track-normal" />
                <b>AI 502</b>
                <small>Stable</small>
              </span>
              <span>
                <i className="track-focus" />
                <b>6E 214</b>
                <small>Handoff</small>
              </span>
              <span>
                <i className="track-caution" />
                <b>UK 863</b>
                <small>Weather</small>
              </span>
            </div>
            <div className="state-meter radar-load">
              <span>
                <small>Sector load</small>
                <b>74%</b>
              </span>
              <i>
                <b style={{ width: "74%" }} />
              </i>
            </div>
          </section>

          <SystemTokens labels={["Tracked", "Handoff", "Weather", "Conflict"]} />
        </div>
      </div>

      <SystemFooter
        active={active}
        components="36 components"
        variables="16 tokens"
        release="03.8"
      />
      <div className="control-sweep" />
    </div>
  );
}

export default function HeroSystemShowcase() {
  const [activeSystem, setActiveSystem] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActiveSystem((current) => (current + 1) % 3),
      showcaseDuration,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={`hero-art hero-control-system hero-system-rotator system-theme-${activeSystem + 1}`}
      role="img"
      aria-label="Three rotating product design systems for industrial controls, avionics displays and flight operations radar"
    >
      <MachineSystem active={activeSystem} />
      <CockpitSystem active={activeSystem} />
      <RadarSystem active={activeSystem} />
    </div>
  );
}
