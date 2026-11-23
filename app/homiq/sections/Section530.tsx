import { CraftHeading, NavigationArchitecture } from "../components/CraftedPanels";

const conceptCallouts = [
  {title:"Room-based control", detail:"Find the room, then the device", x:42, y:4, width:222, targetX:312, targetY:290},
  {title:"Air conditioner · ON", detail:"24°C with swing control", x:350, y:4, width:205, targetX:574, targetY:164},
  {title:"Goodnight scene", detail:"Bedroom lights OFF", x:720, y:4, width:230, targetX:741, targetY:184},
  {title:"Living room lamp", detail:"ON · 40% brightness", x:40, y:405, width:220, targetX:197, targetY:243},
  {title:"Television · OFF", detail:"A clear, readable power state", x:390, y:405, width:230, targetX:565, targetY:263},
  {title:"Evening reading", detail:"Warm task light ON", x:746, y:405, width:215, targetX:736, targetY:310},
];

const goals = [
  "Help people recognize a room and find its connected devices.",
  "Keep everyday controls close, with power and current values easy to read.",
  "Guide device setup through discovery, room selection and naming.",
  "Separate the devices in a scene from the states they should change to.",
  "Retain setup details and give a clear next step when a connection is interrupted.",
];

export default function Section530() {
  return <div className="homiq-crafted-section homiq-solution-story">
    <span className="homiq-solution-eyebrow">{"\u00a0"}</span>
    <CraftHeading title="Developing a Solution">
      <p><strong>Rather than showing every device and setting at once, I prioritized frequent actions.</strong> Rooms lead to direct controls, while discovery, device naming and scene configuration follow separate guided steps.</p>
    </CraftHeading>
    <figure className="homiq-solution-visual homiq-concept-visual" aria-label="Illustrative HOMIQ concept with room-based control, an AC at 24°C, a lamp at 40%, a powered-off TV, dark sleeping space and warm reading light">
      <div className="homiq-concept-image">
        <img src="/homiq/editorial/solution-home-evening-v2.png" width={1860} height={845} alt="Watercolor cutaway home: a warm living room with phone control and AC, a dark moonlit bedroom with bedside lamps off, and an evening reader under an amber desk lamp." loading="lazy" decoding="async" />
        <svg className="homiq-concept-callouts" viewBox="0 0 1000 455" fill="none" aria-hidden="true">
          {conceptCallouts.map((item,index) => <g key={item.title}>
            <g className="homiq-concept-desktop-label"><path d={`M${item.x+item.width/2} ${item.y<100?item.y+48:item.y}L${item.targetX} ${item.targetY}`} /><rect x={item.x} y={item.y} width={item.width} height="48" /><text x={item.x+item.width/2} y={item.y+19} textAnchor="middle">{item.title}</text><text className="homiq-concept-detail" x={item.x+item.width/2} y={item.y+36} textAnchor="middle">{item.detail}</text></g>
            <circle className="homiq-concept-dot" cx={item.targetX} cy={item.targetY} r="3.5" />
            <g className="homiq-concept-mobile-marker"><circle cx={item.targetX} cy={item.targetY} r="15"/><text x={item.targetX} y={item.targetY} dominantBaseline="central" textAnchor="middle">{index+1}</text></g>
          </g>)}
        </svg>
      </div>
      <figcaption className="homiq-concept-legend"><ol>{conceptCallouts.map((item,index)=><li key={item.title}><span>{index+1}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></li>)}</ol></figcaption>
    </figure>
    <div className="homiq-solution-goals"><h3>Design goals</h3><ol>{goals.map(goal => <li key={goal}>{goal}</li>)}</ol></div>
    <NavigationArchitecture />
  </div>;
}
