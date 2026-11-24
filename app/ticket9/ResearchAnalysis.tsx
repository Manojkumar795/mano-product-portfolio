const benchmarkColumns = ["BookMyShow", "District", "Eventbrite", "Ticket9 opportunity"];

const benchmark = [
  {
    task: "Find a plan for this weekend",
    observations: [
      ["City event lists and a weekend filter support a date-led search.", "https://in.bookmyshow.com/explore/music-performing-arts-this-weekend-bengaluru"],
      ["A Bengaluru weekend collection displays date, venue and starting price together.", "https://www.district.in/events/events-this-weekend-in-bengaluru"],
      ["Discover and Search support date, category, price and event-type filters.", "https://support.eventbrite.com/hc/en-us/articles/34823063209362-Using-the-Eventbrite-app"],
      ["Keep the active city and date visible when the attendee returns to results.", ""],
    ],
  },
  {
    task: "Decide which pass to buy",
    observations: [
      ["The events catalogue supports sorting by venue, date or price. Pass comparison was outside this review.", "https://in.bookmyshow.com/explore/concerts-today-bengaluru"],
      ["The weekend collection distinguishes free, fixed-price and ‘onwards’ listings. The payable total needs a separate checkout check.", "https://www.district.in/events/events-this-weekend-in-bengaluru"],
      ["Organizers may absorb ticketing fees or pass them to attendees. The fee policy is documented, and display timing needs a separate check.", "https://www.eventbrite.com/help/en-us/articles/755615/how-much-does-it-cost-for-organizers-to-use-eventbrite/"],
      ["Show who the pass admits and the full group cost alongside quantity.", ""],
    ],
  },
  {
    task: "Find the ticket at the venue",
    observations: [
      ["For M-Ticket events, Your Orders provides the booking and entry QR codes.", "https://support.bookmyshow.com/support/solutions/articles/4000228194-information-on-m-ticket"],
      ["An official event guide directs attendees to Profile → Event Tickets. QR availability can depend on the event.", "https://cdn.district.in/events/cd-media/image/upload/c_crop%2Cg_custom/v1776145325/agxx1yr3amltcnw1gtej.pdf"],
      ["The Tickets tab provides the entry QR, event details and a wallet option.", "https://support.eventbrite.com/hc/en-us/articles/34823063209362-Using-the-Eventbrite-app"],
      ["Prototype a direct path from confirmation to the ticket. Validate ticket retrieval as a follow-up.", ""],
    ],
  },
];

export function TicketBenchmark() {
  return <div className="homiq-craft-panel ticket9-benchmark">
    <h3>Compare the same three attendee tasks</h3>
    <p>Desk review of public event listings and official support material. The comparison covers visible patterns, documented behavior and implications for Ticket9.</p>
    <table aria-label="Competitor task comparison">
      <thead><tr><th scope="col">Attendee task</th>{benchmarkColumns.map(name => <th key={name} scope="col">{name}</th>)}</tr></thead>
      <tbody>{benchmark.map(({ task, observations }) => <tr key={task}><th scope="row">{task}</th>
        {observations.map(([observation, url], index) => <td key={benchmarkColumns[index]}><span className="ticket9-benchmark-mobile">{benchmarkColumns[index]}</span>{observation}
          {url && <a href={url} target="_blank" rel="noreferrer">Source<span className="ticket9-visually-hidden"> for {benchmarkColumns[index]}: {task}</span></a>}
        </td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}

const price = { base: 1798, tax: 323.64, fee: 116.48 };
const total = price.base + price.tax + price.fee;
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
const priceSteps = [
  { label: "Duo pass", amount: price.base, start: 0, fill: "#86ae9c" },
  { label: "GST", amount: price.tax, start: price.base, fill: "#91aacb" },
  { label: "Convenience fee", amount: price.fee, start: price.base + price.tax, fill: "#dc9d82" },
  { label: "Payable total", amount: total, start: 0, fill: "#395d50" },
];
const barTop = (amount: number) => 162 - (amount / total) * 138;

const stages = ["Event details", "Pass selection", "Checkout", "Payment"];
const signals = [
  { label: "Event date and venue", points: [1, 0, 2, 0] },
  { label: "Starting price", points: [1, 0, 0, 0] },
  { label: "Pass coverage and quantity", points: [0, 1, 0, 0] },
  { label: "GST and convenience fee together", points: [0, 0, 1, 0] },
  { label: "Full payable total", points: [0, 0, 1, 2] },
];

export function TicketEvidenceDashboard() {
  return <div className="ticket9-dashboard">
    <section className="ticket9-analysis-panel ticket9-price-panel">
      <h3>Where the full price becomes visible</h3>
      <figure className="ticket9-waterfall">
        <svg viewBox="0 0 440 172" role="img" aria-label="Price waterfall. Duo pass 1,798 rupees, plus 323 rupees and 64 paise GST and 116 rupees and 48 paise convenience fee, equals 2,238 rupees and 12 paise.">
          <path d="M0 162H440" stroke="#cbd6d0" />
          {priceSteps.map(({ label, amount, start, fill }, index) => {
            const x = 20 + 110 * index;
            const y = barTop(start + amount);
            return <g key={label}><rect x={x} y={y} width="70" height={barTop(start) - y} rx="3" fill={fill} />
              {index < 3 && <path d={`M${x + 70} ${y}h40`} stroke="#81968c" strokeDasharray="4 3" />}
            </g>;
          })}
        </svg>
        <figcaption>{priceSteps.map(({ label, amount }) => <div key={label}><strong>{currency.format(amount)}</strong><span>{label}</span></div>)}</figcaption>
      </figure>
      <p>The complete total first appears after pass selection. For this duo pass, GST and the convenience fee add <strong>{currency.format(price.tax + price.fee)}</strong> to the pass price. <a href="/ticket9/3419.webp" target="_blank" rel="noreferrer">View the price breakdown</a></p>
    </section>
    <section className="ticket9-analysis-panel">
      <h3>What attendees know at each decision</h3>
      <table className="ticket9-heatmap" aria-label="Where information first appears in the Ticket9 booking flow">
        <thead><tr><th scope="col">Information</th>{stages.map(stage => <th key={stage} scope="col">{stage}</th>)}</tr></thead>
        <tbody>{signals.map(({ label, points }) => <tr key={label}><th scope="row">{label}</th>{points.map((point, index) => <td key={stages[index]} data-point={point}><span aria-hidden="true">{["—", "●", "○"][point]}</span><span className="ticket9-visually-hidden">{["Not shown at this stage", "First shown", "Shown again"][point]}</span></td>)}</tr>)}</tbody>
      </table>
      <p className="ticket9-heatmap-key"><strong>●</strong> First shown <strong>○</strong> Shown again <strong>—</strong> Not shown</p>
      <p>The full amount carries into payment, while fees first become visible during checkout.</p>
    </section>
    <aside className="ticket9-analysis-panel">
      <h3>What to test next</h3>
      <ol className="ticket9-validation-path">
        <li><strong>Find a relevant event</strong><p>Ask someone to find a Bengaluru event this weekend. Record whether the city and date stay correct when they revisit results.</p></li>
        <li><strong>Pick a pass for two</strong><p>Compare the existing subtotal cue with a prototype that shows the full amount near quantity. Ask participants to state the payable total before checkout.</p></li>
        <li><strong>Retrieve a ticket</strong><p>Test a confirmation-to-ticket shortcut in a prototype. Measure successful retrieval and time to locate the ticket.</p></li>
      </ol>
      <p>Proposed tests for discovery, fee comprehension, and ticket retrieval.</p>
    </aside>
  </div>;
}

const brandArtwork = [
  { file: "live-music", label: "Live music", alt: "Ticket9 orange brand artwork with an illustrated live band", width: 1920, height: 1080 },
  { file: "sports", label: "Sports", alt: "Ticket9 pink sports graphic featuring a line-drawn pitch", width: 1920, height: 1080 },
  { file: "apparel", label: "Event apparel", alt: "Ticket9 lime-green jersey with coral trim", width: 1400, height: 1167 },
];

function BrandImage({ index }: { index: number }) {
  const { file, label, alt, width, height } = brandArtwork[index];
  const src = `/ticket9/brand/${file}.webp`;
  return <a href={src} target="_blank" rel="noreferrer" aria-label={`Open ${label} artwork at full size`}><img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" /></a>;
}

export function TicketVisualDirection() {
  return <figure className="homiq-craft-panel homiq-direction-board ticket9-brand-board">
    <figcaption><h3>Ticket9 visual direction</h3></figcaption>
    <div className="ticket9-brand-collage">
      <div><BrandImage index={0} /><BrandImage index={1} /></div>
      <BrandImage index={2} />
    </div>
  </figure>;
}
