import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = db().sql;
    const [stars] = await sql<{ total: number }>`SELECT COALESCE(SUM(amount),0)::int AS total FROM rewards WHERE kind = 'star'`;
    const done = await sql<{ quest_day: number }>`SELECT DISTINCT quest_day FROM quest_completions ORDER BY quest_day`;
    return Response.json({ stars: stars.total, completed: done.map((d) => d.quest_day) });
  } catch (e) {
    return Response.json({ stars: 0, completed: [], offline: true, error: String(e) });
  }
}
