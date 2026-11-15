import { createHash } from "crypto";
import { getStore } from "@netlify/blobs";
import { allPhrases, isAllowed, type Voice } from "@/lib/phrases";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 26;

const MODEL = "eleven_multilingual_v2";

function voiceId(voice: Voice) {
  if (voice === "mooshak") return (process.env.ELEVENLABS_VOICE_MOOSHAK || process.env.ELEVENLABS_VOICE_NARRATOR || "EXAVITQu4vr4xnSDxMaL").trim();
  return (process.env.ELEVENLABS_VOICE_NARRATOR || "EXAVITQu4vr4xnSDxMaL").trim();
}

function settings(voice: Voice) {
  return voice === "mooshak"
    ? { stability: 0.35, similarity_boost: 0.75, style: 0.6, use_speaker_boost: true }
    : { stability: 0.5, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true };
}

const apiKey = () => (process.env.ELEVENLABS_API_KEY || "").trim();

// Never let one slow step hang the whole request.
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`${label} timed out after ${ms}ms`)), ms))]);
}

function cacheStore() {
  try {
    return getStore("tts-cache");
  } catch {
    return null; // Blobs not available (e.g. local dev)
  }
}

async function elevenlabs(text: string, voice: Voice) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId(voice)}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": apiKey(), "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: settings(voice) }),
      signal: ctrl.signal,
    });
    return r;
  } finally {
    clearTimeout(t);
  }
}

// GET /api/tts?v=narrator&t=... -> audio/mpeg. Generated once with ElevenLabs, then served from Netlify Blobs.
export async function GET(req: Request) {
  const url = new URL(req.url);

  if (url.searchParams.get("status") === "1") {
    return Response.json({ configured: Boolean(apiKey()) });
  }
  if (url.searchParams.get("list") === "1") {
    if (!(await isAdmin())) return new Response("unauthorized", { status: 401 });
    return Response.json({ phrases: allPhrases() });
  }
  if (url.searchParams.get("diag") === "1") return diagnose(); // reveals no secrets

  const text = (url.searchParams.get("t") || "").slice(0, 600);
  const voice = (url.searchParams.get("v") === "mooshak" ? "mooshak" : "narrator") as Voice;
  if (!text || !isAllowed(text, voice)) return new Response("not allowed", { status: 403 });

  const key = createHash("sha256").update(`${MODEL}|${voiceId(voice)}|${JSON.stringify(settings(voice))}|${text}`).digest("hex");
  const store = cacheStore();
  const headers = { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000, immutable" };

  if (store) {
    try {
      const cached = await withTimeout(store.get(key, { type: "arrayBuffer" }), 3000, "cache read");
      if (cached) return new Response(cached, { headers });
    } catch (e) {
      console.log("tts cache read failed:", String(e));
    }
  }

  if (!apiKey()) return new Response("tts not configured", { status: 503 });

  let r: Response;
  try {
    r = await elevenlabs(text, voice);
  } catch (e) {
    console.log("elevenlabs request failed:", String(e));
    return new Response(`tts failed: ${String(e)}`, { status: 504 });
  }
  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    console.log("elevenlabs error", r.status, detail.slice(0, 300));
    return new Response(`tts failed: ${r.status} ${detail.slice(0, 300)}`, { status: 502 });
  }
  const audio = await r.arrayBuffer();
  if (store) {
    try {
      await withTimeout(store.set(key, audio, { metadata: { voice } }), 3000, "cache write");
    } catch (e) {
      console.log("tts cache write failed:", String(e));
    }
  }
  return new Response(audio, { headers });
}

// Admin-only check of each step, so problems show up as a clear message.
async function diagnose() {
  const out: Record<string, unknown> = {};
  const k = apiKey();
  out.keyPresent = Boolean(k);
  out.keyLooksRight = k.startsWith("sk_");
  out.keyLength = k.length;
  out.narratorVoice = voiceId("narrator");
  out.mooshakVoice = voiceId("mooshak");

  const t0 = Date.now();
  try {
    const store = cacheStore();
    if (!store) out.cache = "not available";
    else {
      await withTimeout(store.set("diag", "ok"), 3000, "cache write");
      const v = await withTimeout(store.get("diag", { type: "text" }), 3000, "cache read");
      out.cache = v === "ok" ? `ok (${Date.now() - t0}ms)` : `unexpected value ${v}`;
    }
  } catch (e) {
    out.cache = `error: ${String(e)}`;
  }

  const t1 = Date.now();
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": k }, signal: ctrl.signal });
    clearTimeout(t);
    const body = await r.text();
    out.elevenlabsKey = r.ok ? `ok (${Date.now() - t1}ms)` : `HTTP ${r.status}: ${body.slice(0, 200)}`;
    if (r.ok) {
      try {
        const j = JSON.parse(body);
        out.plan = j.tier;
        out.charactersUsed = `${j.character_count} / ${j.character_limit}`;
      } catch {}
    }
  } catch (e) {
    out.elevenlabsKey = `error: ${String(e)}`;
  }

  const t2 = Date.now();
  try {
    const r = await elevenlabs("Hello Medhu!", "narrator");
    out.narratorTest = r.ok ? `ok (${Date.now() - t2}ms)` : `HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`;
  } catch (e) {
    out.narratorTest = `error: ${String(e)}`;
  }
  return Response.json(out);
}
