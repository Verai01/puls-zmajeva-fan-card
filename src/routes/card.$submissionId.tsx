import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toJpeg } from "html-to-image";
import { ArrowLeft, Download, BarChart3, Share2 } from "lucide-react";
import { submissionQuery, matchQuery, submissionsQuery } from "@/lib/queries";
import { AppShell } from "@/components/AppShell";
import { BrandHeader } from "@/components/BrandHeader";
import { PulsCard, BOSNIA_FLAG_URL, type PulsCardData } from "@/components/PulsCard";
import { PulsCardCarousel } from "@/components/PulsCardCarousel";
import { localFlagUrl } from "@/components/RoundFlag";
import { countryByName, countryDisplayName, flagUrl } from "@/lib/data/countries";
import { pulsLabel } from "@/lib/puls";
import { useUserCards } from "@/lib/useUserCards";
import { useI18n } from "@/lib/i18n";
import dragonLogo from "@/assets/dragon-logo.png";
import { toast } from "sonner";

export const Route = createFileRoute("/card/$submissionId")({
  head: () => ({ meta: [{ title: "Tvoja BiH Puls Card · Puls Zmajeva" }] }),
  loader: async ({ context, params }) => {
    const sub = await context.queryClient.ensureQueryData(
      submissionQuery(params.submissionId),
    );
    await Promise.all([
      context.queryClient.ensureQueryData(matchQuery(sub.match_id)),
      context.queryClient.ensureQueryData(submissionsQuery(sub.match_id)),
    ]);
  },
  component: CardPage,
  errorComponent: () => (
    <AppShell>
      <BrandHeader />
      <div className="p-6 text-center text-foreground">
        Card nije pronađena.{" "}
        <Link to="/" className="text-primary underline">
          Nazad
        </Link>
      </div>
    </AppShell>
  ),
});

// Real 9:16 Instagram Story export — exactly 1080x1920, high-quality JPG.
const EXPORT_OPTS = {
  quality: 0.95,
  width: 1080,
  height: 1920,
  pixelRatio: 1,
  cacheBust: true,
  backgroundColor: "#0a0e1f",
} as const;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

async function preloadCardAssets() {
  await Promise.all([dragonLogo, BOSNIA_FLAG_URL].map(preloadImage));
}

function triggerDownload(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}

function CardPage() {
  const { submissionId } = Route.useParams();
  const { data: sub } = useSuspenseQuery(submissionQuery(submissionId));
  const { data: match } = useSuspenseQuery(matchQuery(sub.match_id));
  useSuspenseQuery(submissionsQuery(sub.match_id));
  const { t, locale } = useI18n();
  const { cards: userCards } = useUserCards(locale);
  const exportRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"none" | "download" | "share">("none");
  const [active, setActive] = useState(0);

  // The card from the URL, always available (fallback when the carousel hasn't
  // resolved every submission yet).
  const country = countryByName(sub.country);
  const currentCard: PulsCardData = {
    name: sub.name,
    cityDisplay: sub.city_display,
    countryFlag: country?.flag ?? "🌍",
    countryFlagUrl: localFlagUrl(country?.code) ?? flagUrl(country?.code),
    countryName: countryDisplayName(sub.country, locale),
    opponentName: countryDisplayName(match.opponent_name, locale),
    bihScore: sub.bih_score,
    opponentScore: sub.opponent_score,
    pulsValue: sub.puls_value,
    pulsLabel: pulsLabel(sub.puls_value, locale),
  };

  const cards = userCards.length > 0 ? userCards.map((c) => c.data) : [currentCard];
  const initialIndex = useMemo(() => {
    const i = userCards.findIndex((c) => c.submissionId === submissionId);
    return i >= 0 ? i : 0;
  }, [userCards, submissionId]);

  const exportCard = cards[active] ?? currentCard;
  const fileName = `puls-zmajeva-card-${exportCard.name.toLowerCase().replace(/\s+/g, "-") || "bih"}.jpg`;

  const renderJpeg = async (): Promise<string> => {
    if (!exportRef.current) throw new Error("Card not ready");
    await preloadCardAssets();
    return toJpeg(exportRef.current, EXPORT_OPTS);
  };

  const handleDownload = async () => {
    setBusy("download");
    try {
      const dataUrl = await renderJpeg();
      triggerDownload(dataUrl, fileName);
    } catch {
      toast.error(t("card.downloadError"));
    } finally {
      setBusy("none");
    }
  };

  const handleShare = async () => {
    setBusy("share");
    try {
      const dataUrl = await renderJpeg();
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/jpeg" });
      const nav = navigator as Navigator & {
        canShare?: (d: ShareData) => boolean;
      };
      if (nav.canShare?.({ files: [file] }) && typeof nav.share === "function") {
        await nav.share({
          files: [file],
          title: "Puls Zmajeva",
          text: "Moja BiH Puls Card 🐉 #DREAMBIG #DREAMBIH",
        });
      } else {
        // No native file share — save the JPG and tell the user to post it.
        triggerDownload(dataUrl, fileName);
        toast(t("card.shareFallback"));
      }
    } catch {
      /* user cancelled the native share sheet */
    } finally {
      setBusy("none");
    }
  };

  return (
    <AppShell>
      <BrandHeader />
      <main className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-5 pb-16 pt-4">
        <Link to="/" className="flex w-full items-center gap-1 text-sm font-bold text-ice">
          <ArrowLeft className="h-4 w-4" /> {t("common.home")}
        </Link>

        <h2 className="text-center font-display text-2xl uppercase tracking-wide text-primary">
          {t("card.ready")}
        </h2>

        <div className="w-full max-w-[320px] overflow-visible">
          <PulsCardCarousel
            cards={cards}
            initialIndex={initialIndex}
            onActiveChange={setActive}
            cardMaxWidthClass="max-w-[280px]"
          />
        </div>

        {cards.length > 1 && (
          <p className="-mt-2 text-xs font-semibold uppercase tracking-wide text-ice/70">
            {t("card.swipeHint")}
          </p>
        )}

        <button
          onClick={handleDownload}
          disabled={busy !== "none"}
          className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg uppercase tracking-wide text-primary-foreground gold-glow disabled:opacity-50"
        >
          <Download className="h-5 w-5" strokeWidth={3} />
          {busy === "download" ? t("card.preparing") : t("card.download")}
        </button>

        <button
          onClick={handleShare}
          disabled={busy !== "none"}
          className="inline-flex w-full max-w-[340px] items-center justify-center gap-2 rounded-full border-2 border-primary/70 bg-primary/10 px-6 py-3.5 font-display text-base uppercase tracking-wide text-primary disabled:opacity-50"
        >
          <Share2 className="h-5 w-5" strokeWidth={2.5} />
          {busy === "share" ? t("card.preparing") : t("card.shareInsta")}
        </button>

        <Link
          to="/match/$id"
          params={{ id: match.id }}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ice underline underline-offset-4"
        >
          <BarChart3 className="h-4 w-4" /> {t("card.viewLive")}
        </Link>

        {/* hidden high-res render of the active card for export (1080x1920) */}
        <div
          aria-hidden
          className="pointer-events-none"
          style={{
            position: "fixed",
            top: 0,
            left: -10000,
            width: 1080,
            height: 1920,
            overflow: "visible",
          }}
        >
          <PulsCard ref={exportRef} data={exportCard} className="h-[1920px] w-[1080px]" />
        </div>
      </main>
    </AppShell>
  );
}
