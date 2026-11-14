"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, ItemArt, Mooshak } from "@/components/Art";
import { EasyWin, GamePlayer, MistakeRound } from "@/components/games/Games";
import type { Result } from "@/components/games/common";
import { ARCS, CARDS, QUESTS, STARS_PER_CARD, type Quest } from "@/content/quests";
import { SKILLS } from "@/content/skills";
import { preload, say, sfx, stop } from "@/lib/audio";
import { P } from "@/lib/phrases";
import MuteToggle from "@/components/MuteToggle";

type Step = "intro" | "story" | "game" | "physical" | "mistake" | "easy" | "reward";

const cardColor = (name: string) => CARDS.find((c) => c.name === name)?.color ?? "#8d6e63";

export default function QuestPlayer({ quest }: { quest: Quest }) {
  const [step, setStep] = useState<Step>("intro");
  const [panel, setPanel] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [mooshakFixed, setMooshakFixed] = useState(false);
  const [reward, setReward] = useState<{ stars: number; total: number; error?: string } | null>(null);
  const skill = SKILLS.find((s) => s.id === quest.skill);

  // Narrate each story panel as it appears, and fetch the next one in advance.
  useEffect(() => {
    if (step !== "story") return;
    say(quest.story[panel]);
    if (quest.story[panel + 1]) preload(quest.story[panel + 1]);
  }, [step, panel, quest.story]);
  useEffect(() => {
    if (step === "physical") say(P.phoneDown);
    if (step === "reward") { sfx.win(); setTimeout(() => say(P.questDone), 700); }
  }, [step]);
  useEffect(() => { preload(quest.story[0]); return () => stop(); }, [quest.story]);

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
      <div className="row spread" style={{ marginBottom: 12 }}>
        <Link href="/" className="pill" style={{ textDecoration: "none" }}>Home</Link>
        <div className="row" style={{ gap: 6 }}><MuteToggle /><span className="pill">Quest {quest.day}</span></div>
      </div>

      {step === "intro" && (
        <div className="fade-in center">
          <Mooshak size={110} />
          <h1 className="big" style={{ margin: "12px 0" }}>{quest.title}</h1>
          <div className="row" style={{ justifyContent: "center", flexWrap: "wrap" }}>
            {quest.costars.map((c) => (
              <div key={c} className="row" style={{ gap: 6 }}><Badge name={c} color={cardColor(c)} size={34} /><b>{c}</b></div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <button className="btn" onClick={() => setStep("story")}>Start the quest!</button>
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 28 }}>For Papa: today&apos;s skill {quest.skill} - {skill?.name}{quest.review.length ? `; review ${quest.review.join(", ")}` : ""}.</p>
        </div>
      )}

      {step === "story" && (
        <div className="fade-in" key={panel}>
          <div className="card" style={{ minHeight: "var(--story-h)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p className="panel-text">{quest.story[panel]}</p>
            <div className="row spread">
              <button className="speak" onClick={() => say(quest.story[panel])}>Play again</button>
              <span className="muted" style={{ fontWeight: 700 }}>{panel + 1} / {quest.story.length}</span>
            </div>
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            {panel > 0 && <button className="btn ghost" onClick={() => setPanel(panel - 1)}>Back</button>}
            <button className="btn" style={{ flex: 1 }} onClick={() => (panel + 1 < quest.story.length ? setPanel(panel + 1) : setStep("game"))}>
              {panel + 1 < quest.story.length ? "Next" : "Let's play!"}
            </button>
          </div>
        </div>
      )}

      {step === "game" && (
        <div>
          <p className="center"><span className="pill">{quest.gameName}</span></p>
          <GamePlayer game={quest.game} onDone={afterGame} />
        </div>
      )}

      {step === "physical" && quest.physical && (
        <div className="fade-in">
          <div className="card">
            <p className="title">Phone down! Real-world game</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#f28c28", margin: "6px 0" }}>{quest.physical.title}</p>
            <ol style={{ fontSize: 18, lineHeight: 1.5, paddingLeft: 22 }}>
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
          <p className="center"><span className="pill">Mooshak&apos;s Mistake</span></p>
          <MistakeRound {...quest.mistake} onDone={(fixed) => { setMooshakFixed(fixed); setStep("easy"); }} />
        </div>
      )}

      {step === "easy" && <EasyWin item={quest.easyWin.item} n={quest.easyWin.n} onDone={finish} />}

      {step === "reward" && <RewardScreen quest={quest} reward={reward} />}
    </main>
  );
}

function RewardScreen({ quest, reward }: { quest: Quest; reward: { stars: number; total: number; error?: string } | null }) {
  if (!reward) return <p className="big center">Counting your stars...</p>;
  const before = reward.total >= 0 ? reward.total - reward.stars : -1;
  const newCard = before >= 0 && Math.floor(reward.total / STARS_PER_CARD) > Math.floor(before / STARS_PER_CARD) ? CARDS[Math.min(Math.floor(reward.total / STARS_PER_CARD) - 1, CARDS.length - 1)] : null;
  const arc = ARCS.find((a) => a.days[1] === quest.day);
  const next = QUESTS.find((q) => q.day === quest.day + 1);
  return (
    <div className="center fade-in">
      <p className="big">Quest complete!</p>
      <div className="row" style={{ justifyContent: "center", gap: 4, margin: "16px 0" }}>
        {Array.from({ length: reward.stars }, (_, k) => (
          <div key={k} className="pop" style={{ animationDelay: `${k * 0.2}s`, animationFillMode: "both" }}><ItemArt item="star" size={56} /></div>
        ))}
      </div>
      <p className="panel-text">+{reward.stars} stars{reward.total >= 0 ? ` - ${reward.total} in your jar!` : ""}</p>
      {newCard && (
        <div className="card pop" style={{ margin: "16px auto", maxWidth: 280 }}>
          <p className="title">New hero card!</p>
          <div className="row" style={{ justifyContent: "center", margin: 12 }}><Badge name={newCard.name} color={newCard.color} size={90} /></div>
          <p className="big" style={{ margin: 0 }}>{newCard.name}</p>
        </div>
      )}
      {arc && (
        <div className="card pop" style={{ margin: "16px auto", maxWidth: 320, borderColor: "#f2c230" }}>
          <p className="title">Arc trophy: {arc.trophy}!</p>
          <p className="muted">You finished {arc.title}.</p>
        </div>
      )}
      <p className="muted" style={{ fontWeight: 700 }}>{quest.teaser}</p>
      {reward.error && <p className="muted" style={{ fontSize: 13 }}>Stars not saved (offline?). Papa can add them in Admin.</p>}
      <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
        <Link href="/" className="btn" style={{ textDecoration: "none" }}>Back to the map</Link>
      </div>
      {next && <p className="muted" style={{ fontSize: 13, marginTop: 18 }}>Papa: log today&apos;s session in Admin (1 minute).</p>}
    </div>
  );
}
