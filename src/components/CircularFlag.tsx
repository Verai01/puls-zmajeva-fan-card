import { cn } from "@/lib/utils";
import { BosniaFlag } from "@/components/BrandHeader";
import { flagUrl } from "@/lib/data/countries";

const SIZE_CLASS = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
} as const;

type FlagSize = keyof typeof SIZE_CLASS;

const ringClass = "ring-1 ring-foreground/15";

/** Circular clipped flag — use everywhere instead of square/rectangular flags. */
export function CircularFlag({
  code,
  emoji,
  size = "sm",
  className,
  alt = "",
}: {
  code?: string | null;
  emoji?: string;
  size?: FlagSize;
  className?: string;
  alt?: string;
}) {
  const dim = SIZE_CLASS[size];

  if (code === "BA") {
    return (
      <span
        className={cn(
          "inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#1b3fb5]",
          ringClass,
          dim,
          className,
        )}
      >
        <BosniaFlag className="h-[145%] w-[145%] max-w-none" />
      </span>
    );
  }

  const url = flagUrl(code);
  if (url) {
    return (
      <img
        src={url}
        alt={alt}
        crossOrigin="anonymous"
        className={cn("shrink-0 rounded-full object-cover", ringClass, dim, className)}
      />
    );
  }

  if (emoji) {
    return (
      <span
        className={cn(
          "inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-base leading-none",
          ringClass,
          dim,
          className,
        )}
      >
        {emoji}
      </span>
    );
  }

  return null;
}

export function CircularBosniaFlag({
  size = "sm",
  className,
}: {
  size?: FlagSize;
  className?: string;
}) {
  return <CircularFlag code="BA" size={size} className={className} alt="BiH" />;
}
