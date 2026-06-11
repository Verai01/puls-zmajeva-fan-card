import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { submissionQuery, matchQuery } from "@/lib/queries";
import { useSubmittedMatches } from "@/lib/device";
import { countryByName, countryDisplayName, flagUrl } from "@/lib/data/countries";
import { localFlagUrl } from "@/components/RoundFlag";
import { pulsLabel } from "@/lib/puls";
import type { PulsCardData } from "@/components/PulsCard";
import type { Locale } from "@/lib/i18n";

export interface UserCard {
  submissionId: string;
  matchId: string;
  kickoff: number;
  data: PulsCardData;
}

/**
 * Builds the list of the user's own BiH Puls Cards from the submissions tracked
 * in localStorage (one per predicted match), ordered by kickoff. Used by the
 * swipeable card carousel on the landing hero and the card page.
 */
export function useUserCards(locale: Locale): { cards: UserCard[]; isLoading: boolean } {
  const submitted = useSubmittedMatches();

  const entries = useMemo(
    () => Object.entries(submitted).map(([matchId, submissionId]) => ({ matchId, submissionId })),
    [submitted],
  );

  const submissionResults = useQueries({
    queries: entries.map((e) => submissionQuery(e.submissionId)),
  });
  const matchResults = useQueries({
    queries: entries.map((e) => matchQuery(e.matchId)),
  });

  const cards = useMemo<UserCard[]>(() => {
    const out: UserCard[] = [];
    entries.forEach((e, i) => {
      const sub = submissionResults[i]?.data;
      const match = matchResults[i]?.data;
      if (!sub || !match) return;
      const country = countryByName(sub.country);
      out.push({
        submissionId: e.submissionId,
        matchId: e.matchId,
        kickoff: new Date(match.kickoff_time).getTime(),
        data: {
          name: sub.name,
          cityDisplay: sub.city_display,
          countryFlag: country?.flag ?? "🌍",
          countryFlagUrl: localFlagUrl(country?.code) ?? flagUrl(country?.code),
          countryName: countryDisplayName(sub.country, locale),
          opponentName: countryDisplayName(match.opponent_name, locale),
          bihScore: sub.bih_score,
          opponentScore: sub.opponent_score,
          pulsValue: sub.puls_value,
          pulsLabel: pulsLabel(sub.puls_value, locale),
        },
      });
    });
    out.sort((a, b) => a.kickoff - b.kickoff);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, submissionResults.map((r) => r.dataUpdatedAt).join(","), matchResults.map((r) => r.dataUpdatedAt).join(","), locale]);

  const isLoading =
    submissionResults.some((r) => r.isLoading) || matchResults.some((r) => r.isLoading);

  return { cards, isLoading };
}
