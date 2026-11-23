export type Mood = "Any" | "Feel Good" | "Thrilling" | "Relaxed"
export type Genre = "Any" | "Comedy" | "Action" | "Sci-Fi" | "Drama"
export type Vote = "like" | "pass"
export interface Movie {
  id: string
  title: string
  year: number
  poster: string
  score: number
  minutes: number
  genres: string[]
  moods: Exclude<Mood, "Any">[]
  friends: readonly [boolean, boolean, boolean]
  source: string
}
export interface Filters { mood: Mood; genre: Genre; runtime: "Any" | "Under 2 hours" }
export interface Decision { movieId: string; vote: Vote }
export interface TonightState {
  filters: Filters
  votes: Record<string, Vote>
  saved: string[]
  history: Decision[]
  matchId: string | null
  chosenId: string | null
  lastVote: Decision | null
  revisitId: string | null
}
export const initialState: TonightState = {
  filters: { mood: "Any", genre: "Any", runtime: "Any" }, votes: {}, saved: [], history: [],
  matchId: null, chosenId: null, lastVote: null, revisitId: null,
}
export type Action =
  | { type: "vote"; movieId: string; vote: Vote }
  | { type: "save"; movieId: string }
  | { type: "filters"; filters: Partial<Filters> }
  | { type: "undo" }
  | { type: "continue" }
  | { type: "choose" }
  | { type: "restart" }
  | { type: "replay" }
export function fitsFilters(movie: Movie, filters: Filters) {
  return (filters.mood === "Any" || movie.moods.includes(filters.mood)) &&
    (filters.genre === "Any" || movie.genres.includes(filters.genre)) &&
    (filters.runtime === "Any" || movie.minutes < 120)
}
export function unanimous(movie: Movie, vote?: Vote) {
  return vote === "like" && movie.friends.every(Boolean)
}
export function agreement(movie: Movie, vote?: Vote) {
  return movie.friends.filter(Boolean).length + (vote === "like" ? 1 : 0)
}
export function availableMovies(movies: readonly Movie[], state: TonightState) {
  const available = movies.filter((movie) => fitsFilters(movie, state.filters) && !state.votes[movie.id])
  return state.revisitId ? [...available].sort((a, b) => Number(b.id === state.revisitId) - Number(a.id === state.revisitId)) : available
}
export function createReducer(movies: readonly Movie[]) {
  return (state: TonightState, action: Action): TonightState => {
    switch (action.type) {
      case "vote": {
        const movie = movies.find((item) => item.id === action.movieId)
        if (!movie || state.votes[action.movieId] || state.matchId) return state
        const decision = { movieId: action.movieId, vote: action.vote }
        return { ...state, votes: { ...state.votes, [movie.id]: action.vote }, history: [...state.history, decision],
          lastVote: decision, revisitId: null, matchId: unanimous(movie, action.vote) ? movie.id : null, chosenId: null }
      }
      case "save":
        if (!movies.some((movie) => movie.id === action.movieId)) return state
        return { ...state, saved: state.saved.includes(action.movieId) ? state.saved.filter((id) => id !== action.movieId) : [...state.saved, action.movieId] }
      case "filters": return { ...state, filters: { ...state.filters, ...action.filters }, lastVote: null, revisitId: null }
      case "undo": {
        const last = state.history.at(-1)
        if (!last) return state
        const votes = { ...state.votes }; delete votes[last.movieId]
        return { ...state, votes, history: state.history.slice(0, -1), matchId: null, chosenId: null, lastVote: null, revisitId: last.movieId }
      }
      case "continue": return { ...state, matchId: null, chosenId: null }
      case "choose": return state.matchId ? { ...state, chosenId: state.matchId } : state
      case "restart": return { ...initialState, saved: [...state.saved] }
      case "replay": return { ...initialState, filters: { ...state.filters }, saved: [...state.saved] }
    }
  }
}
export const runtimeLabel = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`
