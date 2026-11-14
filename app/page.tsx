"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemArt, Mooshak } from "@/components/Art";
import { ARCS, QUESTS, STARS_PER_CARD } from "@/content/quests";

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

  return (
    <main className="wrap">
      <div className="row spread">
        <div className="row" style={{ gap: 8 }}>
          <Mooshak size={52} />
          <div>
            <h1 className="title">Medhu&apos;s Quest</h1>
            <div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>with Mooshak</div>
          </div>
        </div>
        <Link href="/cards" className="card row" style={{ padding: "8px 12px", gap: 6, textDecoration: "none" }}>
          <ItemArt item="star" size={28} />
          <b style={{ fontSize: 22 }}>{stars}</b>
        </Link>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="muted" style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em" }}>Arc {arc.id} - {arc.costars}</div>
        <div className="title" style={{ marginTop: 2 }}>{arc.title}</div>
        <div style={{ height: 12, background: "#f6e3c4", borderRadius: 99, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${(done.size / QUESTS.length) * 100}%`, height: "100%", background: "#f28c28" }} />
        </div>
        <div className="muted" style={{ fontSize: 13, marginTop: 6, fontWeight: 700 }}>{done.size} of {QUESTS.length} quests - {toCard} stars to your next hero card</div>
      </div>

      <div style={{ position: "relative", marginTop: 18 }}>
        {QUESTS.map((q, k) => {
          const isDone = done.has(q.day);
          const isNext = q.day === nextDay;
          const offset = [0, 60, 110, 60][k % 4];
          return (
            <div key={q.day} style={{ marginLeft: offset, marginBottom: 12 }}>
              <Link href={`/quest/${q.day}`} className="row" style={{ textDecoration: "none", gap: 12 }}>
                <div
                  className={isNext ? "pop" : ""}
                  style={{
                    width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                    background: isDone ? "#2e9d5b" : isNext ? "#f28c28" : "white",
                    border: `4px solid ${isDone ? "#1f7a43" : isNext ? "#c96a10" : "#eadfcf"}`,
                    boxShadow: isNext ? "0 0 0 8px rgba(242,140,40,.25)" : "none",
                    color: isDone || isNext ? "white" : "#7a6a5a",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800,
                  }}
                >
                  {q.day}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: isDone || isNext ? "#2b2118" : "#7a6a5a" }}>{q.title}</div>
                  {isNext && <div style={{ color: "#c96a10", fontWeight: 800, fontSize: 13 }}>Today&apos;s quest!</div>}
                  {isDone && <div style={{ color: "#1f7a43", fontWeight: 800, fontSize: 13 }}>Done</div>}
                </div>
              </Link>
            </div>
          );
        })}
        <div className="card center" style={{ marginTop: 8 }}>
          <b>Trophy: {arc.trophy}</b>
          <div className="muted" style={{ fontSize: 13 }}>Finish all {QUESTS.length} quests to win it</div>
        </div>
      </div>

      <div className="center" style={{ marginTop: 28 }}>
        <Link href="/admin" className="muted" style={{ fontSize: 13 }}>Papa&apos;s admin</Link>
      </div>
    </main>
  );
}
