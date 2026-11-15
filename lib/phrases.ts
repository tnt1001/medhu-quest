// Every line the app speaks. The TTS endpoint only voices lines in this list,
// so the ElevenLabs key can't be used to generate arbitrary audio.
import { QUESTS } from "@/content/quests";
import { ENGLISH, HINDI_DEV } from "@/content/skills";

export type Voice = "narrator" | "mooshak";

export const P = {
  number: (n: number) => (n >= 0 && n <= 20 ? `${ENGLISH[n]}... ${HINDI_DEV[n]}` : String(n)),
  giveN: (n: number) => `Mujhe ${n} modak chahiye, please!`,
  tooMany: "Arre, zyada ho gaye! Kuch wapas rakho.",
  notEnough: "Kam hain! Aur daalo.",
  exactly: (n: number) => `Ekdum ${n}! Shabaash!`,
  tapToCount: "Har modak ko touch karke gino!",
  howManyModaks: "Toh... kitne modak hain?",
  howManySaw: "Kitne dekhe?",
  whichMore: "Kis plate mein zyada hain?",
  countAgain: "Hmm, ek baar phir gino!",
  whatNext: "Aage kya aayega?",
  colorWell: (c: string) => `${({ red: "Laal", blue: "Neela", yellow: "Peela", green: "Hara" } as Record<string, string>)[c] ?? c}! Bahut badhiya!`,
  findShapes: (s: string) => `Saare ${s} dhoondo!`,
  foundAll: "Wah! Saare dhoondh liye!",
  shakeWeb: "Whoooosh! Jaal hil gaya! Ab kitne modak hain?",
  mooshakClaim: (n: number) => `Maine gine... ${n} modak!`,
  mooshakHmm: "Hmm, pakka? Phir se gino!",
  mooshakThanks: "Thank you Medhu! Tumne meri galti theek kar di!",
  easyOne: "Ek aakhri, ekdum aasaan!",
  questDone: "Game khatam! Shabaash Medhu!",
  phoneDown: "Phone neeche rakho! Ab Papa ke saath asli game.",
  learnIntro: "Chalo trick seekhte hain!",
  newPower: (name: string) => `Wah! Tumhe mili nayi power: ${name}!`,
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
