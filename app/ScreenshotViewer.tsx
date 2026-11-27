"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./screenshot-viewer.module.css";

type Preview = { src: string; label: string; alt: string };

export default function ScreenshotViewer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    function preventImageActions(event: Event) {
      if (event.target instanceof Element && event.target.closest(
        "[data-portfolio-media] img, [data-portfolio-media] svg image, [data-screenshot-preview] img",
      )) {
        event.preventDefault();
      }
    }

    function openPreview(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const trigger = event.target.closest<HTMLButtonElement>("button[data-screenshot-src]");
      const src = trigger?.dataset.screenshotSrc;
      if (!trigger || !src) return;

      const label = trigger.getAttribute("aria-label") ?? trigger.textContent?.trim() ?? "Screenshot";
      opener.current = trigger;
      setPreview({ src, label, alt: trigger.querySelector("img")?.alt || label });
    }

    document.addEventListener("contextmenu", preventImageActions, true);
    document.addEventListener("dragstart", preventImageActions, true);
    document.addEventListener("click", openPreview);

    return () => {
      document.removeEventListener("contextmenu", preventImageActions, true);
      document.removeEventListener("dragstart", preventImageActions, true);
      document.removeEventListener("click", openPreview);
    };
  }, []);

  useEffect(() => {
    if (preview && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [preview]);

  function closePreview() {
    setPreview(null);
    opener.current?.focus();
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={preview?.label ?? "Screenshot preview"}
      data-screenshot-preview
      onClose={closePreview}
    >
      <div className={styles.toolbar}>
        <button type="button" autoFocus onClick={() => dialog.current?.close()}>Close</button>
      </div>
      {preview && <img className={styles.image} src={preview.src} alt={preview.alt} draggable={false} />}
    </dialog>
  );
}
