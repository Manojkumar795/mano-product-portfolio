"use client";
import { useState, type CSSProperties } from "react";
import styles from "./FrameRate.module.css";

const cards = [
  ["5070","GeForce RTX 5070","GV-N5070GAMING-OC-12GD"],
  ["3060","GeForce RTX 3060 12 GB","GV-N3060GAMING-OC-12GD-rev-20"],
  ["9070","Radeon RX 9070","GV-R9070GAMING-OC-16GD"],
  ["7600","Radeon RX 7600","GV-R76GAMING-OC-8GD"],
];
const games = [
  ["cyber","Cyberpunk 2077","1091500","#f9f200"],
  ["forza","Forza Horizon 5","1551360","#ffb9d2"],
  ["red","Red Dead Redemption 2","1174180","#ffb191"],
  ["gta","Grand Theft Auto VI","","#f8b1e0"],
];
const resolutions = ["1080p","1440p","4K"] as const;
const cyber5070 = {
  averages: [138,89,41], preset:"Ultra", cpu:"Ryzen 7 9800X3D", rt:"Off",
  source:"https://gamersnexus.net/gpus/nvidia-selling-lies-rtx-5070-founders-edition-review-benchmarks",
};
export default function FrameRate({active,onFocusChange}:{active:boolean;onFocusChange:(focused:boolean)=>void}) {
  const [gpu,setGpu] = useState(0);
  const [game,setGame] = useState(0);
  const [res,setRes] = useState(1);
  const [expanded,setExpanded] = useState(false);
  const card = cards[gpu], title = games[game];
  const bench = gpu === 0 && game === 0 ? cyber5070 : null;
  return <section id="showcase-slide-3" role="group" aria-roledescription="slide" aria-label="4 of 4: FRAME RATE graphics card and game store" aria-hidden={!active} inert={!active}
    className={`system-slide ${styles.frame} ${active ? "is-active" : ""}`} style={{"--accent":title[3]} as CSSProperties}
    onFocusCapture={()=>onFocusChange(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))onFocusChange(false)}}
    onPointerDown={()=>onFocusChange(true)} onPointerUp={e=>onFocusChange(e.currentTarget.contains(document.activeElement))} onPointerCancel={e=>onFocusChange(e.currentTarget.contains(document.activeElement))}>
    {games.map(([id],i)=><div key={id} className={styles.art} style={{backgroundImage:`url(/frame-rate/${id === "cyber" ? "cyber-night-city" : id + "-library_hero"}.webp)`,opacity:i===game?1:0}}/>)}
    <div className={styles.shade}/>
    <div className={styles.scroll}>
      <div className={styles.main}>
        <div className={styles.copy}>
          <b className={styles.brand}>FRAME RATE</b>
          <h2>What can your<br /> GPU play?</h2>
          <div className={styles.controls}>
            <label>
              Graphics card
              <select value={gpu} onChange={event => { setGpu(Number(event.target.value)); setExpanded(false); }}>
                {cards.map(([id, model], index) => <option value={index} key={id}>{model}</option>)}
              </select>
            </label>
            <fieldset className={styles.resolutions} aria-label="Resolution">
              {resolutions.map((resolution, index) => (
                <label key={resolution}>
                  <input type="radio" name="frame-rate-resolution" checked={res === index} onChange={() => setRes(index)} />
                  <span>{resolution}</span>
                </label>
              ))}
            </fieldset>
          </div>
          <div className={styles.benchmark}>
            <div className={styles.result} aria-live="polite">
              {bench ? <><strong>{bench.averages[res]} avg FPS</strong><span>{bench.preset} preset</span></> : "Awaiting PC benchmark"}
            </div>
            {bench && <button type="button" aria-expanded={expanded} aria-controls="frame-rate-benchmark" className={styles.detailButton} onClick={() => setExpanded(!expanded)}>View benchmark</button>}
          </div>
          {bench && <div id="frame-rate-benchmark" hidden={!expanded} className={styles.details}>
            Phantom Liberty v2.21 · RTX 5070 Founders Edition<br />
            CPU: {bench.cpu} · Ray tracing: {bench.rt}<br />
            Upscaling: Not reported · Frame generation: Not reported<br />
            <a href={bench.source} target="_blank" rel="noreferrer">Source: GamersNexus</a>
          </div>}
          <div className={styles.links}>
            <a href={gpu === 0 ? "https://marketplace.nvidia.com/en-us/consumer/graphics-cards/geforce-rtx-5070-founders-edition/" : `https://www.gigabyte.com/Graphics-Card/${card[2]}`} target="_blank" rel="noreferrer">View graphics card →</a>
            {title[2] && <a href={`https://store.steampowered.com/app/${title[2]}/`} target="_blank" rel="noreferrer">View game →</a>}
          </div>
        </div>
        <img className={styles.gpu} src={`/frame-rate/${card[0]}.webp`} alt={card[1] + (gpu === 0 ? " Founders Edition graphics card" : " Gigabyte Gaming OC graphics card")} />
      </div>
      <div className={styles.strip} role="group" aria-label="Select game" onTouchStart={e=>e.stopPropagation()} onTouchMove={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}>
        {games.map(([id,name],i)=><button key={id} type="button" aria-label={name} aria-pressed={i===game} onClick={()=>{setGame(i);setExpanded(false)}}><img src={`/frame-rate/${id}-library_hero.webp`} alt=""/><span>{name}</span></button>)}
      </div>
    </div>
  </section>
}
