"use client";
// Arc 2 (Battle of Lanka) game formats: stone hop, hiding behind the shield,
// army stories (add / take away), number battle cards, size order, ten-frame.
import { useEffect, useMemo, useState } from "react";
import { ItemArt } from "@/components/Art";
import { HanumanArt } from "@/components/Cast";
import type { Item } from "@/content/quests";
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

export const NOUN: Record<Item, [string, string]> = {
  modak: ["modak", "modaks"], diya: ["diya", "diyas"], star: ["star", "stars"], laddoo: ["laddoo", "laddoos"],
  vanara: ["monkey", "monkeys"], stone: ["stone", "stones"], arrow: ["arrow", "arrows"],
};
const noun = (item: Item, n: number) => NOUN[item][n === 1 ? 0 : 1];

/* ---------- Ten-frame ---------- */
export function TensFrame({ n, item, small = false }: { n: number; item: Item; small?: boolean }) {
  const cell = small ? "min(30px, 7.5vw)" : "min(50px, 12vw)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cell})`, gap: 5, padding: 7, background: "#f6e3c4", borderRadius: 14 }}>
      {Array.from({ length: 10 }, (_, k) => (
        <div key={k} style={{ width: cell, height: cell, borderRadius: 8, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {k < n && <ItemArt item={item} size={small ? 22 : 34} />}
        </div>
      ))}
    </div>
  );
}

/* ---------- Stone Hop: Hanuman hops along numbered stones ---------- */
// mode "guess": Hanuman is on `from`; where will he land after `by` (+1 / -1)? Answer, then he hops.
// mode "tap": tap each next stone to hop `by` stones, counting on aloud.
function Stones({ lo, hi, at, glow, onTap, bad }: { lo: number; hi: number; at: number; glow?: number[]; onTap?: (n: number) => void; bad?: number | null }) {
  const nums = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
  return (
    <div style={{ position: "relative", background: "linear-gradient(#7cc4f0, #3b8fd0)", borderRadius: 20, padding: "78px 8px 16px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
        {nums.map((n) => (
          <button
            key={n}
            onClick={() => onTap?.(n)}
            className={bad === n ? "shake" : ""}
            style={{
              position: "relative", flex: 1, minWidth: 0, aspectRatio: "1 / .8", border: 0, borderRadius: "46% 54% 40% 60%",
              background: bad === n ? "#d64545" : glow?.includes(n) ? "#2e9d5b" : "#c3ccd6",
              boxShadow: "0 4px 0 #6b7682", color: bad === n || glow?.includes(n) ? "white" : "#2b2118",
              fontWeight: 900, fontSize: "clamp(18px, 5.6vw, 26px)", cursor: onTap ? "pointer" : "default", padding: 0,
            }}
          >
            {n}
            {n === at && (
              <span style={{ position: "absolute", left: "50%", bottom: "70%", transform: "translateX(-50%)", transition: "all .4s" }} className="pop">
                <HanumanArt size={64} />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function HopGame({ mode, rounds, onDone }: { mode: "guess" | "tap"; rounds: [number, number][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [from, by] = rounds[i];
  const land = from + by;
  const lo = Math.max(0, Math.min(from, land) - 1);
  const hi = lo + 6;
  const [at, setAt] = useState(from);
  const [path, setPath] = useState<number[]>([]);
  const [bad, setBad] = useState<number | null>(null);
  const [missed, setMissed] = useState(false);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    setAt(from); setPath([]); setBad(null); setMissed(false); setLanded(false);
    say(mode === "tap" ? P.hopN(by) : by > 0 ? P.oneMoreQ : P.oneLessQ);
  }, [i, from, by, mode]);
  const step = by > 0 ? 1 : -1;
  const tap = (n: number) => {
    if (mode !== "tap" || landed) return;
    if (n === at + step) {
      sfx.tap(); sayNumber(n); setAt(n); setPath([...path, n]);
      if (n === land) { setLanded(true); sfx.right(); setTimeout(() => next(!missed, missed), 1800); }
    } else { sfx.wrong(); setBad(n); setMissed(true); setTimeout(() => setBad(null), 600); }
  };
  const ask = by > 0 ? (by === 1 ? "1 jump MORE" : `${by} jumps more`) : "1 jump BACK";
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center" style={{ marginBottom: 6 }}>
        On <span style={{ color: "#f28c28" }}>{from}</span>. {mode === "tap" ? <>Hop <span style={{ color: "#f28c28" }}>{by}</span> more!</> : <>{ask}?</>}
      </p>
      <Stones lo={lo} hi={hi} at={at} glow={landed ? [land] : path} onTap={mode === "tap" ? tap : undefined} bad={bad} />
      {mode === "tap" && !landed && <p className="center muted" style={{ fontWeight: 700 }}>Tap the next stone. Count as you hop!</p>}
      {mode === "tap" && landed && <p className="big center pop" style={{ color: "#2e9d5b" }}>{from} and {by} more is {land}!</p>}
      {mode === "guess" && (
        <NumberChoices
          key={i}
          answer={land}
          seed={i + 21}
          onAnswer={(a, b) => { setAt(land); setLanded(true); sfx.whoosh(); setTimeout(() => next(a, b), 700); }}
          explain={<p className="center" style={{ fontWeight: 800 }}>{by > 0 ? `The stone after ${from} is ${land}.` : `The stone before ${from} is ${land}.`} Look at the stones!</p>}
        />
      )}
    </div>
  );
}

/* ---------- Shield: how many are hiding? ---------- */
function ShieldGame({ item, rounds, onDone }: { item: Item; rounds: [number, number][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [total, shown] = rounds[i];
  const hidden = total - shown;
  const [phase, setPhase] = useState<"all" | "hide" | "show">("all");
  useEffect(() => { setPhase("all"); say(P.thereAre(total, item)); const t = setTimeout(() => { setPhase("hide"); sfx.whoosh(); say(P.howManyHiding); }, 2600); return () => clearTimeout(t); }, [i, total, item]);
  const big = total > 5;
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">{phase === "all" ? <>There are <span style={{ color: "#f28c28" }}>{total}</span> {noun(item, total)}.</> : phase === "hide" ? "How many are hiding?" : `${shown} and ${hidden} make ${total}!`}</p>
      <div className="stage" style={{ gap: 10, padding: 12, minHeight: 130, alignItems: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: "48%" }}>
          {Array.from({ length: shown }, (_, k) => <ItemArt key={k} item={item} size={big ? 36 : 46} />)}
        </div>
        <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", maxWidth: "48%", minWidth: 80, minHeight: 70, padding: 4, borderRadius: 14, outline: phase === "show" ? "3px dashed #2e9d5b" : "none" }}>
          {Array.from({ length: hidden }, (_, k) => <ItemArt key={k} item={item} size={big ? 36 : 46} />)}
          {phase === "hide" && (
            <div className="shield-in" style={{ position: "absolute", inset: -6, borderRadius: 26, background: "radial-gradient(circle at 40% 35%, #ffe082, #f2a900 60%, #c98a00)", border: "5px solid #8a5a00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#8a3f15", fontWeight: 900 }}>?</div>
          )}
        </div>
      </div>
      <p className="center muted" style={{ fontWeight: 700 }}>Lord Hanuman&apos;s shield hides some!</p>
      {phase !== "all" && (
        <NumberChoices
          key={i}
          answer={hidden}
          seed={i + 31}
          onAnswer={(a, b) => { setPhase("show"); setTimeout(() => next(a, b), 1400); }}
          explain={<p className="center" style={{ fontWeight: 800 }}>You can see {shown}. Count on from {shown} to {total}: {Array.from({ length: hidden }, (_, k) => shown + k + 1).join(", ")}. How many numbers did you say?</p>}
        />
      )}
    </div>
  );
}

/* ---------- Army story: some come, or some go away ---------- */
function ArmyGame({ item, op, rounds, onDone }: { item: Item; op: "add" | "take"; rounds: [number, number][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [a, b] = rounds[i];
  const answer = op === "add" ? a + b : a - b;
  const [phase, setPhase] = useState<"start" | "change" | "ask">("start");
  useEffect(() => { setPhase("start"); say(P.thereAre(a, item)); }, [i, a, item]);
  const go = () => {
    setPhase("change");
    sfx.whoosh();
    say(op === "add" ? P.moreCome : P.someGo);
    setTimeout(() => setPhase("ask"), 1600);
  };
  const n = op === "add" ? a + b : a;
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">
        {phase === "start" ? <><span style={{ color: "#f28c28" }}>{a}</span> {noun(item, a)}.</> : op === "add" ? <>{a} {noun(item, a)}. <span style={{ color: "#2e9d5b" }}>{b} more</span> come!</> : <>{a} {noun(item, a)}. <span style={{ color: "#d64545" }}>{b}</span> go away!</>}
      </p>
      <div className="stage" style={{ flexWrap: "wrap", gap: 8, padding: 14, minHeight: 130 }}>
        {Array.from({ length: n }, (_, k) => {
          const isNew = op === "add" && k >= a;
          const leaving = op === "take" && k >= a - b;
          if (isNew && phase === "start") return null;
          return (
            <div key={k} className={isNew ? "march-in" : leaving && phase !== "start" ? "march-out" : ""} style={{ animationDelay: `${Math.max(0, k - a) * 0.15}s` }}>
              <ItemArt item={item} size={46} />
            </div>
          );
        })}
      </div>
      {phase === "start" && <div className="center" style={{ marginTop: 12 }}><button className="btn" onClick={go}>{op === "add" ? "Here they come!" : "What happens?"}</button></div>}
      {phase === "ask" && (
        <>
          <p className="center" style={{ fontWeight: 800, fontSize: 20 }}>{op === "add" ? "How many now?" : "How many are left?"}</p>
          <NumberChoices
            key={i}
            answer={answer}
            seed={i + 41}
            onAnswer={next}
            explain={<p className="center" style={{ fontWeight: 800 }}>{op === "add" ? `Start at ${a}. Count on ${b} more: ${Array.from({ length: b }, (_, k) => a + k + 1).join(", ")}.` : `${a} take away ${b}. Count the ones still here!`}</p>}
          />
        </>
      )}
    </div>
  );
}

/* ---------- Battle cards: which number is bigger? ---------- */
function CardsGame({ rounds, onDone }: { rounds: [number, number][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [a, b] = rounds[i];
  const win = a > b ? 0 : 1;
  const [picked, setPicked] = useState<number | null>(null);
  const [missed, setMissed] = useState(false);
  useEffect(() => { setPicked(null); setMissed(false); say(P.biggerWins); }, [i]);
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const Card = ({ n, side, who }: { n: number; side: number; who: string }) => {
    const state = picked === side ? (side === win ? "right" : "wrong") : "";
    return (
      <button
        className={`battlecard ${state} ${side === 0 ? "ram" : "ravan"}`}
        onClick={() => {
          if (picked === win) return;
          setPicked(side);
          if (side === win) { sfx.right(); setTimeout(() => sayNumber(n), 250); setTimeout(() => next(!missed, missed), 1600); }
          else { sfx.wrong(); setMissed(true); }
        }}
      >
        <span className="who">{who}</span>
        <span className="num">{n}</span>
        {state && <span className="mark">{state === "right" ? "✓" : "✗"}</span>}
      </button>
    );
  };
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Tap the BIGGER number!</p>
      <div className="row" style={{ alignItems: "stretch", gap: 14 }}>
        <Card n={a} side={0} who="Ram's army" />
        <Card n={b} side={1} who="Ravan's army" />
      </div>
      {picked === win && <p className="big center pop" style={{ color: "#2e9d5b" }}>{hi} is bigger than {lo}!</p>}
      {picked !== null && picked !== win && (
        <div className="explain fade-in">
          <div className="explain-title">Count up and see</div>
          <div className="row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
            {Array.from({ length: hi - lo + 1 }, (_, k) => lo + k).map((n) => (
              <span key={n} className="pill" style={{ background: n === lo ? "#fde3c8" : n === hi ? "#2e9d5b" : undefined, color: n === hi ? "white" : undefined }}>{n}</span>
            ))}
          </div>
          <p className="center" style={{ fontWeight: 800 }}>{hi} comes AFTER {lo}, so {hi} is bigger.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Size order: Hanuman grows! ---------- */
function SizeGame({ rounds, onDone }: { rounds: number[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const count = rounds[i];
  const sizes = useMemo(() => shuffle(Array.from({ length: count }, (_, k) => k), i + 5), [count, i]);
  const [done, setDone] = useState<number[]>([]);
  const [bad, setBad] = useState<number | null>(null);
  const [missed, setMissed] = useState(false);
  useEffect(() => { setDone([]); setBad(null); setMissed(false); say(P.smallToBig); }, [i]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Tap from SMALLEST to BIGGEST!</p>
      <div className="stage" style={{ alignItems: "flex-end", gap: 6, padding: "14px 6px", minHeight: 200 }}>
        {sizes.map((s, k) => {
          const step = done.indexOf(s);
          return (
            <button
              key={k}
              className={bad === s ? "shake" : ""}
              onClick={() => {
                if (step >= 0 || done.length === count) return;
                if (s === done.length) {
                  const d = [...done, s];
                  setDone(d); sfx.tap(); sayNumber(d.length);
                  if (d.length === count) { sfx.right(); setTimeout(() => next(!missed, missed), 1400); }
                } else { sfx.wrong(); setBad(s); setMissed(true); setTimeout(() => setBad(null), 600); }
              }}
              style={{ position: "relative", border: 0, background: bad === s ? "#fde0e0" : step >= 0 ? "#e2f5e9" : "none", borderRadius: 16, padding: 2, cursor: "pointer" }}
            >
              <HanumanArt size={44 + s * (count > 3 ? 18 : 26)} />
              {step >= 0 && <span className="pop" style={{ position: "absolute", top: 0, right: 0, background: "#2e9d5b", color: "white", borderRadius: 999, width: 26, height: 26, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{step + 1}</span>}
            </button>
          );
        })}
      </div>
      {done.length === count && <p className="big center pop" style={{ color: "#2e9d5b" }}>Small, bigger, BIGGEST!</p>}
    </div>
  );
}

export { HopGame, ShieldGame, ArmyGame, CardsGame, SizeGame };
