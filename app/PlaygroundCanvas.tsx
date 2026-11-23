"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EMBED_CHANNEL, EMBED_GUTTER, EMBED_VIEWPORT_MIN, fitPlaygroundCanvas, playgroundCanvases, validEmbedSize, validEmbedBounds, type EmbedBounds, type PlaygroundId } from "../lib/playground-embed";

const previewSizes: Partial<Record<PlaygroundId, number>> = { music: 0.7, ticket: 0.5, checkout: 0.6 };

/** Scale only the iframe element. Its inner DOM, media queries and pointer coordinates stay native. */
export default function PlaygroundCanvas({ component, onMeasure }: { component: PlaygroundId; onMeasure?: (id: PlaygroundId, height: number, width: number) => void }) {
  const spec = playgroundCanvases[component];
  const viewport = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [available, setAvailable] = useState(0);
  const [compact, setCompact] = useState(false);
  const [height, setHeight] = useState<number>(spec.initialHeight + EMBED_GUTTER * 2);
  const [ready, setReady] = useState(false);
  const [bounds, setBounds] = useState<EmbedBounds | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const canvasWidth = compact && available ? Math.min(spec.width, Math.max(240, Math.round(available))) : spec.width;
  const width = canvasWidth + EMBED_GUTTER * 2;

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => setAvailable(element.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function requestSize() {
    frame.current?.contentWindow?.postMessage({ channel: EMBED_CHANNEL, event: "measure", component }, window.location.origin);
  }
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || !validEmbedSize(event.data, component, width)) return;
      setHeight(Math.ceil(event.data.height)); setReady(true);
      const measured = validEmbedBounds(event.data.bounds, width, event.data.height) ? event.data.bounds : null;
      setBounds(measured);
      onMeasure?.(component, measured?.height ?? Math.ceil(event.data.height) - EMBED_GUTTER * 2, measured?.width ?? canvasWidth);
    };
    window.addEventListener("message", receive);
    frame.current?.contentWindow?.postMessage({ channel: EMBED_CHANNEL, event: "measure", component }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, [component, width, onMeasure]);

  const crop = bounds ?? { x: EMBED_GUTTER, y: EMBED_GUTTER, width: canvasWidth, height: Math.max(1, height - EMBED_GUTTER * 2) };
  const fit = fitPlaygroundCanvas(available, crop.width, crop.height, component === "ticket" || bounds !== null);
  // Desktop row tracks provide compact preview sizes; phones retain their existing scale.
  // Measure the full track for native responsive behavior, then scale the entire result.
  // Native DOM dimensions, content and media queries do not change when the preview shrinks.
  const previewSize = compact ? (previewSizes[component] ?? 1) : 1;
  const scale = fit.scale * previewSize;
  const visibleWidth = crop.width * scale;
  return <div ref={viewport} style={{ width: "100%" }}>
    <div className="mano-playground-viewport" style={{ width: available ? visibleWidth : "100%", marginInline: "auto", height: available ? fit.height * previewSize : undefined, aspectRatio: `${crop.width} / ${crop.height}` }} aria-busy={!ready}>
    {!ready && <span className="mano-playground-loading" role="status">Loading {spec.label}…</span>}
    <iframe ref={frame} className="mano-playground-frame" title={`${spec.label} — interactive component`} src={`/playground-embeds/?component=${component}${compact ? `&width=${canvasWidth}` : ""}`} loading="lazy" allow="autoplay" onLoad={requestSize} style={{ width: compact ? width : Math.max(EMBED_VIEWPORT_MIN, width), height, top: -crop.y * scale, left: -crop.x * scale, transform: `scale(${scale})`, opacity: ready && available ? 1 : 0 }} />
    </div>
  </div>;
}
