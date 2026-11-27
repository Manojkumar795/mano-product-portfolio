import ScreenshotTrigger from "../../ScreenshotTrigger";
import { CraftHeading } from "../components/CraftedPanels";

const comparisons = [
  { id: "discovery", title: "Control hierarchy", before: "discovery-before", after: "device-scan-or-nfc", alt: "Device discovery",
    description: "The scan sheet covered Home. I separated discovery into its own view, with QR and NFC guidance and an explicit Continue action. This leaves the Home context during setup, but protects the space for everyday controls." },
  { id: "rooms", title: "Navigation structure", before: "rooms-before", after: "my-rooms", alt: "Room navigation",
    description: "The earlier cards repeated Living Room and the same count. I kept the room structure, but gave each space a distinct name and photo. Shared devices can make room grouping ambiguous, so category access stays on Home." },
  { id: "climate", title: "Visual richness vs clarity", before: "climate-before", after: "air-conditioner", alt: "Air-conditioner control",
    description: "Power and swing relied on symbols, even though the temperature value was already prominent. I chose a dial with clear state, range and direction labels. This gives feedback more space, while exact adjustments still need an alternative to dragging." },
];

export default function Section733() {
  return <div className="homiq-crafted-section homiq-editorial-section homiq-decisions" data-node-id="3:733">
    <CraftHeading title="Interaction Decisions" />
    <nav className="homiq-mobile-chapters" aria-label="Design decisions"><a href="#decision-discovery">Control</a><a href="#decision-rooms">Navigation</a><a href="#decision-climate">Clarity</a></nav>
    <div className="homiq-decision-list" role="region" tabIndex={0} aria-label="Three design decisions, scroll horizontally on a small screen">{comparisons.map((review, index) => <section key={review.id} id={`decision-${review.id}`} data-comparison={review.id} aria-label={review.title}>
      <div className="homiq-decision-copy"><span className="homiq-editorial-kicker">{"\u00a0"}</span><h3>{review.title}</h3><p>{review.description}</p></div>
      <div className="homiq-comparison-pair"><figure><ScreenshotTrigger src={"/homiq/earlier/" + review.before + ".png"} aria-label={"Open earlier " + review.alt.toLowerCase() + " screen"}><img src={"/homiq/earlier/" + review.before + ".png"} width={390} height={844} alt={"Before: " + review.alt} loading="lazy" decoding="async" /></ScreenshotTrigger><figcaption>Before</figcaption></figure><span className="homiq-comparison-arrow" aria-hidden="true">→</span><figure><ScreenshotTrigger src={"/homiq/screens/" + review.after + ".png"} aria-label={"Open current " + review.alt.toLowerCase() + " screen"}><img src={"/homiq/screens/" + review.after + ".png"} width={390} height={844} alt={"After: " + review.alt} loading="lazy" decoding="async" /></ScreenshotTrigger><figcaption>After</figcaption></figure></div>
    </section>)}</div>
  </div>;
}
