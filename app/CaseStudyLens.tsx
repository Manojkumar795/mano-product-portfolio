"use client";

import { useEffect, useState } from "react";

export type CaseStudyLensItem = {
  title: string;
  challenge: string;
  approach: string;
  solution: string;
  impact: string;
};

type Lens = "challenge" | "approach" | "solution" | "impact";

const lenses: Lens[] = ["challenge", "approach", "solution", "impact"];

const lensLabels: Record<Lens, string> = {
  challenge: "Challenge",
  approach: "Approach",
  solution: "Solution",
  impact: "Impact",
};

function readLensFromHash(): Lens | null {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.slice(1) as Lens;
  return lenses.includes(hash) ? hash : null;
}

export default function CaseStudyLens({ items }: { items: CaseStudyLensItem[] }) {
  const [activeLens, setActiveLens] = useState<Lens>("challenge");

  useEffect(() => {
    const syncLensWithHash = () => {
      const hashLens = readLensFromHash();
      if (hashLens) setActiveLens(hashLens);
    };

    syncLensWithHash();
    window.addEventListener("hashchange", syncLensWithHash);
    return () => window.removeEventListener("hashchange", syncLensWithHash);
  }, []);

  return (
    <section className="case-study-lens" aria-labelledby="case-study-lens-title">
      <div className="case-lens-copy">
        <p className="case-lens-kicker">Behind the design</p>
        <h2 id="case-study-lens-title">The problems I was solving,<br />not just the screens I made.</h2>
        <p>
          A finished screen only shows the final answer. Use these four views to see
          what made each workflow difficult, how I thought through it, what I changed
          in the experience, and what that change means for the people using the product.
        </p>
      </div>

      <nav className="case-lens-tabs" role="tablist" aria-label="Case study narrative lens">
        {lenses.map((lens) => (
          <a
            id={lens}
            key={lens}
            href={`#${lens}`}
            role="tab"
            aria-selected={activeLens === lens}
            aria-controls="case-lens-panel"
            className={activeLens === lens ? "is-active" : ""}
            onClick={() => setActiveLens(lens)}
          >
            {lensLabels[lens]}
          </a>
        ))}
      </nav>

      <div
        id="case-lens-panel"
        className="case-lens-grid"
        data-lens={activeLens}
        role="tabpanel"
        aria-label={`${lensLabels[activeLens]} across major modules`}
        key={activeLens}
      >
        {items.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item[activeLens]}</p>
          </article>
        ))}
      </div>

      <p className="case-lens-disclosure">
        I&apos;ve kept the impact statements qualitative because I don&apos;t have reliable
        post-launch analytics for these screens. I&apos;d rather show the real product value
        than attach made-up percentages to the work.
      </p>
    </section>
  );
}
