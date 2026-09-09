type Point = readonly [number, number];
type Corners = readonly [Point, Point, Point, Point];

export const heroCorners = {
  customer: [[124, 196], [597, 161], [806, 1108], [325, 1176]],
  venue: [[836, 119], [1176, 160], [1048, 840], [685, 784]],
} as const satisfies Record<string, Corners>;

// Project the original app viewport onto the photographed glass, TL/TR/BR/BL.
export function screenTransform([tl, tr, br, bl]: Corners, width = 806, height = 1672) {
  const dx1 = tr[0] - br[0], dx2 = bl[0] - br[0];
  const dy1 = tr[1] - br[1], dy2 = bl[1] - br[1];
  const dx3 = tl[0] - tr[0] + br[0] - bl[0];
  const dy3 = tl[1] - tr[1] + br[1] - bl[1];
  const determinant = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / determinant;
  const h = (dx1 * dy3 - dx3 * dy1) / determinant;
  const a = tr[0] - tl[0] + g * tr[0];
  const b = bl[0] - tl[0] + h * bl[0];
  const d = tr[1] - tl[1] + g * tr[1];
  const e = bl[1] - tl[1] + h * bl[1];
  return `matrix3d(${[a / width, d / width, 0, g / width, b / height, e / height, 0, h / height, 0, 0, 1, 0, tl[0], tl[1], 0, 1].join(",")})`;
}
