import type { Game, Item } from "@/content/quests";

// Spaced retrieval: one quick round of each recently learned skill before the new story.
const ROUND: Record<string, Game> = {
  C2: { type: "count", item: "modak", rounds: [5] },
  S1: { type: "flash", item: "modak", layout: "scatter", rounds: [3] },
  S2: { type: "memory", rounds: [[2, 4, 5]] },
  C3: { type: "feed", rounds: [5] },
  P1: { type: "flash", item: "modak", layout: "frame5", rounds: [4] },
  C4: { type: "conserve", item: "modak", rounds: [5] },
  R2: { type: "compare", item: "modak", rounds: [[4, 6]] },
  S3: { type: "flash", item: "modak", layout: "dice", rounds: [5] },
  M1: { type: "pattern", rounds: [["red", "blue", "red", "blue"]] },
  G1: { type: "shapes", rounds: ["triangle"] },
  R3: { type: "hop", mode: "guess", rounds: [[9, 1]] },
  P2: { type: "shield", item: "vanara", rounds: [[5, 2]] },
  O1: { type: "army", item: "stone", op: "add", rounds: [[3, 2]] },
  M3: { type: "size", rounds: [3] },
  O2: { type: "army", item: "arrow", op: "take", rounds: [[5, 2]] },
  S4: { type: "flash", item: "arrow", layout: "frame10", rounds: [7] },
  R4: { type: "cards", rounds: [[13, 16]] },
  C5: { type: "hop", mode: "tap", rounds: [[8, 2]] },
  O3: { type: "army", item: "vanara", op: "add", rounds: [[6, 3]] },
};

// Keep each arc's world: in Arc 2+ the modak rounds use that arc's things instead.
function reskin(g: Game, item: Item): Game {
  if (item === "modak") return g;
  if (g.type === "feed") return { type: "giveN", item, rounds: g.rounds };
  if ("item" in g && g.item === "modak") return { ...g, item } as Game;
  return g;
}

export function warmupFor(review: string[], day = 1): Game | null {
  const item: Item = day >= 13 ? (day % 2 ? "vanara" : "arrow") : "modak";
  const parts = review.map((r) => ROUND[r]).filter(Boolean).slice(0, 2).map((g) => reskin(g, item));
  if (parts.length === 0) return null;
  return parts.length === 1 ? parts[0] : { type: "mixed", parts };
}
