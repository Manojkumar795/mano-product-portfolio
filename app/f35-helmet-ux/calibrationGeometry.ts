// Pupil centers measured in the unchanged 1610 × 977 pilot photograph.
export const CALIBRATION_IMAGE = { width: 1610, height: 977 };
export const CALIBRATION_PUPILS = [{ x: 1003, y: 410 }, { x: 1350, y: 385 }];
export const CALIBRATION_DURATION_MS = 1800;

export function getCalibrationGeometry(width: number, height: number, positionX = 0.5, positionY = 0.5) {
  const scale = Math.max(width / CALIBRATION_IMAGE.width, height / CALIBRATION_IMAGE.height);
  const offsetX = (width - CALIBRATION_IMAGE.width * scale) * positionX;
  const offsetY = (height - CALIBRATION_IMAGE.height * scale) * positionY;
  const pupils = CALIBRATION_PUPILS.map(({ x, y }) => ({ x: x * scale + offsetX, y: y * scale + offsetY }));
  // A single fused reference above the midpoint of the two pupil centers.
  const reference = { x: 1176.5 * scale + offsetX, y: 246 * scale + offsetY };
  const rays = pupils.map((pupil) => ({
    ...pupil,
    length: Math.hypot(reference.x - pupil.x, reference.y - pupil.y),
    angle: Math.atan2(reference.y - pupil.y, reference.x - pupil.x) * 180 / Math.PI,
  }));
  return { pupils, reference, rays };
}
