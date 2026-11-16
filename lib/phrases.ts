// Every line the app speaks. The TTS endpoint only voices lines in this list,
// so the ElevenLabs key can't be used to generate arbitrary audio.
import { QUESTS } from "@/content/quests";
import { ENGLISH, HINDI_DEV } from "@/content/skills";

export type Voice = "narrator" | "mooshak";

export const P = {
  number: (n: number) => (n >= 0 && n <= 20 ? `${ENGLISH[n]}... ${HINDI_DEV[n]}` : String(n)),
  giveN: (n: number) => `[cheerfully] I want ${n} modaks, please!`,
  tooMany: "[laughs] Oops, too many! Take some back.",
  notEnough: "[curious] Too few! Add more.",
  exactly: (n: number) => `[excited] Exactly ${n}! Shabaash!`,
  tapToCount: "[cheerfully] Tap each one to count it!",
  howManyModaks: "[curious] So... how many modaks?",
  howManySaw: "[curious] How many did you see?",
  whichMore: "[curious] Which plate has more?",
  whichLess: "[curious] Which plate has less?",
  findPlate: (n: number) => `[cheerfully] Find the plate with ${n}!`,
  popN: (n: number) => `[cheerfully] Pop exactly ${n} balloons!`,
  popCount: "[cheerfully] Pop all the balloons, and count them!",
  howManyPopped: "[curious] How many did you pop?",
  feedN: (n: number) => `[excited] Mooshak is hungry! Feed him ${n} modaks!`,
  tooFull: "[laughs] Oh no, too many! Mooshak is too full!",
  stillHungry: "[curious] Mooshak is still hungry! Give him more.",
  yum: "[laughs] Yum yum! Thank you!",
  memoryStart: "[cheerfully] Find the pairs! Match the dots to the number.",
  countAgain: "[warmly] Hmm, count them again!",
  whatNext: "[curious] What comes next?",
  colorWell: (c: string) => `[excited] ${c}! Well done!`,
  findShapes: (s: string) => `[cheerfully] Find all the ${s}s!`,
  foundAll: "[excited] You found them all!",
  shakeWeb: "[dramatic] Whoooosh! The wind blows! [curious] How many modaks now?",
  mooshakClaim: (n: number) => `[proudly] I count ${n} modaks!`,
  mooshakHmm: "[curious] Hmm, are you sure? Count again!",
  mooshakThanks: "[laughs] Thank you, Medhu! You fixed my mistake!",
  easyOne: "[cheerfully] Last one!",
  questDone: "[excited] You did it! Shabaash, Medhu!",
  phoneDown: "[excited] Phone down! Play with Papa now.",
  learnIntro: "[whispers] Let's learn the secret trick!",
  newPower: (name: string) => `[excited] You did it! New power: ${name}!`,
};

const COLORS = ["red", "blue", "yellow", "green"];
const SHAPES = ["circle", "triangle", "square", "rectangle"];

export function allPhrases(): { text: string; voice: Voice }[] {
  const out: { text: string; voice: Voice }[] = [];
  const add = (text: string, voice: Voice = "narrator") => out.push({ text, voice });
  for (const q of QUESTS) {
    add(q.title);
    q.story.forEach((s) => add(s.t));
    q.learn.forEach((l) => add(l.t));
    add(q.teaser);
  }
  for (let n = 0; n <= 20; n++) add(P.number(n));
  for (let n = 1; n <= 12; n++) { add(P.giveN(n)); add(P.exactly(n)); add(P.mooshakClaim(n), "mooshak"); add(P.findPlate(n)); add(P.popN(n)); add(P.feedN(n)); }
  COLORS.forEach((c) => add(P.colorWell(c)));
  SHAPES.forEach((s) => add(P.findShapes(s)));
  [P.popCount, P.howManyPopped, P.tooFull, P.stillHungry, P.yum, P.memoryStart, P.whichLess, P.tooMany, P.notEnough, P.tapToCount, P.howManyModaks, P.howManySaw, P.whichMore, P.countAgain, P.whatNext, P.foundAll, P.shakeWeb, P.easyOne, P.questDone, P.phoneDown].forEach((t) => add(t));
  add(P.learnIntro);
  for (const q of QUESTS) add(P.newPower(q.power.name));
  add(P.mooshakHmm, "mooshak");
  add(P.mooshakThanks, "mooshak");
  return out;
}

let cache: Set<string> | null = null;
export function isAllowed(text: string, voice: Voice) {
  if (!cache) cache = new Set(allPhrases().map((p) => `${p.voice}|${p.text}`));
  return cache.has(`${voice}|${text}`);
}

// Stable short id for a line, used in the audio URL so each line gets its own cached file.
export function phraseId(text: string, voice: Voice) {
  let h = 0x811c9dc5;
  const str = `${voice}|${text}`;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

let byId: Map<string, { text: string; voice: Voice }> | null = null;
export function phraseById(id: string) {
  if (!byId) byId = new Map(allPhrases().map((p) => [phraseId(p.text, p.voice), p]));
  return byId.get(id) ?? null;
}

// Strip ElevenLabs emotion tags like [excited] for anything shown on screen or read by the phone voice.
export const clean = (t: string) => t.replace(/\[[a-z ]+\]\s*/gi, "").trim();
