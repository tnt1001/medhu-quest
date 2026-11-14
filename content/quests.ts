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

export interface Quest {
  day: number;
  title: string;
  costars: string[];
  skill: string;
  review: string[];
  story: string[];
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

export const QUESTS: Quest[] = [
  {
    day: 1, title: "Mooshak needs a helper", costars: ["Mooshak", "Ganesha", "Spider-Man"], skill: "C2", review: [],
    story: [
      "Ganesha's birthday feast is in 2 weeks! Ganesha wants 100 modaks for all his friends.",
      "But Mooshak is a tiny mouse. He cannot count so many modaks alone. \"I need a helper!\" he squeaks.",
      "Spider-Man swings in. \"I can carry modaks in my web. But who will count them?\"",
      "Mooshak looks at you. \"Medhu, will you be my helper? First, a helper test!\"",
    ],
    gameName: "Helper Test, part 1",
    game: { type: "check", items: [1, 2, 3, 4] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: part 2 of the helper test!",
  },
  {
    day: 2, title: "Helper test, part 2", costars: ["Mooshak", "Spider-Man"], skill: "S1", review: [],
    story: [
      "Mooshak is very happy. \"You passed part 1! Now part 2.\"",
      "Spider-Man hides some modaks in his web. \"Can you find out how many are hiding?\"",
      "Ganesha's trunk goes up and down. He is watching you!",
    ],
    gameName: "Helper Test, part 2",
    game: { type: "check", items: [5, 6, 7, 8] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: the last part of the helper test!",
  },
  {
    day: 3, title: "Helper test, part 3", costars: ["Mooshak", "Ganesha"], skill: "R1", review: [],
    story: [
      "\"Last part!\" says Mooshak, jumping on the table.",
      "Ganesha asks some tricky questions about modaks. Bigger numbers, more modaks!",
      "Finish this, and you become Ganesha's official Modak Helper.",
    ],
    gameName: "Helper Test, part 3",
    game: { type: "check", items: [9, 10, 11, 12] },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: your first real modak mission!",
  },
  {
    day: 4, title: "How many modaks?", costars: ["Mooshak", "Spider-Man"], skill: "C2", review: ["S1"],
    story: [
      "You are now the official Modak Helper! Mooshak gives you a helper badge.",
      "Spider-Man brings modaks in his web, a few at a time.",
      "Mooshak always counts them again and again. \"1, 2, 3, 4... how many was that? 1, 2, 3, 4...\"",
      "Teach Mooshak: when you finish counting, the LAST number tells you how many!",
    ],
    gameName: "Count and Tell",
    game: { type: "count", item: "modak", rounds: [3, 5, 4, 6, 7] },
    physical: { title: "Modak count", steps: ["Put 4-7 small objects in a row.", "He counts by touching each one.", "Ask \"So how many?\" - he should answer without counting again."] },
    mistake: { item: "modak", shown: 4, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: Spider-Man's super-fast web!",
  },
  {
    day: 5, title: "Spider-Man's fast web", costars: ["Spider-Man", "Mooshak"], skill: "S1", review: ["C2"],
    story: [
      "Spider-Man swings SO fast. Whoosh! The modaks in his web appear and disappear.",
      "\"No time to count!\" says Spider-Man. \"Just look and tell me how many!\"",
      "Ek, do, teen - you can see small numbers in one look. Like a superhero!",
    ],
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [2, 1, 3, 2, 3, 1] },
    mistake: { item: "modak", shown: 3, claim: 2 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Tomorrow: Mooshak opens a modak shop!",
  },
  {
    day: 6, title: "Mooshak's modak shop", costars: ["Mooshak", "Ganesha"], skill: "C3", review: ["S1", "C2"],
    story: [
      "Mooshak opens a modak shop for the feast. You are the shopkeeper!",
      "Ganesha's friends come to buy. \"I want 4 modaks, please!\"",
      "A good shopkeeper gives EXACTLY the right number. Not one more, not one less.",
    ],
    gameName: "Modak Shop",
    game: { type: "giveN", item: "modak", rounds: [3, 5, 4, 6, 8] },
    physical: { title: "Real modak shop", steps: ["Make a pile of 15 small objects.", "Be the customer: \"I want 6 please!\"", "Check: did he stop at 6? Try 4, 7, 8."] },
    mistake: { item: "modak", shown: 6, claim: 5 },
    easyWin: { item: "modak", n: 2 },
    teaser: "Tomorrow: Spider-Man's web gets even faster!",
  },
  {
    day: 7, title: "Faster web!", costars: ["Spider-Man", "Mooshak"], skill: "S2", review: ["S1", "C3"],
    story: [
      "Spider-Man has a new trick. His web catches 4 or 5 modaks at once!",
      "Chaar, paanch - four, five. Can you see them in one look?",
      "Mooshak covers his eyes. \"Too fast for me! You tell me, Medhu!\"",
    ],
    gameName: "Flash!",
    game: { type: "flash", item: "modak", layout: "scatter", rounds: [4, 3, 5, 4, 5, 2] },
    mistake: { item: "modak", shown: 5, claim: 4 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: Ganesha's special modak trays!",
  },
  {
    day: 8, title: "Ganesha's trays of five", costars: ["Ganesha", "Mooshak"], skill: "P1", review: ["S2"],
    story: [
      "Ganesha has special trays. Each tray has 5 holes - paanch!",
      "When a tray is full, you KNOW it has 5. No counting needed!",
      "Mooshak keeps counting full trays. \"1, 2, 3, 4, 5...\" Show him the trick!",
    ],
    gameName: "Tray Flash",
    game: { type: "flash", item: "modak", layout: "frame5", rounds: [5, 3, 4, 5, 2, 5] },
    physical: { title: "Egg tray fill", steps: ["Cut an egg tray to 5 cups.", "Fill it with modaks or balls - \"full tray is 5!\"", "Fill 3 or 4: \"how many? how many empty?\""] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 5 },
    teaser: "Tomorrow: Spider-Man's web gets a shake!",
  },
  {
    day: 9, title: "The wobbly web", costars: ["Spider-Man", "Mooshak"], skill: "C4", review: ["P1", "C2"],
    story: [
      "Oh no! The wind shakes Spider-Man's web. The modaks roll all over!",
      "Mooshak cries, \"We lost some modaks!\"",
      "Did we? When modaks move around, is the number still the same? Let's find out.",
    ],
    gameName: "Wobbly Web",
    game: { type: "conserve", item: "modak", rounds: [4, 6, 5, 7] },
    physical: { title: "Spread them out", steps: ["Count 6 objects in a line together.", "Spread them far apart while he watches.", "\"How many now?\" - does he know it's still 6 without counting?"] },
    mistake: { item: "modak", shown: 6, claim: 7 },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: which plate has more?",
  },
  {
    day: 10, title: "Which plate has more?", costars: ["Ganesha", "Spider-Man"], skill: "R2", review: ["C4", "S2"],
    story: [
      "Ganesha and Spider-Man both want the plate with MORE modaks.",
      "Sometimes the bigger-looking plate has fewer! Tricky!",
      "Count carefully, or look closely, and help them choose.",
    ],
    gameName: "More or Less",
    game: { type: "compare", item: "modak", rounds: [[3, 5], [6, 4], [2, 7], [5, 6], [8, 7]] },
    physical: { title: "Two plates", steps: ["Put 5 on one plate and 7 on another.", "\"Which has more? How do you know?\"", "Spread the 5 out wide - does he get tricked?"] },
    mistake: { item: "modak", shown: 7, claim: 6 },
    easyWin: { item: "modak", n: 4 },
    teaser: "Tomorrow: Mooshak finds a magic dice!",
  },
  {
    day: 11, title: "Mooshak's magic dice", costars: ["Mooshak", "Spider-Man"], skill: "S3", review: ["R2", "P1"],
    story: [
      "Mooshak finds a magic dice in Ganesha's room!",
      "Each side has dots in a special pattern. Spider-Man knows them all.",
      "Learn the patterns, and you can read the dice in one look!",
    ],
    gameName: "Dice Flash",
    game: { type: "flash", item: "modak", layout: "dice", rounds: [3, 5, 4, 6, 2, 5] },
    physical: { title: "Race to Lanka (preview)", steps: ["Roll a real dice together.", "He says the number without counting dots.", "Show the same number on fingers."] },
    mistake: { item: "modak", shown: 5, claim: 6 },
    easyWin: { item: "modak", n: 1 },
    teaser: "Tomorrow: diyas for the feast!",
  },
  {
    day: 12, title: "Diya patterns", costars: ["Ganesha", "Mooshak"], skill: "M1", review: ["S3", "R2"],
    story: [
      "The feast needs light! Ganesha wants rows of diyas in a pattern.",
      "Red, blue, red, blue... what comes next?",
      "Mooshak keeps mixing them up. Help him fix the patterns!",
    ],
    gameName: "Pattern Garland",
    game: { type: "pattern", rounds: [["red", "blue", "red", "blue", "red"], ["yellow", "green", "yellow", "green"], ["blue", "blue", "red", "blue", "blue"], ["red", "yellow", "red", "yellow", "red", "yellow"]] },
    physical: { title: "Bead or block pattern", steps: ["Make a red-blue-red-blue row with blocks.", "\"What comes next?\"", "Let him make his own pattern for you to continue."] },
    easyWin: { item: "diya", n: 2 },
    teaser: "Tomorrow: building Ganesha's temple!",
  },
  {
    day: 13, title: "Ganesha's temple", costars: ["Ganesha", "Spider-Man"], skill: "G1", review: ["M1", "S2"],
    story: [
      "The feast happens at Ganesha's temple. But it needs fixing!",
      "Spider-Man brings shapes: circles, triangles, squares and rectangles.",
      "Find the right shapes to build the temple!",
    ],
    gameName: "Shape Quest",
    game: { type: "shapes", rounds: ["circle", "triangle", "square", "rectangle"] },
    physical: { title: "Shape hunt", steps: ["Walk around the house together.", "Find 2 circles, 2 rectangles, 1 triangle.", "Name each one and count its corners."] },
    easyWin: { item: "modak", n: 3 },
    teaser: "Tomorrow: THE FEAST! And a surprise trophy...",
  },
  {
    day: 14, title: "The great modak feast", costars: ["Ganesha", "Spider-Man", "Mooshak"], skill: "C2", review: ["S2", "C3", "R2", "P1"],
    story: [
      "It's Ganesha's birthday feast! Everyone is here.",
      "Spider-Man swings in with the last modaks. Mooshak is dancing.",
      "One last mission, helper: count, look and choose to make the feast perfect!",
      "Then Ganesha has a surprise for you...",
    ],
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
