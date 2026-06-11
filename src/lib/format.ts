const sarajevoFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Sarajevo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "12.06.2026 21:00" in Sarajevo time. */
export function formatSarajevo(iso: string): string {
  const parts = sarajevoFmt.formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}

/** Kept for backwards compatibility — now uses Sarajevo time. */
export function formatKickoff(iso: string): string {
  return formatSarajevo(iso);
}

/**
 * Local timezone per match (diaspora fan-time shown on the card/match views).
 *  - BiH vs Kanada (CA)      → Toronto
 *  - BiH vs Švicarska (CH)   → Los Angeles
 *  - BiH vs Katar (QA)       → Seattle (same offset as Los Angeles)
 */
export function matchTimeZone(opponentCode?: string | null): string {
  switch ((opponentCode ?? "").toUpperCase()) {
    case "CA":
      return "America/Toronto";
    case "CH":
      return "America/Los_Angeles";
    case "QA":
      return "America/Los_Angeles";
    default:
      return "America/Los_Angeles";
  }
}

const localFmtCache = new Map<string, Intl.DateTimeFormat>();
function localFmt(tz: string): Intl.DateTimeFormat {
  let f = localFmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    localFmtCache.set(tz, f);
  }
  return f;
}

/** "10.06.2025 11:45" rendered in the match's local timezone. */
export function formatMatchLocal(
  iso: string,
  opponentCode?: string | null,
): string {
  const parts = localFmt(matchTimeZone(opponentCode)).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}
