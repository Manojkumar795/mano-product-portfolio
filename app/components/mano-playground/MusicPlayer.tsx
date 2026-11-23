import { useEffect, useState } from "react"
import "./MusicPlayer.css"
import { useAutoplayResume } from "./idle-autoplay"

export interface MusicPlayerProps {
  isPlaying?: boolean
}

const tracks = [
  "Weightless · Marconi Union",
  "A Walk · Tycho",
  "Open Eye Signal · Jon Hopkins",
]

function TrackIcon({ previous = false }: { previous?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ transform: previous ? "rotate(180deg)" : undefined }}
    >
      <path d="M6 5.5a1 1 0 0 1 1.5-.86l10 6.5a1 1 0 0 1 0 1.72l-10 6.5A1 1 0 0 1 6 18.5Z" />
      <rect x="18" y="5" width="2" height="14" rx="1" />
    </svg>
  )
}

const demoTime = (fraction: number) =>
  `0:${String(Math.floor(fraction * 12)).padStart(2, "0")}`

export default function MusicPlayer({ isPlaying = true }: MusicPlayerProps) {
  const [playing, setPlaying] = useState(isPlaying)
  const [track, setTrack] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => setPlaying(isPlaying), [isPlaying])
  useAutoplayResume(() => setPlaying(true))

  // A silent twelve-second preview of each track; pausing freezes the demo.
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 1 / 120, 1))
    }, 100)
    return () => window.clearInterval(timer)
  }, [playing])

  useEffect(() => {
    if (progress < 1) return
    setTrack((value) => (value + 1) % tracks.length)
    setProgress(0)
  }, [progress])

  function nextTrack() {
    setTrack((value) => (value + 1) % tracks.length)
    setProgress(0)
  }

  function previousTrack() {
    setTrack((value) => (value - 1 + tracks.length) % tracks.length)
    setProgress(0)
  }

  return (
    <section
      className={`turntable ${playing ? "is-playing" : ""}`}
      aria-label="Interactive turntable music player"
    >
      <header className="turntable-header">
        <span className="turntable-led" aria-hidden="true" />
        <p className="turntable-curator">Curated by Mano</p>
      </header>

      <div className="turntable-mechanism">
        <button
          className="turntable-platter"
          onClick={() => setPlaying((value) => !value)}
          aria-label={`${playing ? "Pause" : "Play"} ${tracks[track]}`}
          title={tracks[track]}
        >
          <span className="turntable-rim">
            <span
              className="turntable-disc"
              style={
                { "--disc-shift": `${track * 45}deg` } as React.CSSProperties
              }
            >
              <span className="turntable-grooves" />
            </span>
            <span className="turntable-reflection" aria-hidden="true" />
            <span className="turntable-hub">
              <span className="turntable-hole" />
            </span>
          </span>
        </button>

        <div className="turntable-tonearm" aria-hidden="true">
          <span className="turntable-pivot" />
          <span className="turntable-arm">
            <span className="turntable-arm-shaft" />
            <span className="turntable-cartridge">
              <span />
            </span>
          </span>
        </div>
      </div>

      <div className="turntable-bottom">
        <div className="turntable-controls">
          <div className="turntable-control-item">
            <button
              className="turntable-control"
              aria-label="Previous track"
              title="Previous track"
              onClick={previousTrack}
            >
              <TrackIcon previous />
            </button>
            <span>Previous</span>
          </div>
          <div className="turntable-control-item">
            <button
              className="turntable-control turntable-primary"
              aria-label={playing ? "Pause" : "Play"}
              title={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((value) => !value)}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {playing ? (
                  <>
                    <rect x="6" y="5" width="4" height="14" rx=".7" />
                    <rect x="14" y="5" width="4" height="14" rx=".7" />
                  </>
                ) : (
                  <path d="M8 4.5 19 12 8 19.5Z" />
                )}
              </svg>
            </button>
            <span>{playing ? "Pause" : "Play"}</span>
          </div>
          <div className="turntable-control-item">
            <button
              className="turntable-control"
              aria-label="Next track"
              title="Next track"
              onClick={nextTrack}
            >
              <TrackIcon />
            </button>
            <span>Next</span>
          </div>
        </div>
        <div className="turntable-now-playing">
          <div className="turntable-track-status">
            <span className="turntable-equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            {playing ? "NOW PLAYING" : "PAUSED"}
          </div>
          <div className="turntable-track-name" key={track}>
            <strong>{tracks[track].split(" · ")[0]}</strong>
            <span>{tracks[track].split(" · ")[1]}</span>
          </div>
          <div className="turntable-meter">
            <input
              className="turntable-progress"
              aria-label="Demo playback position"
              type="range"
              min="0"
              max="1"
              step=".001"
              value={progress}
              aria-valuetext={`${demoTime(progress)} of 0:12`}
              onChange={(event) => setProgress(Number(event.target.value))}
              style={
                {
                  "--playback-progress": `${progress * 100}%`,
                } as React.CSSProperties
              }
            />
          </div>
          <div className="turntable-timing">
            <span>{demoTime(progress)}</span>
            <span>0:12</span>
          </div>
        </div>
      </div>
      <span className="turntable-announcement" role="status" aria-live="polite">
        {tracks[track]} ·{" "}
        {playing ? "Playing — visual demo, no audio" : "Paused"}
      </span>
    </section>
  )
}
