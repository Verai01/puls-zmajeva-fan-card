import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { pulsCategoryIndex } from "@/lib/puls";
import dragonLogo from "@/assets/dragon-logo.png";

export interface PulsCardData {
  name: string;
  cityDisplay: string;
  countryFlag: string;
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

/** Subtle background atmosphere per puls category (same blue/gold identity). */
const CARD_BG = [
  // 1-20 Slomljen, ali tu — darker, dramatic
  "radial-gradient(120% 78% at 50% -5%, oklch(0.34 0.16 262), oklch(0.2 0.12 265) 55%, oklch(0.11 0.07 266))",
  // 21-40 Nervozni Zmaj — electric tension
  "radial-gradient(120% 80% at 50% -5%, oklch(0.4 0.18 260), oklch(0.24 0.14 265) 55%, oklch(0.14 0.09 266))",
  // 41-60 Realista — balanced
  "radial-gradient(120% 80% at 50% -5%, oklch(0.46 0.19 262), oklch(0.28 0.15 265) 55%, oklch(0.17 0.11 266))",
  // 61-80 Vjernik — more yellow energy
  "radial-gradient(122% 86% at 50% -8%, oklch(0.5 0.18 252), oklch(0.3 0.15 263) 52%, oklch(0.18 0.11 266))",
  // 81-100 Već slavimo — celebratory
  "radial-gradient(132% 96% at 50% -10%, oklch(0.56 0.18 246), oklch(0.34 0.16 260) 48%, oklch(0.2 0.12 266))",
];
const GLOW_OPACITY = [0.05, 0.09, 0.13, 0.2, 0.32];

/**
 * The shareable BiH Puls Card. Everything is sized in container query units
 * (cqw) so the exact same component renders crisply at any width — small for
 * preview, 1080px for the downloadable 9:16 Instagram Story PNG.
 */
export const PulsCard = forwardRef<HTMLDivElement, PulsCardProps>(
  ({ data, className }, ref) => {
    const gaugePct = Math.max(1, Math.min(100, data.pulsValue));
    const idx = pulsCategoryIndex(data.pulsValue);
    const initials = data.name.trim().slice(0, 2).toUpperCase() || "BH";

    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden rounded-[5cqw] text-center",
          className,
        )}
        style={{ containerType: "inline-size", background: CARD_BG[idx] }}
      >
        {/* pinstripes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 14px, oklch(0.84 0.17 90 / 6%) 14px 15px, transparent 15px 30px, oklch(0.7 0.1 230 / 7%) 30px 31px, transparent 31px 46px)",
          }}
        />
        {/* category glow at bottom */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 45% at 50% 102%, oklch(0.84 0.17 90), transparent 70%)",
            opacity: GLOW_OPACITY[idx],
          }}
        />
        {/* gold inner frame (safe area) */}
        <div className="pointer-events-none absolute inset-[3cqw] rounded-[4cqw] border-[0.5cqw] border-primary/55" />

        {/* vertical puls barometer on the right */}
        <div className="absolute right-[5.5cqw] top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-[2cqw]">
          <span className="font-display text-[3cqw] text-foreground/80">100</span>
          <div className="relative h-[50cqw] w-[5cqw] overflow-hidden rounded-full bg-[oklch(0.14_0.09_266)] ring-[0.4cqw] ring-primary/35">
            <div
              className="absolute bottom-0 left-0 w-full rounded-full"
              style={{
                height: `${gaugePct}%`,
                background:
                  "linear-gradient(to top, oklch(0.55 0.16 256), oklch(0.84 0.17 90))",
              }}
            />
            <div
              className="absolute left-1/2 grid h-[8cqw] w-[8cqw] -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border-[0.7cqw] border-[oklch(0.16_0.1_266)] bg-primary font-display text-[3.2cqw] text-primary-foreground"
              style={{ bottom: `${gaugePct}%` }}
            >
              {gaugePct}
            </div>
          </div>
          <span className="font-display text-[3cqw] text-foreground/80">0</span>
        </div>

        {/* content */}
        <div className="relative z-[1] flex h-full flex-col items-center justify-between px-[10cqw] py-[8cqw]">
          <div className="flex flex-col items-center gap-[1cqw]">
            <div className="font-display text-[6cqw] leading-none tracking-wide text-primary">
              ★ BiH PULS CARD ★
            </div>
            <div className="text-[2.8cqw] font-bold tracking-[0.25em] text-foreground/70">
              #DREAMBIG #DREAMBIH
            </div>
          </div>

          <div className="flex flex-col items-center gap-[2cqw]">
            <div className="grid h-[20cqw] w-[20cqw] place-items-center overflow-hidden rounded-full bg-[oklch(0.18_0.11_266)] ring-[0.7cqw] ring-primary/70">
              {data.countryFlagUrl ? (
                <img
                  src={data.countryFlagUrl}
                  alt={data.countryName}
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-[7cqw] text-foreground">
                  {initials}
                </span>
              )}
            </div>
            <div className="font-display text-[11cqw] uppercase leading-none text-foreground">
              {data.name}
            </div>
            <div className="text-[3.4cqw] font-semibold uppercase tracking-wide text-foreground/80">
              📍 {data.cityDisplay}, {data.countryName}
            </div>
          </div>

          <div className="flex flex-col items-center gap-[2cqw]">
            <div className="text-[3.8cqw] font-bold uppercase tracking-wide text-ice">
              BiH vs {data.opponentName}
            </div>
            <div className="rounded-[2cqw] border-[0.5cqw] border-primary/60 px-[6cqw] py-[1.5cqw] font-display text-[8cqw] leading-none text-foreground">
              {data.bihScore} : {data.opponentScore}
            </div>
          </div>

          <div className="flex flex-col items-center gap-[0.5cqw]">
            <div className="font-display text-[5cqw] tracking-wide text-primary">
              PULS ZMAJEVA
            </div>
            <div className="font-display leading-[0.85] text-primary drop-shadow-[0_0.5cqw_2cqw_oklch(0.84_0.17_90_/_45%)]">
              <span className="text-[28cqw]">{data.pulsValue}</span>
              <span className="text-[8cqw] text-foreground/85">/100</span>
            </div>
            <div className="font-display text-[6.4cqw] uppercase italic tracking-wide text-foreground">
              {data.pulsLabel}!
            </div>
          </div>

          <div className="flex flex-col items-center gap-[1cqw]">
            <img
              src={dragonLogo}
              alt="Zmaj"
              className="h-[10cqw] w-[10cqw] object-contain drop-shadow-[0_0.4cqw_1.5cqw_oklch(0.84_0.17_90_/_55%)]"
            />
            <div className="text-[3cqw] font-bold uppercase tracking-[0.2em] text-foreground/65">
              @pulszmajeva
            </div>
          </div>
        </div>
      </div>
    );
  },
);

PulsCard.displayName = "PulsCard";
