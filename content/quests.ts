export type Item = "modak" | "diya" | "star" | "laddoo" | "vanara" | "stone" | "arrow";
export type ShapeName = "circle" | "triangle" | "square" | "rectangle";

export type Game =
  | { type: "count"; item: Item; rounds: number[] }
  | { type: "flash"; item: Item; layout: Layout; rounds: number[] }
  | { type: "giveN"; item: Item; rounds: number[] }
  | { type: "conserve"; item: Item; rounds: number[] }
  | { type: "compare"; item: Item; rounds: [number, number][]; ask?: "more" | "less" }
  | { type: "pick"; item: Item; layout: Layout; rounds: number[] }
  | { type: "balloons"; mode: "count" | "give"; rounds: number[] }
  | { type: "feed"; rounds: number[] }
  | { type: "memory"; rounds: number[][] }
  | { type: "pattern"; rounds: string[][] }
  | { type: "shapes"; rounds: ShapeName[] }
  | { type: "mixed"; parts: Game[] }
  | { type: "check"; items: number[] }
  | { type: "hop"; mode: "guess" | "tap"; rounds: [number, number][] }
  | { type: "shield"; item: Item; rounds: [number, number][] }
  | { type: "army"; item: Item; op: "add" | "take"; rounds: [number, number][] }
  | { type: "cards"; rounds: [number, number][] }
  | { type: "size"; rounds: number[] };

export type Layout = "scatter" | "dice" | "frame5" | "frame10";

export type Bg = "feast" | "temple" | "night" | "kitchen" | "sky" | "sea" | "lanka" | "camp";
export type Mood = "happy" | "confused" | "excited" | "thinking";

export interface Scene {
  bg: Bg;
  cast?: ("ganesha" | "mooshak" | "ram" | "ravan" | "hanuman")[];
  kaalu?: boolean;
  mood?: Mood;
  web?: boolean;
  swing?: boolean;
  items?: { item: Item; n: number; on?: "plate" | "web" | "floor" };
  big?: string;
}

export interface Panel { t: string; s: Scene }

export type Demo =
  | { type: "count"; item: Item; n: number }
  | { type: "glance"; item: Item; n: number }
  | { type: "giveN"; item: Item; n: number; pile: number }
  | { type: "frame5"; n: number }
  | { type: "conserve"; item: Item; n: number }
  | { type: "match"; item: Item; a: number; b: number }
  | { type: "dice"; n: number }
  | { type: "pattern"; seq: string[] }
  | { type: "shape"; shape: ShapeName }
  | { type: "number"; n: number }
  | { type: "scene"; scene: Scene }
  | { type: "frame10"; n: number }
  | { type: "hop"; from: number; by: number }
  | { type: "hide"; item: Item; total: number; shown: number }
  | { type: "army"; item: Item; op: "add" | "take"; a: number; b: number };

export interface LearnStep { t: string; demo: Demo }

export interface Quest {
  day: number;
  title: string;
  costars: string[];
  skill: string;
  review: string[];
  power: { name: string; desc: string };
  story: Panel[];
  learn: LearnStep[];
  talk?: string;
  game: Game;
  gameName: string;
  physical?: { title: string; steps: string[] };
  mistake?: { item: Item; shown: number; claim: number };
  easyWin: { item: Item; n: number };
  teaser: string;
}

export interface Arc {
  id: number;
  title: string;
  costars: string;
  days: [number, number];
  trophy: string;
}

export const ARCS: Arc[] = [
  { id: 1, title: "The Modak Mission", costars: "Lord Ganesha + Mooshak", days: [1, 12], trophy: "Golden Modak" },
  { id: 2, title: "Ram vs Ravan: Battle of Lanka", costars: "Lord Ram + Lord Hanuman", days: [13, 24], trophy: "Ram's Golden Bow" },
  { id: 3, title: "Durga vs Mahishasura", costars: "Goddess Durga", days: [25, 36], trophy: "Durga's Lion" },
  { id: 4, title: "Krishna vs Kaliya", costars: "Lord Krishna", days: [37, 48], trophy: "Krishna's Flute" },
];

export const CARDS = [
  { name: "Mooshak", world: "Guide", color: "#8d6e63" },
  { name: "Ganesha", world: "Mythology", color: "#ef6c00" },
  { name: "Kaalu", world: "Cheeky crow", color: "#2b2f38" },
  { name: "Hanuman", world: "Mythology", color: "#e65100" },
  { name: "Durga", world: "Mythology", color: "#c2185b" },
  { name: "Krishna", world: "Mythology", color: "#283593" },
  { name: "Shiva", world: "Mythology", color: "#455a64" },
  { name: "Ram", world: "Mythology", color: "#3b6fc4" },
];

export const STARS_PER_CARD = 10;

const F = (o: Partial<Scene> = {}): Scene => ({ bg: "feast", ...o });
const L = (o: Partial<Scene> = {}): Scene => ({ bg: "lanka", ...o });
const S = (o: Partial<Scene> = {}): Scene => ({ bg: "sea", ...o });
const C = (o: Partial<Scene> = {}): Scene => ({ bg: "camp", ...o });

export const QUESTS: Quest[] = [
  {
    day: 1, title: "Helper Test", costars: ["Mooshak", "Ganesha"], skill: "C2", review: [],
    power: { name: "Modak Helper", desc: "You passed the Helper Test!" },
    story: [
      { t: "[excited] It's Lord Ganesha's birthday soon! He wants LOTS of modaks for his party.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[nervously] But Mooshak can't count them all! [gasps] And Kaalu the crow keeps stealing modaks!", s: F({ kaalu: true, cast: ["mooshak"], mood: "confused" }) },
      { t: "[excited] Medhu, will you help? First, play the Helper Test with Papa!", s: F({ cast: ["ganesha", "mooshak"], mood: "excited" }) },
    ],
    learn: [],
    gameName: "Helper Test",
    game: { type: "check", items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Next: your first modak mission!",
  },
  {
    day: 2, title: "How many modaks?", costars: ["Mooshak", "Ganesha"], skill: "C2", review: [],
    power: { name: "Last Number Power", desc: "The last number you say tells you how many." },
    story: [
      { t: "[excited] You passed! Lord Ganesha gives you a gold helper badge!", s: F({ cast: ["ganesha"], big: "★" }) },
      { t: "[laughs] Mooshak counts the modaks: one, two, three, four, five... then counts them AGAIN and AGAIN!", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[whispers] There's a secret trick, so you never count twice. Let's learn it!", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "[warmly] Touch each modak once and count: one, two, three, four.", demo: { type: "count", item: "modak", n: 4 } },
      { t: "[excited] The LAST number you say is how many. Four! No need to count again.", demo: { type: "number", n: 4 } },
    ],
    talk: "Count Papa's fingers on one hand together, then ask \"So how many?\" - he should say 5 without counting again.",
    gameName: "Count the modaks",
    game: { type: "mixed", parts: [
      { type: "count", item: "modak", rounds: [3, 4, 5] },
      { type: "balloons", mode: "count", rounds: [4, 5] },
      { type: "pick", item: "modak", layout: "scatter", rounds: [5, 6] },
      { type: "count", item: "modak", rounds: [6, 7] },
    ] },
    physical: { title: "Count real things", steps: ["Put 4-7 small things in a row.", "Medhu touches each one and counts.", "Ask \"So how many?\""] },
    mistake: { item: "modak", shown: 4, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Next: Kaalu zooms past!",
  },
  {
    day: 3, title: "Super eyes", costars: ["Mooshak"], skill: "S1", review: ["C2"],
    power: { name: "Super Eyes 1-3", desc: "You see 1, 2 or 3 in one look." },
    story: [
      { t: "[dramatic] WHOOSH! Kaalu the crow flies past with modaks in his beak!", s: { bg: "sky", kaalu: true, swing: true } },
      { t: "[gasps] He's too fast to count! How many did he take?", s: { bg: "sky", kaalu: true, items: { item: "modak", n: 3, on: "floor" } } },
      { t: "[excited] You need SUPER EYES! See small numbers in one quick look.", s: F({ cast: ["mooshak"], mood: "excited", big: "1 2 3" }) },
    ],
    learn: [
      { t: "[warmly] One modak. Two modaks. You just KNOW them. No counting!", demo: { type: "glance", item: "modak", n: 2 } },
      { t: "[excited] Three modaks make a triangle. Look... three!", demo: { type: "glance", item: "modak", n: 3 } },
    ],
    talk: "Hold up 1, 2 or 3 fingers for a second, then hide them. Medhu says the number!",
    gameName: "Flash!",
    game: { type: "mixed", parts: [
      { type: "flash", item: "modak", layout: "scatter", rounds: [2, 1, 3] },
      { type: "memory", rounds: [[1, 2, 3]] },
      { type: "pick", item: "modak", layout: "dice", rounds: [2, 3] },
      { type: "flash", item: "modak", layout: "scatter", rounds: [3, 2, 3] },
    ] },
    mistake: { item: "modak", shown: 3, claim: 2 },
    easyWin: { item: "modak", n: 1 },
    teaser: "[mischievously] Next: Mooshak opens a shop!",
  },
  {
    day: 4, title: "Modak shop", costars: ["Mooshak", "Ganesha"], skill: "C3", review: ["S1"],
    power: { name: "Exactly Power", desc: "You give exactly the number asked for." },
    story: [
      { t: "[excited] Mooshak opens a modak shop. And YOU are the shopkeeper!", s: { bg: "kitchen", cast: ["mooshak"], mood: "excited", items: { item: "modak", n: 10, on: "floor" } } },
      { t: "[laughs] Lord Ganesha asks for 4. Mooshak gives him 7! Oops, too many!", s: { bg: "kitchen", cast: ["ganesha", "mooshak"], mood: "confused", items: { item: "modak", n: 7, on: "plate" } } },
      { t: "[warmly] A good shopkeeper gives EXACTLY the number asked. Let's learn how!", s: { bg: "kitchen", cast: ["mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "[warmly] Move modaks one at a time and count: one, two, three, four...", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "[excited] When you say the number - STOP! Exactly four.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
    ],
    talk: "Ask Medhu: \"Give me exactly 3 spoons.\" Did he stop at 3?",
    gameName: "Modak shop",
    game: { type: "mixed", parts: [
      { type: "feed", rounds: [3, 4] },
      { type: "giveN", item: "modak", rounds: [4, 5] },
      { type: "balloons", mode: "give", rounds: [5, 6] },
      { type: "giveN", item: "modak", rounds: [7, 8] },
    ] },
    physical: { title: "Real shop", steps: ["Make a pile of 15 small things.", "Say: \"I want 6, please!\"", "Did he stop at 6? Try 4, 7, 8."] },
    mistake: { item: "modak", shown: 6, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Next: Kaalu gets faster!",
  },
  {
    day: 5, title: "Super eyes level 2", costars: ["Mooshak"], skill: "S2", review: ["S1", "C3"],
    power: { name: "Super Eyes 4-5", desc: "You see 4 and 5 in one look." },
    story: [
      { t: "[dramatic] Uh oh! Kaalu now grabs four or five modaks at once!", s: { bg: "sky", kaalu: true, swing: true, items: { item: "modak", n: 5, on: "floor" } } },
      { t: "[gasps] Mooshak tries to count... but Kaalu is gone!", s: { bg: "sky", kaalu: true, cast: ["mooshak"], mood: "confused" } },
      { t: "[excited] Level up your super eyes! Big numbers hide small groups inside.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "[warmly] Four is two and two. Like the corners of a square!", demo: { type: "dice", n: 4 } },
      { t: "[excited] Five is four corners and one in the middle. Like your hand!", demo: { type: "dice", n: 5 } },
    ],
    talk: "Show 4 or 5 fingers quickly. Ask: \"How did you know so fast?\"",
    gameName: "Flash!",
    game: { type: "mixed", parts: [
      { type: "flash", item: "modak", layout: "dice", rounds: [4, 5, 3] },
      { type: "memory", rounds: [[2, 4, 5], [3, 4, 5, 1]] },
      { type: "pick", item: "modak", layout: "dice", rounds: [4, 5] },
      { type: "flash", item: "modak", layout: "scatter", rounds: [4, 5, 4] },
    ] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Next: Lord Ganesha's golden trays!",
  },
  {
    day: 6, title: "Trays of five", costars: ["Ganesha", "Mooshak"], skill: "P1", review: ["S2"],
    power: { name: "Tray of Five", desc: "A full tray is always 5." },
    story: [
      { t: "[cheerfully] Lord Ganesha's golden trays have five holes. One modak in each!", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[gasps] Kaalu stole a modak from a tray! Which tray is it?", s: F({ kaalu: true, cast: ["mooshak"], mood: "confused" }) },
      { t: "[whispers] Trick: a full tray is always five. Look for the empty hole!", s: F({ cast: ["ganesha", "mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "[warmly] All five holes are full. That's five. No counting!", demo: { type: "frame5", n: 5 } },
      { t: "[excited] One hole is empty. Five, one less... four!", demo: { type: "frame5", n: 4 } },
    ],
    talk: "Show 5 fingers - a full hand is a full tray! Fold one down: how many now?",
    gameName: "Tray flash",
    game: { type: "mixed", parts: [
      { type: "flash", item: "modak", layout: "frame5", rounds: [5, 4, 3] },
      { type: "pick", item: "modak", layout: "frame5", rounds: [4, 3] },
      { type: "flash", item: "modak", layout: "frame5", rounds: [2, 4, 1, 5] },
    ] },
    physical: { title: "Egg tray", steps: ["Cut an egg tray to 5 cups.", "Fill it: \"full tray is 5!\"", "Fill 3 or 4: \"how many? how many empty?\""] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "[mischievously] Next: Kaalu makes a big wind!",
  },
  {
    day: 7, title: "The big wind", costars: ["Mooshak"], skill: "C4", review: ["P1", "C2"],
    power: { name: "Still-the-Same Power", desc: "Moving things doesn't change how many." },
    story: [
      { t: "[cheerfully] Mooshak lines up six modaks in a neat row. Six!", s: F({ cast: ["mooshak"], items: { item: "modak", n: 6, on: "plate" } }) },
      { t: "[dramatic] WHOOOSH! Kaalu flaps his wings. The modaks roll everywhere!", s: { bg: "sky", kaalu: true, swing: true, items: { item: "modak", n: 6, on: "floor" } } },
      { t: "[curious] Are there more now? Or less? Let's find out!", s: F({ cast: ["mooshak"], mood: "confused" }) },
    ],
    learn: [
      { t: "[warmly] Five modaks in a row. Watch them move...", demo: { type: "conserve", item: "modak", n: 5 } },
      { t: "[excited] Still five! Moving doesn't change the number.", demo: { type: "number", n: 5 } },
    ],
    talk: "Line up 5 toys, count, then spread them out. Ask: \"Still 5? How do you know?\"",
    gameName: "Windy modaks",
    game: { type: "mixed", parts: [
      { type: "conserve", item: "modak", rounds: [4, 5] },
      { type: "balloons", mode: "count", rounds: [6] },
      { type: "pick", item: "modak", layout: "scatter", rounds: [6, 5] },
      { type: "conserve", item: "modak", rounds: [6, 7] },
    ] },
    physical: { title: "Spread them out", steps: ["Count 6 things in a line together.", "Spread them far apart.", "\"How many now?\" Does he know it's still 6?"] },
    mistake: { item: "modak", shown: 6, claim: 7 },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Next: which plate has more?",
  },
  {
    day: 8, title: "More or less", costars: ["Ganesha", "Mooshak"], skill: "R2", review: ["C4", "S2"],
    power: { name: "More-or-Less Power", desc: "You know which group has more and which has less." },
    story: [
      { t: "[excited] Lord Ganesha says, \"Birthday boy gets the plate with MORE!\"", s: F({ cast: ["ganesha"], mood: "excited", items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[mischievously] But Kaalu spread one plate out wide, so it LOOKS bigger!", s: F({ kaalu: true, items: { item: "modak", n: 4, on: "floor" } }) },
      { t: "[curious] Big-looking isn't always more. How can we be sure?", s: F({ cast: ["mooshak"], mood: "confused" }) },
    ],
    learn: [
      { t: "[warmly] Make pairs. Each top modak holds hands with one below.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "[excited] The row with extra modaks has MORE. The other has LESS.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
    ],
    talk: "Put 3 grapes in front of Papa and 5 in front of Medhu. Who has more? Who has less?",
    gameName: "More or less",
    game: { type: "mixed", parts: [
      { type: "compare", item: "modak", rounds: [[3, 6], [7, 4]] },
      { type: "compare", item: "modak", ask: "less", rounds: [[5, 2], [3, 6]] },
      { type: "compare", item: "modak", rounds: [[6, 7], [8, 7]] },
    ] },
    physical: { title: "Two plates", steps: ["Put 5 on one plate, 7 on another.", "\"Which has more? Which has less?\"", "Spread the 5 out wide. Is he tricked?"] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 4 },
    teaser: "[mischievously] Next: a magic dice!",
  },
  {
    day: 9, title: "Magic dice", costars: ["Mooshak"], skill: "S3", review: ["R2", "P1"],
    power: { name: "Dice Eyes", desc: "You read any dice in one look." },
    story: [
      { t: "[gasps] Mooshak finds a shiny MAGIC DICE under Lord Ganesha's bed!", s: { bg: "night", cast: ["mooshak"], mood: "excited", big: "1-6" } },
      { t: "[mischievously] Kaalu says, \"Caw! Read the dice fast, or the modaks are mine!\"", s: { bg: "night", kaalu: true, cast: ["mooshak"], mood: "confused" } },
      { t: "[whispers] Secret: every dice number has its own picture. Learn the pictures!", s: { bg: "night", cast: ["mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "[warmly] Three is a slide going down. Four is the four corners.", demo: { type: "dice", n: 3 } },
      { t: "[excited] Six is two lines of three. Know the picture, no counting!", demo: { type: "dice", n: 6 } },
    ],
    talk: "Roll a real dice 3 times. Medhu says the number without counting dots.",
    gameName: "Dice flash",
    game: { type: "mixed", parts: [
      { type: "flash", item: "modak", layout: "dice", rounds: [3, 4, 2] },
      { type: "memory", rounds: [[3, 5, 6], [1, 4, 5, 6]] },
      { type: "pick", item: "modak", layout: "dice", rounds: [5, 6] },
      { type: "flash", item: "modak", layout: "dice", rounds: [6, 5, 4, 6] },
    ] },
    physical: { title: "Real dice", steps: ["Roll a real dice together.", "He says the number without counting.", "Show the same number on fingers."] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 1 },
    teaser: "[mischievously] Next: lighting the diyas!",
  },
  {
    day: 10, title: "Diya patterns", costars: ["Ganesha", "Mooshak"], skill: "M1", review: ["S3", "R2"],
    power: { name: "Pattern Power", desc: "You see what repeats and what comes next." },
    story: [
      { t: "[softly] It's getting dark. Lord Ganesha wants diyas in a pretty pattern.", s: { bg: "night", cast: ["ganesha"] } },
      { t: "[laughs] Mooshak mixes them all up! Red, red, blue, red... oops!", s: { bg: "night", cast: ["mooshak"], mood: "confused" } },
      { t: "[excited] Fix the pattern, and the hall will glow! Kaalu can't hide in the light!", s: { bg: "night", kaalu: true, cast: ["mooshak"], mood: "excited" } },
    ],
    learn: [
      { t: "[warmly] A pattern repeats. Red, blue. Red, blue. Red, blue.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "[excited] Say it like a song to find what comes next!", demo: { type: "pattern", seq: ["blue", "blue", "red", "blue", "blue", "red"] } },
    ],
    talk: "Clap-stamp, clap-stamp... what comes next? Make a pattern with your body!",
    gameName: "Diya patterns",
    game: { type: "pattern", rounds: [["red", "blue", "red", "blue", "red"], ["yellow", "green", "yellow", "green"], ["blue", "blue", "red", "blue", "blue"], ["red", "yellow", "green", "red", "yellow"], ["green", "green", "blue", "green", "green", "blue", "green"]] },
    physical: { title: "Block pattern", steps: ["Make red-blue-red-blue with blocks.", "\"What comes next?\"", "Let him make his own pattern for you."] },
    easyWin: { item: "diya", n: 2 },
    teaser: "[mischievously] Next: fix the temple!",
  },
  {
    day: 11, title: "Fix the temple", costars: ["Ganesha", "Mooshak"], skill: "G1", review: ["M1", "S2"],
    power: { name: "Shape Spotter", desc: "You know circles, triangles, squares and rectangles." },
    story: [
      { t: "[gasps] Kaalu knocked blocks off Lord Ganesha's temple!", s: { bg: "temple", kaalu: true, cast: ["ganesha"] } },
      { t: "[curious] The roof needs a triangle. The window, a circle. The door, a rectangle.", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "thinking" } },
      { t: "[excited] Find the right shapes and fix the temple!", s: { bg: "temple", cast: ["mooshak"], mood: "excited" } },
    ],
    learn: [
      { t: "[warmly] A circle is round, with no corners. A triangle has three corners.", demo: { type: "shape", shape: "triangle" } },
      { t: "[excited] A square and a rectangle both have four corners. A rectangle is longer.", demo: { type: "shape", shape: "rectangle" } },
    ],
    talk: "Find one circle and one rectangle in this room together.",
    gameName: "Shape hunt",
    game: { type: "shapes", rounds: ["circle", "triangle", "square", "rectangle", "triangle", "rectangle"] },
    physical: { title: "Shape hunt", steps: ["Walk around the house together.", "Find 2 circles, 2 rectangles, 1 triangle.", "Count the corners of each."] },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Next: THE BIG PARTY!",
  },
  {
    day: 12, title: "The big party", costars: ["Ganesha", "Mooshak"], skill: "C2", review: ["S2", "C3", "R2", "P1"],
    power: { name: "Golden Modak", desc: "You finished the Modak Mission!" },
    story: [
      { t: "[excited] It's Lord Ganesha's BIRTHDAY! The temple glows with diyas!", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "excited" } },
      { t: "[gasps] But Kaalu lands on the roof. \"Caw! I want ALL the modaks!\"", s: { bg: "temple", kaalu: true, cast: ["mooshak"], mood: "confused" } },
      { t: "[dramatic] Use ALL your powers, Medhu! Save the party!", s: F({ cast: ["ganesha"], big: "★★★" }) },
    ],
    learn: [],
    gameName: "Party challenge",
    game: { type: "mixed", parts: [
      { type: "flash", item: "modak", layout: "scatter", rounds: [4, 5] },
      { type: "feed", rounds: [7] },
      { type: "memory", rounds: [[2, 4, 5, 6]] },
      { type: "compare", item: "modak", ask: "less", rounds: [[6, 7]] },
      { type: "pick", item: "modak", layout: "frame5", rounds: [4] },
      { type: "flash", item: "modak", layout: "dice", rounds: [6] },
    ] },
    physical: { title: "Helper Test again", steps: ["Run the 12-item Medhu Maths Check today or tomorrow.", "Enter scores in Admin > Checks, label \"Day 14\"."] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "[excited] You beat Kaalu! Next arc: Lord Ram vs Ravan!",
  },
  // ===================== ARC 2: Ram vs Ravan, the Battle of Lanka =====================
  {
    day: 13, title: "Ravan's trick", costars: ["Ram", "Hanuman"], skill: "R3", review: ["C2", "S2"],
    power: { name: "One More Power", desc: "One more is the NEXT number." },
    story: [
      { t: "[dramatic] Uh oh! Ten-headed Ravan grabbed Sita and flew away to Lanka!", s: L({ cast: ["ravan"] }) },
      { t: "[determined] Lord Ram says, \"I will bring Sita home!\" But he needs an army.", s: C({ cast: ["ram"] }) },
      { t: "[excited] Monkeys come to help, one more, and one more, and one more! Let's count them!", s: C({ cast: ["hanuman"], items: { item: "vanara", n: 4, on: "floor" } }) },
    ],
    learn: [
      { t: "[warmly] Lord Hanuman stands on stone four. One jump more... he lands on five!", demo: { type: "hop", from: 4, by: 1 } },
      { t: "[excited] One more is always the NEXT number. After seven comes... eight!", demo: { type: "hop", from: 7, by: 1 } },
    ],
    talk: "Hold up 5 fingers. Add one more finger. \"How many now?\" Try 7 and 9 too.",
    gameName: "Stone Hop",
    game: { type: "mixed", parts: [
      { type: "hop", mode: "guess", rounds: [[3, 1], [5, 1]] },
      { type: "army", item: "vanara", op: "add", rounds: [[4, 1], [6, 1]] },
      { type: "hop", mode: "guess", rounds: [[8, 1], [11, 1], [14, 1]] },
    ] },
    physical: { title: "One more", steps: ["Make a row of 6 spoons.", "Add one more. \"How many now?\"", "Ask him not to count from one!"] },
    mistake: { item: "vanara", shown: 6, claim: 5 },
    easyWin: { item: "vanara", n: 3 },
    teaser: "[mischievously] Next: one step BACK!",
  },
  {
    day: 14, title: "One step back", costars: ["Hanuman"], skill: "R3", review: ["R3", "C3"],
    power: { name: "One Less Power", desc: "One less is the number BEFORE." },
    story: [
      { t: "[curious] Lord Hanuman tiptoes to the sea to look for Lanka.", s: S({ cast: ["hanuman"] }) },
      { t: "[gasps] Oops! A big wave! He must jump BACK, one stone at a time!", s: S({ cast: ["hanuman"], items: { item: "stone", n: 5, on: "floor" } }) },
      { t: "[excited] Help him jump back to the right stone!", s: S({ cast: ["hanuman"], big: "← 1" }) },
    ],
    learn: [
      { t: "[warmly] Lord Hanuman is on six. One jump back... five! One less than six is five.", demo: { type: "hop", from: 6, by: -1 } },
      { t: "[excited] One less is the number BEFORE. Before ten comes... nine!", demo: { type: "hop", from: 10, by: -1 } },
    ],
    talk: "Count down together from 10 to 1 like a rocket, then ask \"One less than 6?\"",
    gameName: "Jump Back",
    game: { type: "mixed", parts: [
      { type: "hop", mode: "guess", rounds: [[4, -1], [6, -1]] },
      { type: "army", item: "stone", op: "take", rounds: [[5, 1], [7, 1]] },
      { type: "hop", mode: "guess", rounds: [[3, 1], [10, -1], [13, -1], [16, 1]] },
    ] },
    physical: { title: "Stair hop", steps: ["Stand on a stair and say its number.", "Step down one. \"What number now?\"", "Mix: one up, one down."] },
    mistake: { item: "stone", shown: 4, claim: 5 },
    easyWin: { item: "stone", n: 2 },
    teaser: "[mischievously] Next: the golden shield!",
  },
  {
    day: 15, title: "The golden shield", costars: ["Hanuman"], skill: "P2", review: ["R3", "P1"],
    power: { name: "Hiding Power", desc: "You know how many are hiding." },
    story: [
      { t: "[whispers] Lord Hanuman sneaks into Lanka with five monkey friends.", s: L({ cast: ["hanuman"], items: { item: "vanara", n: 5, on: "floor" } }) },
      { t: "[gasps] Ravan's guards are coming! Some monkeys hide behind the golden shield.", s: L({ cast: ["hanuman", "ravan"] }) },
      { t: "[curious] Can you work out how many are hiding?", s: L({ cast: ["hanuman"], big: "?" }) },
    ],
    learn: [
      { t: "[warmly] Five monkeys. Three are outside. Count on from three: four, five. Two are hiding!", demo: { type: "hide", item: "vanara", total: 5, shown: 3 } },
      { t: "[excited] Five monkeys. Four are outside. So one is hiding!", demo: { type: "hide", item: "vanara", total: 5, shown: 4 } },
    ],
    talk: "Hide some of 5 coins under your hand. \"How many are hiding?\"",
    gameName: "How Many Hiding",
    game: { type: "mixed", parts: [
      { type: "shield", item: "vanara", rounds: [[4, 3], [5, 4]] },
      { type: "flash", item: "vanara", layout: "frame5", rounds: [3, 4] },
      { type: "shield", item: "vanara", rounds: [[5, 3], [5, 2], [5, 1]] },
    ] },
    physical: { title: "Cup hide", steps: ["Put 5 small things under a cup.", "Take some out. Show them.", "\"How many are still hiding?\" Lift to check."] },
    mistake: { item: "vanara", shown: 5, claim: 4 },
    easyWin: { item: "vanara", n: 3 },
    teaser: "[mischievously] Next: build a bridge across the sea!",
  },
  {
    day: 16, title: "Build the bridge", costars: ["Ram", "Hanuman"], skill: "O1", review: ["P2", "R3"],
    power: { name: "Adding Power", desc: "Some, and some more, make how many?" },
    story: [
      { t: "[curious] Lanka is far across the sea. How will the army get there?", s: S({ cast: ["ram"] }) },
      { t: "[excited] Build a bridge! The monkeys write \"Ram\" on stones, and the stones FLOAT!", s: S({ cast: ["hanuman"], items: { item: "stone", n: 3, on: "floor" } }) },
      { t: "[cheerfully] Three stones, and two more come... How many now? Let's build!", s: S({ cast: ["ram", "hanuman"], big: "3 + 2" }) },
    ],
    learn: [
      { t: "[warmly] Three stones. Two more come. Start at three and count on: four, five!", demo: { type: "army", item: "stone", op: "add", a: 3, b: 2 } },
      { t: "[excited] Two monkeys, and two more. Two and two make four!", demo: { type: "army", item: "vanara", op: "add", a: 2, b: 2 } },
    ],
    talk: "Tell a story: \"3 cars, 1 more comes.\" Act it out with toys.",
    gameName: "Ram Setu",
    game: { type: "mixed", parts: [
      { type: "army", item: "stone", op: "add", rounds: [[2, 1], [3, 1]] },
      { type: "giveN", item: "stone", rounds: [4, 5] },
      { type: "army", item: "stone", op: "add", rounds: [[3, 2], [2, 3], [4, 1]] },
    ] },
    physical: { title: "Bridge of blocks", steps: ["Lay 3 blocks in a line.", "Add 2 more. \"How many now?\"", "Try 1+3, 2+2, 4+1."] },
    mistake: { item: "stone", shown: 5, claim: 4 },
    easyWin: { item: "stone", n: 3 },
    teaser: "[mischievously] Next: Lord Hanuman grows GIANT!",
  },
  {
    day: 17, title: "Hanuman grows!", costars: ["Hanuman"], skill: "M3", review: ["O1", "P2"],
    power: { name: "Size Power", desc: "You put things from small to big." },
    story: [
      { t: "[whispers] Lord Hanuman can make himself tiny, tiny, tiny...", s: C({ cast: ["hanuman"] }) },
      { t: "[dramatic] ...or BIG, BIGGER, GIANT! As tall as a mountain!", s: S({ cast: ["hanuman"], big: "BIG!" }) },
      { t: "[excited] Help him grow, from smallest to biggest!", s: C({ cast: ["hanuman"], mood: "excited" }) },
    ],
    learn: [
      { t: "[warmly] Look for the tiniest one first. Then the middle one. Then the biggest!", demo: { type: "scene", scene: { bg: "camp", cast: ["hanuman"], big: "small → BIG" } } },
    ],
    talk: "Line up 3 cups or shoes from smallest to biggest together.",
    gameName: "Grow Hanuman",
    game: { type: "mixed", parts: [
      { type: "size", rounds: [3, 3] },
      { type: "compare", item: "vanara", rounds: [[3, 5], [7, 6]] },
      { type: "size", rounds: [4, 4] },
    ] },
    physical: { title: "Line them up", steps: ["Find 4 things of different sizes.", "Line them smallest to biggest.", "\"Which is the biggest?\""] },
    easyWin: { item: "vanara", n: 2 },
    teaser: "[mischievously] Next: Ravan's fire arrows!",
  },
  {
    day: 18, title: "Fire arrows", costars: ["Ram"], skill: "O2", review: ["O1", "R3"],
    power: { name: "Take Away Power", desc: "Some go away. How many are left?" },
    story: [
      { t: "[dramatic] The battle begins! Ravan shoots fire arrows across the sky!", s: L({ cast: ["ravan"], big: "🔥" }) },
      { t: "[determined] Lord Ram lifts his golden bow. Whoosh! His arrows knock them away!", s: C({ cast: ["ram"] }) },
      { t: "[curious] Five arrows, two knocked away. How many are left?", s: L({ cast: ["ram", "ravan"], big: "5 − 2" }) },
    ],
    learn: [
      { t: "[warmly] Five arrows. Two go away. Count the ones still here: one, two, three. Three are left!", demo: { type: "army", item: "arrow", op: "take", a: 5, b: 2 } },
      { t: "[excited] Four arrows. One goes away. One less than four is three!", demo: { type: "army", item: "arrow", op: "take", a: 4, b: 1 } },
    ],
    talk: "Put 5 grapes out. Eat 2. \"How many are left?\"",
    gameName: "Knock Them Away",
    game: { type: "mixed", parts: [
      { type: "army", item: "arrow", op: "take", rounds: [[4, 1], [5, 1]] },
      { type: "hop", mode: "guess", rounds: [[6, -1], [9, -1]] },
      { type: "army", item: "arrow", op: "take", rounds: [[5, 2], [5, 3], [4, 2]] },
    ] },
    physical: { title: "Snack take-away", steps: ["Put 5 snacks on a plate.", "Eat some. \"How many are left?\"", "Count to check."] },
    mistake: { item: "arrow", shown: 3, claim: 2 },
    easyWin: { item: "arrow", n: 3 },
    teaser: "[mischievously] Next: the magic quiver!",
  },
  {
    day: 19, title: "The magic quiver", costars: ["Ram"], skill: "S4", review: ["O2", "P1"],
    power: { name: "Five and More", desc: "You see 6 to 10 as 5 and some more." },
    story: [
      { t: "[excited] Lord Ram has a magic quiver. It holds TEN arrows, in two rows of five!", s: C({ cast: ["ram"], items: { item: "arrow", n: 10, on: "floor" } }) },
      { t: "[curious] In a fast battle, there's no time to count every arrow!", s: L({ cast: ["ram", "ravan"] }) },
      { t: "[whispers] Secret trick: a full row is five. Then count the rest!", s: C({ cast: ["ram"], big: "5 + ?" }) },
    ],
    learn: [
      { t: "[warmly] The top row is full. That's five! Then one more... six!", demo: { type: "frame10", n: 6 } },
      { t: "[excited] Five and three more... eight! No need to count them all.", demo: { type: "frame10", n: 8 } },
    ],
    talk: "Show 5 fingers on one hand and 2 on the other. \"5 and 2 is...?\"",
    gameName: "Quiver Flash",
    game: { type: "mixed", parts: [
      { type: "flash", item: "arrow", layout: "frame10", rounds: [6, 5] },
      { type: "pick", item: "arrow", layout: "frame10", rounds: [7, 6] },
      { type: "flash", item: "arrow", layout: "frame10", rounds: [8, 7, 9] },
    ] },
    physical: { title: "Egg-box tens", steps: ["Use an egg box or draw 2 rows of 5.", "Fill 7 spots with coins.", "\"5 and how many more?\""] },
    mistake: { item: "arrow", shown: 7, claim: 6 },
    easyWin: { item: "arrow", n: 5 },
    teaser: "[mischievously] Next: battle cards!",
  },
  {
    day: 20, title: "Battle cards", costars: ["Ram"], skill: "R4", review: ["S4", "R2"],
    power: { name: "Bigger Number Power", desc: "The number that comes later is bigger." },
    story: [
      { t: "[dramatic] Ravan says, \"My army is BIGGER!\" Lord Ram says, \"Let's check!\"", s: L({ cast: ["ram", "ravan"] }) },
      { t: "[curious] Each army holds up a number card. The bigger number wins!", s: C({ cast: ["ram"], big: "12  15" }) },
      { t: "[excited] You are the judge, Medhu! Which number is bigger?", s: L({ cast: ["ravan"], big: "?" }) },
    ],
    learn: [
      { t: "[warmly] Count up: twelve, thirteen, fourteen, fifteen. Fifteen comes later, so it's bigger!", demo: { type: "hop", from: 12, by: 3 } },
      { t: "[excited] Nine or six? Nine comes after six. Nine is bigger!", demo: { type: "number", n: 9 } },
    ],
    talk: "Write two numbers (like 8 and 13). Ask which is bigger, and why.",
    gameName: "Battle Cards",
    game: { type: "mixed", parts: [
      { type: "cards", rounds: [[3, 5], [8, 6]] },
      { type: "compare", item: "vanara", ask: "less", rounds: [[6, 8]] },
      { type: "cards", rounds: [[12, 9], [14, 17], [19, 11], [15, 16]] },
    ] },
    physical: { title: "Card war", steps: ["Use playing cards 1-10 (or write 1-20).", "Each takes a card. Bigger number wins!", "Say \"__ is bigger than __\"."] },
    easyWin: { item: "vanara", n: 4 },
    teaser: "[mischievously] Next: Lord Hanuman's big hop!",
  },
  {
    day: 21, title: "Hanuman's big hop", costars: ["Hanuman"], skill: "C5", review: ["R4", "O1"],
    power: { name: "Count On Power", desc: "Start from any number and keep counting." },
    story: [
      { t: "[excited] Lord Hanuman must carry a message across the battlefield, FAST!", s: L({ cast: ["hanuman"] }) },
      { t: "[curious] He doesn't start from stone one. He starts right where he is!", s: S({ cast: ["hanuman"], items: { item: "stone", n: 4, on: "floor" } }) },
      { t: "[cheerfully] Start at the number, and hop and count on. Let's go!", s: S({ cast: ["hanuman"], big: "7 → 8, 9, 10" }) },
    ],
    learn: [
      { t: "[warmly] Start at seven. Hop three more: eight, nine, ten. Seven and three more is ten!", demo: { type: "hop", from: 7, by: 3 } },
      { t: "[excited] Start at five. Hop two more: six, seven!", demo: { type: "hop", from: 5, by: 2 } },
    ],
    talk: "\"Start at 8, count 3 more\" - clap as he counts 9, 10, 11.",
    gameName: "Big Hop",
    game: { type: "mixed", parts: [
      { type: "hop", mode: "tap", rounds: [[3, 2], [5, 2]] },
      { type: "army", item: "vanara", op: "add", rounds: [[5, 2]] },
      { type: "hop", mode: "tap", rounds: [[7, 3], [10, 3], [13, 4]] },
    ] },
    physical: { title: "Hop and count", steps: ["Say \"You're on 6!\"", "He jumps 3 times, counting 7, 8, 9.", "Try starting at 10, 12, 15."] },
    mistake: { item: "vanara", shown: 8, claim: 7 },
    easyWin: { item: "vanara", n: 4 },
    teaser: "[mischievously] Next: the armies grow and shrink!",
  },
  {
    day: 22, title: "Army count", costars: ["Ram", "Hanuman"], skill: "O3", review: ["C5", "O2"],
    power: { name: "Army Maths", desc: "You add and take away up to 10." },
    story: [
      { t: "[dramatic] The battle is BIG now! More monkeys run in. Ravan's guards run away!", s: L({ cast: ["hanuman", "ravan"] }) },
      { t: "[curious] Lord Ram must always know: how many in the army now?", s: C({ cast: ["ram"], items: { item: "vanara", n: 6, on: "floor" } }) },
      { t: "[excited] Some come, some go. Keep the count, Medhu!", s: C({ cast: ["ram", "hanuman"], big: "+ −" }) },
    ],
    learn: [
      { t: "[warmly] Six monkeys. Three more come. Count on: seven, eight, nine!", demo: { type: "army", item: "vanara", op: "add", a: 6, b: 3 } },
      { t: "[excited] Eight arrows. Three go away. Count back: seven, six, five!", demo: { type: "army", item: "arrow", op: "take", a: 8, b: 3 } },
    ],
    talk: "Use toys: \"7 cars, 2 drive away. How many?\" then \"4 cars, 3 more come.\"",
    gameName: "Army Maths",
    game: { type: "mixed", parts: [
      { type: "army", item: "vanara", op: "add", rounds: [[5, 2], [6, 3]] },
      { type: "army", item: "arrow", op: "take", rounds: [[7, 2], [8, 3]] },
      { type: "army", item: "vanara", op: "add", rounds: [[7, 3]] },
      { type: "army", item: "arrow", op: "take", rounds: [[10, 4]] },
    ] },
    physical: { title: "Toy army", steps: ["Line up 6 toys.", "Add or take away some.", "\"How many now?\" Count to check."] },
    mistake: { item: "vanara", shown: 9, claim: 8 },
    easyWin: { item: "vanara", n: 5 },
    teaser: "[mischievously] Next: Ravan's ten crowns!",
  },
  {
    day: 23, title: "Ten crowns", costars: ["Ram"], skill: "P4", review: ["O3", "S4"],
    power: { name: "Make Ten", desc: "You know the parts that make 10." },
    story: [
      { t: "[dramatic] Ravan has TEN heads and ten golden crowns! He thinks he can't lose.", s: L({ cast: ["ravan"], big: "10" }) },
      { t: "[determined] Lord Ram fires ten arrows. Some fly behind the golden shield!", s: C({ cast: ["ram"], items: { item: "arrow", n: 10, on: "floor" } }) },
      { t: "[curious] Ten in all. How many are hiding? Let's find out!", s: L({ cast: ["ram", "ravan"], big: "? + ? = 10" }) },
    ],
    learn: [
      { t: "[warmly] Ten arrows. Seven are outside. Count on to ten: eight, nine, ten. Three are hiding!", demo: { type: "hide", item: "arrow", total: 10, shown: 7 } },
      { t: "[excited] Look at the quiver! Eight arrows, and two empty spots. Eight and two make ten!", demo: { type: "frame10", n: 8 } },
    ],
    talk: "Show 10 fingers. Fold some down. \"How many are folded?\"",
    gameName: "Make Ten",
    game: { type: "mixed", parts: [
      { type: "shield", item: "arrow", rounds: [[10, 9], [10, 8]] },
      { type: "pick", item: "arrow", layout: "frame10", rounds: [9, 8] },
      { type: "shield", item: "arrow", rounds: [[10, 7], [10, 5], [10, 6]] },
    ] },
    physical: { title: "Ten fingers", steps: ["Hold up 10 fingers together.", "Fold 3 down. \"How many still up?\"", "Try 1, 4, 5, 6 folded."] },
    mistake: { item: "arrow", shown: 10, claim: 9 },
    easyWin: { item: "arrow", n: 5 },
    teaser: "[excited] Next: THE BATTLE OF LANKA!",
  },
  {
    day: 24, title: "Battle of Lanka", costars: ["Ram", "Hanuman"], skill: "O3", review: ["R3", "P2", "O1", "O2", "R4"],
    power: { name: "Ram's Golden Bow", desc: "You finished the Battle of Lanka!" },
    story: [
      { t: "[dramatic] The final battle! Lord Ram faces mighty Ravan!", s: L({ cast: ["ram", "ravan"] }) },
      { t: "[excited] Lord Hanuman and the monkey army cheer, \"Jai Shri Ram!\"", s: C({ cast: ["hanuman"], items: { item: "vanara", n: 6, on: "floor" } }) },
      { t: "[determined] Use ALL your powers, Medhu! Help Lord Ram win and bring Sita home!", s: L({ cast: ["ram", "hanuman", "ravan"], big: "★★★" }) },
    ],
    learn: [],
    gameName: "Final Battle",
    game: { type: "mixed", parts: [
      { type: "hop", mode: "guess", rounds: [[12, 1], [9, -1]] },
      { type: "shield", item: "vanara", rounds: [[5, 2]] },
      { type: "army", item: "arrow", op: "add", rounds: [[6, 3]] },
      { type: "cards", rounds: [[16, 13]] },
      { type: "army", item: "arrow", op: "take", rounds: [[9, 4]] },
      { type: "flash", item: "arrow", layout: "frame10", rounds: [8] },
    ] },
    physical: { title: "Helper Test again", steps: ["Run the 12-item Medhu Maths Check today or tomorrow.", "Enter scores in Admin > Checks, label \"Day 28\"."] },
    mistake: { item: "vanara", shown: 8, claim: 9 },
    easyWin: { item: "vanara", n: 5 },
    teaser: "[excited] Lord Ram wins! Sita comes home, and everyone lights diyas. Happy Diwali!",
  },

];

export function questByDay(day: number) {
  return QUESTS.find((q) => q.day === day);
}

// How a character's name is shown: gods always with their title.
const TITLES: Record<string, string> = { Ganesha: "Lord Ganesha", Hanuman: "Lord Hanuman", Krishna: "Lord Krishna", Shiva: "Lord Shiva", Ram: "Lord Ram", Durga: "Goddess Durga" };
export const displayName = (name: string) => TITLES[name] ?? name;
