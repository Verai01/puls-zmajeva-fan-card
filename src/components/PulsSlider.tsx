import { useCallback, useRef } from "react";

interface PulsSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function PulsSlider({ value, onChange }: PulsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const v = Math.max(1, Math.min(100, value));
  const pct = ((v - 1) / 99) * 100;

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const next = Math.round(1 + Math.max(0, Math.min(1, ratio)) * 99);
      onChange(next);
    },
    [onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1 && e.pressure === 0) return;
    updateFromClientX(e.clientX);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(1, v - 1));
    if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(100, v + 1));
  };

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
        <span className="text-ice/80">Strah</span>
        <span className="text-primary">Euforija</span>
      </div>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative h-5 w-full cursor-pointer touch-none rounded-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.55 0.16 256), oklch(0.7 0.13 200), oklch(0.84 0.17 90))",
        }}
      >
        <div
          role="slider"
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={v}
          aria-label="Puls Zmajeva"
          tabIndex={0}
          onKeyDown={handleKey}
          className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[oklch(0.2_0.12_266)] bg-primary text-[10px] font-black text-primary-foreground shadow-lg outline-none animate-pulse-ring focus-visible:ring-2 focus-visible:ring-foreground"
          style={{ left: `${pct}%` }}
        >
          {v}
        </div>
      </div>
    </div>
  );
}
