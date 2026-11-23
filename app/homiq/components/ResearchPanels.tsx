import { CraftIcon } from "./CraftedPanels";

export function ResearchEvidence() {
  return <section className="homiq-craft-panel homiq-research-evidence" aria-label="Initial product design questions">
    <h3>Start with the core tasks.</h3>
    <div className="homiq-evidence-row"><h4>Find the right device.</h4><p>Can room names and appliance types guide the next step?</p></div>
    <div className="homiq-evidence-row"><h4>Understand the current state.</h4><p>Can someone tell what is on and read its current value?</p></div>
    <div className="homiq-evidence-row"><h4>Recover interrupted setup.</h4><p>Can setup resume without losing the room or device name?</p></div>
    
  </section>;
}

export function RoomContextEvidence() {
  return <figure className="homiq-craft-panel homiq-context-evidence"><figcaption><h3>Find the room. Then adjust one device.</h3><p>An everyday task: identify a room, then read and change a setting.</p></figcaption><div className="homiq-context-screens"><div><img src="/homiq/screens/my-rooms.png" alt="HOMIQ room list, using photographs and distinct room names" width="390" height="844" loading="lazy" /><span>Recognize the room</span></div><CraftIcon name="back" /><div><img src="/homiq/screens/lamp.png" alt="HOMIQ lamp screen with room, power state and 40 percent brightness" width="390" height="844" loading="lazy" /><span>Read and adjust the state</span></div></div></figure>;
}

export function AuditSummary() {
  return <section className="homiq-audit-summary" aria-label="Screen audit at a glance">
    <div><h4>29 screens reviewed.</h4><dl>{[["Entry",6],["Rooms",7],["Setup",5],["Controls",3],["Scenes",5],["Account",3]].map(([label,count]) => <div key={label}><dt>{label}</dt><dd>{count}</dd></div>)}</dl></div>
    <div><h4>Home, Rooms, Profile.</h4><p className="homiq-audit-route">Rooms → appliances → control</p></div>
    <div><h4>Three setup confirmations.</h4><p>Device added, room added, scene added</p></div>
  </section>;
}

export function AffinityDecisions() {
  return <div className="homiq-affinity-decisions">
    <figure className="homiq-craft-panel"><figcaption><h3>Choose the devices. Then their state.</h3><p>Membership and ON / OFF state are separate decisions.</p></figcaption><div className="homiq-scene-pair"><img src="/homiq/screens/scene-select-devices.png" width="390" height="844" alt="HOMIQ device membership selection with checkboxes" loading="lazy" /><img src="/homiq/screens/scene-set-device-states.png" width="390" height="844" alt="HOMIQ desired device states, with explicit ON and OFF switches" loading="lazy" /></div></figure>
    <figure className="homiq-craft-panel"><figcaption><h3>Make the current setting readable.</h3><p>Power text and a numeric value support the visual control.</p></figcaption><div className="homiq-state-proof"><img src="/homiq/screens/lamp.png" width="390" height="844" alt="HOMIQ lamp control with POWER ON and brightness set to 40 percent" loading="lazy" /><div><h4>ON · 40%</h4><p>A person can read both the power state and the current brightness.</p><p>Next check: can they set a precise value without dragging?</p></div></div></figure>
  </div>;
}
