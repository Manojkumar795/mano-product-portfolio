import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react"
import { books, type Book } from "./books"
import { PAPER_TURN_SECONDS, spreadStart } from "./paper"
import { createPaperRenderer } from "./paper-renderer"

const ease = [.22, .68, .3, 1] as const
export interface PaperSnapshot { book: Book; from: number; to: number; columns: number; size: number; direction: number }

export function usePaperTurn(reduced: boolean) {
  const [sheet, setSheet] = useState<PaperSnapshot | null>(null)
  const progress = useMotionValue(0)
  const active = useRef<PaperSnapshot | null>(null)
  const cancelAnimation = useRef<(() => void) | null>(null)
  const cancel = useCallback(() => {
    cancelAnimation.current?.(); cancelAnimation.current = null
    active.current = null; progress.set(0); setSheet(null)
  }, [progress])
  useEffect(() => () => { cancelAnimation.current?.() }, [])
  const begin = useCallback((snapshot: PaperSnapshot) => {
    if (active.current) return false
    progress.set(0); active.current = snapshot; setSheet(snapshot)
    return true
  }, [progress])
  const complete = useCallback((commit: () => void, valid: () => boolean = () => true) => {
    if (!active.current) return Promise.resolve(false)
    return new Promise<boolean>((resolve) => {
      const finish = () => {
        cancelAnimation.current = null; active.current = null
        if (valid()) { commit(); setSheet(null); progress.set(0); resolve(true) }
        else { setSheet(null); progress.set(0); resolve(false) }
      }
      if (reduced) { finish(); return }
      const controls = animate(progress, 1, { duration: Math.max(.2, PAPER_TURN_SECONDS * (1 - progress.get())), ease, onComplete: finish })
      cancelAnimation.current = () => { controls.stop(); resolve(false) }
    })
  }, [progress, reduced])
  const retreat = useCallback(() => {
    if (!active.current) return
    if (reduced) { cancel(); return }
    const controls = animate(progress, 0, { duration: .3, ease, onComplete: cancel })
    cancelAnimation.current = () => controls.stop()
  }, [progress, reduced, cancel])
  const play = useCallback((snapshot: PaperSnapshot, commit: () => void, valid?: () => boolean) => {
    if (!begin(snapshot)) return Promise.resolve(false)
    return complete(commit, valid)
  }, [begin, complete])
  return { sheet, progress, begin, complete, retreat, play, cancel }
}

export function PaperPage({ book, page, side, size, copy = false }: { book: Book; page: number; side: "left" | "right"; size: number; copy?: boolean }) {
  const paragraphs = book.pages[page]
  if (!paragraphs) return null
  return <article className={`fp-leaf fp-leaf-${side} fp-text-${size}`}>
    <div className="fp-leaf-art" style={{ backgroundImage: `url('/firstpage/${book.id}.webp')` }} aria-hidden="true" />
    <div className="fp-leaf-content" tabIndex={copy ? undefined : 0} aria-label={copy ? undefined : `Reading page ${page + 1} of ${book.pages.length}`}>
      {page === 0 && <><span className="fp-chapter-label">CHAPTER ONE</span><h2>{book.chapter}</h2></>}
      {page === 1 && <blockquote>“{book.quote}”</blockquote>}
      {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
    <span className="fp-leaf-number"><i />{side === "left" && <span className="fp-leaf-credit">Mano</span>}{page + 1} / {book.pages.length}</span>
  </article>
}

function MovingPaper({ sheet, progress }: { sheet: PaperSnapshot; progress: MotionValue<number> }) {
  const scene = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), faces = useRef<HTMLDivElement>(null)
  const [fallback, setFallback] = useState(false)
  const rotateY = useTransform(progress, (p) => -Math.sign(sheet.direction) * p * 180)
  const opacity = useTransform(progress, (p) => Math.sin(Math.PI * p) * .24)
  const shadowX = useTransform(progress, (p) => `${(sheet.direction > 0 ? 1 - p : p) * 55}%`)
  const frontPage = sheet.direction > 0 ? sheet.from + sheet.columns - 1 : sheet.from
  const backPage = sheet.direction > 0 ? sheet.to : sheet.to + sheet.columns - 1
  useLayoutEffect(() => {
    const pages = faces.current?.children
    if (!scene.current || !canvas.current || !pages || pages.length !== 2) return
    const { width, height } = scene.current.getBoundingClientRect()
    const renderer = createPaperRenderer(canvas.current, pages[0] as HTMLElement, pages[1] as HTMLElement, width / sheet.columns, height, sheet.direction, sheet.columns)
    if (!renderer) { setFallback(true); return }
    renderer.draw(progress.get())
    const unsubscribe = progress.on("change", (p) => renderer.draw(p))
    const lost = (event: Event) => { event.preventDefault(); setFallback(true) }
    const element = canvas.current
    element.addEventListener("webglcontextlost", lost)
    return () => { unsubscribe(); element.removeEventListener("webglcontextlost", lost); renderer.dispose() }
  }, [progress, sheet])
  return <div ref={scene} className="fp-paper-scene" aria-hidden="true" inert>
    <motion.div className="fp-paper-cast-shadow" style={{ opacity, left: shadowX }} />
    <div ref={faces} className={`fp-paper-textures ${sheet.columns === 1 ? "fp-paper-single" : ""}`}>
      <PaperPage book={sheet.book} page={frontPage} side={sheet.direction > 0 ? "right" : "left"} size={sheet.size} copy />
      <PaperPage book={sheet.book} page={backPage} side={sheet.direction > 0 ? "left" : "right"} size={sheet.size} copy />
    </div>
    <canvas ref={canvas} className="fp-paper-surface" style={{ visibility: fallback ? "hidden" : "visible" }} />
    {fallback && <motion.div className={`fp-paper-fallback ${sheet.direction > 0 ? "fp-paper-forward" : "fp-paper-reverse"} ${sheet.columns === 1 ? "fp-paper-single" : ""}`} style={{ rotateY }}>
      <div className="fp-paper-face"><PaperPage book={sheet.book} page={frontPage} side={sheet.direction > 0 ? "right" : "left"} size={sheet.size} copy /></div>
      <div className="fp-paper-face fp-paper-back"><PaperPage book={sheet.book} page={backPage} side={sheet.direction > 0 ? "left" : "right"} size={sheet.size} copy /></div>
    </motion.div>}
  </div>
}

export default function PaperBook({ book, page, size, columns, sheet, progress }: { book: Book; page: number; size: number; columns: number; sheet: PaperSnapshot | null; progress: MotionValue<number> }) {
  const measuring = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(420)
  const start = spreadStart(page, columns)
  useLayoutEffect(() => {
    const measure = () => {
      const nodes = Array.from(measuring.current?.children ?? [])
      const next = Math.ceil(Math.max(400, ...nodes.map((node) => node.getBoundingClientRect().height)))
      setHeight((old) => Math.abs(next - old) > 1 ? next : old)
    }
    measure(); const observer = new ResizeObserver(measure)
    if (measuring.current) for (const node of measuring.current.children) observer.observe(node)
    return () => observer.disconnect()
  }, [size, columns])
  const left = sheet && columns === 2 ? sheet.direction > 0 ? sheet.from : sheet.to : sheet ? sheet.to : start
  const right = sheet ? sheet.direction > 0 ? sheet.to + 1 : sheet.from + 1 : start + 1
  return <div className={`fp-paper-content ${columns === 1 ? "fp-single-page" : ""}`} style={{ "--fp-page-height": `${height}px`, "--fp-columns": columns } as CSSProperties}>
    <div ref={measuring} className="fp-page-measure" aria-hidden="true" inert>{books.flatMap((sample) => sample.pages.map((_, index) => <PaperPage key={`${sample.id}-${index}`} book={sample} page={index} side={index % 2 === 0 ? "left" : "right"} size={size} copy />))}</div>
    <div className="fp-spread" aria-busy={!!sheet}><PaperPage book={book} page={left} side="left" size={size} />{columns === 2 && <PaperPage book={book} page={right} side="right" size={size} />}</div>
    {sheet && <MovingPaper sheet={sheet} progress={progress} />}
  </div>
}
