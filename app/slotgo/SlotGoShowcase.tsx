"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiArrowDown, HiArrowLeft, HiArrowRight, HiArrowsPointingOut, HiPause, HiPlay, HiXMark, HiArrowPath } from "react-icons/hi2";
import { DEMO_DURATION, SCENE_DURATION, demoScenes, screenLibrary, type LibraryScreen } from "./screenLibrary";
import styles from "./SlotGoShowcase.module.css";

function AppScreen({ screen }: { screen: LibraryScreen }) {
  return <div className={styles.appScreen}>
    <Image className={screen.original ? styles.original : styles.cropped} src={`/slotgo/${screen.file}.png`} alt={`SlotGo ${screen.side === "customer" ? "Customer" : "Venue"} App — ${screen.title}`} width={screen.original ? 1046 : 806} height={screen.original ? 1960 : 1746} unoptimized />
  </div>;
}

export default function SlotGoShowcase() {
  const stageRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const sceneRef = useRef(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [finished, setFinished] = useState(false);
  const [inView, setInView] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [artworkReady, setArtworkReady] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const current = demoScenes[scene];
  const running = playing && inView && motionAllowed && pageVisible && artworkReady && selected === null;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setMotionAllowed(!media.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 }) : null;
    if (stageRef.current && observer) observer.observe(stageRef.current);
    const fallbackFrame = observer ? null : requestAnimationFrame(() => setInView(true));
    return () => {
      observer?.disconnect();
      if (fallbackFrame !== null) cancelAnimationFrame(fallbackFrame);
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) elapsedRef.current = Math.min(DEMO_DURATION, elapsedRef.current + now - previous);
      previous = now;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${elapsedRef.current / DEMO_DURATION})`;
      const camera = cameraRef.current?.getAnimations()[0];
      if (camera) camera.currentTime = elapsedRef.current;
      const next = Math.min(demoScenes.length - 1, Math.floor(elapsedRef.current / SCENE_DURATION));
      if (next !== sceneRef.current) {
        sceneRef.current = next;
        setScene(next);
      }
      if (elapsedRef.current >= DEMO_DURATION) {
        setPlaying(false);
        setFinished(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function seek(index: number) {
    elapsedRef.current = index * SCENE_DURATION;
    sceneRef.current = index;
    setScene(index);
    setFinished(false);
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${index / demoScenes.length})`;
    const camera = cameraRef.current?.getAnimations()[0];
    if (camera) camera.currentTime = elapsedRef.current;
  }

  function togglePlayback() {
    if (finished) seek(0);
    setPlaying(finished || !playing);
  }

  function openScreen(index: number, button: HTMLButtonElement) {
    openerRef.current = button;
    setSelected(index);
    dialogRef.current?.showModal();
  }

  function closeScreen() {
    dialogRef.current?.close();
  }

  const activeScreen = selected === null ? null : screenLibrary[selected];

  return <>
    <section className={styles.cinema} id="product-film" ref={stageRef} aria-labelledby="film-title" data-running={running}>
      <Image className={styles.backdrop} src="/slotgo/studio-locker.png" alt="" fill sizes="100vw" unoptimized />
      <div className={styles.cinemaInner}>
        <div className={styles.filmHeader}><span>SlotGo / In motion</span><span>Customer + Venue</span></div>
        <div className={styles.stage}>
          <div className={styles.editorial}>
            <p className={styles.sceneLabel}>{String(scene + 1).padStart(2, "0")} / {current.label}</p>
            <div key={current.label} className={styles.sceneCopy}>
              <h2 id="film-title">{current.title.split("\n").map(line => <span key={line}>{line}</span>)}</h2>
              <p>{current.text}</p>
            </div>
            <a href="#screen-collection" className={styles.collectionLink}>Explore all 30 screens <HiArrowDown aria-hidden="true" /></a>
          </div>
          <div className={styles.deviceStage}>
            <div className={styles.phoneArtwork} ref={cameraRef}>
              <Image src="/slotgo/studio-phone-pair.png" alt="Graphite iPhone-style front and back studio mockup" width={1254} height={1254} unoptimized onLoad={() => setArtworkReady(true)} />
              <div className={styles.liveDisplay}>
                {demoScenes.map((item, index) => <div key={item.screen} className={styles.demoScreen} data-active={scene === index} aria-hidden={scene !== index}>
                  <AppScreen screen={screenLibrary.find(screen => screen.id === item.screen)!} />
                </div>)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.playback}>
          <button type="button" className={styles.playButton} onClick={togglePlayback} disabled={!motionAllowed} aria-label={finished ? "Replay product film" : playing ? "Pause product film" : "Play product film"}>
            {finished ? <HiArrowPath aria-hidden="true" /> : playing && motionAllowed ? <HiPause aria-hidden="true" /> : <HiPlay aria-hidden="true" />}
            <span>{!motionAllowed ? "Motion off" : finished ? "Replay" : playing ? "Pause" : "Play"}</span>
          </button>
          <div className={styles.timeline}>
            <div className={styles.sceneButtons} aria-label="Product film scenes">{demoScenes.map((item, index) => <button type="button" key={item.label} aria-current={scene === index ? "step" : undefined} onClick={() => seek(index)}>{item.label}</button>)}</div>
            <div className={styles.progressTrack} aria-hidden="true"><div ref={progressRef} /></div>
          </div>
          <span className={styles.runtime}>00:27 <span>/ Product walkthrough</span></span>
        </div>
      </div>
    </section>

    <section className={styles.collection} id="screen-collection" aria-labelledby="collection-title">
      <header className={styles.collectionHeader}><div><p>08 / The complete screen collection</p><h2 id="collection-title">Every screen.<br />Both sides of the game.</h2></div><p>30 original screens across discovery, booking, play and venue operations.<br /><span>Select a screen for a closer look.</span></p></header>
      {(["customer", "venue"] as const).map(side => <div className={styles.appCollection} key={side} data-showcase-app={side}>
        <div className={styles.groupHeading}><h3>{side === "customer" ? "Customer App" : "Venue App"}</h3><span>{screenLibrary.filter(screen => screen.side === side).length} screens</span></div>
        <div className={styles.screenGrid}>{screenLibrary.filter(screen => screen.side === side).map((screen, index) => <figure className={styles.galleryItem} key={screen.id}>
          <button type="button" aria-label={`Enlarge ${side === "customer" ? "Customer" : "Venue"} App — ${screen.title}`} onClick={event => openScreen(screenLibrary.indexOf(screen), event.currentTarget)}><AppScreen screen={screen} /><span className={styles.enlarge}><HiArrowsPointingOut aria-hidden="true" /></span></button>
          <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{screen.title}</figcaption>
        </figure>)}</div>
      </div>)}
    </section>

    <dialog ref={dialogRef} className={styles.lightbox} aria-labelledby="screen-dialog-title" onClose={() => { setSelected(null); openerRef.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) closeScreen(); }} onKeyDown={event => {
      if (event.key === "ArrowRight" && selected !== null && selected < screenLibrary.length - 1) { event.preventDefault(); setSelected(selected + 1); }
      if (event.key === "ArrowLeft" && selected !== null && selected > 0) { event.preventDefault(); setSelected(selected - 1); }
    }}>
      <div className={styles.lightboxPanel}>
        <header><div><p>{activeScreen?.side === "customer" ? "Customer App" : "Venue App"}</p><h2 id="screen-dialog-title">{activeScreen?.title ?? "Screen detail"}</h2></div><button type="button" onClick={closeScreen} aria-label="Close screen detail" autoFocus><HiXMark aria-hidden="true" /></button></header>
        <div className={styles.expandedScreen}>{activeScreen && <AppScreen screen={activeScreen} />}</div>
        <footer><button type="button" disabled={selected === null || selected === 0} onClick={() => setSelected(index => Math.max(0, (index ?? 0) - 1))}><HiArrowLeft aria-hidden="true" /> Previous</button><span>{String((selected ?? 0) + 1).padStart(2, "0")} / 30</span><button type="button" disabled={selected === null || selected === screenLibrary.length - 1} onClick={() => setSelected(index => Math.min(screenLibrary.length - 1, (index ?? 0) + 1))}>Next <HiArrowRight aria-hidden="true" /></button></footer>
      </div>
    </dialog>
  </>;
}
