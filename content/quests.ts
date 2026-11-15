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
      { t: "Far away, on Mount Kailash, lives Ganesha. He has a big tummy, a long trunk and a very, very kind heart.", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "Ganesha's birthday feast is coming in 2 weeks! He wants modaks - sweet, soft modaks - for ALL his friends.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "His best friend is Mooshak, a tiny mouse. Mooshak carries Ganesha everywhere. But Mooshak has a problem...", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "\"So many modaks!\" squeaks Mooshak. \"1, 2, 3... oh no, I lost count again! I am too small to count them all!\"", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 8, on: "floor" } }) },
      { t: "WHOOSH! Spider-Man swings in on his web. \"I can carry modaks in my web,\" he says. \"But who will count them?\"", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 4, on: "web" } } },
      { t: "Mooshak looks around... and looks at YOU. \"Medhu! Will you be my helper? You look very good at counting!\"", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "\"But first,\" says Mooshak, \"every helper does a Helper Test. Papa will play it with you, with real things. Ready?\"", s: F({ cast: ["ganesha", "mooshak"], mood: "happy" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 1",
    game: { type: "check", items: [1, 2, 3, 4] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: part 2 of the helper test!",
  },
  {
    day: 2, title: "Helper test, part 2", costars: ["Mooshak", "Spider-Man"], skill: "S1", review: [],
    power: { name: "Brave Helper", desc: "You did part 2 of the Helper Test!" },
    story: [
      { t: "Mooshak is dancing! \"Medhu, you did part 1 of the Helper Test! Ganesha is so happy!\"", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "Spider-Man has a game. He hides some modaks behind his web and asks, \"How many are hiding?\"", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "Ganesha is watching from his temple. His trunk goes up, up, up. That means he is excited!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "\"Part 2 has trickier questions,\" says Mooshak. \"Take your time. Thinking is good!\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [],
    gameName: "Helper Test, part 2",
    game: { type: "check", items: [5, 6, 7, 8] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: the last part of the helper test!",
  },
  {
    day: 3, title: "Helper test, part 3", costars: ["Mooshak", "Ganesha"], skill: "R1", review: [],
    power: { name: "Official Modak Helper", desc: "You finished the whole Helper Test!" },
    story: [
      { t: "\"Last part!\" squeaks Mooshak, jumping up on the table.", s: F({ cast: ["mooshak"], mood: "excited" }) },
      { t: "Ganesha asks the questions today. Bigger numbers, more modaks. Some are puzzles!", s: F({ cast: ["ganesha"], items: { item: "modak", n: 7, on: "plate" } }) },
      { t: "\"Finish this,\" says Ganesha, \"and you will be my official Modak Helper. Then the real mission begins!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"] } },
    ],
    learn: [],
    gameName: "Helper Test, part 3",
    game: { type: "check", items: [9, 10, 11, 12] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: your first real modak mission!",
  },
  {
    day: 4, title: "The last number trick", costars: ["Mooshak", "Spider-Man"], skill: "C2", review: ["S1"],
    power: { name: "Last Number Power", desc: "The last number you count tells you how many." },
    story: [
      { t: "Ganesha gives you a shiny helper badge. You are now the official Modak Helper!", s: F({ cast: ["ganesha"], big: "★" }) },
      { t: "Spider-Man brings the first modaks in his web. Swish, swish! He puts them on the plate.", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "Mooshak counts them. \"1, 2, 3, 4, 5.\" Ganesha asks, \"So how many modaks, Mooshak?\"", s: F({ cast: ["ganesha", "mooshak"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Mooshak starts AGAIN! \"1, 2, 3, 4, 5...\" He counts again and again and again. He gets so tired!", s: F({ cast: ["mooshak"], mood: "confused", items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "\"Medhu,\" Mooshak yawns, \"is there a trick so I don't have to count again?\"", s: F({ cast: ["mooshak"], mood: "thinking" }) },
      { t: "Yes! There is a secret trick. Let's learn it, and then teach Mooshak.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "Here are some modaks. Let's count them together. Touch each one only ONCE.", demo: { type: "count", item: "modak", n: 4 } },
      { t: "We said 1, 2, 3, 4. The LAST number we said was 4.", demo: { type: "number", n: 4 } },
      { t: "Here is the trick: the last number tells you HOW MANY. So there are 4 modaks. No need to count again!", demo: { type: "count", item: "modak", n: 4 } },
      { t: "Let's try with more. Count with me... the last number is 6. So there are 6 modaks!", demo: { type: "count", item: "modak", n: 6 } },
    ],
    talk: "Ask Medhu to count Papa's fingers on one hand, then ask \"So how many?\" - he should say 5 without counting again.",
    gameName: "Count and Tell",
    game: { type: "count", item: "modak", rounds: [3, 5, 4, 6, 7] },
    physical: { title: "Modak count", steps: ["Put 4-7 small objects in a row.", "He counts by touching each one.", "Ask \"So how many?\" - he should answer without counting again."] },
    mistake: { item: "modak", shown: 4, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: Spider-Man's super-fast web!",
  },
  {
    day: 5, title: "Super eyes", costars: ["Spider-Man", "Mooshak"], skill: "S1", review: ["C2"],
    power: { name: "Super Eyes (1-3)", desc: "You can see 1, 2 or 3 in one look, without counting." },
    story: [
      { t: "Today Spider-Man is in a hurry. He swings SO fast across the sky. Whoosh!", s: { bg: "sky", swing: true, web: true } },
      { t: "Modaks flash in his web - and then they are gone! There is no time to count them one by one.", s: { bg: "sky", web: true, items: { item: "modak", n: 3, on: "web" } } },
      { t: "\"How many did you see?\" asks Spider-Man. Mooshak covers his eyes. \"Too fast for me!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "But superheroes have a trick: SUPER EYES. With super eyes, you see small numbers in one quick look.", s: F({ cast: ["mooshak"], mood: "excited", big: "1 2 3" }) },
    ],
    learn: [
      { t: "Look at this. One modak. You don't need to count it. You just KNOW it is 1. Ek!", demo: { type: "glance", item: "modak", n: 1 } },
      { t: "Two modaks. A pair, like your two eyes or two hands. Just look: 2. Do!", demo: { type: "glance", item: "modak", n: 2 } },
      { t: "Three modaks often make a triangle shape. Look... 3! Teen!", demo: { type: "glance", item: "modak", n: 3 } },
      { t: "That is super eyes: look once, and say the number. No touching, no counting. Let's play Flash!", demo: { type: "glance", item: "modak", n: 2 } },
    ],
    talk: "Hold up 1, 2 or 3 fingers for a second and hide them. Medhu calls out the number!",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [2, 1, 3, 2, 3, 1] },
    mistake: { item: "modak", shown: 3, claim: 2 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Tomorrow: Mooshak opens a modak shop!",
  },
  {
    day: 6, title: "Mooshak's modak shop", costars: ["Mooshak", "Ganesha"], skill: "C3", review: ["S1", "C2"],
    power: { name: "Exactly Power", desc: "You can give exactly the number someone asks for." },
    story: [
      { t: "Mooshak has a big idea. \"Let's open a modak shop for the feast!\" He puts up a little sign.", s: { bg: "kitchen", cast: ["mooshak"], mood: "excited", items: { item: "modak", n: 10, on: "floor" } } },
      { t: "And YOU are the shopkeeper! Your job is to give each friend the modaks they ask for.", s: { bg: "kitchen", cast: ["mooshak"], items: { item: "modak", n: 10, on: "floor" } } },
      { t: "Ganesha comes first. \"I would like 4 modaks, please.\"", s: { bg: "kitchen", cast: ["ganesha"], big: "4" } },
      { t: "Mooshak tries to help. He grabs a big handful and gives Ganesha... 7! \"Oops! Too many!\" laughs Ganesha.", s: { bg: "kitchen", cast: ["ganesha", "mooshak"], mood: "confused", items: { item: "modak", n: 7, on: "plate" } } },
      { t: "A good shopkeeper gives EXACTLY the right number. Not one more. Not one less. Let's learn how.", s: { bg: "kitchen", cast: ["mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "Someone asks for 4. Keep the number 4 in your head. Say it: \"four!\"", demo: { type: "number", n: 4 } },
      { t: "Now move modaks to the plate ONE at a time, and count as you move: 1... 2... 3... 4.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "When you say 4 - STOP! That's the number they asked for. Exactly 4 on the plate.", demo: { type: "giveN", item: "modak", n: 4, pile: 8 } },
      { t: "Let's watch once more with 6. Move, count, and STOP at 6.", demo: { type: "giveN", item: "modak", n: 6, pile: 9 } },
    ],
    talk: "Ask Medhu: \"Give me exactly 3 spoons.\" Did he stop at 3?",
    gameName: "Modak Shop",
    game: { type: "giveN", item: "modak", rounds: [3, 5, 4, 6, 8] },
    physical: { title: "Real modak shop", steps: ["Make a pile of 15 small objects.", "Be the customer: \"I want 6 please!\"", "Check: did he stop at 6? Try 4, 7, 8."] },
    mistake: { item: "modak", shown: 6, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: Spider-Man's web gets even faster!",
  },
  {
    day: 7, title: "Super eyes level 2", costars: ["Spider-Man", "Mooshak"], skill: "S2", review: ["S1", "C3"],
    power: { name: "Super Eyes (4-5)", desc: "You can see 4 and 5 in one look." },
    story: [
      { t: "Spider-Man has a new trick. Now his web catches 4 or 5 modaks at once!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "Mooshak tries to count, but the web is too fast. \"1, 2... where did they go?\"", s: { bg: "sky", cast: ["mooshak"], mood: "confused" } },
      { t: "Your super eyes need to level up! Bigger numbers can be seen as two small groups.", s: F({ cast: ["mooshak"], mood: "excited" }) },
    ],
    learn: [
      { t: "Four modaks often sit like a square, with one in each corner. Look: 4! Chaar!", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "Here's a secret: 4 is 2 and 2. Two pairs! If you see two pairs, it is 4.", demo: { type: "dice", n: 4 } },
      { t: "Five is like 4 with one in the middle. 5! Paanch! Like the 5 on a dice.", demo: { type: "dice", n: 5 } },
      { t: "Five is also all the fingers on one hand. Show me your hand - that's 5!", demo: { type: "number", n: 5 } },
    ],
    talk: "Show 4 or 5 fingers quickly. Ask: \"How did you know so fast?\"",
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [4, 3, 5, 4, 5, 2] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: Ganesha's special modak trays!",
  },
  {
    day: 8, title: "Ganesha's trays of five", costars: ["Ganesha", "Mooshak"], skill: "P1", review: ["S2"],
    power: { name: "Tray of Five", desc: "A full tray of five is 5 - no counting needed." },
    story: [
      { t: "Ganesha brings out his special golden trays. Each tray has exactly 5 little holes.", s: F({ cast: ["ganesha"] }) },
      { t: "\"One modak in each hole,\" says Ganesha. \"That keeps them neat for the feast.\"", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Mooshak fills a tray, then counts it. \"1, 2, 3, 4, 5.\" Then the next tray. \"1, 2, 3, 4, 5.\" Phew!", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "Ganesha smiles. \"Mooshak, a FULL tray is always 5. You don't need to count it!\"", s: F({ cast: ["ganesha", "mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "This is a tray of five. It has 5 spaces. When every space is full, there are 5 modaks.", demo: { type: "frame5", n: 5 } },
      { t: "Now some spaces are empty. 4 full, 1 empty. Full tray is 5, one missing, so it is 4.", demo: { type: "frame5", n: 4 } },
      { t: "Here 3 are full and 2 are empty. Look at the full ones: 3!", demo: { type: "frame5", n: 3 } },
      { t: "Remember: full tray means 5. Look at the empty spaces to help you!", demo: { type: "frame5", n: 5 } },
    ],
    talk: "Show 5 fingers - a full hand is like a full tray! Fold one down: how many now?",
    gameName: "Tray Flash",
    game: { type: "flash", item: "modak", layout: "frame5", rounds: [5, 3, 4, 5, 2, 5] },
    physical: { title: "Egg tray fill", steps: ["Cut an egg tray to 5 cups.", "Fill it with modaks or balls - \"full tray is 5!\"", "Fill 3 or 4: \"how many? how many empty?\""] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "Tomorrow: Spider-Man's web gets a shake!",
  },
  {
    day: 9, title: "The wobbly web", costars: ["Spider-Man", "Mooshak"], skill: "C4", review: ["P1", "C2"],
    power: { name: "Still-the-Same Power", desc: "Moving things around does not change how many there are." },
    story: [
      { t: "Spider-Man puts 6 modaks in a neat row on his web. Mooshak counts: \"6 modaks!\"", s: { bg: "sky", web: true, items: { item: "modak", n: 6, on: "web" } } },
      { t: "Suddenly - WHOOOSH! - a big wind blows. The web wobbles and shakes!", s: { bg: "sky", web: true, swing: true } },
      { t: "The modaks roll all over the place. Now they are spread out, far apart.", s: { bg: "sky", items: { item: "modak", n: 6, on: "floor" } } },
      { t: "Mooshak cries, \"Oh no! Did we lose some? It looks like MORE! Or less? I don't know!\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
      { t: "Hmm. When things move around, does the number change? Let's find out.", s: F({ cast: ["mooshak"], mood: "thinking" }) },
    ],
    learn: [
      { t: "Here are 5 modaks in a line. Count them: 1, 2, 3, 4, 5. So there are 5.", demo: { type: "count", item: "modak", n: 5 } },
      { t: "Now watch. The modaks move and spread out. Did anyone add a modak? No. Did anyone take one away? No.", demo: { type: "conserve", item: "modak", n: 5 } },
      { t: "So they are STILL 5! Moving them around does not change how many there are.", demo: { type: "number", n: 5 } },
      { t: "Only adding or taking away changes the number. Spreading out does not!", demo: { type: "conserve", item: "modak", n: 4 } },
    ],
    talk: "Line up 5 toys, count them, then spread them out. Ask Medhu: \"Still 5? How do you know?\"",
    gameName: "Wobbly Web",
    game: { type: "conserve", item: "modak", rounds: [4, 6, 5, 7] },
    physical: { title: "Spread them out", steps: ["Count 6 objects in a line together.", "Spread them far apart while he watches.", "\"How many now?\" - does he know it's still 6 without counting?"] },
    mistake: { item: "modak", shown: 6, claim: 7 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: which plate has more?",
  },
  {
    day: 10, title: "Which plate has more?", costars: ["Ganesha", "Spider-Man"], skill: "R2", review: ["C4", "S2"],
    power: { name: "More-or-Less Power", desc: "You can find which group has more." },
    story: [
      { t: "Two plates are ready for the feast: one for Ganesha, one for Spider-Man.", s: F({ cast: ["ganesha"], items: { item: "modak", n: 5, on: "plate" } }) },
      { t: "Ganesha says, \"I'm the birthday boy! I should get the plate with MORE modaks!\"", s: F({ cast: ["ganesha"], mood: "excited" }) },
      { t: "Spider-Man spreads his modaks out wide. Now his plate LOOKS bigger. Is it really more?", s: { bg: "sky", web: true, items: { item: "modak", n: 4, on: "floor" } } },
      { t: "Mooshak is confused. \"Big-looking is not always more! How do we know for sure?\"", s: F({ cast: ["mooshak"], mood: "confused" }) },
    ],
    learn: [
      { t: "Here are two rows of modaks. Let's find out which has more by making pairs.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "Each top modak holds hands with a bottom modak. The ones left with no partner are EXTRA.", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "The row with extra modaks has MORE. The bottom row has more!", demo: { type: "match", item: "modak", a: 4, b: 6 } },
      { t: "You can also count both: 4 and 6. 6 comes after 4 when we count, so 6 is more.", demo: { type: "number", n: 6 } },
    ],
    talk: "Put 3 grapes in front of Papa and 5 in front of Medhu. Who has more? How do you know?",
    gameName: "More or Less",
    game: { type: "compare", item: "modak", rounds: [[3, 5], [6, 4], [2, 7], [5, 6], [8, 7]] },
    physical: { title: "Two plates", steps: ["Put 5 on one plate and 7 on another.", "\"Which has more? How do you know?\"", "Spread the 5 out wide - does he get tricked?"] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 4 },
    teaser: "Tomorrow: Mooshak finds a magic dice!",
  },
  {
    day: 11, title: "Mooshak's magic dice", costars: ["Mooshak", "Spider-Man"], skill: "S3", review: ["R2", "P1"],
    power: { name: "Dice Eyes", desc: "You can read any dice face in one look." },
    story: [
      { t: "While cleaning Ganesha's room, Mooshak finds something shiny under the bed. A magic dice!", s: { bg: "night", cast: ["mooshak"], mood: "excited" } },
      { t: "Every side has dots. 1 dot, 2 dots, 3 dots... all the way to 6 dots!", s: { bg: "night", cast: ["mooshak"], big: "1-6" } },
      { t: "Spider-Man says, \"Superheroes never count dice dots. They know the PATTERN!\"", s: { bg: "sky", web: true, swing: true } },
    ],
    learn: [
      { t: "Each number on a dice has its own picture. 1 is one dot in the middle.", demo: { type: "dice", n: 1 } },
      { t: "3 is a slide - three dots going down like a slide!", demo: { type: "dice", n: 3 } },
      { t: "4 is the four corners. 5 is four corners plus one in the middle.", demo: { type: "dice", n: 5 } },
      { t: "6 is two lines of 3, like two rows of soldiers. Learn the pictures and you'll never need to count!", demo: { type: "dice", n: 6 } },
    ],
    talk: "Roll a real dice 3 times. Medhu says the number without counting the dots.",
    gameName: "Dice Flash",
    game: { type: "flash", item: "modak", layout: "dice", rounds: [3, 5, 4, 6, 2, 5] },
    physical: { title: "Real dice", steps: ["Roll a real dice together.", "He says the number without counting dots.", "Show the same number on fingers."] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Tomorrow: diyas for the feast!",
  },
  {
    day: 12, title: "Diya patterns", costars: ["Ganesha", "Mooshak"], skill: "M1", review: ["S3", "R2"],
    power: { name: "Pattern Power", desc: "You can see what repeats and what comes next." },
    story: [
      { t: "It's getting dark. The feast needs light! Ganesha brings out lots of little diyas.", s: { bg: "night", cast: ["ganesha"] } },
      { t: "\"Let's put them in a pretty pattern,\" says Ganesha. \"Red, blue, red, blue...\"", s: { bg: "night", cast: ["ganesha"] } },
      { t: "Mooshak helps, but he mixes them up. Red, red, blue, red... \"Oops! That doesn't look pretty!\"", s: { bg: "night", cast: ["mooshak"], mood: "confused" } },
    ],
    learn: [
      { t: "A pattern is something that repeats again and again. Look: red, blue, red, blue.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "Find the part that repeats. Here it is \"red, blue\". Then it starts again.", demo: { type: "pattern", seq: ["red", "blue", "red", "blue", "red", "blue"] } },
      { t: "Some patterns are longer: blue, blue, red. Blue, blue, red. Say it like a song!", demo: { type: "pattern", seq: ["blue", "blue", "red", "blue", "blue", "red"] } },
    ],
    talk: "Clap-stamp, clap-stamp... what comes next? Make a pattern with your body!",
    gameName: "Pattern Garland",
    game: { type: "pattern", rounds: [["red", "blue", "red", "blue", "red"], ["yellow", "green", "yellow", "green"], ["blue", "blue", "red", "blue", "blue"], ["red", "yellow", "red", "yellow", "red", "yellow"]] },
    physical: { title: "Bead or block pattern", steps: ["Make a red-blue-red-blue row with blocks.", "\"What comes next?\"", "Let him make his own pattern for you to continue."] },
    easyWin: { item: "diya", n: 2 },
    teaser: "Tomorrow: building Ganesha's temple!",
  },
  {
    day: 13, title: "Ganesha's temple", costars: ["Ganesha", "Spider-Man"], skill: "G1", review: ["M1", "S2"],
    power: { name: "Shape Spotter", desc: "You know circles, triangles, squares and rectangles." },
    story: [
      { t: "The feast will happen at Ganesha's temple. But the temple needs fixing before the big day!", s: { bg: "temple", cast: ["ganesha"] } },
      { t: "Spider-Man brings building blocks in his web: circles, triangles, squares and rectangles.", s: { bg: "sky", web: true, swing: true } },
      { t: "\"Which shape goes where?\" asks Ganesha. \"Help me find the right ones!\"", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "thinking" } },
    ],
    learn: [
      { t: "A circle is round, like a roti or Captain America's shield. It has no corners at all.", demo: { type: "shape", shape: "circle" } },
      { t: "A triangle has 3 sides and 3 corners. The top of the temple is a triangle!", demo: { type: "shape", shape: "triangle" } },
      { t: "A square has 4 sides, all the same size, and 4 corners.", demo: { type: "shape", shape: "square" } },
      { t: "A rectangle also has 4 sides and 4 corners, but it is longer - like a door.", demo: { type: "shape", shape: "rectangle" } },
    ],
    talk: "Find one circle and one rectangle in this room together.",
    gameName: "Shape Quest",
    game: { type: "shapes", rounds: ["circle", "triangle", "square", "rectangle"] },
    physical: { title: "Shape hunt", steps: ["Walk around the house together.", "Find 2 circles, 2 rectangles, 1 triangle.", "Name each one and count its corners."] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: THE FEAST! And a surprise trophy...",
  },
  {
    day: 14, title: "The great modak feast", costars: ["Ganesha", "Spider-Man", "Mooshak"], skill: "C2", review: ["S2", "C3", "R2", "P1"],
    power: { name: "Golden Modak", desc: "You finished the Modak Mission!" },
    story: [
      { t: "It's Ganesha's birthday! The temple is shining with diyas, and all his friends are here.", s: { bg: "temple", cast: ["ganesha", "mooshak"], mood: "excited" } },
      { t: "Spider-Man swings in with the very last modaks. Mooshak is dancing on the table!", s: { bg: "sky", web: true, swing: true, items: { item: "modak", n: 5, on: "web" } } },
      { t: "\"Before we eat,\" says Ganesha, \"my Modak Helper must do one final mission.\"", s: F({ cast: ["ganesha"] }) },
      { t: "Use ALL your powers: Super Eyes, Exactly Power, More-or-Less and Tray of Five!", s: F({ cast: ["mooshak"], mood: "excited", big: "★★★" }) },
      { t: "Do it, and Ganesha has a golden surprise for you...", s: F({ cast: ["ganesha", "mooshak"] }) },
    ],
    learn: [
      { t: "Quick reminder of your powers! Super Eyes: look once and know.", demo: { type: "glance", item: "modak", n: 4 } },
      { t: "Exactly Power: move one at a time, and stop at the number.", demo: { type: "giveN", item: "modak", n: 5, pile: 8 } },
      { t: "Tray of Five: a full tray is always 5.", demo: { type: "frame5", n: 5 } },
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
    teaser: "Next arc: Hanuman and Iron Man race to Lanka!",
  },
];

export function questByDay(day: number) {
  return QUESTS.find((q) => q.day === day);
}
