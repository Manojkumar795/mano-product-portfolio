import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

// Preserve source artwork and Git history; omit only superseded static outputs.
const superseded = [
  "fidelity/sketch-device.png", "fidelity/sketch-room.png",
  "fidelity/sketch-scene.png", "fidelity/sketch-control.png",
  "fidelity/mid-entry.svg", "fidelity/mid-structure.svg",
  "artifacts/657-imgImage.svg", "artifacts/657-imgImage1.svg",
  "artifacts/720-imgImage.svg",
];

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : /\.(tsx?|jsx?|css)$/.test(file) ? [file] : [];
  });
}

const source = sourceFiles("app").map(file => readFileSync(file, "utf8")).join("\n");
let bytes = 0;
for (const asset of superseded) {
  if (source.includes(path.basename(asset))) throw new Error(`Asset is still referenced: ${asset}`);
  const output = path.join("dist/client/homiq", asset);
  if (existsSync(output)) {
    bytes += statSync(output).size;
    rmSync(output);
  }
}
console.log(`Omitted ${(bytes / 1e6).toFixed(1)} MB of superseded HOMIQ build assets; source assets are preserved.`);
