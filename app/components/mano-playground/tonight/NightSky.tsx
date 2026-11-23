import { useEffect, useRef } from "react"

// A stable field: resizing or re-rendering never randomly replaces the stars.
let seed = 719
const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const stars = Array.from({ length: 88 }, () => ({ x: random(), y: random(), radius: .45 + random() * .8, depth: .3 + random() * .7, phase: random() * Math.PI * 2 }))

export default function NightSky({ reduced }: { reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext("2d")
    if (!element || !context) return
    let width = 0, height = 0, frame = 0, lastTime = 0, time = 0, inView = true
    function draw() {
      context!.clearRect(0, 0, width, height)
      for (const star of stars) {
        const x = (star.x * width + time * (1 + star.depth * 2)) % width
        const y = star.y * height + Math.sin(x / width * Math.PI * 2 + time * .22 + star.phase) * 13 * star.depth
        context!.globalAlpha = (.22 + star.depth * .36) * (.8 + .2 * Math.sin(time * .6 + star.phase))
        context!.fillStyle = "#d7e6ff"
        context!.beginPath(); context!.arc(x, y, star.radius, 0, Math.PI * 2); context!.fill()
      }
      const glow = context!.createLinearGradient(0, 0, width, 0)
      glow.addColorStop(0, "#7aa6dc00"); glow.addColorStop(.4, "#7aa6dc"); glow.addColorStop(.7, "#9b87c4"); glow.addColorStop(1, "#9b87c400")
      context!.globalAlpha = .12; context!.strokeStyle = glow; context!.lineWidth = .7
      for (let wave = 0; wave < 2; wave++) {
        context!.beginPath()
        for (let x = 0; x <= width; x += 8) {
          const y = height * (.24 + wave * .5) + Math.sin(x / width * Math.PI * 1.8 + time * .14 + wave) * height * .06
          if (x === 0) context!.moveTo(x, y); else context!.lineTo(x, y)
        }
        context!.stroke()
      }
      context!.globalAlpha = 1
    }
    function tick(timestamp: number) {
      if (timestamp - lastTime >= 32) {
        time += lastTime ? Math.min((timestamp - lastTime) / 1000, .08) : 0
        lastTime = timestamp; draw()
      }
      frame = requestAnimationFrame(tick)
    }
    function schedule() {
      cancelAnimationFrame(frame); lastTime = 0
      if (!reduced && inView && !document.hidden && width && height) frame = requestAnimationFrame(tick)
      else if (width && height) draw()
    }
    function resize() {
      width = element!.clientWidth; height = element!.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      element!.width = Math.round(width * ratio); element!.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      schedule()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    const intersectionObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; schedule() })
    intersectionObserver.observe(element)
    document.addEventListener("visibilitychange", schedule)
    resize()
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); intersectionObserver.disconnect(); document.removeEventListener("visibilitychange", schedule) }
  }, [reduced])
  return <canvas ref={canvas} className="tn-night-sky" aria-hidden="true" />
}
