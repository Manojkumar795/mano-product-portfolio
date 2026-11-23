/** An opening turn that eases from 8°/s to a steady 0.7°/s. */
export function globeRotationAngle(seconds: number) {
  const time = Math.max(0, seconds);
  return (0.7 * time + 7.3 * 2.2 * (1 - Math.exp(-time / 2.2))) * Math.PI / 180;
}
