import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Home, CalendarDays, BarChart3, Instagram } from "lucide-react";
import { RoundFlag } from "@/components/RoundFlag";
import { cn } from "@/lib/utils";
import { useI18n, type Locale } from "@/lib/i18n";

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "de", flag: "DE", label: "Deutsch" },
  { code: "en", flag: "US", label: "English" },
  { code: "bs", flag: "BA", label: "Bosanski" },
];

/**
 * Top-right language selector: German, US (English), Bosnia. Flags are rimless;
 * the active language is shown by a small gold dot + full opacity (no ring).
 */
function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-2">
      {LANGS.map((l) => {
        const isActive = locale === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-label={l.label}
            aria-pressed={isActive}
            className="flex flex-col items-center gap-1 transition active:scale-90"
          >
            <RoundFlag
              code={l.flag}
              size="sm"
              alt={l.label}
              className={cn("transition", isActive ? "opacity-100" : "opacity-55")}
            />
            <span
              className={cn(
                "h-1 w-1 rounded-full transition-all",
                isActive ? "bg-primary" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function HamburgerMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground/90 transition hover:bg-primary/15 hover:text-primary";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full border border-primary/30 bg-[oklch(0.16_0.1_266_/_60%)] text-primary transition active:scale-90"
      >
        {open ? <X className="h-5 w-5" strokeWidth={2.5} /> : <Menu className="h-5 w-5" strokeWidth={2.5} />}
      </button>

      {open && (
        <div className="glass-card animate-rise absolute right-0 top-12 z-40 w-52 overflow-hidden rounded-2xl p-1.5 shadow-[0_18px_50px_oklch(0_0_0_/_55%)]">
          <Link to="/" className={itemClass} onClick={() => setOpen(false)}>
            <Home className="h-4 w-4 text-primary" /> {t("nav.home")}
          </Link>
          <Link
            to="/"
            hash="matches"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <CalendarDays className="h-4 w-4 text-primary" /> {t("nav.matches")}
          </Link>
          <Link to="/leaderboard" className={itemClass} onClick={() => setOpen(false)}>
            <BarChart3 className="h-4 w-4 text-primary" /> {t("nav.results")}
          </Link>
          <a
            href="https://instagram.com/pulszmajeva"
            target="_blank"
            rel="noreferrer noopener"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <Instagram className="h-4 w-4 text-primary" /> {t("nav.instagram")}
          </a>
        </div>
      )}
    </div>
  );
}

/** Text-only single-line wordmark (no icon/badge). */
function BrandMark() {
  return (
    <Link
      to="/"
      className="flex items-center whitespace-nowrap font-display text-xl tracking-[0.06em]"
    >
      <span className="text-foreground">Puls&nbsp;</span>
      <span className="text-primary">Zmajeva</span>
    </Link>
  );
}

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-gradient-to-b from-[oklch(0.2_0.12_266_/_55%)] to-transparent px-4 py-2.5 backdrop-blur-[6px]">
      <BrandMark />
      <div className="flex items-center gap-2.5">
        <LanguageSelector />
        <HamburgerMenu />
      </div>
    </header>
  );
}
