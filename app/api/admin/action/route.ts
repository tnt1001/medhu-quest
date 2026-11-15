import { db } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/auth";
import { computedLevel, type LogRow } from "@/lib/engine";
import { SKILLS } from "@/content/skills";

export const dynamic = "force-dynamic";

const validSkill = (id: string) => SKILLS.some((s) => s.id === id);
const clamp = (n: unknown, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.round(Number(n) || 0)));

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const b = await req.json();
  const sql = db().sql;

  if (b.action === "log") {
    if (!validSkill(b.skill_id)) return Response.json({ error: "bad skill" }, { status: 400 });
    const tries = clamp(b.tries, 0, 50);
    const correct = clamp(b.correct, 0, tries);
    await sql`INSERT INTO logs (log_date, quest_day, skill_id, game, tries, correct, method, engagement, note)
      VALUES (${b.log_date || new Date().toISOString().slice(0, 10)}, ${b.quest_day ? Number(b.quest_day) : null}, ${b.skill_id}, ${b.game || null},
              ${tries}, ${correct}, ${b.method ? clamp(b.method, 1, 3) : null}, ${b.engagement ? clamp(b.engagement, 1, 3) : null}, ${b.note || null})`;
    // Auto-raise the stored level when the mastery rule says so.
    const logs = await sql<LogRow>`SELECT to_char(log_date, 'YYYY-MM-DD') AS log_date, skill_id, game, tries, correct, method, engagement FROM logs WHERE skill_id = ${b.skill_id}`;
    const lvl = computedLevel(b.skill_id, logs);
    const [cur] = await sql<{ level: number }>`SELECT level FROM skill_levels WHERE skill_id = ${b.skill_id}`;
    if (!cur || lvl > cur.level) {
      await sql`INSERT INTO skill_levels (skill_id, level) VALUES (${b.skill_id}, ${lvl})
        ON CONFLICT (skill_id) DO UPDATE SET level = EXCLUDED.level, updated_at = NOW()`;
      await sql`INSERT INTO skill_level_history (skill_id, level, source) VALUES (${b.skill_id}, ${lvl}, 'auto')`;
    }
    if (b.everyday) {
      await sql`INSERT INTO rewards (kind, amount, reason) VALUES ('star', 1, ${"Side quest: " + (b.note || "everyday maths")})`;
    }
    return Response.json({ ok: true, level: lvl });
  }

  if (b.action === "level") {
    if (!validSkill(b.skill_id)) return Response.json({ error: "bad skill" }, { status: 400 });
    const level = clamp(b.level, 0, 4);
    await sql`INSERT INTO skill_levels (skill_id, level) VALUES (${b.skill_id}, ${level})
      ON CONFLICT (skill_id) DO UPDATE SET level = EXCLUDED.level, updated_at = NOW()`;
    await sql`INSERT INTO skill_level_history (skill_id, level, source) VALUES (${b.skill_id}, ${level}, 'manual')`;
    return Response.json({ ok: true });
  }

  if (b.action === "check") {
    const scores: number[] = Array.from({ length: 12 }, (_, i) => clamp(b.scores?.[i], 0, 2));
    const total = scores.reduce((a, c) => a + c, 0);
    await sql`INSERT INTO checks (check_date, label, scores, total) VALUES (${b.check_date || new Date().toISOString().slice(0, 10)}, ${b.label || "Check"}, ${JSON.stringify(scores)}, ${total})`;
    return Response.json({ ok: true, total });
  }

  if (b.action === "bonus") {
    const amount = clamp(b.amount, 1, 10);
    await sql`INSERT INTO rewards (kind, amount, reason) VALUES ('star', ${amount}, ${b.reason || "Bonus from Papa"})`;
    return Response.json({ ok: true });
  }

  if (b.action === "resetAll") {
    if (b.confirm !== "RESET") return Response.json({ error: "type RESET to confirm" }, { status: 400 });
    await sql`TRUNCATE TABLE rewards, quest_completions, logs, checks, skill_levels, skill_level_history RESTART IDENTITY`;
    return Response.json({ ok: true });
  }

  if (b.action === "deleteLog") {
    await sql`DELETE FROM logs WHERE id = ${Number(b.id)}`;
    return Response.json({ ok: true });
  }

  return Response.json({ error: "unknown action" }, { status: 400 });
}
