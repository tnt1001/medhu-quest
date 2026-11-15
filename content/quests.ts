export type Item = "modak" | "diya" | "star" | "laddoo";
export type ShapeName = "circle" | "triangle" | "square" | "rectangle";

export type Game =
  | { type: "count"; item: Item; rounds: number[] }
  | { type: "flash"; item: Item; layout: "scatter" | "dice" | "frame5"; rounds: number[] }
  | { type: "giveN"; item: Item; rounds: number[] }
  | { type: "conserve"; item: Item; rounds: number[] }
  | { type: "compare"; item: Item; rounds: [number, number][] }
  | { type: "pattern"; rounds: string[][] }
  | { type: "shapes"; rounds: ShapeName[] }
  | { type: "mixed"; parts: Game[] }
  | { type: "check"; items: number[] };

export type Bg = "feast" | "temple" | "night" | "kitchen" | "sky";
export type Mood = "happy" | "confused" | "excited" | "thinking";

export interface Scene {
  bg: Bg;
  cast?: ("ganesha" | "mooshak")[];
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
  { id: 1, title: "The Modak Mission", costars: "Ganesha + Spider-Man", days: [1, 14], trophy: "Golden Modak" },
  { id: 2, title: "The Great Leap", costars: "Hanuman + Iron Man", days: [15, 28], trophy: "Hanuman's Mace" },
  { id: 3, title: "The Hidden and the Missing", costars: "Durga + Captain America and Thor", days: [29, 42], trophy: "Durga's Lion Badge" },
  { id: 4, title: "Butter, Smash and Assemble", costars: "Krishna + Hulk", days: [43, 60], trophy: "Krishna's Flute" },
];

export const CARDS = [
  { name: "Mooshak", world: "Guide", color: "#8d6e63" },
  { name: "Ganesha", world: "Mythology", color: "#ef6c00" },
  { name: "Spider-Man", world: "Superhero", color: "#d32f2f" },
  { name: "Hanuman", world: "Mythology", color: "#e65100" },
  { name: "Iron Man", world: "Superhero", color: "#b71c1c" },
  { name: "Durga", world: "Mythology", color: "#c2185b" },
  { name: "Captain America", world: "Superhero", color: "#1565c0" },
  { name: "Krishna", world: "Mythology", color: "#283593" },
  { name: "Hulk", world: "Superhero", color: "#2e7d32" },
  { name: "Shiva", world: "Mythology", color: "#455a64" },
  { name: "Thor", world: "Superhero", color: "#5d4037" },
  { name: "Ram", world: "Mythology", color: "#00838f" },
];

export const STARS_PER_CARD = 10;

const F = (o: Partial<Scene> = {}): Scene => ({ bg: "feast", ...o });

export const QUESTS: Quest[] = [
  {
    day: 1, title: "Mooshak needs a helper", costars: ["Mooshak", "Ganesha", "Spider-Man"], skill: "C2", review: [],
    power: { name: "Helper Badge", desc: "You are Ganesha's official Modak Helper!" },
    story: [
      { t: "[dramatic] Mission Control calling Agent Medhu! [whispers] Listen carefully... this is a VERY important mission.", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "[excited] Ganesha's birthday feast is in just two weeks! And Ganesha needs modaks - hundreds of sweet, soft modaks - for ALL his friends!", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[curious] But there's a problem. Ganesha's best friend, Mooshak the mouse, is in charge of the modaks... [sighs] and Mooshak is in trouble.", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "[nervously] \"One, two, three... oh no!\" squeaks Mooshak. [gasps] \"I lost count AGAIN! There are too many for a tiny mouse like me!\"", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 8, on: "floor" } }) },
      { t: "[excited] Then - WHOOSH! - Spider-Man swings down on his web! \"I'll carry the modaks,\" he says. [curious] \"But who will COUNT them?\"", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 4, on: "web" } } },
      { t: "[dramatic] Everyone turns around... and looks at YOU. [excited] \"Agent Medhu! Only you can help us! Will you join the Modak Mission?\"", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "[whispers] But first, every agent must pass the secret Helper Test. [cheerfully] Papa will run it with you, with real things. Agent Medhu... are you ready?", s: F({ cast: ["ganesha", "mooshak"], mood: "happy" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 1",
    game: { type: "check", items: [1, 2, 3, 4] },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Tomorrow: part 2 of the helper test!",
  },
  {
    day: 2, title: "Helper test, part 2", costars: ["Mooshak", "Spider-Man"], skill: "S1", review: [],
    power: { name: "Brave Helper", desc: "You did part 2 of the Helper Test!" },
    story: [
      { t: "[excited] Agent Medhu, you passed Part 1! [laughs] Mooshak is doing a happy dance on the table!", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "[mischievously] Now Spider-Man has a sneaky test. He hides modaks behind his web... [whispers] and asks, how many are hiding?", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "[curious] Far away, Ganesha is watching from his temple. His trunk goes up, up, UP! [excited] That means he's excited!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "[warmly] \"Part 2 is trickier,\" says Mooshak. \"Take your time, Agent. Good agents think before they answer!\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 2",
    game: { type: "check", items: [5, 6, 7, 8] },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Tomorrow: the last part of the helper test!",
  },
  {
    day: 3, title: "Helper test, part 3", costars: ["Mooshak", "Ganesha"], skill: "R1", review: [],
    power: { name: "Official Modak Helper", desc: "You finished the whole Helper Test!" },
    story: [
      { t: "[dramatic] This is it, Agent Medhu. The FINAL part of the Helper Test!", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "[curious] Today, Ganesha himself asks the questions. Bigger numbers. More modaks. [whispers] Some of them are puzzles...", s: F({ cast: ["ganesha"], items: { item: "modak", n: 7, on: "plate" } }) },
      { t: "[excited] \"Pass this,\" booms Ganesha, \"and you become my Official Modak Helper. Then the REAL mission begins!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"] } },
    ],
    learn: [],
    gameName: "Helper Test, part 3",
    game: { type: "check", items: [9, 10, 11, 12] },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Tomorrow: your first real modak mission!",
  },
  {
    day: 4, title: "The last number trick", costars: ["Mooshak", "Spider-Man"], skill: "C2", review: ["S1"],
    power: { name: "Last Number Power", desc: "The last number you count tells you how many." },
    story: [
      { t: "[excited] Agent Medhu, you did it! Ganesha pins a shiny gold badge on you. You are now the Official Modak Helper!", s: F({ cast: ["ganesha"], big: "★" }) },
      { t: "[dramatic] Mission one begins right now! WHOOSH! Spider-Man swoops in with the very first modaks and drops them on the plate.", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "[curious] Mooshak counts them. \"One, two, three, four, five.\" Ganesha smiles and asks, \"So Mooshak... how many modaks?\"", s: F({ cast: ["ganesha", "mooshak"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[sighs] And Mooshak starts counting ALL OVER AGAIN! \"One, two, three...\" Again and again and again! [laughs] Poor Mooshak is so tired!", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[pleading] \"Agent Medhu,\" yawns Mooshak, \"isn't there a trick, so I never have to count again?\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "[whispers] There IS a secret trick, Agent. [excited] Let's learn it now - and then YOU can teach Mooshak!", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "[warmly] Here are some modaks. Let's count them together. Touch each one only ONCE.", demo: { type: "count", item: "modak", n: 4 } },
      { t: "[excited] We said 1, 2, 3, 4. The LAST number we said was 4.", demo: { type: "number", n: 4 } },
      { t: "[excited] Here is the trick: the last number tells you HOW MANY. So there are 4 modaks. No need to count again!", demo: { type: "count", item: "modak", n: 4 } },
      { t: "[warmly] Let's try with more. Count with me... the last number is 6. So there are 6 modaks!", demo: { type: "count", item: "modak", n: 6 } },
    ],
    talk: "Ask Medhu to count Papa's fingers on one hand, then ask \"So how many?\" - he should say 5 without counting again.",
    gameName: "Count and Tell",
    game: { type: "count", item: "modak", rounds: [3, 5, 4, 6, 7] },
    physical: { title: "Modak count", steps: ["Put 4-7 small objects in a row.", "He counts by touching each one.", "Ask \"So how many?\" - he should answer without counting again."] },
    mistake: { item: "modak", shown: 4, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Tomorrow: Spider-Man's super-fast web!",
  },
  {
    day: 5, title: "Super eyes", costars: ["Spider-Man", "Mooshak"], skill: "S1", review: ["C2"],
    power: { name: "Super Eyes (1-3)", desc: "You can see 1, 2 or 3 in one look, without counting." },
    story: [
      { t: "[dramatic] Alert, Agent Medhu! Spider-Man is in a big hurry today. He's swinging across the sky SO fast - WHOOSH!", s: { bg: "sky", swing: true, web: true } },
      { t: "[gasps] Modaks flash in his web for one second... and then they're GONE! There's no time to count them one by one!", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "[nervously] \"How many did you see?\" asks Spider-Man. Mooshak covers his eyes. [sighs] \"Too fast for me!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "[excited] But every superhero has a secret power: SUPER EYES! [whispers] With super eyes, you see small numbers in just one look.", s: F({ cast: ["mooshak"], mood: "excited", big: "1 2 3" }) },
    ],
    learn: [
      { t: "[warmly] Look at this. One modak. You don't need to count it. You just KNOW it is 1. Ek!", demo: { type: "glance", item: "modak", n: 1 } },
      { t: "[warmly] Two modaks. A pair, like your two eyes or two hands. Just look: 2. Do!", demo: { type: "glance", item: "modak", n: 2 } },
      { t: "[warmly] Three modaks often make a triangle shape. Look... 3! Teen!", demo: { type: "glance", item: "modak", n: 3 } },
      { t: "[excited] That is super eyes: look once, and say the number. No touching, no counting. Let's play Flash!", demo: { type: "glance", item: "modak", n: 2 } },
    ],
    talk: "Hold up 1, 2 or 3 fingers for a second and hide them. Medhu calls out the number!",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [2, 1, 3, 2, 3, 1] },
    mistake: { item: "modak", shown: 3, claim: 2 },
    easyWin: { item: "modak", n: 1 },
    teaser: "[mischievously] Tomorrow: Mooshak opens a modak shop!",
  },
  {
    day: 6, title: "Mooshak's modak shop", costars: ["Mooshak", "Ganesha"], skill: "C3", review: ["S1", "C2"],
    power: { name: "Exactly Power", desc: "You can give exactly the number someone asks for." },
    story: [
      { t: "[excited] Mooshak has a brilliant idea! \"Let's open a modak shop for the feast!\" He hangs up a tiny little sign.", s: { bg: "kitchen", cast: ["mooshak"], mood: "excited", items: { item: "modak", n: 10, on: "floor" } } },
      { t: "[dramatic] And the shopkeeper is... YOU, Agent Medhu! Your mission: give every friend exactly the modaks they ask for.", s: { bg: "kitchen", cast: ["mooshak"], items: { item: "modak", n: 10, on: "floor" } } },
      { t: "[cheerfully] The first customer walks in. It's Ganesha! \"Four modaks, please,\" he says.", s: { bg: "kitchen", cast: ["ganesha"], big: "4" } },
      { t: "[laughs] Mooshak tries to help. He grabs a big handful and gives Ganesha... SEVEN! [gasps] \"Oops! Too many!\" laughs Ganesha.", s: { bg: "kitchen", cast: ["ganesha", "mooshak"], mood: "confused", items: { item: "modak", n: 7, on: "plate" } } },
      { t: "[warmly] A great shopkeeper gives EXACTLY the right number. Not one more. Not one less. [excited] Let's learn how, Agent!", s: { bg: "kitchen", cast: ["mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "[warmly] Someone asks for 4. Keep the number 4 in your head. Say it: \"four!\"", demo: { type: "number", n: 4 } },
      { t: "[warmly] Now move modaks to the plate ONE at a time, and count as you move: 1... 2... 3... 4.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "[excited] When you say 4 - STOP! That's the number they asked for. Exactly 4 on the plate.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "[excited] Let's watch once more with 6. Move, count, and STOP at 6.", demo: { type: "giveN", item: "modak", n: 6, pile: 9 } },
    ],
    talk: "Ask Medhu: \"Give me exactly 3 spoons.\" Did he stop at 3?",
    gameName: "Modak Shop",
    game: { type: "giveN", item: "modak", rounds: [3, 5, 4, 6, 8] },
    physical: { title: "Real modak shop", steps: ["Make a pile of 15 small objects.", "Be the customer: \"I want 6 please!\"", "Check: did he stop at 6? Try 4, 7, 8."] },
    mistake: { item: "modak", shown: 6, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "[mischievously] Tomorrow: Spider-Man's web gets even faster!",
  },
  {
    day: 7, title: "Super eyes level 2", costars: ["Spider-Man", "Mooshak"], skill: "S2", review: ["S1", "C3"],
    power: { name: "Super Eyes (4-5)", desc: "You can see 4 and 5 in one look." },
    story: [
      { t: "[dramatic] Danger level two, Agent Medhu! Spider-Man's web can now catch four or five modaks at ONCE!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "[nervously] Mooshak tries to count. \"One, two...\" [gasps] \"Where did they go?!\" The web is far too fast!", s: { bg: "sky", cast: ["mooshak"], mood: "confused" } },
      { t: "[excited] Time to level up your super eyes! [whispers] Here's a secret: big numbers hide small groups inside them.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "[warmly] Four modaks often sit like a square, with one in each corner. Look: 4! Chaar!", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "[warmly] Here's a secret: 4 is 2 and 2. Two pairs! If you see two pairs, it is 4.", demo: { type: "dice", n: 4 } },
      { t: "[warmly] Five is like 4 with one in the middle. 5! Paanch! Like the 5 on a dice.", demo: { type: "dice", n: 5 } },
      { t: "[warmly] Five is also all the fingers on one hand. Show me your hand - that's 5!", demo: { type: "number", n: 5 } },
    ],
    talk: "Show 4 or 5 fingers quickly. Ask: \"How did you know so fast?\"",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [4, 3, 5, 4, 5, 2] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Tomorrow: Ganesha's special modak trays!",
  },
  {
    day: 8, title: "Ganesha's trays of five", costars: ["Ganesha", "Mooshak"], skill: "P1", review: ["S2"],
    power: { name: "Tray of Five", desc: "A full tray of five is 5 - no counting needed." },
    story: [
      { t: "[curious] Ganesha brings out his special golden trays. Each tray has exactly FIVE little holes.", s: F({ cast: ["ganesha"] }) },
      { t: "[cheerfully] \"One modak in each hole,\" says Ganesha. \"That keeps everything neat for the feast!\"", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[sighs] Mooshak fills a tray, then counts it. \"One, two, three, four, five.\" Then the next one. \"One, two, three...\" [laughs] Phew!", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "[warmly] Ganesha chuckles. \"Mooshak, a FULL tray is ALWAYS five.\" [whispers] \"You don't need to count it at all!\"", s: F({ cast: ["ganesha", "mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "[warmly] This is a tray of five. It has 5 spaces. When every space is full, there are 5 modaks.", demo: { type: "frame5", n: 5 } },
      { t: "[excited] Now some spaces are empty. 4 full, 1 empty. Full tray is 5, one missing, so it is 4.", demo: { type: "frame5", n: 4 } },
      { t: "[warmly] Here 3 are full and 2 are empty. Look at the full ones: 3!", demo: { type: "frame5", n: 3 } },
      { t: "[excited] Remember: full tray means 5. Look at the empty spaces to help you!", demo: { type: "frame5", n: 5 } },
    ],
    talk: "Show 5 fingers - a full hand is like a full tray! Fold one down: how many now?",
    gameName: "Tray Flash",
    game: { type: "flash", item: "modak", layout: "frame5", rounds: [5, 3, 4, 5, 2, 5] },
    physical: { title: "Egg tray fill", steps: ["Cut an egg tray to 5 cups.", "Fill it with modaks or balls - \"full tray is 5!\"", "Fill 3 or 4: \"how many? how many empty?\""] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "[mischievously] Tomorrow: Spider-Man's web gets a shake!",
  },
  {
    day: 9, title: "The wobbly web", costars: ["Spider-Man", "Mooshak"], skill: "C4", review: ["P1", "C2"],
    power: { name: "Still-the-Same Power", desc: "Moving things around does not change how many there are." },
    story: [
      { t: "[cheerfully] Spider-Man lines up six modaks in a neat row on his web. Mooshak counts them: \"Six modaks!\"", s: { bg: "sky", web: true, items: { item: "modak", n: 6, on: "web" } } },
      { t: "[dramatic] Suddenly - WHOOOOSH! - a giant wind blows! The web wobbles and shakes!", s: { bg: "sky", web: true, swing: true } },
      { t: "[gasps] The modaks roll everywhere! Now they're spread out, far, far apart.", s: { bg: "sky", items: { item: "modak", n: 6, on: "floor" } } },
      { t: "[nervously] \"Oh no!\" cries Mooshak. \"Did we lose some? Now it looks like MORE! Or less? I don't know!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "[curious] Hmm, Agent Medhu... when things move around, does the number change? [whispers] Let's find out.", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "[warmly] Here are 5 modaks in a line. Count them: 1, 2, 3, 4, 5. So there are 5.", demo: { type: "count", item: "modak", n: 5 } },
      { t: "[curious] Now watch. The modaks move and spread out. Did anyone add a modak? No. Did anyone take one away? No.", demo: { type: "conserve", item: "modak", n: 5 } },
      { t: "[excited] So they are STILL 5! Moving them around does not change how many there are.", demo: { type: "number", n: 5 } },
      { t: "[warmly] Only adding or taking away changes the number. Spreading out does not!", demo: { type: "conserve", item: "modak", n: 4 } },
    ],
    talk: "Line up 5 toys, count them, then spread them out. Ask Medhu: \"Still 5? How do you know?\"",
    gameName: "Wobbly Web",
    game: { type: "conserve", item: "modak", rounds: [4, 6, 5, 7] },
    physical: { title: "Spread them out", steps: ["Count 6 objects in a line together.", "Spread them far apart while he watches.", "\"How many now?\" - does he know it's still 6 without counting?"] },
    mistake: { item: "modak", shown: 6, claim: 7 },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Tomorrow: which plate has more?",
  },
  {
    day: 10, title: "Which plate has more?", costars: ["Ganesha", "Spider-Man"], skill: "R2", review: ["C4", "S2"],
    power: { name: "More-or-Less Power", desc: "You can find which group has more." },
    story: [
      { t: "[cheerfully] Two plates are ready for the feast: one for Ganesha, and one for Spider-Man.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "[excited] \"I'm the birthday boy!\" says Ganesha. \"I should get the plate with MORE modaks!\"", s: F({ cast: ["ganesha"], mood: "excited" }) },
      { t: "[mischievously] But Spider-Man spreads his modaks out wide... so his plate LOOKS bigger. [whispers] Is it really more?", s: { bg: "sky", web: true, items: { item: "modak", n: 4, on: "floor" } } },
      { t: "[curious] Mooshak scratches his head. \"Big-looking isn't always more! Agent Medhu, how can we know for sure?\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
    ],
    learn: [
      { t: "[warmly] Here are two rows of modaks. Let's find out which has more by making pairs.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "[warmly] Each top modak holds hands with a bottom modak. The ones left with no partner are EXTRA.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "[excited] The row with extra modaks has MORE. The bottom row has more!", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "[warmly] You can also count both: 4 and 6. 6 comes after 4 when we count, so 6 is more.", demo: { type: "number", n: 6 } },
    ],
    talk: "Put 3 grapes in front of Papa and 5 in front of Medhu. Who has more? How do you know?",
    gameName: "More or Less",
    game: { type: "compare", item: "modak", rounds: [[3, 5], [6, 4], [2, 7], [5, 6], [8, 7]] },
    physical: { title: "Two plates", steps: ["Put 5 on one plate and 7 on another.", "\"Which has more? How do you know?\"", "Spread the 5 out wide - does he get tricked?"] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 4 },
    teaser: "[mischievously] Tomorrow: Mooshak finds a magic dice!",
  },
  {
    day: 11, title: "Mooshak's magic dice", costars: ["Mooshak", "Spider-Man"], skill: "S3", review: ["R2", "P1"],
    power: { name: "Dice Eyes", desc: "You can read any dice face in one look." },
    story: [
      { t: "[whispers] Late at night, Mooshak is cleaning under Ganesha's bed... [gasps] when he finds something shiny. A MAGIC DICE!", s: { bg: "night", cast: ["mooshak"], mood: "excited" } },
      { t: "[curious] Every side has dots. One dot. Two dots. Three dots... all the way up to six!", s: { bg: "night", cast: ["mooshak"], big: "1-6" } },
      { t: "[excited] Spider-Man swings in. \"Superheroes never count dice dots, Agent. [whispers] They know the PATTERN!\"", s: { bg: "sky", web: true, swing: true } },
    ],
    learn: [
      { t: "[warmly] Each number on a dice has its own picture. 1 is one dot in the middle.", demo: { type: "dice", n: 1 } },
      { t: "[warmly] 3 is a slide - three dots going down like a slide!", demo: { type: "dice", n: 3 } },
      { t: "[warmly] 4 is the four corners. 5 is four corners plus one in the middle.", demo: { type: "dice", n: 5 } },
      { t: "[excited] 6 is two lines of 3, like two rows of soldiers. Learn the pictures and you'll never need to count!", demo: { type: "dice", n: 6 } },
    ],
    talk: "Roll a real dice 3 times. Medhu says the number without counting the dots.",
    gameName: "Dice Flash",
    game: { type: "flash", item: "modak", layout: "dice", rounds: [3, 5, 4, 6, 2, 5] },
    physical: { title: "Real dice", steps: ["Roll a real dice together.", "He says the number without counting dots.", "Show the same number on fingers."] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 1 },
    teaser: "[mischievously] Tomorrow: diyas for the feast!",
  },
  {
    day: 12, title: "Diya patterns", costars: ["Ganesha", "Mooshak"], skill: "M1", review: ["S3", "R2"],
    power: { name: "Pattern Power", desc: "You can see what repeats and what comes next." },
    story: [
      { t: "[softly] The sun is going down. The feast needs light! Ganesha brings out lots and lots of little diyas.", s: { bg: "night", cast: ["ganesha"] } },
      { t: "[cheerfully] \"Let's make a beautiful pattern,\" says Ganesha. \"Red, blue, red, blue...\"", s: { bg: "night", cast: ["ganesha"] } },
      { t: "[laughs] Mooshak helps... but he mixes them all up! Red, red, blue, red... [sighs] \"Oops! That doesn't look pretty at all!\"", s: { bg: "night", cast: ["mooshak"], mood: "confused" } },
    ],
    learn: [
      { t: "[warmly] A pattern is something that repeats again and again. Look: red, blue, red, blue.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "[warmly] Find the part that repeats. Here it is \"red, blue\". Then it starts again.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "[warmly] Some patterns are longer: blue, blue, red. Blue, blue, red. Say it like a song!", demo: { type: "pattern", seq: ["blue", "blue", "red", "blue", "blue", "red"] } },
    ],
    talk: "Clap-stamp, clap-stamp... what comes next? Make a pattern with your body!",
    gameName: "Pattern Garland",
    game: { type: "pattern", rounds: [["red", "blue", "red", "blue", "red"], ["yellow", "green", "yellow", "green"], ["blue", "blue", "red", "blue", "blue"], ["red", "yellow", "red", "yellow", "red", "yellow"]] },
    physical: { title: "Bead or block pattern", steps: ["Make a red-blue-red-blue row with blocks.", "\"What comes next?\"", "Let him make his own pattern for you to continue."] },
    easyWin: { item: "diya", n: 2 },
    teaser: "[mischievously] Tomorrow: building Ganesha's temple!",
  },
  {
    day: 13, title: "Ganesha's temple", costars: ["Ganesha", "Spider-Man"], skill: "G1", review: ["M1", "S2"],
    power: { name: "Shape Spotter", desc: "You know circles, triangles, squares and rectangles." },
    story: [
      { t: "[dramatic] Mission alert! The feast is at Ganesha's temple... but the temple is BROKEN! It must be fixed before the big day!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "[excited] WHOOSH! Spider-Man brings building blocks in his web: circles, triangles, squares and rectangles!", s: { bg: "sky", web: true, swing: true } },
      { t: "[curious] \"Which shape goes where?\" asks Ganesha. \"Agent Medhu, help me find the right ones!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "[excited] A circle is round, like a roti or Captain America's shield. It has no corners at all.", demo: { type: "shape", shape: "circle" } },
      { t: "[warmly] A triangle has 3 sides and 3 corners. The top of the temple is a triangle!", demo: { type: "shape", shape: "triangle" } },
      { t: "[warmly] A square has 4 sides, all the same size, and 4 corners.", demo: { type: "shape", shape: "square" } },
      { t: "[warmly] A rectangle also has 4 sides and 4 corners, but it is longer - like a door.", demo: { type: "shape", shape: "rectangle" } },
    ],
    talk: "Find one circle and one rectangle in this room together.",
    gameName: "Shape Quest",
    game: { type: "shapes", rounds: ["circle", "triangle", "square", "rectangle"] },
    physical: { title: "Shape hunt", steps: ["Walk around the house together.", "Find 2 circles, 2 rectangles, 1 triangle.", "Name each one and count its corners."] },
    easyWin: { item: "modak", n: 3 },
    teaser: "[mischievously] Tomorrow: THE FEAST! And a surprise trophy...",
  },
  {
    day: 14, title: "The great modak feast", costars: ["Ganesha", "Spider-Man", "Mooshak"], skill: "C2", review: ["S2", "C3", "R2", "P1"],
    power: { name: "Golden Modak", desc: "You finished the Modak Mission!" },
    story: [
      { t: "[excited] Today is the day, Agent Medhu! It's Ganesha's BIRTHDAY! The temple is glowing with diyas and all his friends are here!", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "excited" } },
      { t: "[cheerfully] Spider-Man swings in with the very last modaks. [laughs] Mooshak is dancing on the table!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "[dramatic] \"Before we eat,\" says Ganesha, \"my Modak Helper has one FINAL mission.\"", s: F({ cast: ["ganesha"] }) },
      { t: "[excited] Use ALL your powers, Agent: Super Eyes, Exactly Power, More-or-Less and the Tray of Five!", s: F({ cast: ["mooshak"], mood: "excited", big: "★★★" }) },
      { t: "[whispers] Complete it... and Ganesha has a golden surprise waiting just for you...", s: F({ cast: ["ganesha", "mooshak"] }) },
    ],
    learn: [
      { t: "[warmly] Quick reminder of your powers! Super Eyes: look once and know.", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "[warmly] Exactly Power: move one at a time, and stop at the number.", demo: { type: "giveN", item: "modak", n: 5, pile: 8 } },
      { t: "[excited] Tray of Five: a full tray is always 5.", demo: { type: "frame5", n: 5 } },
    ],
    talk: "Ask Medhu which power was his favourite, and why.",
    gameName: "Feast Challenge",
    game: {
      type: "mixed",
      parts: [
        { type: "flash", item: "modak", layout: "scatter", rounds: [4, 5] },
        { type: "giveN", item: "modak", rounds: [6] },
        { type: "compare", item: "modak", rounds: [[5, 7]] },
        { type: "flash", item: "modak", layout: "frame5", rounds: [5] },
      ],
    },
    physical: { title: "Helper test again (Sync 1)", steps: ["Run the 12-item Medhu Maths Check today or tomorrow.", "Enter scores in the admin under Checks, label \"Day 14\"."] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 5 },
    teaser: "[mischievously] Next arc: Hanuman and Iron Man race to Lanka!",
  },
];

export function questByDay(day: number) {
  return QUESTS.find((q) => q.day === day);
}
