"use client";

import Image from "next/image";
import ColourfulText from "./ColourfulText";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type VisualWork = {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  kind: "vertical" | "horizontal";
  primary: string;
  secondary: string;
};

const visualWorks: VisualWork[] = [
  {
    id: "n52",
    title: "N52",
    src: "/visual-work/n52.webp",
    width: 662,
    height: 1680,
    kind: "vertical",
    primary: "79, 91, 105",
    secondary: "214, 219, 223",
  },
  {
    id: "eye-of-love",
    title: "Eye of Love",
    src: "/visual-work/eye-of-love.webp",
    width: 552,
    height: 2048,
    kind: "vertical",
    primary: "245, 47, 103",
    secondary: "255, 112, 151",
  },
  {
    id: "bloom-lilac",
    title: "Bloom Lilac",
    src: "/visual-work/bloom-lilac.webp",
    width: 827,
    height: 2048,
    kind: "vertical",
    primary: "174, 91, 235",
    secondary: "234, 145, 244",
  },
  {
    id: "beard-oil",
    title: "Natural Beard Oil",
    src: "/visual-work/beard-oil.webp",
    width: 662,
    height: 1680,
    kind: "vertical",
    primary: "41, 89, 52",
    secondary: "139, 153, 85",
  },
  {
    id: "k9-nutravie",
    title: "K9 Nutravie",
    src: "/visual-work/k9-nutravie.webp",
    width: 828,
    height: 2048,
    kind: "vertical",
    primary: "115, 166, 158",
    secondary: "171, 207, 230",
  },
];

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const ARTWORK_TOP_HOLD = 0.2;
const ARTWORK_PAN_END = 0.9;

const easeInOut = (value: number) =>
  value * value * (3 - 2 * value);

export default function VisualWorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const activeIndexRef = useRef(0);
  const blockViewerOpenUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedWork, setSelectedWork] = useState<VisualWork | null>(null);

  const activeWork = visualWorks[activeIndex];

  const openViewer = useCallback((work: VisualWork) => {
    if (Date.now() < blockViewerOpenUntilRef.current) return;
    setSelectedWork(work);
  }, []);

  const closeViewer = useCallback(() => {
    blockViewerOpenUntilRef.current = Date.now() + 420;
    setSelectedWork(null);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;

    const updateCinema = () => {
      animationFrame = 0;

      const viewportHeight = window.innerHeight;
      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const travel = Math.max(1, section.offsetHeight - viewportHeight);
      const progress = clamp((window.scrollY - sectionTop) / travel);
      const timeline = progress * visualWorks.length;
      const index = Math.min(
        visualWorks.length - 1,
        Math.floor(timeline),
      );
      const localProgress =
        index === visualWorks.length - 1 && progress === 1
          ? 1
          : clamp(timeline - index);
      const panProgress = easeInOut(
        clamp(
          (localProgress - ARTWORK_TOP_HOLD) /
            (ARTWORK_PAN_END - ARTWORK_TOP_HOLD),
        ),
      );

      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }

      section.style.setProperty("--cinema-progress", `${progress}`);
      section.style.setProperty("--artwork-progress", `${localProgress}`);
      section.style.setProperty("--artwork-pan-progress", `${panProgress}`);

      visualWorks.forEach((work, workIndex) => {
        const frame = frameRefs.current[workIndex];
        const image = imageRefs.current[workIndex];
        if (!frame || !image) return;

        const itemProgress =
          workIndex < index ? 1 : workIndex > index ? 0 : panProgress;

        if (work.kind === "vertical") {
          const maximumOffset = Math.max(
            0,
            image.offsetHeight - frame.clientHeight,
          );
          image.style.transform = `translate3d(0, ${Math.round(
            -maximumOffset * itemProgress,
          )}px, 0)`;
        } else {
          image.style.transform = `translate3d(${(
            (0.5 - itemProgress) * 34
          ).toFixed(2)}px, 0, 0) scale(1.045)`;
        }
      });

      const wave = section.querySelector<HTMLElement>(".visual-color-wave");
      if (wave) {
        const waveProgress = clamp(
          (localProgress - ARTWORK_PAN_END) / (1 - ARTWORK_PAN_END),
        );
        wave.style.transform = `translate3d(${
          -115 + waveProgress * 230
        }vw, 0, 0) skewX(-12deg)`;
        wave.style.opacity = `${
          Math.sin(waveProgress * Math.PI) * 0.72
        }`;
      }
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateCinema);
      }
    };

    updateCinema();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!selectedWork) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeViewer, selectedWork]);

  const jumpToWork = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const target =
      sectionTop + travel * ((index + 0.04) / visualWorks.length);

    window.scrollTo({
      top: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const moveReflection = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--visual-pointer-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--visual-pointer-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  const stageStyle = {
    "--visual-primary": activeWork.primary,
    "--visual-secondary": activeWork.secondary,
  } as CSSProperties;

  return (
    <section
      className={`visual-cinema${selectedWork ? " is-viewing" : ""}`}
      id="visual-work"
      ref={sectionRef}
      style={{ height: `${visualWorks.length * 175}svh` }}
      aria-labelledby="visual-work-title"
    >
      <div
        className={`visual-cinema-sticky visual-kind-${activeWork.kind}`}
        style={stageStyle}
      >
        <div className="visual-cinema-ambient" key={activeWork.id} aria-hidden="true" />
        <div className="visual-story-rail">
          <header className="visual-brief">
            <div className="visual-brief-inner">
              <p className="visual-brief-kicker">B2C · ECOMMERCE · AMAZON A+ CONTENT</p>
              <h2 id="visual-work-title">
                <span>Better product pages.</span>
                <span className="visual-brief-second-line"><ColourfulText text="Better buying decisions." tone="visual" /></span>
              </h2>
              <ol className="visual-brief-copy" role="list">
                <li>
                  <div>
                    <strong>Customer Problem</strong>
                    <p>Customers were discovering products but lacked clear information about their benefits, differences, and value—creating hesitation before purchase.</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Design Strategy</strong>
                    <p>I transformed product information into a guided buying journey using Amazon Premium A+—combining visual storytelling, benefit-led content, product comparisons, and consistent branding.</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Business Objective</strong>
                    <p>My goal was to build customer trust, improve purchase confidence, increase conversions, and reduce returns caused by unclear product expectations.</p>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Outcome</strong>
                    <p>The result was a cohesive Premium A+ experience with clearer product differentiation, stronger brand storytelling, and more intuitive product comparisons—designed to turn product interest into confident buying decisions.</p>
                  </div>
                </li>
              </ol>
            </div>
          </header>

          <div className="visual-work-caption" key={`caption-${activeWork.id}`}>
            <h3>{activeWork.title}</h3>
            <button type="button" onClick={() => openViewer(activeWork)}>
              View full artwork <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
        <div className="visual-color-wave" aria-hidden="true" />

        <div className="visual-artwork-stack">
          {visualWorks.map((work, index) => {
            const position =
              index === activeIndex
                ? "is-active"
                : index < activeIndex
                  ? "is-past"
                  : "is-future";

            return (
              <div
                className={`visual-artwork visual-artwork-${work.kind} ${position}`}
                key={work.id}
                aria-hidden={index !== activeIndex}
              >
                <button
                  className="visual-artwork-button"
                  type="button"
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-label={`Open ${work.title} full artwork`}
                  onClick={() => openViewer(work)}
                  onPointerMove={moveReflection}
                >
                  <div
                    className="visual-artwork-frame"
                    ref={(node) => {
                      frameRefs.current[index] = node;
                    }}
                  >
                    <Image
                      ref={(node) => {
                        imageRefs.current[index] = node;
                      }}
                      src={work.src}
                      alt={`${work.title} visual design by Manoj Kumar N`}
                      width={work.width}
                      height={work.height}
                      unoptimized
                      sizes={
                        work.kind === "vertical"
                          ? "(max-width: 760px) 82vw, 38vw"
                          : "(max-width: 760px) 94vw, 76vw"
                      }
                      onLoad={() => window.dispatchEvent(new Event("resize"))}
                    />
                  </div>
                  <span className="visual-artwork-open" aria-hidden="true">↗</span>
                  <strong className="visual-artwork-static-title">{work.title}</strong>
                </button>
              </div>
            );
          })}
        </div>

        <nav className="visual-cinema-progress" aria-label="Visual work selection">
          {visualWorks.map((work, index) => (
            <button
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              key={work.id}
              onClick={() => jumpToWork(index)}
              aria-label={`View ${work.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span />
            </button>
          ))}
        </nav>
      </div>

      {selectedWork && (
        <div
          className="visual-viewer"
          role="presentation"
          onMouseDown={closeViewer}
        >
          <section
            className={`visual-viewer-dialog visual-viewer-${selectedWork.kind}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="visual-viewer-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <h2 id="visual-viewer-title">{selectedWork.title}</h2>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.stopPropagation();
                  closeViewer();
                }}
                onClick={closeViewer}
                aria-label="Close full artwork"
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="visual-viewer-image">
              <Image
                src={selectedWork.src}
                alt={`${selectedWork.title} full visual design by Manoj Kumar N`}
                width={selectedWork.width}
                height={selectedWork.height}
                unoptimized
                sizes="94vw"
              />
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
