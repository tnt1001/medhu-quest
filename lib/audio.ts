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
  if (m) { stop(); stopMusic(); } else if (musicOn()) startMusic();
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
  if (musicOn()) startMusic();
}

if (typeof window !== "undefined") {
  const once = () => { unlock(); window.removeEventListener("touchstart", once); window.removeEventListener("pointerdown", once); };
  window.addEventListener("touchstart", once, { passive: true });
  window.addEventListener("pointerdown", once);
  window.addEventListener("pointerdown", (e) => {
    const el = e.target as HTMLElement | null;
    if (el?.closest("button, a.btn, a.tile, .playbtn")) sfx.click();
  });
}

export function stop() {
  const a = audio();
  if (a) { a.pause(); }
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

function browserSpeak(text: string): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return sleep(readMs(text));
  window.speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
    u.rate = 0.9;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    // Some phones never fire onend; don't wait longer than a slow read.
    setTimeout(finish, readMs(text) * 1.6);
    window.speechSynthesis.speak(u);
  });
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// How long a grown-up takes to read a line aloud to a 4-year-old.
export const readMs = (text: string) => Math.max(2200, text.split(/\s+/).length * 400);

// Narrate a line and resolve when it has finished (or after a reading-time estimate when muted).
export async function narrate(text: string, voice: Voice = "narrator") {
  if (isMuted()) return sleep(readMs(text));
  const started = Date.now();
  await say(text, voice);
  // If speech failed or ended early, still leave time for a grown-up to read the line.
  const left = readMs(text) * 0.75 - (Date.now() - started);
  if (left > 0) await sleep(left);
}

export const ttsUrl = (text: string, voice: Voice = "narrator") => `/api/tts?v=${voice}&t=${encodeURIComponent(text)}`;

// Speak a line with the ElevenLabs voice (cached on the server); falls back to the phone's voice.
export function say(text: string, voice: Voice = "narrator"): Promise<void> {
  if (isMuted()) return Promise.resolve();
  duck(true);
  return sayInner(text, voice).finally(() => duck(false));
}

function sayInner(text: string, voice: Voice): Promise<void> {
  const a = audio();
  if (!a || !aiAvailable) return browserSpeak(text);
  stop();
  return new Promise((resolve) => {
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      browserSpeak(text).then(resolve);
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
function tone(freqs: number[], dur = 0.12, type: OscillatorType = "sine", gain = 0.15, slide = 0) {
  if (isMuted() || !ctx) return;
  const t0 = ctx.currentTime;
  freqs.forEach((f, i) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0 + i * dur);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f * slide), t0 + (i + 1) * dur);
    g.gain.setValueAtTime(0, t0 + i * dur);
    g.gain.linearRampToValueAtTime(gain, t0 + i * dur + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (i + 1) * dur + 0.08);
    o.connect(g).connect(ctx!.destination);
    o.start(t0 + i * dur);
    o.stop(t0 + (i + 1) * dur + 0.1);
  });
}
function noise(dur = 0.4, from = 400, to = 3000, gain = 0.12) {
  if (isMuted() || !ctx) return;
  const t0 = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + dur);
}
function emit(name: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(name));
}
export const sfx = {
  right: () => { tone([660, 880, 1320], 0.09, "triangle"); vibrate(30); emit("medhu:right"); },
  wrong: () => { tone([300, 200], 0.14, "square", 0.05, 0.8); vibrate([40, 40, 40]); emit("medhu:wrong"); },
  tap: () => tone([520, 780], 0.04, "triangle", 0.07),
  click: () => tone([900], 0.03, "sine", 0.04),
  pop: () => tone([400], 0.08, "sine", 0.12, 2.2),
  drop: () => tone([700], 0.1, "sine", 0.1, 0.45),
  whoosh: () => noise(0.45, 300, 2600, 0.1),
  swish: () => noise(0.25, 1800, 600, 0.05),
  tick: () => tone([1200], 0.025, "square", 0.025),
  star: () => tone([1047, 1568], 0.07, "triangle", 0.09),
  locked: () => tone([180, 140], 0.12, "square", 0.05),
  unlock: () => tone([523, 784, 1047], 0.07, "triangle", 0.1),
  win: () => tone([523, 659, 784, 1047, 1319], 0.11, "triangle"),
};
function vibrate(p: number | number[]) {
  try { navigator.vibrate?.(p); } catch {}
}

/* ---------- Background music: a peppy loop played by a tiny WebAudio sequencer ---------- */
const BPM = 118;
const STEP = 60 / BPM / 4; // 16th notes
// 4 bars, 16 steps each: C - Am - F - G. null = rest. MIDI note numbers.
const LEAD: (number | null)[] = [
  72, null, 76, null, 79, null, 76, 77, 79, null, 76, null, 74, null, 72, null,
  69, null, 72, null, 76, null, 74, 72, 74, null, 72, null, 69, null, 67, null,
  65, null, 69, null, 72, null, 74, 72, 74, null, 76, null, 77, null, 76, null,
  71, null, 74, null, 79, null, 77, 76, 74, null, 71, null, 74, null, null, null,
];
const BASS = [48, 45, 41, 43];
const CHORD: number[][] = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
let musicGain: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let nextTime = 0;
let stepIdx = 0;
const BASE_VOL = 0.07;

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export function musicOn() {
  try { return localStorage.getItem("medhu-music") !== "0"; } catch { return true; }
}
export function setMusicOn(on: boolean) {
  try { localStorage.setItem("medhu-music", on ? "1" : "0"); } catch {}
  if (on && !isMuted()) startMusic(); else stopMusic();
}

function note(freq: number, t: number, dur: number, type: OscillatorType, vol: number) {
  if (!ctx || !musicGain) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(musicGain);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function hat(t: number, vol: number) {
  if (!ctx || !musicGain) return;
  const len = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = 6000;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(musicGain);
  src.start(t);
}
function kick(t: number) {
  if (!ctx || !musicGain) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g).connect(musicGain);
  o.start(t);
  o.stop(t + 0.2);
}

function schedule() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + 0.15) {
    const s = stepIdx % 64;
    const bar = Math.floor(s / 16);
    const inBar = s % 16;
    const pass = Math.floor(stepIdx / 64) % 2;
    const lead = LEAD[s];
    if (lead && !(pass === 1 && inBar % 4 === 2)) note(hz(lead), nextTime, STEP * 1.8, "triangle", 0.35);
    if ([0, 6, 8, 14].includes(inBar)) note(hz(BASS[bar]), nextTime, STEP * 1.6, "sine", 0.6);
    if (inBar === 4 || inBar === 12) CHORD[bar].forEach((m) => note(hz(m), nextTime, STEP * 2.5, "sine", 0.08));
    if (inBar % 2 === 1) hat(nextTime, 0.12);
    if (inBar === 0 || inBar === 8) kick(nextTime);
    nextTime += STEP;
    stepIdx++;
  }
}

export function startMusic() {
  if (typeof window === "undefined" || isMuted() || !musicOn() || !ctx || timer) return;
  musicGain = ctx.createGain();
  musicGain.gain.value = 0;
  musicGain.gain.linearRampToValueAtTime(BASE_VOL, ctx.currentTime + 1.5);
  musicGain.connect(ctx.destination);
  nextTime = ctx.currentTime + 0.1;
  timer = setInterval(schedule, 25);
}
export function stopMusic() {
  if (timer) { clearInterval(timer); timer = null; }
  if (musicGain && ctx) {
    const g = musicGain;
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    setTimeout(() => g.disconnect(), 600);
    musicGain = null;
  }
}
// Quieter music while a line is being read aloud.
export function duck(on: boolean) {
  if (!musicGain || !ctx) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setValueAtTime(musicGain.gain.value, ctx.currentTime);
  musicGain.gain.linearRampToValueAtTime(on ? BASE_VOL * 0.3 : BASE_VOL, ctx.currentTime + 0.3);
}
