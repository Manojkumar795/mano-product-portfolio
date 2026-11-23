import type { ReactNode } from "react";

type IconName = "home" | "rooms" | "profile" | "light" | "power" | "action" | "lock" | "mail" | "check" | "plus" | "minus" | "back";
const iconPaths: Record<IconName, string> = {
  home: "M3 10.5 12 3l9 7.5M5.5 9v11h5v-6h3v6h5V9",
  rooms: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  profile: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  light: "M9 18h6M10 21h4M8 14c-5-5-1-11 4-11s9 6 4 11l-1 2H9l-1-2Z",
  power: "M12 2v9M6 5a9 9 0 1 0 12 0",
  action: "M5 4v16M12 4v16M19 4v16M2 8h6M9 16h6M16 10h6",
  lock: "M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 15v2",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  check: "m5 12 4 4L19 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  back: "m14 5-7 7 7 7M7 12h14",
};
export function CraftIcon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name]} /></svg>;
}
export function CraftHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="homiq-craft-section-heading"><h2>{title}</h2><div className="homiq-craft-rule" />{children && <div className="homiq-craft-intro">{children}</div>}</div>;
}
function OriginalScreen({ name, alt }: { name: string; alt: string }) {
  return <img loading="lazy" decoding="async" src={`/homiq/screens/${name}.png`} width={390} height={844} alt={alt} />;
}

export { NavigationArchitecture } from "./InformationArchitecture";

export function AccountAndSceneNotes() {
  return <div className="homiq-account-scene-grid">
    <figure className="homiq-craft-panel homiq-scene-note"><figcaption><h3>Naming a scene</h3><p>A recognizable name comes before device membership and desired states. Choosing a device and turning it on are separate decisions.</p></figcaption><div className="homiq-scene-screen"><OriginalScreen name="scene-name" alt="HOMIQ scene naming screen, before selecting devices and desired states" /></div></figure>
    <section className="homiq-craft-panel homiq-account-note" aria-label="Account behavior and validation">
      <h3>Account & recovery</h3><p>Make editable details clear, and help people recover access without losing context.</p>
      <div className="homiq-account-detail"><CraftIcon name="lock" /><div><h4>Profile details</h4><p>The name is editable; the email is locked. Explain that limit and how to get help when an address changes.</p></div></div>
      <div className="homiq-account-detail"><CraftIcon name="mail" /><div><h4>Password recovery</h4><p>Recover access with an email code, then choose a new password.</p><ol className="homiq-account-steps"><li>Email</li><li>Code</li><li>New password</li></ol><p>Next, test expired codes, resend behavior and errors at each step.</p></div></div>
    </section>
  </div>;
}

export function ContextPattern() {
  const steps = [
    { icon: "home" as const, label: "Room", value: "Living room", explanation: "Start with a familiar place." },
    { icon: "light" as const, label: "Device", value: "Bedroom light", explanation: "Identify the right appliance." },
    { icon: "power" as const, label: "State", value: "On · 40%", explanation: "Read what is happening now." },
    { icon: "action" as const, label: "Action", value: "Adjust brightness", explanation: "Make one clear change." },
  ];
  return <figure className="homiq-craft-panel homiq-context-pattern"><figcaption className="homiq-craft-panel-heading"><h3>A shared control pattern</h3><p>Four pieces of information make the next action easier to understand.</p></figcaption><ol>{steps.map((step) => <li key={step.label}><div className="homiq-pattern-icon"><CraftIcon name={step.icon} /></div><span className="homiq-craft-eyebrow">{step.label}</span><h4>{step.value}</h4><p>{step.explanation}</p></li>)}</ol></figure>;
}

export function TaskStructureBoard() {
  return <figure className="homiq-craft-panel homiq-rough-board"><a href="/homiq/fidelity/rough-exploration-v4.png" target="_blank" rel="noreferrer" aria-label="Open the rough HOMIQ sketches at full size"><img src="/homiq/fidelity/rough-exploration-v4.png" width={1536} height={1024} alt="Nine hand-drawn HOMIQ wireframes for Home, Rooms, Living Room, light and AC controls, device setup, room assignment and scene setup, with black pen sketches and blue annotations." loading="lazy" decoding="async" /></a></figure>;
}
