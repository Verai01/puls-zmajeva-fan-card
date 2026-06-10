// One submission per device per match, tracked in localStorage.
import { useEffect, useState } from "react";

const KEY_PREFIX = "pulszmajeva:submitted:";

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
  useEffect(() => {
    setMap(getAllSubmitted());
  }, []);
  return map;
}
