import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface PulsCardData {
  name: string;
  cityDisplay: string;
  countryFlag: string;
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

/**
 * The shareable BiH Puls Card. Everything is sized in container query units
 * (cqw) so the exact same component renders crisply at any width — small for
 * preview, 1080px for the downloadable 9:16 Instagram Story PNG.
 */
export const PulsCard = forwardRef<HTMLDivElement, PulsCardProps>(
  ({ data, className }, ref) => {
    const gaugePct = Math.max(1, Math.min(100, data.pulsValue));
    return (
      <div
        ref={ref}
        className={cn(
          "relative aspect-[9/16] w-full overflow-hidden rounded-[5cqw] text-center",
          className,
        )}
        style={{
          containerType: "inline-size",
          background:
            "radial-gradient(120% 80% at 50% -5%, oklch(0.46 0.19 262), oklch(0.28 0.15 265) 55%, oklch(0.17 0.11 266))",
        }}
      >
        {/* pinstripes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 14px, oklch(0.84 0.17 90 / 7%) 14px 15px, transparent 15px 30px, oklch(0.7 0.1 230 / 8%) 30px 31px, transparent 31px 46px)",
          }}
        />
        {/* gold inner frame */}
        <div className="pointer-events-none absolute inset-[3cqw] rounded-[4cqw] border-[0.5cqw] border-primary/55" />

        {/* vertical puls gauge on the right */}
        <div className="absolute right-[5cqw] top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-[1.5cqw]">
          <span className="text-[2.6cqw] font-bold text-foreground/70">100</span>
          <div className="relative h-[42cqw] w-[3.2cqw] overflow-hidden rounded-full bg-[oklch(0.18_0.1_266)] ring-1 ring-primary/30">
            <div
              className="absolute bottom-0 left-0 w-full rounded-full"
              style={{
                height: `${gaugePct}%`,
                background:
                  "linear-gradient(to top, oklch(0.55 0.16 256), oklch(0.84 0.17 90))",
              }}
            />
            <div
              className="absolute left-1/2 h-[5cqw] w-[5cqw] -translate-x-1/2 translate-y-1/2 rounded-full border-[0.6cqw] border-[oklch(0.2_0.12_266)] bg-primary"
              style={{ bottom: `${gaugePct}%` }}
            />
          </div>
          <span className="text-[2.6cqw] font-bold text-foreground/70">0</span>
        </div>

        {/* content */}
        <div className="relative z-[1] flex h-full flex-col items-center justify-between px-[9cqw] py-[9cqw]">
          <div className="flex flex-col items-center gap-[1cqw]">
            <div className="font-display text-[6.4cqw] leading-none tracking-wide text-primary">
              ★ BiH PULS CARD ★
            </div>
            <div className="text-[3cqw] font-bold tracking-[0.25em] text-foreground/70">
              #DREAMBIG #DREAMBIH
            </div>
          </div>

          <div className="flex flex-col items-center gap-[2cqw]">
            <div className="grid h-[18cqw] w-[18cqw] place-items-center rounded-full bg-[oklch(0.2_0.12_266)] text-[10cqw] ring-[0.6cqw] ring-primary/60">
              {data.countryFlag}
            </div>
            <div className="font-display text-[11cqw] uppercase leading-none text-foreground">
              {data.name}
            </div>
            <div className="text-[3.6cqw] font-semibold uppercase tracking-wide text-foreground/80">
              📍 {data.cityDisplay}, {data.countryName}
            </div>
          </div>

          <div className="flex flex-col items-center gap-[2.5cqw]">
            <div className="text-[4cqw] font-bold uppercase tracking-wide text-ice">
              BiH vs {data.opponentName}
            </div>
            <div className="rounded-[2cqw] border-[0.5cqw] border-primary/60 px-[6cqw] py-[1.5cqw] font-display text-[8cqw] leading-none text-foreground">
              {data.bihScore} : {data.opponentScore}
            </div>
          </div>

          <div className="flex flex-col items-center gap-[1cqw]">
            <div className="font-display text-[5.2cqw] tracking-wide text-primary">
              PULS ZMAJEVA
            </div>
            <div className="font-display leading-none text-primary">
              <span className="text-[26cqw]">{data.pulsValue}</span>
              <span className="text-[8cqw] text-foreground/80">/100</span>
            </div>
            <div className="font-display text-[6.4cqw] uppercase italic tracking-wide text-foreground">
              {data.pulsLabel}!
            </div>
          </div>

          <div className="text-[3cqw] font-bold uppercase tracking-[0.2em] text-foreground/60">
            @pulszmajeva
          </div>
        </div>
      </div>
    );
  },
);

PulsCard.displayName = "PulsCard";
