import { useEffect, useState } from "react";

/**
 * Ek line ko word-by-word type karta hai. Jab pura ho jaata hai,
 * onComplete() call hota hai — taaki agli line uske baad shuru ho.
 * highlightWords: in exact words ko marigold color diya jaata hai (case-insensitive match).
 */
export default function Typewriter({ text, speed = 130, startDelay = 0, onComplete, highlightWords = [], className = "" }) {
  const words = text.split(" ");
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (count >= words.length) {
      onComplete && onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [count, started]);

  const highlightSet = new Set(highlightWords.map((w) => w.toLowerCase()));
  const isDone = count >= words.length;

  return (
    <span className={className}>
      {words.slice(0, count).map((w, i) => {
        const clean = w.replace(/[.,!]/g, "").toLowerCase();
        const isHighlighted = highlightSet.has(clean);
        return (
          <span key={i} className={isHighlighted ? "text-marigold" : ""}>
            {w}{i < count - 1 ? " " : ""}
          </span>
        );
      })}
      {started && !isDone && (
        <span className="inline-block w-[2px] h-[0.9em] bg-marigold ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}