import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app/f35-helmet-ux/F35StoryV2.tsx", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("../app/f35-helmet-ux/F35StoryV2.module.css", import.meta.url), "utf8");
const viewer = readFileSync(new URL("../app/f35-helmet-ux/F35ModelViewer.tsx", import.meta.url), "utf8");

async function renderRoute(path) {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  return response.text();
}

const html = await renderRoute("/f35-helmet-ux");
const section = (id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0];

test("all five case-study sections remain linked and rendered", () => {
  for (const id of ["perception", "targeting", "context", "calibration", "cognitive-load"]) {
    assert.ok(section(id), `${id} is present`);
    assert.ok(html.includes(`href="#${id}"`), `${id} has a navigation link`);
  }
  assert.equal((html.match(/<h1>/g) ?? []).length, 1);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /<title>F-35 Helmet UX — Manoj Kumar N<\/title>/);
});

test("the approved calibration implementation is unchanged", () => {
  const calibration = source.slice(source.indexOf("function CalibrationDiagram()"), source.indexOf("const hierarchyInformation")).trim();
  assert.equal(createHash("sha256").update(calibration).digest("hex"), "6364923835d106797c783fd69eeb42f4f15ffb88e0d564827d6ddab2d1165390");
});

test("the opening photograph and headline remain the visual anchor", () => {
  assert.match(section("perception"), /hero-front-pilot-aircraft.webp/);
  assert.match(section("perception"), /When the interface<br\/>becomes part of<br\/><span>perception\.<\/span>/);
  assert.match(section("perception"), /data-visor-hud/);
  assert.match(section("perception"), /SPD/);
  assert.match(section("perception"), /ALT/);
  assert.doesNotMatch(section("perception"), /NAV CUE|UX MEANING/);
});

test("target detail travels with the aircraft and motion can be paused", () => {
  const targeting = section("targeting");
  assert.match(targeting, /tracking-lead-aircraft.png/);
  assert.match(targeting, /tracking-target-aircraft.png/);
  assert.match(targeting, /Aircraft ahead/);
  assert.match(targeting, /16° right · 18\.4 NM/);
  assert.match(targeting, /Flight reference/);
  assert.match(targeting, /data-motion="running"/);
  assert.match(targeting, /aria-pressed="false"/);
  assert.match(targeting, /Pause aircraft motion/);
  assert.doesNotMatch(targeting, /PRIORITY|VERIFIED|HUD RESPONSE|SEE TARGET/);
});

test("the hierarchy comparison retains the same six values on both sides", () => {
  const cognitive = section("cognitive-load");
  const equal = cognitive.slice(cognitive.indexOf('data-hierarchy="equal"'), cognitive.indexOf('data-hierarchy="prioritized"'));
  const prioritized = cognitive.slice(cognitive.indexOf('data-hierarchy="prioritized"'));
  for (const value of ["Aircraft ahead", "16° right", "18.4 NM", "468 kt", "304°", "28,640 ft"]) {
    assert.ok(equal.includes(value), `equal emphasis retains ${value}`);
    assert.ok(prioritized.includes(value), `clear priority retains ${value}`);
  }
  assert.match(cognitive, /Equal emphasis/);
  assert.match(cognitive, /Clear priority/);
  assert.doesNotMatch(cognitive, /<button|<kbd|ATTENTION MODEL|DECISION READY|LIVE STUDY|data-f35-v2-scrub/);
});

test("the closing message has one heading and an honest study label", () => {
  const conclusion = html.match(/<footer[\s\S]*?<\/footer>/)?.[0];
  assert.ok(conclusion);
  assert.equal((conclusion.match(/<h2>/g) ?? []).length, 1);
  assert.match(conclusion, /Independent design study · Illustrative interfaces/);
  assert.match(conclusion, /Return to selected work/);
});

test("restored flight motion has pause and reduced-motion controls", () => {
  assert.doesNotMatch(stylesheet, /text-shadow|box-shadow|focusRings|signalChip|contextScan/);
  assert.match(stylesheet, /@keyframes aircraftFloat/);
  assert.match(stylesheet, /\.afterburner/);
  assert.match(stylesheet, /animation-play-state: paused/);
  assert.match(stylesheet, /data-in-view/);
  assert.match(stylesheet, /@keyframes attentionLocate/);
  assert.match(stylesheet, /@keyframes referenceFusion/);
  assert.match(stylesheet, /prefers-reduced-motion/);
  assert.match(viewer, /controls\.autoRotate = false/);
  assert.match(viewer, /ArrowLeft/);
  assert.match(viewer, /tabIndex=\{0\}/);
  assert.match(viewer, /creativecommons.org\/licenses\/by-nc-sa\/4.0/);
});

test("the comparison uses matching visual contexts, not unequal oversized text panels", () => {
  const cognitive = section("cognitive-load");
  assert.equal((cognitive.match(/tracking-sky.webp/g) ?? []).length, 2);
  assert.equal((cognitive.match(/tracking-target-aircraft.png/g) ?? []).length, 2);
  assert.doesNotMatch(stylesheet, /comparisonHalf \+ \.comparisonHalf \{ padding-left/);
  assert.match(stylesheet, /--content-width: 1440px/);
});

test("every referenced CSS-module class exists, including responsive layouts", () => {
  const references = new Set([...source.matchAll(/styles\.([a-zA-Z0-9_]+)/g)].map((match) => match[1]));
  for (const name of references) assert.ok(stylesheet.includes(`.${name}`), `${name} has a style`);
  assert.match(stylesheet, /@media \(max-width: 680px\)/);
  assert.match(stylesheet, /\.hierarchyComparison \{ grid-template-columns: 1fr; \}/);
  assert.match(stylesheet, /focus-visible/);
  assert.match(source, /model\.inert = section\.dataset\.phase !== "restored"/);
});

test("the portfolio homepage still renders", async () => {
  const home = await renderRoute("/");
  assert.match(home, /<title>Manoj Kumar N — Senior Product Designer<\/title>/);
  assert.match(home, /href="\/f35-helmet-ux"/);
});
