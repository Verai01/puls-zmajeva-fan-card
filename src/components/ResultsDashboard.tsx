import type { Match, Submission } from "@/lib/queries";
import {
  averagePuls,
  predictionDistribution,
  pulsByCountry,
  topCities,
} from "@/lib/stats";
import { pulsLabel } from "@/lib/puls";
import { countryByName } from "@/lib/data/countries";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card animate-rise rounded-2xl p-4">
      <h3 className="mb-3 font-display text-lg uppercase tracking-wide text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Bar({
  label,
  value,
  pct,
  sub,
  color = "var(--gold)",
}: {
  label: string;
  value: string;
  pct: number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="truncate font-semibold text-foreground">{label}</span>
        <span className="shrink-0 font-display text-base text-foreground">
          {value}
          {sub && <span className="ml-1 text-xs text-muted-foreground">{sub}</span>}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.1_266)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(3, pct)}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function ResultsDashboard({
  match,
  submissions,
}: {
  match: Match;
  submissions: Submission[];
}) {
  const total = submissions.length;

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
        Još nema pulseva za ovu utakmicu. Budi prvi! 🐉
      </div>
    );
  }

  const avg = averagePuls(submissions);
  const byCountry = pulsByCountry(submissions).slice(0, 6);
  const cities = topCities(submissions, 5);
  const dist = predictionDistribution(submissions);

  return (
    <div className="flex flex-col gap-4">
      <Section title="Globalni Puls Zmajeva">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display text-6xl leading-none text-primary">
              {avg}
              <span className="text-2xl text-foreground/70">/100</span>
            </div>
            <div className="mt-1 font-display text-lg uppercase italic text-foreground">
              {pulsLabel(avg)}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {total} {total === 1 ? "puls" : "pulseva"}
          </div>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[oklch(0.16_0.1_266)]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${avg}%`,
              background:
                "linear-gradient(90deg, oklch(0.55 0.16 256), oklch(0.84 0.17 90))",
            }}
          />
        </div>
      </Section>

      <Section title="Puls po državama">
        {byCountry.map((c) => {
          const country = countryByName(c.key);
          return (
            <Bar
              key={c.key}
              label={`${country?.flag ?? "🌍"} ${c.key}`}
              value={String(c.avg)}
              sub={`· ${c.count}`}
              pct={c.avg}
            />
          );
        })}
      </Section>

      <Section title="Top gradovi">
        {cities.map((c, i) => (
          <Bar
            key={c.key}
            label={`${i + 1}. ${c.key}`}
            value={`${c.count}×`}
            sub={`puls ${c.avg}`}
            pct={(c.count / cities[0].count) * 100}
            color="var(--royal-light)"
          />
        ))}
      </Section>

      <Section title="Predikcija rezultata">
        <Bar
          label={`🇧🇦 Pobjeda BiH`}
          value={`${dist.bihPct}%`}
          sub={`· ${dist.bih}`}
          pct={dist.bihPct}
        />
        <Bar
          label="Neriješeno"
          value={`${dist.drawPct}%`}
          sub={`· ${dist.draw}`}
          pct={dist.drawPct}
          color="var(--ice)"
        />
        <Bar
          label={`Pobjeda · ${match.opponent_name}`}
          value={`${dist.opponentPct}%`}
          sub={`· ${dist.opponent}`}
          pct={dist.opponentPct}
          color="var(--royal-light)"
        />
      </Section>
    </div>
  );
}
