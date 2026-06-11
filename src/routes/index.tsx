import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, ArrowRight, ChevronDown } from "lucide-react";
import type { Match } from "@/lib/queries";
import {
  matchesQuery,
  submissionsQuery,
  getMatchAvailability,
  isOpponentConfigured,
} from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { PulsCard, type PulsCardData } from "@/components/PulsCard";
import { PulsCardCarousel } from "@/components/PulsCardCarousel";
import { MatchCard } from "@/components/MatchCard";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { localFlagUrl } from "@/components/RoundFlag";
import { useSubmittedMatches, useUserProfile } from "@/lib/device";
import { useUserCards } from "@/lib/useUserCards";
import { countryDisplayName } from "@/lib/data/countries";
import { pulsLabel } from "@/lib/puls";
import { useI18n, type TFn, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Puls Zmajeva — Kako dišu navijači BiH?" },
      {
        name: "description",
        content:
          "Tipuj rezultat, unesi svoj puls od 1 do 100 i napravi svoju BiH Puls Card za Instagram Story.",
      },
      { property: "og:title", content: "Puls Zmajeva — Kako dišu navijači BiH?" },
    ],
  }),
  loader: async ({ context }) => {
    const matches = await context.queryClient.ensureQueryData(matchesQuery());
    await Promise.all(
      matches
        .filter(isOpponentConfigured)
        .map((m) => context.queryClient.ensureQueryData(submissionsQuery(m.id))),
    );
  },
  component: Index,
});

function pickLiveMatch(
  matches: Match[],
  submitted: Record<string, string>,
): Match | undefined {
  const open = matches.filter((m) => getMatchAvailability(m).canPredict);
  const remaining = open.filter((m) => !submitted[m.id]);
  return remaining[0] ?? open[0] ?? matches.find((m) => isOpponentConfigured(m));
}

function HowItWorks({ t }: { t: TFn }) {
  const [open, setOpen] = useState(false);
  const steps: TKey[] = ["landing.step1", "landing.step2", "landing.step3"];
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mx-auto inline-flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wide text-ice"
      >
        {t("landing.howItWorks")}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
          strokeWidth={3}
        />
      </button>

      {open && (
        <div className="animate-rise mt-3 flex flex-col gap-2.5 text-left">
          {steps.map((key, i) => (
            <div
              key={key}
              className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary font-display text-base text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-foreground/90">{t(key)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Index() {
  const { data: matches } = useSuspenseQuery(matchesQuery());
  const navigate = useNavigate();
  const submitted = useSubmittedMatches();
  const profile = useUserProfile();
  const { t, locale } = useI18n();
  const { cards: userCards } = useUserCards(locale);

  const tippable = matches.filter((m) => getMatchAvailability(m).canPredict);
  const remaining = tippable.filter((m) => !submitted[m.id]);
  const hasProfile = !!profile;

  const liveMatch = pickLiveMatch(matches, submitted);
  const submissionsMatchId =
    liveMatch?.id ??
    matches.find(isOpponentConfigured)?.id ??
    matches[0]?.id ??
    "";
  const { data: liveSubmissions } = useSuspenseQuery(
    submissionsQuery(submissionsMatchId),
  );

  const scrollToLiveResults = () => {
    document.getElementById("live-results")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrimaryCta = () => {
    if (!hasProfile) {
      navigate({ to: "/start" });
      return;
    }
    if (remaining.length === 0) {
      scrollToLiveResults();
      return;
    }
    const target = remaining[0];
    if (target) navigate({ to: "/match/$id", params: { id: target.id } });
  };

  let ctaLabel = t("landing.ctaCreate");
  if (hasProfile && remaining.length > 0) ctaLabel = t("landing.ctaContinue");
  if (hasProfile && remaining.length === 0) ctaLabel = t("landing.ctaViewResults");

  const showUserCards = hasProfile && userCards.length > 0;

  const sampleCard: PulsCardData = {
    name: "AMIR",
    cityDisplay: "Malmö",
    countryFlag: "🇸🇪",
    countryFlagUrl: localFlagUrl("SE"),
    countryName: countryDisplayName("Švedska", locale),
    opponentName: countryDisplayName("Švicarska", locale),
    bihScore: 2,
    opponentScore: 1,
    pulsValue: 88,
    pulsLabel: pulsLabel(88, locale),
  };

  return (
    <AppShell>
      <BrandHeader />

      <main className="flex flex-col gap-8 px-5 pb-16 pt-7">
        {/* Hero */}
        <section className="text-center">
          <h1 className="font-display text-6xl leading-[0.9] text-foreground text-stroke-royal">
            PULS
            <br />
            <span className="text-primary">ZMAJEVA</span>
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-ice">
            {t("landing.tagline")}
          </p>
          <p className="mx-auto mt-4 max-w-xs text-base text-foreground/85">
            {t("landing.heroLead")}{" "}
            <span className="font-bold text-primary">{t("landing.heroLeadStrong")}</span>
          </p>

          <button
            onClick={handlePrimaryCta}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow active:scale-[0.98]"
          >
            {ctaLabel}
            <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </button>

          {hasProfile && remaining.length > 0 && (
            <p className="mt-2 text-sm font-semibold text-ice">
              {t("landing.continueHint")}
            </p>
          )}

          <HowItWorks t={t} />
        </section>

        {/* Puls Card showpiece with handwritten side notes */}
        <section className="relative -mx-5 mt-2 px-5">
          {/* radial glow behind the card */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />

          <div className="pointer-events-none absolute left-1.5 top-4 z-20 max-w-[82px] -rotate-6 text-left">
            <p className="whitespace-pre-line font-hand text-xl font-bold leading-[0.95] text-ice drop-shadow">
              {t("landing.annLeft")}
            </p>
            <svg viewBox="0 0 60 30" className="mt-1 h-5 w-12 text-ice/80">
              <path d="M2 4 C 20 2, 40 14, 56 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M56 24 L 47 22 M56 24 L 52 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-1.5 z-20 max-w-[84px] rotate-6 text-right">
            <p className="whitespace-pre-line font-hand text-xl font-bold leading-[0.95] text-primary drop-shadow">
              {t("landing.annRight")}
            </p>
            <svg viewBox="0 0 60 30" className="ml-auto mt-1 h-5 w-12 text-primary/80">
              <path d="M58 4 C 40 2, 20 14, 4 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M4 24 L 13 22 M4 24 L 8 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="relative mx-auto w-full max-w-[260px]">
            {showUserCards ? (
              <PulsCardCarousel
                cards={userCards.map((c) => c.data)}
                tilt
                cardMaxWidthClass="max-w-[200px]"
              />
            ) : (
              <div className="flex justify-center px-2 py-3">
                <div className="w-full max-w-[200px] rotate-[-4deg] drop-shadow-[0_18px_40px_oklch(0_0_0_/_55%)]">
                  <PulsCard data={sampleCard} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Matches */}
        <section id="matches" className="scroll-mt-20">
          <h2 className="mb-3 text-center font-display text-2xl uppercase tracking-wide text-primary">
            {t("landing.sectionActual")}
          </h2>
          <div className="flex flex-col gap-3">
            {matches.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                submitted={!!submitted[m.id]}
                hasProfile={hasProfile}
              />
            ))}
          </div>
        </section>

        {/* Live results for next open match */}
        {liveMatch && (
          <section id="live-results" className="flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              {t("landing.liveResults")}
            </h2>
            <p className="text-sm text-muted-foreground">
              BiH vs {countryDisplayName(liveMatch.opponent_name, locale)}
            </p>
            <ResultsDashboard match={liveMatch} submissions={liveSubmissions} />
          </section>
        )}

        {/* Instagram */}
        <a
          href="https://instagram.com/pulszmajeva"
          target="_blank"
          rel="noreferrer noopener"
          className="glass-card flex items-center justify-between rounded-2xl px-4 py-4"
        >
          <span className="flex items-center gap-3 font-bold uppercase tracking-wide text-foreground">
            <Instagram className="h-5 w-5 text-primary" />
            {t("landing.instagram")}
          </span>
          <ArrowRight className="h-5 w-5 text-primary" />
        </a>
      </main>
    </AppShell>
  );
}
