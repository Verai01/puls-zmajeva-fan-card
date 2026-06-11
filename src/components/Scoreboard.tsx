import type { ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { BosniaRoundFlag, RoundFlag } from "@/components/RoundFlag";

interface ScoreboardProps {
  opponentName: string;
  opponentCode?: string | null;
  bihScore: number;
  opponentScore: number;
  onChange: (side: "bih" | "opponent", value: number) => void;
  /** Disable steppers when prediction is closed. */
  disabled?: boolean;
}

function Stepper({
  label,
  flagNode,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  flagNode: ReactNode;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-foreground">
        {flagNode}
        <span className="max-w-[80px] truncate">{label}</span>
      </div>
      <div
        className="grid h-20 w-20 place-items-center rounded-2xl border-2 border-primary/50 bg-[oklch(0.16_0.1_266)] font-display text-5xl leading-none text-primary"
        aria-live="polite"
      >
        {value}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          aria-label={`- ${label}`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-secondary text-foreground active:scale-95 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" strokeWidth={3} />
        </button>
        <button
          type="button"
          disabled={disabled}
          aria-label={`+ ${label}`}
          onClick={() => onChange(Math.min(30, value + 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground active:scale-95 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

export function Scoreboard({
  opponentName,
  opponentCode,
  bihScore,
  opponentScore,
  onChange,
  disabled = false,
}: ScoreboardProps) {
  return (
    <div className="glass-card flex items-start gap-2 rounded-2xl px-4 py-6">
      <Stepper
        label="BiH"
        flagNode={<BosniaRoundFlag size="sm" />}
        value={bihScore}
        onChange={(v) => onChange("bih", v)}
        disabled={disabled}
      />
      <div className="self-center pt-2 font-display text-4xl text-foreground/60">:</div>
      <Stepper
        label={opponentName}
        flagNode={
          <RoundFlag code={opponentCode} size="sm" alt={opponentName} emoji="⚽" />
        }
        value={opponentScore}
        onChange={(v) => onChange("opponent", v)}
        disabled={disabled}
      />
    </div>
  );
}
