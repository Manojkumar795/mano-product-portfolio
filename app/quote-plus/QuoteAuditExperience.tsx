"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type AuditItem = {
  index: string;
  title: string;
  text: string;
};

type QuoteAuditExperienceProps = {
  strengths: AuditItem[];
  improvements: AuditItem[];
  takeaways: AuditItem[];
  measurementPlan: Array<[string, string]>;
};

function AuditCard({
  item,
  kind,
  order,
}: {
  item: AuditItem;
  kind: "strength" | "improvement";
  order: number;
}) {
  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--card-x", `${x * 100}%`);
    card.style.setProperty("--card-y", `${y * 100}%`);
    card.style.setProperty("--card-rx", `${(0.5 - y) * 7}deg`);
    card.style.setProperty("--card-ry", `${(x - 0.5) * 8}deg`);
  };

  const resetPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
  };

  return (
    <article
      className={`qp-audit-card qp-audit-card-${kind} qp-cinematic-reveal`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      style={{ "--reveal-order": order } as CSSProperties}
    >
      <div className="qp-audit-card-copy">
        <strong>{item.title}</strong>
        <p>{item.text}</p>
      </div>
      <i className="qp-audit-card-signal" aria-hidden="true" />
    </article>
  );
}

export default function QuoteAuditExperience({
  strengths,
  improvements,
  takeaways,
  measurementPlan,
}: QuoteAuditExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.classList.add("motion-ready");

    if (!("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;

    const section = event.currentTarget;
    const bounds = section.getBoundingClientRect();
    section.style.setProperty("--audit-x", `${event.clientX - bounds.left}px`);
    section.style.setProperty("--audit-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      className="qp-audit qp-audit-cinematic"
      id="audit"
      onPointerMove={handlePointerMove}
    >
      <div className="qp-audit-atmosphere" aria-hidden="true">
        <i className="qp-audit-grid-plane" />
        <i className="qp-audit-scan" />
        <i className="qp-audit-glow" />
      </div>

      <header className="qp-audit-hero">
        <div className="qp-audit-hero-copy">
          <h2 className="qp-cinematic-reveal" style={{ "--reveal-order": 0 } as CSSProperties}>
            <span>What works.</span>
            <span>What I would improve.</span>
          </h2>
          <p className="qp-cinematic-reveal" style={{ "--reveal-order": 1 } as CSSProperties}>
            The foundation is strong. The next design move is to reduce effort,
            make consequences unmistakable and preserve context through every handoff.
          </p>
        </div>
      </header>

      <div className="qp-audit-decks">
        <section className="qp-audit-deck qp-audit-deck-strength">
          <header className="qp-cinematic-reveal" style={{ "--reveal-order": 3 } as CSSProperties}>
            <h3>What works today</h3>
            <p>Four system decisions worth protecting as the product scales.</p>
          </header>
          <div className="qp-audit-card-grid">
            {strengths.map((item, index) => (
              <AuditCard key={item.index} item={item} kind="strength" order={4 + index} />
            ))}
          </div>
        </section>

        <section className="qp-audit-deck qp-audit-deck-improvement">
          <header className="qp-cinematic-reveal" style={{ "--reveal-order": 3 } as CSSProperties}>
            <h3>What I would improve next</h3>
            <p>The four changes with the highest impact on clarity and control.</p>
          </header>
          <div className="qp-audit-card-grid">
            {improvements.map((item, index) => (
              <AuditCard key={item.index} item={item} kind="improvement" order={4 + index} />
            ))}
          </div>
        </section>
      </div>

      <section className="qp-decision-path qp-cinematic-reveal" style={{ "--reveal-order": 5 } as CSSProperties}>
        <div className="qp-decision-path-copy">
          <h3>I redesigned the decision path—not just the screens.</h3>
          <p>
            One governed record now carries readiness, ownership, evidence and
            consequence from RFQ intake to award.
          </p>
        </div>
        <ol>
          {takeaways.map((item, index) => (
            <li key={item.index} style={{ "--path-order": index } as CSSProperties}>
              <span>{item.index}</span>
              <div><strong>{item.title}</strong><p>{item.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="qp-evidence-plan qp-cinematic-reveal" style={{ "--reveal-order": 6 } as CSSProperties}>
        <header>
          <h3>Prove that the workflow is becoming clearer.</h3>
          <p>After release, I would track these six signals instead of inventing impact numbers.</p>
        </header>
        <div className="qp-evidence-rail">
          {measurementPlan.map(([area, measure], index) => (
            <article key={area} style={{ "--metric-order": index } as CSSProperties}>
              <strong>{area}</strong>
              <p>{measure}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
