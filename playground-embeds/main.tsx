import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { EMBED_CHANNEL, EMBED_GUTTER, isPlaygroundId, playgroundCanvases, type EmbedBounds } from "../lib/playground-embed";
import { useIdleAutoplay } from "../app/components/mano-playground/idle-autoplay";
import "./embed.css";

const loaders = {
  music: () => import("../app/components/mano-playground/MusicPlayer"),
  firstpage: () => import("../app/components/mano-playground/firstpage/FirstPage"),
  tonight: () => import("../app/components/mano-playground/tonight/Tonight"),
  checkout: () => import("../app/components/mano-playground/playground/OneTapCheckout"),
  ticket: () => import("../app/components/mano-playground/DigitalTicket"),
  pizza: () => import("../app/components/mano-playground/playground/PizzaBuilder"),
  cipher: () => import("../app/components/mano-playground/cipher/Cipher"),
  "circadia": () => import("../app/components/mano-playground/circadia/Circadia"),
  milestone: () => import("../app/components/mano-playground/milestone/Milestone"),
};
const component = new URLSearchParams(window.location.search).get("component");
if (isPlaygroundId(component)) {
  const id = component, spec = playgroundCanvases[id], canvas = document.getElementById("embed-root")!;
  const requestedWidth = Number(new URLSearchParams(window.location.search).get("width"));
  const canvasWidth = Number.isInteger(requestedWidth) && requestedWidth >= 240 && requestedWidth <= spec.width ? requestedWidth : spec.width;
  const Demo = lazy(loaders[id]);
  document.body.dataset.component = id;
  document.title = `${spec.label} — Mano`;
  document.body.style.width = `${canvasWidth + EMBED_GUTTER * 2}px`;
  canvas.style.width = `${canvasWidth}px`;
  let mounted = false, pending = 0, previousSize = "";
  const report = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      if (!mounted) return;
      const height = Math.ceil(canvas.getBoundingClientRect().height + EMBED_GUTTER * 2);
      const target = id === "checkout" ? canvas.querySelector(".xc-card") : id === "firstpage" ? canvas.querySelector(".fp-layout") : null;
      let bounds: EmbedBounds | undefined;
      if (target) {
        const rect = target.getBoundingClientRect();
        let x = rect.left, y = rect.top, right = rect.right, bottom = rect.bottom;
        if (id === "firstpage") {
          // Page-turn arrows extend outside the book frame; reserve their full hit areas.
          for (const button of canvas.querySelectorAll("button")) {
            const r = button.getBoundingClientRect();
            if (r.width && r.height) { x = Math.min(x,r.left); y = Math.min(y,r.top); right = Math.max(right,r.right); bottom = Math.max(bottom,r.bottom); }
          }
        }
        bounds = { x, y, width: right-x, height: bottom-y };
      }
      const message = { channel: EMBED_CHANNEL, event: "size", component: id, width: canvasWidth + EMBED_GUTTER * 2, height, bounds };
      const signature = JSON.stringify(message);
      if (signature === previousSize) return;
      previousSize = signature;
      window.parent.postMessage(message, window.location.origin);
    });
  };
  window.addEventListener("message", event => {
    if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.channel !== EMBED_CHANNEL || event.data?.component !== id) return;
    if (event.data.event === "measure") { previousSize = ""; report(); }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !event.defaultPrevented) window.parent.postMessage({ channel: EMBED_CHANNEL, event: "escape", component: id }, window.location.origin);
  });
  const observer = new ResizeObserver(report);
  observer.observe(canvas);
  function Ready({ children }: { children: ReactNode }) {
    useEffect(() => { mounted = true; report(); return () => { mounted = false; }; }, []);
    return children;
  }
  function App() {
    // Manual takeover is local to this iframe; neighboring demos continue independently.
    const { playing, onAutoplayChange } = useIdleAutoplay(id === "cipher" || id === "circadia" ? 7000 : undefined);
    return <Suspense fallback={null}><Ready><Demo isPlaying={playing} onAutoplayChange={onAutoplayChange} /></Ready></Suspense>;
  }
  createRoot(canvas).render(<App />);
} else {
  document.getElementById("embed-root")!.textContent = "Component unavailable.";
}
