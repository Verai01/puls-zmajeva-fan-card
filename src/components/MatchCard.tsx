import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import type { Match } from "@/lib/queries";
import { getMatchAvailability } from "@/lib/queries";
import { countryByName, countryDisplayName } from "@/lib/data/countries";
import { formatSarajevo, localTimeValue } from "@/lib/format";
import { BosniaRoundFlag, RoundFlag } from "@/components/RoundFlag";
import { useI18n, type TKey } from "@/lib/i18n";

type DisplayKey = "create" | "tip" | "submitted" | "live" | "finished" | "upcoming";

const chipStyles: Record<DisplayKey, string> = {
  create:
    "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_oklch(0.84_0.17_90_/_45%)]",
  tip: "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_oklch(0.84_0.17_90_/_45%)]",
  submitted: "bg-accent/25 text-ice border-accent/50",
  live: "bg-[oklch(0.7_0.2_25_/_25%)] text-[oklch(0.85_0.13_25)] border-[oklch(0.7_0.2_25_/_55%)]",
  finished: "bg-secondary/60 text-foreground/70 border-border",
  upcoming: "bg-foreground/10 text-foreground/60 border-foreground/20",
};

const chipLabelKey: Record<DisplayKey, TKey> = {
  create: "status.create",
  tip: "status.tip",
  submitted: "status.submitted",
  live: "status.live",
  finished: "status.finished",
  upcoming: "status.upcoming",
};

function Team({
  flag,
  name,
}: {
  flag: React.ReactNode;
  name: string;
}) {
  return (
    <div className="flex w-0 flex-1 flex-col items-center gap-1.5">
      {flag}
      <span className="max-w-full truncate font-display text-lg uppercase leading-none text-foreground">
        {name}
      </span>
    </div>
  );
}

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
  const isLive = phase === "live";

  let key: DisplayKey;
  if (!configured) key = "upcoming";
  else if (phase === "finished") key = "finished";
  else if (isLive) key = "live";
  else if (submitted) key = "submitted";
  else key = hasProfile ? "tip" : "create";

  return (
    <Link
      to="/match/$id"
      params={{ id: match.id }}
      className="glass-card group relative block overflow-hidden rounded-3xl px-4 pb-3 pt-4 transition active:scale-[0.99]"
    >
      {/* top gold accent line + glow */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <span className="pointer-events-none absolute -top-12 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-primary/15 blur-2xl" />
      {isLive && (
        <span className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[oklch(0.7_0.2_25)]" />
      )}

      {/* teams */}
      <div className="relative flex items-center justify-center gap-3">
        <Team flag={<BosniaRoundFlag size="lg" />} name="BiH" />
        <span className="shrink-0 font-display text-base text-primary/90">VS</span>
        <Team
          flag={
            configured && opp?.code ? (
              <RoundFlag code={opp.code} size="lg" alt={opponentLabel} />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-lg ring-1 ring-foreground/15">
                ⏳
              </span>
            )
          }
          name={opponentLabel}
        />
      </div>

      {hasFinal && (
        <div className="mt-2 text-center font-display text-3xl leading-none text-primary">
          {match.bih_final_score} : {match.opponent_final_score}
        </div>
      )}

      {/* info bar: kickoff + status */}
      <div className="mt-3 flex items-center justify-between gap-2 rounded-2xl bg-[oklch(0.14_0.09_266_/_70%)] px-3 py-2">
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-xs font-bold text-foreground/90">
            <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{formatSarajevo(match.kickoff_time)}</span>
          </span>
          <span className="mt-0.5 block pl-5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {t("common.sarajevoTime")}
            {localLine ? ` · ${t("common.localTime")}: ${localLine}` : ""}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${chipStyles[key]}`}
          >
            {t(chipLabelKey[key])}
          </span>
          {configured && !canPredict && phase !== "finished" && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-ice/70">
              {t("status.predictionClosed")}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}
