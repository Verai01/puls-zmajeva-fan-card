import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { countryByName } from "@/lib/data/countries";

export type Match = Tables<"matches"> & { local_time_label?: string | null };
export type Submission = Tables<"submissions">;

export const SUBMISSIONS_REFETCH_MS = 10_000;

export type EffectiveStatus = "open" | "closed" | "finished";

/**
 * Match phase used across the app:
 *  - "open"     → kickoff is in the future, predictions allowed
 *  - "live"     → kickoff has passed, no final score yet (running, closed)
 *  - "finished" → final score entered (or match flagged finished)
 */
export type MatchPhase = "open" | "live" | "finished";

export interface MatchAvailability {
  /** Opponent is a real configured team. */
  configured: boolean;
  /** Both final scores are present. */
  hasFinal: boolean;
  phase: MatchPhase;
  /** Predictions allowed: configured + kickoff in the future + not final. */
  canPredict: boolean;
}

/** True when the opponent is a real configured team (has a flag, not a placeholder). */
export function isOpponentConfigured(match: Match): boolean {
  const name = match.opponent_name?.trim() ?? "";
  if (!name) return false;
  if (/^protivnik/i.test(name)) return false;
  return !!countryByName(name);
}

/**
 * Centralized match availability / status logic. Predictions are open ONLY
 * while kickoff is strictly in the future — they close exactly at kickoff.
 * A match is never "finished" just because kickoff passed; it needs a final
 * score (or an explicit finished status).
 */
export function getMatchAvailability(
  match: Match,
  now: number = Date.now(),
): MatchAvailability {
  const configured = isOpponentConfigured(match);
  const hasFinal =
    match.bih_final_score !== null && match.opponent_final_score !== null;
  const kickoff = new Date(match.kickoff_time).getTime();

  let phase: MatchPhase;
  if (hasFinal || match.status === "finished") {
    phase = "finished";
  } else if (kickoff > now) {
    phase = "open";
  } else {
    phase = "live";
  }

  const canPredict = configured && phase === "open";
  return { configured, hasFinal, phase, canPredict };
}

export function effectiveStatus(match: Match, now: number = Date.now()): EffectiveStatus {
  const { phase } = getMatchAvailability(match, now);
  if (phase === "finished") return "finished";
  if (phase === "open") return "open";
  return "closed";
}

export function isVotingOpen(match: Match, now: number = Date.now()): boolean {
  return getMatchAvailability(match, now).canPredict;
}

async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("kickoff_time", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function fetchMatch(id: string): Promise<Match> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Utakmica nije pronađena.");
  return data;
}

async function fetchSubmissions(matchId: string): Promise<Submission[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

async function fetchSubmission(id: string): Promise<Submission> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Card nije pronađena.");
  return data;
}

export const matchesQuery = () =>
  queryOptions({ queryKey: ["matches"], queryFn: fetchMatches });

export const matchQuery = (id: string) =>
  queryOptions({ queryKey: ["match", id], queryFn: () => fetchMatch(id) });

export const submissionsQuery = (matchId: string) =>
  queryOptions({
    queryKey: ["submissions", matchId],
    queryFn: () => fetchSubmissions(matchId),
    refetchInterval: SUBMISSIONS_REFETCH_MS,
  });

export const submissionQuery = (id: string) =>
  queryOptions({ queryKey: ["submission", id], queryFn: () => fetchSubmission(id) });

export interface NewSubmission {
  match_id: string;
  name: string;
  country: string;
  city_display: string;
  city_normalized: string;
  bih_score: number;
  opponent_score: number;
  puls_value: number;
  puls_label: string;
}

export async function createSubmission(input: NewSubmission): Promise<Submission> {
  const { data, error } = await supabase
    .from("submissions")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
