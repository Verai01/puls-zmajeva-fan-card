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

/** Secondary line value under Sarajevo kickoff when `local_time_label` is set. */
export function localTimeValue(
  localLabel: string | null | undefined,
): string | null {
  if (!localLabel?.trim()) return null;
  return localLabel.trim();
}
