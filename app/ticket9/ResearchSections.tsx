import { CompetitorComparison } from "../homiq/components/CompetitorComparison";

const questions = [
  { title: "What’s on near me?", header: "Explore events", lines: ["Bengaluru                 ▾", "This weekend             ▾", "Live music in Bengaluru"], first: 0, last: 1 },
  { title: "What does my pass include?", header: "Choose a pass", lines: ["Single pass · admits one", "Duo pass · admits two", "Quantity         −   1   +"], first: 1, last: 2 },
  { title: "What will I actually pay?", header: "Booking summary", lines: ["Pass subtotal", "Taxes and booking fee", "Total payable"], first: 1, last: 2 },
];

export function TicketDiscoveryBoard() {
  return <figure className="homiq-discovery-board" aria-label="Three initial questions about finding and booking a Ticket9 event">
    {questions.map(({ title, header, lines, first, last }) => <div key={title}>
      <svg viewBox="0 0 280 220" fill="none" aria-hidden="true">
        <rect x="19" y="17" width="242" height="186" rx="6" fill="#f5f6f6" />
        <text x="37" y="46" fill="#505a63" fontSize="14">{header}</text>
        <path d="M37 59h206" stroke="#d9dddf" />
        {lines.map((line, index) => <g key={line}>
          <rect x="37" y={75 + index * 37} width="206" height="30" rx="4" fill="white" stroke="#d9dddf" />
          <text x="49" y={94 + index * 37} fill="#505a63" fontSize="13">{line}</text>
        </g>)}
        <rect x="32" y={70 + first * 37} width="216" height={40 + (last - first) * 37} rx="6" stroke="#dc4c43" strokeWidth="1.5" />
        <circle cx="247" cy={67 + first * 37} r="11" fill="white" stroke="#dc4c43" strokeWidth="1.5" />
        <text x="247" y={72 + first * 37} fill="#dc4c43" fontSize="15" textAnchor="middle">?</text>
      </svg>
      <h3>{title}</h3>
    </div>)}
  </figure>;
}

const researchColumns = [
  {
    title: "Booking decisions",
    items: ["City shortcuts and date filters narrow the event list.", "Event details show the venue, organizer and starting price.", "Pass selection introduces tier rules and quantity.", "Checkout itemizes the charges before payment."],
  },
  {
    title: "Ticket9 design implications",
    items: ["Keep the active city visible during search.", "Place the date and venue close to the booking action.", "Put pass coverage and quantity in the same view.", "Test showing the full price while choosing a pass."],
  },
];
const priorities = [
  { title: "Find", label: "Keep the city and date visible while exploring." },
  { title: "Choose", label: "Show who the pass admits and what it includes." },
  { title: "Pay", label: "Make the full cost clear before selecting a payment method." },
];

export function TicketResearch() {
  return <>
    <div className="ticket9-research-columns">{researchColumns.map(({ title, items }) => <section key={title}>
      <h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </section>)}</div>
    <div className="ticket9-research-circles">{priorities.map(({ title, label }) => <div key={title}><strong>{title}</strong><p>{label}</p></div>)}</div>
  </>;
}

const competitors = [
  { name: "BookMyShow", image: "bookmyshow.webp", alt: "Official BookMyShow iPhone preview showing entertainment and ticket discovery", source: "https://apps.apple.com/in/app/bookmyshow-movies-events/id405894842", takeaway: "Groups movies, live events and sports in one ticketing catalogue.", className: "ticket9-competitor-preview" },
  { name: "District", image: "district.webp", alt: "Official District iPhone preview showing its live events experience", source: "https://apps.apple.com/in/app/district-movies-events-dining/id6670536058", takeaway: "Makes live events part of a wider city experience that includes movies and dining.", className: "ticket9-competitor-preview" },
  { name: "Eventbrite", image: "eventbrite.webp", alt: "Official Eventbrite iPhone preview showing local event discovery", source: "https://apps.apple.com/us/app/eventbrite/id487922291", takeaway: "Combines a Discover feed with search and filters, then keeps booked tickets in a dedicated tab.", className: "ticket9-competitor-preview" },
];

export function TicketCompetitors() {
  return <div className="ticket9-competitor-board"><CompetitorComparison entries={competitors} imageBase="/ticket9/competitors" /></div>;
}
