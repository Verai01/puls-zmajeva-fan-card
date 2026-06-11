import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { pulsCategoryIndex } from "@/lib/puls";
import { localFlagUrl } from "@/components/RoundFlag";
import dragonLogo from "@/assets/dragon-logo.png";

export interface PulsCardData {
  name: string;
  cityDisplay: string;
  /** @deprecated kept for compatibility — the card always shows the Bosnia flag. */
  countryFlag?: string;
  /** @deprecated kept for compatibility — the card always shows the Bosnia flag. */
  countryFlagUrl?: string | null;
  countryName: string;
  opponentName: string;
  bihScore: number;
  opponentScore: number;
  pulsValue: number;
  pulsLabel: string;
}

interface PulsCardProps {
  data: PulsCardData;
  className?: string;
}

/** The card always shows the round Bosnia flag (no opponent flag). */
export const BOSNIA_FLAG_URL = localFlagUrl("BA") ?? "/flags/ba.svg";

/** Background atmosphere per puls category (same blue/gold identity). */
const CARD_BG = [
  "radial-gradient(120% 78% at 50% -5%, oklch(0.34 0.16 262), oklch(0.2 0.12 265) 55%, oklch(0.11 0.07 266))",
  "radial-gradient(120% 80% at 50% -5%, oklch(0.4 0.18 260), oklch(0.24 0.14 265) 55%, oklch(0.14 0.09 266))",
  "radial-gradient(120% 80% at 50% -5%, oklch(0.46 0.19 262), oklch(0.28 0.15 265) 55%, oklch(0.17 0.11 266))",
  "radial-gradient(122% 86% at 50% -8%, oklch(0.5 0.18 252), oklch(0.3 0.15 263) 52%, oklch(0.18 0.11 266))",
  "radial-gradient(132% 96% at 50% -10%, oklch(0.56 0.18 246), oklch(0.34 0.16 260) 48%, oklch(0.2 0.12 266))",
];
const GLOW_OPACITY = [0.06, 0.1, 0.15, 0.22, 0.34];

// Bumpy crowd silhouette path (filled at the bottom of the card).
const CROWD_PATH = (() => {
  let d = "M0 32 V24";
  for (let x = 0; x < 100; x += 7) d += " q3.5 -6 7 0";
  d += " V32 Z";
  return d;
})();

/**
 * The shareable BiH Puls Card — a premium digital fan collectible. Everything
 * is sized in container query units (cqw) so the exact same component renders
 * crisply at any width: small for preview, 1080px for the 9:16 export PNG/JPG.
 */
export const PulsCard = forwardRef<HTMLDivElement, PulsCardProps>(
  ({ data, className }, ref) => {
    const idx = pulsCategoryIndex(data.pulsValue);
    const pulsValue = Math.max(1, Math.min(100, Math.round(data.pulsValue)));

    return (
      <div
        ref={ref}
        className={cn("relative aspect-[9/16] w-full text-center", className)}
        style={{ containerType: "inline-size" }}
      >
        {/* The rounded element carries the background so corners never show a
            dark rectangle behind the card. */}
        <div
          className="relative h-full w-full overflow-hidden rounded-[7cqw]"
          style={{ background: CARD_BG[idx] }}
        >
          {/* jersey vertical pinstripes / stitch lines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 13px, oklch(0.84 0.17 90 / 7%) 13px 14px, transparent 14px 28px, oklch(0.7 0.1 230 / 8%) 28px 29px, transparent 29px 44px)",
            }}
          />
          {/* jacquard micro-texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 5%) 0.5px, transparent 0.5px), radial-gradient(oklch(0 0 0 / 7%) 0.5px, transparent 0.5px)",
              backgroundSize: "6px 6px, 6px 6px",
              backgroundPosition: "0 0, 3px 3px",
            }}
          />
          {/* abstract Zmaj/dragon watermark */}
          <img
            src={dragonLogo}
            alt=""
            aria-hidden
            crossOrigin="anonymous"
            className="pointer-events-none absolute left-1/2 top-[40cqw] h-[70cqw] w-[70cqw] -translate-x-1/2 object-contain opacity-[0.05]"
          />
          {/* crowd / stadium silhouette at the bottom */}
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30cqw] w-full"
          >
            <path d={CROWD_PATH} fill="oklch(0.1 0.06 266)" opacity="0.55" transform="translate(3 0)" />
            <path d={CROWD_PATH} fill="oklch(0.07 0.05 266)" opacity="0.8" />
          </svg>
          {/* category glow at bottom */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(75% 42% at 50% 102%, oklch(0.84 0.17 90), transparent 70%)",
              opacity: GLOW_OPACITY[idx],
            }}
          />
          {/* gold inner frame (safe area) */}
          <div className="pointer-events-none absolute inset-[4cqw] rounded-[5cqw] border-[0.45cqw] border-primary/55" />
          {/* glass shine */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, transparent 38%, oklch(1 0 0 / 9%) 47%, transparent 55%)",
            }}
          />

          {/* content */}
          <div className="relative z-[2] flex h-full flex-col items-center justify-between px-[9cqw] py-[8cqw]">
            <div className="flex flex-col items-center gap-[1cqw]">
              <div className="font-display text-[6cqw] leading-none tracking-wide text-primary">
                ★ BiH PULS CARD ★
              </div>
              <div className="text-[2.8cqw] font-bold tracking-[0.22em] text-foreground/70">
                #DREAMBIG #DREAMBIH
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.6cqw]">
              <div className="relative h-[22cqw] w-[22cqw] shrink-0 overflow-hidden rounded-full bg-[oklch(0.18_0.11_266)] ring-[0.8cqw] ring-primary/70 shadow-[0_0.6cqw_2cqw_oklch(0_0_0_/_45%)]">
                <img
                  src={BOSNIA_FLAG_URL}
                  alt="BiH"
                  crossOrigin="anonymous"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="font-display text-[11cqw] uppercase leading-none text-foreground">
                {data.name}
              </div>
              <div className="text-[3.2cqw] font-semibold uppercase tracking-wide text-foreground/80">
                📍 {data.cityDisplay}, {data.countryName}
              </div>
            </div>

            <div className="flex flex-col items-center gap-[2cqw]">
              <div className="text-[3.8cqw] font-bold uppercase tracking-wide text-ice">
                BiH vs {data.opponentName}
              </div>
              <div className="rounded-[2.5cqw] border-[0.5cqw] border-primary/70 bg-[oklch(0.12_0.08_266_/_78%)] px-[10cqw] py-[2.4cqw] font-display text-[11cqw] leading-none text-foreground shadow-[0_0.6cqw_2cqw_oklch(0_0_0_/_45%)]">
                {data.bihScore} : {data.opponentScore}
              </div>
            </div>

            <div className="flex flex-col items-center gap-[0.4cqw]">
              <div className="font-display text-[5cqw] tracking-wide text-primary">
                PULS ZMAJEVA
              </div>
              <div className="font-display leading-[0.82] text-primary drop-shadow-[0_0.6cqw_2.4cqw_oklch(0.84_0.17_90_/_50%)]">
                <span className="text-[30cqw]">{pulsValue}</span>
                <span className="text-[8.5cqw] text-foreground/85">/100</span>
              </div>
              <div className="font-display text-[6.5cqw] uppercase italic tracking-wide text-foreground">
                {data.pulsLabel}!
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.2cqw]">
              <img
                src={dragonLogo}
                alt="Zmaj"
                crossOrigin="anonymous"
                className="h-[14cqw] w-[14cqw] object-contain drop-shadow-[0_0.6cqw_2cqw_oklch(0.84_0.17_90_/_60%)]"
              />
              <div className="text-[3.2cqw] font-bold uppercase tracking-[0.2em] text-foreground/65">
                pulszmajeva.com
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PulsCard.displayName = "PulsCard";
