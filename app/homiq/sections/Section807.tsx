import { CraftHeading } from "../components/CraftedPanels";
import { SystemStyleguide, SystemMeasurements } from "../components/SystemStyleguide";

const components = [
  ["Home header", "Home identity and page title."],
  ["Add action", "Entry point for device setup."],
  ["Device categories", "Type, icon and active count."],
  ["Scene shortcuts", "Named routines with a visible state."],
  ["Device rows", "Appliance identity and device count."],
  ["Power state", "ON / OFF, communicated in words."],
  ["Bottom navigation", "Home, Rooms and Profile."],
];
// Coordinates are anchored to the unchanged 390 × 844 Home screen.
const targets = [
  {side:"left",x:18,y:185}, {side:"right",x:373,y:99},
  {side:"left",x:18,y:298}, {side:"right",x:372,y:398},
  {side:"left",x:18,y:510}, {side:"right",x:372,y:555},
  {side:"left",x:57,y:758},
];
const screenGroups = [
  ["Entry & account", ["welcome","sign-in","create-account","recover-password","verify-code","change-password"]],
  ["Home & rooms", ["my-home","my-rooms","room-name","room-choose-photo","room-select-devices","room-added","room-appliances"]],
  ["Device setup", ["device-scan-or-nfc","device-light-found","device-select-location","device-name","device-added"]],
  ["Controls & scenes", ["air-conditioner","lamp","tv-remote","scene-choose","scene-name","scene-select-devices","scene-set-device-states","scene-added"]],
  ["Profile", ["profile","profile-details","push-notifications"]],
] as const;

export default function Section807() {
  return <div className="homiq-crafted-section" data-node-id="3:807">
    <CraftHeading title="Design System" />
    <div className="homiq-system-showcase">
      <div className="homiq-kit-left">
        <figure className="homiq-kit-card homiq-kit-anatomy">
          <figcaption><h3>Interface anatomy</h3></figcaption>
          <div className="homiq-kit-anatomy-grid">
            <ol>{components.map(([title,text],index) => <li key={title}><span>{index+1}</span><div><h4>{title}</h4><p>{text}</p></div></li>)}</ol>
            <svg viewBox="0 0 600 924" role="img" aria-label="Original HOMIQ Home screen with seven numbered component callouts">
              <image href="/homiq/screens/my-home.png" x="105" y="40" width="390" height="844" />
              {targets.map((target,index) => {
                const endX=105+target.x; const y=40+target.y; const labelX=target.side==="left"?35:565;
                return <g key={components[index][0]}><path d={`M${labelX+(target.side==="left"?15:-15)} ${y}H${endX}`} /><circle cx={labelX} cy={y} r="15" /><text x={labelX} y={y} dominantBaseline="central" textAnchor="middle">{index+1}</text></g>;
              })}
            </svg>
          </div>
        </figure>
        <figure className="homiq-kit-card homiq-kit-inventory">
          <figcaption><h3>UI specifications</h3><p>29 original screens · 390 × 844 px</p></figcaption>
          <div className="homiq-kit-screen-groups">{screenGroups.map(([title,files]) => <div key={title}><h4>{title}</h4><div>{files.map(file => <a key={file} href={`/homiq/screens/${file}.png`} target="_blank" rel="noreferrer" aria-label={`Open original ${file.replaceAll("-"," ")} screen`}><img src={`/homiq/screens/${file}.png`} loading="lazy" decoding="async" alt="" width="390" height="844" /></a>)}</div></div>)}</div>
        </figure>
      </div>
      <div className="homiq-kit-right">
        <SystemStyleguide />
        <SystemMeasurements />
      </div>
    </div>
  </div>;
}
