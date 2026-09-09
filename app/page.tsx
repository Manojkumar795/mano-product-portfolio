"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { Icon as IconifyLogo, type IconifyIcon } from "@iconify/react";
import figmaLogo from "@iconify-icons/logos/figma";
import photoshopLogo from "@iconify-icons/logos/adobe-photoshop";
import illustratorLogo from "@iconify-icons/logos/adobe-illustrator";
import afterEffectsLogo from "@iconify-icons/logos/adobe-after-effects";
import premiereLogo from "@iconify-icons/logos/adobe-premiere";
import jiraLogo from "@iconify-icons/logos/jira";
import {
  SiClaude,
  SiCursor,
  SiFramer,
  SiGithub,
  SiVercel,
} from "react-icons/si";
import {
  TbBrandOpenai,
} from "react-icons/tb";
import { RiHeart3Fill } from "react-icons/ri";
import { siCanva } from "simple-icons";
import HeroSystemShowcase from "./HeroSystemShowcase";
import VisualWorkShowcase from "./VisualWorkShowcase";
import ColourfulText from "./ColourfulText";
import HeroMockups from "./slotgo/HeroMockups";

function CanvaLogo() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="canva-brand-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00c4cc" />
          <stop offset="1" stopColor="#7d2ae8" />
        </linearGradient>
      </defs>
      <path fill="url(#canva-brand-gradient)" d={siCanva.path} />
    </svg>
  );
}

function BrandLogo({ icon }: { icon: IconifyIcon }) {
  return <IconifyLogo icon={icon} />;
}

function FigmaLogo() {
  return <BrandLogo icon={figmaLogo} />;
}

function PhotoshopLogo() {
  return <BrandLogo icon={photoshopLogo} />;
}

function IllustratorLogo() {
  return <BrandLogo icon={illustratorLogo} />;
}

function AfterEffectsLogo() {
  return <BrandLogo icon={afterEffectsLogo} />;
}

function PremiereLogo() {
  return <BrandLogo icon={premiereLogo} />;
}

function JiraLogo() {
  return <BrandLogo icon={jiraLogo} />;
}

type Project = {
  id: string;
  visual: string;
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  role: string;
  showcase: string;
  tags: string[];
  className: string;
  challenge: string;
  move: string;
  outcome: string;
  note: string;
};

const projects: Project[] = [
  {
    id: "program",
    visual: "program",
    index: "01",
    title: "Program+",
    eyebrow: "Program Lifecycle Management Platform",
    description:
      "A high-signal operating system for master timing, open issues, work queues and live program health.",
    role: "Lead Product Designer",
    showcase: "Case study",
    tags: ["Program operations", "Data UX", "Enterprise SaaS"],
    className: "project-program",
    challenge:
      "Program teams needed to scan timing, issues and work status quickly without losing access to operational detail.",
    move:
      "I reorganized the experience around a focused work queue, concise KPI signals and progressive access to program data.",
    outcome:
      "A calmer operational view that makes priorities and exceptions visible while keeping complex program data accessible.",
    note: "Selected details are adapted to respect client confidentiality.",
  },
  {
    id: "quote",
    visual: "quote",
    index: "02",
    title: "Quote+",
    eyebrow: "Enterprise Quotation Management Platform",
    description:
      "A connected RFQ-to-award workspace for quotation setup, scenarios, participants, audit history and Go/No-Go decisions.",
    role: "Lead Product Designer",
    showcase: "Case study",
    tags: ["Enterprise UX", "RFQ workflow", "Decision systems"],
    className: "project-quote",
    challenge:
      "Pricing teams were moving between dense forms, spreadsheets and disconnected approval steps during time-sensitive quotation work.",
    move:
      "I shaped a section-based workspace, a clearer information hierarchy, role-aware collaboration and a visual decision path from RFQ intake to Go/No-Go.",
    outcome:
      "A more understandable and traceable quotation flow that gives teams one shared view of quote status, inputs and decisions.",
    note: "Selected details are adapted to respect client confidentiality.",
  },
  {
    id: "profit",
    visual: "profit",
    index: "03",
    title: "Profit+",
    eyebrow: "Enterprise Configuration & Workflow Platform",
    description:
      "A system-aware authoring workspace for fields, sections, pages, levels, flows and rules.",
    role: "Senior Product Designer",
    showcase: "Case study",
    tags: ["Configuration UX", "Information architecture", "Enterprise SaaS"],
    className: "project-profit",
    challenge:
      "Administrators could create individual objects, but the product hid how fields, sections, pages and workflow rules related to one another.",
    move:
      "I evolved the experience level by level, making hierarchy visible while keeping frequent authoring tasks focused and predictable.",
    outcome:
      "A scalable Configuration Studio that supports complex system relationships without turning everyday administration into system mapping.",
    note: "Selected details are adapted to respect client confidentiality.",
  },
  {
    id: "sustain",
    visual: "sustain",
    index: "04",
    title: "Sustain+",
    eyebrow: "Sustainability & ESG Management Platform",
    description:
      "An ESG workspace for emissions, targets, initiatives, evidence and sustainability performance.",
    role: "Senior Product Designer",
    showcase: "Case study",
    tags: ["ESG workflows", "Data visualization", "Reporting"],
    className: "project-sustain",
    challenge:
      "Sustainability teams needed to connect targets, operational evidence and performance data without losing reporting context.",
    move:
      "I organized the product around measurable ESG pillars, clear ownership, evidence status and progressive disclosure for dense metrics.",
    outcome:
      "A more legible sustainability workflow that connects strategic targets with the operational data used to support them.",
    note: "Selected details are adapted to respect client confidentiality.",
  },
  {
    id: "delivery",
    visual: "delivery",
    index: "05",
    title: "Modern Product Delivery",
    eyebrow: "Technical Showcase",
    description:
      "From Enterprise Design Systems to Production Applications",
    role: "Design Systems + AI Delivery",
    showcase: "Technical showcase",
    tags: [
      "Syncfusion UI Kit",
      "Product Design System",
      "Figma Components",
      "Design Tokens",
      "Motion",
      "AI Workflow",
      "MCP",
      "Claude Code",
      "React",
      "Production",
    ],
    className: "project-delivery",
    challenge:
      "Enterprise UI work loses consistency when components, tokens, motion and engineering implementation are treated as separate handoffs.",
    move:
      "One end-to-end story: Syncfusion UI Kit → product design system → Figma components and tokens → motion → AI workflow → MCP and Claude Code → React → production.",
    outcome:
      "A connected delivery model that keeps design intent traceable from the component library to a running application.",
    note: "Presented as one continuous technical story—not separate chapters.",
  },
  {
    id: "research",
    visual: "research",
    index: "06",
    title: "F-35 Helmet UX",
    eyebrow: "UX / Human Factors Research",
    description:
      "Designing clarity for extreme human–machine interaction.",
    role: "Independent UX Research",
    showcase: "Research showcase",
    tags: [
      "Information hierarchy",
      "Cognitive load",
      "Situational awareness",
      "Mission-critical interface design",
      "Enterprise dashboard principles",
    ],
    className: "project-research",
    challenge:
      "Mission-critical displays must compress complex information without hiding priority, state or consequence.",
    move:
      "I studied information hierarchy, cognitive load, situational awareness and alert behavior, then translated the principles—not the cockpit styling—into enterprise UX guidance.",
    outcome:
      "A reusable set of dashboard principles for prioritization, scanning, escalation and decision confidence in complex products.",
    note: "Independent UX research. No affiliation with Lockheed Martin or the F-35 program.",
  },
  {
    id: "slotgo",
    visual: "slotgo",
    index: "07",
    title: "SlotGo",
    eyebrow: "Sports Booking & Venue Operations",
    description:
      "Product design across a player booking app and the venue operations app managing the same court inventory.",
    role: "Product Designer",
    showcase: "Client product case study",
    tags: ["Mobile product", "Booking flow", "Venue operations", "Design system"],
    className: "project-slotgo",
    challenge:
      "Players needed a quick way to find and reserve courts while venue teams needed reliable control over availability, payments and schedules.",
    move:
      "I designed the two apps around a shared booking state, then clarified the customer flow, operational calendar and status language.",
    outcome:
      "A coherent product model connecting discovery, payment, court availability and venue follow-up.",
    note: "Selected details are adapted to respect client confidentiality.",
  },
];

const approachSteps = [
  {
    title: "Map the reality",
    text: "Users, business rules, exceptions, technical constraints and the workarounds nobody wrote down.",
  },
  {
    title: "Find the system",
    text: "Turn scattered requirements into a clear product model, information architecture and set of design principles.",
  },
  {
    title: "Prototype the decisions",
    text: "Test the risky moments first: handoffs, permission changes, exceptions, dense data and irreversible actions.",
  },
  {
    title: "Build for scale",
    text: "Connect the experience to tokens, reusable patterns, edge cases and code-aware engineering guidance.",
  },
];

const workflowStack = [
  {
    category: "Design",
    tools: [
      { name: "Figma", Icon: FigmaLogo, brand: "figma" },
      { name: "Adobe Photoshop", Icon: PhotoshopLogo, brand: "photoshop" },
      { name: "Adobe Illustrator", Icon: IllustratorLogo, brand: "illustrator" },
      { name: "Canva", Icon: CanvaLogo, brand: "canva" },
    ],
  },
  {
    category: "Motion",
    tools: [
      { name: "Framer", Icon: SiFramer, brand: "framer" },
      { name: "Adobe After Effects", Icon: AfterEffectsLogo, brand: "after-effects" },
      { name: "Adobe Premiere Pro", Icon: PremiereLogo, brand: "premiere" },
    ],
  },
  {
    category: "AI",
    tools: [
      { name: "Claude", Icon: SiClaude, brand: "claude" },
      { name: "ChatGPT", Icon: TbBrandOpenai, brand: "chatgpt" },
      { name: "Cursor", Icon: SiCursor, brand: "cursor" },
      { name: "Lovable", Icon: RiHeart3Fill, brand: "lovable" },
    ],
  },
  {
    category: "Development",
    tools: [
      { name: "GitHub", Icon: SiGithub, brand: "github" },
      { name: "Vercel", Icon: SiVercel, brand: "vercel" },
    ],
  },
  {
    category: "Collaboration",
    tools: [{ name: "Jira", Icon: JiraLogo, brand: "jira" }],
  },
];

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function DeliveryComparePreview() {
  const [position, setPosition] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const direction = useRef(1);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.08 },
    );

    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      !isInView ||
      isDragging ||
      isFocused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let animationFrame = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      setPosition((current) => {
        let next = current + direction.current * elapsed * 7;

        if (next >= 76) {
          next = 76;
          direction.current = -1;
        } else if (next <= 24) {
          next = 24;
          direction.current = 1;
        }

        return next;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isDragging, isFocused, isInView]);

  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(82, Math.max(18, next)));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) =>
        Math.min(82, Math.max(18, current + (event.key === "ArrowLeft" ? -3 : 3))),
      );
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setPosition(event.key === "Home" ? 18 : 82);
    }
  };

  return (
    <div
      ref={shellRef}
      className={`delivery-compare-shell${isDragging ? " is-dragging" : ""}`}
      style={{ "--delivery-compare-position": `${position}%` } as CSSProperties}
    >
      <div className="delivery-compare-rim">
        <div
          className="delivery-compare-stage"
          role="slider"
          tabIndex={0}
          aria-label="Compare the Task Automate product screen with its coded implementation"
          aria-valuemin={18}
          aria-valuemax={82}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% product screen, ${Math.round(100 - position)}% code screen`}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            if (isDragging) updateFromPointer(event);
          }}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="delivery-compare-design" aria-hidden="true">
            <Image
              src="/modern-product-delivery/task-automate-ui.png"
              alt=""
              fill
              unoptimized
              sizes="(max-width: 760px) 82vw, 24vw"
            />
          </div>

          <div className="delivery-compare-live" aria-hidden="true">
            <Image
              src="/modern-product-delivery/vscode-code-screen.png"
              alt=""
              fill
              unoptimized
              sizes="(max-width: 760px) 82vw, 24vw"
            />
          </div>

          <div className="delivery-compare-divider" aria-hidden="true">
            <i className="delivery-collision-beam beam-one" />
            <i className="delivery-collision-beam beam-two" />
            <span className="delivery-compare-sparks">
              {Array.from({ length: 12 }).map((_, index) => <i key={index} />)}
            </span>
            <span className="delivery-compare-handle"><i /><i /><i /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductMockup({ type }: { type: string }) {
  if (type === "slotgo") {
    return (
      <div className="mockup mockup-slotgo" aria-hidden="true">
        <Image className="slotgo-card-court" src="/slotgo/hero-court.png" alt="" fill sizes="(max-width: 720px) 100vw, 65vw" unoptimized />
        <div className="slotgo-card-artwork">
          <HeroMockups caption={false} priority={false} animate={false} />
        </div>
      </div>
    );
  }

  if (type === "quote") {
    return (
      <div className="mockup mockup-project-real mockup-quote-real" aria-hidden="true">
        <div className="project-real-label">
          <span>Quote+</span>
          <b>RFQ → decision</b>
        </div>
        <div className="project-live-progress"><i /></div>
        <div className="project-real-shot project-real-primary project-live-stage">
          <div className="project-live-frame project-live-frame-one">
            <Image
              src="/quote-plus/rfq-overview.webp"
              alt=""
              width={1486}
              height={774}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-two">
            <Image
              src="/quote-plus/team-overview.webp"
              alt=""
              width={1486}
              height={781}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-three">
            <Image
              src="/quote-plus/go-decision.webp"
              alt=""
              width={1486}
              height={846}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-four">
            <Image
              src="/quote-plus/no-go-decision.webp"
              alt=""
              width={1486}
              height={946}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <i className="project-live-sheen" />
        </div>
        <div className="project-real-shot project-real-secondary project-live-secondary">
          <Image
            src="/quote-plus/go-decision.webp"
            alt=""
            width={1486}
            height={846}
            unoptimized
            sizes="(max-width: 760px) 52vw, 25vw"
          />
        </div>
      </div>
    );
  }

  if (type === "config") {
    return (
      <div className="mockup mockup-config" aria-hidden="true">
        <div className="config-toolbar">
          <span>Canvas</span>
          <span>Rules</span>
          <span>Variables</span>
          <b>Publish</b>
        </div>
        <div className="config-space">
          <i className="flow-line line-a" />
          <i className="flow-line line-b" />
          <span className="flow-node node-a">
            <small>Start</small>
            Quote type
          </span>
          <span className="flow-node node-b">
            <small>Rule</small>
            Customer
          </span>
          <span className="flow-node node-c">
            <small>Page</small>
            Pricing
          </span>
          <span className="flow-node node-d">
            <small>End</small>
            Review
          </span>
        </div>
      </div>
    );
  }

  if (type === "program") {
    return (
      <div className="mockup mockup-program-gallery" aria-hidden="true">
        <div className="program-gallery-primary project-live-stage">
          <div className="project-live-frame project-live-frame-one">
            <Image
              src="/program-plus/mtt-board.png"
              alt=""
              width={1440}
              height={1026}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-two">
            <Image
              src="/program-plus/issue-tracker-inline.png"
              alt=""
              width={2048}
              height={1515}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-three">
            <Image
              src="/program-plus/work-queue.png"
              alt=""
              width={1440}
              height={1179}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-four">
            <Image
              src="/program-plus/mtt-add-task.png"
              alt=""
              width={1574}
              height={1024}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-five">
            <Image
              src="/program-plus/add-issue.png"
              alt=""
              width={1330}
              height={922}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-six">
            <Image
              src="/program-plus/phase-gate.png"
              alt=""
              width={2048}
              height={1456}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-seven">
            <Image
              src="/program-plus/program-team.png"
              alt=""
              width={2048}
              height={1456}
              unoptimized
              sizes="(max-width: 720px) 88vw, 48vw"
            />
          </div>
          <i className="project-live-sheen" />
        </div>
        <div className="program-gallery-rail">
          <div className="program-gallery-thumb">
            <Image
              src="/program-plus/issue-tracker-inline.png"
              alt=""
              width={2048}
              height={1515}
              unoptimized
              sizes="(max-width: 720px) 42vw, 20vw"
            />
          </div>
          <div className="program-gallery-thumb">
            <Image
              src="/program-plus/phase-gate.png"
              alt=""
              width={2048}
              height={1456}
              unoptimized
              sizes="(max-width: 720px) 42vw, 20vw"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "profit") {
    return (
      <div className="mockup mockup-project-real mockup-profit-real" aria-hidden="true">
        <div className="project-real-shot project-real-primary project-live-stage">
          <div className="project-live-frame project-live-frame-one">
            <Image
              src="/profit-plus/evolution/final-reduced-colour.png"
              alt=""
              width={1470}
              height={766}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-two">
            <Image
              src="/profit-plus/evolution/final-balanced-workspace.png"
              alt=""
              width={1470}
              height={766}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-three">
            <Image
              src="/profit-plus/evolution/final-structure-first.png"
              alt=""
              width={1470}
              height={766}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "sustain") {
    return (
      <div className="mockup mockup-project-real mockup-sustain-real" aria-hidden="true">
        <div className="project-real-shot project-real-primary project-live-stage">
          <div className="project-live-frame project-live-frame-one">
            <Image
              src="/sustain-plus/report-summary.webp"
              alt=""
              width={1920}
              height={1080}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-two">
            <Image
              src="/sustain-plus/framework-library.webp"
              alt=""
              width={1920}
              height={1080}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
          <div className="project-live-frame project-live-frame-three">
            <Image
              src="/sustain-plus/reporting-portfolio.webp"
              alt=""
              width={1920}
              height={1080}
              unoptimized
              sizes="(max-width: 760px) 88vw, 44vw"
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "delivery") {
    return (
      <div className="mockup mockup-delivery">
        <DeliveryComparePreview />
      </div>
    );
  }

  if (type === "research") {
    return (
      <div className="mockup mockup-research" aria-hidden="true">
        <Image
          className="research-card-image"
          src="/f35-helmet-ux/targeting-cockpit-v2.webp"
          alt=""
          width={1672}
          height={941}
          unoptimized
          sizes="(max-width: 760px) 88vw, 44vw"
        />
        <div className="research-card-vignette" />
        <div className="research-target-lock">
          <i />
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="research-target-data">
          <strong>Aircraft ahead</strong>
          <span>16° right · 18.4 NM</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mockup mockup-system" aria-hidden="true">
      <div className="system-orbit orbit-one" />
      <div className="system-orbit orbit-two" />
      <div className="system-core">
        <small>NEOS</small>
        <strong>8K+</strong>
        <span>Components</span>
      </div>
      <div className="system-chip chip-one">Tokens</div>
      <div className="system-chip chip-two">Variables</div>
      <div className="system-chip chip-three">States</div>
      <div className="system-chip chip-four">Patterns</div>
    </div>
  );
}

function CaseStudyModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="case-overlay" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="case-title"
        aria-modal="true"
        className="case-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="case-modal-head">
          <div>
            <strong id="case-title">{project.title}</strong>
          </div>
          <button type="button" onClick={onClose} aria-label="Close case study">
            Close <i>×</i>
          </button>
        </div>
        <div className={`case-hero ${project.className}`}>
          <ProductMockup type={project.visual} />
        </div>
        <div className="case-grid">
          <div>
            <span>Challenge</span>
            <p>{project.challenge}</p>
          </div>
          <div>
            <span>Design move</span>
            <p>{project.move}</p>
          </div>
          <div>
            <span>Outcome</span>
            <p>{project.outcome}</p>
          </div>
        </div>
        <div className="case-footer">
          <ul>
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <p>{project.note}</p>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.classList.contains("workflow-stack-group")) {
              entry.target
                .closest(".workflow-stack")
                ?.classList.add("is-color-awake");
            }
          }
        });
      },
      { threshold: 0.14 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero-modern");
    const dashboard = hero?.querySelector<HTMLElement>(".hero-art");
    const content = hero?.querySelector<HTMLElement>(".hero-bottom");
    const heading = hero?.querySelector<HTMLElement>(".hero-title h1");

    if (!hero || !dashboard || !content) return;

    const topWithinHero = (element: HTMLElement) => {
      let top = 0;
      let current: HTMLElement | null = element;

      while (current && current !== hero) {
        top += current.offsetTop;
        current = current.offsetParent as HTMLElement | null;
      }

      return top;
    };

    const bottomWithinHero = (element: HTMLElement) =>
      topWithinHero(element) + element.offsetHeight;

    const alignHeroContent = () => {
      if (window.innerWidth <= 760) {
        content.style.removeProperty("--hero-bottom-align-y");
        return;
      }

      const dashboardOffset =
        bottomWithinHero(dashboard) - bottomWithinHero(content);
      const minimumOffset = heading
        ? bottomWithinHero(heading) + 32 - topWithinHero(content)
        : dashboardOffset;
      const offset = Math.max(dashboardOffset, minimumOffset);

      content.style.setProperty("--hero-bottom-align-y", `${Math.round(offset)}px`);
    };

    alignHeroContent();

    const resizeObserver = new ResizeObserver(alignHeroContent);
    resizeObserver.observe(hero);
    resizeObserver.observe(dashboard);
    resizeObserver.observe(content);
    if (heading) resizeObserver.observe(heading);
    window.addEventListener("resize", alignHeroContent);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", alignHeroContent);
    };
  }, []);

  const moveSpotlight = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${event.clientY - bounds.top}px`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-x",
      `${(x - 0.5) * 5}deg`,
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      `${(0.5 - y) * 4}deg`,
    );
    event.currentTarget.style.setProperty("--hud-x", `${(x - 0.5) * 14}px`);
    event.currentTarget.style.setProperty("--hud-y", `${(y - 0.5) * 10}px`);
  };

  return (
    <main>
      <header className="nav-wrap">
        <a className="nav-brand" href="#top" aria-label="Manoj Kumar N, home">
          <span>MK</span>
          <strong>Manoj Kumar N</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#visual-work">Visuals</a>
          <a href="#approach">Approach</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-cta" href="#contact">
          Let&apos;s talk <Arrow />
        </a>
      </header>

      <section className="hero-modern" id="top" onPointerMove={moveSpotlight}>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-status">
          <span>
            <i />
            Available for senior product roles
          </span>
          <small>Coimbatore · Bengaluru · Chennai · Remote</small>
        </div>

        <div className="hero-title">
          <p>Enterprise UX · Design Systems · AI Workflows</p>
          <h1>
            <span>Complex.</span>
            <span className="hero-outline">Made <ColourfulText text="clear." /></span>
          </h1>
        </div>

        <HeroSystemShowcase />

        <div className="hero-bottom">
          <p>
            I simplify complex enterprise workflows, build design systems that
            scale, and connect Figma to AI-assisted development.
          </p>
          <div className="hero-actions">
            <a className="action-primary" href="#work">
              View Case Studies <Arrow down />
            </a>
            <a
              className="action-quiet"
              href="/Manojkumar_N_Premium_Product_Designer_CV.pdf"
              download
            >
              Download Résumé <Arrow />
            </a>
          </div>
        </div>

        <div className="hero-metrics">
          <div>
            <strong>8+</strong>
            <span>Years building enterprise products</span>
          </div>
          <div>
            <strong>40+</strong>
            <span>Features designed &amp; delivered</span>
          </div>
          <div>
            <strong className="hero-metric-label">Design Systems</strong>
            <span>
              AI Workflows ·<br />
              Production Ready
            </span>
          </div>
        </div>
      </section>

      <section className="work-modern" id="work">
        <div className="work-intro" data-reveal>
          <div>
            <h2>Seven stories.<br />One obsession: <ColourfulText text="clarity." /></h2>
          </div>
          <p>
            Not isolated screens. End-to-end product systems designed around
            real decisions, constraints and the people doing the work.
          </p>
        </div>

        <div className="project-bento">
          {projects.map((project) => (
            <article
              className={`modern-project ${project.className}`}
              data-reveal
              key={project.id}
            >
              <div className="project-layout">
                <div className="project-copy">
                  <p>{project.eyebrow}</p>
                  <span className="project-index" aria-hidden="true">{project.index}</span>
                  <h3>
                    {project.title.endsWith("+") ? (
                      <>
                        {project.title.slice(0, -1)}
                        <span className="project-title-plus">+</span>
                      </>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p>{project.description}</p>
                  {project.id === "slotgo" ||
                  project.id === "quote" ||
                  project.id === "program" ||
                  project.id === "profit" ||
                  project.id === "sustain" ||
                  project.id === "delivery" ||
                  project.id === "research" ? (
                    <a
                      className="project-open"
                      href={
                        project.id === "slotgo"
                          ? "/slotgo"
                          : project.id === "quote"
                            ? "/quote-plus"
                            : project.id === "program"
                              ? "/program-plus"
                              : project.id === "profit"
                                ? "/profit-plus"
                                : project.id === "sustain"
                                  ? "/sustain-plus"
                                  : project.id === "delivery"
                                    ? "/modern-product-delivery"
                                    : "/f35-helmet-ux"
                      }
                      aria-label={`Explore the full ${project.title} story`}
                    >
                      {project.id === "delivery"
                        ? "Explore delivery story"
                        : project.id === "research"
                          ? "Explore research story"
                          : "Explore case study"} <Arrow />
                    </a>
                  ) : (
                    <button
                      className="project-open"
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      aria-label={`Open ${project.title} case study`}
                    >
                      View project <Arrow />
                    </button>
                  )}
                </div>
                <div className="project-visual">
                  <ProductMockup type={project.visual} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="first-contact">
        <p>More than a portfolio. A working view of how I think.</p>
        <a
          href="https://www.behance.net/gallery/163184803/Manoj_Workspace"
          target="_blank"
          rel="noreferrer"
        >
          View Behance <Arrow />
        </a>
      </section>

      <VisualWorkShowcase />

      <section className="approach-modern" id="approach">
        <div className="approach-sticky" data-reveal>
          <h2>I don&apos;t decorate complexity. I <ColourfulText text="model it." /></h2>
          <span>
            The goal is not fewer details. It is the right details, in the right
            order, for the right person.
          </span>
        </div>
        <div className="approach-stack">
          {approachSteps.map((step) => (
            <article data-reveal key={step.title}>
              <div aria-hidden="true">
                <i />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-lab" data-reveal>
        <div className="ai-lab-copy">
          <h2>Faster exploration. Same <ColourfulText text="design judgment." /></h2>
          <span>
            I connect product context, Figma systems and code-aware AI tools to
            explore, validate and communicate solutions faster—without
            outsourcing the product decision.
          </span>
        </div>
        <div className="ai-pipeline" aria-label="AI-assisted design workflow">
          <div>
            <strong>Product context</strong>
            <small>Users, rules and constraints</small>
          </div>
          <i>→</i>
          <div>
            <strong>Design system</strong>
            <small>Tokens, patterns and behavior</small>
          </div>
          <i>→</i>
          <div>
            <strong>AI collaboration</strong>
            <small>Explore, critique and document</small>
          </div>
          <i>→</i>
          <div>
            <strong>Engineering flow</strong>
            <small>Figma, code and Storybook</small>
          </div>
        </div>
      </section>

      <section className="workflow-stack" aria-labelledby="workflow-stack-title">
        <div className="workflow-stack-color-wave" aria-hidden="true" />
        <div className="workflow-stack-heading" data-reveal>
          <h2 id="workflow-stack-title">Workflow <ColourfulText text="Stack" /></h2>
        </div>
        <div className="workflow-stack-grid">
          {workflowStack.map((group) => (
            <article className="workflow-stack-group" data-reveal key={group.category}>
              <div className="workflow-stack-label">
                <h3>{group.category}</h3>
              </div>
              <ul>
                {group.tools.map(({ name, Icon, brand }) => (
                  <li key={name}>
                    <span
                      className={`workflow-tool-icon workflow-tool-${brand}`}
                      aria-hidden="true"
                    >
                      <Icon />
                    </span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className="leadership-principles"
        aria-labelledby="leadership-principles-title"
      >
        <div className="leadership-principles-heading" data-reveal>
          <h2 id="leadership-principles-title">
            Good products need <em>more than good <ColourfulText text="screens." /></em>
          </h2>
        </div>

        <div className="leadership-principles-grid">
          <article className="leadership-principle" data-reveal>
            <div className="leadership-motion leadership-motion-judgment" aria-hidden="true">
              <i />
              <i />
              <span />
            </div>
            <h3>Product Judgment</h3>
            <p>
              Not every problem deserves the same amount of design. I focus
              first on the decisions that affect the user, the workflow and the
              business.
            </p>
          </article>

          <article className="leadership-principle" data-reveal>
            <div className="leadership-motion leadership-motion-business" aria-hidden="true">
              <i />
              <i />
              <span />
            </div>
            <h3>Business + UX</h3>
            <p>
              Enterprise products come with rules, deadlines and technical
              limits. I design with those constraints in the room instead of
              treating them as someone else&apos;s problem.
            </p>
          </article>

          <article className="leadership-principle" data-reveal>
            <div className="leadership-motion leadership-motion-leadership" aria-hidden="true">
              <i />
              <i />
              <i />
              <span />
            </div>
            <h3>Cross-functional Leadership</h3>
            <p>
              I work with product, engineering and stakeholders to turn
              different points of view into one direction the team can actually
              build.
            </p>
          </article>

          <article className="leadership-principle" data-reveal>
            <div className="leadership-motion leadership-motion-mentorship" aria-hidden="true">
              <i />
              <i />
              <i />
              <span />
            </div>
            <h3>Mentorship</h3>
            <p>
              At BYJU&apos;S and Kyyba, mentoring became part of my work. I helped
              teams work through problems, explain their decisions and become
              more confident owning the work.
            </p>
          </article>
        </div>
      </section>

      <section className="about-modern" id="about">
        <div className="about-statement" data-reveal>
          <h2>
            Systems thinker.
            <br />
            Detail obsessive.
            <br />
            Business <ColourfulText text="aware." />
          </h2>
        </div>
        <div className="about-copy" data-reveal>
          <p>
            I&apos;m Manoj Kumar N, a Senior Product Designer with 8+ years of
            experience across enterprise SaaS, complex B2B workflows, RFQ
            platforms, dashboards and scalable design systems.
          </p>
          <p>
            I work at the intersection of product strategy, interaction design
            and engineering—especially where the product has many users, rules,
            states and consequences.
          </p>
          <blockquote>
            “Clarity is not removing complexity. It is helping people move
            through it with confidence.”
          </blockquote>
        </div>
      </section>

      <section className="contact-modern" id="contact">
        <div className="contact-orb" aria-hidden="true">
          <i />
          <i />
          <span>Open to<br />new teams</span>
        </div>
        <h2>Let&apos;s make it<br />feel <ColourfulText text="obvious." /></h2>
        <div className="contact-links">
          <a
            href="https://www.behance.net/gallery/163184803/Manoj_Workspace"
            target="_blank"
            rel="noreferrer"
          >
            Behance portfolio <Arrow />
          </a>
          <a
            href="/Manojkumar_N_Premium_Product_Designer_CV.pdf"
            download
          >
            Download résumé <Arrow down />
          </a>
        </div>
        <footer>
          <a href="#top">Manoj Kumar N · Senior Product Designer</a>
          <span>Coimbatore · Bengaluru · Chennai · Remote</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>

      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
