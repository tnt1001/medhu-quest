"use client";
import { ENGLISH, HINDI, HINDI_DEV } from "@/content/skills";
import { P, type Voice } from "@/lib/phrases";

// One shared <audio> element. Mobile browsers only allow playback after a tap,
// so we "unlock" it on the first touch and reuse it for everything after.
let el: HTMLAudioElement | null = null;
let unlocked = false;
let aiAvailable = true;
let ctx: AudioContext | null = null;

const SILENT = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAABgAAAykAWlpaWlpaWlpaWlpaWlpaWnt7e3t7e3t7e3t7e3t7e3t7nJycnJycnJycnJycnJycnL29vb29vb29vb29vb29vb293t7e3t7e3t7e3t7e3t7e3t7/////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCowAAAAAAAAMpso+sIAAAAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";

function audio() {
  if (!el && typeof window !== "undefined") {
    el = new Audio();
    el.preload = "auto";
  }
  return el;
}

export function isMuted() {
  try { return localStorage.getItem("medhu-muted") === "1"; } catch { return false; }
}
export function setMuted(m: boolean) {
  try { localStorage.setItem("medhu-muted", m ? "1" : "0"); } catch {}
  if (m) stop();
}

export function unlock() {
  if (unlocked) return;
  const a = audio();
  if (!a) return;
  a.src = SILENT;
  a.play().then(() => { unlocked = true; }).catch(() => {});
  try {
    ctx = ctx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch {}
}

if (typeof window !== "undefined") {
  const once = () => { unlock(); window.removeEventListener("touchstart", once); window.removeEventListener("pointerdown", once); };
  window.addEventListener("touchstart", once, { passive: true });
  window.addEventListener("pointerdown", once);
}

export function stop() {
  const a = audio();
  if (a) { a.pause(); }
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

function browserSpeak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = /[ऀ-ॿ]/.test(text) ? "hi-IN" : "en-IN";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export const ttsUrl = (text: string, voice: Voice = "narrator") => `/api/tts?v=${voice}&t=${encodeURIComponent(text)}`;

// Speak a line with the ElevenLabs voice (cached on the server); falls back to the phone's voice.
export function say(text: string, voice: Voice = "narrator"): Promise<void> {
  if (isMuted()) return Promise.resolve();
  const a = audio();
  if (!a || !aiAvailable) { browserSpeak(text); return Promise.resolve(); }
  stop();
  return new Promise((resolve) => {
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      browserSpeak(text);
      resolve();
    };
    a.onended = () => resolve();
    a.onerror = () => {
      // 503 = no ElevenLabs key yet; stop trying for this session.
      fetch(ttsUrl(text, voice)).then((r) => { if (r.status === 503) aiAvailable = false; }).catch(() => {});
      fallback();
    };
    a.src = ttsUrl(text, voice);
    a.play().catch(fallback);
  });
}

// Warm the browser cache so the next line starts instantly.
export function preload(text: string, voice: Voice = "narrator") {
  if (typeof window === "undefined" || !aiAvailable) return;
  fetch(ttsUrl(text, voice)).catch(() => {});
}

export const sayNumber = (n: number) => say(P.number(n));

export function numberWords(n: number) {
  if (n < 0 || n > 20) return String(n);
  return `${ENGLISH[n]} · ${HINDI[n]} · ${HINDI_DEV[n]}`;
}

// Short sound effects made with WebAudio - no files needed.
function tone(freqs: number[], dur = 0.12, type: OscillatorType = "sine", gain = 0.15) {
  if (isMuted() || !ctx) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t0 + i * dur);
    g.gain.linearRampToValueAtTime(gain, t0 + i * dur + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (i + 1) * dur + 0.08);
    o.connect(g).connect(ctx!.destination);
    o.start(t0 + i * dur);
    o.stop(t0 + (i + 1) * dur + 0.1);
  });
}
export const sfx = {
  right: () => { tone([660, 880, 1320], 0.09, "triangle"); vibrate(30); },
  wrong: () => { tone([220, 180], 0.12, "sawtooth", 0.06); vibrate([40, 40, 40]); },
  tap: () => tone([520], 0.05, "triangle", 0.08),
  win: () => tone([523, 659, 784, 1047, 1319], 0.11, "triangle"),
};
function vibrate(p: number | number[]) {
  try { navigator.vibrate?.(p); } catch {}
}
