import { Link } from "@tanstack/react-router";
import dragonLogo from "@/assets/dragon-logo.png";
import { CircularBosniaFlag } from "@/components/CircularFlag";

/**
 * Bosnia & Herzegovina flag SVG (used inside CircularBosniaFlag for clipping).
 */
export function BosniaFlag({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      role="img"
      aria-label="Zastava Bosne i Hercegovine"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="200" height="100" fill="#1b3fb5" />
      <polygon points="100,0 200,0 200,100" fill="#ffd200" />
      <g fill="#ffffff">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 96 + i * 12.5;
          const y = -3 + i * 12.5;
          const r = 5.2;
          const pts = Array.from({ length: 5 })
            .map((_, k) => {
              const a = (Math.PI / 180) * (-90 + k * 72);
              return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
            })
            .flatMap((p, k) => {
              const a = (Math.PI / 180) * (-90 + k * 72 + 36);
              const inner = `${(x + r * 0.42 * Math.cos(a)).toFixed(1)},${(y + r * 0.42 * Math.sin(a)).toFixed(1)}`;
              return [p, inner];
            })
            .join(" ");
          return <polygon key={i} points={pts} />;
        })}
      </g>
    </svg>
  );
}

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary/15 bg-[oklch(0.2_0.12_266_/_70%)] px-5 py-3 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2.5">
        <img
          src={dragonLogo}
          alt="Puls Zmajeva"
          width={40}
          height={40}
          className="h-9 w-9 shrink-0 drop-shadow-[0_2px_8px_oklch(0.84_0.17_90_/_45%)]"
        />
        <span className="flex flex-col leading-[0.85]">
          <span className="font-display text-base tracking-[0.08em] text-foreground">
            PULS
          </span>
          <span className="font-display text-base tracking-[0.08em] text-primary">
            ZMAJEVA
          </span>
        </span>
      </Link>
      <CircularBosniaFlag size="md" />
    </header>
  );
}
