import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Locale = "bs" | "en";

export const LOCALE_STORAGE_KEY = "pulszmajeva_locale";
export const DEFAULT_LOCALE: Locale = "bs";
export const LOCALE_CHANGE_EVENT = "pulszmajeva:locale";

type Dict = Record<string, string>;

const bs: Dict = {
  // common
  "common.back": "Nazad",
  "common.home": "Početna",
  "common.next": "Dalje",
  "common.soon": "Uskoro",
  "common.allMatches": "Sve utakmice",
  "common.viewResults": "Pogledaj rezultate",
  "common.sarajevoTime": "Sarajevo vrijeme",
  "common.localTime": "Lokalno vrijeme",

  // landing
  "landing.tagline": "━ Kako dišu navijači BiH? ━",
  "landing.heroLead": "Unesi svoj puls, tipuj rezultat i budi dio najveće navijačke zajednice",
  "landing.heroLeadStrong": "na svijetu.",
  "landing.ctaCreate": "Kreiraj svoju BiH Puls Card",
  "landing.ctaContinue": "Nastavi tipovati",
  "landing.ctaViewResults": "Pogledaj rezultate",
  "landing.continueHint": "Tipuj preostale utakmice",
  "landing.annLeft": "Tvoj puls\ntvoja priča",
  "landing.annRight": "Podijeli i\npodrži Zmajeve!",
  "landing.sectionActual": "★ Aktuelno ★",
  "landing.liveResults": "Live rezultati",
  "landing.instagram": "Prati nas na Instagramu",
  "landing.samplePulsLabel": "Već slavimo",

  // match status / chips
  "status.create": "Kreiraj Puls Card",
  "status.tip": "Tipuj utakmicu",
  "status.submitted": "Već tipovano",
  "status.open": "Otvoreno za tipovanje",
  "status.live": "U toku",
  "status.finished": "Završeno",
  "status.upcoming": "Uskoro",
  "status.predictionClosed": "Tipp zatvoren",

  // match detail
  "match.alreadyPredicted": "Već si tipovao ovu utakmicu",
  "match.viewCard": "Pogledaj svoju BiH Puls Card",
  "match.opponentTbd": "Protivnik još nije potvrđen. Tipovanje će biti otvoreno uskoro.",
  "match.predict": "Tipuj utakmicu",
  "match.create": "Kreiraj svoju BiH Puls Card",
  "match.notFound": "Utakmica nije pronađena.",
  "match.viewTable": "🏆 Pogledaj Tabelu Zmajeva",
  "match.liveResults": "Live rezultati",

  // create flow
  "create.whoAreYou": "Ko si i odakle navijaš?",
  "create.nameLabel": "Ime / nadimak",
  "create.namePlaceholder": "npr. Amir",
  "create.countryLabel": "Država",
  "create.countryPlaceholder": "Izaberi državu…",
  "create.cityLabel": "Grad",
  "create.predictScore": "Tipuj rezultat",
  "create.predictingAs": "Tipuješ kao",
  "create.yourPulse": "Kakav ti je puls?",
  "create.updatePulse": "Ažuriraj svoj puls",
  "create.enterNumber": "Unesi broj:",
  "create.savePrediction": "Spremi tip",
  "create.createCard": "Napravi Puls Card",
  "create.sending": "Šaljem…",
  "create.savedTitle": "Tip je spremljen",
  "create.savedDesc": "Tvoj tip je zabilježen. Nastavi tipovati preostale utakmice ili pogledaj rezultate.",
  "create.backHome": "Nazad na početnu",
  "create.backToMatch": "Nazad na utakmicu",
  "create.toastError": "Greška pri slanju. Pokušaj ponovo.",

  // first-time (start) flow
  "start.title": "Tipuj sve utakmice",
  "start.subtitle": "Unesi tip za svaku otvorenu utakmicu. Sve dijele istu Puls Card.",
  "start.noOpenMatches": "Trenutno nema otvorenih utakmica za tipovanje.",
  "start.submitAll": "Napravi Puls Card",
  "start.submitting": "Šaljem…",
  "start.selectHint": "Otključaj utakmicu da je tipuješ",
  "start.matchesTitle": "Otvorene utakmice",

  // card page
  "card.ready": "★ Tvoja Puls Card je spremna ★",
  "card.download": "Download Card",
  "card.preparing": "Pripremam…",
  "card.shareInsta": "Podijeli na Instagram",
  "card.viewLive": "Pogledaj live rezultate",
  "card.shareFallback": "Preuzmi kartu i objavi je na Instagram Story.",
  "card.downloadError": "Greška pri preuzimanju. Pokušaj ponovo.",
  "card.notFound": "Card nije pronađena.",

  // results dashboard
  "results.noVotes": "Još nema glasova za ovu utakmicu.",
  "results.globalPuls": "Globalni Puls Zmajeva",
  "results.byCountry": "Puls po državama",
  "results.topCities": "Top gradovi",
  "results.distribution": "Predikcija rezultata",
  "results.bihWin": "Pobjeda BiH",
  "results.draw": "Neriješeno",
  "results.oppWin": "Pobjeda",
  "results.voteOne": "glas",
  "results.voteMany": "glasova",

  // leaderboard
  "lb.title": "🏆 Tabela Zmajeva",
  "lb.scoring": "Tačan rezultat = 3 boda · Pogođen ishod = 1 bod · Promašaj = 0",
  "lb.empty": "Tabela se računa nakon što se unesu konačni rezultati utakmica.",
  "lb.noTips": "Nema tipova za ovu utakmicu.",
};

const en: Dict = {
  // common
  "common.back": "Back",
  "common.home": "Home",
  "common.next": "Next",
  "common.soon": "Soon",
  "common.allMatches": "All matches",
  "common.viewResults": "View results",
  "common.sarajevoTime": "Sarajevo time",
  "common.localTime": "Local time",

  // landing
  "landing.tagline": "━ How do BiH fans breathe? ━",
  "landing.heroLead": "Enter your pulse, predict the score and join the biggest fan community",
  "landing.heroLeadStrong": "in the world.",
  "landing.ctaCreate": "Create your BiH Puls Card",
  "landing.ctaContinue": "Continue predicting",
  "landing.ctaViewResults": "View results",
  "landing.continueHint": "Predict the remaining matches",
  "landing.annLeft": "Your pulse\nyour story",
  "landing.annRight": "Share and\nsupport the Dragons!",
  "landing.sectionActual": "★ Latest ★",
  "landing.liveResults": "Live results",
  "landing.instagram": "Follow us on Instagram",
  "landing.samplePulsLabel": "Already celebrating",

  // match status / chips
  "status.create": "Create Puls Card",
  "status.tip": "Predict match",
  "status.submitted": "Predicted",
  "status.open": "Open for predictions",
  "status.live": "Live",
  "status.finished": "Finished",
  "status.upcoming": "Soon",
  "status.predictionClosed": "Prediction closed",

  // match detail
  "match.alreadyPredicted": "You already predicted this match",
  "match.viewCard": "View your BiH Puls Card",
  "match.opponentTbd": "The opponent isn't confirmed yet. Predictions will open soon.",
  "match.predict": "Predict match",
  "match.create": "Create your BiH Puls Card",
  "match.notFound": "Match not found.",
  "match.viewTable": "🏆 View the Dragons Table",
  "match.liveResults": "Live results",

  // create flow
  "create.whoAreYou": "Who are you and where do you cheer from?",
  "create.nameLabel": "Name / nickname",
  "create.namePlaceholder": "e.g. Amir",
  "create.countryLabel": "Country",
  "create.countryPlaceholder": "Choose a country…",
  "create.cityLabel": "City",
  "create.predictScore": "Predict the score",
  "create.predictingAs": "Predicting as",
  "create.yourPulse": "What's your pulse?",
  "create.updatePulse": "Update your pulse",
  "create.enterNumber": "Enter a number:",
  "create.savePrediction": "Save prediction",
  "create.createCard": "Create Puls Card",
  "create.sending": "Sending…",
  "create.savedTitle": "Prediction saved",
  "create.savedDesc": "Your prediction has been recorded. Keep predicting the remaining matches or view the results.",
  "create.backHome": "Back to home",
  "create.backToMatch": "Back to match",
  "create.toastError": "Submission error. Please try again.",

  // first-time (start) flow
  "start.title": "Predict all matches",
  "start.subtitle": "Enter a prediction for every open match. They all share one Puls Card.",
  "start.noOpenMatches": "There are currently no open matches for predictions.",
  "start.submitAll": "Create Puls Card",
  "start.submitting": "Sending…",
  "start.selectHint": "Unlock a match to predict it",
  "start.matchesTitle": "Open matches",

  // card page
  "card.ready": "★ Your Puls Card is ready ★",
  "card.download": "Download Card",
  "card.preparing": "Preparing…",
  "card.shareInsta": "Share to Instagram",
  "card.viewLive": "View live results",
  "card.shareFallback": "Download the card and post it to your Instagram Story.",
  "card.downloadError": "Download error. Please try again.",
  "card.notFound": "Card not found.",

  // results dashboard
  "results.noVotes": "No votes yet for this match.",
  "results.globalPuls": "Global Dragons' Pulse",
  "results.byCountry": "Pulse by country",
  "results.topCities": "Top cities",
  "results.distribution": "Score prediction",
  "results.bihWin": "BiH win",
  "results.draw": "Draw",
  "results.oppWin": "Win",
  "results.voteOne": "vote",
  "results.voteMany": "votes",

  // leaderboard
  "lb.title": "🏆 Dragons Table",
  "lb.scoring": "Exact score = 3 pts · Correct outcome = 1 pt · Miss = 0",
  "lb.empty": "The table is calculated after final match results are entered.",
  "lb.noTips": "No predictions for this match.",
};

const DICTS: Record<Locale, Dict> = { bs, en };

export type TFn = (key: keyof typeof bs, vars?: Record<string, string | number>) => string;

function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const dict = DICTS[locale] ?? bs;
  let str = dict[key] ?? bs[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY);
    return v === "en" || v === "bs" ? v : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start from the default on first render so SSR and the first client
  // render match; hydrate the stored choice right after mount.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== locale) setLocaleState(stored);
    const sync = () => setLocaleState(readStoredLocale());
    window.addEventListener("storage", sync);
    window.addEventListener(LOCALE_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(LOCALE_CHANGE_EVENT, sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key as string, vars),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback so components never crash outside the provider (e.g. error pages).
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, vars) => translate(DEFAULT_LOCALE, key as string, vars),
    };
  }
  return ctx;
}
