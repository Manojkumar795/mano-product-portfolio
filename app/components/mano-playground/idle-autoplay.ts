import { useCallback, useEffect, useRef, useState } from "react"

export const AUTOPLAY_IDLE_MS = 5000
const RESUME_EVENT = "mano:autoplay-resume"

/** Each iframe owns its activity clock; native demo cues never count as user input. */
export function useIdleAutoplay() {
  const [playing, setPlaying] = useState(true)
  const control = useRef<(next: boolean) => void>(() => {})
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const pointers = new Set<number>(), keys = new Set<string>()
    let resumes = 0
    const clear = () => { clearTimeout(timer); timer = undefined }
    const pause = () => { clear(); setPlaying(false); document.body.dataset.autoplayState = "manual" }
    const arm = () => {
      clear()
      if (pointers.size || keys.size) return
      timer = setTimeout(() => {
        timer = undefined
        setPlaying(true)
        document.body.dataset.autoplayState = "playing"
        document.body.dataset.autoplayResumes = String(++resumes)
        window.dispatchEvent(new Event(RESUME_EVENT))
      }, AUTOPLAY_IDLE_MS)
    }
    const pointerDown = (event: PointerEvent) => { if (!event.isTrusted) return; pointers.add(event.pointerId); pause() }
    const pointerMove = (event: PointerEvent) => { if (event.isTrusted && pointers.has(event.pointerId)) pause() }
    const pointerEnd = (event: PointerEvent) => { if (!event.isTrusted) return; pointers.delete(event.pointerId); arm() }
    const keyDown = (event: KeyboardEvent) => { if (!event.isTrusted) return; keys.add(event.code || event.key); pause() }
    const keyUp = (event: KeyboardEvent) => { if (!event.isTrusted) return; keys.delete(event.code || event.key); arm() }
    const activity = (event: Event) => { if (event.isTrusted) { pause(); arm() } }
    const blur = () => {
      const held = pointers.size > 0 || keys.size > 0
      pointers.clear(); keys.clear()
      if (held) arm()
    }
    control.current = next => {
      if (next) { clear(); setPlaying(true); document.body.dataset.autoplayState = "playing" }
      else { pause(); arm() }
    }
    document.body.dataset.autoplayState = "playing"
    document.body.dataset.autoplayResumes = "0"
    document.addEventListener("pointerdown", pointerDown, true)
    document.addEventListener("pointermove", pointerMove, true)
    document.addEventListener("pointerup", pointerEnd, true)
    document.addEventListener("pointercancel", pointerEnd, true)
    document.addEventListener("keydown", keyDown, true)
    document.addEventListener("keyup", keyUp, true)
    for (const event of ["click", "input", "change", "wheel"]) document.addEventListener(event, activity, { capture: true, passive: true })
    window.addEventListener("blur", blur)
    return () => {
      clear(); control.current = () => {}
      document.removeEventListener("pointerdown", pointerDown, true)
      document.removeEventListener("pointermove", pointerMove, true)
      document.removeEventListener("pointerup", pointerEnd, true)
      document.removeEventListener("pointercancel", pointerEnd, true)
      document.removeEventListener("keydown", keyDown, true)
      document.removeEventListener("keyup", keyUp, true)
      for (const event of ["click", "input", "change", "wheel"]) document.removeEventListener(event, activity, true)
      window.removeEventListener("blur", blur)
    }
  }, [])
  const onAutoplayChange = useCallback((next: boolean) => control.current(next), [])
  return { playing, onAutoplayChange }
}

/** Clear each original demo's manual latch without remounting or losing user progress. */
export function useAutoplayResume(resume: () => void) {
  const latest = useRef(resume)
  latest.current = resume
  useEffect(() => {
    const run = () => latest.current()
    window.addEventListener(RESUME_EVENT, run)
    return () => window.removeEventListener(RESUME_EVENT, run)
  }, [])
}
