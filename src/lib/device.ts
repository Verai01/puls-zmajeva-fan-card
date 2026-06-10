// One submission per device per match, tracked in localStorage.
import { useCallback, useEffect, useState } from "react";

const KEY_PREFIX = "pulszmajeva:submitted:";
const PROFILE_KEY = "pulszmajeva:profile";
export const SUBMITTED_CHANGE_EVENT = "pulszmajeva:submitted";
export const PROFILE_CHANGE_EVENT = "pulszmajeva:profile";

export interface UserProfile {
  name: string;
  country: string;
  city_display: string;
  city_normalized: string;
  puls_value: number;
  puls_label: string;
  /** Submission id of the one shareable BiH Puls Card. */
  cardSubmissionId: string;
}

export function getSubmittedId(matchId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(KEY_PREFIX + matchId);
  } catch {
    return null;
  }
}

export function setSubmittedId(matchId: string, submissionId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_PREFIX + matchId, submissionId);
    window.dispatchEvent(new CustomEvent(SUBMITTED_CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

export function hasSubmitted(matchId: string): boolean {
  return getSubmittedId(matchId) !== null;
}

/** Map of matchId -> submissionId for everything submitted on this device. */
export function getAllSubmitted(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(KEY_PREFIX)) {
        const id = k.slice(KEY_PREFIX.length);
        const v = localStorage.getItem(k);
        if (v) out[id] = v;
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

/** Client-side hook returning the submitted map (empty during SSR/first paint). */
export function useSubmittedMatches(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  const refresh = useCallback(() => setMap(getAllSubmitted()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  return map;
}

/** Sync a single match submission id on mount, focus, and same-tab updates. */
export function useSubmittedId(matchId: string): string | null {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const refresh = useCallback(() => setSubmissionId(getSubmittedId(matchId)), [matchId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  return submissionId;
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

export function hasUserProfile(): boolean {
  return getUserProfile() !== null;
}

/** Client-side hook for the stored card identity (empty during SSR/first paint). */
export function useUserProfile(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const refresh = useCallback(() => setProfile(getUserProfile()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(PROFILE_CHANGE_EVENT, refresh);
    window.addEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PROFILE_CHANGE_EVENT, refresh);
      window.removeEventListener(SUBMITTED_CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  return profile;
}
