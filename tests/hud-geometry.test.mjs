import assert from "node:assert/strict";
import test from "node:test";
import { HERO_PHOTO, VISOR_REGION, EXHAUST_ANCHOR, projectVisor } from "../app/f35-helmet-ux/hudGeometry.ts";

test("visor coordinates retain the measured source-image region", () => {
  assert.deepEqual(projectVisor(HERO_PHOTO.width, HERO_PHOTO.height), { left: VISOR_REGION.x, top: VISOR_REGION.y, width: VISOR_REGION.width, height: VISOR_REGION.height });
});

for (const [width, height, positionX] of [[1920, 1064, 0.5], [1440, 984, 0.5], [835, 753, 0.5], [390, 490, 0.91], [320, 490, 0.91]]) {
  test(`visor remains registered to the cover crop at ${width} × ${height}`, () => {
    const scale = Math.max(width / HERO_PHOTO.width, height / HERO_PHOTO.height);
    const projected = projectVisor(width, height, positionX);
    assert.equal(projected.left, (width - HERO_PHOTO.width * scale) * positionX + VISOR_REGION.x * scale);
    assert.equal(projected.top, VISOR_REGION.y * scale);
    assert.ok(Math.abs(projected.width / projected.height - VISOR_REGION.width / VISOR_REGION.height) < 1e-12);
    assert.ok(projected.left < width && projected.left + projected.width > 0);
  });
}

test("exhaust starts at the nozzle, in the same coordinate system as its aircraft", () => {
  assert.equal(EXHAUST_ANCHOR.x * 1536, 287);
  assert.equal(EXHAUST_ANCHOR.y * 650, 441);
});
