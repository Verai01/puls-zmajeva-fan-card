import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, PlusCircle, IdCard, BarChart3 } from "lucide-react";
import {
  matchQuery,
  submissionsQuery,
  effectiveStatus,
  isOpponentConfigured,
} from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { CircularBosniaFlag, CircularFlag } from "@/components/CircularFlag";
import { countryByName } from "@/lib/data/countries";
import {
  formatSarajevo,
  formatLocalTimeLine,
  statusLabel,
  VOTING_CLOSED_MESSAGE,
} from "@/lib/format";
import { useSubmittedId, useUserProfile } from "@/lib/device";

export const Route = createFileRoute("/match/$id")({
  head: () => ({
    meta: [
      { title: "Utakmica · Puls Zmajeva" },
      { name: "description", content: "Live rezultati i puls navijača BiH." },
    ],
  }),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(matchQuery(params.id)),
      context.queryClient.ensureQueryData(submissionsQuery(params.id)),
    ]);
  },
  component: MatchPage,
  errorComponent: () => (
    <AppShell>
      <BrandHeader />
      <div className="p-6 text-center text-foreground">
        Utakmica nije pronađena.{" "}
        <Link to="/" className="text-primary underline">
          Nazad
        </Link>
      </div>
    </AppShell>
  ),
});

function MatchPage() {
  const { id } = Route.useParams();
  const { data: match } = useSuspenseQuery(matchQuery(id));
  const { data: submissions } = useSuspenseQuery(submissionsQuery(id));
  const status = effectiveStatus(match);
  const configured = isOpponentConfigured(match);
  const opp = countryByName(match.opponent_name);
  const submissionId = useSubmittedId(id);
  const profile = useUserProfile();
  const cardId = profile?.cardSubmissionId ?? submissionId;
  const localLine = formatLocalTimeLine(match.local_time_label);

  return (
    <AppShell>
      <BrandHeader />
      <main className="flex flex-col gap-5 px-5 pb-16 pt-4">
        <Link to="/" className="flex items-center gap-1 text-sm font-bold text-ice">
          <ArrowLeft className="h-4 w-4" /> Sve utakmice
        </Link>

        <section className="glass-card rounded-2xl p-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 font-display text-3xl">
            <span className="flex items-center gap-2">
              <CircularBosniaFlag size="md" />
              BiH
            </span>
            <span className="text-muted-foreground">vs</span>
            {configured ? (
              <span className="flex items-center gap-2">
                <CircularFlag code={opp?.code} size="md" alt={match.opponent_name} />
                {match.opponent_name}
              </span>
            ) : (
              <span>⏳ Uskoro</span>
            )}
          </div>
          {status === "finished" ? (
            <div className="mt-2 font-display text-5xl text-primary">
              {match.bih_final_score} : {match.opponent_final_score}
            </div>
          ) : (
            <div className="mt-2">
              <div className="font-display text-lg text-foreground">
                {formatSarajevo(match.kickoff_time)}
              </div>
              <div className="text-xs text-muted-foreground">Sarajevo time</div>
              {localLine && (
                <div className="mt-0.5 text-[11px] text-muted-foreground/80">
                  {localLine}
                </div>
              )}
            </div>
          )}
          <div className="mt-3 inline-block rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            {configured ? statusLabel(status) : "Uskoro"}
          </div>

          {!configured ? (
            <p className="mt-4 rounded-xl bg-[oklch(0.16_0.1_266)] px-4 py-3 text-sm text-ice">
              Protivnik još nije potvrđen. Tipovanje će biti otvoreno uskoro.
            </p>
          ) : submissionId ? (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-ice">
                Već si tipovao ovu utakmicu
              </p>
              {cardId && (
                <Link
                  to="/card/$submissionId"
                  params={{ submissionId: cardId }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary-foreground gold-glow active:scale-[0.98]"
                >
                  <IdCard className="h-5 w-5" /> Pogledaj svoju BiH Puls Card
                </Link>
              )}
              <a
                href="#live-results"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary/50 bg-primary/10 px-6 py-3 font-display text-sm uppercase tracking-wide text-primary"
              >
                <BarChart3 className="h-5 w-5" /> Pogledaj rezultate
              </a>
            </div>
          ) : status === "open" ? (
            <Link
              to="/create/$matchId"
              params={{ matchId: match.id }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary-foreground gold-glow active:scale-[0.98]"
            >
              <PlusCircle className="h-5 w-5" />
              {profile ? "Tipuj utakmicu" : "Kreiraj svoju BiH Puls Card"}
            </Link>
          ) : (
            <p className="mt-4 rounded-xl bg-[oklch(0.16_0.1_266)] px-4 py-3 text-sm text-ice">
              {VOTING_CLOSED_MESSAGE}
            </p>
          )}
        </section>

        <h2
          id="live-results"
          className="font-display text-2xl uppercase tracking-wide text-primary"
        >
          Live rezultati
        </h2>
        <ResultsDashboard match={match} submissions={submissions} />

        {status === "finished" && (
          <Link
            to="/leaderboard"
            className="glass-card rounded-2xl p-4 text-center font-display text-lg uppercase tracking-wide text-primary"
          >
            🏆 Pogledaj Tabelu Zmajeva
          </Link>
        )}
      </main>
    </AppShell>
  );
}
