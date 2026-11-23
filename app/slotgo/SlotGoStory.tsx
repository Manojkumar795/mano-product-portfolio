import Link from "next/link";
import type { ReactNode } from "react";
import { LuCalendarDays, LuUserRound } from "react-icons/lu";
import styles from "./SlotGo.module.css";
import ScreenLibrary, { SlotGoWalkthrough } from "./SlotGoShowcase";
import ProductScreen from "./ProductScreen";

const chapters = [["overview", "Overview"], ["analysis", "Discovery"], ["prototype", "Prototype"], ["customer-app", "Product"], ["design-system", "Design system"]] as const;
function Heading({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <header className={styles.sectionHeading}><h2 id={id}>{title}</h2><div className={styles.rule} /><p>{children}</p></header>;
}
function Screens({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return <div className={styles.screenBoard} role="group" aria-label={label}>{items.map(([id, title]) => <figure key={id}><a href={`/slotgo/${id}.png`} target="_blank" rel="noreferrer" aria-label={`Open ${title} at full size`}><ProductScreen id={id} /></a><figcaption>{title}</figcaption></figure>)}</div>;
}
function Detail({ id, x, y, width, height, label }: { id: string; x: number; y: number; width: number; height: number; label: string }) {
  return <svg viewBox={`${x} ${y} ${width} ${height}`} role="img" aria-label={label}><image href={`/slotgo/${id}.png`} width="806" height="1746" /></svg>;
}
const journeys = [
  {
    title: "Customer",
    goal: "Find and book a court at a time that works.",
    Icon: LuUserRound,
    steps: [
      ["Discover", "Find a venue, sport and next available slot."],
      ["Choose", "Select a court, date and time."],
      ["Review", "Check the fees and final amount."],
      ["Confirm", "View the booking and get directions."],
    ],
  },
  {
    title: "Venue",
    goal: "Add a reservation and keep the court schedule up to date.",
    Icon: LuCalendarDays,
    steps: [
      ["Schedule", "Find a court and available time."],
      ["Add booking", "Enter the time, court and player."],
      ["Record payment", "Mark the booking as paid or unpaid."],
      ["Manage", "Review the booking and court occupancy."],
    ],
  },
];

function JourneyBoard() {
  return <div className={styles.journeyBoard}>
    {journeys.map(({ title, goal, Icon, steps }) => <div key={title} className={styles.journeyLane} role="group" aria-label={`${title} journey`}>
      <header className={styles.journeyPersona}>
        <div className={styles.journeyAvatar}><Icon aria-hidden="true" /></div>
        <div><h3>{title}</h3><p>{goal}</p></div>
      </header>
      <ol className={styles.journeyFlow} role="list">
        {steps.map(([stage, detail]) => <li key={stage}><h4>{stage}</h4><p>{detail}</p></li>)}
      </ol>
    </div>)}
  </div>;
}
function StructureStudy() {
  return <figure className={styles.structureBoard}><div>{["Discover", "Choose a court", "Time & price", "Review", "Confirmed"].map((title, index) => <div className={styles.wireframe} key={title} aria-label={`${title} reconstructed wireframe`}><span className={styles.wireTitle}>{title}</span>{index === 0 ? <><i className={styles.wireInput} /><div className={styles.wireCategories}><i /><i /><i /><i /></div><i className={styles.wirePhoto} /><i className={styles.wireLine} /><i className={styles.wirePhoto} /></> : index === 1 ? <div className={styles.wireRows}><i /><i /><i /></div> : index === 2 ? <><div className={styles.wireCategories}><i /><i /><i /></div><div className={styles.wireSlots}>{Array.from({length:9}, (_, i) => <i key={i} />)}</div></> : index === 3 ? <><i className={styles.wirePhoto} /><div className={styles.wireRows}><i /><i /><i /></div></> : <><span className={styles.wireCheck}>✓</span><div className={styles.wireRows}><i /><i /></div></>}<i className={styles.wireButton} /></div>)}</div><figcaption>Structure study reconstructed from the existing screens, not original workshop sketches.</figcaption></figure>;
}
function ComponentBoard() {
  return <div className={styles.systemBoard}>
    <div className={styles.componentLibrary}><h3>SlotGo component library</h3><div className={styles.componentGrid}>
      <figure><figcaption>Search</figcaption><Detail id="customer-explore-list" x={30} y={102} width={745} height={92} label="Original venue search and filter controls" /></figure>
      <figure><figcaption>Primary action</figcaption><Detail id="customer-book-summary" x={30} y={1608} width={745} height={105} label="Original Proceed to Pay action with the amount" /></figure>
      <figure className={styles.componentWide}><figcaption>Selection and availability</figcaption><Detail id="customer-book-time" x={30} y={380} width={745} height={590} label="Available, selected, booked and peak-price time-slot states" /></figure>
      <figure><figcaption>Booking progress</figcaption><Detail id="customer-book-summary" x={30} y={224} width={745} height={63} label="Original five-stage booking progress indicator" /></figure>
      <figure><figcaption>Bottom navigation</figcaption><Detail id="customer-bookings" x={25} y={1582} width={750} height={151} label="Original Customer navigation" /></figure>
    </div><div className={styles.foundations}><div><h4>Colors in the interface</h4><div className={styles.swatches}>{[["#0B1015","Background"],["#161D25","Surface"],["#11C7CB","Action"],["#F1F5F9","Text"]].map(([color, title]) => <div key={title}><i style={{background:color}} /><span>{title}</span></div>)}</div></div><div><h4>Hierarchy in use</h4><p className={styles.typeTitle}>Select time slot</p><p className={styles.typeBody}>Available · Peak price · Booked</p><p className={styles.typeLabel}>Court, time and amount stay together.</p></div></div></div>
    <figure className={styles.anatomy}><h3>Interface anatomy</h3><div><ProductScreen id="customer-book-time" /><svg viewBox="0 0 806 1746" aria-hidden="true"><g>{[[746,264,1],[746,396,2],[680,483,3],[746,1659,4]].map(([x,y,n]) => <g key={n}><circle cx={x} cy={y} r="27" /><text x={x} y={y+9}>{n}</text></g>)}</g></svg></div><ol><li><span>1</span>Progress keeps the booking in context.</li><li><span>2</span>Words explain availability and peak pricing.</li><li><span>3</span>Each choice includes its time and price.</li><li><span>4</span>Continue stays in one predictable place.</li></ol></figure>
  </div>;
}
export default function SlotGoStory({ fontClassName = "" }: { fontClassName?: string }) {
  return <main className={`${styles.page} ${fontClassName}`}>
    <header className={styles.topbar}><Link className={styles.brand} href="/#work" aria-label="Manoj Kumar N, selected work"><span>MK</span><strong>Manoj Kumar N</strong></Link><nav aria-label="SlotGo case study navigation">{chapters.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav><Link className={styles.allProjects} href="/#work">All projects <span aria-hidden="true">↗</span></Link></header>
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <p className={styles.projectName}>SlotGo <span>AI-assisted product design</span></p>
          <h1>A clearer path <em>from court to game.</em></h1>
          <p>From a sports booking brief to an interactive prototype in Figma Make and a coded walkthrough built with Codex.</p>
          <a className={styles.heroLink} href="#prototype">Explore the walkthrough</a>
        </div>
        <div className={styles.heroScreens} aria-label="Original SlotGo Customer and Venue screens">
          <figure><ProductScreen id="customer-home" priority /><figcaption>Customer app</figcaption></figure>
          <figure><ProductScreen id="venue-calendar" priority /><figcaption>Venue app</figcaption></figure>
        </div>
      </div>
    </header>
    <article className={styles.story} aria-label="SlotGo AI-assisted product design case study">
      <section className={styles.section} id="overview" aria-labelledby="overview-title"><Heading id="overview-title" title="Project overview">I designed SlotGo around two jobs: finding a court to play on and keeping a venue’s schedule accurate. I used AI to explore the brief, prototype both journeys and turn the original screens into a coded walkthrough. I owned the product decisions and reviewed the output at each stage.</Heading><div className={styles.overviewVisual}><div><h3>For players</h3><p>Discover venues, compare times and prices, book a court and organize a match.</p></div><div><h3>For venue teams</h3><p>Manage the calendar, bookings, payment status, occupancy and memberships.</p></div></div><dl className={styles.facts}><div><dt>Role</dt><dd>Product design</dd></div><div><dt>Scope</dt><dd>Customer and Venue apps</dd></div><div><dt>Tools</dt><dd>Figma Make and Codex</dd></div><div><dt>Design assets</dt><dd>30 original product screens</dd></div></dl></section>
      <section className={styles.section} id="analysis" aria-labelledby="discovery-title"><Heading id="discovery-title" title="Problem discovery"><strong>1. Define the problem.</strong> I used AI to turn the brief into questions I could check against the product flows. Can a player see when a court is free and what it costs? Can staff tell whether it’s reserved and whether payment has been collected? Those questions set the scope for discovery and booking.</Heading><div className={styles.discoveryBoard}><figure><Detail id="customer-explore-list" x={30} y={496} width={745} height={262} label="A real venue result combines distance, price and next available time" /><figcaption>Can I play here, and when?</figcaption></figure><figure><Detail id="customer-book-time" x={30} y={380} width={745} height={320} label="Actual SlotGo time choices and price states" /><figcaption>What does this time cost?</figcaption></figure><figure><Detail id="venue-bookings" x={30} y={605} width={745} height={200} label="Original venue booking and payment labels" /><figcaption>Is it booked, paid, or both?</figcaption></figure></div></section>
      <section className={styles.section} id="structure" aria-labelledby="journey-title"><Heading id="journey-title" title="User Journey"><strong>2. Map the two journeys.</strong> I mapped the player’s path from venue search to confirmation and the staff path from the calendar to a booking record. Court, date and time are shared across both. Price belongs in the player’s review, while payment status is an explicit step for staff.</Heading><JourneyBoard /></section>
      <section className={styles.section} aria-labelledby="exploration-title"><Heading id="exploration-title" title="Structure before detail"><strong>3. Turn the flow into a prototype brief.</strong> I broke the customer journey into five screens, each with one decision. An example prompt for that structure is “Build a court-booking flow. Carry the selected court and date into review, disable booked slots and show the itemized total before payment.” The wireframes below reconstruct that sequence from the finished screens.</Heading><StructureStudy /></section>
      <section className={styles.section} id="prototype" aria-labelledby="prototype-title"><Heading id="prototype-title" title="Prototyping with Figma Make"><strong>4. Prototype and review in Figma Make.</strong> Figma Make turned the flow into a clickable model. I reviewed whether the court and date carried into the summary, booked slots stayed disabled and the itemized total updated when the time changed. I also traced the venue path where a booking can be confirmed with payment still due.</Heading><SlotGoWalkthrough /></section>
      <section className={styles.section} id="customer-app" data-app="customer" aria-labelledby="customer-title"><Heading id="customer-title" title="Finding and booking a court">I brought the next available time into discovery and kept the price on each slot. The summary then makes the fees and final amount explicit before payment, so the player can review the commitment before continuing.</Heading><Screens label="Customer discovery, time selection and booking review" items={[["customer-explore-list","Compare venues"],["customer-book-time","Choose time and price"],["customer-book-summary","Review the total"]]} /><div className={styles.secondaryExperience}><h3>From a reservation to a game</h3><p>Booking confirmation keeps directions and sharing close. Play has a separate path for finding matches, keeping score and sharing the result.</p><Screens label="Original booking confirmation, live scorekeeping and match result" items={[["customer-confirmed","Booking confirmed"],["customer-live-scoreboard","Live scoreboard"],["customer-match-result","Match result"]]} /></div></section>
      <section className={styles.section} id="venue-app" data-app="venue" aria-labelledby="venue-title"><Heading id="venue-title" title="The venue’s working view">A booking starts another task for the venue team. I organized the calendar around court and time, kept collection information with the booking, and gave recurring members their own view. Staff can move between the day’s schedule and the individual record.</Heading><Screens label="Venue scheduling, booking management and memberships" items={[["venue-calendar","Court calendar"],["venue-bookings","Bookings and payment"],["venue-members","Members and batches"]]} /></section>
      <section className={styles.section} aria-labelledby="decisions-title"><Heading id="decisions-title" title="Interaction decisions">I judged the prototype by the decisions each screen asks someone to make. These three choices show where I kept flexibility and where I accepted an extra step to make the booking clearer.</Heading><div className={styles.decisions}>
        <article><div><h3>List and map serve different questions</h3><p>The list brings price, distance and next-slot details together. I kept the map for location context, accepting a second view rather than forcing both comparison and orientation onto one screen.</p></div><Screens label="Existing list and map discovery alternatives" items={[["customer-explore-list","Compare options"],["customer-explore-map","See the area"]]} /></article>
        <article><div><h3>Price belongs on the choice</h3><p>I showed prices on the time slots, then repeated the selected booking in an itemized summary. That adds a review step, but lets someone check the court, duration and total before paying.</p></div><Screens label="Existing time selection and itemized summary" items={[["customer-book-time","Choose a time"],["customer-book-summary","Check the commitment"]]} /></article>
        <article><div><h3>A confirmed booking can still be unpaid</h3><p>The venue flow allows staff to confirm a reservation with payment outstanding. I kept payment as a separate choice so a booking does not imply collection. The confirmation’s amount due gives staff a clear follow-up.</p></div><Screens label="Original unpaid booking and confirmation" items={[["venue-book-payment","Record payment status"],["venue-confirmed","Confirm the reservation"]]} /></article>
      </div></section>
      <section className={styles.section} id="design-system" aria-labelledby="system-title"><Heading id="system-title" title="Design system and implementation"><strong>5. Build the walkthrough with Codex.</strong> I used Codex to turn the original exports into a reusable screen component, a two-journey walkthrough and a browsable library. I refined the responsive layout, keyboard navigation and focus return so the same screens could be reviewed in sequence or opened at full size.</Heading><ComponentBoard /><ScreenLibrary /></section>
      <section className={styles.section} id="outcome" aria-labelledby="outcome-title"><Heading id="outcome-title" title="Product outcomes"><strong>6. Check the build and define what comes next.</strong> The build verifies that all 30 original screen exports are preserved and the case-study page and its screen library render. The Figma Make prototype uses demo data and simulated payment. The next round of validation is with players and venue staff.</Heading><div className={styles.outcomeVisual}><div><h3>What the design makes clearer</h3><ul className={styles.checks}><li>Availability and price are visible before booking.</li><li>Court, date, time and fees come together before payment.</li><li>Confirmation stays accessible through the booking record.</li><li>Scheduling and payment remain distinct venue responsibilities.</li></ul></div><div><h3>What I would test next</h3><p>The venue list still mixes availability and reservation labels. I would resolve that language, then test whether players understand the total and staff can distinguish booking from collection. Slot changes and payment interruptions also need validation.</p></div></div><p className={styles.reflection}>The next test is the handoff after confirmation. Can a player find their booking details, and can staff see what still needs to be collected?</p></section>
    </article>
    <footer className={styles.footer}><div><h2>Thanks for stopping by.</h2><Link className={styles.footerProjects} href="/#work">All projects <span aria-hidden="true">↗</span></Link></div><nav aria-label="Footer pages"><h3>Pages</h3><Link href="/">Home</Link><Link href="/#about">About me</Link></nav><nav aria-label="Footer selected work"><h3>Selected work</h3><Link href="/program-plus">Program+</Link><Link href="/quote-plus">Quote+</Link><Link href="/homiq">HOMIQ</Link></nav><nav aria-label="Footer connections"><h3>Connect</h3><Link href="/#contact">Contact</Link><a href="/Manojkumar_N_Premium_Product_Designer_CV.pdf">CV</a></nav></footer>
  </main>;
}
