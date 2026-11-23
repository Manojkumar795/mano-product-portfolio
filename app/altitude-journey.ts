/** Coordinates match Three's SphereGeometry and an equirectangular Earth texture. */
export const AIRPORTS = {
  lax: { latitude: 33.9416, longitude: -118.4085, label: "LOS ANGELES · LAX" },
  hnd: { latitude: 35.5494, longitude: 139.7798, label: "TOKYO · HND" },
};
export type Point3 = [number, number, number];
export type AircraftPart = "full" | "engine" | "wing" | "cabin";
export type AltitudeView = "journey" | "aircraft" | "arrival" | "discover";
export function geographicPoint(
  latitude: number,
  longitude: number,
  radius = 1,
): Point3 {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  return [
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
  ];
}
const start = geographicPoint(AIRPORTS.lax.latitude, AIRPORTS.lax.longitude);
const end = geographicPoint(AIRPORTS.hnd.latitude, AIRPORTS.hnd.longitude);
const angle = Math.acos(start.reduce((sum, v, i) => sum + v * end[i], 0));
/** The shortest great-circle path crosses the Pacific/date line, never the Atlantic. */
export function journeyPoint(progress: number, radius = 1.65): Point3 {
  const t = Math.max(0, Math.min(1, progress));
  const a = Math.sin((1 - t) * angle) / Math.sin(angle);
  const b = Math.sin(t * angle) / Math.sin(angle);
  const raised = radius + 0.025 + Math.sin(t * Math.PI) * 0.12;
  return start.map((v, i) => (v * a + end[i] * b) * raised) as Point3;
}
export function journeyPhase(progress: number) {
  if (progress >= 100)
    return {
      title: "Arrived at Tokyo Haneda",
      next: "Your arrival at Haneda",
      status: "Arrived",
    };
  if (progress >= 85)
    return {
      title: "Approaching Tokyo",
      next: "Preparing for arrival at Haneda",
      status: "On approach",
    };
  if (progress <= 8)
    return {
      title: "Departing Los Angeles",
      next: "Climbing toward the Pacific",
      status: "Departing",
    };
  return {
    title: "Crossing the Pacific",
    next:
      progress >= 50
        ? "Over the North Pacific, heading toward Japan"
        : "Heading toward the international date line",
    status: "In flight",
  };
}
export const AIRCRAFT_PARTS = {
  full: {
    title: "Boeing 777-300ER",
    text: "A closer look at the aircraft carrying you across the Pacific.",
  },
  engine: {
    title: "Engine",
    text: "Air flows through the fan and core to produce thrust. The streamlined nacelle helps reduce drag.",
  },
  wing: {
    title: "Wing",
    text: "The curved wing creates lift. Movable flaps help the aircraft fly more slowly during takeoff and landing.",
  },
  cabin: {
    title: "Cabin",
    text: "The pressurised cabin keeps the journey comfortable while the aircraft cruises high above the ocean.",
  },
};

/** Fixed illustrative itinerary; time zones come from the actual flight date. */
const DEMO_DEPARTURE = "2026-10-08T18:40:00Z";
const DURATION_MINUTES = 720;
const DEMO_ARRIVAL = new Date(Date.parse(DEMO_DEPARTURE) + DURATION_MINUTES * 60000).toISOString();
function localTime(instant: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZoneName: "short" }).formatToParts(new Date(instant));
  const get = (name: string) => parts.find(part => part.type === name)?.value ?? "";
  return { time: `${get("hour")}:${get("minute")}`, zone: get("timeZoneName") === "GMT+9" ? "JST" : get("timeZoneName") };
}
const departure = localTime(DEMO_DEPARTURE, "America/Los_Angeles");
const arrival = localTime(DEMO_ARRIVAL, "Asia/Tokyo");
export function flightTiming(progress: number) {
  const minutes = Math.round(DURATION_MINUTES * (1 - Math.max(0, Math.min(100, progress)) / 100));
  return { departureISO: DEMO_DEPARTURE, arrivalISO: DEMO_ARRIVAL, departureTime: departure.time, departureZone: departure.zone, arrivalTime: arrival.time, arrivalZone: arrival.zone, duration: "12h 00m", remaining: `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`, elapsed: `${Math.floor((DURATION_MINUTES - minutes) / 60)}h ${String((DURATION_MINUTES - minutes) % 60).padStart(2, "0")}m`, arrivalDay: "+1 day" };
}
