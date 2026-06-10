import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Instagram, ArrowRight, BarChart3 } from "lucide-react";
import { matchesQuery, effectiveStatus } from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader, BosniaFlag } from "@/components/BrandHeader";
import { PulsCard } from "@/components/PulsCard";
import { MatchCard } from "@/components/MatchCard";

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
  loader: ({ context }) => context.queryClient.ensureQueryData(matchesQuery()),
  component: Index,
});

function Index() {
  const { data: matches } = useSuspenseQuery(matchesQuery());
  const navigate = useNavigate();
  const firstOpen = matches.find((m) => effectiveStatus(m) === "open");

  const handleCreate = () => {
    const target = firstOpen ?? matches[0];
    if (target) navigate({ to: "/create/$matchId", params: { matchId: target.id } });
  };

  return (
    <AppShell>
      <BrandHeader />

      <main className="flex flex-col gap-8 px-5 pb-16 pt-6">
        {/* Hero */}
        <section className="text-center">
          <BosniaFlag className="text-3xl" />
          <h1 className="mt-2 font-display text-6xl leading-[0.9] text-foreground text-stroke-royal">
            PULS<br />
            <span className="text-primary">ZMAJEVA</span>
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-ice">
            ━ Kako dišu navijači BiH? ━
          </p>
          <p className="mx-auto mt-4 max-w-xs text-base text-foreground/85">
            Unesi svoj puls, tipuj rezultat i budi dio najveće navijačke zajednice{" "}
            <span className="font-bold text-primary">na svijetu.</span>
          </p>

          <button
            onClick={handleCreate}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow active:scale-[0.98]"
          >
            Kreiraj svoju BiH Puls Card
            <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </button>

          <Link
            to="/leaderboard"
            className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-ice underline underline-offset-4"
          >
            <BarChart3 className="h-4 w-4" /> Pogledaj rezultate
          </Link>
        </section>

        {/* Sample card */}
        <section className="mx-auto w-full max-w-[260px]">
          <PulsCard
            data={{
              name: "AMIR",
              cityDisplay: "Malmö",
              countryFlag: "🇸🇪",
              countryName: "Švedska",
              opponentName: "Švicarska",
              bihScore: 2,
              opponentScore: 1,
              pulsValue: 88,
              pulsLabel: "Već slavimo",
            }}
          />
        </section>

        {/* Matches */}
        <section>
          <h2 className="mb-3 text-center font-display text-2xl uppercase tracking-wide text-primary">
            ★ Aktuelno ★
          </h2>
          <div className="flex flex-col gap-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>

        {/* Instagram */}
        <a
          href="https://instagram.com/pulszmajeva"
          target="_blank"
          rel="noreferrer noopener"
          className="glass-card flex items-center justify-between rounded-2xl px-4 py-4"
        >
          <span className="flex items-center gap-3 font-bold uppercase tracking-wide text-foreground">
            <Instagram className="h-5 w-5 text-primary" />
            Prati nas na Instagramu
          </span>
          <ArrowRight className="h-5 w-5 text-primary" />
        </a>
      </main>
    </AppShell>
  );
}
