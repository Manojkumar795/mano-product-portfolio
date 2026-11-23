import { useState, type CSSProperties } from "react"
import type { Book } from "./books"

export default function BookCover({ book, miniature = false, artworkOnly = false }: { book: Book; miniature?: boolean; artworkOnly?: boolean }) {
  const [failed, setFailed] = useState(false)
  return <div className={`fp-cover ${miniature ? "fp-cover-mini" : ""} ${artworkOnly ? "fp-artwork-only" : ""} ${failed ? "fp-cover-fallback" : ""}`} style={{ "--cover-color": book.color, "--cover-accent": book.accent } as CSSProperties} role="img" aria-label={`${book.title}, by ${book.author}. Illustrated ${book.genre.toLowerCase()} cover.`}>
    <img src={`/firstpage/${book.id}.webp`} alt="" loading="eager" decoding="async" onError={() => setFailed(true)} draggable={false} />
    {!artworkOnly && <><h3>{book.title}</h3><span className="fp-cover-author">{book.author}</span></>}
  </div>
}
