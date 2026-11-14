"use client";
import { ENGLISH, HINDI, HINDI_DEV } from "@/content/skills";

export function speak(text: string, lang: "en-IN" | "hi-IN" = "en-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang === lang) || window.speechSynthesis.getVoices().find((x) => x.lang.startsWith(lang.slice(0, 2)));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function sayNumber(n: number) {
  if (n < 0 || n > 20) return speak(String(n));
  speak(`${ENGLISH[n]}`, "en-IN");
  setTimeout(() => speak(HINDI_DEV[n], "hi-IN"), 900);
}

export function numberWords(n: number) {
  if (n < 0 || n > 20) return String(n);
  return `${ENGLISH[n]} · ${HINDI[n]} · ${HINDI_DEV[n]}`;
}
