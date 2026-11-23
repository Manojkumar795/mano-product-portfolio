import { CraftHeading } from "../components/CraftedPanels";
import { VisualDirectionBoard, AffinityThemeBoard } from "../components/DirectionBoards";

export default function Section565() {
  return <div className="homiq-crafted-section"><CraftHeading title="Moodboard & Affinity"><p>Warm interiors informed the muted palette. Grouping audit observations around rooms, setup, states, scenes and recovery kept the visual direction tied to the product’s use.</p></CraftHeading><div className="homiq-direction-boards"><VisualDirectionBoard /><AffinityThemeBoard /></div></div>;
}
