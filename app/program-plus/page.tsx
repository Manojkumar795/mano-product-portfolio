import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WalkthroughJumpLink } from "../WalkthroughNav";
import ProgramCaseStudyLens from "./ProgramCaseStudyLens";
import ProgramScrollMotion from "./ProgramScrollMotion";
import ColourfulText from "../ColourfulText";

export const metadata: Metadata = {
  title: "Program+ — Enterprise Program Lifecycle UX | Manoj Kumar N",
  description:
    "A flagship enterprise UX case study for Program+, a connected program lifecycle platform spanning master timing, work queues, issue risk and phase-gate governance.",
};

const lifecycle = [
  {
    index: "01",
    title: "Set the program",
    text: "Define the team, roles and operating context.",
  },
  {
    index: "02",
    title: "Plan the timing",
    text: "Structure gates, dependencies and task ownership.",
  },
  {
    index: "03",
    title: "Focus the work",
    text: "Bring today, next week and future work into one queue.",
  },
  {
    index: "04",
    title: "Control the risk",
    text: "Track issues, probability, severity and recovery work.",
  },
  {
    index: "05",
    title: "Govern the gate",
    text: "Connect evidence, approvers and readiness decisions.",
  },
];

const systemPatterns = [
  {
    label: "Orientation",
    title: "Breadcrumbs + persistent rail",
    text: "Keeps every page connected to the program it belongs to.",
  },
  {
    label: "Mode switching",
    title: "Grid · Board · Timeline",
    text: "Teams can change the view without losing their place or their work.",
  },
  {
    label: "Operational state",
    title: "Status · progress · risk",
    text: "The same status words are used from the dashboard down to each task.",
  },
  {
    label: "Progressive work",
    title: "Inline edit · drawer · modal",
    text: "Small changes stay quick. Complex work gets a focused space.",
  },
];

const colorTokens = [
  { token: "Brand / 500", name: "Program orange", value: "#F6532C", className: "brand" },
  { token: "Ink / 900", name: "Primary text", value: "#171B24", className: "ink" },
  { token: "Surface / 0", name: "Main surface", value: "#FFFFFF", className: "surface" },
  { token: "Surface / 50", name: "Quiet surface", value: "#F4F6F8", className: "subtle" },
  { token: "Success / 500", name: "Complete", value: "#1FC45F", className: "success" },
  { token: "Warning / 500", name: "At risk", value: "#F0B700", className: "warning" },
  { token: "Critical / 500", name: "Overdue", value: "#F33D45", className: "critical" },
  { token: "Info / 500", name: "Linked data", value: "#3D80ED", className: "info" },
];

const typeScale = [
  { role: "Display", spec: "56 / 60 · 650", sample: "Program health", className: "display" },
  { role: "Page title", spec: "32 / 40 · 600", sample: "Open Issue Tracker", className: "title" },
  { role: "Body", spec: "16 / 26 · 400", sample: "Review timing, risk and gate readiness in one place.", className: "body" },
  { role: "System label", spec: "12 / 16 · 600", sample: "STATUS / IN REVIEW", className: "label" },
];

const improvements = [
  {
    index: "01",
    title: "Reduce action competition",
    text: "Keep everyday actions separate from import, export and admin controls so the next step is easy to spot.",
  },
  {
    index: "02",
    title: "Make risk explainable",
    text: "Show how probability and severity create the risk level, with a simple reason for the result.",
  },
  {
    index: "03",
    title: "Use more than color",
    text: "Pair every status color with a label or icon so the meaning is always clear.",
  },
  {
    index: "04",
    title: "Reveal permissions in context",
    text: "Show who can edit, approve, assign or share an issue before the user starts the task.",
  },
  {
    index: "05",
    title: "Make long forms easier",
    text: "Group related fields together and show extra options only when they are needed.",
  },
  {
    index: "06",
    title: "Adapt the layout for mobile",
    text: "Replace wide tables with priority summaries and focused task details on smaller screens.",
  },
];

const strengths = [
  {
    title: "One connected program model",
    text: "Timing, tasks, issues and gate evidence stay connected instead of becoming separate operational silos.",
  },
  {
    title: "Work starts with attention",
    text: "The Work Queue prioritizes what needs action now, while preserving the tracker and program context behind it.",
  },
  {
    title: "One plan, useful views",
    text: "Grid, Board and Timeline change the representation of the work without changing the underlying mental model.",
  },
  {
    title: "Governance is evidence-based",
    text: "Gate readiness connects owners, tasks, evidence and approvers so decisions can be understood and reviewed later.",
  },
  {
    title: "Risk leads to action",
    text: "Issue severity, probability, ownership and recovery work live together, so risk is something teams can act on.",
  },
  {
    title: "Roles exist before approvals",
    text: "Program setup establishes the team and ownership model early, giving later assignments and approvals a clear foundation.",
  },
];

const measurementPlan = [
  {
    index: "01",
    area: "Work queue",
    signal: "Time to next action",
    watch: "Time to find and update the next task.",
    why: "Less searching before meaningful work begins.",
  },
  {
    index: "02",
    area: "Issue control",
    signal: "Resolution + ownership",
    watch: "Issue-resolution lead time and assignment coverage.",
    why: "Issues reach the right owner with context intact.",
  },
  {
    index: "03",
    area: "Timing",
    signal: "Schedule risk",
    watch: "Overdue-task age and dependency exceptions.",
    why: "Risk becomes visible before deadlines are missed.",
  },
  {
    index: "04",
    area: "Phase gates",
    signal: "Decision readiness",
    watch: "Evidence completeness before approval review.",
    why: "Decisions begin with the required evidence available.",
  },
];

type ProductScreenProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  note?: string;
  className?: string;
  priority?: boolean;
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
}: ProductScreenProps) {
  return (
    <figure className={`pp-screen ${className}`}>
      <div className="pp-screen-bar" aria-hidden="true">
        <b>{label}</b>
      </div>
      <div className="pp-screen-media">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized
          priority={priority}
          sizes="(max-width: 800px) 94vw, (max-width: 1200px) 86vw, 1320px"
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

export default function ProgramPlusCaseStudy() {
  return (
    <main className="program-case">
      <ProgramScrollMotion />
      <header className="pp-nav">
        <Link className="pp-brand" href="/#work" aria-label="Back to selected work">
          <span>MK</span>
          <strong>Manoj Kumar N</strong>
        </Link>
        <nav aria-label="Program Plus case study navigation">
          <a href="#system">Overview</a>
          <a href="#challenge">Challenge</a>
          <a href="#approach">Approach</a>
          <a href="#solution">Solution</a>
          <a href="#impact">Impact</a>
          <WalkthroughJumpLink targetId="workflows">Product walkthrough <span aria-hidden="true">↓</span></WalkthroughJumpLink>
        </nav>
        <Link className="pp-nav-cta" href="/#contact">
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="pp-hero" id="top">
        <div className="pp-hero-grid" aria-hidden="true" />
        <div className="pp-hero-orb" aria-hidden="true" />
        <div className="pp-hero-copy">
          <div className="pp-kicker">
            <span>Program lifecycle workflow</span>
            <i>Enterprise automotive operations</i>
          </div>
          <h1>
            Program<span>+</span>
          </h1>
          <p className="pp-hero-lead">
            A connected operating system for master timing, work queues,
            issue risk and phase-gate decisions.
          </p>
          <div className="pp-hero-tags" aria-label="Case study focus areas">
            <span>Enterprise UX</span>
            <span>Product architecture</span>
            <span>Data-dense workflows</span>
            <span>Design systems</span>
          </div>
        </div>

        <div className="pp-hero-stage" aria-label="Selected Program Plus product screens">
          <ProductScreen
            className="pp-hero-main"
            src="/program-plus/work-queue.png"
            alt="Program Plus Work Queue showing time-based task tabs, KPI summaries, charts and a cross-tracker task table"
            width={1440}
            height={1179}
            label="Work Queue"
            priority
          />
          <ProductScreen
            className="pp-hero-side pp-hero-side-a"
            src="/program-plus/issue-tracker-inline.png"
            alt="Expanded Open Issue Tracker with hierarchical rows and inline editing"
            width={2048}
            height={1515}
            label="Issue Control"
            priority
          />
          <ProductScreen
            className="pp-hero-side pp-hero-side-b"
            src="/program-plus/mtt-board.png"
            alt="Master Timing Tracker board view with task cards and progress states"
            width={1440}
            height={1026}
            label="Master Timing"
            priority
          />
        </div>

        <dl className="pp-facts">
          <div>
            <dt>Role</dt>
            <dd>Lead Product Designer</dd>
          </div>
          <div>
            <dt>Product</dt>
            <dd>Program lifecycle management</dd>
          </div>
          <div>
            <dt>Core users</dt>
            <dd>Program teams · owners · approvers</dd>
          </div>
          <div>
            <dt>Scope shown</dt>
            <dd>Planning → execution → governance</dd>
          </div>
        </dl>
      </section>

      <section className="pp-context" id="system">
        <div className="pp-section-kicker">
          <p>Product framing</p>
        </div>
        <div className="pp-context-heading">
          <h2>One program.<br /><ColourfulText text="Many moving parts." tone="program" /></h2>
          <div>
            <p>
              Program work does not happen on one dashboard. Plans create
              tasks. Tasks create issues. Issues affect gates. Every gate needs
              evidence and a clear decision.
            </p>
            <p>
              Program+ connects all of these moments while giving each job the
              right view. Teams get one shared system without forcing every
              workflow into the same layout.
            </p>
          </div>
        </div>
        <div className="pp-context-rail">
          <article>
            <span>Fragmented attention</span>
            <strong>Too many places to find the next action.</strong>
            <p>Work Queue turns tracker activity into one system of attention.</p>
          </article>
          <article>
            <span>Dense planning</span>
            <strong>One plan has more than one useful view.</strong>
            <p>Grid and Board change representation without changing the work model.</p>
          </article>
          <article>
            <span>Passive risk</span>
            <strong>An issue log is not enough to control risk.</strong>
            <p>Risk, ownership, action and evidence stay connected.</p>
          </article>
          <article>
            <span>Gate ambiguity</span>
            <strong>A percentage cannot explain readiness.</strong>
            <p>Evidence and accountability sit beside the decision.</p>
          </article>
        </div>
      </section>

      <ProgramCaseStudyLens />

      <section className="pp-lifecycle">
        <div className="pp-section-kicker pp-section-kicker-light">
          <p>Experience architecture</p>
        </div>
        <div className="pp-lifecycle-head">
          <h2>From program setup<br />to a clear <ColourfulText text="gate decision." tone="program" /></h2>
          <p>
            Five connected jobs shape the experience. Information moves with
            the team, so people do not have to rebuild the same context in
            another tool.
          </p>
        </div>
        <ol className="pp-flow">
          {lifecycle.map((step) => (
            <li key={step.index}>
              <span>{step.index}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pp-workflows" id="workflows">
        <div className="pp-chapter pp-queue" id="work-queue">
          <div className="pp-chapter-copy">
            <div className="pp-section-kicker">
              <p>Work Queue</p>
            </div>
            <h2>Start with the work,<br /><ColourfulText text="not the module." tone="program" /></h2>
            <p>
              The Work Queue brings tasks from across the platform into one
              place. People can focus on today, this week, next week or future
              work without opening every tracker to find the next action.
            </p>
            <ul>
              <li><b>Time first</b><span>Organize attention by urgency.</span></li>
              <li><b>Cross-tracker</b><span>See related work without navigating away.</span></li>
              <li><b>Summary to detail</b><span>Move from KPI signal to task row.</span></li>
            </ul>
          </div>
          <ProductScreen
            className="pp-queue-screen"
            src="/program-plus/work-queue.png"
            alt="Work Queue with Today, This Week, Next Week and Future tabs; task metrics; charts; and a detailed table"
            width={1440}
            height={1179}
            label="Cross-tracker Work Queue"
            note="A task-first command view across the program lifecycle."
          />
        </div>

        <div className="pp-chapter pp-timing" id="master-timing">
          <div className="pp-timing-head">
            <div className="pp-heading-stack">
              <div className="pp-section-kicker pp-section-kicker-light">
                <p>Master Timing Tracker</p>
              </div>
              <h2>One plan.<br />More than one <ColourfulText text="useful view." tone="program" /></h2>
            </div>
            <p>
              Grid and Board are two views of the same plan. Grid helps teams
              manage structure and dependencies. Board makes status easier to
              scan.
            </p>
          </div>
          <div className="pp-timing-composition">
            <ProductScreen
              className="pp-timing-main"
              src="/program-plus/mtt-add-task.png"
              alt="Master Timing Tracker grid with hierarchical work breakdown and an Add New Task drawer"
              width={1574}
              height={1024}
              label="Grid + Add task"
              note="A focused drawer preserves plan context while creating detailed work."
            />
            <ProductScreen
              className="pp-timing-board"
              src="/program-plus/mtt-board.png"
              alt="Master Timing Tracker board showing task cards, progress, gate, due date and assignee"
              width={1440}
              height={1026}
              label="Board view"
              note="The same task model becomes a fast visual scan."
            />
            <div className="pp-timing-principle">
              <span>Design principle</span>
              <strong>Change the representation.<br />Preserve the mental model.</strong>
            </div>
          </div>
        </div>

        <div className="pp-chapter pp-issues" id="open-issues">
          <div className="pp-issues-head">
            <div className="pp-heading-stack">
              <div className="pp-section-kicker">
                <p>Open Issue Tracker</p>
              </div>
              <h2>Risk is a workflow,<br /><ColourfulText text="not a red badge." tone="program" /></h2>
            </div>
            <p>
              The tracker moves from the overall risk picture to themes, parent
              issues and child actions. Quick edits happen inside the table.
              More important changes open a complete form with ownership,
              evidence and customer visibility.
            </p>
          </div>
          <div className="pp-issue-compare">
            <ProductScreen
              src="/program-plus/issue-tracker.png"
              alt="Collapsed Open Issue Tracker showing owner, editors, issue count, risk score, completion and theme summaries"
              width={2048}
              height={1456}
              label="Signal view"
              note="Scan ownership, risk, completion and themes before opening detail."
            />
            <ProductScreen
              src="/program-plus/issue-tracker-inline.png"
              alt="Expanded Open Issue Tracker showing hierarchical issues and an inline editing row"
              width={2048}
              height={1515}
              label="Action view"
              note="Expand a theme and update the issue in place."
            />
          </div>
          <div className="pp-risk-model">
            <div className="pp-risk-copy">
              <span>Risk model</span>
              <h3>Probability × severity.<br />Calculated, not guessed.</h3>
              <p>
                The creation flow brings the inputs, result and supporting work
                into one decision surface: status, assignee, due date, customer
                visibility, attachments, lessons learned and related tasks.
              </p>
              <div className="pp-equation" aria-label="Probability multiplied by severity creates a risk category">
                <span><small>Probability</small><b>Weighted</b></span>
                <i>×</i>
                <span><small>Severity</small><b>0–9</b></span>
                <i>=</i>
                <span className="pp-equation-result"><small>Category</small><b>Auto</b></span>
              </div>
            </div>
            <ProductScreen
              className="pp-risk-screen"
              src="/program-plus/add-issue.png"
              alt="Add New Issue dialog with probability and severity controls, auto-calculated risk category and supporting tabs"
              width={1330}
              height={922}
              label="Create issue"
              note="Complex inputs are grouped into a single governed issue record."
            />
          </div>
        </div>

        <div className="pp-chapter pp-gates" id="phase-gates">
          <div className="pp-gates-head">
            <div className="pp-heading-stack">
              <div className="pp-section-kicker pp-section-kicker-light">
                <p>Phase-gate governance</p>
              </div>
              <h2>Make readiness<br /><ColourfulText text="auditable." tone="program" /></h2>
            </div>
            <p>
              A gate decision needs more than a percentage. The screen brings
              owners, related tasks, evidence, comments and approvers together
              so the team can understand why a gate is ready—or why it is not.
            </p>
          </div>
          <ProductScreen
            className="pp-gate-screen"
            src="/program-plus/phase-gate.png"
            alt="Phase Gate 2A review with program metadata, overdue status and evidence-based element cards"
            width={2048}
            height={1456}
            label="Phase Gate 2A"
            note="Readiness is presented as evidence and accountability, not decoration."
          />
          <div className="pp-team-composition" id="program-team">
            <div className="pp-team-copy">
              <span>The governance foundation</span>
              <h3>Roles begin before the work does.</h3>
              <p>
                The team is defined during program setup. Later assignments and
                approvals can then use the same roles and ownership rules.
              </p>
            </div>
            <ProductScreen
              src="/program-plus/program-team.png"
              alt="Program creation wizard at Team Definition showing master program roles and assigned program users"
              width={2048}
              height={1456}
              label="Program team definition"
              note="Team structure is part of product architecture, not an afterthought."
            />
          </div>
        </div>
      </section>

      <section className="pp-system-language" id="design-system">
        <div className="pp-section-kicker">
          <p>Program+ design system</p>
        </div>
        <div className="pp-system-head">
          <h2>One design language<br />across every <ColourfulText text="module." tone="program" /></h2>
          <p>
            Program+ handles different kinds of work, but it should always feel
            like one product. Shared colors, type, spacing and component states
            make every screen easier to learn and maintain.
          </p>
        </div>
        <div className="pp-pattern-grid">
          {systemPatterns.map((pattern) => (
            <article key={pattern.label}>
              <span>{pattern.label}</span>
              <strong>{pattern.title}</strong>
              <p>{pattern.text}</p>
            </article>
          ))}
        </div>

        <div className="pp-ds-foundations">
          <article className="pp-ds-panel pp-color-system">
            <div className="pp-ds-panel-head pp-ds-panel-head-clean">
              <div>
                <h3>Color has a job.</h3>
              </div>
              <p>Orange signals action. Semantic colors communicate state. Neutral surfaces keep dense work calm.</p>
            </div>
            <div className="pp-color-spectrum" aria-hidden="true">
              {colorTokens.map((color) => (
                <i className={`pp-color-${color.className}`} key={color.token} />
              ))}
            </div>
            <div className="pp-color-grid">
              {colorTokens.map((color) => (
                <div className="pp-color-token" key={color.token}>
                  <i className={`pp-color-sample pp-color-${color.className}`} />
                  <span>{color.token}</span>
                  <strong>{color.name}</strong>
                  <small>{color.value}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="pp-ds-panel pp-type-system">
            <div className="pp-ds-panel-head pp-ds-panel-head-clean">
              <div>
                <h3>Hierarchy you can scan.</h3>
              </div>
              <p>Interface type stays familiar. Mono appears only where system data needs a different voice.</p>
            </div>
            <div className="pp-type-families" aria-label="Typeface roles">
              <div><strong>Geist Sans</strong><span>Interface + content</span></div>
              <div><strong>Geist Mono</strong><span>IDs + system data</span></div>
            </div>
            <div className="pp-type-list">
              {typeScale.map((type) => (
                <div className={`pp-type-row pp-type-${type.className}`} key={type.role}>
                  <div>
                    <span>{type.role}</span>
                    <small>{type.spec}</small>
                  </div>
                  <p>{type.sample}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="pp-system-practice">
          <div className="pp-system-practice-head">
            <span>System in practice</span>
            <h3>From a shared rule to real product behaviour.</h3>
          </div>

          <article className="pp-practice-row">
            <header>
              <span>01</span>
              <strong>Status / risk</strong>
              <p>One semantic rule travels from token to component to program-level visibility.</p>
            </header>
            <div className="pp-practice-flow">
              <div className="pp-practice-stage pp-practice-foundation">
                <small>Foundation</small>
                <div className="pp-practice-semantic" aria-hidden="true">
                  <i className="complete" />
                  <i className="risk" />
                  <i className="overdue" />
                </div>
                <b>Semantic status</b>
              </div>
              <div className="pp-practice-stage">
                <small>Component</small>
                <span className="pp-practice-risk-chip">! At risk</span>
                <b>Status chip</b>
              </div>
              <div className="pp-practice-stage">
                <small>Pattern</small>
                <div className="pp-practice-issue-row">
                  <i aria-hidden="true" />
                  <span>Supplier timing</span>
                  <b>At risk</b>
                </div>
                <b>Issue row</b>
              </div>
              <div className="pp-practice-stage pp-practice-product">
                <small>Product</small>
                <div className="pp-practice-product-ui">
                  <span>Program health</span>
                  <strong>At-risk issues</strong>
                  <i>Open Issue Tracker</i>
                </div>
              </div>
            </div>
          </article>

          <article className="pp-practice-row">
            <header>
              <span>02</span>
              <strong>Action / workflow</strong>
              <p>Action priority stays consistent from a single control to an operational workflow.</p>
            </header>
            <div className="pp-practice-flow">
              <div className="pp-practice-stage pp-practice-foundation">
                <small>Foundation</small>
                <div className="pp-practice-hierarchy" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <b>Action hierarchy</b>
              </div>
              <div className="pp-practice-stage">
                <small>Component</small>
                <div className="pp-practice-actions" aria-label="Button states">
                  <i>Update</i>
                  <i>Cancel</i>
                  <i>Disabled</i>
                </div>
                <b>Button state</b>
              </div>
              <div className="pp-practice-stage">
                <small>Pattern</small>
                <div className="pp-practice-task-row">
                  <span>Review issue</span>
                  <b>Update</b>
                </div>
                <b>Task action</b>
              </div>
              <div className="pp-practice-stage pp-practice-product">
                <small>Product</small>
                <div className="pp-practice-product-ui pp-practice-queue-ui">
                  <span>Work Queue</span>
                  <strong>Next action visible</strong>
                  <i>Today · This week · Future</i>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="pp-ds-application">
          <article className="pp-ds-rhythm">
            <div className="pp-ds-editorial-head">
              <h3>Built on an 8-point rhythm.</h3>
              <p>Spacing isn&apos;t decoration. It creates predictable density across complex screens.</p>
            </div>

            <div className="pp-spacing-composition">
              <div className="pp-spacing-demo" aria-label="Program task composed with the 8-point spacing system">
                <span>Open issues</span>
                <article>
                  <header>
                    <div><i aria-hidden="true" /><span>Issue</span></div>
                    <b>At risk</b>
                  </header>
                  <strong>Confirm supplier timing</strong>
                  <p>Owner · Due date · Dependency</p>
                  <footer>
                    <span>View details</span>
                    <b>Update</b>
                  </footer>
                </article>
              </div>
              <ul className="pp-spacing-key" aria-label="Spacing decisions">
                <li><b>8px</b><span>Icon + label</span></li>
                <li><b>16px</b><span>Internal padding</span></li>
                <li><b>24px</b><span>Card content</span></li>
                <li><b>32px</b><span>Section grouping</span></li>
              </ul>
            </div>
          </article>

          <article className="pp-ds-states">
            <div className="pp-ds-editorial-head pp-ds-states-head">
              <h3>States that explain themselves.</h3>
              <p>The same interaction rules carry from one workflow to the next.</p>
            </div>

            <div className="pp-state-specimen">
              <div className="pp-state-specimen-top">
                <div className="pp-button-states">
                  <i className="primary">Save changes</i>
                  <i className="secondary">Cancel</i>
                  <i className="disabled">Disabled</i>
                </div>
                <div className="pp-status-states">
                  <i className="complete">✓ Complete</i>
                  <i className="risk">! At risk</i>
                  <i className="overdue">× Overdue</i>
                  <i className="linked">↗ Linked</i>
                </div>
              </div>

              <div className="pp-state-specimen-bottom">
                <div className="pp-field-demo">
                  <label>
                    <small>Assignee</small>
                    <b>Select a team member</b>
                    <i className="pp-field-chevron" aria-hidden="true" />
                  </label>
                </div>
                <p className="pp-state-rule">
                  <b>Color never carries state alone.</b>
                  Text and icons reinforce meaning for faster, safer scanning.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="pp-reflection" id="reflection">
        <div className="pp-section-kicker pp-section-kicker-light">
          <p>Design reflection</p>
        </div>
        <div className="pp-reflection-head">
          <h2>What works.<br />What I would <ColourfulText text="improve." tone="program" /></h2>
          <p>
            Program+ already has a strong connected operating model. The next
            level is reducing interaction cost while making risk and governance
            even easier to understand.
          </p>
        </div>
        <div className="pp-reflection-decks">
          <section className="pp-reflection-deck">
            <header>
              <h3>What works today</h3>
              <p>The product model already creates useful continuity across planning, execution and governance.</p>
            </header>
            <div className="pp-strength-grid">
              {strengths.map((item) => (
                <article key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="pp-reflection-deck">
            <header>
              <h3>What I would improve next</h3>
              <p>These are the highest-value changes I would validate in the next design cycle.</p>
            </header>
            <div className="pp-improvement-grid">
              {improvements.map((item) => (
                <article key={item.index}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <div className="pp-measurement">
          <div>
            <span>Measurement plan</span>
            <h3>Measure whether the design is helping.</h3>
            <p>
              I would track these moments next to understand whether Program+
              is making everyday work faster, clearer and easier to coordinate.
            </p>
          </div>
          <div className="pp-measurement-signals">
            {measurementPlan.map((measure) => (
              <article className="pp-measurement-signal" key={measure.area}>
                <span>{measure.index}</span>
                <div>
                  <small>{measure.area}</small>
                  <strong>{measure.signal}</strong>
                  <p>{measure.watch}</p>
                </div>
                <aside>
                  <small>Why it matters</small>
                  <p>{measure.why}</p>
                </aside>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-outro" id="contact">
        <p>Program+ / Case study</p>
        <h2>
          Complex programs<br />need a clear <ColourfulText text="operating system." tone="program" />
        </h2>
        <div className="pp-outro-actions">
          <Link href="/#work">
            <span>Back to selected work</span>
            <i aria-hidden="true">←</i>
          </Link>
          <Link href="/#contact">
            <span>Discuss a product challenge</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
        <footer>
          <span>Manoj Kumar N · Senior Product Designer</span>
          <span>Enterprise UX · Product architecture · Design systems</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>
    </main>
  );
}
