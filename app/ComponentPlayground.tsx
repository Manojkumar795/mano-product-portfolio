"use client";

import { useCallback, useState } from "react";
import PlaygroundCanvas from "./PlaygroundCanvas";
import { playgroundCanvases, type PlaygroundId } from "../lib/playground-embed";
import "./component-playground.css";

const rows: PlaygroundId[][] = [["music", "ticket", "pizza", "checkout"], ["firstpage", "tonight"]];

export default function ComponentPlayground() {
  const [ratios, setRatios] = useState<Partial<Record<PlaygroundId, number>>>({});
  const measure = useCallback((id: PlaygroundId, height: number, width: number) => {
    const ratio = width / height;
    setRatios(previous => Math.abs((previous[id] ?? 0) - ratio) < .0001 ? previous : { ...previous, [id]: ratio });
  }, []);
  return <section className="mano-playground" aria-labelledby="component-playground-title">
    <div className="mano-playground-inner">
      <h2 id="component-playground-title">Component Playground</h2>
      <div className="mano-playground-grid">
        {rows.map((ids, index) => <div className={`mano-playground-row mano-playground-row-${index + 1}`} key={index}
          style={ids.every(id => ratios[id]) ? { gridTemplateColumns: ids.map(id => `minmax(0, ${ratios[id]}fr)`).join(" ") } : undefined}>
          {ids.map(id => <article className={`mano-playground-tile mano-playground-${id}`} key={id} aria-label={playgroundCanvases[id].label}>
            <div className="mano-playground-content" data-component={id}>
              <PlaygroundCanvas component={id} onMeasure={measure} />
            </div>
          </article>)}
        </div>)}
      </div>
    </div>
  </section>;
}
