const coral = "#dc4c43";
const ink = "#505a63";
const line = "#d9dddf";

function DeviceQuestion() {
  return <svg viewBox="0 0 280 220" fill="none" aria-hidden="true">
    <rect x="19" y="17" width="242" height="186" rx="6" fill="#f5f6f6" />
    <text x="37" y="46" fill={ink} fontSize="14">Rooms</text>
    <path d="M37 59h206" stroke={line} />
    <rect x="37" y="76" width="94" height="88" rx="3" fill="#e5e8e8" />
    <path d="m38 77 92 86m0-86-92 86" stroke="#c5cccd" />
    <rect x="143" y="76" width="100" height="36" rx="3" fill="white" stroke={line} />
    <text x="155" y="99" fill={ink} fontSize="12">Living room</text>
    <rect x="143" y="128" width="100" height="36" rx="3" fill="white" stroke={line} />
    <text x="155" y="151" fill={ink} fontSize="12">Bedroom</text>
    <path d="M84 179h111" stroke="#c5cccd" strokeWidth="3" strokeLinecap="round" />
    <rect x="137" y="70" width="112" height="100" rx="6" stroke={coral} strokeWidth="1.5" />
    <circle cx="250" cy="62" r="12" fill="white" stroke={coral} strokeWidth="1.5" />
    <text x="250" y="67" fill={coral} fontSize="16" textAnchor="middle">?</text>
  </svg>;
}

function StateQuestion() {
  return <svg viewBox="0 0 280 220" fill="none" aria-hidden="true">
    <rect x="19" y="17" width="242" height="186" rx="6" fill="#f5f6f6" />
    <text x="37" y="46" fill={ink} fontSize="14">Living room · Lamp</text>
    <path d="M37 59h206" stroke={line} />
    <path d="m122 77-18 39h72l-18-39h-36Zm18 39v23m-20 0h40" stroke="#8c969a" strokeWidth="2" strokeLinejoin="round" />
    <rect x="36" y="156" width="208" height="32" rx="4" fill="white" />
    <circle cx="53" cy="172" r="3" fill="#929b9f" />
    <text x="66" y="177" fill={ink} fontSize="13">ON</text>
    <path d="M103 172h76" stroke="#d9dddf" strokeWidth="4" strokeLinecap="round" />
    <path d="M103 172h31" stroke="#929b9f" strokeWidth="4" strokeLinecap="round" />
    <circle cx="134" cy="172" r="5" fill="#929b9f" />
    <text x="195" y="177" fill={ink} fontSize="14">40%</text>
    <rect x="31" y="151" width="218" height="42" rx="6" stroke={coral} strokeWidth="1.5" />
    <path d="M231 141v-12" stroke={coral} strokeWidth="1.5" />
    <circle cx="231" cy="117" r="12" fill="white" stroke={coral} strokeWidth="1.5" />
    <text x="231" y="122" fill={coral} fontSize="16" textAnchor="middle">?</text>
  </svg>;
}

function SetupQuestion() {
  return <svg viewBox="0 0 280 220" fill="none" aria-hidden="true">
    <rect x="19" y="17" width="242" height="186" rx="6" fill="#f5f6f6" />
    <text x="37" y="46" fill={ink} fontSize="14">Add a light</text>
    <path d="M37 59h206" stroke={line} />
    <path d="M39 81h58m8 0h58m8 0h70" stroke="#d9dddf" strokeWidth="3" />
    <path d="M39 81h58m8 0h58" stroke="#929b9f" strokeWidth="3" />
    <text x="39" y="111" fill="#899297" fontSize="11">Room</text>
    <text x="39" y="131" fill={ink} fontSize="13">Living room</text>
    <path d="M39 140h143" stroke={line} />
    <text x="39" y="160" fill="#899297" fontSize="11">Device name</text>
    <text x="39" y="180" fill={ink} fontSize="13">Bedroom light</text>
    <path d="M39 189h143" stroke={line} />
    <rect x="32" y="94" width="158" height="103" rx="6" stroke={coral} strokeWidth="1.5" />
    <path d="M190 145h14" stroke={coral} strokeWidth="1.5" />
    <circle cx="223" cy="145" r="17" fill="white" stroke={coral} strokeWidth="1.5" />
    <path d="M219 138v14m8-14v14" stroke={coral} strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

export default function DiscoveryQuestions() {
  return <figure className="homiq-discovery-board" aria-label="Three initial design questions for HOMIQ">
    <div><DeviceQuestion /><h3>Where is my device?</h3></div>
    <div><StateQuestion /><h3>What is happening now?</h3></div>
    <div><SetupQuestion /><h3>What if setup stops?</h3></div>
  </figure>;
}
