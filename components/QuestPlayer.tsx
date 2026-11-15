"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ItemArt } from "@/components/Art";
import { CardPortrait, MooshakArt } from "@/components/Cast";
import { Avatar } from "@/components/Avatars";
import { SceneView } from "@/components/Scene";
import { DemoView } from "@/components/Learn";
import { EasyWin, GamePlayer, MistakeRound, sliceGame } from "@/components/games/Games";
import { warmupFor } from "@/lib/warmup";
import type { Result } from "@/components/games/common";
import MuteToggle from "@/components/MuteToggle";
import MusicToggle from "@/components/MusicToggle";
import { ARCS, CARDS, QUESTS, STARS_PER_CARD, type Quest } from "@/content/quests";
import { SKILLS } from "@/content/skills";
import { narrate, preload, say, sfx, sleep, stop } from "@/lib/audio";
import type { Demo } from "@/content/quests";
import { P, clean } from "@/lib/phrases";

type Step = "intro" | "warmup" | "story" | "learn" | "guided" | "game" | "physical" | "mistake" | "easy" | "reward";


const STAGES: { key: string; label: string; steps: Step[] }[] = [
  { key: "warm", label: "Warm-up", steps: ["warmup"] },
  { key: "story", label: "Story", steps: ["intro", "story"] },
  { key: "learn", label: "Learn", steps: ["learn"] },
  { key: "try", label: "Try", steps: ["guided"] },
  { key: "play", label: "Play", steps: ["game", "physical", "mistake", "easy"] },
  { key: "win", label: "Win", steps: ["reward"] },
];

function StageBar({ step, has }: { step: Step; has: Record<string, boolean> }) {
  const stages = STAGES.filter((s) => has[s.key] !== false);
  const at = stages.findIndex((s) => s.steps.includes(step));
  return (
    <div className="stagebar">
      {stages.map((s, i) => (
        <div key={s.key} className={`stg ${i < at ? "done" : i === at ? "on" : ""}`}>
          <span className="dot">{i < at ? "✓" : i + 1}</span>
          {i === at && <span>{s.label}</span>}
        </div>
      ))}
    </div>
  );
}

// How long each concept animation needs before moving on.
function demoMs(d: Demo) {
  switch (d.type) {
    case "count": return d.n * 850 + 1200;
    case "giveN": return (d.n + 1) * 900 + 900;
    case "glance": return 2600;
    case "frame5": return 2400;
    case "conserve": return 3400;
    case "match": return (Math.min(d.a, d.b) + 1) * 700 + 1000;
    case "pattern": return d.seq.length * 450 + 900;
    case "shape": return 3200;
    default: return 1500;
  }
}

const GAP = 600;

export default function QuestPlayer({ quest }: { quest: Quest }) {
  const [step, setStep] = useState<Step>("intro");
  const [panel, setPanel] = useState(0);
  const [lstep, setLstep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [mooshakFixed, setMooshakFixed] = useState(false);
  const [reward, setReward] = useState<{ stars: number; total: number; error?: string } | null>(null);
  const skill = SKILLS.find((s) => s.id === quest.skill);
  // Games unlock in order. Papa can open any game with ?papa=1.
  const [lockedBy, setLockedBy] = useState<number | null>(null);
  useEffect(() => {
    if (quest.day === 1 || new URLSearchParams(window.location.search).get("papa") === "1") return;
    fetch("/api/state").then((r) => r.json()).then((d: { completed: number[] }) => {
      const done = new Set(d.completed ?? []);
      if (!done.has(quest.day) && !done.has(quest.day - 1)) setLockedBy(QUESTS.find((q) => !done.has(q.day))?.day ?? 1);
    }).catch(() => {});
  }, [quest.day]);
  const hasLearn = quest.learn.length > 0;

  const warm = warmupFor(quest.review);
  const guidedGame = hasLearn ? sliceGame(quest.game, 0, 1) : null;
  const mainGame = (guidedGame && quest.game.type !== "mixed" ? sliceGame(quest.game, 1) : quest.game) ?? quest.game;
  const has = { warm: !!warm, learn: hasLearn, try: !!guidedGame };
  const [auto, setAuto] = useState(true);
  const [phase, setPhase] = useState<"enter" | "speaking" | "gap" | "idle">("enter");
  const [tick, setTick] = useState(0);

  // Story and Learn play themselves: narrate, let the picture finish, wait 1.5s, move on.
  useEffect(() => {
    if (step !== "story" && step !== "learn") return;
    let cancelled = false;
    const text = step === "story" ? quest.story[panel].t : quest.learn[lstep].t;
    const nextText = step === "story" ? quest.story[panel + 1]?.t ?? quest.learn[0]?.t : quest.learn[lstep + 1]?.t;
    if (nextText) preload(nextText);
    const minMs = step === "learn" ? demoMs(quest.learn[lstep].demo) : 0;
    (async () => {
      // Let the new card slide in, then read it; only move on once the reading has finished.
      setPhase("enter");
      await sleep(200);
      if (cancelled) return;
      setPhase("speaking");
      const started = Date.now();
      await narrate(text);
      if (cancelled) return;
      const left = minMs - (Date.now() - started);
      if (left > 0) await sleep(left);
      if (cancelled) return;
      if (!auto) { setPhase("idle"); return; }
      const last = step === "story" ? panel + 1 >= quest.story.length && !hasLearn : lstep + 1 >= quest.learn.length;
      if (last) { setPhase("idle"); return; }
      setPhase("gap");
      await sleep(GAP);
      if (cancelled || !auto) return;
      if (step === "story") {
        if (panel + 1 < quest.story.length) setPanel(panel + 1);
        else if (hasLearn) { setLstep(0); setStep("learn"); }
      } else if (lstep + 1 < quest.learn.length) setLstep(lstep + 1);
    })();
    return () => { cancelled = true; };
  }, [step, panel, lstep, auto, tick, quest, hasLearn]);

  useEffect(() => {
    if (step === "physical") say(P.phoneDown);
    if (step === "reward") { sfx.win(); setTimeout(() => say(P.newPower(quest.power.name)), 700); }
  }, [step, quest.power.name]);
  useEffect(() => { preload(quest.story[0].t); return () => stop(); }, [quest.story]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0 }); }, [step, panel, lstep]);
  useEffect(() => { if (step === "story" && panel > 0) sfx.swish(); }, [step, panel]);

  const skip = () => {
    stop();
    if (step === "story") {
      if (panel + 1 < quest.story.length) setPanel(panel + 1);
      else if (hasLearn) { setLstep(0); setStep("learn"); }
    } else if (step === "learn" && lstep + 1 < quest.learn.length) setLstep(lstep + 1);
  };
  const AutoControls = ({ k }: { text?: string; extra?: number; k: string }) => (
    <div className="autostatus">
      {phase === "speaking" && <span className="wave" aria-label="reading"><i /><i /><i /><i /></span>}
      {phase === "gap" && auto && <div className="autobar"><div key={k} style={{ animation: `grow ${GAP}ms linear forwards` }} /></div>}
    </div>
  );

  const afterGame = (r: Result) => {
    setResult(r);
    setStep(quest.physical ? "physical" : quest.mistake ? "mistake" : "easy");
  };

  const finish = async () => {
    setStep("reward");
    try {
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: quest.day, mooshakFixed, triedAgain: result?.triedAgain ?? false, summary: { ...result, skill: quest.skill, game: quest.gameName } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      setReward(data);
    } catch (e) {
      const stars = 3 + (mooshakFixed ? 1 : 0) + (result?.triedAgain ? 1 : 0);
      setReward({ stars, total: -1, error: String(e) });
    }
  };

  if (lockedBy) {
    const need = QUESTS.find((q) => q.day === lockedBy);
    return (
      <main className="wrap center" style={{ paddingTop: 60 }}>
        <MooshakArt size={110} mood="thinking" />
        <p className="big">This game is locked!</p>
        <p style={{ fontSize: 18, fontWeight: 700 }}>Games open one by one. Your next game is <b>Game {lockedBy}: {need?.title}</b>.</p>
        <div className="row" style={{ justifyContent: "center", gap: 10, marginTop: 16 }}>
          <Link href="/" className="btn ghost" style={{ textDecoration: "none" }}>Map</Link>
          <Link href={`/quest/${lockedBy}`} className="btn" style={{ textDecoration: "none" }}>Go to Game {lockedBy}</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="row spread" style={{ marginBottom: 8 }}>
        <Link href="/" className="pill" style={{ textDecoration: "none" }}>← Map</Link>
        <div className="row" style={{ gap: 6 }}><MusicToggle /><MuteToggle compact /><span className="pill">Game {quest.day}</span></div>
      </div>
      {step !== "intro" && <StageBar step={step} has={has} />}

      {step === "intro" && (
        <div className="fade-in">
          <SceneView scene={quest.story[0].s} height="clamp(220px, 40dvh, 340px)" />
          <div className="center" style={{ marginTop: 14 }}>
            <div className="eyebrow">Game {quest.day}</div>
            <h1 className="big" style={{ margin: "4px 0 10px" }}>{quest.title}</h1>
            <div className="row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 10 }}>
              {quest.costars.map((c) => (
                <div key={c} className="center" style={{ width: 74 }}><div className="row" style={{ justifyContent: "center" }}><Avatar name={c} size={52} /></div><b style={{ fontSize: 12, display: "block", marginTop: 4 }}>{c}</b></div>
              ))}
            </div>
            <div className="power-chip" style={{ marginTop: 14 }}>
              <span className="power-ico">⚡</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#8a5a1a", textTransform: "uppercase", letterSpacing: ".05em" }}>Power to win</div>
                <div style={{ fontWeight: 900 }}>{quest.power.name}</div>
              </div>
            </div>
            <div style={{ marginTop: 18 }}>
              <button className="btn" onClick={() => setStep(warm ? "warmup" : "story")}>Start the quest!</button>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>For Papa: skill {quest.skill} - {skill?.name}{quest.review.length ? `; review ${quest.review.join(", ")}` : ""}.</p>
          </div>
        </div>
      )}

      {step === "warmup" && warm && (
        <div className="fade-in">
          <div className="learnhead">
            <MooshakArt size={44} mood="excited" />
            <div>
              <div className="eyebrow">Warm-up</div>
              <div style={{ fontWeight: 900, fontSize: 17 }}>Remember your powers?</div>
            </div>
          </div>
          <GamePlayer game={warm} onDone={() => setStep("story")} />
        </div>
      )}

      {step === "story" && (
        <div className="fade-in" key={`s${panel}`}>
          <div onClick={skip} style={{ cursor: "pointer" }}><SceneView scene={quest.story[panel].s} /></div>
          <div className="storycard">
            <p className="panel-text" style={{ margin: 0 }}>{clean(quest.story[panel].t)}</p>
            <div className="row spread" style={{ marginTop: 10 }}>
              <button className="speak" onClick={() => { setAuto(!auto); stop(); setTick(tick + 1); }}>{auto ? "❚❚ Pause" : "▶ Play"}</button>
              <div className="dots">{quest.story.map((_, i) => <span key={i} className={i === panel ? "on" : i < panel ? "done" : ""} />)}</div>
            </div>
            <AutoControls k={`s${panel}-${tick}`} />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {panel > 0 && <button className="btn ghost" onClick={() => setPanel(panel - 1)}>Back</button>}
            {(!auto || panel + 1 === quest.story.length) && (
              <button className={`btn ${panel + 1 === quest.story.length ? "pulse-btn" : ""}`} style={{ flex: 1 }} onClick={() => { stop(); if (panel + 1 < quest.story.length) setPanel(panel + 1); else setStep(hasLearn ? "learn" : "game"); }}>
                {panel + 1 < quest.story.length ? "Next" : hasLearn ? "Learn the trick!" : "Let's go!"}
              </button>
            )}
          </div>
        </div>
      )}

      {step === "learn" && (
        <div className="fade-in" key={`l${lstep}`}>
          <div className="learnhead">
            <MooshakArt size={44} mood="excited" />
            <div>
              <div className="eyebrow">Learn · {lstep + 1} of {quest.learn.length}</div>
              <div style={{ fontWeight: 900, fontSize: 17 }}>{quest.power.name}</div>
            </div>
          </div>
          <div className="card demo-card" onClick={skip}><DemoView demo={quest.learn[lstep].demo} k={replay * 100 + lstep} /></div>
          <div className="storycard" style={{ marginTop: 10 }}>
            <p className="panel-text" style={{ margin: 0 }}>{clean(quest.learn[lstep].t)}</p>
            <div className="row spread" style={{ marginTop: 10 }}>
              <button className="speak" onClick={() => { setReplay(replay + 1); setTick(tick + 1); }}>↻ Show again</button>
              <button className="speak" onClick={() => { setAuto(!auto); stop(); setTick(tick + 1); }}>{auto ? "❚❚" : "▶"}</button>
              <div className="dots">{quest.learn.map((_, i) => <span key={i} className={i === lstep ? "on" : i < lstep ? "done" : ""} />)}</div>
            </div>
            <AutoControls k={`l${lstep}-${tick}`} />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {lstep > 0 && <button className="btn ghost" onClick={() => setLstep(lstep - 1)}>Back</button>}
            {(!auto || lstep + 1 === quest.learn.length) && (
              <button className={`btn ${lstep + 1 === quest.learn.length ? "pulse-btn" : ""}`} style={{ flex: 1 }} onClick={() => { stop(); if (lstep + 1 < quest.learn.length) setLstep(lstep + 1); else setStep(guidedGame ? "guided" : "game"); }}>
                {lstep + 1 < quest.learn.length ? "Next" : "Now you try!"}
              </button>
            )}
          </div>
        </div>
      )}

      {step === "guided" && guidedGame && (
        <div className="fade-in">
          <div className="learnhead">
            <MooshakArt size={44} mood="happy" />
            <div>
              <div className="eyebrow">Try it with me</div>
              <div style={{ fontWeight: 900, fontSize: 17 }}>{quest.power.name}</div>
            </div>
          </div>
          <GamePlayer game={guidedGame} guided onDone={() => setStep("game")} />
          {quest.talk && (
            <div className="papa" style={{ marginTop: 14 }}>
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="14" cy="13" r="7" fill="#8d6e63" /><path d="M3 36 Q14 18 25 36 Z" fill="#2f6fd6" /><circle cx="29" cy="19" r="5" fill="#f4b183" /><path d="M21 37 Q29 24 37 37 Z" fill="#f28c28" /></svg>
              <div style={{ fontSize: 15, fontWeight: 700 }}><b>With Papa:</b> {quest.talk}</div>
            </div>
          )}

        </div>
      )}

      {step === "game" && (
        <div>
          <p className="center" style={{ margin: "4px 0" }}><span className="pill">You do it! · {quest.gameName}</span></p>
          <GamePlayer game={mainGame} onDone={afterGame} />
        </div>
      )}

      {step === "physical" && quest.physical && (
        <div className="fade-in">
          <div className="card" style={{ background: "#fff7e6", borderColor: "#f6d38b" }}>
            <div className="row" style={{ gap: 10 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="4" width="24" height="40" rx="5" fill="#2b2118" /><rect x="15" y="9" width="18" height="28" rx="2" fill="#9fd4ff" /><path d="M6 6 L42 42" stroke="#d64545" strokeWidth="5" strokeLinecap="round" /></svg>
              <div>
                <p className="title" style={{ fontSize: 20 }}>Phone down!</p>
                <p style={{ margin: 0, fontWeight: 800, color: "#c96a10" }}>{quest.physical.title}</p>
              </div>
            </div>
            <ol style={{ fontSize: 18, lineHeight: 1.55, paddingLeft: 22, marginBottom: 0 }}>
              {quest.physical.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </div>
          <div className="center" style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => setStep(quest.mistake ? "mistake" : "easy")}>We played it!</button>
          </div>
        </div>
      )}

      {step === "mistake" && quest.mistake && (
        <div>
          <p className="center" style={{ margin: "4px 0" }}><span className="pill">Mooshak&apos;s Mistake</span></p>
          <MistakeRound {...quest.mistake} onDone={(fixed) => { setMooshakFixed(fixed); setStep("easy"); }} />
        </div>
      )}

      {step === "easy" && <EasyWin item={quest.easyWin.item} n={quest.easyWin.n} onDone={finish} />}

      {step === "reward" && <RewardScreen quest={quest} reward={reward} />}
    </main>
  );
}

function Confetti() {
  const colors = ["#f28c28", "#d64545", "#2f6fd6", "#2e9d5b", "#f2c230"];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, background: colors[i % 5], animationDelay: `${(i % 9) * 0.12}s`, transform: `rotate(${i * 23}deg)` }} />
      ))}
    </div>
  );
}

function RewardScreen({ quest, reward }: { quest: Quest; reward: { stars: number; total: number; error?: string } | null }) {
  if (!reward) return <p className="big center">Counting your stars...</p>;
  const before = reward.total >= 0 ? reward.total - reward.stars : -1;
  const newCard = before >= 0 && Math.floor(reward.total / STARS_PER_CARD) > Math.floor(before / STARS_PER_CARD) ? CARDS[Math.min(Math.floor(reward.total / STARS_PER_CARD) - 1, CARDS.length - 1)] : null;
  const arc = ARCS.find((a) => a.days[1] === quest.day);
  const next = QUESTS.find((q) => q.day === quest.day + 1);
  return (
    <div className="center fade-in" style={{ position: "relative" }}>
      <Confetti />
      <MooshakArt size={96} mood="excited" />
      <p className="big" style={{ margin: "4px 0" }}>Quest complete!</p>
      <div className="power-chip pop" style={{ margin: "10px auto" }}>
        <span className="power-ico">⚡</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#8a5a1a", textTransform: "uppercase", letterSpacing: ".05em" }}>New power!</div>
          <div style={{ fontWeight: 900 }}>{quest.power.name}</div>
          <div style={{ fontSize: 13, color: "#7a6a5a" }}>{quest.power.desc}</div>
        </div>
      </div>
      <div className="row" style={{ justifyContent: "center", gap: 4, margin: "12px 0" }}>
        {Array.from({ length: reward.stars }, (_, k) => (
          <div key={k} className="pop" onAnimationStart={() => sfx.star()} style={{ animationDelay: `${0.4 + k * 0.2}s`, animationFillMode: "both" }}><ItemArt item="star" size={50} /></div>
        ))}
      </div>
      <p className="panel-text" style={{ margin: 0 }}>+{reward.stars} stars{reward.total >= 0 ? ` · ${reward.total} in your jar` : ""}</p>
      {newCard && (
        <div className="card pop" style={{ margin: "16px auto", maxWidth: 280 }}>
          <p className="title">New hero card!</p>
          <div className="row" style={{ justifyContent: "center", margin: 12 }}><CardPortrait name={newCard.name} color={newCard.color} size={96} /></div>
          <p className="big" style={{ margin: 0 }}>{newCard.name}</p>
        </div>
      )}
      {arc && (
        <div className="card pop" style={{ margin: "16px auto", maxWidth: 320, borderColor: "#f2c230", background: "#fffbea" }}>
          <ItemArt item="modak" size={60} color="#f2c230" />
          <p className="title">Trophy: {arc.trophy}!</p>
          <p className="muted" style={{ margin: 0 }}>You finished {arc.title}.</p>
        </div>
      )}
      <p className="muted" style={{ fontWeight: 800 }}>{clean(quest.teaser)}</p>
      {reward.error && <p className="muted" style={{ fontSize: 13 }}>Stars not saved (offline?). Papa can add them in Admin.</p>}
      <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
        <Link href="/" className="btn" style={{ textDecoration: "none" }}>Back to the map</Link>
      </div>
      {next && <p className="muted" style={{ fontSize: 12, marginTop: 16 }}>Papa: log today&apos;s session in Admin (1 minute).</p>}
    </div>
  );
}
