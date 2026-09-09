import type { Metadata } from "next";
import DeliveryStory from "./DeliveryStory";

export const metadata: Metadata = {
  title: "Modern Product Delivery — Manoj Kumar N",
  description:
    "A senior product design case study tracing an enterprise interface from Figma through design-system foundations, component behaviour, MCP, React implementation and validation.",
};

export default function ModernProductDeliveryPage() {
  return <DeliveryStory />;
}
