import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, BarChart3, Lock } from "lucide-react";
import {
  matchesQuery,
  createSubmission,
  getMatchAvailability,
  type Match,
} from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { Scoreboard } from "@/components/Scoreboard";
import { PulsSlider } from "@/components/PulsSlider";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { BosniaRoundFlag, RoundFlag } from "@/components/RoundFlag";
import { COUNTRIES, countryByName, countryDisplayName } from "@/lib/data/countries";
import { pulsLabel } from "@/lib/puls";
import { normalizeCity } from "@/lib/normalize";
import { formatSarajevo } from "@/lib/format";
import {
  getSubmittedId,
  setSubmittedId,
  setUserProfile,
  useSubmittedMatches,
  useUserProfile,
} from "@/lib/device";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/start")({
  head: () => ({ meta: [{ title: "Kreiraj Puls Card · Puls Zmajeva" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(matchesQuery()),
  component: StartPage,
});

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const s = i + 1;
        return (
          <span
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-primary" : "w-2 bg-foreground/30"
            }`}
          />
        );
      })}
    </div>
  );
}

interface MatchEntry {
  bih: number;
  opp: number;
  include: boolean;
}

function StartPage() {
  const { data: matches } = useSuspenseQuery(matchesQuery());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profile = useUserProfile();
  const submitted = useSubmittedMatches();
  const { t, locale } = useI18n();

  // First-time flow only — returning users already have a card.
  useEffect(() => {
    if (profile) navigate({ to: "/", replace: true });
  }, [profile, navigate]);

  // Matches that are open right now and not yet submitted on this device.
  const available = useMemo<Match[]>(
    () =>
      matches.filter(
        (m) => getMatchAvailability(m).canPredict && !getSubmittedId(m.id),
      ),
    [matches, submitted],
  );

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [city, setCity] = useState("");
  const [puls, setPuls] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [entries, setEntries] = useState<Record<string, MatchEntry>>({});

  const country = countryByName(countryName);
  const storedLabel = pulsLabel(puls);
  const label = pulsLabel(puls, locale);

  const entryFor = (id: string): MatchEntry =>
    entries[id] ?? { bih: 1, opp: 0, include: true };

  const updateEntry = (id: string, patch: Partial<MatchEntry>) =>
    setEntries((prev) => ({ ...prev, [id]: { ...entryFor(id), ...patch } }));

  const includedCount = available.filter((m) => entryFor(m.id).include).length;
  const canNext1 = name.trim().length >= 2 && !!countryName && city.trim().length >= 1;

  const handleSubmitAll = async () => {
    const included = available.filter((m) => entryFor(m.id).include);
    if (included.length === 0 || submitting) return;
    setSubmitting(true);

    const identity = {
      name: name.trim(),
      country: countryName,
      city_display: city.trim(),
      city_normalized: normalizeCity(city),
    };

    try {
      const created = [];
      for (const m of included) {
        const e = entryFor(m.id);
        const sub = await createSubmission({
          match_id: m.id,
          name: identity.name,
          country: identity.country,
          city_display: identity.city_display,
          city_normalized: identity.city_normalized,
          bih_score: e.bih,
          opponent_score: e.opp,
          puls_value: puls,
          puls_label: storedLabel,
        });
        created.push(sub);
        setSubmittedId(m.id, sub.id);
      }

      // First created submission becomes the shareable card.
      const cardId = created[0].id;
      setUserProfile({
        name: identity.name,
        country: identity.country,
        city_display: identity.city_display,
        city_normalized: identity.city_normalized,
        puls_value: puls,
        puls_label: storedLabel,
        cardSubmissionId: cardId,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["matches"] }),
        ...included.map((m) =>
          queryClient.invalidateQueries({ queryKey: ["submissions", m.id] }),
        ),
      ]);

      navigate({ to: "/card/$submissionId", params: { submissionId: cardId } });
    } catch {
      toast.error(t("create.toastError"));
      setSubmitting(false);
    }
  };

  // No open matches to predict.
  if (available.length === 0) {
    return (
      <AppShell>
        <BrandHeader />
        <main className="flex flex-col gap-5 px-5 pb-16 pt-8">
          <h2 className="text-center font-display text-2xl uppercase tracking-wide text-primary">
            {t("start.title")}
          </h2>
          <p className="rounded-xl bg-[oklch(0.16_0.1_266)] px-4 py-4 text-center text-ice">
            {t("start.noOpenMatches")}
          </p>
          <Link
            to="/leaderboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary/50 bg-primary/10 px-6 py-3 font-display text-sm uppercase tracking-wide text-primary"
          >
            <BarChart3 className="h-5 w-5" /> {t("common.viewResults")}
          </Link>
          <Link to="/" className="text-center text-sm font-bold text-ice underline">
            {t("create.backHome")}
          </Link>
        </main>
      </AppShell>
    );
  }

  const goBack = () => {
    if (step === 1) navigate({ to: "/" });
    else setStep(step - 1);
  };

  return (
    <AppShell>
      <BrandHeader />
      <main className="flex flex-col gap-5 px-5 pb-16 pt-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm font-bold text-ice"
        >
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </button>
        <StepDots step={step} total={3} />

        {step === 1 && (
          <section className="animate-rise flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              {t("create.whoAreYou")}
            </h2>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                {t("create.nameLabel")}
              </span>
              <input
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("create.namePlaceholder")}
                className="h-12 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                {t("create.countryLabel")}
              </span>
              <select
                value={countryName}
                onChange={(e) => {
                  setCountryName(e.target.value);
                  setCity("");
                }}
                className="h-12 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t("create.countryPlaceholder")}</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {locale === "en" ? c.nameEn : c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                {t("create.cityLabel")}
              </span>
              <CityAutocomplete
                countryCode={country?.code ?? null}
                value={city}
                onChange={setCity}
              />
            </label>
            <button
              disabled={!canNext1}
              onClick={() => setStep(2)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary-foreground gold-glow disabled:opacity-40"
            >
              {t("common.next")} <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              {t("create.yourPulse")}
            </h2>
            <div className="glass-card rounded-2xl p-5">
              <div className="mb-5 text-center">
                <div className="font-display text-6xl leading-none text-primary">
                  {puls}
                  <span className="text-2xl text-foreground/70">/100</span>
                </div>
                <div className="mt-1 font-display text-lg uppercase italic text-foreground">
                  {label}
                </div>
              </div>
              <PulsSlider value={puls} onChange={setPuls} />
              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="text-sm text-foreground/70">
                  {t("create.enterNumber")}
                </span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={puls}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isNaN(n)) setPuls(Math.max(1, Math.min(100, n)));
                  }}
                  className="h-11 w-20 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] text-center font-display text-xl text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary-foreground gold-glow"
            >
              {t("common.next")} <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-rise flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              {t("start.matchesTitle")}
            </h2>
            <p className="text-sm text-foreground/80">{t("start.subtitle")}</p>

            {available.map((m) => {
              const opp = countryByName(m.opponent_name);
              const opponentLabel = countryDisplayName(m.opponent_name, locale);
              const e = entryFor(m.id);
              return (
                <div key={m.id} className="glass-card flex flex-col gap-3 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 font-display text-xl">
                      <BosniaRoundFlag size="sm" />
                      <span className="text-foreground">BiH</span>
                      <span className="text-sm text-muted-foreground">VS</span>
                      <RoundFlag code={opp?.code} size="sm" alt={opponentLabel} />
                      <span className="truncate text-foreground">{opponentLabel}</span>
                    </div>
                    <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ice">
                      <input
                        type="checkbox"
                        checked={e.include}
                        onChange={(ev) => updateEntry(m.id, { include: ev.target.checked })}
                        className="h-4 w-4 accent-[var(--gold)]"
                      />
                    </label>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {formatSarajevo(m.kickoff_time)} · {t("common.sarajevoTime")}
                  </div>
                  {e.include ? (
                    <Scoreboard
                      opponentName={opponentLabel}
                      opponentCode={opp?.code}
                      bihScore={e.bih}
                      opponentScore={e.opp}
                      onChange={(side, v) =>
                        updateEntry(m.id, side === "bih" ? { bih: v } : { opp: v })
                      }
                    />
                  ) : (
                    <p className="flex items-center gap-1.5 rounded-xl bg-[oklch(0.16_0.1_266)] px-3 py-2 text-xs text-muted-foreground">
                      <Lock className="h-3.5 w-3.5" /> {t("start.selectHint")}
                    </p>
                  )}
                </div>
              );
            })}

            <button
              disabled={submitting || includedCount === 0}
              onClick={handleSubmitAll}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow disabled:opacity-50"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
              {submitting ? t("start.submitting") : t("start.submitAll")}
            </button>
          </section>
        )}
      </main>
    </AppShell>
  );
}
