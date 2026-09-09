"use client";

import { useEffect, useRef, useState } from "react";
import type { Group, Material, Mesh, Object3D, PerspectiveCamera, Scene, Texture, WebGLRenderer } from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styles from "./F35ModelViewer.module.css";

type ViewerStatus = "idle" | "loading" | "ready" | "error";

function disposeMaterial(material: Material) {
  Object.values(material).forEach((value) => {
    const texture = value as Texture | undefined;
    if (texture?.isTexture) texture.dispose();
  });
  material.dispose();
}

function disposeModel(root: Object3D) {
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
    else disposeMaterial(mesh.material);
  });
}

export default function F35ModelViewer() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activated, setActivated] = useState(false);
  const [status, setStatus] = useState<ViewerStatus>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActivated(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px", threshold: 0.05 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!activated) return;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    let disposed = false;
    let animationFrame = 0;
    let resizeFrame = 0;
    let renderer: WebGLRenderer | null = null;
    let camera: PerspectiveCamera | null = null;
    let scene: Scene | null = null;
    let controls: OrbitControls | null = null;
    let model: Object3D | null = null;
    let modelGroup: Group | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let viewportVisible = true;

    setStatus("loading");

    const initialise = async () => {
      try {
        const [THREE, { GLTFLoader }, { OrbitControls: OrbitController }] = await Promise.all([
          import("three"),
          import("three/addons/loaders/GLTFLoader.js"),
          import("three/addons/controls/OrbitControls.js"),
        ]);
        if (disposed) return;

        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(34, 1, 0.01, 2000);

        scene.add(new THREE.HemisphereLight(0xc8f5f5, 0x10181d, 2.4));
        const keyLight = new THREE.DirectionalLight(0xf4fbff, 4.2);
        keyLight.position.set(5, 8, 7);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0x6cdbe4, 3.1);
        rimLight.position.set(-8, 1, -5);
        scene.add(rimLight);

        controls = new OrbitController(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.065;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.autoRotate = false;

        let lastWidth = 0;
        let lastHeight = 0;
        const resize = () => {
          if (!renderer || !camera) return;
          const width = Math.max(frame.clientWidth, 1);
          const height = Math.max(frame.clientHeight, 1);
          if (width === lastWidth && height === lastHeight) return;
          lastWidth = width;
          lastHeight = height;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(resize);
        });
        resizeObserver.observe(frame);
        resize();

        const loader = new GLTFLoader();
        loader.load(
          "/f35-helmet-ux/f35-lightning-ii.glb",
          (gltf) => {
            if (disposed || !scene || !camera || !controls || !renderer) {
              disposeModel(gltf.scene);
              return;
            }

            model = gltf.scene;
            const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
            model.traverse((object) => {
              const mesh = object as Mesh;
              if (!mesh.isMesh) return;
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((material) => {
                Object.values(material).forEach((value) => {
                  const texture = value as Texture | undefined;
                  if (texture?.isTexture) texture.anisotropy = maxAnisotropy;
                });
                if (material.transparent) material.depthWrite = false;
              });
            });

            const bounds = new THREE.Box3().setFromObject(model);
            const center = bounds.getCenter(new THREE.Vector3());
            model.position.sub(center);

            modelGroup = new THREE.Group();
            modelGroup.rotation.set(-0.09, -0.52, -0.04);
            modelGroup.add(model);
            scene.add(modelGroup);

            const sphere = new THREE.Box3().setFromObject(modelGroup).getBoundingSphere(new THREE.Sphere());
            const radius = Math.max(sphere.radius, 1);
            const fitDistance = (radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.02;
            const viewDirection = new THREE.Vector3(1.28, 0.62, 1.65).normalize();
            camera.near = Math.max(radius / 100, 0.01);
            camera.far = radius * 100;
            camera.position.copy(viewDirection.multiplyScalar(fitDistance));
            camera.updateProjectionMatrix();
            camera.lookAt(0, 0, 0);

            controls.target.set(0, 0, 0);
            controls.minDistance = fitDistance * 0.72;
            controls.maxDistance = fitDistance * 1.8;
            controls.update();

            setProgress(100);
            setStatus("ready");
          },
          (event) => {
            if (disposed || !event.total) return;
            setProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
          },
          () => {
            if (!disposed) setStatus("error");
          },
        );

        const handleKeyDown = (event: KeyboardEvent) => {
          if (!modelGroup) return;
          const step = 0.11;
          if (event.key === "ArrowLeft") modelGroup.rotation.y -= step;
          else if (event.key === "ArrowRight") modelGroup.rotation.y += step;
          else if (event.key === "ArrowUp") modelGroup.rotation.x = Math.max(-0.55, modelGroup.rotation.x - step);
          else if (event.key === "ArrowDown") modelGroup.rotation.x = Math.min(0.4, modelGroup.rotation.x + step);
          else return;
          event.preventDefault();
        };
        canvas.addEventListener("keydown", handleKeyDown);

        const render = () => {
          animationFrame = 0;
          if (disposed || !viewportVisible || !renderer || !scene || !camera) return;
          controls?.update();
          renderer.render(scene, camera);
          animationFrame = requestAnimationFrame(render);
        };
        visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            viewportVisible = entry.isIntersecting;
            if (viewportVisible && animationFrame === 0) animationFrame = requestAnimationFrame(render);
            if (!viewportVisible && animationFrame !== 0) {
              cancelAnimationFrame(animationFrame);
              animationFrame = 0;
            }
          },
          { rootMargin: "100px 0px", threshold: 0.01 },
        );
        visibilityObserver.observe(frame);
        render();

        return () => canvas.removeEventListener("keydown", handleKeyDown);
      } catch {
        if (!disposed) setStatus("error");
        return undefined;
      }
    };

    let removeKeyboardHandler: (() => void) | undefined;
    initialise().then((cleanup) => {
      if (disposed) cleanup?.();
      else removeKeyboardHandler = cleanup;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeFrame);
      removeKeyboardHandler?.();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      controls?.dispose();
      if (model) disposeModel(model);
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [activated]);

  return (
    <div className={styles.viewer} ref={frameRef} data-status={status}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        tabIndex={0}
        aria-label="Interactive 3D model of an F-35. Drag to rotate or use the arrow keys."
      />
      {status !== "ready" && (
        <div className={styles.loading} role="status">
          {status === "error" ? (
            <span>3D aircraft unavailable</span>
          ) : (
            <>
              <span>Loading 3D aircraft{progress > 0 ? ` ${progress}%` : ""}</span>
              <i><b style={{ width: `${progress}%` }} /></i>
            </>
          )}
        </div>
      )}
      <div className={styles.instructions} aria-hidden="true">Drag to explore · Arrow keys</div>
      <div className={styles.credit}>
        <a href="https://sketchfab.com/3d-models/f-35-lightning-ii-fighter-jet-free-b1ab1c0090e34b0fbfe667e706023e6d" target="_blank" rel="noreferrer">3D: bohmerang</a>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>
      </div>
    </div>
  );
}
