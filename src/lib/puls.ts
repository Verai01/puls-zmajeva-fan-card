export interface PulsCategory {
  min: number;
  max: number;
  label: string;
}

export const PULS_CATEGORIES: PulsCategory[] = [
  { min: 1, max: 20, label: "Slomljen, ali tu" },
  { min: 21, max: 40, label: "Nervozni Zmaj" },
  { min: 41, max: 60, label: "Realista" },
  { min: 61, max: 80, label: "Vjernik" },
  { min: 81, max: 100, label: "Već slavimo" },
];

export function pulsLabel(value: number): string {
  const v = Math.max(1, Math.min(100, Math.round(value)));
  const cat = PULS_CATEGORIES.find((c) => v >= c.min && v <= c.max);
  return cat ? cat.label : "Realista";
}

/** Index 0-4 of the puls category, used for card atmosphere variations. */
export function pulsCategoryIndex(value: number): number {
  const v = Math.max(1, Math.min(100, Math.round(value)));
  const idx = PULS_CATEGORIES.findIndex((c) => v >= c.min && v <= c.max);
  return idx === -1 ? 2 : idx;
}

/**
 * Points for the leaderboard.
 *  - Exact result => 3
 *  - Correct tendency (win/draw/loss) => 1
 *  - Otherwise => 0
 */
export function predictionPoints(
  predBih: number,
  predOpp: number,
  finalBih: number,
  finalOpp: number,
): number {
  if (predBih === finalBih && predOpp === finalOpp) return 3;
  const predTendency = Math.sign(predBih - predOpp);
  const finalTendency = Math.sign(finalBih - finalOpp);
  if (predTendency === finalTendency) return 1;
  return 0;
}

export type Outcome = "bih" | "draw" | "opponent";

export function outcomeOf(bih: number, opp: number): Outcome {
  if (bih > opp) return "bih";
  if (bih < opp) return "opponent";
  return "draw";
}
