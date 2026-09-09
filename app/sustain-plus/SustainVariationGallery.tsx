"use client";

import Image from "next/image";
import { useState } from "react";

type Variation = {
  title: string;
  summary: string;
  decision: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function SustainVariationGallery({
  label,
  variations,
}: {
  label: string;
  variations: Variation[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = variations[activeIndex];

  return (
    <div className="sustain-variation-gallery" data-sustain-reveal>
      <div className="sustain-variation-tabs" role="tablist" aria-label={label}>
        {variations.map((variation, index) => (
          <button
            id={`${label.replace(/\s+/g, "-").toLowerCase()}-${index}`}
            key={variation.title}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`${label.replace(/\s+/g, "-").toLowerCase()}-panel`}
            className={activeIndex === index ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          >
            <strong>{variation.title}</strong>
            <span>{variation.summary}</span>
          </button>
        ))}
      </div>

      <div
        id={`${label.replace(/\s+/g, "-").toLowerCase()}-panel`}
        className="sustain-variation-panel"
        role="tabpanel"
        aria-labelledby={`${label.replace(/\s+/g, "-").toLowerCase()}-${activeIndex}`}
        key={active.src}
      >
        <div className="sustain-variation-note">
          <span>Design decision</span>
          <p>{active.decision}</p>
        </div>
        <figure>
          <Image
            src={active.src}
            alt={active.alt}
            width={active.width}
            height={active.height}
            unoptimized
            sizes="(max-width: 900px) 94vw, 76vw"
          />
        </figure>
      </div>
    </div>
  );
}
