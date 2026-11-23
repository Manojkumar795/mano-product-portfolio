import { CraftHeading } from "../components/CraftedPanels";

const stages = [
  ["Discover", "Scan a code or hold the phone near the light."],
  ["Locate", "Choose the room where the light belongs."],
  ["Name", "Give the light a name that is easy to recognize."],
  ["Confirm", "See the named light and its room, ready to control."],
];

export default function Section470() {
  return <div className="homiq-crafted-section homiq-journey" data-node-id="3:470">
    <CraftHeading title="User Journey"><p>I traced a household organizer’s path from finding a new light to controlling it. <strong>Room selection is the key decision:</strong> the chosen location stays with the light through naming and confirmation.</p></CraftHeading>
    <div className="homiq-journey-persona">
      <div className="homiq-journey-avatar"><img loading="lazy" decoding="async" src="/homiq/artifacts/470-imgImage.svg" alt="" /></div>
      <div><h3>Household organizer</h3><p>Add a bedroom light and make it ready to control.</p></div>
    </div>
    <div className="homiq-journey-flow">
      <ol>{stages.map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
      <svg viewBox="0 0 1004 188" role="img" aria-label="Four setup stages connected in order: Discover, Locate, Name and Confirm. The line shows the journey, not measured emotion or performance.">
        <path d="M22 112 C62 30 94 25 125 38 S218 160 295 119 S355 72 377 85 S472 174 526 150 S593 111 627 121 S729 182 772 146 S852 84 878 99 S951 155 982 156" />
        {[{x:125,y:38},{x:377,y:85},{x:627,y:121},{x:878,y:99}].map(({x,y}) => <circle key={x} cx={x} cy={y} r="9" />)}
      </svg>
    </div>
  </div>;
}
