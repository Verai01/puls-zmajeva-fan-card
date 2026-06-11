import type { Locale } from "@/lib/i18n";

export interface Country {
  code: string;
  /** Canonical Bosnian name (also stored in Supabase). */
  name: string;
  /** English display name. */
  nameEn: string;
  flag: string;
}

/** Countries supported in the submission flow. */
export const COUNTRIES: Country[] = [
  { code: "BA", name: "Bosna i Hercegovina", nameEn: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "DE", name: "Njemačka", nameEn: "Germany", flag: "🇩🇪" },
  { code: "AT", name: "Austrija", nameEn: "Austria", flag: "🇦🇹" },
  { code: "CH", name: "Švicarska", nameEn: "Switzerland", flag: "🇨🇭" },
  { code: "SE", name: "Švedska", nameEn: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norveška", nameEn: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Danska", nameEn: "Denmark", flag: "🇩🇰" },
  { code: "NL", name: "Nizozemska", nameEn: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgija", nameEn: "Belgium", flag: "🇧🇪" },
  { code: "FR", name: "Francuska", nameEn: "France", flag: "🇫🇷" },
  { code: "SI", name: "Slovenija", nameEn: "Slovenia", flag: "🇸🇮" },
  { code: "HR", name: "Hrvatska", nameEn: "Croatia", flag: "🇭🇷" },
  { code: "RS", name: "Srbija", nameEn: "Serbia", flag: "🇷🇸" },
  { code: "ME", name: "Crna Gora", nameEn: "Montenegro", flag: "🇲🇪" },
  { code: "TR", name: "Turska", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "US", name: "SAD", nameEn: "USA", flag: "🇺🇸" },
  { code: "CA", name: "Kanada", nameEn: "Canada", flag: "🇨🇦" },
  { code: "QA", name: "Katar", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "AU", name: "Australija", nameEn: "Australia", flag: "🇦🇺" },
  { code: "GB", name: "Ujedinjeno Kraljevstvo", nameEn: "United Kingdom", flag: "🇬🇧" },
  { code: "IT", name: "Italija", nameEn: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Španija", nameEn: "Spain", flag: "🇪🇸" },
  { code: "LU", name: "Luksemburg", nameEn: "Luxembourg", flag: "🇱🇺" },
  { code: "XX", name: "Ostalo", nameEn: "Other", flag: "🌍" },
];

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function countryByName(name: string): Country | undefined {
  return COUNTRIES.find((c) => c.name === name);
}

/** Localized country name for display (falls back to the stored name). */
export function countryDisplayName(name: string, locale: Locale): string {
  const c = countryByName(name);
  if (!c) return name;
  return locale === "en" ? c.nameEn : c.name;
}

/** Round/rectangular flag image URL (CORS-enabled) for high-quality card rendering. */
export function flagUrl(code?: string | null): string | null {
  if (!code || code === "XX") return null;
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}
