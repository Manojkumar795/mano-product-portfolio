import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
const read = path => readFileSync(new URL("../" + path, import.meta.url));
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const context = { waitUntil() {}, passThroughOnException() {} };

test("the four selected earlier screens remain unchanged", () => {
  const selected = JSON.parse(read("docs/homiq/earlier-screen-selection.json"));
  assert.deepEqual(selected.map(x => x.topic), ["rooms", "discovery", "climate", "scenes"]);
  for (const frame of selected) {
    const png = read("public/homiq/earlier/" + frame.file);
    assert.equal(createHash("sha256").update(png).digest("hex"), frame.sha256);
    assert.equal(png.readUInt32BE(16), 390);
    assert.equal(png.readUInt32BE(20), 844);
    assert.match(frame.brandTreatment, /no app wordmark/);
  }
});

test("three editorial comparisons retain their original source screens", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
  const response = await worker.fetch(new Request("http://localhost/homiq", { headers: { accept: "text/html" } }), env, context);
  assert.equal(response.status, 200);
  const html = (await response.text()).split("</main>")[0];
  const ids = [...html.matchAll(/data-comparison="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(ids, ["discovery", "rooms", "climate"]);
  assert.equal((html.match(/class="homiq-experience homiq-experience-/g) || []).length, 3);
  assert.match(html, /Explore all 29 product screens/);
  for (const screen of JSON.parse(read("docs/homiq/screen-inventory.json"))) assert.ok(html.includes('/homiq/screens/' + screen.file), screen.file);
  for (const screen of JSON.parse(read("docs/homiq/earlier-screen-selection.json")).filter(screen => screen.topic !== "scenes")) assert.ok(html.includes('/homiq/earlier/' + screen.file), screen.file);
  const illustrative = html.match(/<details\b[^>]*data-evidence="illustrative"[^>]*>[\s\S]*?<\/details>/g) || [];
  assert.equal(illustrative.length, 1, "numerical examples stay inside their labelled disclosure");
  assert.match(illustrative[0], /These figures are not measured HOMIQ user-testing results/);
  for (const figure of ["15s median to 10s median", "33.3% faster", "15/20 (75%) to 18/20 (90%)", "13/20 (65%) to 16/20 (80%)"]) assert.ok(illustrative[0].includes(figure));
  assert.doesNotMatch(html.replace(illustrative[0], ""), /33\.3% faster|\+15 pp|two 20-attempt rounds/);
  assert.doesNotMatch(html, /href="\/homiq\/research|Explore the annotated research|CoShell|William Le|Visavis/);
  for (const asset of ["733-imgImage.svg", "733-discovery.svg", "733-climate.svg", "733-scenes.svg"]) {
    const svg = read("public/homiq/artifacts/" + asset).toString();
    assert.equal((svg.match(/<image /g) || []).length, 2);
    assert.match(svg, /Before/);
    assert.match(svg, /After/);
    assert.doesNotMatch(svg, /Explore|href="\/homiq\/research/);
  }
  const legacy = await worker.fetch(new Request("http://localhost/homiq/research", { headers: { accept: "text/html" } }), env, context);
  assert.ok([307, 308].includes(legacy.status));
  assert.equal(new URL(legacy.headers.get("location"), "http://localhost").pathname, "/homiq");
});

test("audit charts use reproducible screen counts and a defined evidence rubric", () => {
  const audit = JSON.parse(read("docs/homiq/audit-data.json"));
  const inventory = JSON.parse(read("docs/homiq/screen-inventory.json"));
  assert.equal(audit.screens.length, 29);
  assert.deepEqual(audit.screens.map(s => s.id).sort(), inventory.map(s => s.file.replace(".png", "")).sort());
  for (const s of audit.screens) {
    assert.equal(s.action_count, s.actions.length, s.id);
    assert.equal(s.field_count, s.fields.length, s.id);
  }
  assert.equal(audit.screens.reduce((n, s) => n + s.field_count, 0), 15);
  assert.equal(audit.screens.reduce((n, s) => n + s.action_count, 0), 176);
  for (const f of audit.flows) {
    assert.equal(f.screen_count, f.screens.length);
    assert.equal(f.field_count, audit.screens.filter(s => f.screens.includes(s.id)).reduce((n, s) => n + s.field_count, 0));
  }
  assert.deepEqual(audit.flows.map(f => f.screen_count), [5, 4, 5, 3]);
  assert.deepEqual(Object.values(audit.patterns).map(ids => ids.length), [9, 8, 3, 0]);
  for (const row of audit.heuristic.scores) {
    assert.equal(row.total, Object.values(row.criteria).reduce((a, b) => a + b, 0));
    assert.ok(Object.values(row.criteria).every(v => v >= 0 && v <= 2));
  }
  assert.equal(audit.targets.length, 8);
  assert.match(read("scripts/homiq/build-artifacts.py").toString(), /audit-data\.json/);
});

test("the architecture connects every supplied screen to the entry flow", () => {
  const flow = JSON.parse(read("docs/homiq/information-architecture-flow.json"));
  const inventory = JSON.parse(read("docs/homiq/screen-inventory.json"));
  const ids = new Set(flow.nodes.map(node => node.id));
  assert.equal(ids.size, flow.nodes.length, "screen nodes are unique");
  assert.deepEqual([...ids].sort(), inventory.map(screen => screen.file.replace(".png", "")).sort());
  const reached = new Set(["welcome"]);
  let previous;
  do {
    previous = reached.size;
    for (const edge of flow.edges) {
      assert.ok(ids.has(edge.source) && ids.has(edge.target), "connections use existing screens");
      if (reached.has(edge.source)) reached.add(edge.target);
      if (edge.bidirectional && reached.has(edge.target)) reached.add(edge.source);
    }
  } while (reached.size !== previous);
  assert.deepEqual([...reached].sort(), [...ids].sort(), "no disconnected screen branches");
});
