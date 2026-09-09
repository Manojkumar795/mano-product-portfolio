import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ColourfulText from "../ColourfulText";
import { WalkthroughJumpLink } from "../WalkthroughNav";
import SustainCaseStudyLens from "./SustainCaseStudyLens";
import SustainScrollMotion from "./SustainScrollMotion";
import SustainVariationGallery from "./SustainVariationGallery";

export const metadata: Metadata = {
  title: "Sustain+ — ESG Reporting & Improvement UX | Manoj Kumar N",
  description:
    "An enterprise product design case study connecting ESG frameworks, ownership, evidence, reporting readiness and operational improvement.",
};

const responseVariations = [
  {
    title: "Quick assignment",
    summary: "Coordinate owners and status before opening the work.",
    decision:
      "This direction puts bulk selection, ownership and status filters first. It is useful when a reporting lead is distributing work across a large framework.",
    src: "/sustain-plus/response-quick-actions.webp",
    alt: "Sustain Plus quick assignment variation with status filters, ownership and expanded question",
    width: 1917,
    height: 2045,
  },
  {
    title: "Review in context",
    summary: "Keep the response, evidence and conversation together.",
    decision:
      "This direction gives reviewers one continuous workspace for the answer, evidence, notes and audit history. The hierarchy stays visible without interrupting review.",
    src: "/sustain-plus/response-review.webp",
    alt: "Sustain Plus review variation with answer, attachments, notes and audit history",
    width: 1917,
    height: 2045,
  },
  {
    title: "Bulk triage",
    summary: "Filter, select and reassign questions at framework scale.",
    decision:
      "This direction separates coordination from detailed response work. It makes large assignment changes easier while retaining section and sub-section context.",
    src: "/sustain-plus/response-assignment.webp",
    alt: "Sustain Plus bulk triage variation with filters and hierarchical question assignment",
    width: 1885,
    height: 2015,
  },
];

const measurementPlan = [
  {
    area: "Framework setup",
    signal: "Configuration effort",
    watch: "Time to create a framework and define its question rules.",
  },
  {
    area: "Assignment",
    signal: "Ownership coverage",
    watch: "Questions without an owner and reassignment frequency.",
  },
  {
    area: "Response review",
    signal: "Clarification rework",
    watch: "Review cycles and time spent finding supporting evidence.",
  },
  {
    area: "Reporting",
    signal: "Readiness",
    watch: "On-time approvals and incomplete sections near the due date.",
  },
  {
    area: "Idea Bank",
    signal: "Decision follow-through",
    watch: "Ideas compared, selected and moved toward implementation.",
  },
];

const strengths = [
  {
    title: "One reporting hierarchy",
    text: "Frameworks, sections, sub-sections and questions stay recognizable across setup, assignment, response and progress views.",
  },
  {
    title: "Evidence stays with the answer",
    text: "Attachments, notes and history remain in the review context instead of becoming a separate document-management task.",
  },
  {
    title: "Summaries reveal the work",
    text: "Portfolio and report views support different levels of review without disconnecting the progress number from its underlying questions.",
  },
  {
    title: "Improvement is part of the system",
    text: "Idea Bank connects sustainability reporting with a practical way to compare operational opportunities.",
  },
];

const improvements = [
  {
    title: "Shorten framework authoring",
    text: "Group the long question form into clear stages and reveal conditional fields only when their response type requires them.",
  },
  {
    title: "Clarify the status language",
    text: "Use the full wording consistently instead of mixing labels such as CR, Clarification Required and Clarify Needed.",
  },
  {
    title: "Use more than color",
    text: "Pair every progress and status color with an icon or explicit label, including chart segments and compact table states.",
  },
  {
    title: "Design a focused mobile review",
    text: "Replace wide data tables with report summaries, priority questions and a dedicated evidence-review flow on smaller screens.",
  },
];

type ScreenProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  note?: string;
  className?: string;
  priority?: boolean;
  autoScroll?: boolean;
};

function ProductScreen({
  src,
  alt,
  width,
  height,
  label,
  note,
  className = "",
  priority = false,
  autoScroll = false,
}: ScreenProps) {
  return (
    <figure className={`sustain-screen ${className}`} data-sustain-reveal>
      <div className="sustain-screen-bar" aria-hidden="true"><b>{label}</b></div>
      <div className={`sustain-screen-media${autoScroll ? " sustain-auto-scroll" : ""}`}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          sizes="(max-width: 900px) 94vw, (max-width: 1300px) 86vw, 1420px"
        />
      </div>
      {note && (
        <figcaption>
          <span>{note}</span>
          <a href={src} target="_blank" rel="noreferrer">View full interface <i aria-hidden="true">↗</i></a>
        </figcaption>
      )}
    </figure>
  );
}

export default function SustainPlusCaseStudy() {
  return (
    <main className="sustain-case">
      <SustainScrollMotion />

      <header className="sustain-nav">
        <Link className="sustain-brand" href="/#work" aria-label="Back to selected work">
          <span>MK</span><strong>Manoj Kumar N</strong>
        </Link>
        <nav aria-label="Sustain Plus case study navigation">
          <a href="#system">Overview</a>
          <a href="#challenge">Challenge</a>
          <a href="#approach">Approach</a>
          <a href="#solution">Solution</a>
          <a href="#impact">Impact</a>
          <WalkthroughJumpLink targetId="workflows">Product walkthrough <span aria-hidden="true">↓</span></WalkthroughJumpLink>
        </nav>
        <Link className="sustain-nav-cta" href="/#contact">Let&apos;s talk <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="sustain-hero" id="top">
        <div className="sustain-hero-glow" aria-hidden="true" />
        <div className="sustain-hero-copy">
          <div className="sustain-kicker">
            <span>Sustainability reporting platform</span>
            <i>Governance → evidence → improvement</i>
          </div>
          <h1>Sustain<span>+</span></h1>
          <p className="sustain-hero-lead">
            A governed workspace for ESG frameworks, question ownership,
            evidence, reporting progress and improvement ideas.
          </p>
          <div className="sustain-hero-tags" aria-label="Case study focus areas">
            <span>Enterprise UX</span>
            <span>Reporting workflows</span>
            <span>Information architecture</span>
            <span>Design systems</span>
          </div>
        </div>

        <div className="sustain-hero-stage" aria-label="Selected Sustain Plus product screens">
          <ProductScreen
            className="sustain-hero-main"
            src="/sustain-plus/report-summary.webp"
            alt="Sustain Plus report summary with question status, section progress and individual disclosures"
            width={1920}
            height={1080}
            label="Report readiness"
            priority
          />
          <ProductScreen
            className="sustain-hero-side sustain-hero-side-a"
            src="/sustain-plus/response-review.webp"
            alt="Sustain Plus response review with evidence and audit context"
            width={1917}
            height={2045}
            label="Evidence review"
            priority
            autoScroll
          />
          <ProductScreen
            className="sustain-hero-side sustain-hero-side-b"
            src="/sustain-plus/idea-bank-filtered.webp"
            alt="Sustain Plus Idea Bank with filters, impact metrics and improvement ideas"
            width={1043}
            height={2048}
            label="Idea Bank"
            priority
            autoScroll
          />
        </div>

        <dl className="sustain-facts">
          <div><dt>Role</dt><dd>Lead Product Designer</dd></div>
          <div><dt>Product</dt><dd>ESG reporting + improvement</dd></div>
          <div><dt>Core users</dt><dd>Administrators · owners · reviewers</dd></div>
          <div><dt>Scope shown</dt><dd>Framework setup → approved report</dd></div>
        </dl>
      </section>

      <section className="sustain-context" id="system">
        <div className="sustain-context-heading" data-sustain-reveal>
          <h2>Turn reporting requirements into <ColourfulText text="work people can own." tone="sustain" /></h2>
          <div>
            <p>
              ESG reporting is not one form. Standards change by framework and
              year. Answers come from different teams. Every disclosure can need
              context, evidence, clarification and approval.
            </p>
            <p>
              Sustain+ connects those responsibilities in one product model,
              then carries reporting insight forward into operational improvement.
            </p>
          </div>
        </div>
        <div className="sustain-context-rail" data-sustain-reveal>
          <article><span>Configure</span><strong>Turn standards into reusable reporting structures.</strong></article>
          <article><span>Coordinate</span><strong>Give questions clear owners and states.</strong></article>
          <article><span>Govern</span><strong>Review answers with evidence and history intact.</strong></article>
          <article><span>Improve</span><strong>Compare practical ideas beyond the report.</strong></article>
        </div>
      </section>

      <SustainCaseStudyLens />

      <section className="sustain-architecture" data-sustain-reveal>
        <div>
          <h2>One reporting model.<br />Different views for different decisions.</h2>
          <p>
            The same framework hierarchy, question state, owner and evidence
            move through the system. Each role gets a focused view without
            creating a second version of the truth.
          </p>
        </div>
        <ol>
          <li><strong>Configure</strong><span>Framework rules</span></li>
          <li><strong>Assign</strong><span>Owners + due work</span></li>
          <li><strong>Respond</strong><span>Answers + evidence</span></li>
          <li><strong>Review</strong><span>Clarify + approve</span></li>
          <li><strong>Report</strong><span>Readiness + export</span></li>
          <li><strong>Improve</strong><span>Ideas + implementation</span></li>
        </ol>
      </section>

      <section className="sustain-workflows" id="workflows">
        <header className="sustain-walkthrough-boundary" data-sustain-reveal>
          <span>Product walkthrough</span>
          <h2>See how the reporting model behaves in the product.</h2>
          <p>The tabs above explain the thinking. The screens below show the detailed workflows.</p>
        </header>

        <section className="sustain-chapter" id="frameworks">
          <div className="sustain-chapter-head" data-sustain-reveal>
            <div><span>Framework setup</span><h2>Make a standard reusable before the reporting starts.</h2></div>
            <p>
              Administrators can find a framework, understand its version and
              state, then define the question behavior that every contributor
              and reviewer will inherit.
            </p>
          </div>
          <ProductScreen
            src="/sustain-plus/framework-library.webp"
            alt="Framework library with search, filters, cards, versions and lifecycle states"
            width={1920}
            height={1080}
            label="Framework library"
            note="Frameworks remain searchable and stateful instead of becoming static templates."
          />
          <div className="sustain-authoring-layout">
            <ProductScreen
              src="/sustain-plus/question-authoring.webp"
              alt="Cropped question authoring form with response rules, evidence requirements and linked questions"
              width={1050}
              height={1954}
              label="Question authoring"
              note="The export was cropped to the meaningful form area; the unused right-side canvas was removed."
            />
            <div className="sustain-authoring-copy" data-sustain-reveal>
              <h3>One question carries more than a prompt.</h3>
              <p>
                Response type, guidance, required evidence, unit of measurement,
                labels and linked questions define how the disclosure behaves later.
              </p>
              <ul>
                <li>Reusable rules instead of one-off forms</li>
                <li>Mandatory evidence visible before response</li>
                <li>Linked questions preserve reporting context</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="sustain-chapter sustain-chapter-dark" id="responses">
          <div className="sustain-chapter-head" data-sustain-reveal>
            <div><span>Ownership + review</span><h2>The same workflow needed three different operating modes.</h2></div>
            <p>
              The variation work was not cosmetic. Each direction tests a
              different moment: distributing responsibility, reviewing a
              response and coordinating many questions at once.
            </p>
          </div>
          <SustainVariationGallery label="Response workflow variations" variations={responseVariations} />
        </section>

        <section className="sustain-chapter" id="reporting">
          <div className="sustain-chapter-head" data-sustain-reveal>
            <div><span>Reporting readiness</span><h2>One percentage is not enough to explain whether a report is ready.</h2></div>
            <p>
              The portfolio view answers “Which reports need attention?” The
              report workspace answers “Which sections, questions and owners
              are behind that status?”
            </p>
          </div>
          <div className="sustain-report-stack">
            <ProductScreen
              src="/sustain-plus/reporting-portfolio.webp"
              alt="Portfolio dashboard comparing ESG reports by framework, year, owner, status and progress"
              width={1920}
              height={1080}
              label="Portfolio view"
              note="A scan-level view across frameworks, reporting years, owners and due dates."
            />
            <ProductScreen
              src="/sustain-plus/report-summary.webp"
              alt="Report summary showing metadata, question status distribution, section progress and question table"
              width={1920}
              height={1080}
              label="Report workspace"
              note="The progress number is supported by section and question detail."
            />
          </div>
          <div className="sustain-report-variations" data-sustain-reveal>
            <div className="sustain-report-variation-copy">
              <span>Summary explorations</span>
              <h3>Different review contexts needed different density.</h3>
              <p>
                The compact direction keeps report metadata, progress and
                questions in one vertical review.
              </p>
            </div>
            <figure className="sustain-compact-report">
              <Image src="/sustain-plus/report-summary-compact.webp" alt="Compact vertical report summary variation" width={957} height={1599} unoptimized />
            </figure>
          </div>
        </section>

        <section className="sustain-chapter sustain-idea-bank" id="ideas">
          <div className="sustain-chapter-head" data-sustain-reveal>
            <div><span>Idea Bank</span><h2>Reporting identifies the issue. Improvement needs a practical next step.</h2></div>
            <p>
              Idea Bank helps teams explore opportunities, narrow a large set
              with business and operational filters, then compare savings,
              cost, payback and implementation signals.
            </p>
          </div>
          <div className="sustain-idea-stage">
            <ProductScreen
              src="/sustain-plus/idea-bank-unfiltered.webp"
              alt="Idea Bank showing the complete opportunity list before a filter is applied"
              width={1103}
              height={1871}
              label="No filter"
            />
            <ProductScreen
              src="/sustain-plus/idea-bank-filtered.webp"
              alt="Idea Bank with an active filter and refined opportunity results"
              width={1043}
              height={2048}
              label="Filter applied"
            />
          </div>
        </section>
      </section>

      <section className="sustain-reflection" id="reflection">
        <div className="sustain-reflection-head" data-sustain-reveal>
          <h2>What works today.<br /><ColourfulText text="What I would improve next." tone="sustain" /></h2>
          <p>
            The product has a strong underlying model. The next level is making
            configuration lighter, status language more consistent and review
            more accessible across devices.
          </p>
        </div>
        <div className="sustain-reflection-grid">
          <section data-sustain-reveal>
            <h3>Worth protecting</h3>
            {strengths.map((item) => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}
          </section>
          <section data-sustain-reveal>
            <h3>Highest-value improvements</h3>
            {improvements.map((item) => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}
          </section>
        </div>

        <section className="sustain-measurement" data-sustain-reveal>
          <div><h3>How I would prove the workflow is becoming clearer.</h3><p>No invented impact numbers—just the signals that should move after release.</p></div>
          <div className="sustain-measurement-grid">
            {measurementPlan.map((item) => (
              <article key={item.area}>
                <span>{item.area}</span><h4>{item.signal}</h4><p>{item.watch}</p>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="sustain-outro" id="contact">
        <div data-sustain-reveal>
          <span>Sustain+ case study</span>
          <h2>A reporting system people can <ColourfulText text="understand, own and trust." tone="sustain" /></h2>
        </div>
        <div className="sustain-outro-actions">
          <Link href="/#work">Back to selected work <span aria-hidden="true">↗</span></Link>
          <Link href="/#contact">Let&apos;s talk <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
