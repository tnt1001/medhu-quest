import type { Game } from "@/content/quests";

// Spaced retrieval: one quick round of each recently learned skill before the new story.
const ROUND: Record<string, Game> = {
  C2: { type: "count", item: "modak", rounds: [5] },
  S1: { type: "flash", item: "modak", layout: "scatter", rounds: [3] },
  S2: { type: "flash", item: "modak", layout: "scatter", rounds: [4] },
  C3: { type: "giveN", item: "modak", rounds: [5] },
  P1: { type: "flash", item: "modak", layout: "frame5", rounds: [4] },
  C4: { type: "conserve", item: "modak", rounds: [5] },
  R2: { type: "compare", item: "modak", rounds: [[4, 6]] },
  S3: { type: "flash", item: "modak", layout: "dice", rounds: [5] },
  M1: { type: "pattern", rounds: [["red", "blue", "red", "blue"]] },
  G1: { type: "shapes", rounds: ["triangle"] },
};

export function warmupFor(review: string[]): Game | null {
  const parts = review.map((r) => ROUND[r]).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return null;
  return parts.length === 1 ? parts[0] : { type: "mixed", parts };
}
