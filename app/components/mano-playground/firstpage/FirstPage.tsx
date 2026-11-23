import { useEffect, useId, useReducer, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from "motion/react"
import { books, moods } from "./books"
import { bookById, loadReadingState, matchesMood, nextStoryAction, pageOf, readingFraction, reducer, serialize, STORAGE_KEY, type Action } from "./model"
import { assetSources, createDemoState, nextDemoStep } from "./autoplay"
import { Icon } from "./icons"
import BookCover from "./BookCover"
import PaperBook, { usePaperTurn } from "./PaperBook"
import { paperPoint, projectPaperPoint, spreadStart, turnTarget } from "./paper"
import "./FirstPage.css"
import { useAutoplayResume } from "../idle-autoplay"

export interface FirstPageProps { className?: string; isPlaying?: boolean; onAutoplayChange?: (playing: boolean) => void }
const ease = [.22, 1, .36, 1] as const

export default function FirstPage({ className = "", isPlaying = true, onAutoplayChange }: FirstPageProps) {
  const [manualState, manualDispatch] = useReducer(reducer, undefined, loadReadingState)
  const [demoState, demoDispatch] = useReducer(reducer, undefined, createDemoState)
  const [autoEnabled, setAutoEnabled] = useState(true)
  const [phase, setPhase] = useState(0)
  const [shelfOpen, setShelfOpen] = useState(true)
  const [notice, setNotice] = useState("")
  const [assetsReady, setAssetsReady] = useState(false)
  const [visible, setVisible] = useState(() => typeof document === "undefined" || !document.hidden)
  const [inView, setInView] = useState(true)
  const [pagesPerTurn, setPagesPerTurn] = useState(2)
  const [cursorVisible, setCursorVisible] = useState(false)
  const [cursorDown, setCursorDown] = useState(false)
  const [pulse, setPulse] = useState(0)
  const [activeTarget, setActiveTarget] = useState("")
  const reduced = !!useReducedMotion()
  const id = useId()
  const surface = useRef<HTMLElement>(null)
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoPlaying = isPlaying && autoEnabled
  const state = autoPlaying ? demoState : manualState
  const current = bookById(state.currentId)
  const page = pageOf(state)
  const saved = !!current && state.saved.includes(current.id)
  const cursorX = useMotionValue(0), cursorY = useMotionValue(0), dragX = useMotionValue(0)
  const paper = usePaperTurn(reduced)
  const gesture = useRef<{ start: number; direction: number; target: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const cursorPlaced = useRef(false)
  const epoch = useRef(0)
  useAutoplayResume(() => {
    epoch.current++; paper.cancel()
    demoDispatch({ type: "adopt", state: manualState })
    setPhase(0); setAutoEnabled(true)
  })
  const activeAuto = useRef(autoPlaying)
  activeAuto.current = autoPlaying && visible && inView && assetsReady

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, serialize(manualState)) } catch { /* Reading remains usable with blocked storage. */ }
  }, [manualState])
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current) }, [])
  useEffect(() => {
    let active = true
    void Promise.all(assetSources.map((src) => new Promise<void>((resolve) => {
      const image = new Image()
      image.onload = () => { void image.decode().catch(() => {}).then(() => resolve()) }
      image.onerror = () => resolve()
      image.src = src
    }))).then(() => { if (active) setAssetsReady(true) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    const change = () => setVisible(!document.hidden)
    document.addEventListener("visibilitychange", change)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .12 })
    if (surface.current) observer.observe(surface.current)
    const resize = new ResizeObserver(([entry]) => setPagesPerTurn(entry.contentRect.width <= 520 ? 1 : 2))
    if (surface.current) resize.observe(surface.current)
    return () => { document.removeEventListener("visibilitychange", change); observer.disconnect(); resize.disconnect() }
  }, [])
  useEffect(() => {
    surface.current?.querySelectorAll(".fp-leaf-content").forEach((node) => node.scrollTo({ top: 0 }))
    dragX.set(0)
  }, [state.currentId, page, dragX])

  function announce(message: string) {
    setNotice(message)
    if (noticeTimer.current) clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(""), 2600)
  }
  useEffect(() => () => paper.cancel(), [state.currentId, pagesPerTurn, paper.cancel])

  function takeControl() {
    if (!activeAuto.current && !autoPlaying) return
    if (!autoPlaying) return
    epoch.current++; activeAuto.current = false; paper.cancel()
    manualDispatch({ type: "adopt", state: demoState })
    setAutoEnabled(false); setCursorVisible(false); setActiveTarget(""); setCursorDown(false)
    onAutoplayChange?.(false)
  }
  function act(action: Action) {
    takeControl(); paper.cancel()
    manualDispatch(action)
  }
  function turn(delta: number) {
    if (!current || paper.sheet) return
    const target = turnTarget(page, current.pages.length, pagesPerTurn, delta)
    if (target === null) return
    takeControl()
    void paper.play({ book: current, from: spreadStart(page, pagesPerTurn), to: target, columns: pagesPerTurn, size: state.fontSize, direction: Math.sign(delta) }, () => {
      manualDispatch({ type: "page", delta: target - page, visiblePages: pagesPerTurn })
      announce(`Page ${target + 1} of ${current.pages.length}.`)
    })
  }
  function saveCurrent() {
    if (!current) return
    act({ type: "save", id: current.id, force: true, visiblePages: pagesPerTurn }); setShelfOpen(true)
    announce("Saved to your shelf. Your reading place is kept.")
  }
  function toggleAuto() {
    epoch.current++
    if (autoPlaying) takeControl()
    else { setAutoEnabled(true); onAutoplayChange?.(true) }
  }
  function key(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === "Tab") { takeControl(); return }
    if (event.key.toLowerCase() === "p" && !event.repeat) { event.preventDefault(); toggleAuto(); return }
    if ((event.target as HTMLElement).closest("button, a")) return
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); turn(event.key === "ArrowRight" ? 2 : -2) }
    if (event.key.toLowerCase() === "u" && state.lastSkip) { event.preventDefault(); act({ type: "undo" }); announce("Previous story restored.") }
  }
  function edgeDown(event: PointerEvent<HTMLButtonElement>, edgeDirection: number) {
    if (event.button !== 0 || !current || paper.sheet) return
    const target = turnTarget(page, current.pages.length, pagesPerTurn, edgeDirection)
    if (target === null) return
    if (!paper.begin({ book: current, from: spreadStart(page, pagesPerTurn), to: target, columns: pagesPerTurn, size: state.fontSize, direction: edgeDirection })) return
    event.currentTarget.setPointerCapture(event.pointerId)
    gesture.current = { start: event.clientX, direction: edgeDirection, target, moved: false }; suppressClick.current = false
  }
  function edgeMove(event: PointerEvent<HTMLButtonElement>) {
    const held = gesture.current
    if (!held) return
    const delta = (held.start - event.clientX) * held.direction
    if (Math.abs(delta) > 8) held.moved = true
    const width = event.currentTarget.closest(".fp-open-book")?.getBoundingClientRect().width ?? 700
    paper.progress.set(reduced ? 0 : Math.max(0, Math.min(.78, delta / (width / pagesPerTurn))))
  }
  function edgeUp(event: PointerEvent<HTMLButtonElement>) {
    const held = gesture.current
    if (!held) return
    suppressClick.current = held.moved
    const delta = (held.start - event.clientX) * held.direction
    if (held.moved && delta >= 40) void paper.complete(() => manualDispatch({ type: "page", delta: held.target - page, visiblePages: pagesPerTurn }))
    else if (held.moved) paper.retreat()
    else paper.cancel()
    gesture.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  function edgeClick(delta: number) {
    if (suppressClick.current) { suppressClick.current = false; return }
    turn(delta)
  }

  useEffect(() => {
    if (!autoPlaying || !visible || !inView || !assetsReady) return
    const step = nextDemoStep(demoState, phase, pagesPerTurn)
    if (!step) return
    const currentEpoch = epoch.current
    let active = true
    const cancellations = new Set<() => void>()
    const valid = () => active && activeAuto.current && currentEpoch === epoch.current && !document.hidden
    function wait(ms: number) {
      return new Promise<boolean>((resolve) => {
        const cancel = () => { clearTimeout(timer); resolve(false) }
        const timer = setTimeout(() => { cancellations.delete(cancel); resolve(valid()) }, ms)
        cancellations.add(cancel)
      })
    }
    function move(target: Element) {
      const root = surface.current!.getBoundingClientRect(), bounds = target.getBoundingClientRect()
      if (!cursorPlaced.current) { cursorX.set(root.width * .67); cursorY.set(root.height * .9); cursorPlaced.current = true }
      const sx = cursorX.get(), sy = cursorY.get()
      const ex = bounds.left - root.left + bounds.width * .53 - 3, ey = bounds.top - root.top + bounds.height * .52 - 2
      const dx = ex - sx, dy = ey - sy, bend = Math.min(32, Math.hypot(dx, dy) * .06)
      const cx = sx + dx * .4 - bend, cy = sy + dy * .35 + bend
      setCursorVisible(true)
      return new Promise<boolean>((resolve) => {
        const movement = animate(0, 1, { duration: .64 + phase % 3 * .04, ease: [.22, .64, .3, 1], onUpdate: (t) => {
          cursorX.set((1-t)*(1-t)*sx + 2*(1-t)*t*cx + t*t*ex)
          cursorY.set((1-t)*(1-t)*sy + 2*(1-t)*t*cy + t*t*ey)
        }, onComplete: () => { cancellations.delete(cancel); resolve(valid()) } })
        const cancel = () => { movement.stop(); resolve(false) }
        cancellations.add(cancel)
      })
    }
    async function run() {
      if (!await wait(reduced ? Math.max(5000, step!.delay) : step!.delay)) return
      const target = surface.current?.querySelector<HTMLButtonElement>(step!.selector)
      if (!target || target.disabled) return
      if (!reduced) {
        if (!await move(target) || !await wait(110)) return
        setCursorDown(true); setPulse((value) => value + 1); setActiveTarget(step!.selector)
        if (step!.kind !== "turn" && !await wait(100)) return
      }

      if (!valid()) return
      const action = step!.action
      if (action.type === "page") {
        const book = bookById(demoState.currentId)!
        const sx = cursorX.get(), sy = cursorY.get()
        const bounds = surface.current!.querySelector(".fp-open-book")!.getBoundingClientRect(), root = surface.current!.getBoundingClientRect()
        const leafWidth = bounds.width / pagesPerTurn, direction = Math.sign(action.delta)
        const hinge = pagesPerTurn === 2 ? leafWidth : direction > 0 ? 0 : leafWidth
        const grabU = Math.max(0, Math.min(1, (sx - (bounds.left - root.left) - hinge) / (leafWidth * direction)))
        const grabV = Math.max(0, Math.min(1, (sy - (bounds.top - root.top)) / bounds.height))
        const origin = paperPoint(0, grabU, grabV, leafWidth, bounds.height, direction, pagesPerTurn)
        const follow = paper.progress.on("change", (p) => {
          if (reduced) return
          const point = paperPoint(p, grabU, grabV, leafWidth, bounds.height, direction, pagesPerTurn)
          const projected = projectPaperPoint(point, bounds.width, bounds.height)
          cursorX.set(sx + projected.x - origin.x)
          cursorY.set(sy + projected.y - origin.y)
        })
        cancellations.add(follow); cancellations.add(paper.cancel)
        const completed = await paper.play({ book, from: spreadStart(pageOf(demoState), pagesPerTurn), to: pageOf(demoState) + action.delta, columns: pagesPerTurn, size: demoState.fontSize, direction: Math.sign(action.delta) }, () => { follow(); demoDispatch(action) }, valid)
        follow(); cancellations.delete(follow); cancellations.delete(paper.cancel)
        if (!completed) return
      } else demoDispatch(action)
      setCursorDown(false); setPhase(step!.nextPhase)

    }
    void run()
    return () => { active = false; cancellations.forEach((cancel) => cancel()); setCursorDown(false); setActiveTarget(""); dragX.set(0) }
  }, [autoPlaying, visible, inView, assetsReady, phase, demoState, reduced, pagesPerTurn, cursorX, cursorY, dragX, paper.play, paper.cancel, paper.progress])

  const nextMoods = moods.filter((mood) => books.some((book) => matchesMood(book.id, mood) && !(mood === "Surprise Me" ? state.seen : state.explored).includes(book.id) && !state.skipped.includes(book.id)))
  const demoClass = (selector: string) => activeTarget === selector ? " fp-demo-pressed" : ""
  return <MotionConfig reducedMotion="user"><section ref={surface} className={`fp-component ${className}`} aria-labelledby={`${id}-title`} data-demo-playing={autoPlaying} aria-keyshortcuts="P" aria-description="Press P to pause or resume automatic preview." onKeyDown={key} onPointerDownCapture={takeControl}>
    <h1 id={`${id}-title`} className="fp-sr-only">FirstPage reader</h1>
    <div className="fp-layout">
      <div className="fp-left-column">
        <div className={`fp-book-frame ${state.theme === "night" ? "fp-night" : ""}`}>
          {current ? <div className="fp-book-stack">
            <div className="fp-book-pages" />
            <div className="fp-open-book">
              <div className="fp-reading-tools">
                <button className="fp-round" aria-label={`Reading font size ${["small", "medium", "large"][state.fontSize]}. Change font size`} onClick={() => act({ type: "font", size: ((state.fontSize + 1) % 3) as 0 | 1 | 2 })}>A</button>
                <button data-fp="theme" className={`fp-round${state.theme === "night" ? " fp-night-button" : ""}${demoClass('[data-fp="theme"]')}`} aria-label={state.theme === "paper" ? "Switch to night reading" : "Switch to warm paper"} aria-pressed={state.theme === "night"} onClick={() => act({ type: "theme" })}><Icon name={state.theme === "paper" ? "moon" : "sun"} size={19} /></button>
              </div>
              <PaperBook book={current} page={page} size={state.fontSize} columns={pagesPerTurn} sheet={paper.sheet} progress={paper.progress} />
              <div className="fp-book-seam" aria-hidden="true" />
              <button className="fp-drag-edge fp-edge-left" tabIndex={-1} aria-label="Drag left page edge right to turn back" disabled={turnTarget(page, current.pages.length, pagesPerTurn, -1) === null} onPointerDown={(event) => edgeDown(event, -1)} onPointerMove={edgeMove} onPointerUp={edgeUp} onPointerCancel={() => { gesture.current = null; paper.cancel() }} onClick={() => edgeClick(-2)} />
              <button data-fp="next-edge" className="fp-drag-edge fp-edge-right" tabIndex={-1} aria-label="Drag right page edge left to turn page" disabled={turnTarget(page, current.pages.length, pagesPerTurn, 1) === null} onPointerDown={(event) => edgeDown(event, 1)} onPointerMove={edgeMove} onPointerUp={edgeUp} onPointerCancel={() => { gesture.current = null; paper.cancel() }} onClick={() => edgeClick(2)} />
            </div>
            <button data-fp="previous" className={`fp-page-arrow fp-arrow-left${demoClass('[data-fp="previous"]')}`} disabled={turnTarget(page, current.pages.length, pagesPerTurn, -1) === null || !!paper.sheet} aria-label="Previous page" onClick={() => turn(-2)}><Icon name="left" size={22} /></button>
            <button data-fp="next" className={`fp-page-arrow fp-arrow-right${demoClass('[data-fp="next"]')}`} disabled={turnTarget(page, current.pages.length, pagesPerTurn, 1) === null || !!paper.sheet} aria-label="Next page" onClick={() => turn(2)}><Icon name="right" size={22} /></button>
          </div> : <div className="fp-exhausted"><Icon name="book" size={38} /><h2>A new mood. A new beginning.</h2><p>You’ve explored these openings. Try a different feeling.</p><div>{nextMoods.slice(0, 3).map((mood) => <button key={mood} onClick={() => act({ type: "mood", mood })}>{mood}</button>)}</div><button data-fp="revisit" onClick={() => act({ type: "revisit" })}>Revisit these stories</button>{state.lastSkip && <button onClick={() => act({ type: "undo" })}>Undo skip</button>}</div>}
        </div>
      </div>
      <aside className="fp-right-column" aria-label="Book details and reading shelf">
        <div className="fp-reveal-panel fp-is-revealed" data-fp-reveal-state="reveal">
          <AnimatePresence initial={false} mode="wait">{current ? <motion.div key={`reveal-${current.id}`} className="fp-reveal-layout" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: .1 } }} transition={{ duration: reduced ? .01 : .65, ease }}>
            <motion.div className="fp-reveal-cover" initial={reduced ? false : { opacity: 0, y: 20, scale: .93 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduced ? .01 : .72, ease }}><BookCover book={current} /></motion.div>
            <div className="fp-reveal-copy"><h2>{current.title}</h2><p className="fp-author">by {current.author}</p><p className="fp-description">{current.description}</p>
              <div className="fp-reveal-actions"><motion.button data-fp="save" className={`fp-primary${demoClass('[data-fp="save"]')}`} aria-pressed={saved} whileTap={reduced ? undefined : { scale: .97 }} onClick={saveCurrent}><Icon name={saved ? "check" : "bookmark"} size={19} />{saved ? "Saved to Shelf" : "Save to Shelf"}</motion.button><button data-fp="another" className="fp-secondary" onClick={() => act(nextStoryAction(state))}><Icon name="refresh" size={18} />{nextMoods.length ? "Explore Another" : "Browse Again"}</button></div>
            </div>
          </motion.div> : null}</AnimatePresence>
        </div>
        <div className="fp-shelf">
          <div className="fp-shelf-heading"><h2>My Reading Shelf</h2><button aria-expanded={shelfOpen} aria-controls={`${id}-shelf`} onClick={() => setShelfOpen((value) => !value)}>{state.saved.length} saved<Icon name="right" size={13} /></button></div>
          <AnimatePresence initial={false}>{shelfOpen && <motion.div id={`${id}-shelf`} className="fp-shelf-display" initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? .01 : .3, ease }}>
            <div className="fp-shelf-books"><AnimatePresence initial={false} mode="popLayout">{state.saved.map((bookId) => {
              const book = bookById(bookId)!, fraction = readingFraction(state, bookId, pagesPerTurn)
              return <motion.div layout key={bookId} className="fp-shelf-item" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .9 }} transition={{ duration: reduced ? .01 : .32, ease }}><button className="fp-shelf-book" onClick={() => { act({ type: "sample", id: bookId }); announce(`Resumed page ${pageOf(state, bookId) + 1}.`) }} aria-label={`Resume ${book.title} at page ${pageOf(state, bookId) + 1}, ${Math.round(fraction * 100)}% read`}><BookCover book={book} miniature /><span className="fp-shelf-progress"><span className="fp-progress-label">{Math.round(fraction * 100)}%</span><span className="fp-page-marks" aria-hidden="true"><i style={{ width: `${fraction * 100}%` }} /></span></span></button><button className="fp-shelf-remove" aria-label={`Remove ${book.title} from shelf`} onClick={() => { takeControl(); if (manualState.saved.includes(bookId)) manualDispatch({ type: "save", id: bookId }); announce("Removed from shelf.") }}><Icon name="close" size={12} /></button></motion.div>
            })}</AnimatePresence><button className="fp-shelf-add" aria-label="Explore more books to add to your shelf" onClick={() => act(nextStoryAction(state))}><Icon name="plus" size={24} /></button></div><div className="fp-wooden-shelf" aria-hidden="true" />{!state.saved.length && <p className="fp-empty-shelf">A place for stories you want to return to.</p>}
          </motion.div>}</AnimatePresence>
        </div>
      </aside>
    </div>
    <div className="fp-sr-only" role="status" aria-live="polite">{notice}</div>
    <motion.div className="fp-demo-cursor" style={{ x: cursorX, y: cursorY }} initial={false} animate={{ opacity: cursorVisible && autoPlaying && inView && visible && !reduced ? 1 : 0 }} aria-hidden="true">{pulse > 0 && <motion.span key={pulse} initial={{ scale: .25, opacity: .4 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: .55 }} />}<motion.svg width="25" height="30" viewBox="0 0 30 34" animate={{ scale: cursorDown ? .88 : 1 }} transition={{ duration: .13 }}><path d="M4 2v24l6-7 5 11 5-2-5-11h10L4 2Z" fill="#fff9ed" stroke="#151a27" strokeWidth="1.6" strokeLinejoin="round" /></motion.svg></motion.div>
  </section></MotionConfig>
}
