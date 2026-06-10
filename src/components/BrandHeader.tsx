import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export function BosniaFlag({ className = "" }: { className?: string }) {
  return (
    <span role="img" aria-label="Zastava Bosne i Hercegovine" className={className}>
      🇧🇦
    </span>
  );
}

export function BrandHeader() {
  return (
    <header className="flex items-center justify-between px-5 pt-5">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground gold-glow">
          <Activity className="h-5 w-5" strokeWidth={3} />
        </span>
        <span className="font-display text-lg leading-none tracking-wide text-foreground">
          PULS <span className="text-primary">ZMAJEVA</span>
        </span>
      </Link>
      <BosniaFlag className="text-2xl" />
    </header>
  );
}
