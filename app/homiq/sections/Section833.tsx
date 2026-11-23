import { CraftHeading } from "../components/CraftedPanels";
import StoreConcept from "../components/StoreConcept";
const productOutcomes = [
  "Brought room navigation, device controls, and daily routines into one experience.",
  "Simplified three key interactions: finding devices, adjusting controls, and managing routines.",
  "Added clear feedback for connected, loading, offline, and failed device actions.",
  "Made everyday controls easier to find without removing advanced settings.",
];
const productDevelopment = [
  "Completed the main mobile screens and three core user journeys.",
  "Refined key interactions through before-and-after design comparisons.",
  "Built a reusable design system for navigation, device controls, and feedback.",
  "Prepared high-fidelity screens, interaction states, and recovery flows for development.",
];
const evaluation = [
  ["Task efficiency", "Device control: 15s median to 10s median, 33.3% faster."],
  ["Discoverability", "Device discovery: 15/20 (75%) to 18/20 (90%), an increase of 15 percentage points."],
  ["Routine creation", "13/20 (65%) to 16/20 (80%), an increase of 15 percentage points."],
  ["Interaction clarity", "Climate, lighting and TV controls each show room context, written power state and a current value."],
  ["Recovery effectiveness", "The three states make waiting, retry and completion explicit. Interrupted pairing would test whether setup details survive."],
];
export default function Section833() {
  return <div className="homiq-crafted-section homiq-editorial-section homiq-success" data-node-id="3:833">
    <CraftHeading title="Product Outcomes" />
    <div className="homiq-success-intro">
      <section className="homiq-product-outcomes" aria-label="HOMIQ product outcomes and development">
        <ul className="homiq-outcome-checks">{productOutcomes.map(text => <li key={text}>{text}</li>)}</ul>
        <h3>Product Development</h3><ul className="homiq-outcome-checks">{productDevelopment.map(text => <li key={text}>{text}</li>)}</ul>
      </section>
      <div className="homiq-store-desktop"><StoreConcept /></div>
      <details className="homiq-editorial-details homiq-store-mobile"><summary>App Store presentation concept</summary><StoreConcept /></details>
    </div>
    <details className="homiq-editorial-details homiq-testing-results" data-evidence="illustrative">
      <summary>User-testing results</summary>
      <p className="homiq-evidence-note">Illustrative comparisons only. These figures are not measured HOMIQ user-testing results.</p>
      <dl>{evaluation.map(([area, outcome]) => <div key={area}><dt>{area}</dt><dd>{outcome}</dd></div>)}</dl>
    </details>
  </div>;
}
