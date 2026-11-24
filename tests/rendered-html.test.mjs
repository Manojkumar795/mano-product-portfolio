import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders the homepage without development preview metadata", async () => {
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
  assert.doesNotMatch(html, developmentPreviewMeta);
  const showcaseCards = [...html.matchAll(/data-project-showcase="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(showcaseCards, ["program", "quote", "sustain", "delivery", "research", "slotgo", "profit", "homiq"]);
  assert.equal([...html.matchAll(/src="\/project-showcase\//g)].length, 16);
  for (const route of ["program-plus", "profit-plus", "quote-plus", "sustain-plus", "modern-product-delivery", "f35-helmet-ux", "slotgo", "homiq"]) {
    assert.ok(html.includes(`href="/${route}"`));
  }
  assert.match(html, /Aviation Interface Design/);
  assert.match(html, /AVIATION HMI/);
  assert.match(html, /<h2[^>]*id="projects-title"[^>]*>Work &amp; Research<\/h2>/);
  assert.match(html, /B2C · ECOMMERCE · AMAZON A\+ CONTENT/);
  assert.match(html, /Better product pages\./);
  for (const label of ["Customer Problem", "Design Strategy", "Business Objective", "Outcome"]) {
    assert.ok(html.includes(label));
  }
  assert.match(html, /Customers were discovering products but lacked clear information/);
  assert.match(html, /I transformed product information into a guided buying journey using Amazon Premium A\+/);
  assert.match(html, /My goal was to build customer trust, improve purchase confidence/);
  assert.match(html, /The result was a cohesive Premium A\+ experience/);
  assert.doesNotMatch(html, /Pass by BuiltByKern|decorate complexity/);
  assert.ok(html.indexOf('id="about"') < html.indexOf('id="approach"'));
  assert.doesNotMatch(html, /Campaign pages and product stories created across beauty/);
  assert.doesNotMatch(html, /More than a portfolio\. A working view of how I think\.|View Behance/);
  assert.doesNotMatch(html, /Faster exploration\. Same/);
  assert.match(html, /Illustrative aircraft tracking with contextual direction and distance/);
  assert.match(html, /Aircraft ahead/);
  assert.match(html, /preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(html, /experience-modern|8\+ years inside real|Kyyba Tech|BigCommerce|RKK Enterprise/);
  assert.doesNotMatch(html, /slotgo-card-artwork/);
  assert.match(html, /\/slotgo\/customer-home\.png/);
  assert.match(html, /\/slotgo\/venue-home\.png/);
  assert.match(html, /\/slotgo\/customer-discover\.png/);
  assert.doesNotMatch(html, /slotgo-card-product|slotgo-card-screen/);
});

test("SlotGo presents the original sports product with an evidence-aware AI workflow", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("slotgo-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(new Request("http://localhost/slotgo", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /A clearer path/);
  for (const destination of ["overview", "analysis", "prototype", "customer-app", "design-system"]) {
    assert.ok(html.includes('href="#' + destination + '"'));
    assert.ok(html.includes('id="' + destination + '"'));
  }
  assert.equal([...html.matchAll(/<section\b/g)].length, 10, "topics stay consolidated");
  for (const term of ["Figma Make", "Codex", "live scoreboard", "payment status", "memberships"]) assert.ok(html.toLowerCase().includes(term.toLowerCase()), term);
  assert.match(html, /It does not create a reservation or process payment/);
  assert.match(html, /reconstructed from the existing screens, not original workshop sketches/);
  assert.doesNotMatch(html, /parking|Client product|68%|76%|4\.8 min|58%|Arjun Mehta|Rohit Kumar|256-bit encryption|—/);
  for (const [side, count] of [["customer", 6], ["venue", 3]]) {
    const section = html.match(new RegExp('<section[^>]*data-app="' + side + '"[^>]*>([\\s\\S]*?)<\\/section>'))?.[1];
    assert.ok(section, side + " product section renders");
    const images = [...section.matchAll(/<img\b[^>]*\bsrc="(\/slotgo\/[^\"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(images).size, count);
    for (const src of images) assert.ok(src.startsWith('/slotgo/' + side + '-'));
  }
  assert.match(html, /Explore all 30 original screens/);
  assert.match(html, /<dialog[^>]*aria-labelledby="screen-dialog-title"/);
  const collection = html.slice(html.indexOf('id="screen-collection"'));
  const split = collection.indexOf('data-showcase-app="venue"');
  for (const [side, section, count] of [["customer", collection.slice(0, split), 17], ["venue", collection.slice(split), 13]]) {
    const images = [...section.matchAll(/<img\b[^>]*\bsrc="(\/slotgo\/[^\"]+)"/g)].map(match => match[1]);
    assert.equal(images.length, count);
    assert.equal(new Set(images).size, count);
    for (const src of images) {
      assert.ok(src.startsWith('/slotgo/' + side + '-'));
      assert.ok(readFileSync(new URL('../public' + src, import.meta.url)).byteLength > 0);
    }
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

test("ALTITUDE renders a clean layout without a reset button", async () => {
  const { default: worker } = await import(new URL('../dist/server/index.js', import.meta.url));
  const response = await worker.fetch(new Request('http://localhost/', { headers: { accept: 'text/html' } }), { ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /class="altitude-footer"|EXPLORE THE JOURNEY|id="altitude-progress"|Demo itinerary/);
  assert.match(html, /class="altitude-panel-nav" aria-label="Journey sections"/);
  assert.doesNotMatch(html, /class="altitude-compact-journey"|class="altitude-header"|class="altitude-view-reset"|class="altitude-profile"|class="altitude-aircraft-segments"|class="altitude-view-angle"/);
  assert.doesNotMatch(html, /altitude-globe-reset|Reset ALTITUDE experience/);
  assert.match(html, /class="altitude-airport-name">Los Angeles/);
  assert.match(html, /8 Oct 2026/);
  assert.match(html, /class="altitude-airport-name">Tokyo Haneda/);
  assert.match(html, /9 Oct · \+1 day/);
  assert.match(html, /11:40/);
  assert.match(html, /15:40/);
  assert.match(html, /Crossing the Pacific/);
});
