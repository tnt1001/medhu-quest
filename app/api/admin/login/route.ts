import { pinMatches, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { pin } = await req.json();
  if (!pinMatches(String(pin ?? ""))) return Response.json({ ok: false }, { status: 401 });
  await setAdminCookie();
  return Response.json({ ok: true });
}
