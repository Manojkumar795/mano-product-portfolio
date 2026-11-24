export const affinityThemes = [
  { title: "Discovery", tone: "green", observations: ["Home offers city shortcuts.", "Popular Events groups event cards.", "Search results retain the city.", "Date filters include Today and Tomorrow.", "Event types include free, paid and RSVP.", "Coupons occupy a separate destination."], decision: "Keep the active city and date visible." },
  { title: "Event information", tone: "peach", observations: ["The overview shows a date and venue.", "The location view adds a map.", "Organizer identity appears on both screens.", "The booking action remains at the bottom.", "Starting price sits beside the booking action.", "Pass conditions appear after opening booking."], decision: "Expose access rules before commitment." },
  { title: "Pass selection", tone: "blue", observations: ["Single and duo passes are shown.", "Each tier lists its own conditions.", "Selected rows expose quantity controls.", "The pass row identifies its coverage.", "A subtotal follows selection.", "The footer flags fees before checkout itemizes them."], decision: "Pair pass coverage with the running price." },
  { title: "Checkout", tone: "yellow", observations: ["Checkout carries the selected pass and quantity into review.", "Fees and taxes are itemized.", "The form asks for attendee details.", "UPI, cards and net banking are visible.", "The payment screen repeats the payable amount."], decision: "Test showing the full payable cost by pass selection." },
  { title: "Recovery", tone: "pink", observations: ["Phone validation appears inline.", "The support desk accepts a booking ID.", "RSVP Listing shows an update prompt.", "The prompt explains why an update is needed.", "Standard and RSVP setups list different rules.", "Payment interruption is a scenario to validate."], decision: "Preserve context and explain the next action." },
];

const lanes = [
  ["Discovery", "Popular events", "Event search", "Date and type filters", "Event overview", "Venue and organizer"],
  ["Booking", "Pass tiers", "Selected quantity", "Itemized cost", "Attendee details", "Payment methods"],
  ["Account", "Profile", "Support desk", "Create event", "Standard / RSVP setup", "RSVP listing update"],
];
const width = 1400;
const height = 920;
const nodes = [{ id: "home", label: "City recommendations", x: 585, y: 24, width: 230, height: 48, kind: "main" }];
const edges: { source: string; target: string; path: string; arrow: boolean; bidirectional: boolean }[] = [];
lanes.forEach((lane, col) => {
  lane.forEach((label, row) => {
    const id = `${col}-${row}`;
    const x = 110 + 475 * col;
    const y = 142 + 126 * row;
    const cx = x + 115;
    nodes.push({ id, label, x, y, width: 230, height: 48, kind: row === 0 ? "main" : row === 5 ? "done" : "screen" });
    // Account is a menu with alternative destinations. The organizer setup is its own branch.
    const sourceRow = col === 2 && row <= 3 ? 0 : row - 1;
    const fromY = row === 0 ? 72 : 190 + 126 * sourceRow;
    const lateral = col === 2 && row > 1 && row <= 3;
    const path = row === 0 ? `M700 72V106H${cx}V${y}`
      : lateral ? `M${cx + 115} ${fromY - 24}H${cx + 166}V${y + 24}H${cx + 115}` : `M${cx} ${fromY}V${y}`;
    if (col !== 2 || row !== 5) edges.push({ source: row === 0 ? "home" : `${col}-${sourceRow}`, target: id, path, arrow: true, bidirectional: false });
  });
});
edges.push({source:"2-0",target:"2-5",path:"M1060 166H1014V796H1060",arrow:true,bidirectional:false});
edges.push({source:"0-4",target:"1-1",path:"M340 670H455V292H585",arrow:true,bidirectional:false});
export const ticket9Flow = { width, height, nodes, edges, rails: [] };
