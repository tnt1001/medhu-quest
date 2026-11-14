import { db } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/auth";
import { effectiveLevels, recommend, type LogRow } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const sql = db().sql;
  const stored = await sql<{ skill_id: string; level: number }>`SELECT skill_id, level FROM skill_levels`;
  const logs = await sql<LogRow & { id: number; quest_day: number | null; note: string | null }>`
    SELECT id, to_char(log_date, 'YYYY-MM-DD') AS log_date, quest_day, skill_id, game, tries, correct, method, engagement, note
    FROM logs ORDER BY log_date DESC, created_at DESC LIMIT 500`;
  const checks = await sql`SELECT id, to_char(check_date, 'YYYY-MM-DD') AS check_date, label, scores, total FROM checks ORDER BY check_date ASC, id ASC`;
  const rewards = await sql`SELECT id, kind, amount, reason, quest_day, created_at FROM rewards ORDER BY created_at DESC LIMIT 300`;
  const completions = await sql`SELECT id, quest_day, stars, completed_at FROM quest_completions ORDER BY completed_at DESC`;
  const storedMap = Object.fromEntries(stored.map((r) => [r.skill_id, r.level]));
  const levels = effectiveLevels(storedMap, logs);
  return Response.json({ levels, storedLevels: storedMap, logs, checks, rewards, completions, rec: recommend(levels, logs) });
}
