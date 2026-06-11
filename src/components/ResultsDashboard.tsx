import type { Match, Submission } from "@/lib/queries";
import {
  averagePuls,
  predictionDistribution,
  pulsByCountry,
  topCities,
} from "@/lib/stats";
import { pulsLabel } from "@/lib/puls";
import { countryByName, countryDisplayName } from "@/lib/data/countries";
import { RoundFlag } from "@/components/RoundFlag";
import { useI18n } from "@/lib/i18n";

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

/** Horizontal snap carousel with paging dots. */
function Swiper({ count, children }: { count: number; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "0px" }}
      >
        {children}
      </div>
      {count > 1 && (
        <div className="mt-1 flex justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/25" />
          ))}
        </div>
      )}
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
  const { t, locale } = useI18n();
  const total = submissions.length;
  const votesWord = (n: number) =>
    n === 1 ? t("results.voteOne") : t("results.voteMany");

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
        {t("results.noVotes")}
      </div>
    );
  }

  const avg = averagePuls(submissions);
  const byCountry = pulsByCountry(submissions, 5);
  const cities = topCities(submissions, 10);
  const dist = predictionDistribution(submissions);

  // city slides of 3 (1-3, 4-6, 7-10)
  const citySlides: typeof cities[] = [];
  for (let i = 0; i < cities.length; i += 3) citySlides.push(cities.slice(i, i + 3));

  return (
    <div className="flex flex-col gap-4">
      <Section title={t("results.globalPuls")}>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-display text-6xl leading-none text-primary">
              {avg}
              <span className="text-2xl text-foreground/70">/100</span>
            </div>
            <div className="mt-1 font-display text-lg uppercase italic text-foreground">
              {pulsLabel(avg, locale)}
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {total} {votesWord(total)}
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

      <Section title={t("results.byCountry")}>
        <Swiper count={byCountry.length}>
          {byCountry.map((c, i) => {
            const country = countryByName(c.name);
            const display = countryDisplayName(c.name, locale);
            return (
              <div
                key={c.name}
                className="flex min-w-full snap-center flex-col items-center gap-1 rounded-2xl bg-[oklch(0.16_0.1_266)] p-5 text-center"
              >
                <div className="text-xs font-bold uppercase tracking-wide text-ice">
                  #{i + 1}
                </div>
                <RoundFlag
                  code={country?.code}
                  emoji="🌍"
                  size="lg"
                  alt={display}
                />
                <div className="font-display text-2xl uppercase text-foreground">
                  {display}
                </div>
                <div className="font-display text-5xl leading-none text-primary">
                  {c.avg}
                  <span className="text-xl text-foreground/70">/100</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {c.count} {votesWord(c.count)}
                </div>
              </div>
            );
          })}
        </Swiper>
      </Section>

      <Section title={t("results.topCities")}>
        <Swiper count={citySlides.length}>
          {citySlides.map((slide, si) => (
            <div key={si} className="min-w-full snap-center">
              <div className="flex flex-col gap-2">
                {slide.map((c, idx) => {
                  const rank = si * 3 + idx + 1;
                  const country = countryByName(c.country);
                  const countryLabel = countryDisplayName(c.country, locale);
                  return (
                    <div
                      key={`${c.city}-${rank}`}
                      className="flex items-center gap-3 rounded-xl bg-[oklch(0.16_0.1_266)] px-3 py-2.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-base text-primary">
                        {rank}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-foreground">
                          {c.city}
                        </span>
                        <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                          <RoundFlag
                            code={country?.code}
                            emoji="🌍"
                            size="xs"
                            alt={countryLabel}
                          />
                          {countryLabel}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="font-display text-lg text-primary">
                          {c.count}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          {votesWord(c.count)}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Swiper>
      </Section>

      <Section title={t("results.distribution")}>
        <Bar
          label={t("results.bihWin")}
          value={`${dist.bihPct}%`}
          sub={`· ${dist.bih}`}
          pct={dist.bihPct}
        />
        <Bar
          label={t("results.draw")}
          value={`${dist.drawPct}%`}
          sub={`· ${dist.draw}`}
          pct={dist.drawPct}
          color="var(--ice)"
        />
        <Bar
          label={`${t("results.oppWin")} · ${countryDisplayName(match.opponent_name, locale)}`}
          value={`${dist.opponentPct}%`}
          sub={`· ${dist.opponent}`}
          pct={dist.opponentPct}
          color="var(--royal-light)"
        />
      </Section>
    </div>
  );
}
