"use client";

import Image from "next/image";
import { Fragment, type ReactNode, useEffect, useState } from "react";

type StoryLens = "challenge" | "approach" | "solution" | "impact";

const lenses: StoryLens[] = ["challenge", "approach", "solution", "impact"];

const lensLabels: Record<StoryLens, string> = {
  challenge: "Challenge",
  approach: "Approach",
  solution: "Solution",
  impact: "Impact",
};

const challenges = [
  {
    title: "Work Queue",
    text: "Program teams don't start the day thinking in product modules. They want to know what needs attention now. But tasks, issues and approvals can sit across different trackers, which means people may spend time navigating before they even know what to act on.",
  },
  {
    title: "Master Timing",
    text: "A master timing plan carries a lot at once — hierarchy, dates, dependencies, owners and status. That detail is useful while planning, but showing all of it with the same weight can make a quick progress review unnecessarily heavy.",
  },
  {
    title: "Issue Control",
    text: "An issue tracker can easily become a place where problems are recorded and then forgotten. A row marked 'high risk' is not very useful if the team still has to work out who owns it, what happens next and what information supports the decision.",
  },
  {
    title: "Phase Gates",
    text: "A readiness percentage can look reassuring, but it does not tell an approver what is unfinished or whether the program is truly ready to move forward. A gate decision needs evidence, accountability and a clear view of unresolved work.",
  },
];

type ArchitectureVisualKind = "timing" | "queue" | "issues" | "gate";

const architectureModules: Array<{
  title: string;
  action: string;
  visual: ArchitectureVisualKind;
}> = [
  {
    title: "Master Timing",
    action: "Plan the program",
    visual: "timing",
  },
  {
    title: "Work Queue",
    action: "Act on priority",
    visual: "queue",
  },
  {
    title: "Issue Control",
    action: "Resolve risk",
    visual: "issues",
  },
  {
    title: "Phase Gate",
    action: "Decide readiness",
    visual: "gate",
  },
];

const approachSteps = [
  {
    title: "Understand the workflow",
    text: "Before changing the interface, I needed to understand how timing, issues, ownership and approvals connected.",
  },
  {
    title: "Map the information",
    text: "I mapped what users needed to see immediately, what they needed while working and what could wait until they asked for more detail.",
  },
  {
    title: "Find the friction",
    text: "The recurring problem was not always missing functionality. Often, the right information existed but appeared at the wrong moment or with the wrong visual weight.",
  },
  {
    title: "Define the hierarchy",
    text: "I started separating signals from detail — what needs attention first, what provides context and what belongs deeper in the workflow.",
  },
  {
    title: "Prototype the decision",
    text: "I used prototypes to test the important moments: finding work, understanding status, resolving an issue and deciding whether something was ready.",
  },
  {
    title: "Validate the interaction",
    text: "I refined states, hierarchy and interaction patterns rather than treating the first layout as the final answer.",
  },
  {
    title: "Systemize the pattern",
    text: "When a solution worked across more than one workflow, I moved it into reusable components and interaction patterns instead of solving it again on the next screen.",
  },
];

const transformations = [
  {
    title: "Work Queue",
    before: "Work distributed across product areas.",
    decision: "Organize the entry point around attention rather than modules.",
    after: "A shared queue that makes priority, ownership, status and next action easier to see.",
    src: "/program-plus/work-queue.png",
    alt: "Program Plus Work Queue with time-based task tabs, summary signals and cross-tracker work",
    width: 1440,
    height: 1179,
  },
  {
    title: "Master Timing",
    before: "Hierarchy, dates, progress and dependencies competing for attention.",
    decision: "Separate scan-level signals from planning-level detail.",
    after: "A timing experience that supports both quick health reviews and deeper planning.",
    src: "/program-plus/mtt-add-task.png",
    alt: "Master Timing Tracker grid with hierarchical work and a focused task drawer",
    width: 1574,
    height: 1024,
  },
  {
    title: "Issue Control",
    before: "Issues behaving mainly like records.",
    decision: "Design around ownership and resolution, not only documentation.",
    after: "Status, responsibility, supporting information and next action live closer together.",
    src: "/program-plus/issue-tracker-inline.png",
    alt: "Open Issue Tracker with hierarchy, ownership, risk state and inline editing",
    width: 2048,
    height: 1515,
  },
  {
    title: "Phase Gates",
    before: "Readiness reduced to a percentage.",
    decision: "Treat readiness as evidence.",
    after: "Approvers can see what is complete, what remains unresolved and what supports the gate decision.",
    src: "/program-plus/phase-gate.png",
    alt: "Program Plus phase-gate review showing readiness, evidence and accountable ownership",
    width: 2048,
    height: 1456,
  },
];

const outcomes = [
  {
    title: "Shared information",
    text: "Timing, issues, actions and readiness became easier to understand as connected parts of the program rather than isolated records.",
  },
  {
    title: "Less navigation",
    text: "Important information could be surfaced closer to the moment it was needed instead of requiring users to repeatedly move between product areas.",
  },
  {
    title: "Clearer priorities",
    text: "Exceptions and work requiring attention could carry more visual weight than information that was already healthy.",
  },
  {
    title: "Stronger ownership",
    text: "Actions and issues could communicate responsibility more clearly instead of leaving ownership buried in supporting detail.",
  },
  {
    title: "More informed decisions",
    text: "Progress and readiness were given context, helping users understand what was behind a status rather than relying on a number alone.",
  },
  {
    title: "More consistent product behavior",
    text: "Patterns that worked across workflows became reusable components and interaction rules, giving future features a stronger foundation.",
  },
];

function readLensFromHash(): StoryLens | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1) as StoryLens;
  return lenses.includes(hash) ? hash : null;
}

function PencilNote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside className={`program-pencil-note ${className}`.trim()}>
      <span>{children}</span>
      <svg viewBox="0 0 190 42" aria-hidden="true">
        <path
          className="program-pencil-stroke"
          pathLength="1"
          d="M4 31C38 35 70 31 100 25C130 19 151 10 179 9"
        />
        <path
          className="program-pencil-stroke program-pencil-stroke-tip"
          pathLength="1"
          d="M168 4L181 9L171 18"
        />
      </svg>
    </aside>
  );
}

function ArchitectureVisual({ kind }: { kind: ArchitectureVisualKind }) {
  return (
    <div className={`program-architecture-visual is-${kind}`} aria-hidden="true">
      {kind === "timing" && (
        <svg className="program-architecture-diagram" viewBox="0 0 320 170">
          <path className="program-vector-grid" d="M28 40H292M28 82H292M28 124H292" />
          <path
            className="program-vector-link program-timing-dependency"
            pathLength="1"
            d="M148 40V82H105"
          />
          <rect className="program-timing-bar is-one" x="45" y="34" width="103" height="12" rx="6" />
          <rect className="program-timing-bar is-two" x="105" y="76" width="128" height="12" rx="6" />
          <rect className="program-timing-bar is-three" x="69" y="118" width="92" height="12" rx="6" />
          <line className="program-timing-now" x1="205" y1="24" x2="205" y2="143" />
          <circle className="program-vector-node program-timing-milestone is-one" cx="148" cy="40" r="6" />
          <circle className="program-vector-node program-timing-milestone is-two" cx="233" cy="82" r="6" />
          <circle className="program-vector-node program-timing-milestone is-three" cx="161" cy="124" r="6" />
        </svg>
      )}

      {kind === "queue" && (
        <svg className="program-architecture-diagram" viewBox="0 0 320 170">
          <circle className="program-queue-source is-one" cx="34" cy="42" r="6" />
          <circle className="program-queue-source is-two" cx="34" cy="85" r="6" />
          <circle className="program-queue-source is-three" cx="34" cy="128" r="6" />
          <path className="program-vector-link is-one" pathLength="1" d="M42 42C82 42 90 66 128 76" />
          <path className="program-vector-link is-two" pathLength="1" d="M42 85H128" />
          <path className="program-vector-link is-three" pathLength="1" d="M42 128C82 128 90 104 128 94" />
          <path className="program-queue-merge" d="M128 67L145 85L128 103" />
          <g className="program-queue-row is-active">
            <rect x="158" y="28" width="132" height="30" rx="9" />
            <circle cx="174" cy="43" r="4" />
            <path d="M187 43H246" />
            <path className="program-queue-rank" d="M260 43H276" />
          </g>
          <g className="program-queue-row is-second">
            <rect x="158" y="70" width="132" height="30" rx="9" />
            <circle cx="174" cy="85" r="4" />
            <path d="M187 85H235" />
            <path className="program-queue-rank" d="M260 85H276" />
          </g>
          <g className="program-queue-row is-third">
            <rect x="158" y="112" width="132" height="30" rx="9" />
            <circle cx="174" cy="127" r="4" />
            <path d="M187 127H226" />
            <path className="program-queue-rank" d="M260 127H276" />
          </g>
        </svg>
      )}

      {kind === "issues" && (
        <svg className="program-architecture-diagram" viewBox="0 0 320 170">
          <path className="program-vector-link is-one" pathLength="1" d="M145 74L88 45" />
          <path className="program-vector-link is-two" pathLength="1" d="M174 72L232 44" />
          <path className="program-vector-link is-three" pathLength="1" d="M145 97L88 128" />
          <path className="program-vector-link is-four" pathLength="1" d="M175 98L232 128" />
          <g className="program-issue-core">
            <circle cx="160" cy="85" r="22" />
            <path d="M160 73V87" />
            <circle cx="160" cy="94" r="1.8" />
          </g>
          <g className="program-issue-signal is-owner">
            <circle cx="76" cy="39" r="7" />
            <path d="M64 55C67 47 85 47 88 55" />
          </g>
          <g className="program-issue-signal is-action">
            <rect x="225" y="30" width="28" height="28" rx="8" />
            <path d="M232 44L237 49L247 38" />
          </g>
          <g className="program-issue-signal is-evidence">
            <path d="M66 114H84L91 121V142H66Z" />
            <path d="M84 114V122H91M72 130H85M72 136H82" />
          </g>
          <g className="program-issue-signal is-recovery">
            <circle cx="239" cy="128" r="14" />
            <path d="M232 128L237 133L247 122" />
          </g>
        </svg>
      )}

      {kind === "gate" && (
        <svg className="program-architecture-diagram" viewBox="0 0 320 170">
          <g className="program-gate-evidence is-one">
            <circle cx="45" cy="45" r="8" />
            <path d="M41 45L44 48L50 41" />
            <path d="M60 45H112" />
          </g>
          <g className="program-gate-evidence is-two">
            <circle cx="45" cy="85" r="8" />
            <path d="M41 85L44 88L50 81" />
            <path d="M60 85H112" />
          </g>
          <g className="program-gate-evidence is-three">
            <circle cx="45" cy="125" r="8" />
            <path d="M41 125L44 128L50 121" />
            <path d="M60 125H112" />
          </g>
          <path className="program-vector-link program-gate-flow" pathLength="1" d="M112 45C134 45 136 64 149 70M112 85H149M112 125C134 125 136 106 149 100" />
          <path className="program-gate-rail" d="M159 27V67M159 103V143" />
          <path className="program-gate-pass" d="M159 85H198" />
          <circle className="program-gate-ring-bg" cx="238" cy="85" r="31" />
          <circle className="program-gate-ring" cx="238" cy="85" r="31" />
          <path className="program-gate-check" d="M224 85L234 95L253 74" />
        </svg>
      )}
    </div>
  );
}

function ChallengePanel() {
  return (
    <div className="program-story-challenge">
      <p className="program-story-lede">
        This was not one isolated workflow problem. Timing, work, issues and
        decisions were affecting one another.
      </p>

      <PencilNote className="program-pencil-note--challenge">
        What needs attention now?
      </PencilNote>

      <div className="program-problem-grid">
        {challenges.map((problem) => (
          <article key={problem.title}>
            <h3>{problem.title}</h3>
            <p>{problem.text}</p>
          </article>
        ))}
      </div>

      <section
        className="program-architecture-map"
        aria-labelledby="program-architecture-title"
      >
        <div className="program-architecture-heading">
          <h3 id="program-architecture-title">How Program+ works as one system</h3>
          <p>
            Planning creates work. Work exposes issues. Unresolved issues change
            the gate decision. The same program context moves with each step.
          </p>
        </div>

        <div className="program-architecture-track">
          {architectureModules.map((module, index) => (
            <Fragment key={module.title}>
              <article className="program-architecture-module">
                <ArchitectureVisual kind={module.visual} />
                <div className="program-architecture-module-copy">
                  <h4>{module.title}</h4>
                  <p>{module.action}</p>
                </div>
              </article>
              {index < architectureModules.length - 1 && (
                <div className="program-architecture-connector" aria-hidden="true">
                  <span />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="program-architecture-feedback" aria-label="Decision feedback loop">
          <svg viewBox="0 0 1200 72" preserveAspectRatio="none" aria-hidden="true">
            <path
              className="program-architecture-feedback-path"
              d="M1040 8V43Q1040 58 1025 58H175Q160 58 160 43V18M150 29L160 18L170 29"
            />
          </svg>
          <span>Unresolved work can loop back into planning.</span>
        </div>
      </section>
    </div>
  );
}

function ApproachPanel() {
  return (
    <div className="program-story-approach">
      <div className="program-approach-intro">
        <p>
          I initially looked at these as separate product areas. But as the
          workflows developed, the same questions kept appearing: What needs
          attention? Who owns it? What is blocking progress? And what does
          someone need to know before making a decision?
        </p>
        <p>
          That changed how I approached the product. Instead of designing each
          screen independently, I started looking for the information model
          underneath them.
        </p>

        <PencilNote className="program-pencil-note--approach">
          Follow the information, not the menu.
        </PencilNote>
      </div>

      <ol className="program-reasoning-flow">
        {approachSteps.map((step) => (
          <li key={step.title}>
            <span className="program-reasoning-node" aria-hidden="true" />
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SolutionPanel() {
  return (
    <div className="program-story-solution">
      <p className="program-story-lede program-solution-lede">
        The solution wasn&apos;t to remove complexity. Program management is
        complex for a reason. The goal was to decide which complexity needed to
        be visible now, which needed context, and which could stay one level deeper.
      </p>

      <PencilNote className="program-pencil-note--solution">
        Keep context close to the decision.
      </PencilNote>

      <div className="program-transformations">
        {transformations.map((item) => (
          <article className="program-transformation" key={item.title}>
            <div className="program-transformation-copy">
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>Before</dt>
                  <dd>{item.before}</dd>
                </div>
                <div className="is-decision">
                  <dt>Design decision</dt>
                  <dd>{item.decision}</dd>
                </div>
                <div>
                  <dt>After</dt>
                  <dd>{item.after}</dd>
                </div>
              </dl>
            </div>
            <figure className="program-transformation-screen">
              <div className="program-transformation-screen-bar">
                <span>{item.title}</span>
                <span>Final interface</span>
              </div>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
                sizes="(max-width: 900px) 94vw, 62vw"
              />
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

function ImpactPanel() {
  return (
    <div className="program-story-impact">
      <p className="program-story-lede">
        The biggest outcome wasn&apos;t one redesigned screen. The workflows
        started behaving more like parts of the same product.
      </p>

      <ol className="program-outcome-chain">
        {outcomes.map((outcome) => (
          <li key={outcome.title}>
            <span className="program-outcome-node" aria-hidden="true" />
            <div>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="program-impact-close">
        I wasn&apos;t trying to make Program+ look simpler. I was trying to make
        a complex system easier to reason about.
      </p>
    </div>
  );
}

export default function ProgramCaseStudyLens() {
  const [activeLens, setActiveLens] = useState<StoryLens>("challenge");

  useEffect(() => {
    const syncWithHash = () => {
      const lens = readLensFromHash();
      if (lens) setActiveLens(lens);
    };

    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, []);

  return (
    <section className="program-story-lens" aria-labelledby="program-story-title">
      <div className="program-story-heading">
        <h2 id="program-story-title">
          The problems I was solving,<br />not just the screens I made.
        </h2>
        <p>
          A finished interface shows the answer, but not the trade-offs behind
          it. These four views show what became difficult, what I noticed, how
          I worked through it and what changed in the product.
        </p>
      </div>

      {lenses.map((lens) => (
        <span
          className="program-story-anchor"
          id={lens}
          key={`${lens}-anchor`}
          aria-hidden="true"
        />
      ))}

      <nav className="program-story-tabs" role="tablist" aria-label="Program Plus case study story">
        {lenses.map((lens) => (
          <a
            key={lens}
            href={`#${lens}`}
            role="tab"
            aria-selected={activeLens === lens}
            aria-controls="program-story-panel"
            className={activeLens === lens ? "is-active" : ""}
            onClick={() => setActiveLens(lens)}
          >
            {lensLabels[lens]}
          </a>
        ))}
      </nav>

      <div
        id="program-story-panel"
        className="program-story-panel"
        data-story={activeLens}
        role="tabpanel"
        aria-label={`${lensLabels[activeLens]} story`}
        key={activeLens}
      >
        {activeLens === "challenge" && <ChallengePanel />}
        {activeLens === "approach" && <ApproachPanel />}
        {activeLens === "solution" && <SolutionPanel />}
        {activeLens === "impact" && <ImpactPanel />}
      </div>

      <div className="program-story-handoff">
        <a href="#workflows">
          Continue to product walkthrough <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
