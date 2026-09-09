import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ColourfulText from "../ColourfulText";
import EvolutionExplorer from "./EvolutionExplorer";
import ProfitScrollMotion from "./ProfitScrollMotion";
import styles from "./ProfitPlus.module.css";

export const metadata: Metadata = {
  title: "Profit+ — Configuration Studio Design Evolution | Manoj Kumar N",
  description:
    "A level-by-level enterprise UX case study showing how Profit+ Configuration Studio evolved from field management into a system-aware authoring workspace.",
};

const competitors = [
  "Monday.com",
  "Intuit",
  "Planisware",
  "Linear",
  "Databox",
  "Jira Align",
  "Coda",
  "Fiber",
  "Stripe",
];

const researchSignals = [
  {
    title: "Keep hierarchy available",
    text: "Enterprise configuration needs a stable answer to: where am I, what am I changing and where will it be used?",
    sources: "Planisware · Jira Align · Monday.com",
  },
  {
    title: "Guide complex creation",
    text: "Group dependent settings and reveal advanced decisions only when the user reaches them.",
    sources: "Intuit · Coda · Fiber",
  },
  {
    title: "Protect interaction speed",
    text: "Frequent actions should remain compact and predictable even when the underlying model is complex.",
    sources: "Linear · Stripe",
  },
  {
    title: "Make the result inspectable",
    text: "Configuration becomes safer when users can preview the result and understand its downstream use before publishing.",
    sources: "Databox · Stripe · Monday.com",
  },
];

const comparisonRows = [
  {
    dimension: "Orientation",
    one: "Module only",
    oneOne: "Modal step",
    two: "Section + list",
    three: "System-wide",
    final: "System + task",
  },
  {
    dimension: "Relationships",
    one: "Hidden",
    oneOne: "Assigned at end",
    two: "Partially visible",
    three: "Persistent tree",
    final: "Visible when useful",
  },
  {
    dimension: "Task continuity",
    one: "List → action",
    oneOne: "Context break",
    two: "Continuous editor",
    three: "Continuous but dense",
    final: "Continuous + focused",
  },
  {
    dimension: "Progressive disclosure",
    one: "Low",
    oneOne: "Strong in form",
    two: "Accordion groups",
    three: "Mixed",
    final: "Contextual panels",
  },
  {
    dimension: "Preview confidence",
    one: "None",
    oneOne: "None",
    two: "Layout sketch",
    three: "Preview action",
    final: "In-workspace preview",
  },
  {
    dimension: "Attention control",
    one: "Status-heavy",
    oneOne: "Focused modal",
    two: "Calmer",
    three: "Competing zones",
    final: "Semantic colour",
  },
];

function Screen({
  src,
  alt,
  width,
  height,
  label,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  className?: string;
}) {
  return (
    <figure className={`${styles.screen} ${className}`}>
      <div className={styles.screenBar}><span>{label}</span><i /><i /><i /></div>
      <div className={styles.screenMedia}>
        <Image src={src} alt={alt} width={width} height={height} unoptimized sizes="(max-width: 900px) 94vw, 1320px" />
      </div>
    </figure>
  );
}

export default function ProfitPlusCaseStudy() {
  return (
    <main className={`${styles.page} profit-case`}>
      <ProfitScrollMotion />
      <header className={styles.nav}>
        <Link className={styles.brand} href="/#work" aria-label="Back to selected work">
          <span>MK</span><strong>Manoj Kumar N</strong>
        </Link>
        <nav aria-label="Profit Plus case study navigation">
          <a href="#research">Research</a>
          <a href="#evolution">Evolution</a>
          <a href="#final">Final variations</a>
          <a href="#comparison">Comparison</a>
        </nav>
        <Link className={styles.navCta} href="/#contact">Let&apos;s talk <span aria-hidden="true">↗</span></Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-profit-reveal>Profit+ · Enterprise configuration</p>
            <h1 data-profit-reveal>A settings page became a <ColourfulText text="system-aware studio." tone="quote" /></h1>
            <p className={styles.heroLead} data-profit-reveal>
              A level-by-level design evolution showing how I moved from simple
              field management to a scalable workspace for fields, sections,
              pages, levels, flows and rules.
            </p>
          </div>

          <div className={styles.heroVisual} data-profit-reveal>
            <Screen
              src="/profit-plus/evolution/final-reduced-colour.png"
              alt="Selected Profit Plus Configuration Studio design"
              width={1470}
              height={766}
              label="Selected direction · reduced-colour system"
            />
          </div>
        </div>
      </section>

      <section className={styles.problem}>
        <div className={styles.sectionIntro} data-profit-reveal>
          <p className={styles.eyebrow}>The real design problem</p>
          <h2>Not “how do we style a form?”<br />How do we expose a <ColourfulText text="nested system" tone="quote" /> without overwhelming its administrator?</h2>
        </div>
        <div className={styles.problemThesis} data-profit-reveal>
          <h3>
            A field never exists alone. <span>It belongs to a section, appears on a page,
            sits within a level and can change the rules of a workflow.</span>
          </h3>
          <div className={styles.problemSupport}>
            <p>
              Every object could be created alone, but the user&apos;s real task was relational:
              define it, place it, understand where it is reused, preview the result and publish safely.
            </p>
            <div className={styles.problemTarget}>
              <span>Iteration target</span>
              <p><strong>Configuration confidence</strong>, not visual novelty.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.research} id="research">
        <div className={styles.researchHeader}>
          <div className={styles.sectionIntro} data-profit-reveal>
            <p className={styles.eyebrow}>Competitor synthesis</p>
            <h2>Research shaped the architecture—<ColourfulText text="not the visual style." tone="quote" /></h2>
          </div>
          <div className={styles.researchContext} data-profit-reveal>
            <p>
              I compared how established products handle hierarchy, flexible object creation,
              dense administration, preview and publish confidence. I extracted decision
              principles rather than copying an interface.
            </p>
            <div className={styles.researchSet}>
              <span>Products reviewed</span>
              <p aria-label="Products included in competitor research">{competitors.join(" · ")}</p>
            </div>
          </div>
        </div>

        <div className={styles.signalGrid}>
          {researchSignals.map((signal) => (
            <article key={signal.title} data-profit-reveal>
              <h3>{signal.title}</h3>
              <p>{signal.text}</p>
              <small>Observed in {signal.sources}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.evolution} id="evolution">
        <div className={`${styles.sectionIntro} ${styles.evolutionIntro}`} data-profit-reveal>
          <p className={styles.eyebrow}>The evolution</p>
          <h2>Each level solved one risk—<ColourfulText text="and exposed the next." tone="quote" /></h2>
          <p>This is intentionally not a before/after gallery. Every stage records a design decision, the reason for it and the limitation that forced the next iteration.</p>
        </div>

        <article className={styles.stage} data-profit-reveal>
          <div className={styles.stageHead}>
            <div><span>Level 1.0 · Baseline</span><h3>Start with a familiar inventory</h3></div>
            <p>A conventional fields table reduced the learning curve for administrators already comfortable with CRUD systems.</p>
          </div>
          <Screen
            src="/profit-plus/evolution/level-1-field-management.png"
            alt="Level 1 Profit Plus field management table with view settings"
            width={1470}
            height={766}
            label="Level 1.0 · field inventory"
          />
          <div className={styles.decisionGrid}>
            <div><span>Why this worked</span><p>Sections grouped the rows, status remained scannable, and the right-side view settings let administrators control table density.</p></div>
            <div><span>What it exposed</span><p>The table described fields but hid how fields connected to sections, pages and levels. Creation, visibility and structure felt like separate tasks.</p></div>
            <div><span>Next hypothesis</span><p>Keep the familiar inventory, but make field creation progressive and explicit.</p></div>
          </div>
        </article>

        <article className={`${styles.stage} ${styles.darkStage}`} data-profit-reveal>
          <div className={styles.stageHead}>
            <div><span>Level 1.1 · Guided creation</span><h3>Guide creation without showing everything at once</h3></div>
            <p>The create-field flow grouped general information, data source, validation and advanced settings into a progressive modal.</p>
          </div>
          <Screen
            src="/profit-plus/evolution/level-1-1-create-field.png"
            alt="Level 1.1 Profit Plus create field modal with progressive property groups"
            width={1129}
            height={766}
            label="Level 1.1 · guided field creation"
            className={styles.modalScreen}
          />
          <div className={styles.decisionGrid}>
            <div><span>Why this changed</span><p>Separating dependent settings lowered the initial form load and created a clear sequence for complex field properties.</p></div>
            <div><span>What it exposed</span><p>The modal removed the section from view. Users configured a field first and only reconnected it to the system through “Assign to Section”.</p></div>
            <div><span>Next hypothesis</span><p>Move configuration into a persistent workspace where inventory and editing remain visible together.</p></div>
          </div>
        </article>

        <article className={styles.stage} data-profit-reveal>
          <div className={styles.stageHead}>
            <div><span>Level 2.0 · Integrated studio</span><h3>Turn administration into a task studio</h3></div>
            <p>A three-part layout kept section selection, focused editing and inspection within one continuous task.</p>
          </div>
          <Screen
            src="/profit-plus/evolution/level-2-section-studio.png"
            alt="Level 2 Profit Plus Section Studio with section list, editor and inspector"
            width={1648}
            height={767}
            label="Level 2.0 · section studio"
          />
          <div className={styles.decisionGrid}>
            <div><span>Meaningful gain</span><p>The user could switch sections without leaving the editor. Basic settings, fields and a layout preview now belonged to the same task.</p></div>
            <div><span>What remained weak</span><p>The studio clarified one section, but relationships across workflow, level and page were still absent. The inspector repeated some editor information.</p></div>
            <div><span>Next hypothesis</span><p>Expose the configuration model itself so administrators can understand reuse and downstream impact.</p></div>
          </div>
        </article>

        <article className={`${styles.stage} ${styles.systemStage}`} data-profit-reveal>
          <div className={styles.stageHead}>
            <div><span>Level 3.0 · System model</span><h3>Make the system model visible</h3></div>
            <p>Global object navigation, product context, section inventory, layout composition and the workflow tree became one configuration system.</p>
          </div>
          <Screen
            src="/profit-plus/evolution/level-3-configuration-system.png"
            alt="Level 3 Profit Plus Configuration Studio showing product navigation, section layout and workflow structure"
            width={2048}
            height={1597}
            label="Level 3.0 · system-aware configuration"
            className={styles.tallScreen}
          />
          <div className={styles.decisionGrid}>
            <div><span>Meaningful gain</span><p>Users could see where a section lived, which fields it contained and how it related to a workflow without leaving the authoring surface.</p></div>
            <div><span>What became too heavy</span><p>Four simultaneous navigation planes competed for attention. The dark product rail, green selection states, field cards and persistent tree created visual pressure.</p></div>
            <div><span>Final hypothesis</span><p>Preserve the system model, but reduce colour, repetition and permanent hierarchy to protect the authoring task.</p></div>
          </div>
        </article>
      </section>

      <section className={styles.finalSection} id="final">
        <div className={styles.sectionIntro} data-profit-reveal>
          <p className={styles.eyebrow}>Final-stage variations</p>
          <h2>Same architecture.<br /><ColourfulText text="Three different attention models." tone="quote" /></h2>
          <p>The final explorations did not restart the design. They tested how much hierarchy, colour and inspector detail should remain visible during everyday authoring.</p>
        </div>
        <EvolutionExplorer />
      </section>

      <section className={styles.comparison} id="comparison">
        <div className={styles.sectionIntro} data-profit-reveal>
          <p className={styles.eyebrow}>Deep comparison</p>
          <h2>The difference between levels is <ColourfulText text="structural, not cosmetic." tone="quote" /></h2>
        </div>
        <div className={styles.comparisonTable} role="table" aria-label="Profit Plus design evolution comparison" data-profit-reveal>
          <div className={`${styles.tableRow} ${styles.tableHead}`} role="row">
            <span role="columnheader">Decision dimension</span>
            <span role="columnheader">L1.0</span>
            <span role="columnheader">L1.1</span>
            <span role="columnheader">L2.0</span>
            <span role="columnheader">L3.0</span>
            <span role="columnheader">Final</span>
          </div>
          {comparisonRows.map((row) => (
            <div className={styles.tableRow} role="row" key={row.dimension}>
              <strong role="rowheader">{row.dimension}</strong>
              <span role="cell">{row.one}</span>
              <span role="cell">{row.oneOne}</span>
              <span role="cell">{row.two}</span>
              <span role="cell">{row.three}</span>
              <span role="cell" className={styles.finalCell}>{row.final}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.validation}>
        <div data-profit-reveal>
          <p className={styles.eyebrow}>Validation plan</p>
          <h2>No invented impact numbers.</h2>
          <p>The selected direction should earn its place through task evidence.</p>
        </div>
        <div className={styles.validationGrid}>
          <article data-profit-reveal><h3>Findability</h3><p>Can an administrator locate the correct section and understand its workflow context without opening another screen?</p></article>
          <article data-profit-reveal><h3>Configuration accuracy</h3><p>Track wrong-column choices, missed required settings and accidental placement in the wrong page or level.</p></article>
          <article data-profit-reveal><h3>Context switching</h3><p>Measure how often users leave the editor to check structure, dependencies or preview.</p></article>
          <article data-profit-reveal><h3>Publish confidence</h3><p>Observe preview use, correction loops and hesitation before publishing a configuration change.</p></article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div><span>Profit+</span><p>Configuration Studio · design evolution</p></div>
        <Link href="/#work">Back to selected work <span aria-hidden="true">↗</span></Link>
      </footer>
    </main>
  );
}
