import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = name => fs.readFileSync(new URL('../app/' + name, import.meta.url), 'utf8');
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020 } }).outputText;
function journeyModule() {
  const exports = {};
  vm.runInNewContext(compile(read('altitude-journey.ts')), { exports, Intl, Date });
  return exports;
}
test('demo schedule uses local dates, date-line arrival and synchronized remaining time', () => {
  const { flightTiming } = journeyModule();
  const departure = flightTiming(0), middle = flightTiming(56), arrival = flightTiming(100);
  assert.equal(departure.departureTime, '11:40');
  assert.equal(departure.departureZone, 'PDT');
  assert.equal(departure.arrivalTime, '15:40');
  assert.equal(departure.arrivalZone, 'JST');
  assert.equal(Date.parse(departure.arrivalISO) - Date.parse(departure.departureISO), 12 * 3600000);
  assert.equal(departure.remaining, '12h 00m');
  assert.equal(middle.remaining, '5h 17m');
  assert.equal(arrival.remaining, '0h 00m');
  assert.equal(flightTiming(-5).remaining, departure.remaining);
  assert.equal(flightTiming(105).remaining, arrival.remaining);
});
test('globe opens with a visible turn and eases into continuous slow rotation', () => {
  const exports = {};
  vm.runInNewContext(compile(read('altitude-motion.ts')), { exports, Math });
  const angle = exports.globeRotationAngle;
  const speed = seconds => (angle(seconds + .001) - angle(seconds)) * 180 / Math.PI / .001;
  assert.ok(speed(0) > 7.9);
  assert.ok(speed(2) < speed(0));
  assert.ok(speed(6) < speed(2));
  assert.ok(speed(20) > .69 && speed(20) < .71);
  assert.ok(angle(4) * 180 / Math.PI > 16, 'rotation is visible during the slide’s first viewing interval');
  assert.ok(angle(40) > angle(30), 'slow motion keeps turning rather than sticking or reversing');
});
test('route endpoints remain geographically accurate', () => {
  const { journeyPoint, geographicPoint, AIRPORTS } = journeyModule();
  for (const [progress, airport] of [[0, AIRPORTS.lax], [1, AIRPORTS.hnd]]) {
    const expected = geographicPoint(airport.latitude, airport.longitude, 1.675);
    const actual = journeyPoint(progress);
    actual.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 1e-9));
  }
});
async function viewerHarness() {
  let hooks = [], cursor = 0, effects = [], now = 0, tree;
  let running = true, reducedMotion = false, resetKey = 0;
  const raf = new Map(), draws = [], paints = []; let id = 0, imageLoads = 0;
  const ctx = { clearRect() { paints.push([]); }, drawImage(...args) { draws.push(args.slice(1)); paints.at(-1).push({ source: args.slice(1), alpha: this.globalAlpha }); }, globalAlpha: 1 };
  const surface = { getContext: () => ctx, parentElement: { style: { setProperty() {} } } };
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; },
    memo: component => component,
    useRef(initial) { const index = cursor++; return hooks[index] ??= { current: initial }; },
    useState(initial) { const index = cursor++; if (!hooks[index]) hooks[index] = { value: initial }; return [hooks[index].value, value => { hooks[index].value = value; }]; },
    useEffect(effect, deps) { const index = cursor++; const old = hooks[index]; if (!old || deps.some((d, i) => d !== old.deps[i])) { effects.push(() => { old?.cleanup?.(); hooks[index] = { deps, cleanup: effect() }; }); } },
  };
  const exports = {};
  class Image { naturalWidth = 7200; naturalHeight = 3744; decoded = false; async decode() { this.decoded = true; } set src(value) { imageLoads++; this.url = value; this.onload?.(); } }
  const source = 'const React = require("react");\n' + compile(read('AltitudeAircraftViewer.tsx'));
  vm.runInNewContext(source, { exports, require: name => name === 'react' ? React : { useShowcaseActivity: () => ({ ref: { current: null }, running, reducedMotion }) }, Image, performance: { now: () => now }, requestAnimationFrame: callback => { raf.set(++id, callback); return id; }, cancelAnimationFrame: id => raf.delete(id) });
  const walk = (node, pred) => !node || typeof node !== 'object' ? null : pred(node) ? node : node.children?.map(child => walk(child, pred)).find(Boolean);
  function render() { cursor = 0; effects = []; tree = exports.default({ active: running, resetKey }); const element = walk(tree, n => n.type === 'canvas'); element.props.ref.current = surface; effects.forEach(fn => fn()); return tree; }
  function tick(ms) { now += ms; const pending = [...raf.values()]; raf.clear(); pending.forEach(fn => fn(now)); }
  render();
  assert.equal(walk(tree, n => n.props.className === "altitude-exterior-view").props.tabIndex, -1);
  await new Promise(resolve => setImmediate(resolve)); render();
  assert.equal(walk(tree, n => n.props.className === "altitude-exterior-view").props.tabIndex, 0);
  return { render, tick, draws, paints, raf, imageLoads: () => imageLoads, reset: () => { resetKey++; render(); render(); }, find: pred => walk(tree, pred), setRunning: value => { running = value; render(); }, setReduced: value => { reducedMotion = value; render(); }, now: () => now };
}
test('exterior rotates actual sprite angles, dragging pauses auto, momentum and idle resume work', async () => {
  const v = await viewerHarness();
  const lastSource = () => v.draws.at(-1)?.slice(0, 2);
  v.tick(16); const initial = lastSource();
  for (let i = 0; i < 60; i++) v.tick(50);
  assert.notDeepEqual(lastSource(), initial);
  const exterior = v.find(n => n.props.className === 'altitude-exterior-view');
  let captured = false;
  const target = { setPointerCapture() { captured = true; }, hasPointerCapture() { return captured; }, releasePointerCapture() { captured = false; exterior.props.onLostPointerCapture(); } };
  exterior.props.onPointerDown({ button: 0, pointerId: 7, clientX: 0, timeStamp: v.now(), stopPropagation() {}, currentTarget: target });
  const held = lastSource();
  for (let i = 0; i < 20; i++) v.tick(50);
  assert.deepEqual(lastSource(), held);
  exterior.props.onPointerMove({ pointerId: 7, clientX: 350, timeStamp: v.now() + 50 });
  assert.notDeepEqual(lastSource(), held);
  exterior.props.onPointerUp({ pointerId: 7, currentTarget: target });
  const released = lastSource();
  for (let i = 0; i < 150; i++) v.tick(50);
  assert.notDeepEqual(lastSource(), released);
  v.reset();
  assert.deepEqual(lastSource(), initial);
  // A complete turn returns to the same real view, rather than flipping a flat image.
  exterior.props.onKeyDown({ key: 'ArrowRight', preventDefault() {}, stopPropagation() {} });
  assert.notDeepEqual(lastSource(), initial);
  for (let i = 0; i < 35; i++) exterior.props.onKeyDown({ key: 'ArrowRight', preventDefault() {}, stopPropagation() {} });
  assert.deepEqual(lastSource(), initial);
  v.setRunning(false); assert.equal(v.raf.size, 0);
});
test('reduced motion retains manual rotation in the simplified aircraft preview', async () => {
  const v = await viewerHarness(); v.setReduced(true); assert.equal(v.raf.size, 0);
  const before = v.draws.at(-1).slice(0, 2);
  v.find(n => n.props.className === 'altitude-exterior-view').props.onKeyDown({ key: 'ArrowRight', preventDefault() {}, stopPropagation() {} });
  assert.notDeepEqual(v.draws.at(-1).slice(0, 2), before);
  assert.equal(v.find(n => n.type === 'button'), undefined, 'preview has no extra controls');
  assert.equal(v.find(n => n.props.className === 'altitude-view-angle'), undefined);
  v.reset();
  assert.equal(v.find(n => n.props.className === 'altitude-aircraft-viewer').props['data-mode'], 'exterior');
  assert.equal(v.raf.size, 0, 'shared reset respects reduced motion');
});

test('continuous turns and repeated direction reversals render one opaque aircraft with one animation loop', async () => {
  const v = await viewerHarness();
  const exterior = v.find(n => n.props.className === 'altitude-exterior-view');
  let captured = false;
  const target = { setPointerCapture() { captured = true; }, hasPointerCapture() { return captured; }, releasePointerCapture() { captured = false; exterior.props.onLostPointerCapture(); } };
  const sourceIndex = () => { const [x, y] = v.draws.at(-1); return y / 156 * 30 + x / 240; };
  const angles = new Set();
  for (let i = 0; i < 2400; i++) { v.tick(1000 / 60); angles.add(sourceIndex()); assert.equal(v.raf.size, 1); }
  assert.equal(angles.size, 720, 'continuous autoplay visits every available angle');
  for (let repeat = 0; repeat < 30; repeat++) {
    let x = 0;
    exterior.props.onPointerDown({ button: 0, pointerId: repeat, clientX: x, timeStamp: v.now(), stopPropagation() {}, currentTarget: target });
    const held = sourceIndex();
    for (let i = 0; i < 100; i++) v.tick(50);
    assert.equal(sourceIndex(), held, 'auto rotation never restarts while dragging');
    for (const direction of [1, -1, 1, -1]) {
      for (let i = 0; i < 70; i++) {
        x += direction * 8;
        exterior.props.onPointerMove({ pointerId: repeat, clientX: x, timeStamp: v.now() + 16 });
        v.tick(16);
        assert.ok(sourceIndex() >= 0 && sourceIndex() < 720);
        assert.equal(v.raf.size, 1, 'pointer events do not create a second loop');
      }
    }
    exterior.props.onPointerUp({ pointerId: repeat, currentTarget: target });
    v.tick(16); assert.equal(v.raf.size, 1);
  }
  for (const paint of v.paints) {
    assert.equal(paint.length, 1, 'every cleared surface gets exactly one aircraft');
    assert.equal(paint[0].alpha, 1, 'no transparent neighbouring aircraft is composited');
    assert.deepEqual(paint[0].source.slice(2), [240, 156, 0, 0, 240, 156], 'consistent scale and framing');
  }
  v.setRunning(false); assert.equal(v.raf.size, 0);
  v.setRunning(true); assert.equal(v.raf.size, 1);
  v.setReduced(true); assert.equal(v.raf.size, 0);
});
test('flight status, elapsed and remaining times agree at every journey checkpoint', () => {
  const { flightTiming, journeyPhase } = journeyModule();
  for (let progress = 0; progress <= 100; progress++) {
    const timing = flightTiming(progress);
    const minutes = text => { const [h, m] = text.match(/\d+/g).map(Number); return h * 60 + m; };
    assert.equal(minutes(timing.elapsed) + minutes(timing.remaining), 720);
  }
  assert.equal(journeyPhase(0).title, 'Departing Los Angeles');
  assert.equal(journeyPhase(50).title, 'Crossing the Pacific');
  assert.equal(journeyPhase(90).title, 'Approaching Tokyo');
  assert.equal(journeyPhase(100).title, 'Arrived at Tokyo Haneda');
  assert.equal(flightTiming(100).remaining, '0h 00m');
});

function flightHarness(component = "FlightControl.tsx") {
  let hooks = [], cursor = 0, effects = [], tree, restartToken = 0;
  const intervals = new Map(); let timer = 0;
  const journey = journeyModule();
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; },
    useRef(initial) { const index = cursor++; return hooks[index] ??= { current: initial }; },
    useState(initial) { const index = cursor++; if (!hooks[index]) hooks[index] = { value: initial }; return [hooks[index].value, next => { hooks[index].value = typeof next === 'function' ? next(hooks[index].value) : next; }]; },
    useEffect(effect, deps) { const index = cursor++; const old = hooks[index]; if (!old || deps.some((d, i) => d !== old.deps[i])) effects.push(() => { old?.cleanup?.(); hooks[index] = { deps, cleanup: effect() }; }); },
  };
  const exports = {};
  vm.runInNewContext('const React = require("react");\n' + compile(read(component)), {
    exports, require: name => name === 'react' ? React : name.includes('altitude-journey') ? journey : name.includes('useShowcaseActivity') ? { useShowcaseActivity: () => ({ ref: {}, running: true, reducedMotion: false }) } : { default: () => null },
    window: { setInterval: fn => { intervals.set(++timer, fn); return timer; }, clearInterval: id => intervals.delete(id) },
  });
  const walk = (node, pred) => !node || typeof node !== 'object' ? null : pred(node) ? node : node.children?.map(child => walk(child, pred)).find(Boolean);
  const render = () => { cursor = 0; effects = []; tree = exports.default({ active: true, restartToken, onInteract() {} }); effects.forEach(fn => fn()); };
  render(); render();
  return { render, restart: () => { restartToken++; render(); render(); }, get tree() { return tree; }, find: pred => walk(tree, pred), intervals, advance: () => { [...intervals.values()].forEach(fn => fn()); render(); } };
}
test('ALTITUDE has no reset button and section navigation preserves journey progress', () => {
  const f = flightHarness();
  assert.ok(!f.find(n => n.type === 'header'));
  assert.ok(!f.find(n => n.type === 'footer'));
  assert.ok(!f.find(n => n.props.className === 'altitude-compact-journey'));
  assert.ok(!f.find(n => n.props['aria-label'] === 'Traveller profile'));
  const stage = () => f.find(n => Object.hasOwn(n.props, 'progress'));
  const start = stage().props.progress; f.advance(); assert.ok(stage().props.progress > start);
  for (const destination of ['Aircraft', 'Arrival', 'Journey']) {
    const nav = f.find(n => n.props.className === 'altitude-panel-nav');
    const before = stage().props.progress;
    nav.children.find(n => n.children.includes(destination)).props.onClick(); f.render();
    assert.equal(f.tree.props['data-view'], destination.toLowerCase());
    assert.equal(stage().props.progress, before, 'navigation preserves the journey');
  }
  assert.equal(f.find(n => n.props['aria-label'] === 'Reset ALTITUDE experience'), undefined);
  f.advance(); assert.ok(stage().props.progress > start, 'simulation continues after section navigation');
});

test('carousel tabs hold the selected slide for seven seconds before advancing', () => {
  let hooks = [], cursor = 0, effects = [], tree, now = 0, nextFrame = 0;
  const frames = new Map();
  const counter = { style: { transform: '' } };
  const React = {
    createElement(type, props, ...children) { return { type, props: props || {}, children: children.flat() }; },
    useRef(initial) { const index = cursor++; return hooks[index] ??= { current: initial }; },
    useState(initial) { const index = cursor++; if (!hooks[index]) hooks[index] = { value: initial }; return [hooks[index].value, next => { hooks[index].value = typeof next === 'function' ? next(hooks[index].value) : next; }]; },
    useEffect(effect, deps) { const index = cursor++; const old = hooks[index]; if (!old || deps.some((d, i) => d !== old.deps[i])) effects.push(() => { old?.cleanup?.(); hooks[index] = { deps, cleanup: effect() }; }); },
  };
  const exports = {};
  vm.runInNewContext('const React = require("react");\n' + compile(read('HeroSystemShowcase.tsx')), {
    exports,
    require: name => name === 'react' ? React : name.includes('useShowcaseActivity') ? { useShowcaseActivity: () => ({ ref: {}, running: true, reducedMotion: false }) } : { default: () => null },
    requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  const walk = (node, pred) => !node || typeof node !== 'object' ? null : pred(node) ? node : node.children?.map(child => walk(child, pred)).find(Boolean);
  const render = () => {
    cursor = 0; effects = []; tree = exports.default();
    walk(tree, n => n.type === 'i' && n.props.ref).props.ref.current = counter;
    effects.forEach(fn => fn());
  };
  const tick = () => { now += 100; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); };
  const slides = () => walk(tree, n => n.props.className === 'showcase-viewport').children;
  const tokens = () => slides().map(n => n.props.restartToken);
  const click = index => { walk(tree, n => n.props['aria-controls'] === `showcase-slide-${index}`).props.onClick(); render(); };
  render();
  for (const index of [0, 1, 2, 3, 3, 2, 2, 1, 1, 0, 0]) {
    const before = tokens(), mounted = slides();
    tick(); tick(); assert.notEqual(counter.style.transform, 'scaleX(0)');
    click(index);
    assert.equal(counter.style.transform, 'scaleX(0)', 'click grants the slide a fresh viewing interval');
    tokens().forEach((token, slide) => slide === index && token !== undefined ? assert.equal(token, before[slide] + 1) : assert.equal(token, before[slide]));
    slides().forEach((node, slide) => { assert.equal(node.type, mounted[slide].type); assert.equal(node.props.key, mounted[slide].props.key, 'React identity stays stable; loaded scenes are retained'); });
    assert.equal(frames.size, 1, 'each click starts one countdown');
    assert.equal(walk(tree, n => n.props['aria-controls'] === `showcase-slide-${index}`).props['aria-current'], 'true');
  }
  walk(tree, n => n.props['aria-label'] === 'Pause portfolio slideshow').props.onClick(); render();
  assert.equal(frames.size, 0);
  click(2); assert.equal(frames.size, 0, 'restart preserves the user’s paused slideshow');
  for (let i = 0; i < 75; i++) tick();
  assert.equal(frames.size, 0, 'manual Pause persists after inactivity');
  walk(tree, n => n.props['aria-label'] === 'Play portfolio slideshow').props.onClick(); render();
  assert.equal(frames.size, 1);
  for (const index of [1, 2]) {
    click(index);
    for (let i = 0; i < 70; i++) tick();
    render();
    assert.equal(walk(tree, n => n.props['aria-controls'] === `showcase-slide-${index}`).props['aria-current'], 'true', 'chosen slide remains visible before seven seconds');
    tick(); render();
    assert.equal(walk(tree, n => n.props['aria-controls'] === `showcase-slide-${index + 1}`).props['aria-current'], 'true', 'autoplay advances at seven seconds');
    assert.equal(frames.size, 1);
  }
});

test('animation restarts reuse the decoded aircraft sprite instead of loading it again', async () => {
  const v = await viewerHarness();
  for (let i = 0; i < 20; i++) {
    v.tick(50); v.reset();
    assert.deepEqual(v.draws.at(-1).slice(0, 2), [0, 0]);
    v.setRunning(false); v.setRunning(true);
    assert.equal(v.raf.size, 1);
  }
  assert.equal(v.imageLoads(), 1, 'one initial sprite request across repeated restarts');
});
test('normal aircraft autoplay displays at least 45 distinct views each second at 60 Hz', async () => {
  const v = await viewerHarness();
  const start = v.draws.length;
  for (let i = 0; i < 61; i++) v.tick(1000 / 60);
  const updates = v.draws.length - start;
  assert.ok(updates >= 45 && updates <= 60, `${updates} distinct angles per second`);
  assert.equal(v.raf.size, 1);
  assert.equal(v.imageLoads(), 1);
});
test('topic restart resumes aircraft motion during the first second without reloading', async () => {
  const v = await viewerHarness();
  v.reset();
  const start = v.draws.length;
  for (let i = 0; i < 60; i++) v.tick(1000 / 60);
  assert.ok(v.draws.length - start >= 20, 'opening view starts rotating after its brief presentation hold');
  assert.equal(v.raf.size, 1);
  assert.equal(v.imageLoads(), 1);
});

test('ALTITUDE restarts its existing scene and keeps the preview mounted across sections', () => {
  const f = flightHarness();
  const stage = () => f.find(n => Object.hasOwn(n.props, 'progress'));
  const viewer = () => f.find(n => Object.hasOwn(n.props, 'hidden') && Object.hasOwn(n.props, 'resetKey'));
  const initialType = viewer().type;
  f.advance();
  f.find(n => n.props.className === 'altitude-panel-nav').children.find(n => n.children.includes('Aircraft')).props.onClick(); f.render();
  assert.equal(viewer().props.hidden, true);
  assert.equal(viewer().type, initialType);
  const before = stage().props.resetKey;
  f.restart();
  assert.equal(f.tree.props['data-view'], 'journey');
  assert.equal(stage().props.progress, 56);
  assert.equal(stage().props.resetKey, before + 1);
  assert.equal(viewer().props.hidden, false);
  assert.equal(viewer().props.resetKey, stage().props.resetKey);
  assert.equal(viewer().type, initialType);
});

test('APEX keeps its loaded car mounted during Race and restores its initial animation state', () => {
  const f = flightHarness('ApexRaceCompanion.tsx');
  const car = () => f.find(n => n.props.kind === 'car');
  const initialType = car().type, before = car().props.resetKey;
  f.find(n => n.props['aria-label'] === 'APEX app sections').children.find(n => n.children.includes('Race')).props.onClick(); f.render();
  assert.equal(car().type, initialType);
  assert.equal(car().props.active, false);
  f.restart();
  assert.equal(car().props.active, true);
  assert.equal(car().props.focus, 'full');
  assert.equal(car().props.resetKey, before + 1);
  assert.equal(f.tree.props['data-driver'], 'rossi');
  assert.equal(car().type, initialType);
});
