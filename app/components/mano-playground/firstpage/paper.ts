export const PAPER_TURN_SECONDS = .88
export const PAPER_COLUMNS = 64
export const PAPER_ROWS = 12
export function spreadStart(page: number, columns: number) { return Math.floor(page / columns) * columns }
export function turnTarget(page: number, total: number, columns: number, direction: number): number | null {
  const next = spreadStart(page, columns) + Math.sign(direction) * columns
  return next < 0 || next >= total ? null : next
}

/** One continuous sheet. Arc length stays constant as the free edge curls behind the spine. */
export function paperPoint(progress: number, u: number, v: number, width: number, height: number, direction: number, columns = 2) {
  const p = Math.max(0, Math.min(1, progress)), lift = Math.sin(Math.PI * p)
  const bend = lift * 1.55 * (1 + (v - .5) * .12), angle = Math.PI * p
  const x = bend < .00001 ? width * u : width * Math.sin(bend * u) / bend
  const z = bend < .00001 ? 0 : -width * (1 - Math.cos(bend * u)) / bend
  const sign = Math.sign(direction), hinge = columns === 2 ? width : sign > 0 ? 0 : width
  const normal = Math.cos(angle - bend * u)
  return {
    x: hinge + sign * (x * Math.cos(angle) - z * Math.sin(angle)),
    y: height * v - lift * width * .045 * u * u * (v - .3),
    z: x * Math.sin(angle) + z * Math.cos(angle),
    front: sign > 0 ? u : 1 - u,
    normal,
    light: .83 + .17 * Math.abs(normal) + lift * .035 * Math.sin(bend * u),
  }
}

/** Indexed triangles share their vertices and texture coordinates: no panel boundaries. */
export function paperIndices(cols = PAPER_COLUMNS, rows = PAPER_ROWS) {
  const indices = new Uint16Array(cols * rows * 6)
  let index = 0
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const a = row * (cols + 1) + col, b = a + cols + 1
    indices.set([a, b, a + 1, a + 1, b, b + 1], index); index += 6
  }
  return indices
}
export function paperVertices(progress: number, width: number, height: number, direction: number, columns: number) {
  const data = new Float32Array((PAPER_COLUMNS + 1) * (PAPER_ROWS + 1) * 7)
  let index = 0
  for (let row = 0; row <= PAPER_ROWS; row++) for (let col = 0; col <= PAPER_COLUMNS; col++) {
    const v = row / PAPER_ROWS, point = paperPoint(progress, col / PAPER_COLUMNS, v, width, height, direction, columns)
    data.set([point.x, point.y, point.z, point.front, v, point.normal, point.light], index); index += 7
  }
  return data
}

/** Keep the curl clear of neighboring UI while retaining depth across the spread. */
export const PAPER_VERTICAL_PERSPECTIVE = .12
export function projectPaperPoint(point: { x: number; y: number; z: number }, width: number, height: number) {
  const perspective = 1800 / (1800 - point.z)
  return {
    x: (point.x - width / 2) * perspective + width / 2,
    y: (point.y - height / 2) * (1 + (perspective - 1) * PAPER_VERTICAL_PERSPECTIVE) + height / 2,
  }
}
