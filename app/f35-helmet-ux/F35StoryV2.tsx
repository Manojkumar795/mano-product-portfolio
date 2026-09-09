"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import F35ModelViewer from "./F35ModelViewer";
import VisorHUD from "./VisorHUD";
import { EXHAUST_ANCHOR } from "./hudGeometry";
import styles from "./F35StoryV2.module.css";
import { CALIBRATION_DURATION_MS, getCalibrationGeometry } from "./calibrationGeometry";

type SectionId = "perception" | "targeting" | "context" | "calibration" | "cognitive-load";

const sections: Array<{ id: SectionId; label: string }> = [
  { id: "perception", label: "Perception" },
  { id: "targeting", label: "Targeting" },
  { id: "context", label: "360° Context" },
  { id: "calibration", label: "Calibration" },
  { id: "cognitive-load", label: "Cognitive Load" },
];

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(Math.max(value, minimum), maximum);

function useStoryExperience() {
  const [active, setActive] = useState<SectionId>("perception");

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-f35-v2-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.visible);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7%" },
    );
    reveals.forEach((item) => revealObserver.observe(item));

    const ambientObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { threshold: 0.05 });
    document.querySelectorAll("[data-ambient-scene]").forEach((scene) => ambientObserver.observe(scene));

    const storySections = sections.map(({ id }) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrubSections = Array.from(document.querySelectorAll<HTMLElement>("[data-f35-v2-scrub]"));
    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const readingLine = Math.min(window.innerHeight * 0.35, 320);
        const current = storySections.find((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= readingLine && bounds.bottom > readingLine;
        });
        if (current) setActive((previous) => previous === current.id ? previous : current.id as SectionId);
        scrubSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const travel = Math.max(rect.height - window.innerHeight, 1);
          const scrub = reducedMotion ? 1 : clamp(-rect.top / travel);
          if (section.dataset.f35V2Scrub === "context") {
            const reveal = clamp((scrub - 0.16) / 0.62);
            section.style.setProperty("--context-opacity", String(reveal));
            section.style.setProperty("--context-clip", `${(1 - reveal) * 100}%`);
            section.style.setProperty("--physical-opacity", String(1 - reveal * 0.78));
            section.dataset.phase = scrub < 0.25 ? "physical" : scrub < 0.7 ? "reveal" : "restored";
            const model = section.querySelector<HTMLElement>("[data-context-model]");
            if (model) model.inert = section.dataset.phase !== "restored";
          }
        });
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      revealObserver.disconnect();
      ambientObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { active };
}

function Navigation({ active }: { active: SectionId }) {
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const current = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !current || nav.scrollWidth <= nav.clientWidth) return;
    const navBounds = nav.getBoundingClientRect();
    const itemBounds = current.getBoundingClientRect();
    nav.scrollTo({ left: nav.scrollLeft + itemBounds.left - navBounds.left - (nav.clientWidth - itemBounds.width) / 2, behavior: "auto" });
  }, [active]);

  return (
    <header className={styles.navigation}>
      <Link href="/" className={styles.studyMark} aria-label="Return to selected work">
        <span>F-35</span> / Human factors
      </Link>
      <nav ref={navRef} aria-label="Case study sections">
        {sections.map(({ id, label }, index) => (
          <a href={`#${id}`} className={active === id ? styles.activeNav : ""} aria-current={active === id ? "location" : undefined} key={id}>
            <i>{String(index + 1).padStart(2, "0")}</i>{label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero} id="perception" data-story-section>
      <img src="/f35-helmet-ux/hero-front-pilot-aircraft.webp" alt="Front-facing helmeted pilot with an aircraft behind in a graphite sky." width={1586} height={992} fetchPriority="high" decoding="async" />
      <div className={styles.heroShade} aria-hidden="true" />
      <VisorHUD />
      <div className={styles.heroCopy}>
        <p>01 / PERCEPTION</p>
        <h1>When the interface<br />becomes part of<br /><span>perception.</span></h1>
        <div className={styles.heroMeaning}>Keep information in the pilot’s view, so attention can stay on what’s happening.</div>
      </div>
      <p className={styles.heroNote}>A study in human factors and interface design.</p>
    </section>
  );
}

function TargetAircraftLock() {
  return (
    <div className={styles.targetLock}>
      <i className={styles.targetFrame} aria-hidden="true" />
      <div className={styles.targetIdentity}>
        <strong>Aircraft ahead</strong>
        <span>16° right · 18.4 NM</span>
      </div>
    </div>
  );
}

function TargetingSection() {
  const [motionPaused, setMotionPaused] = useState(false);
  return (
    <section className={styles.targetingSection} id="targeting" data-story-section>
      <div className={styles.shell}>
        <header className={styles.sectionHeading} data-f35-v2-reveal>
          <p>02 / ATTENTION</p>
          <h2>Information follows<br /><span>attention.</span></h2>
          <div>First locate the aircraft. Then reveal its direction and distance, right where it is needed.</div>
        </header>
        <figure className={styles.targetingScene} data-f35-v2-reveal data-ambient-scene data-motion={motionPaused ? "paused" : "running"} aria-label="Two aircraft in flight, with direction and distance placed beside the aircraft ahead.">
          <img className={styles.trackingSky} src="/f35-helmet-ux/tracking-sky.webp" alt="High-altitude cloudscape behind two aircraft in flight." width={1672} height={941} loading="lazy" decoding="async" />
          <div className={styles.targetingShade} aria-hidden="true" />
          <div className={styles.flightReadouts} aria-label="Flight reference">
            <span><small>SPD</small> 468 <small>KT</small></span>
            <span><small>HDG</small> 304°</span>
            <span><small>ALT</small> 28,640 <small>FT</small></span>
          </div>
          <div className={styles.aircraftField}>
            <div className={styles.leadAircraftWrap}>
              <img className={styles.leadAircraft} src="/f35-helmet-ux/tracking-lead-aircraft.png" alt="" width={1536} height={650} loading="lazy" decoding="async" />
              <span className={styles.afterburner} style={{ left: `${EXHAUST_ANCHOR.x * 100}%`, top: `${EXHAUST_ANCHOR.y * 100}%` }} aria-hidden="true"><i /><b /></span>
            </div>
            <div className={styles.trackedAircraftWrap}>
              <img className={styles.trackedAircraft} src="/f35-helmet-ux/tracking-target-aircraft.png" alt="" width={1520} height={451} loading="lazy" decoding="async" />
              <TargetAircraftLock />
            </div>
          </div>
          <figcaption className={styles.sceneCaption}>Direction and distance stay with the aircraft.</figcaption>
        </figure>
        <div className={styles.sceneControls}>
          <span>Illustrative helmet-mounted view</span>
          <button type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused((paused) => !paused)}>{motionPaused ? "Resume aircraft motion" : "Pause aircraft motion"}<span aria-hidden="true">{motionPaused ? "▷" : "Ⅱ"}</span></button>
        </div>
        <div className={styles.sectionReflection} data-f35-v2-reveal>
          <h3>Keep the detail beside the thing it describes.</h3>
          <p>Position carries meaning. A separate panel makes the user reconnect the two.</p>
        </div>
      </div>
    </section>
  );
}

function ContextSection() {
  return (
    <section className={styles.contextSection} id="context" data-story-section data-f35-v2-scrub="context" data-phase="physical">
      <div className={styles.contextSticky}>
        <header className={styles.contextHeading}>
          <p>03 / 360° CONTEXT</p>
          <h2>Keep the whole<br /><span>picture in view.</span></h2>
          <div>Sensor imagery reveals the view below the aircraft, without losing the pilot’s frame of reference.</div>
        </header>
        <figure className={styles.contextScene}>
          <img className={styles.contextTerrain} src="/f35-helmet-ux/beneath-aircraft-terrain.webp" alt="Mountain terrain below the aircraft." width={1672} height={941} loading="lazy" decoding="async" />
          <img className={styles.contextPhysical} src="/f35-helmet-ux/cockpit-pov-obstruction.webp" alt="Pilot's downward cockpit view with the aircraft structure blocking the terrain below." width={1672} height={941} loading="lazy" decoding="async" />
          <div className={styles.contextReveal} aria-hidden="true"><img src="/f35-helmet-ux/beneath-aircraft-terrain.webp" alt="" width={1672} height={941} loading="lazy" decoding="async" /></div>
          <div className={styles.contextModel} data-context-model inert><F35ModelViewer /></div>
          <figcaption className={styles.contextCaption} aria-hidden="true">
            <span data-context-state="physical">Cockpit view · Scroll to reveal</span>
            <span data-context-state="reveal">Revealing the view below</span>
            <span data-context-state="restored">Surrounding view</span>
          </figcaption>
        </figure>
        <div className={styles.contextReflection}>
          <p>The scene changes; the point of view doesn’t.</p>
          <span>Reveal what’s missing without asking the user to move elsewhere.</span>
        </div>
      </div>
    </section>
  );
}

function CalibrationDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<ReturnType<typeof getCalibrationGeometry> | null>(null);
  const [phase, setPhase] = useState<"idle" | "aligning" | "aligned">("idle");

  useEffect(() => {
    const diagram = diagramRef.current;
    const photograph = diagram?.parentElement?.querySelector("img");
    if (!diagram || !photograph) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let completionTimer: number | undefined;
    let entered = false;

    const positionOverlay = () => {
      if (!photograph.complete || !photograph.naturalWidth) return;
      const { width, height } = photograph.getBoundingClientRect();
      const [x, y] = window.getComputedStyle(photograph).objectPosition.split(" ");
      setGeometry(getCalibrationGeometry(width, height, parseFloat(x) / 100, parseFloat(y) / 100));
    };

    const entryObserver = new IntersectionObserver((entries) => {
      if (entered || !entries.some((entry) => entry.isIntersecting)) return;
      entered = true;
      entryObserver.disconnect();
      if (motionPreference.matches) {
        setPhase("aligned");
      } else {
        setPhase("aligning");
        completionTimer = window.setTimeout(() => setPhase("aligned"), CALIBRATION_DURATION_MS);
      }
    }, { threshold: 0.3, rootMargin: "0px 0px -8% 0px" });

    const onImageReady = () => {
      positionOverlay();
      if (photograph.complete && photograph.naturalWidth && !entered) entryObserver.observe(diagram);
    };
    const onMotionPreferenceChange = () => {
      if (!motionPreference.matches || !entered) return;
      window.clearTimeout(completionTimer);
      setPhase("aligned");
    };

    const resizeObserver = new ResizeObserver(positionOverlay);
    resizeObserver.observe(photograph);
    photograph.addEventListener("load", onImageReady);
    window.addEventListener("resize", positionOverlay);
    motionPreference.addEventListener("change", onMotionPreferenceChange);
    onImageReady();

    return () => {
      window.clearTimeout(completionTimer);
      entryObserver.disconnect();
      resizeObserver.disconnect();
      photograph.removeEventListener("load", onImageReady);
      window.removeEventListener("resize", positionOverlay);
      motionPreference.removeEventListener("change", onMotionPreferenceChange);
    };
  }, []);

  return (
    <div ref={diagramRef} className={styles.calibrationDiagram} data-calibration-state={phase} aria-hidden="true" style={{ "--calibration-duration": `${CALIBRATION_DURATION_MS}ms` } as CSSProperties}>
      {geometry && <>
        {geometry.rays.map((ray, index) => <i key={`ray-${index}`} className={styles.opticalIndicator} data-eye={index === 0 ? "left" : "right"} style={{ left: ray.x, top: ray.y, width: ray.length, "--ray-angle": `${ray.angle}deg` } as CSSProperties} />)}
        {geometry.pupils.map((pupil, index) => <i key={`pupil-${index}`} className={styles.pupilPoint} data-eye={index === 0 ? "left" : "right"} style={{ left: pupil.x, top: pupil.y }} />)}
        <i className={styles.fusedReference} data-eye="left" style={{ left: geometry.reference.x, top: geometry.reference.y }} />
        <i className={styles.fusedReference} data-eye="right" style={{ left: geometry.reference.x, top: geometry.reference.y }} />
      </>}
    </div>
  );
}

function CalibrationSection() {
  return (
    <section className={styles.calibrationSection} id="calibration" data-story-section>
      <div className={styles.calibrationSticky}>
        <div className={styles.calibrationCopy}>
          <p>04 / HUMAN CALIBRATION</p>
          <h2>The interface<br />has to<br />align with the<br /><span>human.</span></h2>
          <div className={styles.calibrationExplanation}>
            <h3>Perception has to remain stable.</h3>
            <p>Calibration adapts the display to the pilot’s eyes — not the pilot to the display.</p>
          </div>
        </div>
        <figure className={styles.calibrationScene}>
          <img src="/f35-helmet-ux/calibration-eyes-v2.webp" alt="Close three-quarter view of a helmeted pilot with both eyes visible for optical alignment." width={1610} height={977} loading="lazy" decoding="async" />
          <div className={styles.calibrationShade} aria-hidden="true" />
          <CalibrationDiagram />
        </figure>
      </div>
    </section>
  );
}

const hierarchyInformation = [
  { label: "Aircraft", value: "Aircraft ahead" },
  { label: "Direction", value: "16° right" },
  { label: "Distance", value: "18.4 NM" },
  { label: "Speed", value: "468 kt" },
  { label: "Heading", value: "304°" },
  { label: "Altitude", value: "28,640 ft" },
];

function CognitiveSection() {
  return (
    <section className={styles.cognitiveSection} id="cognitive-load" data-story-section>
      <div className={styles.shell}>
        <header className={styles.sectionHeading} data-f35-v2-reveal>
          <p>05 / COGNITIVE LOAD</p>
          <h2>Make the important<br /><span>part easy to find.</span></h2>
          <div>Hierarchy tells people where to look first. Everything else can stay available without competing for attention.</div>
        </header>
        <figure className={styles.hierarchyComparison} aria-label="The same six pieces of flight information, shown with equal emphasis and with a clear hierarchy." data-f35-v2-reveal>
          <div className={styles.comparisonHalf} data-hierarchy="equal">
            <h3>Equal emphasis</h3>
            <div className={styles.comparisonScene}>
              <img className={styles.comparisonSky} src="/f35-helmet-ux/tracking-sky.webp" alt="" width={1672} height={941} loading="lazy" />
              <img className={styles.comparisonAircraft} src="/f35-helmet-ux/tracking-target-aircraft.png" alt="" width={1520} height={451} loading="lazy" />
            <dl className={styles.equalInformation}>
              {hierarchyInformation.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            </div>
            <p className={styles.comparisonNote}>Six signals compete for the same attention.</p>
          </div>
          <div className={styles.comparisonHalf} data-hierarchy="prioritized">
            <h3>Clear priority</h3>
            <div className={styles.comparisonScene}>
              <img className={styles.comparisonSky} src="/f35-helmet-ux/tracking-sky.webp" alt="" width={1672} height={941} loading="lazy" />
              <img className={styles.comparisonAircraft} src="/f35-helmet-ux/tracking-target-aircraft.png" alt="" width={1520} height={451} loading="lazy" />
            <div className={styles.prioritizedInformation}>
              <i className={styles.comparisonReticle} aria-hidden="true" />
              <p>{hierarchyInformation[0].value}</p>
              <dl className={styles.primaryInformation}>
                {hierarchyInformation.slice(1, 3).map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <dl className={styles.secondaryInformation}>
                {hierarchyInformation.slice(3).map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
            </div>
            </div>
            <p className={styles.comparisonNote}>One focal point. Supporting detail stays available.</p>
          </div>
          <figcaption>Nothing is removed. Size, grouping and contrast do the work.</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Conclusion() {
  return (
    <footer className={styles.conclusion}>
      <div className={styles.conclusionStatement} data-f35-v2-reveal>
        <h2>Design around<br /><span>the person.</span></h2>
        <p>Keep context close. Give important information room. Make the interface adapt to the person using it.</p>
      </div>
      <div className={styles.conclusionFooter}><div><span>Independent design study · Illustrative interfaces</span><p className={styles.sourceNote}>System references: <a href="https://www.jsf.mil/hmds" target="_blank" rel="noreferrer">F-35 JPO</a> / <a href="https://www.rtx.com/collinsaerospace/what-we-do/industries/military-and-defense/displays-and-controls/airborne/helmet-mounted-displays/f-35-gen-iii-helmet-mounted-display-system" target="_blank" rel="noreferrer">Collins Aerospace</a>. Not an operational display.</p></div><Link href="/">Return to selected work <i>↗</i></Link></div>
    </footer>
  );
}

export default function F35StoryV2() {
  const { active } = useStoryExperience();
  return (
    <div className={styles.page}>
      <Navigation active={active} />
      <main>
        <HeroSection />
        <TargetingSection />
        <ContextSection />
        <CalibrationSection />
        <CognitiveSection />
      </main>
      <Conclusion />
    </div>
  );
}
