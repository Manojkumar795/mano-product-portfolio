import { useEffect, useId, useLayoutEffect, useMemo, useReducer, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, animate, motion, MotionConfig, useIsPresent, useMotionValue, useReducedMotion, useTransform, type PanInfo, type MotionValue } from "motion/react"
import { movies } from "./movies"
import { agreement, availableMovies, createReducer, fitsFilters, initialState, runtimeLabel, unanimous, type Genre, type Mood, type Movie, type Vote } from "./model"
import { Icon } from "./icons"
import CreatorCredit from "../CreatorCredit"
import NightSky from "./NightSky"
import { nextDemoStep } from "./autoplay"
import DemoCursor from "./DemoCursor"
import { posterState, preloadPosters } from "./posters"
import "./Tonight.css"
import { useAutoplayResume } from "../idle-autoplay"

const reducer = createReducer(movies)
const people = [{ name: "You", initials: "Y", color: "rose" }, { name: "Alex", initials: "A", color: "blue" }, { name: "Sam", initials: "S", color: "gold" }, { name: "Riya", initials: "R", color: "violet" }]
export interface TonightProps { onChoose?: (movie: Movie) => void; className?: string; isPlaying?: boolean; onAutoplayChange?: (playing: boolean) => void }

function Avatar({ index, vote, size = "small" }: { index: number; vote?: Vote; size?: "small" | "large" }) {
  const person = people[index]
  return <span className={`tn-avatar ${person.color} ${size}`} aria-hidden="true"><span>{person.initials}</span>{vote && <i className={vote}><Icon name={vote === "like" ? "heart" : "pass"} size={10} filled={vote === "like"} /></i>}</span>
}
function PosterCard({ movie, stage, onVote, disabled, reduced, demoMovieId, demoDragX, layoutScope, autoPlaying }: { movie: Movie; stage: number; onVote: (vote: Vote) => void; disabled: boolean; reduced: boolean; demoMovieId: string | null; demoDragX: MotionValue<number>; layoutScope: string; autoPlaying: boolean }) {
  const card = useRef<HTMLElement>(null)
  const front = stage === 0
  const present = useIsPresent()
  const x = useMotionValue(0)
  const baseTilt = useMotionValue(0)
  const pointerTilt = useMotionValue(0)
  const rotate = useTransform(() => reduced ? 0 : x.get() / 18 + baseTilt.get() + pointerTilt.get())
  const likeOpacity = useTransform(x, [0, 95], [0, 1])
  const passOpacity = useTransform(x, [-95, 0], [1, 0])
  const dragging = useRef(false)
  const firstPlacement = useRef(true)
  const [loaded, setLoaded] = useState(() => posterState(movie.poster) === "ready")
  const [failed, setFailed] = useState(() => posterState(movie.poster) === "failed")
  useLayoutEffect(() => {
    if (!present || !card.current) return
    let stopPosition: (() => void) | undefined, stopTilt: (() => void) | undefined
    function place() {
      if (front && demoMovieId === movie.id) return
      const styles = getComputedStyle(card.current!)
      const shift = parseFloat(styles.getPropertyValue("--tn-back-shift")) || 53
      const tilt = parseFloat(styles.getPropertyValue("--tn-back-angle")) || 7
      const sign = stage === 1 ? -1 : 1
      const position = front ? 0 : sign * shift
      const angle = front || reduced ? 0 : sign * (tilt - shift / 18)
      stopPosition?.(); stopTilt?.()
      if (firstPlacement.current || reduced) { x.set(position); baseTilt.set(angle); firstPlacement.current = false }
      else {
        const movement = animate(x, position, { type: "spring", stiffness: 680, damping: 54, mass: 1.05 })
        const rotation = animate(baseTilt, angle, { type: "spring", stiffness: 680, damping: 54, mass: 1.05 })
        stopPosition = () => movement.stop(); stopTilt = () => rotation.stop()
      }
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(card.current)
    return () => { observer.disconnect(); stopPosition?.(); stopTilt?.() }
  }, [front, stage, reduced, present, demoMovieId, movie.id, x, baseTilt])
  useEffect(() => {
    if (!autoPlaying) return
    const controls = animate(pointerTilt, 0, { duration: reduced ? 0 : .4 })
    return () => controls.stop()
  }, [autoPlaying, reduced, pointerTilt])
  useEffect(() => {
    if (!front || !present || demoMovieId !== movie.id) return
    x.set(demoDragX.get())
    return demoDragX.on("change", (position) => x.set(position))
  }, [front, present, demoMovieId, movie.id, demoDragX, x])
  function dragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    dragging.current = false
    if (!disabled && (Math.abs(info.offset.x) > 90 || (Math.abs(info.velocity.x) > 700 && Math.abs(info.offset.x) > 25))) onVote(info.offset.x > 0 ? "like" : "pass")
    else animate(x, 0, reduced ? { duration: 0 } : { type: "spring", stiffness: 230, damping: 30 })
  }
  return <motion.article ref={card} className={`tn-movie-card ${front ? "tn-front-card" : `tn-back-card ${stage === 1 ? "left" : "right"}`}`} data-movie-id={movie.id} data-stage={stage}
    layout layoutId={reduced ? undefined : `${layoutScope}-${movie.id}-card`} tabIndex={front ? 0 : -1} inert={!front} aria-hidden={!front}
    aria-label={front ? `${movie.title}. ${runtimeLabel(movie.minutes)}. Use right arrow to like, left arrow to pass.` : undefined}
    drag={front && !disabled ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.85} dragMomentum={false}
    onDragStart={() => { dragging.current = true }} onDragEnd={dragEnd}
    onPointerMove={(event) => { if (front && !autoPlaying && !dragging.current && !reduced) { const bounds = event.currentTarget.getBoundingClientRect(); pointerTilt.set(((event.clientX - bounds.left) / bounds.width - .5) * 4) } }}
    onPointerLeave={() => { if (!dragging.current) animate(pointerTilt, 0, { duration: .4 }) }}
    style={{ x, rotate }} initial={false} animate={{ opacity: 1, scale: 1 }}
    variants={{ exit: (direction: number) => ({ x: reduced ? 0 : direction * 390, rotate: reduced ? 0 : direction * 12, opacity: 0, scale: reduced ? 1 : .96, transition: { duration: reduced ? .01 : .26, ease: [.22, 1, .36, 1] } }) }} exit="exit"
    transition={{ type: "spring", stiffness: 760, damping: 58, mass: 1.05 }}>
    {!loaded && !failed && <div className="tn-poster-loading" aria-label={front ? "Loading poster" : undefined} />}
    {failed ? <div className="tn-poster-fallback"><Icon name="film" size={46} /><span>{movie.title}</span></div> : <motion.img layoutId={reduced ? undefined : `${layoutScope}-${movie.id}-poster`} transition={{ type: "spring", stiffness: 760, damping: 58, mass: 1.05 }} src={movie.poster} alt={front ? `${movie.title} movie poster` : ""} draggable={false} loading="eager" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
    <div className="tn-poster-shade" />
    <div className="tn-poster-badges"><a href={movie.source} target="_blank" rel="noreferrer" tabIndex={front ? 0 : -1} onPointerDown={(event) => event.stopPropagation()} title="Rotten Tomatoes critics score, verified 13 October 2026" aria-label={`${movie.title}, ${movie.score}% Rotten Tomatoes critics score`}><span aria-hidden="true">🍅</span>{movie.score}%</a><span><Icon name="clock" size={14} />{runtimeLabel(movie.minutes)}</span></div>
    {front && <><motion.span className="tn-swipe-stamp like" style={{ opacity: likeOpacity }} aria-hidden="true">LIKE <Icon name="heart" size={24} filled /></motion.span><motion.span className="tn-swipe-stamp pass" style={{ opacity: passOpacity }} aria-hidden="true">PASS <Icon name="pass" size={24} /></motion.span></>}
    <div className="tn-poster-copy"><span>{movie.year}</span><h2>{movie.title}</h2><div>{movie.genres.slice(0, 2).map((genre) => <span key={genre}>{genre}</span>)}</div></div>
  </motion.article>
}

export default function Tonight({ onChoose, className = "", isPlaying = true, onAutoplayChange }: TonightProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [savedOpen, setSavedOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [direction, setDirection] = useState(0)
  const [autoEnabled, setAutoEnabled] = useState(true)
  const [postersReady, setPostersReady] = useState(false)
  const [demoMovieId, setDemoMovieId] = useState<string | null>(null)
  const demoDragX = useMotionValue(0)
  const cursorX = useMotionValue(0), cursorY = useMotionValue(0)
  const cursorInitialized = useRef(false)
  const gestureCount = useRef(0)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorDown, setCursorDown] = useState(false)
  const [cursorPulse, setCursorPulse] = useState(0)
  const [demoButton, setDemoButton] = useState<string | null>(null)
  const surface = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden)
  const [notice, setNotice] = useState("")
  const busyRef = useRef(false)
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const dialogClose = useRef<() => void>(() => {})
  const headingId = useId()
  const reduced = !!useReducedMotion()
  useAutoplayResume(() => { setAutoEnabled(true); setSavedOpen(false); setFiltersOpen(false) })
  const autoPlaying = isPlaying && autoEnabled
  const autoRunning = useRef(false)
  autoRunning.current = autoPlaying && visible && inView && postersReady
  const demoEpoch = useRef(0)
  const demoStep = useMemo(() => nextDemoStep(movies, state), [state])
  const demoAction = useRef<(value: Vote, movieId: string) => void>(() => {})
  demoAction.current = (value, movieId) => vote(value, true, movieId)
  const available = availableMovies(movies, state)
  const current = available[0]
  const matched = movies.find((movie) => movie.id === state.matchId)
  const reactionMovie = matched ?? current
  const reactionVote = reactionMovie ? state.votes[reactionMovie.id] : undefined
  const reactionAgreement = reactionMovie ? agreement(reactionMovie, reactionVote) : 0
  const chosen = !!matched && state.chosenId === matched.id
  const modalKey = savedOpen ? "saved" : filtersOpen ? "filters" : matched ? `${matched.id}-${chosen}` : ""
  const activeFilters = Object.values(state.filters).filter((value) => value !== "Any").length
  const filterCount = movies.filter((movie) => fitsFilters(movie, state.filters)).length
  dialogClose.current = () => { setSavedOpen(false); setFiltersOpen(false); if (matched) dispatch({ type: "continue" }) }

  useEffect(() => {
    let active = true
    preloadPosters(movies.map((movie) => movie.poster)).then(() => { if (active) setPostersReady(true) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    if (isPlaying) setAutoEnabled(true)
  }, [isPlaying])
  useEffect(() => {
    if (!surface.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(surface.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const visibility = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", visibility)
    return () => document.removeEventListener("visibilitychange", visibility)
  }, [])
  useEffect(() => {
    if (!autoPlaying || !visible || !inView || !postersReady || savedOpen || filtersOpen || busy || !demoStep) return
    const epoch = demoEpoch.current
    const signature = demoStep.type === "vote" ? demoStep.movieId : demoStep.type
    const variation = (Array.from(signature).reduce((sum, letter) => sum + letter.charCodeAt(0), 0) + gestureCount.current++ * 7) % 11 / 10
    let active = true
    const waits = new Set<() => void>()
    const animations = new Set<() => void>()
    const valid = () => active && autoRunning.current && !document.hidden && epoch === demoEpoch.current
    function wait(duration: number) {
      return new Promise<void>((resolve) => {
        const cancel = () => { clearTimeout(timer); waits.delete(cancel); resolve() }
        const timer = setTimeout(() => { waits.delete(cancel); resolve() }, duration)
        waits.add(cancel)
      })
    }
    async function move(target: Element, duration: number, ratioX = .5, ratioY = .5) {
      const root = surface.current?.getBoundingClientRect(), bounds = target.getBoundingClientRect()
      if (!root || !valid()) return false
      if (!cursorInitialized.current) { cursorX.set(root.width * .64); cursorY.set(root.height - 53); cursorInitialized.current = true }
      setCursorVisible(true)
      const startX = cursorX.get(), startY = cursorY.get()
      const endX = bounds.left - root.left + bounds.width * ratioX - 4
      const endY = bounds.top - root.top + bounds.height * ratioY - 2
      const dx = endX - startX, dy = endY - startY
      const distance = Math.hypot(dx, dy) || 1
      const bend = Math.min(30, distance * .075) * (variation > .5 ? 1 : -1)
      const normalX = -dy / distance, normalY = dx / distance
      const c1x = startX + dx * .3 + normalX * bend, c1y = startY + dy * .3 + normalY * bend
      const c2x = endX - dx * .22 + normalX * bend * .6, c2y = endY - dy * .22 + normalY * bend * .6
      const movement = animate(0, 1, { duration, ease: [.18, .58, .28, 1], onUpdate: (t) => {
        const u = 1 - t
        cursorX.set(u * u * u * startX + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * endX)
        cursorY.set(u * u * u * startY + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * endY)
      } })
      animations.add(() => movement.stop())
      await movement
      return valid()
    }
    async function click(selector: string, button: string) {
      const target = surface.current?.querySelector(selector)
      if (!target || !await move(target, 1.25 - variation * .2, .46 + variation * .08, .47 + variation * .04)) return false
      await wait(230 + variation * 140); if (!valid()) return false
      setCursorDown(true); setCursorPulse((value) => value + 1); setDemoButton(button)
      await wait(125 + variation * 30); if (!valid()) return false
      setCursorDown(false)
      return true
    }
    async function run() {
      if (!reduced && surface.current) {
        const bounds = surface.current.getBoundingClientRect()
        if (!cursorInitialized.current) { cursorX.set(bounds.width * .64); cursorY.set(bounds.height - 53); cursorInitialized.current = true }
        setCursorVisible(true)
      }
      await wait(reduced ? Math.max(demoStep!.delay, 5000) : demoStep!.delay)
      if (!valid()) return
      if (reduced) {
        if (demoStep!.type === "vote") demoAction.current(demoStep!.vote, demoStep!.movieId)
        else dispatch({ type: demoStep!.type })
        return
      }
      if (demoStep!.type === "vote") {
        if (demoStep!.interaction === "swipe") {
          const target = surface.current?.querySelector(".tn-front-card")
          const ratioX = .49 + variation * .07, ratioY = .41 + variation * .06
          if (!target || !await move(target, .6 - variation * .1, ratioX, ratioY)) return
          await wait(90 + variation * 55); if (!valid()) return
          demoDragX.set(0); setDemoMovieId(demoStep!.movieId)
          setCursorDown(true); setCursorPulse((value) => value + 1)
          await wait(52.5 + variation * 17.5); if (!valid()) return
          const bounds = target.getBoundingClientRect()
          const distance = Math.min(145, bounds.width * .47)
          const startX = cursorX.get(), startY = cursorY.get()
          const origin = getComputedStyle(target).transformOrigin.split(" ")
          const originX = parseFloat(origin[0]) || bounds.width * .5, originY = parseFloat(origin[1]) || bounds.height * .75
          const gripX = bounds.width * ratioX - originX, gripY = bounds.height * ratioY - originY
          // Follow the same translated and tilted grip point as the card, rather than sliding off its surface.
          const stopFollowing = demoDragX.on("change", (position) => {
            const angle = position / 18 * Math.PI / 180
            cursorX.set(startX + position + gripX * (Math.cos(angle) - 1) - gripY * Math.sin(angle))
            cursorY.set(startY + gripX * Math.sin(angle) + gripY * (Math.cos(angle) - 1))
          })
          animations.add(stopFollowing)
          const pose = animate(demoDragX, -distance, { duration: .56 + variation * .08, ease: [.16, .65, .34, 1] })
          animations.add(() => pose.stop())
          await pose
          if (!valid()) return
          setCursorDown(false); await wait(37.5 + variation * 17.5)
          if (valid()) demoAction.current("pass", demoStep!.movieId)
        } else if (await click(".tn-like", "like") && valid()) demoAction.current("like", demoStep!.movieId)
      } else {
        const target = demoStep!.type === "choose" ? ".tn-watch" : demoStep!.type === "continue" ? ".tn-continue" : '[aria-label="Restart experience"]'
        if (await click(target, demoStep!.type) && valid()) dispatch({ type: demoStep!.type })
      }
    }
    void run()
    return () => { active = false; waits.forEach((cancel) => cancel()); animations.forEach((stop) => stop()); setDemoMovieId(null); setCursorDown(false); setDemoButton(null) }
  }, [autoPlaying, visible, inView, postersReady, savedOpen, filtersOpen, busy, demoStep, reduced, cursorX, cursorY, demoDragX])

  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); if (busyTimer.current) clearTimeout(busyTimer.current) }, [])
  useEffect(() => {
    if (!modalKey) return
    const previous = document.activeElement as HTMLElement | null
    const timer = setTimeout(() => { if (!autoPlaying) dialog.current?.querySelector<HTMLElement>("[tabindex='-1']")?.focus({ preventScroll: true }) }, 60)
    function key(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); dialogClose.current() }
      if (event.key !== "Tab") return
      const elements = Array.from(dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input, select, [tabindex='0']") ?? [])
      const first = elements[0], last = elements.at(-1)
      if (!first || !last) return
      if (event.shiftKey && (document.activeElement === first || document.activeElement?.getAttribute("tabindex") === "-1")) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", key)
    return () => { clearTimeout(timer); document.removeEventListener("keydown", key); if (!autoPlaying && document.hasFocus() && previous?.isConnected) previous.focus({ preventScroll: true }) }
  }, [modalKey, autoPlaying])

  function announce(message: string) {
    setNotice(message)
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(""), 2400)
  }
  function vote(value: Vote, automatic = false, expectedMovieId?: string) {
    if (automatic && (!autoRunning.current || document.hidden || current?.id !== expectedMovieId)) return
    if (!current || busyRef.current || modalKey || state.votes[current.id]) return
    if (!automatic) takeControl()
    busyRef.current = true; setBusy(true); setDirection(unanimous(current, value) ? 0 : value === "like" ? 1 : -1)
    dispatch({ type: "vote", movieId: current.id, vote: value })
    const count = agreement(current, value)
    if (!automatic) announce(value === "pass" ? `Passed on ${current.title}.` : count === 4 ? `It's a match! Everyone wants to watch ${current.title}.` : `${count} of 4 liked ${current.title}.`)
    busyTimer.current = setTimeout(() => { busyRef.current = false; setBusy(false) }, reduced ? 30 : 300)
  }
  function undo() {
    const last = state.history.at(-1)
    if (!last) return
    setDirection(0); dispatch({ type: "undo" }); announce(`Undid ${last.vote} for ${movies.find((movie) => movie.id === last.movieId)?.title}.`)
  }
  function save(movie: Movie) {
    dispatch({ type: "save", movieId: movie.id }); announce(state.saved.includes(movie.id) ? `Removed ${movie.title} from saved movies.` : `Saved ${movie.title}.`)
  }
  function restart() {
    demoEpoch.current++
    if (busyTimer.current) clearTimeout(busyTimer.current)
    busyRef.current = false; setBusy(false); setDirection(0); setSavedOpen(false); setFiltersOpen(false)
    setAutoEnabled(true); onAutoplayChange?.(true)
    dispatch({ type: "restart" }); announce("Fresh deck. Your saved movies are kept.")
  }
  function takeControl() {
    demoEpoch.current++; autoRunning.current = false
    setAutoEnabled(false); setDemoMovieId(null); setCursorDown(false); setDemoButton(null); onAutoplayChange?.(false)
  }
  function toggleAutoplay() {
    demoEpoch.current++
    const next = !autoPlaying
    setAutoEnabled(next); setDemoMovieId(null); setCursorDown(false); setDemoButton(null); onAutoplayChange?.(next)
  }
  function shortcuts(event: KeyboardEvent<HTMLElement>) {
    if (event.key.toLowerCase() === "u" && !savedOpen && !filtersOpen) { event.preventDefault(); undo(); return }
    if (modalKey || (event.target as HTMLElement).closest("button, select, input, a, textarea")) return
    if (event.key === "ArrowRight") { event.preventDefault(); vote("like") }
    if (event.key === "ArrowLeft") { event.preventDefault(); vote("pass") }
    if (event.key.toLowerCase() === "s" && current) { event.preventDefault(); save(current) }
  }

  return <MotionConfig reducedMotion={reduced ? "always" : "never"}><section ref={surface} className={`tonight ${className}`} aria-label="Tonight, interactive group movie matching" data-demo-playing={autoPlaying && !reduced} onKeyDown={shortcuts}
    onPointerDownCapture={(event) => { const target = event.target as HTMLElement; if (!target.closest("[data-auto-control]") && target.closest("button, a, select, .tn-front-card")) takeControl() }}
    onKeyDownCapture={(event) => { if (!(event.target as HTMLElement).closest("[data-auto-control]") && ["Tab", "Enter", " ", "ArrowRight", "ArrowLeft", "s", "S", "u", "U", "Escape"].includes(event.key)) takeControl() }}>
    <div className="tn-ambient" aria-hidden="true"><NightSky reduced={reduced} /><span className="tn-night-haze" /></div>
    <div className="tn-content" inert={!!modalKey}>
      <header className="tn-header">
        <div className="tn-wordmark">Tonight <span aria-hidden="true">🍿</span></div>
        <div className="tn-top-controls">
          <button className="tn-icon-control" onClick={() => setFiltersOpen(true)} aria-label={`Filter movies${activeFilters ? `, ${activeFilters} active filters` : ""}`} title="Filter movies" aria-haspopup="dialog" aria-expanded={filtersOpen}><Icon name="filter" size={18} />{activeFilters > 0 && <i aria-hidden="true" />}</button>
          <button className="tn-icon-control" data-demo-active={demoButton === "replay"} onClick={restart} aria-label="Restart experience" title="Restart experience"><Icon name="restart" size={17} /></button>
          <button onClick={() => setSavedOpen(true)} title="Saved movies" aria-haspopup="dialog" aria-expanded={savedOpen}><Icon name="save" size={16} />Saved <span>{state.saved.length}</span></button>
        </div>
      </header>
      <div className="tn-layout">
        <div className="tn-discovery">
          <div className="tn-deck">
            <AnimatePresence mode="sync" custom={direction}>{current ? available.slice(0, 3).map((movie, stage) => <PosterCard key={movie.id} movie={movie} stage={stage} disabled={busy} onVote={vote} reduced={reduced} demoMovieId={demoMovieId} demoDragX={demoDragX} layoutScope={headingId} autoPlaying={autoPlaying} />) : <motion.div key="empty" className="tn-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Icon name="film" size={40} /><h2>{filterCount ? "That's the whole deck." : "No movies fit these filters."}</h2><p>{filterCount ? "Try another mood, undo a decision, or start a fresh deck." : "Try Any mood or allow a longer runtime."}</p><button onClick={() => { setDirection(0); dispatch({ type: "filters", filters: { mood: "Any", genre: "Any", runtime: "Any" } }) }}>Clear filters</button>{filterCount > 0 && <button className="tn-empty-restart" onClick={restart}>Start a fresh deck</button>}</motion.div>}</AnimatePresence>
          </div>
        </div>
        <div className="tn-decision-column">
          <div className="tn-reactions">
            <div className="tn-group-title"><h3>Group votes</h3><span title="Alex, Sam, and Riya have predefined preferences">Demo friends</span></div>
            <div className="tn-agreement">
              <h3>{reactionMovie ? <><strong>{reactionAgreement}<span>/ 4</span></strong><span>likes</span></> : filterCount ? "Deck complete" : "No movies found"}</h3>
              <div className="tn-agreement-meter" aria-label={reactionMovie ? `${reactionAgreement} of 4 like ${reactionMovie.title}` : "No movie selected"}>{people.map((_, index) => <i key={index} className={reactionMovie && (index === 0 ? reactionVote === "like" : reactionMovie.friends[index - 1]) ? "filled" : ""} />)}</div>
            </div>
            <div className="tn-votes" aria-label={reactionMovie ? `Individual votes for ${reactionMovie.title}` : "Individual votes"}>{people.map((person, index) => { const personVote = index === 0 ? reactionVote : reactionMovie ? reactionMovie.friends[index - 1] ? "like" : "pass" : undefined; const label = personVote === "like" ? "Likes this movie" : personVote === "pass" ? "Passed on this movie" : "Not voted yet"; return <div key={person.name}><Avatar index={index} size="large" /><strong>{person.name}</strong><span className={`tn-vote-mark ${personVote ?? "pending"}`} role="img" aria-label={label} title={label}>{personVote ? <Icon name={personVote === "like" ? "heart" : "pass"} filled={personVote === "like"} size={18} /> : "···"}</span></div> })}</div>
          </div>
          <div className="tn-actions"><div><button className="tn-pass" data-demo-active={demoButton === "pass"} onClick={() => vote("pass")} disabled={!current || busy} aria-label={current ? `Pass on ${current.title}` : "Pass"}><Icon name="pass" size={30} /></button><span>Pass</span></div><div><button className="tn-like" data-demo-active={demoButton === "like"} onClick={() => vote("like")} disabled={!current || busy} aria-label={current ? `Like ${current.title}` : "Like"}><Icon name="heart" size={31} filled /></button><span>Like</span></div><div><button className="tn-save" onClick={() => current && save(current)} disabled={!current || busy} aria-label={current ? `Save ${current.title}` : "Save"} aria-pressed={!!current && state.saved.includes(current.id)}><Icon name="save" size={26} filled={!!current && state.saved.includes(current.id)} /></button><span>Save</span></div></div>
        </div>
      </div>
      <footer className="tn-footer"><CreatorCredit /><button className={`tn-autoplay ${autoPlaying ? "playing" : ""}`} data-auto-control aria-label={autoPlaying ? "Pause automatic demo" : "Play automatic demo"} aria-pressed={autoPlaying} onClick={toggleAutoplay}><Icon name={autoPlaying ? "pause" : "play"} size={13} />Auto demo</button></footer>
    </div>
    <AnimatePresence>{modalKey && <motion.div className="tn-modal-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
      <button className="tn-modal-scrim" aria-label={savedOpen ? "Close saved movies" : filtersOpen ? "Close filters" : "Continue browsing"} onClick={() => dialogClose.current()} />
      {filtersOpen ? <motion.div ref={dialog} className="tn-filter-panel" role="dialog" aria-modal="true" aria-labelledby={`${headingId}-filters`} initial={{ y: reduced ? 0 : 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
        <header><h2 id={`${headingId}-filters`} tabIndex={-1}>Filter movies</h2><button onClick={() => setFiltersOpen(false)} aria-label="Close filters"><Icon name="close" size={19} /></button></header>
          <div className="tn-filters">
            <label><span><Icon name="spark" size={17} />Mood</span><select value={state.filters.mood} onChange={(event) => { setDirection(0); dispatch({ type: "filters", filters: { mood: event.target.value as Mood } }) }}>{["Any", "Feel Good", "Thrilling", "Relaxed"].map((mood) => <option key={mood}>{mood}</option>)}</select></label>
            <label><span><Icon name="clock" size={17} />Time</span><select value={state.filters.runtime} onChange={(event) => { setDirection(0); dispatch({ type: "filters", filters: { runtime: event.target.value as "Any" | "Under 2 hours" } }) }}><option>Any</option><option>Under 2 hours</option></select></label>
            <label><span><Icon name="film" size={17} />Genre</span><select value={state.filters.genre} onChange={(event) => { setDirection(0); dispatch({ type: "filters", filters: { genre: event.target.value as Genre } }) }}>{["Any", "Comedy", "Action", "Sci-Fi", "Drama"].map((genre) => <option key={genre}>{genre}</option>)}</select></label>
          </div>
        <div className="tn-filter-actions"><button onClick={() => { setDirection(0); dispatch({ type: "filters", filters: { mood: "Any", genre: "Any", runtime: "Any" } }) }} disabled={!activeFilters}>Reset filters</button><button onClick={() => setFiltersOpen(false)}>Show {available.length} movies<Icon name="arrow" size={16} /></button></div>
      </motion.div> : savedOpen ? <motion.div ref={dialog} className="tn-saved-drawer" role="dialog" aria-modal="true" aria-labelledby={`${headingId}-saved`} initial={{ x: reduced ? 0 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: reduced ? 0 : 40, opacity: 0 }}>
        <header><div><span>YOUR SHORTLIST</span><h2 id={`${headingId}-saved`} tabIndex={-1}>Saved movies <small>{state.saved.length}</small></h2></div><button onClick={() => setSavedOpen(false)} aria-label="Close saved movies"><Icon name="close" /></button></header>
        <p>Keep the possibilities. Saving doesn't vote.</p>
        <div className="tn-saved-list">{state.saved.length ? state.saved.map((id) => { const movie = movies.find((item) => item.id === id)!; return <div key={id}><img src={movie.poster} alt={`${movie.title} poster`} /><span><strong>{movie.title}</strong><small>{movie.year} · {runtimeLabel(movie.minutes)}</small>{state.votes[id] && <em>{state.votes[id] === "like" ? "You liked this" : "You passed on this"}</em>}</span><button onClick={() => save(movie)} aria-label={`Remove ${movie.title} from saved movies`}><Icon name="close" size={17} /></button></div> }) : <div className="tn-saved-empty"><Icon name="save" size={36} /><h3>Your shortlist starts here.</h3><p>Use Save on a movie card to keep it for later.</p></div>}</div>
        <button className="tn-drawer-back" onClick={() => setSavedOpen(false)}>Back to the deck<Icon name="arrow" size={17} /></button>
      </motion.div> : matched && <motion.div ref={dialog} className="tn-match-panel" role="dialog" aria-modal="true" aria-labelledby={`${headingId}-match`} initial={{ scale: reduced ? 1 : .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0, scale: reduced ? 1 : .98 }} transition={{ type: "spring", stiffness: 300, damping: 32, mass: .85 }}>
        <button className="tn-match-close" onClick={() => dispatch({ type: "continue" })} aria-label="Continue browsing"><Icon name="close" /></button>
        <div className="tn-match-art"><motion.img layoutId={reduced ? undefined : `${headingId}-${matched.id}-poster`} transition={{ type: "spring", stiffness: 300, damping: 32, mass: .85 }} src={matched.poster} alt={`${matched.title} poster`} />{!reduced && !chosen && [0, 1, 2, 3, 4].map((i) => <motion.span key={i} className="tn-celebration-heart" initial={{ x: 0, y: 0, opacity: 1, scale: .5 }} animate={{ x: (i - 2) * 43, y: -95 - (i % 2) * 35, opacity: 0, scale: 1.3 }} transition={{ duration: 1.45, delay: i * .05 }}><Icon name="heart" size={22} filled /></motion.span>)}</div>
        <div className="tn-match-copy"><span className="tn-match-eyebrow">{chosen ? "TONIGHT'S PICK" : "FOUR HEARTS. ONE MOVIE."}</span><h2 id={`${headingId}-match`} tabIndex={-1}>{chosen ? "Movie night, sorted." : "It's a match!"}</h2><p>{chosen ? "Your group picked this movie for tonight." : "Everyone wants to watch this."}</p><h3>{matched.title}</h3><span className="tn-match-metadata">{matched.year} · {runtimeLabel(matched.minutes)} · {matched.score}% RT</span><div className="tn-match-people">{people.map((person, index) => <motion.span key={person.name} initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25, delay: reduced ? 0 : index * .1 }}><Avatar index={index} vote="like" size="large" /><small>{person.name}</small></motion.span>)}</div>
          {chosen ? <><a className="tn-watch" href={matched.source} target="_blank" rel="noreferrer">Movie details<Icon name="arrow" size={18} /></a><p className="tn-watch-note">This demo chooses a film; it doesn't stream it.</p></> : <button className="tn-watch" data-demo-active={demoButton === "choose"} onClick={() => { dispatch({ type: "choose" }); onChoose?.(matched) }}>Let's Watch<Icon name="arrow" size={18} /></button>}
          <button className="tn-continue" data-demo-active={demoButton === "continue"} onClick={() => dispatch({ type: "continue" })}>Continue browsing</button>
        </div>
      </motion.div>}
    </motion.div>}</AnimatePresence>
    <DemoCursor x={cursorX} y={cursorY} visible={autoPlaying && visible && inView && postersReady && cursorVisible && !reduced} down={cursorDown} pulse={cursorPulse} />
    <div className="tn-notice" role="status" aria-live="polite">{notice}</div>
  </section></MotionConfig>
}
