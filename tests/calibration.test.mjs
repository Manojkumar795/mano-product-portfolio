import assert from "node:assert/strict";
import test from "node:test";
import { CALIBRATION_DURATION_MS, CALIBRATION_IMAGE, CALIBRATION_PUPILS, getCalibrationGeometry } from "../app/f35-helmet-ux/calibrationGeometry.ts";

test("calibration retains the measured pupil positions in the original photograph", () => {
  const geometry = getCalibrationGeometry(1610, 977);
  assert.deepEqual(geometry.pupils, CALIBRATION_PUPILS);
  assert.equal(CALIBRATION_DURATION_MS, 1800);
});

test("both pupils and the fused reference are inside the mobile photograph", () => {
  for (const width of [280, 350, 560, 640]) {
    const { pupils, reference } = getCalibrationGeometry(width, 400, 0.82);
    for (const point of [...pupils, reference]) {
      assert.ok(point.x > 0 && point.x < width);
      assert.ok(point.y > 0 && point.y < 400);
    }
  }
});

for (const [width, height, positionX] of [[1440, 780, 0.5], [940, 660, 0.57], [780, 694, 0.62], [362, 770, 0.69]]) {
  test(`optical indicators follow the unchanged cover crop at ${width} × ${height}`, () => {
    const { pupils, rays, reference } = getCalibrationGeometry(width, height, positionX);
    const scale = Math.max(width / CALIBRATION_IMAGE.width, height / CALIBRATION_IMAGE.height);
    const imageX = (width - CALIBRATION_IMAGE.width * scale) * positionX;
    const imageY = (height - CALIBRATION_IMAGE.height * scale) * 0.5;
    pupils.forEach((pupil, index) => {
      assert.equal(pupil.x, CALIBRATION_PUPILS[index].x * scale + imageX);
      assert.equal(pupil.y, CALIBRATION_PUPILS[index].y * scale + imageY);
      const ray = rays[index];
      assert.equal(ray.x, pupil.x);
      assert.equal(ray.y, pupil.y);
      const angle = ray.angle * Math.PI / 180;
      assert.ok(Math.abs(ray.x + Math.cos(angle) * ray.length - reference.x) < 1e-8);
      assert.ok(Math.abs(ray.y + Math.sin(angle) * ray.length - reference.y) < 1e-8);
      assert.ok(reference.y < pupil.y);
    });
    assert.ok(Math.abs(reference.x - (pupils[0].x + pupils[1].x) / 2) < 1e-8);
  });
}

test("the calibration section renders only the requested editorial copy and unchanged photo", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(new Request("http://localhost/f35-helmet-ux", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section[^>]*id="calibration"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, "calibration section is present");
  assert.match(section, /04 \/ HUMAN CALIBRATION/);
  assert.match(section, /<h2>The interface<br\s*\/>has to<br\s*\/>align with the<br\s*\/><span>human\.<\/span><\/h2>/);
  assert.match(section, /<h3>Perception has to remain stable\.<\/h3>/);
  assert.match(section, /Calibration adapts the display to the pilot’s eyes — not the pilot to the display\./);
  assert.match(section, /src="\/f35-helmet-ux\/calibration-eyes-v2.webp"/);
  assert.match(section, /width="1610" height="977"/);
  assert.doesNotMatch(section, /PUPIL DISTANCE|OPTICAL ALIGNMENT|ONE FUSED IMAGE|PRODUCT DESIGN TAKEAWAY|MISALIGNED|LEFT EYE|RIGHT EYE|PUPIL ALIGNMENT|OPTICAL CALIBRATION|STABLE PERCEPTION|<svg|<figcaption|data-f35-v2-scrub/);
  assert.match(section, /data-calibration-state="idle" aria-hidden="true"/);
});
