import { useEffect, useRef, useState } from "react"
import { motion, MotionConfig } from "motion/react"
import "./DigitalTicket.css"
import { useAutoplayResume } from "./idle-autoplay"

export interface DigitalTicketProps {
  /** Run the silent eight-second flip-to-scan demo. Manual interaction pauses it for twelve seconds. */
  isPlaying?: boolean
}

const spring = { type: "spring" as const, stiffness: 170, damping: 26 }
const qrCells: React.ReactNode[] = []
for (let y = 0; y < 25; y++) {
  for (let x = 0; x < 25; x++) {
    const finder = [
      [0, 0],
      [18, 0],
      [0, 18],
    ].find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7)
    let filled = (x * 17 + y * 31 + x * y * 7) % 13 < 6
    if (finder) {
      const dx = x - finder[0],
        dy = y - finder[1]
      filled =
        dx === 0 ||
        dx === 6 ||
        dy === 0 ||
        dy === 6 ||
        (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
    }
    if (filled)
      qrCells.push(
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx=".16" />,
      )
  }
}

function DecorativeQR() {
  return (
    <svg
      viewBox="-2 -2 29 29"
      className="dt-qr"
      role="img"
      aria-label="Decorative demo QR pattern, not a valid admission code"
    >
      <rect x="-2" y="-2" width="29" height="29" fill="#ffffff" />
      <g fill="#241c22">{qrCells}</g>
      <rect x="7" y="9" width="11" height="7" rx=".5" fill="#ffffff" />
      <text
        x="12.5"
        y="13.7"
        textAnchor="middle"
        fill="#6c4654"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize="3"
        letterSpacing=".25"
      >
        DEMO
      </text>
    </svg>
  )
}

function CreatorCredit() {
  return (
    <div className="dt-credit">
      Interaction by <strong>Mano</strong>
    </div>
  )
}

export default function DigitalTicket({
  isPlaying = true,
}: DigitalTicketProps) {
  const [back, setBack] = useState(false)
  const [scan, setScan] = useState<"idle" | "scanning" | "success">("idle")
  const [manualRevision, setManualRevision] = useState(0)
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const [videoFailed, setVideoFailed] = useState(false)
  const video = useRef<HTMLVideoElement>(null)
  const frontControl = useRef<HTMLButtonElement>(null)
  const backControl = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  const backRef = useRef(back)
  backRef.current = back
  const manualUntil = useRef(0)
  useAutoplayResume(() => { manualUntil.current = 0; setManualRevision(value => value + 1) })

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!isPlaying || reduced) return
    const timers = new Set<ReturnType<typeof setTimeout>>()
    function schedule(delay: number, action: () => void) {
      const timer = setTimeout(() => {
        timers.delete(timer)
        action()
      }, delay)
      timers.add(timer)
    }
    function loop() {
      if (backRef.current) {
        schedule(1500, () => setBack(false))
        schedule(3200, () => setBack(true))
        schedule(6500, () => setBack(false))
      } else {
        schedule(1800, () => setBack(true))
        schedule(6000, () => setBack(false))
      }
      schedule(8000, loop)
    }
    const remaining = Math.max(0, manualUntil.current - Date.now())
    if (remaining) schedule(remaining, loop)
    else loop()
    return () => timers.forEach(clearTimeout)
  }, [isPlaying, reduced, manualRevision])

  useEffect(() => {
    if (!back) {
      setScan("idle")
      return
    }
    setScan(reduced ? "scanning" : "idle")
    const timers: ReturnType<typeof setTimeout>[] = []
    if (!reduced) timers.push(setTimeout(() => setScan("scanning"), 800))
    timers.push(setTimeout(() => setScan("success"), reduced ? 900 : 2400))
    return () => timers.forEach(clearTimeout)
  }, [back, reduced])

  useEffect(() => {
    if (!restoreFocus.current) return
    restoreFocus.current = false
    const control = back ? backControl.current : frontControl.current
    control?.focus({ preventScroll: true })
  }, [back])

  useEffect(() => {
    const element = video.current
    if (!element || videoFailed) return
    let cancelled = false
    function mediaError() {
      if (cancelled) return
      setVideoFailed(true)
    }
    element.addEventListener("error", mediaError)
    // Metadata can fail before React attaches its event handler.
    if (element.error) mediaError()
    const shouldPlay = !back && isPlaying && !reduced
    element.muted = true
    if (shouldPlay) element.play().catch(() => {
        if (element.error) mediaError()
      })
    else element.pause()
    return () => {
      cancelled = true
      element.removeEventListener("error", mediaError)
      element.pause()
    }
  }, [back, isPlaying, reduced, videoFailed])

  function takeControl() {
    manualUntil.current = Date.now() + 12000
    setManualRevision((value) => value + 1)
  }
  function flip() {
    takeControl()
    restoreFocus.current = true
    setBack((value) => !value)
  }

  const transition = reduced ? { duration: 0 } : spring
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <motion.article
        className={`digital-ticket ${
          back ? "dt-showing-back" : "dt-showing-front"
        }`}
        data-side={back ? "back" : "front"}
        initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={transition}
      >
        <motion.div
          className="dt-flipper"
          initial={false}
          animate={{ rotateY: back ? 180 : 0 }}
          transition={transition}
        >
          <div className="dt-face dt-front" aria-hidden={back} inert={back}>
            <div className="dt-art">
              {videoFailed ? (
                <img src="/playground/concert.jpg" alt="" draggable={false} />
              ) : (
                <video
                  ref={video}
                  src="/playground/concert-banner.mp4"
                  poster="/playground/concert.jpg"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              )}
              <h3>
                THE
                <br />
                MIDNIGHT
              </h3>
            </div>
            <div className="dt-paper">
              <div className="dt-perforation" />
              <div className="dt-info">
                <div>
                  <small>Date</small>
                  <strong>24 OCT 2026</strong>
                  <span>Doors 7:00 PM</span>
                </div>
                <div>
                  <small>Venue</small>
                  <strong>Alexandra Palace</strong>
                  <span>London, UK</span>
                </div>
              </div>
              <div className="dt-stub">
                <div>
                  <small>Seat</small>
                  <strong>Floor · A12</strong>
                </div>
                <span className="dt-flip-hint">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 8a8 8 0 0 1 14-2l2 2M20 3v5h-5M20 16a8 8 0 0 1-14 2l-2-2M4 21v-5h5" />
                  </svg>
                  Flip to scan
                </span>
              </div>
              <CreatorCredit />
            </div>
            <button
              ref={frontControl}
              type="button"
              className="dt-turn-control"
              aria-label="Flip THE MIDNIGHT demo ticket to scan"
              aria-pressed={false}
              onClick={(event) => {
                event.stopPropagation()
                flip()
              }}
            />
          </div>
          <div className="dt-face dt-back" aria-hidden={!back} inert={!back}>
            <div className="dt-back-header">
              <span>THE MIDNIGHT</span>
              <span className="dt-seat-pill">Floor · A12</span>
            </div>
            <div className="dt-scan-paper">
              <div className="dt-scan-heading">
                <h3>Ready for Entry</h3>
              </div>
              <div className="dt-scan-code">
                <DecorativeQR />
                {back && scan === "scanning" && !reduced && (
                  <motion.span
                    className="dt-scan-line"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: [0, 164, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                )}
              </div>
              <p className="dt-demo-warning">Demo pass · Not valid for entry</p>
              <div
                className={`dt-scan-status ${
                  scan === "success" ? "complete" : ""
                }`}
                role="status"
                aria-live={manualUntil.current > Date.now() ? "polite" : "off"}
              >
                {scan === "success" ? (
                  <>
                    <motion.span
                      className="dt-scan-check"
                      initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={transition}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12 4 4 10-10" />
                      </svg>
                    </motion.span>
                    Demo scan complete
                  </>
                ) : scan === "scanning" ? (
                  "Simulating scan…"
                ) : (
                  "Demo scan ready"
                )}
              </div>
              <CreatorCredit />
            </div>
            <button
              ref={backControl}
              type="button"
              className="dt-turn-control"
              aria-label="Flip THE MIDNIGHT demo ticket to event details"
              aria-pressed
              onClick={(event) => {
                event.stopPropagation()
                flip()
              }}
            />
          </div>
        </motion.div>
      </motion.article>
    </MotionConfig>
  )
}
