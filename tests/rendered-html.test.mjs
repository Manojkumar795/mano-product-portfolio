import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /research-target-lock/);
  assert.match(html, /Aircraft ahead/);
  assert.match(html, /16° right · 18\.4 NM/);
  assert.doesNotMatch(html, /experience-modern|8\+ years inside real|Kyyba Tech|BigCommerce|RKK Enterprise/);
  assert.match(html, /slotgo-card-artwork/);
  assert.match(html, /\/slotgo\/hero-phones\.png/);
  assert.match(html, /\/slotgo\/hero-court\.png/);
  assert.doesNotMatch(html, /slotgo-card-product|slotgo-card-screen/);
});

test("renders the SlotGo customer-to-venue system story", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("slotgo-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/slotgo", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /<h1[^>]*><span>Sports Booking<\/span><span>&amp; Venue<\/span><span>Operations<\/span><\/h1>/);
  for (const destination of ["overview", "analysis", "customer-app", "venue-app", "outcome"]) {
    assert.ok(html.includes('href="#' + destination + '"'));
    assert.ok(html.includes('id="' + destination + '"'));
  }

  // The two product galleries must never mix app ownership again.
  for (const [side, count] of [["customer", 5], ["venue", 4]]) {
    const section = html.match(new RegExp('<section[^>]*data-app="' + side + '"[^>]*>([\\s\\S]*?)<\\/section>'))?.[1];
    assert.ok(section, side + " app section is server-rendered");
    const images = [...section.matchAll(/<img\b[^>]*\bsrc="(\/slotgo\/[^\"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(images).size, count);
    for (const src of images) {
      assert.ok(src.startsWith("/slotgo/" + side + "-"));
      assert.ok(readFileSync(new URL("../public" + src, import.meta.url)).byteLength > 0);
    }
  }
  assert.doesNotMatch(html, /<details\b/);
  assert.match(html, /See the complete screen collection/);
  assert.match(html, /Watch product walkthrough/);
  assert.ok(/data-chapter="true" aria-current="location"/.test(html), "initial chapter is marked current");
  assert.equal([...html.matchAll(/data-shared-state="true"/g)].length, 1);
  assert.equal([...html.matchAll(/data-booking-step="/g)].length, 3);
  assert.match(html, /<th scope="col">Customer App<\/th>/);
  assert.doesNotMatch(html, /68%|76%|4\.8 min|58%|Arjun Mehta|Rohit Kumar/);
  assert.doesNotMatch(html, /SL–6421|Success framework/);
  assert.doesNotMatch(html, /256-bit encryption/);

  // The cinematic appendix preserves the existing story and includes every original.
  assert.ok(html.indexOf('id="product-film"') > html.indexOf('id="outcome"'));
  assert.match(html, /Explore all 30 screens/);
  assert.match(html, /aria-label="Product film scenes"/);
  assert.match(html, /<dialog[^>]*aria-labelledby="screen-dialog-title"/);
  const collection = html.slice(html.indexOf('id="screen-collection"'));
  const split = collection.indexOf('data-showcase-app="venue"');
  for (const [side, section, count] of [["customer", collection.slice(0, split), 17], ["venue", collection.slice(split), 13]]) {
    const images = [...section.matchAll(/<img\b[^>]*\bsrc="(\/slotgo\/[^\"]+)"/g)].map(match => match[1]);
    assert.equal(images.length, count);
    assert.equal(new Set(images).size, count);
    for (const src of images) {
      assert.ok(src.startsWith("/slotgo/" + side + "-"));
      assert.ok(readFileSync(new URL("../public" + src, import.meta.url)).byteLength > 0);
    }
  }
  for (const file of ["studio-phone-pair.png", "studio-locker.png", "hero-phones.png", "hero-court.png"]) {
    assert.ok(html.includes('/slotgo/' + file));
    assert.ok(readFileSync(new URL("../public/slotgo/" + file, import.meta.url)).byteLength > 0);
  }
});

test("hero screen projections align all four corners at every display scale", async () => {
  const { heroCorners, screenTransform } = await import("../app/slotgo/heroGeometry.ts");
  const source = [[0, 0], [806, 0], [806, 1672], [0, 1672]];
  for (const corners of Object.values(heroCorners)) {
    const matrix = screenTransform(corners).slice(9, -1).split(",").map(Number);
    for (const scale of [0.22, 0.48, 1]) {
      source.forEach(([x, y], index) => {
        const divisor = matrix[3] * x + matrix[7] * y + matrix[15];
        const mappedX = (matrix[0] * x + matrix[4] * y + matrix[12]) / divisor;
        const mappedY = (matrix[1] * x + matrix[5] * y + matrix[13]) / divisor;
        assert.ok(Math.abs((mappedX - corners[index][0]) * scale) < 0.001);
        assert.ok(Math.abs((mappedY - corners[index][1]) * scale) < 0.001);
      });
    }
  }
});

test("the SlotGo project follows F-35 and reuses the case-study phone mockup", () => {
  const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  const f35Position = source.indexOf('id: "research"');
  const slotGoPosition = source.indexOf('id: "slotgo"');

  assert.ok(f35Position >= 0 && slotGoPosition > f35Position);
  assert.match(source, /<HeroMockups caption=\{false\} priority=\{false\} animate=\{false\}/);
  assert.match(source, /slotgo-card-artwork/);
  assert.doesNotMatch(source, /slotgo-card-product|slotgo-card-screen/);
  assert.doesNotMatch(source, /slotgo-card-link/);
});

test("the F-35 thumbnail presents one restrained full-bleed target story", () => {
  const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  const stylesheet = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(source, /targeting-cockpit-v2\.webp/);
  assert.doesNotMatch(source, /research-attention-line/);
  assert.match(source, /research-target-data/);
  assert.doesNotMatch(source, /research-gaze-origin/);
  assert.match(stylesheet, /\.project-research \.mockup-research \{[\s\S]*?inset: 0;[\s\S]*?border: 0;[\s\S]*?box-shadow: none;/);
  assert.doesNotMatch(stylesheet, /@keyframes research-attention-line/);
  assert.match(stylesheet, /@keyframes research-target-lock/);
  assert.match(stylesheet, /prefers-reduced-motion/);
});
