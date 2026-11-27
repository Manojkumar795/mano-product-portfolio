import Image from "next/image";
import { screenLibrary } from "./screenLibrary";
import styles from "./SlotGo.module.css";

/** Trim only the export canvas surrounding the application, never its UI. */
export default function ProductScreen({ id, priority = false, raw = false }: { id: string; priority?: boolean; raw?: boolean }) {
  const screen = screenLibrary.find(item => item.id === id);
  if (!screen) return null;
  return <span className={raw ? styles.rawScreen : styles.productScreen}><Image className={screen.original && !raw ? styles.originalImage : undefined} src={`/slotgo/${screen.file}.png`} alt={`SlotGo ${screen.side === "customer" ? "Customer" : "Venue"} App: ${screen.title}`} width={screen.original ? 1046 : 806} height={screen.original ? 1960 : 1746} priority={priority} loading={priority ? undefined : "lazy"} unoptimized /></span>;
}
