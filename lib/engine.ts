import { CORE_PATH, SIDE_PATH, SKILLS } from "@/content/skills";
import { QUESTS } from "@/content/quests";

export interface LogRow {
  log_date: string;
  skill_id: string;
  game: string | null;
  tries: number;
  correct: number;
  method: number | null;
  engagement: number | null;
}

const ratio = (l: LogRow) => (l.tries > 0 ? l.correct / l.tries : 0);
const isSuccess = (l: LogRow) => l.tries > 0 && ratio(l) >= 0.8 && (l.method ?? 2) >= 2;
const day = (d: string) => String(d).slice(0, 10);

// Mastery rule from the design doc: 3 successes, on 2 different days, in 2 different games.
export function computedLevel(skillId: string, logs: LogRow[]): number {
  const mine = logs.filter((l) => l.skill_id === skillId);
  if (mine.length === 0) return 0;
  const wins = mine.filter(isSuccess);
  const days = new Set(wins.map((l) => day(l.log_date)));
  const games = new Set(wins.map((l) => (l.game || "").toLowerCase()));
  const secure = wins.length >= 3 && days.size >= 2 && games.size >= 2;
  if (secure) {
    const fast = wins.filter((l) => l.method === 3);
    const fastDays = new Set(fast.map((l) => day(l.log_date)));
    return fast.length >= 3 && fastDays.size >= 2 ? 4 : 3;
  }
  if (wins.length > 0 || mine.some((l) => ratio(l) >= 0.5)) return 2;
  return 1;
}

export function effectiveLevels(stored: Record<string, number>, logs: LogRow[]) {
  const out: Record<string, number> = {};
  for (const s of SKILLS) out[s.id] = Math.max(stored[s.id] ?? 0, computedLevel(s.id, logs));
  // If a skill is secure, everything it needs is at least secure too.
  const byId = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
  const lift = (id: string) => {
    for (const n of byId[id].needs) {
      if ((out[n] ?? 0) < 3) {
        out[n] = 3;
        lift(n);
      }
    }
  };
  for (const s of SKILLS) if (out[s.id] >= 3) lift(s.id);
  return out;
}

export interface Recommendation {
  target: string | null;
  side: string | null;
  review: string[];
  hints: string[];
  questsForTarget: number[];
}

export function recommend(levels: Record<string, number>, logs: LogRow[]): Recommendation {
  const byId = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
  const ready = (id: string) => byId[id].needs.every((n) => (levels[n] ?? 0) >= 2);
  const hints: string[] = [];

  let target = CORE_PATH.find((id) => (levels[id] ?? 0) < 3 && ready(id)) ?? null;
  const side = SIDE_PATH.find((id) => (levels[id] ?? 0) < 3 && ready(id)) ?? null;

  if (target) {
    const recent = logs.filter((l) => l.skill_id === target).slice(0, 2);
    if (recent.length === 2 && recent.every((l) => ratio(l) < 0.5)) {
      const weakest = byId[target].needs
        .map((n) => ({ n, lvl: levels[n] ?? 0 }))
        .sort((a, b) => a.lvl - b.lvl)[0];
      hints.push(
        `Two tough sessions in a row on ${target}. Step back${weakest ? ` to ${weakest.n}` : ""} or switch to ${side ?? "a shapes or patterns skill"} for 2 days.`,
      );
      if (weakest && (levels[weakest.n] ?? 0) < 4) target = weakest.n;
    }
  }

  const today = Date.now();
  const lastSeen: Record<string, number> = {};
  for (const l of logs) {
    const t = Date.parse(day(l.log_date));
    if (!lastSeen[l.skill_id] || t > lastSeen[l.skill_id]) lastSeen[l.skill_id] = t;
  }
  const review = SKILLS.filter((s) => (levels[s.id] ?? 0) >= 3 && lastSeen[s.id] && today - lastSeen[s.id] >= 3 * 864e5)
    .sort((a, b) => lastSeen[a.id] - lastSeen[b.id])
    .slice(0, 2)
    .map((s) => s.id);

  const eng = logs.filter((l) => l.engagement != null).slice(0, 3).map((l) => l.engagement as number);
  if (eng.length === 3 && eng.every((e) => e === 1)) {
    hints.push("Engagement has been low 3 times running. Pause formal sessions for 2 days; everyday maths only. Flag it for the sync.");
  } else if (eng[0] === 1) {
    hints.push("Last session's engagement was low. Keep the skill, but change the game or the hero, and keep it to 8 minutes.");
  }

  const questsForTarget = target ? QUESTS.filter((q) => q.skill === target).map((q) => q.day) : [];
  return { target, side, review, hints, questsForTarget };
}
