import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Trophy } from "lucide-react";
import { matchesQuery, submissionsQuery } from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { buildLeaderboard } from "@/lib/stats";
import { countryByName } from "@/lib/data/countries";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Tabela Zmajeva · Puls Zmajeva" },
      { name: "description", content: "Najbolji tipovi navijača BiH." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(matchesQuery()),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { data: matches } = useSuspenseQuery(matchesQuery());
  const finished = matches.filter((m) => m.status === "finished");
  const [selected, setSelected] = useState(finished[0]?.id ?? "");

  return (
    <AppShell>
      <BrandHeader />
      <main className="flex flex-col gap-5 px-5 pb-16 pt-4">
        <Link to="/" className="flex items-center gap-1 text-sm font-bold text-ice">
          <ArrowLeft className="h-4 w-4" /> Početna
        </Link>
        <h1 className="text-center font-display text-4xl uppercase tracking-wide text-primary">
          🏆 Tabela Zmajeva
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Tačan rezultat = 3 boda · Pogođen ishod = 1 bod · Promašaj = 0
        </p>

        {finished.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
            Tabela se računa nakon što se unesu konačni rezultati utakmica.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {finished.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelected(m.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    selected === m.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/80"
                  }`}
                >
                  BiH–{m.opponent_name} {m.bih_final_score}:{m.opponent_final_score}
                </button>
              ))}
            </div>
            {selected && <Board matchId={selected} />}
          </>
        )}
      </main>
    </AppShell>
  );
}

function Board({ matchId }: { matchId: string }) {
  const { data: matches } = useSuspenseQuery(matchesQuery());
  const { data: subs } = useSuspenseQuery(submissionsQuery(matchId));
  const match = matches.find((m) => m.id === matchId)!;
  const board = buildLeaderboard(match, subs) ?? [];

  if (board.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
        Nema tipova za ovu utakmicu.
      </div>
    );
  }

  const top3 = board.slice(0, 3);
  const rest = board.slice(3, 10);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {top3.map((e, i) => (
          <div
            key={e.id}
            className={`glass-card flex flex-col items-center gap-1 rounded-2xl p-3 text-center ${
              i === 0 ? "ring-2 ring-primary gold-glow" : ""
            }`}
          >
            <span className="text-3xl">{medals[i]}</span>
            <span className="max-w-full truncate font-display text-base uppercase text-foreground">
              {e.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {countryByName(e.country)?.flag} {e.bih_score}:{e.opponent_score}
            </span>
            <span className="font-display text-2xl text-primary">{e.points}</span>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="glass-card overflow-hidden rounded-2xl">
          {rest.map((e, i) => (
            <div
              key={e.id}
              className="flex items-center justify-between border-b border-border/50 px-4 py-3 last:border-0"
            >
              <span className="flex items-center gap-3">
                <span className="w-5 text-center font-display text-base text-foreground/60">
                  {i + 4}
                </span>
                <span className="font-semibold text-foreground">{e.name}</span>
                <span className="text-xs text-muted-foreground">
                  {countryByName(e.country)?.flag} {e.bih_score}:{e.opponent_score}
                </span>
              </span>
              <span className="flex items-center gap-1 font-display text-lg text-primary">
                <Trophy className="h-4 w-4" /> {e.points}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
