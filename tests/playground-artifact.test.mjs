import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

test("ships a standalone embed document and independent demo chunks", () => {
  const root = new URL("../dist/client/playground-embeds/", import.meta.url);
  const html = readFileSync(new URL("index.html", root), "utf8");
  assert.match(html, /id="embed-root"/);
  assert.doesNotMatch(html, /<nav\b|<header\b|<footer\b/);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\/playground-embeds\/[^\"]+)"/g)) {
    assert.ok(readFileSync(new URL("../dist/client" + asset, import.meta.url)).length > 0);
  }
  const chunks = readdirSync(new URL("assets/", root));
  for (const name of ["MusicPlayer", "FirstPage", "Tonight", "OneTapCheckout", "DigitalTicket", "PizzaBuilder", "Milestone"]) {
    assert.ok(chunks.some(file => file.startsWith(name + "-") && file.endsWith(".js")), name + " ships independently");
  }
  const hashes = JSON.parse(readFileSync(new URL("fixtures/playground-source-hashes.json", import.meta.url), "utf8"));
  for (const { path } of hashes.filter(entry => entry.path.startsWith("public/"))) {
    assert.ok(readFileSync(new URL("../dist/client/" + path.slice(7), import.meta.url)).length > 0);
  }
});

test("Worker serves embed HTML and assets directly without portfolio layout", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
  for (const path of ["/playground-embeds/?component=firstpage", "/playground-embeds/assets/example.js"]) {
    const request = new Request("http://localhost" + path);
    let forwarded;
    const response = await worker.fetch(request, {
      ASSETS: { fetch: async incoming => { forwarded = incoming; return new Response("isolated embed", { headers: { "x-embed": "static" } }); } },
    }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(forwarded.url, request.url);
    assert.equal(response.headers.get("x-embed"), "static");
    assert.equal(await response.text(), "isolated embed");
  }
});
