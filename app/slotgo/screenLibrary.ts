export type LibraryScreen = {
  id: string;
  side: "customer" | "venue";
  title: string;
  file: string;
  original?: boolean;
};

// Each entry corresponds to one supplied product screen, not a generated UI.
export const screenLibrary: LibraryScreen[] = [
  { id: "customer-home", side: "customer", title: "Home", file: "customer-home" },
  { id: "customer-discover", side: "customer", title: "Matches & tournaments", file: "customer-discover", original: true },
  { id: "customer-explore-list", side: "customer", title: "Explore · List", file: "customer-explore-list" },
  { id: "customer-explore-map", side: "customer", title: "Explore · Map", file: "customer-explore-map", original: true },
  { id: "customer-book-court", side: "customer", title: "Booking · Court", file: "customer-book-court" },
  { id: "customer-book-date", side: "customer", title: "Booking · Date", file: "customer-book-date", original: true },
  { id: "customer-book-time", side: "customer", title: "Booking · Time", file: "customer-book-time" },
  { id: "customer-book-summary", side: "customer", title: "Booking · Summary", file: "customer-book-summary" },
  { id: "customer-book-payment", side: "customer", title: "Booking · Payment", file: "customer-book-payment" },
  { id: "customer-confirmed", side: "customer", title: "Booking confirmed", file: "customer-confirmed" },
  { id: "customer-bookings", side: "customer", title: "My bookings", file: "customer-bookings" },
  { id: "customer-play", side: "customer", title: "Play", file: "customer-play" },
  { id: "customer-open-matches", side: "customer", title: "Open matches", file: "customer-open-matches", original: true },
  { id: "customer-match-confirmed", side: "customer", title: "Match confirmed", file: "customer-match-confirmed" },
  { id: "customer-live-scoreboard", side: "customer", title: "Live scoreboard", file: "customer-live-scoreboard" },
  { id: "customer-match-result", side: "customer", title: "Match result", file: "customer-match-result" },
  { id: "customer-profile", side: "customer", title: "Profile & settings", file: "customer-profile", original: true },
  { id: "venue-home", side: "venue", title: "Home", file: "venue-home", original: true },
  { id: "venue-bookings", side: "venue", title: "Bookings", file: "venue-bookings" },
  { id: "venue-calendar", side: "venue", title: "Calendar · Daily view", file: "venue-calendar" },
  { id: "venue-occupancy", side: "venue", title: "Calendar · Occupancy", file: "venue-occupancy" },
  { id: "venue-book-time", side: "venue", title: "New booking · Date & time", file: "venue-book-time", original: true },
  { id: "venue-book-court", side: "venue", title: "New booking · Court", file: "venue-book-court", original: true },
  { id: "venue-book-player", side: "venue", title: "New booking · Player", file: "venue-book-player", original: true },
  { id: "venue-book-payment", side: "venue", title: "New booking · Payment", file: "venue-book-payment", original: true },
  { id: "venue-confirmed", side: "venue", title: "Booking confirmed", file: "venue-confirmed", original: true },
  { id: "venue-members", side: "venue", title: "Membership · Members", file: "venue-members" },
  { id: "venue-batches", side: "venue", title: "Membership · Batches", file: "venue-batches", original: true },
  { id: "venue-more", side: "venue", title: "More", file: "venue-more", original: true },
  { id: "venue-profile", side: "venue", title: "Venue profile", file: "venue-profile", original: true },
];

export const demoScenes = [
  { screen: "customer-home", label: "Discover", title: "Your next game\nstarts here.", text: "A place to play. People to play with." },
  { screen: "customer-explore-list", label: "Explore", title: "Find the court.\nSee the next slot.", text: "Location, availability and price—together." },
  { screen: "customer-book-time", label: "Choose", title: "Make time\nfor the game.", text: "Choose a slot, with its price already in view." },
  { screen: "customer-book-summary", label: "Review", title: "The details.\nBefore the decision.", text: "Court, time and total. One last look." },
  { screen: "customer-confirmed", label: "Confirm", title: "Court booked.\nSee you there.", text: "The plan stays with you, from payment to play." },
  { screen: "venue-calendar", label: "Operate", title: "One booking.\nBoth sides in view.", text: "For the venue, a place in the day’s schedule." },
] as const;

export const SCENE_DURATION = 4500;
export const DEMO_DURATION = SCENE_DURATION * demoScenes.length;
