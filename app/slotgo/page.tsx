import type { Metadata } from "next";
import SlotGoStory from "./SlotGoStory";

const title = "SlotGo — Customer Booking & Venue Operations UX | Manoj Kumar N";
const description =
  "A mobile product case study connecting sports discovery, court booking, live play and venue operations through one shared source of truth.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://mano-product-portfolio.mano787.chatgpt.site/slotgo",
    images: [
      {
        url: "https://mano-product-portfolio.mano787.chatgpt.site/slotgo/customer-home.png",
        width: 806,
        height: 1746,
        alt: "SlotGo customer mobile experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      "https://mano-product-portfolio.mano787.chatgpt.site/slotgo/customer-home.png",
    ],
  },
};

export default function SlotGoPage() {
  return <SlotGoStory />;
}
