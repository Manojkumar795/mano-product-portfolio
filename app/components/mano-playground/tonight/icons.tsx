export function Icon({ name, size = 20, filled = false }: { name: "heart" | "pass" | "save" | "undo" | "restart" | "close" | "arrow" | "clock" | "group" | "spark" | "chevron" | "check" | "film" | "filter" | "play" | "pause"; size?: number; filled?: boolean }) {
  const paths = {
    heart: <path d="M20.8 4.6a5.4 5.4 0 0 0-7.7 0L12 5.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.7Z" />,
    pass: <path d="m6 6 12 12M6 18 18 6" />,
    save: <path d="M6 3h12v18l-6-4-6 4V3Z" />,
    undo: <><path d="M4 5v6h6" /><path d="M4 11a8 8 0 1 1 1 7" /></>,
    restart: <><path d="M20 4v6h-6" /><path d="M20 10a8 8 0 1 0-1 8" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>,
    group: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5" /></>,
    spark: <path d="m12 3 2.8 6.2L21 12l-6.2 2.8L12 21l-2.8-6.2L3 12l6.2-2.8L12 3Z" />,
    chevron: <path d="m8 5 7 7-7 7" />,
    check: <path d="m5 12 4 4L19 6" />,
    film: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" /></>,
    filter: <><path d="M4 7h4m4 0h8M4 17h8m4 0h4" /><circle cx="10" cy="7" r="2" /><circle cx="14" cy="17" r="2" /></>,
    play: <path d="m8 4 12 8-12 8V4Z" />,
    pause: <><path d="M8 5v14M16 5v14" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
