import { CraftHeading, CraftIcon } from "../components/CraftedPanels";

export default function Section774() {
  return <div className="homiq-crafted-section homiq-editorial-section" data-node-id="3:774">
    <CraftHeading title="Recovery States" />
    <figure className="homiq-craft-panel homiq-feedback-board homiq-feedback-simple" aria-label="Proposed connection feedback: connecting, connection lost with retry, and connected">
      <div className="homiq-feedback-grid">
        <div className="homiq-feedback-item"><div className="homiq-feedback-label"><span className="homiq-feedback-pending" aria-hidden="true" /><h3>Connecting</h3></div><p>Keep your light on and nearby.</p></div>
        <div className="homiq-feedback-item"><div className="homiq-feedback-label"><span className="homiq-feedback-warning" aria-hidden="true">!</span><h3>Connection lost</h3></div><p>Check the light is on.</p><span className="homiq-feedback-retry">Try again</span></div>
        <div className="homiq-feedback-item"><div className="homiq-feedback-label"><span className="homiq-feedback-success"><CraftIcon name="check" /></span><h3>Connected</h3></div><p>Bedroom light is ready.</p></div>
      </div>
    </figure>
    <p className="homiq-reasoning-note">I separated progress, retry and confirmation so the next step stays clear. Room and device name stay saved.</p>
  </div>;
}
