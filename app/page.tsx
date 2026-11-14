"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemArt } from "@/components/Art";
import { GaneshaArt, MooshakArt, WebArt } from "@/components/Cast";
import MuteToggle from "@/components/MuteToggle";
import { ARCS, QUESTS, STARS_PER_CARD } from "@/content/quests";

const STRAND_COLOR: Record<string, string> = { C: "#f28c28", S: "#2f6fd6", R: "#8e44ad", P: "#2e9d5b", O: "#d64545", G: "#00838f", M: "#c2185b" };

export default function Home() {
  const [state, setState] = useState<{ stars: number; completed: number[] } | null>(null);
  useEffect(() => {
    fetch("/api/state").then((r) => r.json()).then(setState).catch(() => setState({ stars: 0, completed: [] }));
  }, []);
  const done = new Set(state?.completed ?? []);
  const nextDay = QUESTS.find((q) => !done.has(q.day))?.day ?? null;
  const arc = ARCS[0];
  const stars = state?.stars ?? 0;
  const toCard = STARS_PER_CARD - (stars % STARS_PER_CARD);
  const pct = Math.round((done.size / QUESTS.length) * 100);

  return (
    <main className="wrap">
      <div className="row spread">
        <div className="row" style={{ gap: 6 }}>
          <MooshakArt size={46} />
          <div>
            <h1 className="title" style={{ fontSize: 20 }}>Medhu&apos;s Quest</h1>
            <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Learn maths with Mooshak</div>
          </div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <MuteToggle compact />
          <Link href="/cards" className="pill row" style={{ gap: 4, textDecoration: "none", fontSize: 16, padding: "4px 10px" }}>
            <ItemArt item="star" size={22} /><b>{stars}</b>
          </Link>
        </div>
      </div>

      <div className="arc-hero">
        <div style={{ position: "absolute", right: -6, bottom: -6 }}><GaneshaArt size={118} /></div>
        <div style={{ position: "absolute", right: 96, top: -18, opacity: 0.55 }}><WebArt size={90} /></div>
        <div style={{ position: "relative", maxWidth: "62%" }}>
          <div className="eyebrow" style={{ color: "#fff3dd" }}>Arc {arc.id} · {arc.costars}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "white", lineHeight: 1.1, margin: "4px 0 10px" }}>{arc.title}</div>
          <div style={{ height: 10, background: "rgba(255,255,255,.35)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "white" }} />
          </div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 800, color: "#fff3dd" }}>{done.size} of {QUESTS.length} quests · {toCard} ★ to next hero card</div>
        </div>
      </div>

      {nextDay && (
        <Link href={`/quest/${nextDay}`} className="today-card" style={{ textDecoration: "none" }}>
          <div>
            <div className="eyebrow">Today&apos;s quest</div>
            <div style={{ fontWeight: 900, fontSize: 19 }}>{QUESTS.find((q) => q.day === nextDay)?.title}</div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>Win: {QUESTS.find((q) => q.day === nextDay)?.power.name}</div>
          </div>
          <span className="btn small" style={{ pointerEvents: "none" }}>Play ▶</span>
        </Link>
      )}

      <div className="eyebrow" style={{ margin: "18px 0 8px" }}>Your learning path</div>
      <div className="path">
        {QUESTS.map((q, k) => {
          const isDone = done.has(q.day);
          const isNext = q.day === nextDay;
          const strand = q.skill[0];
          const side = k % 2 === 0 ? "left" : "right";
          return (
            <Link key={q.day} href={`/quest/${q.day}`} className={`node ${side} ${isDone ? "done" : ""} ${isNext ? "next" : ""}`} style={{ textDecoration: "none" }}>
              <div className="node-circle" style={{ background: isDone ? "#2e9d5b" : isNext ? STRAND_COLOR[strand] : "white", borderColor: isDone ? "#1f7a43" : isNext ? "white" : "#eadfcf" }}>
                {isDone ? <span style={{ fontSize: 26 }}>✓</span> : <span style={{ fontSize: q.day > 9 ? 20 : 24 }}>{q.day}</span>}
              </div>
              <div className="node-text">
                <div style={{ fontWeight: 900, fontSize: 15, color: isDone || isNext ? "#2b2118" : "#7a6a5a" }}>{q.title}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: STRAND_COLOR[strand] }}>
                  {q.power.name}
                </div>
              </div>
            </Link>
          );
        })}
        <div className="node trophy">
          <div className="node-circle" style={{ background: "#f2c230", borderColor: "white" }}><ItemArt item="modak" size={34} color="#fff3c4" /></div>
          <div className="node-text"><div style={{ fontWeight: 900 }}>Trophy: {arc.trophy}</div><div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>Finish all {QUESTS.length} quests</div></div>
        </div>
      </div>

      <div className="row" style={{ justifyContent: "space-between", marginTop: 24 }}>
        <Link href="/cards" className="btn ghost small" style={{ textDecoration: "none" }}>My powers & cards</Link>
        <Link href="/admin" className="muted" style={{ fontSize: 13 }}>Papa&apos;s admin</Link>
      </div>
    </main>
  );
}
