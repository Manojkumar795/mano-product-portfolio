"use client";

import { memo, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useShowcaseActivity } from "../../../useShowcaseActivity";
import { useAutoplayResume } from "../idle-autoplay";
import "./Circadia.css";

const day = 1440;
const radius = 89;
const wrap = (minutes: number) => ((minutes % day) + day) % day;
const snap = (minutes: number) => Math.round(minutes / 5) * 5;
const signedDistance = (from: number, to: number) => wrap(to - from + day / 2) - day / 2;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => (value = clamp(value), value * value * (3 - 2 * value));
const times = [[0, 0], [2, 0], [4, 120], [6, 240], [8, 330], [9.6, 360], [10.45, 360], [12, 0]] as const;
type Handle = "bed" | "wake";
type Drag = { pointer: number; handle: Handle; minutes: number; velocity: number; at: number };

function minuteAt(seconds: number) {
  for (let i = 1; i < times.length; i++) {
    const [end, next] = times[i];
    if (seconds > end) continue;
    const [start, previous] = times[i - 1];
    const fraction = (seconds - start) / (end - start);
    return previous + (next - previous) * (i === times.length - 1 ? ease(fraction) : fraction);
  }
  return 0;
}

function point(minutes: number, r = radius) {
  const angle = minutes * Math.PI / 720;
  return [120 + Math.sin(angle) * r, 120 - Math.cos(angle) * r];
}

function clock(minutes: number) {
  const value = wrap(Math.round(minutes));
  const hour = Math.floor(value / 60);
  return { digits: `${hour % 12 || 12}:${String(value % 60).padStart(2, "0")}`, period: hour < 12 ? "AM" : "PM" };
}

// The two outlines share control points, so the crescent opens into the solar disc.
const crescentOutline = [
  [11.8, 5.5], [8, 5.6, 5.3, 8.6, 5.3, 12], [5.3, 15.7, 8.3, 18.7, 12, 18.7],
  [15.4, 18.7, 18.4, 16.1, 18.6, 12.6], [14.2, 16.2, 8.4, 11.2, 11.8, 5.5],
];
const sunOutline = [
  [12, 6], [8.7, 6, 6, 8.7, 6, 12], [6, 15.3, 8.7, 18, 12, 18],
  [15.3, 18, 18, 15.3, 18, 12], [18, 8.7, 15.3, 6, 12, 6],
];

function DaylightIcon({ light }: { light: number }) {
  const rays = ease((light - .62) / .38);
  const outline = crescentOutline.map((points, segment) =>
    points.map((point, index) => point + (sunOutline[segment][index] - point) * light).join(" ")
  );
  const rayLength = 1.1 + rays;
  return <g aria-hidden="true" className="cir-center-icon" transform="translate(108 84)" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M ${outline[0]} C ${outline.slice(1).join(" ")} Z`} />
    <g opacity={rays} strokeWidth="1.15">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle =>
        <path key={angle} d={`M12 3.2v-${rayLength}`} transform={`rotate(${angle} 12 12)`} />
      )}
    </g>
  </g>;
}

const stars = Array.from({ length: 37 }, (_, i) => ({
  x: (i * 47.73 + 7) % 240, y: (i * 23.49 + 3) % 179,
  r: i % 13 === 0 ? .56 : .19 + (i % 5) * .064,
  opacity: .23 + (i % 7) * .095,
}));

const Atmosphere = memo(function Atmosphere() {
  return <div className="circadia-sky" aria-hidden="true">
    <div className="cir-night-photo" />
    <div className="cir-dawn-photo" />
    <div className="cir-sunrise-photo" />
    <div className="cir-clouds">
      <div className="cir-night-photo" />
      <div className="cir-dawn-photo" />
      <div className="cir-sunrise-photo" />
    </div>
    <svg className="cir-stars" viewBox="0 0 240 426.667" preserveAspectRatio="xMidYMid slice" fill="#cbdcff">
      {stars.map(star => <circle key={star.x} cx={star.x} cy={star.y} r={star.r} opacity={star.opacity} />)}
    </svg>
    <div className="cir-moon-photo" />
    <div className="cir-sky-shade" />
  </div>;
});

export default function Circadia({ isPlaying = true, onAutoplayChange }: {
  isPlaying?: boolean; onAutoplayChange?: (playing: boolean) => void;
}) {
  const [bed, setBed] = useState(0);
  const [wake, setWake] = useState(0);
  const [selected, setSelected] = useState<Handle>("wake");
  const [manual, setManual] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const settle = useRef(0);
  const elapsed = useRef(0);
  const { ref, running, reducedMotion } = useShowcaseActivity(isPlaying && !manual);

  useEffect(() => {
    if (!running || reducedMotion) return;
    let last: number | undefined;
    let frame: number;
    const tick = (at: number) => {
      if (last !== undefined) elapsed.current = (elapsed.current + at - last) % 12000;
      last = at;
      setWake(minuteAt(elapsed.current / 1000));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reducedMotion]);

  useEffect(() => () => cancelAnimationFrame(settle.current), []);

  useAutoplayResume(() => {
    if (reducedMotion || !manual) return;
    cancelAnimationFrame(settle.current);
    elapsed.current = 0;
    setBed(0);
    setWake(0);
    setSelected("wake");
    setManual(false);
  });

  function begin(handle: Handle) {
    cancelAnimationFrame(settle.current);
    setManual(true);
    setSelected(handle);
    onAutoplayChange?.(false);
  }

  function minutesAt(event: PointerEvent<SVGGElement>) {
    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return 0;
    return wrap(Math.atan2(event.clientX - rect.left - rect.width / 2, rect.top + rect.height / 2 - event.clientY) * 720 / Math.PI);
  }

  function update(handle: Handle, minutes: number) {
    if (handle === "bed") setBed(minutes);
    else setWake(minutes);
  }

  function pointerDown(event: PointerEvent<SVGGElement>, handle: Handle) {
    if (!event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    begin(handle);
    drag.current = { pointer: event.pointerId, handle, minutes: minutesAt(event), velocity: 0, at: event.timeStamp };
    update(handle, snap(drag.current.minutes));
  }

  function pointerMove(event: PointerEvent<SVGGElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    const distance = signedDistance(current.minutes, minutesAt(event));
    current.minutes += distance;
    current.velocity = distance / Math.max(8, event.timeStamp - current.at);
    current.at = event.timeStamp;
    update(current.handle, snap(current.minutes));
  }

  function pointerEnd(event: PointerEvent<SVGGElement>, cancelled = false) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    drag.current = null;
    if (cancelled || reducedMotion || event.timeStamp - current.at > 90) return;
    const start = snap(current.minutes);
    const target = snap(current.minutes + Math.max(-15, Math.min(15, current.velocity * 33)));
    if (start === target) return;
    const origin = performance.now();
    const tick = (now: number) => {
      const t = (now - origin) / 1000;
      const offset = (1 + 24 * t) * Math.exp(-24 * t);
      update(current.handle, t >= .28 ? target : target + (start - target) * offset);
      if (t < .28) settle.current = requestAnimationFrame(tick);
    };
    settle.current = requestAnimationFrame(tick);
  }

  function keyboard(event: KeyboardEvent<SVGGElement>, handle: Handle) {
    const delta = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 60, PageDown: -60 }[event.key];
    if (delta === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    begin(handle);
    const value = handle === "bed" ? bed : wake;
    update(handle, event.key === "Home" ? 0 : event.key === "End" ? 1435 : snap(value) + (delta ?? 0));
  }

  const current = selected === "bed" ? bed : wake;
  const time = clock(reducedMotion || manual ? snap(current) : current);
  const hour = wrap(current) / 60;
  const daylight = ease((hour - 3.1) / 2.9) * (1 - ease((hour - 17) / 4));
  const sunrise = ease((hour - 4.55) / 1.45) * (1 - ease((hour - 9) / 5));
  const moon = 1 - ease((hour - 2) / 3.2) * (1 - ease((hour - 18) / 4));
  const span = wrap(wake - bed);
  const [sx, sy] = point(bed);
  const [ex, ey] = point(wake);
  const arc = span < .035 ? "" : `M ${sx} ${sy} A ${radius} ${radius} 0 ${span > 720 ? 1 : 0} 1 ${ex} ${ey}`;
  const overlap = clamp(1 - Math.abs(signedDistance(bed, wake)) / 53);
  const lighting = {
    "--cir-day": daylight, "--cir-sun": sunrise, "--cir-moon": moon,
    "--cir-moon-x": `${Math.min(hour, 6) * 2.1}px`, "--cir-moon-y": `-${Math.min(hour, 6) * 2.7}px`, "--cir-cloud-drift": `${Math.sin(hour * Math.PI / 12) * 6}px`,
  } as CSSProperties;

  return <div ref={ref} className="circadia" style={lighting} role="region" aria-label="Circadia sleep dial">
    <Atmosphere />
    <svg className="circadia-dial" ref={svg} viewBox="0 0 240 240" aria-label="24-hour sleep schedule">
      <defs>
        <linearGradient id="cir-glass" x1=".12" y1="0" x2=".82" y2="1"><stop stopColor="#adc8ff" stopOpacity=".56" /><stop offset=".34" stopColor="#385488" stopOpacity=".29" /><stop offset=".67" stopColor="#6983bb" stopOpacity=".11" /><stop offset="1" stopColor="#c088ce" stopOpacity=".52" /></linearGradient>
        <linearGradient id="cir-edge" x1=".25" x2=".84" y2="1"><stop stopColor="#a1c8ff" stopOpacity=".87" /><stop offset=".46" stopColor="#81a9ef" stopOpacity=".15" /><stop offset=".8" stopColor="#bfb0ed" stopOpacity=".65" /><stop offset="1" stopColor="#eac5e8" stopOpacity=".35" /></linearGradient>
        <linearGradient id="cir-arc" gradientUnits="userSpaceOnUse" x1={sx} y1={sy} x2={ex} y2={ey}><stop stopColor="#57c3ff" /><stop offset=".38" stopColor="#376afb" /><stop offset=".72" stopColor="#8973ea" /><stop offset="1" className="cir-arc-end" /></linearGradient>
        <radialGradient id="cir-bed" cx="40%" cy="27%" r="77%"><stop stopColor="#4c91f7" /><stop offset=".72" stopColor="#153c90" /><stop offset="1" stopColor="#74d5ff" /></radialGradient>
        <radialGradient id="cir-wake" cx="42%" cy="31%" r="76%"><stop stopColor="#ffda91" /><stop offset=".73" stopColor="#b5632c" /><stop offset="1" stopColor="#ffdd83" /></radialGradient>
      </defs>
      <circle cx="120" cy="120" r="101" fill="none" stroke="#adc9ff" strokeOpacity=".12" />
      <circle cx="120" cy="120" r="89" fill="#090d2070" stroke="url(#cir-glass)" strokeWidth="18" />
      <circle cx="120" cy="120" r="98" fill="none" stroke="url(#cir-edge)" strokeWidth=".8" />
      <circle cx="120" cy="120" r="80" fill="none" stroke="#c8dfff" strokeOpacity=".27" strokeWidth=".65" />
      <path className="cir-warm-reflection" d="M 218 120 A 98 98 0 0 1 125 218" fill="none" stroke="#ffd59d" strokeWidth="1.1" />
      {arc && <g fill="none" stroke="url(#cir-arc)" strokeLinecap="round"><path d={arc} strokeWidth="16" className="cir-progress" /><path d={arc} strokeWidth="12" opacity=".45" transform="translate(2.4 2.4) scale(.98)" /></g>}
      {Array.from({ length: 24 }, (_, index) => {
        const major = index % 6 === 0;
        const [x1, y1] = point(index * 60, major ? 73 : 74);
        const [x2, y2] = point(index * 60, major ? 78 : 77);
        return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#dbe9ff" strokeWidth={major ? 1 : .7} opacity={major ? .9 : .45} />;
      })}
      <g className="cir-hours" textAnchor="middle"><text x="120" y="56">12a</text><text x="185" y="124">6a</text><text x="120" y="191">12p</text><text x="55" y="124">6p</text></g>
      <DaylightIcon light={daylight} />
      <text className="cir-time" x="120" y="131" textAnchor="middle">{time.digits} <tspan>{time.period}</tspan></text>
      {(["bed", "wake"] as const).map(handle => {
        const bedtime = handle === "bed";
        const minutes = bedtime ? bed : wake;
        const [x, y] = point(minutes, radius + (bedtime ? 9 : -18) * overlap);
        const label = clock(snap(minutes));
        return <g key={handle} className={`cir-handle cir-${handle}`} transform={`translate(${x} ${y})`}
          role="slider" tabIndex={0} aria-label={bedtime ? "Bedtime" : "Wake-up time"}
          aria-valuemin={0} aria-valuemax={1435} aria-valuenow={Math.min(1435, Math.round(wrap(snap(minutes))))}
          aria-valuetext={`${label.digits} ${label.period}`} onKeyDown={event => keyboard(event, handle)}
          onPointerDown={event => pointerDown(event, handle)} onPointerMove={pointerMove}
          onPointerUp={event => pointerEnd(event)} onPointerCancel={event => pointerEnd(event, true)}
          onLostPointerCapture={event => pointerEnd(event, true)}>
          <circle className="cir-hit" r="18" fill="transparent" />
          <circle className="cir-knob" r="12.3" fill={`url(#cir-${handle})`} stroke={bedtime ? "#9bd8ff" : "#ffe3a7"} strokeWidth=".8" />
          {bedtime ? <path d="M-6 5V-1m12 6V-1M-6 2H6m-10-3v-2q0-1 1-1h6q1 0 1 1v2M-6 0h12" />
            : <path d="M0-3v3h2m-5 4-2 2m8-2 2 2M-5-4l1-1m8 0 1 1M4.3 0a4.3 4.3 0 1 1-8.6 0 4.3 4.3 0 0 1 8.6 0Z" />}
        </g>;
      })}
    </svg>
    <div className="cir-caption">
      <span>Circadia</span>
      <span className="cir-byline">by Mano</span>
    </div>
  </div>;
}
