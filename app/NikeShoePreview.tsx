"use client";

import Showcase3D from "./Showcase3D";
import type { ShoeStory } from "./stride-motion";

export default function NikeShoePreview({
  active,
  moving,
  resetKey = 0,
  onInteract,
  onStoryChange,
}: {
  active: boolean;
  moving: boolean;
  resetKey?: number;
  onInteract: () => void;
  onStoryChange: (story: ShoeStory) => void;
}) {
  return (
    <div className="nike-shoe-preview nike-glb-preview">
      <Showcase3D
        kind="shoe"
        active={active}
        moving={moving}
        resetKey={resetKey}
        interactive
        onInteract={onInteract}
        onShoeStory={onStoryChange}
      />
    </div>
  );
}
