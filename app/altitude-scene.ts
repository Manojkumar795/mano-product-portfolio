import * as T from "three";
import { globeRotationAngle } from "./altitude-motion";
import { createAltitudeCloudMaterial, createAltitudeEarthMaterial } from "./altitude-earth";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  AIRPORTS,
  geographicPoint,
  journeyPoint,
  type AircraftPart,
} from "./altitude-journey";

export type AltitudeSceneState = {
  running: boolean;
  reducedMotion: boolean;
  progress: number;
  ambientMotion: boolean;
  inspecting: boolean;
  part: AircraftPart;
  resetKey: number;
  onInteract: () => void;
  onExplore: () => void;
};
export type AltitudeSceneApi = {
  update: () => void;
  key: (key: string) => void;
  dispose: () => void;
};
const RADIUS = 1.65;
const point = (p: number) => new T.Vector3(...journeyPoint(p, RADIUS));
const defaultPosition = new T.Vector3(...geographicPoint(24, 180, 6));
const partPoints = {
  full: new T.Vector3(0, 0, 0),
  engine: new T.Vector3(0.33, -0.22, 0.37),
  wing: new T.Vector3(0.72, -0.09, -0.2),
  cabin: new T.Vector3(0.08, -0.08, 0.82),
};

/** A single, lazy, demand-rendered WebGL context. All geographic objects share world coordinates. */
export function createAltitudeScene(
  host: HTMLDivElement,
  labelHost: HTMLDivElement,
  state: () => AltitudeSceneState,
  status: (next: "ready" | "fallback") => void,
): AltitudeSceneApi {
  const renderer = new T.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0xf8f7f4, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  host.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-2, 2, 1.8, -1.2, 0.01, 40);
  camera.position.copy(defaultPosition);
  camera.lookAt(0, 0, 0);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.rotateSpeed = 0.52;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = Math.PI - 0.15;
  const environment = new RoomEnvironment();
  const pmrem = new T.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environment, 0.03);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.7;
  environment.dispose();
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xf4fbff, 0x708185, 2.3));
  const keyLight = new T.DirectionalLight(0xfff9ed, 3.2);
  // One fixed sun lights the upper-right globe rim and the aircraft together.
  keyLight.position.copy(new T.Vector3(4, 5, -2).applyQuaternion(camera.quaternion));
  scene.add(keyLight);
  const fillLight = new T.DirectionalLight(0xa1e4ef, 1.1);
  fillLight.position.set(3, 2, -4);
  scene.add(fillLight);
  const world = new T.Group();
  scene.add(world);
  const geometry = new T.SphereGeometry(RADIUS, 128, 96);
  const earthMaterial = createAltitudeEarthMaterial();
  const earth = new T.Mesh(geometry, earthMaterial);
  world.add(earth);
  const cloudMaterial = createAltitudeCloudMaterial();
  const clouds = new T.Mesh(new T.SphereGeometry(RADIUS * 1.004, 96, 64), cloudMaterial);
  world.add(clouds);
  const atmosphereMaterial = new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: T.BackSide,
    uniforms: { opacity: { value: 0.5 }, sunDirection: { value: new T.Vector3() } },
    vertexShader: `varying vec3 n; varying vec3 v; void main(){ vec4 p = modelViewMatrix * vec4(position,1.0); n = normalize(normalMatrix * normal); v = normalize(-p.xyz); gl_Position = projectionMatrix * p; }`,
    fragmentShader: `varying vec3 n; varying vec3 v; uniform float opacity; uniform vec3 sunDirection;
      void main(){
        vec3 normal=normalize(n);
        float rim=pow(clamp(1.0-abs(dot(normal,normalize(v))),0.0,1.0),5.0);
        float sunward=pow(max(dot(normal,normalize(sunDirection)),0.0),3.0);
        vec3 scatter=mix(vec3(.16,.54,1.),vec3(1.,.76,.42),sunward*.32);
        gl_FragColor=vec4(scatter,rim*opacity);
      }`,
  });
  world.add(
    new T.Mesh(
      new T.SphereGeometry(RADIUS * 1.012, 96, 64),
      atmosphereMaterial,
    ),
  );
  // Tubes retain a crisp, visible width on high-DPI displays. UVs keep dashes fixed geographically.
  const routeCurve = new T.CatmullRomCurve3(Array.from({ length: 129 }, (_, i) => point(i / 128)));
  const routeGeometry = new T.TubeGeometry(routeCurve, 160, .0052, 6, false);
  const routeMaterial = new T.ShaderMaterial({
    transparent: true, toneMapped: false, depthWrite: false, depthTest: true,
    uniforms: { progress: { value: .56 }, opacity: { value: 1 }, teal: { value: new T.Color('#48eee0') }, aircraftPosition: { value: new T.Vector3() } },
    vertexShader: `varying float routeT;varying vec3 routeWorld;void main(){routeT=uv.x;routeWorld=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying float routeT;varying vec3 routeWorld;uniform float progress;uniform float opacity;uniform vec3 teal;uniform vec3 aircraftPosition;
    void main(){if(distance(routeWorld,aircraftPosition)<.43)discard;
    bool done=routeT<=progress;if(!done && fract(routeT*47.0)>.59)discard;
    gl_FragColor=vec4(done?teal:vec3(.96,1.,.98),opacity);
    #include <colorspace_fragment>
    }`,
  });
  const route = new T.Mesh(routeGeometry, routeMaterial);
  world.add(route);
  const pinMaterial = new T.MeshBasicMaterial({
    color: 0x009e9e,
    transparent: true,
  });
  const pinGeometry = new T.SphereGeometry(0.023, 12, 12);
  Object.values(AIRPORTS).forEach((airport) => {
    const pin = new T.Mesh(pinGeometry, pinMaterial);
    pin.position.set(
      ...geographicPoint(airport.latitude, airport.longitude, RADIUS + 0.023),
    );
    world.add(pin);
  });
  const plane = new T.Group();
  scene.add(plane);
  const shadow = new T.Mesh(
    new T.CircleGeometry(1, 48),
    new T.MeshBasicMaterial({
      color: 0x7d9190,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(1.18, 0.48, 1);
  shadow.position.set(0, -0.28, 0);
  scene.add(shadow);
  let hostLeft = 0, hostTop = 0;
  const orbitAxis = new T.Vector3(0, 1, 0);
  let width = 1,
    height = 1,
    disposed = false,
    healthy = true,
    ready = false,
    frame = 0,
    transition = false,
    dragging = false;
  let lastTime = 0,
    idleFrames = 0,
    model: T.Group | null = null;
  let mode = false,
    focus: AircraftPart = "full",
    reset = state().resetKey,
    blend = 0,
    lastProgress = -1,
    visualProgress = state().progress,
    ambientTime = 0;
  let targetPosition = defaultPosition.clone(),
    targetLook = new T.Vector3(),
    targetZoom = 1;
  let savedPosition = defaultPosition.clone(),
    savedTarget = new T.Vector3();
  const previewPosition = new T.Vector3(4, 1.3, 3);
  const raycaster = new T.Raycaster();
  const routePosition = new T.Vector3(),
    routeQuaternion = new T.Quaternion(),
    inspectionQuaternion = new T.Quaternion();
  const planePosition = new T.Vector3(),
    planeRotation = new T.Quaternion();
  const reusable = new T.Vector3();
  const textures = new Set<T.Texture>();
  const title = labelHost.parentElement?.querySelector<HTMLElement>('.altitude-journey-title');
  // A world-space halo sits behind Earth's lit rim and is occluded by the globe.
  // This is a small light texture, not a backdrop image or a flat Earth substitute.
  const lightCanvas = document.createElement("canvas");
  lightCanvas.width = lightCanvas.height = 128;
  const lightContext = lightCanvas.getContext("2d");
  let sunHalo: T.Sprite | null = null;
  if (lightContext) {
    const lightGradient = lightContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    lightGradient.addColorStop(0, "rgba(255,253,231,1)");
    lightGradient.addColorStop(.10, "rgba(255,248,209,.96)");
    lightGradient.addColorStop(.23, "rgba(255,203,119,.68)");
    lightGradient.addColorStop(.48, "rgba(247,164,70,.20)");
    lightGradient.addColorStop(1, "rgba(247,164,70,0)");
    lightContext.fillStyle = lightGradient;
    lightContext.fillRect(0, 0, 128, 128);
    const lightTexture = new T.CanvasTexture(lightCanvas);
    lightTexture.colorSpace = T.SRGBColorSpace;
    textures.add(lightTexture);
    sunHalo = new T.Sprite(new T.SpriteMaterial({
      map: lightTexture, transparent: true, depthWrite: false, depthTest: true,
      blending: T.AdditiveBlending, toneMapped: false,
    }));
    // Keep the bright core under the limb throughout the small ambient orbit.
    sunHalo.position.copy(new T.Vector3(1.0, 1.06, -.85).applyQuaternion(camera.quaternion));
    sunHalo.scale.set(1.3, 1.3, 1);
    sunHalo.renderOrder = -2;
    world.add(sunHalo);
  }

  function resize() {
    hostLeft = host.offsetLeft;
    hostTop = host.offsetTop;
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    // On short mobile scenes keep both geographic endpoints visible below the heading.
    const compact = host.offsetTop > 0;
    // Fit the entire geographic world inside the left display, with room for its title.
    const spanY = Math.max(compact ? 3.85 : 4.2, 3.65 * height / width);
    const spanX = (spanY * width) / height;
    camera.left = -spanX * 0.5;
    camera.right = spanX * 0.5;
    camera.top = spanY * (compact ? 0.5 : 0.58);
    camera.bottom = -spanY * (compact ? 0.5 : 0.42);
    camera.updateProjectionMatrix();
    wake();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  function updateRoute(progress = state().progress) {
    const t = progress / 100;
    routeMaterial.uniforms.progress.value = t;
    routePosition.copy(point(t));
    routeMaterial.uniforms.aircraftPosition.value.copy(routePosition);
    const forward = point(Math.min(1, t + 0.001))
      .sub(point(Math.max(0, t - 0.001)))
      .normalize();
    const radial = routePosition.clone().normalize();
    // The model floats above its geographic path, never through the route tube.
    routePosition.addScaledVector(radial, .10);
    const up = radial.clone();
    const right = new T.Vector3().crossVectors(up, forward).normalize();
    up.crossVectors(forward, right).normalize();
    routeQuaternion.setFromRotationMatrix(
      new T.Matrix4().makeBasis(right, up, forward),
    );
    routeQuaternion.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), .40));
    lastProgress = progress;
  }
  function setDestination() {
    const current = state();
    if (current.inspecting !== mode) {
      if (current.inspecting) {
        savedPosition.copy(camera.position);
        savedTarget.copy(controls.target);
      }
      mode = current.inspecting;
      focus = current.part;
      targetPosition.copy(mode ? previewPosition : savedPosition);
      targetLook.copy(mode ? partPoints[focus] : savedTarget);
      targetZoom = mode ? (focus === "full" ? 1.13 : 2.55) : 1;
      transition = true;
    }
    if (focus !== current.part || reset !== current.resetKey) {
      if (reset !== current.resetKey) ambientTime = 0;
      focus = current.part;
      reset = current.resetKey;
      targetLook.copy(mode ? partPoints[focus] : new T.Vector3());
      targetPosition.copy(mode ? previewPosition : defaultPosition);
      if (mode && focus !== "full")
        targetPosition.copy(partPoints[focus]).add(new T.Vector3(3, 1.2, 4));
      targetZoom = mode ? (focus === "full" ? 1.13 : 2.55) : 1;
      transition = true;
    }
  }
  function projected(
    label: HTMLElement | null,
    position: T.Vector3,
    visible: boolean,
    offset = 0,
  ) {
    if (!label) return;
    reusable.copy(position).project(camera);
    const onScreen =
      visible &&
      reusable.z > -1 &&
      reusable.z < 1 &&
      Math.abs(reusable.x) < 0.98 &&
      Math.abs(reusable.y) < 0.95;
    label.style.visibility = onScreen && ready ? "visible" : "hidden";
    if (onScreen) {
      label.style.left = `${(reusable.x * 0.5 + 0.5) * width + hostLeft}px`;
      label.style.top = `${(-reusable.y * 0.5 + 0.5) * height + offset + hostTop}px`;
    }
  }
  function updateLabels() {
    const front = camera.position.clone().sub(controls.target).normalize();
    for (const [id, airport] of Object.entries(AIRPORTS)) {
      const pos = new T.Vector3(
        ...geographicPoint(airport.latitude, airport.longitude, RADIUS + 0.025),
      );
      projected(
        labelHost.querySelector(`[data-altitude-anchor="${id}"]`),
        pos,
        !mode && pos.clone().normalize().dot(front) > 0.1,
        0,
      );
    }
    // Keep pins on their coordinates; only airport text moves.
    // All measurements are in the scene's local CSS pixels, including scaled heroes.
    if (!mode && ready) arrangeLabels();
    const oceanPosition = new T.Vector3(...geographicPoint(11, -176, RADIUS + .01));
    projected(labelHost.querySelector('[data-altitude-anchor="ocean"]'), oceanPosition,
      !mode && oceanPosition.clone().normalize().dot(front) > .4);
    for (const key of ["engine", "wing", "cabin"] as const)
      projected(
        labelHost.querySelector(`[data-altitude-anchor="${key}"]`),
        partPoints[key],
        mode && blend > 0.95,
      );
  }
  type LabelBox = { x: number; y: number; w: number; h: number };
  function arrangeLabels() {
    // React recreates these elements when returning from aircraft inspection.
    const airportLabels = Object.keys(AIRPORTS).map((id) =>
      labelHost.querySelector<HTMLElement>(`[data-altitude-anchor="${id}"]`));
    const blocked: LabelBox[] = [];
    const intersects = (a: LabelBox, b: LabelBox) =>
      a.x < b.x + b.w + 7 && a.x + a.w + 7 > b.x &&
      a.y < b.y + b.h + 7 && a.y + a.h + 7 > b.y;
    const fits = (box: LabelBox) => box.x >= hostLeft + 6 &&
      box.x + box.w <= hostLeft + width - 6 &&
      box.y >= hostTop + 6 && box.y + box.h <= hostTop + height - 38;
    if (title) blocked.push({ x: title.offsetLeft, y: title.offsetTop, w: title.offsetWidth, h: title.offsetHeight });
    for (const label of airportLabels) {
      const text = label?.querySelector<HTMLElement>('span');
      if (!label || !text || label.style.visibility !== 'visible') continue;
      const x = parseFloat(label.style.left), y = parseFloat(label.style.top);
      const w = text.offsetWidth, h = text.offsetHeight;
      const candidates = [[-w / 2, 10], [-w / 2, -h - 12], [14, -h / 2], [-w - 14, -h / 2]];
      const candidate = candidates.find(([dx, dy]) => {
        const box = { x: x + dx, y: y + dy, w, h };
        return fits(box) && !blocked.some((b) => intersects(box, b));
      });
      // Hide only the text when the globe is dragged into a crowded corner.
      text.style.visibility = candidate ? 'inherit' : 'hidden';
      if (candidate) {
        text.style.left = `${candidate[0]}px`;
        text.style.top = `${candidate[1] + 5}px`;
        blocked.push({ x: x + candidate[0], y: y + candidate[1], w, h });
      }
    }
  }
  function draw(time: number) {
    frame = 0;
    if (disposed || !healthy || !state().running) return;
    const current = state();
    const dt = Math.min(
      0.04,
      Math.max(0.001, (time - (lastTime || time - 16)) / 1000),
    );
    lastTime = time;
    const ease = current.reducedMotion ? 1 : 1 - Math.exp(-dt * 9);
    setDestination();
    const ambient = ready && current.ambientMotion && !current.reducedMotion && !mode && !dragging && !transition;
    visualProgress = current.progress;
    if (Math.abs(visualProgress - current.progress) < .002) visualProgress = current.progress;
    if (lastProgress !== visualProgress) updateRoute(visualProgress);
    blend += ((mode ? 1 : 0) - blend) * ease;
    if (Math.abs((mode ? 1 : 0) - blend) < 0.002) blend = mode ? 1 : 0;
    if (transition) {
      camera.position.lerp(targetPosition, ease);
      controls.target.lerp(targetLook, ease);
      camera.zoom += (targetZoom - camera.zoom) * ease;
      camera.updateProjectionMatrix();
      if (
        camera.position.distanceTo(targetPosition) < 0.003 &&
        controls.target.distanceTo(targetLook) < 0.003 &&
        Math.abs(camera.zoom - targetZoom) < 0.003
      )
        transition = false;
    }
    planePosition.copy(routePosition).lerp(new T.Vector3(), blend);
    plane.position.copy(planePosition);
    planeRotation.copy(routeQuaternion).slerp(inspectionQuaternion, blend);
    plane.quaternion.copy(planeRotation);
    plane.scale.setScalar(T.MathUtils.lerp(0.36, 1, blend));
    world.visible = blend < 0.998;
    earthMaterial.uniforms.opacity.value = 1 - blend;
    cloudMaterial.uniforms.opacity.value = 1 - blend;
    atmosphereMaterial.uniforms.opacity.value = 0.52 * (1 - blend);
    routeMaterial.uniforms.opacity.value = 1 - blend;
    pinMaterial.opacity = 1 - blend;
    if (sunHalo) sunHalo.material.opacity = 1 - blend;
    (shadow.material as T.MeshBasicMaterial).opacity = 0.065 * blend;
    const changed = controls.update();
    if (ambient) {
      const previousAngle = globeRotationAngle(ambientTime);
      ambientTime += dt;
      const nextAngle = globeRotationAngle(ambientTime);
      camera.position.applyAxisAngle(orbitAxis, nextAngle - previousAngle);
      camera.lookAt(controls.target);
    }
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    earthMaterial.uniforms.sunDirection.value.copy(keyLight.position)
      .transformDirection(camera.matrixWorldInverse);
    cloudMaterial.uniforms.sunDirection.value.copy(earthMaterial.uniforms.sunDirection.value);
    atmosphereMaterial.uniforms.sunDirection.value.copy(earthMaterial.uniforms.sunDirection.value);
    renderer.render(scene, camera);
    updateLabels();
    const moving =
      ambient ||
      Math.abs(visualProgress - current.progress) > .002 ||
      transition ||
      Math.abs((mode ? 1 : 0) - blend) > 0.001 ||
      dragging ||
      changed;
    if (moving) idleFrames = 0;
    else idleFrames++;
    if (moving || idleFrames < 3) wake();
  }
  function wake() {
    if (!disposed && healthy && state().running && !frame)
      frame = requestAnimationFrame(draw);
  }
  function onStart() {
    if (!state().running) return;
    dragging = true;
    transition = false;
    state().onInteract();
    wake();
  }
  function onEnd() {
    dragging = false;
    wake();
  }
  controls.addEventListener("start", onStart);
  controls.addEventListener("end", onEnd);
  // Changes outside our render loop (pointer drags) need a frame; draw schedules damping itself.
  const onChange = () => {
    idleFrames = 0;
    wake();
  };
  controls.addEventListener("change", onChange);
  let downX = 0,
    downY = 0;
  const down = (event: PointerEvent) => {
    downX = event.clientX;
    downY = event.clientY;
    event.stopPropagation();
  };
  const up = (event: PointerEvent) => {
    // OrbitControls listens for pointerup on the document to finish the drag.
    // Let the release bubble even when this handler checks for an aircraft click.
    if (
      mode ||
      !model ||
      Math.hypot(event.clientX - downX, event.clientY - downY) > 5
    )
      return;
    const bounds = host.getBoundingClientRect();
    raycaster.setFromCamera(
      new T.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
      ),
      camera,
    );
    const hit = raycaster.intersectObjects([plane, earth], true)[0];
    if (hit && hit.object !== earth) {
      state().onInteract();
      state().onExplore();
    }
  };
  renderer.domElement.addEventListener("pointerdown", down);
  renderer.domElement.addEventListener("pointerup", up);
  function fail() {
    if (disposed) return;
    healthy = false;
    cancelAnimationFrame(frame);
    frame = 0;
    status("fallback");
    renderer.domElement.style.visibility = "hidden";
    labelHost
      .querySelectorAll<HTMLElement>("[data-altitude-anchor]")
      .forEach((label) => (label.style.visibility = "hidden"));
  }
  const lost = (event: Event) => {
    event.preventDefault();
    fail();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);

  const textureLoader = new T.TextureLoader();
  const loadTexture = async (url: string, colour = false) => {
    const texture = await textureLoader.loadAsync(url);
    textures.add(texture);
    if (disposed) {
      texture.dispose();
      throw new Error("Disposed");
    }
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (colour) texture.colorSpace = T.SRGBColorSpace;
    return texture;
  };
  Promise.all([
    loadTexture("/altitude/earth-summer.webp", true),
    loadTexture("/altitude/earth-relief.webp"),
    loadTexture("/altitude/earth-bathymetry.webp"),
    loadTexture("/altitude/earth-night.webp"),
    loadTexture("/altitude/earth-clouds.webp"),
    new GLTFLoader().loadAsync("/altitude/boeing-777-300er.glb").then((gltf) => {
      if (disposed) {
        disposeObject(gltf.scene);
        throw new Error("Disposed");
      }
      model = gltf.scene;
      // Boeing 777-300ER exterior, with the prepared ALTITUDE materials.
      const bounds = new T.Box3().setFromObject(model);
      const size = bounds.getSize(new T.Vector3());
      const center = bounds.getCenter(new T.Vector3());
      const scale = 2.5 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.copy(center).multiplyScalar(-scale);
      plane.add(model);
    }),
  ])
    .then(([colour, relief, bathymetry, night, cloud]) => {
      if (disposed) return;
      earthMaterial.uniforms.dayMap.value = colour;
      earthMaterial.uniforms.reliefMap.value = relief;
      earthMaterial.uniforms.bathymetryMap.value = bathymetry;
      earthMaterial.uniforms.nightMap.value = night;
      cloudMaterial.uniforms.cloudMap.value = cloud;
      earthMaterial.needsUpdate = true;
      ready = true;
      status("ready");
      resize();
      wake();
    })
    .catch(() => {
      if (!disposed) fail();
    });
  resize();
  updateRoute();
  wake();

  return {
    update() {
      controls.enabled = state().running;
      if (!state().running) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      } else {
        idleFrames = 0;
        wake();
      }
    },
    key(key) {
      transition = false;
      if (key === "Home") {
        targetPosition.copy(mode ? previewPosition : defaultPosition);
        targetLook.copy(mode ? partPoints[focus] : new T.Vector3());
        targetZoom = mode && focus !== "full" ? 2.55 : mode ? 1.13 : 1;
        transition = true;
      } else {
        const spherical = new T.Spherical().setFromVector3(
          camera.position.clone().sub(controls.target),
        );
        if (key === "ArrowLeft") spherical.theta -= 0.14;
        if (key === "ArrowRight") spherical.theta += 0.14;
        if (key === "ArrowUp") spherical.phi -= 0.1;
        if (key === "ArrowDown") spherical.phi += 0.1;
        spherical.phi = T.MathUtils.clamp(spherical.phi, 0.15, Math.PI - 0.15);
        camera.position
          .copy(controls.target)
          .add(new T.Vector3().setFromSpherical(spherical));
      }
      wake();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeObject(scene);
      textures.forEach((texture) => texture.dispose());
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
function disposeObject(root: T.Object3D) {
  const materials = new Set<T.Material>();
  const geometries = new Set<T.BufferGeometry>();
  root.traverse((object) => {
    if (!(object as T.Mesh).geometry) return;
    const mesh = object as T.Mesh;
    geometries.add(mesh.geometry);
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(
      (m) => materials.add(m),
    );
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}
