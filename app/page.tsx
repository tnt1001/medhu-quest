"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemArt } from "@/components/Art";
import { GaneshaArt, WebArt } from "@/components/Cast";
import { Avatar } from "@/components/Avatars";
import { SceneView } from "@/components/Scene";
import LockModal from "@/components/LockModal";
import MuteToggle from "@/components/MuteToggle";
import MusicToggle from "@/components/MusicToggle";
import { sfx } from "@/lib/audio";
import { ARCS, QUESTS, STARS_PER_CARD, type Quest } from "@/content/quests";

function Thumb({ q, h = 112 }: { q: Quest; h?: number }) {
  // Render the opening scene at full size, then shrink it into the tile.
  return (
    <div style={{ height: h, overflow: "hidden", position: "relative" }}>
      <div style={{ width: "200%", transform: "scale(.5)", transformOrigin: "top left", pointerEvents: "none" }}>
        <SceneView scene={q.story[0].s} height={`${h * 2}px`} />
      </div>
    </div>
  );
}

const Lock = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" aria-label="locked"><rect x="4" y="10" width="16" height="12" rx="3" fill="#f2c230" stroke="#c99a10" strokeWidth="1.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#c99a10" strokeWidth="2.5" fill="none" /><circle cx="12" cy="16" r="2" fill="#8a5a1a" /></svg>
);

export default function Home() {
  const [state, setState] = useState<{ stars: number; completed: number[] } | null>(null);
  const [locked, setLocked] = useState<Quest | null>(null);
  useEffect(() => {
    fetch("/api/state").then((r) => r.json()).then(setState).catch(() => setState({ stars: 0, completed: [] }));
  }, []);
  const done = new Set(state?.completed ?? []);
  const next = QUESTS.find((q) => !done.has(q.day)) ?? null;
  const isOpen = (q: Quest) => q.day === 1 || done.has(q.day) || done.has(q.day - 1);
  const arc = ARCS[0];
  const stars = state?.stars ?? 0;
  const toCard = STARS_PER_CARD - (stars % STARS_PER_CARD);
  const pct = Math.round((done.size / QUESTS.length) * 100);
  const lockedBy = locked ? next ?? QUESTS[0] : null;

  return (
    <main className="wrap">
      <div className="row spread">
        <div className="row" style={{ gap: 6 }}>
          <Avatar name="Medhu" size={48} />
          <div>
            <h1 className="title" style={{ fontSize: 20 }}>Medhu&apos;s Quest</h1>
            <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>Mooshak ke saath maths</div>
          </div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <MusicToggle />
          <MuteToggle compact />
          <Link href="/cards" className="pill row" style={{ gap: 4, textDecoration: "none", fontSize: 16, padding: "4px 10px" }}>
            <ItemArt item="star" size={22} /><b>{stars}</b>
          </Link>
        </div>
      </div>

      <div className="arc-hero">
        <div style={{ position: "absolute", right: -6, bottom: -6 }}><GaneshaArt size={112} /></div>
        <div style={{ position: "absolute", right: 92, top: -18, opacity: 0.55 }}><WebArt size={86} /></div>
        <div style={{ position: "relative", maxWidth: "62%" }}>
          <div className="eyebrow" style={{ color: "#fff3dd" }}>Arc {arc.id} · {arc.costars}</div>
          <div style={{ fontSize: 23, fontWeight: 900, color: "white", lineHeight: 1.1, margin: "4px 0 10px" }}>{arc.title}</div>
          <div style={{ height: 10, background: "rgba(255,255,255,.35)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "white" }} />
          </div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 800, color: "#fff3dd" }}>{done.size} of {QUESTS.length} games · agle hero card tak {toCard} ★</div>
        </div>
      </div>

      {next && (
        <Link href={`/quest/${next.day}`} className="tile tile-next" style={{ textDecoration: "none" }}>
          <Thumb q={next} h={150} />
          <div className="tile-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div className="eyebrow">Game {next.day} · Abhi khelo</div>
              <div style={{ fontWeight: 900, fontSize: 19 }}>{next.title}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#c96a10" }}>⚡ {next.power.name}</div>
              <div className="row" style={{ gap: 0, marginTop: 6 }}>{next.costars.map((c, i) => <div key={c} style={{ marginLeft: i ? -8 : 0 }}><Avatar name={c} size={30} /></div>)}</div>
            </div>
            <span className="playbtn" aria-hidden="true">▶</span>
          </div>
        </Link>
      )}

      <div className="eyebrow" style={{ margin: "18px 0 8px" }}>Saare games</div>
      <div className="tiles">
        {QUESTS.map((q) => {
          const open = isOpen(q);
          const finished = done.has(q.day);
          const current = next?.day === q.day;
          const body = (
            <>
              <div style={{ position: "relative" }}>
                <div className={open ? "" : "locked-art"}><Thumb q={q} /></div>
                {!open && <div className="lock-badge"><Lock /></div>}
                {finished && <div className="done-badge">✓</div>}
                <div className="num-badge">{q.day}</div>
              </div>
              <div className="tile-body">
                <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1.2, color: open ? "#2b2118" : "#9a8a78" }}>{q.title}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: finished ? "#1f7a43" : current ? "#c96a10" : "#b5a591", marginTop: 2 }}>
                  {finished ? "Ho gaya · phir khelo" : current ? "Abhi khelo!" : open ? "Khula hai" : "Locked"}
                </div>
              </div>
            </>
          );
          return open ? (
            <Link key={q.day} href={`/quest/${q.day}`} className={`tile ${current ? "tile-current" : ""}`} style={{ textDecoration: "none" }}>{body}</Link>
          ) : (
            <button key={q.day} className="tile tile-locked" onClick={() => { sfx.locked(); setLocked(q); }}>{body}</button>
          );
        })}
      </div>

      <div className="eyebrow" style={{ margin: "22px 0 8px" }}>Aage aa raha hai</div>
      {ARCS.slice(1).map((a) => (
        <button key={a.id} className="arc-locked" onClick={() => setLocked({ ...QUESTS[QUESTS.length - 1], day: a.days[0], title: `Arc ${a.id}: ${a.title}` } as Quest)}>
          <Lock />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 900 }}>Arc {a.id}: {a.title}</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{a.costars} · Arc {a.id - 1} poora karke kholo</div>
          </div>
        </button>
      ))}

      <div className="row" style={{ justifyContent: "space-between", marginTop: 24 }}>
        <Link href="/cards" className="btn ghost small" style={{ textDecoration: "none" }}>Meri powers aur cards</Link>
        <Link href="/admin" className="muted" style={{ fontSize: 13 }}>Papa&apos;s admin</Link>
      </div>

      {locked && lockedBy && (
        <LockModal
          title={locked.day > QUESTS.length ? locked.title : `Game ${locked.day}`}
          need={lockedBy.title}
          needDay={lockedBy.day}
          onClose={() => setLocked(null)}
        />
      )}
    </main>
  );
}
