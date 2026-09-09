"use client";

/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./DeliveryStory.module.css";

const workflow = [
  ["design", "Product Design"],
  ["design-system", "Design System"],
  ["components", "Components"],
  ["mcp", "MCP"],
  ["code", "Code"],
  ["validation", "Validation"],
] as const;

type ButtonState = "default" | "hover" | "pressed" | "focus" | "disabled" | "loading";
type ButtonSize = "small" | "medium" | "large";
type CodeFocus = "variant" | "token" | "state" | "accessibility";

function useViewportState<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "-8% 0px -12% 0px", threshold: 0.16 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, seen, active };
}

function Stage({ children, id }: { children: ReactNode; id: string }) {
  const { ref, seen, active } = useViewportState<HTMLElement>();
  return (
    <section
      className={`${styles.stage} ${seen ? styles.stageSeen : ""} ${active ? styles.stageActive : ""}`}
      id={id}
      ref={ref}
    >
      <div className={styles.sectionInner}>{children}</div>
    </section>
  );
}

function StageIntro({ number, label, title, description }: { number: string; label: string; title: string; description: string }) {
  return (
    <header className={styles.stageIntro}>
      <p className={styles.stageLabel}><span>{number}</span>{label}</p>
      <div className={styles.stageCopy}><h2>{title}</h2><p>{description}</p></div>
    </header>
  );
}

function WorkbenchFrame({ title, detail, children, className = "" }: { title: string; detail?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.workbench} ${className}`}>
      <header className={styles.workbenchBar}><span>{title}</span>{detail ? <small>{detail}</small> : null}</header>
      <div className={styles.workbenchBody}>{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.heroKicker}>Modern Product Delivery</p>
        <h1>From Figma to production—<span>without losing the details.</span></h1>
        <div className={styles.heroSummary}>
          <p>A practical view of how I move an enterprise interface through product design, shared foundations, component behaviour, implementation and final validation.</p>
          <dl>
            <div><dt>Focus</dt><dd>System-led delivery</dd></div>
            <div><dt>Tools</dt><dd>Figma · MCP · React</dd></div>
          </dl>
        </div>
        <nav className={styles.workflowRail} aria-label="Modern product delivery workflow">
          {workflow.map(([id, label], index) => <a href={`#${id}`} key={id}><i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span></a>)}
        </nav>
      </div>
    </section>
  );
}

function ProductDesign() {
  const decisions = [
    ["01", "Workflow hierarchy", "Organised the workspace around the order in which people complete the task."],
    ["02", "Action priority", "Separated the main action from navigation and supporting controls."],
    ["03", "State clarity", "Planned loading, empty, error and completed behaviour before handoff."],
  ];
  return (
    <Stage id="design">
      <StageIntro description="I first worked through the task flow, information hierarchy and product states. The system followed the experience—not the other way around." label="Product Design" number="01" title="I started with the workflow, not the component library." />
      <WorkbenchFrame title="Figma · Task Automate exploration">
        <div className={styles.designWorkspace}>
          <div className={styles.designCanvas}>
            <img alt="Task Automate product workflow explored in Figma" src="/modern-product-delivery/task-automate.png" />
            <span className={`${styles.decisionMarker} ${styles.markerOne}`}>1</span>
            <span className={`${styles.decisionMarker} ${styles.markerTwo}`}>2</span>
            <span className={`${styles.decisionMarker} ${styles.markerThree}`}>3</span>
            <span className={styles.designSelection} aria-hidden="true"><i /><i /><i /><i /></span>
            <i className={styles.designCursor} aria-hidden="true"><b />Manoj</i>
            <div className={styles.drawingTimeline} aria-hidden="true"><i /></div>
          </div>
          <aside className={styles.decisionRail} aria-label="Product design decisions">
            {decisions.map(([number, title, description]) => <article key={title}><b>{number}</b><div><h3>{title}</h3><p>{description}</p></div></article>)}
          </aside>
        </div>
      </WorkbenchFrame>
    </Stage>
  );
}

const colours = [
  ["Canvas", "#0B0D12", "surface.canvas"], ["Panel", "#121720", "surface.panel"],
  ["Border", "#28303D", "border.subtle"], ["Text", "#F5F7FA", "text.primary"],
  ["Action", "#34649E", "action.primary"], ["Success", "#2E8B65", "state.success"],
] as const;

const typography = [
  ["Display", "56 / 64", "650"], ["Heading", "32 / 40", "600"],
  ["Body", "16 / 24", "400"], ["Label", "14 / 20", "550"],
] as const;

function DesignSystem() {
  return (
    <Stage id="design-system">
      <StageIntro description="Once decisions started repeating, I documented them as shared foundations that design and development could reference together." label="Design System" number="02" title="Repeated decisions became a system." />
      <WorkbenchFrame detail="8px base grid" title="Product foundations">
        <div className={styles.foundationBoard}>
          <section className={styles.colourPanel}>
            <div className={styles.panelHeading}><h3>Semantic colour</h3><p>Values named by purpose, not appearance.</p></div>
            <div className={styles.colourGrid}>
              {colours.map(([label, value, token]) => <article key={token}><i style={{ background: value }} /><span><b>{label}</b><code>{token}</code></span><small>{value}</small></article>)}
            </div>
          </section>
          <section className={styles.typePanel}>
            <div className={styles.panelHeading}><h3>Typography</h3><p>One family with a clear job at every level.</p></div>
            <div className={styles.typeRows}>
              {typography.map(([name, scale, weight]) => <article data-type={name.toLowerCase()} key={name}><b>{name}</b><span>{scale}</span><small>Weight {weight}</small></article>)}
            </div>
          </section>
          <section className={styles.foundationStrip}>
            <article><div className={styles.stripHeading}><b>Spacing</b><span>4px sub-step · 8px rhythm</span></div><div className={styles.spacingSamples}>{[4, 8, 16, 24, 32].map((value) => <i key={value} style={{ width: value, height: value }}><span>{value}</span></i>)}</div></article>
            <article><div className={styles.stripHeading}><b>Radius</b><span>Clear hierarchy, restrained shape</span></div><div className={styles.radiusSamples}>{[4, 8, 12].map((value) => <i key={value} style={{ borderRadius: value }}><span>{value}px</span></i>)}</div></article>
            <article><div className={styles.stripHeading}><b>Elevation</b><span>Used only to separate layers</span></div><div className={styles.shadowSamples}><i /><i /><span>01 / 02</span></div></article>
            <article><div className={styles.stripHeading}><b>Icons</b><span>16 · 20 · 24 optical sizes</span></div><div className={styles.iconSamples}><i>＋</i><i>⌕</i><i>↗</i></div></article>
          </section>
        </div>
      </WorkbenchFrame>
    </Stage>
  );
}

function ButtonVisual({ state, size, leadingIcon }: { state: ButtonState; size: ButtonSize; leadingIcon: boolean }) {
  const stateClass = styles[`button${state[0].toUpperCase()}${state.slice(1)}`];
  const sizeClass = styles[`size${size[0].toUpperCase()}${size.slice(1)}`];
  return <span className={`${styles.buttonVisual} ${stateClass} ${sizeClass}`}>{state === "loading" ? <i className={styles.spinner} /> : leadingIcon ? <i>＋</i> : null}{state === "loading" ? "Creating…" : "Create item"}</span>;
}

function Components() {
  const [state, setState] = useState<ButtonState>("default");
  const size: ButtonSize = "medium";
  const [leadingIcon, setLeadingIcon] = useState(true);
  const states: ButtonState[] = ["default", "hover", "pressed", "focus", "disabled", "loading"];
  return (
    <Stage id="components">
      <StageIntro description="A component was not complete when it looked right once. I defined how it behaved across interaction, loading and accessibility states." label="Components" number="03" title="Components were designed for behaviour, not only appearance." />
      <WorkbenchFrame detail="Interactive state model" title="Button / Primary">
        <div className={styles.componentWorkbench}>
          <section className={styles.stateMatrix} aria-label="Button component states">
            {states.map((item) => <button aria-pressed={state === item} className={styles.stateTile} key={item} onClick={() => setState(item)} type="button"><small>{item}</small><ButtonVisual leadingIcon={leadingIcon} size={size} state={item} /></button>)}
          </section>
          <aside className={styles.propertyPanel}>
            <div className={styles.liveInstance}><small>Selected instance</small><ButtonVisual leadingIcon={leadingIcon} size={size} state={state} /><span>{state} · {size}</span></div>
            <label className={styles.iconToggle}><span><b>Leading icon</b><small>Optional property</small></span><input checked={leadingIcon} onChange={(event) => setLeadingIcon(event.target.checked)} type="checkbox" /></label>
            <dl className={styles.componentSpecs}><div><dt>Layout</dt><dd>Auto layout</dd></div><div><dt>Gap</dt><dd>8px</dd></div><div><dt>Padding</dt><dd>12px / 16px</dd></div><div><dt>Token</dt><dd>action.primary</dd></div></dl>
          </aside>
        </div>
      </WorkbenchFrame>
    </Stage>
  );
}

function MCP() {
  return (
    <Stage id="mcp">
      <StageIntro description="Instead of handing over another screenshot, I made the selected component’s properties, tokens and layout context available inside the development environment." label="MCP" number="04" title="I connected Figma directly to the development environment." />
      <WorkbenchFrame detail="Selected component → usable context" title="Design-to-code bridge">
        <div className={styles.mcpWorkbench}>
          <div className={styles.mcpTrack} aria-hidden="true"><span>1 · Select</span><span>2 · Read context</span><span>3 · Implement</span><i /></div>
          <div className={styles.mcpCards}>
            <article><header><b>Figma</b><span>Selected instance</span></header><div className={styles.figmaInstance}><small>Button / Primary / Medium</small><ButtonVisual leadingIcon size="medium" state="default" /></div><dl><div><dt>Layout</dt><dd>Horizontal</dd></div><div><dt>Width</dt><dd>Hug contents</dd></div><div><dt>Gap</dt><dd>8px</dd></div></dl></article>
            <article><header><b>MCP context</b><span>Structured data</span></header><dl className={styles.contextList}><div><dt>component</dt><dd>Button</dd></div><div><dt>variant</dt><dd>Primary · Medium</dd></div><div><dt>tokens</dt><dd>action.primary<br />radius.08</dd></div><div><dt>state</dt><dd>Default</dd></div></dl></article>
            <article><header><b>VS Code</b><span>React component</span></header><pre><code><em>&lt;Button</em>{"\n"}  variant=<b>&quot;primary&quot;</b>{"\n"}  size=<b>&quot;md&quot;</b>{"\n"}  token=<b>&quot;action.primary&quot;</b>{"\n"}<em>&gt;</em>{"\n"}  Create item{"\n"}<em>&lt;/Button&gt;</em></code></pre><footer><i />Context ready to review</footer></article>
          </div>
        </div>
      </WorkbenchFrame>
    </Stage>
  );
}

const codeLines: Array<{ line: string; focus?: CodeFocus }> = [
  { line: "<Button", focus: "variant" }, { line: "  variant=\"primary\"", focus: "variant" },
  { line: "  size=\"md\"", focus: "token" }, { line: "  token=\"action.primary\"", focus: "token" },
  { line: "  isLoading={isCreating}", focus: "state" }, { line: "  onClick={createItem}", focus: "state" },
  { line: "  aria-busy={isCreating}", focus: "accessibility" }, { line: ">" }, { line: "  Create item" }, { line: "</Button>" },
];

function Code() {
  const [focus, setFocus] = useState<CodeFocus>("variant");
  const focusLabels: Array<[CodeFocus, string]> = [["variant", "Variant"], ["token", "Tokens"], ["state", "State"], ["accessibility", "Accessibility"]];
  return (
    <Stage id="code">
      <StageIntro description="I treated generated code as a useful starting point, then reviewed the component structure, behaviour, token use and accessibility before accepting it." label="Code" number="05" title="Then I reviewed and refined the generated React." />
      <WorkbenchFrame detail="Rendered output and focused implementation" title="Design translated into code">
        <div className={styles.codeWorkbench}>
          <section className={styles.buildPreview}><div className={styles.buildPreviewMedia}><img alt="Implemented Task Automate interface" src="/modern-product-delivery/task-automate-ui.png" /><span className={styles.inspectionTag}>Primary action</span></div><footer><span><i />Rendered interface</span><small>Shared tokens applied</small></footer></section>
          <section className={styles.codePanel}><nav aria-label="Inspect implementation decision">{focusLabels.map(([id, label]) => <button aria-pressed={focus === id} key={id} onClick={() => setFocus(id)} onFocus={() => setFocus(id)} onMouseEnter={() => setFocus(id)} type="button">{label}</button>)}</nav><pre>{codeLines.map((item, index) => <code className={item.focus === focus ? styles.codeHighlighted : ""} key={`${item.line}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><span>{item.line}</span></code>)}</pre><footer><span>Review focus</span><b>{focusLabels.find(([id]) => id === focus)?.[1]}</b></footer></section>
        </div>
      </WorkbenchFrame>
    </Stage>
  );
}

function Validation() {
  const { ref, seen, active } = useViewportState<HTMLElement>();
  const checks = [["Responsive", "1440 / 1024 / 390"], ["Keyboard", "Tab order + focus"], ["States", "Loading / empty / error / disabled"], ["Visual", "Spacing / type / alignment"]];
  return (
    <section className={`${styles.stage} ${seen ? styles.stageSeen : ""} ${active ? styles.stageActive : ""}`} id="validation" ref={ref}>
      <div className={styles.sectionInner}>
        <StageIntro description="I compared the implementation with the design and checked the conditions that are easy to miss when only the default screen is reviewed." label="Validation" number="06" title="I checked the build across the complete experience." />
        <WorkbenchFrame title="Final validation">
          <div className={styles.validationWorkbench}>
            <section className={styles.comparePanel} aria-label="Figma and production comparison"><div className={styles.compareMedia}><figure><figcaption>Figma</figcaption><img alt="Task Automate Figma design" src="/modern-product-delivery/task-automate.png" /></figure><figure><figcaption>Production</figcaption><img alt="Task Automate production interface" src="/modern-product-delivery/task-automate-ui.png" /></figure></div></section>
            <aside className={styles.checkPanel}><header><b>Validated</b></header>{checks.map(([title, result]) => <article key={title}><p><b>{title}</b><span>— {result}</span></p><i aria-hidden="true">✓</i></article>)}</aside>
          </div>
        </WorkbenchFrame>
      </div>
    </section>
  );
}

function Outcome() {
  const outcomes = [["Shared language", "Design and development could refer to the same foundations and component rules."], ["Predictable behaviour", "States and interaction decisions were defined before the component reached production."], ["Stronger validation", "The final build was reviewed as a complete experience, not only a polished default screen."]];
  return (
    <section className={styles.outcome}><div className={styles.sectionInner}><div className={styles.outcomeIntro}><p>Final outcome</p><h2>A clearer path from design decisions to a working product.</h2><span>The result was more than a polished interface: it was a connected delivery process that reduced ambiguity between design and implementation.</span></div><div className={styles.outcomeList}>{outcomes.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div><a className={styles.returnLink} href="/#work">Return to selected work <span aria-hidden="true">↗</span></a></div></section>
  );
}

export default function DeliveryStory() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}><a aria-label="Manoj Kumar N home" className={styles.brand} href="/"><span>MK</span><strong>Manoj Kumar N</strong></a><a className={styles.back} href="/#work">Back to work <span aria-hidden="true">↙</span></a></header>
      <Hero /><ProductDesign /><DesignSystem /><Components /><MCP /><Code /><Validation /><Outcome />
    </main>
  );
}
