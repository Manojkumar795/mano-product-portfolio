"use client";

import { useEffect, useRef, useState } from "react";
import NikeShoePreview from "./NikeShoePreview";
import FlightControl from "./FlightControl";
import FrameRate from "./FrameRate";
import { useShowcaseActivity } from "./useShowcaseActivity";
import { SHOE_STORIES, type ShoeStory } from "./stride-motion";

const showcaseDurations = [4800, 6000, 6000, 4800];
const selectedSlideDuration = 7000;
const slideNames = ["MachineOS", "STRIDE", "ALTITUDE", "FRAME RATE"];
const keepSlideshowPlaying = () => {};

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

function MachineSystem({ active, restartToken }: { active: number; restartToken: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!restartToken) return;
    ref.current?.getAnimations({ subtree: true }).forEach(animation => {
      if (animation instanceof CSSAnimation) animation.currentTime = 0;
    });
  }, [restartToken]);
  return (
    <div
      ref={ref}
      className={`system-slide machine-system-slide machine-library-slide${active === 0 ? " is-active" : ""}`}
      id="showcase-slide-0"
      aria-hidden={active !== 0}
      inert={active !== 0}
    >
      <header className="machine-library-head">
        <div>
          <strong>MachineOS</strong>
          <small>Industrial design system</small>
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
            <div className="machine-source-specimen">
              <span>Control source</span>
              <div className="machine-source-field">
                <strong>Local panel</strong>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
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

function CommerceSystem({ active, restartToken }: { active: number; restartToken: number }) {
  const [entrance, setEntrance] = useState(0);
  const [story, setStory] = useState<ShoeStory>(0);
  const [size, setSize] = useState(8);
  const [bag, setBag] = useState(0);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (active === 1) { setEntrance(value => value + 1); setStory(0); }
  }, [active, restartToken]);
  const copy = SHOE_STORIES[story];
  return (
    <div
      className={`system-slide hero-commerce-slide${active === 1 ? " is-active" : ""}`}
      id="showcase-slide-1"
      aria-hidden={active !== 1}
      inert={active !== 1}
      data-story={story}
    >
      <header className="hero-commerce-head">
        <div className="hero-commerce-wordmark">stride<span>®</span></div>
        <nav><span className="active">Discover</span><span>Running</span><span>Everyday</span></nav>
        <span className="hero-commerce-bag" aria-label={`Demo bag, ${bag} ${bag === 1 ? "item" : "items"}`}>Bag <b>{bag}</b></span>
      </header>
      <div className="hero-commerce-body">
        <section className="hero-commerce-photo">
          <small>THE EVERYDAY EDIT</small>
          <div className="hero-commerce-image">
            <NikeShoePreview active={active === 1} moving resetKey={entrance} onInteract={keepSlideshowPlaying} onStoryChange={setStory} />
          </div>
          <span>Built for the miles ahead.</span>
        </section>
        <section className="hero-commerce-details">
          <div className="hero-commerce-category"><span>Lifestyle sneaker</span></div>
          <h3>Air Max Plus</h3>
          <div className="hero-commerce-story">
            <div key={`${entrance}-${story}`} className="commerce-story-copy">
              <h4>{copy.title}</h4>
              <p>{copy.description}</p>
            </div>
            <i className="commerce-story-accent" aria-hidden="true" />
          </div>
          <div className="hero-commerce-colours"><p>Colour <b>Sunset</b></p><div><button type="button" tabIndex={active === 1 ? 0 : -1} className="commerce-colour-sunset selected" aria-label="Sunset, original model colour" aria-pressed="true" /></div></div>
          <div className="hero-commerce-sizes"><p>Select size</p><div>{[6,7,8,9,10].map(option=><button type="button" key={option} tabIndex={active === 1 ? 0 : -1} className={option === size ? "selected" : ""} aria-label={`Size ${option}`} aria-pressed={option === size} onClick={() => { setSize(option); setAdded(false); }}>{option}</button>)}</div></div>
          <button type="button" className="hero-commerce-add" tabIndex={active === 1 ? 0 : -1} onClick={() => { setBag(count => count + 1); setAdded(true); }}>{added ? "Added to bag" : "Add to bag"}<b aria-hidden="true">{added ? "✓" : "+"}</b></button>
          <p className="hero-commerce-delivery" role="status">{added ? `Sunset · Size ${size} added to demo bag` : "Shopping preview · No checkout"}</p>
        </section>
      </div>
      <footer className="hero-commerce-footer"><span>No live pricing</span><span>3D: <a href="https://sketchfab.com/3d-models/nike-air-max-plus-sunset-2df7e6025d29489192c92bd81fed0b54" target="_blank" rel="noreferrer" tabIndex={active === 1 ? 0 : -1}>SRUSH651</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" tabIndex={active === 1 ? 0 : -1}>CC BY 4.0</a></span></footer>
    </div>
  );
}

export default function HeroSystemShowcase() {
  const [activeSystem, setActiveSystem] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manuallySelected, setManuallySelected] = useState(false);
  const [slideRestarts, setSlideRestarts] = useState([0, 0, 0, 0]);
  const { ref, running, reducedMotion } = useShowcaseActivity(true);
  const [frameFocused, setFrameFocused] = useState(false);
  const interacting = activeSystem === 3 && frameFocused;
  const elapsed = useRef(0);
  const countdown = useRef<HTMLElement>(null);
  const selectSlide = (step: number) => {
    setManuallySelected(true);
    elapsed.current = 0;
    setActiveSystem(current => (current + step + slideNames.length) % slideNames.length);
  };
  const restartSlide = (index: number) => {
    setManuallySelected(true);
    setActiveSystem(index);
    setSlideRestarts(current => current.map((count, slide) => slide === index ? count + 1 : count));
  };
  const sceneActions = { paused, onInteract: keepSlideshowPlaying, onPause: () => setPaused(true), onResume: () => setPaused(false), onNext: () => selectSlide(1), onPrevious: () => selectSlide(-1) };

  useEffect(() => {
    elapsed.current = 0;
    if (countdown.current) countdown.current.style.transform = "scaleX(0)";
  }, [activeSystem, slideRestarts]);
  useEffect(() => {
    if (reducedMotion) setPaused(true);
  }, [reducedMotion]);
  useEffect(() => {
    if (paused || interacting || !running) return;
    const duration = manuallySelected ? selectedSlideDuration : showcaseDurations[activeSystem];
    let frame = 0;
    let previous: number | null = null;
    const tick = (time: number) => {
      if (previous !== null) elapsed.current += Math.min(100, time - previous);
      previous = time;
      if (countdown.current) countdown.current.style.transform = `scaleX(${Math.min(1, elapsed.current / duration)})`;
      if (elapsed.current >= duration) {
        setManuallySelected(false);
        setActiveSystem(current => (current + 1) % slideNames.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeSystem, slideRestarts, paused, manuallySelected, interacting, running]);

  return (
    <div
      className={`hero-art hero-control-system hero-system-rotator hero-showcase-shell system-theme-${[1, 4, 2, 5][activeSystem]}`}
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      aria-label="Product showcase: MachineOS, STRIDE Ecommerce, ALTITUDE, FRAME RATE. Use left and right arrow keys to change slides."
      onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); selectSlide(event.key === "ArrowRight" ? 1 : -1); } if (event.key === "Home") { event.preventDefault(); restartSlide(0); } }}
    >
      <div className="showcase-viewport">
      <MachineSystem active={activeSystem} restartToken={slideRestarts[0]} />
      <CommerceSystem active={activeSystem} restartToken={slideRestarts[1]} />
      <FlightControl active={activeSystem === 2} restartToken={slideRestarts[2]} {...sceneActions} />
      <FrameRate active={activeSystem === 3} onFocusChange={setFrameFocused} />
      </div>
      <div className="showcase-selector">
        <nav aria-label="Portfolio showcase slides">
          {slideNames.map((name, index) => (
            <button type="button" key={name} aria-current={activeSystem === index ? "true" : undefined}
              aria-controls={`showcase-slide-${index}`} onClick={() => restartSlide(index)}>
              <span>{name}</span>
              <span className="showcase-countdown" aria-hidden="true">
                {activeSystem === index && <i ref={countdown} />}
              </span>
            </button>
          ))}
        </nav>
        <div className="showcase-playback">
          <button type="button" onClick={() => setPaused(current => !current)} aria-label={paused ? "Play portfolio slideshow" : "Pause portfolio slideshow"}>
            <svg viewBox="0 0 16 16" aria-hidden="true">{paused ? <path d="M5 3.5v9l7-4.5z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}</svg>
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}
