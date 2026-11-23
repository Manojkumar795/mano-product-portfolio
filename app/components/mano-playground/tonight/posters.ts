type PosterState = "loading" | "ready" | "failed"
const cache = new Map<string, { state: PosterState; image: HTMLImageElement; ready: Promise<void> }>()

export function posterState(source: string) { return cache.get(source)?.state }

/** Keep decoded image objects alive and reuse requests when a back card becomes front. */
export function preloadPoster(source: string, createImage: () => HTMLImageElement = () => new Image()) {
  const existing = cache.get(source)
  if (existing) return existing.ready
  const image = createImage()
  let finish: () => void = () => {}
  const ready = new Promise<void>((resolve) => { finish = resolve })
  const entry = { state: "loading" as PosterState, image, ready }
  cache.set(source, entry)
  image.decoding = "async"
  image.onload = async () => {
    try { if (image.decode) await image.decode() } catch { /* A loaded image can still render if decode is unsupported. */ }
    entry.state = "ready"; finish()
  }
  image.onerror = () => { entry.state = "failed"; finish() }
  image.src = source
  return ready
}

export function preloadPosters(sources: readonly string[]) { return Promise.all(sources.map((source) => preloadPoster(source))) }
