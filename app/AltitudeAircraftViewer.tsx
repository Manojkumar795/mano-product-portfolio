"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useShowcaseActivity } from "./useShowcaseActivity";

const FRAME_COUNT = 720;
const FRAME_WIDTH = 240;
const FRAME_HEIGHT = 156;
const FRAME_COLUMNS = 30;
const AUTO_DEGREES_PER_SECOND = 24;
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

/** One decoded, physically rendered angle per paint. Never blend two aircraft. */
function AltitudeAircraftViewer({ active, hidden = false, resetKey = 0 }: { active: boolean; hidden?: boolean; resetKey?: number }) {
  const { ref, running, reducedMotion } = useShowcaseActivity(active);
  const [ready, setReady] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sprite = useRef<HTMLImageElement | null>(null);
  const motion = useRef({ angle: 0, velocity: 0, dragging: false, pointer: -1, x: 0, time: 0, idleUntil: 0 });
  const paint = useRef<() => void>(() => {});
  const wake = useRef<() => void>(() => {});
  const lastReset = useRef(resetKey);

  useEffect(() => {
    if (lastReset.current === resetKey) return;
    lastReset.current = resetKey;
    Object.assign(motion.current, { angle: 0, velocity: 0, dragging: false, pointer: -1, idleUntil: performance.now() + 450 });
    paint.current(); wake.current();
  }, [resetKey]);

  useEffect(() => {
    if (!running || sprite.current) return;
    let disposed = false;
    const image = new Image();
    image.onload = async () => {
      try { await image.decode(); } catch { return; }
      if (disposed) return;
      if (image.naturalWidth !== FRAME_COLUMNS * FRAME_WIDTH || image.naturalHeight !== 24 * FRAME_HEIGHT) return;
      sprite.current = image;
      setReady(true);
    };
    image.src = "/altitude/boeing-777-smooth.webp";
    return () => { disposed = true; image.onload = null; };
  }, [running]);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!ready || !context || !canvas.current || !sprite.current) return;
    const image = sprite.current;
    const surface = canvas.current;
    let frame = 0, last = 0, painted = -1, reflection = NaN;
    const draw = () => {
      const angle = ((motion.current.angle % 360) + 360) % 360;
      const index = Math.round(angle * FRAME_COUNT / 360) % FRAME_COUNT;
      if (index === painted) return;
      context.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
      context.globalAlpha = 1;
      context.drawImage(image, (index % FRAME_COLUMNS) * FRAME_WIDTH, Math.floor(index / FRAME_COLUMNS) * FRAME_HEIGHT,
        FRAME_WIDTH, FRAME_HEIGHT, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
      painted = index;
      const nextReflection = 48 + Math.sin(angle * Math.PI / 180) * 14;
      if (!Number.isFinite(reflection) || Math.abs(nextReflection - reflection) >= 1) {
        surface.parentElement?.style.setProperty("--aircraft-reflection", `${nextReflection}%`);
        reflection = nextReflection;
      }
    };
    paint.current = draw;
    const tick = (now: number) => {
      frame = 0;
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      const m = motion.current;
      if (!m.dragging && !reducedMotion) {
        if (Math.abs(m.velocity) > .3) { m.angle = normalizeAngle(m.angle + m.velocity * dt); m.velocity *= Math.exp(-dt * 4); }
        else if (now > m.idleUntil) m.angle = normalizeAngle(m.angle + dt * AUTO_DEGREES_PER_SECOND);
      }
      draw();
      if (running && !reducedMotion) frame = requestAnimationFrame(tick);
    };
    wake.current = () => { if (!frame && running && !reducedMotion) { last = 0; frame = requestAnimationFrame(tick); } };
    draw();
    wake.current();
    return () => {
      cancelAnimationFrame(frame);
      Object.assign(motion.current, { dragging: false, pointer: -1, velocity: 0 });
      if (!Number.isFinite(motion.current.idleUntil)) motion.current.idleUntil = performance.now() + 4000;
      paint.current = () => {}; wake.current = () => {};
    };
  }, [ready, running, reducedMotion]);

  const rotate = (degrees: number) => {
    const m = motion.current;
    m.angle = normalizeAngle(m.angle + degrees); m.velocity = 0; m.idleUntil = performance.now() + 4000;
    paint.current(); wake.current();
  };
  const reset = () => {
    Object.assign(motion.current, { angle: 0, velocity: 0, dragging: false, pointer: -1, idleUntil: performance.now() + 4000 });
    paint.current(); wake.current();
  };

  return (
    <div ref={ref} className="altitude-aircraft-viewer" data-mode="exterior" hidden={hidden}>
      <div className="altitude-aircraft-display">
        <div className="altitude-exterior-view"
          role="group" aria-label="Boeing 777 exterior. Drag horizontally to rotate 360 degrees. Arrow keys rotate; Home resets."
          tabIndex={ready ? 0 : -1}
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) return;
            event.preventDefault(); event.stopPropagation();
            if (event.key === "Home") reset(); else rotate(event.key === "ArrowLeft" ? -10 : 10);
          }}
          onPointerDown={(event) => {
            if (!ready || event.button !== 0 || motion.current.dragging) return;
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            Object.assign(motion.current, { dragging: true, pointer: event.pointerId, x: event.clientX, time: event.timeStamp, velocity: 0, idleUntil: Infinity });
          }}
          onPointerMove={(event) => {
            const m = motion.current;
            if (!m.dragging || m.pointer !== event.pointerId) return;
            const delta = (event.clientX - m.x) * .55;
            m.angle = ((m.angle + delta) % 360 + 360) % 360;
            m.velocity = Math.max(-150, Math.min(150, delta / Math.max(.008, (event.timeStamp - m.time) / 1000)));
            m.x = event.clientX; m.time = event.timeStamp;
            paint.current();
          }}
          onLostPointerCapture={() => {
            motion.current.dragging = false;
            motion.current.pointer = -1;
            motion.current.idleUntil = performance.now() + 4000;
            wake.current();
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={(event) => {
            motion.current.velocity = 0;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}>
          <img className="altitude-aircraft-poster" src="/altitude/boeing-777-front.webp" alt="Boeing 777-300ER in a three-quarter view" width="320" height="208" hidden={ready} loading="lazy" />
          <canvas ref={canvas} width={FRAME_WIDTH} height={FRAME_HEIGHT} hidden={!ready} aria-hidden="true" />
        </div>

      </div>
      <div className="altitude-aircraft-identity"><strong>Boeing 777</strong><span>300ER</span></div>

    </div>
  );
}
export default memo(AltitudeAircraftViewer);
