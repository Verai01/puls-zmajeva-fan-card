import type { EffectiveStatus } from "@/lib/queries";

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

export function statusLabel(status: EffectiveStatus): string {
  switch (status) {
    case "open":
      return "Otvoreno za tipovanje";
    case "closed":
      return "Glasanje zatvoreno";
    case "finished":
      return "Rezultat unesen";
  }
}

export const VOTING_CLOSED_MESSAGE =
  "Glasanje je zatvoreno. Rezultati su i dalje dostupni.";

/** Secondary line under Sarajevo kickoff when `local_time_label` is set. */
export function formatLocalTimeLine(
  localLabel: string | null | undefined,
): string | null {
  if (!localLabel?.trim()) return null;
  return `Local time: ${localLabel.trim()}`;
}
