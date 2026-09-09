import type { Metadata } from "next";
import { Inter } from "next/font/google";
import F35StoryV2 from "./F35StoryV2";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F-35 Helmet UX — Manoj Kumar N",
  description:
    "A UX and Human Factors study of how the F-35 helmet-mounted interface filters complexity, preserves context and supports confident decisions.",
};

export default function F35HelmetUxPage() {
  return (
    <div className={inter.className}>
      <F35StoryV2 />
    </div>
  );
}
