import type { EffectiveStatus } from "@/lib/queries";

const dtf = new Intl.DateTimeFormat("bs-BA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatKickoff(iso: string): string {
  return dtf.format(new Date(iso)).replace(",", " ·");
}

export function statusLabel(status: EffectiveStatus): string {
  switch (status) {
    case "open":
      return "Otvoreno za tipovanje";
    case "closed":
      return "Glasanje zatvoreno";
    case "finished":
      return "Završeno";
  }
}

export const VOTING_CLOSED_MESSAGE =
  "Glasanje je zatvoreno. Rezultati su i dalje dostupni.";
