import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SlotGoStory from "./SlotGoStory";
const inter = Inter({ subsets: ["latin"], variable: "--font-slotgo" });

const title = "SlotGo | AI-Assisted Sports Booking Product Design | Manoj Kumar N";
const description =
  "Sports discovery, court booking and venue operations. A product design case study using Figma Make and Codex, grounded in the original SlotGo screens.";

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
  return <SlotGoStory fontClassName={inter.variable} />;
}
