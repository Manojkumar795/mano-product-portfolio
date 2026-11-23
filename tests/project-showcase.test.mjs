import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const read = name => fs.readFileSync(new URL("../app/" + name, import.meta.url), "utf8");

test("projects and research use ordered groups, original assets and existing case studies", () => {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(read("projectShowcaseData.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, { exports });
  const groups = exports.showcaseGroups;
  assert.deepEqual(Array.from(groups, group => group.title), [
    "Enterprise SaaS", "Mobile Apps", "Design Systems & Research",
  ]);
  const projects = groups.flatMap(group => group.projects);
  assert.deepEqual(Array.from(projects, project => [project.title, project.href]), [
    ["Program+", "/program-plus"], ["Quote+", "/quote-plus"],
    ["Sustain+", "/sustain-plus"],
    ["HOMIQ", "/homiq"], ["SlotGo", "/slotgo"],
    ["Design System to Product", "/modern-product-delivery"],
    ["Helmet Interface Research", "/f35-helmet-ux"],
  ]);
  for (const project of projects) {
    assert.ok(fs.existsSync(new URL("../app" + project.href + "/page.tsx", import.meta.url)), project.href);
    assert.equal(project.screens.length, ["homiq", "slotgo"].includes(project.id) ? 3 : 1);
    if (["homiq", "slotgo"].includes(project.id)) {
      assert.ok(fs.statSync(new URL("../public" + project.backdrop, import.meta.url)).size > 0);
    }
    for (const screen of project.screens) {
      assert.ok(fs.statSync(new URL("../public" + screen.src, import.meta.url)).size > 0, screen.src);
    }
  }
  assert.match(read("ProjectShowcaseGrid.tsx"), /id="projects-title">Projects &amp; Research/);
});
