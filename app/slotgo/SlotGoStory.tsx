"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { HiArrowLongRight, HiArrowUpRight } from "react-icons/hi2";
import styles from "./SlotGo.module.css";
import SlotGoShowcase from "./SlotGoShowcase";
import HeroMockups from "./HeroMockups";

const chapters = [["overview", "Overview"], ["analysis", "Analysis"], ["customer-app", "Customer App"], ["venue-app", "Venue App"], ["outcome", "Reflection"], ["product-film", "Showcase"]] as const;

type AppSide = "customer" | "venue";
type ProductScreen = { side: AppSide; file: string; label: string; description: string };
const customerScreens = {
  home: { side: "customer", file: "home", label: "Home", description: "Location, sport categories and nearby venues establish the starting point." },
  explore: { side: "customer", file: "explore-list", label: "Explore", description: "Distance, rating, hourly price and the next slot sit together in each result." },
  court: { side: "customer", file: "book-court", label: "Select court", description: "Court options and hourly rates inside the selected venue." },
  time: { side: "customer", file: "book-time", label: "Select time", description: "A price on each slot, with distinct selected, booked and peak-price states." },
  summary: { side: "customer", file: "book-summary", label: "Booking summary", description: "Court, date, duration, fees and total are reviewed before payment." },
  payment: { side: "customer", file: "book-payment", label: "Payment", description: "Payment options and the amount due share one final step." },
  confirmed: { side: "customer", file: "confirmed", label: "Booking confirmed", description: "Booking details remain available alongside directions and sharing." },
  bookings: { side: "customer", file: "bookings", label: "My bookings", description: "Upcoming, completed and cancelled bookings, with payment status." },
  play: { side: "customer", file: "play", label: "Play", description: "A separate destination for finding matches and tournaments." },
  match: { side: "customer", file: "match-confirmed", label: "Match confirmed", description: "Players, venue and time are brought together before a match." },
  scoreboard: { side: "customer", file: "live-scoreboard", label: "Live scoreboard", description: "A focused scorekeeping view with controls for each player." },
  result: { side: "customer", file: "match-result", label: "Match result", description: "The final score and a shareable match result." },
} satisfies Record<string, ProductScreen>;
const venueScreens = {
  calendar: { side: "venue", file: "calendar", label: "Court calendar", description: "Courts form rows; time forms columns. Bookings stay in their scheduling context." },
  bookings: { side: "venue", file: "bookings", label: "Bookings", description: "Player, court, time, amount and payment information in one working list." },
  occupancy: { side: "venue", file: "occupancy", label: "Court occupancy", description: "A filtered schedule, occupancy summary and quick operational actions." },
  members: { side: "venue", file: "members", label: "Memberships", description: "Members and batches have a dedicated place alongside booking operations." },
} satisfies Record<string, ProductScreen>;

const findings = [
  { title: "A venue is not a slot.", observed: "Explore shows the next available time beside each venue.", implication: "Discovery needs to answer when, not only where.", response: "Keep next-slot information visible before a player opens the booking flow." },
  { title: "Price changes the choice.", observed: "Time slots carry different prices; peak times have their own marker.", implication: "A single hourly rate cannot explain every choice.", response: "Put the applicable price on the slot, then itemize the total before payment." },
  { title: "Confirmed does not mean paid.", observed: "The venue flow can confirm a booking while payment remains unpaid.", implication: "A reservation and a collection are different states.", response: "Keep payment information attached to the booking without treating it as confirmation." },
  { title: "The calendar serves more than bookings.", observed: "The venue calendar distinguishes bookings, memberships and tournaments.", implication: "Recurring and one-off use compete for the same court time.", response: "Give operators a schedule that can be filtered by sport and court." },
] as const;
const comparison = [
  ["Primary question", "Can I play here at this time?", "What is happening across my courts?"],
  ["Working view", "Nearby venues and bookable slots", "Court calendar and booking list"],
  ["Payment context", "What will I pay? Is it paid?", "What was collected? What is still due?"],
  ["After confirmation", "View, share and get directions", "Track the booking, payment and occupancy"],
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className} data-slotgo-reveal>{children}</div>;
}
function ChapterLabel({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}
function Screen({ screen, caption = true, priority = false }: { screen: ProductScreen; caption?: boolean; priority?: boolean }) {
  return <figure className={styles.screen}>
    <div className={styles.screenBody}>
      <Image src={"/slotgo/" + screen.side + "-" + screen.file + ".png"} alt={"SlotGo " + (screen.side === "customer" ? "Customer App: " : "Venue App: ") + screen.description} width={806} height={1746} unoptimized priority={priority} sizes="(max-width: 640px) 76vw, (max-width: 1000px) 34vw, 280px" />
    </div>
    {caption && <figcaption><strong>{screen.label}</strong><span>{screen.description}</span></figcaption>}
  </figure>;
}
function SlotGoLogo() {
  return <span className={styles.logo}><i aria-hidden="true"><b /><b /><b /><b /></i><strong>Slot<span>Go</span></strong></span>;
}
function SharedState() {
  return <figure className={styles.sharedState} data-shared-state aria-label="A conceptual booking record connects the customer and venue experiences">
    <div className={styles.stateSide} data-booking-step="customer"><span>Customer App</span><strong>My booking</strong><p>Court, time, amount<br />and confirmation</p></div>
    <div className={styles.stateRecord} data-booking-step="record"><span>One shared booking record</span><strong>Same facts.<br />Different views.</strong><p>Court · Date &amp; time<br />Player · Payment · Status</p></div>
    <div className={styles.stateSide} data-booking-step="venue"><span>Venue App</span><strong>My schedule</strong><p>Booking, collection<br />and court occupancy</p></div>
    <figcaption>Product model: the information both experiences need to agree on, not a technical architecture diagram.</figcaption>
  </figure>;
}
function JourneyFlow({ side, title, steps, note }: { side: AppSide; title: string; steps: readonly (readonly [string, string])[]; note: string }) {
  return <article className={styles.journey}>
    <div className={styles.journeyHeading}><span>{side === "customer" ? "Customer App" : "Venue App"}</span><h3>{title}</h3></div>
    <ol className={styles.flowLine}>{steps.map(([label, detail], index) => <li key={label}><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><p>{detail}</p></li>)}</ol>
    <p className={styles.journeyNote}>{note}</p>
  </article>;
}
function DesignNotes({ notes }: { notes: readonly (readonly [string, string])[] }) {
  return <ol className={styles.designNotes}>{notes.map(([title, text], i) => <li key={title}><span>{String(i + 1).padStart(2, "0")}</span><div><h4>{title}</h4><p>{text}</p></div></li>)}</ol>;
}
function DeviceShowcase({ title, intro, notes, screens, reverse = false }: {
  title: string; intro: string; notes: readonly (readonly [string, string])[]; screens: readonly ProductScreen[]; reverse?: boolean;
}) {
  return <Reveal className={styles.showcase + (reverse ? " " + styles.showcaseReverse : "")}>
    <div className={styles.showcaseCopy}><h3>{title}</h3><p>{intro}</p><DesignNotes notes={notes} /></div>
    <div className={styles.devicePair}>{screens.map(screen => <Screen key={screen.file} screen={screen} />)}</div>
  </Reveal>;
}
type SketchKind = "home" | "explore" | "court" | "time" | "confirmation";
function Wireframe({ kind, title, question }: { kind: SketchKind; title: string; question: string }) {
  return <figure className={styles.wireframe}>
    <div className={styles.wirePhone} aria-hidden="true">
      <div className={styles.wireStatus}><span>9:41</span><span>•••</span></div>
      <strong className={styles.wireTitle}>{title}</strong>
      {kind === "home" && <><div className={styles.wireLine}>⌖ Playing near you</div><div className={styles.wireSearch}>Search venues or sports</div><div className={styles.wireCategories}><i /><i /><i /><i /></div><div className={styles.wireJobs}><span>Book a venue</span><span>Find a match</span></div><b className={styles.wireSubheading}>Nearby venues</b><div className={styles.wirePicture} /><div className={styles.wireLine}>Venue · Next slot</div></>}
      {kind === "explore" && <><div className={styles.wireSearch}>Search venues</div><div className={styles.wireFilters}><span>Sport</span><span>Time</span><span>Distance</span></div>{[1, 2, 3].map(n => <div className={styles.wireResult} key={n}><i /><span>Venue {n}<br /><small>Price · Next slot</small></span></div>)}</>}
      {kind === "court" && <><div className={styles.wireLine}>Selected venue</div><p className={styles.wireSubheading}>Choose a court</p>{[1, 2, 3].map(n => <div className={styles.wireCourt} key={n}><span>Court {n}<small>Sport · hourly rate</small></span><i /></div>)}<div className={styles.wireCta}>Continue →</div></>}
      {kind === "time" && <><div className={styles.wireLine}>Court · Selected date</div><div className={styles.wireDates}><span>Today</span><span>Wed</span><span>Thu</span></div><p className={styles.wireSubheading}>Time &amp; price</p><div className={styles.wireSlots}>{["6:00", "7:00", "8:00", "9:00", "10:00", "4:00", "5:00", "6:00", "7:00"].map((t, i) => <span key={i}>{t}<small>₹ price</small></span>)}</div><div className={styles.wireCta}>Review booking →</div></>}
      {kind === "confirmation" && <><div className={styles.wireCheck}>✓</div><b className={styles.wireConfirmed}>Booking confirmed</b><div className={styles.wireReceipt}><span>Venue / Court</span><span>Date / Time</span><span>Amount</span></div><div className={styles.wireJobs}><span>Directions</span><span>Share</span></div><div className={styles.wireCta}>View booking →</div></>}
    </div>
    <figcaption><strong>{title}</strong><span>{question}</span></figcaption>
  </figure>;
}

export default function SlotGoStory() {
  const rootRef = useRef<HTMLElement>(null);
  const topbarRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const topbar = topbarRef.current;
    if (!root || !topbar) return;
    const links = Array.from(topbar.querySelectorAll<HTMLAnchorElement>("[data-chapter]"));
    const sections = chapters.map(([id]) => root.querySelector<HTMLElement>(`#${id}`));
    let frame = 0;
    let previousChapter = -1;
    const update = () => {
      frame = 0;
      const threshold = topbar.offsetHeight + 96;
      let active = 0;
      sections.forEach((section, index) => { if (section && section.getBoundingClientRect().top <= threshold) active = index; });
      links.forEach((link, index) => {
        if (index === active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      const nav = links[active]?.parentElement;
      if (active !== previousChapter && nav && nav.scrollWidth > nav.clientWidth) {
        const link = links[active];
        nav.scrollLeft = Math.max(0, link.offsetLeft - nav.offsetLeft - (nav.clientWidth - link.clientWidth) / 2);
      }
      previousChapter = active;
      const distance = root.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / Math.max(1, distance)));
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    // Content remains visible without JavaScript; motion only enhances entry.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.15) return;
        if (!motion.matches) {
          if (entry.target.hasAttribute("data-shared-state")) entry.target.setAttribute("data-animate", "true");
          else entry.target.animate([{ opacity: 0.5, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 420, easing: "ease-out" });
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -30px" });
    root.querySelectorAll<HTMLElement>("[data-slotgo-reveal], [data-shared-state]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main className={styles.page} ref={rootRef}>
    <header className={styles.topbar} ref={topbarRef}>
      <Link href="/#work" aria-label="Back to Manoj Kumar’s selected work">Manoj Kumar N <HiArrowUpRight aria-hidden="true" /></Link>
      <nav aria-label="Case study chapters">{chapters.map(([id, label], index) => <a key={id} href={`#${id}`} data-chapter aria-current={index === 0 ? "location" : undefined}>{label}</a>)}</nav>
      <div className={styles.readingTrack} aria-hidden="true"><div ref={progressRef} /></div>
    </header>

    <section className={styles.section + " " + styles.hero} id="overview" aria-labelledby="case-title">
      <Image className={styles.heroBackdrop} src="/slotgo/hero-court.png" alt="" fill sizes="100vw" priority unoptimized />
      <div className={styles.heroCopy}>
        <SlotGoLogo /><ChapterLabel>Client product · Mobile UX</ChapterLabel>
        <h1 id="case-title" aria-label="Sports Booking & Venue Operations"><span>Sports Booking</span><span>&amp; Venue</span><span>Operations</span></h1>
        <p className={styles.heroIntro}>Helping players find a court—and venue teams keep the same booking in view.</p>
        <a className={styles.filmLink} href="#product-film">Watch product walkthrough <HiArrowUpRight aria-hidden="true" /></a>
        <dl className={styles.projectMeta}><div><dt>Role</dt><dd>Product Designer</dd></div><div><dt>Scope</dt><dd>Customer &amp; Venue Apps</dd></div></dl>
      </div>
      <HeroMockups />
    </section>

    <section className={styles.section + " " + styles.context} aria-labelledby="context-title">
      <div><ChapterLabel>The product</ChapterLabel><h2 id="context-title">One booking. Two experiences.<br /><em>One shared state.</em></h2></div>
      <div className={styles.roleGrid}>
        <article><span className={styles.roleNumber}>01 / Customer App</span><h3>For the people who play.</h3><p>Discover nearby venues, compare slots and prices, book a court, and keep the confirmation close. Matches and tournaments extend the experience beyond the reservation.</p></article>
        <article><span className={styles.roleNumber}>02 / Venue App</span><h3>For the teams behind every game.</h3><p>Manage bookings, check court occupancy, track payment status and organize memberships. A different working view of the same court, time and customer.</p></article>
      </div>
    </section>

    <section className={styles.section} id="process" aria-labelledby="problem-title">
      <Reveal className={styles.statementBox}><ChapterLabel>01 / Problem &amp; context</ChapterLabel><h2 id="problem-title">Booking a court should not depend on a phone call.</h2><p>The design challenge is the gap between finding a venue and knowing a booking is settled. Players need a definite time and price. Venue teams need that decision to fit the day’s schedule.</p></Reveal>
      <div className={styles.problemColumns}>
        <div><ChapterLabel>Customer problem</ChapterLabel><h3>A place to play is only half the answer.</h3><p>Discovery is incomplete without a usable slot, its price and a clear confirmation. Those answers need to stay together as the player moves through booking.</p></div>
        <div><ChapterLabel>Venue problem</ChapterLabel><h3>One venue.<br />Too many sources of truth.</h3><p>When calls, walk-ins and online requests are treated as separate records, staff have to reconcile the plan. The venue experience brings scheduling and collection into the same workspace.</p></div>
      </div>
    </section>

    <section className={styles.section + " " + styles.analysis} id="analysis" aria-labelledby="analysis-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>02 / Product analysis</ChapterLabel><h2 id="analysis-title">Where confidence<br />needs support.</h2><p className={styles.intro}>Four observations from the product screens connect the interface to the decisions it supports: availability, price, payment and court use.</p></Reveal>
      <div className={styles.findings}>{findings.map((finding, i) => <Reveal key={finding.title} className={styles.finding}><span className={styles.findingNumber}>{String(i + 1).padStart(2, "0")}</span><h3>{finding.title}</h3><p>{finding.observed}</p><p className={styles.implication}>{finding.implication}</p><div className={styles.designResponse}><span>Design response</span><p>{finding.response}</p></div></Reveal>)}</div>
      <Reveal className={styles.insight}><ChapterLabel>Core insight</ChapterLabel><h2>The real issue was not booking.<br /><em>It was fragmented state.</em></h2><p>The useful unit is not an isolated screen. It is a booking whose court, time, player, amount and status stay understandable from either side.</p></Reveal>
      <div className={styles.priorityBlock}>
        <div><ChapterLabel>Prioritization</ChapterLabel><h3>What had to work first.</h3><p>The core booking experience needs to be dependable before memberships and match features can add value.</p></div>
        <ol className={styles.priorities}>
          <li><span>01</span><div><h4>Accurate availability</h4><p>A choice the customer can make and the venue can schedule.</p></div></li>
          <li><span>02</span><div><h4>Booking confidence</h4><p>Time, price and confirmation made explicit before the handoff.</p></div></li>
          <li><span>03</span><div><h4>Payment visibility</h4><p>The amount due and the amount collected remain distinguishable.</p></div></li>
          <li><span>04</span><div><h4>Operational continuity</h4><p>Calendar, bookings and memberships support the work after checkout.</p></div></li>
        </ol>
      </div>
    </section>

    <section className={styles.section + " " + styles.model} id="structure" aria-labelledby="model-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>03 / Product model</ChapterLabel><h2 id="model-title">The booking is not the end.<br />It is the shared record.</h2><p className={styles.intro}>The two apps should not mirror each other. They should agree on the booking while giving each person the view their task needs.</p></Reveal>
      <SharedState />
      <div className={styles.jobs}><h3>Three connected jobs.<br />One coherent product.</h3><ol><li><span>Discover</span><p>Find a relevant venue and a playable time.</p></li><li><span>Book</span><p>Choose a slot, review the cost and confirm.</p></li><li><span>Operate</span><p>Place that booking in the court’s daily schedule.</p></li></ol></div>
      <div className={styles.comparisonBlock}><h3>One system, viewed from both sides.</h3><div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Compare customer and venue responsibilities"><table><caption className={styles.srOnly}>Customer and venue tasks around the same booking</caption><thead><tr><th scope="col">Booking context</th><th scope="col">Customer App</th><th scope="col">Venue App</th></tr></thead><tbody>{comparison.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div></div>
      <JourneyFlow side="customer" title="From finding a venue to a settled plan." steps={[["Discover", "Home → Explore"], ["Choose a court", "Court and hourly rate"], ["Choose when", "Date, time and slot price"], ["Review & pay", "Details, fees and total"], ["Confirmed", "View, directions and share"]]} note="The customer journey carries the chosen venue forward, so each step answers the next question instead of starting again." />
      <JourneyFlow side="venue" title="From a slot to a booking staff can manage." steps={[["Check the schedule", "Court and time context"], ["New booking", "Date, time and court"], ["Add the player", "Name, phone and notes"], ["Record payment", "Summary and paid / unpaid"], ["Confirmed", "Back to the booking list"]]} note="The venue’s booking flow has its own order: time first, then an available court, player details and payment status." />
    </section>

    <aside className={styles.section + " " + styles.references} aria-labelledby="references-title">
      <div><ChapterLabel>Reference review</ChapterLabel><h2 id="references-title">Useful references.<br />A different operating problem.</h2><p>Sports discovery and community are useful reference points. SlotGo’s case study focuses on the relationship between the player’s reservation and the operator’s schedule.</p></div>
      <div className={styles.referenceList}>
        <article><h3><a href="https://playo.co/" target="_blank" rel="noreferrer">Playo <HiArrowUpRight aria-hidden="true" /></a></h3><p>Its public experience connects venue booking with nearby games. The useful lens: distinguish finding a place from finding people to play with.</p></article>
        <article><h3><a href="https://hudle.in/" target="_blank" rel="noreferrer">Hudle <HiArrowUpRight aria-hidden="true" /></a></h3><p>Its sports and community entry points offer another discovery reference. For SlotGo, the additional design question is what the venue team needs after a booking.</p></article>
      </div>
    </aside>

    <section className={styles.section} aria-labelledby="exploration-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>04 / Structure &amp; exploration</ChapterLabel><h2 id="exploration-title">Paper first.<br />Sequence before polish.</h2><p className={styles.intro}>Strip the visual styling away and each screen should still have a different job. This low-fidelity reconstruction makes the existing booking sequence easier to read.</p></Reveal>
      <div className={styles.sketchGrid}><Wireframe kind="home" title="Home" question="Where do I want to play?" /><Wireframe kind="explore" title="Explore" question="Which venue works for me?" /><Wireframe kind="court" title="Court" question="Which court am I booking?" /><Wireframe kind="time" title="Date & time" question="When, and at what price?" /><Wireframe kind="confirmation" title="Confirmation" question="What has been confirmed?" /></div>
      <p className={styles.artifactNote}>Sequence study reconstructed from the supplied screens; not presented as original workshop sketches. Date and time are condensed here for readability.</p>
      <div className={styles.architecture}><h3>Navigation follows the work.</h3><div><strong>Customer App</strong><ul>{["Home", "Explore", "Play", "Bookings", "Profile"].map(item => <li key={item}>{item}</li>)}</ul></div><div><strong>Venue App</strong><ul>{["Home", "Bookings", "Calendar", "Membership", "More"].map(item => <li key={item}>{item}</li>)}</ul></div><p>The player moves between discovery and play. The operator moves between the booking record and the schedule.</p></div>
    </section>

    <section className={styles.section + " " + styles.solution} id="customer-app" data-app="customer" aria-labelledby="customer-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>05 / Customer App</ChapterLabel><h2 id="customer-title">Find a court.<br />Know what comes next.</h2><p className={styles.intro}>A booking journey organized around the decisions a player needs to make: place, court, time, cost and confirmation.</p></Reveal>
      <DeviceShowcase title="Start with where—and when." intro="Discovery brings practical details forward, before asking the player to commit to a venue." screens={[customerScreens.home, customerScreens.explore]} notes={[["Location sets the context", "The home screen anchors discovery to the player’s area and chosen sport."], ["Results answer more than distance", "Each venue shows price, rating and the next slot, making the comparison more useful."], ["Booking and play have separate paths", "Book a Venue and Find a Match serve different intentions without mixing the two flows."]]} />
      <DeviceShowcase reverse title="Make time and cost one decision." intro="Price is part of choosing a slot, not a surprise reserved for the last screen." screens={[customerScreens.time, customerScreens.summary]} notes={[["Put the price on the choice", "Every slot has its own amount, with peak-price and unavailable states visible."], ["Keep the selected context", "The summary brings venue, court, date and duration back into view."], ["Make the final amount explainable", "Court fee and additional fees are itemized before proceeding to payment."]]} />
      <Reveal className={styles.confirmationShowcase}><Screen screen={customerScreens.confirmed} /><div><ChapterLabel>Customer App / Confirmation</ChapterLabel><h3>A confirmation that stays useful.</h3><p>The booking does not disappear behind a success message. Court, date, time and amount remain visible, with directions, sharing and a route back to the booking.</p><DesignNotes notes={[["The answer", "This is the court and time that have been booked."], ["The next action", "Find the venue, share the plan or open the booking record."]]} /></div></Reveal>
      <a className={styles.collectionCta} href="#screen-collection"><span>See the complete screen collection<small>Court selection, payment, bookings, play and venue operations.</small></span><HiArrowLongRight aria-hidden="true" /></a>
    </section>

    <section className={styles.section + " " + styles.solution + " " + styles.venueSolution} id="venue-app" data-app="venue" aria-labelledby="venue-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>06 / Venue App</ChapterLabel><h2 id="venue-title">The same booking.<br />A different working day.</h2><p className={styles.intro}>For venue teams, a confirmation starts the operational work. The interface needs to support scanning a schedule, finding a booking and understanding what remains unpaid.</p></Reveal>
      <DeviceShowcase title="A schedule to scan. A record to act on." intro="The calendar and booking list show the same kind of information at different levels of detail." screens={[venueScreens.calendar, venueScreens.bookings]} notes={[["Time and court form the structure", "The calendar places bookings against court rows and a time axis."], ["Filters narrow the working view", "Sport, court and time scale controls help focus a crowded schedule."], ["Payment stays with the booking", "The list keeps the player, court, time and amount together with payment information."]]} />
      <DeviceShowcase reverse title="See the day beyond individual bookings." intro="Court use includes recurring members and organized play, not only one-off reservations." screens={[venueScreens.occupancy, venueScreens.members]} notes={[["Understand court use", "Occupancy summaries sit beneath the filtered schedule, close to operational actions."], ["Keep memberships visible", "Members and batches have their own view, with payment indicators beside the member."], ["Preserve distinct responsibilities", "Scheduling, collection and membership administration need context, not one overloaded screen."]]} />
      <div className={styles.designConsideration}><strong>A detail worth tightening</strong><p>The supplied booking list uses “Available” alongside a player’s reservation. Availability belongs to court inventory; booking and payment need separate, consistent status labels. That distinction is a concrete next refinement.</p></div>
    </section>

    <section className={styles.section + " " + styles.outcome} id="outcome" aria-labelledby="outcome-title">
      <Reveal className={styles.sectionHeading}><ChapterLabel>07 / Design outcomes</ChapterLabel><h2 id="outcome-title">What the interface<br />makes clearer.</h2><p className={styles.intro}>The work can be judged in the decisions it exposes and the continuity it creates. These are interface outcomes, not measured post-launch business results.</p></Reveal>
      <div className={styles.outcomeTable}><div className={styles.outcomeHeader}><span>The question</span><span>The designed response</span></div>{[["Is there a time I can actually book?", "Next-slot details in discovery; selectable and booked states in the time view."], ["What will this booking cost?", "Price on each slot, then an itemized summary and final payment amount."], ["What has been confirmed?", "A confirmation with court, date, time and amount, plus access to the booking."], ["What does the venue need to manage?", "Calendar, booking list, occupancy and membership views with operational context."]].map(([question, response]) => <div key={question}><h3>{question}</h3><p>{response}</p></div>)}</div>
      <Reveal className={styles.reflection}><ChapterLabel>Reflection</ChapterLabel><div><h3>Same facts.<br />Different priorities.</h3><p>The strongest part of SlotGo is the relationship between the two apps. I want a player to feel certain about one reservation while an operator can understand the whole day. That means designing around the booking record first, then choosing what each side needs to see.</p><p>The next validation should follow the handoff: does the player understand the final cost, can staff distinguish booked from paid, and do both sides recognize the same reservation? A successful checkout alone would not answer those questions.</p></div></Reveal>
    </section>
    <SlotGoShowcase />
    <footer className={styles.footer}><SlotGoLogo /><div><h2>Thank you for reading.</h2><p>Manoj Kumar N · Product Designer</p></div><Link href="/#work">Back to selected work <HiArrowLongRight aria-hidden="true" /></Link></footer>
  </main>;
}
