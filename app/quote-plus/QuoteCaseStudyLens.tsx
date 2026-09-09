"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type StoryLens = "challenge" | "approach" | "solution" | "impact";

const lenses: StoryLens[] = ["challenge", "approach", "solution", "impact"];

const lensLabels: Record<StoryLens, string> = {
  challenge: "Challenge",
  approach: "Approach",
  solution: "Solution",
  impact: "Impact",
};

const challengeFlow = [
  {
    title: "Capture the quote",
    text: "Customer, program, timing and commercial information enter one RFQ.",
  },
  {
    title: "Review what is ready",
    text: "The team checks missing information, assumptions and ownership.",
  },
  {
    title: "Make the decision",
    text: "Go / No-Go and customer outcomes need a reason, not only a status.",
  },
  {
    title: "Carry the context forward",
    text: "Confirmed information, evidence and decision history move into the award.",
  },
];

const quoteProblems = [
  {
    title: "RFQ setup",
    text: "RFQ setup had to capture customer, program, timing and commercial details. Removing fields alone would have left gaps, so the real challenge was grouping the information and showing only what people needed at each moment.",
  },
  {
    title: "Quote structure",
    text: "As the quote grew, people needed to scan sections before opening the detail. A complete record could still be hard to understand when every field had the same visual weight.",
  },
  {
    title: "Qualification / customer decision",
    text: "Go / No-Go and customer outcomes changed what work could continue. The interface had to show the decision, who owned it, the reason behind it and what would happen next.",
  },
  {
    title: "Collaboration",
    text: "Sales, estimating, engineering and plant teams contributed different information. Each person needed to understand their responsibility without navigating the entire quotation.",
  },
  {
    title: "Evidence",
    text: "Drawings, BOMs, purchase orders and other files explained parts of the quote. Keeping them in a separate folder made it harder to understand what each document supported.",
  },
  {
    title: "Handoff",
    text: "A Win started the next stage. The award team needed confirmed information, decision history and supporting documents—not a blank record and a final status.",
  },
];

const reasoningSteps = [
  {
    title: "Follow the journey",
    text: "I stopped evaluating screens in isolation and followed the quote from initial RFQ through qualification, collaboration and award.",
  },
  {
    title: "Find the decisions",
    text: "I looked for moments where users weren't simply entering information anymore — they were deciding whether something could move forward.",
  },
  {
    title: "Identify what changes",
    text: "I mapped how information changes from draft, to reviewed, to approved, blocked or handed over.",
  },
  {
    title: "Separate signal from detail",
    text: "I gave the information needed for a quick decision more visual weight while keeping deeper detail available when someone needed to investigate.",
  },
  {
    title: "Keep context attached",
    text: "I tried to keep assumptions, documents, ownership and status close to the decisions they explained.",
  },
  {
    title: "Design the handoff",
    text: "I treated the next person in the workflow as part of the current design problem.",
  },
  {
    title: "Turn patterns into rules",
    text: "When the same interaction appeared again, I stopped redesigning it and turned it into a reusable product rule.",
  },
];

const meaningModel = [
  ["RFQ information", "Draft", "Can still change"],
  ["Qualification", "Under review", "Needs a decision"],
  ["Commercial assumption", "Validated", "Influences the quote"],
  ["Customer decision", "Approved / No-Go", "Commercial consequence"],
  ["Award", "Handed over", "Requires history + evidence"],
];

type Transformation = {
  from: string;
  to: string;
  text: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const transformations: Transformation[] = [
  {
    from: "One long form",
    to: "Structured information",
    text: "I didn't solve the form by simply removing fields. I grouped information around how users think about the quote and made detail available progressively.",
    src: "/quote-plus/rfq-general-information.webp",
    alt: "Quote Plus RFQ General Information workspace with lifecycle context, grouped fields and section-level attachments",
    width: 1486,
    height: 1590,
  },
  {
    from: "Flat information",
    to: "Scannable hierarchy",
    text: "As the quote became larger, hierarchy became part of the interaction. Users needed to understand where they were before they could understand the detail.",
    src: "/quote-plus/rfq-overview.webp",
    alt: "Quote Plus RFQ overview with lifecycle steps and section completion states",
    width: 1486,
    height: 774,
  },
  {
    from: "Radio button",
    to: "Decision surface",
    text: "Go / No-Go needed more than an input control. I brought the decision, its state and the information supporting it closer together.",
    src: "/quote-plus/go-decision.webp",
    alt: "Quote Plus Go decision surface with consequence, workflow state and roadmap context",
    width: 1486,
    height: 846,
  },
  {
    from: "Everyone sees everything",
    to: "Contribution around roles",
    text: "The quote was shared, but responsibility wasn't identical. I organized contribution around what each role needed to provide or review.",
    src: "/quote-plus/team-permissions.webp",
    alt: "Quote Plus team assignment workspace with role groups, people and View or Edit permissions",
    width: 1486,
    height: 933,
  },
  {
    from: "Attachments",
    to: "Evidence in context",
    text: "I treated important documents as part of the product data rather than a folder sitting beside the workflow.",
    src: "/quote-plus/attachments-detail.webp",
    alt: "Quote Plus attachment detail with file source, uploader, date and version context",
    width: 1486,
    height: 1659,
  },
  {
    from: "Completed step",
    to: "Traceable handoff",
    text: "I wanted the next person to inherit more than a status. Ownership, version, state and evidence needed to travel with the decision.",
    src: "/quote-plus/new-business-award.webp",
    alt: "Quote Plus New Business Award workspace carrying confirmed commercial information into the next stage",
    width: 1074,
    height: 2048,
  },
];

const outcomes = [
  {
    title: "Structured information",
    text: "Users could move through a large amount of quote information without treating every field as equally important.",
  },
  {
    title: "Visible state",
    text: "It became easier to understand what was complete, under review, blocked or ready to move forward.",
  },
  {
    title: "Clear ownership",
    text: "Responsibility stayed closer to the work instead of becoming something users had to reconstruct.",
  },
  {
    title: "Decisions with context",
    text: "Important decisions could carry their reasoning and supporting information instead of existing as isolated statuses.",
  },
  {
    title: "Connected evidence",
    text: "Documents and supporting material could remain part of the decision trail rather than becoming detached attachments.",
  },
  {
    title: "Traceable handoff",
    text: "The next stage could inherit the context created by the previous stage.",
  },
  {
    title: "More trust in the workflow",
    text: "As consequence increased, the product increasingly surfaced the state, ownership and evidence needed to act with confidence.",
  },
];

function readLensFromHash(): StoryLens | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1) as StoryLens;
  return lenses.includes(hash) ? hash : null;
}

function ChallengePanel() {
  return (
    <div className="quote-story-challenge">
      <p className="quote-story-lede">
        The difficult part wasn&apos;t collecting quote information. It was keeping
        that information understandable, complete and trustworthy as the quote
        moved toward a decision.
      </p>

      <section className="quote-consequence-map" aria-labelledby="quote-consequence-title">
        <div className="quote-consequence-heading">
          <h3 id="quote-consequence-title">Unclear information becomes risk as the quote moves forward.</h3>
          <p>
            Early information can still change. Near a commercial decision, the
            same information needs an owner, supporting evidence and a clear history.
          </p>
        </div>

        <div className="quote-challenge-flow">
          {challengeFlow.map((step) => (
            <article key={step.title}>
              <span aria-hidden="true" />
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-problems" aria-labelledby="quote-problems-title">
        <h3 id="quote-problems-title">Where the workflow became difficult</h3>
        <div className="quote-problem-ledger">
          {quoteProblems.map((problem) => (
          <article key={problem.title}>
            <h3>{problem.title}</h3>
            <p>{problem.text}</p>
          </article>
          ))}
        </div>
      </section>

      <blockquote className="quote-story-observation">
        The screens weren&apos;t independent. A decision made in one place changed
        what someone needed to understand in the next.
      </blockquote>
    </div>
  );
}

function ApproachPanel() {
  return (
    <div className="quote-story-approach">
      <div className="quote-approach-layout">
        <div className="quote-approach-intro">
          <p>
            I initially approached some of these as individual screen problems —
            a long form, a qualification step, a decision state, a document view.
          </p>
          <p>
            But once I followed the quote from RFQ to award, the same pattern kept
            appearing. The closer information moved toward a commercial decision,
            the more context it needed. That changed the way I approached the product.
          </p>
        </div>

        <ol className="quote-reasoning-flow">
          {reasoningSteps.map((step) => (
            <li key={step.title}>
              <span aria-hidden="true" />
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <section className="quote-meaning-model" aria-labelledby="quote-meaning-title">
        <div className="quote-meaning-heading">
          <span>Reasoning model</span>
          <h3 id="quote-meaning-title">The same information changes meaning through the workflow.</h3>
          <p>
            I needed to design not only where information lived, but what its state
            meant and what could happen because of it.
          </p>
        </div>

        <div className="quote-meaning-table" role="table" aria-label="Information, state and consequence examples">
          <div className="quote-meaning-header" role="row">
            <span role="columnheader">Information</span>
            <span role="columnheader">State</span>
            <span role="columnheader">Consequence</span>
          </div>
          {meaningModel.map((row) => (
            <div className="quote-meaning-row" role="row" key={row[0]}>
              {row.map((cell, cellIndex) => (
                <span role="cell" key={cell}>
                  <b>{cell}</b>
                  {cellIndex < 2 && <i aria-hidden="true">→</i>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SolutionPanel() {
  return (
    <div className="quote-story-solution">
      <p className="quote-story-lede">
        The solution wasn&apos;t to make every screen lighter. Some parts of quotation
        work are naturally detailed. The design challenge was deciding what should
        be visible, what should be emphasized and what needed proof before the
        workflow could move forward.
      </p>

      <div className="quote-transformations">
        {transformations.map((item, index) => (
          <article className="quote-transformation" key={item.to}>
            <div className="quote-transformation-copy">
              <div className="quote-transformation-shift" aria-label={`From ${item.from} to ${item.to}`}>
                <small>From</small>
                <p>{item.from}</p>
                <i aria-hidden="true">{index % 2 === 0 ? "→" : "←"}</i>
                <small>To</small>
                <h3>{item.to}</h3>
              </div>
              <p>{item.text}</p>
            </div>

            <figure className="quote-transformation-proof">
              <div className="quote-proof-image">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  unoptimized
                  sizes="(max-width: 1080px) 94vw, 62vw"
                />
              </div>
            </figure>
          </article>
        ))}
      </div>
    </div>
  );
}

function ImpactPanel() {
  return (
    <div className="quote-story-impact">
      <p className="quote-story-lede">
        The result wasn&apos;t one dramatically simpler screen. The quotation became
        easier to follow as information moved from initial input toward commercial
        commitment.
      </p>

      <ol className="quote-outcome-chain">
        {outcomes.map((outcome) => (
          <li key={outcome.title}>
            <span className="quote-outcome-node" aria-hidden="true" />
            <div>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <blockquote className="quote-impact-close">
        I wasn&apos;t trying to make quotation simple. I was trying to make important
        decisions easier to understand and easier to trust.
      </blockquote>
    </div>
  );
}

export default function QuoteCaseStudyLens() {
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

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + lenses.length) % lenses.length;
    const nextLens = lenses[nextIndex];
    document.getElementById(`quote-story-tab-${nextLens}`)?.focus();
  };

  return (
    <section className="case-study-lens quote-story-lens" aria-labelledby="case-study-lens-title">
      <div className="case-lens-copy">
        <p className="case-lens-kicker">Behind the design</p>
        <h2 id="case-study-lens-title">The problems I was solving,<br />not just the screens I made.</h2>
        <p>
          A finished screen only shows the final answer. Use these four views to see
          what made each workflow difficult, how I thought through it, what I changed
          in the experience, and what that change means for the people using the product.
        </p>
      </div>

      {lenses.map((lens) => (
        <span className="quote-story-anchor" id={lens} key={`${lens}-anchor`} aria-hidden="true" />
      ))}

      <nav className="case-lens-tabs quote-story-tabs" role="tablist" aria-label="Quote Plus case study narrative lens">
        {lenses.map((lens, index) => (
          <a
            id={`quote-story-tab-${lens}`}
            key={lens}
            href={`#${lens}`}
            role="tab"
            aria-selected={activeLens === lens}
            aria-controls="quote-story-panel"
            className={activeLens === lens ? "is-active" : ""}
            onClick={() => setActiveLens(lens)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {lensLabels[lens]}
          </a>
        ))}
      </nav>

      <div
        id="quote-story-panel"
        className="quote-story-panel"
        data-story={activeLens}
        role="tabpanel"
        aria-labelledby={`quote-story-tab-${activeLens}`}
        key={activeLens}
      >
        {activeLens === "challenge" && <ChallengePanel />}
        {activeLens === "approach" && <ApproachPanel />}
        {activeLens === "solution" && <SolutionPanel />}
        {activeLens === "impact" && <ImpactPanel />}
      </div>

      <p className="case-lens-disclosure">
        I&apos;ve kept the impact statements qualitative because I don&apos;t have reliable
        post-launch analytics for these screens. I&apos;d rather show the real product value
        than attach made-up percentages to the work.
      </p>

      <div className="quote-story-handoff">
        <a href="#workflows">
          Continue to product walkthrough <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
