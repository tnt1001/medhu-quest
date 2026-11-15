"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemArt } from "@/components/Art";
import { CardPortrait } from "@/components/Cast";
import { CARDS, QUESTS, STARS_PER_CARD, displayName } from "@/content/quests";

export default function Cards() {
  const [stars, setStars] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  useEffect(() => {
    fetch("/api/state").then((r) => r.json()).then((d) => { setStars(d.stars ?? 0); setCompleted(d.completed ?? []); }).catch(() => {});
  }, []);
  const powers = QUESTS.filter((q) => q.learn.length > 0 || q.day === 3);
  const unlocked = Math.floor(stars / STARS_PER_CARD);
  return (
    <main className="wrap">
      <div className="row spread">
        <Link href="/" className="pill" style={{ textDecoration: "none" }}>Home</Link>
        <div className="row" style={{ gap: 6 }}><ItemArt item="star" size={28} /><b style={{ fontSize: 22 }}>{stars}</b></div>
      </div>
      <h1 className="big" style={{ margin: "16px 0 4px" }}>My powers</h1>
      <p className="muted" style={{ fontWeight: 700, marginTop: 0 }}>Every quest teaches you a new maths power.</p>
      <div style={{ display: "grid", gap: 8, marginBottom: 22 }}>
        {powers.map((q) => {
          const got = completed.includes(q.day);
          return (
            <div key={q.day} className="power-chip" style={{ opacity: got ? 1 : 0.45, display: "flex", filter: got ? "none" : "grayscale(1)" }}>
              <span className="power-ico">{got ? "⚡" : "?"}</span>
              <div>
                <div style={{ fontWeight: 900 }}>{q.power.name}</div>
                <div style={{ fontSize: 13, color: "#7a6a5a" }}>{got ? q.power.desc : `Win it in quest ${q.day}`}</div>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="title" style={{ margin: "8px 0 4px" }}>Hero cards</h2>
      <p className="muted" style={{ fontWeight: 700, marginTop: 0 }}>A new card every {STARS_PER_CARD} stars. {STARS_PER_CARD - (stars % STARS_PER_CARD)} more to go!</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {CARDS.map((c, k) => {
          const got = k < unlocked;
          return (
            <div key={c.name} className="card center" style={{ padding: 10, opacity: got ? 1 : 0.45 }}>
              <div className="row" style={{ justifyContent: "center" }}>
                {got ? <CardPortrait name={c.name} color={c.color} size={64} /> : <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eadfcf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#7a6a5a" }}>?</div>}
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, marginTop: 6 }}>{got ? displayName(c.name) : `${(k + 1) * STARS_PER_CARD} stars`}</div>
              <div className="muted" style={{ fontSize: 11 }}>{got ? c.world : ""}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
