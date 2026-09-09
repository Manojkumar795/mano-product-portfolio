"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./ProfitPlus.module.css";

const variants = [
  {
    id: "structure",
    title: "Structure-first",
    summary: "Keep the workflow tree permanently visible.",
    src: "/profit-plus/evolution/final-structure-first.png",
    alt: "Profit Plus final structure-first variation with section editor and persistent workflow tree",
    decision:
      "This made reuse and hierarchy easy to inspect, but the tree repeated information already present in the section list and compressed the property workspace.",
    outcome:
      "Retain the full tree for audit and dependency review, but move it behind contextual inspection during everyday authoring.",
  },
  {
    id: "balanced",
    title: "Balanced authoring",
    summary: "Give inventory, canvas and properties equal weight.",
    src: "/profit-plus/evolution/final-balanced-workspace.png",
    alt: "Profit Plus final balanced authoring variation with section inventory, layout and properties",
    decision:
      "This established the right three-pane model and brought preview into the same task, but purple navigation, green actions and multiple section accents competed for attention.",
    outcome:
      "Keep the continuous selection-to-preview task, then reduce decorative colour and strengthen semantic colour roles.",
  },
  {
    id: "selected",
    title: "Reduced-colour system",
    summary: "Reserve colour for navigation, action and state.",
    src: "/profit-plus/evolution/final-reduced-colour.png",
    alt: "Selected Profit Plus configuration studio with reduced colour and a clear three-pane workspace",
    decision:
      "The selected direction keeps the same powerful workspace while making the hierarchy calmer: blue communicates location, green communicates action or success, and local accents identify sections only.",
    outcome:
      "Move forward with this direction and validate the remaining density with real configuration tasks before release.",
  },
] as const;

export default function EvolutionExplorer() {
  const [activeId, setActiveId] = useState<(typeof variants)[number]["id"]>("selected");
  const active = variants.find((variant) => variant.id === activeId) ?? variants[2];

  return (
    <div className={styles.explorer} data-profit-reveal>
      <div className={styles.explorerTabs} role="tablist" aria-label="Final design variations">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            role="tab"
            aria-selected={active.id === variant.id}
            aria-controls="profit-final-variant"
            className={active.id === variant.id ? styles.activeTab : ""}
            onClick={() => setActiveId(variant.id)}
          >
            <strong>{variant.title}</strong>
            <span>{variant.summary}</span>
          </button>
        ))}
      </div>

      <div className={styles.explorerPanel} id="profit-final-variant" role="tabpanel">
        <div className={styles.explorerImage}>
          <Image
            key={active.src}
            src={active.src}
            alt={active.alt}
            width={1470}
            height={766}
            unoptimized
            sizes="(max-width: 900px) 94vw, 1320px"
          />
        </div>
        <div className={styles.explorerDecision}>
          <div className={styles.decisionTitle}>
            <p className={styles.eyebrow}>Design decision</p>
            <h3>{active.title}</h3>
          </div>
          <div className={styles.decisionRationale}>
            <strong>Rationale</strong>
            <p>{active.decision}</p>
          </div>
          <div className={styles.decisionOutcome}>
            <strong>Why this direction</strong>
            <p>{active.outcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
