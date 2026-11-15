import { allPhrases } from "@/lib/phrases";
import { isAdmin } from "@/lib/auth";
import { apiKey, diagnose } from "@/lib/tts";

export const dynamic = "force-dynamic";
export const maxDuration = 26;

const NO_STORE = { "Cache-Control": "no-store, max-age=0", "Netlify-CDN-Cache-Control": "no-store" };

// Status, phrase list and diagnostics. Audio itself is served from /api/audio/[voice]/[id].
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("list") === "1") {
    if (!(await isAdmin())) return new Response("unauthorized", { status: 401, headers: NO_STORE });
    return Response.json({ phrases: allPhrases() }, { headers: NO_STORE });
  }
  if (url.searchParams.get("diag") === "1") return diagnose();
  return Response.json({ configured: Boolean(apiKey()) }, { headers: NO_STORE });
}
