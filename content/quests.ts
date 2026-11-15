export type Item = "modak" | "diya" | "star" | "laddoo";
export type ShapeName = "circle" | "triangle" | "square" | "rectangle";

export type Game =
  | { type: "count"; item: Item; rounds: number[] }
  | { type: "flash"; item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[] }
  | { type: "giveN"; item: Item; rounds: number[] }
  | { type: "conserve"; item: Item; rounds: number[] }
  | { type: "compare"; item: Item; rounds: [number, number][]; ask?: "more" | "less" }
  | { type: "pick"; item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[] }
  | { type: "pattern"; rounds: string[][] }
  | { type: "shapes"; rounds: ShapeName[] }
  | { type: "mixed"; parts: Game[] }
  | { type: "check"; items: number[] };

export type Bg = "feast" | "temple" | "night" | "kitchen" | "sky";
export type Mood = "happy" | "confused" | "excited" | "thinking";

export interface Scene {
  bg: Bg;
  cast?: ("ganesha" | "mooshak")[];
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
  | { type: "scene"; scene: Scene };

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
  { id: 2, title: "The Great Leap", costars: "Lord Hanuman", days: [13, 24], trophy: "Hanuman's Mace" },
  { id: 3, title: "Hero Squad", costars: "Superheroes", days: [25, 36], trophy: "Hero Shield" },
  { id: 4, title: "The Butter Thief", costars: "Lord Krishna", days: [37, 48], trophy: "Krishna's Flute" },
];

export const CARDS = [
  { name: "Mooshak", world: "Guide", color: "#8d6e63" },
  { name: "Ganesha", world: "Mythology", color: "#ef6c00" },
  { name: "Kaalu", world: "Cheeky crow", color: "#2b2f38" },
  { name: "Hanuman", world: "Mythology", color: "#e65100" },
  { name: "Krishna", world: "Mythology", color: "#283593" },
  { name: "Durga", world: "Mythology", color: "#c2185b" },
  { name: "Shiva", world: "Mythology", color: "#455a64" },
  { name: "Ram", world: "Mythology", color: "#00838f" },
  { name: "Spider-Man", world: "Superhero", color: "#d32f2f" },
  { name: "Iron Man", world: "Superhero", color: "#b71c1c" },
  { name: "Hulk", world: "Superhero", color: "#2e7d32" },
  { name: "Thor", world: "Superhero", color: "#5d4037" },
];

export const STARS_PER_CARD = 10;

const F = (o: Partial<Scene> = {}): Scene => ({ bg: "feast", ...o });

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
      { type: "pick", item: "modak", layout: "scatter", rounds: [4, 5] },
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
      { type: "giveN", item: "modak", rounds: [3, 4, 5] },
      { type: "pick", item: "modak", layout: "scatter", rounds: [5, 6] },
      { type: "giveN", item: "modak", rounds: [6, 8] },
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
      { type: "giveN", item: "modak", rounds: [7] },
      { type: "compare", item: "modak", ask: "less", rounds: [[6, 7]] },
      { type: "pick", item: "modak", layout: "frame5", rounds: [4] },
      { type: "flash", item: "modak", layout: "dice", rounds: [6] },
    ] },
    physical: { title: "Helper Test again", steps: ["Run the 12-item Medhu Maths Check today or tomorrow.", "Enter scores in Admin > Checks, label \"Day 14\"."] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "[excited] You beat Kaalu! Next arc: Lord Hanuman's big leap!",
  },
];

export function questByDay(day: number) {
  return QUESTS.find((q) => q.day === day);
}

// How a character's name is shown: gods always with their title.
const TITLES: Record<string, string> = { Ganesha: "Lord Ganesha", Hanuman: "Lord Hanuman", Krishna: "Lord Krishna", Shiva: "Lord Shiva", Ram: "Lord Ram", Durga: "Goddess Durga" };
export const displayName = (name: string) => TITLES[name] ?? name;
