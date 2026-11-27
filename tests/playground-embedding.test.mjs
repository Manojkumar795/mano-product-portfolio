import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(new URL("../lib/playground-embed.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { EMBED_GUTTER, EMBED_VIEWPORT_MIN, EMBED_CHANNEL, playgroundCanvases, fitPlaygroundCanvas, validEmbedSize, validEmbedBounds, isPlaygroundId } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

test("unmodified supplied sources and all assets remain identical to the ZIP", () => {
  const fixtures = JSON.parse(readFileSync(new URL("./fixtures/playground-source-hashes.json", import.meta.url)));
  assert.equal(fixtures.length, 71);
  // These sources include intentional changes to autoplay, credits, and checkout.
  const revised = new Set([
    "app/components/mano-playground/MusicPlayer.tsx",
    "app/components/mano-playground/DigitalTicket.tsx",
    "app/components/mano-playground/tonight/Tonight.tsx",
    "app/components/mano-playground/firstpage/FirstPage.tsx",
    "app/components/mano-playground/firstpage/PaperBook.tsx",
    "app/components/mano-playground/playground/shared.tsx",
    "app/components/mano-playground/playground/OneTapCheckout.tsx",
    "app/components/mano-playground/playground/OneTapCheckout.css",
    "app/components/mano-playground/playground/PizzaBuilder.tsx",
    "app/components/mano-playground/playground/PizzaBuilder.css",
    "app/components/mano-playground/playground/playground.css",
  ]);
  for (const fixture of fixtures.filter(item => !revised.has(item.path))) {
    const actual = createHash("sha256").update(readFileSync(new URL(`../${fixture.path}`, import.meta.url))).digest("hex");
    assert.equal(actual, fixture.sha256, fixture.path);
  }
});
test("narrow cards scale full desktop canvases uniformly without changing their internal width", () => {
  for (const spec of Object.values(playgroundCanvases)) {
    const width = spec.width + EMBED_GUTTER * 2, height = spec.initialHeight + EMBED_GUTTER * 2;
    for (const available of [240, 320, 360, 500, 700, 1500]) {
      const fit = fitPlaygroundCanvas(available, width, height);
      assert(fit.scale > 0 && fit.scale <= 1);
      assert(width * fit.scale <= available + .00001);
      assert(Math.abs(fit.height / (width * fit.scale) - height / width) < .00001);
      assert(fit.left >= 0);
      assert(Math.max(EMBED_VIEWPORT_MIN, width) >= 1600);
    }
  }
});
test("small originals are centered at native size rather than stretched to fill a card", () => {
  assert.deepEqual(fitPlaygroundCanvas(700, 368, 640), { scale: 1, height: 640, left: 166 });
  assert.deepEqual(fitPlaygroundCanvas(0, 1100, 700), { scale: 0, height: 0, left: 0 });
});
test("embed messages accept only the selected canvas's valid dimensions", () => {
  const message = { channel: EMBED_CHANNEL, event: "size", component: "firstpage", width: 1548, height: 780 };
  assert(validEmbedSize(message, "firstpage"));
  for (const invalid of [null, {}, { ...message, component: "tonight" }, { ...message, width: 320 }, { ...message, height: NaN }, { ...message, height: Infinity }, { ...message, height: 20000 }, { ...message, channel: "foreign" }]) assert(!validEmbedSize(invalid, "firstpage"));
  assert(!isPlaygroundId("__proto__")); assert(!isPlaygroundId(null)); assert(isPlaygroundId("pizza"));
});

test("visible preview bounds reject blank, invalid and out-of-frame crops", () => {
  assert(validEmbedBounds({ x: 44, y: 24, width: 560, height: 840 }, 648, 888));
  assert(validEmbedBounds({ x: 33, y: 38, width: 1477, height: 627 }, 1548, 703));
  for (const invalid of [null, {}, { x: -1, y: 24, width: 560, height: 840 },
    { x: 44, y: 24, width: 900, height: 840 }, { x: 44, y: 24, width: 560, height: Infinity },
    { x: 44, y: 24, width: 0, height: 840 }, { x: 44, y: NaN, width: 560, height: 840 }]) {
    assert(!validEmbedBounds(invalid, 648, 888));
  }
});
