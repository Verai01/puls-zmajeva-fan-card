/**
 * Normalize a string for accent/diacritic-insensitive matching.
 * Malmö -> malmo, Zürich -> zurich, München -> munchen, Đakovo -> dakovo.
 */
export function normalizeCity(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .replace(/ø/g, "o")
    .replace(/đ/g, "d")
    .replace(/ð/g, "d")
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}
