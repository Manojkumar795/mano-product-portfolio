import { useEffect, useRef, useState } from "react"
import { LayoutGroup, MotionConfig } from "motion/react"
import { useId } from "react"
import "./playground.css"
import { useAutoplayResume } from "../idle-autoplay"

export interface DemoProps {
  isPlaying?: boolean
}
export const spring = { type: "spring" as const, stiffness: 230, damping: 27 }
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  )
export const assets = {
  sneaker: "/playground/sneaker.jpg",
  pizza: "/playground/pizza-cheese-base.jpg",
  concert: "/playground/concert.jpg",
}
type Cue = {
  at: number
  run: () => void
}

export function Stage({
  children,
  ...props
}: React.ComponentPropsWithRef<"section">) {
  const id = useId()
  const reduced = useMotionPreference()
  return (
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>
      <LayoutGroup id={id}>
        <section {...props}>{children}</section>
      </LayoutGroup>
    </MotionConfig>
  )
}

function useMotionPreference() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  return reduced
}

export function useDemo(
  isPlaying: boolean,
  cues: Cue[],
  reset: () => void,
  duration = 9000,
) {
  const reduced = useMotionPreference()
  const latest = useRef({ cues, reset })
  latest.current = { cues, reset }
  const [held, setHeld] = useState(false)
  const [cycle, setCycle] = useState(0)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useAutoplayResume(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    setHeld(false); setCycle(value => value + 1)
  })
  useEffect(() => {
    if (held || !isPlaying || reduced) return
    latest.current.reset()
    const timers = latest.current.cues.map((cue) =>
      setTimeout(() => cue.run(), cue.at),
    )
    timers.push(setTimeout(() => setCycle((value) => value + 1), duration))
    return () => timers.forEach(clearTimeout)
  }, [isPlaying, reduced, held, cycle, duration])
  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
    },
    [],
  )
  function takeControl() {
    setHeld(true)
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = setTimeout(() => setHeld(false), 12000)
  }
  return {
    takeControl,
    reduced: !!reduced,
    label: held
      ? "Your turn"
      : reduced
        ? "Reduced motion"
        : isPlaying
          ? "Auto demo"
          : "Demo paused",
  }
}

export function useTimers() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clear, [])
  return {
    clear,
    after: (delay: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, delay))
    },
  }
}

export function Icon({
  name,
  size = 20,
}: {
  name: "bag" | "check" | "arrow" | "close" | "card" | "ticket" | "plus" | "minus"
  size?: number
}) {
  const paths = {
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M8 7V5a4 4 0 0 1 8 0v2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: (
      <>
        <path d="M4 12h16M14 6l6 6-6 6" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Z" />
        <path d="M15 6v12" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function Loading() {
  return <span className="pg-spinner" aria-hidden="true" />
}

export function useSheetFocus(
  open: boolean,
  ref: React.RefObject<HTMLDivElement | null>,
  close: () => void,
) {
  const latestClose = useRef(close)
  latestClose.current = close
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const timer = setTimeout(
      () => ref.current?.querySelector<HTMLElement>("button")?.focus(),
      50,
    )
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") latestClose.current()
      if (event.key !== "Tab") return
      const items = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input, [tabindex='0']",
        ) ?? [],
      )
      const first = items[0],
        last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener("keydown", key)
    return () => {
      clearTimeout(timer)
      document.removeEventListener("keydown", key)
      previous?.focus()
    }
  }, [open, ref])
}
