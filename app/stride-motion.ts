export type ShoeStory = 0 | 1 | 2 | 3;
export const SHOE_CYCLE_SECONDS = 6;
export const SHOE_HERO_ANGLE = Math.PI / 3;
export const SHOE_STORIES = [
  { title: "Made to move differently.", description: "A distinctive silhouette designed to stand out." },
  { title: "Air you can see.", description: "Discover the visible Air cushioning design." },
  { title: "Every detail matters.", description: "Explore the upper, lacing and sculpted construction." },
  { title: "Find your everyday rhythm.", description: "An expressive silhouette for everyday style." },
] as const;
const TAU = Math.PI * 2;
export const wrapShoeAngle = (angle: number) => ((angle % TAU) + TAU) % TAU;
const stops = [0, 30, 150, 240, 360];
const sceneSeconds = SHOE_CYCLE_SECONDS / 4;
const velocities = [24, 24, 70, 70, 24];

/** A monotonic orbit with matching velocities at every scene and loop boundary. */
export function shoeCinematicPose(seconds: number) {
  const time = ((seconds % SHOE_CYCLE_SECONDS) + SHOE_CYCLE_SECONDS) % SHOE_CYCLE_SECONDS;
  const scene = Math.min(3, Math.floor(time / sceneSeconds));
  const u = (time - scene * sceneSeconds) / sceneSeconds;
  const u2 = u * u, u3 = u2 * u;
  const degrees = (2 * u3 - 3 * u2 + 1) * stops[scene]
    + (u3 - 2 * u2 + u) * velocities[scene] * sceneSeconds
    + (-2 * u3 + 3 * u2) * stops[scene + 1]
    + (u3 - u2) * velocities[scene + 1] * sceneSeconds;
  const angle = SHOE_HERO_ANGLE + degrees * Math.PI / 180;
  const orbit = degrees * Math.PI / 180;
  return {
    angle,
    elevation: .18 + .1 * (1 - Math.cos(orbit)) / 2,
    radius: 1 + .025 * Math.cos(orbit),
    key: 2.8 + .3 * Math.sin(orbit),
    rim: 1.4 + .2 * (1 - Math.cos(orbit)),
  };
}

/** Read camera orientation, with a 2° dead band around story boundaries. */
export function shoeStoryForAngle(angle: number, current: ShoeStory = 0): ShoeStory {
  const degrees = wrapShoeAngle(angle - SHOE_HERO_ANGLE) * 180 / Math.PI;
  if ([0, 30, 150, 240].some(boundary => Math.abs(((degrees - boundary + 540) % 360) - 180) < 2)) return current;
  return (degrees < 30 ? 0 : degrees < 150 ? 1 : degrees < 240 ? 2 : 3) as ShoeStory;
}

/** Resume at the user's actual angle instead of snapping back to the timeline. */
export function shoeTimeForAngle(angle: number) {
  const target = wrapShoeAngle(angle - SHOE_HERO_ANGLE);
  let low = 0, high = SHOE_CYCLE_SECONDS;
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2;
    const relative = shoeCinematicPose(middle).angle - SHOE_HERO_ANGLE;
    if (relative < target) low = middle; else high = middle;
  }
  return (low + high) / 2;
}

/** Frame the complete existing bounding box at every angle, including narrow stages. */
export function shoeFramingRadius(halfX: number, halfY: number, halfZ: number, aspect: number, fov = 38) {
  const vertical = Math.tan(fov * Math.PI / 360) * .94;
  const horizontal = vertical * aspect;
  let radius = 6.5;
  for (let sample = 0; sample < 144; sample++) {
    const angle = sample * Math.PI / 72;
    for (const elevation of [.18, .28]) {
      const sin = Math.sin(angle), cos = Math.cos(angle), se = Math.sin(elevation), ce = Math.cos(elevation);
      for (const x of [-halfX, halfX]) for (const y of [-halfY, halfY]) for (const z of [-halfZ, halfZ]) {
        const depth = x * sin * ce + y * se + z * cos * ce;
        const right = x * cos - z * sin;
        const up = -x * sin * se + y * ce - z * cos * se;
        radius = Math.max(radius, depth + Math.max(Math.abs(right) / horizontal, Math.abs(up) / vertical));
      }
    }
  }
  return radius * 1.005;
}
