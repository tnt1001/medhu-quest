"use client";
import { useEffect, useMemo, useState } from "react";
import { ItemArt } from "@/components/Art";
import { MooshakArt } from "@/components/Cast";
import { CountDemo } from "@/components/Learn";
import { say, sayNumber, sfx } from "@/lib/audio";
import { P } from "@/lib/phrases";
import { NumberChoices, Progress, emptyResult, merge, shuffle, type Result } from "./common";

type Done = (r: Result) => void;

function useRounds(total: number, onDone: Done) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Result>(emptyResult());
  const next = (firstTry: boolean, recovered: boolean) => {
    const r = merge(res, { tries: 1, correct: firstTry ? 1 : 0, triedAgain: recovered });
    setRes(r);
    if (i + 1 >= total) onDone(r);
    else setI(i + 1);
  };
  return { i, next };
}

const BALLOON_COLORS = ["#d64545", "#2f6fd6", "#2e9d5b", "#f2c230", "#c2185b", "#f28c28", "#7b1fa2"];

function Balloon({ color }: { color: string }) {
  return (
    <svg width="52" height="76" viewBox="0 0 52 76" aria-hidden="true">
      <ellipse cx="26" cy="26" rx="22" ry="25" fill={color} />
      <ellipse cx="18" cy="16" rx="5" ry="8" fill="white" opacity=".35" />
      <path d="M22 50 L30 50 L26 56 Z" fill={color} />
      <path d="M26 56 Q20 64 28 70 Q32 74 26 76" stroke="#7a6a5a" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* Balloon Pop: "count" = pop them all then say how many; "give" = pop exactly N. */
export function BalloonGame({ mode, rounds, onDone, guided }: { mode: "count" | "give"; rounds: number[]; onDone: Done; guided?: boolean }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const total = mode === "count" ? n : n + 4;
  const [popped, setPopped] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);
  const [state, setState] = useState<"play" | "ask" | "right" | "wrong">("play");
  const balloons = useMemo(() => shuffle(Array.from({ length: total }, (_, k) => k), i + 5).map((k, idx) => ({
    // Spread across the width, and start mid-flight (negative delay) so the sky is full from the first second.
    k, color: BALLOON_COLORS[(k + i) % BALLOON_COLORS.length], left: 4 + ((idx * 37) % 78), dur: 6 + (idx % 3), delay: -((idx * 6.5) / total),
  })), [total, i]);
  useEffect(() => { setPopped([]); setMissed(false); setState("play"); say(mode === "count" ? P.popCount : P.popN(n)); }, [i, n, mode]);
  useEffect(() => { if (mode === "count" && popped.length === n && state === "play") { setState("ask"); setTimeout(() => say(P.howManyPopped), 400); } }, [popped, n, mode, state]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">{mode === "count" ? "Pop them all and count!" : <>Pop exactly <span style={{ color: "#f28c28" }}>{n}</span> balloons!</>}</p>
      {state !== "ask" && (
        <div className="sky-stage">
          {balloons.map((b) => popped.includes(b.k) ? null : (
            <button key={b.k} className={mode === "count" ? "balloon bob-b" : "balloon float-b"} style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, bottom: mode === "count" ? `${12 + ((b.k * 37) % 50)}%` : undefined }}
              onClick={() => { if (state !== "play") return; sfx.pop(); const p = [...popped, b.k]; setPopped(p); if (mode === "count" || guided) sayNumber(p.length); }}>
              <Balloon color={b.color} />
            </button>
          ))}
          {(mode === "count" || guided) && popped.length > 0 && <div className="pop-count pop" key={popped.length}>{popped.length}</div>}
        </div>
      )}
      {mode === "count" && state === "ask" && <NumberChoices key={i} answer={n} seed={i + 13} onAnswer={next} explain={<CountDemo item="star" n={n} k={i} />} />}
      {mode === "give" && (
        <div className="center" style={{ marginTop: 12 }}>
          {state === "right" ? <p className="big pop" style={{ color: "#2e9d5b" }}>✓ Exactly {n}!</p> : (
            <button className="btn" onClick={() => {
              if (popped.length === n) { setState("right"); sfx.right(); say(P.exactly(n)); setTimeout(() => next(!missed, missed), 1400); }
              else {
                sfx.wrong(); setMissed(true); say(popped.length > n ? P.tooMany : P.notEnough);
                if (popped.length > n) setTimeout(() => setPopped([]), 900);
              }
            }}>Done</button>
          )}
          {state !== "right" && popped.length > n && <p style={{ color: "#d64545", fontWeight: 800 }}>Too many! Try again.</p>}
        </div>
      )}
    </div>
  );
}

/* Feed Mooshak: tap modaks to feed him exactly N. */
export function FeedGame({ rounds, onDone, guided }: { rounds: number[]; onDone: Done; guided?: boolean }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const [fed, setFed] = useState(0);
  const [flying, setFlying] = useState<number | null>(null);
  const [missed, setMissed] = useState(false);
  const [state, setState] = useState<"play" | "right" | "full">("play");
  useEffect(() => { setFed(0); setMissed(false); setState("play"); say(P.feedN(n)); }, [i, n]);
  const pile = 12 - fed;
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Feed Mooshak <span style={{ color: "#f28c28" }}>{n}</span> modaks!</p>
      <div className="feed-stage">
        <div className="feed-pile">
          {Array.from({ length: pile }, (_, k) => (
            <button key={k} className="tap-item" onClick={() => {
              if (state !== "play" || flying !== null) return;
              setFlying(k); sfx.tap();
              setTimeout(() => { setFlying(null); const f = fed + 1; setFed(f); sfx.drop(); if (guided) sayNumber(f); }, 380);
            }}>
              <div className={flying === k ? "fly-to-mouth" : ""}><ItemArt item="modak" size={40} /></div>
            </button>
          ))}
        </div>
        <div className={`feed-mooshak ${state === "full" ? "shake-x" : fed > 0 ? "chew" : ""}`}>
          <MooshakArt size={120} mood={state === "full" ? "confused" : "excited"} />
          {guided && <div className="pop-count" style={{ position: "static", margin: "4px auto 0" }}>{fed}</div>}
        </div>
      </div>
      <div className="center" style={{ marginTop: 12 }}>
        {state === "right" ? <p className="big pop" style={{ color: "#2e9d5b" }}>✓ Yum! Exactly {n}!</p> : (
          <button className="btn" onClick={() => {
            if (fed === n) { setState("right"); sfx.right(); say(P.yum); setTimeout(() => next(!missed, missed), 1500); }
            else if (fed > n) { setState("full"); sfx.wrong(); setMissed(true); say(P.tooFull); setTimeout(() => { setFed(0); setState("play"); }, 1600); }
            else { sfx.wrong(); setMissed(true); say(P.stillHungry); }
          }}>Done</button>
        )}
        {state === "full" && <p style={{ color: "#d64545", fontWeight: 800 }}>Too full! Let&apos;s try again.</p>}
      </div>
    </div>
  );
}

const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

/* Memory Match: flip two cards; match the dot picture to its number. */
export function MemoryGame({ rounds, onDone }: { rounds: number[][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const nums = rounds[i];
  const cards = useMemo(() => shuffle(nums.flatMap((n) => [{ id: `d${n}`, n, kind: "dots" as const }, { id: `n${n}`, n, kind: "num" as const }]), i + 21), [nums, i]);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [bad, setBad] = useState<string[]>([]);
  useEffect(() => { setOpen([]); setMatched([]); setMisses(0); setBad([]); say(P.memoryStart); }, [i]);
  const flip = (c: (typeof cards)[number]) => {
    if (open.length >= 2 || open.includes(c.id) || matched.includes(c.n)) return;
    sfx.tap();
    const o = [...open, c.id];
    setOpen(o);
    if (o.length === 2) {
      const [a, b] = o.map((id) => cards.find((x) => x.id === id)!);
      if (a.n === b.n) {
        const m = [...matched, a.n];
        setTimeout(() => {
          sfx.right(); sayNumber(a.n); setMatched(m); setOpen([]);
          if (m.length === nums.length) setTimeout(() => next(misses === 0, misses > 0), 1300);
        }, 350);
      } else {
        setTimeout(() => { sfx.wrong(); setBad(o); }, 350);
        setTimeout(() => { setOpen([]); setBad([]); setMisses((x) => x + 1); }, 1200);
      }
    }
  };
  const cols = cards.length <= 6 ? 3 : 4;
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Match the dots to the number!</p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
        {cards.map((c) => {
          const shown = open.includes(c.id) || matched.includes(c.n);
          const state = matched.includes(c.n) ? "right" : bad.includes(c.id) ? "wrong" : "";
          return (
            <button key={c.id} className={`mcard ${shown ? "shown" : ""} ${state}`} onClick={() => flip(c)}>
              {!shown ? <span className="mcard-back">?</span> : c.kind === "num" ? (
                <span style={{ fontSize: 44, fontWeight: 900, color: "#f28c28" }}>{c.n}</span>
              ) : (
                <svg width="70" height="70" viewBox="0 0 100 100" aria-label={`${c.n} dots`}>
                  {(DOTS[c.n] || []).map(([x, y], k) => <circle key={k} cx={x} cy={y} r="11" fill="#d64545" />)}
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
