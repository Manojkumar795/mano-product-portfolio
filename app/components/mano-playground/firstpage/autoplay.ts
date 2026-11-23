import { books } from "./books"
import { turnTarget } from "./paper"
import { bookById, initialState, pageOf, nextStoryAction, type Action, type ReadingState } from "./model"

/** Reference-preview data lives only in the demo reducer, never in the visitor's shelf. */
export function createDemoState(): ReadingState {
  return { ...initialState, view: "reading", saved: ["orchard", "letters", "stars"], revealed: ["orchard", "letters", "stars"],
    progress: {}, readFraction: { orchard: .4, letters: .12, stars: .28 } }
}
export interface DemoStep { selector: string; delay: number; action: Action; nextPhase: number; kind?: "turn" }
export function nextDemoStep(state: ReadingState, phase: number, columns = 2): DemoStep | null {
  const book = bookById(state.currentId)
  if (!book) return { selector: '[data-fp="revisit"]', delay: 1300, action: { type: "revisit" }, nextPhase: 0 }
  const nextPage = turnTarget(pageOf(state), book.pages.length, columns, 1)
  if (phase === 0 && nextPage !== null) return { selector: '[data-fp="next-edge"]', delay: 2800, action: { type: "page", delta: nextPage - pageOf(state), visiblePages: columns }, nextPhase: 0, kind: "turn" }
  if (phase <= 1) return { selector: '[data-fp="theme"]', delay: 1600, action: { type: "theme", theme: "night" }, nextPhase: 2 }
  if (phase === 2) return { selector: '[data-fp="theme"]', delay: 1500, action: { type: "theme", theme: "paper" }, nextPhase: 3 }
  if (phase <= 4) return { selector: '[data-fp="save"]', delay: 1700, action: { type: "save", id: book.id, force: true, visiblePages: columns }, nextPhase: 5 }
  return { selector: '[data-fp="another"]', delay: 2300, action: nextStoryAction(state), nextPhase: 0 }
}
export const assetSources = books.map((book) => `/firstpage/${book.id}.webp`)
