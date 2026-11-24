const wireframes = [
  ["home", "City discovery"],
  ["search", "Event search"],
  ["filters", "Date and event filters"],
  ["event", "Event details"],
  ["passes", "Pass selection"],
  ["cost", "Cost review"],
  ["attendee", "Attendee details"],
  ["payment", "Payment methods"],
  ["support", "Booking support"],
] as const;

const sketchBoard = "/ticket9/fidelity/booking-sketch-board.webp";

export function TicketSketchBoard() {
  return <figure className="homiq-craft-panel homiq-rough-board">
    <a href={sketchBoard} target="_blank" rel="noreferrer" aria-label="Open the Ticket9 sketch board at full size">
      <img src={sketchBoard} width={1536} height={1024} alt="Ten pen-style sketches on one page show city discovery, search, event details, pass selection, price review, attendee details, phone number correction, payment, booking lookup, and organizer RSVP setup." loading="lazy" decoding="async" />
    </a>
  </figure>;
}

function WireframeImage({ screen, label }: { screen: string; label: string }) {
  const src = `/ticket9/fidelity/${screen}.svg`;
  return <a href={src} target="_blank" rel="noreferrer" aria-label={`Open the ${label.toLowerCase()} wireframe at full size`}>
    <img src={src} width={390} height={844} alt={`Ticket9 wireframe for ${label.toLowerCase()}`} loading="lazy" decoding="async" />
  </a>;
}

export function TicketWireframeGallery() {
  return <div className="homiq-mid-gallery">
    {[wireframes.slice(0, 3), wireframes.slice(3, 6)].map(board => <div className="homiq-mid-board" key={board[0][0]}>
      {board.map(([screen, label]) => <figure key={screen}><WireframeImage screen={screen} label={label} /><figcaption>{label}</figcaption></figure>)}
    </div>)}
    <figure className="homiq-mid-library ticket9-wireframe-matrix">
      <figcaption>Wireframe library</figcaption>
      <div>{wireframes.map(([screen, label]) => <WireframeImage key={screen} screen={screen} label={label} />)}</div>
    </figure>
  </div>;
}
