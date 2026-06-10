import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { countryByName } from "@/lib/data/countries";

export type Match = Tables<"matches"> & { local_time_label?: string | null };
export type Submission = Tables<"submissions">;

export const VOTE_CUTOFF_MS = 5 * 60 * 1000; // 5 minutes before kickoff

export type EffectiveStatus = "open" | "closed" | "finished";

export function effectiveStatus(match: Match, now: number = Date.now()): EffectiveStatus {
  if (
    match.status === "finished" &&
    match.bih_final_score !== null &&
    match.opponent_final_score !== null
  ) {
    return "finished";
  }
  const cutoff = new Date(match.kickoff_time).getTime() - VOTE_CUTOFF_MS;
  if (now >= cutoff) return "closed";
  return "open";
}

export function isVotingOpen(match: Match, now: number = Date.now()): boolean {
  return effectiveStatus(match, now) === "open";
}

/** True when the opponent is a real configured team (has a flag, not a placeholder). */
export function isOpponentConfigured(match: Match): boolean {
  const name = match.opponent_name?.trim() ?? "";
  if (!name) return false;
  if (/^protivnik/i.test(name)) return false;
  return !!countryByName(name);
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
