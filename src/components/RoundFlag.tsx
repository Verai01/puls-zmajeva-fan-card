import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
  xl: "h-12 w-12",
} as const;

export type FlagSize = keyof typeof SIZE_CLASS;

/** ISO codes for which we ship a clean round SVG in /public/flags. */
const LOCAL_FLAGS = new Set([
  "ba", "de", "at", "ch", "se", "no", "dk", "nl", "be", "fr", "si",
  "hr", "rs", "me", "tr", "us", "ca", "qa", "au", "gb", "it", "es", "lu",
]);

/** Local round SVG path for a country code, or null if we don't ship one. */
export function localFlagUrl(code?: string | null): string | null {
  if (!code) return null;
  const c = code.toLowerCase();
  return LOCAL_FLAGS.has(c) ? `/flags/${c}.svg` : null;
}

// Perfectly round, rimless flag: no border, ring, outline or rim shadow.
const FLAG_CLASS = "shrink-0 rounded-full object-cover object-center";

/**
 * Single reusable round flag used everywhere (header, match cards, scoreboard,
 * Puls Card, dashboards, rankings). Prefers crisp local round SVGs and falls
 * back to flagcdn for any other configured country, then to an emoji. Always
 * borderless / ringless.
 */
export function RoundFlag({
  code,
  emoji,
  size = "sm",
  className,
  alt = "",
}: {
  code?: string | null;
  emoji?: string;
  size?: FlagSize;
  className?: string;
  alt?: string;
}) {
  const dim = SIZE_CLASS[size];

  const local = localFlagUrl(code);
  if (local) {
    return <img src={local} alt={alt} className={cn(FLAG_CLASS, dim, className)} />;
  }

  if (code && code !== "XX") {
    return (
      <img
        src={`https://flagcdn.com/w320/${code.toLowerCase()}.png`}
        alt={alt}
        crossOrigin="anonymous"
        className={cn(FLAG_CLASS, dim, className)}
      />
    );
  }

  if (emoji) {
    return (
      <span
        className={cn(
          "inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-base leading-none",
          dim,
          className,
        )}
      >
        {emoji}
      </span>
    );
  }

  return null;
}

/** Convenience wrapper for the Bosnia & Herzegovina round flag. */
export function BosniaRoundFlag({
  size = "sm",
  className,
}: {
  size?: FlagSize;
  className?: string;
}) {
  return <RoundFlag code="BA" size={size} className={className} alt="BiH" />;
}
