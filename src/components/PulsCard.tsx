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

/** The card always shows the round Bosnia flag (no opponent/country flag). */
export const BOSNIA_FLAG_URL = localFlagUrl("BA") ?? "/flags/ba.svg";

/**
 * Royal→navy jersey gradient per puls category. The bottom stop stays a deep
 * *blue* (never near-black) so the footer never sinks into a black block.
 */
const CARD_BG = [
  "radial-gradient(125% 80% at 50% -8%, oklch(0.4 0.17 262), oklch(0.27 0.14 265) 55%, oklch(0.19 0.11 266))",
  "radial-gradient(125% 80% at 50% -8%, oklch(0.44 0.18 261), oklch(0.29 0.15 265) 55%, oklch(0.2 0.11 266))",
  "radial-gradient(125% 82% at 50% -8%, oklch(0.48 0.19 261), oklch(0.31 0.15 264) 55%, oklch(0.21 0.12 266))",
  "radial-gradient(126% 86% at 50% -10%, oklch(0.52 0.18 254), oklch(0.33 0.15 263) 52%, oklch(0.22 0.12 266))",
  "radial-gradient(132% 92% at 50% -12%, oklch(0.56 0.18 248), oklch(0.37 0.16 260) 48%, oklch(0.23 0.12 266))",
];
const GLOW_OPACITY = [0.05, 0.08, 0.12, 0.18, 0.28];

/** Abstract, very transparent Bosnia flag (triangle + star row) for the top half. */
function BosniaWatermark() {
  // Stars stepping down the triangle's hypotenuse (top-left → lower apex).
  const stars = Array.from({ length: 6 }, (_, i) => {
    const tpos = 0.1 + (i / 5) * 0.78;
    return { x: 14 + tpos * 44, y: 4 + tpos * 92, s: 7 };
  });
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[52%]"
      style={{
        mixBlendMode: "soft-light",
        opacity: 0.7,
        WebkitMaskImage: "linear-gradient(to bottom, black 58%, transparent)",
        maskImage: "linear-gradient(to bottom, black 58%, transparent)",
      }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        {/* yellow field — kept extremely faint, never a dominant area */}
        <path d="M2 0 L100 0 L62 100 Z" fill="oklch(0.84 0.17 90)" opacity="0.1" />
        {stars.map((st, i) => (
          <text
            key={i}
            x={st.x}
            y={st.y}
            fontSize={st.s}
            textAnchor="middle"
            fill="oklch(0.98 0.01 250)"
            opacity="0.22"
          >
            ★
          </text>
        ))}
      </svg>
    </div>
  );
}

/**
 * The shareable BiH Puls Card — a premium digital fan collectible inspired by
 * the Bosnia jersey (royal/navy fabric, fine mesh, subtle ton-in-ton panels and
 * thin gold pinstripes). Everything is sized in container query units (cqw) so
 * the exact same component renders crisply at any width: small for preview,
 * 1080px for the 9:16 export JPG.
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
        {/* The rounded element carries the background so corners never reveal a
            dark rectangle behind the card. */}
        <div
          className="relative h-full w-full overflow-hidden rounded-[8cqw]"
          style={{ background: CARD_BG[idx] }}
        >
          {/* vertical ton-in-ton fabric panels */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, oklch(1 0 0 / 0%) 0 6.5%, oklch(1 0 0 / 2.5%) 6.5% 13%, oklch(0 0 0 / 4%) 13% 19.5%)",
            }}
          />
          {/* fine diagonal weave */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 5px, oklch(0 0 0 / 4%) 5px 6px), repeating-linear-gradient(45deg, transparent 0 9px, oklch(1 0 0 / 2%) 9px 10px)",
            }}
          />
          {/* mesh perforations */}
          <div
            className="pointer-events-none absolute inset-0 opacity-55"
            style={{
              backgroundImage:
                "radial-gradient(oklch(1 0 0 / 5%) 0.5px, transparent 0.6px), radial-gradient(oklch(0 0 0 / 7%) 0.5px, transparent 0.6px)",
              backgroundSize: "6px 6px, 6px 6px",
              backgroundPosition: "0 0, 3px 3px",
            }}
          />

          {/* thin gold pinstripes (asymmetric, seam-like, minimal glow) */}
          <div className="pointer-events-none absolute -inset-y-4 left-[24%] w-[1.4cqw] rotate-[4deg] bg-[oklch(0.84_0.17_90_/_22%)] blur-[0.6cqw]" />
          <div className="pointer-events-none absolute -inset-y-4 left-[25%] w-[0.3cqw] rotate-[4deg] bg-[oklch(0.88_0.15_92_/_55%)]" />
          <div className="pointer-events-none absolute -inset-y-4 right-[22%] w-[0.3cqw] -rotate-[3deg] bg-[oklch(0.88_0.15_92_/_45%)]" />
          <div className="pointer-events-none absolute -inset-y-4 right-[34%] w-[1.2cqw] -rotate-[3deg] bg-[oklch(0.84_0.17_90_/_15%)] blur-[0.6cqw]" />

          {/* transparent Bosnia watermark on the top half */}
          <BosniaWatermark />

          {/* abstract Zmaj/dragon watermark */}
          <img
            src={dragonLogo}
            alt=""
            aria-hidden
            crossOrigin="anonymous"
            className="pointer-events-none absolute left-1/2 top-[44cqw] h-[64cqw] w-[64cqw] -translate-x-1/2 object-contain opacity-[0.045]"
          />

          {/* soft warm glow near the bottom (keeps the lower area blue, not black) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 38% at 50% 104%, oklch(0.84 0.17 90), transparent 72%)",
              opacity: GLOW_OPACITY[idx],
            }}
          />

          {/* gold inner frame (safe area) */}
          <div className="pointer-events-none absolute inset-[4cqw] rounded-[5.5cqw] border-[0.45cqw] border-primary/55" />
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
              <div className="relative h-[22cqw] w-[22cqw] shrink-0 overflow-hidden rounded-full">
                <img
                  src={BOSNIA_FLAG_URL}
                  alt="BiH"
                  crossOrigin="anonymous"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
              <div className="font-display text-[11cqw] uppercase leading-none text-foreground">
                {data.name}
              </div>
              <div className="text-[3.2cqw] font-semibold uppercase tracking-wide text-foreground/85">
                📍 {data.cityDisplay}, {data.countryName}
              </div>
            </div>

            <div className="flex flex-col items-center gap-[2cqw]">
              <div className="text-[3.8cqw] font-bold uppercase tracking-wide text-ice">
                BiH vs {data.opponentName}
              </div>
              <div className="rounded-[2.5cqw] border-[0.5cqw] border-primary/70 bg-[oklch(0.2_0.12_266_/_72%)] px-[10cqw] py-[2.4cqw] font-display text-[11cqw] leading-none text-foreground shadow-[0_0.6cqw_2cqw_oklch(0.1_0.07_266_/_55%)]">
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
              <div className="text-[3.2cqw] font-bold uppercase tracking-[0.2em] text-foreground/70">
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
