import type { ComponentPropsWithoutRef } from "react";

type ScreenshotTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "type"> & { src: string };

export default function ScreenshotTrigger({ src, children, ...props }: ScreenshotTriggerProps) {
  return (
    <button {...props} type="button" data-screenshot-src={src} aria-haspopup="dialog">
      {children}
    </button>
  );
}
