import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

test("all 30 original SlotGo product exports remain byte-identical", () => {
  const inventory = JSON.parse(readFileSync(new URL("../docs/slotgo/screen-inventory.json", import.meta.url)));
  assert.equal(inventory.length, 30);
  assert.equal(inventory.filter(item => item.file.startsWith("customer-")).length, 17);
  assert.equal(inventory.filter(item => item.file.startsWith("venue-")).length, 13);
  for (const item of inventory) {
    const bytes = readFileSync(new URL("../public/slotgo/" + item.file, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256, item.file);
    assert.equal(bytes.readUInt32BE(16), item.width, item.file);
    assert.equal(bytes.readUInt32BE(20), item.height, item.file);
  }
});
