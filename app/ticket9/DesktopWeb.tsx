"use client";

import { useRef, useState, type KeyboardEvent } from "react";

const journey = [
  { id: "search", title: "Discover", width: 1914, height: 965, alt: "Ticket9 desktop search results with date, category, and price filters alongside the list", detail: "Refine the search while keeping the event list in view." },
  { id: "passes", title: "Choose a pass", width: 1903, height: 977, alt: "Design X ticket tiers with prices, entry conditions, and a separate order panel", detail: "Compare tier prices, availability, and entry conditions before adding a ticket." },
  { id: "checkout", title: "Checkout", width: 1899, height: 979, alt: "Ticket9 Safe Checkout with attendee details beside the Design X order summary", detail: "Check the event, ticket, and total while entering attendee details." },
] as const;

const supporting = [
  { id: "home", title: "Web home", width: 1909, height: 982 },
  { id: "featured", title: "Featured events", width: 1910, height: 959 },
  { id: "event", title: "Event details", width: 1912, height: 978 },
  { id: "activities", title: "Activities", width: 1907, height: 951 },
  { id: "rsvp", title: "RSVP events", width: 1145, height: 2047 },
  { id: "create", title: "Organizer creation", width: 1903, height: 962 },
];

export function DesktopWeb() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = journey.length - 1;
    const destinations: Partial<Record<string, number>> = { ArrowLeft: (index + last) % journey.length, ArrowRight: (index + 1) % journey.length, Home: 0, End: last };
    const next = destinations[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <section className="ticket9-web" id="desktop-web" aria-labelledby="ticket9-web-title">
    <div className="homiq-experience-copy">
      <h3 id="ticket9-web-title">A wider view of the booking journey</h3>
      <p>On desktop, Ticket9 keeps search results and filters side by side. During checkout, the order summary stays beside the attendee form so buyers can verify their booking as they enter their details.</p>
    </div>
    <div className="ticket9-web-frame">
      <div className="ticket9-web-tabs" role="tablist" aria-label="Desktop web booking journey">
        {journey.map(({ id, title }, index) => <button key={id} type="button" role="tab" id={`ticket9-web-tab-${id}`} aria-controls={`ticket9-web-panel-${id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
          ref={button => { tabs.current[index] = button; }} onClick={() => setSelected(index)} onKeyDown={event => handleTabKey(event, index)}>{title}</button>)}
      </div>
      {journey.map(({ id, title, width, height, alt, detail }, index) => {
        const src = `/ticket9/web/${id}.webp`;
        return <div key={id} role="tabpanel" id={`ticket9-web-panel-${id}`} aria-labelledby={`ticket9-web-tab-${id}`} hidden={selected !== index}>
          <figure>
            <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${title.toLowerCase()} desktop screen at full size`}>
              <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
            </a>
            <figcaption>{detail}</figcaption>
          </figure>
        </div>;
      })}
    </div>
  </section>;
}

export function WebScreenLibrary() {
  return <details className="homiq-editorial-details ticket9-web-library">
    <summary>Explore more web screens</summary>
    <div>{supporting.map(({ id, title, width, height }) => {
      const src = `/ticket9/web/${id}.webp`;
      return <figure key={id}>
        <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${title.toLowerCase()} at full size`}>
          <img src={src} alt={`Ticket9 desktop ${title.toLowerCase()} screen`} width={width} height={height} loading="lazy" decoding="async" />
        </a>
        <figcaption>{title}</figcaption>
      </figure>;
    })}</div>
  </details>;
}
