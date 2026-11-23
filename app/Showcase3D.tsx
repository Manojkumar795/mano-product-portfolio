"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { useShowcaseActivity } from "./useShowcaseActivity";
import { SHOE_HERO_ANGLE, shoeCinematicPose, shoeFramingRadius, shoeStoryForAngle, shoeTimeForAngle, type ShoeStory } from "./stride-motion";

export type CarFocus = "full" | "cockpit" | "front-wing" | "tyres";
type Props = {
  kind: "car" | "aircraft" | "shoe";
  active: boolean;
  colour?: string;
  heading?: number;
  bank?: number;
  focus?: CarFocus;
  resetKey?: number;
  interactive?: boolean;
  moving?: boolean;
  onInteract: () => void;
  onShoeStory?: (story: ShoeStory) => void;
};

function disposeGeometry(root: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (!(object as THREE.Mesh).isMesh) return;
    const mesh = object as THREE.Mesh;
    mesh.geometry.dispose();
    (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(
      (material) => {
        const map = (material as THREE.MeshStandardMaterial).map;
        if (map) textures.add(map);
        material.dispose();
      },
    );
  });
  textures.forEach((texture) => {
    texture.dispose();
    const image = texture.image;
    if (
      image &&
      typeof image === "object" &&
      "close" in image &&
      typeof image.close === "function"
    )
      image.close();
  });
}

/** GLB geometry, PBR materials and a demand-driven renderer shared by the two apps. */
export default function Showcase3D({
  kind,
  active,
  colour = "#eb3d35",
  heading = 340,
  bank = 0,
  focus = "full",
  resetKey = 0,
  interactive = false,
  moving = false,
  onInteract,
  onShoeStory,
}: Props) {
  const { ref, running, reducedMotion } = useShowcaseActivity(active);
  const [warm, setWarm] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const props = useRef({
    running,
    reducedMotion,
    colour,
    heading,
    bank,
    focus,
    resetKey,
    interactive,
    moving,
    onInteract,
    onShoeStory,
  });
  props.current = {
    running,
    reducedMotion,
    colour,
    heading,
    bank,
    focus,
    resetKey,
    interactive,
    moving,
    onInteract,
    onShoeStory,
  };
  const api = useRef<{
    wake: () => void;
    rotate: (angle: number) => void;
    tilt: (angle: number) => void;
    home: () => void;
  } | null>(null);
  useEffect(() => {
    if (running) setWarm(true);
  }, [running]);
  useEffect(() => {
    api.current?.wake();
  }, [
    running,
    reducedMotion,
    colour,
    heading,
    bank,
    focus,
    resetKey,
    interactive,
    moving,
  ]);

  useEffect(() => {
    if (!warm || !ref.current) return;
    const host = ref.current;
    let disposed = false;
    let frame = 0;
    let contextHealthy = true;
    let cleanup = () => {};
    const initialise = async () => {
      try {
        const [T, { GLTFLoader }, { OrbitControls }, { RoomEnvironment }] =
          await Promise.all([
            import("three"),
            import("three/examples/jsm/loaders/GLTFLoader.js"),
            import("three/examples/jsm/controls/OrbitControls.js"),
            import("three/examples/jsm/environments/RoomEnvironment.js"),
          ]);
        if (disposed) return;
        const renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.shadowMap.enabled = kind !== "aircraft";
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        host.appendChild(renderer.domElement);
        renderer.domElement.setAttribute("aria-hidden", "true");
        const scene = new T.Scene();
        const environment = new RoomEnvironment();
        const pmrem = new T.PMREMGenerator(renderer);
        const environmentMap = pmrem.fromScene(environment, 0.04);
        scene.environment = environmentMap.texture;
        environment.dispose();
        pmrem.dispose();
        scene.add(new T.HemisphereLight(kind === "shoe" ? 0xfffbf2 : 0xf0f3ff, kind === "shoe" ? 0x7c8669 : 0x202330, kind === "shoe" ? 1.6 : 2.0));
        const key = new T.DirectionalLight(0xfff5e8, kind === "shoe" ? 2.8 : 4.0);
        key.position.set(3, 7, 5);
        key.castShadow = kind !== "aircraft";
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -4;
        key.shadow.camera.right = 4;
        key.shadow.camera.top = 4;
        key.shadow.camera.bottom = -4;
        key.shadow.normalBias = 0.035;
        key.shadow.bias = -0.0003;
        key.shadow.radius = 4;
        scene.add(key);
        const rim = new T.DirectionalLight(kind === "shoe" ? 0xffe9c9 : 0x9bbedf, kind === "shoe" ? 1.4 : 2.2);
        rim.position.set(-4, 3, -4);
        scene.add(rim);
        if (kind === "shoe") {
          const studio = new T.SpotLight(0xfff1dd, 5, 24, Math.PI / 4, 1, 2);
          studio.position.set(-3, 5, -4);
          scene.add(studio);
        }
        const camera = new T.PerspectiveCamera(
          kind === "shoe" ? 38 : 33,
          1,
          0.05,
          100,
        );
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.minPolarAngle = 0.25;
        controls.maxPolarAngle = 1.48;
        controls.rotateSpeed = 0.6;
        controls.autoRotateSpeed = 1.5;
        const pivot = new T.Group();
        scene.add(pivot);
        const paints = new Set<THREE.MeshStandardMaterial>();
        if (kind !== "aircraft") {
          const floor = new T.Mesh(
            new T.PlaneGeometry(30, 30),
            new T.ShadowMaterial({ opacity: kind === "shoe" ? 0.23 : 0.35 }),
          );
          floor.rotation.x = -Math.PI / 2;
          floor.position.y = -0.015;
          floor.receiveShadow = true;
          scene.add(floor);
        }
        let cameraMoving = true;
        let modelLoaded = false;
        let shoeElapsed = 0, shoeEntrance = 0, shoeIdleUntil = 0;
        let shoeDragging = false, shoeAutomatic = true;
        let shoeStory: ShoeStory = 0;
        let shoeRadius = 6.5, shoeHalfX = 1, shoeHalfZ = 2.2, shoeHalfHeight = .65;
        let lastFocus = "";
        let lastReset = -1;
        let busyUntil = 0;
        let previousTime = 0;
        const targetCamera = new T.Vector3();
        const targetLook = new T.Vector3();
        const targetPaint = new T.Color();
        const shoeOffset = new T.Vector3();
        const fullCamera =
          kind === "car"
            ? [5.4, 2.7, 6.4]
            : kind === "shoe"
              ? [Math.sin(SHOE_HERO_ANGLE) * 6.5, 1.91, Math.cos(SHOE_HERO_ANGLE) * 6.5]
              : [4.6, 2.4, 5.7];
        const fullLook =
          kind === "car"
            ? [0, 0.5, 0]
            : kind === "shoe"
              ? [0, 0.75, 0]
              : [0, 0, 0];
        const pose = () => {
          const current = props.current;
          if (kind === "shoe") {
            controls.autoRotate = false;
            controls.enableDamping = false;
            controls.update();
            shoeElapsed = 0; shoeEntrance = 0; shoeIdleUntil = 0;
            shoeDragging = false; shoeAutomatic = true; shoeStory = 0;
            const opening = shoeCinematicPose(0);
            controls.target.fromArray(fullLook);
            const radius = shoeRadius * opening.radius * (current.reducedMotion ? 1 : 1.06);
            camera.position.set(Math.sin(opening.angle) * Math.cos(opening.elevation) * radius,
              fullLook[1] + Math.sin(opening.elevation) * radius,
              Math.cos(opening.angle) * Math.cos(opening.elevation) * radius);
            controls.update();
            lastFocus = "full"; lastReset = current.resetKey; cameraMoving = false;
            current.onShoeStory?.(0);
            return;
          }
          const part = kind === "car" ? current.focus : "full";
          const views: Record<CarFocus, { camera: number[]; look: number[] }> =
            {
              full: { camera: fullCamera, look: fullLook },
              cockpit: { camera: [1.7, 1.8, 2.1], look: [0, 0.75, -0.25] },
              "front-wing": { camera: [2.0, 0.85, 4.2], look: [0, 0.25, 2.4] },
              tyres: { camera: [2.45, 0.8, 2.5], look: [0.83, 0.36, 1.76] },
            };
          targetCamera.fromArray(views[part].camera);
          targetLook.fromArray(views[part].look);
          lastFocus = part;
          lastReset = current.resetKey;
          cameraMoving = true;
          if (current.reducedMotion) {
            camera.position.copy(targetCamera);
            controls.target.copy(targetLook);
            cameraMoving = false;
          }
        };
        const render = (time: number) => {
          frame = 0;
          if (disposed || !contextHealthy || !props.current.running) return;
          const current = props.current;
          const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
          previousTime = time;
          if (
            lastFocus !== (kind === "car" ? current.focus : "full") ||
            lastReset !== current.resetKey
          )
            pose();
          controls.enabled =
            kind !== "aircraft" && current.interactive && !cameraMoving;
          controls.enableDamping = !current.reducedMotion;
          controls.autoRotate = false;
          const smoothing = current.reducedMotion
            ? 1
            : 1 - Math.exp(-9 * delta);
          targetPaint.set(current.colour);
          let liveryMoving = false;
          paints.forEach((material) => {
            material.color.lerp(targetPaint, smoothing);
            const distance =
              Math.abs(material.color.r - targetPaint.r) +
              Math.abs(material.color.g - targetPaint.g) +
              Math.abs(material.color.b - targetPaint.b);
            if (distance > 0.001) liveryMoving = true;
            else material.color.copy(targetPaint);
          });
          let orientationMoving = false;
          if (kind === "aircraft") {
            const yaw = ((current.heading - 340) * Math.PI) / 180;
            const roll = (-current.bank * Math.PI) / 180;
            const yawDifference = Math.atan2(
              Math.sin(yaw - pivot.rotation.y),
              Math.cos(yaw - pivot.rotation.y),
            );
            pivot.rotation.y += yawDifference * smoothing;
            pivot.rotation.z += (roll - pivot.rotation.z) * smoothing;
            orientationMoving =
              Math.abs(yawDifference) > 0.002 ||
              Math.abs(roll - pivot.rotation.z) > 0.002;
          }
          if (cameraMoving) {
            const blend = current.reducedMotion ? 1 : 1 - Math.exp(-5 * delta);
            camera.position.lerp(targetCamera, blend);
            controls.target.lerp(targetLook, blend);
            if (
              camera.position.distanceTo(targetCamera) < 0.004 &&
              controls.target.distanceTo(targetLook) < 0.004
            )
              cameraMoving = false;
          }
          if (kind === "shoe" && modelLoaded && current.moving && !current.reducedMotion && !shoeDragging && time >= shoeIdleUntil) {
            if (!shoeAutomatic) {
              // Match the end of the real drag, including damping, before resuming.
              shoeAutomatic = true;
              controls.enableDamping = false;
              controls.update();
              shoeElapsed = shoeTimeForAngle(controls.getAzimuthalAngle());
            }
            shoeElapsed += delta; shoeEntrance += delta;
            const motion = shoeCinematicPose(shoeElapsed);
            const offset = shoeOffset.copy(camera.position).sub(controls.target);
            const radius = T.MathUtils.lerp(offset.length(), shoeRadius * motion.radius * (1 + .06 * Math.exp(-shoeEntrance * 2.5)), 1 - Math.exp(-4 * delta));
            const elevation = T.MathUtils.lerp(Math.asin(offset.y / offset.length()), motion.elevation, 1 - Math.exp(-4 * delta));
            camera.position.set(Math.sin(motion.angle) * Math.cos(elevation) * radius,
              controls.target.y + Math.sin(elevation) * radius,
              Math.cos(motion.angle) * Math.cos(elevation) * radius);
            controls.enableDamping = false;
            renderer.toneMappingExposure = 1.02 + .13 * (1 - Math.exp(-shoeEntrance * 3));
          }
          controls.update(delta);
          if (kind === "shoe" && modelLoaded) {
            const angle = controls.getAzimuthalAngle();
            const nextStory = shoeStoryForAngle(angle, shoeStory);
            if (nextStory !== shoeStory) { shoeStory = nextStory; current.onShoeStory?.(nextStory); }
            const orbit = angle - SHOE_HERO_ANGLE;
            key.intensity = T.MathUtils.lerp(key.intensity, 2.8 + .3 * Math.sin(orbit), smoothing);
            rim.intensity = T.MathUtils.lerp(rim.intensity, 1.4 + .2 * (1 - Math.cos(orbit)), smoothing);
          }
          renderer.render(scene, camera);
          if (
            cameraMoving ||
            liveryMoving ||
            orientationMoving ||
            (kind === "shoe" &&
              modelLoaded &&
              current.moving &&
              !current.reducedMotion) ||
            (time < busyUntil && !current.reducedMotion)
          )
            frame = requestAnimationFrame(render);
        };
        const wake = () => {
          if (!props.current.running) {
            cancelAnimationFrame(frame); frame = 0; controls.enabled = false;
            shoeDragging = false;
            if (!Number.isFinite(shoeIdleUntil)) shoeIdleUntil = performance.now() + 2200;
            return;
          }
          if (!disposed && contextHealthy && props.current.running && !frame) {
            previousTime = 0;
            frame = requestAnimationFrame(render);
          }
        };
        const interaction = () => {
          controls.autoRotate = false;
          props.current.onInteract();
          cameraMoving = false;
          if (kind === "shoe") { shoeDragging = true; shoeAutomatic = false; shoeIdleUntil = Infinity; }
          busyUntil = performance.now() + 1800;
          wake();
        };
        controls.addEventListener("start", interaction);
        const interactionEnd = () => {
          if (kind === "shoe") { shoeDragging = false; shoeIdleUntil = performance.now() + 2200; }
          busyUntil = performance.now() + 1800;
          wake();
        };
        controls.addEventListener("end", interactionEnd);
        const keyboardInteraction = () => {
          if (kind === "shoe") { shoeDragging = false; shoeAutomatic = false; shoeIdleUntil = performance.now() + 2200; }
        };
        const move = () => {
          if (props.current.interactive) {
            busyUntil = performance.now() + 1500;
            wake();
          }
        };
        renderer.domElement.addEventListener("pointermove", move);
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (width > 0 && height > 0) {
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            if (kind === "shoe") {
              shoeRadius = shoeFramingRadius(shoeHalfX, shoeHalfHeight, shoeHalfZ, camera.aspect, camera.fov);
            }
            wake();
          }
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        const lost = (event: Event) => {
          event.preventDefault();
          setStatus("fallback");
          contextHealthy = false;
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
        };
        renderer.domElement.addEventListener("webglcontextlost", lost);
        api.current = {
          wake,
          rotate: (angle) => {
            props.current.onInteract();
            keyboardInteraction();
            cameraMoving = false;
            const offset = camera.position.clone().sub(controls.target);
            offset.applyAxisAngle(new T.Vector3(0, 1, 0), angle);
            camera.position.copy(controls.target).add(offset);
            busyUntil = performance.now() + 400;
            wake();
          },
          tilt: (angle) => {
            props.current.onInteract();
            keyboardInteraction();
            cameraMoving = false;
            const offset = camera.position.clone().sub(controls.target);
            const spherical = new T.Spherical().setFromVector3(offset);
            spherical.phi = Math.max(
              controls.minPolarAngle,
              Math.min(controls.maxPolarAngle, spherical.phi + angle),
            );
            camera.position
              .copy(controls.target)
              .add(offset.setFromSpherical(spherical));
            busyUntil = performance.now() + 400;
            wake();
          },
          home: () => {
            props.current.onInteract();
            lastFocus = "";
            wake();
          },
        };
        pose();
        camera.position.fromArray(fullCamera);
        controls.target.fromArray(fullLook);
        resize();
        cleanup = () => {
          observer.disconnect();
          controls.dispose();
          controls.removeEventListener("start", interaction);
          controls.removeEventListener("end", interactionEnd);
          renderer.domElement.removeEventListener("pointermove", move);
          renderer.domElement.removeEventListener("webglcontextlost", lost);
          disposeGeometry(scene);
          environmentMap.dispose();
          renderer.dispose();
          renderer.domElement.remove();
          api.current = null;
        };
        const gltf = await new GLTFLoader().loadAsync(
          kind === "shoe"
            ? "/hero-commerce/nike-air-max-plus-sunset.glb"
            : `/hero-3d/${kind === "car" ? "apex-car" : "flight-aircraft"}.glb`,
        );
        if (disposed) {
          disposeGeometry(gltf.scene);
          return;
        }
        const box = new T.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new T.Vector3());
        const centre = box.getCenter(new T.Vector3());
        const scale =
          (kind === "car" ? 5.415 : kind === "shoe" ? 4.4 : 4.6) /
          Math.max(size.x, size.y, size.z);
        gltf.scene.position.set(
          -centre.x * scale,
          kind !== "aircraft" ? -box.min.y * scale : -centre.y * scale,
          -centre.z * scale,
        );
        gltf.scene.scale.setScalar(scale);
        if (kind === "shoe") {
          shoeHalfX = size.x * scale / 2;
          shoeHalfZ = size.z * scale / 2;
          shoeHalfHeight = size.y * scale / 2;
          fullLook[1] = shoeHalfHeight;
        }
        gltf.scene.traverse((object) => {
          if (!(object as THREE.Mesh).isMesh) return;
          const mesh = object as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const source = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          const enhanced = source.map((material) => {
            const standard = material as THREE.MeshStandardMaterial;
            if (kind === "shoe") standard.envMapIntensity = .85;
            if (kind === "car" && standard.name === "paint") {
              const paint = new T.MeshPhysicalMaterial({
                color: props.current.colour,
                metalness: 0.55,
                roughness: 0.23,
                clearcoat: 1,
                clearcoatRoughness: 0.22,
              });
              paints.add(paint);
              return paint;
            }
            if (standard.name === "alloy" || standard.name === "steel") {
              standard.metalness = 0.85;
              standard.roughness = 0.25;
            }
            return standard;
          });
          mesh.material = Array.isArray(mesh.material) ? enhanced : enhanced[0];
        });
        pivot.add(gltf.scene);
        modelLoaded = true;
        if (kind === "shoe") { resize(); pose(); }
        setStatus("ready");
        wake();
      } catch {
        if (!disposed) {
          contextHealthy = false;
          if (frame) cancelAnimationFrame(frame);
          frame = 0;
          cleanup();
          setStatus("fallback");
        }
      }
    };
    void initialise();
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      cleanup();
    };
  }, [kind, warm, ref]);

  return (
    <div
      className={`showcase-model model-${kind}${interactive ? " is-interactive" : ""}`}
      data-colour={colour}
      data-heading={heading}
      data-bank={bank.toFixed(1)}
      data-focus={focus}
      data-rendering={running}
      data-moving={kind === "shoe" && moving && running && !reducedMotion}
    >
      <div
        ref={ref}
        className="showcase-model-canvas"
        role="img"
        tabIndex={kind === "shoe" && active ? 0 : undefined}
        onKeyDown={(event) => {
          if (kind !== "shoe" || status !== "ready") return;
          if (
            ![
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
            ].includes(event.key)
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          if (event.key === "Home") api.current?.home();
          else if (event.key === "ArrowUp" || event.key === "ArrowDown")
            api.current?.tilt(event.key === "ArrowUp" ? -0.12 : 0.12);
          else api.current?.rotate(event.key === "ArrowLeft" ? -0.3 : 0.3);
        }}
        aria-label={
          kind === "car"
            ? `Interactive 3D racing car, ${focus === "full" ? "full car" : focus.replace("-", " ")}`
            : kind === "shoe"
              ? "Nike Air Max Plus Sunset. Interactive 3D model. Drag or use arrow keys to rotate. Home resets the view."
              : `3D aircraft, heading ${heading} degrees, bank ${Math.round(bank)} degrees`
        }
      />
      {status !== "ready" && (
        <div className="showcase-model-poster">
          {kind !== "shoe" && (
            <img
              src={`/hero-3d/${kind === "car" ? "apex-car" : "flight-aircraft"}.webp`}
              alt=""
              loading="lazy"
            />
          )}
          <span>
            {status === "fallback"
              ? kind === "shoe"
                ? "3D preview unavailable on this device"
                : "3D unavailable · preview mode"
              : "Preparing 3D view…"}
          </span>
        </div>
      )}
      {kind === "car" && interactive && (
        <div
          className="model-rotation-controls"
          aria-label="Rotate racing car"
        >
          <button
            type="button"
            disabled={status !== "ready"}
            tabIndex={active ? 0 : -1}
            aria-label="Rotate car left"
            onClick={() => api.current?.rotate(-0.3)}
          >
            ↶
          </button>
          <span>Drag to orbit</span>
          <button
            type="button"
            disabled={status !== "ready"}
            tabIndex={active ? 0 : -1}
            aria-label="Rotate car right"
            onClick={() => api.current?.rotate(0.3)}
          >
            ↷
          </button>
        </div>
      )}
    </div>
  );
}
