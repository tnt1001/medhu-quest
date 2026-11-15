"use client";
import { useEffect, useState } from "react";
import { ItemArt, ShapeArt } from "@/components/Art";
import { SceneView } from "@/components/Scene";
import type { Demo, Item } from "@/content/quests";
import { ENGLISH, HINDI, HINDI_DEV } from "@/content/skills";
import { sfx } from "@/lib/audio";

// Ticks from 0 upward every `ms`, restarting whenever `key` changes.
function useTicker(max: number, ms: number, key: unknown) {
  const [t, setT] = useState(0);
  useEffect(() => {
    setT(0);
    const id = setInterval(() => setT((x) => { if (x >= max) return x; sfx.pop(); return x + 1; }), ms);
    return () => clearInterval(id);
  }, [max, ms, key]);
  return t;
}

const Badge = ({ n, on = true }: { n: number; on?: boolean }) => (
  <span className="pop" style={{ position: "absolute", top: -10, right: -8, background: on ? "#f28c28" : "#c9b79f", color: "white", borderRadius: 999, minWidth: 26, height: 26, padding: "0 6px", fontWeight: 900, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 0 rgba(0,0,0,.15)" }}>{n}</span>
);

const BigNum = ({ n, label }: { n: number; label?: string }) => (
  <div className="pop center" style={{ marginTop: 6 }}>
    <div style={{ fontSize: 54, fontWeight: 900, color: "#f28c28", lineHeight: 1 }}>{n}</div>
    <div className="numword">{label ?? `${ENGLISH[n]} · ${HINDI[n]} · ${HINDI_DEV[n]}`}</div>
  </div>
);

export function CountDemo({ item, n, k }: { item: Item; n: number; k: number }) {
  const t = useTicker(n + 1, 850, k);
  return (
    <div>
      <div className="row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 10, minHeight: 80 }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} style={{ position: "relative", transform: i < t ? "translateY(-6px)" : "none", transition: "transform .3s", opacity: i < t ? 1 : 0.55 }}>
            <ItemArt item={item} size={50} />
            {i < t && <Badge n={i + 1} on={i === n - 1} />}
          </div>
        ))}
      </div>
      {t > n - 1 ? <BigNum n={n} label={`Last number ${n} hai. Toh ${n} hain!`} /> : <div style={{ height: 82 }} />}
    </div>
  );
}

const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]], 6: [[28, 22], [72, 22], [28, 50], [72, 50], [28, 78], [72, 78]],
};

export function GlanceDemo({ item, n, k }: { item: Item; n: number; k: number }) {
  const t = useTicker(2, 1100, k);
  const pts = DICE[n] ?? DICE[1];
  return (
    <div className="center">
      <div style={{ position: "relative", width: 190, height: 190, margin: "0 auto", borderRadius: "50%", border: t >= 1 ? "4px dashed #f28c28" : "4px dashed transparent", transition: "border-color .4s", background: "#fff" }}>
        {pts.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}><ItemArt item={item} size={46} /></div>
        ))}
      </div>
      {t >= 2 ? <BigNum n={n} label={`Ek nazar: ${n}!`} /> : <div style={{ height: 82 }} />}
    </div>
  );
}

export function GiveNDemo({ item, n, pile, k }: { item: Item; n: number; pile: number; k: number }) {
  const t = useTicker(n + 1, 900, k);
  const moved = Math.min(t, n);
  return (
    <div>
      <div className="row" style={{ alignItems: "stretch", gap: 10 }}>
        <div className="card" style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center", alignContent: "center", padding: 8, minHeight: 120 }}>
          {Array.from({ length: pile - moved }, (_, i) => <ItemArt key={i} item={item} size={30} />)}
        </div>
        <div style={{ alignSelf: "center", fontSize: 28, color: "#c96a10", fontWeight: 900 }}>→</div>
        <div className="card" style={{ flex: 1.3, display: "flex", flexWrap: "wrap", gap: "16px 12px", justifyContent: "center", alignContent: "center", padding: "16px 10px 10px", minHeight: 120, borderRadius: 28, background: "#fdf2e2" }}>
          {Array.from({ length: moved }, (_, i) => <div key={i} className="pop" style={{ position: "relative" }}><ItemArt item={item} size={30} /><Badge n={i + 1} on={i === n - 1} /></div>)}
        </div>
      </div>
      {t > n ? (
        <div className="pop center" style={{ marginTop: 10 }}>
          <span style={{ display: "inline-block", background: "#d64545", color: "white", fontWeight: 900, fontSize: 26, padding: "8px 22px", borderRadius: 14, border: "4px solid white", boxShadow: "0 0 0 3px #d64545" }}>{n} par RUKO!</span>
        </div>
      ) : <div style={{ height: 62 }} />}
    </div>
  );
}

export function Frame5Demo({ n, k }: { n: number; k: number }) {
  const t = useTicker(5, 350, k);
  return (
    <div className="center">
      <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(5, min(56px, 14vw))", gap: 6, padding: 10, background: "#f6e3c4", borderRadius: 16, border: "3px solid #e2c48f" }}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ width: "min(56px, 14vw)", height: "min(56px, 14vw)", borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", border: i >= n ? "3px dashed #d64545" : "3px solid transparent" }}>
            {i < n && i < t && <div className="pop"><ItemArt item="modak" size={36} /></div>}
          </div>
        ))}
      </div>
      {t >= 5 ? <BigNum n={n} label={n === 5 ? "Bhari tray = 5!" : `${n} bhare, ${5 - n} khaali → ${n}`} /> : <div style={{ height: 82 }} />}
    </div>
  );
}

export function ConserveDemo({ item, n, k }: { item: Item; n: number; k: number }) {
  const t = useTicker(2, 1500, k);
  const spread = t >= 1;
  const pos = (i: number) => {
    const row = { x: 50 + (i - (n - 1) / 2) * 14, y: 50 };
    const sp = [{ x: 12, y: 20 }, { x: 86, y: 28 }, { x: 40, y: 78 }, { x: 70, y: 70 }, { x: 22, y: 64 }, { x: 58, y: 18 }, { x: 88, y: 80 }][i % 7];
    return spread ? sp : row;
  };
  return (
    <div>
      <div style={{ position: "relative", height: 170, background: "white", borderRadius: 18, border: "2px solid var(--line)" }}>
        {Array.from({ length: n }, (_, i) => {
          const p = pos(i);
          return <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)", transition: "all 1s cubic-bezier(.3,1.5,.5,1)" }}><ItemArt item={item} size={40} /></div>;
        })}
      </div>
      {t >= 2 ? <BigNum n={n} label={`Ab bhi ${n}! Na joda, na nikaala.`} /> : <div className="center muted" style={{ height: 82, paddingTop: 20, fontWeight: 800 }}>{spread ? "Whoosh! Bikhar rahe hain..." : `${n} ek line mein`}</div>}
    </div>
  );
}

export function MatchDemo({ item, a, b, k }: { item: Item; a: number; b: number; k: number }) {
  const pairs = Math.min(a, b);
  const t = useTicker(pairs + 1, 700, k);
  const W = 44;
  const width = Math.max(a, b) * W;
  const cell = (cnt: number, row: number) =>
    Array.from({ length: cnt }, (_, i) => {
      const extra = i >= pairs && t > pairs;
      return (
        <div key={`${row}-${i}`} style={{ position: "absolute", left: i * W, top: row === 0 ? 0 : 112, width: W, display: "flex", justifyContent: "center" }}>
          <div className={extra ? "pulse" : ""} style={{ borderRadius: 999, background: extra ? "#fff3c4" : "transparent", padding: 2 }}><ItemArt item={item} size={38} /></div>
        </div>
      );
    });
  return (
    <div className="center">
      <div style={{ position: "relative", width, height: 160, margin: "0 auto", maxWidth: "100%" }}>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={width} height="160" aria-hidden="true">
          {Array.from({ length: Math.min(t, pairs) }, (_, i) => (
            <line key={i} x1={i * W + W / 2} y1="48" x2={i * W + W / 2} y2="110" stroke="#2e9d5b" strokeWidth="4" strokeLinecap="round" />
          ))}
        </svg>
        {cell(a, 0)}
        {cell(b, 1)}
      </div>
      {t > pairs ? <div className="pop" style={{ fontWeight: 900, fontSize: 19, color: "#c96a10", marginTop: 8 }}>{Math.abs(a - b)} extra, toh {a > b ? "upar" : "neeche"} wali line mein ZYADA ({Math.max(a, b)})</div> : <div style={{ height: 33 }} />}
    </div>
  );
}

export function DiceDemo({ n, k }: { n: number; k: number }) {
  const t = useTicker(1, 900, k);
  return (
    <div className="center">
      <div className="pop" key={k} style={{ display: "inline-block" }}>
        <svg width="170" height="170" viewBox="0 0 100 100" aria-label={`dice ${n}`}>
          <rect x="4" y="4" width="92" height="92" rx="18" fill="white" stroke="#2b2118" strokeWidth="3" />
          {(DICE[n] || []).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill="#d64545" />)}
        </svg>
      </div>
      {t >= 1 ? <BigNum n={n} /> : <div style={{ height: 82 }} />}
    </div>
  );
}

const COLORS: Record<string, string> = { red: "#d64545", blue: "#2f6fd6", yellow: "#f2c230", green: "#2e9d5b" };
export function PatternDemo({ seq, k }: { seq: string[]; k: number }) {
  let unit = seq.length;
  for (let len = 1; len <= seq.length; len++) if (seq.every((c, i) => c === seq[i % len])) { unit = len; break; }
  const t = useTicker(seq.length, 450, k);
  return (
    <div className="center">
      <div className="row" style={{ justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
        {seq.map((c, i) => (
          <div key={i} style={{ padding: "8px 2px", background: Math.floor(i / unit) % 2 === 0 ? "#fff1dd" : "#e8f1ff", borderRadius: i % unit === 0 ? "14px 0 0 14px" : i % unit === unit - 1 ? "0 14px 14px 0" : 0, opacity: i < t ? 1 : 0.2, transition: "opacity .3s" }}>
            <ItemArt item="diya" size={44} color={COLORS[c]} />
          </div>
        ))}
      </div>
      <p style={{ fontWeight: 800, color: "#c96a10", fontSize: 18 }}>Repeat hissa: {seq.slice(0, unit).map((c) => ({ red: "laal", blue: "neela", yellow: "peela", green: "hara" } as Record<string, string>)[c] ?? c).join(", ")}</p>
    </div>
  );
}

export function ShapeDemo({ shape, k }: { shape: "circle" | "triangle" | "square" | "rectangle"; k: number }) {
  const corners: Record<string, [number, number][]> = {
    circle: [], triangle: [[32, 6], [59, 56], [5, 56]], square: [[8, 8], [56, 8], [56, 56], [8, 56]], rectangle: [[2, 18], [62, 18], [62, 48], [2, 48]],
  };
  const c = corners[shape];
  const t = useTicker(c.length + 1, 700, k);
  return (
    <div className="center">
      <div style={{ position: "relative", width: 190, height: 190, margin: "0 auto" }}>
        <ShapeArt shape={shape} size={190} color="#2f6fd6" />
        {c.slice(0, t).map(([x, y], i) => (
          <div key={i} className="pop" style={{ position: "absolute", left: `${(x / 64) * 100}%`, top: `${(y / 64) * 100}%`, transform: "translate(-50%,-50%)", width: 30, height: 30, borderRadius: 999, background: "#f2c230", border: "3px solid white", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
        ))}
      </div>
      <p style={{ fontWeight: 900, fontSize: 22, margin: "6px 0 0", textTransform: "capitalize" }}>{shape}</p>
      <p className="muted" style={{ fontWeight: 800, margin: 0 }}>{c.length === 0 ? "Gol, koi kona nahi" : `${c.length} side, ${c.length} kone`}</p>
    </div>
  );
}

export function NumberDemo({ n }: { n: number }) {
  return (
    <div className="center pop">
      <div style={{ fontSize: 110, fontWeight: 900, color: "#f28c28", lineHeight: 1, textShadow: "0 5px 0 #f6d38b" }}>{n}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{ENGLISH[n]}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--muted)" }}>{HINDI[n]} · {HINDI_DEV[n]}</div>
      <div className="row" style={{ justifyContent: "center", gap: 4, marginTop: 8 }}>
        {Array.from({ length: n }, (_, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 999, background: "#f2c230" }} />)}
      </div>
    </div>
  );
}

export function DemoView({ demo, k }: { demo: Demo; k: number }) {
  switch (demo.type) {
    case "count": return <CountDemo item={demo.item} n={demo.n} k={k} />;
    case "glance": return <GlanceDemo item={demo.item} n={demo.n} k={k} />;
    case "giveN": return <GiveNDemo item={demo.item} n={demo.n} pile={demo.pile} k={k} />;
    case "frame5": return <Frame5Demo n={demo.n} k={k} />;
    case "conserve": return <ConserveDemo item={demo.item} n={demo.n} k={k} />;
    case "match": return <MatchDemo item={demo.item} a={demo.a} b={demo.b} k={k} />;
    case "dice": return <DiceDemo n={demo.n} k={k} />;
    case "pattern": return <PatternDemo seq={demo.seq} k={k} />;
    case "shape": return <ShapeDemo shape={demo.shape} k={k} />;
    case "number": return <NumberDemo n={demo.n} />;
    case "scene": return <SceneView scene={demo.scene} />;
  }
}
