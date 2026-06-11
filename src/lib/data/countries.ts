import type { Locale } from "@/lib/i18n";

export interface Country {
  code: string;
  /** Canonical Bosnian name (also stored in Supabase). */
  name: string;
  /** English display name. */
  nameEn: string;
  /** German display name. */
  nameDe: string;
  flag: string;
}

/** Countries supported in the submission flow. */
export const COUNTRIES: Country[] = [
  { code: "BA", name: "Bosna i Hercegovina", nameEn: "Bosnia and Herzegovina", nameDe: "Bosnien und Herzegowina", flag: "🇧🇦" },
  { code: "DE", name: "Njemačka", nameEn: "Germany", nameDe: "Deutschland", flag: "🇩🇪" },
  { code: "AT", name: "Austrija", nameEn: "Austria", nameDe: "Österreich", flag: "🇦🇹" },
  { code: "CH", name: "Švicarska", nameEn: "Switzerland", nameDe: "Schweiz", flag: "🇨🇭" },
  { code: "SE", name: "Švedska", nameEn: "Sweden", nameDe: "Schweden", flag: "🇸🇪" },
  { code: "NO", name: "Norveška", nameEn: "Norway", nameDe: "Norwegen", flag: "🇳🇴" },
  { code: "DK", name: "Danska", nameEn: "Denmark", nameDe: "Dänemark", flag: "🇩🇰" },
  { code: "NL", name: "Nizozemska", nameEn: "Netherlands", nameDe: "Niederlande", flag: "🇳🇱" },
  { code: "BE", name: "Belgija", nameEn: "Belgium", nameDe: "Belgien", flag: "🇧🇪" },
  { code: "FR", name: "Francuska", nameEn: "France", nameDe: "Frankreich", flag: "🇫🇷" },
  { code: "SI", name: "Slovenija", nameEn: "Slovenia", nameDe: "Slowenien", flag: "🇸🇮" },
  { code: "HR", name: "Hrvatska", nameEn: "Croatia", nameDe: "Kroatien", flag: "🇭🇷" },
  { code: "RS", name: "Srbija", nameEn: "Serbia", nameDe: "Serbien", flag: "🇷🇸" },
  { code: "ME", name: "Crna Gora", nameEn: "Montenegro", nameDe: "Montenegro", flag: "🇲🇪" },
  { code: "TR", name: "Turska", nameEn: "Turkey", nameDe: "Türkei", flag: "🇹🇷" },
  { code: "US", name: "SAD", nameEn: "USA", nameDe: "USA", flag: "🇺🇸" },
  { code: "CA", name: "Kanada", nameEn: "Canada", nameDe: "Kanada", flag: "🇨🇦" },
  { code: "QA", name: "Katar", nameEn: "Qatar", nameDe: "Katar", flag: "🇶🇦" },
  { code: "AU", name: "Australija", nameEn: "Australia", nameDe: "Australien", flag: "🇦🇺" },
  { code: "GB", name: "Ujedinjeno Kraljevstvo", nameEn: "United Kingdom", nameDe: "Vereinigtes Königreich", flag: "🇬🇧" },
  { code: "IT", name: "Italija", nameEn: "Italy", nameDe: "Italien", flag: "🇮🇹" },
  { code: "ES", name: "Španija", nameEn: "Spain", nameDe: "Spanien", flag: "🇪🇸" },
  { code: "LU", name: "Luksemburg", nameEn: "Luxembourg", nameDe: "Luxemburg", flag: "🇱🇺" },
  { code: "XX", name: "Ostalo", nameEn: "Other", nameDe: "Andere", flag: "🌍" },
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
  if (locale === "en") return c.nameEn;
  if (locale === "de") return c.nameDe;
  return c.name;
}

/** Localized name for a country by ISO code. */
export function countryDisplayNameByCode(code: string, locale: Locale): string {
  const c = countryByCode(code);
  if (!c) return code;
  if (locale === "en") return c.nameEn;
  if (locale === "de") return c.nameDe;
  return c.name;
}

/** Round/rectangular flag image URL (CORS-enabled) for high-quality card rendering. */
export function flagUrl(code?: string | null): string | null {
  if (!code || code === "XX") return null;
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}
