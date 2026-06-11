import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Home, CalendarDays, BarChart3, Instagram } from "lucide-react";
import dragonLogo from "@/assets/dragon-logo.png";
import { RoundFlag } from "@/components/RoundFlag";
import { useI18n, type Locale } from "@/lib/i18n";

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "de", flag: "DE", label: "Deutsch" },
  { code: "en", flag: "US", label: "English" },
  { code: "bs", flag: "BA", label: "Bosanski" },
];

/** Top-right language selector: German, US (English), Bosnia. */
function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-1.5">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          aria-label={l.label}
          aria-pressed={locale === l.code}
          className="rounded-full transition active:scale-90"
        >
          <RoundFlag code={l.flag} size="sm" active={locale === l.code} alt={l.label} />
        </button>
      ))}
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

/** Premium compact brand mark: dragon badge + tight wordmark. */
function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(0.16_0.1_266)] ring-1 ring-primary/55 shadow-[0_2px_10px_oklch(0.84_0.17_90_/_30%)]">
        <span className="pointer-events-none absolute inset-x-1 top-0.5 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <img
          src={dragonLogo}
          alt="Puls Zmajeva"
          width={32}
          height={32}
          className="h-7 w-7 object-contain drop-shadow-[0_1px_4px_oklch(0.84_0.17_90_/_55%)]"
        />
      </span>
      <span className="flex flex-col leading-[0.82]">
        <span className="font-display text-[1.05rem] tracking-[0.14em] text-foreground">
          PULS
        </span>
        <span className="font-display text-[1.05rem] tracking-[0.14em] text-primary">
          ZMAJEVA
        </span>
      </span>
    </Link>
  );
}

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-primary/15 bg-[oklch(0.18_0.11_266_/_78%)] px-4 py-2.5 backdrop-blur-md">
      <BrandMark />
      <div className="flex items-center gap-2.5">
        <LanguageSelector />
        <HamburgerMenu />
      </div>
    </header>
  );
}
