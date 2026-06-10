export interface Country {
  code: string;
  name: string;
  flag: string;
}

/** Countries supported in the submission flow. */
export const COUNTRIES: Country[] = [
  { code: "BA", name: "Bosna i Hercegovina", flag: "🇧🇦" },
  { code: "DE", name: "Njemačka", flag: "🇩🇪" },
  { code: "AT", name: "Austrija", flag: "🇦🇹" },
  { code: "CH", name: "Švicarska", flag: "🇨🇭" },
  { code: "SE", name: "Švedska", flag: "🇸🇪" },
  { code: "NO", name: "Norveška", flag: "🇳🇴" },
  { code: "DK", name: "Danska", flag: "🇩🇰" },
  { code: "NL", name: "Nizozemska", flag: "🇳🇱" },
  { code: "BE", name: "Belgija", flag: "🇧🇪" },
  { code: "FR", name: "Francuska", flag: "🇫🇷" },
  { code: "SI", name: "Slovenija", flag: "🇸🇮" },
  { code: "HR", name: "Hrvatska", flag: "🇭🇷" },
  { code: "RS", name: "Srbija", flag: "🇷🇸" },
  { code: "ME", name: "Crna Gora", flag: "🇲🇪" },
  { code: "TR", name: "Turska", flag: "🇹🇷" },
  { code: "US", name: "SAD", flag: "🇺🇸" },
  { code: "CA", name: "Kanada", flag: "🇨🇦" },
  { code: "AU", name: "Australija", flag: "🇦🇺" },
  { code: "GB", name: "Ujedinjeno Kraljevstvo", flag: "🇬🇧" },
  { code: "IT", name: "Italija", flag: "🇮🇹" },
  { code: "ES", name: "Španija", flag: "🇪🇸" },
  { code: "LU", name: "Luksemburg", flag: "🇱🇺" },
  { code: "XX", name: "Ostalo", flag: "🌍" },
];

export function countryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function countryByName(name: string): Country | undefined {
  return COUNTRIES.find((c) => c.name === name);
}

/** Round/rectangular flag image URL (CORS-enabled) for high-quality card rendering. */
export function flagUrl(code?: string | null): string | null {
  if (!code || code === "XX") return null;
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
}
