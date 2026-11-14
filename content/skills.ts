export type Strand = "C" | "S" | "R" | "P" | "O" | "G" | "M";

export interface Skill {
  id: string;
  strand: Strand;
  name: string;
  needs: string[];
  check: string;
}

export const STRANDS: Record<Strand, string> = {
  C: "Counting",
  S: "Seeing amounts",
  R: "Relationships",
  P: "Part-whole",
  O: "Operations",
  G: "Shapes & space",
  M: "Patterns & measuring",
};

export const LEVELS = ["Not started", "Emerging", "Developing", "Secure", "Fluent"];

export const SKILLS: Skill[] = [
  { id: "C1", strand: "C", name: "One object per number, up to 20", needs: [], check: "Counts a scattered set of 15 correctly" },
  { id: "C2", strand: "C", name: "Last number counted = how many", needs: ["C1"], check: "Answers \"how many?\" without recounting" },
  { id: "C3", strand: "C", name: "Gives exactly N from a pile, up to 10", needs: ["C2"], check: "\"Give me 8\" - stops at 8" },
  { id: "C4", strand: "C", name: "Count stays the same when objects move", needs: ["C2"], check: "Spread 6 out - says 6 without recounting" },
  { id: "C5", strand: "C", name: "Counts on from any number to 20", needs: ["C2", "R3"], check: "\"Start at 7, count 3 more\" - 8, 9, 10" },
  { id: "S1", strand: "S", name: "Knows 1-3 at a glance", needs: [], check: "2-second flash, correct" },
  { id: "S2", strand: "S", name: "Knows 4-5 at a glance", needs: ["S1"], check: "2-second flash, correct" },
  { id: "S3", strand: "S", name: "Reads dice and finger patterns to 6", needs: ["S2"], check: "Names dice face or fingers instantly" },
  { id: "S4", strand: "S", name: "Sees 6-10 as \"5 and some more\"", needs: ["S2", "P1"], check: "7 on a ten-frame - \"5 and 2, 7\"" },
  { id: "R1", strand: "R", name: "More, less, same by looking", needs: [], check: "Picks the bigger pile when the difference is clear" },
  { id: "R2", strand: "R", name: "Compares amounts to 10", needs: ["C2", "R1"], check: "6 vs 7 in different layouts - correct" },
  { id: "R3", strand: "R", name: "One more, one less within 20", needs: ["C2"], check: "\"One more than 13?\" - 14, without counting from 1" },
  { id: "R4", strand: "R", name: "Compares numerals to 20", needs: ["R2"], check: "\"14 or 17, which is bigger?\"" },
  { id: "R5", strand: "R", name: "Places numbers on a 0-20 line", needs: ["R3"], check: "Puts 12 roughly in the right spot" },
  { id: "P1", strand: "P", name: "Sees a full five-frame as 5", needs: ["S2"], check: "Knows 5 without counting" },
  { id: "P2", strand: "P", name: "Splits 5: how many are hiding?", needs: ["S2", "C2"], check: "All splits of 5 correct" },
  { id: "P3", strand: "P", name: "Ten-frame: 6-10 as 5 + some more", needs: ["P1", "S4"], check: "Reads any ten-frame up to 10" },
  { id: "P4", strand: "P", name: "Splits 10", needs: ["P2", "P3"], check: "6+ of the 9 splits correct" },
  { id: "O1", strand: "O", name: "Adding stories with objects, up to 5", needs: ["C2", "R3"], check: "\"3 modaks, 2 more come\" - 5" },
  { id: "O2", strand: "O", name: "Taking-away stories with objects, up to 5", needs: ["O1"], check: "\"5 pots, Krishna takes 2\" - 3" },
  { id: "O3", strand: "O", name: "Adding and taking away up to 10", needs: ["O1", "O2", "P2"], check: "Mixed stories, 4 of 5 correct" },
  { id: "O4", strand: "O", name: "Adds by counting on", needs: ["C5", "O3"], check: "\"6 and 3 more\" - 7, 8, 9" },
  { id: "O5", strand: "O", name: "Missing-part stories", needs: ["P2", "O3"], check: "Infinity Stones game - correct" },
  { id: "G1", strand: "G", name: "Names and sorts 4 basic shapes", needs: [], check: "Sorts a mixed pile" },
  { id: "G2", strand: "G", name: "Counts sides and corners", needs: ["G1", "C1"], check: "Says why a triangle is a triangle" },
  { id: "G3", strand: "G", name: "Position words", needs: [], check: "Follows a 2-step hiding instruction" },
  { id: "G4", strand: "G", name: "Builds shapes from shapes", needs: ["G2"], check: "Makes a square from 2 triangles" },
  { id: "M1", strand: "M", name: "Copies and extends AB patterns", needs: [], check: "Continues a red-blue diya row" },
  { id: "M2", strand: "M", name: "ABB, AAB, ABC patterns; makes own", needs: ["M1"], check: "Makes a new pattern and explains it" },
  { id: "M3", strand: "M", name: "Size, weight; orders 3 objects", needs: ["R1"], check: "Orders 3 objects by height" },
  { id: "M4", strand: "M", name: "Sorts by one rule, then another", needs: ["G1"], check: "Sorts heroes by \"can fly\", then by colour" },
];

// The core path to addition, in teaching order. Used by the recommender.
export const CORE_PATH = ["C1", "C2", "S1", "S2", "C3", "C4", "R1", "P1", "R2", "S3", "P2", "R3", "O1", "O2", "S4", "P3", "R4", "C5", "O3", "R5", "P4", "O4", "O5"];
export const SIDE_PATH = ["G1", "M1", "G3", "M3", "G2", "M2", "M4", "G4"];

export const CHECK_ITEMS = [
  { n: 1, item: "Count 7 objects, then \"so how many?\"", skills: "C2" },
  { n: 2, item: "\"Give me exactly 8\" from a pile", skills: "C3" },
  { n: 3, item: "Spread 6 counted objects out, \"how many now?\"", skills: "C4" },
  { n: 4, item: "Flash 3, then 5, for 2 seconds", skills: "S1, S2" },
  { n: 5, item: "Flash 7 on a ten-frame", skills: "S4, P3" },
  { n: 6, item: "5 objects, hide 2, \"how many hiding?\"", skills: "P2" },
  { n: 7, item: "10 objects, hide 4, \"how many hiding?\"", skills: "P4" },
  { n: 8, item: "\"What's one more than 13?\"", skills: "R3" },
  { n: 9, item: "\"What's one less than 9?\"", skills: "R3" },
  { n: 10, item: "\"Which is bigger, 14 or 17?\"", skills: "R4" },
  { n: 11, item: "\"3 modaks, Mooshak brings 4 more. How many?\"", skills: "O1, O3" },
  { n: 12, item: "\"8 modaks in the box, 3 more go in. How many?\" (watch for counting on)", skills: "O4" },
];

export const CHECK_STRANDS: { label: string; items: number[] }[] = [
  { label: "How many (C)", items: [1, 2, 3] },
  { label: "Seeing amounts (S)", items: [4, 5] },
  { label: "Splitting (P)", items: [6, 7] },
  { label: "Relationships (R)", items: [8, 9, 10] },
  { label: "Operations (O)", items: [11, 12] },
];

export const HINDI: string[] = [
  "shunya", "ek", "do", "teen", "chaar", "paanch", "chhah", "saat", "aath", "nau", "das",
  "gyarah", "barah", "terah", "chaudah", "pandrah", "solah", "satrah", "atharah", "unnees", "bees",
];
export const HINDI_DEV: string[] = [
  "शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस",
  "ग्यारह", "बारह", "तेरह", "चौदह", "पंद्रह", "सोलह", "सत्रह", "अठारह", "उन्नीस", "बीस",
];
export const ENGLISH: string[] = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
