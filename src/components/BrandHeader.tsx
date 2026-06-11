import { Link } from "@tanstack/react-router";
import dragonLogo from "@/assets/dragon-logo.png";
import { RoundFlag } from "@/components/RoundFlag";
import { useI18n } from "@/lib/i18n";

/** Top-right language selector: US (English) left of BiH (Bosnian). */
function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className="rounded-full transition active:scale-95"
      >
        <RoundFlag code="US" size="md" active={locale === "en"} alt="English" />
      </button>
      <button
        type="button"
        onClick={() => setLocale("bs")}
        aria-label="Prebaci na bosanski"
        aria-pressed={locale === "bs"}
        className="rounded-full transition active:scale-95"
      >
        <RoundFlag code="BA" size="md" active={locale === "bs"} alt="Bosanski" />
      </button>
    </div>
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
      <LanguageSelector />
    </header>
  );
}
