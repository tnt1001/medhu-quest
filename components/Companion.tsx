"use client";
import { useEffect, useState } from "react";
import { MooshakArt } from "@/components/Cast";

const CHEERS = ["Shabaash!", "Wah Medhu!", "Ekdum sahi!", "Kya baat hai!", "Bahut badhiya!"];
const OOPS = ["Hmm, phir se dekho", "Bas thoda sa! Phir try karo", "Chalo saath mein check karein"];

// Mooshak sits beside every game and reacts to right and wrong answers.
export default function Companion({ hint }: { hint?: string }) {
  const [mood, setMood] = useState<"happy" | "excited" | "thinking">("happy");
  const [line, setLine] = useState(hint ?? "Tum kar sakte ho!");
  const [burst, setBurst] = useState(0);
  useEffect(() => { setLine(hint ?? "Tum kar sakte ho!"); setMood("happy"); }, [hint]);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const right = () => {
      setMood("excited"); setLine(CHEERS[Math.floor(Math.random() * CHEERS.length)]); setBurst((b) => b + 1);
      clearTimeout(t); t = setTimeout(() => { setMood("happy"); setLine(hint ?? "Tum kar sakte ho!"); }, 1800);
    };
    const wrong = () => {
      setMood("thinking"); setLine(OOPS[Math.floor(Math.random() * OOPS.length)]);
      clearTimeout(t); t = setTimeout(() => { setMood("happy"); setLine(hint ?? "Tum kar sakte ho!"); }, 2600);
    };
    window.addEventListener("medhu:right", right);
    window.addEventListener("medhu:wrong", wrong);
    return () => { window.removeEventListener("medhu:right", right); window.removeEventListener("medhu:wrong", wrong); clearTimeout(t); };
  }, [hint]);
  return (
    <>
      {burst > 0 && <div key={burst} className="burst" aria-hidden="true">★</div>}
      <div className="companion">
        <div className={mood === "excited" ? "hop" : ""}><MooshakArt size={58} mood={mood} /></div>
        <div className={`bubble ${mood}`}>{line}</div>
      </div>
    </>
  );
}
