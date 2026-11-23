"use client";

import { useEffect, useRef, useState } from "react";
import { screenLibrary } from "./screenLibrary";
import ProductScreen from "./ProductScreen";
import styles from "./SlotGo.module.css";

const journeys = {
  customer: [
    ["customer-home", "Discover", "Begin with the place and sport."],
    ["customer-explore-list", "Explore", "Compare price, distance and the next slot."],
    ["customer-book-court", "Court", "Choose a court inside the venue."],
    ["customer-book-date", "Date", "Keep the selected court and choose a day."],
    ["customer-book-time", "Time", "Read the price before choosing a slot."],
    ["customer-book-summary", "Review", "Check the booking, fees and final total."],
    ["customer-book-payment", "Payment", "Review the payment method and amount."],
    ["customer-confirmed", "Confirmed", "Keep the booking, directions and sharing close."],
  ],
  venue: [
    ["venue-calendar", "Schedule", "Begin with the court schedule."],
    ["venue-book-time", "Time", "Select a date and a time."],
    ["venue-book-court", "Court", "Choose a court for the booking."],
    ["venue-book-player", "Player", "Attach the player details to the reservation."],
    ["venue-book-payment", "Payment", "Record whether payment is paid or unpaid."],
    ["venue-confirmed", "Confirmed", "Confirm the booking with its amount due."],
  ],
} as const;

export function SlotGoWalkthrough() {
  const [side, setSide] = useState<"customer" | "venue">("customer");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const sequence = journeys[side];
  const current = sequence[step];
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); if (media.matches) setPlaying(false); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && stage.current) {
        const rect = stage.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) setStep(index => (index + 1) % sequence.length);
      }
    }, 4500);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion, sequence.length]);
  function choose(index: number) { setStep(index); setPlaying(false); }
  return <div className={styles.walkthrough} ref={stage} id="product-film" aria-label="Original SlotGo screen walkthrough">
    <div className={styles.walkthroughCopy}><div className={styles.sideSwitch} role="group" aria-label="Choose a product journey">{(["customer", "venue"] as const).map(item => <button key={item} type="button" aria-pressed={side === item} onClick={() => {setSide(item);setStep(0);setPlaying(false);}}>{item === "customer" ? "Customer" : "Venue"}</button>)}</div><p className={styles.walkthroughQuestion}>{current[2]}</p><div className={styles.stepChoices} role="group" aria-label="Walkthrough steps">{sequence.map((item, index) => <button key={item[0]} type="button" aria-current={step === index ? "step" : undefined} onClick={() => choose(index)}>{item[1]}</button>)}</div><p className={styles.artifactNote}>Screen walkthrough from the original prototype exports. It does not create a reservation or process payment.</p><a className={styles.prototypeLink} href="https://www.figma.com/make/6mCDgpbsghqc75wOa6gw5z/ux?fullscreen=1" target="_blank" rel="noreferrer">Open the Figma Make prototype ↗</a></div>
    <div className={styles.walkthroughDisplay}><ProductScreen id={current[0]} /><div className={styles.playback}><button type="button" disabled={step === 0} onClick={() => choose(step - 1)} aria-label="Previous walkthrough screen">←</button><span>{current[1]}</span><button type="button" disabled={step === sequence.length - 1} onClick={() => choose(step + 1)} aria-label="Next walkthrough screen">→</button><button type="button" aria-pressed={playing} disabled={reducedMotion} onClick={() => setPlaying(value => !value)}>{playing ? "Pause" : "Play"}</button></div></div>
  </div>;
}

export default function ScreenLibrary() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const active = selected === null ? null : screenLibrary[selected];
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  function open(index: number, button: HTMLButtonElement) {
    opener.current = button; setSelected(index); dialog.current?.showModal();
  }
  function close() { dialog.current?.close(); }
  return <>
    <details className={styles.collection} id="screen-collection"><summary>Explore all 30 original screens <span>Customer and Venue apps</span></summary><div>{(["customer", "venue"] as const).map(side => <div className={styles.appCollection} key={side} data-showcase-app={side}><h3>{side === "customer" ? "Customer App" : "Venue App"}</h3><div className={styles.libraryGrid}>{screenLibrary.filter(item => item.side === side).map(screen => <figure key={screen.id}><button type="button" aria-label={`Enlarge ${side === "customer" ? "Customer" : "Venue"} App: ${screen.title}`} onClick={event => open(screenLibrary.indexOf(screen), event.currentTarget)}><ProductScreen id={screen.id} /></button><figcaption>{screen.title}</figcaption></figure>)}</div></div>)}</div></details>
    <dialog ref={dialog} className={styles.lightbox} aria-labelledby="screen-dialog-title" onClick={event => {if (event.target === event.currentTarget) close();}} onClose={() => {setSelected(null);opener.current?.focus();}} onKeyDown={event => {if (event.key === "ArrowRight" && selected !== null && selected < screenLibrary.length-1) {event.preventDefault();setSelected(selected+1);} if (event.key === "ArrowLeft" && selected !== null && selected > 0) {event.preventDefault();setSelected(selected-1);}}}><div className={styles.lightboxPanel}><header><div><p>{active?.side === "venue" ? "Venue App" : "Customer App"}</p><h2 id="screen-dialog-title">{active?.title ?? "Screen detail"}</h2></div><button type="button" onClick={close} aria-label="Close screen detail" autoFocus>×</button></header><div className={styles.expandedScreen}>{active && <ProductScreen id={active.id} raw />}</div><footer><button type="button" disabled={selected === null || selected === 0} onClick={() => setSelected(index => Math.max(0, (index ?? 0)-1))}>← Previous</button><span>{(selected ?? 0)+1} / 30</span><button type="button" disabled={selected === null || selected === screenLibrary.length-1} onClick={() => setSelected(index => Math.min(screenLibrary.length-1,(index ?? 0)+1))}>Next →</button></footer></div></dialog>
  </>;
}
