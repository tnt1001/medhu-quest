"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, ItemArt } from "@/components/Art";
import { CardPortrait, MooshakArt } from "@/components/Cast";
import { SceneView } from "@/components/Scene";
import { DemoView } from "@/components/Learn";
import { EasyWin, GamePlayer, MistakeRound } from "@/components/games/Games";
import type { Result } from "@/components/games/common";
import MuteToggle from "@/components/MuteToggle";
import { ARCS, CARDS, QUESTS, STARS_PER_CARD, type Quest } from "@/content/quests";
import { SKILLS } from "@/content/skills";
import { preload, say, sfx, stop } from "@/lib/audio";
import { P } from "@/lib/phrases";

type Step = "intro" | "story" | "learn" | "game" | "physical" | "mistake" | "easy" | "reward";

const cardColor = (name: string) => CARDS.find((c) => c.name === name)?.color ?? "#8d6e63";

const STAGES: { key: string; label: string; steps: Step[] }[] = [
  { key: "story", label: "Story", steps: ["intro", "story"] },
  { key: "learn", label: "Learn", steps: ["learn"] },
  { key: "play", label: "Play", steps: ["game", "physical", "mistake", "easy"] },
  { key: "win", label: "Win", steps: ["reward"] },
];

function StageBar({ step, hasLearn }: { step: Step; hasLearn: boolean }) {
  const stages = STAGES.filter((s) => hasLearn || s.key !== "learn");
  const at = stages.findIndex((s) => s.steps.includes(step));
  return (
    <div className="stagebar">
      {stages.map((s, i) => (
        <div key={s.key} className={`stg ${i < at ? "done" : i === at ? "on" : ""}`}>
          <span className="dot">{i < at ? "✓" : i + 1}</span>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function QuestPlayer({ quest }: { quest: Quest }) {
  const [step, setStep] = useState<Step>("intro");
  const [panel, setPanel] = useState(0);
  const [lstep, setLstep] = useState(0);
  const [replay, setReplay] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [mooshakFixed, setMooshakFixed] = useState(false);
  const [reward, setReward] = useState<{ stars: number; total: number; error?: string } | null>(null);
  const skill = SKILLS.find((s) => s.id === quest.skill);
  const hasLearn = quest.learn.length > 0;

  useEffect(() => {
    if (step !== "story") return;
    say(quest.story[panel].t);
    if (quest.story[panel + 1]) preload(quest.story[panel + 1].t);
  }, [step, panel, quest.story]);
  useEffect(() => {
    if (step !== "learn") return;
    say(quest.learn[lstep].t);
    if (quest.learn[lstep + 1]) preload(quest.learn[lstep + 1].t);
  }, [step, lstep, quest.learn]);
  useEffect(() => {
    if (step === "physical") say(P.phoneDown);
    if (step === "reward") { sfx.win(); setTimeout(() => say(P.newPower(quest.power.name)), 700); }
  }, [step, quest.power.name]);
  useEffect(() => { preload(quest.story[0].t); return () => stop(); }, [quest.story]);
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0 }); }, [step, panel, lstep]);

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

  return (
    <main className="wrap">
      <div className="row spread" style={{ marginBottom: 8 }}>
        <Link href="/" className="pill" style={{ textDecoration: "none" }}>← Map</Link>
        <div className="row" style={{ gap: 6 }}><MuteToggle /><span className="pill">Quest {quest.day}</span></div>
      </div>
      {step !== "intro" && <StageBar step={step} hasLearn={hasLearn} />}

      {step === "intro" && (
        <div className="fade-in">
          <SceneView scene={quest.story[0].s} height="clamp(220px, 40dvh, 340px)" />
          <div className="center" style={{ marginTop: 14 }}>
            <div className="eyebrow">Quest {quest.day}</div>
            <h1 className="big" style={{ margin: "4px 0 10px" }}>{quest.title}</h1>
            <div className="row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 10 }}>
              {quest.costars.map((c) => (
                <div key={c} className="row" style={{ gap: 6 }}><Badge name={c} color={cardColor(c)} size={30} /><b style={{ fontSize: 14 }}>{c}</b></div>
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
              <button className="btn" onClick={() => setStep("story")}>Start the quest!</button>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>For Papa: skill {quest.skill} - {skill?.name}{quest.review.length ? `; review ${quest.review.join(", ")}` : ""}.</p>
          </div>
        </div>
      )}

      {step === "story" && (
        <div className="fade-in" key={`s${panel}`}>
          <SceneView scene={quest.story[panel].s} />
          <div className="storycard">
            <p className="panel-text" style={{ margin: 0 }}>{quest.story[panel].t}</p>
            <div className="row spread" style={{ marginTop: 10 }}>
              <button className="speak" onClick={() => say(quest.story[panel].t)}>▶ Play again</button>
              <div className="dots">{quest.story.map((_, i) => <span key={i} className={i === panel ? "on" : i < panel ? "done" : ""} />)}</div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {panel > 0 && <button className="btn ghost" onClick={() => setPanel(panel - 1)}>Back</button>}
            <button className="btn" style={{ flex: 1 }} onClick={() => (panel + 1 < quest.story.length ? setPanel(panel + 1) : setStep(hasLearn ? "learn" : "game"))}>
              {panel + 1 < quest.story.length ? "Next" : hasLearn ? "Learn the trick!" : "Let's go!"}
            </button>
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
          <div className="card demo-card"><DemoView demo={quest.learn[lstep].demo} k={replay * 100 + lstep} /></div>
          <div className="storycard" style={{ marginTop: 10 }}>
            <p className="panel-text" style={{ margin: 0 }}>{quest.learn[lstep].t}</p>
            <div className="row spread" style={{ marginTop: 10 }}>
              <button className="speak" onClick={() => { setReplay(replay + 1); say(quest.learn[lstep].t); }}>↻ Show again</button>
              <div className="dots">{quest.learn.map((_, i) => <span key={i} className={i === lstep ? "on" : i < lstep ? "done" : ""} />)}</div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            {lstep > 0 && <button className="btn ghost" onClick={() => setLstep(lstep - 1)}>Back</button>}
            <button className="btn" style={{ flex: 1 }} onClick={() => (lstep + 1 < quest.learn.length ? setLstep(lstep + 1) : setStep("game"))}>
              {lstep + 1 < quest.learn.length ? "Next" : "I got it! Let's play"}
            </button>
          </div>
        </div>
      )}

      {step === "game" && (
        <div>
          <p className="center" style={{ margin: "4px 0" }}><span className="pill">{quest.gameName}</span></p>
          <GamePlayer game={quest.game} onDone={afterGame} />
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
          <div key={k} className="pop" style={{ animationDelay: `${0.4 + k * 0.2}s`, animationFillMode: "both" }}><ItemArt item="star" size={50} /></div>
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
      <p className="muted" style={{ fontWeight: 800 }}>{quest.teaser}</p>
      {reward.error && <p className="muted" style={{ fontSize: 13 }}>Stars not saved (offline?). Papa can add them in Admin.</p>}
      <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
        <Link href="/" className="btn" style={{ textDecoration: "none" }}>Back to the map</Link>
      </div>
      {next && <p className="muted" style={{ fontSize: 12, marginTop: 16 }}>Papa: log today&apos;s session in Admin (1 minute).</p>}
    </div>
  );
}
