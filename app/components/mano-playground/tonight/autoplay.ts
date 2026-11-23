import { availableMovies, fitsFilters, type Movie, type TonightState, type Vote } from "./model"

export type DemoStep =
  | { type: "vote"; movieId: string; vote: Vote; interaction: "swipe" | "heart"; delay: number }
  | { type: "choose" | "continue" | "replay"; delay: number }

/** The demo uses the real reducer and the same unanimous-match rules as manual play. */
export function nextDemoStep(movies: readonly Movie[], state: TonightState): DemoStep | null {
  if (state.matchId) return { type: state.chosenId === state.matchId ? "continue" : "choose", delay: state.chosenId ? 3200 : 4200 }
  const available = availableMovies(movies, state)
  const movie = available[0]
  if (movie) {
    const swipe = state.history.length % 4 < 3 && available.length > 1
    return { type: "vote", movieId: movie.id, vote: swipe ? "pass" : "like", interaction: swipe ? "swipe" : "heart", delay: 1200 }
  }
  return movies.some((item) => fitsFilters(item, state.filters)) ? { type: "replay", delay: 2800 } : null
}
