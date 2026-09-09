import type { CSSProperties } from "react";

type ColourTone = "home" | "quote" | "program" | "sustain" | "visual";

export default function ColourfulText({
  text,
  tone = "home",
  className = "",
}: {
  text: string;
  tone?: ColourTone;
  className?: string;
}) {
  return (
    <span className={`site-colourful-text site-colourful-text-${tone} ${className}`.trim()} aria-label={text}>
      {text.split(/(\s+)/).map((word, wordIndex) => {
        if (/^\s+$/.test(word)) return " ";
        const offset = text.split(/(\s+)/).slice(0, wordIndex).join("").length;
        return (
          <span className="site-colourful-word" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((character, characterIndex) => (
              <span aria-hidden="true" key={`${character}-${characterIndex}`} style={{ "--letter-index": offset + characterIndex } as CSSProperties}>
                {character}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
