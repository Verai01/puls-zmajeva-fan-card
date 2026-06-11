import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PulsCard, type PulsCardData } from "@/components/PulsCard";

interface PulsCardCarouselProps {
  cards: PulsCardData[];
  initialIndex?: number;
  onActiveChange?: (index: number) => void;
  /** Slightly rotate each card like the reference showpiece. */
  tilt?: boolean;
  className?: string;
  /** Constrains the width of each rendered card. */
  cardMaxWidthClass?: string;
}

/**
 * Horizontal, scroll-snap carousel of the user's BiH Puls Cards with pagination
 * dots. Pure CSS scroll-snap keeps mobile swiping buttery smooth; the active
 * index is derived from scroll position so dots stay in sync.
 */
export function PulsCardCarousel({
  cards,
  initialIndex = 0,
  onActiveChange,
  tilt = false,
  className,
  cardMaxWidthClass = "max-w-[220px]",
}: PulsCardCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initialIndex);

  // Jump to the requested card on first mount (without smooth animation).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[initialIndex] as HTMLElement | undefined;
    if (child) el.scrollLeft = child.offsetLeft;
    setActive(initialIndex);
    onActiveChange?.(initialIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex, cards.length]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
    if (idx !== active) {
      setActive(idx);
      onActiveChange?.(idx);
    }
  };

  const scrollTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  };

  if (cards.length === 0) return null;

  const single = cards.length === 1;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className={cn(
          "flex w-full",
          tilt && "[perspective:1100px]",
          single
            ? "justify-center"
            : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 snap-center items-center justify-center px-2 py-6",
              single ? "w-auto" : "w-full",
            )}
          >
            <div
              className={cn(
                "w-full drop-shadow-[0_10px_22px_oklch(0.12_0.06_266_/_42%)]",
                cardMaxWidthClass,
                tilt ? "animate-card-float" : "transition-transform",
              )}
            >
              <PulsCard data={card} />
            </div>
          </div>
        ))}
      </div>

      {!single && (
        <div className="flex justify-center gap-1.5">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Puls Card ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-primary" : "w-2 bg-foreground/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
