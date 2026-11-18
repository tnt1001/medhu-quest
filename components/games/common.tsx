"use client";
import { useMemo, useState } from "react";
import { ItemArt } from "@/components/Art";
import type { Item } from "@/content/quests";
import { numberWords, sayNumber, sfx } from "@/lib/audio";

export interface Result {
  tries: number;
  correct: number;
  triedAgain: boolean;
}

export const emptyResult = (): Result => ({ tries: 0, correct: 0, triedAgain: false });

export function merge(a: Result, b: Result): Result {
  return { tries: a.tries + b.tries, correct: a.correct + b.correct, triedAgain: a.triedAgain || b.triedAgain };
}

// Deterministic-ish shuffle so options don't jump around between renders.
export function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function optionsFor(answer: number, seed: number, max = 20): number[] {
  const pool = [answer - 2, answer - 1, answer + 1, answer + 2].filter((n) => n >= 1 && n <= max);
  const picks = shuffle(pool, seed).slice(0, 2);
  return shuffle([answer, ...picks], seed + 7);
}

// A row of number choices. Calls onAnswer(firstTryRight, recovered) once the right number is tapped.
// After a wrong tap it shows `explain` - a worked explanation, not just "wrong".
export function NumberChoices({ answer, seed, onAnswer, explain }: { answer: number; seed: number; onAnswer: (firstTry: boolean, recovered: boolean) => void; explain?: React.ReactNode }) {
  const opts = useMemo(() => optionsFor(answer, seed), [answer, seed]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  return (
    <div>
      <div className="choices">
        {opts.map((n) => (
          <button
            key={n}
            className={`choice ${done && n === answer ? "right" : ""} ${wrong.includes(n) ? "wrong" : ""}`}
            disabled={done}
            onClick={() => {
              if (n === answer) {
                setDone(true);
                sfx.right();
                setTimeout(() => sayNumber(n), 250);
                setTimeout(() => onAnswer(wrong.length === 0, wrong.length > 0), 1300);
              } else {
                sfx.wrong();
                setWrong((w) => [...w, n]);
              }
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {done && <div className="numword center pop">{numberWords(answer)}</div>}
      {!done && wrong.length > 0 && explain && (
        <div className="explain fade-in">
          <div className="explain-title">Let&apos;s check together</div>
          {explain}
        </div>
      )}
    </div>
  );
}

// Scattered positions that don't overlap much, inside a 100x100 box (percent units).
export function scatter(n: number, seed: number) {
  const pts: { x: number; y: number }[] = [];
  let s = seed * 7 + 3;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  let guard = 0;
  while (pts.length < n && guard < 2000) {
    guard++;
    const p = { x: 10 + rnd() * 80, y: 12 + rnd() * 76 };
    if (pts.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 22)) pts.push(p);
  }
  while (pts.length < n) pts.push({ x: 10 + rnd() * 80, y: 12 + rnd() * 76 });
  return pts;
}

export function Scattered({ n, item, seed, size = 52 }: { n: number; item: Item; seed: number; size?: number }) {
  const pts = scatter(n, seed);
  return (
    <div style={{ position: "relative", width: "100%", height: "var(--stage-h)" }}>
      {pts.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)" }}>
          <ItemArt item={item} size={size} />
        </div>
      ))}
    </div>
  );
}

// The progress bar shows the current arc's treat (modaks in Arc 1, arrows in Arc 2).
let progressItem: Item = "modak";
export function setProgressItem(item: Item) { progressItem = item; }

export function Progress({ total, at }: { total: number; at: number }) {
  return (
    <div className="modakbar" aria-label={`${at} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < at ? "on" : ""}><ItemArt item={progressItem} size={22} /></span>
      ))}
    </div>
  );
}
