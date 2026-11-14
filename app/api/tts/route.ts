import { createHash } from "crypto";
import { getStore } from "@netlify/blobs";
import { allPhrases, isAllowed, type Voice } from "@/lib/phrases";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MODEL = "eleven_multilingual_v2";
const REGION = "ap-southeast-1";

function voiceId(voice: Voice) {
  if (voice === "mooshak") return process.env.ELEVENLABS_VOICE_MOOSHAK || process.env.ELEVENLABS_VOICE_NARRATOR || "jBpfuIE2acCO8z3wKNLl";
  return process.env.ELEVENLABS_VOICE_NARRATOR || "EXAVITQu4vr4xnSDxMaL";
}

function settings(voice: Voice) {
  return voice === "mooshak"
    ? { stability: 0.35, similarity_boost: 0.75, style: 0.6, use_speaker_boost: true }
    : { stability: 0.5, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true };
}

// GET /api/tts?v=narrator&t=... -> audio/mpeg. Generated once with ElevenLabs, then served from Netlify Blobs.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = (url.searchParams.get("t") || "").slice(0, 600);
  const voice = (url.searchParams.get("v") === "mooshak" ? "mooshak" : "narrator") as Voice;

  if (url.searchParams.get("status") === "1") {
    return Response.json({ configured: Boolean(process.env.ELEVENLABS_API_KEY) });
  }
  if (url.searchParams.get("list") === "1") {
    if (!(await isAdmin())) return new Response("unauthorized", { status: 401 });
    return Response.json({ phrases: allPhrases() });
  }
  if (!text || !isAllowed(text, voice)) return new Response("not allowed", { status: 403 });

  const vid = voiceId(voice);
  const key = createHash("sha256").update(`${MODEL}|${vid}|${JSON.stringify(settings(voice))}|${text}`).digest("hex");
  let store: ReturnType<typeof getStore> | null = null;
  try {
    store = getStore({ name: "tts-cache", region: REGION });
  } catch {
    store = null; // Blobs not available (local dev)
  }
  const headers = { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000, immutable" };

  try {
    const cached = store ? await store.get(key, { type: "arrayBuffer" }) : null;
    if (cached) return new Response(cached, { headers });
  } catch {
    // Blobs unavailable (e.g. local dev) - fall through to generation.
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return new Response("tts not configured", { status: 503 });

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: settings(voice) }),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    return new Response(`tts failed: ${r.status} ${detail.slice(0, 300)}`, { status: 502 });
  }
  const audio = await r.arrayBuffer();
  try {
    if (store) await store.set(key, audio, { metadata: { text: text.slice(0, 200), voice } });
  } catch {
    // Cache write failed; still return the audio.
  }
  return new Response(audio, { headers });
}
