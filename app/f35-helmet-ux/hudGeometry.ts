// Coordinates measured on the original photograph, before object-fit cropping.
export const HERO_PHOTO = { width: 1586, height: 992 };
export const VISOR_REGION = { x: 1013, y: 216, width: 470, height: 280 };
export const EXHAUST_ANCHOR = { x: 287 / 1536, y: 441 / 650 };

export function projectVisor(width: number, height: number, positionX = 0.5, positionY = 0) {
  const scale = Math.max(width / HERO_PHOTO.width, height / HERO_PHOTO.height);
  return {
    left: (width - HERO_PHOTO.width * scale) * positionX + VISOR_REGION.x * scale,
    top: (height - HERO_PHOTO.height * scale) * positionY + VISOR_REGION.y * scale,
    width: VISOR_REGION.width * scale,
    height: VISOR_REGION.height * scale,
  };
}
