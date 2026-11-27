"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { SiYoutube } from "react-icons/si";
import { useShowcaseActivity } from "../../../useShowcaseActivity";
import "./Milestone.css";

const counts = [24_980, 24_983, 24_987, 24_986, 24_990, 24_994, 24_999, 25_000, 25_003, 25_001, 24_998, 24_992, 24_985, 24_981] as const;
const format = new Intl.NumberFormat("en-US");
const target = 25_000;
const confetti = [
  [-42, -28, -155], [-37, -15, 120], [-31, -41, -210], [-21, -32, 185],
  [-12, -42, -130], [7, -38, 165], [19, -42, 200], [27, -31, -140],
  [38, -37, 190], [43, -22, -180], [-43, 22, 160], [-32, 30, -195],
  [33, 28, 150], [43, 17, -145],
] as const;

function FlipDigit({ digit, previous }: { digit: string; previous: string }) {
  return <span className="ml-digit">
    <span className="ml-digit-face">{digit}</span>
    {previous !== digit && <span className="ml-flaps">
      <span className="ml-flap ml-flap-old"><span>{previous}</span></span>
      <span className="ml-flap ml-flap-new"><span>{digit}</span></span>
    </span>}
  </span>;
}

export default function Milestone() {
  const [frame, setFrame] = useState(0);
  const { ref, running, reducedMotion } = useShowcaseActivity(true);

  useEffect(() => {
    if (!running || reducedMotion) return;
    const timer = window.setInterval(() => setFrame(current => current + 1), 1500);
    return () => window.clearInterval(timer);
  }, [running, reducedMotion]);

  const count = counts[frame % counts.length];
  const previousCount = counts[Math.max(0, frame - 1) % counts.length];
  const displayed = format.format(count);
  const previous = format.format(previousCount);
  const direction = count === previousCount ? "steady" : count > previousCount ? "up" : "down";
  const celebrating = previousCount < target && count >= target;
  const DirectionIcon = direction === "up" ? FiArrowUp : FiArrowDown;

  return <div className="ml-container" ref={ref}>
    <section className="ml-card" aria-labelledby="ml-title" data-celebrating={celebrating}>
      {celebrating && !reducedMotion && <div className="ml-celebration" aria-hidden="true">
        {confetti.map(([x, y, spin]) => (
          <span className="ml-confetti" key={x + ":" + y} style={{
            "--ml-x": `${x}cqi`,
            "--ml-y": `${y}cqi`,
            "--ml-spin": `${spin}deg`,
          } as CSSProperties} />
        ))}
      </div>}
      <div className="ml-display">
        <header className="ml-header">
          <div className="ml-brand"><SiYoutube aria-hidden="true" /> YouTube</div>
          <h2 id="ml-title">Subscribers</h2>
        </header>
        <div className="ml-counter" role="img" aria-label={`${displayed} subscribers, simulated`}>
          {[...displayed].map((digit, index) => digit === ","
            ? <span className="ml-comma" key="comma" aria-hidden="true">,</span>
            : <FlipDigit key={`${index}-${digit}`} digit={digit} previous={previous[index]} />)}
        </div>
        <div className="ml-update" data-direction={direction}>
          {celebrating
            ? <span className="ml-milestone-label">25K milestone</span>
            : <>
              {direction === "steady"
                ? <span className="ml-update-dot" aria-hidden="true" />
                : <DirectionIcon role="img" aria-label={direction === "up" ? "Count increased" : "Count decreased"} />}
              <span>Live update</span>
            </>}
        </div>
        <div className="ml-announcement" role="status">
          {celebrating ? "25,000 subscribers reached in the demo." : ""}
        </div>
      </div>
      <p className="ml-credit">By Mano</p>
    </section>
  </div>;
}
