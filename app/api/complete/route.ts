import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Called by the kid side when a quest ends. Stars: 3 for finishing, +1 Mooshak fixed, +1 tried again after a miss.
export async function POST(req: Request) {
  const body = await req.json();
  const day = Number(body.day);
  if (!Number.isInteger(day) || day < 1 || day > 60) return Response.json({ error: "bad day" }, { status: 400 });
  const awards: { amount: number; reason: string }[] = [{ amount: 3, reason: `Finished quest ${day}` }];
  if (body.mooshakFixed) awards.push({ amount: 1, reason: `Fixed Mooshak's mistake (quest ${day})` });
  if (body.triedAgain) awards.push({ amount: 1, reason: `Tried again after a miss (quest ${day})` });
  const stars = awards.reduce((a, b) => a + b.amount, 0);
  const sql = db().sql;
  await sql`INSERT INTO quest_completions (quest_day, stars, summary) VALUES (${day}, ${stars}, ${JSON.stringify(body.summary ?? {})})`;
  for (const a of awards) {
    await sql`INSERT INTO rewards (kind, amount, reason, quest_day) VALUES ('star', ${a.amount}, ${a.reason}, ${day})`;
  }
  const [t] = await sql<{ total: number }>`SELECT COALESCE(SUM(amount),0)::int AS total FROM rewards WHERE kind = 'star'`;
  return Response.json({ stars, total: t.total, awards });
}
