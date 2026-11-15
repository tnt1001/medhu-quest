"use client";
import { useEffect, useMemo, useState } from "react";
import { ItemArt, ShapeArt, Mooshak } from "@/components/Art";
import type { Game, Item, ShapeName } from "@/content/quests";
import { CHECK_ITEMS } from "@/content/skills";
import { say, sayNumber, sfx } from "@/lib/audio";
import { P } from "@/lib/phrases";
import { NumberChoices, Progress, Scattered, emptyResult, merge, scatter, shuffle, type Result } from "./common";
import { ConserveDemo, CountDemo, MatchDemo, PatternDemo, ShapeDemo } from "@/components/Learn";
import Companion from "@/components/Companion";

type Done = (r: Result) => void;

// Runs a list of rounds; each round reports (firstTry, recovered).
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

/* Count and Tell: tap each item to count it, then say how many. */
function CountGame({ item, rounds, onDone }: { item: Item; rounds: number[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const [tapped, setTapped] = useState<number[]>([]);
  useEffect(() => setTapped([]), [i]);
  const pts = useMemo(() => scatter(n, i + 11), [n, i]);
  const allCounted = tapped.length === n;
  useEffect(() => { if (i === 0) say(P.tapToCount); }, [i]);
  useEffect(() => { if (allCounted) setTimeout(() => say(P.howManyModaks), 900); }, [allCounted]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="panel-text center">{allCounted ? "So... how many modaks?" : "Tap each one to count it!"}</p>
      <div className="stage" style={{ padding: 0 }}>
        <div style={{ position: "relative", width: "100%", height: "var(--stage-h)" }}>
          {pts.map((p, k) => {
            const idx = tapped.indexOf(k);
            return (
              <button
                key={k}
                onClick={() => {
                  if (idx >= 0) return;
                  const c = tapped.length + 1;
                  setTapped([...tapped, k]);
                  sfx.tap();
                  sayNumber(c);
                }}
                style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", border: 0, background: "none", padding: 0, opacity: idx >= 0 ? 0.55 : 1, cursor: "pointer" }}
              >
                <ItemArt item={item} size={54} />
                {idx >= 0 && <span className="pop" style={{ position: "absolute", top: -6, right: -6, background: "#f28c28", color: "white", borderRadius: 999, width: 26, height: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{idx + 1}</span>}
              </button>
            );
          })}
        </div>
      </div>
      {allCounted && <NumberChoices key={i} answer={n} seed={i + 3} onAnswer={next} explain={<CountDemo item={item} n={n} k={i} />} />}
    </div>
  );
}

/* Flash! Show for 2 seconds, then hide and ask. */
function FivesFrame({ n, item, small = false }: { n: number; item: Item; small?: boolean }) {
  const cell = small ? "min(40px, 10vw)" : "min(56px, 14vw)";
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(5, ${cell})`, gap: 6, padding: 8, background: "#f6e3c4", borderRadius: 14 }}>
      {Array.from({ length: 5 }, (_, k) => (
        <div key={k} style={{ width: cell, height: cell, borderRadius: 10, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {k < n && <ItemArt item={item} size={small ? 26 : 36} />}
        </div>
      ))}
    </div>
  );
}

const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

function Dice({ n, size = 170 }: { n: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label={`dice ${n}`}>
      <rect x="4" y="4" width="92" height="92" rx="16" fill="white" stroke="#2b2118" strokeWidth="3" />
      {(DICE[n] || []).map(([x, y], k) => <circle key={k} cx={x} cy={y} r="9" fill="#d64545" />)}
    </svg>
  );
}

function FlashGame({ item, layout, rounds, onDone }: { item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [phase, setPhase] = useState<"ready" | "show" | "ask">("ready");
  useEffect(() => setPhase("ready"), [i]);
  const n = rounds[i];
  const go = () => {
    setPhase("show");
    sfx.whoosh();
    setTimeout(() => { setPhase("ask"); sfx.pop(); say(P.howManySaw); }, 2000);
  };
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <div className="stage">
        {phase === "ready" && <button className="btn" onClick={go}>Look!</button>}
        {phase === "show" && (layout === "dice" ? <Dice n={n} /> : layout === "frame5" ? <FivesFrame n={n} item={item} /> : <Scattered n={n} item={item} seed={i * 5 + n} />)}
        {phase === "ask" && <p className="big center">How many did you see?</p>}
      </div>
      {phase === "ask" && (
        <>
          <NumberChoices key={i} answer={n} seed={i + 5} onAnswer={next} explain={<CountDemo item={item} n={n} k={i + 50} />} />
          <div className="center" style={{ marginTop: 10 }}>
            <button className="btn ghost small" onClick={go}>See again</button>
          </div>
        </>
      )}
    </div>
  );
}

/* Modak Shop: put exactly N on the plate. */
function GiveNGame({ item, rounds, onDone, guided }: { item: Item; rounds: number[]; onDone: Done; guided?: boolean }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const [plate, setPlate] = useState(0);
  const [missed, setMissed] = useState(false);
  const [state, setState] = useState<"play" | "right" | "wrong">("play");
  useEffect(() => { setPlate(0); setMissed(false); setState("play"); }, [i]);
  useEffect(() => { say(P.giveN(n)); }, [n, i]);
  const pile = 12 - plate;
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">&quot;I want <span style={{ color: "#f28c28" }}>{n}</span> modaks, please!&quot;</p>
      <div className="stage" style={{ minHeight: 0, padding: 10, gap: 4 }}>
        {Array.from({ length: pile }, (_, k) => (
          <button key={k} onClick={() => { if (state !== "right") { sfx.drop(); setPlate(plate + 1); } }} style={{ border: 0, background: "none", padding: 0, cursor: "pointer" }}>
            <ItemArt item={item} size={40} />
          </button>
        ))}
      </div>
      <p className="center muted" style={{ margin: "6px 0 4px", fontWeight: 700, fontSize: 14 }}>{guided ? <>On the plate: <b style={{ color: "#f28c28", fontSize: 18 }}>{plate}</b> - stop at {n}!</> : "Plate (tap to put back)"}</p>
      <div className="stage" style={{ minHeight: 76, padding: 8, gap: 4, borderRadius: 999, background: "#fdf2e2", borderColor: state === "right" ? "#2e9d5b" : state === "wrong" ? "#d64545" : undefined }}>
        {Array.from({ length: plate }, (_, k) => (
          <button key={k} onClick={() => { if (state !== "right") { sfx.pop(); setPlate(plate - 1); } }} style={{ border: 0, background: "none", padding: 0, cursor: "pointer" }}>
            <ItemArt item={item} size={40} />
          </button>
        ))}
      </div>
      <div className="center" style={{ marginTop: 10 }}>
        {state === "right" ? (
          <p className="big pop" style={{ color: "#2e9d5b" }}>✓ Exactly {n}!</p>
        ) : (
          <button
            className="btn"
            onClick={() => {
              if (plate === n) {
                setState("right");
                sfx.right();
                say(P.exactly(n));
                setTimeout(() => next(!missed, missed), 1300);
              } else {
                setState("wrong");
                setMissed(true);
                sfx.wrong();
                say(plate > n ? P.tooMany : P.notEnough);
                setTimeout(() => setState("play"), 900);
              }
            }}
          >
            Give
          </button>
        )}
        {state === "wrong" && <p className="muted" style={{ fontWeight: 700 }}>{plate > n ? "Too many! Take some back." : "Too few! Add more."}</p>}
      </div>
    </div>
  );
}

/* Wobbly Web: count a row, the web shakes, how many now? */
function ConserveGame({ item, rounds, onDone }: { item: Item; rounds: number[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const [phase, setPhase] = useState<"row" | "shake" | "ask">("row");
  useEffect(() => setPhase("row"), [i]);
  const pts = useMemo(() => scatter(n, i * 13 + 2), [n, i]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="panel-text center">{phase === "row" ? `Count them: there are ${n}.` : phase === "shake" ? "Whoosh! The wind blows!" : "How many now?"}</p>
      <div className="stage" style={{ padding: 0 }}>
        <div style={{ position: "relative", width: "100%", height: "var(--stage-h)" }}>
          {Array.from({ length: n }, (_, k) => {
            const rowX = 50 + (k - (n - 1) / 2) * (80 / Math.max(n, 1));
            const p = phase === "row" ? { x: rowX, y: 50 } : pts[k];
            return (
              <div key={k} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", transition: "all .9s cubic-bezier(.3,1.6,.5,1)" }}>
                <ItemArt item={item} size={44} />
              </div>
            );
          })}
        </div>
      </div>
      {phase === "row" && (
        <div className="center" style={{ marginTop: 14 }}>
          <button className="btn" onClick={() => { setPhase("shake"); sfx.whoosh(); say(P.shakeWeb); setTimeout(() => setPhase("ask"), 1200); }}>Make wind!</button>
        </div>
      )}
      {phase === "ask" && <NumberChoices key={i} answer={n} seed={i + 9} onAnswer={next} explain={<ConserveDemo item={item} n={n} k={i} />} />}
    </div>
  );
}

/* More or Less: tap the plate with more. */
function CompareGame({ item, rounds, onDone, ask = "more" }: { item: Item; rounds: [number, number][]; onDone: Done; ask?: "more" | "less" }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const [a, b] = rounds[i];
  const [picked, setPicked] = useState<number | null>(null);
  const [missed, setMissed] = useState(false);
  useEffect(() => { setPicked(null); setMissed(false); }, [i]);
  const less = ask === "less";
  const answer = less ? (a < b ? 0 : 1) : (a > b ? 0 : 1);
  const target = less ? Math.min(a, b) : Math.max(a, b);
  useEffect(() => { say(less ? P.whichLess : P.whichMore); }, [i, less]);
  const Plate = ({ n, side }: { n: number; side: number }) => {
    // Sometimes the smaller group is spread out wide, to make it tricky.
    const wide = n < Math.max(a, b) && i % 2 === 1;
    const state = picked === side ? (side === answer ? "right" : "wrong") : "";
    return (
      <button
        onClick={() => {
          if (picked === answer) return;
          setPicked(side);
          if (side === answer) {
            sfx.right();
            setTimeout(() => sayNumber(target), 250);
            setTimeout(() => next(!missed, missed), 1600);
          } else { sfx.wrong(); say(P.countAgain); setMissed(true); }
        }}
        className={`plate ${state}`}
        style={{ gap: wide ? 18 : 2 }}
      >
        {state && <span className="mark">{state === "right" ? "✓" : "✗"}</span>}
        {Array.from({ length: n }, (_, k) => <ItemArt key={k} item={item} size={wide ? 36 : 34} />)}
      </button>
    );
  };
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Which plate has {less ? "LESS" : "MORE"}?</p>
      <div className="row" style={{ alignItems: "stretch" }}>
        <Plate n={a} side={0} />
        <Plate n={b} side={1} />
      </div>
      {picked === answer && <p className="big center pop" style={{ color: "#2e9d5b" }}>Yes! {target} is {less ? "less" : "more"}.</p>}
      {picked !== null && picked !== answer && (
        <div className="explain fade-in"><div className="explain-title">Let&apos;s pair them up</div><MatchDemo item={item} a={a} b={b} k={i} /></div>
      )}
    </div>
  );
}

/* Find the Plate: three plates, tap the one with N. */
function PlateArt({ n, item, layout }: { n: number; item: Item; layout: "scatter" | "dice" | "frame5" }) {
  if (layout === "dice") return <Dice n={n} size={92} />;
  if (layout === "frame5") return <FivesFrame n={n} item={item} small />;
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", maxWidth: 110 }}>{Array.from({ length: n }, (_, k) => <ItemArt key={k} item={item} size={26} />)}</div>;
}

function PickGame({ item, layout, rounds, onDone }: { item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const n = rounds[i];
  const max = layout === "dice" ? 6 : layout === "frame5" ? 5 : 10;
  const opts = useMemo(() => {
    const others = shuffle([n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= max), i + 3).slice(0, 2);
    return shuffle([n, ...others], i + 9);
  }, [n, i, max]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => { setWrong([]); setDone(false); say(P.findPlate(n)); }, [i, n]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Find the plate with <span style={{ color: "#f28c28" }}>{n}</span></p>
      <div style={{ display: "grid", gap: 10 }}>
        {opts.map((c) => {
          const state = done && c === n ? "right" : wrong.includes(c) ? "wrong" : "";
          return (
            <button
              key={c}
              className={`plate ${state}`}
              style={{ minHeight: 0, padding: 12 }}
              onClick={() => {
                if (done) return;
                if (c === n) { setDone(true); sfx.right(); setTimeout(() => sayNumber(n), 250); setTimeout(() => next(wrong.length === 0, wrong.length > 0), 1500); }
                else { sfx.wrong(); setWrong([...wrong, c]); }
              }}
            >
              {state && <span className="mark">{state === "right" ? "✓" : "✗"}</span>}
              <PlateArt n={c} item={item} layout={layout} />
              {wrong.includes(c) && <span className="plate-note">This one has {c}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Pattern Garland: what comes next? */
const COLORS: Record<string, string> = { red: "#d64545", blue: "#2f6fd6", yellow: "#f2c230", green: "#2e9d5b" };
function PatternGame({ rounds, onDone }: { rounds: string[][]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const seq = rounds[i];
  const unit = (() => {
    for (let len = 1; len <= seq.length; len++) {
      if (seq.every((c, k) => c === seq[k % len])) return seq.slice(0, len);
    }
    return seq;
  })();
  const answer = unit[seq.length % unit.length];
  const opts = useMemo(() => shuffle(Array.from(new Set([answer, ...Object.keys(COLORS)])).slice(0, 3), i + 4), [answer, i]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => { setWrong([]); setDone(false); say(P.whatNext); }, [i]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">What comes next?</p>
      <div className="stage" style={{ gap: 2, minHeight: 120 }}>
        {seq.map((c, k) => <ItemArt key={k} item="diya" size={48} color={COLORS[c]} />)}
        <div style={{ width: 48, height: 48, border: "3px dashed #c9b79f", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>
          {done ? <ItemArt item="diya" size={44} color={COLORS[answer]} /> : "?"}
        </div>
      </div>
      <div className="choices">
        {opts.map((c) => (
          <button
            key={c}
            className={`choice ${done && c === answer ? "right" : ""} ${wrong.includes(c) ? "wrong" : ""}`}
            onClick={() => {
              if (done) return;
              if (c === answer) {
                setDone(true);
                sfx.right();
                say(P.colorWell(c));
                setTimeout(() => next(wrong.length === 0, wrong.length > 0), 1100);
              } else { sfx.wrong(); setWrong([...wrong, c]); }
            }}
          >
            <ItemArt item="diya" size={48} color={COLORS[c]} />
          </button>
        ))}
      </div>
      {!done && wrong.length > 0 && (
        <div className="explain fade-in"><div className="explain-title">Find the part that repeats</div><PatternDemo seq={seq} k={i} /></div>
      )}
    </div>
  );
}

/* Shape Quest: tap all the targets. */
const SHAPES: ShapeName[] = ["circle", "triangle", "square", "rectangle"];
function ShapesGame({ rounds, onDone }: { rounds: ShapeName[]; onDone: Done }) {
  const { i, next } = useRounds(rounds.length, onDone);
  const target = rounds[i];
  const board = useMemo(() => {
    const others = SHAPES.filter((s) => s !== target);
    const arr: ShapeName[] = [target, target, target, others[0], others[1], others[2], others[0], others[1], others[2]];
    return shuffle(arr, i * 3 + 1).map((s, k) => ({ s, color: Object.values(COLORS)[(k + i) % 4] }));
  }, [target, i]);
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);
  useEffect(() => { setFound([]); setMisses(0); }, [i]);
  useEffect(() => { say(P.findShapes(target)); }, [target]);
  return (
    <div className="fade-in" key={i}>
      <Progress total={rounds.length} at={i} />
      <p className="big center">Tap all the <span style={{ color: "#f28c28" }}>{target}s</span>!</p>
      <p className="center muted" style={{ fontWeight: 700 }}>{found.length} of 3 found</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {board.map(({ s, color }, k) => (
          <button
            key={k}
            className="card"
            style={{ display: "flex", justifyContent: "center", padding: 10, cursor: "pointer", borderColor: found.includes(k) ? "#2e9d5b" : flash === k ? "#d64545" : undefined, opacity: found.includes(k) ? 0.5 : 1 }}
            onClick={() => {
              if (found.includes(k)) return;
              if (s === target) {
                const f = [...found, k];
                sfx.right();
                setFound(f);
                if (f.length === 3) {
                  say(P.foundAll);
                  setTimeout(() => next(misses === 0, misses > 0), 900);
                }
              } else {
                sfx.wrong();
                setMisses(misses + 1);
                setFlash(k);
                setTimeout(() => setFlash(null), 500);
              }
            }}
          >
            <ShapeArt shape={s} size={64} color={color} />
          </button>
        ))}
      </div>
      {misses > 0 && found.length < 3 && (
        <div className="explain fade-in"><div className="explain-title">This is a {target}</div><ShapeDemo shape={target} k={misses} /></div>
      )}
    </div>
  );
}

/* Helper Test: Papa runs check items with real objects; scores go in the admin. */
function CheckGame({ items, onDone }: { items: number[]; onDone: Done }) {
  return (
    <div className="fade-in">
      <div className="card">
        <p className="title">For Papa: run these with real objects</p>
        <p className="muted">Score each 0 (can&apos;t), 1 (with help or slow count from 1), 2 (alone and quick). Enter scores in Admin, Checks.</p>
        <ol style={{ fontSize: 17, lineHeight: 1.5, paddingLeft: 20 }}>
          {items.map((n) => {
            const it = CHECK_ITEMS.find((c) => c.n === n)!;
            return <li key={n} value={n}>{it.item}</li>;
          })}
        </ol>
      </div>
      <div className="center" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => onDone({ tries: 0, correct: 0, triedAgain: false })}>Done!</button>
      </div>
    </div>
  );
}

const HINTS: Record<string, string> = {
  count: "Touch each one once and count. The last number is the answer!",
  flash: "Don't count - look at the shape they make!",
  giveN: "Move one at a time and count. Stop at the number!",
  conserve: "Remember the row. Did anyone add or take away?",
  compare: "Look carefully, or pair them up!",
  pick: "Count each plate, or use your super eyes!",
  pattern: "Say the colours like a song. What comes next?",
  shapes: "Count the corners to check!",
};

export function GamePlayer({ game, onDone, guided = false, companion = true }: { game: Game; onDone: Done; guided?: boolean; companion?: boolean }) {
  const [part, setPart] = useState(0);
  const [acc, setAcc] = useState<Result>(emptyResult());
  const hint = guided ? HINTS[game.type === "mixed" ? game.parts[part].type : game.type] : undefined;
  let body: React.ReactNode = null;
  if (game.type === "mixed") {
    const g = game.parts[part];
    body = (
      <div key={part}>
        <p className="center" style={{ margin: "2px 0" }}><span className="pill">Game {part + 1} of {game.parts.length}</span></p>
        <GamePlayer
          game={g}
          companion={false}
          onDone={(r) => {
            const total = merge(acc, r);
            setAcc(total);
            if (part + 1 >= game.parts.length) onDone(total);
            else setPart(part + 1);
          }}
        />
      </div>
    );
  } else {
    switch (game.type) {
      case "count": body = <CountGame item={game.item} rounds={game.rounds} onDone={onDone} />; break;
      case "flash": body = <FlashGame item={game.item} layout={game.layout} rounds={game.rounds} onDone={onDone} />; break;
      case "giveN": body = <GiveNGame item={game.item} rounds={game.rounds} onDone={onDone} guided={guided} />; break;
      case "conserve": body = <ConserveGame item={game.item} rounds={game.rounds} onDone={onDone} />; break;
      case "compare": body = <CompareGame item={game.item} rounds={game.rounds} ask={game.ask} onDone={onDone} />; break;
      case "pick": body = <PickGame item={game.item} layout={game.layout} rounds={game.rounds} onDone={onDone} />; break;
      case "pattern": body = <PatternGame rounds={game.rounds} onDone={onDone} />; break;
      case "shapes": body = <ShapesGame rounds={game.rounds} onDone={onDone} />; break;
      case "check": body = <CheckGame items={game.items} onDone={onDone} />; break;
    }
  }
  return (
    <div>
      {guided && hint && <div className="hintbar">💡 {hint}</div>}
      {body}
      {companion && game.type !== "check" && <Companion hint={guided ? "Let's do it together!" : undefined} />}
    </div>
  );
}

// First round only (for "Try it with me") and the rest (for "You do it").
export function sliceGame(game: Game, from: number, to?: number): Game | null {
  if (game.type === "check") return from === 0 ? game : null;
  if (game.type === "mixed") return from === 0 && to === undefined ? game : from === 0 ? sliceGame(game.parts[0], 0, to) : game;
  const rounds = (game.rounds as unknown[]).slice(from, to);
  if (rounds.length === 0) return null;
  return { ...game, rounds } as Game;
}

/* Mooshak's Mistake: is Mooshak right? */
export function MistakeRound({ item, shown, claim, onDone }: { item: Item; shown: number; claim: number; onDone: (fixed: boolean) => void }) {
  const [phase, setPhase] = useState<"judge" | "fix" | "done">("judge");
  const [fixedFirst, setFixedFirst] = useState(true);
  useEffect(() => { say(P.mooshakClaim(claim), "mooshak"); }, [claim]);
  return (
    <div className="fade-in">
      <div className="row" style={{ justifyContent: "center" }}>
        <Mooshak size={84} mood="confused" />
        <div className="card" style={{ fontSize: 20, fontWeight: 700 }}>&quot;I count <b>{claim}</b>!&quot;</div>
      </div>
      <div className="stage" style={{ marginTop: 12 }}>
        <Scattered n={shown} item={item} seed={shown * 3 + 1} size={46} />
      </div>
      {phase === "judge" && (
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => { setFixedFirst(false); sfx.wrong(); say(P.mooshakHmm, "mooshak"); }}>Right ✓</button>
          <button className="btn" style={{ flex: 1 }} onClick={() => setPhase("fix")}>Wrong ✗</button>
        </div>
      )}
      {phase === "fix" && (
        <>
          <p className="big center">How many?</p>
          <NumberChoices answer={shown} seed={shown + 21} explain={<CountDemo item={item} n={shown} k={shown} />} onAnswer={() => { setPhase("done"); say(P.mooshakThanks, "mooshak"); setTimeout(() => onDone(fixedFirst), 1500); }} />
        </>
      )}
      {phase === "done" && <p className="big center pop">Mooshak says: &quot;Thank you, Medhu!&quot;</p>}
    </div>
  );
}

export function EasyWin({ item, n, onDone }: { item: Item; n: number; onDone: () => void }) {
  useEffect(() => { say(P.easyOne); }, []);
  return (
    <div className="fade-in">
      <p className="big center">Last one!</p>
      <div className="stage">
        <Scattered n={n} item={item} seed={n + 40} />
      </div>
      <NumberChoices answer={n} seed={n + 2} explain={<CountDemo item={item} n={n} k={n} />} onAnswer={() => onDone()} />
    </div>
  );
}
