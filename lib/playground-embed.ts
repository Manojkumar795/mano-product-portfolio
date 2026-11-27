/** Original component canvas widths; viewport width remains desktop at every tile size. */
export const EMBED_GUTTER = 24;
export const EMBED_VIEWPORT_MIN = 1600;
export const EMBED_CHANNEL = "mano-playground-v1";
export const playgroundCanvases = {
  music: { label: "Music Player", width: 760, initialHeight: 900 },
  firstpage: { label: "FirstPage", width: 1500, initialHeight: 760 },
  tonight: { label: "Tonight", width: 700, initialHeight: 820 },
  checkout: { label: "Express Checkout", width: 600, initialHeight: 950 },
  ticket: { label: "Digital Ticket", width: 320, initialHeight: 640 },
  pizza: { label: "Build Your Pizza", width: 1100, initialHeight: 700 },
  cipher: { label: "Cipher — OTP Verification", width: 348, initialHeight: 428 },
  "circadia": { label: "Circadia", width: 270, initialHeight: 480 },
  milestone: { label: "Milestone — YouTube subscriber count", width: 340, initialHeight: 428 },
} as const;
export type PlaygroundId = keyof typeof playgroundCanvases;
export function isPlaygroundId(value: unknown): value is PlaygroundId {
  return typeof value === "string" && Object.hasOwn(playgroundCanvases, value);
}
export function fitPlaygroundCanvas(available: number, width: number, height: number, allowUpscale = false) {
  const scale = Math.min(allowUpscale ? Infinity : 1, Math.max(0, available) / width);
  return { scale, height: height * scale, left: Math.max(0, (available - width * scale) / 2) };
}
export type EmbedBounds = { x: number; y: number; width: number; height: number };
export function validEmbedBounds(value: unknown, width: number, height: number): value is EmbedBounds {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, number>;
  return [b.x,b.y,b.width,b.height].every(Number.isFinite) && b.x >= 0 && b.y >= 0
    && b.width >= 100 && b.height >= 100 && b.x + b.width <= width + 1 && b.y + b.height <= height + 1;
}
export function validEmbedSize(value: unknown, id: PlaygroundId, width: number = playgroundCanvases[id].width + EMBED_GUTTER * 2): value is { channel: string; event: "size"; component: PlaygroundId; width: number; height: number; bounds?: unknown } {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return data.channel === EMBED_CHANNEL && data.event === "size" && data.component === id
    && data.width === width
    && typeof data.height === "number" && Number.isFinite(data.height) && data.height >= 100 && data.height <= 10000;
}
