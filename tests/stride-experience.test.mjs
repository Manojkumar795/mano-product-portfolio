import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as T from 'three';

const read = name => fs.readFileSync(new URL('../app/' + name, import.meta.url), 'utf8');
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020 } }).outputText;
const motion = {};
vm.runInNewContext(compile(read('stride-motion.ts')), { exports: motion, Math });
const angularDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

test('6-second shoe orbit is continuous, monotonic, and seamless at all scene boundaries', () => {
  const cycle = motion.SHOE_CYCLE_SECONDS;
  assert.equal(cycle, 6);
  let previous = motion.shoeCinematicPose(0).angle;
  for (let frame = 1; frame < cycle * 1000; frame++) {
    const pose = motion.shoeCinematicPose(frame / 1000);
    assert.ok(pose.angle > previous, 'no reversals or stuck poses');
    assert.ok(pose.angle - previous < .002);
    previous = pose.angle;
  }
  for (const boundary of [cycle / 4, cycle / 2, cycle * 3 / 4, cycle]) {
    const left = motion.shoeCinematicPose(boundary - .001), exact = motion.shoeCinematicPose(boundary), right = motion.shoeCinematicPose(boundary + .001);
    const before = angularDistance(exact.angle, left.angle) / .001;
    const after = angularDistance(right.angle, exact.angle) / .001;
    assert.ok(Math.abs(before - after) < .003, 'velocity stays continuous');
    for (const property of ['elevation', 'radius', 'key', 'rim']) assert.ok(Math.abs(left[property] - right[property]) < .002);
  }
  assert.deepEqual(motion.shoeCinematicPose(0), motion.shoeCinematicPose(cycle));
});

test('story follows the actual angle, with stable boundaries and accurate manual resume', () => {
  const expected = [0, 1, 2, 3];
  for (let scene = 0; scene < 4; scene++) {
    const angle = motion.shoeCinematicPose((scene + .5) * motion.SHOE_CYCLE_SECONDS / 4).angle;
    assert.equal(motion.shoeStoryForAngle(angle), expected[scene]);
    assert.equal(motion.shoeStoryForAngle(angle + Math.PI * 8), expected[scene]);
  }
  const boundary = motion.SHOE_HERO_ANGLE + Math.PI / 6;
  for (const delta of [-1, .5, -1.5, 1.5]) assert.equal(motion.shoeStoryForAngle(boundary + delta * Math.PI / 180, 0), 0);
  assert.equal(motion.shoeStoryForAngle(boundary + 3 * Math.PI / 180, 0), 1);
  for (let degrees = -720; degrees < 720; degrees += 7) {
    const angle = degrees * Math.PI / 180;
    assert.ok(angularDistance(motion.shoeCinematicPose(motion.shoeTimeForAngle(angle)).angle, angle) < .000001);
  }
});

// Use the original GLB's bounds and node transforms; textures and geometry stay untouched in production.
function originalShoeBounds() {
  const b = fs.readFileSync(new URL('../public/hero-commerce/nike-air-max-plus-sunset.glb', import.meta.url));
  const json = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString());
  const nodes = json.nodes.map(node => {
    const group = new T.Group();
    if (node.matrix) { group.matrix.fromArray(node.matrix); group.matrix.decompose(group.position, group.quaternion, group.scale); }
    if (node.mesh !== undefined) for (const primitive of json.meshes[node.mesh].primitives) {
      const accessor = json.accessors[primitive.attributes.POSITION];
      const min = new T.Vector3().fromArray(accessor.min), max = new T.Vector3().fromArray(accessor.max);
      const size = max.clone().sub(min), center = min.clone().add(max).multiplyScalar(.5);
      const mesh = new T.Mesh(new T.BoxGeometry(size.x, size.y, size.z), new T.MeshStandardMaterial());
      mesh.position.copy(center); group.add(mesh);
    }
    return group;
  });
  json.nodes.forEach((node, i) => node.children?.forEach(child => nodes[i].add(nodes[child])));
  const root = new T.Group(); json.scenes[json.scene || 0].nodes.forEach(node => root.add(nodes[node]));
  return root;
}

async function sceneHarness(width = 320, height = 260, kind = 'shoe') {
  let hooks = [], cursor = 0, effects = [], tree, now = 0, running = true, reducedMotion = false, resetKey = 0;
  const raf = new Map(), stories = [], frames = []; let nextId = 0, loads = 0, rendererCount = 0, controls;
  const walk = (node, pred) => !node || typeof node !== 'object' ? null : pred(node) ? node : node.children?.map(child => walk(child, pred)).find(Boolean);
  const host = { appendChild() {}, getBoundingClientRect: () => ({ width, height }) };
  const activityRef = { current: host };
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; },
    useRef(initial) { const i = cursor++; return hooks[i] ??= { current: initial }; },
    useState(initial) { const i = cursor++; hooks[i] ??= { value: initial }; return [hooks[i].value, next => { hooks[i].value = typeof next === 'function' ? next(hooks[i].value) : next; }]; },
    useEffect(effect, deps) { const i = cursor++; const old = hooks[i]; if (!old || deps.some((d, j) => d !== old.deps[j])) effects.push(() => { old?.cleanup?.(); hooks[i] = { deps, cleanup: effect() }; }); },
  };
  class Renderer {
    shadowMap = {}; domElement = { setAttribute() {}, addEventListener() {}, removeEventListener() {}, remove() {} };
    constructor() { rendererCount++; }
    setPixelRatio() {} setSize() {} dispose() {}
    render(scene, camera) { scene.updateMatrixWorld(); camera.updateMatrixWorld(); frames.push({ angle: controls.getAzimuthalAngle(), camera: camera.clone(), models: scene.children.filter(n => n.isGroup && n.children.length).length }); }
  }
  class Controls extends T.EventDispatcher {
    target = new T.Vector3(); minPolarAngle = 0; maxPolarAngle = Math.PI; camera;
    constructor(camera) { super(); this.camera = camera; controls = this; }
    update() { this.camera.lookAt(this.target); }
    getAzimuthalAngle() { const offset = this.camera.position.clone().sub(this.target); return Math.atan2(offset.x, offset.z); }
    dispose() {}
  }
  class Loader { async loadAsync() { loads++; return { scene: originalShoeBounds() }; } }
  const exports = {};
  vm.runInNewContext('const React = require("react");\n' + compile(read('Showcase3D.tsx')), {
    exports, Math, require: name => name === 'react' ? React : name === 'three' ? { ...T, WebGLRenderer: Renderer, PMREMGenerator: class { fromScene() { return { texture: new T.Texture(), dispose() {} }; } dispose() {} } } : name.includes('GLTFLoader') ? { GLTFLoader: Loader } : name.includes('OrbitControls') ? { OrbitControls: Controls } : name.includes('RoomEnvironment') ? { RoomEnvironment: class extends T.Scene { dispose() {} } } : name.includes('stride-motion') ? motion : { useShowcaseActivity: () => ({ ref: activityRef, running, reducedMotion }) },
    window: { devicePixelRatio: 1 }, performance: { now: () => now },
    ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback(); } disconnect() {} },
    requestAnimationFrame: callback => { raf.set(++nextId, callback); return nextId; }, cancelAnimationFrame: id => raf.delete(id),
  });
  const render = () => { cursor = 0; effects = []; tree = exports.default({ kind, active: running, interactive: true, moving: true, resetKey, onInteract() {}, onShoeStory: story => stories.push(story) }); effects.forEach(fn => fn()); };
  const tick = (ms = 1000 / 60) => { now += ms; const pending = [...raf.values()]; raf.clear(); pending.forEach(fn => fn(now)); };
  render(); render(); await new Promise(resolve => setImmediate(resolve)); render();
  return { tick, render, raf, frames, stories, controls: () => controls, find: pred => walk(tree, pred), counts: () => ({ loads, rendererCount }), reset: () => { resetKey++; render(); }, running: value => { running = value; render(); }, reduced: value => { reducedMotion = value; render(); } };
}

test('real scene controller loops, emits four orientation stories, and retains one loaded model on restarts', async () => {
  const h = await sceneHarness();
  for (let i = 0; i < 1500; i++) { h.tick(); assert.equal(h.raf.size, 1); }
  assert.deepEqual([...new Set(h.stories)], [0, 1, 2, 3]);
  assert.ok(h.stories.length <= Math.ceil(25 / motion.SHOE_CYCLE_SECONDS) * 4 + 1, 'React updates at scene boundaries rather than every frame');
  assert.ok(h.frames.every(frame => frame.models === 1));
  assert.equal(h.find(n => n.props.className === 'model-rotation-controls'), undefined, 'no extra shoe controls');
  for (let i = 0; i < 20; i++) {
    h.running(false); assert.equal(h.raf.size, 0);
    h.reset(); h.running(true); h.tick();
    assert.ok(angularDistance(h.frames.at(-1).angle, motion.SHOE_HERO_ANGLE) < .02);
    assert.equal(h.raf.size, 1);
  }
  assert.deepEqual(h.counts(), { loads: 1, rendererCount: 1 });
  h.reduced(true); h.tick(); assert.equal(h.raf.size, 0);
  const angle = h.frames.at(-1).angle;
  h.tick(10000); assert.equal(h.frames.at(-1).angle, angle);
});

test('drag stops automatic motion, never resumes while held, and returns smoothly from the actual angle', async () => {
  const h = await sceneHarness(); for (let i = 0; i < 90; i++) h.tick();
  const controls = h.controls(); controls.dispatchEvent({ type: 'start' });
  const manualAngle = 4.2, radius = controls.camera.position.distanceTo(controls.target);
  controls.camera.position.set(Math.sin(manualAngle) * radius, controls.target.y + .5, Math.cos(manualAngle) * radius);
  for (let i = 0; i < 400; i++) h.tick();
  assert.ok(angularDistance(h.frames.at(-1).angle, manualAngle) < 1e-8);
  controls.dispatchEvent({ type: 'end' });
  for (let i = 0; i < 120; i++) h.tick();
  assert.ok(angularDistance(h.frames.at(-1).angle, manualAngle) < 1e-8);
  let previous = h.frames.at(-1).angle;
  for (let i = 0; i < 240; i++) { h.tick(); const angle = h.frames.at(-1).angle; assert.ok(angularDistance(angle, previous) < .035, 'no resume snap'); previous = angle; assert.equal(h.raf.size, 1); }
  assert.ok(angularDistance(previous, manualAngle) > .2);
  assert.deepEqual(h.counts(), { loads: 1, rendererCount: 1 });
});

test('complete original shoe bounding box stays inside desktop, tablet, and mobile stage cameras', async () => {
  const original = originalShoeBounds(), originalBox = new T.Box3().setFromObject(original);
  const size = originalBox.getSize(new T.Vector3()), scale = 4.4 / Math.max(size.x, size.y, size.z);
  const corners = [];
  for (const x of [-size.x * scale / 2, size.x * scale / 2]) for (const y of [0, size.y * scale]) for (const z of [-size.z * scale / 2, size.z * scale / 2]) corners.push(new T.Vector3(x, y, z));
  for (const [width, height] of [[360, 280], [260, 240], [130, 220]]) {
    const h = await sceneHarness(width, height);
    for (let i = 0; i < 750; i++) h.tick();
    assert.ok(h.frames.length > 700, 'framing is checked on rendered frames throughout a complete turn');
    for (const { camera } of h.frames) for (const point of corners) {
      const projected = point.clone().project(camera);
      assert.ok(Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1, `${width}x${height}: ${projected.toArray()}`);
    }
    h.running(false);
  }
});

test('STRIDE stories remain singular and shopping selections survive automatic and manual slide returns', () => {
  let hooks = [], cursor = 0, effects = [], tree, active = 1, restartToken = 0;
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; },
    useRef(initial) { const i = cursor++; return hooks[i] ??= { current: initial }; },
    useState(initial) { const i = cursor++; hooks[i] ??= { value: initial }; return [hooks[i].value, next => { hooks[i].value = typeof next === 'function' ? next(hooks[i].value) : next; }]; },
    useEffect(effect, deps) { const i = cursor++; const old = hooks[i]; if (!old || deps.some((d, j) => d !== old.deps[j])) effects.push(() => { old?.cleanup?.(); hooks[i] = { deps, cleanup: effect() }; }); },
  };
  const exports = {}, Preview = () => null;
  vm.runInNewContext('const React = require("react");\n' + compile(read('HeroSystemShowcase.tsx')) + '\nexports.Commerce = CommerceSystem;', {
    exports, require: name => name === 'react' ? React : name.includes('stride-motion') ? motion : { default: Preview },
  });
  const all = (node, pred) => !node || typeof node !== 'object' ? [] : [...(pred(node) ? [node] : []), ...(node.children || []).flatMap(child => all(child, pred))];
  const find = pred => all(tree, pred)[0];
  const render = () => { cursor = 0; effects = []; tree = exports.Commerce({ active, restartToken }); effects.forEach(fn => fn()); };
  render(); render();
  find(n => n.props['aria-label'] === 'Size 10').props.onClick(); render();
  find(n => n.props.className === 'hero-commerce-add').props.onClick(); render();
  assert.equal(find(n => n.props.className === 'hero-commerce-bag').props['aria-label'], 'Demo bag, 1 item');
  const preview = () => find(n => n.type === Preview);
  const firstReset = preview().props.resetKey;
  for (let story = 0; story < 4; story++) {
    preview().props.onStoryChange(story); render();
    assert.equal(all(tree, n => n.props.className === 'commerce-story-copy').length, 1);
    assert.equal(find(n => n.type === 'h4').children[0], motion.SHOE_STORIES[story].title);
    assert.equal(find(n => n.props['aria-label'] === 'Size 10').props['aria-pressed'], true);
  }
  active = 0; render(); active = 1; render(); render();
  assert.equal(preview().props.resetKey, firstReset + 1);
  assert.equal(tree.props['data-story'], 0);
  restartToken++; render(); render();
  assert.equal(preview().props.resetKey, firstReset + 2);
  assert.equal(find(n => n.props['aria-label'] === 'Size 10').props['aria-pressed'], true);
  assert.equal(find(n => n.props.className === 'hero-commerce-bag').props['aria-label'], 'Demo bag, 1 item');
  assert.equal(all(tree, n => n.type === 'button').length, 7, 'only the existing swatch, five sizes and Add to bag are clickable');
  assert.equal(find(n => n.props.className === 'hero-commerce-ai'), undefined);
  assert.equal(find(n => n.props.className === 'hero-commerce-rotation-tools'), undefined);
});
