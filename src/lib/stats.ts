import type { Match, Submission } from "@/lib/queries";
import { outcomeOf, predictionPoints } from "@/lib/puls";

export function averagePuls(subs: Submission[]): number {
  if (subs.length === 0) return 0;
  const sum = subs.reduce((a, s) => a + s.puls_value, 0);
  return Math.round(sum / subs.length);
}

export interface CountryStat {
  name: string;
  count: number;
  avg: number;
}

/** Countries ranked by AVERAGE puls (highest/closest to 100 first). */
export function pulsByCountry(subs: Submission[], limit = 5): CountryStat[] {
  const map = new Map<string, { sum: number; count: number }>();
  for (const s of subs) {
    const cur = map.get(s.country) ?? { sum: 0, count: 0 };
    cur.sum += s.puls_value;
    cur.count += 1;
    map.set(s.country, cur);
  }
  return [...map.entries()]
    .map(([name, v]) => ({ name, count: v.count, avg: Math.round(v.sum / v.count) }))
    .sort((a, b) => b.avg - a.avg || b.count - a.count)
    .slice(0, limit);
}

export interface CityStat {
  city: string;
  country: string;
  count: number;
}

/** Cities ranked purely by NUMBER of submissions. */
export function topCities(subs: Submission[], limit = 10): CityStat[] {
  const map = new Map<
    string,
    { display: string; country: string; count: number }
  >();
  for (const s of subs) {
    const cur =
      map.get(s.city_normalized) ??
      { display: s.city_display, country: s.country, count: 0 };
    cur.count += 1;
    map.set(s.city_normalized, cur);
  }
  return [...map.values()]
    .map((v) => ({ city: v.display, country: v.country, count: v.count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, limit);
}

export interface PredictionDist {
  bih: number;
  draw: number;
  opponent: number;
  total: number;
  bihPct: number;
  drawPct: number;
  opponentPct: number;
}

export function predictionDistribution(subs: Submission[]): PredictionDist {
  let bih = 0,
    draw = 0,
    opponent = 0;
  for (const s of subs) {
    const o = outcomeOf(s.bih_score, s.opponent_score);
    if (o === "bih") bih += 1;
    else if (o === "draw") draw += 1;
    else opponent += 1;
  }
  const total = subs.length || 1;
  return {
    bih,
    draw,
    opponent,
    total: subs.length,
    bihPct: Math.round((bih / total) * 100),
    drawPct: Math.round((draw / total) * 100),
    opponentPct: Math.round((opponent / total) * 100),
  };
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  city_display: string;
  country: string;
  bih_score: number;
  opponent_score: number;
  puls_value: number;
  points: number;
}

export function buildLeaderboard(
  match: Match,
  subs: Submission[],
): LeaderboardEntry[] | null {
  if (
    match.status !== "finished" ||
    match.bih_final_score === null ||
    match.opponent_final_score === null
  ) {
    return null;
  }
  return subs
    .map((s) => ({
      id: s.id,
      name: s.name,
      city_display: s.city_display,
      country: s.country,
      bih_score: s.bih_score,
      opponent_score: s.opponent_score,
      puls_value: s.puls_value,
      points: predictionPoints(
        s.bih_score,
        s.opponent_score,
        match.bih_final_score as number,
        match.opponent_final_score as number,
      ),
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.puls_value - a.puls_value ||
        a.name.localeCompare(b.name),
    );
}
