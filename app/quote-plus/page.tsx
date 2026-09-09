import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WalkthroughJumpLink } from "../WalkthroughNav";
import QuoteAuditExperience from "./QuoteAuditExperience";
import QuoteCaseStudyLens from "./QuoteCaseStudyLens";
import QuoteScrollMotion from "./QuoteScrollMotion";
import ColourfulText from "../ColourfulText";

export const metadata: Metadata = {
  title: "Quote+ — Enterprise RFQ & Quotation UX | Manoj Kumar N",
  description:
    "A flagship enterprise UX case study for Quote+, connecting RFQ intake, Go/No-Go qualification, collaborative quoting, customer decisions and new-business award handoff.",
};

const journey = [
  {
    index: "01",
    title: "Capture the RFQ",
    text: "Create one structured record for commercial, customer, product and timing inputs.",
  },
  {
    index: "02",
    title: "Qualify the opportunity",
    text: "Make the Go/No-Go decision explicit before expensive quote work begins.",
  },
  {
    index: "03",
    title: "Build the quote",
    text: "Coordinate suppliers, technical inputs, plants, documents and customer outcomes.",
  },
  {
    index: "04",
    title: "Align the team",
    text: "Assign people by role, distribution list and permission level.",
  },
  {
    index: "05",
    title: "Govern the evidence",
    text: "Keep files, versions, ownership and source context attached to the RFQ.",
  },
  {
    index: "06",
    title: "Convert the award",
    text: "Carry the winning commercial decision into a governed new-business record.",
  },
];

type CaseReasoningStory = {
  challenge: string;
  approach: string;
  solution: string;
  impact: string;
};

const quoteReasoning: Record<"rfq" | "gate" | "quote" | "team" | "evidence" | "award", CaseReasoningStory> = {
  rfq: {
    challenge:
      "An RFQ is not one simple form. A quote lead has to bring together customer details, vehicle data, timing, volumes and information coming from other systems. When everything is presented with the same weight, it becomes easy to miss what is incomplete or waste time checking fields that cannot even be edited.",
    approach:
      "I broke the problem into two questions: Is this RFQ ready? And what do I need to work on next? I grouped information by the business task and treated user-owned fields differently from protected or synchronized data, so the interface could point people toward the work that actually needs attention.",
    solution:
      "I moved the experience toward a summary-first flow. Each section can communicate its status before the user opens the detail, editable fields are clear, and connected-system information remains visible without looking like something the user should change. Detailed work is revealed only when it is needed.",
    impact:
      "For a quote lead, the practical benefit is confidence. It is easier to see where the RFQ is incomplete, go directly to the right section and understand when the record is ready for the next step. That also creates a cleaner handoff into quotation work without relying on memory.",
  },
  gate: {
    challenge:
      "Go or No-Go may look like a simple choice, but the business consequence is much bigger. Go allows quotation work to move forward, while No-Go can stop the opportunity. Treating that decision like an ordinary form option does not give the user enough context for such an important moment.",
    approach:
      "Before designing the control, I mapped what changes after each decision: what reason is needed, who owns the decision, what work follows and whether the opportunity continues, pauses or closes. That let me design around consequences instead of around the radio button itself.",
    solution:
      "I made the decision surface explain what will happen next before the user confirms it. The flow keeps rationale, ownership and the next lifecycle path in view, and asks for the right supporting information when the decision needs to be explained later.",
    impact:
      "A reviewer can make the choice with more confidence, and someone looking at the RFQ later can understand why that choice was made. The workflow is also clearer about whether quote work should move forward or stop, which strengthens the commercial decision record.",
  },
  quote: {
    challenge:
      "Win, Next Round and Loss are not just status labels. A Win moves the opportunity forward, a Loss closes it, and Next Round sends the team back into quotation work with new customer input. A simple linear progress flow would hide that real-world loop.",
    approach:
      "I mapped the customer decision as a branching lifecycle rather than forcing it into a straight stepper. For each outcome, I looked at what information should stay, what new work should appear and where the user should land next.",
    solution:
      "I gave each outcome its own clear next step. Next Round keeps the existing quotation context so the team can revise rather than restart, while Win can continue toward award and Loss can close the opportunity with the right commercial history still attached.",
    impact:
      "The team does not have to rebuild context every time the customer asks for another round. Revisions stay connected to the same opportunity, and the commercial history is easier to follow whether the quote eventually wins, repeats or closes.",
  },
  team: {
    challenge:
      "A quotation can involve sales, costing, engineering, plants and other teams, and not everyone should have the same access. Some people only need to view information, others need to edit it, and groups may be added together. A simple participant list hides too much of that responsibility.",
    approach:
      "I started with responsibility: what role is this person playing in the quote? From there I connected the person or group and the access they need. Keeping role, identity and permission together makes the decision easier to understand than separating it into an admin-only permissions screen.",
    solution:
      "I designed role-based team areas where users can add an individual or a group and see the relevant membership and View/Edit level before the assignment is made. The quote lead can understand who is participating, why they are there and what they can do in the same flow.",
    impact:
      "Ownership becomes easier to understand before sensitive commercial work is shared. The model can also grow with a larger cross-functional team because responsibility and access stay explicit instead of becoming an increasingly long list of names.",
  },
  evidence: {
    challenge:
      "RFQs collect BOMs, drawings, purchase orders and many other files. Once that list grows, a filename alone is not enough to tell someone what the document supports, where it came from or whether it belongs to the right quote version.",
    approach:
      "I treated attachments as business evidence rather than generic file storage. I focused on three simple questions a team member may have: What is this? Where did it come from? And which part of the quotation does it support?",
    solution:
      "I combined useful categories and filters with detailed file rows that keep source section, uploader and quote-version context visible. The goal was to help people find a document quickly while still preserving enough provenance for someone reviewing the quotation later.",
    impact:
      "Supporting material is easier to find and understand during active quote work, and a later reviewer has more context than a folder full of filenames. That reduces dependence on someone remembering where a file came from and creates a stronger base for audit and handoff.",
  },
  award: {
    challenge:
      "A customer Win is not the end of the work. The business still needs to carry customer, plant, volume, pricing and tooling context into the next stage. Starting a new record from scratch would force the team to reconstruct information they have already established during the RFQ.",
    approach:
      "I treated award as a continuation of the same lifecycle, not a separate product moment. I looked at which confirmed RFQ information should travel forward automatically and which new information belongs specifically to the new-business stage.",
    solution:
      "I designed the New Business Award workspace to carry confirmed RFQ context forward, then organize the additional business, plant, volume, pricing and tooling information needed next. The handoff stays connected to the commercial decision that created it.",
    impact:
      "The team can move from a commercial Win into the next operating stage without starting from an empty record. Important context stays connected, repeated setup is reduced, and the next team receives a clearer foundation to continue the work.",
  },
};

const quoteLensItems = [
  { title: "RFQ intake", ...quoteReasoning.rfq },
  { title: "Go / No-Go", ...quoteReasoning.gate },
  { title: "Customer Decision", ...quoteReasoning.quote },
  { title: "Team + permissions", ...quoteReasoning.team },
  { title: "Attachments", ...quoteReasoning.evidence },
  { title: "New Business Award", ...quoteReasoning.award },
];

const roles = [
  ["Quote lead", "Owns the opportunity and the customer relationship."],
  ["Cost estimator", "Builds pricing inputs and commercial assumptions."],
  ["Plant engineering", "Reviews feasibility, process and machine requirements."],
  ["Account teams", "Add market, customer and plant-specific knowledge."],
];

const systemPatterns = [
  {
    label: "Orientation",
    title: "Product tabs + stage steps",
    text: "Users always know which workspace and lifecycle stage they are in.",
  },
  {
    label: "Progressive work",
    title: "Summary → section → field",
    text: "Teams can scan completeness before opening dense details.",
  },
  {
    label: "Decision safety",
    title: "Select → explain → confirm",
    text: "High-impact decisions reveal their consequence before submission.",
  },
  {
    label: "Traceability",
    title: "State · owner · version · evidence",
    text: "Every important record carries the context needed for review.",
  },
];

const colorTokens = [
  { token: "Brand / 600", name: "Quote blue", value: "#34649E", className: "brand" },
  { token: "Ink / 950", name: "Primary ink", value: "#0D1628", className: "ink" },
  { token: "Surface / 0", name: "Main surface", value: "#FFFFFF", className: "surface" },
  { token: "Surface / 50", name: "Quiet surface", value: "#F4F7FA", className: "subtle" },
  { token: "Success / 600", name: "Approved", value: "#009F6B", className: "success" },
  { token: "Warning / 500", name: "Needs review", value: "#E9A11B", className: "warning" },
  { token: "Critical / 600", name: "Stopped", value: "#E52C35", className: "critical" },
  { token: "Info / 500", name: "In progress", value: "#397FE5", className: "info" },
];

const typeScale = [
  { role: "Display", spec: "64 / 64 · 650", sample: "Quote decisions", className: "display" },
  { role: "Page title", spec: "32 / 40 · 620", sample: "Go / No-Go Decision", className: "title" },
  { role: "Body", spec: "16 / 26 · 400", sample: "Keep the RFQ, decision and evidence connected.", className: "body" },
  { role: "System label", spec: "12 / 16 · 600", sample: "STATUS / PENDING REVIEW", className: "label" },
];

const strengths = [
  {
    index: "01",
    title: "A visible lifecycle",
    text: "RFQ, qualification, quote work, collaboration and award live in one product model.",
  },
  {
    index: "02",
    title: "Decisions show consequences",
    text: "Go, No-Go, Next Round and Loss each explain what happens before confirmation.",
  },
  {
    index: "03",
    title: "Evidence stays in context",
    text: "Attachments remain connected to their source section, uploader and RFQ version.",
  },
  {
    index: "04",
    title: "Roles scale beyond individuals",
    text: "Teams can add named users or distribution groups with clear access levels.",
  },
];

const improvements = [
  {
    index: "01",
    title: "Reduce navigation layers",
    text: "The product tab, lifecycle step and accordion can compete. Keep one level primary and make the others contextual.",
  },
  {
    index: "02",
    title: "Make long forms easier to finish",
    text: "Show required-field counts, save progress by section and reveal advanced fields only when they apply.",
  },
  {
    index: "03",
    title: "Strengthen irreversible actions",
    text: "Add a final summary, named approver and recovery policy before a No-Go or Loss closes the workflow.",
  },
  {
    index: "04",
    title: "Design a true mobile review mode",
    text: "Use decision summaries, section cards and focused details instead of shrinking desktop tables and forms.",
  },
];

const measurementPlan: Array<[string, string]> = [
  ["RFQ setup", "Time to complete required inputs and validation-error rate"],
  ["Qualification", "Decision cycle time and percentage with a documented rationale"],
  ["Quote project", "Revision loops before Win, Next Round or Loss"],
  ["Collaboration", "Role coverage and permission-correction rate"],
  ["Evidence", "Time to retrieve the latest file and uncategorized-file rate"],
  ["Award handoff", "Time from confirmed Win to complete award record"],
];

const caseStudyTakeaways = [
  {
    index: "01",
    title: "Visible readiness",
    text: "Completion and missing work stay visible before field-level detail.",
  },
  {
    index: "02",
    title: "Safer decisions",
    text: "Every branch explains its consequence, required input and next stage.",
  },
  {
    index: "03",
    title: "Governed handoff",
    text: "People, evidence and version context travel with the decision.",
  },
];

type QuoteScreenProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  note?: string;
  className?: string;
  crop?: "short" | "medium" | "tall";
  objectPosition?: string;
  priority?: boolean;
};

function QuoteScreen({
  src,
  alt,
  width,
  height,
  label,
  note,
  className = "",
  crop,
  objectPosition = "top",
  priority = false,
}: QuoteScreenProps) {
  const positionStyle = { "--qp-object-position": objectPosition } as CSSProperties;

  return (
    <figure className={`qp-screen ${crop ? `qp-crop-${crop}` : ""} ${className}`}>
      <div className="qp-screen-bar" aria-hidden="true">
        <b>{label}</b>
      </div>
      <div className="qp-screen-media" style={positionStyle}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          sizes="(max-width: 760px) 94vw, (max-width: 1200px) 88vw, 1400px"
        />
      </div>
      {note && (
        <figcaption>
          <span>{note}</span>
          <a href={src} target="_blank" rel="noreferrer">
            View full interface <i aria-hidden="true">↗</i>
          </a>
        </figcaption>
      )}
    </figure>
  );
}

export default function QuotePlusCaseStudy() {
  return (
    <main className="quote-case">
      <QuoteScrollMotion />
      <header className="qp-nav">
        <Link className="qp-brand" href="/#work" aria-label="Back to selected work">
          <span>MK</span>
          <strong>Manoj Kumar N</strong>
        </Link>
        <nav aria-label="Quote Plus case study navigation">
          <a href="#overview">Overview</a>
          <a href="#challenge">Challenge</a>
          <a href="#approach">Approach</a>
          <a href="#solution">Solution</a>
          <a href="#impact">Impact</a>
          <WalkthroughJumpLink targetId="workflows">Product walkthrough <span aria-hidden="true">↓</span></WalkthroughJumpLink>
        </nav>
        <Link className="qp-nav-cta" href="/#contact">
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="qp-hero" id="top">
        <div className="qp-grid" aria-hidden="true" />
        <div className="qp-hero-glow" aria-hidden="true" />
        <div className="qp-hero-copy">
          <div className="qp-kicker">
            <span>RFQ-to-award workflow</span>
            <i>Enterprise quotation management</i>
          </div>
          <h1>Quote<span>+</span></h1>
          <p>
            A connected RFQ-to-award workspace for qualification, collaborative
            quoting, customer decisions and governed handoff.
          </p>
          <div className="qp-hero-tags" aria-label="Case study focus areas">
            <span>Enterprise UX</span>
            <span>Decision systems</span>
            <span>Workflow architecture</span>
            <span>Design systems</span>
          </div>
        </div>

        <div className="qp-hero-stage" aria-label="Selected Quote Plus product screens">
          <QuoteScreen
            className="qp-hero-main"
            src="/quote-plus/rfq-general-information.webp"
            alt="Quote Plus RFQ workspace with lifecycle steps, an expanded General Information section and contextual attachments"
            width={1486}
            height={1590}
            label="RFQ workspace"
            crop="medium"
            priority
          />
          <QuoteScreen
            className="qp-hero-side qp-hero-side-a"
            src="/quote-plus/go-decision.webp"
            alt="Quote Plus Go decision with workflow roadmap and confirmation controls"
            width={1486}
            height={846}
            label="Go / No-Go"
            crop="short"
            priority
          />
          <QuoteScreen
            className="qp-hero-side qp-hero-side-b"
            src="/quote-plus/team-permissions.webp"
            alt="Quote Plus team workspace with role groups, distribution lists and permission selection"
            width={1486}
            height={933}
            label="Team permissions"
            crop="short"
            priority
          />
        </div>

        <dl className="qp-facts">
          <div><dt>Role</dt><dd>Lead Product Designer</dd></div>
          <div><dt>Product</dt><dd>RFQ and quotation management</dd></div>
          <div><dt>Core users</dt><dd>Sales · estimating · engineering · account teams</dd></div>
          <div><dt>Scope shown</dt><dd>RFQ intake → qualification → award</dd></div>
        </dl>
      </section>

      <section className="qp-context" id="overview">
        <div className="qp-section-kicker"><span>01</span><p>Product framing</p></div>
        <div className="qp-context-head">
          <h2>The problem wasn&apos;t<br />the form. It was <ColourfulText text="ambiguity." tone="quote" /></h2>
          <div>
            <p>
              Quotation work crosses sales, costing, engineering, plants and
              customer teams. Each group owns a different part of the answer,
              but the business still needs one clear decision.
            </p>
            <p>
              Quote+ connects the record, people, evidence and workflow state.
              The goal is not simply to digitize forms; it is to make the path
              from opportunity to award understandable and traceable.
            </p>
          </div>
        </div>
      </section>

      <QuoteCaseStudyLens />

      <section className="qp-architecture">
        <div className="qp-section-kicker qp-section-kicker-light"><span>02</span><p>Experience architecture</p></div>
        <div className="qp-architecture-head">
          <h2>One commercial journey.<br /><ColourfulText text="Six connected jobs." tone="quote" /></h2>
          <p>
            The information model carries context forward. A confirmed RFQ
            becomes quote work; a customer Win becomes a new-business award.
          </p>
        </div>
        <ol className="qp-flow">
          {journey.map((step) => (
            <li key={step.index}>
              <span>{step.index}</span>
              <div><strong>{step.title}</strong><p>{step.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="qp-workflows" id="workflows">
        <div className="qp-chapter qp-rfq" id="rfq-intake">
          <div className="qp-chapter-head">
            <div>
              <div className="qp-section-kicker"><span>03</span><p>RFQ intake</p></div>
              <h2>Structure first.<br />Detail when needed.</h2>
            </div>
            <p>
              A summary view shows all RFQ sections, completion states and file
              counts. Opening a section keeps the lifecycle visible while
              revealing the fields and evidence needed for that job.
            </p>
          </div>
          <QuoteScreen
            className="qp-rfq-overview"
            src="/quote-plus/rfq-overview.webp"
            alt="Quote Plus RFQ overview with quote type controls, lifecycle steps, section completion states and contextual file counts"
            width={1486}
            height={774}
            label="RFQ summary"
            note="Completion is visible before users enter the detail."
          />
          <div className="qp-rfq-detail">
            <QuoteScreen
              src="/quote-plus/rfq-general-information.webp"
              alt="Expanded Quote Plus General Information section with locked IDs, required fields and section-level attachments"
              width={1486}
              height={1590}
              label="General Information"
              note="The expanded section keeps record identity, required data and supporting files together."
              crop="tall"
            />
            <div className="qp-rationale-stack">
              <article><span>01 / Progressive disclosure</span><h3>Scan the whole RFQ before opening one section.</h3><p>Collapsed sections preserve orientation and reduce the weight of a long enterprise form.</p></article>
              <article><span>02 / Controlled identity</span><h3>System IDs stay visible and protected.</h3><p>Locked fields help users understand which identifiers come from connected systems.</p></article>
              <article><span>03 / Evidence in context</span><h3>Files live with the section they support.</h3><p>Users can upload, review and recover documents without leaving the RFQ.</p></article>
            </div>
          </div>
        </div>

        <div className="qp-chapter qp-gate" id="go-no-go">
          <div className="qp-gate-head">
            <div className="qp-heading-stack">
              <div className="qp-section-kicker qp-section-kicker-light"><span>04</span><p>Go / No-Go</p></div>
              <h2>A decision surface,<br /><ColourfulText text="not a radio button." tone="quote" /></h2>
            </div>
            <p>
              The gate shows the current stage, owner, due date, completed work
              and future path. The form changes with the decision so users see
              both the required input and the business consequence.
            </p>
          </div>
          <div className="qp-decision-compare">
            <QuoteScreen
              src="/quote-plus/go-decision.webp"
              alt="Go decision selected with green confirmation, workflow roadmap and next-stage explanation"
              width={1486}
              height={846}
              label="GO / continue"
              note="A positive decision advances the RFQ into quote work."
            />
            <QuoteScreen
              src="/quote-plus/no-go-decision.webp"
              alt="No-Go decision selected with required rationale, irreversible-action warning and terminated workflow roadmap"
              width={1486}
              height={946}
              label="NO-GO / stop"
              note="A negative decision requires a reason and explains the resulting lock."
            />
          </div>
          <div className="qp-decision-logic" aria-label="Go No-Go decision logic">
            <article className="go"><span>GO</span><strong>Advance</strong><p>Move to Quote Project and keep the RFQ context.</p></article>
            <i aria-hidden="true">→</i>
            <article className="hold"><span>NEED INFO</span><strong>Pause</strong><p>Keep ownership visible while missing information is resolved.</p></article>
            <i aria-hidden="true">→</i>
            <article className="stop"><span>NO-GO</span><strong>Close</strong><p>Capture the reason, notify people and stop downstream work.</p></article>
          </div>
        </div>

        <div className="qp-chapter qp-quote-project" id="quote-project">
          <div className="qp-quote-head">
            <div className="qp-heading-stack">
              <div className="qp-section-kicker"><span>05</span><p>Quote Project</p></div>
              <h2>The customer decision<br /><ColourfulText text="changes the workflow." tone="quote" /></h2>
            </div>
            <p>
              Supplier, technical and plant inputs lead to a customer outcome.
              Win, Next Round and Loss are not decorative status cards; each
              state reveals different work and a different path forward.
            </p>
          </div>
          <div className="qp-outcome-grid">
            <article className="qp-outcome-card win">
              <div><span>01 / WIN</span><h3>Convert the opportunity</h3><p>Continue to New Business Award after validation.</p></div>
              <QuoteScreen
                src="/quote-plus/quote-project-win.webp"
                alt="Quote Project with Win customer decision and confirmation that the workflow will move to New Business Award"
                width={1388}
                height={2048}
                label="Customer Win"
                crop="medium"
                objectPosition="50% 72%"
              />
            </article>
            <article className="qp-outcome-card next">
              <div><span>02 / NEXT ROUND</span><h3>Keep the quote active</h3><p>Capture the requested revision before the next submission.</p></div>
              <QuoteScreen
                src="/quote-plus/quote-project-next-round.webp"
                alt="Quote Project with Next Round selected and a required revision-comments panel"
                width={1308}
                height={2048}
                label="Next Round"
                crop="medium"
                objectPosition="50% 72%"
              />
            </article>
            <article className="qp-outcome-card loss">
              <div><span>03 / LOSS</span><h3>Close with a reason</h3><p>Require the loss reason and explain the recovery policy.</p></div>
              <QuoteScreen
                src="/quote-plus/quote-project-loss.webp"
                alt="Quote Project with Loss selected, a mandatory loss reason and warning that the RFQ will close"
                width={1341}
                height={2048}
                label="Customer Loss"
                crop="medium"
                objectPosition="50% 72%"
              />
            </article>
          </div>
        </div>

        <div className="qp-chapter qp-team" id="quote-team">
          <div className="qp-team-head">
            <div>
              <div className="qp-section-kicker qp-section-kicker-light"><span>06</span><p>Team + permissions</p></div>
              <h2>Organize contribution<br />around roles.</h2>
            </div>
            <p>
              Quote+ supports named participants and distribution groups. The
              selection drawer makes membership and View/Edit access visible
              before people are added to the RFQ.
            </p>
          </div>
          <div className="qp-team-composition">
            <QuoteScreen
              className="qp-team-primary"
              src="/quote-plus/team-permissions.webp"
              alt="Team page showing Quote Lead, Cost Estimator, Plant Engineering and distribution-list roles with an Add Participants permission drawer"
              width={1486}
              height={933}
              label="Role-based participant assignment"
              note="Groups and individual users share one selection model."
            />
            <QuoteScreen
              className="qp-team-secondary"
              src="/quote-plus/team-overview.webp"
              alt="Team overview with participant chips, empty roles, add actions and role creation"
              width={1486}
              height={781}
              label="Team summary"
              note="Filled and empty roles can be scanned from the same view."
            />
          </div>
          <div className="qp-role-grid">
            {roles.map(([role, text], index) => (
              <article key={role}><span>{String(index + 1).padStart(2, "0")}</span><strong>{role}</strong><p>{text}</p></article>
            ))}
          </div>
        </div>

        <div className="qp-chapter qp-evidence" id="quote-attachments">
          <div className="qp-evidence-head">
            <div className="qp-heading-stack">
              <div className="qp-section-kicker"><span>07</span><p>Attachments</p></div>
              <h2>Treat documents<br />as <ColourfulText text="product data." tone="quote" /></h2>
            </div>
            <p>
              The workspace supports category filters, list and card modes,
              file summaries, recent uploads and source-section context. A user
              can move from the RFQ&apos;s evidence picture to a specific file row.
            </p>
          </div>
          <div className="qp-evidence-compare">
            <QuoteScreen
              className="qp-evidence-primary"
              src="/quote-plus/attachments-overview.webp"
              alt="Attachment workspace showing grouped files, category filters, storage summary, recent uploads and uncategorized items"
              width={1486}
              height={1288}
              label="Evidence overview"
              note="Summary information supports triage before opening a group."
              crop="tall"
            />
            <QuoteScreen
              className="qp-evidence-secondary"
              src="/quote-plus/attachments-detail.webp"
              alt="Expanded attachment category with file name, source section, uploader, date, size and row actions"
              width={1486}
              height={1659}
              label="Evidence detail"
              note="The expanded group preserves provenance for every file."
              crop="tall"
            />
          </div>
          <aside className="qp-taxonomy-note">
            <span>Audit finding / information architecture</span>
            <h3>Purpose and format are two different questions.</h3>
            <p>
              A BOM can be a PDF, spreadsheet or CAD package. The scalable model
              is to classify the document by business purpose, then filter it by
              format. Mixing both in one list makes retrieval harder as volume grows.
            </p>
          </aside>
        </div>

        <div className="qp-chapter qp-award" id="new-business-award">
          <div className="qp-award-copy">
            <div className="qp-section-kicker qp-section-kicker-light"><span>08</span><p>New Business Award</p></div>
            <h2>A Win is the start<br />of the next <ColourfulText text="system." tone="quote" /></h2>
            <p>
              The award workspace converts the commercial outcome into program
              setup data: business unit, customer, product, plants, volumes,
              pricing and tooling.
            </p>
            <ul>
              <li><b>Carry context forward</b><span>The confirmed RFQ ID remains visible.</span></li>
              <li><b>Expose completeness</b><span>Required-field counts show what blocks progress.</span></li>
              <li><b>Plan the lifecycle</b><span>Annual volumes connect the award to program economics.</span></li>
            </ul>
          </div>
          <QuoteScreen
            className="qp-award-screen"
            src="/quote-plus/new-business-award.webp"
            alt="New Business Award workspace with general information, sales, annual volume and tooling sections"
            width={1074}
            height={2048}
            label="Award handoff"
            note="The winning quote becomes a structured, reviewable business record."
            crop="tall"
          />
        </div>
      </section>

      <section className="qp-system" id="design-system">
        <div className="qp-section-kicker"><p>Quote+ design system</p></div>
        <div className="qp-system-head">
          <h2>A workflow language<br />built for <ColourfulText text="consequence." tone="quote" /></h2>
          <p>
            The strongest repeated patterns are not visual decoration. They
            explain location, completeness, permission, evidence and the next
            safe action.
          </p>
        </div>
        <div className="qp-pattern-grid">
          {systemPatterns.map((pattern) => (
            <article key={pattern.label}><span>{pattern.label}</span><strong>{pattern.title}</strong><p>{pattern.text}</p></article>
          ))}
        </div>
        <div className="qp-foundations">
          <article className="qp-ds-panel qp-color-panel">
            <div className="qp-ds-head qp-ds-head-clean">
              <div><h3>Color has a job.</h3></div>
              <p>Blue anchors primary actions. Semantic colors communicate state. Neutral surfaces keep quotation work calm.</p>
            </div>
            <div className="qp-color-spectrum" aria-hidden="true">
              {colorTokens.map((color) => (
                <i className={`qp-color-${color.className}`} key={color.token} />
              ))}
            </div>
            <div className="qp-color-grid">
              {colorTokens.map((color) => (
                <div className="qp-color-token" key={color.token}>
                  <i className={`qp-color-${color.className}`} />
                  <span>{color.token}</span><strong>{color.name}</strong><small>{color.value}</small>
                </div>
              ))}
            </div>
          </article>
          <article className="qp-ds-panel qp-type-panel">
            <div className="qp-ds-head qp-ds-head-clean">
              <div><h3>Hierarchy you can scan.</h3></div>
              <p>Interface type stays familiar. Mono is reserved for IDs, status and compact system data.</p>
            </div>
            <div className="qp-type-families" aria-label="Typeface roles">
              <div><strong>Geist Sans</strong><span>Interface + content</span></div>
              <div><strong>Geist Mono</strong><span>IDs + system data</span></div>
            </div>
            <div className="qp-type-list">
              {typeScale.map((type) => (
                <div className={`qp-type-row qp-type-${type.className}`} key={type.role}>
                  <div><span>{type.role}</span><small>{type.spec}</small></div><p>{type.sample}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="qp-components">
          <article className="qp-ds-panel qp-component-panel">
            <div className="qp-ds-head qp-ds-head-clean"><div><h3>States stay predictable.</h3></div><p>Steps, decisions, roles, files and status labels follow the same interaction rules.</p></div>
            <div className="qp-component-canvas">
              <div className="qp-component-group">
                <span>Lifecycle step</span>
                <div className="qp-step-samples"><i className="done">✓ General Information</i><i className="active">5. Customer Decision</i><i>6. Workflow Status</i></div>
              </div>
              <div className="qp-component-group">
                <span>Decision</span>
                <div className="qp-decision-samples"><i className="approve">✓ Go</i><i className="revise">↻ Next Round</i><i className="reject">× No-Go</i></div>
              </div>
              <div className="qp-component-group">
                <span>Status + access</span>
                <div className="qp-status-samples"><i className="complete">Complete</i><i className="review">Pending Review</i><i className="access">Can edit⌄</i></div>
              </div>
              <div className="qp-access-note"><p><b>Accessible state</b>Color is reinforced by text, shape and icon. Focus remains visible for keyboard users.</p></div>
            </div>
          </article>
          <article className="qp-ds-panel qp-delivery-panel">
            <div className="qp-ds-head qp-ds-head-clean"><div><h3>Handoff the rules.</h3></div><p>Tokens, components and workflow logic stay connected to implementation.</p></div>
            <ol>
              <li><span>01</span><div><b>Tokens</b><p>Color, type, spacing, radius and elevation map to product variables.</p></div></li>
              <li><span>02</span><div><b>Components</b><p>Steps, accordions, decisions, role rows and file rows use named variants.</p></div></li>
              <li><span>03</span><div><b>State matrix</b><p>Loading, empty, error, disabled, locked and permission states are specified.</p></div></li>
              <li><span>04</span><div><b>Workflow contract</b><p>Validation and transition rules stay aligned with the product&apos;s business logic.</p></div></li>
            </ol>
          </article>
        </div>
      </section>

      <QuoteAuditExperience
        strengths={strengths}
        improvements={improvements}
        takeaways={caseStudyTakeaways}
        measurementPlan={measurementPlan}
      />

      <section className="qp-outro" id="contact">
        <p>Quote+ / Case study 01</p>
        <h2>Better quotation UX<br />makes decisions easier to <ColourfulText text="trust." tone="quote" /></h2>
        <div className="qp-outro-actions">
          <Link href="/#work"><span>Back to selected work</span><i aria-hidden="true">←</i></Link>
          <Link href="/program-plus"><span>Next case study · Program+</span><i aria-hidden="true">→</i></Link>
        </div>
        <footer>
          <span>Manoj Kumar N · Senior Product Designer</span>
          <span>Enterprise UX · Decision systems · Design systems</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>
    </main>
  );
}
