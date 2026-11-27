import ScreenshotTrigger from "../ScreenshotTrigger";
const componentGroups = [
  {
    title: "Discovery and selection",
    examples: [
      { label: "Search and location", file: "search", width: 1158, height: 322, dark: true },
      { label: "Date presets", file: "date-filters", width: 1134, height: 571, dark: true },
      { label: "Primary booking action", file: "booking-action", width: 1174, height: 290 },
      { label: "Pass quantity", file: "pass-quantity", width: 1142, height: 290 },
    ],
  },
  {
    title: "Checkout and feedback",
    examples: [
      { label: "Price breakdown", file: "booking-total", width: 1134, height: 595 },
      { label: "Required text field", file: "attendee-name", width: 1006, height: 247 },
      { label: "Phone number error", file: "field-error", width: 1110, height: 338 },
      { label: "Payment choices", file: "payment-options", width: 1150, height: 643 },
    ],
  },
];

const brandExcerpts = {
  backgrounds: { file: "logo-backgrounds", width: 1440, height: 292, alt: "Ticket9 logo on approved black and white backgrounds" },
  clearspace: { file: "logo-clearspace", width: 512, height: 352, alt: "Dotted clear-space boundary and arrows around the Ticket9 logo" },
  color: { file: "brand-colors", width: 1178, height: 368, alt: "Logo colors #FB426E and #FD6B3B, and the web and app gradient from #FF9650 to #FB426E" },
  regular: { file: "ultine-regular", width: 462, height: 252, alt: "Ultine Regular type specimen" },
  family: { file: "ultine-family", width: 330, height: 450, alt: "Ultine family examples in five styles" },
};

function BrandExcerpt({ file, width, height, alt }: (typeof brandExcerpts)[keyof typeof brandExcerpts]) {
  const src = `/ticket9/brand/style-guide/${file}.webp`;
  return <ScreenshotTrigger src={src} aria-label={`View full size: ${alt}`}>
    <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
  </ScreenshotTrigger>;
}

export function TicketSpecimens() {
  return <section className="homiq-kit-card homiq-kit-guide ticket9-brand-guide" aria-label="Ticket9 brand style guide">
    <h3>Ticket9 Brand Style Guide</h3>
    <div className="ticket9-brand-excerpts">
      <figure>
        <figcaption>Logo on light and dark</figcaption>
        <BrandExcerpt {...brandExcerpts.backgrounds} />
      </figure>
      <figure>
        <figcaption>Logo clear space</figcaption>
        <div className="ticket9-clearspace">
          <BrandExcerpt {...brandExcerpts.clearspace} />
          <p>Leave at least half a letter’s width around the logo. Keep it at least 24 px tall.</p>
        </div>
      </figure>
      <figure>
        <figcaption>Brand colors and gradient</figcaption>
        <BrandExcerpt {...brandExcerpts.color} />
      </figure>
      <figure>
        <figcaption>Ultine typography</figcaption>
        <div className="ticket9-type-excerpts">
          <BrandExcerpt {...brandExcerpts.regular} />
          <BrandExcerpt {...brandExcerpts.family} />
        </div>
      </figure>
    </div>
    <p className="ticket9-brand-credit">Excerpts from the Ticket9 Brand Guidelines, pp. 4–5 and 8–9.</p>
    <details className="ticket9-component-examples">
      <summary>Mobile UI component examples</summary>
      {componentGroups.map(({ title, examples }) => <section className="ticket9-specimen-group" key={title}>
        <h4>{title}</h4>
        <div className="homiq-kit-specimens ticket9-specimens">
          {examples.map(({ label, file, width, height, dark }) => {
            const src = `/ticket9/specimens/${file}.webp`;
            return <figure key={file}>
              <figcaption>{label}</figcaption>
              <ScreenshotTrigger src={src} data-tone={dark ? "dark" : "light"} aria-label={`Open ${label.toLowerCase()} at full size`}>
                <img src={src} alt={label} width={width} height={height} loading="lazy" decoding="async" />
              </ScreenshotTrigger>
            </figure>;
          })}
        </div>
      </section>)}
    </details>
  </section>;
}

const homeAnatomy = [
  { title: "Location", detail: "Keeps the active city in view.", x: 70, y: 108, side: "left" },
  { title: "Search", detail: "Starts a search from Home.", x: 346, y: 97, side: "right" },
  { title: "Popular cities", detail: "Gives nearby discovery a starting point.", x: 48, y: 158, side: "left" },
  { title: "City cards", detail: "Pair a city name with a recognizable image.", x: 367, y: 283, side: "right" },
  { title: "Recommendations", detail: "Presents events after location choices.", x: 60, y: 630, side: "left" },
  { title: "View all", detail: "Opens the longer recommendation list.", x: 367, y: 629, side: "right" },
  { title: "Bottom navigation", detail: "Keeps the main destinations within reach.", x: 53, y: 755, side: "left" },
];

export function TicketInterfaceAnatomy() {
  return <figure className="homiq-kit-card homiq-kit-anatomy">
    <figcaption><h3>Interface anatomy</h3></figcaption>
    <div className="homiq-kit-anatomy-grid">
      <ol>{homeAnatomy.map(({ title, detail }, index) => <li key={title}>
        <span>{index + 1}</span><div><h4>{title}</h4><p>{detail}</p></div>
      </li>)}</ol>
      <svg viewBox="0 0 600 928" role="img" aria-label="Ticket9 home screen with seven numbered component callouts">
        <image href="/ticket9/3433.webp" x="105" y="40" width="390" height="848" />
        {homeAnatomy.map(({ title, x, y, side }, index) => {
          const markerX = side === "left" ? 35 : 565;
          const markerY = 40 + y;
          return <g key={title}>
            <path d={`M${markerX} ${markerY}H${105 + x}`} />
            <circle cx={markerX} cy={markerY} r="15" />
            <text x={markerX} y={markerY} dominantBaseline="central" textAnchor="middle">{index + 1}</text>
          </g>;
        })}
      </svg>
    </div>
  </figure>;
}

const layoutZones = [
  { label: "Location & search", from: 55, to: 143 },
  { label: "City grid", from: 146, to: 594 },
  { label: "Recommendations", from: 604, to: 727 },
  { label: "Tab bar", from: 730, to: 798 },
];

export function TicketLayoutAnatomy() {
  return <figure className="homiq-kit-card homiq-kit-general">
    <figcaption><h3>General anatomy</h3></figcaption>
    <div className="homiq-kit-general-grid">
      <svg className="homiq-layout-measurements ticket9-layout-diagram" viewBox="0 0 670 960" role="img" aria-label="Ticket9 home layout showing the content width and four vertical layout regions">
        <image href="/ticket9/3433.webp" x="42" y="66" width="390" height="848" />
        <g fill="none" stroke="#a0ada4" strokeWidth="1.5">
          <path d="M56 53V34m362 19V34M56 43H418" />
          {layoutZones.map(({ label, from, to }) => <path key={label} d={`M456 ${66 + from}h18m-9 0V${66 + to}m-9 0h18`} />)}
        </g>
        <g fill="#57665e" fontSize="16" fontFamily="Inter, Arial, sans-serif">
          <text x="237" y="27" textAnchor="middle">Content width</text>
          {layoutZones.map(({ label, from, to }) => <text key={label} x="484" y={66 + (from + to) / 2} dominantBaseline="middle">{label}</text>)}
        </g>
      </svg>
    </div>
  </figure>;
}
