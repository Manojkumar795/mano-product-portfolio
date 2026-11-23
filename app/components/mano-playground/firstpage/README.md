# FirstPage — Read the story first

A self-contained React + TypeScript reading feature with original excerpts,
illustrated covers, immediately visible book details, saved reading progress, and live
autoplay. FirstPage remains item 06 in Mano's existing component playground.

## Embed

Copy `src/firstpage` and `public/firstpage`. Install React 19 and `motion` 14.
The FirstPage CSS is scoped and does not require Tailwind utility classes.

```tsx
import FirstPage from "./firstpage"

<FirstPage />
<FirstPage isPlaying={false} /> // Start in manual reading mode.
```

Optional props: `className`, `isPlaying` (true by default), and
`onAutoplayChange(playing)` for the host's playback controls.

## Focused layout

The open book appears immediately. The mood-button row has been removed;
autoplay selects across categories internally without exposing extra controls. The large hero, explanatory
header copy, extra cover catalogue, repeated pull quotes, fake sample ratings,
and empty final page have been removed. A compact FirstPage wordmark and clear
**Designed by Mano** credit share a compact row above both columns. The open book
and a single combined details/shelf panel share their top and bottom edges. Padding,
cover sizes, buttons, and shelf spacing are coordinated across desktop and mobile.
The previous footer and bottom autoplay button are removed. Reading tools
contain one font-size control and one theme toggle.

All six fictional books contain four substantial narrative pages (24 in total).
Every desktop spread has two real pages. On mobile, a full-width leaf advances
one page at a time. Restoring an odd page from a mobile session opens the matching
spread on desktop. All 24 pages at the current font size are measured invisibly before paint to
choose one stable height across all six books: paragraphs remain in normal flow without scroll clipping.
The pull quote appears only on the second page, once per sample.

## Paper motion

Page turns use an 880ms continuous, textured paper mesh drawn onto one canvas.
The free edge curls along an arc with constant paper width, subtle diagonal flex,
controlled vertical perspective that stays clear of the heading,
front/back text, continuous lighting, and a moving cast shadow. Shared vertices
and texture coordinates eliminate the old separately transformed panel seams.
The browser's real paragraph line breaks are measured into temporary textures;
reading itself remains accessible, selectable HTML. GPU resources are released
when each turn finishes. A full-sheet CSS fallback preserves navigation when GPU
rendering is unavailable; reduced motion commits without a spatial flip.

Arrow, keyboard, page-edge click, touch/mouse drag, and autoplay use the same
controller. A partial drag bends the page with the pointer; releasing before
40px settles it back. Progress commits only after landing. Cancellation removes
the turning surface and does not advance the book.

## Reading and shelf behavior

- Moods recommend locally tagged samples. Surprise Me selects unread stories.
- Explore Another selects the next sample. The old Not for me control and
  decorative folded corner have been removed; real turns still bend the paper.
- Exhaustion offers another mood or an explicit browse-again round.
- Cover, title, author, description, and save controls appear immediately in
  manual mode and autoplay. The old hooked prompt is removed. Saving is
  idempotent, and all saved books display their covers. Legacy reveal flags
  remain compatible with existing storage but no longer gate the interface.
- Shelf items restore progress; removal keeps the saved reading position.
- Shelf progress uses four fine page marks and a percentage, with no save icon.
  Both visible leaves count on desktop; the final spread reaches 100%.
  Completion stays recorded when going backward or reopening a saved story.
- Explore Another and the shelf plus control both choose another available story,
  switching categories internally when necessary.
- Versioned, sanitised localStorage preserves the visitor's shelf and progress.
  Blocked storage falls back to in-memory reading.

## Autoplay

Autoplay uses its own preview shelf, separate from the visitor's persistent
saves. It waits for all six cover illustrations to load/decode, turns the real
paper pages, demonstrates the single theme toggle, saves a book, and
continues through moods and new discovery rounds. A curved, eased pointer follows
the sheet through a turn. Taking control preserves the visitor's own shelf and
adopts only the currently visible reading position. Offscreen/hidden tabs pause
the walkthrough; reduced motion allows at least five seconds between steps.
Autoplay still starts by default without an on-screen playback button. Press P
within the component to pause or resume it; this shortcut is exposed to assistive
technology. The host can also control playback through the component props.

## Artwork and verification

Six built-in image-generation illustrations live in `public/firstpage/*.webp`.
Their prompt descriptions are in `public/firstpage/artwork-prompts.json`.
HTML renders cover typography; there is no prerecorded interface video.

TypeScript and 34 FirstPage checks cover complete spreads, mobile page order,
quote uniqueness, continuous paper geometry in both directions, full autoplay
loops, recommendation boundaries, saved progress, always-visible details, storage, and
manual takeover. The existing Tonight's 21 checks also pass. Browser motion and
visual verification are unavailable in this environment.
