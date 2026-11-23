import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as T from 'three';

// Execute the actual component/rope solver with real Three.js geometry and cameras.
// Only the GPU renderer and browser surfaces are substituted; this is not pixel QA.
async function harness(width = 360, height = 560, reduced = false) {
  let cursor = 0, hooks = [], effects = [], now = 0, rafId = 0, renderCount = 0, scene, camera, disposed = 0;
  const raf = new Map(), observers = [], windowListeners = new Map(), documentListeners = new Map();
  const gradient = { addColorStop() {} };
  const context = new Proxy({
    measureText: text => ({ width: text.length * 38, actualBoundingBoxAscent: 65, actualBoundingBoxDescent: 8 }),
    createLinearGradient: () => gradient, createRadialGradient: () => gradient,
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    getImageData: (_x, _y, w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
  }, { get: (obj, key) => key in obj ? obj[key] : () => {}, set: (obj, key, value) => (obj[key] = value, true) });
  const makeCanvas = () => ({ style: {}, listeners: new Map(), getContext: () => context,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }),
    addEventListener(name, fn) { this.listeners.set(name, fn); }, removeEventListener(name) { this.listeners.delete(name); },
    setAttribute() {}, setPointerCapture() {}, releasePointerCapture() {},
  });
  const host = { clientWidth: width, clientHeight: height, canvases: [], appendChild(c) { this.canvases.push(c); c.parentNode = this; }, removeChild(c) { this.canvases = this.canvases.filter(v => v !== c); } };
  const react = {
    useRef(value) { const i = cursor++; return hooks[i] ??= { current: value }; },
    useState(value) { const i = cursor++; hooks[i] ??= { value }; return [hooks[i].value, next => { hooks[i].value = typeof next === 'function' ? next(hooks[i].value) : next; }]; },
    useMemo(fn, deps) { const i = cursor++; if (!hooks[i] || deps.some((d, n) => d !== hooks[i].deps[n])) hooks[i] = { deps, value: fn() }; return hooks[i].value; },
    useEffect(fn, deps) { const i = cursor++; const old = hooks[i]; if (!old || deps.some((d, n) => d !== old.deps[n])) effects.push(() => { old?.cleanup?.(); hooks[i] = { deps, cleanup: fn() }; }); },
    startTransition: fn => fn(),
  };
  class Renderer {
    domElement = makeCanvas(); shadowMap = {};
    setPixelRatio() {} setClearColor() {} setSize() {}
    render(s, c) { scene = s; camera = c; s.updateMatrixWorld(true); c.updateMatrixWorld(true); renderCount++; }
    dispose() { disposed++; }
  }
  const document = { hidden: false, createElement: () => makeCanvas(),
    fonts: { load: async () => [] },
    addEventListener: (name, fn) => documentListeners.set(name, fn), removeEventListener: name => documentListeners.delete(name),
  };
  const output = {};
  const code = ts.transpileModule(fs.readFileSync(new URL('../app/vendor/KernLanyardPass.js', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, {
    exports: output, Math, Uint8ClampedArray, document,
    require: name => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx: (type, props) => ({ type, props }) } : name === 'three' ? { ...T, WebGLRenderer: Renderer, PMREMGenerator: class { fromEquirectangular() { return { texture: new T.Texture() }; } dispose() {} } } : { useReducedMotion: () => reduced },
    window: { devicePixelRatio: 1, addEventListener: (name, fn) => windowListeners.set(name, fn), removeEventListener: name => windowListeners.delete(name) },
    performance: { now: () => now },
    requestAnimationFrame: fn => { raf.set(++rafId, fn); return rafId; }, cancelAnimationFrame: id => raf.delete(id),
    IntersectionObserver: class { constructor(fn) { this.fn = fn; observers.push(this); } observe() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
  });
  const props = { content: { attendeeName: 'Manoj Kumar N', ticketType: 'Senior Product Designer', eventName: 'Product design', barcodeValue: '' }, look: { foil: 'edges', finish: 'matte' } };
  function render() { cursor = 0; effects = []; const root = output.default(props); root.props.ref.current = host; effects.forEach(fn => fn()); return root; }
  render(); await new Promise(resolve => setImmediate(resolve)); render();
  const pass = () => scene.children.find(n => n.isGroup);
  const card = () => pass().children.find(n => n.geometry?.type === 'BoxGeometry');
  const tick = (count = 1) => { for (let i = 0; i < count; i++) { now += 1000 / 60; const pending = [...raf.values()]; raf.clear(); pending.forEach(fn => fn(now)); } };
  const event = (x, y, pointerId = 1) => ({ button: 0, pointerId, clientX: x, clientY: y, preventDefault() {}, stopPropagation() {} });
  const hit = () => { const p = card().getWorldPosition(new T.Vector3()).project(camera); return [(p.x + 1) * width / 2, (1 - p.y) * height / 2]; };
  return { raf, host, pass, card, camera: () => camera, tick, hit, event,
    enter: value => observers[0].fn([{ isIntersecting: value }]),
    hidden: value => { document.hidden = value; documentListeners.get('visibilitychange')(); },
    canvas: () => host.canvases[0], windowListeners,
    renderCount: () => renderCount,
    reduced: value => { reduced = value; render(); },
    dispose() { hooks.forEach(h => h.cleanup?.()); assert.equal(disposed, 1); assert.equal(windowListeners.size, 0); assert.equal(documentListeners.size, 0); },
  };
}

test('scroll starts one real drop, rope settles, and repeat visibility does not create loops or another canvas', async () => {
  const h = await harness();
  assert.equal(h.raf.size, 0);
  h.enter(true); assert.equal(h.raf.size, 1);
  h.tick(); const first = h.card().getWorldPosition(new T.Vector3()).y;
  const strap = h.pass().children.find(n => n.geometry?.type === 'BufferGeometry');
  const vertices = strap.geometry.getAttribute('position');
  const end = new T.Vector3();
  // Ten vertices around the last ring; the eleventh repeats its first vertex.
  for (let i = vertices.count - 11; i < vertices.count - 1; i++) end.add(new T.Vector3().fromBufferAttribute(vertices, i));
  end.divideScalar(10).applyMatrix4(strap.matrixWorld);
  const attached = h.card().localToWorld(new T.Vector3(0, 1.08, 0));
  assert.ok(end.distanceTo(attached) < .0001, 'rope stays attached throughout the initial drop');
  h.tick(180); const settled = h.card().getWorldPosition(new T.Vector3()).y;
  assert.ok(first - settled > 5, 'pass descends from above');
  assert.ok(Math.abs(settled + 1.38) < .2, 'gravity extends the anchored rope');
  assert.equal(h.pass().children.filter(n => n.geometry?.type === 'BoxGeometry').length, 1);
  for (let i = 0; i < 15; i++) {
    h.enter(false); assert.equal(h.raf.size, 0);
    h.enter(true); h.enter(true); assert.equal(h.raf.size, 1);
    h.tick(5); assert.equal(h.pass().position.y, 0, 'entry plays once');
    assert.equal(h.host.canvases.length, 1);
  }
  h.hidden(true); assert.equal(h.raf.size, 0);
  const count = h.renderCount(); h.tick(100); assert.equal(h.renderCount(), count);
  h.hidden(false); assert.equal(h.raf.size, 1);
  const [x, y] = h.hit();
  h.canvas().listeners.get('pointerdown')(h.event(x, y));
  h.enter(false); assert.equal(h.canvas().style.cursor, 'grab', 'leaving while held releases the card');
  h.enter(true); h.tick(5); assert.equal(h.raf.size, 1);
  h.dispose(); assert.equal(h.raf.size, 0); assert.equal(h.host.canvases.length, 0);
});

test('dragging, direction reversal and release preserve one loop, while vertical scrolling remains available', async () => {
  const h = await harness(); h.enter(true); h.tick(180);
  for (let i = 0; i < 8; i++) {
    const [x, y] = h.hit();
    h.canvas().listeners.get('pointerdown')(h.event(x, y, i + 1));
    assert.equal(h.canvas().style.cursor, 'grabbing');
    for (const shift of [50, -50, 30, -30]) {
      h.windowListeners.get('pointermove')(h.event(x + shift, y - 15, i + 1)); h.tick(2);
      assert.equal(h.raf.size, 1);
    }
    h.windowListeners.get('pointerup')(h.event(x, y, i + 1));
    assert.equal(h.canvas().style.touchAction, 'pan-y');
    h.tick(120);
    assert.ok(Number.isFinite(h.card().position.y));
  }
  const before = h.card().rotation.y;
  h.canvas().listeners.get('keydown')({ key: 'ArrowRight', preventDefault() {} }); h.tick(10);
  assert.notEqual(h.card().rotation.y, before);
  h.dispose();
});

test('reduced motion stays still, and resting card geometry fits desktop, tablet and narrow mobile stages', async () => {
  for (const [w, height] of [[420, 560], [280, 560], [284, 460], [720, 520]]) {
    const h = await harness(w, height, true); h.enter(true); assert.equal(h.raf.size, 0);
    const box = h.card().geometry.parameters;
    h.card().updateWorldMatrix(true, false);
    for (const x of [-box.width / 2, box.width / 2]) for (const y of [-box.height / 2, box.height / 2]) for (const z of [-box.depth / 2, box.depth / 2]) {
      const p = new T.Vector3(x, y, z).applyMatrix4(h.card().matrixWorld).project(h.camera());
      assert.ok(Math.abs(p.x) < .98 && Math.abs(p.y) < .98, `whole card fits ${w}×${height}`);
    }
    const before = h.renderCount(); h.tick(120); assert.equal(h.renderCount(), before);
    h.dispose();
  }
});
