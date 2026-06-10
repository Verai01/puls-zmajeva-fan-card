// One submission per device per match, tracked in localStorage.

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
