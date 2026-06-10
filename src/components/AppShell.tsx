import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-[oklch(0.16_0.11_266)]">
      <div className="jersey-bg relative w-full max-w-[480px] overflow-hidden shadow-[0_0_60px_oklch(0_0_0_/_40%)]">
        <div className="jersey-pinstripes" />
        <div className="jersey-jacquard" />
        <div className={cn("relative z-10 flex min-h-[100dvh] flex-col", className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
