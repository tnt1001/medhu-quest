// Every line the app speaks. The TTS endpoint only voices lines in this list,
// so the ElevenLabs key can't be used to generate arbitrary audio.
import { QUESTS } from "@/content/quests";
import { ENGLISH, HINDI_DEV } from "@/content/skills";

export type Voice = "narrator" | "mooshak";

export const P = {
  number: (n: number) => (n >= 0 && n <= 20 ? `${ENGLISH[n]}... ${HINDI_DEV[n]}` : String(n)),
  giveN: (n: number) => `I want ${n} modaks, please!`,
  tooMany: "Too many! Take some back.",
  notEnough: "Not enough! Add some more.",
  exactly: (n: number) => `Exactly ${n}! Shabaash!`,
  tapToCount: "Tap each one to count it!",
  howManyModaks: "So... how many modaks?",
  howManySaw: "How many did you see?",
  whichMore: "Which plate has more?",
  countAgain: "Hmm, count them again!",
  whatNext: "What comes next?",
  colorWell: (c: string) => `${c}! Well done!`,
  findShapes: (s: string) => `Find all the ${s}s!`,
  foundAll: "You found them all!",
  shakeWeb: "Whoooosh! The web shakes! Now how many modaks are there?",
  mooshakClaim: (n: number) => `I count ${n} modaks!`,
  mooshakHmm: "Hmm, are you sure? Count again!",
  mooshakThanks: "Thank you, Medhu! You fixed my mistake!",
  easyOne: "One last easy one!",
  questDone: "Quest complete! Shabaash, Medhu!",
  phoneDown: "Phone down! Time for a real-world game with Papa.",
  learnIntro: "Let's learn the trick!",
  newPower: (name: string) => `You got a new power: ${name}!`,
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
  for (let n = 1; n <= 12; n++) { add(P.giveN(n)); add(P.exactly(n)); add(P.mooshakClaim(n), "mooshak"); }
  COLORS.forEach((c) => add(P.colorWell(c)));
  SHAPES.forEach((s) => add(P.findShapes(s)));
  [P.tooMany, P.notEnough, P.tapToCount, P.howManyModaks, P.howManySaw, P.whichMore, P.countAgain, P.whatNext, P.foundAll, P.shakeWeb, P.easyOne, P.questDone, P.phoneDown].forEach((t) => add(t));
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
