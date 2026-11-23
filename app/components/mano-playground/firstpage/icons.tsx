export type IconName = "book" | "bookmark" | "moon" | "sun" | "left" | "right" | "undo" | "close" | "check" | "shelf" | "spark" | "search" | "brain" | "heart" | "plane" | "dice" | "refresh" | "plus" | "pause" | "play"
export function Icon({ name, size = 18, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  const paths: Record<IconName, React.ReactNode> = {
    book: <><path d="M12 5v16M3 3c3-1 6 0 9 2 3-2 6-3 9-2v16c-3-1-6 0-9 2-3-2-6-3-9-2ZM1 6v16c3-1 7-1 11 1 4-2 8-2 11-1V6M5 6l5 2M5 9l5 2M5 12l5 2M5 15l5 2m4-9 5-2m-5 5 5-2m-5 5 5-2m-5 5 5-2" /></>,
    search: <><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></>,
    brain: <><path d="M9 5C4 1 1 7 4 10c-4 3-1 8 3 7 0 5 5 5 5 1V6c0-5 5-5 5-1 5-1 7 5 3 7 3 5-2 8-5 5M7 6v5m-3-1h5m-2 5h5m3-8h4m-4 4v7m-3-7h8" /></>,
    heart: <path d="M12 21 3 12C-3 5 7-1 12 6 17-1 27 5 21 12Z" />,
    plane: <path d="m21 3-7 18-3-8-8-3ZM11 13l10-10M7 18l-3 3" />,
    dice: <><path d="m12 2 10 6v10l-10 5L2 18V8ZM2 8l10 6 10-6M12 14v9" /><circle cx="12" cy="7" r="1" /><circle cx="6" cy="12" r=".7" /><circle cx="8" cy="17" r=".7" /><circle cx="17" cy="15" r=".7" /></>,
    refresh: <><path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5" /></>,
    plus: <path d="M12 5v14M5 12h14" />, pause: <path d="M8 5v14M16 5v14" />, play: <path d="m8 4 12 8-12 8Z" />,
    bookmark: <path d="M6 3h12v18l-6-4-6 4Z" />,
    moon: <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    left: <path d="m14.5 5-7 7 7 7" />, right: <path d="m9.5 5 7 7-7 7" />,
    undo: <><path d="M3 10h12a6 6 0 0 1 0 12M3 10l5-5M3 10l5 5" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />, check: <path d="m5 12 4 4L19 6" />,
    shelf: <><path d="M3 21h18M5 17V4h4v13Zm6 0V4h4v13Zm6-12 3-1 3 12-3 1Z" /></>,
    spark: <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
