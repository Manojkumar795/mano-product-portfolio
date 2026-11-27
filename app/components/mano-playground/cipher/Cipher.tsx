"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useShowcaseActivity } from "../../../useShowcaseActivity";
import { useAutoplayResume } from "../idle-autoplay";
import "./Cipher.css";

const verificationCode = "631204";
const digitCount = verificationCode.length;
const resendDelay = 30;
const emptyCode = () => Array<string>(digitCount).fill("");
const codeDigits = (code: string, filled: number) => Array.from({ length: digitCount }, (_, index) => index < filled ? code[index] : "");

type Phase = "idle" | "entry" | "verifying" | "error" | "success";

function previewAttempt(code: string, resultDelay: number) {
  return [
    { delay: 1450, filled: 3, phase: "idle", code },
    { delay: 400, filled: 4, phase: "idle", code },
    { delay: 400, filled: 5, phase: "idle", code },
    { delay: 520, filled: 6, phase: "verifying", code },
    { delay: resultDelay, filled: 6, phase: code === verificationCode ? "success" : "error", code },
  ] as const;
}

const previewFrames = [
  ...previewAttempt(verificationCode, 4200),
  ...previewAttempt("631209", 3400),
];

export default function Cipher({ isPlaying = true, onAutoplayChange }: {
  isPlaying?: boolean;
  onAutoplayChange?: (playing: boolean) => void;
}) {
  const [digits, setDigits] = useState(() => codeDigits(verificationCode, 3));
  const [phase, setPhase] = useState<Phase>("idle");
  const [deadline, setDeadline] = useState(0);
  const [seconds, setSeconds] = useState(resendDelay);
  const [refreshed, setRefreshed] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fields = useRef<(HTMLInputElement | null)[]>([]);
  const { ref, running, reducedMotion } = useShowcaseActivity(isPlaying);
  const preview = phase === "idle" ? previewFrames[previewIndex] : null;
  const visiblePhase = preview?.phase ?? phase;

  useAutoplayResume(() => {
    if (preview || reducedMotion) return;
    setPreviewIndex(0);
    setDigits(codeDigits(verificationCode, 3));
    setDeadline(0);
    setSeconds(resendDelay);
    setRefreshed(false);
    setPhase("idle");
  });

  useEffect(() => {
    if (!preview || !running || reducedMotion) return;
    const timer = window.setTimeout(() => {
      setPreviewIndex(index => (index + 1) % previewFrames.length);
    }, preview.delay);
    return () => window.clearTimeout(timer);
  }, [preview, running, reducedMotion]);

  useEffect(() => {
    if (!deadline) return;
    let timer: number | undefined;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining > 0) timer = window.setTimeout(tick, 1000);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [deadline]);

  useEffect(() => {
    if (phase !== "verifying") return;
    const timer = window.setTimeout(() => setPhase(digits.join("") === verificationCode ? "success" : "error"), 520);
    return () => window.clearTimeout(timer);
  }, [digits, phase]);

  function begin() {
    if (phase === "idle") {
      onAutoplayChange?.(false);
      setPhase("entry");
      setDeadline(Date.now() + resendDelay * 1000);
    }
  }

  function write(index: number, text: string) {
    if (phase === "success") return;
    const value = text.replace(/[^0-9]/g, "").slice(0, digitCount);
    if (text && !value) return;
    const start = value.length === digitCount ? 0 : index;
    const next = [...digits];
    if (!value) next[start] = "";
    for (let offset = 0; offset < value.length && start + offset < digitCount; offset++) {
      next[start + offset] = value[offset];
    }
    begin();
    setRefreshed(false);
    setDigits(next);
    setPhase(next.every(Boolean) ? "verifying" : "entry");
    if (value) fields.current[Math.min(start + value.length, digitCount - 1)]?.focus();
  }

  function navigate(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "Backspace" && !digits[index] && index > 0 && phase !== "success") {
      event.preventDefault();
      write(index - 1, "");
      fields.current[index - 1]?.focus();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      fields.current[index + (event.key === "ArrowLeft" ? -1 : 1)]?.focus();
    }
  }

  function resend() {
    if (seconds > 0 && !verified) {
      begin();
      return;
    }
    setDigits(emptyCode());
    setRefreshed(!verified);
    setPhase("entry");
    setSeconds(resendDelay);
    setDeadline(Date.now() + resendDelay * 1000);
    fields.current[0]?.focus();
  }

  const verified = visiblePhase === "success";
  const invalid = visiblePhase === "error";
  const verifying = visiblePhase === "verifying";
  const waiting = seconds > 0 && !verified;
  const displayedDigits = preview ? codeDigits(preview.code, preview.filled) : digits;

  return (
    <section className="cipher" aria-labelledby="cipher-title" data-phase={visiblePhase} data-visible={running || !preview}>
      <div ref={ref} className="cipher-lock" aria-hidden="true">
        <span className="cipher-emblem" />
      </div>
      <div className="cipher-verify">
        <h1 id="cipher-title"><span>{verified ? "Code verified" : invalid ? "Incorrect code" : "6 digit code"}</span></h1>
        <p className="cipher-description" id="cipher-description" aria-live={preview ? "off" : "polite"}>
          {verified ? "The padlock is unlocked." :
            invalid ? "Check the digits and try again." :
            verifying ? "Verifying your code…" :
            refreshed ? "Code refreshed. Enter the six digits below." :
            <>Please enter 6 digit OTP verification code<br />sent to +1 (555) 123-4567</>}
        </p>
        <div className="cipher-fields" role="group" aria-label="Verification code" aria-describedby="cipher-description">
          {displayedDigits.map((digit, index) => (
            <label className="cipher-field" key={index} data-preview-caret={preview?.phase === "idle" && preview.filled === index + 1 ? "" : undefined}>
              <input
                ref={element => { fields.current[index] = element; }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1} of ${digitCount}`}
                aria-invalid={invalid || undefined}
                value={digit}
                readOnly={phase === "success"}
                spellCheck={false}
                onFocus={event => { event.currentTarget.select(); begin(); }}
                onClick={event => { event.currentTarget.select(); begin(); }}
                onChange={event => write(index, event.currentTarget.value)}
                onKeyDown={event => navigate(event, index)}
                onPaste={event => {
                  event.preventDefault();
                  write(index, event.clipboardData.getData("text"));
                }}
              />
            </label>
          ))}
        </div>
        <div className="cipher-footer">
          {!verified && "Having trouble? "}
          <button type="button" onClick={resend} aria-disabled={waiting || undefined}>
            {verified ? "Try again" : waiting ? `Resend code in ${seconds} sec` : "Resend code"}
          </button>
        </div>
        <p className="cipher-credit">Designed by <strong>Mano</strong></p>
      </div>
    </section>
  );
}
