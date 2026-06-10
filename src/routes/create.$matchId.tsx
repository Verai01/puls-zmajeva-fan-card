import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { matchQuery, effectiveStatus, createSubmission } from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { Scoreboard } from "@/components/Scoreboard";
import { PulsSlider } from "@/components/PulsSlider";
import { CityAutocomplete } from "@/components/CityAutocomplete";
import { COUNTRIES, countryByName } from "@/lib/data/countries";
import { pulsLabel } from "@/lib/puls";
import { normalizeCity } from "@/lib/normalize";
import { hasSubmitted, getSubmittedId, setSubmittedId } from "@/lib/device";
import { VOTING_CLOSED_MESSAGE } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/create/$matchId")({
  head: () => ({ meta: [{ title: "Kreiraj Puls Card · Puls Zmajeva" }] }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(matchQuery(params.matchId)),
  component: CreatePage,
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

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`h-2 rounded-full transition-all ${
            s === step ? "w-8 bg-primary" : "w-2 bg-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function CreatePage() {
  const { matchId } = Route.useParams();
  const { data: match } = useSuspenseQuery(matchQuery(matchId));
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [city, setCity] = useState("");
  const [bih, setBih] = useState(1);
  const [opp, setOpp] = useState(0);
  const [puls, setPuls] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  const country = countryByName(countryName);
  const label = pulsLabel(puls);
  const votingOpen = effectiveStatus(match) === "open";
  const alreadyId = useMemo(() => getSubmittedId(matchId), [matchId]);

  if (!votingOpen) {
    return (
      <AppShell>
        <BrandHeader />
        <div className="p-6 text-center">
          <p className="rounded-xl bg-[oklch(0.16_0.1_266)] px-4 py-4 text-ice">
            {VOTING_CLOSED_MESSAGE}
          </p>
          <Link
            to="/match/$id"
            params={{ id: matchId }}
            className="mt-4 inline-block font-bold text-primary underline"
          >
            Pogledaj rezultate
          </Link>
        </div>
      </AppShell>
    );
  }

  if (alreadyId) {
    return (
      <AppShell>
        <BrandHeader />
        <div className="p-6 text-center">
          <p className="text-foreground">Već si poslao svoj puls za ovu utakmicu. 🐉</p>
          <Link
            to="/card/$submissionId"
            params={{ submissionId: alreadyId }}
            className="mt-4 inline-block font-bold text-primary underline"
          >
            Pogledaj svoju Puls Card
          </Link>
        </div>
      </AppShell>
    );
  }

  const canNext1 = name.trim().length >= 2 && !!countryName && city.trim().length >= 1;

  const handleSubmit = async () => {
    if (hasSubmitted(matchId)) return;
    setSubmitting(true);
    try {
      const sub = await createSubmission({
        match_id: matchId,
        name: name.trim(),
        country: countryName,
        city_display: city.trim(),
        city_normalized: normalizeCity(city),
        bih_score: bih,
        opponent_score: opp,
        puls_value: puls,
        puls_label: label,
      });
      setSubmittedId(matchId, sub.id);
      navigate({ to: "/card/$submissionId", params: { submissionId: sub.id } });
    } catch (e) {
      toast.error("Greška pri slanju. Pokušaj ponovo.");
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <BrandHeader />
      <main className="flex flex-col gap-5 px-5 pb-16 pt-4">
        <button
          onClick={() => (step === 1 ? navigate({ to: "/" }) : setStep(step - 1))}
          className="flex items-center gap-1 text-sm font-bold text-ice"
        >
          <ArrowLeft className="h-4 w-4" /> Nazad
        </button>
        <StepDots step={step} />

        {step === 1 && (
          <section className="animate-rise flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              Ko si i odakle navijaš?
            </h2>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                Ime / nadimak
              </span>
              <input
                value={name}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                placeholder="npr. Amir"
                className="h-12 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] px-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                Država
              </span>
              <select
                value={countryName}
                onChange={(e) => {
                  setCountryName(e.target.value);
                  setCity("");
                }}
                className="h-12 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Izaberi državu…</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/70">
                Grad
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
              Dalje <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-rise flex flex-col gap-4">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              Tipuj rezultat
            </h2>
            <Scoreboard
              opponentName={match.opponent_name}
              bihScore={bih}
              opponentScore={opp}
              onChange={(side, v) => (side === "bih" ? setBih(v) : setOpp(v))}
            />
            <button
              onClick={() => setStep(3)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary-foreground gold-glow"
            >
              Dalje <ArrowRight className="h-5 w-5" strokeWidth={3} />
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-rise flex flex-col gap-5">
            <h2 className="font-display text-2xl uppercase tracking-wide text-primary">
              Kakav ti je puls?
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
                <span className="text-sm text-foreground/70">Unesi broj:</span>
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
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow disabled:opacity-50"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
              {submitting ? "Šaljem…" : "Napravi Puls Card"}
            </button>
          </section>
        )}
      </main>
    </AppShell>
  );
}
