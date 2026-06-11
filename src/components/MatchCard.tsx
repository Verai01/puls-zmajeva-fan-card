import { Link } from "@tanstack/react-router";
import { Clock, ChevronRight } from "lucide-react";
import type { Match } from "@/lib/queries";
import { getMatchAvailability } from "@/lib/queries";
import { countryByName, countryDisplayName } from "@/lib/data/countries";
import { formatSarajevo, localTimeValue } from "@/lib/format";
import { BosniaRoundFlag, RoundFlag } from "@/components/RoundFlag";
import { useI18n } from "@/lib/i18n";

type DisplayKey = "create" | "tip" | "submitted" | "live" | "finished" | "upcoming";

const chipStyles: Record<DisplayKey, string> = {
  create:
    "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_oklch(0.84_0.17_90_/_45%)]",
  tip: "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_oklch(0.84_0.17_90_/_45%)]",
  submitted: "bg-accent/25 text-ice border-accent/50",
  live: "bg-ice/15 text-ice border-ice/40",
  finished: "bg-secondary/60 text-foreground/70 border-border",
  upcoming: "bg-foreground/10 text-foreground/60 border-foreground/20",
};

const chipLabelKey: Record<DisplayKey, Parameters<ReturnType<typeof useI18n>["t"]>[0]> = {
  create: "status.create",
  tip: "status.tip",
  submitted: "status.submitted",
  live: "status.live",
  finished: "status.finished",
  upcoming: "status.upcoming",
};

export function MatchCard({
  match,
  submitted = false,
  hasProfile = false,
}: {
  match: Match;
  submitted?: boolean;
  hasProfile?: boolean;
}) {
  const { t, locale } = useI18n();
  const { configured, phase, hasFinal, canPredict } = getMatchAvailability(match);
  const opp = countryByName(match.opponent_name);
  const localLine = localTimeValue(match.local_time_label);
  const opponentLabel = configured
    ? countryDisplayName(match.opponent_name, locale)
    : t("common.soon");

  let key: DisplayKey;
  if (!configured) key = "upcoming";
  else if (phase === "finished") key = "finished";
  else if (phase === "live") key = "live";
  else if (submitted) key = "submitted";
  else key = hasProfile ? "tip" : "create";

  return (
    <Link
      to="/match/$id"
      params={{ id: match.id }}
      className="glass-card group relative block overflow-hidden rounded-2xl p-4 transition active:scale-[0.99]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex items-center gap-2 font-display text-2xl">
            <BosniaRoundFlag size="sm" />
            <span className="text-foreground">BiH</span>
          </div>
          <span className="font-display text-sm text-muted-foreground">VS</span>
          <div className="flex min-w-0 items-center gap-2 font-display text-2xl">
            {configured && opp?.code ? (
              <RoundFlag code={opp.code} size="sm" alt={opponentLabel} />
            ) : (
              <span className="shrink-0 text-xl">⏳</span>
            )}
            <span className="truncate text-foreground">{opponentLabel}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary transition group-hover:translate-x-0.5" />
      </div>

      {hasFinal && (
        <div className="mt-3 font-display text-3xl text-primary">
          {match.bih_final_score} : {match.opponent_final_score}
        </div>
      )}

      <div className="mt-3 flex items-end justify-between gap-2 text-xs">
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
            <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
            {formatSarajevo(match.kickoff_time)}
          </span>
          <span className="mt-0.5 block pl-5 text-[11px] text-muted-foreground">
            {t("common.sarajevoTime")}
          </span>
          {localLine && (
            <span className="mt-0.5 block pl-5 text-[10px] text-muted-foreground/80">
              {t("common.localTime")}: {localLine}
            </span>
          )}
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1 self-center">
          <span
            className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wide ${chipStyles[key]}`}
          >
            {t(chipLabelKey[key])}
          </span>
          {configured && !canPredict && phase !== "finished" && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-ice/70">
              {t("status.predictionClosed")}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
