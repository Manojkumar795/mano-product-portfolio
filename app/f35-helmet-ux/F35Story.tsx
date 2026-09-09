"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  LuCrosshair,
  LuEye,
  LuLayers3,
  LuRadar,
  LuShieldCheck,
  LuUserCheck,
} from "react-icons/lu";
import styles from "./F35Story.module.css";

type StorySection =
  | "perception"
  | "target-acquisition"
  | "situational-awareness"
  | "cognitive-load"
  | "product-translation";

const observedSections: StorySection[] = [
  "perception",
  "target-acquisition",
  "situational-awareness",
  "cognitive-load",
  "product-translation",
];

const navigation = [
  { id: "target-acquisition", label: "Targeting" },
  { id: "situational-awareness", label: "360° Awareness" },
  { id: "cognitive-load", label: "Cognitive Load" },
  { id: "product-translation", label: "Translation" },
] as const;

const targetingSteps = [
  "Target enters view",
  "Detected",
  "Bracket resolves",
  "Direction + range",
  "Priority changes",
  "Action state",
];

const productPrinciples = [
  { title: "Context over navigation", copy: "Bring relevant information into the workflow.", Icon: LuCrosshair },
  { title: "Hierarchy over volume", copy: "Show what matters now.", Icon: LuLayers3 },
  { title: "Clarity over architecture", copy: "Users should not have to understand backend complexity.", Icon: LuEye },
  { title: "Feedback creates trust", copy: "Stable, immediate system response builds confidence.", Icon: LuShieldCheck },
];

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(Math.max(value, minimum), maximum);

function useF35Experience() {
  const [active, setActive] = useState<StorySection>("perception");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-f35-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id as StorySection);
      },
      { rootMargin: "-24% 0px -54%", threshold: [0.04, 0.16, 0.34] },
    );
    observedSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrubSections = Array.from(document.querySelectorAll<HTMLElement>("[data-f35-scrub]"));
    let frame = 0;

    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(available > 0 ? clamp(window.scrollY / available) : 0);

        scrubSections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const travel = Math.max(rect.height - window.innerHeight, 1);
          const scrub = reducedMotion ? 1 : clamp(-rect.top / travel);
          section.style.setProperty("--scrub", String(scrub));

          if (section.dataset.f35Scrub === "awareness") {
            const reveal = clamp((scrub - 0.24) / 0.56);
            section.style.setProperty("--terrain-opacity", String(reveal));
            section.style.setProperty("--terrain-clip", `${(1 - reveal) * 100}%`);
            section.style.setProperty("--sensor-travel", `${scrub * 100}%`);
            section.dataset.phase = scrub < 0.26 ? "obstruction" : scrub < 0.64 ? "sensor" : "restored";
          }

          if (section.dataset.f35Scrub === "cognitive") {
            section.dataset.phase =
              scrub < 0.22
                ? "overload"
                : scrub < 0.5
                  ? "filter"
                  : scrub < 0.76
                    ? "prioritize"
                    : "contextualize";
          }
        });
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return { active, progress };
}

function Navigation({ active }: { active: StorySection }) {
  const activeNavigation = active === "perception" ? null : active;
  return (
    <header className={styles.navigation}>
      <Link className={styles.studyMark} href="/" aria-label="Return to selected work">
        <span>F-35</span> / HMI STUDY
      </Link>
      <nav aria-label="F-35 UX study sections">
        {navigation.map((item) => (
          <a href={`#${item.id}`} className={activeNavigation === item.id ? styles.navActive : ""} key={item.id}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ProgressRail({ active, progress }: { active: StorySection; progress: number }) {
  const sections = observedSections.slice(1);
  const activeIndex = active === "perception" ? -1 : sections.indexOf(active);
  const railStyle = useMemo(() => ({ "--story-progress": progress } as CSSProperties), [progress]);
  return (
    <div className={styles.progressRail} style={railStyle} aria-hidden="true">
      <div className={styles.progressTrack}><i /></div>
      {sections.map((section, index) => (
        <span className={index <= activeIndex ? styles.markerActive : ""} key={section}>
          {String(index + 1).padStart(2, "0")}
        </span>
      ))}
    </div>
  );
}

function VisorHud() {
  return (
    <div className={`${styles.visorHud} ${styles.hudHero}`} aria-hidden="true">
      <div className={styles.hudClip}>
        <div className={styles.hudCompass}><i /><i /><i /><strong>HDG</strong><i /><i /><i /></div>
        <div className={styles.hudHeading}><i /><span>HDG</span><i /></div>
        <div className={styles.hudHorizon}><i /><span /><i /></div>
        <div className={styles.hudSpeed}><span>SPEED</span><i /><i /><i /><i /></div>
        <div className={styles.hudAltitude}><span>ALT</span><i /><i /><i /><i /></div>
        <div className={styles.hudReference}><i /><i /></div>
        <div className={styles.hudDetection}><span>DETECTED</span><i /></div>
        <div className={styles.hudTarget}><i /><i /><i /><i /></div>
        <div className={styles.hudDirection}>DIRECTION <strong>RIGHT</strong></div>
        <div className={styles.hudBearing}><i /><span>RIGHT</span></div>
        <div className={styles.hudRange}><span>RANGE</span><i><b /></i></div>
        <div className={styles.hudPriority}>PRIORITY <strong>HIGH</strong></div>
        <div className={styles.hudAction}>ACTION <strong>TRACK</strong></div>
        <div className={styles.hudStateRail}><span>SCAN</span><i /><span>VERIFY</span><i /><span>TRACK</span></div>
        <div className={styles.hudFusion}><div><i /><i /><i /><b /></div><span>CONTEXT FUSED</span></div>
        <div className={styles.hudActionMenu}><span>TRACK</span><span>MONITOR</span><span>CLEAR</span></div>
      </div>
    </div>
  );
}

function Hero() {
  const principles = [
    { label: "360° Awareness", Icon: LuRadar },
    { label: "Contextual Targeting", Icon: LuCrosshair },
    { label: "Integrated Vision", Icon: LuEye },
    { label: "Human Calibration", Icon: LuUserCheck },
  ];
  return (
    <section className={styles.hero} id="perception" data-story-section>
      <img className={styles.heroImage} src="/f35-helmet-ux/hero-front-pilot-aircraft.webp" alt="Original cinematic study visual of a helmeted stealth-fighter pilot with an aircraft behind in a graphite sky." width={1586} height={992} fetchPriority="high" decoding="async" />
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroCopy}>
        <p>HUMAN–MACHINE INTERFACE STUDY</p>
        <h1><span>When the interface</span><span>becomes part of</span><span>perception.</span></h1>
        <div>Exploring how information, attention and human perception shape one of the world&apos;s most demanding interfaces.</div>
      </div>
      <div className={styles.sensorFlow} aria-hidden="true"><span>AIRCRAFT</span><i /><b>INPUT</b><i /><b>FUSION</b><i /><b>CONTEXT</b></div>
      <VisorHud />
      <div className={styles.heroPrinciples}>
        {principles.map(({ label, Icon }) => <div key={label}><Icon aria-hidden="true" /><span>{label}</span></div>)}
      </div>
      <a className={styles.scrollCue} href="#target-acquisition"><span>SCROLL TO EXPLORE</span><i aria-hidden="true" /></a>
    </section>
  );
}

function TargetingHud() {
  return (
    <div className={styles.targetingHud} aria-hidden="true">
      <div className={styles.trackingTopBar}>
        <span><small>SPD</small><strong>468</strong></span>
        <span><small>HDG</small><strong>304</strong></span>
        <span><small>ALT</small><strong>28 640</strong></span>
      </div>
      <div className={styles.trackingHorizon}>
        <span>09</span><i /><span>10</span><i /><span>11</span><b /><span>12</span><i /><span>13</span>
      </div>
      <div className={styles.trackingBearing}><i /><span>AZ +16° / RIGHT</span></div>
      <div className={styles.trackingDecisionStrip}>
        <span><small>DIRECTION</small><strong>RIGHT +16°</strong></span>
        <span><small>RANGE</small><strong>18.4 NM</strong></span>
        <span><small>PRIORITY</small><strong>HIGH</strong></span>
        <span><small>ACTION</small><strong>TRACK</strong></span>
      </div>
      <div className={styles.trackingSensorStatus}><i /><span>SENSOR FUSION</span><strong>TRACK 02</strong></div>
    </div>
  );
}

function TrackingTargetLock() {
  return (
    <div className={styles.targetLock} aria-hidden="true">
      <div className={styles.targetBracket}><i /><i /><i /><i /><span>DETECTED</span><b>TRACK 02</b></div>
      <div className={styles.targetMarker}><i /><span>02</span></div>
      <div className={styles.targetRangeCue}><span>18.4 NM</span><i /><strong>HIGH</strong></div>
    </div>
  );
}

function TargetAcquisitionSection() {
  return (
    <section className={styles.targetAcquisition} id="target-acquisition" data-story-section>
      <div className={styles.shellWide}>
        <header className={styles.targetHeading} data-f35-reveal>
          <p>01 / TARGET ACQUISITION</p>
          <h2>Information follows<br /><span>attention.</span></h2>
          <div><strong>The next decision appears inside the pilot&apos;s current field of view.</strong><span>The helmet remains still. The interface responds to what enters attention.</span></div>
        </header>
        <figure className={styles.targetStage} data-f35-reveal aria-label="Two aircraft in flight while the helmet interface detects and tracks the aircraft ahead.">
          <img className={styles.trackingSky} src="/f35-helmet-ux/tracking-sky.webp" alt="" width={1672} height={941} loading="lazy" decoding="async" />
          <div className={styles.targetShade} aria-hidden="true" />
          <div className={styles.aircraftField} aria-hidden="true">
            <div className={styles.leadAircraftWrap}>
              <i className={styles.afterburnerGlow} />
              <img className={styles.leadAircraft} src="/f35-helmet-ux/tracking-lead-aircraft.png" alt="" width={1536} height={650} loading="lazy" decoding="async" />
            </div>
            <div className={styles.trackedAircraftWrap}>
              <i className={styles.afterburnerGlow} />
              <img className={styles.trackedAircraft} src="/f35-helmet-ux/tracking-target-aircraft.png" alt="" width={1520} height={451} loading="lazy" decoding="async" />
              <TrackingTargetLock />
            </div>
          </div>
          <aside className={styles.uxLens} aria-label="Product design interpretation">
            <p>PRODUCT DESIGN LENS</p>
            <h3>One changing situation.<br />One clear next action.</h3>
            <ol>
              <li><span>01</span><div><strong>Stay in context</strong><small>No page switch or modal.</small></div></li>
              <li><span>02</span><div><strong>Understand priority</strong><small>Direction, range and urgency resolve together.</small></div></li>
              <li><span>03</span><div><strong>Act with confidence</strong><small>The interface confirms the next state.</small></div></li>
            </ol>
            <small>Applicable to dashboards, alerts and complex enterprise workflows.</small>
          </aside>
          <TargetingHud />
          <figcaption><span>HELMET-MOUNTED TARGETING VIEW</span><strong>LIVE / TRACK 02</strong></figcaption>
        </figure>
        <ol className={styles.targetSequence} data-f35-reveal>
          {targetingSteps.map((step, index) => (
            <li key={step}><strong>{step}</strong>{index < targetingSteps.length - 1 ? <i aria-hidden="true">→</i> : null}</li>
          ))}
        </ol>
        <div className={styles.targetTranslation} data-f35-reveal>
          <p>PRODUCT DESIGN TRANSLATION</p>
          <h3>Bring the next decision into<br />the user&apos;s current context.</h3>
          <div><span>Do not make users open another page, table or modal just to understand the item in front of them.</span><strong>Surface relevant status and actions at the point of work.</strong></div>
        </div>
      </div>
    </section>
  );
}

function SituationalAwarenessSection() {
  return (
    <>
      <section className={styles.awarenessStory} id="situational-awareness" data-story-section>
        <header className={styles.awarenessHeading} data-f35-reveal>
          <p>02 / 360° SITUATIONAL AWARENESS</p>
          <h2>Remove the blind spot.<br /><span>Restore the context.</span></h2>
          <div>What if the interface could reveal what the physical product blocks?</div>
        </header>

        <div className={styles.awarenessScrollStage} data-f35-scrub="awareness" data-phase="obstruction">
          <div className={styles.awarenessSticky}>
            <figure className={styles.awarenessCanvas}>
              <img className={styles.awarenessBase} src="/f35-helmet-ux/cockpit-pov-obstruction.webp" alt="First-person view from inside a fighter cockpit, looking slightly downward at the aircraft structure blocking the terrain below." width={1672} height={941} loading="lazy" decoding="async" />
              <div className={styles.awarenessShade} aria-hidden="true" />
              <div className={styles.terrainWindow} aria-hidden="true">
                <img src="/f35-helmet-ux/beneath-aircraft-terrain.webp" alt="" width={1672} height={941} loading="lazy" decoding="async" />
              </div>
              <div className={styles.revealStatus} aria-hidden="true">
                <p data-awareness-copy="obstruction">The cockpit blocks the view below.</p>
                <p data-awareness-copy="sensor">The aircraft begins to disappear.</p>
                <p data-awareness-copy="restored">Sensor vision restores the terrain beneath.</p>
              </div>
              <div className={styles.revealProgress} aria-hidden="true"><i /></div>
            </figure>
          </div>
        </div>

        <div className={styles.awarenessTranslation} data-f35-reveal>
          <p>PRODUCT DESIGN TRANSLATION</p>
          <h3>Do not make users leave the workflow<br />to recover context.</h3>
          <span>The physical obstruction remains. The interface restores the missing understanding.</span>
        </div>
      </section>
      <aside className={styles.calibrationBand} data-f35-reveal aria-label="Supporting human-factors insight">
        <div><p>SUPPORTING HUMAN FACTOR</p><h3>The helmet is individually calibrated to the pilot.</h3></div>
        <div className={styles.calibrationTerms} aria-label="Calibration factors"><span>Fit</span><i /><span>Optical alignment</span><i /><span>Stability</span></div>
        <p>Personalization here isn&apos;t cosmetic — it protects perceptual accuracy.</p>
      </aside>
    </>
  );
}

function CognitiveHud() {
  const minorTargets = [
    { className: styles.noiseTargetOne, label: "T-07" },
    { className: styles.noiseTargetTwo, label: "T-11" },
    { className: styles.noiseTargetThree, label: "T-18" },
    { className: styles.noiseTargetFour, label: "T-21" },
  ];
  return (
    <div className={styles.cognitiveHud} aria-hidden="true">
      <div className={`${styles.cognitiveNoise} ${styles.cognitiveTopBar}`}>
        <span><small>SPD</small><strong>468</strong></span><span><small>HDG</small><strong>304</strong></span><span><small>ALT</small><strong>28 640</strong></span><span><small>AOA</small><strong>08.4</strong></span>
      </div>
      <div className={`${styles.cognitiveNoise} ${styles.cognitiveAlertRail}`}><strong>CAUTION / SENSOR</strong><span>FUEL 61</span><span>DATA LINK 04</span></div>
      <div className={`${styles.cognitiveNoise} ${styles.cognitiveHorizon}`}><span>09</span><i /><span>10</span><i /><span>11</span><b /><span>12</span><i /><span>13</span></div>
      <div className={styles.cognitiveTargetField}>
        {minorTargets.map((target) => <div className={`${styles.cognitiveNoise} ${styles.noiseMinorTarget} ${target.className}`} key={target.label}><i /><i /><i /><i /><span>{target.label}</span></div>)}
        <div className={styles.primaryThreat}>
          <div className={styles.primaryBracket}><i /><i /><i /><i /><span>THREAT / 02</span></div>
          <div className={styles.primaryDecision}>
            <p><span>DIRECTION</span><strong>RIGHT +16°</strong></p><p><span>RANGE</span><strong>18.4 NM</strong></p><p><span>PRIORITY</span><strong>HIGH</strong></p><p><span>ACTION</span><strong>TRACK</strong></p>
          </div>
        </div>
      </div>
      <div className={`${styles.cognitiveSecondary} ${styles.cognitiveContextRow}`}><span>BEARING 281°</span><span>TRACK QUALITY 64%</span><span>RANGE 26.7 NM</span></div>
      <div className={`${styles.cognitiveNoise} ${styles.cognitiveBottomBar}`}><span>NAV</span><i /><strong>WPT 06 / 42 NM</strong><i /><span>ETA 02:14</span></div>
    </div>
  );
}

function CognitiveLoadSection() {
  const phases = [
    { id: "overload", title: "Overloaded", copy: "Everything competes." },
    { id: "filter", title: "Filter", copy: "Irrelevant signals leave." },
    { id: "prioritize", title: "Prioritize", copy: "One threat becomes dominant." },
    { id: "contextualize", title: "Contextualize", copy: "Decision data remains." },
  ];
  return (
    <section className={styles.cognitiveStory} id="cognitive-load" data-story-section data-f35-scrub="cognitive" data-phase="overload">
      <div className={styles.cognitiveSticky}>
        <div className={styles.cognitiveCopy}>
          <p>03 / COGNITIVE LOAD</p><h2>More data does not<br />create more awareness.</h2><strong>Hierarchy creates understanding.</strong>
          <div className={styles.cognitivePhaseList} aria-label="Information hierarchy process">
            {phases.map((phase, index) => <div data-cognitive-phase={phase.id} key={phase.id}><span>{String(index + 1).padStart(2, "0")}</span><p><strong>{phase.title}</strong><small>{phase.copy}</small></p></div>)}
          </div>
        </div>
        <figure className={styles.cognitiveVisor}>
          <img src="/f35-helmet-ux/hud-demo-visor.webp" alt="Close-up helmet visor used to demonstrate an overloaded interface resolving into a clear decision hierarchy." width={1122} height={1402} loading="lazy" decoding="async" />
          <CognitiveHud />
          <figcaption><span>SCROLL TO REDUCE SIGNAL DENSITY</span><i aria-hidden="true" /></figcaption>
        </figure>
        <div className={styles.cognitiveRelevance}><p>PRODUCT APPLICATION</p><div><span>Dashboards</span><span>KPI hierarchy</span><span>Complex tables</span><span>Filters</span><span>Alerts</span><span>Decision support</span></div></div>
      </div>
    </section>
  );
}

function ProductTranslationSection() {
  return (
    <section className={styles.productTranslationSection} id="product-translation" data-story-section>
      <div className={styles.translationShell}>
        <header className={styles.translationHeading} data-f35-reveal>
          <p>04 / PRODUCT DESIGN TRANSLATION</p><h2>From cockpit systems<br />to complex products.</h2><span>The value is not the military aesthetic. It is the interaction logic beneath it.</span>
        </header>
        <div className={styles.principleRows}>
          {productPrinciples.map(({ title, copy, Icon }) => <article data-f35-reveal key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
        <div className={styles.systemClarity} data-f35-reveal><p>Complexity is in the system.</p><h3>Clarity is in the experience.</h3></div>
      </div>
      <div className={styles.conclusion} data-f35-reveal>
        <p>CONCLUSION</p><h2>The best interface isn&apos;t the one<br />that shows the most information.</h2><div className={styles.conclusionPause} aria-hidden="true" /><h3>It&apos;s the one that helps the user<br />understand the situation<br />and act with confidence.</h3>
        <footer><span>Human Factors × Product Design</span><strong>Complex system. Clear experience.</strong><Link href="/">Return to selected work <i aria-hidden="true">↗</i></Link></footer>
      </div>
    </section>
  );
}

export default function F35Story() {
  const { active, progress } = useF35Experience();
  return (
    <div className={styles.page}>
      <Navigation active={active} />
      <ProgressRail active={active} progress={progress} />
      <main><Hero /><TargetAcquisitionSection /><SituationalAwarenessSection /><CognitiveLoadSection /><ProductTranslationSection /></main>
    </div>
  );
}
