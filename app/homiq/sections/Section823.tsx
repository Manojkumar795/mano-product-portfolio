import { CraftHeading } from "../components/CraftedPanels";

const sequences = [
  { title: "Device setup", screens: [
    ["device-scan-or-nfc", "Scan or NFC"], ["device-light-found", "Light found"], ["device-select-location", "Choose a room"], ["device-name", "Name the light"], ["device-added", "Device added"],
  ] },
  { title: "Scene creation", screens: [
    ["scene-choose", "Choose a scene"], ["scene-name", "Name the routine"], ["scene-select-devices", "Select devices"], ["scene-set-device-states", "Set device states"], ["scene-added", "Scene added"],
  ] },
];

export default function Section823() {
  return <div className="homiq-crafted-section homiq-editorial-section" data-node-id="3:823"><CraftHeading title="Product Sequences"><p>I kept each setup choice explicit, from finding a device or naming a scene to confirming the result.</p></CraftHeading><div className="homiq-sequence-gallery">{sequences.map(sequence => <details className="homiq-editorial-details" key={sequence.title}><summary>{sequence.title} <span>Five original screens</span></summary><section className="homiq-craft-panel homiq-sequence-board" aria-label={`${sequence.title} sequence`}><div className="homiq-product-screens">{sequence.screens.map(([file,label]) => <figure key={file}><a href={`/homiq/screens/${file}.png`} target="_blank" rel="noreferrer" aria-label={`Open ${label.toLowerCase()} sequence screen at full size`}><img src={`/homiq/screens/${file}.png`} width={390} height={844} alt={`HOMIQ ${sequence.title.toLowerCase()}: ${label}`} loading="lazy" decoding="async" /></a><figcaption>{label}</figcaption></figure>)}</div></section></details>)}</div></div>;
}
