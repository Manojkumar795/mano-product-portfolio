import { books, moods, type Mood } from "./books"

export type FontSize = 0 | 1 | 2
export type Theme = "paper" | "night"
export interface ReadingState {
  mood: Mood
  currentId: string | null
  progress: Record<string, number>
  readFraction: Record<string, number>
  saved: string[]
  revealed: string[]
  seen: string[]
  explored: string[]
  skipped: string[]
  lastSkip: { id: string; mood: Mood; skipped: string[] } | null
  view: "reading" | "reveal"
  fontSize: FontSize
  theme: Theme
}
export type Action =
  | { type: "mood"; mood: Mood }
  | { type: "page"; delta: number; visiblePages?: number }
  | { type: "skip" }
  | { type: "undo" }
  | { type: "reveal" }
  | { type: "read" }
  | { type: "save"; id: string; force?: boolean; visiblePages?: number }
  | { type: "open"; id: string }
  | { type: "sample"; id: string }
  | { type: "adopt"; state: ReadingState }
  | { type: "another" }
  | { type: "revisit"; mood?: Mood }
  | { type: "font"; size: FontSize }
  | { type: "theme"; theme?: Theme }

export const STORAGE_KEY = "mano.firstpage.v1"
export const initialState: ReadingState = {
  mood: moods[0], currentId: books[0].id, progress: {}, readFraction: {}, saved: [], revealed: [],
  seen: [books[0].id], explored: [books[0].id], skipped: [], lastSkip: null, view: "reading", fontSize: 1, theme: "paper",
}
export const bookById = (id: string | null) => books.find((book) => book.id === id)
export const pageOf = (state: ReadingState, id = state.currentId) => id ? state.progress[id] ?? 0 : 0
/** Preserve the furthest reading place; a complete two-page spread includes its right leaf. */
export function readingFraction(state: ReadingState, id: string, columns = 1): number {
  const book = bookById(id)
  if (!book) return 0
  const saved = state.readFraction[id], count = columns === 2 ? 2 : 1
  const visible = id === state.currentId ? (Math.floor(pageOf(state, id) / count) + 1) * count : pageOf(state, id) + 1
  return Math.min(1, Math.max(saved ?? 0, id === state.currentId || saved === undefined ? visible / book.pages.length : 0))
}
export const matchesMood = (id: string, mood: Mood) => mood === "Surprise Me" || !!bookById(id)?.moods.includes(mood)

/** Prefer unseen stories. Skips stay excluded for this session; exhaustion is explicit. */
export function recommend(state: ReadingState, mood: Mood, excludeCurrent = true): string | null {
  const available = books.filter((book) => matchesMood(book.id, mood) && !state.skipped.includes(book.id) && (!excludeCurrent || book.id !== state.currentId))
  const visited = mood === "Surprise Me" ? state.seen : state.explored
  const unread = available.find((book) => !visited.includes(book.id))
  if (unread) return unread.id
  return null
}
/** Continue discovery without requiring visible category controls. */
export function nextStoryAction(state: ReadingState): Action {
  if (recommend(state, state.mood)) return { type: "another" }
  const mood = moods.find((item) => recommend(state, item))
  return mood ? { type: "mood", mood } : { type: "revisit", mood: moods[0] }
}
function select(state: ReadingState, id: string | null, mood = state.mood): ReadingState {
  return { ...state, mood, currentId: id, view: "reading",
    seen: id && !state.seen.includes(id) ? [...state.seen, id] : state.seen,
    explored: id && !state.explored.includes(id) ? [...state.explored, id] : state.explored }
}
export function reducer(state: ReadingState, action: Action): ReadingState {
  switch (action.type) {
    case "mood": {
      if (!moods.includes(action.mood)) return state
      return select(state, recommend(state, action.mood, action.mood === state.mood), action.mood)
    }
    case "page": {
      const book = bookById(state.currentId)
      if (!book) return state
      const page = Math.min(book.pages.length - 1, Math.max(0, pageOf(state) + Math.trunc(action.delta)))
      if (page === pageOf(state)) return state
      const next = { ...state, progress: { ...state.progress, [book.id]: page } }
      return { ...next, readFraction: { ...state.readFraction, [book.id]: readingFraction(next, book.id, action.visiblePages) } }
    }
    case "skip": {
      if (!state.currentId) return state
      const next = { ...state, skipped: [...new Set([...state.skipped, state.currentId])], lastSkip: { id: state.currentId, mood: state.mood, skipped: state.skipped } }
      return select(next, recommend(next, state.mood))
    }
    case "undo": {
      if (!state.lastSkip) return state
      const { id, mood, skipped } = state.lastSkip
      return select({ ...state, skipped, lastSkip: null }, id, mood)
    }
    case "reveal":
      return state.currentId ? { ...state, view: "reveal", revealed: [...new Set([...state.revealed, state.currentId])] } : state
    case "read": return { ...state, view: "reading" }
    case "save": {
      if (!bookById(action.id)) return state
      const exists = state.saved.includes(action.id)
      const fraction = action.visiblePages && action.id === state.currentId ? readingFraction(state, action.id, action.visiblePages === 2 ? 2 : 1) : state.readFraction[action.id]
      const changed = fraction !== state.readFraction[action.id]
      if (exists && action.force && !changed) return state
      return { ...state,
        saved: exists ? action.force ? state.saved : state.saved.filter((id) => id !== action.id) : [...state.saved, action.id],
        readFraction: changed ? { ...state.readFraction, [action.id]: fraction! } : state.readFraction }

    }
    case "open": return state.saved.includes(action.id) ? select(state, action.id) : state
    case "sample": {
      const book = bookById(action.id)
      return book ? select(state, book.id, matchesMood(book.id, state.mood) ? state.mood : book.moods[0]) : state
    }
    case "adopt": {
      const source = action.state, id = source.currentId
      if (!bookById(id)) return state
      return { ...state, currentId: id, mood: source.mood, view: source.view, theme: source.theme, fontSize: source.fontSize,
        progress: { ...state.progress, [id!]: pageOf(source) }, readFraction: { ...state.readFraction, [id!]: source.readFraction[id!] ?? 0 },
        revealed: [...new Set([...state.revealed, ...(source.view === "reveal" ? [id!] : [])])],
        seen: [...new Set([...state.seen, id!])], explored: [...new Set([...state.explored, id!])] }
    }
    case "another": return select(state, recommend(state, state.mood))
    case "revisit": {
      const mood = action.mood ?? state.mood
      return select({ ...state, explored: [], skipped: [], lastSkip: null }, books.find((book) => matchesMood(book.id, mood))?.id ?? null, mood)
    }
    case "font": return [0, 1, 2].includes(action.size) ? { ...state, fontSize: action.size } : state
    case "theme": return { ...state, theme: action.theme ?? (state.theme === "paper" ? "night" : "paper") }
  }
}

/** Validate persisted data; never let a corrupt/blocked storage API stop reading. */
export function restore(raw: string | null): ReadingState {
  if (!raw) return initialState
  try {
    const data = JSON.parse(raw)
    if (!data || data.version !== 1) return initialState
    const ids = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && !!bookById(id)))] : []
    const progress: Record<string, number> = {}
    const readFraction: Record<string, number> = {}
    for (const book of books) {
      const value = data.progress?.[book.id]
      if (typeof value === "number" && Number.isFinite(value)) progress[book.id] = Math.min(book.pages.length - 1, Math.max(0, Math.trunc(value)))
      const fraction = data.readFraction?.[book.id]
      if (typeof fraction === "number" && Number.isFinite(fraction)) readFraction[book.id] = Math.min(1, Math.max(0, fraction))
    }
    const currentId = bookById(data.currentId)?.id ?? initialState.currentId
    const seen = ids(data.seen)
    if (currentId && !seen.includes(currentId)) seen.push(currentId)
    const explored = Array.isArray(data.explored) ? ids(data.explored) : [...seen]
    if (currentId && !explored.includes(currentId)) explored.push(currentId)
    return { ...initialState, currentId, mood: moods.includes(data.mood) ? data.mood : initialState.mood,
      saved: ids(data.saved), revealed: ids(data.revealed), seen, explored, progress, readFraction,
      fontSize: [0, 1, 2].includes(data.fontSize) ? data.fontSize : 1, theme: data.theme === "night" ? "night" : "paper" }
  } catch { return initialState }
}
export function serialize(state: ReadingState): string {
  const { mood, currentId, progress, readFraction, saved, revealed, seen, explored, fontSize, theme } = state
  return JSON.stringify({ version: 1, mood, currentId, progress, readFraction, saved, revealed, seen, explored, fontSize, theme })
}
export function loadReadingState(): ReadingState {
  try { return restore(typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY)) }
  catch { return initialState }
}
