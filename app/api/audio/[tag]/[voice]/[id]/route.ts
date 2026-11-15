import { phraseById, type Voice } from "@/lib/phrases";
import { audioFor } from "@/lib/tts";

export const dynamic = "force-dynamic";
export const maxDuration = 26;

// GET /api/audio/<voice tag>/narrator/1a2b3c4d.mp3 - one URL per line and voice version, so caches never serve a stale clip.
export async function GET(_req: Request, { params }: { params: Promise<{ tag: string; voice: string; id: string }> }) {
  const { voice, id } = await params;
  const v = (voice === "mooshak" ? "mooshak" : "narrator") as Voice;
  const p = phraseById(id.replace(/\.mp3$/, ""));
  if (!p || p.voice !== v) return new Response("not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  return audioFor(p.text, v);
}
