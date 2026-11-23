# Tonight — Interactive Movie Match

A standalone React 19 + TypeScript component for an interactive portfolio tile.
It contains one cinematic card container, with no routing, navigation, login,
backend, movie API, or payment dependencies.

## Integration

Copy `src/tonight/`, `src/CreatorCredit.tsx`, and `src/CreatorCredit.css`
into your React project and `public/tonight/` into your public
asset folder. Install `motion` (`^14.1.1`). Import the component:

```tsx
import { Tonight } from "./tonight"

export default function ShowcaseTile() {
  return <Tonight onChoose={(movie) => console.log("Tonight’s pick:", movie.id)} />
}
```

The component imports its own scoped stylesheet. No Tailwind or global reset is
required. It responds to its parent’s width through container queries. Asset
paths start at `/tonight/`; update `poster` paths in `movies.ts` if using another
public base path. Omit `preview.css` when embedding; it is only for the standalone
Site view. `onChoose` fires when Let's Watch is selected. The component then
shows the chosen film and its movie-details link; it does not stream movies.

The showcase includes Tonight as its fifth component and opens it by default.
The exported component remains independent of the showcase navigation.

## Composition

The default view keeps the poster deck and group decisions in one compact card.
The full filter bar is replaced with a header filter button that opens an accessible
dialog. Pass, Like, and Save sit below group votes on wider tiles and immediately
below the poster on narrow tiles. The moving star field, wave lines, and haze are decorative,
ignore pointer events, and respect reduced motion. The warm credit reads
“Curated by Mano” and is also shared by the other showcase previews.
The movie count and visible Undo buttons are omitted. U still reverses the last vote.
The match overlay uses constrained grid tracks and a scrollable panel, so its close
control, poster, title, and buttons remain inside the component.

## Product behavior

- Twelve real movies with locally bundled posters and verified critic-score snapshots.
- Four participants: you plus Alex, Sam, and Riya. Friend preferences are
  predefined demo data, visible for the movie currently on the deck. There are no live people or
  network reactions. Mood categories are authored demo groupings.
- Drag right to Like, left to Pass. Mouse/touch gestures use 90px distance or
  700px/s velocity with at least 25px distance. Buttons work independently.
- Focus the poster: Right Arrow likes, Left Arrow passes, S saves, U undoes.
- Save toggles the shortlist without voting or advancing the deck. The drawer
  supports removal and keyboard focus management.
- Undo reverses the last vote, including a unanimous match. Filter changes
  preserve votes, Undo history, and saved movies. An undone film returns to the
  current deck only if it fits the current filters.
- Only four likes create a match. Passing never matches. Duplicate votes are
  rejected. Continue browsing keeps existing votes.
- Filters intersect. Under 2 hours is strictly less than 120 minutes.
- Empty filters and completed decks have distinct empty states.
- Restart clears votes/history/filters and keeps saved movies. State remains
  inside the mounted component; there is no automatic reload persistence.
- Reduced motion removes card tilt, spatial transitions, and the celebration.
  The normal match celebration completes within 1.65 seconds.
- The automatic demo waits for all twelve local posters to load and decode.
  A visible cursor then performs three smooth card swipes before moving to the heart
  on the fourth movie, pausing, and visibly clicking. It then points to Let's Watch
  and Continue browsing. Cursor travel follows gentle curves with small changes in aim and timing.
  Card approaches take 0.5–0.6 seconds and swipes take 0.56–0.64 seconds.
  The 1.2-second viewing pause, 0.3-second transition lock, and varied hover and
  press pauses run at twice the previous speed, with the same easing curves.
  Card promotion springs retain their damping ratio at twice the frequency.
- All three deck cards are complete, continuously mounted movie surfaces, including
  title, year, runtime, rating, and genres. A back card retains its decoded poster
  and content when it becomes the front card, without a new title fade or skeleton.
- The demo shows only valid unanimous matches, acknowledges the film, and continues. The Auto demo control pauses/resumes it; mouse or keyboard
  interaction hands control to the user. Automatic selections do not call
  `onChoose`; that callback remains reserved for a user clicking Let's Watch.
- Completing an automatic cycle replays the deck while retaining filters and saved
  movies. Incompatible filters stop the demo. Hidden tabs and offscreen components
  pause automatic progression; the animated sky also stops while hidden.
- Set `isPlaying={false}` for a manual initial preview. Optional `onAutoplayChange`
  lets the host synchronize its own playback control. Reduced motion uses static
  stars, no spatial swipes, and slower automatic steps.

## Validation

The project passed TypeScript checking and 21 product-logic checks for unanimous
matching, duplicate prevention, Undo, filtering, runtime boundaries, saved state,
restart, full-deck traversal, the three-swipe/heart sequence, preload deduplication, decode completion, and failed-poster recovery. Browser gesture and visual QA were unavailable
in the build environment.

## Movie data and media credits

Movie posters and critic-score snapshots were retrieved from the corresponding
Rotten Tomatoes pages on 13 October 2026. Percentages are Tomatometer critic
scores, not group-agreement percentages. Genre metadata comes from those pages;
runtimes use their movie-info sections. Ratings may change after this snapshot.
`credits.json` records the exact source and image URL for every film. Original
poster artwork belongs to its respective rights holders.

| Movie | Runtime | Critics score | Source |
| --- | --- | --- | --- |
| The Secret Life of Walter Mitty (2013) | 114 min | 52% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/the_secret_life_of_walter_mitty_2013) |
| Dune (2021) | 155 min | 83% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/dune_2021) |
| Spirited Away | 125 min | 96% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/spirited_away) |
| Paddington 2 | 103 min | 99% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/paddington_2) |
| Knives Out | 130 min | 97% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/knives_out) |
| The Grand Budapest Hotel | 99 min | 92% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/the_grand_budapest_hotel) |
| Inception | 148 min | 86% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/inception) |
| The Martian | 142 min | 91% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/the_martian) |
| Soul | 100 min | 95% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/soul_2020) |
| WALL-E | 97 min | 95% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/wall_e) |
| About Time | 124 min | 70% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/about_time) |
| Chef (2014) | 115 min | 87% | [Rotten Tomatoes](https://www.rottentomatoes.com/m/chef_2014) |
