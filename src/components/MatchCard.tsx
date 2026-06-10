import { Link } from "@tanstack/react-router";
import { Clock, ChevronRight } from "lucide-react";
import type { Match } from "@/lib/queries";
import { effectiveStatus } from "@/lib/queries";
import { countryByName } from "@/lib/data/countries";
import { formatKickoff, statusLabel } from "@/lib/format";
import { BosniaFlag } from "@/components/BrandHeader";

const statusStyles: Record<string, string> = {
  open: "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_oklch(0.84_0.17_90_/_45%)]",
  closed: "bg-ice/15 text-ice border-ice/40",
  finished: "bg-secondary/60 text-foreground/60 border-border",
};

export function MatchCard({ match }: { match: Match }) {
  const status = effectiveStatus(match);
  const opp = countryByName(match.opponent_name);
  const finished = status === "finished";

  return (
    <Link
      to="/match/$id"
      params={{ id: match.id }}
      className="glass-card group relative block overflow-hidden rounded-2xl p-4 transition active:scale-[0.99]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2 font-display text-2xl">
            <BosniaFlag className="h-5 w-[1.8rem] shrink-0 rounded-[2px] ring-1 ring-foreground/15" />
            <span className="text-foreground">BiH</span>
          </div>
          <span className="font-display text-sm text-muted-foreground">VS</span>
          <div className="flex min-w-0 items-center gap-2 font-display text-2xl">
            <span className="shrink-0">{opp?.flag ?? "⚽"}</span>
            <span className="truncate text-foreground">{match.opponent_name}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-0.5" />
      </div>

      {finished && (
        <div className="mt-3 font-display text-3xl text-primary">
          {match.bih_final_score} : {match.opponent_final_score}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatKickoff(match.kickoff_time)}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wide ${statusStyles[status]}`}
        >
          {statusLabel(status)}
        </span>
      </div>
    </Link>
  );
}
