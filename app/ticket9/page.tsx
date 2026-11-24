import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import CaseCanvas from "../homiq/CaseCanvas";
import ProductFilm from "../homiq/components/ProductFilm";
import { CraftHeading } from "../homiq/components/CraftedPanels";
import { AffinityThemeBoard } from "../homiq/components/DirectionBoards";
import { NavigationArchitecture } from "../homiq/components/InformationArchitecture";
import { TicketCompetitors, TicketDiscoveryBoard, TicketResearch } from "./ResearchSections";
import { TicketBenchmark, TicketEvidenceDashboard, TicketVisualDirection } from "./ResearchAnalysis";
import { DesktopWeb, WebScreenLibrary } from "./DesktopWeb";
import { TicketInterfaceAnatomy, TicketLayoutAnatomy, TicketSpecimens } from "./Specimens";
import { affinityThemes, ticket9Flow } from "./evidence";
import { TicketSketchBoard, TicketWireframeGallery } from "./Fidelity";
import ReferenceFooter from "../homiq/sections/Section7";
import { screens } from "./story";
import "../homiq/homiq.css";
import "./ticket9.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-homiq" });

export const metadata: Metadata = {
  title: "Ticket9 — Event Discovery & Booking | Manoj Kumar N",
  description: "A product design case study about discovering events, selecting passes, and paying for tickets.",
};

const groups = [
  { title: "Discovery", ids: [3433, 3423, 3424, 3425] },
  { title: "Event and passes", ids: [3415, 3416, 3417, 3418] },
  { title: "Checkout", ids: [3419, 3420, 3421, 3422] },
  { title: "Account and support", ids: [3426, 3432, 3430] },
  { title: "Organizer tools", ids: [3427, 3428, 3429] },
  { title: "Coupons", ids: [3413, 3414] },
];

const frames = [
  { screen: "3433", title: "Discover", detail: "Start with a city and see what’s on." },
  { screen: "3425", title: "Filter", detail: "Narrow events by date and type." },
  { screen: "3415", title: "Evaluate", detail: "Check the date, venue and starting price." },
  { screen: "3418", title: "Select", detail: "Choose a pass and review the subtotal." },
  { screen: "3419", title: "Review", detail: "See the full cost before payment." },
];

const journey = [
  { stage: "Discover", action: "Browse Bengaluru events for the weekend.", question: "What fits our plans?" },
  { stage: "Narrow", action: "Filter by date and event type.", question: "Which options are still relevant?" },
  { stage: "Evaluate", action: "Check venue, start time, and entry rules.", question: "Can we both go?" },
  { stage: "Select", action: "Compare single and duo passes.", question: "Does one pass cover two people?" },
  { stage: "Review", action: "Check the total with fees, then choose payment.", question: "What will we pay together?" },
];

const insights = [
  ["Location", "Keep the active city visible during search."],
  ["Timing", "Make the selected date easy to spot."],
  ["Venue", "Show access details near the booking action."],
  ["Passes", "Group pass rules, quantity, and price."],
  ["Recovery", "Show how to fix errors beside the field."],
];

function Chapter({ id, title, description, space = 100, children }: {
  id: string; title: string; description?: ReactNode; space?: number; children?: ReactNode;
}) {
  return <section className="homiq-section homiq-section-fluid" id={id} aria-label={title} style={{ marginTop: space }}>
    <div className="homiq-fluid-column homiq-crafted-section">
      <CraftHeading title={title}>{typeof description === "string" ? <p>{description}</p> : description}</CraftHeading>
      {children}
    </div>
  </section>;
}

function Screen({ id, caption = true }: { id: number; caption?: boolean }) {
  return <figure className="ticket9-screen">
    <a href={`/ticket9/${id}.webp`} target="_blank" rel="noreferrer" aria-label={`Open ${screens[id]} at full size`}>
      <img src={`/ticket9/${id}.webp`} alt={screens[id]} width={1206} height={2622} loading="lazy" decoding="async" />
    </a>
    {caption && <figcaption>{screens[id]}</figcaption>}
  </figure>;
}

function Flow() {
  return <NavigationArchitecture diagram={ticket9Flow} project="Ticket9" detailUrl={null}
    description="Ticket9 navigation branches from city recommendations into discovery, booking, and account, with distinct organizer and support paths. The observed checkout stops at payment methods." />;
}

export default function Ticket9Page() {
  const experiences = [
    ["discover", "Discover", "Find an event in the right city.", "City recommendations, search and filters give attendees three ways to narrow a shortlist.", [3433, 3424, 3425]],
    ["evaluate", "Evaluate", "Check the plan before committing.", "The event overview, venue and ticket information answer different questions in the same decision.", [3415, 3416, 3417]],
    ["book", "Book", "Make the move from pass to payment clear.", "The selected quantity, itemized cost and payment screen document how the booking total changes and where it carries forward.", [3418, 3419, 3422]],
  ] as const;
  const decisions = [
    ["discover", "Carry location through discovery.", "The home view gives attendees city shortcuts. Search adds a query within the active city, so the user can narrow the list without losing location context.", 3433, 3424],
    ["select", "Make pass coverage explicit.", "Event details establish the plan. Selection adds tier conditions and quantity, which attendees need to compare before making a commitment.", 3415, 3418],
    ["fees", "Carry the full cost through booking.", "Selection indicates that fees apply. The itemized total at checkout shows what would need to appear earlier in a proposed fee-comprehension test.", 3418, 3419],
  ] as const;
  return <main className={`homiq-page ticket9-page ${inter.variable}`}>
    <header className="homiq-toolbar">
      <a className="homiq-toolbar-brand" href="/#work" aria-label="Manoj Kumar N, selected work"><span>MK</span><strong>Manoj Kumar N</strong></a>
      <nav aria-label="Ticket9 case study navigation"><a href="#overview">Overview</a><a href="#discovery">Discovery</a><a href="#research">Research</a><a href="#product">Product</a><a href="#design-system">Design system</a></nav>
      <a className="homiq-toolbar-projects" href="/#work">All projects <span aria-hidden="true">↗</span></a>
    </header>
    <header className="homiq-hero">
      <div className="homiq-motion-hero">
        <div className="homiq-hero-copy"><p className="homiq-hero-project">Ticket9 <span>Event Booking</span></p><h1>Find your next event.<br />Book with confidence.</h1><p>Discover events nearby, compare passes<br className="homiq-desktop-break" /> and see what you’ll pay before booking.</p></div>
        <div className="homiq-hero-presentation"><ProductFilm project="Ticket9" base="/ticket9" extension="webp" left="3423" right="3424" frames={frames} /></div>
      </div>
    </header>
    <CaseCanvas>
      <article className="homiq-body" aria-label="Ticket9 case study by Manoj Kumar N">
        <Chapter id="overview" title="Project overview" space={0}>
          <dl className="ticket9-facts ticket9-overview-lead"><div><dt>Challenge</dt><dd>Help attendees choose an event and understand the booking cost before payment.</dd></div><div><dt>Approach</dt><dd>Connect event discovery, pass selection, and checkout around the decisions attendees make before paying.</dd></div></dl>
          <dl className="ticket9-facts ticket9-overview-facts">{[["Product scope", "Event discovery", "Ticket booking"], ["Disciplines", "Product thinking", "Interaction design"], ["Design focus", "Discovery", "Pass selection", "Price clarity"], ["Interface scope", "Booking", "Organizer tools", "Account and support"]].map(([title, ...items]) => <div key={title}><dt>{title}</dt>{items.map(item => <dd key={item}>{item}</dd>)}</div>)}</dl>
        </Chapter>
        <Chapter id="vision" title="Product vision" description="Ticket9 connects local event discovery with booking. Attendees need to know whether an event fits their plans before committing money, while organizers need distinct paths for standard and RSVP events." />
        <Chapter id="process" title="The Process" description="The process follows the decisions attendees make from discovery to payment.">
          <ol className="ticket9-process">{["Discover", "Define", "Explore", "Design", "Validate"].map((step, i) => <li key={step}><span className="ticket9-process-icon" aria-hidden="true">{["⌕", "◎", "◇", "▤", "✓"][i]}</span><strong>{step}</strong><p>{["Map the journey", "Locate decision points", "Compare approaches", "Document the patterns", "Plan usability tasks"][i]}</p></li>)}</ol>
        </Chapter>
        <Chapter id="discovery" title="Initial Problem Discovery" description={<>
          <p>Booking starts before anyone picks a pass. Attendees need to <strong>find an event that fits their city and date</strong>, then confirm the venue and <strong>understand what each pass includes</strong>.</p>
          <p>Ticket9 shows a starting price on the event page and a subtotal at pass selection. Attendees see the <strong>full payable amount at checkout</strong>. That makes it worth testing whether showing fees earlier would help people decide which pass to choose.</p>
        </>} />
        <section className="homiq-section homiq-section-fluid ticket9-discovery-art" style={{ marginTop: 60 }} aria-label="Research illustrations">
          <div className="homiq-fluid-column homiq-crafted-section"><TicketDiscoveryBoard /></div>
        </section>
        <section className="homiq-section homiq-section-fluid" style={{ marginTop: 60 }} aria-label="Problem statement"><div className="homiq-fluid-column ticket9-problem">How might we keep the plan, pass conditions and full price clear at each booking decision?</div></section>
        <Chapter id="desk-research" title="Research & Discovery" description={<p>Three decisions shape booking confidence: <strong>finding a relevant event, choosing the right pass, and understanding the total</strong>.</p>}>
          <TicketResearch />
        </Chapter>
        <Chapter id="competitors" title="Competitor Analysis" description={<p>The comparison looks at BookMyShow, District, and Eventbrite across <strong>three attendee tasks</strong>: find a plan, choose a pass, and retrieve the ticket.</p>}>
          <TicketCompetitors />
          <TicketBenchmark />
        </Chapter>
        <Chapter id="research" title="User Research Framework" description="A booking decision depends on what attendees know at each step. The price breakdown shows where to test an earlier all-in total.">
          <TicketEvidenceDashboard />
        </Chapter>
        <Chapter id="insights" title="Key Insights & Opportunities" space={59} description="Five opportunities to make booking decisions easier.">
          <ol className="ticket9-insights">{insights.map(([title, detail], index) => <li className="homiq-insight-circle" key={title}>
            <span className="homiq-insight-number" aria-hidden="true">{index + 1}</span>
            <p className="homiq-insight-text"><strong>{title}</strong>{detail}</p>
          </li>)}</ol>
        </Chapter>
        <Chapter id="persona" title="Provisional Persona">
          <section className="ticket9-persona" aria-labelledby="ticket9-persona-name">
            <div><h3 id="ticket9-persona-name">The friend making the plan</h3><p>They’re planning a weekend event in Bengaluru for themselves and one friend. Before sharing the plan, they need to know whether both can attend and what it will cost together.</p></div>
            <dl>
              <div><dt>Goal</dt><dd>Find an event both friends can attend.</dd></div>
              <div><dt>Decision</dt><dd>Choose between two single passes and one duo pass.</dd></div>
              <div><dt>Risk</dt><dd>Fees or entry rules could change the plan after they agree.</dd></div>
            </dl>
          </section>
        </Chapter>
        <Chapter id="journey" title="User Journey" description="Follow the same booking-for-two scenario from the first search to payment selection.">
          <ol className="ticket9-booking-journey">
            {journey.map(({ stage, action, question }) => <li key={stage}>
              <h3>{stage}</h3>
              <p>{action}</p>
              <p className="ticket9-journey-question">{question}</p>
            </li>)}
          </ol>
          <p className="ticket9-journey-followup"><strong>To validate after payment</strong> Find both tickets and check the entry instructions.</p>
        </Chapter>
        <Chapter id="solution" title="Developing a Solution" description="Give each stage a clear job. Discovery narrows the options, details help someone make a plan, and checkout confirms exactly what that plan costs.">
          <div className="ticket9-solution"><div>{[3433, 3415, 3419].map(id => <Screen key={id} id={id} />)}</div></div>
          <ol className="ticket9-solution-goals">{["Keep city and date accessible.", "Bring pass restrictions into the price comparison.", "Carry the cost breakdown into payment."].map(goal => <li key={goal}>{goal}</li>)}</ol>
          <Flow />
        </Chapter>
        <Chapter id="moodboard" title="Moodboard & Affinity" description="Ticket9’s brand spans live music, sports, and event apparel. The affinity map connects discovery, pass selection, and payment to the decisions attendees make.">
          <div className="homiq-direction-boards">
            <TicketVisualDirection />
            <AffinityThemeBoard project="Ticket9" themes={affinityThemes} basis="Booking questions and design priorities, grouped by theme." />
          </div>
        </Chapter>
        <Chapter id="low-fidelity" title="Low-Fidelity" description="One sketch board traces discovery, booking, error recovery, and RSVP setup.">
          <TicketSketchBoard />
        </Chapter>
        <Chapter id="mid-fidelity" title="Mid-Fidelity" description="Grayscale wireframes turn those decisions into layouts for discovery, pass selection, and checkout.">
          <TicketWireframeGallery />
        </Chapter>
        <Chapter id="product" title="High-Fidelity Product Design" description="The final Ticket9 interface takes attendees from local event discovery through pass selection and payment.">
          <div className="homiq-editorial-section homiq-product-chapter">
            <nav className="homiq-mobile-chapters" aria-label="Product experiences">{experiences.map(([id, label]) => <a key={id} href={`#experience-${id}`}>{label}</a>)}</nav>
            <div className="homiq-experience-gallery" tabIndex={0} role="region" aria-label="Three Ticket9 product experiences">{experiences.map(([id, label, title, copy, images], i) => <section key={id} id={`experience-${id}`} className={`homiq-experience homiq-experience-${["discover","control","automate"][i]}`} aria-label={label}><div className="homiq-experience-copy"><h3>{title}</h3><p>{copy}</p></div><div className="homiq-experience-visual">{images.map(image => <Screen key={image} id={image} />)}</div></section>)}</div>
            <DesktopWeb />
            <details className="homiq-editorial-details homiq-screen-library"><summary>Explore the product screens <span>Screen library</span></summary><div className="homiq-library-groups">{groups.map(({title, ids}) => <section key={title}><h4>{title}</h4><div className="homiq-library-screens">{ids.map(id => <Screen key={id} id={id} />)}</div></section>)}</div></details>
            <WebScreenLibrary />
          </div>
        </Chapter>
        <Chapter id="decisions" title="Interaction Decisions" space={80} description="See how location, pass rules, and pricing carry across steps.">
          <div className="homiq-editorial-section"><nav className="homiq-mobile-chapters" aria-label="Interaction decisions">{decisions.map(([id], i) => <a key={id} href={`#decision-${id}`}>{["Discovery","Selection","Price"][i]}</a>)}</nav><div className="homiq-decision-list" tabIndex={0} role="region" aria-label="Three interaction decisions">{decisions.map(([id, title, detail, first, second]) => <section key={id} id={`decision-${id}`}><div className="homiq-decision-copy"><h3>{title}</h3><p>{detail}</p></div><div className="homiq-comparison-pair"><Screen id={first} /><span className="homiq-comparison-arrow" aria-hidden="true">→</span><Screen id={second} /></div></section>)}</div></div>
        </Chapter>
        <Chapter id="recovery" title="Recovery States" space={60} description="Three states guide attendees and organizers toward a next action.">
          <div className="homiq-craft-panel homiq-feedback-board homiq-feedback-simple"><div className="homiq-feedback-grid">{[["Invalid number", "Review the phone number before continuing.", 3421], ["RSVP update", "Confirm the required listing update.", 3429], ["Booking support", "Use the booking ID and contact detail to look up the booking.", 3430]].map(([title, detail, id], i) => <div className="homiq-feedback-item" key={title}><div className="homiq-feedback-label"><span className={i === 0 ? "homiq-feedback-warning" : "homiq-feedback-success"} aria-hidden="true">{i === 0 ? "!" : "•"}</span><h3>{title}</h3></div><p>{detail}</p><a href={`/ticket9/${id}.webp`} target="_blank" rel="noreferrer">View screen</a></div>)}</div></div>
        </Chapter>
        <Chapter id="design-system" title="Design System">
          <div className="homiq-system-showcase">
            <div className="homiq-kit-left">
              <TicketInterfaceAnatomy />
              <figure className="homiq-kit-card homiq-kit-inventory">
                <figcaption><h3>UI specifications</h3><p>Discovery, booking, and account flows</p></figcaption>
                <div className="homiq-kit-screen-groups">{groups.map(({ title, ids }) => <div key={title}><h4>{title}</h4><div>{ids.map(id => <a key={id} href={`/ticket9/${id}.webp`} target="_blank" rel="noreferrer" aria-label={`Open ${screens[id]}`}><img src={`/ticket9/${id}.webp`} alt="" width={1206} height={2622} loading="lazy" decoding="async" /></a>)}</div></div>)}</div>
              </figure>
            </div>
            <div className="homiq-kit-right">
              <TicketSpecimens />
              <TicketLayoutAnatomy />
            </div>
          </div>
        </Chapter>
        <Chapter id="sequences" title="Product Sequences" space={99} description="Follow three paths through event discovery, booking, and organizer tools.">
          <div className="homiq-editorial-section homiq-sequence-gallery">{[["Find and evaluate an event", [3433,3424,3425,3415,3416]], ["Select and review a booking", [3417,3418,3419,3420,3422]], ["Organizer tools", [3426,3427,3428,3429]]].map(([label, images]) => <details key={String(label)} className="homiq-editorial-details"><summary>{label}</summary><div className="homiq-craft-panel homiq-sequence-board"><div className="homiq-product-screens">{(images as number[]).map(id => <Screen key={id} id={id} />)}</div></div></details>)}</div>
        </Chapter>
        <Chapter id="outcomes" title="Design Priorities" space={80} description="This project focuses on finding a relevant event, choosing a pass, and understanding the payable total.">
          <div className="homiq-editorial-section homiq-success"><div className="homiq-success-intro"><section className="homiq-product-outcomes"><ul className="homiq-outcome-checks"><li>Carry city and date into booking.</li><li>Show the full price at pass selection.</li><li>Give attendees and organizers distinct entry points.</li></ul><h3>Product Development</h3><ul className="homiq-outcome-checks"><li>Test when fees are noticed and totals understood.</li><li>Test confirmation and payment recovery.</li><li>Compare booking on Android and web.</li></ul></section><figure className="ticket9-app-store">
              <a href="https://apps.apple.com/in/app/ticket9/id6720710550" target="_blank" rel="noreferrer" aria-label="View Ticket9 on the Apple App Store">
                <img src="/ticket9/store/app-store-listing.webp" width={588} height={1280} alt="Ticket9’s Apple App Store listing with its app icon and release notes" loading="lazy" decoding="async" />
                <span><strong>Ticket9</strong>View on the App Store</span>
              </a>
            </figure></div><details className="homiq-editorial-details homiq-testing-results"><summary>Proposed validation measures</summary><dl>{[["Discovery success","Find an event matching the city and date."],["Price comprehension","Recall the full amount before payment."],["Recovery success","Correct the attendee input and continue."],["Booking completion","Measure successful bookings per checkout start."]].map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl></details></div>
        </Chapter>
        <Chapter id="reflection" title="Reflection by Manoj" space={80} description="A confident choice can become uncertain when the next screen changes its context. I’d focus on preserving the city, pass and total at each handoff so the attendee can keep moving with the same understanding of the booking." />
      </article>
      <footer className="homiq-footer"><ReferenceFooter /></footer>
    </CaseCanvas>
  </main>;
}
