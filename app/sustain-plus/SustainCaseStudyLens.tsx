"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

type StoryLens = "challenge" | "approach" | "solution" | "impact";

const lenses: StoryLens[] = ["challenge", "approach", "solution", "impact"];

const labels: Record<StoryLens, string> = {
  challenge: "Challenge",
  approach: "Approach",
  solution: "Solution",
  impact: "Impact",
};

const jobs = [
  {
    title: "Set up the framework",
    text: "Standards arrive with versions, sections, questions and evidence requirements. The product had to preserve that structure without making administrators rebuild every report by hand.",
  },
  {
    title: "Give every question an owner",
    text: "One disclosure can depend on several teams. Assignment needed to work at section and question level while keeping the reporting hierarchy visible.",
  },
  {
    title: "Review the answer with its evidence",
    text: "A response is not ready because a text field is complete. Reviewers need the answer, attachments, notes, history and approval state in the same working context.",
  },
  {
    title: "Know whether the report is ready",
    text: "Leaders need a fast view across reports, while owners need to understand the exact sections and questions holding progress back.",
  },
  {
    title: "Move from reporting to improvement",
    text: "Sustainability work should not stop at disclosure. Teams also needed a way to compare improvement ideas by savings, cost, payback and implementation effort.",
  },
];

const reasoning = [
  {
    title: "Start with the reporting hierarchy",
    text: "I treated framework, section, sub-section and question as the product backbone. That made it possible to reuse the same model across setup, assignment, response and reporting.",
  },
  {
    title: "Separate configuration from execution",
    text: "Administrators need control over question rules and evidence requirements. Contributors need a clear task. Reviewers need the answer and its history. I designed those as connected modes rather than one universal screen.",
  },
  {
    title: "Make status operational",
    text: "Open, assigned, clarification, review and approved are not decorative labels. I used them to drive filters, ownership, bulk actions and progress summaries.",
  },
  {
    title: "Keep evidence beside the disclosure",
    text: "Files, notes and audit history stay attached to the question so a reviewer does not have to reconstruct why an answer was accepted.",
  },
  {
    title: "Design summaries at two levels",
    text: "The portfolio view supports comparison across reports. The report workspace explains the sections, questions and owners behind one progress number.",
  },
  {
    title: "Test different operating modes",
    text: "I explored quick assignment, review-in-context and bulk triage layouts. The variations helped clarify which controls belonged to coordination and which belonged to the response itself.",
  },
];

const transformations = [
  {
    title: "Frameworks become reusable structures",
    text: "Version, section, question type, guidance, labels and evidence rules can be configured once and carried into reporting work.",
    src: "/sustain-plus/framework-library.webp",
    alt: "Sustain Plus framework library with search, filters, states and framework cards",
    width: 1920,
    height: 1080,
  },
  {
    title: "Questions become governed work",
    text: "A disclosure now carries an owner, state, response, evidence, notes and history instead of behaving like an isolated form field.",
    src: "/sustain-plus/response-review.webp",
    alt: "Sustain Plus response review with ownership, evidence, notes and audit history",
    width: 1917,
    height: 2045,
  },
  {
    title: "Progress becomes explainable",
    text: "Portfolio and report summaries show the work behind the percentage, making incomplete sections and question states visible before export.",
    src: "/sustain-plus/report-summary.webp",
    alt: "Sustain Plus report summary with question status, section progress and individual disclosures",
    width: 1920,
    height: 1080,
  },
  {
    title: "Ideas become comparable decisions",
    text: "Idea Bank brings filters, implementation signals and financial context together so teams can move from discovery to a practical next step.",
    src: "/sustain-plus/idea-bank-filtered.webp",
    alt: "Sustain Plus Idea Bank with active filters, charts and comparable improvement ideas",
    width: 1043,
    height: 2048,
  },
];

const outcomes = [
  {
    title: "Clearer ownership",
    text: "Teams can see who is responsible at report, section and question level, with assignment staying visible inside the work.",
  },
  {
    title: "Less context reconstruction",
    text: "Responses, evidence, notes and history travel together, so review does not begin with searching across separate tools.",
  },
  {
    title: "More honest readiness",
    text: "Progress can be read by status and section instead of relying on one percentage that hides unfinished work.",
  },
  {
    title: "A scalable reporting model",
    text: "The same framework structure and status language can support different standards, reporting years and teams.",
  },
  {
    title: "A path from disclosure to action",
    text: "The product connects reporting with a structured way to discover and compare improvement opportunities.",
  },
];

function getLens(): StoryLens | null {
  if (typeof window === "undefined") return null;
  const lens = window.location.hash.slice(1) as StoryLens;
  return lenses.includes(lens) ? lens : null;
}

function ChallengePanel() {
  return (
    <div className="sustain-lens-challenge">
      <p className="sustain-lens-lede">
        ESG reporting looked like a collection of forms. In practice, it was a
        chain of responsibility: configure the standard, assign the work,
        support every answer and know what is ready.
      </p>
      <div className="sustain-problem-grid">
        {jobs.map((job) => (
          <article key={job.title}>
            <h3>{job.title}</h3>
            <p>{job.text}</p>
          </article>
        ))}
      </div>
      <div className="sustain-system-map" aria-label="Connected Sustain Plus reporting workflow">
        {["Framework", "Ownership", "Response", "Review", "Report", "Improve"].map((item, index, list) => (
          <Fragment key={item}>
            <div><span>{item}</span></div>
            {index < list.length - 1 && <i aria-hidden="true">→</i>}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ApproachPanel() {
  return (
    <div className="sustain-lens-approach">
      <div className="sustain-approach-intro">
        <p>
          One pattern connected every screen: the question, owner, evidence and
          state had to survive every handoff.
        </p>
      </div>
      <ol className="sustain-reasoning-flow">
        {reasoning.map((step) => (
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
  );
}

function SolutionPanel() {
  return (
    <div className="sustain-lens-solution">
      <p className="sustain-lens-lede">
        The solution was a shared information model with purpose-built views.
        Administrators configure the rules, contributors complete the work,
        reviewers govern the evidence and leaders see readiness.
      </p>
      <div className="sustain-transformations">
        {transformations.map((item) => (
          <article key={item.title}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
            <figure>
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
                sizes="(max-width: 900px) 92vw, 57vw"
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
    <div className="sustain-lens-impact">
      <p className="sustain-lens-lede">
        The most important change was not one dashboard. Reporting work became
        easier to trace from requirement to owner, answer, evidence and outcome.
      </p>
      <ol>
        {outcomes.map((outcome) => (
          <li key={outcome.title}>
            <span aria-hidden="true" />
            <div>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="sustain-impact-close">
        I wasn&apos;t trying to make ESG reporting look lightweight. I was trying
        to make responsibility, evidence and readiness easier to understand.
      </p>
    </div>
  );
}

export default function SustainCaseStudyLens() {
  const [activeLens, setActiveLens] = useState<StoryLens>("challenge");

  useEffect(() => {
    const sync = () => {
      const lens = getLens();
      if (lens) setActiveLens(lens);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <section className="sustain-story-lens" aria-labelledby="sustain-story-title">
      <div className="sustain-story-heading">
        <h2 id="sustain-story-title">The reporting system behind the screens.</h2>
        <p>
          Use the four views to move from the product problem to the reasoning,
          design decisions and qualitative outcome. The detailed interfaces
          stay in the product walkthrough below.
        </p>
      </div>

      {lenses.map((lens) => (
        <span className="sustain-story-anchor" id={lens} key={lens} aria-hidden="true" />
      ))}

      <nav className="sustain-story-tabs" role="tablist" aria-label="Sustain Plus case study story">
        {lenses.map((lens) => (
          <a
            key={lens}
            href={`#${lens}`}
            role="tab"
            aria-selected={activeLens === lens}
            aria-controls="sustain-story-panel"
            className={activeLens === lens ? "is-active" : ""}
            onClick={() => setActiveLens(lens)}
          >
            {labels[lens]}
          </a>
        ))}
      </nav>

      <div
        id="sustain-story-panel"
        className="sustain-story-panel"
        data-story={activeLens}
        role="tabpanel"
        aria-label={`${labels[activeLens]} story`}
        key={activeLens}
      >
        {activeLens === "challenge" && <ChallengePanel />}
        {activeLens === "approach" && <ApproachPanel />}
        {activeLens === "solution" && <SolutionPanel />}
        {activeLens === "impact" && <ImpactPanel />}
      </div>

      <div className="sustain-story-handoff">
        <a href="#workflows">Continue to product walkthrough <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
