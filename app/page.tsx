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
import AboutLanyard from "./AboutLanyard";
import ProjectShowcaseGrid from "./ProjectShowcaseGrid";
import ComponentPlayground from "./ComponentPlayground";

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
      <link rel="preload" href="/fonts/orbitron-name.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      <header className="nav-wrap">
        <a className="nav-brand" href="#top" aria-label="Manoj Kumar N, home">
          <span>MK</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#visual-work">Visuals</a>
          <a href="#about">About</a>
          <a href="#approach">Approach</a>
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

        <p className="hero-identity">
          <span className="hero-identity-accessible">Manoj Kumar N</span>
          {["MANOJ", "KUMAR", "N"].map((word, wordIndex) => (
            <span className="hero-identity-word" aria-hidden="true" key={word}>
              {Array.from(word).map((letter, letterIndex) => (
                <span className="hero-identity-letter" key={letterIndex} style={{ "--name-letter": wordIndex * 5 + letterIndex } as CSSProperties}>{letter}</span>
              ))}
            </span>
          ))}
        </p>

        <div className="hero-composition">
          <div className="hero-copy-column">
            <div className="hero-title">
              <p>Enterprise UX · Design Systems · AI Workflows</p>
              <h1>
                <span>Complex.</span>
                <span className="hero-outline">Made <ColourfulText text="clear." /></span>
              </h1>
            </div>

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
          </div>
          <HeroSystemShowcase />
        </div>

      </section>

      <section className="work-modern" id="work" aria-labelledby="projects-title">
        <ProjectShowcaseGrid />
      </section>

      <ComponentPlayground />

      <VisualWorkShowcase />

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
        <AboutLanyard />
      </section>

      <section
        className="leadership-principles"
        id="approach"
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
